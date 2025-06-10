/**
 * Tethers content to a target, repositioning when it moves too far away
 * or when the angle between target's forward and direction to object exceeds threshold.
 */
@component
export class SmartTether extends BaseScriptComponent {
    @input
    @hint("Override default target mainCamera")
    target!: SceneObject;
    
    @input
    @hint("Minimum vertical movement to recalculate position")
    verticalDistanceFromTarget: number = 0.1;
    
    @input
    @hint("Minimum horizontal movement to recalculate position")
    horizontalDistanceFromTarget: number = 0.1;

    
    @input
    @hint("Should the content rotate and reposition with the target")
    reorientDuringTargetRotation: boolean = true;
    
    @input
    @hint("Flatten Y-axis rotation during target rotation")
    flattenDuringTargetRotation: boolean = true;
    
    @input
    @hint("Offset for tethering the content in relation to the target")
    offset: vec3 = new vec3(0, 0, 0);


    @input
    @hint("Offset for tethering the content in relation to the target when detected object is not present")
    offsetWithoutDetectedObject: vec3 = new vec3(0, 0, 0);

    @input
    @hint("Offset for tethering the content in relation to the target when detected object is present")
    offsetWithDetectedObject: vec3 = new vec3(0, 0, 0);
    
    @input
    @hint("Lerp speed for smooth movement")
    lerpSpeed: number = 5.0;
    
