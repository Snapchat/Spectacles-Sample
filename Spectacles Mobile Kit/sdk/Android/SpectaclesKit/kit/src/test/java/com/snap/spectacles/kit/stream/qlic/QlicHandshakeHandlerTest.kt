package com.snap.spectacles.kit.stream.qlic

import com.snap.spectacles.kit.KitBaseTest
import com.snap.spectacles.kit.stream.SpectaclesStreamException
import com.snap.spectacles.kit.stream.security.AuthenticationManager
import com.snap.spectacles.kit.stream.security.KeyExchangeManager
import com.snap.spectacles.kit.stream.security.TranscriptHashManager
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import org.junit.runners.JUnit4
import org.mockito.kotlin.any
import org.mockito.kotlin.argThat
import org.mockito.kotlin.clearInvocations
import org.mockito.kotlin.doAnswer
import org.mockito.kotlin.doReturn
import org.mockito.kotlin.eq
import org.mockito.kotlin.mock
import org.mockito.kotlin.never
import org.mockito.kotlin.verify
import org.mockito.kotlin.whenever
import java.io.OutputStream
import java.security.SecureRandom

@RunWith(JUnit4::class)
class QlicHandshakeHandlerTest : KitBaseTest() {

    private val authenticationManager = mock<AuthenticationManager> {
        on { getLocalIdentity() } doReturn byteArrayOf(1, 1)
        on { getRemoteIdentity() } doReturn byteArrayOf(2, 2)
        on { signWithLocalIdentity(any()) } doReturn byteArrayOf(0, 0)
        on { verifyWithRemoteIdentity(any(), any()) } doReturn true
        on {
            generateLocalIdentityAttestation<AuthenticationManager.Attestation.CertificateChain>(any(), any())
        } doReturn AuthenticationManager.Attestation.CertificateChain(mock())
        on {
            getSupportedLocalAttestationAlgorithms()
        } doReturn listOf(AuthenticationManager.Attestation.CertificateChain::class)
        on {
            getSupportedRemoteAttestationAlgorithms()
        } doReturn listOf(
            AuthenticationManager.Attestation.CertificateChain::class,
            AuthenticationManager.Attestation.IosSpecific::class,
            AuthenticationManager.Attestation::class
        )
    }

    private val keyExchangeManager = mock<KeyExchangeManager> {
        on { initiateKeyExchange() } doReturn byteArrayOf(1, 1)
        on { getSharedSecret() } doReturn byteArrayOf(3, 3)
    }

    private val encryptionManager = mock<QlicEncryptionManager>()

    private val transcriptHashManager = mock<TranscriptHashManager> {
        on { hash() } doReturn byteArrayOf(5, 5)
    }

    private var onSent: (() -> Unit)? = null
    private val sender = mock<QlicFrameSender> {
        on { send(any(), any()) } doAnswer { onSent = it.getArgument(1) }
    }

    private val onCompleted = mock<() -> Unit>()

    private val secureRandom = mock<SecureRandom>()

    private val crypto = mock<QlicFrame.Crypto> {
        on { data } doReturn byteArrayOf(6, 6)
    }

    private val unpack = mock<(QlicFrame.Crypto) -> QlicHandshake?> {
        on { invoke(any()) } doReturn mock()
    }

    private val pack = mock<(QlicHandshake, OutputStream) -> Unit>()

    private val clientSubject = QlicHandshakeHandler(
        authenticationManager,
        keyExchangeManager,
        encryptionManager,
        transcriptHashManager,
        secureRandom,
        sender,
        onCompleted,
        true,
        unpack,
        pack
    )

    private val serverSubject = QlicHandshakeHandler(
        authenticationManager,
        keyExchangeManager,
        encryptionManager,
        transcriptHashManager,
        secureRandom,
        sender,
        onCompleted,
        false,
        unpack,
        pack
    )

