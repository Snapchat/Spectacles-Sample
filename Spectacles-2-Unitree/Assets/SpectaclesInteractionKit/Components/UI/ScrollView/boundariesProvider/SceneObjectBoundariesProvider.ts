import {BoundariesProvider} from "./BoundariesProvider"

const TAG = "SceneObjectBoundariesProvider"

/**
 * Apply a boundary by computing it from a Scene Object
 */
export abstract class SceneObjectBoundariesProvider extends BoundariesProvider {
  protected screenTransform: ScreenTransform = this.sceneObject.getComponent(
    "Component.ScreenTransform"
  )

  protected startingPosition = this.localPointToParentPoint(
    this.screenTransform,
    vec2.zero()
  )
  protected startingBoundaries: Rect

  /**
   * Apply a boundary by computing it from a Scene Object. Must have a ScreenTransform.
   * @param sceneObject - The scene object to compute using
   */
  constructor(readonly sceneObject: SceneObject) {
    super()

    if (!this.screenTransform) {
      throw new Error(`ScreenTransform missing in ${this.sceneObject.name}`)
    }

    const position = this.screenTransform.localPointToWorldPoint(vec2.zero())
    this.startingPosition = new vec2(position.x, position.y)
    this.startingBoundaries = this.getBoundaries()
  }

  get boundaries(): Rect {
    const offsetPosition = this.localPointToParentPoint(
      this.screenTransform,
      vec2.zero()
    ).sub(this.startingPosition)
    return Rect.create(
      this.startingBoundaries.left + offsetPosition.x,
      this.startingBoundaries.right + offsetPosition.x,
      this.startingBoundaries.bottom + offsetPosition.y,
      this.startingBoundaries.top + offsetPosition.y
    )
  }

  /**
   * @returns local position in world units relative to the parent's center
   */
  get position(): vec3 {
    return this.screenTransform.position
  }

  /**
   * Sets local position in world units relative to the parent's center
   * @param position - desired position
   */
  set position(position: vec3) {
    this.screenTransform.position = position
  }

  /**
   * Recomputes starting boundaries
   */
  recomputeStartingBoundaries(): void {
    this.startingPosition = this.localPointToParentPoint(
      this.screenTransform,
      vec2.zero()
    )
    this.startingBoundaries = this.getBoundaries()
  }

  protected abstract getBoundaries(): Rect

  protected createScreenTransformRectBoundaries(
    screenTransform: ScreenTransform
  ): Rect {
    const topLeftCorner = this.localPointToParentPoint(
      screenTransform,
      new vec2(-1, 1)
    )

    const bottomRightCorner = this.localPointToParentPoint(
      screenTransform,
      new vec2(1, -1)
    )

    return Rect.create(
      topLeftCorner.x,
      bottomRightCorner.x,
      bottomRightCorner.y,
      topLeftCorner.y
    )
  }

  private localPointToParentPoint(
    screenTransform: ScreenTransform,
    position: vec2
  ) {
    const worldPoint = screenTransform.localPointToWorldPoint(position)
    const parentPoint = this.screenTransform.worldPointToParentPoint(worldPoint)

    return parentPoint
  }
}
