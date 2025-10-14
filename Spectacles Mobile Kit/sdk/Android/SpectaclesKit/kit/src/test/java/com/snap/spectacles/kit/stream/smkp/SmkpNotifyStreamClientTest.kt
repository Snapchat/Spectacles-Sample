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
class SmkpNotifyStreamClientTest : KitBaseTest() {

    private val connection = mock<SpectaclesStreamConnection> {
        on { startStream(any(), any()) } doReturn mock()
    }

    private val onClose = mock<() -> Unit>()

    private val subject = SmkpNotifyStreamClient(connection, mock(), onClose)

    @Test
    fun `notify(), with token`() {
        val path = "path"
        val body = "body".toByteArray(Charsets.UTF_8)
        subject.token = "abc"
        subject.notify(path, SmkpMessage.Header(), body, 4, false)
        verify(connection).startStream(any(), any())
    }

    @Test
    fun `notify(), without token`() {
        val path = "path"
        subject.notify(path)
        verify(connection).startStream(any(), any())
    }
}