    @Test
    fun `start(), client, preTrusted`() {
        clientSubject.start()

        verify(authenticationManager).getLocalIdentity()
        verify(authenticationManager).getRemoteIdentity()
        verify(keyExchangeManager).initiateKeyExchange()
        verify(pack).invoke(
            argThat { this is QlicHandshake.ClientHello && clientSessionKey.contentEquals(byteArrayOf(1, 1)) },
            any()
        )
        verify(sender).send(any(), eq(null))
        verify(transcriptHashManager).add(any())
        verify(transcriptHashManager).update()
    }

    @Test
    fun `start(), client, not-preTrusted`() {
        whenever(authenticationManager.getLocalIdentity()).thenReturn(byteArrayOf())
        whenever(authenticationManager.getRemoteIdentity()).thenReturn(byteArrayOf())
        clientSubject.start()

        verify(authenticationManager).getLocalIdentity()
        verify(authenticationManager).getRemoteIdentity()
        verify(keyExchangeManager).initiateKeyExchange()
        verify(pack).invoke(
            argThat { this is QlicHandshake.ClientHello && clientSessionKey.contentEquals(byteArrayOf(1, 1)) },
            any()
        )
        verify(sender).send(any(), eq(null))
        verify(transcriptHashManager).add(any())
        verify(transcriptHashManager).update()
    }

    @Test(expected = SpectaclesStreamException::class)
    fun `start(), client, No client algorithm`() {
        whenever(authenticationManager.getLocalIdentity()).thenReturn(byteArrayOf())
        whenever(authenticationManager.getRemoteIdentity()).thenReturn(byteArrayOf())
        whenever(authenticationManager.getSupportedLocalAttestationAlgorithms()).thenReturn(emptyList())
        clientSubject.start()
    }

    @Test(expected = SpectaclesStreamException::class)
    fun `start(), client, No server algorithm`() {
        whenever(authenticationManager.getLocalIdentity()).thenReturn(byteArrayOf())
        whenever(authenticationManager.getRemoteIdentity()).thenReturn(byteArrayOf())
        whenever(authenticationManager.getSupportedRemoteAttestationAlgorithms()).thenReturn(emptyList())
        clientSubject.start()
    }

    @Test
    fun `handle(), unexpected message`() {
        clientSubject.start()
        clearInvocations(transcriptHashManager)

        val authRequest = QlicHandshake.AuthRequest(1, 1)
        whenever(unpack.invoke(any())).doReturn(authRequest)
        assertTrue(clientSubject.handle(crypto))
    }

    @Test
    fun `onServerHello()`() {
        clientSubject.start()
        clearInvocations(transcriptHashManager)

        val serverHello = QlicHandshake.ServerHello(byteArrayOf(1), byteArrayOf(2))
        whenever(unpack.invoke(any())).doReturn(serverHello)
        clientSubject.handle(crypto)
        verify(transcriptHashManager).add(any())
        verify(transcriptHashManager).update()
        verify(transcriptHashManager).hash()
        verify(keyExchangeManager).completeKeyExchange(any())
        verify(keyExchangeManager).getSharedSecret()
        verify(encryptionManager).setSecret(any(), any())
    }

    @Test
    fun `onServerAuthRequest()`() {
        clientSubject.start()
        val serverHello = QlicHandshake.ServerHello(byteArrayOf(1), byteArrayOf(2))
        whenever(unpack.invoke(any())).doReturn(serverHello)
        clientSubject.handle(crypto)
        clearInvocations(transcriptHashManager)

        val authRequest = QlicHandshake.AuthRequest(1, 1)
        whenever(unpack.invoke(any())).doReturn(authRequest)
        clientSubject.handle(crypto)
        verify(transcriptHashManager).add(any())
        verify(transcriptHashManager).update()
    }

    @Test(expected = SpectaclesStreamException::class)
    fun `onServerAuthRequest, Bad client algorithm()`() {
        clientSubject.start()
        val serverHello = QlicHandshake.ServerHello(byteArrayOf(1), byteArrayOf(2))
        whenever(unpack.invoke(any())).doReturn(serverHello)
        clientSubject.handle(crypto)
        clearInvocations(transcriptHashManager)

        val authRequest = QlicHandshake.AuthRequest(0, 1)
        whenever(unpack.invoke(any())).doReturn(authRequest)
        clientSubject.handle(crypto)
    }

