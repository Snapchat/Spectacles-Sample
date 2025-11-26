/**
 * Creates a spherical sensor volume to track overlaps with other colliders.
 *
 * This component actively maintains a list of objects within its radius and can be queried to find the closest point on
 * those objects.
 */
@component
export class ProximitySensor extends BaseScriptComponent {
  /**
   * Display debug rendering for the proximity sensor.
   */
  @input
  @hint("Display debug rendering for the proximity sensor.")
  debugModeEnabled = false

  /**
   * The radius of the spherical sensor in cemtimeters.
   */
  @input()
  @hint("The radius of the spherical sensor in cemtimeters.")
  radius: number = 1.0

  private sensorCollider: ColliderComponent | null = null
  private overlappingColliders: Set<ColliderComponent> = new Set()

  onAwake(): void {
    this.createSensorVolume()
  }

  /**
   * Updates the radius at runtime and automatically recalculates the larger detection radius needed for the buffer.
   * @param newRadius The new inner radius for the effect.
   */
  setRadius(newRadius: number): void {
    this.radius = newRadius

    if (this.sensorCollider && this.sensorCollider.shape) {
      const sphereShape = this.sensorCollider.shape as SphereShape
      sphereShape.radius = this.radius
    }
  }

  /**
   * Returns a list of all colliders currently inside the large detection volume.
   * @returns An array of the overlapping ColliderComponents.
   */
  getOverlappingColliders(): ColliderComponent[] {
    if (this.debugModeEnabled) {
      const sensorCenter = this.getSceneObject().getTransform().getWorldPosition()
      global.debugRenderSystem.drawSphere(sensorCenter, this.radius, new vec4(0.7, 0.7, 0.7, 1))
    }

    return Array.from(this.overlappingColliders)
  }

  private createSensorVolume(): void {
    this.sensorCollider = this.getSceneObject().createComponent("Physics.ColliderComponent") as ColliderComponent

    const shape = Shape.createSphereShape()
    shape.radius = this.radius

    this.sensorCollider.shape = shape
    this.sensorCollider.intangible = true
    this.sensorCollider.debugDrawEnabled = false

    this.sensorCollider.onOverlapEnter.add(this.onOverlapEnter.bind(this))
    this.sensorCollider.onOverlapExit.add(this.onOverlapExit.bind(this))
  }

  private onOverlapEnter(args: OverlapEnterEventArgs): void {
    const otherCollider = args.overlap.collider
    if (otherCollider && otherCollider !== this.sensorCollider) {
      this.overlappingColliders.add(otherCollider)
    }
  }

  private onOverlapExit(args: OverlapExitEventArgs): void {
    const otherCollider = args.overlap.collider
    if (otherCollider) {
      this.overlappingColliders.delete(otherCollider)
    }
  }
}
