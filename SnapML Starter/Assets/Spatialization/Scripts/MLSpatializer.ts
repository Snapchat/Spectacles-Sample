import { Detection } from "./DetectionHelpers";
import { YOLODetectionProcessor } from "./YOLODetectionProcessor";
import NativeLogger from "SpectaclesInteractionKit.lspkg/Utils/NativeLogger";

const Events = require("../../Multi-Object Detection [Modified]/Scripts/Modules/EventModule");

// Create a logger instance for this class
const log = new NativeLogger("MLSpatializer");

/**
 * Main entry point for ML-based object detection processing
 * Handles YOLO model inference and detection parsing only
 * Use WorldQueryModuleSpatializer for 3D spatialization
 */
@component
export class MLSpatializer extends BaseScriptComponent {
  @input
  @hint("ONNX model asset")
  model: MLAsset;

  @input
  @hint("Input texture for the model (Device Camera Texture)")
  inputTexture: Texture;

  @input
  @hint("Maximum number of objects to detect and place")
  @widget(new SliderWidget(1, 20, 1))
  maxDetectionCount: number = 5;

  @input
  @hint("Time in seconds to keep detections after they disappear")
  @widget(new SliderWidget(0, 5, 0.1))
  detectionPersistence: number = 0.5;

  @input
  @hint(
    "Score threshold for detections (0-1) - Lower values make it more sensitive to detections"
  )
  @widget(new SliderWidget(0, 1, 0.01))
  scoreThreshold: number = 0.2;

  @input
  @hint(
    "IOU threshold for non-maximum suppression (0-1)- Non-Maximum Suppression (NMS) is a technique used in object detection to remove redundant bounding boxes for the same object. Higher threshold (e.g., 0.8-0.9): More permissive - allows more overlapping boxes to remain - Lower threshold (e.g., 0.3-0.5): More strict - removes more overlapping boxes"
  )
  @widget(new SliderWidget(0, 1, 0.01))
  iouThreshold: number = 0.5;

  @input
  @hint("Class labels")
  classLabels: string[] = ["Chair", "Table", "Sofa"];

  @input
  @hint("Enable all classes by default")
  enableAllClasses: boolean = true;

  @input
  @hint("Enable callbacks for detection updates")
  enableCallbacks: boolean = false;

  @input
  @hint("Log detection results to console")
  debugLogging: boolean = false;

  @input
  @hint("Text component to display logs")
  logText: Text;

  @input
  @hint("Center threshold (0-1) - Higher values exclude more detections from edges")
  @widget(new SliderWidget(0, 1, 0.01))
  centerThreshold: number = 0.5;



  private detectionTimestamps: number[] = [];
  private mlComponent: MLComponent;
  private outputs: OutputPlaceholder[];
  private inputs: InputPlaceholder[];
  private onDetectionsUpdated = new Events.EventWrapper();
  private isInitialized: boolean = false;
  private initAttempts: number = 0;
  private maxInitAttempts: number = 5;
  private delayedInitEvent: DelayedCallbackEvent;
  private isRunning: boolean = false;

  // Modular components
  private yoloProcessor: YOLODetectionProcessor;

  // Monitor detection callback system for SmartTether
  @input
  @hint("Callbacks for monitor detection state changes")
  public monitorDetectionCallbacks: any[] = [];

  @input
  @hint("Callbacks for monitor detection state changes")
  public monitorDetectedFunctions: string[] = [];

  @input
  @hint("Callbacks for monitor detection state changes")
  public monitorLostFunctions: string[] = [];

  private lastMonitorDetectionState: boolean = false;

  onAwake(): void {
    log.d("MLSpatializer: onAwake called");
    this.logMessage("MLSpatializer initializing...");

    // Create the delayed callback event
    this.delayedInitEvent = this.createEvent("DelayedCallbackEvent");
    this.delayedInitEvent.bind(() => this.delayedInitialize());

    // Wait for scene start event to ensure components are registered
    this.createEvent("OnStartEvent").bind(() => {
      // Initialize with a slight delay
      this.delayedInitEvent.reset(1.0); // 1 second delay
    });
  }

  /**
   * Attempt initialization with a delay and retries
   */
  private delayedInitialize(): void {
    this.initAttempts++;

    if (this.initAttempts < this.maxInitAttempts) {
      this.logMessage(
        `Starting initialization attempt ${this.initAttempts}/${this.maxInitAttempts}...`
      );
      this.initialize();
    } else {
      this.logMessage(
        `Failed to initialize after ${this.maxInitAttempts} attempts`
      );
      log.e(`Failed to initialize after ${this.maxInitAttempts} attempts`);
    }
  }

