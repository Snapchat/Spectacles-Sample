import {Singleton} from "../Decorators/Singleton"
import Event from "./Event"

export type AnimateConfig = {
  update: (t: number) => void
  cancelSet?: CancelSet
  delayFrames?: number
} & (
  | {
      duration: number
      start?: number
      end?: number
      easing?: keyof typeof easingFunctions
      ended?: () => void
      cancelled?: () => void
    }
  | {
      duration: "continuous"
      // continuous animations have no start or end and must be linear
      easing?: "linear"
      start?: undefined
      end?: undefined
      ended?: undefined
      cancelled?: undefined
    }
)

const onAnimationStartEvent = new Event<Readonly<AnimateConfig>>()
export const onAnimationStart = onAnimationStartEvent.publicApi()

const onAnimationStopEvent = new Event<Readonly<AnimateConfig>>()
export const onAnimationStop = onAnimationStopEvent.publicApi()

export type CancelFunction = () => void
type EasingFunction = (t: number) => number

export const easingFunctions = {
  linear: (t: number) => t,
  "ease-in-sine": (t: number) => {
    return -Math.cos(t * (Math.PI / 2)) + 1
  },
  "ease-out-sine": (t: number) => {
    return Math.sin(t * (Math.PI / 2))
  },
  "ease-in-out-sine": (t: number) => {
    return -(Math.cos(Math.PI * t) - 1) / 2
  },
  "ease-in-quad": (t: number) => {
    return t * t
  },
  "ease-out-quad": (t: number) => {
    return t * (2 - t)
  },
  "ease-in-out-quad": (t: number) => {
    if ((t *= 2) < 1) {
      return 0.5 * t * t
    }
    return -0.5 * (--t * (t - 2) - 1)
  },
  "ease-in-cubic": (t: number) => {
    return t * t * t
  },
  "ease-out-cubic": (t: number) => {
    return --t * t * t + 1
  },
  "ease-in-out-cubic": (t: number) => {
    if ((t *= 2) < 1) {
      return 0.5 * t * t * t
    }
    return 0.5 * ((t -= 2) * t * t + 2)
  },
  "ease-in-quart": (t: number) => {
    return t * t * t * t
  },
  "ease-out-quart": (t: number) => {
    return 1 - --t * t * t * t
  },
  "ease-in-out-quart": (t: number) => {
    if ((t *= 2) < 1) {
      return 0.5 * t * t * t * t
    }
    return -0.5 * ((t -= 2) * t * t * t - 2)
  },
  "ease-in-quint": (t: number) => {
    return t * t * t * t * t
  },
  "ease-out-quint": (t: number) => {
    return --t * t * t * t * t + 1
  },
  "ease-in-out-quint": (t: number) => {
    if ((t *= 2) < 1) {
      return 0.5 * t * t * t * t * t
    }
    return 0.5 * ((t -= 2) * t * t * t * t + 2)
  },
  "ease-in-expo": (t: number) => {
    return t === 0 ? 0 : Math.pow(1024, t - 1)
  },
  "ease-out-expo": (t: number) => {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
  },
  "ease-in-out-expo": (t: number) => {
    if (t === 0 || t === 1) {
      return t
    }
    if ((t *= 2) < 1) {
      return 0.5 * Math.pow(1024, t - 1)
    }
    return 0.5 * (-Math.pow(2, -10 * (t - 1)) + 2)
  },
  "ease-in-circ": (t: number) => {
    return 1 - Math.sqrt(1 - t * t)
  },
  "ease-out-circ": (t: number) => {
    return Math.sqrt(1 - --t * t)
  },
  "ease-in-out-circ": (t: number) => {
    if ((t *= 2) < 1) {
      return -0.5 * (Math.sqrt(1 - t * t) - 1)
    }
    return 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1)
  },
  "ease-in-back": (t: number) => {
    const s = 1.70158
    return t === 1 ? 1 : t * t * ((s + 1) * t - s)
  },
  "ease-out-back": (t: number) => {
    const s = 1.70158
    return t === 0 ? 0 : --t * t * ((s + 1) * t + s) + 1
  },
  "ease-in-out-back": (t: number) => {
    const c1 = 1.70158
    const c2 = c1 * 1.525

    return t < 0.5
      ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
      : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2
  },
  "ease-in-elastic": (t: number) => {
    if (t === 0 || t === 1) {
      return t
    }
    return -Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI)
  },
  "ease-out-elastic": (t: number) => {
    if (t === 0 || t === 1) {
      return t
    }
    return Math.pow(2, -10 * t) * Math.sin((t - 0.1) * 5 * Math.PI) + 1
  },
  "ease-in-out-elastic": (t: number) => {
    if (t === 0 || t === 1) {
      return t
    }
    t *= 2
    if (t < 1) {
      return (
        -0.5 * Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI)
      )
    }
    return (
      0.5 * Math.pow(2, -10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI) + 1
    )
  },
  "ease-in-bounce": (t: number) => {
    return 1 - easingFunctions["ease-out-bounce"](1 - t)
  },
  "ease-out-bounce": (t: number) => {
    if (t < 1 / 2.75) {
      return 7.5625 * t * t
    } else if (t < 2 / 2.75) {
      return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75
    } else if (t < 2.5 / 2.75) {
      return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375
    } else {
      return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375
    }
  },
  "ease-in-out-bounce": (t: number) => {
    return t < 0.5
      ? easingFunctions["ease-in-bounce"](t * 2) * 0.5
      : easingFunctions["ease-out-bounce"](t * 2 - 1) * 0.5 + 0.5
  },
  "ease-out-back-cubic": createCubicBezierEasingFunction(0.34, 1.25, 0.64, 1),
  "ease-in-back-cubic": createCubicBezierEasingFunction(0.36, 0, 0.64, -0.25),
  "ease-in-out-back-cubic": createCubicBezierEasingFunction(
    0.3,
    -0.25,
    0.6,
    1.42
  ),
} as const

