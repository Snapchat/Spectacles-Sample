import { DepthCache } from "./DepthCache";
import { DebugVisualizer } from "./DebugVisualizer";
import { InteractorEvent } from "SpectaclesInteractionKit.lspkg/Core/Interactor/InteractorEvent";
import { Interactable } from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable";
import { MLSpatializer } from "./MLSpatializer";
import { Detection } from "./DetectionHelpers";
import { DetectionContainer } from "./DetectionContainer";
import {
  DetectionState,
  LerpState,
  lerpVec3,
  easeOutCubic,
  alignVerticesToRectangle,
  areVerticesSimilar,
} from "./SpatializerUtils";

// remember that to use this script, you need to disable the event callback function in the ML Spatializer
// as they are both calling the same functions but the depth spatializer is getting the yolo outputs
// and the ML spatializer is the one providing the outputs

@component
export class DepthSpatializer extends BaseScriptComponent {
  @input
  @allowUndefined
  @hint("The camera that will be used for distance spatialization")
  camera: SceneObject;

  @input
  @allowUndefined
  @hint(
    "The debug visualizer that will be used to visualize the camera frame and depth points"
  )
  debugVisualizer: DebugVisualizer;

  @input
  @allowUndefined
  @hint("The depth cache that will be used to store and retrieve depth frames")
  depthCache: DepthCache;

  @input
  @allowUndefined
  @hint("The prefab that will be instantiated for each detected object")
  depthPrefab: ObjectPrefab;

  @input
  @allowUndefined
  @hint("The button that will trigger the update position function")
  testButton: Interactable;

  @input
  @allowUndefined
  @hint(
    "The spatializer that will be used for ML spatialization and coordinate conversion"
  )
  mlSpatializer: MLSpatializer;

  private isRequestRunning = false;
  private detectionInstances: SceneObject[] = [];

  @input
  @allowUndefined
  @hint("The button that will trigger the update position function")
  debug: boolean = true;
  @input
  @hint("Enable automatic position updates")
  enableContinuousUpdate: boolean = false;

  @input
  @hint("Interval in seconds between automatic position updates")
  continuousUpdateInterval: number = 5.0;

  // Smoothing technique properties
  @input
  @hint("Maximum number of detections to render (1-5)")
  maxDetections: number = 3;

  @input
  @hint(
    "Scale factor for bounding box vertices (0-1, 0=center point, 1=full bbox)"
  )
  boundingBoxScale: number = 1.0;

  @input
  @hint("Minimum position change in cm to trigger update")
  positionUpdateThreshold: number = 30.0;

  @input
  @hint(
    "Maximum camera rotation speed (degrees/second) before skipping updates"
  )
  maxCameraRotationSpeed: number = 90.0;

  @input
  @hint("Maximum camera movement speed (cm/second) before skipping updates")
  maxCameraMovementSpeed: number = 100.0;

  @input
  @hint("Minimum vertex change in cm to trigger vertex update")
  vertexUpdateThreshold: number = 20.0;

  @input
  @hint(
    "Number of stable frames required before considering detection persistent"
  )
  stableFramesRequired: number = 2;

  // Static scene properties for pre-instantiated prefabs
  @input
  @hint("Enable static scene mode with pre-instantiated prefabs and smooth repositioning instead of clean up and re-instantiation")
  enableStaticScene: boolean = true;

  @input
  @hint("Smooth lerp duration in seconds for position transitions")
  lerpDuration: number = 0.3;

  @input
  @hint("Smooth lerp duration in seconds for vertex transitions")
  vertexLerpDuration: number = 0.2;

  @input
  @hint("Enable smooth rotation lerping for detection objects")
  enableRotationLerp: boolean = true;

  @input
  @hint("Smooth lerp duration in seconds for rotation transitions")
  rotationLerpDuration: number = 0.4;

  private delayedEvent: DelayedCallbackEvent;

  // Camera movement tracking
  private lastCameraPosition: vec3;
  private lastCameraRotation: quat;
  private lastUpdateTime: number = 0;

  // Detection position tracking for threshold checking
  private lastDetectionPositions: vec3[] = [];

  // Missing properties for detection tracking
  private detectionStableFrames: number[] = [];
  private lastDetectionCenters: vec3[] = [];
  private lastDetectionVertices: (vec3[] | null)[] = [];

  // Static scene state management
  private preInstantiatedDetections: SceneObject[] = [];
  private detectionStates: DetectionState[] = [];
  private activeLerps: Map<number, LerpState> = new Map();

  onAwake() {
    this.createEvent("OnStartEvent").bind(this.onStart.bind(this));

    // Create update event for lerp transitions
    this.createEvent("UpdateEvent").bind(this.onUpdate.bind(this));
  }

  onStart() {
    // Initialize camera tracking
    if (this.camera) {
      this.lastCameraPosition = this.camera.getTransform().getWorldPosition();
      this.lastCameraRotation = this.camera.getTransform().getWorldRotation();
      this.lastUpdateTime = getTime();
    }

    if (!this.enableContinuousUpdate) {
      // Create an event callback function for the create button
      let onTriggerStartCallback = (event: InteractorEvent) => {
        this.updatePosition();
      };
      // Add the event listener to the create button onInteractorTriggerStart
      this.testButton.onInteractorTriggerStart(onTriggerStartCallback);
    }

    // Set up automatic position testing if enabled
    if (this.enableContinuousUpdate) {
      this.delayedEvent = this.createEvent("DelayedCallbackEvent");
      this.delayedEvent.bind(() => {
        this.updatePosition();
        // Reset the delay for the next cycle
        this.delayedEvent.reset(this.continuousUpdateInterval);
      });

      // Start the first delay
      this.delayedEvent.reset(this.continuousUpdateInterval);
      print(
        `Automatic position testing started with ${this.continuousUpdateInterval}s interval`
      );
    }

    // Initialize static scene if enabled
    this.initializeStaticScene();
  }

