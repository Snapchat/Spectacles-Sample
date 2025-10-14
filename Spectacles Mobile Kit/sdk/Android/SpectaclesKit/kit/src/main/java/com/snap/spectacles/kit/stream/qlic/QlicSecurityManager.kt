package com.snap.spectacles.kit.stream.qlic

import android.os.Build
import androidx.annotation.RequiresApi
import androidx.annotation.VisibleForTesting
import com.snap.spectacles.kit.stream.SpectaclesStreamTrustManager
import com.snap.spectacles.kit.stream.security.AndroidAuthenticationManager
import com.snap.spectacles.kit.stream.security.KeyManager
import com.snap.spectacles.kit.stream.security.AuthenticationManager
import com.snap.spectacles.kit.stream.security.EncryptionManager
import com.snap.spectacles.kit.stream.security.KeyExchangeManager
import com.snap.spectacles.kit.stream.security.TranscriptHashManager
import java.security.SecureRandom

/**
 * Manages the security operations for the Qlic protocol, including authentication, key exchange,
 * encryption, and transcript hashing. This class acts as a central coordinator for these security
 * components during the handshake and communication phases.
 */
@RequiresApi(Build.VERSION_CODES.O)
internal class QlicSecurityManager(
    val authenticationManager: AuthenticationManager,
    val keyExchangeManager: KeyExchangeManager,
    val encryptionManager: EncryptionManager,
    val transcriptHashManager: TranscriptHashManager,
    val noHandshake: Boolean,
    val secureRandom: SecureRandom
) {

    open class Factory {

        @VisibleForTesting
        internal var authenticationManagerFactory = AndroidAuthenticationManager.Factory

        open fun create(
            isClient: Boolean,
            trustManager: SpectaclesStreamTrustManager,
            keyManager: KeyManager,
            allowedNewAttestation: Boolean,
            noHandshake: Boolean,
            secureRandom: SecureRandom
        ): QlicSecurityManager {
            val authenticationManager = authenticationManagerFactory.create(
                trustManager,
                keyManager,
                !allowedNewAttestation
            )
            val keyExchangeManager = KeyExchangeManager.Default("ECDH", "EC", 384)
            val encryptionManager = QlicEncryptionManager(isClient)
            val transcriptHashManager = TranscriptHashManager.Default("SHA-384")

            return QlicSecurityManager(
                authenticationManager,
                keyExchangeManager,
                encryptionManager,
                transcriptHashManager,
                noHandshake,
                secureRandom
            )
        }
    }

    object PseudoFactory : Factory() {
        override fun create(
            isClient: Boolean,
            trustManager: SpectaclesStreamTrustManager,
            keyManager: KeyManager,
            allowedNewAttestation: Boolean,
            noHandshake: Boolean,
            secureRandom: SecureRandom
        ): QlicSecurityManager {
            val authenticationManager = AuthenticationManager.Noop
            val keyExchangeManager = KeyExchangeManager.Noop
            val encryptionManager = EncryptionManager.Noop
            val transcriptHashManager = TranscriptHashManager.Default("SHA")

            return QlicSecurityManager(
                authenticationManager,
                keyExchangeManager,
                encryptionManager,
                transcriptHashManager,
                noHandshake,
                secureRandom
            )
        }
    }
}
