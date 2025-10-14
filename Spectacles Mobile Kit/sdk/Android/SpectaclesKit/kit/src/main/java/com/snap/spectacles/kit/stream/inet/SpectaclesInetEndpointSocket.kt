package com.snap.spectacles.kit.stream.inet

import com.snap.spectacles.kit.stream.qlic.QlicEndpoint
import java.io.InputStream
import java.io.OutputStream
import java.net.Socket

private const val PREFERRED_PACKET_SIZE = 32 * 1024

class SpectaclesInetEndpointSocket(
    private val socket: Socket,
    override val preferredTransmitPacketSize: Int = PREFERRED_PACKET_SIZE
) : QlicEndpoint.Socket {

    override val inputStream: InputStream = socket.inputStream

    override val outputStream: OutputStream = socket.outputStream

    override fun close() {
        socket.close()
    }

    override fun toString(): String {
        return "SpectaclesInetEndpointSocket(socket = $socket" +
                ", preferredTransmitPacketSize = $preferredTransmitPacketSize)"
    }
}
