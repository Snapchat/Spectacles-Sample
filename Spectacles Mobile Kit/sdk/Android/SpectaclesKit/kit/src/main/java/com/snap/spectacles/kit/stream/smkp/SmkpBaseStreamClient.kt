package com.snap.spectacles.kit.stream.smkp

import android.os.Build
import androidx.annotation.RequiresApi
import com.snap.spectacles.kit.stream.SpectaclesStream
import com.snap.spectacles.kit.stream.SpectaclesStreamConnection
import com.snap.spectacles.kit.stream.SpectaclesStreamDataUnit
import com.snap.spectacles.kit.stream.SpectaclesStreamException
import com.snap.spectacles.kit.stream.SpectaclesStreamPayload
import com.snap.spectacles.kit.stream.SpectaclesStreamWorker
import com.snap.spectacles.kit.stream.utils.readBytes
import java.io.Closeable
import java.util.concurrent.Executor

/**
 * Abstract Base class for stream clients, managing the lifecycle and processing of streaming messages.
 */
@RequiresApi(Build.VERSION_CODES.N)
abstract class SmkpBaseStreamClient(
    private val onResponse: OnResponse?,
    private val onClose: () -> Unit,
    private val connection: SpectaclesStreamConnection,
    executor: Executor,
    unpack: (SpectaclesStreamPayload) -> SmkpMessage = SmkpMessage.Companion::unpack,
    pack: (SmkpMessage) -> SpectaclesStreamPayload = SmkpMessage::pack,
    format: (SpectaclesStreamException) -> SmkpMessage = SmkpMessage.Response.Companion::error
) :
    SpectaclesStreamWorker<SmkpMessage>(executor, unpack, pack, format),
    Closeable {

    /**
     * Callback interface for handling response processing.
     */
    fun interface OnResponse {
        fun invoke(status: Int, header: SmkpMessage.Header, body: ByteArray, priority: Int, last: Boolean)
    }

    init {
        attachClosable(onClose::invoke)
    }

    override fun startStream(
        onReceive: (SpectaclesStreamDataUnit) -> Unit,
        onClose: () -> Unit
    ): SpectaclesStream {
        return connection.startStream(onReceive, onClose)
    }

    override fun onReceive(message: SmkpMessage, priority: Int, last: Boolean) {
        if (message !is SmkpMessage.Response) {
            throw SpectaclesStreamException(
                SpectaclesStreamException.NOT_IMPLEMENTED, "Unsupported type: ${message::class}"
            )
        }

        onReceiveResponse(message, priority, last)
    }

    /**
     * Called when received a [SmkpMessage.Response]
     */
    protected open fun onReceiveResponse(response: SmkpMessage.Response, priority: Int, last: Boolean) {
        if (null == onResponse) {
            throw SpectaclesStreamException(
                SpectaclesStreamException.NOT_IMPLEMENTED, "Unsupported response!"
            )
        }

        val body = response.body.getInputStream().use {
            it.readBytes(response.body.size)
        }
        onResponse.invoke(response.status, response.header, body, priority, last)
    }
}