  onUpdate() {
    // Update lerp transitions for static scene
    if (this.enableStaticScene) {
      this.updateLerpTransitions();
    }
  }

  // DO NOT keep the debug visualizer ON if you are
  // building on device
  public updatePosition() {
    if (this.isRequestRunning) {
      return;
    }

    // Check if camera is moving too fast
    if (!this.isCameraMovementAcceptable()) {
      if (this.debug) {
        print("Camera moving too fast - skipping update");
      }
      return;
    }

    // Check if depth cache is properly initialized
    if (!this.depthCache) {
      if (this.debug) {
        print(
          "DepthCache is not available - skipping depth-based spatialization"
        );
      }
      return;
    }

    this.isRequestRunning = true;

    try {
      const depthFrameID = this.depthCache.saveDepthFrame();

      if (depthFrameID === -1) {
        if (this.debug) {
          print(
            "Failed to request depth frame - depth system may not be ready"
          );
        }
        this.isRequestRunning = false;
        return;
      }

      const cameraFrame = this.depthCache.getCamImageWithID(depthFrameID);

      if (this.debug) {
        this.debugVisualizer.updateCameraFrame(cameraFrame);
      }

      if (!cameraFrame) {
        if (this.debug) {
          print("Failed to get camera frame - using fallback positioning");
        }
        this.isRequestRunning = false;
        this.depthCache.disposeDepthFrame(depthFrameID);
        return;
      }

      this.depthWorldPosition(cameraFrame, depthFrameID);
    } catch (error) {
      print("Error in updatePosition: " + error);
      this.isRequestRunning = false;
    }
  }

  private depthWorldPosition(cameraFrame: Texture, depthFrameID: number) {
    // Get the ML outputs and YOLO processor
    const outputs = this.mlSpatializer.getMLOutputs();
    const yoloProcessor = this.mlSpatializer.getYOLOProcessor();

    if (!outputs || !yoloProcessor) {
      print("ML outputs or YOLO processor not available!");
      this.isRequestRunning = false;
      return;
    }

    // Process YOLO outputs to get detections
    const detections = yoloProcessor.parseYolo7Outputs(outputs);

    if (!detections || detections.length === 0) {
      print("No detections available");

      // Instead of immediately cleaning up, check if we have stable detections to maintain
      let hasStableDetections = false;
      for (let i = 0; i < this.detectionStableFrames.length; i++) {
        if (this.detectionStableFrames[i] >= this.stableFramesRequired) {
          hasStableDetections = true;
          if (this.debug) {
            print(
              `Maintaining stable detection ${i} (${this.detectionStableFrames[i]} stable frames)`
            );
          }
        }
      }

      if (!hasStableDetections) {
        // Clean up all instances when no detections and none are stable
        this.cleanupDetectionInstances();
      } else {
        if (this.debug) {
          print("Keeping stable detections despite no new detections");
        }
      }

      this.isRequestRunning = false;
      return;
    }

    // Limit the number of detections based on maxDetections setting
    const limitedDetections = detections.slice(0, this.maxDetections);

    print(
      `Processing ${limitedDetections.length} detections (limited from ${detections.length})...`
    );

    // Get camera frame dimensions from the texture
    const frameWidth = cameraFrame.getWidth();
    const frameHeight = cameraFrame.getHeight();

    // Resize tracking arrays to match current detections
    this.resizeTrackingArrays(limitedDetections.length);

    // Choose detection processing method based on static scene setting
    if (this.enableStaticScene) {
      this.processDetectionsWithStaticScene(
        limitedDetections,
        cameraFrame,
        depthFrameID
      );
    } else {
      this.processDetectionsWithDynamicScene(
        limitedDetections,
        cameraFrame,
        depthFrameID
      );
    }

    this.isRequestRunning = false;
    this.depthCache.disposeDepthFrame(depthFrameID);
  }

