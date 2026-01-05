import {RectangleButton} from "SpectaclesUIKit.lspkg/Scripts/Components/Button/RectangleButton"
import {Switch} from "SpectaclesUIKit.lspkg/Scripts/Components/Switch/Switch"
import {TextInputField} from "SpectaclesUIKit.lspkg/Scripts/Components/TextInputField/TextInputField"
import {CameraService} from "../../../CompositeCameraModified/Scripts/CameraService"
import {AudioCaptureUtility, SessionUtility, SupabaseAuthUtility, VideoCaptureUtility} from "./CaptureUtilities"
import {SnapCloudRequirements} from "./SnapCloudRequirements"

/**
 * CompositeCaptureUploader - Synchronized video frame and audio capture for upload
 *
 * COMPOSITE CAPTURE: Records both video frames and audio chunks simultaneously
 * with synchronized session IDs and timestamps for later stitching in Supabase.
 *
 * KEY FEATURES:
 * - Shared session ID for video frames and audio chunks
 * - Synchronized timestamps for proper alignment
 * - Sequential upload processing to avoid server overload
 * - Creates metadata file for stitching relationship
 */
@component
export class CompositeCaptureUploader extends BaseScriptComponent {
  // Core Modules
  private internetModule: InternetModule = require("LensStudio:InternetModule")

  // Supabase Configuration
  @input
  @hint("Reference to SnapCloudRequirements for centralized Supabase configuration")
  public snapCloudRequirements: SnapCloudRequirements

  @input
  @hint("Supabase Storage bucket name for composite uploads")
  public storageBucket: string = "specs-bucket"

  @input
  @hint("Storage folder for video frames")
  public videoStorageFolder: string = "composite-video"

  @input
  @hint("Storage folder for audio chunks")
  public audioStorageFolder: string = "composite-audio"

  @input
  @hint("Storage folder for final stitched video")
  public stitchedOutputFolder: string = "composite-stitched"

  // Social Sharing Configuration
  @input
  @hint("Enable sharing to Snapchat Spotlight after video is stitched")
  public shareToSpotlight: boolean = false

  @input
  @hint("Text input field for Spotlight caption")
  @allowUndefined
  public captionInput: TextInputField

  @input
  @hint("Default caption for Spotlight post (used if no input provided)")
  public defaultCaption: string = "Captured with Spectacles ✨"

  // Video Format Configuration
  @input
  @hint("Default value for 9:16 vertical crop (can be toggled via Switch)")
  public useVerticalCrop: boolean = false

  @input
  @hint("Switch to toggle 9:16 vertical crop for Spotlight/Reels format")
  @allowUndefined
  public verticalCropSwitch: Switch

  // Video Configuration
  @input
  @hint(
    "Image format for captured frames.\n\n⚡ JPG: Faster encoding, smaller files, recommended for smooth recording.\n\n⚠️ PNG: Lossless quality but CPU INTENSIVE - may cause stuttering during recording!"
  )
  @widget(new ComboBoxWidget([new ComboBoxItem("JPG (Recommended)", 0), new ComboBoxItem("PNG (CPU Intensive!)", 1)]))
  public imageFormat: number = 0 // 0 = JPG, 1 = PNG

  @input
  @hint("Video frame quality (1-100, higher = better quality). Only affects JPG format.")
  @widget(new SliderWidget(1, 100, 1))
  public frameQuality: number = 70

  @input
  @hint("Frames per second for video capture")
  @widget(new SliderWidget(1, 30, 1))
  public frameRate: number = 30

  @input
  @hint("Maximum recording duration in seconds")
  @widget(new SliderWidget(5, 120, 5))
  public maxRecordingDuration: number = 30

  // Camera Configuration - USE CameraService to avoid conflicts!
  @input
  @hint("Reference to CameraService (RECOMMENDED). Uses its camera to avoid multiple camera requests.")
  @allowUndefined
  public cameraService: CameraService

  // Composite Texture Configuration
  @input
  @hint("Default value for composite mode (can be toggled via Switch)")
  public useCompositeTexture: boolean = false

  @input
  @hint("Pre-composed texture (with AR content) - used when useCompositeTexture is enabled")
  @allowUndefined
  public compositeTexture: Texture

  // Audio Configuration
  @input
  @hint("Microphone audio track asset for recording")
  public microphoneAsset: AudioTrackAsset

  @input
  @hint("Audio sample rate (Hz)")
  @widget(new SliderWidget(8000, 48000, 1000))
  public sampleRate: number = 44100

  @input
  @hint("Audio chunk size in milliseconds")
  @widget(new SliderWidget(50, 1000, 50))
  public chunkDurationMs: number = 100

