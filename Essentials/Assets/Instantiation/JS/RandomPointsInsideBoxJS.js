/**
 * RandomPointsInsideBox - JavaScript version of the C# utility
 * Instantiates prefabs at random points inside a box volume
 */

//@input SceneObject boxObject {"hint":"Reference to the box (a SceneObject that defines the box center)"}
//@input Asset.ObjectPrefab prefab {"hint":"Prefab to instantiate"}
//@input float numberOfPoints = 10 {"hint":"Number of random points to generate"}
//@input float sizeX = 1.0 {"hint":"Size of the box in x direction"}
//@input float sizeY = 1.0 {"hint":"Size of the box in y direction"}
//@input float sizeZ = 1.0 {"hint":"Size of the box in z direction"}

function RandomPointsInsideBox() {
    // Initialize with the proper pattern
    script.createEvent("OnStartEvent").bind(onStart);
    
    function onStart() {
        generateRandomPointsInside();
    }
    
    function generateRandomPointsInside() {
        if (!script.boxObject || !script.prefab) {
            print("Error: Box object or prefab not assigned!");
            return;
        }
        
        var boxPosition = script.boxObject.getTransform().getWorldPosition();
        
        // For the JavaScript version, we're using four SceneObjects as the vertices
        // of the box instead of a direct box collider.
        // We'll use the provided sizeX, sizeY, sizeZ parameters for the box dimensions
        
        for (var i = 0; i < script.numberOfPoints; i++) {
            // Generate random point within the box volume
            var randomPoint = new vec3(
                boxPosition.x + (Math.random() - 0.5) * script.sizeX,
                boxPosition.y + (Math.random() - 0.5) * script.sizeY,
                boxPosition.z + (Math.random() - 0.5) * script.sizeZ
            );
            
            // Create a prefab instance at the calculated position
            createPrefabInstance(randomPoint);
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
script.RandomPointsInsideBox = RandomPointsInsideBox;
RandomPointsInsideBox();
