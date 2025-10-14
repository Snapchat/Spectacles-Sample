package com.snap.spectacles.kit

/**
 * Creates a new SpectaclesKit.Builder with the provided bonding ID (Bonding.id).
 */
fun SpectaclesKit.createSession(
    bondingId: String,
    request: SpectaclesKit.SessionRequest,
    delegateBuilder: (SpectaclesSession) -> SpectaclesRequestDelegate
): SpectaclesSession? = getBonding(bondingId)?.let { bonding ->
    createSession(bonding, request, delegateBuilder)
}
