// Copyright © 2024 Snap, Inc. All rights reserved.

import CryptoKit
@testable import SpectaclesKit
import XCTest

struct TestFailureError: Error {
    let file = #file
    let function = #function
    let line = #line
    let reason: String?

    init(reason: String? = nil) {
        self.reason = reason
    }
}

extension HandshakeEngine {
    var transcriptHash: Data {
        Data(transcriptHasher.finalize())
    }
}

final class HandshakeEngineTests: XCTestCase {
    func testTxBatching() async throws {
        let txSignal = AsyncStream<Void>.makeStream(bufferingPolicy: .bufferingNewest(1))
        let rxSignal = AsyncStream<Void>.makeStream(bufferingPolicy: .bufferingNewest(1))
        let engine = HandshakeEngine(txSignal: txSignal.continuation, rxSignal: rxSignal.continuation)
        let dummyKey = EncryptionEngine.TrafficKey(
            key: SymmetricKey(data: Data(count: 16)),
            iv: SymmetricKey(data: Data(count: 12)),
            securityLevel: .app
        )
        let dummyRecord = HandshakeRecord.keyUpdate(updateRequested: true)
        let dummyRecordData = Data([0x18, 0x01])

        // Test that we start with no TX data or updates
        guard case nil = await engine.getTxStateUpdate() else { throw TestFailureError() }
        guard await !engine.hasMoreCryptoData() else { throw TestFailureError() }
        guard try await engine.dequeueDataToSend().isEmpty else { throw TestFailureError() }

        // Send an initial record to test batching later
        try await engine.sendCryptoFrame(record: dummyRecord, signalsKeyUpdate: false)

        // After a key update frame, we shouldn't send more frames until the key is actually updated
        try await engine.sendCryptoFrame(record: dummyRecord, signalsKeyUpdate: true)
        do {
            try await engine.sendCryptoFrame(record: dummyRecord, signalsKeyUpdate: false)
            XCTFail("Trying to send new crypto frames before key update should throw")
        } catch {}

        // After the key updates, we can continue to send new frames
        try await engine.updateTxKey(dummyKey)
        try await engine.sendCryptoFrame(record: dummyRecord, signalsKeyUpdate: false)

        // The engine should first return both the initial and key update records
        guard case nil = await engine.getTxStateUpdate() else { throw TestFailureError() }
        guard try await engine.dequeueDataToSend() == [dummyRecordData, dummyRecordData] else { throw TestFailureError() }
        guard await engine.hasMoreCryptoData() else { throw TestFailureError() }
        do {
            _ = try await engine.dequeueDataToSend()
            XCTFail("Trying to send frames without processing key update should throw")
        } catch {}

        // After the key update is processed, it should then return the last crypto record.
        guard case .updateKey = await engine.getTxStateUpdate() else { throw TestFailureError() }
        guard try await engine.dequeueDataToSend() == [dummyRecordData] else { throw TestFailureError() }
        guard case nil = await engine.getTxStateUpdate() else { throw TestFailureError() }
        guard try await engine.dequeueDataToSend().isEmpty else { throw TestFailureError() }

        // Ensure that transcript has been updated the whole time
        let transcriptHash = await hexString(engine.transcriptHash)
        /*
         Sent 3 dummy records with encoded data 180101:
         $ echo "180118011801" | xxd -r -p | openssl sha384
         SHA2-384(stdin)= 57be42bc11e802c525db641f9052e26a695fce1fb291dc050518bb8a4a4043c54e38ba0d447211f1f136fc81975ab112
         */
        XCTAssertEqual(
            transcriptHash,
            "57be42bc11e802c525db641f9052e26a695fce1fb291dc050518bb8a4a4043c54e38ba0d447211f1f136fc81975ab112"
        )
    }

    func testRxBatching() async throws {
        let txSignal = AsyncStream<Void>.makeStream(bufferingPolicy: .bufferingNewest(1))
        let rxSignal = AsyncStream<Void>.makeStream(bufferingPolicy: .bufferingNewest(1))
        let engine = HandshakeEngine(txSignal: txSignal.continuation, rxSignal: rxSignal.continuation)
        let dummyKey = EncryptionEngine.TrafficKey(
            key: SymmetricKey(data: Data(count: 16)),
            iv: SymmetricKey(data: Data(count: 12)),
            securityLevel: .app
        )
        let dummyRecord = HandshakeRecord.keyUpdate(updateRequested: true)
        let dummyRecordData = Data([0x18, 0x01])

        // First, ensure that we start in a paused state.
        guard case .pause = await engine.getRxStateUpdate() else { throw TestFailureError() }

        // Then, issue a read and ensure that we transition to the ready state
        async let firstFrame = try engine.receiveCryptoFrame()
        for await _ in rxSignal.stream { break }
        guard case nil = await engine.getRxStateUpdate() else { throw TestFailureError() }

        // Provide the record data, and ensure that we pause again
        try await engine.onCryptoFrame(cryptoData: dummyRecordData)
        guard case .pause = await engine.getRxStateUpdate() else { throw TestFailureError() }
        guard case dummyRecord = try await firstFrame else { throw TestFailureError() }

        // Issue a key update, then a read, and ensure that it's received.
        await engine.updateRxKey(dummyKey)
        async let _ = try engine.receiveCryptoFrame()
        for await _ in rxSignal.stream { break }
        guard case .updateKey(dummyKey) = await engine.getRxStateUpdate() else { throw TestFailureError() }
        guard case nil = await engine.getRxStateUpdate() else { throw TestFailureError() }

        // Ensure that transcript has been updated the whole time
        let transcriptHash = await hexString(engine.transcriptHash)
        /*
         Received 1 dummy record with encoded data 180101:
         $ echo "1801" | xxd -r -p | openssl sha384
         SHA2-384(stdin)= 54d1135f69dff66a110cee11e1774549741c96820fc58566c8c056d2afdf874b38ab0ec4d0c54f5ce9add4b3dc3ed69b
         */
        XCTAssertEqual(
            transcriptHash,
            "54d1135f69dff66a110cee11e1774549741c96820fc58566c8c056d2afdf874b38ab0ec4d0c54f5ce9add4b3dc3ed69b"
        )
    }
}
