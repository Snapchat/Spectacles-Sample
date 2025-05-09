import {Singleton} from "../../../Decorators/Singleton"
import NativeLogger from "../../../Utils/NativeLogger"

/**
 * Provides gesture related APIs.
 */
@Singleton
export default class GestureModuleProvider {
  public static getInstance: () => GestureModuleProvider
  private readonly log: NativeLogger
  private loadedModule: GestureModule | undefined

  constructor() {
    this.log = new NativeLogger("GestureModuleProvider")
  }

  /**
   * Tries to create an ScriptObject.GestureModule using {@link ModuleLoader}.
   * Stores and returns the created object if it can be successfully created.
   * Returns undefined if error happens during creation.
   *
   * @returns the created {@link GestureModule} or undefined if it cannot be created.
   */
  getModule(): GestureModule | undefined {
    if (this.loadedModule !== undefined) {
      return this.loadedModule
    }

    if (GestureModule.HandType === undefined) {
      return undefined
    }

    try {
      this.loadedModule = require("LensStudio:GestureModule") as GestureModule
      return this.loadedModule
    } catch (error) {
      this.log.e(`Error creating module: ${error}`)
      return undefined
    }
  }
}
