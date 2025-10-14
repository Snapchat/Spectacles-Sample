package com.snap.spectacles.kit.core

import com.snap.spectacles.kit.KitBaseTest
import com.snap.spectacles.kit.SpectaclesKit
import com.snap.spectacles.kit.stream.SpectaclesStreamException
import com.snap.spectacles.kit.stream.SpectaclesStreamTrustManager
import org.junit.Test
import org.junit.runner.RunWith
import org.junit.runners.JUnit4
import org.mockito.kotlin.doReturn
import org.mockito.kotlin.mock
import org.mockito.kotlin.whenever

@RunWith(JUnit4::class)
class DefaultSpectaclesStreamTrustManagerTest : KitBaseTest() {

    private val requested = SpectaclesKit.BondingRequest.SingleLens("test-lens-id")
    private val bonding = mock<SpectaclesBonding> {
        on { requested } doReturn requested
    }

    private val peer = mock<SpectaclesStreamTrustManager.SecurityAttributes>()

    @Test
    fun `validatePeerTrust(), SPECTACLES, acceptUnfusedSpectacles = false`() {
        whenever(peer.deviceType).thenReturn(SpectaclesStreamTrustManager.DeviceType.SPECTACLES)
        val config = SpectaclesKit.SessionRequest.Default(
            acceptUnfusedSpectacles = false
        )
        val subject = DefaultSpectaclesStreamTrustManager(bonding, config)
        subject.validatePeerTrust(peer)
    }

    @Test(expected = SpectaclesStreamException::class)
    fun `validatePeerTrust(), SPECTACLES_UNFUSED, acceptUnfusedSpectacles = false`() {
        whenever(peer.deviceType).thenReturn(SpectaclesStreamTrustManager.DeviceType.SPECTACLES_UNFUSED)
        val config = SpectaclesKit.SessionRequest.Default(
            acceptUnfusedSpectacles = false
        )
        val subject = DefaultSpectaclesStreamTrustManager(bonding, config)
        subject.validatePeerTrust(peer)
    }

    @Test
    fun `validatePeerTrust(), SPECTACLES, acceptUnfusedSpectacles = true`() {
        whenever(peer.deviceType).thenReturn(SpectaclesStreamTrustManager.DeviceType.SPECTACLES)
        val config = SpectaclesKit.SessionRequest.Default(
            acceptUnfusedSpectacles = true
        )
        val subject = DefaultSpectaclesStreamTrustManager(bonding, config)
        subject.validatePeerTrust(peer)
    }

    @Test
    fun `validatePeerTrust(), SPECTACLES_UNFUSED, acceptUnfusedSpectacles = true`() {
        whenever(peer.deviceType).thenReturn(SpectaclesStreamTrustManager.DeviceType.SPECTACLES_UNFUSED)
        val config = SpectaclesKit.SessionRequest.Default(
            acceptUnfusedSpectacles = true
        )
        val subject = DefaultSpectaclesStreamTrustManager(bonding, config)
        subject.validatePeerTrust(peer)
    }

    @Test
    fun `validateLensTrust(), acceptUntrustedLens = false`() {
        val lens = SpectaclesStreamTrustManager.LensProvision("test-lens-id", "", "", "bbg")
        val config = SpectaclesKit.SessionRequest.Default(
            acceptUntrustedLens = false
        )
        val subject = DefaultSpectaclesStreamTrustManager(bonding, config)
        subject.validateLensTrust(lens)
    }

    @Test(expected = SpectaclesStreamException::class)
    fun `validateLensTrust(), acceptUntrustedLens = false, incorrect lens-id`() {
        val lens = SpectaclesStreamTrustManager.LensProvision("abc", "", "", "")
        val config = SpectaclesKit.SessionRequest.Default(
            acceptUntrustedLens = false
        )
        val subject = DefaultSpectaclesStreamTrustManager(bonding, config)
        subject.validateLensTrust(lens)
    }

    @Test(expected = SpectaclesStreamException::class)
    fun `validateLensTrust(), acceptUntrustedLens = false, incorrect source`() {
        val lens = SpectaclesStreamTrustManager.LensProvision("test-lens-id", "", "", "push")
        val config = SpectaclesKit.SessionRequest.Default(
            acceptUntrustedLens = false
        )
        val subject = DefaultSpectaclesStreamTrustManager(bonding, config)
        subject.validateLensTrust(lens)
    }

    @Test
    fun `validateLensTrust(), acceptUntrustedLens = true`() {
        val lens = SpectaclesStreamTrustManager.LensProvision("abc", "", "", "")
        val config = SpectaclesKit.SessionRequest.Default(
            acceptUntrustedLens = true
        )
        val subject = DefaultSpectaclesStreamTrustManager(bonding, config)
        subject.validateLensTrust(lens)
    }
}