    @Test(expected = SpectaclesStreamException::class)
    fun `onServerAuthRequest, Bad server algorithm()`() {
        clientSubject.start()
        val serverHello = QlicHandshake.ServerHello(byteArrayOf(1), byteArrayOf(2))
        whenever(unpack.invoke(any())).doReturn(serverHello)
        clientSubject.handle(crypto)
        clearInvocations(transcriptHashManager)

        val authRequest = QlicHandshake.AuthRequest(1, 0)
        whenever(unpack.invoke(any())).doReturn(authRequest)
        clientSubject.handle(crypto)
    }

    @Test
    fun `onServerAuthShare(), PreTrusted attestation`() {
        clientSubject.start()
        val serverHello = QlicHandshake.ServerHello(byteArrayOf(1), byteArrayOf(2))
        whenever(unpack.invoke(any())).doReturn(serverHello)
        clientSubject.handle(crypto)
        val authRequest = QlicHandshake.AuthRequest(1, 1)
        whenever(unpack.invoke(any())).doReturn(authRequest)
        clientSubject.handle(crypto)
        clearInvocations(transcriptHashManager)
        clearInvocations(authenticationManager)

        val authAttestation = QlicHandshake.AuthShare(
            QlicHandshake.AuthAttestation.PreTrusted
        )
        whenever(unpack.invoke(any())).doReturn(authAttestation)
        clientSubject.handle(crypto)
        verify(authenticationManager).getRemoteIdentity()
        verify(transcriptHashManager).add(any())
        verify(transcriptHashManager).update()
    }

    @Test(expected = SpectaclesStreamException::class)
    fun `onServerAuthShare(), PreTrusted attestation, failed`() {
        clientSubject.start()
        val serverHello = QlicHandshake.ServerHello(byteArrayOf(1), byteArrayOf(2))
        whenever(unpack.invoke(any())).doReturn(serverHello)
        clientSubject.handle(crypto)
        val authRequest = QlicHandshake.AuthRequest(1, 1)
        whenever(unpack.invoke(any())).doReturn(authRequest)
        clientSubject.handle(crypto)
        clearInvocations(transcriptHashManager)
        clearInvocations(authenticationManager)

        whenever(authenticationManager.getRemoteIdentity()).thenReturn(byteArrayOf())
        val authAttestation = QlicHandshake.AuthShare(
            QlicHandshake.AuthAttestation.PreTrusted
        )
        whenever(unpack.invoke(any())).doReturn(authAttestation)
        clientSubject.handle(crypto)
    }

    @Test
    fun `onServerAuthShare(), AndroidSpecific attestation`() {
        clientSubject.start()
        val serverHello = QlicHandshake.ServerHello(byteArrayOf(1), byteArrayOf(2))
        whenever(unpack.invoke(any())).doReturn(serverHello)
        clientSubject.handle(crypto)
        val authRequest = QlicHandshake.AuthRequest(1, 1)
        whenever(unpack.invoke(any())).doReturn(authRequest)
        clientSubject.handle(crypto)
        clearInvocations(transcriptHashManager)
        clearInvocations(authenticationManager)

        val authAttestation = QlicHandshake.AuthShare(
            QlicHandshake.AuthAttestation.CertificateChain(emptyList())
        )
        whenever(unpack.invoke(any())).doReturn(authAttestation)
        clientSubject.handle(crypto)
        verify(authenticationManager).validateRemoteIdentityAttestation(
            any(),
            argThat { this is AuthenticationManager.Attestation.CertificateChain }
        )
        verify(transcriptHashManager).hash()
        verify(transcriptHashManager).add(any())
        verify(transcriptHashManager).update()
    }

