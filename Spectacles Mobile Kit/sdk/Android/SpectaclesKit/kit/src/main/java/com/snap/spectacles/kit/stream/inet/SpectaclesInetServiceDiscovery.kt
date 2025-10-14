package com.snap.spectacles.kit.stream.inet

import android.content.Context
import android.net.nsd.NsdManager
import android.net.nsd.NsdServiceInfo
import android.os.Build
import androidx.annotation.RequiresApi
import com.snap.spectacles.kit.stream.SpectaclesStreamAddress
import com.snap.spectacles.kit.stream.SpectaclesStreamDiscovery
import com.snap.spectacles.kit.util.Log
import java.net.InetSocketAddress
import java.util.LinkedList

private const val TAG = "SpectaclesInetServiceDiscovery"

/**
 * A scanner class for discovering services via NSD.
 */
@RequiresApi(Build.VERSION_CODES.O)
class SpectaclesInetServiceDiscovery(
    private val context: Context,
    private val identity: ByteArray,
    private val onFound: (SpectaclesStreamAddress) -> Unit,
    private val onFailed: (Int) -> Unit
) : SpectaclesStreamDiscovery {

    object Factory : SpectaclesStreamDiscovery.Factory {
        override fun create(
            context: Context,
            identity: ByteArray,
            onFound: (SpectaclesStreamAddress) -> Unit,
            onFailed: (Int) -> Unit
        ) = SpectaclesInetServiceDiscovery(context, identity, onFound, onFailed)
    }

    /**
     * The NSD discovery listener implementation.
     */
    private inner class DiscoveryListener : NsdManager.DiscoveryListener {

        override fun onDiscoveryStarted(serviceType: String) {
            log.debug { "onDiscoveryStarted($serviceType)" }
        }

        override fun onStartDiscoveryFailed(serviceType: String, errorCode: Int) {
            log.debug { "onStartDiscoveryFailed($serviceType, $errorCode)" }

            onDiscoveryFailed(this, errorCode)
        }

        override fun onDiscoveryStopped(serviceType: String) {
            log.debug { "onDiscoveryStopped($serviceType)" }
        }

        override fun onStopDiscoveryFailed(serviceType: String, errorCode: Int) {
            log.debug { "onStopDiscoveryFailed($serviceType, $errorCode)" }
        }

        override fun onServiceFound(serviceInfo: NsdServiceInfo) {
            log.debug { "onServiceFound($serviceInfo)" }

            onServiceFound(this, serviceInfo)
        }

        override fun onServiceLost(serviceInfo: NsdServiceInfo) {
            log.debug { "onServiceLost($serviceInfo)" }
        }
    }

    /**
     * The NSD resolve listener implementation.
     */
    private inner class ResolveListener : NsdManager.ResolveListener {

        override fun onServiceResolved(serviceInfo: NsdServiceInfo) {
            log.debug { "onServiceResolved($serviceInfo)" }

            onServiceResolved(this, serviceInfo)
        }

        override fun onResolveFailed(serviceInfo: NsdServiceInfo, errorCode: Int) {
            log.debug { "onResolveFailed($serviceInfo, $errorCode)" }

            onResolveFailed(this, errorCode)
        }
    }

    private val log = Log.get(TAG)

    private var currentDiscovery: NsdManager.DiscoveryListener? = null

    private val resolveListeners = LinkedList<NsdManager.ResolveListener>()

    override fun start() {
        log.debug { "start(), currentDiscovery = $currentDiscovery" }

        val nsdManager = context.getSystemService(NsdManager::class.java)
        synchronized(lock = this) {
            if (currentDiscovery != null) {
                return@synchronized
            }

            currentDiscovery = DiscoveryListener().apply {
                nsdManager.discoverServices(SpectaclesInetService.SERVICE_TYPE, NsdManager.PROTOCOL_DNS_SD, this)
            }
        }
    }

    /**
     * Stops the service scanning operation.
     */
    override fun stop() {
        log.debug { "stop(), currentDiscovery = $currentDiscovery" }

        val nsdManager = context.getSystemService(NsdManager::class.java)
        val resolvers = synchronized(lock = this) {
            currentDiscovery?.apply {
                nsdManager.stopServiceDiscovery(this)
            }
            currentDiscovery = null

            resolveListeners.toTypedArray().also {
                resolveListeners.clear()
            }
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
            resolvers.forEach {
                try {
                    nsdManager.stopServiceResolution(it)
                } catch (_: Exception) {
                }
            }
        }
    }

    private fun onDiscoveryFailed(discoveryListener: DiscoveryListener, errorCode: Int) {
        synchronized(lock = this) {
            if (discoveryListener != currentDiscovery) {
                return
            }
            currentDiscovery = null
        }
        onFailed.invoke(errorCode)
    }

    private fun onServiceFound(discoveryListener: DiscoveryListener, serviceInfo: NsdServiceInfo) {
        log.debug { "onServiceFound($discoveryListener, $serviceInfo), currentDiscovery = $currentDiscovery" }

        val nsdManager = context.getSystemService(NsdManager::class.java)
        synchronized(lock = this) {
            if (discoveryListener == currentDiscovery) {
                ResolveListener().apply {
                    resolveListeners.add(this)
                    nsdManager.resolveService(serviceInfo, this)
                }
            }
        }
    }

    private fun onServiceResolved(resolveListener: ResolveListener, serviceInfo: NsdServiceInfo) {
        log.debug { "onServiceResolved($resolveListener, $serviceInfo)" }

        val found = synchronized(lock = this) {
            resolveListeners.remove(resolveListener)
        }

        if (found && serviceNameCheck(serviceInfo) && serviceIdentityCheck(serviceInfo)) {
            val host = serviceInfo.host
            if (null != host) {
                val endpoint = SpectaclesInetServerEndpoint(InetSocketAddress(host, serviceInfo.port))
                onFound.invoke(endpoint)
            }
        }
    }

    private fun onResolveFailed(resolveListener: ResolveListener, errorCode: Int) {
        synchronized(lock = this) {
            resolveListeners.remove(resolveListener)
        }
    }

    private fun serviceNameCheck(serviceInfo: NsdServiceInfo): Boolean {
        return serviceInfo.serviceName.startsWith(SpectaclesInetService.SERVICE_NAME)
    }

    private fun serviceIdentityCheck(serviceInfo: NsdServiceInfo): Boolean {
        if (0 == identity.count { it.toInt() != 0 }) {
            return true
        }

        return serviceInfo.attributes[SpectaclesInetService.SERVICE_INFO_ID]?.let { value ->
            SpectaclesInetService.getServiceIdentity(serviceInfo.port, identity) == value.toString(Charsets.UTF_8)
        } ?: false
    }
}
