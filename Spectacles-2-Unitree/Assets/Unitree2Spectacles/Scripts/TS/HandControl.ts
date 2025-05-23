import { HandInputData } from "SpectaclesInteractionKit/Providers/HandInputData/HandInputData";
import { CoordinationClient, HandMovementMessage } from "./CoordinationClient";
import { SIK } from "SpectaclesInteractionKit/SIK";
import { AllHandTypes } from "SpectaclesInteractionKit/Providers/HandInputData/HandType";
import TrackedHand from "SpectaclesInteractionKit/Providers/HandInputData/TrackedHand";
import { HandVisual, HandVisualSelection } from "SpectaclesInteractionKit/Components/Interaction/HandVisual/HandVisual";
import * as FunctionTimingUtils from "SpectaclesInteractionKit/Utils/debounce";
import { Keypoint } from "SpectaclesInteractionKit/Providers/HandInputData/Keypoint";
import { flat } from "Unitree2Spectacles/Scripts/TS/Utils";
import { LandmarkName, wristLandmarks } from "SpectaclesInteractionKit/Providers/HandInputData/LandmarkNames";


declare global {
    interface mat4 {
        // Returns the up vector of the matrix.
        up(): vec3;
        // Returns the down vector of the matrix.
        down(): vec3;
        // Returns the left vector of the matrix.
        left(): vec3;
        // Returns the right vector of the matrix.
        right(): vec3;
        // Returns the forward vector of the matrix.
        forward(): vec3;
        // Returns the back vector of the matrix.
        back(): vec3;
        // Construct from a 4x4 number[][].
        fromArray(numbers: number[][]): mat4;
    }

    interface mat3 {
        // Construct from a 3x3 number[][].
        fromArray(numbers: number[][]): mat3;
    }
}

mat4.prototype.up = function () {
    return new vec3(this.column0.x, this.column0.y, this.column0.z);
}

mat4.prototype.down = function () {
    return new vec3(-this.column0.x, -this.column0.y, -this.column0.z);
}

mat4.prototype.left = function () {
    return new vec3(this.column1.x, this.column1.y, this.column1.z);
}

mat4.prototype.right = function () {
    return new vec3(-this.column1.x, -this.column1.y, -this.column1.z);
}

mat4.prototype.forward = function () {
    return new vec3(this.column2.x, this.column2.y, this.column2.z);
}

mat4.prototype.back = function () {
    return new vec3(-this.column2.x, -this.column2.y, -this.column2.z);
}

mat4.prototype.fromArray = function (numbers: number[][]): mat4 {
    let m = new mat4();
    if (!numbers || numbers.length !== 4 || numbers[0].length !== 4) {
        throw new Error("Invalid matrix size, expected 4x4");
    }
    let [c0, c1, c2, c3] = numbers.map((r) => new vec4(r[0], r[1], r[2], r[3]));
    m.column0 = c0;
    m.column1 = c1;
    m.column2 = c2;
    m.column3 = c3;
    return m;
}

mat3.prototype.fromArray = function (numbers: number[][]): mat3 {
    let m = new mat3();
    if (!numbers || numbers.length !== 3 || numbers[0].length !== 3) {
        throw new Error("Invalid matrix size, expected 3x3");
    }
    let [c0, c1, c2] = numbers.map((r) => new vec3(r[0], r[1], r[2]));
    m.column0 = c0;
    m.column1 = c1;
    m.column2 = c2;
    return m;
}

@component
export class HandControl extends BaseScriptComponent {
    public enabled = false;
    private gestureModule: GestureModule = require("LensStudio:GestureModule");
    private handInputData: HandInputData;
    private rightHand: TrackedHand;
    private leftHand: TrackedHand;
    private trackingTimeout: FunctionTimingUtils.CancelToken;
    private trackingInterval = 32; // About 30 FPS
    private axesMap: Map<string, [SceneObject, MeshBuilder]> = new Map();
    private axesUpdateTimeout: FunctionTimingUtils.CancelToken;
    private axesUpdateInterval = 16; // About 60 FPS

