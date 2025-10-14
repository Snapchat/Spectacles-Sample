package com.snap.spectacles.kit.stream.security

import com.snap.spectacles.kit.stream.SpectaclesStreamException
import java.security.KeyFactory
import java.security.KeyPairGenerator
import java.security.spec.X509EncodedKeySpec
import javax.crypto.KeyAgreement

/**
 * KeyExchangeManager is responsible for securely exchanging cryptographic keys between two parties (peers)
 * using a secure key exchange algorithm such as Elliptic Curve Diffie-Hellman (ECDH).
 */
interface KeyExchangeManager {

    /**
     * Initiates the key exchange process by generating a public-private key pair.
     * The generated public key is intended to be shared with the peer.
     *
     * @return A byte array representing the public key to be sent to the peer.
     */
    fun initiateKeyExchange(): ByteArray

    /**
     * Completes the key exchange process by processing the peer's public key.
     * This method computes the shared secret based on the peer's provided public key.
     *
     * @param peerPublicKey The public key received from the peer as a byte array.
     * @throws SpectaclesStreamException if the key exchange process fails.
     */
    @Throws(SpectaclesStreamException::class)
    fun completeKeyExchange(peerPublicKey: ByteArray)

    /**
     * Retrieves the shared secret that was established after the key exchange process.
     *
     * @return A byte array representing the shared secret.
     */
    fun getSharedSecret(): ByteArray

    /**
     * Default implementation of KeyExchangeManager.
     */
    class Default(
        private val keyAgreementAlgorithm : String,
        private val keyAlgorithm : String,
        private val keySize : Int,
        private val getKeyAgreement: (String) -> KeyAgreement = KeyAgreement::getInstance,
        private val getKeyPairGenerator: (String) -> KeyPairGenerator = KeyPairGenerator::getInstance,
        private val getKeyFactory: (String) -> KeyFactory = KeyFactory::getInstance,
    ) : KeyExchangeManager {

        private val keyPair by lazy {
            getKeyPairGenerator(keyAlgorithm).run {
                initialize(keySize)
                generateKeyPair()
            }
        }

        private lateinit var sharedSecret: ByteArray

        override fun initiateKeyExchange(): ByteArray {
            return keyPair.public.encoded
        }

        override fun completeKeyExchange(peerPublicKey: ByteArray) {
            val peerKey = getKeyFactory(keyAlgorithm)
                .generatePublic(X509EncodedKeySpec(peerPublicKey))
            sharedSecret = getKeyAgreement(keyAgreementAlgorithm).run {
                init(keyPair.private)
                doPhase(peerKey, true)
                generateSecret()
            }
        }

        override fun getSharedSecret(): ByteArray = sharedSecret
    }

    /**
     * A placeholder implementation of the KeyExchangeManager interface.
     */
    object Noop : KeyExchangeManager {
        override fun initiateKeyExchange() = ByteArray(0)
        override fun completeKeyExchange(peerPublicKey: ByteArray) = Unit
        override fun getSharedSecret(): ByteArray = ByteArray(0)
    }
}
