package com.snap.spectacles.kit.stream.security

import android.os.Build
import androidx.annotation.RequiresApi
import com.snap.spectacles.kit.stream.SpectaclesStreamException
import com.snap.spectacles.kit.stream.SpectaclesStreamTrustManager
import org.bouncycastle.asn1.ASN1Boolean
import org.bouncycastle.asn1.ASN1Enumerated
import org.bouncycastle.asn1.ASN1Integer
import org.bouncycastle.asn1.ASN1OctetString
import org.bouncycastle.asn1.ASN1Sequence
import org.bouncycastle.asn1.ASN1Set
import org.bouncycastle.asn1.ASN1TaggedObject
import java.security.cert.CertPathValidator
import java.security.cert.Certificate
import java.security.cert.CertificateFactory
import java.security.cert.PKIXParameters
import java.security.cert.TrustAnchor
import java.security.cert.X509Certificate

/**
 * Extracts the attestation information from a list of certificates.
 */
@RequiresApi(Build.VERSION_CODES.O)
internal class AndroidAttestationParser(
    private val getCertificateFactory: (String) -> CertificateFactory = CertificateFactory::getInstance,
    private val getCertPathValidator: (String) -> CertPathValidator = CertPathValidator::getInstance
) {

    companion object {
        private const val ANDROID_ATTESTATION_EXTENSION_OID = "1.3.6.1.4.1.11129.2.1.17"
        private const val ATTESTATION_VERSION_INDEX = 0
        private const val ATTESTATION_SECURITY_LEVEL_INDEX = 1
        private const val ATTESTATION_CHALLENGE_INDEX = 4
        private const val SW_ENFORCED_INDEX = 6
        private const val HW_ENFORCED_INDEX = 7
        private const val KM_TAG_ATTESTATION_APPLICATION_ID: Int = 709
        private const val KM_TAG_ROOT_OF_TRUST: Int = 704
        private const val ATTESTATION_APPLICATION_ID_PACKAGE_INFOS_INDEX: Int = 0
        private const val ATTESTATION_APPLICATION_ID_SIGNATURE_DIGESTS_INDEX: Int = 1
        private const val ATTESTATION_PACKAGE_INFO_PACKAGE_NAME_INDEX: Int = 0
        private const val ATTESTATION_PACKAGE_INFO_VERSION_INDEX: Int = 1
        private const val ROOT_OF_TRUST_DEVICE_LOCKED_INDEX: Int = 1
        private const val ROOT_OF_TRUST_VERIFIED_BOOT_STATE_INDEX: Int = 2
    }

    /**
     * Extracts the attestation information from a list of certificates. The most reliable attestation
     * data is expected in the last certificate.
     *
     * @param attestation List of certificates.
     * @param challenge The challenge.
     * @return An [AndroidAttestationParser] object if attestation is available, or null if not.
     */
    fun parse(
        attestation: AuthenticationManager.Attestation.CertificateChain,
        challenge: ByteArray
    ): Pair<SpectaclesStreamTrustManager.SecurityAttributes, Certificate> {
        attestation.chain.checkValidity()

        for (cert in attestation.chain.asReversed()) {
            if (cert !is X509Certificate) continue

            val ext = cert.getExtensionValue(ANDROID_ATTESTATION_EXTENSION_OID) ?: continue
            val asn1 = ASN1OctetString.getInstance(ext).decodeToASN1Sequence()

            val attestationChallenge = (asn1.getObjectAt(ATTESTATION_CHALLENGE_INDEX) as ASN1OctetString).octets
            if (!challenge.contentEquals(attestationChallenge)) {
                throw SpectaclesStreamException(SpectaclesStreamException.UNAUTHORIZED, "Challenge incorrect")
            }
            val attestationVersion = (asn1.getObjectAt(ATTESTATION_VERSION_INDEX) as ASN1Integer)
                .value.toInt()
            val attestationSecurityLevel = (asn1.getObjectAt(ATTESTATION_SECURITY_LEVEL_INDEX) as ASN1Enumerated)
                .value.toInt()

            val hardware = asn1.getObjectAt(HW_ENFORCED_INDEX) as ASN1Sequence
            val rootOfTrustTag = hardware.find {
                (it as ASN1TaggedObject).tagNo == KM_TAG_ROOT_OF_TRUST
            } as ASN1TaggedObject
            val rootOfTrust = rootOfTrustTag.baseObject as ASN1Sequence
            val deviceLocked = (rootOfTrust.getObjectAt(ROOT_OF_TRUST_DEVICE_LOCKED_INDEX) as ASN1Boolean).isTrue
            val verifiedBootState =
                (rootOfTrust.getObjectAt(ROOT_OF_TRUST_VERIFIED_BOOT_STATE_INDEX) as ASN1Enumerated).value.toInt()
            val deviceProvision = SpectaclesStreamTrustManager.DeviceProvision.Android(
                deviceLocked,
                verifiedBootState,
                attestationVersion,
                attestationSecurityLevel
            )

            val software = asn1.getObjectAt(SW_ENFORCED_INDEX) as ASN1Sequence
            val applicationIdTag = software.find {
                (it as ASN1TaggedObject).tagNo == KM_TAG_ATTESTATION_APPLICATION_ID
            } as ASN1TaggedObject
            val applicationProvision = try {
                val applicationId = (applicationIdTag.baseObject as ASN1OctetString).decodeToASN1Sequence()
                val packages = applicationId.getObjectAt(ATTESTATION_APPLICATION_ID_PACKAGE_INFOS_INDEX) as ASN1Set
                val applicationPackages = packages.associate {
                    val info = it as ASN1Sequence
                    val id = info.getObjectAt(ATTESTATION_PACKAGE_INFO_PACKAGE_NAME_INDEX) as ASN1OctetString
                    val version = info.getObjectAt(ATTESTATION_PACKAGE_INFO_VERSION_INDEX) as ASN1Integer
                    id.octets.toString(Charsets.UTF_8) to version.value.toInt()
                }
                val digests = applicationId.getObjectAt(ATTESTATION_APPLICATION_ID_SIGNATURE_DIGESTS_INDEX) as ASN1Set
                val applicationDigests = digests.map {
                    (it as ASN1OctetString).octets
                }
                SpectaclesStreamTrustManager.ApplicationProvision.Android(
                    applicationPackages,
                    applicationDigests
                )
            } catch (_: Exception) {
                SpectaclesStreamTrustManager.ApplicationProvision.Android(
                    emptyMap(),
                    emptyList()
                )
            }

            val deviceType = DeviceTypeIdentifier.resolveDeviceType(attestation.chain.last())
            return SpectaclesStreamTrustManager.SecurityAttributes(
                deviceType, deviceProvision, applicationProvision
            ) to attestation.chain.first()
        }

        throw SpectaclesStreamException(SpectaclesStreamException.UNAUTHORIZED, "Missing key attestation")
    }

    /**
     * Checks the validity of the certificate chain.
     */
    private fun List<Certificate>.checkValidity() {
        val certPath = getCertificateFactory("X.509")
            .generateCertPath(this)

        // Use the last cert as root (self-signed)
        val trustedRoot = TrustAnchor(last() as X509Certificate, null)
        val pkixParams = PKIXParameters(setOf(trustedRoot)).apply {
            isRevocationEnabled = false
        }

        getCertPathValidator("PKIX")
            .validate(certPath, pkixParams)
    }

    private fun ASN1OctetString.decodeToASN1Sequence(): ASN1Sequence {
        return ASN1Sequence.getInstance(octets)
    }
}
