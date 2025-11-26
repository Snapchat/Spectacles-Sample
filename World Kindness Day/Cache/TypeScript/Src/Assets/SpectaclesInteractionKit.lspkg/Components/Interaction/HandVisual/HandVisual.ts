import {HandInteractor} from "../../../Core/HandInteractor/HandInteractor"
import {HandInputData} from "../../../Providers/HandInputData/HandInputData"
import {HandType} from "../../../Providers/HandInputData/HandType"
import {HandVisuals} from "../../../Providers/HandInputData/HandVisuals"
import TrackedHand from "../../../Providers/HandInputData/TrackedHand"
import {LensConfig} from "../../../Utils/LensConfig"
import NativeLogger from "../../../Utils/NativeLogger"
import {findSceneObjectByName} from "../../../Utils/SceneObjectUtils"
import {validate} from "../../../Utils/validate"
import {GlowEffectView} from "./GlowEffectView"

const TAG = "HandVisual"

export enum HandMeshType {
  Full = "Full",
  IndexThumb = "IndexThumb"
}

export enum HandVisualSelection {
  Default = "Default",
  AlwaysOn = "AlwaysOn",
  Occluder = "Occluder",
  None = "None"
}

export enum HandVisualOverrideType {
  ForcePinchVisual = 0,
  ForcePokeVisual = 1,
  DisablePinchVisual = 2,
  DisablePokeVisual = 3,
  PinchDistanceOverride = 4,
  PokeDistanceOverride = 5
}

@typedef
export class HandVisualOverrideItem {
  @input
  @widget(
    new ComboBoxWidget([
      new ComboBoxItem("Force Pinch Visual", 0),
      new ComboBoxItem("Force Poke Visual", 1),
      new ComboBoxItem("Exclude Pinch Visual", 2),
      new ComboBoxItem("Exclude Poke Visual", 3),
      new ComboBoxItem("Pinch Distance Override", 4),
      new ComboBoxItem("Poke Distance Override", 5)
    ])
  )
  overrideType!: number
  @input
  @showIf("overrideType", 4)
  pinchDistance?: number
  @input
  @showIf("overrideType", 5)
  pokeDistance?: number
}

@typedef
export class HandVisualOverride {
  @input
  interactableSceneObject!: SceneObject
  @input
  overrides!: HandVisualOverrideItem[]
}

class frustumVec3 {
  public x: number
  public y: number
  public z: number

  constructor(x: number = 0, y: number = 0, z: number = 0) {
    this.x = x
    this.y = y
    this.z = z
  }
}

interface FrustumCullData {
  readonly NUM_FULL_POSITIONS: number
  readonly NUM_INDEX_THUMB_POSITIONS: number
  localMin: frustumVec3
  localMax: frustumVec3
  isLeftHand: boolean
  handPositions: frustumVec3[]
  frustumCullMin: vec3
  frustumCullMax: vec3
}

const HAND_MODEL_INDEX = 0

const HAND_MESH_INDEX_THUMB_INDEX = 1
const HAND_MESH_FULL_INDEX = 2
const HAND_MESH_PIN_INDEX = 3

/**
 * This class provides a visual representation of the hand, with the ability to automatically wire joints to the hand
 * mesh. It also provides the ability to add a radial gradient occlusion effect and a glow effect to the hand mesh.
 */
@component
export class HandVisual extends BaseScriptComponent implements HandVisuals {
  @ui.group_start("Hand Visual")
  @hint("Core settings that control how the user's hand appears in the AR environment.")

  /**
   * Display debug rendering for the hand visual.
   */
  @input
  @hint("Display debug rendering for the hand visual.")
  private debugModeEnabled = false

  /**
   * Specifies which hand (Left or Right) this visual representation tracks and renders.
   */
  @input
  @hint("Specifies which hand (Left or Right) this visual representation tracks and renders.")
  @widget(new ComboBoxWidget([new ComboBoxItem("Left", "left"), new ComboBoxItem("Right", "right")]))
  private handType!: string

  @input
  @hint("Specifies the hand mesh to display. Can be changed at runtime.")
  @widget(new ComboBoxWidget([new ComboBoxItem("Full", "Full"), new ComboBoxItem("Index & Thumb", "IndexThumb")]))
  private _meshType: string = HandMeshType.IndexThumb

  /**
   * Sets the hand visual style. "Default" shows glowing fingertips during interactions. "AlwaysOn" always shows
   * glowing fingertips. "Occluder" blocks content behind the hand. "None" disables all hand visuals.
   */
  @input
  @hint(
    'Sets the hand visual style. "Default" shows glowing fingertips during interactions. "AlwaysOn" always shows \
glowing fingertips. "Occluder" blocks content behind the hand. "None" disables all hand visuals.'
  )
  @widget(
    new ComboBoxWidget([
      new ComboBoxItem("Default", "Default"),
      new ComboBoxItem("AlwaysOn", "AlwaysOn"),
      new ComboBoxItem("Occluder", "Occluder"),
      new ComboBoxItem("None", "None")
    ])
  )
  private selectVisual: string = "Default"

  /**
   * Reference to the HandInteractor component that provides gesture recognition and tracking for this hand.
   */
  @input
  @hint("Reference to the HandInteractor component that provides gesture recognition and tracking for this hand.")
  handInteractor!: HandInteractor

  /**
   * Reference to the RenderMeshVisual of the full hand mesh.
   */
  @input
  @hint("Reference to the RenderMeshVisual of the full hand mesh.")
  @allowUndefined
  handMeshFull!: RenderMeshVisual

