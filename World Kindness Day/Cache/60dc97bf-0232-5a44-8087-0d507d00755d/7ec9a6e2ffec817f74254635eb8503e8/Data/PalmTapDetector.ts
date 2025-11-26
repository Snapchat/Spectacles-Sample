import NativeLogger from "../../../../Utils/NativeLogger"
import GestureModuleProvider from "../../GestureProvider/GestureModuleProvider"
import {PalmTapEventType} from "../PalmTapEvent"
import PalmTapDetectorStateMachine from "./PalmTapDetectorStateMachine"

const TAG = "PalmTapDetector"
/**
 * Handles PalmTap API events with StateMachine
 */
export default class PalmTapDetector {
  private gestureModule: GestureModule = (() => {
    const gestureModuleProvider: GestureModuleProvider = GestureModuleProvider.getInstance()
    const gestureModule = gestureModuleProvider.getModule()
    if (gestureModule === undefined) {
      throw new Error("GestureModule is undefined in PalmTapDetector")
    }
    return gestureModule
  })()

  private palmTapDetectorStateMachine: PalmTapDetectorStateMachine = new PalmTapDetectorStateMachine()

  private log = new NativeLogger(TAG)

  constructor(gestureHandType: GestureModule.HandType) {
    this.setupPalmTapApi(gestureHandType)
  }

  /**
   * returns  true if the user is currently tapping
   */
  get isTapping(): boolean {
    return this.palmTapDetectorStateMachine.isTapping()
  }

  private setupPalmTapApi(gestureHandType: GestureModule.HandType) {
    this.log.d("Setting up palm tap api")

    try {
      this.gestureModule.getPalmTapDownEvent(gestureHandType).add(() => {
        this.log.i(`GestureModule PalmTapDownEvent: { hand type: ${gestureHandType === 0 ? "Left" : "Right"} }`)
        this.palmTapDetectorStateMachine.notifyPalmTapEvent(PalmTapEventType.Down)
      })
      this.gestureModule.getPalmTapUpEvent(gestureHandType).add(() => {
        this.log.i(`GestureModule PalmTapUpEvent: { hand type: ${gestureHandType === 0 ? "Left" : "Right"} }`)
        this.palmTapDetectorStateMachine.notifyPalmTapEvent(PalmTapEventType.Up)
      })
    } catch (error) {
      throw new Error(`Error setting up palmTap subscriptions ${error}`)
    }
  }
}