  /**
   * Process detections using static scene with pre-instantiated objects and lerp transitions
   */
  private processDetectionsWithStaticScene(
    detections: Detection[],
    cameraFrame: Texture,
    depthFrameID: number
  ): void {
    const frameWidth = cameraFrame.getWidth();
    const frameHeight = cameraFrame.getHeight();

    for (let i = 0; i < detections.length; i++) {
      const detection = detections[i];

      // Calculate detection center from bounding box
      const centerX = detection.bbox[0];
      const centerY = detection.bbox[1];

      // Convert normalized coordinates to pixel coordinates
      const pixelX = centerX * frameWidth;
      const pixelY = centerY * frameHeight;
      const centerPixelPos = new vec2(pixelX, pixelY);

      if (this.debug) {
        this.debugVisualizer.visualizeLocalPoint(centerPixelPos, cameraFrame);
        this.debugVisualizer.visualizeBoundingBoxVertices(
          detection.bbox,
          cameraFrame
        );
      }

      // Get world position for the detection center
      const worldPosition = this.depthCache.getWorldPositionWithID(
        centerPixelPos,
        depthFrameID
      );

      if (!worldPosition) {
        if (this.debug) {
          print(
            `Static Scene Detection ${i}: Failed to get world position for pixel (${pixelX.toFixed(
              1
            )}, ${pixelY.toFixed(1)})`
          );
        }
        continue;
      }

      // Calculate bounding box vertices in 3D world space
      const boundingBoxVertices = this.calculateBoundingBoxVertices(
        detection,
        worldPosition,
        cameraFrame,
        depthFrameID
      );

      // Update static scene detection with smooth transitions
      this.updateStaticSceneDetection(
        i,
        detection,
        worldPosition,
        boundingBoxVertices
      );

      if (this.debug) {
        print(
          `Static Scene Detection ${i} (${detection.label}): Score ${(
            detection.score * 100
          ).toFixed(1)}%`
        );
        print(
          `  World position: (${worldPosition.x.toFixed(
            2
          )}, ${worldPosition.y.toFixed(2)}, ${worldPosition.z.toFixed(2)})`
        );
      }
    }

    // Update detection states for inactive detections (fade out)
    for (let i = detections.length; i < this.maxDetections; i++) {
      if (i < this.detectionStates.length && this.detectionStates[i].isActive) {
        this.detectionStates[i].isActive = false;
        this.detectionStates[i].fadeAlpha = Math.max(
          0,
          this.detectionStates[i].fadeAlpha - 0.1
        );

        if (this.detectionStates[i].fadeAlpha <= 0) {
          // Hide the detection object
          if (
            i < this.preInstantiatedDetections.length &&
            this.preInstantiatedDetections[i]
          ) {
            this.preInstantiatedDetections[i].enabled = false;
          }
        }
      }
    }
  }

  /**
   * Process detections using dynamic scene with on-demand instantiation
   */
  private processDetectionsWithDynamicScene(
    detections: Detection[],
    cameraFrame: Texture,
    depthFrameID: number
  ): void {
    const frameWidth = cameraFrame.getWidth();
    const frameHeight = cameraFrame.getHeight();

    // Process each detection with seamless tracking
    for (let i = 0; i < detections.length; i++) {
      const detection = detections[i];

      // Calculate detection center from bounding box
      const centerX = detection.bbox[0];
      const centerY = detection.bbox[1];

      // Convert normalized coordinates to pixel coordinates
      const pixelX = centerX * frameWidth;
      const pixelY = centerY * frameHeight;
      const centerPixelPos = new vec2(pixelX, pixelY);

      if (this.debug) {
        // Visualize center point
        this.debugVisualizer.visualizeLocalPoint(centerPixelPos, cameraFrame);
        // Visualize bounding box vertices
        print(
          `Visualizing bounding box vertices for detection ${i} (${detection.label})`
        );
        this.debugVisualizer.visualizeBoundingBoxVertices(
          detection.bbox,
          cameraFrame
        );
      }

      // Get world position for the detection center
      const worldPosition = this.depthCache.getWorldPositionWithID(
        centerPixelPos,
        depthFrameID
      );

      if (!worldPosition) {
        print(
          `Detection ${i}: Failed to get world position for pixel (${pixelX.toFixed(
            1
          )}, ${pixelY.toFixed(1)})`
        );

        // If we have an existing instance, keep it stable rather than destroying
        if (i < this.detectionInstances.length && this.detectionInstances[i]) {
          if (this.debug) {
            print(
              `Detection ${i}: Keeping existing instance due to failed world position`
            );
          }
          // Increment stability counter to maintain persistence
          this.detectionStableFrames[i] = Math.min(
            this.detectionStableFrames[i] + 1,
            this.stableFramesRequired
          );
        }
        continue;
      }

      // Calculate bounding box vertices in 3D world space
      const boundingBoxVertices = this.calculateBoundingBoxVertices(
        detection,
        worldPosition,
        cameraFrame,
        depthFrameID
      );

      // Check if we should update this detection (center + vertices)
      const shouldUpdateDetection = this.shouldUpdateSeamlessDetection(
        i,
        worldPosition,
        boundingBoxVertices
      );

      if (!shouldUpdateDetection.updateNeeded) {
        if (this.debug) {
          print(
            `Detection ${i}: No significant changes detected, maintaining current state`
          );
        }
        // Increment stability counter
        this.detectionStableFrames[i] = Math.min(
          this.detectionStableFrames[i] + 1,
          this.stableFramesRequired
        );

        // Update only the text information (category, confidence, distance) but keep positions
        if (i < this.detectionInstances.length && this.detectionInstances[i]) {
          this.updateDetectionContainerTextOnly(
            this.detectionInstances[i],
            detection,
            worldPosition
          );
        }
        continue;
      }

      // Reset stability counter since we're updating
      this.detectionStableFrames[i] = 0;

      // Update stored positions for future comparisons
      this.lastDetectionPositions[i] = worldPosition;
      this.lastDetectionCenters[i] = worldPosition;
      this.lastDetectionVertices[i] = boundingBoxVertices
        ? [...boundingBoxVertices]
        : null;

      // Create or update instance
      let instance: SceneObject;
      if (i < this.detectionInstances.length && this.detectionInstances[i]) {
        // Update existing instance
        instance = this.detectionInstances[i];
        if (shouldUpdateDetection.updateCenter) {
          instance
            .getTransform()
            .setWorldPosition(
              new vec3(worldPosition.x, worldPosition.y, worldPosition.z)
            );
          if (this.debug) {
            print(`Detection ${i}: Updated center position`);
          }
        }
      } else {
        // Create new instance
        instance = this.depthPrefab.instantiate(null);
        instance.name = "DepthDetection_" + i;
        instance.setParent(this.getSceneObject());
        instance
          .getTransform()
          .setWorldPosition(
            new vec3(worldPosition.x, worldPosition.y, worldPosition.z)
          );

        // Disable initially to prevent line from showing with default positions
        instance.enabled = false;

        this.detectionInstances.push(instance);
        if (this.debug) {
          print(`Detection ${i}: Created new instance (initially disabled)`);
        }
      }

      // Update detection container with all information
      this.updateDetectionContainer(
        instance,
        detection,
        worldPosition,
        boundingBoxVertices,
        shouldUpdateDetection.updateVertices
      );

      // Enable the instance after a brief delay to allow polyline to refresh
      if (!instance.enabled) {
        const enableDelayEvent = this.createEvent(
          "DelayedCallbackEvent"
        ) as DelayedCallbackEvent;
        enableDelayEvent.bind(() => {
          if (instance) {
            instance.enabled = true;
            if (this.debug) {
              print(`Detection ${i}: Enabled after delay`);
            }
          }
        });
        enableDelayEvent.reset(0.2); // 200ms delay
      }

      if (this.debug) {
        print(
          `Detection ${i} (${detection.label}): Score ${(
            detection.score * 100
          ).toFixed(1)}%`
        );
        print(
          `  Center: pixel (${pixelX.toFixed(1)}, ${pixelY.toFixed(
            1
          )}) -> normalized (${centerX.toFixed(3)}, ${centerY.toFixed(3)})`
        );
        print(
          `  World position: (${worldPosition.x.toFixed(
            2
          )}, ${worldPosition.y.toFixed(2)}, ${worldPosition.z.toFixed(2)})`
        );
        print(
          `  Updates: center=${shouldUpdateDetection.updateCenter}, vertices=${shouldUpdateDetection.updateVertices}`
        );
      }
    }
  }

