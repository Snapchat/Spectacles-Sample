import {RectangleButton} from "SpectaclesUIKit.lspkg/Scripts/Components/Button/RectangleButton"
import {Switch} from "SpectaclesUIKit.lspkg/Scripts/Components/Switch/Switch"
import {createClient} from "SupabaseClient.lspkg/supabase-snapcloud"
import {CameraService} from "../../../CompositeCameraModified/Scripts/CameraService"
import {SnapCloudRequirements} from "./SnapCloudRequirements"

/**
 * VideoCaptureUploader - Captures frames from Spectacles camera and uploads to Supabase storage
 *
 * CAMERA SETUP:
 * - Assign CameraService reference to use the shared camera (RECOMMENDED - avoids conflicts)
 * - Or leave empty to request own camera (may conflict with CameraService)
 *
 * OPTIMIZED CAPTURE PIPELINE:
 * 1. DURING RECORDING: Only encode to base64 strings (lightweight, ~15KB each)
 * 2. AFTER RECORDING: Convert base64 → binary (heavy work deferred)
 * 3. THEN UPLOAD: Upload all frames to Supabase
 *
 * PERFORMANCE SETTINGS:
 * - captureFrameRate: Target FPS (set to 0 for max camera rate via onNewFrame)
 * - useHighQuality: false = smaller files, faster processing
 */
@component
export class VideoCaptureUploader extends BaseScriptComponent {
  // Core Modules (only used as fallback if CameraService not provided)
  private cameraModule: CameraModule = require("LensStudio:CameraModule")

  // Supabase Configuration
  @input
  @hint("Reference to SnapCloudRequirements for centralized Supabase configuration")
  public snapCloudRequirements: SnapCloudRequirements

  @input
  @hint("Supabase Storage bucket name for video frames")
  public storageBucket: string = "specs-bucket"

  // Camera Configuration - USE CameraService to avoid conflicts!
  @input
  @hint("Reference to CameraService (RECOMMENDED). Uses its camera to avoid multiple camera requests.")
  @allowUndefined
  public cameraService: CameraService

  // Fallback camera ID (only used if CameraService not provided)
  private cameraIdToUse: CameraModule.CameraId = CameraModule.CameraId.Default_Color

  // ===== PERFORMANCE SETTINGS =====
  @input
  @hint("Target FPS for capture. Set to 0 for MAX rate (captures every camera frame via onNewFrame)")
  @widget(new SliderWidget(0, 30, 1))
  public captureFrameRate: number = 0 // Default to MAX for best results

  @input
  @hint("JPEG quality (lower = smaller files, faster uploads). Low recommended for video.")
  public useHighQuality: boolean = false

  @input
  @hint("Maximum recording duration in seconds")
  @widget(new SliderWidget(1, 60, 1))
  public maxRecordingDuration: number = 30

  // Composite Texture Configuration
  @input
  @hint("Default value for composite mode (can be toggled via Switch)")
  public useCompositeTexture: boolean = false

  @input
  @hint("Pre-composed texture (with AR content) - used when useCompositeTexture is enabled")
  @allowUndefined
  public compositeTexture: Texture

  // UI Components
  @input
  @hint("Button to start/stop recording")
  public recordButton: RectangleButton

  @input
  @hint("Switch to toggle between camera and composite capture mode")
  @allowUndefined
  public compositeSwitch: Switch

  @input
  @hint("Text component to display status")
  @allowUndefined
  public statusText: Text

  @input
  @hint("Text component to display button state (Start/Stop)")
  @allowUndefined
  public buttonText: Text

  @input
  @hint("Image component to display captured frame preview")
  @allowUndefined
  public previewImage: Image

  // Debug Configuration
  @input
  @hint("Enable detailed debug logging (disable for better performance)")
  public enableDebugLogs: boolean = false

  // Private State - Camera
  private cameraTexture: Texture
  private cameraTextureProvider: CameraTextureProvider
  private isCameraReady: boolean = false

  // Private State - Recording
  private isRecording: boolean = false
  private isUploadingSession: boolean = false // Prevents new recording while uploading
  private sessionId: string = ""
  private frameCount: number = 0
  private recordingStartTime: number = 0
  private lastCaptureTime: number = 0
  private captureIntervalMs: number = 200
  private maxDurationEvent: DelayedCallbackEvent

