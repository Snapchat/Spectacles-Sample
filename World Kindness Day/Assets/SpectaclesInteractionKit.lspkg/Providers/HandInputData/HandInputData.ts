import {Singleton} from "../../Decorators/Singleton"
import {HandType} from "./HandType"
import TrackedHand from "./TrackedHand"

export type HandInputDataConfig = {
  dominantHand: HandType
}

/**
 * Main class for the hand data provider apis.
 * Available apis:
 * - getHand(handType: {@link HandType}) => {@link BaseHand} returns BaseHand Object that
 * represents {@link HandType}
 * - getDominantHand() => {@link BaseHand} returns BaseHand Object that
 * represents the dominant hand as specified in the system through a Tweak.
 * - getNonDominantHand() => {@link BaseHand} returns BaseHand Object that
 * represents the non dominant hand as specified in the system through a Tweak.
 */
@Singleton
export class HandInputData {
  public static getInstance: () => HandInputData

  private _enabled = true

  private leftHand: TrackedHand
  private rightHand: TrackedHand
  private config: HandInputDataConfig
  constructor() {
    this.config = {
      dominantHand: "right"
    }
    this.leftHand = this.createHand("left")
    this.rightHand = this.createHand("right")
  }

  /**
   * Sets the enabled state of the left and right hand.
   * Events will not be called if isEnabled is set to false.
   */
  public set enabled(enabled: boolean) {
    if (this._enabled === enabled) {
      return
    }

    this.leftHand.setEnabled(enabled)
    this.rightHand.setEnabled(enabled)
    this._enabled = enabled
  }

  private createHand(handType: HandType): TrackedHand {
    return new TrackedHand({
      handType: handType,
      isDominantHand: handType === this.config.dominantHand
    })
  }

  public getHand(handType: HandType): TrackedHand {
    return handType === "left" ? this.leftHand : this.rightHand
  }
  public getDominantHand(): TrackedHand {
    return this.getHand(this.config.dominantHand)
  }
  public getNonDominantHand(): TrackedHand {
    const nonDominantHandType = this.config.dominantHand === "right" ? "left" : "right"
    return this.getHand(nonDominantHandType)
  }
  public setDominantHand(dominant: HandType) {
    this.config.dominantHand = dominant

    this.getHand("left").setIsDominantHand(dominant === "left")
    this.getHand("right").setIsDominantHand(dominant === "right")
  }
}
