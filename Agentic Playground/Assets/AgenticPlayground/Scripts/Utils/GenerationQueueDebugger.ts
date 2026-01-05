import {setTimeout} from "SpectaclesInteractionKit.lspkg/Utils/FunctionTimingUtils"
import {ImageNode} from "../Nodes/ImageNode"
import {ModelNode} from "../Nodes/ModelNode"
import {GenerationQueue} from "./GenerationQueue"

/**
 * GenerationQueueDebugger - Debug component for monitoring the GenerationQueue
 *
 * Add this to your scene to monitor queue status and test the generation system.
 * Shows real-time queue statistics and allows manual testing.
 *
 * You can test with actual node prefabs by referencing them in the inspector.
 */
@component
export class GenerationQueueDebugger extends BaseScriptComponent {
  @input
  @hint("Enable real-time queue status logging")
  public enableStatusLogging: boolean = true

  @input
  @hint("Status update interval in seconds")
  @widget(new SliderWidget(0.5, 5.0, 0.5))
  public updateInterval: number = 2.0

  @input
  @hint("Test the queue with sample generations")
  public runTestOnStart: boolean = false

  @input
  @hint("Number of test images to generate")
  @widget(new SliderWidget(0, 10, 1))
  public testImageCount: number = 3

  @input
  @hint("Number of test models to generate")
  @widget(new SliderWidget(0, 5, 1))
  public testModelCount: number = 2

  // Node prefab testing
  @input
  @hint("Test using actual node prefabs instead of direct queue")
  public useNodePrefabs: boolean = false

  @input
  @hint("Image node prefab for testing")
  public imageNodePrefab: ObjectPrefab

  @input
  @hint("Model node prefab for testing")
  public modelNodePrefab: ObjectPrefab

  @input
  @hint("Parent object for spawned test nodes")
  public testNodeParent: SceneObject

  private queue: GenerationQueue
  private statusInterval: any

  onAwake() {
    this.queue = GenerationQueue.getInstance()

    this.createEvent("OnStartEvent").bind(() => {
      if (this.enableStatusLogging) {
        this.startStatusMonitoring()
      }

      if (this.runTestOnStart) {
        // Wait a bit for everything to initialize
        setTimeout(() => {
          this.runQueueTest()
        }, 1000)
      }
    })
  }

  onDestroy() {
    this.stopStatusMonitoring()
  }

  private startStatusMonitoring(): void {
    print("GenerationQueueDebugger: Starting queue status monitoring")

    // Initial status
    this.logQueueStatus()

    // Set up interval
    this.statusInterval = setInterval(() => {
      this.logQueueStatus()
    }, this.updateInterval * 1000)
  }

  private stopStatusMonitoring(): void {
    if (this.statusInterval) {
      clearInterval(this.statusInterval)
      this.statusInterval = null
      print("GenerationQueueDebugger: Stopped queue status monitoring")
    }
  }

  private logQueueStatus(): void {
    const status = this.queue.getQueueStatus()

    print("═══════════════════════════════════════")
    print("GENERATION QUEUE STATUS")
    print("═══════════════════════════════════════")
    print(`Image Queue: ${status.imageQueueSize} pending, ${status.activeImageRequests} active`)
    print(`Model Queue: ${status.modelQueueSize} pending, ${status.activeModelRequests} active`)
    print(`⚡  Processing: Images ${status.isProcessingImage ? "" : ""}, Models ${status.isProcessingModel ? "" : ""}`)
    print("═══════════════════════════════════════")
  }

  /**
   * Run a test to verify queue functionality
   */
  public runQueueTest(): void {
    if (this.useNodePrefabs && (this.imageNodePrefab || this.modelNodePrefab)) {
      this.runNodePrefabTest()
    } else {
      this.runDirectQueueTest()
    }
  }

  /**
   * Test using actual node prefabs
   */
  private runNodePrefabTest(): void {
    print("\n🧪 STARTING NODE PREFAB GENERATION TEST")
    print(`📝 Testing with ${this.testImageCount} ImageNodes and ${this.testModelCount} ModelNodes`)

    if (!this.testNodeParent) {
      this.testNodeParent = this.getSceneObject()
    }

    const testPrompts = this.getTestPrompts()
    const startTime = Date.now()
    const testNodes: SceneObject[] = []

    // Create and test ImageNodes
    if (this.imageNodePrefab) {
      for (let i = 0; i < this.testImageCount; i++) {
        const nodeObject = this.imageNodePrefab.instantiate(this.testNodeParent)
        const position = new vec3(i * 30, 0, 0)
        nodeObject.getTransform().setWorldPosition(position)

        const imageNode = nodeObject.getComponent(ImageNode.getTypeName()) as ImageNode
        if (imageNode) {
          const prompt = testPrompts[i % testPrompts.length]
          imageNode.setNodeData(`Test Image ${i + 1}`, `Testing concurrent generation`, prompt)

          // Trigger generation
          imageNode.generateContent(prompt).catch((error) => {
            print(`ImageNode ${i} generation failed: ${error}`)
          })

          print(`Created ImageNode ${i} at ${position.toString()} with prompt: "${prompt}"`)
        }

        testNodes.push(nodeObject)
      }
    }

    // Create and test ModelNodes
    if (this.modelNodePrefab) {
      for (let i = 0; i < this.testModelCount; i++) {
        const nodeObject = this.modelNodePrefab.instantiate(this.testNodeParent)
        const position = new vec3(i * 30, 50, 0)
        nodeObject.getTransform().setWorldPosition(position)

        const modelNode = nodeObject.getComponent(ModelNode.getTypeName()) as ModelNode
        if (modelNode) {
          const prompt = testPrompts[(i + 5) % testPrompts.length]
          modelNode.setNodeData(`Test Model ${i + 1}`, `Testing concurrent 3D generation`, prompt)

          // Trigger generation
          modelNode.generateContent(prompt).catch((error) => {
            print(`ModelNode ${i} generation failed: ${error}`)
          })

          print(`Created ModelNode ${i} at ${position.toString()} with prompt: "${prompt}"`)
        }

        testNodes.push(nodeObject)
      }
    }

    print(`\n⏳ Created ${testNodes.length} test nodes - monitoring generation...`)

    // Clean up nodes after delay
    setTimeout(() => {
      print("\n🧹 Cleaning up test nodes...")
      testNodes.forEach((node) => {
        if (node) {
          try {
            node.destroy()
          } catch (e) {
            // Node might already be destroyed
          }
        }
      })
      print("Test nodes cleaned up")
    }, 30000) // 30 seconds
  }

