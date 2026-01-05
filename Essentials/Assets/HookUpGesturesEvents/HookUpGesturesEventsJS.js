// Import required modules
const SIK = require("SpectaclesInteractionKit.lspkg/SIK").SIK;
const mix = require("SpectaclesInteractionKit.lspkg/Utils/animate").mix;

//@input Asset.ObjectPrefab prefabToInstantiate {"hint":"The prefab object we will instantiate when clicking the create button", "allowUndefined": true}
//@input SceneObject destinationReference {"hint":"The position reference the object will move to on left-hand pinch", "allowUndefined": true}
//@input float destroyDelay = 5 {"hint":"The delay time in seconds before the instantiated object is destroyed"}
//@input float lerpSpeed = 0.1 {"hint":"Speed at which the object moves to the destination on pinch"}

// Reference to the left hand input data
const leftHand = SIK.HandInputData.getHand("left"); // or right
// Reference to the stored instantiated object
let latestObject = null;
// Flag to check if the object is moving
let isMoving = false;

function onAwake() {
  // Wait for other components to initialize by deferring to OnStartEvent
  script.createEvent("OnStartEvent").bind(() => {
    onStart();
    print("Update event triggered");
  });

  script.createEvent("UpdateEvent").bind(() => {
    updateObjectMovement();
    print("Update event triggered");
  });
}

function onStart() {
  instantiate();

  // Create an event callback function for the left hand pinch down
  const onPinchDownCallback = () => {
    onLeftHandPinchDown(); // Call the function that handles pinch down
    print("OnPinchDown event triggered"); // Log the event for debugging
  };

  // Add the event listener to the left hand onPinchDown
  leftHand.onPinchDown.add(onPinchDownCallback);
  // or add different gestures from the GestureProvider
  // leftHand.onPinchUp.add(onPinchDownCallback)
  // https://developers.snap.com/spectacles/about-spectacles-features/apis/gesture-module
  // https://developers.snap.com/lens-studio/api/lens-scripting/modules/Packages_SpectaclesInteractionKit_Providers_HandInputData_GestureProvider_GestureModuleProvider.html
  // https://developers.snap.com/lens-studio/api/lens-scripting/classes/Packages_SpectaclesInteractionKit_Providers_HandInputData_GestureProvider_PalmTapDetection_PalmTapDetectorStateMachine.default.html
  // https://developers.snap.com/lens-studio/api/lens-scripting/classes/Packages_SpectaclesInteractionKit_Providers_HandInputData_GestureProvider_PinchDetection_PinchDetector.PinchDetector.html#onpinchdown
}

// Instantiate the prefab object
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
      isMoving = false;
    }
  });

  delayedEvent.reset(script.destroyDelay);
}

// Handle left hand pinch down event
function onLeftHandPinchDown() {
  if (!latestObject) return;

  if (isMoving) {
    // Stop movement if already moving and user pinches again
    isMoving = false;
  } else {
    // Start movement if not moving
    print("Left hand pinch detected. Moving object to destination...");
    isMoving = true;
  }
}

// Update the object movement to the destination
function updateObjectMovement() {
  if (isMoving && latestObject) {
    const currentPos = latestObject.getTransform().getWorldPosition();
    const targetPos = script.destinationReference.getTransform().getWorldPosition();

    const newPos = mix(currentPos, targetPos, script.lerpSpeed);
    latestObject.getTransform().setWorldPosition(newPos);
    print("Object is moving to destination");

    if (currentPos.distance(targetPos) < 0.01) {
      isMoving = false;
      print("Object reached destination. Waiting for next pinch.");
    }
  }
}

// Start the script
onAwake();
