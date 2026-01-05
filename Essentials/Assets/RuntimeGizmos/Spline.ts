import InteractorLineRenderer from "SpectaclesInteractionKit.lspkg/Components/Interaction/InteractorLineVisual/InteractorLineRenderer"
import {withAlpha} from "SpectaclesInteractionKit.lspkg/Utils/color"

/**
 * This class provides visual representation for a spline curve through a series of control points.
 * It allows customization of the spline's material, color, width, interpolation level, and visual style.
 */
@component
export class Spline extends BaseScriptComponent {
  @input
  @hint("The control points for the spline curve")
  public controlPoints!: SceneObject[]

  @input
  @hint("Number of interpolation points between each control point (higher = smoother)")
  public interpolationPoints: number = 10

  @input
  @hint("Tension of the curve (0 = straight lines, 1 = tight curve)")
  public tension: number = 0.5

  @input
  @hint("Whether the spline should be closed (connect last point to first)")
  public closedLoop: boolean = false

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

  private _enabled = true
  private line!: InteractorLineRenderer
  private transform!: Transform
  private lastControlPositions: vec3[] = []
  private splinePoints: vec3[] = []

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
   * Sets the color of the spline.
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
   * Gets the color of the spline.
   */
  get color(): vec3 {
    return this._color
  }

  onAwake() {
    if (!this.controlPoints || this.controlPoints.length < 2) {
      print("Error: At least 2 control points are required for a spline!")
      return
    }

    this.transform = this.sceneObject.getTransform()

    // Initialize last positions
    this.lastControlPositions = this.controlPoints.map((point) => point.getTransform().getWorldPosition())

    // Generate the spline points
    this.generateSplinePoints()

    // Create the line renderer
    this.createSpline()

    // Set up update event to track control point movements
    this.createEvent("UpdateEvent").bind(() => {
      this.update()
    })
  }

  /**
   * Updates the spline if any control points have moved
   */
  update() {
    if (!this.controlPoints || this.controlPoints.length < 2) return

    let hasChanged = false

    // Check if any control point has moved
    for (let i = 0; i < this.controlPoints.length; i++) {
      const currentPos = this.controlPoints[i].getTransform().getWorldPosition()
      if (!currentPos.equal(this.lastControlPositions[i])) {
        hasChanged = true
        this.lastControlPositions[i] = currentPos
      }
    }

    // If any point has moved, refresh the spline
    if (hasChanged) {
      this.refreshSpline()
    }
  }

  /**
   * Regenerates the spline points and updates the visual
   */
  refreshSpline(): void {
    this.generateSplinePoints()
    this.updateSplineVisual()
  }

  /**
   * Updates the spline's visual representation
   */
  private updateSplineVisual(): void {
    if (this.line) {
      this.line.destroy()
    }
    this.createSpline()
  }