  /**
   * Test using direct queue API
   */
  private runDirectQueueTest(): void {
    print("\n🧪 STARTING DIRECT QUEUE TEST")
    print(`📝 Queuing ${this.testImageCount} images and ${this.testModelCount} models`)

    const testPrompts = this.getTestPrompts()
    let successCount = 0
    let errorCount = 0
    const startTime = Date.now()

    // Queue test images
    for (let i = 0; i < this.testImageCount; i++) {
      const prompt = testPrompts[i % testPrompts.length]
      const requestId = this.queue.queueImageGeneration({
        id: `test_img_${i}`,
        type: "image",
        prompt: prompt,
        priority: i,
        callback: (result) => {
          successCount++
          print(`Test image ${i} completed: "${prompt}"`)
          this.checkTestComplete(startTime, successCount, errorCount)
        },
        errorCallback: (error) => {
          errorCount++
          print(`Test image ${i} failed: ${error}`)
          this.checkTestComplete(startTime, successCount, errorCount)
        }
      })

      print(`Queued test image ${i}: "${prompt}" (ID: ${requestId})`)
    }

    // Queue test models
    for (let i = 0; i < this.testModelCount; i++) {
      const prompt = testPrompts[(i + 5) % testPrompts.length]
      const requestId = this.queue.queueModelGeneration({
        id: `test_model_${i}`,
        type: "model",
        prompt: prompt,
        priority: i,
        callback: (result) => {
          successCount++
          print(`Test model ${i} completed: "${prompt}"`)
          this.checkTestComplete(startTime, successCount, errorCount)
        },
        errorCallback: (error) => {
          errorCount++
          print(`Test model ${i} failed: ${error}`)
          this.checkTestComplete(startTime, successCount, errorCount)
        },
        metadata: {
          position: new vec3(i * 10, 0, 0)
        }
      })

      print(`Queued test model ${i}: "${prompt}" (ID: ${requestId})`)
    }

    print(`\n⏳ Test started - monitoring ${this.testImageCount + this.testModelCount} generations...`)
  }

  private getTestPrompts(): string[] {
    return [
      "A futuristic robot assistant",
      "A magical floating crystal",
      "An ancient mystical artifact",
      "A holographic interface panel",
      "A glowing energy orb",
      "A mechanical dragon",
      "A cyberpunk cityscape",
      "An alien technology device",
      "A steampunk mechanism",
      "A quantum computer core"
    ]
  }

  private checkTestComplete(startTime: number, successCount: number, errorCount: number): void {
    const totalExpected = this.testImageCount + this.testModelCount
    const totalCompleted = successCount + errorCount

    if (totalCompleted >= totalExpected) {
      const duration = (Date.now() - startTime) / 1000

      print("\n═══════════════════════════════════════")
      print("GENERATION QUEUE TEST COMPLETE")
      print("═══════════════════════════════════════")
      print(`Duration: ${duration.toFixed(2)} seconds`)
      print(`Successful: ${successCount}/${totalExpected}`)
      print(`Failed: ${errorCount}/${totalExpected}`)
      print(`Success Rate: ${((successCount / totalExpected) * 100).toFixed(1)}%`)
      print("═══════════════════════════════════════\n")
    }
  }

  /**
   * Clear all pending requests
   */
  public clearAllQueues(): void {
    this.queue.clearQueues()
    print("GenerationQueueDebugger: Cleared all generation queues")
  }

  /**
   * Update monitoring settings
   */
  public setMonitoringEnabled(enabled: boolean): void {
    this.enableStatusLogging = enabled

    if (enabled && !this.statusInterval) {
      this.startStatusMonitoring()
    } else if (!enabled && this.statusInterval) {
      this.stopStatusMonitoring()
    }
  }
}

// Helper to clear interval (TypeScript doesn't have clearInterval by default in Lens Studio)
function clearInterval(interval: any): void {
  if (interval && interval.cancel) {
    interval.cancel()
  }
}

// Helper to set interval
function setInterval(callback: () => void, delay: number): any {
  let cancelled = false

  const intervalFunc = () => {
    if (!cancelled) {
      callback()
      setTimeout(intervalFunc, delay)
    }
  }

  setTimeout(intervalFunc, delay)

  return {
    cancel: () => {
      cancelled = true
    }
  }
}
