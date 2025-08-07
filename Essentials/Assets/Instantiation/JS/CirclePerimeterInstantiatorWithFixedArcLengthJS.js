/**
 * CirclePerimeterInstantiatorWithFixedArcLength - JavaScript version of the C# utility
 * Instantiates prefabs along the perimeter of a circle with fixed arc length between instances
 */

//@input SceneObject center {"hint":"Center of the circle"}
//@input Asset.ObjectPrefab prefab {"hint":"Prefab to instantiate"}
//@input float radius = 5.0 {"hint":"Radius of the circle"}
//@input float numberOfPrefabs = 10 {"hint":"Number of prefabs to instantiate around the circle"}
//@input float arcLength = 2.0 {"hint":"Fixed arc length between instantiated prefabs (used only when numberOfPrefabs is 0)"}
//@input float startAngle = 0 {"hint":"Start angle of the arc in degrees (0-360)"}
//@input float arcAngleSpan = 360 {"hint":"Angular span of the arc in degrees (0-360, where 360 is a full circle)"}

function CirclePerimeterInstantiatorWithFixedArcLength() {
    // Initialize with the proper pattern
    script.createEvent("OnStartEvent").bind(onStart);

    function onStart() {
        instantiatePrefabs();
    }

    // Method to instantiate prefabs along the circle perimeter
    function instantiatePrefabs() {
        if (!script.center || !script.prefab || script.radius <= 0 || script.numberOfPrefabs <= 0) {
            print("Error: Invalid parameters! Ensure radius and number of prefabs are greater than zero, and center/prefab are assigned.");
            return;
        }

        // Convert angles to radians
        var startAngleRad = (script.startAngle * Math.PI) / 180;
        var arcSpanRad = (script.arcAngleSpan * Math.PI) / 180;
        
        // Get the number of prefabs to instantiate
        var prefabCount = script.numberOfPrefabs;
        
        // Calculate angle step based on the number of prefabs
        var angleStep = (prefabCount > 1) ? arcSpanRad / (prefabCount - 1) : 0;
        
        // If we're working with a very small arc or just one prefab
        if (prefabCount <= 1 || script.arcAngleSpan <= 0) {
            prefabCount = 1;
        }

        var centerPosition = script.center.getTransform().getWorldPosition();

        for (var i = 0; i < prefabCount; i++) {
            // Calculate angle for each prefab
            var angle = startAngleRad + (i * angleStep);

            // Calculate the position on the perimeter of the circle
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
}

// Register the script
script.CirclePerimeterInstantiatorWithFixedArcLength = CirclePerimeterInstantiatorWithFixedArcLength;
CirclePerimeterInstantiatorWithFixedArcLength();
