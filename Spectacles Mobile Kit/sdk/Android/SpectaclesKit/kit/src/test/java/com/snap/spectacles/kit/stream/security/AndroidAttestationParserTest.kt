package com.snap.spectacles.kit.stream.security

import com.snap.spectacles.kit.KitBaseTest
import com.snap.spectacles.kit.stream.SpectaclesStreamException
import com.snap.spectacles.kit.stream.SpectaclesStreamTrustManager
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import org.junit.runners.JUnit4
import org.mockito.kotlin.any
import org.mockito.kotlin.doReturn
import org.mockito.kotlin.mock
import java.io.ByteArrayInputStream
import java.security.cert.CertPath
import java.security.cert.CertPathValidator
import java.security.cert.Certificate
import java.security.cert.CertificateFactory
import java.security.cert.X509Certificate

@RunWith(JUnit4::class)
class AndroidAttestationParserTest : KitBaseTest() {

    private val certWithAttestation = """
        MIICrDCCAlKgAwIBAgIBATAKBggqhkjOPQQDAjA5MSkwJwYDVQQDEyA1NmRhYmQxMTAyYjJmMTli
        M2E0MWJmNjgyMzdiZmEwZjEMMAoGA1UEChMDVEVFMB4XDTcwMDEwMTAwMDAwMFoXDTQ4MDEwMTAw
        MDAwMFowHzEdMBsGA1UEAxMUQW5kcm9pZCBLZXlzdG9yZSBLZXkwdjAQBgcqhkjOPQIBBgUrgQQA
        IgNiAATschqhJ3BcR8kPEpX0O4udTcGJBizF6JopxeNavXuZ1aT8/8eYT96q+ShEquSv35b/8qy4
        KR4BXSibzQIx5Yx/Ibs7kO8++BbRoszqBe3tb5UiCo4m9DGMxCs9uNZ8Hs+jggFGMIIBQjAOBgNV
        HQ8BAf8EBAMCB4AwggEuBgorBgEEAdZ5AgERBIIBHjCCARoCAgEsCgEBAgIBLAoBAQQDAQIDBAAw
        X7+FPQgCBgGTRwdBe7+FRU8ETTBLMSUwIwQeY29tLnNuYXAuc3BlY3RhY2xlcy5raXQuc2FtcGxl
        AgEBMSIEIBSiWUWuQ8IIwY/MryvAS4aWWYaRzM7w68VPIWCOiwKMMIGhoQUxAwIBAqIDAgEDowQC
        AgGApQUxAwIBBaoDAgECv4N3AgUAv4U+AwIBAL+FQEwwSgQg5TYt30Z26KoTTbUgdJvLH0T+ZVb1
        57+rEwy2NDR2/BUBAf8KAQAEILj8l/VEnmPcM7nasOklQrunV58al2GTy8Sx519QRDK/v4VBBQID
        AiLgv4VCBQIDAxapv4VOBgIEATTaCb+FTwYCBAE02gkwCgYIKoZIzj0EAwIDSAAwRQIhAM0hko73
        QarrZ880GspL3zE0f1thRoSZ2/pu9mV1g7gAAiA0gF9WRiN0mhpRDQ7tvJH+REpRpMw1gp8g7qgX
        6pT6tQ==
    """

