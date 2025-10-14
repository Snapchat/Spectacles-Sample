# SnapML Chess Hints 

[![SIK](https://img.shields.io/badge/SIK-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-interaction-kit/features/overview?) [![AI](https://img.shields.io/badge/AI-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-interaction-kit/features/overview?) [![SnapML](https://img.shields.io/badge/SnapML-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-interaction-kit/features/overview?) [![AR Tracking](https://img.shields.io/badge/AR%20Tracking-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-interaction-kit/features/overview?) [![Object Tracking](https://img.shields.io/badge/Object%20Tracking-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-interaction-kit/features/overview?) [![Networking](https://img.shields.io/badge/Networking-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/about-spectacles-features/connected-lenses/overview?)

<img src="./README-ref/sample-list-chess-hint-rounded-edges.gif" alt="chess-hints" width="500" />

## Overview
This project uses SnapML to detect chess pieces and provide move suggestions using AI. It demonstrates how Spectacles can enhance real-world activities through computer vision and intelligent assistance.

> **NOTE**:
> This project will only work for the Spectacles platform.

## Prerequisites

- **Lens Studio**: v5.15.0+
- **Spectacles OS Version**: v5.64+
- **Spectacles App iOS**: v0.64+
- **Spectacles App Android**: v0.64+
- **1 Standard Physical Chess Board**
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

## Initial Project Setup

This project requires an API token to function properly:

1. Generate an API Token:
    * In Lens Studio, navigate to the Asset Library
    * Install the "Remote Service Gateway Token Generator"
    * Use the generator to create a new public API token
2. Apply the Token:
    * Find the RemoteServiceGatewayCredentials object in the Scene Hierarchy
    * Apply your newly generated token to this object
    * Ensure the token is properly saved before testing

> **Note:**
> The API token is essential for the chess AI functionality to connect with external services that provide move suggestions.

## Key Scripts

Camera (CameraService.ts)
* Gets frames from the device camera (Spectacles Left Camera)
* Creates a Pinhole Camera Model to represent intrinsics and transforms
* Crops a square area from camera frames for ML processing

ML Model (MLController.ts)
* Uses 512x512 YoloV7-tiny model converted to ONNX
* Handles 12 output classes (6 piece types × 2 colors)
* Configurable Confidence and Intersection Over Union (IOU) thresholds via script sliders
* Runs intermittently to conserve power

Detection Processing (ChessBoardPredictor.ts)
* Determines player position (white side) using center of mass for white detections
* Post-processes piece detections based on board position
* Caches recent board positions to filter noise
* Converts 2D board positions to 3D using user-defined reference plane

Chess AI (ChessAI.ts)
* Converts piece positions to Forsyth–Edwards Notation (FEN)
* Validates FEN strings to ensure valid board setups
* Integrates with Google's Gemini API for move suggestions
* Alternative StockFish-based API option with configurable depth
* Converts algebraic notation back to real-world coordinates

### In Lens Studio Editor

When working with this project in Lens Studio:

* A virtual chess board will be generated in the scene
* For best results, disable simulation in the Preview Panel to prevent visual misalignment
* Individual chess pieces cannot be manually moved, but you can shuffle piece placement
* Use your mouse to interact with the hint button to test the AI suggestion functionality 

### On Spectacles Device

To use this Lens with a physical chess board:

1. Board Detection: Position your Spectacles to view a complete chess board
2. Calibration Process:
    * Once detected, you'll need to place two calibration pins
    * Position the first pin (labeled "L") at the left corner closest to your color pieces
    * Next, place the second pin (labeled "R") at the right side of the board

3. Getting Hints:
    * After successful calibration, a hint button will appear in front of your chess board
    * Press this button with your finger to request AI-powered move suggestions
    * The system will analyze the current board state and display recommended moves

4. Recalibrate:
    * Look at your left palm and pinch to recalibrate the chess board. 

## Support

If you have any questions or need assistance, please don't hesitate to reach out. Our community is here to help, and you can connect with us and ask for support [here](https://www.reddit.com/r/Spectacles/). We look forward to hearing from you and are excited to assist you on your journey!

## Contributing

Feel free to provide improvements or suggestions or directly contributing via merge request. By sharing insights, you help everyone else build better Lenses.

---

*Built with 👻 by the Spectacles team* 