import {MLController} from "./ML/MLController"
import {PinholeCameraModel} from "./PinholeCameraModel"

const KEEP_FRAMES_TIME_SECONDS = 2.0

export type CameraPoseWithTimestamp = {
  timestamp: number
  position: vec3
  rotation: quat
}

@component
export class CameraService extends BaseScriptComponent {
  @input mainCamera: Camera
  @input editorCamera: Camera
  @input debugImage: Image
  @input MLController: MLController
  @input labelRenderTarget: Texture
  @input editorRenderTexture: Texture
  @input screenCropTexture: Texture
  public cropProvider = null

  public isEditor = global.deviceInfoSystem.isEditor()
  public camTexture = null
  public updateEvent = this.createEvent("UpdateEvent")

  private viewToWorldMatrix: mat4
  public cameraModel: PinholeCameraModel
  private cameraDevice: DeviceCamera

  public cropInitialized = true
  private cameraId: CameraModule.CameraId

  public inputSize = 512

  public frameCallback = (timestamp: number) => {}

  private cameraPoseWithTimestamps: CameraPoseWithTimestamp[] = []

  private dummyTransform: Transform

  onAwake() {
    this.dummyTransform = global.scene.createSceneObject("CameraServiceTransformRef").getTransform()
    this.createEvent("OnStartEvent").bind(() => {
      //fixes a bug with device camera resolution not ready
      const delay = this.createEvent("DelayedCallbackEvent")
      delay.bind(() => {
        this.start()
      })
      delay.reset(1.0)
    })
  }

  start() {
    this.setupCamera()
    this.bindUpdate()
    this.updateEvent.bind(this.update.bind(this))
  }

  bindUpdate() {
    this.createEvent("LateUpdateEvent").bind(() => {
      this.updateCameraPoseWithTimestamp(getTime())
      if (this.isEditor) {
        this.frameCallback(getTime())
      }
    })
    if (!this.isEditor) {
      const onNewFrame = this.camTexture.control.onNewFrame
      const registration = onNewFrame.add((cameraFrame: CameraFrame) => {
        this.frameCallback(cameraFrame.timestampSeconds)
      })
    }
  }

  update() {
    if (!this.cropInitialized) {
      this.setupCropProvider()
    }
  }

  getTexture() {
    return this.screenCropTexture
  }

  setupCamera() {
    this.cropInitialized = false

    const camID = this.isEditor ? CameraModule.CameraId.Default_Color : CameraModule.CameraId.Right_Color

    this.cameraId = camID

    const camRequest = CameraModule.createCameraRequest()
    camRequest.cameraId = camID
    if (!this.isEditor) {
      camRequest.imageSmallerDimension = this.inputSize
    }
    this.cameraDevice = global.deviceInfoSystem.getTrackingCameraForId(camID)

    const camModule = require("LensStudio:CameraModule")
    this.camTexture = this.isEditor ? this.editorRenderTexture : camModule.requestCamera(camRequest)

    this.cropProvider = this.screenCropTexture.control as CameraTextureProvider
    this.cropProvider.inputTexture = this.isEditor ? this.editorRenderTexture : this.camTexture
  }

  setupCropProvider() {
    let w = this.cropProvider.inputTexture.getWidth()
    let h = this.cropProvider.inputTexture.getHeight()

    if (w > 0) {
      this.cameraModel = PinholeCameraModel.create(this.cameraDevice)
      if (this.isEditor) {
        let res = this.cameraModel.resolution
        const smallerSide = Math.min(res.x, res.y)
        const scaleFactor = this.inputSize / smallerSide
        res = res.uniformScale(scaleFactor)
        res.x = Math.floor(res.x)
        res.y = Math.floor(res.y)
        this.cameraModel = this.cameraModel.resize(res)

        this.editorCamera.aspect = this.cameraModel.aspect
        this.editorCamera.fov = this.cameraModel.fov

        w = this.cameraModel.resolution.x
        h = this.cameraModel.resolution.y

        const target = this.editorRenderTexture.control as RenderTargetProvider
        target.resolution = res
      }

      const dim = Math.min(w, h)
      const inputSize = new vec2(dim, dim)

      const imageSize = new vec2(w, h)
      const cropRect: Rect = this.cropProvider.cropRect

      const size = inputSize.div(imageSize).uniformScale(2)
      cropRect.setSize(size)

      let xCenter = imageSize.x * 0.5
      const yCenter = imageSize.y * 0.5

      if (!this.isEditor) {
        //offset to the inside of the camera to make it appear more centered
        if (this.cameraId == CameraModule.CameraId.Right_Color) {
          xCenter = Math.floor(inputSize.x * 0.5)
        } else {
          xCenter = Math.floor(imageSize.x - inputSize.x * 0.5)
        }
      }

      //normalize the crop region to [-1,+1]
      const center = new vec2(xCenter, yCenter).div(imageSize).uniformScale(2).sub(vec2.one())
      cropRect.setCenter(center)

      this.cropProvider.cropRect = cropRect

      const minCropResolution = Math.min(this.cameraModel.resolution.x, this.cameraModel.resolution.y)

      this.cropInitialized = true
      this.MLController.init()
    }
  }

