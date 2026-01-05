@component
export class PlayerPaceCalculator extends BaseScriptComponent {
  private oPos: vec3
  private t: number
  private cps: number

  // How often we calculate pace in seconds
  private testIncrement: number

  start(pos: vec3) {
    this.t = 0
    this.cps = 0
    this.testIncrement = 0.5
    this.oPos = pos
  }

  getPace(pos: vec3) {
    const dt = getDeltaTime()
    this.t += dt
    let dist = 0

    if (this.t > this.testIncrement) {
      // Cm moved since last sample
      dist = pos.distance(this.oPos)
      this.oPos = pos

      // Pace in cm per sec (cps)
      this.cps = dist / this.t

      this.t = 0
    }

    return {nPos: pos, pace: this.cps, dist, dt}
  }
}
