@component
export class WarningController extends BaseScriptComponent {
  @input
  mainCamera: Camera

  @input
  mainCameraCapture: Camera

  @input
  orthoCamera: Camera

  @input
  orthoCameraCapture: Camera

  @input
  warningVisual: SceneObject

  private mainCameraLayers: LayerSet
  private mainCameraCaptureLayers: LayerSet

  private warningLayer: LayerSet

  onAwake() {
    this.mainCameraLayers = this.mainCamera.renderLayer
    this.mainCameraCaptureLayers = this.mainCameraCapture.renderLayer
    this.warningLayer = this.warningVisual.layer

    // test
    // this.toggleWaring(true);
    // this.createEvent("TouchStartEvent").bind(()=>{
    //     this.toggleWaring(false);
    // })
  }

  toggleWaring(on: boolean) {
    this.mainCamera.renderLayer = on ? this.warningLayer : this.mainCameraLayers
    this.mainCameraCapture.renderLayer = on ? this.warningLayer : this.mainCameraCaptureLayers
    this.toggleOrtho(!on)
  }

  private toggleOrtho(on: boolean) {
    this.orthoCamera.enabled = on
    this.orthoCameraCapture.enabled = on
  }
}
