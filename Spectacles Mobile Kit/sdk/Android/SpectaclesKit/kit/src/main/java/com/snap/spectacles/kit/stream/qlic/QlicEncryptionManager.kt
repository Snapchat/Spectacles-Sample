package com.snap.spectacles.kit.stream.qlic

import com.snap.spectacles.kit.stream.security.EncryptionManager
import com.snap.spectacles.kit.stream.security.Hkdf
import com.snap.spectacles.kit.util.Log
import java.io.InputStream
import java.io.OutputStream
import java.nio.ByteBuffer
import java.nio.ByteOrder
import javax.crypto.Cipher
import javax.crypto.CipherInputStream
import javax.crypto.CipherOutputStream
import javax.crypto.spec.GCMParameterSpec
import javax.crypto.spec.SecretKeySpec
import kotlin.experimental.xor

private const val TAG = "QlicEncryptionManager"

/**
 * Manages encryption and decryption using HKDF-based key derivation and AES-GCM encryption.
 * Supports setting up encryption and decryption streams and derives keys based on client-server role.
 *
 * @param isClient Specifies whether this instance is on the client side.
 * @param hkdf HKDF instance used for key derivation with HMAC-SHA256.
 */
class QlicEncryptionManager(
    private val isClient: Boolean,
    private val hkdf: Hkdf = Hkdf("HmacSHA384")
) : EncryptionManager {

    companion object {
        private const val CIPHER_ALGORITHM = "AES"
        private const val CIPHER_TRANSFORMATION = "$CIPHER_ALGORITHM/GCM/NoPadding"
        private const val CIPHER_OVERHEAD_SIZE = 16

        private val HKDF_LABEL_PREFIX = "qlic ".toByteArray(Charsets.UTF_8)
        private const val HKDF_LABEL_ROOT_DERIVED = "derived"
        private const val HKDF_LABEL_HANDSHAKE_DERIVED = "Handshakederived"
        private const val HKDF_LABEL_SESSION_DERIVED = "Sessionderived"
        private const val HKDF_LABEL_CLIENT_HANDSHAKE = "c hs traffic"
        private const val HKDF_LABEL_SERVER_HANDSHAKE = "s hs traffic"
        private const val HKDF_LABEL_CLIENT_SESSION = "c ap traffic"
        private const val HKDF_LABEL_SERVER_SESSION = "s ap traffic"
        private const val HKDF_LABEL_KEY = "key"
        private const val HKDF_LABEL_IV = "iv"
        private const val HKDF_DERIVED_KEY_SIZE = 48

        private const val ENCRYPTION_KEY_SIZE = 16
        private const val ENCRYPTION_IV_SIZE = 12
    }
    
    private val log = Log.get(TAG)

    @Volatile
    private var encryptionKey = ByteArray(0)

    @Volatile
    private var encryptionIv = ByteArray(0)

    private val encryptionCounter = ByteArray(ENCRYPTION_IV_SIZE)

    @Volatile
    private var decryptionKey = ByteArray(0)

    @Volatile
    private var decryptionIv = ByteArray(0)

    private val decryptionCounter = ByteArray(ENCRYPTION_IV_SIZE)

    @Volatile
    private var rootSecret: ByteArray? = null

    override fun setSecret(secret: ByteArray, salt: ByteArray) {
        log.debug { "setSecret()" }

        // Derive an initial prk
        val prk = hkdf.extract(secret, ByteArray(HKDF_DERIVED_KEY_SIZE))

        // Derive the root secret using the initial prk
        rootSecret = hkdf.expand(prk, HKDF_LABEL_ROOT_DERIVED, salt, HKDF_DERIVED_KEY_SIZE)

        // Derive encryption/decryption keys and IVs based on client/server role
        deriveEncryptionKey(
            secretLabel = HKDF_LABEL_HANDSHAKE_DERIVED,
            clientLabel = HKDF_LABEL_CLIENT_HANDSHAKE,
            serverLabel = HKDF_LABEL_SERVER_HANDSHAKE,
            salt = salt
        )
    }

    override fun update(salt: ByteArray) {
        log.debug { "update()" }

        // Re-derive encryption/decryption keys and IVs based on client/server role
        deriveEncryptionKey(
            secretLabel = HKDF_LABEL_SESSION_DERIVED,
            clientLabel = HKDF_LABEL_CLIENT_SESSION,
            serverLabel = HKDF_LABEL_SERVER_SESSION,
            salt = salt
        )
    }

    private fun deriveEncryptionKey(secretLabel: String, clientLabel: String, serverLabel: String, salt: ByteArray) {
        // Derive a handshake secret using the initial prk
        val secret = hkdf.expand(rootSecret!!, secretLabel, salt, HKDF_DERIVED_KEY_SIZE)

        // Derive client and server specific secrets
        val clientSecret = hkdf.expand(secret, clientLabel, ByteArray(0), HKDF_DERIVED_KEY_SIZE)
        val serverSecret = hkdf.expand(secret, serverLabel, ByteArray(0), HKDF_DERIVED_KEY_SIZE)

        // Derive encryption/decryption keys and IVs based on client/server role
        val clientKey = hkdf.expand(clientSecret, HKDF_LABEL_KEY, ByteArray(0), ENCRYPTION_KEY_SIZE)
        val clientIV = hkdf.expand(clientSecret, HKDF_LABEL_IV, ByteArray(0), ENCRYPTION_IV_SIZE)
        val serverKey = hkdf.expand(serverSecret, HKDF_LABEL_KEY, ByteArray(0), ENCRYPTION_KEY_SIZE)
        val serverIV = hkdf.expand(serverSecret, HKDF_LABEL_IV, ByteArray(0), ENCRYPTION_IV_SIZE)

        if (isClient) {
            encryptionKey = clientKey
            encryptionIv = clientIV
            decryptionKey = serverKey
            decryptionIv = serverIV
        } else {
            encryptionKey = serverKey
            encryptionIv = serverIV
            decryptionKey = clientKey
            decryptionIv = clientIV
        }

        decryptionCounter.fill(0)
        encryptionCounter.fill(0)
    }

    override fun createEncryptedStream(output: OutputStream): OutputStream {
        return if (encryptionKey.isNotEmpty()) {
            val iv = encryptionIv.xor(encryptionCounter)
            encryptionCounter.increment()

            val cipher = Cipher.getInstance(CIPHER_TRANSFORMATION)
            cipher.init(
                Cipher.ENCRYPT_MODE,
                SecretKeySpec(encryptionKey, CIPHER_ALGORITHM),
                GCMParameterSpec(128, iv)
            )
            CipherOutputStream(output, cipher)
        } else {
            output
        }
    }

    override fun createDecryptedStream(input: InputStream): InputStream {
        return if (decryptionKey.isNotEmpty()) {
            val iv = decryptionIv.xor(decryptionCounter)
            decryptionCounter.increment()

            val cipher = Cipher.getInstance(CIPHER_TRANSFORMATION)
            cipher.init(
                Cipher.DECRYPT_MODE,
                SecretKeySpec(decryptionKey, CIPHER_ALGORITHM),
                GCMParameterSpec(128, iv)
            )
            CipherInputStream(input, cipher)
        } else {
            input
        }
    }

    override fun getEncryptionOverheadSize(): Int = CIPHER_OVERHEAD_SIZE

    /**
     * Increments a byte array counter in-place, handling overflow.
     */
    private fun ByteArray.increment() {
        for (i in indices.reversed()) {
            this[i] = ++this[i]
            if (this[i] != 0.toByte()) {
                break
            }
        }
    }

    /**
     * XORs this byte array with a counter byte array.
     *
     * @param counter The counter byte array to XOR with.
     * @return A new byte array resulting from XOR of this array with the counter.
     */
    private fun ByteArray.xor(counter: ByteArray): ByteArray {
        val result = copyOf()
        for (i in 0 until size.coerceAtMost(counter.size)) {
            result[i] = result[i] xor counter[i]
        }
        return result
    }

    /**
     * Custom HKDF expand function to derive keys.
     *
     * @param prk The pseudorandom key derived from previous HKDF extraction.
     * @param labelString Descriptive label for the expansion context.
     * @param context Additional context-specific data.
     * @param size Desired output size.
     * @return Derived key.
     */
    private fun Hkdf.expand(
        prk: ByteArray,
        labelString: String,
        context: ByteArray,
        size: Int
    ): ByteArray {
        val label = labelString.toByteArray(Charsets.UTF_8)
        val info = ByteBuffer.allocate(4 + HKDF_LABEL_PREFIX.size + label.size + context.size)
            .order(ByteOrder.BIG_ENDIAN)
            .putShort(size.toShort())
            .put((HKDF_LABEL_PREFIX.size + label.size).toByte())
            .put(HKDF_LABEL_PREFIX)
            .put(label)
            .put(context.size.toByte())
            .put(context)
            .array()
        return expand(prk, info, size)
    }
}
