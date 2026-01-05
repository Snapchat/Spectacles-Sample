@component
export class SurfaceDetection extends BaseScriptComponent {
  @input
  @allowUndefined
  camObj: SceneObject

  @input
  @allowUndefined
  visualObj: SceneObject

  @input
  @allowUndefined
  @hint("Set to true if the surface you want to detect is vertical")
  vertical: boolean = true

  private worldQueryModule = require("LensStudio:WorldQueryModule") as WorldQueryModule

  // Set min and max hit distance to surfaces
  private readonly MAX_HIT_DISTANCE = 1000
  private readonly MIN_HIT_DISTANCE = 50

  // Number of frames before surface detection completes
  private readonly CALIBRATION_FRAMES = 30

  // Distance in cm the surface visual can move before canceling
  private readonly MOVE_DISTANCE_THRESHOLD = 5

  // Minimum distance threshold for vertical surface updates (in cm)
  private readonly VERTICAL_MIN_MOVE_THRESHOLD = 1.0

  // Distance in cm from camera to visual when no surface is hit
  private readonly DEFAULT_SCREEN_DISTANCE = 200

  private readonly SPEED = 10
  // Higher smoothing factor for vertical surfaces
  private readonly VERTICAL_SMOOTHING = 0.85

  private camTrans
  private visualTrans

  private calibrationPosition = vec3.zero()
  private calibrationRotation = quat.quatIdentity()

  private desiredPosition = vec3.zero()
  private desiredRotation = quat.quatIdentity()
  // For smoothing vertical surface detection
  private smoothedPosition = vec3.zero()
  private isVerticalSurface = false
  private lastValidPosition = vec3.zero()

  private hitTestSession = null
  private updateEvent = null

  private history = []
  private calibrationFrames = 0

  private onGroundFoundCallback = null

  onAwake() {
    if (!this.camObj) {
      print("Please set Camera Obj input")
      return
    }
    this.camTrans = this.camObj.getTransform()
    this.visualTrans = this.visualObj.getTransform()
    this.visualObj.enabled = false

    try {
      const options = HitTestSessionOptions.create()
      options.filter = true
      this.hitTestSession = this.worldQueryModule.createHitTestSessionWithOptions(options)
    } catch (e) {
      print(e)
    }

    this.createEvent("OnStartEvent").bind(() => {
      this.setDefaultPosition()
    })
  }

  startGroundCalibration(callback: (pos: vec3, rot: quat) => void) {
    this.setDefaultPosition()
    this.hitTestSession?.start()
    this.visualObj.enabled = true
    this.history = []
    this.calibrationFrames = 0
    this.onGroundFoundCallback = callback
    this.updateEvent = this.createEvent("UpdateEvent")
    this.updateEvent.bind(() => {
      this.update()
    })
  }

  private setDefaultPosition() {
    this.desiredPosition = this.camTrans
      .getWorldPosition()
      .add(this.camTrans.forward.uniformScale(-this.DEFAULT_SCREEN_DISTANCE))
    this.desiredRotation = this.camTrans.getWorldRotation()
    this.visualTrans.setWorldPosition(this.desiredPosition)
    this.visualTrans.setWorldRotation(this.desiredRotation)
  }

  private update() {
    const rayDirection = this.camTrans.forward
    rayDirection.y += 0.1
    const camPos = this.camTrans.getWorldPosition()
    const rayStart = camPos.add(rayDirection.uniformScale(-this.MIN_HIT_DISTANCE))
    const rayEnd = camPos.add(rayDirection.uniformScale(-this.MAX_HIT_DISTANCE))
    this.hitTestSession.hitTest(rayStart, rayEnd, (hitTestResult) => {
      this.onHitTestResult(hitTestResult)
    })
  }

  private onHitTestResult(hitTestResult) {
    let foundPosition = vec3.zero()
    let foundNormal = vec3.zero()
    if (hitTestResult != null) {
      foundPosition = hitTestResult.position
      foundNormal = hitTestResult.normal
    }
    this.updateCalibration(foundPosition, foundNormal)
  }