    @Test
    fun `onServerAuthShare(), CertificateChain attestation`() {
        clientSubject.start()
        val serverHello = QlicHandshake.ServerHello(byteArrayOf(1), byteArrayOf(2))
        whenever(unpack.invoke(any())).doReturn(serverHello)
        clientSubject.handle(crypto)
        val authRequest = QlicHandshake.AuthRequest(1, 1)
        whenever(unpack.invoke(any())).doReturn(authRequest)
        clientSubject.handle(crypto)
        clearInvocations(transcriptHashManager)
        clearInvocations(authenticationManager)

        val authAttestation = QlicHandshake.AuthShare(
            QlicHandshake.AuthAttestation.AndroidSpecific(emptyList())
        )
        whenever(unpack.invoke(any())).doReturn(authAttestation)
        clientSubject.handle(crypto)
        verify(authenticationManager).validateRemoteIdentityAttestation(
            any(),
            argThat { this is AuthenticationManager.Attestation.CertificateChain }
        )
        verify(transcriptHashManager).hash()
        verify(transcriptHashManager).add(any())
        verify(transcriptHashManager).update()
    }

    @Test
    fun `onServerAuthVerify(), chosenClientAlgorithm = preTrusted(1)`() {
        clientSubject.start()
        val serverHello = QlicHandshake.ServerHello(byteArrayOf(1), byteArrayOf(2))
        whenever(unpack.invoke(any())).doReturn(serverHello)
        clientSubject.handle(crypto)
        val authRequest = QlicHandshake.AuthRequest(1, 1)
        whenever(unpack.invoke(any())).doReturn(authRequest)
        clientSubject.handle(crypto)
        val authAttestation = QlicHandshake.AuthShare(
            QlicHandshake.AuthAttestation.CertificateChain(emptyList())
        )
        whenever(unpack.invoke(any())).doReturn(authAttestation)
        clientSubject.handle(crypto)
        clearInvocations(transcriptHashManager)

        val serverProof = QlicHandshake.AuthVerify(byteArrayOf(1))
        whenever(unpack.invoke(any())).doReturn(serverProof)
        clientSubject.handle(crypto)
        verify(authenticationManager).verifyWithRemoteIdentity(
            any(),
            argThat { contentEquals(byteArrayOf(1)) }
        )

        verify(authenticationManager, never())
            .generateLocalIdentityAttestation<AuthenticationManager.Attestation.CertificateChain>(any(), any())

        verify(authenticationManager).signWithLocalIdentity(any())
        verify(pack).invoke(
            argThat { this is QlicHandshake.AuthVerify && signature.contentEquals(byteArrayOf(0, 0)) },
            any()
        )

        verify(onCompleted, never()).invoke()
        onSent?.invoke()
        verify(onCompleted).invoke()
    }

    @Test
    fun `onServerAuthVerify(), chosenClientAlgorithm = AndroidSpecific(2)`() {
        clientSubject.start()
        val serverHello = QlicHandshake.ServerHello(byteArrayOf(1), byteArrayOf(2))
        whenever(unpack.invoke(any())).doReturn(serverHello)
        clientSubject.handle(crypto)
        val authRequest = QlicHandshake.AuthRequest(2, 1)
        whenever(unpack.invoke(any())).doReturn(authRequest)
        clientSubject.handle(crypto)
        val authAttestation = QlicHandshake.AuthShare(
            QlicHandshake.AuthAttestation.CertificateChain(emptyList())
        )
        whenever(unpack.invoke(any())).doReturn(authAttestation)
        clientSubject.handle(crypto)
        clearInvocations(transcriptHashManager)

        val serverProof = QlicHandshake.AuthVerify(byteArrayOf(1))
        whenever(unpack.invoke(any())).doReturn(serverProof)
        clientSubject.handle(crypto)
        verify(authenticationManager).verifyWithRemoteIdentity(
            any(),
            argThat { contentEquals(byteArrayOf(1)) }
        )

        verify(authenticationManager)
            .generateLocalIdentityAttestation<AuthenticationManager.Attestation.CertificateChain>(any(), any())
        verify(pack).invoke(
            argThat { this is QlicHandshake.AuthShare },
            any()
        )

        verify(authenticationManager).signWithLocalIdentity(any())
        verify(pack).invoke(
            argThat { this is QlicHandshake.AuthVerify && signature.contentEquals(byteArrayOf(0, 0)) },
            any()
        )

        verify(onCompleted, never()).invoke()
        onSent?.invoke()
        verify(encryptionManager).update(any())
        verify(onCompleted).invoke()
    }

