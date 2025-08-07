import {Interactable} from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable"
import {HandInteractor} from "SpectaclesInteractionKit.lspkg/Core/HandInteractor/HandInteractor"
import {Interactor, TargetingMode} from "SpectaclesInteractionKit.lspkg/Core/Interactor/Interactor"
import {DragInteractorEvent} from "SpectaclesInteractionKit.lspkg/Core/Interactor/InteractorEvent"
import Event, {PublicApi} from "SpectaclesInteractionKit.lspkg/Utils/Event"
import NativeLogger from "SpectaclesInteractionKit.lspkg/Utils/NativeLogger"
import ReplayEvent from "SpectaclesInteractionKit.lspkg/Utils/ReplayEvent"
import {CapsuleSphereCollider} from "../Utility/CapsuleSphereCollider"
import {InteractableStateMachine, StateEvent} from "../Utility/InteractableStateMachine"

const log = new NativeLogger("Element")

export const IMAGE_MATERIAL_ASSET: Material = requireAsset("../../Materials/Image.mat") as Material

const HOVER_START_AUDIO_TRACK: AudioTrackAsset = requireAsset("../../Audio/HoverAudioTrack.wav") as AudioTrackAsset

const TRIGGER_START_AUDIO_TRACK: AudioTrackAsset = requireAsset(
  "../../Audio/TriggerStartAudioTrack.wav"
) as AudioTrackAsset

const TRIGGER_END_AUDIO_TRACK: AudioTrackAsset = requireAsset("../../Audio/TriggerEndAudioTrack.wav") as AudioTrackAsset

const HOVER_START_AUDIO_VOLUME: number = 1
const HOVER_END_AUDIO_VOLUME: number = 1
const TRIGGER_START_AUDIO_VOLUME: number = 1
const TRIGGER_END_AUDIO_VOLUME: number = 1

export enum StateName {
  default,
  hover,
  active,
  toggledDefault,
  error,
  errorHover,
  disabled,
  toggledHovered
}

/**
 * Abstract class representing an element in the Spectacles UIKit.
 *
 * @abstract
 */
@component
export abstract class Element extends BaseScriptComponent {
  @input
  @hint("Disabled Mode")
  private isDisabled: boolean = false

  @input
  @label("Play Audio")
  @hint("Play audio on interaction")
  private _playAudio: boolean = false

  @input
  @hint("Size of the element in centimeters")
  protected _size: vec3 = new vec3(6, 3, 3)

  private _playHoverEnterAudio: boolean = true
  private _playTriggerDownAudio: boolean = true
  private _playTriggerUpAudio: boolean = true

  private _transform: Transform = this.sceneObject.getTransform()

  private _collider: CapsuleSphereCollider
  private _interactable: Interactable
  protected _interactableStateMachine: InteractableStateMachine

  protected stateName: StateName = StateName.default

  protected _initialized: boolean = false
  protected _hasError: boolean = false

  private _audioComponent: AudioComponent
  private _hoverStartAudioTrack: AudioTrackAsset = HOVER_START_AUDIO_TRACK
  private _hoverStartAudioVolume: number = HOVER_START_AUDIO_VOLUME
  private _hoverEndAudioTrack: AudioTrackAsset = undefined
  private _hoverEndAudioVolume: number = HOVER_END_AUDIO_VOLUME
  private _triggerStartAudioTrack: AudioTrackAsset = TRIGGER_START_AUDIO_TRACK
  private _triggerStartAudioVolume: number = TRIGGER_START_AUDIO_VOLUME
  private _triggerEndAudioTrack: AudioTrackAsset = TRIGGER_END_AUDIO_TRACK
  private _triggerEndAudioVolume: number = TRIGGER_END_AUDIO_VOLUME

  private _hoveringInteractors: Set<Interactor> = new Set<Interactor>()
  private _triggeringInteractors: Set<Interactor> = new Set<Interactor>()

  /**
   * Indicates whether the element is currently being dragged.
   * This property is used to track the drag state of the element.
   */
  protected _isDragged: boolean = false

  private onInitializedEvent: ReplayEvent = new ReplayEvent()
  /**
   * A public API event that is triggered when the element is initialized.
   */
  public readonly onInitialized: PublicApi<void> = this.onInitializedEvent.publicApi()

