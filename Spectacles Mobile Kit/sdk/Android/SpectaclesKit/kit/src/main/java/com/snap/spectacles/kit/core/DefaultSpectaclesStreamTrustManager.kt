package com.snap.spectacles.kit.core

import com.snap.spectacles.kit.SpectaclesKit
import com.snap.spectacles.kit.stream.SpectaclesStreamTrustManager

class DefaultSpectaclesStreamTrustManager(
    bonding: SpectaclesBonding,
    config: SpectaclesKit.SessionRequest
) : SpectaclesStreamTrustManager by SpectaclesStreamTrustManager.Default(
    if (config.acceptUnfusedSpectacles)
        SpectaclesStreamTrustManager.Default.SPECTACLES_ALL
    else
        SpectaclesStreamTrustManager.Default.SPECTACLES_PROD,
    if (config.acceptUntrustedLens)
        emptySet()
    else if (bonding.requested is SpectaclesKit.BondingRequest.SingleLensByLensId)
        setOf(bonding.requested.lensId)
    else if (bonding.requested is SpectaclesKit.BondingRequest.SingleLens)
        setOf(bonding.requested.lensId)
    else
        emptySet()
)
