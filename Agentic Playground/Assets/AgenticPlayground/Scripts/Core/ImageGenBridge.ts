import {setTimeout} from "SpectaclesInteractionKit.lspkg/Utils/FunctionTimingUtils"
import {ImageGen} from "./ImageGen"

/**
 * ImageGenBridge - Bridge component for image generation in diagram system
 *
 * UI management layer that delegates core image generation to ImageGen factory
 * Handles spinners, text displays, and user interaction
 */
@component
export class ImageGenBridge extends BaseScriptComponent {
  @input
  @hint("Image component to display generated image")
  private image: Image

  @input
  @hint("Text component to display status")
  private textDisplay: Text

  @input
  @hint("Spinner/loading indicator")
  private spinner: SceneObject

  @input
  @hint("ImageGen factory component for core image generation")
  private imageGenFactory: ImageGen

  @input
  @widget(new ComboBoxWidget([new ComboBoxItem("OpenAI", "OpenAI"), new ComboBoxItem("Gemini", "Gemini")]))
  private modelProvider: string = "OpenAI"

  @input
  @hint("Test generation on awake with this prompt")
  private testOnAwake: boolean = false

  @input
  @widget(new TextAreaWidget())
  private testPrompt: string = "A beautiful landscape"

  @input
  @hint("Enable debug logging")
  private enableDebugLogging: boolean = false

  private isGenerating: boolean = false
  private isInitialized: boolean = false
  private callbackInvoked: boolean = false

  // External completion callbacks
  private onExternalSuccess: (() => void) | null = null
  private onExternalFailure: ((error: string) => void) | null = null

  onAwake() {
    this.initializeFactory()
    this.setupImageComponent()

    this.createEvent("OnStartEvent").bind(() => {
      if (this.spinner) {
        this.spinner.enabled = false
      }

      if (this.testOnAwake && this.testPrompt) {
        this.generateImage(this.testPrompt)
      }
    })

    if (this.enableDebugLogging) {
      print("ImageGenBridge: Image generation bridge initialized")
    }
  }

  private initializeFactory(): void {
    if (!this.imageGenFactory) {
      if (this.enableDebugLogging) {
        print("ImageGenBridge: ImageGen factory not assigned - skipping initialization")
      }
      this.isInitialized = false
      return
    }

    try {
      // Verify that the factory has the required methods
      if (typeof this.imageGenFactory.setImageCallback !== "function") {
        print("ImageGenBridge: ImageGen factory missing setImageCallback method")
        this.isInitialized = false
        return
      }

      if (typeof this.imageGenFactory.setFailureCallback !== "function") {
        print("ImageGenBridge: ImageGen factory missing setFailureCallback method")
        this.isInitialized = false
        return
      }

      // Set up callbacks for ImageGen to communicate back to this bridge
      this.imageGenFactory.setImageCallback((texture: Texture) => {
        this.applyGeneratedImage(texture)
      })

      this.imageGenFactory.setFailureCallback((error: string) => {
        this.handleError(error)
      })

      // Sync provider settings
      if (typeof this.imageGenFactory.switchProvider === "function") {
        this.imageGenFactory.switchProvider(this.modelProvider)
      }

      this.isInitialized = true

      if (this.enableDebugLogging) {
        print("ImageGenBridge: ImageGen factory integrated")
      }
    } catch (error) {
      print(`ImageGenBridge: Error initializing factory: ${error}`)
      this.isInitialized = false
    }
  }

  private setupImageComponent(): void {
    if (this.image) {
      // Clone the image material to avoid modifying the original
      const imgMat = this.image.mainMaterial.clone()
      this.image.clearMaterials()
      this.image.mainMaterial = imgMat

      if (this.enableDebugLogging) {
        print("ImageGenBridge: Image component configured")
      }
    }
  }

