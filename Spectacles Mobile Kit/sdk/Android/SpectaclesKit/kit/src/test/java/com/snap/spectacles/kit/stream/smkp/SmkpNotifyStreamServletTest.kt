package com.snap.spectacles.kit.stream.smkp

import com.snap.spectacles.kit.KitBaseTest
import com.snap.spectacles.kit.stream.SpectaclesStream
import com.snap.spectacles.kit.stream.SpectaclesStreamDataUnit
import com.snap.spectacles.kit.stream.SpectaclesStreamPayload
import com.snap.spectacles.kit.stream.utils.SpectaclesStreamBytesPayload
import org.junit.Before
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
import org.mockito.kotlin.verify
import org.mockito.kotlin.verifyNoMoreInteractions
import org.mockito.kotlin.whenever
import java.util.concurrent.Executor

@RunWith(JUnit4::class)
class SmkpNotifyStreamServletTest : KitBaseTest() {

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

    private val requestDelegate = mock<SmkpNotifyStreamServlet.Delegate>()

    private val tokenManager = mock<SmkpLensTokenManager> {
        on { getToken(anyOrNull()) } doReturn mock()
    }

    private val subject = SmkpNotifyStreamServlet(tokenManager, executor, requestDelegate, unpack, pack)

    @Before
    fun setup() {
        subject.attach(stream)
    }

    @Test
    fun `onRequest(), first`() {
        request = SmkpMessage.Request(
            SmkpMessage.NOTIFY, "abc", SmkpMessage.Header(), SpectaclesStreamBytesPayload.Empty
        )
        subject.service(SpectaclesStreamDataUnit(false, 0, mock()))

        verify(tokenManager).getToken(anyOrNull())
        verify(requestDelegate).process(
            eq("abc"), any(), any(), eq(0), eq(false)
        )
    }

    @Test
    fun `onRequest(), empty path`() {
        request = SmkpMessage.Request(
            SmkpMessage.NOTIFY, "abc", SmkpMessage.Header(), SpectaclesStreamBytesPayload.Empty
        )
        subject.service(SpectaclesStreamDataUnit(false, 0, mock()))
        clearInvocations(requestDelegate)

        request = SmkpMessage.Request(
            SmkpMessage.NOTIFY, "", SmkpMessage.Header(), SpectaclesStreamBytesPayload.Empty
        )
        subject.service(SpectaclesStreamDataUnit(false, 0, mock()))
        verify(requestDelegate).process(
            eq("abc"), any(), any(), eq(0), eq(false)
        )
    }

    @Test
    fun `onRequest(), untrusted request`() {
        whenever(tokenManager.getToken(anyOrNull())).thenReturn(null)

        request = SmkpMessage.Request(
            SmkpMessage.NOTIFY, "abc", SmkpMessage.Header(), SpectaclesStreamBytesPayload.Empty
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
    fun `constructor(), default`() {
        SmkpNotifyStreamServlet(tokenManager, executor, requestDelegate)
    }
}
