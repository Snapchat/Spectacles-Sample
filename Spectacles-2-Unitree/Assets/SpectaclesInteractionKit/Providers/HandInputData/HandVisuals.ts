/**
 * Provides the SceneObject to be attached to the {@link BaseHand}
 */
export interface HandVisuals {
  readonly handMesh: RenderMeshVisual | undefined

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
   * True when this class is ready to use.
   *
   * @remarks
   * {@link initialize} can be used to initialize the instance.
   */
  readonly initialized: boolean

  /**
   * Sets up all joint {@link Transform}s and sets {@link initialized} to true.
   */
  initialize(): void
}
