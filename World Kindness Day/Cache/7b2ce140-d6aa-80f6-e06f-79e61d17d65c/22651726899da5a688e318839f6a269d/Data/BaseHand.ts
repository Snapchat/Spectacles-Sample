import {PublicApi} from "../../Utils/Event"
import {TargetingData} from "../TargetProvider/TargetingData"
import {PalmTapDetectionEvent} from "./GestureProvider/PalmTapDetectionEvent"
import {HandType} from "./HandType"
import {HandVisuals} from "./HandVisuals"
import {Keypoint} from "./Keypoint"

/**
 * Describes the API for the BaseHand, which is part of the API accessible by
 * external developers.
 */
export interface BaseHand {
  /**
   * Event called when the hand is found by the system
   */
  readonly onHandFound: PublicApi<void>

  /**
   * Event called when the hand is lost by the system
   */
  readonly onHandLost: PublicApi<void>

  /**
   * Event called when this hand gets enabled or disabled
   */
  readonly onEnabledChanged: PublicApi<boolean>

  /**
   * Event called when the user has successfully pinched down.
   */
  readonly onPinchDown: PublicApi<void>

  /**
   * Event called when the user has released pinching after they
   * have successfully pinched down.
   */
  readonly onPinchUp: PublicApi<void>

  /**
   * Event called when the user's pinch is canceled by the system.
   */
  readonly onPinchCancel: PublicApi<void>

  /**
   * Event called when the hand is holding a phone.
   */
  readonly onPhoneInHandBegin: PublicApi<void>

  /**
   * Event called when the hand is not holding a phone.
   */
  readonly onPhoneInHandEnd: PublicApi<void>

  /**
   * The Keypoint of the wrist joint
   */
  readonly wrist: Keypoint

  /**
   * The Keypoint of the thumbProximal joint, will be @deprecated soon in favor of thumbToWrist.
   */
  readonly thumbProximal: Keypoint

  /**
   * The Keypoint of the thumbToWrist joint (Wrist Joint)
   */
  readonly thumbToWrist: Keypoint

  /**
   * The Keypoint of the thumbIntermediate joint, will be @deprecated soon in favor of thumbBaseJoint.
   */
  readonly thumbIntermediate: Keypoint

  /**
   * The Keypoint of the thumbBaseJoint joint (Thumb Carpometacarpal (CMC) Joint)
   */
  readonly thumbBaseJoint: Keypoint

  /**
   * The Keypoint of the thumbDistal joint, will soon be @deprecated for thumbKnuckle
   */
  readonly thumbDistal: Keypoint

  /**
   * The Keypoint of the thumbKnuckle joint (Thumb Metacarpophalangeal (MCP) Joint)
   */
  readonly thumbKnuckle: Keypoint

  /**
   * The Keypoint of the thumbPad joint, will soon be @deprecated for thumbMidJoint
   */
  readonly thumbPad: Keypoint

  /**
   * The Keypoint of the thumbMidJoint joint (Thumb Interphalangeal (IP) Joint)
   */
  readonly thumbMidJoint: Keypoint

  /**
   * The Keypoint of the thumbTip joint (Thumb Tip Joint)
   */
  readonly thumbTip: Keypoint

  /**
   * The Keypoint of the indexProximal joint, will be @deprecated soon in favor of indexToWrist.
   */
  readonly indexProximal: Keypoint

  /**
   * The Keypoint of the indexToWrist joint (Wrist Joint)
   */
  readonly indexToWrist: Keypoint

  /**
   * The Keypoint of the indexIntermediate joint, will be @deprecated soon in favor of indexKnuckle.
   */
  readonly indexIntermediate: Keypoint

  /**
   * The Keypoint of the indexKnuckle joint (Index Metacarpophalangeal (MCP) Joint)
   */
  readonly indexKnuckle: Keypoint

  /**
   * The Keypoint of the indexDistal joint, will soon be @deprecated for indexMidJoint
   */
  readonly indexDistal: Keypoint

  /**
   * The Keypoint of the indexMidJoint joint (Index Proximal Interphalangeal (PIP) Joint)
   */
  readonly indexMidJoint: Keypoint

  /**
   * The Keypoint of the indexPad joint, will soon be @deprecated for indexUpperJoint
   */
  readonly indexPad: Keypoint

  /**
   * The Keypoint of the indexUpperJoint joint (Index Distal Interphalangeal (DIP) Joint)
   */
  readonly indexUpperJoint: Keypoint

