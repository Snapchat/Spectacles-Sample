"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CursorViewModel = exports.CursorInteractor = exports.CursorState = void 0;
const InteractableManipulation_1 = require("../../../Components/Interaction/InteractableManipulation/InteractableManipulation");
const InteractionManager_1 = require("../../../Core/InteractionManager/InteractionManager");
const Interactor_1 = require("../../../Core/Interactor/Interactor");
const WorldCameraFinderProvider_1 = require("../../../Providers/CameraProvider/WorldCameraFinderProvider");
const HandInputData_1 = require("../../../Providers/HandInputData/HandInputData");
const InteractionConfigurationProvider_1 = require("../../../Providers/InteractionConfigurationProvider/InteractionConfigurationProvider");
const animate_1 = require("../../../Utils/animate");
const Event_1 = require("../../../Utils/Event");
const NativeLogger_1 = require("../../../Utils/NativeLogger");
const OneEuroFilter_1 = require("../../../Utils/OneEuroFilter");
const StateMachine_1 = require("../../../Utils/StateMachine");
const ScrollView_1 = require("../../UI/ScrollView/ScrollView");
var CursorState;
(function (CursorState) {
    CursorState["Inactive"] = "Inactive";
    CursorState["Idle"] = "Idle";
    CursorState["Hovering"] = "Hovering";
    CursorState["Manipulating"] = "Manipulating";
    CursorState["Scrolling"] = "Scrolling";
})(CursorState || (exports.CursorState = CursorState = {}));
var CursorInteractor;
(function (CursorInteractor) {
    CursorInteractor[CursorInteractor["Primary"] = 0] = "Primary";
    CursorInteractor[CursorInteractor["Secondary"] = 1] = "Secondary";
})(CursorInteractor || (exports.CursorInteractor = CursorInteractor = {}));
const DEFAULT_INITIAL_DISTANCE = 160;
const MIN_DISTANCE = 15;
const DEFAULT_MANIPULATE_STRENGTH = 1;
const DEFAULT_HOVER_ANIMATE_DURATION_SECONDS = 0.2;
const DEFAULT_IDLE_ANIMATE_DURATION_SECONDS = 0.7;
const DEFAULT_NEAR_FIELD_SCALE = 0.4;
const DEFAULT_MID_FIELD_SCALE = 0.8;
const DEFAULT_FAR_FIELD_SCALE = 1.2;
const DEFAULT_NEAR_FIELD_THRESHOLD_CM = 70;
const DEFAULT_MID_FIELD_THRESHOLD_CM = 130;
const DEFAULT_FAR_FIELD_THRESHOLD_CM = 200;
const DEFAULT_CURSOR_JUMP_ANIMATE_DURATION_SECONDS = 0.1;
const DEFAULT_CURSOR_FILTER = {
    frequency: 60,
    dcutoff: 0.16,
    minCutoff: 0.5,
    beta: 0.2
};
const TAG = "CursorViewModel";
/**
 * ViewModel for the InteractorCursor that uses a StateMachine to keep track of cursor updates & state changes.
 */
