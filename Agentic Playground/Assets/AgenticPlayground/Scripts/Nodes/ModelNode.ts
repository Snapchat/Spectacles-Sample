// Note: 3D functionality is now handled by modelGenBridge component
import { ModelGenBridge } from '../Core/ModelGenBridge';
import { GenerationQueue } from '../Utils/GenerationQueue';
import { ModelGenerationScheduler } from '../Utils/ModelGenerationScheduler';

/**
 * Model Node Component for Diagram System
 * According to diagram specification - includes text title and 3D model placeholder position
 * Uses GenerationQueue system for managed 3D model generation
 */
@component
export class ModelNode extends BaseScriptComponent {
    // ================================
    // Inspector Configuration
    // ================================
    
    @input
    @hint("Text component for the node title")
    public titleText: Text;

    @input
    @hint("Scene object reference for the 3D model position")
    public modelPlaceholder: SceneObject;

    @input
    @hint("Text component for the node content/description")
    public contentText: Text;

    @input
    @hint("Unique identifier for this node")
    public nodeId: string = "";

    @input
    @hint("Position in the diagram structure")
    public nodePosition: vec3 = vec3.zero();

    @input
    @hint("Level in the diagram hierarchy")
    public nodeLevel: number = 1;

    @input
    @hint("Enable debug logging for this node")
    public enableDebugLogging: boolean = false;

    // 3D Model generation configuration - delegated to modelGenBridge
    @input
    @hint("Enable automatic 3D model generation")
    public enable3DGeneration: boolean = true;

    @input
    @hint("modelGenBridge component for specialized 3D model generation")
    public modelGenerator: ModelGenBridge;

    @input
    @hint("Loading indicator to show during model generation")
    public loadingSpinner: SceneObject;
    
    @input
    @hint("Enable queue-based generation for multiple concurrent requests")
    public useGenerationQueue: boolean = true;

    // ================================
    // Internal State
    // ================================
    
    private isInitialized: boolean = false;
    private title: string = "";
    private content: string = "";
    private modelPrompt: string = "";
    
    // Character limits according to diagram specification
    private static readonly MAX_TITLE_LENGTH: number = 50;
    private static readonly MAX_CONTENT_LENGTH: number = 200;
    private static readonly MAX_PROMPT_LENGTH: number = 150;

    // ================================
    // Lifecycle Methods
    // ================================

    onAwake() {
        // Enable spinner immediately when node is created
        if (this.loadingSpinner) {
            this.loadingSpinner.enabled = true;
            print(`ModelNode: 🔄 Loading spinner enabled on awake for node ${this.nodeId}`);
        }
        
        this.initializeNode();
    }

    // ================================
    // Public Interface
    // ================================

    /**
     * Set the node data (title, content, and model prompt)
     */
    public setNodeData(title: string, content: string, modelPrompt?: string): void {
        this.title = this.enforceCharacterLimit(title, ModelNode.MAX_TITLE_LENGTH);
        this.content = this.enforceCharacterLimit(content, ModelNode.MAX_CONTENT_LENGTH);
        
        if (modelPrompt) {
            this.modelPrompt = this.enforceCharacterLimit(modelPrompt, ModelNode.MAX_PROMPT_LENGTH);
        }
        
        this.updateDisplay();
        
        if (this.enableDebugLogging) {
            print(`ModelNode: Updated node ${this.nodeId} - Title: "${this.title}", Content: "${this.content.substring(0, 30)}..."`);
        }
    }

    /**
     * Get the current node data
     */
    public getNodeData(): { title: string, content: string, modelPrompt: string } {
        return {
            title: this.title,
            content: this.content,
            modelPrompt: this.modelPrompt
        };
    }

    /**
     * Update the node position
     */
    public setPosition(position: vec3): void {
        this.nodePosition = position;
        this.getTransform().setWorldPosition(position);
        
        if (this.enableDebugLogging) {
            print(`ModelNode: Updated position for node ${this.nodeId} to ${position.toString()}`);
        }
    }

    /**
     * Get the current node position
     */
    public getPosition(): vec3 {
        return this.nodePosition;
    }

    /**
     * Set the hierarchy level
     */
    public setLevel(level: number): void {
        this.nodeLevel = level;
        
        if (this.enableDebugLogging) {
            print(`ModelNode: Updated level for node ${this.nodeId} to ${level}`);
        }
    }

    /**
     * Get the hierarchy level
     */
    public getLevel(): number {
        return this.nodeLevel;
    }

