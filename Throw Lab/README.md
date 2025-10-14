# Throw Lab

[![SIK](https://img.shields.io/badge/SIK-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-interaction-kit/features/overview?) [![Physics](https://img.shields.io/badge/Physics-Light%20Gray?color=D3D3D3)](https://developers.snap.com/lens-studio/features/physics/physics-overview?) [![Gesture Module](https://img.shields.io/badge/Gesture%20Module-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/about-spectacles-features/apis/gesture-module?)

<img src="./README-ref/sample-list-throw-lab-rounded-edges.gif" alt="throw-lab" width="500" />

## Overview

This is a sample Lens Studio project that demonstrates how to implement simple but realistic throwing mechanic in Lens Studio based on physics. It showcases a clean, componentized architecture that takes advantage of the new **Hand Velocity API**.
By exploring the ThrowLab project, you’ll gain a practical understanding of implementing realistic throwing mechanics in AR. This foundation will help you build more engaging and interactive Lens Studio lenses.

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

## Hand Velocity API

This API gives an easy and reliable way of getting the velocity of hand joints as `vec3`s in world coordinate system.

The API can be used together with SIK:

````
   let handInputData = SIK.HandInputData;
   let hand = this.handInputData.getHand('right');
   let objectSpecificData = this.hand.objectTracking3D.objectSpecificData
   if (objectSpecificData) {
      let handVelocity = objectSpecificData['global'];
      let indexVelocity = objectSpecificData['index-3'];
   }
````

The following joints are available for the velocities: “index-3”, “mid-3”, “ring-3”, “pinky-3”, “thumb-3” and “global”.

## Project Overview

With ThrowLab, you can pinch to grab, and then throw four different objects. We have 2 example objects in the project:

- [**Ball**](./Assets/Scripts/TennisBallBehavior.ts)
- [**Dart**](./Assets/Scripts/DartBehavior.ts)

Each object has slightly different behaviors and corresponding sounds on collision. Dart is a more complex example with some specific logic for hitting the dart board. 

## How It Works

1. **Hand Detection & Velocity Calculation**:  
   Lens Studio’s Hand Tracking system detects your hand. As you move, the Hand Velocity API provides the velocity of the relevant joints.

2. **Object Selection & Holding**  
   ThrowLab uses a pinch gesture provided by the Spectacles Interaction Kit (SIK) to allow the user to pinch the objects. When you pinch near an object, it attaches to your hand, simulating a pinched hold.

3. **Throwing Mechanics**:  
   While pinching and moving the object, the system continuously tracks acceleration, accumulating data over the time you hold it. When you release the pinch, the final throw velocity is a combination of:
   - The object’s accumulated acceleration during the hold.
   - The hand’s velocity at the moment of release.

   By blending these factors, you get a smoother, more realistic throwing motion that accounts for the object’s buildup of speed as you swing your hand.

4. **Cleanup**:  
   After the object finishes its flight (for example, when it hits the ground and stay still), it destroys itself after some time buffer to keep the scene clean.

## Using it in your Project

The Tennis Ball object is available as an [.lspkg file](./TennisBall_Importable.lspkg). You can easily drag and drop it into your project to easily get started. Or just start with the [**TennisBallBehavior.ts**](./Assets/Scripts/TennisBallBehavior.ts) script.

## Support

If you have any questions or need assistance, please don't hesitate to reach out. Our community is here to help, and you can connect with us and ask for support [here](https://www.reddit.com/r/Spectacles/). We look forward to hearing from you and are excited to assist you on your journey!

## Contributing

Feel free to provide improvements or suggestions or directly contributing via merge request. By sharing insights, you help everyone else build better Lenses.

---

*Built with 👻 by the Spectacles team*
 

