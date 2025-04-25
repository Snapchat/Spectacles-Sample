import { CoordinationClient, FORWARD_SPEED_MAX, LATERAL_SPEED_MAX, ROTATION_SPEED_MAX } from "../Unitree2Spectacles/Scripts/TS/CoordinationClient";

@component
export class Joystick extends BaseScriptComponent
{
    @input
    joystickObject: SceneObject;
    @input
    robotObject: SceneObject;

    @input
    rightIndexFinger: SceneObject;
    @input
    leftIndexFinger: SceneObject;

    @input
    rightThumb: SceneObject;
    @input
    leftThumb: SceneObject;

    @input
    moveSpeed: number;

    @input
    deadzone: number = 0.1; // Small deadzone.

    @input
    cardinalWindowDegrees: number = 15; // 15° window for cardinal directions where movement is locked to one axis.

    @input('Component.ScriptComponent')
    client: CoordinationClient;
    
    joystickTransform: Transform;
    robotTransform: Transform;

    rightIndexFingerTransform: Transform; //called "index-3"
    leftIndexFingerTransform: Transform; //called "index-3"
    rightThumbTransform: Transform; //called "thumb-3"
    leftThumbTransform: Transform; //called "thumb-3"

    rightHandPinching: Boolean;
    leftHandPinching: Boolean;
    rightHandPinchingPrev: Boolean;
    leftHandPinchingPrev: Boolean;

    startPosition: vec3;
    rightPinchStartPosition: vec3;
    leftPinchStartPosition: vec3;
    rightPinchPosition: vec3;
    leftPinchPosition: vec3;
    
    pinchStartedOnJoystick: Boolean;

    readonly maxSpeed: number = 5.0; // Maximum speed units per second

    kicking: Boolean = false;

    isEditor: Boolean;

    jxSmoothed: number = 0;
    jySmoothed: number = 0;

    scale: number = 4; // Scale factor for clamping

    //JOYSTICK POSITION VARIABLES
    jx: number = 0;
    jy: number = 0;

    onAwake() 
    {
        this.isEditor = typeof require === 'function';

        print("is editor: " + this.isEditor);

        this.joystickTransform = this.joystickObject.getTransform();
        this.robotTransform = this.robotObject.getTransform();
        this.rightIndexFingerTransform = this.rightIndexFinger.getTransform();
        this.leftIndexFingerTransform = this.leftIndexFinger.getTransform();
        this.rightThumbTransform = this.rightThumb.getTransform();
        this.leftThumbTransform = this.leftThumb.getTransform();
        this.startPosition = this.joystickTransform.getLocalPosition();
        this.createEvent("UpdateEvent").bind(this.onUpdate.bind(this));
        this.createEvent("LateUpdateEvent").bind(this.onLateUpdate.bind(this));
    }

    onUpdate()
    {
        // Check distance between right index finger and thumb
        const rightFingerPos = this.rightIndexFingerTransform.getWorldPosition();
        const rightThumbPos = this.rightThumbTransform.getWorldPosition();
        const rightHandDistance = rightFingerPos.distance(rightThumbPos);

        const leftFingerPos = this.leftIndexFingerTransform.getWorldPosition();
        const leftThumbPos = this.leftThumbTransform.getWorldPosition();
        const leftHandDistance = leftFingerPos.distance(leftThumbPos);

        this.rightHandPinchingPrev = this.rightHandPinching;
        this.leftHandPinchingPrev = this.leftHandPinching;
        this.rightHandPinching = (rightHandDistance < 2);
        this.leftHandPinching = (leftHandDistance < 2);

        var justPinchedRightHand = false;
        var justPinchedLeftHand = false;

        if (this.rightHandPinching) 
        {
            if (!this.rightHandPinchingPrev)
            {
                justPinchedRightHand = true;
                // Calculate average point between right thumb and index finger
                this.rightPinchStartPosition = new vec3(
                    (rightFingerPos.x + rightThumbPos.x) / 2,
                    (rightFingerPos.y + rightThumbPos.y) / 2,
                    (rightFingerPos.z + rightThumbPos.z) / 2
                );
                // Only set pinchStartedOnJoystick if pinch occurred near joystick
                const joystickPos = this.joystickTransform.getWorldPosition();
                const distanceToJoystick = this.rightPinchStartPosition.distance(joystickPos);
                const grabRadius = 0.1; // Adjust this value as needed
                this.pinchStartedOnJoystick = distanceToJoystick < grabRadius;
            }

            this.rightPinchPosition = new vec3(
                (rightFingerPos.x + rightThumbPos.x) / 2,
                (rightFingerPos.y + rightThumbPos.y) / 2,
                (rightFingerPos.z + rightThumbPos.z) / 2
            );
        }

        if (this.leftHandPinching) 
        {
            if (!this.leftHandPinchingPrev)
            {
                justPinchedLeftHand = true;
                // Calculate average point between left thumb and index finger
                this.leftPinchStartPosition = new vec3(
                    (leftFingerPos.x + leftThumbPos.x) / 2,
                    (leftFingerPos.y + leftThumbPos.y) / 2,
                    (leftFingerPos.z + leftThumbPos.z) / 2
                );
            }

            this.leftPinchPosition = new vec3(
                (leftFingerPos.x + leftThumbPos.x) / 2,
                (leftFingerPos.y + leftThumbPos.y) / 2,
                (leftFingerPos.z + leftThumbPos.z) / 2
            );
        }

        if (this.isEditor)
        {
            //editor joystick controls
            this.jx = this.joystickTransform.getLocalPosition().x - this.startPosition.x;
            this.jy = this.joystickTransform.getLocalPosition().z - this.startPosition.z;
            this.jy -= this.joystickTransform.getLocalPosition().y - this.startPosition.y;
            this.joystickTransform.setLocalPosition(this.startPosition);
        }

        if (this.rightHandPinching && this.pinchStartedOnJoystick)
        {
            this.jx = this.rightPinchPosition.x - this.rightPinchStartPosition.x;
            this.jy = this.rightPinchPosition.z - this.rightPinchStartPosition.z;
            this.jy -= this.rightPinchPosition.y - this.rightPinchStartPosition.y;

            //this.joystickTransform.setWorldPosition(this.rightPinchStartPosition);

            this.joystickTransform.setWorldPosition(this.rightPinchPosition);
        }
        else
        {
            //this.joystickTransform.setWorldScale(new vec3(3.6, 3.6, 3.6));
        }

        this.jx /= this.scale;
        this.jy /= this.scale;
        
        this.jx = Math.max(-1, Math.min(1, this.jx));
        this.jy = Math.max(-1, Math.min(1, this.jy));

        print("joystick position = [" + this.jx.toFixed(2) + ", " + this.jy.toFixed(2) + "]");

        this.calculateAndSendMovement();
    }

