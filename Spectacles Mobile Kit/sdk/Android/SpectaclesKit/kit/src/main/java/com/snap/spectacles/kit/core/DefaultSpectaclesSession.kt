package com.snap.spectacles.kit.core

import android.Manifest
import android.content.Context
import androidx.annotation.RequiresPermission
import com.snap.spectacles.kit.SpectaclesKit
import com.snap.spectacles.kit.SpectaclesRequestDelegate
import com.snap.spectacles.kit.SpectaclesSession
import com.snap.spectacles.kit.stream.SpectaclesStreamAddress
import com.snap.spectacles.kit.stream.SpectaclesStreamConnection
import com.snap.spectacles.kit.stream.SpectaclesStreamDiscovery
import com.snap.spectacles.kit.stream.l2cap.SpectaclesL2capServerEndpoint
import com.snap.spectacles.kit.stream.l2cap.SpectaclesL2capServiceDiscovery
import com.snap.spectacles.kit.stream.qlic.QlicConnectionConfig
import com.snap.spectacles.kit.stream.qlic.QlicConnectionFactory
import com.snap.spectacles.kit.stream.security.KeyManager
import com.snap.spectacles.kit.stream.utils.toUuidByteArray
import com.snap.spectacles.kit.util.Log
import java.io.Closeable
import java.security.SecureRandom
import java.util.concurrent.ConcurrentLinkedQueue
import java.util.concurrent.Executor
import java.util.function.Consumer

private const val TAG = "DefaultSpectaclesSession"

