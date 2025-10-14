package com.snap.spectacles.kit.stream.smkp

import com.snap.spectacles.kit.KitBaseTest
import com.snap.spectacles.kit.stream.SpectaclesStream
import com.snap.spectacles.kit.stream.SpectaclesStreamConnection
import com.snap.spectacles.kit.stream.utils.SpectaclesStreamBytesPayload
import org.junit.Test
import org.junit.runner.RunWith
import org.junit.runners.JUnit4
import org.mockito.kotlin.any
import org.mockito.kotlin.anyOrNull
import org.mockito.kotlin.argThat
import org.mockito.kotlin.clearInvocations
import org.mockito.kotlin.doAnswer
import org.mockito.kotlin.doReturn
import org.mockito.kotlin.eq
import org.mockito.kotlin.mock
import org.mockito.kotlin.never
import org.mockito.kotlin.times
import org.mockito.kotlin.verify
import java.util.concurrent.Executor

@RunWith(JUnit4::class)
class SmkpDownloadStreamClientTest : KitBaseTest() {

    private val executor = mock<Executor> {
        on { execute(any()) } doAnswer { it.getArgument<Runnable>(0).run() }
    }

    private val stream = mock<SpectaclesStream>()
    private val connection = mock<SpectaclesStreamConnection> {
        on { startStream(any(), any()) } doReturn stream
    }

    private val writer = mock<SmkpDownloadStreamClient.Writer>()
    private val onDownload = mock<SmkpDownloadStreamClient.OnDownload> {
        on { invoke(any(), anyOrNull(), any(), any()) } doReturn writer
    }

    private val onNotModified = mock<SmkpDownloadStreamClient.OnNotModified>()

    private val onFailed = mock<SmkpDownloadStreamClient.OnFailed>()

    private val subject = SmkpDownloadStreamClient(
        connection,
        executor,
        mock(),
        onDownload,
        onNotModified,
        onFailed
    )

    @Test
    fun `downlaod(), not modified`() {
        subject.download(
            SmkpDownloadStreamClient.Source(
                "path",
                "ver",
                100,
                8000
            ),
            1
        )
        verify(connection).startStream(any(), any())

        val response = SmkpMessage.Response(
            SmkpMessage.RESPONSE,
            304,
            SmkpMessage.Header(),
            SpectaclesStreamBytesPayload.Empty
        )
        subject.onReceiveResponse(response, 0, true)
        verify(onNotModified).invoke("path")
    }

    @Test
    fun `downlaod(), failed`() {
        subject.token = "123"
        subject.download(
            SmkpDownloadStreamClient.Source(
                "path"
            ),
            1
        )
        verify(connection).startStream(any(), any())

        val body = "error".toByteArray(Charsets.UTF_8)
        val response = SmkpMessage.Response(
            SmkpMessage.RESPONSE,
            4,
            SmkpMessage.Header(),
            SpectaclesStreamBytesPayload(body)
        )
        subject.onReceiveResponse(response, 0, true)
        verify(onFailed).invoke(eq("path"), eq(4), argThat { contentEquals(body) })
    }

    @Test
    fun `downlaod(), initial, last`() {
        subject.token = "123"
        subject.download(
            SmkpDownloadStreamClient.Source(
                "path",
                "ver"
            ),
            1
        )
        verify(connection).startStream(any(), any())

        val body = "content".toByteArray(Charsets.UTF_8)
        val header = SmkpMessage.Header().apply {
            add("v", "abc")
            add("f", 10)
            add("s", 2000)
        }
        val response = SmkpMessage.Response(
            SmkpMessage.RESPONSE,
            0,
            header,
            SpectaclesStreamBytesPayload(body)
        )
        subject.onReceiveResponse(response, 0, true)
        verify(onDownload).invoke(eq("path"), eq("abc"), eq(2000), eq(10))
        verify(writer).write(argThat { contentEquals(body) })
        verify(writer).close()
        verify(stream).send(any(), anyOrNull())
    }

    @Test
    fun `downlaod(), initial, not last`() {
        subject.token = "123"
        subject.download(
            SmkpDownloadStreamClient.Source(
                "path",
                "ver"
            ),
            1
        )
        verify(connection).startStream(any(), any())

        val body = "content".toByteArray(Charsets.UTF_8)
        val header = SmkpMessage.Header().apply {
            add("v", "abc")
            add("f", 10)
            add("s", 2000)
        }
        val response = SmkpMessage.Response(
            SmkpMessage.RESPONSE,
            0,
            header,
            SpectaclesStreamBytesPayload(body)
        )
        subject.onReceiveResponse(response, 0, false)
        verify(onDownload).invoke(eq("path"), eq("abc"), eq(2000), eq(10))
        verify(writer).write(argThat { contentEquals(body) })
        verify(writer, never()).close()
        verify(stream, times(2)).send(any(), anyOrNull())
    }

    @Test
    fun `downlaod(), chunk, last`() {
        subject.token = "123"
        subject.download(
            SmkpDownloadStreamClient.Source(
                "path",
                "ver",
                1,
                100
            ),
            1
        )
        verify(connection).startStream(any(), any())

        val body = "content".toByteArray(Charsets.UTF_8)
        val header = SmkpMessage.Header().apply {
            add("v", "abc")
            add("f", 6)
            add("s", 20)
        }
        val response = SmkpMessage.Response(
            SmkpMessage.RESPONSE,
            0,
            header,
            SpectaclesStreamBytesPayload(body)
        )
        subject.onReceiveResponse(response, 0, false)
        verify(onDownload).invoke(eq("path"), eq("abc"), eq(20), eq(6))
        verify(writer).write(argThat { contentEquals(body) })
        verify(writer, never()).close()
        verify(stream, times(2)).send(any(), anyOrNull())

        clearInvocations(writer)
        clearInvocations(stream)
        clearInvocations(onDownload)
        subject.onReceiveResponse(response, 0, false)
        verify(onDownload, never()).invoke(any(), any(), any(), any())
        verify(writer).write(argThat { contentEquals(body) })
        verify(writer).close()
        verify(stream, never()).send(any(), anyOrNull())
    }

    @Test
    fun `downlaod(), chunk, failed`() {
        subject.token = "123"
        subject.download(
            SmkpDownloadStreamClient.Source(
                "path",
                "ver",
                1,
                100
            ),
            1
        )
        verify(connection).startStream(any(), any())

        val body = "content".toByteArray(Charsets.UTF_8)
        val header = SmkpMessage.Header().apply {
            add("v", "abc")
            add("f", 6)
            add("s", 20)
        }
        val response = SmkpMessage.Response(
            SmkpMessage.RESPONSE,
            0,
            header,
            SpectaclesStreamBytesPayload(body)
        )
        subject.onReceiveResponse(response, 0, false)
        verify(onDownload).invoke(eq("path"), eq("abc"), eq(20), eq(6))
        verify(writer).write(argThat { contentEquals(body) })
        verify(writer, never()).close()
        verify(stream, times(2)).send(any(), anyOrNull())

        clearInvocations(writer)
        clearInvocations(stream)
        clearInvocations(onDownload)
        val response2 = SmkpMessage.Response(
            SmkpMessage.RESPONSE,
            1,
            header,
            SpectaclesStreamBytesPayload(body)
        )
        subject.onReceiveResponse(response2, 0, false)
        verify(onDownload, never()).invoke(any(), any(), any(), any())
        verify(writer, never()).write(any())
        verify(onFailed).invoke(eq("path"), eq(1), argThat { contentEquals(body) })
        verify(stream, never()).send(any(), anyOrNull())
    }
}
