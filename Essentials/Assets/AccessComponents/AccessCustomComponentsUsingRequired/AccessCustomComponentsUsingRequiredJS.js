/**
 * AccessCustomComponentsUsingRequiredJS.js
 *
 * This example demonstrates how to access custom components using the requireType function in JavaScript.
 */

//@input SceneObject targetObject {"label":"Target Object", "hint":"The scene object to find the component on. If not set, will use this object."}
//@input bool debug {"label":"Debug", "hint":"Enable debug logging"}

// Load the custom component type dynamically
// The path is relative to the current script's location
let typeName = requireType("./CustomComponentJS");

// Create an event for onStart
script.createEvent("OnStartEvent").bind(onStart);

function onStart() {
  try {
    script.debug && print("AccessCustomComponentsUsingRequiredJS initialized");

    // Get a reference to the target scene object or use the current one if not specified
    let targetSceneObject = script.targetObject || script.getSceneObject();

    // Get the component instance
    let customComponentExample = targetSceneObject.getComponent(typeName);

    // Call methods on the component
    let hasTexture = customComponentExample.hasTexture();
    script.debug && print("Component has texture: " + hasTexture);

    // Example of accessing properties
    if (customComponentExample.textureSize) {
      script.debug && print("Texture size: " + customComponentExample.textureSize);
    }
  } catch (error) {
    print("Error: " + error);
  }
}
