/**
 * A handy list of Landmark Names
 */
export enum LandmarkName {
  INDEX_0 = "index-0",
  INDEX_1 = "index-1",
  INDEX_2 = "index-2",
  INDEX_3 = "index-3",

  MIDDLE_0 = "mid-0",
  MIDDLE_1 = "mid-1",
  MIDDLE_2 = "mid-2",
  MIDDLE_3 = "mid-3",

  RING_0 = "ring-0",
  RING_1 = "ring-1",
  RING_2 = "ring-2",
  RING_3 = "ring-3",

  PINKY_0 = "pinky-0",
  PINKY_1 = "pinky-1",
  PINKY_2 = "pinky-2",
  PINKY_3 = "pinky-3",

  THUMB_0 = "thumb-0",
  THUMB_1 = "thumb-1",
  THUMB_2 = "thumb-2",
  THUMB_3 = "thumb-3",

  WRIST = "wrist",

  WRIST_TO_THUMB = "wrist_to_thumb",
  WRIST_TO_INDEX = "wrist_to_index",
  WRIST_TO_MIDDLE = "wrist_to_mid",
  WRIST_TO_RING = "wrist_to_ring",
  WRIST_TO_PINKY = "wrist_to_pinky"
}

export const INDEX_BASE = LandmarkName.INDEX_0
export const INDEX_TIP = LandmarkName.INDEX_3

export const MIDDLE_BASE = LandmarkName.MIDDLE_0
export const MIDDLE_TIP = LandmarkName.MIDDLE_3

export const RING_BASE = LandmarkName.RING_0
export const RING_TIP = LandmarkName.RING_3

export const PINKY_BASE = LandmarkName.PINKY_0
export const PINKY_TIP = LandmarkName.PINKY_3

export const THUMB_BASE = LandmarkName.THUMB_0
export const THUMB_TIP = LandmarkName.THUMB_3

export const wristLandmarks = [
  LandmarkName.WRIST,
  LandmarkName.WRIST_TO_INDEX,
  LandmarkName.WRIST_TO_MIDDLE,
  LandmarkName.WRIST_TO_PINKY,
  LandmarkName.WRIST_TO_RING,
  LandmarkName.WRIST_TO_THUMB
]
export const thumbLandmarks = [LandmarkName.THUMB_3, LandmarkName.THUMB_2, LandmarkName.THUMB_1, LandmarkName.THUMB_0]
export const indexLandmarks = [LandmarkName.INDEX_3, LandmarkName.INDEX_2, LandmarkName.INDEX_1, LandmarkName.INDEX_0]
export const midLandmarks = [LandmarkName.MIDDLE_3, LandmarkName.MIDDLE_2, LandmarkName.MIDDLE_1, LandmarkName.MIDDLE_0]
export const ringLandmarks = [LandmarkName.RING_3, LandmarkName.RING_2, LandmarkName.RING_1, LandmarkName.RING_0]
export const pinkyLandmarks = [LandmarkName.PINKY_3, LandmarkName.PINKY_2, LandmarkName.PINKY_1, LandmarkName.PINKY_0]
export const allLandmarks = [thumbLandmarks, indexLandmarks, midLandmarks, ringLandmarks, pinkyLandmarks]

export const stubLandmarks = [
  LandmarkName.INDEX_0,
  LandmarkName.MIDDLE_0,
  LandmarkName.RING_0,
  LandmarkName.PINKY_0,
  LandmarkName.THUMB_0,
  LandmarkName.WRIST
]

export enum Fingers {
  INDEX = "INDEX",
  THUMB = "THUMB",
  MIDDLE = "MIDDLE",
  PINKY = "PINKY",
  RING = "RING"
}

export enum Hands {
  RIGHT = "RIGHT",
  LEFT = "LEFT"
}

export const mapLandmarkToFinger: any = {}

mapLandmarkToFinger[LandmarkName.THUMB_0] = Fingers.THUMB
mapLandmarkToFinger[LandmarkName.THUMB_1] = Fingers.THUMB
mapLandmarkToFinger[LandmarkName.THUMB_2] = Fingers.THUMB
mapLandmarkToFinger[LandmarkName.THUMB_3] = Fingers.THUMB

mapLandmarkToFinger[LandmarkName.INDEX_0] = Fingers.INDEX
mapLandmarkToFinger[LandmarkName.INDEX_1] = Fingers.INDEX
mapLandmarkToFinger[LandmarkName.INDEX_2] = Fingers.INDEX
mapLandmarkToFinger[LandmarkName.INDEX_3] = Fingers.INDEX

mapLandmarkToFinger[LandmarkName.MIDDLE_0] = Fingers.MIDDLE
mapLandmarkToFinger[LandmarkName.MIDDLE_1] = Fingers.MIDDLE
mapLandmarkToFinger[LandmarkName.MIDDLE_2] = Fingers.MIDDLE
mapLandmarkToFinger[LandmarkName.MIDDLE_3] = Fingers.MIDDLE

mapLandmarkToFinger[LandmarkName.RING_0] = Fingers.RING
mapLandmarkToFinger[LandmarkName.RING_1] = Fingers.RING
mapLandmarkToFinger[LandmarkName.RING_2] = Fingers.RING
mapLandmarkToFinger[LandmarkName.RING_3] = Fingers.RING

mapLandmarkToFinger[LandmarkName.PINKY_0] = Fingers.PINKY
mapLandmarkToFinger[LandmarkName.PINKY_1] = Fingers.PINKY
mapLandmarkToFinger[LandmarkName.PINKY_2] = Fingers.PINKY
mapLandmarkToFinger[LandmarkName.PINKY_3] = Fingers.PINKY
