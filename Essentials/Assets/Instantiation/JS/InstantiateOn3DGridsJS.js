/**
 * InstantiateOn3DGrids - JavaScript version of the C# utility
 * Instantiates objects in a 3D grid pattern
 */

//@input Asset.ObjectPrefab prefab {"hint":"The prefab to instantiate"}
//@input SceneObject gridCenter {"hint":"The center of the grid"}
//@input float gridWidth = 5 {"hint":"Number of elements along the X axis"}
//@input float gridHeight = 5 {"hint":"Number of elements along the Y axis"}
//@input float gridDepth = 5 {"hint":"Number of elements along the Z axis"}
//@input float spacingX = 1.5 {"hint":"Spacing between elements in the X direction"}
//@input float spacingY = 1.5 {"hint":"Spacing between elements in the Y direction"}
//@input float spacingZ = 1.5 {"hint":"Spacing between elements in the Z direction"}

function InstantiateOn3DGrids() {
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
        
        // Calculate the total width, height, and depth of the grid
        var totalWidth = (script.gridWidth - 1) * script.spacingX;
        var totalHeight = (script.gridHeight - 1) * script.spacingY;
        var totalDepth = (script.gridDepth - 1) * script.spacingZ;
        
        // Calculate the starting position so that the grid is centered at gridCenter
        var centerPosition = script.gridCenter.getTransform().getWorldPosition();
        var startPosition = new vec3(
            centerPosition.x - totalWidth / 2,
            centerPosition.y - totalHeight / 2,
            centerPosition.z - totalDepth / 2
        );
        
        // Loop through the width, height, and depth to instantiate the prefabs
        for (var x = 0; x < script.gridWidth; x++) {
            for (var y = 0; y < script.gridHeight; y++) {
                for (var z = 0; z < script.gridDepth; z++) {
                    // Calculate the position for each prefab
                    var position = new vec3(
                        startPosition.x + x * script.spacingX,
                        startPosition.y + y * script.spacingY,
                        startPosition.z + z * script.spacingZ
                    );
                    
                    // Create a prefab instance at the calculated position
                    createPrefabInstance(position);
                }
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
script.InstantiateOn3DGrids = InstantiateOn3DGrids;
InstantiateOn3DGrids();