  protected onStateChangedEvent = new Event<StateName>()
  /**
   * An event that is triggered whenever the state of the element changes.
   */
  public readonly onStateChanged = this.onStateChangedEvent.publicApi()

  private onHoverEnterEvent: Event = new Event()
  /**
   * An event that is triggered when a hover interaction starts on the element.
   */
  public readonly onHoverEnter: PublicApi<void> = this.onHoverEnterEvent.publicApi()

  private onHoverExitEvent: Event = new Event()
  /**
   * An event that is triggered when a hover interaction ends on the element.
   */
  public readonly onHoverExit: PublicApi<void> = this.onHoverExitEvent.publicApi()

  private onTriggerDownEvent: Event = new Event()
  /**
   * An event that is triggered when a trigger interaction starts on the element.
   */
  public readonly onTriggerDown: PublicApi<void> = this.onTriggerDownEvent.publicApi()

  private onTriggerUpEvent: Event = new Event()
  /**
   * An event that is triggered when a trigger interaction ends on the element.
   */
  public readonly onTriggerUp: PublicApi<void> = this.onTriggerUpEvent.publicApi()

  private readonly onInteractableDefaultHandler = this.onInteractableDefault.bind(this)
  private readonly onInteractableHoveredHandler = this.onInteractableHovered.bind(this)
  private readonly onInteractableActiveHandler = this.onInteractableActive.bind(this)
  private readonly onInteractableTriggeredHandler = this.onInteractableTriggered.bind(this)
  private readonly onInteractableToggledDefaultHandler = this.onInteractableToggledDefault.bind(this)
  private readonly onInteractableToggledHoveredHandler = this.onInteractableToggledHovered.bind(this)
  private readonly onInteractableToggledActiveHandler = this.onInteractableToggledActive.bind(this)

  protected readonly onInteractableDragStartHandler = this.onInteractableDragStart.bind(this)
  protected readonly onInteractableDragUpdateHandler = this.onInteractableDragUpdate.bind(this)
  protected readonly onInteractableDragEndHandler = this.onInteractableDragEnd.bind(this)

  /**
   * All children of this element are moved to this container.
   * This container translates and scale with the Visual of the Element
   */
  protected childrenContainer: SceneObject = global.scene.createSceneObject("ChildrenContainer")

  /**
   * Gets the transform associated with this element.
   *
   * @returns {Transform} The transform of the element.
   */
  public get transform(): Transform {
    return this._transform
  }

  /**
   * Gets the CapsuleSphereCollider instance associated with this element.
   * The collider is used for detecting interactions or collisions with the element.
   *
   * @returns {CapsuleSphereCollider} The collider instance.
   */
  public get collider(): CapsuleSphereCollider {
    return this._collider
  }

  /**
   * Gets the interactable property of the element.
   *
   * @returns {Interactable} The current interactable instance associated with this element.
   */
  public get interactable(): Interactable {
    return this._interactable
  }

  /**
   * Indicates whether the element has been initialized.
   *
   * @returns {boolean} `true` if the element is initialized, otherwise `false`.
   */
  public get initialized(): boolean {
    return this._initialized
  }

  /**
   * Gets the value indicating whether audio playback is enabled.
   *
   * @returns {boolean} `true` if audio playback is enabled; otherwise, `false`.
   */
  public get playAudio(): boolean {
    return this._playAudio
  }

  /**
   * Sets the playAudio behavior and initializes the audio component if necessary.
   *
   * @param playAudio - A boolean indicating whether audio should be played.
   *                    If set to `true` and the audio component is not already created,
   *                    a new audio component will be instantiated and attached to the scene object.
   */
  public set playAudio(playAudio: boolean) {
    this._playAudio = playAudio
    this.createAudioComponent()
  }

  /**
   * Gets the value indicating whether hover enter audio playback is enabled.
   *
   * @returns {boolean} `true` if hover enter audio playback is enabled; otherwise, `false`.
   */
  public get playHoverEnterAudio(): boolean {
    return this._playHoverEnterAudio
  }

  /**
   * Sets the playHoverEnterAudio behavior and initializes the audio component if necessary.
   *
   * @param playHoverEnterAudio - A boolean indicating whether hover enter audio should be played.
   *                              If set to `true` and the audio component is not already created,
   *                              a new audio component will be instantiated and attached to the scene object.
   */
  public set playHoverEnterAudio(playHoverEnterAudio: boolean) {
    this._playHoverEnterAudio = playHoverEnterAudio
    this.createAudioComponent()
  }

