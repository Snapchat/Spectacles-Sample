package com.snap.spectacles.kit.stream.qlic

import com.snap.spectacles.kit.stream.SpectaclesStreamException
import com.snap.spectacles.kit.stream.utils.readLengthDelimitedRecord
import com.snap.spectacles.kit.stream.utils.readVarint
import com.snap.spectacles.kit.stream.utils.writeLengthDelimitedRecord
import com.snap.spectacles.kit.stream.utils.writeVarint
import java.io.ByteArrayInputStream
import java.io.InputStream
import java.io.OutputStream
import java.security.cert.Certificate
import java.security.cert.CertificateFactory

internal sealed interface QlicHandshake {

    companion object {

        private const val CLIENT_HELLO = 0x01
        private const val SERVER_HELLO = 0x02
        private const val AUTH_REQUEST = 0x0D
        private const val AUTH_ATTESTATION = 0x0B
        private const val AUTH_VERIFY = 0x0F

        private const val TYPE_PRE_TRUSTED = 0x01
        private const val TYPE_IOS_SPECIFIC = 0x02
        private const val TYPE_ANDROID_SPECIFIC = 0x03
        private const val TYPE_CERTIFICATE = 0x04

        /**
         * Deserializes a [QlicHandshake] instance from the provided InputStream.
         *
         * @param input the InputStream from which the frame is deserialized.
         * @return A [QlicHandshake] instance or null if the type indicator is unrecognized.
         */
        fun deserialize(input: InputStream): QlicHandshake? {
            return when (input.read()) {
                CLIENT_HELLO -> ClientHello.deserialize(input)
                SERVER_HELLO -> ServerHello.deserialize(input)
                AUTH_REQUEST -> AuthRequest.deserialize(input)
                AUTH_ATTESTATION -> AuthShare.deserialize(input)
                AUTH_VERIFY -> AuthVerify.deserialize(input)
                else -> null
            }
        }
    }

    /**
     * Serializes the handshake into the provided OutputStream.
     * @param output the OutputStream to which the frame will be serialized.
     */
    fun serialize(output: OutputStream)

    class ClientHello(
        val clientNonce: ByteArray,
        val clientSessionKey: ByteArray,
        val clientAuthAlgorithms: List<AuthAlgorithm>,
        val serverAuthAlgorithms: List<AuthAlgorithm>
    ) : QlicHandshake {

        companion object {
            fun deserialize(input: InputStream): ClientHello {
                val clientNonce = input.readLengthDelimitedRecord()
                    ?: throw SpectaclesStreamException(SpectaclesStreamException.BAD_REQUEST, "clientNonce")
                val clientSessionKey = input.readLengthDelimitedRecord()
                    ?: throw SpectaclesStreamException(SpectaclesStreamException.BAD_REQUEST, "clientSessionKey")
                val clientIdentitiesCount = input.readVarint()
                    ?: throw SpectaclesStreamException(SpectaclesStreamException.BAD_REQUEST, "clientIdentities")
                val clientAuthAlgorithms = mutableListOf<AuthAlgorithm>()
                for (i in 0 until clientIdentitiesCount) {
                    clientAuthAlgorithms.add(AuthAlgorithm.deserialize(input))
                }
                val serverIdentitiesCount = input.readVarint()
                    ?: throw SpectaclesStreamException(SpectaclesStreamException.BAD_REQUEST, "serverIdentities")
                val serverAuthAlgorithms = mutableListOf<AuthAlgorithm>()
                for (i in 0 until serverIdentitiesCount) {
                    serverAuthAlgorithms.add(AuthAlgorithm.deserialize(input))
                }
                return ClientHello(
                    clientNonce,
                    clientSessionKey,
                    clientAuthAlgorithms,
                    serverAuthAlgorithms
                )
            }
        }

        override fun serialize(output: OutputStream) {
            output.write(CLIENT_HELLO)
            output.writeLengthDelimitedRecord(clientNonce)
            output.writeLengthDelimitedRecord(clientSessionKey)
            output.writeVarint(clientAuthAlgorithms.size)
            clientAuthAlgorithms.forEach { it.serialize(output) }
            output.writeVarint(serverAuthAlgorithms.size)
            serverAuthAlgorithms.forEach { it.serialize(output) }
        }
    }

