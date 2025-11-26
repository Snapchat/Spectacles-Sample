import {lazyProperty} from "./lazyProperty"
import NativeLogger from "./NativeLogger"

const TAG = "InputChecker"

/**
 *  Describes the input checker, that check if inputs are valid or not
 */
export class InputChecker {
  private log = new NativeLogger(TAG)

  constructor(private sceneObjectName: string) {}

  /**
   * Throws an error if an input is undefined, otherwise, returns the input
   * without the undefined type
   * @param input the input value to check, can be either typed or undefined
   * @param inputName the input name for logging
   * @returns input with typing
   */
  checkUndefined<Type>(input: Type | undefined, inputName: string): Type {
    if (input === undefined) {
      throw new Error(`${inputName} is not specified in SceneObject: ${this.sceneObjectName}`)
    }

    return input
  }

  /**
   * This can be used to delay the fetching of a script property until needed, which is useful for showIf
   * properties that may be unused.
   * @param getPropertyFunction The function to get the value of the property, when needed.
   * @param propertyName The name of the property, for logging.
   * @returns a function that will return the value of getPropertyFunction, which will only be called once
   */
  lazyScriptProperty<T>(getPropertyFunction: () => T, propertyName: string): () => T {
    return lazyProperty(() => {
      return this.checkUndefined(getPropertyFunction(), propertyName)
    })
  }

  /**
   * Log a warning if an input is undefined, otherwise, returns the input
   * without the undefined type
   * @param input the input value to check, can be either typed or undefined
   * @param inputName the input name for logging
   * @returns input with typing
   */
  warnIfUndefined<Type>(input: Type | undefined, inputName: string): Type | undefined {
    if (input === undefined) {
      this.log.w(`${inputName} is not specified in SceneObject: ${this.sceneObjectName}`)
    }

    return input
  }
}
