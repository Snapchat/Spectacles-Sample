package com.snap.spectacles.kit.stream.qlic

import com.snap.spectacles.kit.stream.utils.Worker
import com.snap.spectacles.kit.util.Log
import java.io.OutputStream

private const val TAG = "QlicPacketWriter"

/**
 * A thread responsible for writing QLIC packets to an [OutputStream].
 * It retrieves outgoing packets from a blocking supplier and writes them to the stream.
 *
 * @property outputStream The output stream where the packets are written.
 * @property outgoingPacketProvider A blocking supplier that provides pairs of outgoing packets and
 *                                  callbacks. The supplier blocks if no packets are available.
 * @property onError An observer that handles exceptions occurring during the writing process.
 * @property onStop An observer that is notified when the reader thread terminates normally.
 */
internal class QlicPacketWriter(
    private val outputStream: OutputStream,
    private val outgoingPacketProvider: () -> Pair<QlicPacket.Out, () -> Unit>?,
    private val onError: (Exception) -> Unit,
    private val onStop: () -> Unit
) {

    object Factory {
        fun create(
            outputStream: OutputStream,
            outgoingPacketProvider: () -> Pair<QlicPacket.Out, () -> Unit>?,
            onError: (Exception) -> Unit,
            onStop: () -> Unit
        ) = QlicPacketWriter(outputStream, outgoingPacketProvider, onError, onStop)
    }

    private val log = Log.get(TAG)

    // Atomic flag to indicate when the thread should stop.
    @Volatile
    private var shouldStop = false

    private val worker = Worker.create(TAG, ::routine)

    /**
     * Starts this reader.
     */
    fun start() {
        worker.start()
    }

    /**
     * Waits for this reader to die.
     */
    fun join() {
        worker.join()
    }

    /**
     * Signals the thread to stop reading packets.
     */
    fun shutdown() {
        log.debug { "$this shutdown." }

        shouldStop = true
    }

    /**
     * The main logic for the thread that runs in a loop until no more packets are supplied.
     * It retrieves packets from the supplier, writes them to the output stream, and optionally runs
     * a callback once the packet is sent.
     */
    private fun routine() {
        log.debug { "$this started." }

        try {
            // Continues running until the supplier returns null.
            while (!shouldStop) {
                outgoingPacketProvider.invoke()?.let { (packet, callback) ->
                    log.debug { "send: $packet, this = $this" }
                    packet.writeTo(outputStream)
                    callback.invoke()
                } ?: break
            }
            onStop.invoke()
        } catch (e: Exception) {
            log.warn(e) { "error, this = $this" }
            onError.invoke(e)
        }

        log.debug { "$this ended." }
    }

    override fun toString(): String {
        return "QlicPacketWriter($worker, shouldStop = $shouldStop)"
    }
}
