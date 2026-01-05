import {SceneController} from "./SceneController"

@component
export class DebugVisualizer extends BaseScriptComponent {
  @input sceneController: SceneController
  @input pointPrefab: ObjectPrefab
  @input testCamVisualObj: SceneObject

  onAwake() {
    this.createEvent("OnStartEvent").bind(this.onStart.bind(this))
  }

  private onStart() {
    this.testCamVisualObj.enabled = this.sceneController.showDebugVisuals
  }

  updateCameraFrame(cameraFrame: Texture) {
    this.destroyAllLocalPoints(this.testCamVisualObj)
    this.testCamVisualObj.getComponent("RenderMeshVisual").mainPass.baseTex = cameraFrame
  }

  visualizeLocalPoint(pixelPos: vec2, cameraFrame: Texture) {
    const localX = MathUtils.remap(pixelPos.x, 0, cameraFrame.getWidth(), -0.5, 0.5)
    // this one is flipped earlier for lens studio
    const localY = MathUtils.remap(pixelPos.y, 0, cameraFrame.getHeight(), 0.5, -0.5)
    const localPos = new vec3(localX, localY, 0.01)
    const pointObj = this.pointPrefab.instantiate(this.testCamVisualObj)
    const pointTrans = pointObj.getTransform()
    pointTrans.setLocalPosition(localPos)
    pointTrans.setWorldScale(vec3.one().uniformScale(0.5))
  }

  private destroyAllLocalPoints(parentObj: SceneObject) {
    const points = []
    for (let i = 0; i < parentObj.getChildrenCount(); i++) {
      const childObj = parentObj.getChild(i)
      points.push(childObj)
    }
    for (let i = 0; i < points.length; i++) {
      const child = points[i]
      child.destroy()
    }
  }
}