  // UI Components
  @input
  @hint("Button to start/stop composite recording")
  public recordButton: RectangleButton

  @input
  @hint("Switch to toggle between camera and composite capture mode")
  @allowUndefined
  public compositeSwitch: Switch

  @input
  @hint("Text component to display recording status")
  @allowUndefined
  public statusText: Text

  @input
  @hint("Text component to display button state")
  @allowUndefined
  public buttonText: Text

  @input
  @hint("Image component to show camera preview")
  @allowUndefined
  public previewImage: Image

  // Debug Configuration
  @input
  @hint("Enable detailed debug logging")
  public enableDebugLogs: boolean = true

  // Private State
  private isRecording: boolean = false
  private sessionId: string = ""
  private recordingStartTime: number = 0
  private recordingEndTime: number = 0 // Captured when recording stops (before uploads)
  private actualRecordingDurationMs: number = 0 // True recording duration

  // Frame capture state - stored in memory during recording, uploaded after
  private frameCount: number = 0
  private lastFrameTime: number = 0
  private storedFrames: Array<{frameNumber: number; frameData: string; timestamp: number}> = []
  private isCapturingFrame: boolean = false // Lock to prevent overlapping captures

  // Audio capture state - stored in memory during recording, uploaded after
  // IMPORTANT: Store RAW audio during recording, convert to WAV AFTER to avoid stuttering
  private chunkCount: number = 0
  private storedRawAudioChunks: Array<{chunkNumber: number; rawData: Uint8Array}> = []
  private audioUpdateEvent: UpdateEvent

  // Utilities
  private videoCapture: VideoCaptureUtility
  private audioCapture: AudioCaptureUtility
  private supabaseAuth: SupabaseAuthUtility

  // Timing and synchronization
  private frameInterval: number
  private recordingTimer: any
  private frameUpdateEvent: UpdateEvent // UpdateEvent for consistent frame timing

  onAwake() {
    this.log("CompositeCaptureUploader initializing...")

    // Initialize utilities
    this.videoCapture = new VideoCaptureUtility(this.enableDebugLogs)
    this.audioCapture = new AudioCaptureUtility(this.enableDebugLogs)
    this.supabaseAuth = new SupabaseAuthUtility(this.enableDebugLogs)

    // Calculate frame interval
    this.frameInterval = 1000 / this.frameRate // ms per frame

    // Validate requirements
    if (!this.snapCloudRequirements) {
      this.logError("SnapCloudRequirements not configured! Please assign in Inspector.")
      return
    }

    if (!this.microphoneAsset) {
      this.logError("MicrophoneAsset not configured! Please assign an AudioTrackAsset in Inspector.")
      return
    }

    // Initialize on start - button/switch initialization must happen after components are awake
    this.createEvent("OnStartEvent").bind(() => {
      this.setupUIHandlers()
      this.initializeCompositeCapture()
    })

    // Cleanup on destroy
    this.createEvent("OnDestroyEvent").bind(() => {
      this.cleanup()
    })

    this.updateStatus("Ready for composite recording")
    this.updateButtonText()
  }

  /**
   * Setup UI button and switch handlers - must be called after components are awake
   */
  private setupUIHandlers() {
    // Setup button handler - call initialize() first to ensure events are ready
    this.log(`Record button assigned: ${this.recordButton ? "YES" : "NO"}`)
    if (this.recordButton) {
      this.recordButton.initialize()
      this.log(`Record button initialized and has onTriggerUp: ${this.recordButton.onTriggerUp ? "YES" : "NO"}`)
      this.recordButton.onTriggerUp.add(() => {
        this.log(" RECORD BUTTON CLICKED!")
        this.onRecordButtonPressed()
      })
      this.log(" Button handler registered successfully")
    } else {
      this.logError("Record button NOT assigned in Inspector!")
    }

    // Setup composite mode switch handler - call initialize() first
    if (this.compositeSwitch) {
      this.compositeSwitch.initialize()
      this.compositeSwitch.onValueChange.add((value) => {
        const isComposite = value === 1
        this.log(`Composite switch changed to: ${isComposite}`)
        this.useCompositeTexture = isComposite
        this.updatePreview()
      })
      this.log(`Composite switch initialized (default: ${this.useCompositeTexture})`)
    }

    // Setup vertical crop (9:16) switch handler
    if (this.verticalCropSwitch) {
      this.verticalCropSwitch.initialize()
      this.verticalCropSwitch.onValueChange.add((value) => {
        this.useVerticalCrop = value === 1
        this.log(`Vertical crop (9:16) switch changed to: ${this.useVerticalCrop}`)
      })
      this.log(`Vertical crop switch initialized (default from Inspector: ${this.useVerticalCrop})`)
    }

    // Setup caption input field
    if (this.captionInput) {
      this.captionInput.initialize()
      this.log(`Caption input field initialized`)
    }
  }

