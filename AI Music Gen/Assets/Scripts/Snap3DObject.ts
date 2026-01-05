import {setTimeout} from "SpectaclesInteractionKit.lspkg/Utils/FunctionTimingUtils"
@component
export class Snap3DObject extends BaseScriptComponent {
  @input
  private modelParent: SceneObject
  @input
  private img: Image
  @input
  private promptDisplay: Text
  @input
  private spinner: SceneObject
  @input
  private mat: Material
  @input
  private displayPlate: SceneObject
  private tempModel: SceneObject = null
  private finalModel: SceneObject = null
  private size: number = 20
  private sizeVec: vec3 = null

  onAwake() {
    // Clone the image material to avoid modifying the original
    const imgMaterial = this.img.mainMaterial.clone()
    this.img.clearMaterials()
    this.img.mainMaterial = imgMaterial
    imgMaterial.mainPass.baseTex = this.img.mainPass.baseTex
    this.img.enabled = false

    const offsetBelow = 0
    this.sizeVec = vec3.one().uniformScale(this.size)
    this.displayPlate.getTransform().setLocalPosition(new vec3(0, -this.size * 0.5 - offsetBelow, 0))
    this.img.getTransform().setLocalScale(this.sizeVec)
  }

  setPrompt(prompt: string) {
    this.promptDisplay.text = prompt
  }

  setImage(image: Texture) {
    this.img.enabled = true
    this.img.mainPass.baseTex = image
  }

  setModel(model: GltfAsset, isFinal: boolean) {
    this.img.enabled = false
    if (isFinal) {
      if (!isNull(this.finalModel)) {
        this.finalModel.destroy()
      }
      this.finalModel = model.tryInstantiate(this.modelParent, this.mat)
      this.finalModel.getTransform().setLocalScale(this.sizeVec)
    } else {
      this.tempModel = model.tryInstantiate(this.modelParent, this.mat)
      this.tempModel.getTransform().setLocalScale(this.sizeVec)
    }
  }

  setSpinnerEnabled(enabled: boolean) {
    this.spinner.enabled = enabled
  }

  onFailure(error: string) {
    this.img.enabled = false
    this.spinner.enabled = false
    if (this.tempModel) {
      this.tempModel.destroy()
    }
    if (this.finalModel) {
      this.finalModel.destroy()
    }
    this.promptDisplay.text = "Error: " + error
    setTimeout(() => {
      this.destroy()
    }, 5000) // Hide error after 5 seconds
  }
}
