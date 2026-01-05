/** Print details of an error that was caught. */
export function reportError(reason: unknown): void {
  if (reason instanceof Error) {
    print(`[reportError Error] ${reason.name}: ${reason.message}\n${reason.stack}`)
  } else if (typeof reason !== "string") {
    print(`[reportError !string] ${typeof reason}: ${reason}`)
  } else {
    print(`[reportError string] ${reason}`)
  }
}

/** Unconditional crash in any execution context. */
export function crashLens(reason: unknown): never {
  ;(globalThis as any)["___lc_async_event_error_handler"](reason)
  throw reason // so type checker will allow return type never
}
