// Copyright © 2024 Snap, Inc. All rights reserved.

import Foundation

/**
 Object responsible for coordinating messages between the underlying transports and various engines.

 The various engines emit send and receive signals to the runloop. The runloop then invokes the send and receive methods as appropriate.
 */
actor QLICRunLoop {
    enum RunloopError: Error {
        case timeout
        case handshakeIncomplete
        case connectionClosed(errorCode: Int, reason: Data)
        case serverRoleUnsupported
        case internalStateError
    }

    /// State of the connection
    enum State {
        /// Connection is still open
        case open

        /// Connection is closing due to a local error but hasn't yet sent the close frame
        case closePending(QLICError)

        /// Connection has sent a close frame and is waiting for the peer to close the L2CAP channel
        case closeSent(QLICError)

        /// Connection closed after close frames were successfully exchanged
        case closed(QLICError)

        /// Connection aborted without successfully exchanging close frames
        case aborted(any Error)

        var closeError: (any Error)? {
            switch self {
            case .open:
                return nil
            case let .closePending(error), let .closeSent(error), let .closed(error):
                return error
            case let .aborted(error):
                return error
            }
        }

        var isFullyClosed: Bool {
            switch self {
            case .open, .closePending, .closeSent: false
            case .closed, .aborted: true
            }
        }
    }

    let txSignal = AsyncStream<Void>.makeStream(bufferingPolicy: .bufferingNewest(1))
    let rxSignal = AsyncStream<Void>.makeStream(bufferingPolicy: .bufferingNewest(1))

    let isClient: Bool
    let readEngine: TransportReadEngine
    let writeEngine: TransportWriteEngine
    let handshakeEngine: HandshakeEngine
    let streamEngine: StreamEngine
    var encryptionEngine = EncryptionEngine()
    var flowControlEngine: FlowControlEngine<MachAbsoluteClock>

    var isReading = false
    var isWriting = false
    var hasPendingRead = false

    /// Current connection state
    var state = State.open
    var runTask: Task<Void, Never>?
    var closeTimeoutTask: Task<Void, Never>?

    init(
        isClient: Bool = true,
        inputStream: sending InputStream,
        outputStream: sending OutputStream,
        ioQueue: DispatchSerialQueue
    ) {
        self.isClient = isClient
        self.readEngine = TransportReadEngine(stream: inputStream, queue: ioQueue)
        self.writeEngine = TransportWriteEngine(stream: outputStream, queue: ioQueue)
        self.handshakeEngine = HandshakeEngine(txSignal: txSignal.continuation, rxSignal: rxSignal.continuation)
        self.streamEngine = StreamEngine(isClient: isClient, txSignal: txSignal.continuation)
        self.flowControlEngine = FlowControlEngine(clock: MachAbsoluteClock(), txSignal: txSignal.continuation)
    }

    func run() async throws {
        runTask = Task {
            await withThrowingTaskGroup(of: Void.self) { group in
                async let _: Void = self.consumeReadEngineSignals()
                async let _: Void = self.runReading()
                async let _: Void = self.runWriting()

                group.addTask {
                    try await self.readEngine.run()
                }
                group.addTask {
                    try await self.writeEngine.run()
                }
                do {
                    try await group.next()
                    if !state.isFullyClosed {
                        Log.error("[QLIC] Force closing after I/O cancelled without going through close engine")
                        await self.abort(error: RunloopError.internalStateError)
                    }
                } catch {
                    await self.handleIOError(error)
                }
                group.cancelAll()
            }
            Log.info("[QLIC] Runloop exiting")
        }
        await withTaskCancellationHandler {
            await runTask?.value
        } onCancel: {
            forceClose(error: CancellationError())
        }
    }

    func runHandshake(
        authVerifiers: [any HandshakeAuthVerifier],
        authProviders: [any HandshakeAuthProvider]
    ) async {
        guard isClient else {
            await abort(error: RunloopError.serverRoleUnsupported)
            return
        }
        do throws(QLICError) {
            try await handshakeEngine.runClientHandshake(
                authVerifiers: authVerifiers,
                authProviders: authProviders
            )
        } catch {
            await close(error: error)
        }
    }

    // MARK: - Closing

    /// Attempts to close the connection with the given error after sending an application close frame
    nonisolated func close(errorCode: Int, reason: Data) {
        Task {
            await close(error: .localAppError(code: errorCode, reason: reason))
        }
    }

    /// Forcibly and immediately aborts the connection
    nonisolated func forceClose(error: any Error) {
        Task {
            await abort(error: error)
        }
    }

    /// Updates all engines when the run loop state changes
    private func updateState(_ newState: State) async {
        if state.closeError == nil, let error = newState.closeError {
            await streamEngine.closeAllStreams(error: error)
        }
        if !state.isFullyClosed, newState.isFullyClosed {
            closeTimeoutTask?.cancel()
            closeTimeoutTask = nil
            runTask?.cancel()
            runTask = nil
            txSignal.continuation.finish()
            rxSignal.continuation.finish()
        } else {
            txSignal.continuation.yield()
        }
        state = newState
    }

    /// Attempts to close the connection with the given error after sending a close frame
    private func close(error: QLICError) async {
        guard case .open = state else {
            Log.info("[QLIC] Ignoring redundant close with error \(error)")
            return
        }
        Log.error("[QLIC] Closing connection with error \(error)")
        await updateState(.closePending(error))
        closeTimeoutTask = Task {
            do {
                try await Task.sleep(nanoseconds: 5 * NSEC_PER_SEC)
                Log.error("[QLIC] Connection close attempt timed out after 5s, force closing now")
                await abort(error: RunloopError.timeout)
            } catch {}
        }
    }

    func abort(error: any Error) async {
        switch state {
        case .open, .closePending, .closeSent:
            Log.error("[QLIC] Force closing connection with error \(error)")
            await updateState(.aborted(error))
        case .closed, .aborted:
            Log.info("[QLIC] Ignoring redundant close due to \(error)")
        }
    }

    /// Informs the engine that the l2cap channel has closed
    private func handleIOError(_ error: any Error) async {
        switch state {
        case .open, .closePending:
            Log.error("[QLIC] Encountered unexpected I/O error \(error)")
            await updateState(.aborted(error))
        case let .closeSent(error):
            Log.info("[QLIC] Encountered I/O error \(error) after close frame sent")
            await updateState(.closed(error))
        case .closed, .aborted:
            Log.info("[QLIC] Encountered I/O error \(error) after connection already closed")
        }
    }

    // MARK: - IO

    private func consumeReadEngineSignals() async {
        for await bytesRead in readEngine.bytesReadStream {
            flowControlEngine.onRawBytesRead(count: bytesRead)
            rxSignal.continuation.yield()
        }
    }

    private func runWriting() async {
        for await _ in txSignal.stream {
            if flowControlEngine.hasReachedAckTimeout() {
                Log.error("[QLIC] Timed out waiting for frame acknowledgement")
                await close(error: .localProtocolError(
                    code: .flowControlError,
                    frameType: 0,
                    reason: "Ack timeout",
                    underlying: RunloopError.timeout
                ))
            }
            guard !isReading else {
                Log.debug("[QLIC] Ignoring write signal because we're already reading")
                continue
            }
            isWriting = true
            defer {
                isWriting = false
                if hasPendingRead {
                    hasPendingRead = false
                    rxSignal.continuation.yield()
                }
            }
            do {
                while try await tryWriting() {}
            } catch {
                Log.error("[QLIC] Saw write error \(error). Terminating connection")
                await abort(error: error)
                return
            }
        }
        if !state.isFullyClosed {
            Log.error("[QLIC] Writing cancelled without going through close engine, force closing")
            await abort(error: RunloopError.internalStateError)
        }
    }

    private func runReading() async {
        for await _ in rxSignal.stream {
            if isWriting {
                Log.debug("[QLIC] Ignoring read signal because we're already writing")
                hasPendingRead = true
                continue
            }
            isReading = true
            defer {
                isReading = false
                txSignal.continuation.yield()
            }
            do {
                while try await tryReading() {}
            } catch {
                Log.error("[QLIC] Saw read error \(error). Attempting to send close frame")
                await close(error: error)
                return
            }
        }
        if case .open = state {
            Log.notice("[QLIC] Reading cancelled without going through close engine. Attempting to send close frame")
            await close(error: .localProtocolError(
                code: .internalError,
                frameType: 0,
                reason: "Internal state error",
                underlying: RunloopError.internalStateError
            ))
        }
    }

    private func tryWriting() async throws -> Bool {
        Log.debug("[QLIC] Attempting to write")
        // First, check the handshake state to see if we have valid tx keys.
        switch await handshakeEngine.getTxStateUpdate() {
        case .pause:
            if case .closePending = state {
                Log.error("[QLIC] Unable to sent close frame as tx key is unavailable")
                throw RunloopError.handshakeIncomplete
            } else {
                Log.debug("[QLIC] Writing paused for tx key unavailable")
            }
            return false
        case let .updateKey(trafficKey):
            Log.debug("[QLIC] Updating tx key")
            encryptionEngine.updateTxKey(trafficKey)
        case nil:
            break
        }

        switch state {
        case .open:
            break
        case let .closePending(closeError):
            let frame = closeError.closeFrame
            Log.debug("[QLIC] Encoding frame \(frame)")
            try await writePayload(frame.encode())
            return false
        case .closeSent, .closed, .aborted:
            return false
        }

        // Then, check the flow control engine to see if we can send or not.
        let maxPacketSize = flowControlEngine.nextPacketSize
        let maxPayloadSize = encryptionEngine.maxUnencryptedPayloadSize(packetPayloadSize: QLICPacketHeader.maxPayloadLength(packetSize: maxPacketSize))
        guard maxPayloadSize > 0 else {
            Log.debug("[QLIC] Flow control above send limits, skipping write")
            return false
        }

        // Now that we know we can send a packet, pre-allocate the payload
        var payload = Data()
        payload.reserveCapacity(maxPayloadSize)
        var isAckSoliciting = false
        var ackMetadata: StreamEngine.AckMetadata? = nil

        // Add in handshake frames first as these are always max priority
        let handshakeData = try await handshakeEngine.dequeueDataToSend()
        for cryptoData in handshakeData {
            let frame = QLICFrame.crypto(cryptoData: cryptoData)
            Log.debug("[QLIC] Encoding frame \(frame)")
            try frame.encode(into: &payload)
            isAckSoliciting = true
        }

        /* Uncomment for M3 e2e test */
        // Add the ack frame to refund flow control credit
//        if let frame = flowControlEngine.dequeueAckFrame() {
//            Log.debug("[QLIC] Encoding frame \(frame)")
//            try frame.encode(into: &payload)
//        }

        // If we have a fully secure channel, we can send stream data
        if encryptionEngine.txSecurityLevel.isAppDataPermitted {
            // If the handshake is secure, we can now send stream frames
            if let sendPayload = try await streamEngine.dequeueDataToSend(maxBytes: maxPayloadSize - payload.count) {
                for frame in sendPayload.frames {
                    Log.debug("[QLIC] Encoding frame \(frame)")
                    try frame.encode(into: &payload)
                }
                isAckSoliciting = true
                ackMetadata = sendPayload.ackMetadata
            }
        }

        /* Uncomment for M3 e2e test */
//        // If we don't have any other ack-soliciting frames, we now optionally add a ping frame
//        if !isAckSoliciting, flowControlEngine.shouldSolicitAck {
//            Log.debug("[QLIC] Encoding ping")
//            try QLICFrame.ping.encode(into: &payload)
//            isAckSoliciting = true
//        }

        // If the payload isn't empty, construct a packet, encrypt, and send
        guard !payload.isEmpty else {
            Log.debug("[QLIC] No frames to send, skipping packet write")
            return false
        }

        Log.debug("[QLIC] Sending packet with payload: \(payload)")
        let totalPacketSize = try await writePayload(payload)
        if totalPacketSize > maxPacketSize {
            Log.notice("[QLIC] Sent oversized packet: \(totalPacketSize) > \(maxPacketSize)")
        } else {
            Log.debug("[QLIC] Sent \(totalPacketSize) byte packet")
        }

        // Check to see if we need a key update
        if encryptionEngine.shouldUpdateKey {
            try await handshakeEngine.requestKeyUpdate()
        }

        // Lastly, tell the flow control engine about the written packet
        flowControlEngine.onPacketWritten(
            isAckSoliciting: isAckSoliciting,
            count: totalPacketSize,
            ackMetadata: ackMetadata
        )
        return true
    }

    @discardableResult
    private func writePayload(_ payload: Data) async throws -> Int {
        let packetPayloadSize = encryptionEngine.packetPayloadSize(for: payload.count)
        let header = try QLICPacketHeader(payloadLength: packetPayloadSize).encode()
        let packet = try encryptionEngine.seal(payload: payload)
        try await writeEngine.write(data: [header])
        try await writeEngine.write(data: packet)
        return packet.reduce(header.count) { $0 + $1.count }
    }

    private func tryReading() async throws(QLICError) -> Bool {
        Log.debug("[QLIC] Attempting to read")
        // First, check the handshake engine to see if we have valid rx keys
        switch await handshakeEngine.getRxStateUpdate() {
        case .pause:
            Log.debug("[QLIC] Reading paused for tx key unavailable")
            return false
        case let .updateKey(trafficKey):
            Log.debug("[QLIC] Updating rx key")
            encryptionEngine.updateRxKey(trafficKey)
        case nil:
            break
        }

        // Then, read a packet and inform the flow control engine
        guard let packet = try? await readEngine.read() else {
            Log.debug("[QLIC] No new packets available")
            return false
        }
        let packetSize = packet.header.count + packet.payload.count
        Log.debug("[QLIC] Read \(packetSize) byte packet")
        flowControlEngine.onPacketRead(count: packetSize)

        // Decrypt the packet payload
        var payload = try encryptionEngine.open(payload: packet.payload)
        let isAppDataPermitted = encryptionEngine.rxSecurityLevel.isAppDataPermitted
        Log.debug("[QLIC] Decrypted packet payload: \(payload)")

        // Check to see if we need a key update
        if encryptionEngine.shouldUpdateKey {
            try await handshakeEngine.requestKeyUpdate()
        }

        // Dequeue frames one by one from the payload, and forward them to the various engines
        while !payload.isEmpty {
            let frame = try QLICFrame.dequeueFrame(from: &payload)
            if frame.hasAppData {
                if !isAppDataPermitted {
                    Log.error("[QLIC] Received illegal app data frame \(frame) before handshake is complete")
                    throw .cryptoError(
                        code: .unexpectedMessage,
                        reason: "Received app data before handshake complete",
                        underlying: RunloopError.handshakeIncomplete
                    )
                } else if state.closeError != nil {
                    Log.debug("[QLIC] Ignoring app data frame \(frame) after connection is closed")
                    continue
                }
            }
            Log.debug("[QLIC] Decoded frame \(frame)")
            if frame.isAckSoliciting {
                flowControlEngine.onAckSolicitingFrame()
            }
            switch frame {
            case .padding, .ping:
                break
            case let .ack(bytesSinceLastAck: bytesSinceLastAck):
                let ackMetadata = flowControlEngine.onAckFrame(bytesSinceLastAck: bytesSinceLastAck)
                await streamEngine.onAckFrame(ackMetadata: ackMetadata)
            case let .crypto(cryptoData: cryptoData):
                try await handshakeEngine.onCryptoFrame(cryptoData: cryptoData)
            case let .resetStream(streamId: streamId, applicationErrorCode: applicationErrorCode):
                await streamEngine.onResetStreamFrame(streamId: streamId, applicationErrorCode: applicationErrorCode)
            case let .stopSending(streamId: streamId, applicationErrorCode: applicationErrorCode):
                await streamEngine.onStopSending(streamId: streamId, applicationErrorCode: applicationErrorCode)
            case let .stream(streamId: streamId, streamData: streamData, fin: fin, endsOnMessageBoundary: _):
                await streamEngine.onStreamFrame(streamId: streamId, streamData: streamData, fin: fin)
            case let .protocolConnectionClose(protocolErrorCode: protocolErrorCode, frameType: frameType, reason: reason):
                Log.error("[QLIC] Closing connection on protocol close frame received: \(protocolErrorCode), \(frameType), \(reason)")
                await updateState(.closed(.remoteProtocolError(
                    code: protocolErrorCode,
                    frameType: frameType,
                    reason: reason
                )))
                return false
            case let .applicationConnectionClose(applicationErrorCode: applicationErrorCode, reason: reason):
                Log.error("[QLIC] Closing connection on application close frame received: \(applicationErrorCode), \(reason)")
                await updateState(.closed(.remoteAppError(code: applicationErrorCode, reason: reason)))
                return false
            }
        }
        return true
    }
}
