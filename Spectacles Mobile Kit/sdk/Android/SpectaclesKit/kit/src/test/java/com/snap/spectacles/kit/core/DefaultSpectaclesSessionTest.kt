package com.snap.spectacles.kit.core

import com.snap.spectacles.kit.KitBaseTest
import com.snap.spectacles.kit.SpectaclesKit
import com.snap.spectacles.kit.SpectaclesRequestDelegate
import com.snap.spectacles.kit.SpectaclesSession
import com.snap.spectacles.kit.stream.SpectaclesStreamAddress
import com.snap.spectacles.kit.stream.l2cap.SpectaclesL2capServiceDiscovery
import com.snap.spectacles.kit.stream.qlic.QlicConnection
import com.snap.spectacles.kit.stream.qlic.QlicConnectionFactory
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.junit.runners.JUnit4
import org.mockito.kotlin.any
import org.mockito.kotlin.argThat
import org.mockito.kotlin.clearInvocations
import org.mockito.kotlin.doAnswer
import org.mockito.kotlin.doReturn
import org.mockito.kotlin.mock
import org.mockito.kotlin.never
import org.mockito.kotlin.verify
import org.mockito.kotlin.whenever
import java.util.UUID
import java.util.concurrent.Executor
import java.util.function.Consumer

@RunWith(JUnit4::class)
class DefaultSpectaclesSessionTest : KitBaseTest() {

    private lateinit var onDisconnected: (Int) -> Unit
    private val streamConnection = mock<QlicConnection> {
        on { setOnDisconnectedListener(any()) } doAnswer {
            onDisconnected = it.getArgument(0)
        }
    }
    private val streamConnectionFactory = mock<QlicConnectionFactory> {
        on { openConnection(any(), any(), any(), any(), any(), any()) } doReturn streamConnection
    }

    private lateinit var onSessionFound: (SpectaclesStreamAddress) -> Unit
    private lateinit var onDiscoveryFailed: (Int) -> Unit
    private val l2capDiscovery = mock<SpectaclesL2capServiceDiscovery>()
    private val l2capDiscoveryFactory = mock<SpectaclesL2capServiceDiscovery.Factory> {
        on { create(any(), any(), any(), any()) } doAnswer {
            onSessionFound = it.getArgument(2)
            onDiscoveryFailed = it.getArgument(3)
            l2capDiscovery
        }
    }

    private val statusObserver = mock<Consumer<SpectaclesSession.ConnectionStatus>>()

    private val delegateBuilder = mock<(SpectaclesSession) -> SpectaclesRequestDelegate> {
        on { invoke(any()) } doReturn mock()
    }

    private val executor = mock<Executor> {
        on { execute(any()) } doAnswer {
            it.getArgument<Runnable>(0).run()
        }
    }

    private val subject = DefaultSpectaclesSession(
        mock(),
        SpectaclesBonding(
            "",
            BondingIdentifier(UUID.randomUUID().toString(), "", ""),
            SpectaclesKit.BondingRequest.SingleLens("lens")
        ),
        SpectaclesKit.SessionRequest.Default(true, false, null),
        executor,
        delegateBuilder,
        streamConnectionFactory,
        l2capDiscoveryFactory
    )

    @Before
    fun setup() {
        subject.observeConnectionStatus(statusObserver)
        clearInvocations(statusObserver)
    }

    @Test
    fun `start(), status = initial`() {
        subject.start()

        verify(l2capDiscovery).start()
        assertTrue(subject.connectionStatus() is SpectaclesSession.ConnectionStatus.ConnectStart)
        verify(statusObserver).accept(
            argThat { this is SpectaclesSession.ConnectionStatus.ConnectStart }
        )
    }

    @Test
    fun `start(), status = scanning`() {
        subject.start()
        clearInvocations(l2capDiscovery)
        clearInvocations(statusObserver)

        subject.start()
        verify(l2capDiscovery, never()).start()
        verify(statusObserver, never()).accept(any())
    }

    @Test
    fun `onDiscoveryFailed(), status = scanning`() {
        subject.start()
        clearInvocations(l2capDiscovery)
        clearInvocations(statusObserver)

        onDiscoveryFailed.invoke(1)
        assertTrue(subject.connectionStatus() is SpectaclesSession.ConnectionStatus.Error)
        verify(statusObserver).accept(
            argThat { this is SpectaclesSession.ConnectionStatus.Error }
        )
    }

    @Test
    fun `onDiscoveryFailed(), status != scanning`() {
        onDiscoveryFailed.invoke(1)
        verify(statusObserver, never()).accept(any())
    }

    @Test
    fun `onSessionFound(), status = scanning`() {
        subject.start()
        clearInvocations(l2capDiscovery)
        clearInvocations(statusObserver)

        onSessionFound.invoke(mock())
        verify(l2capDiscovery).stop()
        verify(executor).execute(any())
    }

    @Test
    fun `onSessionFound(), status != scanning`() {
        onSessionFound.invoke(mock())
        verify(l2capDiscovery, never()).stop()
        verify(executor, never()).execute(any())
    }

