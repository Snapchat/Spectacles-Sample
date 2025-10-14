package com.snap.spectacles.kit.stream.qlic

import com.snap.spectacles.kit.stream.SpectaclesStreamDataUnit
import com.snap.spectacles.kit.stream.utils.SpectaclesStreamHandler
import com.snap.spectacles.kit.util.Log
import java.io.Closeable
import java.util.concurrent.Semaphore
import java.util.concurrent.TimeUnit
import java.util.concurrent.atomic.AtomicBoolean
import java.util.concurrent.atomic.AtomicReference

private const val TAG = "QlicProtocolEngine"

/**
 * QlicProtocolEngine manages the communication protocol for a QLIC connection.
 *
 * @param socket The QlicEndpoint.Socket instance used for I/O operations with the peer.
 * @param authenticationManager The manager responsible for authentication processes.
 * @param keyExchangeManager The manager responsible for key exchange processes.
 * @param encryptionManager The manager responsible for encryption and decryption of data.
 * @param peerStreamHandlerFactory A factory function to create handlers for incoming streams.
 * @param onStop A callback to be executed when the engine is stopped.
 * @param isClient A boolean indicating if this instance is operating as a client.
 */
internal class QlicProtocolEngine(
    private val socket: QlicEndpoint.Socket,
    private val securityManager: QlicSecurityManager,
    peerStreamHandlerFactory: () -> SpectaclesStreamHandler,
    private val onStop: () -> Unit,
    private val isClient: Boolean,
    readerFactory: QlicPacketReader.Factory = QlicPacketReader.Factory,
    writerFactory: QlicPacketWriter.Factory = QlicPacketWriter.Factory,
    streamManagerFactory: QlicStreamManager.Factory = QlicStreamManager.Factory,
    trafficManagerFactory: QlicTrafficManager.Factory = QlicTrafficManager.Factory,
    flowControlFactory: QlicFlowControl.Factory = QlicFlowControl.Default.Factory,
    private val outgoingQueue: QlicFlowQueue = QlicFlowQueue.FixedPriorityQueue(Int.MAX_VALUE),
    private val handshakeHandlerFactory: QlicHandshakeHandler.Factory = QlicHandshakeHandler.Factory
) {

    object Factory {
        fun create(
            socket: QlicEndpoint.Socket,
            securityManager: QlicSecurityManager,
            peerStreamHandlerFactory: () -> SpectaclesStreamHandler,
            onStop: () -> Unit,
            isClient: Boolean
        ) = QlicProtocolEngine(
            socket,
            securityManager,
            peerStreamHandlerFactory,
            onStop,
            isClient
        )
    }

    private val log = Log.get(TAG)

    private val reader = readerFactory.create(
        socket.inputStream, ::handleIncomingPacket, ::onConnectionError, ::shutdown
    )

    private val writer = writerFactory.create(
        socket.outputStream, ::pollOutgoingPacket, ::onConnectionError, ::shutdown
    )

    // Manages the sequencing and transmission of outgoing data.
    private val flowControl = flowControlFactory.create()

    // Manages streams for incoming data handling.
    private val streamManager = streamManagerFactory.create(
        peerStreamHandlerFactory, flowControl, isClient
    )

    // Currently active frame handler responsible for processing frames.
    private var activeFrameHandler: QlicFrameHandler? = null

    // Manages the traffic
    private val trafficManager = trafficManagerFactory.create(
        throttleThreshold = (socket.preferredTransmitPacketSize * 2.5).toInt(),
        pingThreshold = socket.preferredTransmitPacketSize
    )

    // Time of inactivity before the first keep-alive probe is sent.
    @Volatile
    private var keepAliveIdleTime = Long.MAX_VALUE

    // Indicates whether "low latency" or "high throughput" is prioritized.
    private val isLowLatencyModeEnabled = AtomicBoolean(false)

    // Indicates whether output message throttling is active.
    private var isThrottling = false

    private val startupSemaphore = Semaphore(0)

    private val isShutdown = AtomicBoolean(false)

    /**
     * Starts the protocol by initiating authentication and key exchange processes.
     *
     * @param timeout The maximum time in milliseconds to wait for the startup processes.
     * @return True if the startup is successful, false otherwise.
     */
    fun start(timeout: Long): Boolean {
        log.debug { "start($timeout)" }

        // Setup the outbound pipe line.
        outgoingQueue.attach(flowControl)
        writer.start()

        // Setup the inbound pipe line.
        val success = AtomicReference<Boolean>(null)
        handshake {
            log.debug { "handshake completed" }
            activeFrameHandler = streamManager
            success.compareAndSet(null, true)
            startupSemaphore.release()
        }

        // Start receiving messages.
        reader.start()

        // Wait for handshake to complete.
        if (!startupSemaphore.tryAcquire(timeout, TimeUnit.MILLISECONDS)) {
            success.set(false)
            shutdown()
        }

        log.debug { "start($timeout), success = ${success.get()}" }
        return success.get() == true
    }

    /**
     * Enables or disables low latency mode.
     *
     * @param enable If true, enables low latency mode; if false, disables it.
     */
    fun setLowLatencyMode(enable: Boolean) {
        log.debug { "setLowLatencyMode($enable)" }

        if (isLowLatencyModeEnabled.compareAndSet(!enable, enable)) {
            adjustThrottling()
            if (isLowLatencyModeEnabled.get() && trafficManager.isPingRequired()) {
                ping()
            }
        }
    }

    /**
     * Sets the duration for the Keep-Alive mechanism.
     *
     * @param duration The duration (in milliseconds) for which the connection can stay idle before
     *                 the Keep-Alive check.
     */
    fun setKeepAliveTime(duration: Long) {
        keepAliveIdleTime = duration
        if (trafficManager.getTrafficIdleDuration() >= duration) {
            ping()
        }
    }

    /**
     * Shuts down the protocol.
     */
    fun shutdown(graceful: Boolean = false) {
        log.debug { "shutdown($graceful)" }

        if (graceful && !isShutdown.get()) {
            outgoingQueue.addLast(QlicPendingFrame.ConnectionCloseApplication(0, byteArrayOf())) {
                shutdown(false)
            }
            return
        }

        if (isShutdown.compareAndSet(false, true)) {
            startupSemaphore.release()

            activeFrameHandler?.also { active ->
                if (active is Closeable) {
                    active.close()
                }
            }
            outgoingQueue.detach()
            flowControl.shutdown()
            reader.shutdown()
            writer.shutdown()
            streamManager.shutdown()
            socket.close()

            onStop.invoke()
        }
    }

    /**
     * Starts a locally-initiated stream.
     *
     * @param isUnidirectional A flag indicating if the stream is unidirectional.
     * @param onReceive Callback invoked when data is received on the stream.
     * @param onClose Callback invoked when the stream is closed.
     * @return The created QlicStream instance.
     */
    fun startLocalStream(
        isUnidirectional: Boolean,
        onReceive: (SpectaclesStreamDataUnit) -> Unit,
        onClose: () -> Unit
    ): QlicStream {
        log.debug { "startStream($isUnidirectional)" }

        return streamManager.startLocalStream(isUnidirectional, onReceive, onClose)
    }

    /**
     * Polls for an outgoing packet to be sent.
     */
    private fun pollOutgoingPacket(): Pair<QlicPacket.Out, () -> Unit>? {
        while (true) {
            val timeout = (keepAliveIdleTime - trafficManager.getTrafficIdleDuration()).coerceAtLeast(0)
            val done = flowControl.waitForData(timeout) ?: return null
            if (!done) {
                // The Keep-Alive here is mainly used to check if the network is available and
                // doesn't concern whether the remote peer responds.
                ping()
                continue
            }

            val packet = QlicPacket.Out(socket.preferredTransmitPacketSize)
            val body = packet.getBody()
            val (size, callback) = securityManager.encryptionManager.createEncryptedStream(body)
                .use {
                    flowControl.writeDataToStream(
                        it,
                        body.getSpace() - securityManager.encryptionManager.getEncryptionOverheadSize()
                    )
                }

            if (size <= 0) {
                log.warn { "No data to send, which could lead to IV rotation misalignment!" }
                continue
            }

            return packet to {
                trafficManager.updateSentBytes(packet.size())
                adjustThrottling()
                if (isLowLatencyModeEnabled.get() && trafficManager.isPingRequired()) {
                    ping()
                }

                callback?.invoke()
            }
        }
    }

    /**
     * Handles an incoming packet by processing its frames.
     */
    private fun handleIncomingPacket(packet: QlicPacket.In) {
        trafficManager.updateReceivedBytes(packet.size())

        securityManager.encryptionManager.createDecryptedStream(packet.getBody()).use {
            while (true) {
                val frame = QlicFrame.deserialize(it) ?: break
                if (activeFrameHandler?.handle(frame) != true && !handleControlFrame(frame)) {
                    log.debug { "No owner for $frame!" }
                }
            }
        }
    }

    /**
     * Handles control frames such as Ping and Ack.
     */
    private fun handleControlFrame(frame: QlicFrame): Boolean {
        log.debug { "handleControlFrame($frame)" }

        when (frame) {
            is QlicFrame.Ping -> onPing(frame)
            is QlicFrame.Ack -> onAck(frame)
            is QlicFrame.ConnectionCloseProtocol -> onConnectionCloseProtocol(frame)
            is QlicFrame.ConnectionCloseApplication -> onConnectionCloseApplication(frame)
            else -> return false
        }
        return true
    }

    private fun onPing(frame: QlicFrame.Ping) {
        val bytesSinceLastAck = trafficManager.updateAcknowledgedReceivedBytes()
        outgoingQueue.addLast(QlicPendingFrame.Ack(bytesSinceLastAck), null)
    }

    private fun onAck(frame: QlicFrame.Ack) {
        trafficManager.updateAcknowledgedSentBytes(frame.bytesSinceLastAck)
        adjustThrottling()
    }

    private fun onConnectionCloseProtocol(frame: QlicFrame.ConnectionCloseProtocol) {
        shutdown()
    }

    private fun onConnectionCloseApplication(frame: QlicFrame.ConnectionCloseApplication) {
        shutdown()
    }

    private fun onConnectionError(error: Exception) {
        shutdown()
    }

    /**
     * Initiate the handshake process and executes the provided runnable upon successful handshake.
     *
     * @param onCompleted The runnable to execute after successful handshake.
     */
    private fun handshake(onCompleted: () -> Unit) {
        log.debug { "handshake()" }

        if (securityManager.noHandshake) {
            onCompleted.invoke()
            return
        }

        val handshakeHandler = handshakeHandlerFactory.create(
            securityManager.authenticationManager,
            securityManager.keyExchangeManager,
            securityManager.encryptionManager,
            securityManager.transcriptHashManager,
            securityManager.secureRandom,
            outgoingQueue::addLast,
            onCompleted,
            isClient
        )
        activeFrameHandler = handshakeHandler
        handshakeHandler.start()
    }

    /**
     * Adjusts the throttling state based on current conditions.
     * If throttling is active but no longer needed, it stops throttling.
     * If throttling is not active but becomes necessary, it starts throttling.
     */
    private fun adjustThrottling() {
        val isThrottlingNeeded = isLowLatencyModeEnabled.get() && trafficManager.isThrottlingRequired()
        synchronized(this) {
            if (isThrottling) {
                if (!isThrottlingNeeded) {
                    flowControl.stopThrottling()
                    isThrottling = false
                }
            } else {
                if (isThrottlingNeeded) {
                    flowControl.startThrottling(8)
                    isThrottling = true
                }
            }
        }
    }

    /**
     * Sends a Ping message to the peer and updates the traffic statistics.
     */
    private fun ping() {
        trafficManager.updatePingSentBytes()
        outgoingQueue.addLast(QlicPendingFrame.Ping, null)
    }
}
