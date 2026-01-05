import InteractorLineRenderer from "SpectaclesInteractionKit.lspkg/Components/Interaction/InteractorLineVisual/InteractorLineRenderer"
import {withAlpha} from "SpectaclesInteractionKit.lspkg/Utils/color"

/**
 * This class provides visual representation for a spiral. It allows customization of the spiral's material, color, width,
 * radius amplitude, length, loops, and visual style. The spiral will follow the center object if it moves.
 */
@component
export class Spiral extends BaseScriptComponent {
  @input
  @hint("The center point of the spiral")
  public centerObject!: SceneObject

  @input
  @hint("The starting radius amplitude of the spiral")
  public startRadiusAmplitude: number = 1.0

  @input
  @hint("The ending radius amplitude of the spiral")
  public endRadiusAmplitude: number = 1.0

  @input
  @hint("Length of the spiral along its axis direction")
  public axisLength: number = 5.0

  @input
  @hint("Number of complete loops in the spiral")
  public loops: number = 3

  @input
  @hint("Whether the spiral should follow the center object's rotation")
  public followRotation: boolean = true

  @input
  @hint("Which axis the spiral should expand along (0=X, 1=Y, 2=Z)")
  @widget(new ComboBoxWidget().addItem("X Axis", 0).addItem("Y Axis", 1).addItem("Z Axis", 2))
  public axisDirection: number = 1

  @input
  private lineMaterial!: Material

  @input("vec3", "{1, 0.5, 0}")
  @widget(new ColorWidget())
  public _color: vec3 = new vec3(1, 0.5, 0)

  @input
  private lineWidth: number = 0.5

  @input
  @widget(new ComboBoxWidget().addItem("Full", 0).addItem("Split", 1).addItem("FadedEnd", 2))
  public lineStyle: number = 0

  @input
  @hint("Total number of segments for the entire spiral (higher = smoother)")
  private totalSegments: number = 120

  @input
  @hint("Type of spiral growth")
  @widget(
    new ComboBoxWidget().addItem("Linear", 0).addItem("Exponential", 1).addItem("Logarithmic", 2).addItem("Helix", 3)
  )
  public spiralType: number = 0

  private _enabled = true
  private lineSegments: InteractorLineRenderer[] = []
  private transform!: Transform
  private centerTransform!: Transform
  private lastCenterPosition: vec3 = vec3.zero()
  private lastCenterRotation: quat = new quat(0, 0, 0, 1)

  /**
   * Sets whether the visual can be shown.
   */
  set isEnabled(isEnabled: boolean) {
    this._enabled = isEnabled
    this.lineSegments.forEach((line) => {
      if (line && line.getSceneObject()) {
        line.getSceneObject().enabled = isEnabled
      }
    })
  }

  /**
   * Gets whether the visual is active.
   */
  get isEnabled(): boolean {
    return this._enabled
  }

  /**
   * Sets the color of the spiral.
   */
  set color(color: vec3) {
    this._color = color
    const colorWithAlpha = withAlpha(color, 1)
    this.lineSegments.forEach((line) => {
      if (line) {
        line.startColor = colorWithAlpha
        line.endColor = colorWithAlpha
      }
    })
  }

  /**
   * Gets the color of the spiral.
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
    this.lastCenterRotation = this.centerTransform.getWorldRotation()

    // Create the spiral visualization
    this.createSpiral()

    // Set up update event to track center movement
    this.createEvent("UpdateEvent").bind(() => {
      this.update()
    })
  }

  /**
   * Updates the spiral position and rotation if the center has moved or rotated
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

      // Refresh the spiral
      this.refreshSpiral()
    }
  }

  /**
   * Regenerates the spiral and updates the visual
   */
  refreshSpiral(): void {
    this.cleanupLines()
    this.createSpiral()
  }

  /**
   * Cleans up existing line renderers
   */
  private cleanupLines(): void {
    this.lineSegments.forEach((line) => {
      if (line) {
        line.destroy()
      }
    })
    this.lineSegments = []
  }

