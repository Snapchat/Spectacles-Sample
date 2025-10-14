// Copyright © 2024 Snap, Inc. All rights reserved.

import Foundation

/**
 Interface between the raw OS output stream and the QLIC runloop
 */
actor TransportWriteEngine: TransportEngine {
    /// Byte counts written to the output stream
    private let bytesWritten = AsyncStream<Int>.makeStream()

    /// Underlying output stream
    let stream: OutputStream
    /// Queue used to protect all stream accesses
    let queue: DispatchSerialQueue

    /// Persistent buffer passed into stream write calls
    private var writeBuffer = Data(count: L2CAPMTU.max)
    /// Index of the first unwritten byte in the buffer
    private var writeBufferStart = 0
    /// Index after the last unwritten byte in the buffer
    private var writeBufferEnd = 0
    /// Pending writes that haven't been copied into the write buffer yet
    private var pendingChunks = [Data]()
    /// Total count of bytes that haven't been written into the stream yet
    private var totalUnwrittenBytes = 0

    /**
     Stream containing counts of all bytes as they are written to the underlying transport

     See ``FlowControlEngine/onRawBytesWritten(count:)``
     */
    nonisolated var bytesWrittenStream: AsyncStream<Int> { bytesWritten.stream }

    init(stream: OutputStream, queue: DispatchSerialQueue) {
        self.stream = stream
        self.queue = queue
    }

    /**
     Queues data for writing.

     Does not wait for the bytes to be fully written to the underlying transport before returning
     */
    func write(data: [Data]) async throws {
        try checkStreamStatus()
        pendingChunks += data
        for chunk in data {
            totalUnwrittenBytes += chunk.count
        }
        await attemptIO()
    }

    /// Issues writes while the stream still has space available
    func attemptIO() async {
        while stream.hasSpaceAvailable, totalUnwrittenBytes > 0 {
            prepareWriteBuffer()
            let count = writeBuffer.withUnsafeBytes {
                stream.write($0.baseAddress! + writeBufferStart, maxLength: writeBufferEnd - writeBufferStart)
            }
            guard count > 0 else { return }
            didWriteData(count: count)
            bytesWritten.continuation.yield(count)
        }
    }

    /// Copies pending chunks into the write buffer before issuing stream writes
    private func prepareWriteBuffer() {
        guard !pendingChunks.isEmpty else { return }

        // If all unwritten bytes fit inside the write buffer space, then copy them in and return
        if writeBufferStart + totalUnwrittenBytes <= writeBuffer.count {
            for chunk in pendingChunks {
                copyIntoWriteBuffer(data: chunk)
            }
            pendingChunks.removeAll()
            return
        }

        // If the write buffer is close to exhaustion, copy the current bytes to the front. This ensures writes are at
        // least as big as the expected MTU, which minimizes the number of write syscalls.
        if writeBuffer.count - writeBufferStart < L2CAPMTU.expected {
            writeBuffer.withUnsafeMutableBytes { bufferPointer in
                bufferPointer.copyMemory(
                    from: UnsafeRawBufferPointer(rebasing: bufferPointer[writeBufferStart ..< writeBufferEnd])
                )
            }
            writeBufferEnd -= writeBufferStart
            writeBufferStart = 0
        }

        // Finally, copy chunks into the write buffer until it's full
        while writeBufferEnd < writeBuffer.count, !pendingChunks.isEmpty {
            let writeBufferSpace = writeBuffer.count - writeBufferEnd
            if writeBufferSpace < pendingChunks[0].count {
                copyIntoWriteBuffer(data: try! pendingChunks[0].dequeueData(count: writeBufferSpace))
            } else {
                copyIntoWriteBuffer(data: pendingChunks.removeFirst())
            }
        }
    }

    /// Helper function to copy data into the write buffer and update the end index.
    private func copyIntoWriteBuffer(data: Data) {
        writeBuffer.replaceSubrange(writeBufferEnd ..< (writeBufferEnd + data.count), with: data)
        writeBufferEnd += data.count
    }

    /// Updates write buffer indices and byte counts after a successful write
    private func didWriteData(count: Int) {
        writeBufferStart += count
        totalUnwrittenBytes -= count
        if writeBufferStart == writeBufferEnd {
            writeBufferStart = 0
            writeBufferEnd = 0
        }
    }
}
