package com.snap.spectacles.kit.stream.qlic

import com.snap.spectacles.kit.KitBaseTest
import org.junit.Test
import org.junit.runner.RunWith
import org.junit.runners.JUnit4
import org.mockito.kotlin.any
import org.mockito.kotlin.argThat
import org.mockito.kotlin.doThrow
import org.mockito.kotlin.mock
import org.mockito.kotlin.never
import org.mockito.kotlin.verify
import java.io.ByteArrayInputStream
import java.io.IOException
import java.io.InputStream

@RunWith(JUnit4::class)
class QlicPacketReaderTest : KitBaseTest() {

    private val onReceive = mock<(QlicPacket.In) -> Unit>()
    private val onError = mock<(Exception) -> Unit>()
    private val onStop = mock<() -> Unit>()

    @Test
    fun `read(), packets`() {
        val input = ByteArrayInputStream(byteArrayOf(1, 0, 3, 1, 2, 3))
        val subject = QlicPacketReader(input, onReceive, onError, onStop)
        subject.start()
        subject.join()
        verify(onReceive).invoke(argThat { size() == 2 })
        verify(onReceive).invoke(argThat { size() == 4 })
        verify(onError, never()).invoke(any())
        verify(onStop).invoke()
    }

    @Test
    fun `read(), EOF`() {
        val input = ByteArrayInputStream(byteArrayOf())
        val subject = QlicPacketReader(input, onReceive, onError, onStop)
        subject.start()
        subject.join()
        verify(onReceive, never()).invoke(any())
        verify(onError, never()).invoke(any())
        verify(onStop).invoke()
    }

    @Test
    fun `read(), error`() {
        val error = IOException()
        val input = mock<InputStream> {
            on { read() } doThrow error
        }
        val subject = QlicPacketReader(input, onReceive, onError, onStop)
        subject.start()
        subject.join()
        verify(onReceive, never()).invoke(any())
        verify(onError).invoke(error)
        verify(onStop, never()).invoke()
    }

    @Test
    fun `read(), shutdown`() {
        val input = ByteArrayInputStream(byteArrayOf())
        val subject = QlicPacketReader(input, onReceive, onError, onStop)
        subject.shutdown()
        subject.start()
        subject.join()
        verify(onReceive, never()).invoke(any())
        verify(onError, never()).invoke(any())
        verify(onStop).invoke()
    }

    @Test
    fun `toString()`() {
        QlicPacketReader(ByteArrayInputStream(byteArrayOf()), onReceive, onError, onStop).toString()
    }

    @Test
    fun `Factory create()`() {
        QlicPacketReader.Factory.create(ByteArrayInputStream(byteArrayOf()), onReceive, onError, onStop)
    }
}
