<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./_README-ref/spectacles-logo-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="/_README-ref/spectacles-logo-light.svg">
  <img alt="Spectacles Logo" src="path/to/light-mode-image.png" width="300">
</picture>


<img src="./_README-ref/spectacles-2024-hero.png" alt="spectacles-2024-hero" width="900" style="border-radius: 15px; margin-bottom: 10px;" />

# Spectacles Sample Projects

This repository contains sample projects for [Spectacles (2024)](https://developers.snap.com/spectacles/get-started/introduction). Spectacles Lenses and experiences are powered by SnapOS, utilizing [Lens Studio](https://developers.snap.com/lens-studio/overview/getting-started/lens-studio-overview) as the authoring tool.

Interested in joining the Spectacles Developer Program? [Apply here](https://www.spectacles.com/lens-studio).

For guidance on building for Spectacles, refer to this [tutorial](https://developers.snap.com/spectacles/get-started/start-buiding/build-your-first-spectacles-lens-tutorial).

New to spatial experiences? Explore our [Introduction to Spatial Design](https://developers.snap.com/spectacles/best-practices/design-for-spectacles/introduction-to-spatial-design).

## Prerequisites

> **Large Files Storage:**
> Many of these projects uses Git Large Files Support (LFS). Downloading a zip file using the green button on GitHub **will not work**. You must clone the project with a version of git that has LFS.
> You can download Git LFS [here](https://git-lfs.github.com/).
> Some developers experienced a "Long Path Error" in the process of cloning. You can see the resolution [here](https://www.reddit.com/r/Spectacles/comments/1hry5wj/comment/m54ij8l/?context=3).

#### Install Git LFS

```sh
# Install Git LFS
git lfs install

# Clone the repository with LFS support
git clone git@github.com:Snapchat/Spectacles-Sample.git

```

> **API Keys:**
> If some project take advantage of the Open AI API, You must provide your own OpenAI API key to use the functionalities provided by the project.

To update your Spectacles device and mobile app, please refer to this [guide](https://support.spectacles.com/hc/en-us/articles/30214953982740-Updating).

You can download the latest version of Lens Studio from [here](https://ar.snap.com/download?lang=en-US).

Lens Studio's Experimental APIs checkbox must be enabled in some of the projects in order to access certain features, for example "Camera Access". Please see Experimental APIs for more details [here](https://developers.snap.com/spectacles/about-spectacles-features/apis/experimental-apis).

Extended Permissions mode on device must be enabled in some of the projects to access certain features. Please see Extended Permissions for more details [here](https://developers.snap.com/spectacles/permission-privacy/extended-permissions).

# Content

<table>
  <tr>
    <td align="center" valign="top" width="33%" style="padding-top: 20px;" >
      <a href="#">
        <img src="./AI Assistant/README-ref/sample-list-ai-assistant-rounded-edges.gif" alt="ai-assistant" width="250px" />
      </a>
      <h3>AI Assistant</h3>
      <p>
       <a href="https://developers.snap.com/spectacles/about-spectacles-features/apis/experimental-apis?">
  <img src="https://img.shields.io/badge/Experimental%20API-Light%20Gray?color=D3D3D3" />
</a>
<a href="https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-interaction-kit/features/overview?">
  <img src="https://img.shields.io/badge/SIK-Light%20Gray?color=D3D3D3" />
</a>
<a href="https://platform.openai.com/docs/guides/text-to-speech?">
  <img src="https://img.shields.io/badge/Text%20To%20Speech-Light%20Gray?color=D3D3D3" />
</a>
<a href="https://platform.openai.com/docs/guides/speech-to-text?">
  <img src="https://img.shields.io/badge/Speech%20To%20Text-Light%20Gray?color=D3D3D3" />
</a>
<a href="https://developers.snap.com/spectacles/about-spectacles-features/apis/camera-module?">
  <img src="https://img.shields.io/badge/Camera%20Access-Light%20Gray?color=D3D3D3" />
</a>
<a href="https://developers.snap.com/spectacles/about-spectacles-features/compatability-list">
  <img src="https://img.shields.io/badge/AI%20Vision-Light%20Gray?color=D3D3D3" />
</a>
<a href="https://platform.openai.com/docs/guides/text-generation?">
  <img src="https://img.shields.io/badge/LLM-Light%20Gray?color=D3D3D3" />
</a>
<a href="https://platform.openai.com/docs/guides/vision?">
  <img src="https://img.shields.io/badge/Vision-Light%20Gray?color=D3D3D3" />
</a>
<a href="https://developers.snap.com/spectacles/about-spectacles-features/apis/fetch?">
  <img src="https://img.shields.io/badge/Fetch-Light%20Gray?color=D3D3D3" />
</a>
      </p>
      <p>AI-powered vision assistant using Spectacles ML APIs.</p>
    </td>
 <td align="center" valign="top" width="33%" style="padding-top: 20px;" >
      <a href="#">
        <img src="./Air Hockey/README-ref/sample-list-air-hockey-rounded-edges.gif" alt="air-hockey" width="250px" />
      </a>
      <h3>Air Hockey</h3>
      <p>
<a href="https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-interaction-kit/features/overview?">
  <img src="https://img.shields.io/badge/SIK-Light%20Gray?color=D3D3D3" />
</a>
<a href="https://developers.snap.com/spectacles/about-spectacles-features/connected-lenses/overview?">
  <img src="https://img.shields.io/badge/Networking-Light%20Gray?color=D3D3D3" />
</a>
<a href="https://developers.snap.com/spectacles/about-spectacles-features/connected-lenses/overview?">
  <img src="https://img.shields.io/badge/Connected%20Lenses-Light%20Gray?color=D3D3D3" />
</a>
<a href="https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-interaction-kit/features/overview?">
  <img src="https://img.shields.io/badge/Sync%20Kit-Light%20Gray?color=D3D3D3" />
</a>
<a href="https://developers.snap.com/lens-studio/features/lens-cloud/lens-cloud-overview?">
  <img src="https://img.shields.io/badge/Multiplayer-Light%20Gray?color=D3D3D3" />
</a>
      </p>
      <p>Sample Connected Lens project using Spectacles Sync Kit.</p>
    </td>
 <td align="center" valign="top" width="33%">
      <a href="#">
        <img src="./Crop/README-ref/sample-list-crop-rounded-edges.gif" alt="crop" width="250px" />
      </a>
      <h3>Crop</h3>
      <p>
<a href="https://developers.snap.com/spectacles/about-spectacles-features/apis/experimental-apis?">
  <img src="https://img.shields.io/badge/Experimental%20API-Light%20Gray?color=D3D3D3" />
</a>
<a href="https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-interaction-kit/features/overview?">
  <img src="https://img.shields.io/badge/SIK-Light%20Gray?color=D3D3D3" />
</a>
<a href="https://platform.openai.com/docs/guides/text-to-speech?">
  <img src="https://img.shields.io/badge/Text%20To%20Speech-Light%20Gray?color=D3D3D3" />
</a>
<a href="https://platform.openai.com/docs/guides/speech-to-text?">
  <img src="https://img.shields.io/badge/Speech%20To%20Text-Light%20Gray?color=D3D3D3" />
</a>
<a href="https://developers.snap.com/spectacles/about-spectacles-features/apis/camera-module?">
  <img src="https://img.shields.io/badge/Camera%20Access-Light%20Gray?color=D3D3D3" />
</a>
<a href="https://developers.snap.com/spectacles/about-spectacles-features/compatability-list">
  <img src="https://img.shields.io/badge/AI%20Vision-Light%20Gray?color=D3D3D3" />
</a>
<a href="https://platform.openai.com/docs/guides/text-generation?">
  <img src="https://img.shields.io/badge/LLM-Light%20Gray?color=D3D3D3" />
</a>
<a href="https://platform.openai.com/docs/guides/vision?">
  <img src="https://img.shields.io/badge/Vision-Light%20Gray?color=D3D3D3" />
</a>
<a href="https://developers.snap.com/spectacles/about-spectacles-features/apis/fetch?">
  <img src="https://img.shields.io/badge/Fetch-Light%20Gray?color=D3D3D3" />
</a>
<a href="https://developers.snap.com/spectacles/about-spectacles-features/apis/web-view?">
  <img src="https://img.shields.io/badge/Web%20View-Light%20Gray?color=D3D3D3" />
</a>
<a href="https://developers.snap.com/spectacles/about-spectacles-features/apis/gesture-module?">
  <img src="https://img.shields.io/badge/Gesture%20Module-Light%20Gray?color=D3D3D3" />
</a>
      </p>
      <p>Sample project showing how to "crop" the environment using hand gesture.</p>
    </td>
  </tr>
  <tr>
    <td align="center" valign="top" width="33%">
      <a href="#">
        <img src="./Fetch/README-ref/sample-list-fetch-rounded-edges.gif" alt="fetch" width="250px" />
      </a>
      <h3>Fetch</h3>
      <p>
<a href="https://developers.snap.com/spectacles/about-spectacles-features/apis/experimental-apis?">
  <img src="https://img.shields.io/badge/Experimental%20API-Light%20Gray?color=D3D3D3" />
</a>
<a href="https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-interaction-kit/features/overview?">
  <img src="https://img.shields.io/badge/SIK-Light%20Gray?color=D3D3D3" />
</a>
<a href="https://developers.snap.com/spectacles/about-spectacles-features/apis/fetch?">
  <img src="https://img.shields.io/badge/Fetch-Light%20Gray?color=D3D3D3" />
</a>
<a href="https://developers.snap.com/spectacles/about-spectacles-features/apis/web-view?">
  <img src="https://img.shields.io/badge/Web%20View-Light%20Gray?color=D3D3D3" />
</a>
      </p>
      <p>Sample project using the Spectacles Fetch API.</p>
    </td>
    <td align="center" valign="top" width="33%">
      <a href="#">
        <img src="./High Five/README-ref/sample-list-high-five-rounded-edges.gif" alt="high-five" width="250px" />
      </a>
      <h3>High Five</h3>
      <p>
<a href="https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-interaction-kit/features/overview?">
  <img src="https://img.shields.io/badge/SIK-Light%20Gray?color=D3D3D3" />
</a>
<a href="https://developers.snap.com/spectacles/about-spectacles-features/connected-lenses/overview?">
  <img src="https://img.shields.io/badge/Networking-Light%20Gray?color=D3D3D3" />
</a>
<a href="https://developers.snap.com/spectacles/about-spectacles-features/connected-lenses/overview?">
  <img src="https://img.shields.io/badge/Connected%20Lenses-Light%20Gray?color=D3D3D3" />
</a>
<a href="https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-interaction-kit/features/overview?">
  <img src="https://img.shields.io/badge/Sync%20Kit-Light%20Gray?color=D3D3D3" />
</a>
<a href="https://developers.snap.com/lens-studio/features/lens-cloud/lens-cloud-overview?">
  <img src="https://img.shields.io/badge/Multiplayer-Light%20Gray?color=D3D3D3" />
</a>
      </p>
      <p>Real-time collaborative AR experience for high-five interactions.</p>
    </td>
    <td align="center" valign="top" width="33%">
      <a href="#">
        <img src="./Material Library/README-ref/sample-list-material-library-rounded-edges.gif" alt="material-library" width="250px" />
      </a>
      <h3>Material Library</h3>
      <p>
<a href="https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-interaction-kit/features/overview?">
  <img src="https://img.shields.io/badge/SIK-Light%20Gray?color=D3D3D3" />
</a>
<a href="https://developers.snap.com/lens-studio/features/graphics/materials/overview?">
  <img src="https://img.shields.io/badge/Graphics%2C%20Materials%20and%20Particles-Light%20Gray?color=D3D3D3" />
</a>
<a href="https://developers.snap.com/lens-studio/features/graphics/materials/overview?">
  <img src="https://img.shields.io/badge/Shaders-Light%20Gray?color=D3D3D3" />
</a>
<a href="https://developers.snap.com/lens-studio/features/graphics/materials/post-effects?">
  <img src="https://img.shields.io/badge/Post%20Effects-Light%20Gray?color=D3D3D3" />
</a>
      </p>
      <p>Experimental project collecting Materials tested on Spectacles.</p>
    </td>
  </tr>
  <tr>
    <td align="center" valign="top" width="33%">
      <a href="#">
        <img src="./Outdoor Navigation/README-ref/sample-list-outdoor-navigation-rounded-edges.gif" alt="outdoor-navigation" width="250px" />
      </a>
      <h3>Outdoor Navigation</h3>
      <p>
<a href="https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-interaction-kit/features/overview?">
  <img src="https://img.shields.io/badge/SIK-Light%20Gray?color=D3D3D3" />
</a>
<a href="https://developers.snap.com/lens-studio/features/location-ar/custom-landmarker?">
  <img src="https://img.shields.io/badge/Location%20AR-Light%20Gray?color=D3D3D3" />
</a>
<a href="https://developers.snap.com/spectacles/about-spectacles-features/compatability-list?">
  <img src="https://img.shields.io/badge/Outdoor%20Navigation-Light%20Gray?color=D3D3D3" />
</a>
<a href="https://developers.snap.com/lens-studio/features/location-ar/map-component?">
  <img src="https://img.shields.io/badge/Map%20Component-Light%20Gray?color=D3D3D3" />
</a>
<a href="https://developers.snap.com/lens-studio/features/remote-apis/snap-places-api?">
  <img src="https://img.shields.io/badge/Places-Light%20Gray?color=D3D3D3" />
</a>
      </p>
      <p>Outdoor navigation system using Map Component and Places API.</p>
    </td>
    <td align="center" valign="top" width="33%">
      <a href="#">
        <img src="./Shared Sync Controls/README-ref/sample-list-shared-sync-controls-rounded-edges.gif" alt="shared-sync-controls" width="250px" />
      </a>
      <h3>Shared Sync Controls</h3>
      <p>
<a href="https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-interaction-kit/features/overview?">
  <img src="https://img.shields.io/badge/SIK-Light%20Gray?color=D3D3D3" />
</a>
<a href="https://developers.snap.com/spectacles/about-spectacles-features/connected-lenses/overview?">
  <img src="https://img.shields.io/badge/Networking-Light%20Gray?color=D3D3D3" />
</a>
<a href="https://developers.snap.com/spectacles/about-spectacles-features/connected-lenses/overview?">
  <img src="https://img.shields.io/badge/Connected%20Lenses-Light%20Gray?color=D3D3D3" />
</a>
<a href="https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-interaction-kit/features/overview?">
  <img src="https://img.shields.io/badge/Sync%20Kit-Light%20Gray?color=D3D3D3" />
</a>
<a href="https://developers.snap.com/lens-studio/features/lens-cloud/lens-cloud-overview?">
  <img src="https://img.shields.io/badge/Multiplayer-Light%20Gray?color=D3D3D3" />
</a>
      </p>
      <p>Real-time collaborative AR experience for shared controls.</p>
    </td>
    <td align="center" valign="top" width="33%">
      <a href="#">
        <img src="./Spatial Persistence/README-ref/sample-list-spatial-persistance-rounded-edges.gif" alt="spatial-persistance" width="250px" />
      </a>
      <h3>Spatial Persistence</h3>
      <p>
<a href="https://developers.snap.com/spectacles/about-spectacles-features/apis/spatial-anchors?">
  <img src="https://img.shields.io/badge/Spatial%20Anchors-Light%20Gray?color=D3D3D3" />
</a>
<a href="https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-interaction-kit/features/overview?">
  <img src="https://img.shields.io/badge/SIK-Light%20Gray?color=D3D3D3" />
</a>
<a href="https://developers.snap.com/lens-studio/features/persistent-cloud-storage/overview?">
  <img src="https://img.shields.io/badge/Persistent%20Storage-Light%20Gray?color=D3D3D3" />
</a>
<a href="https://developers.snap.com/lens-studio/features/lens-cloud/lens-cloud-overview?">
  <img src="https://img.shields.io/badge/Multiplayer-Light%20Gray?color=D3D3D3" />
</a>
      </p>
      <p>Template project using Spectacles Spatial Anchor API.</p>
    </td>
  </tr>
  <tr>
    <td align="center" valign="top" width="33%">
      <a href="#">
        <img src="./Throw Lab/README-ref/sample-list-throw-lab-rounded-edges.gif" alt="throw-lab" width="250px" />
      </a>
      <h3>Throw Lab</h3>
      <p>
<a href="https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-interaction-kit/features/overview?">
  <img src="https://img.shields.io/badge/SIK-Light%20Gray?color=D3D3D3" />
</a>
<a href="https://developers.snap.com/lens-studio/features/physics/physics-overview?">
  <img src="https://img.shields.io/badge/Physics-Light%20Gray?color=D3D3D3" />
</a>
<a href="https://developers.snap.com/spectacles/about-spectacles-features/apis/gesture-module?">
  <img src="https://img.shields.io/badge/Gesture%20Module-Light%20Gray?color=D3D3D3" />
</a>
      </p>
      <p>Sample project demonstrating realistic throwing mechanics in AR.</p>
    </td>
    <td align="center" valign="top" width="33%">
      <a href="#">
        <img src="./Tic Tac Toe/README-ref/sample-list-tic-tac-toe-rounded-edges.gif" alt="tic-tac-toe" width="250px" />
      </a>
      <h3>Tic Tac Toe</h3>
      <p>
<a href="https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-interaction-kit/features/overview?">
  <img src="https://img.shields.io/badge/SIK-Light%20Gray?color=D3D3D3" />
</a>
<a href="https://developers.snap.com/spectacles/about-spectacles-features/connected-lenses/overview?">
  <img src="https://img.shields.io/badge/Networking-Light%20Gray?color=D3D3D3" />
</a>
<a href="https://developers.snap.com/spectacles/about-spectacles-features/connected-lenses/overview?">
  <img src="https://img.shields.io/badge/Connected%20Lenses-Light%20Gray?color=D3D3D3" />
</a>
<a href="https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-interaction-kit/features/overview?">
  <img src="https://img.shields.io/badge/Sync%20Kit-Light%20Gray?color=D3D3D3" />
</a>
<a href="https://developers.snap.com/lens-studio/features/lens-cloud/lens-cloud-overview?">
  <img src="https://img.shields.io/badge/Multiplayer-Light%20Gray?color=D3D3D3" />
</a>
      </p>
      <p>Sample Connected Lens project using Spectacles Sync Kit.</p>
    </td>
    <td align="center" valign="top" width="33%">
      <a href="#">
        <img src="./Voice Playback/README-ref/sample-list-voice-playback-rounded-edges.gif" alt="voice-playback" width="250px" />
      </a>
      <h3>Voice Playback</h3>
      <p>
<a href="https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-interaction-kit/features/overview?">
  <img src="https://img.shields.io/badge/SIK-Light%20Gray?color=D3D3D3" />
</a>
<a href="https://developers.snap.com/lens-studio/features/audio/playing-audio?">
  <img src="https://img.shields.io/badge/Audio-Light%20Gray?color=D3D3D3" />
</a>
      </p>
      <p>Sample project for recording and playing back audio on Spectacles.</p>
    </td>
  </tr>
  <tr>
      <td align="center" valign="top" width="33%">
      <a href="#">
        <img src="./Custom Locations/README-ref/scan-sample.gif" alt="custom-locations" width="250px" />
      </a>
      <h3>Custom Locations</h3>
      <p>
<a href="https://developers.snap.com/spectacles/about-spectacles-features/apis/custom-locations">
  <img src="https://img.shields.io/badge/Location%20AR-Light%20Gray?color=D3D3D3" />
</a>
      </p>
      <p>Map real life areas and create AR experiences around those locations.</p>
    </td>
          <td align="center" valign="top" width="33%">
      <a href="#">
        <img src="./Path Pioneer/README-ref/sample-list-path-pioneer-rounded-edges.gif" alt="path-pioneer" width="250px" />
      </a>
      <h3>Path Pioneer</h3>
      <p>
<a href="https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-interaction-kit/features/overview?">
  <img src="https://img.shields.io/badge/SIK-Light%20Gray?color=D3D3D3" />
</a>
<a href="https://developers.snap.com/lens-studio/api/lens-scripting/classes/Built-In.RayCastHit.html">
  <img src="https://img.shields.io/badge/Raycast-Light%20Gray?color=D3D3D3" />
</a>
<a href="https://developers.snap.com/lens-studio/features/graphics/materials/overview">
  <img src="https://img.shields.io/badge/Graphics%20Material%20Particles-Light%20Gray?color=D3D3D3" />
</a>
      </p>
      <p>Sample project for path creation and path walking experience.</p>
    </td>
        </td>
          <td align="center" valign="top" width="33%">
      <a href="#">
        <img src="./Spatial Image Gallery/README-ref/spatial-image-example.gif" alt="spatial-image" width="250px" />
      </a>
      <h3>Spatial Image Gallery</h3>
      <p>
<a href="https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-interaction-kit/features/overview?">
  <img src="https://img.shields.io/badge/SIK-Light%20Gray?color=D3D3D3" />
</a>
      </p>
     <p>Convert your 2D images to 3D.</p>
    </td>
  </tr>
  <tr>
    <td align="center" valign="top" width="33%">
      <a href="#">
        <img src="./Remote Object Detection/README-ref/sample-list-remote-object-detection-rounded-edges.gif" alt="remote-object-detection" width="250px" />
      </a>
      <h3>Remote Object Detection</h3>
      <p>
        <a href="https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-interaction-kit/features/overview?">
          <img src="https://img.shields.io/badge/SIK-Light%20Gray?color=D3D3D3" />
        </a>
        <a href="https://developers.snap.com/lens-studio/features/ar-tracking/world/overview">
          <img src="https://img.shields.io/badge/World%20Tracking-Light%20Gray?color=D3D3D3" />
        </a>
        <a href="https://developers.snap.com/lens-studio/features/ar-tracking/world/object-tracking">
          <img src="https://img.shields.io/badge/Object%20Tracking-Light%20Gray?color=D3D3D3" />
        </a>
        <a href="https://developers.snap.com/spectacles/about-spectacles-features/apis/camera-module?">
          <img src="https://img.shields.io/badge/Camera%20Access-Light%20Gray?color=D3D3D3" />
        </a>
        <a href="https://developers.snap.com/spectacles/about-spectacles-features/apis/fetch?">
          <img src="https://img.shields.io/badge/Fetch-Light%20Gray?color=D3D3D3" />
        </a>
        <a href="https://developers.snap.com/lens-studio/api/lens-scripting/classes/Built-In.RayCastHit.html">
          <img src="https://img.shields.io/badge/Raycast-Light%20Gray?color=D3D3D3" />
        </a>
      </p>
      <p>Detect objects around you.</p>
    </td>
      <td align="center" valign="top" width="33%">
      <a href="#">
        <img src="./Public Speaker/README-ref/public-speaker-rounded-edges.gif" alt="public-speaker" width="250px" />
      </a>
      <h3>Public Speaker</h3>
      <p>
        <a href="https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-interaction-kit/features/overview?">
          <img src="https://img.shields.io/badge/SIK-Light%20Gray?color=D3D3D3" />
        </a>
        <a href="https://developers.snap.com/lens-studio/features/audio/playing-audio?">
          <img src="https://img.shields.io/badge/Audio-Light%20Gray?color=D3D3D3" />
        </a>
        <a href="https://developers.snap.com/spectacles/about-spectacles-features/apis/gesture-module?">
          <img src="https://img.shields.io/badge/Gesture%20Module-Light%20Gray?color=D3D3D3" />
        </a>
        <a href="https://developers.snap.com/spectacles/about-spectacles-features/apis/motion-controller?">
          <img src="https://img.shields.io/badge/Motion%20Controller-Light%20Gray?color=D3D3D3" />
        </a>
      </p>
      <p>Teleprompter lens for public speaking practice and presentation delivery.</p>
    </td>
         <td align="center" valign="top" width="33%">
      <a href="#">
        <img src="./Essentials/README-ref/sample-list-essentials.gif" alt="public-speaker" width="250px" />
      </a>
      <h3>Essentials</h3>
      <p>
        <a href="https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-interaction-kit/features/overview?">
          <img src="https://img.shields.io/badge/SIK-Light%20Gray?color=D3D3D3" />
        </a>
        <a href="https://developers.snap.com/lens-studio/features/physics/physics-overview?">
          <img src="https://img.shields.io/badge/Physics-Light%20Gray?color=D3D3D3" />
        </a>
        <a href="https://developers.snap.com/spectacles/about-spectacles-features/apis/gesture-module?">
          <img src="https://img.shields.io/badge/Gesture%20Module-Light%20Gray?color=D3D3D3" />
        </a>
        <a href="https://developers.snap.com/lens-studio/api/lens-scripting/modules/Packages_LSTween_LSTween.html?">
          <img src="https://img.shields.io/badge/Animation-Light%20Gray?color=D3D3D3" />
        </a>
        <a href="https://developers.snap.com/lens-studio/4.55.1/references/guides/lens-features/physics/raycast?">
          <img src="https://img.shields.io/badge/Raycast-Light%20Gray?color=D3D3D3" />
        </a>
      </p>
      <p>Collection of foundational concepts for creating lenses in Lens Studio.</p>
    </td>
    <td align="center" valign="top" width="33%">
      <!-- Third cell can be left empty or filled with another sample -->
    </td>
  </tr>
</table>

## Community Samples

<table>
  <tr>
    <td align="center" valign="top" width="33%" style="padding-top: 20px;" >
      <a href="#">
        <img src="./Spectacles-2-Unitree/README-ref/sample-list-unitree.gif" alt="spectacles-2-unitree" width="250px" />
      </a>
      <h3>Spectacles to Unitree Teleoperation</h3>
      <p>
      <a href="https://developers.snap.com/spectacles/about-spectacles-features/apis/gesture-module"><img src="https://img.shields.io/badge/Gesture%20Module-Light%20Gray?color=D3D3D3"/></a>
      <a href="https://developers.snap.com/spectacles/about-spectacles-features/apis/web-socket"><img src="https://img.shields.io/badge/WebSocket-Light%20Gray?color=D3D3D3"/></a>
      <a href="https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-interaction-kit/features/overview"><img src="https://img.shields.io/badge/SIK-Light%20Gray?color=D3D3D3"/></a>
      </p>
      <p>Simulate or remote control a humanoid robot by copying your hand movements</p>
    </td>
 <td align="center" valign="top" width="33%" style="padding-top: 20px;" >

  </td>
 <td align="center" valign="top" width="33%">

  </td>
  </tr>
</table>

## Support

If you have any questions or need assistance, please don't hesitate to reach out. Our community is here to help, and you can connect with us and ask for support [here](https://www.reddit.com/r/Spectacles/). We look forward to hearing from you and are excited to assist you on your journey!