  /**
   * Update a static scene detection with smooth lerp transitions
   */
  private updateStaticSceneDetection(
    detectionIndex: number,
    detection: Detection,
    worldPosition: vec3,
    boundingBoxVertices: vec3[]
  ): void {
    // Ensure we have enough pre-instantiated detections
    if (detectionIndex >= this.preInstantiatedDetections.length) {
      if (this.debug) {
        print(
          `Static Scene: Detection index ${detectionIndex} exceeds pre-instantiated detections (${this.preInstantiatedDetections.length})`
        );
      }
      return;
    }

    const instance = this.preInstantiatedDetections[detectionIndex];
    if (!instance) {
      if (this.debug) {
        print(
          `Static Scene: No pre-instantiated detection at index ${detectionIndex}`
        );
      }
      return;
    }

    // Update detection state
    if (detectionIndex >= this.detectionStates.length) {
      // Expand detection states array if needed
      while (this.detectionStates.length <= detectionIndex) {
        this.detectionStates.push({
          isActive: false,
          confidence: 0,
          lastUpdateTime: 0,
          targetPosition: null,
          targetVertices: null,
          targetRotation: null,
          fadeAlpha: 0,
        });
      }
    }

    const state = this.detectionStates[detectionIndex];
    const currentTime = getTime();

    // Determine if we need a new lerp transition
    const needsPositionUpdate =
      !state.targetPosition ||
      state.targetPosition.distance(worldPosition) >
        this.positionUpdateThreshold / 100; // Convert cm to meters

    const needsVertexUpdate =
      !state.targetVertices ||
      !areVerticesSimilar(
        state.targetVertices,
        boundingBoxVertices,
        this.vertexUpdateThreshold
      );

    if (needsPositionUpdate || needsVertexUpdate) {
      // Get current position and vertices for smooth transition
      const currentPosition = instance.getTransform().getWorldPosition();
      const currentVertices = this.getCurrentDetectionVertices(instance);
      const currentRotation = instance.getTransform().getWorldRotation();

      // Start lerp transition
      this.startLerpTransition(
        detectionIndex,
        worldPosition,
        boundingBoxVertices,
        currentRotation // Keep current rotation for now
      );

      if (this.debug) {
        print(
          `Static Scene Detection ${detectionIndex}: Started lerp transition`
        );
        print(
          `  From: (${currentPosition.x.toFixed(
            2
          )}, ${currentPosition.y.toFixed(2)}, ${currentPosition.z.toFixed(2)})`
        );
        print(
          `  To: (${worldPosition.x.toFixed(2)}, ${worldPosition.y.toFixed(
            2
          )}, ${worldPosition.z.toFixed(2)})`
        );
      }
    }

    // Update state
    state.isActive = true;
    state.confidence = detection.score;
    state.lastUpdateTime = currentTime;
    state.targetPosition = worldPosition;
    state.targetVertices = boundingBoxVertices
      ? [...boundingBoxVertices]
      : null;
    state.fadeAlpha = 1.0;

    // Update text information immediately (non-lerped content)
    this.updateDetectionContainerTextOnly(instance, detection, worldPosition);

    // Enable the instance if it's not already
    if (!instance.enabled) {
      instance.enabled = true;
    }
  }

