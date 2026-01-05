import WorldCameraFinderProvider from "SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider"
import {LensConfig} from "SpectaclesInteractionKit.lspkg/Utils/LensConfig"
import {UpdateDispatcher} from "SpectaclesInteractionKit.lspkg/Utils/UpdateDispatcher"
import {MapComponent} from "../MapComponent/Scripts/MapComponent"
import {MapPin} from "../MapComponent/Scripts/MapPin"
import {
  calculateBearing,
  customGetEuler,
  getPhysicalDistanceBetweenLocations,
  map,
  normalizeAngle,
  quaternionToPitch
} from "../MapComponent/Scripts/MapUtils"
import {QuestMarker} from "../MapComponent/Scripts/QuestMarker"
import {UICollisionSolver} from "./UICollisionDetector"

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
  INVIEW = 5
}

interface MarkerPositionIndex {
  position: MarkerPosition
  index: number
}

@component
export class QuestMarkController extends BaseScriptComponent {
  @input
  private mapComponent: MapComponent
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

  private questMarkers: Map<string, QuestMarker> = new Map()
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

  private updateDispatcher: UpdateDispatcher = LensConfig.getInstance().updateDispatcher

  onAwake() {
    this.createEvent("OnStartEvent").bind(this.onStart.bind(this))
    this.updateDispatcher.createLateUpdateEvent("LateUpdateEvent").bind(this.onLateUpdate.bind(this))
  }

  onStart() {
    this.mapComponent.subscribeOnMapAddPin(this.handleMapAddPin.bind(this))
    this.mapComponent.subscribeOnAllMapPinsRemoved(this.handleAllMapPinsRemoved.bind(this))

    this.camera = WorldCameraFinderProvider.getInstance().getComponent()
    this.cameraTransform = WorldCameraFinderProvider.getInstance().getTransform()
  }

