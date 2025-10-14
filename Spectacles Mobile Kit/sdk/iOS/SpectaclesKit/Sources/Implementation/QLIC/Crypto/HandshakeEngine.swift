// Copyright © 2024 Snap, Inc. All rights reserved.

import CryptoKit
import Foundation

/**
 Provides an intermediary between the runloop abstraction used by the QLIC runloop, and a more natural async coroutine abstraction for the handshake function.
 */
actor HandshakeEngine {
    typealias Hasher = SHA384

    /// Errors that the handshake engine can throw
    enum HandshakeError: Error {
        /// The handshake engine has somehow gotten into an invalid state.
        case invalidState(description: String)
        /// A received handshake record was encrypted with wrong keys.
        case insecureRecordReceived
        /// An unexpected handshake record type was received
        case badRecordType(HandshakeRecord?)
        /// A record with invalid parameters was received
        case malformedRecord(HandshakeRecord?)
        /// Authentication failed
        case authenticationFailed(HandshakeRecord?)
    }

    /// Signals a change to the encryption state
    enum StateUpdate {
        /// Pausing encryption/decryption, as we wait for the handshake to determine whether a key update is needed
        case pause
        /// Updates the key
        case updateKey(EncryptionEngine.TrafficKey)
    }

    /// Events sent by the QLIC runloop to the handshake function
    enum InputEvent {
        /// See ``HandshakeEngine/onCryptoFrame(cryptoData:)``
        case cryptoFrame(Data)
        /// See ``HandshakeEngine/requestKeyUpdate()``
        case keyUpdateRequested
    }

    /// Events sent by the handshake function to the QLIC runloop
    private enum OutputEvent {
        case cryptoFrame(data: [Data])
        case updateTxKey(EncryptionEngine.TrafficKey)
    }

    /// Pending input events to be handled by the handshake function
    private let inputEvents = AsyncStream<InputEvent>.makeStream()

    /**
     Queued output events.

     Alternates between key updates and crypto frames.
     */
    private var queuedOutputEvents = [OutputEvent]()

    /**
     Pending frames to be sent

     nil signals that we need to update the TX key before sending more data
     */
    private var pendingFrames: [Data]? = []

    /**
     How many remaining suspends we expect from the handshake function

     If non-zero, the handshake function is still running and may issue rx key updates, so we should avoid decrypting new packets.
     */
    private var pendingSuspends: Int = 1

    /// Pending rx key update
    private var nextRxKeyUpdate: EncryptionEngine.TrafficKey?

    /// Signals the runloop that the handshake TX state has been updated and that it should re-attempt tx operations
    private let txSignal: AsyncStream<Void>.Continuation

    /// Signals the runloop that the handshake RX state has been updated and that it should re-attempt rx operations
    private let rxSignal: AsyncStream<Void>.Continuation

    init(txSignal: AsyncStream<Void>.Continuation, rxSignal: AsyncStream<Void>.Continuation) {
        self.txSignal = txSignal
        self.rxSignal = rxSignal
    }

    // MARK: - Algorithm API

    /// Running hash of all sent and received transcript messages
    var transcriptHasher = Hasher()

    /// Last record that was received. Used for error messages only
    var lastRecord: HandshakeRecord?

    /**
     Called by the handshake function when it wishes to send crypto data.
     - parameter record: The handshake record to send
     - parameter signalsKeyUpdate: If the data signals a key update, then the tx key is invalidated after the packet containing the last byte of the data is sent, and no new data can be sent until the key is updated.

     Handles encoding records to data, updating the transcript hash, and sending the appropriate tx signal.
     */
    func sendCryptoFrame(record: HandshakeRecord, signalsKeyUpdate: Bool = false) throws(QLICError) {
        Log.info("[Handshake] Sending handshake record \(record)")

        guard var frames = pendingFrames else {
            Log.error("[Handshake] Must update tx key after sending a key update record before sending more data")
            throw .cryptoStateError(message: "Must update tx key after sending a key update record before sending more data")
        }
        pendingFrames = nil
        let recordData: Data
        do {
            recordData = try record.encode()
        } catch {
            throw .cryptoError(code: .internalError, reason: "Frame encoding failed", underlying: error)
        }
        transcriptHasher.update(data: recordData)
        frames.append(recordData)
        if signalsKeyUpdate {
            queuedOutputEvents.append(.cryptoFrame(data: frames))
        } else {
            pendingFrames = frames
        }
        txSignal.yield()
    }

    /**
     Updates the tx key.

     Can only be called after sending a crypto frame that signals a key update.
     */
    func updateTxKey(_ key: EncryptionEngine.TrafficKey) throws(QLICError) {
        guard pendingFrames == nil else {
            throw .cryptoStateError(message: "Can only update key immediately following a key update record")
        }
        queuedOutputEvents.append(.updateTxKey(key))
        pendingFrames = []
        txSignal.yield()
    }

    /**
     Receives an input event.

     Between calls to `receiveEvent`, rx packet decryption is disabled in case the handshake function needs to issue an rx key update.
     */
    func receiveEvent() async throws(QLICError) -> InputEvent {
        pendingSuspends -= 1
        if pendingSuspends == 0 {
            Log.info("[Handshake] All previous events consumed. Suspending to wait for new rx events")
            rxSignal.yield()
        }
        for await ret in inputEvents.stream {
            if case .cryptoFrame = ret, nextRxKeyUpdate != nil {
                Log.error("[Handshake] Received record encrypted using wrong rx key")
                throw .cryptoError(
                    code: .unexpectedMessage,
                    reason: "Frame encrypted with wrong key",
                    underlying: HandshakeError.insecureRecordReceived
                )
            }
            Log.info("[Handshake] Received event \(ret)")
            return ret
        }
        throw .cryptoError(code: .userCanceled, reason: "User Cancelled", underlying: CancellationError())
    }

    /**
     Receives a handshake record.

     Handles updating the transcript hash and encoding records to data.
     */
    func receiveCryptoFrame() async throws(QLICError) -> HandshakeRecord {
        guard case let .cryptoFrame(recordData) = try await receiveEvent() else {
            Log.error("[Handshake] Cannot request key update until handshake is complete")
            throw .cryptoStateError(message: "Cannot request key update until handshake is complete")
        }
        return try parseCryptoFrame(recordData)
    }

    func parseCryptoFrame(_ recordData: consuming Data) throws(QLICError) -> HandshakeRecord {
        transcriptHasher.update(data: recordData)
        let record: HandshakeRecord
        do {
            record = try HandshakeRecord.dequeueRecord(from: &recordData)
        } catch {
            throw .cryptoError(code: .decodeError, reason: "Decode failed", underlying: error)
        }
        guard recordData.isEmpty else {
            Log.error("[Handshake] Record \(record) contained unused trailing data \(recordData)")
            throw .cryptoError(
                code: .decodeError,
                reason: "Extra trailing data found",
                underlying: HandshakeError.malformedRecord(record)
            )
        }
        lastRecord = record
        return record
    }

    /**
     Updates the rx key.
     */
    func updateRxKey(_ key: EncryptionEngine.TrafficKey) {
        nextRxKeyUpdate = key
    }

    // MARK: Engine API

    /**
     Checks whether there are any updates to the tx encryptor state.

     Should be called before attempting to encrypt any new packets
     */
    func getTxStateUpdate() -> StateUpdate? {
        if case let .updateTxKey(key) = queuedOutputEvents.first {
            queuedOutputEvents.removeFirst()
            return .updateKey(key)
        }
        return queuedOutputEvents.isEmpty && pendingFrames == nil ? .pause : nil
    }

    /**
     Checks whether there are any updates to the rx encryptor state.

     Should be called before attempting to decrypt any new packets
     */
    func getRxStateUpdate() -> StateUpdate? {
        if pendingSuspends > 0 {
            return .pause
        } else if let ret = nextRxKeyUpdate {
            nextRxKeyUpdate = nil
            return .updateKey(ret)
        } else {
            return nil
        }
    }

    /// Whether there is any queued crypto data to send.
    func hasMoreCryptoData() -> Bool {
        // First check queued output events for crypto data
        switch queuedOutputEvents.first {
        case nil:
            break
        case .cryptoFrame:
            return true
        case .updateTxKey:
            if queuedOutputEvents.count > 1 {
                return true
            }
        }
        // Then check pending frames
        return pendingFrames?.isEmpty == false
    }

    /// Dequeues a list of crypto frames to send
    func dequeueDataToSend() throws(QLICError) -> [Data] {
        switch queuedOutputEvents.first {
        case nil:
            break
        case let .cryptoFrame(ret):
            queuedOutputEvents.removeFirst()
            return ret
        case .updateTxKey:
            throw .cryptoStateError(message: "Must process tx state update before sending more data")
        }
        guard let ret = pendingFrames else {
            throw .cryptoStateError(message: "Must process tx state update before sending more data")
        }
        pendingFrames = []
        return ret
    }

    /// Called when a new ``QLICFrame/crypto(cryptoData:)`` frame is received
    func onCryptoFrame(cryptoData: Data) throws(QLICError) {
        pendingSuspends += 1
        guard case .enqueued = inputEvents.continuation.yield(.cryptoFrame(cryptoData)) else {
            throw .cryptoCancellationError()
        }
    }

    /// Called when the encrypted packet engine requests a key update due to IV exhaustion
    func requestKeyUpdate() throws(QLICError) {
        pendingSuspends += 1
        guard case .enqueued = inputEvents.continuation.yield(.keyUpdateRequested) else {
            throw .cryptoCancellationError()
        }
    }

    func unexpectedCryptoRecordError(_ expectedRecordType: String) -> QLICError {
        .cryptoError(
            code: .unexpectedMessage,
            reason: "Expected \(expectedRecordType)",
            underlying: HandshakeError.badRecordType(lastRecord)
        )
    }
}

extension QLICError {
    static func cryptoStateError(message: String) -> QLICError {
        let underlying = HandshakeEngine.HandshakeError.invalidState(description: message)
        return .cryptoError(code: .internalError, reason: "Internal State Error", underlying: underlying)
    }

    static func cryptoCancellationError() -> QLICError {
        return .cryptoError(code: .userCanceled, reason: "User Cancelled", underlying: CancellationError())
    }
}
