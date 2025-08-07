/**
 * RandomPointsInsideSphere - JavaScript version of the C# utility
 * Instantiates prefabs at random points inside a sphere
 */

//@input SceneObject sphere {"hint":"Reference to the sphere (center point)"}
//@input Asset.ObjectPrefab prefab {"hint":"Prefab to instantiate"}
//@input float numberOfPoints = 10 {"hint":"Number of random points to generate"}
//@input float radius = 1.0 {"hint":"Radius of the sphere"}

function RandomPointsInsideSphere() {
    // Initialize with the proper pattern
    script.createEvent("OnStartEvent").bind(onStart);
    
    function onStart() {
        generateRandomPointsInside();
    }
    
    function generateRandomPointsInside() {
        if (!script.sphere || !script.prefab) {
            print("Error: Sphere or prefab not assigned!");
            return;
        }
        
        var spherePosition = script.sphere.getTransform().getWorldPosition();
        
        for (var i = 0; i < script.numberOfPoints; i++) {
            // Generate a random point inside a unit sphere
            var randomPoint = randomPointInsideUnitSphere();
            
            // Scale by the radius and offset by the sphere position
            var randomPointInsideSphere = new vec3(
                spherePosition.x + randomPoint.x * script.radius,
                spherePosition.y + randomPoint.y * script.radius,
                spherePosition.z + randomPoint.z * script.radius
            );
            
            // Create a prefab instance at the calculated position
            createPrefabInstance(randomPointInsideSphere);
        }
    }
    
    // Helper method to create a random point inside a unit sphere
    function randomPointInsideUnitSphere() {
        // Implementation of the rejection sampling method
        while (true) {
            // Generate a random point in a cube
            var x = Math.random() * 2 - 1; // Range: -1 to 1
            var y = Math.random() * 2 - 1; // Range: -1 to 1
            var z = Math.random() * 2 - 1; // Range: -1 to 1
            
            // Check if the point is inside the unit sphere
            var lengthSquared = x * x + y * y + z * z;
            
            if (lengthSquared <= 1) {
                return new vec3(x, y, z);
            }
            
            // If not inside, try again
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
script.RandomPointsInsideSphere = RandomPointsInsideSphere;
RandomPointsInsideSphere();
