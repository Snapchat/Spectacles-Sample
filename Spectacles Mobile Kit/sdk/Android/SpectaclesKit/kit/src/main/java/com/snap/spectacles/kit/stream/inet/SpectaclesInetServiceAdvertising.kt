package com.snap.spectacles.kit.stream.inet

import android.content.Context
import android.net.nsd.NsdManager
import android.net.nsd.NsdServiceInfo
import android.os.Build
import androidx.annotation.RequiresApi
import com.snap.spectacles.kit.stream.SpectaclesStreamAddress
import com.snap.spectacles.kit.stream.SpectaclesStreamAdvertising
import com.snap.spectacles.kit.stream.utils.Worker
import com.snap.spectacles.kit.util.Log
import java.net.ServerSocket
import java.net.Socket

private const val TAG = "SpectaclesInetServiceAdvertising"

@RequiresApi(Build.VERSION_CODES.O)
class SpectaclesInetServiceAdvertising(
    private val context: Context,
    private val identity: ByteArray,
    private val onAccept: (SpectaclesStreamAddress) -> Unit,
    private val onFailed: (Int) -> Unit
) : SpectaclesStreamAdvertising {

    object Factory : SpectaclesStreamAdvertising.Factory {
        override fun create(
            context: Context,
            identity: ByteArray,
            onAccept: (SpectaclesStreamAddress) -> Unit,
            onFailed: (Int) -> Unit
        ) = SpectaclesInetServiceAdvertising(context, identity, onAccept, onFailed)
    }

    private inner class RegistrationListener : NsdManager.RegistrationListener {

        override fun onRegistrationFailed(serviceInfo: NsdServiceInfo?, errorCode: Int) {
            log.debug { "onRegistrationFailed($serviceInfo, $errorCode)" }

            onRegistrationFailed(this, errorCode)
        }

        override fun onUnregistrationFailed(serviceInfo: NsdServiceInfo?, errorCode: Int) {
            log.debug { "onUnregistrationFailed($serviceInfo, $errorCode)" }
        }

        override fun onServiceRegistered(serviceInfo: NsdServiceInfo?) {
            log.debug { "onServiceRegistered($serviceInfo)" }
        }

        override fun onServiceUnregistered(serviceInfo: NsdServiceInfo?) {
            log.debug { "onServiceUnregistered($serviceInfo)" }
        }
    }

    private val log = Log.get(TAG)

    private var currentRegistration: RegistrationListener? = null

    private var serverSocket: ServerSocket? = null

    override fun start() {
        log.debug { "start(), serverSocket = $serverSocket" }

        synchronized(lock = this) {
            if (null == serverSocket) {
                serverSocket = startService()
                registerService()
            }
        }
    }

    override fun pause() {
        log.debug { "pause(), serverSocket = $serverSocket, currentRegistration = $currentRegistration" }

        synchronized(lock = this) {
            if (null != serverSocket) {
                unregisterService()
            }
        }
    }

    override fun resume() {
        log.debug { "resume(), serverSocket = $serverSocket, currentRegistration = $currentRegistration" }

        synchronized(lock = this) {
            if (null != serverSocket) {
                registerService()
            }
        }
    }

    override fun stop() {
        log.debug { "stop(), serverSocket = $serverSocket, currentRegistration = $currentRegistration" }

        synchronized(lock = this) {
            if (null != serverSocket) {
                unregisterService()

                serverSocket!!.close()
                serverSocket = null
            }
        }
    }

    private fun onServiceConnected(server: ServerSocket, client: Socket) {
        val current = synchronized(lock = this) {
            server.takeIf { it == serverSocket }
        }

        if (null != current) {
            val endpoint = SpectaclesInetClientEndpoint(client)
            onAccept.invoke(endpoint)
        } else {
            client.close()
        }
    }

    private fun onServiceFailed(server: ServerSocket, errorCode: Int) {
        val current = synchronized(lock = this) {
            server.takeIf { it == serverSocket }
                ?.also {
                    unregisterService()
                    serverSocket!!.close()
                    serverSocket = null
                }
        }

        if (null != current) {
            onFailed.invoke(errorCode)
        }
    }

    private fun onRegistrationFailed(registration: RegistrationListener, errorCode: Int) {
        val current = synchronized(lock = this) {
            registration.takeIf { it == currentRegistration }
                ?.also {
                    unregisterService()
                    serverSocket!!.close()
                    serverSocket = null
                }
        }

        if (null != current) {
            onFailed.invoke(errorCode)
        }
    }

    private fun registerService() {
        if (null == currentRegistration) {
            val serviceInfo = NsdServiceInfo().apply {
                serviceName = SpectaclesInetService.SERVICE_NAME
                serviceType = SpectaclesInetService.SERVICE_TYPE
                port = serverSocket!!.localPort
                setAttribute(
                    SpectaclesInetService.SERVICE_INFO_ID,
                    SpectaclesInetService.getServiceIdentity(port, identity)
                )
            }
            currentRegistration = RegistrationListener().apply {
                context.getSystemService(NsdManager::class.java)
                    .registerService(serviceInfo, NsdManager.PROTOCOL_DNS_SD, this)
            }
        }
    }

    private fun unregisterService() {
        if (null != currentRegistration) {
            context.getSystemService(NsdManager::class.java)
                .unregisterService(currentRegistration)
            currentRegistration = null
        }
    }

    private fun startService(): ServerSocket {
        return ServerSocket(0).also { server ->
            val worker = Worker.create(TAG) {
                log.debug { "startService($server) start" }

                try {
                    while (true) {
                        val socket = server.accept()
                        onServiceConnected(server, socket)
                    }
                } catch (e: Exception) {
                    log.warn(e) { "startService($server) error" }

                    onServiceFailed(server, -1)
                }

                log.debug { "startService($server) end" }
            }
            worker.start()
        }
    }
}
