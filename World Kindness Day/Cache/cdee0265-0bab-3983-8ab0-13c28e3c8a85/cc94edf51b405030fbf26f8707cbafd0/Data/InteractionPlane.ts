import {InteractionManager} from "../../../Core/InteractionManager/InteractionManager"
import {easingFunctions} from "../../../Utils/animate"
import {LensConfig} from "../../../Utils/LensConfig"
import NativeLogger from "../../../Utils/NativeLogger"
import {DispatchedUpdateEvent} from "../../../Utils/UpdateDispatcher"
import {TargetingVisual} from "../Interactable/Interactable"

/**
 * point - the projection's position on the plane in world space.
 * distance - the distance from the point to plane in world space (negative if behind the plane)
 * isWithinInteractionZone - if the point is nearby in front of the plane
 * isWithinBehindZone - if the point is nearby behind the plane
 * lerpValue - the value to use when lerping raycast to nearfield instead of default targeting
 */
export type ZoneProjection = {
  point: vec3
  distance: number
  isWithinInteractionZone: boolean
  isWithinBehindZone: boolean
  isWithinDirectZone: boolean
  lerpValue: number
}

const DEFAULT_LERP_OFFSET_CM = 5

const DEFAULT_INTERACTION_ZONE_DISTANCE_CM = 15

const DEFAULT_DIRECT_ZONE_DISTANCE_CM = 7.5

const DEFAULT_BEHIND_ZONE_DISTANCE_CM = 15

const TAG = "InteractionPlane"

/**
 * An InteractionPlane defines a zone which triggers near field targeting logic for HandInteractors.
 * An InteractionPlane should be added to any 2D UIs with high button density, such as ContainerFrame menus.
 * Only one InteractionPlane should be added per UI (ContainerFrame adds an InteractionPlane by default).
 */
@component
export class InteractionPlane extends BaseScriptComponent {
  /**
   * Sets the preferred targeting visual. (Requires the V2 Cursor to be enabled on InteractorCursors).
   * - 0: Cursor (default)
   * - 1: Ray
   * - 2: None
   */
  @input
  @hint(
    "Sets the preferred targeting visual. (Requires the V2 Cursor to be enabled on InteractorCursors).\n\n\
- 0: None\n\
- 1: Cursor (default)\n\
- 2: Ray"
  )
  @widget(new ComboBoxWidget([new ComboBoxItem("None", 0), new ComboBoxItem("Cursor", 1), new ComboBoxItem("Ray", 2)]))
  targetingVisual: number = TargetingVisual.Cursor

  /**
   * The size of the interaction plane along the local X and Y axes. Defines the rectangular area of the plane where
   * hand interactions are detected. Larger values create a bigger interactive surface area.
   */
  @input
  @hint(
    "The size of the interaction plane along the local X and Y axes. Defines the rectangular area of the plane where \
hand interactions are detected. Larger values create a bigger interactive surface area."
  )
  private _planeSize: vec2 = new vec2(10, 10)

  /**
   * The depth of the plane's interaction zone along the local Z axis. Defines how far from the plane hand
   * interactions are detected. Hand interactions beyond this distance will not be detected. Larger values allow
   * interaction from greater distances.
   */
  @input
  @hint(
    "The depth of the plane's interaction zone along the local Z axis. Defines how far from the plane hand \
interactions are detected. Hand interactions beyond this distance will not be detected. Larger values allow \
interaction from greater distances."
  )
  private _proximityDistance: number = DEFAULT_INTERACTION_ZONE_DISTANCE_CM

  /**
   * The maximum distance for Direct interaction with the plane.
   */
  @input
  @hint("The maximum distance for Direct interaction with the plane.")
  private _directZoneDistance: number = DEFAULT_DIRECT_ZONE_DISTANCE_CM

  /**
   * Enables visual debugging of the Interaction Plane.
   */
  @input
  @hint("Enables visual debugging of the Interaction Plane.")
  private _drawDebug: boolean = false

  /**
   * The maximum distance for detecting interactions behind the plane. Creates a failsafe/tolerance zone where
   * interactions can still be detected even if the user's hand accidentally penetrates through the plane.
   */
  @input
  @hint(
    "The maximum distance for detecting interactions behind the plane. Creates a failsafe/tolerance zone where \
interactions can still be detected even if the user's hand accidentally penetrates through the plane."
  )
  private _behindDistance: number = DEFAULT_BEHIND_ZONE_DISTANCE_CM

