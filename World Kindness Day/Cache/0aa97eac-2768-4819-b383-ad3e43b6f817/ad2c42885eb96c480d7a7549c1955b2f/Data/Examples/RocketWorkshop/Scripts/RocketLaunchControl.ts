import {Interactable} from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable"
import {Slider} from "SpectaclesInteractionKit.lspkg/Components/UI/Slider/Slider"
import {ToggleButton} from "SpectaclesInteractionKit.lspkg/Components/UI/ToggleButton/ToggleButton"
import NativeLogger from "SpectaclesInteractionKit.lspkg/Utils/NativeLogger"
import {SyncKitBridge} from "SpectaclesInteractionKit.lspkg/Utils/SyncKitBridge"
import {validate} from "SpectaclesInteractionKit.lspkg/Utils/validate"
import {RocketConfigurator} from "./RocketConfigurator"

const TAG = "RocketLaunchControl"
const log = new NativeLogger(TAG)

const FLIGHT_END_EVENT_NAME = "flightEnded"

const ROCKET_LAUNCH_ANIMATION_VALUE_KEY = "RocketLaunchAnimationValue"

/**
 * This class manages the rocket launch control interface, including the launch button, animation buttons, and slider. It interacts with the RocketConfigurator to configure and launch the rocket.
 *
 */
@component
export class RocketLaunchControl extends BaseScriptComponent {
  @input
  slider!: Slider

  @input
  animationAButton!: SceneObject
  @input
  animationBButton!: SceneObject
  @input
  animationCButton!: SceneObject

  @input
  launchButton!: SceneObject

  @input
  rocketConf!: RocketConfigurator

  @input
  launchSparks!: SceneObject

  @input
  rocketAnimationPlayer!: AnimationPlayer

  @input
  rocketAudioComponent!: AudioComponent

  @input
  rocketLaunchSFX!: AudioTrackAsset

  @input
  rocketLandSFX!: AudioTrackAsset

  @input
  flightPathText!: Text

  @input
  launchPlatformToggleButton!: ToggleButton

  @input
  launchPlatform!: SceneObject

  private launchButton_interactable: Interactable | null = null
  private animationAButton_interactable: Interactable | null = null
  private animationBButton_interactable: Interactable | null = null
  private animationCButton_interactable: Interactable | null = null
  private currentLaunchAnimationName: string = "Base Layer Rocket 1"
  private flightEndEventRegistration: EventRegistration | null = null
  private launchButtonText: Text | undefined

  private currentClip: AnimationClip | undefined

  private engineStartedEvent: DelayedCallbackEvent | null = null
  private engineReadyEvent: DelayedCallbackEvent | null = null
  private rocketTakeOffEvent: DelayedCallbackEvent | null = null
  private takeOffCompleteEvent: DelayedCallbackEvent | null = null
  private landingStartedEvent: DelayedCallbackEvent | null = null
  private launchSparksDisableEvent: DelayedCallbackEvent | null = null

  // Only defined if SyncKit is present within the lens project.
  private syncKitBridge = SyncKitBridge.getInstance()
  private syncEntity = this.syncKitBridge.createSyncEntity(this)

  onAwake(): void {
    this.createEvent("OnStartEvent").bind(() => {
      this.onStart()
    })

    this.launchSparksDisableEvent = this.createEvent("DelayedCallbackEvent")
    this.launchSparksDisableEvent.bind(() => {
      this.launchSparks.enabled = false
    })

    const interactableTypeName = Interactable.getTypeName()

    this.launchButton_interactable = this.launchButton.getComponent(interactableTypeName)
    if (isNull(this.launchButton_interactable)) {
      log.f("Interactable component not found.")
    }
    this.animationAButton_interactable = this.animationAButton.getComponent(interactableTypeName)
    if (isNull(this.animationAButton_interactable)) {
      log.f("Interactable component not found.")
    }
    this.animationBButton_interactable = this.animationBButton.getComponent(interactableTypeName)
    if (isNull(this.animationBButton_interactable)) {
      log.f("Interactable component not found.")
    }
    this.animationCButton_interactable = this.animationCButton.getComponent(interactableTypeName)
    if (isNull(this.animationCButton_interactable)) {
      log.f("Interactable component not found.")
    }

    this.launchButtonText = this.launchButton.getChild(0).getComponent("Text")

    this.launchSparks.enabled = false

    this.engineStartedEvent = this.createEvent("DelayedCallbackEvent")
    this.engineStartedEvent.bind(() => {
      this.engineStarted()
    })
    this.engineReadyEvent = this.createEvent("DelayedCallbackEvent")
    this.engineReadyEvent.bind(() => {
      this.engineReady()
    })
    this.rocketTakeOffEvent = this.createEvent("DelayedCallbackEvent")
    this.rocketTakeOffEvent.bind(() => {
      this.rocketTakeOff()
    })
    this.takeOffCompleteEvent = this.createEvent("DelayedCallbackEvent")
    this.takeOffCompleteEvent.bind(() => {
      this.takeOffCompleted()
    })
    this.landingStartedEvent = this.createEvent("DelayedCallbackEvent")
    this.landingStartedEvent.bind(() => {
      this.landingStarted()
    })

    if (this.syncEntity !== null) {
      this.syncEntity.notifyOnReady(this.setupConnectionCallbacks.bind(this))
    }

    this.subscribeToCurrentLaunchAnimationEndEvent()
  }

