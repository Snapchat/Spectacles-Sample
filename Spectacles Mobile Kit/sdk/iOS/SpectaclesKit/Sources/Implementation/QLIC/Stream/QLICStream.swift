// Copyright © 2024 Snap, Inc. All rights reserved.

import Foundation

/**
 Single stream being multiplexed over a QLIC connection.

 All mutable state is implicitly isolated to the parent `StreamEngine`. Accessing that mutable state outside of the engine's isolation context may lead to race conditions and undefined behavior.
 */
final class QLICStream: @unchecked Sendable {
    /// Errors thrown by the stream when trying to read/write in the wrong state
    enum StreamError: Error {
        case streamClosed
        case applicationError(code: Int)
    }

    /// Result of a receive attempt
    enum ReceiveResult: Sendable {
        /// Successfully read content of the requested size, and the stream is still open.
        case success(Data)
        /// Read stream was closed without an error before reaching the minimum incomplete length.
        case closed(Data)
        /// Read stream was closed with an error
        case error(any Error)
    }

    /// Struct representing an outstanding receive attempt
    private struct ReceiveOperation {
        /// Logging identifier for this operation
        let id: Int
        /// Acceptable range of bytes that can be used to complete this receive operation
        let range: ClosedRange<Int>
        /// The promise to yield the result into.
        let promise: Future<ReceiveResult>.Promise
    }

    /// Current state of a stream half
    private enum State {
        /// Open for I/O
        case open
        /// Closed normally
        case closed
        /// Closed by some sort of error
        case error(any Error)
    }

    /// The engine that processes this stream
    let engine: StreamEngine
    /// The stream ID
    let streamId: Int

    // TODO: Add some sort of reusable discontiguous data struct
    /// Data sent by the peer that hasn't been received by the app layer yet
    private var pendingReadData = Data()
    /// Data sent by the app that hasn't been packetized and sent over the wire yet
    private var pendingWriteData = [Data]()

    /// List of pending receive operations
    private var queuedReceives = [ReceiveOperation]()
    /// Id to use for the next receive operation
    private var nextReceiveId = 0

    // TODO: Support unidirectional streams
    /// State of read half of the stream
    private var readState = State.open
    /// State of write half of the stream
    private var writeState = State.open

    /// Returns true if the stream is open or we have pending data
    var canRead: Bool {
        get async {
            await withEngineIsolation { _ in
                switch readState {
                case .open:
                    true
                case .closed:
                    !pendingReadData.isEmpty
                case .error:
                    false
                }
            }
        }
    }

    init(engine: StreamEngine, streamId: Int) {
        self.engine = engine
        self.streamId = streamId
    }

    /// Runs an operation with the engine's isolation
    private func withEngineIsolation<R: Sendable>(handler: @Sendable (isolated StreamEngine) async throws -> R) async rethrows -> R {
        try await handler(engine)
    }

