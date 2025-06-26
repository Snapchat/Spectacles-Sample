import { Interactable } from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable";
import {
  InteractableManipulation,
  TransformEventArg,
} from "SpectaclesInteractionKit.lspkg/Components/Interaction/InteractableManipulation/InteractableManipulation";
import { InteractorEvent } from "SpectaclesInteractionKit.lspkg/Core/Interactor/InteractorEvent";
import NativeLogger from "SpectaclesInteractionKit.lspkg/Utils/NativeLogger";

const TAG = "InteractableClampController";

/**
 * Projects an interactable object's position onto a line and moves a visual reference
 * to show the clamped/projected position. Calculates normalized values for callbacks.
 */
@component
export class InteractableLineProjection extends BaseScriptComponent {
    
    @input
    @hint("The Interactable component to monitor")
    interactable: Interactable;

    @input
    @hint("The InteractableManipulation component for manipulation events")
    manipulationComponent: InteractableManipulation;

    @input
    @hint("The start point of the line (represents minimum value)")
    lineStart: SceneObject;

    @input
    @hint("The end point of the line (represents maximum value)")
    lineEnd: SceneObject;
    
    @input
    @hint("The visual object that will move along the line to show projected position")
    visualReference: SceneObject;

    @input
    @allowUndefined
    @hint("Script component to call when projection value changes")
    callback: ScriptComponent | null = null;

    @input
    @hint("Method name to call on the callback script")
    methodName: string = "";



    @input
    @hint("Enable projection and visual reference updates")
    enableProjection: boolean = true;

    @input
    @hint("Only update during manipulation (if false, updates every frame)")
    onlyDuringManipulation: boolean = true;

    @input
    @hint("Double the mapping means that the value will be from 0 to 2 instead of 0 to 1")
    doubleMapping: boolean = true;

    private log = new NativeLogger(TAG);
    private isManipulating: boolean = false;
    private lastNormalizedValue: number = -1; // Track to avoid redundant callbacks

    onAwake() {
        this.createEvent("OnStartEvent").bind(() => {
            this.onStart();
        });

        // Update every frame if not limited to manipulation only
        if (!this.onlyDuringManipulation) {
            this.createEvent("UpdateEvent").bind(() => {
                this.update();
            });
        }
    }

    onStart() {
        if (!this.interactable) {
            this.log.e("Interactable component is required");
            return;
        }

        if (!this.manipulationComponent) {
            this.log.e("InteractableManipulation component is required");
            return;
        }

        if (!this.lineStart || !this.lineEnd) {
            this.log.e("Line Start and Line End are required");
            return;
        }

        if (!this.visualReference) {
            this.log.e("Visual Reference object is required");
            return;
        }

        this.setupManipulationCallbacks();
        this.log.d("InteractableLineProjection initialized");
        
        // Do initial projection
        this.updateProjection();
    }

    private setupManipulationCallbacks(): void {
        if (this.manipulationComponent) {
            // Manipulation start event
            this.manipulationComponent.onManipulationStart.add((event: TransformEventArg) => {
                this.onManipulationStarted(event);
            });

            // Manipulation update event
            this.manipulationComponent.onManipulationUpdate.add((event: TransformEventArg) => {
                this.onManipulationUpdate(event);
            });

            // Manipulation end event
            this.manipulationComponent.onManipulationEnd.add((event: TransformEventArg) => {
                this.onManipulationEnded(event);
            });
        }
    }

    private onManipulationStarted(event: TransformEventArg): void {
        this.isManipulating = true;
        this.log.d("Manipulation started - projection active");
    }

    private onManipulationUpdate(event: TransformEventArg): void {
        if (this.enableProjection) {
            this.updateProjection();
        }
    }

    private onManipulationEnded(event: TransformEventArg): void {
        this.isManipulating = false;
        this.log.d("Manipulation ended - snapping to projected position");
        
        // Move the manipulator object to match the visual reference position
        if (this.visualReference) {
            const visualPosition = this.visualReference.getTransform().getWorldPosition();
            this.manipulationComponent.getManipulateRoot().setWorldPosition(visualPosition);
        }
    }

    private update(): void {
        if (this.enableProjection && (!this.onlyDuringManipulation || this.isManipulating)) {
            this.updateProjection();
        }
    }

