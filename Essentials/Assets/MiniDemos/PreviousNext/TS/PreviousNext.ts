import {Interactable} from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable"
import {InteractorEvent} from "SpectaclesInteractionKit.lspkg/Core/Interactor/InteractorEvent"

@component
export class PreviousNext extends BaseScriptComponent {
  // Expose the array of SceneObjects to the inspector
  @input
  sceneObjects: SceneObject[]

  @input
  textObject: Text | undefined

  // Expose the interactable components for the next and previous actions
  @input
  nextInteractable: Interactable | undefined

  @input
  previousInteractable: Interactable | undefined

  onAwake() {
    this.createEvent("OnStartEvent").bind(() => {
      this.onStart()
    })
  }

  onStart() {
    // Check if there are any scene objects to navigate
    if (!this.sceneObjects || this.sceneObjects.length === 0) {
      print("No scene objects to navigate.")
      return
    }

    // Initialize the navigator with the array of scene objects set in the inspector
    const navigator = new ArrayNavigator(this.sceneObjects)

    // Activate the initial object
    this.activateCurrentObject(navigator.getCurrentItem())

    const onTriggerStartCallbackNext = (event: InteractorEvent) => {
      const nextItem = navigator.next()
      this.activateCurrentObject(nextItem)
    }

    const onTriggerStartCallbackPrevious = (event: InteractorEvent) => {
      const previousItem = navigator.previous()
      this.activateCurrentObject(previousItem)
    }

    if (this.nextInteractable) {
      this.nextInteractable.onInteractorTriggerStart(onTriggerStartCallbackNext)
    } else {
      print("Next interactable is not defined.")
    }

    if (this.previousInteractable) {
      this.previousInteractable.onInteractorTriggerStart(onTriggerStartCallbackPrevious)
    } else {
      print("Previous interactable is not defined.")
    }
  }

  activateCurrentObject(currentObject: SceneObject) {
    // Deactivate all objects
    this.sceneObjects.forEach((obj) => {
      obj.enabled = false
    })

    // Activate the current object
    currentObject.enabled = true
    print(`Activated object: ${currentObject.name}`)

    // Update the text object with the current object's name
    if (this.textObject) {
      this.textObject.text = currentObject.name
      print(`Updated text object with name: ${currentObject.name}`)
    } else {
      print("Text object is not defined.")
    }
  }
}

class ArrayNavigator {
  items: any[]
  currentIndex: number

  constructor(items: any[]) {
    this.items = items
    this.currentIndex = 0
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.items.length
    return this.items[this.currentIndex]
  }

  previous() {
    this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length
    return this.items[this.currentIndex]
  }

  getCurrentItem() {
    return this.items[this.currentIndex]
  }
}
