import {MapPin} from "./MapPin"

export class QuestMarker {
  mapPin: MapPin
  transform: Transform
  markerLabel: Text
  distanceText: Text
  imageComponent: Image

  constructor(mapPin: MapPin, transform: Transform, scale: number) {
    this.mapPin = mapPin
    this.transform = transform
    this.transform.setLocalScale(new vec3(scale, scale, scale))
    this.markerLabel = transform.getSceneObject().getChild(0).getComponent("Text")
    if (mapPin.placeInfo !== undefined) {
      this.markerLabel.text = mapPin.placeInfo.name
    } else {
      this.markerLabel.text = mapPin.sceneObject.name
    }

    this.distanceText = transform.getSceneObject().getChild(1).getComponent("Text")
    this.imageComponent = transform.getSceneObject().getChild(2).getComponent("Image")
  }

  setIsInView(isInView: boolean, inViewMaterial: Material, outOfViewMaterial: Material): void {
    if (isInView) {
      this.imageComponent.mainMaterial = inViewMaterial
      this.markerLabel.textFill.color = new vec4(1, 1, 1, 1)
      this.distanceText.textFill.color = new vec4(1, 1, 1, 1)
    } else {
      this.imageComponent.mainMaterial = outOfViewMaterial
      this.markerLabel.textFill.color = new vec4(1, 1, 1, 1)
      this.distanceText.textFill.color = new vec4(1, 1, 1, 1)
    }
  }

  setDistance(distance: number): void {
    this.distanceText.text = `${distance.toFixed(0)}m`
  }

  setOrientation(orientation: number): void {
    this.imageComponent.getTransform().setLocalRotation(quat.fromEulerAngles(0, 0, orientation))
  }
}
