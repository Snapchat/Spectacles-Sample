package com.snap.spectacles.kit.stream

import android.content.Context

interface SpectaclesStreamDiscovery {

    interface Factory {
        fun create(
            context: Context,
            identity: ByteArray,
            onFound: (SpectaclesStreamAddress) -> Unit,
            onFailed: (Int) -> Unit
        ): SpectaclesStreamDiscovery
    }

    fun start()

    fun stop()
}
