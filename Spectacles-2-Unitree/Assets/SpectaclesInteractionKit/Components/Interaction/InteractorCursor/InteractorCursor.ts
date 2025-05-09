import {CircleVisual, CircleVisualConfig} from "./CircleVisual"
import {
  CursorData,
  CursorState,
  CursorViewModel,
  CursorViewState,
  ManipulateLineData,
} from "./CursorViewModel"
import {
  Interactor,
  InteractorInputType,
} from "../../../Core/Interactor/Interactor"
import LineRenderer, {
  LineViewConfig,
} from "../../../Utils/views/LineRenderer/LineRenderer"

import BaseInteractor from "../../../Core/Interactor/BaseInteractor"
import {CursorControllerProvider} from "../../../Providers/CursorControllerProvider/CursorControllerProvider"
import Event from "../../../Utils/Event"
import {HandType} from "../../../Providers/HandInputData/HandType"
import {InteractionManager} from "../../../Core/InteractionManager/InteractionManager"
import {validate} from "../../../Utils/validate"

export enum CursorMode {
  Auto = "Auto",
  Translate = "Translate",
  ScaleTopLeft = "ScaleTopLeft",
  ScaleTopRight = "ScaleTopRight",
  Disabled = "Disabled",
  Custom = "Custom",
}

const TAG = "InteractorCursor"

const LINE_VERTICES = 10
const LINE_MIDPOINT = 0.7

const DEFAULT_IDLE_OUTLINE_OFFSET = 0.0
const DEFAULT_HOVER_OUTLINE_OFFSET = 0.1

const DEFAULT_IDLE_SCALE = 1.0
const DEFAULT_SQUISH_SCALE = 0.6

const DEFAULT_IDLE_OUTLINE_ALPHA = 1.0
const DEFAULT_HOVER_OUTLINE_ALPHA = 0.5

const MESH_SCENE_OBJECT_INDEX = 0

/**
 * This class represents a cursor for interactors, providing visual feedback for different interaction states. It manages the cursor's appearance, including its circle visual and manipulation line, and handles state changes and events.
 */
@component
export class InteractorCursor extends BaseScriptComponent {
  private circleVisualConfig!: CircleVisualConfig

  private manipulateLineConfig!: LineViewConfig

  private circleVisual!: CircleVisual
  private circleVisualEnabled = true

  private manipulateLine!: LineRenderer

  private viewModel!: CursorViewModel

  private interactionManager = InteractionManager.getInstance()
  private cursorController = CursorControllerProvider.getInstance()

  // Events
  private onEnableChangedEvent = new Event<boolean>()

  /**
   * Called whenever the cursor changes enabled state (showing / hiding the cursor visual)
   */
  onEnableChanged = this.onEnableChangedEvent.publicApi()

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
    this.circleVisual.multipleInteractorsActive =
      this.checkMultipleInteractorsActive()

