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
exports.HandInteractor = exports.MINIMUM_PINCH_STRENGTH = exports.FieldTargetingMode = void 0;
var __selfType = requireType("./HandInteractor");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const Interactable_1 = require("../../Components/Interaction/Interactable/Interactable");
const WorldCameraFinderProvider_1 = require("../../Providers/CameraProvider/WorldCameraFinderProvider");
const HandInputData_1 = require("../../Providers/HandInputData/HandInputData");
const Event_1 = require("../../Utils/Event");
const validate_1 = require("../../Utils/validate");
const BaseInteractor_1 = require("../Interactor/BaseInteractor");
const DirectTargetProvider_1 = require("../Interactor/DirectTargetProvider");
const DragProvider_1 = require("../Interactor/DragProvider");
const HandRayProvider_1 = require("../Interactor/HandRayProvider");
const IndirectTargetProvider_1 = require("../Interactor/IndirectTargetProvider");
const Interactor_1 = require("../Interactor/Interactor");
const PokeTargetProvider_1 = require("../Interactor/PokeTargetProvider");
var FieldTargetingMode;
(function (FieldTargetingMode) {
    FieldTargetingMode[FieldTargetingMode["FarField"] = 0] = "FarField";
    FieldTargetingMode[FieldTargetingMode["NearField"] = 1] = "NearField";
    FieldTargetingMode[FieldTargetingMode["Direct"] = 2] = "Direct";
    FieldTargetingMode[FieldTargetingMode["BehindNearField"] = 3] = "BehindNearField";
})(FieldTargetingMode || (exports.FieldTargetingMode = FieldTargetingMode = {}));
const HANDUI_INTERACTION_DISTANCE_THRESHOLD_CM = 15;
// The maximum allowed angle between the hand ray and the plane's normal for a near field interaction to be valid.
const NEAR_FIELD_ANGLE_THRESHOLD_RADIAN = Math.PI / 3;
// The minimum pinch strength required to trigger a pinch instead of a poke during direct targeting.
exports.MINIMUM_PINCH_STRENGTH = 0.2;
/**
 * This class handles hand interactions within the Spectacles Interaction Kit. It provides various configurations for hand types and raycast types.
 *
 */
