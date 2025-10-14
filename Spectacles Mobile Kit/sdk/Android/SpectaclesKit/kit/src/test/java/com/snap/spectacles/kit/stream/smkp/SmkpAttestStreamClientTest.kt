package com.snap.spectacles.kit.stream.smkp

import com.snap.spectacles.kit.KitBaseTest
import com.snap.spectacles.kit.stream.SpectaclesStreamConnection
import com.snap.spectacles.kit.stream.SpectaclesStreamTrustManager
import org.junit.Test
import org.junit.runner.RunWith
import org.junit.runners.JUnit4
import org.mockito.kotlin.any
import org.mockito.kotlin.doReturn
import org.mockito.kotlin.mock
import org.mockito.kotlin.verify

@RunWith(JUnit4::class)
class SmkpAttestStreamClientTest : KitBaseTest() {

    private val connection = mock<SpectaclesStreamConnection> {
        on { startStream(any(), any()) } doReturn mock()
    }

    private val onResponse = mock<SmkpBaseStreamClient.OnResponse>()
    private val onClose = mock<() -> Unit>()

    private val subject = SmkpAttestStreamClient(connection, mock(), onClose, onResponse)

    @Test
    fun `attest()`() {
        subject.attest(
            "token",
            SpectaclesStreamTrustManager.LensProvision(
                "lensId",
                "ver",
                "creator",
                "push"
            )
        )
        verify(connection).startStream(any(), any())
    }
}
