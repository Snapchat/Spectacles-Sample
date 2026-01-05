/**
 * RaycastPainter - TypeScript version for Lens Studio
 * Draws a line renderer path where the user is touching paintable objects
 */
@component
export class RaycastPainterTS extends BaseScriptComponent {
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
  @hint("Line thickness")
  lineThickness: number = 0.02

  @input
  @hint("Line color")
  lineColor: vec4 = new vec4(1, 0, 0, 1)

  // Private properties
  private lineRenderer: Component | null = null
  private linePoints: vec3[] = []
  private isPainting: boolean = false
  private touchPosition: vec2 = new vec2(0.5, 0.5)

  onAwake(): void {
    // Create or get line renderer component
    this.initializeLineRenderer()

    // Bind touch events
    this.createEvent("TouchStartEvent").bind(this.onTouchStart.bind(this))
    this.createEvent("TouchMoveEvent").bind(this.onTouchMove.bind(this))
    this.createEvent("TouchEndEvent").bind(this.onTouchEnd.bind(this))

    // Create update event for continuous line drawing
    this.createEvent("UpdateEvent").bind(this.onUpdate.bind(this))
  }

  /**
   * Initialize the line renderer component
   */
  initializeLineRenderer(): void {
    // In Lens Studio, VFX Graph, Material with line shader, or other approaches might be used
    // For simplicity, we'll assume a component called "LineComponent" exists
    // You might need to adapt this for your specific setup
    this.lineRenderer = this.getSceneObject().getComponent("Component.RenderMeshVisual")

    if (!this.lineRenderer) {
      print("Warning: No line renderer component found. Line drawing will not work.")
    } else {
      // Set initial line settings - in actual implementation, you'd configure based on the specific line system
      this.clearLine()
      print("Line renderer initialized")
    }
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
    this.stopPainting()
  }

  /**
   * Update function that performs raycasting and line drawing
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
          self.addPointToLine(hit.position)
        }
      }
    })
  }

  /**
   * Start painting a new line
   */
  startPainting(): void {
    this.isPainting = true
    this.clearLine()
  }

  /**
   * Add a point to the line at the hit position
   */
  addPointToLine(point: vec3): void {
    // Check if the point is far enough from the last point to add it
    if (this.linePoints.length === 0 || this.distance(this.linePoints[this.linePoints.length - 1], point) > 0.1) {
      this.linePoints.push(point)
      this.updateLineRenderer()
    }
  }

  /**
   * Stop painting
   */
  stopPainting(): void {
    this.isPainting = false
    // Finalize the line if needed
  }

  /**
   * Clear the line and reset points
   */
  clearLine(): void {
    this.linePoints = []

    // In a real implementation, you'd clear the line renderer
    // This depends on how lines are implemented in your Lens Studio project
    if (this.lineRenderer) {
      // Example: this.lineRenderer.clearPoints();
      print("Line cleared")
    }
  }

  /**
   * Update the line renderer with current points
   */
  updateLineRenderer(): void {
    // In a real implementation, you'd update the actual line renderer
    // This depends on how lines are implemented in your Lens Studio project
    if (this.lineRenderer && this.linePoints.length > 0) {
      // Example: this.lineRenderer.setPoints(this.linePoints);
      print("Line updated with " + this.linePoints.length + " points")
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

  /**
   * Calculate distance between two points
   */
  distance(a: vec3, b: vec3): number {
    const dx = b.x - a.x
    const dy = b.y - a.y
    const dz = b.z - a.z
    return Math.sqrt(dx * dx + dy * dy + dz * dz)
  }
}
