"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NativeLogger_1 = require("../../../../Utils/NativeLogger");
const GestureModuleProvider_1 = require("../../GestureProvider/GestureModuleProvider");
const PalmTapEvent_1 = require("../PalmTapEvent");
const PalmTapDetectorStateMachine_1 = require("./PalmTapDetectorStateMachine");
const TAG = "PalmTapDetector";
/**
 * Handles PalmTap API events with StateMachine
 */
class PalmTapDetector {
    constructor(gestureHandType) {
        this.gestureModule = (() => {
            const gestureModuleProvider = GestureModuleProvider_1.default.getInstance();
            const gestureModule = gestureModuleProvider.getModule();
            if (gestureModule === undefined) {
                throw new Error("GestureModule is undefined in PalmTapDetector");
            }
            return gestureModule;
        })();
        this.palmTapDetectorStateMachine = new PalmTapDetectorStateMachine_1.default();
        this.log = new NativeLogger_1.default(TAG);
        this.setupPalmTapApi(gestureHandType);
    }
    /**
     * returns  true if the user is currently tapping
     */
    get isTapping() {
        return this.palmTapDetectorStateMachine.isTapping();
    }
    setupPalmTapApi(gestureHandType) {
        this.log.d("Setting up palm tap api");
        try {
            this.gestureModule.getPalmTapDownEvent(gestureHandType).add(() => {
                this.log.i(`GestureModule PalmTapDownEvent: { hand type: ${gestureHandType === 0 ? "Left" : "Right"} }`);
                this.palmTapDetectorStateMachine.notifyPalmTapEvent(PalmTapEvent_1.PalmTapEventType.Down);
            });
            this.gestureModule.getPalmTapUpEvent(gestureHandType).add(() => {
                this.log.i(`GestureModule PalmTapUpEvent: { hand type: ${gestureHandType === 0 ? "Left" : "Right"} }`);
                this.palmTapDetectorStateMachine.notifyPalmTapEvent(PalmTapEvent_1.PalmTapEventType.Up);
            });
        }
        catch (error) {
            throw new Error(`Error setting up palmTap subscriptions ${error}`);
        }
    }
}
exports.default = PalmTapDetector;
//# sourceMappingURL=PalmTapDetector.js.map