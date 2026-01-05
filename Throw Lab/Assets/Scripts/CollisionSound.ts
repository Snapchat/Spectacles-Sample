/**
 * Plays a sound when object collides with something.
 * Add this to balls, rackets, or any object that should make sound on impact.
 */
@component
export class CollisionSound extends BaseScriptComponent {
  @input
  @hint("Sound to play on collision")
  collisionSound: AudioComponent

  @input
  @hint("Minimum velocity magnitude to play sound (prevents tiny bumps from making noise)")
  minVelocityThreshold: number = 5.0

  @input
  @hint("Volume multiplier based on impact speed (0-1)")
  velocityToVolume: number = 0.05

  private bodyComponent: BodyComponent | null = null

  onAwake() {
    // Get the body component
    this.bodyComponent = this.getSceneObject().getComponent("Physics.BodyComponent")

    if (!this.bodyComponent) {
      print("CollisionSound: Physics.BodyComponent is required!")
      return
    }

    // Set up audio for low latency
    if (this.collisionSound) {
      this.collisionSound.playbackMode = Audio.PlaybackMode.LowLatency
    }

    // Set up collision event
    this.bodyComponent.onCollisionEnter.add(this.onCollisionEnter.bind(this))
  }

  /**
   * Called when object collides with something
   */
  private onCollisionEnter(e: CollisionEnterEventArgs) {
    if (!this.collisionSound) return

    // Get impact velocity
    const velocity = this.bodyComponent ? this.bodyComponent.velocity : vec3.zero()
    const speed = velocity.length

    // Only play sound if impact is strong enough
    if (speed < this.minVelocityThreshold) {
      return
    }

    // Calculate volume based on impact speed (clamped to 0-1)
    const volume = Math.min(1.0, speed * this.velocityToVolume)

    print(`CollisionSound: Playing impact sound at volume ${volume.toFixed(2)} (speed: ${speed.toFixed(1)})`)

    // Play the sound
    this.collisionSound.play(volume)
  }
}
