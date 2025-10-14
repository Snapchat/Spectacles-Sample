package com.snap.spectacles.kit.stream.l2cap

import android.bluetooth.BluetoothSocket
import com.snap.spectacles.kit.stream.qlic.QlicEndpoint
import java.io.InputStream
import java.io.OutputStream

private const val PREFERRED_PACKET_SIZE = 251 * 4 - 4

internal class SpectaclesL2capEndpointSocket(
    private val socket: BluetoothSocket,
    override val preferredTransmitPacketSize: Int = PREFERRED_PACKET_SIZE
) : QlicEndpoint.Socket {

    override val inputStream: InputStream = socket.inputStream

    override val outputStream: OutputStream = socket.outputStream

    override fun close() {
        socket.close()
    }

    override fun toString(): String {
        return "SpectaclesL2capEndpointSocket(socket = $socket" +
                ", preferredTransmitPacketSize = $preferredTransmitPacketSize)"
    }
}
