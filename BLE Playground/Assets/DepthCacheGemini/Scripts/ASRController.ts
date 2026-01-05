import Event from "SpectaclesInteractionKit.lspkg/Utils/Event"

@component
export class ASRController extends BaseScriptComponent {
  private asr: AsrModule = require("LensStudio:AsrModule")
  private options = null
  //make an event for partial voice event that returns a string
  onPartialVoiceEvent = new Event<string>()
  onFinalVoiceEvent = new Event<string>()

  onAwake() {
    this.options = AsrModule.AsrTranscriptionOptions.create()
    this.options.silenceUntilTerminationMs = 500
    this.options.mode = AsrModule.AsrMode.Balanced
    this.options.onTranscriptionUpdateEvent.add((args) => {
      if (args.isFinal) {
        print("Final Transcription: " + args.text)
        this.onFinalVoiceEvent.invoke(args.text)
      } else {
        print("Partial: " + args.text)
        this.onPartialVoiceEvent.invoke(args.text)
      }
    })
    this.options.onTranscriptionErrorEvent.add((args) => {
      print("Error: " + args)
    })
  }

  startListening() {
    this.asr.startTranscribing(this.options)
    this.onPartialVoiceEvent.invoke("Listening...")
  }

  stopListening() {
    this.asr.stopTranscribing()
  }
}