  /**
   * Initialize composite capture system
   */
  private async initializeCompositeCapture() {
    this.log("=== COMPOSITE CAPTURE INITIALIZATION START ===")

    // Initialize Supabase authentication
    const authSuccess = await this.supabaseAuth.initializeAndAuthenticate(this.snapCloudRequirements)
    if (!authSuccess) {
      this.updateStatus("Authentication failed")
      return
    }

    // Initialize video capture - prefer CameraService to avoid conflicts
    let videoSuccess = false
    if (this.cameraService && this.cameraService.cameraTexture) {
      videoSuccess = this.videoCapture.initializeCameraFromService(
        this.cameraService.cameraTexture,
        this.cameraService.cameraTextureProvider
      )
    } else {
      this.log("⚠️ No CameraService provided - using fallback camera")
      videoSuccess = this.videoCapture.initializeCamera()
    }

    if (!videoSuccess) {
      this.updateStatus("Video initialization failed")
      return
    }

    // Show preview (composite or camera)
    this.updatePreview()

    // Initialize audio capture
    const audioSuccess = this.audioCapture.initializeAudio(this.microphoneAsset, this.sampleRate)
    if (!audioSuccess) {
      this.updateStatus("Audio initialization failed")
      return
    }

    // Create audio update event
    this.audioUpdateEvent = this.createEvent("UpdateEvent")
    this.audioUpdateEvent.bind(() => {
      this.processAudio()
    })
    this.audioUpdateEvent.enabled = false

    this.updateStatus("Composite recording ready")
    this.log("=== COMPOSITE CAPTURE INITIALIZATION COMPLETE ===")
  }

  /**
   * Handle record button press
   */
  private onRecordButtonPressed() {
    this.log(" onRecordButtonPressed() called - Current state: " + (this.isRecording ? "RECORDING" : "IDLE"))
    if (this.isRecording) {
      this.stopRecording()
    } else {
      this.startRecording()
    }
    this.updateButtonText()
  }

  /**
   * Start synchronized video and audio recording
   */
  private async startRecording() {
    if (!this.supabaseAuth.isAuth()) {
      this.logError("Not authenticated - cannot start recording")
      this.updateStatus("Authentication required")
      return
    }

    this.log("Starting composite recording...")
    this.isRecording = true
    this.sessionId = SessionUtility.generateSessionId("composite")
    this.recordingStartTime = Date.now()
    this.frameCount = 0
    this.chunkCount = 0
    this.lastFrameTime = 0
    // Clear storage arrays and reset locks - NO PROCESSING during recording
    this.storedFrames = []
    this.storedRawAudioChunks = []
    this.isCapturingFrame = false

    const mode = this.useCompositeTexture ? "COMPOSITE" : "CAMERA"
    const formatName = this.imageFormat === 1 ? "PNG" : "JPG"
    this.updateStatus(`● Recording ${mode} @ ${this.frameRate}fps (${formatName})...`)
    this.log(`Recording mode: ${mode}, Format: ${formatName}, Quality: ${this.frameQuality}%, FPS: ${this.frameRate}`)

    // Warn if PNG is selected (CPU intensive)
    if (this.imageFormat === 1) {
      this.log("⚠️ WARNING: PNG format selected - this is CPU intensive and may cause stuttering!")
      this.log("⚠️ Consider using JPG format for smoother recording.")
    }

    this.updateButtonText()

    // Start audio recording
    const audioStarted = this.audioCapture.startRecording()
    this.audioUpdateEvent.enabled = true
    this.log(`Audio recording started: ${audioStarted ? "SUCCESS" : "FAILED"}`)

    // Start frame capture using UpdateEvent for consistent timing
    // UpdateEvent fires every render frame - we check elapsed time to control capture rate
    this.lastFrameTime = Date.now()
    this.frameUpdateEvent = this.createEvent("UpdateEvent")
    this.frameUpdateEvent.bind(() => {
      if (!this.isRecording) return

      const now = Date.now()
      const elapsed = now - this.lastFrameTime

      // Only capture if enough time has passed since last frame
      if (elapsed >= this.frameInterval) {
        this.lastFrameTime = now // Reset for next frame
        this.captureVideoFrame()
      }
    })

    // Set maximum recording duration timer
    this.recordingTimer = this.createEvent("DelayedCallbackEvent")
    this.recordingTimer.bind(() => {
      this.log(`Maximum recording duration (${this.maxRecordingDuration}s) reached`)
      this.stopRecording()
    })
    this.recordingTimer.reset(this.maxRecordingDuration)

    // NOTE: Session metadata is created AFTER recording stops (in stopRecording)
    // to ensure zero network operations during recording for smooth performance

    this.log("Composite recording started - ZERO uploads during recording")
  }