// A simple animation function. It's probably better to use the other animation
// utilities, but I need a quick way to animate that wasn't tied to Scene objects
export default function animate(config: AnimateConfig): CancelFunction {
  let running = true
  let elapsedTime = 0
  let easingFunction = easingFunctions[config.easing ?? "linear"]

  let start = config.start ?? 0
  let end = config.end ?? 1
  let range = end - start

  onAnimationStartEvent.invoke(config)

  // Create a function to be called for each frame
  function frame(delayFrames = 0) {
    // Bail out if this animation has been canceled
    if (!running) {
      onAnimationStopEvent.invoke(config)
      return
    }

    const deltaTime = getDeltaTime()

    if (deltaTime === 0) {
      /**
       * Workaround for the fact that current capture implementation uses a double update,
       * which means that when in capture mode global update happens once, passing in
       * deltaTime of 0 on the second update.
       *
       * For reference see: https://docs.google.com/document/d/1NT_yadoaSFqWvVkeMCb2qs3Um4pTLfbnW9_ySubsBbw/edit
       *
       * This code simply skips all updates in the animate function when deltaTime is 0, ensuring
       * that the animation does not progress incorrectly when in capture mode.
       */
      AnimationManager.getInstance().requestAnimationFrame(() =>
        frame(delayFrames)
      )

      return
    }

    // Time only passes after the delay frames
    if (delayFrames === 0) {
      elapsedTime += deltaTime
    }

    // Calculate the raw and "eased" t
    let t: number
    let ended = false
    if (config.duration === "continuous") {
      // continuous animations run until canceled
      t = elapsedTime
    } else {
      let rawT = Math.min(1.0, elapsedTime / config.duration)
      let easedT = easingFunction(rawT)
      t = start + easedT * range
      ended = elapsedTime >= config.duration
    }

    // perform the update
    config.update(t)

    if (ended === true) {
      running = false
      config.ended?.()
    }

    // continue the animation
    AnimationManager.getInstance().requestAnimationFrame(() =>
      frame(delayFrames === 0 ? 0 : delayFrames - 1)
    )
  }

  // Create a Cancelation function to stop this animation at any time
  function cancel() {
    running = false
    config.cancelled?.()
  }

  config.cancelSet?.add(cancel)

  frame(config.delayFrames ?? 0)

  return cancel
}

export type CancelSet = {
  add(fn: () => void): void
  cancel(): void
  (): void
}

export type CancelSetConfig = {
  onCancel?: () => void
}

export type CancelSetClass = {
  new (config?: CancelSetConfig): CancelSet
}