  /**
   * Initialize the component
   */
  private initialize(): void {
    this.logMessage("Starting MLSpatializer initialization...");
    this.continueInitialization();
  }

  /**
   * Continue initialization
   */
  private continueInitialization(): void {
    try {
      // Initialize YOLO processor
      this.yoloProcessor = new YOLODetectionProcessor(
        this.classLabels,
        this.scoreThreshold,
        this.iouThreshold,
        this.debugLogging
      );

      // Initialize ML component
      this.initML();

      this.isInitialized = true;
      this.logMessage("MLSpatializer ready");
    } catch (e) {
      this.logMessage("Error during initialization: " + e);
      log.e("Error during initialization: " + e);
    }
  }

  /**
   * Create ML component
   */
  private initML(): void {
    if (!this.model) {
      print("Error, please set ML Model asset input");
      return;
    }

    this.mlComponent = this.getSceneObject().createComponent("MLComponent");
    this.mlComponent.model = this.model;
    this.mlComponent.onLoadingFinished = () => this.onLoadingFinished();
    this.mlComponent.inferenceMode = MachineLearning.InferenceMode.Accelerator;
    this.mlComponent.build([]);
  }

  // START 



public getMLOutputs(): OutputPlaceholder[] {
  return this.outputs;
}

/**
 * Get the YOLO processor for external use
 */
public getYOLOProcessor(): YOLODetectionProcessor {
  return this.yoloProcessor;
}

/**
 * Get the latest detections processed by this spatializer
 */
public getLatestDetections(): Detection[] {
  if (!this.yoloProcessor || !this.outputs) {
    return [];
  }
  
  try {
    // Process YOLO outputs to get raw detections
    const detections = this.yoloProcessor.parseYolo7Outputs(this.outputs);
    
    // Apply the same filtering used internally
    return this.filterDetectionsByCenter(detections);
  } catch (e) {
    if (this.debugLogging) {
      this.logMessage("Error getting latest detections: " + e);
    }
    return [];
  }
}

/**
 * Get raw unfiltered detections (for debugging purposes)
 */
public getRawDetections(): Detection[] {
  if (!this.yoloProcessor || !this.outputs) {
    return [];
  }
  
  try {
    // Process YOLO outputs to get raw detections without filtering
    return this.yoloProcessor.parseYolo7Outputs(this.outputs);
  } catch (e) {
    if (this.debugLogging) {
      this.logMessage("Error getting raw detections: " + e);
    }
    return [];
  }
}

  // END 

  

  /**
   * Configure inputs and outputs, start running ML component
   */
  private onLoadingFinished(): void {
    this.outputs = this.mlComponent.getOutputs();
    this.inputs = this.mlComponent.getInputs();

    this.printInfo("Model built");

    // Initialize YOLO processor with model inputs/outputs
    this.yoloProcessor.initialize(this.outputs, this.inputs);

    // Assign input texture
    this.inputs[0].texture = this.inputTexture;

    // Log input texture assignment
    if (this.debugLogging) {
      if (this.inputTexture) {
        this.logMessage(
          `Assigned input texture: ${this.inputTexture.name || "unnamed"}`
        );
      } else {
        this.logMessage("Warning: No input texture assigned");
      }
    }

    // Run on update
    this.mlComponent.runScheduled(
      true,
      MachineLearning.FrameTiming.Update,
      MachineLearning.FrameTiming.Update
    );

    // Process outputs on script update (after ml update)
    this.createEvent("UpdateEvent").bind((eventData) =>
      this.onUpdate(eventData)
    );
  }

