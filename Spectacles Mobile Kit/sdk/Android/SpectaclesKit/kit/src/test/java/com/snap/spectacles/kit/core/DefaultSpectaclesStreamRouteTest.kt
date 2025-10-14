package com.snap.spectacles.kit.core

import com.snap.spectacles.kit.KitBaseTest
import com.snap.spectacles.kit.stream.SpectaclesStreamDataUnit
import com.snap.spectacles.kit.stream.SpectaclesStreamException
import com.snap.spectacles.kit.stream.smkp.SmkpAttestStreamServlet
import com.snap.spectacles.kit.stream.smkp.SmkpCallStreamServlet
import com.snap.spectacles.kit.stream.smkp.SmkpDownloadStreamServlet
import com.snap.spectacles.kit.stream.smkp.SmkpNotifyStreamServlet
import com.snap.spectacles.kit.stream.utils.SpectaclesStreamBytesPayload
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import org.junit.runners.JUnit4
import org.mockito.kotlin.mock

@RunWith(JUnit4::class)
class DefaultSpectaclesStreamRouteTest : KitBaseTest() {

    private val subject = DefaultSpectaclesStreamRoute(mock(), mock(), mock())

    @Test
    fun `route(), attest`() {
        val data = SpectaclesStreamDataUnit(
            false,
            0,
            SpectaclesStreamBytesPayload(byteArrayOf(16))
        )
        val servlet = subject.route(data)
        assertTrue(servlet is SmkpAttestStreamServlet)
    }

    @Test
    fun `route(), asset`() {
        val data = SpectaclesStreamDataUnit(
            false,
            0,
            SpectaclesStreamBytesPayload(byteArrayOf(3))
        )
        val servlet = subject.route(data)
        assertTrue(servlet is SmkpDownloadStreamServlet)
    }

    @Test
    fun `route(), call`() {
        val data = SpectaclesStreamDataUnit(
            false,
            0,
            SpectaclesStreamBytesPayload(byteArrayOf(1))
        )
        val servlet = subject.route(data)
        assertTrue(servlet is SmkpCallStreamServlet)
    }

    @Test
    fun `route(), notify`() {
        val data = SpectaclesStreamDataUnit(
            false,
            0,
            SpectaclesStreamBytesPayload(byteArrayOf(2))
        )
        val servlet = subject.route(data)
        assertTrue(servlet is SmkpNotifyStreamServlet)
    }

    @Test(expected = SpectaclesStreamException::class)
    fun `route(), unknown`() {
        val data = SpectaclesStreamDataUnit(
            false,
            0,
            SpectaclesStreamBytesPayload(byteArrayOf(32))
        )
        val servlet = subject.route(data)
    }
}
