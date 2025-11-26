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
exports.ContainerFrame = void 0;
var __selfType = requireType("./ContainerFrame");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const animate_1 = require("../../../Utils/animate");
const Event_1 = require("../../../Utils/Event");
const FrameInputHandler_1 = require("./modules/FrameInputHandler");
const Billboard_1 = require("../../../Components/Interaction/Billboard/Billboard");
const Interactable_1 = require("../../../Components/Interaction/Interactable/Interactable");
const InteractableManipulation_1 = require("../../../Components/Interaction/InteractableManipulation/InteractableManipulation");
const InteractionPlane_1 = require("../../../Components/Interaction/InteractionPlane/InteractionPlane");
const Interactor_1 = require("../../../Core/Interactor/Interactor");
const SyncInteractionManager_1 = require("../../../Core/SyncInteractionManager/SyncInteractionManager");
const WorldCameraFinderProvider_1 = require("../../../Providers/CameraProvider/WorldCameraFinderProvider");
const CursorControllerProvider_1 = require("../../../Providers/CursorControllerProvider/CursorControllerProvider");
const mathUtils_1 = require("../../../Utils/mathUtils");
const NativeLogger_1 = require("../../../Utils/NativeLogger");
const SyncKitBridge_1 = require("../../../Utils/SyncKitBridge");
const validate_1 = require("../../../Utils/validate");
const CursorHandler_1 = require("./modules/CursorHandler");
const HoverBehavior_1 = require("./modules/HoverBehavior");
const LabeledPinchButton_1 = require("./modules/LabeledPinchButton");
const SmoothFollow_1 = require("./modules/SmoothFollow");
const SnappableBehavior_1 = require("./modules/SnappableBehavior");
const log = new NativeLogger_1.default("ContainerFrame");
const OPACITY_TWEEN_DURATION = 0.2;
const SQUEEZE_TWEEN_DURATION = 0.4;
const DEFAULT_BACKING_ALPHA = 1;
const CAPTURE_BACKING_ALPHA = 0.1;
/*
 * use forced depth for now
 * only 2d content
 */
const scaleZ = 1;
/*
 * ratio for scaling between world space and margin space
 * testing different values here, leaving for reference during continued visdev
 * const scaleFactor = 90
 * const scaleFactor = 70
 */
const scaleFactor = 50;
// frame depth factor
const zScaleAdjuster = 15;
const CURSOR_HIGHLIGHT_ANIMATION_DURATION = 0.15;
/**
 * History of this magic number:
 * I added the frame mesh to the scene with a basic material
 * And overlayed it on a Unit Plane
 * I switched the camera to orthographic
 * And scaled up the Frame Mesh until it's edges just touched the edges of the unit plane
 * That was at scale 8.24
 * So without any stretching, the mesh is 1 / 8.24
 * 1 / 8.24 = 0.1213592233
 * And since we set the base scale of the mesh to a constant and then stretch with vertex shader
 * I multiply that base scale by this number above, to get the size of the frame that isn't stretched
 * And subtract that from the amount we need to stretch
 * ヽ(｀Д´)⊃━☆ﾟ. * ･ ｡ﾟ,
 */
const magicScalar = 0.1213592233;
/**
 * the base scale of the frame
 */
const scaleFactorVector = new vec3(scaleFactor + magicScalar, scaleFactor + magicScalar, scaleZ * zScaleAdjuster);
// the current system UI button is not unit sized
// it's closer to 2.35 in X and Y
const buttonMagicNumber = 0.4474272931;
// constant size of button
const defaultButtonSize = 3 * buttonMagicNumber;
const BUTTON_CORNER_OFFSET = 1 / scaleFactor;
const NEAR_FIELD_INTERACTION_ZONE_DISTANCE_CM = 30;
const CONTAINER_TRANSFORM_VALUE_KEY = "ContainerTransformValue";
const CONTAINER_INNER_SIZE_VALUE_KEY = "ContainerInnerSizeValue";
const CONTAINER_CONNECTION_VALUE_KEY = "ContainerConnectionValue";
const CONTAINER_INPUT_STATE_VALUE_KEY = "ContainerInputStateValue";
const DEFAULT_BILLBOARD_EASING = new vec3(0.5, 0.5, 0);
/**
 * This class represents a container frame that can hold and manage UI elements. It provides settings for auto
 * show/hide, inner size, border, constant padding, and scaling. The class uses prefabs for the frame and labeled
 * buttons, and textures for icons.
 */
