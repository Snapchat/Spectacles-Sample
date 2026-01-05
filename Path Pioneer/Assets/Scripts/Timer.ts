import {Conversions} from "./Conversions"

@component
export class Timer extends BaseScriptComponent {
  @input
  timerText: Text

  @input
  lastLapTimeText: Text

  @input
  lastLapHUD: SceneObject

  private time: number = 0
  private runTimer: boolean = false

  onAwake() {
    this.timerText.enabled = false
    this.createEvent("UpdateEvent").bind(() => this.onUpdate())
  }

  onUpdate() {
    if (this.runTimer) {
      this.time += getDeltaTime()
      this.updateText(this.time, this.timerText)
    }
  }

  public stop() {
    this.time = 0
    this.updateText(this.time, this.timerText)
    this.updateText(this.time, this.lastLapTimeText)
    this.runTimer = false
  }

  start() {
    this.time = 0
    this.updateText(this.time, this.timerText)
    this.timerText.enabled = true
    this.runTimer = true
  }

  pause() {
    this.runTimer = false
  }

  incrementLap() {
    this.lastLapHUD.enabled = true
    this.updateText(this.time, this.lastLapTimeText)
  }

  private updateText(seconds: number, text: Text) {
    const minSec = Conversions.secToMin(seconds)
    const secStr = minSec.sec < 10 ? "0" + minSec.sec.toFixed(0) : minSec.sec.toFixed(0)
    const str = minSec.min + ":" + secStr
    text.text = str
  }
}
