package com.snap.spectacles.kit.stream.l2cap

import android.bluetooth.BluetoothSocket
import com.snap.spectacles.kit.stream.qlic.QlicEndpoint

/**
 * Represents an L2CAP client endpoint.
 */
data class SpectaclesL2capClientEndpoint(
    val socket: BluetoothSocket
) : QlicEndpoint {

    override fun connect(timeoutMs: Int): QlicEndpoint.Socket {
        return SpectaclesL2capEndpointSocket(socket, 8000)
    }
}
