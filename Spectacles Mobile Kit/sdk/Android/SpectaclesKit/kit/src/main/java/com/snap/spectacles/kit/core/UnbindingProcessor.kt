package com.snap.spectacles.kit.core

import java.io.Closeable
import java.util.function.Consumer

interface UnbindingProcessor {

    sealed class Request {

        data class Unbind(
            val id: String,
            val deviceId: String
        ) : Request()
    }

    sealed class Response {

        sealed class Unbind : Response() {

            data object Success : Unbind()

            data class Failure(
                val error: Exception,
            ) : Unbind()
        }
    }

    fun unbind(
        request: Request,
        onResponse: Consumer<Response>,
    ): Closeable
}
