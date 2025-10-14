// Copyright © 2024 Snap, Inc. All rights reserved.

import CoreBluetooth

extension BluetoothManager {
    /// Wrapper around a `CBPeripheral` that exposes the L2CAP connection method
    final class Peripheral: NSObject {
        /// Underlying `CBPeripheral`
        let peripheral: CBPeripheral
        //// Continuation for the result of any pending L2CAP channel requests.
        var pendingL2CAPChannelRequest: AsyncThrowingStream<UnsafeTransfer<CBL2CAPChannel>, any Error>.Continuation?

        init(peripheral: CBPeripheral) {
            self.peripheral = peripheral
            super.init()
            peripheral.delegate = self
        }

        /// Called to inform the peripheral that it has disconnected.
        func onDisconnect() {
            pendingL2CAPChannelRequest?.finish(throwing: BluetoothError.peripheralDisconnected)
            pendingL2CAPChannelRequest = nil
        }

        /// Called to inform the peripheral that the bluetooth manager has been invalidated.
        func onInvalidate() {
            pendingL2CAPChannelRequest?.finish(throwing: BluetoothError.invalidated)
            pendingL2CAPChannelRequest = nil
        }

        /**
         Tries to open an L2CAP channel.

         Because `peripheral(_: didOpen: error:)` does not tell us what the PSM is for failed connection attempts, we disallow concurrent attempts to open L2CAP channels. This lets us definitively correlate delegate callbacks with open requests.
         */
        func openL2CAPChannel(manager: isolated BluetoothManager, psm: CBL2CAPPSM) async throws -> UnsafeTransfer<CBL2CAPChannel> {
            Log.info("Opening L2CAP channel to \(peripheral) for psm: \(psm)")
            guard pendingL2CAPChannelRequest == nil else { throw BluetoothError.reentrantL2CAPRequest }
            let stream = AsyncThrowingStream { pendingL2CAPChannelRequest = $0 }
            peripheral.openL2CAPChannel(psm)
            for try await ret in stream {
                Log.info("Successfully opened L2CAP channel to \(peripheral) for psm: \(psm)")
                return ret
            }
            throw CancellationError()
        }
    }
}

extension BluetoothManager.Peripheral: CBPeripheralDelegate {
    func peripheral(_ peripheral: CBPeripheral, didOpen channel: CBL2CAPChannel?, error: (any Error)?) {
        defer {
            pendingL2CAPChannelRequest = nil
        }
        guard let channel else {
            pendingL2CAPChannelRequest?.finish(throwing: BluetoothManager.BluetoothError.failedToOpenL2CAPChannel(underlying: error))
            return
        }
        if case .enqueued = pendingL2CAPChannelRequest?.yield(UnsafeTransfer(value: channel)) {
            return
        }
        // TODO: Need to figure out whether we need to manually teardown unused channels, and if so, how
    }
}
