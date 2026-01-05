// Debug flag
script.debug = true;

// Basic properties
script.numberVal = 1;
script.stringVal = "Hello from JS without declaration";
script.boolVal = true;
script.arrayVal = [10, 20, 30, 40, 50];
script.objectVal = {
  name: "JSComponentWithoutDeclaration",
  version: 2.0,
  features: ["noDeclaration", "dynamicTyping"]
};

// Methods
script.printHelloWorld = function () {
  script.debug && print("hello");
};

// Debug logging helper
script.log = function (message) {
  script.debug && print(message);
};

script.calculateSum = function (...numbers) {
  const result = numbers.reduce((sum, num) => sum + num, 0);
  script.debug && print(`Calculated sum of [${numbers.join(", ")}] = ${result}`);
  return result;
};

script.formatMessage = function (template, ...values) {
  const result = template.replace(/{(\d+)}/g, (match, index) => {
    return typeof values[index] !== "undefined" ? values[index] : match;
  });
  script.debug && print(`Formatted message: "${result}"`);
  return result;
};

// State management
script.counter = 0;

script.increment = function (amount = 1) {
  script.counter += amount;
  script.debug && print(`Counter incremented by ${amount} to ${script.counter}`);
  return script.counter;
};

script.reset = function () {
  script.counter = 0;
  script.debug && print("Counter reset to 0");
  return script.counter;
};

// Event system
script.eventListeners = {};

script.on = function (eventName, callback) {
  if (!script.eventListeners[eventName]) {
    script.eventListeners[eventName] = [];
  }
  script.eventListeners[eventName].push(callback);
  script.debug && print(`Event listener added for "${eventName}"`);
};

script.emit = function (eventName, ...args) {
  const listeners = script.eventListeners[eventName] || [];
  script.debug && print(`Emitting event "${eventName}" with ${listeners.length} listeners`);
  listeners.forEach((callback) => callback(...args));
};
