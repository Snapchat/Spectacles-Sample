// Copyright © 2024 Snap, Inc. All rights reserved.

public import CoreBluetooth

/// Struct wrapping the CoreBluetooth methods that this SDK uses.
public struct BluetoothAdapter: @unchecked Sendable {
    /**
     Protocol wrapping the subset of `CBCentralManager` methods used by this SDK.

     SpectaclesKit will only invoke these methods on the provided serial queue. It expects exclusive access to all peripherals that it retrieves, and may function improperly if the host app also tries to communicate with those peripherals.
     */
    public protocol CentralManager: AnyObject {
        var state: CBManagerState { get }

        func scanForPeripherals(withServices serviceUUIDs: [CBUUID]?, options: [String: Any]?)
        func stopScan()

        func retrievePeripherals(withIdentifiers identifiers: [UUID]) -> [CBPeripheral]
        func retrieveConnectedPeripherals(withServices serviceUUIDs: [CBUUID]) -> [CBPeripheral]
        func connect(_ peripheral: CBPeripheral, options: [String: Any]?)
        func cancelPeripheralConnection(_ peripheral: CBPeripheral)
    }

    /// Subset of `CBCentralManagerDelegate` events used by this SDK
    public enum DelegateEvent: @unchecked Sendable {
        /// See ``CBCentralManagerDelegate/centralManagerDidUpdateState(_:)``
        case didUpdateState
        /// See ``CBCentralManagerDelegate/centralManager(_:, didDiscover:, advertisementData:, rssi:)``
        case didDiscover(peripheralId: UUID, advertisementData: [String: Any], rssi: NSNumber)
        /// See ``CBCentralManagerDelegate/centralManager(_:, didConnect:)``
        case didConnect(peripheralId: UUID)
        /// See ``CBCentralManagerDelegate/centralManager(_:, didFailToConnect:)``
        case didFailToConnect(peripheralId: UUID, error: (any Error)?)
        /// See ``CBCentralManagerDelegate/centralManager(_:, didDisconnect:)``
        case didDisconnect(peripheralId: UUID, error: (any Error)?)
    }

    /// The underlying central manager instance
    public let centralManager: any CentralManager
    /// An async stream used to provide appropriate delegate events
    public let delegateEvents: AsyncStream<DelegateEvent>
    /// The dispatch queue that the central manager uses for delegate events
    public let queue: DispatchSerialQueue

    public init(
        centralManager: any CentralManager,
        delegateEvents: AsyncStream<DelegateEvent>,
        queue: DispatchSerialQueue
    ) {
        self.centralManager = centralManager
        self.delegateEvents = delegateEvents
        self.queue = queue
    }

    /// Default adaptor that wraps a wholly owned instance of `CBCentralManager`
    public static let defaultInstance: BluetoothAdapter = {
        let queue = DispatchQueue(label: "com.snap.spectacles-kit.bluetooth-central") as! DispatchSerialQueue
        let delegateEvents = AsyncStream<DelegateEvent>.makeStream()
        let delegate = DefaultCentralManagerDelegate(queue: queue, continuation: delegateEvents.continuation)
        let centralManager = CBCentralManager(delegate: delegate, queue: queue)
        return BluetoothAdapter(centralManager: centralManager, delegateEvents: delegateEvents.stream, queue: queue)
    }()
}

extension CBCentralManager: BluetoothAdapter.CentralManager {}
