// import required modules
const WorldQueryModule = require("LensStudio:WorldQueryModule")
const SIK = require("SpectaclesInteractionKit.lspkg/SIK").SIK
const InteractorInputType = require("SpectaclesInteractionKit.lspkg/Core/Interactor/Interactor").InteractorInputType
const EPSILON = 0.01

@component
export class NewScript extends BaseScriptComponent {
  private primaryInteractor
  private hitTestSession: HitTestSession
  private transform: Transform
  private lastHitResult: any // Store last hit result for trigger end callback
  @input
  indexToSpawn: number

  @input
  targetObject: SceneObject

  @input
  objectsToSpawn: SceneObject[]

  @input
  filterEnabled: boolean

  onAwake() {
    // create new hit session
    this.hitTestSession = this.createHitTestSession(this.filterEnabled)
    if (!this.sceneObject) {
      print("Please set Target Object input")
      return
    }
    this.transform = this.targetObject.getTransform()
    // disable target object when surface is not detected
    this.targetObject.enabled = false
    this.setObjectEnabled(this.indexToSpawn)

    // Set up trigger end callback
    this.setupTriggerEndCallback()

    // create update event
    this.createEvent("UpdateEvent").bind(this.onUpdate.bind(this))
  }

  setupTriggerEndCallback() {
    // Get all interactors and set up trigger end callbacks
    const allInteractors = SIK.InteractionManager.getInteractorsByType(InteractorInputType.All)

    for (const interactor of allInteractors) {
      interactor.onTriggerEnd.add(() => {
        // Only place object if we have a valid hit result and this is the primary interactor
        if (this.lastHitResult && this.primaryInteractor === interactor) {
          this.placeObject()
        }
      })
    }
  }

  placeObject() {
    if (!this.lastHitResult) return

    // Copy the plane/axis object
    const parent = this.objectsToSpawn[this.indexToSpawn].getParent()
    const newObject = parent.copyWholeHierarchy(this.objectsToSpawn[this.indexToSpawn])
    newObject.setParentPreserveWorldTransform(null)

    // Set position and rotation from last hit
    const hitPosition = this.lastHitResult.position
    const hitNormal = this.lastHitResult.normal

    let lookDirection
    if (1 - Math.abs(hitNormal.normalize().dot(vec3.up())) < EPSILON) {
      lookDirection = vec3.forward()
    } else {
      lookDirection = hitNormal.cross(vec3.up())
    }

    const toRotation = quat.lookAt(lookDirection, hitNormal)
    newObject.getTransform().setWorldPosition(hitPosition)
    newObject.getTransform().setWorldRotation(toRotation)
  }

  createHitTestSession(filterEnabled) {
    // create hit test session with options
    const options = HitTestSessionOptions.create()
    options.filter = filterEnabled

    const session = WorldQueryModule.createHitTestSessionWithOptions(options)
    return session
  }

  onHitTestResult(results) {
    if (results === null) {
      this.targetObject.enabled = false
      this.lastHitResult = null
    } else {
      this.targetObject.enabled = true
      // Store hit result for potential trigger end callback
      this.lastHitResult = results

      // get hit information
      const hitPosition = results.position
      const hitNormal = results.normal

      //identifying the direction the object should look at based on the normal of the hit location.

      let lookDirection
      if (1 - Math.abs(hitNormal.normalize().dot(vec3.up())) < EPSILON) {
        lookDirection = vec3.forward()
      } else {
        lookDirection = hitNormal.cross(vec3.up())
      }

      const toRotation = quat.lookAt(lookDirection, hitNormal)
      //set position and rotation
      this.targetObject.getTransform().setWorldPosition(hitPosition)
      this.targetObject.getTransform().setWorldRotation(toRotation)
    }
  }

  onUpdate() {
    this.primaryInteractor = SIK.InteractionManager.getTargetingInteractors().shift()

    if (this.primaryInteractor && this.primaryInteractor.isActive() && this.primaryInteractor.isTargeting()) {
      const rayStartOffset = new vec3(
        this.primaryInteractor.startPoint.x,
        this.primaryInteractor.startPoint.y,
        this.primaryInteractor.startPoint.z + 30
      )
      const rayStart = rayStartOffset
      const rayEnd = this.primaryInteractor.endPoint

      this.hitTestSession.hitTest(rayStart, rayEnd, this.onHitTestResult.bind(this))
    } else {
      this.targetObject.enabled = false
    }
  }

  setObjectIndex(i) {
    this.indexToSpawn = i
  }

  setObjectEnabled(i) {
    for (let i = 0; i < this.objectsToSpawn.length; i++) this.objectsToSpawn[i].enabled = i == this.indexToSpawn
  }
}