  /**
   * Gets the value indicating whether trigger down audio playback is enabled.
   *
   * @returns {boolean} `true` if trigger down audio playback is enabled; otherwise, `false`.
   */
  public get playTriggerDownAudio(): boolean {
    return this._playTriggerDownAudio
  }

  /**
   * Sets the playTriggerDownAudio behavior and initializes the audio component if necessary.
   *
   * @param playTriggerDownAudio - A boolean indicating whether trigger down audio should be played.
   *                               If set to `true` and the audio component is not already created,
   *                               a new audio component will be instantiated and attached to the scene object.
   */
  public set playTriggerDownAudio(playTriggerDownAudio: boolean) {
    this._playTriggerDownAudio = playTriggerDownAudio
    this.createAudioComponent()
  }

  /**
   * Gets the value indicating whether trigger up audio playback is enabled.
   *
   * @returns {boolean} `true` if trigger up audio playback is enabled; otherwise, `false`.
   */
  public get playTriggerUpAudio(): boolean {
    return this._playTriggerUpAudio
  }

  /**
   * Sets the playTriggerUpAudio behavior and initializes the audio component if necessary.
   *
   * @param playTriggerUpAudio - A boolean indicating whether trigger up audio should be played.
   *                             If set to `true` and the audio component is not already created,
   *                             a new audio component will be instantiated and attached to the scene object.
   */
  public set playTriggerUpAudio(playTriggerUpAudio: boolean) {
    this._playTriggerUpAudio = playTriggerUpAudio
    this.createAudioComponent()
  }

  /**
   * Gets the audio track to be played when the hover start event is triggered.
   *
   * @returns {AudioTrackAsset} The audio track asset associated with the hover start event.
   */
  public get hoverStartAudioTrack(): AudioTrackAsset {
    return this._hoverStartAudioTrack
  }

  /**
   * Sets the audio track to be played when the hover start event is triggered.
   *
   * @param audioTrack - The audio track asset to be associated with the hover start event.
   */
  public set hoverStartAudioTrack(audioTrack: AudioTrackAsset) {
    this._hoverStartAudioTrack = audioTrack
  }

  /**
   * Gets the volume level for the hover start audio effect.
   *
   * @returns {number} The volume level for the hover start audio effect.
   */
  public get hoverStartAudioVolume(): number {
    return this._hoverStartAudioVolume
  }

  /**
   * Sets the volume level for the hover start audio effect.
   *
   * @param volume - The desired volume level as a number.
   *                 Typically ranges from 0 (mute) to 1 (full volume).
   */
  public set hoverStartAudioVolume(volume: number) {
    this._hoverStartAudioVolume = volume
  }

  /**
   * Gets the audio track to be played when the hover interaction ends.
   *
   * @returns {AudioTrackAsset} The audio track asset associated with the hover end event.
   */
  public get hoverEndAudioTrack(): AudioTrackAsset {
    return this._hoverEndAudioTrack
  }

  /**
   * Sets the audio track to be played when the hover interaction ends.
   *
   * @param audioTrack - The audio track asset to be assigned for the hover end event.
   */
  public set hoverEndAudioTrack(audioTrack: AudioTrackAsset) {
    this._hoverEndAudioTrack = audioTrack
  }

  /**
   * Gets the volume level for the hover end audio effect.
   *
   * @returns {number} The volume level for the hover end audio effect.
   */
  public get hoverEndAudioVolume(): number {
    return this._hoverEndAudioVolume
  }

  /**
   * Sets the volume level for the hover end audio effect.
   *
   * @param volume - The desired volume level for the hover end audio effect.
   *                 This should be a number where the range and constraints
   *                 depend on the implementation.
   */
  public set hoverEndAudioVolume(volume: number) {
    this._hoverEndAudioVolume = volume
  }

  /**
   * Gets the audio track to be played when the trigger starts.
   *
   * @returns {AudioTrackAsset} The audio track asset associated with the trigger start event.
   */
  public get triggerStartAudioTrack(): AudioTrackAsset {
    return this._triggerStartAudioTrack
  }

  /**
   * Sets the audio track to be played when the trigger starts.
   *
   * @param audioTrack - The audio track asset to be assigned.
   */
  public set triggerStartAudioTrack(audioTrack: AudioTrackAsset) {
    this._triggerStartAudioTrack = audioTrack
  }