  /**
   * Reference to the RenderMeshVisual of the hand mesh with only an index & thumb for efficiency.
   */
  @input
  @hint("The RenderMeshVisual for the index & thumb only hand.")
  @allowUndefined
  handMeshIndexThumb!: RenderMeshVisual

  /**
   * Reference to the RenderMeshVisual of the full hand mesh to pin SceneObjects to.
   */
  @input
  @hint("Reference to the RenderMeshVisual of the full hand mesh to pin SceneObjects to.")
  @allowUndefined
  handMeshPin: RenderMeshVisual | undefined = undefined

  /**
   * Sets the rendering priority of the handMesh. Higher values (e.g., 9999) make the hand render on top of objects
   * with lower values.
   */
  @input
  @hint(
    "Sets the rendering priority of the handMesh. Higher values (e.g., 9999) make the hand render on top of objects \
with lower values."
  )
  private handMeshRenderOrder: number = 9999

  /** @inheritdoc */
  @input
  @hint("Reference to the parent SceneObject that contains both the hand's rig and mesh.")
  root!: SceneObject

  /**
   * When enabled, the system will automatically map tracking data to the hand model's joints. Disable only if you
   * need manual control over individual joint assignments.
   */
  @input
  @hint(
    "When enabled, the system will automatically map tracking data to the hand model's joints. Disable only if you \
need manual control over individual joint assignments."
  )
  autoJointMapping: boolean = true

  @ui.group_start("Joint Setup")
  @showIf("autoJointMapping", false)
  @input("SceneObject")
  @allowUndefined
  wrist: SceneObject | undefined
  @input("SceneObject")
  @allowUndefined
  thumbToWrist: SceneObject | undefined
  @input("SceneObject")
  @allowUndefined
  thumbBaseJoint: SceneObject | undefined
  @input("SceneObject")
  @allowUndefined
  thumbKnuckle: SceneObject | undefined
  @input("SceneObject")
  @allowUndefined
  thumbMidJoint: SceneObject | undefined
  @input("SceneObject")
  @allowUndefined
  thumbTip: SceneObject | undefined
  @input("SceneObject")
  @allowUndefined
  indexToWrist: SceneObject | undefined
  @input("SceneObject")
  @allowUndefined
  indexKnuckle: SceneObject | undefined
  @input("SceneObject")
  @allowUndefined
  indexMidJoint: SceneObject | undefined
  @input("SceneObject")
  @allowUndefined
  indexUpperJoint: SceneObject | undefined
  @input("SceneObject")
  @allowUndefined
  indexTip: SceneObject | undefined
  @input("SceneObject")
  @allowUndefined
  middleToWrist: SceneObject | undefined
  @input("SceneObject")
  @allowUndefined
  middleKnuckle: SceneObject | undefined
  @input("SceneObject")
  @allowUndefined
  middleMidJoint: SceneObject | undefined
  @input("SceneObject")
  @allowUndefined
  middleUpperJoint: SceneObject | undefined
  @input("SceneObject")
  @allowUndefined
  middleTip: SceneObject | undefined
  @input("SceneObject")
  @allowUndefined
  ringToWrist: SceneObject | undefined
  @input("SceneObject")
  @allowUndefined
  ringKnuckle: SceneObject | undefined
  @input("SceneObject")
  @allowUndefined
  ringMidJoint: SceneObject | undefined
  @input("SceneObject")
  @allowUndefined
  ringUpperJoint: SceneObject | undefined
  @input("SceneObject")
  @allowUndefined
  ringTip: SceneObject | undefined
  @input("SceneObject")
  @allowUndefined
  pinkyToWrist: SceneObject | undefined
  @input("SceneObject")
  @allowUndefined
  pinkyKnuckle: SceneObject | undefined
  @input("SceneObject")
  @allowUndefined
  pinkyMidJoint: SceneObject | undefined
  @input("SceneObject")
  @allowUndefined
  pinkyUpperJoint: SceneObject | undefined
  @input("SceneObject")
  @allowUndefined
  pinkyTip: SceneObject | undefined
  @ui.group_end
  @ui.group_start("Glow Effect")
  @hint(
    "Controls the visual feedback that appears around fingertips during interactions. The glow effect provides users \
with real-time visual cues about interaction states: when hovering near interactive elements, actively pinching/poking,\
or when interactions are out of range."
  )
  /**
   * The plane mesh on which the glow texture/material will be rendered.
   */
  @input
  @hint("The plane mesh on which the glow texture/material will be rendered.")
  private unitPlaneMesh!: RenderMesh
  /**
   * The material which will be manipulated to create the glow effect.
   */
  @input
  @hint("The material which will be manipulated to create the glow effect.")
  private tipGlowMaterial!: Material

  /**
   * The render order of the quad on which the tip glow effect occurs.
   */
  @input
  @hint("The render order of the quad on which the tip glow effect occurs.")
  private tipGlowRenderOrder = 10000

  /**
   * The world scale of the quad on which the tip glow effect occurs.
   */
  @input
  @hint("The world scale of the quad on which the tip glow effect occurs.")
  private tipGlowWorldScale = 0.3

  /**
   * The color the glow will be when you are not pinching/poking.
   */
  @input
  @widget(new ColorWidget())
  @hint("The color the glow will be when you are not pinching/poking.")
  private hoverColor!: vec4
  /**
   * The color the glow will be when you are pinching/poking.
   */
  @input
  @widget(new ColorWidget())
  @hint("The color the glow will be when you are pinching/poking.")
  private triggerColor!: vec4

  /**
   * Duration in seconds for transitioning between normal and triggered visual states.
   */
  @input
  @hint("Duration in seconds for transitioning between normal and triggered states.")
  private triggeredLerpDurationSeconds = 0.1

