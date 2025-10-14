package com.snap.spectacles.kit.sample

import android.content.Context
import com.snap.spectacles.kit.SpectaclesKit
import com.snap.spectacles.kit.core.BondingIdentifier
import com.snap.spectacles.kit.core.SpectaclesBonding
import com.snap.spectacles.kit.newBuilder
import com.snap.spectacles.kit.util.Log
import java.io.Closeable
import java.lang.Exception
import java.util.concurrent.Executors
import java.util.function.Consumer

object SpectaclesKitHolder {

    // Singleton instance of SpectaclesKit
    private var kit: SpectaclesKit? = null
    private var onBondingCreated: Consumer<SpectaclesKit.Bonding>? = null
    private var onBondingError: Consumer<Exception>? = null

    fun create(context: Context) {
        if (kit == null) {
            Log.provider = { Log.System(it) }

            val appVersionName = context.packageManager
                .getPackageInfo(context.packageName, 0)
                .versionName
            kit = newBuilder(context)
                .setIdentifier(SpectaclesKit.ClientIdentifier("sample-identifier"))
                .setVersion(appVersionName)
                .setRequestExecutor(Executors.newFixedThreadPool(8))
                .build()
        }
    }

    fun requireKit(): SpectaclesKit {
        return kit ?: throw IllegalStateException("SpectaclesKit not initialized")
    }

    fun observeBonding(
        onBonding: Consumer<SpectaclesKit.Bonding>,
        onError: Consumer<Exception> = Consumer {},
    ) {
        onBondingCreated = onBonding
        onBondingError = onError
    }

    fun createBonding(): Closeable {
        val request = if (!DemoSettings.useLensNameBonding) {
            SpectaclesKit.BondingRequest.SingleLensByLensId(
                lensId = "SpecsMobileKit",
            )
        } else {
            SpectaclesKit.BondingRequest.SingleLensByLensName(
                lensName = "SpecsMobileKit",
            )
        }

        if (DemoSettings.skipBonding) {
            val bonding = SpectaclesBonding(
                "demo_mobile",
                BondingIdentifier("00000000-0000-0000-0000-000000000000", "", ""),
                request
            )
            onBondingCreated?.accept(bonding)
            return Closeable {}
        }
        else {
            return requireKit().bind(request) { result ->
                when (result) {
                    is SpectaclesKit.BondingResult.Success -> {
                        onBondingCreated?.accept(result.bonding)
                    }

                    is SpectaclesKit.BondingResult.Failure -> {
                        onBondingError?.accept(result.exception)
                    }
                }
            }
        }
    }
}

fun requireKit(): SpectaclesKit = SpectaclesKitHolder.requireKit()
