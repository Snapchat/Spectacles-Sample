import {RectangleButton} from "SpectaclesUIKit.lspkg/Scripts/Components/Button/RectangleButton"
import {createClient} from "SupabaseClient.lspkg/supabase-snapcloud"
import {SnapCloudRequirements} from "./SnapCloudRequirements"

/**
 * Audio frame data structure for recording
 */
type AudioFrameData = {
  audioFrame: Float32Array
  audioFrameShape: vec3
  timestamp: number
}

/**
 * AudioCaptureUploader - Captures audio from Spectacles microphone and uploads to Supabase storage
 * Handles recording audio chunks for later processing/composition
 *
 * KEY DIFFERENCE from AudioStreamingController:
 * - This UPLOADS for audio files (stores files)
 * - AudioStreamingController STREAMS for live communication (no storage)
 */
@component
export class AudioCaptureUploader extends BaseScriptComponent {
  // Core Modules
  private internetModule: InternetModule = require("LensStudio:InternetModule")

  // Supabase Configuration
  @input
  @hint("Reference to SnapCloudRequirements for centralized Supabase configuration")
  public snapCloudRequirements: SnapCloudRequirements

  @input
  @hint("Supabase Storage bucket name for audio chunks")
  public storageBucket: string = "specs-bucket"

  @input
  @hint("Supabase Storage folder path for audio uploads")
  public storageFolder: string = "audio-recordings"

  // Audio Configuration
  @input
  @hint("Microphone audio track asset for recording")
  public microphoneAsset: AudioTrackAsset

  @input
  @hint("Audio sample rate (Hz) - Use 16000 for voice, higher rates may cause chipmunk effect if not supported")
  @widget(new SliderWidget(8000, 48000, 1000))
  public sampleRate: number = 16000

  @input
  @hint("Audio chunk size in milliseconds")
  @widget(new SliderWidget(100, 2000, 100))
  public chunkDurationMs: number = 1000

  // UI Components
  @input
  @hint("Button to start/stop audio recording")
  public recordButton: RectangleButton

  @input
  @hint("Text component to display status")
  @allowUndefined
  public statusText: Text

  @input
  @hint("Text component to display button state (Start/Stop)")
  @allowUndefined
  public buttonText: Text

  // Debug Configuration
  @input
  @hint("Enable detailed debug logging")
  public enableDebugLogs: boolean = true

  @input
  @hint("Test with single audio chunk capture before continuous")
  public testSingleChunk: boolean = false

  // Private State
  private isRecording: boolean = false
  private sessionId: string = ""
  private chunkCount: number = 0
  private recordingStartTime: number = 0

  // Audio Components
  private microphoneControl: MicrophoneAudioProvider
  private recordAudioUpdateEvent: UpdateEvent
  private recordedAudioFrames: AudioFrameData[] = []
  private numberOfSamples: number = 0
  private recordingDuration: number = 0

  // Authentication tracking
  private supabaseClient: any
  private uid: string
  private isAuthenticated: boolean = false

  onAwake() {
    this.log("AudioCaptureUploader initializing...")

    // Validate requirements
    if (!this.snapCloudRequirements) {
      this.logError("SnapCloudRequirements not configured! Please assign in Inspector.")
      return
    }

    if (!this.microphoneAsset) {
      this.logError("MicrophoneAsset not configured! Please assign an AudioTrackAsset in Inspector.")
      return
    }

    // Initialize on start - button initialization must happen after components are awake
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
   * Setup UI button handlers - must be called after components are awake
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
  }

  /**
   * Initialize Supabase authentication
   */
  private async initializeSupabaseAuthentication() {
    this.log("=== AUDIO AUTHENTICATION START ===")

    if (!this.snapCloudRequirements || !this.snapCloudRequirements.isConfigured()) {
      this.logError("SnapCloudRequirements not configured")
      return
    }

    const supabaseProject = this.snapCloudRequirements.getSupabaseProject()
    this.log(`Supabase URL: ${supabaseProject.url}`)

    // Create Supabase client for audio uploads
    this.supabaseClient = createClient(supabaseProject.url, supabaseProject.publicToken)

    this.log("Supabase client created for audio uploads")

    if (this.supabaseClient) {
      await this.signInUser()
      this.initializeAudio()
    }
  }

