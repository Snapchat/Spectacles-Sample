/**
 * Represents mathematical operations for
 * a filter sample of generic type T
 */
export interface SampleOps<T> {
  uniformScale(value: T, scale: number): T
  add(first: T, second: T): T
  sub(first: T, second: T): T
  magnitude(of: T): number
  zero(): T
}

/**
 * Defines mathematical operations for
 * a scalar filter sample.
 */
export class ScalarSampleOps implements SampleOps<number> {
  uniformScale(value: number, scale: number): number {
    return value * scale
  }

  add(first: number, second: number): number {
    return first + second
  }

  sub(first: number, second: number): number {
    return first - second
  }

  magnitude(of: number): number {
    return Math.abs(of)
  }

  zero(): number {
    return 0
  }
}

/**
 * Defines mathematical operations for
 * a vec2 filter sample.
 */
export class Vec2SampleOps implements SampleOps<vec2> {
  /** @inheritdoc */
  uniformScale(value: vec2, scale: number): vec2 {
    return value.uniformScale(scale)
  }

  /** @inheritdoc */
  add(first: vec2, second: vec2): vec2 {
    return first.add(second)
  }

  /** @inheritdoc */
  sub(first: vec2, second: vec2): vec2 {
    return first.sub(second)
  }

  /** @inheritdoc */
  magnitude(of: vec2): number {
    return of.length
  }

  /** @inheritdoc */
  zero(): vec2 {
    return vec2.zero()
  }
}

/**
 * Defines mathematical operations for
 * a vec3 filter sample.
 */
export class Vec3SampleOps implements SampleOps<vec3> {
  uniformScale(value: vec3, scale: number): vec3 {
    return value.uniformScale(scale)
  }

  add(first: vec3, second: vec3): vec3 {
    return first.add(second)
  }

  sub(first: vec3, second: vec3): vec3 {
    return first.sub(second)
  }

  magnitude(of: vec3): number {
    return of.length
  }

  zero(): vec3 {
    return vec3.zero()
  }
}
