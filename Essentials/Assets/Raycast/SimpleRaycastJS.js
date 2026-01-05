// Given an object with a BodyComponent
// If the object intersects with the ray described
// by rayStart and rayEnd, print a message.

//@input SceneObject rayStart
//@input SceneObject rayEnd
//@input SceneObject endPointAttachment {"allowUndefined": true}

function onAwake() {
  // Check if endPointAttachment is defined
  print("EndPointAttachment object defined: " + (script.endPointAttachment !== undefined));

  script.createEvent("OnStartEvent").bind(() => {
    onStart();
  });

  script.createEvent("UpdateEvent").bind(() => {
    updateObjectMovement();
  });
}

function onStart() {
  // Check if endPointAttachment is defined at start
  print("EndPointAttachment object at start: " + (script.endPointAttachment !== undefined));
  if (script.endPointAttachment) {
    print("EndPointAttachment object name: " + script.endPointAttachment.name);
  }
}

function updateObjectMovement() {
  // Create a probe to raycast through all worlds.
  var globalProbe = Physics.createGlobalProbe();

  // Check if endPointAttachment is defined before raycasting
  print("EndPointAttachment object before raycast: " + (script.endPointAttachment !== undefined));

  globalProbe.rayCast(
    script.rayStart.getTransform().getWorldPosition(),
    script.rayEnd.getTransform().getWorldPosition(),
    function (hit) {
      if (hit) {
        var position = hit.position;

        print("Raycast hit: " + hit.collider.getSceneObject().name);

        // Add safety check for endPointAttachment
        if (script.endPointAttachment) {
          print("EndPointAttachment exists in callback, setting position");
          script.endPointAttachment.getTransform().setWorldPosition(position);
        } else {
          print("ERROR: EndPointAttachment is undefined in callback");
        }
      }
    }
  );
}

// Start the script
onAwake();