  /**
   * Generate image from text prompt
   * Delegates to ImageGen factory for core generation
   * @param prompt Text prompt for image generation
   * @param controlSpinner Whether this bridge should control its own spinner (default: true)
   * @returns Promise that resolves when image is generated
   */
  public async generateImage(prompt: string, controlSpinner: boolean = true): Promise<void> {
    if (this.isGenerating) {
      if (this.enableDebugLogging) {
        print("ImageGenBridge: ⏳ Already generating image")
      }
      return
    }

    if (!this.isInitialized || !this.imageGenFactory) {
      const error = "ImageGen factory not available - cannot generate image"
      if (this.enableDebugLogging) {
        print(`ImageGenBridge: ${error}`)
      }
      this.handleError(error)
      return // Don't throw error, just return gracefully
    }

    if (!prompt || prompt.trim() === "") {
      const error = "Invalid prompt provided"
      this.handleError(error)
      throw new Error(error)
    }

    this.isGenerating = true
    this.callbackInvoked = false // Reset callback tracking

    // Only control spinner if explicitly requested (standalone mode)
    if (controlSpinner) {
      if (this.spinner) {
        this.spinner.enabled = true
        print(`ImageGenBridge: Loading spinner enabled (standalone mode)`)
      } else {
        print(`ImageGenBridge: Loading spinner not assigned (standalone mode)`)
      }
    } else {
      print(`ImageGenBridge: Spinner control delegated to calling Node component`)
    }

    if (this.textDisplay) {
      this.textDisplay.text = "Generating: " + prompt
    }

    if (this.enableDebugLogging) {
      print(`ImageGenBridge: Delegating image generation: "${prompt}"`)
    }

    try {
      // Delegate to ImageGen factory for core generation
      const generatedTexture = await this.imageGenFactory.generateImage(prompt)

      if (this.enableDebugLogging) {
        print(`ImageGenBridge: Image generation completed for: "${prompt}"`)
      }

      // Image application is handled by callback from ImageGen
      // But we'll set a timeout to ensure spinner is disabled even if callback doesn't fire
      if (!controlSpinner && this.onExternalSuccess) {
        // Set a safety timeout to disable spinner if callback doesn't fire within 5 seconds
        const safetyTimeout = setTimeout(() => {
          if (this.isGenerating && !this.callbackInvoked) {
            print(`ImageGenBridge: Safety timeout - ensuring spinner is disabled`)
            this.callbackInvoked = true // Prevent double callback
            if (this.onExternalSuccess) {
              this.onExternalSuccess()
            }
            this.isGenerating = false
          }
        }, 5000)
      }
    } catch (error) {
      const errorMessage = `Image generation failed: ${error}`
      this.handleError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      this.isGenerating = false

      // Only control spinner if explicitly requested (standalone mode)
      if (controlSpinner && this.spinner) {
        this.spinner.enabled = false
        print(`ImageGenBridge: Loading spinner disabled (standalone mode)`)
      }
    }
  }

  /**
   * Apply generated image (called by ImageGen callback)
   */
  private applyGeneratedImage(texture: Texture): void {
    if (texture && this.image) {
      this.image.mainMaterial.mainPass.baseTex = texture

      if (this.textDisplay) {
        this.textDisplay.text = "Image Generated"
      }

      if (this.enableDebugLogging) {
        print("ImageGenBridge: Applied generated image")
      }

      // Notify external completion callback
      if (!this.callbackInvoked && this.onExternalSuccess) {
        this.callbackInvoked = true // Prevent double callback
        this.onExternalSuccess()
      }
    }
  }

  /**
   * Switch AI provider (OpenAI/Gemini)
   * @param provider Provider name
   */
  public switchProvider(provider: string): void {
    if (provider !== this.modelProvider) {
      this.modelProvider = provider

      // Update the ImageGen factory
      if (this.imageGenFactory) {
        this.imageGenFactory.switchProvider(provider)
      }

      if (this.enableDebugLogging) {
        print(`ImageGenBridge: Switched to provider: ${provider}`)
      }
    }
  }

  /**
   * Check if currently generating an image
   * @returns true if generation is in progress
   */
  public isGeneratingImage(): boolean {
    return this.isGenerating || (this.imageGenFactory ? this.imageGenFactory.isGeneratingImage() : false)
  }

  /**
   * Get current provider
   * @returns Current AI provider name
   */
  public getCurrentProvider(): string {
    return this.modelProvider
  }

  /**
   * Check if image generator is available and ready
   * @returns true if ready for generation
   */
  public isReady(): boolean {
    return (
      this.isInitialized &&
      !this.isGenerating &&
      (this.imageGenFactory ? !this.imageGenFactory.isGeneratingImage() : false)
    )
  }

  /**
   * Set a pre-existing texture to the image
   * @param texture Texture to apply
   */
  public setTexture(texture: Texture): void {
    if (this.imageGenFactory) {
      this.imageGenFactory.setTexture(texture)

      if (this.enableDebugLogging) {
        print("ImageGenBridge: 📎 Applied pre-existing texture via factory")
      }
    }
  }

  /**
   * Get the current image component
   * @returns Image component reference
   */
  public getImageComponent(): Image {
    return this.image
  }

  /**
   * Set external completion callbacks
   * @param onSuccess Callback when image is successfully generated and applied
   * @param onFailure Callback when image generation fails
   */
  public setExternalCallbacks(onSuccess: () => void, onFailure: (error: string) => void): void {
    this.onExternalSuccess = onSuccess
    this.onExternalFailure = onFailure
  }

  /**
   * Handle errors during image generation
   * @param error Error message
   */
  private handleError(error: string): void {
    print(`ImageGenBridge: ${error}`)

    if (this.textDisplay) {
      this.textDisplay.text = "Error: " + error
    }

    if (this.spinner) {
      this.spinner.enabled = false
    }

    this.isGenerating = false

    // Notify external failure callback
    if (!this.callbackInvoked && this.onExternalFailure) {
      this.callbackInvoked = true // Prevent double callback
      this.onExternalFailure(error)
    }
  }
}
