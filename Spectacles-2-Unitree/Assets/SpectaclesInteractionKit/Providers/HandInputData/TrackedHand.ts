import {CancelToken, setTimeout} from "../../Utils/debounce"
import Event, {PublicApi} from "../../Utils/Event"
import NativeLogger from "../../Utils/NativeLogger"
import {
  PinchDetectionSelection,
  PinchDetector,
} from "./GestureProvider/PinchDetection/PinchDetector"
import {JointNode, JOINT_HIERARCHY} from "./Joints"

import {validate} from "../../Utils/validate"
import WorldCameraFinderProvider from "../CameraProvider/WorldCameraFinderProvider"
import {TargetingData} from "../TargetProvider/TargetingData"
import {BaseHand} from "./BaseHand"
import DefaultHandTrackingAssetProvider from "./DefaultHandTrackingAssetProvider"
import GestureModuleProvider from "./GestureProvider/GestureModuleProvider"
import PalmTapDetector from "./GestureProvider/PalmTapDetection/PalmTapDetector"
import {PalmTapDetectionEvent} from "./GestureProvider/PalmTapDetectionEvent"
import {HandType} from "./HandType"
import {HandVisuals} from "./HandVisuals"
import {Keypoint} from "./Keypoint"
import {LandmarkName} from "./LandmarkNames"

export type BaseHandConfig = {
  handType: HandType
  isDominantHand: boolean
}

export enum TrackingEvent {
  OnTrackingStarted = "OnTrackingStarted",
  OnTrackingLost = "OnTrackingLost",
}

const TAG = "TrackedHand"
const HAND_FACING_THRESHOLD = 40.0
const POINTING_PITCH_THRESHOLD = -60.0

// GestureModule can take up to 350ms to determine if a pinch has been sustained.
const OBJECT_TRACKING_3D_TIMEOUT_MS = 400

export type OrientationVectors = {
  forward: vec3
  right: vec3
  up: vec3
  cameraForward: vec3
}

/**
 * Manages a tracked hand, instantiates fingers and wrists.
 * Also manages the {@link ObjectTracking3D} and creates
 * the needed scene object hierarchy to achieve hand mesh visualization as well as landmarks tracking
 */
export default class TrackedHand implements BaseHand {
  // Dependency injection
  private handTrackingAssetProvider: DefaultHandTrackingAssetProvider =
    DefaultHandTrackingAssetProvider.getInstance()
  protected sceneObjectManager: ScriptScene = global.scene
  private worldCamera: WorldCameraFinderProvider =
    WorldCameraFinderProvider.getInstance()
  private gestureModuleProvider: GestureModuleProvider =
    GestureModuleProvider.getInstance()

  // Native Logging
  private log = new NativeLogger(TAG)

  // SceneObject
  private _enabled = true
  private isDestroyed = false
  private ownerSceneObject: SceneObject

  private cameraObject: SceneObject

  // Events
  private onEnabledChangedEvent = new Event<boolean>()
  readonly onEnabledChanged = this.onEnabledChangedEvent.publicApi()

  private onHandFoundEvent = new Event()
  readonly onHandFound = this.onHandFoundEvent.publicApi()

  private onHandLostEvent = new Event()
  readonly onHandLost = this.onHandLostEvent.publicApi()

  readonly onPinchDown: PublicApi<void>
  readonly onPinchUp: PublicApi<void>
  readonly onPinchCancel: PublicApi<void>

  // Tracking
  private objectTracking3DComponent: ObjectTracking3D

  // Timeouts for temporary pinch sustain
  private objectTracking3DCancelToken: CancelToken | undefined
  private objectTracking3DRecentlyFound: boolean = false

  // Keypoints
  private keypoints = new Map<string, Keypoint>()
  private handVisuals?: HandVisuals
  private allPoints: Keypoint[] = []
  private thumbFingerPoints: Keypoint[] = []
  private indexFingerPoints: Keypoint[] = []
  private middleFingerPoints: Keypoint[] = []
  private ringFingerPoints: Keypoint[] = []
  private pinkyFingerPoints: Keypoint[] = []

  // Pinch
  private pinchDetector: PinchDetector

  // Palm Tap
  private palmTapDetector?: PalmTapDetector

  private _isDominantHand = this.config.isDominantHand

