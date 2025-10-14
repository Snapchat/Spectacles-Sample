package com.snap.spectacles.kit

import android.content.Context
import com.snap.spectacles.kit.core.DefaultSpectaclesKit

/**
 * Creates a new SpectaclesKit.Builder with the provided context.
 */
fun newBuilder(context: Context): SpectaclesKit.Builder =
    DefaultSpectaclesKit.newBuilder(context)
