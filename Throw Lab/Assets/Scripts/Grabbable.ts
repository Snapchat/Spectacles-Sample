import { InteractionManager } from "SpectaclesInteractionKit.lspkg/Core/InteractionManager/InteractionManager";
import { InteractorInputType } from "SpectaclesInteractionKit.lspkg/Core/Interactor/Interactor";
import { Interactor } from "SpectaclesInteractionKit.lspkg/Core/Interactor/Interactor";
import { SIK } from "SpectaclesInteractionKit.lspkg/SIK";
import Event from "SpectaclesInteractionKit.lspkg/Utils/Event";
import TrackedHand from "SpectaclesInteractionKit.lspkg/Providers/HandInputData/TrackedHand";

@component
export class Grabbable extends BaseScriptComponent {

    private isGrabbed: boolean = false;
    private isHandOverlapping: boolean = false;

    @input
    @allowUndefined
    public collider: ColliderComponent;

    @input
    public handColliderName:string = "ColliderTargetProvider"

    // Hand Collider Prefab References
    @input
    @hint("Prefab with collider named 'ColliderTargetProvider' to attach to left hand")
    public leftHandColliderPrefab: ObjectPrefab;

    @input
    @hint("Prefab with collider named 'ColliderTargetProvider' to attach to right hand")
    public rightHandColliderPrefab: ObjectPrefab;

    private gestureModule: GestureModule = require('LensStudio:GestureModule');

    // Instantiated hand collider objects
    private leftHandColliderObject: SceneObject | null = null;
    private rightHandColliderObject: SceneObject | null = null;

    // Hand references
    private leftHand: TrackedHand;
    private rightHand: TrackedHand;

    // Track which hand is currently overlapping
    private overlappingHandType: "left" | "right" | null = null;

    public onGrabStartEvent:Event<Interactor> = new Event<Interactor>();
    public onGrabEndEvent:Event<Interactor> = new Event<Interactor>();

    public onHoverStartEvent:Event = new Event();
    public onHoverEndEvent:Event = new Event();

    onGrabBeginEvent: any;

    onAwake() {

        if (!this.collider) {
            this.collider = this.sceneObject.getComponent("ColliderComponent");
        }

        if (!this.collider) {
            print("Grabbable component requires a collider component.");
            return;
        }

        this.collider.overlapFilter.includeIntangible = true;
        this.collider.onOverlapEnter.add(this.onOverlapEnter.bind(this));
        this.collider.onOverlapExit.add(this.onOverlapExit.bind(this));

        // Initialize hand tracking
        try {
            this.leftHand = SIK.HandInputData.getHand("left");
            this.rightHand = SIK.HandInputData.getHand("right");
            print("Grabbable: Hand tracking initialized successfully");
        } catch (error) {
            print("Grabbable: Warning - Failed to initialize hand tracking");
        }

        // Instantiate hand collider prefabs
        this.instantiateHandColliders();

        // Set up update event to position colliders at hand midpoints
        this.createEvent("UpdateEvent").bind(this.onUpdate.bind(this));

        this.gestureModule.getGrabBeginEvent(GestureModule.HandType.Right)
            .add((GrabBeginArgs) => this.onGrabBegin(InteractionManager.getInstance().getInteractorsByType(InteractorInputType.RightHand)[0]));

        this.gestureModule.getGrabEndEvent(GestureModule.HandType.Right)
            .add((GrabEndArgs) => this.onGrabEnd(InteractionManager.getInstance().getInteractorsByType(InteractorInputType.RightHand)[0]));

        this.gestureModule.getGrabBeginEvent(GestureModule.HandType.Left)
            .add((GrabBeginArgs) => this.onGrabBegin(InteractionManager.getInstance().getInteractorsByType(InteractorInputType.LeftHand)[0]));

        this.gestureModule.getGrabEndEvent(GestureModule.HandType.Left)
            .add((GrabEndArgs) => this.onGrabEnd(InteractionManager.getInstance().getInteractorsByType(InteractorInputType.LeftHand)[0]));

    }

    onOverlapEnter (e:OverlapEnterEventArgs) {
        try {
            if (!e || !e.overlap || !e.overlap.collider) {
                return;
            }

            const overlappingObject = e.overlap.collider.getSceneObject();
            if (!overlappingObject) {
                return;
            }

            // Check if it's one of our hand colliders
            if (overlappingObject === this.leftHandColliderObject) {
                this.overlappingHandType = "left";
                if (!this.isHandOverlapping) { 
                    this.onHoverStartEvent.invoke();
                    print("Grabbable: Left hand hover started");
                }
                this.isHandOverlapping = true;
            } else if (overlappingObject === this.rightHandColliderObject) {
                this.overlappingHandType = "right";
                if (!this.isHandOverlapping) { 
                    this.onHoverStartEvent.invoke();
                    print("Grabbable: Right hand hover started");
                }
                this.isHandOverlapping = true;
            }
        } catch (error) {
            print("Grabbable: Error in onOverlapEnter - " + error);
        }
    }

    onOverlapExit (e:OverlapExitEventArgs) {
        try {
            if (!e || !e.overlap || !e.overlap.collider) {
                return;
            }

            const overlappingObject = e.overlap.collider.getSceneObject();
            if (!overlappingObject) {
                return;
            }

            // Check if it's one of our hand colliders
            if (overlappingObject === this.leftHandColliderObject || 
                overlappingObject === this.rightHandColliderObject) {
                if (this.isHandOverlapping) { 
                    this.onHoverEndEvent.invoke();
                    print("Grabbable: Hand hover ended");
                }
                this.isHandOverlapping = false;
                this.overlappingHandType = null;
            }
        } catch (error) {
            print("Grabbable: Error in onOverlapExit - " + error);
        }
    }

