// Copyright © 2024 Snap, Inc. All rights reserved.

import CoreBluetooth

/// Default implementation of `CBCentralManagerDelegate` that simply forwards events into the given continuation.
final class DefaultCentralManagerDelegate: NSObject, Sendable {
    /// The queue we expect to receive new events on
    private let queue: DispatchSerialQueue
    /// The continuation to yield delegate events into
    private let continuation: AsyncStream<BluetoothAdapter.DelegateEvent>.Continuation

    init(queue: DispatchSerialQueue, continuation: AsyncStream<BluetoothAdapter.DelegateEvent>.Continuation) {
        self.queue = queue
        self.continuation = continuation
        super.init()
        continuation.onTermination = { _ in
            withExtendedLifetime(self) { }
        }
    }
}

extension DefaultCentralManagerDelegate: CBCentralManagerDelegate {
    func centralManagerDidUpdateState(_ central: CBCentralManager) {
        continuation.yield(.didUpdateState)
    }
    func centralManager(
        _ central: CBCentralManager,
        didDiscover peripheral: CBPeripheral,
        advertisementData: [String: Any],
        rssi RSSI: NSNumber
    ) {
        continuation.yield(.didDiscover(
            peripheralId: peripheral.identifier,
            advertisementData: advertisementData,
            rssi: RSSI
        ))
    }
    func centralManager(_ central: CBCentralManager, didConnect peripheral: CBPeripheral) {
        continuation.yield(.didConnect(peripheralId: peripheral.identifier))
    }
    func centralManager(_ central: CBCentralManager, didFailToConnect peripheral: CBPeripheral, error: (any Error)?) {
        continuation.yield(.didFailToConnect(peripheralId: peripheral.identifier, error: error))
    }
    func centralManager(
        _ central: CBCentralManager,
        didDisconnectPeripheral peripheral: CBPeripheral,
        error: (any Error)?
    ) {
        continuation.yield(.didDisconnect(peripheralId: peripheral.identifier, error: error))
    }
}
