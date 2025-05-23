import { Interactable } from "SpectaclesInteractionKit/Components/Interaction/Interactable/Interactable";
import { CoordinationClient } from "./CoordinationClient";

@component
export class RobotDecoyController extends BaseScriptComponent {
    @input robotDecoy: SceneObject;
    @input mainCamera: Camera;
    @input toggleButton: SceneObject;
    @input connectToRobot: boolean = false;

    @input moveSpeedTitle: Text;
    @input rotationSpeedTitle: Text;

    @input('Component.ScriptComponent')
    private coordinationClient: CoordinationClient;

    private decoyMovementSpeed: number = 100.0;
    private decoyRotationSpeed: number = 1.0;

    private interactor: Interactable;
    private targetPosition: vec3 = null;
    private isMoving: boolean = false;
    private movementPhase: 'rotating' | 'moving' | 'idle' = 'idle';
    private updateEvent;
    private targetMovement: boolean = false;

    onAwake() {
        this.createEvent('OnStartEvent').bind(() => {
            this.onStart();
        });
    }

    onStart() {
        this.interactor = this.toggleButton.getComponent(Interactable.getTypeName());
        this.interactor.onTriggerEnd.add(this.toggleDecoy.bind(this));

        this.updateEvent = this.createEvent("UpdateEvent");
        this.updateEvent.bind(this.processMovement.bind(this));
    }

    public sendNewPositionToDecoy(targetPosition: vec3) {
        // prevent sending new position to robot if decoy not enabled
        if (!this.robotDecoy || !this.robotDecoy.enabled || this.targetMovement) {
            return;
        }
        this.targetPosition = targetPosition;
        this.movementPhase = 'rotating';
        this.isMoving = true;
    }

    sendMovement(decoyLong: number, decoyLat: number, decoyYaw: number,
        realLong: number, realLat: number, realYaw: number,
        deltaTime?: number) {

        if (!this.robotDecoy || !this.robotDecoy.enabled || this.targetMovement) {
            return;
        }

        // Compute final actual movement for decoy inside sendMovement
        const dt = deltaTime === undefined ? 1.0 : deltaTime;

        const finalDecoyLong = decoyLong * this.decoyMovementSpeed * dt;
        const finalDecoyLat = decoyLat * this.decoyMovementSpeed * dt;
        const finalDecoyYaw = decoyYaw * this.decoyRotationSpeed * dt;

        // If connected, call the real robot exactly once:
        if (this.connectToRobot) {
            const scaledLong = realLong;
            const scaledLat = realLat;
            const scaledYaw = realYaw;

            // print("[sendMovement] Real Robot -> long=" + scaledLong.toFixed(3)
            //     + ", lat=" + scaledLat.toFixed(3)
            //     + ", yaw=" + scaledYaw.toFixed(3));
            this.coordinationClient.sendMovement(scaledLong, scaledLat, scaledYaw);
        }

        // === Decoy movement ===
        // print("[sendMovement] Decoy -> long=" + decoyLong.toFixed(3)
        //     + ", lat=" + decoyLat.toFixed(3)
        //     + ", yaw=" + decoyYaw.toFixed(3));

        const robotTransform = this.robotDecoy.getTransform();
        const currentPosition = robotTransform.getWorldPosition();
        const currentRotation = robotTransform.getWorldRotation();

        // Yaw rotation
        if (finalDecoyYaw !== 0) {
            const yawRotation = quat.angleAxis(finalDecoyYaw, new vec3(0, 1, 0));
            const newRotation = currentRotation.multiply(yawRotation);
            robotTransform.setWorldRotation(newRotation);
        }

        // Forward/backward
        if (finalDecoyLong !== 0) {
            const forward = robotTransform.forward;
            const movement = new vec3(forward.x * finalDecoyLong, 0, forward.z * finalDecoyLong);
            const newPosition = currentPosition.add(movement);
            if (this.targetPosition) {
                newPosition.y = this.targetPosition.y;
            }
            robotTransform.setWorldPosition(newPosition);
        }

        // Lateral
        if (finalDecoyLat !== 0) {
            const right = robotTransform.right;
            const movement = new vec3(right.x * finalDecoyLat, 0, right.z * finalDecoyLat);
            const newPosition = currentPosition.add(movement);
            if (this.targetPosition) {
                newPosition.y = this.targetPosition.y;
            }
            robotTransform.setWorldPosition(newPosition);
        }
    }

