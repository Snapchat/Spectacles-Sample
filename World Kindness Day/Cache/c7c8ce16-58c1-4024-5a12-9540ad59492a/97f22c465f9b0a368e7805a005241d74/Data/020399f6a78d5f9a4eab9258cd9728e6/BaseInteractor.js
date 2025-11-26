"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Interactor_1 = require("./Interactor");
const Event_1 = require("../../Utils/Event");
const validate_1 = require("../../Utils/validate");
const InteractionManager_1 = require("../InteractionManager/InteractionManager");
const PokeTargetProvider_1 = require("../Interactor/PokeTargetProvider");
const DragProvider_1 = require("./DragProvider");
/**
 * Defines API for {@link Interactor} type
 */
class BaseInteractor extends BaseScriptComponent {
    __initialize() {
        super.__initialize();
        this._drawDebug = this._drawDebug;
        this.sphereCastEnabled = this.sphereCastEnabled;
        /**
         * Defines the radii (in cm) used for progressive spherecasting when raycast fails to hit a target. Used in
         * sequence with spherecastDistanceThresholds to perform increasingly larger sphere casts until a target is found.
         * Smaller radii provide more precise targeting while larger radii help target small or distant objects. Must have the
         * same array length as spherecastDistanceThresholds.
         */
        this.spherecastRadii = this.spherecastRadii;
        /**
         * Defines distance offsets (in cm) from the ray origin for performing sphere casts. Each value creates a sphere
         * cast starting point at [ray origin + (direction * offset)]. Used in sequence with spherecastRadii, with the system
         * trying progressively larger sphere casts until a target is found. Helps improve targeting of small or distant
         * objects. Must have the same array length as spherecastRadii.
         */
        this.spherecastDistanceThresholds = this.spherecastDistanceThresholds;
        this._maxRaycastDistance = this._maxRaycastDistance;
        /**
         * A multiplier applied to spherecast radii when using indirect targeting. Larger values create wider targeting
         * areas, making it easier to target objects at the expense of precision. Smaller values provide more precise
         * targeting.
         */
        this.indirectTargetingVolumeMultiplier = this.indirectTargetingVolumeMultiplier;
        this.indirectDragThreshold = this.indirectDragThreshold;
        this.interactionManager = InteractionManager_1.InteractionManager.getInstance();
        this._dragProvider = new DragProvider_1.DragProvider(this.indirectDragThreshold);
        // To allow the planecast drag vector to always be available for 1:1 usage, the threshold should be 0.
        this._planecastDragProvider = new DragProvider_1.DragProvider(0);
        this.onCurrentInteractableChangedEvent = new Event_1.default();
        /**
         * Called whenever the Interactor changes the target Interactable
         */
        this.onCurrentInteractableChanged = this.onCurrentInteractableChangedEvent.publicApi();
        this.onTriggerStartEvent = new Event_1.default();
        this.onTriggerUpdateEvent = new Event_1.default();
        this.onTriggerEndEvent = new Event_1.default();
        this.onTriggerCanceledEvent = new Event_1.default();
        /**
         * Called whenever the Interactor enters the triggered state (regardless of if there is a target or not).
         */
        this.onTriggerStart = this.onTriggerStartEvent.publicApi();
        /**
         * Called whenever the Interactor remains in the triggered state (regardless of if there is a target or not).
         */
        this.onTriggerUpdate = this.onTriggerUpdateEvent.publicApi();
        /**
         * Called whenever the Interactor exits the triggered state (regardless of if there is a target or not).
         */
        this.onTriggerEnd = this.onTriggerEndEvent.publicApi();
        /**
         * Called whenever the Interactor is lost and was in a triggered state (regardless of if there is a target or not).
         */
        this.onTriggerCanceled = this.onTriggerCanceledEvent.publicApi();
        this._currentDragVector = null;
        this._previousStartPoint = null;
        this._inputType = Interactor_1.InteractorInputType.None;
        this._currentInteractable = null;
        this._previousInteractable = null;
        this._previousTrigger = Interactor_1.InteractorTriggerType.None;
        this._currentTrigger = Interactor_1.InteractorTriggerType.None;
        this._previousDragVector = null;
        this._endedInsideInteractable = null;
        this.interactionStartedInteractable = null;
        this._wasHoveringCurrentInteractable = null;
        this._isHoveringCurrentInteractable = null;
        /**
         * Notifies that the Interactor has changed target Interactable
         */
        this.currentInteractableChanged = () => {
            if (this.currentInteractable !== this.previousInteractable) {
                this._wasHoveringCurrentInteractable = false;
                this.onCurrentInteractableChangedEvent.invoke(this.currentInteractable);
            }
        };
        this.interactionManager.registerInteractor(this);
        this.createEvent("OnDestroyEvent").bind(() => this.release());
    }
    set inputType(inputType) {
        this._inputType = inputType;
    }
    /**
     * Defines the interactor's input type. This can be used for prioritization
     * or for discerning controller vs hands.
     */
    get inputType() {
        return this._inputType;
    }
    set currentInteractable(interactable) {
        this._currentInteractable = interactable;
    }
    /**
     * Returns the current targeted interactable or null.
     */
    get currentInteractable() {
        return this._currentInteractable;
    }
    set previousInteractable(interactable) {
        this._previousInteractable = interactable;
    }
    /**
     * Returns the previous targeted interactable or null.
     */
    get previousInteractable() {
        return this._previousInteractable;
    }
    /**
     * Returns if the Interactor is in some generic triggering state in the current frame.
     */
    get isTriggering() {
        return this.currentTrigger !== Interactor_1.InteractorTriggerType.None;
    }
    /**
     * Returns if the Interactor was in some generic triggering state in the previous frame.
     */
    get wasTriggering() {
        return this.previousTrigger !== Interactor_1.InteractorTriggerType.None;
    }
    set previousTrigger(trigger) {
        this._previousTrigger = trigger;
    }
    /**
     * Returns the previous trigger value
     */
    get previousTrigger() {
        return this._previousTrigger;
    }
    set currentTrigger(trigger) {
        this._currentTrigger = trigger;
    }
    /**
     * Returns the current trigger value
     */
    get currentTrigger() {
        return this._currentTrigger;
    }
    set previousDragVector(dragVector) {
        this._previousDragVector = dragVector;
    }
    /**
     * Returns the nullable drag vector, computed in the
     * previous frame
     */
    get previousDragVector() {
        return this._previousDragVector;
    }
    constructor() {
        super();
        this._drawDebug = this._drawDebug;
        this.sphereCastEnabled = this.sphereCastEnabled;
        /**
         * Defines the radii (in cm) used for progressive spherecasting when raycast fails to hit a target. Used in
         * sequence with spherecastDistanceThresholds to perform increasingly larger sphere casts until a target is found.
         * Smaller radii provide more precise targeting while larger radii help target small or distant objects. Must have the
         * same array length as spherecastDistanceThresholds.
         */
        this.spherecastRadii = this.spherecastRadii;
        /**
         * Defines distance offsets (in cm) from the ray origin for performing sphere casts. Each value creates a sphere
         * cast starting point at [ray origin + (direction * offset)]. Used in sequence with spherecastRadii, with the system
         * trying progressively larger sphere casts until a target is found. Helps improve targeting of small or distant
         * objects. Must have the same array length as spherecastRadii.
         */
        this.spherecastDistanceThresholds = this.spherecastDistanceThresholds;
        this._maxRaycastDistance = this._maxRaycastDistance;
        /**
         * A multiplier applied to spherecast radii when using indirect targeting. Larger values create wider targeting
         * areas, making it easier to target objects at the expense of precision. Smaller values provide more precise
         * targeting.
         */
        this.indirectTargetingVolumeMultiplier = this.indirectTargetingVolumeMultiplier;
        this.indirectDragThreshold = this.indirectDragThreshold;
        this.interactionManager = InteractionManager_1.InteractionManager.getInstance();
        this._dragProvider = new DragProvider_1.DragProvider(this.indirectDragThreshold);
        // To allow the planecast drag vector to always be available for 1:1 usage, the threshold should be 0.
        this._planecastDragProvider = new DragProvider_1.DragProvider(0);
        this.onCurrentInteractableChangedEvent = new Event_1.default();
        /**
         * Called whenever the Interactor changes the target Interactable
         */
        this.onCurrentInteractableChanged = this.onCurrentInteractableChangedEvent.publicApi();
        this.onTriggerStartEvent = new Event_1.default();
        this.onTriggerUpdateEvent = new Event_1.default();
        this.onTriggerEndEvent = new Event_1.default();
        this.onTriggerCanceledEvent = new Event_1.default();
        /**
         * Called whenever the Interactor enters the triggered state (regardless of if there is a target or not).
         */
        this.onTriggerStart = this.onTriggerStartEvent.publicApi();
        /**
         * Called whenever the Interactor remains in the triggered state (regardless of if there is a target or not).
         */
        this.onTriggerUpdate = this.onTriggerUpdateEvent.publicApi();
        /**
         * Called whenever the Interactor exits the triggered state (regardless of if there is a target or not).
         */
        this.onTriggerEnd = this.onTriggerEndEvent.publicApi();
        /**
         * Called whenever the Interactor is lost and was in a triggered state (regardless of if there is a target or not).
         */
        this.onTriggerCanceled = this.onTriggerCanceledEvent.publicApi();
        this._currentDragVector = null;
        this._previousStartPoint = null;
        this._inputType = Interactor_1.InteractorInputType.None;
        this._currentInteractable = null;
        this._previousInteractable = null;
        this._previousTrigger = Interactor_1.InteractorTriggerType.None;
        this._currentTrigger = Interactor_1.InteractorTriggerType.None;
        this._previousDragVector = null;
        this._endedInsideInteractable = null;
        this.interactionStartedInteractable = null;
        this._wasHoveringCurrentInteractable = null;
        this._isHoveringCurrentInteractable = null;
        /**
         * Notifies that the Interactor has changed target Interactable
         */
        this.currentInteractableChanged = () => {
            if (this.currentInteractable !== this.previousInteractable) {
                this._wasHoveringCurrentInteractable = false;
                this.onCurrentInteractableChangedEvent.invoke(this.currentInteractable);
            }
        };
        this.interactionManager.registerInteractor(this);
        this.createEvent("OnDestroyEvent").bind(() => this.release());
    }
    release() {
        this.interactionManager.deregisterInteractor(this);
    }
    /**
     * Updates the targeting and trigger state of the interactor
     */
    updateState() {
        this.previousInteractable = this.currentInteractable;
        this.previousTrigger = this.currentTrigger;
        this.previousDragVector = this.currentDragVector;
        this._previousStartPoint = this.startPoint;
        // These values need to be cached to differently because the target provider's set is only updated during
        // the lateUpdate of the frame, but updateState is called during the update of the frame.
        this._wasHoveringCurrentInteractable = this._isHoveringCurrentInteractable;
        this._isHoveringCurrentInteractable = this.isHoveringCurrentInteractable;
        this.currentInteractable = null;
    }
    /**
     * Disables or enables the input powering this interactor
     * @param enabled whether the input powering the interactor should be enabled
     */
    setInputEnabled(_enabled) { }
    /**
     * Clears the current Interactable, used when an Interactable is deleted at runtime
     */
    clearCurrentInteractable() {
        this.currentInteractable = null;
        this.clearCurrentHitInfo();
    }
    /**
     * Returns the delta start position from previous frame
     */
    get deltaStartPosition() {
        if (this.startPoint === null || this._previousStartPoint === null) {
            return null;
        }
        return this.startPoint.sub(this._previousStartPoint);
    }
    /**
     * Returns true if the interaction ended inside the Interactable it started in. Updated when an interaction ends.
     */
    get endedInsideInteractable() {
        return this._endedInsideInteractable;
    }
    /**
     * Returns true if the Interactor was hovering the current Interactable in the previous frame.
     */
    get wasHoveringCurrentInteractable() {
        return this._wasHoveringCurrentInteractable;
    }
    handleSelectionLifecycle(targetProvider) {
        // Special case for Poke, always considered inside
        if (targetProvider instanceof PokeTargetProvider_1.PokeTargetProvider) {
            this._endedInsideInteractable = true;
            this.interactionStartedInteractable = null;
            return;
        }
        const wasSelected = (this.previousTrigger & Interactor_1.InteractorTriggerType.Select) !== 0;
        const isSelected = (this.currentTrigger & Interactor_1.InteractorTriggerType.Select) !== 0;
        // Handle selection end
        if (wasSelected && !isSelected) {
            if (this.interactionStartedInteractable !== null) {
                this._endedInsideInteractable =
                    targetProvider?.isHoveringInteractable(this.interactionStartedInteractable) ?? false;
                this.interactionStartedInteractable = null;
            }
        }
        // Handle selection start
        else if (!wasSelected && isSelected) {
            this.interactionStartedInteractable = targetProvider?.currentInteractableHitInfo?.interactable ?? null;
        }
        else {
            this._endedInsideInteractable = null;
        }
    }
    get dragProvider() {
        return this._dragProvider;
    }
    set dragProvider(provider) {
        (0, validate_1.validate)(provider);
        this._dragProvider = provider;
    }
    get planecastDragProvider() {
        return this._planecastDragProvider;
    }
    set currentDragVector(dragVector) {
        this._currentDragVector = dragVector;
    }
    /**
     * Returns the current vector associated to a dragging
     * movement since the last frame, and null if not dragging
     */
    get currentDragVector() {
        return this._currentDragVector;
    }
    /**
     * @returns the drag vector projected onto the plane defined by the current Interactable's forward and origin
     */
    get planecastDragVector() {
        return this.planecastDragProvider.currentDragVector;
    }
    clearDragProviders() {
        this.dragProvider.clear();
        this.planecastDragProvider.clear();
    }
    updateDragVector() {
        if ((this.currentTrigger & Interactor_1.InteractorTriggerType.Select) !== 0) {
            this.currentDragVector = this.dragProvider.getDragVector(this.getDragPoint(), this.currentInteractable?.enableInstantDrag ?? null);
            this.planecastDragProvider.getDragVector(this.planecastPoint, this.currentInteractable?.enableInstantDrag ?? null);
        }
        else {
            this.currentDragVector = null;
            this.clearDragProviders();
        }
    }
    getDragPoint() {
        return this.endPoint;
    }
    get planecastPoint() {
        return this.raycastPlaneIntersection(this.currentInteractable);
    }
    /**
     * Used to define the type of drag vector that the interactor is invoking.
     * By default, interactor drag vectors will be as SixDof drags.
     */
    get dragType() {
        if (this.currentDragVector !== null) {
            return Interactor_1.DragType.SixDof;
        }
        return null;
    }
    /**
     * Calculates the intersection of the Interactor's indirect raycast and the plane defined by the Interactable's forward vector / origin
     * @param interactable - the Interactable used to define the plane of intersection
     * @returns the intersection point of the indirect raycast and plane
     */
    raycastPlaneIntersection(interactable) {
        const origin = this.startPoint;
        const direction = this.direction;
        if (origin === null || direction === null || interactable === null) {
            return null;
        }
        // This logic uses the equation of t = ((p0-l0)·n)/(l·n) with l0 + l*t = the point of intersection.
        // l0 represents ray origin, l represents direction, p0 represents plane origin, and n represents the plane normal.
        const normal = interactable.sceneObject.getTransform().forward;
        const originToPlane = interactable.sceneObject.getTransform().getWorldPosition().sub(origin);
        const originDotProduct = originToPlane.dot(normal);
        const directionDotProduct = direction.dot(normal);
        const parametricValue = originDotProduct / directionDotProduct;
        return origin.add(direction.uniformScale(parametricValue));
    }
    /**
     * Projects the direct collider's position onto the plane defined by the Interactable's forward vector / origin
     * @param interactable - the Interactable used to define the plane of intersection
     * @returns the direct collider's position projected onto the plane
     */
    colliderPlaneIntersection(interactable) {
        return this.positionPlaneIntersection(interactable, this.endPoint);
    }
    /**
     * Projects the given position onto the plane defined by the Interactable's forward vector / origin
     * @param interactable - the Interactable used to define the plane of intersection
     * @param position - the world position to project onto the plane
     * @returns the direct collider's position projected onto the plane
     */
    positionPlaneIntersection(interactable, position) {
        const origin = position;
        if (origin === null || interactable === null) {
            return null;
        }
        // This logic uses the equation of t = ((p0-l0)·n)/(l·n) with l0 + l*t = the point of intersection.
        // l0 represents ray origin, l represents direction, p0 represents plane origin, and n represents the plane normal.
        const normal = interactable.sceneObject.getTransform().forward;
        const originToPlane = interactable.sceneObject.getTransform().getWorldPosition().sub(origin);
        const originDotProduct = originToPlane.dot(normal);
        const directionDotProduct = normal.dot(normal);
        const parametricValue = originDotProduct / directionDotProduct;
        return origin.add(normal.uniformScale(parametricValue));
    }
    /**
     * Process the new currentTrigger and compare to previousTrigger to see what event to propagate.
     */
    processTriggerEvents() {
        if (!this.isActive()) {
            if ((Interactor_1.InteractorTriggerType.Select & this.previousTrigger) !== 0) {
                this.onTriggerCanceledEvent.invoke(this.currentInteractable);
            }
        }
        else {
            if (this.previousTrigger === Interactor_1.InteractorTriggerType.None &&
                (Interactor_1.InteractorTriggerType.Select & this.currentTrigger) !== 0) {
                this.onTriggerStartEvent.invoke(this.currentInteractable);
            }
            else if (this.previousTrigger === this.currentTrigger && this.currentTrigger !== Interactor_1.InteractorTriggerType.None) {
                this.onTriggerUpdateEvent.invoke(this.currentInteractable);
            }
            else if (this.previousTrigger !== Interactor_1.InteractorTriggerType.None) {
                this.onTriggerEndEvent.invoke(this.currentInteractable);
            }
        }
    }
}
exports.default = BaseInteractor;
//# sourceMappingURL=BaseInteractor.js.map