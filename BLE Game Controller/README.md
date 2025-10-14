# BLE Game Controller

[![SIK](https://img.shields.io/badge/SIK-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-interaction-kit/features/overview?)
[![Experimental API](https://img.shields.io/badge/Experimental%20API-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/about-spectacles-features/apis/experimental-apis?)
[![BLE](https://img.shields.io/badge/BLE-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/about-spectacles-features/compatibility-list)

<img src="./README-ref/sample-list-ble-game-controller-rounded-edges.gif" alt="bluetooth" width="500" />

## Overview

The BLE Game Controller project demonstrates how to create an interactive 3D character experience using Spectacles' BLE capabilties. This template features a 3D Bitmoji character that responds to external game controller inputs, including movement, animations, and haptic feedback. The project showcases surface placement for positioning the character in the real world and includes a comprehensive animation system with walking, running, jumping, punching, and kicking animations.

> **NOTE:**
> This project will only work for the Spectacles platform.
> Requires a compatible Bluetooth game controller for full functionality.

## Design Guidelines

Designing Lenses for Spectacles offers all-new possibilities to rethink user interaction with digital spaces and the physical world.
Get started using our [Design Guidelines](https://developers.snap.com/spectacles/best-practices/design-for-spectacles/introduction-to-spatial-design)

## Prerequisites

- **Lens Studio**: v5.15.0+
- **Spectacles OS Version**: v5.64+
- **Compatible Bluetooth Game Controller**: Out of the box, it supports Xbox Controller and SteelSeries Controller which have BLE HID support

To update your Spectacles device and mobile app, refer to this [guide](https://support.spectacles.com/hc/en-us/articles/30214953982740-Updating).

You can download the latest version of Lens Studio from [here](https://ar.snap.com/download?lang=en-US).

Game Controller functionality requires you to use Experimental APIs. Please see Experimental APIs for more details [here](https://developers.snap.com/spectacles/about-spectacles-features/apis/experimental-apis).

Extended Permissions mode on device must be enabled for BLE Game Controller functionality. Please see Extended Permissions for more details [here](https://developers.snap.com/spectacles/permission-privacy/extended-permissions).

## Getting Started

To obtain the project folder, clone the repository.

> **IMPORTANT:**
> This project uses Git Large Files Support (LFS). Downloading a zip file using the green button on GitHub **will not work**. You must clone the project with a version of git that has LFS.
> You can download Git LFS [here](https://git-lfs.github.com/).

## Initial Project Setup

This project is pre-configured and ready to use without additional setup. The character will automatically scan for available Bluetooth controllers when the lens starts. Simply pair your Bluetooth controller with your Spectacles device before launching the lens for optimal experience.

## Key Features

### Surface Placement System

The project includes an intelligent surface placement system that allows users to position the 3D character on detected surfaces in the real world. The system supports both horizontal surface placement and near-surface placement with height adjustment capabilities.

### BLE Game Controller Integration

```typescript
// Scanning and connecting to game controllers
this.gameController.scanForControllers();

// Registering button callbacks for different actions
this.gameController.onButtonStateChanged(
  ButtonStateKey.a,
  this.JumpButtonDown.bind(this)
);
```

The project demonstrates comprehensive game controller integration powered by the **GameController** package, including:

#### GameController Package Components

- **GameController.ts**: Core singleton class managing Bluetooth controller connections, scanning, and state management
- **Scripts/ButtonState.ts**: Defines button state enumerations and key mappings for standard game controllers
- **Scripts/BaseController.ts**: Base controller functionality providing common interface for different controller types
- **SupportedControllers/RegisteredControllers.ts**: Registry system for supporting various Bluetooth controller models

#### Key Functionality

- Automatic controller scanning and connection using Spectacles' BLE capabilities
- Button mapping for character actions (A: Jump, X: Punch, B: Kick, Y: Rumble)
- Analog stick input processing for smooth character movement
- Haptic feedback through controller rumble functionality
- Support for multiple controller types through the extensible registration system

### Character Animation System

An animation blending system that smoothly transitions between different character states:

- **Idle Animation**: Default state when character is stationary
- **Walk Animation**: Triggered during slow movement
- **Run Animation**: Activated during fast movement
- **Action Animations**: Jump, punch, and kick animations triggered by controller buttons

```typescript
// Animation blending with smooth transitions
private blendClips() {
  for (const clip of this.clips) {
    const weight = clip.name != this.currClip.name ? 0 : 1;
    clip.weight = MathUtils.lerp(clip.weight, weight, getDeltaTime() * 7);
  }
}
```

### Haptic Feedback

The Y button triggers haptic feedback through the connected controller, providing tactile response to enhance the gaming experience.

### Key Scripts

[`Assets/Scripts/SceneController.ts`](./Assets/Scripts/SceneController.ts)

- Main controller managing the overall scene flow and game controller integration
- Handles surface placement initialization and character positioning
- Maps controller inputs to character actions using GameController APIs
- Manages camera-relative movement calculations

[`Assets/Scripts/AnimationController.ts`](./Assets/Scripts/AnimationController.ts)

- Animation system managing character animations
- Implements smooth animation blending between different states
- Handles single-shot animations (jump, punch, kick) and looped animations (idle, walk, run)
- Automatically transitions between movement animations based on character speed

#### GameController Package Scripts

**GameController/GameController.ts**

- Core singleton class providing Bluetooth game controller functionality
- Manages controller scanning, connection, and state monitoring
- Provides event-driven button state change callbacks
- Handles haptic feedback through rumble commands

**GameController/Scripts/ButtonState.ts**

- Defines ButtonStateKey enumeration for standard controller buttons (A, B, X, Y, etc.)
- Provides button state management and event handling interfaces
- Maps physical controller inputs to logical game actions

**GameController/Scripts/BaseController.ts**

- Abstract base class for controller implementations
- Standardizes controller interface across different device types
- Handles common controller functionality and state management

### Controller Support

Currently this template provides examples for:

- [Steel Series Stratus +](https://steelseries.com/gaming-controllers/stratus?model=Plus)
- [XBox Controllers](https://www.xbox.com/en-US/accessories/controllers/xbox-wireless-controller) (models 1708 or later with BLE support)

Generally, any controller that advertises over BLE should be connectable, but will likely require different mapping than the examples provided here.

_With Xbox in particular, the first time you connect, you may have to clear bonding history on the controller. Hold down the pairing and home button until the light starts flashing. Then hold down the home button for a few seconds and it will connect._

## Testing the Lens

### In Lens Studio Editor

- Use the Interactive Preview Panel to test basic functionality
- Tap and hold on the Preview Panel to control the character movement
- Tap on the Preview Panel to control the character actions (jump animation in editor testing mode)
- Test surface placement by clicking on detected surfaces in the scene view
- Verify character positioning and animation state transitions

### On Spectacles Device

- Build and deploy the project to your Spectacles device
- Once the lens is launched, the Spectacles device will automatically look for HID devices
- Place the character on a detected surface using the placement interface
- Test all controller inputs:
  - Use left analog stick to move the character around
  - Press A button to make character jump
  - Press X button to trigger punch animation
  - Press B button to trigger kick animation
  - Press Y button to test haptic feedback
- Verify that character animations blend smoothly between idle, walk, and run states

## Support

If you have any questions or need assistance, please don't hesitate to reach out. Our community is here to help, and you can connect with us and ask for support [here](https://www.reddit.com/r/Spectacles/). We look forward to hearing from you and are excited to assist you on your journey!

## Contributing

Feel free to provide improvements or suggestions or directly contributing via merge request. By sharing insights, you help everyone else build better Lenses.

---

*Built with 👻 by the Spectacles team*
 
