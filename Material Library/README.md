# Material Library

[![SIK](https://img.shields.io/badge/SIK-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-interaction-kit/features/overview?) [![Graphics, Materials and Particles](https://img.shields.io/badge/Graphics%2C%20Materials%20and%20Particles-Light%20Gray?color=D3D3D3)](https://developers.snap.com/lens-studio/features/graphics/materials/overview?) [![Shaders](https://img.shields.io/badge/Shaders-Light%20Gray?color=D3D3D3)](https://developers.snap.com/lens-studio/features/graphics/materials/overview?) [![Post Effects](https://img.shields.io/badge/Post%20Effects-Light%20Gray?color=D3D3D3)](https://developers.snap.com/lens-studio/features/graphics/materials/post-effects?)

<img src="./README-ref/sample-list-material-library-rounded-edges.gif" alt="material-library" width="500" />

## Overview

This is an experimental sample project that aims to collect a number of Materials tested on Spectacles.

> **NOTE:**
> This project will only work for the Spectacles platform.
> If you are familiar with **Lens Studio** development, you might be aware of the resources available in the [Asset Library](https://developers.snap.com/lens-studio/assets-pipeline/asset-library/asset-library-overview) regarding shaders and effects. Sometimes it might not be too explicit that some of the resources are also compatible with Spectacles. As we continue to increase the number of resources for Spectacles, we will be improving this sample and continue testing a wide range of shaders.

## Design Guidelines

Designing Lenses for Spectacles offers all-new possibilities to rethink user interaction with digital spaces and the physical world.
Get started using our [Design Guidelines](https://developers.snap.com/spectacles/best-practices/design-for-spectacles/introduction-to-spatial-design)

## Prerequisites

- **Lens Studio**: v5.10.0+
- **Spectacles OS Version**: v5.62+
- **Spectacles App iOS**: v0.62+
- **Spectacles App Android**: v0.62+

To update your Spectacles device and mobile app, please refer to this [guide](https://support.spectacles.com/hc/en-us/articles/30214953982740-Updating).

You can download the latest version of Lens Studio from [here](https://ar.snap.com/download?lang=en-US).

## Getting the Project

To obtain the project folder, clone the repository.

> **IMPORTANT:**
> This project uses Git Large Files Support (LFS). Downloading a zip file using the green button on GitHub **will not work**. You must clone the project with a version of git that has LFS.
> You can download Git LFS [here](https://git-lfs.github.com/).

## Initial Project Setup

The project should be pre-configured to get you started without any additional steps. This project contains:

1. An "Essential" collection of material.
2. An "Advanced" collection of material from the Asset Library or From the inital sample on Lens Studio home page named "Material Editor".

<img src="./README-ref/matLibrary.png" alt="Material Library" width="500" />

## Material Library Resources

You can add a material from the material library by clicking the Asset Library button in the top left of Lens Studio.
See more at [Material Library](https://developers.snap.com/lens-studio/features/graphics/materials/material-editor/material-library)

## Testing the Lens

### In Lens Studio Editor

<img src="./README-ref/preview.png" alt="Preview Page" width="500" />

1. Open the Preview panel in Lens Studio.
2. Use the "previous" and "next" button to go through all of the available materials.

### On Spectacles Device

1. Build and deploy the project to your Spectacles device.
2. Follow the [Spectacles guide](https://developers.snap.com/spectacles/get-started/start-building/preview-panel) for device testing.
3. Use the "previous" and "next" button to go through all of the available materials.

## Disclaimer

This is an experimental effort to officialize shader support on Spectacles. Keep in mind that using multiple material at once or render a large number of object with the same material can affect performance. We are always looking forward to hear your feedback.

## Support

If you have any questions or need assistance, please don't hesitate to reach out. Our community is here to help, and you can connect with us and ask for support [here](https://www.reddit.com/r/Spectacles/). We look forward to hearing from you and are excited to assist you on your journey!

## Contributing

Feel free to provide improvements or suggestions or directly contributing via merge request. By sharing insights, you help everyone else build better Lenses.