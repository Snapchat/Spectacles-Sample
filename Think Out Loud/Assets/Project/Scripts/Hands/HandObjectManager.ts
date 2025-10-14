import { Instantiator } from "SpectaclesSyncKit.lspkg/Components/Instantiator";
import { SessionController } from "SpectaclesSyncKit.lspkg/Core/SessionController";
import { HandObjectController } from "./HandObjectController";

@component
export class HandObjectManager extends BaseScriptComponent {

    @input
    instantiator: Instantiator

    @input
    leftHandPrefab: ObjectPrefab

    @input
    rightHandPrefab: ObjectPrefab

    @input
    testingMode: boolean = false

    private myLeftHand: HandObjectController;
    private myRightHand: HandObjectController;
    private allHands: HandObjectController[] = [];

    // Callbacks for external systems
    private onHandsReadyCallbacks: ((leftHand: HandObjectController, rightHand: HandObjectController) => void)[] = [];

    subscribe(handObject: HandObjectController) {
        this.allHands.push(handObject);
        
        if (handObject.isLocalHand()) {
            if (handObject.getHandType() === "left") {
                this.myLeftHand = handObject;
                print("📝 Subscribed to local left hand");
            } else if (handObject.getHandType() === "right") {
                this.myRightHand = handObject;
                print("📝 Subscribed to local right hand");
            }

            // Check if both hands are ready
            if (this.myLeftHand && this.myRightHand) {
                print("🙌 Both local hands are ready!");
                this.notifyHandsReady(this.myLeftHand, this.myRightHand);
            }
        }
        
        this.createEvent("UpdateEvent").bind(() => this.onUpdate());
    }

    instantiateHandObjects() {
        print("Instantiating hand objects for " + SessionController.getInstance().getLocalUserName());
        
        // Instantiate left hand
        this.instantiator.instantiate(this.leftHandPrefab, {
            onSuccess: (networkRoot) => {
                print("✅ Left hand instantiated successfully");
                // Set testing mode on the hand controller
                const handController = networkRoot.sceneObject.getComponent(HandObjectController.getTypeName()) as HandObjectController;
                if (handController) {
                    handController.testingMode = this.testingMode;
                }
            },
            onError: (error) => {
                print("❌ Error instantiating left hand: " + error);
            }
        });
        
        // Instantiate right hand
        this.instantiator.instantiate(this.rightHandPrefab, {
            onSuccess: (networkRoot) => {
                print("✅ Right hand instantiated successfully");
                // Set testing mode on the hand controller
                const handController = networkRoot.sceneObject.getComponent(HandObjectController.getTypeName()) as HandObjectController;
                if (handController) {
                    handController.testingMode = this.testingMode;
                }
            },
            onError: (error) => {
                print("❌ Error instantiating right hand: " + error);
            }
        });
    }

    onUpdate() {
        // Update all local hands
        if (this.myLeftHand) {
            this.myLeftHand.onUpdate();
        }
        if (this.myRightHand) {
            this.myRightHand.onUpdate();
        }
    }

    // Public methods for external systems
    getMyLeftHand(): HandObjectController | null {
        return this.myLeftHand || null;
    }

    getMyRightHand(): HandObjectController | null {
        return this.myRightHand || null;
    }

    getMyHandsCenter(): vec3 | null {
        if (!this.myLeftHand || !this.myRightHand) {
            return null;
        }

        const leftPos = this.myLeftHand.getWorldPosition();
        const rightPos = this.myRightHand.getWorldPosition();
        
        return new vec3(
            (leftPos.x + rightPos.x) / 2,
            (leftPos.y + rightPos.y) / 2,
            (leftPos.z + rightPos.z) / 2
        );
    }


    getAllRemoteHands(): HandObjectController[] {
        return this.allHands.filter(hand => !hand.isLocalHand());
    }


    subscribeToHandsReady(callback: (leftHand: HandObjectController, rightHand: HandObjectController) => void) {
        this.onHandsReadyCallbacks.push(callback);
    }

    private notifyHandsReady(leftHand: HandObjectController, rightHand: HandObjectController) {
        this.onHandsReadyCallbacks.forEach(callback => callback(leftHand, rightHand));
    }

    onStart() {
        SessionController.getInstance().notifyOnReady(() => {
            this.instantiator.notifyOnReady(() => {
                this.instantiateHandObjects();
            });
        });
    }

    onAwake() {
        this.createEvent("OnStartEvent").bind(() => this.onStart());
    }
}
