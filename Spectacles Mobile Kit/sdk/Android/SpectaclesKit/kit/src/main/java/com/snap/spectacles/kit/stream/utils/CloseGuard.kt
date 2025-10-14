package com.snap.spectacles.kit.stream.utils

import java.io.Closeable
import java.util.concurrent.atomic.AtomicBoolean

/**
 * A utility class that ensures a given Closeable resource is closed safely and only once.
 * @param T The type of the Closeable resource.
 * @property subject The Closeable instance to be guarded.
 */
class CloseGuard<T : Closeable>(
    val subject: T
) : Closeable {

    private val closed = AtomicBoolean(false)

    fun isClosed() = closed.get()

    override fun close() {
        if (closed.compareAndSet(false, true)) {
            subject.close()
        }
    }
}