    @Test
    fun `onServerAuthVerify(), chosenClientAlgorithm= CertificateChain(3)`() {
        clientSubject.start()
        val serverHello = QlicHandshake.ServerHello(byteArrayOf(1), byteArrayOf(2))
        whenever(unpack.invoke(any())).doReturn(serverHello)
        clientSubject.handle(crypto)
        val authRequest = QlicHandshake.AuthRequest(3, 1)
        whenever(unpack.invoke(any())).doReturn(authRequest)
        clientSubject.handle(crypto)
        val authAttestation = QlicHandshake.AuthShare(
            QlicHandshake.AuthAttestation.CertificateChain(emptyList())
        )
        whenever(unpack.invoke(any())).doReturn(authAttestation)
        clientSubject.handle(crypto)
        clearInvocations(transcriptHashManager)

        val serverProof = QlicHandshake.AuthVerify(byteArrayOf(1))
        whenever(unpack.invoke(any())).doReturn(serverProof)
        clientSubject.handle(crypto)
        verify(authenticationManager).verifyWithRemoteIdentity(
            any(),
            argThat { contentEquals(byteArrayOf(1)) }
        )

        verify(authenticationManager)
            .generateLocalIdentityAttestation<AuthenticationManager.Attestation.CertificateChain>(any(), any())
        verify(pack).invoke(
            argThat { this is QlicHandshake.AuthShare },
            any()
        )

        verify(authenticationManager).signWithLocalIdentity(any())
        verify(pack).invoke(
            argThat { this is QlicHandshake.AuthVerify && signature.contentEquals(byteArrayOf(0, 0)) },
            any()
        )

        verify(onCompleted, never()).invoke()
        onSent?.invoke()
        verify(encryptionManager).update(any())
        verify(onCompleted).invoke()
    }

    @Test(expected = SpectaclesStreamException::class)
    fun `onServerAuthVerify(), verifyAuthenticationSignature() failed`() {
        clientSubject.start()
        val serverHello = QlicHandshake.ServerHello(byteArrayOf(1), byteArrayOf(2))
        whenever(unpack.invoke(any())).doReturn(serverHello)
        clientSubject.handle(crypto)
        val authRequest = QlicHandshake.AuthRequest(1, 1)
        whenever(unpack.invoke(any())).doReturn(authRequest)
        clientSubject.handle(crypto)
        val authShare = QlicHandshake.AuthShare(QlicHandshake.AuthAttestation.PreTrusted)
        whenever(unpack.invoke(any())).doReturn(authShare)
        clientSubject.handle(crypto)
        clearInvocations(transcriptHashManager)

        whenever(authenticationManager.verifyWithRemoteIdentity(any(), any())).doReturn(false)
        val serverVerify = QlicHandshake.AuthVerify(byteArrayOf(1))
        whenever(unpack.invoke(any())).doReturn(serverVerify)
        clientSubject.handle(crypto)
    }

    @Test
    fun `start(), server`() {
        serverSubject.start()
    }

    @Test
    fun `onClientHello(), validClientAttestation = false, validServerAttestation = true`() {
        serverSubject.start()

        val clientHello = QlicHandshake.ClientHello(
            byteArrayOf(1),
            byteArrayOf(2),
            listOf(QlicHandshake.AuthAlgorithm.PreTrusted(byteArrayOf(2, 2))),
            listOf(QlicHandshake.AuthAlgorithm.PreTrusted(byteArrayOf(1, 0)))
        )
        whenever(unpack.invoke(any())).doReturn(clientHello)
        serverSubject.handle(crypto)
        verify(pack).invoke(
            argThat { this is QlicHandshake.ServerHello && serverSessionKey.contentEquals(byteArrayOf(1, 1)) },
            any()
        )
        verify(keyExchangeManager).initiateKeyExchange()
        verify(keyExchangeManager).completeKeyExchange(any())
        verify(encryptionManager, never()).setSecret(any(), any())
    }