    /**
     * Generate 3D model content based on prompt
     * Uses GenerationQueue for managed generation or falls back to direct generation
     */
    public async generateContent(prompt: string): Promise<void> {
        // Always log generation attempts for debugging
        print(`ModelNode: 🚀 generateContent called for node ${this.nodeId} with prompt: "${prompt}"`);
        
        if (!this.enable3DGeneration) {
            print(`ModelNode: ❌ 3D model generation disabled for node ${this.nodeId}`);
            return;
        }

        this.modelPrompt = this.enforceCharacterLimit(prompt, ModelNode.MAX_PROMPT_LENGTH);

        // Spinner should already be enabled from initialization
        if (!this.loadingSpinner) {
            print(`ModelNode: ⚠️ Loading spinner not assigned for node ${this.nodeId}`);
        }

        // Check if we should use the scheduler for managed generation
        if (this.useGenerationQueue) {
            print(`ModelNode: 📥 Using scheduled generation for node ${this.nodeId}`);
            
            // We need our own ModelGenBridge
            if (!this.modelGenerator) {
                print(`ModelNode: ❌ ModelGenBridge not assigned for node ${this.nodeId}`);
                return;
            }

            if (!this.modelPlaceholder) {
                print(`ModelNode: ❌ Model placeholder not set for node ${this.nodeId}`);
                return;
            }
            
            // Get the scheduler
            const scheduler = ModelGenerationScheduler.getInstance();
            
            // Create a generation function that uses this node's ModelGenBridge
            const generateWithThisNode = async () => {
                print(`ModelNode: 🎯 Executing scheduled generation for node ${this.nodeId}`);
                
                // Set up callbacks to disable spinner when model is actually received
                this.modelGenerator.setExternalCallbacks(
                    () => {
                        // Success callback - disable spinner when model is applied
                        if (this.loadingSpinner) {
                            this.loadingSpinner.enabled = false;
                            print(`ModelNode: ⏹️ Loading spinner disabled - model received for node ${this.nodeId}`);
                        }
                    },
                    (error: string) => {
                        // Failure callback - disable spinner on error
                        if (this.loadingSpinner) {
                            this.loadingSpinner.enabled = false;
                            print(`ModelNode: ⏹️ Loading spinner disabled - error occurred for node ${this.nodeId}: ${error}`);
                        }
                    }
                );

                // Position the modelGenBridge at the placeholder location
                if (this.modelGenerator.getSceneObject()) {
                    const placeholderPosition = this.modelPlaceholder.getTransform().getWorldPosition();
                    this.modelGenerator.getTransform().setWorldPosition(placeholderPosition);
                    print(`ModelNode: 📍 Positioned ModelGenBridge at ${placeholderPosition.toString()} for node ${this.nodeId}`);
                }
                
                // Generate with this node's bridge
                await this.modelGenerator.generateModel(this.modelPrompt, false);
                
                print(`ModelNode: ✅ Scheduled generation completed for node ${this.nodeId}`);
            };
            
            // Schedule the generation
            scheduler.scheduleGeneration(this.nodeId, generateWithThisNode, this.nodeLevel);
            
            print(`ModelNode: ✅ Generation scheduled for node ${this.nodeId}`);
            return;
        }
        
        // Direct generation without scheduling
        {
            // Fallback to direct generation (legacy mode)
            print(`ModelNode: 🎯 Using direct generation for node ${this.nodeId} with prompt: "${this.modelPrompt}"`);
            
            if (!this.modelGenerator) {
                print(`ModelNode: ❌ ModelGenBridge not assigned for node ${this.nodeId}`);
                return;
            }

            if (!this.modelPlaceholder) {
                print(`ModelNode: ❌ Model placeholder not set for node ${this.nodeId}`);
                return;
            }

            try {
                // Set up callbacks to disable spinner when model is actually received
                this.modelGenerator.setExternalCallbacks(
                    () => {
                        // Success callback - disable spinner when model is applied
                        if (this.loadingSpinner) {
                            this.loadingSpinner.enabled = false;
                            print(`ModelNode: ⏹️ Loading spinner disabled - model received for node ${this.nodeId}`);
                        }
                    },
                    (error: string) => {
                        // Failure callback - disable spinner on error
                        if (this.loadingSpinner) {
                            this.loadingSpinner.enabled = false;
                            print(`ModelNode: ⏹️ Loading spinner disabled - error occurred for node ${this.nodeId}: ${error}`);
                        }
                    }
                );

                // Position the modelGenBridge at the placeholder location
                if (this.modelGenerator.getSceneObject()) {
                    const placeholderPosition = this.modelPlaceholder.getTransform().getWorldPosition();
                    this.modelGenerator.getTransform().setWorldPosition(placeholderPosition);
                    print(`ModelNode: 📍 Positioned ModelGenBridge at ${placeholderPosition.toString()} for node ${this.nodeId}`);
                } else {
                    print(`ModelNode: ⚠️ ModelGenBridge scene object not found for node ${this.nodeId}`);
                }
                
                // Delegate to specialized 3D generator
                // Pass controlSpinner: false so the node controls its own spinner
                await this.modelGenerator.generateModel(this.modelPrompt, false);
                
                print(`ModelNode: ✅ Successfully delegated 3D model generation for node ${this.nodeId}`);
                
            } catch (error) {
                print(`ModelNode: ❌ Error in 3D model generation for node ${this.nodeId}: ${error}`);
                
                // Disable spinner on error
                if (this.loadingSpinner) {
                    this.loadingSpinner.enabled = false;
                    print(`ModelNode: ⏹️ Loading spinner disabled - generation error for node ${this.nodeId}`);
                }
                
                throw error;
            }
        }
    }