    private onGrabBegin(interactor:Interactor) {
        try {
            if (!interactor) {
                print("Grabbable: Warning - onGrabBegin called with null interactor");
                return;
            }

            if (this.isHandOverlapping && this.overlappingHandType) {
                this.isGrabbed = true;
                this.onGrabStartEvent.invoke(interactor);
                print("Grabbable: Grab started with " + this.overlappingHandType + " hand");
            }
        } catch (error) {
            print("Grabbable: Error in onGrabBegin - " + error);
        }
    }

    private onGrabEnd (interactor:Interactor) {
        try {
            if (!interactor) {
                print("Grabbable: Warning - onGrabEnd called with null interactor");
            }

            if (this.isGrabbed) {
                this.onGrabEndEvent.invoke(interactor);
                print("Grabbable: Grab ended");
            }
            this.isGrabbed = false;
        } catch (error) {
            print("Grabbable: Error in onGrabEnd - " + error);
        }
    }

    /**
     * Instantiate hand collider prefabs for both hands
     */
    private instantiateHandColliders(): void {
        try {
            // Instantiate left hand collider
            if (this.leftHandColliderPrefab) {
                this.leftHandColliderObject = this.leftHandColliderPrefab.instantiate(this.sceneObject.getParent());
                if (this.leftHandColliderObject) {
                    this.leftHandColliderObject.name = "LeftHandCollider";
                    this.setupHandCollider(this.leftHandColliderObject, "left");
                    print("Grabbable: Left hand collider instantiated and configured");
                }
            } else {
                print("Grabbable: Warning - Left hand collider prefab not assigned");
            }

            // Instantiate right hand collider
            if (this.rightHandColliderPrefab) {
                this.rightHandColliderObject = this.rightHandColliderPrefab.instantiate(this.sceneObject.getParent());
                if (this.rightHandColliderObject) {
                    this.rightHandColliderObject.name = "RightHandCollider";
                    this.setupHandCollider(this.rightHandColliderObject, "right");
                    print("Grabbable: Right hand collider instantiated and configured");
                }
            } else {
                print("Grabbable: Warning - Right hand collider prefab not assigned");
            }
        } catch (error) {
            print("Grabbable: Error instantiating hand colliders - " + error);
        }
    }

    /**
     * Setup and configure a hand collider with proper settings to prevent crashes
     */
    private setupHandCollider(colliderObject: SceneObject, handType: string): void {
        try {
            const collider = colliderObject.getComponent("ColliderComponent");
            if (collider) {
                // Configure collider to be intangible (doesn't collide with physics, only triggers overlaps)
                collider.intangible = true;
                
                // Ensure overlap filter is set up properly
                if (collider.overlapFilter) {
                    collider.overlapFilter.includeIntangible = true;
                }
                
                print("Grabbable: " + handType + " hand collider configured as intangible");
            } else {
                print("Grabbable: Warning - No ColliderComponent found on " + handType + " hand collider prefab");
            }
        } catch (error) {
            print("Grabbable: Error setting up " + handType + " hand collider - " + error);
        }
    }

    /**
     * Update hand collider positions every frame
     */
    private onUpdate(): void {
        try {
            // Update left hand collider position
            if (this.leftHandColliderObject && this.leftHand && this.leftHand.isTracked()) {
                this.updateHandColliderPosition(
                    this.leftHandColliderObject,
                    this.leftHand
                );
            }

            // Update right hand collider position
            if (this.rightHandColliderObject && this.rightHand && this.rightHand.isTracked()) {
                this.updateHandColliderPosition(
                    this.rightHandColliderObject,
                    this.rightHand
                );
            }
        } catch (error) {
            print("Grabbable: Error in onUpdate - " + error);
        }
    }

    /**
     * Update a specific hand collider's position to the midpoint between wrist and middle knuckle
     * Uses the hand tracking API to get wrist and middleKnuckle keypoints directly
     */
    private updateHandColliderPosition(
        colliderObject: SceneObject,
        hand: TrackedHand
    ): void {
        try {
            if (!colliderObject || !hand) {
                return;
            }

            const midpoint = this.calculateMidpointFromHand(hand);
            if (midpoint) {
                const transform = colliderObject.getTransform();
                if (transform) {
                    transform.setWorldPosition(midpoint);
                }
            }
        } catch (error) {
            print("Grabbable: Error updating hand collider position - " + error);
        }
    }

    /**
     * Calculate midpoint position between wrist and middle knuckle using hand tracking API
     */
    private calculateMidpointFromHand(hand: TrackedHand): vec3 | null {
        try {
            if (!hand || !hand.wrist || !hand.middleKnuckle) {
                return null;
            }

            const wristPos = hand.wrist.position;
            const knucklePos = hand.middleKnuckle.position;

            if (!wristPos || !knucklePos) {
                return null;
            }

            return new vec3(
                (wristPos.x + knucklePos.x) / 2,
                (wristPos.y + knucklePos.y) / 2,
                (wristPos.z + knucklePos.z) / 2
            );
        } catch (error) {
            print("Grabbable: Error calculating midpoint - " + error);
            return null;
        }
    }

}