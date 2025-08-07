import { CancelFunction } from "SpectaclesInteractionKit.lspkg/Utils/animate";
import { LensConfig } from "SpectaclesInteractionKit.lspkg/Utils/LensConfig";

export const EPSILON = 0.000001;

// |SceneObject| Have an iterator function called on each SceneObject in a sub tree. Optionally [defaulting to true] including the scene object starting scene object.
export function forEachSceneObjectInSubHierarchy(
  sceneObject: SceneObject,
  fn: (so: SceneObject) => void,
  includeSelf: boolean = undefined
) {
  if (includeSelf === undefined || includeSelf) {
    fn(sceneObject);
  }
  for (var i = 0; i < sceneObject.getChildrenCount(); i++) {
    var childSceneObject = sceneObject.getChild(i);
    fn(childSceneObject);
    forEachSceneObjectInSubHierarchy(childSceneObject, fn, false);
  }
}

// |SceneObject| Find a script component with an unique property name
export function findScriptComponent(
  sceneObject: SceneObject,
  propertyName: string
) {
  var components = sceneObject.getComponents("ScriptComponent");
  for (var idx = 0; idx < components.length; idx++) {
    if ((components[idx] as any)[propertyName]) {
      return components[idx];
    }
  }
  return null;
}

export function getSceneRoot(sceneObject: SceneObject) {
  let parent = sceneObject.getParent();
  let currentSceneObject = sceneObject;

  while (parent !== null) {
    currentSceneObject = parent;
    parent = parent.getParent();
  }

  return currentSceneObject;
}

// |Math| Maps a number to a different interval. With optional clamping and easing.
export function map(
  input: number,
  inputMin: number,
  inputMax: number,
  outputMin: number,
  outputMax: number
): number {
  input = (input - inputMin) / (inputMax - inputMin);
  var output = input * (outputMax - outputMin) + outputMin;
  return output;
}

// |UI| Get screen transform positions as array. Useful for checking is a screen transforms bounds changed with [compare-screen-transforms-positions-array](./compare-screen-transforms-positions-array.js).
export function getScreenTransformPositionsAsArray(
  screenTransform: ScreenTransform
): vec3[] {
  return [
    screenTransform.localPointToWorldPoint(vec2.zero()),
    screenTransform.localPointToWorldPoint(vec2.one()),
  ];
}

// |UI| Determine is a screen transform is below a screen point and is active. Handy for touch & tap start events.
export function wasClicked(
  screenTransform: ScreenTransform,
  screenPoint: vec2
): boolean {
  return (
    screenTransform.getSceneObject().isEnabledInHierarchy &&
    screenTransform.containsScreenPoint(screenPoint)
  );
}

// |UI| Get screen transform width.
export function getScreenTransformWorldWidth(
  screenTransform: ScreenTransform
): number {
  return screenTransform
    .localPointToWorldPoint(new vec2(-1, -1))
    .distance(screenTransform.localPointToWorldPoint(new vec2(1, -1)));
}

// |UI| Get screen transform height
export function getScreenTransformWorldHeight(
  screenTransform: ScreenTransform
): number {
  return screenTransform
    .localPointToWorldPoint(new vec2(-1, 1))
    .distance(screenTransform.localPointToWorldPoint(new vec2(-1, -1)));
}

// |UI| Get the relative height of a screen transform to its parent (between 0 and 1) from a world height.
export function getWorldWidthToRelativeToParentWidth(
  parentScreenTransform: ScreenTransform,
  worldWidth: number
): number {
  return worldWidth / getScreenTransformWorldWidth(parentScreenTransform);
}

// |UI| Get the relative height of a screen transform to its parent (between 0 and 1) from a world height.
export function getWorldHeightToRelativeToParentHeight(
  parentScreenTransform: ScreenTransform,
  worldHeight: number
): number {
  return worldHeight / getScreenTransformWorldHeight(parentScreenTransform);
}

// |Map| Get the offset of a tile for a given location in terms of the scroll views dimensions
export function getOffsetForLocation(
  mapModule: MapModule,
  initialLocation: LocationAsset,
  latitude: number,
  longitude: number
): vec2 {
  var tileOffsetForLocation = mapModule.longLatToImageRatio(
    latitude,
    longitude,
    initialLocation
  );

  // Align the user position with the top left of the grid
  return new vec2(-tileOffsetForLocation.x, -tileOffsetForLocation.y);
}

