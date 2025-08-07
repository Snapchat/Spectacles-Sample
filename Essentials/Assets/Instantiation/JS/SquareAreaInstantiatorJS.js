/**
 * SquareAreaInstantiator - JavaScript version of the C# utility
 * Instantiates prefabs within a square area
 */

//@input SceneObject center {"hint":"Center of the square area"}
//@input Asset.ObjectPrefab prefab {"hint":"Prefab to instantiate"}
//@input float numberOfPrefabs = 10 {"hint":"Number of prefabs to instantiate"}
//@input float size = 5.0 {"hint":"Size of the square (half-width/half-height)"}

function SquareAreaInstantiator() {
    // Initialize with the proper pattern
    script.createEvent("OnStartEvent").bind(onStart);
    
    function onStart() {
        instantiatePrefabs();
    }
    
    // Method to instantiate prefabs within the square area
    function instantiatePrefabs() {
        if (!script.center || !script.prefab) {
            print("Error: Center or prefab not assigned!");
            return;
        }
        
        var centerPosition = script.center.getTransform().getWorldPosition();
        
        for (var i = 0; i < script.numberOfPrefabs; i++) {
            // Random position within the square area
            var randomPosition = new vec3(
                centerPosition.x + (Math.random() * 2 - 1) * script.size,
                centerPosition.y + (Math.random() * 2 - 1) * script.size,
                centerPosition.z
            );
            
            // Create a prefab instance at the calculated position
            createPrefabInstance(randomPosition);
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
}

// Register the script
script.SquareAreaInstantiator = SquareAreaInstantiator;
SquareAreaInstantiator();