  /**
   * Creates the spiral visual using multiple line segments
   */
  private createSpiral(): void {
    // Generate all points for the spiral
    const points = this.generateSpiralPoints()

    // Build line segments from the points
    if (points.length < 2) {
      print("Error: Not enough points to create spiral!")
      return
    }

    // Split the spiral into multiple line segments for better visual quality
    const maxPointsPerSegment = 30 // Limit points per segment for better performance

    for (let i = 0; i < points.length - 1; i += maxPointsPerSegment - 1) {
      // Calculate points for this segment (with overlap for smooth transitions)
      const segmentPoints = []
      for (let j = 0; j < maxPointsPerSegment && i + j < points.length; j++) {
        segmentPoints.push(points[i + j])
      }

      if (segmentPoints.length < 2) continue

      // Create line renderer for this segment
      const line = new InteractorLineRenderer({
        material: this.lineMaterial,
        points: segmentPoints,
        startColor: withAlpha(this._color, 1),
        endColor: withAlpha(this._color, 1),
        startWidth: this.lineWidth,
        endWidth: this.lineWidth
      })

      line.getSceneObject().setParent(this.sceneObject)
      line.visualStyle = this.lineStyle
      line.getSceneObject().enabled = this._enabled

      this.lineSegments.push(line)
    }
  }

  /**
   * Generates all points for the spiral based on current parameters
   */
  private generateSpiralPoints(): vec3[] {
    const centerPos = this.centerTransform.getWorldPosition()
    const centerRot = this.followRotation ? this.centerTransform.getWorldRotation() : new quat(0, 0, 0, 1)
    const points: vec3[] = []

    // Add extra points in tight areas for smoother curves
    // For the inner part of spiral, we need more points
    const segments = Math.max(80, this.totalSegments)

    // Include a starting point at the center
    let localPoint = new vec3(0, 0, 0)
    let worldPoint = centerPos.add(centerRot.multiplyVec3(localPoint))
    points.push(this.transform.getInvertedWorldTransform().multiplyPoint(worldPoint))

    // Generate points along the spiral path
    for (let i = 0; i <= segments; i++) {
      const t = i / segments
      const angle = t * this.loops * Math.PI * 2

      // Calculate position along primary axis (based on axisLength)
      const axisPos = t * this.axisLength

      // Calculate radius based on spiral type
      let radius: number

      switch (this.spiralType) {
        case 1: // Exponential
          radius = this.startRadiusAmplitude * Math.pow(this.endRadiusAmplitude / this.startRadiusAmplitude, t)
          break

        case 2: // Logarithmic
          radius =
            this.startRadiusAmplitude *
            (1 + Math.log(1 + t * 9) / Math.log(10)) *
            (1 + t * (this.endRadiusAmplitude / this.startRadiusAmplitude - 1))
          break

        case 3: // Helix (constant radius)
          radius = this.startRadiusAmplitude
          break

        default: // Linear
          radius = this.startRadiusAmplitude + t * (this.endRadiusAmplitude - this.startRadiusAmplitude)
      }

      // If start and end radius are equal and not a helix, ensure a proper spiral
      if (this.startRadiusAmplitude === this.endRadiusAmplitude && this.spiralType !== 3) {
        // Add a small variation to avoid perfectly circular slices
        radius *= 1 + t * 0.05
      }

      // Create point in local space based on axis direction
      switch (this.axisDirection) {
        case 0: // X axis as primary
          localPoint = new vec3(axisPos, radius * Math.cos(angle), radius * Math.sin(angle))
          break
        case 1: // Y axis as primary (default)
          localPoint = new vec3(radius * Math.cos(angle), axisPos, radius * Math.sin(angle))
          break
        case 2: // Z axis as primary
          localPoint = new vec3(radius * Math.cos(angle), radius * Math.sin(angle), axisPos)
          break
      }

      // Apply center object's rotation if enabled
      if (this.followRotation) {
        worldPoint = centerPos.add(centerRot.multiplyVec3(localPoint))
      } else {
        worldPoint = centerPos.add(localPoint)
      }

      // Convert to local space for the line renderer
      points.push(this.transform.getInvertedWorldTransform().multiplyPoint(worldPoint))

      // Add extra points near the start for smoother curves
      if (i < segments * 0.2 && i > 0 && i % 2 === 0) {
        const midT = (i - 0.5) / segments
        const midAngle = midT * this.loops * Math.PI * 2
        const midAxisPos = midT * this.axisLength

        // Mid-point radius
        let midRadius: number
        switch (this.spiralType) {
          case 1: // Exponential
            midRadius = this.startRadiusAmplitude * Math.pow(this.endRadiusAmplitude / this.startRadiusAmplitude, midT)
            break

          case 2: // Logarithmic
            midRadius =
              this.startRadiusAmplitude *
              (1 + Math.log(1 + midT * 9) / Math.log(10)) *
              (1 + midT * (this.endRadiusAmplitude / this.startRadiusAmplitude - 1))
            break

          case 3: // Helix (constant radius)
            midRadius = this.startRadiusAmplitude
            break

          default: // Linear
            midRadius = this.startRadiusAmplitude + midT * (this.endRadiusAmplitude - this.startRadiusAmplitude)
        }

        let midLocalPoint: vec3
        switch (this.axisDirection) {
          case 0: // X axis as primary
            midLocalPoint = new vec3(midAxisPos, midRadius * Math.cos(midAngle), midRadius * Math.sin(midAngle))
            break
          case 1: // Y axis as primary (default)
            midLocalPoint = new vec3(midRadius * Math.cos(midAngle), midAxisPos, midRadius * Math.sin(midAngle))
            break
          case 2: // Z axis as primary
            midLocalPoint = new vec3(midRadius * Math.cos(midAngle), midRadius * Math.sin(midAngle), midAxisPos)
            break
        }

        let midWorldPoint
        if (this.followRotation) {
          midWorldPoint = centerPos.add(centerRot.multiplyVec3(midLocalPoint))
        } else {
          midWorldPoint = centerPos.add(midLocalPoint)
        }

        // Insert midpoint at the correct position (between i-1 and i)
        points.splice(points.length - 1, 0, this.transform.getInvertedWorldTransform().multiplyPoint(midWorldPoint))
      }
    }

    return points
  }