    @Test
    fun `connect(), status = connecting`() {
        subject.start()
        onSessionFound.invoke(mock())

        verify(streamConnectionFactory).openConnection(any(), any(), any(), any(), any(), any())
        verify(streamConnection).setOnDisconnectedListener(any())
        verify(statusObserver).accept(
            argThat { this is SpectaclesSession.ConnectionStatus.Connected }
        )
    }

    @Test
    fun `connect(), status == connecting, error`() {
        whenever(streamConnectionFactory.openConnection(any(), any(), any(), any(), any(), any())).thenReturn(null)

        subject.start()
        onSessionFound.invoke(mock())

        verify(statusObserver).accept(
            argThat { this is SpectaclesSession.ConnectionStatus.Error}
        )
    }

    @Test
    fun `connect(), status == connecting, error but closed`() {
        whenever(streamConnection.setOnDisconnectedListener(any())).thenAnswer {
            subject.close(null)
            clearInvocations(statusObserver)
            throw Exception()
        }

        subject.start()
        onSessionFound.invoke(mock())

        verify(statusObserver, never()).accept(any())
    }

    @Test
    fun `connect(), status != connecting, first check`() {
        whenever(executor.execute(any())).thenAnswer {
            subject.close(null)
            it.getArgument<Runnable>(0).run()
        }

        subject.start()
        onSessionFound.invoke(mock())

        verify(streamConnectionFactory, never()).openConnection(any(), any(), any(), any(), any(), any())
    }

    @Test
    fun `connect(), status != connecting, second check`() {
        whenever(streamConnectionFactory.openConnection(any(), any(), any(), any(), any(), any())).thenAnswer {
            subject.close(null)
            streamConnection
        }

        subject.start()
        onSessionFound.invoke(mock())

        verify(streamConnection).close()
        verify(streamConnection, never()).setOnDisconnectedListener(any())
    }

    @Test
    fun `onDisconnected(), autoReconnect`() {
        subject.start()
        onSessionFound.invoke(mock())
        clearInvocations(l2capDiscovery)
        clearInvocations(statusObserver)

        onDisconnected.invoke(0)
        verify(statusObserver).accept(
            SpectaclesSession.ConnectionStatus.Disconnected(SpectaclesSession.DisconnectReason.CONNECTION_LOST)
        )
        verify(statusObserver).accept(
            SpectaclesSession.ConnectionStatus.ConnectStart
        )
        verify(l2capDiscovery).start()
    }

    @Test
    fun `onDisconnected(), not autoReconnect`() {
        val subject = DefaultSpectaclesSession(
            mock(),
            SpectaclesBonding(
                "",
                BondingIdentifier(UUID.randomUUID().toString(), "", ""),
                SpectaclesKit.BondingRequest.SingleLens("lens")
            ),
            SpectaclesKit.SessionRequest.Default(false, false, null),
            executor,
            delegateBuilder,
            streamConnectionFactory,
            l2capDiscoveryFactory
        )
        subject.observeConnectionStatus(statusObserver)
        subject.start()
        onSessionFound.invoke(mock())
        clearInvocations(l2capDiscovery)
        clearInvocations(statusObserver)

        onDisconnected.invoke(0)
        verify(statusObserver).accept(
            SpectaclesSession.ConnectionStatus.Disconnected(SpectaclesSession.DisconnectReason.CONNECTION_LOST)
        )
        verify(l2capDiscovery, never()).start()
    }

    @Test
    fun `onDisconnected(), closed`() {
        subject.start()
        onSessionFound.invoke(mock())
        subject.close(null)
        clearInvocations(l2capDiscovery)
        clearInvocations(statusObserver)

        onDisconnected.invoke(0)
        verify(statusObserver, never()).accept(any())
        verify(l2capDiscovery, never()).start()
    }

    @Test
    fun `close()`() {
        subject.close(null)
        verify(statusObserver).accept(
            SpectaclesSession.ConnectionStatus.Disconnected(
                SpectaclesSession.DisconnectReason.SESSION_CLOSED
            )
        )
    }

    @Test
    fun `close(), already closed`() {
        subject.close(null)
        clearInvocations(statusObserver)

        subject.close(null)
        verify(statusObserver, never()).accept(any())
    }

    @Test
    fun `observeConnectionStatus()`() {
        val observer = mock<Consumer<SpectaclesSession.ConnectionStatus>>()
        val closeable = subject.observeConnectionStatus(observer)
        verify(observer).accept(any())
        clearInvocations(observer)

        subject.start()
        verify(observer).accept(any())
        clearInvocations(observer)

        closeable.close()
        subject.close(SpectaclesSession.CloseReason.INCOMPATIBLE_LENS)
        verify(observer, never()).accept(any())
    }

    @Test
    fun `constructor()`() {
        DefaultSpectaclesSession(
            mock(),
            SpectaclesBonding(
                "",
                BondingIdentifier(UUID.randomUUID().toString(), "", ""),
                SpectaclesKit.BondingRequest.SingleLens("lens")
            ),
            SpectaclesKit.SessionRequest.Default(true, false, byteArrayOf(1) to byteArrayOf(2)),
            executor,
            delegateBuilder,
        )
    }
}
