package com.snap.spectacles.kit.stream.smkp

import com.snap.spectacles.kit.KitBaseTest
import com.snap.spectacles.kit.stream.SpectaclesStream
import com.snap.spectacles.kit.stream.SpectaclesStreamDataUnit
import com.snap.spectacles.kit.stream.SpectaclesStreamException
import com.snap.spectacles.kit.stream.SpectaclesStreamPayload
import com.snap.spectacles.kit.stream.utils.SpectaclesStreamBytesPayload
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.junit.runners.JUnit4
import org.mockito.kotlin.any
import org.mockito.kotlin.anyOrNull
import org.mockito.kotlin.argThat
import org.mockito.kotlin.argumentCaptor
import org.mockito.kotlin.clearInvocations
import org.mockito.kotlin.doAnswer
import org.mockito.kotlin.doReturn
import org.mockito.kotlin.eq
import org.mockito.kotlin.isNull
import org.mockito.kotlin.mock
import org.mockito.kotlin.verify
import org.mockito.kotlin.verifyNoMoreInteractions
import org.mockito.kotlin.whenever
import java.io.InputStream
import java.util.concurrent.Executor

@RunWith(JUnit4::class)
class SmkpDownloadStreamServletTest : KitBaseTest() {

    private val executor = mock<Executor> {
        on { execute(any()) } doAnswer { it.getArgument<Runnable>(0).run() }
    }

    private var request: SmkpMessage = mock<SmkpMessage.Request>()
    private val unpack = mock<(SpectaclesStreamPayload) -> SmkpMessage> {
        on { invoke(any()) } doAnswer { request }
    }

    private val pack = mock<(SmkpMessage) -> SpectaclesStreamPayload> {
        on { invoke(any()) } doReturn mock()
    }

    private val stream = mock<SpectaclesStream>()

    private val contentStream = mock<InputStream> {
        on { skip(any()) } doAnswer { it.getArgument(0) }
        on { read(any(), any(), any()) } doAnswer { it.getArgument(2) }
    }

    private val requestDelegate = mock<SmkpDownloadStreamServlet.Delegate>()

    private val tokenManager = mock<SmkpLensTokenManager> {
        on { getToken(anyOrNull()) } doReturn mock()
    }

    private val subject = SmkpDownloadStreamServlet(tokenManager, executor, requestDelegate, unpack, pack)

    @Before
    fun setup() {
        subject.attach(stream)
    }

    @Test
    fun `onRequest(), first, version + no-from`() {
        val header = SmkpMessage.Header().apply {
            add("v", "222")
        }
        request = SmkpMessage.Request(
            SmkpMessage.DOWNLOAD,
            "abc",
            header,
            SpectaclesStreamBytesPayload.Empty
        )
        subject.service(SpectaclesStreamDataUnit(false, 0, mock()))

        verify(tokenManager).getToken(anyOrNull())
        verify(requestDelegate).process(
            eq("abc"), eq("222"), eq(0), any(), any(), any()
        )
    }

    @Test
    fun `onRequest(), first, version + from`() {
        val header = SmkpMessage.Header().apply {
            add("v", "222")
            add("f", 0)
        }
        request = SmkpMessage.Request(
            SmkpMessage.DOWNLOAD,
            "abc",
            header,
            SpectaclesStreamBytesPayload.Empty
        )
        subject.service(SpectaclesStreamDataUnit(false, 0, mock()))

        verify(requestDelegate).process(
            eq("abc"), isNull(), eq(0), any(), any(), any()
        )
    }

    @Test
    fun `onRequest(), first, no-version`() {
        request = SmkpMessage.Request(
            SmkpMessage.DOWNLOAD,
            "abc",
            SmkpMessage.Header(),
            SpectaclesStreamBytesPayload.Empty
        )
        subject.service(SpectaclesStreamDataUnit(false, 0, mock()))

        verify(requestDelegate).process(
            eq("abc"), isNull(), eq(0), any(), any(), any()
        )
    }

