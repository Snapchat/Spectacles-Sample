/**
 * CustomComponentJS.js
 * 
 * This is a sample custom component that will be accessed by the example script.
 * It provides a simple method and property that can be accessed.
 */

//@component

// Public property that can be accessed
script.textureSize = 512;

// Called when the component is initialized
script.onAwake = function() {
    print("CustomComponentJS has been initialized");
};

// Initialize the component
script.onAwake();

// Public method that can be called
script.hasTexture = function() {
    print("CustomComponentJS.hasTexture() called successfully");
    return true;
};
