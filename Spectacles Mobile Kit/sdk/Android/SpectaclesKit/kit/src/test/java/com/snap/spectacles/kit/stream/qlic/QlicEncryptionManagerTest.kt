package com.snap.spectacles.kit.stream.qlic

import com.snap.spectacles.kit.KitBaseTest
import com.snap.spectacles.kit.stream.utils.readBytes
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.junit.runners.JUnit4
import java.io.ByteArrayInputStream
import java.io.ByteArrayOutputStream

@RunWith(JUnit4::class)
class QlicEncryptionManagerTest : KitBaseTest() {

    private val clientSubject = QlicEncryptionManager(true)

    private val serverSubject = QlicEncryptionManager(false)

    @Before
    fun setup() {
        val secret = "QlicEncryptionManagerTest".toByteArray(Charsets.UTF_8)
        val salt = "setup".toByteArray(Charsets.UTF_8)
        clientSubject.setSecret(secret, salt)
        serverSubject.setSecret(secret, salt)
    }

    @Test
    fun `encryption, client to server`() {
        for (i in 0..256) {
            val raw = ByteArray(10) { i.toByte() }
            val encrypted = ByteArrayOutputStream(20)
            clientSubject.createEncryptedStream(encrypted).use {
                it.write(raw)
            }
            val decrypted = serverSubject.createDecryptedStream(ByteArrayInputStream(encrypted.toByteArray())).use {
                it.readBytes(10)
            }
            assertTrue(raw.contentEquals(decrypted))
        }
    }

    @Test
    fun `encryption, server to client`() {
        for (i in 0..256) {
            val raw = ByteArray(10) { i.toByte() }
            val encrypted = ByteArrayOutputStream(20)
            serverSubject.createEncryptedStream(encrypted).use {
                it.write(raw)
            }
            val decrypted = clientSubject.createDecryptedStream(ByteArrayInputStream(encrypted.toByteArray())).use {
                it.readBytes(10)
            }
            assertTrue(raw.contentEquals(decrypted))
        }
    }

    @Test
    fun `encryption after update, client to server`() {
        val salt = "update".toByteArray(Charsets.UTF_8)
        clientSubject.update(salt)
        serverSubject.update(salt)
        for (i in 0..256) {
            val raw = ByteArray(10) { i.toByte() }
            val encrypted = ByteArrayOutputStream(20)
            clientSubject.createEncryptedStream(encrypted).use {
                it.write(raw)
            }
            val decrypted = serverSubject.createDecryptedStream(ByteArrayInputStream(encrypted.toByteArray())).use {
                it.readBytes(10)
            }
            assertTrue(raw.contentEquals(decrypted))
        }
    }


    @Test
    fun `encryption after update, server to client`() {
        val salt = "update".toByteArray(Charsets.UTF_8)
        clientSubject.update(salt)
        serverSubject.update(salt)
        for (i in 0..256) {
            val raw = ByteArray(10) { i.toByte() }
            val encrypted = ByteArrayOutputStream(20)
            serverSubject.createEncryptedStream(encrypted).use {
                it.write(raw)
            }
            val decrypted = clientSubject.createDecryptedStream(ByteArrayInputStream(encrypted.toByteArray())).use {
                it.readBytes(10)
            }
            assertTrue(raw.contentEquals(decrypted))
        }
    }

    @Test
    fun `createEncryptedStream(), no secret`() {
        val subject = QlicEncryptionManager(true)
        val raw = ByteArray(10) { 2 }
        val encrypted = ByteArrayOutputStream(20)
        subject.createEncryptedStream(encrypted).use {
            it.write(raw)
        }
        assertTrue(raw.contentEquals(encrypted.toByteArray()))
    }

    @Test
    fun `createDecryptedStream(), no secret`() {
        val subject = QlicEncryptionManager(true)
        val raw = ByteArray(10) { 2 }
        val decrypted = subject.createDecryptedStream(ByteArrayInputStream(raw)).use {
            it.readBytes(10)
        }
        assertTrue(raw.contentEquals(decrypted))
    }

    @Test
    fun `getEncryptionOverheadSize()`() {
        assertEquals(16, clientSubject.getEncryptionOverheadSize())
    }
}
