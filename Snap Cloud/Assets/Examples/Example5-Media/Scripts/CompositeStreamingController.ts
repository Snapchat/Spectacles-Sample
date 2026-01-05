import {RectangleButton} from "SpectaclesUIKit.lspkg/Scripts/Components/Button/RectangleButton"
import {Switch} from "SpectaclesUIKit.lspkg/Scripts/Components/Switch/Switch"
import {CameraService} from "../../../CompositeCameraModified/Scripts/CameraService"
import {AudioCaptureUtility, SessionUtility, SupabaseAuthUtility, VideoCaptureUtility} from "./CaptureUtilities"
import {SnapCloudRequirements} from "./SnapCloudRequirements"

/**
 * CompositeStreamingController - Synchronized live video and audio streaming
 *
 * COMPOSITE STREAMING: Streams both video frames and audio chunks simultaneously
 * via Supabase Realtime with synchronized session IDs for real-time viewing/listening.
 *
 * KEY FEATURES:
 * - Shared session ID for video and audio streams
 * - Synchronized timestamps for proper alignment
 * - Real-time transmission via Supabase Realtime
 * - Frame markers and audio chunks for streaming reconstruction
 */
@component
export class CompositeStreamingController extends BaseScriptComponent {
  // Supabase Configuration
  @input
  @hint("Reference to SnapCloudRequirements for centralized Supabase configuration")
  public snapCloudRequirements: SnapCloudRequirements

  @input
  @hint("Supabase Realtime channel name for composite streaming")
  public streamingChannelName: string = "composite-live-stream"

  // Video Configuration
  @input
  @hint("Stream quality (lower = better performance, higher = better quality)")
  @widget(new SliderWidget(1, 100, 1))
  public streamQuality: number = 40

  @input
  @hint("Frames per second for video streaming")
  @widget(new SliderWidget(1, 30, 1))
  public streamFPS: number = 30

  @input
  @hint("Stream resolution scale (0.5 = half resolution)")
  @widget(new SliderWidget(0.1, 1.0, 0.1))
  public resolutionScale: number = 0.6

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
  @hint("Microphone audio track asset for streaming")
  public microphoneAsset: AudioTrackAsset

  @input
  @hint("Audio quality (samples per second)")
  @widget(new SliderWidget(8000, 48000, 1000))
  public sampleRate: number = 16000

  @input
  @hint("Audio chunk size (milliseconds)")
  @widget(new SliderWidget(50, 500, 50))
  public chunkSizeMs: number = 100

  @input
  @hint("Audio compression level (0-9, higher = more compression)")
  @widget(new SliderWidget(0, 9, 1))
  public compressionLevel: number = 3

  // UI Components
  @input
  @hint("Button to start/stop composite streaming")
  public streamButton: RectangleButton

  @input
  @hint("Switch to toggle between camera and composite streaming mode")
  @allowUndefined
  public compositeSwitch: Switch

  @input
  @hint("Text component to display streaming status")
  @allowUndefined
  public statusText: Text

  @input
  @hint("Text component to display button state")
  @allowUndefined
  public buttonText: Text

  @input
  @hint("Image component to show local preview")
  @allowUndefined
  public previewImage: Image

  // Debug Configuration
  @input
  @hint("Enable detailed debug logging")
  public enableDebugLogs: boolean = true

  // Private State
  private isStreaming: boolean = false
  private streamSessionId: string = ""
  private streamStartTime: number = 0

  // Video streaming state
  private frameCount: number = 0
  private lastFrameTime: number = 0
  private frameRegistration: any

  // Audio streaming state
  private audioChunkCount: number = 0
  private audioUpdateEvent: UpdateEvent
  private lastAudioChunkTime: number = 0

  // Utilities
  private videoCapture: VideoCaptureUtility
  private audioCapture: AudioCaptureUtility
  private supabaseAuth: SupabaseAuthUtility

