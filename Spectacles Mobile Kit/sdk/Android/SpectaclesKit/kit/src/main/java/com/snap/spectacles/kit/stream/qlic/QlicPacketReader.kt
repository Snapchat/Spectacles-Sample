package com.snap.spectacles.kit.stream.qlic

import com.snap.spectacles.kit.stream.utils.Worker
import com.snap.spectacles.kit.util.Log
import java.io.InputStream

private const val TAG = "QlicPacketReader"

/**
 * A thread responsible for reading incoming QLIC packets from an InputStream.
 * The thread continuously reads packets from the stream until the exit signal is triggered.
 *
 * @property input The input stream from which packets are read.
 * @property onReceive A consumer that processes incoming packets.
 * @property onError An observer that handles exceptions occurring during the writing process.
 * @property onStop An observer that is notified when the reader thread terminates normally.
 */
internal class QlicPacketReader(
    private val input: InputStream,
    private val onReceive: (QlicPacket.In) -> Unit,
    private val onError: (Exception) -> Unit,
    private val onStop: () -> Unit
) {

    object Factory {
        fun create(
            input: InputStream,
            onReceive: (QlicPacket.In) -> Unit,
            onError: (Exception) -> Unit,
            onStop: () -> Unit
        ) = QlicPacketReader(input, onReceive, onError, onStop)
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

    private fun routine() {
        log.debug { "$this started." }

        try {
            while (!shouldStop) {
                val packet = QlicPacket.In.readFrom(input)
                log.debug { "receive: $packet, this = $this" }
                if (shouldStop || null == packet) {
                    break
                }
                onReceive.invoke(packet)
            }
            onStop.invoke()
        } catch (e: Exception) {
            log.warn(e) { "error, this = $this" }
            onError.invoke(e)
        }

        log.debug { "$this ended." }
    }

    override fun toString(): String {
        return "QlicPacketReader($worker, shouldStop = $shouldStop)"
    }
}
