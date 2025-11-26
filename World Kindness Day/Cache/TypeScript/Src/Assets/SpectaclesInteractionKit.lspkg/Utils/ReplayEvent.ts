import Event, {callback, unsubscribe} from "./Event"

/**
 * ReplayEvent keeps a buffer of {@link bufferSize} events that are emitted for
 * each new subscriber.
 */
export default class ReplayEvent<Arg = void> extends Event<Arg> {
  private _buffer: Arg[] = []

  constructor(
    private bufferSize: number = 1,
    ...callbacks: (callback<Arg> | undefined)[]
  ) {
    super(...callbacks)
    if (this.bufferSize < 1) throw new Error("Buffer size can't be < 1")
  }

  /**
   * Register an event handler
   *
   * @param handler to register
   * @returns the function to invoke when unsubscribing from the event.
   */
  public override add(handler: callback<Arg>): unsubscribe {
    super.add(handler)
    this._buffer.forEach((value: Arg) => {
      handler(value)
    })
    return () => {
      this.remove(handler)
    }
  }

  public override invoke(arg: Arg): void {
    super.invoke(arg)
    this._buffer.push(arg)
    this.trimBuffer()
  }

  private trimBuffer() {
    const currentBufferLength = this._buffer.length
    if (currentBufferLength > this.bufferSize) {
      this._buffer = this._buffer.splice(currentBufferLength - this.bufferSize)
    }
  }
}