  onLateUpdate() {
    this.halfFOV = this.camera.fov / 2 - VIEW_DETECT_ANGLE_BUFFER

    // Calculate the position of the quest mark on the screen by comparing the longlat of the map pin and the user

    const userLocation = this.mapComponent.getUserLocation()
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
      const distance = getPhysicalDistanceBetweenLocations(userLocation, marker.mapPin.location)

      const {orientation, xPosition, yPosition} = this.resolveMarkerPositionAndRotation(
        distance,
        marker,
        userLocation,
        yOrientationOffset
      )

      marker.setOrientation(orientation)
      marker.setDistance(distance)
      const localPosition = new vec3(
        xPosition,
        MathUtils.clamp(yPosition, -BOUNDARY_HALF_HEIGHT, BOUNDARY_HALF_HEIGHT),
        0
      )

      marker.transform.setLocalPosition(localPosition)

      this.registerMarkerPositions(localPosition, markerIndex)

      markerIndex++
    })

    this.resolveMarkerPositions()
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
        index: 0
      }
    } else {
      if (localPosition.x == -BOUNDARY_HALF_WIDTH) {
        this.markerPositions[markerIndex] = {
          position: MarkerPosition.LEFT,
          index: this.leftElements.length
        }
        this.leftElements.push(
          new vec2(localPosition.y - this.markerHalfHeight, localPosition.y + this.markerHalfHeight)
        )
      } else if (localPosition.x == BOUNDARY_HALF_WIDTH) {
        this.markerPositions[markerIndex] = {
          position: MarkerPosition.RIGHT,
          index: this.rightElements.length
        }
        this.rightElements.push(
          new vec2(localPosition.y - this.markerHalfHeight, localPosition.y + this.markerHalfHeight)
        )
      } else if (localPosition.y == -BOUNDARY_HALF_HEIGHT) {
        this.markerPositions[markerIndex] = {
          position: MarkerPosition.BOTTOM,
          index: this.bottomElements.length
        }
        this.bottomElements.push(
          new vec2(localPosition.x - this.markerHalfWidth, localPosition.x + this.markerHalfWidth)
        )
      } else if (localPosition.y == BOUNDARY_HALF_HEIGHT) {
        this.markerPositions[markerIndex] = {
          position: MarkerPosition.TOP,
          index: this.topElements.length
        }
        this.topElements.push(new vec2(localPosition.x - this.markerHalfWidth, localPosition.x + this.markerHalfWidth))
      } else {
        this.markerPositions[markerIndex] = {
          position: MarkerPosition.INVIEW,
          index: this.inViewElements.length
        }
        // Assume the in-view markers are all at the same height
        this.inViewElements.push(
          new vec4(
            localPosition.x - this.markerHalfWidth,
            localPosition.x + this.markerHalfWidth,
            localPosition.y - this.labelHalfHeight,
            localPosition.y + this.labelHalfHeight
          )
        )
      }
    }
  }

  private resolveMarkerPositionAndRotation(
    distance: number,
    marker: QuestMarker,
    userLocation: GeoPosition,
    yOrientationOffset: number
  ): {orientation: number; xPosition: number; yPosition: number} {
    const bearing = normalizeAngle(
      calculateBearing(userLocation, marker.mapPin.location) - this.mapComponent.getUserHeading()
    )
    const inView = bearing < this.halfFOV && bearing > -this.halfFOV
    const backStartAngle = Math.PI - this.halfFOV
    const isOnTheBack = bearing > backStartAngle || bearing < -backStartAngle

    let screenPosition: vec2
    if (inView || isOnTheBack) {
      const cameraForward = this.cameraTransform.back
      const userForward = cameraForward.projectOnPlane(vec3.up()).normalize()
      const markerLocationWorldPos: vec3 = this.cameraTransform
        .getWorldPosition()
        .add(
          quat
            .fromEulerAngles(0, -bearing, 0)
            .multiplyVec3(userForward)
            .uniformScale(distance * 100)
        )
        .add(new vec3(0, (marker.mapPin.location.altitude - userLocation.altitude) * 100, 0))
      const cameraRoll = normalizeAngle(customGetEuler(this.cameraTransform.getLocalRotation()).z)
      const unrolledWorldPos = quat.fromEulerAngles(0, 0, cameraRoll).multiplyVec3(markerLocationWorldPos)
      screenPosition = this.camera.worldSpaceToScreenSpace(unrolledWorldPos)

      screenPosition = new vec2(
        MathUtils.clamp(
          (screenPosition.x - 0.5) * BOUNDARY_HALF_WIDTH_PROJECTION * 2 * (isOnTheBack ? -1 : 1),
          -BOUNDARY_HALF_WIDTH,
          BOUNDARY_HALF_WIDTH
        ),
        MathUtils.clamp(
          (0.5 - screenPosition.y) * BOUNDARY_HALF_HEIGHT * 2,
          -BOUNDARY_HALF_HEIGHT,
          BOUNDARY_HALF_HEIGHT
        )
      )
    } else {
      screenPosition = this.mapAngleToScreenPoint(bearing)
    }

    let yPosition: number
    let orientation = -(bearing + this.markerImageOffsetInDegree * MathUtils.DegToRad)
    marker.setIsInView(inView, this.inViewMaterial, this.outOfViewMaterial)
    if (inView) {
      if (yOrientationOffset > -BOUNDARY_HALF_HEIGHT && yOrientationOffset < BOUNDARY_HALF_HEIGHT) {
        marker.setIsInView(true, this.inViewMaterial, this.outOfViewMaterial)
        orientation = 0
      } else {
        // Outside of vertical view
        marker.setIsInView(false, this.inViewMaterial, this.outOfViewMaterial)
        if (yOrientationOffset < -BOUNDARY_HALF_HEIGHT) {
          orientation = Math.PI * 2 - orientation
        }
      }
      yPosition = MathUtils.clamp(yOrientationOffset, -BOUNDARY_HALF_HEIGHT, BOUNDARY_HALF_HEIGHT)
    } else {
      marker.setIsInView(false, this.inViewMaterial, this.outOfViewMaterial)
      const unrestrainedYPosition = screenPosition.y + yOrientationOffset
      const yPositionUnderTopBoundary = Math.min(unrestrainedYPosition, BOUNDARY_HALF_HEIGHT)
      const min = yPositionUnderTopBoundary < -BOUNDARY_HALF_HEIGHT ? -BOUNDARY_HALF_HEIGHT : yPositionUnderTopBoundary

      yPosition = MathUtils.clamp(unrestrainedYPosition, min, yOrientationOffset)

      // Smooth transition the y-position to the bottom when the marker is on the back
      const absBearing = Math.abs(bearing)
      if (absBearing > backStartAngle - Y_POSITION_LERP_BUFFER) {
        const t = MathUtils.clamp((absBearing - backStartAngle + Y_POSITION_LERP_BUFFER) / Y_POSITION_LERP_BUFFER, 0, 1)
        yPosition = MathUtils.lerp(yPosition, -BOUNDARY_HALF_HEIGHT, t)
      }
    }
    return {orientation, xPosition: screenPosition.x, yPosition}
  }

  private handleMapAddPin(pin: MapPin): void {
    const userLocation = this.mapComponent.getUserLocation()
    print("User Location: " + userLocation)
    if (pin.location.longitude === userLocation.longitude && pin.location.latitude === userLocation.latitude) {
      return
    }

    if (!this.questMarkers.has(pin.sceneObject.uniqueIdentifier)) {
      const questmarkObject = this.questMarkerPrefab.instantiate(this.sceneObject)
      questmarkObject.name = "QuestMark " + this.questMarkers.size
      const questMark = new QuestMarker(pin, questmarkObject.getTransform(), this.scale)
      this.defaultLabelY = questMark.markerLabel.getTransform().getLocalPosition().y
      this.questMarkers.set(pin.sceneObject.uniqueIdentifier, questMark)
    }
  }

  private handleAllMapPinsRemoved(): void {
    this.questMarkers.forEach((questMark) => {
      questMark.transform.getSceneObject().destroy()
    })
    this.questMarkers.clear()
  }

  private mapAngleToScreenPoint(radians: number): vec2 {
    let x, y: number
    const degree = radians * MathUtils.RadToDeg
    const top = BOUNDARY_HALF_HEIGHT
    const left = -BOUNDARY_HALF_WIDTH
    const right = BOUNDARY_HALF_WIDTH
    const bottom = -BOUNDARY_HALF_HEIGHT

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
