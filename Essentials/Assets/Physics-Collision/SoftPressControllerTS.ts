import {mix} from "SpectaclesInteractionKit.lspkg/Utils/animate"
import {clamp} from "SpectaclesInteractionKit.lspkg/Utils/mathUtils"
import NativeLogger from "SpectaclesInteractionKit.lspkg/Utils/NativeLogger"

const log = new NativeLogger("SoftPressController")

@component
export class SoftPressController extends BaseScriptComponent {
  @input
  @hint("The collider that will detect the soft press interaction")
  colliderObject: SceneObject

  @input
  @hint("The interactor object (e.g., finger tip)")
  interactorObject: SceneObject

  @input
  @allowUndefined
  @hint("Optional: A SceneObject to visually mark the closest point on the line (for debugging)")
  closestPointMarker: SceneObject

  @input
  @hint("Top vertex 0 of the collider cube")
  topVertex0: SceneObject

  @input
  @hint("Top vertex 1 of the collider cube")
  topVertex1: SceneObject

  @input
  @hint("Top vertex 2 of the collider cube")
  topVertex2: SceneObject

  @input
  @hint("Top vertex 3 of the collider cube")
  topVertex3: SceneObject

  @input
  @hint("Bottom vertex 0 of the collider cube")
  bottomVertex0: SceneObject

  @input
  @hint("Bottom vertex 1 of the collider cube")
  bottomVertex1: SceneObject

  @input
  @hint("Bottom vertex 2 of the collider cube")
  bottomVertex2: SceneObject

  @input
  @hint("Bottom vertex 3 of the collider cube")
  bottomVertex3: SceneObject

  @input
  @hint("The threshold for triggering the press event (0 to 1)")
  pressThreshold: number = 0.7

  @input
  @hint("Time (in seconds) for the press value to smoothly reset to 0 after exit")
  resetDuration: number = 1.0

  @input
  @hint("Does the presentation switcher bring you to the previous slide?")
  next: boolean = false

  private collider: ColliderComponent
  private isInteracting: boolean = false
  private pressValue: number = 0
  private hasTriggeredEvent: boolean = false
  private isResetting: boolean = false
  private resetProgress: number = 0
  private localTop: vec3 // Top position in local space
  private localBottom: vec3 // Bottom position in local space
  private lastClosestPointLocal: vec3 // Store the last closest point in local space
  private activeOverlapId: number | null = null // Track the active overlap ID

  onAwake() {
    // Get the collider component
    this.collider = this.colliderObject.getComponent("Physics.ColliderComponent")

    // Bind the onStart event
    this.createEvent("OnStartEvent").bind(() => {
      this.onStart()
      log.d("OnStart event triggered")
    })

    // Bind the update event
    this.createEvent("UpdateEvent").bind(() => {
      this.update()
      log.d("Update event triggered")
    })

    // Calculate the top and bottom positions in local space by averaging the vertices
    const topPositions = [
      this.topVertex0.getTransform().getWorldPosition(),
      this.topVertex1.getTransform().getWorldPosition(),
      this.topVertex2.getTransform().getWorldPosition(),
      this.topVertex3.getTransform().getWorldPosition()
    ]
    const bottomPositions = [
      this.bottomVertex0.getTransform().getWorldPosition(),
      this.bottomVertex1.getTransform().getWorldPosition(),
      this.bottomVertex2.getTransform().getWorldPosition(),
      this.bottomVertex3.getTransform().getWorldPosition()
    ]

    // Average the top and bottom positions in world space
    const worldTop = topPositions.reduce((sum, pos) => sum.add(pos), vec3.zero()).scale(new vec3(0.25, 0.25, 0.25))
    const worldBottom = bottomPositions
      .reduce((sum, pos) => sum.add(pos), vec3.zero())
      .scale(new vec3(0.25, 0.25, 0.25))

    // Convert to local space of the collider
    const colliderTransform = this.colliderObject.getTransform()
    const inverseWorldTransform = colliderTransform.getInvertedWorldTransform()
    this.localTop = inverseWorldTransform.multiplyPoint(worldTop)
    this.localBottom = inverseWorldTransform.multiplyPoint(worldBottom)

    // Initialize press value and last closest point (in local space)
    this.pressValue = 0
    this.lastClosestPointLocal = this.localTop
  }

