package com.snap.spectacles.kit.core

import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import com.snap.spectacles.kit.ClientException
import java.io.Closeable
import java.util.concurrent.atomic.AtomicReference
import java.util.function.Consumer

internal const val SPECTACLES_KIT_EXTRA_ACTION = "SpecsAction"
internal const val SPECTACLES_KIT_EXTRA_PACKAGE = "SpecsPackage"

private val SPECTACLES_APP_VARIANTS = arrayOf(
    "com.snap.spectacles.app",
    "com.snap.spectacles.app.alpha",
    "com.snap.spectacles.app.beta",
    "com.snap.spectacles.app.master",
    "com.snap.spectacles.app.dev",
)

private const val SPECTACLES_APP_MIN_VERSION_CODE = 5638L // 0.58.0.85 MASTER (5638)

internal class SpectaclesKitRequester(
    private val context: Context,
) {

    private val onResult = AtomicReference<Pair<Consumer<Intent>, Consumer<ClientException>>?>()

    fun request(
        request: Intent,
        onSuccess: Consumer<Intent>,
        onFailed: Consumer<ClientException>
    ): Closeable {
        val consumer = onSuccess to onFailed
        onResult.set(consumer)

        val resultObserver = object: ActivityDependencies.ActivityResultObserver {

            override fun onSuccess(intent: Intent?) {
                if (onResult.compareAndSet(consumer, null)) {
                    onSuccess.accept(intent!!)
                }
            }

            override fun onFailure(intent: Intent?) {
                if (onResult.compareAndSet(consumer, null)) {
                    val message = intent?.getStringExtra("message") ?: "User cancelled"
                    onFailed.accept(ClientException(message))
                }
            }
        }

        try {
            ActivityDependencies.install(resultObserver)
            selectPackage { packageName ->
                request.putExtra(SPECTACLES_KIT_EXTRA_PACKAGE, packageName)
                context.startActivity(request)
            }
        } catch (e: Exception) {
            if (onResult.compareAndSet(consumer, null)) {
                if (e is ClientException) {
                    onFailed.accept(e)
                } else {
                    onFailed.accept(ClientException(e.message ?: "", e))
                }
            }
        }

        return Closeable { onResult.set(null) }
    }

    private fun selectPackage(onPackage: (String) -> Unit) {
        SPECTACLES_APP_VARIANTS.map { variant -> variant to checkSpectaclesAppCompatibility(variant) }
            .minBy { (_, result) -> result }
            .let { (variant, result) ->
                if (result == CompatibilityResult.OK) {
                    onPackage(variant)
                } else {
                    throw result.toClientException()!!
                }
            }
    }

    private fun checkSpectaclesAppCompatibility(packageName: String): CompatibilityResult {
        val (packageInfo, appInfo) = try {
            context.packageManager.getPackageInfo(packageName, 0) to
                    context.packageManager.getApplicationInfo(packageName, 0)
        } catch (e: PackageManager.NameNotFoundException) {
            return CompatibilityResult.APP_NOT_INSTALLED
        }

        val isVersionSupported = packageInfo.longVersionCode >= SPECTACLES_APP_MIN_VERSION_CODE
        return when {
            !isVersionSupported -> CompatibilityResult.APP_UPDATE_REQUIRED
            !appInfo.enabled -> CompatibilityResult.APP_DISABLED
            else -> CompatibilityResult.OK
        }
    }
}

private enum class CompatibilityResult {

    OK,
    APP_DISABLED,
    APP_UPDATE_REQUIRED,
    APP_NOT_INSTALLED,
    ;

    fun toClientException(): ClientException? = when (this) {
        APP_DISABLED -> ClientException.SpectaclesAppNotEnabled("")
        APP_UPDATE_REQUIRED -> ClientException.SpectaclesAppUpdateRequired("")
        APP_NOT_INSTALLED -> ClientException.SpectaclesAppNotInstalled("")
        else -> null
    }
}
