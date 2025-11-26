import {GlowEffectView} from "../../Components/Interaction/HandVisual/GlowEffectView"
import {HandMeshType, HandVisualOverride, HandVisualSelection} from "../../Components/Interaction/HandVisual/HandVisual"

/**
 * Provides the SceneObject to be attached to the {@link BaseHand}
 */
export interface HandVisuals {
  readonly handMesh: RenderMeshVisual | undefined

  /**
   * Reference to the RenderMeshVisual of the full hand mesh.
   */
  readonly handMeshFull: RenderMeshVisual | undefined

  /**
   * Reference to the RenderMeshVisual of the hand mesh with only an index & thumb for efficiency.
   */
  readonly handMeshIndexThumb: RenderMeshVisual | undefined

  /**
   * Reference to the RenderMeshVisual of the full hand mesh to pin SceneObjects to.
   */
  readonly handMeshPin: RenderMeshVisual | undefined

  /**
   * The root {@link SceneObject}, parent of the hand rig and hand mesh
   */
  readonly root: SceneObject | undefined

  /**
   * The {@link SceneObject} of the wrist joint
   */
  readonly wrist: SceneObject | undefined

  /**
   * The {@link SceneObject} of the thumbToWrist joint
   */
  readonly thumbToWrist: SceneObject | undefined

  /**
   * The {@link SceneObject} of the thumbBaseJoint joint
   */
  readonly thumbBaseJoint: SceneObject | undefined

  /**
   * The {@link SceneObject} of the thumbKnuckle joint
   */
  readonly thumbKnuckle: SceneObject | undefined

  /**
   * The {@link SceneObject} of the thumbMidJoint joint
   */
  readonly thumbMidJoint: SceneObject | undefined

  /**
   * The {@link SceneObject} of the thumbTip joint
   */
  readonly thumbTip: SceneObject | undefined

  /**
   * The {@link SceneObject} of the indexToWrist joint
   */
  readonly indexToWrist: SceneObject | undefined

  /**
   * The {@link SceneObject} of the indexKnuckle joint
   */
  readonly indexKnuckle: SceneObject | undefined

  /**
   * The {@link SceneObject} of the indexMidJoint joint
   */
  readonly indexMidJoint: SceneObject | undefined

  /**
   * The {@link SceneObject} of the indexUpperJoint joint
   */
  readonly indexUpperJoint: SceneObject | undefined

  /**
   * The {@link SceneObject} of the indexTip joint
   */
  readonly indexTip: SceneObject | undefined

  /**
   * The {@link SceneObject} of the middleToWrist joint
   */
  readonly middleToWrist: SceneObject | undefined

  /**
   * The {@link SceneObject} of the middleKnuckle joint
   */
  readonly middleKnuckle: SceneObject | undefined

  /**
   * The {@link SceneObject} of the middleMidJoint joint
   */
  readonly middleMidJoint: SceneObject | undefined

  /**
   * The {@link SceneObject} of the middleUpperJoint joint
   */
  readonly middleUpperJoint: SceneObject | undefined

  /**
   * The {@link SceneObject} of the middleTip joint
   */
  readonly middleTip: SceneObject | undefined

  /**
   * The {@link SceneObject} of the ringToWrist joint
   */
  readonly ringToWrist: SceneObject | undefined

  /**
   * The {@link SceneObject} of the ringKnuckle joint
   */
  readonly ringKnuckle: SceneObject | undefined

  /**
   * The {@link SceneObject} of the ringMidJoint joint
   */
  readonly ringMidJoint: SceneObject | undefined

  /**
   * The {@link SceneObject} of the ringUpperJoint joint
   */
  readonly ringUpperJoint: SceneObject | undefined

  /**
   * The {@link SceneObject} of the ringTip joint
   */
  readonly ringTip: SceneObject | undefined

  /**
   * The {@link SceneObject} of the pinkyToWrist joint
   */
  readonly pinkyToWrist: SceneObject | undefined

  /**
   * The {@link SceneObject} of the pinkyKnuckle joint
   */
  readonly pinkyKnuckle: SceneObject | undefined

  /**
   * The {@link SceneObject} of the pinkyMidJoint joint
   */
  readonly pinkyMidJoint: SceneObject | undefined

  /**
   * The {@link SceneObject} of the pinkyUpperJoint joint
   */
  readonly pinkyUpperJoint: SceneObject | undefined

  /**
   * The {@link SceneObject} of the pinkyTip joint
   */
  readonly pinkyTip: SceneObject | undefined

  /**
   * Sets the selection of the hand visual to present to user
   */
  visualSelection: HandVisualSelection

  /**
   * Gets or sets the mesh type to display (Full or IndexThumb)
   */
  meshType: HandMeshType

  /**
   * Gets or sets whether the hand visual is visible. When false, all hand visual components (mesh, glow effects, and
   * wrist) will not be shown regardless of tracking status.
   */
  isVisible: boolean

  /**
   * True when this class is ready to use.
   *
   * @remarks
   * {@link initialize} can be used to initialize the instance.
   */
  readonly initialized: boolean

  /**
   * The glow effect view that provides visual feedback for hand interactions.
   */
  glowEffectView: GlowEffectView | undefined

  /**
   * Sets up all joint {@link Transform}s and sets {@link initialized} to true.
   */
  initialize(): void

  /**
   * Adds a hand visual override for a specific interactable.
   * @param override - The HandVisualOverride to add.
   */
  addOverride(override: HandVisualOverride): void

  /**
   * Removes a hand visual override by its interactable SceneObject.
   * @param interactableObject - The SceneObject of the override to remove.
   * @returns True if removed, false if not found.
   */
  removeOverride(interactableObject: SceneObject): boolean
}