    private val certWithoutApplicationId = """
        MIIDHzCCAsSgAwIBAgIBATAKBggqhkjOPQQDAjB0MQswCQYDVQQGEwJVUzETMBEGA1UECAwKQ2Fs
        aWZvcm5pYTEVMBMGA1UEBwwMU2FudGEgTW9uaWNhMRIwEAYDVQQKEwlTbmFwIEluYy4xJTAjBgNV
        BAMTHExlYWYgQXR0ZXN0YXRpb24gQ0EgOTk5OTk5OTkwHhcNNzAwMTAxMDAwMDAwWhcNNDcxMjMx
        MTYwMDAwWjCBiDELMAkGA1UEBhMCVVMxEzARBgNVBAgMCkNhbGlmb3JuaWExFTATBgNVBAcMDFNh
        bnRhIE1vbmljYTESMBAGA1UEChMJU25hcCBJbmMuMTkwNwYDVQQDEzBzbmFwdGxzLWxpYi05NDVj
        NmI2OC1iYTI1LTRiODgtOWUxMS1kYzY0ZmRlNmNkNGQwWTATBgcqhkjOPQIBBggqhkjOPQMBBwNC
        AASwGI+Tgix09JQRPKpjksaTS7zMJbzkwu91ZGgC0xV9ivHtjSl+d/hhf1c4cIEcHxec9EanP/qm
        2i8WmXtbWLMoo4IBMDCCASwwDgYDVR0PAQH/BAQDAgeAMIIBGAYKKwYBBAHWeQIBEQSCAQgwggEE
        AgFkCgEBAgFkCgEBBDAAvIaMP/3T2iNmCDKCBTZM0TDmZjml5TbI8crT9jiZepLG8HEoIQTTE/We
        QCVcpyoEADAev4VFGgQYc25hcG9zLmtleXZhdWx0LmFuZHJvaWQAMIGhoQUxAwIBAqIDAgEDowQC
        AgEApQUxAwIBBaoDAgEBv4N3AgUAv4U+AwIBAL+FQEwwSgQgAAAAAAAAAAAAAAAAAAAAAAAAAAAA
        AAAAAAAAAAAAAAABAQAKAQIEIAdpfNJtRjtXn1IEprblJyQ+TnF4THJxrCQ6o7D6atCIv4VBBQID
        AfvQv4VCBQIDAxZAv4VOBgIEATSxAb+FTwYCBAE0sQEwCgYIKoZIzj0EAwIDSQAwRgIhANFa97zi
        lI05DiSLvTELxyzubinQt6w8Wv9zr+81LFKdAiEAlyLxPimMLTQShEouL+FtXeBpv7VphGhC9Lhb
        1qz2TeA=
    """

    private val certWithoutAttestation = """
        MIIB3TCCAYSgAwIBAgIQVtq9EQKy8Zs6Qb9oI3v6DzAKBggqhkjOPQQDAjApMRMwEQYDVQQKEwpH
        b29nbGUgTExDMRIwEAYDVQQDEwlEcm9pZCBDQTMwHhcNMjQxMTEzMDcxNzE3WhcNMjQxMjA4MTMy
        MTA3WjA5MSkwJwYDVQQDEyA1NmRhYmQxMTAyYjJmMTliM2E0MWJmNjgyMzdiZmEwZjEMMAoGA1UE
        ChMDVEVFMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEgCsDfq/lysV5ooK2ja48rbVySkILqT7h
        58RlL0Me2bgd0Lu3sAOOQRISyTzlyohwkrKyuhG9qYVv6ptmjqOXQ6N+MHwwHQYDVR0OBBYEFAT+
        AFE/6fuWGpv8DFKN4IHgejiyMB8GA1UdIwQYMBaAFFmrJ29qAjv60/rOsdDmSWDBffpqMA8GA1Ud
        EwEB/wQFMAMBAf8wDgYDVR0PAQH/BAQDAgIEMBkGCisGAQQB1nkCAR4EC6IBEANmR29vZ2xlMAoG
        CCqGSM49BAMCA0cAMEQCIGityoj7EoD0/bUR8mgIGyOO/dbyFJ+DoGNE4JqKpQbOAiBbTQ7YihOD
        NVadmi/Aqc+fN4JON1WIvM1+hRHqM8aoKA==
    """

    private val applicationDigest = byteArrayOf(
        20, -94, 89, 69, -82, 67, -62, 8, -63, -113, -52, -81, 43, -64, 75, -122, -106, 89, -122,
        -111, -52, -50, -16, -21, -59, 79, 33, 96, -114, -117, 2, -116
    )

    private val certPath = mock<CertPath>()
    private val certificateFactory = mock<CertificateFactory> {
        on { generateCertPath(any<List<Certificate>>()) } doReturn certPath
    }
    private val getCertificateFactory = mock<(String) -> CertificateFactory> {
        on { invoke(any()) } doReturn certificateFactory
    }

