import {ContainerMover} from "MapComponent/ContainerMover"
import {HeadDirectionLerper} from "MapComponent/Scripts/HeadDirectionLerper"
import {MapComponent} from "MapComponent/Scripts/MapComponent"
import {Interactable} from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable"
import {ContainerFrame} from "SpectaclesInteractionKit.lspkg/Components/UI/ContainerFrame/ContainerFrame"
import {PinchButton} from "SpectaclesInteractionKit.lspkg/Components/UI/PinchButton/PinchButton"
import Event from "SpectaclesInteractionKit.lspkg/Utils/Event"
import {makeTween} from "SpectaclesNavigationKit.lspkg/NavigationDataComponent/NavigationUtils"
import {CustomLocationPlacesImageDisplay} from "./CustomLocationPlacesImageDisplay"
import {delayAFrame} from "./DelayAFrame"

export const TWEEN_DURATION = 0.3

/**
 * This script manages the minimization and maximization of the main panel in the scene.
 */
@component
export class PanelManager extends BaseScriptComponent {
  private originalParent: SceneObject
  private mapInternalOffset: vec3
  private mapIsSmall = true
  private blockMaximize = false
  private scrollRootDefaultPosition: vec3
  private minimizeButtonDefaultPosition: vec3
  private baseScale: vec3

  @input private panelRoot: SceneObject
  @input private panelContainer: ContainerFrame
  @input private panelMover: ContainerMover
  @input private disableForMini: SceneObject[]
  @input private mapComponent: MapComponent
  @input private minimizedRoot: SceneObject
  @input private mapInteractables: Interactable[]
  @input private minimizeButton: PinchButton
  @input private imageDisplay: CustomLocationPlacesImageDisplay
  @input private headDirectionLerper: HeadDirectionLerper

  @input private defaultLayer: SceneObject
  @input private orthographicLayer: SceneObject
  @input private mapContents: SceneObject[]
  @input private scrollRoot: SceneObject
  @input private noMapHamburger: SceneObject

  private minimizedEvent = new Event<boolean>()
  public onMinimized = this.minimizedEvent.publicApi()
  private transitionEvent = new Event<boolean>()
  public onTransitionStarted = this.transitionEvent.publicApi()

  public isMinimized = false
  public minimizedScale = -1

  private onAwake(): void {
    this.createEvent("OnStartEvent").bind(() => {
      this.start()
    })
  }

  private start(): void {
    this.originalParent = this.panelRoot.getParent()

    this.mapInteractables.forEach((m) => {
      m.onTriggerStart.add(() => {
        this.blockMaximize = false
      })
      m.onDragStart(() => {
        this.blockMaximize = true
      })
      m.onTriggerEnd.add(() => {
        if (this.isMinimized && !this.blockMaximize) {
          this.setMinimized(false)
        }
      })
    })
    this.minimizeButton.onButtonPinched.add(() => {
      this.setMinimized(true)
    })
    this.imageDisplay.onPromptAvailable.add((place) => {
      if (isNull(place)) {
        this.imageDisplay.setVisible(false)
      }
    })
    this.imageDisplay.onIsVisible.add(() => {
      this.adjustSize(false)
    })

    this.scrollRootDefaultPosition = this.scrollRoot.getTransform().getLocalPosition()
    this.minimizeButtonDefaultPosition = this.minimizeButton.getTransform().getLocalPosition()
    this.headDirectionLerper.enabled = false
    this.noMapHamburger.enabled = false
    this.mapComponent.onMiniMapToggled.add((toggle) => (this.mapIsSmall = toggle.isMini))
    this.mapComponent.onUserPositionSet.add(() => {
      this.adjustSize()
    })
    this.mapInternalOffset = this.mapComponent.getTransform().getLocalPosition()
    this.mapComponent.centerMap()
    this.adjustSize()
    this.baseScale = this.panelRoot.getTransform().getLocalScale()
  }

