import {InteractionManager} from "../../../Core/InteractionManager/InteractionManager"
import BaseInteractor from "../../../Core/Interactor/BaseInteractor"
import {Interactor, InteractorInputType} from "../../../Core/Interactor/Interactor"
import {CursorControllerProvider} from "../../../Providers/CursorControllerProvider/CursorControllerProvider"
import {HandType} from "../../../Providers/HandInputData/HandType"
import Event from "../../../Utils/Event"
import NativeLogger from "../../../Utils/NativeLogger"
import {validate} from "../../../Utils/validate"
import {CircleVisual, CircleVisualConfig, CircleVisualMaterialParameters} from "./CircleVisual"
import {CursorData, CursorState, CursorViewModel, CursorViewState} from "./CursorViewModel"

import {CircleVisual as CircleVisualV2, CircleVisualConfig as CircleVisualConfigV2} from "./CircleVisualV2"
import type {CursorController} from "./CursorController"
import {CursorViewModel as CursorViewModelV2, CursorViewState as CursorViewStateV2} from "./CursorViewModelV2"

export enum CursorMode {
  Auto = "Auto",
  Translate = "Translate",
  ScaleTopLeft = "ScaleTopLeft",
  ScaleTopRight = "ScaleTopRight",
  Disabled = "Disabled",
  Custom = "Custom"
}

export type CursorParameters = {
  worldPosition: vec3
  worldRotation: vec3
  worldScale: vec3
  isShown: boolean
} & CircleVisualMaterialParameters

const DEFAULT_IDLE_OUTLINE_OFFSET = 0.0
const DEFAULT_HOVER_OUTLINE_OFFSET = 0.1

const DEFAULT_IDLE_SCALE = 1.0
const DEFAULT_SQUISH_SCALE = 0.6

const DEFAULT_IDLE_OUTLINE_ALPHA = 1.0
const DEFAULT_HOVER_OUTLINE_ALPHA = 0.5

const TAG = "InteractorCursor"

/**
 * This class represents a cursor for interactors, providing visual feedback for different interaction states. It manages the cursor's appearance, including its circle visual and manipulation line, and handles state changes and events.
 */
@component
export class InteractorCursor extends BaseScriptComponent {
  /**
   * Controls the "stickiness" of the cursor when hovering over interactable objects. When enabled, the cursor
   * maintains its position on the target object, even when the hand moves slightly, making interaction with small
   * targets easier. Only applies to hand-based interactions, not other input types like mouse. Disable for immediate
   * 1:1 cursor movement that follows the hand position exactly.
   */
  @input
  @hint(
    'Controls the "stickiness" of the cursor when hovering over interactable objects. When enabled, the cursor \
maintains its position on the target object, even when the hand moves slightly, making interaction with small \
targets easier. Only applies to hand-based interactions, not other input types like mouse. Disable for immediate \
1:1 cursor movement that follows the hand position exactly.'
  )
  enableCursorHolding: boolean = true

  /**
   * Applies smoothing to cursor movement for hand-based interactions. When enabled, reduces jitter and makes cursor
   * motion appear more stable, improving precision when interacting with small targets. Only applies to hand-based
   * interactions.
   */
  @input
  @hint(
    "Applies smoothing to cursor movement for hand-based interactions. When enabled, reduces jitter and makes cursor \
motion appear more stable, improving precision when interacting with small targets. Only applies to hand-based \
interactions."
  )
  enableFilter: boolean = false

  /**
   * Reference to the component that this cursor will visualize. The cursor will update its position and appearance
   * based on the interactor's state.
   */
  @input("Component.ScriptComponent")
  @allowUndefined
  @hint(
    "Reference to the component that this cursor will visualize. The cursor will update its position and appearance \
based on the interactor's state."
  )
  _interactor?: BaseInteractor

  /**
   * Enable debug rendering for this cursor (propagated to the internal view model)
   */
  @input
  @hint("Enable debug rendering for this cursor (cone collider, center ray, and closest-point helpers)")
  drawDebug: boolean = false

  private log = new NativeLogger(TAG)

  private circleVisualConfig!: CircleVisualConfig
  private circleVisualConfigV2!: CircleVisualConfigV2

  private circleVisual!: CircleVisual
  private circleVisualV2!: CircleVisualV2
  private circleVisualEnabled = true

