import {PathWalker} from "./PathWalker"

@component
export class PathCollisionEvents extends BaseScriptComponent {
  private msg: string

  private col: ColliderComponent
  private tr: Transform

  private pathWalker: PathWalker

  private camTr: Transform
  private camCol: ColliderComponent

  private enterPoint: vec3 = null

  init(myMsg: string, myCamTr: Transform, myCamCol: ColliderComponent, myPathWalker: PathWalker) {
    this.msg = myMsg
    this.camTr = myCamTr
    this.camCol = myCamCol
    this.pathWalker = myPathWalker

    this.tr = this.sceneObject.getTransform()
    this.col = this.sceneObject.getChild(0).getComponent("ColliderComponent")
    this.col.onCollisionEnter.add((e: CollisionEnterEventArgs) => this.onCollisionEnter(e))
    this.col.onCollisionExit.add((e: CollisionExitEventArgs) => this.onCollisionExit(e))
  }

  public onCollisionEnter(e: CollisionEnterEventArgs) {
    if (e.collision.collider.isSame(this.camCol)) {
      this.enterPoint = this.camTr.getWorldPosition()
    }
  }

  public onCollisionExit(e: CollisionExitEventArgs) {
    if (e.collision.collider.isSame(this.camCol)) {
      const exitPoint = this.camTr.getWorldPosition()
      let dir: vec3 = null

      if (!isNull(this.enterPoint)) {
        dir = exitPoint.sub(this.enterPoint)
        dir = dir.normalize()
        const dot = this.tr.forward.dot(dir)
        if (this.msg.includes("start")) {
          this.pathWalker.onStartCollisionExit(dot)
        } else if (this.msg.includes("finish")) {
          this.pathWalker.onFinishCollisionExit(dot)
        }
        // Reset
        this.enterPoint = null
      } else {
        print("WARNING: cam fwd used for collision")
      }
    }
  }
}