  /**
   * Update the detection container with the latest information
   */
  private updateDetectionContainer(
    detectionInstance: SceneObject,
    detection: Detection,
    worldPosition: vec3,
    boundingBoxVertices?: vec3[],
    updateVertices: boolean = true
  ): void {
    // Get the DetectionContainer component directly using the type name
    const detectionContainer = detectionInstance.getComponent(
      DetectionContainer.getTypeName()
    ) as DetectionContainer;

    if (!detectionContainer) {
      print(
        "Warning: DetectionContainer component not found on detection prefab"
      );
      return;
    }

    // Update category and confidence text
    if (detectionContainer.categoryAndConfidence) {
      const confidencePercent = Math.round(detection.score * 100);
      const labelText = `${
        detection.label || "detection"
      }: ${confidencePercent}%`;
      detectionContainer.categoryAndConfidence.text = labelText;
    } else if (this.debug) {
      print("categoryText not found in DetectionContainer");
    }

    // Update distance from camera text
    if (detectionContainer.distanceFromCamera) {
      const cameraPos = this.camera.getTransform().getWorldPosition();
      const distanceMeters = cameraPos.distance(worldPosition); // Convert to meters
      detectionContainer.distanceFromCamera.text = `${distanceMeters.toFixed(
        2
      )}cm`;
    } else if (this.debug) {
      print("distanceText not found in DetectionContainer");
    }

    // Update polyline points with bounding box vertices only if requested
    if (
      updateVertices &&
      boundingBoxVertices &&
      detectionContainer.polylinePoints &&
      detectionContainer.polylinePoints.length >= 4
    ) {
      for (let i = 0; i < Math.min(4, boundingBoxVertices.length); i++) {
        if (detectionContainer.polylinePoints[i]) {
          detectionContainer.polylinePoints[i]
            .getTransform()
            .setWorldPosition(boundingBoxVertices[i]);
          if (this.debug) {
            print(
              `Updated polyline point ${i} to world position: (${boundingBoxVertices[
                i
              ].x.toFixed(2)}, ${boundingBoxVertices[i].y.toFixed(
                2
              )}, ${boundingBoxVertices[i].z.toFixed(2)})`
            );
          }
        }
      }

      // Refresh the polyline to update the visual representation
      if (detectionContainer.polyline) {
        // Create a delayed event to refresh the polyline after all positions are set
        const delayedRefreshEvent = this.createEvent(
          "DelayedCallbackEvent"
        ) as DelayedCallbackEvent;
        delayedRefreshEvent.bind(() => {
          if (detectionContainer.polyline) {
            detectionContainer.polyline.refreshLine();
            if (this.debug) {
              print("Refreshed polyline after updating vertex positions");
            }
          }
        });
        delayedRefreshEvent.reset(0.1); // 100ms delay
      } else if (this.debug) {
        print("polyline component not found in DetectionContainer");
      }
    } else if (this.debug && !updateVertices) {
      print("Skipping vertex update to maintain stability");
    } else if (this.debug) {
      print("polylinePoints not found or insufficient in DetectionContainer");
    }
  }

  /**
   * Clean up previously instantiated detection objects
   */
  private cleanupDetectionInstances(): void {
    for (const instance of this.detectionInstances) {
      if (instance) {
        instance.destroy();
      }
    }
    this.detectionInstances = [];
    this.lastDetectionPositions = [];
    this.lastDetectionCenters = [];
    this.lastDetectionVertices = [];
    this.detectionStableFrames = [];
  }

  /**
   * Resize all tracking arrays to match the number of current detections
   */
  private resizeTrackingArrays(targetLength: number): void {
    // Clean up excess instances
    while (this.detectionInstances.length > targetLength) {
      const excessInstance = this.detectionInstances.pop();
      if (excessInstance) {
        excessInstance.destroy();
      }
    }

    // Resize all tracking arrays
    const arrays = [
      this.lastDetectionPositions,
      this.lastDetectionCenters,
      this.detectionStableFrames,
    ];

    arrays.forEach((array) => {
      while (array.length > targetLength) {
        array.pop();
      }
      while (array.length < targetLength) {
        array.push(null);
      }
    });

    // Handle 2D vertices array
    while (this.lastDetectionVertices.length > targetLength) {
      this.lastDetectionVertices.pop();
    }
    while (this.lastDetectionVertices.length < targetLength) {
      this.lastDetectionVertices.push(null);
    }
  }

