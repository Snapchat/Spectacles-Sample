export class PaintOnFloorBehavior {
  constructor(
    protected zOffset: number,
    protected camTr: Transform
  ) {}

  private oPosVisual: vec3 | undefined
  private oRotVisual: quat | undefined

  start(visualPos: vec3): void {
    this.oPosVisual = visualPos
    this.oRotVisual = this.camTr.getWorldRotation()
  }

  stop(): void {}

  getBehavior(nPosVisual: vec3) {
    nPosVisual = vec3.lerp(this.oPosVisual, nPosVisual, Math.min(1, 5 * getDeltaTime()))
    let nRotVisual = this.camTr.getWorldRotation()
    nRotVisual = quat.lerp(this.oRotVisual, nRotVisual, Math.min(1, 10 * getDeltaTime()))

    this.oPosVisual = nPosVisual
    this.oRotVisual = nRotVisual

    return {pos: nPosVisual, rot: nRotVisual, vel: undefined}
  }
}