  /**
   * Gets the volume level for the trigger start audio.
   *
   * @returns {number} The volume level for the trigger start audio.
   */
  public get triggerStartAudioVolume(): number {
    return this._triggerStartAudioVolume
  }

  /**
   * Sets the volume level for the trigger start audio.
   *
   * @param volume - The desired audio volume level as a number.
   */
  public set triggerStartAudioVolume(volume: number) {
    this._triggerStartAudioVolume = volume
  }

  /**
   * Gets the audio track to be played at the end of a trigger event.
   *
   * @returns {AudioTrackAsset} The audio track asset associated with the trigger end event.
   */
  public get triggerEndAudioTrack(): AudioTrackAsset {
    return this._triggerEndAudioTrack
  }

  /**
   * Sets the audio track to be played at the end of a trigger event.
   *
   * @param audioTrack - The audio track asset to be assigned.
   */
  public set triggerEndAudioTrack(audioTrack: AudioTrackAsset) {
    this._triggerEndAudioTrack = audioTrack
  }

  /**
   * Gets the volume level for the trigger end audio.
   *
   * @returns {number} The volume level for the trigger end audio.
   */
  public get triggerEndAudioVolume(): number {
    return this._triggerEndAudioVolume
  }

  /**
   * Sets the volume level for the trigger end audio.
   *
   * @param volume - The desired volume level as a number.
   */
  public set triggerEndAudioVolume(volume: number) {
    this._triggerEndAudioVolume = volume
  }

  /**
   * @returns is disabled or not
   */
  get disabled() {
    return this.isDisabled
  }

  /**
   * @param disabled set is disabled or is not disabled
   */
  set disabled(disabled: boolean) {
    this.isDisabled = disabled
    if (this.isDisabled) {
      this.setState(StateName.disabled)
    } else {
      this.setState(StateName.default)
    }
    if (this._interactable) {
      this._interactable.enabled = !this.isDisabled
    }
  }

  /**
   * @returns current size
   */
  get size(): vec3 {
    return this._size
  }

  /**
   * @param size set current size
   */
  set size(size: vec3) {
    this._size = size
    this._collider?.setSize(this._size)
  }

  /**
   * Determines whether the element is draggable.
   *
   * @returns {boolean} Always returns `false`, indicating that the element is not draggable.
   */
  get isDraggable() {
    return false
  }

  /**
   * Initializes the element and its associated components. This method ensures that
   * the element is set up properly, including its collider, interactable state, size,
   * and event listeners.
   */
  initialize() {
    if (this._initialized) {
      return
    }

    this._interactable =
      this.sceneObject.getComponent(Interactable.getTypeName()) ||
      this.sceneObject.createComponent(Interactable.getTypeName())
    this._interactable.targetingMode = TargetingMode.All
    this._interactable.enableInstantDrag = this.isDraggable
    this._interactableStateMachine = this.sceneObject.createComponent(InteractableStateMachine.getTypeName())
    this._interactableStateMachine.initialize()

    this.size = this._size

    this._collider =
      this.sceneObject.getComponent(CapsuleSphereCollider.getTypeName()) ||
      this.sceneObject.createComponent(CapsuleSphereCollider.getTypeName())
    this._collider.initialize()
    this._collider.setSize(this.size)

    this.setUpInteractableListeners()

    this.createAudioComponent()

    this.childrenContainer.setParent(this.sceneObject)
    this.sceneObject.children.forEach((child) => {
      if (child === this.childrenContainer) {
        return
      }
      child.setParent(this.childrenContainer)
    })

    this.setUpEventCallbacks()

    if (this.isDisabled) {
      this.disabled = this.isDisabled
    } else {
      this.setState(StateName.default)
    }

    this._initialized = true

    this.onInitializedEvent.invoke()
  }

  protected setUpEventCallbacks() {}

  protected update() {}

  protected release() {
    this.removeInteractableListeners()
    this._interactableStateMachine.destroy()
    this._interactableStateMachine = null
  }

  protected setState(stateName: StateName) {
    this.stateName = stateName
    this.onStateChangedEvent.invoke(stateName)
  }

  protected get isToggle(): boolean {
    return false
  }