  onStart() {
    this.setupLaunchButtonCallbacks()
    this.setupAnimationAButtonCallbacks()
    this.setupAnimationBButtonCallbacks()
    this.setupAnimationCButtonCallbacks()

    this.launchPlatformToggleButton.onStateChanged.add((isToggledOn: boolean) => {
      if (isToggledOn) {
        this.launchPlatform.enabled = true
      } else {
        this.launchPlatform.enabled = false
      }
    })
  }

  private setupConnectionCallbacks(): void {
    if (
      this.syncEntity.currentStore.getAllKeys().find((key: string) => {
        return key === ROCKET_LAUNCH_ANIMATION_VALUE_KEY
      })
    ) {
      this.currentLaunchAnimationName = this.syncEntity.currentStore.getString(ROCKET_LAUNCH_ANIMATION_VALUE_KEY)
      this.subscribeToCurrentLaunchAnimationEndEvent()
    } else {
      this.syncEntity.currentStore.putString(ROCKET_LAUNCH_ANIMATION_VALUE_KEY, this.currentLaunchAnimationName)
    }

    this.syncEntity.storeCallbacks.onStoreUpdated.add(this.processStoreUpdate.bind(this))
  }

  private processStoreUpdate(
    _session: MultiplayerSession,
    store: GeneralDataStore,
    key: string,
    info: ConnectedLensModule.RealtimeStoreUpdateInfo
  ) {
    const connectionId = info.updaterInfo.connectionId
    const updatedByLocal = connectionId === this.syncKitBridge.sessionController.getLocalConnectionId()

    if (updatedByLocal) {
      return
    }

    if (key === ROCKET_LAUNCH_ANIMATION_VALUE_KEY) {
      this.currentLaunchAnimationName = store.getString(ROCKET_LAUNCH_ANIMATION_VALUE_KEY)
      this.subscribeToCurrentLaunchAnimationEndEvent()
    }
  }

  private updateSyncStore() {
    if (this.syncEntity !== null && this.syncEntity.isSetupFinished) {
      this.syncEntity.currentStore.putString(ROCKET_LAUNCH_ANIMATION_VALUE_KEY, this.currentLaunchAnimationName)
    }
  }

  private setupLaunchButtonCallbacks = (): void => {
    validate(this.launchButton_interactable)
    this.launchButton_interactable.onTriggerEnd.add(this.onLaunchButton)
    this.launchButton_interactable.onSyncTriggerEnd.add(this.onLaunchButton)
  }

  private onLaunchButton = (): void => {
    validate(this.engineStartedEvent)
    validate(this.launchButton_interactable)
    validate(this.launchButtonText)

    this.engineStartedEvent.reset(0)
    this.launchButton_interactable.enabled = false
    this.launchButtonText.text = "Flight in Progress"
    this.launchButtonText.size = 40
  }

  private engineStarted(): void {
    this.rocketConf.getExhaustControl()
    validate(this.rocketConf.exhaustControl)
    validate(this.engineReadyEvent)

    this.rocketConf.exhaustControl.setEngineSmokesValue(1.1)
    this.rocketConf.exhaustControl.turnOnExhausts()
    this.rocketConf.exhaustControl.turnOnSmokes()

    this.rocketAudioComponent.audioTrack = this.rocketLaunchSFX
    this.rocketAudioComponent.play(1)

    this.engineReadyEvent.reset(0.5)
  }

  private engineReady(): void {
    validate(this.rocketConf.exhaustControl)
    validate(this.rocketTakeOffEvent)

    this.rocketConf.exhaustControl.engineReady()
    this.rocketConf.exhaustControl.setEngineSmokesValue(0.8)

    this.rocketTakeOffEvent.reset(0.5)
  }

