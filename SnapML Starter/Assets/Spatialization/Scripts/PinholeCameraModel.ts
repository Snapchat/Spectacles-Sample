/**
 * PinholeCameraModel takes the camera intrinsic values from the device camera,
 * and provides helper methods to convert between 2D and 3D coordinates.
 */
export class PinholeCameraModel {
  public readonly resolution: vec2;
  public readonly focalLength: vec2;
  public readonly principalPoint: vec2;

  constructor(resolution: vec2, focalLength: vec2, principalPoint: vec2) {
    this.resolution = resolution;
    this.focalLength = focalLength;
    this.principalPoint = principalPoint;
  }

  static create(device: DeviceCamera): PinholeCameraModel {
    // the principal point from DeviceCamera is in CV convention
    // (x is right, y is down, pixel center is integer coords)
    // but converted to GL convention
    // (x is right, y is up, pixel center is half coords)
    const pp = device.principalPoint.add(new vec2(0.5, 0.5));
    pp.y = device.resolution.y - pp.y;
    return new PinholeCameraModel(device.resolution, device.focalLength, pp);
  }

  static nominal(): PinholeCameraModel {
    return new PinholeCameraModel(
      new vec2(1008, 756),
      new vec2(480, 480),
      new vec2(501, 379.25)
    );
  }

  resize(newResolution: vec2): PinholeCameraModel {
    const scale = newResolution.div(this.resolution);
    return new PinholeCameraModel(
      newResolution,
      this.focalLength.scale(scale),
      this.principalPoint.scale(scale)
    );
  }

  crop(bottomLeft: vec2, newResolution: vec2): PinholeCameraModel {
    return new PinholeCameraModel(
      newResolution,
      this.focalLength,
      this.principalPoint.sub(bottomLeft)
    );
  }

  projectToUV(pos: vec3): vec2 {
    const dir = new vec2(pos.x, pos.y).uniformScale(1 / -pos.z);
    const uv = dir
      .mult(this.focalLength)
      .add(this.principalPoint)
      .div(this.resolution);
    return uv;
  }

  projectToPixel(pos: vec3): vec2 {
    const dir = new vec2(pos.x, pos.y).uniformScale(1 / -pos.z);
    const pixel = dir
      .mult(this.focalLength)
      .add(this.principalPoint)
      .sub(new vec2(0.5, 0.5));
    return pixel;
  }

  unprojectFromUV(uv: vec2, depth: number): vec3 {
    const dir = uv
      .mult(this.resolution)
      .sub(this.principalPoint)
      .div(this.focalLength);
    const pos = new vec3(dir.x, dir.y, -1).uniformScale(depth);
    return pos;
  }

  unprojectFromPixel(pixel: vec2, depth: number): vec3 {
    const dir = pixel
      .add(new vec2(0.5, 0.5))
      .sub(this.principalPoint)
      .div(this.focalLength);
    const pos = new vec3(dir.x, dir.y, -1).uniformScale(depth);
    return pos;
  }

  getLocalTransformForDepth(depth: number): mat4 {
    const dir = this.resolution
      .uniformScale(0.5)
      .sub(this.principalPoint)
      .div(this.focalLength);
    const pos = new vec3(dir.x, dir.y, -1).uniformScale(depth);
    const scale = this.resolution.div(this.focalLength).uniformScale(depth);
    return mat4.compose(
      pos,
      quat.quatIdentity(),
      new vec3(scale.x, scale.y, 1)
    );
  }

  get fov(): number {
    return Math.atan(this.resolution.y / 2 / this.focalLength.y) * 2;
  }

  get aspect(): number {
    const size = this.resolution.div(this.focalLength);
    return size.x / size.y;
  }
}

export default PinholeCameraModel;
