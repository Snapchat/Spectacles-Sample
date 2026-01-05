import {SIK} from "SpectaclesInteractionKit.lspkg/SIK"
import {mix} from "SpectaclesInteractionKit.lspkg/Utils/animate"
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
  @hint("The delay time in seconds before the instantiated object is destroyed")
  destroyDelay: number = 5

  @input
  @hint("Speed at which the object moves to the destination on pinch")
  lerpSpeed: number = 0.1

  // Reference to the left hand input data
  private leftHand = SIK.HandInputData.getHand("left") // or right
  // Reference to the stored instantiated object - we will use this to
  // remember the object we created and move it to the destination
  private latestObject: SceneObject = null
  // Flag to check if the object is moving
  private isMoving: boolean = false

  onAwake() {
    this.createEvent("OnStartEvent").bind(() => {
      this.onStart()
      log.d("Update event triggered")
      print("Update event triggered")
    })
    this.createEvent("UpdateEvent").bind(() => {
      this.updateObjectMovement()
      log.d("Update event triggered")
      print("Update event triggered")
    })
  }

  onStart() {
    this.instantiate()
    // Create an event callback function for the left hand pinch down
    const onPinchDownCallback = () => {
      this.onLeftHandPinchDown() // Call the method that handles pinch down
      log.d("OnPinchDown event triggered") // Log the event for debugging
      print("OnPinchDown event triggered") // Log the event for debugging
    }

    // Add the event listener to the left hand onPinchDown
    this.leftHand.onPinchDown.add(onPinchDownCallback)
    // or add different gestures from the GestureProvider
    // this.leftHand.onPinchUp.add(onPinchDownCallback)
    // https://developers.snap.com/spectacles/about-spectacles-features/apis/gesture-module
    // https://developers.snap.com/lens-studio/api/lens-scripting/modules/Packages_SpectaclesInteractionKit_Providers_HandInputData_GestureProvider_GestureModuleProvider.html
    // https://developers.snap.com/lens-studio/api/lens-scripting/classes/Packages_SpectaclesInteractionKit_Providers_HandInputData_GestureProvider_PalmTapDetection_PalmTapDetectorStateMachine.default.html
    // https://developers.snap.com/lens-studio/api/lens-scripting/classes/Packages_SpectaclesInteractionKit_Providers_HandInputData_GestureProvider_PinchDetection_PinchDetector.PinchDetector.html#onpinchdown
  }

  // Instantiate the prefab object
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
        this.isMoving = false
      }
    })

    delayedEvent.reset(this.destroyDelay)
  }

  // Handle left hand pinch down event
  onLeftHandPinchDown() {
    if (!this.latestObject) return

    if (this.isMoving) {
      // Stop movement if already moving and user pinches again
      this.isMoving = false
      log.d("Pinch detected while moving. Stopping movement.")
    } else {
      // Start movement if not moving
      log.d("Left hand pinch detected. Moving object to destination...")
      print("Left hand pinch detected. Moving object to destination...")
      this.isMoving = true
    }
  }

  // Update the object movement to the destination
  updateObjectMovement() {
    if (this.isMoving && this.latestObject) {
      const currentPos = this.latestObject.getTransform().getWorldPosition()
      const targetPos = this.destinationReference.getTransform().getWorldPosition()

      const newPos = mix(currentPos, targetPos, this.lerpSpeed)
      this.latestObject.getTransform().setWorldPosition(newPos)
      log.d("Object is moving to destination")
      print("Object is moving to destination")

      if (currentPos.distance(targetPos) < 0.01) {
        this.isMoving = false
        log.d("Object reached destination. Waiting for next pinch.")
        print("Object reached destination. Waiting for next pinch.")
      }
    }
  }
}
