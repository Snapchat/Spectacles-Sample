import NativeLogger from "SpectaclesInteractionKit.lspkg/Utils/NativeLogger"
import {BaseButton} from "SpectaclesUIKit.lspkg/Scripts/Components/Button/BaseButton"
import {DetectionContainer} from "./DetectionContainer"
import {Detection} from "./DetectionHelpers"
import {MLSpatializer} from "./MLSpatializer"
import {PinholeCapture} from "./PinholeCapture"

// Import WorldQueryModule for hit testing
const WorldQueryModule = require("LensStudio:WorldQueryModule")

// LensStudio World Query Types
type HitTestResult = {
  position: vec3
  normal: vec3
  distance?: number // Make distance optional to match WorldQueryHitTestResult
}

// Create a logger instance for this class
const log = new NativeLogger("WorldQuerySpatializer")

/**
 * Main entry point for ML-based object detection and spatialization
 * Uses MLSpatializer for ML model inference and handles the spatial placement of detections
 * Simplified version with direct placement on button click
 */
@component
export class WorldQuerySpatializer extends BaseScriptComponent {
  @input
  @hint("Reference to the MLSpatializer component that handles ML detection")
  mlSpatializer: MLSpatializer

  @input
  @hint("Object to place at detected locations")
  detectionPrefab: ObjectPrefab

  @input
  @hint("Button to trigger detection on click")
  detectButton: BaseButton

  @input
  @hint("Maximum number of objects to detect and place")
  @widget(new SliderWidget(1, 20, 1))
  maxDetectionCount: number = 5

  @input
  @hint("Distance to project detections in world space")
  rayDistance: number = 200

  @input
  @hint("Reference to the PinholeCapture component")
  pinholeCapture: PinholeCapture

  @input
  @hint("Log detection results to console")
  debugLogging: boolean = false

  @input
  @hint("Enable surface detection with WorldQueryModule")
  enableSurfaceDetection: boolean = true

  private detectionInstances: SceneObject[] = []
  private isInitialized: boolean = false
  private isRunning: boolean = false
  private hitTestSession: HitTestSession

  onAwake(): void {
    print("[STARTUP] WorldQuerySpatializer: onAwake called")
    log.d("WorldQuerySpatializer: onAwake called")

    // Wait for scene start event to ensure components are registered
    this.createEvent("OnStartEvent").bind(() => {
      print("[STARTUP] WorldQuerySpatializer: OnStartEvent triggered")

      if (!this.mlSpatializer) {
        print("[ERROR] MLSpatializer reference is not set")

        log.e("MLSpatializer reference is not set")
        return
      }

      // Set up button before initializing
      this.setupButton()

      print("[STARTUP] MLSpatializer reference found, delaying initialization")

      // Initialize with a slight delay
      const delayedInitEvent = this.createEvent("DelayedCallbackEvent")
      delayedInitEvent.bind(() => {
        print("[STARTUP] Delayed initialization starting after 1 second")
        this.initialize()
      })
      delayedInitEvent.reset(1.0) // 1 second delay
    })
  }

  /**
   * Set up button interaction
   */
  private setupButton(): void {
    print("[BUTTON] Setting up detect button")

    if (!this.detectButton) {
      print("[ERROR] Detect button is not set in inspector")

      return
    }

    try {
      // Add the event listener to the detect button
      print("[BUTTON] Adding onTriggerUp listener to button")
      this.detectButton.onTriggerUp.add(() => {
        print("[EVENT] Detect button pressed - triggering detection")
        this.detect()
      })
      print("[BUTTON] Button setup complete")

      // Test if we can get the button's scene object to verify it exists
      try {
        const buttonObject = this.detectButton.getSceneObject()
        print("[BUTTON] Button scene object name: " + buttonObject.name)
      } catch (e) {
        print("[ERROR] Failed to get button's scene object: " + e)
      }
    } catch (e) {
      print("[ERROR] Exception during button setup: " + e)
    }
  }

