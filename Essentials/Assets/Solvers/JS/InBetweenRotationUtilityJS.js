/**
 * Utility for calculating rotations between two objects or directions.
 */

//@input SceneObject target1 {"hint":"First target for rotation calculation"}
//@input SceneObject target2 {"hint":"Second target for rotation calculation"}

function InBetweenRotationUtilityJS() {
    // Initialize with the proper pattern
    script.createEvent("OnStartEvent").bind(onStart);
    script.createEvent("UpdateEvent").bind(onUpdate);
    
    function onStart() {
        if (!script.target1 || !script.target2) {
            print("Warning: Both targets must be set for InBetweenRotationUtility");
        }
    }
    
    function onUpdate() {
        if (!script.target1 || !script.target2) return;
        
        var target1Forward = getForwardVector(script.target1);
        var target2Forward = getForwardVector(script.target2);
        
        // Apply the in-between rotation to this object
        var newRotation = getInBetweenRotation(target1Forward, target2Forward);
        script.sceneObject.getTransform().setWorldRotation(newRotation);
    }
    
    /**
     * Gets the in-between rotation between two transforms.
     * @param a The first transform
     * @param b The second transform
     * @returns The rotation exactly in between the forward directions of the two objects
     */
    function getInBetweenRotationFromTransforms(a, b) {
        if (!a || !b) {
            print("Warning: Can't calculate in-between rotation - one or both objects are null");
            return new quat(0, 0, 0, 1); // Identity quaternion
        }
        
        // Get the forward vectors of both objects
        var forwardA = getForwardVector(a);
        var forwardB = getForwardVector(b);
        
        // Get the in-between rotation
        return getInBetweenRotation(forwardA, forwardB);
    }
    
    /**
     * Gets the in-between rotation between two arbitrary directions.
     * @param directionA The first direction as a vec3
     * @param directionB The second direction as a vec3
     * @returns The rotation exactly in between the two directions
     */
    function getInBetweenRotation(directionA, directionB) {
        // Normalize the directions
        var normalizedA = normalizeVector(directionA);
        var normalizedB = normalizeVector(directionB);
        
        // Create quaternions based on the directions
        var rotationA = lookRotation(normalizedA);
        var rotationB = lookRotation(normalizedB);
        
        // Slerp between the two directions (50% interpolation for in-between)
        return quat.slerp(rotationA, rotationB, 0.5);
    }
    
    /**
     * Gets the forward vector from a transform.
     * @param obj The SceneObject to get the forward vector from
     * @returns The forward vector of the transform
     */
    function getForwardVector(obj) {
        if (!obj) return new vec3(0, 0, 1); // Default forward
        
        var transform = obj.getTransform();
        var worldRotation = transform.getWorldRotation();
        
        // Calculate forward vector (local Z axis in world space)
        // For a quat rotation, if we transform (0,0,1), we get the forward vector
        var forward = new vec3(0, 0, 1);
        return rotateVectorByQuaternion(forward, worldRotation);
    }
    
    /**
     * Rotates a vector by a quaternion.
     * @param vector The vector to rotate
     * @param rotation The quaternion rotation
     * @returns The rotated vector
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
     * Creates a quaternion that represents a rotation looking in a specified direction.
     * @param direction The direction to look at (forward vector)
     * @returns A quaternion representing the rotation
     */
    function lookRotation(direction) {
        // Simplified implementation of Quaternion.LookRotation
        // Default up vector is (0,1,0) - world up
        var up = new vec3(0, 1, 0);
        
        // Normalize direction
        var normalizedDirection = normalizeVector(direction);
        
        // Handle the case when direction is parallel to up
        if (Math.abs(normalizedDirection.x) < 0.0001 && 
            Math.abs(normalizedDirection.z) < 0.0001) {
            // Looking straight up or down
            if (normalizedDirection.y > 0) {
                // Looking up, rotate 180 degrees around X axis
                return quat.fromEulerAngles(Math.PI, 0, 0);
            } else {
                // Looking down, no rotation needed
                return new quat(0, 0, 0, 1);
            }
        }
        
        // Calculate right vector (cross product of up and forward)
        var right = normalizeVector(crossProduct(up, normalizedDirection));
        
        // Recalculate up vector (cross product of forward and right)
        var newUp = crossProduct(normalizedDirection, right);
        
        // Create rotation matrix from the orthonormal basis
        // Convert to quaternion
        var trace = right.x + newUp.y + normalizedDirection.z;
        
        if (trace > 0) {
            var s = 0.5 / Math.sqrt(trace + 1.0);
            return new quat(
                (newUp.z - normalizedDirection.y) * s,
                (normalizedDirection.x - right.z) * s,
                (right.y - newUp.x) * s,
                0.25 / s
            );
        } else {
            // Use the appropriate formula based on which diagonal element is largest
            if (right.x > newUp.y && right.x > normalizedDirection.z) {
                var s = 2.0 * Math.sqrt(1.0 + right.x - newUp.y - normalizedDirection.z);
                return new quat(
                    0.25 * s,
                    (right.y + newUp.x) / s,
                    (normalizedDirection.x + right.z) / s,
                    (newUp.z - normalizedDirection.y) / s
                );
            } else if (newUp.y > normalizedDirection.z) {
                var s = 2.0 * Math.sqrt(1.0 + newUp.y - right.x - normalizedDirection.z);
                return new quat(
                    (right.y + newUp.x) / s,
                    0.25 * s,
                    (newUp.z + normalizedDirection.y) / s,
                    (normalizedDirection.x - right.z) / s
                );
            } else {
                var s = 2.0 * Math.sqrt(1.0 + normalizedDirection.z - right.x - newUp.y);
                return new quat(
                    (normalizedDirection.x + right.z) / s,
                    (newUp.z + normalizedDirection.y) / s,
                    0.25 * s,
                    (right.y - newUp.x) / s
                );
            }
        }
    }
    
    /**
     * Calculates the cross product of two vectors.
     * @param a The first vector
     * @param b The second vector
     * @returns The cross product vector
     */
    function crossProduct(a, b) {
        return new vec3(
            a.y * b.z - a.z * b.y,
            a.z * b.x - a.x * b.z,
            a.x * b.y - a.y * b.x
        );
    }
    
    /**
     * Normalizes a vector to unit length.
     * @param vector The vector to normalize
     * @returns The normalized vector
     */
    function normalizeVector(vector) {
        var length = Math.sqrt(
            vector.x * vector.x +
            vector.y * vector.y +
            vector.z * vector.z
        );
        
        if (length < 0.0001) {
            return new vec3(0, 0, 1); // Default forward
        }
        
        return new vec3(
            vector.x / length,
            vector.y / length,
            vector.z / length
        );
    }
    
    // Expose public methods
    script.getInBetweenRotationFromTransforms = getInBetweenRotationFromTransforms;
    script.getInBetweenRotation = getInBetweenRotation;
    script.getForwardVector = getForwardVector;
}

// Register the script
script.InBetweenRotationUtilityJS = InBetweenRotationUtilityJS;
InBetweenRotationUtilityJS();