  /**
   * Capture video frame with timestamp - STORES IN MEMORY ONLY, NO UPLOAD
   * All frames are uploaded after recording stops for smooth performance
   * Uses a lock to prevent overlapping captures (which cause stuttering)
   */
  private async captureVideoFrame() {
    if (!this.isRecording) return

    // CRITICAL: Skip if previous capture is still in progress
    // Overlapping async captures cause stuttering!
    if (this.isCapturingFrame) {
      return // Skip this frame rather than queue up captures
    }

    this.isCapturingFrame = true

    try {
      const timestamp = Date.now()

      // Capture from composite texture if enabled, otherwise use camera
      let frameData: string
      if (this.useCompositeTexture && this.compositeTexture) {
        frameData = await this.captureCompositeFrame(this.compositeTexture)
      } else {
        frameData = await this.videoCapture.captureFrame(this.frameQuality)
      }

      this.frameCount++

      // Store in memory - NO UPLOAD during recording for zero stuttering
      this.storedFrames.push({
        frameNumber: this.frameCount,
        frameData: frameData,
        timestamp: timestamp
      })
    } catch (error) {
      this.logError(`Failed to capture frame ${this.frameCount + 1}: ${error}`)
    } finally {
      this.isCapturingFrame = false
    }
  }

  /**
   * Process audio during recording
   */
  private processAudio() {
    if (!this.isRecording) return

    const audioFrame = this.audioCapture.processAudioFrame()
    if (!audioFrame) return

    // Check if we have enough samples for a chunk
    if (this.audioCapture.hasEnoughSamplesForChunk(this.chunkDurationMs, this.sampleRate)) {
      this.processAudioChunk()

      // Log progress every 10 chunks
      if (this.chunkCount % 10 === 0) {
        this.log(`Audio progress: ${this.chunkCount} chunks captured`)
      }
    }
  }

  /**
   * Process audio chunk - STORES RAW BYTES ONLY, NO CONVERSION
   * WAV conversion happens AFTER recording stops for zero stuttering
   */
  private async processAudioChunk() {
    try {
      this.chunkCount++
      const rawAudioData = this.audioCapture.getAndClearAudioBuffer()

      // Store RAW bytes only - NO WAV conversion during recording!
      // WAV conversion is CPU intensive and causes stuttering
      this.storedRawAudioChunks.push({
        chunkNumber: this.chunkCount,
        rawData: rawAudioData
      })
    } catch (error) {
      this.logError(`Failed to process audio chunk ${this.chunkCount}: ${error}`)
    }
  }

  /**
   * Create session metadata for stitching
   */
  private async createSessionMetadata() {
    try {
      const metadata = {
        sessionId: this.sessionId,
        type: "composite-capture",
        startTime: this.recordingStartTime,
        userId: this.supabaseAuth.getUserId(),
        videoConfig: {
          frameRate: this.frameRate,
          quality: this.frameQuality,
          storageFolder: this.videoStorageFolder
        },
        audioConfig: {
          sampleRate: this.sampleRate,
          chunkDurationMs: this.chunkDurationMs,
          storageFolder: this.audioStorageFolder
        },
        synchronization: {
          startTimestamp: this.recordingStartTime,
          sessionId: this.sessionId
        },
        createdAt: new Date().toISOString()
      }

      const fileName = `metadata/${this.sessionId}/session_info.json`
      const metadataBlob = new TextEncoder().encode(JSON.stringify(metadata, null, 2))

      await this.supabaseAuth.getSupabaseClient().storage.from(this.storageBucket).upload(fileName, metadataBlob, {
        contentType: "application/json",
        upsert: true
      })

      this.log("Session metadata created for stitching")
    } catch (error) {
      this.logError(`Failed to create session metadata: ${error}`)
    }
  }

