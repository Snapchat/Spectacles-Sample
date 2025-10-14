package com.snap.spectacles.kit

import android.net.Uri
import java.util.function.Consumer

sealed interface SpectaclesAssetRequest {

    /**
     * Responsible for providing the Lens with the SpectaclesAsset specified by the uri from the App.
     *
     * @param path The path of the requested SpectaclesAsset.
     * @param version Identify a unique evolution of the asset, if available. This can be either a
     * file checksum or a file timestamp, as determined by the SDK or Lens developer. Pass null to
     * retrieve the most recent asset content.
     * @return The loaded SpectaclesAsset instance.
     */
    data class Load(
        val path: String,
        val version: String?,
        override val onResponse: Consumer<SpectaclesAsset>,
        override val onError: Consumer<SpectaclesRequestException>,
    ) : SpectaclesAssetRequest, SpectaclesRequest.WithResponse<SpectaclesAsset>()
}
