package com.snap.spectacles.kit.stream.smkp

import com.snap.spectacles.kit.KitBaseTest
import com.snap.spectacles.kit.stream.SpectaclesStreamException
import com.snap.spectacles.kit.stream.utils.SpectaclesStreamBytesPayload
import com.snap.spectacles.kit.stream.utils.readBytes
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import org.junit.runners.JUnit4
import org.mockito.kotlin.argThat
import org.mockito.kotlin.mock
import org.mockito.kotlin.verify
import java.io.ByteArrayInputStream
import java.io.ByteArrayOutputStream

@RunWith(JUnit4::class)
class SmkpMessageTest : KitBaseTest() {

    @Test
    fun `extractMessageType(), EOF`() {
        assertEquals(0, SmkpMessage.extractMessageType(SpectaclesStreamBytesPayload.Empty))
    }

    @Test
    fun `extractMessageType()`() {
        assertEquals(11, SmkpMessage.extractMessageType(SpectaclesStreamBytesPayload(byteArrayOf(11))))
    }

    @Test(expected = SpectaclesStreamException::class)
    fun `unpack(), type missing`() {
        SmkpMessage.unpack(SpectaclesStreamBytesPayload.Empty)
    }

    @Test
    fun `unpack(), request`() {
        val bytes = byteArrayOf(
            13,
            2, 'p'.code.toByte(), 't'.code.toByte(),
            5, 1, 'a'.code.toByte(), 2, 'x'.code.toByte(), 'y'.code.toByte(),
            2, 1, 2
        )
        val message = SmkpMessage.unpack(SpectaclesStreamBytesPayload(bytes))
        assertTrue(message is SmkpMessage.Request)
    }

    @Test
    fun `unpack(), response`() {
        val bytes = byteArrayOf(
            33,
            10,
            5, 1, 'a'.code.toByte(), 2, 'x'.code.toByte(), 'y'.code.toByte(),
            2, 1, 2
        )
        val message = SmkpMessage.unpack(SpectaclesStreamBytesPayload(bytes))
        assertTrue(message is SmkpMessage.Response)
    }

    @Test(expected = SpectaclesStreamException::class)
    fun `Request deserialize(), path missing`() {
        SmkpMessage.Request.deserialize(13, ByteArrayInputStream(byteArrayOf()))
    }

    @Test(expected = SpectaclesStreamException::class)
    fun `Request deserialize(), body missing`() {
        SmkpMessage.Request.deserialize(13, ByteArrayInputStream(byteArrayOf(0, 0)))
    }

    @Test
    fun `Request deserialize()`() {
        val bytes = byteArrayOf(
            2, 'p'.code.toByte(), 't'.code.toByte(),
            5, 1, 'a'.code.toByte(), 2, 'x'.code.toByte(), 'y'.code.toByte(),
            2, 1, 2
        )
        val request = SmkpMessage.Request.deserialize(13, ByteArrayInputStream(bytes))
        assertEquals(13, request.type)
        assertEquals("pt", request.path)
        assertEquals(1, request.header.count())
        assertEquals(2, request.body.size)
    }

    @Test
    fun `Request pack()`() {
        val header = SmkpMessage.Header().apply { add("a", "xy") }
        val body = SpectaclesStreamBytesPayload(byteArrayOf(1, 2))
        val request = SmkpMessage.Request(13, "pt", header, body).pack()
        val bytes = request.getInputStream().use {
            it.readBytes(request.size)
        }
        assertTrue(
            byteArrayOf(
                13,
                2, 'p'.code.toByte(), 't'.code.toByte(),
                5, 1, 'a'.code.toByte(), 2, 'x'.code.toByte(), 'y'.code.toByte(),
                2, 1, 2
            ).contentEquals(bytes)
        )
    }

    @Test
    fun `Request toString()`() {
        val header = SmkpMessage.Header().apply { add("a", "xy") }
        val body = SpectaclesStreamBytesPayload(byteArrayOf(1, 2))
        SmkpMessage.Request(13, "pt", header, body).toString()
    }

    @Test(expected = SpectaclesStreamException::class)
    fun `Response deserialize(), status missing`() {
        SmkpMessage.Response.deserialize(33, ByteArrayInputStream(byteArrayOf()))
    }

    @Test(expected = SpectaclesStreamException::class)
    fun `Response deserialize(), body missing`() {
        SmkpMessage.Response.deserialize(33, ByteArrayInputStream(byteArrayOf(0, 0)))
    }

    @Test
    fun `Response deserialize()`() {
        val bytes = byteArrayOf(
            10,
            5, 1, 'a'.code.toByte(), 2, 'x'.code.toByte(), 'y'.code.toByte(),
            2, 1, 2
        )
        val response = SmkpMessage.Response.deserialize(33, ByteArrayInputStream(bytes))
        assertEquals(33, response.type)
        assertEquals(10, response.status)
        assertEquals(1, response.header.count())
        assertEquals(2, response.body.size)
    }

    @Test
    fun `Response pack()`() {
        val header = SmkpMessage.Header().apply { add("a", "xy") }
        val body = SpectaclesStreamBytesPayload(byteArrayOf(1, 2))
        val response = SmkpMessage.Response(33, 10, header, body).pack()
        val bytes = response.getInputStream().use {
            it.readBytes(response.size)
        }
        assertTrue(
            byteArrayOf(
                33,
                10,
                5, 1, 'a'.code.toByte(), 2, 'x'.code.toByte(), 'y'.code.toByte(),
                2, 1, 2
            ).contentEquals(bytes)
        )
    }