let HandInteractor = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseInteractor_1.default;
    var HandInteractor = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.handType = this.handType;
            /**
             * Forces the usage of Poke targeting when interacting near the nondominant hand's palm.
             */
            this.forcePokeOnNonDominantPalmProximity = this.forcePokeOnNonDominantPalmProximity;
            /**
             * The radius in cm around the midpoint of the index/thumb to target Interactables.
             */
            this.directColliderEnterRadius = this.directColliderEnterRadius;
            /**
             * The radius in cm around the midpoint of the index/thumb to de-target Interactables (for bistable thresholding).
             */
            this.directColliderExitRadius = this.directColliderExitRadius;
            /**
             * Controls the minimum distance the hand must move during direct interaction to be considered a drag. When the
             * distance between the interaction origin position and current position exceeds this threshold, dragging behavior is
             * detected and tracked. Lower values make dragging more sensitive and easier to trigger, while higher values require
             * more deliberate movement before dragging begins.
             */
            this.directDragThreshold = this.directDragThreshold;
            this.handProvider = HandInputData_1.HandInputData.getInstance();
            this.onFieldTargetingModeChangedEvent = new Event_1.default();
            this.onFieldTargetingModeChanged = this.onFieldTargetingModeChangedEvent.publicApi();
            this._fieldTargetingMode = FieldTargetingMode.FarField;
            this._currentInteractionPlane = null;
            this.cameraProvider = WorldCameraFinderProvider_1.default.getInstance();
        }
        __initialize() {
            super.__initialize();
            this.handType = this.handType;
            /**
             * Forces the usage of Poke targeting when interacting near the nondominant hand's palm.
             */
            this.forcePokeOnNonDominantPalmProximity = this.forcePokeOnNonDominantPalmProximity;
            /**
             * The radius in cm around the midpoint of the index/thumb to target Interactables.
             */
            this.directColliderEnterRadius = this.directColliderEnterRadius;
            /**
             * The radius in cm around the midpoint of the index/thumb to de-target Interactables (for bistable thresholding).
             */
            this.directColliderExitRadius = this.directColliderExitRadius;
            /**
             * Controls the minimum distance the hand must move during direct interaction to be considered a drag. When the
             * distance between the interaction origin position and current position exceeds this threshold, dragging behavior is
             * detected and tracked. Lower values make dragging more sensitive and easier to trigger, while higher values require
             * more deliberate movement before dragging begins.
             */
            this.directDragThreshold = this.directDragThreshold;
            this.handProvider = HandInputData_1.HandInputData.getInstance();
            this.onFieldTargetingModeChangedEvent = new Event_1.default();
            this.onFieldTargetingModeChanged = this.onFieldTargetingModeChangedEvent.publicApi();
            this._fieldTargetingMode = FieldTargetingMode.FarField;
            this._currentInteractionPlane = null;
            this.cameraProvider = WorldCameraFinderProvider_1.default.getInstance();
        }
        onAwake() {
            this.inputType = this.handType === "left" ? Interactor_1.InteractorInputType.LeftHand : Interactor_1.InteractorInputType.RightHand;
            this._hand = this.handProvider.getHand(this.handType);
            this.handRayProvider = new HandRayProvider_1.HandRayProvider({
                handType: this.handType,
                handInteractor: this
            });
            this.indirectTargetProvider = new IndirectTargetProvider_1.default(this, {
                maxRayDistance: this.maxRaycastDistance,
                rayProvider: this.handRayProvider,
                targetingVolumeMultiplier: this.indirectTargetingVolumeMultiplier,
                shouldPreventTargetUpdate: () => {
                    return this.preventTargetUpdate();
                },
                spherecastRadii: this.spherecastRadii,
                spherecastDistanceThresholds: this.spherecastDistanceThresholds
            });
            this.indirectDragProvider = new DragProvider_1.DragProvider(this.indirectDragThreshold);
            if (this.directColliderEnterRadius >= this.directColliderExitRadius) {
                throw Error(`The direct collider enter radius should be less than the exit radius for bistable threshold behavior.`);
            }
            this.directTargetProvider = new DirectTargetProvider_1.DirectTargetProvider(this, {
                handType: this.handType,
                shouldPreventTargetUpdate: () => {
                    return this.preventTargetUpdate();
                },
                sceneObjectName: `${this.handType === `left` ? `Left` : `Right`}HandColliderTargetProvider`,
                debugEnabled: this.drawDebug,
                colliderEnterRadius: this.directColliderEnterRadius,
                colliderExitRadius: this.directColliderExitRadius
            });
            this.directDragProvider = new DragProvider_1.DragProvider(this.directDragThreshold);
            this.pokeTargetProvider = new PokeTargetProvider_1.PokeTargetProvider({
                handType: this.handType,
                drawDebug: this.drawDebug
            });
            this.activeTargetProvider = this.indirectTargetProvider;
            this.dragProvider = this.indirectDragProvider;
            this.defineSceneEvents();
        }
        /**
         * @returns the TrackedHand that this HandInteractor is using for tracking information.
         */
        get hand() {
            return this._hand;
        }
        get startPoint() {
            return this.activeTargetProvider?.startPoint ?? null;
        }
        get endPoint() {
            return this.activeTargetProvider?.endPoint ?? null;
        }
        get direction() {
            const proposedDirection = this.activeTargetingMode === Interactor_1.TargetingMode.Poke
                ? this.pokeTargetProvider?.direction
                : this.indirectTargetProvider?.direction;
            return proposedDirection ?? null;
        }
        get orientation() {
            return this.hand?.getPinchDirection() ?? null;
        }
        get distanceToTarget() {
            return this.activeTargetProvider?.currentInteractableHitInfo?.hit.distance ?? null;
        }
        get targetHitPosition() {
            return this.activeTargetProvider?.currentInteractableHitInfo?.hit.position ?? null;
        }
        get targetHitInfo() {
            return this.activeTargetProvider?.currentInteractableHitInfo ?? null;
        }
        get activeTargetingMode() {
            return this.activeTargetProvider?.targetingMode ?? Interactor_1.TargetingMode.None;
        }
        get maxRaycastDistance() {
            return this._maxRaycastDistance;
        }
        get interactionStrength() {
            const proposedStrength = this.activeTargetingMode === Interactor_1.TargetingMode.Poke
                ? this.pokeTargetProvider?.getInteractionStrength()
                : this.hand?.getPinchStrength();
            return proposedStrength ?? null;
        }
        /**
         * Set if the Interactor is should draw a debug gizmo of collider/raycasts in the scene.
         */
        set drawDebug(debug) {
            this._drawDebug = debug;
            // If the target providers have not been created yet, no need to manually set the drawDebug.
            if (!this.indirectTargetProvider || !this.directTargetProvider || !this.pokeTargetProvider) {
                return;
            }
            this.indirectTargetProvider.drawDebug = debug;
            this.directTargetProvider.drawDebug = debug;
            this.pokeTargetProvider.drawDebug = debug;
        }
        /**
         * @returns if the Interactor is currently drawing a debug gizmo of collider/raycasts in the scene.
         */
        get drawDebug() {
            return this._drawDebug;
        }
        get isHoveringCurrentInteractable() {
            if (!this.currentInteractable) {
                return null;
            }
            // Since poke trigger only ends when the Interactable leaves the poke collider, isHoveringInteractable is not sufficient to check.
            // Checking for poke edge case is necessary to send the correct onTriggerEnd event.
            const pokedInteractable = this.pokeTargetProvider?.currentInteractableHitInfo?.interactable ?? null;
            const wasPoking = this.previousTrigger === Interactor_1.InteractorTriggerType.Poke;
            if (wasPoking && this.previousInteractable !== null && pokedInteractable !== this.previousInteractable) {
                return true;
            }
            return this.activeTargetProvider.isHoveringInteractable(this.currentInteractable);
        }
        get hoveredInteractables() {
            const hoveredInteractables = Array.from(this.activeTargetProvider.currentInteractableSet);
            // Since poke trigger only ends when the Interactable leaves the poke collider, currentInteractableSet is not sufficient to check.
            // Checking for poke edge case is necessary to send accurate information right after a poke.
            const pokedInteractable = this.pokeTargetProvider?.currentInteractableHitInfo?.interactable ?? null;
            const wasPoking = this.previousTrigger === Interactor_1.InteractorTriggerType.Poke;
            if (wasPoking && this.previousInteractable !== null && pokedInteractable !== this.previousInteractable) {
                hoveredInteractables.push(this.previousInteractable);
            }
            return hoveredInteractables;
        }
        isHoveringInteractable(interactable) {
            return this.activeTargetProvider.isHoveringInteractable(interactable);
        }
        isHoveringInteractableHierarchy(interactable) {
            if (this.activeTargetProvider.isHoveringInteractable(interactable)) {
                return true;
            }
            for (const interactable of this.activeTargetProvider.currentInteractableSet) {
                if (interactable.isDescendantOf(interactable)) {
                    return true;
                }
            }
            return false;
        }
        updateState() {
            super.updateState();
            this.updateTarget();
            this.updatePinchFilter();
            this.updateDragVector();
            this.processTriggerEvents();
        }
        clearDragProviders() {
            this.directDragProvider?.clear();
            this.indirectDragProvider?.clear();
            this.planecastDragProvider.clear();
        }
        get planecastDragVector() {
            // If the hand has been recently found, return vec3.zero() to allow time to determine if pinch is sustained.
            if (this.hand === undefined)
                return vec3.zero();
            return this.hand.isRecentlyFound() ? vec3.zero() : this.planecastDragProvider.currentDragVector;
        }
        set currentDragVector(dragVector) {
            this._currentDragVector = dragVector;
        }
        get currentDragVector() {
            // If the hand has been recently found, return vec3.zero() to allow time to determine if pinch is sustained.
            if (this.hand === undefined)
                return vec3.zero();
            return this.hand.isRecentlyFound() ? vec3.zero() : this._currentDragVector;
        }
        get planecastPoint() {
            if (this.activeTargetProvider === this.indirectTargetProvider) {
                return this.raycastPlaneIntersection(this.currentInteractable);
            }
            else if (this.activeTargetProvider === this.directTargetProvider) {
                return this.colliderPlaneIntersection(this.currentInteractable);
            }
            else if (this.activeTargetProvider === this.pokeTargetProvider) {
                return this.positionPlaneIntersection(this.currentInteractable, this.hand.indexTip.position);
            }
            return null;
        }
        /**
         * Clears an InteractionPlane from the cache of planes if it is nearby.
         * @param plane
         */
        clearInteractionPlane(plane) {
            this.directTargetProvider.clearInteractionPlane(plane);
            const fieldTargetingMode = this.updateNearestPlane();
            if (this.fieldTargetingMode !== fieldTargetingMode) {
                this._fieldTargetingMode = fieldTargetingMode;
                this.onFieldTargetingModeChangedEvent.invoke(fieldTargetingMode);
            }
        }
        get fieldTargetingMode() {
            return this._fieldTargetingMode;
        }
        get currentInteractionPlane() {
            return this._currentInteractionPlane;
        }
        /**
         * @returns a normalized value between 0 and 1 representing proximity to an InteractionPlane when in near field mode,
         *          null if in FarField mode.
         */
        get nearFieldProximity() {
            if (this.fieldTargetingMode === FieldTargetingMode.FarField || this.currentInteractionPlane === null) {
                return null;
            }
            const planeProjection = this.currentInteractionPlane.projectPoint(this.hand.indexTip.position);
            if (planeProjection === null) {
                return null;
            }
            if (this.fieldTargetingMode === FieldTargetingMode.NearField ||
                this.fieldTargetingMode === FieldTargetingMode.Direct) {
                return 1 - planeProjection.distance / this.currentInteractionPlane.proximityDistance;
            }
            else {
                return 1 + planeProjection.distance / this.currentInteractionPlane.behindDistance;
            }
        }
        isTargeting() {
            return this.hand?.isInTargetingPose() ?? false;
        }
        /**
         * Returns true if the hand interactor and the hand it is associated with are both enabled.
         */
        isActive() {
            return (this.enabled && (this.hand?.enabled ?? false) && !this.hand.isPhoneInHand && this.sceneObject.isEnabledInHierarchy);
        }
        /**
         * Returns true if the hand this interactor is associated with is both enabled and tracked.
         */
        isTracking() {
            (0, validate_1.validate)(this.hand);
            return this.hand.enabled && this.hand.isTracked();
        }
        /**
         * Returns true if the hand is targeting via far field raycasting.
         */
        isFarField() {
            // If the hand is not yet triggering, check if the raycast actually intersects within the plane's bounds.
            if (!this.isTriggering &&
                this.currentInteractable !== null &&
                this.currentInteractionPlane !== null &&
                this.startPoint !== null &&
                this.targetHitInfo !== null) {
                return !this.currentInteractionPlane.checkRayIntersection(this.startPoint, this.targetHitInfo.hit.position);
            }
            else {
                return this.fieldTargetingMode === FieldTargetingMode.FarField;
            }
        }
        isWithinDirectZone() {
            return this.fieldTargetingMode === FieldTargetingMode.Direct;
        }
        clearCurrentHitInfo() {
            this.indirectTargetProvider?.clearCurrentInteractableHitInfo();
            this.directTargetProvider?.clearCurrentInteractableHitInfo();
            this.pokeTargetProvider?.clearCurrentInteractableHitInfo();
        }
        /** @inheritdoc */
        setInputEnabled(enabled) {
            super.setInputEnabled(enabled);
            this.handProvider.getHand(this.handType).setEnabled(enabled);
        }
        defineSceneEvents() {
            this.createEvent("OnDestroyEvent").bind(() => {
                this.onDestroy();
            });
        }
        updateTarget() {
            if (!this.isActive()) {
                this.indirectTargetProvider?.reset();
                return;
            }
            // If the user is mid-interaction, do not hijack raycast logic to avoid jerky interactions.
            if (!this.preventTargetUpdate()) {
                const fieldTargetingMode = this.updateNearestPlane();
                if (this.fieldTargetingMode !== fieldTargetingMode) {
                    this._fieldTargetingMode = fieldTargetingMode;
                    this.onFieldTargetingModeChangedEvent.invoke(fieldTargetingMode);
                }
            }
            this.pokeTargetProvider?.update();
            const pokedInteractable = this.pokeTargetProvider?.currentInteractableHitInfo?.interactable ?? null;
            const wasPoking = this.previousTrigger === Interactor_1.InteractorTriggerType.Poke;
            // Handle the case where the user slides from poking one Interactable to another. We need to send an onTriggerEnd
            // event for the previous Interactable first.
            if (wasPoking && this.previousInteractable !== null && pokedInteractable !== this.previousInteractable) {
                this.currentTrigger = Interactor_1.InteractorTriggerType.None;
                this.currentInteractable = this.previousInteractable; // Assign the *old* interactable for one frame
                return;
            }
            if (this.isPoking()) {
                this.activeTargetProvider = this.pokeTargetProvider;
                this.dragProvider = this.directDragProvider;
            }
            else {
                this.directTargetProvider?.update();
                this.indirectTargetProvider?.update();
                if ((this.previousTrigger & Interactor_1.InteractorTriggerType.Select) === 0) {
                    if (this.pokeTargetProvider?.hasTarget()) {
                        this.activeTargetProvider = this.pokeTargetProvider;
                        this.dragProvider = this.directDragProvider;
                    }
                    else if (this.directTargetProvider?.hasTarget()) {
                        this.activeTargetProvider = this.directTargetProvider;
                        this.dragProvider = this.directDragProvider;
                    }
                    else if (this.hand.targetingData?.intendsToTarget) {
                        if (this.currentInteractionPlane) {
                            const planeProjection = this.currentInteractionPlane.projectPoint(this.hand.indexTip.position);
                            if (planeProjection !== null) {
                                // If the hand is in the direct zone or behind zone, switch to direct or poke target provider.
                                if (planeProjection.isWithinDirectZone || planeProjection.isWithinBehindZone) {
                                    const pinchStrength = this.hand.getPinchStrength();
                                    this.activeTargetProvider =
                                        pinchStrength !== null && pinchStrength >= exports.MINIMUM_PINCH_STRENGTH
                                            ? this.directTargetProvider
                                            : this.pokeTargetProvider;
                                }
                                // Otherwise, the hand is in the normal interaction zone, so we switch to indirect target provider.
                                else {
                                    this.activeTargetProvider = this.indirectTargetProvider;
                                }
                                this.dragProvider = this.directDragProvider;
                            }
                        }
                        else {
                            this.activeTargetProvider = this.indirectTargetProvider;
                            // During a near field raycast, use direct drag threshold.
                            this.dragProvider =
                                this.fieldTargetingMode === FieldTargetingMode.FarField
                                    ? this.indirectDragProvider
                                    : this.directDragProvider;
                        }
                    }
                    // If the hand is not intending to raycast target, choose the more likely of the collider target providers.
                    else {
                        const pinchStrength = this.hand.getPinchStrength();
                        this.activeTargetProvider =
                            pinchStrength !== null && pinchStrength >= exports.MINIMUM_PINCH_STRENGTH
                                ? this.directTargetProvider
                                : this.pokeTargetProvider;
                        this.dragProvider = this.directDragProvider;
                    }
                }
            }
            if (this.isPoking()) {
                this.currentTrigger = Interactor_1.InteractorTriggerType.Poke;
            }
            else if (this.hand && this.hand.isPinching() && (this.previousTrigger & Interactor_1.InteractorTriggerType.Poke) === 0) {
                this.currentTrigger = Interactor_1.InteractorTriggerType.Pinch;
            }
            else {
                this.currentTrigger = Interactor_1.InteractorTriggerType.None;
            }
            this.currentInteractable = this.activeTargetProvider?.currentInteractableHitInfo?.interactable ?? null;
            this.handleSelectionLifecycle(this.activeTargetProvider);
        }
        updatePinchFilter() {
            if (!this.isActive()) {
                return;
            }
            if (this.currentInteractable === null) {
                this.hand.useFilteredPinch = false;
                return;
            }
            let useFilteredPinch = this.currentInteractable.useFilteredPinch;
            let ancestor = this.currentInteractable.sceneObject.getParent();
            while (ancestor !== null) {
                const interactable = ancestor.getComponent(Interactable_1.Interactable.getTypeName());
                if (interactable !== null) {
                    useFilteredPinch = useFilteredPinch || interactable.useFilteredPinch;
                }
                ancestor = ancestor.getParent();
            }
            this.hand.useFilteredPinch = useFilteredPinch;
        }
        isPoking() {
            return this.activeTargetProvider === this.pokeTargetProvider && (this.pokeTargetProvider?.isTriggering() ?? false);
        }
        get pokeIsValid() {
            return this.pokeTargetProvider?.pokeIsValid ?? false;
        }
        get pokeDepth() {
            return this.pokeTargetProvider?.pokeDepth ?? 0;
        }
        get normalizedPokeDepth() {
            return this.pokeTargetProvider?.normalizedPokeDepth ?? 0;
        }
        /**
         * @returns if we should prevent any updates to the currently targeted item.
         * In the case of pinching (indirect or direct) or poking, we prevent updates to the targeting system.
         * Otherwise, allow updates to the targeted item.
         */
        preventTargetUpdate() {
            return this.hand !== undefined && (this.hand.isPinching() || this.isPoking());
        }
        isPokingNonDominantHand() {
            return this.forcePokeOnNonDominantPalmProximity && this.isNearNonDominantHand();
        }
        isNearNonDominantHand() {
            const nonDominantHand = this.handProvider.getNonDominantHand();
            const dominantHand = this.handProvider.getDominantHand();
            /** If either the dominant or non-dominant hand is not tracked,
             * or if both hands are in an active targeting pose,
             * then the user is not intending to interact with the nondominant hand UI.
             */
            if (!nonDominantHand.isTracked() ||
                !dominantHand.isTracked() ||
                (dominantHand.isInTargetingPose() && nonDominantHand.isInTargetingPose())) {
                return false;
            }
            // Detect if dominant index is within interaction proximity to non-dominant palm
            const palmCenter = nonDominantHand.getPalmCenter();
            const dominantIndexTip = dominantHand.indexTip?.position;
            return (palmCenter !== null &&
                dominantIndexTip !== undefined &&
                palmCenter.distanceSquared(dominantIndexTip) <
                    HANDUI_INTERACTION_DISTANCE_THRESHOLD_CM * HANDUI_INTERACTION_DISTANCE_THRESHOLD_CM);
        }
        // Check for cached planes (via direct collider overlap), choosing the nearest plane if multiple are available.
        updateNearestPlane() {
            const interactionPlanes = this.directTargetProvider.currentInteractionPlanes;
            let nearestPlane = null;
            let distance = Number.POSITIVE_INFINITY;
            const planeRaycastLocus = this.hand.indexTip.position;
            if (planeRaycastLocus === null) {
                this._currentInteractionPlane = null;
                return FieldTargetingMode.FarField;
            }
            for (const interactionPlane of interactionPlanes) {
                const planeProjection = interactionPlane.projectPoint(planeRaycastLocus);
                // Check if the locus is within the interaction zone or behind zone, then check if the locus is closer to this plane than prior planes.
                const isNearPlane = planeProjection !== null &&
                    (planeProjection.isWithinInteractionZone || planeProjection.isWithinBehindZone) &&
                    Math.abs(planeProjection.distance) < distance;
                const normal = interactionPlane.normal;
                const handDirection = this.handRayProvider.raycast.getRay();
                // Check if the hand direction faces the plane enough to target the plane.
                const isTowardPlane = handDirection !== null &&
                    handDirection.direction.angleTo(normal.uniformScale(-1)) < NEAR_FIELD_ANGLE_THRESHOLD_RADIAN;
                // Rough check if InteractionPlane is mostly in FoV.
                const isInFov = planeProjection !== null ? this.cameraProvider.inFoV(planeProjection.point) : false;
                // If all checks are true, cache the plane.
                if (isNearPlane && isTowardPlane && isInFov) {
                    nearestPlane = interactionPlane;
                    distance = planeProjection.distance;
                }
            }
            this._currentInteractionPlane = nearestPlane;
            // Return to far field targeting if no nearby planes were found.
            if (this._currentInteractionPlane === null) {
                return FieldTargetingMode.FarField;
            }
            // Check if the index tip is past the plane for purpose of visuals.
            const indexPoint = this.hand.indexTip.position;
            const indexProjection = this._currentInteractionPlane.projectPoint(indexPoint);
            // The projection cannot be null because the HandInteractor just cached an InteractionPlane in the above code.
            const isIndexInBehindZone = indexProjection.isWithinBehindZone;
            const isIndexInDirectZone = indexProjection.isWithinDirectZone;
            if (isIndexInBehindZone) {
                return FieldTargetingMode.BehindNearField;
            }
            else if (isIndexInDirectZone) {
                return FieldTargetingMode.Direct;
            }
            else {
                return FieldTargetingMode.NearField;
            }
        }
        onDestroy() {
            this.directTargetProvider?.destroy();
            this.indirectTargetProvider?.destroy();
            this.pokeTargetProvider?.destroy();
        }
    };
    __setFunctionName(_classThis, "HandInteractor");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        HandInteractor = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return HandInteractor = _classThis;
})();
exports.HandInteractor = HandInteractor;
//# sourceMappingURL=HandInteractor.js.map