  /**
   * Initialize the component
   */
  private initialize(): void {
    print("[STARTUP] Starting WorldQuerySpatializer initialization...")

    if (!this.pinholeCapture) {
      print("[ERROR] PinholeCapture is not set")

      log.e("PinholeCapture input is not set")
      return
    }

    print("[STARTUP] PinholeCapture found, saving camera matrix")

    // Save the camera matrix
    if (!this.pinholeCapture.saveMatrix()) {
      print("[ERROR] Failed to save camera matrix. Retrying in 1 second...")

      // Try one more time after a delay
      const retryEvent = this.createEvent("DelayedCallbackEvent")
      retryEvent.bind(() => {
        print("[STARTUP] Retrying to save camera matrix")
        if (!this.pinholeCapture.saveMatrix()) {
          print("[ERROR] Failed to save camera matrix again after retry")

          log.e("Failed to save camera matrix after retry")
        } else {
          print("[STARTUP] Camera matrix saved successfully on retry")
          this.continueInitialization()
        }
      })
      retryEvent.reset(1.0)
      return
    }

    print("[STARTUP] Camera matrix saved successfully")
    this.continueInitialization()
  }

  /**
   * Continue initialization after camera matrix is saved
   */
  private continueInitialization(): void {
    try {
      // Initialize detection instances
      print("[DEBUG] Initializing detection instances")
      this.initDetectionInstances()

      // Create hit test session for world placement if enabled
      if (this.enableSurfaceDetection) {
        print("[DEBUG] Creating hit test session")
        this.hitTestSession = this.createHitTestSession()
        print("[DEBUG] Hit test session created: " + (this.hitTestSession !== null))
      }

      this.isInitialized = true
      print("[DEBUG] WorldQuerySpatializer initialization complete")
    } catch (e) {
      print("[ERROR] Error during initialization: " + e)

      log.e("Error during initialization: " + e)
    }
  }

  /**
   * Create hit test session with options
   */
  private createHitTestSession(): HitTestSession {
    try {
      print("[DEBUG] Creating HitTestSession with options")

      // Safety check for WorldQueryModule availability
      if (typeof WorldQueryModule === "undefined" || !WorldQueryModule) {
        print("[ERROR] WorldQueryModule is not available in this environment!")
        return null
      }

      // Check if we're running in an environment that supports WorldQueryModule
      const hasWorldQuerySupport = this.checkWorldQuerySupport()
      if (!hasWorldQuerySupport) {
        print("[ERROR] This environment doesn't support WorldQueryModule")
        return null
      }

      const options = HitTestSessionOptions.create()
      if (!options) {
        print("[ERROR] Failed to create HitTestSessionOptions")
        return null
      }

      options.filter = true

      print("[DEBUG] Calling WorldQueryModule.createHitTestSessionWithOptions")
      const session = WorldQueryModule.createHitTestSessionWithOptions(options)
      print("[DEBUG] HitTestSession created successfully: " + (session !== null))
      return session
    } catch (e) {
      print("[ERROR] Failed to create HitTestSession: " + e)
      return null
    }
  }

  /**
   * Check if the current environment supports WorldQueryModule
   */
  private checkWorldQuerySupport(): boolean {
    try {
      // Try to create a basic HitTestSessionOptions as a test
      const testOptions = HitTestSessionOptions.create()
      if (!testOptions) {
        print("[TEST] HitTestSessionOptions failed - WorldQuery not supported")
        return false
      }

      // Check if we can access the WorldQueryModule
      if (typeof WorldQueryModule === "undefined" || !WorldQueryModule) {
        print("[TEST] WorldQueryModule is undefined or null")
        return false
      }

      // Check if the createHitTestSessionWithOptions function exists
      if (typeof WorldQueryModule.createHitTestSessionWithOptions !== "function") {
        print("[TEST] createHitTestSessionWithOptions is not a function")
        return false
      }

      print("[TEST] Environment appears to support WorldQueryModule")
      return true
    } catch (e) {
      print("[TEST] Exception while checking WorldQueryModule support: " + e)
      return false
    }
  }

