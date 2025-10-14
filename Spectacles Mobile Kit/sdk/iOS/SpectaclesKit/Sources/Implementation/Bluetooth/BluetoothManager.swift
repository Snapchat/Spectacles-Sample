// Copyright © 2024 Snap, Inc. All rights reserved.

import CoreBluetooth

/// Queue-isolated actor that protects access to bluetooth peripherals.
actor BluetoothManager: QueueActor {
    /// Errors thrown when trying to connect a peripheral
    enum BluetoothError: Error {
        case invalidated
        case unsupported
        case unauthorized
        case poweredOff
        case badAdvertisementData
        case peripheralNotFound(peripheralId: UUID)
        case failedToConnect(underlying: (any Error)?)
        case unknownPeripheralState(state: CBPeripheralState)
        case reentrantL2CAPRequest
        case peripheralDisconnected
        case failedToOpenL2CAPChannel(underlying: (any Error)?)
    }

    /// UUID of the spectacles protobuf service
    static let spectaclesServiceUUID = CBUUID(string: "FE45")

    /// Underlying queue
    let queue: DispatchSerialQueue
    /// Wrapped CBCentralManager instance
    private let centralManager: any BluetoothAdapter.CentralManager
    /// Provided delegate events
    private var delegateEvents: AsyncStream<BluetoothAdapter.DelegateEvent>
    /// List of all peripherals that we've retrieved through the adapter
    private var knownPeripherals = [UUID: Peripheral]()

    /// Describes invalidation state of the manager
    private enum InvalidationState {
        /// Manager is processing incoming events.
        case running(Task<Void, Never>)
        /// Manager has been invalidated and can no longer process new events
        case invalidated
    }
    /// Whether the manager has been invalidated or not
    private var invalidationState: InvalidationState
    /// A list of subscriptions to the central manager delegate events.
    private var centralManagerListeners = [UUID: AsyncThrowingStream<BluetoothAdapter.DelegateEvent, any Error>.Continuation]()

    init(adapter: BluetoothAdapter) {
        self.queue = adapter.queue
        self.centralManager = adapter.centralManager
        self.delegateEvents = adapter.delegateEvents
        // We need to use a stream to safely pass `self` into the run task
        let selfStream = AsyncStream<BluetoothManager>.makeStream()
        self.invalidationState = .running(Task {
            for await manager in selfStream.stream {
                await manager.run()
            }
        })
        selfStream.continuation.yield(self)
    }

    private func run() async {
        for await event in delegateEvents {
            if case let .didDisconnect(peripheralId, _) = event {
                knownPeripherals[peripheralId]?.onDisconnect()
            }
            for (_, listener) in centralManagerListeners {
                listener.yield(event)
            }
        }
        invalidationState = .invalidated
        for (_, listener) in centralManagerListeners {
            listener.finish(throwing: BluetoothError.invalidated)
        }
        for (_, peripheral) in knownPeripherals {
            peripheral.onInvalidate()
            centralManager.cancelPeripheralConnection(peripheral.peripheral)
        }
    }

    /// Cancels the run task, disconnecting all peripherals.
    func invalidate() {
        if case let .running(task) = invalidationState {
            task.cancel()
        }
    }

    /// Claims all connected peripherals that use the Spectacles service
    func claimConnectedSpectaclesPeripherals() async throws -> [UUID] {
        guard case .running = invalidationState else { throw BluetoothError.invalidated }
        try await waitForCentralManager()
        let peripherals = centralManager.retrieveConnectedPeripherals(withServices: [Self.spectaclesServiceUUID])
        var ret = [UUID]()
        for peripheral in peripherals {
            guard knownPeripherals[peripheral.identifier] == nil else { continue }
            knownPeripherals[peripheral.identifier] = Peripheral(peripheral: peripheral)
            ret.append(peripheral.identifier)
        }
        return ret
    }

    /// Opens an L2CAP channel for a given peripheral ID. Handles peripheral retrieval and connection.
    func openL2CAPChannel(peripheralId: UUID, assignedId: UUID?) async throws -> UnsafeTransfer<CBL2CAPChannel> {
        guard case .running = invalidationState else { throw BluetoothError.invalidated }
        let psm = try await getPSM(for: peripheralId, assignedId: assignedId)
        let peripheral = try await getPeripheral(for: peripheralId)
        try await ensurePeripheralConnected(peripheral.peripheral)
        return try await peripheral.openL2CAPChannel(manager: self, psm: psm)
    }

    /// Waits for the central manager to become powered on.
    private func waitForCentralManager() async throws {
        guard centralManager.state != .poweredOn else { return }
        Log.info("Waiting for central manager powered on: \(centralManager.state)")

        let uuid = UUID()
        let eventStream = AsyncThrowingStream { centralManagerListeners[uuid] = $0 }
        defer { centralManagerListeners[uuid] = nil }

        while centralManager.state != .poweredOn {
            switch centralManager.state {
            case .unsupported:
                throw BluetoothError.unsupported
            case .unauthorized:
                throw BluetoothError.unauthorized
            case .poweredOff:
                throw BluetoothError.poweredOff
            case .poweredOn:
                return
            case .unknown, .resetting:
                break
            @unknown default:
                break
            }
            for try await case .didUpdateState in eventStream { break }
            try Task.checkCancellation()
        }
        Log.info("Central manager powered on")
    }

    /**
     Retrieves the peripheral for a given identifier.

     First checks the `knownPeripherals` cache for a matching peripheral, and then calls into the central manager if one can't be found
     */
    private func getPeripheral(for peripheralId: UUID) async throws -> Peripheral {
        if let ret = knownPeripherals[peripheralId] { return ret }

        try await waitForCentralManager()
        let storedPeripherals = centralManager.retrievePeripherals(withIdentifiers: [peripheralId])
        guard let storedPeripheral = storedPeripherals.first else {
            Log.error("Unable to find peripheral for id \(peripheralId), bonding is likely invalid")
            throw BluetoothError.peripheralNotFound(peripheralId: peripheralId)
        }

        let ret = Peripheral(peripheral: storedPeripheral)
        knownPeripherals[peripheralId] = ret
        return ret
    }

    /**
     Retrieves the PSM used to connect to a given peripheral.

     Spectacles publishes a single L2CAP PSM, which is included in BLE advertisements.

     The PSM is contained in the service-specific advertising data for the member service UUID belonging to Snapchat (`FE45`). The PSM is the first two bytes of this data in network-byte (big-endian) order.

     After the PSM, the service-specific advertising data may include an additional 16 bytes of UUID data, indicating that Spectacles intends to connect to a specific application. If this UUID does not match the assigned application UUID for this application, the advertisement should be ignored.
     */
    private func getPSM(for peripheralId: UUID, assignedId: UUID?) async throws -> CBL2CAPPSM {
        try await waitForCentralManager()

        let uuid = UUID()
        let eventStream = AsyncThrowingStream { centralManagerListeners[uuid] = $0 }
        defer {
            centralManager.stopScan()
            centralManagerListeners[uuid] = nil
        }

        Log.info("Starting scan for peripheral advertisements matching \(peripheralId), \(String(describing: assignedId))")
        centralManager.scanForPeripherals(withServices: [Self.spectaclesServiceUUID], options: nil)
        for try await event in eventStream {
            switch event {
            case .didUpdateState:
                guard centralManager.state == .poweredOn else {
                    Log.error("Central manager powered off during scan")
                    throw BluetoothError.poweredOff
                }
            case .didDiscover(peripheralId: peripheralId, advertisementData: let advertisementData, rssi: _):
                Log.info("Central manager saw advertisement data for \(peripheralId): \(advertisementData)")
                guard let serviceData = advertisementData[CBAdvertisementDataServiceDataKey] as? [CBUUID: Data] else {
                    Log.error("Advertisement data missing service data")
                    throw BluetoothError.badAdvertisementData
                }
                guard let spectaclesServiceData = serviceData[Self.spectaclesServiceUUID] else {
                    Log.error("Service data missing proto service specific data")
                    throw BluetoothError.badAdvertisementData
                }
                if spectaclesServiceData.count == 18 {
                    if let assignedId {
                        let discoveredId = spectaclesServiceData.withUnsafeBytes {
                            NSUUID(uuidBytes: $0.baseAddress?.advanced(by: 2)) as UUID
                        }
                        guard assignedId == discoveredId else {
                            Log.info("Ignoring advertisement with mismatched assigned id: \(assignedId) vs \(discoveredId)")
                            break
                        }
                    }
                } else if spectaclesServiceData.count != 2 {
                    Log.error("Service data has wrong length \(spectaclesServiceData.count)")
                    throw BluetoothError.badAdvertisementData
                }
                let ret = spectaclesServiceData.withUnsafeBytes {
                    UInt16(bigEndian: $0.loadUnaligned(as: UInt16.self))
                }
                Log.info("Discovered advertisement with PSM \(ret)")
                return ret
            case .didDiscover, .didConnect, .didFailToConnect, .didDisconnect:
                break
            }
        }
        throw CancellationError()
    }

    /// Ensures the peripheral is connected by calling `connect` as appropriate
    private func ensurePeripheralConnected(_ peripheral: CBPeripheral) async throws {
        guard peripheral.state != .connected else { return }

        let uuid = UUID()
        let eventStream = AsyncThrowingStream { centralManagerListeners[uuid] = $0 }
        defer { centralManagerListeners[uuid] = nil }

        switch peripheral.state {
        case .disconnecting:
            Log.info("Peripheral \(peripheral) disconnecting; waiting for disconnection to complete")
            for try await case .didDisconnect(peripheralId: peripheral.identifier, error: _) in eventStream { fallthrough }
            throw CancellationError()
        case .disconnected:
            Log.info("Peripheral \(peripheral) disconnected; reconnecting now")
            try await waitForCentralManager()
            centralManager.connect(peripheral, options: nil)
            fallthrough
        case .connecting:
            for try await event in eventStream {
                switch event {
                case .didConnect(peripheralId: peripheral.identifier):
                    Log.info("Peripheral \(peripheral) successfully connected")
                    return
                case .didFailToConnect(peripheralId: peripheral.identifier, error: let error),
                     .didDisconnect(peripheralId: peripheral.identifier, error: let error):
                    Log.error("Peripheral \(peripheral) connection failed")
                    throw BluetoothError.failedToConnect(underlying: error)
                case .didUpdateState, .didDiscover, .didDisconnect, .didConnect, .didFailToConnect:
                    break
                }
            }
            throw CancellationError()
        case .connected:
            break
        @unknown default:
            Log.notice("Peripheral \(peripheral) in unknown peripheral state")
            throw BluetoothError.unknownPeripheralState(state: peripheral.state)
        }
    }
}
