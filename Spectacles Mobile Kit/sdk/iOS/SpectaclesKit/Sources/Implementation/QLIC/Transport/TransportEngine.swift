// Copyright © 2024 Snap, Inc. All rights reserved.

import Foundation

/**
 Protocol containing shared logic between read and write engines.

 Contains extensions that provide queue-based synchronization, stream scheduling, and error handling.
 */
protocol TransportEngine: QueueActor {
    /// The underlying stream type for the engine
    associatedtype StreamType: Stream
    /// The underlying stream
    var stream: StreamType { get }

    /// Callback indicating that the stream may be ready for additional IO operations
    func attemptIO() async
}

/// Simple delegate that yields stream delegate events into an async stream.
private final class StreamDelegateImpl: NSObject, StreamDelegate {
    let streamEvents = AsyncStream<Stream.Event>.makeStream()

    func stream(_: Stream, handle eventCode: Stream.Event) {
        streamEvents.continuation.yield(eventCode)
    }
}

extension TransportEngine {
    /// Opens the stream, processes incoming delegate events, and closes the stream when done
    func run() async throws {
        let delegate = StreamDelegateImpl()
        stream.delegate = delegate
        try stream.setQueue(queue)
        Log.info("Transport engine opening stream \(stream)")
        stream.open()
        defer {
            stream.close()
            try? stream.setQueue(nil)
            stream.delegate = nil
            withExtendedLifetime(delegate) {}
        }

        for await event in delegate.streamEvents.stream {
            if event.contains(.openCompleted) {
                Log.info("Stream \(stream) open completed")
                await attemptIO()
            }
            if event.contains(.hasBytesAvailable) || event.contains(.hasSpaceAvailable) {
                await attemptIO()
            }
            if event.contains(.errorOccurred) {
                Log.error("Stream closed with error: \(String(describing: stream.streamError))")
                throw stream.streamError ?? Stream.UnexpectedError.unexpectedEvent(event)
            }
            if event.contains(.endEncountered) {
                Log.info("Stream encountered end")
                throw Stream.UnexpectedError.unexpectedEvent(event)
            }
        }
    }

    /// Throws an error if the stream is unexpectedly closed
    func checkStreamStatus() throws {
        switch stream.streamStatus {
        case .notOpen, .opening, .open, .reading, .writing:
            return
        case .atEnd, .closed, .error:
            fallthrough
        @unknown default:
            throw stream.streamError ?? Stream.UnexpectedError.unexpectedStatus(stream.streamStatus)
        }
    }
}