  /**
   * Initialize detection instances
   */
  private initDetectionInstances(): void {
    if (!this.detectionPrefab) {
      print("Error: Please set detection Prefab input")
      return
    }

    // Create a parent object to hold all our detection instances
    const instancesParent = global.scene.createSceneObject("DetectionInstances")
    instancesParent.setParent(this.getSceneObject())

    // Create instances for max number of detections
    for (let i = 0; i < this.maxDetectionCount; i++) {
      // Instantiate a new instance from the prefab
      const instance = this.detectionPrefab.instantiate(null)
      // Set parent after instantiation
      instance.setParent(instancesParent)

      // Set a meaningful name for the instance
      instance.name = "Detection_" + i

      // Initially disable the instance
      instance.enabled = false

      // Add to our tracking arrays
      this.detectionInstances.push(instance)
    }
  }

  /**
   * Run detection and spatialize results on button click
   */
  private detect(): void {
    if (this.isRunning || !this.isInitialized) {
      print("[DEBUG] Detection skipped - already running or not initialized")
      return
    }

    // Skip processing if PinholeCapture isn't ready
    if (!this.pinholeCapture || !this.pinholeCapture.isReady || !this.pinholeCapture.isReady()) {
      print("[DEBUG] Detection skipped - PinholeCapture not ready")
      return
    }

    print("[DEBUG] Starting detection process...")

    this.isRunning = true

    try {
      // Save camera matrix to ensure current transforms
      const matrixSaved = this.pinholeCapture.saveMatrix()

      if (!matrixSaved) {
        print("[DEBUG] Failed to save camera matrix during detection")
        this.isRunning = false
        return
      }

      // Get detections from the MLSpatializer
      print("[DEBUG] Getting latest detections from MLSpatializer")
      const detections = this.mlSpatializer.getLatestDetections()
      print("[DEBUG] Got " + detections.length + " detections")

      // Clear all previous detections
      this.clearAllDetections()

      // Process the detections with direct placement
      print("[DEBUG] Placing detections in world")
      this.placeDetectionsInWorld(detections)
    } catch (e) {
      print("[ERROR] Error processing detection: " + e)
      log.e("Error processing detection: " + e)
    } finally {
      this.isRunning = false
    }
  }

  /**
   * Clear all existing detection instances
   */
  private clearAllDetections(): void {
    for (let i = 0; i < this.detectionInstances.length; i++) {
      this.detectionInstances[i].enabled = false
    }
  }