  /**
   * Creates the spline visual using InteractorLineRenderer
   */
  private createSpline(): void {
    if (this.splinePoints.length < 2) {
      print("Error: Not enough points to create a spline!")
      return
    }

    // Create a closed loop if requested
    const points = this.closedLoop ? [...this.splinePoints, this.splinePoints[0]] : this.splinePoints

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
   * Generates points along a spline curve through the control points
   */
  private generateSplinePoints(): void {
    this.splinePoints = []

    if (!this.controlPoints || this.controlPoints.length < 2) {
      return
    }

    // Get world positions of all control points
    const positions = this.controlPoints.map((point) => point.getTransform().getWorldPosition())

    // For a closed loop, we need to add extra points at the beginning and end
    // to ensure proper interpolation at the endpoints
    let points = [...positions]
    if (this.closedLoop && points.length > 2) {
      // Add the last point at the beginning and the first point at the end
      points = [points[points.length - 1], ...points, points[0], points[1]]
    } else {
      // For open curves, duplicate the first and last points
      points = [points[0], ...points, points[points.length - 1]]
    }

    // Generate the spline points
    const segmentCount = this.closedLoop ? positions.length : positions.length - 1

    // Add the first control point
    const firstLocalPoint = this.transform.getInvertedWorldTransform().multiplyPoint(positions[0])
    this.splinePoints.push(firstLocalPoint)

    // Generate points for each segment
    for (let i = 0; i < segmentCount; i++) {
      const p0 = i === 0 && !this.closedLoop ? points[0] : points[i]
      const p1 = points[i + 1]
      const p2 = points[i + 2]
      const p3 = i === segmentCount - 1 && !this.closedLoop ? points[points.length - 1] : points[i + 3]

      // Add interpolated points for this segment
      // Use more points for a smoother curve
      const pointsInSegment = i === segmentCount - 1 ? this.interpolationPoints + 1 : this.interpolationPoints

      for (let j = 1; j <= pointsInSegment; j++) {
        const t = j / (pointsInSegment + (i === segmentCount - 1 ? 0 : 1))
        const interpolatedPoint = this.catmullRomInterpolate(p0, p1, p2, p3, t)
        const localPoint = this.transform.getInvertedWorldTransform().multiplyPoint(interpolatedPoint)
        this.splinePoints.push(localPoint)
      }
    }

    // For open curves, ensure the last control point is included exactly
    if (!this.closedLoop) {
      const lastLocalPoint = this.transform.getInvertedWorldTransform().multiplyPoint(positions[positions.length - 1])
      this.splinePoints[this.splinePoints.length - 1] = lastLocalPoint
    }
  }

  /**
   * Performs Catmull-Rom interpolation between points
   */
  private catmullRomInterpolate(p0: vec3, p1: vec3, p2: vec3, p3: vec3, t: number): vec3 {
    const t2 = t * t
    const t3 = t2 * t

    // Simplified Catmull-Rom formula for each component
    const x = this.interpolateComponent(p0.x, p1.x, p2.x, p3.x, t, t2, t3)
    const y = this.interpolateComponent(p0.y, p1.y, p2.y, p3.y, t, t2, t3)
    const z = this.interpolateComponent(p0.z, p1.z, p2.z, p3.z, t, t2, t3)

    return new vec3(x, y, z)
  }

  /**
   * Interpolates a single component using Catmull-Rom formula
   */
  private interpolateComponent(
    v0: number,
    v1: number,
    v2: number,
    v3: number,
    t: number,
    t2: number,
    t3: number
  ): number {
    // Catmull-Rom coefficients
    const a = 0.5 * (2 * v1)
    const b = 0.5 * (v2 - v0)
    const c = 0.5 * (2 * v0 - 5 * v1 + 4 * v2 - v3)
    const d = 0.5 * (-v0 + 3 * v1 - 3 * v2 + v3)

    // Calculate the interpolated value
    return a + b * t + c * t2 + d * t3
  }

  /**
   * Sets a new interpolation level for the spline
   */
  setInterpolationPoints(points: number): void {
    if (points >= 0) {
      this.interpolationPoints = points
      this.refreshSpline()
    }
  }

  /**
   * Sets a new tension value for the spline
   */
  setTension(tension: number): void {
    this.tension = Math.max(0, Math.min(1, tension))
    this.refreshSpline()
  }

  /**
   * Sets whether the spline should be a closed loop
   */
  setClosedLoop(closed: boolean): void {
    this.closedLoop = closed
    this.refreshSpline()
  }

  /**
   * Updates the control points for the spline
   */
  setControlPoints(points: SceneObject[]): void {
    if (points.length < 2) {
      print("Error: At least 2 control points are required!")
      return
    }

    this.controlPoints = points
    this.lastControlPositions = points.map((point) => point.getTransform().getWorldPosition())

    this.refreshSpline()
  }

  /**
   * Adds a new control point to the spline
   */
  addControlPoint(point: SceneObject): void {
    if (!this.controlPoints) {
      this.controlPoints = []
    }

    this.controlPoints.push(point)
    this.lastControlPositions.push(point.getTransform().getWorldPosition())

    this.refreshSpline()
  }

  /**
   * Removes a control point from the spline
   */
  removeControlPoint(index: number): void {
    if (!this.controlPoints || index < 0 || index >= this.controlPoints.length) {
      return
    }

    if (this.controlPoints.length <= 2) {
      print("Error: Cannot remove point. At least 2 control points are required!")
      return
    }

    this.controlPoints.splice(index, 1)
    this.lastControlPositions.splice(index, 1)

    this.refreshSpline()
  }

  onDestroy(): void {
    if (this.line) {
      this.line.destroy()
    }
  }
}
