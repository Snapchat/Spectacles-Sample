@component
export class CameraService extends BaseScriptComponent {
  @input editorCamera: Camera
  @input screenCropTexture: Texture
  @input
  private camModule: CameraModule

  private isEditor = global.deviceInfoSystem.isEditor()

  // Expose camera texture and provider for other scripts to use
  // This prevents multiple camera requests which cause conflicts
  private _cameraTexture: Texture
  private _cameraTextureProvider: CameraTextureProvider

  /** Get the camera texture (for encoding/capture) */
  public get cameraTexture(): Texture {
    return this._cameraTexture
  }

  /** Get the camera texture provider (for onNewFrame callbacks) */
  public get cameraTextureProvider(): CameraTextureProvider {
    return this._cameraTextureProvider
  }

  onAwake() {
    this.createEvent("OnStartEvent").bind(this.start.bind(this))
  }

  start() {
    const camID = this.isEditor ? CameraModule.CameraId.Default_Color : CameraModule.CameraId.Right_Color
    const camRequest = CameraModule.createCameraRequest()
    camRequest.cameraId = camID
    //camRequest.imageSmallerDimension = this.isEditor ? 352 : 756;

    this._cameraTexture = this.camModule.requestCamera(camRequest)
    print(`[CameraService] Camera texture: ${this._cameraTexture}`)

    this._cameraTextureProvider = this._cameraTexture.control as CameraTextureProvider

    const cropTexControl = this.screenCropTexture.control as CropTextureProvider
    cropTexControl.inputTexture = this._cameraTexture

    this._cameraTextureProvider.onNewFrame.add(() => {})

    print(`[CameraService] Camera initialized - texture available for other scripts`)
  }
}
