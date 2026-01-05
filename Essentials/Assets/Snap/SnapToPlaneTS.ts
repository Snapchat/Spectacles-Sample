/**
 * SnapToPlane - Snaps an object to the closest point on a plane
 * TypeScript version of the original C# component
 */
@component
export class SnapToPlaneTS extends BaseScriptComponent {
  @input
  @hint("The reference for the plane's position and normal")
  planeTransform: SceneObject

  @input
  @hint("The object that will snap to the plane")
  @allowUndefined
  snappingObject: SceneObject

  @input
  @hint("The object used to measure distance to the plane for snap detection")
  @allowUndefined
  distanceObject: SceneObject

  // No longer need separate inputs for plane directions as we'll use the transform

  @input
  @hint("How close the object needs to be to snap to the plane")
  snapDistance: number = 1.0

  // Store the closest point for visualization
  private closestPointOnPlane: vec3

  onAwake() {
    this.createEvent("UpdateEvent").bind(() => {
      this.update()
    })
  }

  update() {
    if (!this.planeTransform) {
      print("Warning: Plane Transform is not assigned!")
      return
    }

    // Use this.sceneObject as fallback if snappingObject is not assigned
    const objectToSnap = this.snappingObject || this.sceneObject

    // Use snappingObject as fallback for distanceObject if not assigned
    const objectForDistance = this.distanceObject || objectToSnap

    // Get the plane transform
    const planeTransformObj = this.planeTransform.getTransform()

    // Get the right and forward vectors from the plane transform
    const planeRight = planeTransformObj.right
    const planeForward = planeTransformObj.forward

    // Calculate the normal of the plane based on the transform's directions
    const planeNormal = planeRight.cross(planeForward).normalize()

    // Get positions
    const distanceObjectPosition = objectForDistance.getTransform().getWorldPosition()
    const planePosition = this.planeTransform.getTransform().getWorldPosition()

    // Find the closest point on the plane to the distance object
    this.closestPointOnPlane = this.getClosestPointOnPlane(distanceObjectPosition, planePosition, planeNormal)

    // Check if the distance object is within the snap distance
    const distance = distanceObjectPosition.distance(this.closestPointOnPlane)

    if (distance <= this.snapDistance) {
      // Snap the snapping object to the closest point on the plane
      objectToSnap.getTransform().setWorldPosition(this.closestPointOnPlane)
    }
  }

  /**
   * Calculate the closest point on a plane to a given point
   */
  private getClosestPointOnPlane(point: vec3, planePoint: vec3, planeNormal: vec3): vec3 {
    // Calculate the vector from the point to the plane
    const pointToPlane = point.sub(planePoint)

    // Project the vector onto the plane normal to get the distance from the point to the plane
    const distanceToPlane = pointToPlane.dot(planeNormal)

    // Calculate the closest point by subtracting the distance from the point along the plane normal
    return point.sub(planeNormal.scale(new vec3(distanceToPlane, distanceToPlane, distanceToPlane)))
  }
}
