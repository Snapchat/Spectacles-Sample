package com.snap.spectacles.kit

/**
 * Delegates all service request processing which contains all the custom business logic and should be implemented by
 * the client.
 */
interface SpectaclesRequestDelegate {

    fun processServiceRequest(request: SpectaclesRequest)
}
