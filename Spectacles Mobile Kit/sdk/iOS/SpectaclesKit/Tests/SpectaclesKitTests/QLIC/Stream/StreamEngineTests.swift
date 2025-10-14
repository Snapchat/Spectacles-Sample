// Copyright © 2024 Snap, Inc. All rights reserved.

@testable import SpectaclesKit
import XCTest

final class StreamEngineTests: XCTestCase {
    var txSignal: (stream: AsyncStream<Void>, continuation: AsyncStream<Void>.Continuation)!
    var engine: StreamEngine!
    var stream: QLICStream!

    override func setUp() async throws {
        txSignal = AsyncStream<Void>.makeStream(bufferingPolicy: .bufferingNewest(1))
        engine = StreamEngine(isClient: true, txSignal: txSignal.continuation)
        stream = await engine.makeStream()
    }

    func assertReceivedSignal(line: Int = #line) async {
        let expectation = XCTestExpectation(description: "Expected tx signal: L\(line)")
        let stream = txSignal.stream
        async let _: Void = {
            for await _ in stream {
                expectation.fulfill()
                return
            }
        }()
        await fulfillment(of: [expectation], timeout: 1)
    }

    func testStreamChunksData() async throws {
        try await stream.send(content: Data(count: 250))
        await assertReceivedSignal()
        try await stream.send(content: Data(count: 2500))
        try await stream.send(content: Data(count: 500))
        try await stream.send(content: Data(count: 250))
        await stream.closeForWriting()

        var expectedFrames: [QLICFrame] = [
            // First message can fit in the 1000 byte payload.
            .stream(streamId: stream.streamId, streamData: Data(count: 250), fin: false, endsOnMessageBoundary: true),
            // Second message can't fit in the payload, so it starts a new frame. Each frame has 4 bytes overhead, so we
            // expect two 996 byte chunks and one 508 byte chunk
            .stream(streamId: stream.streamId, streamData: Data(count: 996), fin: false, endsOnMessageBoundary: false),
            .stream(streamId: stream.streamId, streamData: Data(count: 996), fin: false, endsOnMessageBoundary: false),
            .stream(streamId: stream.streamId, streamData: Data(count: 508), fin: false, endsOnMessageBoundary: true),
            // Third and fourth messages both fit inside the 1000 byte payload, and so can be sent in the same frame
            .stream(streamId: stream.streamId, streamData: Data(count: 750), fin: true, endsOnMessageBoundary: true),
        ]
        while let payload = try await engine.dequeueDataToSend(maxBytes: 1000) {
            for frame in payload.frames {
                XCTAssertEqual(frame, expectedFrames.removeFirst())
            }
        }
        XCTAssert(expectedFrames.isEmpty)

        await engine.onStreamFrame(streamId: stream.streamId, streamData: Data(count: 1000), fin: false)
        await engine.onStreamFrame(streamId: stream.streamId, streamData: Data(count: 2000), fin: false)
        await engine.onStreamFrame(streamId: stream.streamId, streamData: Data(count: 3000), fin: true)

        var receivedDataCount = 0
        var isClosed = false
        while !isClosed {
            let result = await stream.receive(range: 300 ... 400)
            switch result {
            case let .success(content):
                XCTAssert(content.count >= 300 && content.count <= 400)
                receivedDataCount += content.count
            case let .closed(content):
                XCTAssert(content.count <= 400)
                receivedDataCount += content.count
                isClosed = true
            case .error:
                XCTFail()
            }
        }
        XCTAssertEqual(receivedDataCount, 6000)
    }

    func testStreamHandlesAppCloseErrors() async throws {
        try await stream.send(content: Data(count: 5000))
        await stream.closeForWriting(applicationErrorCode: 100)
        do {
            try await stream.send(content: Data(count: 10))
            XCTFail("Should throw after closed")
        } catch {}

        if let payload = try await engine.dequeueDataToSend(maxBytes: 1000) {
            XCTAssertEqual(payload.frames, [.resetStream(streamId: stream.streamId, applicationErrorCode: 100)])
        } else {
            throw TestFailureError(reason: "Should have reset stream frame")
        }

        await engine.onStreamFrame(streamId: stream.streamId, streamData: Data(count: 100), fin: false)
        await stream.closeForReading(applicationErrorCode: 100)
        let result = await stream.receive(range: 1 ... 1000)
        guard case .error = result else {
            throw TestFailureError(reason: "Should be closed with error")
        }

        if let payload = try await engine.dequeueDataToSend(maxBytes: 1000) {
            XCTAssertEqual(payload.frames, [.stopSending(streamId: stream.streamId, applicationErrorCode: 100)])
        } else {
            throw TestFailureError(reason: "Should have stop sending frame")
        }
    }

    func testStreamHandlesPeerCloseErrors() async throws {
        try await stream.send(content: Data(count: 5000))
        await engine.onStopSending(streamId: stream.streamId, applicationErrorCode: 100)
        do {
            try await stream.send(content: Data(count: 10))
            XCTFail("Should throw after closed")
        } catch {}

        if let payload = try await engine.dequeueDataToSend(maxBytes: 1000) {
            XCTAssertEqual(payload.frames, [.resetStream(streamId: stream.streamId, applicationErrorCode: 100)])
        } else {
            throw TestFailureError(reason: "Should have reset stream frame")
        }

        await engine.onStreamFrame(streamId: stream.streamId, streamData: Data(count: 100), fin: false)
        await engine.onResetStreamFrame(streamId: stream.streamId, applicationErrorCode: 100)
        let result = await stream.receive(range: 1 ... 1000)
        guard case .error = result else {
            throw TestFailureError(reason: "Should be closed with error")
        }
    }

    func testStreamSendsFinalClose() async throws {
        await stream.closeForWriting()
        await assertReceivedSignal()

        if let payload = try await engine.dequeueDataToSend(maxBytes: 1000) {
            XCTAssertEqual(
                payload.frames,
                [.stream(streamId: stream.streamId, streamData: Data(), fin: true, endsOnMessageBoundary: true)]
            )
        } else {
            throw TestFailureError(reason: "Should have fin frame")
        }
    }
}