    @Test
    fun `onRequest(), untrusted request`() {
        whenever(tokenManager.getToken(anyOrNull())).thenReturn(null)

        val header = SmkpMessage.Header().apply {
            add("v", "222")
        }
        request = SmkpMessage.Request(
            SmkpMessage.DOWNLOAD,
            "abc",
            header,
            SpectaclesStreamBytesPayload.Empty
        )
        subject.service(SpectaclesStreamDataUnit(false, 0, mock()))

        verify(pack).invoke(
            argThat {
                this is SmkpMessage.Response && status == 401
            }
        )
    }

    @Test
    fun `onRequest(), unsupported request`() {
        request = SmkpMessage.Request(
            22, "abc", SmkpMessage.Header(), SpectaclesStreamBytesPayload.Empty
        )
        subject.service(SpectaclesStreamDataUnit(false, 0, mock()))

        verify(pack).invoke(
            argThat {
                this is SmkpMessage.Response && status == 501
            }
        )
    }

    @Test
    fun `onRequest(), non-request`() {
        request = mock<SmkpMessage.Response>()
        subject.service(SpectaclesStreamDataUnit(false, 0, mock()))
        verifyNoMoreInteractions(requestDelegate)
    }

    @Test
    fun `onResponse(), with no-version content`() {
        request = SmkpMessage.Request(
            SmkpMessage.DOWNLOAD,
            "abc",
            SmkpMessage.Header(),
            SpectaclesStreamBytesPayload.Empty
        )
        subject.service(SpectaclesStreamDataUnit(false, 0, mock()))

        val captor = argumentCaptor<SmkpDownloadStreamServlet.Delegate.OnSuccess>()
        verify(requestDelegate).process(
            any(), anyOrNull(), any(), captor.capture(), any(), any()
        )
        val content = SmkpDownloadStreamServlet.Content(contentStream, 1000, "123")
        captor.firstValue.invoke(content, 1)

        verify(pack).invoke(
            argThat {
                this is SmkpMessage.Response && status == 0 &&
                    header.get("f")?.getIntValue() == 0 &&
                    header.get("s")?.getIntValue() == 1000
            }
        )
        verify(stream).send(argThat { last }, anyOrNull())
    }

    @Test
    fun `onResponse(), with same version content`() {
        val header = SmkpMessage.Header().apply {
            add("v", "123")
        }
        request = SmkpMessage.Request(
            SmkpMessage.DOWNLOAD,
            "abc",
            header,
            SpectaclesStreamBytesPayload.Empty
        )
        subject.service(SpectaclesStreamDataUnit(false, 0, mock()))

        val captor = argumentCaptor<SmkpDownloadStreamServlet.Delegate.OnSuccess>()
        verify(requestDelegate).process(
            any(), anyOrNull(), any(), captor.capture(), any(), any()
        )
        val content = SmkpDownloadStreamServlet.Content(contentStream, 1000, "123")
        captor.firstValue.invoke(content, 1)

        verify(pack).invoke(
            argThat {
                this is SmkpMessage.Response && status == 0 &&
                    this.header.get("f")?.getIntValue() == 0 &&
                    this.header.get("s")?.getIntValue() == 1000 &&
                    this.header.get("v")?.getStringValue() == "123"
            }
        )
        verify(stream).send(argThat { last }, anyOrNull())
    }