  private _targetingData: TargetingData | null = null

  constructor(private config: BaseHandConfig) {
    this.ownerSceneObject = this.sceneObjectManager.createSceneObject(
      this.handType === "left" ? "LeftHandModelOwner" : "RightHandModelOwner"
    )

    this.cameraObject = this.worldCamera.getComponent().getSceneObject()
    this.ownerSceneObject.setParent(this.cameraObject)

    this.objectTracking3DComponent = this.ownerSceneObject.createComponent(
      "Component.ObjectTracking3D"
    )

    if (this.objectTracking3DComponent === undefined) {
      throw new Error("Failed to create Component.ObjectTracking3D")
    }

    const asset = this.handTrackingAssetProvider.get(this.config.handType)
    if (!isNull(asset)) {
      this.objectTracking3DComponent.trackingAsset = asset
    }

    this.objectTracking3DComponent.objectIndex = 0
    this.objectTracking3DComponent.trackingMode =
      ObjectTracking3D.TrackingMode.Attachment

    const logObjectTrackingEvent = (eventName: TrackingEvent) => {
      this.log.d(
        `Received event from ObjectTracking3D: handType: ${this.config.handType}, eventType: ${eventName}`
      )
    }
    this.objectTracking3DComponent.onTrackingStarted = () => {
      this.objectTracking3DRecentlyFound = true

      logObjectTrackingEvent(TrackingEvent.OnTrackingStarted)
      this.log.v("HandEvent : " + "Hand Found Event")
      this.onHandFoundEvent.invoke()

      this.objectTracking3DCancelToken = setTimeout(() => {
        this.objectTracking3DRecentlyFound = false
      }, OBJECT_TRACKING_3D_TIMEOUT_MS)
    }
    this.objectTracking3DComponent.onTrackingLost = () => {
      this.objectTracking3DRecentlyFound = false

      if (this.objectTracking3DCancelToken !== undefined) {
        this.objectTracking3DCancelToken.cancelled = true
      }

      this.objectTracking3DCancelToken = undefined
      logObjectTrackingEvent(TrackingEvent.OnTrackingLost)
      this.onHandLostEvent.invoke()
      this.log.v("HandEvent : " + "Hand Lost Event")
    }

    this.attachJoints(JOINT_HIERARCHY.children)

    this.setKeypointCollections()

    this.pinchDetector = new PinchDetector({
      handType: this.config.handType,
      thumbTip: this.thumbTip,
      indexTip: this.indexTip,
      onHandLost: this.onHandLost,
      isTracked: () => {
        return this.isTracked()
      },
      pinchDetectionSelection: PinchDetectionSelection.LensCoreML,
    })
    this.onPinchDown = this.pinchDetector.onPinchDown
    this.onPinchUp = this.pinchDetector.onPinchUp
    this.onPinchCancel = this.pinchDetector.onPinchCancel

    const gestureModule = this.gestureModuleProvider.getModule()

    try {
      if (gestureModule !== undefined) {
        const gestureHandType =
          this.handType === "right"
            ? GestureModule.HandType.Right
            : GestureModule.HandType.Left
        gestureModule
          .getTargetingDataEvent(gestureHandType)
          .add((args: TargetingDataArgs) => {
            const rayOriginInCameraParent: vec3 = args.rayOriginInWorld
            const rayDirectionInCameraParent: vec3 = args.rayDirectionInWorld
            const [rayOriginInWorld, rayDirectionInWorld] = this.rayToWorld(
              rayOriginInCameraParent,
              rayDirectionInCameraParent
            )

            this._targetingData = {
              targetingDirectionInWorld: rayDirectionInWorld,
              targetingLocusInWorld: rayOriginInWorld,
              intendsToTarget: args.handIntendsToTarget,
            }
            this.log.v(
              "HandEvent : " +
                "Targeting Data Event" +
                " rayOriginInWorld: " +
                rayOriginInWorld +
                " rayDirectionInWorld: " +
                rayDirectionInWorld
            )
          })
      }
    } catch (error) {
      this.log.e(`Error subscribing to targeting ray event: ${error}`)
    }

    try {
      if (this.handType === "right") {
        this.palmTapDetector = new PalmTapDetector(GestureModule.HandType.Right)
      }
    } catch (error) {
      this.log.w("PalmTapDetector is not supported")
    }
  }

