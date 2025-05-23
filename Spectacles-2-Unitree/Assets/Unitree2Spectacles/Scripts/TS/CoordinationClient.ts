import { HandType } from "SpectaclesInteractionKit/Providers/HandInputData/HandType";
import { allLandmarks, LandmarkName, wristLandmarks } from "SpectaclesInteractionKit/Providers/HandInputData/LandmarkNames";
import TrackedHand from "SpectaclesInteractionKit/Providers/HandInputData/TrackedHand";
import * as FunctionTimingUtils from "SpectaclesInteractionKit/Utils/debounce";
import { SimulationImageController } from "./SimulationImage";
import { flat, tr } from "Unitree2Spectacles/Scripts/TS/Utils";

// Define the CancelToken type to match what's returned by FunctionTimingUtils
type CancelToken = ReturnType<typeof FunctionTimingUtils.setTimeout>;

/**
 * Client for communicating with the Spectacles-2-Unitree Coordination server.
 */
@component
export class CoordinationClient extends BaseScriptComponent {

    @input
    serverUrl: string = "wss://spectaclexr.com/ws";

    @input
    private logs: Text;

    @input
    private img_sim: Image;

    private socket: WebSocket;
    private clientId: string = null;
    public pairingStatus: "disconnected" | "waiting" | "paired" = "disconnected";
    private pairedWithId: string = null;
    private pairedWithType: string = null;
    private reconnectTimer: CancelToken = null;
    // Delay between reconnection attempts in milliseconds
    private reconnect_delay: number = 1000;
    // Remote service module for fetching data
    private remoteServiceModule: RemoteServiceModule = require("LensStudio:RemoteServiceModule");

    // Timer for connection health checks
    private connectionCheckTimer: CancelToken = null;

    private simImgController: SimulationImageController = null;

    async onAwake() {
        try {
            await this.connectToServer();
            this.simImgController = new SimulationImageController(this.img_sim);
            // Start periodic connection health checks
            this.startConnectionHealthChecks();
        } catch (e) {
            print("Error: " + e);
        }
    }

    onDestroy() {

        if (this.simImgController) {
            this.simImgController.dispose();
            this.simImgController = null;
        }

        // Clean up connection check timer when component is destroyed
        if (this.connectionCheckTimer !== null) {
            FunctionTimingUtils.clearTimeout(this.connectionCheckTimer);
            this.connectionCheckTimer = null;
        }

        // Also clean up reconnect timer
        if (this.reconnectTimer !== null) {
            FunctionTimingUtils.clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }

        // Close socket if open
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
    }

    /**
     * Starts periodic connection health checks to detect disconnections
     */
    private startConnectionHealthChecks() {
        // Clear any existing timer
        if (this.connectionCheckTimer !== null) {
            FunctionTimingUtils.clearTimeout(this.connectionCheckTimer);
        }

        // Set up recurring check
        this.connectionCheckTimer = FunctionTimingUtils.setTimeout(() => {
            this.checkConnectionHealth();
            // Schedule next check if component is still active
            if (this.enabled) {
                this.startConnectionHealthChecks();
            }
        }, this.reconnect_delay);
    }

    /**
     * Checks if the connection is healthy and initiates reconnection if needed
     */
    private checkConnectionHealth() {
        const socketClosed = !this.socket ||
            this.socket.readyState === 2 || // closing
            this.socket.readyState === 3;   // closed

        if (socketClosed) {
            // Only log if we were previously connected
            if (this.pairingStatus !== "disconnected") {
                this.log("Connection lost. Attempting to reconnect...");
                this.pairingStatus = "disconnected";
                this.pairedWithId = null;
                this.pairedWithType = null;

                this.simImgController.showStatic();
            }

            // Initiate reconnection if not already scheduled
            if (this.reconnectTimer === null) {
                this.scheduleReconnect();
            }
        }
    }

