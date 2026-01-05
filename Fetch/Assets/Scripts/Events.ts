export type callback<Arg> = (args: Arg) => void

export default class Event<Arg = void> {
  private subscribers: callback<Arg>[]

  constructor(...callbacks: (callback<Arg> | undefined)[]) {
    this.subscribers = callbacks.filter((cb) => cb !== undefined) as callback<Arg>[]
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
}
