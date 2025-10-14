package com.snap.spectacles.kit

import java.util.function.Consumer

/**
 * Responsible for RPC calls (two-way) within the current session.
 */
sealed interface SpectaclesApiRequest {

    data class Payload(
        val method: String,
        val params: ByteArray,
    )

    /**
     * Responds to a remote RPC call. The specification is provided by the Call.
     *
     * @param payload The RPC call details.
     */
    data class Call(
        val payload: Payload,
        override val onResponse: Consumer<SpectaclesRequest.Responses<ByteArray>>,
        override val onError: Consumer<SpectaclesRequestException>,
    ) : SpectaclesApiRequest, SpectaclesRequest.WithResponses<ByteArray>()

    data class Notify(
        val payload: Payload,
    ) : SpectaclesApiRequest, SpectaclesRequest.WithoutResponse()
}