    private _targetPosition: vec3 = new vec3(0, 0, 0);
    private _currentAngle: number = 0;
    private _flatAngle: number = 0;
    private _targetDir: vec3 = new vec3(0, 0, 0);
    private _flatForward: vec3 = new vec3(0, 0, 0);
    
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
            print("No target set for Tether - please set a target object");
            return;
        }
        
        // Initialize target position
        this._targetPosition = this.calculateNewTargetPosition();
    }
    
    onUpdate(): void {
        if (!this.target) return;
        
        // Calculate the angles
        this._currentAngle = this.calculateAngle();
        this._flatAngle = this.calculateFlatAngle();
        
        // Check if we need to reposition
        if (this.shouldReposition()) {
            this._targetPosition = this.calculateNewTargetPosition();
        }
        
        // Update position with lerping
        this.updateContentPosition();
        
    }
    
    /**
     * Calculate the new target position based on offset and rotation settings.
     */
    private calculateNewTargetPosition(): vec3 {
        const targetTransform = this.target.getTransform();
        const targetPos = targetTransform.getWorldPosition();
        
        if (this.reorientDuringTargetRotation) {
            if (this.flattenDuringTargetRotation) {
                // Get target's forward and right, but flatten them
                const targetRotation = targetTransform.getWorldRotation();
                
                // Get the forward direction
                const forward = this.getForwardVector(targetRotation);
                const flattenedForward = this.normalizeVector(new vec3(forward.x, 0, forward.z));
                
                // Get the right direction
                const right = this.getRightVector(targetRotation);
                const flattenedRight = this.normalizeVector(new vec3(right.x, 0, right.z));
                
                // Calculate new position using the flattened directions
                return new vec3(
                    targetPos.x + flattenedRight.x * this.offset.x + this.offset.y * 0 + flattenedForward.x * this.offset.z,
                    targetPos.y + flattenedRight.y * this.offset.x + this.offset.y * 1 + flattenedForward.y * this.offset.z,
                    targetPos.z + flattenedRight.z * this.offset.x + this.offset.y * 0 + flattenedForward.z * this.offset.z
                );
            } else {
                // Apply offset in target's local space
                const targetRot = targetTransform.getWorldRotation();
                
                // Transform offset by target's rotation
                const rotatedOffset = this.rotateVectorByQuaternion(this.offset, targetRot);
                
                // Add to target position
                return new vec3(
                    targetPos.x + rotatedOffset.x,
                    targetPos.y + rotatedOffset.y,
                    targetPos.z + rotatedOffset.z
                );
            }
        }
        
        // Simple offset in world space
        return new vec3(
            targetPos.x + this.offset.x,
            targetPos.y + this.offset.y,
            targetPos.z + this.offset.z
        );
    }
    
    /**
     * Check if the content should be repositioned.
     */
    private shouldReposition(): boolean {
        const myPos = this.sceneObject.getTransform().getWorldPosition();
        const targetPos = this.target.getTransform().getWorldPosition();
        
        // Calculate displacement vector to target
        const toTarget = new vec3(
            myPos.x - targetPos.x,
            myPos.y - targetPos.y,
            myPos.z - targetPos.z
        );
        
        // Calculate vertical and horizontal distances
        const verticalDistance = Math.abs(toTarget.y);
        const horizontalDistance = Math.sqrt(toTarget.x * toTarget.x + toTarget.z * toTarget.z);
        

        // Check if any threshold is exceeded
        return verticalDistance > this.verticalDistanceFromTarget || 
               horizontalDistance > this.horizontalDistanceFromTarget 
    }
    
    /**
     * Update the content's position with lerping.
     */
    private updateContentPosition(): void {
        const myTransform = this.sceneObject.getTransform();
        const currentPos = myTransform.getWorldPosition();
        
        // Lerp to the target position
        const newPos = this.lerpVector(
            currentPos,
            this._targetPosition,
            this.lerpSpeed * getDeltaTime()
        );
        
        // Apply the new position
        myTransform.setWorldPosition(newPos);
    }

    public updateOffsetWithDetectedObject(): void {
         print("updateOffsetWithDetectedObject");
         this.offset = this.offsetWithDetectedObject;
    }

    public updateOffsetWithoutDetectedObject(): void {
        print("updateOffsetWithoutDetectedObject");
        this.offset = this.offsetWithoutDetectedObject;
    }
    
    /**
     * Calculate the angle between target's forward and direction to the object on XZ plane.
     */
    private calculateFlatAngle(): number {
        // Calculate direction from target to object
        const myPos = this.sceneObject.getTransform().getWorldPosition();
        const targetPos = this.target.getTransform().getWorldPosition();
        
        this._targetDir = new vec3(
            myPos.x - targetPos.x,
            0, // Ignore Y component for flat angle calculation
            myPos.z - targetPos.z
        );
        
        // Get target's forward vector and flatten it
        const targetRotation = this.target.getTransform().getWorldRotation();
        const forward = this.getForwardVector(targetRotation);
        this._flatForward = this.normalizeVector(new vec3(forward.x, 0, forward.z));
        
        // Calculate the signed angle
        return this.signedAngle(this._targetDir, this._flatForward);
    }
    
    /**
     * Calculate the signed angle between two vectors on the XZ plane.
     */
    private signedAngle(from: vec3, to: vec3): number {
        // Ensure vectors are normalized
        const normalizedFrom = this.normalizeVector(from);
        const normalizedTo = this.normalizeVector(to);
        
        // Calculate the angle using dot product
        const dot = this.dotProduct(normalizedFrom, normalizedTo);
        let angle = Math.acos(Math.max(-1, Math.min(1, dot))) * (180 / Math.PI);
        
        // Determine the sign using cross product
        const cross = this.crossProduct(normalizedFrom, normalizedTo);
        if (cross.y < 0) angle = -angle;
        
        return angle;
    }
    
    /**
     * Calculate the cross product between two vectors.
     */
    private crossProduct(v1: vec3, v2: vec3): vec3 {
        return new vec3(
            v1.y * v2.z - v1.z * v2.y,
            v1.z * v2.x - v1.x * v2.z,
            v1.x * v2.y - v1.y * v2.x
        );
    }
    
    /**
     * Calculate the angle between target's forward and our forward.
     */
    private calculateAngle(): number {
        const myTransform = this.sceneObject.getTransform();
        const targetTransform = this.target.getTransform();
        
        // Get forward vectors
        const myForward = this.getForwardVector(myTransform.getWorldRotation());
        const targetForward = this.getForwardVector(targetTransform.getWorldRotation());
        
        // Calculate the angle between them
        const dot = this.dotProduct(myForward, targetForward);
        const angle = Math.acos(Math.max(-1, Math.min(1, dot))) * (180 / Math.PI);
        
        return angle;
    }
    
    /**
     * Get the forward vector from a rotation.
     */
    private getForwardVector(rotation: quat): vec3 {
        // Transform the local forward vector (0,0,1) by the rotation
        return this.rotateVectorByQuaternion(new vec3(0, 0, 1), rotation);
    }
    
    /**
     * Get the right vector from a rotation.
     */
    private getRightVector(rotation: quat): vec3 {
        // Transform the local right vector (1,0,0) by the rotation
        return this.rotateVectorByQuaternion(new vec3(1, 0, 0), rotation);
    }
    
    /**
     * Calculate the dot product between two vectors.
     */
    private dotProduct(v1: vec3, v2: vec3): number {
        return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
    }
    
    /**
     * Rotate a vector by a quaternion.
     */
    private rotateVectorByQuaternion(vector: vec3, rotation: quat): vec3 {
        const x = rotation.x;
        const y = rotation.y;
        const z = rotation.z;
        const w = rotation.w;
        
        // Apply the quaternion rotation to the vector
        // Formula: q * v * q^-1 simplified
        const ix = w * vector.x + y * vector.z - z * vector.y;
        const iy = w * vector.y + z * vector.x - x * vector.z;
        const iz = w * vector.z + x * vector.y - y * vector.x;
        const iw = -x * vector.x - y * vector.y - z * vector.z;
        
        const result = new vec3(
            ix * w + iw * -x + iy * -z - iz * -y,
            iy * w + iw * -y + iz * -x - ix * -z,
            iz * w + iw * -z + ix * -y - iy * -x
        );
        
        return result;
    }
    
    /**
     * Linear interpolation between two vectors.
     */
    private lerpVector(a: vec3, b: vec3, t: number): vec3 {
        const clampedT = Math.max(0, Math.min(1, t));
        return new vec3(
            a.x + (b.x - a.x) * clampedT,
            a.y + (b.y - a.y) * clampedT,
            a.z + (b.z - a.z) * clampedT
        );
    }
    
    /**
     * Normalize a vector to unit length.
     */
    private normalizeVector(v: vec3): vec3 {
        const length = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
        
        if (length < 0.0001) {
            return new vec3(0, 0, 0);
        }
        
        return new vec3(
            v.x / length,
            v.y / length,
            v.z / length
        );
    }
    
    /**
     * Convert quaternion to Euler angles (degrees).
     */
    private quaternionToEulerAngles(q: quat): vec3 {
        // Implement quaternion to Euler angles conversion
        // This is a simplified conversion that may have gimbal lock issues
        
        const x = q.x, y = q.y, z = q.z, w = q.w;
        
        // Roll (x-axis rotation)
        const sinr_cosp = 2 * (w * x + y * z);
        const cosr_cosp = 1 - 2 * (x * x + y * y);
        const roll = Math.atan2(sinr_cosp, cosr_cosp) * (180 / Math.PI);
        
        // Pitch (y-axis rotation)
        let pitch;
        const sinp = 2 * (w * y - z * x);
        if (Math.abs(sinp) >= 1) {
            // Use 90 degrees if out of range
            pitch = Math.sign(sinp) * 90;
        } else {
            pitch = Math.asin(sinp) * (180 / Math.PI);
        }
        
        // Yaw (z-axis rotation)
        const siny_cosp = 2 * (w * z + x * y);
        const cosy_cosp = 1 - 2 * (y * y + z * z);
        const yaw = Math.atan2(siny_cosp, cosy_cosp) * (180 / Math.PI);
        
        return new vec3(roll, pitch, yaw);
    }
    
    /**
     * Convert Euler angles (degrees) to quaternion.
     */
    private eulerAnglesToQuaternion(pitch: number, yaw: number, roll: number): quat {
        // Convert Euler angles to quaternion
        // Convert degrees to radians
        const pitchRad = pitch * (Math.PI / 180);
        const yawRad = yaw * (Math.PI / 180);
        const rollRad = roll * (Math.PI / 180);
        
        // Calculate quaternion components using Euler angles
        const cy = Math.cos(yawRad * 0.5);
        const sy = Math.sin(yawRad * 0.5);
        const cp = Math.cos(pitchRad * 0.5);
        const sp = Math.sin(pitchRad * 0.5);
        const cr = Math.cos(rollRad * 0.5);
        const sr = Math.sin(rollRad * 0.5);
        
        const w = cr * cp * cy + sr * sp * sy;
        const x = sr * cp * cy - cr * sp * sy;
        const y = cr * sp * cy + sr * cp * sy;
        const z = cr * cp * sy - sr * sp * cy;
        
        return new quat(x, y, z, w);
    }
}