  /**
   * Place detections in world space directly without smoothing
   */
  private placeDetectionsInWorld(detections: Detection[]): void {
    // Log detection results if debug is enabled
    print("[DEBUG] placeDetectionsInWorld called with " + detections.length + " detections")

    if (detections.length === 0) {
      print("[DEBUG] No objects detected to place")
      return
    }

    // Place each detection in world space
    for (let i = 0; i < Math.min(detections.length, this.maxDetectionCount); i++) {
      const detection = detections[i]
      const instance = this.detectionInstances[i]

      print("[DEBUG] Processing detection " + i + ": " + detection.label)

      // Get screen position from bbox center
      const screenPosX = detection.bbox[0] // 0-1 range
      const screenPosY = detection.bbox[1] // 0-1 range
      const width = detection.bbox[2]

      print(
        "[DEBUG] Screen position: x=" +
          screenPosX.toFixed(2) +
          ", y=" +
          screenPosY.toFixed(2) +
          ", width=" +
          width.toFixed(2)
      )

      // Adjust horizontal correction based on which side of the screen the detection is on
      const centerOffset = screenPosX - 0.5
      const horizontalCorrection = 0.18 + centerOffset * 0.1
      const correctedScreenPosX = Math.max(0.01, Math.min(0.99, screenPosX - width * 0.5 + horizontalCorrection))

      print("[DEBUG] Corrected screen X: " + correctedScreenPosX.toFixed(2))

      // Ensure PinholeCapture is valid and ready
      if (!this.pinholeCapture || !this.pinholeCapture.isReady()) {
        print("[ERROR] PinholeCapture not ready during placement")

        continue
      }

      // First, get camera position using reliable method
      const cameraPos = this.pinholeCapture.worldSpaceOfTrackingCamera()
      if (!cameraPos) {
        print("[ERROR] Could not get camera position for detection " + i)

        continue
      }

      print(
        "[DEBUG] Camera position: " +
          cameraPos.x.toFixed(2) +
          ", " +
          cameraPos.y.toFixed(2) +
          ", " +
          cameraPos.z.toFixed(2)
      )

      // Use the direct captureToWorldTransform method with corrected coordinates
      const worldPos = this.pinholeCapture.captureToWorldTransform(
        new vec2(correctedScreenPosX, screenPosY),
        this.rayDistance
      )

      if (!worldPos) {
        // Could not project, keep instance disabled
        print("[ERROR] Projection failed for detection " + i)
        instance.enabled = false
        continue
      }

      print(
        "[DEBUG] World position: " + worldPos.x.toFixed(2) + ", " + worldPos.y.toFixed(2) + ", " + worldPos.z.toFixed(2)
      )

      // Calculate the ray direction vector
      const rayDir = worldPos.sub(cameraPos).normalize()
      print("[DEBUG] Ray direction: " + rayDir.x.toFixed(2) + ", " + rayDir.y.toFixed(2) + ", " + rayDir.z.toFixed(2))

      // If hit testing is enabled, try to place on a surface
      if (this.enableSurfaceDetection && this.hitTestSession) {
        print("[DEBUG] Surface detection enabled, attempting hit test")
        // Create ray start and end points for hit testing
        const rayStart = cameraPos
        // Cast ray further than the specified distance to ensure we hit surfaces
        const rayEnd = cameraPos.add(rayDir.uniformScale(this.rayDistance * 2))

        print(
          "[DEBUG] Ray start: " + rayStart.x.toFixed(2) + ", " + rayStart.y.toFixed(2) + ", " + rayStart.z.toFixed(2)
        )
        print("[DEBUG] Ray end: " + rayEnd.x.toFixed(2) + ", " + rayEnd.y.toFixed(2) + ", " + rayEnd.z.toFixed(2))

        try {
          print("[DEBUG] Casting hit test ray for " + detection.label)
          // Perform hit test asynchronously
          this.hitTestSession.hitTest(rayStart, rayEnd, (hit) => {
            print("[DEBUG] Hit test callback received for " + detection.label + ", success: " + (hit !== null))
            this.handleHitTestResult(hit, instance, detection, cameraPos)
          })

          // Continue to the next detection, the hit test callback will handle placement
          continue
        } catch (e) {
          print("[ERROR] Hit test failed: " + e)
          // Fall back to regular placement if hit test fails
        }
      } else {
        print("[DEBUG] Surface detection disabled or hit test session not created")
      }

      // Fallback: Apply a simple distance without any smoothing
      const position = cameraPos.add(rayDir.uniformScale(this.rayDistance))
      print(
        "[DEBUG] Using fallback position: " +
          position.x.toFixed(2) +
          ", " +
          position.y.toFixed(2) +
          ", " +
          position.z.toFixed(2)
      )

      // Set the position and make instance visible
      const transform = instance.getTransform()
      transform.setWorldPosition(position)

      // Make the detection face the camera
      const directionToCamera = cameraPos.sub(position).normalize()
      const worldUp = vec3.up()
      const lookAtRotation = quat.lookAt(directionToCamera, worldUp)
      transform.setWorldRotation(lookAtRotation)

      instance.enabled = true

      // Update detection container text fields
      this.updateDetectionContainerTextOnly(instance, detection, position)

      print(
        "[DEBUG] Placed " +
          detection.label +
          " at position " +
          position.x.toFixed(2) +
          ", " +
          position.y.toFixed(2) +
          ", " +
          position.z.toFixed(2)
      )
    }
  }

