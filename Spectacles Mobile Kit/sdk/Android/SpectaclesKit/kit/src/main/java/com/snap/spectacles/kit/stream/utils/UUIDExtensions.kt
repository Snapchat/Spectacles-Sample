package com.snap.spectacles.kit.stream.utils

import java.nio.ByteBuffer
import java.util.UUID

/**
 * Converts this [UUID] to a 16-byte [ByteArray].
 */
fun UUID.toByteArray(): ByteArray = ByteBuffer.allocate(16)
    .putLong(mostSignificantBits)
    .putLong(leastSignificantBits)
    .array()

/**
 * Converts a [UUID] string to a 16-byte  [ByteArray].
 * The string must be in the standard UUID format.
 */
fun String.toUuidByteArray(): ByteArray = UUID.fromString(this).toByteArray()
