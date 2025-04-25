import {Singleton} from "../../../Decorators/Singleton"
import NativeLogger from "../../../Utils/NativeLogger"

/**
 * Provides motion related APIs
 */
@Singleton
export default class MotionControllerProvider {
  public static getInstance: () => MotionControllerProvider
  private readonly log: NativeLogger
  private loadedModule: MotionControllerModule | undefined

  constructor() {
    this.log = new NativeLogger("MotionControllerProvider")
  }

  /**
   * Tries to create an ScriptObject.MotionControllerModule using {@link ModuleLoader}.
   * Stores and returns the created object if it can be successfully created.
   * Returns undefined if error happens during creation.
   *
   * @returns the created {@link MotionControllerModule} or undefined if it cannot be
   * created.
   */
  getModule(): MotionControllerModule | undefined {
    if (this.loadedModule !== undefined) {
      return this.loadedModule
    }

    if (MotionController.MotionType === undefined) {
      return undefined
    }

    try {
      this.loadedModule =
        require("LensStudio:MotionControllerModule") as MotionControllerModule
      return this.loadedModule
    } catch (error) {
      this.log.e(`Error creating module: ${error}`)
      return undefined
    }
  }
}