    private async connectToServer() {
        try {
            // Close existing socket if present
            if (this.socket) {
                this.socket.close(); // NOTE: not sure if this is actually working or if there is an issue with Lens Studio's Spectacles simulation.
                this.socket = null;
            }

            // Clear any existing reconnect timer
            if (this.reconnectTimer !== null) {
                FunctionTimingUtils.clearTimeout(this.reconnectTimer);
                this.reconnectTimer = null;
            }

            // Check if server is available before attempting to connect
            const serverBase = this.serverUrl.replace("wss://", "https://").replace("/ws", "");
            try {
                const response = await this.remoteServiceModule.fetch(serverBase, {
                    method: "GET"
                });
                if (response.status >= 400) {
                    print(`Server returned error status: ${response.status}`);
                    this.log(`Server unavailable (status: ${response.status}). Retrying in ${this.reconnect_delay / 1000} seconds...`);
                    this.scheduleReconnect();
                    return;
                } else if (response.status == null) {
                    throw new Error(`Status was not OK: ${response.status}`)
                }

                print(`Server check succeeded with status: ${response.status}`);
            } catch (e) {
                print(`Server availability check failed: ${e}`);
                this.log(`Failed to reach server. Retrying in ${this.reconnect_delay / 1000} seconds...`);
                this.scheduleReconnect();
                return;
            }

            // Create new WebSocket connection
            this.socket = this.remoteServiceModule.createWebSocket(this.serverUrl);
            this.socket.binaryType = "blob";

            // Set up event handlers
            this.socket.onopen = (event: WebSocketEvent) => {
                print("Socket connected! Identifying as spectacles client...");
                this.log("Connected to server");

                // Send identification message
                this.socket.send(JSON.stringify({
                    "type": MessageType.CLIENT_TYPE
                }));
            };

            this.socket.onmessage = async (event: WebSocketMessageEvent) => {
                await this.processMessage(event.data);
            };

            this.socket.onclose = (event: WebSocketCloseEvent) => {
                if (event.wasClean) {
                    print("Connection closed cleanly");
                    this.log("Connection closed");
                } else {
                    print("Connection died: " + event.code);
                    this.log(`Connection lost. Retrying in ${this.reconnect_delay / 1000} seconds...`);
                }

                this.pairingStatus = "disconnected";
                this.pairedWithId = null;
                this.pairedWithType = null;

                // Schedule reconnection
                this.scheduleReconnect();
            };

            this.socket.onerror = (event: WebSocketErrorEvent) => {
                print("WebSocket error: " + event);
                this.log("Connection error occurred");
            };
        } catch (e) {
            print("Error connecting to server: " + e);
            this.log(`Connection error: ${e}. Retrying in ${this.reconnect_delay / 1000} seconds...`);
            this.scheduleReconnect();
        }
    }

    /**
     * Schedule a reconnection attempt after the specified delay
     */
    private scheduleReconnect() {
        // Clear any existing reconnect timer
        if (this.reconnectTimer !== null) {
            FunctionTimingUtils.clearTimeout(this.reconnectTimer);
        }

        // Schedule a reconnection attempt
        this.reconnectTimer = FunctionTimingUtils.setTimeout(() => {
            this.log(`Attempting to reconnect...`);
            this.connectToServer();
        }, this.reconnect_delay);
    }

    private async processMessage(data: string | Blob) {
        try {
            if (data instanceof Blob) {
                // Try to unpack the message: [1 byte type][4 bytes payload length][image bytes...]
                // data.bytes() is a Promise<Uint8Array>, so we need to wait for it to resolve
                const uint8 = await data.bytes();
                // Wait for the promise to resolve
                if (uint8 === null) {
                    print("Error reading bytes");
                    return;
                }
                const headerSize = 5; // 1 byte type + 4 bytes length
                if (uint8.length < headerSize) {
                    print("header too short");
                    return;
                }
                const view = new DataView(uint8.buffer);
                const type = String.fromCharCode(uint8[0]);
                const length = view.getUint32(1, false);
                if (uint8.length < headerSize + length) {
                    print("payload length mismatch");
                    return;
                };

                const payloadBytes = uint8.slice(headerSize, headerSize + length);
                this.handleBytes(type, payloadBytes)
            } else {
                const message = JSON.parse(data);
                // Handle different message types
                if (message.type === "status_update") {
                    this.handleStatusUpdate(message);
                } else if (message.type === "ping") {
                    this.handlePing(message);
                } else if (message.type === "robot_status") {
                    this.handleRobotStatus(message);
                } else {
                    this.log("Unknown message type: " + message);
                }
            }
        } catch (e) {
            print("Error processing message: " + e);
        }
    }

