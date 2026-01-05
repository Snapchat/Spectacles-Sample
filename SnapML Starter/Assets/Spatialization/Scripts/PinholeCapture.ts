import WorldCameraFinderProvider from "SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider"
import NativeLogger from "SpectaclesInteractionKit.lspkg/Utils/NativeLogger"
import {PinholeCameraModel} from "./PinholeCameraModel"

// Create a logger instance for this class
const log = new NativeLogger("PinholeCapture")

@component
export class PinholeCapture extends BaseScriptComponent {
  private cameraModule: CameraModule = require("LensStudio:CameraModule")
  private cameraRequest: CameraModule.CameraRequest
  cameraModel: any
  cameraDevice: any
  mainCamera: any
  viewToWorld: any
  private isInitialized: boolean = false
  private initPromise: Promise<boolean>
  private initResolve: (value: boolean) => void

  @input
  @hint("Debug camera info in console")
  debugLogging: boolean = false

  onAwake() {
    // Create a Promise that will be resolved when initialization is complete
    this.initPromise = new Promise((resolve) => {
      this.initResolve = resolve
    })

    this.createEvent("OnStartEvent").bind(() => {
      this.logMessage("Initializing PinholeCapture...")

      try {
        // Initialize camera module and its dependencies
        this.cameraRequest = CameraModule.createCameraRequest()
        this.cameraRequest.cameraId = CameraModule.CameraId.Right_Color
        const cameraTexture = this.cameraModule.requestCamera(this.cameraRequest)

        if (!cameraTexture) {
          this.logMessage("Error: Failed to request camera texture")
          this.initResolve(false)
          return
        }

        this.cameraDevice = global.deviceInfoSystem.getTrackingCameraForId(this.cameraRequest.cameraId)

        if (!this.cameraDevice) {
          this.logMessage("Error: Failed to get tracking camera device")
          this.initResolve(false)
          return
        }

        this.cameraModel = PinholeCameraModel.create(this.cameraDevice)

        if (!this.cameraModel) {
          this.logMessage("Error: Failed to create pinhole camera model")
          this.initResolve(false)
          return
        }

        // Get the main camera
        const cameraProvider = WorldCameraFinderProvider.getInstance()
        if (!cameraProvider) {
          this.logMessage("Error: Failed to get camera provider")
          this.initResolve(false)
          return
        }

        this.mainCamera = cameraProvider.getComponent()

        if (!this.mainCamera) {
          this.logMessage("Error: Failed to get main camera component")
          this.initResolve(false)
          return
        }

        // Initial save of the matrix
        if (!this.saveMatrix()) {
          this.logMessage("Warning: Initial matrix save failed, will try again later")
        }

        this.isInitialized = true
        this.logMessage("PinholeCapture initialization complete")
        this.initResolve(true)
      } catch (e) {
        this.logMessage("Error during initialization: " + e)
        this.initResolve(false)
      }
    })
  }

  // Check if the component is initialized and ready
  isReady(): boolean {
    return this.isInitialized && this.mainCamera != null
  }

  // Get the initialization promise
  getInitPromise(): Promise<boolean> {
    return this.initPromise
  }

  // save matrix run it when you are about to execute
  // save rotation and position before the model runs
  saveMatrix(): boolean {
    if (!this.mainCamera) {
      this.logMessage("Error: mainCamera is not initialized")
      return false
    }

    try {
      this.viewToWorld = this.mainCamera.getTransform().getWorldTransform()
      if (this.debugLogging) {
        this.logMessage("Matrix saved successfully")
      }
      return true
    } catch (e) {
      this.logMessage("Error saving matrix: " + e)
      return false
    }
  }

  // OBJECT DETECTION METHODS

  // This method is used to get the camera's pose in world space
  captureToWorldTransform(captureUV: vec2, depth: number): vec3 {
    if (!this.isReady() || !this.viewToWorld) {
      this.logMessage("Error: PinholeCapture not ready for captureToWorldTransform")
      return new vec3(0, 0, 0)
    }

    const capturePos = this.cameraModel.unprojectFromUV(captureUV, depth)
    const viewPos = this.cameraDevice.pose.multiplyPoint(capturePos)
    const worldPos = this.viewToWorld.multiplyPoint(viewPos)
    return worldPos
  }

  // This method is used to get the camera's pose in world space
  worldToCaptureTransform() {
    if (!this.isReady() || !this.viewToWorld) {
      this.logMessage("Error: PinholeCapture not ready for worldToCaptureTransform")
      return new mat4() // Return identity matrix as fallback
    }
    return this.viewToWorld.mult(this.cameraDevice.pose).inverse()
  }

  // This method is used to get the camera's pose in world space
  worldSpaceOfTrackingCamera(): vec3 {
    if (!this.isReady() || !this.viewToWorld) {
      this.logMessage("Error: PinholeCapture not ready for worldSpaceOfTrackingCamera")
      return new vec3(0, 0, 0)
    }
    return this.viewToWorld.mult(this.cameraDevice.pose).multiplyPoint(vec3.zero())
  }

  // Helper method for logging
  private logMessage(message: string): void {
    log.d(message)
    if (this.debugLogging) {
      print("PinholeCapture: " + message)
    }
  }

  public getCameraModel(): PinholeCameraModel {
    if (!this.cameraModel) {
      this.logMessage("Warning: cameraModel not initialized yet")
    }
    return this.cameraModel
  }
}
