import {VersionNumber} from "../../VersionNumber"

/**
 * This class is responsible for validating the configuration settings for running the Spectacles Interaction Kit (SIK) in Lens Studio.
 *
 */
@component
export class ConfigurationValidator extends BaseScriptComponent {
  onAwake(): void {
    if (!global.deviceInfoSystem.isSpectacles() && global.deviceInfoSystem.isEditor()) {
      throw new Error(
        "To run Spectacles Interaction Kit in the Lens Studio Preview, set the Preview Panel's Device Type Override to Spectacles, or the Simulation Mode to Spectacles (2024)!"
      )
    }

    print("SIK Version : " + VersionNumber)
  }
}