    processMovement(eventData: UpdateEvent) {
        if (!this.isMoving || !this.targetPosition || !this.robotDecoy || !this.robotDecoy.enabled) return;
        const deltaTime = eventData.getDeltaTime();

        const robotTransform = this.robotDecoy.getTransform();
        const robotPosition = robotTransform.getWorldPosition();

        if (this.movementPhase === 'rotating') {
            const directionToTarget = new vec3(
                this.targetPosition.x - robotPosition.x,
                0,
                this.targetPosition.z - robotPosition.z
            ).normalize();

            const forward = robotTransform.forward;
            const currentForward = new vec3(
                forward.x,
                0,
                forward.z
            ).normalize();

            const dot = currentForward.dot(directionToTarget);
            const clampedDot = Math.max(Math.min(dot, 1.0), -1.0);
            const angle = Math.acos(clampedDot);

            const cross = currentForward.cross(directionToTarget);
            const rotationDirection = cross.y > 0 ? 1 : -1;

            const rotationThreshold = 0.05;

            if (angle < rotationThreshold) {
                this.movementPhase = 'moving';
                this.sendMovement(0, 0, 0, 0, 0, 0, 1.0);

                const lookDirection = new vec3(
                    this.targetPosition.x - robotPosition.x,
                    0,
                    this.targetPosition.z - robotPosition.z
                ).normalize();

                const worldForward = new vec3(0, 0, 1);
                const dotProduct = worldForward.dot(lookDirection);
                const exactAngle = Math.acos(Math.max(Math.min(dotProduct, 1), -1));

                const exactCross = worldForward.cross(lookDirection);
                const exactRotationDirection = exactCross.y >= 0 ? 1 : -1;

                const exactRotation = quat.angleAxis(exactAngle * exactRotationDirection, new vec3(0, 1, 0));

                robotTransform.setWorldRotation(exactRotation);
            } else {
                const baseRotationSpeed = this.decoyRotationSpeed;
                const angleRatio = Math.min(angle / (Math.PI / 4), 1.0);
                const adjustedRotationSpeed = baseRotationSpeed * angleRatio;

                // Single call for both decoy + real robot
                this.sendMovement(
                    0, 0, rotationDirection * 1.0,  // decoy
                    0, 0, rotationDirection * 1.0,  // real
                    deltaTime
                );
            }
        } else if (this.movementPhase === 'moving') {
            const xzDistance = Math.sqrt(
                Math.pow(this.targetPosition.x - robotPosition.x, 2) +
                Math.pow(this.targetPosition.z - robotPosition.z, 2)
            );

            // print("Current position (x,z): " + robotPosition.x + ", " + robotPosition.z);
            // print("Distance to target XZ = " + xzDistance);

            const arrivalThreshold = 2.0;

            if (xzDistance < arrivalThreshold) {
                this.sendMovement(
                    0, 0, 0,  // decoy
                    0, 0, 0,  // real
                    1.0
                );
                this.movementPhase = 'idle';
                this.isMoving = false;
            } else {
                this.sendMovement(
                    1.0, 0, 0,   // decoy logs as "1.000"
                    1.0, 0, 0,   // real
                    deltaTime
                );
            }
        }
    }

    instanciateRobot() {
        var cameraTransform = this.mainCamera.getTransform();
        this.robotDecoy.getTransform().setWorldPosition(cameraTransform.getWorldPosition());

        const cameraForward = cameraTransform.forward;
        const horizontalForward = new vec3(cameraForward.x, 0, cameraForward.z).normalize();
        const worldUp = new vec3(0, 1, 0);
        const rotation = quat.lookAt(horizontalForward, worldUp);

        this.robotDecoy.getTransform().setWorldRotation(rotation);
    }

    toggleDecoy() {
        this.instanciateRobot();
        this.robotDecoy.enabled = !this.robotDecoy.enabled;
    }

    public updateMoveSpeed(value: number) {
        this.moveSpeedTitle.text = "Movement Speed: " + value.toString();
        this.decoyMovementSpeed = value * 100.0;
    }

    public updateRotationSpeed(value: number) {
        this.rotationSpeedTitle.text = "Rotation speed: " + value.toString();
        this.decoyRotationSpeed = value;
    }

    public toggleTargetMovement() {
        this.targetMovement = !this.targetMovement;
    }
}
