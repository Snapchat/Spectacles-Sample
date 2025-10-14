package com.snap.spectacles.kit.stream.l2cap

import android.bluetooth.BluetoothSocket
import com.snap.spectacles.kit.KitBaseTest
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import org.junit.runners.JUnit4
import org.mockito.kotlin.doReturn
import org.mockito.kotlin.mock
import org.mockito.kotlin.verify
import java.io.InputStream
import java.io.OutputStream

@RunWith(JUnit4::class)
class SpectaclesL2capEndpointSocketTest : KitBaseTest() {

    private val input = mock<InputStream>()
    private val output = mock<OutputStream>()
    private val bluetoothSocket = mock<BluetoothSocket> {
        on { inputStream } doReturn input
        on { outputStream } doReturn output
    }

    private val subject = SpectaclesL2capEndpointSocket(bluetoothSocket, 200)

    @Test
    fun `explicit properties`() {
        assertEquals(input, subject.inputStream)
        assertEquals(output, subject.outputStream)
        assertEquals(200, subject.preferredTransmitPacketSize)
    }

    @Test
    fun `implicit properties`() {
        val subject = SpectaclesL2capEndpointSocket(bluetoothSocket)
        assertEquals(input, subject.inputStream)
        assertEquals(output, subject.outputStream)
        assertEquals(1000, subject.preferredTransmitPacketSize)
    }

    @Test
    fun `close()`() {
        subject.close()
        verify(bluetoothSocket).close()
    }

    @Test
    fun `toString()`() {
        assertTrue(subject.toString().startsWith("SpectaclesL2capEndpointSocket(socket ="))
    }
}
