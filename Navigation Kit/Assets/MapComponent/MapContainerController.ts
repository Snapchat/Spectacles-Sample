import {MapToggledNotification} from "MapComponent/Scripts/MapComponent"
import {ContainerFrame} from "SpectaclesInteractionKit.lspkg/Components/UI/ContainerFrame/ContainerFrame"
import WorldCameraFinderProvider from "SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider"
import {CancelFunction} from "SpectaclesInteractionKit.lspkg/Utils/animate"
import {MapComponent} from "../MapComponent/Scripts/MapComponent"
import {makeTween} from "../MapComponent/Scripts/MapUtils"
import {ContainerMover} from "./ContainerMover"
import {TWEEN_DURATION} from "./MapUIController"

const CONTAINER_SIZE_MINI = new vec2(10, 10)
const CONTAINER_SIZE_FULL = new vec2(54.0, 54.0)
const CONTAINER_DISTANCE_MINI = 130
const CONTAINER_DISTANCE_FULL = 160

@component
export class MapContainerController extends BaseScriptComponent {
  private containerTransform: Transform
  private container: ContainerFrame
  private cameraTransform: Transform
  private tweenCancelFunction: CancelFunction

  @input
  private mapComponent: MapComponent
  @input
  private containerMover: ContainerMover
  @input private miniMapWidth = 0.15
  @input private maxMapWidth = 0.5

  private onAwake() {
    this.createEvent("OnStartEvent").bind(this.onStart.bind(this))
  }

  private onStart() {
    this.container = this.sceneObject.getComponent(ContainerFrame.getTypeName())

    this.container.setIsFollowing(false)

    this.cameraTransform = WorldCameraFinderProvider.getInstance().getTransform()
    this.mapComponent.onMiniMapToggled.add(this.handleMiniMapToggled.bind(this))
    this.containerTransform = this.container.parentTransform
  }

  private handleMiniMapToggled(toggle: MapToggledNotification) {
    const isMiniMap = toggle.isMini
    const tweenDuration = toggle.happensInstantly ? 0 : TWEEN_DURATION

    if (this.tweenCancelFunction !== undefined) {
      this.tweenCancelFunction()
      this.tweenCancelFunction = undefined
    }

    const containerWorldPosition: vec3 = this.containerTransform.getWorldPosition()

    if (isMiniMap) {
      this.mapComponent.centerMap()
      this.containerMover.windowWidth = this.miniMapWidth

      const targetWorldPosition: vec3 = containerWorldPosition
        .sub(this.cameraPos)
        .normalize()
        .uniformScale(CONTAINER_DISTANCE_MINI)
        .add(this.cameraPos)

      this.tweenCancelFunction = makeTween((t) => {
        this.container.innerSize = vec2.lerp(CONTAINER_SIZE_FULL, CONTAINER_SIZE_MINI, t)

        this.containerTransform.setWorldPosition(vec3.lerp(containerWorldPosition, targetWorldPosition, t))

        if (t > 0.9999) {
          this.container.setIsFollowing(true)
          this.containerMover.clampPosition()
        }
      }, tweenDuration)
    } else {
      this.container.setIsFollowing(false)
      this.containerMover.windowWidth = this.maxMapWidth

      const targetWorldPosition: vec3 = containerWorldPosition
        .sub(this.cameraPos)
        .normalize()
        .uniformScale(CONTAINER_DISTANCE_FULL)
        .add(this.cameraPos)

      this.tweenCancelFunction = makeTween((t) => {
        this.container.innerSize = vec2.lerp(CONTAINER_SIZE_MINI, CONTAINER_SIZE_FULL, t)
        this.containerTransform.setWorldPosition(vec3.lerp(containerWorldPosition, targetWorldPosition, t))
      }, TWEEN_DURATION)
    }
  }

  private get cameraPos(): vec3 {
    return this.cameraTransform.getWorldPosition()
  }
}