  private setUpInteractableListeners() {
    this._interactableStateMachine.isToggle = this.isToggle
    this._interactableStateMachine.onDefault.add(this.onInteractableDefaultHandler)
    this._interactableStateMachine.onHovered.add(this.onInteractableHoveredHandler)
    this._interactableStateMachine.onActive.add(this.onInteractableActiveHandler)
    this._interactableStateMachine.onTriggered.add(this.onInteractableTriggeredHandler)
    this._interactableStateMachine.onToggledDefault.add(this.onInteractableToggledDefaultHandler)
    this._interactableStateMachine.onToggledHovered.add(this.onInteractableToggledHoveredHandler)
    this._interactableStateMachine.onToggledActive.add(this.onInteractableToggledActiveHandler)
    if (this.isDraggable) {
      this._interactable.onDragStart.add(this.onInteractableDragStartHandler)
      this._interactable.onDragUpdate.add(this.onInteractableDragUpdateHandler)
      this._interactable.onDragEnd.add(this.onInteractableDragEndHandler)
    }
  }

  private removeInteractableListeners() {
    this._interactableStateMachine.onDefault.remove(this.onInteractableDefaultHandler)
    this._interactableStateMachine.onHovered.remove(this.onInteractableHoveredHandler)
    this._interactableStateMachine.onActive.remove(this.onInteractableActiveHandler)
    this._interactableStateMachine.onTriggered.remove(this.onInteractableTriggeredHandler)
    this._interactableStateMachine.onToggledDefault.remove(this.onInteractableToggledDefaultHandler)
    this._interactableStateMachine.onToggledHovered.remove(this.onInteractableToggledHoveredHandler)
    this._interactableStateMachine.onToggledActive.remove(this.onInteractableToggledActiveHandler)
    if (this.isDraggable) {
      this._interactable.onDragStart.remove(this.onInteractableDragStartHandler)
      this._interactable.onDragUpdate.remove(this.onInteractableDragUpdateHandler)
      this._interactable.onDragEnd.remove(this.onInteractableDragEndHandler)
    }
  }

  protected onInteractableDefault(stateEvent: StateEvent) {
    this.setState(this._hasError ? StateName.error : StateName.default)
    if (stateEvent.event) {
      if (this._hoveringInteractors.has(stateEvent.event.interactor)) {
        this.playAudioTrack(this._hoverEndAudioTrack, this._hoverEndAudioVolume)
        log.d(`on ${this.sceneObject.name} hover exit`)
        this.onHoverExitEvent.invoke()
        this._hoveringInteractors.delete(stateEvent.event.interactor)
      }
    }
  }

  protected onInteractableHovered(stateEvent: StateEvent) {
    this.setState(this._hasError ? StateName.errorHover : StateName.hover)
    if (stateEvent.event) {
      if (!this._hoveringInteractors.has(stateEvent.event.interactor)) {
        if (this._playHoverEnterAudio) {
          this.playAudioTrack(this._hoverStartAudioTrack, this._hoverStartAudioVolume)
        }
        log.d(`on ${this.sceneObject.name} hover enter`)
        this.onHoverEnterEvent.invoke()
        this._hoveringInteractors.add(stateEvent.event.interactor)
      }
    }
  }

  protected onInteractableActive(stateEvent: StateEvent) {
    this.setState(StateName.active)
    if (stateEvent.event) {
      if (!this._triggeringInteractors.has(stateEvent.event.interactor)) {
        if (this._playTriggerDownAudio) {
          this.playAudioTrack(this._triggerStartAudioTrack, this._triggerStartAudioVolume)
        }
        log.d(`on ${this.sceneObject.name} trigger down`)
        this.onTriggerDownEvent.invoke()
        this._triggeringInteractors.add(stateEvent.event.interactor)
      }
    }
  }

  protected onInteractableTriggered(stateEvent: StateEvent) {
    if (stateEvent.event) {
      if (this._triggeringInteractors.has(stateEvent.event.interactor)) {
        if (this._playTriggerUpAudio) {
          this.playAudioTrack(this._triggerEndAudioTrack, this._triggerEndAudioVolume)
        }
        log.d(`on ${this.sceneObject.name} trigger up`)
        this.onTriggerUpEvent.invoke()
        this._triggeringInteractors.delete(stateEvent.event.interactor)
      }
    }
  }

