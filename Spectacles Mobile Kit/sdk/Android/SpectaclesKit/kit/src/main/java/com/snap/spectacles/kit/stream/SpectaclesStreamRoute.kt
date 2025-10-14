package com.snap.spectacles.kit.stream

/**
 * Defines a route handler for the [SpectaclesStreamConnection].
 * Routes incoming stream to the appropriate [SpectaclesStreamServlet].
 */
fun interface SpectaclesStreamRoute {

    /**
     * Routes the incoming initial stream request to a specific servlet based on defined routing logic.
     *
     * @param request The initial stream request to be routed.
     * @return A [SpectaclesStreamServlet] capable of handling this request.
     * @throws [SpectaclesStreamException] if the request is not supported.
     */
    fun route(request: SpectaclesStreamDataUnit): SpectaclesStreamServlet
}
