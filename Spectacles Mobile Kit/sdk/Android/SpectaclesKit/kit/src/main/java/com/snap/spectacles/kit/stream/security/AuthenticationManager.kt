package com.snap.spectacles.kit.stream.security

import com.snap.spectacles.kit.stream.SpectaclesStreamException
import java.security.cert.Certificate
import kotlin.jvm.Throws
import kotlin.reflect.KClass

/**
 * Interface for managing stream connection authentication.
 */
interface AuthenticationManager {

    sealed interface Attestation {
        data class CertificateChain(val chain: List<Certificate>) : Attestation

        class IosSpecific(
            val publicKey: ByteArray,
            val attestation: ByteArray,
        ) : Attestation
    }

    /**
     * Retrieves the collection of supported local attestation algorithms.
     * @return A collection of KClass objects representing the supported local attestation types.
     */
    fun getSupportedLocalAttestationAlgorithms(): Collection<KClass<out Attestation>>

    /**
     * Retrieves the collection of supported remote attestation algorithms.
     * @return A collection of KClass objects representing the supported remote attestation types.
     */
    fun getSupportedRemoteAttestationAlgorithms(): Collection<KClass<out Attestation>>

    /**
     * Generates a new attestation for the local identity using the provided challenge.
     * The attestation is used to prove the identity of the local entity to a remote peer.
     *
     * @param attestationClass The KClass representing the type of attestation to generate.
     *                          Must be one of the supported local attestation algorithms
     *                          (see `getSupportedLocalAttestationAlgorithms()`).
     * @param challenge A unique challenge, which is used to create the attestation.
     * @return The attestation, which can be sent to the remote peer for verification.
     */
    fun <T : Attestation> generateLocalIdentityAttestation(attestationClass: KClass<T>, challenge: ByteArray): T

    /**
     * Validates the attestation received from a remote peer, ensuring it matches the provided challenge.
     * If valid, updates the stored identity of the remote peer.
     *
     * @param challenge The challenge that was used to generate the remote attestation.
     * @param attestation The attestation received from the remote peer.
     * @throws SpectaclesStreamException if the attestation verification fails.
     */
    @Throws(SpectaclesStreamException::class)
    fun validateRemoteIdentityAttestation(challenge: ByteArray, attestation: Attestation)

    /**
     * Retrieves the byte array representation of the local peer's identity.
     *
     * @return The identity of the local peer, encoded as a byte array.
     */
    fun getLocalIdentity(): ByteArray

    /**
     * Retrieves the byte array representation of the remote peer's identity.
     *
     * @return The identity of the remote peer, encoded as a byte array.
     */
    fun getRemoteIdentity(): ByteArray

    /**
     * Retrieves the local signing signature.
     *
     * @return The signing signature.
     */
    fun signWithLocalIdentity(content: ByteArray): ByteArray

    /**
     * Verifies the remote verification signature.
     *
     * @return The verification result.
     */
    fun verifyWithRemoteIdentity(content: ByteArray, signature: ByteArray): Boolean

    /**
     * A placeholder implementation of the AuthenticationManager interface.
     */
    object Noop : AuthenticationManager {
        override fun getSupportedLocalAttestationAlgorithms(): Collection<KClass<out Attestation>> =
            listOf(Attestation.CertificateChain::class)
        override fun getSupportedRemoteAttestationAlgorithms(): Collection<KClass<out Attestation>> =
            listOf(Attestation.CertificateChain::class, Attestation.IosSpecific::class)
        override fun <T : Attestation> generateLocalIdentityAttestation(
            attestationClass: KClass<T>,
            challenge: ByteArray
        ): T = Attestation.CertificateChain(emptyList()) as T
        override fun validateRemoteIdentityAttestation(challenge: ByteArray, attestation: Attestation) = Unit
        override fun getLocalIdentity(): ByteArray = ByteArray(0)
        override fun getRemoteIdentity(): ByteArray = ByteArray(0)
        override fun signWithLocalIdentity(content: ByteArray): ByteArray = ByteArray(0)
        override fun verifyWithRemoteIdentity(content: ByteArray, signature: ByteArray) = true
    }
}