  /**
   * Handle the result of a hit test and place the object accordingly
   */
  private handleHitTestResult(hit: HitTestResult, instance: SceneObject, detection: Detection, cameraPos: vec3): void {
    print("[DEBUG] handleHitTestResult called for " + detection.label + ", hit: " + (hit !== null))

    if (!hit) {
      print("[DEBUG] No surface hit found for " + detection.label + ", using fallback placement")

      // No surface found, use default ray distance for positioning as fallback
      try {
        const screenPosX = detection.bbox[0]
        const screenPosY = detection.bbox[1]
        const width = detection.bbox[2]

        print("[DEBUG] FALLBACK: Using screen position: " + screenPosX.toFixed(2) + ", " + screenPosY.toFixed(2))

        const centerOffset = screenPosX - 0.5
        const horizontalCorrection = 0 + centerOffset * 0.1
        const correctedScreenPosX = Math.max(0.01, Math.min(0.99, screenPosX - width * 0.5 + horizontalCorrection))

        print("[DEBUG] FALLBACK: Corrected X: " + correctedScreenPosX.toFixed(2))

        const worldPos = this.pinholeCapture.captureToWorldTransform(
          new vec2(correctedScreenPosX, screenPosY),
          this.rayDistance
        )

        if (!worldPos) {
          print("[ERROR] FALLBACK: Failed to create fallback world position")
          instance.enabled = false
          return
        }

        print(
          "[DEBUG] FALLBACK: Got world position: " +
            worldPos.x.toFixed(2) +
            ", " +
            worldPos.y.toFixed(2) +
            ", " +
            worldPos.z.toFixed(2)
        )

        const rayDir = worldPos.sub(cameraPos).normalize()
        print(
          "[DEBUG] FALLBACK: Ray direction: " +
            rayDir.x.toFixed(2) +
            ", " +
            rayDir.y.toFixed(2) +
            ", " +
            rayDir.z.toFixed(2)
        )

        const position = cameraPos.add(rayDir.uniformScale(this.rayDistance))

        print(
          "[DEBUG] FALLBACK: Using fallback position: " +
            position.x.toFixed(2) +
            ", " +
            position.y.toFixed(2) +
            ", " +
            position.z.toFixed(2)
        )

        const transform = instance.getTransform()
        transform.setWorldPosition(position)

        const directionToCamera = cameraPos.sub(position).normalize()
        const worldUp = vec3.up()
        const lookAtRotation = quat.lookAt(directionToCamera, worldUp)
        transform.setWorldRotation(lookAtRotation)

        // Position the vertices in the fallback case too
        this.positionVertices(instance, detection, position, lookAtRotation)

        // Update detection container text fields
        this.updateDetectionContainerTextOnly(instance, detection, position)

        print("[DEBUG] FALLBACK: Successfully placed object at fallback position")
      } catch (e) {
        print("[ERROR] FALLBACK: Exception during fallback placement: " + e)
        instance.enabled = false
        return
      }

      instance.enabled = true
      return
    }

    // Surface was found, use hit position
    const hitPosition = hit.position
    const hitNormal = hit.normal

    print(
      "[DEBUG] Surface hit! Position: " +
        hitPosition.x.toFixed(2) +
        ", " +
        hitPosition.y.toFixed(2) +
        ", " +
        hitPosition.z.toFixed(2)
    )
    print(
      "[DEBUG] Surface normal: " +
        hitNormal.x.toFixed(2) +
        ", " +
        hitNormal.y.toFixed(2) +
        ", " +
        hitNormal.z.toFixed(2)
    )

    // Get transform to update position and rotation
    const transform = instance.getTransform()
    transform.setWorldPosition(hitPosition)

    // Determine orientation based on surface normal and camera position
    const directionToCamera = cameraPos.sub(hitPosition).normalize()

    // Check if the surface is approximately horizontal (normal points up/down)
    const normalizedNormal = hitNormal.normalize()
    const upDot = Math.abs(normalizedNormal.dot(vec3.up()))
    print("[DEBUG] Surface orientation (upDot): " + upDot.toFixed(2) + " (1.0 = horizontal)")

    // Calculate rotation to face the camera while respecting the surface orientation
    let finalRotation: quat

    if (upDot > 0.9) {
      // Horizontal surface (floor/ceiling)
      print("[DEBUG] Horizontal surface detected")
      // Project camera direction onto horizontal plane and make the object face that direction
      const horizontalDir = new vec3(directionToCamera.x, 0, directionToCamera.z).normalize()

      finalRotation = quat.lookAt(horizontalDir, vec3.up())
    } else {
      // Vertical or angled surface
      print("[DEBUG] Vertical/angled surface detected")
      // Use surface normal as reference (pointing away from the surface)
      // and make the object face toward the camera
      finalRotation = quat.lookAt(directionToCamera, vec3.up())
    }

    transform.setWorldRotation(finalRotation)

    // Position the bounding box vertices around the detection
    this.positionVertices(instance, detection, hitPosition, finalRotation)

    // Enable the instance after vertex positioning
    instance.enabled = true

    // Update detection container text fields
    this.updateDetectionContainerTextOnly(instance, detection, hitPosition)

    print("[DEBUG] Successfully placed " + detection.label + " on surface")
  }

