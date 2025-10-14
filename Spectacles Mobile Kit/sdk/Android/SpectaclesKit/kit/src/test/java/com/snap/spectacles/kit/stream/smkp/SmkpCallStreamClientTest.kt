package com.snap.spectacles.kit.stream.smkp

import com.snap.spectacles.kit.KitBaseTest
import com.snap.spectacles.kit.stream.SpectaclesStreamConnection
import org.junit.Test
import org.junit.runner.RunWith
import org.junit.runners.JUnit4
import org.mockito.kotlin.any
import org.mockito.kotlin.doReturn
import org.mockito.kotlin.mock
import org.mockito.kotlin.verify

@RunWith(JUnit4::class)
class SmkpCallStreamClientTest : KitBaseTest() {

    private val connection = mock<SpectaclesStreamConnection> {
        on { startStream(any(), any()) } doReturn mock()
    }

    private val onResponse = mock<SmkpBaseStreamClient.OnResponse>()
    private val onClose = mock<() -> Unit>()

    private val subject = SmkpCallStreamClient(connection, mock(), onClose, onResponse)

    @Test
    fun `call(), with token`() {
        val path = "path"
        val body = "body".toByteArray(Charsets.UTF_8)
        subject.token = "abc"
        subject.call(path, SmkpMessage.Header(), body, 4, true)
        verify(connection).startStream(any(), any())
    }

    @Test
    fun `call(), without token`() {
        val path = "path"
        subject.call(path)
        verify(connection).startStream(any(), any())
    }
}
