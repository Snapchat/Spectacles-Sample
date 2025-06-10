import {PinchButton} from "SpectaclesInteractionKit.lspkg/Components/UI/PinchButton/PinchButton"
import {ToggleButton} from "SpectaclesInteractionKit.lspkg/Components/UI/ToggleButton/ToggleButton"
import {InteractorEvent} from "SpectaclesInteractionKit.lspkg/Core/Interactor/InteractorEvent"
import {CancelFunction} from "SpectaclesInteractionKit.lspkg/Utils/animate"
import NativeLogger from "SpectaclesInteractionKit.lspkg/Utils/NativeLogger"
import {MapComponent} from "../MapComponent/Scripts/MapComponent"
import {makeTween} from "../MapComponent/Scripts/MapUtils"

export const TWEEN_DURATION = 0.3
const ZOOM_IN_BUTTON_OFFSET_MINI = new vec3(7, -9.5, 2)
const ZOOM_IN_BUTTON_OFFSET_FULL = new vec3(22.8488, -32, 2)
const ZOOM_OUT_BUTTON_OFFSET_MINI = new vec3(-7, -9.5, 2)
const ZOOM_OUT_BUTTON_OFFSET_FULL = new vec3(17.5945, -32, 2)
const CENTER_MAP_BUTTON_OFFSET_MINI = new vec3(0, -10, 2)
const CENTER_MAP_BUTTON_OFFSET_FULL = new vec3(9, -32, 2)
const TOGGLE_BUTTON_OFFSET_MINI = new vec3(-10, 10.5, 2)
const TOGGLE_BUTTON_OFFSET_FULL = new vec3(-31, 32, 2)

enum ButtonType {
  SPAWN_PIN,
  CLEAR_PINS,
  ZOOM_IN,
  ZOOM_OUT,
  CENTER_MAP,
  TOGGLE_MINI_MAP,
  SHOW_CAFE,
  SHOW_BARS,
  SHOW_RESTAURANTS,
}

const TAG = "[MapUIController]"
const log = new NativeLogger(TAG)

@component
export class MapUIController extends BaseScriptComponent {
  @input
  private mapComponent: MapComponent

  @input
  private spawnPinButton: PinchButton
  private spawnPinButtonEnabled: boolean
  @input
  private clearPinsButton: PinchButton
  private clearPinsButtonEnabled: boolean
  @input
  private zoomInButton: PinchButton
  private zoomInButtonEnabled: boolean
  @input
  private zoomOutButton: PinchButton
  private zoomOutButtonEnabled: boolean
  @input
  private centerMapButton: PinchButton
  private centerMapButtonEnabled: boolean

  @input
  private toggleMiniMapButton: ToggleButton
  private toggleMiniMapButtonEnabled: boolean

  @input
  private showRestaurantsButton: PinchButton
  private showRestaurantsButtonEnabled: boolean
  @input
  private showCafeButton: PinchButton
  private showCafeButtonEnabled: boolean
  @input
  private showBarsButton: PinchButton
  private showBarsButtonEnabled: boolean

  // For debugging
  @input
  @allowUndefined
  private logObject: SceneObject

  private buttonTransforms: Transform[]

  private isMiniMap: boolean = true

  private tweenCancelFunction: CancelFunction

  onAwake() {
    this.createEvent("OnStartEvent").bind(this.onStart.bind(this))
  }

