package com.snap.spectacles.kit.sample

import android.content.Context
import com.snap.spectacles.kit.SpectaclesApiRequest
import com.snap.spectacles.kit.SpectaclesAsset
import com.snap.spectacles.kit.SpectaclesAssetRequest
import com.snap.spectacles.kit.SpectaclesRequest
import com.snap.spectacles.kit.SpectaclesRequestDelegate
import com.snap.spectacles.kit.SpectaclesRequestException
import com.snap.spectacles.kit.util.Log

private const val TAG = "DemoRequestDelegate"
private const val SAMPLE_VERSION_INFO = "sample-version-info"

class DemoRequestDelegate(
    private val context: Context,
    private val show: (String) -> Unit,
): SpectaclesRequestDelegate {

    private val log = Log.get(TAG)

    override fun processServiceRequest(request: SpectaclesRequest) {
        show(request.brief())
        when (request) {
            is SpectaclesApiRequest.Call -> {
                val body = request.payload.params.toString(Charsets.UTF_8)
                request.onResponse.accept(
                    SpectaclesRequest.Responses.Ongoing(
                        "response for: $body".toByteArray()
                    )
                )
            }
            is SpectaclesAssetRequest.Load -> onLoadAsset(request)
            else -> {}
        }
    }

    private fun onLoadAsset(request: SpectaclesAssetRequest.Load) {
        log.debug { "LOAD \"${request.path}\"" }
        val fileName = request.path.lastIndexOf( '/' )
            .let { index ->
                if (index < 0)  {
                    request.path
                } else {
                    request.path.substring(index + 1)
                }
            }

        if (fileName.isBlank() || fileName.isEmpty()) {
            log.debug { "LOAD empty file name" }
            request.onError.accept(SpectaclesRequestException.BadRequest)
            return
        }

        log.debug { "LOAD \"$fileName\"" }
        if (request.version == SAMPLE_VERSION_INFO) {
            request.onResponse.accept(SpectaclesAsset.UpToDate)
        } else {
            try {
                val stream = context.resources.assets.open(fileName)
                request.onResponse.accept(
                    SpectaclesAsset.Content(
                        version = SAMPLE_VERSION_INFO,
                        assetSize = stream.available().toLong(),
                        dataStream = stream,
                    )
                )
            } catch (e: Exception) {
                request.onError.accept(SpectaclesRequestException.NotFound)
            }
        }
    }
}

private fun SpectaclesRequest.brief(): String = when (this) {
    is SpectaclesApiRequest.Call ->
        "Call(${payload.method}: [${payload.params.size}] ${payload.params.toString(Charsets.UTF_8)})"
    is SpectaclesApiRequest.Notify ->
        "Notify(${payload.method}: [${payload.params.size}] ${payload.params.toString(Charsets.UTF_8)})"
    is SpectaclesAssetRequest.Load -> "Asset.Load($path, $version)"
    else -> "Unknown"
}