  /**
   * Duration in seconds for transitioning pinch effects when acquiring or losing valid targets.
   */
  @input
  @hint("Duration in seconds for transitioning pinch effects when acquiring or losing valid targets.")
  private pinchValidLerpDurationSeconds = 0.25

  /**
   * Duration in seconds for transitioning poke effects when acquiring or losing valid targets.
   */
  @input
  @hint("Duration in seconds for transitioning poke effects when acquiring or losing valid targets.")
  private pokeValidLerpDurationSeconds = 0.5

  @ui.group_start("Pinch Params")
  /**
   * Maximum brightness value for the pinch effect.
   */
  @input
  @label("Brightness Max")
  @hint("Maximum brightness value for the pinch effect.")
  private pinchBrightnessMax = 1.0

  /**
   * Maximum brightness value for the pinch glow's outer radial effect.
   */
  @input
  @label("Glow Brightness Max")
  @hint("Maximum brightness value for the pinch glow's outer radial effect.")
  private pinchGlowBrightnessMax = 0.33

  /**
   * Multiplier applied to pinchBrightnessMax when user is actively pinching.
   */
  @input
  @label("Triggered Mult")
  @hint("Multiplier applied to pinchBrightnessMax when user is actively pinching.")
  private pinchTriggeredMult = 1.2

  /**
   * The pinch strength threshold at which maximum brightness is reached.
   */
  @input
  @label("Brightness Max Strength")
  @hint("The pinch strength threshold at which maximum brightness is reached.")
  private pinchBrightnessMaxStrength = 0.75

  /**
   * Default value for the pinch exponent uniform when not actively pinching.
   */
  @input
  @label("Exponent")
  @hint("Default value for the pinch exponent uniform when not actively pinching.")
  private pinchExponent = 2.0

  /**
   * Target value for the pinch exponent uniform when actively pinching.
   */
  @input
  @label("Exponent Triggered")
  @hint("Target value for the pinch exponent uniform when actively pinching.")
  private pinchExponentTriggered = 2.0

  /**
   * Distance in cm at which pinch highlighting effects begin to fade in.
   */
  @input
  @label("Highlight Threshold Far")
  @hint("Distance in cm at which pinch highlighting effects begin to fade in.")
  private pinchHighlightThresholdFar = 18

  /**
   * Distance in cm at which pinch highlighting effects reach maximum intensity.
   */
  @input
  @label("Highlight Threshold Near")
  @hint("Distance in cm at which pinch highlighting effects reach maximum intensity.")
  private pinchHighlightThresholdNear = 4

  @ui.group_end
  @ui.group_start("Poke Params")
  /**
   * Maximum brightness value for the poke effect.
   */
  @input
  @label("Brightness Max")
  @hint("Maximum brightness value for the poke effect.")
  private pokeBrightnessMax = 1.1

  /**
   * Maximum brightness value for the poke glow's outer radial effect.
   */
  @input
  @label("Glow Brightness Max")
  @hint("Maximum brightness value for the poke glow's outer radial effect.")
  private pokeGlowBrightnessMax = 0.33

  /**
   * Multiplier applied to pokeBrightnessMax when user is actively poking.
   */
  @input
  @label("Triggered Mult")
  @hint("Multiplier applied to pokeBrightnessMax when user is actively poking.")
  private pokeTriggeredMult = 1.5

  /**
   * Distance in cm at which poke highlighting effects begin to fade in.
   */
  @input
  @label("Highlight Threshold Far")
  @hint("Distance in cm at which poke highlighting effects begin to fade in.")
  private pokeHighlightThresholdFar = 18

  /**
   * Distance in cm at which poke highlighting effects reach maximum intensity.
   */
  @input
  @label("Highlight Threshold Near")
  @hint("Distance in cm at which poke highlighting effects reach maximum intensity.")
  private pokeHighlightThresholdNear = 4

  /**
   * Distance in cm at which poke occlusion effects begin to fade in.
   */
  @input
  @label("Occlude Threshold Far")
  @hint("Distance in cm at which poke occlusion effects begin to fade in.")
  private pokeOccludeThresholdFar = 12

  /**
   * Distance in cm at which poke occlusion effects reach maximum intensity.
   */
  @input
  @label("Occlude Threshold Near")
  @hint("Distance in cm at which poke occlusion effects reach maximum intensity.")
  private pokeOccludeThresholdNear = 0

  /**
   * Default value for the poke exponent uniform when not actively poking.
   */
  @input
  @label("Exponent")
  @hint("Default value for the poke exponent uniform when not actively poking.")
  private pokeExponent = 1.8

  /**
   * Target value for the poke exponent uniform when actively poking.
   */
  @input
  @label("Exponent Triggered")
  @hint("Target value for the poke exponent uniform when actively poking.")
  private pokeExponentTriggered = 1.2

  @ui.group_end
  @ui.group_end
  @ui.group_end
  @ui.group_start("Hand Mesh Materials")
  @hint(
    "Materials that control the appearance of the hand mesh by specifying materials for different hand visual styles."
  )
  /**
   * The material which will create the occluder visual effect on the hand mesh.
   */
  @input
  @hint("The material which will create the occluder visual effect on the hand mesh.")
  private handOccluderMaterial!: Material
  @ui.group_end

  /**
   * Represents an override for hand visual effects for a specific interactable.
   * @property interactableSceneObject - The SceneObject this override applies to.
   * @property overrideType - An array of override items specifying the type of override and any associated parameters.
   */
  @input
  overrides: HandVisualOverride[] = []

  public overrideMap: Map<SceneObject, HandVisualOverride> = new Map()

  // Dependencies
  private handProvider: HandInputData = HandInputData.getInstance()
  private hand!: TrackedHand
  private _glowEffectView: GlowEffectView | undefined
  private activeHandMesh!: RenderMeshVisual