// |Math| Set vec2
export function setVec2(v: vec2, source: vec2) {
  v.x = source.x;
  v.y = source.y;
}

export type MapParameter = {
  tileCount: number;
  renderParent: SceneObject;
  mapUpdateThreshold: number;
  setMapToCustomLocation: boolean;
  mapLocation: GeoPosition;
  mapFocusPosition: vec2;
  userPinVisual: ObjectPrefab;
  showUserPin: boolean;
  zoomLevel: number;
  zoomOffet: number;
  enableScrolling: boolean;
  scrollingFriction: number;
  userPinScale: vec2;
  mapPinsRotated: boolean;
  isMinimapAutoRotate: boolean;
  userPinAlignedWithOrientation: boolean;
  enableMapSmoothing: boolean;
  mapPinPrefab: ObjectPrefab;
  mapPinCursorDetectorSize: number;
};

export type LocationBoundScreenTransform = {
  screenTransform: ScreenTransform;
  longitude: number;
  latitude: number;
};

// |UI| Compare screen transform positions array. Useful for checking is a screen transforms bounds changed with [get-screen-transform-positions-as-array](./get-screen-transform-positions-as-array.js).
export function compareScreenTransformsPositionsArray(
  a: vec3[],
  b: vec3[]
): boolean {
  return a.toString() === b.toString();
}

// |Math| Javascript native mod function only returns the remainder. This function acts like a modulo function.
export function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

// |UI| Set a screen transform (in a similar way to how our brains work) with a relative to parent position and size.
export function setScreenTransformRect01(
  screenTransform: ScreenTransform,
  x: number,
  y: number,
  width: number,
  height: number
): void {
  screenTransform.anchors.left = lerp(-1, 1, x);
  screenTransform.anchors.right = screenTransform.anchors.left + width * 2;
  screenTransform.anchors.top = lerp(1, -1, y);
  screenTransform.anchors.bottom = screenTransform.anchors.top - height * 2;
}

// |Math| Returns a number between two numbers.
export function lerp(start: number, end: number, scalar: number): number {
  return start + (end - start) * scalar;
}

// |Comparison| Checks if a value is a valid function
export function isFunction(fn) {
  return typeof fn === "function";
}

// Interpolating between rotations
export function interpolate(
  startRotation: quat,
  endRotation: quat,
  peakVelocity: number
) {
  var step = peakVelocity * getDeltaTime();
  return quat.slerp(startRotation, endRotation, step);
}

// |Time| Will call a callback function every frame for a set duration with a number increasing from 0 to 1.
export function makeTween(
  callback: (time: number) => void,
  duration: number
): CancelFunction {
  const updateDispatcher = LensConfig.getInstance().updateDispatcher;
  const lateUpdateEvent = updateDispatcher.createLateUpdateEvent("Tween");
  const startTime = getTime();
  let hasRemovedEvent = false;
  lateUpdateEvent.bind(() => {
    if (getTime() > startTime + duration) {
      hasRemovedEvent = true;
      updateDispatcher.removeEvent(lateUpdateEvent);
      callback(1);
    } else {
      callback((getTime() - startTime) / duration);
    }
  });

  // Create a Cancelation function to stop this animation at any time
  function cancel() {
    if (!hasRemovedEvent) {
      hasRemovedEvent = true;
      updateDispatcher.removeEvent(lateUpdateEvent);
    }
  }

  return cancel;
}

export function clip(n: number, minValue: number, maxValue: number): number {
  return Math.min(Math.max(n, minValue), maxValue);
}

/**
 * Changes the zoom level input to scale map component receives it
 * https://wiki.openstreetmap.org/wiki/Zoom_levels
 */
export function calculateZoomOffset(zoomLevel: number): number {
  return map(zoomLevel, 8, 21, -11, 2);
}

/**
 * Adding render mesh visual
 */
export function addRenderMeshVisual(
  sceneObject: SceneObject,
  mesh: RenderMesh,
  material: Material,
  renderOrder: number
) {
  let renderMeshVisual = sceneObject.createComponent(
    "Component.RenderMeshVisual"
  );
  renderMeshVisual.addMaterial(material);
  renderMeshVisual.mesh = mesh;
  renderMeshVisual.setRenderOrder(renderOrder);
  return renderMeshVisual;
}

/**
 * Making circle 2D mesh
 */