    @Test
    fun `onContinueClientHello(), client = Android, server = preTrusted`() {
        serverSubject.start()
        val clientHello = QlicHandshake.ClientHello(
            byteArrayOf(1),
            byteArrayOf(2),
            listOf(
                QlicHandshake.AuthAlgorithm.PreTrusted(byteArrayOf()),
                QlicHandshake.AuthAlgorithm.AndroidSpecific
            ),
            listOf(
                QlicHandshake.AuthAlgorithm.PreTrusted(byteArrayOf(1, 1)),
                QlicHandshake.AuthAlgorithm.AndroidSpecific
            )
        )
        whenever(unpack.invoke(any())).doReturn(clientHello)
        serverSubject.handle(crypto)
        onSent?.invoke()

        verify(pack).invoke(
            argThat {
                this is QlicHandshake.AuthRequest && chosenClientAlgorithm == 2 && chosenServerAlgorithm == 1
            },
            any()
        )

        verify(authenticationManager, never())
            .generateLocalIdentityAttestation<AuthenticationManager.Attestation.CertificateChain>(any(), any())
        verify(pack).invoke(
            argThat { this is QlicHandshake.AuthShare },
            any()
        )

        verify(authenticationManager).signWithLocalIdentity(any())
        verify(pack).invoke(
            argThat { this is QlicHandshake.AuthVerify && signature.contentEquals(byteArrayOf(0, 0)) },
            any()
        )
    }

    @Test
    fun `onContinueClientHello(), client = preTrusted, server = Android`() {
        serverSubject.start()
        val clientHello = QlicHandshake.ClientHello(
            byteArrayOf(1),
            byteArrayOf(2),
            listOf(QlicHandshake.AuthAlgorithm.PreTrusted(byteArrayOf(2, 2))),
            listOf(
                QlicHandshake.AuthAlgorithm.PreTrusted(byteArrayOf(1, 1, 0)),
                QlicHandshake.AuthAlgorithm.AndroidSpecific
            )
        )
        whenever(unpack.invoke(any())).doReturn(clientHello)
        serverSubject.handle(crypto)
        onSent?.invoke()

        verify(pack).invoke(
            argThat {
                this is QlicHandshake.AuthRequest && chosenClientAlgorithm == 1 && chosenServerAlgorithm == 2
            },
            any()
        )

        verify(authenticationManager)
            .generateLocalIdentityAttestation<AuthenticationManager.Attestation.CertificateChain>(any(), any())
        verify(pack).invoke(
            argThat { this is QlicHandshake.AuthShare },
            any()
        )

        verify(authenticationManager).signWithLocalIdentity(any())
        verify(pack).invoke(
            argThat { this is QlicHandshake.AuthVerify && signature.contentEquals(byteArrayOf(0, 0)) },
            any()
        )
    }

    @Test
    fun `onContinueClientHello(), client = preTrusted, server = Certificate chain`() {
        serverSubject.start()
        val clientHello = QlicHandshake.ClientHello(
            byteArrayOf(1),
            byteArrayOf(2),
            listOf(QlicHandshake.AuthAlgorithm.PreTrusted(byteArrayOf(2, 2))),
            listOf(
                QlicHandshake.AuthAlgorithm.PreTrusted(byteArrayOf(1, 1, 0)),
                QlicHandshake.AuthAlgorithm.CertificateChain
            )
        )
        whenever(unpack.invoke(any())).doReturn(clientHello)
        serverSubject.handle(crypto)
        onSent?.invoke()

        verify(pack).invoke(
            argThat {
                this is QlicHandshake.AuthRequest && chosenClientAlgorithm == 1 && chosenServerAlgorithm == 2
            },
            any()
        )

        verify(authenticationManager)
            .generateLocalIdentityAttestation<AuthenticationManager.Attestation.CertificateChain>(any(), any())
        verify(pack).invoke(
            argThat { this is QlicHandshake.AuthShare },
            any()
        )

        verify(authenticationManager).signWithLocalIdentity(any())
        verify(pack).invoke(
            argThat { this is QlicHandshake.AuthVerify && signature.contentEquals(byteArrayOf(0, 0)) },
            any()
        )
    }

