package com.snap.spectacles.kit.stream.security

import android.os.Build
import androidx.annotation.RequiresApi
import com.snap.spectacles.kit.stream.SpectaclesStreamException
import com.snap.spectacles.kit.stream.SpectaclesStreamTrustManager
import com.snap.spectacles.kit.util.Log
import java.security.cert.Certificate
import kotlin.reflect.KClass

private const val TAG = "AndroidAuthenticationManager"

typealias Attestation = Pair<SpectaclesStreamTrustManager.SecurityAttributes, Certificate>

/**
 * Manages Android-specific authentication processes for identity attestation and signature verification.
 * This class interacts with the Android Keystore to securely generate and store local keys, validate
 * remote identities, and manage certificate chains for attestation.
 *
 * @property trustManager The trust manager responsible for validating the trustworthiness of peer identities.
 * @property parseAttestation A function to extract attestation information from a list of certificates.
 */
@RequiresApi(Build.VERSION_CODES.O)
class AndroidAuthenticationManager(
    private val trustManager: SpectaclesStreamTrustManager,
    private val keyManager: KeyManager,
    private val localAttestationAlgorithms: Collection<KClass<out AuthenticationManager.Attestation>>,
    private val remoteAttestationAlgorithms: Collection<KClass<out AuthenticationManager.Attestation>>,
    private val parseAttestation: (AuthenticationManager.Attestation, ByteArray) -> Attestation,
) : AuthenticationManager {

    object Factory {
        fun create(
            trustManager: SpectaclesStreamTrustManager,
            keyManager: KeyManager,
            verificationOnly: Boolean
        ) = AndroidAuthenticationManager(
            trustManager,
            keyManager,
            if (verificationOnly) emptyList() else LOCAL_ATTESTATION_ALGORITHMS,
            if (verificationOnly) emptyList() else REMOTE_ATTESTATION_ALGORITHMS,
            AttestationParser()::parse
        )
    }

    companion object {
        private val LOCAL_ATTESTATION_ALGORITHMS = listOf(
            AuthenticationManager.Attestation.CertificateChain::class
        )
        private val REMOTE_ATTESTATION_ALGORITHMS = listOf(
            AuthenticationManager.Attestation.CertificateChain::class,
            AuthenticationManager.Attestation.IosSpecific::class
        )
    }

    private val log = Log.get(TAG)

    override fun getSupportedLocalAttestationAlgorithms(): Collection<KClass<out AuthenticationManager.Attestation>> =
        localAttestationAlgorithms

    override fun getSupportedRemoteAttestationAlgorithms(): Collection<KClass<out AuthenticationManager.Attestation>> =
        remoteAttestationAlgorithms

    override fun <T : AuthenticationManager.Attestation> generateLocalIdentityAttestation(
        attestationClass: KClass<T>,
        challenge: ByteArray
    ): T {
        log.debug { "generateLocalIdentityAttestation()" }

        if (!localAttestationAlgorithms.contains(attestationClass)) {
            throw SpectaclesStreamException(SpectaclesStreamException.UNAUTHORIZED, "Unsupported algorithm")
        }

        keyManager.updateLocalCertificate(challenge)
        return AuthenticationManager.Attestation.CertificateChain(
            keyManager.getLocalCertificateChain()!!
        ) as T
    }

    override fun validateRemoteIdentityAttestation(
        challenge: ByteArray,
        attestation: AuthenticationManager.Attestation
    ) {
        log.debug { "validateRemoteIdentityAttestation()" }

        if (!remoteAttestationAlgorithms.contains(attestation::class)) {
            throw SpectaclesStreamException(SpectaclesStreamException.UNAUTHORIZED, "Unsupported algorithm")
        }

        val (attributes, certificate) = parseAttestation(attestation, challenge)
        trustManager.validatePeerTrust(attributes)

        // Save remote certificate to KeyStore
        keyManager.updatePeerCertificate(certificate, attestation)
    }

    override fun getLocalIdentity(): ByteArray {
        log.debug { "getLocalIdentity()" }

        return keyManager.getLocalCertificateChain()?.run {
            get(0).publicKey.encoded
        } ?: ByteArray(0)
    }

    override fun getRemoteIdentity(): ByteArray {
        log.debug { "getRemoteIdentity()" }

        return keyManager.getPeerCertificate()?.run {
            publicKey.encoded
        } ?: ByteArray(0)
    }

    override fun signWithLocalIdentity(content: ByteArray): ByteArray {
        log.debug { "signWithLocalIdentity()" }

        return keyManager.getLocalSignature().run {
            update(content)
            sign()
        }
    }

    override fun verifyWithRemoteIdentity(content: ByteArray, signature: ByteArray): Boolean {
        log.debug { "verifyWithRemoteIdentity()" }

        return keyManager.getPeerSignature().run {
            update(content)
            verify(signature)
        }
    }
}