    /**
     * Projects the interactable object's position onto the line and updates visual reference
     */
    private updateProjection(): void {
        if (!this.lineStart || !this.lineEnd || !this.visualReference) {
            return;
        }

        // Get positions
        const objectPosition = this.manipulationComponent.getManipulateRoot().getWorldPosition();
        const lineStartPosition = this.lineStart.getTransform().getWorldPosition();
        const lineEndPosition = this.lineEnd.getTransform().getWorldPosition();
        
        // Project the object position onto the line
        const projectedPosition = this.getProjectionOnLine(
            objectPosition,
            lineStartPosition,
            lineEndPosition
        );

        // Move visual reference to projected position
        this.visualReference.getTransform().setWorldPosition(projectedPosition);

        // Calculate normalized value (0 to 1) based on position along the line
        const normalizedValue = this.calculateNormalizedValue(
            projectedPosition,
            lineStartPosition,
            lineEndPosition
        );

        // Call callback if value changed
        if (Math.abs(normalizedValue - this.lastNormalizedValue) > 0.001) {
            this.invokeCallback(normalizedValue);
            this.lastNormalizedValue = normalizedValue;
        }
    }

    /**
     * Calculate the closest point on a line to a given point
     * Based on the SnapToLine algorithm
     */
    private getProjectionOnLine(point: vec3, lineStart: vec3, lineEnd: vec3): vec3 {
        // Calculate the line direction and length
        const lineDirection = lineEnd.sub(lineStart);
        const lineLength = lineDirection.length;
        
        if (lineLength === 0) {
            return lineStart; // Line has no length, return start point
        }
        
        const normalizedDirection = lineDirection.normalize();

        // Project the point onto the line
        const startToPoint = point.sub(lineStart);
        const projectionLength = startToPoint.dot(normalizedDirection);

        // Clamp the projection to the bounds of the line
        const clampedProjection = Math.max(0, Math.min(projectionLength, lineLength));

        // Calculate the closest point on the line
        return lineStart.add(normalizedDirection.uniformScale(clampedProjection));
    }

    /**
     * Calculate normalized value (0 to 1) based on position along the line
     */
    private calculateNormalizedValue(projectedPosition: vec3, lineStart: vec3, lineEnd: vec3): number {
        const lineDirection = lineEnd.sub(lineStart);
        const lineLength = lineDirection.length;
        
        if (lineLength === 0) {
            return 0; // Line has no length
        }

        const startToProjected = projectedPosition.sub(lineStart);
        const projectionLength = startToProjected.dot(lineDirection.normalize());
        
        // Normalize to 0-1 range
        // return MathUtils.clamp(projectionLength / lineLength, 0, 2); // from zero speed to double speed

        // Normalize to 0-2 range
        if (this.doubleMapping) {
                const normalizedValue = (projectionLength / lineLength) * 2;
                 return MathUtils.clamp(normalizedValue, 0, 2);
        }else{
               const normalizedValue = (projectionLength / lineLength);
              return MathUtils.clamp(normalizedValue, 0, 1);
        }
    
    }

    /**
     * Invokes the callback with the calculated normalized value
     */
    private invokeCallback(normalizedValue: number): void {
        if (this.callback && this.callback[this.methodName]) {
            try {
                this.callback[this.methodName](normalizedValue);
                this.log.d(`Callback invoked with value: ${normalizedValue}`);
            } catch (error) {
                this.log.e(`Error invoking callback: ${error}`);
            }
        }
    }

    /**
     * Manually set the line boundaries
     */
    setLineBoundaries(startPoint: SceneObject, endPoint: SceneObject): void {
        this.lineStart = startPoint;
        this.lineEnd = endPoint;
        this.log.d("Line boundaries updated");
        
        // Update projection with new boundaries
        if (this.enableProjection) {
            this.updateProjection();
        }
    }

    /**
     * Enable or disable projection
     */
    setProjectionEnabled(enabled: boolean): void {
        this.enableProjection = enabled;
        this.log.d(`Projection ${enabled ? 'enabled' : 'disabled'}`);
    }

    /**
     * Update the callback configuration
     */
    setCallback(callbackScript: ScriptComponent, methodName: string): void {
        this.callback = callbackScript;
        this.methodName = methodName;
        this.log.d(`Callback updated: ${methodName}`);
    }

    /**
     * Get the current normalized value
     */
    getCurrentNormalizedValue(): number {
        return this.lastNormalizedValue;
    }

    /**
     * Get the current projected position
     */
    getCurrentProjectedPosition(): vec3 {
        if (!this.visualReference) {
            return vec3.zero();
        }
        return this.visualReference.getTransform().getWorldPosition();
    }
} 