  /**
   * Sets new radius amplitude values for the spiral
   */
  setRadiusAmplitudes(startAmplitude: number, endAmplitude: number): void {
    this.startRadiusAmplitude = Math.max(0.01, startAmplitude)
    this.endRadiusAmplitude = Math.max(0.01, endAmplitude)
    this.refreshSpiral()
  }

  /**
   * Sets the length of the spiral along its axis
   */
  setAxisLength(length: number): void {
    this.axisLength = Math.max(0.01, length)
    this.refreshSpiral()
  }

  /**
   * Sets the number of loops in the spiral
   */
  setLoops(loops: number): void {
    if (loops > 0) {
      this.loops = loops
      this.refreshSpiral()
    }
  }

  /**
   * Sets the total number of segments used to approximate the spiral
   */
  setTotalSegments(segments: number): void {
    if (segments >= 20) {
      this.totalSegments = segments
      this.refreshSpiral()
    }
  }

  /**
   * Sets the axis along which the spiral expands
   */
  setAxisDirection(axis: number): void {
    if (axis >= 0 && axis <= 2) {
      this.axisDirection = axis
      this.refreshSpiral()
    }
  }

  /**
   * Sets whether the spiral should follow the center object's rotation
   */
  setFollowRotation(follow: boolean): void {
    this.followRotation = follow
    this.refreshSpiral()
  }

  /**
   * Sets the type of spiral
   */
  setSpiralType(type: number): void {
    if (type >= 0 && type <= 3) {
      this.spiralType = type
      this.refreshSpiral()
    }
  }

  onDestroy(): void {
    this.cleanupLines()
  }
}
