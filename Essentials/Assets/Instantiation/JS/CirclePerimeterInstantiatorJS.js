/**
 * CirclePerimeterInstantiator - JavaScript version of the C# utility
 * Instantiates prefabs evenly spaced along the perimeter of a circle
 */

//@input SceneObject center {"hint":"Center of the circle"}
//@input Asset.ObjectPrefab prefab {"hint":"Prefab to instantiate"}
//@input float numberOfPrefabs = 10 {"hint":"Number of prefabs to instantiate"}
//@input float radius = 5.0 {"hint":"Radius of the circle"}

function CirclePerimeterInstantiator() {
    // Initialize with the proper pattern
    script.createEvent("OnStartEvent").bind(onStart);
    
    function onStart() {
        instantiatePrefabs();
    }
    
    // Method to instantiate prefabs along the circle perimeter
    function instantiatePrefabs() {
        if (!script.center || !script.prefab) {
            print("Error: Center or prefab not assigned!");
            return;
        }
        
        var centerPosition = script.center.getTransform().getWorldPosition();
        
        for (var i = 0; i < script.numberOfPrefabs; i++) {
            // Calculate angle for each prefab (evenly spaced)
            var angle = i * Math.PI * 2 / script.numberOfPrefabs;
            
            // Calculate position on the perimeter of the circle
            var positionOnCircle = new vec3(
                centerPosition.x + Math.cos(angle) * script.radius,
                centerPosition.y + Math.sin(angle) * script.radius,
                centerPosition.z
            );
            
            // Create a prefab instance at the calculated position
            createPrefabInstance(positionOnCircle);
        }
    }
    
    // Helper method to create a prefab instance at a specific position
    function createPrefabInstance(position) {
        if (script.prefab) {
            var instance = script.prefab.instantiate(script.sceneObject);
            instance.getTransform().setWorldPosition(position);
            print("Created prefab instance at position: " + position.x + ", " + position.y + ", " + position.z);
        }
    }
    
    // For visualization in the editor
    script.onDrawGizmos = function() {
        if (!script.center) return;
        
        var centerPos = script.center.getTransform().getWorldPosition();
        
        // Print visualization info
        print("Drawing circle perimeter with radius " + script.radius + " at center position " + centerPos.x + ", " + centerPos.y + ", " + centerPos.z);
    };
}

// Register the script
script.CirclePerimeterInstantiator = CirclePerimeterInstantiator;
CirclePerimeterInstantiator();