    @Test
    fun `Response toString()`() {
        val header = SmkpMessage.Header().apply { add("a", "xy") }
        val body = SpectaclesStreamBytesPayload(byteArrayOf(1, 2))
        SmkpMessage.Response(33, 10, header, body).toString()
    }

    @Test
    fun `Header deserialize(), EOF`() {
        val header = SmkpMessage.Header.deserialize(ByteArrayInputStream(byteArrayOf(0)))
        assertEquals(0, header.count())
    }

    @Test
    fun `Header deserialize()`() {
        val header = SmkpMessage.Header.deserialize(
            ByteArrayInputStream(byteArrayOf(4, 1, 'a'.code.toByte(), 1, 's'.code.toByte()))
        )
        assertEquals(1, header.count())
    }

    @Test
    fun `Header get()`() {
        val header = SmkpMessage.Header(
            mutableListOf(SmkpMessage.KeyValue("a", byteArrayOf(1)))
        )
        assertTrue(header.get("a")!!.getValue().contentEquals(byteArrayOf(1)))
    }

    @Test
    fun `Header get(), null`() {
        val header = SmkpMessage.Header(
            mutableListOf(SmkpMessage.KeyValue("a", byteArrayOf(1)))
        )
        assertEquals(null, header.get("b"))
    }

    @Test
    fun `Header add(), bytes`() {
        val list = mock<MutableList<SmkpMessage.KeyValue>>()
        val header = SmkpMessage.Header(list)
        header.add("a", byteArrayOf(1))
        verify(list).add(
            argThat {
                this.getKey() == "a" && this.getValue().contentEquals(byteArrayOf(1))
            }
        )
    }

    @Test
    fun `Header add(), int`() {
        val list = mock<MutableList<SmkpMessage.KeyValue>>()
        val header = SmkpMessage.Header(list)
        header.add("a", 2)
        verify(list).add(
            argThat {
                this.getKey() == "a" && this.getValue().contentEquals(byteArrayOf(2))
            }
        )
    }

    @Test
    fun `Header add(), string`() {
        val list = mock<MutableList<SmkpMessage.KeyValue>>()
        val header = SmkpMessage.Header(list)
        header.add("a", "s")
        verify(list).add(
            argThat {
                this.getKey() == "a" && this.getValue().contentEquals(byteArrayOf('s'.code.toByte()))
            }
        )
    }

    @Test
    fun `Header remove()`() {
        val header = SmkpMessage.Header(
            mutableListOf(SmkpMessage.KeyValue("a", byteArrayOf(1)))
        )
        header.remove("a")
        assertEquals(0, header.count())
    }

    @Test
    fun `Header remove(), non-existent`() {
        val header = SmkpMessage.Header(
            mutableListOf(SmkpMessage.KeyValue("a", byteArrayOf(1)))
        )
        header.remove("b")
        assertEquals(1, header.count())
    }

    @Test
    fun `Header toString()`() {
        SmkpMessage.Header(mutableListOf(SmkpMessage.KeyValue("a", byteArrayOf(1)))).toString()
    }

    @Test
    fun `KeyValue deserialize(), EOF`() {
        assertEquals(null, SmkpMessage.KeyValue.deserialize(ByteArrayInputStream(byteArrayOf())))
    }

    @Test(expected = SpectaclesStreamException::class)
    fun `KeyValue deserialize(), missing value`() {
        SmkpMessage.KeyValue.deserialize(ByteArrayInputStream(byteArrayOf(1, 'a'.code.toByte())))
    }

    @Test
    fun `KeyValue deserialize()`() {
        val keyValue = SmkpMessage.KeyValue.deserialize(
            ByteArrayInputStream(byteArrayOf(1, 'a'.code.toByte(), 1, 's'.code.toByte()))
        )
        assertEquals("a", keyValue!!.getKey())
        assertEquals("s", keyValue.getStringValue())
    }

    @Test
    fun `KeyValue serialize()`() {
        val buf = ByteArrayOutputStream()
        val keyValue = SmkpMessage.KeyValue("k", byteArrayOf(1, 2))
        keyValue.serialize(buf)
        assertTrue(buf.toByteArray().contentEquals(byteArrayOf(1, 'k'.code.toByte(), 2, 1, 2)))
    }

    @Test
    fun `KeyValue getKey()`() {
        val keyValue = SmkpMessage.KeyValue("k1", byteArrayOf())
        assertEquals("k1", keyValue.getKey())
    }

    @Test
    fun `KeyValue getValue()`() {
        val value = byteArrayOf(0, 1, 2)
        val keyValue = SmkpMessage.KeyValue("k1", value)
        assertEquals(value, keyValue.getValue())
    }

    @Test
    fun `KeyValue getStringValue()`() {
        val value = "hello".toByteArray(Charsets.UTF_8)
        val keyValue = SmkpMessage.KeyValue("k1", value)
        assertEquals("hello", keyValue.getStringValue())
    }

    @Test
    fun `KeyValue getIntValue()`() {
        val value = byteArrayOf(33)
        val keyValue = SmkpMessage.KeyValue("k1", value)
        assertEquals(33, keyValue.getIntValue())
    }

    @Test
    fun `KeyValue toString()`() {
        SmkpMessage.KeyValue("k", byteArrayOf(1, 2)).toString()
    }
}