  /**
   * The Keypoint of the indexTip joint (Index Tip Joint)
   */
  readonly indexTip: Keypoint

  /**
   * The Keypoint of the middleProximal joint, will be @deprecated soon in favor of middleToWrist.
   */
  readonly middleProximal: Keypoint

  /**
   * The Keypoint of the middleToWrist joint (Wrist Joint)
   */
  readonly middleToWrist: Keypoint

  /**
   * The Keypoint of the middleIntermediate joint, will be @deprecated soon in favor of middleKnuckle.
   */
  readonly middleIntermediate: Keypoint

  /**
   * The Keypoint of the middleKnuckle joint (Middle Metacarpophalangeal (MCP) Joint)
   */
  readonly middleKnuckle: Keypoint

  /**
   * The Keypoint of the middleDistal joint, will soon be @deprecated for middleMidJoint
   */
  readonly middleDistal: Keypoint

  /**
   * The Keypoint of the middleMidJoint joint (Middle Proximal Interphalangeal (PIP) Joint)
   */
  readonly middleMidJoint: Keypoint

  /**
   * The Keypoint of the middlePad joint, will soon be @deprecated for middleUpperJoint
   */
  readonly middlePad: Keypoint

  /**
   * The Keypoint of the middleUpperJoint joint (Middle Distal Interphalangeal (DIP) Joint)
   */
  readonly middleUpperJoint: Keypoint

  /**
   * The Keypoint of the middleTip joint (Middle Tip Joint)
   */
  readonly middleTip: Keypoint

  /**
   * The Keypoint of the ringProximal joint, will be @deprecated soon in favor of ringToWrist.
   */
  readonly ringProximal: Keypoint

  /**
   * The Keypoint of the ringToWrist joint (Wrist Joint)
   */
  readonly ringToWrist: Keypoint

  /**
   * The Keypoint of the ringIntermediate joint, will be @deprecated soon in favor of ringKnuckle.
   */
  readonly ringIntermediate: Keypoint

  /**
   * The Keypoint of the ringKnuckle joint (Ring Metacarpophalangeal (MCP) Joint)
   */
  readonly ringKnuckle: Keypoint

  /**
   * The Keypoint of the ringDistal joint, will soon be @deprecated for ringMidJoint
   */
  readonly ringDistal: Keypoint

  /**
   * The Keypoint of the ringMidJoint joint (Ring Proximal Interphalangeal (PIP) Joint)
   */
  readonly ringMidJoint: Keypoint

  /**
   * The Keypoint of the ringPad joint, will soon be @deprecated for ringUpperJoint
   */
  readonly ringPad: Keypoint

  /**
   * The Keypoint of the ringUpperJoint joint (Ring Distal Interphalangeal (DIP) Joint)
   */
  readonly ringUpperJoint: Keypoint

  /**
   * The Keypoint of the ringTip joint (Ring Tip Joint)
   */
  readonly ringTip: Keypoint

  /**
   * The Keypoint of the pinkyProximal joint, will be @deprecated soon in favor of pinkyToWrist.
   */
  readonly pinkyProximal: Keypoint

  /**
   * The Keypoint of the pinkyToWrist joint (Wrist Joint)
   */
  readonly pinkyToWrist: Keypoint

  /**
   * The Keypoint of the pinkyIntermediate joint, will be @deprecated soon in favor of pinkyKnuckle.
   */
  readonly pinkyIntermediate: Keypoint

  /**
   * The Keypoint of the pinkyKnuckle joint (Pinky Metacarpophalangeal (MCP) Joint)
   */
  readonly pinkyKnuckle: Keypoint

  /**
   * The Keypoint of the pinkyDistal joint, will soon be @deprecated for pinkyMidJoint
   */
  readonly pinkyDistal: Keypoint

  /**
   * The Keypoint of the pinkyMidJoint joint (Pinky Proximal Interphalangeal (PIP) Joint)
   */
  readonly pinkyMidJoint: Keypoint

  /**
   * The Keypoint of the pinkyPad joint, will soon be @deprecated for pinkyUpperJoint
   */
  readonly pinkyPad: Keypoint

  /**
   * The Keypoint of the pinkyUpperJoint joint (Pinky Distal Interphalangeal (DIP) Joint)
   */
  readonly pinkyUpperJoint: Keypoint

