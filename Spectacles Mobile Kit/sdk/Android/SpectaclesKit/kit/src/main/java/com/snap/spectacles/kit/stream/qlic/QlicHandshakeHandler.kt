package com.snap.spectacles.kit.stream.qlic

import com.snap.spectacles.kit.stream.SpectaclesStreamException
import com.snap.spectacles.kit.stream.security.AuthenticationManager
import com.snap.spectacles.kit.stream.security.EncryptionManager
import com.snap.spectacles.kit.stream.security.KeyExchangeManager
import com.snap.spectacles.kit.stream.security.TranscriptHashManager
import com.snap.spectacles.kit.util.Log
import java.io.ByteArrayOutputStream
import java.io.Closeable
import java.io.OutputStream
import java.security.SecureRandom
import kotlin.reflect.KClass

private const val TAG = "QlicHandshakeHandler"

/**
 * Handles the QLIC handshake process for secure authentication and key exchange.
 */
internal class QlicHandshakeHandler(
    private val authenticationManager: AuthenticationManager,
    private val keyExchangeManager: KeyExchangeManager,
    private val encryptionManager: EncryptionManager,
    private val transcriptHashManager: TranscriptHashManager,
    private val secureRandom: SecureRandom,
    private val sender: QlicFrameSender,
    private val onCompleted: () -> Unit,
    private val isClient: Boolean,
    private val unpack: (QlicFrame.Crypto) -> QlicHandshake? = QlicHandshakeAssembler()::assembleHandshake,
    private val pack: (QlicHandshake, OutputStream) -> Unit = QlicHandshake::serialize
) : QlicFrameHandler, Closeable {

    object Factory {
        fun create(
            authenticationManager: AuthenticationManager,
            keyExchangeManager: KeyExchangeManager,
            encryptionManager: EncryptionManager,
            transcriptHashManager: TranscriptHashManager,
            secureRandom: SecureRandom,
            sender: QlicFrameSender,
            onCompleted: () -> Unit,
            isClient: Boolean,
        ) = QlicHandshakeHandler(
            authenticationManager,
            keyExchangeManager,
            encryptionManager,
            transcriptHashManager,
            secureRandom,
            sender,
            onCompleted,
            isClient
        )
    }

    companion object {
        private const val HELLO_NONCE_LENGTH = 32
        private const val CLIENT_SIGNATURE_CONTEXT = "QLIC, client CertificateVerify"
        private const val SERVER_SIGNATURE_CONTEXT = "QLIC, server CertificateVerify"
    }

    private val log = Log.get(TAG)

    @Volatile
    private var isClosed = false

    // Tracks the expected next message type in the handshake sequence.
    private var expectedNextMessage: Class<out QlicHandshake>? = null

    // Cached ServerAuth request (for client side only).
    private lateinit var authRequest: QlicHandshake.AuthRequest

    // Cached ClientAuthAlgorithms (for client side only).
    private val clientAuthAlgorithms = mutableListOf<QlicHandshake.AuthAlgorithm>()

    // Cached ServerAuthAlgorithms (for client side only).
    private val serverAuthAlgorithms = mutableListOf<QlicHandshake.AuthAlgorithm>()

    /**
     * Initiates the handshake process.
     */
    fun start() {
        log.debug { "execute(), isClient = $isClient, isClose = $isClosed" }

        if (isClient) {
            clientHello()
        } else {
            serverHello()
        }
    }

    /**
     * Closes the handler, signaling termination of the authentication process.
     * If waiting for a response, it releases the latch to allow any awaiting threads to proceed.
     */
    override fun close() {
        log.debug { "close(), when isClose = $isClosed" }

        isClosed = true
    }

    /**
     * Handles incoming [QlicFrame] and processes them if they are related to the authentication handshake.
     *
     * @param frame The received QlicFrame.
     * @return True if the frame was processed; false otherwise.
     */
    override fun handle(frame: QlicFrame): Boolean {
        if (isClosed || frame !is QlicFrame.Crypto) {
            return false
        }

        transcriptHashManager.add(frame.data)

        val message = unpack(frame) ?: return true
        if (expectedNextMessage?.isInstance(message) != true) {
            log.debug { "Unexpected QlicHandshake($message), expecting: $expectedNextMessage" }
            return true
        }

        when (message) {
            is QlicHandshake.ClientHello ->
                onClientHello(message)
            is QlicHandshake.ServerHello ->
                onServerHello(message)
            is QlicHandshake.AuthRequest ->
                onServerAuthRequest(message)
            is QlicHandshake.AuthShare ->
                if (isClient) onServerAuthShare(message) else onClientAuthShare(message)
            is QlicHandshake.AuthVerify ->
                if (isClient) onServerAuthVerify(message) else onClientAuthVerify(message)
        }
        return true
    }

    /**
     * Initiates client-side handshake with a [ClientHello] message.
     */
    private fun clientHello() {
        log.debug { "clientHello(), isClient = $isClient" }

        expectedNextMessage = QlicHandshake.ServerHello::class.java

        val clientSessionKey = keyExchangeManager.initiateKeyExchange()
        val clientNonce = ByteArray(HELLO_NONCE_LENGTH).apply {
            secureRandom.nextBytes(this)
        }

        clientAuthAlgorithms.clear()
        val clientIdentityKey = authenticationManager.getLocalIdentity()
        if (clientIdentityKey.isNotEmpty()) {
            clientAuthAlgorithms.add(QlicHandshake.AuthAlgorithm.PreTrusted(clientIdentityKey))
        }
        clientAuthAlgorithms.add(authenticationManager.getSupportedLocalAttestationAlgorithms())
        if (clientAuthAlgorithms.isEmpty()) {
            throw SpectaclesStreamException(SpectaclesStreamException.UNAUTHORIZED, "No client algorithm")
        }

        serverAuthAlgorithms.clear()
        val serverIdentityKey = authenticationManager.getRemoteIdentity()
        if (serverIdentityKey.isNotEmpty()) {
            serverAuthAlgorithms.add(QlicHandshake.AuthAlgorithm.PreTrusted(serverIdentityKey))
        }
        serverAuthAlgorithms.add(authenticationManager.getSupportedRemoteAttestationAlgorithms())
        if (serverAuthAlgorithms.isEmpty()) {
            throw SpectaclesStreamException(SpectaclesStreamException.UNAUTHORIZED, "No server algorithm")
        }

        val clientHello = QlicHandshake.ClientHello(
            clientNonce, clientSessionKey, clientAuthAlgorithms, serverAuthAlgorithms
        )
        send(clientHello, null)
    }

    /**
     * Processes a [ServerHello] message, validating the server's identity.
     *
     * @param serverHello The received [ServerHello] message.
     */
    private fun onServerHello(serverHello: QlicHandshake.ServerHello) {
        log.debug { "onServerHello(), isClient = $isClient" }

        expectedNextMessage = QlicHandshake.AuthRequest::class.java
        transcriptHashManager.update()

        keyExchangeManager.completeKeyExchange(serverHello.serverSessionKey)
        encryptionManager.setSecret(keyExchangeManager.getSharedSecret(), transcriptHashManager.hash())
    }

    /**
     * Processes a received [QlicHandshake.AuthRequest] message on the client side.
     *
     * @param authRequest The received [QlicHandshake.AuthRequest] message.
     */
    private fun onServerAuthRequest(authRequest: QlicHandshake.AuthRequest) {
        log.debug { "onServerAuthRequest(), isClient = $isClient" }
        log.debug { "chosenClientAlgorithm = ${authRequest.chosenClientAlgorithm}" }
        log.debug { "chosenServerAlgorithm = ${authRequest.chosenServerAlgorithm}" }

        if (authRequest.chosenClientAlgorithm !in (1..clientAuthAlgorithms.size)) {
            throw SpectaclesStreamException(SpectaclesStreamException.UNAUTHORIZED, "Bad client algorithm")
        }

        if (authRequest.chosenServerAlgorithm !in (1..serverAuthAlgorithms.size)) {
            throw SpectaclesStreamException(SpectaclesStreamException.UNAUTHORIZED, "Bad server algorithm")
        }

        expectedNextMessage = QlicHandshake.AuthShare::class.java
        this.authRequest = authRequest
        transcriptHashManager.update()
    }

    /**
     * Processes a received [QlicHandshake.AuthShare] message on the client side.
     *
     * @param serverShare The received [QlicHandshake.AuthShare] message.
     */
    private fun onServerAuthShare(serverShare: QlicHandshake.AuthShare) {
        log.debug { "onServerAuthShare(${serverShare.attestation.javaClass}), isClient = $isClient" }

        expectedNextMessage = QlicHandshake.AuthVerify::class.java

        validateRemoteAttestation(serverShare.attestation)
        transcriptHashManager.update()
    }

    /**
     * Processes a received [QlicHandshake.AuthVerify] message on the client side.
     *
     * @param serverVerify The received [QlicHandshake.AuthVerify] message.
     */
    private fun onServerAuthVerify(serverVerify: QlicHandshake.AuthVerify) {
        log.debug { "onServerAuthVerify(), isClient = $isClient" }

        expectedNextMessage = null

        verifyAuthenticationSignature(serverVerify.signature, false)
        transcriptHashManager.update()

        val algorithm = clientAuthAlgorithms[authRequest.chosenClientAlgorithm - 1]
        log.debug { "chosenClientAlgorithm = $algorithm" }

        val attestation = if (algorithm is QlicHandshake.AuthAlgorithm.PreTrusted) {
            QlicHandshake.AuthAttestation.PreTrusted
        } else {
            generateLocalAttestation(algorithm)
        }
        val clientShare = QlicHandshake.AuthShare(attestation)
        send(clientShare, null)

        val signature = createAuthenticationSignature(true)
        val clientVerify = QlicHandshake.AuthVerify(signature)
        send(clientVerify) {
            encryptionManager.update(transcriptHashManager.hash())
            onCompleted.invoke()
        }
    }

    /**
     * Sets up the server to await [QlicHandshake.ClientHello] from the client.
     */
    private fun serverHello() {
        expectedNextMessage = QlicHandshake.ClientHello::class.java
    }

    /**
     * Processes [QlicHandshake.ClientHello], initiating key exchange and sending [QlicHandshake.ServerHello].
     *
     * @param clientHello The received [QlicHandshake.ClientHello] message.
     */
    private fun onClientHello(clientHello: QlicHandshake.ClientHello) {
        log.debug { "onClientHello(), isClient = $isClient" }

        expectedNextMessage = null

        val serverSessionKey = keyExchangeManager.initiateKeyExchange()
        keyExchangeManager.completeKeyExchange(clientHello.clientSessionKey)
        val serverNonce = ByteArray(HELLO_NONCE_LENGTH).apply {
            secureRandom.nextBytes(this)
        }

        val serverHello = QlicHandshake.ServerHello(serverNonce, serverSessionKey)
        send(serverHello) {
            encryptionManager.setSecret(keyExchangeManager.getSharedSecret(), transcriptHashManager.hash())
            onContinueClientHello(clientHello)
        }
    }

    /**
     * Processes the subsequent steps after responding to [QlicHandshake.ClientHello].
     */
    private fun onContinueClientHello(clientHello: QlicHandshake.ClientHello) {
        log.debug { "onContinueClientHello(), isClient = $isClient" }

        expectedNextMessage = QlicHandshake.AuthShare::class.java

        val preTrustedClientAlgorithm = clientHello.clientAuthAlgorithms.indexOfFirst {
            it is QlicHandshake.AuthAlgorithm.PreTrusted &&
                identitiesMatch(it.publicKey, authenticationManager.getRemoteIdentity())
        } + 1
        val chosenClientAlgorithm = preTrustedClientAlgorithm.takeIf { it > 0 }
            ?: (
                clientHello.clientAuthAlgorithms.indexOfFirst(
                    authenticationManager.getSupportedRemoteAttestationAlgorithms()
                ) + 1
                )
        log.debug { "chosenClientAlgorithm = $chosenClientAlgorithm/${clientHello.clientAuthAlgorithms.size}" }

        val preTrustedServerAlgorithm = clientHello.serverAuthAlgorithms.indexOfFirst {
            it is QlicHandshake.AuthAlgorithm.PreTrusted &&
                identitiesMatch(it.publicKey, authenticationManager.getLocalIdentity())
        } + 1
        val chosenServerAlgorithm = preTrustedServerAlgorithm.takeIf { it > 0 }
            ?: (
                clientHello.serverAuthAlgorithms.indexOfFirst(
                    authenticationManager.getSupportedLocalAttestationAlgorithms()
                ) + 1
                )
        log.debug { "chosenServerAlgorithm = $chosenServerAlgorithm/${clientHello.serverAuthAlgorithms.size}" }

        val authRequest = QlicHandshake.AuthRequest(chosenClientAlgorithm, chosenServerAlgorithm)
        if (0 == chosenClientAlgorithm || 0 == chosenServerAlgorithm) {
            send(authRequest) {
                throw SpectaclesStreamException(SpectaclesStreamException.UNAUTHORIZED, "Bad algorithm")
            }
        } else {
            send(authRequest, null)

            val attestation = if (0 != preTrustedServerAlgorithm) {
                QlicHandshake.AuthAttestation.PreTrusted
            } else {
                generateLocalAttestation(clientHello.serverAuthAlgorithms[chosenServerAlgorithm - 1])
            }
            val serverShare = QlicHandshake.AuthShare(attestation)
            send(serverShare, null)

            val signature = createAuthenticationSignature(false)
            val serverVerify = QlicHandshake.AuthVerify(signature)
            send(serverVerify, null)
        }
    }

    /**
     * Processes [QlicHandshake.AuthShare] to verify client identity and complete handshake.
     *
     * @param clientShare The received [QlicHandshake.AuthShare] message.
     */
    private fun onClientAuthShare(clientShare: QlicHandshake.AuthShare) {
        log.debug { "onClientAuthShare(${clientShare.attestation.javaClass}), isClient = $isClient" }

        expectedNextMessage = QlicHandshake.AuthVerify::class.java

        validateRemoteAttestation(clientShare.attestation)
        transcriptHashManager.update()
    }

    /**
     * Processes a received [QlicHandshake.AuthVerify] message on the server side.
     *
     * @param clientVerify The received [QlicHandshake.AuthVerify] message.
     */
    private fun onClientAuthVerify(clientVerify: QlicHandshake.AuthVerify) {
        log.debug { "onClientAuthVerify(), isClient = $isClient" }

        expectedNextMessage = null

        verifyAuthenticationSignature(clientVerify.signature, true)
        transcriptHashManager.update()
        encryptionManager.update(transcriptHashManager.hash())

        onCompleted.invoke()
    }

    /**
     * Sends a handshake message.
     *
     * @param message The message to send.
     * @param onSent Optional callback to invoke after sending.
     */
    private fun send(message: QlicHandshake, onSent: (() -> Unit)?) {
        val data = ByteArrayOutputStream().use { output ->
            pack(message, output)
            output.toByteArray()
        }
        transcriptHashManager.add(data)
        transcriptHashManager.update()
        sender.send(QlicPendingFrame.Crypto(data), onSent)
    }

    private fun generateLocalAttestation(algorithm: QlicHandshake.AuthAlgorithm): QlicHandshake.AuthAttestation {
        val attestation = authenticationManager.generateLocalIdentityAttestation(
            AuthenticationManager.Attestation.CertificateChain::class,
            transcriptHashManager.hash()
        )
        return if (QlicHandshake.AuthAlgorithm.AndroidSpecific == algorithm) {
            QlicHandshake.AuthAttestation.AndroidSpecific(attestation.chain)
        } else {
            QlicHandshake.AuthAttestation.CertificateChain(attestation.chain)
        }
    }

    private fun validateRemoteAttestation(attestation: QlicHandshake.AuthAttestation) {
        when (attestation) {
            is QlicHandshake.AuthAttestation.PreTrusted -> {
                if (authenticationManager.getRemoteIdentity().isEmpty()) {
                    throw SpectaclesStreamException(SpectaclesStreamException.UNAUTHORIZED, "Not pre-trusted")
                }
            }
            is QlicHandshake.AuthAttestation.IosSpecific -> {
                authenticationManager.validateRemoteIdentityAttestation(
                    transcriptHashManager.hash(),
                    AuthenticationManager.Attestation.IosSpecific(attestation.publicKey, attestation.attestation)
                )
            }
            is QlicHandshake.AuthAttestation.AndroidSpecific -> {
                authenticationManager.validateRemoteIdentityAttestation(
                    transcriptHashManager.hash(),
                    AuthenticationManager.Attestation.CertificateChain(attestation.chain)
                )
            }
            is QlicHandshake.AuthAttestation.CertificateChain -> {
                authenticationManager.validateRemoteIdentityAttestation(
                    transcriptHashManager.hash(),
                    AuthenticationManager.Attestation.CertificateChain(attestation.chain)
                )
            }
        }
    }

    /**
     * Creates a signature, signed with the local private key.
     */
    private fun createAuthenticationSignature(clientRole: Boolean): ByteArray {
        return authenticationManager.signWithLocalIdentity(
            getAuthenticationContext(clientRole)
        )
    }

    /**
     * Verifies the signature received from the remote peer.
     */
    private fun verifyAuthenticationSignature(signature: ByteArray, clientRole: Boolean) {
        val passed = authenticationManager.verifyWithRemoteIdentity(
            getAuthenticationContext(clientRole), signature
        )
        if (!passed) {
            throw SpectaclesStreamException(SpectaclesStreamException.UNAUTHORIZED, "Bad signature")
        }
    }

    /**
     * Returns the appropriate context for verification or signing.
     */
    private fun getAuthenticationContext(clientRole: Boolean): ByteArray {
        return ByteArrayOutputStream().use { output ->
            val context = if (clientRole) CLIENT_SIGNATURE_CONTEXT else SERVER_SIGNATURE_CONTEXT
            output.write(ByteArray(64) { 0x20 })
            output.write(context.toByteArray(Charsets.UTF_8))
            output.write(0)
            output.write(transcriptHashManager.hash())
            output.toByteArray()
        }
    }

    /**
     * Compares two identity byte arrays to determine if they match.
     */
    private fun identitiesMatch(identity1: ByteArray, identity2: ByteArray): Boolean {
        return identity1.isNotEmpty() && identity1.contentEquals(identity2)
    }

    private fun MutableList<QlicHandshake.AuthAlgorithm>.add(
        algorithms: Collection<KClass<out AuthenticationManager.Attestation>>
    ) {
        algorithms.forEach {
            when (it) {
                AuthenticationManager.Attestation.CertificateChain::class -> {
                    add(QlicHandshake.AuthAlgorithm.AndroidSpecific)
                    add(QlicHandshake.AuthAlgorithm.CertificateChain)
                }
                AuthenticationManager.Attestation.IosSpecific::class -> {
                    add(QlicHandshake.AuthAlgorithm.IosSpecific)
                }
            }
        }
    }
    private fun List<QlicHandshake.AuthAlgorithm>.indexOfFirst(
        algorithms: Collection<KClass<out AuthenticationManager.Attestation>>
    ): Int {
        return indexOfFirst { algorithm ->
            null != algorithms.find { supported ->
                when (supported) {
                    AuthenticationManager.Attestation.CertificateChain::class ->
                        QlicHandshake.AuthAlgorithm.AndroidSpecific == algorithm ||
                            QlicHandshake.AuthAlgorithm.CertificateChain == algorithm
                    AuthenticationManager.Attestation.IosSpecific::class ->
                        QlicHandshake.AuthAlgorithm.IosSpecific == algorithm
                    else -> false
                }
            }
        }
    }
}
