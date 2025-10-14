package com.snap.spectacles.kit.stream.l2cap

import android.bluetooth.BluetoothDevice
import android.bluetooth.BluetoothSocket
import com.snap.spectacles.kit.KitBaseTest
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import org.junit.runners.JUnit4
import org.mockito.kotlin.any
import org.mockito.kotlin.doReturn
import org.mockito.kotlin.mock
import org.mockito.kotlin.verify
import org.mockito.kotlin.whenever
import java.io.IOException

@RunWith(JUnit4::class)
class SpectaclesL2capServerEndpointTest : KitBaseTest() {

    private val bluetoothSocket = mock<BluetoothSocket> {
        on { inputStream } doReturn mock()
        on { outputStream } doReturn mock()
    }
    private val bluetoothDevice = mock<BluetoothDevice> {
        on { createInsecureL2capChannel(any()) } doReturn bluetoothSocket
    }

    private val subject = SpectaclesL2capServerEndpoint(bluetoothDevice, 234)

    @Test
    fun `connect()`() {
        val result = subject.connect(1000)
        assertTrue(result is SpectaclesL2capEndpointSocket)

        verify(bluetoothDevice).createInsecureL2capChannel(234)
        verify(bluetoothSocket).connect()
    }

    @Test(expected = IOException::class)
    fun `connect(), exceptional`() {
        whenever(bluetoothSocket.connect()).thenThrow(IOException())
        subject.connect(1000)
    }
}
