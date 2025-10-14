package com.snap.spectacles.kit.core

import android.content.Context
import com.snap.spectacles.kit.KitBaseTest
import com.snap.spectacles.kit.SpectaclesKit
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.junit.runner.RunWith
import org.junit.runners.JUnit4
import org.mockito.kotlin.any
import org.mockito.kotlin.doAnswer
import org.mockito.kotlin.doReturn
import org.mockito.kotlin.mock
import java.io.Closeable
import java.util.concurrent.Executor
import java.util.function.Consumer

private const val TEST_IDENTIFIER = "identifier"

@RunWith(JUnit4::class)
class DefaultSpectaclesKitTest : KitBaseTest() {

    private val context: Context = mock()
    private val bondingIdentifier = BondingIdentifier("id", "addr", "dev")
    private val bonding: SpectaclesBonding = mock {
        on { identifier } doReturn bondingIdentifier
    }
    private val allBondings = mutableMapOf(TEST_IDENTIFIER to bonding)
    private val bondingRepository: BondingRepository = mock {
        on { getAllBondings() } doReturn allBondings.values.toList()
        on { getBonding(any()) } doAnswer {
            allBondings[it.arguments.first() as String]
        }
        on { deleteBonding(any()) } doAnswer {
            allBondings.remove(it.arguments.first() as String)
            Unit
        }
    }

    private val unbindingProcessor = mock<UnbindingProcessor> {
        on { unbind(any(), any()) } doAnswer {
            it.getArgument<Consumer<UnbindingProcessor.Response>>(1).accept(
                UnbindingProcessor.Response.Unbind.Success
            )
            Closeable { }
        }
    }

    private val dependencies: DefaultSpectaclesKit.Dependencies = mock {
        on { bondingRepository } doReturn bondingRepository
        on { unbindingProcessor } doReturn unbindingProcessor
    }
    private val executor: Executor = mock()
    private val subject = DefaultSpectaclesKit(
        context = context,
        clientIdentifier = SpectaclesKit.ClientIdentifier("clientIdentifier"),
        clientVersion = "0.1",
        executor = executor,
        dependencies = dependencies,
    )

    @Test
    fun `availableBondings, match`() {
        val result = subject.availableBondings()
        assertThat(result).containsExactly(bonding)
    }

    @Test
    fun `getBonding, match`() {
        val result = subject.getBonding(TEST_IDENTIFIER)
        assertThat(result).isEqualTo(bonding)
    }

    @Test
    fun `getBonding, NOT match`() {
        val result = subject.getBonding("${TEST_IDENTIFIER}2")
        assertThat(result).isNull()
    }

    @Test
    fun `unbind, call deleteBonding`() {
        subject.unbind(TEST_IDENTIFIER, {}, true)
        assertThat(allBondings).isEmpty()
    }
}
