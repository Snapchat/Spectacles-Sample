import {Singleton} from "../Decorators/Singleton"

/**
 * This class helps bridge native SIK components with SpectaclesSyncKit if
 * SpectaclesSyncKit is present in the lens and isSynced is enabled for certain SIK
 * components, such as ScrollView, Slider, ToggleButton, Container, and InteractableManipulation.
 *
 * This class is not meant to be used by developers for syncing logic, please use SpectaclesSyncKit
 * APIs directly!
 */
@Singleton
export class SyncKitBridge {
  public static getInstance: () => SyncKitBridge

  public get SyncEntity() {
    return (global as any).SyncEntity
  }

  public get networkIdTools() {
    return (global as any).networkIdTools
  }

  public get sessionController() {
    return (global as any).sessionController
  }

  /**
   * Create a SyncEntity for a given script if SyncKit is present within the lens.
   * @param script - the given script to attach the SyncEntity to.
   * @returns a SyncEntity if SyncKit is present, null if otherwise.
   */
  public createSyncEntity(script: ScriptComponent) {
    if (this.SyncEntity === undefined || this.networkIdTools === undefined) {
      return null
    } else {
      const networkIdOptions = new this.networkIdTools.NetworkIdOptions(this.networkIdTools.NetworkIdType.Hierarchy)
      const syncEntity = new this.SyncEntity(
        script,
        undefined,
        false,
        RealtimeStoreCreateOptions.Persistence.Session,
        networkIdOptions
      )
      return syncEntity
    }
  }

  /**
   * Maps a world mat4 into a mat4 local to the LocatedAt component's transform.
   */
  public worldTransformToLocationTransform(matTransform: mat4): mat4 {
    const locationTransform = this.locatedAtComponent.getTransform()

    const locationInvertedTransform = locationTransform.getInvertedWorldTransform()
    const transformFromLocation = locationInvertedTransform.mult(matTransform)

    return transformFromLocation
  }

  /**
   * Maps a mat4 local to the LocatedAt component's transform to a world mat4.
   */
  public locationTransformToWorldTransform(matTransform: mat4): mat4 {
    const locationTransform = this.locatedAtComponent.getTransform()

    const locationWorldTransform = locationTransform.getWorldTransform()
    return locationWorldTransform.mult(matTransform) // Does this need to be reversed?
  }

  /**
   * Maps a world vec3 into a vec3 local to the LocatedAt component's transform.
   */
  public worldVec3ToLocationVec3(vec: vec3): vec3 {
    const locationInvertedTransform = this.locatedAtComponent.getTransform().getInvertedWorldTransform()
    const vecFromLocation = locationInvertedTransform.multiplyDirection(vec)

    return vecFromLocation
  }

  /**
   * Maps a vec3 local to the LocatedAt component's transform to a world vec3.
   */
  public locationVec3ToWorldVec3(vec: vec3): vec3 {
    const locationWorldTransform = this.locatedAtComponent.getTransform().getWorldTransform()
    return locationWorldTransform.multiplyDirection(vec)
  }

  /**
   * Maps a world quat into a quat local to the LocatedAt component's transform.
   */
  public worldQuatToLocationQuat(quat: quat): quat {
    const locationInvertedQuat = this.locatedAtComponent.getTransform().getWorldRotation().invert()
    const quatFromLocation = locationInvertedQuat.multiply(quat)

    return quatFromLocation
  }

  /**
   * Maps a quat local to the LocatedAt component's transform to a world quat.
   */
  public locationQuatToWorldQuat(quat: quat): quat {
    const locationWorldQuat = this.locatedAtComponent.getTransform().getWorldRotation()
    return locationWorldQuat.multiply(quat)
  }

  /**
   * Returns the LocatedAtComponent of the Colocated World if using a Connected Lens.
   */
  get locatedAtComponent(): LocatedAtComponent {
    return this.sessionController.locatedAtComponent
  }
}
