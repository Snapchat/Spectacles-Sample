/**
 * Tethers content to a target, but ONLY repositions when:
 * 1. The angle between target's forward and direction to object exceeds threshold, OR
 * 2. Vertical distance exceeds threshold, OR
 * 3. Horizontal distance exceeds threshold
 */

//@input SceneObject target {"hint":"Target object that the content should follow"}
//@input float angleThreshold = 45 {"hint":"Minimum angle (in degrees) required to trigger repositioning"}
//@input float verticalDistanceThreshold = 150 {"hint":"Minimum vertical distance required to trigger repositioning"}
//@input float horizontalDistanceThreshold = 150 {"hint":"Minimum horizontal distance required to trigger repositioning"}
//@input vec3 offset = {0,0,-100} {"hint":"Offset for positioning content relative to target"}
//@input float lerpSpeed = 5 {"hint":"Speed of position lerping"}
//@input bool showDebug {"hint":"Show debug information"}

function TetherBetweenAngleRangeJS() {
    // Private variables
    var _targetPosition = new vec3(0, 0, 0);
    var _lastRepositionTime = 0;
    var _currentAngle = 0;
    var _verticalDistance = 0;
    var _horizontalDistance = 0;
    var _needsRepositioning = false;

    // Initialize with the proper pattern
    script.createEvent("OnStartEvent").bind(onStart);
    script.createEvent("UpdateEvent").bind(onUpdate);

    function onStart() {
        if (!script.target) {
            print("TetherBetweenAngleRangeJS: No target set - please set a target object");
            return;
        }

        // Initialize target position
        _targetPosition = calculateNewTargetPosition();
    }

    function onUpdate() {
        if (!script.target) return;

        // Evaluate current conditions
        evaluateConditions();

        // Only recalculate target position if needed
        if (_needsRepositioning) {
            // Calculate new position
            _targetPosition = calculateNewTargetPosition();

            // Reset state
            _needsRepositioning = false;
            _lastRepositionTime = getTime();

            if (script.showDebug) {
                print("TetherBetweenAngleRangeJS: REPOSITIONING TO NEW POSITION");
            }
        }
        
        // Always update position with lerping
        updateContentPosition();
    }

    /**
     * Evaluate all conditions that could trigger repositioning
     */
    function evaluateConditions() {
        var myPos = script.sceneObject.getTransform().getWorldPosition();
        var targetPos = script.target.getTransform().getWorldPosition();

        // Calculate vector from target to object
        var targetToObject = new vec3(
            myPos.x - targetPos.x,
            myPos.y - targetPos.y,
            myPos.z - targetPos.z
        );
        
        // Calculate distances
        _verticalDistance = Math.abs(targetToObject.y);
        _horizontalDistance = Math.sqrt(
            targetToObject.x * targetToObject.x + 
            targetToObject.z * targetToObject.z
        );
        
        // Extra check for zero-length vectors to avoid NaN
        if (_horizontalDistance < 0.0001) {
            // We're directly above/below the target, so angle is undefined
            // Set to 0 by convention
            _currentAngle = 0;
            return;
        }
        
        // Calculate angle between target's forward and direction to object
        // on the horizontal plane (XZ plane)
        
        // 1. Get target's forward vector and flatten to XZ plane
        var targetRotation = script.target.getTransform().getWorldRotation();
        var targetForward = getForwardVector(targetRotation);
        var flatForward = normalizeVector(new vec3(targetForward.x, 0, targetForward.z));
        
        // 2. Get direction vector FROM target TO object, flattened to XZ plane
        var flatToObject = normalizeVector(new vec3(targetToObject.x, 0, targetToObject.z));
        
        // 3. Calculate dot product between these normalized vectors
        var dotProductResult = calculateDotProduct(flatForward, flatToObject);
        
        // 4. Convert dot product to angle in degrees
        // Note: dot(a,b) = |a|*|b|*cos(θ) = cos(θ) when vectors are normalized
        // When vectors align perfectly: cos(0°) = 1
        // When vectors are perpendicular: cos(90°) = 0
        // When vectors point opposite: cos(180°) = -1
        _currentAngle = 180 - Math.acos(Math.max(-1, Math.min(1, dotProductResult))) * (180 / Math.PI);
        
        if (script.showDebug) {
            print("Forward vector: (" + flatForward.x.toFixed(2) + ", " + flatForward.z.toFixed(2) + ")");
            print("Direction to object: (" + flatToObject.x.toFixed(2) + ", " + flatToObject.z.toFixed(2) + ")");
            print("Dot product: " + dotProductResult.toFixed(3) + " → Angle: " + _currentAngle.toFixed(1) + "°");
        }

        // Evaluate all conditions
        var angleTrigger = _currentAngle > script.angleThreshold;
        var verticalTrigger = _verticalDistance > script.verticalDistanceThreshold;
        var horizontalTrigger = _horizontalDistance > script.horizontalDistanceThreshold;

        // Need repositioning if ANY condition is met
        _needsRepositioning = angleTrigger || verticalTrigger || horizontalTrigger;

        // Debug output
        if (script.showDebug) {
            print("Angle: " + _currentAngle.toFixed(1) + "° > " + script.angleThreshold + "°? " + angleTrigger);
            print("VertDist: " + _verticalDistance.toFixed(1) + " > " + script.verticalDistanceThreshold + "? " + verticalTrigger);
            print("HorizDist: " + _horizontalDistance.toFixed(1) + " > " + script.horizontalDistanceThreshold + "? " + horizontalTrigger);

            if (_needsRepositioning) {
                print("NEEDS REPOSITIONING due to: " +
                    (angleTrigger ? "ANGLE " : "") +
                    (verticalTrigger ? "VERTICAL " : "") +
                    (horizontalTrigger ? "HORIZONTAL" : ""));
            } else {
                print("All conditions within thresholds - no repositioning needed");
            }
        }
    }

    /**
     * Calculate the new target position with offset.
     */
    function calculateNewTargetPosition() {
        var targetTransform = script.target.getTransform();
        var targetPos = targetTransform.getWorldPosition();
        var targetRot = targetTransform.getWorldRotation();

        // Get the forward and right vectors
        var forward = getForwardVector(targetRot);
        var right = getRightVector(targetRot);

        // Apply offset in target's local space
        return new vec3(
            targetPos.x + right.x * script.offset.x + forward.x * script.offset.z,
            targetPos.y + script.offset.y,
            targetPos.z + right.z * script.offset.x + forward.z * script.offset.z
        );
    }

    /**
     * Update the content's position with lerping.
     */
    function updateContentPosition() {
        var myTransform = script.sceneObject.getTransform();
        var currentPos = myTransform.getWorldPosition();

        // Lerp to the target position
        var newPos = lerpVector(
            currentPos,
            _targetPosition,
            script.lerpSpeed * getDeltaTime()
        );

        // Apply the new position
        myTransform.setWorldPosition(newPos);
    }

    /**
     * Get the forward vector from a rotation.
     */
    function getForwardVector(rotation) {
        // Transform the local forward vector (0,0,1) by the rotation
        return rotateVectorByQuaternion(new vec3(0, 0, 1), rotation);
    }

    /**
     * Get the right vector from a rotation.
     */
    function getRightVector(rotation) {
        // Transform the local right vector (1,0,0) by the rotation
        return rotateVectorByQuaternion(new vec3(1, 0, 0), rotation);
    }

    /**
     * Calculate the dot product between two vectors.
     */
    function calculateDotProduct(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
    }

    /**
     * Rotate a vector by a quaternion.
     */
    function rotateVectorByQuaternion(vector, rotation) {
        var x = rotation.x;
        var y = rotation.y;
        var z = rotation.z;
        var w = rotation.w;

        // Apply the quaternion rotation to the vector
        // Formula: q * v * q^-1 simplified
        var ix = w * vector.x + y * vector.z - z * vector.y;
        var iy = w * vector.y + z * vector.x - x * vector.z;
        var iz = w * vector.z + x * vector.y - y * vector.x;
        var iw = -x * vector.x - y * vector.y - z * vector.z;

        var result = new vec3(
            ix * w + iw * -x + iy * -z - iz * -y,
            iy * w + iw * -y + iz * -x - ix * -z,
            iz * w + iw * -z + ix * -y - iy * -x
        );

        return result;
    }

    /**
     * Linear interpolation between two vectors.
     */
    function lerpVector(a, b, t) {
        var clampedT = Math.max(0, Math.min(1, t));
        return new vec3(
            a.x + (b.x - a.x) * clampedT,
            a.y + (b.y - a.y) * clampedT,
            a.z + (b.z - a.z) * clampedT
        );
    }

    /**
     * Normalize a vector to unit length.
     */
    function normalizeVector(v) {
        var length = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);

        if (length < 0.0001) {
            return new vec3(0, 0, 0);
        }

        return new vec3(
            v.x / length,
            v.y / length,
            v.z / length
        );
    }
    
    // Expose public methods
    script.evaluateConditions = evaluateConditions;
    script.calculateNewTargetPosition = calculateNewTargetPosition;
    script.getCurrentAngle = function() { return _currentAngle; };
    script.getHorizontalDistance = function() { return _horizontalDistance; };
    script.getVerticalDistance = function() { return _verticalDistance; };
}

// Register the script
script.TetherBetweenAngleRangeJS = TetherBetweenAngleRangeJS;
TetherBetweenAngleRangeJS();