    private val certPathValidator = mock<CertPathValidator>()
    private val getCertPathValidator = mock<(String) -> CertPathValidator> {
        on { invoke(any()) } doReturn certPathValidator
    }

    private val subject = AndroidAttestationParser(getCertificateFactory, getCertPathValidator)

    @Test
    fun `parse()`() {
        val chain = listOf(
            loadCertificate(certWithoutAttestation) as X509Certificate,
            loadCertificate(certWithAttestation) as X509Certificate
        )
        val (attributes, certificate) = subject.parse(
            AuthenticationManager.Attestation.CertificateChain(chain),
            byteArrayOf(1, 2, 3)
        )

        assertEquals(chain.first(), certificate)

        val device = attributes.deviceProvision as SpectaclesStreamTrustManager.DeviceProvision.Android
        assertEquals(300, device.attestationVersion)
        assertEquals(1, device.attestationSecurityLevel)
        assertEquals(true, device.isDeviceLocked)
        assertEquals(0, device.verifiedBootState)

        val application = attributes.applicationProvision as SpectaclesStreamTrustManager.ApplicationProvision.Android
        assertEquals(1, application.applicationPackages.size)
        assertEquals(1, application.applicationPackages["com.snap.spectacles.kit.sample"])
        assertEquals(1, application.applicationDigests.size)
        assertTrue(applicationDigest.contentEquals(application.applicationDigests.first()))
    }

    @Test
    fun `parse(), no applicationId`() {
        val chain = listOf(
            loadCertificate(certWithAttestation) as X509Certificate,
            loadCertificate(certWithoutApplicationId) as X509Certificate
        )
        val (attributes, certificate) = subject.parse(
            AuthenticationManager.Attestation.CertificateChain(chain),
            byteArrayOf(
                0, -68, -122, -116, 63, -3, -45, -38, 35, 102, 8, 50, -126, 5, 54, 76, -47, 48, -26,
                102, 57, -91, -27, 54, -56, -15, -54, -45, -10, 56, -103, 122, -110, -58, -16, 113,
                40, 33, 4, -45, 19, -11, -98, 64, 37, 92, -89, 42
            )
        )

        assertEquals(chain.first(), certificate)

        val device = attributes.deviceProvision as SpectaclesStreamTrustManager.DeviceProvision.Android
        assertEquals(100, device.attestationVersion)
        assertEquals(1, device.attestationSecurityLevel)
        assertEquals(false, device.isDeviceLocked)
        assertEquals(2, device.verifiedBootState)

        val application = attributes.applicationProvision as SpectaclesStreamTrustManager.ApplicationProvision.Android
        assertEquals(0, application.applicationPackages.size)
        assertEquals(0, application.applicationDigests.size)
    }

    @Test(expected = SpectaclesStreamException::class)
    fun `parse(), incorrect challenge`() {
        val chain = listOf(
            loadCertificate(certWithoutAttestation) as X509Certificate,
            loadCertificate(certWithAttestation) as X509Certificate
        )
        subject.parse(
            AuthenticationManager.Attestation.CertificateChain(chain),
            byteArrayOf(1, 2, 3, 3)
        )
    }

    @Test(expected = SpectaclesStreamException::class)
    fun `parse(), no attestation`() {
        val chain = listOf(
            loadCertificate(certWithoutAttestation) as X509Certificate,
            loadCertificate(certWithoutAttestation) as X509Certificate
        )
        subject.parse(
            AuthenticationManager.Attestation.CertificateChain(chain),
            byteArrayOf(1, 2, 3)
        )
    }

    private fun loadCertificate(str: String): Certificate {
        return ByteArrayInputStream(
            "-----BEGIN CERTIFICATE-----\n$str\n-----END CERTIFICATE-----".toByteArray(Charsets.UTF_8)
        ).use { certInputStream ->
            CertificateFactory.getInstance("X.509")
                .generateCertificate(certInputStream)
        }
    }
}
