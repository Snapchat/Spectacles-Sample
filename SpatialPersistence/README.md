# Spatial Persistence Template

![](./README-ref/Example.gif)

This is a template project which uses the Spectacles [Spatial Anchor API](https://developers.snap.com/spectacles/about-spectacles-features/apis/spatial-anchors).

> __NOTE__: 
> This project will only work for the Spectacles platform.

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
In the [Interactive Preview Panel](https://developers.snap.com/lens-studio/lens-studio-workflow/previewing-your-lens#interactive-preview). Click on the **New Area** button in the area selection menu with the left mouse button. A panel will then show up where user can drag different post-it notes to the scene. Click on the **Main Menu** to go back to the area selection menu.

### In Spectacles Device
To install your Lens on your device, refer to the guide provided [here](https://developers.snap.com/spectacles/get-started/start-buiding/test-lens-on-spectacles).

After successfully installing the Lens, Select the **New Area** button with the pinch gesture. The localization process should begin with a prompt text appeared informing the user to look around. After the localization completes, a panel will then show up where user can drag different post-it notes to the scene. Click on the **Main Menu** to go back to the area selection menu. 

#### Spatial Persistence
Exit the lens and open it again. If the same area is selected, the previously created notes will spawn in the same position in the space.

#### Voice Dictation
After a post-in note is created, select the microphone button on the top left corner to enable voice input. Say some words and it will turn into text and appear on the note.

## Key Script

[AreaManager.ts](./Assets/TemplateCode/AreaManager.ts) - This is the primary script that integrates different behaviours with the UI.
[AnchorManager.ts](./Assets/TemplateCode/SpatialPersistence/AnchorManager.ts) - Primary script for managing the anchor behaviours
