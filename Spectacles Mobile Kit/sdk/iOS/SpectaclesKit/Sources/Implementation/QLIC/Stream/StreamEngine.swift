// Copyright © 2024 Snap, Inc. All rights reserved.

import Foundation

/**
 Creates and handles stream-related frames
 */
actor StreamEngine {
    /**
     Contains stream-related frames with associated ack metadata
     */
    struct SendPayload {
        /// The list of frames to send
        var frames = [QLICFrame]()
        /// How large these frames will be when encoded
        var encodedSize = 0
        /// Metadata about these frames that should be passed back when the enclosing packet is acknowledged
        var ackMetadata = AckMetadata()
    }

    /**
     A summary of the containing ``StreamEngine/SendPayload``s

     Should be passed back to the stream engine when the packet containing the send payload is acknowledged.
     */
    struct AckMetadata {
        /// List of stream frames that were sent.
        var streamFrames = [(streamId: Int, size: Int, fin: Bool)]()
    }

    /// Whether we are acting as the client or server
    private let isClient: Bool

    /// Sink for any incoming streams
    let incomingStreams = AsyncStream<QLICStream>.makeStream()

    /// Upper bits of the next outgoing stream ID to use
    private var nextStreamCounter = 0

    /// Streams that are fully open for reading
    private var activeReadStreams = [Int: QLICStream]()

    /// Streams that the app has closed for reading, but we haven't sent the stop sending frame yet
    private var pendingStopSendingStreams = [Int: Int]()

    /// Streams that are fully open for writing, or have been closed and have pending data
    private var activeWriteStreams = [Int: QLICStream]()

    /// Streams that have been closed for writing with an error, but we haven't sent the reset stream frame yet
    private var pendingResetStreamStreams = [Int: Int]()

    /// Signals the runloop that more data is available and that it should re-attempt tx operations
    private let txSignal: AsyncStream<Void>.Continuation

    init(isClient: Bool, txSignal: AsyncStream<Void>.Continuation) {
        self.isClient = isClient
        self.txSignal = txSignal
    }

    func closeAllStreams(error: any Error) {
        for stream in activeReadStreams.values {
            _ = stream.closeForReading(error: error)
        }
        activeReadStreams.removeAll()
        for stream in activeWriteStreams.values {
            _ = stream.closeForWriting(error: error)
        }
        activeWriteStreams.removeAll()
    }

    // MARK: - Frame Handlers

    // TODO: Log errors on unexpected frames

    /**
     Called after a ``QLICFrame/ack(bytesSinceLastAck:)`` frame is received
     - parameter ackMetadata: List of ``StreamEngine/SendPayload/AckMetadata``s for newly acknowledged packets
     */
    func onAckFrame(ackMetadata: [AckMetadata]) {
        for metadata in ackMetadata {
            for frame in metadata.streamFrames {
                if let stream = activeWriteStreams[frame.streamId] {
                    stream.onAck(size: frame.size, fin: frame.fin)
                } else {
                    Log.notice("[QLIC] Ignoring ack for closed stream \(frame.streamId)")
                }
            }
        }
    }

    /// Called after a ``QLICFrame/resetStream(streamId:applicationErrorCode:)`` frame is received.
    func onResetStreamFrame(streamId: Int, applicationErrorCode: Int) {
        if let stream = activeReadStreams[streamId] {
            Log.notice("[QLIC] Resetting stream \(streamId): \(applicationErrorCode)")
            stream.onResetStream(applicationErrorCode: applicationErrorCode)
            activeReadStreams[streamId] = nil
        } else {
            Log.notice("[QLIC] Ignoring reset stream for closed stream \(streamId)")
        }
    }

    /// Called after a ``QLICFrame/stopSending(streamId:applicationErrorCode:)`` frame is received.
    func onStopSending(streamId: Int, applicationErrorCode: Int) {
        if let stream = activeWriteStreams[streamId] {
            Log.notice("[QLIC] Stopping sending \(streamId): \(applicationErrorCode)")
            stream.onStopSending(applicationErrorCode: applicationErrorCode)
            activeWriteStreams[streamId] = nil
            pendingResetStreamStreams[streamId] = applicationErrorCode
        } else {
            Log.notice("[QLIC] Ignoring stop sending for closed stream \(streamId)")
        }
    }

    /// Called after a ``QLICFrame/stream(streamId:streamData:fin:isLastFrameInPacket:)`` frame is received.
    func onStreamFrame(streamId: Int, streamData: Data, fin: Bool) {
        if let stream = activeReadStreams[streamId] {
            stream.onStream(data: streamData, fin: fin)
            if fin {
                Log.info("[QLIC] Closing stream for \(streamId) on fin received")
                activeReadStreams.removeValue(forKey: streamId)
            }
        } else if pendingStopSendingStreams[streamId] == nil {
            Log.info("[QLIC] Opening new stream for \(streamId) on first frame received")
            // This indicates that the peer is opening a new stream
            let isClientInitiated = StreamId(rawValue: streamId).isClientInitiated
            assert(isClientInitiated != isClient, "Peer can only open streams of opposite type")
            let stream = QLICStream(engine: self, streamId: streamId)
            activeReadStreams[streamId] = stream
            activeWriteStreams[streamId] = stream
            stream.onStream(data: streamData, fin: fin)
            incomingStreams.continuation.yield(stream)
        } else {
            Log.notice("[QLIC] Ignoring stream data for closed stream \(streamId)")
        }
    }

    // MARK: - Stream Callbacks

    // TODO: Inform runloop about updates

    /// Called by streams when they close for reading
    func streamDidCloseForReading(streamId: Int, applicationErrorCode: Int) {
        if activeReadStreams.removeValue(forKey: streamId) != nil {
            Log.info("[QLIC] Closing \(streamId) for reading w/ error \(applicationErrorCode)")
            pendingStopSendingStreams[streamId] = applicationErrorCode
            txSignal.yield()
        } else {
            Log.notice("[QLIC] Received multiple read close requests for \(streamId)")
        }
    }

    /// Called by streams when they close for writing
    func streamDidCloseForWriting(streamId: Int, applicationErrorCode: Int?) {
        if let applicationErrorCode {
            if activeWriteStreams.removeValue(forKey: streamId) != nil {
                Log.info("[QLIC] Closing \(streamId) for writing w/ error \(applicationErrorCode)")
                pendingResetStreamStreams[streamId] = applicationErrorCode
            } else {
                Log.notice("[QLIC] Received multiple read close requests for \(streamId)")
            }
        }
        txSignal.yield()
    }

    /// Called by streams when they queue up more data for writing
    func writeStreamHasMoreData(streamId: Int, bytes: Int) {
        txSignal.yield()
    }

    // MARK: - RunLoop API

    /// Creates a new locally-initiated stream
    func makeStream() -> QLICStream {
        // Bottom 6 bits reserved
        let streamId = StreamId(counter: nextStreamCounter, isClientInitiated: isClient).rawValue
        let stream = QLICStream(engine: self, streamId: streamId)
        activeReadStreams[streamId] = stream
        activeWriteStreams[streamId] = stream
        return stream
    }

    /**
     Gets a list of frames to send
     - parameter maxBytes: The max number of bytes the send payload should contain
     */
    func dequeueDataToSend(maxBytes: Int) throws -> SendPayload? {
        Log.debug("Attempting to dequeue \(maxBytes) bytes of stream data")
        var ret = SendPayload()
        try dequeueFramesToSend(into: &ret, maxBytes: maxBytes)
        return ret.frames.isEmpty ? nil : ret
    }

    /**
     Returns all pending frame streams, including `resetStream`, `stopSending`, and `stream` frames.
     */
    private func dequeueFramesToSend(into payload: inout SendPayload, maxBytes: Int) throws {
        // First send all the stop sending frames
        while let (streamId, applicationErrorCode) = pendingStopSendingStreams.first {
            let frame = QLICFrame.stopSending(streamId: streamId, applicationErrorCode: applicationErrorCode)
            let frameSize = try frame.encodedSize()
            guard frameSize + payload.encodedSize <= maxBytes else {
                Log.notice("[QLIC] Packet size too small to include all stop sending frames: \(frameSize + payload.encodedSize) vs \(maxBytes)")
                return
            }
            payload.frames.append(frame)
            payload.encodedSize += frameSize
            pendingStopSendingStreams[streamId] = nil
        }

        // Next, send the reset stream frames
        while let (streamId, applicationErrorCode) = pendingResetStreamStreams.first {
            let frame = QLICFrame.resetStream(streamId: streamId, applicationErrorCode: applicationErrorCode)
            let frameSize = try frame.encodedSize()
            guard frameSize + payload.encodedSize <= maxBytes else {
                Log.notice("[QLIC] Packet size too small to include all reset stream frames: \(frameSize + payload.encodedSize) vs \(maxBytes)")
                return
            }
            payload.frames.append(frame)
            payload.encodedSize += frameSize
            pendingResetStreamStreams[streamId] = nil
        }

        // Lastly, send stream frames themselves
        var finishedStreamIds = [Int]()
        defer {
            for finishedStreamId in finishedStreamIds {
                activeWriteStreams[finishedStreamId] = nil
            }
        }

        // TODO: Prioritization
        for (streamId, stream) in activeWriteStreams {
            guard stream.hasPendingWriteData() else { continue }

            let headerSize = try 1 + QLICVarInt.encodedSize(of: streamId)
            let remainingSpace = maxBytes - payload.encodedSize - headerSize
            let maxPayload = QLICVarInt.maxVectorSizeEncodable(in: remainingSpace)
            guard maxPayload > 0 else { return }

            let (data, endsOnMessageBoundary) = stream.dequeuePendingData(maxCount: maxPayload)
            let fin = stream.isWritingFinished()
            let frame = QLICFrame.stream(
                streamId: streamId,
                streamData: data,
                fin: fin,
                endsOnMessageBoundary: endsOnMessageBoundary
            )
            let frameSize = try frame.encodedSize()
            payload.frames.append(frame)
            payload.encodedSize += frameSize
            payload.ackMetadata.streamFrames.append((streamId, data.count, fin))

            if fin {
                finishedStreamIds.append(streamId)
            }
        }
    }
}
