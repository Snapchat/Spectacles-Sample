"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapLandmarkToFinger = exports.Hands = exports.Fingers = exports.stubLandmarks = exports.allLandmarks = exports.pinkyLandmarks = exports.ringLandmarks = exports.midLandmarks = exports.indexLandmarks = exports.thumbLandmarks = exports.wristLandmarks = exports.THUMB_TIP = exports.THUMB_BASE = exports.PINKY_TIP = exports.PINKY_BASE = exports.RING_TIP = exports.RING_BASE = exports.MIDDLE_TIP = exports.MIDDLE_BASE = exports.INDEX_TIP = exports.INDEX_BASE = exports.LandmarkName = void 0;
/**
 * A handy list of Landmark Names
 */
var LandmarkName;
(function (LandmarkName) {
    LandmarkName["INDEX_0"] = "index-0";
    LandmarkName["INDEX_1"] = "index-1";
    LandmarkName["INDEX_2"] = "index-2";
    LandmarkName["INDEX_3"] = "index-3";
    LandmarkName["MIDDLE_0"] = "mid-0";
    LandmarkName["MIDDLE_1"] = "mid-1";
    LandmarkName["MIDDLE_2"] = "mid-2";
    LandmarkName["MIDDLE_3"] = "mid-3";
    LandmarkName["RING_0"] = "ring-0";
    LandmarkName["RING_1"] = "ring-1";
    LandmarkName["RING_2"] = "ring-2";
    LandmarkName["RING_3"] = "ring-3";
    LandmarkName["PINKY_0"] = "pinky-0";
    LandmarkName["PINKY_1"] = "pinky-1";
    LandmarkName["PINKY_2"] = "pinky-2";
    LandmarkName["PINKY_3"] = "pinky-3";
    LandmarkName["THUMB_0"] = "thumb-0";
    LandmarkName["THUMB_1"] = "thumb-1";
    LandmarkName["THUMB_2"] = "thumb-2";
    LandmarkName["THUMB_3"] = "thumb-3";
    LandmarkName["WRIST"] = "wrist";
    LandmarkName["WRIST_TO_THUMB"] = "wrist_to_thumb";
    LandmarkName["WRIST_TO_INDEX"] = "wrist_to_index";
    LandmarkName["WRIST_TO_MIDDLE"] = "wrist_to_mid";
    LandmarkName["WRIST_TO_RING"] = "wrist_to_ring";
    LandmarkName["WRIST_TO_PINKY"] = "wrist_to_pinky";
})(LandmarkName || (exports.LandmarkName = LandmarkName = {}));
exports.INDEX_BASE = LandmarkName.INDEX_0;
exports.INDEX_TIP = LandmarkName.INDEX_3;
exports.MIDDLE_BASE = LandmarkName.MIDDLE_0;
exports.MIDDLE_TIP = LandmarkName.MIDDLE_3;
exports.RING_BASE = LandmarkName.RING_0;
exports.RING_TIP = LandmarkName.RING_3;
exports.PINKY_BASE = LandmarkName.PINKY_0;
exports.PINKY_TIP = LandmarkName.PINKY_3;
exports.THUMB_BASE = LandmarkName.THUMB_0;
exports.THUMB_TIP = LandmarkName.THUMB_3;
exports.wristLandmarks = [
    LandmarkName.WRIST,
    LandmarkName.WRIST_TO_INDEX,
    LandmarkName.WRIST_TO_MIDDLE,
    LandmarkName.WRIST_TO_PINKY,
    LandmarkName.WRIST_TO_RING,
    LandmarkName.WRIST_TO_THUMB
];
exports.thumbLandmarks = [LandmarkName.THUMB_3, LandmarkName.THUMB_2, LandmarkName.THUMB_1, LandmarkName.THUMB_0];
exports.indexLandmarks = [LandmarkName.INDEX_3, LandmarkName.INDEX_2, LandmarkName.INDEX_1, LandmarkName.INDEX_0];
exports.midLandmarks = [LandmarkName.MIDDLE_3, LandmarkName.MIDDLE_2, LandmarkName.MIDDLE_1, LandmarkName.MIDDLE_0];
exports.ringLandmarks = [LandmarkName.RING_3, LandmarkName.RING_2, LandmarkName.RING_1, LandmarkName.RING_0];
exports.pinkyLandmarks = [LandmarkName.PINKY_3, LandmarkName.PINKY_2, LandmarkName.PINKY_1, LandmarkName.PINKY_0];
exports.allLandmarks = [exports.thumbLandmarks, exports.indexLandmarks, exports.midLandmarks, exports.ringLandmarks, exports.pinkyLandmarks];
exports.stubLandmarks = [
    LandmarkName.INDEX_0,
    LandmarkName.MIDDLE_0,
    LandmarkName.RING_0,
    LandmarkName.PINKY_0,
    LandmarkName.THUMB_0,
    LandmarkName.WRIST
];
var Fingers;
(function (Fingers) {
    Fingers["INDEX"] = "INDEX";
    Fingers["THUMB"] = "THUMB";
    Fingers["MIDDLE"] = "MIDDLE";
    Fingers["PINKY"] = "PINKY";
    Fingers["RING"] = "RING";
})(Fingers || (exports.Fingers = Fingers = {}));
var Hands;
(function (Hands) {
    Hands["RIGHT"] = "RIGHT";
    Hands["LEFT"] = "LEFT";
})(Hands || (exports.Hands = Hands = {}));
exports.mapLandmarkToFinger = {};
exports.mapLandmarkToFinger[LandmarkName.THUMB_0] = Fingers.THUMB;
exports.mapLandmarkToFinger[LandmarkName.THUMB_1] = Fingers.THUMB;
exports.mapLandmarkToFinger[LandmarkName.THUMB_2] = Fingers.THUMB;
exports.mapLandmarkToFinger[LandmarkName.THUMB_3] = Fingers.THUMB;
exports.mapLandmarkToFinger[LandmarkName.INDEX_0] = Fingers.INDEX;
exports.mapLandmarkToFinger[LandmarkName.INDEX_1] = Fingers.INDEX;
exports.mapLandmarkToFinger[LandmarkName.INDEX_2] = Fingers.INDEX;
exports.mapLandmarkToFinger[LandmarkName.INDEX_3] = Fingers.INDEX;
exports.mapLandmarkToFinger[LandmarkName.MIDDLE_0] = Fingers.MIDDLE;
exports.mapLandmarkToFinger[LandmarkName.MIDDLE_1] = Fingers.MIDDLE;
exports.mapLandmarkToFinger[LandmarkName.MIDDLE_2] = Fingers.MIDDLE;
exports.mapLandmarkToFinger[LandmarkName.MIDDLE_3] = Fingers.MIDDLE;
exports.mapLandmarkToFinger[LandmarkName.RING_0] = Fingers.RING;
exports.mapLandmarkToFinger[LandmarkName.RING_1] = Fingers.RING;
exports.mapLandmarkToFinger[LandmarkName.RING_2] = Fingers.RING;
exports.mapLandmarkToFinger[LandmarkName.RING_3] = Fingers.RING;
exports.mapLandmarkToFinger[LandmarkName.PINKY_0] = Fingers.PINKY;
exports.mapLandmarkToFinger[LandmarkName.PINKY_1] = Fingers.PINKY;
exports.mapLandmarkToFinger[LandmarkName.PINKY_2] = Fingers.PINKY;
exports.mapLandmarkToFinger[LandmarkName.PINKY_3] = Fingers.PINKY;
//# sourceMappingURL=LandmarkNames.js.map