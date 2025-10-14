package com.snap.spectacles.kit.stream.l2cap

import android.Manifest
import android.bluetooth.BluetoothManager
import android.bluetooth.BluetoothServerSocket
import android.bluetooth.BluetoothSocket
import android.bluetooth.le.AdvertiseCallback
import android.bluetooth.le.AdvertiseData
import android.bluetooth.le.AdvertiseSettings
import android.content.Context
import android.os.Build
import android.os.ParcelUuid
import androidx.annotation.RequiresApi
import androidx.annotation.RequiresPermission
import com.snap.spectacles.kit.stream.SpectaclesStreamAddress
import com.snap.spectacles.kit.stream.SpectaclesStreamAdvertising
import com.snap.spectacles.kit.stream.utils.Worker
import com.snap.spectacles.kit.util.Log
import java.nio.ByteBuffer
import java.nio.ByteOrder
import java.util.UUID

private const val TAG = "SpectaclesL2capServiceAdvertising"

@RequiresApi(Build.VERSION_CODES.Q)
class SpectaclesL2capServiceAdvertising(
    private val context: Context,
    private val identity: ByteArray,
    private val onAccept: (SpectaclesStreamAddress) -> Unit,
    private val onFailed: (Int) -> Unit
) : SpectaclesStreamAdvertising {

    object Factory : SpectaclesStreamAdvertising.Factory {
        override fun create(
            context: Context,
            identity: ByteArray,
            onAccept: (SpectaclesStreamAddress) -> Unit,
            onFailed: (Int) -> Unit
        ) = SpectaclesL2capServiceAdvertising(context, identity, onAccept, onFailed)
    }

    companion object {
        private val SNAP_GATT_SERVICE = ParcelUuid(UUID.fromString("0000fe45-0000-1000-8000-00805f9b34fb"))
    }

    private inner class Callback : AdvertiseCallback() {

        override fun onStartSuccess(settingsInEffect: AdvertiseSettings) {
            log.debug { "onStartSuccess($settingsInEffect)" }
        }

        @RequiresPermission(value = Manifest.permission.BLUETOOTH_ADVERTISE)
        override fun onStartFailure(errorCode: Int) {
            log.debug { "onStartFailure($errorCode)" }

            onAdvertisingFailed(this, errorCode)
        }
    }

    private val log = Log.get(TAG)

    private var serverSocket: BluetoothServerSocket? = null

    private var currentAdvertising: AdvertiseCallback? = null

    @RequiresPermission(allOf = [Manifest.permission.BLUETOOTH_CONNECT, Manifest.permission.BLUETOOTH_ADVERTISE])
    override fun start() {
        log.debug { "start(), serverSocket = $serverSocket" }

        synchronized(lock = this) {
            if (null != serverSocket) {
                return@synchronized
            }

            serverSocket = startService()
            startAdvertising()
        }
    }

    @RequiresPermission(value = Manifest.permission.BLUETOOTH_ADVERTISE)
    override fun pause() {
        log.debug { "pause(), serverSocket = $serverSocket, currentAdvertising = $currentAdvertising" }

        synchronized(lock = this) {
            if (null != serverSocket) {
                stopAdvertising()
            }
        }
    }

    @RequiresPermission(value = Manifest.permission.BLUETOOTH_ADVERTISE)
    override fun resume() {
        log.debug { "resume(), serverSocket = $serverSocket, currentAdvertising = $currentAdvertising" }

        synchronized(lock = this) {
            if (null != serverSocket) {
                startAdvertising()
            }
        }
    }

    @RequiresPermission(value = Manifest.permission.BLUETOOTH_ADVERTISE)
    override fun stop() {
        log.debug { "stop(), serverSocket = $serverSocket, currentAdvertising = $currentAdvertising" }

        synchronized(lock = this) {
            if (null != serverSocket) {
                stopAdvertising()

                serverSocket!!.close()
                serverSocket = null
            }
        }
    }

    private fun onServiceConnected(server: BluetoothServerSocket, client: BluetoothSocket) {
        val current = synchronized(lock = this) {
            server.takeIf { it == serverSocket }
        }

        if (null != current) {
            val endpoint = SpectaclesL2capClientEndpoint(client)
            onAccept.invoke(endpoint)
        } else {
            client.close()
        }
    }

    @RequiresPermission(value = Manifest.permission.BLUETOOTH_ADVERTISE)
    private fun onServiceFailed(server: BluetoothServerSocket, errorCode: Int) {
        val current = synchronized(lock = this) {
            server.takeIf { it == serverSocket }
                ?.also {
                    stopAdvertising()
                    serverSocket!!.close()
                    serverSocket = null
                }
        }

        if (null != current) {
            onFailed.invoke(errorCode)
        }
    }

    @RequiresPermission(value = Manifest.permission.BLUETOOTH_ADVERTISE)
    private fun onAdvertisingFailed(advertising: Callback, errorCode: Int) {
        val current = synchronized(lock = this) {
            advertising.takeIf { it == currentAdvertising }
                ?.also {
                    stopAdvertising()
                    serverSocket!!.close()
                    serverSocket = null
                }
        }

        if (null != current) {
            onFailed.invoke(errorCode)
        }
    }

    @RequiresPermission(value = Manifest.permission.BLUETOOTH_ADVERTISE)
    private fun startAdvertising() {
        if (null == currentAdvertising) {
            val params = ByteArray(identity.size + 2).apply {
                ByteBuffer.wrap(this)
                    .order(ByteOrder.BIG_ENDIAN)
                    .putShort(serverSocket!!.psm.toShort())
                    .put(identity)
            }
            val settings = AdvertiseSettings.Builder()
                .setConnectable(true)
                .setAdvertiseMode(AdvertiseSettings.ADVERTISE_MODE_BALANCED)
                .build()
            val data = AdvertiseData.Builder()
                .addServiceData(SNAP_GATT_SERVICE, params)
                .build()

            currentAdvertising = Callback()
            context.getSystemService(BluetoothManager::class.java)
                .adapter
                .bluetoothLeAdvertiser
                .startAdvertising(settings, data, currentAdvertising)
        }
    }

    @RequiresPermission(value = Manifest.permission.BLUETOOTH_ADVERTISE)
    private fun stopAdvertising() {
        if (null != currentAdvertising) {
            context.getSystemService(BluetoothManager::class.java)
                .adapter
                .bluetoothLeAdvertiser
                .stopAdvertising(currentAdvertising)
            currentAdvertising = null
        }
    }

    @RequiresPermission(allOf = [Manifest.permission.BLUETOOTH_CONNECT, Manifest.permission.BLUETOOTH_ADVERTISE])
    private fun startService(): BluetoothServerSocket {
        return context.getSystemService(BluetoothManager::class.java)
            .adapter
            .listenUsingInsecureL2capChannel()
            .also { server ->
                val worker = Worker.create(TAG) {
                    log.debug { "startService($server) start" }

                    try {
                        while (true) {
                            val socket = server.accept()
                            onServiceConnected(server, socket)
                        }
                    } catch (e: Exception) {
                        log.warn(e) { "startService($server) error" }

                        onServiceFailed(server, -1)
                    }

                    log.debug { "startService($server) end" }
                }
                worker.start()
            }
    }
}
