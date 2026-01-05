import {DragInteractorEvent} from "SpectaclesInteractionKit.lspkg/Core/Interactor/InteractorEvent"
import {Singleton} from "SpectaclesInteractionKit.lspkg/Decorators/Singleton"

// A variable for 'up' (but not exactly up) We can't have it be exactly up because when
// we do a cross to get our angles and our raycast result points straiught up we cross two
// vectors that are the same and it won't give us a sane result
const NOT_QUITE_UP = new vec3(0.0000001, 0.9999999, 0.0000001).normalize()
const EPSILON = 0.01

@Singleton
export class SnapToWorld {
  public static getInstance: () => SnapToWorld

  private didInitialise = false
  private worldQueryModule: WorldQueryModule
  private hitTestSession: HitTestSession
  private hitTestSessionRunning = false
  private timeOfLastHit = -1000
  private lastHitResult = null

  private isManipulating: boolean = false

  private _isOn: boolean = false

  private cachedDragEventData: DragInteractorEvent

  private previewInWorld: SceneObject

  constructor() {}

  // - - - - - - - - - - - - - - - - - - - - - - - - - -
  init(worldQueryModule: WorldQueryModule, previewInWorld: SceneObject) {
    if (this.didInitialise) {
      print("SnapToWorld. Tried to initialize twice")
      return
    }

    this.worldQueryModule = worldQueryModule
    this.previewInWorld = previewInWorld

    // Init WorldQuery
    const sessionOptions = HitTestSessionOptions.create()
    sessionOptions.filter = true
    this.hitTestSession = this.worldQueryModule.createHitTestSessionWithOptions(sessionOptions)
    this.hitTestSession.stop()

    this.didInitialise = true
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - -
  startManipulating(dragEventData: DragInteractorEvent) {
    this.isManipulating = true
    this.cachedDragEventData = dragEventData

    if (!this._isOn) {
      return
    }

    this.startSnappingSession()
    this.updateWorldRaycast(dragEventData)
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - -
  updateManipulating(dragEventData: DragInteractorEvent) {
    this.cachedDragEventData = dragEventData

    this.previewInWorld.getTransform().setWorldScale(dragEventData.target.getTransform().getWorldScale()) // TEMP
    this.updateWorldRaycast(dragEventData)
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - -
  endManipulating(dragEventData: DragInteractorEvent) {
    this.isManipulating = false

    if (!this._isOn) {
      return
    }

    this.endSnappingSession()
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - -
  tick() {
    if (this._isOn) {
      this.updateRaycastResultHandling()
    }
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - -
  updateRaycastResultHandling() {
    if (this.haveValidHitResult()) {
      const hitPosition: vec3 = this.lastHitResult.position
      const hitNormal: vec3 = this.lastHitResult.normal

      const previewTransform = this.previewInWorld.getTransform()
      const rot = quat.lookAt(hitNormal, NOT_QUITE_UP)

      previewTransform.setWorldPosition(hitPosition)
      previewTransform.setWorldRotation(rot)
      this.previewInWorld.enabled = true

      // TEMP
      //global.debugRenderSystem.drawSolidSphere( hitPosition, 1, new vec4(0, 1, 0, 1) )
      //global.debugRenderSystem.drawLine( hitPosition, hitPosition.add(hitNormal.uniformScale(20)), new vec4(0, 1, 0, 1) )
    } else {
      this.previewInWorld.enabled = false
    }
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - -
  haveValidHitResult() {
    const MAX_TIME = 4 / 60
    const currTime = getTime()

    return currTime - this.timeOfLastHit < MAX_TIME && this.hitTestSessionRunning && this.lastHitResult
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - -
  updateWorldRaycast(dragEventData: DragInteractorEvent) {
    const DIST_IN_FRONT_OF_HAND = 20 // Move in front of the hand a bit as it sometimes results in a raycast hit
    const DIST_BEHIND_TO_CHECK = 30
    const targetPos = dragEventData.target.getTransform().getWorldPosition()
    const rayToWorldStart = dragEventData.interactor.startPoint.add(
      dragEventData.interactor.direction.uniformScale(DIST_IN_FRONT_OF_HAND)
    )
    const raycastDistance = rayToWorldStart.distance(targetPos) + DIST_BEHIND_TO_CHECK
    const rayToWorldEnd = rayToWorldStart.add(dragEventData.interactor.direction.uniformScale(raycastDistance))

    if (this.hitTestSessionRunning) {
      const hitTest = this.hitTestSession.hitTest(rayToWorldStart, rayToWorldEnd, (hitResult) => {
        if (hitResult === null) {
          //this.hitTestSession.reset() // TEST: reset the filter if we miss
          return // Bail!
        } else {
          this.timeOfLastHit = getTime()
          this.lastHitResult = hitResult
        }
      })
    }

    // TEMP
    //global.debugRenderSystem.drawSphere( rayToWorldStart, 1, new vec4(0, 0, 1, 1) )
    //global.debugRenderSystem.drawSphere( rayToWorldEnd, 1, new vec4(0, 1, 0, 1) )
    //global.debugRenderSystem.drawLine( rayToWorldStart, rayToWorldEnd, new vec4(0, 1, 0, 1) )
    //global.debugRenderSystem.drawSphere( dragEventData.interactor.startPoint, 1, new vec4(1, 0, 0, 1) )
    //global.debugRenderSystem.drawSphere( dragEventData.interactor.endPoint, 15, new vec4(0, 1, 0, 1) )
    //global.debugRenderSystem.drawSphere( targetPos, 5, new vec4(1, 0, 1, 1) )
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - -
  getCurrentTransform() {
    // TEMP
    if (this.haveValidHitResult()) {
      return this.previewInWorld.getTransform()
    }

    return null
  }

  set isOn(onState: boolean) {
    if (this._isOn === onState) {
      return
    }

    print("isOn " + onState)

    if (this.isManipulating) {
      if (onState === true) {
        this.startSnappingSession()
        this.updateWorldRaycast(this.cachedDragEventData)
      } else if (onState === false) {
        this.endSnappingSession()
      }
    }

    this._isOn = onState
  }

  private startSnappingSession(): void {
    print("startSnappingSession")

    this.hitTestSession.start()
    this.hitTestSessionRunning = true
  }

  private endSnappingSession(): void {
    print("endSnappingSession")

    this.hitTestSession.stop()
    this.hitTestSession.reset()
    this.hitTestSessionRunning = false
    this.previewInWorld.enabled = false
  }
}