  /**
   *
   */
  @input
  @hint(
    "The offset from the interaction zone that will be used to transition the user into near field mode. E.g. \
if the proximityDistance = 20 and lerpOffset = 25, a hand between 20-45cm away from the plane will be lerped into \
near field mode."
  )
  private _lerpOffset: number = DEFAULT_LERP_OFFSET_CM

  /**
   * Local-space offset of the plane. Allows positioning the effective interaction plane relative to the host
   * SceneObject.
   */
  @input
  @hint(
    "Local-space offset of the plane. Allows positioning the effective interaction plane relative to the host \
SceneObject."
  )
  private _offset: vec3 = vec3.zero()

  /**
   * Whether the direct zone in front of the interaction plane is enabled.
   * When the Interactor is within this direct zone, raycasts will be disabled.
   */
  enableDirectZone = true

  private _collider: ColliderComponent | null = null

  private _colliderRoot: SceneObject | null = null
  private _colliderRootTransform: Transform | null = null

  private log = new NativeLogger(TAG)
  private _updateEvent: DispatchedUpdateEvent | undefined

  onAwake() {
    this.createEvent("OnDestroyEvent").bind(() => this.release())
    this.createEvent("OnEnableEvent").bind(() => {
      InteractionManager.getInstance().registerInteractionPlane(this)
      if (this._updateEvent) {
        this._updateEvent.enabled = true
      }
    })
    this.createEvent("OnDisableEvent").bind(() => {
      InteractionManager.getInstance().deregisterInteractionPlane(this)
      if (this._updateEvent) {
        this._updateEvent.enabled = false
      }
    })

    this.createEvent("OnStartEvent").bind(() => {
      const colliderRoot = global.scene.createSceneObject("InteractionPlaneColliderRoot")
      colliderRoot.setParent(this.sceneObject)
      this._colliderRoot = colliderRoot
      this._colliderRootTransform = colliderRoot.getTransform()

      this._collider = colliderRoot.createComponent("ColliderComponent")
      this.buildMeshShape()
      this._collider.debugDrawEnabled = this.drawDebug

      InteractionManager.getInstance().registerInteractionPlane(this)
    })

    if (this.drawDebug) {
      this._updateEvent = LensConfig.getInstance().updateDispatcher.createUpdateEvent("InteractionPlaneUpdate", () =>
        this.drawDebugPlane()
      )
    }
  }

  release() {
    if (this._updateEvent) {
      LensConfig.getInstance().updateDispatcher.removeEvent(this._updateEvent)
      this._updateEvent = undefined
    }
    InteractionManager.getInstance().deregisterInteractionPlane(this)
  }

  // Manually create the mesh shape for the interaction zone to trigger NearField targeting.
  private buildMeshShape() {
    if (this.collider === null) {
      return
    }

    if (this.proximityDistance <= 0 || this.behindDistance <= 0 || this.planeSize.x <= 0 || this.planeSize.y <= 0) {
      this.log.f(`InteractionPlane must have proximityDistance, behindDistance, or planeSize set to positive values.`)
    }

    const shape = Shape.createBoxShape()
    shape.size = new vec3(
      this.planeSize.x + this.lerpOffset,
      this.planeSize.y + this.lerpOffset,
      (this.proximityDistance + this.lerpOffset) * 2
    )

    this.collider.shape = shape

    if (this._colliderRootTransform !== null) {
      this._colliderRootTransform.setLocalPosition(this._offset)
    }
  }

  /**
   * Sets the size (in world units) of the plane's interaction zone along the local X and Y axes of the SceneObject.
   */
  set planeSize(size: vec2) {
    this._planeSize = size
    this.buildMeshShape()
  }

  /**
   * @returns the size (in world units) of the plane's interaction zone along the local X and Y axes of the SceneObject.
   */
  get planeSize(): vec2 {
    return this._planeSize
  }

  /**
   * Sets the depth (in world units) of the plane's interaction zone along the local Z axis of the SceneObject.
   */
  set proximityDistance(distance: number) {
    this._proximityDistance = distance

    this.buildMeshShape()
  }

  /**
   * Returns the depth (in world units) of the plane's interaction zone along the local Z axis of the SceneObject.
   */
  get proximityDistance(): number {
    return this._proximityDistance
  }

  /**
   * Sets the depth (in world units) of the plane's direct interaction zone along the local Z axis of the SceneObject.
   */
  set directZoneDistance(distance: number) {
    this._directZoneDistance = distance
  }

  /**
   * Returns the depth (in world units) of the plane's direct interaction zone along the local Z axis of the SceneObject.
   */
  get directZoneDistance(): number {
    return this._directZoneDistance
  }

