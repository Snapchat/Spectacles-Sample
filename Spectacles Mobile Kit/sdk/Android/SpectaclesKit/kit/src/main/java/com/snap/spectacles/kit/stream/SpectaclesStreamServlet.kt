package com.snap.spectacles.kit.stream

import java.io.Closeable

/**
 * Represents a servlet interface that handles incoming streams and their associated requests.
 * The servlet is initialized with a stream and can process both the initial stream setup
 * and subsequent requests that are sent over the same stream.
 */
interface SpectaclesStreamServlet : Closeable {

    /**
     * Closes the servlet and releases all associated resources.
     * This method is called when the stream is being closed. Implementations should ensure that
     * all pending operations are completed and any resources held by the servlet are freed.
     */
    override fun close()

    /**
     * Attaches the stream to this servlet.
     * This method is called once when the servlet is first assigned to a stream. Implementations
     * can use this method to set up any internal state or handle metadata associated with the stream.
     *
     * @param stream The [SpectaclesStream] that this servlet will handle.
     */
    fun attach(stream: SpectaclesStream)

    /**
     * Processes a request received over the stream.
     * This method is called for each individual request received on the same stream.
     *
     * @param request The [SpectaclesStreamDataUnit] object representing the incoming request.
     */
    fun service(request: SpectaclesStreamDataUnit)
}