  /**
   * Sign in user using Snap Cloud authentication
   */
  private async signInUser() {
    this.log("Attempting Snap Cloud authentication...")

    try {
      const {data, error} = await this.supabaseClient.auth.signInWithIdToken({
        provider: "snapchat",
        token: ""
      })

      if (error) {
        this.logError("Sign in error: " + JSON.stringify(error))
        this.isAuthenticated = false
      } else {
        const {user} = data
        if (user?.id) {
          this.uid = user.id
          this.isAuthenticated = true
          this.log(` Authenticated as user: ${this.uid}`)
        } else {
          this.logError("User ID not found in authentication response")
          this.isAuthenticated = false
        }
      }
    } catch (error) {
      this.logError(`Authentication exception: ${error}`)
      this.isAuthenticated = false
    }

    this.log("=== AUDIO AUTHENTICATION END ===")
  }

  /**
   * Initialize audio recording components
   */
  private initializeAudio() {
    try {
      this.log("Initializing audio recording...")

      // Initialize microphone control and set sample rate
      this.microphoneControl = this.microphoneAsset.control as MicrophoneAudioProvider

      this.log(`Requested sample rate: ${this.sampleRate} Hz`)
      this.microphoneControl.sampleRate = this.sampleRate

      // Read back the actual sample rate (may differ from requested)
      const actualSampleRate = this.microphoneControl.sampleRate
      this.log(`Actual microphone sample rate: ${actualSampleRate} Hz`)

      if (actualSampleRate !== this.sampleRate) {
        this.log(`⚠️ Sample rate mismatch! Requested ${this.sampleRate}, got ${actualSampleRate}`)
        this.log(`Using actual rate ${actualSampleRate} for WAV encoding to prevent pitch issues`)
        this.sampleRate = actualSampleRate // Use actual rate for correct playback
      }

      // Create audio update event for recording
      this.recordAudioUpdateEvent = this.createEvent("UpdateEvent")
      this.recordAudioUpdateEvent.bind(() => {
        this.onRecordAudio()
      })
      this.recordAudioUpdateEvent.enabled = false

      this.log(`Audio recording initialized - Sample rate: ${this.sampleRate} Hz`)
      this.updateStatus(`Audio ready (${this.sampleRate} Hz)`)
    } catch (error) {
      this.logError(`Failed to initialize audio: ${error}`)
      this.updateStatus("Audio initialization failed")
    }
  }

  /**
   * Handle record button press - toggle recording
   */
  private onRecordButtonPressed() {
    if (this.isRecording) {
      this.stopRecording()
    } else {
      if (this.testSingleChunk) {
        this.captureAudioChunk()
      } else {
        this.startRecording()
      }
    }
    this.updateButtonText()
  }

  /**
   * Capture a single audio chunk for testing
   */
  private async captureAudioChunk() {
    this.log("Capturing single audio chunk...")
    this.updateStatus("Capturing audio chunk...")

    try {
      // Generate session ID for this capture
      this.sessionId = this.generateSessionId()

      // Record audio for chunk duration
      this.microphoneControl.start()
      this.recordAudioUpdateEvent.enabled = true

      // Stop after chunk duration using DelayedCallbackEvent
      const stopTimer = this.createEvent("DelayedCallbackEvent")
      stopTimer.bind(() => {
        this.microphoneControl.stop()
        this.recordAudioUpdateEvent.enabled = false
        this.finalizeSingleChunk()
      })
      stopTimer.reset(this.chunkDurationMs / 1000) // Convert ms to seconds
    } catch (error) {
      this.logError(`Single audio chunk capture failed: ${error}`)
      this.updateStatus("Capture failed")
    }
  }

  /**
   * Finalize single chunk capture and upload
   */
  private async finalizeSingleChunk() {
    if (this.recordedAudioFrames.length === 0) {
      this.logError("No audio frames recorded")
      this.updateStatus("No audio captured")
      return
    }

    this.log(`Captured ${this.recordedAudioFrames.length} audio frames`)

    // Convert audio frames to uploadable data
    const audioData = this.audioFramesToByteArray(this.recordedAudioFrames)

    // Upload audio chunk
    const uploadSuccess = await this.uploadAudioChunk(this.sessionId, 0, audioData, Date.now())

    if (uploadSuccess) {
      this.log("Audio chunk uploaded successfully!")
      this.updateStatus("Audio chunk uploaded!")
    } else {
      this.logError("Failed to upload audio chunk")
      this.updateStatus("Upload failed")
    }

    // Clean up
    this.recordedAudioFrames = []
    this.numberOfSamples = 0
  }

  /**
   * Start continuous audio recording
   */
  private startRecording() {
    if (!this.microphoneControl) {
      this.logError("Audio not initialized")
      return
    }

    this.log("Starting continuous audio recording...")
    this.isRecording = true
    this.sessionId = this.generateSessionId()
    this.chunkCount = 0
    this.recordingStartTime = Date.now()
    this.recordedAudioFrames = []
    this.numberOfSamples = 0

    this.updateStatus("Recording audio...")
    this.updateButtonText()

    // Start microphone and audio processing
    this.microphoneControl.start()
    this.recordAudioUpdateEvent.enabled = true

    this.log("Audio recording started")
  }