  /**
   * Sets the depth (in world units) of the plane's behind zone along the local Z axis of the SceneObject.
   */
  set behindDistance(distance: number) {
    this._behindDistance = distance

    this.buildMeshShape()
  }

  /**
   * Returns the depth (in world units) of the plane's behind zone along the local Z axis of the SceneObject.
   */
  get behindDistance(): number {
    return this._behindDistance
  }

  /**
   * Sets the depth (in world units) of the plane's lerp zone.
   */
  set lerpOffset(distance: number) {
    this._lerpOffset = distance

    this.buildMeshShape()
  }

  /**
   * Returns the depth (in world units) of the plane's lerp zone.
   */
  get lerpOffset(): number {
    return this._lerpOffset
  }

  /**
   * Sets if the interaction zone should be drawn via debug gizmos.
   */
  set drawDebug(enabled: boolean) {
    this._drawDebug = enabled

    if (this.collider !== null) {
      this.collider.debugDrawEnabled = enabled
    }
  }

  /**
   * @returns if the interaction zone should be drawn via debug gizmos.
   */
  get drawDebug(): boolean {
    return this._drawDebug
  }

  /**
   * @returns a vec3 representing the normal vector of the plane.
   */
  get normal(): vec3 {
    return this.getTransform().forward
  }

  /**
   * Returns the collider of the InteractionPlane after initialization during OnStartEvent.
   * Returns null otherwise.
   */
  get collider(): ColliderComponent | null {
    return this._collider
  }

  /**
   * Sets the local-space offset of the interaction plane (affects both collider placement and projection origin).
   */
  set offset(offset: vec3) {
    this._offset = offset
    this.buildMeshShape()
  }

  /**
   * Returns the local-space offset of the interaction plane.
   */
  get offset(): vec3 {
    return this._offset
  }

  /**
   * Project a 3D point in world space onto the InteractionPlane.
   * @param point - a 3D point in world space
   * @returns - a ZoneProjection representing the point's projection onto the plane, the distance of the point from the plane (negative if behind the plane),
   *            a boolean checking if the point resides within the interaction zone of the plane (defined by size and proximityDistance),
   *            and a boolean checking if the point resides within the behind zone of the plane (right behind the plane),
   *            or null if the point does not project onto the plane.
   */
  projectPoint(point: vec3): ZoneProjection | null {
    if (!this.enabled || !this.sceneObject.isEnabledInHierarchy) {
      return null
    }

    // This logic uses the equation of t = ((p0-l0)·n)/(l·n) with l0 + l*t = the point of intersection.
    // l0 represents point, l represents direction, p0 represents plane origin, and n represents the plane normal.
    const transform = this.sceneObject.getTransform()
    const n = transform.forward
    const r = transform.right
    const u = transform.up
    const s = transform.getWorldScale()

    const baseOrigin = transform.getWorldPosition()
    const worldOffset = r
      .uniformScale(this._offset.x * s.x)
      .add(u.uniformScale(this._offset.y * s.y))
      .add(n.uniformScale(this._offset.z * s.z))
    const po = baseOrigin.add(worldOffset)

    const v = po.sub(point)
    const l = n.uniformScale(-1)

    const t = v.dot(n) / l.dot(n)

    // Project the point onto the plane.
    const projectedPoint = point.add(l.uniformScale(t))

    // Get the local X and Y coordinates within the plane space to check if the point resides within the interaction zone.
    const d = projectedPoint.sub(po)
    const x = d.dot(r)
    const y = d.dot(u)

    // Get the distance of the original point from the plane.
    const distance = point.sub(projectedPoint).length * Math.sign(t)

    // Check if the point is in front of the plane, within the proximity distance threshold, and within the planeSize boundaries.
    const isWithinInteractionZone =
      distance >= 0 &&
      distance <= this.proximityDistance + this.lerpOffset &&
      Math.abs(x) <= this.planeSize.x / 2 + this.lerpOffset &&
      Math.abs(y) <= this.planeSize.y / 2 + this.lerpOffset

    // Check if the point is within the direct interaction distance threshold.
    const isWithinDirectZone =
      this.enableDirectZone &&
      distance >= 0 &&
      distance <= this.directZoneDistance &&
      Math.abs(x) <= this.planeSize.x / 2 + this.lerpOffset &&
      Math.abs(y) <= this.planeSize.y / 2 + this.lerpOffset

    // Check if the point is in behind the plane, within the behind zone distance threshold, and within the planeSize boundaries.
    const isWithinBehindZone =
      distance < 0 &&
      distance >= -this.behindDistance &&
      Math.abs(x) <= this.planeSize.x / 2 + this.lerpOffset &&
      Math.abs(y) <= this.planeSize.y / 2 + this.lerpOffset

    const distanceToHorizontalEdge = Math.abs(x) - this.planeSize.x / 2
    const horizontalLerpValue =
      distanceToHorizontalEdge > 0 ? 1 - Math.min(distanceToHorizontalEdge, this.lerpOffset) / this.lerpOffset : 1

    const distanceToVerticalEdge = Math.abs(y) - this.planeSize.y / 2
    const verticalLerpValue =
      distanceToVerticalEdge > 0 ? 1 - Math.min(distanceToVerticalEdge, this.lerpOffset) / this.lerpOffset : 1

    const distanceToProximityEdge = distance - this.proximityDistance
    const proximityLerpValue =
      distanceToProximityEdge > 0 ? 1 - Math.min(distanceToProximityEdge, this.lerpOffset) / this.lerpOffset : 1

    const lerpValue = easingFunctions["ease-in-out-sine"](
      Math.min(horizontalLerpValue, verticalLerpValue, proximityLerpValue)
    )

    // If the point is within the interaction zone, return the plane projection data. Otherwise, return null.
    const planeProjection = {
      point: projectedPoint,
      distance: distance,
      isWithinInteractionZone: isWithinInteractionZone,
      isWithinBehindZone: isWithinBehindZone,
      isWithinDirectZone: isWithinDirectZone,
      lerpValue: lerpValue
    }
    return planeProjection
  }

