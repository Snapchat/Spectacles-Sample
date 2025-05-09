import {HandInteractor} from "../../../Core/HandInteractor/HandInteractor"
import {HandInputData} from "../../../Providers/HandInputData/HandInputData"
import {HandType} from "../../../Providers/HandInputData/HandType"
import {HandVisuals} from "../../../Providers/HandInputData/HandVisuals"
import TrackedHand from "../../../Providers/HandInputData/TrackedHand"
import {InteractionConfigurationProvider} from "../../../Providers/InteractionConfigurationProvider/InteractionConfigurationProvider"
import {InputChecker} from "../../../Utils/InputChecker"
import {findSceneObjectByName} from "../../../Utils/SceneObjectUtils"
import {validate} from "../../../Utils/validate"
import {GlowEffectView} from "./GlowEffectView"
import RadialOcclusionView from "./RadialOcclusionView"

const TAG = "HandVisual"

export enum HandVisualSelection {
  Default = "Default",
  Occluder = "Occluder",
}

/**
 * This class provides a visual representation of the hand, with the ability to automatically wire joints to the hand mesh. It also provides the ability to add a radial gradient occlusion effect and a glow effect to the hand mesh.
 */

@component
export class HandVisual extends BaseScriptComponent implements HandVisuals {
  @ui.group_start("Hand Visual")
  @input
  @widget(
    new ComboBoxWidget([
      new ComboBoxItem("Left", "left"),
      new ComboBoxItem("Right", "right"),
    ]),
  )
  private handType!: string
  @input
  @widget(
    new ComboBoxWidget([
      new ComboBoxItem("Default", "Default"),
      new ComboBoxItem("Occluder", "Occluder"),
    ]),
  )
  private selectVisual: string = "Default"
  @input handInteractor: HandInteractor
  @input
  /**
   * Reference to the RenderMeshVisual of the hand mesh.
   */
  handMesh!: RenderMeshVisual

  @input
  @hint("The desired render order of the handMesh")
  private handMeshRenderOrder: number = 9999

  @input
  @hint("Parent of both the rig and the mesh")
  /** @inheritdoc */
  root!: SceneObject
  @input
  @hint("If checked the HandVisual will attempt to automatically wire joints")
  /**
   * Check to engage [Automatic Setup](#automatic-setup), leave unchecked for [Manual Setup](#manual-setup). Defaults to "true".
   */
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
  @input
  @hint("Whether or not the thumb should glow when poking")
  private shouldThumbPokeGlow: boolean = false
  @input
  @hint("The plane mesh on which the glow texture/material will be rendered")
  private unitPlaneMesh!: RenderMesh
  @input
  @hint("The material which will be manipulated to create the glow effect")
  private tipGlowMaterial!: Material
  @input
  @widget(new ColorWidget())
  @hint("The color the glow will be when you are not pinching")
  private idleColor!: vec4
  @input
  @widget(new ColorWidget())
  @hint("The color the glow will be when you are pinching")
  private pinchDownColor!: vec4
  @input
  @hint(
    "How close index finger of tapping hand has to be to tapped hand to initiate tap glow",
  )
  private tapProximityThreshold!: number
  @input
  @hint("The texture applied to the hand when creating pinch glow effect")
  private pinchTexture!: Texture
  @input
  @hint("The texture applied to the hand when creating tap glow effect")
  private tapTexture!: Texture
  @input
  @hint("The render order of the quad on which the tip glow effect occurs")
  private tipGlowRenderOrder: number = 10000
  @ui.group_end
  @ui.group_start("Radial Gradient Occlusion")
  @input
  @hint("Whether or not the radial gradient occluder is enabled")
  private occluderEnabled: boolean = false
  @input
  @hint("The plane mesh the radial gradient occluder will be rendered")
  private occluderUnitPlaneMesh!: RenderMesh
  @input
  @hint("The material which will be create the gradient occlusion effect")
  private radialGradientOcclusionMaterial!: Material
  @input
  @hint("The render order of the gradient quad tracked to the hand")
  private gradientQuadRenderOrder: number = 9997
  @ui.group_end
  @ui.group_end
  @ui.group_start("Hand Mesh Materials")
  @input
  @hint(
    "The material which will be create the default visual effect on the hand mesh"
  )
  private handOutlineMaterial: Material
  @input
  @hint(
    "The material which will be create the occluder visual effect on the hand mesh"
  )
  private handOccluderMaterial: Material
  @ui.group_end

