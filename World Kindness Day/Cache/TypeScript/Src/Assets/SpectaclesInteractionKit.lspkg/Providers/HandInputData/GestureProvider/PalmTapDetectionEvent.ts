/**
 * Describes the state of Palm Tap API
 */
export type PalmTapDetectionEvent =
  | {
      state: "unsupported"
    }
  | {
      state: "available"
      data: {isTapping: boolean}
    }
