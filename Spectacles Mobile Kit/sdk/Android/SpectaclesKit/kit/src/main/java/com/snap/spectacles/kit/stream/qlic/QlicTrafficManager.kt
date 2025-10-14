package com.snap.spectacles.kit.stream.qlic

import android.os.SystemClock

/**
 * Manages network traffic and handles conditions such as throttling and pinging based on traffic state.
 *
 * @param throttleThreshold The threshold in bytes that determines when traffic throttling is needed.
 * @param trafficIdleThreshold The time (in milliseconds) before traffic is considered idle.
 */
internal class QlicTrafficManager(
    private val throttleThreshold: Int,
    private val pingThreshold: Int,
    private val clock: () -> Long,
) {

    object Factory {
        fun create(
            throttleThreshold: Int,
            pingThreshold: Int
        ) = QlicTrafficManager(throttleThreshold, pingThreshold, SystemClock::elapsedRealtime)
    }

    private var totalReceivedBytes = 0
    private var ackedReceivedBytes = 0

    private var totalSentBytes = 0
    private var ackedSentBytes = 0
    private var pingedSentBytes = 0

    private var lastTrafficTimestamp = 0L

    /**
     * Incrementally updates the count of received bytes.
     */
    @Synchronized
    fun updateReceivedBytes(bytes: Int) {
        totalReceivedBytes += bytes
        lastTrafficTimestamp = clock.invoke()
    }

    /**
     * Returns the number of unacknowledged received bytes, and marks all received bytes as acknowledged.
     */
    @Synchronized
    fun updateAcknowledgedReceivedBytes(): Int {
        val bytes = totalReceivedBytes - ackedReceivedBytes
        ackedReceivedBytes = totalReceivedBytes
        return bytes
    }

    /**
     * Incrementally updates the count of sent bytes.
     */
    @Synchronized
    fun updateSentBytes(bytes: Int) {
        totalSentBytes += bytes
        lastTrafficTimestamp = clock.invoke()
    }

    /**
     * Incrementally updates the count of acknowledged (sent) bytes.
     */
    @Synchronized
    fun updateAcknowledgedSentBytes(bytes: Int) {
        ackedSentBytes += bytes
    }

    /**
     * Marks all sent bytes as pinged.
     */
    @Synchronized
    fun updatePingSentBytes() {
        pingedSentBytes = totalSentBytes
    }

    /**
     * Gets the duration (in milliseconds) that traffic has been idle.
     * @return the duration (in milliseconds) since the last traffic event.
     */
    @Synchronized
    fun getTrafficIdleDuration(): Long {
        return clock.invoke() - lastTrafficTimestamp
    }

    /**
     * Determines whether traffic throttling is required based on unacknowledged sent bytes.
     * @return true if throttling is required, otherwise false.
     */
    @Synchronized
    fun isThrottlingRequired(): Boolean {
        return totalSentBytes - ackedSentBytes >= throttleThreshold
    }

    /**
     * Determines whether a proactive ping operation is required based on unacknowledged sent bytes.
     * @return true if a ping operation is required, otherwise false.
     */
    @Synchronized
    fun isPingRequired(): Boolean {
        return totalSentBytes - pingedSentBytes.coerceAtLeast(ackedSentBytes) >= pingThreshold
    }
}