  // Dependencies
  private handProvider: HandInputData = HandInputData.getInstance()
  private interactionConfigurationProvider: InteractionConfigurationProvider =
    InteractionConfigurationProvider.getInstance()
  private inputChecker = new InputChecker(TAG)
  private hand: TrackedHand | undefined
  private radialOcclusionView: RadialOcclusionView | undefined
  private glowEffectView: GlowEffectView | undefined
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  private _enabled: boolean = true
  private _handVisualSelection: HandVisualSelection = this
    .selectVisual as HandVisualSelection

  initialized = false

  /**
   * Sets the selection of the hand visual to present to user
   */
  set visualSelection(selection: HandVisualSelection) {
    this._handVisualSelection = selection
    this.glowEffectView?.setVisualSelection(selection)
  }

  /**
   * @returns the current selection of the hand visual to present to user
   */
  get visualSelection(): HandVisualSelection {
    return this._handVisualSelection
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
    this.setEnabled(true)
  }

  protected defineOnDisableBehavior(): void {
    this.setEnabled(false)
  }

  protected defineOnDestroyBehavior(): void {
    if (this.glowEffectView !== undefined) {
      this.glowEffectView.destroy()
    }
    if (this.radialOcclusionView !== undefined) {
      this.radialOcclusionView.destroy()
    }

    this.hand?.detachHandVisuals(this)
  }

  private defineHandEvents() {
    validate(this.hand)

    this.hand.onEnabledChanged.add((enabled: boolean) => {
      this._enabled = enabled
      // We shouldn't turn on the hand visuals until the hand has actually been found.
      if (!enabled) {
        this.setEnabled(false)
      }
    })

    this.hand.onHandFound.add(() => {
      if (this._enabled) {
        this.setEnabled(true)
      }
    })

    this.hand.onHandLost.add(() => {
      if (this._enabled) {
        this.setEnabled(false)
      }
    })
  }

  private getJointSceneObject(
    targetSceneObjectName: string,
    root: SceneObject
  ) {
    const sceneObject = findSceneObjectByName(root, targetSceneObjectName)
    if (sceneObject === null) {
      throw new Error(
        `${targetSceneObjectName} could not be found in children of SceneObject: ${this.root?.name}`
      )
    }
    return sceneObject
  }

  private setEnabled(enabled: boolean) {
    if (this.glowEffectView !== undefined) {
      this.glowEffectView.enabled = enabled
    }
    if (this.radialOcclusionView !== undefined) {
      this.radialOcclusionView.enabled = enabled
    }
    this.handMesh.enabled = enabled
  }

  onAwake(): void {
    if (this.handType !== "right") {
      this.hand = this.handProvider.getHand("left")
    } else {
      this.hand = this.handProvider.getHand("right")
    }

    this.hand.attachHandVisuals(this)

    this.defineHandEvents()
    this.defineScriptEvents()

    this.handMesh.setRenderOrder(this.handMeshRenderOrder)

    /*
     * HandVisuals were not working correctly with frustum culling,
     * instead manually define the AABB for frustum culling
     */
    const min = this.handMesh.mesh.aabbMin
    const max = this.handMesh.mesh.aabbMax

    const pass = this.handMesh.mainMaterial.mainPass
    pass.frustumCullMode = FrustumCullMode.UserDefinedAABB
    pass.frustumCullMin = min
    pass.frustumCullMax = max
  }

