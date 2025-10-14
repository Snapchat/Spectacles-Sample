package com.snap.spectacles.kit.stream.inet

import com.snap.spectacles.kit.stream.qlic.QlicEndpoint
import java.net.InetSocketAddress
import java.net.Socket

/**
 * Represents an Inet server endpoint.
 */
data class SpectaclesInetServerEndpoint(
    val address: InetSocketAddress
) : QlicEndpoint {

    override fun connect(timeoutMs: Int): QlicEndpoint.Socket {
        val socket = Socket()
        try {
            socket.connect(address, timeoutMs)
        } catch (error: Exception) {
            socket.close()
            throw error
        }
        return SpectaclesInetEndpointSocket(socket)
    }
}
