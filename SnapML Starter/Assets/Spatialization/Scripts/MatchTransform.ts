/**
 * Optionally matches the position, rotation, or scale of another object.
 * Works in-editor.
 */
@component
export class MatchTransformTS extends BaseScriptComponent {
    @input
    @hint("Override default target mainCamera")
    target!: SceneObject;
    
    @input
    @hint("Position offset for matching the target's position")
    positionOffset: vec3 = new vec3(0, 0, 0);
    
    @input
    @hint("Use lerping for smooth position transitions")
    usePositionLerp: boolean = true;
    
    @input
    @hint("Speed for moving towards the target's position (when lerping is enabled)")
    positionLerpSpeed: number = 1.0;
    
    @input
    @hint("Speed for rotating towards the target's rotation")
    rotationLerpSpeed: number = 1.0;
    
    @input
    @hint("Speed for scaling towards the target's scale")
    scaleLerpSpeed: number = 1.0;
    
    @input
    @hint("Toggle to constrain movement on specific axes")
    constrainPositionX: boolean = false;
    
    @input
    constrainPositionY: boolean = false;
    
    @input
    constrainPositionZ: boolean = false;
    
    @input
    @hint("Toggle to constrain rotation on specific axes")
    constrainRotationX: boolean = false;
    
    @input
    constrainRotationY: boolean = false;
    
    @input
    constrainRotationZ: boolean = false;
    
    @input
    @hint("Toggle to constrain scaling on specific axes")
    constrainScaleX: boolean = false;
    
    @input
    constrainScaleY: boolean = false;
    
    @input
    constrainScaleZ: boolean = false;
    
    // Initialize with the proper pattern
    onAwake(): void {
        this.createEvent("OnStartEvent").bind(() => {
            this.onStart();
        });
        
        this.createEvent("UpdateEvent").bind(() => {
            this.onUpdate();
        });
    }
    
    onStart(): void {
        if (!this.target) {
            print("No target set for MatchTransform - please set a target object");
        }
    }
    
    onUpdate(): void {
        if (!this.target) return;
        
        this.updateTransform();
    }
    
    /**
     * Update this object's transform to match the target's transform with constraints.
     */
    private updateTransform(): void {
        // Get current transform details
        const myTransform = this.sceneObject.getTransform();
        const targetTransform = this.target.getTransform();
        
        // Handle position matching with optional constraints
        this.updatePosition(myTransform, targetTransform);
        
        // Handle rotation matching with optional constraints
        this.updateRotation(myTransform, targetTransform);
        
        // Handle scale matching with optional constraints
        this.updateScale(myTransform, targetTransform);
    }
    
    /**
     * Update the position based on target and constraints.
     */
    private updatePosition(myTransform: Transform, targetTransform: Transform): void {
        // Get target position
        const targetPos = targetTransform.getWorldPosition();
        
        // Apply offset in world space
        // Note: In a real implementation with proper transform hierarchy,
        // we would need to transform the offset from local to world space
        const targetPosition = new vec3(
            targetPos.x + this.positionOffset.x,
            targetPos.y + this.positionOffset.y,
            targetPos.z + this.positionOffset.z
        );
        
        const currentPosition = myTransform.getWorldPosition();
        
        // Apply constraints
        let newPosition = new vec3(
            this.constrainPositionX ? currentPosition.x : targetPosition.x,
            this.constrainPositionY ? currentPosition.y : targetPosition.y,
            this.constrainPositionZ ? currentPosition.z : targetPosition.z
        );
        
        // Apply lerp if enabled, otherwise use direct position matching
        if (this.usePositionLerp) {
            // Smooth transition with lerp
            newPosition = this.lerpVector(
                currentPosition, 
                newPosition, 
                this.positionLerpSpeed * getDeltaTime()
            );
        } else {
            // Direct 1:1 position matching (no lerp)
            // newPosition is already set correctly from constraints
        }
        
        // Set the new position
        myTransform.setWorldPosition(newPosition);
    }
    
