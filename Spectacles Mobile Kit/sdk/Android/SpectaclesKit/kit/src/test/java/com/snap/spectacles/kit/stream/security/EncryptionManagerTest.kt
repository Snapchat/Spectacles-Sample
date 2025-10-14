package com.snap.spectacles.kit.stream.security

import com.snap.spectacles.kit.KitBaseTest
import org.junit.Assert.assertEquals
import org.junit.Test
import org.junit.runner.RunWith
import org.junit.runners.JUnit4
import org.mockito.kotlin.mock
import java.io.InputStream
import java.io.OutputStream

@RunWith(JUnit4::class)
class EncryptionManagerTest : KitBaseTest() {

    @Test
    fun `Noop, setSecret()`() {
        EncryptionManager.Noop.setSecret(ByteArray(1), ByteArray(2))
    }

    @Test
    fun `Noop, update()`() {
        EncryptionManager.Noop.update(ByteArray(1))
    }

    @Test
    fun `Noop, createEncryptedStream()`() {
        val output = mock<OutputStream>()
        assertEquals(output, EncryptionManager.Noop.createEncryptedStream(output))
    }

    @Test
    fun `Noop, createDecryptedStream()`() {
        val input = mock<InputStream>()
        assertEquals(input, EncryptionManager.Noop.createDecryptedStream(input))
    }

    @Test
    fun `Noop, getEncryptionOverheadSize()`() {
        assertEquals(0, EncryptionManager.Noop.getEncryptionOverheadSize())
    }
}