  onStart() {
    // Setup overlap events for the collider
    this.collider.onOverlapEnter.add((e) => {
      const overlap = e.overlap
      if (overlap.collider.getSceneObject() === this.interactorObject) {
        // Check if the interactor entered from the top
        if (this.isEnteringFromTop()) {
          log.d(`OverlapEnter(${overlap.id}): Interactor entered from the top. Starting soft press interaction.`)
          this.isInteracting = true
          this.isResetting = false // Stop any ongoing reset
          this.resetProgress = 0
          this.activeOverlapId = overlap.id // Store the overlap ID
        } else {
          log.d(`OverlapEnter(${overlap.id}): Interactor did not enter from the top. Ignoring.`)
        }
      }
    })

    this.collider.onOverlapStay.add((e) => {
      const overlap = e.overlap
      if (
        overlap.collider.getSceneObject() === this.interactorObject &&
        this.isInteracting &&
        overlap.id === this.activeOverlapId
      ) {
        log.d(`OverlapStay(${overlap.id}): Processing soft press interaction.`)
        this.calculatePressValue()
      }
    })

    this.collider.onOverlapExit.add((e) => {
      const overlap = e.overlap
      if (overlap.collider.getSceneObject() === this.interactorObject && overlap.id === this.activeOverlapId) {
        log.d(`OverlapExit(${overlap.id}): Interactor exited the collider. Starting smooth reset of press value.`)
        this.isInteracting = false
        this.isResetting = true
        this.resetProgress = 0
        this.activeOverlapId = null // Clear the overlap ID
      }
    })
  }

  // Check if the interactor is entering from the top (local up direction of the collider)
  private isEnteringFromTop(): boolean {
    const interactorPos = this.interactorObject.getTransform().getWorldPosition()
    const colliderPos = this.colliderObject.getTransform().getWorldPosition()
    const colliderUp = this.colliderObject.getTransform().up // Local up direction in world space

    // Vector from collider center to interactor
    const directionToInteractor = interactorPos.sub(colliderPos).normalize()

    // Dot product between collider's up direction and the direction to the interactor
    const dot = directionToInteractor.dot(colliderUp)

    // If dot product is positive and close to 1, the interactor is above the collider
    return dot > 0.5 // Adjust threshold as needed
  }