  // Frame capture - using onNewFrame for accurate camera frame timing
  private frameRegistration: any = null // Registration for onNewFrame callback

  // Performance tracking
  private activeEncodes: number = 0
  private framesSkipped: number = 0
  private uploadedCount: number = 0
  private textureZeroCount: number = 0 // Track 0x0 texture occurrences
  private encodeFailCount: number = 0 // Track encoding failures

  // OPTIMIZED: Store base64 strings during recording (lightweight)
  // Convert to binary AFTER recording (heavy operation deferred)
  private base64Queue: Array<{frameNumber: number; base64: string; timestamp: number}> = []

  // Upload queue (frames ready for upload - binary data)
  private uploadQueue: Array<{frameNumber: number; data: Uint8Array; timestamp: number}> = []

  // Authentication tracking
  private supabaseClient: any
  private uid: string
  private isAuthenticated: boolean = false

  onAwake() {
    this.log("VideoCaptureUploader initializing...")

    // Validate requirements
    if (!this.snapCloudRequirements) {
      this.logError("SnapCloudRequirements not configured! Please assign in Inspector.")
      return
    }

    // Calculate capture interval (0 = max rate, capture every frame)
    if (this.captureFrameRate <= 0) {
      this.captureIntervalMs = 0
      this.log(`Frame rate: MAX (capture every rendered frame)`)
    } else {
      this.captureIntervalMs = 1000 / this.captureFrameRate
      this.log(`Frame rate: ${this.captureFrameRate} FPS (${this.captureIntervalMs.toFixed(1)}ms interval)`)
    }
    this.log(`Quality: ${this.useHighQuality ? "HIGH" : "LOW (faster)"}`)
    this.log(`Mode: onNewFrame capture, deferred processing`)

    // Initialize on start - button/switch initialization must happen after components are awake
    this.createEvent("OnStartEvent").bind(() => {
      this.setupUIHandlers()
      this.initializeSupabaseAuthentication()
    })

    // Cleanup on destroy
    this.createEvent("OnDestroyEvent").bind(() => {
      this.cleanup()
    })

    this.updateStatus("Ready to record")
    this.updateButtonText()
  }

  /**
   * Setup UI button and switch handlers - must be called after components are awake
   */
  private setupUIHandlers() {
    // Setup button handler - call initialize() first to ensure events are ready
    if (this.recordButton) {
      this.recordButton.initialize()
      this.recordButton.onTriggerUp.add(() => {
        this.onRecordButtonPressed()
      })
      this.log(" Record button handler registered")
    }

    // Setup composite mode switch handler - call initialize() first
    if (this.compositeSwitch) {
      this.compositeSwitch.initialize()
      this.compositeSwitch.onValueChange.add((value) => {
        const isComposite = value === 1
        this.log(`Composite switch changed to: ${isComposite}`)
        this.useCompositeTexture = isComposite
      })
      this.log(`Composite switch initialized (default: ${this.useCompositeTexture})`)
    }
  }

  /**
   * Initialize Supabase authentication
   */
  private async initializeSupabaseAuthentication() {
    this.log("=== AUTHENTICATION START ===")

    if (!this.snapCloudRequirements || !this.snapCloudRequirements.isConfigured()) {
      this.logError("SnapCloudRequirements not configured")
      return
    }

    const supabaseProject = this.snapCloudRequirements.getSupabaseProject()
    this.log(`Supabase URL: ${supabaseProject.url}`)

    // Create Supabase client
    const options = {
      realtime: {
        heartbeatIntervalMs: 2500
      }
    }

    this.supabaseClient = createClient(supabaseProject.url, supabaseProject.publicToken, options)

    this.log("Supabase client created")

    if (this.supabaseClient) {
      await this.signInUser()
    }

    this.log("=== AUTHENTICATION END ===")
    this.log(`Final authentication status: ${this.isAuthenticated ? "AUTHENTICATED" : "NOT AUTHENTICATED"}`)

    // Initialize camera after authentication
    this.initializeCamera()
  }

