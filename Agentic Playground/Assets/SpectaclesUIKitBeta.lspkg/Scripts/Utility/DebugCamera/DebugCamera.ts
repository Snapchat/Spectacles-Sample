import WorldCameraFinderProvider from "SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider"

@component
export class DebugCamera extends BaseScriptComponent {
  @input
  @allowUndefined
  lookAt: SceneObject
  @input
  attachToCamera: boolean = false

  private worldCameraFinder: WorldCameraFinderProvider = WorldCameraFinderProvider.getInstance()
  private worldCameraComponent: Camera = this.worldCameraFinder.getComponent()

  private renderTarget: Texture = global.scene.createRenderTargetTexture()
  private camera: Camera = this.sceneObject.createComponent("Camera")

  private viewingPlane: SceneObject
  private viewingPlaneMesh: RenderMesh = requireAsset("./Unit Plane.mesh") as RenderMesh
  private viewingPlaneMaterial: Material = requireAsset("./ViewingPlane.mat") as Material

  private transform: Transform = this.getTransform()
  private offset: vec3 = this.transform.getLocalPosition()

  private lookAtTransform: Transform

  onAwake() {
    this.createEvent("OnStartEvent").bind(this.initialize)
  }

  initialize = () => {
    this.viewingPlane = global.scene.createSceneObject("ViewingPlane")
    const rmv = this.viewingPlane.createComponent("RenderMeshVisual")
    rmv.mesh = this.viewingPlaneMesh
    rmv.mainMaterial = this.viewingPlaneMaterial.clone()
    rmv.mainMaterial.mainPass.baseTex = this.renderTarget
    this.viewingPlane.setParent(this.worldCameraComponent.sceneObject)

    const transform = this.viewingPlane.getTransform()
    transform.setLocalPosition(new vec3(-1.5, 2, -10))
    transform.setLocalScale(new vec3(2, 3, 1))

    this.camera.enableClearColor = true
    this.camera.clearColor = new vec4(0, 0, 0.5, 1)
    this.camera.type = Camera.Type.Perspective
    this.camera.far = 1000

    const camPosition = this.transform.getLocalPosition()

    if (this.lookAt) {
      this.lookAtTransform = this.lookAt.getTransform()
      this.transform.setLocalRotation(
        quat.lookAt(camPosition.sub(this.lookAtTransform.getWorldPosition()).normalize(), vec3.up())
      )
    }

    const control = this.renderTarget.control as RenderTargetProvider
    control.useScreenResolution = true

    // set render camera target
    this.camera.renderTarget = this.renderTarget

    this.createEvent("UpdateEvent").bind(this.update)
  }

  update = () => {
    const camPosition = this.transform.getLocalPosition()

    if (this.attachToCamera) {
      this.transform.setLocalPosition(this.worldCameraFinder.getWorldPosition().add(this.offset))
    }

    if (this.lookAt) {
      this.transform.setLocalRotation(
        quat.lookAt(camPosition.sub(this.lookAtTransform.getWorldPosition()).normalize(), vec3.up())
      )
    }
  }
}
