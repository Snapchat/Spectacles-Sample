// Import required modules
const SIK = require("SpectaclesInteractionKit.lspkg/SIK").SIK;

//@input Asset.ObjectPrefab prefabToInstantiate {"hint":"The prefab object we will instantiate when clicking the create button", "allowUndefined": true}
//@input SceneObject destinationReference {"hint":"The position reference the object will move to on left-hand pinch", "allowUndefined": true}
//@input Component.ScriptComponent createButton {"hint":"The button that will create the prefab object", "allowUndefined": true}
//@input float destroyDelay = 5 {"hint":"The delay time in seconds before the instantiated object is destroyed"}
//@input float lerpSpeed = 0.1 {"hint":"Speed at which the object moves to the destination on pinch"}

// Reference to the stored instantiated object
let latestObject = null;

function onAwake() {
  // Wait for other components to initialize by deferring to OnStartEvent
  script.createEvent("OnStartEvent").bind(() => {
    onStart();
    print("Onstart event triggered");
  });
}

function onStart() {
  if (!script.createButton) {
    print("Warning: Create button is not assigned!");
    return;
  }

  // Create an event callback function for the create button
  const onTriggerStartCallback = (event) => {
    if (!latestObject) {
      instantiate();
      print("Create button pressed. Instantiating the prefab object.");
    } else {
      print("Object already instantiated. Not creating a new one.");
    }
  };

  // Add the event listener directly to the create button
  // The createButton is already an Interactable component
  script.createButton.onInteractorTriggerStart(onTriggerStartCallback);
}

// Instantiate the prefab object on click
function instantiate() {
  if (!script.prefabToInstantiate) {
    print("Warning: Prefab to instantiate is not assigned!");
    return;
  }

  if (!script.destinationReference) {
    print("Warning: Destination reference is not assigned!");
    return;
  }

  latestObject = script.prefabToInstantiate.instantiate(null);
  latestObject.name = "MyNewObject";
  latestObject.getTransform().setWorldPosition(script.destinationReference.getTransform().getWorldPosition());

  const delayedEvent = script.createEvent("DelayedCallbackEvent");
  delayedEvent.bind(() => {
    if (latestObject) {
      latestObject.destroy();
      print(`Object destroyed after ${script.destroyDelay} seconds`);
      latestObject = null;
    }
  });

  delayedEvent.reset(script.destroyDelay);
}

// Start the script
onAwake();
