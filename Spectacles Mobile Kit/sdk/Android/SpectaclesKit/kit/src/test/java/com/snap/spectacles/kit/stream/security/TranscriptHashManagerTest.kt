package com.snap.spectacles.kit.stream.security

import com.snap.spectacles.kit.KitBaseTest
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.junit.runners.JUnit4
import org.mockito.kotlin.clearInvocations
import org.mockito.kotlin.doReturn
import org.mockito.kotlin.mock
import org.mockito.kotlin.verify
import org.mockito.kotlin.verifyNoMoreInteractions
import java.security.MessageDigest

@RunWith(JUnit4::class)
class TranscriptHashManagerTest : KitBaseTest() {

    private val clone = mock<MessageDigest> {
        on { digest() } doReturn ByteArray(0)
    }
    private val digest = mock<MessageDigest> {
        on { clone() } doReturn clone
        on { digest() } doReturn ByteArray(1)
    }

    private val subject = TranscriptHashManager.Default(digest)

    @Before
    fun setup() {
        clearInvocations(digest)
    }

    @Test
    fun `add()`() {
        val message = ByteArray(2)
        subject.add(message)
        verify(digest).update(message)
        verifyNoMoreInteractions(digest)
    }

    @Test
    fun `update()`() {
        subject.update()
        verify(digest).clone()
        verifyNoMoreInteractions(digest)
        verify(clone).digest()
    }

    @Test
    fun `hash()`() {
        subject.hash()
        verifyNoMoreInteractions(digest)
    }
}
