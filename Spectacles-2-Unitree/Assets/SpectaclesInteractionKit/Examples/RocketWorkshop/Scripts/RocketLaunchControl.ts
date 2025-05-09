import {Interactable} from "../../../Components/Interaction/Interactable/Interactable"
import {RocketConfigurator} from "./RocketConfigurator"
import {Slider} from "../../../Components/UI/Slider/Slider"
import {ToggleButton} from "../../../Components/UI/ToggleButton/ToggleButton"
import {validate} from "../../../Utils/validate"

const FLIGHT_END_EVENT_NAME = "flightEnded"

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

  onAwake(): void {
    this.createEvent("OnStartEvent").bind(() => {
      this.onStart()
    })

    this.launchSparksDisableEvent = this.createEvent("DelayedCallbackEvent")
    this.launchSparksDisableEvent.bind(() => {
      this.launchSparks.enabled = false
    })

    const interactableTypeName = Interactable.getTypeName()

    this.launchButton_interactable =
      this.launchButton.getComponent(interactableTypeName)
    if (isNull(this.launchButton_interactable)) {
      throw new Error("Interactable component not found.")
    }
    this.animationAButton_interactable =
      this.animationAButton.getComponent(interactableTypeName)
    if (isNull(this.animationAButton_interactable)) {
      throw new Error("Interactable component not found.")
    }
    this.animationBButton_interactable =
      this.animationBButton.getComponent(interactableTypeName)
    if (isNull(this.animationBButton_interactable)) {
      throw new Error("Interactable component not found.")
    }
    this.animationCButton_interactable =
      this.animationCButton.getComponent(interactableTypeName)
    if (isNull(this.animationCButton_interactable)) {
      throw new Error("Interactable component not found.")
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

    this.subscribeToCurrentLaunchAnimationEndEvent()
  }

  onStart() {
    this.setupLaunchButtonCallbacks()
    this.setupAnimationAButtonCallbacks()
    this.setupAnimationBButtonCallbacks()
    this.setupAnimationCButtonCallbacks()

    this.launchPlatformToggleButton.onStateChanged.add(
      (isToggledOn: boolean) => {
        if (isToggledOn) {
          this.launchPlatform.enabled = true
        } else {
          this.launchPlatform.enabled = false
        }
      },
    )
  }

  private setupLaunchButtonCallbacks = (): void => {
    validate(this.launchButton_interactable)
    this.launchButton_interactable.onTriggerEnd.add(this.onLaunchButton)
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

    this.rocketAnimationPlayer.getClip(
      this.currentLaunchAnimationName,
    ).playbackSpeed = MathUtils.remap(
      this.slider.currentValue ?? 0,
      0.0,
      1.0,
      1.0,
      5.0,
    )
    this.launchSparks.enabled = true

    validate(this.launchSparksDisableEvent)

    this.launchSparksDisableEvent.reset(0.5)

    this.currentClip = this.rocketAnimationPlayer.getClip(
      this.currentLaunchAnimationName,
    )

    validate(this.currentClip)
    validate(this.landingStartedEvent)
    validate(this.takeOffCompleteEvent)

    this.landingStartedEvent.reset(
      (this.currentClip.duration / this.currentClip.playbackSpeed) * 0.9,
    )

    this.takeOffCompleteEvent.reset(
      (this.currentClip.duration / this.currentClip.playbackSpeed) * 0.2,
    )
  }

  private takeOffCompleted(): void {
    print("Take Off Completed!")
  }

  private landingStarted(): void {
    print("Landing Started!")
    validate(this.rocketConf.exhaustControl)
    this.rocketConf.exhaustControl.turnOffExhausts()
  }

  private setupAnimationAButtonCallbacks = (): void => {
    validate(this.animationAButton_interactable)
    this.animationAButton_interactable.onTriggerEnd.add(this.onAnimationAButton)
  }

  private onAnimationAButton = (): void => {
    this.currentLaunchAnimationName = "Base Layer Rocket 1"
    this.subscribeToCurrentLaunchAnimationEndEvent()
    this.flightPathText.text = "Flight Path : A"
  }

  private setupAnimationBButtonCallbacks = (): void => {
    validate(this.animationBButton_interactable)
    this.animationBButton_interactable.onTriggerEnd.add(this.onAnimationBButton)
  }

  private onAnimationBButton = (): void => {
    this.currentLaunchAnimationName = "Base Layer Rocket 2"
    this.subscribeToCurrentLaunchAnimationEndEvent()
    this.flightPathText.text = "Flight Path : B"
  }

  private setupAnimationCButtonCallbacks = (): void => {
    validate(this.animationCButton_interactable)
    this.animationCButton_interactable.onTriggerEnd.add(this.onAnimationCButton)
  }

  private onAnimationCButton = (): void => {
    this.currentLaunchAnimationName = "Base Layer Rocket 3"
    this.subscribeToCurrentLaunchAnimationEndEvent()
    this.flightPathText.text = "Flight Path : C"
  }

  private subscribeToCurrentLaunchAnimationEndEvent = (): void => {
    let currentAnimationClip = this.rocketAnimationPlayer.getClip(
      this.currentLaunchAnimationName,
    )
    let flightEndTimestamp = currentAnimationClip.duration
    currentAnimationClip.animation.createEvent(
      FLIGHT_END_EVENT_NAME,
      flightEndTimestamp,
    )

    this.flightEndEventRegistration = this.rocketAnimationPlayer.onEvent.add(
      this.onAnimationEnd.bind(this),
    )
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
