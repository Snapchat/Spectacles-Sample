package com.snap.spectacles.kit.core

import java.io.Closeable
import java.util.function.Consumer

/**
 * Responsible for processing the SpectaclesKit.BondingRequest.
 */
interface BindingProcessor {

    sealed class Request {

        data class Bind(
            val clientId: String,
            val lensId: String,
            val lensName: String?
        ) : Request()
    }

    sealed class Response {

        sealed class Bind : Response() {

            data class Success(
                val id: String,
                val psm: Int,
                val bleAddress: String,
                val deviceId: String
            ) : Bind()

            data class Failure(
                val error: Exception,
            ) : Bind()
        }
    }

    fun bind(
        request: Request,
        onResponse: Consumer<Response>,
    ): Closeable
}
