package com.snap.spectacles.kit.stream.qlic

import android.os.Build
import androidx.annotation.RequiresApi
import com.snap.spectacles.kit.stream.SpectaclesStream
import com.snap.spectacles.kit.stream.SpectaclesStreamAddress
import com.snap.spectacles.kit.stream.SpectaclesStreamConnection
import com.snap.spectacles.kit.stream.SpectaclesStreamDataUnit
import com.snap.spectacles.kit.stream.SpectaclesStreamRoute
import com.snap.spectacles.kit.stream.utils.CompositeCloseable
import com.snap.spectacles.kit.stream.utils.SpectaclesStreamHandler
import com.snap.spectacles.kit.util.Log
import java.io.Closeable
import java.util.concurrent.TimeoutException
import kotlin.jvm.Throws

private const val TAG = "QlicConnection"

/**
 * Represents a QLIC connection.
 */
@RequiresApi(Build.VERSION_CODES.O)
internal open class QlicConnection(
    private val securityManager: QlicSecurityManager,
    private val requestRoute: SpectaclesStreamRoute,
    private val isClient: Boolean,
    private val protocolEngineFactory: QlicProtocolEngine.Factory = QlicProtocolEngine.Factory
) : SpectaclesStreamConnection {

    object Factory {
        fun create(
            securityManager: QlicSecurityManager,
            requestRoute: SpectaclesStreamRoute,
            isClient: Boolean
        ) = QlicConnection(
            securityManager,
            requestRoute,
            isClient
        )
    }

    private val log = Log.get(TAG)

    private var engine: QlicProtocolEngine? = null

    private var onDisconnectedListener: ((Int) -> Unit)? = null

    @Volatile
    private var disconnectedReason: Int? = null

    @Volatile
    private var isEngineStarted = false

    private var remoteAddress: SpectaclesStreamAddress? = null

    private val compositeCloseable = CompositeCloseable()

    /**
     * Attaches a [Closeable] to this connection.
     * The attached [Closeable] will be automatically closed when this connection is closed.
     */
    fun attach(closable: Closeable) {
        compositeCloseable.add(closable)
    }

    override fun close() {
        engine?.shutdown(true)
    }

    @Throws
    override fun connect(endpoint: SpectaclesStreamAddress, timeout: Int) {
        remoteAddress = endpoint

        val socket = (endpoint as QlicEndpoint).connect(timeout)
        engine = protocolEngineFactory.create(
            socket,
            securityManager,
            { SpectaclesStreamHandler.Default(requestRoute) },
            ::onProtocolStop,
            isClient
        )

        if (!engine!!.start(timeout.toLong())) {
            throw TimeoutException()
        }
        isEngineStarted = true
    }

    override fun getRemoteAddress(): SpectaclesStreamAddress? {
        return remoteAddress
    }

    override fun isConnected(): Boolean {
        return isEngineStarted && disconnectedReason == null
    }

    override fun setOnDisconnectedListener(onDisconnected: (Int) -> Unit) {
        synchronized(lock = this) {
            if (null == disconnectedReason) {
                onDisconnectedListener = onDisconnected
                null
            } else {
                onDisconnected
            }
        }?.invoke(disconnectedReason!!)
    }

    override fun startStream(
        onReceive: (SpectaclesStreamDataUnit) -> Unit,
        onClose: () -> Unit
    ): SpectaclesStream {
        return engine!!.startLocalStream(false, onReceive, onClose)
    }

    override fun startStream(
        onClose: () -> Unit
    ): SpectaclesStream {
        return engine!!.startLocalStream(
            true,
            {
                log.warn { "Unexpected data received for the unidirectional stream, data = $it" }
            },
            onClose
        )
    }

    override fun setLowLatencyMode(enable: Boolean) {
        engine!!.setLowLatencyMode(enable)
    }

    override fun setKeepAliveTime(duration: Long) {
        engine!!.setKeepAliveTime(duration)
    }

    private fun onProtocolStop() {
        log.debug { "onProtocolStop(), disconnectedReason = $disconnectedReason" }

        compositeCloseable.close()

        synchronized(lock = this) {
            if (null == disconnectedReason) {
                disconnectedReason = 0
                onDisconnectedListener?.also { onDisconnectedListener = null }
            } else {
                null
            }
        }?.invoke(0)
    }
}