export function makeCircle2DMesh(position: vec3, radius: number): RenderMesh {
  const builder = new MeshBuilder([{ name: "position", components: 3 }]);

  builder.topology = MeshTopology.Triangles;
  builder.indexType = MeshIndexType.UInt16;

  const [indices, vertices] = this.makeCircle2DIndicesVerticesPair(
    position,
    radius,
    16,
    0
  );

  builder.appendIndices(indices);
  builder.appendVerticesInterleaved(vertices);

  builder.updateMesh();

  return builder.getMesh();
}

/**
 * Making circle indices vertices pair
 */
export function makeCircle2DIndicesVerticesPair(
  position: vec3,
  radius: number,
  segments: number,
  indicesOffset: number
): number[][] {
  const indices: number[] = [];
  const vertices: number[] = [];

  vertices.push(position.x, position.y, position.z);

  // Add the vertices around the circle
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    const x = position.x + Math.cos(angle) * radius;
    const y = position.y + Math.sin(angle) * radius;
    const z = position.z;

    vertices.push(x, y, z);
  }

  // Add the indices for the triangles
  for (let i = 1; i <= segments; i++) {
    indices.push(indicesOffset, i + indicesOffset, i + indicesOffset + 1);
  }

  return [indices, vertices];
}

/**
 * Making line mesh with joints
 */
export function makeLineStrip2DMeshWithJoints(
  positions: vec3[],
  thickness: number
): RenderMesh {
  const builder = new MeshBuilder([{ name: "position", components: 3 }]);

  builder.topology = MeshTopology.Triangles;
  builder.indexType = MeshIndexType.UInt16;

  for (let i = 0; i < positions.length - 1; ++i) {
    const [indices, vertices] = this.makeLine2DIndicesVerticesPair(
      positions[i],
      positions[i + 1],
      thickness,
      i * 4
    );

    builder.appendIndices(indices);
    builder.appendVerticesInterleaved(vertices);
  }

  const segments = 16;
  const radius = thickness / 2;
  const linesIndicesOffset = (positions.length - 1) * 4;

  for (let i = 0; i < positions.length; ++i) {
    const [indices, vertices] = this.makeCircle2DIndicesVerticesPair(
      positions[i],
      radius,
      segments,
      linesIndicesOffset + i * segments
    );

    builder.appendIndices(indices);
    builder.appendVerticesInterleaved(vertices);
  }

  builder.updateMesh();

  return builder.getMesh();
}

/**
 * Making line indices vertices pair
 */
export function makeLine2DIndicesVerticesPair(
  start: vec3,
  end: vec3,
  thickness: number,
  indicesOffset: number
): number[][] {
  const halfThickness = thickness / 2;
  const up = vec3.forward();
  const direction = end.sub(start).normalize();
  const right = up.cross(direction).normalize().uniformScale(halfThickness);

  return [
    // indices
    [
      0 + indicesOffset,
      1 + indicesOffset,
      2 + indicesOffset,
      2 + indicesOffset,
      1 + indicesOffset,
      3 + indicesOffset,
    ],
    // vertices
    [
      start.x + right.x,
      start.y + right.y,
      start.z + right.z,
      start.x - right.x,
      start.y - right.y,
      start.z - right.z,
      end.x + right.x,
      end.y + right.y,
      end.z + right.z,
      end.x - right.x,
      end.y - right.y,
      end.z - right.z,
    ],
  ];
}

export function getPhysicalDistanceBetweenLocations(
  location1: GeoPosition,
  location2: GeoPosition
): number {
  const long1 = location1.longitude * MathUtils.DegToRad;
  const lat1 = location1.latitude * MathUtils.DegToRad;
  const long2 = location2.longitude * MathUtils.DegToRad;
  const lat2 = location2.latitude * MathUtils.DegToRad;
  const r = 6371 * 1000;

  const a = Math.sin((lat2 - lat1) / 2);
  const b = Math.cos(lat1);
  const c = Math.cos(lat2);
  const d = Math.sin((long2 - long1) / 2);
  const e = a * a + b * c * d * d;
  const sqrt_e = Math.sqrt(e);
  const distance = 2 * r * Math.asin(sqrt_e);
  return distance;
}

/**
 * Calculates the bearing between two geographical points.
 * @param {GeoPosition} start - The starting point with latitude and longitude.
 * @param {GeoPosition} end - The ending point with latitude and longitude.
 * @returns {number} The bearing in radians from the start point to the end point.
 */
