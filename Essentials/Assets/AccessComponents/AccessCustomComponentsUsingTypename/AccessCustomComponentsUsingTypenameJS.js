/**
 * AccessCustomComponentsUsingTypenameJS.js
 *
 * This example demonstrates how to access custom components using the @typename annotation in JavaScript.
 */

//@typename CustomComponentTS
//@input CustomComponentTS customComponent
//@input bool debug

// Create an event for onStart to ensure components are fully initialized
script.createEvent("OnStartEvent").bind(onStart);

function onStart() {
  try {
    script.debug && print("AccessCustomComponentsUsingTypenameJS initialized");

    // Access the component directly
    if (script.customComponent) {
      // Call methods on the component
      let hasTexture = script.customComponent.hasTexture();
      script.debug && print("Component has texture: " + hasTexture);

      // Access properties
      if (script.customComponent.textureSize !== undefined) {
        script.debug && print("Texture size: " + script.customComponent.textureSize);
      }
    } else {
      print("Custom component not found");
    }
  } catch (error) {
    print("Error: " + error);
  }
}
