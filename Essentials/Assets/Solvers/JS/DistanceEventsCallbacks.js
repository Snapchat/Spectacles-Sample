/**
 * Provides callback functions for DistanceEventsJS.
 * Attach this to objects and set the event functions in DistanceEventsJS to call the functions in this script.
 */

// Called when crossing the distance threshold (moving away from target)
script.onDistanceThresholdCrossed = function () {
  print(script.sceneObject.name + ": Distance threshold crossed!");
  // Add your custom logic here
};

// Called when returning back within the distance threshold
script.onReturnWithinThreshold = function () {
  print(script.sceneObject.name + ": Returned within distance threshold");
  // Add your custom logic here
};

// Example of a custom event that can show a UI element
script.showElement = function () {
  print(script.sceneObject.name + ": Showing element at distance threshold");
  // Add your logic to show a UI element or other object
};

// Example of a custom event that can hide a UI element
script.hideElement = function () {
  print(script.sceneObject.name + ": Hiding element at distance threshold");
  // Add your logic to hide a UI element or other object
};

// Example of a custom event that can trigger an animation
script.triggerAnimation = function () {
  print(script.sceneObject.name + ": Triggering animation at distance threshold");
  // Add your logic to trigger an animation
};

// Example of a custom event that can play a sound
script.playSound = function () {
  print(script.sceneObject.name + ": Playing sound at distance threshold");
  // Add your logic to play a sound
};

// Generic callback that can be customized in your scripts
script.onCallback1 = function () {
  print(script.sceneObject.name + ": Custom callback 1 triggered");
  // Add your custom logic here
};

// Generic callback that can be customized in your scripts
script.onCallback2 = function () {
  print(script.sceneObject.name + ": Custom callback 2 triggered");
  // Add your custom logic here
};

// Generic callback that can be customized in your scripts
script.onCallback3 = function () {
  print(script.sceneObject.name + ": Custom callback 3 triggered");
  // Add your custom logic here
};

print("DistanceEventsCallbacks initialized on " + script.sceneObject.name);