  public cursorAlpha: number = 0.0
  public rayAlpha: number = 0.0

  private viewModel!: CursorViewModel
  private viewModelV2!: CursorViewModelV2

  private interactionManager = InteractionManager.getInstance()
  private cursorController = CursorControllerProvider.getInstance()

  // Events
  private onEnableChangedEvent = new Event<boolean>()

  private _useV2: boolean = false

  /**
   * Called whenever the cursor changes enabled state (showing / hiding the cursor visual)
   */
  onEnableChanged = this.onEnableChangedEvent.publicApi()

  /**
   * Shows the cursor visual.
   * @param duration The fade in duration.
   */
  public show(duration: number = 0.2): void {
    if (this._useV2 && this.viewModelV2) {
      this.viewModelV2.fadeIn(duration)
    } else {
      this.circleVisualEnabled = true
    }
  }

  /**
   * Hides the cursor visual.
   * @param duration The fade out duration.
   */
  public hide(duration: number = 0.2): void {
    if (this._useV2 && this.viewModelV2) {
      this.viewModelV2.fadeOut(duration)
    } else {
      this.circleVisualEnabled = false
    }
  }

  /**
   * Initializes the cursor with the useV2 setting from the CursorController.
   * @param _caller The CursorController that initialized this cursor.
   * @param _useV2 Whether to use the V2 cursor implementation.
   */
  init(_caller: CursorController, _useV2: boolean) {
    this._useV2 = _useV2
  }

  /**
   * @returns Whether the cursor is using the V2 cursor implementation.
   */
  get useV2(): boolean {
    return this._useV2
  }

  private onStateChange = (state: CursorState) => {
    switch (state) {
      case CursorState.Inactive:
        // If the visual is already hidden, do not invoke the extra event.
        if (this.circleVisual.isShown) {
          this.onEnableChangedEvent.invoke(false)
        }
        this.circleVisual.isShown = false
        this.circleVisual.outlineOffset = DEFAULT_IDLE_OUTLINE_OFFSET
        break
      case CursorState.Idle:
        this.circleVisual.outlineAlpha = DEFAULT_IDLE_OUTLINE_ALPHA
        this.circleVisual.outlineOffset = DEFAULT_IDLE_OUTLINE_OFFSET
        break
      case CursorState.Hovering:
        this.circleVisual.outlineAlpha = DEFAULT_HOVER_OUTLINE_ALPHA
        this.circleVisual.outlineOffset = DEFAULT_HOVER_OUTLINE_OFFSET
        break
    }
  }

  private onCursorUpdate = (viewState: CursorViewState) => {
    // If the script component has been disabled, do not show the cursor visual.
    const shouldShow = viewState.cursorEnabled && this.circleVisualEnabled
    if (shouldShow !== this.circleVisual.isShown) {
      this.onEnableChangedEvent.invoke(shouldShow)
    }

    this.circleVisual.isShown = shouldShow
    this.circleVisual.multipleInteractorsActive = this.checkMultipleInteractorsActive()

    if (viewState.cursorEnabled) {
      this.updateWorldCursor(viewState.cursorData)
    }
  }

  private onCursorUpdateV2 = (viewStateV2: CursorViewStateV2) => {
    const shouldShow = viewStateV2.cursorEnabled && this.circleVisualEnabled

    this.cursorAlpha = viewStateV2.cursorAlpha
    this.rayAlpha = viewStateV2.rayAlpha
    this.circleVisualV2.isTriggering = viewStateV2.isTriggering

    const isHovering = this.interactor?.targetHitInfo !== null
    if (isHovering) {
      this.circleVisualV2.outlineAlpha = DEFAULT_HOVER_OUTLINE_ALPHA
      this.circleVisualV2.outlineOffset = DEFAULT_HOVER_OUTLINE_OFFSET
    } else {
      this.circleVisualV2.outlineAlpha = DEFAULT_IDLE_OUTLINE_ALPHA
      this.circleVisualV2.outlineOffset = DEFAULT_IDLE_OUTLINE_OFFSET
    }
    const interactionStrength = this.interactor?.interactionStrength ?? 0
    const clampedStrength = Math.max(0, Math.min(1, interactionStrength))

    const squishScale = 1.0 - 0.45 * clampedStrength
    this.circleVisualV2.circleSquishScale = squishScale

    this.circleVisualV2.multipleInteractorsActive = this.checkMultipleInteractorsActive()

    if (shouldShow) {
      this.circleVisualV2.worldPosition = viewStateV2.position
      this.circleVisualV2.overallOpacity = viewStateV2.cursorAlpha

      const newScale = new vec3(viewStateV2.scale, viewStateV2.scale, viewStateV2.scale)
      this.circleVisualV2.sceneObject.getTransform().setWorldScale(newScale)
    } else {
      this.circleVisualV2.overallOpacity = viewStateV2.cursorAlpha
    }
  }