  /**
   * Sign in user using Snap Cloud authentication (with retry logic)
   */
  private async signInUser(retryCount: number = 0): Promise<boolean> {
    const maxRetries = 3
    this.log(`Attempting Snap Cloud authentication... (attempt ${retryCount + 1}/${maxRetries + 1})`)

    try {
      const {data, error} = await this.supabaseClient.auth.signInWithIdToken({
        provider: "snapchat",
        token: ""
      })

      if (error) {
        this.logError("Sign in error: " + JSON.stringify(error))

        // Check for existing session
        try {
          const {data: sessionData} = await this.supabaseClient.auth.getSession()
          if (sessionData?.session?.user?.id) {
            this.uid = sessionData.session.user.id
            this.isAuthenticated = true
            this.log(` Found existing session for user: ${this.uid}`)
            return true
          }
        } catch (sessionError) {
          this.log("No existing session found")
        }

        // Retry on retryable errors
        if (retryCount < maxRetries && (error.name === "AuthRetryableFetchError" || error.status === 0)) {
          const delaySeconds = error.status === 0 ? 1.0 : 0.5
          this.log(`Retrying authentication in ${delaySeconds}s...`)
          await this.delay(delaySeconds)
          return await this.signInUser(retryCount + 1)
        }

        this.isAuthenticated = false
        return false
      } else {
        const {user, session} = data
        if (user?.id) {
          this.uid = user.id
          this.isAuthenticated = true
          this.log(` Authenticated as user: ${this.uid}`)
          this.log(`Session exists: ${session ? "YES" : "NO"}`)
          return true
        } else {
          this.logError("User ID not found in authentication response")
          this.isAuthenticated = false
          return false
        }
      }
    } catch (error) {
      this.logError(`Authentication exception: ${error}`)

      if (retryCount < maxRetries) {
        this.log(`Retrying authentication in 1s...`)
        await this.delay(1.0)
        return await this.signInUser(retryCount + 1)
      }

      this.isAuthenticated = false
      return false
    }
  }

  /**
   * Initialize camera - requests camera directly for capture
   * Note: For AR content, use the composite texture option instead
   */
  private initializeCamera() {
    try {
      this.log("Initializing camera...")

      // PREFERRED: Use CameraService's camera (avoids conflicts)
      if (this.cameraService) {
        this.log(" Using CameraService's camera (no conflicts)")

        this.cameraTexture = this.cameraService.cameraTexture
        this.cameraTextureProvider = this.cameraService.cameraTextureProvider

        if (!this.cameraTexture) {
          this.logError("CameraService camera texture not available yet - it may not have initialized")
          this.updateStatus("Waiting for CameraService...")
          return
        }

        const width = this.cameraTexture.getWidth()
        const height = this.cameraTexture.getHeight()
        this.log(`CameraService texture dimensions: ${width}x${height}`)

        if (width > 0 && height > 0) {
          this.isCameraReady = true
          this.log(` Camera ready from CameraService: ${width}x${height}`)
          this.updateStatus(`Camera ready (${width}x${height})`)
        }

        if (this.previewImage) {
          this.previewImage.mainPass.baseTex = this.cameraTexture
          this.log("Preview image set to CameraService texture")
        }

        this.log("Camera initialized via CameraService")
        return
      }

      // FALLBACK: Request own camera (may conflict with CameraService!)
      this.log("⚠️ No CameraService provided - requesting own camera (may conflict!)")
      this.log(`Camera ID: ${this.cameraIdToUse}`)

      const cameraRequest = CameraModule.createCameraRequest()
      cameraRequest.cameraId = this.cameraIdToUse
      this.log("Camera request created")

      this.cameraTexture = this.cameraModule.requestCamera(cameraRequest)
      this.log(`Camera texture received: ${this.cameraTexture ? "YES" : "NO"}`)

      if (!this.cameraTexture) {
        this.logError("Failed to get camera texture!")
        this.updateStatus("Camera request failed")
        return
      }

      const initialWidth = this.cameraTexture.getWidth()
      const initialHeight = this.cameraTexture.getHeight()
      this.log(`Initial texture dimensions: ${initialWidth}x${initialHeight}`)

      // Get the texture provider to track when frames are available (needed for onNewFrame)
      this.cameraTextureProvider = this.cameraTexture.control as CameraTextureProvider
      this.log(`CameraTextureProvider: ${this.cameraTextureProvider ? "YES" : "NO"}`)

      if (this.cameraTextureProvider) {
        this.cameraTextureProvider.onNewFrame.add(() => {
          if (!this.isCameraReady) {
            const width = this.cameraTexture.getWidth()
            const height = this.cameraTexture.getHeight()
            this.log(`onNewFrame callback: ${width}x${height}`)
            if (width > 0 && height > 0) {
              this.isCameraReady = true
              this.log(` Camera ready via callback! Frame size: ${width}x${height}`)
              this.updateStatus(`Camera ready (${width}x${height})`)
            }
          }
        })
        this.log("onNewFrame callback registered for camera ready detection")
      }

      if (this.previewImage) {
        this.previewImage.mainPass.baseTex = this.cameraTexture
        this.log("Preview image set to camera texture")
      }

      this.log("Camera initialized successfully")
      this.updateStatus("Waiting for camera...")
    } catch (error) {
      this.logError(`Failed to initialize camera: ${error}`)
      this.updateStatus("Camera initialization failed")
    }
  }

