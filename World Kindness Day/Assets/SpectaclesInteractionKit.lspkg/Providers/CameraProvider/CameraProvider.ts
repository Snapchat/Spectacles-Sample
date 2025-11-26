/**
 * Defines available camera apis
 * This abstraction was added to avoid mocking CameraComponent, Transform, etc
 * in other classes that are being tested
 */
export default interface CameraProvider {
  /**
   * Add SceneObject as a child of the camera's SceneObject
   *
   * @param sceneObject - SceneObject to attach
   */
  attachSceneObject(sceneObject: SceneObject): void

  /**
   * Returns the camera component
   */
  getComponent(): Camera

  /**
   * Returns the layer set to which this camera is rendering to
   */
  renderLayer(): LayerSet

  /**
   * Returns the up vector of the camera.
   */
  up(): vec3

  /**
   * Returns the right vector of the camera.
   */
  right(): vec3

  /**
   * Returns the back vector of the camera. This is actually the front vector because the camera is reversed in Lens Studio.
   */
  back(): vec3

  /**
   * Returns the forward vector of the camera. This is actually the back vector because the camera is reversed in Lens Studio.
   */
  forward(): vec3

  /**
   * Returns the camera's world position
   */
  getWorldPosition(): vec3

  /**
   * Returns the camera's transform
   */
  getTransform(): Transform

  /**
   * Returns the camera's world transform
   */
  getWorldTransform(): mat4

  /**
   * Returns the camera's local scale
   */
  getLocalScale(): vec3

  /**
   * Returns the camera's world position projected from screen space coordinates at a given z depth
   *
   * @param x
   * @param y
   * @param absoluteDepth
   */
  screenSpaceToWorldSpace(x: number, y: number, absoluteDepth: number): vec3

  worldSpaceToScreenSpace(x: number, y: number, z: number): vec2

  /**
   * Clears the renderTarget with the provided color before drawing to it
   *
   * @param color the color to clear the renderTarget with
   */
  enableClearColor(color: vec4): void

  /**
   * Returns the clear color applied to the camera
   */
  getClearColor(): vec4

  /**
   * @returns whether a position is in camera FoV or not
   * @param worldPosition - vec3 representing the position in world space
   */
  inFoV(worldPosition: vec3): boolean

  /**
   * @returns a position in world space in front of the camera by x units
   * @param x - the magnitude to multiply the camera's forward direction by
   * @param parallelToGround - if the camera's forward direction should be projected to be parallel to ground
   */
  getForwardPosition(x: number, parallelToGround: false): vec3

  /**
   * @returns a position in world space in front of the camera (parallel to ground)
   * @param x - the magnitude to multiply the camera's forward direction by
   */
  getForwardPositionParallelToGround(x: number): vec3
}
