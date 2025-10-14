package com.snap.spectacles.kit.stream.smkp

import com.snap.spectacles.kit.KitBaseTest
import com.snap.spectacles.kit.stream.SpectaclesStream
import com.snap.spectacles.kit.stream.SpectaclesStreamDataUnit
import com.snap.spectacles.kit.stream.SpectaclesStreamException
import com.snap.spectacles.kit.stream.SpectaclesStreamPayload
import com.snap.spectacles.kit.stream.SpectaclesStreamTrustManager
import com.snap.spectacles.kit.stream.utils.SpectaclesStreamBytesPayload
import org.junit.Assert
import org.junit.Test
import org.junit.runner.RunWith
import org.junit.runners.JUnit4
import org.mockito.kotlin.anyOrNull
import org.mockito.kotlin.clearInvocations
import org.mockito.kotlin.mock
import org.mockito.kotlin.never
import org.mockito.kotlin.verify
import org.mockito.kotlin.whenever
import java.util.concurrent.Executor

@RunWith(JUnit4::class)
class SmkpBaseStreamServletTest : KitBaseTest() {

    class Subject(
        tokenManager: SmkpLensTokenManager,
        executor: Executor,
        unpack: (SpectaclesStreamPayload) -> SmkpMessage,
        pack: (SmkpMessage) -> SpectaclesStreamPayload,
        format: (SpectaclesStreamException) -> SmkpMessage
    ) : SmkpBaseStreamServlet(tokenManager, executor, unpack, pack, format) {

        fun invokeStartStream(
            onReceive: (SpectaclesStreamDataUnit) -> Unit,
            onClose: () -> Unit
        ): SpectaclesStream {
            return startStream(onReceive, onClose)
        }

        fun invokeValidateTrust(message: SmkpMessage.Request) {
            validateTrust(message)
        }

        fun invokeGetServicedLens(): SpectaclesStreamTrustManager.LensProvision? {
            return getServicedLens()
        }

        override fun onReceiveRequest(request: SmkpMessage.Request, priority: Int, last: Boolean) {
        }
    }

    private val tokenManager = mock<SmkpLensTokenManager>()

    private val subject = Subject(tokenManager, mock(), mock(), mock(), mock())

    @Test(expected = SpectaclesStreamException::class)
    fun `startStream()`() {
        subject.invokeStartStream(mock(), mock())
    }

    @Test
    fun `validateTrust(), trusted request`() {
        whenever(tokenManager.getToken(anyOrNull())).thenReturn(mock())
        val message = SmkpMessage.Request(0, "", SmkpMessage.Header(), SpectaclesStreamBytesPayload.Empty)
        subject.invokeValidateTrust(message)
    }

    @Test
    fun `validateTrust(), second request`() {
        whenever(tokenManager.getToken(anyOrNull())).thenReturn(mock())
        val message = SmkpMessage.Request(0, "", SmkpMessage.Header(), SpectaclesStreamBytesPayload.Empty)
        subject.invokeValidateTrust(message)

        clearInvocations(tokenManager)
        subject.invokeValidateTrust(message)
        verify(tokenManager, never()).getToken(anyOrNull())
    }

    @Test(expected = SpectaclesStreamException::class)
    fun `validateTrust(), untrusted request`() {
        whenever(tokenManager.getToken(anyOrNull())).thenReturn(null)
        val message = SmkpMessage.Request(0, "", SmkpMessage.Header(), SpectaclesStreamBytesPayload.Empty)
        subject.invokeValidateTrust(message)
    }

    @Test
    fun `getServicedLens(), null`() {
        Assert.assertEquals(null, subject.invokeGetServicedLens())
    }

    @Test
    fun `getServicedLens()`() {
        val lens = mock<SpectaclesStreamTrustManager.LensProvision>()
        whenever(tokenManager.getToken(anyOrNull())).thenReturn(lens)

        val message = SmkpMessage.Request(0, "", SmkpMessage.Header(), SpectaclesStreamBytesPayload.Empty)
        subject.invokeValidateTrust(message)

        Assert.assertEquals(lens, subject.invokeGetServicedLens())
    }
}