  get enabled(): boolean {
    return this._enabled
  }

  setEnabled(isEnabled: boolean) {
    if (this._enabled === isEnabled) {
      return
    }

    this._enabled = isEnabled
    this.objectTracking3DComponent.enabled = this.enabled
    this.onEnabledChangedEvent.invoke(this._enabled)
    this.log.v(
      "HandEvent : " + "Hand Enabled Changed Event" + " to " + this._enabled
    )
  }

  isFacingCamera(): boolean {
    if (!this.isTracked()) {
      return false
    }

    const facingCameraAngle = this.getFacingCameraAngle()
    return Boolean(
      facingCameraAngle !== null && facingCameraAngle < HAND_FACING_THRESHOLD
    )
  }

  isInTargetingPose(): boolean {
    if (!this.isTracked()) {
      return false
    }

    const pitchAngle = this.getPalmPitchAngle()

    return (
      !this.isFacingCamera() &&
      pitchAngle !== null &&
      pitchAngle > POINTING_PITCH_THRESHOLD
    )
  }

  getPinchDirection(): quat | null {
    if (!this.isTracked()) {
      return null
    }

    const thumbTipPosition = this.thumbTip.position
    const thumbKnucklePosition = this.thumbKnuckle.position
    const indexMidJointPosition = this.indexMidJoint.position

    const forward = thumbTipPosition.sub(thumbKnucklePosition).normalize()
    const right = indexMidJointPosition.sub(thumbKnucklePosition).normalize()
    const up =
      this.handType === "right" ? right.cross(forward) : forward.cross(right)

    return quat.lookAt(forward, up)
  }

  private getHandOrientation(): OrientationVectors {
    /**
     * 1. Create a right vector between the index and middle distals
     * 2. Create a forward vector between the wrist and middle distal
     * 3. Derive an up vector from the previous two vectors
     */
    const handRightVector = this.indexMidJoint.position
      .sub(this.middleMidJoint.position)
      .normalize()
    const handForwardVector = this.middleMidJoint.position
      .sub(this.wrist.position)
      .normalize()
    const handUpVector = handRightVector.cross(handForwardVector)

    const handToCameraVector = this.worldCamera
      .getWorldPosition()
      .sub(this.wrist.position)
      .normalize()

    return {
      forward: handForwardVector,
      right: handRightVector,
      up: handUpVector,
      cameraForward: handToCameraVector,
    }
  }

  getFacingCameraAngle(): number | null {
    if (!this.isTracked()) {
      return null
    }

    /**
     * Apply the camera to wrist direction against the derived up vector to get facing angle
     */
    const handOrientationVectors = this.getHandOrientation()
    const dotHandCamera = handOrientationVectors.up.dot(
      handOrientationVectors.cameraForward
    )

    const angle =
      MathUtils.RadToDeg *
      Math.acos(
        this.config.handType === "right" ? dotHandCamera : -dotHandCamera
      )

    return angle
  }

  getPalmPitchAngle(): number | null {
    if (!this.isTracked()) {
      return null
    }

    /**
     * Compare the hand's forward direction to world up
     */
    const handOrientationVectors = this.getHandOrientation()
    const dotHandUp = handOrientationVectors.forward.dot(vec3.up())
    const angle = 90 - MathUtils.RadToDeg * Math.acos(dotHandUp)

    return angle
  }

  getPalmCenter(): vec3 | null {
    if (!this.isTracked()) {
      return null
    }

    return this.indexKnuckle.position
      .add(this.pinkyKnuckle.position)
      .add(this.middleToWrist.position)
      .uniformScale(1.0 / 3.0)
  }

  get wrist(): Keypoint {
    return this.getKeypoint(LandmarkName.WRIST)
  }

  get thumbProximal(): Keypoint {
    return this.thumbToWrist
  }

  get thumbToWrist(): Keypoint {
    return this.getKeypoint(LandmarkName.WRIST_TO_THUMB)
  }

  get thumbIntermediate(): Keypoint {
    return this.thumbBaseJoint
  }

  get thumbBaseJoint(): Keypoint {
    return this.getKeypoint(LandmarkName.THUMB_0)
  }

  /** @inheritdoc */
  get thumbDistal(): Keypoint {
    return this.thumbKnuckle
  }

