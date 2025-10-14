// Copyright © 2024 Snap, Inc. All rights reserved.

import Foundation

/// Spectacles Mobile Kit Protocol Session
actor SMKPSession: SpectaclesSession {
    let connectionStatusStream: AsyncStream<ConnectionStatus>
    let connectionStatusContinuation: AsyncStream<ConnectionStatus>.Continuation
    let connectionStatusBox = Lock(initialState: ConnectionStatus.connectStart)
    let bluetoothManager: BluetoothManager

    nonisolated var connectionStatus: ConnectionStatus {
        get {
            connectionStatusBox.withLock { $0 }
        }
        set {
            connectionStatusBox.withLock { $0 = newValue }
            connectionStatusContinuation.yield(newValue)
        }
    }

    var streamTask: Task<Void, any Error>?
    var isClosed = false
    var runloop: QLICRunLoop?

    init(bluetoothManager: BluetoothManager) {
        (self.connectionStatusStream, self.connectionStatusContinuation) = AsyncStream.makeStream()
        connectionStatusContinuation.yield(.connectStart)
        self.bluetoothManager = bluetoothManager
    }

    func run(
        bonding: SpectaclesBonding,
        sessionRequest: SessionRequest,
        bondingRespository: BondingRepository,
        delegate: any SpectaclesRequestDelegate
    ) {
        Log.info("Running SMKP session for bonding \(bonding)")
        streamTask = Task {
            repeat {
                do {
                    let channel = try await bluetoothManager.openL2CAPChannel(
                        peripheralId: bonding.identifier.deviceAddress,
                        assignedId: bonding.identifier.assignedId
                    )

                    let runloop = QLICRunLoop(
                        isClient: true,
                        inputStream: channel.value.inputStream,
                        outputStream: channel.value.outputStream,
                        ioQueue: bluetoothManager.queue
                    )
                    self.runloop = runloop

                    let authRepository = await KeychainAuthRepository(
                        bonding: bonding,
                        bondingRepository: bondingRespository
                    )

                    let adapter = SMKPDelegateAdapter(
                        bonding: bonding,
                        sessionRequest: sessionRequest,
                        authRepository: authRepository,
                        runloop: runloop,
                        handlerFactory: { type in try SMKPMessageHandlerFactory.generate(type, delegate) }
                    )

                    connectionStatus = .connected(Metadata(lensId: "", lensVersion: ""))
                    try await adapter.run()
                    Log.info("SMKP session ended gracefully")
                    connectionStatus = .disconnected(.sessionClosed)
                } catch {
                    if Task.isCancelled {
                        Log.info("SMKP session cancelled gracefully")
                        connectionStatus = .disconnected(.sessionClosed)
                    } else {
                        Log.info("SMKP session finished with error \(error)")
                        connectionStatus = .error(error)
                    }
                }
            } while sessionRequest.autoReconnect && !isClosed
        }
    }

    nonisolated func close(reason: CloseReason?) {
        Log.info("User closed SMKP session finished with reason \(String(describing: reason))")
        Task {
            await close(reason: reason)
        }
    }

    func close(reason: CloseReason?) async {
        isClosed = true
        let (errorCode, reason) = switch reason {
        case nil:
            (0, Data())
        case .incompatibleLens:
            (1, "Incompatible Lens".data(using: .utf8) ?? Data())
        }
        await runloop?.close(errorCode: errorCode, reason: reason)
    }
}
