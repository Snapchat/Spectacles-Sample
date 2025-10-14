package com.snap.spectacles.kit.core

import android.content.Context
import android.content.SharedPreferences
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
import org.mockito.kotlin.verify
import org.mockito.kotlin.whenever

private const val TEST_IDENTIFIER = "identifier"
private const val TEST_DEVICE_ADDRESS = "device_address"
private const val TEST_DEVICE_ID = "serial_number"
private const val TEST_SERIALIZED_BONDING = "serialized_bonding"
private const val TEST_BONDING_LENS = "sample-lens"

@RunWith(JUnit4::class)
class DefaultBondingRepositoryTest : KitBaseTest() {

    private val bondingIdentifier = BondingIdentifier(
        assignedId = TEST_IDENTIFIER,
        deviceAddress = TEST_DEVICE_ADDRESS,
        deviceId = TEST_DEVICE_ID
    )
    private val bondingRequest = SpectaclesKit.BondingRequest.SingleLens(
        lensId = TEST_BONDING_LENS
    )
    private val serializedIdentifier = "$TEST_DEVICE_ADDRESS#$TEST_IDENTIFIER"
    private val spectaclesBonding = SpectaclesBonding(
        id = serializedIdentifier,
        identifier = bondingIdentifier,
        requested = bondingRequest
    )

    private val editor: SharedPreferences.Editor = mock {
        on { putString(any(), any()) } doReturn this.mock
        on { remove(any()) } doReturn this.mock
        on { apply() } doAnswer {}
    }
    private val prefs: SharedPreferences = mock {
        on { all } doReturn mapOf(serializedIdentifier to TEST_SERIALIZED_BONDING)
        on { edit() } doReturn editor
    }
    private val context: Context = mock {
        on { getSharedPreferences(any(), any()) } doReturn prefs
    }
    private val serializer: SpectaclesBondingSerializer = mock {
        on { serialize(spectaclesBonding) } doReturn TEST_SERIALIZED_BONDING
        on { deserialize(TEST_SERIALIZED_BONDING) } doReturn spectaclesBonding
    }

    private val subject = DefaultBondingRepository(
        context = context,
        serializer = serializer,
    )

    @Test
    fun `getBonding, found`() {
        val result = subject.getBonding(serializedIdentifier)

        assertThat(result).isEqualTo(spectaclesBonding)
    }

    @Test
    fun `getBonding, not found`() {
        val result = subject.getBonding("${TEST_DEVICE_ADDRESS}#INVALID")

        assertThat(result).isNull()
    }

    @Test
    fun `getAllBondings, match`() {
        val result = subject.getAllBondings()

        assertThat(result).containsExactly(spectaclesBonding)
    }

    @Test
    fun `getAllBondings, none`() {
        whenever(prefs.all).thenReturn(emptyMap())
        val result = subject.getAllBondings()

        assertThat(result).isEmpty()
    }

    @Test
    fun `saveBonding, update prefs`() {
        subject.saveBonding(spectaclesBonding)

        verify(editor).putString(serializedIdentifier, TEST_SERIALIZED_BONDING)
    }

    @Test
    fun `deleteBonding, remove from prefs`() {
        subject.deleteBonding(serializedIdentifier)

        verify(editor).remove(serializedIdentifier)
    }
}