  private _isVisible: boolean = true
  private _handVisualSelection: HandVisualSelection = this.selectVisual as HandVisualSelection

  private _handMeshDefaultMaterialFull: Material | null = null
  private _handMeshDefaultMaterialIndexThumb: Material | null = null

  initialized = false

  private _isHandAvailable: boolean = false
  private _isPhoneInHand: boolean = false

  private frustumCull: FrustumCullData = {
    NUM_FULL_POSITIONS: 11,
    NUM_INDEX_THUMB_POSITIONS: 5,
    localMin: new frustumVec3(Infinity, Infinity, Infinity),
    localMax: new frustumVec3(-Infinity, -Infinity, -Infinity),
    isLeftHand: this.handType === "left",
    handPositions: [] as frustumVec3[],
    frustumCullMin: new vec3(0, 0, 0),
    frustumCullMax: new vec3(0, 0, 0)
  }

  private log = new NativeLogger(TAG)

  /**
   * Gets the full hand mesh visual.
   * @deprecated directly access `handMeshFull`, `handMeshIndexThumb`, or `handMeshPin` instead.
   */
  get handMesh(): RenderMeshVisual {
    return this.handMeshFull
  }

  /**
   * Gets the current mesh type being displayed
   */
  get meshType(): HandMeshType {
    return this.activeHandMesh === this.handMeshFull ? HandMeshType.Full : HandMeshType.IndexThumb
  }

  /**
   * Sets the mesh type to display (Full or IndexThumb)
   */
  set meshType(newMeshType: HandMeshType) {
    if (this.activeHandMesh && this.activeHandMesh.sceneObject) {
      this.activeHandMesh.sceneObject.enabled = false
    }

    this.activeHandMesh = newMeshType === HandMeshType.Full ? this.handMeshFull : this.handMeshIndexThumb

    this.activeHandMesh.setRenderOrder(this.handMeshRenderOrder)
  }

  /**
   * Sets the selection of the hand visual to present to user
   */
  set visualSelection(selection: HandVisualSelection) {
    this._handVisualSelection = selection

    const isOccluder = selection === HandVisualSelection.Occluder
    if (this._handMeshDefaultMaterialFull) {
      this.handMeshFull.mainMaterial = isOccluder ? this.handOccluderMaterial : this._handMeshDefaultMaterialFull
    }
    if (this._handMeshDefaultMaterialIndexThumb) {
      this.handMeshIndexThumb.mainMaterial = isOccluder
        ? this.handOccluderMaterial
        : this._handMeshDefaultMaterialIndexThumb
    }

    this.glowEffectView?.setVisualSelection(selection)
  }

  /**
   * @returns the current selection of the hand visual to present to user
   */
  get visualSelection(): HandVisualSelection {
    return this._handVisualSelection
  }

  /**
   * Determines if the hand visual is visible based on tracking and phone-in-hand status.
   *
   * @returns {boolean} True if the hand is available and the phone is not in hand, otherwise false.
   */
  private get isHandVisibleByStatus(): boolean {
    return this._isHandAvailable && !this._isPhoneInHand
  }

  /**
   * Gets whether the hand visual is visible. When false, all hand visual components (mesh, glow effects, and wrist) will not be shown regardless of tracking status.
   */
  get isVisible(): boolean {
    return this._isVisible
  }

  /**
   * Sets whether the hand visual is visible. When false, all hand visual components (mesh, glow effects, and wrist) will not be shown regardless of tracking status.
   */
  set isVisible(value: boolean) {
    this._isVisible = value
  }

  /**
   * Gets the glow effect view that provides visual feedback for hand interactions.
   */
  get glowEffectView(): GlowEffectView | undefined {
    return this._glowEffectView
  }

  private defineScriptEvents() {
    this.createEvent("OnStartEvent").bind(() => {
      this.initialize()
    })

    this.createEvent("OnEnableEvent").bind(() => {
      this.defineOnEnableBehavior()
    })

    this.createEvent("OnDisableEvent").bind(() => {
      this.defineOnDisableBehavior()
    })

    this.createEvent("OnDestroyEvent").bind(() => {
      this.defineOnDestroyBehavior()
    })
  }

  protected defineOnEnableBehavior(): void {
    this._isVisible = true
  }

  protected defineOnDisableBehavior(): void {
    this._isVisible = false
  }

  protected defineOnDestroyBehavior(): void {
    if (this.glowEffectView !== undefined) {
      this.glowEffectView.destroy()
    }

    this.hand?.detachHandVisuals(this)
  }

  private defineHandEvents() {
    validate(this.hand)

    this.hand.onHandFound.add(() => {
      this._isHandAvailable = true
    })

    this.hand.onHandLost.add(() => {
      this._isHandAvailable = false
    })

    this.hand.onPhoneInHandBegin.add(() => {
      this._isPhoneInHand = true
    })

    this.hand.onPhoneInHandEnd.add(() => {
      this._isPhoneInHand = false
    })
  }

  private getJointSceneObject(targetSceneObjectName: string, root: SceneObject) {
    const sceneObject = findSceneObjectByName(root, targetSceneObjectName)
    if (sceneObject === null) {
      throw new Error(`${targetSceneObjectName} could not be found in children of SceneObject: ${this.root?.name}`)
    }
    return sceneObject
  }

