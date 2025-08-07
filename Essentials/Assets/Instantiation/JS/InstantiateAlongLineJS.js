/**
 * InstantiateAlongLine - JavaScript version of the C# utility
 * Instantiates objects evenly spaced along a line between two points
 */

//@input Asset.ObjectPrefab prefab {"hint":"The prefab to instantiate"}
//@input SceneObject startPoint {"hint":"The start point of the line"}
//@input SceneObject endPoint {"hint":"The end point of the line"}
//@input float numberOfObjects = 10 {"hint":"Number of objects to instantiate along the line"}

function InstantiateAlongLine() {
    // Initialize with the proper pattern
    script.createEvent("OnStartEvent").bind(onStart);

    function onStart() {
        instantiateObjectsAlongLine();
    }

    function instantiateObjectsAlongLine() {
        if (script.numberOfObjects <= 0 || !script.prefab || !script.startPoint || !script.endPoint) {
            print("Please set all necessary references and ensure the number of objects is greater than zero.");
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

        // Calculate step size
        var step = lineLength / (script.numberOfObjects - 1);

        for (var i = 0; i < script.numberOfObjects; i++) {
            // Calculate the position for each object along the line
            var position = new vec3(
                startPosition.x + directionX * step * i,
                startPosition.y + directionY * step * i,
                startPosition.z + directionZ * step * i
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
script.InstantiateAlongLine = InstantiateAlongLine;
InstantiateAlongLine();
