package com.snap.spectacles.kit.stream.l2cap

import android.Manifest
import android.bluetooth.BluetoothDevice
import android.os.Build
import androidx.annotation.RequiresApi
import androidx.annotation.RequiresPermission
import com.snap.spectacles.kit.stream.qlic.QlicEndpoint

/**
 * Represents an L2CAP server endpoint.
 */
@RequiresApi(Build.VERSION_CODES.Q)
data class SpectaclesL2capServerEndpoint(
    val device: BluetoothDevice,
    val psm: Int
) : QlicEndpoint {

    @RequiresPermission(value = Manifest.permission.BLUETOOTH_CONNECT)
    override fun connect(timeoutMs: Int): QlicEndpoint.Socket {
        val socket = device.createInsecureL2capChannel(psm)
        try {
            socket.connect()
        } catch (error: Exception) {
            socket.close()
            throw error
        }
        return SpectaclesL2capEndpointSocket(socket)
    }
}