  visual!: SceneObject

  onAwake(): void {
    this.defineScriptEvents()

    this.visual = this.createVisual()
    this._useV2 = CursorControllerProvider.getInstance().getDefaultUseV2()
    if (this._useV2) {
      this.circleVisualConfigV2 = {
        meshSceneObject: this.visual,
        textures: {
          translate: requireAsset("./translate.png") as Texture,
          scaleTL: requireAsset("./scale-tl.png") as Texture,
          scaleTR: requireAsset("./scale-tr.png") as Texture,
          disabled: requireAsset("./disabled.png") as Texture
        }
      }
      this.circleVisualV2 = new CircleVisualV2(this.circleVisualConfigV2)
    } else {
      this.circleVisualConfig = {
        meshSceneObject: this.visual,
        textures: {
          translate: requireAsset("./translate.png") as Texture,
          scaleTL: requireAsset("./scale-tl.png") as Texture,
          scaleTR: requireAsset("./scale-tr.png") as Texture,
          disabled: requireAsset("./disabled.png") as Texture
        }
      }
      this.circleVisual = new CircleVisual(this.circleVisualConfig)
    }
  }

  set interactor(interactor: BaseInteractor) {
    validate(interactor, "InteractorCursor cannot have an undefined Interactor reference.")

    if (this.interactor !== null) {
      this.log.f(`InteractorCursor's Interactor has already been set to: ${this.interactor.sceneObject.name}`)
    }

    this._interactor = interactor as BaseInteractor
  }

  get interactor(): BaseInteractor | null {
    return this._interactor ?? null
  }

  /**
   * Programmatically instantiates the cursor visual
   * @returns The SceneObject for the cursor visual
   */
  private createVisual(): SceneObject {
    const visual = global.scene.createSceneObject("CursorVisual")
    visual.setParent(this.getSceneObject())

    const visualMesh = visual.createComponent("Component.RenderMeshVisual")
    visualMesh.mesh = requireAsset("./Plane.mesh") as RenderMesh
    visualMesh.mainMaterial = requireAsset("./Cursor.mat") as Material

    return visual
  }

  private updateWorldCursor(data: CursorData) {
    validate(data.position)

    this.circleVisual.worldPosition = data.position
    if (data.interactionStrength !== null) {
      this.circleVisual.circleSquishScale = MathUtils.lerp(
        DEFAULT_IDLE_SCALE,
        DEFAULT_SQUISH_SCALE,
        data.interactionStrength
      )
    } else {
      this.circleVisual.circleSquishScale = DEFAULT_IDLE_SCALE
    }

    this.circleVisual.isTriggering = data.isTriggering

    this.circleVisual.worldScale = vec3.one().uniformScale(data.scale)
  }

  /**
   * Get the world position of this interactor's cursor visual
   * @returns vec3 of the worldPosition
   */
  get cursorPosition(): vec3 | null {
    if (this._useV2) {
      return this.viewModelV2.cursorPosition
    } else {
      return this.viewModel.cursorPosition
    }
  }

  /**
   * Set the world position of this interactor's cursor visual
   * @param position - vec3 of the worldPosition, null to revert to default behavior to follow raycast
   */
  set cursorPosition(position: vec3 | null) {
    if (this._useV2) {
      this.viewModelV2.positionOverride = position
    } else {
      this.viewModel.positionOverride = position
    }
  }

  /**
   * Set the {@link CursorMode} of the cursor to change the visual
   * To return the cursor to its default {@link StateMachine} logic, use {@link CursorMode}.Auto
   * @param mode - The new mode of the cursor visual
   */
  set cursorMode(mode: CursorMode) {
    if (this._useV2) {
      this.circleVisualV2.cursorMode = mode
    } else {
      this.circleVisual.cursorMode = mode
    }
  }