  /**
   * Stop audio recording
   */
  private async stopRecording() {
    if (!this.isRecording) return

    this.log("Stopping audio recording...")
    this.isRecording = false

    // Stop microphone recording
    this.microphoneControl.stop()
    this.recordAudioUpdateEvent.enabled = false

    // Process final audio chunk
    await this.processFinalAudioChunk()

    const duration = (Date.now() - this.recordingStartTime) / 1000
    this.log(`Audio recording complete: ${this.chunkCount} chunks in ${duration.toFixed(1)}s`)
    this.updateStatus(`Audio complete: ${this.chunkCount} chunks recorded`)
    this.updateButtonText()
  }

  /**
   * Record audio frame (called every update when recording)
   */
  private onRecordAudio() {
    if (!this.isRecording || !this.microphoneControl) return

    const frameSize: number = this.microphoneControl.maxFrameSize
    let audioFrame = new Float32Array(frameSize)

    // Get audio frame shape
    const audioFrameShape = this.microphoneControl.getAudioFrame(audioFrame)

    // If no audio data, return early
    if (audioFrameShape.x === 0) {
      return
    }

    // Reduce the subarray size to the actual data
    audioFrame = audioFrame.subarray(0, audioFrameShape.x)

    // Update samples and duration
    this.numberOfSamples += audioFrameShape.x
    this.recordingDuration = this.numberOfSamples / this.sampleRate

    // Store the recorded audio frame with timestamp
    this.recordedAudioFrames.push({
      audioFrame: audioFrame,
      audioFrameShape: audioFrameShape,
      timestamp: Date.now()
    })

    // Process chunk when we have enough audio data
    const chunkSamples = (this.chunkDurationMs / 1000) * this.sampleRate
    if (this.numberOfSamples >= chunkSamples) {
      this.processAudioChunk()
    }
  }

  /**
   * Process and upload a chunk of audio data
   */
  private async processAudioChunk() {
    if (this.recordedAudioFrames.length === 0) return

    this.chunkCount++

    try {
      this.log(`=== PROCESSING AUDIO CHUNK ${this.chunkCount} ===`)
      this.log(`Frames to process: ${this.recordedAudioFrames.length}`)
      this.log(`Total samples: ${this.numberOfSamples}`)
      this.log(`Expected duration: ${((this.numberOfSamples / this.sampleRate) * 1000).toFixed(1)}ms`)

      // Convert audio frames to byte array (WAV format)
      const audioData = this.audioFramesToByteArray(this.recordedAudioFrames)

      // Upload audio chunk
      await this.uploadAudioChunk(this.sessionId, this.chunkCount, audioData, this.recordedAudioFrames[0].timestamp)

      // Update status with chunk info
      const duration = Math.floor((Date.now() - this.recordingStartTime) / 1000)
      const chunkDurationMs = this.calculateWavDurationMs(audioData)
      this.updateStatus(`Recording: ${this.chunkCount} chunks (${duration}s) - Last: ${chunkDurationMs}ms`)

      this.log(`=== CHUNK ${this.chunkCount} COMPLETE ===`)

      // Clear processed frames
      this.recordedAudioFrames = []
      this.numberOfSamples = 0
    } catch (error) {
      this.logError(`Failed to process audio chunk ${this.chunkCount}: ${error}`)
    }
  }

  /**
   * Process final audio chunk when stopping
   */
  private async processFinalAudioChunk() {
    if (this.recordedAudioFrames.length > 0) {
      await this.processAudioChunk()
    }
  }

  /**
   * Convert audio frames to WAV format byte array
   */
  private audioFramesToByteArray(frames: AudioFrameData[]): Uint8Array {
    // Calculate total samples
    let totalSamples = 0
    for (const frame of frames) {
      totalSamples += frame.audioFrame.length
    }

    this.log(`Converting ${frames.length} frames with ${totalSamples} total samples to WAV`)

    // Convert Float32 audio to 16-bit PCM for WAV
    const pcmData = new Int16Array(totalSamples)
    let offset = 0

    for (const frame of frames) {
      for (let i = 0; i < frame.audioFrame.length; i++) {
        // Convert Float32 (-1.0 to 1.0) to Int16 (-32768 to 32767)
        const sample = Math.max(-1, Math.min(1, frame.audioFrame[i]))
        pcmData[offset + i] = sample * 32767
      }
      offset += frame.audioFrame.length
    }

    // Create WAV header
    const wavHeader = this.createWavHeader(totalSamples, this.sampleRate, 1, 16)

    // Combine header and PCM data
    const wavData = new Uint8Array(wavHeader.length + pcmData.length * 2)
    wavData.set(wavHeader, 0)
    wavData.set(new Uint8Array(pcmData.buffer), wavHeader.length)

    const durationSeconds = totalSamples / this.sampleRate
    this.log(`Created WAV file: ${totalSamples} samples, ${durationSeconds.toFixed(3)}s duration`)

    return wavData
  }

