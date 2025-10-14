package com.snap.spectacles.kit.stream.security

import com.snap.spectacles.kit.KitBaseTest
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import org.junit.runners.JUnit4
import org.mockito.kotlin.mock

@RunWith(JUnit4::class)
class AuthenticationManagerTest : KitBaseTest() {

    @Test
    fun `Noop, getSupportedLocalAttestationAlgorithms()`() {
        val algorithms = AuthenticationManager.Noop.getSupportedLocalAttestationAlgorithms()
        assertTrue(algorithms.contains(AuthenticationManager.Attestation.CertificateChain::class))
    }

    @Test
    fun `Noop, getSupportedRemoteAttestationAlgorithms()`() {
        val algorithms = AuthenticationManager.Noop.getSupportedRemoteAttestationAlgorithms()
        assertTrue(algorithms.contains(AuthenticationManager.Attestation.CertificateChain::class))
        assertTrue(algorithms.contains(AuthenticationManager.Attestation.IosSpecific::class))
    }

    @Test
    fun `Noop, generateLocalIdentityAttestation()`() {
        val attestation = AuthenticationManager.Noop.generateLocalIdentityAttestation(
            AuthenticationManager.Attestation.CertificateChain::class, ByteArray(1)
        )
        assertTrue(attestation.chain.isEmpty())
    }

    @Test
    fun `Noop, validateRemoteIdentityAttestation()`() {
        AuthenticationManager.Noop.validateRemoteIdentityAttestation(ByteArray(1), mock())
    }

    @Test
    fun `Noop, getLocalIdentity()`() {
        val identity = AuthenticationManager.Noop.getLocalIdentity()
        assertTrue(identity.contentEquals(ByteArray(0)))
    }

    @Test
    fun `Noop, getRemoteIdentity()`() {
        val identity = AuthenticationManager.Noop.getRemoteIdentity()
        assertTrue(identity.contentEquals(ByteArray(0)))
    }

    @Test
    fun `Noop, signWithLocalIdentity()`() {
        val signing = AuthenticationManager.Noop.signWithLocalIdentity(ByteArray(0))
        assertTrue(signing.contentEquals(ByteArray(0)))
    }

    @Test
    fun `Noop, verifyWithRemoteIdentity()`() {
        val passed = AuthenticationManager.Noop.verifyWithRemoteIdentity(ByteArray(0), ByteArray(0))
        assertTrue(passed)
    }
}
