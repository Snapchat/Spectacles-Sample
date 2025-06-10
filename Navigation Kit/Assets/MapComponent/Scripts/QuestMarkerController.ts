import {map, quaternionToPitch} from "./MapUtils"

import {LensConfig} from "SpectaclesInteractionKit.lspkg/Utils/LensConfig"
import {NavigationDataComponent} from "SpectaclesNavigationKit.lspkg/NavigationDataComponent/NavigationDataComponent"
import {Place} from "SpectaclesNavigationKit.lspkg/NavigationDataComponent/Place"
import {QuestMarker} from "./QuestMarker"
import { UICollisionSolver } from "../../NavigationKitAssets/Scripts/UICollisionDetector"
import {UpdateDispatcher} from "SpectaclesInteractionKit.lspkg/Utils/UpdateDispatcher"
import {UserPosition} from "SpectaclesNavigationKit.lspkg/NavigationDataComponent/UserPosition"
import WorldCameraFinderProvider from "SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider"

const BOUNDARY_HALF_WIDTH_PROJECTION = 35
const BOUNDARY_HALF_WIDTH = 26
const BOUNDARY_HALF_HEIGHT = 35
const Y_POSITION_LERP_BUFFER = 10 * MathUtils.DegToRad
const VIEW_DETECT_ANGLE_BUFFER = 3 * MathUtils.DegToRad

enum MarkerPosition {
  TOP = 0,
  RIGHT = 1,
  BOTTOM = 2,
  LEFT = 3,
  CORNER = 4,
  INVIEW = 5,
}

interface MarkerPositionIndex {
  position: MarkerPosition
  index: number
}

/**
 * Manages the {@link QuestMarker}s registered and presents a set to navigation markers on the users display direction
 * them to that position.
 */
@component
export class QuestMarkerController extends BaseScriptComponent {
  @input
  private navigationComponent: NavigationDataComponent
  @input
  private questMarkerPrefab: ObjectPrefab
  @input
  private inViewMaterial: Material
  @input
  private outOfViewMaterial: Material
  @input
  private scale: number = 1
  @input
  private markerImageOffsetInDegree: number = 0
  @input
  private markerHalfWidth = 5
  @input
  private markerHalfHeight = 5
  @input
  private labelHalfHeight = 0.7
  @input
  private displayOnlySelected: boolean = false

  private questMarkers: Map<string, QuestMarker> = new Map()
  private placeToQuestMarker: Map<Place, QuestMarker> = new Map()
  private camera: Camera
  private cameraTransform: Transform
  private halfFOV: number

  private uiCollisionSolver: UICollisionSolver = new UICollisionSolver()

  private leftElements: vec2[]
  private rightElements: vec2[]
  private topElements: vec2[]
  private bottomElements: vec2[]
  private inViewElements: vec4[]
  private markerPositions: MarkerPositionIndex[]
  private defaultLabelY: number
  private userPosition: UserPosition

  private updateDispatcher: UpdateDispatcher = LensConfig.getInstance().updateDispatcher

  onAwake() {
    this.createEvent("OnStartEvent").bind(this.onStart.bind(this))
    this.updateDispatcher.createLateUpdateEvent("LateUpdateEvent").bind(this.onLateUpdate.bind(this))
  }

  onStart() {
    this.camera = WorldCameraFinderProvider.getInstance().getComponent()
    this.cameraTransform = WorldCameraFinderProvider.getInstance().getTransform()

    this.userPosition = this.navigationComponent.getUserPosition()
    this.navigationComponent.onNavigationStarted.add((place) => {
      this.updateSelected(place)
    })
  }

