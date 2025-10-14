package com.snap.spectacles.kit.stream

/**
 * Interface for managing and verifying the trustworthiness of peer devices and applications.
 */
interface SpectaclesStreamTrustManager {

    /**
     * Represents the provision information of a device, detailing its security status and attestation level.
     */
    interface DeviceProvision {

        /**
         * Provisioning information specific to Android devices.
         *
         * @param isDeviceLocked Indicates if the device is locked (true) or unlocked (false).
         * @param verifiedBootState Represents the verified boot state. Expected values:
         *                          0 - Verified
         *                          1 - SelfSigned
         *                          2 - Unverified
         *                          3 - Failed
         * @param attestationVersion Specifies the version of attestation used on the device.
         * @param attestationSecurityLevel Represents the security level of attestation. Expected values:
         *                                 0 - Verified
         *                                 1 - SelfSigned
         *                                 2 - Unverified
         *                                 3 - Failed
         */
        data class Android(
            val isDeviceLocked: Boolean,
            val verifiedBootState: Int,
            val attestationVersion: Int,
            val attestationSecurityLevel: Int,
        ) : DeviceProvision

        data class Ios(
            val osVersion: String,
        ) : DeviceProvision
    }

    /**
     * Represents the provisioning details of an application, including the app's package names
     * and associated signature digests for integrity verification.
     */
    interface ApplicationProvision {

        /**
         * Provisioning information specific to Android applications.
         *
         * @param applicationPackages Map of application package names and their respective versions..
         * @param applicationDigests List of signature digest values for the peer applications.
         */
        data class Android(
            val applicationPackages: Map<String, Int>,
            val applicationDigests: Collection<ByteArray>
        ) : ApplicationProvision

        data class Ios(
            val production: Boolean,
            val applicationDigest: ByteArray
        ) : ApplicationProvision
    }

    /**
     * Represents the provisioning details of a Lens.
     */
    data class LensProvision(
        val lensId: String,
        val version: String,
        val creator: String,
        val source: String
    )

    /**
     * Specifies the device type
     */
    enum class DeviceType {
        UNKNOWN,
        SPECTACLES,
        SPECTACLES_UNFUSED,
        ANDROID,
        IOS
    }

    /**
     * Security attributes about the peer entity, combining device and application provisioning data
     * to support identity verification and trust validation.
     *
     * @property deviceType The category of the device (e.g., mobile, spectacles, etc.).
     * @property deviceProvision The provisioning details specific to the device.
     * @property applicationProvision The provisioning details for the associated application.
     */
    data class SecurityAttributes(
        val deviceType: DeviceType,
        val deviceProvision: DeviceProvision,
        val applicationProvision: ApplicationProvision
    )

    /**
     * Validates the trustworthiness of a peer device and application. This process involves checking
     * the security state of the device and the integrity of the application.
     *
     * @param peer Information about the peer, including device and application provisioning.
     * @throws SpectaclesStreamException if the peer fails the trust validation.
     */
    @Throws(SpectaclesStreamException::class)
    fun validatePeerTrust(peer: SecurityAttributes)

    /**
     * Validates the trustworthiness of a Lens by checking its provisioning details.
     *
     * @param lens Provisioning details of the Lens.
     * @throws SpectaclesStreamException if the Lens fails the trust validation.
     */
    @Throws(SpectaclesStreamException::class)
    fun validateLensTrust(lens: LensProvision)

    /**
     * A placeholder implementation of the SpectaclesStreamTrustManager interface.
     */
    object Noop : SpectaclesStreamTrustManager {
        override fun validatePeerTrust(peer: SecurityAttributes) = Unit
        override fun validateLensTrust(lens: LensProvision) = Unit
    }

    /**
     * Default implementation of the SpectaclesStreamTrustManager interface.
     */
    class Default(
        private val trustedPeers: Set<DeviceType> = SPECTACLES_PROD,
        private val trustedLenses: Set<String> = emptySet()
    ) : SpectaclesStreamTrustManager {

        companion object {
            val SPECTACLES_PROD = setOf(
                DeviceType.SPECTACLES
            )
            val SPECTACLES_ALL = setOf(
                DeviceType.SPECTACLES,
                DeviceType.SPECTACLES_UNFUSED
            )
            val PEERS_ALL = setOf(
                DeviceType.SPECTACLES,
                DeviceType.SPECTACLES_UNFUSED,
                DeviceType.ANDROID,
                DeviceType.IOS,
                DeviceType.UNKNOWN
            )

            private val INSECURE_LENS_SOURCES = setOf(
                "push", "unknown"
            )
        }

        override fun validatePeerTrust(peer: SecurityAttributes) {
            if (!trustedPeers.contains(peer.deviceType)) {
                throw SpectaclesStreamException(SpectaclesStreamException.UNAUTHORIZED, "Untrusted peer: $peer")
            }
        }

        override fun validateLensTrust(lens: LensProvision) {
            if (trustedLenses.isNotEmpty()) {
                if (!trustedLenses.contains(lens.lensId.lowercase()) ||
                    INSECURE_LENS_SOURCES.contains(lens.source.lowercase())
                ) {
                    throw SpectaclesStreamException(SpectaclesStreamException.UNAUTHORIZED, "Untrusted lens:$lens")
                }
            }
        }
    }
}
