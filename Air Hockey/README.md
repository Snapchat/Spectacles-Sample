# Air Hockey  

[![SIK](https://img.shields.io/badge/SIK-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-interaction-kit/features/overview?) [![Networking](https://img.shields.io/badge/Networking-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/about-spectacles-features/connected-lenses/overview?) [![Connected Lenses](https://img.shields.io/badge/Connected%20Lenses-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/about-spectacles-features/connected-lenses/overview?) [![Sync Kit](https://img.shields.io/badge/Sync%20Kit-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-interaction-kit/features/overview?) [![Multiplayer](https://img.shields.io/badge/Multiplayer-Light%20Gray?color=D3D3D3)](https://developers.snap.com/lens-studio/features/lens-cloud/lens-cloud-overview?)

<img src="./README-ref/sample-list-air-hockey-rounded-edges.gif" alt="air-hockey" width="500" />

## Overview
This is a sample [Connected Lens](https://developers.snap.com/spectacles/about-spectacles-features/connected-lenses/overview) project that uses [Spectacles Sync Kit](https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-sync-kit/getting-started).

> **NOTE**:
> This project will only work for the Spectacles platform.

## Design Guidelines

Designing Lenses for Spectacles offers all-new possibilities to rethink user interaction with digital spaces and the physical world.
Get started using our [Design Guidelines](https://developers.snap.com/spectacles/best-practices/design-for-spectacles/introduction-to-spatial-design)

## Prerequisites

- **Lens Studio**: v5.15.1+
- **Spectacles OS Version**: v5.64+
- **Spectacles App iOS**: v0.64+
- **Spectacles App Android**: v0.64+

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

The project should be pre-configured to get you started without any additional steps. However, if you encounter issues in the Logger Panel, please ensure your Lens Studio environment is set up for [Spectacles](https://developers.snap.com/spectacles/get-started/start-buiding/preview-panel).

## Key Scripts

The following scripts sync the game using Spectacles Sync Kit [sync entities](https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-sync-kit/features/sync-entity) and [storage properties](https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-sync-kit/features/storage-properties).

- [AirHockeyPuckTS.ts](./Assets/AirHockey/Typescript/AirHockeyPuckTS.ts) / [AirHockeyPuckJS.js](./Assets/AirHockey/Javascript/AirHockeyPuckJS.js): This script controls the air hockey puck. It handles physics collisions and synced motion of the puck .

- [AirHockeyPaddleTS.ts](./Assets/AirHockey/Typescript/AirHockeyPaddleTS.ts) / [AirHockeyPaddleJS.js](./Assets/AirHockey/Javascript/AirHockeyPaddleJS.js): This script controls the paddles. It handles collisions and syncs the position of each player's paddle.

- [AirHockeyControllerTS.ts](./Assets/AirHockey/Typescript/AirHockeyControllerTS.ts) / [AirHockeyControllerJS.js](./Assets/AirHockey/Javascript/AirHockeyControllerJS.js): This script controls the game. It handles starting the game, detecting goals, and updating the score.

## Testing the Lens

### In Lens Studio Editor

Open two Preview panels to test with multiple users in the Connected Lens. Each Preview simluates a user in the multiplayer session. Select the `Start` button to begin playing the game. Each Preview panel takes ownership of a paddle. Move the paddle side to side with your mouse to intercept the puck. The scoreboard updates to reflect goals scored.

### On Spectacles Device

To test Connected Lenses on your device, refer to the guide provided [here](https://developers.snap.com/spectacles/about-spectacles-features/connected-lenses/building-connected-lenses).

After successfully installing the Lens, pinch the `Multiplayer` button to being the Connected Lenses [colocated joining flow](https://developers.snap.com/spectacles/about-spectacles-features/connected-lenses/using-connected-lenses). When the air hockey board appears, pinch the `Start` button to start the game. Pinch a paddle to move it to hit the puck.

## Support

If you have any questions or need assistance, please don't hesitate to reach out. Our community is here to help, and you can connect with us and ask for support [here](https://www.reddit.com/r/Spectacles/). We look forward to hearing from you and are excited to assist you on your journey!

## Contributing

Feel free to provide improvements or suggestions or directly contributing via merge request. By sharing insights, you help everyone else build better Lenses.

---

*Built with 👻 by the Spectacles team*





