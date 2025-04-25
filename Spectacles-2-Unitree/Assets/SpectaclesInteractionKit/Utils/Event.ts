/**
 * Event class with typed event arguments
 */

export type callback<Arg> = (args: Arg) => void
export type unsubscribe = () => void

/**
 * Represents the public api of an event.
 */
export interface PublicApi<Arg> {
  (cb: callback<Arg>): unsubscribe
  add(cb: callback<Arg>): unsubscribe
  remove(cb: callback<Arg>): void
}

export default class Event<Arg = void> {
  private subscribers: callback<Arg>[]

  constructor(...callbacks: (callback<Arg> | undefined)[]) {
    this.subscribers = callbacks.filter(
      (cb) => cb !== undefined
    ) as callback<Arg>[]
  }

  /**
   * Register an event handler
   *
   * @param handler to register
   */
  public add(handler: callback<Arg>) {
    this.subscribers.push(handler)
  }

  /**
   * Unregister an event handler
   *
   * @param handler to remove
   */
  public remove(handler: callback<Arg>) {
    this.subscribers = this.subscribers.filter((h) => {
      return h !== handler
    })
  }

  /**
   * Invoke the event and notify handlers
   *
   * @param arg Event args to pass to the handlers
   */
  public invoke(arg: Arg) {
    this.subscribers.forEach((handler) => {
      handler(arg)
    })
  }

  /**
   * Construct an object to serve as the publicApi of this
   * event. This makes it so an event can be used as "pre-bound"
   * function, and also prevents "invoke" from being called externally
   */
  public publicApi(): PublicApi<Arg> {
    const event = this
    /**
     * @param callback
     */
    function add(callback: callback<Arg>) {
      event.add(callback)
      return () => event.remove(callback)
    }

    /**
     * @param callback
     */
    function remove(callback: callback<Arg>) {
      event.remove(callback)
    }

    add.remove = remove
    add.add = add // can be called as a method or directly
    return add
  }
}
