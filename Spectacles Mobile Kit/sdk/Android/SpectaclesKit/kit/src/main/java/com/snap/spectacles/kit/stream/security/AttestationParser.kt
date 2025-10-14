package com.snap.spectacles.kit.stream.security

import android.os.Build
import androidx.annotation.RequiresApi
import com.snap.spectacles.kit.stream.SpectaclesStreamTrustManager
import java.security.cert.Certificate

/**
 * A class responsible for parsing different types of attestations (Android and iOS).
 *
 * @property androidParser An instance of the Android attestation handler.
 * @property iosParser An instance of the iOS attestation handler.
 */
@RequiresApi(Build.VERSION_CODES.O)
internal class AttestationParser(
    private val androidParser: AndroidAttestationParser = AndroidAttestationParser(),
    private val iosParser: IosAttestationParser = IosAttestationParser()
) {

    /**
     * Parses the provided attestation and extracts the relevant security attributes and certificate.
     */
    fun parse(
        attestation: AuthenticationManager.Attestation,
        challenge: ByteArray
    ): Pair<SpectaclesStreamTrustManager.SecurityAttributes, Certificate> {
        return when (attestation) {
            is AuthenticationManager.Attestation.CertificateChain ->
                androidParser.parse(attestation, challenge)
            is AuthenticationManager.Attestation.IosSpecific ->
                iosParser.parse(attestation, challenge)
        }
    }
}
