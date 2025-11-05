/**
 * Handles dart sticking to the score board on collision.
 * Works with GrabbableObject and MatchTransform system.
 * Add this component to dart objects.
 */
@component
export class DartStick extends BaseScriptComponent {
    @input
    @hint("The score board object to stick to")
    scoreBoard: SceneObject
    
    @input
    @hint("Sound to play when dart sticks to board")
    hitSound: AudioComponent
    
    @input
    @hint("Sound to play when dart bounces off board")
    bounceSound: AudioComponent
    
    //@input
    //@hint("Maximum angle in degrees for a successful stick (default: 66)")
    private maxStickAngle: number = 170.0
    
    @input
    @hint("Offset for tip positioning (default: -0.66)")
    tipOffset: number = -0.66
    
    private bodyComponent: BodyComponent | null = null
    private hasStuck: boolean = false
    private scoreBoardTransform: Transform | null = null
    
    onAwake() {
        // Get the body component
        this.bodyComponent = this.getSceneObject().getComponent("Physics.BodyComponent")
        
        if (!this.bodyComponent) {
            print("DartStick: Physics.BodyComponent is required!")
            return
        }
        
        // Set up audio for low latency
        if (this.hitSound) {
            this.hitSound.playbackMode = Audio.PlaybackMode.LowLatency
        }
        if (this.bounceSound) {
            this.bounceSound.playbackMode = Audio.PlaybackMode.LowLatency
        }
        
        // Get score board transform
        if (this.scoreBoard) {
            this.scoreBoardTransform = this.scoreBoard.getTransform()
        }
        
        // Set up collision event
        this.bodyComponent.onCollisionEnter.add(this.onCollisionEnter.bind(this))
    }
    
    /**
     * Called when dart collides with something
     */
    private onCollisionEnter(e: CollisionEnterEventArgs) {
        if (this.hasStuck) return
        
        const collision = e.collision
        
        // Check if we hit the score board
        const hitObject = collision.collider.getSceneObject()
        const isDartBoardHit = hitObject.name === "DartBoard" || hitObject === this.scoreBoard
        
        if (!isDartBoardHit) {
            // Hit something else, just bounce
            if (this.bounceSound) {
                this.bounceSound.play(1)
            }
            return
        }
        
        // Get current transform
        const myTransform = this.getSceneObject().getTransform()
        let touchPoint = myTransform.getWorldPosition()
        let touchRotation = myTransform.getWorldRotation()
        const touchScale = myTransform.getWorldScale()
        
        // Check if this is a straight hit (good angle)
        if (this.isStraightHit(touchRotation)) {
            print(`DartStick: Straight hit detected! Sticking to board.`)
            
            // Stop physics
            this.bodyComponent.dynamic = false
            this.bodyComponent.velocity = vec3.zero()
            
            // Adjust position to account for dart tip
            const childLocalPosition = new vec3(0, 0, this.tipOffset)
            const parentWorldPosition = touchPoint.sub(
                touchRotation.multiplyVec3(childLocalPosition.mult(touchScale))
            )
            
            // Parent to the score board
            this.getSceneObject().setParent(hitObject)
            
            // Set final transform
            myTransform.setWorldPosition(parentWorldPosition)
            myTransform.setWorldRotation(touchRotation)
            myTransform.setWorldScale(touchScale)
            
            this.hasStuck = true
            
            // Play hit sound
            if (this.hitSound) {
                this.hitSound.play(1)
            }
            
            print(`DartStick: Dart stuck to board at ${parentWorldPosition}`)
        } else {
            // Not a straight hit, bounce off
            print(`DartStick: Bounce - hit angle too steep`)
            
            if (this.bounceSound) {
                this.bounceSound.play(1)
            }
        }
    }
    
    /**
     * Check if the dart hit at a good angle (straight enough to stick)
     */
    private isStraightHit(dartRotation: quat): boolean {
        if (!this.scoreBoardTransform) return false
        
        // Get the board's forward direction
        const boardForward = this.scoreBoardTransform.forward
        
        // Get the dart's UP direction (because we rotate 90° on X, up becomes the pointing direction)
        // The dart model's forward becomes up after the 90° X rotation
        const dartPointingDirection = dartRotation.multiplyVec3(vec3.up())
        
        // Calculate angle between board forward and where dart is pointing
        const angle = boardForward.angleTo(dartPointingDirection) * MathUtils.RadToDeg
        
        // Check if angle is within acceptable range
        const isGoodAngle = angle < this.maxStickAngle && angle > 0
        
        print(`DartStick: Hit angle: ${angle.toFixed(1)}° (max: ${this.maxStickAngle}°) - ${isGoodAngle ? 'STICK!' : 'BOUNCE'}`)
        
        return isGoodAngle
    }
}