  // Calculate the press value (0 to 1) based on the closest point's position
  private calculatePressValue() {
    const interactorPos = this.interactorObject.getTransform().getWorldPosition()

    // Convert interactor position to local space of the collider
    const colliderTransform = this.colliderObject.getTransform()
    const inverseWorldTransform = colliderTransform.getInvertedWorldTransform()
    const interactorPosLocal = inverseWorldTransform.multiplyPoint(interactorPos)

    // Find the closest point on the collider to the interactor (in world space)
    // Since closestPoint is not available, we'll use the line from top to bottom instead
    const worldTop = colliderTransform.getWorldTransform().multiplyPoint(this.localTop)
    const worldBottom = colliderTransform.getWorldTransform().multiplyPoint(this.localBottom)

    // Calculate the direction from top to bottom
    const topToBottom = worldBottom.sub(worldTop)
    const topToInteractor = interactorPos.sub(worldTop)

    // Project the interactor position onto the line
    const projectionRatio = clamp(topToInteractor.dot(topToBottom) / topToBottom.dot(topToBottom), 0, 1)

    // Calculate the closest point on the line
    const closestPointWorld = worldTop.add(
      topToBottom.scale(new vec3(projectionRatio, projectionRatio, projectionRatio))
    )

    // Convert the closest point to local space
    const closestPointLocal = inverseWorldTransform.multiplyPoint(closestPointWorld)
    this.lastClosestPointLocal = closestPointLocal // Store for reset

    // Project the closest point onto the line from top to bottom (in local space)
    const localTopToBottom = this.localBottom.sub(this.localTop)
    const topToClosest = closestPointLocal.sub(this.localTop)
    const projectionLength = topToClosest.dot(localTopToBottom.normalize())
    const totalLength = localTopToBottom.length

    // Calculate the press value (0 at top, 1 at bottom)
    const newPressValue = clamp(projectionLength / totalLength, 0, 1)

    // Update press value and check for event trigger
    this.pressValue = newPressValue
    log.d(`Press value: ${this.pressValue}`)

    // Optionally move the marker to the closest point (in world space, for visualization)
    if (this.closestPointMarker) {
      this.closestPointMarker.getTransform().setWorldPosition(closestPointWorld)
    }

    // Trigger event if press value exceeds threshold and hasn't been triggered yet
    if (this.pressValue >= this.pressThreshold && !this.hasTriggeredEvent) {
      this.onPressThresholdReached()
      this.hasTriggeredEvent = true
    }

    // Reset the event trigger if the press value returns to 0 (top position)
    if (this.pressValue <= 0 && this.hasTriggeredEvent) {
      log.d("Press value reset to 0. Event can trigger again on next press.")
      this.hasTriggeredEvent = false
    }
  }

  // Smoothly reset the press value to 0
  private smoothReset() {
    if (!this.isResetting) return

    // Increment reset progress based on time
    this.resetProgress += getDeltaTime() / this.resetDuration
    this.resetProgress = clamp(this.resetProgress, 0, 1)

    // Interpolate the closest point from its last position to the top (in local space)
    const interpolatedPointLocal = mix(this.lastClosestPointLocal, this.localTop, this.resetProgress)

    // Update press value based on the interpolated point
    const topToBottom = this.localBottom.sub(this.localTop)
    const topToCurrent = interpolatedPointLocal.sub(this.localTop)
    const projectionLength = topToCurrent.dot(topToBottom.normalize())
    const totalLength = topToBottom.length
    this.pressValue = clamp(projectionLength / totalLength, 0, 1)

    // Optionally move the marker to the interpolated point (convert back to world space for visualization)
    if (this.closestPointMarker) {
      const colliderTransform = this.colliderObject.getTransform()
      const interpolatedPointWorld = colliderTransform.getWorldTransform().multiplyPoint(interpolatedPointLocal)
      this.closestPointMarker.getTransform().setWorldPosition(interpolatedPointWorld)
    }

    // Reset the event trigger if the press value returns to 0
    if (this.pressValue <= 0 && this.hasTriggeredEvent) {
      log.d("Press value reset to 0 during smooth reset. Event can trigger again on next press.")
      this.hasTriggeredEvent = false
    }

    // Stop resetting when fully reset
    if (this.resetProgress >= 1) {
      this.isResetting = false
      this.resetProgress = 0
      this.pressValue = 0
      this.lastClosestPointLocal = this.localTop
      log.d("Smooth reset complete.")
    }
  }

  // Event triggered when the press threshold is reached
  private onPressThresholdReached() {
    log.d(`Press threshold of ${this.pressThreshold} reached! Triggering event.`)
    if (this.next) {
      this.navigateToNext()
    } else {
      this.navigateToPrevious()
    }
  }

  // Navigate to the next slide and synchronize across all platforms
  private navigateToNext() {
    log.d("PRESSED FOR NEXT ACTION - Going to next slide")
  }

  // Navigate to the previous slide and synchronize across all platforms
  private navigateToPrevious() {
    log.d("PRESSED FOR PREVIOUS ACTION - Going to previous slide")
  }

  private update() {
    if (this.isInteracting) {
      this.calculatePressValue()
    }
    if (this.isResetting) {
      this.smoothReset()
    }
  }
}