  /**
   * Create WAV file header
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
   * Upload audio chunk to Supabase Storage
   */
  private async uploadAudioChunk(
    sessionId: string,
    chunkNumber: number,
    data: Uint8Array,
    timestamp: number
  ): Promise<boolean> {
    return this.uploadAudioToSupabase(sessionId, chunkNumber, data, timestamp)
  }

  /**
   * Upload audio chunk to Supabase Storage
   */
  private async uploadAudioToSupabase(
    sessionId: string,
    chunkNumber: number,
    data: Uint8Array,
    timestamp: number
  ): Promise<boolean> {
    try {
      // Calculate duration from the WAV data
      const durationMs = this.calculateWavDurationMs(data)

      this.log(`Uploading audio chunk ${chunkNumber} to Supabase...`)
      this.log(`Chunk size: ${data.length} bytes, Duration: ${durationMs}ms`)

      if (!this.supabaseClient || !this.isAuthenticated) {
        this.logError("Supabase client not initialized or not authenticated")
        return false
      }

      // Save as .wav file instead of .raw
      const fileName = `${this.storageFolder}/${sessionId}/chunk_${String(chunkNumber).padStart(5, "0")}.wav`

      const {data: uploadData, error} = await this.supabaseClient.storage
        .from(this.storageBucket)
        .upload(fileName, data, {
          contentType: "audio/wav",
          upsert: true
        })

      if (error) {
        this.logError(` Audio upload failed: ${JSON.stringify(error)}`)
        return false
      } else {
        this.log(` Audio chunk ${chunkNumber} uploaded successfully as WAV!`)
        this.log(`File: ${fileName} (${durationMs}ms, ${data.length} bytes)`)

        // Log metadata for testing/debugging
        this.log(`Audio metadata: Sample Rate: ${this.sampleRate}Hz, Format: 16-bit PCM, Channels: 1`)

        // Generate public URL for testing
        this.generatePublicUrlForTesting(fileName)

        return true
      }
    } catch (error) {
      this.logError(`Failed to upload audio chunk ${chunkNumber}: ${error}`)
      return false
    }
  }

  /**
   * Calculate duration of WAV data in milliseconds
   */
  private calculateWavDurationMs(wavData: Uint8Array): number {
    try {
      // WAV header is 44 bytes, audio data starts after that
      const audioDataSize = wavData.length - 44

      // 16-bit PCM mono: 2 bytes per sample
      const numSamples = audioDataSize / 2

      // Duration = samples / sample rate
      const durationSeconds = numSamples / this.sampleRate
      const durationMs = durationSeconds * 1000

      return Math.round(durationMs)
    } catch (error) {
      this.logError(`Failed to calculate WAV duration: ${error}`)
      return 0
    }
  }

  /**
   * Generate public URL for testing uploaded audio chunks
   */
  private async generatePublicUrlForTesting(fileName: string) {
    try {
      if (!this.supabaseClient) return

      const {data, error} = await this.supabaseClient.storage.from(this.storageBucket).createSignedUrl(fileName, 3600) // 1 hour expiry

      if (error) {
        this.log(`Could not generate test URL: ${error.message}`)
      } else {
        this.log(` TEST URL (1h expiry): ${data.signedUrl}`)
        this.log(` Copy this URL to test the audio chunk in your browser`)
      }
    } catch (error) {
      this.log(`Error generating test URL: ${error}`)
    }
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 9)
    return `audio_session_${timestamp}_${random}`
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
        this.buttonText.text = "Stop Recording Audio"
      } else {
        this.buttonText.text = "Start Recording Audio"
      }
    }
  }

  /**
   * Cleanup resources
   */
  private cleanup() {
    // Stop recording if active
    if (this.isRecording) {
      this.microphoneControl.stop()
      this.recordAudioUpdateEvent.enabled = false
    }

    // Clear audio buffers and reset state

    this.recordedAudioFrames = []
  }

  /**
   * Logging helpers
   */
  private log(message: string) {
    if (this.enableDebugLogs) {
      print(`[AudioCaptureUploader] ${message}`)
    }
  }

  private logError(message: string) {
    print(`[AudioCaptureUploader] ERROR: ${message}`)
  }
}
