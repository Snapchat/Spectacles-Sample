/**
 * Linear Scale of content over distance from target
 */

//@input SceneObject target {"hint":"Override default target mainCamera"}
//@input float minDistance = 1 {"hint":"Minimum distance to map the scaling"}
//@input float maxDistance = 10 {"hint":"Maximum distance to map the scaling"}
//@input float minScale = 0.5 {"hint":"Minimum scale value"}
//@input float maxScale = 2 {"hint":"Maximum scale value"}

function ScaleOverDistanceLinearJS() {
    var _distance = 0;
    
    // Initialize with the proper pattern
    script.createEvent("OnStartEvent").bind(onStart);
    script.createEvent("UpdateEvent").bind(onUpdate);
    
    function onStart() {
        if (!script.target) {
            print("No target set for ScaleOverDistanceLinear - please set a target object");
        }
    }
    
    function onUpdate() {
        if (!script.target) return;
        
        updateScale();
    }
    
    /**
     * Update the scale based on distance to target.
     */
    function updateScale() {
        // Get positions
        var myPosition = script.sceneObject.getTransform().getWorldPosition();
        var targetPosition = script.target.getTransform().getWorldPosition();
        
        // Calculate distance
        _distance = calculateDistance(myPosition, targetPosition);
        
        // Calculate scale value based on distance
        var scale = remap(
            _distance, 
            script.minDistance, 
            script.maxDistance, 
            script.minScale, 
            script.maxScale
        );
        
        // Apply uniform scale
        script.sceneObject.getTransform().setLocalScale(new vec3(scale, scale, scale));
    }
    
    /**
     * Calculate the distance between two points.
     */
    function calculateDistance(pointA, pointB) {
        // Calculate absolute distance
        var dx = pointB.x - pointA.x;
        var dy = pointB.y - pointA.y;
        var dz = pointB.z - pointA.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }
    
    /**
     * Remap a value from one range to another.
     * @param value The value to remap
     * @param from1 Minimum of the input range
     * @param to1 Maximum of the input range
     * @param from2 Minimum of the output range
     * @param to2 Maximum of the output range
     * @returns Remapped value
     */
    function remap(value, from1, to1, from2, to2) {
        // Ensure value is within the input range
        var clampedValue = Math.max(from1, Math.min(to1, value));
        
        // Calculate how far along the input range the value is (0 to 1)
        var percentage = (clampedValue - from1) / (to1 - from1);
        
        // Map that percentage to the output range
        return from2 + percentage * (to2 - from2);
    }
    
    // Expose public methods
    script.updateScale = updateScale;
    script.getDistance = function() { return _distance; };
}

// Register the script
script.ScaleOverDistanceLinearJS = ScaleOverDistanceLinearJS;
ScaleOverDistanceLinearJS();