  checkRayIntersection(rayStart: vec3, rayEnd: vec3): boolean {
    const po = this.sceneObject.getTransform().getWorldPosition()
    const n = this.sceneObject.getTransform().forward

    const direction = rayEnd.sub(rayStart)

    const dot = direction.dot(n)

    if (Math.abs(dot) > 1e-6) {
      const w = rayStart.sub(po)
      const t = -n.dot(w) / dot

      const intersectionPoint = rayStart.add(direction.uniformScale(t))

      const r = this.sceneObject.getTransform().right
      const u = this.sceneObject.getTransform().up

      // Get the local X and Y coordinates within the plane space to check if the point resides within the interaction zone.
      const d = intersectionPoint.sub(po)
      const x = d.dot(r)
      const y = d.dot(u)

      const withinX = Math.abs(x) <= this.planeSize.x / 2
      const withinY = Math.abs(y) <= this.planeSize.y / 2

      return withinX && withinY
    }

    return false
  }

  /**
   * Draws a debug visualization of the plane itself (not just the collider).
   * Also draws a box representing the proximityDistance.
   */
  private drawDebugPlane() {
    if (!this.sceneObject || !this.drawDebug) return

    const transform = this.sceneObject.getTransform()

    const po = transform.getWorldPosition()
    const s = transform.getWorldScale()
    const r = transform.right
    const u = transform.up
    const n = transform.forward

    const halfX = (this.planeSize.x / 2) * s.x
    const halfY = (this.planeSize.y / 2) * s.y

    // Draw the plane rectangle
    const corners = [
      po.add(r.uniformScale(-halfX)).add(u.uniformScale(-halfY)), // Bottom Left
      po.add(r.uniformScale(halfX)).add(u.uniformScale(-halfY)), // Bottom Right
      po.add(r.uniformScale(halfX)).add(u.uniformScale(halfY)), // Top Right
      po.add(r.uniformScale(-halfX)).add(u.uniformScale(halfY)) // Top Left
    ]
    for (let i = 0; i < 4; i++) {
      const start = corners[i]
      const end = corners[(i + 1) % 4]
      global.debugRenderSystem.drawLine(start, end, new vec4(0, 1, 0, 1))
    }

    // Draw the proximityDistance box
    const halfZ = (this.proximityDistance / 2) * s.z

    const boxCorners = []
    for (const dz of [-halfZ, halfZ]) {
      for (const dy of [-halfY, halfY]) {
        for (const dx of [-halfX, halfX]) {
          boxCorners.push(po.add(r.uniformScale(dx)).add(u.uniformScale(dy)).add(n.uniformScale(dz)))
        }
      }
    }

    const edges = [
      [0, 1],
      [1, 3],
      [3, 2],
      [2, 0], // bottom face
      [4, 5],
      [5, 7],
      [7, 6],
      [6, 4], // top face
      [0, 4],
      [1, 5],
      [2, 6],
      [3, 7] // vertical edges
    ]
    for (const [i, j] of edges) {
      global.debugRenderSystem.drawLine(boxCorners[i], boxCorners[j], new vec4(0, 0.5, 1, 1))
    }
  }
}
