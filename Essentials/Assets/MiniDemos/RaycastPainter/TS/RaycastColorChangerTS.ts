/**
 * RaycastColorChanger - TypeScript version for Lens Studio
 * Changes the color of objects when they are touched with raycast
 */
@component
export class RaycastColorChangerTS extends BaseScriptComponent {
  @input
  @hint("Camera from which the ray will be shot")
  playerCamera!: Component

  @input
  @hint("Max distance for the raycast")
  raycastDistance: number = 100.0

  @input
  @hint("Name pattern to identify paintable objects")
  paintablePattern: string = "Paintable"

  @input
  @hint("Whether colors should change continuously or only once per touch")
  continuousPainting: boolean = false

  // Private properties
  private isPainting: boolean = false
  private touchPosition: vec2 = new vec2(0.5, 0.5)

  onAwake(): void {
    // Bind touch events
    this.createEvent("TouchStartEvent").bind(this.onTouchStart.bind(this))
    this.createEvent("TouchMoveEvent").bind(this.onTouchMove.bind(this))
    this.createEvent("TouchEndEvent").bind(this.onTouchEnd.bind(this))

    // Create update event for continuous painting if enabled
    this.createEvent("UpdateEvent").bind(this.onUpdate.bind(this))
  }

  /**
   * Handle touch start event
   */
  onTouchStart(eventData): void {
    this.touchPosition = eventData.getTouchPosition()
    this.startPainting()
  }

  /**
   * Handle touch move event
   */
  onTouchMove(eventData): void {
    this.touchPosition = eventData.getTouchPosition()
  }

  /**
   * Handle touch end event
   */
  onTouchEnd(eventData): void {
    if (this.continuousPainting) {
      this.stopPainting()
    }
  }

  /**
   * Update function that performs raycasting and color changing
   */
  onUpdate(): void {
    if (!this.isPainting) return

    const camera = this.getCamera()
    if (!camera) return

    // Create ray from camera through touch position
    const rayDir = this.screenPointToWorldDirection(camera, this.touchPosition)
    const rayOrigin = camera.getTransform().getWorldPosition()

    // Perform the raycast
    const globalProbe = Physics.createGlobalProbe()

    // Store 'this' reference for callback
    const self = this

    globalProbe.rayCast(rayOrigin, rayOrigin.add(rayDir.uniformScale(this.raycastDistance)), (hit) => {
      if (hit) {
        const hitObject = hit.collider.getSceneObject()

        // Check if hit object is paintable
        if (self.isPaintableObject(hitObject)) {
          self.changeMaterialColor(hitObject)

          // If not in continuous mode, stop painting after changing one object's color
          if (!self.continuousPainting) {
            self.stopPainting()
          }
        }
      }
    })
  }

  /**
   * Start painting
   */
  startPainting(): void {
    this.isPainting = true
  }

  /**
   * Stop painting
   */
  stopPainting(): void {
    this.isPainting = false
  }

  /**
   * Change the material color of the hit object
   */
  changeMaterialColor(hitObject: SceneObject): void {
    // Get the renderer component (e.g., RenderMeshVisual in Lens Studio)
    const objectRenderer = hitObject.getComponent("Component.RenderMeshVisual")

    // Check if the object has a renderer
    if (objectRenderer) {
      // Generate a random color
      const randomColor = new vec4(Math.random(), Math.random(), Math.random(), 1.0)

      // In Lens Studio, we need to access the material differently than in Unity
      // This may vary based on your specific Lens Studio setup
      try {
        // Attempt to change the material color - exact API may vary
        const material = (objectRenderer as any).getMaterial()
        if (material) {
          // For standard materials, set the base color
          if (material.mainPass) {
            material.mainPass.baseColor = randomColor
            print("Changed color of object: " + hitObject.name)
          }
        } else {
          print("Warning: Could not access material for " + hitObject.name)
        }
      } catch (e) {
        print("Error changing material color: " + e)
        // Alternative approach - might work better in some Lens Studio versions
        ;(objectRenderer as any).baseColor = randomColor
      }
    } else {
      print("Warning: No renderer component found on object: " + hitObject.name)
    }
  }

  /**
   * Check if an object is paintable based on its name
   */
  isPaintableObject(obj: SceneObject): boolean {
    const objName = obj.name.toLowerCase()
    const pattern = this.paintablePattern.toLowerCase()

    return objName.includes(pattern)
  }

  /**
   * Get the scene camera
   */
  getCamera(): Camera {
    if (this.playerCamera) {
      return this.playerCamera as Camera
    }

    // Try to find on the same object
    return (this.getSceneObject().getComponent("Camera") as Camera) || null
  }

  /**
   * Convert screen point to world direction
   */
  screenPointToWorldDirection(camera: Camera, screenPoint: vec2): vec3 {
    // Get the camera's transform
    const cameraTransform = camera.getTransform()

    // Convert screen point (0-1) to normalized device coordinates (-1 to 1)
    const ndcX = screenPoint.x * 2 - 1
    const ndcY = 1 - screenPoint.y * 2 // Flipped Y to match Unity's screen space

    // Create a direction vector based on the camera's orientation
    const forward = cameraTransform.forward
    const right = cameraTransform.right
    const up = cameraTransform.up

    // Combine the vectors based on NDC
    const direction = forward.add(right.uniformScale(ndcX).add(up.uniformScale(ndcY))).normalize()

    return direction
  }
}
