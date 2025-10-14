package com.snap.spectacles.kit.stream.utils

/**
 * Worker interface representing a unit of work that can be executed asynchronously.
 */
interface Worker {

    companion object {
        /**
         * Factory method to create a Worker instance.
         * @param name The name of the worker.
         * @param target The task (callback) that the worker will execute.
         */
        fun create(name: String, target: () -> Unit): Worker = ThreadWorker(name, target)
    }

    /**
     * Starts the worker.
     */
    fun start()

    /**
     * Waits for the worker to complete execution.
     */
    fun join()

    /**
     * Implementation of Worker using a daemon thread.
     */
    private class ThreadWorker(
        private val name: String,
        target: () -> Unit
    ) : Worker {

        // Daemon thread ensures it doesn't block JVM shutdown
        private val thread = Thread(target, name).apply { isDaemon = true }

        override fun start() = thread.start()

        override fun join() = thread.join()

        override fun toString(): String = "ThreadWorker@${hashCode()}($name)"
    }
}
