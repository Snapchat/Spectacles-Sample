package com.snap.spectacles.kit.stream.l2cap

import android.bluetooth.BluetoothSocket
import com.snap.spectacles.kit.KitBaseTest
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import org.junit.runners.JUnit4
import org.mockito.kotlin.doReturn
import org.mockito.kotlin.mock
import org.mockito.kotlin.never
import org.mockito.kotlin.verify

@RunWith(JUnit4::class)
class SpectaclesL2capClientEndpointTest : KitBaseTest() {

    private val bluetoothSocket = mock<BluetoothSocket> {
        on { inputStream } doReturn mock()
        on { outputStream } doReturn mock()
    }

    private val subject = SpectaclesL2capClientEndpoint(bluetoothSocket)

    @Test
    fun `connect()`() {
        val result = subject.connect(1000)
        assertTrue(result is SpectaclesL2capEndpointSocket)
        verify(bluetoothSocket, never()).connect()
    }
}
