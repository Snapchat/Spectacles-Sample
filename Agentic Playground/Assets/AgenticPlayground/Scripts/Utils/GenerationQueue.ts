import { setTimeout } from "SpectaclesInteractionKit.lspkg/Utils/FunctionTimingUtils";

/**
 * GenerationQueue - Manages queued generation requests for images and 3D models
 * 
 * This utility solves the concurrent generation limitation by queuing requests
 * and processing them either sequentially or with controlled parallelism.
 * 
 * The Remote Service Gateway supports async operations, but our factories
 * (ImageGen and ModelGen) were designed to handle one request at a time.
 * 
 * USAGE INSTRUCTIONS:
 * 
 * 1. Add GenerationQueueInitializer component to your scene:
 *    - Create an empty SceneObject
 *    - Add the GenerationQueueInitializer script component
 *    - Reference your ImageGen and ModelGen factory components
 *    - Set concurrency limits (1 = sequential, 2+ = parallel)
 * 
 * 2. Update your ImageNode and ModelNode prefabs:
 *    - Set "useGenerationQueue" to true (enabled by default)
 *    - Nodes will automatically use the queue system
 * 
 * 3. How it works:
 *    - When multiple nodes request generation, they're added to a queue
 *    - Queue processes requests based on concurrency settings
 *    - Each node's spinner is managed independently
 *    - Supports both sequential (safe) and parallel (faster) processing
 * 
 * 4. Configuration options:
 *    - maxConcurrentImages: How many images can generate at once (1-3)
 *    - maxConcurrentModels: How many models can generate at once (1-2)
 *    - enableDebugLogging: See detailed queue operations in console
 * 
 * 5. Benefits:
 *    - Prevents "only one image/model generated" issue
 *    - Manages API rate limits automatically
 *    - Provides better user experience with parallel processing
 *    - Maintains backward compatibility with direct generation
 */

export interface GenerationRequest {
  id: string;
  type: 'image' | 'model';
  prompt: string;
  priority?: number;
  callback?: (result: any) => void;
  errorCallback?: (error: string) => void;
  metadata?: any;
}

export class GenerationQueue {
  private static instance: GenerationQueue;
  
  private imageQueue: GenerationRequest[] = [];
  private modelQueue: GenerationRequest[] = [];
  
  private isProcessingImage: boolean = false;
  private isProcessingModel: boolean = false;
  
  private maxConcurrentImage: number = 1;
  private maxConcurrentModel: number = 1;
  
  private activeImageRequests: number = 0;
  private activeModelRequests: number = 0;
  
  private enableDebugLogging: boolean = true;
  
  // Callbacks to actual generation functions
  private imageGenerator: ((prompt: string) => Promise<any>) | null = null;
  private modelGenerator: ((prompt: string, position?: any) => Promise<any>) | null = null;
  
  private constructor() {
    print("GenerationQueue: 🚀 Initialized generation queue system");
  }
  
  /**
   * Get singleton instance
   */
  public static getInstance(): GenerationQueue {
    if (!GenerationQueue.instance) {
      GenerationQueue.instance = new GenerationQueue();
    }
    return GenerationQueue.instance;
  }
  
  /**
   * Set the image generation function
   */
  public setImageGenerator(generator: (prompt: string) => Promise<any>): void {
    this.imageGenerator = generator;
    if (this.enableDebugLogging) {
      print("GenerationQueue: 🖼️ Image generator function registered");
    }
  }
  
  /**
   * Set the model generation function
   */
  public setModelGenerator(generator: (prompt: string, position?: any) => Promise<any>): void {
    this.modelGenerator = generator;
    if (this.enableDebugLogging) {
      print("GenerationQueue: 🎨 Model generator function registered");
    }
  }
  
  /**
   * Add an image generation request to the queue
   */
  public queueImageGeneration(request: GenerationRequest): string {
    const requestId = request.id || this.generateRequestId();
    
    this.imageQueue.push({
      ...request,
      id: requestId
    });
    
    if (this.enableDebugLogging) {
      print(`GenerationQueue: 📥 Queued image request "${requestId}" - Queue size: ${this.imageQueue.length}`);
    }
    
    // Start processing if not already running
    this.processImageQueue();
    
    return requestId;
  }
  
  /**
   * Add a model generation request to the queue
   */
  public queueModelGeneration(request: GenerationRequest): string {
    const requestId = request.id || this.generateRequestId();
    
    this.modelQueue.push({
      ...request,
      id: requestId
    });
    
    if (this.enableDebugLogging) {
      print(`GenerationQueue: 📥 Queued model request "${requestId}" - Queue size: ${this.modelQueue.length}`);
    }
    
    // Start processing if not already running
    this.processModelQueue();
    
    return requestId;
  }
  
  /**
   * Process image generation queue
   */
  private async processImageQueue(): Promise<void> {
    // Only check if queue is empty or if we're at max capacity
    if (this.imageQueue.length === 0 || this.activeImageRequests >= this.maxConcurrentImage) {
      return;
    }
    
    if (!this.imageGenerator) {
      print("GenerationQueue: ❌ No image generator registered");
      return;
    }
    
    this.isProcessingImage = true;
    
    while (this.imageQueue.length > 0 && this.activeImageRequests < this.maxConcurrentImage) {
      const request = this.imageQueue.shift();
      if (!request) continue;
      
      this.activeImageRequests++;
      
      if (this.enableDebugLogging) {
        print(`GenerationQueue: 🎨 Processing image request "${request.id}" - Remaining: ${this.imageQueue.length}`);
      }
      
      // Process the request without blocking the loop
      this.processImageRequest(request).then(() => {
        // Request completed - check if we need to process more
        if (this.imageQueue.length > 0) {
          setTimeout(() => this.processImageQueue(), 100);
        }
      });
    }
    
    this.isProcessingImage = false;
    
    // Check if there are more items that were added while processing
    if (this.imageQueue.length > 0) {
      setTimeout(() => this.processImageQueue(), 100);
    }
  }
  