class DefaultSpectaclesSession(
    context: Context,
    private val bonding: SpectaclesBonding,
    private val config: SpectaclesKit.SessionRequest,
    private val executor: Executor,
    private val delegateBuilder: (SpectaclesSession) -> SpectaclesRequestDelegate,
    private val streamConnectionFactory: QlicConnectionFactory = QlicConnectionFactory,
    serviceDiscoveryFactory: SpectaclesStreamDiscovery.Factory = SpectaclesL2capServiceDiscovery.Factory
) : SpectaclesSession {

    private sealed interface Status {
        fun value(): SpectaclesSession.ConnectionStatus =
            SpectaclesSession.ConnectionStatus.ConnectStart

        object Initial : Status

        object Scanning : Status

        object Connecting : Status

        class Connected(val metadata: Map<String, String> = emptyMap()) : Status {
            override fun value(): SpectaclesSession.ConnectionStatus =
                SpectaclesSession.ConnectionStatus.Connected(SpectaclesSession.Metadata("", ""))
        }

        class Disconnected(val reason: Int) : Status {
            override fun value(): SpectaclesSession.ConnectionStatus =
                SpectaclesSession.ConnectionStatus.Disconnected(SpectaclesSession.DisconnectReason.CONNECTION_LOST)
        }

        class Failed(val error: Exception) : Status {
            override fun value(): SpectaclesSession.ConnectionStatus =
                SpectaclesSession.ConnectionStatus.Error(error)
        }

        class Closed(val reason: SpectaclesSession.CloseReason?) : Status {
            override fun value(): SpectaclesSession.ConnectionStatus =
                SpectaclesSession.ConnectionStatus.Disconnected(SpectaclesSession.DisconnectReason.SESSION_CLOSED)
        }
    }
    
    private val log = Log.get(TAG)

    private val statusObserves = ConcurrentLinkedQueue<Consumer<SpectaclesSession.ConnectionStatus>>()

    private val serviceDiscovery = serviceDiscoveryFactory.create(
        context,
        bonding.identifier.assignedId.toUuidByteArray(),
        ::onSessionFound,
        ::onDiscoveryFailed
    )

    @Volatile
    private var sessionStatus: Status = Status.Initial

    @Volatile
    private var streamConnection: SpectaclesStreamConnection? = null

    @RequiresPermission(allOf = [Manifest.permission.BLUETOOTH_SCAN, Manifest.permission.BLUETOOTH_CONNECT])
    fun start() {
        log.debug { "start(), status = $sessionStatus" }

        synchronized(lock = this) {
            if (sessionStatus !is Status.Initial && sessionStatus !is Status.Disconnected) {
                return
            }
            sessionStatus = Status.Scanning
            serviceDiscovery.start()
        }
        publishSessionStatus()
    }

    override fun observeConnectionStatus(
        onStatus: Consumer<SpectaclesSession.ConnectionStatus>,
    ): Closeable {
        statusObserves.add(onStatus)
        onStatus.accept(sessionStatus.value())
        return Closeable {
            statusObserves.remove(onStatus)
        }
    }

    override fun connectionStatus(): SpectaclesSession.ConnectionStatus {
        return sessionStatus.value()
    }

    @RequiresPermission(value = Manifest.permission.BLUETOOTH_SCAN)
    override fun close(reason: SpectaclesSession.CloseReason?) {
        log.debug { "close($reason), status = $sessionStatus" }

        val connection = synchronized(lock = this) {
            if (sessionStatus is Status.Closed) {
                return
            }
            sessionStatus = Status.Closed(reason)
            streamConnection.also {
                streamConnection = null
            }
        }

        connection?.close()
        serviceDiscovery.stop()
        publishSessionStatus()
    }

    @RequiresPermission(allOf = [Manifest.permission.BLUETOOTH_SCAN, Manifest.permission.BLUETOOTH_CONNECT])
    private fun onSessionFound(address: SpectaclesStreamAddress) {
        log.debug { "onSessionFound($address), status = $sessionStatus" }

        if (bonding.identifier.deviceAddress.isNotEmpty() &&
            !(address is SpectaclesL2capServerEndpoint && address.device.address == bonding.identifier.deviceAddress)) {
            return
        }

        synchronized(lock = this) {
            if (Status.Scanning != sessionStatus) {
                return
            }
            sessionStatus = Status.Connecting
            serviceDiscovery.stop()
        }
        publishSessionStatus()

        executor.execute {
            connect(address)
        }
    }

    private fun onDiscoveryFailed(error: Int) {
        log.debug { "onDiscoveryFailed($error), status = $sessionStatus" }

        synchronized(lock = this) {
            if (Status.Scanning != sessionStatus) {
                return
            }
            sessionStatus = Status.Failed(Exception("BLE discovery failed: $error"))
        }
        publishSessionStatus()
    }

    @RequiresPermission(allOf = [Manifest.permission.BLUETOOTH_SCAN, Manifest.permission.BLUETOOTH_CONNECT])
    private fun connect(address: SpectaclesStreamAddress) {
        log.debug { "connect($address), status = $sessionStatus" }

        synchronized(lock = this) {
            if (sessionStatus !is Status.Connecting) {
                return
            }
        }

        try {
            val trustManager = DefaultSpectaclesStreamTrustManager(bonding, config)
            val route = DefaultSpectaclesStreamRoute(
                delegateBuilder.invoke(this),
                trustManager,
                executor,
                !config.acceptUntrustedLens
            )

            val connection = streamConnectionFactory.openConnection(
                address,
                route,
                trustManager,
                KeyManager.Default(bonding.id),
                SecureRandom(),
                QlicConnectionConfig(
                    preSharedSecret = config.preSharedSecret
                )
            )

            synchronized(lock = this) {
                if (sessionStatus !is Status.Connecting) {
                    connection.close()
                    return
                }
                sessionStatus = Status.Connected()
                streamConnection = connection
            }
            publishSessionStatus()

            connection.setOnDisconnectedListener {
                synchronized(lock = this) {
                    if (streamConnection != connection) {
                        return@setOnDisconnectedListener
                    }
                    streamConnection = null
                    sessionStatus = Status.Disconnected(it)
                }
                publishSessionStatus()

                if (config.autoReconnect) {
                    start()
                }
            }
        } catch (e: Exception) {
            log.warn(e) { "Failed to connect: $address" }

            synchronized(lock = this) {
                if (sessionStatus is Status.Closed) {
                    return
                }
                sessionStatus = Status.Failed(e)
            }
            publishSessionStatus()
        }
    }

    private fun publishSessionStatus() {
        log.debug { "publishSessionStatus(), sessionStatus = $sessionStatus" }

        val status = sessionStatus.value()
        statusObserves.forEach {
            it.accept(status)
        }
    }
}
