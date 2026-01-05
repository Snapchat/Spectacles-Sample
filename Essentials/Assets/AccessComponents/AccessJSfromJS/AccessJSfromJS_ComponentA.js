/**
 * AccessJSfromJS_ComponentA.js
 *
 * This component provides various properties and methods that can be accessed by other scripts.
 * It simulates a utility component that manages game state and provides helper functions.
 */

//@input
//  {"label":"Debug Mode", "hint":"Enable debug logging"}

// Initialize component properties
script.numberVal = 1;
script.textValue = "Hello World";
script.isActive = true;
script.lastUpdated = new Date().toISOString();
script.config = {
  maxValue: 100,
  minValue: 0,
  defaultSpeed: 5
};

// Counter for tracking method calls
let callCounter = 0;

/**
 * Print a hello message to the console
 */
script.printHelloWorld = function () {
  callCounter++;
  script.debug && print("Hello World! (Call #" + callCounter + ")");
  return "Hello World";
};

/**
 * Increment the number value by the specified amount
 * @param {number} amount - The amount to increment by (default: 1)
 * @returns {number} The new value
 */
script.incrementNumber = function (amount) {
  amount = amount || 1;
  script.numberVal += amount;
  script.lastUpdated = new Date().toISOString();
  script.debug && print("Number incremented to: " + script.numberVal);
  return script.numberVal;
};

/**
 * Set a new text value
 * @param {string} newText - The new text value
 * @returns {string} The new text value
 */
script.setText = function (newText) {
  if (typeof newText !== "string") {
    print("Error: setText requires a string parameter");
    return script.textValue;
  }

  script.textValue = newText;
  script.lastUpdated = new Date().toISOString();
  script.debug && print("Text set to: " + script.textValue);
  return script.textValue;
};

/**
 * Toggle the active state
 * @returns {boolean} The new active state
 */
script.toggleActive = function () {
  script.isActive = !script.isActive;
  script.lastUpdated = new Date().toISOString();
  script.debug && print("Active state toggled to: " + script.isActive);
  return script.isActive;
};

/**
 * Get the current component status
 * @returns {Object} An object containing the current status
 */
script.getStatus = function () {
  const status = {
    numberVal: script.numberVal,
    textValue: script.textValue,
    isActive: script.isActive,
    lastUpdated: script.lastUpdated,
    callCount: callCounter
  };

  script.debug && print("Status requested: " + JSON.stringify(status));
  return status;
};

// Initialize the component
script.debug && print("ComponentA initialized with numberVal: " + script.numberVal);
