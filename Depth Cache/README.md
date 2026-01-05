# Depth Cache 

[![SIK](https://img.shields.io/badge/SIK-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-interaction-kit/features/overview?) [![Remote Service Gateway](https://img.shields.io/badge/Remote%20Service%20Gateway-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/about-spectacles-features/overview) [![ASR](https://img.shields.io/badge/ASR-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/about-spectacles-features/apis/asr-module) [![AI](https://img.shields.io/badge/AI-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-interaction-kit/features/overview?) [![Depth](https://img.shields.io/badge/Depth-Light%20Gray?color=D3D3D3)](https://developers.snap.com/lens-studio/features/ar-tracking/world/world-mesh-and-depth-texture) [![AR Tracking](https://img.shields.io/badge/AR%20Tracking-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-interaction-kit/features/overview?) [![Object Tracking](https://img.shields.io/badge/Object%20Tracking-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-interaction-kit/features/overview?)
[![ASR](https://img.shields.io/badge/ASR-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/about-spectacles-features/apis/asr-module)
[![AI](https://img.shields.io/badge/AI-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/about-spectacles-features/compatibility-list)
[![Depth](https://img.shields.io/badge/Depth-Light%20Gray?color=D3D3D3)](https://developers.snap.com/lens-studio/features/ar-tracking/world/world-mesh-and-depth-texture)
[![AR Tracking](https://img.shields.io/badge/AR%20Tracking-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/about-spectacles-features/compatibility-list)
[![Object Tracking](https://img.shields.io/badge/Object%20Tracking-Light%20Gray?color=D3D3D3)](https://developers.snap.com/lens-studio/features/ar-tracking/world/object-tracking)

<img src="./README-ref/sample-list-depth-cache-rounded-edges.gif" alt="essentials" width="500" />

## Overview

The Depth Module API now allows caching of depth frames, enabling pixel-to-3D projection even after a delay. This is especially useful for cloud-based vision models — once the results are returned, you can map image-space coordinates back into world space using the cached depth data.

This example lens demonstrates that workflow using the spatial reasoning capabilities of Gemini 2.5 Pro Preview, but the same approach can be applied to any vision model that outputs pixel or image-space coordinates.

> **NOTE:**
> This project will only work for the Spectacles platform and Lens Studio.

## Design Guidelines

Designing Lenses for Spectacles offers all-new possibilities to rethink user interaction with digital spaces and the physical world.
Get started using our [Design Guidelines](https://developers.snap.com/spectacles/best-practices/design-for-spectacles/introduction-to-spatial-design)

## Prerequisites

- **Lens Studio**: v5.15.0+
- **Spectacles OS Version**: v5.64+
- **Spectacles App iOS**: v0.64+
- **Spectacles App Android**: v0.64+

To update your Spectacles device and mobile app, please refer to this [guide](https://support.spectacles.com/hc/en-us/articles/30214953982740-Updating).

You can download the latest version of Lens Studio from [here](https://ar.snap.com/download?lang=en-US).

## Getting Started

To obtain the project folder, clone the repository.

> **IMPORTANT:**
> This project uses Git Large Files Support (LFS). Downloading a zip file using the green button on GitHub **will not work**. You must clone the project with a version of git that has LFS.
> You can download Git LFS [here](https://git-lfs.github.com/).

## Project Overview

This example uses ASR to listen for voice input when the microphone button is pinched or tapped. The transcription is sent to Gemini Pro via the Remote Service Gateway package.

Before sending an image to Gemini we have to cache the depth data. DepthCache.ts listens to a stream of depth frame data (using the Depth Module API) and also keeps a small history of camera frames, aligning them with timestamps. When we call saveDepthFrame() it returns an ID that we can use to get the depth frame data and associated camera frame from that point in time.

When we get a result from Gemini we can call getWorldPositionWithID() from DepthCache.ts to convert the pixel coordinates (center of a bounding box) to 3D world coordinates from that cached information.

In GeminiAPI.ts you can see the response format that we are requesting from Gemini. It returns a text response that we display to the user, as well as a data object that contains the bounding boxes and labels.

## Debug Visuals

For testing purposes there is DebugVisualizer.ts which will plot points over a camera frame texture. This can be turned on in SceneController.ts by checking showDebugVisuals to true in the hierarchy. Now when you make a request you will see the points Gemini found in the image.

## Testing the Lens

### In Lens Studio Editor

1. Open the Preview panel in Lens Studio.
2. Use Interactive Preview, WASD (+QE for elevation), LMB and RMB to move around scene.
3. Input your key for the Remote Service Gateway in the hierarchy.

### On Spectacles Device

1. Build and deploy the project to your Spectacles device.
2. Follow the [Spectacles guide](https://developers.snap.com/spectacles/get-started/start-building/preview-panel) for device testing.

## Support

If you have any questions or need assistance, please don't hesitate to reach out. Our community is here to help, and you can connect with us and ask for support [here](https://www.reddit.com/r/Spectacles/). We look forward to hearing from you and are excited to assist you on your journey!

## Contributing

Feel free to provide improvements or suggestions or directly contributing via merge request. By sharing insights, you help everyone else build better Lenses.

---

*Built with 👻 by the Spectacles team*  

---

This project includes a `ci_export.json` file for CI/CD configuration.





