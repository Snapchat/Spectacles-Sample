import { ModelGen } from './ModelGen';
import { setTimeout } from "SpectaclesInteractionKit.lspkg/Utils/FunctionTimingUtils";

/**
 * ModelGenBridge - Bridge component for 3D model generation in diagram system
 * 
 * UI management layer that delegates core 3D generation to ModelGen factory
 * Handles spinners, images, display components, and user interaction
 */
@component
export class ModelGenBridge extends BaseScriptComponent {
  
  @input
  @hint("Parent object for generated 3D models")
  private modelParent: SceneObject;
  
  @input
  @hint("Image component to display preview/status")
  private image: Image;
  
  @input
  @hint("Text component to display prompt/status")
  private promptDisplay: Text;
  
  @input
  @hint("Spinner/loading indicator")
  private spinner: SceneObject;
  
  @input
  @hint("Material for generated models")
  private material: Material;
  
  @input
  @hint("Display plate for model positioning")
  private displayPlate: SceneObject;
  
  @input
  @hint("Collider object for interaction")
  private colliderObj: SceneObject;

  @input
  @hint("ModelGen factory component for core 3D generation")
  private modelGenFactory: ModelGen;
  
  @input
  @hint("Test generation on awake with this prompt")
  private testOnAwake: boolean = false;
  
  @input
  @widget(new TextAreaWidget())
  private testPrompt: string = "A cute dog wearing a hat";
  
  @input
  @hint("Enable debug logging")
  private enableDebugLogging: boolean = false;
  
  @input
  @hint("Model scale multiplier")
  @widget(new SliderWidget(0.1, 5.0, 0.1))
  private modelScale: number = 1.0;
  
  private isGenerating: boolean = false;
  private isInitialized: boolean = false;
  
  // External completion callbacks
  private onExternalSuccess: (() => void) | null = null;
  private onExternalFailure: ((error: string) => void) | null = null;
  private callbackInvoked: boolean = false;
  
  // Model state management
  private tempModel: SceneObject = null;
  private finalModel: SceneObject = null;
  private size: number = 20;
  private sizeVec: vec3 = null;
  
