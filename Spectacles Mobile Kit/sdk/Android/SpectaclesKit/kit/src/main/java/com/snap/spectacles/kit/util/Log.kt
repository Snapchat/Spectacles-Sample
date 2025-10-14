package com.snap.spectacles.kit.util

/**
 * Interface for logging functionality.
 * Allows setting a custom logging provider that can be used across the application.
 */
interface Log {

    companion object {

        fun get(tag: String): Log {
            return provider?.invoke(tag) ?: Disabled
        }

        /**
         * Holds the current logging provider instance that will be used to log messages.
         * If set to null, logging will be disabled.
         */
        var provider: ((String) -> Log?)? = null
    }

    /**
     * Checks to see whether or not log is enabled.
     */
    fun enabled(): Boolean

    /**
     * Send a VERBOSE log message.
     */
    fun verbose(message: () -> String)

    /**
     * Send a INFO log message.
     */
    fun info(message: () -> String)

    /**
     * Send a DEBUG log message.
     */
    fun debug(message: () -> String)

    /**
     * Send a WARNING_WITHOUT_TRACE log message.
     */
    fun warn(message: () -> String)

    /**
     * Send a WARNING_WITH_TRACE log message.
     */
    fun warn(throwable: Throwable, message: () -> String)

    /**
     * Send a ERROR log message.
     */
    fun err(message: () -> String)

    /**
     * Send a ERROR log message.
     */
    fun err(throwable: Throwable, message: () -> String)

    private object Disabled : Log {
        override fun enabled(): Boolean = false
        override fun verbose(message: () -> String) = Unit
        override fun info(message: () -> String) = Unit
        override fun debug(message: () -> String) = Unit
        override fun warn(message: () -> String) = Unit
        override fun warn(throwable: Throwable, message: () -> String) = Unit
        override fun err(message: () -> String) = Unit
        override fun err(throwable: Throwable, message: () -> String) = Unit
    }

    /**
     * Implementation of the [Log] interface that uses the Android [android.util.Log] class for logging.
     */
    class System(private val tag: String) : Log {
        override fun enabled(): Boolean = true

        override fun verbose(message: () -> String) {
            android.util.Log.v(tag, message.invoke())
        }

        override fun info(message: () -> String) {
            android.util.Log.i(tag, message.invoke())
        }

        override fun debug(message: () -> String) {
            android.util.Log.d(tag, message.invoke())
        }

        override fun warn(message: () -> String) {
            android.util.Log.w(tag, message.invoke())
        }

        override fun warn(throwable: Throwable, message: () -> String) {
            android.util.Log.w(tag, message.invoke(), throwable)
        }

        override fun err(message: () -> String) {
            android.util.Log.e(tag, message.invoke())
        }

        override fun err(throwable: Throwable, message: () -> String) {
            android.util.Log.e(tag, message.invoke(), throwable)
        }
    }
}