  /**
   * Calculate 3D world positions for bounding box vertices
   */
  private calculateBoundingBoxVertices(
    detection: Detection,
    centerWorldPosition: vec3,
    cameraFrame: Texture,
    depthFrameID: number
  ): vec3[] {
    // bbox format: [centerX, centerY, width, height] (normalized 0-1)
    const centerX = detection.bbox[0];
    const centerY = detection.bbox[1];
    const width = detection.bbox[2];
    const height = detection.bbox[3];

    // Apply bounding box scaling
    const scaledWidth = width * this.boundingBoxScale;
    const scaledHeight = height * this.boundingBoxScale;

    // Calculate half dimensions
    const halfWidth = scaledWidth / 2;
    const halfHeight = scaledHeight / 2;

    // Calculate the 4 corner vertices in normalized coordinates
    // Clamp to ensure they stay within valid range [0, 1]
    const normalizedVertices = [
      new vec2(
        Math.max(0, Math.min(1, centerX - halfWidth)),
        Math.max(0, Math.min(1, centerY - halfHeight))
      ), // top-left
      new vec2(
        Math.max(0, Math.min(1, centerX + halfWidth)),
        Math.max(0, Math.min(1, centerY - halfHeight))
      ), // top-right
      new vec2(
        Math.max(0, Math.min(1, centerX - halfWidth)),
        Math.max(0, Math.min(1, centerY + halfHeight))
      ), // bottom-left
      new vec2(
        Math.max(0, Math.min(1, centerX + halfWidth)),
        Math.max(0, Math.min(1, centerY + halfHeight))
      ), // bottom-right
    ];

    // Convert normalized coordinates to pixel coordinates
    const frameWidth = cameraFrame.getWidth();
    const frameHeight = cameraFrame.getHeight();

    const worldVertices: vec3[] = [];

    if (this.debug) {
      print(
        `Calculating vertices for bbox [${centerX.toFixed(
          3
        )}, ${centerY.toFixed(3)}, ${width.toFixed(3)}, ${height.toFixed(
          3
        )}] with scale ${this.boundingBoxScale.toFixed(2)}`
      );
      print(
        `Scaled dimensions: ${scaledWidth.toFixed(3)} x ${scaledHeight.toFixed(
          3
        )}`
      );
      print(`Frame dimensions: ${frameWidth}x${frameHeight}`);
    }

    for (let i = 0; i < normalizedVertices.length; i++) {
      const normalizedVertex = normalizedVertices[i];
      const pixelPos = new vec2(
        normalizedVertex.x * frameWidth,
        normalizedVertex.y * frameHeight
      );

      if (this.debug) {
        print(
          `Vertex ${i}: normalized (${normalizedVertex.x.toFixed(
            3
          )}, ${normalizedVertex.y.toFixed(3)}) -> pixel (${pixelPos.x.toFixed(
            1
          )}, ${pixelPos.y.toFixed(1)})`
        );
      }

      // Try to get world position for this vertex using depth
      const vertexWorldPosition = this.depthCache.getWorldPositionWithID(
        pixelPos,
        depthFrameID
      );

      if (vertexWorldPosition) {
        worldVertices.push(vertexWorldPosition);
        if (this.debug) {
          print(
            `Vertex ${i}: Got depth-based world position (${vertexWorldPosition.x.toFixed(
              2
            )}, ${vertexWorldPosition.y.toFixed(
              2
            )}, ${vertexWorldPosition.z.toFixed(2)})`
          );
        }
      } else {
        // Fallback: use center depth but calculate X,Y offset
        // Use a much smaller scaling factor based on the detection size and distance
        const distanceFromCamera = centerWorldPosition.distance(
          this.camera.getTransform().getWorldPosition()
        );

        // Scale based on detection size in screen space and distance
        // This is a more realistic scaling that considers the actual bounding box size
        const screenScale = Math.min(scaledWidth, scaledHeight) * 0.5; // Use smaller dimension for conservative scaling
        const worldScale = distanceFromCamera * screenScale * 0.001; // Much smaller factor

        const offsetX = (normalizedVertex.x - centerX) * worldScale;
        const offsetY = (normalizedVertex.y - centerY) * worldScale;

        const fallbackVertex = new vec3(
          centerWorldPosition.x + offsetX,
          centerWorldPosition.y + offsetY,
          centerWorldPosition.z
        );
        worldVertices.push(fallbackVertex);

        if (this.debug) {
          print(
            `Vertex ${i}: Fallback calculation - distance: ${distanceFromCamera.toFixed(
              2
            )}, scale: ${worldScale.toFixed(4)}, offset: (${offsetX.toFixed(
              2
            )}, ${offsetY.toFixed(2)})`
          );
          print(
            `Vertex ${i}: Fallback world position (${fallbackVertex.x.toFixed(
              2
            )}, ${fallbackVertex.y.toFixed(2)}, ${fallbackVertex.z.toFixed(2)})`
          );
        }
      }
    }

    // Align vertices to form a perfect rectangle
    if (worldVertices.length === 4) {
      const alignedVertices = alignVerticesToRectangle(
        worldVertices,
        this.debug
      );
      if (this.debug) {
        print("Aligned vertices to form perfect rectangle");
      }
      return alignedVertices;
    }

    return worldVertices;
  }

  /**
   * Check if camera movement is within acceptable limits
   */
  private isCameraMovementAcceptable(): boolean {
    if (!this.camera) {
      return true; // If no camera, allow updates
    }

    const currentTime = getTime();
    const currentPosition = this.camera.getTransform().getWorldPosition();
    const currentRotation = this.camera.getTransform().getWorldRotation();

    // Skip check on first run
    if (this.lastUpdateTime === 0) {
      this.lastCameraPosition = currentPosition;
      this.lastCameraRotation = currentRotation;
      this.lastUpdateTime = currentTime;
      return true;
    }

    const deltaTime = currentTime - this.lastUpdateTime;
    if (deltaTime <= 0) {
      return true; // Avoid division by zero
    }

    // Check position movement speed
    const positionDelta = currentPosition.distance(this.lastCameraPosition);
    const positionSpeed = (positionDelta * 100) / deltaTime; // Convert to cm/second

    // Check rotation speed
    const rotationDelta = quat.angleBetween(
      currentRotation,
      this.lastCameraRotation
    );
    const rotationSpeed = (rotationDelta * 180) / Math.PI / deltaTime; // Convert to degrees/second

    // Update tracking values
    this.lastCameraPosition = currentPosition;
    this.lastCameraRotation = currentRotation;
    this.lastUpdateTime = currentTime;

    const positionAcceptable = positionSpeed <= this.maxCameraMovementSpeed;
    const rotationAcceptable = rotationSpeed <= this.maxCameraRotationSpeed;

    if (this.debug && (!positionAcceptable || !rotationAcceptable)) {
      print(
        `Camera movement too fast - Position: ${positionSpeed.toFixed(
          1
        )} cm/s (max: ${
          this.maxCameraMovementSpeed
        }), Rotation: ${rotationSpeed.toFixed(1)} deg/s (max: ${
          this.maxCameraRotationSpeed
        })`
      );
    }

    return positionAcceptable && rotationAcceptable;
  }

