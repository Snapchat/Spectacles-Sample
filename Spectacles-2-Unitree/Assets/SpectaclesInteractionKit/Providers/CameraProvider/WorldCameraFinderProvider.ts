import {Singleton} from "../../Decorators/Singleton"
import BaseCameraFinderProvider from "./BaseCameraFinderProvider"

/**
 * Holds a reference to the world camera.
 */
@Singleton
export default class WorldCameraFinderProvider extends BaseCameraFinderProvider {
  public static getInstance: () => WorldCameraFinderProvider

  constructor() {
    super()
    const cameraComponent = this.lookForCameraComponent()

    if (!isNull(cameraComponent)) {
      this.setCamera(cameraComponent!)
    }
  }

  private lookForCameraComponent(): Camera | null {
    return this.bfsFromRoot(this.getSameRenderTargetCamera)
  }
}
