import { Gemini } from "RemoteServiceGateway.lspkg/HostedExternal/Gemini";
import { GeminiTypes } from "RemoteServiceGateway.lspkg/HostedExternal/GeminiTypes";
import { OpenAI } from "RemoteServiceGateway.lspkg/HostedExternal/OpenAI";
import { OpenAITypes } from "RemoteServiceGateway.lspkg/HostedExternal/OpenAITypes";

/**
 * ImageGen - Core Image Generation Factory
 * Direct interface to OpenAI/Gemini APIs for image generation
 * This IS the factory - no external dependencies needed
 */
@component
export class ImageGen extends BaseScriptComponent {
  @input
  @allowUndefined
  @hint("Image component to display generated image")
  private image: Image;

  @input
  @widget(
    new ComboBoxWidget([
      new ComboBoxItem("OpenAI", "OpenAI"),
      new ComboBoxItem("Gemini", "Gemini"),
    ])
  )
  private modelProvider: string = "OpenAI";

  @input
  @hint("Enable debug logging for image generation")
  private enableDebugLogging: boolean = false;

  private rmm = require("LensStudio:RemoteMediaModule") as RemoteMediaModule;
  private isGenerating: boolean = false;

  // Generation callbacks for external components
  private onImageCallback: (texture: Texture) => void = null;
  private onFailureCallback: (error: string) => void = null;

  onAwake() {
    if (this.image) {
      let imgMat = this.image.mainMaterial.clone();
      this.image.clearMaterials();
      this.image.mainMaterial = imgMat;
    }

    if (this.enableDebugLogging) {
      print(`ImageGen: 🎨 Core image generation factory initialized with ${this.modelProvider} provider`);
    }
  }

  /**
   * Generate image from text prompt using direct API calls
   * UPDATED: Removed blocking behavior to support queue system
   * @param prompt Text prompt for image generation
   * @returns Promise that resolves when image is generated and applied
   */
  public async generateImage(prompt: string): Promise<Texture> {
    // Removed isGenerating check to allow queue system to manage concurrency

    if (!prompt || prompt.trim() === "") {
      throw new Error("ImageGen: Invalid prompt provided");
    }

    // Still track for local state but don't block
    const wasGenerating = this.isGenerating;
    this.isGenerating = true;

    if (this.enableDebugLogging) {
      print(`ImageGen: 🚀 Generating image with ${this.modelProvider}: "${prompt}" (concurrent: ${wasGenerating})`);
    }

    try {
      let generatedTexture: Texture;
      
      if (this.modelProvider === "OpenAI") {
        generatedTexture = await this.generateWithOpenAI(prompt);
      } else {
        generatedTexture = await this.generateWithGemini(prompt);
      }
      
      if (generatedTexture) {
        // Apply to local image component if available
        if (this.image) {
          this.image.mainMaterial.mainPass.baseTex = generatedTexture;
        }
        
        // Notify callback if set
        if (this.onImageCallback) {
          this.onImageCallback(generatedTexture);
        }
        
        if (this.enableDebugLogging) {
          print("ImageGen: ✅ Image generated and applied successfully");
        }
        
        return generatedTexture;
      } else {
        throw new Error("No texture returned from generation");
      }
      
    } catch (error) {
      if (this.enableDebugLogging) {
        print(`ImageGen: ❌ Error generating image: ${error}`);
      }
      
      // Notify failure callback
      if (this.onFailureCallback) {
        this.onFailureCallback(error.toString());
      }
      
      throw error;
    } finally {
      this.isGenerating = false;
    }
  }