  /**
   * Check if the detection position has changed enough to warrant an update
   */
  private shouldUpdateDetectionPosition(
    detectionIndex: number,
    newPosition: vec3
  ): boolean {
    // If we don't have a previous position, always update
    if (!this.lastDetectionPositions[detectionIndex]) {
      return true;
    }

    const lastPosition = this.lastDetectionPositions[detectionIndex];
    const distanceChanged = newPosition.distance(lastPosition) * 100; // Convert to cm

    const shouldUpdate = distanceChanged >= this.positionUpdateThreshold;

    if (this.debug && !shouldUpdate) {
      print(
        `Detection ${detectionIndex}: Distance changed ${distanceChanged.toFixed(
          1
        )}cm (threshold: ${this.positionUpdateThreshold}cm)`
      );
    }

    return shouldUpdate;
  }

  /**
   * Enhanced detection update check considering both center and vertices
   */
  private shouldUpdateSeamlessDetection(
    detectionIndex: number,
    newCenter: vec3,
    newVertices: vec3[]
  ): { updateNeeded: boolean; updateCenter: boolean; updateVertices: boolean } {
    // If this is a new detection, always update
    if (!this.lastDetectionCenters[detectionIndex]) {
      return { updateNeeded: true, updateCenter: true, updateVertices: true };
    }

    const lastCenter = this.lastDetectionCenters[detectionIndex];
    const lastVertices = this.lastDetectionVertices[detectionIndex];

    // Check center movement
    const centerDistanceChanged = newCenter.distance(lastCenter) * 100; // Convert to cm
    const shouldUpdateCenter =
      centerDistanceChanged >= this.positionUpdateThreshold;

    // Check vertices movement
    let shouldUpdateVertices = false;
    if (
      newVertices &&
      lastVertices &&
      newVertices.length === lastVertices.length
    ) {
      for (let i = 0; i < newVertices.length; i++) {
        const vertexDistanceChanged =
          newVertices[i].distance(lastVertices[i]) * 100; // Convert to cm
        if (vertexDistanceChanged >= this.vertexUpdateThreshold) {
          shouldUpdateVertices = true;
          break;
        }
      }
    } else {
      // If we don't have previous vertices or count differs, update
      shouldUpdateVertices = true;
    }

    const updateNeeded = shouldUpdateCenter || shouldUpdateVertices;

    if (this.debug && !updateNeeded) {
      print(
        `Detection ${detectionIndex}: Center Δ ${centerDistanceChanged.toFixed(
          1
        )}cm (threshold: ${
          this.positionUpdateThreshold
        }cm), Vertices stable: ${!shouldUpdateVertices}`
      );
    }

    return {
      updateNeeded,
      updateCenter: shouldUpdateCenter,
      updateVertices: shouldUpdateVertices,
    };
  }

  /**
   * Update only text information without changing positions
   */
  private updateDetectionContainerTextOnly(
    detectionInstance: SceneObject,
    detection: Detection,
    worldPosition: vec3
  ): void {
    const detectionContainer = detectionInstance.getComponent(
      DetectionContainer.getTypeName()
    ) as DetectionContainer;

    if (!detectionContainer) {
      return;
    }

    // Update category and confidence text
    if (detectionContainer.categoryAndConfidence) {
      const confidencePercent = Math.round(detection.score * 100);
      const labelText = `${
        detection.label || "detection"
      }: ${confidencePercent}%`;
      detectionContainer.categoryAndConfidence.text = labelText;
    }

    // Update distance from camera text
    if (detectionContainer.distanceFromCamera) {
      const cameraPos = this.camera.getTransform().getWorldPosition();
      const distanceMeters = cameraPos.distance(worldPosition);
      detectionContainer.distanceFromCamera.text = `${distanceMeters.toFixed(
        2
      )}cm`;
    }
  }

  /**
   * Initialize static scene with pre-instantiated prefabs
   */
  private initializeStaticScene(): void {
    if (!this.enableStaticScene || !this.depthPrefab) {
      return;
    }

    // Pre-instantiate detection prefabs
    for (let i = 0; i < this.maxDetections; i++) {
      const instance = this.depthPrefab.instantiate(this.getSceneObject());
      if (instance) {
        instance.enabled = false; // Start disabled
        this.preInstantiatedDetections.push(instance);

        // Initialize detection state
        this.detectionStates.push({
          isActive: false,
          confidence: 0,
          lastUpdateTime: 0,
          targetPosition: null,
          targetVertices: null,
          targetRotation: null,
          fadeAlpha: 0,
        });
      }
    }

    if (this.debug) {
      print(
        `Static scene initialized with ${this.preInstantiatedDetections.length} pre-instantiated prefabs`
      );
    }
  }

  /**
   * Start a smooth lerp transition for a detection
   */
  private startLerpTransition(
    detectionIndex: number,
    newPosition: vec3,
    newVertices: vec3[] | null,
    newRotation: quat | null = null
  ): void {
    if (
      !this.enableStaticScene ||
      detectionIndex >= this.preInstantiatedDetections.length
    ) {
      return;
    }

    const instance = this.preInstantiatedDetections[detectionIndex];
    const state = this.detectionStates[detectionIndex];

    if (!instance || !state) {
      return;
    }

    // Get current transform values
    const transform = instance.getTransform();
    const currentPosition = transform.getWorldPosition();
    const currentRotation = transform.getWorldRotation();

    // Create or update lerp state
    const lerpState: LerpState = {
      startPosition: new vec3(
        currentPosition.x,
        currentPosition.y,
        currentPosition.z
      ),
      targetPosition: new vec3(newPosition.x, newPosition.y, newPosition.z),
      startVertices: this.getCurrentDetectionVertices(instance),
      targetVertices: newVertices ? [...newVertices] : [],
      startRotation: new quat(
        currentRotation.w,
        currentRotation.x,
        currentRotation.y,
        currentRotation.z
      ),
      targetRotation: newRotation
        ? new quat(newRotation.w, newRotation.x, newRotation.y, newRotation.z)
        : currentRotation,
      startTime: getTime(),
      duration: this.lerpDuration,
      detectionIndex: detectionIndex,
    };

    this.activeLerps.set(detectionIndex, lerpState);

    // Enable instance if not already active
    if (!instance.enabled) {
      instance.enabled = true;
    }

    // Update state
    state.isActive = true;
    state.targetPosition = newPosition;
    state.targetVertices = newVertices;
    state.targetRotation = newRotation;
    state.lastUpdateTime = getTime();

    if (this.debug) {
      print(
        `Started lerp transition for detection ${detectionIndex} (duration: ${this.lerpDuration}s)`
      );
    }
  }

