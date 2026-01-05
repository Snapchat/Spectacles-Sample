interface vector3 {
  x: number
  y: number
  z: number
}

interface Quaternion {
  x: number
  y: number
  z: number
  w: number
}

@component
export class GetVectorsFromQuaternion extends BaseScriptComponent {
  private static instance: GetVectorsFromQuaternion

  private constructor() {
    super()
  }

  public static getInstance(): GetVectorsFromQuaternion {
    if (!GetVectorsFromQuaternion.instance) {
      // Note: this does not start in scene
      GetVectorsFromQuaternion.instance = new GetVectorsFromQuaternion()
    }
    return GetVectorsFromQuaternion.instance
  }

  onAwake() {
    GetVectorsFromQuaternion.instance = this
  }

  /**
   * Computes the forward, right, and up vectors from a quaternion.
   * @param q - The quaternion representing the rotation.
   * @returns An object containing forward, right, and up vectors.
   */
  public getVectorsFromQuaternion(q: Quaternion): {forward: vec3; right: vec3; up: vec3} {
    // Convert quaternion to rotation matrix elements
    const xx = q.x * q.x
    const yy = q.y * q.y
    const zz = q.z * q.z
    const xy = q.x * q.y
    const xz = q.x * q.z
    const yz = q.y * q.z
    const wx = q.w * q.x
    const wy = q.w * q.y
    const wz = q.w * q.z

    // Forward vector (Z-axis)
    const forwardVec: vector3 = {
      x: 2 * (xz + wy),
      y: 2 * (yz - wx),
      z: 1 - 2 * (xx + yy)
    }

    // Right vector (X-axis)
    const rightVec: vector3 = {
      x: 1 - 2 * (yy + zz),
      y: 2 * (xy + wz),
      z: 2 * (xz - wy)
    }

    // Up vector (Y-axis)
    const upVec: vector3 = {
      x: 2 * (xy - wz),
      y: 1 - 2 * (xx + zz),
      z: 2 * (yz + wx)
    }

    const forward = new vec3(forwardVec.x, forwardVec.y, forwardVec.z)
    const right = new vec3(rightVec.x, rightVec.y, rightVec.z)
    const up = new vec3(upVec.x, upVec.y, upVec.z)

    return {forward: forward, right: right, up: up}
  }

  private test() {
    // Example usage
    const quaternion: Quaternion = {x: 0, y: 0, z: 0, w: 1}
    const {forward, right, up} = this.getVectorsFromQuaternion(quaternion)
  }
}
