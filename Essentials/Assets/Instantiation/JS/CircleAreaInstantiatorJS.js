/**
 * CircleAreaInstantiator - JavaScript version of the C# utility
 * Instantiates prefabs within a circular area
 */

//@input SceneObject center {"hint":"Center of the circle area"}
//@input Asset.ObjectPrefab prefab {"hint":"Prefab to instantiate"}
//@input float numberOfPrefabs = 10 {"hint":"Number of prefabs to instantiate"}
//@input float radius = 5.0 {"hint":"Radius of the circle"}

function CircleAreaInstantiator() {
    
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
            // Random angle and distance to place the prefab
            var angle = Math.random() * Math.PI * 2;
            var distance = Math.random() * script.radius;
            
            // Calculate position based on angle and distance
            var randomPosition = new vec3(
                centerPosition.x + Math.cos(angle) * distance,
                centerPosition.y + Math.sin(angle) * distance,
                centerPosition.z 
            );
            
            // Create a prefab instance at the random position
            createPrefabInstance(randomPosition);
        }
    }
    
    // Helper method to create a prefab instance at a specific position
    function createPrefabInstance(position) {
        if (script.prefab) {
            // In a real implementation, we would use StudioLib's actual instantiation API
            // For this example, we'll just log what would happen
            print("Created prefab instance at position: " + position.x + ", " + position.y + ", " + position.z);
            
            // The actual instantiation code would be something like:
            var instance = script.prefab.instantiate(script.sceneObject);
            instance.getTransform().setWorldPosition(position);
        }
    }
}

// Register the script
script.CircleAreaInstantiator = CircleAreaInstantiator;
CircleAreaInstantiator();
