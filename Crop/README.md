# Crop

[![SIK](https://img.shields.io/badge/SIK-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-interaction-kit/features/overview?) [![Remote Service Gateway](https://img.shields.io/badge/Remote%20Service%20Gateway-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/about-spectacles-features/overview) [![Experimental API](https://img.shields.io/badge/Experimental%20API-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/about-spectacles-features/apis/experimental-apis?) [![Text To Speech](https://img.shields.io/badge/Text%20To%20Speech-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/about-spectacles-features/compatibility-list) [![Speech To Text](https://img.shields.io/badge/Speech%20To%20Text-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/about-spectacles-features/compatibility-list) [![Camera Access](https://img.shields.io/badge/Camera%20Access-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/about-spectacles-features/apis/camera-module?) [![AI Vision](https://img.shields.io/badge/AI%20Vision-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/about-spectacles-features/compatability-list) [![LLM](https://img.shields.io/badge/LLM-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/about-spectacles-features/compatibility-list) [![Vision](https://img.shields.io/badge/Vision-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/about-spectacles-features/compatibility-list) [![Fetch](https://img.shields.io/badge/Fetch-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/about-spectacles-features/apis/fetch?) [![Web View](https://img.shields.io/badge/Web%20View-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/about-spectacles-features/apis/web-view?) [![Gesture Module](https://img.shields.io/badge/Gesture%20Module-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/about-spectacles-features/apis/gesture-module?)

<img src="./README-ref/sample-list-crop-rounded-edges.gif" alt="crop" width="500" />

## Overview

This sample projects shows how to "crop" the environment using hand gesture.

> **NOTE**:
> This project will only work for the Spectacles platform.

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

The camera feature requires you to use Experimental APIs. Please see Experimental APIs for more details [here](https://developers.snap.com/spectacles/about-spectacles-features/apis/experimental-apis).

Extended Permissions mode on device must be enabled for enabling some of the Spectacles APIs. Please see Extended Permissions for more details [here](https://developers.snap.com/spectacles/permission-privacy/extended-permissions).

## Getting Started

To obtain the project folder, you need to clone the repository.

> **IMPORTANT**:
> This project uses Git Large Files Support (LFS). Downloading a zip file using the green button on Github
> **will not work**. You must clone the project with a version of git that has LFS.
> You can download Git LFS here: https://git-lfs.github.com/.

## Initial Project Setup

In order to use this project and call Remote Service Gateway APIs, you need to:

1. Install the Remote Service Gateway Token Generator plug-in from the Asset Browser
2. Go to Window -> Remote Service Gateway Token
3. Click "Generate Token"
4. Copy paste the token into the "RemoteServiceGatewayCredentials" object in the Inspector

## Key Features

The camera module allows access to the left or right camera texture on device. To align the image crop with either camera we can use the camera module to get intrinsics and pose (offset) of each camera. We can then create two virtual cameras underneath the main camera and set their respective physical properties. This way we can get camera space positions of objects in 3D space. This project uses those positions to update the screen crop texture accordingly.

There is CropRegion.ts that takes 4 SceneObjects and uses those for the corners of the crop. That could be used to crop a fixed area anchored to the hand or some fixed distance from the camera.

## Testing the Lens

### In Lens Studio Editor

Use the interactive preview to move around and click the screen to test the cropping behavior and ChatGPT functionality.

### On Spectacles Device

Install the lens as normal and pinch both hands close together, pull your right hand diagonally down to size the capture window, release the pinch on both hands to send capture to ChatGPT.

## Open AI Disclaimer

Ensure that you comply with OpenAI’s API usage policies and Spectacles’ terms of service when deploying this project.

## Support

If you have any questions or need assistance, please don't hesitate to reach out. Our community is here to help, and you can connect with us and ask for support [here](https://www.reddit.com/r/Spectacles/). We look forward to hearing from you and are excited to assist you on your journey!

## Contributing

Feel free to provide improvements or suggestions or directly contributing via merge request. By sharing insights, you help everyone else build better Lenses.

---

*Built with 👻 by the Spectacles team* 
 
 