class CursorViewModel {
    constructor(enableCursorHolding, enableFilter, _interactor) {
        this.enableCursorHolding = enableCursorHolding;
        this.enableFilter = enableFilter;
        this._interactor = _interactor;
        this.interactionConfigurationProvider = InteractionConfigurationProvider_1.InteractionConfigurationProvider.getInstance();
        this.camera = WorldCameraFinderProvider_1.default.getInstance();
        // Native Logging
        this.log = new NativeLogger_1.default(TAG);
        this.stateMachine = new StateMachine_1.default("CursorViewModel");
        this.handProvider = HandInputData_1.HandInputData.getInstance();
        this.interactionManager = InteractionManager_1.InteractionManager.getInstance();
        this.onStateChangeEvent = new Event_1.default();
        this.onStateChange = this.onStateChangeEvent.publicApi();
        this.onCursorUpdateEvent = new Event_1.default();
        this.onCursorUpdate = this.onCursorUpdateEvent.publicApi();
        this._cursorPosition = null;
        this.currentInteractableUnsubscribeCallback = null;
        this.currentInteractable = null;
        this.currentManipulation = null;
        this.isScrolling = false;
        this.cursorDistance = DEFAULT_INITIAL_DISTANCE;
        // Jump to targeting position rather than hit point position.
        this.cursorJumpCancelSet = new animate_1.CancelSet();
        this.distanceCancelSet = new animate_1.CancelSet();
        this.isAnimating = false;
        this.scrollView = null;
        // Allows the developer to set position manually, setting to null whenever the developer wants to resume default behavior.
        this.positionOverride = null;
        /**
         * Currently using a one-euro filter optimized for reducing slow speed jitter.
         */
        this.filter = new OneEuroFilter_1.OneEuroFilterVec3(DEFAULT_CURSOR_FILTER);
        // Tracks if the outline circle should hold around the inner circle or if it should move indepedently.
        this.useHitPosition = true;
        this.cursorJumpLerpValue = 0;
        // If passing an Interactor within the constructor, ensure the Interactor callbacks are setup correctly.
        if (_interactor !== undefined) {
            this.setInteractor(_interactor);
        }
        this.setupStateMachine();
    }
    destroy() {
        this.stateMachine.destroy();
    }
    setInteractor(interactor) {
        if (this.currentInteractableUnsubscribeCallback !== null) {
            this.currentInteractableUnsubscribeCallback();
            this.currentInteractableUnsubscribeCallback = null;
        }
        this._interactor = interactor;
        this.currentInteractableUnsubscribeCallback =
            this.interactor?.onCurrentInteractableChanged.add((interactable) => {
                this.currentInteractable = interactable;
                this.currentManipulation =
                    interactable !== null ? interactable.sceneObject.getComponent(InteractableManipulation_1.InteractableManipulation.getTypeName()) : null;
                this.isScrolling = interactable !== null ? this.checkScrollable(interactable.sceneObject) : false;
            }) ?? null;
    }
    get interactor() {
        return this._interactor ?? null;
    }
    get cursorPosition() {
        return this._cursorPosition;
    }
    setupStateMachine() {
        this.stateMachine.addState({
            name: CursorState.Inactive,
            onEnter: () => {
                this.onStateChangeEvent.invoke(CursorState.Inactive);
                // If we enter the inactive state due to direct targeting, set the cursor distance to be closer to hand for post-direct interaction.
                const isDirect = this.interactor !== null && this.interactor.activeTargetingMode === Interactor_1.TargetingMode.Direct;
                this.cursorDistance = isDirect ? MIN_DISTANCE : DEFAULT_INITIAL_DISTANCE;
            },
            transitions: [
                {
                    nextStateName: CursorState.Idle,
                    checkOnUpdate: () => {
                        return (this.checkVisibleTargetingState() && this.interactor?.currentInteractable === null) ?? false;
                    }
                },
                {
                    nextStateName: CursorState.Hovering,
                    // If the interactor targets an object on the first frame of being active, jump immediately to the object to avoid jumpy cursor.
                    checkOnUpdate: () => {
                        return this.checkVisibleTargetingState() && this.interactor?.currentInteractable !== null;
                    }
                }
            ]
        });
        this.stateMachine.addState({
            name: CursorState.Idle,
            onEnter: () => {
                this.onStateChangeEvent.invoke(CursorState.Idle);
                // When entering idle state with no Interactable target, lerp to the default distance
                const distance = Math.max(this.cursorDistance, MIN_DISTANCE);
                this.animateCursorDistance(distance, "ease-in-out-cubic", DEFAULT_IDLE_ANIMATE_DURATION_SECONDS);
            },
            onUpdate: () => {
                const position = this.getFarFieldCursorPosition();
                this.updateIndirectCursorPosition(this.interactor?.interactionStrength ?? null, position);
            },
            transitions: [
                {
                    nextStateName: CursorState.Inactive,
                    checkOnUpdate: () => {
                        return !this.interactor || !this.checkVisibleTargetingState();
                    }
                },
                {
                    nextStateName: CursorState.Hovering,
                    checkOnUpdate: () => {
                        return this.interactor?.currentInteractable !== null;
                    },
                    // Lerp to the targeted Interactable when transitioning to hover state
                    onExecution: () => {
                        const origin = this.interactor?.startPoint ?? null;
                        const hitPosition = this.interactor?.targetHitPosition ?? null;
                        if (origin === null || hitPosition === null) {
                            return;
                        }
                        const distance = origin.distance(hitPosition);
                        this.animateCursorDistance(distance, "linear", DEFAULT_HOVER_ANIMATE_DURATION_SECONDS);
                    }
                }
            ]
        });
        this.stateMachine.addState({
            name: CursorState.Hovering,
            onEnter: () => {
                this.onStateChangeEvent.invoke(CursorState.Hovering);
            },
            onUpdate: () => {
                // Cancel the animation if a trigger happens mid-animation
                if (this.isAnimating && this.interactor?.currentTrigger !== Interactor_1.InteractorTriggerType.None) {
                    this.cancelAnimation();
                }
                if (!this.isAnimating) {
                    if (!this.interactor || !this.interactor.startPoint) {
                        return;
                    }
                    this.cursorDistance =
                        this.interactor?.targetHitInfo?.hit.position.distance(this.interactor.startPoint) ?? this.cursorDistance;
                }
                // Get the cursor's position based on the hit data of the Interactor and its trigger state.
                const hitPosition = this.getHitPointCursorPosition();
                // Get the cursor's position along the targeting ray, which differs from the hit position if
                // the Interactor is in a triggering state and has moved far enough away from the initial hit position.
                const targetingPosition = this.getTargetingPointCursorPosition(hitPosition) ?? hitPosition;
                this.updateIndirectCursorPosition(this.interactor?.interactionStrength ?? null, targetingPosition);
            },
            transitions: [
                {
                    nextStateName: CursorState.Inactive,
                    checkOnUpdate: () => {
                        return !this.interactor || !this.checkVisibleTargetingState();
                    }
                },
                {
                    nextStateName: CursorState.Idle,
                    checkOnUpdate: () => {
                        return !this.interactor?.currentInteractable;
                    }
                },
                {
                    nextStateName: CursorState.Manipulating,
                    checkOnUpdate: () => {
                        return this.interactor?.currentTrigger !== Interactor_1.InteractorTriggerType.None && this.currentManipulation !== null;
                    }
                },
                {
                    nextStateName: CursorState.Scrolling,
                    checkOnUpdate: () => {
                        return (this.interactor?.currentTrigger !== Interactor_1.InteractorTriggerType.None && (this.scrollView?.isDragging ?? false));
                    }
                }
            ],
            onExit: () => {
                this.cancelAnimation();
            }
        });
        this.stateMachine.addState({
            name: CursorState.Manipulating,
            onEnter: () => this.onStateChangeEvent.invoke(CursorState.Manipulating),
            onUpdate: () => {
                /**
                 * We were showing the cursor held to center as a visual feedback if line is disabled,
                 * But we disabled this by default in LAF-3485.
                 */
                this.updateIndirectCursorPosition(DEFAULT_MANIPULATE_STRENGTH, this.getHitPointCursorPosition());
            },
            transitions: [
                {
                    nextStateName: CursorState.Inactive,
                    checkOnUpdate: () => {
                        return !this.interactor || !this.checkVisibleTargetingState();
                    }
                },
                {
                    nextStateName: CursorState.Idle,
                    checkOnUpdate: () => {
                        return !this.interactor?.currentInteractable;
                    }
                },
                {
                    nextStateName: CursorState.Hovering,
                    checkOnUpdate: () => {
                        return this.interactor?.currentTrigger === Interactor_1.InteractorTriggerType.None;
                    }
                }
            ]
        });
        this.stateMachine.addState({
            name: CursorState.Scrolling,
            onEnter: () => this.onStateChangeEvent.invoke(CursorState.Scrolling),
            onUpdate: () => {
                const planecastPosition = this.getPlanecastCursorPosition();
                this.updateIndirectCursorPosition(this.interactor?.interactionStrength ?? null, planecastPosition);
            },
            transitions: [
                {
                    nextStateName: CursorState.Inactive,
                    checkOnUpdate: () => {
                        return !this.interactor || !this.checkVisibleTargetingState();
                    }
                },
                {
                    nextStateName: CursorState.Idle,
                    checkOnUpdate: () => {
                        return (!this.interactor?.currentInteractable ||
                            // If the planecasted point is not within the ScrollView's bounds, immediately switch to Idle to avoid a flicker.
                            (!this.checkPlanecastWithinScrollView() && this.interactor?.currentTrigger === Interactor_1.InteractorTriggerType.None));
                    }
                },
                {
                    nextStateName: CursorState.Hovering,
                    checkOnUpdate: () => {
                        return this.interactor?.currentTrigger === Interactor_1.InteractorTriggerType.None;
                    }
                }
            ]
        });
        this.stateMachine.enterState(CursorState.Inactive);
    }
    /**
     * Returns the position of the cursor after checking the Interactor's trigger state.
     * @param hitPointPosition - the hit point position of the Interactor.
     * @returns the position of the cursor along the targeting ray.
     */
    getTargetingPointCursorPosition(hitPointPosition) {
        if (!this.interactor.currentInteractable || !hitPointPosition) {
            return null;
        }
        const isTriggering = (this.interactor.currentTrigger & Interactor_1.InteractorTriggerType.Select) !== 0;
        const wasTriggering = (this.interactor.previousTrigger & Interactor_1.InteractorTriggerType.Select) !== 0;
        const targetingPosition = this.getFarFieldCursorPosition() ?? hitPointPosition;
        if (isTriggering && !wasTriggering) {
            this.useHitPosition = true;
            this.cursorJumpCancelSet();
            this.cursorJumpLerpValue = 0;
        }
        else if (isTriggering && wasTriggering) {
            const initialHold = this.useHitPosition &&
                !(hitPointPosition.distance(targetingPosition) >= 2 || !this.interactor?.isHoveringCurrentInteractable);
            if (this.useHitPosition !== initialHold) {
                this.useHitPosition = initialHold;
                (0, animate_1.default)({
                    cancelSet: this.cursorJumpCancelSet,
                    duration: DEFAULT_CURSOR_JUMP_ANIMATE_DURATION_SECONDS,
                    update: (t) => {
                        this.cursorJumpLerpValue = MathUtils.lerp(0, 1, t);
                    }
                });
            }
        }
        return !this.interactor?.currentInteractable?.keepHoverOnTrigger
            ? vec3.lerp(hitPointPosition, targetingPosition, this.cursorJumpLerpValue)
            : null;
    }
    getPlanecastCursorPosition() {
        if (this.interactor === null) {
            this.log.d("Cursor failed to get planecast position due to null interactor, and will return null.");
            return null;
        }
        const position = this.interactor.planecastPoint;
        return position;
    }
    checkPlanecastWithinScrollView() {
        const cursorPos = this.getPlanecastCursorPosition();
        if (cursorPos === null) {
            return false;
        }
        return (this.scrollView?.getSceneObject()?.getComponent("Component.ScreenTransform")?.containsWorldPoint(cursorPos) ??
            false);
    }
    /**
     * Calculates the position of the cursor based on the center of the targeting ray.
     * @returns the position of the cursor, or null if not applicable
     */
    getFarFieldCursorPosition() {
        const origin = this.interactor?.startPoint ?? null;
        const direction = this.interactor?.direction ?? null;
        if (this.interactor === null || origin === null || direction === null) {
            this.log.d("Cursor failed to get far field position due to null interactor, origin, or direction, and will return null.");
            return null;
        }
        const position = origin.add(direction.uniformScale(this.cursorDistance));
        return position;
    }
    /**
     * Returns the held cursor position, where it's stuck to the center of target when currently selecting, or the hit position otherwise.
     * @returns the position of the held cursor, with the regular far field cursor position or null as a fallback if the target hit position cannot be found.
     */
    getHitPointCursorPosition() {
        let position = null;
        if (!this.interactor) {
            return null;
        }
        const isTriggering = (this.interactor.currentTrigger & Interactor_1.InteractorTriggerType.Select) !== 0;
        const wasTriggering = (this.interactor.previousTrigger & Interactor_1.InteractorTriggerType.Select) !== 0;
        if (isTriggering) {
            // While triggering, ensuring that the initial local position is maintained.
            position =
                this.interactor?.currentInteractable?.sceneObject
                    .getTransform()
                    .getWorldTransform()
                    .multiplyPoint(this.interactor?.targetHitInfo?.localHitPosition ?? vec3.zero()) ?? null;
        }
        else if (wasTriggering && !isTriggering) {
            // On the frame that the Interactor stops triggering, maintain the same cursor position as previous frame to account for targeting changes.
            position = this.cursorPosition;
        }
        if (position) {
            return position;
        }
        else {
            return this.getFarFieldCursorPosition();
        }
    }
    shouldFilter() {
        return (this.enableFilter &&
            ((this.interactor && (this.interactor.inputType & Interactor_1.InteractorInputType.BothHands) !== 0) ?? false));
    }
    // Animates the cursor to move to a certain distance using easing functions
    animateCursorDistance(distance, easing, duration) {
        // Ensure only one thing is modifying the cursor distance at a time
        this.distanceCancelSet.cancel();
        this.isAnimating = true;
        const initialDistance = this.cursorDistance;
        (0, animate_1.default)({
            cancelSet: this.distanceCancelSet,
            duration: duration,
            update: (t) => {
                this.cursorDistance = MathUtils.lerp(initialDistance, distance, t);
            },
            ended: () => {
                this.isAnimating = false;
            },
            easing: easing
        });
    }
    /**
     * Cancel the existing animation and set the isAnimating boolean to false,
     * allowing other functions ({@link getFarFieldCursorPosition} and {@link getHitPointCursorPosition})
     * to modify {@link cursorDistance} to jump the cursor to the Interactable object
     */
    cancelAnimation() {
        this.distanceCancelSet.cancel();
        this.isAnimating = false;
    }
    // Check if interacted item is within a ScrollView
    checkScrollable(sceneObject) {
        if (sceneObject === null) {
            return false;
        }
        const interactable = this.interactionManager.getInteractableBySceneObject(sceneObject);
        if (interactable !== null && interactable.isScrollable) {
            this.scrollView = sceneObject.getComponent(ScrollView_1.ScrollView.getTypeName());
            if (this.scrollView !== null) {
                return this.scrollView.contentLength > this.scrollView.scrollAreaSize.y;
            }
        }
        return this.checkScrollable(sceneObject.getParent());
    }
    /**
     * When in indirect interaction mode while targeting an Interactable,
     * positions to interaction hit point if snapping.
     * If there is no origin, then hide the cursor instead.
     */
    updateIndirectCursorPosition(interactionStrength, position) {
        if (position !== null) {
            position = this.shouldFilter() ? this.filter.filter(position, getTime()) : position;
            if (!this.isAnimating) {
                this.cursorDistance = this.interactor?.startPoint?.distance(position) ?? this.cursorDistance;
            }
            this._cursorPosition = this.positionOverride ?? position;
            const isTriggering = (this.interactor.currentTrigger & Interactor_1.InteractorTriggerType.Select) !== 0;
            const wasTriggering = (this.interactor.previousTrigger & Interactor_1.InteractorTriggerType.Select) !== 0;
            if (!isTriggering && wasTriggering) {
                this.useHitPosition = true;
            }
            this.onCursorUpdateEvent.invoke({
                cursorEnabled: true,
                cursorData: {
                    position: this.cursorPosition,
                    interactionStrength: interactionStrength ?? null,
                    isTriggering: this.interactor?.currentTrigger !== Interactor_1.InteractorTriggerType.None,
                    scale: this.calculateCursorScale()
                },
                lineEnabled: false
            });
        }
    }
    // Check if the interactor is not in a state that should hide the cursor (poke or direct), as well as if the interactor is active/targeting.
    checkVisibleTargetingState() {
        if (this.interactor?.enabled) {
            // If the interactor is targeting via direct pinch or poke (but not necessarily near field mode due to no plane), hide the cursor.
            const isVisibleTargetingMode = (this.interactor.activeTargetingMode & (Interactor_1.TargetingMode.Poke | Interactor_1.TargetingMode.Direct | Interactor_1.TargetingMode.None)) === 0;
            // If the cursor is tied to a HandInteractor, hide the cursor when in near field mode
            const isNotNearField = (this.interactor.inputType & Interactor_1.InteractorInputType.BothHands) === 0 ||
                this.interactor.isFarField();
            return (((isVisibleTargetingMode && isNotNearField) || (this.interactor.inputType & Interactor_1.InteractorInputType.Mouse) !== 0) &&
                this.interactor.isActive() &&
                this.interactor.isTargeting());
        }
        return false;
    }
    calculateCursorScale() {
        if (this.cursorDistance > DEFAULT_FAR_FIELD_THRESHOLD_CM) {
            return DEFAULT_FAR_FIELD_SCALE;
        }
        else if (this.cursorDistance > DEFAULT_MID_FIELD_THRESHOLD_CM &&
            this.cursorDistance <= DEFAULT_FAR_FIELD_THRESHOLD_CM) {
            const scaleDifference = DEFAULT_FAR_FIELD_SCALE - DEFAULT_MID_FIELD_SCALE;
            const t = MathUtils.remap(this.cursorDistance, DEFAULT_MID_FIELD_THRESHOLD_CM, DEFAULT_FAR_FIELD_THRESHOLD_CM, 0, 1);
            return DEFAULT_MID_FIELD_SCALE + scaleDifference * t;
        }
        else if (this.cursorDistance > DEFAULT_NEAR_FIELD_THRESHOLD_CM &&
            this.cursorDistance <= DEFAULT_MID_FIELD_THRESHOLD_CM) {
            const scaleDifference = DEFAULT_MID_FIELD_SCALE - DEFAULT_NEAR_FIELD_SCALE;
            const t = MathUtils.remap(this.cursorDistance, DEFAULT_NEAR_FIELD_THRESHOLD_CM, DEFAULT_MID_FIELD_THRESHOLD_CM, 0, 1);
            return DEFAULT_NEAR_FIELD_SCALE + scaleDifference * t;
        }
        else {
            return DEFAULT_NEAR_FIELD_SCALE;
        }
    }
}
exports.CursorViewModel = CursorViewModel;
//# sourceMappingURL=CursorViewModel.js.map