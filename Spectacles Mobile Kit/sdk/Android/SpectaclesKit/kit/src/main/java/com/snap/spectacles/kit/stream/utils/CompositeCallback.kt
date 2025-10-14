package com.snap.spectacles.kit.stream.utils

/**
 * A composite runnable that can aggregate multiple callback actions.
 * When `run()` is called, it executes each callback in the order they were added.
 *
 * @param actions Vararg parameter to initialize the composite with multiple callbacks.
 */
class CompositeCallback(vararg actions: () -> Unit) : () -> Unit {

    // List of callback actions to execute.
    private val callbackActions = actions.toMutableList()

    /**
     * Adds a new callback action to the composite.
     *
     * @param action The callback action to add.
     */
    fun add(action: () -> Unit) {
        callbackActions.add(action)
    }

    /**
     * Executes all added callback actions sequentially.
     */
    override fun invoke() {
        callbackActions.forEach { it.invoke() }
    }
}
