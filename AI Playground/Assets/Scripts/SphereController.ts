import {Interactable} from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable"
import {InteractableManipulation} from "SpectaclesInteractionKit.lspkg/Components/Interaction/InteractableManipulation/InteractableManipulation"
import animate from "SpectaclesInteractionKit.lspkg/Utils/animate"

import {PinchButton} from "SpectaclesInteractionKit.lspkg/Components/UI/PinchButton/PinchButton"
import WorldCameraFinderProvider from "SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider"
import {HandInputData} from "SpectaclesInteractionKit.lspkg/Providers/HandInputData/HandInputData"
import {BaseButton} from "SpectaclesUIKit.lspkg/Scripts/Components/Button/BaseButton"

import Event from "SpectaclesInteractionKit.lspkg/Utils/Event"

@component
export class SphereController extends BaseScriptComponent {
  @ui.separator
  @ui.label("Manages the UI and hand intereactions for the AI assistant")
  @ui.separator
  @input
  private hoverMat: Material

  @input
  private orbInteractableObj: SceneObject

  @input
  private orbObject: SceneObject

  @input
  private orbVisualParent: SceneObject

  @input
  private orbScreenPosition: SceneObject

  @input
  private closeObj: SceneObject

  @input
  private worldSpaceText: Text

  @input
  private screenSpaceText: Text

  @input
  private uiParent: SceneObject

  private wasInFOV: boolean = true

  private interactable: Interactable
  private manipulate: InteractableManipulation
  private orbButton: PinchButton
  @input
  private closeButton: BaseButton

  // Get SIK data
  private handProvider: HandInputData = HandInputData.getInstance()
  private menuHand = this.handProvider.getHand("left")

  private trackedToHand: boolean = true
  private wcfmp = WorldCameraFinderProvider.getInstance()

  private minimizedSize: vec3 = vec3.one().uniformScale(0.3)
  private fullSize: vec3 = vec3.one()

  public isActivatedEvent: Event<boolean> = new Event<boolean>()

  onAwake() {
    this.interactable = this.orbInteractableObj.getComponent(Interactable.getTypeName())
    this.manipulate = this.orbInteractableObj.getComponent(InteractableManipulation.getTypeName())
    this.orbButton = this.orbInteractableObj.getComponent(PinchButton.getTypeName())
    this.setIsTrackedToHand(true)
    this.createEvent("OnStartEvent").bind(this.init.bind(this))
    this.createEvent("UpdateEvent").bind(this.onUpdate.bind(this))
    this.hoverMat.mainPass.activeHover = 0
    this.uiParent.enabled = false
  }

  initializeUI() {
    this.uiParent.enabled = true
  }

  private setIsTrackedToHand(value: boolean) {
    this.trackedToHand = value
    this.manipulate.enabled = !value
    if (value) {
      this.setOrbToScreenPosition(true)
      {
        const tr = this.orbObject.getTransform()
        const start = tr.getLocalScale()
        const end = this.minimizedSize
        animate({
          duration: 0.6,
          easing: "ease-in-out-quad",
          update: (t) => {
            const x = start.x + (end.x - start.x) * t
            const y = start.y + (end.y - start.y) * t
            const z = start.z + (end.z - start.z) * t
            tr.setLocalScale(new vec3(x, y, z))
          }
        })
      }

      {
        const tr = this.closeObj.getTransform()
        const start = tr.getLocalScale()
        const end = vec3.one().uniformScale(0.1)
        animate({
          duration: 0.6,
          easing: "ease-in-out-quad",
          update: (t) => {
            const x = start.x + (end.x - start.x) * t
            const y = start.y + (end.y - start.y) * t
            const z = start.z + (end.z - start.z) * t
            tr.setLocalScale(new vec3(x, y, z))
          },
          ended: () => {
            this.closeButton.sceneObject.enabled = false
          }
        })
      }
      this.screenSpaceText.enabled = false
      this.worldSpaceText.enabled = false
    } else {
      {
        const tr = this.orbObject.getTransform()
        const start = tr.getLocalScale()
        const end = this.fullSize
        animate({
          duration: 0.4,
          easing: "ease-in-out-quad",
          update: (t) => {
            const x = start.x + (end.x - start.x) * t
            const y = start.y + (end.y - start.y) * t
            const z = start.z + (end.z - start.z) * t
            tr.setLocalScale(new vec3(x, y, z))
          }
        })
      }
      {
        const tr = this.orbObject.getTransform()
        const start = tr.getWorldPosition()
        const end = this.wcfmp.getForwardPosition(100)
        animate({
          duration: 0.6,
          easing: "ease-in-out-quad",
          update: (t) => {
            const x = start.x + (end.x - start.x) * t
            const y = start.y + (end.y - start.y) * t
            const z = start.z + (end.z - start.z) * t
            tr.setWorldPosition(new vec3(x, y, z))
          }
        })
      }

      this.closeButton.sceneObject.enabled = true
      {
        const tr = this.closeObj.getTransform()
        const start = tr.getLocalScale()
        const end = vec3.one()
        animate({
          duration: 0.6,
          easing: "ease-in-out-quad",
          update: (t) => {
            const x = start.x + (end.x - start.x) * t
            const y = start.y + (end.y - start.y) * t
            const z = start.z + (end.z - start.z) * t
            tr.setLocalScale(new vec3(x, y, z))
          }
        })
      }
      this.screenSpaceText.enabled = false
      this.worldSpaceText.enabled = true
    }

    this.isActivatedEvent.invoke(!value)
  }

