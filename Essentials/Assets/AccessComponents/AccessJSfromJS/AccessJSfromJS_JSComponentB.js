/**
 * AccessJSfromJS_JSComponentB.js
 *
 * This component demonstrates how to access and interact with another JavaScript component.
 * It uses the reference to ComponentA to call its methods and access its properties.
 */

//@input Component.ScriptComponent refScript {"label":"Component A", "hint":"Reference to ComponentA script"}
//@input bool debug {"label":"Debug Mode", "hint":"Enable debug logging"}
//@input int updateInterval = 60 {"label":"Update Interval", "hint":"Frames between updates", "min":1, "max":300}

// Counter for tracking frames
let frameCounter = 0;

// Create an event for onStart to ensure components are fully initialized
script.createEvent("OnStartEvent").bind(onStart);

// Create an event for update to demonstrate continuous interaction
script.createEvent("UpdateEvent").bind(onUpdate);

/**
 * Called when the script starts
 */
function onStart() {
  try {
    // Verify that the reference script exists
    if (!script.refScript) {
      print("Error: Reference to ComponentA is missing. Please set it in the Inspector.");
      return;
    }

    script.debug && print("ComponentB initialized, connected to ComponentA");

    // Access properties from ComponentA
    script.debug && print("Initial number value: " + script.refScript.numberVal);
    script.debug && print("Initial text value: " + script.refScript.textValue);
    script.debug && print("Initial active state: " + script.refScript.isActive);

    // Call methods on ComponentA
    script.refScript.printHelloWorld();
    script.refScript.incrementNumber(5);
    script.refScript.setText("Updated from ComponentB");

    // Get and display the current status
    const status = script.refScript.getStatus();
    script.debug && print("Current status: " + JSON.stringify(status));

    // Demonstrate error handling
    try {
      // Intentionally call setText with a non-string parameter
      script.refScript.setText(123);
    } catch (error) {
      script.debug && print("Caught error: " + error);
    }
  } catch (error) {
    print("Error in onStart: " + error);
  }
}

/**
 * Called every frame
 */
function onUpdate() {
  try {
    // Only run this code at the specified interval
    frameCounter++;
    if (frameCounter % script.updateInterval !== 0) return;

    // Skip if reference script is missing
    if (!script.refScript) return;

    // Demonstrate continuous interaction with ComponentA
    if (script.refScript.isActive) {
      // Increment the number value
      const newValue = script.refScript.incrementNumber(1);
      script.debug && print("Updated number value: " + newValue);

      // Toggle active state every 5 updates
      if (frameCounter % (script.updateInterval * 5) === 0) {
        const isActive = script.refScript.toggleActive();
        script.debug && print("Toggled active state to: " + isActive);
      }
    } else {
      // If not active, just print the current status
      const status = script.refScript.getStatus();
      script.debug && print("Component is inactive. Last updated: " + status.lastUpdated);

      // Reactivate after 3 updates
      if (frameCounter % (script.updateInterval * 3) === 0) {
        script.refScript.toggleActive();
        script.debug && print("Reactivated component");
      }
    }
  } catch (error) {
    print("Error in onUpdate: " + error);
  }
}