    /// Checks to ensure that we're running synchronous methods with the engine's isolation
    private func preconditionIsolated() {
        if #available(iOS 17.0, *) {
            engine.preconditionIsolated()
        }
    }

    /// Checks if we can have enough bytes to fulfill a receive request
    private func dequeueReceiveResult(receiveId: Int, range: ClosedRange<Int>) -> ReceiveResult? {
        preconditionIsolated()
        if pendingReadData.count > range.upperBound {
            let content = try! pendingReadData.dequeueData(count: range.upperBound)
            Log.debug("[Stream \(streamId)] Fulfilling receive \(receiveId) with max count \(content.count). \(pendingReadData.count) bytes left in queue")
            return .success(content)
        }
        switch readState {
        case .open:
            if pendingReadData.count >= range.lowerBound {
                let content = pendingReadData
                pendingReadData = Data()
                Log.debug("[Stream \(streamId)] Fulfilling receive \(receiveId) with \(content.count) bytes. \(pendingReadData.count) bytes left in queue")
                return .success(content)
            } else {
                Log.debug("[Stream \(streamId)] Pending data insufficient to fulfill receive \(receiveId): \(pendingReadData.count) < \(range.lowerBound)")
                return nil
            }
        case .closed:
            let content = pendingReadData
            pendingReadData = Data()
            if content.count < range.lowerBound {
                Log.debug("[Stream \(streamId)] Fulfilling receive \(receiveId) with short count on closed stream: \(content)")
            } else {
                Log.debug("[Stream \(streamId)] Fulfilling receive \(receiveId) on closed stream: \(content)")
            }
            return .closed(content)
        case let .error(error):
            Log.debug("[Stream \(streamId)] Fulfilling receive \(receiveId) with error: \(error)")
            return .error(error)
        }
    }

    // MARK: - External API

    /**
     Enqueues some data for sending

     Returns immediately once data is appended to internal buffers. Does not wait for the data to be sent over the wire or acknowledged before returning.
     */
    func send(content: Data) async throws {
        try await withEngineIsolation { engine in
            switch writeState {
            case .open:
                pendingWriteData.append(content)
                Log.debug("[Stream \(streamId)] Sending \(content.count) bytes. \(pendingWriteData.reduce(0) { $0 + $1.count }) bytes queued")
                engine.writeStreamHasMoreData(streamId: streamId, bytes: content.count)
            case .closed:
                Log.debug("[Stream \(streamId)] Sending on closed stream")
                throw StreamError.streamClosed
            case let .error(error):
                Log.debug("[Stream \(streamId)] Sending on closed stream with error \(error)")
                throw error
            }
        }
    }

    /**
     Attempts to receive some data
     - parameter range: Range specifying size of data to receive. May be ignored if the connection is closed
     - parameter cancellationErrorCode: The application error code to use when cancelling this receive.

     If `cancellationErrorCode` is set, cancelling a queued receive attempt will close the stream by calling `closeForReading` with the given error code. If nil, then cancellation will be ignored.
     */
    func receive(range: ClosedRange<Int>, cancellationErrorCode: Int? = 499) async -> ReceiveResult {
        await withEngineIsolation { engine in
            let receiveId = nextReceiveId
            nextReceiveId += 1
            Log.debug("[Stream \(streamId)] Receiving data in range \(range) for id: \(receiveId)")
            if queuedReceives.isEmpty, let ret = dequeueReceiveResult(receiveId: receiveId, range: range) {
                return ret
            }

            Log.debug("[Stream \(streamId)] Enqueueing receive operation for id: \(receiveId)")
            let future = Future {
                queuedReceives.append(ReceiveOperation(id: receiveId, range: range, promise: $0))
            }

            if let cancellationErrorCode {
                return await withTaskCancellationHandler {
                    await future.value
                } onCancel: {
                    Task {
                        await closeForReading(applicationErrorCode: cancellationErrorCode)
                    }
                }
            } else {
                return await future.value
            }
        }
    }

    /**
     Closes the stream for reading.

     Pending read data will be discarded and all outstanding receives will fail
     */
    func closeForReading(applicationErrorCode: Int) async {
        await withEngineIsolation { engine in
            if closeForReading(error: StreamError.applicationError(code: applicationErrorCode)) {
                engine.streamDidCloseForReading(streamId: streamId, applicationErrorCode: applicationErrorCode)
            }
        }
    }

    /**
     Closes the stream for writing.

     If an error code is provided, this indicates an abnormal termination and will cause pending writes to be discarded. Otherwise, pending writes will be sent before the stream is fully closed.

     If a stream is closed normally, it can be closed again with an error code to force pending data to be discarded.
     */
    func closeForWriting(applicationErrorCode: Int? = nil) async {
        await withEngineIsolation { engine in
            let error = applicationErrorCode.map { StreamError.applicationError(code: $0) }
            if closeForWriting(error: error) {
                engine.streamDidCloseForWriting(streamId: streamId, applicationErrorCode: applicationErrorCode)
            }
        }
    }

    // MARK: - Engine API

    /// Closes the stream for reading, returning whether the stream engine should be informed
    func closeForReading(error: any Error) -> Bool {
        preconditionIsolated()
        switch readState {
        case .open:
            Log.debug("[Stream \(streamId)] Clearing read buffer on close with error \(error)")
            readState = .error(error)
            pendingReadData.removeAll()
            for receive in queuedReceives {
                Log.debug("[Stream \(streamId)] Fulfilling receive \(receive.id) with error \(error)")
                receive.promise.complete(returning: .error(error))
            }
            queuedReceives.removeAll()
            return true
        case .closed:
            if pendingReadData.isEmpty {
                Log.debug("[Stream \(streamId)] Ignoring close for reading attempt on fully closed stream")
            } else {
                Log.debug("[Stream \(streamId)] Clearing read buffer on close with error \(error)")
                readState = .error(error)
                pendingReadData.removeAll()
            }
            return false
        case .error:
            return false
        }
    }

    /// Closes the stream for writing, returning whether the stream engine should be informed
    func closeForWriting(error: (any Error)?) -> Bool {
        preconditionIsolated()
        switch (writeState, error) {
        case let (.open, .some(error)), let (.closed, .some(error)):
            Log.debug("[Stream \(streamId)] Clearing write buffer on close with error \(error)")
            pendingWriteData.removeAll()
            writeState = .error(error)
            return true
        case (.open, nil):
            Log.debug("[Stream \(streamId)] Closing stream but keeping write buffer")
            writeState = .closed
            return true
        case (.closed, nil), (.error, _):
            return false
        }
    }

    /// Called when an incoming reset stream frame is received
    func onResetStream(applicationErrorCode: Int) {
        preconditionIsolated()
        _ = closeForReading(error: StreamError.applicationError(code: applicationErrorCode))
    }

    /// Called when an incoming stream frame is received
    func onStream(data: Data, fin: Bool) {
        preconditionIsolated()
        pendingReadData += data
        Log.debug("[Stream \(streamId)] Received \(data.count) bytes. Total queued count is \(pendingReadData.count)")
        if fin {
            readState = .closed
        }
        while
            let queuedReceive = queuedReceives.first,
            let result = dequeueReceiveResult(receiveId: queuedReceive.id, range: queuedReceive.range)
        {
            queuedReceive.promise.complete(returning: result)
            queuedReceives.removeFirst()
        }
    }

    /// Called when an ack for previously sent data is received
    func onAck(size: Int, fin: Bool) {
        preconditionIsolated()
    }

    /// Called when an incoming stop sending frame is received
    func onStopSending(applicationErrorCode: Int) {
        preconditionIsolated()
        _ = closeForWriting(error: StreamError.applicationError(code: applicationErrorCode))
    }

    /// Dequeue a certain amount of data for sending
    func dequeuePendingData(maxCount: Int) -> (data: Data, endsOnMessageBoundary: Bool) {
        preconditionIsolated()
        if let first = pendingWriteData.first, first.count > maxCount {
            let data = try! pendingWriteData[0].dequeueData(count: maxCount)
            Log.debug("[Stream \(streamId)] Dequeued \(data.count) bytes to send. Total queued count is \(pendingReadData.count)")
            return (data, false)
        }
        var ret = Data()
        while let first = pendingWriteData.first, ret.count + first.count <= maxCount {
            ret += first
            pendingWriteData.removeFirst()
        }
        Log.debug("[Stream \(streamId)] Dequeued \(ret.count) bytes to send. Total queued count is \(pendingReadData.count)")
        return (ret, true)
    }

    /// Returns whether the stream has any pending data to write
    func hasPendingWriteData() -> Bool {
        preconditionIsolated()
        if case .open = writeState {
            return !pendingWriteData.isEmpty
        }
        return true
    }

    /// Returns whether the stream is closed and has no more pending data
    func isWritingFinished() -> Bool {
        preconditionIsolated()
        if case .open = writeState {
            return false
        }
        return pendingWriteData.isEmpty
    }
}
