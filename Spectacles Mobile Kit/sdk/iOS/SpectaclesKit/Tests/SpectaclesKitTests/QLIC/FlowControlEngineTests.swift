// Copyright © 2024 Snap, Inc. All rights reserved.

@testable import SpectaclesKit
import XCTest

final class FlowControlEngineTests: XCTestCase {
    var clock: TestClock!
    var engine: FlowControlEngine<TestClock>!
    var txSignal: (stream: AsyncStream<Void>, continuation: AsyncStream<Void>.Continuation)!

    override func setUp() {
        clock = TestClock()
        txSignal = AsyncStream<Void>.makeStream(bufferingPolicy: .bufferingNewest(1))
        engine = FlowControlEngine(clock: clock, txSignal: txSignal.continuation)
    }

    func uncomment_testPacketSizes() {
        let packetAlignment = 1253 // Half of initial estimated transmit size (2506)

        XCTAssert(engine.nextPacketSize == packetAlignment)
        engine.onPacketWritten(isAckSoliciting: true, count: packetAlignment - 1000, ackMetadata: nil)
        XCTAssert(engine.nextPacketSize == packetAlignment + 1000)
        engine.onPacketWritten(isAckSoliciting: true, count: packetAlignment + 1000, ackMetadata: nil)
        XCTAssert(engine.nextPacketSize == packetAlignment)
        engine.onPacketWritten(isAckSoliciting: true, count: packetAlignment, ackMetadata: nil)
        XCTAssert(engine.nextPacketSize == packetAlignment)
        engine.onPacketWritten(isAckSoliciting: true, count: packetAlignment, ackMetadata: nil)
        XCTAssert(engine.nextPacketSize == 0)

        _ = engine.onAckFrame(bytesSinceLastAck: 1000)
        XCTAssert(engine.nextPacketSize == 0)
        _ = engine.onAckFrame(bytesSinceLastAck: 1000)
        XCTAssert(engine.nextPacketSize == 2000)
        _ = engine.onAckFrame(bytesSinceLastAck: 1000)
        XCTAssert(engine.nextPacketSize == 3000 - packetAlignment)
        engine.onPacketWritten(isAckSoliciting: true, count: 3000 - packetAlignment, ackMetadata: nil)
        XCTAssert(engine.nextPacketSize == packetAlignment)
        engine.onPacketWritten(isAckSoliciting: true, count: packetAlignment, ackMetadata: nil)
        XCTAssert(engine.nextPacketSize == 0)
    }

    func testSending() async {
        XCTAssertNil(engine.dequeueAckFrame())
        XCTAssertFalse(engine.shouldSolicitAck)

        clock.now = 30
        XCTAssertNil(engine.dequeueAckFrame())
        XCTAssertTrue(engine.shouldSolicitAck)
        engine.onPacketWritten(isAckSoliciting: true, count: 1, ackMetadata: nil)
        XCTAssertFalse(engine.shouldSolicitAck)

        engine.onRawBytesRead(count: 6)
        engine.onPacketRead(count: 4)
        engine.onAckSolicitingFrame()
        XCTAssertEqual(engine.dequeueAckFrame(), .ack(bytesSinceLastAck: 6))
    }

    /** Uncomment for M3 e2e test */
    func uncomment_testAcks() async {
        engine.onPacketWritten(
            isAckSoliciting: true,
            count: 10,
            ackMetadata: .init(streamFrames: [(streamId: 0, size: 0, fin: true)])
        )

        clock.now = 1
        engine.onPacketWritten(isAckSoliciting: false, count: 10, ackMetadata: nil)
        XCTAssertFalse(engine.hasReachedAckTimeout())

        clock.now = 2
        engine.onPacketWritten(
            isAckSoliciting: true,
            count: 10,
            ackMetadata: .init(streamFrames: [(streamId: 1, size: 0, fin: true)])
        )
        XCTAssertFalse(engine.hasReachedAckTimeout())

        clock.now = 3
        engine.onPacketWritten(
            isAckSoliciting: true,
            count: 10,
            ackMetadata: .init(streamFrames: [(streamId: 2, size: 0, fin: true)])
        )
        XCTAssertFalse(engine.hasReachedAckTimeout())

        clock.now = 5
        XCTAssertTrue(engine.hasReachedAckTimeout())

        XCTAssertEqual(engine.onAckFrame(bytesSinceLastAck: 10).count, 1)
        XCTAssertFalse(engine.hasReachedAckTimeout())

        clock.now = 7
        XCTAssertTrue(engine.hasReachedAckTimeout())
        XCTAssertEqual(engine.onAckFrame(bytesSinceLastAck: 10).count, 0)
        XCTAssertEqual(engine.onAckFrame(bytesSinceLastAck: 13).count, 1)
        XCTAssertFalse(engine.hasReachedAckTimeout())

        clock.now = 8
        XCTAssertTrue(engine.hasReachedAckTimeout())
        XCTAssertEqual(engine.onAckFrame(bytesSinceLastAck: 7).count, 1)
        XCTAssertFalse(engine.hasReachedAckTimeout())

        clock.now = 30
        XCTAssertFalse(engine.hasReachedAckTimeout())
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

    func testSignaling() async {
        engine.onRawBytesRead(count: 10)
        engine.onPacketRead(count: 10)

        clock.now = 30
        await assertReceivedSignal()
        engine.onRawBytesRead(count: 10)
        engine.onPacketRead(count: 10)

        engine.onPacketWritten(isAckSoliciting: true, count: 10, ackMetadata: nil)
        clock.now = 31
        engine.onPacketWritten(isAckSoliciting: true, count: 10, ackMetadata: nil)

        clock.now = 35
        await assertReceivedSignal()

        _ = engine.onAckFrame(bytesSinceLastAck: 10)

        clock.now = 36
        await assertReceivedSignal()
    }
}
