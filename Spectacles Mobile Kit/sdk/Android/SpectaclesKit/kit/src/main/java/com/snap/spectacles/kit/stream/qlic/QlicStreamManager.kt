package com.snap.spectacles.kit.stream.qlic

import com.snap.spectacles.kit.stream.SpectaclesStreamDataUnit
import com.snap.spectacles.kit.stream.utils.SpectaclesStreamHandler
import com.snap.spectacles.kit.util.Log
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.atomic.AtomicInteger

private val TAG = "QlicStreamManager"

/**
 * Manages the lifecycle and data flow of multiple QlicStream instances.
 * Handles incoming frames, initiates new streams, and closes streams as needed.
 *
 * @param peerStreamHandlerFactory Factory to create a new StreamHandler for handling incoming streams.
 * @param flowControl Manages flow control, regulating data sending rates and priorities.
 * @param isClient Flag indicating whether this instance acts as the client.
 */
internal class QlicStreamManager(
    private val peerStreamHandlerFactory: () -> SpectaclesStreamHandler,
    private val flowControl: QlicFlowControl,
    private val isClient: Boolean,
    private val streamFactory: QlicStream.Factory = QlicStream.Factory
) : QlicFrameHandler {

    object Factory {
        fun create(
            peerStreamHandlerFactory: () -> SpectaclesStreamHandler,
            flowControl: QlicFlowControl,
            isClient: Boolean
        ) = QlicStreamManager(peerStreamHandlerFactory, flowControl, isClient)
    }

    private val log = Log.get(TAG)

    // ID for the next stream initiated by this instance.
    private val nextInitiatedStreamId = AtomicInteger(0)

    // Map of currently active streams, keyed by stream ID.
    private val activeStreams = ConcurrentHashMap<QlicStreamId, QlicStream>()

    /**
     * Shuts down the stream manager.
     */
    fun shutdown() {
        activeStreams.values.forEach(QlicStream::shutdown)
    }

    /**
     * Starts a stream initiated by the local instance.
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
        val streamId = QlicStreamId(nextInitiatedStreamId.getAndIncrement(), 0, isUnidirectional, isClient)
        val stream = createStream(streamId, onReceive, onClose, false)
        return stream
    }

    override fun handle(frame: QlicFrame): Boolean {
        val streamId = frame.getStreamId() ?: return false

        var stream = activeStreams[streamId]
        if (null == stream && streamId.isClientInitiated != isClient && frame is QlicFrame.StreamData) {
            stream = acceptPeerStream(streamId)
        }
        stream?.handleIncomingFrame(frame)
            ?: log.warn { "Stream($streamId) doesn't exist, frame = $frame!" }

        return true
    }

    /**
     * Accepts an incoming stream initiated by the peer.
     *
     * @param streamId The ID of the stream to be initiated by the server.
     * @return The created QlicStream instance.
     */
    private fun acceptPeerStream(streamId: QlicStreamId): QlicStream {
        val handler = peerStreamHandlerFactory.invoke()
        return createStream(streamId, handler::onReceive, handler::onClose, true).apply {
            handler.onAttach(this)
        }
    }

    /**
     * Creates a new QlicStream instance and registers it with the flow control.
     *
     * @param streamId The unique identifier for the stream.
     * @param onReceive The callback for received data.
     * @param onClose The callback for when the stream is closed.
     * @param startedByPeer A flag indicating if the stream was initiated by the peer.
     * @return The newly created QlicStream instance.
     */
    private fun createStream(
        streamId: QlicStreamId,
        onReceive: (SpectaclesStreamDataUnit) -> Unit,
        onClose: () -> Unit,
        startedByPeer: Boolean
    ): QlicStream {
        log.debug { "createStream(streamId = $streamId, startedByPeer = $startedByPeer)" }

        lateinit var stream: QlicStream
        stream = streamFactory.create(
            streamId,
            onReceive,
            {
                onStreamClosed(stream)
                onClose.invoke()
            },
            startedByPeer
        )
        stream.attach(flowControl)
        activeStreams[streamId] = stream
        return stream
    }

    /**
     * Handles the closure of a stream by removing it from the active streams map.
     *
     * @param stream The QlicStream that has been closed.
     */
    private fun onStreamClosed(stream: QlicStream) {
        stream.detach()
        if (!activeStreams.remove(stream.streamId, stream)) {
            log.warn { "onStreamClosed(), stream($stream) doesn't exist!" }
        }
    }

    private fun QlicFrame.getStreamId(): QlicStreamId? {
        return when (this) {
            is QlicFrame.StreamData -> QlicStreamId(id)
            is QlicFrame.StreamReset -> QlicStreamId(id)
            is QlicFrame.StreamStopSending -> QlicStreamId(id)

            else -> null
        }
    }
}
