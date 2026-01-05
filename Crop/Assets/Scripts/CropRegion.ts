import {CameraService} from "./CameraService"

@component
export class CropRegion extends BaseScriptComponent {
  @input cameraService: CameraService
  @input screenCropTexture: Texture
  @input pointsToTrack: SceneObject[]

  private isEditor = global.deviceInfoSystem.isEditor()
  private cropProvider = null

  private transformsToTrack = []

  onAwake() {
    this.cropProvider = this.screenCropTexture.control as CameraTextureProvider
    for (let i = 0; i < this.pointsToTrack.length; i++) {
      this.transformsToTrack.push(this.pointsToTrack[i].getTransform())
    }

    if (this.transformsToTrack.length < 1) {
      print("No points to track!")
      return
    }
    this.createEvent("UpdateEvent").bind(this.update.bind(this))
  }

  update() {
    const imagePoints = []
    for (let i = 0; i < this.transformsToTrack.length; i++) {
      let imagePos = vec2.zero()
      if (this.isEditor) {
        imagePos = this.cameraService.WorldToEditorCameraSpace(this.transformsToTrack[i].getWorldPosition())
      } else {
        imagePos = this.cameraService.WorldToTrackingRightCameraSpace(this.transformsToTrack[i].getWorldPosition())
      }

      const isTrackingPoint = Math.abs(imagePos.x) <= 1 && Math.abs(imagePos.y) <= 1
      imagePoints.push(imagePos)
      if (!isTrackingPoint) {
        this.cropProvider.cropRect = Rect.create(-1, 1, -1, 1)
        return
      }
    }
    this.OnTrackingUpdated(imagePoints)
  }

  OnTrackingUpdated(imagePoints) {
    let min_x = Infinity,
      max_x = -Infinity,
      min_y = Infinity,
      max_y = -Infinity
    //find max and min points
    for (let i = 0; i < imagePoints.length; i++) {
      //in range -1 to 1
      const imagePoint = imagePoints[i]
      if (imagePoint.x < min_x) min_x = imagePoint.x
      if (imagePoint.x > max_x) max_x = imagePoint.x
      if (imagePoint.y < min_y) min_y = imagePoint.y
      if (imagePoint.y > max_y) max_y = imagePoint.y
    }
    const center = new vec2(min_x + max_x, min_y + max_y).uniformScale(0.5)
    const size = new vec2(max_x - min_x, max_y - min_y)
    const cropRect = this.cropProvider.cropRect
    cropRect.setCenter(center)
    cropRect.setSize(size)
    this.cropProvider.cropRect = cropRect
  }

  clamp(value, min, max) {
    return Math.min(Math.max(value, min), max)
  }

  Remap(value, low1, high1, low2, high2) {
    return low2 + ((high2 - low2) * (value - low1)) / (high1 - low1)
  }
}
