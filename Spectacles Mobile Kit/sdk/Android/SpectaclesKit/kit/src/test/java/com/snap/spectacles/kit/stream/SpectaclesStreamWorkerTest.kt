package com.snap.spectacles.kit.stream

import com.snap.spectacles.kit.KitBaseTest
import com.snap.spectacles.kit.stream.smkp.SmkpMessage
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.junit.runners.JUnit4
import org.mockito.kotlin.any
import org.mockito.kotlin.anyOrNull
import org.mockito.kotlin.argThat
import org.mockito.kotlin.argumentCaptor
import org.mockito.kotlin.clearInvocations
import org.mockito.kotlin.doReturn
import org.mockito.kotlin.mock
import org.mockito.kotlin.never
import org.mockito.kotlin.verify
import org.mockito.kotlin.whenever
import java.util.concurrent.Executor

@RunWith(JUnit4::class)
class SpectaclesStreamWorkerTest : KitBaseTest() {

    class Subject(
        executor: Executor,
        unpack: (SpectaclesStreamPayload) -> SmkpMessage,
        pack: (SmkpMessage) -> SpectaclesStreamPayload,
        format: (SpectaclesStreamException) -> SmkpMessage
    ) : SpectaclesStreamWorker<SmkpMessage>(executor, unpack, pack, format) {

        var error: Exception? = null

        override fun onReceive(message: SmkpMessage, priority: Int, last: Boolean) {
            if (null != error) throw error!!
        }

        override fun startStream(
            onReceive: (SpectaclesStreamDataUnit) -> Unit,
            onClose: () -> Unit
        ): SpectaclesStream {
            return mock()
        }

        fun invokeSend(message: SmkpMessage, last: Boolean, priority: Int) {
            send(message, priority, last)
        }

        fun invokeOnError(error: Exception) {
            sendError(error)
        }
    }

    private val executor = mock<Executor>()

    private val request = mock<SmkpMessage.Request>()
    private val unpack = mock<(SpectaclesStreamPayload) -> SmkpMessage> {
        on { invoke(any()) } doReturn request
    }

    private val pack = mock<(SmkpMessage) -> SpectaclesStreamPayload> {
        on { invoke(any()) } doReturn mock()
    }

    private val format = mock<(SpectaclesStreamException) -> SmkpMessage> {
        on { invoke(any()) } doReturn mock()
    }

    private val stream = mock<SpectaclesStream>()

    private val subject = Subject(executor, unpack, pack, format)

    @Before
    fun setup() {
        subject.attach(stream)
    }

    @Test
    fun `process(), first`() {
        whenever(executor.execute(any())).thenAnswer { it.getArgument<Runnable>(0).run() }
        subject.process(SpectaclesStreamDataUnit(false, 0, mock()))
        verify(executor).execute(any())
    }

    @Test
    fun `process(), multiple`() {
        subject.process(SpectaclesStreamDataUnit(false, 0, mock()))
        subject.process(SpectaclesStreamDataUnit(false, 0, mock()))

        val captor = argumentCaptor<Runnable>()
        verify(executor).execute(captor.capture())
        clearInvocations(executor)

        captor.firstValue.run()
        verify(unpack).invoke(any())
        verify(executor).execute(any())
    }

    @Test
    fun `process(), error`() {
        whenever(executor.execute(any())).thenAnswer { it.getArgument<Runnable>(0).run() }
        subject.error = Exception()

        subject.process(SpectaclesStreamDataUnit(false, 0, mock()))
        verify(executor).execute(any())
        verify(format).invoke(any())
        verify(pack).invoke(any())
    }

    @Test
    fun `process(), closed`() {
        subject.close()
        subject.process(SpectaclesStreamDataUnit(false, 0, mock()))
        verify(executor, never()).execute(any())
    }

    @Test
    fun `send(), no stream`() {
        val subject = Subject(executor, unpack, pack, format)
        val message = mock<SmkpMessage>()
        subject.invokeSend(message, true, 0)
        verify(pack).invoke(message)
    }

    @Test
    fun `send(), last`() {
        val message = mock<SmkpMessage>()
        subject.invokeSend(message, true, 0)
        verify(pack).invoke(message)
        verify(stream).send(any(), anyOrNull())
    }

    @Test
    fun `send(), non-last`() {
        val message = mock<SmkpMessage>()
        subject.invokeSend(message, false, 0)
        verify(pack).invoke(message)
        verify(stream).send(any(), anyOrNull())
    }

    @Test
    fun `onError(), error = SpectaclesStreamException`() {
        val error = SpectaclesStreamException(22)
        subject.invokeOnError(error)
        verify(format).invoke(error)
        verify(pack).invoke(any())
        verify(stream).send(any(), anyOrNull())
    }

    @Test
    fun `onError(), error = Exception`() {
        subject.invokeOnError(Exception())
        verify(format).invoke(argThat { code == SpectaclesStreamException.INTERNAL_ERROR })
        verify(pack).invoke(any())
        verify(stream).send(any(), anyOrNull())
    }
}
