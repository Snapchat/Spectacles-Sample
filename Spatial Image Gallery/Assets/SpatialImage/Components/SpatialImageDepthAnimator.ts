import {easingFunctions} from "SpectaclesInteractionKit.lspkg/Utils/animate"
import {SpatialImageAngleValidator} from "./SpatialImageAngleValidator"

/**
 * Controls the depth scale of the spatial image to reflect the entry of new
 * images as well as ensure it's viewed only from correct angles.
 *
 * @version 1.0.0
 */
@component
export class SpatialImageDepthAnimator extends BaseScriptComponent {
  @typename
  SpatialImage: keyof ComponentNameMap

  @input("SpatialImage")
  private spatializer: any
  @input
  private angleValidator: SpatialImageAngleValidator

  /**
   * The speed at which the depth value is changed.
   */
  @input
  public animateSpeed: number = 0.5
  /**
   * The minimum depth to be applied to the image.
   */
  @input
  private minDepth: number = 0.05

  private shouldFlatten: boolean = false
  private baseDepthScale: number = 0
  private depthFlattenFollower: number = 0

  private onAwake(): void {
    this.createEvent("OnStartEvent").bind(() => {
      this.initialize()
    })

    this.createEvent("UpdateEvent").bind(() => {
      this.update()
    })

    this.createEvent("OnEnableEvent").bind(() => {
      this.depthFlattenFollower = 0
    })
  }

  /**
   * Sets the maximum depth scale for the image.
   */
  public setBaseDepthScale(depth: number): void {
    this.baseDepthScale = depth
  }

  private initialize(): void {
    this.baseDepthScale = this.spatializer.depthScale
    this.angleValidator.addOnValidityCallback((valid: boolean) => {
      this.handleAngleValidityChanged(valid)
    })
  }

  private update(): void {
    this.setMaxDepthScale(this.baseDepthScale)
  }

  private setMaxDepthScale(maxDepthScale: number) {
    if (!this.spatializer.material) {
      return
    }

    const flatten = this.shouldFlatten ? 0 : 1

    const distance = flatten - this.depthFlattenFollower

    if (Math.abs(distance) > 0.01) {
      this.depthFlattenFollower = this.depthFlattenFollower + Math.sign(distance) * getDeltaTime() * this.animateSpeed
    }

    const easedAngle = easingFunctions["ease-in-out-sine"](this.depthFlattenFollower)
    this.spatializer.material.mainPass.depthScale = Math.max(easedAngle * maxDepthScale, this.minDepth)
  }

  private handleAngleValidityChanged(isValid: boolean): void {
    this.shouldFlatten = !isValid
  }
}