    @Test(expected = SpectaclesStreamException::class)
    fun `onContinueClientHello(), bad client algorithm`() {
        serverSubject.start()
        val clientHello = QlicHandshake.ClientHello(
            byteArrayOf(1),
            byteArrayOf(2),
            listOf(
                QlicHandshake.AuthAlgorithm.PreTrusted(byteArrayOf())
            ),
            listOf(
                QlicHandshake.AuthAlgorithm.PreTrusted(byteArrayOf(1, 1)),
                QlicHandshake.AuthAlgorithm.AndroidSpecific
            )
        )
        whenever(unpack.invoke(any())).doReturn(clientHello)
        serverSubject.handle(crypto)
        onSent?.invoke() // trigger onContinueClientHello()
        onSent?.invoke()
    }

    @Test(expected = SpectaclesStreamException::class)
    fun `onContinueClientHello(), bad server algorithm`() {
        serverSubject.start()
        val clientHello = QlicHandshake.ClientHello(
            byteArrayOf(1),
            byteArrayOf(2),
            listOf(
                QlicHandshake.AuthAlgorithm.PreTrusted(byteArrayOf()),
                QlicHandshake.AuthAlgorithm.AndroidSpecific
            ),
            listOf(
                QlicHandshake.AuthAlgorithm.PreTrusted(byteArrayOf())
            )
        )
        whenever(unpack.invoke(any())).doReturn(clientHello)
        serverSubject.handle(crypto)
        onSent?.invoke() // trigger onContinueClientHello()
        onSent?.invoke()
    }

    @Test
    fun `onClientAuthShare(), preTrusted`() {
        serverSubject.start()
        val clientHello = QlicHandshake.ClientHello(
            byteArrayOf(1),
            byteArrayOf(2),
            listOf(QlicHandshake.AuthAlgorithm.PreTrusted(byteArrayOf(2, 2))),
            listOf(QlicHandshake.AuthAlgorithm.PreTrusted(byteArrayOf(1, 1)))
        )
        whenever(unpack.invoke(any())).doReturn(clientHello)
        serverSubject.handle(crypto)
        onSent?.invoke()
        clearInvocations(transcriptHashManager)

        val clientShare = QlicHandshake.AuthShare(
            QlicHandshake.AuthAttestation.CertificateChain(emptyList())
        )
        whenever(unpack.invoke(any())).doReturn(clientShare)
        serverSubject.handle(crypto)
        verify(authenticationManager).validateRemoteIdentityAttestation(
            any(),
            argThat { this is AuthenticationManager.Attestation.CertificateChain }
        )
    }

    @Test
    fun `onClientAuthShare(), AndroidSpecific`() {
        serverSubject.start()
        val clientHello = QlicHandshake.ClientHello(
            byteArrayOf(1),
            byteArrayOf(2),
            listOf(
                QlicHandshake.AuthAlgorithm.PreTrusted(byteArrayOf(2, 2, 0)),
                QlicHandshake.AuthAlgorithm.AndroidSpecific
            ),
            listOf(QlicHandshake.AuthAlgorithm.PreTrusted(byteArrayOf(1, 1)))
        )
        whenever(unpack.invoke(any())).doReturn(clientHello)
        serverSubject.handle(crypto)
        onSent?.invoke()
        clearInvocations(transcriptHashManager)

        val clientShare = QlicHandshake.AuthShare(
            QlicHandshake.AuthAttestation.CertificateChain(emptyList())
        )
        whenever(unpack.invoke(any())).doReturn(clientShare)
        serverSubject.handle(crypto)
        verify(authenticationManager).validateRemoteIdentityAttestation(
            any(),
            argThat { this is AuthenticationManager.Attestation.CertificateChain }
        )
        verify(transcriptHashManager).update()
    }

