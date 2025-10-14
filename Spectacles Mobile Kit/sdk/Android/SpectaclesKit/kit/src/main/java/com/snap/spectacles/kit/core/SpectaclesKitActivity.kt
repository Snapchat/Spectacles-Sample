package com.snap.spectacles.kit.core

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import androidx.activity.result.contract.ActivityResultContracts
import androidx.core.app.ActivityOptionsCompat
import com.snap.spectacles.kit.R

class SpectaclesKitActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val action = intent.getStringExtra(SPECTACLES_KIT_EXTRA_ACTION) ?: return finish()
        val specsPackage = intent.getStringExtra(SPECTACLES_KIT_EXTRA_PACKAGE) ?: return finish()
        val requestIntent = Intent(action).apply {
            val bundle = intent.extras
                ?.apply {
                    remove(SPECTACLES_KIT_EXTRA_ACTION)
                    remove(SPECTACLES_KIT_EXTRA_PACKAGE)
                }
                ?: Bundle()
            setPackage(specsPackage)
            putExtras(bundle)
        }

        val resultLauncher = registerForActivityResult(
            ActivityResultContracts.StartActivityForResult()
        ) { result ->
            result.data?.action = action
            val observer = ActivityDependencies.activityResultObserver()
            if (result.resultCode == RESULT_OK) {
                observer?.onSuccess(result.data)
            } else {
                observer?.onFailure(result.data)
            }
            finishAfterTransition()
        }

        val options = ActivityOptionsCompat
            .makeCustomAnimation(
                this,
                R.anim.slide_in_right,  // Animation for the new activity slide in
                R.anim.slide_out_left   // Animation for the old activity slide out
            )

        try {
            resultLauncher.launch(requestIntent, options)
        } catch (e: Exception) {
            ActivityDependencies.activityResultObserver()?.onFailure(null)
            finishAfterTransition()
        }
    }
}
