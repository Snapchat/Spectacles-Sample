import TrackedHand from "SpectaclesInteractionKit.lspkg/Providers/HandInputData/TrackedHand"
import {SIK} from "SpectaclesInteractionKit.lspkg/SIK"
import {SessionController} from "SpectaclesSyncKit.lspkg/Core/SessionController"
import {RealtimeStoreKeys} from "../SyncControls/RealtimeStoreKeys"
import {HandSynchronizationInput} from "./HandSynchronizationInput"

// It tracks the right hand's movements, updates the box's position accordingly within the scene,
// and handles events triggered by changes in hand positioning.
export class HandSynchronization {
  // Array to store callbacks that handle hand position changes
  private readonly onUserChangedHandPosition: ((value: RealtimeStoreKeys.HAND_LOCAL_POSITION_DATA) => void)[] = []

  // Reference to the right tracked hand
  private readonly rightHand: TrackedHand

  // The box object in the scene that follows the right hand
  private readonly box: SceneObject

  private readonly boxTransform: Transform

  // Flag to track if the hand was active on the previous frame
  private wasActive: boolean = false

  // Stores the last updated hand position data
  private _lastUpdatedData: RealtimeStoreKeys.HAND_LOCAL_POSITION_DATA

  constructor(private readonly input: HandSynchronizationInput) {
    // Initialize the right hand using SIK framework
    this.rightHand = SIK.HandInputData.getHand("right")

    // Create a copy of the box hierarchy for manipulation
    this.box = this.input.box.getParent().copyWholeHierarchy(this.input.box)

    // Store the box's transform component for position manipulation
    this.boxTransform = this.box.getTransform()

    // Initially disable the box as the hand is not yet active
    this.box.enabled = false
  }

  // Starts the synchronization by initializing data and binding update events
  start() {
    this._lastUpdatedData = this.defaultData()
    this.putBoxOnHand()
  }

  // Allows external subscriptions to hand position changes
  subscribeOnChanges(onUserChangedValue: (value: RealtimeStoreKeys.HAND_LOCAL_POSITION_DATA) => void) {
    this.onUserChangedHandPosition.push(onUserChangedValue)
  }

  // Getter for the last updated hand position data
  get lastUpdatedData(): RealtimeStoreKeys.HAND_LOCAL_POSITION_DATA {
    return this._lastUpdatedData
  }

  // Binds an event to update the box's position, aligning it with the center of the hand
  private putBoxOnHand() {
    const updateEvent = this.input.createEvent("UpdateEvent")
    updateEvent.bind(() => {
      if (!this.rightHand.isTracked()) {
        this.box.enabled = false
        if (this.wasActive) {
          this.wasActive = false
          this.updateHandPositionData(vec3.zero())
        }
        return
      }
      this.wasActive = true
      this.box.enabled = true
      const pos = this.rightHand.getPalmCenter()
      this.boxTransform.setWorldPosition(pos)
      this.updateHandDataWithDelay()
    })
  }

  // Initializes and returns default hand position data
  private defaultData(): RealtimeStoreKeys.HAND_LOCAL_POSITION_DATA {
    const data: RealtimeStoreKeys.HAND_LOCAL_POSITION_DATA = {
      connectionID: SessionController.getInstance().getLocalUserInfo().connectionId,
      isActive: false,
      x: 0,
      y: 0,
      z: 0
    }
    return data
  }

  // Delays the update of hand position data to prevent rapid changes
  private updateHandDataWithDelay() {
    const delay = this.input.createEvent("DelayedCallbackEvent")
    delay.bind(() => {
      this.updateHandPositionData(this.boxTransform.getLocalPosition())
    })
    delay.reset(0.05)
  }

  // Updates the hand position data and notifies subscribed callbacks
  private updateHandPositionData(pos: vec3) {
    const data: RealtimeStoreKeys.HAND_LOCAL_POSITION_DATA = {
      connectionID: SessionController.getInstance().getLocalUserInfo().connectionId,
      isActive: this.wasActive,
      x: pos.x,
      y: pos.y,
      z: pos.z
    }
    this._lastUpdatedData = data
    this.onUserChangedHandPosition.forEach((value) => value(data))
  }
}