    /**
     * Update the rotation based on target and constraints.
     */
    private updateRotation(myTransform: Transform, targetTransform: Transform): void {
        const targetRotation = targetTransform.getWorldRotation();
        const currentRotation = myTransform.getWorldRotation();
        
        // Convert to Euler angles for constraints
        const targetEuler = this.quaternionToEuler(targetRotation);
        const currentEuler = this.quaternionToEuler(currentRotation);
        
        // Apply constraints
        const newEuler = new vec3(
            this.constrainRotationX ? currentEuler.x : targetEuler.x,
            this.constrainRotationY ? currentEuler.y : targetEuler.y,
            this.constrainRotationZ ? currentEuler.z : targetEuler.z
        );
        
        // Convert back to quaternion
        const newRotation = quat.fromEulerAngles(newEuler.x, newEuler.y, newEuler.z);
        
        // Apply lerp
        const lerpedRotation = quat.slerp(
            currentRotation,
            newRotation,
            this.rotationLerpSpeed * getDeltaTime()
        );
        
        // Set the new rotation
        myTransform.setWorldRotation(lerpedRotation);
    }
    
    /**
     * Update the scale based on target and constraints.
     */
    private updateScale(myTransform: Transform, targetTransform: Transform): void {
        const targetScale = targetTransform.getWorldScale();
        const currentScale = myTransform.getLocalScale();
        
        // Apply constraints
        const newScale = new vec3(
            this.constrainScaleX ? currentScale.x : targetScale.x,
            this.constrainScaleY ? currentScale.y : targetScale.y,
            this.constrainScaleZ ? currentScale.z : targetScale.z
        );
        
        // Apply lerp
        const lerpedScale = this.lerpVector(
            currentScale,
            newScale,
            this.scaleLerpSpeed * getDeltaTime()
        );
        
        // Set the new scale
        myTransform.setLocalScale(lerpedScale);
    }
    
    /**
     * Convert quaternion to Euler angles (in radians).
     * @param q The quaternion to convert
     * @returns Euler angles in radians (x, y, z order)
     */
    private quaternionToEuler(q: quat): vec3 {
        // This is an approximation that works for most cases
        // In a real implementation, we would handle gimbal lock cases
        
        // Extract the Euler angles from the quaternion
        const x = q.x;
        const y = q.y;
        const z = q.z;
        const w = q.w;
        
        // Roll (x-axis rotation)
        const sinr_cosp = 2 * (w * x + y * z);
        const cosr_cosp = 1 - 2 * (x * x + y * y);
        const roll = Math.atan2(sinr_cosp, cosr_cosp);
        
        // Pitch (y-axis rotation)
        const sinp = 2 * (w * y - z * x);
        let pitch;
        if (Math.abs(sinp) >= 1) {
            // Use 90 degrees if out of range
            pitch = Math.sign(sinp) * Math.PI / 2;
        } else {
            pitch = Math.asin(sinp);
        }
        
        // Yaw (z-axis rotation)
        const siny_cosp = 2 * (w * z + x * y);
        const cosy_cosp = 1 - 2 * (y * y + z * z);
        const yaw = Math.atan2(siny_cosp, cosy_cosp);
        
        return new vec3(roll, pitch, yaw);
    }
    
    /**
     * Linear interpolation between two vectors.
     * @param a Start vector
     * @param b End vector
     * @param t Interpolation parameter (0-1)
     * @returns Interpolated vector
     */
    private lerpVector(a: vec3, b: vec3, t: number): vec3 {
        // Clamp t to [0, 1]
        const clampedT = Math.max(0, Math.min(1, t));
        
        // Interpolate each component
        return new vec3(
            a.x + (b.x - a.x) * clampedT,
            a.y + (b.y - a.y) * clampedT,
            a.z + (b.z - a.z) * clampedT
        );
    }
}