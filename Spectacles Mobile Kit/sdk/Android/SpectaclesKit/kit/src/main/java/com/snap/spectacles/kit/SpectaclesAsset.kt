package com.snap.spectacles.kit

import java.io.InputStream

/**
 * Describes the types of Assets required by the Lens as supported by the SpectaclesKit.
 * Matches the specifications in the Spectacles design document, with an additional ZipAsset
 * for batch loading of SpectaclesAsset content from a zip file.
 */
sealed class SpectaclesAsset {

    /**
     * @param version Identify a unique evolution of the asset, if available, which is typically the
     * file's checksum or timestamp.
     */
    data class Content(
        val version: String?,
        val assetSize: Long,
        val dataStream: InputStream,
    ) : SpectaclesAsset()

    /**
     * Represents the case where the asset is already up-to-date and does not need to be reloaded.
     */
    data object UpToDate : SpectaclesAsset()
}