  /**
   * The Keypoint of the pinkyTip joint (Pinky Tip Joint)
   */
  readonly pinkyTip: Keypoint

  /**
   * The Keypoints of the Thumb finger
   */
  readonly thumbFinger: Keypoint[]

  /**
   * The Keypoints of the Index finger
   */
  readonly indexFinger: Keypoint[]

  /**
   * The Keypoints of the Middle finger
   */
  readonly middleFinger: Keypoint[]

  /**
   * The Keypoints of the Ring finger
   */
  readonly ringFinger: Keypoint[]

  /**
   * The Keypoints of the Pinky finger
   */
  readonly pinkyFinger: Keypoint[]

  /**
   * The Keypoints of the entire Hand
   */
  readonly points: Keypoint[]

  /**
   * Returns the enabled state of the hand.
   */
  readonly enabled: boolean

  /**
   * Returns true if the hand is the dominant hand assigned by the system
   */
  readonly isDominantHand: boolean

  /**
   * Determines if the hand is the left or right hand
   */
  readonly handType: HandType

  /**
   * {@link ObjectTracking3D} associated with this base hand
   */
  readonly objectTracking3D: ObjectTracking3D

  /**
   * Returns the normalized direction and origin point of the targeting ray in world coordinate system
   * It can return null if the data has not been received from LensCore's GestureModule API.
   */
  readonly targetingData: TargetingData | null

  /**
   * Sets the enabled state of the hand.
   * Events will not be called if isEnabled is set to false.
   */
  setEnabled(isEnabled: boolean): void

  /**
   * Determines if the system is able to track
   * the BaseHand
   */
  isTracked(): boolean

  /**
   * Sets isDominantHand. This is used from HandInputData
   * based on Lens Tweak value, and shouldn't be accessible
   * by external developers.
   *
   * @param {Boolean} isDominantHand - describes if this hand is the dominant one or not
   */
  setIsDominantHand(isDominantHand: boolean): void

  /**
   * Determines if the hand's palm is facing the user
   */
  isFacingCamera(): boolean

  /**
   * Determines if the hand is aiming towards objects in the scene
   */
  isInTargetingPose(): boolean

  /**
   * Determines if the user is pinching
   */
  isPinching(): boolean

  /**
   * @returns whether the user is tapping their hand
   */
  isTapping(): PalmTapDetectionEvent

  /**
   * Returns owner scene object associated with the hand
   */
  getSceneObject(): SceneObject

  /**
   * Returns a normalized value from 0-1, where 0 is the distance
   * from a finger tip to the thumb tip in resting/neutral hand pose.
   * 1 is when a finger tip to thumb tip are touching/pinching.
   * Returns null if the hand is not tracked
   */
  getPinchStrength(): number | null

  /**
   * Returns a direction quaternion based on a plane derived
   * from a forward direction (between your thumb knuckle to thumb tip)
   * and a right direction (between your thumb knuckle to index knuckle)
   */
  getPinchDirection(): quat | null

  /**
   * Returns the roll rotation of the hand in degrees.
   * This is the result of the dot product from a right vector,
   * created by the index and middle knuckle, and the camera's right vector
   * to determine if the palm if facing the user.
   *
   * A value less than 30 is facing towards the user.
   * A value greater than 30 is facing away from the user.
   *
   * Returns null if the hand is not being tracked.
   */
  getFacingCameraAngle(): number | null

  /**
   * Returns the pitch rotation of the hand in degrees.
   * This is the result of the dot product from a forward vector,
   * created by the middle knuckle and wrist, and the camera's forward vector.
   *
   * A value greater than 0 is pointing up.
   * A value less than 0 is pointing down.
   *
   * Returns null if the hand is not being tracked.
   */
  getPalmPitchAngle(): number | null

  /**
   * Approximates the center of the palm, as we currently do not have a center palm landmark.
   * Used to determine whether hands are overlapping
   * @returns the calculated center or null if any of the landmarks don't exist
   */
  getPalmCenter(): vec3 | null

  /**
   * @returns attached {@link HandVisuals} or null if none is attached.
   */
  getHandVisuals(): HandVisuals | null

  /**
   * Attaches {@link HandVisuals} to the tracked hand
   */
  attachHandVisuals(handVisuals: HandVisuals): void

  /**
   * Detaches {@link HandVisuals} to the tracked hand
   */
  detachHandVisuals(handVisuals: HandVisuals): void
}
