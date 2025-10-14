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
import org.mockito.kotlin.mock
import org.mockito.kotlin.verify
import org.mockito.kotlin.verifyNoMoreInteractions
import org.mockito.kotlin.whenever
import java.util.concurrent.Executor

@RunWith(JUnit4::class)
class SmkpCallStreamServletTest : KitBaseTest() {

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

    private val requestDelegate = mock<SmkpCallStreamServlet.Delegate>()

    private val tokenManager = mock<SmkpLensTokenManager> {
        on { getToken(anyOrNull()) } doReturn mock()
    }

    private val subject = SmkpCallStreamServlet(tokenManager, executor, requestDelegate, unpack, pack)

    @Before
    fun setup() {
        subject.attach(stream)
    }

    @Test
    fun `onRequest(), first`() {
        request = SmkpMessage.Request(
            SmkpMessage.CALL, "abc", SmkpMessage.Header(), SpectaclesStreamBytesPayload.Empty
        )
        subject.service(SpectaclesStreamDataUnit(false, 0, mock()))

        verify(tokenManager).getToken(anyOrNull())
        verify(requestDelegate).process(
            eq("abc"), any(), any(), eq(0), eq(false), any(), any()
        )
    }

    @Test
    fun `onRequest(), empty path`() {
        request = SmkpMessage.Request(
            SmkpMessage.CALL, "abc", SmkpMessage.Header(), SpectaclesStreamBytesPayload.Empty
        )
        subject.service(SpectaclesStreamDataUnit(false, 0, mock()))
        clearInvocations(requestDelegate)

        request = SmkpMessage.Request(
            SmkpMessage.CALL, "", SmkpMessage.Header(), SpectaclesStreamBytesPayload.Empty
        )
        subject.service(SpectaclesStreamDataUnit(false, 0, mock()))
        verify(requestDelegate).process(
            eq("abc"), any(), any(), eq(0), eq(false), any(), any()
        )
    }

    @Test
    fun `onRequest(), untrusted request`() {
        whenever(tokenManager.getToken(anyOrNull())).thenReturn(null)

        request = SmkpMessage.Request(
            SmkpMessage.CALL, "abc", SmkpMessage.Header(), SpectaclesStreamBytesPayload.Empty
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
    fun `SmkpCallRequest Call, onResponse()`() {
        request = SmkpMessage.Request(
            SmkpMessage.CALL, "abc", SmkpMessage.Header(), SpectaclesStreamBytesPayload.Empty
        )
        subject.service(SpectaclesStreamDataUnit(false, 2, mock()))

        val captor = argumentCaptor<SmkpCallStreamServlet.Delegate.OnSuccess>()
        verify(requestDelegate).process(
            eq("abc"), any(), any(), eq(2), eq(false), captor.capture(), any()
        )
        captor.firstValue.invoke(0, byteArrayOf(1), 2, false)

        verify(stream).send(
            argThat { !last && priority == 2 },
            anyOrNull()
        )
    }

    @Test
    fun `SmkpCallRequest Call, onError()`() {
        request = SmkpMessage.Request(
            SmkpMessage.CALL, "abc", SmkpMessage.Header(), SpectaclesStreamBytesPayload.Empty
        )
        subject.service(SpectaclesStreamDataUnit(false, 2, mock()))

        val captor = argumentCaptor<SmkpCallStreamServlet.Delegate.OnError>()
        verify(requestDelegate).process(
            eq("abc"), any(), any(), eq(2), any(), any(), captor.capture()
        )
        captor.firstValue.invoke(SpectaclesStreamException(4))

        verify(stream).send(
            argThat { last },
            anyOrNull()
        )
    }

    @Test
    fun `constructor(), default`() {
        SmkpCallStreamServlet(tokenManager, executor, requestDelegate)
    }
}
