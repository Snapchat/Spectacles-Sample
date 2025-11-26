"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TouchRayProvider = void 0;
const WorldCameraFinderProvider_1 = require("../../Providers/CameraProvider/WorldCameraFinderProvider");
/**
 * Constructs the {@link RaycastInfo} from the cursor position after a touch event has happened.
 */
class TouchRayProvider {
    constructor(script, maxRayDistance) {
        this.raycastInfo = null;
        this.cursorPosition = null;
        this.camera = WorldCameraFinderProvider_1.default.getInstance();
        script.createEvent("TouchStartEvent").bind(this.onTouchStartEvent.bind(this));
        script.createEvent("TouchMoveEvent").bind(this.onTouchMoveEvent.bind(this));
        script.createEvent("TouchEndEvent").bind(this.onTouchEndEvent.bind(this));
        script.createEvent("HoverEvent").bind(this.onHoverEvent.bind(this));
        script.createEvent("UpdateEvent").bind(() => {
            if (this.cursorPosition === null) {
                this.raycastInfo = null;
            }
            else {
                const locus = this.camera.screenSpaceToWorldSpace(this.cursorPosition.x, this.cursorPosition.y, 0);
                const direction = this.camera
                    .screenSpaceToWorldSpace(this.cursorPosition.x, this.cursorPosition.y, maxRayDistance)
                    .sub(locus)
                    .normalize();
                this.raycastInfo = {
                    locus: locus,
                    direction: direction
                };
            }
        });
    }
    /** @inheritdoc */
    getRaycastInfo() {
        return (this.raycastInfo ?? {
            direction: vec3.zero(),
            locus: vec3.zero()
        });
    }
    /** @inheritdoc */
    isAvailable() {
        return this.cursorPosition !== null;
    }
    /** @inheritdoc */
    reset() { }
    onTouchStartEvent(ev) {
        this.cursorPosition = ev.getTouchPosition();
    }
    onTouchMoveEvent(ev) {
        this.cursorPosition = ev.getTouchPosition();
    }
    onTouchEndEvent(ev) {
        this.cursorPosition = ev.getTouchPosition();
    }
    onHoverEvent(ev) {
        this.cursorPosition = ev.getHoverPosition();
    }
}
exports.TouchRayProvider = TouchRayProvider;
//# sourceMappingURL=TouchRayProvider.js.map