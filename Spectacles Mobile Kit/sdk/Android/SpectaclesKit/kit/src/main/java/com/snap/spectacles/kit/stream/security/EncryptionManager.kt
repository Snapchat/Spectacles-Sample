package com.snap.spectacles.kit.stream.security

import java.io.InputStream
import java.io.OutputStream

/**
 * Manages encryption and decryption for secure data transmission.
 * Allows setting a secret and salt to derive an encryption key and provides
 * methods to create encrypted and decrypted streams.
 */
interface EncryptionManager {

    /**
     * Initializes the encryption key using the specified secret and salt.
     *
     * @param secret The primary secret for generating the encryption key.
     * @param salt Additional data to further secure key derivation.
     */
    fun setSecret(secret: ByteArray, salt: ByteArray)

    /**
     * Updates the encryption key using a new salt, re-deriving it based on the previously set secret.
     */
    fun update(salt: ByteArray)

    /**
     * Wraps an output stream with encryption, ensuring all data written to it is securely encrypted.
     *
     * @param output The output stream to be encrypted.
     * @return An encrypted version of the output stream.
     */
    fun createEncryptedStream(output: OutputStream): OutputStream

    /**
     * Wraps an input stream with decryption, ensuring all data read from it is securely decrypted.
     *
     * @param input The input stream to be decrypted.
     * @return A decrypted version of the input stream.
     */
    fun createDecryptedStream(input: InputStream): InputStream

    /**
     * Returns the extra size (in bytes) required for the specified encryption algorithm.
     */
    fun getEncryptionOverheadSize(): Int

    /**
     * A placeholder implementation of the EncryptionManager interface.
     */
    object Noop : EncryptionManager {
        override fun setSecret(secret: ByteArray, salt: ByteArray) = Unit
        override fun update(salt: ByteArray) = Unit
        override fun createEncryptedStream(output: OutputStream) = output
        override fun createDecryptedStream(input: InputStream) = input
        override fun getEncryptionOverheadSize() = 0
    }
}
