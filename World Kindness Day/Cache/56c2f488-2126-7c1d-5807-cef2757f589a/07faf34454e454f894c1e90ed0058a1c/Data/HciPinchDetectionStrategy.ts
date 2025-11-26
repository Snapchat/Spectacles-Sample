import Event, {PublicApi} from "../../../../../Utils/Event"
import NativeLogger from "../../../../../Utils/NativeLogger"
import GestureModuleProvider from "../../../GestureProvider/GestureModuleProvider"
import {HandType} from "../../../HandType"
import {PinchEventType} from "../../PinchEventType"
import {PinchEvent} from "../PinchDetector"
import {PinchDetectionStrategy} from "./PinchDetectionStrategy"

const TAG = "HciPinchDetection"

export type HciPinchDetectionStrategyConfig = {
  handType: HandType
}

/**
 * Class to detect pinch by calling into HCI Gesture APIs at lenscore level
 */
export default class HciPinchDetectionStrategy implements PinchDetectionStrategy {
  // Native Logging
  private log = new NativeLogger(TAG)

  private gestureModuleProvider: GestureModuleProvider = GestureModuleProvider.getInstance()

  private gestureModule: any | undefined = undefined
  private _onPinchDetectedEvent = new Event<PinchEvent>()
  private _onPinchDetected = this._onPinchDetectedEvent.publicApi()

  private _onPinchProximityEvent = new Event<number>()
  private _onPinchProximity = this._onPinchProximityEvent.publicApi()

  /**
   * For firmwares that do not have the filtered pinch events, ensure that Interactables see regular pinch events even
   * if they are subscribed to filtered pinch events.
   */
  private _isFilteredPinchAvailable = false

  constructor(private config: HciPinchDetectionStrategyConfig) {
    this.setupPinchApi()
  }

  /** @inheritdoc */
  get onPinchDetected(): PublicApi<PinchEvent> {
    return this._onPinchDetected
  }

  /** @inheritdoc */
  get onPinchProximity(): PublicApi<number> {
    return this._onPinchProximity
  }

  /**
   * Return if fitlered pinch events are available from the GestureModule.
   */
  get isFilteredPinchAvailable(): boolean {
    return this._isFilteredPinchAvailable
  }

  private get gestureHandType(): GestureModule.HandType {
    return this.config.handType === "right" ? GestureModule.HandType.Right : GestureModule.HandType.Left
  }

  private setupPinchApi() {
    this.gestureModule = this.gestureModuleProvider.getModule()
    if (this.gestureModule !== undefined) {
      this._isFilteredPinchAvailable =
        this.gestureModule.getFilteredPinchDownEvent !== undefined &&
        this.gestureModule.getFilteredPinchUpEvent !== undefined

      this.gestureModule.getPinchDownEvent(this.gestureHandType).add(() => {
        this.log.i(`GestureModule PinchDownEvent: { hand type: ${this.gestureHandType === 0 ? "Left" : "Right"} }`)
        this._onPinchDetectedEvent.invoke({
          eventType: PinchEventType.Down,
          isFiltered: false
        })
      })

      this.gestureModule.getPinchUpEvent(this.gestureHandType).add(() => {
        this.log.i(`GestureModule PinchUpEvent: { hand type: ${this.gestureHandType === 0 ? "Left" : "Right"} }`)
        this._onPinchDetectedEvent.invoke({
          eventType: PinchEventType.Up,
          isFiltered: false
        })
      })

      if (this.isFilteredPinchAvailable)
        this.gestureModule.getFilteredPinchDownEvent(this.gestureHandType).add(() => {
          this.log.i(
            `GestureModule FilteredPinchDownEvent: { hand type: ${this.gestureHandType === 0 ? "Left" : "Right"} }`
          )
          this._onPinchDetectedEvent.invoke({
            eventType: PinchEventType.Down,
            isFiltered: true
          })
        })

      if (this.isFilteredPinchAvailable)
        this.gestureModule.getFilteredPinchUpEvent(this.gestureHandType).add(() => {
          this.log.i(
            `GestureModule FilteredPinchUpEvent: { hand type: ${this.gestureHandType === 0 ? "Left" : "Right"} }`
          )
          this._onPinchDetectedEvent.invoke({
            eventType: PinchEventType.Up,
            isFiltered: true
          })
        })

      if (this.gestureModule.getPinchStrengthEvent !== undefined) {
        this.gestureModule.getPinchStrengthEvent(this.gestureHandType).add((args: PinchStrengthArgs) => {
          const proximity = args.strength
          this._onPinchProximityEvent.invoke(proximity)
        })
      }
    }
  }
}