  /**
   * Process outputs on each update
   */
  private onUpdate(eventData: any): void {
    if (this.isRunning || !this.isInitialized) {
      return;
    }

    this.isRunning = true;

    try {
      // Process YOLO outputs
      const detections = this.yoloProcessor.parseYolo7Outputs(this.outputs);

      // Filter detections based on center threshold
      const filteredDetections = this.filterDetectionsByCenter(detections);

      this.onRunningFinished(filteredDetections);
    } catch (e) {
      log.e("Error processing ML output: " + e);
      this.logMessage("Error: ML processing failed: " + e);
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Filter detections based on their distance from center of screen
   * Detections too far from center will be excluded
   */
  private filterDetectionsByCenter(detections: Detection[]): Detection[] {
    if (this.centerThreshold <= 0) {
      return detections; // No filtering needed
    }

    return detections.filter(detection => {
      // Get center coordinates (0-1)
      const centerX = detection.bbox[0];
      const centerY = detection.bbox[1];

      // Calculate distance from center of screen (0.5, 0.5)
      // Normalize to 0-1 range where 0 is center and 1 is corner
      const distanceX = Math.abs(centerX - 0.5) * 2; // 0 at center, 1 at edges
      const distanceY = Math.abs(centerY - 0.5) * 2; // 0 at center, 1 at edges

      // Use the maximum of the two distances as our metric
      const maxDistance = Math.max(distanceX, distanceY);

      // Keep detection if distance is less than threshold
      const shouldKeep = maxDistance < this.centerThreshold;

      if (this.debugLogging && !shouldKeep) {
        log.d(`Filtered out detection at (${centerX.toFixed(2)}, ${centerY.toFixed(2)}) with distance ${maxDistance.toFixed(2)} > threshold ${this.centerThreshold}`);
      }

      return shouldKeep;
    });
  }

  /**
   * Process ML results and log detections
   */
  private onRunningFinished(detections: Detection[]): void {
    // Log detection results if debug is enabled
    if (this.debugLogging) {
      if (detections.length === 0) {
        print("[MLSpatializer] No objects detected");

        // Only log this message occasionally to avoid spamming
        if (Math.random() < 0.05) {
          // ~5% of frames
          this.logMessage(
            "TIP: If you're sure objects should be detected, try these troubleshooting steps:"
          );
          this.logMessage(
            "1. Point camera at clear examples of objects to detect"
          );
          this.logMessage(
            "2. Lower scoreThreshold in inspector (try 0.2 or 0.1)"
          );
          this.logMessage("3. Ensure all classes are enabled");
          this.logMessage("4. Check input texture is correctly assigned");
        }
      } else {
        print(`[MLSpatializer] Detected ${detections.length} objects:`);
        detections.forEach((detection, index) => {
          if (index < 5) {
            // Limit to first 5 detections to avoid console spam
            print(
              `  - ${detection.label}: ${Math.round(
                detection.score * 100
              )}% confidence at [${detection.bbox[0].toFixed(
                2
              )}, ${detection.bbox[1].toFixed(2)}]`
            );
          }
        });
        if (detections.length > 5) {
          print(`  - ... and ${detections.length - 5} more`);
        }

        // Update log text with current detection info
        this.logMessage(
          `Detected ${detections.length
          } objects. Highest confidence: ${Math.round(
            detections[0].score * 100
          )}% (${detections[0].label})`
        );
      }
    }

    // Update detection timestamps for persistence tracking
    const currentTime = getTime();
    for (let i = 0; i < Math.min(detections.length, this.maxDetectionCount); i++) {
      this.detectionTimestamps[i] = currentTime;
    }

    // Emit the onDetectionsUpdated event with the result
    this.onDetectionsUpdated.trigger(detections);

    if (this.enableCallbacks){
      // Handle monitor detection callbacks
    this.handleMonitorDetectionCallbacks(detections.length > 0);
    }
  
  }

  /**
   * Handle callbacks for monitor detection state changes
   * This is used by SmartTether to know when a monitor is detected or lost
   */
  private handleMonitorDetectionCallbacks(isMonitorDetected: boolean): void {
    // Only trigger callbacks when the state changes
    if (isMonitorDetected !== this.lastMonitorDetectionState) {
      this.lastMonitorDetectionState = isMonitorDetected;

      if (this.debugLogging) {
        this.logMessage(`Monitor detection state changed to: ${isMonitorDetected ? "detected" : "lost"}`);
      }

      // Call the appropriate callbacks
      for (let i = 0; i < this.monitorDetectionCallbacks.length; i++) {
        try {
          const callback = this.monitorDetectionCallbacks[i];
          const functionName = isMonitorDetected ?
            this.monitorDetectedFunctions[i] :
            this.monitorLostFunctions[i];

          if (callback && typeof callback[functionName] === "function") {
            callback[functionName]();
          }
        } catch (e) {
          log.e(`Error calling monitor detection callback: ${e}`);
        }
      }
    }
  }

  /**
   * Print debug info if enabled
   */
  private printInfo(msg: string): void {
    if (this.debugLogging) {
      print(msg);
    }
  }

  /**
   * Update the log text component
   */
  private logMessage(message: string): void {
    if (this.logText) {
      this.logText.text = message;
    }

    if (this.debugLogging) {
      print("MLSpatializer: " + message);
    }
  }

  /**
   * Public method to get the onDetectionsUpdated event
   */
  public getDetectionsUpdatedEvent(): any {
    return this.onDetectionsUpdated;
  }

  onDestroy(): void {
    // Clean up resources - no spatialization components to clean up
    this.detectionTimestamps = [];
  }
}