  onAwake(): void {
    this.fillOverrideMapFromArray()

    if (this.handType !== "right") {
      this.hand = this.handProvider.getHand("left")
    } else {
      this.hand = this.handProvider.getHand("right")
    }

    this.hand.attachHandVisuals(this)

    const handModel = this.sceneObject.getChild(HAND_MODEL_INDEX)
    if (handModel.children.length <= HAND_MESH_FULL_INDEX) {
      this.log.f(
        `Outdated HandVisual SceneObject detected. Please click on the SpectaclesInteractionKit SceneObject in the` +
          ` Scene Hierarchy, then click Revert in the Inspector Panel.`
      )
    }

    // If handMeshFull and handMeshIndexThumb are not provided via script input, programmatically retrieve them.
    if (this.handMeshFull === undefined) {
      this.handMeshFull = handModel.getChild(HAND_MESH_FULL_INDEX).getComponent("RenderMeshVisual")
    }
    if (this.handMeshIndexThumb === undefined) {
      this.handMeshIndexThumb = handModel.getChild(HAND_MESH_INDEX_THUMB_INDEX).getComponent("RenderMeshVisual")
    }

    // For the left hand only, if handMeshPin is not provided via script input, programmatically retrieve it.
    if (this.handType === "left" && this.handMeshPin === undefined) {
      this.handMeshPin = handModel.getChild(HAND_MESH_PIN_INDEX).getComponent("RenderMeshVisual")
    }

    if (this.handMeshFull) {
      this._handMeshDefaultMaterialFull = this.handMeshFull.mainMaterial
    }
    if (this.handMeshIndexThumb) {
      this._handMeshDefaultMaterialIndexThumb = this.handMeshIndexThumb.mainMaterial
    }

    this.defineHandEvents()
    this.defineScriptEvents()

    this.meshType = this._meshType as HandMeshType

    if (this.handMeshFull && this.handMeshFull.mainMaterial) {
      const mainMaterial = this.handMeshFull.mainMaterial
      for (let i = 0; i < mainMaterial.getPassCount(); i++) {
        const pass = mainMaterial.getPass(i)
        pass.frustumCullMode = FrustumCullMode.UserDefinedAABB
        pass.frustumCullMin = new vec3(-1, -1, -1)
        pass.frustumCullMax = new vec3(1, 1, 1)
      }
    }
    if (this.handMeshIndexThumb && this.handMeshIndexThumb.mainMaterial) {
      const mainMaterial = this.handMeshIndexThumb.mainMaterial
      for (let i = 0; i < mainMaterial.getPassCount(); i++) {
        const pass = mainMaterial.getPass(i)
        pass.frustumCullMode = FrustumCullMode.UserDefinedAABB
        pass.frustumCullMin = new vec3(-1, -1, -1)
        pass.frustumCullMax = new vec3(1, 1, 1)
      }
    }

    this.frustumCull.handPositions = Array.from(
      {length: Math.max(this.frustumCull.NUM_FULL_POSITIONS, this.frustumCull.NUM_INDEX_THUMB_POSITIONS)},
      () => new frustumVec3()
    )

    const updateDispatcher = LensConfig.getInstance().updateDispatcher
    updateDispatcher.createUpdateEvent("HandVisualUpdateEvent").bind(() => this.onUpdate())
  }

