import {Interactable} from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable"
import {InteractorEvent} from "SpectaclesInteractionKit.lspkg/Core/Interactor/InteractorEvent"
import NativeLogger from "SpectaclesInteractionKit.lspkg/Utils/NativeLogger"

const log = new NativeLogger("MyNativeLogger")
// Interaction System https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-interaction-kit/features/interactionsystem
// Instantiate https://developers.snap.com/lens-studio/api/lens-scripting/classes/Built-In.ObjectPrefab.html#instantiateasync or https://developers.snap.com/lens-studio/lens-studio-workflow/prefabs

@component
export class ExampleLensManager extends BaseScriptComponent {
  @input
  @allowUndefined
  @hint("The prefab object we will instantiate when clicking the create button")
  prefabToInstantiate: ObjectPrefab

  @input
  @allowUndefined
  @hint("The position reference the object will move to on left-hand pinch")
  destinationReference: SceneObject

  @input
  @allowUndefined
  @hint("The button that will create the prefab object")
  createButton: Interactable

  @input
  @hint("The delay time in seconds before the instantiated object is destroyed")
  destroyDelay: number = 5

  @input
  @hint("Speed at which the object moves to the destination on pinch")
  lerpSpeed: number = 0.1

  private latestObject: SceneObject = null

  onAwake() {
    this.createEvent("OnStartEvent").bind(() => {
      this.onStart()
      log.d("Onstart event triggered")
      print("Onstart event triggered")
    })
  }

  onStart() {
    // Create an event callback function for the create button
    const onTriggerStartCallback = (event: InteractorEvent) => {
      if (!this.latestObject) {
        this.instantiate()
        log.d("Create button pressed. Instantiating the prefab object.")
        print("Create button pressed. Instantiating the prefab object.")
      } else {
        log.d("Object already instantiated. Not creating a new one.")
        print("Object already instantiated. Not creating a new one.")
      }
    }
    // Add the event listener to the create button onInteractorTriggerStart
    this.createButton.onInteractorTriggerStart(onTriggerStartCallback)
  }

  // Instantiate the prefab object on click
  instantiate() {
    this.latestObject = this.prefabToInstantiate.instantiate(null)
    this.latestObject.name = "MyNewObject"
    this.latestObject.getTransform().setWorldPosition(this.destinationReference.getTransform().getWorldPosition())

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
  }
}