    this.manipulateLine.setEnabled(viewState.lineEnabled)
    if (viewState.cursorEnabled) {
      this.updateWorldCursor(viewState.cursorData)
    }
    if (viewState.lineEnabled) {
      this.updateManipulateLine(viewState.lineData)
    }
  }

  @input
  enableCursorHolding: boolean = true
  @input
  enableFilter: boolean = false

  @input("Component.ScriptComponent")
  @allowUndefined
  _interactor?: BaseInteractor

  visual!: SceneObject

  onAwake(): void {
    this.defineScriptEvents()

    this.visual = this.createVisual()

    this.circleVisualConfig = {
      meshSceneObject: this.visual,
      textures: {
        translate: requireAsset("./translate.png") as Texture,
        scaleTL: requireAsset("./scale-tl.png") as Texture,
        scaleTR: requireAsset("./scale-tr.png") as Texture,
        disabled: requireAsset("./disabled.png") as Texture,
      },
    }
    this.manipulateLineConfig = {
      points: [new vec3(0, 0, 0), new vec3(0, 100, 0)],
      material: requireAsset("./ManipulateLineMaterial.mat") as Material,
      startWidth: 0.1,
      endWidth: 0.1,
      startColor: new vec4(1, 1, 1, 1),
      endColor: new vec4(1, 1, 1, 1),
      enabled: false,
    }

    this.circleVisual = new CircleVisual(this.circleVisualConfig)

    this.manipulateLine = new LineRenderer(this.manipulateLineConfig)
    this.manipulateLine.getSceneObject().setParent(this.getSceneObject())

    this.viewModel = new CursorViewModel(
      this.enableCursorHolding,
      this.enableFilter,
      this.interactor as Interactor,
    )
    this.viewModel.onStateChange.add(this.onStateChange)
    this.viewModel.onCursorUpdate.add(this.onCursorUpdate)

    if (this._interactor !== undefined) {
      this.interactor = this._interactor
    }
  }

  set interactor(interactor: BaseInteractor) {
    validate(
      interactor,
      "InteractorCursor cannot have an undefined Interactor reference.",
    )

    this._interactor = interactor as BaseInteractor
    this.viewModel.setInteractor(interactor)

    this.cursorController.registerCursor(this)

    let handType: HandType | null
    switch (interactor.inputType) {
      case InteractorInputType.LeftHand:
        handType = "left"
        break
      case InteractorInputType.RightHand:
        handType = "right"
        break

      default:
        return
    }

    this.circleVisual.handType = handType
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
        data.interactionStrength,
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
    return this.viewModel.cursorPosition
  }

  /**
   * Set the world position of this interactor's cursor visual
   * @param position - vec3 of the worldPosition, null to revert to default behavior to follow raycast
   */
  set cursorPosition(position: vec3 | null) {
    this.viewModel.positionOverride = position
  }

  /**
   * Set the {@link CursorMode} of the cursor to change the visual
   * To return the cursor to its default {@link StateMachine} logic, use {@link CursorMode}.Auto
   * @param mode - The new mode of the cursor visual
   */
  set cursorMode(mode: CursorMode) {
    this.circleVisual.cursorMode = mode
  }

  /**
   * Set the {@link Texture} of the cursor when using the {@link CursorMode}.Custom mode
   * Must explicitly set the {@link CursorMode} to {@link CursorMode}.Custom before the texture appears.
   * @param texture - The custom texture (typically cached via requireAsset(.../assetName.png) as Texture) to use
   */
  set customTexture(texture: Texture) {
    this.circleVisual.customTexture = texture
  }

  /**
   * Set the render order of the cursor visual.
   */
  set renderOrder(renderOrder: number) {
    this.circleVisual.renderOrder = renderOrder
  }

  private updateManipulateLine(data: ManipulateLineData) {
    this.manipulateLine.points = this.getCurvedLinePoints(
      data.origin,
      data.endPoint,
      data.delta,
    )
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
  }

  /**
   * Enable the cursor visual.
   */
  private onEnable() {
    this.circleVisualEnabled = true
  }

  /**
   * Disable the cursor visual.
   */
  private onDisable() {
    this.circleVisualEnabled = false
  }

  private onDestroy() {
    this.visual.destroy()
  }

  /**
   * Creates the points of the curved line used for far field manipulation.
   * @param start - where the line starts
   * @param end - where the line ends
   * @param curveOffset - the vector that the line's midpoint will be offset by to create the curve
   * @returns an array of points along the curved line created from start to end.
   */
  private getCurvedLinePoints(
    start: vec3,
    end: vec3,
    curveOffset: vec3 | null,
  ): vec3[] {
    let midPoint = vec3.lerp(start, end, LINE_MIDPOINT)
    if (curveOffset !== null) {
      midPoint = midPoint.add(curveOffset)
    }
    const points = []
    for (let ratio = 0; ratio <= 1; ratio += 1 / LINE_VERTICES) {
      const tangent1 = vec3.lerp(start, midPoint, ratio)
      const tangent2 = vec3.lerp(midPoint, end, ratio)
      const curve = vec3.lerp(tangent1, tangent2, ratio)
      points.push(curve)
    }
    return points
  }

  private checkMultipleInteractorsActive(): boolean {
    const interactors = this.interactionManager.getInteractorsByType(
      InteractorInputType.All,
    )

    const activeInteractors = interactors.filter((interactor) => {
      return interactor.isActive() && interactor.isTargeting()
    })

    return activeInteractors.length > 1
  }
}
