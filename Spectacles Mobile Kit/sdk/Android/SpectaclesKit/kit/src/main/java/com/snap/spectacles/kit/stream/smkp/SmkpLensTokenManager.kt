package com.snap.spectacles.kit.stream.smkp

import com.snap.spectacles.kit.stream.SpectaclesStreamTrustManager

/**
 * Manages the tokens and their associated LensProvision objects.
 */
class SmkpLensTokenManager(
    defaultLensProvision: SpectaclesStreamTrustManager.LensProvision? = null
) {

    private val tokens = mutableMapOf<String, SpectaclesStreamTrustManager.LensProvision>()

    private var latest: SpectaclesStreamTrustManager.LensProvision? = defaultLensProvision

    /**
     * Adds a new token and associates it with a LensProvision.
     * Updates the latest LensProvision to the one being added.
     *
     * @param token The unique token identifying the Lens.
     * @param lens The LensProvision object associated with the token.
     */
    fun addToken(token: String, lens: SpectaclesStreamTrustManager.LensProvision) {
        synchronized(lock = this) {
            tokens[token] = lens
            latest = lens
        }
    }

    /**
     * Retrieves the LensProvision associated with the given token.
     * If the token is null, returns the latest added LensProvision.
     *
     * @param token The token to look up. If null, returns the latest provision.
     * @return The LensProvision associated with the token, or the latest provision if the token is null.
     */
    fun getToken(token: String?): SpectaclesStreamTrustManager.LensProvision? {
        return synchronized(lock = this) {
            if (token != null) tokens[token] else latest
        }
    }
}