    @input
    private camera: Camera;
    @input
    private handTrackingStatus: Text;
    @input
    private tempLog: Text;
    @input
    private axesSceneObject: SceneObject;
    @input('Component.ScriptComponent')
    private coordinationClient: CoordinationClient;

    async onAwake() {
        try {
            this.enabled = false;
            this.handInputData = SIK.HandInputData;
            this.leftHand = this.handInputData.getHand("left");
            this.leftHand.setTrackingMode(ObjectTracking3D.TrackingMode.ProportionsAndPose);
            this.rightHand = this.handInputData.getHand("right");
            this.rightHand.setTrackingMode(ObjectTracking3D.TrackingMode.ProportionsAndPose);
            this.handTrackingStatus.text = "Hand Tracking: Disabled";
            this.gestureModule.getPalmTapDownEvent(GestureModule.HandType.Right).add(() => {
                this.enabled = !this.enabled;
                this.handTrackingStatus.text = this.enabled ? "Hand Tracking: Enabled" : "Hand Tracking: Disabled";

                if (this.enabled) {
                    // Start periodic tracking when enabled
                    this.sendHandUpdates();
                } else {
                    // Clear the timeout when disabled
                    if (this.trackingTimeout) {
                        FunctionTimingUtils.clearTimeout(this.trackingTimeout);
                    }
                }
            });

            this.createAxes("head");
            Promise.all([
                this.createHandAxes(this.leftHand),
                this.createHandAxes(this.rightHand)
            ]).then(() => {
                this.startAxesUpdates(this.leftHand, this.rightHand);
            }).catch((error) => {
                this.log("Error creating axes: " + error + " " + error.stack);
            });
            this.log("HandControl initialized");
        } catch (error) {
            this.handTrackingStatus.text = "Error: " + error + " " + error.stack;
            this.log("Error: " + error + " " + error.stack);
        }
    }

    /**
     * Update the keypoints of the hands
     */
    private sendHandUpdates() {
        if (this.enabled) {
            try {
                if (this.leftHand.isTracked()) {
                    const movement = new HandMovementMessage(this.leftHand, this.camera.getTransform().getWorldTransform());
                    this.coordinationClient.sendHandMovement(movement);
                }
                if (this.rightHand.isTracked()) {
                    const movement = new HandMovementMessage(this.rightHand, this.camera.getTransform().getWorldTransform());
                    this.coordinationClient.sendHandMovement(movement);
                }

                // Schedule the next update
                this.trackingTimeout = FunctionTimingUtils.setTimeout(() => {
                    this.sendHandUpdates();
                }, this.trackingInterval);

            } catch (error) {
                this.handTrackingStatus.text = "Error: " + error + " " + error.stack;
                this.log("Error: " + error + " " + error.stack);
            }
        }
    }

    /**
     * Create axes for the keypoints of the hands
     */
    private async createHandAxes(hand: TrackedHand): Promise<void> {
        if (!hand?.isTracked() || !hand?.points || hand.points.length === 0) {
            this.log(`${hand.handType} is not tracked, waiting to set up axes...`);
            return new Promise((resolve) => {
                FunctionTimingUtils.setTimeout(async () => {
                    const result = await this.createHandAxes(hand);
                    resolve(result);
                }, 1000);
            });
        }
        const keypoints = this.filterKeypoints(hand.points);
        for (let i = 0; i < keypoints.length; i++) {
            const keypoint = keypoints[i];
            let sceneObjectName = `${hand.handType}_${keypoint.name}`;
            this.createAxes(sceneObjectName);
        }
    }

    /**
     * Create axes scene objects and mesh builders.
     * @param name The name of the axes to create
     */
    private createAxes(name: string) {
        let axes = this.axesSceneObject.getParent().copySceneObject(this.axesSceneObject);
        axes.name = name;
        let meshBuilder = new MeshBuilder([
            { name: "position", components: 3 },
            { name: "color", components: 4 },
        ]);
        meshBuilder.topology = MeshTopology.Lines;
        meshBuilder.indexType = MeshIndexType.UInt16;
        this.axesMap.set(name, [axes, meshBuilder]);
    }