export const CancelSet: CancelSetClass = class {
  constructor(config?: CancelSetConfig) {
    let calls: (() => void)[] = []
    function cancelSet() {
      for (let call of calls) {
        call()
      }
      calls = []
      config?.onCancel?.()
    }

    cancelSet.cancel = cancelSet

    cancelSet.add = (fn: () => void) => {
      calls.push(fn)
    }

    return cancelSet
  }
} as unknown as CancelSetClass

// mix matches theGLSL mix function , it is overloaded
// for numbers and vec{2,3,4}
// it provides linear interpolation between a and b by the inerpolator t
// this isvery useful in animations
export function mix(a: quat, b: quat, t: number): quat
export function mix(a: vec4, b: vec4, t: number): vec4
export function mix(a: vec3, b: vec3, t: number): vec3
export function mix(a: vec2, b: vec2, t: number): vec2
export function mix(a: number, b: number, t: number): number
export function mix(a: any, b: any, t: number) {
  if (typeof a === "number") {
    return mixNumbers(a, b, t)
  } else if (a instanceof vec2) {
    return new vec2(mixNumbers(a.x, b.x, t), mixNumbers(a.y, b.y, t))
  } else if (a instanceof vec3) {
    return new vec3(
      mixNumbers(a.x, b.x, t),
      mixNumbers(a.y, b.y, t),
      mixNumbers(a.z, b.z, t)
    )
  } else if (b instanceof vec4) {
    return new vec4(
      mixNumbers(a.x, b.x, t),
      mixNumbers(a.y, b.y, t),
      mixNumbers(a.z, b.z, t),
      mixNumbers(a.w, b.w, t)
    )
  } else if (b instanceof quat) {
    return quat.slerp(a, b, t)
  }
  throw new Error(`Illegal arguments`)
}

function mixNumbers(a: number, b: number, t: number): number {
  let range = b - a
  return a + range * t
}

/**
 * Copy of the TweenManager bezier implementation: https://docs.snap.com/lens-studio/references/guides/lens-features/adding-interactivity/helper-scripts/tween-manager
 * @param x1 the x coordinate of the first point in the bezier curve
 * @param y1 the y coordinate of the first point in the bezier curve
 * @param x2 the x coordinate of the second point in the bezier curve
 * @param y2 the y coordinate of the second point in the bezier curve
 * @returns interpolated number
 */
function createCubicBezierEasingFunction(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): (t: number) => number {
  const p0 = new vec2(0, 0)
  const p1 = new vec2(x1, y1)
  const p2 = new vec2(x2, y2)
  const p3 = new vec2(1, 1)
  return (t: number): number => {
    const oneMinusT = 1 - t

    return p0
      .uniformScale(oneMinusT * oneMinusT * oneMinusT)
      .add(p1.uniformScale(3.0 * oneMinusT * oneMinusT * t))
      .add(p2.uniformScale(3.0 * oneMinusT * t * t))
      .add(p3.uniformScale(t * t * t)).y
  }
}

@Singleton
export class AnimationManager {
  public static getInstance: () => AnimationManager

  private sceneObject: SceneObject
  private script: ScriptComponent
  private animationCallbacks: any[] = []
  private countCallbacks: any[] = []

  public constructor() {
    this.sceneObject = global.scene.createSceneObject("animate-EventDispatcher")
    this.script = this.sceneObject.createComponent("ScriptComponent")

    this.requestAnimationFrame = (callback) => {
      this.animationCallbacks.push(callback)
    }
    this.requestAnimationFrame.trackCounts = (callback) => {
      this.countCallbacks.push(callback)
    }

    this.script.createEvent("UpdateEvent").bind(() => {
      let callbacks = this.animationCallbacks

      // report the number of callbacks to the countCallbacks
      if (callbacks.length) {
        for (let callback of this.countCallbacks) {
          callback(callbacks.length)
        }
      }

      // Animation Frames often reques the next frame
      this.animationCallbacks = []
      for (let callback of callbacks) {
        callback()
      }
    })
  }

  requestAnimationFrame: AnimationManager.RequestAnimationFrameType
}
export namespace AnimationManager {
  export interface RequestAnimationFrameType {
    (callback: () => void): void
    trackCounts?: (callback: (count: number) => void) => void
  }
}