  get thumbKnuckle(): Keypoint {
    return this.getKeypoint(LandmarkName.THUMB_1)
  }

  get thumbPad(): Keypoint {
    return this.thumbMidJoint
  }

  get thumbMidJoint(): Keypoint {
    return this.getKeypoint(LandmarkName.THUMB_2)
  }

  get thumbTip(): Keypoint {
    return this.getKeypoint(LandmarkName.THUMB_3)
  }

  get indexProximal(): Keypoint {
    return this.indexToWrist
  }

  get indexToWrist(): Keypoint {
    return this.getKeypoint(LandmarkName.WRIST_TO_INDEX)
  }

  get indexIntermediate(): Keypoint {
    return this.indexKnuckle
  }

  get indexKnuckle(): Keypoint {
    return this.getKeypoint(LandmarkName.INDEX_0)
  }

  get indexDistal(): Keypoint {
    return this.indexMidJoint
  }

  get indexMidJoint(): Keypoint {
    return this.getKeypoint(LandmarkName.INDEX_1)
  }

  get indexPad(): Keypoint {
    return this.indexUpperJoint
  }

  get indexUpperJoint(): Keypoint {
    return this.getKeypoint(LandmarkName.INDEX_2)
  }

  get indexTip(): Keypoint {
    return this.getKeypoint(LandmarkName.INDEX_3)
  }

  get middleProximal(): Keypoint {
    return this.middleToWrist
  }

  get middleToWrist(): Keypoint {
    return this.getKeypoint(LandmarkName.WRIST_TO_MIDDLE)
  }

  get middleIntermediate(): Keypoint {
    return this.middleKnuckle
  }

  get middleKnuckle(): Keypoint {
    return this.getKeypoint(LandmarkName.MIDDLE_0)
  }

  get middleDistal(): Keypoint {
    return this.middleMidJoint
  }

  get middleMidJoint(): Keypoint {
    return this.getKeypoint(LandmarkName.MIDDLE_1)
  }

  get middlePad(): Keypoint {
    return this.middleUpperJoint
  }

  get middleUpperJoint(): Keypoint {
    return this.getKeypoint(LandmarkName.MIDDLE_2)
  }

  get middleTip(): Keypoint {
    return this.getKeypoint(LandmarkName.MIDDLE_3)
  }

  get ringProximal(): Keypoint {
    return this.ringToWrist
  }

  get ringToWrist(): Keypoint {
    return this.getKeypoint(LandmarkName.WRIST_TO_RING)
  }

  get ringIntermediate(): Keypoint {
    return this.ringKnuckle
  }

  get ringKnuckle(): Keypoint {
    return this.getKeypoint(LandmarkName.RING_0)
  }

  get ringDistal(): Keypoint {
    return this.ringMidJoint
  }

  get ringMidJoint(): Keypoint {
    return this.getKeypoint(LandmarkName.RING_1)
  }

  get ringPad(): Keypoint {
    return this.ringUpperJoint
  }

  get ringUpperJoint(): Keypoint {
    return this.getKeypoint(LandmarkName.RING_2)
  }

  get ringTip(): Keypoint {
    return this.getKeypoint(LandmarkName.RING_3)
  }

  get pinkyProximal(): Keypoint {
    return this.pinkyToWrist
  }

  get pinkyToWrist(): Keypoint {
    return this.getKeypoint(LandmarkName.WRIST_TO_PINKY)
  }

  get pinkyIntermediate(): Keypoint {
    return this.pinkyKnuckle
  }

  get pinkyKnuckle(): Keypoint {
    return this.getKeypoint(LandmarkName.PINKY_0)
  }

  get pinkyDistal(): Keypoint {
    return this.pinkyMidJoint
  }

  get pinkyMidJoint(): Keypoint {
    return this.getKeypoint(LandmarkName.PINKY_1)
  }

  get pinkyPad(): Keypoint {
    return this.pinkyUpperJoint
  }

  get pinkyUpperJoint(): Keypoint {
    return this.getKeypoint(LandmarkName.PINKY_2)
  }

  get pinkyTip(): Keypoint {
    return this.getKeypoint(LandmarkName.PINKY_3)
  }

  get thumbFinger(): Keypoint[] {
    return this.thumbFingerPoints
  }

