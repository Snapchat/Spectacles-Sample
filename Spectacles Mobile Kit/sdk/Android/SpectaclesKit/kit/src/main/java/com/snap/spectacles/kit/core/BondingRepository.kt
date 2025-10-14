package com.snap.spectacles.kit.core

/**
 * A repository interface that manages all the available bonding information created by this App.
 */
interface BondingRepository {

    /**
     * Returns the bonding information for the given device.
     */
    fun getBonding(bondingId: String): SpectaclesBonding?

    /**
     * Returns all the bonding information available.
     */
    fun getAllBondings(): List<SpectaclesBonding>

    /**
     * Saves the given bonding information.
     */
    fun saveBonding(bonding: SpectaclesBonding)

    /**
     * Deletes the bonding information for the given device.
     */
    fun deleteBonding(bondingId: String)
}
