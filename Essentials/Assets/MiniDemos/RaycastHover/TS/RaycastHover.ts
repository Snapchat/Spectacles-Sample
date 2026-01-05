import {LSTween} from "LSTween.lspkg/LSTween"

// This component manages a 3D panel that scales when it is hit by a raycast
@component
export class RaycastHoverTS extends BaseScriptComponent {
  @input rayStart: SceneObject
  @input rayEnd: SceneObject
  @input targetPanel: SceneObject
  @input targetCollider: SceneObject

  // Animation parameters
  @input animationDuration: number = 500 // milliseconds
  @input normalScale: vec3 = new vec3(1, 1, 1)
  @input expandedScale: vec3 = new vec3(1.2, 1.2, 1.2)

  // State tracking
  private isHovering: boolean = false
  private lastHitName: string = ""

  onAwake() {
    // Validate inputs
    if (!this.rayStart || !this.rayEnd) {
      print("ERROR: Ray start and end points must be defined")
      return
    }

    if (!this.targetPanel) {
      print("ERROR: Target panel must be defined")
      return
    }

    if (!this.targetCollider) {
      print("ERROR: Target collider must be defined")
      return
    }

    // Create update event
    this.createEvent("UpdateEvent").bind(() => {
      this.updateRaycast()
    })
  }

  updateRaycast() {
    // Create a probe to raycast through all worlds
    const globalProbe = Physics.createGlobalProbe()

    // Store 'this' reference to use inside the callback
    const self = this

    // Cast ray and check for hits
    globalProbe.rayCast(
      this.rayStart.getTransform().getWorldPosition(),
      this.rayEnd.getTransform().getWorldPosition(),
      function (hit) {
        if (hit) {
          const hitObject = hit.collider.getSceneObject()
          const hitName = hitObject.name

          // Check if we hit our target collider
          const isTargetCollider = hitObject === self.targetCollider || hitName === self.targetCollider.name

          // Handle raycast enter
          if (isTargetCollider && !self.isHovering) {
            self.onRaycastEnter()
            self.lastHitName = hitName
          }
          // Handle raycast stay (still hovering the same object)
          else if (isTargetCollider && self.isHovering) {
            // Already hovering - do nothing
          }
          // Handle case where we're hitting something else
          else if (!isTargetCollider && self.isHovering) {
            self.onRaycastExit()
          }
        } else if (self.isHovering) {
          // No hit at all - exit if we were hovering
          self.onRaycastExit()
        }
      }
    )
  }

  onRaycastEnter() {
    print("Raycast entered target: " + this.targetCollider.name)
    this.isHovering = true

    // Scale up animation using LSTween
    this.scaleUp()
  }

  onRaycastExit() {
    print("Raycast exited target: " + this.lastHitName)
    this.isHovering = false

    // Scale down animation using LSTween
    this.scaleDown()
  }

  scaleUp() {
    // Cancel any ongoing animations
    LSTween.scaleToWorld(this.targetPanel.getTransform(), this.expandedScale, this.animationDuration).start()
  }

  scaleDown() {
    // Scale back to normal size
    LSTween.scaleToWorld(this.targetPanel.getTransform(), this.normalScale, this.animationDuration).start()
  }
}
