import {BaseButton} from "SpectaclesUIKit.lspkg/Scripts/Components/Button/BaseButton"

@component
export class RacketEnabler extends BaseScriptComponent {
  @input
  button: BaseButton

  @input
  targetObject: SceneObject

  onAwake() {
    this.createEvent("OnStartEvent").bind(() => {
      this.onStart()
    })
  }

  onStart() {
    if (!this.button) {
      print("RacketEnabler: No button assigned.")
      return
    }

    if (!this.targetObject) {
      print("RacketEnabler: No target object assigned.")
      return
    }

    this.button.onTriggerUp.add(() => {
      this.enableTarget()
    })
  }

  enableTarget() {
    if (this.targetObject) {
      this.targetObject.enabled = true
      print("RacketEnabler: Enabled " + this.targetObject.name)
    }
  }
}
