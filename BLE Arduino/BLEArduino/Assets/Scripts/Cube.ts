const CAM_DISTANCE = 50;
const FOLLOW_SPEED = 6;

@component
export class Cube extends BaseScriptComponent {
  @input camObj: SceneObject;

  private trans: Transform;
  private camTrans: Transform;

  private desiredRotation = quat.quatIdentity();
    
  onAwake() {
    this.trans = this.getSceneObject().getTransform();
    this.camTrans = this.camObj.getTransform();
    this.createEvent("UpdateEvent").bind(this.onUpdate.bind(this));
  }

  private onUpdate() {
    this.softFollow();
  }

  setRotationAngle(angle: number[]) {
    try {
      var angleVec = new vec3(angle[0], angle[1], angle[2]);
      this.desiredRotation = quat.fromEulerVec(
        angleVec.uniformScale(MathUtils.DegToRad)
      );             
      this.trans.setWorldRotation(this.desiredRotation);
    } catch (e) {
      print("Error parsing JSON: " + e);
    }
  }

  private softFollow() {
    var desiredPosition = this.camTrans
      .getWorldPosition()
      .add(this.camTrans.forward.uniformScale(-CAM_DISTANCE));

    this.trans.setWorldPosition(
      vec3.lerp(
        this.trans.getWorldPosition(),
        desiredPosition,
        getDeltaTime() * FOLLOW_SPEED
      )
    );
  }
}
