package com.snap.spectacles.kit.sample

import android.content.Context
import androidx.appcompat.app.AlertDialog

fun Context.alert(title: String, message: String) {
    AlertDialog.Builder(this)
        .run {
            setTitle(title)
            setMessage(message)
            setPositiveButton("OK") { dialog, _ ->
                dialog.dismiss()
            }
        }
        .create()
        .show()
}
