package com.snap.spectacles.kit.stream.security

import com.snap.spectacles.kit.KitBaseTest
import com.snap.spectacles.kit.stream.SpectaclesStreamTrustManager
import org.junit.Assert.assertEquals
import org.junit.Test
import java.security.KeyPairGenerator
import java.security.spec.ECGenParameterSpec

class IosAttestationParserTest : KitBaseTest() {

    private val publicKey = KeyPairGenerator.getInstance("EC")
        .apply { initialize(ECGenParameterSpec("secp256r1")) }
        .genKeyPair()
        .public

    private val subject = IosAttestationParser()

    @Test
    fun `parse()`() {
        val attestation = byteArrayOf(2, 2)
        val challenge = byteArrayOf(1, 2)
        val (attributes, certificate) = subject.parse(
            AuthenticationManager.Attestation.IosSpecific(
                publicKey = publicKey.encoded,
                attestation = attestation
            ),
            challenge
        )

        assertEquals(SpectaclesStreamTrustManager.DeviceType.IOS, attributes.deviceType)
        assertEquals(publicKey, certificate.publicKey)
    }
}
