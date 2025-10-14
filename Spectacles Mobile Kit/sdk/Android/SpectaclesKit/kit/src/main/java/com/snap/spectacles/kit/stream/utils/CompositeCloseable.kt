package com.snap.spectacles.kit.stream.utils

import java.io.Closeable

/**
 * A class that manages multiple Closeable resources.
 * When closed, it automatically closes all registered resources.
 * After being closed, any new Closeable added will be closed immediately.
 */
class CompositeCloseable : Closeable {

    @Volatile
    private var isClosed = false

    // Set of Closeable resources to manage.
    private var set = mutableSetOf<Closeable>()

    /**
     * Closes all registered Closeable resources.
     */
    override fun close() {
        synchronized(lock = this) {
            if (!isClosed) {
                isClosed = true
                val old = set
                set = mutableSetOf()
                old
            } else {
                null
            }
        }?.forEach(::safelyClose)
    }

    /**
     * Adds a Closeable resource to the manager.
     * If already closed, the Closeable is closed immediately.
     *
     * @param closeable The Closeable resource to add.
     * @return True if added successfully; false if already closed.
     */
    fun add(closeable: Closeable): Boolean {
        synchronized(lock = this) {
            if (!isClosed) {
                set.add(closeable)
                return true
            }
        }
        safelyClose(closeable)
        return false
    }

    /**
     * Attempts to remove a Closeable resource from the manager.
     * Returns false if the manager is closed or the resource is not found.
     *
     * @param closeable The Closeable resource to remove.
     * @return True if removed successfully; false otherwise.
     */
    fun delete(closeable: Closeable): Boolean {
        return synchronized(lock = this) {
            !isClosed && set.remove(closeable)
        }
    }

    /**
     * Removes and closes the specified Closeable resource if it exists in the manager.
     *
     * @param closeable The Closeable resource to remove and close.
     */
    fun remove(closeable: Closeable) {
        if (delete(closeable)) {
            safelyClose(closeable)
        }
    }

    /**
     * Closes all registered Closeable resources.
     */
    fun clear() {
        synchronized(lock = this) {
            val old = set
            set = mutableSetOf()
            old
        }.forEach(::safelyClose)
    }

    /**
     * Safely closes a Closeable resource, handling any exceptions that may occur.
     *
     * @param closeable The Closeable resource to close.
     */
    private fun safelyClose(closeable: Closeable) {
        try {
            closeable.close()
        } catch (_: Exception) {
        }
    }
}