  // Unique ID for this bridge instance
  private bridgeId: string = `bridge_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  
  onAwake() {
    this.initializeFactory();
    this.setupComponents();
    
    this.createEvent("OnStartEvent").bind(() => {
      if (this.spinner) {
        this.spinner.enabled = false;
      }
      
      if (this.testOnAwake && this.testPrompt) {
        this.generateModel(this.testPrompt);
      }
    });
    
    if (this.enableDebugLogging) {
      print("ModelGenBridge: 🎯 3D model generation bridge initialized");
    }
  }
  
  private initializeFactory(): void {
    if (!this.modelGenFactory) {
      if (this.enableDebugLogging) {
        print("ModelGenBridge: ⚠️ ModelGen factory not assigned - skipping initialization");
      }
      this.isInitialized = false;
      return;
    }

    try {
      // Verify that the factory has the required methods
      if (typeof this.modelGenFactory.setImageCallback !== 'function') {
        print("ModelGenBridge: ❌ ModelGen factory missing setImageCallback method");
        this.isInitialized = false;
        return;
      }

      if (typeof this.modelGenFactory.setModelCallback !== 'function') {
        print("ModelGenBridge: ❌ ModelGen factory missing setModelCallback method");
        this.isInitialized = false;
        return;
      }

      if (typeof this.modelGenFactory.setFailureCallback !== 'function') {
        print("ModelGenBridge: ❌ ModelGen factory missing setFailureCallback method");
        this.isInitialized = false;
        return;
      }

      // Set up callbacks for ModelGen to communicate back to this bridge using unique ID
      this.modelGenFactory.setImageCallback(this.bridgeId, (texture: Texture) => {
        this.setImage(texture);
      });

      this.modelGenFactory.setModelCallback(this.bridgeId, (model: GltfAsset, isFinal: boolean) => {
        this.setModel(model, isFinal);
      });

      this.modelGenFactory.setFailureCallback(this.bridgeId, (error: string) => {
        this.handleError(error);
      });

      // Set the target position to match our model parent
      if (this.modelParent && typeof this.modelGenFactory.setTargetPosition === 'function') {
        this.modelGenFactory.setTargetPosition(this.modelParent);
      }

      this.isInitialized = true;
      
      if (this.enableDebugLogging) {
        print(`ModelGenBridge: ✅ ModelGen factory integrated with ID: ${this.bridgeId}`);
      }
    } catch (error) {
      print(`ModelGenBridge: ❌ Error initializing factory: ${error}`);
      this.isInitialized = false;
    }
  }
  
  private setupComponents(): void {
    // Initialize size vector
    this.sizeVec = vec3.one().uniformScale(this.size * this.modelScale);
    
    // Setup image component
    if (this.image) {
      let imgMaterial = this.image.mainMaterial.clone();
      this.image.clearMaterials();
      this.image.mainMaterial = imgMaterial;
      this.image.enabled = false;
    }
    
    // Setup display plate positioning
    if (this.displayPlate) {
      let offsetBelow = 0;
      this.displayPlate
        .getTransform()
        .setLocalPosition(new vec3(0, -this.size * 0.5 - offsetBelow, 0));
    }
    
    // Setup collider scaling
    if (this.colliderObj) {
      this.colliderObj.getTransform().setLocalScale(this.sizeVec);
    }
    
    // Setup image scaling
    if (this.image) {
      this.image.getTransform().setLocalScale(this.sizeVec);
    }
    
    if (this.enableDebugLogging) {
      print(`ModelGenBridge: 🔧 Components configured with scale: ${this.modelScale}`);
    }
  }
  
  /**
   * Generate 3D model from text prompt
   * Delegates to ModelGen factory for core generation
   * @param prompt Text prompt for 3D model generation
   * @param controlSpinner Whether this bridge should control its own spinner (default: true)
   * @returns Promise that resolves when model is generated
   */
  public async generateModel(prompt: string, controlSpinner: boolean = true): Promise<void> {
    if (this.isGenerating) {
      if (this.enableDebugLogging) {
        print("ModelGenBridge: ⏳ Already generating 3D model");
      }
      return;
    }
    
    if (!this.isInitialized || !this.modelGenFactory) {
      const error = "ModelGen factory not available - cannot generate model";
      if (this.enableDebugLogging) {
        print(`ModelGenBridge: ⚠️ ${error}`);
      }
      this.handleError(error);
      return; // Don't throw error, just return gracefully
    }
    
    if (!prompt || prompt.trim() === "") {
      const error = "Invalid prompt provided";
      this.handleError(error);
      throw new Error(error);
    }
    
    this.isGenerating = true;
    this.callbackInvoked = false; // Reset callback tracking
    this.setPrompt(prompt);
    
    // Only control spinner if explicitly requested (standalone mode)
    if (controlSpinner) {
      if (this.spinner) {
        this.spinner.enabled = true;
        print(`ModelGenBridge: 🔄 Loading spinner enabled (standalone mode)`);
      } else {
        print(`ModelGenBridge: ⚠️ Loading spinner not assigned (standalone mode)`);
      }
    } else {
      print(`ModelGenBridge: ℹ️ Spinner control delegated to calling Node component`);
    }
    
    if (this.enableDebugLogging) {
      print(`ModelGenBridge: 🚀 Delegating 3D model generation: "${prompt}"`);
    }
    
    try {
      // Get the position for model generation
      // Priority: 1. modelParent if assigned, 2. bridge's own position, 3. world origin
      let modelPosition: vec3;
      if (this.modelParent) {
        modelPosition = this.modelParent.getTransform().getWorldPosition();
      } else {
        modelPosition = this.getTransform().getWorldPosition();
      }
      
      if (this.enableDebugLogging) {
        print(`ModelGenBridge: 📍 Using model position: ${modelPosition.toString()} (source: ${this.modelParent ? 'modelParent' : 'bridge position'})`);
      }
      
      // Delegate to ModelGen factory for core generation with our unique ID
      const result = await this.modelGenFactory.generateModelAtPosition(prompt, modelPosition, this.bridgeId);
      
      if (this.enableDebugLogging) {
        print(`ModelGenBridge: ✅ 3D model generation completed: ${result}`);
      }
      
      // Notify external success callback
      if (!this.callbackInvoked && this.onExternalSuccess) {
        this.callbackInvoked = true; // Prevent double callback
        this.onExternalSuccess();
      }
      
      // Set a safety timeout to ensure spinner is disabled even if something goes wrong
      if (!controlSpinner && this.onExternalSuccess) {
        const safetyTimeout = setTimeout(() => { // 10 seconds for 3D models
          if (this.isGenerating && !this.callbackInvoked) {
            print(`ModelGenBridge: ⚠️ Safety timeout - ensuring spinner is disabled`);
            this.callbackInvoked = true; // Prevent double callback
            if (this.onExternalSuccess) {
              this.onExternalSuccess();
            }
            this.isGenerating = false;
          }
        }, 10000);
      }
      
    } catch (error) {
      const errorMessage = `3D model generation failed: ${error}`;
      this.handleError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      this.isGenerating = false;
      
      // Only control spinner if explicitly requested (standalone mode)
      if (controlSpinner && this.spinner) {
        this.spinner.enabled = false;
        print(`ModelGenBridge: ⏹️ Loading spinner disabled (standalone mode)`);
      }
    }
  }
  
  /**
   * Set the prompt text display
   * @param prompt Prompt text to display
   */
  public setPrompt(prompt: string): void {
    if (this.promptDisplay) {
      this.promptDisplay.text = prompt;
    }
  }
  
  /**
   * Set preview image
   * @param imageTexture Texture to display as preview
   */
  public setImage(imageTexture: Texture): void {
    if (this.image) {
      this.image.enabled = true;
      this.image.mainPass.baseTex = imageTexture;
    }
  }
  
  /**
   * Set the generated 3D model
   * @param model Generated model asset
   * @param isFinal Whether this is the final refined model
   */
  public setModel(model: GltfAsset, isFinal: boolean): void {
    if (this.image) {
      this.image.enabled = false;
    }
    
    if (isFinal) {
      if (!isNull(this.finalModel)) {
        this.finalModel.destroy();
      }
      
      if (this.spinner) {
        this.spinner.enabled = false;
      }
      
      this.finalModel = model.tryInstantiate(this.modelParent, this.material);
      
      if (this.finalModel) {
        this.finalModel.getTransform().setLocalScale(this.sizeVec);
      }
      
      this.isGenerating = false;
      
    } else {
      if (this.tempModel) {
        this.tempModel.destroy();
      }
      
      this.tempModel = model.tryInstantiate(this.modelParent, this.material);
      
      if (this.tempModel) {
        this.tempModel.getTransform().setLocalScale(this.sizeVec);
      }
    }
  }
  
  /**
   * Set a pre-existing 3D model object
   * @param modelObject Pre-existing model to set
   */
  public setModelObject(modelObject: SceneObject): void {
    if (modelObject && this.modelParent) {
      // Clear existing models first
      this.clearModels();
      
      // Set the new model as final model
      this.finalModel = modelObject;
      
      // Position the model at the parent location
      const parentTransform = this.modelParent.getTransform();
      const modelTransform = modelObject.getTransform();
      
      modelTransform.setWorldPosition(parentTransform.getWorldPosition());
      modelTransform.setWorldRotation(parentTransform.getWorldRotation());
      
      // Apply scale
      modelTransform.setLocalScale(this.sizeVec);
      
      // Update parent hierarchy
      modelObject.setParent(this.modelParent);
      
      if (this.enableDebugLogging) {
        print(`ModelGenBridge: 📦 Set pre-existing 3D model object`);
      }
    }
  }
  
  /**
   * Get the current generated model object
   * @returns Current final model or null if none exists
   */
  public getCurrentModel(): SceneObject | null {
    return this.finalModel;
  }
  
  /**
   * Get the temporary/preview model object
   * @returns Current temporary model or null if none exists
   */
  public getTempModel(): SceneObject | null {
    return this.tempModel;
  }
  
  /**
   * Check if any model is currently loaded
   * @returns true if final or temp model exists
   */
  public hasModel(): boolean {
    return this.finalModel !== null || this.tempModel !== null;
  }
  
  /**
   * Move the generated models to a specific position
   * @param position Target world position
   */
  public moveToPosition(position: vec3): void {
    if (this.modelParent) {
      this.modelParent.getTransform().setWorldPosition(position);
    }
    
    // Also update the ModelGen factory target position
    if (this.modelGenFactory) {
      this.modelGenFactory.setTargetPosition(this.modelParent);
    }
    
    if (this.enableDebugLogging) {
      print(`ModelGenBridge: 📍 Moved models to position: ${position.toString()}`);
    }
  }
  
  /**
   * Update model scale
   * @param newScale New scale multiplier
   */
  public updateScale(newScale: number): void {
    this.modelScale = newScale;
    this.sizeVec = vec3.one().uniformScale(this.size * this.modelScale);
    
    // Update existing models
    if (this.finalModel) {
      this.finalModel.getTransform().setLocalScale(this.sizeVec);
    }
    
    if (this.tempModel) {
      this.tempModel.getTransform().setLocalScale(this.sizeVec);
    }
    
    // Update UI components
    if (this.colliderObj) {
      this.colliderObj.getTransform().setLocalScale(this.sizeVec);
    }
    
    if (this.image) {
      this.image.getTransform().setLocalScale(this.sizeVec);
    }
    
    if (this.enableDebugLogging) {
      print(`ModelGenBridge: 📏 Scale updated to: ${newScale}`);
    }
  }
  
  /**
   * Check if currently generating a model
   * @returns true if generation is in progress
   */
  public isGeneratingModel(): boolean {
    return this.isGenerating || (this.modelGenFactory ? this.modelGenFactory.isGeneratingModel() : false);
  }
  
  /**
   * Check if factory is available and ready
   * @returns true if ready for generation
   */
  public isReady(): boolean {
    return this.isInitialized && !this.isGenerating && (this.modelGenFactory ? !this.modelGenFactory.isGeneratingModel() : false);
  }
  
  /**
   * Set external completion callbacks
   * @param onSuccess Callback when model is successfully generated and applied
   * @param onFailure Callback when model generation fails
   */
  public setExternalCallbacks(onSuccess: () => void, onFailure: (error: string) => void): void {
    this.onExternalSuccess = onSuccess;
    this.onExternalFailure = onFailure;
  }
  
  /**
   * Clear all generated models
   */
  public clearModels(): void {
    if (this.tempModel) {
      this.tempModel.destroy();
      this.tempModel = null;
    }
    
    if (this.finalModel) {
      this.finalModel.destroy();
      this.finalModel = null;
    }
    
    if (this.image) {
      this.image.enabled = false;
    }
    
    if (this.enableDebugLogging) {
      print("ModelGenBridge: 🗑️ All models cleared");
    }
  }
  
  /**
   * Cleanup on destroy
   */
  onDestroy() {
    // Remove callbacks from factory
    if (this.modelGenFactory && this.isInitialized) {
      this.modelGenFactory.removeCallbacks(this.bridgeId);
      if (this.enableDebugLogging) {
        print(`ModelGenBridge: 🧹 Cleaned up callbacks for ID: ${this.bridgeId}`);
      }
    }
    
    // Clean up any existing models
    this.clearModels();
  }
  
  /**
   * Handle errors during model generation
   * @param error Error message
   */
  private handleError(error: string): void {
    print(`ModelGenBridge: ❌ ${error}`);
    
    if (this.image) {
      this.image.enabled = false;
    }
    
    // Only control spinner in standalone mode - Node components handle their own spinners
    if (this.spinner && this.testOnAwake) {
      this.spinner.enabled = false;
    }
    
    if (this.promptDisplay) {
      this.promptDisplay.text = "Error: " + error;
    }
    
    this.isGenerating = false;
    
    // Notify external failure callback
    if (!this.callbackInvoked && this.onExternalFailure) {
      this.callbackInvoked = true; // Prevent double callback
      this.onExternalFailure(error);
    }
  }
} 