import {Singleton} from "../../Decorators/Singleton"
import {validate} from "../../Utils/validate"
import BaseCameraFinderProvider from "./BaseCameraFinderProvider"

/**
 * Holds a reference to the AR camera.
 *
 * @remarks
 * AR camera is defined as the {@link Camera} in the scene that has a {@link deviceTrackingComponent}
 *  with tracking mode set to World.
 */
@Singleton
export default class ARCameraFinderProvider extends BaseCameraFinderProvider {
  public static getInstance: () => ARCameraFinderProvider

  constructor() {
    super()
    const cameraComponent = this.lookForWorldCameraComponent()
    validate(cameraComponent)
    this.setCamera(cameraComponent)
  }

  /**
   * Augments the {@link getSameRenderTargetCamera} predicate with a check for Device
   * Tracking being World.
   *
   * @returns A {@link Camera} setup for AR.
   */
  private lookForWorldCameraComponent(): Camera | null {
    const predicate = (object: SceneObject): Camera | null => {
      const camera = this.getSameRenderTargetCamera(object)

      if (camera === null) {
        return null
      }

      const deviceTracking = object.getComponent("Component.DeviceTracking")
      if (deviceTracking.getActualDeviceTrackingMode() === DeviceTrackingMode.World) {
        return camera
      } else {
        return null
      }
    }

    return this.bfsFromRoot(predicate)
  }
}
