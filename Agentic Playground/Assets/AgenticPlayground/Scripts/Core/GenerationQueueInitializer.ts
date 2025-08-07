import { GenerationQueue } from '../Utils/GenerationQueue';
import { ImageGen } from './ImageGen';
import { ModelGen } from './ModelGen';

/**
 * GenerationQueueInitializer - Simple component to initialize the GenerationQueue
 * 
 * This component connects the GenerationQueue singleton to the ImageGen and ModelGen
 * factories in your scene. Add this to any object in your scene and reference your
 * factories.
 * 
 * This is a simplified alternative to GenerationQueueManager when you just need
 * basic queue functionality without configuration UI.
 */
@component
export class GenerationQueueInitializer extends BaseScriptComponent {
  
  @input
  @hint("Reference to the ImageGen factory component")
  public imageGenFactory: ImageGen;
  
  @input
  @hint("Reference to the ModelGen factory component")
  public modelGenFactory: ModelGen;
  
  @input
  @hint("Enable queue system (set to false to disable queuing)")
  public enableQueueSystem: boolean = true;
  
  @input
  @hint("Maximum concurrent image generations (1 = sequential)")
  @widget(new SliderWidget(1, 3, 1))
  public maxConcurrentImages: number = 1;
  
  @input
  @hint("Maximum concurrent model generations (1 = sequential)")
  @widget(new SliderWidget(1, 2, 1))
  public maxConcurrentModels: number = 1;
  
  @input
  @hint("Enable debug logging")
  public enableDebugLogging: boolean = true;
  
  private queue: GenerationQueue;
  
  onAwake() {
    if (this.enableQueueSystem) {
      this.initializeQueue();
    } else if (this.enableDebugLogging) {
      print("GenerationQueueInitializer: ⚠️ Queue system disabled by configuration");
    }
  }
  
  private initializeQueue(): void {
    // Get singleton instance
    this.queue = GenerationQueue.getInstance();
    
    // Configure concurrency limits
    this.queue.setConcurrencyLimits(this.maxConcurrentImages, this.maxConcurrentModels);
    
    let setupCount = 0;
    
    // Set up image generator
    if (this.imageGenFactory) {
      this.queue.setImageGenerator(async (prompt: string) => {
        return await this.imageGenFactory.generateImage(prompt);
      });
      
      setupCount++;
      
      if (this.enableDebugLogging) {
        print("GenerationQueueInitializer: ✅ Image generator connected to queue");
      }
    } else {
      if (this.enableDebugLogging) {
        print("GenerationQueueInitializer: ⚠️ No ImageGen factory assigned");
      }
    }
    
    // Set up model generator
    if (this.modelGenFactory) {
      this.queue.setModelGenerator(async (prompt: string, position?: vec3) => {
        return await this.modelGenFactory.generateModel(prompt, position);
      });
      
      setupCount++;
      
      if (this.enableDebugLogging) {
        print("GenerationQueueInitializer: ✅ Model generator connected to queue");
      }
    } else {
      if (this.enableDebugLogging) {
        print("GenerationQueueInitializer: ⚠️ No ModelGen factory assigned");
      }
    }
    
    if (this.enableDebugLogging) {
      print(`GenerationQueueInitializer: 🚀 Queue system initialized with ${setupCount} generators`);
      print(`GenerationQueueInitializer: ⚙️ Concurrency limits - Images: ${this.maxConcurrentImages}, Models: ${this.maxConcurrentModels}`);
    }
  }
  
  /**
   * Enable or disable the queue system at runtime
   */
  public setQueueEnabled(enabled: boolean): void {
    this.enableQueueSystem = enabled;
    
    if (enabled && !this.queue) {
      this.initializeQueue();
    }
    
    if (this.enableDebugLogging) {
      print(`GenerationQueueInitializer: Queue system ${enabled ? 'enabled' : 'disabled'}`);
    }
  }
  
  /**
   * Update concurrency limits at runtime
   */
  public updateConcurrencyLimits(imageLimit: number, modelLimit: number): void {
    if (this.queue) {
      this.maxConcurrentImages = imageLimit;
      this.maxConcurrentModels = modelLimit;
      this.queue.setConcurrencyLimits(imageLimit, modelLimit);
      
      if (this.enableDebugLogging) {
        print(`GenerationQueueInitializer: Updated concurrency limits - Images: ${imageLimit}, Models: ${modelLimit}`);
      }
    }
  }
  
  /**
   * Get current queue status
   */
  public getQueueStatus(): any {
    if (this.queue) {
      return this.queue.getQueueStatus();
    }
    return null;
  }
}