import { ImageGen } from '../Core/ImageGen';
import { ModelGen } from '../Core/ModelGen';

/**
 * TestConcurrentGeneration - Test component to verify concurrent media generation
 * 
 * This component tests that multiple images and 3D models can be generated
 * simultaneously after removing the blocking behavior from factories.
 */
@component
export class TestConcurrentGeneration extends BaseScriptComponent {
  
  @input
  @hint("Reference to ImageGen factory")
  imageGenFactory: ImageGen;
  
  @input
  @hint("Reference to ModelGen factory")
  modelGenFactory: ModelGen;
  
  @input
  @hint("Number of concurrent image generations to test")
  @widget(new SliderWidget(1, 5, 1))
  concurrentImages: number = 3;
  
  @input
  @hint("Number of concurrent model generations to test")
  @widget(new SliderWidget(1, 3, 1))
  concurrentModels: number = 2;
  
  @input
  @hint("Start test on awake")
  startOnAwake: boolean = true;
  
  private testResults: Map<string, {startTime: number, endTime?: number, status: string}> = new Map();
  
  onAwake() {
    if (this.startOnAwake) {
      this.createEvent("OnStartEvent").bind(() => {
        this.runConcurrentTest();
      });
    }
  }
  
  /**
   * Run concurrent generation test
   */
  public async runConcurrentTest(): Promise<void> {
    print("TestConcurrentGeneration: 🚀 Starting concurrent generation test");
    print(`  - Testing ${this.concurrentImages} concurrent images`);
    print(`  - Testing ${this.concurrentModels} concurrent 3D models`);
    
    const startTime = Date.now();
    const promises: Promise<any>[] = [];
    
    // Start concurrent image generations
    for (let i = 0; i < this.concurrentImages; i++) {
      const requestId = `image_${i}`;
      const prompt = `Test image ${i + 1}: A beautiful landscape with unique elements`;
      
      this.testResults.set(requestId, {
        startTime: Date.now(),
        status: 'started'
      });
      
      const promise = this.imageGenFactory.generateImage(prompt)
        .then((texture) => {
          const result = this.testResults.get(requestId);
          if (result) {
            result.endTime = Date.now();
            result.status = 'completed';
            const duration = result.endTime - result.startTime;
            print(`TestConcurrentGeneration: ✅ Image ${i} completed in ${duration}ms`);
          }
          return texture;
        })
        .catch((error) => {
          const result = this.testResults.get(requestId);
          if (result) {
            result.endTime = Date.now();
            result.status = 'failed';
            print(`TestConcurrentGeneration: ❌ Image ${i} failed: ${error}`);
          }
        });
      
      promises.push(promise);
    }
    
    // Start concurrent model generations
    for (let i = 0; i < this.concurrentModels; i++) {
      const requestId = `model_${i}`;
      const prompt = `Test model ${i + 1}: A detailed 3D object with unique features`;
      
      this.testResults.set(requestId, {
        startTime: Date.now(),
        status: 'started'
      });
      
      const promise = this.modelGenFactory.generateModel(prompt)
        .then((result) => {
          const testResult = this.testResults.get(requestId);
          if (testResult) {
            testResult.endTime = Date.now();
            testResult.status = 'completed';
            const duration = testResult.endTime - testResult.startTime;
            print(`TestConcurrentGeneration: ✅ Model ${i} completed in ${duration}ms`);
          }
          return result;
        })
        .catch((error) => {
          const testResult = this.testResults.get(requestId);
          if (testResult) {
            testResult.endTime = Date.now();
            testResult.status = 'failed';
            print(`TestConcurrentGeneration: ❌ Model ${i} failed: ${error}`);
          }
        });
      
      promises.push(promise);
    }
    
    // Wait for all generations to complete
    try {
      await Promise.all(promises);
      const totalDuration = Date.now() - startTime;
      
      print("TestConcurrentGeneration: 🎉 All generations completed!");
      print(`  - Total time: ${totalDuration}ms`);
      
      // Analyze concurrency
      this.analyzeConcurrency();
      
    } catch (error) {
      print(`TestConcurrentGeneration: ❌ Test failed with error: ${error}`);
    }
  }
  
  /**
   * Analyze if generations ran concurrently
   */
  private analyzeConcurrency(): void {
    print("\nTestConcurrentGeneration: 📊 Concurrency Analysis:");
    
    // Check for overlapping generation times
    const results = Array.from(this.testResults.entries());
    let overlappingGenerations = 0;
    
    for (let i = 0; i < results.length; i++) {
      for (let j = i + 1; j < results.length; j++) {
        const [id1, result1] = results[i];
        const [id2, result2] = results[j];
        
        if (result1.endTime && result2.endTime) {
          // Check if generations overlapped in time
          const overlap = 
            (result1.startTime <= result2.startTime && result2.startTime <= result1.endTime) ||
            (result2.startTime <= result1.startTime && result1.startTime <= result2.endTime);
          
          if (overlap) {
            overlappingGenerations++;
            print(`  - ${id1} and ${id2} ran concurrently`);
          }
        }
      }
    }
    
    if (overlappingGenerations > 0) {
      print(`\nTestConcurrentGeneration: ✅ CONCURRENT GENERATION CONFIRMED`);
      print(`  - Found ${overlappingGenerations} overlapping generation pairs`);
    } else {
      print(`\nTestConcurrentGeneration: ⚠️ No concurrent generations detected`);
      print(`  - Generations may have run sequentially`);
    }
  }
  
  /**
   * Get test results
   */
  public getTestResults(): Map<string, any> {
    return this.testResults;
  }
}