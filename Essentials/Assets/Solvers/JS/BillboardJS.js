/**
 * The billboard solver allows the content to face a target, rotating only around the Y axis.
 */

//@input bool lookAway = true {"hint":"Is billboard looking at default direction or opposite?"}
//@input SceneObject target {"hint":"Override default target mainCamera with your target"}

function BillboardJS() {
    var _targetRotation = new quat(0, 0, 0, 1);
    var _lookDir = new vec3(0, 0, 0);
    
    // Initialize with the proper pattern
    script.createEvent("OnStartEvent").bind(onStart);
    script.createEvent("UpdateEvent").bind(onUpdate);
    
    function onStart() {
        // Camera handling is simplified as we don't have direct Camera.main access
        if (!script.target) {
            // In a real implementation, we would find the main camera
            // For now, this will be handled by the user setting the target
            print("No target set for Billboard - please set a target object");
        }
    }
    
    function onUpdate() {
        billboarding();
    }
    
    /**
     * Update the billboard orientation to face the target.
     */
    function billboarding() {
        if (!script.target) return;
        
        var myPosition = script.sceneObject.getTransform().getWorldPosition();
        var targetPosition = script.target.getTransform().getWorldPosition();
        
        // Get the direction to the target but flatten on the X and Z axes (only Y axis rotation)
        _lookDir = new vec3(
            targetPosition.x - myPosition.x,
            0, // Keep only Y axis rotation by zeroing out the Y component
            targetPosition.z - myPosition.z
        );
        
        // Normalize the direction vector
        var length = Math.sqrt(
            _lookDir.x * _lookDir.x + 
            _lookDir.z * _lookDir.z
        );
        
        if (length < 0.0001) return; // Avoid division by zero
        
        _lookDir.x /= length;
        _lookDir.z /= length;
        
        if (script.lookAway) {
            _lookDir.x *= -1;
            _lookDir.z *= -1;
        }
        
        // Convert the direction to a quaternion (y-axis rotation)
        // For y-axis rotation, we only care about the xz plane angle
        var angle = Math.atan2(_lookDir.x, _lookDir.z);
        _targetRotation = quat.fromEulerAngles(0, angle, 0);
        
        // Get current rotation
        var currentRotation = script.sceneObject.getTransform().getWorldRotation();
        
        // Slerp between current and target rotation
        var newRotation = quat.slerp(
            currentRotation,
            _targetRotation,
            getDeltaTime() * 5 // Adjust speed as needed
        );
        
        // Apply the new rotation
        script.sceneObject.getTransform().setWorldRotation(newRotation);
    }
}

// Register the script
script.BillboardJS = BillboardJS;
BillboardJS();
