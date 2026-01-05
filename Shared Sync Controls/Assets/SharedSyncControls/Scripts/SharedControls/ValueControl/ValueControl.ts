import {ValueControlInput} from "./ValueControlInput"

// The ValueControl class manages user interactions for incrementing
// and decrementing a numerical value through a user interface.
// It listens for button interactions, updates a counter value accordingly,
// and notifies subscribed listeners of any changes to this value.
export class ValueControl {
  // Array of callback functions that are notified when the user changes the value
  private readonly onUserChangedValue: ((value: number) => void)[] = []

  // Private variable to track the current counter value
  private _counterValue: number

  // Constructor initializes the control with input settings and sets up event listeners
  constructor(private readonly input: ValueControlInput) {
    // Add event listeners for button interactions
    input.valueUpButton.onButtonPinched.add(this.onButtonUpPinched)
    input.valueDownButton.onButtonPinched.add(this.onButtonDownPinched)

    // Initialize the counter value to 0
    this.counterValue = 0

    // Initially disable the root component of the value control
    input.root.enabled = false
  }

  // Method to start value control by enabling its root component in the scene
  start() {
    this.input.root.enabled = true
  }

  // Method to stop value control by disabling its root component in the scene
  stop() {
    this.input.root.enabled = false
  }

  // Method to subscribe to value changes by adding a callback to the list
  subscribeOnChanges(onUserChangedValue: (value: number) => void) {
    this.onUserChangedValue.push(onUserChangedValue)
  }

  // Method to externally update the counter value
  updateValue(value: number) {
    this.counterValue = value
  }

  // Method to update the counter value,
  // including updating the valueText object to reflect changes in the scene.
  // Triggered when the current user changes the value or
  // when the DataSynchronizationController class receives a message
  // indicating that another user in the session has updated the value.
  set counterValue(value: number) {
    this._counterValue = value
    this.input.valueText.text = "" + value
  }

  // Getter for counterValue that returns the current value of the counter
  get counterValue(): number {
    return this._counterValue
  }

  // Private method called when the "up" button is pinched, increments the counter value
  private onButtonUpPinched = (): void => {
    this.counterValue++
    // Notify all subscribed listeners of the value change
    this.onUserChangedValue.forEach((value) => value(this.counterValue))
  }

  // Private method called when the "down" button is pinched, decrements the counter value
  private onButtonDownPinched = (): void => {
    this.counterValue--
    // Notify all subscribed listeners of the value change
    this.onUserChangedValue.forEach((value) => value(this.counterValue))
  }
}
