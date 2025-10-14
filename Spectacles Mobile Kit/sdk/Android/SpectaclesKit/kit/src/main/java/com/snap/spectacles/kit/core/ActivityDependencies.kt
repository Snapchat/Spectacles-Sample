package com.snap.spectacles.kit.core

import android.content.Intent

object ActivityDependencies {

    interface ActivityResultObserver {

        fun onSuccess(intent: Intent?)

        fun onFailure(intent: Intent?)
    }

    @Volatile
    private var activityResultObserver: ActivityResultObserver? = null

    fun install(observer: ActivityResultObserver) {
        activityResultObserver = observer
    }

    fun activityResultObserver(): ActivityResultObserver? = activityResultObserver
}
