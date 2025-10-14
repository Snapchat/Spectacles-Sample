package com.snap.spectacles.kit.sample

import android.content.Context
import androidx.preference.PreferenceManager
import com.snap.spectacles.kit.stream.qlic.QlicConnectionFactory

object DemoSettings {

    enum class Mode {
        MOBILE,
        MOBILE_HARDCODED_SECRET,
        MOBILE_PSEUDO_SECURITY,
    }

    var mode: Mode = Mode.MOBILE
        set(value) {
            field = value
            QlicConnectionFactory.usePseudoSecurityManager =
                value == Mode.MOBILE_PSEUDO_SECURITY
        }

    val hardcodedSecret: Pair<ByteArray, ByteArray>?
        get() = when (mode) {
            Mode.MOBILE_HARDCODED_SECRET ->
                "hardcoded-secret".toByteArray(Charsets.UTF_8) to "0123456789ab".toByteArray(Charsets.UTF_8)
            else -> null
        }

    var skipBonding = false

    var acceptUntrustedLens = true // Shall set to false for production

    var useLensNameBonding = true // Shall set to false for production.

    fun reload(context: Context) {
        val sharedPreferences = PreferenceManager.getDefaultSharedPreferences(context)
        mode = Mode.valueOf(sharedPreferences.getString("mode", Mode.MOBILE.toString())!!)
        skipBonding = sharedPreferences.getBoolean("skip_bonding", skipBonding)
        acceptUntrustedLens = sharedPreferences.getBoolean("skip_attestation", acceptUntrustedLens)
    }
}