  getIntrinsics() {
    return {
      fx: this.cameraModel.focalLength.x,
      fy: this.cameraModel.focalLength.y,
      cx: this.cameraModel.principalPoint.x,
      cy: this.cameraModel.principalPoint.y
    }
  }

  MainCameraPosition() {
    return this.mainCamera.getTransform().getWorldPosition()
  }

  DeviceCameraPosition() {
    return this.CaptureToWorldTransform().multiplyPoint(vec3.zero())
  }

  WorldToCaptureTransform() {
    return this.CaptureToWorldTransform().inverse()
  }

  CaptureToWorldTransform() {
    //{x: -7.36831, y: 1.11773, z: -2.93725}
    return this.viewToWorldMatrix.mult(this.cameraDevice.pose)
  }

  saveMatrix() {
    if (!this.mainCamera) {
      print("Error: mainCamera is not initialized")
      return false
    }

    try {
      this.viewToWorldMatrix = this.mainCamera.getTransform().getWorldTransform()

      return true
    } catch (e) {
      print("Error saving matrix: " + e)
      return false
    }
  }
  saveMatrixWithPose(pose: mat4) {
    this.viewToWorldMatrix = pose
  }

  uvToUncroppedUV(uv: vec2): vec2 {
    const cropRect = this.cropProvider.cropRect
    const center = cropRect.getCenter().add(vec2.one()).uniformScale(0.5)
    const sizeHalf = cropRect.getSize().uniformScale(0.25)
    const min = center.sub(sizeHalf)
    const max = center.add(sizeHalf)

    const x = this.Remap(uv.x, 0, 1, min.x, max.x)
    const y = this.Remap(uv.y, 0, 1, min.y, max.y)

    return new vec2(x, y)
  }

  Remap(value, low1, high1, low2, high2) {
    return low2 + ((high2 - low2) * (value - low1)) / (high1 - low1)
  }

  updateCameraPoseWithTimestamp(timestamp: number) {
    this.dummyTransform.setWorldTransform(this.mainCamera.getTransform().getWorldTransform())
    const position = this.dummyTransform.getWorldPosition()
    const rotation = this.dummyTransform.getWorldRotation()

    this.cameraPoseWithTimestamps.push({
      timestamp: timestamp,
      position: position,
      rotation: rotation
    })
  }

  clearOld() {
    let firstIndexToLeave = 0
    const curTime = getTime()
    for (let i = 0; i < this.cameraPoseWithTimestamps.length; i++) {
      const timePassed = curTime - this.cameraPoseWithTimestamps[i].timestamp
      if (timePassed < KEEP_FRAMES_TIME_SECONDS) {
        firstIndexToLeave = i
        break
      }
    }
    if (firstIndexToLeave) {
      this.cameraPoseWithTimestamps.splice(0, firstIndexToLeave)
    }
  }

  estimateCameraPose(timestamp: number) {
    if (this.cameraPoseWithTimestamps.length === 0) {
      return null
    }
    let leftId = -1
    for (let i = 0; i < this.cameraPoseWithTimestamps.length - 1; i++) {
      if (this.cameraPoseWithTimestamps[i].timestamp < timestamp) {
        leftId = i
      }
    }
    if (leftId === -1) {
      return this.mainCamera.getTransform().getWorldTransform()
    } else {
      const rightId = leftId + 1

      const lerpAmount = MathUtils.remap(
        timestamp,
        this.cameraPoseWithTimestamps[leftId].timestamp,
        this.cameraPoseWithTimestamps[rightId].timestamp,
        0,
        1
      )
      const leftPosition = this.cameraPoseWithTimestamps[leftId].position
      const rightPosition = this.cameraPoseWithTimestamps[rightId].position
      const resultPosition = vec3.lerp(leftPosition, rightPosition, lerpAmount)
      const leftRotation = this.cameraPoseWithTimestamps[leftId].rotation
      const rightRotation = this.cameraPoseWithTimestamps[rightId].rotation
      const resultRotation = quat.slerp(leftRotation, rightRotation, lerpAmount)

      this.dummyTransform.setWorldPosition(resultPosition)
      this.dummyTransform.setWorldRotation(resultRotation)

      this.clearOld()
      return this.dummyTransform.getWorldTransform()
    }
  }
}
