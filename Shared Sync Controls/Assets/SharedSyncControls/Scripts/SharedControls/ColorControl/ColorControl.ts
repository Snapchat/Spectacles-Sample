import {ColorParams} from "../SyncControls/RealtimeStoreKeys"
import {ColorControlInput} from "./ColorControlInput"
import {SliderControl} from "./SliderControl/SliderControl"

// The ColorControl class manages the color properties of an object,
// allowing users to adjust the color through sliders.
// It handles the initialization of color settings,
// listens for user interactions via sliders, updates the object's color accordingly,
// and notifies any subscribed listeners about changes in color values.
export class ColorControl {
  // Reference to the material pass of the object's mesh, used for color adjustments
  private readonly objectPass: Pass

  // Array of callback functions that are notified when the user changes the color
  private readonly onUserChangedColor: ((colorParam: ColorParams, value: number) => void)[] = []

  // Array to store slider controls corresponding to RGB color parameters
  private readonly sliderControls: SliderControl[] = []

  // Private variable to track the current object's color, initialized to white
  private _objectColor: vec4 = vec4.one()

  // Constructor initializes the control with input settings and sets up slider controls
  constructor(private readonly input: ColorControlInput) {
    this.objectPass = input.objectMesh.mainMaterial.mainPass

    // Create and configure slider controls for each input
    input.sliderControlsInput.forEach((value, index) => {
      this.sliderControls.push(new SliderControl(value, index))
      // Subscribe to changes from each slider control
      this.sliderControls[index].subscribeOnChanges((colorParam: ColorParams, value: number) => {
        // Notify listeners of color changes
        this.onUserChangedColor.forEach((event) => event(colorParam, value))
        // Update the object's color based on slider input
        this.updateObjectColor(index, value)
      })
    })
    // Initialize the object's color
    this.initColor(this._objectColor)

    input.root.enabled = false
  }

  // Method to start the color control, enabling its root component in the scene
  start() {
    this.input.root.enabled = true
  }
  // Method to stop the color control, disabling its root component in the scene
  stop() {
    this.input.root.enabled = false
  }

  // Method to subscribe to color changes, adding a callback to the list
  subscribeOnChanges(onUserChangedValue: (colorParam: ColorParams, value: number) => void) {
    this.onUserChangedColor.push(onUserChangedValue)
  }

  // Method to externally update the color of the object
  updateColor(colorParam: ColorParams, value: number) {
    this.updateObjectColor(colorParam, value)
    this.sliderControls[colorParam].updateSlider(value)
  }

  // Getter for objectColor, returns the current color of the object
  get objectColor(): vec4 {
    return this._objectColor
  }

  // Method to initialize the object's color and update corresponding sliders
  private initColor(color: vec4) {
    this._objectColor = color
    this.sliderControls[ColorParams.x].updateSlider(color.x)
    this.sliderControls[ColorParams.y].updateSlider(color.y)
    this.sliderControls[ColorParams.z].updateSlider(color.z)
    this.objectPass.baseColor = this._objectColor
  }

  // Private method to update the object's color based on a single RGB color parameter
  private updateObjectColor(colorParam: ColorParams, value: number) {
    switch (colorParam) {
      case ColorParams.x:
        this._objectColor.x = value
        break
      case ColorParams.y:
        this._objectColor.y = value
        break
      case ColorParams.z:
        this._objectColor.z = value
        break
    }
    // Apply the updated color to the object in the scene
    this.objectPass.baseColor = this._objectColor
  }
}
