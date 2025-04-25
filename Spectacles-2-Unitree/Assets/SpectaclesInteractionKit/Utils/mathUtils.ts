/**
 * Compute the average vector of a list of values
 * @param values list of vectors to compute the average from
 * @returns the average vectors
 */
export function averageVec3(values: vec3[]): vec3 {
  let average = vec3.zero()
  if (values.length === 0) {
    return average
  }

  for (let i = 0; i < values.length; ++i) {
    average = average.add(values[i])
  }
  return average.uniformScale(1 / values.length)
}

export const DegToRad = Math.PI / 180
export const RadToDeg = 180 / Math.PI

/**
 * Compute the average vector of a list of values
 * @param values list of vectors to compute the average from
 * @returns the average vectors
 */
export function averageVec2(values: vec2[]): vec2 {
  let average = vec2.zero()
  if (values.length === 0) {
    return average
  }

  for (let i = 0; i < values.length; ++i) {
    average = average.add(values[i])
  }
  return average.uniformScale(1 / values.length)
}

export function inverseLerp(start: number, end: number, value: number) {
  if (start === end) {
    return 0
  } else {
    return (value - start) / (end - start)
  }
}
/**
 * Interpolate between two vectors using a ratio.
 * @param vectorA First vector.
 * @param vectorB Second vector.
 * @param ratio Proportion of vectorB in the resulting linear combination.
 * @returns Interpolated vector between vectorA and vectorB.
 */
export function interpolateVec3(
  vectorA: vec3,
  vectorB: vec3,
  ratio: number
): vec3 {
  return vectorA.uniformScale(1 - ratio).add(vectorB.uniformScale(ratio))
}

// Transforms `localPoint` from `transform` local space to world space.
export function transformPoint(transform: Transform, localPoint: vec3): vec3 {
  let t = mat4.fromTranslation(transform.getWorldPosition())
  let r = mat4.fromRotation(transform.getWorldRotation())
  let s = mat4.fromScale(transform.getWorldScale())
  let m = t.mult(r).mult(s)
  return m.multiplyPoint(localPoint)
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

/**
 *
 * @param val the value that should be mapped
 * @param inMax the maximum of the incoming range
 * @param inMin the minimum of the outcoming range
 * @param outMax the maximum of the outcoming range
 * @param outMin the minimum of the incoming range
 * @returns the mapped value
 */
export function mapValue(
  val: number,
  inMax: number,
  inMin: number,
  outMax: number,
  outMin: number
): number {
  return ((val - inMax) / (inMin - inMax)) * (outMin - outMax) + outMax
}

export function lerp(value1: number, value2: number, amount: number) {
  amount = amount < 0 ? 0 : amount
  amount = amount > 1 ? 1 : amount
  return value1 + (value2 - value1) * amount
}

/**
 * Dampens a current value back to a target value with spring-damper behavior.
 * @param current - the current value (usually position along an axis)
 * @param target - the target value to dampen to
 * @param velocity - the current velocity (usually speed along an axis)
 * @param smoothTime - the time it should take to smoothen to the desired target
 * @param deltaTime - the amount of time passed since last frame
 * @returns the smoothened value and new velocity: [position, velocity]
 */
export function smoothDamp(
  current: number,
  target: number,
  velocity: number,
  smoothTime: number,
  deltaTime: number
): [number, number] {
  // https://en.wikipedia.org/wiki/Mass-spring-damper_model
  // m * x''(t) + c * x'(t) + k * x(t) = 0

  // undamped natural frequency
  // ωₙ = √(k / m)

  // damping ratio
  // ζ = c / (2 * m * ωₙ)

  // critical damping (ζ = 1)
  // c = 2 * m * ωₙ

  // smooth damp equation
  // k * x(t) + 2 * √(k) * x'(t) + x''(t) = 0

  // analytical solutions
  // x(t) = e^(-√(k) * t) * (t * x'(0) + x(0) + √(k) * t * x(0))
  // x'(t) = e^(-√(k) * t) * (x'(0) + √(k) * x(0)) -
  //         e^(-√(k) * t) * √(k) * (t * x'(0) + x(0) + √(k) * t * x(0))

  // value of k to settle in t seconds
  // x(t) = 0.01 * x(0), x'(0) = 0
  // k = 44.0677 / t^2

  const x0 = current - target
  const sqrtk = 6.63835 / smoothTime
  const ensqrtkt = Math.exp(-sqrtk * deltaTime)
  const sqrtktx0 = sqrtk * deltaTime * x0
  const pos = ensqrtkt * (deltaTime * velocity + x0 + sqrtktx0)
  const vel = ensqrtkt * (velocity + sqrtk * x0) - sqrtk * pos

  return [target + pos, vel]
}

export function smoothDampAngle(
  current: number,
  target: number,
  velocity: number,
  smoothTime: number,
  deltaTime: number
): [number, number] {
  if (target - current > Math.PI) current += 2 * Math.PI
  if (target - current < -Math.PI) current -= 2 * Math.PI
  return smoothDamp(current, target, velocity, smoothTime, deltaTime)
}

/**
 * Smoothens a current value based on velocity while reducing the velocity.
 * @param current - the current value
 * @param velocity - the current velocity of the value
 * @param smoothTime - the time it should take to smoothen the velocity to 0
 * @param deltaTime - the amount of time passed since last frame
 * @returns the smoothened value and new velocity: [position, velocity]
 */
export function smoothSlide(
  current: number,
  velocity: number,
  smoothTime: number,
  deltaTime: number
): [number, number] {
  // smooth slide equation (k = 0)
  // c * x'(t) + x''(t) = 0

  // analytical solutions
  // x(t) = (e^(-c * t) * (-x'(0) + e^(c * t) * x'(0) + c * e^(c * t) * x(0))) / c
  // x'(t) = -e^(-c * t) * (-x'(0) + e^(c * t) * x'(0) + c * e^(c * t) * x(0)) +
  //         (e^(-c * t) * (c * e^(c * t) * x'(0) + (c^2 * e^(c * t) * x(0)))) / c

  // value of c to settle in t seconds
  // x(t) = 0.01 * x(0), x'(0) = 0
  // c = 4.60517 / t

  const c = 4.60517 / smoothTime
  const enct = Math.exp(-c * deltaTime)
  const ect = Math.exp(c * deltaTime)
  const cectx0 = c * ect * current
  const env0ev0c = enct * (-velocity + ect * velocity + cectx0)
  const pos = env0ev0c / c
  const vel = -env0ev0c + (enct * (c * ect * velocity + c * cectx0)) / c

  return [pos, vel]
}
