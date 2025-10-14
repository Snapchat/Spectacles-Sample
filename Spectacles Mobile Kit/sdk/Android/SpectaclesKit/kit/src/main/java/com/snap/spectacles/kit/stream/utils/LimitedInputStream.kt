package com.snap.spectacles.kit.stream.utils

import java.io.InputStream

/**
 * A decorator for an existing [InputStream] that limits the amount of data read to a specified
 * number of bytes (`limit`). It optionally supports closing the underlying InputStream when this
 * stream is closed.
 *
 * @param underlying The InputStream being wrapped.
 * @param limit The maximum number of bytes that can be read from the stream.
 * @param closeUnderlyingStream If true, the underlying [InputStream] will be closed when this
 *                              stream is closed.
 */
class LimitedInputStream(
    private val underlying: InputStream,
    private val limit: Int,
    private val closeUnderlyingStream: Boolean
) : InputStream() {

    private var bytesRead = 0

    /**
     * Closes this stream if `closeUnderlyingStream` is true. If `closeUnderlyingStream` is false,
     * the underlying stream remains open, even if this stream is closed. It allows users to manage
     * the lifecycle of the wrapped [InputStream] independently.
     */
    override fun close() {
        if (closeUnderlyingStream) {
            underlying.close()
        }
    }

    override fun available(): Int {
        return (limit - bytesRead).coerceAtMost(underlying.available())
    }

    override fun read(): Int {
        return if (bytesRead < limit) {
            val byte = underlying.read()
            if (byte != -1) {
                bytesRead++
            }
            byte
        } else {
            -1
        }
    }

    override fun read(bytes: ByteArray, off: Int, len: Int): Int {
        val bytesToRead = (limit - bytesRead).coerceAtMost(len)
        return if (bytesToRead > 0) {
            val read = underlying.read(bytes, off, bytesToRead)
            if (read != -1) {
                bytesRead += read
            }
            read
        } else {
            -1
        }
    }
}
