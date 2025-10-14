package com.snap.spectacles.kit.stream.utils

import com.snap.spectacles.kit.KitBaseTest
import org.junit.Test
import org.junit.runner.RunWith
import org.junit.runners.JUnit4
import org.mockito.kotlin.mock
import org.mockito.kotlin.verify

@RunWith(JUnit4::class)
class CompositeCallbackTest : KitBaseTest() {

    @Test
    fun `constructor()`() {
        val r1 = mock<() -> Unit>()
        val r2 = mock<() -> Unit>()
        val subject = CompositeCallback(r1, r2)
        subject.invoke()
        verify(r1).invoke()
        verify(r2).invoke()
    }

    @Test
    fun `add()`() {
        val r1 = mock<() -> Unit>()
        val r2 = mock<() -> Unit>()
        val subject = CompositeCallback()
        subject.add(r1)
        subject.add(r2)
        subject.invoke()
        verify(r1).invoke()
        verify(r2).invoke()
    }

    @Test
    fun `constructor() + add()`() {
        val r1 = mock<() -> Unit>()
        val r2 = mock<() -> Unit>()
        val subject = CompositeCallback(r1)
        subject.add(r2)
        subject.invoke()
        verify(r1).invoke()
        verify(r2).invoke()
    }
}
