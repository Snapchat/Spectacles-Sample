/**
 * Collects a series of positions and detects sharp turns using the dot product.
 */

//@input float step = 10 {"hint":"Number of frames to skip between position checks"}
//@input float frameCount = 30 {"hint":"Number of frames to store for tracking movement"}
//@input float minVertexDistance = 0.001 {"hint":"Minimum distance between vertices to record a new position"}
//@input bool debug {"hint":"Enable debug logging"}

function SharpTurnJS() {
    // Events
    var _onTurn = [];
    
    // Internal tracking variables
    var _positions = [];
    var _currentIndex = 0;
    var _newestDirection = new vec3(0, 0, 0);
    var _oldestDirection = new vec3(0, 0, 0);
    
    // Initialize with the proper pattern
    script.createEvent("OnStartEvent").bind(onStart);
    script.createEvent("UpdateEvent").bind(onUpdate);
    
    function onStart() {
        // Initialize positions array
        _positions = new Array(script.frameCount).fill(null).map(function() { 
            return new vec3(0, 0, 0); 
        });
        
        // Initialize the first position
        _positions[_currentIndex] = script.sceneObject.getTransform().getWorldPosition();
    }
    
    function onUpdate() {
        // Get current position
        var currentPos = script.sceneObject.getTransform().getWorldPosition();
        
        // Only record position if moved enough
        if (getDistance(currentPos, _positions[_currentIndex]) > script.minVertexDistance) {
            // Move to the next index, looping around if necessary
            _currentIndex = (_currentIndex + 1) % script.frameCount;
            _positions[_currentIndex] = currentPos;
            
            // Ensure there are enough points for direction calculations
            if (_currentIndex >= script.step) {
                // Calculate directions
                var prevIndex = (_currentIndex - 1 + script.frameCount) % script.frameCount;
                var oldIndex = (_currentIndex - script.step + script.frameCount) % script.frameCount;
                
                _newestDirection = subtractVectors(
                    _positions[_currentIndex],
                    _positions[prevIndex]
                );
                
                _oldestDirection = subtractVectors(
                    _positions[_currentIndex],
                    _positions[oldIndex]
                );
                
                // Detect sharp turn using dot product
                var dotProduct = detectDotProduct(_newestDirection, _oldestDirection);
                
                if (script.debug) {
                    print("Dot Product: " + dotProduct.toFixed(4));
                }
                
                // Check if a sharp turn has occurred (dot product < -0.1)
                if (dotProduct < -0.1) {
                    if (script.debug) {
                        print("Transform has sharp turned!");
                    }
                    
                    // Trigger the turn event
                    triggerOnTurn();
                }
            }
        }
    }
    
    /**
     * Calculate the dot product between two direction vectors.
     * @param newestDirection The newest direction vector
     * @param oldestDirection The oldest direction vector
     * @returns The dot product (negative values indicate sharp turns)
     */
    function detectDotProduct(newestDirection, oldestDirection) {
        // Normalize the vectors
        var normalized1 = normalizeVector(newestDirection);
        var normalized2 = normalizeVector(oldestDirection);
        
        // Calculate dot product
        return dotProduct(normalized1, normalized2);
    }
    
    /**
     * Calculate the dot product between two vectors.
     */
    function dotProduct(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
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
     * Calculate the distance between two points.
     */
    function getDistance(a, b) {
        var dx = b.x - a.x;
        var dy = b.y - a.y;
        var dz = b.z - a.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }
    
    /**
     * Subtract two vectors.
     */
    function subtractVectors(a, b) {
        return new vec3(
            a.x - b.x,
            a.y - b.y,
            a.z - b.z
        );
    }
    
    /**
     * Add a listener for the turn event.
     * @param callback The function to call when a sharp turn is detected
     */
    function addOnTurnListener(callback) {
        _onTurn.push(callback);
    }
    
    /**
     * Remove a listener for the turn event.
     * @param callback The function to remove
     */
    function removeOnTurnListener(callback) {
        _onTurn = _onTurn.filter(function(cb) {
            return cb !== callback;
        });
    }
    
    /**
     * Trigger all registered turn callbacks.
     */
    function triggerOnTurn() {
        for (var i = 0; i < _onTurn.length; i++) {
            _onTurn[i]();
        }
    }
    
    // Expose public methods
    script.addOnTurnListener = addOnTurnListener;
    script.removeOnTurnListener = removeOnTurnListener;
}

// Register the script
script.SharpTurnJS = SharpTurnJS;
SharpTurnJS();
