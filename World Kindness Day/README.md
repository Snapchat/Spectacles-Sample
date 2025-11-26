# World Kindness Day

[![SIK](https://img.shields.io/badge/SIK-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-interaction-kit/features/overview?) 
[![Cloud](https://img.shields.io/badge/Cloud-Light%20Gray?color=D3D3D3)](https://cloud.snap.com)
[![ASR](https://img.shields.io/badge/ASR-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/about-spectacles-features/apis/asr-module)
[![Gesture Module](https://img.shields.io/badge/Gesture%20Module-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/about-spectacles-features/apis/gesture-module?)

<img src="./README-ref/WKDLens.gif" alt="World Kindness Day Lens" width="500" />

## Overview

This Sample Project demonstrates how a Spectacles experience can send structured data to a database and how the same data can be displayed both inside the Lens and in an external web application.

As a real-world example, this project invites users to choose a balloon and speak a kindness pledge. When they do, the Lens writes a record to the database, and the global pledge counter updates instantly.

The companion web app that visualizes these pledges in real time can be found here:
World Kindness Day – Live Pledge Counter

> **NOTE:**
> This project will only work for the Spectacles platform. You must set the simulation mode on Lens Studio Preview to `Spectacles (2024)`.
> This project also requires you to set up your own Snap Cloud / Supabase project. Because this Lens writes and reads data from your Supabase instance, it will not function without completing the full backend setup.

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

Scene Objects

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

Scripts

- `KindnessCounter.ts`: Handles Supabase integration, pledge logic, totals, UI state.
- `BalloonsManager.ts`: Manages balloon interactions and triggers the pledge event.
- `ASR Voice Trigger Script`: Detects the spoken pledge phrase.

Assets

- `SpectaclesInteractionKit` package.
- `SupabaseClient` package.
- `SupabaseProject` credentials (imported via plugin)
- Prefabs (3 balloon variants)
- Materials, Textures, Scripts, Fonts, LSTween package .. etc.

## Initial Project Setup

### Set Up Your Snap Cloud Project

You will need a [Snap Cloud project](https://developers.snap.com/spectacles/about-spectacles-features/snap-cloud/getting-started) containing the same tables and RPC functions used in this Lens. At a high level, you must:

- Create the following tables:

    1. `kindness_pledges`:
        - One row per user
        - Enforces one-time pledge
        - Columns:
            - `user_id` - unique
            - `pledged_at` - timestamp
            - `pledge_date` - stored date
    2. `kindness_totals`: Stores daily and global totals.

- Create the following RPCs and triggers:

    1. `pledge_and_total_once()`: Ensures one pledge per user and returns the updated global total.
    ```
    declare
        t bigint := 0;
    begin
        insert into public.kindness_pledges (user_id, pledged_at)
        values (auth.uid(), now())
        on conflict (user_id) do nothing;

        -- bump_total_after_pledge trigger increments today's total only when a new pledge row is inserted
        select coalesce(sum(total), 0) into t
        from public.kindness_totals;

        return t;
    end;
    ```

    2. `bump_total_after_pledge` trigger: This trigger runs AFTER INSERT on the kindness_pledges table. Because the INSERT uses ON CONFLICT (user_id) DO NOTHING, the trigger only fires when a new row is actually inserted. If the insert is skipped due to conflict (repeat pledge), the trigger does NOT run. As a result, the daily total is only incremented when a user pledges for the first time.
    ```
    begin
        insert into public.kindness_totals (pledge_date, total)
        values (new.pledge_date, 1)
        on conflict (pledge_date)
        do update set total = public.kindness_totals.total + 1;
        return new;
    end;
    ```
    
    3. `get_kindness_total_all()`: Returns the global pledge total.
    ```
    select coalesce(sum(total), 0)
    from public.kindness_totals;
    ```
    
    4. `has_pledged_ever()`: Returns true if the current user already pledged.
    ```
    select exists(
        select 1
        from public.kindness_pledges
        where user_id = auth.uid()
    );
    ```

To learn how to create tables and functions in Supabase for Spectacles, see our documentation [here](https://developers.snap.com/spectacles/about-spectacles-features/snap-cloud/overview)


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
- [Spectacles + Snap Cloud Overview](https://developers.snap.com/spectacles/about-spectacles-features/snap-cloud/overview)
- [Companion Web App (Live Counter)](#)
- [Snap Cloud documentation site](https://cloud.snap.com/docs)

## Support

If you have any questions or need assistance, please don't hesitate to reach out. Our community is here to help, and you can connect with us and ask for support [here](https://www.reddit.com/r/Spectacles/). We look forward to hearing from you and are excited to assist you on your journey!

## Contributing

Feel free to provide improvements or suggestions or directly contributing via merge request. By sharing insights, you help everyone else build better Lenses.

---

*Built with 👻 by the Spectacles team*


 

 