    /**
     * Check if the node is currently generating content
     */
    public isGenerating(): boolean {
        return this.modelGenerator ? this.modelGenerator.isGeneratingModel() : false;
    }

    /**
     * Set model scale (delegates to modelGenBridge)
     */
    public setModelScale(scale: number): void {
        if (this.modelGenerator) {
            this.modelGenerator.updateScale(scale);
            
            if (this.enableDebugLogging) {
                print(`ModelNode: Updated model scale for node ${this.nodeId} to ${scale}`);
            }
        }
    }

    /**
     * Clear generated models (delegates to modelGenBridge)
     */
    public clearModels(): void {
        if (this.modelGenerator) {
            this.modelGenerator.clearModels();
            
            if (this.enableDebugLogging) {
                print(`ModelNode: Cleared models for node ${this.nodeId}`);
            }
        }
    }

    /**
     * Check if 3D generation is ready
     */
    public isReady(): boolean {
        return this.modelGenerator ? this.modelGenerator.isReady() : false;
    }

    /**
     * Set a pre-existing 3D model (delegates to modelGenBridge)
     */
    public setModel(modelObject: SceneObject): void {
        if (this.modelGenerator && modelObject) {
            this.modelGenerator.setModelObject(modelObject);
            
            if (this.enableDebugLogging) {
                print(`ModelNode: Set pre-existing 3D model for node ${this.nodeId}`);
            }
        }
    }

    /**
     * Get the generated model object (delegates to modelGenBridge)
     */
    public getGeneratedModel(): SceneObject | null {
        return this.modelGenerator ? this.modelGenerator.getCurrentModel() : null;
    }

    /**
     * Check if the node has any generated models
     */
    public hasModel(): boolean {
        return this.modelGenerator ? this.modelGenerator.hasModel() : false;
    }

    /**
     * Move the generated models to match placeholder position
     */
    public updateModelPosition(): void {
        if (this.modelGenerator && this.modelPlaceholder) {
            const placeholderPosition = this.modelPlaceholder.getTransform().getWorldPosition();
            this.modelGenerator.moveToPosition(placeholderPosition);
            
            if (this.enableDebugLogging) {
                print(`ModelNode: Updated model position for node ${this.nodeId}`);
            }
        }
    }

    /**
     * Update text content (for compatibility with old system)
     */
    public updateText(title: string): void {
        this.setNodeData(title, this.content);
    }

    // ================================
    // Private Methods
    // ================================

    /**
     * Initialize the node component
     */
    private initializeNode(): void {
        if (this.isInitialized) return;

        // Generate node ID if not provided
        if (!this.nodeId || this.nodeId === "") {
            this.nodeId = this.generateNodeId();
        }

        // Set initial content if texts exist
        if (this.titleText && this.titleText.text) {
            this.title = this.enforceCharacterLimit(this.titleText.text, ModelNode.MAX_TITLE_LENGTH);
        }
        
        if (this.contentText && this.contentText.text) {
            this.content = this.enforceCharacterLimit(this.contentText.text, ModelNode.MAX_CONTENT_LENGTH);
        }

        this.updateDisplay();
        
        // Spinner is already enabled in onAwake()
        
        this.isInitialized = true;

        if (this.enableDebugLogging) {
            print(`ModelNode: Initialized node ${this.nodeId} at level ${this.nodeLevel}`);
        }
    }

    /**
     * Update the visual display of the node
     */
    private updateDisplay(): void {
        if (this.titleText) {
            this.titleText.text = this.title;
        }
        
        if (this.contentText) {
            this.contentText.text = this.content;
        }
    }

    /**
     * Enforce character limits on text
     */
    private enforceCharacterLimit(text: string, maxLength: number): string {
        if (!text) return "";
        
        if (text.length > maxLength) {
            const truncated = text.substring(0, maxLength - 3) + "...";
            
            if (this.enableDebugLogging) {
                print(`ModelNode: Truncated text from ${text.length} to ${maxLength} characters`);
            }
            
            return truncated;
        }
        
        return text;
    }

    /**
     * Generate a unique node ID
     */
    private generateNodeId(): string {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return `model_node_${timestamp}_${random}`;
    }
} 