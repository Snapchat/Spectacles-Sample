/**
 * SimpleCircleAreaInstantiator - JavaScript version of the C# utility
 * Instantiates prefabs within a circular area using a simpler approach
 */

//@input SceneObject center {"hint":"Center of the circle area"}
//@input Asset.ObjectPrefab prefab {"hint":"Prefab to instantiate"}
//@input float numberOfPrefabs = 10 {"hint":"Number of prefabs to instantiate"}
//@input float radius = 5.0 {"hint":"Radius of the circle"}

function SimpleCircleAreaInstantiator() {
    // Initialize with the proper pattern
    script.createEvent("OnStartEvent").bind(onStart);
    
    function onStart() {
        instantiatePrefabs();
    }
    
    // Method to instantiate prefabs within the circle area
    function instantiatePrefabs() {
        if (!script.center || !script.prefab) {
            print("Error: Center or prefab not assigned!");
            return;
        }
        
        var centerPosition = script.center.getTransform().getWorldPosition();
        
        for (var i = 0; i < script.numberOfPrefabs; i++) {
            // Generate a random point in a unit circle (on XZ plane)
            var randomPoint = randomPointInsideUnitCircle();
            
            // Scale by radius and position at center
            var randomPosition = new vec3(
                centerPosition.x + randomPoint.x * script.radius,
                centerPosition.y + randomPoint.y * script.radius,
                centerPosition.z 
            );
            
            
            // Create a prefab instance at the calculated position
            createPrefabInstance(randomPosition);
        }
    }
    
    // Helper method to generate a random point inside a unit circle
    function randomPointInsideUnitCircle() {
        // Implementation based on rejection sampling
        var x, y;
        var lengthSquared;
        
        do {
            // Generate random point in the [-1,1] square
            x = Math.random() * 2 - 1;
            y = Math.random() * 2 - 1;
            
            // Check if it's inside the unit circle
            lengthSquared = x * x + y * y;
        } while (lengthSquared > 1.0 || lengthSquared == 0);
        
        return { x: x, y: y };
    }
    
    // Helper method to create a prefab instance at a specific position
    function createPrefabInstance(position) {
        if (script.prefab) {
            var instance = script.prefab.instantiate(script.sceneObject);
            instance.getTransform().setWorldPosition(position);
            print("Created prefab instance at position: " + position.x + ", " + position.y + ", " + position.z);
        }
    }
}

// Register the script
script.SimpleCircleAreaInstantiator = SimpleCircleAreaInstantiator;
SimpleCircleAreaInstantiator();
