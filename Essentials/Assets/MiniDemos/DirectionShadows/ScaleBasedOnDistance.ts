/**
 * ScaleBasedOnDistance.ts
 *
 * This utility scales an object based on the distance between two other objects.
 */
@component
export class ScaleBasedOnDistance extends BaseScriptComponent {
  // Store the last calculated scale to avoid unnecessary updates
  private lastScale: number = -1

  // Define inputs using Lens Studio syntax
  @input
  public startObject: SceneObject
  @input
  public endObject: SceneObject
  @input
  public minScale: number = 0.5
  @input
  public maxScale: number = 2.0
  @input
  public objectToScale: SceneObject
  @input
  public closestIsBigger: boolean = true
  @input
  public minDistance: number = 0 // Minimum distance that corresponds to min/max scale
  @input
  public maxDistance: number = 100 // Maximum distance that corresponds to max/min scale

  /**
   * Initialize the script
   */
  private init(): void {
    // Validate inputs
    if (!this.startObject) {
      print("Error: Start Object is not set")
      return
    }

    if (!this.endObject) {
      print("Error: End Object is not set")
      return
    }

    if (!this.objectToScale) {
      print("Error: Object To Scale is not set")
      return
    }

    if (this.minScale > this.maxScale) {
      print("Warning: Min Scale is greater than Max Scale. Swapping values.")
      const temp = this.minScale
      this.minScale = this.maxScale
      this.maxScale = temp
    }

    if (this.minDistance > this.maxDistance) {
      print("Warning: Min Distance is greater than Max Distance. Swapping values.")
      const temp = this.minDistance
      this.minDistance = this.maxDistance
      this.maxDistance = temp
    }
  }

  /**
   * Called every frame
   */
  private update(): void {
    if (!this.startObject || !this.endObject || !this.objectToScale) {
      return
    }

    // Calculate the distance between the two objects
    const distance = this.calculateDistance(this.startObject, this.endObject)

    // Calculate the scale based on the distance
    const scale = this.calculateScale(distance)

    // Only update if the scale has changed significantly
    if (Math.abs(scale - this.lastScale) > 0.001) {
      this.lastScale = scale

      // Apply the scale to the object using vec3 type
      const uniformScale = new vec3(scale, scale, scale)
      this.objectToScale.getTransform().setLocalScale(uniformScale)
    }
  }

  /**
   * Calculate the distance between two scene objects
   * @param obj1 The first scene object
   * @param obj2 The second scene object
   * @returns The distance between the objects in world units
   */
  private calculateDistance(obj1: SceneObject, obj2: SceneObject): number {
    const pos1 = obj1.getTransform().getWorldPosition()
    const pos2 = obj2.getTransform().getWorldPosition()

    // Calculate Euclidean distance
    const dx = pos2.x - pos1.x
    const dy = pos2.y - pos1.y
    const dz = pos2.z - pos1.z

    return Math.sqrt(dx * dx + dy * dy + dz * dz)
  }

  /**
   * Calculate the scale based on the distance
   * @param distance The distance between the two objects
   * @returns The calculated scale value
   */
  private calculateScale(distance: number): number {
    // Clamp the distance to our defined range
    const clampedDistance = Math.max(this.minDistance, Math.min(this.maxDistance, distance))

    // Calculate normalized position in the distance range (0 to 1)
    const normalizedDistance = (clampedDistance - this.minDistance) / (this.maxDistance - this.minDistance)

    // Apply linear interpolation between min and max scale
    let scale: number

    if (this.closestIsBigger) {
      // Closer distance = bigger scale (inverse relationship)
      scale = this.maxScale - normalizedDistance * (this.maxScale - this.minScale)
    } else {
      // Closer distance = smaller scale (direct relationship)
      scale = this.minScale + normalizedDistance * (this.maxScale - this.minScale)
    }

    // Since we already clamped the distance, the scale should be within bounds
    return scale
  }

  constructor() {
    super()
    this.init()
    this.createEvent("UpdateEvent").bind(this.update.bind(this))
  }
}
