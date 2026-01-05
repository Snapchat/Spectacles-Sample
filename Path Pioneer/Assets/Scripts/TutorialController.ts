import {UI} from "./UI"

@component
export class TutorialController extends BaseScriptComponent {
  @input
  ui: UI

  startTutorial(onTutorialFinished: () => void) {
    this.ui.showTutorialUi()
    this.ui.tutorialComplete.add(() => {
      onTutorialFinished()
    })
  }
}
