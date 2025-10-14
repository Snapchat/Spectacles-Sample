package com.snap.spectacles.kit.core

import android.content.Context

internal class DefaultKitDependencies(context: Context): DefaultSpectaclesKit.Dependencies {

    override val bondingSerializer: SpectaclesBondingSerializer by lazy {
        DefaultSpectaclesBondingSerializer()
    }

    override val bondingRepository: BondingRepository = DefaultBondingRepository(context)

    override val bindingProcessor: BindingProcessor = DefaultBindingProcessor(context)

    override val unbindingProcessor: UnbindingProcessor = DefaultUnbindingProcessor(context)
}