  /**
   * Find a child object by name
   * @param parent The parent object to search in
   * @param name The name of the child to find
   * @returns The found child SceneObject or null if not found
   */
  private findChildByName(parent: SceneObject, name: string): SceneObject {
    if (!parent) {
      return null
    }

    // Get the number of children
    const childCount = parent.getChildrenCount()

    // Loop through each child
    for (let i = 0; i < childCount; i++) {
      const child = parent.getChild(i)
      if (child.name === name) {
        return child
      }
    }

    return null
  }

  /**
   * Public method to get the number of active detections
   */
  public getActiveDetectionCount(): number {
    return this.detectionInstances.filter((instance) => instance.enabled).length
  }

  onDestroy(): void {
    // Clean up resources
    this.detectionInstances = []
  }

  onStart(): void {
    print("[STARTUP] WorldQuerySpatializer: onStart called")

    // Test button functionality
    if (this.detectButton) {
      try {
        print("[TEST] Testing detect button in onStart")
        const buttonObject = this.detectButton.getSceneObject()
        print("[TEST] Button scene object name: " + buttonObject.name)

        // Add direct test trigger for button
        try {
          print("[TEST] Setting up direct test button trigger")
          this.detectButton.onTriggerUp.add(() => {
            print("[TEST-BUTTON] Direct test button callback triggered")
            this.detect()
          })
          print("[TEST] Direct test button trigger added successfully")
        } catch (e) {
          print("[ERROR] Failed to set up direct test button trigger: " + e)
        }
      } catch (e) {
        print("[ERROR] Button error in onStart: " + e)
      }
    } else {
      print("[ERROR] Button not set in onStart")
    }

    // Try detection after a delay to ensure initialization is complete
    print("[TEST] Setting up delayed test detection")
    const testEvent = this.createEvent("DelayedCallbackEvent")
    testEvent.bind(() => {
      print("[TEST] Running delayed test detection")
      if (this.isInitialized) {
        this.detect()
      } else {
        print("[TEST] Not initialized yet, can't run detection")
      }
    })
    testEvent.reset(3.0) // 3 second delay
  }

  /**
   * Position the vertices of the detection bounding box in 3D space
   * @param instance The detection instance SceneObject
   * @param detection The detection data
   * @param centerPosition The world position of the detection center
   * @param orientation The orientation quaternion of the detection
   */
  /**
   * Position the vertices of the detection bounding box in 3D space
   * @param instance The detection instance SceneObject
   * @param detection The detection data
   * @param centerPosition The world position of the detection center
   * @param orientation The orientation quaternion of the detection
   */
  /**
   * Position the vertices of the detection bounding box in 3D space
   * This method should be called from the handleHitTestResult function
   */
  /**
   * Update only the text fields (category/confidence and distance) of a DetectionContainer.
   * @param detectionInstance The SceneObject instance containing the DetectionContainer
   * @param detection The detection data (label, score, etc.)
   * @param worldPosition The world position of the detection (vec3)
   */
  private updateDetectionContainerTextOnly(
    detectionInstance: SceneObject,
    detection: Detection,
    worldPosition: vec3
  ): void {
    const detectionContainer = detectionInstance.getComponent(DetectionContainer.getTypeName()) as DetectionContainer

    if (!detectionContainer) {
      return
    }

    // Update category and confidence text
    if (detectionContainer.categoryAndConfidence) {
      const confidencePercent = Math.round(detection.score * 100)
      const labelText = `${detection.label || "detection"}: ${confidencePercent}%`
      detectionContainer.categoryAndConfidence.text = labelText
    }

    // Update distance from camera text
    if (detectionContainer.distanceFromCamera && this.pinholeCapture) {
      const cameraPos = this.pinholeCapture.worldSpaceOfTrackingCamera()
      if (cameraPos && worldPosition) {
        const distanceMeters = cameraPos.distance(worldPosition)
        detectionContainer.distanceFromCamera.text = `${distanceMeters.toFixed(2)}cm`
      }
    }
  }

