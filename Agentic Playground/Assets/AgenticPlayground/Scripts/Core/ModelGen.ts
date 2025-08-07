import { Snap3D } from "Remote Service Gateway.lspkg/HostedSnap/Snap3D";
import { Snap3DTypes } from "Remote Service Gateway.lspkg/HostedSnap/Snap3DTypes";

/**
 * ModelGen - Core 3D Model Factory
 * Direct interface to Snap3D API for 3D model generation
 * This IS the factory - no external dependencies needed
 */
@component
export class ModelGen extends BaseScriptComponent {
  @input
  @allowUndefined
  @hint("Scene object reference for the 3D model position")
  private targetPosition: SceneObject;

  @input
  @hint("Enable mesh refinement for higher quality models")
  private refineMesh: boolean = true;

  @input
  @hint("Use vertex colors in generated models")
  private useVertexColor: boolean = false;

  @input
  @hint("Default model scale for generated objects")
  @widget(new SliderWidget(0.1, 5.0, 0.1))
  private defaultScale: number = 1.0;

  @input
  @hint("Enable debug logging for 3D generation")
  private enableDebugLogging: boolean = false;

  private isGenerating: boolean = false;

  // Generation callbacks for external components - support multiple registrations
  private imageCallbacks: Map<string, (texture: Texture) => void> = new Map();
  private modelCallbacks: Map<string, (model: GltfAsset, isFinal: boolean) => void> = new Map();
  private failureCallbacks: Map<string, (error: string) => void> = new Map();
  
  // Track active request to route callbacks correctly
  private activeRequestId: string = null;

  onAwake() {
    if (this.enableDebugLogging) {
      print("ModelGen: 🏭 Core 3D model factory initialized");
    }

    if (!this.targetPosition) {
      print("ModelGen: ⚠️ Warning - No target position assigned, will use world origin");
    }
  }

  /**
   * Generate 3D model from text prompt using direct Snap3D API
   * UPDATED: Removed blocking behavior to support queue system
   * @param prompt Text prompt for 3D model generation
   * @param overridePosition Optional position to override the default target position
   * @param requestId Optional ID to route callbacks to specific registrants
   * @returns Promise that resolves with result message when model is generated
   */
  public async generateModel(prompt: string, overridePosition?: vec3, requestId?: string): Promise<string> {
    // Removed isGenerating check to allow queue system to manage concurrency

    if (!prompt || prompt.trim() === "") {
      throw new Error("ModelGen: Invalid prompt provided");
    }

    // Still track for local state but don't block
    const wasGenerating = this.isGenerating;
    this.isGenerating = true;
    
    // Use provided requestId or generate one
    const currentRequestId = requestId || `model_${Date.now()}_${Math.random()}`;
    this.activeRequestId = currentRequestId;

    if (this.enableDebugLogging) {
      print(`ModelGen: 🚀 Generating 3D model with prompt: "${prompt}" (concurrent: ${wasGenerating}, requestId: ${currentRequestId})`);
    }

    try {
      // Determine position to use
      const position = overridePosition || this.getTargetPosition() || vec3.zero();
      
      // Submit to Snap3D API directly
      const result = await this.submitToSnap3D(prompt, position);
      
      if (this.enableDebugLogging) {
        print(`ModelGen: ✅ 3D model generated successfully: ${result}`);
      }
      
      return result;
      
    } catch (error) {
      if (this.enableDebugLogging) {
        print(`ModelGen: ❌ Error generating 3D model: ${error}`);
      }
      
      // Notify failure callbacks for active request
      this.notifyFailureCallbacks(this.activeRequestId, error.toString());
      
      throw error;
    } finally {
      this.isGenerating = false;
      this.activeRequestId = null;
    }
  }