  get indexFinger(): Keypoint[] {
    return this.indexFingerPoints
  }

  get middleFinger(): Keypoint[] {
    return this.middleFingerPoints
  }

  get ringFinger(): Keypoint[] {
    return this.ringFingerPoints
  }

  get pinkyFinger(): Keypoint[] {
    return this.pinkyFingerPoints
  }

  get points(): Keypoint[] {
    return this.allPoints
  }

  get handType(): HandType {
    return this.config.handType
  }

  get isDominantHand(): boolean {
    return this._isDominantHand
  }

  get objectTracking3D(): ObjectTracking3D {
    return this.objectTracking3DComponent
  }

  get targetingData(): TargetingData | null {
    return this._targetingData
  }

  isTracked(): boolean {
    return this.objectTracking3DComponent.isTracking()
  }

  isRecentlyFound(): boolean {
    return this.objectTracking3DRecentlyFound
  }

  getSceneObject(): SceneObject {
    return this.ownerSceneObject
  }

  setIsDominantHand(isDominantHand: boolean): void {
    this._isDominantHand = isDominantHand
  }

  isPinching(): boolean {
    return this.pinchDetector.isPinching()
  }

  isTapping(): PalmTapDetectionEvent {
    if (this.palmTapDetector === undefined) {
      return {
        state: "unsupported",
      }
    } else {
      return {
        state: "available",
        data: {isTapping: this.palmTapDetector.isTapping},
      }
    }
  }

  getPinchStrength(): number | null {
    if (!this.isTracked()) {
      return null
    }

    return this.pinchDetector.getPinchStrength()
  }

  /**
   * Sets the tracking mode for the hand.
   * @param trackingMode - The new mode.
   */
  setTrackingMode(trackingMode: ObjectTracking3D.TrackingMode): void {
    this.objectTracking3DComponent.trackingMode = trackingMode
  }

  public getHandVisuals(): HandVisuals | null {
    if (this.handVisuals && !this.handVisuals.initialized) {
      this.handVisuals.initialize()
    }

    return this.handVisuals ?? null
  }

  public attachHandVisuals(handVisuals: HandVisuals): void {
    this.handVisuals = handVisuals
  }

  public initHandVisuals(): void {
    if (!this.handVisuals) {
      throw new Error("initHandVisuals called before attachHandVisuals")
    }

    this.objectTracking3DComponent.trackingMode =
      ObjectTracking3D.TrackingMode.ProportionsAndPose

    validate(this.handVisuals.root)
    this.handVisuals.root.setParent(this.ownerSceneObject)

    // Wrist
    this.wrist.addAttachmentPoint(this.handVisuals.wrist)

    // Thumb
    this.thumbToWrist.addAttachmentPoint(this.handVisuals.thumbToWrist)
    this.thumbBaseJoint.addAttachmentPoint(this.handVisuals.thumbBaseJoint)
    this.thumbKnuckle.addAttachmentPoint(this.handVisuals.thumbKnuckle)
    this.thumbMidJoint.addAttachmentPoint(this.handVisuals.thumbMidJoint)
    this.thumbTip.addAttachmentPoint(this.handVisuals.thumbTip)

    // Index
    this.indexToWrist.addAttachmentPoint(this.handVisuals.indexToWrist)
    this.indexKnuckle.addAttachmentPoint(this.handVisuals.indexKnuckle)
    this.indexMidJoint.addAttachmentPoint(this.handVisuals.indexMidJoint)
    this.indexUpperJoint.addAttachmentPoint(this.handVisuals.indexUpperJoint)
    this.indexTip.addAttachmentPoint(this.handVisuals.indexTip)

    // Middle
    this.middleToWrist.addAttachmentPoint(this.handVisuals.middleToWrist)
    this.middleKnuckle.addAttachmentPoint(this.handVisuals.middleKnuckle)
    this.middleMidJoint.addAttachmentPoint(this.handVisuals.middleMidJoint)
    this.middleUpperJoint.addAttachmentPoint(this.handVisuals.middleUpperJoint)
    this.middleTip.addAttachmentPoint(this.handVisuals.middleTip)

    // Ring
    this.ringToWrist.addAttachmentPoint(this.handVisuals.ringToWrist)
    this.ringKnuckle.addAttachmentPoint(this.handVisuals.ringKnuckle)
    this.ringMidJoint.addAttachmentPoint(this.handVisuals.ringMidJoint)
    this.ringUpperJoint.addAttachmentPoint(this.handVisuals.ringUpperJoint)
    this.ringTip.addAttachmentPoint(this.handVisuals.ringTip)

    // Pinky
    this.pinkyToWrist.addAttachmentPoint(this.handVisuals.pinkyToWrist)
    this.pinkyKnuckle.addAttachmentPoint(this.handVisuals.pinkyKnuckle)
    this.pinkyMidJoint.addAttachmentPoint(this.handVisuals.pinkyMidJoint)
    this.pinkyUpperJoint.addAttachmentPoint(this.handVisuals.pinkyUpperJoint)
    this.pinkyTip.addAttachmentPoint(this.handVisuals.pinkyTip)
  }

