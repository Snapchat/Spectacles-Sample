@component
export class SimulatedChessBoard extends BaseScriptComponent {
  @input boardInterface: SceneObject;
  @input simulatedChessBoard: SceneObject;
  @input simulatedCamera: SceneObject;

  onAwake() {
    let isEditor = global.deviceInfoSystem.isEditor();

    this.simulatedCamera.enabled = isEditor;
    this.simulatedChessBoard.enabled = isEditor;
    if (isEditor) {
      this.createEvent("UpdateEvent").bind(this.onUpdate.bind(this));
    }
  }
ß
  onUpdate() {

    let scale = global.deviceInfoSystem.screenScale == 0 ? 3 : 6
    this.simulatedChessBoard.getTransform().setWorldScale(vec3.one().uniformScale(0.01 * scale));
    this.boardInterface.getTransform().setWorldScale(vec3.one().uniformScale(0.08 * scale));
  }
}
