@component
export class SimulatedChessBoard extends BaseScriptComponent {
  @input simulatedPoolTable: SceneObject
  @input simulatedCamera: SceneObject
  @input poolBall: ObjectPrefab

  private poolBalls: SceneObject[] = []

  onAwake() {
    const isEditor = global.deviceInfoSystem.isEditor()

    this.simulatedCamera.enabled = isEditor
    this.simulatedPoolTable.enabled = isEditor

    if (isEditor) {
      this.generatePoolBalls()
      this.createEvent("TapEvent").bind(this.onTap.bind(this))
    }
  }

  private onTap(event: TapEvent) {
    for (let i = 0; i < this.poolBalls.length; i++) {
      const poolBall = this.poolBalls[i]
      const physicsBody = poolBall.getComponent("Physics.BodyComponent")
      const f = 10
      physicsBody.addForce(new vec3(Math.random() * 2 * f - f, 0, Math.random() * 2 * f - f), Physics.ForceMode.Impulse)
    }
  }

  private generatePoolBalls() {
    const parent = this.simulatedPoolTable

    for (let i = 0; i < 16; i++) {
      const poolBall = this.poolBall.instantiate(parent)
      const mesh = poolBall.getComponent("Component.RenderMeshVisual")
      const mat = mesh.mainMaterial.clone()
      mat.mainPass.ballNum = i
      mesh.mainMaterial = mat
      const pos = new vec3(Math.random() * 90 - 45, 77, Math.random() * 210 - 105)
      poolBall.getTransform().setLocalPosition(pos)
      poolBall.getTransform().setLocalRotation(new quat(Math.random(), Math.random(), Math.random(), 1))
      this.poolBalls.push(poolBall)
    }
  }
}
