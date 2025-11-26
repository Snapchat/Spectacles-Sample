"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CursorHandler = exports.CursorModes = void 0;
const InteractorCursor_1 = require("../../../../Components/Interaction/InteractorCursor/InteractorCursor");
const validate_1 = require("../../../../Utils/validate");
var CursorModes;
(function (CursorModes) {
    CursorModes[CursorModes["auto"] = 0] = "auto";
    CursorModes[CursorModes["scaleTlBr"] = 1] = "scaleTlBr";
    CursorModes[CursorModes["scaleTrBl"] = 2] = "scaleTrBl";
    CursorModes[CursorModes["translate"] = 3] = "translate";
})(CursorModes || (exports.CursorModes = CursorModes = {}));
class CursorHandler {
    constructor(options) {
        this.options = options;
        /**
         *
         * Manages custom cursor states
         * used for indicating contextual functionality
         * swaps textures
         * animates effects
         *
         */
        /**
         * mode is used to select the current active texture
         * updated in ContainerFrame update loop to match the FrameInputController state
         */
        this.mode = InteractorCursor_1.CursorMode.Auto;
        this.lastMode = this.mode;
        this.target = this.options.target;
        this.targetTransform = this.target.getTransform();
        this.frame = this.options.frame;
        this.parentTransform = this.frame.object?.getTransform();
        this.lockMode = false;
        this.lockPosition = vec3.zero();
        this.margin = this.options.margin;
        this.interactorCursor = null;
        this._enabled = false;
        /**
         * update
         * @param inputState
         * @param frameState
         *
         * method called in main loop
         * watches for changed CursorModes to swap textures
         * updates position and triggers animations
         */
        this.update = (inputState, frameState) => {
            if (!this.interactorCursor) {
                return;
            }
            (0, validate_1.validate)(this.parentTransform);
            if (this.lockMode) {
                const ogScale = this.parentTransform.getWorldScale();
                const tempScale = new vec3(this.frame.innerSize.x + this.frame.constantPadding.x + this.frame.border * 2, this.frame.innerSize.y + this.frame.constantPadding.y + this.frame.border * 2, 1);
                this.parentTransform.setWorldScale(tempScale);
                const tempWorld = this.parentTransform.getWorldTransform();
                const lockedPosition = tempWorld.multiplyPoint(this.lockPosition);
                this.parentTransform.setWorldScale(ogScale);
                this.interactorCursor.cursorPosition = lockedPosition;
            }
            else {
                // use default position, without override
                this.interactorCursor.cursorPosition = null;
            }
            // prevent switching to translate while over inner interactables
            if (!inputState.isHovered) {
                this.mode = InteractorCursor_1.CursorMode.Auto;
            }
            // handle switching cursors
            if (this.mode !== this.lastMode && !this.lockMode) {
                this.interactorCursor.cursorMode = this.mode;
                this.lastMode = this.mode;
            }
            if (frameState.scaling && !this.lockMode) {
                this.lockMode = true;
                this.lockPosition = inputState.position;
            }
            if (!frameState.scaling && this.lockMode) {
                this.lockMode = false;
                this.resetCursor();
            }
        };
        this.interactorCursor = options.interactorCursor ?? null;
    }
    /**
     * sets current position of cursor
     * ignored if cursor is in lockMode
     */
    set position(pos) {
        if (!this.lockMode && this.interactorCursor) {
            this.interactorCursor.cursorPosition = pos;
        }
    }
    /**
     * Sets the InteractorCursor for the handler to control.
     * @param cursor
     */
    setCursor(cursor) {
        if (this.interactorCursor !== cursor && this.interactorCursor) {
            this.resetCursor();
        }
        this.interactorCursor = cursor;
    }
    /**
     * Reset the position override & mode of the interactor cursor.
     */
    resetCursor() {
        if (this.interactorCursor) {
            this.interactorCursor.cursorMode = InteractorCursor_1.CursorMode.Auto;
            this.interactorCursor.cursorPosition = null;
        }
        this.lastMode = InteractorCursor_1.CursorMode.Auto;
        this.mode = InteractorCursor_1.CursorMode.Auto;
    }
}
exports.CursorHandler = CursorHandler;
//# sourceMappingURL=CursorHandler.js.map