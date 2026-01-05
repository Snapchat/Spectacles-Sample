# World Kindness Day

[![SIK](https://img.shields.io/badge/SIK-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-interaction-kit/features/overview?) 
[![Cloud](https://img.shields.io/badge/Cloud-Light%20Gray?color=D3D3D3)](https://cloud.snap.com)
[![ASR](https://img.shields.io/badge/ASR-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/about-spectacles-features/apis/asr-module)
[![Gesture Module](https://img.shields.io/badge/Gesture%20Module-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/about-spectacles-features/apis/gesture-module?)

<img src="./README-ref/sample-list-world-kindness-day-rounded-edges.gif" alt="World Kindness Day Lens" width="500" />

## Overview

This Sample Project demonstrates how a Spectacles experience can send structured data to a database and how the same data can be displayed both inside the Lens and in an external web application.

As a real-world example, this project invites users to choose a balloon and speak a kindness pledge. When they do, the Lens writes a record to the database, and the global pledge counter updates instantly.

The companion web app that visualizes these pledges in real time can be found here:
World Kindness Day – Live Pledge Counter

> **NOTE:**
> This project will only work for the Spectacles platform. You must set the simulation mode on Lens Studio Preview to `Spectacles (2024)`.
> This project also requires you to create your own Snap Cloud / Supabase project. Without a backend configured, the Lens will not function. Please follow the [WKD - Supabase Setup Guide](https://developers.snap.com/spectacles/about-spectacles-features/snap-cloud/WKD/Snapcloud-setup.md) before continuing.

## Prerequisites

- **Lens Studio**: v5.15.0+
- **Spectacles OS Version**: v5.64+
- **Spectacles App iOS/Android**: v0.64+

To update your Spectacles device and mobile app, please refer to this [guide](https://support.spectacles.com/hc/en-us/articles/30214953982740-Updating).

You can download the latest version of Lens Studio from [here](https://ar.snap.com/download?lang=en-US).

## Project Overview

### Scene Objects

- Start Screen Root - Balloon selection screen:
  - Description Frame: contains Title and Description texts.
  - Pledge Fram: contains pledge texts.
  - Multiple interactable balloons.
- End Screen Root - Thank-you message and global pledge count:
  - Thank-You Frame: contains Title text, Thank-You text, and global pledge count text.
  - Balloons Container: Parent for instanced balloons in the “sky”.
- MainManager:
  - All scripts components are in the parent scene object.
  - ReminderHint: A reminder to set up Supabase account to use the sample project.

### Scripts

- `KindnessCounter.ts`: Handles Supabase integration, pledge logic, totals, UI state.
- `BalloonsManager.ts`: Manages balloon interactions and triggers the pledge event.
- `ASR Voice Trigger Script`: Detects the spoken pledge phrase.

### Assets

- `SpectaclesInteractionKit` package.
- `SupabaseClient` package.
- `SupabaseProject` credentials (imported via plugin)
- Prefabs (3 balloon variants)
- Materials, Textures, Scripts, Fonts, LSTween package .. etc.

## Initial Project Setup

### Set Up Your Snap Cloud Project

You will need a [Snap Cloud project](https://developers.snap.com/spectacles/about-spectacles-features/snap-cloud/getting-started) containing the same tables and RPC functions used in this Lens.

Please follow the [WKD - Supabase Setup Guide](https://developers.snap.com/spectacles/about-spectacles-features/snap-cloud/WKD/Snapcloud-setup.md), which walks you through:

- Creating your Supabase project.
- Adding the required tables (`kindness_pledges`, `kindness_totals`).
- Creating the RPC functions (`pledge_and_total_once`, `get_kindness_total_all`, etc.).
- Setting the correct permissions.
- (Optional) Adding test data to verify your setup.

You must complete the Supabase setup before the Lens can successfully read or write any data.

### Add Supabase Plugin Into Your Lens Project

1. Install `Supabase Plugin` and `SupabaseClient` package from the Asset Library.
2. Log in using your Snapchat account.
3. In the Supabase panel (Window -> Supabase), create a new project or link an existing one.
4. Click `Import Credentials`, this generates a Supabase Project asset in your Lens.
5. Drag this asset into the `KindnessCounter` script’s Supabase Project input field.

All required objects and scripts are already set up in this project, but you should double-check that the correct inputs are assigned:

- Balloon prefabs: Make sure the balloon prefab array is populated in the `KindnessCounter` script inputs.
- Start and End Screen roots: Confirm `Start Root` and `End Root` are assigned to the correct scene object groups.
- UI Text component: Ensure the `Total Text` is linked to its corresponding Text component in the scene.

These references must be correctly assigned for the Lens to run without missing-input errors.

## How the System Works

Lens → Supabase

- User selects a balloon.
- User speaks: “I promise to be kind today”.
- Lens calls `pledge_and_total_once()`.
- Supabase:
  - Inserts user record once.
  - Trigger increments total once.
  - Returns new global total.

Supabase → Lens

- Lens receives the updated total.
- Displays end-screen.
- Spawns balloon prefabs (up to configured maximum)

Web App → Supabase

- Web app listens for changes and requests `get_kindness_total_all()`
- Updates the UI instantly when the total changes

To set up the web app separately, see the [WKD - Web App Setup Guide](https://developers.snap.com/spectacles/about-spectacles-features/snap-cloud/WKD/webapp-setup.md).

## Key Scripts

### KindnessCounter.ts

This script manages all interactions with Supabase. It authenticates the user, checks whether they have already pledged, calls the `pledge_and_total_once` RPC, retrieves the global total, and updates the Lens UI accordingly. It also controls whether the user sees the start screen or end screen and instantiates the balloon prefabs based on the total number of global pledges.

### BalloonsManager.ts

Handles all balloon interaction logic. Each balloon has an Interactable component that detects pinch gestures. When a user selects a balloon, this script triggers the pledge flow by calling `PledgeReadInOrder.init()` when pledge is done the `changeTransform` function in this script will be called which plays the balloon lift animation and calls `KindnessCounter.onBalloonSelected()`.

### PledgeReadInOrder.ts

Coordinates the voice interaction flow. After the user selects a balloon, this script activates the on-device ASR module and listens for the pledge phrase (e.g., “I promise to be kind today”). Once detected, it calles `BalloonsManager.changeTransform` to finalize the pledge and submit it to Supabase.

## Testing the Lens

### In Lens Studio Editor

1. Open the Preview panel in Lens Studio.
2. Set Device Type Override to `Spectacles (2024)`
3. Make sure your `SupabaseProject` credentials are imported and correctly assigned in the `KindnessCounter` script.
4. Use the Preview panel to test the flow:
   - Balloon interactions.
   - Voice pledge phrase.
   - Transitions between start and end screens.

### On Spectacles Device

1. Build and deploy the project to your Spectacles device.
2. Follow the [Spectacles guide](https://developers.snap.com/spectacles/get-started/start-building/preview-panel) for device testing.
3. Pinch a balloon to begin.
4. Speak your pledge (“I promise to be kind today”).
5. Watch your balloon float up.
6. The Lens will send your pledge to Supabase and display the updated global total on the end screen.

## Additional Resources

- [WKD - Supabase Setup Guide](https://developers.snap.com/spectacles/about-spectacles-features/snap-cloud/WKD/Snapcloud-setup.md) (backend configuration)
- [WKD - Web App Setup Guide](https://developers.snap.com/spectacles/about-spectacles-features/snap-cloud/WKD/webapp-setup.md) (frontend configuration)
- [Spectacles + Snap Cloud Overview](https://developers.snap.com/spectacles/about-spectacles-features/snap-cloud/overview)
- [Full Snap Cloud documentation site](https://cloud.snap.com/docs)


## Support

If you have any questions or need assistance, please don't hesitate to reach out. Our community is here to help, and you can connect with us and ask for support [here](https://www.reddit.com/r/Spectacles/). We look forward to hearing from you and are excited to assist you on your journey!

## Contributing

Feel free to provide improvements or suggestions or directly contributing via merge request. By sharing insights, you help everyone else build better Lenses.

---

*Built with 👻 by the Spectacles team*


 

 
