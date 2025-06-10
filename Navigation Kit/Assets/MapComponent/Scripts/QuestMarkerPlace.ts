import {Place} from "SpectaclesNavigationKit.lspkg/NavigationDataComponent/Place"
import {UserPosition} from "SpectaclesNavigationKit.lspkg/NavigationDataComponent/UserPosition"
import {QuestMarker} from "./QuestMarker"

/**
 * Creates a {@link QuestMarker} out of a {@link Place}.
 */
export class QuestMarkerPlace extends QuestMarker {
  private _place: Place
  private selectedColor: vec4 = new vec4(0.2, 1.0, 0.3, 1.0)
  private baseColor: vec4 = new vec4(1.0, 1.0, 1.0, 1.0)

  public selected: boolean = false

  public get place(): Place {
    return this._place
  }

  constructor(place: Place, uniqueIdentifier: string) {
    super(uniqueIdentifier)

    if (isNull(place)) {
      throw new Error("QuestMarker initialized with null location.")
    }

    this._place = place
  }

  public override initialize(
    transform: Transform,
    scale: number,
    boundaryHalfWidthProjection: number,
    boundaryHalfWidth: number,
    boundaryHalfHeight: number,
    halfFov: number,
  ): void {
    super.initialize(transform, scale, boundaryHalfWidthProjection, boundaryHalfWidth, boundaryHalfHeight, halfFov)

    this.markerLabel.text = this._place.name ?? "Location"
  }

  public getBearing(userPosition: UserPosition): number | null {
    return userPosition.getBearingTo(this._place, false)
  }

  public getPhysicalDistance(userPosition: UserPosition): number | null {
    return userPosition.getDistanceTo(this._place)
  }

  public getWorldPosition(userPosition: UserPosition): vec3 | null {
    return this._place.getRelativePosition()
  }

  // TODO: Move single version to super
  public getScreenSpaceCoordinate(userPosition: UserPosition, camera: Camera, yOrientationOffset: number): vec2 {
    const bearing = this.getBearing(userPosition)
    const inView = bearing < this.halfFov && bearing > -this.halfFov
    const backStartAngle = Math.PI - this.halfFov
    const isOnTheBack = bearing > backStartAngle || bearing < -backStartAngle

    const markerLocationWorldPos = this.getWorldPosition(userPosition)

    let screenPosition = camera.worldSpaceToScreenSpace(markerLocationWorldPos)

    screenPosition = this.clampScreenSpace(screenPosition, isOnTheBack)

    if (inView) {
      screenPosition.y = MathUtils.clamp(screenPosition.y, -this.boundaryHalfHeight, this.boundaryHalfHeight)
    }

    return screenPosition
  }

  /**
   * Update the colors used to display selected or not.
   *
   * @param selectedColor - The color to be used when selected.
   * @param baseColor - The color to be used when not selected.
   */
  public updateColors(selectedColor: vec4, baseColor: vec4): void {
    this.selectedColor = selectedColor
    this.baseColor = baseColor
  }

  protected override getTextColor(): vec4 {
    if (this.selected) {
      return this.selectedColor
    } else {
      return this.baseColor
    }
  }
}