  private rocketTakeOff(): void {
    validate(this.rocketConf.exhaustControl)
    this.rocketConf.exhaustControl.setEngineSmokesValue(0.0)

    this.rocketAnimationPlayer.playClipAt(this.currentLaunchAnimationName, 0.0)

    validate(this.slider)

    this.rocketAnimationPlayer.getClip(this.currentLaunchAnimationName).playbackSpeed = MathUtils.remap(
      this.slider.currentValue ?? 0,
      0.0,
      1.0,
      1.0,
      5.0
    )
    this.launchSparks.enabled = true

    validate(this.launchSparksDisableEvent)

    this.launchSparksDisableEvent.reset(0.5)

    this.currentClip = this.rocketAnimationPlayer.getClip(this.currentLaunchAnimationName)

    validate(this.currentClip)
    validate(this.landingStartedEvent)
    validate(this.takeOffCompleteEvent)

    this.landingStartedEvent.reset((this.currentClip.duration / this.currentClip.playbackSpeed) * 0.9)

    this.takeOffCompleteEvent.reset((this.currentClip.duration / this.currentClip.playbackSpeed) * 0.2)
  }

  private takeOffCompleted(): void {
    // The SIKLogLevelConfiguration Log Level Filter must be set to Info or higher to see this log message
    log.i("Take Off Completed!")
  }

  private landingStarted(): void {
    log.i("Landing Started!")
    validate(this.rocketConf.exhaustControl)
    this.rocketConf.exhaustControl.turnOffExhausts()

    this.rocketAudioComponent.audioTrack = this.rocketLandSFX
    this.rocketAudioComponent.play(1)
  }

  private setupAnimationAButtonCallbacks = (): void => {
    validate(this.animationAButton_interactable)
    this.animationAButton_interactable.onTriggerEnd.add(this.onAnimationAButton)
  }

  private onAnimationAButton = (): void => {
    this.currentLaunchAnimationName = "Base Layer Rocket 1"

    if (this.syncEntity !== null && this.syncEntity.isSetupFinished) {
      this.updateSyncStore()
    }

    this.subscribeToCurrentLaunchAnimationEndEvent()
  }

  private setupAnimationBButtonCallbacks = (): void => {
    validate(this.animationBButton_interactable)
    this.animationBButton_interactable.onTriggerEnd.add(this.onAnimationBButton)
  }

  private onAnimationBButton = (): void => {
    this.currentLaunchAnimationName = "Base Layer Rocket 2"

    if (this.syncEntity !== null && this.syncEntity.isSetupFinished) {
      this.updateSyncStore()
    }

    this.subscribeToCurrentLaunchAnimationEndEvent()
  }

  private setupAnimationCButtonCallbacks = (): void => {
    validate(this.animationCButton_interactable)
    this.animationCButton_interactable.onTriggerEnd.add(this.onAnimationCButton)
  }

  private onAnimationCButton = (): void => {
    this.currentLaunchAnimationName = "Base Layer Rocket 3"

    if (this.syncEntity !== null && this.syncEntity.isSetupFinished) {
      this.updateSyncStore()
    }

    this.subscribeToCurrentLaunchAnimationEndEvent()
  }

  private subscribeToCurrentLaunchAnimationEndEvent = (): void => {
    const currentAnimationClip = this.rocketAnimationPlayer.getClip(this.currentLaunchAnimationName)
    const flightEndTimestamp = currentAnimationClip.duration
    currentAnimationClip.animation.createEvent(FLIGHT_END_EVENT_NAME, flightEndTimestamp)

    this.flightEndEventRegistration = this.rocketAnimationPlayer.onEvent.add(this.onAnimationEnd.bind(this))

    if (this.currentLaunchAnimationName === "Base Layer Rocket 1") {
      this.flightPathText.text = "Flight Path : A"
    } else if (this.currentLaunchAnimationName === "Base Layer Rocket 2") {
      this.flightPathText.text = "Flight Path : B"
    } else if (this.currentLaunchAnimationName === "Base Layer Rocket 3") {
      this.flightPathText.text = "Flight Path : C"
    }
  }

  private onAnimationEnd = (eventData: AnimationPlayerOnEventArgs): void => {
    if (eventData.eventName === FLIGHT_END_EVENT_NAME) {
      validate(this.rocketConf.exhaustControl)
      validate(this.launchButton_interactable)
      validate(this.launchButtonText)
      this.rocketConf.exhaustControl.turnOffSmokes()
      this.launchButton_interactable.enabled = true
      this.launchButtonText.text = "Launch!"
      this.launchButtonText.size = 48
    }
  }
}
