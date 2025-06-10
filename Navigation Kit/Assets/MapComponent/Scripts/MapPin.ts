import {CancelFunction} from "SpectaclesInteractionKit.lspkg/Utils/animate"
import Event from "SpectaclesInteractionKit.lspkg/Utils/Event"
import {Place} from "SpectaclesNavigationKit.lspkg/NavigationDataComponent/Place"
import {easeOutElastic, makeTween} from "./MapUtils"

let pinAvailableID = 0
const HIGHLIGHT_TWEEN_DURATION = 1
const LABEL_BOUNDARY_PADDING = 4
const LABEL_CIRCLE_BOUNDARY_PADDING = 4

export class MapPin {
  private readonly highlightedColor: vec4
  private readonly selectedColor: vec4
  private isUser: boolean
  private _selected: boolean = false
  sceneObject: SceneObject
  screenTransform: ScreenTransform
  place: Place
  imageComponent: Image
  outlineImageComponent: Image = undefined
  outlineTransform: Transform = undefined
  selectedImageComponent: Image = undefined
  selectedTransform: Transform = undefined
  label: Text = undefined
  tweenCancelFunction: CancelFunction
  canBeMoved: boolean

  private selectedEvent = new Event<void>()
  public onSelected = this.selectedEvent.publicApi()

  public get selected(): boolean {
    return this._selected
  }

  public set selected(value: boolean) {
    this.selectedTransform.getSceneObject().enabled = value
    this._selected = value
    this.selectedEvent.invoke()
  }

  static makeMapPin(
    prefab: ObjectPrefab,
    parent: SceneObject,
    place: Place | null,
    renderConfig: MapPinRenderConfig,
    isUser = false,
  ): MapPin {
    const pin = new MapPin()
    pin.isUser = isUser
    pin.sceneObject = prefab.instantiate(parent)
    pin.screenTransform = pin.sceneObject.getComponent("Component.ScreenTransform")
    pin.place = place

    pin.canBeMoved = place.requestNewGeoPosition(place.getGeoPosition())

    //Sets right render layers to all the objects in the map pin hierarchy
    pin.sceneObject.layer = renderConfig.layer
    pin.imageComponent = pin.sceneObject.getComponent("Component.Image")
    if (pin.imageComponent) {
      pin.imageComponent.setRenderOrder(renderConfig.renderOrder + 3)
    }

    if (pin.sceneObject.getChildrenCount() > 0) {
      const outlineObject = pin.sceneObject.getChild(0)
      pin.outlineTransform = outlineObject.getTransform()
      pin.outlineImageComponent = outlineObject.getComponent("Component.Image")
    }

    if (pin.sceneObject.getChildrenCount() > 1) {
      const selectedObject = pin.sceneObject.getChild(1)
      pin.selectedTransform = selectedObject.getTransform()
      pin.selectedImageComponent = selectedObject.getComponent("Component.Image")
    }

    for (let i = 0; i < pin.sceneObject.getChildrenCount(); i++) {
      const child = pin.sceneObject.getChild(i)
      child.layer = renderConfig.layer
      const imageComponent = child.getComponent("Image")
      if (imageComponent) {
        imageComponent.setRenderOrder(renderConfig.renderOrder + 2)
      }
    }

    if (pin.sceneObject.getChildrenCount() > 2) {
      pin.label = pin.sceneObject.getChild(2).getComponent("Component.Text")
      pin.label.setRenderOrder(renderConfig.renderOrder + 2)
    }

    return pin
  }