  /**
   * Core Snap3D API integration - this is where the actual factory work happens
   */
  private async submitToSnap3D(prompt: string, position: vec3): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this.enableDebugLogging) {
        print(`ModelGen: 📡 Submitting to Snap3D API: "${prompt}"`);
      }

      Snap3D.submitAndGetStatus({
        prompt: prompt,
        format: "glb",
        refine: this.refineMesh,
        use_vertex_color: this.useVertexColor,
      })
        .then((submitGetStatusResults) => {
          submitGetStatusResults.event.add(([value, assetOrError]) => {
            if (value === "image") {
              const textureData = assetOrError as Snap3DTypes.TextureAssetData;
              
              if (this.enableDebugLogging) {
                print("ModelGen: 🖼️ Received preview image");
              }
              
              // Notify image callbacks for active request
              this.notifyImageCallbacks(this.activeRequestId, textureData.texture);
              
            } else if (value === "base_mesh") {
              const gltfData = assetOrError as Snap3DTypes.GltfAssetData;
              
              if (this.enableDebugLogging) {
                print("ModelGen: 🎲 Received base mesh");
              }
              
              // Notify model callbacks for active request
              this.notifyModelCallbacks(this.activeRequestId, gltfData.gltfAsset, !this.refineMesh);
              
              if (!this.refineMesh) {
                resolve("Successfully created mesh with prompt: " + prompt);
              }
              
            } else if (value === "refined_mesh") {
              const gltfData = assetOrError as Snap3DTypes.GltfAssetData;
              
              if (this.enableDebugLogging) {
                print("ModelGen: ✨ Received refined mesh");
              }
              
              // Notify model callbacks for active request
              this.notifyModelCallbacks(this.activeRequestId, gltfData.gltfAsset, true);
              
              resolve("Successfully created refined mesh with prompt: " + prompt);
              
            } else if (value === "failed") {
              const errorData = assetOrError as Snap3DTypes.ErrorData;
              const errorMsg = "Snap3D generation failed: " + errorData.errorMsg;
              
              if (this.enableDebugLogging) {
                print(`ModelGen: ❌ ${errorMsg}`);
              }
              
              reject(errorMsg);
            }
          });
        })
        .catch((error) => {
          const errorMsg = "Error submitting task or getting status: " + error;
          
          if (this.enableDebugLogging) {
            print(`ModelGen: ❌ ${errorMsg}`);
          }
          
          reject(errorMsg);
        });
    });
  }

  /**
   * Set callback for when preview images are received
   * @param callbackId Unique ID for this callback registration
   * @param callback The callback function
   */
  public setImageCallback(callbackId: string, callback: (texture: Texture) => void): void {
    this.imageCallbacks.set(callbackId, callback);
    if (this.enableDebugLogging) {
      print(`ModelGen: 📷 Registered image callback: ${callbackId}`);
    }
  }

  /**
   * Set callback for when 3D models are received
   * @param callbackId Unique ID for this callback registration
   * @param callback The callback function
   */
  public setModelCallback(callbackId: string, callback: (model: GltfAsset, isFinal: boolean) => void): void {
    this.modelCallbacks.set(callbackId, callback);
    if (this.enableDebugLogging) {
      print(`ModelGen: 🎲 Registered model callback: ${callbackId}`);
    }
  }

  /**
   * Set callback for when generation fails
   * @param callbackId Unique ID for this callback registration
   * @param callback The callback function
   */
  public setFailureCallback(callbackId: string, callback: (error: string) => void): void {
    this.failureCallbacks.set(callbackId, callback);
    if (this.enableDebugLogging) {
      print(`ModelGen: ❌ Registered failure callback: ${callbackId}`);
    }
  }
  
  /**
   * Remove callbacks for a specific ID
   * @param callbackId The ID to remove callbacks for
   */
  public removeCallbacks(callbackId: string): void {
    this.imageCallbacks.delete(callbackId);
    this.modelCallbacks.delete(callbackId);
    this.failureCallbacks.delete(callbackId);
    if (this.enableDebugLogging) {
      print(`ModelGen: 🚮 Removed callbacks for: ${callbackId}`);
    }
  }
  
  /**
   * Notify image callbacks
   */
  private notifyImageCallbacks(requestId: string, texture: Texture): void {
    // If requestId matches a specific callback, only notify that one
    if (requestId && this.imageCallbacks.has(requestId)) {
      const callback = this.imageCallbacks.get(requestId);
      if (callback) {
        callback(texture);
      }
    } else {
      // Otherwise notify all callbacks
      this.imageCallbacks.forEach((callback, id) => {
        if (callback) {
          callback(texture);
        }
      });
    }
  }
  
  /**
   * Notify model callbacks
   */
  private notifyModelCallbacks(requestId: string, model: GltfAsset, isFinal: boolean): void {
    // If requestId matches a specific callback, only notify that one
    if (requestId && this.modelCallbacks.has(requestId)) {
      const callback = this.modelCallbacks.get(requestId);
      if (callback) {
        callback(model, isFinal);
      }
    } else {
      // Otherwise notify all callbacks
      this.modelCallbacks.forEach((callback, id) => {
        if (callback) {
          callback(model, isFinal);
        }
      });
    }
  }
  
  /**
   * Notify failure callbacks
   */
  private notifyFailureCallbacks(requestId: string, error: string): void {
    // If requestId matches a specific callback, only notify that one
    if (requestId && this.failureCallbacks.has(requestId)) {
      const callback = this.failureCallbacks.get(requestId);
      if (callback) {
        callback(error);
      }
    } else {
      // Otherwise notify all callbacks
      this.failureCallbacks.forEach((callback, id) => {
        if (callback) {
          callback(error);
        }
      });
    }
  }

  /**
   * Generate 3D model at the default target position
   * @param prompt Text prompt for generation
   * @param requestId Optional ID to route callbacks
   */
  public async generateModelAtTarget(prompt: string, requestId?: string): Promise<string> {
    return this.generateModel(prompt, undefined, requestId);
  }

  /**
   * Generate 3D model at a specific position
   * @param prompt Text prompt for generation
   * @param position Target position
   * @param requestId Optional ID to route callbacks
   */
  public async generateModelAtPosition(prompt: string, position: vec3, requestId?: string): Promise<string> {
    return this.generateModel(prompt, position, requestId);
  }

  /**
   * Check if currently generating a 3D model
   */
  public isGeneratingModel(): boolean {
    return this.isGenerating;
  }

  /**
   * Get the current target position
   */
  public getTargetPosition(): vec3 | null {
    if (this.targetPosition) {
      return this.targetPosition.getTransform().getWorldPosition();
    }
    return null;
  }

  /**
   * Set a new target position scene object
   */
  public setTargetPosition(newTarget: SceneObject): void {
    this.targetPosition = newTarget;
    
    if (this.enableDebugLogging) {
      print("ModelGen: 📍 Target position updated");
    }
  }

  /**
   * Update generation settings
   */
  public setGenerationSettings(refineMesh: boolean, useVertexColor: boolean): void {
    this.refineMesh = refineMesh;
    this.useVertexColor = useVertexColor;
    
    if (this.enableDebugLogging) {
      print(`ModelGen: ⚙️ Settings updated - Refine: ${refineMesh}, VertexColor: ${useVertexColor}`);
    }
  }

  /**
   * Get current generation settings
   */
  public getGenerationSettings(): { refineMesh: boolean, useVertexColor: boolean } {
    return {
      refineMesh: this.refineMesh,
      useVertexColor: this.useVertexColor
    };
  }
  
} 