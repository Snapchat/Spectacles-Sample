@component
export class SimulatedChessBoard extends BaseScriptComponent {

  @input simulatedPoolTable: SceneObject;
  @input simulatedCamera: SceneObject;
  @input poolBall: ObjectPrefab;

  private poolBalls: SceneObject[] = [];

  onAwake() {
    let isEditor = global.deviceInfoSystem.isEditor();

    this.simulatedCamera.enabled = isEditor;
    this.simulatedPoolTable.enabled = isEditor;

    if (isEditor) {
      this.generatePoolBalls();
      this.createEvent("TapEvent").bind(this.onTap.bind(this));
    }
  }

  private onTap(event: TapEvent) {
    for (let i = 0; i < this.poolBalls.length; i++) {
      let poolBall = this.poolBalls[i];
      let physicsBody = poolBall.getComponent("Physics.BodyComponent");
      let f = 10;
      physicsBody.addForce(
        new vec3(Math.random() * 2 * f - f, 0, Math.random() * 2 * f - f),
        Physics.ForceMode.Impulse
      );
    }
  }

  private generatePoolBalls() {
    let parent = this.simulatedPoolTable;

    for (let i = 0; i < 16; i++) {
      let poolBall = this.poolBall.instantiate(parent);
      let mesh = poolBall.getComponent("Component.RenderMeshVisual");
      let mat = mesh.mainMaterial.clone();
      mat.mainPass.ballNum = i;
      mesh.mainMaterial = mat;
      let pos = new vec3(
        Math.random() * 90 - 45,
        77,
        Math.random() * 210 - 105
      );
      poolBall.getTransform().setLocalPosition(pos);
      poolBall.getTransform().setLocalRotation(
        new quat(Math.random(), Math.random(), Math.random(), 1)
      );
      this.poolBalls.push(poolBall);
    }
  }
}
