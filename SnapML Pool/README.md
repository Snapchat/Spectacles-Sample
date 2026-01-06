# SnapML Pool

[![SIK](https://img.shields.io/badge/SIK-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-interaction-kit/features/overview?) [![AI](https://img.shields.io/badge/AI-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-interaction-kit/features/overview?) [![SnapML](https://img.shields.io/badge/SnapML-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-interaction-kit/features/overview?) [![AR Tracking](https://img.shields.io/badge/AR%20Tracking-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-interaction-kit/features/overview?) [![Object Tracking](https://img.shields.io/badge/Object%20Tracking-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-interaction-kit/features/overview?) [![Networking](https://img.shields.io/badge/Networking-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/about-spectacles-features/connected-lenses/overview?)

<img src="./README-ref/sample-list-pool-ml-rounded-edges.gif" alt="pool-ml" width="500" />

## Overview
This project uses SnapML to detect a pool table with all 16 balls and pocket holes. 

> **NOTE**:
> This project will only work for the Spectacles platform.

## Prerequisites

- **Lens Studio**: v5.15.0+
- **Spectacles OS Version**: v5.64+
- **Spectacles App iOS**: v0.64+
- **Spectacles App Android**: v0.64+
- **1 Standard Pool Table**
    - With all pieces

To update your Spectacles device and mobile app, please refer to this [guide](https://support.spectacles.com/hc/en-us/articles/30214953982740-Updating).

You can download the latest version of Lens Studio from [here](https://ar.snap.com/download?lang=en-US).

The camera feature requires you to use Experimental APIs. Please see Experimental APIs for more details [here](https://developers.snap.com/spectacles/about-spectacles-features/apis/experimental-apis).

Extended Permissions mode on device must be enabled for enabling some of the Spectacles APIs. Please see Extended Permissions for more details [here](https://developers.snap.com/spectacles/permission-privacy/extended-permissions).

## Getting Started

To obtain the project folder, clone the repository.

> **IMPORTANT:**
> This project uses Git Large Files Support (LFS). Downloading a zip file using the green button on GitHub **will not work**. You must clone the project with a version of git that has LFS.
> You can download Git LFS [here](https://git-lfs.github.com/).

## Key Scripts

Camera (CameraService.ts)
* Gets frames from the device camera (Spectacles Left Camera)
* Creates a Pinhole Camera Model to represent intrinsics and transforms
* Crops a square area from camera frames for ML processing

ML Model (MLController.ts)
* Uses 512x512 YoloV7-tiny model converted to ONNX
* Handles 17 output classes (0: cue ball, 1-15: pool balls, 16: pockets)
* Configurable Confidence and Intersection Over Union (IOU) thresholds via script sliders

Parsing Detections (PoolTablePredictor.ts)
* Guides player to align the table surface using two markers
* Un-projects bounding box detections to 3D positions using the user-defined reference plane

Tracking Detections (MultiObjectTracking.ts)
* Tracks pool ball positions over time using a spatial-temporal algorithm
* Matches tracklets to maintain consistent object identification

Simulated Pool Table (SimulatedPoolTable.ts)
* Provides a virtual table with physics for Editor debugging
* Includes random impulse forces to simulate ball movement around the table

### In Lens Studio Editor

When working with this project in Lens Studio:

* A virtual pool table will be generated in the scene
* For best results, disable simulation in the Preview Panel to prevent visual misalignment
* You can shuffle the balls that are in the pool table by using your mouse on the Preview Panel

### On Spectacles Device

To use this Lens with a physical pool table:

1. Pool Table Detection: Position your Spectacles to view a complete pool table

2. Calibration Process:
    * Once detected, you'll need to place two calibration pins
    * Position the first pin (labeled "L") at the bottom left corner pocket, ensuring it touches the felt of the table
    * Next, place the second pin (labeled "R") at the bottom right corner pocket of the pool table

3. After Calibration:
    * After successful calibration, Spectacles will track all the viewable balls in the pool table in real time. 

4. Recalibrate:
    * Look at your left palm and pinch to recalibrate the pool table.

## Support

If you have any questions or need assistance, please don't hesitate to reach out. Our community is here to help, and you can connect with us and ask for support [here](https://www.reddit.com/r/Spectacles/). We look forward to hearing from you and are excited to assist you on your journey!

## Contributing

Feel free to provide improvements or suggestions or directly contributing via merge request. By sharing insights, you help everyone else build better Lenses.

---

*Built with 👻 by the Spectacles team*  

---