  onLateUpdate() {
    this.halfFOV = this.camera.fov / 2 - VIEW_DETECT_ANGLE_BUFFER

    const markerPlaneDistanceFromCamera = this.sceneObject
      .getTransform()
      .getWorldPosition()
      .distance(this.cameraTransform.getWorldPosition())
    const yOrientationOffset: number =
      -Math.abs(markerPlaneDistanceFromCamera) * Math.tan(quaternionToPitch(this.cameraTransform.getLocalRotation()))

    this.leftElements = []
    this.rightElements = []
    this.topElements = []
    this.bottomElements = []
    this.inViewElements = []
    this.markerPositions = new Array(this.questMarkers.size)

    let markerIndex = 0
    this.questMarkers.forEach((marker) => {
      // TODO: Handle null
      const distance = marker.getPhysicalDistance(this.userPosition) ?? 0

      const {orientation, xPosition, yPosition} = this.resolveMarkerPositionAndRotation(
        marker,
        this.userPosition,
        yOrientationOffset,
      )

      marker.setOrientation(orientation)
      marker.setDistance(distance)
      const localPosition = new vec3(
        xPosition,
        MathUtils.clamp(yPosition, -BOUNDARY_HALF_HEIGHT, BOUNDARY_HALF_HEIGHT),
        0,
      )

      marker.transform.setLocalPosition(localPosition)

      this.registerMarkerPositions(localPosition, markerIndex)
      markerIndex++
    })

    this.resolveMarkerPositions()
  }

  public getQuestMarks(): QuestMarker[] {
    return Array.from(this.questMarkers.values())
  }

  private resolveMarkerPositions() {
    const resolvedLeftElements = this.uiCollisionSolver.resolve1DCollisions(this.leftElements)
    const resolvedRightElements = this.uiCollisionSolver.resolve1DCollisions(this.rightElements)
    const resolvedBottomElements = this.uiCollisionSolver.resolve1DCollisions(this.bottomElements)
    const resolvedTopElements = this.uiCollisionSolver.resolve1DCollisions(this.topElements)
    const resolvedInViewElements = this.uiCollisionSolver.resolve2DCollisions(this.inViewElements)

    let markerIndex = 0
    this.questMarkers.forEach((marker) => {
      const localPosition = marker.transform.getLocalPosition()
      const labelLocalPosition = marker.markerLabel.getTransform().getLocalPosition()
      const distanceTextLocalPosition = marker.distanceText.getTransform().getLocalPosition()
      let x = localPosition.x
      let y = localPosition.y
      let labelLocalY = this.defaultLabelY
      if (this.markerPositions[markerIndex].position === MarkerPosition.LEFT) {
        y = resolvedLeftElements[this.markerPositions[markerIndex].index].y - this.markerHalfHeight
      } else if (this.markerPositions[markerIndex].position === MarkerPosition.RIGHT) {
        y = resolvedRightElements[this.markerPositions[markerIndex].index].y - this.markerHalfHeight
      } else if (this.markerPositions[markerIndex].position === MarkerPosition.BOTTOM) {
        x = resolvedBottomElements[this.markerPositions[markerIndex].index].y - this.markerHalfWidth
      } else if (this.markerPositions[markerIndex].position === MarkerPosition.TOP) {
        x = resolvedTopElements[this.markerPositions[markerIndex].index].y - this.markerHalfWidth
      }
      marker.transform.setLocalPosition(new vec3(x, y, localPosition.z))

      if (this.markerPositions[markerIndex].position === MarkerPosition.INVIEW) {
        labelLocalY =
          resolvedInViewElements[this.markerPositions[markerIndex].index].w -
          this.labelHalfHeight +
          this.defaultLabelY -
          y
      }
      marker.markerLabel
        .getTransform()
        .setLocalPosition(new vec3(labelLocalPosition.x, labelLocalY, labelLocalPosition.z))
      marker.distanceText
        .getTransform()
        .setLocalPosition(new vec3(distanceTextLocalPosition.x, -labelLocalY, distanceTextLocalPosition.z))
      markerIndex++
    })
    return markerIndex
  }