  /**
   * Stop composite recording - ALL UPLOADS HAPPEN HERE, AFTER RECORDING
   * This ensures zero stuttering during recording
   */
  private async stopRecording() {
    if (!this.isRecording) return

    // CRITICAL: Capture actual recording duration IMMEDIATELY before any uploads
    // This is the source of truth for frame rate calculation
    this.recordingEndTime = Date.now()
    this.actualRecordingDurationMs = this.recordingEndTime - this.recordingStartTime
    const recordingDurationSec = this.actualRecordingDurationMs / 1000

    this.log(`=== RECORDING STOPPED ===`)
    this.log(`Actual recording duration: ${recordingDurationSec.toFixed(2)}s (${this.actualRecordingDurationMs}ms)`)
    this.log(`Captured: ${this.storedFrames.length} frames, ${this.storedRawAudioChunks.length} audio chunks in memory`)
    this.updateStatus(`■ Stopped. Processing ${this.storedFrames.length} frames...`)
    this.isRecording = false
    this.updateButtonText()

    // Stop audio recording
    this.audioCapture.stopRecording()
    this.audioUpdateEvent.enabled = false

    // Store any remaining audio as RAW (no conversion yet)
    const remainingAudio = this.audioCapture.getAndClearAudioBuffer()
    if (remainingAudio.length > 0) {
      this.chunkCount++
      this.storedRawAudioChunks.push({
        chunkNumber: this.chunkCount,
        rawData: remainingAudio
      })
      this.log(`Final audio chunk ${this.chunkCount} stored in memory (raw)`)
    }

    // Stop frame capture UpdateEvent
    if (this.frameUpdateEvent) {
      this.frameUpdateEvent.enabled = false
    }

    // Stop max duration timer
    if (this.recordingTimer) {
      this.recordingTimer = null
    }

    // ========== NOW PROCESS AND UPLOAD EVERYTHING ==========
    this.log("=== STARTING POST-RECORDING PROCESSING ===")

    const totalFrames = this.storedFrames.length
    const totalAudio = this.storedRawAudioChunks.length
    this.log(`Processing ${totalFrames} frames and ${totalAudio} audio chunks...`)

    // Upload frames sequentially
    this.updateStatus(`⬆ Uploading ${totalFrames} frames...`)
    for (let i = 0; i < this.storedFrames.length; i++) {
      const frame = this.storedFrames[i]
      if (i % 10 === 0) {
        this.updateStatus(`⬆ Uploading frame ${i + 1}/${totalFrames}...`)
      }

      const success = await this.videoCapture.uploadFrameToStorage(
        this.supabaseAuth.getSupabaseClient(),
        this.storageBucket,
        this.sessionId,
        frame.frameNumber,
        frame.frameData,
        frame.timestamp,
        this.videoStorageFolder,
        this.imageFormat // Pass image format (0 = JPG, 1 = PNG)
      )

      if (!success) {
        this.logError(`Failed to upload frame ${frame.frameNumber}`)
      }

      // Small delay between uploads to avoid overwhelming the server
      if (i % 5 === 0) {
        await this.delay(0.02) // 20ms delay every 5 frames
      }
    }
    this.log(`All ${totalFrames} frames uploaded`)

    // NOW convert raw audio to WAV and upload (conversion happens HERE, not during recording)
    this.updateStatus(`🔊 Converting and uploading ${totalAudio} audio chunks...`)
    for (let i = 0; i < this.storedRawAudioChunks.length; i++) {
      const chunk = this.storedRawAudioChunks[i]
      if (i % 10 === 0) {
        this.updateStatus(`🔊 Processing audio ${i + 1}/${totalAudio}...`)
      }

      // Convert raw to WAV NOW (after recording is done)
      const wavData = this.convertRawToWav(chunk.rawData)

      const success = await this.uploadAudioChunk(this.sessionId, chunk.chunkNumber, wavData)
      if (!success) {
        this.logError(`Failed to upload audio chunk ${chunk.chunkNumber}`)
      }
    }
    this.log(`All ${totalAudio} audio chunks converted and uploaded`)

    // Clear memory
    this.storedFrames = []
    this.storedRawAudioChunks = []
    this.log("Memory cleared")

    // Wait a bit to ensure all HTTP uploads complete
    this.log("Waiting for uploads to finalize...")
    this.updateStatus(`⬆ Finalizing uploads...`)
    await this.delay(2)

    // Create session metadata (moved here from startRecording for zero network during recording)
    this.updateStatus(`📝 Creating session metadata...`)
    await this.createSessionMetadata()

    // Update final metadata with retry
    this.updateStatus(`📝 Saving metadata...`)
    let metadataUploaded = await this.updateFinalMetadata()

    // Retry metadata upload if it failed
    if (!metadataUploaded) {
      this.log("Retrying metadata upload...")
      await this.delay(2)
      metadataUploaded = await this.updateFinalMetadata()
    }

    if (!metadataUploaded) {
      this.logError("Failed to upload metadata after retries - cannot trigger stitching")
      this.updateStatus(`❌ Error: Failed to save metadata`)
      return
    }

    // Wait for Supabase storage eventual consistency
    this.log("Waiting for storage consistency...")
    this.updateStatus(`⏳ Waiting for storage sync...`)
    await this.delay(2)

    // Verify metadata is accessible before triggering stitch
    let metadataVerified = false
    const maxRetries = 5
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      this.log(`Verifying metadata accessibility (attempt ${attempt}/${maxRetries})...`)
      metadataVerified = await this.verifyMetadataExists()

      if (metadataVerified) {
        this.log("Metadata verified - ready to trigger stitching")
        break
      }

      if (attempt < maxRetries) {
        this.log(`Metadata not yet visible, waiting before retry...`)
        await this.delay(2)
      }
    }