  private init() {
    this.interactable.onHoverEnter.add(() => {
      animate({
        duration: 0.2,
        easing: "linear",
        update: (t) => {
          this.hoverMat.mainPass.activeHover = t
        }
      })
    })

    this.interactable.onHoverExit.add(() => {
      animate({
        duration: 0.2,
        easing: "linear",
        update: (t) => {
          this.hoverMat.mainPass.activeHover = 1 - t
        }
      })
    })

    this.orbButton.onButtonPinched.add(() => {
      if (this.trackedToHand) {
        this.setIsTrackedToHand(false)
      }
    })

    this.closeButton.onInitialized.add(() => {
      this.closeButton.onTriggerUp.add(() => {
        if (!this.trackedToHand) {
          this.setIsTrackedToHand(true)
        }
      })
    })
  }

  private onUpdate() {
    this.positionByHand()
    this.keepActiveOrbVisible()
  }

  private positionByHand() {
    let objectToTransform = this.orbObject.getTransform()
    if (!this.trackedToHand) {
      objectToTransform = this.closeObj.getTransform()
    }
    const handPosition = this.menuHand.pinkyKnuckle.position
    const handRight = this.menuHand.indexTip.right

    const curPosition = objectToTransform.getWorldPosition()
    let menuPosition = handPosition.add(handRight.uniformScale(4))

    if (global.deviceInfoSystem.isEditor()) {
      menuPosition = this.wcfmp.getWorldPosition().add(new vec3(0, -20, -25))
    }

    const nPosition = vec3.lerp(curPosition, menuPosition, 0.2)
    objectToTransform.setWorldPosition(nPosition)

    let billboardPos = this.wcfmp.getWorldPosition().add(this.wcfmp.forward().uniformScale(5))
    billboardPos = billboardPos.add(this.wcfmp.right().uniformScale(-5))
    const dir = billboardPos.sub(menuPosition).normalize()
    objectToTransform.setWorldRotation(quat.lookAt(dir, vec3.up()))

    if ((!this.menuHand.isTracked() || !this.menuHand.isFacingCamera()) && !global.deviceInfoSystem.isEditor()) {
      objectToTransform.getSceneObject().enabled = false
    } else {
      objectToTransform.getSceneObject().enabled = true
    }
  }

  private setOrbToScreenPosition(inScrPos: boolean) {
    if (!inScrPos) {
      this.orbVisualParent.setParent(this.orbScreenPosition)
      this.orbVisualParent.getTransform().setLocalPosition(vec3.zero())
      {
        const tr = this.orbVisualParent.getTransform()
        const start = vec3.one().uniformScale(0.01)
        const end = vec3.one().uniformScale(0.3)
        animate({
          duration: 0.2,
          easing: "linear",
          update: (t) => {
            const x = start.x + (end.x - start.x) * t
            const y = start.y + (end.y - start.y) * t
            const z = start.z + (end.z - start.z) * t
            tr.setLocalScale(new vec3(x, y, z))
          }
        })
      }
      this.screenSpaceText.enabled = true
      this.worldSpaceText.enabled = false
    } else {
      this.orbVisualParent.setParent(this.orbObject)
      this.orbVisualParent.getTransform().setLocalPosition(vec3.zero())
      {
        const tr = this.orbVisualParent.getTransform()
        const start = tr.getLocalScale()
        const end = vec3.one()
        animate({
          duration: 0.2,
          easing: "linear",
          update: (t) => {
            const x = start.x + (end.x - start.x) * t
            const y = start.y + (end.y - start.y) * t
            const z = start.z + (end.z - start.z) * t
            tr.setLocalScale(new vec3(x, y, z))
          }
        })
      }
      this.screenSpaceText.enabled = false
      this.worldSpaceText.enabled = true
    }
  }

  private keepActiveOrbVisible() {
    if (this.trackedToHand) {
      return
    }
    const orbPos = this.orbObject.getTransform().getWorldPosition()
    const inFov = this.wcfmp.inFoV(orbPos)
    if (inFov !== this.wasInFOV) {
      this.setOrbToScreenPosition(inFov)
    }
    this.wasInFOV = inFov
  }

  public setText(data: {text: string; completed: boolean}) {
    if (data.completed) {
      this.worldSpaceText.text = data.text
      this.screenSpaceText.text = data.text
    } else {
      this.worldSpaceText.text += data.text
      this.screenSpaceText.text += data.text
    }
  }
}
