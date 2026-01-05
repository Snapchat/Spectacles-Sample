/**
 * SnapToPlane - Snaps an object to the closest point on a plane
 * JavaScript version of the original C# component
 */

//@input SceneObject planeTransform {"hint":"The reference for the plane's position and normal"}
//@input SceneObject snappingObject {"hint":"The object that will snap to the plane", "allowUndefined": true}
//@input SceneObject distanceObject {"hint":"The object used to measure distance to the plane for snap detection", "allowUndefined": true}
//@input float snapDistance = 1.0 {"hint":"How close the object needs to be to snap to the plane"}

// Store the closest point for visualization
let closestPointOnPlane;

function onAwake() {
  script.createEvent("UpdateEvent").bind(() => {
    update();
  });
}

function update() {
  if (!script.planeTransform) {
    print("Warning: Plane Transform is not assigned!");
    return;
  }

  // Use script.sceneObject as fallback if snappingObject is not assigned
  const objectToSnap = script.snappingObject || script.sceneObject;

  // Use snappingObject as fallback for distanceObject if not assigned
  const objectForDistance = script.distanceObject || objectToSnap;

  // Get the plane transform
  const planeTransformObj = script.planeTransform.getTransform();

  // Get the right and forward vectors from the plane transform
  const planeRight = planeTransformObj.right;
  const planeForward = planeTransformObj.forward;

  // Calculate the normal of the plane based on the transform's directions
  const planeNormal = planeRight.cross(planeForward).normalize();

  // Get positions
  const distanceObjectPosition = objectForDistance.getTransform().getWorldPosition();
  const planePosition = script.planeTransform.getTransform().getWorldPosition();

  // Find the closest point on the plane to the distance object
  closestPointOnPlane = getClosestPointOnPlane(distanceObjectPosition, planePosition, planeNormal);

  // Check if the distance object is within the snap distance
  const distance = distanceObjectPosition.distance(closestPointOnPlane);

  if (distance <= script.snapDistance) {
    // Snap the snapping object to the closest point on the plane
    objectToSnap.getTransform().setWorldPosition(closestPointOnPlane);
  }
}

/**
 * Calculate the closest point on a plane to a given point
 */
function getClosestPointOnPlane(point, planePoint, planeNormal) {
  // Calculate the vector from the point to the plane
  const pointToPlane = point.sub(planePoint);

  // Project the vector onto the plane normal to get the distance from the point to the plane
  const distanceToPlane = pointToPlane.dot(planeNormal);

  // Calculate the closest point by subtracting the distance from the point along the plane normal
  return point.sub(planeNormal.scale(new vec3(distanceToPlane, distanceToPlane, distanceToPlane)));
}

// Start the script
onAwake();
