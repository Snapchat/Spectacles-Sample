/**
 * Exposes distance-based events.
 */

//@input SceneObject target {"hint":"Target to measure distance from"}
//@input float[] distances = {} {"hint":"Distances that will trigger events when crossed (in meters)"}
//@input Component.ScriptComponent[] events = {} {"hint":"Script components (like DistanceEventsCallbacks) that have the callback functions"}
//@input string[] eventFunctions = {} {"hint":"Function names to call on the corresponding event scripts (e.g. 'onDistanceThresholdCrossed')"}
//@input bool triggerOnGreaterThan = true {"hint":"Whether to trigger when distance becomes greater than threshold (true) or less than threshold (false)"}

// Initialize state variables
var _ranges = [];
var _distanceToTarget = 0;
var _triggeredDistances = new Set();

// Initialize with the proper pattern
script.createEvent("OnStartEvent").bind(onStart);
script.createEvent("UpdateEvent").bind(onUpdate);

function onStart() {
  if (!script.target) {
    print("No target set for DistanceEvents - please set a target object");
    return;
  }

  // Setup the distance/event pairs from inspector values
  setupDistanceEvents();
}

/**
 * Sets up distance events based on inspector values
 *
 * How to use:
 * 1. Add distances to the "distances" array (e.g., 1, 2, 3 for 1m, 2m, 3m thresholds)
 * 2. For each distance, add a corresponding script component (like DistanceEventsCallbacks) to the "events" array
 * 3. For each script component, add the function name you want to call (e.g., "onDistanceThresholdCrossed") to the "eventFunctions" array
 */
function setupDistanceEvents() {
  // Clear any existing ranges
  clearRanges();

  // Validate that we have matching arrays
  if (script.distances.length === 0) {
    print("No distances defined for DistanceEvents");
    return;
  }

  if (script.distances.length !== script.events.length || script.events.length !== script.eventFunctions.length) {
    print("Error in DistanceEvents: Distances, events, and eventFunctions arrays must have the same length");
    return;
  }

  // Create a range for each distance/event pair
  for (var i = 0; i < script.distances.length; i++) {
    var distance = script.distances[i];
    var eventScript = script.events[i];
    var functionName = script.eventFunctions[i];

    if (!eventScript || !functionName) {
      print("Warning: Missing event script or function name for distance " + distance);
      continue;
    }

    // Create a threshold check range
    // If triggerOnGreaterThan is true, trigger when distance > threshold
    // Otherwise, trigger when distance < threshold
    var minDistance = script.triggerOnGreaterThan ? distance : 0;
    var maxDistance = script.triggerOnGreaterThan ? Number.MAX_VALUE : distance;

    var range = addRange(minDistance, maxDistance);

    // Use an immediately invoked function to create closure with current values
    (function (currentDistance, currentScript, currentFunction) {
      // Add event listener
      range.addOnEnterRangeListener(function () {
        // Only trigger if we haven't triggered for this distance yet
        if (!_triggeredDistances.has(currentDistance)) {
          _triggeredDistances.add(currentDistance);

          if (currentScript && typeof currentScript[currentFunction] === "function") {
            print("Calling " + currentFunction + " on " + currentScript.sceneObject.name);
            currentScript[currentFunction]();
          } else {
            print(
              "Warning: Function '" +
                currentFunction +
                "' not found on script " +
                (currentScript ? currentScript.sceneObject.name : "undefined")
            );
          }
        }
      });

      // Add exit listener to reset trigger state when leaving the range
      range.addOnExitRangeListener(function () {
        _triggeredDistances.delete(currentDistance);
      });
    })(distance, eventScript, functionName);
  }
}

function onUpdate() {
  if (!script.target) return;

  var myPosition = script.sceneObject.getTransform().getWorldPosition();
  var targetPosition = script.target.getTransform().getWorldPosition();

  // Calculate distance manually
  var dx = targetPosition.x - myPosition.x;
  var dy = targetPosition.y - myPosition.y;
  var dz = targetPosition.z - myPosition.z;
  _distanceToTarget = Math.sqrt(dx * dx + dy * dy + dz * dz);

  // Update all ranges
  for (var i = 0; i < _ranges.length; i++) {
    _ranges[i].update(_distanceToTarget);
  }
}

/**
 * Reset all triggered distances, allowing them to trigger again
 */
function resetTriggeredDistances() {
  _triggeredDistances.clear();
}

