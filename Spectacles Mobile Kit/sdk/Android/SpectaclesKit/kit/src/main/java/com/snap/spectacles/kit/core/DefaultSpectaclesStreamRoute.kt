package com.snap.spectacles.kit.core

import com.snap.spectacles.kit.SpectaclesApiRequest
import com.snap.spectacles.kit.SpectaclesAsset
import com.snap.spectacles.kit.SpectaclesAssetRequest
import com.snap.spectacles.kit.SpectaclesRequest
import com.snap.spectacles.kit.SpectaclesRequestDelegate
import com.snap.spectacles.kit.SpectaclesRequestException
import com.snap.spectacles.kit.stream.SpectaclesStreamDataUnit
import com.snap.spectacles.kit.stream.SpectaclesStreamRoute
import com.snap.spectacles.kit.stream.SpectaclesStreamServlet
import com.snap.spectacles.kit.stream.SpectaclesStreamTrustManager
import com.snap.spectacles.kit.stream.smkp.SmkpAttestStreamServlet
import com.snap.spectacles.kit.stream.smkp.SmkpCallStreamServlet
import com.snap.spectacles.kit.stream.smkp.SmkpDownloadStreamServlet
import com.snap.spectacles.kit.stream.smkp.SmkpLensTokenManager
import com.snap.spectacles.kit.stream.smkp.SmkpMessage
import com.snap.spectacles.kit.stream.smkp.SmkpNotifyStreamServlet
import java.util.concurrent.Executor

class DefaultSpectaclesStreamRoute(
    private val delegate: SpectaclesRequestDelegate,
    private val trustManager: SpectaclesStreamTrustManager,
    private val executor: Executor,
    isLensAttestationRequired: Boolean = true
) : SpectaclesStreamRoute {

    private val lensTokenManager = SmkpLensTokenManager(
        if (!isLensAttestationRequired)
            SpectaclesStreamTrustManager.LensProvision("", "", "", "")
        else
            null
    )

    override fun route(request: SpectaclesStreamDataUnit): SpectaclesStreamServlet {
        val type = SmkpMessage.extractMessageType(request.payload)
        return when (type) {
            SmkpMessage.CALL ->
                SmkpCallStreamServlet(lensTokenManager, executor, ::processCallRequest)
            SmkpMessage.NOTIFY ->
                SmkpNotifyStreamServlet(lensTokenManager, executor, ::processNotifyRequest)
            SmkpMessage.DOWNLOAD ->
                SmkpDownloadStreamServlet(lensTokenManager, executor, ::processDownloadRequest)
            SmkpMessage.ATTEST ->
                SmkpAttestStreamServlet(trustManager, lensTokenManager, executor)
            else ->
                throw SpectaclesRequestException.BadRequest
        }
    }

    private fun processCallRequest(
        path: String,
        header: SmkpMessage.Header,
        body: ByteArray,
        priority: Int,
        last: Boolean,
        onSuccess: SmkpCallStreamServlet.Delegate.OnSuccess,
        onError: SmkpCallStreamServlet.Delegate.OnError
    ) {
        val request = SpectaclesApiRequest.Call(
            SpectaclesApiRequest.Payload(path, body),
            { onSuccess.invoke(0, it.payload, priority, it is SpectaclesRequest.Responses.Completed) },
            { onError.invoke(it) }
        )
        delegate.processServiceRequest(request)
    }

    private fun processNotifyRequest(
        path: String,
        header: SmkpMessage.Header,
        body: ByteArray,
        priority: Int,
        last: Boolean
    ) {
        val request = SpectaclesApiRequest.Notify(
            SpectaclesApiRequest.Payload(path, body)
        )
        delegate.processServiceRequest(request)
    }

    private fun processDownloadRequest(
        path: String,
        cachedVersion: String?,
        priority: Int,
        onSuccess: SmkpDownloadStreamServlet.Delegate.OnSuccess,
        onNotModified: SmkpDownloadStreamServlet.Delegate.OnNotModified,
        onError: SmkpDownloadStreamServlet.Delegate.OnError
    ) {
        val request = SpectaclesAssetRequest.Load(
            path,
            cachedVersion,
            { asset ->
                if (asset is SpectaclesAsset.Content) {
                    onSuccess.invoke(
                        SmkpDownloadStreamServlet.Content(asset.dataStream, asset.assetSize, asset.version),
                        priority
                    )
                } else {
                    onNotModified.invoke()
                }
            },
            { onError.invoke(it) }
        )
        delegate.processServiceRequest(request)
    }
}
