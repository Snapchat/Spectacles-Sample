package com.snap.spectacles.kit.stream.utils

import com.snap.spectacles.kit.stream.SpectaclesStream
import com.snap.spectacles.kit.stream.SpectaclesStreamDataUnit
import com.snap.spectacles.kit.stream.SpectaclesStreamRoute
import com.snap.spectacles.kit.stream.SpectaclesStreamServlet

/**
 * Represents a handler interface for managing and processing incoming streams.
 */
internal interface SpectaclesStreamHandler {

    /**
     * Invoked when a stream is attached to the service.
     *
     * @param stream The SpectaclesStream instance that is being attached.
     */
    fun onAttach(stream: SpectaclesStream)

    /**
     * Invoked when data is received from the stream.
     *
     * @param data The SpectaclesStreamDataUnit containing the received data.
     */
    fun onReceive(data: SpectaclesStreamDataUnit)

    /**
     * Invoked when the stream is closed.
     */
    fun onClose()

    /**
     * Default implementation of the StreamHandler interface.
     *
     * @param route The routing mechanism for handling incoming stream data.
     */
    class Default(private val route: SpectaclesStreamRoute) : SpectaclesStreamHandler {

        private var stream: SpectaclesStream? = null

        private var servlet: SpectaclesStreamServlet? = null

        override fun onAttach(stream: SpectaclesStream) {
            this.stream = stream
        }

        override fun onReceive(data: SpectaclesStreamDataUnit) {
            if (null == servlet) {
                servlet = route.route(data)
                servlet!!.attach(stream!!)
            }
            servlet!!.service(data)
        }

        override fun onClose() {
            servlet?.close()
        }
    }
}