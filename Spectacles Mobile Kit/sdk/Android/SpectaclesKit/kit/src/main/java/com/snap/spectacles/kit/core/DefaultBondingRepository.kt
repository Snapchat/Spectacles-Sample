package com.snap.spectacles.kit.core

import android.content.Context
import android.content.SharedPreferences

private const val DEFAULT_PREFS_NAME = "kit_bonding_repo"

/**
 * A [SharedPreferences] based [BondingRepository] implementation.
 */
class DefaultBondingRepository(
    private val context: Context,
    private val serializer: SpectaclesBondingSerializer = DefaultSpectaclesBondingSerializer(),
) : BondingRepository {

    private val sharedPreferences: SharedPreferences by lazy {
        context.getSharedPreferences(DEFAULT_PREFS_NAME, Context.MODE_PRIVATE)
    }

    override fun getBonding(bondingId: String): SpectaclesBonding? =
        getAllBondings().firstOrNull { bonding ->
            bonding.id == bondingId
        }

    override fun getAllBondings(): List<SpectaclesBonding> =
        sharedPreferences.all.values
            .mapNotNull { record ->
                try {
                    serializer.deserialize(record as String)
                } catch (e: IllegalArgumentException) {
                    null
                }
            }

    override fun saveBonding(bonding: SpectaclesBonding) =
        sharedPreferences.edit()
            .putString(bonding.id, serializer.serialize(bonding))
            .apply()

    override fun deleteBonding(bondingId: String) =
        sharedPreferences.edit()
            .remove(bondingId)
            .apply()
}
