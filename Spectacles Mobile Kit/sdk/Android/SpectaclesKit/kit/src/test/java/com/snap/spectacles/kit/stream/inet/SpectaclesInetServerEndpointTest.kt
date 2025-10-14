package com.snap.spectacles.kit.stream.inet

import com.snap.spectacles.kit.KitBaseTest
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import org.junit.runners.JUnit4
import java.io.IOException
import java.net.Inet4Address
import java.net.InetSocketAddress
import java.net.ServerSocket

@RunWith(JUnit4::class)
class SpectaclesInetServerEndpointTest : KitBaseTest() {

    @Test
    fun `connect()`() {
        val server = ServerSocket(0)
        Thread {
            server.accept()
        }.start()
        val address = InetSocketAddress(Inet4Address.getLocalHost(), server.localPort)
        val subject = SpectaclesInetServerEndpoint(address)
        val result = subject.connect(100)
        assertTrue(result is SpectaclesInetEndpointSocket)
    }

    @Test(expected = IOException::class)
    fun `connect(), exceptional`() {
        val address = InetSocketAddress(Inet4Address.getLocalHost(), 60000)
        val subject = SpectaclesInetServerEndpoint(address)
        subject.connect(100)
    }
}