package com.snap.spectacles.kit.stream.smkp

import com.snap.spectacles.kit.KitBaseTest
import com.snap.spectacles.kit.stream.SpectaclesStreamTrustManager
import org.junit.Assert.assertEquals
import org.junit.Test
import org.junit.runner.RunWith
import org.junit.runners.JUnit4
import org.mockito.kotlin.mock

@RunWith(JUnit4::class)
class SmkpLensTokenManagerTest : KitBaseTest() {

    private val subject = SmkpLensTokenManager()

    @Test
    fun `getToken(null), with 0`() {
        assertEquals(null, subject.getToken(null))
    }

    @Test
    fun `getToken(null), with 1`() {
        val token = mock<SpectaclesStreamTrustManager.LensProvision>()
        subject.addToken("s", token)
        assertEquals(token, subject.getToken(null))
    }

    @Test
    fun `getToken(null), with 2`() {
        val token1 = mock<SpectaclesStreamTrustManager.LensProvision>()
        subject.addToken("s", token1)
        val token2 = mock<SpectaclesStreamTrustManager.LensProvision>()
        subject.addToken("a", token2)
        assertEquals(token2, subject.getToken(null))
    }

    @Test
    fun `addToken(), 1`() {
        val token = mock<SpectaclesStreamTrustManager.LensProvision>()
        subject.addToken("s", token)
        assertEquals(token, subject.getToken("s"))
    }

    @Test
    fun `addToken(), 2`() {
        val token1 = mock<SpectaclesStreamTrustManager.LensProvision>()
        subject.addToken("s", token1)
        val token2 = mock<SpectaclesStreamTrustManager.LensProvision>()
        subject.addToken("s", token2)
        assertEquals(token2, subject.getToken("s"))
    }

    @Test
    fun `getToken(null), default`() {
        val token = mock<SpectaclesStreamTrustManager.LensProvision>()
        val subject = SmkpLensTokenManager(token)
        assertEquals(token, subject.getToken(null))
    }
}