  private onStart() {
    if (this.spawnPinButton.sceneObject.enabled) {
      this.spawnPinButton.onButtonPinched.add(this.handleSpawnPinButtonPinched.bind(this))
    }
    this.spawnPinButtonEnabled = this.spawnPinButton.sceneObject.enabled
    if (this.clearPinsButton.sceneObject.enabled) {
      this.clearPinsButton.onButtonPinched.add(this.handleClearPinsButtonPinched.bind(this))
    }
    this.clearPinsButtonEnabled = this.clearPinsButton.sceneObject.enabled
    if (this.zoomInButton.sceneObject.enabled) {
      this.zoomInButton.onButtonPinched.add(this.handleZoomInButtonPinched.bind(this))
    }
    this.zoomInButtonEnabled = this.zoomInButton.sceneObject.enabled
    if (this.zoomOutButton.sceneObject.enabled) {
      this.zoomOutButton.onButtonPinched.add(this.handleZoomOutButtonPinched.bind(this))
    }
    this.zoomOutButtonEnabled = this.zoomOutButton.sceneObject.enabled
    if (this.centerMapButton.sceneObject.enabled) {
      this.centerMapButton.onButtonPinched.add(() => this.mapComponent.centerMap())
    }
    this.centerMapButtonEnabled = this.centerMapButton.sceneObject.enabled
    if (this.toggleMiniMapButton.sceneObject.enabled) {
      this.toggleMiniMapButton.onStateChanged.add(this.handleToggleMiniMapButtonPinched.bind(this))
    }
    this.toggleMiniMapButtonEnabled = this.toggleMiniMapButton.sceneObject.enabled

    this.mapComponent.onMiniMapToggled.add((toggled) => {
      this.isMiniMap = toggled.isMini
      this.toggleMiniMapButton.isToggledOn = toggled.isMini
      // this.moveButtons(toggled.isMini, toggled.happensInstantly)
    })

    // Should have the same order as the ButtonType enum
    this.buttonTransforms = [
      this.spawnPinButton.getTransform(),
      this.clearPinsButton.getTransform(),
      this.zoomInButton.getTransform(),
      this.zoomOutButton.getTransform(),
      this.centerMapButton.getTransform(),
      this.toggleMiniMapButton.getTransform(),
      this.showCafeButton.getTransform(),
      this.showBarsButton.getTransform(),
      this.showRestaurantsButton.getTransform(),
    ]

    if (this.logObject !== undefined) {
      this.buttonTransforms.push(this.logObject.getTransform())
    }

    if (this.isMiniMap) {
      this.spawnPinButton.sceneObject.enabled = this.spawnPinButtonEnabled
      this.clearPinsButton.sceneObject.enabled = this.clearPinsButtonEnabled
      this.showCafeButton.sceneObject.enabled = this.showCafeButtonEnabled
      this.showBarsButton.sceneObject.enabled = this.showBarsButtonEnabled
      this.showRestaurantsButton.sceneObject.enabled = this.showRestaurantsButtonEnabled
    }
  }

  private handleSpawnPinButtonPinched(event: InteractorEvent) {
    this.mapComponent.addPinByLocalPosition(vec2.zero())
  }

  private handleClearPinsButtonPinched(event: InteractorEvent) {
    this.mapComponent.removeMapPins()
  }

  private handleZoomInButtonPinched(event: InteractorEvent) {
    this.mapComponent.zoomIn()
  }

  private handleZoomOutButtonPinched(event: InteractorEvent) {
    this.mapComponent.zoomOut()
  }

  private handleToggleMiniMapButtonPinched(isOn: boolean) {
    if (this.isMiniMap === isOn) {
      return
    }

    log.i("Toggling minimap " + isOn)

    if (this.tweenCancelFunction !== undefined) {
      this.tweenCancelFunction()
      this.tweenCancelFunction = undefined
    }
    this.mapComponent.toggleMiniMap(isOn)

    // this.moveButtons(isOn, false)
  }