    @Test
    fun `onClientAuthShare(), IosSpecific`() {
        serverSubject.start()
        val clientHello = QlicHandshake.ClientHello(
            byteArrayOf(1),
            byteArrayOf(2),
            listOf(
                QlicHandshake.AuthAlgorithm.PreTrusted(byteArrayOf(2, 2, 0)),
                QlicHandshake.AuthAlgorithm.IosSpecific
            ),
            listOf(QlicHandshake.AuthAlgorithm.PreTrusted(byteArrayOf(1, 1)))
        )
        whenever(unpack.invoke(any())).doReturn(clientHello)
        serverSubject.handle(crypto)
        onSent?.invoke()
        clearInvocations(transcriptHashManager)

        val clientShare = QlicHandshake.AuthShare(
            QlicHandshake.AuthAttestation.IosSpecific(byteArrayOf(), byteArrayOf())
        )
        whenever(unpack.invoke(any())).doReturn(clientShare)
        serverSubject.handle(crypto)
        verify(authenticationManager).validateRemoteIdentityAttestation(
            any(),
            argThat { this is AuthenticationManager.Attestation.IosSpecific }
        )
        verify(transcriptHashManager).update()
    }

    @Test
    fun `onClientAuthVerify()`() {
        serverSubject.start()
        val clientHello = QlicHandshake.ClientHello(
            byteArrayOf(1),
            byteArrayOf(2),
            listOf(
                QlicHandshake.AuthAlgorithm.PreTrusted(byteArrayOf(2, 2, 0)),
                QlicHandshake.AuthAlgorithm.AndroidSpecific
            ),
            listOf(QlicHandshake.AuthAlgorithm.PreTrusted(byteArrayOf(1, 1)))
        )
        whenever(unpack.invoke(any())).doReturn(clientHello)
        serverSubject.handle(crypto)
        onSent?.invoke()
        val clientShare = QlicHandshake.AuthShare(
            QlicHandshake.AuthAttestation.CertificateChain(emptyList())
        )
        whenever(unpack.invoke(any())).doReturn(clientShare)
        serverSubject.handle(crypto)
        clearInvocations(transcriptHashManager)

        val clientVerify = QlicHandshake.AuthVerify(byteArrayOf(12))
        whenever(unpack.invoke(any())).doReturn(clientVerify)
        serverSubject.handle(crypto)
        verify(authenticationManager).signWithLocalIdentity(any())
        verify(encryptionManager).update(any())
        verify(onCompleted).invoke()
    }

    @Test(expected = SpectaclesStreamException::class)
    fun `onClientAuthVerify(), verifyAuthenticationSignature() failed`() {
        serverSubject.start()
        val clientHello = QlicHandshake.ClientHello(
            byteArrayOf(1),
            byteArrayOf(2),
            listOf(
                QlicHandshake.AuthAlgorithm.PreTrusted(byteArrayOf(2, 2, 0)),
                QlicHandshake.AuthAlgorithm.AndroidSpecific
            ),
            listOf(QlicHandshake.AuthAlgorithm.PreTrusted(byteArrayOf(1, 1)))
        )
        whenever(unpack.invoke(any())).doReturn(clientHello)
        serverSubject.handle(crypto)
        onSent?.invoke()
        val clientShare = QlicHandshake.AuthShare(
            QlicHandshake.AuthAttestation.CertificateChain(emptyList())
        )
        whenever(unpack.invoke(any())).doReturn(clientShare)
        serverSubject.handle(crypto)
        clearInvocations(transcriptHashManager)

        whenever(authenticationManager.verifyWithRemoteIdentity(any(), any())).doReturn(false)

        val clientVerify = QlicHandshake.AuthVerify(byteArrayOf(12))
        whenever(unpack.invoke(any())).doReturn(clientVerify)
        serverSubject.handle(crypto)
    }

    @Test
    fun `close()`() {
        serverSubject.close()
        val clientVerify = QlicHandshake.AuthVerify(byteArrayOf(12))
        whenever(unpack.invoke(any())).doReturn(clientVerify)
        assertFalse(serverSubject.handle(crypto))
    }

    @Test
    fun `Factory create()`() {
        QlicHandshakeHandler.Factory.create(
            authenticationManager,
            keyExchangeManager,
            encryptionManager,
            transcriptHashManager,
            secureRandom,
            sender,
            onCompleted,
            false
        )
    }
}
