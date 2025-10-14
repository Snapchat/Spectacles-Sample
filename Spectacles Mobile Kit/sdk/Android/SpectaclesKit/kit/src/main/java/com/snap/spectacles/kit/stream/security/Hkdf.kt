package com.snap.spectacles.kit.stream.security

import javax.crypto.Mac
import javax.crypto.spec.SecretKeySpec

/**
 * Implements HMAC-based Extract-and-Expand Key Derivation Function (HKDF).
 *
 * @param macAlgorithm The MAC algorithm to be used (e.g., "HmacSHA256") for HMAC-based key derivation.
 */
class Hkdf(
    private val macAlgorithm: String
) {
    /**
     * Extracts a pseudo-random key (PRK) from the input keying material (IKM) and an optional salt.
     *
     * @param ikm Input Keying Material, typically a shared secret.
     * @param salt Optional salt to increase randomness; if not provided, a zeroed array of the MAC
     *             algorithm's length is used.
     * @return Pseudo-random key derived from the IKM and salt.
     */
    fun extract(ikm: ByteArray, salt: ByteArray?): ByteArray {
        val mac = Mac.getInstance(macAlgorithm)
        mac.init(SecretKeySpec(salt ?: ByteArray(mac.macLength), macAlgorithm))
        return mac.doFinal(ikm)
    }

    /**
     * Expands a pseudo-random key (PRK) into an output key of the desired length, based on contextual
     * information.
     *
     * @param prk The pseudo-random key produced by the extract step.
     * @param info The contextual information that binds the derived key to a specific context or usage.
     * @param size Desired length of the expanded key (output key).
     * @return A derived key of the specified length, securely generated from the PRK.
     */
    fun expand(prk: ByteArray, info: ByteArray, size: Int): ByteArray {
        val result = ByteArray(size)
        var digest = ByteArray(0)
        var bytesCopied = 0
        var counter = 1.toByte()

        val mac = Mac.getInstance(macAlgorithm)
        mac.init(SecretKeySpec(prk, macAlgorithm))
        while (bytesCopied < size) {
            mac.update(digest)
            mac.update(info)
            mac.update(counter)
            digest = mac.doFinal()

            val bytesToCopy = minOf(digest.size, size - bytesCopied)
            System.arraycopy(digest, 0, result, bytesCopied, bytesToCopy)

            bytesCopied += bytesToCopy
            counter++
        }

        return result
    }
}
