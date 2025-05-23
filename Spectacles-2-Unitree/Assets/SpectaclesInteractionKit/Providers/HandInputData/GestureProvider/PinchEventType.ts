import {HandType} from "../HandType"

/**
 * Describes a pinch event. The finger is optional as on an exit event we don't care about the finger.
 */
export type PinchEvent = {
  type: "enter" | "exit"
  hand: HandType
}

export enum PinchEventType {
  Down = "Down",
  Up = "Up",
  Cancel = "Cancel",
}
