import { setTimeout } from "SpectaclesInteractionKit.lspkg/Utils/FunctionTimingUtils";

/**
 * ModelGenerationScheduler - Manages scheduling of model generation requests
 * 
 * This scheduler ensures that model generations don't overwhelm the system
 * while allowing each ModelNode to use its own ModelGenBridge for proper placement.
 * 
 * Unlike GenerationQueue which uses a centralized generator, this scheduler
 * simply manages timing and lets each node handle its own generation.
 */
export class ModelGenerationScheduler {
  private static instance: ModelGenerationScheduler;
  
  private queue: Array<{
    nodeId: string;
    generateFunction: () => Promise<void>;
    priority: number;
  }> = [];
  
  private isProcessing: boolean = false;
  private activeGenerations: number = 0;
  private maxConcurrent: number = 1;
  private enableDebugLogging: boolean = true;
  
  private constructor() {
    print("ModelGenerationScheduler: 🚀 Initialized model generation scheduler");
  }
  
  /**
   * Get singleton instance
   */
  public static getInstance(): ModelGenerationScheduler {
    if (!ModelGenerationScheduler.instance) {
      ModelGenerationScheduler.instance = new ModelGenerationScheduler();
    }
    return ModelGenerationScheduler.instance;
  }
  
  /**
   * Schedule a model generation
   */
  public scheduleGeneration(
    nodeId: string, 
    generateFunction: () => Promise<void>,
    priority: number = 0
  ): void {
    // Add to queue
    this.queue.push({
      nodeId,
      generateFunction,
      priority
    });
    
    // Sort by priority (higher priority first)
    this.queue.sort((a, b) => b.priority - a.priority);
    
    if (this.enableDebugLogging) {
      print(`ModelGenerationScheduler: 📥 Scheduled generation for node ${nodeId} - Queue size: ${this.queue.length}`);
    }
    
    // Start processing if not already running
    this.processQueue();
  }
  
  /**
   * Process the generation queue
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.activeGenerations >= this.maxConcurrent) {
      if (this.enableDebugLogging) {
        print(`ModelGenerationScheduler: ⏸️ Skipping processing - Active: ${this.activeGenerations}/${this.maxConcurrent}`);
      }
      return;
    }
    
    this.isProcessing = true;
    
    while (this.queue.length > 0 && this.activeGenerations < this.maxConcurrent) {
      const request = this.queue.shift();
      if (!request) continue;
      
      this.activeGenerations++;
      
      if (this.enableDebugLogging) {
        print(`ModelGenerationScheduler: 🏗️ Processing generation for node ${request.nodeId}`);
      }
      
      // Process without blocking the loop
      this.processRequest(request).then(() => {
        // Check if we need to process more
        if (this.queue.length > 0) {
          setTimeout(() => this.processQueue(), 100);
        }
      });
    }
    
    this.isProcessing = false;
  }
  
  /**
   * Process a single request
   */
  private async processRequest(request: {
    nodeId: string;
    generateFunction: () => Promise<void>;
    priority: number;
  }): Promise<void> {
    try {
      await request.generateFunction();
      
      if (this.enableDebugLogging) {
        print(`ModelGenerationScheduler: ✅ Completed generation for node ${request.nodeId}`);
      }
    } catch (error) {
      if (this.enableDebugLogging) {
        print(`ModelGenerationScheduler: ❌ Failed generation for node ${request.nodeId}: ${error}`);
      }
    } finally {
      this.activeGenerations--;
      
      // Add delay between generations
      await this.delay(1000);
    }
  }
  
  /**
   * Set maximum concurrent generations
   */
  public setMaxConcurrent(max: number): void {
    this.maxConcurrent = Math.max(1, max);
    
    if (this.enableDebugLogging) {
      print(`ModelGenerationScheduler: ⚙️ Max concurrent set to ${this.maxConcurrent}`);
    }
  }
  
  /**
   * Get scheduler status
   */
  public getStatus(): {
    queueSize: number;
    activeGenerations: number;
    maxConcurrent: number;
  } {
    return {
      queueSize: this.queue.length,
      activeGenerations: this.activeGenerations,
      maxConcurrent: this.maxConcurrent
    };
  }
  
  /**
   * Clear the queue
   */
  public clearQueue(): void {
    this.queue = [];
    
    if (this.enableDebugLogging) {
      print("ModelGenerationScheduler: 🗑️ Queue cleared");
    }
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