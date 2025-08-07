/**
 * RandomPointsOnBoxSurface - JavaScript version of the C# utility
 * Instantiates prefabs at random points on the surface of a box
 */

//@input SceneObject boxObject {"hint":"Reference to the box (a SceneObject that defines the box center)"}
//@input Asset.ObjectPrefab prefab {"hint":"Prefab to instantiate"}
//@input float numberOfPoints = 10 {"hint":"Number of random points to generate"}
//@input float sizeX = 1.0 {"hint":"Size of the box in x direction"}
//@input float sizeY = 1.0 {"hint":"Size of the box in y direction"}
//@input float sizeZ = 1.0 {"hint":"Size of the box in z direction"}

function RandomPointsOnBoxSurface() {
    // Initialize with the proper pattern
    script.createEvent("OnStartEvent").bind(onStart);
    
    function onStart() {
        generateRandomPointsOnSurface();
    }
    
    function generateRandomPointsOnSurface() {
        if (!script.boxObject || !script.prefab) {
            print("Error: Box object or prefab not assigned!");
            return;
        }
        
        var boxPosition = script.boxObject.getTransform().getWorldPosition();
        
        for (var i = 0; i < script.numberOfPoints; i++) {
            // Generate a random point on the box surface
            var randomPoint = getRandomPointOnBoxSurface(boxPosition);
            
            // Create a prefab instance at the calculated position
            createPrefabInstance(randomPoint);
        }
    }
    
    // Helper method to generate a random point on the box surface
    function getRandomPointOnBoxSurface(boxCenter) {
        // Calculate the half-extents of the box
        var halfSizeX = script.sizeX / 2;
        var halfSizeY = script.sizeY / 2;
        var halfSizeZ = script.sizeZ / 2;
        
        // Randomly select one of the 6 faces of the box (0: +X, 1: -X, 2: +Y, 3: -Y, 4: +Z, 5: -Z)
        var randomFace = Math.floor(Math.random() * 6);
        
        var randomPoint = new vec3(0, 0, 0);
        
        switch (randomFace) {
            case 0: // +X face
                randomPoint = new vec3(
                    boxCenter.x + halfSizeX,
                    boxCenter.y + (Math.random() * 2 - 1) * halfSizeY,
                    boxCenter.z + (Math.random() * 2 - 1) * halfSizeZ
                );
                break;
                
            case 1: // -X face
                randomPoint = new vec3(
                    boxCenter.x - halfSizeX,
                    boxCenter.y + (Math.random() * 2 - 1) * halfSizeY,
                    boxCenter.z + (Math.random() * 2 - 1) * halfSizeZ
                );
                break;
                
            case 2: // +Y face
                randomPoint = new vec3(
                    boxCenter.x + (Math.random() * 2 - 1) * halfSizeX,
                    boxCenter.y + halfSizeY,
                    boxCenter.z + (Math.random() * 2 - 1) * halfSizeZ
                );
                break;
                
            case 3: // -Y face
                randomPoint = new vec3(
                    boxCenter.x + (Math.random() * 2 - 1) * halfSizeX,
                    boxCenter.y - halfSizeY,
                    boxCenter.z + (Math.random() * 2 - 1) * halfSizeZ
                );
                break;
                
            case 4: // +Z face
                randomPoint = new vec3(
                    boxCenter.x + (Math.random() * 2 - 1) * halfSizeX,
                    boxCenter.y + (Math.random() * 2 - 1) * halfSizeY,
                    boxCenter.z + halfSizeZ
                );
                break;
                
            case 5: // -Z face
                randomPoint = new vec3(
                    boxCenter.x + (Math.random() * 2 - 1) * halfSizeX,
                    boxCenter.y + (Math.random() * 2 - 1) * halfSizeY,
                    boxCenter.z - halfSizeZ
                );
                break;
        }
        
        return randomPoint;
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
script.RandomPointsOnBoxSurface = RandomPointsOnBoxSurface;
RandomPointsOnBoxSurface();
