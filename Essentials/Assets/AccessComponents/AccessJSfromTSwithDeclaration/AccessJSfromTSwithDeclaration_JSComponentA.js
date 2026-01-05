// Basic properties
script.numberVal = 1;
script.stringVal = "Hello from JS";
script.boolVal = true;
script.arrayVal = [1, 2, 3, 4, 5];
script.objectVal = {name: "JSComponent", version: 1.0};

// Methods
script.printHelloWorld = function () {
  print("hello");
};

script.add = function (a, b) {
  return a + b;
};

script.multiply = function (a, b) {
  return a * b;
};

// Event callback example
script.onValueChanged = function (callback) {
  script.valueChangedCallback = callback;
};

// Method that triggers the callback
script.updateValue = function (newValue) {
  script.numberVal = newValue;
  if (script.valueChangedCallback) {
    script.valueChangedCallback(newValue);
  }
};
