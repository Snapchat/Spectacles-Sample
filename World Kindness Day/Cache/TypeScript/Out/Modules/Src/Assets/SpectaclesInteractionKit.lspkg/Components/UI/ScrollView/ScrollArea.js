"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScrollArea = void 0;
const NativeLogger_1 = require("../../../Utils/NativeLogger");
const InteractionManager_1 = require("../../../Core/InteractionManager/InteractionManager");
const Interactor_1 = require("../../../Core/Interactor/Interactor");
const InteractionConfigurationProvider_1 = require("../../../Providers/InteractionConfigurationProvider/InteractionConfigurationProvider");
const Event_1 = require("../../../Utils/Event");
const validate_1 = require("../../../Utils/validate");
const View_1 = require("../../../Utils/views/View");
const Interactable_1 = require("../../Interaction/Interactable/Interactable");
const ScreenTransformBoundariesProvider_1 = require("./boundariesProvider/ScreenTransformBoundariesProvider");
const TAG = "ScrollArea";
/**
 * Defines the scroll area, a box collider that the user can interact with using
 * an {@link Interactor}. The dragging events are exposed to be consumed in {@link ScrollView}
 */
class ScrollArea extends View_1.default {
    get boundariesProvider() {
        return this._boundariesProvider;
    }
    get isDragging() {
        return this._isDragging;
    }
    constructor({ debugDrawEnabled, parentSceneObject, scrollAreaBounds }) {
        super({ name: TAG });
        this.interactionManager = InteractionManager_1.InteractionManager.getInstance();
        this.interactionConfigurationProvider = InteractionConfigurationProvider_1.InteractionConfigurationProvider.getInstance();
        // Native Logging
        this.log = new NativeLogger_1.default(TAG);
        this._isDragging = false;
        this.isFocused = false;
        // Events
        this.onDragStartEvent = new Event_1.default();
        this.onDragStart = this.onDragStartEvent.publicApi();
        this.onDragUpdateEvent = new Event_1.default();
        this.onDragUpdate = this.onDragUpdateEvent.publicApi();
        this.onDragEndEvent = new Event_1.default();
        this.onDragEnd = this.onDragEndEvent.publicApi();
        this.onFocusEnterEvent = new Event_1.default();
        this.onFocusEnter = this.onFocusEnterEvent.publicApi();
        this.onFocusExitEvent = new Event_1.default();
        this.onFocusExit = this.onFocusExitEvent.publicApi();
        this.attachToScene(parentSceneObject);
        this.parentScreenTransform = parentSceneObject.getComponent("Component.ScreenTransform");
        this.screenTransform = this.createScreenTransform(debugDrawEnabled);
        this.collider = this.createCollider(debugDrawEnabled, scrollAreaBounds);
        this.interactable = this.createInteractable();
        this._boundariesProvider = new ScreenTransformBoundariesProvider_1.ScreenTransformBoundariesProvider(this.container);
        this.onTriggerStart = this.interactable.onTriggerStart;
        this.onTriggerEnd = this.interactable.onTriggerEnd;
        this.onTriggerCanceled = this.interactable.onTriggerCanceled;
    }
    /**
     * @returns if collider wire is visible or not
     */
    get debugDrawEnabled() {
        return this.collider.debugDrawEnabled;
    }
    /**
     * Toggles collider wire rendering for visualizing collider geometry shape and where it is placed.
     */
    set debugDrawEnabled(debugDrawEnabled) {
        this.collider.debugDrawEnabled = debugDrawEnabled;
        this.screenTransform.enableDebugRendering = debugDrawEnabled;
    }
    createScreenTransform(enableDebugRendering) {
        const screenTransform = this.container.createComponent("Component.ScreenTransform");
        screenTransform.enableDebugRendering = enableDebugRendering;
        screenTransform.anchors = Rect.create(-1, 1, -1, 1);
        screenTransform.offsets = Rect.create(0, 0, 0, 0);
        return screenTransform;
    }
    createColliderShape(scrollAreaBounds) {
        const shape = Shape.createBoxShape();
        const topLeftCorner = this.convertLocalUnitsToParentUnits(new vec2(-scrollAreaBounds.x, scrollAreaBounds.y));
        const bottomRightCorner = this.convertLocalUnitsToParentUnits(new vec2(scrollAreaBounds.x, -scrollAreaBounds.y));
        shape.size = new vec3(bottomRightCorner.x - topLeftCorner.x, topLeftCorner.y - bottomRightCorner.y, 1);
        return shape;
    }
    /**
     * @returns the collider's BoxShape's bounds.
     */
    get scrollColliderBounds() {
        const boxShape = this.collider.shape;
        return new vec2(boxShape.size.x, boxShape.size.y);
    }
    /**
     * @param scrollColliderBounds - the collider's BoxShape's bounds.
     */
    set scrollColliderBounds(scrollColliderBounds) {
        this.collider.shape = this.createColliderShape(scrollColliderBounds);
    }
    createCollider(debugDrawEnabled, scrollAreaBounds) {
        const collider = this.container.createComponent("Physics.ColliderComponent");
        collider.debugDrawEnabled = debugDrawEnabled;
        collider.fitVisual = false;
        collider.shape = this.createColliderShape(scrollAreaBounds);
        return collider;
    }
    stopEventPropagationOnDragging(event) {
        if (this.isDragging) {
            event.stopPropagation();
        }
    }
    stopEventPropagationOutsideScrollArea(event) {
        if (event.interactor.targetHitPosition !== null &&
            !this.screenTransform.containsWorldPoint(event.interactor.targetHitPosition)) {
            event.stopPropagation();
        }
    }
    createInteractable() {
        const interactable = this.parentScreenTransform.getSceneObject().createComponent(Interactable_1.Interactable.getTypeName());
        (0, validate_1.validate)(interactable, "Couldn't create an Interactable. Interactable typename is undefined.");
        interactable.useFilteredPinch = true;
        interactable.keepHoverOnTrigger = true;
        // Hover
        interactable.onInteractorHoverEnter.add((event) => {
            (0, validate_1.validate)(this.interactable);
            const planeIntersection = event.interactor.raycastPlaneIntersection(this.interactable);
            const outsideScrollCanvas = planeIntersection === null || !this.screenTransform.containsWorldPoint(planeIntersection);
            // If this hover enter comes from an existing interaction, we don't want to clear the Interactable.
            const wasTriggering = event.interactor.previousTrigger !== Interactor_1.InteractorTriggerType.None &&
                event.interactor.previousInteractable === event.target;
            if (outsideScrollCanvas && !wasTriggering) {
                event.stopPropagation();
                event.interactor.clearCurrentInteractable();
            }
            if (!this.isFocused && !outsideScrollCanvas) {
                this.isFocused = true;
                this.onFocusEnterEvent.invoke({
                    position: planeIntersection
                });
            }
            else if (this.isFocused && outsideScrollCanvas) {
                if (interactable.hoveringInteractor === Interactor_1.InteractorInputType.None) {
                    this.isFocused = false;
                    this.onFocusExitEvent.invoke({
                        position: planeIntersection
                    });
                }
            }
        });
        interactable.onHoverUpdate.add((event) => {
            (0, validate_1.validate)(this.interactable);
            const planeIntersection = event.interactor.raycastPlaneIntersection(this.interactable);
            const outsideScrollCanvas = planeIntersection === null || !this.screenTransform.containsWorldPoint(planeIntersection);
            if (outsideScrollCanvas) {
                event.stopPropagation();
            }
            if (this.isFocused && outsideScrollCanvas) {
                if (interactable.hoveringInteractor === Interactor_1.InteractorInputType.None) {
                    this.isFocused = false;
                    this.onFocusExitEvent.invoke({
                        position: planeIntersection
                    });
                }
            }
            else if (!this.isFocused && !outsideScrollCanvas) {
                this.isFocused = true;
                this.onFocusEnterEvent.invoke({
                    position: planeIntersection
                });
            }
        });
        interactable.onHoverExit.add((event) => {
            (0, validate_1.validate)(this.interactable);
            const planeIntersection = event.interactor.raycastPlaneIntersection(this.interactable);
            const outsideScrollCanvas = planeIntersection === null || !this.screenTransform.containsWorldPoint(planeIntersection);
            if (this.isFocused && outsideScrollCanvas) {
                if (interactable.hoveringInteractor === Interactor_1.InteractorInputType.None) {
                    this.isFocused = false;
                    this.onFocusExitEvent.invoke({
                        position: planeIntersection
                    });
                }
            }
        });
        interactable.onInteractorTriggerStart.add((event) => {
            this.stopEventPropagationOutsideScrollArea(event);
        });
        interactable.onTriggerUpdate.add((event) => {
            this.stopEventPropagationOutsideScrollArea(event);
        });
        interactable.onTriggerEnd.add((event) => {
            this.stopEventPropagationOutsideScrollArea(event);
            this.stopEventPropagationOnDragging(event);
        });
        // Drag
        interactable.onDragStart.add((event) => {
            if (event.propagationPhase === "BubbleUp" || event.propagationPhase === "Target") {
                this._isDragging = true;
                this.onDragStartEvent.invoke(event);
                this.interactionManager.dispatchEvent({
                    interactor: event.interactor,
                    target: event.target,
                    eventName: "TriggerCanceled",
                    origin: interactable
                });
            }
        });
        interactable.onDragUpdate.add((event) => {
            if (event.propagationPhase === "TrickleDown" || event.propagationPhase === "Target") {
                this.onDragUpdateEvent.invoke(event);
            }
        });
        interactable.onDragEnd.add((event) => {
            if (event.propagationPhase === "TrickleDown" || event.propagationPhase === "Target") {
                // Ensure the target (and ancestors between ScrollArea and target in hierarchy) receives onDragEnd event still.
                if (event.propagationPhase === "TrickleDown") {
                    const ancestorInteractables = [];
                    let ancestor = event.target.sceneObject.getParent();
                    while (ancestor !== interactable.sceneObject) {
                        const ancestorInteractable = ancestor.getComponent(Interactable_1.Interactable.getTypeName());
                        if (ancestorInteractable !== null) {
                            ancestorInteractables.push(ancestorInteractable);
                        }
                        ancestor = ancestor.getParent();
                    }
                    // Trickle down until reaching the target.
                    const trickleDownEvent = event;
                    for (const ancestorInteractable of ancestorInteractables) {
                        ancestorInteractable.dragEnd(trickleDownEvent);
                    }
                    // Invoke dragEnd on the target.
                    const targetEvent = event;
                    targetEvent.propagationPhase = "Target";
                    event.target.dragEnd(targetEvent);
                    // Bubble back up to this Interactable.
                    ancestorInteractables.reverse();
                    const bubbleUpEvent = event;
                    bubbleUpEvent.propagationPhase = "BubbleUp";
                    for (const ancestorInteractable of ancestorInteractables) {
                        ancestorInteractable.dragEnd(bubbleUpEvent);
                    }
                }
                this._isDragging = false;
                this.onDragEndEvent.invoke(event);
            }
        });
        interactable.isScrollable = true;
        interactable.enableInstantDrag = true;
        return interactable;
    }
    /**
     * Converts local units (-1 to 1) to parent units relative to the ScrollView canvas.
     */
    convertLocalUnitsToParentUnits(localUnits) {
        const origin = this.parentScreenTransform.localPointToWorldPoint(vec2.zero());
        const invertQuat = this.parentScreenTransform.getSceneObject().getTransform().getWorldRotation().invert();
        const worldUnits = this.parentScreenTransform.localPointToWorldPoint(localUnits).sub(origin);
        const localAxisAlignedUnits = invertQuat.multiplyVec3(worldUnits);
        const parentUnits = localAxisAlignedUnits.div(this.parentScreenTransform.getTransform().getWorldScale());
        return new vec2(parentUnits.x, parentUnits.y);
    }
}
exports.ScrollArea = ScrollArea;
//# sourceMappingURL=ScrollArea.js.map