  // Supabase Realtime streaming
  private realtimeChannel: any
  private isRealtimeConnected: boolean = false

  onAwake() {
    this.log("CompositeStreamingController initializing...")

    // Initialize utilities
    this.videoCapture = new VideoCaptureUtility(this.enableDebugLogs)
    this.audioCapture = new AudioCaptureUtility(this.enableDebugLogs)
    this.supabaseAuth = new SupabaseAuthUtility(this.enableDebugLogs)

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
      this.initializeCompositeStreaming()
    })

    // Cleanup on destroy
    this.createEvent("OnDestroyEvent").bind(() => {
      this.cleanup()
    })

    this.updateStatus("Ready for composite streaming")
    this.updateButtonText()
  }

  /**
   * Setup UI button and switch handlers - must be called after components are awake
   */
  private setupUIHandlers() {
    // Setup button handler - call initialize() first to ensure events are ready
    if (this.streamButton) {
      this.streamButton.initialize()
      this.streamButton.onTriggerUp.add(() => {
        this.onStreamButtonPressed()
      })
      this.log(" Stream button handler registered")
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
  }

  /**
   * Initialize composite streaming system
   */
  private async initializeCompositeStreaming() {
    this.log("=== COMPOSITE STREAMING INITIALIZATION START ===")

    // Initialize Supabase authentication with Realtime options
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
      this.processAudioForStreaming()
    })
    this.audioUpdateEvent.enabled = false

    // Initialize Realtime channel
    await this.initializeRealtimeChannel()

    this.log("=== COMPOSITE STREAMING INITIALIZATION COMPLETE ===")
  }

  /**
   * Initialize Supabase Realtime channel for composite streaming
   */
  private async initializeRealtimeChannel() {
    try {
      this.log("Initializing Supabase Realtime channel for composite streaming...")
      this.log(`Streaming channel: ${this.streamingChannelName}`)

      const supabaseClient = this.supabaseAuth.getSupabaseClient()
      if (!supabaseClient) {
        this.logError("Supabase client not initialized")
        return
      }

      // Create realtime channel for composite streaming
      this.realtimeChannel = supabaseClient.channel(this.streamingChannelName, {
        config: {
          broadcast: {self: false} // Don't receive own broadcasts
        }
      })

      // Listen for viewer connections and control messages
      this.realtimeChannel
        .on("broadcast", {event: "viewer-joined"}, (msg) => {
          this.log(`New composite viewer joined: ${msg.payload.viewerId}`)
        })
        .on("broadcast", {event: "viewer-left"}, (msg) => {
          this.log(`Composite viewer left: ${msg.payload.viewerId}`)
        })
        .on("broadcast", {event: "stream-control"}, (msg) => {
          this.handleStreamControl(msg.payload)
        })

      // Subscribe to channel
      this.realtimeChannel.subscribe(async (status) => {
        this.log(`Composite streaming channel status: ${status}`)

        if (status === "SUBSCRIBED") {
          this.log(" Composite streaming channel connected successfully!")
          this.isRealtimeConnected = true
          this.updateStatus("Ready for composite streaming")

          // Send stream initialization message
          this.sendStreamInitMessage()
        } else if (status === "CLOSED" || status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          this.log("Composite streaming channel closed or error occurred")
          this.isRealtimeConnected = false
          this.updateStatus("Streaming channel disconnected")
        }
      })
    } catch (error) {
      this.logError(`Failed to initialize composite streaming channel: ${error}`)
      this.updateStatus("Streaming channel initialization failed")
    }
  }

  /**
   * Send composite stream initialization message
   */
  private sendStreamInitMessage() {
    this.log(`Composite stream channel: ${this.streamingChannelName}`)

    // Send composite stream initialization
    this.sendStreamMessage({
      event: "composite-stream-init",
      payload: {
        channelName: this.streamingChannelName,
        streamerId: this.supabaseAuth.getUserId() || "spectacles_user",
        timestamp: Date.now(),
        settings: {
          video: {
            fps: this.streamFPS,
            quality: this.streamQuality,
            resolution: this.resolutionScale
          },
          audio: {
            sampleRate: this.sampleRate,
            chunkSizeMs: this.chunkSizeMs,
            compression: this.compressionLevel
          }
        }
      }
    })
  }

  /**
   * Handle stream control messages
   */
  private handleStreamControl(payload: any) {
    switch (payload.action) {
      case "request-higher-quality":
        this.log("Viewer requested higher quality")
        this.streamQuality = Math.min(this.streamQuality + 20, 100)
        break
      case "request-lower-quality":
        this.log("Viewer requested lower quality due to bandwidth")
        this.streamQuality = Math.max(this.streamQuality - 20, 20)
        break
      case "mute-audio":
        this.log("Audio muted by viewer/admin")
        // Could implement audio muting here
        break
      case "stop-stream":
        this.log("Composite stream stopped by viewer/admin")
        this.stopStreaming()
        break
      default:
        this.log(`Unknown composite stream control action: ${payload.action}`)
    }
  }

  /**
   * Handle stream button press
   */
  private onStreamButtonPressed() {
    if (this.isStreaming) {
      this.stopStreaming()
    } else {
      this.startStreaming()
    }
    this.updateButtonText()
  }

  /**
   * Start synchronized video and audio streaming
   */
  private startStreaming() {
    if (!this.isRealtimeConnected) {
      this.logError("Realtime not ready for streaming")
      this.updateStatus("Streaming not ready")
      return
    }

    const cameraTextureProvider = this.videoCapture.getCameraTextureProvider()
    if (!cameraTextureProvider) {
      this.logError("Camera not ready for streaming")
      this.updateStatus("Camera not ready")
      return
    }

    this.log("Starting composite streaming...")
    this.isStreaming = true
    this.streamSessionId = SessionUtility.generateSessionId("composite_stream")
    this.streamStartTime = Date.now()
    this.frameCount = 0
    this.audioChunkCount = 0
    this.lastFrameTime = 0
    this.lastAudioChunkTime = 0

    this.updateStatus("Streaming video + audio live...")
    this.updateButtonText()

    // Start audio streaming
    this.audioCapture.startRecording()
    this.audioUpdateEvent.enabled = true

    // Calculate frame interval based on desired FPS
    const frameInterval = 1000 / this.streamFPS

    // Start video streaming (Remote ARsistance pattern)
    this.frameRegistration = cameraTextureProvider.onNewFrame.add(() => {
      const currentTime = Date.now()

      // Check if we should stream this frame based on FPS
      if (currentTime - this.lastFrameTime >= frameInterval) {
        this.lastFrameTime = currentTime
        this.streamVideoFrame(currentTime)
      }
    })

    // Notify viewers that composite stream started
    this.sendStreamMessage({
      event: "composite-stream-started",
      payload: {
        sessionId: this.streamSessionId,
        timestamp: Date.now(),
        streamType: "composite"
      }
    })

    this.log("Composite streaming started successfully")
  }

  /**
   * Stream video frame via Realtime
   */
  private async streamVideoFrame(timestamp: number) {
    if (!this.isStreaming) return

    this.frameCount++

    try {
      // Choose between composite texture or camera texture
      let textureToStream: Texture
      let textureSource: string

      if (this.useCompositeTexture && this.compositeTexture) {
        textureToStream = this.compositeTexture
        textureSource = "composite"
      } else {
        textureToStream = this.videoCapture.getCameraTexture()
        textureSource = "camera"
      }

      if (!textureToStream) {
        this.logError(`${textureSource} texture not available for streaming`)
        return
      }

      // Convert texture to base64 with frame marker (Remote ARsistance pattern)
      const base64Frame = await this.textureToBase64(textureToStream)
      const frameData = base64Frame + "|||FRAME_END|||"

      // Send video frame via Realtime broadcast
      this.sendStreamMessage({
        event: "composite-video-frame",
        payload: {
          sessionId: this.streamSessionId,
          frameNumber: this.frameCount,
          timestamp: timestamp,
          frameData: frameData,
          metadata: {
            fps: this.streamFPS,
            quality: this.streamQuality,
            resolution: this.resolutionScale,
            source: textureSource // Track whether using camera or composite
          }
        }
      })
    } catch (error) {
      this.logError(`Failed to stream video frame ${this.frameCount}: ${error}`)
    }
  }

  /**
   * Process and stream audio
   */
  private processAudioForStreaming() {
    if (!this.isStreaming) return

    const audioFrame = this.audioCapture.processAudioFrame()
    if (!audioFrame) return

    // Check if enough time has passed for audio chunk
    const currentTime = Date.now()
    if (currentTime - this.lastAudioChunkTime >= this.chunkSizeMs) {
      this.streamAudioChunk(currentTime)
      this.lastAudioChunkTime = currentTime
    }
  }

  /**
   * Stream audio chunk via Realtime
   */
  private streamAudioChunk(timestamp: number) {
    try {
      this.audioChunkCount++

      // Get current audio buffer
      const audioFrames = this.audioCapture.getCurrentAudioBuffer()
      if (audioFrames.length === 0) return

      // Combine audio frames and convert to base64
      const combinedAudio = this.combineAudioFrames(audioFrames)
      const audioData = this.audioArrayToBase64(combinedAudio)

      // Send audio chunk via Realtime broadcast
      this.sendStreamMessage({
        event: "composite-audio-chunk",
        payload: {
          sessionId: this.streamSessionId,
          chunkNumber: this.audioChunkCount,
          timestamp: timestamp,
          audioData: audioData,
          sampleRate: this.sampleRate,
          samples: combinedAudio.length
        }
      })

      // Clear the audio buffer after streaming
      this.audioCapture.clearAudioBuffer()
    } catch (error) {
      this.logError(`Failed to stream audio chunk ${this.audioChunkCount}: ${error}`)
    }
  }

  /**
   * Convert texture to base64 for streaming
   */
  private async textureToBase64(texture: Texture): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const compressionQuality =
          this.streamQuality > 70 ? CompressionQuality.HighQuality : CompressionQuality.IntermediateQuality

        Base64.encodeTextureAsync(
          texture,
          (encodedString: string) => {
            resolve(encodedString)
          },
          () => {
            reject(new Error("Base64 encoding failed"))
          },
          compressionQuality,
          EncodingType.Jpg
        )
      } catch (error) {
        reject(error)
      }
    })
  }

  /**
   * Combine audio frames into single Float32Array
   */
  private combineAudioFrames(frames: Float32Array[]): Float32Array {
    if (frames.length === 0) return new Float32Array(0)

    let totalSamples = 0
    for (const frame of frames) {
      totalSamples += frame.length
    }

    const combined = new Float32Array(totalSamples)
    let offset = 0
    for (const frame of frames) {
      combined.set(frame, offset)
      offset += frame.length
    }

    return combined
  }

  /**
   * Convert Float32Array audio data to WAV format base64 for streaming (same as AudioStreamingController)
   */
  private audioArrayToBase64(audioArray: Float32Array): string {
    // Convert Float32Array to WAV format
    const wavData = this.audioArrayToWav(audioArray)

    // Convert WAV data to base64 for transmission
    return this.uint8ArrayToBase64(wavData)
  }

  /**
   * Convert Float32Array to WAV format Uint8Array (same as AudioStreamingController)
   */
  private audioArrayToWav(audioArray: Float32Array): Uint8Array {
    const totalSamples = audioArray.length

    // Convert Float32 audio to 16-bit PCM for WAV
    const pcmData = new Int16Array(totalSamples)

    for (let i = 0; i < totalSamples; i++) {
      // Convert Float32 (-1.0 to 1.0) to Int16 (-32768 to 32767)
      const sample = Math.max(-1, Math.min(1, audioArray[i]))
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
   * Create WAV file header (same as AudioStreamingController)
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
   * Convert Uint8Array to base64 string
   */
  private uint8ArrayToBase64(bytes: Uint8Array): string {
    // Convert to binary string
    let binary = ""
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i])
    }

    // Simple base64 encoding
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
    let result = ""
    let i = 0

    while (i < binary.length) {
      const a = binary.charCodeAt(i++)
      const b = i < binary.length ? binary.charCodeAt(i++) : 0
      const c = i < binary.length ? binary.charCodeAt(i++) : 0

      const bitmap = (a << 16) | (b << 8) | c

      result += chars.charAt((bitmap >> 18) & 63)
      result += chars.charAt((bitmap >> 12) & 63)
      result += i - 2 < binary.length ? chars.charAt((bitmap >> 6) & 63) : "="
      result += i - 1 < binary.length ? chars.charAt(bitmap & 63) : "="
    }

    return result
  }

  /**
   * Stop composite streaming
   */
  private stopStreaming() {
    if (!this.isStreaming) return

    this.log("Stopping composite streaming...")
    this.isStreaming = false

    // Stop video streaming
    if (this.frameRegistration) {
      const cameraTextureProvider = this.videoCapture.getCameraTextureProvider()
      if (cameraTextureProvider) {
        cameraTextureProvider.onNewFrame.remove(this.frameRegistration)
      }
      this.frameRegistration = null
    }

    // Stop audio streaming
    this.audioCapture.stopRecording()
    this.audioUpdateEvent.enabled = false

    // Notify viewers that composite stream ended
    this.sendStreamMessage({
      event: "composite-stream-ended",
      payload: {
        sessionId: this.streamSessionId,
        timestamp: Date.now(),
        totalFrames: this.frameCount,
        totalAudioChunks: this.audioChunkCount,
        duration: Date.now() - this.streamStartTime
      }
    })

    const duration = (Date.now() - this.streamStartTime) / 1000
    this.log(
      `Composite streaming complete: ${this.frameCount} frames, ${this.audioChunkCount} audio chunks in ${duration.toFixed(1)}s`
    )
    this.updateStatus(`Stream ended: ${this.frameCount} frames + ${this.audioChunkCount} audio chunks`)
    this.updateButtonText()
  }

  /**
   * Send message via Supabase Realtime
   */
  private sendStreamMessage(message: {event: string; payload: any}) {
    if (this.realtimeChannel && this.isRealtimeConnected) {
      try {
        this.realtimeChannel.send({
          type: "broadcast",
          event: message.event,
          payload: message.payload
        })
      } catch (error) {
        this.logError(`Failed to send composite stream message: ${error}`)
      }
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
   * Update button text based on streaming state
   */
  private updateButtonText() {
    if (this.buttonText) {
      if (this.isStreaming) {
        this.buttonText.text = "Stop Composite Stream"
      } else {
        this.buttonText.text = "Start Composite Stream"
      }
    }
  }

  /**
   * Update preview to show what will be streamed
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
   * Cleanup resources
   */
  private cleanup() {
    // Stop streaming if active
    if (this.isStreaming) {
      this.stopStreaming()
    }

    // Close Realtime connection
    if (this.realtimeChannel && this.isRealtimeConnected) {
      this.log("Closing composite streaming channel...")
      const supabaseClient = this.supabaseAuth.getSupabaseClient()
      if (supabaseClient) {
        supabaseClient.removeChannel(this.realtimeChannel)
      }
      this.isRealtimeConnected = false
    }
  }

  /**
   * Logging helpers
   */
  private log(message: string) {
    if (this.enableDebugLogs) {
      print(`[CompositeStreamingController] ${message}`)
    }
  }

  private logError(message: string) {
    print(`[CompositeStreamingController] ERROR: ${message}`)
  }
}
