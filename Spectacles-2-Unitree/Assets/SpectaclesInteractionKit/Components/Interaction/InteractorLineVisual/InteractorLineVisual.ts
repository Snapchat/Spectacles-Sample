import {
  Interactor,
  InteractorTriggerType,
  TargetingMode,
} from "../../../Core/Interactor/Interactor"
import InteractorLineRenderer, {VisualStyle} from "./InteractorLineRenderer"
import animate, {CancelSet} from "../../../Utils/animate"
import {withAlpha, withoutAlpha} from "../../../Utils/color"

import BaseInteractor from "../../../Core/Interactor/BaseInteractor"
import {InteractionManager} from "../../../Core/InteractionManager/InteractionManager"
import {ViewConfig} from "../../../Utils/views/View"
import WorldCameraFinderProvider from "../../../Providers/CameraProvider/WorldCameraFinderProvider"

const FADE_DURATION_SECS = 0.21

const TAG = "InteractorLineVisual"

export type InteractorLineConfig = ViewConfig & {
  interactor: Interactor
  material: Material
  visualStyle: VisualStyle
  beginColor: vec3
  endColor: vec3
  width: number
  defaultLength?: number
  stickyTrigger?: boolean
}

/**
 * This class provides visual representation for interactor lines. It allows customization of the line's material, colors, width, length, and visual style. The class integrates with the InteractionManager and WorldCameraFinderProvider to manage interactions and camera positioning.
 */
@component
export class InteractorLineVisual extends BaseScriptComponent {
  private camera = WorldCameraFinderProvider.getInstance()
  private interactionManager: InteractionManager =
    InteractionManager.getInstance()

  @input
  private lineMaterial!: Material

  @input("vec3", "{1, 1, 0}")
  @widget(new ColorWidget())
  public _beginColor: vec3 = new vec3(1, 1, 0)

  @input("vec3", "{1, 1, 0}")
  @widget(new ColorWidget())
  public _endColor: vec3 = new vec3(1, 1, 0)

  @input
  private lineWidth: number = 0.5

  @input
  private lineLength: number = 160

  @input
  @widget(
    new ComboBoxWidget()
      .addItem("Full", 0)
      .addItem("Split", 1)
      .addItem("FadedEnd", 2),
  )
  public lineStyle: number = 2

  @input
  private shouldStick: boolean = true

  @input("Component.ScriptComponent")
  @allowUndefined
  _interactor?: BaseInteractor

  private _enabled = true
  private isShown = false
  private animationCancelSet = new CancelSet()
  private defaultScale = new vec3(1, 1, 1)
  private maxLength: number = 500
  private line!: InteractorLineRenderer
  private transform!: Transform

  /**
   * Sets whether the visual can be shown, so developers can show/hide the ray in certain parts of their lens.
   */
  set isEnabled(isEnabled: boolean) {
    this._enabled = isEnabled
  }

  /**
   * Gets whether the visual is active (can be shown if hand is in frame and we're in far field targeting mode).
   */
  get isEnabled(): boolean {
    return this._enabled
  }

  /**
   * Sets how the visuals for the line drawer should be shown.
   */
  set visualStyle(style: VisualStyle) {
    this.line.visualStyle = style
  }

  /**
   * Gets the current visual style.
   */
  get visualStyle(): VisualStyle {
    return this.line.visualStyle
  }

  /**
   * Sets the color of the visual from the start.
   */
  set beginColor(color: vec3) {
    this.line.startColor = withAlpha(color, 1)
  }

  /**
   * Gets the color of the visual from the start.
   */
  get beginColor(): vec3 {
    return withoutAlpha(this.line.startColor)
  }

  /**
   * Sets the color of the visual from the end.
   */
  set endColor(color: vec3) {
    this.line.endColor = withAlpha(color, 1)
  }

  /**
   * Gets the color of the visual from the end.
   */
  get endColor(): vec3 {
    return withoutAlpha(this.line.endColor)
  }

  onAwake() {
    this.transform = this.sceneObject.getTransform()
    this.defaultScale = this.transform.getWorldScale()

    this.line = new InteractorLineRenderer({
      material: this.lineMaterial,
      points: [vec3.zero(), vec3.up().uniformScale(this.maxLength)],
      startColor: withAlpha(this._beginColor, 1),
      endColor: withAlpha(this._endColor, 1),
      startWidth: this.lineWidth,
      endWidth: this.lineWidth,
    })

    this.line.getSceneObject().setParent(this.sceneObject)

    if (this.lineStyle !== undefined) {
      this.line.visualStyle = this.lineStyle
    }

    if (this.lineLength && this.lineLength > 0) {
      this.defaultScale = new vec3(1, this.lineLength / this.maxLength, 1)
    }

    this.showVisual(false)

    this.defineScriptEvents()
  }