  protected onInteractableToggledDefault(stateEvent: StateEvent) {
    this.setState(StateName.toggledDefault)
    if (stateEvent.event) {
      if (this._hoveringInteractors.has(stateEvent.event.interactor)) {
        this.playAudioTrack(this._hoverEndAudioTrack, this._hoverEndAudioVolume)
        this.onHoverExitEvent.invoke()
        this._hoveringInteractors.delete(stateEvent.event.interactor)
      }
    }
  }

  protected onInteractableToggledHovered(stateEvent: StateEvent) {
    this.setState(StateName.toggledHovered)
    if (stateEvent.event) {
      if (this._triggeringInteractors.has(stateEvent.event.interactor)) {
        this.playAudioTrack(this._triggerEndAudioTrack, this._triggerEndAudioVolume)
        this.onTriggerUpEvent.invoke()
        this._triggeringInteractors.delete(stateEvent.event.interactor)
      } else if (!this._hoveringInteractors.has(stateEvent.event.interactor)) {
        this.playAudioTrack(this._hoverStartAudioTrack, this._hoverStartAudioVolume)
        this.onHoverEnterEvent.invoke()
        this._hoveringInteractors.add(stateEvent.event.interactor)
      }
    }
  }

  protected onInteractableToggledActive(stateEvent: StateEvent) {
    if (stateEvent.event) {
      if (!this._triggeringInteractors.has(stateEvent.event.interactor)) {
        this.playAudioTrack(this._triggerStartAudioTrack, this._triggerStartAudioVolume)
        print(`[searchbar] Toggled active (trigger down)`)
        this.onTriggerDownEvent.invoke()
        this._triggeringInteractors.add(stateEvent.event.interactor)
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected onInteractableDragStart(dragEvent: DragInteractorEvent) {
    this._collider.expandSize()
    this._isDragged = true
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected onInteractableDragUpdate(dragEvent: DragInteractorEvent) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected onInteractableDragEnd(dragEvent: DragInteractorEvent) {
    this._collider.resetSize()
    this._isDragged = false
  }

  protected getInteractionPosition(interactor: Interactor): vec3 | null {
    let currentInteractionPosition: vec3 | null = null
    if (interactor instanceof HandInteractor) {
      const hand = interactor.hand
      // Pinch drag update does not update the target hit position
      if (interactor.activeTargetingMode === TargetingMode.Direct) {
        currentInteractionPosition = this._transform
          .getInvertedWorldTransform()
          .multiplyPoint(hand.indexTip.position.add(hand.thumbTip.position).uniformScale(0.5))
      } else if (interactor.planecastPoint) {
        currentInteractionPosition = this._transform
          .getInvertedWorldTransform()
          .multiplyPoint(interactor.planecastPoint)
      } else {
        currentInteractionPosition = this._transform.getInvertedWorldTransform().multiplyPoint(hand.indexTip.position)
      }
    } else if (interactor.planecastPoint) {
      currentInteractionPosition = this._transform.getInvertedWorldTransform().multiplyPoint(interactor.planecastPoint)
    }
    return currentInteractionPosition
  }

  /**
   * Plays the specified audio track at the given volume.
   *
   * @param audioTrack - The audio track asset to be played.
   * @param volume - The volume level at which the audio track should be played.
   */
  protected playAudioTrack(audioTrack: AudioTrackAsset, volume: number) {
    if (this._playAudio && audioTrack) {
      this._audioComponent.audioTrack = audioTrack
      this._audioComponent.volume = volume
      this._audioComponent.play(1)
    }
  }

  private createAudioComponent() {
    if (
      this._playAudio &&
      (this._playHoverEnterAudio || this._playTriggerDownAudio || this._playTriggerUpAudio) &&
      !this._audioComponent
    ) {
      this._audioComponent = this.sceneObject.createComponent("Component.AudioComponent")
      this._audioComponent.playbackMode = Audio.PlaybackMode.LowPower
    }
  }

  onAwake() {
    this.createEvent("OnStartEvent").bind(this.onStart)
    this.createEvent("UpdateEvent").bind(this.onUpdate)
    this.createEvent("OnDestroyEvent").bind(this.onDestroy)
  }

  private onStart = () => {
    if (!this._initialized) {
      this.initialize()
    }
  }

  private onUpdate = () => {
    if (this._initialized) {
      this.update()
    }
  }

  private onDestroy = () => {
    this.release()
  }
}
