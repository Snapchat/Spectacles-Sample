import {ColorParams} from "../../SyncControls/RealtimeStoreKeys"
import {SliderControlInput} from "./SliderControlInput"

export class SliderControl {
  // Array of callback functions to notify when the slider value changes
  private readonly onUserChangedColor: ((colorParam: ColorParams, value: number) => void)[] = []

  // Private variable to track the current value on the slider
  private sliderCustomUpdateCount: number = 0

  // Constructor initializes the control with input settings and sets up event listeners
  constructor(
    private readonly input: SliderControlInput,
    private readonly colorParam: ColorParams
  ) {
    // Subscribe to slider value updates
    this.input.slider.onValueUpdate.add((value) => {
      // Check if the update is from a manual user interaction
      if (this.sliderCustomUpdateCount > 0) {
        // Decrement the custom update count to prevent triggering callbacks
        --this.sliderCustomUpdateCount
      } else {
        // Notify all registered listeners about the color change
        this.onUserChangedColor.forEach((event) => event(colorParam, value))
      }
    })
  }

  // Method to subscribe to value changes, adding a callback to the list
  subscribeOnChanges(onUserChangedValue: (colorParam: ColorParams, value: number) => void) {
    this.onUserChangedColor.push(onUserChangedValue)
  }

  updateSlider(value: number) {
    ++this.sliderCustomUpdateCount
    this.input.slider.currentValue = value
  }
}
