export type TranslationCalculatorConfig = {
  center: vec3
  duration: number
  xzEnabled?: boolean
  xzEasing?: number
  yEnabled?: boolean
  yEasing?: number
  translationBuffer?: number
}

/**
 * HeadlockTranslationCalculator is used to calculate the center of the sphere used when calculating the target's position relative to the pitch/yaw orientation of the camera.
 */
export default class HeadlockTranslationCalculator {
  private center: vec3

  // Controls the behavior of the sphere following along the flat plane defined by vec3.up().
  private _xzEnable: boolean = true
  private _xzEasing: number = 1

  // Controls the behavior of the sphere following along the line defined by vec3.up().
  private _yEnable: boolean = true
  private _yEasing: number = 1

  // Use an estimated time for the duration between each update to prevent FPS issues from slowing down billboarding effect.
  private duration: number

  // If the user is 'close enough' to the center of the sphere, we avoid moving the sphere to decrease jitter
  private _translationBuffer: number = 0

  constructor(config: TranslationCalculatorConfig) {
    this.center = config.center

    this.duration = config.duration

    this.xzEnable = config.xzEnabled ?? true
    this.xzEasing = config.xzEasing ?? 1

    this.yEnable = config.yEnabled ?? true
    this.yEasing = config.yEasing ?? 1

    this.translationBuffer = config.translationBuffer ?? 0
  }

  get xzEnable(): boolean {
    return this._xzEnable
  }
  set xzEnable(enabled: boolean) {
    this._xzEnable = enabled
  }

  get yEnable(): boolean {
    return this._yEnable
  }
  set yEnable(enabled: boolean) {
    this._yEnable = enabled
  }

  get xzEasing(): number {
    return this._xzEasing
  }
  set xzEasing(easing: number) {
    this._xzEasing = easing
  }

  get yEasing(): number {
    return this._yEasing
  }
  set yEasing(easing: number) {
    this._yEasing = easing
  }

  get translationBuffer(): number {
    return this._translationBuffer
  }
  set translationBuffer(bufferDistance: number) {
    this._translationBuffer = bufferDistance
  }

  /**
   * Returns the current center of the sphere.
   */
  public getCenter(): vec3 {
    return this.center
  }

  /**
   * Updates the center of the sphere and returns the offset vector to move the target by.
   * @param cameraPosition - the current world position of the camera
   */
  public updateCenter(cameraPosition: vec3): vec3 {
    const oldCenter = new vec3(this.center.x, this.center.y, this.center.z)
    // Test below implementation once everything is working.
    // const oldCenter = this.center

    if (cameraPosition.sub(this.center).length < this.translationBuffer) {
      return vec3.zero()
    }

    if (this.xzEnable) {
      const cameraPositionXZ = cameraPosition.projectOnPlane(vec3.up())
      const centerXZ = this.center.projectOnPlane(vec3.up())

      let offset: vec3
      if (this.xzEasing !== 1) {
        const timeRatio = getDeltaTime() / this.duration
        const interpolatedXZ = vec3.lerp(centerXZ, cameraPositionXZ, this.xzEasing * timeRatio)
        offset = interpolatedXZ.sub(centerXZ)
      } else {
        offset = cameraPositionXZ.sub(centerXZ)
      }

      this.center = this.center.add(offset)
    }

    if (this.yEnable) {
      const cameraPositionY = cameraPosition.y
      const centerY = this.center.y

      let offset: number
      if (this.yEasing !== 1) {
        const timeRatio = getDeltaTime() / this.duration
        const interpolatedY = MathUtils.lerp(centerY, cameraPositionY, this.yEasing * timeRatio)
        offset = interpolatedY - centerY
      } else {
        offset = cameraPositionY - centerY
      }

      this.center = this.center.add(vec3.up().uniformScale(offset))
    }

    return this.center.sub(oldCenter)
  }
}
