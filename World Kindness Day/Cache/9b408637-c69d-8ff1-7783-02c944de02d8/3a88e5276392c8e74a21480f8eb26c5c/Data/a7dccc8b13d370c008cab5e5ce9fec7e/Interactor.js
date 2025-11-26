"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DragType = exports.InteractorTriggerType = exports.TargetingMode = exports.InteractorInputType = void 0;
/**
 * Input types that discern a target interactable and translate events from their inputs
 */
var InteractorInputType;
(function (InteractorInputType) {
    InteractorInputType[InteractorInputType["None"] = 0] = "None";
    InteractorInputType[InteractorInputType["LeftHand"] = 1] = "LeftHand";
    InteractorInputType[InteractorInputType["RightHand"] = 2] = "RightHand";
    InteractorInputType[InteractorInputType["BothHands"] = 3] = "BothHands";
    InteractorInputType[InteractorInputType["Mobile"] = 4] = "Mobile";
    InteractorInputType[InteractorInputType["BtController"] = 8] = "BtController";
    InteractorInputType[InteractorInputType["CustomController"] = 16] = "CustomController";
    InteractorInputType[InteractorInputType["Mouse"] = 32] = "Mouse";
    InteractorInputType[InteractorInputType["Sync"] = 64] = "Sync";
    InteractorInputType[InteractorInputType["All"] = 63] = "All";
})(InteractorInputType || (exports.InteractorInputType = InteractorInputType = {}));
/**
 * TargetingMode is a bitflag that determines how an interactor is interacting with an interactable.
 * This is also used to determine whether a specific targeting mode can interact with an interactable.
 */
var TargetingMode;
(function (TargetingMode) {
    TargetingMode[TargetingMode["None"] = 0] = "None";
    TargetingMode[TargetingMode["Direct"] = 1] = "Direct";
    TargetingMode[TargetingMode["Indirect"] = 2] = "Indirect";
    TargetingMode[TargetingMode["Poke"] = 4] = "Poke";
    TargetingMode[TargetingMode["All"] = 7] = "All";
})(TargetingMode || (exports.TargetingMode = TargetingMode = {}));
/**
 * InteractorTriggerType is used to differentiate triggers,
 * such as a pinch and poke. For objects that only care about activation,
 * we can combine these types to make more generic functionality.
 *
 * Example:
 * The developer may want to trigger a sound effect when selected. We combine
 * both Pinch and Poke into Select so that all we have to look for is Select.
 */
var InteractorTriggerType;
(function (InteractorTriggerType) {
    InteractorTriggerType[InteractorTriggerType["None"] = 0] = "None";
    InteractorTriggerType[InteractorTriggerType["Pinch"] = 1] = "Pinch";
    InteractorTriggerType[InteractorTriggerType["Poke"] = 2] = "Poke";
    InteractorTriggerType[InteractorTriggerType["Select"] = 3] = "Select";
})(InteractorTriggerType || (exports.InteractorTriggerType = InteractorTriggerType = {}));
/**
 * DragType differentiates the type of drag vector that is being passed.
 * SixDof is used when the interactor is being moved in world space.
 * Touchpad is used when the interactor has some sort of touchpad to initiate drag events.
 */
var DragType;
(function (DragType) {
    DragType[DragType["SixDof"] = 0] = "SixDof";
    DragType[DragType["Touchpad"] = 1] = "Touchpad";
})(DragType || (exports.DragType = DragType = {}));
//# sourceMappingURL=Interactor.js.map