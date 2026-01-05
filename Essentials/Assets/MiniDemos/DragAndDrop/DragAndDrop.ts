import {Interactable} from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable"
import {InteractableManipulation} from "SpectaclesInteractionKit.lspkg/Components/Interaction/InteractableManipulation/InteractableManipulation"
import {InteractorEvent} from "SpectaclesInteractionKit.lspkg/Core/Interactor/InteractorEvent"
import NativeLogger from "SpectaclesInteractionKit.lspkg/Utils/NativeLogger"

const log = new NativeLogger("MyNativeLogger")
// Interaction System https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-interaction-kit/features/interactionsystem
// Instantiate https://developers.snap.com/lens-studio/api/lens-scripting/classes/Built-In.ObjectPrefab.html#instantiateasync or https://developers.snap.com/lens-studio/lens-studio-workflow/prefabs

@component
export class DragAndDrop extends BaseScriptComponent {
  @input
  @allowUndefined
  @hint("The Interactable for select and release")
  manipulateObject: Interactable

  @input
  @allowUndefined
  @hint("The InteractableManipulation component for manipulation events")
  manipulationComponent: InteractableManipulation

  @input
  @allowUndefined
  @hint("The InteractableManipulation component for manipulation events")
  physicsBody: BodyComponent

  @input
  @hint("The delay time in seconds before the instantiated object is destroyed")
  destroyDelay: number = 5

  private latestObject: SceneObject = null

  onAwake() {
    this.createEvent("OnStartEvent").bind(() => {
      this.onStart()
      log.d("Onstart event triggered")
      print("Onstart event triggered")
    })
  }

  onStart() {
    // Set up the basic trigger callbacks
    const onTriggerStartCallback = (event: InteractorEvent) => {
      this.objectIsSelected()
    }
    this.manipulateObject.onInteractorTriggerStart(onTriggerStartCallback)

    const onTriggerEndCallback = (event: InteractorEvent) => {
      this.objectIsDropped()
    }
    this.manipulateObject.onInteractorTriggerEnd(onTriggerEndCallback)

    // Set up manipulation callbacks if manipulation component is provided
    if (this.manipulationComponent) {
      // Manipulation start event
      this.manipulationComponent.onManipulationStart.add((event) => {
        this.onManipulationStarted(event)
      })

      // Manipulation end event
      this.manipulationComponent.onManipulationEnd.add((event) => {
        this.onManipulationEnded(event)
      })
    } else {
      log.w("No InteractableManipulation component provided, advanced manipulation events won't be available")
      print("Warning: No InteractableManipulation component provided")
    }
  }

  /**
   * Called when manipulation starts (from InteractableManipulation)
   */
  onManipulationStarted(event: any) {
    log.d("Manipulation started")
    print("Manipulation started")
  }

  /**
   * Called when manipulation ends (from InteractableManipulation)
   */
  onManipulationEnded(event: any) {
    log.d("Manipulation ended")
    print("Manipulation ended")

    this.physicsBody.dynamic = true
  }

  objectIsSelected() {
    this.latestObject = this.manipulateObject.getSceneObject()
    log.d("Object selected: " + this.latestObject.name)
    print("Object selected: " + this.latestObject.name)
  }

  objectIsDropped() {
    // this.physicsBody.dynamic = true; // same as in onManipulationEnded
    if (!this.latestObject) {
      log.w("No object to drop")
      return
    }

    const delayedEvent = this.createEvent("DelayedCallbackEvent")
    delayedEvent.bind(() => {
      if (this.latestObject) {
        this.latestObject.destroy()
        log.d(`Object destroyed after ${this.destroyDelay} seconds`)
        print(`Object destroyed after ${this.destroyDelay} seconds`)
        this.latestObject = null
      }
    })

    delayedEvent.reset(this.destroyDelay)
    log.d("Object dropped, scheduled for destruction")
    print("Object dropped, will be destroyed in " + this.destroyDelay + " seconds")
  }
}