    private handleStatusUpdate(message: any) {
        this.pairingStatus = message.status;

        if (message.client_id) {
            this.clientId = message.client_id;
        }

        if (message.status === "paired") {
            const pairedWith = message.paired_with || {};
            this.pairedWithId = pairedWith.id || null;
            this.pairedWithType = pairedWith.type || null;
            this.log("Paired with " + this.pairedWithType + " (ID: " + this.pairedWithId + ")");
            this.socket.send(JSON.stringify({
                "type": MessageType.ACTION_WAVE // Wave to confirm pairing.
            }))
        } else if (message.status === "waiting") {
            // Record our client ID.
            this.clientId = message.client_id;
            this.log(`ID: ${this.clientId}\nWaiting: ${message.message}`);
            this.pairedWithId = null;
            this.pairedWithType = null;
            this.simImgController.showStatic();
        } else if (message.status === "disconnected") {
            this.log("Disconnected: " + message.message);
            this.pairedWithId = null;
            this.pairedWithType = null;
            this.simImgController.showStatic();
        }
    }

    private handlePing(message: any) {
        // Respond to ping with pong for latency measurement
        if (message.timestamp && this.socket?.readyState === 1) {
            this.socket.send(JSON.stringify({
                type: "pong",
                ping_timestamp: message.timestamp
            }));
        }
    }

    private handleRobotStatus(message: any) {
        // Handle robot status updates (battery, position, etc.)
        print("Robot status: Battery=" + message.battery + "%");

        // Here you could update UI elements displaying robot status
        // or use the position/orientation data for visualization
    }

    private handleBytes(type: string, payload: Uint8Array) {
        if (type === "s") {
            // Simulation image data.
            this.simImgController.showLiveFeed(payload);
        }
    }

    private log(message: string) {
        this.logs.text = message;
    }

    // Public method to check if connected and paired
    public isPaired(): boolean {
        return this.pairingStatus === "paired" && this.pairedWithId !== null;
    }

    /**
     * Send a discrete action to the robot.
     * @param action The action to send to the robot.
     */
    public sendAction(action: ActionMessage) {
        if (this.socket?.readyState === 1) {
            this.socket.send(JSON.stringify({
                type: action
            }));
        }
    }

    /**
     * Send a movement command to the robot.
     * @param long Forward/backward movement in meters per second.
     * @param lat Lateral movement in meters per second.
     * @param yaw Rotation in radians per second.
     */
    public sendMovement(long: number, lat: number, yaw: number) {
        if (this.socket?.readyState === 1) {
            this.socket.send(JSON.stringify({
                type: MessageType.WALK,
                long: long,
                lat: lat,
                yaw: yaw
            }));
        }
    }

    /**
     * Send a hand movement command to the robot.
     * @param message The hand movement message to send.
     */
    public sendHandMovement(movement: HandMovementMessage) {
        if (this.socket?.readyState === 1) {
            this.socket.send(JSON.stringify(movement));
        }
    }

    /**
     * Unpair from a robot on the server.
     *
     * If a robot is currently paired, it will be sent a movement command to stop.
     */
    public disconnect() {
        if (this.socket?.readyState === 1) {
            this.sendMovement(0, 0, 0);
            this.socket.send(JSON.stringify({
                type: "unpair"
            }));
        }
    }

    StandUp() {
        this.sendAction(MessageType.ACTION_STAND);
    }

    SitDown() {
        this.sendAction(MessageType.ACTION_SIT);
    }

    HighStand() {
        this.sendAction(MessageType.ACTION_STAND_HIGH);
    }

    LowStand() {
        this.sendAction(MessageType.ACTION_STAND_LOW);
    }

    ZeroTorque() {
        this.sendAction(MessageType.ACTION_ZERO_TORQUE);
    }

    WaveHand() {
        this.sendAction(MessageType.ACTION_WAVE);
    }

    WaveHandTurn() {
        this.sendAction(MessageType.ACTION_WAVE_TURN);
    }

    ShakeHand() {
        this.sendAction(MessageType.ACTION_SHAKE_HAND);
    }

    StopDamp() {
        this.sendAction(MessageType.ACTION_DAMP);
    }

    Quit() {
        this.disconnect();
    }
}

/**
 * Maximum forward/backward speed in meters per second.
 */
export const FORWARD_SPEED_MAX = 0.3;
/**
 * Maximum lateral speed in meters per second.
 */
export const LATERAL_SPEED_MAX = 0.2;
/**
 * Maximum rotation speed in radians per second.
 */
