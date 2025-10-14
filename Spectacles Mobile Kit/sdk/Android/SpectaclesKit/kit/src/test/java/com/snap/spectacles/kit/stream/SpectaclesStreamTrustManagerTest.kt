package com.snap.spectacles.kit.stream

import com.snap.spectacles.kit.KitBaseTest
import org.junit.Test
import org.junit.runner.RunWith
import org.junit.runners.JUnit4
import org.mockito.kotlin.mock
import org.mockito.kotlin.whenever

@RunWith(JUnit4::class)
class SpectaclesStreamTrustManagerTest : KitBaseTest() {

    private val peer = mock<SpectaclesStreamTrustManager.SecurityAttributes>()

    @Test
    fun `Noop, validatePeerTrust()`() {
        SpectaclesStreamTrustManager.Noop.validatePeerTrust(mock())
    }

    @Test
    fun `Noop, validateLensTrust()`() {
        SpectaclesStreamTrustManager.Noop.validateLensTrust(mock())
    }

    @Test
    fun `Default(), validatePeerTrust(), SPECTACLES`() {
        whenever(peer.deviceType).thenReturn(SpectaclesStreamTrustManager.DeviceType.SPECTACLES)

        val subject = SpectaclesStreamTrustManager.Default(SpectaclesStreamTrustManager.Default.SPECTACLES_PROD)
        subject.validatePeerTrust(peer)
    }

    @Test(expected = SpectaclesStreamException::class)
    fun `Default(), validatePeerTrust(), SPECTACLES_UNFUSED`() {
        whenever(peer.deviceType).thenReturn(SpectaclesStreamTrustManager.DeviceType.SPECTACLES_UNFUSED)

        val subject = SpectaclesStreamTrustManager.Default(SpectaclesStreamTrustManager.Default.SPECTACLES_PROD)
        subject.validatePeerTrust(peer)
    }

    @Test(expected = SpectaclesStreamException::class)
    fun `Default(), validatePeerTrust(), ANDROID`() {
        whenever(peer.deviceType).thenReturn(SpectaclesStreamTrustManager.DeviceType.ANDROID)

        val subject = SpectaclesStreamTrustManager.Default(SpectaclesStreamTrustManager.Default.SPECTACLES_PROD)
        subject.validatePeerTrust(peer)
    }

    @Test(expected = SpectaclesStreamException::class)
    fun `Default(), validatePeerTrust(), IOS`() {
        whenever(peer.deviceType).thenReturn(SpectaclesStreamTrustManager.DeviceType.IOS)

        val subject = SpectaclesStreamTrustManager.Default(SpectaclesStreamTrustManager.Default.SPECTACLES_PROD)
        subject.validatePeerTrust(peer)
    }

    @Test(expected = SpectaclesStreamException::class)
    fun `Default(), validatePeerTrust(), UNKNOWN`() {
        whenever(peer.deviceType).thenReturn(SpectaclesStreamTrustManager.DeviceType.UNKNOWN)

        val subject = SpectaclesStreamTrustManager.Default(SpectaclesStreamTrustManager.Default.SPECTACLES_PROD)
        subject.validatePeerTrust(peer)
    }

    @Test
    fun `Default(SPECTACLES_ALL), validatePeerTrust(), SPECTACLES`() {
        whenever(peer.deviceType).thenReturn(SpectaclesStreamTrustManager.DeviceType.SPECTACLES)

        val subject = SpectaclesStreamTrustManager.Default(SpectaclesStreamTrustManager.Default.SPECTACLES_ALL)
        subject.validatePeerTrust(peer)
    }

    @Test
    fun `Default(SPECTACLES_ALL), validatePeerTrust(), SPECTACLES_UNFUSED`() {
        whenever(peer.deviceType).thenReturn(SpectaclesStreamTrustManager.DeviceType.SPECTACLES_UNFUSED)

        val subject = SpectaclesStreamTrustManager.Default(SpectaclesStreamTrustManager.Default.SPECTACLES_ALL)
        subject.validatePeerTrust(peer)
    }

    @Test(expected = SpectaclesStreamException::class)
    fun `Default(SPECTACLES_ALL), validatePeerTrust(), ANDROID`() {
        whenever(peer.deviceType).thenReturn(SpectaclesStreamTrustManager.DeviceType.ANDROID)

        val subject = SpectaclesStreamTrustManager.Default(SpectaclesStreamTrustManager.Default.SPECTACLES_ALL)
        subject.validatePeerTrust(peer)
    }

