import {LinearAlgebra} from "./Helpers/LinearAlgebra"
import {LensInitializer} from "./LensInitializer"

@component
export class PathmakingPlayerFeedback extends BaseScriptComponent {
  @input
  visualSo: SceneObject

  @input
  jointsSo: SceneObject[]

  tr: Transform
  joints: Transform[] = []

  vec3up: vec3 = vec3.up()

  onAwake() {
    this.tr = this.getSceneObject().getTransform()

    this.jointsSo.forEach((so) => {
      const joint = so.getTransform()
      this.joints.push(joint)
      so.enabled = false
    })
  }

  start(positions: vec3[]) {
    this.update(positions)
    this.visualSo.enabled = true
  }

  stop() {
    this.visualSo.enabled = false
  }

  update(positions: vec3[]) {
    const pos = LensInitializer.getInstance().getPlayerGroundPos()
    this.tr.setWorldPosition(pos)

    // update arrow positions
    const rotations: quat[] = LinearAlgebra.computeCurveRotations(positions)

    let lastRot: quat = quat.quatIdentity()
    // Set poses
    for (let i = 0; i < this.joints.length; i++) {
      if (i < positions.length) {
        this.jointsSo[i].enabled = true

        const targetPos = positions[i]
        this.joints[i].setWorldPosition(targetPos)

        // We need to flip this rotation for the way the art was made
        lastRot = LinearAlgebra.flippedRot(rotations[i], this.vec3up)
        this.joints[i].setWorldRotation(lastRot)
      } else {
        this.joints[i].setWorldPosition(pos)
        this.joints[i].setWorldRotation(lastRot)
        // this.jointsSo[i].enabled = false;
      }
    }
  }
}
