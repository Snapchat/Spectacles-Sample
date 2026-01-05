@component
export class CameraService extends BaseScriptComponent {
  @input editorCamera: Camera
  @input specsLeftCamera: Camera
  @input specsRightCamera: Camera
  @input screenCropTexture: Texture
  @input deviceCamTexture: Texture

  private isEditor = global.deviceInfoSystem.isEditor()
  private camTexture = null
  private cropProvider = null
  private camModule: CameraModule = require("LensStudio:CameraModule") as CameraModule

  onAwake() {
    this.createEvent("OnStartEvent").bind(this.start.bind(this))
  }

  start() {
    const camID = this.isEditor ? CameraModule.CameraId.Default_Color : CameraModule.CameraId.Right_Color
    const camRequest = CameraModule.createCameraRequest()
    camRequest.cameraId = camID
    camRequest.imageSmallerDimension = this.isEditor ? 352 : 756
    this.camTexture = this.camModule.requestCamera(camRequest)
    const camTexControl = this.camTexture.control as CameraTextureProvider
    camTexControl.onNewFrame.add(() => {})
    this.cropProvider = this.screenCropTexture.control as CameraTextureProvider
    this.cropProvider.inputTexture = this.camTexture

    this.cropProvider
    if (this.isEditor) {
      return
    }
    const leftTrackingCamera = global.deviceInfoSystem.getTrackingCameraForId(camID)
    const rightTrackingCamera = global.deviceInfoSystem.getTrackingCameraForId(CameraModule.CameraId.Right_Color)
    this.SetUpVirtualCamera(this.specsLeftCamera, leftTrackingCamera)
    this.SetUpVirtualCamera(this.specsRightCamera, rightTrackingCamera)
  }

  SetUpVirtualCamera(camComp, trackingCam) {
    //set pose
    const camTrans = camComp.getSceneObject().getTransform()
    camTrans.setLocalTransform(trackingCam.pose)
    //set intrinsics
    const aspect = trackingCam.resolution.x / trackingCam.resolution.y
    camComp.aspect = aspect
    const avgFocalLengthPixels = (trackingCam.focalLength.x + trackingCam.focalLength.y) / 2
    const fovRadians = 2 * Math.atan(trackingCam.resolution.y / 2 / avgFocalLengthPixels)
    camComp.fov = fovRadians
  }

  WorldToEditorCameraSpace(worldPos) {
    return this.CameraToScreenSpace(this.editorCamera, worldPos)
  }

  WorldToTrackingLeftCameraSpace(worldPos) {
    return this.CameraToScreenSpace(this.specsLeftCamera, worldPos)
  }

  WorldToTrackingRightCameraSpace(worldPos) {
    return this.CameraToScreenSpace(this.specsRightCamera, worldPos)
  }

  CameraToScreenSpace(camComp, worldPos) {
    const screenPoint = camComp.worldSpaceToScreenSpace(worldPos)
    const localX = this.Remap(screenPoint.x, 0, 1, -1, 1)
    const localY = this.Remap(screenPoint.y, 1, 0, -1, 1)
    return new vec2(localX, localY)
  }

  Remap(value, low1, high1, low2, high2) {
    return low2 + ((high2 - low2) * (value - low1)) / (high1 - low1)
  }
}
