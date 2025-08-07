/**
 * CircleSlicingInstantiator - JavaScript version of the C# utility
 * Instantiates prefabs along slices of a circle (like pizza slices)
 */

//@input Asset.ObjectPrefab prefab {"hint":"Prefab to instantiate"}
//@input float xSlices = 8 {"hint":"Number of slices (radial divisions)"}
//@input float yElementsPerSlice = 5 {"hint":"Number of elements per slice"}
//@input float radius = 5.0 {"hint":"Radius of the circle"}
//@input SceneObject center {"hint":"Center point of the circle"}

function CircleSlicingInstantiator() {
    // Initialize with the proper pattern
    script.createEvent("OnStartEvent").bind(onStart);

    function onStart() {
        instantiateElementsInSlices();
    }

    // Method to instantiate the elements along the slices of the circle
    function instantiateElementsInSlices() {
        if (script.prefab == null || script.center == null) {
            print("Please assign both a prefab and a center SceneObject.");
            return;
        }

        // Angle step between each slice
        var angleStep = 360 / script.xSlices * (Math.PI / 180); // Convert to radians
        var centerPos = script.center.getTransform().getWorldPosition();

        // Loop through each slice
        for (var i = 0; i < script.xSlices; i++) {
            // Calculate the angle for this slice (in radians)
            var angle = i * angleStep;

            // Get the start and end points of the slice line (on the XZ plane)
            var sliceStart = new vec3(
                centerPos.x + Math.cos(angle) * script.radius,
                centerPos.y + Math.sin(angle) * script.radius,
                centerPos.z
            );

            var sliceEnd = new vec3(
                centerPos.x + Math.cos(angle + angleStep) * script.radius,
                centerPos.y + Math.sin(angle + angleStep) * script.radius,
                centerPos.z
            );

            // Instantiate Y elements along the slice (line)
            for (var j = 0; j < script.yElementsPerSlice; j++) {
                // Interpolate between the start and end points of the slice
                var t = j / (script.yElementsPerSlice - 1);
                var position = lerp(sliceStart, sliceEnd, t);

                // Create a prefab instance at the calculated position
                createPrefabInstance(position);
            }
        }
    }

    // Helper method to linearly interpolate between two points
    function lerp(start, end, t) {
        return new vec3(
            start.x + (end.x - start.x) * t,
            start.y + (end.y - start.y) * t,
            start.z + (end.z - start.z) * t
        );
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
script.CircleSlicingInstantiator = CircleSlicingInstantiator;
CircleSlicingInstantiator();