    class ServerHello(
        val serverNonce: ByteArray,
        val serverSessionKey: ByteArray,
    ) : QlicHandshake {

        companion object {
            fun deserialize(input: InputStream): ServerHello {
                val serverNonce = input.readLengthDelimitedRecord()
                    ?: throw SpectaclesStreamException(SpectaclesStreamException.BAD_REQUEST, "serverNonce")
                val serverSessionKey = input.readLengthDelimitedRecord()
                    ?: throw SpectaclesStreamException(SpectaclesStreamException.BAD_REQUEST, "serverSessionKey")
                return ServerHello(serverNonce, serverSessionKey)
            }
        }

        override fun serialize(output: OutputStream) {
            output.write(SERVER_HELLO)
            output.writeLengthDelimitedRecord(serverNonce)
            output.writeLengthDelimitedRecord(serverSessionKey)
        }
    }

    class AuthRequest(
        val chosenClientAlgorithm: Int,
        val chosenServerAlgorithm: Int
    ) : QlicHandshake {

        companion object {
            fun deserialize(input: InputStream): AuthRequest {
                val clientIdentity = input.readVarint()
                    ?: throw SpectaclesStreamException(
                        SpectaclesStreamException.BAD_REQUEST, "validClientIdentity"
                    )
                val serverIdentity = input.readVarint()
                    ?: throw SpectaclesStreamException(
                        SpectaclesStreamException.BAD_REQUEST, "validServerIdentity"
                    )
                return AuthRequest(clientIdentity, serverIdentity)
            }
        }

        override fun serialize(output: OutputStream) {
            output.write(AUTH_REQUEST)
            output.writeVarint(chosenClientAlgorithm)
            output.writeVarint(chosenServerAlgorithm)
        }
    }

    class AuthShare(
        val attestation: AuthAttestation
    ) : QlicHandshake {

        companion object {
            fun deserialize(input: InputStream): AuthShare {
                return AuthShare(AuthAttestation.deserialize(input))
            }
        }

        override fun serialize(output: OutputStream) {
            output.write(AUTH_ATTESTATION)
            attestation.serialize(output)
        }
    }

    class AuthVerify(
        val signature: ByteArray
    ) : QlicHandshake {

        companion object {
            fun deserialize(input: InputStream): AuthVerify {
                val signature = input.readLengthDelimitedRecord()
                    ?: throw SpectaclesStreamException(SpectaclesStreamException.BAD_REQUEST, "signature")
                return AuthVerify(signature)
            }
        }

        override fun serialize(output: OutputStream) {
            output.write(AUTH_VERIFY)
            output.writeLengthDelimitedRecord(signature)
        }
    }

    sealed interface AuthAlgorithm {

        companion object {
            fun deserialize(input: InputStream): AuthAlgorithm {
                val type = input.read()
                val encoded = input.readLengthDelimitedRecord()
                    ?: throw SpectaclesStreamException(SpectaclesStreamException.BAD_REQUEST, "data")

                return when (type) {
                    TYPE_PRE_TRUSTED -> PreTrusted(encoded)
                    TYPE_IOS_SPECIFIC -> IosSpecific
                    TYPE_ANDROID_SPECIFIC -> AndroidSpecific
                    TYPE_CERTIFICATE -> CertificateChain
                    else ->
                        throw SpectaclesStreamException(
                            SpectaclesStreamException.BAD_REQUEST, "Unsupported identity($type)"
                        )
                }
            }
        }

        fun serialize(output: OutputStream)

        class PreTrusted(val publicKey: ByteArray) : AuthAlgorithm {
            override fun serialize(output: OutputStream) {
                output.write(TYPE_PRE_TRUSTED)
                output.writeLengthDelimitedRecord(publicKey)
            }
        }

