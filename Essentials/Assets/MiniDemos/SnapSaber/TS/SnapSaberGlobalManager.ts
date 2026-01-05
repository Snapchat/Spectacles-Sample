/**
 * SnapSaberGlobalManager - TypeScript component for Lens Studio
 * Provides a global access point for various functions in the SnapSaber game
 * Acts as a singleton that can be accessed from any component
 */
@component
export class SnapSaberGlobalManager extends BaseScriptComponent {
  @input
  @hint("Text component that displays the score")
  scoreText!: Component

  @input
  @hint("Points awarded for each successful hit")
  pointsPerHit: number = 10

  // Game state
  private score: number = 0
  private lastHitTime: number = 0
  private hitCooldown: number = 0.1 // Prevent multiple hits in quick succession
  private isInitialized: boolean = false

  // We'll use a global to store the instance since we can't modify static properties
  // at runtime in Lens Studio
  private globalInstanceName: string = "SnapSaberGlobalManagerInstance"

  onAwake(): void {
    // Set up the singleton - using the global scope to store the instance
    // @ts-ignore - Accessing global scope
    global[this.globalInstanceName] = this

    // Bind the onStart event
    this.createEvent("OnStartEvent").bind(() => {
      this.onStart()
    })

    print("SnapSaber Global Manager initialized via global variable")
  }

  onStart(): void {
    // Initialize the score
    this.score = 0
    this.updateScoreDisplay()

    this.isInitialized = true
    print("SnapSaber Global Manager started")
  }

  /**
   * Get the singleton instance
   */
  static getInstance(): SnapSaberGlobalManager | null {
    try {
      // @ts-ignore - Accessing global scope
      return global["SnapSaberGlobalManagerInstance"] || null
    } catch (e) {
      print("Error accessing global manager: " + e)
      return null
    }
  }

  /**
   * Register a hit and update the score - can be called from any component
   */
  registerHit(targetObject: SceneObject): void {
    if (!this.isInitialized) return

    const currentTime = getTime()

    // Check if we're still in cooldown from the last hit
    if (currentTime - this.lastHitTime < this.hitCooldown) {
      return
    }

    // Increase the score
    this.score += this.pointsPerHit
    this.lastHitTime = currentTime

    // Update the score display
    this.updateScoreDisplay()

    print(`Global Manager: Target hit! New score: ${this.score}`)

    // Destroy the target object
    if (targetObject) {
      try {
        targetObject.destroy()
      } catch (e) {
        print("Error destroying target: " + e)
      }
    }
  }

  /**
   * Get the current score
   */
  getScore(): number {
    return this.score
  }

  // Update the score text display
  private updateScoreDisplay(): void {
    if (this.scoreText) {
      try {
        ;(this.scoreText as any).text = `Score: ${this.score}`
      } catch (e) {
        print("Error updating score display: " + e)
      }
    }
  }
}
