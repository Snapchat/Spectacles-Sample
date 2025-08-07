/**
 * Tethers content to a target, repositioning when it moves too far away
 * or when the angle between target's forward and direction to object exceeds threshold.
 */

//@input SceneObject target {"hint":"Override default target mainCamera"}
//@input float verticalDistanceFromTarget = 0.1 {"hint":"Minimum vertical movement to recalculate position"}
//@input float horizontalDistanceFromTarget = 0.1 {"hint":"Minimum horizontal movement to recalculate position"}
//@input bool reorientDuringTargetRotation = true {"hint":"Should the content rotate and reposition with the target"}
//@input bool flattenDuringTargetRotation = true {"hint":"Flatten Y-axis rotation during target rotation"}
//@input vec3 offset = {0,0,0} {"hint":"Offset for tethering the content in relation to the target"}
//@input float lerpSpeed = 5 {"hint":"Lerp speed for smooth movement"}

function TetherJS() {
    var _targetPosition = new vec3(0, 0, 0);
    var _currentAngle = 0;
    var _flatAngle = 0;
    var _targetDir = new vec3(0, 0, 0);
    var _flatForward = new vec3(0, 0, 0);
    
    // Initialize with the proper pattern
    script.createEvent("OnStartEvent").bind(onStart);
    script.createEvent("UpdateEvent").bind(onUpdate);
    
    function onStart() {
        if (!script.target) {
            print("No target set for Tether - please set a target object");
            return;
        }
        
        // Initialize target position
        _targetPosition = calculateNewTargetPosition();
    }
    
    function onUpdate() {
        if (!script.target) return;
        
        // Calculate the angles
        _currentAngle = calculateAngle();
        _flatAngle = calculateFlatAngle();
        
        // Check if we need to reposition
        if (shouldReposition()) {
            _targetPosition = calculateNewTargetPosition();
        }
        
        // Update position with lerping
        updateContentPosition();
    }
    
    /**
     * Calculate the new target position based on offset and rotation settings.
     */
    function calculateNewTargetPosition() {
        var targetTransform = script.target.getTransform();
        var targetPos = targetTransform.getWorldPosition();
        
        if (script.reorientDuringTargetRotation) {
            if (script.flattenDuringTargetRotation) {
                // Get target's forward and right, but flatten them
                var targetRotation = targetTransform.getWorldRotation();
                
                // Get the forward direction
                var forward = getForwardVector(targetRotation);
                var flattenedForward = normalizeVector(new vec3(forward.x, 0, forward.z));
                
                // Get the right direction
                var right = getRightVector(targetRotation);
                var flattenedRight = normalizeVector(new vec3(right.x, 0, right.z));
                
                // Calculate new position using the flattened directions
                return new vec3(
                    targetPos.x + flattenedRight.x * script.offset.x + script.offset.y * 0 + flattenedForward.x * script.offset.z,
                    targetPos.y + flattenedRight.y * script.offset.x + script.offset.y * 1 + flattenedForward.y * script.offset.z,
                    targetPos.z + flattenedRight.z * script.offset.x + script.offset.y * 0 + flattenedForward.z * script.offset.z
                );
            } else {
                // Apply offset in target's local space
                var targetRot = targetTransform.getWorldRotation();
                
                // Transform offset by target's rotation
                var rotatedOffset = rotateVectorByQuaternion(script.offset, targetRot);
                
                // Add to target position
                return new vec3(
                    targetPos.x + rotatedOffset.x,
                    targetPos.y + rotatedOffset.y,
                    targetPos.z + rotatedOffset.z
                );
            }
        }
        
        // Simple offset in world space
        return new vec3(
            targetPos.x + script.offset.x,
            targetPos.y + script.offset.y,
            targetPos.z + script.offset.z
        );
    }
    
    /**
     * Check if the content should be repositioned.
     */
    function shouldReposition() {
        var myPos = script.sceneObject.getTransform().getWorldPosition();
        var targetPos = script.target.getTransform().getWorldPosition();
        
        // Calculate displacement vector to target
        var toTarget = new vec3(
            myPos.x - targetPos.x,
            myPos.y - targetPos.y,
            myPos.z - targetPos.z
        );
        
        // Calculate vertical and horizontal distances
        var verticalDistance = Math.abs(toTarget.y);
        var horizontalDistance = Math.sqrt(toTarget.x * toTarget.x + toTarget.z * toTarget.z);
        

        // Check if any threshold is exceeded
        return verticalDistance > script.verticalDistanceFromTarget || 
               horizontalDistance > script.horizontalDistanceFromTarget;
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
     * Calculate the angle between target's forward and direction to the object on XZ plane.
     */
    function calculateFlatAngle() {
        // Calculate direction from target to object
        var myPos = script.sceneObject.getTransform().getWorldPosition();
        var targetPos = script.target.getTransform().getWorldPosition();
        
        _targetDir = new vec3(
            myPos.x - targetPos.x,
            0, // Ignore Y component for flat angle calculation
            myPos.z - targetPos.z
        );
        
        // Get target's forward vector and flatten it
        var targetRotation = script.target.getTransform().getWorldRotation();
        var forward = getForwardVector(targetRotation);
        _flatForward = normalizeVector(new vec3(forward.x, 0, forward.z));
        
        // Calculate the signed angle
        return signedAngle(_targetDir, _flatForward);
    }
    
    /**
     * Calculate the signed angle between two vectors on the XZ plane.
     */
    function signedAngle(from, to) {
        // Ensure vectors are normalized
        var normalizedFrom = normalizeVector(from);
        var normalizedTo = normalizeVector(to);
        
        // Calculate the angle using dot product
        var dot = dotProduct(normalizedFrom, normalizedTo);
        var angle = Math.acos(Math.max(-1, Math.min(1, dot))) * (180 / Math.PI);
        
        // Determine the sign using cross product
        var cross = crossProduct(normalizedFrom, normalizedTo);
        if (cross.y < 0) angle = -angle;
        
        return angle;
    }
    
    /**
     * Calculate the cross product between two vectors.
     */
    function crossProduct(v1, v2) {
        return new vec3(
            v1.y * v2.z - v1.z * v2.y,
            v1.z * v2.x - v1.x * v2.z,
            v1.x * v2.y - v1.y * v2.x
        );
    }
    
    /**
     * Calculate the angle between target's forward and our forward.
     */
    function calculateAngle() {
        var myTransform = script.sceneObject.getTransform();
        var targetTransform = script.target.getTransform();
        
        // Get forward vectors
        var myForward = getForwardVector(myTransform.getWorldRotation());
        var targetForward = getForwardVector(targetTransform.getWorldRotation());
        
        // Calculate the angle between them
        var dot = dotProduct(myForward, targetForward);
        var angle = Math.acos(Math.max(-1, Math.min(1, dot))) * (180 / Math.PI);
        
        return angle;
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
    function dotProduct(v1, v2) {
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
    
    /**
     * Convert quaternion to Euler angles (degrees).
     */
    function quaternionToEulerAngles(q) {
        // Extract the Euler angles from the quaternion
        var x = q.x, y = q.y, z = q.z, w = q.w;
        
        // Roll (x-axis rotation)
        var sinr_cosp = 2 * (w * x + y * z);
        var cosr_cosp = 1 - 2 * (x * x + y * y);
        var roll = Math.atan2(sinr_cosp, cosr_cosp) * (180 / Math.PI);
        
        // Pitch (y-axis rotation)
        var sinp = 2 * (w * y - z * x);
        var pitch;
        if (Math.abs(sinp) >= 1) {
            // Use 90 degrees if out of range
            pitch = Math.sign(sinp) * 90;
        } else {
            pitch = Math.asin(sinp) * (180 / Math.PI);
        }
        
        // Yaw (z-axis rotation)
        var siny_cosp = 2 * (w * z + x * y);
        var cosy_cosp = 1 - 2 * (y * y + z * z);
        var yaw = Math.atan2(siny_cosp, cosy_cosp) * (180 / Math.PI);
        
        return new vec3(roll, pitch, yaw);
    }
    
    /**
     * Convert Euler angles (degrees) to quaternion.
     */
    function eulerAnglesToQuaternion(pitch, yaw, roll) {
        // Convert degrees to radians
        var pitchRad = pitch * (Math.PI / 180);
        var yawRad = yaw * (Math.PI / 180);
        var rollRad = roll * (Math.PI / 180);
        
        // Calculate quaternion components using Euler angles
        var cy = Math.cos(yawRad * 0.5);
        var sy = Math.sin(yawRad * 0.5);
        var cp = Math.cos(pitchRad * 0.5);
        var sp = Math.sin(pitchRad * 0.5);
        var cr = Math.cos(rollRad * 0.5);
        var sr = Math.sin(rollRad * 0.5);
        
        var w = cr * cp * cy + sr * sp * sy;
        var x = sr * cp * cy - cr * sp * sy;
        var y = cr * sp * cy + sr * cp * sy;
        var z = cr * cp * sy - sr * sp * cy;
        
        return new quat(x, y, z, w);
    }
    
    // Expose public methods
    script.calculateNewTargetPosition = calculateNewTargetPosition;
    script.shouldReposition = shouldReposition;
    script.getCurrentAngle = function() { return _currentAngle; };
    script.getFlatAngle = function() { return _flatAngle; };
}

// Register the script
script.TetherJS = TetherJS;
TetherJS();