  private registerMarkerPositions(localPosition: vec3, markerIndex: number) {
    const isCorner =
      Math.abs(localPosition.y) === Math.abs(BOUNDARY_HALF_HEIGHT) &&
      Math.abs(localPosition.x) === Math.abs(BOUNDARY_HALF_WIDTH)

    if (isCorner) {
      this.markerPositions[markerIndex] = {
        position: MarkerPosition.CORNER,
        index: 0,
      }
    } else {
      if (localPosition.x === -BOUNDARY_HALF_WIDTH) {
        this.markerPositions[markerIndex] = {
          position: MarkerPosition.LEFT,
          index: this.leftElements.length,
        }
        this.leftElements.push(
          new vec2(localPosition.y - this.markerHalfHeight, localPosition.y + this.markerHalfHeight),
        )
      } else if (localPosition.x === BOUNDARY_HALF_WIDTH) {
        this.markerPositions[markerIndex] = {
          position: MarkerPosition.RIGHT,
          index: this.rightElements.length,
        }
        this.rightElements.push(
          new vec2(localPosition.y - this.markerHalfHeight, localPosition.y + this.markerHalfHeight),
        )
      } else if (localPosition.y === -BOUNDARY_HALF_HEIGHT) {
        this.markerPositions[markerIndex] = {
          position: MarkerPosition.BOTTOM,
          index: this.bottomElements.length,
        }
        this.bottomElements.push(
          new vec2(localPosition.x - this.markerHalfWidth, localPosition.x + this.markerHalfWidth),
        )
      } else if (localPosition.y === BOUNDARY_HALF_HEIGHT) {
        this.markerPositions[markerIndex] = {
          position: MarkerPosition.TOP,
          index: this.topElements.length,
        }
        this.topElements.push(new vec2(localPosition.x - this.markerHalfWidth, localPosition.x + this.markerHalfWidth))
      } else {
        this.markerPositions[markerIndex] = {
          position: MarkerPosition.INVIEW,
          index: this.inViewElements.length,
        }
        // Assume the in-view markers are all at the same height
        this.inViewElements.push(
          new vec4(
            localPosition.x - this.markerHalfWidth,
            localPosition.x + this.markerHalfWidth,
            localPosition.y - this.labelHalfHeight,
            localPosition.y + this.labelHalfHeight,
          ),
        )
      }
    }
  }

  private resolveMarkerPositionAndRotation(
    marker: QuestMarker,
    userPosition: UserPosition,
    yOrientationOffset: number,
  ): {orientation: number; xPosition: number; yPosition: number} {
    const bearing = marker.getBearing(userPosition)
    const inView = bearing < this.halfFOV && bearing > -this.halfFOV
    const backStartAngle = Math.PI - this.halfFOV
    const isOnTheBack = bearing > backStartAngle || bearing < -backStartAngle

    let screenPosition: vec2
    if (inView || isOnTheBack) {
      screenPosition = marker.getScreenSpaceCoordinate(userPosition, this.camera, yOrientationOffset) ?? new vec2(0, 0)
    } else {
      screenPosition = this.mapAngleToScreenPoint(bearing)
    }

    let orientation = -(bearing + this.markerImageOffsetInDegree * MathUtils.DegToRad)
    marker.setIsInView(inView, this.inViewMaterial, this.outOfViewMaterial)
    if (inView) {
      if (screenPosition.y > -BOUNDARY_HALF_HEIGHT && screenPosition.y < BOUNDARY_HALF_HEIGHT) {
        marker.setIsInView(true, this.inViewMaterial, this.outOfViewMaterial)
        orientation = 0
      } else {
        // Outside of vertical view
        marker.setIsInView(false, this.inViewMaterial, this.outOfViewMaterial)
        if (yOrientationOffset < -BOUNDARY_HALF_HEIGHT) {
          orientation = Math.PI * 2 - orientation
        }
      }
    } else {
      marker.setIsInView(false, this.inViewMaterial, this.outOfViewMaterial)
      const unrestrainedYPosition = screenPosition.y + yOrientationOffset
      const yPositionUnderTopBoundary = Math.min(unrestrainedYPosition, BOUNDARY_HALF_HEIGHT)
      const min = yPositionUnderTopBoundary < -BOUNDARY_HALF_HEIGHT ? -BOUNDARY_HALF_HEIGHT : yPositionUnderTopBoundary

      screenPosition.y = MathUtils.clamp(unrestrainedYPosition, min, yOrientationOffset)

      // Smooth transition the y-position to the bottom when the marker is on the back
      const absBearing = Math.abs(bearing)
      if (absBearing > backStartAngle - Y_POSITION_LERP_BUFFER) {
        const t = MathUtils.clamp((absBearing - backStartAngle + Y_POSITION_LERP_BUFFER) / Y_POSITION_LERP_BUFFER, 0, 1)
        screenPosition.y = MathUtils.lerp(screenPosition.y, -BOUNDARY_HALF_HEIGHT, t)
      }
    }
    return {
      orientation,
      xPosition: screenPosition.x,
      yPosition: screenPosition.y,
    }
  }

