package com.snap.spectacles.kit.stream.qlic

/**
 * Configuration data class for setting up a QLIC connection.
 */
data class QlicConnectionConfig(
    val isClient: Boolean = true,
    val connectionTimeout: Int = 5000,
    val lowLatencyMode: Boolean = true,
    val keepAliveTime: Long = 0,
    val allowedNewAttestation: Boolean = true,
    val preSharedSecret: Pair<ByteArray, ByteArray>? = null
)