    @Test(expected = SpectaclesStreamException::class)
    fun `Default(SPECTACLES_ALL), validatePeerTrust(), IOS`() {
        whenever(peer.deviceType).thenReturn(SpectaclesStreamTrustManager.DeviceType.IOS)

        val subject = SpectaclesStreamTrustManager.Default(SpectaclesStreamTrustManager.Default.SPECTACLES_ALL)
        subject.validatePeerTrust(peer)
    }

    @Test(expected = SpectaclesStreamException::class)
    fun `Default(SPECTACLES_ALL), validatePeerTrust(), UNKNOWN`() {
        whenever(peer.deviceType).thenReturn(SpectaclesStreamTrustManager.DeviceType.UNKNOWN)

        val subject = SpectaclesStreamTrustManager.Default(SpectaclesStreamTrustManager.Default.SPECTACLES_ALL)
        subject.validatePeerTrust(peer)
    }

    @Test
    fun `Default(PEERS_ALL), validatePeerTrust(), SPECTACLES`() {
        whenever(peer.deviceType).thenReturn(SpectaclesStreamTrustManager.DeviceType.SPECTACLES)

        val subject = SpectaclesStreamTrustManager.Default(SpectaclesStreamTrustManager.Default.PEERS_ALL)
        subject.validatePeerTrust(peer)
    }

    @Test
    fun `Default(PEERS_ALL), validatePeerTrust(), SPECTACLES_UNFUSED`() {
        whenever(peer.deviceType).thenReturn(SpectaclesStreamTrustManager.DeviceType.SPECTACLES_UNFUSED)

        val subject = SpectaclesStreamTrustManager.Default(SpectaclesStreamTrustManager.Default.PEERS_ALL)
        subject.validatePeerTrust(peer)
    }

    @Test
    fun `Default(PEERS_ALL), validatePeerTrust(), ANDROID`() {
        whenever(peer.deviceType).thenReturn(SpectaclesStreamTrustManager.DeviceType.ANDROID)

        val subject = SpectaclesStreamTrustManager.Default(SpectaclesStreamTrustManager.Default.PEERS_ALL)
        subject.validatePeerTrust(peer)
    }

    @Test
    fun `Default(PEERS_ALL), validatePeerTrust(), IOS`() {
        whenever(peer.deviceType).thenReturn(SpectaclesStreamTrustManager.DeviceType.IOS)

        val subject = SpectaclesStreamTrustManager.Default(SpectaclesStreamTrustManager.Default.PEERS_ALL)
        subject.validatePeerTrust(peer)
    }

    @Test
    fun `Default(PEERS_ALL), validatePeerTrust(), UNKNOWN`() {
        whenever(peer.deviceType).thenReturn(SpectaclesStreamTrustManager.DeviceType.UNKNOWN)

        val subject = SpectaclesStreamTrustManager.Default(SpectaclesStreamTrustManager.Default.PEERS_ALL)
        subject.validatePeerTrust(peer)
    }

    @Test
    fun `Default(), validateLensTrust(), source = bbg`() {
        val lens = SpectaclesStreamTrustManager.LensProvision("test-lens-id", "", "", "bbg")

        val subject = SpectaclesStreamTrustManager.Default()
        subject.validateLensTrust(lens)
    }

    @Test
    fun `Default(), validateLensTrust(), source = push`() {
        val lens = SpectaclesStreamTrustManager.LensProvision("test-lens-id", "", "", "push")

        val subject = SpectaclesStreamTrustManager.Default()
        subject.validateLensTrust(lens)
    }

    @Test
    fun `Default(test-lens-id), validateLensTrust(test-lens-id), source = bbg`() {
        val lens = SpectaclesStreamTrustManager.LensProvision("test-lens-id", "", "", "bbg")

        val subject = SpectaclesStreamTrustManager.Default(trustedLenses = setOf("test-lens-id"))
        subject.validateLensTrust(lens)
    }

    @Test(expected = SpectaclesStreamException::class)
    fun `Default(test-lens-id), validateLensTrust(test-lens), source = push`() {
        val lens = SpectaclesStreamTrustManager.LensProvision("test-lens", "", "", "push")

        val subject = SpectaclesStreamTrustManager.Default(trustedLenses = setOf("test-lens-id"))
        subject.validateLensTrust(lens)
    }

    @Test(expected = SpectaclesStreamException::class)
    fun `Default(test-lens-id), validateLensTrust(test-lens-id), source = push`() {
        val lens = SpectaclesStreamTrustManager.LensProvision("test-lens-id", "", "", "push")

        val subject = SpectaclesStreamTrustManager.Default(trustedLenses = setOf("test-lens-id"))
        subject.validateLensTrust(lens)
    }
}
