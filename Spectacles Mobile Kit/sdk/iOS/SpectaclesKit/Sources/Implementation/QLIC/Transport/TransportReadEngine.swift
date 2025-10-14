// Copyright © 2024 Snap, Inc. All rights reserved.

import Foundation

/**
 Interface between the raw OS input stream and the QLIC runloop
 */
actor TransportReadEngine: TransportEngine {
    /// Struct containing packet header and payload
    struct Packet {
        let header: Data
        let payload: Data
    }

    /// Byte counts received from the input stream
    private let bytesRead = AsyncStream<Int>.makeStream()

    /// Underlying input stream
    let stream: InputStream
    /// Queue used to protect all stream accesses
    let queue: DispatchSerialQueue

    /// Persistent buffer passed into stream read calls
    private var readBuffer = Data(count: L2CAPMTU.max)
    /// Header of the packet being currently parsed
    private var header = PartialData()
    /// Payload of the packet being currently parsed
    private var payload = PartialData()
    /// Fully parsed packets that haven't been processed by the runloop yet.
    private var packets = [Packet]()

    /**
     Stream containing counts of all bytes as they are read from the underlying transport

     See ``FlowControlEngine/onRawBytesRead(count:)``
     */
    nonisolated var bytesReadStream: AsyncStream<Int> { bytesRead.stream }

    init(stream: InputStream, queue: DispatchSerialQueue) {
        self.stream = stream
        self.queue = queue
    }

    /**
     Tries to read a single packet from the input stream.

     Does not wait for more bytes from the underlying transport if no packet is available.
     */
    func read() throws -> Packet? {
        try checkStreamStatus()
        return packets.isEmpty ? nil : packets.removeFirst()
    }

    /// Reads all available data from the stream
    func attemptIO() async {
        while stream.hasBytesAvailable {
            let count = readBuffer.withUnsafeMutableBytes { bufferPointer in
                stream.read(bufferPointer.baseAddress!, maxLength: bufferPointer.count)
            }
            guard count > 0 else { return }
            handleRead(readBuffer[..<count])
            bytesRead.continuation.yield(count)
        }
    }

    /// Copies recently read data into individual packet buffers
    private func handleRead(_ slice: consuming Data) {
        var slice = consume slice
        while let firstByte = slice.first {
            if header.isEmpty {
                let headerCount = QLICPacketHeader.requiredLength(firstByte: firstByte)
                header.setTotalCount(headerCount)
            }

            if !header.isComplete {
                header.consumeBytes(from: &slice)
                guard header.isComplete else { return }
                let header = try! QLICPacketHeader(bytes: header.data)
                payload.setTotalCount(header.payloadLength)
            }

            if !payload.isComplete {
                payload.consumeBytes(from: &slice)
                guard payload.isComplete else { return }
            }

            packets.append(Packet(header: header.data, payload: payload.data))
            header.reset()
            payload.reset()
        }
    }
}
