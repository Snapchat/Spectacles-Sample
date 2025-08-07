/**
 * InstantiateAlongLineWithFixedDistance - JavaScript version of the C# utility
 * Instantiates objects along a line between two points with fixed distance between each
 */

//@input Asset.ObjectPrefab prefab {"hint":"The prefab to instantiate"}
//@input SceneObject startPoint {"hint":"The start point of the line"}
//@input SceneObject endPoint {"hint":"The end point of the line"}
//@input float fixedDistance = 1.0 {"hint":"Fixed distance between each instantiated object"}

function InstantiateAlongLineWithFixedDistance() {
    // Initialize with the proper pattern
    script.createEvent("OnStartEvent").bind(onStart);
    
    function onStart() {
        instantiateObjectsAlongLine();
    }
    
    function instantiateObjectsAlongLine() {
        if (script.fixedDistance <= 0 || !script.prefab || !script.startPoint || !script.endPoint) {
            print("Please set all necessary references and ensure the fixed distance is greater than zero.");
            return;
        }
        
        var startPosition = script.startPoint.getTransform().getWorldPosition();
        var endPosition = script.endPoint.getTransform().getWorldPosition();
        
        // Calculate direction vector
        var dx = endPosition.x - startPosition.x;
        var dy = endPosition.y - startPosition.y;
        var dz = endPosition.z - startPosition.z;
        
        // Calculate line length
        var lineLength = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        // Normalize direction vector
        var directionX = dx / lineLength;
        var directionY = dy / lineLength;
        var directionZ = dz / lineLength;
        
        // Calculate how many objects can fit within the line based on the fixed distance
        var numberOfObjects = Math.floor(lineLength / script.fixedDistance);
        
        for (var i = 0; i <= numberOfObjects; i++) {
            // Calculate the position for each object along the line
            var position = new vec3(
                startPosition.x + directionX * script.fixedDistance * i,
                startPosition.y + directionY * script.fixedDistance * i,
                startPosition.z + directionZ * script.fixedDistance * i
            );
            
            // Create a prefab instance at the calculated position
            createPrefabInstance(position);
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
script.InstantiateAlongLineWithFixedDistance = InstantiateAlongLineWithFixedDistance;
InstantiateAlongLineWithFixedDistance();
