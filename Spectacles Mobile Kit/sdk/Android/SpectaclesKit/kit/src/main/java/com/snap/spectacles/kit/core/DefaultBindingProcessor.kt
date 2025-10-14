package com.snap.spectacles.kit.core

import android.content.Context
import android.content.Intent
import android.os.Bundle
import java.io.Closeable
import java.util.function.Consumer

private const val SPECTACLES_KIT_ACTION_BIND = "spectacles.intent.action.BIND"

private const val BIND_ARG_CLIENT_ID = "clientId"
private const val BIND_ARG_LENS_ID = "lensId"
private const val BIND_ARG_LENS_NAME = "lensName"
private const val BIND_ARG_APP_NAME = "appName"
private const val BIND_ARG_APP_ID = "appId"

private const val BIND_RESULT_STATUS = "status"
private const val BIND_RESULT_EXTRA_ID = "bondingId"
private const val BIND_RESULT_EXTRA_BLE_ADDRESS = "address"
private const val BIND_RESULT_EXTRA_DEVICE_ID = "deviceId"
private const val BIND_RESULT_EXTRA_PSM = "psm"

internal class DefaultBindingProcessor(
    private val context: Context,
) : BindingProcessor {

    override fun bind(
        request: BindingProcessor.Request,
        onResponse: Consumer<BindingProcessor.Response>
    ): Closeable {
        return SpectaclesKitRequester(context).request(
            request.toIntent(),
            { intent ->
                try {
                    val extras = intent.extras ?: throw IllegalArgumentException("Missing extras")
                    val result = parseBindSuccess(extras)
                    onResponse.accept(result)
                } catch (e: Exception) {
                    onResponse.accept(
                        BindingProcessor.Response.Bind.Failure(e)
                    )
                }
            },
            { error ->
                onResponse.accept(
                    BindingProcessor.Response.Bind.Failure(error)
                )
            }
        )
    }

    private fun BindingProcessor.Request.toIntent(): Intent =
        Intent(context, SpectaclesKitActivity::class.java).apply {
            when (this@toIntent) {
                is BindingProcessor.Request.Bind -> {
                    putExtra(SPECTACLES_KIT_EXTRA_ACTION, SPECTACLES_KIT_ACTION_BIND)
                    putExtra(BIND_ARG_CLIENT_ID, clientId)
                    putExtra(BIND_ARG_LENS_ID, lensId)
                    putExtra(BIND_ARG_LENS_NAME, lensName)
                    putExtra(BIND_ARG_APP_NAME, appName())
                    putExtra(BIND_ARG_APP_ID, context.applicationInfo.packageName)
                }
            }
        }

    private fun appName(): String = context.run {
        applicationInfo.loadLabel(packageManager).toString()
    }

    private fun parseBindSuccess(bundle: Bundle): BindingProcessor.Response.Bind {
        val status = bundle.getInt(BIND_RESULT_STATUS)
        if (status != 0) throw IllegalArgumentException("Failed ($status)")

        val id = bundle.getString(BIND_RESULT_EXTRA_ID)
            ?: throw IllegalArgumentException("Missing ID")
        val bleAddress = bundle.getString(BIND_RESULT_EXTRA_BLE_ADDRESS)
            ?: throw IllegalArgumentException("Missing BLE address")
        val deviceId = bundle.getString(BIND_RESULT_EXTRA_DEVICE_ID)
            ?: throw IllegalArgumentException("Missing device id")
        val psm = bundle.getInt(BIND_RESULT_EXTRA_PSM)
        return BindingProcessor.Response.Bind.Success(
            id = id,
            psm = psm,
            bleAddress = bleAddress,
            deviceId = deviceId
        )
    }
}
