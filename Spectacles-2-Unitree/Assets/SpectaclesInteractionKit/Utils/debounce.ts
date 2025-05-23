import {LensConfig} from "./LensConfig"

export type AnyArg = any[]

/**
 * Debounces a function
 * @param debouncedFunction the function that needs debouncing
 * @param timeoutInMsecs the timeout for the debounce in milliseconds
 * @returns the debounced function
 */
export const debounce = (
  debouncedFunction: (...args: AnyArg) => void,
  timeoutInMsecs: number
) => {
  let timeoutId: ReturnType<typeof setTimeout>
  return (...args: AnyArg): void => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(
      () => debouncedFunction.apply(this, args),
      timeoutInMsecs
    )
  }
}

/**
 * Throttles a function
 * @param throttledFunction the function that needs throttling
 * @param delayMsecs the delay for the throttle in milliseconds
 * @returns the throttled function
 */
export const throttle = (
  throttledFunction: (...args: AnyArg) => void,
  delayMsecs: number
) => {
  let timeoutId: ReturnType<typeof setTimeout>
  let previousTime = 0

  return (...args: AnyArg): void => {
    const currentTime = Date.now()
    if (currentTime - previousTime < delayMsecs) {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(
        () => throttledFunction.apply(this, args),
        delayMsecs
      )
    } else {
      previousTime = currentTime
      throttledFunction.apply(this, args)
    }
  }
}
export type CancelToken = {
  cancelled: boolean
}
export function setTimeout(callback: () => void, time: number): CancelToken {
  let cancelToken: CancelToken = {cancelled: false}

  let updateDispatcher = LensConfig.getInstance().updateDispatcher

  let delayedEvent = updateDispatcher.createDelayedEvent()
  delayedEvent.reset(time / 1000)
  delayedEvent.bind((eventData: any) => {
    if (!cancelToken.cancelled) {
      callback()
    }
    updateDispatcher.removeDelayedEvent(delayedEvent)
  })
  return cancelToken
}
export function clearTimeout(timeoutId: CancelToken): void {
  if (timeoutId !== undefined && timeoutId.cancelled !== undefined) {
    timeoutId.cancelled = true
  }
}
