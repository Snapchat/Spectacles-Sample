package com.snap.spectacles.kit.stream.l2cap

import android.Manifest
import android.bluetooth.BluetoothDevice
import android.bluetooth.BluetoothManager
import android.bluetooth.le.ScanCallback
import android.bluetooth.le.ScanFilter
import android.bluetooth.le.ScanResult
import android.bluetooth.le.ScanSettings
import android.content.Context
import android.os.Build
import android.os.ParcelUuid
import androidx.annotation.RequiresApi
import androidx.annotation.RequiresPermission
import com.snap.spectacles.kit.stream.SpectaclesStreamAddress
import com.snap.spectacles.kit.stream.SpectaclesStreamDiscovery
import com.snap.spectacles.kit.util.Log
import java.nio.ByteBuffer
import java.nio.ByteOrder
import java.util.UUID

private const val TAG = "SpectaclesL2capServiceDiscovery"

/**
 * A scanner class for discovering Protocol/Service Multiplexers (PSMs) on a specified BLE device.
 *
 * This class is used to identify specific PSMs available on a Spectacles, which can be used to establish
 * communication channels. It provides methods to start and stop the PSM scanning process, along with
 * callbacks for handling success and failure scenarios.
 *
 * @param context The Android [Context] used for accessing Bluetooth-related system services.
 * @param identity A [ByteArray] used to uniquely identify the specific services on the device.
 * @param onFound A [Consumer] callback that is invoked when a PSM is successfully found.
 * @param onFailed A [Consumer] callback that is triggered when the scanning operation fails. The callback
 *                 accepts an integer code representing the type or reason for the failure.
 */
@RequiresApi(Build.VERSION_CODES.Q)
class SpectaclesL2capServiceDiscovery(
    private val context: Context,
    private val identity: ByteArray,
    private val onFound: (SpectaclesStreamAddress) -> Unit,
    private val onFailed: (Int) -> Unit
) : SpectaclesStreamDiscovery {

    object Factory : SpectaclesStreamDiscovery.Factory {
        override fun create(
            context: Context,
            identity: ByteArray,
            onFound: (SpectaclesStreamAddress) -> Unit,
            onFailed: (Int) -> Unit
        ) = SpectaclesL2capServiceDiscovery(context, identity, onFound, onFailed)
    }

    companion object {
        private val SNAP_GATT_SERVICE = ParcelUuid(UUID.fromString("0000fe45-0000-1000-8000-00805f9b34fb"))
    }

    private inner class Callback : ScanCallback() {

        override fun onScanResult(callbackType: Int, result: ScanResult) {
            onScanResult(result)
        }

        override fun onBatchScanResults(results: List<ScanResult>) {
            results.forEach(::onScanResult)
        }

        override fun onScanFailed(errorCode: Int) {
            log.debug { "onScanFailed($errorCode)" }

            onFailed.invoke(errorCode)
        }
    }

    private val log = Log.get(TAG)

    private var currentScan: ScanCallback? = null

    /**
     * Starts the service scanning operation.
     *
     * This method initiates a scanning process on the specified [BluetoothDevice] to locate available PSM
     * of the service that match the given `UUID` identity. When a matching service is found, the `onFound`
     * callback is triggered with the PSM.
     */
    @RequiresPermission(value = Manifest.permission.BLUETOOTH_SCAN)
    override fun start() {
        log.debug { "start(), currentScan = $currentScan" }

        synchronized(lock = this) {
            if (currentScan != null) {
                return@synchronized
            }

            val callback = Callback()
            val settings = ScanSettings.Builder()
                .setScanMode(ScanSettings.SCAN_MODE_BALANCED)
                .setCallbackType(ScanSettings.CALLBACK_TYPE_ALL_MATCHES)
                .build()
            val data = ByteArray(identity.size + 2).apply {
                ByteBuffer.wrap(this)
                    .order(ByteOrder.BIG_ENDIAN)
                    .putShort(0)
                    .put(identity)
            }
            val isNullIdentity = 0 == identity.count { it.toInt() != 0 }
            val mask = ByteArray(identity.size + 2) { index ->
                if (index < 2 || isNullIdentity) 0 else -1
            }
            val filters = listOf(
                ScanFilter.Builder()
                    .setServiceData(SNAP_GATT_SERVICE, data, mask)
                    .build()
            )
            context.getSystemService(BluetoothManager::class.java)
                .adapter
                .bluetoothLeScanner
                .startScan(filters, settings, callback)

            currentScan = callback
        }
    }

    /**
     * Stops the service scanning operation.
     */
    @RequiresPermission(value = Manifest.permission.BLUETOOTH_SCAN)
    override fun stop() {
        log.debug { "stop(), currentScan = $currentScan" }

        synchronized(lock = this) {
            if (currentScan == null) {
                return@synchronized
            }

            context.getSystemService(BluetoothManager::class.java)
                .adapter
                .bluetoothLeScanner
                .stopScan(currentScan)

            currentScan = null
        }
    }

    private fun onScanResult(result: ScanResult) {
        log.debug { "onScanResult($result)" }

        result.scanRecord?.getServiceData(SNAP_GATT_SERVICE)?.let { data ->
            val psm = ByteBuffer.wrap(data)
                .order(ByteOrder.BIG_ENDIAN)
                .getShort().toUInt().toInt()
            val endpoint = SpectaclesL2capServerEndpoint(result.device, psm)
            onFound.invoke(endpoint)
        }
    }
}