  /**
   * Set the {@link Texture} of the cursor when using the {@link CursorMode}.Custom mode
   * Must explicitly set the {@link CursorMode} to {@link CursorMode}.Custom before the texture appears.
   * @param texture - The custom texture (typically cached via requireAsset(.../assetName.png) as Texture) to use
   */
  set customTexture(texture: Texture) {
    if (this._useV2) {
      this.circleVisualV2.customTexture = texture
    } else {
      this.circleVisual.customTexture = texture
    }
  }

  /**
   * Set the render order of the cursor visual.
   */
  set renderOrder(renderOrder: number) {
    if (this._useV2) {
      this.circleVisualV2.renderOrder = renderOrder
    } else {
      this.circleVisual.renderOrder = renderOrder
    }
  }

  /**
   * @returns the transform and material parameters of the cursor to allow other cursor implementations to re-use the same values.
   */
  get cursorParameters(): CursorParameters {
    const transform = this.circleVisual.sceneObject.getTransform()
    const materialParameters = this.circleVisual.materialParameters
    return {
      worldPosition: transform.getWorldPosition(),
      worldRotation: transform.getWorldRotation().toEulerAngles(),
      worldScale: transform.getWorldScale(),
      isShown: this.circleVisual.isShown,
      maxAlpha: materialParameters.maxAlpha,
      outlineAlpha: materialParameters.outlineAlpha,
      outlineOffset: materialParameters.outlineOffset,
      circleSquishScale: materialParameters.circleSquishScale,
      isTriggering: materialParameters.isTriggering,
      useTexture: materialParameters.useTexture,
      cursorTexture: materialParameters.cursorTexture,
      handType: materialParameters.handType,
      multipleInteractorsActive: materialParameters.multipleInteractorsActive
    }
  }

  private defineScriptEvents() {
    this.createEvent("OnEnableEvent").bind(() => {
      this.onEnable()
    })

    this.createEvent("OnDisableEvent").bind(() => {
      this.onDisable()
    })

    this.createEvent("OnDestroyEvent").bind(() => {
      this.onDestroy()
    })

    this.createEvent("OnStartEvent").bind(() => {
      if (this.interactor === null) {
        this.log.f(`InteractorCursor must have an Interactor set immediately after initializiation.`)
      } else {
        if (this.cursorController.getCursorByInteractor(this.interactor) === null) {
          this.cursorController.registerCursor(this)
        }
      }

      const interactor = this.interactor as Interactor
      if (this._useV2) {
        this.viewModelV2 = new CursorViewModelV2(interactor, this.getSceneObject())
        this.viewModelV2.setDebugDraw(this.drawDebug)
        this.viewModelV2.onCursorUpdate.add(this.onCursorUpdateV2)
      } else {
        this.viewModel = new CursorViewModel(this.enableCursorHolding, this.enableFilter, this.interactor as Interactor)
        this.viewModel.onStateChange.add(this.onStateChange)
        this.viewModel.onCursorUpdate.add(this.onCursorUpdate)
      }

      let handType: HandType | null
      switch (this.interactor!.inputType) {
        case InteractorInputType.LeftHand:
          handType = "left"
          break
        case InteractorInputType.RightHand:
          handType = "right"
          break
        default:
          handType = null
      }

      if (this._useV2) {
        this.circleVisualV2.handType = handType
        const interactorLabel = `${interactor.inputType}`
        this.circleVisualConfigV2.eventLabel = `${interactorLabel}`
        this.circleVisualV2.onStart()

        this.viewModelV2.enableUpdateEvent(true)
        this.circleVisualV2.enableUpdateEvent(true)
      } else {
        this.circleVisual.handType = handType
      }
    })
  }

  private onEnable() {
    this.show()
  }

  private onDisable() {
    this.hide()
  }

  private onDestroy() {
    if (this._useV2) {
      this.viewModelV2.destroy()
      this.circleVisualV2.destroy()
    }
    this.visual.destroy()
    this.viewModel.destroy()
  }

  private checkMultipleInteractorsActive(): boolean {
    const interactors = this.interactionManager.getInteractorsByType(InteractorInputType.All)

    const activeInteractors = interactors.filter((interactor) => {
      return interactor.isActive() && interactor.isTargeting()
    })

    return activeInteractors.length > 1
  }
}