    if (!metadataVerified) {
      this.logError("Metadata not accessible after verification retries")
      this.updateStatus(`❌ Error: Metadata sync failed - try again later`)
      return
    }

    // Trigger video stitching
    this.updateStatus(`🎬 Triggering video stitching...`)
    await this.triggerStitching()

    const durationSec = this.actualRecordingDurationMs / 1000
    this.log(
      `Composite recording complete: ${totalFrames} frames, ${totalAudio} audio chunks in ${durationSec.toFixed(1)}s`
    )
    this.updateStatus(
      `✅ Complete! ${totalFrames} frames + ${totalAudio} audio (${durationSec.toFixed(1)}s) - Stitching...`
    )
  }

  /**
   * Update final metadata with recording statistics
   * Returns true if upload was successful, false otherwise
   */
  private async updateFinalMetadata(): Promise<boolean> {
    try {
      // Calculate actual frame rate for metadata
      const durationMs = Date.now() - this.recordingStartTime
      const durationSeconds = durationMs / 1000
      const actualFrameRate = this.frameCount / durationSeconds

      const finalMetadata = {
        sessionId: this.sessionId,
        status: "complete",
        recordingStats: {
          totalFrames: this.frameCount,
          totalAudioChunks: this.chunkCount,
          duration: durationMs,
          durationSeconds: durationSeconds,
          endTime: Date.now()
        },
        stitchingInfo: {
          videoPath: `${this.videoStorageFolder}/${this.sessionId}/`,
          audioPath: `${this.audioStorageFolder}/${this.sessionId}/`,
          syncTimestamp: this.recordingStartTime,
          targetFrameRate: this.frameRate,
          actualFrameRate: actualFrameRate,
          sampleRate: this.sampleRate
        }
      }

      const fileName = `metadata/${this.sessionId}/final_stats.json`
      const metadataBlob = new TextEncoder().encode(JSON.stringify(finalMetadata, null, 2))

      const {data, error} = await this.supabaseAuth
        .getSupabaseClient()
        .storage.from(this.storageBucket)
        .upload(fileName, metadataBlob, {
          contentType: "application/json",
          upsert: true
        })

      if (error) {
        this.logError(`Metadata upload error: ${JSON.stringify(error)}`)
        return false
      }

      this.log(`Final metadata uploaded successfully: ${fileName}`)
      return true
    } catch (error) {
      this.logError(`Failed to update final metadata: ${error}`)
      return false
    }
  }

  /**
   * Verify metadata is accessible in storage before triggering stitch
   */
  private async verifyMetadataExists(): Promise<boolean> {
    try {
      const {data, error} = await this.supabaseAuth
        .getSupabaseClient()
        .storage.from(this.storageBucket)
        .list(`metadata/${this.sessionId}`)

      if (error) {
        this.logError(`Metadata verification error: ${JSON.stringify(error)}`)
        return false
      }

      const hasFiles = data && data.length > 0
      this.log(`Metadata verification: ${hasFiles ? data.length + " files found" : "NO FILES FOUND"}`)

      if (hasFiles) {
        this.log(`Metadata files: ${data.map((f: {name: string}) => f.name).join(", ")}`)
      }

      return hasFiles
    } catch (error) {
      this.logError(`Metadata verification failed: ${error}`)
      return false
    }
  }

  /**
   * Trigger video stitching after upload completes
   */
  private async triggerStitching() {
    try {
      this.log("🎬 Triggering video stitching...")

      const supabaseProject = this.snapCloudRequirements.getSupabaseProject()

      // Use the REST API URL with /functions/v1/ path
      const functionUrl = `${supabaseProject.url}/functions/v1/trigger-composite-stitch`

      this.log(`Calling Edge Function: ${functionUrl}`)

      // Use the ACTUAL recording duration captured when recording stopped (before uploads)
      // This is the source of truth - NOT Date.now() which includes upload time!
      const recordingDurationSeconds = this.actualRecordingDurationMs / 1000
      const totalFrames = this.frameCount
      const totalAudioChunks = this.chunkCount

      // Calculate audio duration
      // Each audio chunk represents chunkDurationMs of audio
      const audioDurationMs = totalAudioChunks * this.chunkDurationMs
      const audioDurationSeconds = audioDurationMs / 1000

      // Frame rate calculation:
      // - If we have audio: use audio duration as source of truth
      // - If NO audio: use actual recording duration
      let effectiveFrameRate: number
      let durationSource: string

      if (audioDurationSeconds > 0) {
        // Audio is source of truth
        effectiveFrameRate = totalFrames / audioDurationSeconds
        durationSource = "audio duration"
      } else {
        // No audio - use actual recording duration
        effectiveFrameRate = totalFrames / recordingDurationSeconds
        durationSource = "recording duration (no audio)"
        this.log(`⚠️ No audio chunks captured - using recording duration for frame rate`)
      }

      this.log(`=== STITCHING PARAMETERS ===`)
      this.log(`Recording duration (actual): ${recordingDurationSeconds.toFixed(2)}s`)
      this.log(`Total frames: ${totalFrames}`)
      this.log(`Total audio chunks: ${totalAudioChunks}`)
      this.log(`Audio chunk duration: ${this.chunkDurationMs}ms`)
      this.log(`Audio total duration: ${audioDurationSeconds.toFixed(2)}s`)
      this.log(`Frame rate: ${effectiveFrameRate.toFixed(2)} fps (from ${durationSource})`)
      this.log(`Target frame rate was: ${this.frameRate} fps`)

      // Get caption from input field or use default
      const spotlightCaption = this.captionInput?.text?.trim() || this.defaultCaption

      this.log(`Social sharing:`)
      this.log(`  - Share to Spotlight: ${this.shareToSpotlight}`)
      if (this.shareToSpotlight) {
        this.log(`  - Caption: "${spotlightCaption}"`)
      }
      const imageFormatName = this.imageFormat === 1 ? "PNG" : "JPG"
      this.log(`Video format:`)
      this.log(`  - Image format: ${imageFormatName}`)
      this.log(`  - Vertical crop (9:16): ${this.useVerticalCrop}`)

      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseProject.publicToken,
          Authorization: `Bearer ${supabaseProject.publicToken}`
        },
        body: JSON.stringify({
          sessionId: this.sessionId,
          bucket: this.storageBucket,
          // Pass calculated frame rate (from audio or recording duration)
          frameRate: effectiveFrameRate,
          sampleRate: this.sampleRate,
          videoStorageFolder: this.videoStorageFolder,
          audioStorageFolder: this.audioStorageFolder,
          stitchedOutputFolder: this.stitchedOutputFolder,
          // Audio timing info (source of truth for duration)
          totalFrames: totalFrames,
          totalAudioChunks: totalAudioChunks,
          chunkDurationMs: this.chunkDurationMs,
          audioDurationMs: audioDurationMs,
          recordingDurationMs: this.actualRecordingDurationMs,
          // Video format options
          imageFormat: this.imageFormat, // 0 = JPG, 1 = PNG
          useVerticalCrop: this.useVerticalCrop,
          // Social sharing options
          shareToSpotlight: this.shareToSpotlight,
          spotlightCaption: spotlightCaption
        })
      }

      const response = await this.internetModule.fetch(functionUrl, requestOptions)

      const result = await response.json()
      this.log(`Stitching response: ${JSON.stringify(result)}`)

      if (result.success) {
        this.log(" Stitching job started successfully!")
        this.updateStatus(` Stitching ${this.frameCount} frames + ${this.chunkCount} audio...`)
      } else {
        this.logError(` Stitching failed: ${JSON.stringify(result)}`)
        this.updateStatus(` Stitching failed: ${result.error || "Unknown error"}`)
      }
    } catch (error) {
      this.logError(`Stitching trigger error: ${error}`)
      this.updateStatus(` Error: ${error}`)
    }
  }

  /**
   * Capture frame from composite texture using selected image format
   */
  private async captureCompositeFrame(texture: Texture): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        // Use quality setting for compression
        const compressionQuality =
          this.frameQuality > 70 ? CompressionQuality.HighQuality : CompressionQuality.IntermediateQuality

        // Use selected image format (0 = JPG, 1 = PNG)
        const encodingType = this.imageFormat === 1 ? EncodingType.Png : EncodingType.Jpg

        Base64.encodeTextureAsync(
          texture,
          (encodedString: string) => {
            resolve(encodedString)
          },
          () => {
            reject(new Error("Base64 encoding failed"))
          },
          compressionQuality,
          encodingType
        )
      } catch (error) {
        reject(error)
      }
    })
  }

  /**
   * Convert raw Float32 audio data to WAV format (like AudioCaptureUploader)
   */
  private convertRawToWav(rawData: Uint8Array): Uint8Array {
    // Raw data is Float32 array in bytes
    const floatView = new Float32Array(rawData.buffer)
    const totalSamples = floatView.length

    // Convert Float32 (-1.0 to 1.0) to Int16 (-32768 to 32767)
    const pcmData = new Int16Array(totalSamples)
    for (let i = 0; i < totalSamples; i++) {
      const sample = Math.max(-1, Math.min(1, floatView[i]))
      pcmData[i] = sample * 32767
    }

    // Create WAV header
    const wavHeader = this.createWavHeader(totalSamples, this.sampleRate, 1, 16)

    // Combine header and PCM data
    const wavData = new Uint8Array(wavHeader.length + pcmData.length * 2)
    wavData.set(wavHeader, 0)
    wavData.set(new Uint8Array(pcmData.buffer), wavHeader.length)

    return wavData
  }

  /**
   * Create WAV file header (same as AudioCaptureUploader)
   */
  private createWavHeader(numSamples: number, sampleRate: number, channels: number, bitsPerSample: number): Uint8Array {
    const byteRate = sampleRate * channels * (bitsPerSample / 8)
    const blockAlign = channels * (bitsPerSample / 8)
    const dataSize = numSamples * channels * (bitsPerSample / 8)
    const fileSize = 36 + dataSize

    const header = new ArrayBuffer(44)
    const view = new DataView(header)

    // RIFF chunk descriptor
    view.setUint32(0, 0x52494646, false) // "RIFF"
    view.setUint32(4, fileSize, true) // File size
    view.setUint32(8, 0x57415645, false) // "WAVE"

    // fmt sub-chunk
    view.setUint32(12, 0x666d7420, false) // "fmt "
    view.setUint32(16, 16, true) // Sub-chunk size
    view.setUint16(20, 1, true) // Audio format (1 = PCM)
    view.setUint16(22, channels, true) // Number of channels
    view.setUint32(24, sampleRate, true) // Sample rate
    view.setUint32(28, byteRate, true) // Byte rate
    view.setUint16(32, blockAlign, true) // Block align
    view.setUint16(34, bitsPerSample, true) // Bits per sample

    // data sub-chunk
    view.setUint32(36, 0x64617461, false) // "data"
    view.setUint32(40, dataSize, true) // Data size

    return new Uint8Array(header)
  }

  /**
   * Upload audio chunk as WAV file
   */
  private async uploadAudioChunk(sessionId: string, chunkNumber: number, wavData: Uint8Array): Promise<boolean> {
    try {
      const fileName = `${this.audioStorageFolder}/${sessionId}/audio_chunk_${chunkNumber}.wav`

      const {data, error} = await this.supabaseAuth
        .getSupabaseClient()
        .storage.from(this.storageBucket)
        .upload(fileName, wavData, {
          contentType: "audio/wav",
          upsert: true
        })

      if (error) {
        this.logError(`Audio upload failed: ${JSON.stringify(error)}`)
        return false
      }

      return true
    } catch (error) {
      this.logError(`Failed to upload audio chunk ${chunkNumber}: ${error}`)
      return false
    }
  }

  /**
   * Update status text
   */
  private updateStatus(message: string) {
    if (this.statusText) {
      this.statusText.text = message
    }
    this.log(`Status: ${message}`)
  }

  /**
   * Update button text based on recording state
   */
  private updateButtonText() {
    if (this.buttonText) {
      if (this.isRecording) {
        this.buttonText.text = "Stop Composite Recording"
      } else {
        this.buttonText.text = "Start Composite Recording"
      }
    }
  }

  /**
   * Update preview to show what will be captured
   */
  private updatePreview() {
    if (this.previewImage) {
      if (this.useCompositeTexture && this.compositeTexture) {
        this.previewImage.mainPass.baseTex = this.compositeTexture
        this.log("Preview: showing composite texture (AR content included)")
      } else {
        const cameraTexture = this.videoCapture.getCameraTexture()
        if (cameraTexture) {
          this.previewImage.mainPass.baseTex = cameraTexture
          this.log("Preview: showing camera texture")
        }
      }
    }
  }

  /**
   * Delay utility using DelayedCallbackEvent (Lens Studio alternative to setTimeout)
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
    // Stop recording if active
    if (this.isRecording) {
      this.stopRecording()
    }

    // Disable frame capture UpdateEvent
    if (this.frameUpdateEvent) {
      this.frameUpdateEvent.enabled = false
    }

    // Clear max duration timer
    this.recordingTimer = null

    // Clear stored data
    this.storedFrames = []
    this.storedRawAudioChunks = []
  }

  /**
   * Logging helpers
   */
  private log(message: string) {
    if (this.enableDebugLogs) {
      print(`[CompositeCaptureUploader] ${message}`)
    }
  }

  private logError(message: string) {
    print(`[CompositeCaptureUploader] ERROR: ${message}`)
  }
}
