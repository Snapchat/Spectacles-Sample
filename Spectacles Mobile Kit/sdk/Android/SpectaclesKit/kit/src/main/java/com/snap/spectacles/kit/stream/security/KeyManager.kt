package com.snap.spectacles.kit.stream.security

import android.os.Build
import android.security.keystore.KeyGenParameterSpec
import android.security.keystore.KeyProperties
import androidx.annotation.RequiresApi
import java.security.KeyPairGenerator
import java.security.KeyStore
import java.security.KeyStore.PrivateKeyEntry
import java.security.Signature
import java.security.cert.Certificate
import java.security.spec.ECGenParameterSpec

/**
 * Interface for managing local and peer cryptographic identities.
 */
interface KeyManager {

    /**
     * Generates a new local certificate based on a challenge from the peer.
     */
    fun updateLocalCertificate(challenge: ByteArray)

    /**
     * Returns the current local certificate used for peer authentication.
     */
    fun getLocalCertificateChain(): List<Certificate>?

    /**
     * Returns the Signature object initialized with the local private key.
     */
    fun getLocalSignature(): Signature

    /**
     * Updates the peer's certificate and associated attestation.
     */
    fun updatePeerCertificate(
        certificate: Certificate,
        attestation: AuthenticationManager.Attestation
    )

    /**
     * Returns the stored peer certificate, if available.
     */
    fun getPeerCertificate(): Certificate?

    /**
     * Returns the Signature object initialized with the peer's public key.
     */
    fun getPeerSignature(): Signature

    /**
     * Clears all stored certificates and associated key material.
     */
    fun clearCertificates()

    /**
     * Default implementation.
     */
    @RequiresApi(Build.VERSION_CODES.N)
    class Default(
        private val keyAlias: String,
        getKeyStore: (String) -> KeyStore = KeyStore::getInstance,
        private val getKeyPairGenerator: (String, String) -> KeyPairGenerator = KeyPairGenerator::getInstance,
        private val getKeyGenParameterSpec: (String, Int) -> KeyGenParameterSpec.Builder = KeyGenParameterSpec::Builder,
        private val getSignature: (String) -> Signature = Signature::getInstance
    ) : KeyManager {

        companion object {
            private const val ANDROID_KEY_STORE = "AndroidKeyStore"
            private const val KEY_EC_DOMAIN = "secp384r1"
            private const val ALIAS_SUFFIX_LOCAL = "_local"
            private const val ALIAS_SUFFIX_REMOTE = "_remote"
            private const val SIGNATURE_ALGORITHM = "SHA384withECDSA"
        }

        private val keyStore: KeyStore by lazy {
            getKeyStore(ANDROID_KEY_STORE)
                .apply {
                    load(null)
                }
        }

        private val localKeyAlias = "$keyAlias$ALIAS_SUFFIX_LOCAL"
        private val remoteKeyAlias = "$keyAlias$ALIAS_SUFFIX_REMOTE"

        override fun updateLocalCertificate(challenge: ByteArray) {
            val keyGen = getKeyPairGenerator(KeyProperties.KEY_ALGORITHM_EC, ANDROID_KEY_STORE)
            val keySpec = getKeyGenParameterSpec(localKeyAlias, KeyProperties.PURPOSE_SIGN)
                .setAlgorithmParameterSpec(ECGenParameterSpec(KEY_EC_DOMAIN))
                .setDigests(KeyProperties.DIGEST_SHA384)
                .setAttestationChallenge(challenge)
                .build()
            keyGen.initialize(keySpec)
            keyGen.generateKeyPair()
        }

        override fun getLocalCertificateChain(): List<Certificate>? {
            return getLocalKeyEntry()?.run {
                certificateChain.toList()
            }
        }

        override fun getLocalSignature(): Signature {
            return getSignature(SIGNATURE_ALGORITHM).apply {
                initSign(getLocalKeyEntry()!!.privateKey)
            }
        }

        override fun updatePeerCertificate(
            certificate: Certificate,
            attestation: AuthenticationManager.Attestation
        ) {
            keyStore.setCertificateEntry(remoteKeyAlias, certificate)
        }

        override fun getPeerCertificate(): Certificate? {
            return keyStore.getCertificate(remoteKeyAlias)
        }

        override fun getPeerSignature(): Signature {
            return getSignature(SIGNATURE_ALGORITHM).apply {
                initVerify(getPeerCertificate()!!)
            }
        }

        override fun clearCertificates() {
            if (keyStore.containsAlias(localKeyAlias)) {
                keyStore.deleteEntry(localKeyAlias)
            }
            if (keyStore.containsAlias(remoteKeyAlias)) {
                keyStore.deleteEntry(remoteKeyAlias)
            }
        }

        private fun getLocalKeyEntry(): PrivateKeyEntry? {
            return keyStore.getEntry(localKeyAlias, null) as PrivateKeyEntry?
        }
    }
}
