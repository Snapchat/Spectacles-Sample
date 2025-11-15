# Throw Lab

[![SIK](https://img.shields.io/badge/SIK-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-interaction-kit/features/overview?) [![Physics](https://img.shields.io/badge/Physics-Light%20Gray?color=D3D3D3)](https://developers.snap.com/lens-studio/features/physics/physics-overview?) [![Gesture Module](https://img.shields.io/badge/Gesture%20Module-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/about-spectacles-features/apis/gesture-module?)

<img src="./README-ref/sample-list-throw-lab-rounded-edges.gif" alt="throw-lab" width="500" />

## Overview

This is a sample Lens Studio project that demonstrates how to implement realistic grabbing and throwing mechanics in Lens Studio using hand tracking and physics. It features a modular, componentized architecture with support for different object types (Balls, Rackets, Darts) and natural hand-velocity-based throwing.

By exploring the ThrowLab project, you'll gain a practical understanding of implementing grab-and-throw mechanics, physics-based interactions, and type-specific behaviors in AR. This foundation will help you build more engaging and interactive Lens Studio experiences for Spectacles.

> **NOTE:**
> This project will only work for the Spectacles platform.

## Design Guidelines

Designing Lenses for Spectacles offers all-new possibilities to rethink user interaction with digital spaces and the physical world.
Get started using our [Design Guidelines](https://developers.snap.com/spectacles/best-practices/design-for-spectacles/introduction-to-spatial-design)

## Prerequisites

- **Lens Studio**: v5.15.0+
- **Spectacles OS Version**: v5.64+
- **Spectacles App iOS**: v0.64+
- **Spectacles App Android**: v0.64+

To update your Spectacles device and mobile app, refer to this [guide](https://support.spectacles.com/hc/en-us/articles/30214953982740-Updating).

You can download the latest version of Lens Studio from [here](https://ar.snap.com/download?lang=en-US).

## Key Features

- **Multiple Gesture Types**: Supports both Pinch (Ball/Darts) and Grab (Racket) gestures
- **Hand Velocity Tracking**: Natural throwing based on actual hand movement speed
- **Type-Specific Behaviors**: 
  - Balls follow hand rotation and throw naturally
  - Rackets use wrist orientation for realistic holding
  - Darts auto-aim at dartboard with sticking mechanics
- **Physics Integration**: Full physics simulation with gravity, collisions, and forces
- **Visual Feedback**: Outline highlighting when objects are grabbed
- **Audio Feedback**: Sounds for dart hits, bounces, and ball collisions
- **Auto-Respawn**: Objects respawn at spawn points when grabbed/destroyed

## Project Overview

ThrowLab demonstrates a complete grab-and-throw system with three object types, each with unique behaviors:

### **Core System Components**

- [**GestureManager**](./Assets/Scripts/GestureManager.ts) - Manages hand gesture detection and overlap detection
- [**GrabbableObject**](./Assets/Scripts/GrabbableObject.ts) - Makes objects grabbable with type-specific behaviors
- [**MatchTransform**](./Assets/Scripts/MatchTransform.ts) - Smoothly positions objects to follow hand
- [**DartStick**](./Assets/Scripts/DartStick.ts) - Handles dart sticking to dartboard
- [**CollisionSound**](./Assets/Scripts/CollisionSound.ts) - Plays sounds on collision impacts
- [**GrabbableOutlineFeedback**](./Assets/Scripts/GrabbableOutlineFeedback.ts) - Visual feedback when grabbing
- [**ToolPickerBehavior**](./Assets/Scripts/ToolPickerBehavior.ts) - Spawns and respawns objects

### **Object Types**

1. **Ball** (Tennis, Ping Pong)
   - Gesture: Pinch (thumb + index finger)
   - Rotation: Follows hand naturally
   - Throw: Velocity-based (responds to hand movement speed)
   
2. **Racket** (Tennis Racket)
   - Gesture: Grab (close full hand)
   - Rotation: Follows wrist orientation
   - Throw: Drops naturally (no force applied)
   
3. **Darts**
   - Gesture: Pinch (thumb + index finger)
   - Rotation: Auto-aims at dartboard
   - Throw: Velocity-based, directed towards board
   - Special: Sticks to board on good hits, plays sounds 

## How It Works

### 1. **Finger Collision Detection**
The GestureManager creates invisible sphere colliders on your index finger and thumb tips. These colliders update every frame to match hand tracking positions and detect when your fingers touch grabbable objects using physics overlap events.

### 2. **Gesture Recognition**
The system listens for two gesture types:
- **Pinch** (thumb + index finger) - Used for Balls and Darts
- **Grab** (full hand close) - Used for Racket

When you perform the correct gesture while touching an object, the grab is initiated.

### 3. **Grab & Follow**
When grabbed:
- Object unparents from spawn point
- Physics becomes non-dynamic (kinematic)
- Object smoothly transitions from grab position to hold position (~0.5 seconds)
- MatchTransform makes object follow your index finger tip position
- Type-specific rotation behavior applied:
  - **Ball**: Rotates with your index finger
  - **Racket**: Rotates with your wrist
  - **Darts**: Locks rotation to aim at dartboard

### 4. **Hand Velocity Tracking**
While holding, the system continuously calculates your hand's velocity by tracking position changes over time. This creates a natural throwing feel where:
- Fast hand movement = powerful throw
- Slow hand movement = gentle toss

### 5. **Release & Throw**
When you release the gesture:
- Physics becomes dynamic again
- Throw force is applied based on object type:
  - **Ball**: Thrown in direction hand was pointing + hand velocity
  - **Racket**: Drops naturally (no throw force)
  - **Darts**: Thrown towards dartboard + hand velocity
- Object flies realistically based on combined forces

### 6. **Special Behaviors**
- **Darts**: Check hit angle on collision - stick if straight, bounce if angled
- **Balls**: Play impact sound on collision (volume based on impact speed)
- **All**: Auto-destroy after 4.5 seconds (except stuck darts)

### 7. **Auto-Respawn**
ToolPickerBehavior monitors spawned objects and automatically respawns new ones when they're grabbed or destroyed, keeping the spawn points always full.

## Using it in your Project

### Quick Start

1. **Set up GestureManager** (required, one per scene):
   - Create empty SceneObject
   - Add GestureManager component
   - Assign Hand Tracking assets (left and right)
   - Optionally add debug sphere prefabs to visualize finger colliders

2. **Make any object grabbable**:
   - Add Physics.BodyComponent to the object
   - Add MatchTransform component
   - Add GrabbableObject component
     - Select object type (Ball, Racket, or Darts)
     - Reference the MatchTransform
     - Configure throw forces and behavior
   
3. **Optional enhancements**:
   - Add CollisionSound for impact sounds
   - Add GrabbableOutlineFeedback for visual highlighting
   - Add DartStick for dart sticking behavior (darts only)

### Key Scripts

- [**GestureManager.ts**](./Assets/Scripts/GestureManager.ts) - Main gesture detection system
- [**GrabbableObject.ts**](./Assets/Scripts/GrabbableObject.ts) - Core grab/throw behavior
- [**MatchTransform.ts**](./Assets/Scripts/MatchTransform.ts) - Position/rotation following
- [**DartStick.ts**](./Assets/Scripts/DartStick.ts) - Dart sticking mechanics
- [**CollisionSound.ts**](./Assets/Scripts/CollisionSound.ts) - Audio on collision

## Support

If you have any questions or need assistance, please don't hesitate to reach out. Our community is here to help, and you can connect with us and ask for support [here](https://www.reddit.com/r/Spectacles/). We look forward to hearing from you and are excited to assist you on your journey!

## Contributing

Feel free to provide improvements or suggestions or directly contributing via merge request. By sharing insights, you help everyone else build better Lenses.

---

*Built with 👻 by the Spectacles team*
 







