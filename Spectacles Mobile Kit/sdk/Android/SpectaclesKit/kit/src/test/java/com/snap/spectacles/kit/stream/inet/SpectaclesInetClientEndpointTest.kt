package com.snap.spectacles.kit.stream.inet

import com.snap.spectacles.kit.KitBaseTest
import org.junit.Assert
import org.junit.Test
import org.junit.runner.RunWith
import org.junit.runners.JUnit4
import org.mockito.kotlin.any
import org.mockito.kotlin.doReturn
import org.mockito.kotlin.mock
import org.mockito.kotlin.never
import org.mockito.kotlin.verify
import java.net.Socket

@RunWith(JUnit4::class)
class SpectaclesInetClientEndpointTest : KitBaseTest() {

    private val socket = mock<Socket> {
        on { inputStream } doReturn mock()
        on { outputStream } doReturn mock()
    }

    private val subject = SpectaclesInetClientEndpoint(socket)

    @Test
    fun `connect()`() {
        val result = subject.connect(1000)
        Assert.assertTrue(result is SpectaclesInetEndpointSocket)
        verify(socket, never()).connect(any())
    }
}
