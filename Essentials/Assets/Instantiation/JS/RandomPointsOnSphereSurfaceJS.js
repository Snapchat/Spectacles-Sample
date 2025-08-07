/**
 * RandomPointsOnSphereSurface - JavaScript version of the C# utility
 * Instantiates prefabs at random points on a sphere surface
 */

//@input SceneObject sphere {"hint":"Reference to the sphere (center point)"}
//@input Asset.ObjectPrefab prefab {"hint":"Prefab to instantiate"}
//@input float numberOfPoints = 10 {"hint":"Number of random points to generate"}
//@input float radius = 1.0 {"hint":"Radius of the sphere"}

function RandomPointsOnSphereSurface() {
    // Initialize with the proper pattern
    script.createEvent("OnStartEvent").bind(onStart);
    
    function onStart() {
        generateRandomPointsOnSurface();
    }
    
    function generateRandomPointsOnSurface() {
        if (!script.sphere || !script.prefab) {
            print("Error: Sphere or prefab not assigned!");
            return;
        }
        
        var spherePosition = script.sphere.getTransform().getWorldPosition();
        
        for (var i = 0; i < script.numberOfPoints; i++) {
            // Generate a random point on a unit sphere surface
            var randomPoint = randomPointOnUnitSphere();
            
            // Scale by the radius and offset by the sphere position
            var randomPointOnSphere = new vec3(
                spherePosition.x + randomPoint.x * script.radius,
                spherePosition.y + randomPoint.y * script.radius,
                spherePosition.z + randomPoint.z * script.radius
            );
            
            // Create a prefab instance at the calculated position
            createPrefabInstance(randomPointOnSphere);
        }
    }
    
    // Helper method to create a random point on a unit sphere surface
    function randomPointOnUnitSphere() {
        // Generate a random point in 3D space
        var x = Math.random() * 2 - 1; // Range: -1 to 1
        var y = Math.random() * 2 - 1; // Range: -1 to 1
        var z = Math.random() * 2 - 1; // Range: -1 to 1
        
        // Normalize to get a point on the unit sphere
        var length = Math.sqrt(x * x + y * y + z * z);
        
        // Handle the edge case of a zero vector (very unlikely)
        if (length === 0) {
            return new vec3(0, 1, 0); // Default to up vector
        }
        
        return new vec3(x / length, y / length, z / length);
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
script.RandomPointsOnSphereSurface = RandomPointsOnSphereSurface;
RandomPointsOnSphereSurface();