    @Test
    fun `onResponse(), with new version content`() {
        val header = SmkpMessage.Header().apply {
            add("v", "1")
            add("f", 100)
        }
        request = SmkpMessage.Request(
            SmkpMessage.DOWNLOAD,
            "abc",
            header,
            SpectaclesStreamBytesPayload.Empty
        )
        subject.service(SpectaclesStreamDataUnit(false, 0, mock()))

        val captor = argumentCaptor<SmkpDownloadStreamServlet.Delegate.OnSuccess>()
        verify(requestDelegate).process(
            any(), anyOrNull(), any(), captor.capture(), any(), any()
        )
        val content = SmkpDownloadStreamServlet.Content(contentStream, 1000, "123")
        captor.firstValue.invoke(content, 1)

        verify(pack).invoke(
            argThat {
                this is SmkpMessage.Response && status == 0 &&
                    this.header.get("f")?.getIntValue() == 0 &&
                    this.header.get("s")?.getIntValue() == 1000 &&
                    this.header.get("v")?.getStringValue() == "123" &&
                    this.body.size == 1000
            }
        )
        verify(stream).send(argThat { last }, anyOrNull())
    }

    @Test
    fun `onResponse(), skip`() {
        val header = SmkpMessage.Header().apply {
            add("v", "123")
            add("f", 100)
        }
        request = SmkpMessage.Request(
            SmkpMessage.DOWNLOAD,
            "abc",
            header,
            SpectaclesStreamBytesPayload.Empty
        )
        subject.service(SpectaclesStreamDataUnit(false, 0, mock()))

        val captor = argumentCaptor<SmkpDownloadStreamServlet.Delegate.OnSuccess>()
        verify(requestDelegate).process(
            any(), anyOrNull(), any(), captor.capture(), any(), any()
        )
        val content = SmkpDownloadStreamServlet.Content(contentStream, 1000, "123")
        captor.firstValue.invoke(content, 1)

        verify(contentStream).skip(100)
        verify(pack).invoke(
            argThat {
                this is SmkpMessage.Response && status == 0 &&
                    this.header.get("f")?.getIntValue() == 100 &&
                    this.header.get("s")?.getIntValue() == 1000 &&
                    this.body.size == 900
            }
        )
        verify(stream).send(argThat { last }, anyOrNull())
    }

    @Test
    fun `onResponse(), skip failed`() {
        val header = SmkpMessage.Header().apply {
            add("v", "123")
            add("f", 100)
        }
        request = SmkpMessage.Request(
            SmkpMessage.DOWNLOAD,
            "abc",
            header,
            SpectaclesStreamBytesPayload.Empty
        )
        subject.service(SpectaclesStreamDataUnit(false, 0, mock()))

        val captor = argumentCaptor<SmkpDownloadStreamServlet.Delegate.OnSuccess>()
        verify(requestDelegate).process(
            any(), anyOrNull(), any(), captor.capture(), any(), any()
        )
        whenever(contentStream.skip(any())).thenReturn(-1)
        val content = SmkpDownloadStreamServlet.Content(contentStream, 1000, "123")
        captor.firstValue.invoke(content, 1)

        verify(contentStream).skip(100)
        verify(pack).invoke(
            argThat {
                this is SmkpMessage.Response && status == 500
            }
        )
    }

    @Test
    fun `onResponse(), chunking`() {
        val header = SmkpMessage.Header().apply {
            add("v", "123")
            add("f", 20)
            add("c", 200)
        }
        request = SmkpMessage.Request(
            SmkpMessage.DOWNLOAD,
            "abc",
            header,
            SpectaclesStreamBytesPayload.Empty
        )
        subject.service(SpectaclesStreamDataUnit(false, 0, mock()))

        val captor = argumentCaptor<SmkpDownloadStreamServlet.Delegate.OnSuccess>()
        verify(requestDelegate).process(
            any(), anyOrNull(), any(), captor.capture(), any(), any()
        )
        val content = SmkpDownloadStreamServlet.Content(contentStream, 1000, "123")
        captor.firstValue.invoke(content, 1)

        verify(pack).invoke(
            argThat {
                this is SmkpMessage.Response && status == 0 &&
                    this.header.get("f")?.getIntValue() == 20 &&
                    this.header.get("s")?.getIntValue() == 1000 &&
                    this.header.get("v")?.getStringValue() == "123" &&
                    this.body.size == 200
            }
        )
        verify(stream).send(argThat { !last }, anyOrNull())

        clearInvocations(pack)
        clearInvocations(stream)
        clearInvocations(requestDelegate)

        request = SmkpMessage.Request(
            SmkpMessage.DOWNLOAD,
            "",
            SmkpMessage.Header().apply { add("c", 1000) },
            SpectaclesStreamBytesPayload.Empty
        )
        subject.service(SpectaclesStreamDataUnit(false, 0, mock()))

        verify(pack).invoke(
            argThat {
                this is SmkpMessage.Response && status == 0 &&
                    this.header.get("f")?.getIntValue() == 220 &&
                    this.body.size == 780
            }
        )
        verify(stream).send(argThat { last }, anyOrNull())
    }

