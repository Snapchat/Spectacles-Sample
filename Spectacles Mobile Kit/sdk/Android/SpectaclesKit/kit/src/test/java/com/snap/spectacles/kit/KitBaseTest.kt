package com.snap.spectacles.kit

import com.snap.spectacles.kit.util.Log
import com.snap.spectacles.kit.util.LogStub
import org.junit.AfterClass
import org.junit.BeforeClass

open class KitBaseTest {
    companion object {
        @JvmStatic
        @BeforeClass
        fun setup() {
            Log.provider = { _ -> LogStub() }
        }

        @JvmStatic
        @AfterClass
        fun cleanup() {
            Log.provider = null
        }
    }
}
