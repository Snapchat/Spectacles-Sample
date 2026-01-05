/**
 * SnapToLine - Snaps an object to the closest point on a line
 * JavaScript version of the original C# component
 */

//@input SceneObject lineStart {"hint":"The start point of the line"}
//@input SceneObject lineEnd {"hint":"The end point of the line"}
//@input SceneObject snappingObject {"hint":"The object that will snap to the line", "allowUndefined": true}
//@input SceneObject distanceObject {"hint":"The object used to measure distance to the line for snap detection", "allowUndefined": true}
//@input float snapDistance = 1.0 {"hint":"How close the object needs to be to snap to the line"}

// Store the closest point for visualization
let closestPointOnLine;

function onAwake() {
  script.createEvent("UpdateEvent").bind(() => {
    update();
  });
}

function update() {
  if (!script.lineStart || !script.lineEnd) {
    print("Warning: Line Start or Line End is not assigned!");
    return;
  }

  // Use script.sceneObject as fallback if snappingObject is not assigned
  const objectToSnap = script.snappingObject || script.sceneObject;

  // Use snappingObject as fallback for distanceObject if not assigned
  const objectForDistance = script.distanceObject || objectToSnap;

  // Get positions
  const distanceObjectPosition = objectForDistance.getTransform().getWorldPosition();
  const lineStartPosition = script.lineStart.getTransform().getWorldPosition();
  const lineEndPosition = script.lineEnd.getTransform().getWorldPosition();

  // Find the closest point on the line to the distance object
  closestPointOnLine = getClosestPointOnLine(distanceObjectPosition, lineStartPosition, lineEndPosition);

  // Check if the distance object is within the snap distance
  const distance = distanceObjectPosition.distance(closestPointOnLine);

  if (distance <= script.snapDistance) {
    // Snap the snapping object to the closest point on the line
    objectToSnap.getTransform().setWorldPosition(closestPointOnLine);
  }
}

/**
 * Calculate the closest point on a line to a given point
 */
function getClosestPointOnLine(point, lineStart, lineEnd) {
  // Calculate the line direction and length
  const lineDirection = lineEnd.sub(lineStart);
  const lineLength = lineDirection.length;
  const normalizedDirection = lineDirection.normalize();

  // Project the point onto the line
  const startToPoint = point.sub(lineStart);
  const projectionLength = startToPoint.dot(normalizedDirection);

  // Clamp the projection to the bounds of the line
  const clampedProjection = Math.max(0, Math.min(projectionLength, lineLength));

  // Calculate the closest point on the line
  return lineStart.add(normalizedDirection.scale(new vec3(clampedProjection, clampedProjection, clampedProjection)));
}

// Start the script
onAwake();
