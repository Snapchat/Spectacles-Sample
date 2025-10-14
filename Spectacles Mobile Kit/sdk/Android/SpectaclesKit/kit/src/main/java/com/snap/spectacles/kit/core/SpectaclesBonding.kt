package com.snap.spectacles.kit.core

import com.snap.spectacles.kit.SpectaclesKit

/**
 * A hybrid identifier that can be used to identify a Spectacles bonding.
 * The [assignedId] is a unique identifier assigned by the Spectacles when creating a bonding, but
 * it may not be unique across different Spectacles.
 * The [deviceAddress] is the BLE address of the Spectacles, which is unique.
 */
data class BondingIdentifier(
    // The bonding id assigned by the Spectacles when creating a bonding
    val assignedId: String,
    // BLE address of the Spectacles
    val deviceAddress: String,
    val deviceId: String,
)

/**
 * Represents a Spectacles bonding.
 */
data class SpectaclesBonding(
    override val id: String,
    val identifier: BondingIdentifier,
    val requested: SpectaclesKit.BondingRequest
) : SpectaclesKit.Bonding

typealias SpectaclesBondingSerializer = Serializer<SpectaclesBonding, String>
