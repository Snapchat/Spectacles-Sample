package com.snap.spectacles.kit.stream

import android.content.Context

interface SpectaclesStreamAdvertising {

    interface Factory {
        fun create(
            context: Context,
            identity: ByteArray,
            onAccept: (SpectaclesStreamAddress) -> Unit,
            onFailed: (Int) -> Unit
        ): SpectaclesStreamAdvertising
    }

    fun start()

    fun pause()

    fun resume()

    fun stop()
}
