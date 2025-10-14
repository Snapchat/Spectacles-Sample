package com.snap.spectacles.kit.stream.inet

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
import java.net.Socket

@RunWith(JUnit4::class)
class SpectaclesInetEndpointSocketTest : KitBaseTest() {

    private val input = mock<InputStream>()
    private val output = mock<OutputStream>()
    private val socket = mock<Socket> {
        on { inputStream } doReturn input
        on { outputStream } doReturn output
    }

    private val subject = SpectaclesInetEndpointSocket(socket, 200)

    @Test
    fun `explicit properties`() {
        assertEquals(input, subject.inputStream)
        assertEquals(output, subject.outputStream)
        assertEquals(200, subject.preferredTransmitPacketSize)
    }

    @Test
    fun `implicit properties`() {
        val subject = SpectaclesInetEndpointSocket(socket)
        assertEquals(input, subject.inputStream)
        assertEquals(output, subject.outputStream)
        assertEquals(32 * 1024, subject.preferredTransmitPacketSize)
    }

    @Test
    fun `close()`() {
        subject.close()
        verify(socket).close()
    }

    @Test
    fun `toString()`() {
        assertTrue(subject.toString().startsWith("SpectaclesInetEndpointSocket(socket ="))
    }
}