  updateRenderBound(topLeftCorner: vec3, topLeftToBottomLeft: vec3, topLeftToTopRight: vec3): void {
    this.setImageSize(this.imageComponent, topLeftCorner, topLeftToBottomLeft, topLeftToTopRight)
    this.setImageSize(this.outlineImageComponent, topLeftCorner, topLeftToBottomLeft, topLeftToTopRight)
    this.setImageSize(this.selectedImageComponent, topLeftCorner, topLeftToBottomLeft, topLeftToTopRight)
    if (this.label !== undefined) {
      const worldPosition = this.screenTransform.getTransform().getWorldPosition()
      const leftPadding = topLeftToTopRight.normalize().uniformScale(LABEL_BOUNDARY_PADDING)
      const topPadding = topLeftToBottomLeft.normalize().uniformScale(LABEL_BOUNDARY_PADDING)
      const fromCorner = worldPosition.sub(topLeftCorner.add(leftPadding).add(topPadding))
      const paddedVertical = topLeftToBottomLeft.sub(topPadding)
      const paddedHorizontal = topLeftToTopRight.sub(leftPadding.uniformScale(2))
      const dotVerticalVector = paddedVertical.dot(paddedVertical)
      const dotVerticalFromCorner = fromCorner.dot(paddedVertical)
      const dotHorizontalFromCorner = fromCorner.dot(paddedHorizontal)
      const dotHorizontalVector = paddedHorizontal.dot(paddedHorizontal)
      if (
        Math.min(
          dotVerticalVector > dotVerticalFromCorner ? 1 : 0,
          dotVerticalFromCorner,
          dotHorizontalVector > dotHorizontalFromCorner ? 1 : 0,
          dotHorizontalFromCorner,
        ) <= 0
      ) {
        this.label.backgroundSettings.enabled = false
        this.label.sceneObject.enabled = false
      } else {
        this.label.backgroundSettings.enabled = true
        this.label.sceneObject.enabled = true
      }
    }
  }

  updateCircularRenderBound(center: vec3): void {
    const veryOutOfCircle = this.screenTransform.position.length > 9
    this.imageComponent.mainMaterial.mainPass.circleBoundCentre = center
    if (this.outlineImageComponent !== undefined) {
      this.outlineImageComponent.enabled = veryOutOfCircle || this.isUser
      this.outlineImageComponent.mainMaterial.mainPass.circleBoundCentre = center
    }
    if (this.selectedImageComponent !== undefined) {
      this.selectedImageComponent.enabled = !veryOutOfCircle
      this.selectedImageComponent.mainMaterial.mainPass.circleBoundCentre = center
    }
    if (this.label !== undefined) {
      const outOfCircle =
        this.screenTransform.position.add(this.label.getTransform().getLocalPosition()).length >
        LABEL_CIRCLE_BOUNDARY_PADDING
      this.label.sceneObject.enabled = !veryOutOfCircle
      this.label.backgroundSettings.enabled = !outOfCircle
    }
  }

  setName(name: string): void {
    this.sceneObject.name = name
    if (this.label !== undefined) {
      this.label.text = name
    }
  }

  toggleMiniMap(isMiniMap: boolean): void {
    this.imageComponent.mainMaterial.mainPass.isMini = isMiniMap
    if (!isNull(this.outlineImageComponent)) {
      this.outlineImageComponent.mainMaterial.mainPass.isMini = isMiniMap
    }
  }

  enableOutline(enabled: boolean): void {
    if (this.outlineTransform === undefined) {
      return
    }
    this.outlineTransform.getSceneObject().enabled = enabled
  }

  highlight(): void {
    if (this.outlineTransform === undefined) {
      return
    }
    if (this.tweenCancelFunction !== undefined) {
      this.tweenCancelFunction()
      this.tweenCancelFunction = undefined
    }

    this.enableOutline(true)

    this.tweenCancelFunction = makeTween((t) => {
      const easeOutNumber = easeOutElastic(t)
      this.outlineTransform.setLocalScale(new vec3(easeOutNumber, easeOutNumber, easeOutNumber))
      this.selectedTransform.setLocalScale(new vec3(easeOutNumber, easeOutNumber, easeOutNumber))
    }, HIGHLIGHT_TWEEN_DURATION)
  }

  setVisible(visible: boolean): void {
    this.sceneObject.enabled = visible
  }

  private setImageSize(image: Image, topLeftCorner: vec3, topLeftToBottomLeft: vec3, topLeftToTopRight: vec3): void {
    if (isNull(image)) {
      return
    }

    image.mainMaterial.mainPass.cornerPosition = topLeftCorner
    image.mainMaterial.mainPass.verticalVector = topLeftToBottomLeft
    image.mainMaterial.mainPass.horizontalVector = topLeftToTopRight
  }
}

export class MapPinRenderConfig {
  public readonly layer: LayerSet
  public readonly renderOrder: number
  public readonly highlightColor: vec4
  public readonly selectedColor: vec4

  constructor(layer: LayerSet, renderOrder: number, highlightColor: vec4, selectedColor: vec4) {
    this.layer = layer
    this.renderOrder = renderOrder
    this.highlightColor = highlightColor
    this.selectedColor = selectedColor
  }
}