    /**
     * Start the axes update cycle
     */
    private startAxesUpdates(left: TrackedHand, right: TrackedHand) {
        const updateLoop = () => {
            try {
                this.updateAxes(); // Update the head axis.
                if (left.isTracked()) this.updateAxes(left);
                if (right.isTracked()) this.updateAxes(right);
            } catch (error) {
                this.log("Error updating axes: " + error + " " + error.stack);
            }
            this.axesUpdateTimeout = FunctionTimingUtils.setTimeout(updateLoop, this.axesUpdateInterval);
        };
        updateLoop();
    }

    /**
     * Update the axes for a given hand.
     * @param hand The hand to update the axes for.
     */
    private updateAxes(hand: TrackedHand | null = null) {
        if (hand !== null && hand?.isTracked()) {
            try {
                this.filterKeypoints(hand.points).forEach((k) => {
                    let sceneObjectName = `${hand.handType}_${k.name}`;
                    let [sceneObject, meshBuilder] = this.axesMap.get(sceneObjectName);
                    let transform = k.getAttachmentPoint().getTransform();
    
                    this.updateMesh(meshBuilder, sceneObject, transform);
                });
            } catch (error) {
                this.log("Error updating axes: " + error + " " + error.stack);
            }
        }
    }

    private updateMesh(meshBuilder: MeshBuilder, sceneObject: SceneObject, transform: Transform) {
        if (meshBuilder !== undefined && sceneObject !== undefined) {
            let v = meshBuilder.getVerticesCount();
            let i = meshBuilder.getIndicesCount();

            let origin = transform.getWorldPosition();

            let length = 1;

            let RIGHT = origin.add(transform.getWorldTransform().right().normalize().uniformScale(length));
            let UP = origin.add(transform.getWorldTransform().up().normalize().uniformScale(length));
            let BACK = origin.add(transform.getWorldTransform().back().normalize().uniformScale(length));

            let red = [1, 0, 0, 1];
            let green = [0, 1, 0, 1];
            let blue = [0, 0, 1, 1];

            let x = [
                origin, RIGHT
            ].map((v) => flat(v).concat(red));

            let y = [
                origin, UP
            ].map((v) => flat(v).concat(green));

            let z = [
                origin, BACK
            ].map((v) => flat(v).concat(blue));

            let vertices = [
                x,
                y,
                z
            ].flat();

            let indices = [0, 1, 2, 3, 4, 5];

            if (i === 0 && v === 0) {
                // First time creating the mesh
                meshBuilder.appendVerticesInterleaved(vertices.flat());
                meshBuilder.appendIndices(indices);
            } else {
                for (let i = 0; i < vertices.length; i++) {
                    meshBuilder.setVertexInterleaved(i, vertices[i]);
                }
            }
            if (meshBuilder.isValid()) {
                sceneObject.getComponent("Component.RenderMeshVisual").mesh = meshBuilder.getMesh();
                meshBuilder.updateMesh();
            } else {
                this.log("MeshBuilder is not valid");
            }
        }
    }

    private log(message: string) {
        Studio.log(message);
        if (this.tempLog) {
            // Limit lines to 10
            let lines = this.tempLog.text.split("\n");
            if (lines.length > 10) {
                lines = lines.slice(1);
            }
            lines.push(`${getTime().toFixed(2)}: ${message}`);
            this.tempLog.text = lines.join("\n");
        }
    }

    /**
     * Filter out the wrist-to-* keypoints from the list of keypoints.
     * @param keypoints The keypoints to filter
     */
    private filterKeypoints(keypoints: Keypoint[]): Keypoint[] {
        return keypoints.filter(k => !wristLandmarks.includes(k.name as LandmarkName) || k.name === LandmarkName.WRIST);
    }
}