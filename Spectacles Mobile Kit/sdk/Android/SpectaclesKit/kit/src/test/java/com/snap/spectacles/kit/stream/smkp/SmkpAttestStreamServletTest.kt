package com.snap.spectacles.kit.stream.smkp

import com.snap.spectacles.kit.KitBaseTest
import com.snap.spectacles.kit.stream.SpectaclesStream
import com.snap.spectacles.kit.stream.SpectaclesStreamDataUnit
import com.snap.spectacles.kit.stream.SpectaclesStreamException
import com.snap.spectacles.kit.stream.SpectaclesStreamPayload
import com.snap.spectacles.kit.stream.SpectaclesStreamTrustManager
import com.snap.spectacles.kit.stream.utils.SpectaclesStreamBytesPayload
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.junit.runners.JUnit4
import org.mockito.kotlin.any
import org.mockito.kotlin.argThat
import org.mockito.kotlin.doAnswer
import org.mockito.kotlin.doReturn
import org.mockito.kotlin.eq
import org.mockito.kotlin.mock
import org.mockito.kotlin.verify
import org.mockito.kotlin.verifyNoMoreInteractions
import org.mockito.kotlin.whenever
import java.util.concurrent.Executor

@RunWith(JUnit4::class)
class SmkpAttestStreamServletTest : KitBaseTest() {

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

    private val trustManager = mock<SpectaclesStreamTrustManager>()

    private val tokenManager = mock<SmkpLensTokenManager>()

    private val subject = SmkpAttestStreamServlet(trustManager, tokenManager, executor, unpack, pack)

    @Before
    fun setup() {
        subject.attach(stream)
    }

    @Test
    fun `onRequest(), trusted`() {
        val header = SmkpMessage.Header().apply {
            add("t", "sample-lens-token")
        }
        val body = "{\"lens-id\":\"test-id\", \"lens-version\":\"test-version\"" +
            ", \"creator\":\"test-creator\", \"source\":\"bbg\"}"
        request = SmkpMessage.Request(
            SmkpMessage.ATTEST, "", header, SpectaclesStreamBytesPayload(body.toByteArray(Charsets.UTF_8))
        )
        subject.service(SpectaclesStreamDataUnit(false, 0, mock()))

        verify(trustManager).validateLensTrust(any())
        verify(tokenManager).addToken(
            eq("sample-lens-token"),
            argThat {
                lensId == "test-id" && version == "test-version" &&
                    creator == "test-creator" && source == "bbg"
            }
        )

        verify(pack).invoke(
            argThat {
                this is SmkpMessage.Response && status == 0
            }
        )
    }

    @Test
    fun `onRequest(), untrusted`() {
        whenever(trustManager.validateLensTrust(any()))
            .thenThrow(SpectaclesStreamException(SpectaclesStreamException.FORBIDDEN))

        val header = SmkpMessage.Header().apply {
            add("t", "sample-lens-token")
        }
        val body = "{\"lens-id\":\"test-id\", \"lens-version\":\"test-version\"" +
            ", \"creator\":\"test-creator\", \"source\":\"bbg\"}"
        request = SmkpMessage.Request(
            SmkpMessage.ATTEST, "", header, SpectaclesStreamBytesPayload(body.toByteArray(Charsets.UTF_8))
        )
        subject.service(SpectaclesStreamDataUnit(false, 0, mock()))

        verify(pack).invoke(
            argThat {
                this is SmkpMessage.Response && status == 403
            }
        )
    }

    @Test
    fun `onRequest(), no lens-id`() {
        val header = SmkpMessage.Header().apply {
            add("t", "sample-lens-token")
        }
        val body = "{}"
        request = SmkpMessage.Request(
            SmkpMessage.ATTEST, "", header, SpectaclesStreamBytesPayload(body.toByteArray(Charsets.UTF_8))
        )
        subject.service(SpectaclesStreamDataUnit(false, 0, mock()))

        verify(pack).invoke(
            argThat {
                this is SmkpMessage.Response && status == 400
            }
        )
    }

    @Test
    fun `onRequest(), no token`() {
        request = SmkpMessage.Request(
            SmkpMessage.ATTEST, "", SmkpMessage.Header(), SpectaclesStreamBytesPayload.Empty
        )
        subject.service(SpectaclesStreamDataUnit(false, 0, mock()))

        verify(pack).invoke(
            argThat {
                this is SmkpMessage.Response && status == 400
            }
        )
    }

    @Test
    fun `onReceive(), non-request`() {
        request = mock<SmkpMessage.Response>()
        subject.service(SpectaclesStreamDataUnit(false, 0, mock()))
        verifyNoMoreInteractions(trustManager)
    }

    @Test
    fun `onRequest(), unsupported request`() {
        request = SmkpMessage.Request(
            22, "abc", SmkpMessage.Header(), SpectaclesStreamBytesPayload.Empty
        )
        subject.service(SpectaclesStreamDataUnit(false, 0, mock()))
        verifyNoMoreInteractions(trustManager)
    }

    @Test
    fun `constructor(), default`() {
        SmkpAttestStreamServlet(trustManager, tokenManager, executor)
    }
}
