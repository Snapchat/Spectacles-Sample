import {UserPosition} from "SpectaclesNavigationKit.lspkg/NavigationDataComponent/UserPosition"

/**
 * Controls a on screen marker directing the user to a position.
 */
export abstract class QuestMarker {
  protected boundaryHalfWidthProjection: number
  protected boundaryHalfWidth: number
  protected boundaryHalfHeight: number
  protected halfFov: number
  public transform: Transform
  public markerLabel: Text
  public distanceText: Text
  public imageComponent: Image
  public uniqueIdentifier: string

  constructor(uniqueIdentifier: string) {
    this.uniqueIdentifier = uniqueIdentifier
  }

  public initialize(
    transform: Transform,
    scale: number,
    boundaryHalfWidthProjection: number,
    boundaryHalfWidth: number,
    boundaryHalfHeight: number,
    halfFov: number
  ): void {
    this.transform = transform
    this.transform.setLocalScale(new vec3(scale, scale, scale))
    this.boundaryHalfWidthProjection = boundaryHalfWidthProjection
    this.boundaryHalfWidth = boundaryHalfWidth
    this.boundaryHalfHeight = boundaryHalfHeight
    this.halfFov = halfFov

    this.markerLabel = transform.getSceneObject().getChild(0).getComponent("Text")
    this.distanceText = transform.getSceneObject().getChild(1).getComponent("Text")
    this.imageComponent = transform.getSceneObject().getChild(2).getComponent("Image")
  }

  /**
   * Updates the display dependant on if the marker is in view or not.
   *
   * @param isInView - True if the marker is within the users field of view.
   * @param inViewMaterial - The material to be used if it is.
   * @param outOfViewMaterial - The material to be used if it is not.
   */
  public setIsInView(isInView: boolean, inViewMaterial: Material, outOfViewMaterial: Material): void {
    if (isInView) {
      this.imageComponent.mainMaterial = inViewMaterial
      this.markerLabel.textFill.color = this.getTextColor()
      this.distanceText.textFill.color = new vec4(1, 1, 1, 1)
    } else {
      this.imageComponent.mainMaterial = outOfViewMaterial
      this.markerLabel.textFill.color = this.getTextColor()
      this.distanceText.textFill.color = new vec4(1, 1, 1, 1)
    }
  }

  /**
   * Updates the distance display.
   */
  public setDistance(distance: number): void {
    this.distanceText.text = `${distance.toFixed(0)}m`
  }

  /**
   * Sets the orientation of the marker.
   */
  public setOrientation(orientation: number): void {
    this.imageComponent.getTransform().setLocalRotation(quat.fromEulerAngles(0, 0, orientation))
  }

  public setVisible(visible: boolean): void {
    this.markerLabel.enabled = visible
    this.distanceText.enabled = visible
    this.imageComponent.enabled = visible
  }

  /**
   * Returns the bearing of the marker relative to the user.
   *
   * @param userPosition - The user's current position.
   */
  abstract getBearing(userPosition: UserPosition): number | null

  /**
   * Returns the distance to the marker in meters.
   *
   * @param userPosition - The user's current position.
   */
  abstract getPhysicalDistance(userPosition: UserPosition): number | null

  /**
   * Returns the world space position of the marker.
   *
   * @param userPosition - The user's world space position.
   */
  abstract getWorldPosition(userPosition: UserPosition): vec3 | null

  /**
   * Returns the screen space coordinate of the marker.
   *
   * @param userPosition - The users current position.
   * @param camera - The camera through which the position should be projected.
   * @param yOrientationOffset - A manual offset to the Y coordinate.
   */
  abstract getScreenSpaceCoordinate(userPosition: UserPosition, camera: Camera, yOrientationOffset: number): vec2

  /**
   * Clamps a screen space coordinate to the projection boundaries.
   *
   * @param screenSpaceRaw - The raw screen space coordinate.
   * @param isOnTheBack - True if the position is behind.
   * @returns A clamped screen space coordinate.
   */
  public clampScreenSpace(screenSpaceRaw: vec2, isOnTheBack: boolean): vec2 {
    return new vec2(
      MathUtils.clamp(
        (screenSpaceRaw.x - 0.5) * this.boundaryHalfWidthProjection * 2 * (isOnTheBack ? -1 : 1),
        -this.boundaryHalfWidth,
        this.boundaryHalfWidth
      ),
      MathUtils.lerp(-this.boundaryHalfHeight, this.boundaryHalfHeight, 1 - screenSpaceRaw.y)
    )
  }

  /**
   * Returns true if the bearing if backwards.
   * @param bearing - The bearing of the object.
   */
  public calculateIsOnTheBack(bearing: number): boolean {
    const backStartAngle = Math.PI - this.halfFov
    return bearing > backStartAngle || bearing < -backStartAngle
  }

  /**
   * Returns the color to be applied to the text.
   * To be used in overriding to communicate different states of the marker.
   */
  protected getTextColor(): vec4 {
    return new vec4(1, 1, 1, 1)
  }
}
