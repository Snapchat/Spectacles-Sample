/**
 * Optionally matches the position, rotation, or scale of another object.
 * Works in-editor.
 */

//@input SceneObject target {"hint":"Override default target mainCamera"}
//@input vec3 positionOffset = {0,0,0} {"hint":"Position offset for matching the target's position"}
//@input bool usePositionLerp = true {"hint":"Use lerping for smooth position transitions"}
//@input float positionLerpSpeed = 1 {"hint":"Speed for moving towards the target's position (when lerping is enabled)"}
//@input float rotationLerpSpeed = 1 {"hint":"Speed for rotating towards the target's rotation"}
//@input float scaleLerpSpeed = 1 {"hint":"Speed for scaling towards the target's scale"}
//@input bool constrainPositionX {"hint":"Toggle to constrain movement on specific axes"}
//@input bool constrainPositionY
//@input bool constrainPositionZ
//@input bool constrainRotationX {"hint":"Toggle to constrain rotation on specific axes"}
//@input bool constrainRotationY
//@input bool constrainRotationZ
//@input bool constrainScaleX {"hint":"Toggle to constrain scaling on specific axes"}
//@input bool constrainScaleY
//@input bool constrainScaleZ

function MatchTransformJS() {
    // Initialize with the proper pattern
    script.createEvent("OnStartEvent").bind(onStart);
    script.createEvent("UpdateEvent").bind(onUpdate);
    
    function onStart() {
        if (!script.target) {
            print("No target set for MatchTransform - please set a target object");
        }
    }
    
    function onUpdate() {
        if (!script.target) return;
        
        updateTransform();
    }
    
    /**
     * Update this object's transform to match the target's transform with constraints.
     */
    function updateTransform() {
        // Get current transform details
        var myTransform = script.sceneObject.getTransform();
        var targetTransform = script.target.getTransform();
        
        // Handle position matching with optional constraints
        updatePosition(myTransform, targetTransform);
        
        // Handle rotation matching with optional constraints
        updateRotation(myTransform, targetTransform);
        
        // Handle scale matching with optional constraints
        updateScale(myTransform, targetTransform);
    }
    
    /**
     * Update the position based on target and constraints.
     */
    function updatePosition(myTransform, targetTransform) {
        // Get target position
        var targetPos = targetTransform.getWorldPosition();
        
        // Apply offset in world space
        // Note: In a real implementation with proper transform hierarchy,
        // we would need to transform the offset from local to world space
        var targetPosition = new vec3(
            targetPos.x + script.positionOffset.x,
            targetPos.y + script.positionOffset.y,
            targetPos.z + script.positionOffset.z
        );
        
        var currentPosition = myTransform.getWorldPosition();
        
        // Apply constraints
        var newPosition = new vec3(
            script.constrainPositionX ? currentPosition.x : targetPosition.x,
            script.constrainPositionY ? currentPosition.y : targetPosition.y,
            script.constrainPositionZ ? currentPosition.z : targetPosition.z
        );
        
        // Apply lerp if enabled, otherwise use direct position matching
        if (script.usePositionLerp) {
            // Smooth transition with lerp
            newPosition = lerpVector(
                currentPosition, 
                newPosition, 
                script.positionLerpSpeed * getDeltaTime()
            );
        } else {
            // Direct 1:1 position matching (no lerp)
            // newPosition is already set correctly from constraints
        }
        
        // Set the new position
        myTransform.setWorldPosition(newPosition);
    }
    
    /**
     * Update the rotation based on target and constraints.
     */
    function updateRotation(myTransform, targetTransform) {
        var targetRotation = targetTransform.getWorldRotation();
        var currentRotation = myTransform.getWorldRotation();
        
        // Convert to Euler angles for constraints
        var targetEuler = quaternionToEuler(targetRotation);
        var currentEuler = quaternionToEuler(currentRotation);
        
        // Apply constraints
        var newEuler = new vec3(
            script.constrainRotationX ? currentEuler.x : targetEuler.x,
            script.constrainRotationY ? currentEuler.y : targetEuler.y,
            script.constrainRotationZ ? currentEuler.z : targetEuler.z
        );
        
        // Convert back to quaternion
        var newRotation = quat.fromEulerAngles(newEuler.x, newEuler.y, newEuler.z);
        
        // Apply lerp
        var lerpedRotation = quat.slerp(
            currentRotation,
            newRotation,
            script.rotationLerpSpeed * getDeltaTime()
        );
        
        // Set the new rotation
        myTransform.setWorldRotation(lerpedRotation);
    }
    
    /**
     * Update the scale based on target and constraints.
     */
    function updateScale(myTransform, targetTransform) {
        var targetScale = targetTransform.getWorldScale();
        var currentScale = myTransform.getLocalScale();
        
        // Apply constraints
        var newScale = new vec3(
            script.constrainScaleX ? currentScale.x : targetScale.x,
            script.constrainScaleY ? currentScale.y : targetScale.y,
            script.constrainScaleZ ? currentScale.z : targetScale.z
        );
        
        // Apply lerp
        var lerpedScale = lerpVector(
            currentScale,
            newScale,
            script.scaleLerpSpeed * getDeltaTime()
        );
        
        // Set the new scale
        myTransform.setLocalScale(lerpedScale);
    }
    
    /**
     * Convert quaternion to Euler angles (in radians).
     * @param q The quaternion to convert
     * @returns Euler angles in radians (x, y, z order)
     */
    function quaternionToEuler(q) {
        // This is an approximation that works for most cases
        // In a real implementation, we would handle gimbal lock cases
        
        // Extract the Euler angles from the quaternion
        var x = q.x;
        var y = q.y;
        var z = q.z;
        var w = q.w;
        
        // Roll (x-axis rotation)
        var sinr_cosp = 2 * (w * x + y * z);
        var cosr_cosp = 1 - 2 * (x * x + y * y);
        var roll = Math.atan2(sinr_cosp, cosr_cosp);
        
        // Pitch (y-axis rotation)
        var sinp = 2 * (w * y - z * x);
        var pitch;
        if (Math.abs(sinp) >= 1) {
            // Use 90 degrees if out of range
            pitch = Math.sign(sinp) * Math.PI / 2;
        } else {
            pitch = Math.asin(sinp);
        }
        
        // Yaw (z-axis rotation)
        var siny_cosp = 2 * (w * z + x * y);
        var cosy_cosp = 1 - 2 * (y * y + z * z);
        var yaw = Math.atan2(siny_cosp, cosy_cosp);
        
        return new vec3(roll, pitch, yaw);
    }
    
    /**
     * Linear interpolation between two vectors.
     * @param a Start vector
     * @param b End vector
     * @param t Interpolation parameter (0-1)
     * @returns Interpolated vector
     */
    function lerpVector(a, b, t) {
        // Clamp t to [0, 1]
        var clampedT = Math.max(0, Math.min(1, t));
        
        // Interpolate each component
        return new vec3(
            a.x + (b.x - a.x) * clampedT,
            a.y + (b.y - a.y) * clampedT,
            a.z + (b.z - a.z) * clampedT
        );
    }
    
    // Expose public methods
    script.updateTransform = updateTransform;
}

// Register the script
script.MatchTransformJS = MatchTransformJS;
MatchTransformJS();
