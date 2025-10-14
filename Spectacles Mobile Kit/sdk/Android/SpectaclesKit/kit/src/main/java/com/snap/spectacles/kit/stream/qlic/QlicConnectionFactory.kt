package com.snap.spectacles.kit.stream.qlic

import android.os.Build
import androidx.annotation.RequiresApi
import androidx.annotation.VisibleForTesting
import com.snap.spectacles.kit.stream.SpectaclesStreamAddress
import com.snap.spectacles.kit.stream.SpectaclesStreamConnection
import com.snap.spectacles.kit.stream.SpectaclesStreamRoute
import com.snap.spectacles.kit.stream.SpectaclesStreamTrustManager
import com.snap.spectacles.kit.stream.security.KeyManager
import java.security.SecureRandom

/**
 * Factory object for creating and managing QLIC connections.
 */
@RequiresApi(Build.VERSION_CODES.O)
object QlicConnectionFactory {

    @VisibleForTesting
    internal var connectionFactory = QlicConnection.Factory

    @VisibleForTesting
    internal var securityManagerFactory = QlicSecurityManager.Factory()

    /**
     * For internal testing.
     */
    var usePseudoSecurityManager = false

    /**
     * Opens a new Qlic connection with the provided parameters.
     */
    fun openConnection(
        address: SpectaclesStreamAddress,
        requestRoute: SpectaclesStreamRoute,
        trustManager: SpectaclesStreamTrustManager,
        keyManager: KeyManager,
        secureRandom: SecureRandom,
        config: QlicConnectionConfig
    ): SpectaclesStreamConnection {
        val securityManager = createSecurityManager(trustManager, keyManager, secureRandom, config)
        return connectionFactory.create(securityManager, requestRoute, config.isClient).apply {
            try {
                connect(address, config.connectionTimeout)
                setLowLatencyMode(config.lowLatencyMode)
                if (config.keepAliveTime > 0) {
                    setKeepAliveTime(config.keepAliveTime)
                }
            } catch (error: Exception) {
                close()
                throw error
            }
        }
    }

    private fun createSecurityManager(
        trustManager: SpectaclesStreamTrustManager,
        keyManager: KeyManager,
        secureRandom: SecureRandom,
        config: QlicConnectionConfig
    ): QlicSecurityManager {
        val factory = if (usePseudoSecurityManager) QlicSecurityManager.PseudoFactory else securityManagerFactory
        return factory
            .create(
                isClient = config.isClient,
                trustManager = trustManager,
                keyManager = keyManager,
                allowedNewAttestation = config.allowedNewAttestation,
                noHandshake = null != config.preSharedSecret,
                secureRandom = secureRandom
            )
            .apply {
                if (null != config.preSharedSecret) {
                    encryptionManager.setSecret(config.preSharedSecret.first, config.preSharedSecret.second)
                    encryptionManager.update(config.preSharedSecret.second)
                }
            }
    }
}
