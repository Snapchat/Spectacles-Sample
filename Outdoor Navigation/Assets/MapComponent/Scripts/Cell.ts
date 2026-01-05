import {CancelFunction} from "SpectaclesInteractionKit.lspkg/Utils/animate"
import Event from "SpectaclesInteractionKit.lspkg/Utils/Event"
import NativeLogger from "SpectaclesInteractionKit.lspkg/Utils/NativeLogger"
import {TWEEN_DURATION} from "../../Scripts/MapUIController"
import {makeTween} from "./MapUtils"

const FULL_CIRCLE_BOUND_RADIUS = 15
const HALF_CIRCLE_BOUND_RADIUS = 7.5

export type TileViewEvent = {
  horizontalIndex: number
  verticalIndex: number
}

const TAG = "[Cell]"
const log = new NativeLogger(TAG)

export class Cell {
  renderLayer: LayerSet = null
  horizontalIndex: number = -Infinity
  verticalIndex: number = -Infinity
  screenTransform: ScreenTransform = null
  imageComponent: Image = null
  sceneObject: SceneObject = null
  textureProvider: MapTextureProvider
  initialPositionLocationAsset: LocationAsset

  private lastHorizontalIndex
  private lastVerticalIndex

  private tweenCancelFunction: CancelFunction

  private onTileWentOutOfViewEvent = new Event<TileViewEvent>()
  public onTileWentOutOfView = this.onTileWentOutOfViewEvent.publicApi()
  private onTileCameIntoViewEvent = new Event<TileViewEvent>()
  public onTileCameIntoView = this.onTileCameIntoViewEvent.publicApi()

  static makeCell(initialPositionLocationAsset: LocationAsset): Cell {
    const cell = new Cell()
    cell.initialPositionLocationAsset = initialPositionLocationAsset
    return cell
  }

  onScreenPositionChanged() {
    // Fired when scrolled or the bounds change size
    // Update any materials used for masking
  }

  onZoomChanged(initialPositionLocationAsset: LocationAsset): void {
    this.initialPositionLocationAsset = initialPositionLocationAsset
  }

  onDataChanged(): void {
    //Checking if new map tiles came into the view / left the view
    if (this.lastHorizontalIndex !== undefined && this.lastVerticalIndex !== undefined) {
      if (this.horizontalIndex != this.lastHorizontalIndex || this.verticalIndex != this.lastVerticalIndex) {
        this.onTileWentOutOfViewEvent.invoke({
          horizontalIndex: this.lastHorizontalIndex,
          verticalIndex: this.lastVerticalIndex
        })
        this.onTileCameIntoViewEvent.invoke({
          horizontalIndex: this.horizontalIndex,
          verticalIndex: this.verticalIndex
        })
        this.lastHorizontalIndex = this.horizontalIndex
        this.lastVerticalIndex = this.verticalIndex
      }
    } else {
      this.onTileCameIntoViewEvent.invoke({
        horizontalIndex: this.horizontalIndex,
        verticalIndex: this.verticalIndex
      })
      this.lastHorizontalIndex = this.horizontalIndex
      this.lastVerticalIndex = this.verticalIndex
    }

    // Fired when the index (or other properties change))
    this.textureProvider.location = this.initialPositionLocationAsset.adjacentTile(
      this.horizontalIndex,
      this.verticalIndex,
      0.0
    )
  }

  toggleMiniMap(isMiniMap: boolean, isAnimated: boolean = true) {
    if (this.tweenCancelFunction !== undefined) {
      this.tweenCancelFunction()
      this.tweenCancelFunction = undefined
    }

    if (isMiniMap) {
      this.imageComponent.mainMaterial.mainPass.isMini = true

      if (isAnimated) {
        this.tweenCancelFunction = makeTween((t) => {
          this.imageComponent.mainMaterial.mainPass.circleBoundRadius = MathUtils.lerp(
            FULL_CIRCLE_BOUND_RADIUS,
            HALF_CIRCLE_BOUND_RADIUS,
            t
          )
        }, TWEEN_DURATION)
      } else {
        this.imageComponent.mainMaterial.mainPass.circleBoundRadius = HALF_CIRCLE_BOUND_RADIUS
      }
    } else {
      if (isAnimated) {
        this.tweenCancelFunction = makeTween((t) => {
          this.imageComponent.mainMaterial.mainPass.circleBoundRadius = MathUtils.lerp(
            HALF_CIRCLE_BOUND_RADIUS,
            FULL_CIRCLE_BOUND_RADIUS,
            t
          )
          if (t > 0.99999) {
            this.imageComponent.mainMaterial.mainPass.isMini = false
          }
        }, TWEEN_DURATION)
      } else {
        this.imageComponent.mainMaterial.mainPass.circleBoundRadius = FULL_CIRCLE_BOUND_RADIUS
      }
    }
  }

  updateRenderBound(topLeftCorner: vec3, topLeftToBottomLeft: vec3, topLeftToTopRight: vec3) {
    this.imageComponent.mainMaterial.mainPass.cornerPosition = topLeftCorner
    this.imageComponent.mainMaterial.mainPass.verticalVector = topLeftToBottomLeft
    this.imageComponent.mainMaterial.mainPass.horizontalVector = topLeftToTopRight
  }

  updateCircularRenderBound(center: vec3) {
    this.imageComponent.mainMaterial.mainPass.circleBoundCentre = center
  }

  onTapped() {}

  onShouldDestroy() {
    // Fired when a cell is no longer needed (i.e. the bounds became smaller)
    this.screenTransform.getSceneObject().destroy()
  }

  onEnabled() {
    // Fired when a cell is in range
  }

  onDisabled() {
    // Fired when a cell is out of range
  }

  retryTextureLoading() {
    const locationAsset = this.textureProvider.location
    log.e(`Cell ${locationAsset.name} retrying texture loading`)

    this.textureProvider.location = null
    this.textureProvider.location = locationAsset
  }
}
