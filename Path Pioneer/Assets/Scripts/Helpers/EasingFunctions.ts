export namespace EasingFunctions {
  // Linear (no easing, constant speed)
  export function easeLinear(t: number): number {
    return t
  }

  // Ease In Quadratic (slow start, fast end)
  export function easeInQuad(t: number): number {
    return t * t
  }

  // Ease Out Quadratic (fast start, slow end)
  export function easeOutQuad(t: number): number {
    return 1 - (1 - t) * (1 - t)
  }

  // Ease In-Out Quadratic (slow start, fast middle, slow end)
  export function easeInOutQuad(t: number): number {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
  }

  // Ease In Cubic (steeper acceleration)
  export function easeInCubic(t: number): number {
    return t * t * t
  }

  // Ease Out Cubic (fast start, slow end)
  export function easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3)
  }

  // Ease In-Out Cubic (smooth acceleration and deceleration)
  export function easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
  }

  // Ease In Quartic (even stronger acceleration)
  export function easeInQuart(t: number): number {
    return t * t * t * t
  }

  // Ease Out Quartic (fast start, slow end)
  export function easeOutQuart(t: number): number {
    return 1 - Math.pow(1 - t, 4)
  }

  // Ease In-Out Quartic (smooth and pronounced acceleration/deceleration)
  export function easeInOutQuart(t: number): number {
    return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2
  }

  // Ease In Quintic (very strong acceleration)
  export function easeInQuint(t: number): number {
    return t * t * t * t * t
  }

  // Ease Out Quintic (fast start, slow end)
  export function easeOutQuint(t: number): number {
    return 1 - Math.pow(1 - t, 5)
  }

  // Ease In-Out Quintic (stronger easing)
  export function easeInOutQuint(t: number): number {
    return t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2
  }

  // Ease Out Elastic (springy bounce at the end)
  export function easeOutElastic(t: number): number {
    const c4 = (2 * Math.PI) / 3
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1
  }

  // Ease Out Bounce (bounces at the end)
  export function easeOutBounce(t: number): number {
    const n1 = 7.5625
    const d1 = 2.75
    if (t < 1 / d1) {
      return n1 * t * t
    } else if (t < 2 / d1) {
      return n1 * (t -= 1.5 / d1) * t + 0.75
    } else if (t < 2.5 / d1) {
      return n1 * (t -= 2.25 / d1) * t + 0.9375
    } else {
      return n1 * (t -= 2.625 / d1) * t + 0.984375
    }
  }

  // Ease In-Out Sine (smoother than quadratic)
  export function easeInOutSine(t: number): number {
    return -(Math.cos(Math.PI * t) - 1) / 2
  }
}