  /**
   * Update all active lerp transitions
   */
  private updateLerpTransitions(): void {
    if (!this.enableStaticScene) {
      return;
    }

    const currentTime = getTime();
    const completedLerps: number[] = [];

    this.activeLerps.forEach((lerpState, detectionIndex) => {
      const instance = this.preInstantiatedDetections[detectionIndex];
      if (!instance || !instance.enabled) {
        completedLerps.push(detectionIndex);
        return;
      }

      const elapsedTime = currentTime - lerpState.startTime;
      const progress = Math.min(elapsedTime / lerpState.duration, 1.0);
      const easedProgress = easeOutCubic(progress);

      // Lerp position
      const currentPos = lerpVec3(
        lerpState.startPosition,
        lerpState.targetPosition,
        easedProgress
      );
      instance.getTransform().setWorldPosition(currentPos);

      // Lerp rotation if enabled
      if (this.enableRotationLerp && lerpState.targetRotation) {
        const rotationProgress = Math.min(
          elapsedTime / this.rotationLerpDuration,
          1.0
        );
        const easedRotationProgress = easeOutCubic(rotationProgress);
        const currentRot = quat.slerp(
          lerpState.startRotation,
          lerpState.targetRotation,
          easedRotationProgress
        );
        instance.getTransform().setWorldRotation(currentRot);
      }

      // Lerp vertices if available
      if (
        lerpState.startVertices.length > 0 &&
        lerpState.targetVertices.length > 0 &&
        lerpState.startVertices.length === lerpState.targetVertices.length
      ) {
        const vertexProgress = Math.min(
          elapsedTime / this.vertexLerpDuration,
          1.0
        );
        const easedVertexProgress = easeOutCubic(vertexProgress);
        const interpolatedVertices: vec3[] = [];
        for (let i = 0; i < lerpState.startVertices.length; i++) {
          const interpolatedVertex = lerpVec3(
            lerpState.startVertices[i],
            lerpState.targetVertices[i],
            easedVertexProgress
          );
          interpolatedVertices.push(interpolatedVertex);
        }
        // Always update the prefab's polyline points every frame
        this.updateDetectionVertices(instance, interpolatedVertices);
        // Also refresh the polyline if available
        const detectionContainer = instance.getComponent(
          DetectionContainer.getTypeName()
        ) as DetectionContainer;
        if (detectionContainer && detectionContainer.polyline) {
          detectionContainer.polyline.refreshLine();
        }
      }

      // Check if transition is complete
      if (progress >= 1.0) {
        completedLerps.push(detectionIndex);
      }
    });

    // Clean up completed lerps
    completedLerps.forEach((detectionIndex) => {
      this.activeLerps.delete(detectionIndex);
      if (this.debug) {
        print(`Completed lerp transition for detection ${detectionIndex}`);
      }
    });
  }

  /**
   * Get current vertices from a detection instance
   */
  private getCurrentDetectionVertices(instance: SceneObject): vec3[] {
    const detectionContainer = instance.getComponent(
      DetectionContainer.getTypeName()
    ) as DetectionContainer;
    if (!detectionContainer || !detectionContainer.polylinePoints) {
      return [];
    }

    const vertices: vec3[] = [];
    for (let i = 0; i < detectionContainer.polylinePoints.length; i++) {
      const vertex = detectionContainer.polylinePoints[i];
      if (vertex) {
        const pos = vertex.getTransform().getWorldPosition();
        vertices.push(new vec3(pos.x, pos.y, pos.z));
      }
    }
    return vertices;
  }

  /**
   * Update vertices in detection container
   */
  private updateDetectionVertices(
    instance: SceneObject,
    vertices: vec3[]
  ): void {
    const detectionContainer = instance.getComponent(
      DetectionContainer.getTypeName()
    ) as DetectionContainer;
    if (!detectionContainer || !detectionContainer.polylinePoints) {
      return;
    }

    const minLength = Math.min(
      vertices.length,
      detectionContainer.polylinePoints.length
    );
    for (let i = 0; i < minLength; i++) {
      const vertexObject = detectionContainer.polylinePoints[i];
      if (vertexObject) {
        vertexObject.getTransform().setWorldPosition(vertices[i]);
      }
    }
  }

  /**
   * Clean up all active lerp transitions
   */
  private cleanupLerpTransitions(): void {
    this.activeLerps.clear();

    if (this.enableStaticScene) {
      this.detectionStates.forEach((state) => {
        state.isActive = false;
        state.fadeAlpha = 0;
      });

      this.preInstantiatedDetections.forEach((instance) => {
        if (instance) {
          instance.enabled = false;
        }
      });
    }
  }

  onDestroy() {
    this.cleanupDetectionInstances();
    this.cleanupLerpTransitions();
  }
}
