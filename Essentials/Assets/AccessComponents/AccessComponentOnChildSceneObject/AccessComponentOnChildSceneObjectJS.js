//@input SceneObject parentSceneObject {"hint":"The parent scene object to access"}
//@input bool debug {"hint":"Show logs in the console"}

var AccessComponentOnChildSceneObjectJS = function () {
  this.onAwake = function () {
    script.createEvent("OnStartEvent").bind(() => {
      this.onStart();
      script.debug && print("Start event triggered");
    });
  };

  this.onStart = function () {
    script.debug && print("onAwake");

    if (script.parentSceneObject !== null && script.parentSceneObject.getChild(0) !== null) {
      script.debug && print("Parent scene object is not null");
      script.debug && print("Parent scene object name: " + script.parentSceneObject.name);
      script.debug && print("Parent child object name: " + script.parentSceneObject.getChild(0).name);
    }

    if (script.parentSceneObject.getChild(0).getComponent("Component.RenderMeshVisual")) {
      script.debug && print("Parent child object has a RenderMeshVisual component");
    } else {
      script.debug && print("Parent child object does not have a RenderMeshVisual component");
    }
  };
};

// Initialize the script
var instance = new AccessComponentOnChildSceneObjectJS();
instance.onAwake();
