package com.snap.spectacles.kit.stream.utils

import com.snap.spectacles.kit.KitBaseTest
import com.snap.spectacles.kit.stream.SpectaclesStream
import com.snap.spectacles.kit.stream.SpectaclesStreamDataUnit
import com.snap.spectacles.kit.stream.SpectaclesStreamRoute
import com.snap.spectacles.kit.stream.SpectaclesStreamServlet
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.junit.runners.JUnit4
import org.mockito.kotlin.any
import org.mockito.kotlin.clearInvocations
import org.mockito.kotlin.doReturn
import org.mockito.kotlin.mock
import org.mockito.kotlin.never
import org.mockito.kotlin.verify

@RunWith(JUnit4::class)
class SpectaclesStreamHandlerTest : KitBaseTest() {

    private val servlet = mock<SpectaclesStreamServlet>()
    private val route = mock<SpectaclesStreamRoute> {
        on { route(any()) } doReturn servlet
    }

    private val stream = mock<SpectaclesStream>()

    private val subject = SpectaclesStreamHandler.Default(route)

    @Before
    fun setup() {
        subject.onAttach(stream)
    }

    @Test
    fun `onReceive()`() {
        val data = mock<SpectaclesStreamDataUnit>()

        subject.onReceive(data)
        verify(route).route(data)
        verify(servlet).attach(stream)
        verify(servlet).service(data)
        clearInvocations(route)
        clearInvocations(servlet)

        subject.onReceive(data)
        verify(route, never()).route(data)
        verify(servlet, never()).attach(stream)
        verify(servlet).service(data)
    }

    @Test
    fun `onClose()`() {
        subject.onReceive(mock<SpectaclesStreamDataUnit>())

        subject.onClose()
        verify(servlet).close()
    }

    @Test
    fun `onClose(), no servlet`() {
        subject.onClose()
    }
}
