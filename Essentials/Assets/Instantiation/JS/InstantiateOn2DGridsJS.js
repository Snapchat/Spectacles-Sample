/**
 * InstantiateOn2DGrids - JavaScript version of the C# utility
 * Instantiates objects in a 2D grid pattern on the XZ plane
 */

//@input Asset.ObjectPrefab prefab {"hint":"The prefab to instantiate"}
//@input SceneObject gridCenter {"hint":"The center of the grid"}
//@input float gridWidth = 5 {"hint":"Number of elements along the X axis"}
//@input float gridHeight = 5 {"hint":"Number of elements along the Z axis"}
//@input float spacingX = 1.5 {"hint":"Spacing between elements in the X direction"}
//@input float spacingY = 1.5 {"hint":"Spacing between elements in the Z direction"}
//@input float zPosition = 0.0 {"hint":"Fixed Y position for all elements on the XZ plane"}

function InstantiateOn2DGrids() {
    // Initialize with the proper pattern
    script.createEvent("OnStartEvent").bind(onStart);
    
    function onStart() {
        instantiateGrid();
    }
    
    function instantiateGrid() {
        if (!script.prefab || !script.gridCenter) {
            print("Please assign both the prefab and the grid center Transform.");
            return;
        }
        
        // Calculate the starting position based on the center of the grid
        var centerPosition = script.gridCenter.getTransform().getWorldPosition();
        var startPosition = new vec3(
            centerPosition.x - (script.gridWidth - 1) * script.spacingX / 2,
            centerPosition.y - (script.gridHeight - 1) * script.spacingY / 2,
            centerPosition.z + script.zPosition
        );
        
        // Loop through the rows and columns to instantiate the prefabs
        for (var x = 0; x < script.gridWidth; x++) {
            for (var z = 0; z < script.gridHeight; z++) {
                // Calculate the position for each prefab (on the XZ plane)
                var position = new vec3(
                    startPosition.x + x * script.spacingX,
                    startPosition.y + z * script.spacingY,
                    startPosition.z
                );
                
                // Create a prefab instance at the calculated position
                createPrefabInstance(position);
            }
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
script.InstantiateOn2DGrids = InstantiateOn2DGrids;
InstantiateOn2DGrids();
