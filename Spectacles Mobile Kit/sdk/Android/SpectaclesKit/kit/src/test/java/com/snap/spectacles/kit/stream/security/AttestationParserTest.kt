package com.snap.spectacles.kit.stream.security

import com.snap.spectacles.kit.KitBaseTest
import org.junit.Test
import org.junit.runner.RunWith
import org.junit.runners.JUnit4
import org.mockito.kotlin.any
import org.mockito.kotlin.doReturn
import org.mockito.kotlin.mock
import org.mockito.kotlin.verify

@RunWith(JUnit4::class)
class AttestationParserTest : KitBaseTest() {

    private val androidParser = mock<AndroidAttestationParser> {
        on { parse(any(), any()) } doReturn mock()
    }
    private val iosParser = mock<IosAttestationParser>() {
        on { parse(any(), any()) } doReturn mock()
    }

    private val subject = AttestationParser(androidParser, iosParser)

    @Test
    fun `parse(), android`() {
        val attestation = mock<AuthenticationManager.Attestation.CertificateChain>()
        val challenge = byteArrayOf()
        subject.parse(attestation, challenge)
        verify(androidParser).parse(attestation, challenge)
    }

    @Test
    fun `parse(), ios`() {
        val attestation = mock<AuthenticationManager.Attestation.IosSpecific>()
        val challenge = byteArrayOf()
        subject.parse(attestation, challenge)
        verify(iosParser).parse(attestation, challenge)
    }
}