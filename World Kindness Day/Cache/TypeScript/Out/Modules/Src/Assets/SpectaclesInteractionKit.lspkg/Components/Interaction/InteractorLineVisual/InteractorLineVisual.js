"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractorLineVisual = void 0;
var __selfType = requireType("./InteractorLineVisual");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const Interactor_1 = require("../../../Core/Interactor/Interactor");
const animate_1 = require("../../../Utils/animate");
const color_1 = require("../../../Utils/color");
const InteractorLineRenderer_1 = require("./InteractorLineRenderer");
const InteractionManager_1 = require("../../../Core/InteractionManager/InteractionManager");
const WorldCameraFinderProvider_1 = require("../../../Providers/CameraProvider/WorldCameraFinderProvider");
const FADE_DURATION_SECS = 0.21;
/**
 * @deprecated No longer recommended for use in new projects.
 * This class provides visual representation for interactor lines. It allows customization of the line's material,
 * colors, width, length, and visual style. The class integrates with the InteractionManager and
 * WorldCameraFinderProvider to manage interactions and camera positioning.
 */
let InteractorLineVisual = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var InteractorLineVisual = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.camera = WorldCameraFinderProvider_1.default.getInstance();
            this.interactionManager = InteractionManager_1.InteractionManager.getInstance();
            /**
             * The material used to render the interactor line visual. Can be set to InteractorLineMaterial.
             */
            this.lineMaterial = this.lineMaterial;
            /**
             * The color at the start (origin) of the interactor line visual.
             */
            this._beginColor = this._beginColor;
            /**
             * The color at the end (target) of the interactor line visual.
             */
            this._endColor = this._endColor;
            /**
             * The width of the interactor line visual.
             */
            this.lineWidth = this.lineWidth;
            /**
             * The default length of the interactor line visual. Controls how far the ray extends when not targeting any
             * object.
             */
            this.lineLength = this.lineLength;
            /**
             * Controls the visual style of the interactor line:
             * 0: Full: Renders a continuous line from start to end.
             * 1: Split: Creates a segmented line with gaps between sections.
             * 2: FadedEnd: Gradually fades out the line toward its end point.
             */
            this.lineStyle = this.lineStyle;
            /**
             * When enabled, makes the interactor line 'stick' to targeted Interactables by pointing directly at them when the
             * user interacts with them.
             */
            this.shouldStick = this.shouldStick;
            /**
             * Reference to the Interactor component that this line will visualize. The line visual appears only when the
             * referenced interactor is using Indirect targeting mode and is actively targeting.
             */
            this._interactor = this._interactor;
            this._enabled = true;
            this.isShown = false;
            this.animationCancelSet = new animate_1.CancelSet();
            this.defaultScale = new vec3(1, 1, 1);
            this.maxLength = 500;
        }
        __initialize() {
            super.__initialize();
            this.camera = WorldCameraFinderProvider_1.default.getInstance();
            this.interactionManager = InteractionManager_1.InteractionManager.getInstance();
            /**
             * The material used to render the interactor line visual. Can be set to InteractorLineMaterial.
             */
            this.lineMaterial = this.lineMaterial;
            /**
             * The color at the start (origin) of the interactor line visual.
             */
            this._beginColor = this._beginColor;
            /**
             * The color at the end (target) of the interactor line visual.
             */
            this._endColor = this._endColor;
            /**
             * The width of the interactor line visual.
             */
            this.lineWidth = this.lineWidth;
            /**
             * The default length of the interactor line visual. Controls how far the ray extends when not targeting any
             * object.
             */
            this.lineLength = this.lineLength;
            /**
             * Controls the visual style of the interactor line:
             * 0: Full: Renders a continuous line from start to end.
             * 1: Split: Creates a segmented line with gaps between sections.
             * 2: FadedEnd: Gradually fades out the line toward its end point.
             */
            this.lineStyle = this.lineStyle;
            /**
             * When enabled, makes the interactor line 'stick' to targeted Interactables by pointing directly at them when the
             * user interacts with them.
             */
            this.shouldStick = this.shouldStick;
            /**
             * Reference to the Interactor component that this line will visualize. The line visual appears only when the
             * referenced interactor is using Indirect targeting mode and is actively targeting.
             */
            this._interactor = this._interactor;
            this._enabled = true;
            this.isShown = false;
            this.animationCancelSet = new animate_1.CancelSet();
            this.defaultScale = new vec3(1, 1, 1);
            this.maxLength = 500;
        }
        /**
         * Sets whether the visual can be shown, so developers can show/hide the ray in certain parts of their lens.
         */
        set isEnabled(isEnabled) {
            this._enabled = isEnabled;
        }
        /**
         * Gets whether the visual is active (can be shown if hand is in frame and we're in far field targeting mode).
         */
        get isEnabled() {
            return this._enabled;
        }
        /**
         * Sets how the visuals for the line drawer should be shown.
         */
        set visualStyle(style) {
            this.line.visualStyle = style;
        }
        /**
         * Gets the current visual style.
         */
        get visualStyle() {
            return this.line.visualStyle;
        }
        /**
         * Sets the color of the visual from the start.
         */
        set beginColor(color) {
            this.line.startColor = (0, color_1.withAlpha)(color, 1);
        }
        /**
         * Gets the color of the visual from the start.
         */
        get beginColor() {
            return (0, color_1.withoutAlpha)(this.line.startColor);
        }
        /**
         * Sets the color of the visual from the end.
         */
        set endColor(color) {
            this.line.endColor = (0, color_1.withAlpha)(color, 1);
        }
        /**
         * Gets the color of the visual from the end.
         */
        get endColor() {
            return (0, color_1.withoutAlpha)(this.line.endColor);
        }
        onAwake() {
            this.transform = this.sceneObject.getTransform();
            this.defaultScale = this.transform.getWorldScale();
            this.line = new InteractorLineRenderer_1.default({
                material: this.lineMaterial,
                points: [vec3.zero(), vec3.up().uniformScale(this.maxLength)],
                startColor: (0, color_1.withAlpha)(this._beginColor, 1),
                endColor: (0, color_1.withAlpha)(this._endColor, 1),
                startWidth: this.lineWidth,
                endWidth: this.lineWidth
            });
            this.line.getSceneObject().setParent(this.sceneObject);
            if (this.lineStyle !== undefined) {
                this.line.visualStyle = this.lineStyle;
            }
            if (this.lineLength && this.lineLength > 0) {
                this.defaultScale = new vec3(1, this.lineLength / this.maxLength, 1);
            }
            this.showVisual(false);
            this.defineScriptEvents();
        }
        defineScriptEvents() {
            this.createEvent("OnEnableEvent").bind(() => {
                this.isEnabled = true;
            });
            this.createEvent("OnDisableEvent").bind(() => {
                this.isEnabled = false;
            });
            this.createEvent("UpdateEvent").bind(() => {
                this.update();
            });
            this.createEvent("OnDestroyEvent").bind(() => {
                this.onDestroy();
            });
        }
        showVisual(isShown) {
            if (this.isShown === isShown) {
                return;
            }
            this.isShown = isShown;
            this.animationCancelSet();
            (0, animate_1.default)({
                cancelSet: this.animationCancelSet,
                duration: FADE_DURATION_SECS,
                easing: "ease-out-cubic",
                update: (t) => {
                    this.line.opacity = isShown ? t : 1 - t;
                }
            });
        }
        rotationFromOrthogonal(right, up, fwd) {
            const vec3to4 = (v3) => new vec4(v3.x, v3.y, v3.z, 0);
            const rotationMatrix = new mat4();
            rotationMatrix.column0 = vec3to4(right);
            rotationMatrix.column1 = vec3to4(up);
            rotationMatrix.column2 = vec3to4(fwd);
            return quat.fromEulerVec(rotationMatrix.extractEulerAngles());
        }
        /**
         * Calculates the world scale of the line visual, if distance is valid (greater than the minimum distance to show the visual).
         * If an item is targeted directly and the distance is valid, returns a vec3 representing the ray scaled to the distance to the target.
         * If an item is targeted indirectly, returns the default scale so as not to throw the user off.
         * Otherwise, returns default scale if no item is targeted, or null if the distance is not valid.
         */
        getScale() {
            const distance = this.interactor?.distanceToTarget ?? null;
            if (distance === null) {
                return this.defaultScale;
            }
            return this.interactor?.activeTargetingMode === Interactor_1.TargetingMode.Direct || this.shouldStick
                ? new vec3(1, distance / this.maxLength, 1)
                : this.defaultScale;
        }
        /**
         * Updates the line visual each frame
         */
        update() {
            if (this.interactor === null ||
                !this.isEnabled ||
                !this.interactor.enabled ||
                this.interactor.activeTargetingMode !== Interactor_1.TargetingMode.Indirect ||
                !this.interactor.isTargeting()) {
                this.showVisual(false);
                return;
            }
            this.updateActiveCursor();
        }
        /**
         * Moves and rotates cursor based on locus and direction updates
         * Scales cursor length to nearest interactable if it is being hit
         */
        updateActiveCursor() {
            if (!this.interactor) {
                return;
            }
            // Hide ray if the scale is below the minimum distance, or if locus/direction aren't provided.
            const distanceScale = this.getScale();
            const locus = this.interactor.startPoint;
            let direction = this.interactor.direction;
            if (distanceScale === null || locus === null || direction === null) {
                this.showVisual(false);
                return;
            }
            this.transform.setWorldPosition(locus);
            this.transform.setWorldScale(distanceScale);
            if (this.shouldStick && (Interactor_1.InteractorTriggerType.Select & this.interactor.currentTrigger) !== 0) {
                const target = this.interactor.currentInteractable;
                if (target) {
                    const targetPos = target.sceneObject.getTransform().getWorldPosition();
                    direction = targetPos.sub(locus).normalize();
                }
            }
            // Create rotation from orthogonal vectors & set world rotation
            const locusToCamera = this.camera.getWorldPosition().sub(locus).normalize();
            const newRight = direction.cross(locusToCamera).normalize();
            const newForward = newRight.cross(direction);
            this.transform.setWorldRotation(this.rotationFromOrthogonal(newRight, direction, newForward));
            this.showVisual(true);
        }
        /**
         * Destroys cursor & line renderer when the custom component is destroyed.
         */
        onDestroy() {
            this.line.destroy();
            this.sceneObject.destroy();
        }
        get interactor() {
            return this._interactor ?? null;
        }
    };
    __setFunctionName(_classThis, "InteractorLineVisual");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        InteractorLineVisual = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return InteractorLineVisual = _classThis;
})();
exports.InteractorLineVisual = InteractorLineVisual;
//# sourceMappingURL=InteractorLineVisual.js.map