  private updateCalibration(foundPosition: vec3, foundNormal: vec3) {
    const currPosition = this.visualTrans.getWorldPosition()
    const currRotation = this.visualTrans.getWorldRotation()

    this.desiredPosition = this.camTrans
      .getWorldPosition()
      .add(this.camTrans.forward.uniformScale(-this.DEFAULT_SCREEN_DISTANCE))
    this.desiredRotation = this.camTrans.getWorldRotation()

    //check if horizontal plane is being tracked
    if (foundNormal.distance(vec3.up()) < 0.1 && !this.vertical) {
      //make calibration face camera
      this.desiredPosition = foundPosition
      const worldCameraForward = this.camTrans.right.cross(vec3.up()).normalize()
      this.desiredRotation = quat.lookAt(worldCameraForward, foundNormal)
      this.desiredRotation = this.desiredRotation.multiply(quat.fromEulerVec(new vec3(-Math.PI / 2, 0, 0)))

      this.history.push(this.desiredPosition)
      if (this.history.length > this.CALIBRATION_FRAMES) {
        this.history.shift()
      }
      const distance = this.history[0].distance(this.history[this.history.length - 1])
      if (distance < this.MOVE_DISTANCE_THRESHOLD) {
        this.calibrationFrames++
      } else {
        this.calibrationFrames = 0
      }
    } else if (Math.abs(foundNormal.dot(vec3.up())) < 0.5 && this.vertical) {
      //make calibration face camera
      this.isVerticalSurface = true

      // Save the found position as the raw desired position
      const rawDesiredPosition = foundPosition

      // Initialize smoothed position if this is first vertical surface detection
      if (this.lastValidPosition.equal(vec3.zero())) {
        this.lastValidPosition = rawDesiredPosition
        this.smoothedPosition = rawDesiredPosition
      }

      // Only update if movement exceeds minimum threshold (reduces micro-jitters)
      const movementDistance = this.lastValidPosition.distance(rawDesiredPosition)
      if (movementDistance > this.VERTICAL_MIN_MOVE_THRESHOLD) {
        // Apply exponential smoothing to reduce jitter
        this.smoothedPosition = vec3.lerp(this.smoothedPosition, rawDesiredPosition, 1.0 - this.VERTICAL_SMOOTHING)

        // Update last valid position
        this.lastValidPosition = rawDesiredPosition
      }

      // Use smoothed position for vertical surfaces
      this.desiredPosition = this.smoothedPosition

      // Calculate the up vector for the surface - use world up
      const surfaceUp = vec3.up()

      // Calculate the forward vector - this should be the surface normal
      const surfaceForward = foundNormal

      // Calculate the right vector by crossing up and forward
      const surfaceRight = surfaceUp.cross(surfaceForward).normalize()

      // Recalculate a proper up vector to ensure orthogonality
      const adjustedUp = surfaceForward.cross(surfaceRight).normalize()

      // Use lookAt to create base rotation - looking along the normal with the up direction
      this.desiredRotation = quat.lookAt(surfaceForward, vec3.up())

      this.history.push(this.desiredPosition)
      if (this.history.length > this.CALIBRATION_FRAMES) {
        this.history.shift()
      }
      const distance = this.history[0].distance(this.history[this.history.length - 1])
      if (distance < this.MOVE_DISTANCE_THRESHOLD) {
        this.calibrationFrames++
      } else {
        this.calibrationFrames = 0
      }
    } else {
      this.calibrationFrames = 0
      this.history = []
      this.isVerticalSurface = false
    }

    const calibrationAmount = this.calibrationFrames / this.CALIBRATION_FRAMES

    if (calibrationAmount == 1) {
      this.calibrationPosition = this.desiredPosition
      const rotOffset = quat.fromEulerVec(new vec3(Math.PI / 2, 0, 0))
      this.calibrationRotation = this.desiredRotation.multiply(rotOffset)
    }

    //interpolate - use more aggressive smoothing for vertical surfaces
    const speedFactor = this.isVerticalSurface ? this.SPEED * 0.5 : this.SPEED
    this.visualTrans.setWorldPosition(vec3.lerp(currPosition, this.desiredPosition, getDeltaTime() * speedFactor))
    this.visualTrans.setWorldRotation(quat.slerp(currRotation, this.desiredRotation, getDeltaTime() * speedFactor))
  }

  private onCalibrationComplete() {
    // Keep the hit test session running to continue updating position
    // this.hitTestSession?.stop();
    //this.onGroundFoundCallback?.(this.calibrationPosition, this.calibrationRotation);
  }
}