export function calculateBearing(start: GeoPosition, end: GeoPosition): number {
  const startLat = start.latitude * MathUtils.DegToRad;
  const startLng = start.longitude * MathUtils.DegToRad;
  const endLat = end.latitude * MathUtils.DegToRad;
  const endLng = end.longitude * MathUtils.DegToRad;

  const dLng = endLng - startLng;

  const y = Math.sin(dLng) * Math.cos(endLat);
  const x =
    Math.cos(startLat) * Math.sin(endLat) -
    Math.sin(startLat) * Math.cos(endLat) * Math.cos(dLng);

  const bearing = Math.atan2(y, x);

  return bearing;
}

export function normalizeAngle(angle: number): number {
  angle = angle % (Math.PI * 2);
  if (angle > Math.PI) {
    angle -= Math.PI * 2;
  } else if (angle < -Math.PI) {
    angle += Math.PI * 2;
  }
  return angle;
}

/**
 * Converts a quaternion to a roll angle in radians.
 * @param quaternion - The quaternion to convert.
 * @returns The roll angle in radians.
 */
export function quaternionToRoll(quaternion: quat): number {
  // Calculate the roll angle from the quaternion
  const sinRoll =
    2.0 * (quaternion.w * quaternion.z + quaternion.x * quaternion.y);
  const cosRoll =
    1.0 - 2.0 * (quaternion.y * quaternion.y + quaternion.z * quaternion.z);
  return Math.atan2(sinRoll, cosRoll);
}

/**
 * Converts a quaternion to a pitch angle in radians.
 * @param quaternion - The quaternion to convert.
 * @returns The pitch angle in radians.
 */
export function quaternionToPitch(quaternion: quat): number {
  const roll = quaternionToRoll(quaternion);

  const inverseRollQuaternion = quat.fromEulerVec(new vec3(0, 0, -roll));

  quaternion = quaternion.multiply(inverseRollQuaternion);

  let sinPitch =
    2.0 * (quaternion.w * quaternion.x - quaternion.y * quaternion.z);

  // Clamp sinPitch between -1 and 1 to prevent NaN results from asin
  sinPitch = Math.max(-1.0, Math.min(1.0, sinPitch));

  return Math.asin(sinPitch);
}

const easeOutElasticConstant = (2 * Math.PI) / 3;
/**
 * A elastic ease out function
 * @param x Should be between 0 and 1
 */
export function easeOutElastic(x: number): number {
  return x === 0
    ? 0
    : x === 1
    ? 1
    : Math.pow(2, -10 * x) *
        Math.sin((x * 10 - 0.75) * easeOutElasticConstant) +
      1;
}

export function customGetEuler(quaternion: quat): vec3 {
  const singularityTestValue = 0.4999;
  const sqw: number = quaternion.w * quaternion.w;
  const sqx: number = quaternion.x * quaternion.x;
  const sqy: number = quaternion.y * quaternion.y;
  const sqz: number = quaternion.z * quaternion.z;

  const unit: number = sqx + sqy + sqz + sqw;
  const test: number =
    quaternion.x * quaternion.y + quaternion.z * quaternion.w;

  let yaw: number, pitch: number, roll: number;

  // singularity at north pole
  if (test > singularityTestValue * unit) {
    yaw = 2 * Math.atan2(quaternion.x, quaternion.w);
    pitch = Math.PI / 2;
    roll = 0;
  }
  // singularity at south pole
  else if (test < -singularityTestValue * unit) {
    yaw = -2 * Math.atan2(quaternion.x, quaternion.w);
    pitch = -Math.PI / 2;
    roll = 0;
  } else {
    yaw = Math.atan2(
      2 * quaternion.y * quaternion.w - 2 * quaternion.x * quaternion.z,
      sqx - sqy - sqz + sqw
    );
    pitch = Math.asin((2 * test) / unit);
    roll = Math.atan2(
      2 * quaternion.x * quaternion.w - 2 * quaternion.y * quaternion.z,
      -sqx + sqy - sqz + sqw
    );
  }
  const r = new vec3(
    pitch < 0 ? pitch + Math.PI * 2 : pitch,
    yaw < 0 ? yaw + Math.PI * 2 : yaw,
    roll < 0 ? roll + Math.PI * 2 : roll
  );
  return r;
}

export interface ILocationJson {
  latitude: number;
  longitude: number;
  altitude: number;
  horizontalAccuracy: number;
  verticalAccuracy: number;
  source: string;
  heading: number;
  timestampSeconds: number;
  timestamp: string;
}