export const ROTATION_SPEED_MAX = 0.6;

export enum MessageType {
    // Incoming messages
    STATUS_UPDATE = "status_update",
    PING = "ping",
    ROBOT_STATUS = "robot_status",
    // Outgoing messages
    CLIENT_TYPE = "spectacles",
    PONG = "pong",
    WALK = "walk",
    ACTION_STAND = "stand",
    ACTION_STAND_LOW = "stand_low",
    ACTION_STAND_HIGH = "stand_high",
    ACTION_SIT = "sit",
    ACTION_WAVE = "wave",
    ACTION_WAVE_TURN = "wave_turn",
    ACTION_SHAKE_HAND = "shake_hand",
    ACTION_ZERO_TORQUE = "zero_torque",
    ACTION_DAMP = "damp",
    ACTION_SQUAT_TO_STAND = "squat2stand",
    ACTION_STAND_TO_SQUAT = "stand2squat",
    ACTION_LIE_TO_STAND = "lie2stand",
    GESTURE_PINCH_DOWN = "gesture_pinch_down",
    GESTURE_PINCH_UP = "gesture_pinch_up",
    GESTURE_PINCH_STRENGTH = "gesture_pinch_strength",
    GESTURE_PALM_TAP_UP = "gesture_palm_tap_up",
    GESTURE_PALM_TAP_DOWN = "gesture_palm_tap_down",
    GESTURE_TARGETING = "gesture_targeting",
    GESTURE_GRAB_BEGIN = "gesture_grab_begin",
    GESTURE_GRAB_END = "gesture_grab_end",
    GESTURE_PHONE_IN_HAND_BEGIN = "gesture_phone_in_hand_begin",
    GESTURE_PHONE_IN_HAND_END = "gesture_phone_in_hand_end",
    HAND_MOVEMENT = "hand_movement",
}

/**
 * Pre-programmed discrete actions that the robot can perform.
 */
type ActionMessage = MessageType.ACTION_STAND | MessageType.ACTION_STAND_LOW | MessageType.ACTION_STAND_HIGH | MessageType.ACTION_SIT | MessageType.ACTION_WAVE | MessageType.ACTION_WAVE_TURN | MessageType.ACTION_SHAKE_HAND | MessageType.ACTION_ZERO_TORQUE | MessageType.ACTION_DAMP;

/**
 * A hand movement message.
 */
export class HandMovementMessage {
    readonly type: MessageType.HAND_MOVEMENT = MessageType.HAND_MOVEMENT;
    readonly handType: HandType;
    readonly timestamp: number = Date.now();
    /**
     * Array of wrist transform (4x4 matrix column-major), positions [X,Y,Z] for each finger joint, and finally the head transform (4x4 matrix row-major).
     * 
     * The order is as follows:
     * wrist, thumb-0, thumb-1, thumb-2, thumb-3, index-0, index-1, index-2, index-3, middle-0, middle-1, middle-2, middle-3, ring-0, ring-1, ring-2, ring-3, pinky-0, pinky-1, pinky-2, pinky-3, head
     */
    readonly transform: number[][];

    constructor(hand: TrackedHand, headTransform: mat4) {
        const keypoints = hand.points;
        this.handType = hand.handType;
        // Make sure we have all the keypoints.
        const missingLandmarks = allLandmarks.flat().filter(l => !keypoints.some(k => k.name === l));
        if (missingLandmarks.length > 0) {
            throw new Error(`Missing keypoints with name: ${missingLandmarks.join(", ")}`);
        }
        // First we need to transform all of the hand keypoints relative to the wrist position and (inverse) rotation
        // This way they're wrist-local coordinates as expected by URDF / Pinocchio.
        const wrist = keypoints.find(k => k.name === LandmarkName.WRIST);
        const wristPos = wrist?.position;
        const wristRot = wrist?.rotation;
        // Important to filter out the wrist and the wrist-to-fingertip landmarks provided by Snap.
        const handPositions = keypoints.filter(k => !wristLandmarks.includes(k.name as LandmarkName)).map(k => {
            const relativePos = k.position.sub(wristPos);
            const localPos = wristRot.invert().multiplyVec3(relativePos);
            return localPos;
        });
        this.transform = [
            flat(tr(wristPos, wristRot)),
            ...handPositions.map(p => flat(p)),
            flat(headTransform)
        ];
    }
}
