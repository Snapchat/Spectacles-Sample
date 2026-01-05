import InteractorLineRenderer from "SpectaclesInteractionKit.lspkg/Components/Interaction/InteractorLineVisual/InteractorLineRenderer"
import {withAlpha} from "SpectaclesInteractionKit.lspkg/Utils/color"

/**
 * This class provides visual representation for a circle. It allows customization of the circle's material, color, width, radius, and visual style.
 * The circle will follow the center object if it moves.
 */
@component
export class Circle extends BaseScriptComponent {
  @input
  @hint("The center point of the circle")
  public centerObject!: SceneObject

  @input
  @hint("The radius of the circle")
  public radius: number = 1.0

  @input
  @hint("Whether the circle should follow the center object's rotation")
  public followRotation: boolean = true

  @input
  private lineMaterial!: Material

  @input("vec3", "{1, 1, 0}")
  @widget(new ColorWidget())
  public _color: vec3 = new vec3(1, 1, 0)

  @input
  private lineWidth: number = 0.5

  @input
  @widget(new ComboBoxWidget().addItem("Full", 0).addItem("Split", 1).addItem("FadedEnd", 2))
  public lineStyle: number = 0

  @input
  @hint("Number of segments used to approximate the circle (higher = smoother)")
  private segments: number = 32

  private _enabled = true
  private line!: InteractorLineRenderer
  private transform!: Transform
  private centerTransform!: Transform
  private lastCenterPosition: vec3 = vec3.zero()
  private lastCenterRotation: quat = new quat(0, 0, 0, 1)
  private circlePoints: vec3[] = []

  /**
   * Sets whether the visual can be shown.
   */
  set isEnabled(isEnabled: boolean) {
    this._enabled = isEnabled
    if (this.line) {
      this.line.getSceneObject().enabled = isEnabled
    }
  }

  /**
   * Gets whether the visual is active.
   */
  get isEnabled(): boolean {
    return this._enabled
  }

  /**
   * Sets the color of the circle.
   */
  set color(color: vec3) {
    this._color = color
    if (this.line) {
      const colorWithAlpha = withAlpha(color, 1)
      this.line.startColor = colorWithAlpha
      this.line.endColor = colorWithAlpha
    }
  }

  /**
   * Gets the color of the circle.
   */
  get color(): vec3 {
    return this._color
  }

  onAwake() {
    if (!this.centerObject) {
      print("Error: Center object is not assigned!")
      return
    }

    this.transform = this.sceneObject.getTransform()
    this.centerTransform = this.centerObject.getTransform()
    this.lastCenterPosition = this.centerTransform.getWorldPosition()

    // Generate the circle points
    this.generateCirclePoints()

    // Create the line renderer
    this.createCircle()

    // Set up update event to track center movement
    this.createEvent("UpdateEvent").bind(() => {
      this.update()
    })
  }

  /**
   * Updates the circle position and rotation if the center has moved or rotated
   */
  update() {
    if (!this.centerObject) return

    const currentCenterPos = this.centerTransform.getWorldPosition()
    const currentCenterRot = this.centerTransform.getWorldRotation()

    // Check if position or rotation has changed
    if (
      !currentCenterPos.equal(this.lastCenterPosition) ||
      (this.followRotation && !this.lastCenterRotation.equal(currentCenterRot))
    ) {
      // Update stored position and rotation
      this.lastCenterPosition = currentCenterPos
      this.lastCenterRotation = currentCenterRot

      // Refresh the circle
      this.refreshCircle()
    }
  }

  /**
   * Regenerates the circle points and updates the visual
   */
  refreshCircle(): void {
    this.generateCirclePoints()
    this.updateCircleVisual()
  }

  /**
   * Updates the circle's visual representation
   */
  private updateCircleVisual(): void {
    if (this.line) {
      this.line.destroy()
    }
    this.createCircle()
  }

  /**
   * Creates the circle visual using InteractorLineRenderer
   */
  private createCircle(): void {
    // Create a closed loop by adding the first point at the end
    const points = [...this.circlePoints, this.circlePoints[0]]

    this.line = new InteractorLineRenderer({
      material: this.lineMaterial,
      points: points,
      startColor: withAlpha(this._color, 1),
      endColor: withAlpha(this._color, 1),
      startWidth: this.lineWidth,
      endWidth: this.lineWidth
    })

    this.line.getSceneObject().setParent(this.sceneObject)
    this.line.visualStyle = this.lineStyle
    this.line.getSceneObject().enabled = this._enabled
  }

  /**
   * Generates points along a circle in the XY plane, respecting the center object's rotation if enabled
   */
  private generateCirclePoints(): void {
    this.circlePoints = []
    const centerPos = this.centerTransform.getWorldPosition()
    const centerRot = this.followRotation ? this.centerTransform.getWorldRotation() : new quat(0, 0, 0, 1)

    // Generate points for the circle in the XY plane
    for (let i = 0; i < this.segments; i++) {
      const angle = (i / this.segments) * Math.PI * 2

      // Create point in local space (XY plane)
      const localCirclePoint = new vec3(this.radius * Math.cos(angle), this.radius * Math.sin(angle), 0)

      // Apply center object's rotation if enabled
      let worldPoint
      if (this.followRotation) {
        // Transform the point using the center's rotation
        worldPoint = centerPos.add(centerRot.multiplyVec3(localCirclePoint))
      } else {
        // Just offset from center position
        worldPoint = new vec3(
          centerPos.x + localCirclePoint.x,
          centerPos.y + localCirclePoint.y,
          centerPos.z + localCirclePoint.z
        )
      }

      // Convert to local space for the line renderer
      const localPoint = this.transform.getInvertedWorldTransform().multiplyPoint(worldPoint)
      this.circlePoints.push(localPoint)
    }
  }

  /**
   * Sets a new radius for the circle
   */
  setRadius(newRadius: number): void {
    this.radius = newRadius
    this.refreshCircle()
  }

  /**
   * Sets whether the circle should follow the center object's rotation
   */
  setFollowRotation(follow: boolean): void {
    this.followRotation = follow
    this.refreshCircle()
  }

  /**
   * Sets the number of segments used to approximate the circle
   */
  setSegments(segments: number): void {
    if (segments >= 3) {
      this.segments = segments
      this.refreshCircle()
    }
  }

  onDestroy(): void {
    if (this.line) {
      this.line.destroy()
    }
  }
}
