import WorldCameraFinderProvider from "SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider"

export enum CameraType {
  Main = 0,
  SpecsLeft = 1,
  SpecsRight = 2
}

export class CameraService {
  private static instance: CameraService

  // Just keep the main camera
  private _mainCamera: Camera = WorldCameraFinderProvider.getInstance().getComponent()

  // These can be created on-demand if needed later
  private _specsLeftCamera: Camera
  private _specsRightCamera: Camera

  public static getInstance(): CameraService {
    if (!CameraService.instance) {
      CameraService.instance = new CameraService()
    }
    return CameraService.instance
  }

  // Simplified constructor with no initialization that uses CameraModule
  private constructor() {
    // No complex initialization needed
  }

  get mainCameraTransform(): Transform {
    return this._mainCamera.getTransform()
  }

  getCamera(cameraType: CameraType): Camera {
    if (cameraType === CameraType.Main) {
      return this._mainCamera
    }
    if (cameraType === CameraType.SpecsLeft) {
      if (!this._specsLeftCamera) {
        print("Warning: SpecsLeft camera requested but not initialized")
      }
      return this._specsLeftCamera
    }
    if (cameraType === CameraType.SpecsRight) {
      if (!this._specsRightCamera) {
        print("Warning: SpecsRight camera requested but not initialized")
      }
      return this._specsRightCamera
    }
    throw new Error("Invalid camera type")
  }
}