    @Test
    fun `onResponse(), with NotModified`() {
        request = SmkpMessage.Request(
            SmkpMessage.DOWNLOAD,
            "abc",
            SmkpMessage.Header(),
            SpectaclesStreamBytesPayload.Empty
        )
        subject.service(SpectaclesStreamDataUnit(false, 0, mock()))

        val captor = argumentCaptor<SmkpDownloadStreamServlet.Delegate.OnNotModified>()
        verify(requestDelegate).process(
            any(), anyOrNull(), any(), any(), captor.capture(), any()
        )
        captor.firstValue.invoke()

        verify(pack).invoke(
            argThat {
                this is SmkpMessage.Response && status == 304
            }
        )
        verify(stream).send(argThat { last }, anyOrNull())
    }

    @Test
    fun `onClose(), with content`() {
        request = SmkpMessage.Request(
            SmkpMessage.DOWNLOAD,
            "abc",
            SmkpMessage.Header(),
            SpectaclesStreamBytesPayload.Empty
        )
        subject.service(SpectaclesStreamDataUnit(false, 0, mock()))

        val captor = argumentCaptor<SmkpDownloadStreamServlet.Delegate.OnSuccess>()
        verify(requestDelegate).process(
            any(), anyOrNull(), any(), captor.capture(), any(), any()
        )
        val content = SmkpDownloadStreamServlet.Content(contentStream, 1000, "123")
        captor.firstValue.invoke(content, 1)

        subject.close()
        verify(contentStream).close()
    }

    @Test
    fun `onClose(), with up-to-dated`() {
        request = SmkpMessage.Request(
            SmkpMessage.DOWNLOAD,
            "abc",
            SmkpMessage.Header(),
            SpectaclesStreamBytesPayload.Empty
        )
        subject.service(SpectaclesStreamDataUnit(false, 0, mock()))

        val captor = argumentCaptor<SmkpDownloadStreamServlet.Delegate.OnNotModified>()
        verify(requestDelegate).process(
            any(), anyOrNull(), any(), any(), captor.capture(), any()
        )
        captor.firstValue.invoke()

        subject.close()
    }

    @Test
    fun `onClose(), no-asset`() {
        subject.close()
    }

    @Test
    fun `SpectaclesAssetRequest Load, onError()`() {
        request = SmkpMessage.Request(
            SmkpMessage.DOWNLOAD,
            "abc",
            SmkpMessage.Header(),
            SpectaclesStreamBytesPayload.Empty
        )
        subject.service(SpectaclesStreamDataUnit(false, 0, mock()))

        val captor = argumentCaptor<SmkpDownloadStreamServlet.Delegate.OnError>()
        verify(requestDelegate).process(
            any(), anyOrNull(), any(), any(), any(), captor.capture()
        )
        captor.firstValue.invoke(SpectaclesStreamException(4))

        verify(stream).send(
            argThat { last },
            anyOrNull()
        )
    }

    @Test
    fun `constructor(), default`() {
        SmkpDownloadStreamServlet(tokenManager, executor, requestDelegate)
    }
}
