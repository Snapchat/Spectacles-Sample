package com.snap.spectacles.kit.stream.smkp

import com.snap.spectacles.kit.KitBaseTest
import com.snap.spectacles.kit.stream.SpectaclesStreamConnection
import com.snap.spectacles.kit.stream.SpectaclesStreamException
import com.snap.spectacles.kit.stream.SpectaclesStreamPayload
import com.snap.spectacles.kit.stream.utils.SpectaclesStreamBytesPayload
import org.junit.Test
import org.junit.runner.RunWith
import org.junit.runners.JUnit4
import org.mockito.kotlin.any
import org.mockito.kotlin.argThat
import org.mockito.kotlin.doReturn
import org.mockito.kotlin.eq
import org.mockito.kotlin.mock
import org.mockito.kotlin.verify
import java.util.concurrent.Executor

@RunWith(JUnit4::class)
class SmkpBaseStreamClientTest : KitBaseTest() {

    class Subject(
        onResponse: OnResponse?,
        onClose: () -> Unit,
        connection: SpectaclesStreamConnection,
        executor: Executor,
        unpack: (SpectaclesStreamPayload) -> SmkpMessage,
        pack: (SmkpMessage) -> SpectaclesStreamPayload,
        format: (SpectaclesStreamException) -> SmkpMessage
    ) : SmkpBaseStreamClient(onResponse, onClose, connection, executor, unpack, pack, format) {

        fun runStartStream() {
            startStream(mock(), mock())
        }

        fun runOnReceive(message: SmkpMessage, priority: Int, last: Boolean) {
            onReceive(message, priority, last)
        }
    }

    private val connection = mock<SpectaclesStreamConnection> {
        on { startStream(any(), any()) } doReturn mock()
    }

    private val onResponse = mock<SmkpBaseStreamClient.OnResponse>()
    private val onClose = mock<() -> Unit>()

    private val subject = Subject(onResponse, onClose, connection, mock(), mock(), mock(), mock())

    @Test
    fun `close()`() {
        subject.close()
        verify(onClose).invoke()
    }

    @Test
    fun `startStream()`() {
        subject.runStartStream()
        verify(connection).startStream(any(), any())
    }

    @Test(expected = SpectaclesStreamException::class)
    fun `onReceive(), Request`() {
        subject.runOnReceive(mock<SmkpMessage.Request>(), 0, false)
    }

    @Test
    fun `onReceive(), call onResponse()`() {
        val header = SmkpMessage.Header()
        val body = "hello".toByteArray(Charsets.UTF_8)
        val message = SmkpMessage.Response(
            SmkpMessage.RESPONSE,
            0,
            header,
            SpectaclesStreamBytesPayload(body)
        )
        subject.runOnReceive(message, 3, true)
        verify(onResponse).invoke(eq(0), eq(header), argThat { contentEquals(body) }, eq(3), eq(true))
    }

    @Test(expected = SpectaclesStreamException::class)
    fun `onReceive(), no onResponse()`() {
        val header = SmkpMessage.Header()
        val body = "hello".toByteArray(Charsets.UTF_8)
        val message = SmkpMessage.Response(
            SmkpMessage.RESPONSE,
            0,
            header,
            SpectaclesStreamBytesPayload(body)
        )

        Subject(null, onClose, connection, mock(), mock(), mock(), mock())
            .runOnReceive(message, 3, true)
    }
}