  /**
   * Handle record button press - toggle recording
   */
  private onRecordButtonPressed() {
    // Prevent starting new recording while previous session is uploading
    if (this.isUploadingSession) {
      this.log("Cannot start recording - previous session still uploading")
      this.updateStatus("Wait for upload to finish...")
      return
    }

    if (this.isRecording) {
      this.stopRecording()
    } else {
      this.startRecording()
    }
    this.updateButtonText()
  }

  /**
   * Start continuous frame recording
   */
  private async startRecording() {
    this.log("Starting recording...")

    // Verify camera is ready
    if (!this.isCameraReady) {
      this.log("Camera not ready, re-initializing...")
      this.initializeCamera()
    }

    // Wait for camera to become ready
    this.log("Waiting for camera to be ready...")
    this.updateStatus("Initializing camera...")

    const ready = await this.waitForCameraReady(5000)
    if (!ready) {
      this.logError("Camera not ready - cannot start recording")
      this.updateStatus("Camera not ready - try again")
      return
    }

    // Initialize recording state
    this.sessionId = this.generateSessionId()
    this.frameCount = 0
    this.framesSkipped = 0
    this.uploadedCount = 0
    this.textureZeroCount = 0
    this.encodeFailCount = 0
    this.recordingStartTime = Date.now()
    this.lastCaptureTime = 0
    this.base64Queue = [] // Store base64 strings during recording (lightweight)
    this.uploadQueue = [] // Binary data prepared after recording
    this.activeEncodes = 0
    this.isRecording = true

    // Calculate capture interval (0 = capture every frame at device rate)
    if (this.captureFrameRate <= 0) {
      this.captureIntervalMs = 0 // No throttling - capture every update
      this.log(`Recording started - Session: ${this.sessionId}`)
      this.log(`Capture rate: MAX (every frame, no throttling)`)
    } else {
      this.captureIntervalMs = 1000 / this.captureFrameRate
      this.log(`Recording started - Session: ${this.sessionId}`)
      this.log(`Capture rate: ${this.captureFrameRate} FPS (${this.captureIntervalMs.toFixed(1)}ms)`)
    }

    this.log(`Mode: OPTIMIZED (onNewFrame capture, binary conversion after)`)
    this.updateStatus("Recording...")
    this.updateButtonText()

    // USE onNewFrame FOR ACCURATE CAMERA FRAME TIMING
    // This captures EXACTLY when the camera delivers a new frame
    // Much more accurate than UpdateEvent which may miss frames
    if (this.cameraTextureProvider) {
      this.log(`Registering onNewFrame callback for camera capture...`)
      this.frameRegistration = this.cameraTextureProvider.onNewFrame.add((cameraFrame) => {
        this.captureFrameIfReady()
      })
      this.log(` onNewFrame registered - will capture at TRUE camera frame rate`)
    } else {
      // Fallback to UpdateEvent if no camera texture provider
      this.logError("No CameraTextureProvider - falling back to UpdateEvent (may miss frames)")
      const updateEvent = this.createEvent("UpdateEvent")
      updateEvent.bind(() => {
        this.captureFrameIfReady()
      })
    }

    // Set up max duration timer
    this.maxDurationEvent = this.createEvent("DelayedCallbackEvent") as DelayedCallbackEvent
    this.maxDurationEvent.bind(() => {
      this.log(`Max recording duration (${this.maxRecordingDuration}s) reached`)
      this.stopRecording()
    })
    this.maxDurationEvent.reset(this.maxRecordingDuration)
  }

