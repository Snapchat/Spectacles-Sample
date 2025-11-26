# Spectacles Interaction Kit (SIK)

The Spectacles Interaction Kit (SIK) is a set of tools, components, and assets designed to simplify the development of interactive augmented reality experiences for the Spectacles platform in Lens Studio. SIK provides reusable building blocks to help you create engaging AR content more efficiently.

## Documentation and API Reference

- **Getting Started**: Learn how to use SIK by following the [Get Started Guide](https://docs.snap.com/spectacles/spectacles-frameworks/spectacles-interaction-kit/get-started).
- **API Reference**: Explore the full API documentation for SIK [here](https://developers.snap.com/lens-studio/api/lens-scripting/interfaces/Packages_SpectaclesInteractionKit_SIK.SIKAPI.html).

## Release Notes

SIK is updated frequently. Stay informed about the latest features and fixes by checking the [Release Notes](https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-interaction-kit/release-notes).

## How to Set Up SIK in Your Project

### If Using a Starter Project
If you’re starting with one of the provided starter projects, the setup is already configured for you. You can begin building right away.

### If Adding SIK from the Asset Library
Follow these steps to configure SIK in your project:
1. **Add Device Tracking**: Ensure the main camera in your scene has a Device Tracking component with the tracking mode set to World.
2. **Set Device Type**: In the Preview Panel, set the device type override to Spectacles:
   - Go to the cogwheel in the top-right corner of the Preview Panel.
   - Select Device Type Override > Spectacles.
3. **Add the Prefab**: Drag and drop the SpectaclesInteractionKit prefab into the Scene Hierarchy.
4. **Set Platform to Spectacles**: In Project Settings > Platform Settings, select Spectacles and unselect other platforms.

You’re now ready to start building with SIK!