        object IosSpecific : AuthAlgorithm {
            override fun serialize(output: OutputStream) {
                output.write(TYPE_IOS_SPECIFIC)
                output.writeLengthDelimitedRecord(ByteArray(0))
            }
        }

        object AndroidSpecific : AuthAlgorithm {
            override fun serialize(output: OutputStream) {
                output.write(TYPE_ANDROID_SPECIFIC)
                output.writeLengthDelimitedRecord(ByteArray(0))
            }
        }

        object CertificateChain : AuthAlgorithm {
            override fun serialize(output: OutputStream) {
                output.write(TYPE_CERTIFICATE)
                output.writeLengthDelimitedRecord(ByteArray(0))
            }
        }
    }

    sealed interface AuthAttestation {

        companion object {
            fun deserialize(input: InputStream): AuthAttestation {
                return when (val type = input.read()) {
                    TYPE_PRE_TRUSTED -> PreTrusted
                    TYPE_IOS_SPECIFIC -> IosSpecific.deserialize(input)
                    TYPE_ANDROID_SPECIFIC -> AndroidSpecific.deserialize(input)
                    TYPE_CERTIFICATE -> CertificateChain.deserialize(input)
                    else ->
                        throw SpectaclesStreamException(
                            SpectaclesStreamException.BAD_REQUEST, "Unsupported attestation($type)"
                        )
                }
            }

            protected fun MutableList<Certificate>.deserialize(input: InputStream) {
                val count = input.readVarint()
                    ?: throw SpectaclesStreamException(SpectaclesStreamException.BAD_REQUEST, "certificate chain")
                val certificateFactory = CertificateFactory.getInstance("X.509")
                for (i in 0 until count) {
                    val encoded = input.readLengthDelimitedRecord()
                        ?: throw SpectaclesStreamException(
                            SpectaclesStreamException.BAD_REQUEST, "certificate($i/$count)"
                        )
                    ByteArrayInputStream(encoded).use {
                        add(certificateFactory.generateCertificate(it))
                    }
                }
            }

            protected fun List<Certificate>.serialize(output: OutputStream) {
                output.writeVarint(size)
                forEach {
                    output.writeLengthDelimitedRecord(it.encoded)
                }
            }
        }

        fun serialize(output: OutputStream)

        object PreTrusted : AuthAttestation {
            override fun serialize(output: OutputStream) {
                output.write(TYPE_PRE_TRUSTED)
            }
        }

        class IosSpecific(val publicKey: ByteArray, val attestation: ByteArray) : AuthAttestation {

            companion object {
                fun deserialize(input: InputStream): IosSpecific {
                    val publicKey = input.readLengthDelimitedRecord()
                        ?: throw SpectaclesStreamException(SpectaclesStreamException.BAD_REQUEST, "publicKey")
                    val attestation = input.readLengthDelimitedRecord()
                        ?: throw SpectaclesStreamException(SpectaclesStreamException.BAD_REQUEST, "attestation")
                    return IosSpecific(publicKey, attestation)
                }
            }

            override fun serialize(output: OutputStream) {
                output.write(TYPE_IOS_SPECIFIC)
                output.writeLengthDelimitedRecord(publicKey)
                output.writeLengthDelimitedRecord(attestation)
            }
        }

        class AndroidSpecific(val chain: List<Certificate>) : AuthAttestation {

            companion object {
                fun deserialize(input: InputStream): AndroidSpecific {
                    val chain = mutableListOf<Certificate>().apply {
                        deserialize(input)
                    }
                    return AndroidSpecific(chain)
                }
            }

            override fun serialize(output: OutputStream) {
                output.write(TYPE_ANDROID_SPECIFIC)
                chain.serialize(output)
            }
        }

        class CertificateChain(val chain: List<Certificate>) : AuthAttestation {

            companion object {
                fun deserialize(input: InputStream): CertificateChain {
                    val chain = mutableListOf<Certificate>().apply {
                        deserialize(input)
                    }
                    return CertificateChain(chain)
                }
            }

            override fun serialize(output: OutputStream) {
                output.write(TYPE_CERTIFICATE)
                chain.serialize(output)
            }
        }
    }
}