  /**
   * Process a single image request
   */
  private async processImageRequest(request: GenerationRequest): Promise<void> {
    try {
      const result = await this.imageGenerator!(request.prompt);
      
      if (request.callback) {
        request.callback(result);
      }
      
      if (this.enableDebugLogging) {
        print(`GenerationQueue: ✅ Completed image request "${request.id}"`);
      }
      
    } catch (error) {
      if (this.enableDebugLogging) {
        print(`GenerationQueue: ❌ Failed image request "${request.id}": ${error}`);
      }
      
      if (request.errorCallback) {
        request.errorCallback(error.toString());
      }
    } finally {
      this.activeImageRequests--;
      
      // Add a small delay between requests to avoid overwhelming the API
      await this.delay(500);
    }
  }

  /**
   * Process model generation queue
   */
  private async processModelQueue(): Promise<void> {
    if (this.enableDebugLogging) {
      print(`GenerationQueue: 📊 processModelQueue called - Queue: ${this.modelQueue.length}, Active: ${this.activeModelRequests}, Max: ${this.maxConcurrentModel}`);
    }
    
    // Only check if queue is empty or if we're at max capacity
    if (this.modelQueue.length === 0 || this.activeModelRequests >= this.maxConcurrentModel) {
      if (this.enableDebugLogging) {
        print(`GenerationQueue: ⏸️ Skipping model processing - Queue empty: ${this.modelQueue.length === 0}, At capacity: ${this.activeModelRequests >= this.maxConcurrentModel}`);
      }
      return;
    }
    
    if (!this.modelGenerator) {
      print("GenerationQueue: ❌ No model generator registered");
      return;
    }
    
    this.isProcessingModel = true;
    
    while (this.modelQueue.length > 0 && this.activeModelRequests < this.maxConcurrentModel) {
      const request = this.modelQueue.shift();
      if (!request) continue;
      
      this.activeModelRequests++;
      
      if (this.enableDebugLogging) {
        print(`GenerationQueue: 🏗️ Processing model request "${request.id}" - Active: ${this.activeModelRequests}/${this.maxConcurrentModel}, Remaining in queue: ${this.modelQueue.length}`);
      }
      
      // Process the request without blocking the loop
      this.processModelRequest(request).then(() => {
        // Request completed - check if we need to process more
        if (this.modelQueue.length > 0) {
          setTimeout(() => this.processModelQueue(), 100);
        }
      });
    }
    
    this.isProcessingModel = false;
    
    if (this.enableDebugLogging) {
      print(`GenerationQueue: 🏁 Model processing loop ended - Queue: ${this.modelQueue.length}, Active: ${this.activeModelRequests}`);
    }
    
    // Check if there are more items that were added while processing
    if (this.modelQueue.length > 0 || this.activeModelRequests > 0) {
      if (this.enableDebugLogging) {
        print(`GenerationQueue: 🔄 Scheduling next model processing - Queue: ${this.modelQueue.length}, Active: ${this.activeModelRequests}`);
      }
      setTimeout(() => this.processModelQueue(), 100);
    } else {
      if (this.enableDebugLogging) {
        print(`GenerationQueue: ✅ Model queue empty and no active requests`);
      }
    }
  }
  
  /**
   * Process a single model request
   */
  private async processModelRequest(request: GenerationRequest): Promise<void> {
    try {
      const result = await this.modelGenerator!(request.prompt, request.metadata?.position);
      
      if (request.callback) {
        request.callback(result);
      }
      
      if (this.enableDebugLogging) {
        print(`GenerationQueue: ✅ Completed model request "${request.id}"`);
      }
      
    } catch (error) {
      if (this.enableDebugLogging) {
        print(`GenerationQueue: ❌ Failed model request "${request.id}": ${error}`);
      }
      
      if (request.errorCallback) {
        request.errorCallback(error.toString());
      }
    } finally {
      this.activeModelRequests--;
      
      // Add a longer delay for 3D models as they take more time
      await this.delay(1000);
    }
  }

  /**
   * Get queue status
   */
  public getQueueStatus(): {
    imageQueueSize: number;
    modelQueueSize: number;
    activeImageRequests: number;
    activeModelRequests: number;
    isProcessingImage: boolean;
    isProcessingModel: boolean;
  } {
    return {
      imageQueueSize: this.imageQueue.length,
      modelQueueSize: this.modelQueue.length,
      activeImageRequests: this.activeImageRequests,
      activeModelRequests: this.activeModelRequests,
      isProcessingImage: this.isProcessingImage,
      isProcessingModel: this.isProcessingModel
    };
  }
  
  /**
   * Clear all queues
   */
  public clearQueues(): void {
    this.imageQueue = [];
    this.modelQueue = [];
    
    if (this.enableDebugLogging) {
      print("GenerationQueue: 🗑️ All queues cleared");
    }
  }
  
  /**
   * Set concurrency limits
   */
  public setConcurrencyLimits(imageLimit: number, modelLimit: number): void {
    this.maxConcurrentImage = Math.max(1, imageLimit);
    this.maxConcurrentModel = Math.max(1, modelLimit);
    
    if (this.enableDebugLogging) {
      print(`GenerationQueue: ⚙️ Concurrency limits set - Images: ${this.maxConcurrentImage}, Models: ${this.maxConcurrentModel}`);
    }
  }
  
  /**
   * Helper to generate unique request ID
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  /**
   * Helper to add delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => {
      setTimeout(() => resolve(), ms);
    });
  }
}