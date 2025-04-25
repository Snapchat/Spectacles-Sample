import Event, {PublicApi} from "../../../../../Utils/Event"
import NativeLogger from "../../../../../Utils/NativeLogger"
import GestureModuleProvider from "../../../GestureProvider/GestureModuleProvider"
import {HandType} from "../../../HandType"
import {PinchEventType} from "../../PinchEventType"
import {PinchDetectionStrategy} from "./PinchDetectionStrategy"

const TAG = "HciPinchDetection"

export type HciPinchDetectionStrategyConfig = {
  handType: HandType
}

/**
 * Class to detect pinch by calling into HCI Gesture APIs at lenscore level
 */
export default class HciPinchDetectionStrategy
  implements PinchDetectionStrategy
{
  // Native Logging
  private log = new NativeLogger(TAG)

  private gestureModuleProvider: GestureModuleProvider =
    GestureModuleProvider.getInstance()

  private gestureModule: GestureModule | undefined = undefined
  private _onPinchDetectedEvent = new Event<PinchEventType>()
  private _onPinchDetected = this._onPinchDetectedEvent.publicApi()

  private _onPinchProximityEvent = new Event<number>()
  private _onPinchProximity = this._onPinchProximityEvent.publicApi()

  constructor(private config: HciPinchDetectionStrategyConfig) {
    this.setupPinchApi()
  }

  /** @inheritdoc */
  get onPinchDetected(): PublicApi<PinchEventType> {
    return this._onPinchDetected
  }

  /** @inheritdoc */
  get onPinchProximity(): PublicApi<number> {
    return this._onPinchProximity
  }

  private get gestureHandType(): GestureModule.HandType {
    return this.config.handType === "right"
      ? GestureModule.HandType.Right
      : GestureModule.HandType.Left
  }

  private setupPinchApi() {
    this.gestureModule = this.gestureModuleProvider.getModule()
    if (this.gestureModule !== undefined) {
      this.gestureModule.getPinchDownEvent(this.gestureHandType).add(() => {
        this._onPinchDetectedEvent.invoke(PinchEventType.Down)
      })

      this.gestureModule.getPinchUpEvent(this.gestureHandType).add(() => {
        this._onPinchDetectedEvent.invoke(PinchEventType.Up)
      })

      if (this.gestureModule.getPinchStrengthEvent !== undefined) {
        this.gestureModule
          .getPinchStrengthEvent(this.gestureHandType)
          .add((args: PinchStrengthArgs) => {
            const proximity = args.strength
            this._onPinchProximityEvent.invoke(proximity)
            this.log.v(
              "PinchEvent : " +
                "Pinch Strength Event" +
                " : proximity : " +
                proximity
            )
          })
      }
    }
  }
}
