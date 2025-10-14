package com.snap.spectacles.kit.core

import android.Manifest
import android.content.Context
import androidx.annotation.RequiresPermission
import com.snap.spectacles.kit.SpectaclesKit
import com.snap.spectacles.kit.SpectaclesRequestDelegate
import com.snap.spectacles.kit.SpectaclesSession
import com.snap.spectacles.kit.util.Log
import java.io.Closeable
import java.security.MessageDigest
import java.util.Base64
import java.util.concurrent.Executor
import java.util.function.Consumer

private const val TAG = "DefaultSpectaclesKit"

class DefaultSpectaclesKit(
    private val context: Context,
    private val clientIdentifier: SpectaclesKit.ClientIdentifier,
    private val clientVersion: String,
    private val executor: Executor,
    private val dependencies: Dependencies,
) : SpectaclesKit {

    interface Dependencies {
        val bondingSerializer: SpectaclesBondingSerializer
        val bondingRepository: BondingRepository
        val bindingProcessor: BindingProcessor
        val unbindingProcessor: UnbindingProcessor
    }

    private val log = Log.get(TAG)

    override fun bind(
        request: SpectaclesKit.BondingRequest,
        onResult: Consumer<SpectaclesKit.BondingResult>
    ): Closeable = dependencies.bindingProcessor
        .bind(request.toBindingRequest()) { response ->
            when (response) {
                is BindingProcessor.Response.Bind.Success -> {
                    val bonding = response.toBonding(request)
                    dependencies.bondingRepository.saveBonding(bonding)
                    onResult.accept(SpectaclesKit.BondingResult.Success(bonding))
                }

                is BindingProcessor.Response.Bind.Failure -> {
                    onResult.accept(SpectaclesKit.BondingResult.Failure(response.error))
                }
            }
        }

    override fun unbind(
        id: String,
        onResult: Consumer<SpectaclesKit.UnbindingResult>,
        graceful: Boolean
    ): Closeable {
        val bonding = dependencies.bondingRepository.getBonding(id)
        if (null == bonding) {
            onResult.accept(SpectaclesKit.UnbindingResult.Success)
            return Closeable {}
        }

        return dependencies.unbindingProcessor.unbind(
            UnbindingProcessor.Request.Unbind(bonding.identifier.assignedId, bonding.identifier.deviceId)
        ) { response ->
            when (response) {
                is UnbindingProcessor.Response.Unbind.Success -> {
                    dependencies.bondingRepository.deleteBonding(id)
                    onResult.accept(SpectaclesKit.UnbindingResult.Success)
                }

                is UnbindingProcessor.Response.Unbind.Failure -> {
                    if (graceful) {
                        onResult.accept(SpectaclesKit.UnbindingResult.Failure(response.error))
                    } else {
                        dependencies.bondingRepository.deleteBonding(id)
                        onResult.accept(SpectaclesKit.UnbindingResult.Success)
                    }
                }
            }
        }
    }

    override fun availableBondings(): List<SpectaclesKit.Bonding> =
        dependencies.bondingRepository.getAllBondings()

    override fun getBonding(id: String): SpectaclesKit.Bonding? =
        dependencies.bondingRepository.getBonding(id)

    @RequiresPermission(allOf = [Manifest.permission.BLUETOOTH_SCAN, Manifest.permission.BLUETOOTH_CONNECT])
    override fun createSession(
        bonding: SpectaclesKit.Bonding,
        request: SpectaclesKit.SessionRequest,
        delegateBuilder: (SpectaclesSession) -> SpectaclesRequestDelegate
    ): SpectaclesSession {
        log.debug { "createSession($bonding, $request)" }

        val bondingId = if (bonding is SpectaclesBonding) {
            bonding
        } else {
            dependencies.bondingRepository.getBonding(bonding.id)
        }
        checkNotNull(bondingId) { "Bonding, ${bonding.id}, doesn't exist!" }

        return DefaultSpectaclesSession(
            context = context,
            bonding = bondingId,
            config = request,
            executor = executor,
            delegateBuilder = delegateBuilder
        ).apply {
            start()
        }
    }

    companion object {

        fun newBuilder(context: Context): SpectaclesKit.Builder =
            DefaultSpectaclesKitBuilder(context)
    }

    private fun SpectaclesKit.BondingRequest.toBindingRequest(): BindingProcessor.Request =
        when (this) {
            is SpectaclesKit.BondingRequest.SingleLensByLensId -> BindingProcessor.Request.Bind(
                clientId = clientIdentifier.value,
                lensId = lensId,
                lensName = null
            )
            is SpectaclesKit.BondingRequest.SingleLensByLensName -> BindingProcessor.Request.Bind(
                clientId = clientIdentifier.value,
                lensId = "",
                lensName = lensName
            )
            is SpectaclesKit.BondingRequest.SingleLens -> BindingProcessor.Request.Bind(
                clientId = clientIdentifier.value,
                lensId = lensId,
                lensName = null
            )
        }

    private fun BindingProcessor.Response.Bind.Success.toBonding(
        request: SpectaclesKit.BondingRequest
    ): SpectaclesBonding {
        val bondingId = MessageDigest.getInstance("SHA-1").run {
            update(id.toByteArray(Charsets.UTF_8))
            update(bleAddress.toByteArray(Charsets.UTF_8))
            Base64.getEncoder().encodeToString(digest())
        }
        return SpectaclesBonding(
            id = bondingId,
            identifier = BondingIdentifier(id, bleAddress, deviceId),
            requested = request,
        )
    }
}

private class DefaultSpectaclesKitBuilder(
    private val context: Context,
) : SpectaclesKit.Builder {

    private lateinit var identifier: SpectaclesKit.ClientIdentifier
    private lateinit var version: String
    private lateinit var executor: Executor

    override fun setIdentifier(identifier: SpectaclesKit.ClientIdentifier): SpectaclesKit.Builder {
        this.identifier = identifier
        return this
    }

    override fun setVersion(version: String): SpectaclesKit.Builder {
        this.version = version
        return this
    }

    override fun setRequestExecutor(executor: Executor): SpectaclesKit.Builder {
        this.executor = executor
        return this
    }

    override fun build(): SpectaclesKit {
        return DefaultSpectaclesKit(
            context = context,
            clientIdentifier = identifier,
            clientVersion = version,
            executor = executor,
            dependencies = DefaultKitDependencies(context),
        )
    }
}