  public initialize(): void {
    if (this.initialized) {
      return
    }
    validate(this.hand)

    this.wrist = this.autoJointMapping ? this.getJointSceneObject("wrist", this.root) : this.wrist

    this.thumbToWrist = this.autoJointMapping
      ? this.getJointSceneObject("wrist_to_thumb", this.root)
      : this.thumbToWrist
    this.thumbBaseJoint = this.autoJointMapping ? this.getJointSceneObject("thumb-0", this.root) : this.thumbBaseJoint
    this.thumbKnuckle = this.autoJointMapping ? this.getJointSceneObject("thumb-1", this.root) : this.thumbKnuckle
    this.thumbMidJoint = this.autoJointMapping ? this.getJointSceneObject("thumb-2", this.root) : this.thumbMidJoint
    this.thumbTip = this.autoJointMapping ? this.getJointSceneObject("thumb-3", this.root) : this.thumbTip
    this.indexToWrist = this.autoJointMapping
      ? this.getJointSceneObject("wrist_to_index", this.root)
      : this.indexToWrist
    this.indexKnuckle = this.autoJointMapping ? this.getJointSceneObject("index-0", this.root) : this.indexKnuckle
    this.indexMidJoint = this.autoJointMapping ? this.getJointSceneObject("index-1", this.root) : this.indexMidJoint
    this.indexUpperJoint = this.autoJointMapping ? this.getJointSceneObject("index-2", this.root) : this.indexUpperJoint
    this.indexTip = this.autoJointMapping ? this.getJointSceneObject("index-3", this.root) : this.indexTip
    this.middleToWrist = this.autoJointMapping
      ? this.getJointSceneObject("wrist_to_mid", this.root)
      : this.middleToWrist
    this.middleKnuckle = this.autoJointMapping ? this.getJointSceneObject("mid-0", this.root) : this.middleKnuckle
    this.middleMidJoint = this.autoJointMapping ? this.getJointSceneObject("mid-1", this.root) : this.middleMidJoint
    this.middleUpperJoint = this.autoJointMapping ? this.getJointSceneObject("mid-2", this.root) : this.middleUpperJoint
    this.middleTip = this.autoJointMapping ? this.getJointSceneObject("mid-3", this.root) : this.middleTip
    this.ringToWrist = this.autoJointMapping ? this.getJointSceneObject("wrist_to_ring", this.root) : this.ringToWrist
    this.ringKnuckle = this.autoJointMapping ? this.getJointSceneObject("ring-0", this.root) : this.ringKnuckle
    this.ringMidJoint = this.autoJointMapping ? this.getJointSceneObject("ring-1", this.root) : this.ringMidJoint
    this.ringUpperJoint = this.autoJointMapping ? this.getJointSceneObject("ring-2", this.root) : this.ringUpperJoint
    this.ringTip = this.autoJointMapping ? this.getJointSceneObject("ring-3", this.root) : this.ringTip
    this.pinkyToWrist = this.autoJointMapping
      ? this.getJointSceneObject("wrist_to_pinky", this.root)
      : this.pinkyToWrist
    this.pinkyKnuckle = this.autoJointMapping ? this.getJointSceneObject("pinky-0", this.root) : this.pinkyKnuckle
    this.pinkyMidJoint = this.autoJointMapping ? this.getJointSceneObject("pinky-1", this.root) : this.pinkyMidJoint
    this.pinkyUpperJoint = this.autoJointMapping ? this.getJointSceneObject("pinky-2", this.root) : this.pinkyUpperJoint
    this.pinkyTip = this.autoJointMapping ? this.getJointSceneObject("pinky-3", this.root) : this.pinkyTip

    this.initialized = true

    this.hand.initHandVisuals()
    this._glowEffectView = new GlowEffectView({
      debugModeEnabled: this.debugModeEnabled,
      handVisuals: this,
      handType: this.handType as HandType,
      unitPlaneMesh: this.unitPlaneMesh,
      handInteractor: this.handInteractor,
      handVisualSelection: this._handVisualSelection,
      style: {
        hoverColor: this.hoverColor,
        triggerColor: this.triggerColor,
        tipGlowMaterial: this.tipGlowMaterial,
        pinchBrightnessMax: this.pinchBrightnessMax,
        pinchGlowBrightnessMax: this.pinchGlowBrightnessMax,
        pinchBrightnessMaxStrength: this.pinchBrightnessMaxStrength,
        pinchTriggeredMult: this.pinchTriggeredMult,
        pinchExponent: this.pinchExponent,
        pinchExponentTriggered: this.pinchExponentTriggered,
        pinchHighlightThresholdFar: this.pinchHighlightThresholdFar,
        pinchHighlightThresholdNear: this.pinchHighlightThresholdNear,
        pokeBrightnessMax: this.pokeBrightnessMax,
        pokeGlowBrightnessMax: this.pokeGlowBrightnessMax,
        pokeTriggeredMult: this.pokeTriggeredMult,
        pokeHighlightThresholdFar: this.pokeHighlightThresholdFar,
        pokeHighlightThresholdNear: this.pokeHighlightThresholdNear,
        pokeOccludeThresholdFar: this.pokeOccludeThresholdFar,
        pokeOccludeThresholdNear: this.pokeOccludeThresholdNear,
        pokeExponent: this.pokeExponent,
        pokeExponentTriggered: this.pokeExponentTriggered,
        tipGlowRenderOrder: this.tipGlowRenderOrder,
        tipGlowWorldScale: this.tipGlowWorldScale,
        triggeredLerpDurationSeconds: this.triggeredLerpDurationSeconds,
        pinchValidLerpDurationSeconds: this.pinchValidLerpDurationSeconds,
        pokeValidLerpDurationSeconds: this.pokeValidLerpDurationSeconds
      }
    })

    this.visualSelection = this._handVisualSelection
  }

  /**
   * Adds a hand visual override for a specific interactable.
   * @param override - The HandVisualOverride to add.
   */
  addOverride(override: HandVisualOverride): void {
    this.overrideMap.set(override.interactableSceneObject, override)
  }

  /**
   * Removes a hand visual override by its unique ID.
   * @param id - The ID of the override to remove.
   * @returns True if removed, false if not found.
   */
  removeOverride(interactableObject: SceneObject): boolean {
    const override = this.overrideMap.get(interactableObject)
    if (!override) {
      return false
    }
    this.overrideMap.delete(interactableObject)
    return true
  }

  private fillOverrideMapFromArray(): void {
    for (const override of this.overrides) {
      if (override.interactableSceneObject) {
        this.overrideMap.set(override.interactableSceneObject, override)
      }
    }
  }

  private onUpdate(): void {
    this.updateFrustumCulling()
    this.updateVisualsEnabledState()
  }

  private updateVisualsEnabledState(): void {
    const isNoneSelection = this.visualSelection === HandVisualSelection.None
    const isGloballyVisible = this._isVisible && this.isHandVisibleByStatus && !isNoneSelection

    if (this.wrist && this.wrist.enabled !== isGloballyVisible) {
      this.wrist.enabled = isGloballyVisible
    }

    if (!this.glowEffectView) {
      const isVisible = isGloballyVisible && this.visualSelection !== HandVisualSelection.Occluder
      if (this.handMeshFull.sceneObject.enabled !== isVisible) {
        this.handMeshFull.sceneObject.enabled = isVisible
      }
      if (this.handMeshIndexThumb.sceneObject.enabled !== isVisible) {
        this.handMeshIndexThumb.sceneObject.enabled = isVisible
      }
      return
    }

    const finalMeshVisibility = isGloballyVisible && this.glowEffectView.isMeshVisibilityDesired
    const finalIndexGlowVisibility = isGloballyVisible && this.glowEffectView.isIndexGlowVisible
    const finalThumbGlowVisibility = isGloballyVisible && this.glowEffectView.isThumbGlowVisible

    const showFullMesh = finalMeshVisibility && this.activeHandMesh === this.handMeshFull
    const showIndexThumbMesh = finalMeshVisibility && this.activeHandMesh === this.handMeshIndexThumb

    if (this.handMeshFull.sceneObject.enabled !== showFullMesh) {
      this.handMeshFull.sceneObject.enabled = showFullMesh
    }
    if (this.handMeshIndexThumb.sceneObject.enabled !== showIndexThumbMesh) {
      this.handMeshIndexThumb.sceneObject.enabled = showIndexThumbMesh
    }

    const indexGlowObject = this.glowEffectView.indexGlowSceneObject
    if (indexGlowObject.enabled !== finalIndexGlowVisibility) {
      indexGlowObject.enabled = finalIndexGlowVisibility
    }

    const thumbGlowObject = this.glowEffectView.thumbGlowSceneObject
    if (thumbGlowObject.enabled !== finalThumbGlowVisibility) {
      thumbGlowObject.enabled = finalThumbGlowVisibility
    }
  }