  /**
   * Capture a frame if enough time has passed (called every update)
   * OPTIMIZED: Stores base64 strings during recording (lightweight)
   * Binary conversion happens AFTER recording stops (heavy work deferred)
   */
  private captureFrameIfReady() {
    if (!this.isRecording) return

    const currentTime = Date.now()

    // If captureFrameRate is 0, capture EVERY frame (device rate)
    // Otherwise, respect the target frame rate
    if (this.captureIntervalMs > 0 && currentTime - this.lastCaptureTime < this.captureIntervalMs) {
      return
    }

    this.lastCaptureTime = currentTime
    this.captureFrame(currentTime)
  }

  /**
   * Capture a single frame (STANDARD MODE - encodes during recording)
   * PERFORMANCE: Non-blocking, allows concurrent encodes
   */
  private captureFrame(timestamp: number) {
    this.frameCount++
    const frameNumber = this.frameCount

    // Track active encodes
    this.activeEncodes++

    // Determine which texture to use
    let textureToCapture: Texture

    if (this.useCompositeTexture && this.compositeTexture) {
      textureToCapture = this.compositeTexture
    } else {
      textureToCapture = this.cameraTexture
    }

    // Check texture dimensions
    const width = textureToCapture.getWidth()
    const height = textureToCapture.getHeight()

    if (width === 0 || height === 0) {
      this.frameCount-- // Don't count this frame
      this.activeEncodes--
      this.textureZeroCount++ // Track this issue
      return
    }

    // Log first few frames for debugging
    if (frameNumber <= 3) {
      this.log(`Frame ${frameNumber}: Encoding (${width}x${height})...`)
    }

    // Fire off async encode (don't await - allows concurrent encoding)
    this.encodeAndQueueFrame(textureToCapture, frameNumber, timestamp)

    // Update status periodically (every 25 frames to reduce overhead)
    if (frameNumber % 25 === 0 || frameNumber <= 3) {
      const duration = Math.floor((timestamp - this.recordingStartTime) / 1000)
      const queueInfo = this.uploadQueue.length > 0 ? ` (Q:${this.uploadQueue.length})` : ""
      const encodeInfo = this.activeEncodes > 1 ? ` (E:${this.activeEncodes})` : ""
      this.updateStatus(`Rec: ${frameNumber}f ${duration}s${queueInfo}${encodeInfo}`)
    }
  }

  /**
   * Encode frame to base64 and store in queue
   * OPTIMIZED: Only stores base64 STRING during recording (fast)
   * Binary conversion is deferred until after recording stops
   */
  private async encodeAndQueueFrame(texture: Texture, frameNumber: number, timestamp: number) {
    try {
      // Encode texture to base64 JPEG (no binary conversion yet - that's the slow part)
      const base64Data = await this.textureToBase64(texture)

      if (frameNumber <= 3) {
        this.log(`Frame ${frameNumber}: Encoded to base64 (${Math.round(base64Data.length / 1024)}KB)`)
      }

      // Store base64 string (lightweight - no binary conversion during recording)
      this.base64Queue.push({
        frameNumber: frameNumber,
        base64: base64Data,
        timestamp: timestamp
      })

      // Log queue size periodically
      if (frameNumber % 50 === 0) {
        this.log(`Captured: ${this.base64Queue.length} frames`)
      }
    } catch (error) {
      this.encodeFailCount++
      if (frameNumber <= 5 || this.encodeFailCount <= 3) {
        this.logError(`Frame ${frameNumber} encode failed: ${error}`)
      }
    } finally {
      this.activeEncodes--
    }
  }

