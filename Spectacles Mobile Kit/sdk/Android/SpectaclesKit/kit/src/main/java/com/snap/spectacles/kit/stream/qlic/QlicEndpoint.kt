package com.snap.spectacles.kit.stream.qlic

import com.snap.spectacles.kit.stream.SpectaclesStreamAddress
import java.io.Closeable
import java.io.InputStream
import java.io.OutputStream

/**
 * Represents an endpoint in the QLIC communication framework.
 * It provides an interface for connecting to the endpoint and managing data streams.
 */
interface QlicEndpoint : SpectaclesStreamAddress {

    /**
     * Represents a bidirectional communication socket for the QlicEndpoint.
     */
    interface Socket : Closeable {

        /**
         * The input stream for receiving data from the endpoint.
         */
        val inputStream: InputStream

        /**
         * The input stream for receiving data from the endpoint.
         */
        val outputStream: OutputStream

        /**
         * Indicates the preferred size for transmitting packets.
         * This is useful for optimizing data transmission based on the endpoint's capabilities.
         */
        val preferredTransmitPacketSize: Int
    }

    /**
     * Connects to the QLIC endpoint with a specified timeout.
     *
     * @param timeoutMs The maximum time, in milliseconds, to wait for the connection to be established.
     * @return A [Socket] instance that provides streams for communication with the endpoint.
     */
    fun connect(timeoutMs: Int): Socket
}