  // Rectangle vertex placement: always centered, with correct aspect and scale
  private positionVertices(instance: SceneObject, detection: Detection, centerPosition: vec3, orientation: quat): void {
    if (this.debugLogging) {
      print(`[DEBUG] Positioning vertices for detection ${detection.label} at ${centerPosition}`)
    }

    // Get the DetectionContainer component from the prefab instance
    const detectionContainer = instance.getComponent(DetectionContainer.getTypeName()) as DetectionContainer
    if (!detectionContainer || !detectionContainer.polylinePoints || detectionContainer.polylinePoints.length < 4) {
      if (this.debugLogging) {
        print("[DEBUG] DetectionContainer or polylinePoints not found or insufficient")
      }
      return
    }

    const vertices = detectionContainer.polylinePoints

    try {
      // Get detection bounding box values
      const width = detection.bbox[2]
      const height = detection.bbox[3]

      // Tweakable scale for the rectangle size (set to 1.0 for true bbox, <1 for smaller)
      const rectangleScale = 0.6

      // NEW: World scale factor to convert normalized bbox to world units
      const rectangleWorldScale = 100 // Increase or decrease as needed for visibility

      // Calculate half dimensions in local space (in world units)
      const halfWidth = (width * rectangleScale * rectangleWorldScale) / 2
      const halfHeight = (height * rectangleScale * rectangleWorldScale) / 2

      // Define the four corners in local space (z=0)
      const localCorners = [
        new vec3(-halfWidth, halfHeight, 0), // top-left
        new vec3(halfWidth, halfHeight, 0), // top-right
        new vec3(halfWidth, -halfHeight, 0), // bottom-right
        new vec3(-halfWidth, -halfHeight, 0) // bottom-left
      ]

      // Assign local positions to the vertices
      for (let i = 0; i < 4 && i < vertices.length; i++) {
        vertices[i].getTransform().setLocalPosition(localCorners[i])
        if (this.debugLogging) {
          print(
            `[DEBUG] Vertex ${i}: local=${localCorners[i].toString()} (halfWidth=${halfWidth}, halfHeight=${halfHeight})`
          )
        }
      }

      // Enforce perfect rectangle constraints
      // Indices: 0 = top-left, 1 = top-right, 2 = bottom-right, 3 = bottom-left
      const v0 = vertices[0].getTransform().getLocalPosition() // top-left
      const v1 = vertices[1].getTransform().getLocalPosition() // top-right
      const v2 = vertices[2].getTransform().getLocalPosition() // bottom-right
      const v3 = vertices[3].getTransform().getLocalPosition() // bottom-left

      // Compute enforced values
      const topY = Math.max(v0.y, v1.y)
      const bottomY = Math.min(v2.y, v3.y)
      const leftX = Math.min(v0.x, v3.x)
      const rightX = Math.max(v1.x, v2.x)

      // Set Z = 0 for all
      vertices[0].getTransform().setLocalPosition(new vec3(leftX, topY, 0)) // top-left
      vertices[1].getTransform().setLocalPosition(new vec3(rightX, topY, 0)) // top-right
      vertices[2].getTransform().setLocalPosition(new vec3(rightX, bottomY, 0)) // bottom-right
      vertices[3].getTransform().setLocalPosition(new vec3(leftX, bottomY, 0)) // bottom-left

      if (this.debugLogging) {
        print(`[DEBUG] Enforced rectangle:`)
        print(`[DEBUG] top-left:     (${leftX}, ${topY}, 0)`)
        print(`[DEBUG] top-right:    (${rightX}, ${topY}, 0)`)
        print(`[DEBUG] bottom-right: (${rightX}, ${bottomY}, 0)`)
        print(`[DEBUG] bottom-left:  (${leftX}, ${bottomY}, 0)`)
      }

      // Refresh the polyline after positioning the vertices
      if (detectionContainer.polyline) {
        detectionContainer.polyline.refreshLine()
      }
    } catch (e) {
      print(`[ERROR] Error positioning vertices: ${e}`)
    }
  }
}