  /**
   * Core OpenAI API integration - DALL-E 3
   */
  private generateWithOpenAI(prompt: string): Promise<Texture> {
    return new Promise((resolve, reject) => {
      if (this.enableDebugLogging) {
        print(`ImageGen: 📡 Submitting to OpenAI DALL-E 3: "${prompt}"`);
      }

      const req = {
        prompt: prompt,
        n: 1,
        model: "dall-e-3",
      } as OpenAITypes.ImageGenerate.Request;

      OpenAI.imagesGenerate(req)
        .then((result) => {
          result.data.forEach((datum) => {
            const b64 = datum.b64_json;
            const url = datum.url;
            
            if (url) {
              if (this.enableDebugLogging) {
                print("ImageGen: 🌐 Loading texture from URL");
              }
              
              let internetModule = require("LensStudio:InternetModule") as InternetModule;
              let resource = internetModule.makeResourceFromUrl(url);
              this.rmm.loadResourceAsImageTexture(
                resource,
                (texture) => {
                  if (this.enableDebugLogging) {
                    print("ImageGen: ✅ OpenAI image loaded from URL");
                  }
                  resolve(texture);
                },
                () => {
                  reject("Failure to download texture from URL");
                }
              );
            } else if (b64) {
              if (this.enableDebugLogging) {
                print("ImageGen: 🔢 Decoding texture from base64");
              }
              
              Base64.decodeTextureAsync(
                b64,
                (texture) => {
                  if (this.enableDebugLogging) {
                    print("ImageGen: ✅ OpenAI image decoded from base64");
                  }
                  resolve(texture);
                },
                () => {
                  reject("Failure to decode texture from base64");
                }
              );
            }
          });
        })
        .catch((error) => {
          const errorMsg = "OpenAI image generation failed: " + error;
          if (this.enableDebugLogging) {
            print(`ImageGen: ❌ ${errorMsg}`);
          }
          reject(errorMsg);
        });
    });
  }

  /**
   * Core Gemini API integration - Gemini 2.0 Flash Image Generation
   */
  private generateWithGemini(prompt: string): Promise<Texture> {
    return new Promise((resolve, reject) => {
      if (this.enableDebugLogging) {
        print(`ImageGen: 📡 Submitting to Gemini 2.0 Flash: "${prompt}"`);
      }

      const request: GeminiTypes.Models.GenerateContentRequest = {
        model: "gemini-2.0-flash-preview-image-generation",
        type: "generateContent",
        body: {
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
              role: "user",
            },
          ],
          generationConfig: {
            responseModalities: ["TEXT", "IMAGE"],
          },
        },
      };

      Gemini.models(request)
        .then((response) => {
          if (!response.candidates || response.candidates.length === 0) {
            reject("No image generated in response");
            return;
          }

          let foundImage = false;
          for (const part of response.candidates[0].content.parts) {
            if (part?.inlineData) {
              foundImage = true;
              const b64Data = part.inlineData.data;
              
              if (this.enableDebugLogging) {
                print("ImageGen: 🔢 Decoding Gemini image from base64");
              }
              
              Base64.decodeTextureAsync(
                b64Data,
                (texture) => {
                  if (this.enableDebugLogging) {
                    print("ImageGen: ✅ Gemini image decoded from base64");
                  }
                  resolve(texture);
                },
                () => {
                  reject("Failed to decode texture from base64 data");
                }
              );
              break; // Use the first image found
            }
          }

          if (!foundImage) {
            reject("No image data found in response");
          }
        })
        .catch((error) => {
          const errorMsg = "Gemini image generation failed: " + error;
          if (this.enableDebugLogging) {
            print(`ImageGen: ❌ ${errorMsg}`);
          }
          reject(errorMsg);
        });
    });
  }

  /**
   * Set callback for when images are generated
   */
  public setImageCallback(callback: (texture: Texture) => void): void {
    this.onImageCallback = callback;
  }

  /**
   * Set callback for when generation fails
   */
  public setFailureCallback(callback: (error: string) => void): void {
    this.onFailureCallback = callback;
  }

  /**
   * Set a pre-existing texture to the image
   * @param texture Texture to apply to the image
   */
  public setTexture(texture: Texture): void {
    if (this.image && texture) {
      this.image.mainMaterial.mainPass.baseTex = texture;
      
      if (this.enableDebugLogging) {
        print("ImageGen: 📎 Applied pre-existing texture");
      }
    }
  }

  /**
   * Check if currently generating an image
   * @returns true if generation is in progress
   */
  public isGeneratingImage(): boolean {
    return this.isGenerating;
  }

  /**
   * Get the current image component
   * @returns Image component reference
   */
  public getImageComponent(): Image {
    return this.image;
  }

  /**
   * Switch the AI model provider
   * @param provider "OpenAI" or "Gemini"
   */
  public switchProvider(provider: string): void {
    if (provider !== this.modelProvider) {
      this.modelProvider = provider;
      
      if (this.enableDebugLogging) {
        print(`ImageGen: 🔄 Switched to ${provider} provider`);
      }
    }
  }

  /**
   * Get current generation settings
   */
  public getGenerationSettings(): { provider: string } {
    return {
      provider: this.modelProvider
    };
  }
} 