  public initialize(): void {
    if (this.initialized) {
      return
    }
    validate(this.hand)

    this.wrist = this.autoJointMapping
      ? this.getJointSceneObject("wrist", this.root)
      : this.wrist

    this.thumbToWrist = this.autoJointMapping
      ? this.getJointSceneObject("wrist_to_thumb", this.root)
      : this.thumbToWrist
    this.thumbBaseJoint = this.autoJointMapping
      ? this.getJointSceneObject("thumb-0", this.root)
      : this.thumbBaseJoint
    this.thumbKnuckle = this.autoJointMapping
      ? this.getJointSceneObject("thumb-1", this.root)
      : this.thumbKnuckle
    this.thumbMidJoint = this.autoJointMapping
      ? this.getJointSceneObject("thumb-2", this.root)
      : this.thumbMidJoint
    this.thumbTip = this.autoJointMapping
      ? this.getJointSceneObject("thumb-3", this.root)
      : this.thumbTip
    this.indexToWrist = this.autoJointMapping
      ? this.getJointSceneObject("wrist_to_index", this.root)
      : this.indexToWrist
    this.indexKnuckle = this.autoJointMapping
      ? this.getJointSceneObject("index-0", this.root)
      : this.indexKnuckle
    this.indexMidJoint = this.autoJointMapping
      ? this.getJointSceneObject("index-1", this.root)
      : this.indexMidJoint
    this.indexUpperJoint = this.autoJointMapping
      ? this.getJointSceneObject("index-2", this.root)
      : this.indexUpperJoint
    this.indexTip = this.autoJointMapping
      ? this.getJointSceneObject("index-3", this.root)
      : this.indexTip
    this.middleToWrist = this.autoJointMapping
      ? this.getJointSceneObject("wrist_to_mid", this.root)
      : this.middleToWrist
    this.middleKnuckle = this.autoJointMapping
      ? this.getJointSceneObject("mid-0", this.root)
      : this.middleKnuckle
    this.middleMidJoint = this.autoJointMapping
      ? this.getJointSceneObject("mid-1", this.root)
      : this.middleMidJoint
    this.middleUpperJoint = this.autoJointMapping
      ? this.getJointSceneObject("mid-2", this.root)
      : this.middleUpperJoint
    this.middleTip = this.autoJointMapping
      ? this.getJointSceneObject("mid-3", this.root)
      : this.middleTip
    this.ringToWrist = this.autoJointMapping
      ? this.getJointSceneObject("wrist_to_ring", this.root)
      : this.ringToWrist
    this.ringKnuckle = this.autoJointMapping
      ? this.getJointSceneObject("ring-0", this.root)
      : this.ringKnuckle
    this.ringMidJoint = this.autoJointMapping
      ? this.getJointSceneObject("ring-1", this.root)
      : this.ringMidJoint
    this.ringUpperJoint = this.autoJointMapping
      ? this.getJointSceneObject("ring-2", this.root)
      : this.ringUpperJoint
    this.ringTip = this.autoJointMapping
      ? this.getJointSceneObject("ring-3", this.root)
      : this.ringTip
    this.pinkyToWrist = this.autoJointMapping
      ? this.getJointSceneObject("wrist_to_pinky", this.root)
      : this.pinkyToWrist
    this.pinkyKnuckle = this.autoJointMapping
      ? this.getJointSceneObject("pinky-0", this.root)
      : this.pinkyKnuckle
    this.pinkyMidJoint = this.autoJointMapping
      ? this.getJointSceneObject("pinky-1", this.root)
      : this.pinkyMidJoint
    this.pinkyUpperJoint = this.autoJointMapping
      ? this.getJointSceneObject("pinky-2", this.root)
      : this.pinkyUpperJoint
    this.pinkyTip = this.autoJointMapping
      ? this.getJointSceneObject("pinky-3", this.root)
      : this.pinkyTip

    this.initialized = true
    // The joints are now ready and the effects can be initialized

    this.hand.initHandVisuals()
    this.glowEffectView = new GlowEffectView({
      handType: this.handType as HandType,
      unitPlaneMesh: this.unitPlaneMesh,
      tipGlowMaterial: this.tipGlowMaterial,
      idleColor: this.idleColor,
      pinchDownColor: this.pinchDownColor,
      tapProximityThreshold: this.tapProximityThreshold,
      tapTexture: this.tapTexture,
      pinchTexture: this.pinchTexture,
      tipGlowRenderOrder: this.tipGlowRenderOrder,
      handInteractor: this.handInteractor,
      visualSelection: this._handVisualSelection,
      handOutlineMaterial: this.handOutlineMaterial,
      handOccluderMaterial: this.handOccluderMaterial,
      shouldThumbPokeGlow: this.shouldThumbPokeGlow,
    })

    if (!this.occluderEnabled) {
      return
    }

    this.radialOcclusionView = new RadialOcclusionView({
      handType: this.handType as HandType,
      unitPlaneMesh: this.occluderUnitPlaneMesh,
      radialGradientOcclusionMaterial: this.radialGradientOcclusionMaterial,
      gradientQuadRenderOrder: this.gradientQuadRenderOrder,
    })
  }
}
