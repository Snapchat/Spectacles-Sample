//@input Component.ScriptComponent refScript
//@input bool debug = true

// Helper function for debug logging
script.log = function (message) {
  script.debug && print("[JSComponentB] " + message);
};

// Check if reference is valid
if (!script.refScript) {
  script.log("Error: TS Component reference is missing!");
} else {
  // Sync debug settings if possible
  if (typeof script.refScript.debug !== "undefined") {
    script.refScript.debug = script.debug;
    script.log("Debug settings synchronized with TS component");
  }

  // Access basic properties
  script.log("Number value: " + script.refScript.numberVal);
  script.log("String value: " + script.refScript.stringVal);
  script.log("Boolean value: " + script.refScript.boolVal);
  script.log("Array value: " + JSON.stringify(script.refScript.arrayVal));
  script.log("Object value: " + JSON.stringify(script.refScript.objectVal));

  // Call the original method
  script.refScript.printHelloWorld();

  // Call new methods
  var description = script.refScript.getDescription();
  script.log("Got description: " + description);

  // Use math operations
  var sum = script.refScript.add(10, 5);
  script.log("10 + 5 = " + sum);

  var product = script.refScript.multiply(7, 8);
  script.log("7 * 8 = " + product);

  // Use counter methods
  script.log("Initial counter: " + script.refScript.getCounter());
  script.log("After increment: " + script.refScript.incrementCounter());
  script.log("After increment by 10: " + script.refScript.incrementCounter(10));
  script.log("After reset: " + script.refScript.resetCounter());
}

// Public methods that can be called from elsewhere
script.toggleDebugMode = function () {
  script.debug = !script.debug;
  script.debug && script.log("Debug mode " + (script.debug ? "enabled" : "disabled"));

  // Also toggle debug in the TS component if available
  if (script.refScript && typeof script.refScript.toggleDebug === "function") {
    script.refScript.toggleDebug();
  }
};

script.incrementTSCounter = function (amount) {
  if (!script.refScript) return 0;
  amount = amount || 1; // Default to 1 if not specified
  return script.refScript.incrementCounter(amount);
};

script.resetTSCounter = function () {
  if (!script.refScript) return 0;
  return script.refScript.resetCounter();
};
