package com.snap.spectacles.kit.stream.smkp

import android.os.Build
import androidx.annotation.RequiresApi
import com.snap.spectacles.kit.stream.SpectaclesStreamConnection
import com.snap.spectacles.kit.stream.SpectaclesStreamPayload
import com.snap.spectacles.kit.stream.utils.SpectaclesStreamBytesPayload
import java.util.concurrent.Executor

/**
 * Client class for initiating [SmkpMessage.CALL] requests.
 */
@RequiresApi(Build.VERSION_CODES.N)
class SmkpCallStreamClient(
    connection: SpectaclesStreamConnection,
    executor: Executor,
    onClose: () -> Unit,
    onResponse: OnResponse,
    unpack: (SpectaclesStreamPayload) -> SmkpMessage = SmkpMessage.Companion::unpack,
    pack: (SmkpMessage) -> SpectaclesStreamPayload = SmkpMessage::pack
) : SmkpBaseStreamClient(onResponse, onClose, connection, executor, unpack, pack) {

    var token: String? = null

    fun call(
        path: String,
        header: SmkpMessage.Header = SmkpMessage.Header(),
        body: ByteArray = byteArrayOf(),
        priority: Int = 0,
        last: Boolean = false
    ) {
        val request = SmkpMessage.Request(
            SmkpMessage.CALL,
            path,
            SmkpMessage.Header(header.toMutableList()).apply {
                token?.let {
                    add(SmkpBaseStreamServlet.HEADER_LENS_TOKEN, it)
                }
            },
            SpectaclesStreamBytesPayload(body)
        )
        send(request, priority, last)
    }
}
