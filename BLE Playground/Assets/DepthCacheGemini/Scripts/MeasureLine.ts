const LINE_THICKNESS = 0.5

@component
export class MeasureLine extends BaseScriptComponent {
  @input lineAnchorObj: SceneObject
  @input lineStartObj: SceneObject
  @input lineEndObj: SceneObject
  @input textComp: Text

  private lineAnchorTrans: Transform
  private lineStartTrans: Transform
  private lineEndTrans: Transform

  onAwake() {
    this.lineAnchorTrans = this.lineAnchorObj.getTransform()
    this.lineStartTrans = this.lineStartObj.getTransform()
    this.lineEndTrans = this.lineEndObj.getTransform()
    this.createEvent("UpdateEvent").bind(this.onUpdate.bind(this))
  }

  setLinePoints(startPos: vec3, endPos: vec3) {
    this.lineStartTrans.setWorldPosition(startPos)
    this.lineEndTrans.setWorldPosition(endPos)
  }

  // Each line endpoint has an InteractorManipulate component so they can be adjusted by hand after initial placement
  private onUpdate() {
    //set start position
    const lineStartPos = this.lineStartTrans.getWorldPosition()
    this.lineAnchorTrans.setWorldPosition(lineStartPos)
    //look at end position
    const lineEndPos = this.lineEndTrans.getWorldPosition()
    const forward = lineStartPos.sub(lineEndPos).normalize()
    let lineRot = quat.lookAt(forward, vec3.up())
    lineRot = lineRot.multiply(quat.fromEulerVec(new vec3(0, Math.PI / 2, 0)))
    this.lineAnchorTrans.setWorldRotation(lineRot)
    this.lineAnchorTrans.setLocalScale(new vec3(lineStartPos.distance(lineEndPos), LINE_THICKNESS, LINE_THICKNESS))
    //set measurment text
    const distance = lineStartPos.distance(lineEndPos)
    const distanceText = distance.toFixed(2) + "cm"
    this.textComp.text = distanceText
    this.textComp.getTransform().setWorldPosition(lineStartPos.add(lineEndPos).uniformScale(0.5))
  }
}