  private defineScriptEvents() {
    this.createEvent("OnEnableEvent").bind(() => {
      this.isEnabled = true
    })

    this.createEvent("OnDisableEvent").bind(() => {
      this.isEnabled = false
    })

    this.createEvent("UpdateEvent").bind(() => {
      this.update()
    })

    this.createEvent("OnDestroyEvent").bind(() => {
      this.onDestroy()
    })
  }

  private showVisual(isShown: boolean) {
    if (this.isShown === isShown) {
      return
    }

    this.isShown = isShown

    this.animationCancelSet()
    animate({
      cancelSet: this.animationCancelSet,
      duration: FADE_DURATION_SECS,
      easing: "ease-out-cubic",
      update: (t) => {
        this.line.opacity = isShown ? t : 1 - t
      },
    })
  }

  private rotationFromOrthogonal(right: vec3, up: vec3, fwd: vec3): quat {
    const vec3to4 = (v3: vec3) => new vec4(v3.x, v3.y, v3.z, 0)
    const rotationMatrix = new mat4()
    rotationMatrix.column0 = vec3to4(right)
    rotationMatrix.column1 = vec3to4(up)
    rotationMatrix.column2 = vec3to4(fwd)
    return quat.fromEulerVec(rotationMatrix.extractEulerAngles())
  }

  /**
   * Calculates the world scale of the line visual, if distance is valid (greater than the minimum distance to show the visual).
   * If an item is targeted directly and the distance is valid, returns a vec3 representing the ray scaled to the distance to the target.
   * If an item is targeted indirectly, returns the default scale so as not to throw the user off.
   * Otherwise, returns default scale if no item is targeted, or null if the distance is not valid.
   */
  private getScale(): vec3 | null {
    const distance = this.interactor?.distanceToTarget ?? null
    if (distance === null) {
      return this.defaultScale
    }

    return this.interactor?.activeTargetingMode === TargetingMode.Direct ||
      this.shouldStick
      ? new vec3(1, distance / this.maxLength, 1)
      : this.defaultScale
  }

  /**
   * Updates the line visual each frame
   */
  update() {
    if (
      this.interactor === null ||
      !this.isEnabled ||
      !this.interactor.enabled ||
      this.interactor.activeTargetingMode !== TargetingMode.Indirect ||
      !this.interactor.isTargeting()
    ) {
      this.showVisual(false)
      return
    }

    this.updateActiveCursor()
  }

  /**
   * Moves and rotates cursor based on locus and direction updates
   * Scales cursor length to nearest interactable if it is being hit
   */
  private updateActiveCursor(): void {
    if (!this.interactor) {
      return
    }

    // Hide ray if the scale is below the minimum distance, or if locus/direction aren't provided.
    const distanceScale = this.getScale()
    const locus: vec3 | null = this.interactor.startPoint
    let direction: vec3 | null = this.interactor.direction

    if (distanceScale === null || locus === null || direction === null) {
      this.showVisual(false)
      return
    }

    this.transform.setWorldPosition(locus)
    this.transform.setWorldScale(distanceScale)

    if (
      this.shouldStick &&
      (InteractorTriggerType.Select & this.interactor.currentTrigger) !== 0
    ) {
      const target = this.interactor.currentInteractable
      if (target) {
        const targetPos: vec3 = target.sceneObject
          .getTransform()
          .getWorldPosition()
        direction = targetPos.sub(locus).normalize()
      }
    }
    // Create rotation from orthogonal vectors & set world rotation
    const locusToCamera = this.camera.getWorldPosition().sub(locus).normalize()
    const newRight = direction.cross(locusToCamera).normalize()
    const newForward = newRight.cross(direction)

    this.transform.setWorldRotation(
      this.rotationFromOrthogonal(newRight, direction, newForward),
    )

    this.showVisual(true)
  }

  /**
   * Destroys cursor & line renderer when the custom component is destroyed.
   */
  onDestroy(): void {
    this.line.destroy()
    this.sceneObject.destroy()
  }

  private get interactor(): Interactor | null {
    return this._interactor ?? null
  }
}
