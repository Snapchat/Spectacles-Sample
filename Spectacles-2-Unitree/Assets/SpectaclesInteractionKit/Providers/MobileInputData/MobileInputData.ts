import {
  OneEuroFilterConfig,
  OneEuroFilterQuat,
  OneEuroFilterVec3,
} from "../../Utils/OneEuroFilter"

import {AnimationManager} from "../../Utils/animate"
import Event from "../../Utils/Event"
import MotionControllerProvider from "../HandInputData/GestureProvider/MotionControllerProvider"
import NativeLogger from "../../Utils/NativeLogger"
import {Singleton} from "../../Decorators/Singleton"

const TAG = "MobileInputData"

const TRANSLATE_FILTER_CONFIG: OneEuroFilterConfig = {
  frequency: 60,
  minCutoff: 3.5,
  beta: 0.5,
  dcutoff: 1,
}
const ROTATION_FILTER_CONFIG: OneEuroFilterConfig = {
  frequency: 60,
  minCutoff: 1,
  beta: 2,
  dcutoff: 1,
}

/**
 * This singleton class manages mobile input data, including motion controller state, position, and rotation. It uses filters to smooth the input data and provides events for tracking quality changes.
 *
 */
@Singleton
export class MobileInputData {
  public static getInstance: () => MobileInputData

  private log = new NativeLogger(TAG)

  private _motionControllerModule: MotionControllerModule | undefined
  private _motionController: MotionController | undefined

  private animationManager: AnimationManager = AnimationManager.getInstance()
  private translateFilter = new OneEuroFilterVec3(TRANSLATE_FILTER_CONFIG)
  private rotationFilter = new OneEuroFilterQuat(ROTATION_FILTER_CONFIG)
  private _position = vec3.zero()
  private _rotation = quat.quatIdentity()

  private _trackingQuality: MotionController.TrackingQuality =
    MotionController.TrackingQuality?.Unknown
  private onTrackingQualityChangeEvent =
    new Event<MotionController.TrackingQuality>()

  /**
   * Public API to subscribe to controller state change events.
   *
   * @returns The public api
   */
  readonly onControllerStateChange: event1<boolean, void> | undefined

  /**
   * Public API to subscribe to tracking quality change events.
   *
   * @returns The public api
   */
  readonly onTrackingQualityChange =
    this.onTrackingQualityChangeEvent.publicApi()

  /** Enables filtering of position and rotation */
  filterPositionAndRotation: boolean = true

  constructor() {
    this.initializeMotionController()
    if (this._motionController === undefined) {
      return
    }

    this.onControllerStateChange =
      this._motionController?.onControllerStateChange

    this.onControllerStateChange?.add((state) => {
      this.log.d("Controller state changed to : " + state)
    })

    this.update(this.filterPositionAndRotation)
  }

  private initializeMotionController(): void {
    this._motionControllerModule =
      MotionControllerProvider.getInstance().getModule()

    if (this._motionControllerModule === undefined) {
      return
    }

    let options = MotionController.Options.create()
    options.motionType = MotionController.MotionType.SixDoF

    this._motionController = this._motionControllerModule.getController(
      options,
    ) as MotionController

    this._trackingQuality = this._motionController.getTrackingQuality()
  }

  private update(useFilter: boolean = true): void {
    if (
      this._motionControllerModule === undefined ||
      this._motionController === undefined
    ) {
      return
    }

    if (this._motionController?.isControllerAvailable()) {
      this._position = useFilter
        ? this.translateFilter.filter(
            this._motionController.getWorldPosition(),
            getTime(),
          )
        : this._motionController.getWorldPosition()

      this._rotation = useFilter
        ? this.rotationFilter.filter(
            this._motionController.getWorldRotation(),
            getTime(),
          )
        : this._motionController.getWorldRotation()
    }

    if (this._trackingQuality !== this._motionController.getTrackingQuality()) {
      this.onTrackingQualityChangeEvent.invoke(
        this._motionController.getTrackingQuality(),
      )
      this.log.v(
        "Motion Controller Tracking Quality has changed to : " +
          this._motionController.getTrackingQuality(),
      )
      this.translateFilter.reset()
      this.rotationFilter.reset()
    }

    this._trackingQuality = this._motionController.getTrackingQuality()

    this.animationManager.requestAnimationFrame(() =>
      this.update(this.filterPositionAndRotation),
    )
  }

  /**
   * @returns the current Motion Controller module instance.
   */
  get motionController(): MotionController | undefined {
    return this._motionController
  }

  /**
   * @returns the current position.
   */
  get position(): vec3 {
    return this._position
  }

  /**
   * @returns the current rotation.
   */
  get rotation(): quat {
    return this._rotation
  }

  /**
   * @returns the current tracking quality or undefined is the module is not
   * available.
   */
  get trackingQuality(): MotionController.TrackingQuality | undefined {
    if (this._motionController === undefined) {
      return undefined
    }

    return this._motionController.getTrackingQuality()
  }

  /**
   * @returns if the mobile input data provider is available,
   * which means that it is receiving data.
   */
  isAvailable(): boolean {
    if (this._motionController === undefined) {
      return false
    }

    return this._motionController.isControllerAvailable()
  }
}
