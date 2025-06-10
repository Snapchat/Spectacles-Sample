import { SceneController } from "./SceneController";

@component
export class DebugVisualizer extends BaseScriptComponent {
  @input pointPrefab: ObjectPrefab;
  @input testCamVisualObj: SceneObject;

  onAwake() {
    this.createEvent("OnStartEvent").bind(this.onStart.bind(this));
  }

  private onStart() {
    this.testCamVisualObj.enabled = SceneController.SHOW_DEBUG;
  }

  updateCameraFrame(cameraFrame: Texture) {
    this.destroyAllLocalPoints(this.testCamVisualObj);
    this.testCamVisualObj.getComponent("RenderMeshVisual").mainPass.baseTex =
      cameraFrame;
  }

  visualizeLocalPoint(pixelPos: vec2, cameraFrame: Texture) {
    var localX = MathUtils.remap(
      pixelPos.x,
      0,
      cameraFrame.getWidth(),
      -0.5,
      0.5
    );
    // this one is flipped earlier for lens studio
    var localY = MathUtils.remap(
      pixelPos.y,
      0,
      cameraFrame.getHeight(),
      0.5,
      -0.5
    );
    var localPos = new vec3(localX, localY, 0.01);
    var pointObj = this.pointPrefab.instantiate(this.testCamVisualObj);
    var pointTrans = pointObj.getTransform();
    pointTrans.setLocalPosition(localPos);
    pointTrans.setWorldScale(vec3.one().uniformScale(0.5));
  }

  private destroyAllLocalPoints(parentObj: SceneObject) {
    var points = [];
    for (var i = 0; i < parentObj.getChildrenCount(); i++) {
      var childObj = parentObj.getChild(i);
      points.push(childObj);
    }
    for (var i = 0; i < points.length; i++) {
      var child = points[i];
      child.destroy();
    }
  }
}