let ContainerFrame = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var ContainerFrame = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.framePrefab = requireAsset("./Prefabs/FramePrefab.prefab");
            this.labeledButtonPrefab = requireAsset("./Prefabs/container-button.prefab");
            this.closeIcon = requireAsset("./Textures/close-icon-1.png");
            this.followIcon = requireAsset("./Textures/follow-white.png");
            this.unfollowIcon = requireAsset("./Textures/follow-black.png");
            /**
             * When enabled, the frame automatically appears when hovered and hides when
             * not being interacted with. Disable to manually control frame visibility.
             */
            this.autoShowHide = this.autoShowHide;
            /**
             * Size of the container's inner content area.
             */
            this.innerSize = this.innerSize;
            /**
             * Width of the border around the container.
             */
            this.border = this.border;
            /**
             * Extra padding that maintains a fixed size in centimeters regardless of frame scaling, useful for toolbars and
             * fixed-size UI elements
             */
            this.constantPadding = this.constantPadding;
            /**
             * Enables interactive scaling of the container frame via corner handles.
             */
            this.allowScaling = this.allowScaling;
            /**
             * Automatically scales child content when the frame is resized to maintain proportions.
             */
            this.autoScaleContent = this.autoScaleContent;
            /**
             * When enabled, Z-axis scaling of content will match X-axis scaling during frame resizing.
             */
            this.relativeZ = this.relativeZ;
            /**
             * When enabled, allows interaction with content inside the container and hides the container's glow for visual
             * clarity.
             */
            this.isContentInteractable = this.isContentInteractable;
            /**
             * Enables moving the container frame.
             */
            this.allowTranslation = this.allowTranslation;
            /**
             * When enabled, creates a transparent center in the frame, allowing content behind the container to be visible.
             */
            this.cutOut = this.cutOut;
            this.minimumSize = this.minimumSize;
            /**
             * Maximum dimensions in world units (cm) that the container can be resized to.
             */
            this.maximumSize = this.maximumSize;
            this.useBillboarding = this.useBillboarding;
            /**
             * When enabled, the container rotates around the X-axis to face the user, but only during movement/translation
             * unless xAlways is also enabled.
             */
            this.xOnTranslate = this.xOnTranslate;
            /**
             * When enabled, the container continuously rotates around the X-axis to face the user, regardless of movement.
             */
            this.xAlways = this.xAlways;
            /**
             * When enabled, the container rotates around the Y-axis to face the user, but only during movement/translation
             * unless yAlways is also enabled.
             */
            this.yOnTranslate = this.yOnTranslate;
            /**
             * When enabled, the container continuously rotates around the Y-axis to face the user, regardless of movement.
             */
            this.yAlways = this.yAlways;
            this.useSnapping = this.useSnapping;
            /**
             * Enables snapping to other containers when moving.
             */
            this.itemSnapping = this.itemSnapping;
            /**
             * Enables snapping to physical surfaces in the real-world environment when moving.
             */
            this.worldSnapping = this.worldSnapping;
            this.showFollowButton = this.showFollowButton;
            /**
             * When enabled, creates a follow behavior that keeps the container in front of the user's view.
             */
            this.useFOVFollow = this.useFOVFollow;
            /**
             * Controls whether the container actively follows the user's view. Setting this defines the initial state.
             */
            this.isFollowing = this.isFollowing;
            this.showCloseButton = this.showCloseButton;
            this._enableInteractionPlane = this._enableInteractionPlane;
            /**
             * Sets the preferred targeting visual. (Requires the V2 Cursor to be enabled on InteractorCursors).
             * - 0: Cursor (default)
             * - 1: Ray
             * - 2: None
             */
            this._targetingVisual = this._targetingVisual;
            this.isSynced = this.isSynced;
            this.squeezeAmount = this.border * 0.15;
            this.scalingSizeStart = null;
            this.collider = null;
            this.colliderShape = null;
            this.colliderTransform = null;
            /**
             * event for callback on follow button toggle on
             */
            this.buttonSize = defaultButtonSize;
            this.buttonScaleVector = vec3.one().uniformScale(defaultButtonSize).div(scaleFactorVector);
            this.animationManager = new animate_1.AnimationManager();
            /**
             * event handler for frame scaling update
             */
            this.onScalingUpdate = new Event_1.default();
            /**
             * event handler for frame scaling started
             */
            this.onScalingStart = new Event_1.default();
            /**
             * event handler for frame scaling ended
             */
            this.onScalingEnd = new Event_1.default();
            /**
             * public api for adding functions to the onScalingUpdate event handler
             */
            this.onScalingUpdateEvent = this.onScalingUpdate.publicApi();
            /**
             * public api for adding functions to the onScalingStart event handler
             */
            this.onScalingStartEvent = this.onScalingStart.publicApi();
            /**
             * public api for adding functions to the onScalingEnd event handler
             */
            this.onScalingEndEvent = this.onScalingEnd.publicApi();
            this.onTranslationStartEvent = new Event_1.default();
            /**
             * public api for adding functions to the onTranslationStartEvent event handler
             */
            this.onTranslationStart = this.onTranslationStartEvent.publicApi();
            this.onTranslationEndEvent = new Event_1.default();
            /**
             * public api for adding functions to the onTranslationEndEvent event handler
             */
            this.onTranslationEnd = this.onTranslationEndEvent.publicApi();
            this.onHoverEnterInnerInteractableEvent = new Event_1.default();
            this.onHoverEnterInnerInteractable = this.onHoverEnterInnerInteractableEvent.publicApi();
            this.onHoverExitInnerInteractableEvent = new Event_1.default();
            this.onHoverExitInnerInteractable = this.onHoverExitInnerInteractableEvent.publicApi();
            this.forceTranslate = false;
            this.inputState = {
                isHovered: false,
                rawHovered: false,
                isPinching: false,
                position: vec3.zero(),
                innerInteractableActive: false
            };
            this._opacity = 1;
            this.opacityCancel = new animate_1.CancelSet();
            /**
             * boolean tracking visibility of frame
             */
            this._isVisible = true;
            this.scalingLastFrame = false;
            this.translatingLastFrame = false;
            this.onMovingShrinkFactor = 0;
            this.squeezeCancel = new animate_1.CancelSet();
            this.translateMode = 0;
            this.translateModeCancel = new animate_1.CancelSet();
            this.allInteractables = [];
            this.billboardComponent = null;
            this.interactableCached = null;
            this.manipulateCached = null;
            this.renderMeshVisual = null;
            this.snapBehavior = null;
            this.currentInteractor = null;
            /**
             * public api for adding functions to the onSnappingComplete event handler
             */
            this.onSnappingComplete = null;
            /**
             * reference to world camera
             */
            this.worldCamera = WorldCameraFinderProvider_1.default.getInstance().getComponent();
            /**
             * reference to frame's default front follow behavior
             */
            this.smoothFollow = null;
            this.currentBorder = this.border;
            this.destroyed = false;
            this.hoveringInnerInteractableLast = false;
            this.interactableHoverOpacity = 0.34;
            this.backingAlphaCache = DEFAULT_BACKING_ALPHA;
            this.hoveringContentInteractable = false;
            this.hoveringContentInteractableLast = false;
            this.cursorHighlightCancel = new animate_1.CancelSet();
            this.forcePreserveScale = false;
            this.lastConstantPadding = this.constantPadding.uniformScale(1);
            // tweakable for frustum optimizations
            this.frustumBuffer = 0;
            this.unSubscribeList = [];
            // Only defined if SyncKit is present within the lens project.
            this.syncKitBridge = SyncKitBridge_1.SyncKitBridge.getInstance();
            this.syncEntity = this.isSynced ? this.syncKitBridge.createSyncEntity(this) : null;
            this._frameOffset = vec3.zero();
            this.currentPosition = null;
            this.updateCursorHighlightPosition = (e) => {
                (0, validate_1.validate)(this.colliderShape);
                (0, validate_1.validate)(this.colliderTransform);
                if (e.interactor.targetHitInfo) {
                    (0, validate_1.validate)(e.interactor.planecastPoint);
                    const hitPosition = e.interactor.planecastPoint;
                    const normalizer = vec3.one().div(this.colliderShape.size);
                    this.inputState.position = this.colliderTransform
                        .getInvertedWorldTransform()
                        .multiplyPoint(hitPosition)
                        .mult(normalizer);
                }
            };
            this.showCursorHighlight = () => {
                if (this.cursorHighlightCancel)
                    this.cursorHighlightCancel.cancel();
                const startingHighlight = this.material.mainPass.isHovered;
                (0, animate_1.default)({
                    duration: CURSOR_HIGHLIGHT_ANIMATION_DURATION * (1 - startingHighlight),
                    cancelSet: this.cursorHighlightCancel,
                    update: (t) => {
                        this.material.mainPass.isHovered = t;
                    }
                });
            };
            this.hideCursorHighlight = () => {
                if (this.cursorHighlightCancel)
                    this.cursorHighlightCancel.cancel();
                const startingHighlight = this.material.mainPass.isHovered;
                (0, animate_1.default)({
                    duration: CURSOR_HIGHLIGHT_ANIMATION_DURATION * startingHighlight,
                    cancelSet: this.cursorHighlightCancel,
                    update: (t) => {
                        this.material.mainPass.isHovered = startingHighlight - t * startingHighlight;
                    }
                });
            };
            /**
             * set diameter of buttons in centimeters
             * @param size
             */
            this.setButtonScale = (size) => {
                this.buttonSize = size * buttonMagicNumber;
                this.buttonScaleVector = vec3.one().uniformScale(this.buttonSize).div(scaleFactorVector);
                this.scaleAndPositionButtons();
            };
            this.update = () => {
                // If the SyncEntity is not ready yet in a Connected Lens, defer first update for later.
                if (this.syncKitBridge.sessionController !== undefined &&
                    this.syncEntity !== null &&
                    !this.syncEntity.isSetupFinished) {
                    this.animationManager.requestAnimationFrame(this.update);
                    return;
                }
                // If the local user is not the last user to interact with the ContainerFrame, do not billboard/follow.
                const isConnection = this.syncEntity !== null
                    ? this.syncKitBridge.sessionController.getLocalConnectionId() ===
                        this.syncEntity.currentStore.getString(CONTAINER_CONNECTION_VALUE_KEY)
                    : true;
                /// if in capture getDeltaTime returns 0
                if (getDeltaTime() === 0) {
                    // lighten background if in capture
                    if (this.backingAlpha !== CAPTURE_BACKING_ALPHA) {
                        // set directly to not update backingAlphaCache
                        this.material.mainPass.backingAlpha = CAPTURE_BACKING_ALPHA;
                    }
                }
                else {
                    //not in capture
                    if (this.backingAlpha !== this.backingAlphaCache) {
                        // reset to stored value
                        this.backingAlpha = this.backingAlphaCache;
                    }
                }
                // confirm not destroyed before looping more
                if (this.destroyed) {
                    // if destroyed return will stop looping as update requests itself
                    return;
                }
                this.inputHandler.update(this.inputState);
                // only billboard on translate
                if (this.inputHandler.state.translating) {
                    if (this.billboardComponent !== null && isConnection) {
                        this.billboardComponent.xAxisEnabled =
                            (this.xOnTranslate && (this.allowTranslation || this.forceTranslate)) || this.xAlways;
                        this.billboardComponent.yAxisEnabled =
                            (this.yOnTranslate && (this.allowTranslation || this.forceTranslate)) || this.yAlways;
                    }
                    if (!this.translatingLastFrame) {
                        // just started translating
                        const currentSqueeze = this.onMovingShrinkFactor;
                        this.tweenMarginSqueeze(currentSqueeze, this.squeezeAmount);
                        const currentTranslateMode = this.translateMode;
                        this.tweenTranslateMode(currentTranslateMode, 1);
                    }
                    this.translatingLastFrame = true;
                }
                else {
                    if (this.billboardComponent !== null && (!(this.isFollowing && isConnection) || this.xAlways || this.yAlways)) {
                        if (this.translatingLastFrame) {
                            this.currentPosition = null;
                            this.billboardComponent.resetPivotPoint();
                        }
                        this.billboardComponent.xAxisEnabled = this.xAlways;
                        this.billboardComponent.yAxisEnabled = this.yAlways;
                    }
                    if (this.translatingLastFrame) {
                        // just stopped translating
                        const currentSqueeze = this.onMovingShrinkFactor;
                        this.tweenMarginSqueeze(currentSqueeze, 0);
                        const currentTranslateMode = this.translateMode;
                        this.tweenTranslateMode(currentTranslateMode, 0);
                    }
                    this.translatingLastFrame = false;
                }
                this.currentBorder = this.border - this.onMovingShrinkFactor;
                const innerSizeChanged = !this.innerSize.equal(this.targetScaleCache);
                const borderRecalculationNeeded = this.currentBorder !== this.material.mainPass.frameMargin;
                const constantPaddingChanged = !this.constantPadding.equal(this.lastConstantPadding);
                if (innerSizeChanged || borderRecalculationNeeded || constantPaddingChanged) {
                    this.targetScaleCache.x = this.innerSize.x;
                    this.targetScaleCache.y = this.innerSize.y;
                    this.lastConstantPadding.x = this.constantPadding.x;
                    this.lastConstantPadding.y = this.constantPadding.y;
                    const isActualScaleChange = innerSizeChanged || constantPaddingChanged;
                    this.scaleFrame(isActualScaleChange);
                }
                this.inputState.innerInteractableActive =
                    this.inputState.innerInteractableActive || this.inputHandler.state.hoveringInteractable;
                if (this.inputState.innerInteractableActive && !this.hoveringInnerInteractableLast) {
                    const currentOpacity = this._opacity;
                    if (this.autoShowHide) {
                        this.tweenOpacity(currentOpacity, this.interactableHoverOpacity);
                    }
                    // start hovering inner interactable
                    this.onHoverEnterInnerInteractableEvent.invoke();
                }
                else if (!this.inputState.innerInteractableActive && this.hoveringInnerInteractableLast) {
                    const currentOpacity = this._opacity;
                    if (this.inputState.rawHovered) {
                        if (this.autoShowHide) {
                            this.tweenOpacity(currentOpacity, 1);
                        }
                    }
                    // stop hovering inner interactable
                    this.onHoverExitInnerInteractableEvent.invoke();
                }
                this.hoveringInnerInteractableLast = this.inputState.innerInteractableActive;
                this.cursorHandler.update(this.inputState, this.inputHandler.state);
                this.material.mainPass.translateMode = this.translateMode;
                if (!this.scalingLastFrame && !this.translatingLastFrame) {
                    this.material.mainPass.touchPosition = this.inputState.position;
                }
                if (this.inputHandler.state.scaling && !this.scalingLastFrame) {
                    // first frame scaling
                    this.smoothFollow?.startDragging();
                }
                if (!this.inputHandler.state.scaling && this.scalingLastFrame) {
                    // first frame NOT scaling
                    this.smoothFollow?.finishDragging();
                }
                this.scalingLastFrame = this.inputHandler.state.scaling;
                this.snapBehavior?.setScaling(this.inputHandler.state.scaling);
                if (this.inputHandler.state.translating)
                    this.snapBehavior?.update();
                if (this.isFollowing && isConnection) {
                    this.smoothFollow?.onUpdate();
                }
                if (this.syncEntity !== null && this.syncEntity.isSetupFinished) {
                    const currentConnectionId = this.syncEntity.currentStore.getString(CONTAINER_CONNECTION_VALUE_KEY);
                    // When triggering the Container, set the Container to follow that connection.
                    if (this.interactable.triggeringInteractor !== Interactor_1.InteractorInputType.None &&
                        (this.interactable.triggeringInteractor & Interactor_1.InteractorInputType.Sync) === 0) {
                        this.syncEntity.currentStore.putString(CONTAINER_CONNECTION_VALUE_KEY, this.syncKitBridge.sessionController.getLocalConnectionId());
                    }
                    if (this.syncKitBridge.sessionController.getLocalConnectionId() === currentConnectionId) {
                        const locationTransform = this.syncKitBridge.worldTransformToLocationTransform(this.parentTransform.getWorldTransform());
                        const inputStateSerialized = (0, SyncInteractionManager_1.serializeInputState)(this.inputState);
                        this.syncEntity.currentStore.putVec2(CONTAINER_INNER_SIZE_VALUE_KEY, this.innerSize);
                        this.syncEntity.currentStore.putMat4(CONTAINER_TRANSFORM_VALUE_KEY, locationTransform);
                        this.syncEntity.currentStore.putString(CONTAINER_INPUT_STATE_VALUE_KEY, JSON.stringify(inputStateSerialized));
                    }
                    else if (this.syncKitBridge.sessionController.getLocalConnectionId() !== currentConnectionId) {
                        const locationTransform = this.syncEntity.currentStore.getMat4(CONTAINER_TRANSFORM_VALUE_KEY);
                        const worldTransform = this.syncKitBridge.locationTransformToWorldTransform(locationTransform);
                        const innerSize = this.syncEntity.currentStore.getVec2(CONTAINER_INNER_SIZE_VALUE_KEY);
                        const inputStateSerialized = this.syncEntity.currentStore.getString(CONTAINER_INPUT_STATE_VALUE_KEY);
                        const inputState = (0, SyncInteractionManager_1.parseInputState)(JSON.parse(inputStateSerialized));
                        this.innerSize = innerSize;
                        this.parentTransform.setWorldTransform(worldTransform);
                        this.inputState = inputState;
                        if (this.inputState.isHovered) {
                            this.showCursorHighlight();
                        }
                        else {
                            this.hideCursorHighlight();
                        }
                    }
                }
                this.animationManager.requestAnimationFrame(this.update);
            };
            this.lateUpdate = () => {
                this.parentHoverBehavior.lateUpdate();
            };
            this.scaleFrame = (isTrueScaleUpdate = true) => {
                (0, validate_1.validate)(this.colliderShape);
                (0, validate_1.validate)(this.renderMeshVisual);
                this.material.mainPass.frameMargin = this.currentBorder;
                this.material.mainPass.scaleFactor = scaleFactor;
                const doubleMargin = this.currentBorder * 2;
                const meshEdges = scaleFactor * magicScalar;
                this.material.mainPass.scaleX = this.targetScaleCache.x + doubleMargin - meshEdges + this.constantPadding.x;
                this.material.mainPass.scaleY = this.targetScaleCache.y + doubleMargin - meshEdges + this.constantPadding.y;
                this.material.mainPass.scaleZ = scaleZ / zScaleAdjuster;
                this.material.mainPass.rawScale = new vec2(this.targetScaleCache.x + this.constantPadding.x, this.targetScaleCache.y + this.constantPadding.y);
                const fullScale = new vec2(this.targetScaleCache.x + this.constantPadding.x + doubleMargin, this.targetScaleCache.y + this.constantPadding.y + doubleMargin);
                this.material.mainPass.fullScale = new vec2(fullScale.x, fullScale.y);
                const aspectRatio = new vec2(1, 1);
                if (fullScale.x > fullScale.y) {
                    aspectRatio.y = fullScale.x / fullScale.y;
                }
                else {
                    aspectRatio.x = fullScale.y / fullScale.x;
                }
                this.material.mainPass.aspectRatio = new vec2(aspectRatio.x, aspectRatio.y);
                this.material.mainPass.originalScale = new vec2(this.originalScale.x + this.currentBorder, this.originalScale.y + this.currentBorder);
                this.colliderShape.size = new vec3((this.targetScaleCache.x + this.currentBorder * 2 + this.constantPadding.x) / scaleFactor, (this.targetScaleCache.y + this.currentBorder * 2 + this.constantPadding.y) / scaleFactor, scaleZ / zScaleAdjuster);
                this.renderMeshVisual.mainMaterial.mainPass.frustumCullMin = new vec3(this.colliderShape.size.x * -0.5 - this.frustumBuffer, this.colliderShape.size.y * -0.5 - this.frustumBuffer, this.colliderShape.size.z * -0.5);
                this.renderMeshVisual.mainMaterial.mainPass.frustumCullMax = new vec3(this.colliderShape.size.x * 0.5 + this.frustumBuffer, this.colliderShape.size.y * 0.5 + this.frustumBuffer, this.colliderShape.size.z * 0.5);
                this.inputHandler.gutterSize.x = this.currentBorder / (scaleFactor * this.colliderShape.size.x);
                this.inputHandler.gutterSize.y = this.currentBorder / (scaleFactor * this.colliderShape.size.y);
                this.scaleAndPositionButtons();
                this.frameTransform.setLocalPosition(this._frameOffset);
                this.frameTransform.setLocalRotation(quat.quatIdentity());
                this.targetTransform.setLocalPosition(new vec3(0, 0, scaleZ + 0.5));
                this.targetTransform.setLocalRotation(quat.quatIdentity());
                // Determine if onScalingUpdate should be invoked before forcePreserveScale might be reset
                const shouldInvokeScalingUpdate = !this.forcePreserveScale && isTrueScaleUpdate;
                if (this.autoScaleContent) {
                    if (!this.forcePreserveScale) {
                        const factor = this.innerSize.div(this.originalScale);
                        const z = this.relativeZ ? 1 * factor.x : 1;
                        this.targetTransform.setLocalScale(new vec3(factor.x, factor.y, z));
                    }
                    else {
                        // update original with cloned cache to prevent reset on next scaling
                        this.originalScale = this.targetScaleCache.uniformScale(1);
                    }
                }
                this.smoothFollow?.resize(this.innerSize.x + doubleMargin + this.constantPadding.x);
                if (shouldInvokeScalingUpdate) {
                    this.onScalingUpdate.invoke();
                }
                // Reset forcePreserveScale after it has been used for decisions
                if (this.forcePreserveScale) {
                    this.forcePreserveScale = false;
                }
            };
            this.scaleAndPositionButtons = () => {
                this.closeButton.transform.setLocalScale(this.buttonScaleVector);
                this.followButton.transform.setLocalScale(this.buttonScaleVector);
                const halfFrameWidth = (this.innerSize.x * 0.5 + this.constantPadding.x * 0.5 + this.currentBorder) / scaleFactor;
                const halfFrameHeight = (this.innerSize.y * 0.5 + this.constantPadding.y * 0.5 + this.currentBorder) / scaleFactor;
                const buttonOffset = (this.buttonSize / scaleFactor) * -1 - BUTTON_CORNER_OFFSET;
                // CORNER POSITIONING
                this.closeButton.transform.setLocalPosition(new vec3(-halfFrameWidth - buttonOffset, halfFrameHeight + buttonOffset, 0.1));
                this.followButton.transform.setLocalPosition(new vec3(halfFrameWidth + buttonOffset, halfFrameHeight + buttonOffset, 0.1));
            };
            /**
             * setup billboarding component with the following parameters
             * @param useBillboard
             * @param xOnTranslate
             * @param xAlways
             * @param yOnTranslate
             * @param yAlways
             */
            this.setBillboarding = (useBillboard, xOnTranslate = false, xAlways = false, yOnTranslate = false, yAlways = false) => {
                this.useBillboarding = useBillboard;
                if (this.useBillboarding) {
                    this.xOnTranslate = xOnTranslate;
                    this.xAlways = xAlways;
                    this.yOnTranslate = yOnTranslate;
                    this.yAlways = yAlways;
                    if (this.billboardComponent === null) {
                        this.billboardComponent = this.parent.createComponent(Billboard_1.Billboard.getTypeName());
                    }
                    this.billboardComponent.xAxisEnabled = this.xAlways;
                    this.billboardComponent.yAxisEnabled = this.yAlways;
                }
                else {
                    if (this.billboardComponent) {
                        this.billboardComponent.xAxisEnabled = false;
                        this.billboardComponent.yAxisEnabled = false;
                    }
                }
            };
            this.setYAlways = (yAlways) => {
                this.setBillboarding(this.useBillboarding, this.xOnTranslate, this.xAlways, this.yOnTranslate, yAlways);
            };
            this.setUseBillboarding = (useBillboarding) => {
                this.setBillboarding(useBillboarding, this.xOnTranslate, this.xAlways, this.yOnTranslate, this.yAlways);
            };
            /**
             * @returns frame's Interactable
             */
            this.getInteractable = () => {
                if (this.interactableCached === null) {
                    this.interactableCached = this.interactable;
                }
                return this.interactableCached;
            };
            /**
             * @returns frame's parent's Interactable
             */
            this.getParentInteractable = () => {
                return this.parentInteractable;
            };
            /**
             * @returns frame's InteractableManipulation
             */
            this.getInteractableManipulation = () => {
                if (this.manipulateCached === null) {
                    this.manipulateCached = this.manipulate;
                }
                return this.manipulateCached;
            };
            /**
             * @param isInteractable set if content is interactable
             */
            this.setIsContentInteractable = (isInteractable) => {
                this.isContentInteractable = isInteractable;
                this.inputHandlerOptions.isInteractable = isInteractable;
            };
            /**
             * @param isSnappable turns on or off snappableBehavior
             */
            this.setIsSnappable = (isSnappable) => {
                this.useSnapping = isSnappable;
                if (isSnappable) {
                    if (!this.snapBehavior) {
                        this.createSnappableBehavior();
                    }
                }
                if (this.snapBehavior) {
                    this.snapBehavior.isEnabled = isSnappable;
                }
            };
            this.setUseWorldSnapping = (enable) => {
                (0, validate_1.validate)(this.snapBehavior);
                this.worldSnapping = enable;
                if (!this.snapBehavior && enable) {
                    this.createSnappableBehavior();
                }
                this.snapBehavior.enableWorldSnapping(enable);
            };
            this.setUseItemSnapping = (enable) => {
                (0, validate_1.validate)(this.snapBehavior);
                this.itemSnapping = enable;
                if (!this.snapBehavior && enable) {
                    this.createSnappableBehavior();
                }
                this.snapBehavior.enableItemSnapping(enable);
            };
            this.createSnappableBehavior = () => {
                this.snapBehavior = new SnappableBehavior_1.SnappableBehavior({
                    frame: this,
                    worldSnapping: this.worldSnapping,
                    itemSnapping: this.itemSnapping
                });
                this.onSnappingComplete = this.snapBehavior.snappingComplete();
            };
            /**
             * abort snapping behavior
             */
            this.abortSnapping = () => {
                this.snapBehavior?.abortSnapping();
            };
            /**
             * @param allowScaling enable or disable user scaling
             */
            this.setAllowScaling = (allowScaling) => {
                this.allowScaling = allowScaling;
                this.inputHandler.allowScaling = this.allowScaling;
                const scaleHandles = vec4.zero();
                if (allowScaling) {
                    if (!this.showFollowButton)
                        scaleHandles.x = 1;
                    scaleHandles.y = 1;
                    scaleHandles.z = 1;
                    if (!this.showCloseButton)
                        scaleHandles.w = 1;
                }
                this.material.mainPass.scaleHandles = scaleHandles;
            };
            this.setInnerSizePreserveScale = (newSize) => {
                this.forcePreserveScale = true;
                this.innerSize = newSize;
                this._interactionPlane.planeSize = this.totalInnerSize.add(vec2.one().uniformScale(this.border * 2));
            };
            /**
             * @param useFollow enable or disable the option to turn on the default follow behavior with the follow button
             */
            this.setUseFollow = (useFollow) => {
                this.useFOVFollow = useFollow;
                if (useFollow && !this.smoothFollow) {
                    this.smoothFollow = new SmoothFollow_1.SmoothFollow({
                        frame: this
                    });
                }
            };
            /**
             * @param isFollowing enable or disable the following button and defualt behavior ( if it is enabled )
             */
            this.setIsFollowing = (isFollowing) => {
                this.isFollowing = isFollowing;
                if (this.isFollowing) {
                    if (this.billboardComponent !== null) {
                        this.billboardComponent.xAxisEnabled = (this.xOnTranslate && this.allowTranslation) || this.xAlways;
                        this.billboardComponent.yAxisEnabled = (this.yOnTranslate && this.allowTranslation) || this.yAlways;
                    }
                    this.followButton.toggled = true;
                    this.followButton.setColor("trigger");
                    this.followButton.setTexture(1);
                }
                else {
                    this.followButton.setColor("default");
                    this.followButton.toggled = false;
                    this.followButton.setTexture(0);
                }
            };
            /**
             * @returns whether the snapping behavior is currently tweening
             */
            this.isSnappingTweening = () => {
                if (this.snapBehavior) {
                    return this.snapBehavior.isTweening;
                }
                return false;
            };
            /**
             * @returns whether the snapping behavior is checking for snappable elements
             */
            this.isSnappingActive = () => {
                if (this.snapBehavior) {
                    return this.snapBehavior.isActive;
                }
                return false;
            };
            /**
             * @param isActive whether or not to activate snapping
             */
            this.setSnappingActive = (isActive) => {
                if (this.snapBehavior) {
                    this.snapBehavior.isActive = isActive;
                }
            };
            /**
             * @returns inner object which contains original children
             */
            this.getTargetObject = () => this.target;
            /**
             * @returns returns the frame sceneobject
             */
            this.getFrameObject = () => this.frame;
            /**
             * @param opacity
             * sets opacity of frame when hovering interactable content in the frame
             */
            this.setHoverInteractableOpacity = (opacity) => {
                this.interactableHoverOpacity = opacity;
            };
            /**
             * @param minimumSize set minimum scale of frame
             */
            this.setminimumSize = (minimumSize) => {
                this.inputHandler.minimumSize = minimumSize;
            };
            /**
             * @param maximumSize set maximum scale of frame
             */
            this.setmaximumSize = (maximumSize) => {
                this.inputHandler.maximumSize = maximumSize;
            };
            /**
             * @param isInteractable enable or disable interactable elements of the frame
             */
            this.enableInteractables = (isInteractable) => {
                for (let i = 0; i < this.allInteractables.length; i++) {
                    this.allInteractables[i].enabled = isInteractable;
                }
            };
            /**
             * function for fully destroying the frame
             */
            this.onDestroy = () => {
                log.d("destroy isDestroyed:" + this.destroyed);
                if (!this.destroyed) {
                    this.destroyed = true;
                    this.unSubscribeList.forEach((sub) => {
                        sub();
                    });
                    this.parentHoverBehavior.destroy();
                    this.snapBehavior?.destroy();
                    if (!isNull(this.frame)) {
                        this.frame.destroy();
                    }
                    this.enabled = false;
                }
            };
            /**
             *
             * @returns parent transform of top container object
             */
            this.getParentTransform = () => this.parentTransform;
            /**
             * tween to show visuals of frame and elements
             */
            this.showVisual = () => {
                (0, validate_1.validate)(this.renderMeshVisual);
                const currentOpacity = this._opacity;
                // enable on show
                this.renderMeshVisual.enabled = true;
                if (this.closeButton && this.showCloseButton)
                    this.closeButton.object.enabled = true;
                if (this.followButton && this.showFollowButton)
                    this.followButton.object.enabled = true;
                this.tweenOpacity(currentOpacity, 1);
            };
            /**
             * tween to hide visuals of frame and elementss
             */
            this.hideVisual = () => {
                const currentOpacity = this._opacity;
                this.tweenOpacity(currentOpacity, 0, () => {
                    // disable on hide
                    (0, validate_1.validate)(this.renderMeshVisual);
                    this.renderMeshVisual.enabled = false;
                    if (this.closeButton)
                        this.closeButton.object.enabled = false;
                    if (this.followButton)
                        this.followButton.object.enabled = false;
                });
            };
            /**
             * tween from current opacity to target opacity, will cancel existing opacity tweens
             * @param currentOpacity
             * @param targetOpacity
             */
            this.tweenOpacity = (currentOpacity, targetOpacity, endCallback = () => { }) => {
                if (this.opacityCancel)
                    this.opacityCancel.cancel();
                (0, animate_1.default)({
                    duration: OPACITY_TWEEN_DURATION * Math.abs(targetOpacity - currentOpacity),
                    update: (t) => {
                        this.opacity = (0, mathUtils_1.lerp)(currentOpacity, targetOpacity, t);
                    },
                    ended: endCallback,
                    cancelSet: this.opacityCancel
                });
            };
            /**
             * @param enabled set close button enabled or disabled
             */
            this.enableCloseButton = (enabled) => {
                this.showCloseButton = enabled;
                this.closeButton.object.enabled = enabled;
                const scaleHandles = this.material.mainPass.scaleHandles;
                scaleHandles.w = enabled && this.allowScaling ? 1 : 0;
                this.material.mainPass.scaleHandles = scaleHandles;
            };
            /**
             * @param enabled set follow button enabled or disabled
             */
            this.enableFollowButton = (enabled) => {
                this.showFollowButton = enabled;
                this.followButton.object.enabled = enabled;
                const scaleHandles = this.material.mainPass.scaleHandles;
                scaleHandles.y = enabled && this.allowScaling ? 1 : 0;
                this.material.mainPass.scaleHandles = scaleHandles;
            };
            this.tweenMarginSqueeze = (currentSqueeze, targetSqueeze) => {
                (0, animate_1.default)({
                    duration: SQUEEZE_TWEEN_DURATION,
                    easing: "ease-out-back-cubic",
                    update: (t) => {
                        this.onMovingShrinkFactor = (0, mathUtils_1.lerp)(currentSqueeze, targetSqueeze, t);
                    },
                    cancelSet: this.squeezeCancel
                });
            };
            this.tweenTranslateMode = (current, target) => {
                (0, animate_1.default)({
                    duration: SQUEEZE_TWEEN_DURATION,
                    update: (t) => {
                        this.translateMode = (0, mathUtils_1.lerp)(current, target, t);
                    },
                    cancelSet: this.translateModeCancel
                });
            };
        }
        __initialize() {
            super.__initialize();
            this.framePrefab = requireAsset("./Prefabs/FramePrefab.prefab");
            this.labeledButtonPrefab = requireAsset("./Prefabs/container-button.prefab");
            this.closeIcon = requireAsset("./Textures/close-icon-1.png");
            this.followIcon = requireAsset("./Textures/follow-white.png");
            this.unfollowIcon = requireAsset("./Textures/follow-black.png");
            /**
             * When enabled, the frame automatically appears when hovered and hides when
             * not being interacted with. Disable to manually control frame visibility.
             */
            this.autoShowHide = this.autoShowHide;
            /**
             * Size of the container's inner content area.
             */
            this.innerSize = this.innerSize;
            /**
             * Width of the border around the container.
             */
            this.border = this.border;
            /**
             * Extra padding that maintains a fixed size in centimeters regardless of frame scaling, useful for toolbars and
             * fixed-size UI elements
             */
            this.constantPadding = this.constantPadding;
            /**
             * Enables interactive scaling of the container frame via corner handles.
             */
            this.allowScaling = this.allowScaling;
            /**
             * Automatically scales child content when the frame is resized to maintain proportions.
             */
            this.autoScaleContent = this.autoScaleContent;
            /**
             * When enabled, Z-axis scaling of content will match X-axis scaling during frame resizing.
             */
            this.relativeZ = this.relativeZ;
            /**
             * When enabled, allows interaction with content inside the container and hides the container's glow for visual
             * clarity.
             */
            this.isContentInteractable = this.isContentInteractable;
            /**
             * Enables moving the container frame.
             */
            this.allowTranslation = this.allowTranslation;
            /**
             * When enabled, creates a transparent center in the frame, allowing content behind the container to be visible.
             */
            this.cutOut = this.cutOut;
            this.minimumSize = this.minimumSize;
            /**
             * Maximum dimensions in world units (cm) that the container can be resized to.
             */
            this.maximumSize = this.maximumSize;
            this.useBillboarding = this.useBillboarding;
            /**
             * When enabled, the container rotates around the X-axis to face the user, but only during movement/translation
             * unless xAlways is also enabled.
             */
            this.xOnTranslate = this.xOnTranslate;
            /**
             * When enabled, the container continuously rotates around the X-axis to face the user, regardless of movement.
             */
            this.xAlways = this.xAlways;
            /**
             * When enabled, the container rotates around the Y-axis to face the user, but only during movement/translation
             * unless yAlways is also enabled.
             */
            this.yOnTranslate = this.yOnTranslate;
            /**
             * When enabled, the container continuously rotates around the Y-axis to face the user, regardless of movement.
             */
            this.yAlways = this.yAlways;
            this.useSnapping = this.useSnapping;
            /**
             * Enables snapping to other containers when moving.
             */
            this.itemSnapping = this.itemSnapping;
            /**
             * Enables snapping to physical surfaces in the real-world environment when moving.
             */
            this.worldSnapping = this.worldSnapping;
            this.showFollowButton = this.showFollowButton;
            /**
             * When enabled, creates a follow behavior that keeps the container in front of the user's view.
             */
            this.useFOVFollow = this.useFOVFollow;
            /**
             * Controls whether the container actively follows the user's view. Setting this defines the initial state.
             */
            this.isFollowing = this.isFollowing;
            this.showCloseButton = this.showCloseButton;
            this._enableInteractionPlane = this._enableInteractionPlane;
            /**
             * Sets the preferred targeting visual. (Requires the V2 Cursor to be enabled on InteractorCursors).
             * - 0: Cursor (default)
             * - 1: Ray
             * - 2: None
             */
            this._targetingVisual = this._targetingVisual;
            this.isSynced = this.isSynced;
            this.squeezeAmount = this.border * 0.15;
            this.scalingSizeStart = null;
            this.collider = null;
            this.colliderShape = null;
            this.colliderTransform = null;
            /**
             * event for callback on follow button toggle on
             */
            this.buttonSize = defaultButtonSize;
            this.buttonScaleVector = vec3.one().uniformScale(defaultButtonSize).div(scaleFactorVector);
            this.animationManager = new animate_1.AnimationManager();
            /**
             * event handler for frame scaling update
             */
            this.onScalingUpdate = new Event_1.default();
            /**
             * event handler for frame scaling started
             */
            this.onScalingStart = new Event_1.default();
            /**
             * event handler for frame scaling ended
             */
            this.onScalingEnd = new Event_1.default();
            /**
             * public api for adding functions to the onScalingUpdate event handler
             */
            this.onScalingUpdateEvent = this.onScalingUpdate.publicApi();
            /**
             * public api for adding functions to the onScalingStart event handler
             */
            this.onScalingStartEvent = this.onScalingStart.publicApi();
            /**
             * public api for adding functions to the onScalingEnd event handler
             */
            this.onScalingEndEvent = this.onScalingEnd.publicApi();
            this.onTranslationStartEvent = new Event_1.default();
            /**
             * public api for adding functions to the onTranslationStartEvent event handler
             */
            this.onTranslationStart = this.onTranslationStartEvent.publicApi();
            this.onTranslationEndEvent = new Event_1.default();
            /**
             * public api for adding functions to the onTranslationEndEvent event handler
             */
            this.onTranslationEnd = this.onTranslationEndEvent.publicApi();
            this.onHoverEnterInnerInteractableEvent = new Event_1.default();
            this.onHoverEnterInnerInteractable = this.onHoverEnterInnerInteractableEvent.publicApi();
            this.onHoverExitInnerInteractableEvent = new Event_1.default();
            this.onHoverExitInnerInteractable = this.onHoverExitInnerInteractableEvent.publicApi();
            this.forceTranslate = false;
            this.inputState = {
                isHovered: false,
                rawHovered: false,
                isPinching: false,
                position: vec3.zero(),
                innerInteractableActive: false
            };
            this._opacity = 1;
            this.opacityCancel = new animate_1.CancelSet();
            /**
             * boolean tracking visibility of frame
             */
            this._isVisible = true;
            this.scalingLastFrame = false;
            this.translatingLastFrame = false;
            this.onMovingShrinkFactor = 0;
            this.squeezeCancel = new animate_1.CancelSet();
            this.translateMode = 0;
            this.translateModeCancel = new animate_1.CancelSet();
            this.allInteractables = [];
            this.billboardComponent = null;
            this.interactableCached = null;
            this.manipulateCached = null;
            this.renderMeshVisual = null;
            this.snapBehavior = null;
            this.currentInteractor = null;
            /**
             * public api for adding functions to the onSnappingComplete event handler
             */
            this.onSnappingComplete = null;
            /**
             * reference to world camera
             */
            this.worldCamera = WorldCameraFinderProvider_1.default.getInstance().getComponent();
            /**
             * reference to frame's default front follow behavior
             */
            this.smoothFollow = null;
            this.currentBorder = this.border;
            this.destroyed = false;
            this.hoveringInnerInteractableLast = false;
            this.interactableHoverOpacity = 0.34;
            this.backingAlphaCache = DEFAULT_BACKING_ALPHA;
            this.hoveringContentInteractable = false;
            this.hoveringContentInteractableLast = false;
            this.cursorHighlightCancel = new animate_1.CancelSet();
            this.forcePreserveScale = false;
            this.lastConstantPadding = this.constantPadding.uniformScale(1);
            // tweakable for frustum optimizations
            this.frustumBuffer = 0;
            this.unSubscribeList = [];
            // Only defined if SyncKit is present within the lens project.
            this.syncKitBridge = SyncKitBridge_1.SyncKitBridge.getInstance();
            this.syncEntity = this.isSynced ? this.syncKitBridge.createSyncEntity(this) : null;
            this._frameOffset = vec3.zero();
            this.currentPosition = null;
            this.updateCursorHighlightPosition = (e) => {
                (0, validate_1.validate)(this.colliderShape);
                (0, validate_1.validate)(this.colliderTransform);
                if (e.interactor.targetHitInfo) {
                    (0, validate_1.validate)(e.interactor.planecastPoint);
                    const hitPosition = e.interactor.planecastPoint;
                    const normalizer = vec3.one().div(this.colliderShape.size);
                    this.inputState.position = this.colliderTransform
                        .getInvertedWorldTransform()
                        .multiplyPoint(hitPosition)
                        .mult(normalizer);
                }
            };
            this.showCursorHighlight = () => {
                if (this.cursorHighlightCancel)
                    this.cursorHighlightCancel.cancel();
                const startingHighlight = this.material.mainPass.isHovered;
                (0, animate_1.default)({
                    duration: CURSOR_HIGHLIGHT_ANIMATION_DURATION * (1 - startingHighlight),
                    cancelSet: this.cursorHighlightCancel,
                    update: (t) => {
                        this.material.mainPass.isHovered = t;
                    }
                });
            };
            this.hideCursorHighlight = () => {
                if (this.cursorHighlightCancel)
                    this.cursorHighlightCancel.cancel();
                const startingHighlight = this.material.mainPass.isHovered;
                (0, animate_1.default)({
                    duration: CURSOR_HIGHLIGHT_ANIMATION_DURATION * startingHighlight,
                    cancelSet: this.cursorHighlightCancel,
                    update: (t) => {
                        this.material.mainPass.isHovered = startingHighlight - t * startingHighlight;
                    }
                });
            };
            /**
             * set diameter of buttons in centimeters
             * @param size
             */
            this.setButtonScale = (size) => {
                this.buttonSize = size * buttonMagicNumber;
                this.buttonScaleVector = vec3.one().uniformScale(this.buttonSize).div(scaleFactorVector);
                this.scaleAndPositionButtons();
            };
            this.update = () => {
                // If the SyncEntity is not ready yet in a Connected Lens, defer first update for later.
                if (this.syncKitBridge.sessionController !== undefined &&
                    this.syncEntity !== null &&
                    !this.syncEntity.isSetupFinished) {
                    this.animationManager.requestAnimationFrame(this.update);
                    return;
                }
                // If the local user is not the last user to interact with the ContainerFrame, do not billboard/follow.
                const isConnection = this.syncEntity !== null
                    ? this.syncKitBridge.sessionController.getLocalConnectionId() ===
                        this.syncEntity.currentStore.getString(CONTAINER_CONNECTION_VALUE_KEY)
                    : true;
                /// if in capture getDeltaTime returns 0
                if (getDeltaTime() === 0) {
                    // lighten background if in capture
                    if (this.backingAlpha !== CAPTURE_BACKING_ALPHA) {
                        // set directly to not update backingAlphaCache
                        this.material.mainPass.backingAlpha = CAPTURE_BACKING_ALPHA;
                    }
                }
                else {
                    //not in capture
                    if (this.backingAlpha !== this.backingAlphaCache) {
                        // reset to stored value
                        this.backingAlpha = this.backingAlphaCache;
                    }
                }
                // confirm not destroyed before looping more
                if (this.destroyed) {
                    // if destroyed return will stop looping as update requests itself
                    return;
                }
                this.inputHandler.update(this.inputState);
                // only billboard on translate
                if (this.inputHandler.state.translating) {
                    if (this.billboardComponent !== null && isConnection) {
                        this.billboardComponent.xAxisEnabled =
                            (this.xOnTranslate && (this.allowTranslation || this.forceTranslate)) || this.xAlways;
                        this.billboardComponent.yAxisEnabled =
                            (this.yOnTranslate && (this.allowTranslation || this.forceTranslate)) || this.yAlways;
                    }
                    if (!this.translatingLastFrame) {
                        // just started translating
                        const currentSqueeze = this.onMovingShrinkFactor;
                        this.tweenMarginSqueeze(currentSqueeze, this.squeezeAmount);
                        const currentTranslateMode = this.translateMode;
                        this.tweenTranslateMode(currentTranslateMode, 1);
                    }
                    this.translatingLastFrame = true;
                }
                else {
                    if (this.billboardComponent !== null && (!(this.isFollowing && isConnection) || this.xAlways || this.yAlways)) {
                        if (this.translatingLastFrame) {
                            this.currentPosition = null;
                            this.billboardComponent.resetPivotPoint();
                        }
                        this.billboardComponent.xAxisEnabled = this.xAlways;
                        this.billboardComponent.yAxisEnabled = this.yAlways;
                    }
                    if (this.translatingLastFrame) {
                        // just stopped translating
                        const currentSqueeze = this.onMovingShrinkFactor;
                        this.tweenMarginSqueeze(currentSqueeze, 0);
                        const currentTranslateMode = this.translateMode;
                        this.tweenTranslateMode(currentTranslateMode, 0);
                    }
                    this.translatingLastFrame = false;
                }
                this.currentBorder = this.border - this.onMovingShrinkFactor;
                const innerSizeChanged = !this.innerSize.equal(this.targetScaleCache);
                const borderRecalculationNeeded = this.currentBorder !== this.material.mainPass.frameMargin;
                const constantPaddingChanged = !this.constantPadding.equal(this.lastConstantPadding);
                if (innerSizeChanged || borderRecalculationNeeded || constantPaddingChanged) {
                    this.targetScaleCache.x = this.innerSize.x;
                    this.targetScaleCache.y = this.innerSize.y;
                    this.lastConstantPadding.x = this.constantPadding.x;
                    this.lastConstantPadding.y = this.constantPadding.y;
                    const isActualScaleChange = innerSizeChanged || constantPaddingChanged;
                    this.scaleFrame(isActualScaleChange);
                }
                this.inputState.innerInteractableActive =
                    this.inputState.innerInteractableActive || this.inputHandler.state.hoveringInteractable;
                if (this.inputState.innerInteractableActive && !this.hoveringInnerInteractableLast) {
                    const currentOpacity = this._opacity;
                    if (this.autoShowHide) {
                        this.tweenOpacity(currentOpacity, this.interactableHoverOpacity);
                    }
                    // start hovering inner interactable
                    this.onHoverEnterInnerInteractableEvent.invoke();
                }
                else if (!this.inputState.innerInteractableActive && this.hoveringInnerInteractableLast) {
                    const currentOpacity = this._opacity;
                    if (this.inputState.rawHovered) {
                        if (this.autoShowHide) {
                            this.tweenOpacity(currentOpacity, 1);
                        }
                    }
                    // stop hovering inner interactable
                    this.onHoverExitInnerInteractableEvent.invoke();
                }
                this.hoveringInnerInteractableLast = this.inputState.innerInteractableActive;
                this.cursorHandler.update(this.inputState, this.inputHandler.state);
                this.material.mainPass.translateMode = this.translateMode;
                if (!this.scalingLastFrame && !this.translatingLastFrame) {
                    this.material.mainPass.touchPosition = this.inputState.position;
                }
                if (this.inputHandler.state.scaling && !this.scalingLastFrame) {
                    // first frame scaling
                    this.smoothFollow?.startDragging();
                }
                if (!this.inputHandler.state.scaling && this.scalingLastFrame) {
                    // first frame NOT scaling
                    this.smoothFollow?.finishDragging();
                }
                this.scalingLastFrame = this.inputHandler.state.scaling;
                this.snapBehavior?.setScaling(this.inputHandler.state.scaling);
                if (this.inputHandler.state.translating)
                    this.snapBehavior?.update();
                if (this.isFollowing && isConnection) {
                    this.smoothFollow?.onUpdate();
                }
                if (this.syncEntity !== null && this.syncEntity.isSetupFinished) {
                    const currentConnectionId = this.syncEntity.currentStore.getString(CONTAINER_CONNECTION_VALUE_KEY);
                    // When triggering the Container, set the Container to follow that connection.
                    if (this.interactable.triggeringInteractor !== Interactor_1.InteractorInputType.None &&
                        (this.interactable.triggeringInteractor & Interactor_1.InteractorInputType.Sync) === 0) {
                        this.syncEntity.currentStore.putString(CONTAINER_CONNECTION_VALUE_KEY, this.syncKitBridge.sessionController.getLocalConnectionId());
                    }
                    if (this.syncKitBridge.sessionController.getLocalConnectionId() === currentConnectionId) {
                        const locationTransform = this.syncKitBridge.worldTransformToLocationTransform(this.parentTransform.getWorldTransform());
                        const inputStateSerialized = (0, SyncInteractionManager_1.serializeInputState)(this.inputState);
                        this.syncEntity.currentStore.putVec2(CONTAINER_INNER_SIZE_VALUE_KEY, this.innerSize);
                        this.syncEntity.currentStore.putMat4(CONTAINER_TRANSFORM_VALUE_KEY, locationTransform);
                        this.syncEntity.currentStore.putString(CONTAINER_INPUT_STATE_VALUE_KEY, JSON.stringify(inputStateSerialized));
                    }
                    else if (this.syncKitBridge.sessionController.getLocalConnectionId() !== currentConnectionId) {
                        const locationTransform = this.syncEntity.currentStore.getMat4(CONTAINER_TRANSFORM_VALUE_KEY);
                        const worldTransform = this.syncKitBridge.locationTransformToWorldTransform(locationTransform);
                        const innerSize = this.syncEntity.currentStore.getVec2(CONTAINER_INNER_SIZE_VALUE_KEY);
                        const inputStateSerialized = this.syncEntity.currentStore.getString(CONTAINER_INPUT_STATE_VALUE_KEY);
                        const inputState = (0, SyncInteractionManager_1.parseInputState)(JSON.parse(inputStateSerialized));
                        this.innerSize = innerSize;
                        this.parentTransform.setWorldTransform(worldTransform);
                        this.inputState = inputState;
                        if (this.inputState.isHovered) {
                            this.showCursorHighlight();
                        }
                        else {
                            this.hideCursorHighlight();
                        }
                    }
                }
                this.animationManager.requestAnimationFrame(this.update);
            };
            this.lateUpdate = () => {
                this.parentHoverBehavior.lateUpdate();
            };
            this.scaleFrame = (isTrueScaleUpdate = true) => {
                (0, validate_1.validate)(this.colliderShape);
                (0, validate_1.validate)(this.renderMeshVisual);
                this.material.mainPass.frameMargin = this.currentBorder;
                this.material.mainPass.scaleFactor = scaleFactor;
                const doubleMargin = this.currentBorder * 2;
                const meshEdges = scaleFactor * magicScalar;
                this.material.mainPass.scaleX = this.targetScaleCache.x + doubleMargin - meshEdges + this.constantPadding.x;
                this.material.mainPass.scaleY = this.targetScaleCache.y + doubleMargin - meshEdges + this.constantPadding.y;
                this.material.mainPass.scaleZ = scaleZ / zScaleAdjuster;
                this.material.mainPass.rawScale = new vec2(this.targetScaleCache.x + this.constantPadding.x, this.targetScaleCache.y + this.constantPadding.y);
                const fullScale = new vec2(this.targetScaleCache.x + this.constantPadding.x + doubleMargin, this.targetScaleCache.y + this.constantPadding.y + doubleMargin);
                this.material.mainPass.fullScale = new vec2(fullScale.x, fullScale.y);
                const aspectRatio = new vec2(1, 1);
                if (fullScale.x > fullScale.y) {
                    aspectRatio.y = fullScale.x / fullScale.y;
                }
                else {
                    aspectRatio.x = fullScale.y / fullScale.x;
                }
                this.material.mainPass.aspectRatio = new vec2(aspectRatio.x, aspectRatio.y);
                this.material.mainPass.originalScale = new vec2(this.originalScale.x + this.currentBorder, this.originalScale.y + this.currentBorder);
                this.colliderShape.size = new vec3((this.targetScaleCache.x + this.currentBorder * 2 + this.constantPadding.x) / scaleFactor, (this.targetScaleCache.y + this.currentBorder * 2 + this.constantPadding.y) / scaleFactor, scaleZ / zScaleAdjuster);
                this.renderMeshVisual.mainMaterial.mainPass.frustumCullMin = new vec3(this.colliderShape.size.x * -0.5 - this.frustumBuffer, this.colliderShape.size.y * -0.5 - this.frustumBuffer, this.colliderShape.size.z * -0.5);
                this.renderMeshVisual.mainMaterial.mainPass.frustumCullMax = new vec3(this.colliderShape.size.x * 0.5 + this.frustumBuffer, this.colliderShape.size.y * 0.5 + this.frustumBuffer, this.colliderShape.size.z * 0.5);
                this.inputHandler.gutterSize.x = this.currentBorder / (scaleFactor * this.colliderShape.size.x);
                this.inputHandler.gutterSize.y = this.currentBorder / (scaleFactor * this.colliderShape.size.y);
                this.scaleAndPositionButtons();
                this.frameTransform.setLocalPosition(this._frameOffset);
                this.frameTransform.setLocalRotation(quat.quatIdentity());
                this.targetTransform.setLocalPosition(new vec3(0, 0, scaleZ + 0.5));
                this.targetTransform.setLocalRotation(quat.quatIdentity());
                // Determine if onScalingUpdate should be invoked before forcePreserveScale might be reset
                const shouldInvokeScalingUpdate = !this.forcePreserveScale && isTrueScaleUpdate;
                if (this.autoScaleContent) {
                    if (!this.forcePreserveScale) {
                        const factor = this.innerSize.div(this.originalScale);
                        const z = this.relativeZ ? 1 * factor.x : 1;
                        this.targetTransform.setLocalScale(new vec3(factor.x, factor.y, z));
                    }
                    else {
                        // update original with cloned cache to prevent reset on next scaling
                        this.originalScale = this.targetScaleCache.uniformScale(1);
                    }
                }
                this.smoothFollow?.resize(this.innerSize.x + doubleMargin + this.constantPadding.x);
                if (shouldInvokeScalingUpdate) {
                    this.onScalingUpdate.invoke();
                }
                // Reset forcePreserveScale after it has been used for decisions
                if (this.forcePreserveScale) {
                    this.forcePreserveScale = false;
                }
            };
            this.scaleAndPositionButtons = () => {
                this.closeButton.transform.setLocalScale(this.buttonScaleVector);
                this.followButton.transform.setLocalScale(this.buttonScaleVector);
                const halfFrameWidth = (this.innerSize.x * 0.5 + this.constantPadding.x * 0.5 + this.currentBorder) / scaleFactor;
                const halfFrameHeight = (this.innerSize.y * 0.5 + this.constantPadding.y * 0.5 + this.currentBorder) / scaleFactor;
                const buttonOffset = (this.buttonSize / scaleFactor) * -1 - BUTTON_CORNER_OFFSET;
                // CORNER POSITIONING
                this.closeButton.transform.setLocalPosition(new vec3(-halfFrameWidth - buttonOffset, halfFrameHeight + buttonOffset, 0.1));
                this.followButton.transform.setLocalPosition(new vec3(halfFrameWidth + buttonOffset, halfFrameHeight + buttonOffset, 0.1));
            };
            /**
             * setup billboarding component with the following parameters
             * @param useBillboard
             * @param xOnTranslate
             * @param xAlways
             * @param yOnTranslate
             * @param yAlways
             */
            this.setBillboarding = (useBillboard, xOnTranslate = false, xAlways = false, yOnTranslate = false, yAlways = false) => {
                this.useBillboarding = useBillboard;
                if (this.useBillboarding) {
                    this.xOnTranslate = xOnTranslate;
                    this.xAlways = xAlways;
                    this.yOnTranslate = yOnTranslate;
                    this.yAlways = yAlways;
                    if (this.billboardComponent === null) {
                        this.billboardComponent = this.parent.createComponent(Billboard_1.Billboard.getTypeName());
                    }
                    this.billboardComponent.xAxisEnabled = this.xAlways;
                    this.billboardComponent.yAxisEnabled = this.yAlways;
                }
                else {
                    if (this.billboardComponent) {
                        this.billboardComponent.xAxisEnabled = false;
                        this.billboardComponent.yAxisEnabled = false;
                    }
                }
            };
            this.setYAlways = (yAlways) => {
                this.setBillboarding(this.useBillboarding, this.xOnTranslate, this.xAlways, this.yOnTranslate, yAlways);
            };
            this.setUseBillboarding = (useBillboarding) => {
                this.setBillboarding(useBillboarding, this.xOnTranslate, this.xAlways, this.yOnTranslate, this.yAlways);
            };
            /**
             * @returns frame's Interactable
             */
            this.getInteractable = () => {
                if (this.interactableCached === null) {
                    this.interactableCached = this.interactable;
                }
                return this.interactableCached;
            };
            /**
             * @returns frame's parent's Interactable
             */
            this.getParentInteractable = () => {
                return this.parentInteractable;
            };
            /**
             * @returns frame's InteractableManipulation
             */
            this.getInteractableManipulation = () => {
                if (this.manipulateCached === null) {
                    this.manipulateCached = this.manipulate;
                }
                return this.manipulateCached;
            };
            /**
             * @param isInteractable set if content is interactable
             */
            this.setIsContentInteractable = (isInteractable) => {
                this.isContentInteractable = isInteractable;
                this.inputHandlerOptions.isInteractable = isInteractable;
            };
            /**
             * @param isSnappable turns on or off snappableBehavior
             */
            this.setIsSnappable = (isSnappable) => {
                this.useSnapping = isSnappable;
                if (isSnappable) {
                    if (!this.snapBehavior) {
                        this.createSnappableBehavior();
                    }
                }
                if (this.snapBehavior) {
                    this.snapBehavior.isEnabled = isSnappable;
                }
            };
            this.setUseWorldSnapping = (enable) => {
                (0, validate_1.validate)(this.snapBehavior);
                this.worldSnapping = enable;
                if (!this.snapBehavior && enable) {
                    this.createSnappableBehavior();
                }
                this.snapBehavior.enableWorldSnapping(enable);
            };
            this.setUseItemSnapping = (enable) => {
                (0, validate_1.validate)(this.snapBehavior);
                this.itemSnapping = enable;
                if (!this.snapBehavior && enable) {
                    this.createSnappableBehavior();
                }
                this.snapBehavior.enableItemSnapping(enable);
            };
            this.createSnappableBehavior = () => {
                this.snapBehavior = new SnappableBehavior_1.SnappableBehavior({
                    frame: this,
                    worldSnapping: this.worldSnapping,
                    itemSnapping: this.itemSnapping
                });
                this.onSnappingComplete = this.snapBehavior.snappingComplete();
            };
            /**
             * abort snapping behavior
             */
            this.abortSnapping = () => {
                this.snapBehavior?.abortSnapping();
            };
            /**
             * @param allowScaling enable or disable user scaling
             */
            this.setAllowScaling = (allowScaling) => {
                this.allowScaling = allowScaling;
                this.inputHandler.allowScaling = this.allowScaling;
                const scaleHandles = vec4.zero();
                if (allowScaling) {
                    if (!this.showFollowButton)
                        scaleHandles.x = 1;
                    scaleHandles.y = 1;
                    scaleHandles.z = 1;
                    if (!this.showCloseButton)
                        scaleHandles.w = 1;
                }
                this.material.mainPass.scaleHandles = scaleHandles;
            };
            this.setInnerSizePreserveScale = (newSize) => {
                this.forcePreserveScale = true;
                this.innerSize = newSize;
                this._interactionPlane.planeSize = this.totalInnerSize.add(vec2.one().uniformScale(this.border * 2));
            };
            /**
             * @param useFollow enable or disable the option to turn on the default follow behavior with the follow button
             */
            this.setUseFollow = (useFollow) => {
                this.useFOVFollow = useFollow;
                if (useFollow && !this.smoothFollow) {
                    this.smoothFollow = new SmoothFollow_1.SmoothFollow({
                        frame: this
                    });
                }
            };
            /**
             * @param isFollowing enable or disable the following button and defualt behavior ( if it is enabled )
             */
            this.setIsFollowing = (isFollowing) => {
                this.isFollowing = isFollowing;
                if (this.isFollowing) {
                    if (this.billboardComponent !== null) {
                        this.billboardComponent.xAxisEnabled = (this.xOnTranslate && this.allowTranslation) || this.xAlways;
                        this.billboardComponent.yAxisEnabled = (this.yOnTranslate && this.allowTranslation) || this.yAlways;
                    }
                    this.followButton.toggled = true;
                    this.followButton.setColor("trigger");
                    this.followButton.setTexture(1);
                }
                else {
                    this.followButton.setColor("default");
                    this.followButton.toggled = false;
                    this.followButton.setTexture(0);
                }
            };
            /**
             * @returns whether the snapping behavior is currently tweening
             */
            this.isSnappingTweening = () => {
                if (this.snapBehavior) {
                    return this.snapBehavior.isTweening;
                }
                return false;
            };
            /**
             * @returns whether the snapping behavior is checking for snappable elements
             */
            this.isSnappingActive = () => {
                if (this.snapBehavior) {
                    return this.snapBehavior.isActive;
                }
                return false;
            };
            /**
             * @param isActive whether or not to activate snapping
             */
            this.setSnappingActive = (isActive) => {
                if (this.snapBehavior) {
                    this.snapBehavior.isActive = isActive;
                }
            };
            /**
             * @returns inner object which contains original children
             */
            this.getTargetObject = () => this.target;
            /**
             * @returns returns the frame sceneobject
             */
            this.getFrameObject = () => this.frame;
            /**
             * @param opacity
             * sets opacity of frame when hovering interactable content in the frame
             */
            this.setHoverInteractableOpacity = (opacity) => {
                this.interactableHoverOpacity = opacity;
            };
            /**
             * @param minimumSize set minimum scale of frame
             */
            this.setminimumSize = (minimumSize) => {
                this.inputHandler.minimumSize = minimumSize;
            };
            /**
             * @param maximumSize set maximum scale of frame
             */
            this.setmaximumSize = (maximumSize) => {
                this.inputHandler.maximumSize = maximumSize;
            };
            /**
             * @param isInteractable enable or disable interactable elements of the frame
             */
            this.enableInteractables = (isInteractable) => {
                for (let i = 0; i < this.allInteractables.length; i++) {
                    this.allInteractables[i].enabled = isInteractable;
                }
            };
            /**
             * function for fully destroying the frame
             */
            this.onDestroy = () => {
                log.d("destroy isDestroyed:" + this.destroyed);
                if (!this.destroyed) {
                    this.destroyed = true;
                    this.unSubscribeList.forEach((sub) => {
                        sub();
                    });
                    this.parentHoverBehavior.destroy();
                    this.snapBehavior?.destroy();
                    if (!isNull(this.frame)) {
                        this.frame.destroy();
                    }
                    this.enabled = false;
                }
            };
            /**
             *
             * @returns parent transform of top container object
             */
            this.getParentTransform = () => this.parentTransform;
            /**
             * tween to show visuals of frame and elements
             */
            this.showVisual = () => {
                (0, validate_1.validate)(this.renderMeshVisual);
                const currentOpacity = this._opacity;
                // enable on show
                this.renderMeshVisual.enabled = true;
                if (this.closeButton && this.showCloseButton)
                    this.closeButton.object.enabled = true;
                if (this.followButton && this.showFollowButton)
                    this.followButton.object.enabled = true;
                this.tweenOpacity(currentOpacity, 1);
            };
            /**
             * tween to hide visuals of frame and elementss
             */
            this.hideVisual = () => {
                const currentOpacity = this._opacity;
                this.tweenOpacity(currentOpacity, 0, () => {
                    // disable on hide
                    (0, validate_1.validate)(this.renderMeshVisual);
                    this.renderMeshVisual.enabled = false;
                    if (this.closeButton)
                        this.closeButton.object.enabled = false;
                    if (this.followButton)
                        this.followButton.object.enabled = false;
                });
            };
            /**
             * tween from current opacity to target opacity, will cancel existing opacity tweens
             * @param currentOpacity
             * @param targetOpacity
             */
            this.tweenOpacity = (currentOpacity, targetOpacity, endCallback = () => { }) => {
                if (this.opacityCancel)
                    this.opacityCancel.cancel();
                (0, animate_1.default)({
                    duration: OPACITY_TWEEN_DURATION * Math.abs(targetOpacity - currentOpacity),
                    update: (t) => {
                        this.opacity = (0, mathUtils_1.lerp)(currentOpacity, targetOpacity, t);
                    },
                    ended: endCallback,
                    cancelSet: this.opacityCancel
                });
            };
            /**
             * @param enabled set close button enabled or disabled
             */
            this.enableCloseButton = (enabled) => {
                this.showCloseButton = enabled;
                this.closeButton.object.enabled = enabled;
                const scaleHandles = this.material.mainPass.scaleHandles;
                scaleHandles.w = enabled && this.allowScaling ? 1 : 0;
                this.material.mainPass.scaleHandles = scaleHandles;
            };
            /**
             * @param enabled set follow button enabled or disabled
             */
            this.enableFollowButton = (enabled) => {
                this.showFollowButton = enabled;
                this.followButton.object.enabled = enabled;
                const scaleHandles = this.material.mainPass.scaleHandles;
                scaleHandles.y = enabled && this.allowScaling ? 1 : 0;
                this.material.mainPass.scaleHandles = scaleHandles;
            };
            this.tweenMarginSqueeze = (currentSqueeze, targetSqueeze) => {
                (0, animate_1.default)({
                    duration: SQUEEZE_TWEEN_DURATION,
                    easing: "ease-out-back-cubic",
                    update: (t) => {
                        this.onMovingShrinkFactor = (0, mathUtils_1.lerp)(currentSqueeze, targetSqueeze, t);
                    },
                    cancelSet: this.squeezeCancel
                });
            };
            this.tweenTranslateMode = (current, target) => {
                (0, animate_1.default)({
                    duration: SQUEEZE_TWEEN_DURATION,
                    update: (t) => {
                        this.translateMode = (0, mathUtils_1.lerp)(current, target, t);
                    },
                    cancelSet: this.translateModeCancel
                });
            };
        }
        set isVisible(isVisible) {
            this._isVisible = isVisible;
        }
        get isVisible() {
            return this._isVisible;
        }
        get interactionPlane() {
            return this._interactionPlane;
        }
        set interactionPlane(interactionPlane) {
            this._interactionPlane = interactionPlane;
        }
        onAwake() {
            // frame
            this.frame = this.framePrefab.instantiate(this.sceneObject);
            this.frameTransform = this.frame.getTransform();
            this.targetScaleCache = new vec2(this.innerSize.x, this.innerSize.y);
            this.originalScale = new vec2(this.innerSize.x, this.innerSize.y);
            // parent
            this.parent = this.getSceneObject();
            this.parentTransform = this.parent.getTransform();
            // target
            this.target = global.scene.createSceneObject("ContainerInner");
            this.targetTransform = this.target.getTransform();
            this.parent.children.forEach((child) => {
                child.setParent(this.target);
            });
            this.target.setParent(this.parent);
            // collider
            this.collider = this.frame.getComponent("Physics.ColliderComponent");
            this.colliderShape = this.collider.shape;
            this.colliderTransform = this.collider.getSceneObject().getTransform();
            // buttons
            this.closeButton = new LabeledPinchButton_1.LabeledPinchButton({
                prefab: this.labeledButtonPrefab,
                parent: this.frame,
                labels: [this.closeIcon]
            });
            this.closeButton.onTrigger.add(() => {
                this.inputState.isPinching = false;
            });
            this.followButton = new LabeledPinchButton_1.LabeledPinchButton({
                prefab: this.labeledButtonPrefab,
                parent: this.frame,
                labels: [this.followIcon, this.unfollowIcon],
                toggle: true,
                triggerColor: new vec4(0.8, 0.8, 0.8, 1)
            });
            this.followButton.setIconScale(new vec2(1.85, 1.85));
            this.followButton.onTrigger.add(() => {
                this.inputState.isPinching = false;
                this.setIsFollowing(!this.isFollowing);
            });
            // cursor
            this.cursorHandler = new CursorHandler_1.CursorHandler({
                target: this.target,
                frame: this,
                margin: this.border
            });
            // SIK Components
            this.interactable = this.frame.createComponent(Interactable_1.Interactable.getTypeName());
            /*
             * indirect targeting only with one interactor
             * prevents direct manipulation controls which are undesired for frame
             */
            this.interactable.targetingMode = Interactor_1.TargetingMode.Indirect | Interactor_1.TargetingMode.Direct;
            this.interactable.allowMultipleInteractors = false;
            this.manipulate = this.frame.createComponent(InteractableManipulation_1.InteractableManipulation.getTypeName());
            this.manipulate.setCanRotate(false);
            this.manipulate.setCanScale(false);
            this.billboardComponent = this.useBillboarding ? this.parent.createComponent(Billboard_1.Billboard.getTypeName()) : null;
            if (this.billboardComponent) {
                this.billboardComponent.axisEasing = DEFAULT_BILLBOARD_EASING;
            }
            if (this.billboardComponent !== null) {
                this.billboardComponent.xAxisEnabled = this.xAlways;
                this.billboardComponent.yAxisEnabled = this.yAlways;
            }
            // material
            this.renderMeshVisual = this.frame.getComponent("Component.RenderMeshVisual");
            this.material = this.renderMeshVisual.mainMaterial.clone();
            this.renderMeshVisual.mainMaterial = this.material;
            this.material.mainPass.frustumCullMode = FrustumCullMode.UserDefinedAABB;
            // input handler
            this.inputHandlerOptions = {
                frame: this,
                manipulate: this.manipulate,
                target: this.target,
                parentTransform: this.parentTransform,
                cursorHandler: this.cursorHandler,
                isInteractable: this.isContentInteractable,
                scaleSpeed: undefined,
                allowScaling: this.allowScaling,
                minimumSize: this.minimumSize,
                maximumSize: this.maximumSize
            };
            this.inputHandler = new FrameInputHandler_1.FrameInputHandler(this.inputHandlerOptions);
            // Use the FrameInputHandler as the authoritative source on when translation starts
            this.inputHandler.onTranslationStart.add(() => {
                this.onTranslationStartEvent.invoke();
                this.smoothFollow?.startDragging();
            });
            this.inputHandler.onTranslationEnd.add(() => {
                this.onTranslationEndEvent.invoke();
                this.smoothFollow?.finishDragging();
            });
            // button logic
            this.enableCloseButton(this.showCloseButton);
            this.enableFollowButton(this.showFollowButton);
            // following logic
            this.setIsFollowing(this.isFollowing);
            this.manipulate.setManipulateRoot(this.parentTransform);
            this.manipulate.setCanScale(false);
            this.parentTransform.setWorldPosition(this.targetTransform.getWorldPosition());
            this.parentTransform.setWorldRotation(this.targetTransform.getWorldRotation());
            this.frame.setParentPreserveWorldTransform(this.parent);
            this.frameTransform.setLocalPosition(vec3.zero());
            this.frameTransform.setLocalRotation(quat.quatIdentity());
            this.frameTransform.setWorldScale(scaleFactorVector);
            this.targetTransform.setLocalPosition(new vec3(0, 0, 0.5));
            this.targetTransform.setLocalRotation(quat.quatIdentity());
            this.opacity = this.material.mainPass.opacity;
            this.scaleFrame();
            // We need a collider or one is created. We don't actually use it for anything
            this.parentCollider = this.parent.createComponent("Physics.ColliderComponent");
            const shape = Shape.createBoxShape();
            shape.size = new vec3(0.01, 0.01, 0.01);
            this.parentCollider.shape = shape;
            this.parentInteractable = this.parent.createComponent(Interactable_1.Interactable.getTypeName());
            this.parentHoverBehavior = new HoverBehavior_1.HoverBehavior(this.parentInteractable);
            this.unSubscribeList.push(this.parentHoverBehavior.onHoverStart.add((e) => {
                this.cursorHandler.setCursor(CursorControllerProvider_1.CursorControllerProvider.getInstance().getCursorByInteractor(e.interactor));
                if (this.autoShowHide)
                    this.showVisual();
                if (this.material.mainPass.isHovered === 0) {
                    this.showCursorHighlight();
                }
                this.inputState.isHovered = true;
                this.inputState.rawHovered = true;
            }));
            this.unSubscribeList.push(this.parentHoverBehavior.onHoverUpdate.add((e) => {
                const targetObject = e?.target.sceneObject;
                this.updateCursorHighlightPosition(e);
                let targetParent = targetObject;
                let hoveringInteractable = false;
                while (targetParent !== null && !targetParent.isSame(this.sceneObject)) {
                    if (targetObject === this.target || targetParent === this.target) {
                        hoveringInteractable = true;
                        break;
                    }
                    targetParent = isNull(targetParent) ? null : targetParent.getParent();
                }
                const isNearFieldMode = (e.interactor.inputType & Interactor_1.InteractorInputType.BothHands) !== 0 &&
                    !e.interactor.isFarField();
                // hovering over interactable container content ONLY
                if (hoveringInteractable && !isNearFieldMode) {
                    if (!this.hoveringContentInteractableLast) {
                        this.hideCursorHighlight();
                    }
                }
                else {
                    if (this.hoveringContentInteractableLast) {
                        this.showCursorHighlight();
                    }
                }
                this.hoveringContentInteractableLast = hoveringInteractable;
                // hover over interactable area ( non border container ) OR interactable container content
                if (hoveringInteractable || this.inputHandler.state.hoveringInteractable) {
                    this.inputState.innerInteractableActive = true;
                }
                else {
                    this.inputState.innerInteractableActive = false;
                }
            }));
            this.unSubscribeList.push(this.parentHoverBehavior.onHoverEnd.add(() => {
                this.hoveringContentInteractableLast = false;
                if (this.autoShowHide)
                    this.hideVisual();
                if (this.material.mainPass.isHovered > 0) {
                    this.hideCursorHighlight();
                }
                this.inputState.isHovered = false;
                this.inputState.rawHovered = false;
                this.inputState.innerInteractableActive = false;
            }));
            this.unSubscribeList.push(this.interactable.onHoverUpdate.add((event) => {
                if (event.interactor.targetHitInfo) {
                    this.updateCursorHighlightPosition(event);
                    if (event.target === this.interactable)
                        this.inputHandler.lastHovered = true;
                }
            }));
            let dragStart = vec3.zero();
            this.unSubscribeList.push(this.interactable.onTriggerStart((e) => {
                if (e.interactor.targetHitInfo === null) {
                    throw new Error(`targetHitInfo of the triggering Interactor is an invalid value.`);
                }
                const initialHit = e.interactor.targetHitInfo.localHitPosition;
                const worldHitPosition = e.interactor.targetHitInfo.interactable.sceneObject
                    .getTransform()
                    .getWorldTransform()
                    .multiplyPoint(initialHit);
                // Cache the initial local hit point relative to the billboard target's transform to use as pivot point.
                if (this.billboardComponent !== null) {
                    this.billboardComponent.setPivot(this.billboardComponent.targetTransform.getInvertedWorldTransform().multiplyPoint(worldHitPosition), e.interactor);
                }
                const targetObject = e?.target.sceneObject;
                let targetParent = targetObject;
                (0, validate_1.validate)(e.interactor.planecastPoint);
                dragStart = this.parentTransform.getInvertedWorldTransform().multiplyPoint(e.interactor.planecastPoint);
                while (targetParent !== null && !targetParent.isSame(this.sceneObject)) {
                    if (targetObject === this.target || targetObject === this.frame || targetParent === this.target) {
                        this.inputState.isPinching = true;
                        this.currentInteractor = e.interactor;
                    }
                    if (targetObject === this.target || targetParent === this.target) {
                        break;
                    }
                    targetParent = targetParent?.getParent();
                }
            }));
            this.unSubscribeList.push(this.interactable.onTriggerUpdate((event) => {
                if (event.interactor.targetHitInfo && this.inputHandler.state.scaling) {
                    this.updateCursorHighlightPosition(event);
                    (0, validate_1.validate)(event.interactor.planecastPoint);
                    (0, validate_1.validate)(this.scalingSizeStart);
                    const dragPos = this.parentTransform
                        .getInvertedWorldTransform()
                        .multiplyPoint(event.interactor.planecastPoint);
                    const dragDelta = dragPos.sub(dragStart);
                    const sizeDelta = new vec2(dragDelta.x * Math.sign(dragStart.x) * 2, dragDelta.y * Math.sign(dragStart.y) * 2);
                    const dragScale = 1 + Math.max(sizeDelta.x / this.scalingSizeStart.x, sizeDelta.y / this.scalingSizeStart.y);
                    const minScale = Math.max(this.minimumSize.x / this.scalingSizeStart.x, this.minimumSize.y / this.scalingSizeStart.y);
                    const maxScale = Math.min(this.maximumSize.x / this.scalingSizeStart.x, this.maximumSize.y / this.scalingSizeStart.y);
                    this.innerSize = this.scalingSizeStart.uniformScale(MathUtils.clamp(dragScale, minScale, maxScale));
                    this._interactionPlane.planeSize = this.totalInnerSize.add(vec2.one().uniformScale(this.border * 2));
                }
            }));
            this.unSubscribeList.push(this.interactable.onTriggerEnd(() => {
                this.inputState.isPinching = false;
                this.currentInteractor = null;
            }));
            this.unSubscribeList.push(this.interactable.onTriggerEndOutside(() => {
                this.inputState.isPinching = false;
                this.currentInteractor = null;
            }));
            this.unSubscribeList.push(this.interactable.onTriggerCanceled(() => {
                this.inputState.isPinching = false;
                this.currentInteractor = null;
            }));
            if (this.useSnapping) {
                this.createSnappableBehavior();
            }
            if (this.useFOVFollow) {
                this.setUseFollow(true);
            }
            this.allInteractables.push(this.interactable);
            this.allInteractables.push(this.parentInteractable);
            const closeButton = this.closeButton.getInteractable();
            if (closeButton) {
                this.allInteractables.push(closeButton);
            }
            const followButton = this.followButton.getInteractable();
            if (followButton) {
                this.allInteractables.push(followButton);
            }
            // start hidden
            if (this.autoShowHide) {
                this.hideVisual();
            }
            else {
                this._opacity = 0;
                this.showVisual();
            }
            // handle scaling affordances
            this.setAllowScaling(this.allowScaling);
            this.cutOutCenter = this.cutOut;
            this.createEvent("OnDestroyEvent").bind(this.onDestroy);
            // hide cursorHighlight on start
            this.material.mainPass.isHovered = 0;
            this.backingAlpha = this.material.mainPass.backingAlpha;
            this._interactionPlane = this.sceneObject.createComponent(InteractionPlane_1.InteractionPlane.getTypeName());
            this._interactionPlane.planeSize = this.totalInnerSize.add(vec2.one().uniformScale(this.border * 2));
            this._interactionPlane.proximityDistance = NEAR_FIELD_INTERACTION_ZONE_DISTANCE_CM;
            this._interactionPlane.targetingVisual = this._targetingVisual;
            this._interactionPlane.enabled = this.enableInteractionPlane;
            this.createEvent("LateUpdateEvent").bind(this.lateUpdate);
            if (this.syncEntity !== null) {
                this.syncEntity.notifyOnReady(this.setupConnectionCallbacks.bind(this));
            }
            this.update();
        }
        set enableInteractionPlane(enabled) {
            this._interactionPlane.enabled = enabled;
            this._enableInteractionPlane = enabled;
        }
        get enableInteractionPlane() {
            return this._enableInteractionPlane;
        }
        /**
         * @input cutOut:boolean
         * enable or disable graphical cutout of center of container
         * useful for content behind the container in z space
         */
        set cutOutCenter(cutOut) {
            this.cutOut = cutOut;
            this.material.mainPass.cutOutCenter = cutOut ? 1 : 0;
        }
        /**
         * returns if center is cutout
         */
        get cutOutCenter() {
            return this.cutOut;
        }
        setupConnectionCallbacks() {
            if (this.syncEntity.currentStore.getAllKeys().find((key) => {
                return key === CONTAINER_TRANSFORM_VALUE_KEY;
            })) {
                const locationTransform = this.syncEntity.currentStore.getMat4(CONTAINER_TRANSFORM_VALUE_KEY);
                const worldTransform = this.syncKitBridge.locationTransformToWorldTransform(locationTransform);
                const innerSize = this.syncEntity.currentStore.getVec2(CONTAINER_INNER_SIZE_VALUE_KEY);
                const inputStateSerialized = this.syncEntity.currentStore.getString(CONTAINER_INPUT_STATE_VALUE_KEY);
                const inputState = (0, SyncInteractionManager_1.parseInputState)(JSON.parse(inputStateSerialized));
                this.parentTransform.setWorldTransform(worldTransform);
                this.innerSize = innerSize;
                this.inputState = inputState;
            }
            else {
                const locationTransform = this.syncKitBridge.worldTransformToLocationTransform(this.parentTransform.getWorldTransform());
                const inputStateSerialized = (0, SyncInteractionManager_1.serializeInputState)(this.inputState);
                this.syncEntity.currentStore.putVec2(CONTAINER_INNER_SIZE_VALUE_KEY, this.innerSize);
                this.syncEntity.currentStore.putMat4(CONTAINER_TRANSFORM_VALUE_KEY, locationTransform);
                this.syncEntity.currentStore.putString(CONTAINER_CONNECTION_VALUE_KEY, this.syncKitBridge.sessionController.getLocalConnectionId());
                this.syncEntity.currentStore.putString(CONTAINER_INPUT_STATE_VALUE_KEY, JSON.stringify(inputStateSerialized));
            }
        }
        /**
         * @returns vec2 of the total size of the container, including constant padding
         */
        get totalInnerSize() {
            return new vec2(this.innerSize.x + this.constantPadding.x, this.innerSize.y + this.constantPadding.y);
        }
        /*
         *
         * worldTransform api
         *
         */
        /**
         * @returns current world position of frame
         */
        get worldPosition() {
            return this.parentTransform.getWorldPosition();
        }
        /**
         * @param position sets current world position of frame
         */
        set worldPosition(position) {
            this.parentTransform.setWorldPosition(position);
        }
        /**
         * Gets current world position of frame
         * @returns {vec3}
         */
        getWorldPosition() {
            return this.parentTransform.getWorldPosition();
        }
        /**
         * @param position sets current world position of frame
         */
        setWorldPosition(position) {
            this.parentTransform.setWorldPosition(position);
        }
        /**
         * @returns current local position of frame
         */
        get localPosition() {
            return this.parentTransform.getLocalPosition();
        }
        /**
         * @param position sets current local position of frame
         */
        set localPosition(position) {
            this.parentTransform.setLocalPosition(position);
        }
        /**
         * @returns current local position of frame
         */
        getLocalPosition() {
            return this.parentTransform.getLocalPosition();
        }
        /**
         * @param position sets current local position of frame
         */
        setLocalPosition(position) {
            this.parentTransform.setLocalPosition(position);
        }
        /**
         * @returns current world rotation of frame
         */
        get worldRotation() {
            return this.parentTransform.getWorldRotation();
        }
        /**
         * @param rotation sets current local position of frame
         */
        set worldRotation(rotation) {
            this.parentTransform.setWorldRotation(rotation);
        }
        /**
         * @returns current world rotation of frame
         */
        getWorldRotation() {
            return this.parentTransform.getWorldRotation();
        }
        /**
         * @param rotation sets current local position of frame
         */
        setWorldRotation(rotation) {
            this.parentTransform.setWorldRotation(rotation);
        }
        /**
         * @returns current local rotation of frame
         */
        get localRotation() {
            return this.parentTransform.getLocalRotation();
        }
        /**
         * @param rotation set current local rotation of frame
         */
        set localRotation(rotation) {
            this.parentTransform.setLocalRotation(rotation);
        }
        /**
         * @returns current local rotation of frame
         */
        getLocalRotation() {
            return this.parentTransform.getLocalRotation();
        }
        /**
         * @param rotation set current local rotation of frame
         */
        setLocalRotation(rotation) {
            this.parentTransform.setLocalRotation(rotation);
        }
        /**
         * @returns current world scale of frame
         */
        get worldScale() {
            return this.parentTransform.getWorldScale();
        }
        /**
         * @param scale set current world scale of frame
         */
        set worldScale(scale) {
            this.parentTransform.setWorldScale(scale);
        }
        /**
         * @returns current world scale of frame
         */
        get localScale() {
            return this.parentTransform.getLocalScale();
        }
        /**
         * @param scale set current local scale of frame
         */
        set localScale(scale) {
            this.parentTransform.setLocalScale(scale);
        }
        /**
         * @returns current renderOrder for the renderMeshVisual of the frame itself
         */
        get renderOrder() {
            (0, validate_1.validate)(this.renderMeshVisual);
            return this.renderMeshVisual.getRenderOrder();
        }
        /**
         * @param renderOrder sets renderOrder for the renderMeshVisual of the frame itself
         */
        set renderOrder(renderOrder) {
            (0, validate_1.validate)(this.renderMeshVisual);
            this.renderMeshVisual.setRenderOrder(renderOrder);
            this.closeButton.setRenderOrder(renderOrder);
            this.followButton.setRenderOrder(renderOrder);
        }
        /**
         * @returns ContainerFrame frame sceneObject
         */
        get object() {
            return this.frame;
        }
        /**
         * @param opacity sets opacity for all frame elements
         * note this parameter is effected by calls to `showVisual` and `hideVisual`
         */
        set opacity(opacity) {
            if (opacity > 0) {
                this.isVisible = true;
            }
            else {
                this.isVisible = false;
            }
            if (!this.destroyed) {
                this._opacity = opacity;
                this.material.mainPass.opacity = opacity;
                this.closeButton.setAlpha(opacity);
                this.followButton.setAlpha(opacity);
            }
        }
        /**
         * @returns current opacity of frame elements
         */
        get opacity() {
            return this._opacity;
        }
        /**
         * @param alpha sets alpha of the glass border of the frame
         */
        set borderAlpha(alpha) {
            if (!this.destroyed) {
                this.material.mainPass.borderAlpha = alpha;
            }
        }
        /**
         * @returns alpha of the glass border of the frame
         */
        get borderAlpha() {
            return this.material.mainPass.borderAlpha;
        }
        /**
         * @param alpha sets alpha of the dark backing effect of the frame
         */
        set backingAlpha(alpha) {
            if (!this.destroyed) {
                this.backingAlphaCache = alpha;
                this.material.mainPass.backingAlpha = alpha;
            }
        }
        /**
         * @returns alpha of the dark backing effect of the frame
         */
        get backingAlpha() {
            return this.material.mainPass.backingAlpha;
        }
        /**
         * @param frameOffset the offset of the frame visual from the parent object
         */
        set frameOffset(frameOffset) {
            this._frameOffset = frameOffset;
            this.frameTransform.setLocalPosition(this._frameOffset);
        }
        /**
         * @returns the offset of the frame visual from the parent object
         */
        get frameOffset() {
            return this._frameOffset;
        }
    };
    __setFunctionName(_classThis, "ContainerFrame");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ContainerFrame = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ContainerFrame = _classThis;
})();
exports.ContainerFrame = ContainerFrame;
//# sourceMappingURL=ContainerFrame.js.map