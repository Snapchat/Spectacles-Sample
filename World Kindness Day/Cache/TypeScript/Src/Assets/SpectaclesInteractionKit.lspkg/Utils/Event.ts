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
    this.subscribers = callbacks.filter((cb) => cb !== undefined) as callback<Arg>[]
  }

  /**
   * Register an event handler
   *
   * @param handler to register
   * @returns the function to invoke when unsubscribing from the event.
   */
  public add(handler: callback<Arg>): unsubscribe {
    this.subscribers.push(handler)
    return () => this.remove(handler)
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
    const fn = this.add.bind(this) // Can add callbacks directly or invoke add.
    const addRemoveObject = {add: this.add.bind(this), remove: this.remove.bind(this)}

    const publicApi = Object.assign(fn, addRemoveObject)

    return publicApi
  }
}
