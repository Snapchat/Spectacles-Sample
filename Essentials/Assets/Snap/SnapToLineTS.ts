/**
 * SnapToLine - Snaps an object to the closest point on a line
 * TypeScript version of the original C# component
 */
@component
export class SnapToLineTS extends BaseScriptComponent {
  @input
  @hint("The start point of the line")
  lineStart: SceneObject

  @input
  @hint("The end point of the line")
  lineEnd: SceneObject

  @input
  @hint("The object that will snap to the line")
  @allowUndefined
  snappingObject: SceneObject

  @input
  @hint("The object used to measure distance to the line for snap detection")
  @allowUndefined
  distanceObject: SceneObject

  @input
  @hint("How close the object needs to be to snap to the line")
  snapDistance: number = 1.0

  // Store the closest point for visualization
  private closestPointOnLine: vec3

  onAwake() {
    this.createEvent("UpdateEvent").bind(() => {
      this.update()
    })
  }

  update() {
    if (!this.lineStart || !this.lineEnd) {
      print("Warning: Line Start or Line End is not assigned!")
      return
    }

    // Use this.sceneObject as fallback if snappingObject is not assigned
    const objectToSnap = this.snappingObject || this.sceneObject

    // Use snappingObject as fallback for distanceObject if not assigned
    const objectForDistance = this.distanceObject || objectToSnap

    // Get positions
    const distanceObjectPosition = objectForDistance.getTransform().getWorldPosition()
    const lineStartPosition = this.lineStart.getTransform().getWorldPosition()
    const lineEndPosition = this.lineEnd.getTransform().getWorldPosition()

    // Find the closest point on the line to the distance object
    this.closestPointOnLine = this.getClosestPointOnLine(distanceObjectPosition, lineStartPosition, lineEndPosition)

    // Check if the distance object is within the snap distance
    const distance = distanceObjectPosition.distance(this.closestPointOnLine)

    if (distance <= this.snapDistance) {
      // Snap the snapping object to the closest point on the line
      objectToSnap.getTransform().setWorldPosition(this.closestPointOnLine)
    }
  }

  /**
   * Calculate the closest point on a line to a given point
   */
  private getClosestPointOnLine(point: vec3, lineStart: vec3, lineEnd: vec3): vec3 {
    // Calculate the line direction and length
    const lineDirection = lineEnd.sub(lineStart)
    const lineLength = lineDirection.length
    const normalizedDirection = lineDirection.normalize()

    // Project the point onto the line
    const startToPoint = point.sub(lineStart)
    const projectionLength = startToPoint.dot(normalizedDirection)

    // Clamp the projection to the bounds of the line
    const clampedProjection = Math.max(0, Math.min(projectionLength, lineLength))

    // Calculate the closest point on the line
    return lineStart.add(normalizedDirection.scale(new vec3(clampedProjection, clampedProjection, clampedProjection)))
  }
}
