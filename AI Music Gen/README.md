# AI Music Gen

[![SIK](https://img.shields.io/badge/SIK-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-interaction-kit/features/overview) [![Remote Service Gateway](https://img.shields.io/badge/Remote%20Service%20Gateway-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/about-spectacles-features/apis/remoteservice-gateway) [![Speech To Text](https://img.shields.io/badge/Speech%20To%20Text-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/about-spectacles-features/compatibility-list) [![Lyria](https://img.shields.io/badge/Lyria-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/about-spectacles-features/compatibility-list) [![Snap3D](https://img.shields.io/badge/Snap3D-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/about-spectacles-features/apis/snap3d) [![Gemini](https://img.shields.io/badge/Gemini-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/about-spectacles-features/compatibility-list) [![Audio](https://img.shields.io/badge/Audio-Light%20Gray?color=D3D3D3)](https://developers.snap.com/lens-studio/features/audio/playing-audio) [![UIKit](https://img.shields.io/badge/UIKit-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-ui-kit)

<img src="./README-ref/sample-list-ai-music-gen-rounded-edges.gif" alt="AI Music Gen" width="500" />

## Overview

This is a sample project showing how to generate AI music using Google's Lyria model through Remote Service Gateway. Users can combine genres, vibes, and instruments to create custom music tracks with accompanying 3D visualizations powered by Snap3D.

> **NOTE:**
> This project will only work for the Spectacles platform. You must set the simulation mode on Lens Studio Preview to `Spectacles (2024)`.
> You must also provide your own Remote Service Gateway Key to use the functionality provided by this project.

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

## Initial Project Setup

In order to use this project and call Remote Service Gateway APIs, you need to:

1. Install the Remote Service Gateway Token Generator plug-in from the Asset Browser
2. Go to Window -> Remote Service Gateway Token
3. Click "Generate Token"
4. Copy paste the token into the "RemoteServiceGatewayCredentials" object in the Inspector

## Key Features

### Music Generation with Lyria

This lens connects to Google's Lyria music generation model to create original music tracks from text prompts. The system combines user-selected genres, vibes, and instruments into optimized prompts using Gemini, then generates audio using Lyria.

**Available Categories:**
- **Genres** (34 options): Jazz, Chiptune, Hyperpop, Rock, Pop, Hip Hop, R&B, Electronic, Classical, Country, Metal, Blues, Reggae, Folk, Indie, Punk, Soul, Funk, Disco, Techno, House, Dubstep, Ambient, Lofi, Trap, Latin, K-Pop, J-Pop, EDM, Alternative, Grunge, Synthwave, Afrobeat, Experimental
- **Vibes** (30 options): Nature, Medieval, Upbeat, Chill, Energetic, Melancholic, Dreamy, Epic, Mysterious, Romantic, Nostalgic, Futuristic, Peaceful, Intense, Ethereal, Urban, Tropical, Dramatic, Playful, Inspirational, Cinematic, Funky, Retro, Ambient, Dark, Festive, Soothing, Whimsical, Elegant, Suspenseful
- **Instruments** (35 options): Guitar, Piano, Accordion, Violin, Drums, Saxophone, Bass, Flute, Trumpet, Synthesizer, Cello, Harp, Banjo, Clarinet, Ukulele, Trombone, Xylophone, Organ, Harmonica, Mandolin, Bongos, Oboe, Electric Guitar, Tambourine, Marimba, Bagpipes, Sitar, Theremin, Steel Drums, Kalimba, Djembe, Keytar, Harpsichord, Viola, Bassoon

### Voice Input

Users can add custom music elements through voice commands using the ASR Module with high-accuracy transcription mode.

### 3D Visualization with Snap3D

Each generated music track is accompanied by a 3D object that represents the musical concept. The system uses Gemini to generate optimized prompts for Snap3D, creating stylized visual representations of the music.

### Hand-Docked Menu System

The interface uses hand tracking to display an interactive menu on the user's left hand. The menu activates when the palm faces the camera and includes categories for browsing genres, vibes, and instruments.

## Key Scripts

### MusicGenerator.ts

This script orchestrates the music generation pipeline. It combines user selections into a single prompt using Gemini's structured output, then submits the request to Lyria. The `combineGenresToPrompt` method crafts optimized prompts following best practices for music generation, including genre/style, mood, tempo, rhythm, instruments, arrangement, and production quality.

### MusicObject.ts

Manages individual music track objects with 3D visualization. When a track is created, it generates a corresponding 3D object using Snap3D, handles audio playback, and provides play/close controls. The object animates in with a scale transition and orients itself toward the user.

### MusicPlayer.ts

Handles audio playback using the DynamicAudioOutput component. Initializes at 48kHz sample rate and manages PCM16 audio frames from Lyria's base64-encoded output.

### SelectionController.ts

Manages the selection list using an object pool pattern with 30 pre-allocated prompt objects. Handles adding/removing items, scroll management, duplicate prevention, and animates the generate button based on selection state.

### SecondaryUIController.ts

Controls the category selection interface with dynamic scrolling for each category (Genres, Vibes, Instruments). Manages a grid layout system and reuses UI elements efficiently across category switches.

### Snap3DObject.ts

Displays 3D models and preview images. Shows a preview image while generating, then transitions to the 3D mesh (base mesh followed by refined mesh). Includes loading spinner and error state handling.

## Helper Scripts

### ASRQueryController.ts

Implements voice input using the ASR Module. Configured for high-accuracy mode with 1.5-second silence detection for automatic termination. Includes visual activity indicator during recording.

### HandDockedMenu.ts

Provides hand-tracking menu functionality. Tracks the left hand position and displays menu buttons when the palm faces the camera. Includes smooth positioning and billboard rotation toward the user.

### PromptObject.ts

Individual prompt display component with scale-based animations. Reusable design for object pool management with ease-out-back entrance and ease-in-back exit animations.

### Adder.ts

Category selection buttons that display emoji and text. Integrates with the SelectionController to add items to the selection list.

### APIKeyHint.ts

Displays user feedback when the Remote Service Gateway API token is not configured.

## Data Files

Music categories are defined in TypeScript data classes:

- **GenresData.ts**: 34 music genres with emoji mappings
- **VibesData.ts**: 30 mood/vibe options with emoji mappings
- **InstrumentsData.ts**: 35 instrument options with emoji mappings

## Testing the Lens

### In Lens Studio Editor

1. Open the Preview panel in Lens Studio.
2. Set Device Type Override to `Spectacles (2024)`
3. Ensure your Remote Service Gateway key is correctly set to see accurate results.
4. Test UI interactions in editor mode (menu auto-shows).

### On Spectacles Device

1. Build and deploy the project to your Spectacles device.
2. Follow the [Spectacles guide](https://developers.snap.com/spectacles/get-started/start-building/preview-panel) for device testing.
3. Show your left palm facing the camera to activate the menu.
4. Navigate through categories and select items.
5. Press Generate to create your music track.
6. Wait for 3D visualization to complete.
7. Press Play to hear your generated music.

## Lyria Disclaimer

Ensure that you comply with [Google's Lyria terms of service](https://ai.google.dev/gemini-api/terms) when deploying this project. Generated music is subject to Google's usage policies.

## Gemini Disclaimer

Ensure that you comply with [Gemini's API usage policies](https://ai.google.dev/gemini-api/terms) and [Spectacles' terms of service](https://www.snap.com/terms/spectacles) when deploying this project.

## Snap3D Disclaimer

Ensure that you comply with [Snap's content policies](https://www.snap.com/terms/spectacles) when generating 3D content. This project enforces G-rated content filtering.

## Support

If you have any questions or need assistance, please don't hesitate to reach out. Our community is here to help, and you can connect with us and ask for support [here](https://www.reddit.com/r/Spectacles/). We look forward to hearing from you and are excited to assist you on your journey!

## Contributing

Feel free to provide improvements or suggestions or directly contributing via merge request. By sharing insights, you help everyone else build better Lenses.

---

*Built with 👻 by the Spectacles team*


 

 