  public addQuestMark(questMarker: QuestMarker, place: Place | null = null): void {
    const uniqueIdentifier = questMarker.uniqueIdentifier
    if (!this.questMarkers.has(uniqueIdentifier)) {
      const questmarkObject = this.questMarkerPrefab.instantiate(this.sceneObject)
      questmarkObject.name = "QuestMark " + this.questMarkers.size

      questMarker.initialize(
        questmarkObject.getTransform(),
        this.scale,
        BOUNDARY_HALF_WIDTH_PROJECTION,
        BOUNDARY_HALF_WIDTH,
        BOUNDARY_HALF_HEIGHT,
        this.halfFOV,
      )
      this.defaultLabelY = questMarker.markerLabel.getTransform().getLocalPosition().y
      this.questMarkers.set(uniqueIdentifier, questMarker)

      if (!isNull(place)) {
        this.placeToQuestMarker.set(place, questMarker)
      }
    }
  }

  public removeQuestMark(questMark: QuestMarker): void {
    this.questMarkers.delete(questMark.uniqueIdentifier)
    questMark.transform.getSceneObject().destroy()
  }

  private updateSelected(place: Place | null): void {
    const visible = !this.displayOnlySelected || isNull(place)
    this.questMarkers.forEach((m) => {
      m.setVisible(visible)
    })

    const selectedMarker = this.placeToQuestMarker.get(place)
    if (!isNull(selectedMarker)) {
      selectedMarker.setVisible(true)
    }
  }

  private mapAngleToScreenPoint(radians: number): vec2 {
    let x, y: number
    const degree = radians * MathUtils.RadToDeg
    var top = BOUNDARY_HALF_HEIGHT
    var left = -BOUNDARY_HALF_WIDTH
    var right = BOUNDARY_HALF_WIDTH
    var bottom = -BOUNDARY_HALF_HEIGHT

    const halfFOVInDegree = this.halfFOV * MathUtils.RadToDeg

    if (degree >= -halfFOVInDegree && degree <= halfFOVInDegree) {
      // top
      y = top
      x = map(degree, -halfFOVInDegree, halfFOVInDegree, left, right)
    } else if (degree > halfFOVInDegree && degree <= 180 - halfFOVInDegree) {
      // right
      y = map(degree, halfFOVInDegree, 180 - halfFOVInDegree, top, bottom)
      x = right
    } else if (degree < -halfFOVInDegree && degree >= -180 + halfFOVInDegree) {
      // left
      y = map(degree, -halfFOVInDegree, -180 + halfFOVInDegree, top, bottom)
      x = left
    } else if (degree < -180 + halfFOVInDegree) {
      // bottom
      y = bottom
      x = map(degree, -180 + halfFOVInDegree, -180, left, 0)
    } else {
      // bottom
      y = bottom
      x = map(degree, 180 - halfFOVInDegree, 180, right, 0)
    }

    return new vec2(x, y)
  }
}
