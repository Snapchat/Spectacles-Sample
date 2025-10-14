package com.snap.spectacles.kit.stream.qlic

import com.snap.spectacles.kit.KitBaseTest
import org.junit.Test
import org.junit.runner.RunWith
import org.junit.runners.JUnit4
import org.mockito.kotlin.any
import org.mockito.kotlin.doThrow
import org.mockito.kotlin.mock
import org.mockito.kotlin.never
import org.mockito.kotlin.times
import org.mockito.kotlin.verify
import org.mockito.kotlin.whenever
import java.io.IOException
import java.io.OutputStream

@RunWith(JUnit4::class)
class QlicPacketWriterTest : KitBaseTest() {

    private val packetSupplier = mock<() -> Pair<QlicPacket.Out, () -> Unit>?>()
    private val onError = mock<(Exception) -> Unit>()
    private val onStop = mock<() -> Unit>()

    @Test
    fun `write(), packets`() {
        val packet1 = QlicPacket.Out(10).apply {
            getBody().write(1)
        }
        val callback = mock<() -> Unit>()
        val packet2 = QlicPacket.Out(10).apply {
            getBody().write(byteArrayOf(1, 2, 3))
        }
        whenever(packetSupplier.invoke()).thenReturn(packet1 to callback, packet2 to mock(), null)

        val output = mock<OutputStream>()
        val subject = QlicPacketWriter(output, packetSupplier, onError, onStop)
        subject.start()
        subject.join()
        verify(output, times(2)).write(any(), any(), any())
        verify(callback).invoke()
        verify(onError, never()).invoke(any())
        verify(onStop).invoke()
    }

    @Test
    fun `write(), EOF`() {
        val subject = QlicPacketWriter(mock(), packetSupplier, onError, onStop)
        subject.start()
        subject.join()
        verify(onError, never()).invoke(any())
        verify(onStop).invoke()
    }

    @Test
    fun `read(), error`() {
        val packet = QlicPacket.Out(10).apply {
            getBody().write(1)
        }
        whenever(packetSupplier.invoke()).thenReturn(packet to mock())
        val error = IOException()
        val output = mock<OutputStream> {
            on { write(any<ByteArray>(), any(), any()) } doThrow error
        }
        val subject = QlicPacketWriter(output, packetSupplier, onError, onStop)
        subject.start()
        subject.join()
        verify(onError).invoke(error)
        verify(onStop, never()).invoke()
    }

    @Test
    fun `write(), shutdown`() {
        val subject = QlicPacketWriter(mock(), packetSupplier, onError, onStop)
        subject.shutdown()
        subject.start()
        subject.join()
        verify(packetSupplier, never()).invoke()
        verify(onError, never()).invoke(any())
        verify(onStop).invoke()
    }

    @Test
    fun `toString()`() {
        QlicPacketWriter(mock(), packetSupplier, onError, onStop).toString()
    }

    @Test
    fun `Factory create()`() {
        QlicPacketWriter.Factory.create(mock(), packetSupplier, onError, onStop)
    }
}
