import { BalloonManager } from './BalloonManager'

@component
export class PledgeReadInOrder extends BaseScriptComponent {

  @input('vec4', '{1,0,0,1}')
  @widget(new ColorWidget())
  highlightColor: vec4;

  @input BalloonManager: BalloonManager;

  @input
  beginContainer?: SceneObject;

  @input
  pledgeContainer?: SceneObject;

  @input
  pledgeTexts?: Text[];

  private asrModule = require('LensStudio:AsrModule');
  private wordAt: number = 0;

  // Stop session
  private stopSession(): void {
    this.asrModule.stopTranscribing();
  }

  // Main ASR handler
  private onListenUpdate (eventData) {
    const word = eventData.text;
    print("[Pledge] " + word);

    // Guard index
    if (this.wordAt < 0 || this.wordAt >= this.pledgeTexts.length) {
      return;
    }

    const currentText = this.pledgeTexts[this.wordAt];

    if (word.toLowerCase().includes(currentText.text.toLowerCase())) {
      currentText.textFill.color = this.highlightColor;

      // If this is the last word, fire the balloon transform
      if (this.wordAt === this.pledgeTexts.length - 1) {
          this.BalloonManager.changeTransform();
          this.stopSession();
      } else {
        // Advance to the next word
        this.wordAt += 1;
      }
    } else {
      print("word is: " + word + " not matched for index " + this.wordAt);
    }
  }

  public init() {

    if (this.beginContainer) this.beginContainer.enabled = false;
    if (this.pledgeContainer) this.pledgeContainer.enabled = true;

    // Set up AsrModule
    const options = AsrModule.AsrTranscriptionOptions.create();
    options.mode = AsrModule.AsrMode.Balanced;

    options.onTranscriptionUpdateEvent.add((eventArgs) => this.onListenUpdate(eventArgs));

    // Start session
    this.asrModule.startTranscribing(options);
  }

}