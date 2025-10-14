package com.snap.spectacles.kit.stream.inet

import com.snap.spectacles.kit.stream.qlic.QlicEndpoint
import java.net.Socket

/**
 * Represents an Inet client endpoint.
 */
data class SpectaclesInetClientEndpoint(
    val socket: Socket
) : QlicEndpoint {

    override fun connect(timeoutMs: Int): QlicEndpoint.Socket {
        return SpectaclesInetEndpointSocket(socket)
    }
}
