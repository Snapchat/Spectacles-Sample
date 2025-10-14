package com.snap.spectacles.kit.core

import com.snap.spectacles.kit.KitBaseTest
import com.snap.spectacles.kit.SpectaclesKit
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.junit.runner.RunWith
import org.junit.runners.JUnit4
import org.mockito.kotlin.doReturn
import org.mockito.kotlin.mock
import org.mockito.kotlin.whenever

private const val TEST_IDENTIFIER = "identifier"
private const val TEST_DEVICE_ADDRESS = "device_address"
private const val TEST_DEVICE_ID = "serial_number"
private const val TEST_BONDING_LENS = "sample-lens"
private const val TEST_SERIALIZED_REQUEST = "serialized sample-lens"

@RunWith(JUnit4::class)
class DefaultSpectaclesBondingSerializerTest : KitBaseTest() {

    private val bondingIdentifier = BondingIdentifier(
        assignedId = TEST_IDENTIFIER,
        deviceAddress = TEST_DEVICE_ADDRESS,
        deviceId = TEST_DEVICE_ID
    )
    private val serializedIdentifier = "$TEST_DEVICE_ADDRESS#$TEST_IDENTIFIER"
    private val identifierSerializer: Serializer<BondingIdentifier, String> = mock {
        on { serialize(bondingIdentifier) } doReturn serializedIdentifier
        on { deserialize(serializedIdentifier) } doReturn bondingIdentifier
    }

    private val bondingRequest = SpectaclesKit.BondingRequest.SingleLens(
        lensId = TEST_BONDING_LENS
    )
    private val bondingRequestSerializer: Serializer<SpectaclesKit.BondingRequest, String> = mock {
        on { serialize(bondingRequest) } doReturn TEST_SERIALIZED_REQUEST
        on { deserialize(TEST_SERIALIZED_REQUEST) } doReturn bondingRequest
    }

    private val spectaclesBonding = SpectaclesBonding(
        id = serializedIdentifier,
        identifier = bondingIdentifier,
        requested = bondingRequest
    )

    private val subject = DefaultSpectaclesBondingSerializer(
        identifierSerializer = { identifierSerializer },
        requestSerializer = { bondingRequestSerializer },
    )

    @Test
    fun `serialize, deserialize`() {
        val serialized = subject.serialize(spectaclesBonding)
        val deserialized = subject.deserialize(serialized)

        assertThat(spectaclesBonding).isEqualTo(deserialized)
    }

    @Test(expected = IllegalArgumentException::class)
    fun `serialize, identifier exception, expect exception`() {
        whenever(identifierSerializer.serialize(bondingIdentifier))
            .thenThrow(IllegalArgumentException())

        subject.serialize(spectaclesBonding)
    }

    @Test(expected = IllegalArgumentException::class)
    fun `serialize, request exception, expect exception`() {
        whenever(bondingRequestSerializer.serialize(bondingRequest))
            .thenThrow(IllegalArgumentException())

        subject.serialize(spectaclesBonding)
    }

    @Test(expected = IllegalArgumentException::class)
    fun `deserialize, invalid identifier, expect exception`() {
        val serialized = subject.serialize(spectaclesBonding)
        val invalidSerialized = serialized.replace(TEST_IDENTIFIER, "invalid")

        subject.deserialize(invalidSerialized)
    }

    @Test(expected = IllegalArgumentException::class)
    fun `deserialize, invalid raw string, expect exception`() {
        val invalidSerialized = "invalid-json"

        subject.deserialize(invalidSerialized)
    }
}