  private moveButtons(isMini: boolean, happensInstantly: boolean) {
    if (happensInstantly) {
      this.setFinalState(isMini)
      this.isMiniMap = isMini
      return
    }

    if (isMini) {
      this.spawnPinButton.sceneObject.enabled = this.spawnPinButtonEnabled
      this.clearPinsButton.sceneObject.enabled = this.clearPinsButtonEnabled
      this.showCafeButton.sceneObject.enabled = this.showCafeButtonEnabled
      this.showBarsButton.sceneObject.enabled = this.showBarsButtonEnabled
      this.showRestaurantsButton.sceneObject.enabled = this.showRestaurantsButtonEnabled
      this.tweenCancelFunction = makeTween((t) => {
        this.buttonTransforms[ButtonType.ZOOM_IN].setLocalPosition(
          vec3.lerp(ZOOM_IN_BUTTON_OFFSET_FULL, ZOOM_IN_BUTTON_OFFSET_MINI, t),
        )
        this.buttonTransforms[ButtonType.ZOOM_OUT].setLocalPosition(
          vec3.lerp(ZOOM_OUT_BUTTON_OFFSET_FULL, ZOOM_OUT_BUTTON_OFFSET_MINI, t),
        )
        this.buttonTransforms[ButtonType.CENTER_MAP].setLocalPosition(
          vec3.lerp(CENTER_MAP_BUTTON_OFFSET_FULL, CENTER_MAP_BUTTON_OFFSET_MINI, t),
        )
        this.buttonTransforms[ButtonType.TOGGLE_MINI_MAP].setLocalPosition(
          vec3.lerp(TOGGLE_BUTTON_OFFSET_FULL, TOGGLE_BUTTON_OFFSET_MINI, t),
        )
      }, TWEEN_DURATION)
    } else {
      this.tweenCancelFunction = makeTween((t) => {
        this.buttonTransforms[ButtonType.ZOOM_IN].setLocalPosition(
          vec3.lerp(ZOOM_IN_BUTTON_OFFSET_MINI, ZOOM_IN_BUTTON_OFFSET_FULL, t),
        )
        this.buttonTransforms[ButtonType.ZOOM_OUT].setLocalPosition(
          vec3.lerp(ZOOM_OUT_BUTTON_OFFSET_MINI, ZOOM_OUT_BUTTON_OFFSET_FULL, t),
        )
        this.buttonTransforms[ButtonType.CENTER_MAP].setLocalPosition(
          vec3.lerp(CENTER_MAP_BUTTON_OFFSET_MINI, CENTER_MAP_BUTTON_OFFSET_FULL, t),
        )
        this.buttonTransforms[ButtonType.TOGGLE_MINI_MAP].setLocalPosition(
          vec3.lerp(TOGGLE_BUTTON_OFFSET_MINI, TOGGLE_BUTTON_OFFSET_FULL, t),
        )

        if (t > 0.99999) {
          this.spawnPinButton.sceneObject.enabled = this.spawnPinButtonEnabled
          this.clearPinsButton.sceneObject.enabled = this.clearPinsButtonEnabled
          this.showCafeButton.sceneObject.enabled = this.showCafeButtonEnabled
          this.showBarsButton.sceneObject.enabled = this.showBarsButtonEnabled
          this.showRestaurantsButton.sceneObject.enabled = this.showRestaurantsButtonEnabled
        }
      }, TWEEN_DURATION)
    }

    this.isMiniMap = isMini
  }

  private setFinalState(isOn: boolean) {
    if (isOn) {
      this.spawnPinButton.sceneObject.enabled = this.spawnPinButtonEnabled
      this.clearPinsButton.sceneObject.enabled = this.clearPinsButtonEnabled
      this.showCafeButton.sceneObject.enabled = this.showCafeButtonEnabled
      this.showBarsButton.sceneObject.enabled = this.showBarsButtonEnabled
      this.showRestaurantsButton.sceneObject.enabled = this.showRestaurantsButtonEnabled
      this.buttonTransforms[ButtonType.ZOOM_IN].setLocalPosition(ZOOM_IN_BUTTON_OFFSET_MINI)
      this.buttonTransforms[ButtonType.ZOOM_OUT].setLocalPosition(ZOOM_OUT_BUTTON_OFFSET_MINI)
      this.buttonTransforms[ButtonType.CENTER_MAP].setLocalPosition(CENTER_MAP_BUTTON_OFFSET_MINI)
      this.buttonTransforms[ButtonType.TOGGLE_MINI_MAP].setLocalPosition(TOGGLE_BUTTON_OFFSET_MINI)
    } else {
      this.spawnPinButton.sceneObject.enabled = this.spawnPinButtonEnabled
      this.clearPinsButton.sceneObject.enabled = this.clearPinsButtonEnabled
      this.showCafeButton.sceneObject.enabled = this.showCafeButtonEnabled
      this.showBarsButton.sceneObject.enabled = this.showBarsButtonEnabled
      this.showRestaurantsButton.sceneObject.enabled = this.showRestaurantsButtonEnabled
      this.buttonTransforms[ButtonType.ZOOM_IN].setLocalPosition(ZOOM_IN_BUTTON_OFFSET_FULL)
      this.buttonTransforms[ButtonType.ZOOM_OUT].setLocalPosition(ZOOM_OUT_BUTTON_OFFSET_FULL)
      this.buttonTransforms[ButtonType.CENTER_MAP].setLocalPosition(CENTER_MAP_BUTTON_OFFSET_FULL)
      this.buttonTransforms[ButtonType.TOGGLE_MINI_MAP].setLocalPosition(TOGGLE_BUTTON_OFFSET_FULL)
    }
  }
}