  detachHandVisuals(handVisuals: HandVisuals): void {
    if (this.handVisuals !== handVisuals) {
      return
    }

    this.objectTracking3DComponent.trackingMode =
      ObjectTracking3D.TrackingMode.Attachment
    this.keypoints.forEach((keypoint) => keypoint.clearAttachmentPoint())
    this.handVisuals = undefined
  }

  /**
   * Destroys the hand and associated keypoints
   */
  destroy(): void {
    if (this.isDestroyed) {
      return
    }

    this.ownerSceneObject.destroy()
    this.isDestroyed = true
  }

  private attachJoints(children: JointNode[]) {
    for (const joint of children) {
      this.keypoints.set(
        joint.name,
        new Keypoint(joint.name, this.objectTracking3DComponent)
      )
      this.attachJoints(joint.children)
    }
  }

  private getKeypoint(landmarkName: LandmarkName): Keypoint {
    const keypoint = this.keypoints.get(landmarkName as string)
    if (!keypoint) {
      throw new Error(`Keypoint ${landmarkName} is not supported.`)
    }

    return keypoint
  }

  private setKeypointCollections() {
    this.thumbFingerPoints.push(
      this.thumbToWrist,
      this.thumbBaseJoint,
      this.thumbKnuckle,
      this.thumbMidJoint,
      this.thumbTip
    )
    this.indexFingerPoints.push(
      this.indexToWrist,
      this.indexKnuckle,
      this.indexMidJoint,
      this.indexUpperJoint,
      this.indexTip
    )
    this.middleFingerPoints.push(
      this.middleToWrist,
      this.middleKnuckle,
      this.middleMidJoint,
      this.middleUpperJoint,
      this.middleTip
    )
    this.ringFingerPoints.push(
      this.ringToWrist,
      this.ringKnuckle,
      this.ringMidJoint,
      this.ringUpperJoint,
      this.ringTip
    )
    this.pinkyFingerPoints.push(
      this.pinkyToWrist,
      this.pinkyKnuckle,
      this.pinkyMidJoint,
      this.pinkyUpperJoint,
      this.pinkyTip
    )
    this.allPoints.push(
      this.wrist,
      ...this.thumbFingerPoints,
      ...this.indexFingerPoints,
      ...this.middleFingerPoints,
      ...this.ringFingerPoints,
      ...this.pinkyFingerPoints
    )
  }

  private rayToWorld(
    rayOriginInCameraRootSpace: vec3,
    rayDirectionInCameraRootSpace: vec3
  ): [rayOriginWorld: vec3, rayDirectionWorld: vec3] {
    const cameraParent = this.cameraObject.getParent()

    if (!cameraParent) {
      return [rayOriginInCameraRootSpace, rayDirectionInCameraRootSpace]
    }
    const cameraRoot = cameraParent.getTransform().getWorldTransform()
    const rayEndPointCameraRootSpace = rayOriginInCameraRootSpace.add(
      rayDirectionInCameraRootSpace
    )
    const rayOriginInWorld = cameraRoot.multiplyPoint(
      rayOriginInCameraRootSpace
    )
    const rayEndInWorld = cameraRoot.multiplyPoint(rayEndPointCameraRootSpace)
    const rayDirectionInWorld = rayEndInWorld.sub(rayOriginInWorld)
    return [rayOriginInWorld, rayDirectionInWorld]
  }
}
