//@input SceneObject mySceneObject {"hint":"The object to access the component from"}
//@input bool debug {"hint":"Show logs in the console"}

var AccessComponentOnSceneObjectJS = function () {
  this.onAwake = function () {
    script.createEvent("OnStartEvent").bind(() => {
      this.onStart();
      script.debug && print("Start event triggered");
    });
  };

  this.onStart = function () {
    script.debug && print("onAwake");

    if (script.mySceneObject !== null) {
      script.debug && print("Scene object is not null");
      script.debug && print("Scene object name: " + script.mySceneObject.name);
    }

    if (script.mySceneObject.getComponent("Component.RenderMeshVisual")) {
      script.debug && print("Scene object has a RenderMeshVisual component");
    } else {
      script.debug && print("Scene object does not have a RenderMeshVisual component");
    }
  };
};

// Initialize the script
var instance = new AccessComponentOnSceneObjectJS();
instance.onAwake();
