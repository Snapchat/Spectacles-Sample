import WorldCameraFinderProvider from "../../../../../Providers/CameraProvider/WorldCameraFinderProvider"
import {validate} from "../../../../../Utils/validate"

const DEFAULT_SPACER = 50

/**
 * This class provides a naive and simple Level Of Detail (LOD) implementation for RenderMeshVisual. It switches between different meshes based on the distance from the camera to the center of the object. The class does not support fading between meshes, but simply switches to the defined mesh at the specified depth.
 *
 * USAGE:
 * - Drop this component onto a scene object.
 * - Add meshes to the meshes array.
 * - Select thresholds at the given index (or else it falls back to default).
 * - Add the material that is shared across the RenderMeshVisuals.
 */
@component
export class SimpleLODRenderMeshVisual extends BaseScriptComponent {
  @input()
  meshes: RenderMesh[] = []
  @input()
  thresholds: number[] = []
  @input()
  material!: Material

  private rmvs: RenderMeshVisual[] = []
  private distances: number[] = []
  private object: SceneObject | undefined
  private transform: Transform | undefined
  private worldCamera: WorldCameraFinderProvider = WorldCameraFinderProvider.getInstance()
  private cameraTransform: Transform = this.worldCamera.getTransform()
  private currentIndex: number = 0

  onAwake() {
    this.object = this.getSceneObject()
    this.transform = this.object.getTransform()
    const clonedMaterial = this.material.clone()

    for (let i = 0; i < this.meshes.length; i++) {
      const distanceMesh = this.meshes[i]
      const thisRMV = this.object.createComponent("RenderMeshVisual")
      thisRMV.mesh = distanceMesh
      thisRMV.mainMaterial = clonedMaterial
      thisRMV.enabled = false
      this.rmvs.push(thisRMV)
      this.addDistance(this.thresholds[i] ? this.thresholds[i] : DEFAULT_SPACER)
    }

    this.rmvs[this.currentIndex].enabled = true

    this.createEvent("UpdateEvent").bind(this.update)
  }

  setRenderOrder = (order: number) => {
    for (let i = 0; i < this.rmvs.length; i++) {
      const thisRmv = this.rmvs[i]
      thisRmv.setRenderOrder(order)
    }
  }

  addDistance = (distance: number) => {
    let lastDistance = 0
    if (this.distances.length) {
      lastDistance = this.distances[this.distances.length - 1]
    }

    this.distances.push(distance + lastDistance)
  }

  update = () => {
    validate(this.transform)
    //
    // check and compare distances from camera
    //
    const currentDistanceSquared = this.cameraTransform
      .getWorldPosition()
      .distanceSquared(this.transform.getWorldPosition())
    let from = 0
    let thisIndex = 0
    let to
    while (thisIndex < this.distances.length) {
      to = this.distances[thisIndex] * this.distances[thisIndex]
      if (currentDistanceSquared >= from && currentDistanceSquared < to) {
        break
      } else {
        from = to
        thisIndex += 1
      }
    }

    //
    // if at a new threshold, swap the active rmv
    //
    if (thisIndex < this.rmvs.length && this.currentIndex !== thisIndex) {
      this.currentIndex = thisIndex
      for (const rmv of this.rmvs) {
        rmv.enabled = false
      }
      this.rmvs[this.currentIndex].enabled = true
    }
  }
}
