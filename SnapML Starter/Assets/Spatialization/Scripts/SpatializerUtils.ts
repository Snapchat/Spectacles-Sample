// filepath: DepthSpatializerUtils.ts
// Utility interfaces and functions for DepthSpatializer

export interface DetectionState {
  isActive: boolean;
  confidence: number;
  lastUpdateTime: number;
  targetPosition: vec3 | null;
  targetVertices: vec3[] | null;
  targetRotation: quat | null;
  fadeAlpha: number;
}

export interface LerpState {
  startPosition: vec3;
  targetPosition: vec3;
  startVertices: vec3[];
  targetVertices: vec3[];
  startRotation: quat;
  targetRotation: quat;
  startTime: number;
  duration: number;
  detectionIndex: number;
}

export function areVerticesSimilar(vertices1: vec3[], vertices2: vec3[], thresholdCm: number): boolean {
  if (vertices1.length !== vertices2.length) return false;
  const threshold = thresholdCm / 100;
  for (let i = 0; i < vertices1.length; i++) {
    if (vertices1[i].distance(vertices2[i]) > threshold) return false;
  }
  return true;
}

export function lerpVec3(start: vec3, end: vec3, t: number): vec3 {
  return vec3.lerp(start, end, t);
}

export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function alignVerticesToRectangle(vertices: vec3[], debug?: boolean): vec3[] {
  if (vertices.length !== 4) return vertices;
  const [topLeft, topRight, bottomLeft, bottomRight] = vertices;
  const topY = (topLeft.y + topRight.y) / 2;
  const bottomY = (bottomLeft.y + bottomRight.y) / 2;
  const leftX = (topLeft.x + bottomLeft.x) / 2;
  const rightX = (topRight.x + bottomRight.x) / 2;
  const topZ = (topLeft.z + topRight.z) / 2;
  const bottomZ = (bottomLeft.z + bottomRight.z) / 2;
  const leftZ = (topLeft.z + bottomLeft.z) / 2;
  const rightZ = (topRight.z + bottomRight.z) / 2;
  const alignedVertices = [
    new vec3(leftX, topY, (topZ + leftZ) / 2),
    new vec3(rightX, topY, (topZ + rightZ) / 2),
    new vec3(leftX, bottomY, (bottomZ + leftZ) / 2),
    new vec3(rightX, bottomY, (bottomZ + rightZ) / 2)
  ];
  if (debug) {
    print("Rectangle alignment adjustments:");
    for (let i = 0; i < 4; i++) {
      const original = vertices[i];
      const aligned = alignedVertices[i];
      print(`  Vertex ${i}: Δ(${Math.abs(aligned.x - original.x).toFixed(3)}, ${Math.abs(aligned.y - original.y).toFixed(3)}, ${Math.abs(aligned.z - original.z).toFixed(3)})`);
    }
  }
  return alignedVertices;
}