    onLateUpdate()
    {
        const currentPosition = this.joystickTransform.getLocalPosition();

        // Calculate offset from start position
        const offsetX = currentPosition.x - this.startPosition.x;
        const offsetY = currentPosition.y - this.startPosition.y;
        const offsetZ = currentPosition.z - this.startPosition.z;

        // Clamp the offsets
        const clampedPosition = new vec3(
            this.startPosition.x + Math.max(-this.scale, Math.min(this.scale, offsetX)),
            this.startPosition.y,
            this.startPosition.z + Math.max(-this.scale, Math.min(this.scale, offsetZ))
        );

        this.joystickTransform.setLocalPosition(clampedPosition);

        // Zero out the rotation of the joystick
        this.joystickTransform.setLocalRotation(quat.fromEulerAngles(0, 0, 0));
    }


    private calculateAndSendMovement() {
        // Deadzone
        let jxNorm = Math.abs(this.jx) < this.deadzone ? 0 : this.jx;
        let jyNorm = Math.abs(this.jy) < this.deadzone ? 0 : this.jy;

        const magnitude = Math.sqrt(jxNorm * jxNorm + jyNorm * jyNorm);

        if (magnitude < this.deadzone) {
            // If within deadzone, don't move
            this.client.sendMovement(0, 0, 0);
            return;
        }
        
        // Normalize to ensure max magnitude is 1.0
        if (magnitude > 1.0) {
            jxNorm /= magnitude;
            jyNorm /= magnitude;
        }
        
        // Calculate angle in degrees (0° is up/forward, 90° is right)
        let angleDegrees = Math.atan2(jxNorm, jyNorm) * (180 / Math.PI);
        if (angleDegrees < 0) angleDegrees += 360;
        
        // Initialize movement variables
        let forward = 0;
        let lateral = 0;
        let yaw = 0;
        
        // Check for cardinal directions (using 15° windows)
        const isForward = this.isInCardinalWindow(angleDegrees, 0);
        const isRight = this.isInCardinalWindow(angleDegrees, 90);
        const isBackward = this.isInCardinalWindow(angleDegrees, 180);
        const isLeft = this.isInCardinalWindow(angleDegrees, 270);
        
        // Apply movement based on cardinal direction
        if (isForward) {
            forward = magnitude * FORWARD_SPEED_MAX;
        } else if (isBackward) {
            forward = -magnitude * FORWARD_SPEED_MAX;
        } else if (isRight) {
            lateral = magnitude * LATERAL_SPEED_MAX;
        } else if (isLeft) {
            lateral = -magnitude * LATERAL_SPEED_MAX;
        } else {
            // For diagonal movements, calculate components and yaw
            forward = jyNorm * FORWARD_SPEED_MAX;
            lateral = jxNorm * LATERAL_SPEED_MAX;
            
            // Calculate yaw based on how far from forward/backward axis
            // More yaw when moving sideways, less when moving forward/backward
            const yawFactor = Math.abs(jxNorm) / (Math.abs(jxNorm) + Math.abs(jyNorm));
            yaw = jxNorm * ROTATION_SPEED_MAX * yawFactor;
        }
        
        // Send movement command to the robot
        this.client.sendMovement(forward, lateral, yaw);
    }

    private isInCardinalWindow(angle: number, direction: number): boolean {
        const diff = Math.abs((angle - direction + 360) % 360);
        return diff < this.cardinalWindowDegrees || diff >= (360 - this.cardinalWindowDegrees);
    }
}
