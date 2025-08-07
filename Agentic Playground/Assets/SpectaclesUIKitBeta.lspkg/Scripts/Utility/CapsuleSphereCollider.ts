const ENLARGE_MULTIPLIER = 3

@component
export class CapsuleSphereCollider extends BaseScriptComponent {
  @input
  debugVisuals: boolean = false

  collider: ColliderComponent
  private shape: BoxShape
  private expandedShape: BoxShape
  private transform: Transform = this.sceneObject.getTransform()
  private intialized: boolean = false

  onAwake() {
    this.collider =
      this.sceneObject.getComponent("ColliderComponent") || this.sceneObject.createComponent("ColliderComponent")
    this.shape = Shape.createBoxShape()
    this.expandedShape = Shape.createBoxShape()
    this.createEvent("OnStartEvent").bind(this.initialize)
  }

  initialize = () => {
    if (this.intialized) return
    const worldScale = this.transform.getWorldScale()
    const scaleX = worldScale.x
    const innerScale = scaleX === 1 ? 0 : scaleX
    const radius = Math.max(worldScale.y, worldScale.z)
    this.shape.size = new vec3((radius + innerScale) / scaleX, 1, 1)
    this.expandedShape.size = new vec3(
      this.shape.size.x * ENLARGE_MULTIPLIER,
      this.shape.size.y * ENLARGE_MULTIPLIER,
      this.shape.size.z
    )
    this.collider.shape = this.shape

    this.collider.fitVisual = false
    this.collider.debugDrawEnabled = this.debugVisuals
    this.intialized = true
  }

  expandSize() {
    this.collider.shape = this.expandedShape
  }

  resetSize() {
    this.collider.shape = this.shape
  }

  setSize = (size: vec3) => {
    this.shape.size = size
    this.expandedShape.size = new vec3(
      this.shape.size.x * ENLARGE_MULTIPLIER,
      this.shape.size.y * ENLARGE_MULTIPLIER,
      this.shape.size.z
    )
    this.collider.shape = this.shape
  }

  getSize = (): vec3 => {
    return this.shape.size
  }
}
