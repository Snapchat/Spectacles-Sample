import BaseInteractor from "../../../Core/Interactor/BaseInteractor"
import {Interactor, InteractorInputType, InteractorTriggerType} from "../../../Core/Interactor/Interactor"
import WorldCameraFinderProvider from "../../../Providers/CameraProvider/WorldCameraFinderProvider"
import {LensConfig} from "../../../Utils/LensConfig"
import {SpringAnimate1D} from "../../../Utils/springAnimate"
import {DispatchedUpdateEvent} from "../../../Utils/UpdateDispatcher"
import {InteractorCursor} from "../InteractorCursor/InteractorCursor"

/**
 * Renders a 3D model to visualize an Interactor's ray, connecting the Interactor's origin to the target cursor
 * position. Its length and opacity is driven by the state of a corresponding InteractorCursor.
 */
@component
export class InteractorRayVisual extends BaseScriptComponent {
  /**
   * Reference to the Interactor component that this ray will visualize.
   */
  _interactor?: BaseInteractor

  /**
   * A reference to the InteractorCursor that controls this ray's endpoint and opacity. This is typically set by the
   * CursorController.
   */
  cursor?: InteractorCursor

  private _rayMaterial?: Material
  private updateEvent: DispatchedUpdateEvent | undefined
  private _isTriggering = false
  private triggerAmountSpring = SpringAnimate1D.smooth(0.2)
  private currentTriggerAmount = 0.0
  private targetTriggerAmount = 0.0

  private modelVisual: SceneObject | null = null
  private modelMesh: RenderMeshVisual | null = null

  private readonly triggerOffValue: number = 0.0
  private readonly triggerOnValue: number = 1.0

  onAwake(): void {
    this.createEvent("OnStartEvent").bind(() => this.onStart())
    this.createEvent("OnEnableEvent").bind(() => {
      if (this.updateEvent) this.updateEvent.enabled = true
    })
    this.createEvent("OnDisableEvent").bind(() => {
      if (this.updateEvent) this.updateEvent.enabled = false
    })
    this.createEvent("OnDestroyEvent").bind(() => this.onDestroy())
  }

  onStart(): void {
    this.createModelVisual()
    this.updateEvent = LensConfig.getInstance().updateDispatcher.createUpdateEvent("InteractorRayVisualUpdate", () =>
      this.update()
    )

    this.currentTriggerAmount = this.triggerOffValue
    this.targetTriggerAmount = this.triggerOffValue
  }

  /**
   * Clean up.
   */
  onDestroy(): void {
    if (this.modelVisual) {
      this.modelVisual.destroy()
    }
    if (this.updateEvent) {
      LensConfig.getInstance().updateDispatcher.removeEvent(this.updateEvent)
      this.updateEvent = undefined
    }
  }

  /**
   * The Material used to render the ray model. Cloning the material ensures that opacity changes do not affect other
   * objects using the same source material.
   */
  set rayMaterial(material: Material) {
    this._rayMaterial = material.clone()
    if (this.modelMesh) {
      this.modelMesh.mainMaterial = this._rayMaterial
    }
  }

  /**
   * The Material used to render the ray model.
   */
  get rayMaterial(): Material | undefined {
    return this._rayMaterial
  }

  /**
   * Sets if the ray should reflect a triggered state.
   */
  set isTriggering(triggering: boolean) {
    if (triggering === this._isTriggering) {
      return
    }

    this.targetTriggerAmount = triggering ? this.triggerOnValue : this.triggerOffValue
    this._isTriggering = triggering
  }

  /**
   * Returns if the ray is in a triggered state.
   */
  get isTriggering(): boolean {
    return this._isTriggering
  }

  private update(): void {
    if (
      !this.modelVisual ||
      !this.interactor ||
      !this.cursor ||
      !this.interactor.startPoint ||
      !this.cursor.cursorPosition
    ) {
      if (this.modelVisual) this.modelVisual.enabled = false
      return
    }

    const rayAlpha = this.cursor.rayAlpha

    if (rayAlpha <= 0.01) {
      this.modelVisual.enabled = false
      return
    }

    this.modelVisual.enabled = true

    const isTriggering = this.interactor.currentTrigger !== InteractorTriggerType.None
    this.isTriggering = isTriggering

    this.currentTriggerAmount = this.triggerAmountSpring.evaluate(this.currentTriggerAmount, this.targetTriggerAmount)
    this.applyTriggerParam(this.currentTriggerAmount)

    let startPoint = this.interactor.startPoint
    let endPoint = this.cursor.cursorPosition

    if (global.deviceInfoSystem.isEditor() && this.interactor.inputType === InteractorInputType.Mouse) {
      const camera = WorldCameraFinderProvider.getInstance()
      const cameraUp = camera.getTransform().up
      const offsetDistance = 2.0
      const offset = cameraUp.uniformScale(-offsetDistance)
      startPoint = startPoint.add(offset)
      endPoint = endPoint.add(offset)
    }

    const direction = endPoint.sub(startPoint)
    const distance = direction.length
    if (distance < 0.1) {
      this.modelVisual.enabled = false
      return
    }

    this.modelVisual.getTransform().setWorldPosition(startPoint)

    const rotQuat = quat.rotationFromTo(vec3.up(), direction.normalize())
    this.modelVisual.getTransform().setWorldRotation(rotQuat)

    this.modelVisual.getTransform().setWorldScale(new vec3(20, distance, 20))

    if (this.modelMesh && this.modelMesh.mainMaterial) {
      this.modelMesh.mainMaterial.mainPass.opacity = rayAlpha
    }
  }

  private createModelVisual(): void {
    const rayMesh = requireAsset("../../../Assets/Meshes/RayMesh.mesh") as RenderMesh

    this.modelVisual = global.scene.createSceneObject("RayModel")
    this.modelVisual.setParent(this.getSceneObject())
    this.modelMesh = this.modelVisual.createComponent("Component.RenderMeshVisual")
    this.modelMesh.mesh = rayMesh
    if (this._rayMaterial) {
      this.modelMesh.mainMaterial = this._rayMaterial
    } else {
      this.modelMesh.mainMaterial = requireAsset("../../../Assets/Materials/RayMaterial.mat") as Material
    }
    this.modelVisual.enabled = false
  }

  private get interactor(): Interactor | null {
    return this._interactor ?? null
  }

  private applyTriggerParam(value: number): void {
    if (!this.modelMesh || !this.modelMesh.mainMaterial) {
      return
    }
    this.modelMesh.mainMaterial.mainPass.triggerAmount = value
  }
}
