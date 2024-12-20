# Shared Value & RGB Control Lens

## Overview
This project showcases a real-time collaborative AR experience where two users adjust a shared numeric value and RGB sliders to control the color of an object in the scene. The system synchronizes all interactions across devices, ensuring seamless collaboration.
This lens leverages the [Spectacles Interaction Kit (SIK)](https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-interaction-kit/get-started) to simplify UI development for Spectacles and demonstrates the potential of [Connected Lenses](https://developers.snap.com/spectacles/about-spectacles-features/connected-lenses/overview) for creating engaging, synchronized AR experiences.

![](./README-ref/SharedSyncControlsExample.gif)

## Prerequisites

Lens Studio: v5.4.0+

Spectacles OS Version: v5.59.218+

Spectacles App iOS: v0.59.1.1+

Spectacles App Android: v0.59.1.1+

To update your Spectacles device and mobile app, please refer to this [guide](https://support.spectacles.com/hc/en-us/articles/30214953982740-Updating).

You can download the latest version of Lens Studio from [here](https://ar.snap.com/download?lang=en-US).

## Getting the project

To obtain the project folder, you need to clone the repository.

> __IMPORTANT__:
> This project uses Git Large Files Support (LFS). Downloading a zip file using the green button on Github
> **will not work**. You must clone the project with a version of git that has LFS.
> You can download Git LFS here: https://git-lfs.github.com/.

## Initial Project Setup

The project should be pre-configured to get you started without any additional steps. However, if you encounter issues in the Logger Panel, please ensure your Lens Studio environment is set up for [Spectacles](https://developers.snap.com/spectacles/get-started/start-buiding/preview-panel).

## Testing the Lens

### In Lens Studio Editor
1. Open the Lens in Lens Studio and create two Interactive Previews using the [Interactive Preview Panel](https://developers.snap.com/lens-studio/lens-studio-workflow/previewing-your-lens#interactive-preview)
2. Click the Multiplayer button for both previews. They will connect to the same session and map surroundings automatically.
3. Test functionality:
   - Adjust the shared numeric value using the "∧" and "v" buttons in one preview and ensure the change reflects instantly in the second preview.
   - Modify the RGB sliders in one preview and confirm the floating object's color updates in both previews in real-time.

### In Spectacles Device
1. Connect two pairs of Spectacles to the same session following the [Playing Connected Lenses Guide](https://developers.snap.com/spectacles/about-spectacles-features/connected-lenses/overview#playing-connected-lenses-on-spectacles).
2. Test functionality:
   - Adjust the shared numeric value on one device and confirm it updates on the other.
   - Use the RGB sliders on one device and ensure the color of the floating object updates in real-time on both devices.

## Key Script

[EntryPointMain.ts](./Assets/SharedSyncControls/Scripts/EntryPointMain/EntryPointMain.ts) - This script serves as the entry point for the Lens logic, initializing and managing the execution of other scripts within the project.