  private updateFrustumCulling(): void {
    if (!this.activeHandMesh || !this.activeHandMesh.sceneObject.enabled) {
      return
    }

    const hand = this.hand
    const wrist = hand.wrist
    const frustumCull = this.frustumCull

    const wristPos = wrist.position
    const wristRight = wrist.right
    const wristUp = wrist.up
    const wristForward = wrist.forward

    const wristPosX = wristPos.x
    const wristPosY = wristPos.y
    const wristPosZ = wristPos.z
    const wristRightX = wristRight.x
    const wristRightY = wristRight.y
    const wristRightZ = wristRight.z
    const wristUpX = wristUp.x
    const wristUpY = wristUp.y
    const wristUpZ = wristUp.z
    const wristForwardX = wristForward.x
    const wristForwardY = wristForward.y
    const wristForwardZ = wristForward.z

    const handPositions = frustumCull.handPositions
    handPositions[0] = hand.thumbKnuckle.position
    handPositions[1] = hand.thumbTip.position
    handPositions[2] = hand.indexKnuckle.position
    handPositions[3] = hand.indexMidJoint.position
    handPositions[4] = hand.indexTip.position
    handPositions[5] = hand.wrist.position
    handPositions[6] = hand.middleMidJoint.position
    handPositions[7] = hand.middleTip.position
    handPositions[8] = hand.ringTip.position
    handPositions[9] = hand.pinkyKnuckle.position
    handPositions[10] = hand.pinkyTip.position

    const localMin = frustumCull.localMin
    const localMax = frustumCull.localMax

    const firstPos = handPositions[0]
    const firstRelX = firstPos.x - wristPosX
    const firstRelY = firstPos.y - wristPosY
    const firstRelZ = firstPos.z - wristPosZ

    let minX = firstRelX * wristRightX + firstRelY * wristRightY + firstRelZ * wristRightZ
    let minY = firstRelX * wristUpX + firstRelY * wristUpY + firstRelZ * wristUpZ
    let minZ = firstRelX * wristForwardX + firstRelY * wristForwardY + firstRelZ * wristForwardZ
    let maxX = minX
    let maxY = minY
    let maxZ = minZ

    const isIndexThumbMesh = this.activeHandMesh === this.handMeshIndexThumb
    const numPositionsToCheck = isIndexThumbMesh
      ? frustumCull.NUM_INDEX_THUMB_POSITIONS
      : frustumCull.NUM_FULL_POSITIONS

    for (let i = 1; i < numPositionsToCheck; i++) {
      const worldPos = handPositions[i]

      const relX = worldPos.x - wristPosX
      const relY = worldPos.y - wristPosY
      const relZ = worldPos.z - wristPosZ

      const localX = relX * wristRightX + relY * wristRightY + relZ * wristRightZ
      const localY = relX * wristUpX + relY * wristUpY + relZ * wristUpZ
      const localZ = relX * wristForwardX + relY * wristForwardY + relZ * wristForwardZ

      if (localX < minX) minX = localX
      else if (localX > maxX) maxX = localX

      if (localY < minY) minY = localY
      else if (localY > maxY) maxY = localY

      if (localZ < minZ) minZ = localZ
      else if (localZ > maxZ) maxZ = localZ
    }

    const padding = 2.0
    localMin.x = minX - padding
    localMin.y = minY - padding
    localMin.z = minZ - padding
    localMax.x = maxX + padding
    localMax.y = maxY + padding
    localMax.z = maxZ + padding

    const frustumCullMin = frustumCull.frustumCullMin
    const frustumCullMax = frustumCull.frustumCullMax
    const mainMaterial = this.activeHandMesh.mainMaterial
    const passCount = mainMaterial.getPassCount()

    if (frustumCull.isLeftHand) {
      frustumCullMin.x = localMin.x
      frustumCullMin.y = localMax.z * -1
      frustumCullMin.z = localMin.y

      frustumCullMax.x = localMax.x
      frustumCullMax.y = localMin.z * -1
      frustumCullMax.z = localMax.y

      for (let i = 0; i < passCount; i++) {
        const pass = mainMaterial.getPass(i)
        pass.frustumCullMin = frustumCullMin
        pass.frustumCullMax = frustumCullMax
      }
    } else {
      frustumCullMin.x = localMin.x
      frustumCullMin.y = localMin.y
      frustumCullMin.z = localMin.z

      frustumCullMax.x = localMax.x
      frustumCullMax.y = localMax.y
      frustumCullMax.z = localMax.z

      for (let i = 0; i < passCount; i++) {
        const pass = mainMaterial.getPass(i)
        pass.frustumCullMin = frustumCullMin
        pass.frustumCullMax = frustumCullMax
      }
    }

    if (this.debugModeEnabled) {
      const actualMin = new vec3(frustumCullMin.x, frustumCullMin.y, frustumCullMin.z)
      const actualMax = new vec3(frustumCullMax.x, frustumCullMax.y, frustumCullMax.z)

      // Calculate center and extents in local space
      const localCenter = new vec3(
        (actualMin.x + actualMax.x) * 0.5,
        (actualMin.y + actualMax.y) * 0.5,
        (actualMin.z + actualMax.z) * 0.5
      )
      const localExtents = new vec3(
        (actualMax.x - actualMin.x) * 0.5,
        (actualMax.y - actualMin.y) * 0.5,
        (actualMax.z - actualMin.z) * 0.5
      )

      let worldCenter: vec3
      if (frustumCull.isLeftHand) {
        worldCenter = new vec3(
          wristPosX + localCenter.x * wristRightX + localCenter.z * wristUpX + -localCenter.y * wristForwardX,
          wristPosY + localCenter.x * wristRightY + localCenter.z * wristUpY + -localCenter.y * wristForwardY,
          wristPosZ + localCenter.x * wristRightZ + localCenter.z * wristUpZ + -localCenter.y * wristForwardZ
        )
      } else {
        worldCenter = new vec3(
          wristPosX + localCenter.x * wristRightX + localCenter.y * wristUpX + localCenter.z * wristForwardX,
          wristPosY + localCenter.x * wristRightY + localCenter.y * wristUpY + localCenter.z * wristForwardY,
          wristPosZ + localCenter.x * wristRightZ + localCenter.y * wristUpZ + localCenter.z * wristForwardZ
        )
      }

      const corners = [
        // Bottom face (min Z)
        new vec3(-localExtents.x, -localExtents.y, -localExtents.z),
        new vec3(+localExtents.x, -localExtents.y, -localExtents.z),
        new vec3(+localExtents.x, +localExtents.y, -localExtents.z),
        new vec3(-localExtents.x, +localExtents.y, -localExtents.z),
        // Top face (max Z)
        new vec3(-localExtents.x, -localExtents.y, +localExtents.z),
        new vec3(+localExtents.x, -localExtents.y, +localExtents.z),
        new vec3(+localExtents.x, +localExtents.y, +localExtents.z),
        new vec3(-localExtents.x, +localExtents.y, +localExtents.z)
      ]

      // Transform all corners to world space
      const worldCorners: vec3[] = []
      for (const corner of corners) {
        let worldCorner: vec3
        if (frustumCull.isLeftHand) {
          worldCorner = new vec3(
            worldCenter.x + corner.x * wristRightX + corner.z * wristUpX + -corner.y * wristForwardX,
            worldCenter.y + corner.x * wristRightY + corner.z * wristUpY + -corner.y * wristForwardY,
            worldCenter.z + corner.x * wristRightZ + corner.z * wristUpZ + -corner.y * wristForwardZ
          )
        } else {
          worldCorner = new vec3(
            worldCenter.x + corner.x * wristRightX + corner.y * wristUpX + corner.z * wristForwardX,
            worldCenter.y + corner.x * wristRightY + corner.y * wristUpY + corner.z * wristForwardY,
            worldCenter.z + corner.x * wristRightZ + corner.y * wristUpZ + corner.z * wristForwardZ
          )
        }
        worldCorners.push(worldCorner)
      }

      const boxColor = new vec4(0, 1, 0.5, 1)
      // Bottom
      global.debugRenderSystem.drawLine(worldCorners[0], worldCorners[1], boxColor)
      global.debugRenderSystem.drawLine(worldCorners[1], worldCorners[2], boxColor)
      global.debugRenderSystem.drawLine(worldCorners[2], worldCorners[3], boxColor)
      global.debugRenderSystem.drawLine(worldCorners[3], worldCorners[0], boxColor)
      // Top
      global.debugRenderSystem.drawLine(worldCorners[4], worldCorners[5], boxColor)
      global.debugRenderSystem.drawLine(worldCorners[5], worldCorners[6], boxColor)
      global.debugRenderSystem.drawLine(worldCorners[6], worldCorners[7], boxColor)
      global.debugRenderSystem.drawLine(worldCorners[7], worldCorners[4], boxColor)
      // Sides
      global.debugRenderSystem.drawLine(worldCorners[0], worldCorners[4], boxColor)
      global.debugRenderSystem.drawLine(worldCorners[1], worldCorners[5], boxColor)
      global.debugRenderSystem.drawLine(worldCorners[2], worldCorners[6], boxColor)
      global.debugRenderSystem.drawLine(worldCorners[3], worldCorners[7], boxColor)

      const jointTransforms = [
        hand.thumbKnuckle,
        hand.thumbTip,
        hand.indexKnuckle,
        hand.indexMidJoint,
        hand.indexTip,
        hand.wrist,
        hand.middleMidJoint,
        hand.middleTip,
        hand.ringTip,
        hand.pinkyKnuckle,
        hand.pinkyTip
      ]

      for (let i = 0; i < numPositionsToCheck; i++) {
        const joint = jointTransforms[i]
        const jointPos = joint.position
        const axisLength = 1.0

        const rightEnd = new vec3(
          jointPos.x + joint.right.x * axisLength,
          jointPos.y + joint.right.y * axisLength,
          jointPos.z + joint.right.z * axisLength
        )
        global.debugRenderSystem.drawLine(jointPos, rightEnd, new vec4(1, 0, 0, 1))

        const upEnd = new vec3(
          jointPos.x + joint.up.x * axisLength,
          jointPos.y + joint.up.y * axisLength,
          jointPos.z + joint.up.z * axisLength
        )
        global.debugRenderSystem.drawLine(jointPos, upEnd, new vec4(0, 1, 0, 1))

        const forwardEnd = new vec3(
          jointPos.x + joint.forward.x * axisLength,
          jointPos.y + joint.forward.y * axisLength,
          jointPos.z + joint.forward.z * axisLength
        )
        global.debugRenderSystem.drawLine(jointPos, forwardEnd, new vec4(0, 0, 1, 1))
      }
    }
  }
}