/**
 * Add a distance range with associated events.
 * @param minDistance The minimum distance for the range
 * @param maxDistance The maximum distance for the range
 * @returns The created DistanceRange object for event binding
 */
function addRange(minDistance, maxDistance) {
  var range = new DistanceRange(minDistance, maxDistance);
  _ranges.push(range);
  return range;
}

/**
 * Clear all registered distance ranges.
 */
function clearRanges() {
  _ranges = [];
}

/**
 * Get the current distance to the target.
 */
function getDistanceToTarget() {
  return _distanceToTarget;
}

// Make functions available to other scripts
script.resetTriggeredDistances = resetTriggeredDistances;
script.addRange = addRange;
script.clearRanges = clearRanges;
script.getDistanceToTarget = getDistanceToTarget;

/**
 * Represents a range of distances with associated events.
 */
function DistanceRange(minDistance, maxDistance) {
  this.minDistance = minDistance;
  this.maxDistance = maxDistance;

  this._insideRange = false;
  this._wasInsideRange = false;

  // Events
  this._onEnterRange = [];
  this._onPercentInsideRange = [];
  this._onExitRange = [];

  /**
   * Update the range status based on a new distance.
   * @param distance The current distance to check against the range
   */
  this.update = function (distance) {
    this._insideRange = distance >= this.minDistance && distance <= this.maxDistance;

    // Trigger enter range event
    if (this._insideRange && !this._wasInsideRange) {
      this.triggerOnEnterRange();
    }

    // Trigger percent inside range event if inside the range
    if (this._insideRange) {
      // Calculate the percentage (0-1) of how far into the range we are
      // 0 = at max distance (edge of range), 1 = at min distance (deepest in range)
      var percent = Math.max(0, Math.min(1, (this.maxDistance - distance) / (this.maxDistance - this.minDistance)));
      this.triggerOnPercentInsideRange(percent);
    }

    // Trigger exit range event
    if (!this._insideRange && this._wasInsideRange) {
      this.triggerOnExitRange();
    }

    this._wasInsideRange = this._insideRange;
  };

  /**
   * Add a listener for when entering the distance range.
   * @param callback The function to call when entering the range
   */
  this.addOnEnterRangeListener = function (callback) {
    this._onEnterRange.push(callback);
  };

  /**
   * Add a listener for the percentage inside the distance range.
   * @param callback The function to call with the percentage (0-1)
   */
  this.addOnPercentInsideRangeListener = function (callback) {
    this._onPercentInsideRange.push(callback);
  };

  /**
   * Add a listener for when exiting the distance range.
   * @param callback The function to call when exiting the range
   */
  this.addOnExitRangeListener = function (callback) {
    this._onExitRange.push(callback);
  };

  /**
   * Remove a listener for when entering the distance range.
   * @param callback The function to remove
   */
  this.removeOnEnterRangeListener = function (callback) {
    this._onEnterRange = this._onEnterRange.filter(function (cb) {
      return cb !== callback;
    });
  };

  /**
   * Remove a listener for the percentage inside the distance range.
   * @param callback The function to remove
   */
  this.removeOnPercentInsideRangeListener = function (callback) {
    this._onPercentInsideRange = this._onPercentInsideRange.filter(function (cb) {
      return cb !== callback;
    });
  };

  /**
   * Remove a listener for when exiting the distance range.
   * @param callback The function to remove
   */
  this.removeOnExitRangeListener = function (callback) {
    this._onExitRange = this._onExitRange.filter(function (cb) {
      return cb !== callback;
    });
  };

  /**
   * Trigger all registered enter range callbacks.
   */
  this.triggerOnEnterRange = function () {
    for (var i = 0; i < this._onEnterRange.length; i++) {
      this._onEnterRange[i]();
    }
  };

  /**
   * Trigger all registered percent inside range callbacks.
   * @param percent The percentage (0-1) inside the range
   */
  this.triggerOnPercentInsideRange = function (percent) {
    for (var i = 0; i < this._onPercentInsideRange.length; i++) {
      this._onPercentInsideRange[i](percent);
    }
  };

  /**
   * Trigger all registered exit range callbacks.
   */
  this.triggerOnExitRange = function () {
    for (var i = 0; i < this._onExitRange.length; i++) {
      this._onExitRange[i]();
    }
  };
}

print("DistanceEventsJS initialized");