  /**
   * Encode texture to base64 string ONLY (no binary conversion)
   * This is faster because we skip the expensive base64ToUint8Array during recording
   */
  private async textureToBase64(texture: Texture): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const width = texture.getWidth()
        const height = texture.getHeight()

        if (width === 0 || height === 0) {
          reject(new Error(`Texture not loaded (${width}x${height})`))
          return
        }

        const quality = this.useHighQuality ? CompressionQuality.HighQuality : CompressionQuality.LowQuality

        Base64.encodeTextureAsync(
          texture,
          (encodedString: string) => {
            if (encodedString.length === 0) {
              reject(new Error("Empty encoded string"))
              return
            }
            resolve(encodedString) // Return string directly, no conversion
          },
          () => {
            reject(new Error("Base64 encoding failed"))
          },
          quality,
          EncodingType.Jpg
        )
      } catch (error) {
        reject(error)
      }
    })
  }

  /**
   * Wait for camera texture to be ready
   */
  private async waitForCameraReady(maxWaitMs: number = 3000): Promise<boolean> {
    if (this.isCameraReady) {
      this.log("Camera already ready")
      return true
    }

    const startTime = Date.now()
    const checkInterval = 0.1 // 100ms
    let lastLogTime = 0

    while (Date.now() - startTime < maxWaitMs) {
      if (this.cameraTexture) {
        const width = this.cameraTexture.getWidth()
        const height = this.cameraTexture.getHeight()

        // Log progress every 500ms
        const elapsed = Date.now() - startTime
        if (elapsed - lastLogTime >= 500) {
          this.log(`Waiting for camera... (${elapsed}ms elapsed, current: ${width}x${height})`)
          lastLogTime = elapsed
        }

        if (width > 0 && height > 0) {
          this.isCameraReady = true
          this.log(` Camera texture ready: ${width}x${height} (after ${elapsed}ms)`)
          return true
        }
      } else {
        // Reinitialize if camera texture is null
        this.log("Camera texture is null - reinitializing...")
        this.initializeCamera()
      }

      await this.delay(checkInterval)
    }

    // Final diagnostic
    if (this.cameraTexture) {
      const width = this.cameraTexture.getWidth()
      const height = this.cameraTexture.getHeight()
      this.logError(`Camera texture not ready after ${maxWaitMs}ms (final: ${width}x${height})`)
    } else {
      this.logError(`Camera texture is null after ${maxWaitMs}ms`)
    }
    return false
  }

  /**
   * Convert Base64 string to Uint8Array
   */
  private base64ToUint8Array(base64String: string): Uint8Array {
    const base64Data = base64String.includes(",") ? base64String.split(",")[1] : base64String
    const binaryString = this.decodeBase64(base64Data)
    const bytes = new Uint8Array(binaryString.length)

    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }

    return bytes
  }

  /**
   * Simple Base64 decoder
   */
  private decodeBase64(base64: string): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
    let result = ""
    let i = 0

    base64 = base64.replace(/[^A-Za-z0-9+/]/g, "")

    while (i < base64.length) {
      const encoded1 = chars.indexOf(base64.charAt(i++))
      const encoded2 = chars.indexOf(base64.charAt(i++))
      const encoded3 = chars.indexOf(base64.charAt(i++))
      const encoded4 = chars.indexOf(base64.charAt(i++))

      const bitmap = (encoded1 << 18) | (encoded2 << 12) | (encoded3 << 6) | encoded4

      result += String.fromCharCode((bitmap >> 16) & 255)

      if (encoded3 !== 64) {
        result += String.fromCharCode((bitmap >> 8) & 255)
      }

      if (encoded4 !== 64) {
        result += String.fromCharCode(bitmap & 255)
      }
    }

    return result
  }

  /**
   * Upload frame to Supabase Storage
   */
  private async uploadFrame(frameNumber: number, data: Uint8Array, timestamp: number): Promise<boolean> {
    try {
      if (!this.supabaseClient || !this.isAuthenticated) {
        this.logError("Not authenticated")
        return false
      }

      const fileName = `frames/${this.sessionId}/frame_${String(frameNumber).padStart(5, "0")}.jpg`

      const {data: uploadData, error} = await this.supabaseClient.storage
        .from(this.storageBucket)
        .upload(fileName, data, {
          contentType: "image/jpeg",
          upsert: false
        })

      if (error) {
        if (frameNumber <= 5) {
          this.logError(`Upload error: ${JSON.stringify(error)}`)
        }
        return false
      }

      return true
    } catch (error) {
      if (frameNumber <= 5) {
        this.logError(`Upload exception: ${error}`)
      }
      return false
    }
  }

  /**
   * Stop recording and upload all frames
   */
  private async stopRecording() {
    if (!this.isRecording) return

    const recordingDuration = (Date.now() - this.recordingStartTime) / 1000
    this.log(`Stopping recording after ${recordingDuration.toFixed(1)}s...`)
    this.isRecording = false
    this.isUploadingSession = true // Prevent new recordings during upload

    // Update button text immediately so user knows recording stopped
    this.updateButtonText()

    // Remove onNewFrame registration to stop capturing
    if (this.frameRegistration && this.cameraTextureProvider) {
      this.cameraTextureProvider.onNewFrame.remove(this.frameRegistration)
      this.frameRegistration = null
      this.log(`onNewFrame callback unregistered`)
    }

    // Cancel max duration timer
    if (this.maxDurationEvent) {
      this.maxDurationEvent.enabled = false
    }

    // Wait for all base64 encodes to finish
    this.log(`Waiting for ${this.activeEncodes} encodes to finish...`)
    this.updateStatus(`Finishing encoding...`)
    await this.waitForEncodesComplete()

    // PHASE 1: Convert base64 strings to binary (this is the heavy work we deferred)
    const totalFrames = this.base64Queue.length
    this.log(`Converting ${totalFrames} frames from base64 to binary...`)
    this.updateStatus(`Processing 0/${totalFrames}...`)

    await this.convertBase64ToBinary()

    // PHASE 2: Upload all frames
    const totalToUpload = this.uploadQueue.length
    this.log(`Starting upload of ${totalToUpload} frames...`)
    this.updateStatus(`Uploading 0/${totalToUpload}...`)

    await this.uploadAllFrames(totalToUpload)

    // Calculate expected frames
    const targetFPS = this.captureFrameRate > 0 ? this.captureFrameRate : 30
    const expectedFrames = Math.floor(targetFPS * recordingDuration)
    const actualFPS = this.frameCount / recordingDuration
    const captureEfficiency = ((this.frameCount / expectedFrames) * 100).toFixed(1)

    // Log comprehensive performance stats
    this.log(`=== RECORDING COMPLETE ===`)
    this.log(`Duration: ${recordingDuration.toFixed(1)}s`)
    this.log(`Target FPS: ${targetFPS} | Actual FPS: ${actualFPS.toFixed(1)}`)
    this.log(`Expected frames: ${expectedFrames} | Captured: ${this.frameCount}`)
    this.log(`Capture efficiency: ${captureEfficiency}%`)
    this.log(`Frames encoded: ${totalToUpload} | Uploaded: ${this.uploadedCount}`)

    // Diagnostic information
    if (this.textureZeroCount > 0) {
      this.logError(`⚠️ Texture 0x0 occurrences: ${this.textureZeroCount} (frames lost to texture not ready)`)
    }
    if (this.encodeFailCount > 0) {
      this.logError(`⚠️ Encode failures: ${this.encodeFailCount} (frames lost to encoding errors)`)
    }
    if (this.framesSkipped > 0) {
      this.log(`Frames skipped (encoding busy): ${this.framesSkipped}`)
    }

    // Performance recommendation
    if (actualFPS < targetFPS * 0.9) {
      this.log(
        ` TIP: Device captured ${actualFPS.toFixed(1)} FPS. Consider setting Capture Frame Rate to ${Math.floor(actualFPS)} for optimal results.`
      )
    }

    this.updateStatus(`Done: ${this.uploadedCount}/${this.frameCount} (${actualFPS.toFixed(1)} FPS)`)
    this.isUploadingSession = false // Allow new recordings
    this.updateButtonText()
  }

  /**
   * Convert base64 strings to binary data (AFTER recording)
   * This is the heavy work that we deferred from the recording phase
   */
  private async convertBase64ToBinary() {
    const total = this.base64Queue.length

    for (let i = 0; i < this.base64Queue.length; i++) {
      const frame = this.base64Queue[i]

      try {
        // Convert base64 to binary (this was deferred from recording)
        const binaryData = this.base64ToUint8Array(frame.base64)

        this.uploadQueue.push({
          frameNumber: frame.frameNumber,
          data: binaryData,
          timestamp: frame.timestamp
        })
      } catch (error) {
        this.encodeFailCount++
        if (i < 5 || this.encodeFailCount <= 3) {
          this.logError(`Frame ${frame.frameNumber} binary conversion failed: ${error}`)
        }
      }

      // Update progress periodically
      if ((i + 1) % 25 === 0 || i === total - 1) {
        this.updateStatus(`Processing ${i + 1}/${total}...`)
      }

      // Yield to prevent blocking (every 10 frames)
      if ((i + 1) % 10 === 0) {
        await this.delay(0.01) // Small delay to prevent UI freeze
      }
    }

    // Clear base64 queue to free memory
    this.base64Queue = []

    this.log(`Binary conversion complete: ${this.uploadQueue.length} frames ready for upload`)
  }

  /**
   * Upload all frames in queue with progress updates
   */
  private async uploadAllFrames(total: number) {
    while (this.uploadQueue.length > 0) {
      const frame = this.uploadQueue.shift()
      if (!frame) break

      try {
        const success = await this.uploadFrame(frame.frameNumber, frame.data, frame.timestamp)
        if (success) {
          this.uploadedCount++
        }
      } catch (error) {
        this.logError(`Frame ${frame.frameNumber} upload error: ${error}`)
      }

      // Update progress every 10 frames
      if (this.uploadedCount % 10 === 0 || this.uploadQueue.length === 0) {
        this.updateStatus(`Uploading ${this.uploadedCount}/${total}...`)
      }
    }
  }

  /**
   * Wait for all active encodes to complete
   */
  private async waitForEncodesComplete(): Promise<void> {
    while (this.activeEncodes > 0) {
      this.log(`Waiting for ${this.activeEncodes} encodes to finish...`)
      await this.delay(0.1)
    }
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 9)
    return `session_${timestamp}_${random}`
  }

  /**
   * Update status text
   */
  private updateStatus(message: string) {
    if (this.statusText) {
      this.statusText.text = message
    }
    // Only log status changes when not recording (reduce logging overhead)
    if (!this.isRecording) {
      this.log(`Status: ${message}`)
    }
  }

  /**
   * Update button text based on recording state
   */
  private updateButtonText() {
    if (this.buttonText) {
      if (this.isRecording) {
        this.buttonText.text = "Stop Recording"
      } else if (this.isUploadingSession) {
        this.buttonText.text = "Uploading..."
      } else {
        this.buttonText.text = "Start Recording"
      }
    }
  }

  /**
   * Delay utility
   */
  private delay(seconds: number): Promise<void> {
    return new Promise((resolve) => {
      const delayEvent = this.createEvent("DelayedCallbackEvent")
      delayEvent.bind(() => {
        resolve()
      })
      delayEvent.reset(seconds)
    })
  }

  /**
   * Cleanup resources
   */
  private cleanup() {
    if (this.isRecording) {
      this.stopRecording()
    }

    // Clean up onNewFrame registration
    if (this.frameRegistration && this.cameraTextureProvider) {
      this.cameraTextureProvider.onNewFrame.remove(this.frameRegistration)
      this.frameRegistration = null
    }

    this.uploadQueue = []
    this.base64Queue = []
  }

  /**
   * Logging helpers
   */
  private log(message: string) {
    if (this.enableDebugLogs) {
      print(`[VideoCaptureUploader] ${message}`)
    }
  }

  private logError(message: string) {
    print(`[VideoCaptureUploader] ERROR: ${message}`)
  }
}
