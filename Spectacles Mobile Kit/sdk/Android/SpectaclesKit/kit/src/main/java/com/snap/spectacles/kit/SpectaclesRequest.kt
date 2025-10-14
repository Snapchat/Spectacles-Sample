package com.snap.spectacles.kit

import java.util.function.Consumer

/**
 * Represents a base class for different types of service requests
 */
sealed interface SpectaclesRequest {

    /**
     * Describes a generic response of the [SpectaclesRequest].
     * A full response may consist of a series of [Ongoing] instances and a single [Completed] instance.
     * If the result data is small, only a Completed object may be needed to complete the interaction.
     */
    sealed class Responses<Payload : Any> {

        abstract val payload: Payload

        data class Ongoing<Payload : Any>(
            override val payload: Payload
        ) : Responses<Payload>()

        data class Completed<Payload : Any>(
            override val payload: Payload
        ) : Responses<Payload>()
    }

    /**
     * Describes a service request that expects a response
     *
     * @param Payload The type of the payload expected in the response.
     * @property onResponse A consumer that handles the response of the request.
     * @property onError A consumer that handles errors that occur during the request.
     */
    abstract class WithResponse<Payload : Any> : SpectaclesRequest {

        abstract val onResponse: Consumer<Payload>

        abstract val onError: Consumer<SpectaclesRequestException>
    }

    abstract class WithResponses<Payload : Any> : SpectaclesRequest {

        abstract val onResponse: Consumer<Responses<Payload>>

        abstract val onError: Consumer<SpectaclesRequestException>
    }

    /**
     * Describes a service request that does not expect a response
     */
    abstract class WithoutResponse : SpectaclesRequest
}