  public async setMinimized(minimized: boolean, instantly: boolean = false): Promise<void> {
    if (minimized) {
      this.transitionEvent.invoke(true)
      this.panelRoot.setParentPreserveWorldTransform(this.minimizedRoot)
      if (!this.mapIsSmall) {
        this.mapComponent.toggleMiniMap(true, false)
      }

      await delayAFrame()
      await delayAFrame()

      this.panelMover.setMoveable(false, false)
      this.panelContainer.allowTranslation = false
      this.panelContainer.getTransform().setLocalRotation(quat.quatIdentity())
      this.tweenToLocal(this.mapComponent.getTransform(), vec3.zero(), instantly)
      this.imageDisplay.setVisible(false)
      this.panelContainer.hideVisual()
      this.mapComponent.showButtons(false)
      this.mapComponent.toggleMiniMap(true, false)
      this.mapComponent.centerMap()

      this.disableForMini.forEach((element) => {
        element.enabled = false
      })
      await this.tweenToLocal(this.panelContainer.getTransform(), vec3.zero(), instantly)
      this.headDirectionLerper.enabled = true
      this.headDirectionLerper.setCurrent()
      this.noMapHamburger.enabled = !this.mapComponent.isInitialized
      if (this.minimizedScale > 0) {
        this.panelRoot.getTransform().setLocalScale(this.baseScale.uniformScale(this.minimizedScale))
      }

      this.setLayer(this.orthographicLayer.layer)
    } else {
      this.transitionEvent.invoke(false)
      await delayAFrame()
      await this.tweenToWorld(this.panelMover.getTransform(), this.panelMover.targetWorldPosition, instantly)
      await delayAFrame()
      this.panelMover.setMoveable(false, true)
      this.panelRoot.setParentPreserveWorldTransform(this.originalParent)
      this.panelMover.containerYOffset = 0
      this.panelContainer.allowTranslation = true
      this.panelContainer.showVisual()
      this.mapComponent.showButtons(true)
      this.mapComponent.toggleMiniMap(false, true)
      this.mapComponent.getTransform().setLocalPosition(this.mapInternalOffset)
      this.imageDisplay.setVisible(false)

      this.noMapHamburger.enabled = false
      this.headDirectionLerper.enabled = false
      this.headDirectionLerper.getTransform().setLocalRotation(quat.quatIdentity())
      this.disableForMini.forEach((element) => {
        element.enabled = true
      })
      this.setLayer(this.defaultLayer.layer)
      this.panelRoot.getTransform().setLocalScale(this.baseScale)
    }
    this.isMinimized = minimized
    this.minimizedEvent.invoke(minimized)
  }

  private setLayer(layer: LayerSet): void {
    this.setLayerRecursive(this.panelRoot, layer)
  }

  private setLayerRecursive(sceneObject: SceneObject, layer: LayerSet) {
    sceneObject.layer = layer
    sceneObject.children.forEach((c) => this.setLayerRecursive(c, layer))
  }

  private async tweenToLocal(transform: Transform, newLocalPosition: vec3, instantly: boolean = false): Promise<void> {
    const startPosition = transform.getLocalPosition()

    if (instantly) {
      transform.setLocalPosition(newLocalPosition)
      return
    }

    return new Promise((resolve) => {
      makeTween((t) => {
        transform.setLocalPosition(vec3.lerp(startPosition, newLocalPosition, t))

        if (t > 0.99999) {
          resolve()
        }
      }, TWEEN_DURATION)
    })
  }

  private async tweenToWorld(transform: Transform, newWorldPosition: vec3, instantly: boolean = false): Promise<void> {
    const startPosition = transform.getWorldPosition()

    if (instantly) {
      transform.setWorldPosition(newWorldPosition)
      return
    }

    return new Promise((resolve) => {
      makeTween((t) => {
        transform.setWorldPosition(vec3.lerp(startPosition, newWorldPosition, t))

        if (t > 0.99999) {
          resolve()
        }
      }, TWEEN_DURATION)
    })
  }

  private adjustSize(withEnable = true): void {
    if (this.mapComponent.isInitialized || this.imageDisplay.visible) {
      this.panelContainer.innerSize = new vec2(40, 15)
      if (withEnable) {
        this.mapContents.forEach((c) => {
          c.enabled = true
        })
        this.mapComponent.showButtons(true)
      }
      this.scrollRoot.getTransform().setLocalPosition(this.scrollRootDefaultPosition)
      this.minimizeButton.getTransform().setLocalPosition(this.minimizeButtonDefaultPosition)
    } else {
      this.panelContainer.innerSize = new vec2(18, 15)
      if (withEnable) {
        this.mapContents.forEach((c) => {
          c.enabled = false
        })
        this.mapComponent.showButtons(false)
      }
      this.scrollRoot.getTransform().setLocalPosition(vec3.zero())
      const newMinimizeButtonPosition = new vec3(
        -12,
        this.minimizeButtonDefaultPosition.y,
        this.minimizeButtonDefaultPosition.z,
      )
      this.minimizeButton.getTransform().setLocalPosition(newMinimizeButtonPosition)
    }
  }
}
