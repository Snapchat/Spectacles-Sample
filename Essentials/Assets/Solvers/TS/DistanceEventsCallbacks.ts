/**
 * Provides callback functions for DistanceEventsTS.
 * Attach this to objects and set the event functions in DistanceEventsTS to call the functions in this script.
 */
@component
export class DistanceEventsCallbacks extends BaseScriptComponent {
  /**
   * Called when crossing the distance threshold (moving away from target).
   * Set this function name in the eventFunctions array of DistanceEventsTS.
   */
  onDistanceThresholdCrossed(): void {
    print(`${this.sceneObject.name}: Distance threshold crossed!`)
    // Add your custom logic here
  }

  /**
   * Called when returning back within the distance threshold.
   * Set this function name in the eventFunctions array of DistanceEventsTS.
   */
  onReturnWithinThreshold(): void {
    print(`${this.sceneObject.name}: Returned within distance threshold`)
    // Add your custom logic here
  }

  /**
   * Example of a custom event that can show a UI element.
   * Set this function name in the eventFunctions array of DistanceEventsTS.
   */
  showElement(): void {
    print(`${this.sceneObject.name}: Showing element at distance threshold`)
    // Add your logic to show a UI element or other object
  }

  /**
   * Example of a custom event that can hide a UI element.
   * Set this function name in the eventFunctions array of DistanceEventsTS.
   */
  hideElement(): void {
    print(`${this.sceneObject.name}: Hiding element at distance threshold`)
    // Add your logic to hide a UI element or other object
  }

  /**
   * Example of a custom event that can trigger an animation.
   * Set this function name in the eventFunctions array of DistanceEventsTS.
   */
  triggerAnimation(): void {
    print(`${this.sceneObject.name}: Triggering animation at distance threshold`)
    // Add your logic to trigger an animation
  }

  /**
   * Example of a custom event that can play a sound.
   * Set this function name in the eventFunctions array of DistanceEventsTS.
   */
  playSound(): void {
    print(`${this.sceneObject.name}: Playing sound at distance threshold`)
    // Add your logic to play a sound
  }

  /**
   * Generic callback that can be customized in your scripts.
   * Set this function name in the eventFunctions array of DistanceEventsTS.
   */
  onCallback1(): void {
    print(`${this.sceneObject.name}: Custom callback 1 triggered`)
    // Add your custom logic here
  }

  /**
   * Generic callback that can be customized in your scripts.
   * Set this function name in the eventFunctions array of DistanceEventsTS.
   */
  onCallback2(): void {
    print(`${this.sceneObject.name}: Custom callback 2 triggered`)
    // Add your custom logic here
  }

  /**
   * Generic callback that can be customized in your scripts.
   * Set this function name in the eventFunctions array of DistanceEventsTS.
   */
  onCallback3(): void {
    print(`${this.sceneObject.name}: Custom callback 3 triggered`)
    // Add your custom logic here
  }
}
