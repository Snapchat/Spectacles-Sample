package com.snap.spectacles.kit.core

import com.snap.spectacles.kit.SpectaclesKit
import org.json.JSONObject
import java.util.Base64

private const val BONDING_ID = "id"
private const val BONDING_IDENTIFIER = "identifier"
private const val BONDING_REQUESTED_LENS = "lens"

class DefaultSpectaclesBondingSerializer(
    private val identifierSerializer: () -> Serializer<BondingIdentifier, String> = {
        BondingIdentifierSerializer()
    },
    private val requestSerializer: () -> Serializer<SpectaclesKit.BondingRequest, String> = {
        BondingRequestSerializer()
    },
    private val jsonBuilder: (String?) -> JSONObject = { rawValue ->
        rawValue
            ?.let { value -> JSONObject(value) }
            ?: JSONObject()
    }
) : SpectaclesBondingSerializer {

    override fun serialize(source: SpectaclesBonding): String = jsonBuilder(null).run {
        try {
            put(BONDING_ID, source.id)
            put(BONDING_IDENTIFIER, identifierSerializer().serialize(source.identifier))
            put(BONDING_REQUESTED_LENS, requestSerializer().serialize(source.requested))
            toString()
        } catch (e: Exception) {
            throw IllegalArgumentException("Failed to serialize bonding: $source", e)
        }
    }

    override fun deserialize(serialized: String): SpectaclesBonding =
        try {
            jsonBuilder(serialized).run {
                val id = getString(BONDING_ID)
                val identifier = getString(BONDING_IDENTIFIER)
                val lens = getString(BONDING_REQUESTED_LENS)
                SpectaclesBonding(
                    id = id,
                    identifier = identifierSerializer().deserialize(identifier),
                    requested = requestSerializer().deserialize(lens),
                )
            }
        } catch (e: Exception) {
            throw IllegalArgumentException("Failed to deserialize bonding: $serialized", e)
        }
}

internal class BondingRequestSerializer(
    private val delimiter: String = "#",
) : Serializer<SpectaclesKit.BondingRequest, String> {

    override fun serialize(source: SpectaclesKit.BondingRequest): String {
        val (lensId, lensName) = when (source) {
            is SpectaclesKit.BondingRequest.SingleLensByLensId -> source.lensId to ""
            is SpectaclesKit.BondingRequest.SingleLensByLensName -> "" to source.lensName
            is SpectaclesKit.BondingRequest.SingleLens -> source.lensId to ""
        }
        return encode(
            if (lensName.isEmpty()) {
                lensId
            } else {
                "${lensId}${delimiter}${lensName}"
            }
        )
    }

    override fun deserialize(
        serialized: String
    ): SpectaclesKit.BondingRequest = decode(serialized).split(delimiter).let { parts ->
        if (parts.size > 3) {
            throw IllegalArgumentException("Failed to deserialize identifier: $serialized")
        }
        val lensId = parts[0]
        val lensName = if (parts.size > 1) parts[1] else ""
        if (lensName.isEmpty()) {
            SpectaclesKit.BondingRequest.SingleLensByLensId(lensId)
        } else {
            SpectaclesKit.BondingRequest.SingleLensByLensName(lensName)
        }
    }

    private fun encode(str: String): String =
        Base64.getEncoder().encodeToString(str.toByteArray())

    private fun decode(str: String): String =
        String(Base64.getDecoder().decode(str))
}

internal class BondingIdentifierSerializer(
    private val delimiter: String = "#",
) : Serializer<BondingIdentifier, String> {

    override fun serialize(source: BondingIdentifier): String =
        "${source.deviceAddress}${delimiter}${source.assignedId}${delimiter}${source.deviceId}"
            .let(::encode)

    override fun deserialize(
        serialized: String
    ): BondingIdentifier = decode(serialized).split(delimiter).let { parts ->
        if (parts.size != 3) {
            throw IllegalArgumentException("Failed to deserialize identifier: $serialized")
        }
        BondingIdentifier(parts[1], parts[0], parts[2])
    }

    private fun encode(str: String): String =
        Base64.getEncoder().encodeToString(str.toByteArray())

    private fun decode(str: String): String =
        String(Base64.getDecoder().decode(str))
}
