import {Singleton} from "../Decorators/Singleton"
import {UpdateDispatcher} from "./UpdateDispatcher"

@Singleton
export class LensConfig {
  public static getInstance: () => LensConfig

  private sceneObject: SceneObject
  private script: ScriptComponent

  readonly updateDispatcher: UpdateDispatcher

  public constructor() {
    this.sceneObject = global.scene.createSceneObject("LensConfig-EventDispatcher")
    this.script = this.sceneObject.createComponent("ScriptComponent")

    this.updateDispatcher = new UpdateDispatcher(this.script)
  }
}
