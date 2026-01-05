// Given an object with a BodyComponent
// If the object intersects with the ray described
// by rayStart and rayEnd, print a message.
@component
export class SimpleRaycastTS extends BaseScriptComponent {
  @input rayStart: SceneObject
  @input rayEnd: SceneObject
  @input endPointAttachment: SceneObject

  onAwake() {
    // Check if endPointAttachment is defined
    print("EndPointAttachment object defined: " + (this.endPointAttachment !== undefined))

    this.createEvent("OnStartEvent").bind(() => {
      this.onStart()
    })

    this.createEvent("UpdateEvent").bind(() => {
      this.updateObjectMovement()
    })
  }

  onStart() {
    // Check if endPointAttachment is defined at start
    print("EndPointAttachment object at start: " + (this.endPointAttachment !== undefined))
    if (this.endPointAttachment) {
      print("EndPointAttachment object name: " + this.endPointAttachment.name)
    }
  }

  updateObjectMovement() {
    // Create a probe to raycast through all worlds.
    const globalProbe = Physics.createGlobalProbe()

    // Check if endPointAttachment is defined before raycasting
    print("EndPointAttachment object before raycast: " + (this.endPointAttachment !== undefined))

    // Store 'this' reference to use inside the callback
    const self = this

    globalProbe.rayCast(
      this.rayStart.getTransform().getWorldPosition(),
      this.rayEnd.getTransform().getWorldPosition(),
      function (hit) {
        if (hit) {
          const position = hit.position

          print("Raycast hit: " + hit.collider.getSceneObject().name)

          // Add safety check for endPointAttachment
          if (self.endPointAttachment) {
            print("EndPointAttachment exists in callback, setting position")
            self.endPointAttachment.getTransform().setWorldPosition(position)
          } else {
            print("ERROR: EndPointAttachment is undefined in callback")
          }
        }
      }
    )
  }
}
