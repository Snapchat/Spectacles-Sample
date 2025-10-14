package com.snap.spectacles.kit.core

import android.content.Context
import android.content.Intent
import android.os.Bundle
import java.io.Closeable
import java.util.function.Consumer

private const val SPECTACLES_KIT_ACTION_UNBIND = "spectacles.intent.action.UNBIND"

private const val UNBIND_ARG_ID = "bondingId"
private const val UNBIND_ARG_DEVICE_ID = "deviceId"
private const val UNBIND_ARG_APP_ID = "appId"

private const val UNBIND_RESULT_STATUS = "status"

class DefaultUnbindingProcessor(
    private val context: Context,
) : UnbindingProcessor {

    override fun unbind(
        request: UnbindingProcessor.Request,
        onResponse: Consumer<UnbindingProcessor.Response>
    ): Closeable {
        return SpectaclesKitRequester(context).request(
            request.toIntent(),
            { intent ->
                try {
                    val extras = intent.extras ?: throw IllegalArgumentException("Missing extras")
                    val result = parseUnbindSuccess(extras)
                    onResponse.accept(result)
                } catch (e: Exception) {
                    onResponse.accept(
                        UnbindingProcessor.Response.Unbind.Failure(e)
                    )
                }
            },
            { error ->
                onResponse.accept(
                    UnbindingProcessor.Response.Unbind.Failure(error)
                )
            }
        )
    }

    private fun UnbindingProcessor.Request.toIntent(): Intent =
        Intent(context, SpectaclesKitActivity::class.java).apply {
            when (this@toIntent) {
                is UnbindingProcessor.Request.Unbind -> {
                    putExtra(SPECTACLES_KIT_EXTRA_ACTION, SPECTACLES_KIT_ACTION_UNBIND)
                    putExtra(UNBIND_ARG_ID, id)
                    putExtra(UNBIND_ARG_DEVICE_ID, deviceId)
                    putExtra(UNBIND_ARG_APP_ID, context.applicationInfo.packageName)
                }
            }
        }

    private fun parseUnbindSuccess(bundle: Bundle): UnbindingProcessor.Response.Unbind {
        val status = bundle.getInt(UNBIND_RESULT_STATUS)
        if (status != 0) throw IllegalArgumentException("Failed ($status)")
        return UnbindingProcessor.Response.Unbind.Success
    }
}
