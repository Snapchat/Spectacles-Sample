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
exports.ScrollBar = void 0;
var __selfType = requireType("./ScrollBar");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const ScrollView_1 = require("../ScrollView/ScrollView");
const Interactor_1 = require("../../../Core/Interactor/Interactor");
const NativeLogger_1 = require("../../../Utils/NativeLogger");
const validate_1 = require("../../../Utils/validate");
const Interactable_1 = require("../../Interaction/Interactable/Interactable");
const TAG = "ScrollBar";
/**
 * This class represents a scrollbar component that can be used with a ScrollView. It manages the scrollbar's position, size, and interaction events. The class calculates the height offset to prevent the scrollbar mesh from extending past the canvas and integrates with the ScrollView to handle scrolling.
 */
let ScrollBar = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var ScrollBar = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.interactable = null;
            /**
             * The mesh visual of the scroll bar, used to calculate the height offset that should be used to prevent the mesh
             * from extending past the canvas. This mesh will also be disabled whenever setting this component to disabled.
             */
            this._scrollBarMeshVisual = this._scrollBarMeshVisual;
            /**
             * Additional offset (in cm) determining how far the top edge of the ScrollBar mesh should sit from the edge of the
             * canvas when at the top of the content.
             */
            this._boundingHeightOffset = this._boundingHeightOffset;
            this.boundingHeight = 0;
            this.yOrigin = 0;
            this.log = new NativeLogger_1.default(TAG);
        }
        __initialize() {
            super.__initialize();
            this.interactable = null;
            /**
             * The mesh visual of the scroll bar, used to calculate the height offset that should be used to prevent the mesh
             * from extending past the canvas. This mesh will also be disabled whenever setting this component to disabled.
             */
            this._scrollBarMeshVisual = this._scrollBarMeshVisual;
            /**
             * Additional offset (in cm) determining how far the top edge of the ScrollBar mesh should sit from the edge of the
             * canvas when at the top of the content.
             */
            this._boundingHeightOffset = this._boundingHeightOffset;
            this.boundingHeight = 0;
            this.yOrigin = 0;
            this.log = new NativeLogger_1.default(TAG);
        }
        onAwake() {
            this.transform = this.getSceneObject().getTransform();
            this.createEvent("OnStartEvent").bind(() => {
                this.onStart();
            });
        }
        onStart() {
            this.scrollView = this.findScrollView();
            this.scrollViewSceneObject = this.scrollView.getSceneObject();
            this.scrollViewScreenTransform = this.scrollViewSceneObject.getComponent("Component.ScreenTransform");
            this.interactable = this.setupInteractable();
            this.boundingHeight = this.calculateBoundingHeight();
            this.yOrigin = this.scrollViewSceneObject.getTransform().getLocalPosition().y;
            this.setupScrollViewCallbacks();
            this.reset();
        }
        setupInteractable() {
            const interactable = this.getSceneObject().getComponent(Interactable_1.Interactable.getTypeName());
            if (interactable === null) {
                throw new Error("ScrollBar requires an interactable to function.");
            }
            interactable.keepHoverOnTrigger = true;
            interactable.onDragStart((event) => {
                if (event.interactor.dragType === Interactor_1.DragType.Touchpad) {
                    this.touchpadDragUpdate(event);
                }
                else {
                    this.sixDofDragUpdate(event);
                }
            });
            interactable.onDragUpdate((event) => {
                if (event.interactor.dragType === Interactor_1.DragType.Touchpad) {
                    this.touchpadDragUpdate(event);
                }
                else {
                    this.sixDofDragUpdate(event);
                }
            });
            interactable.enableInstantDrag = true;
            return interactable;
        }
        setupScrollViewCallbacks() {
            this.scrollView.onReady.add(() => {
                this.reset();
            });
            this.scrollView.onScrollUpdate.add((event) => {
                this.onScroll(event);
            });
            this.scrollView.onSnapUpdate.add((event) => {
                this.onScroll(event);
            });
        }
        onScroll(_event) {
            (0, validate_1.validate)(this.transform);
            // If there is no overflow, don't move ScrollBar at all.
            if (!this.overflow || !this.scrollPercentage || this.overflow <= 0) {
                return;
            }
            const position = this.transform.getLocalPosition();
            position.y = this.yOrigin + MathUtils.lerp(this.boundingHeight, -this.boundingHeight, this.scrollPercentage);
            this.transform.setLocalPosition(position);
        }
        calculateBoundingHeight() {
            (0, validate_1.validate)(this.scrollViewSceneObject);
            const scrollViewHeight = this.scrollView.scrollAreaSize.y;
            /**
             *  aabbMax returns the maximum value along one side of an axis, unrotated/unscaled.
             * If aabbMax.x = 10 units, then the actual x-length of the mesh (before scaling) is 20 units.
             */
            let aabb = this.scrollBarMeshVisual?.mesh.aabbMax ?? vec3.zero();
            // In the case that the mesh is scaled/rotated, transform the AABB dimensions.
            aabb = this.getTransform().getWorldScale().scale(aabb);
            aabb = this.getSceneObject().getTransform().getWorldRotation().multiplyVec3(aabb);
            const localAabb = this.scrollViewSceneObject.getTransform().getInvertedWorldTransform().multiplyDirection(aabb);
            const boundingHeight = scrollViewHeight / 2 - localAabb.y - this.boundingHeightOffset;
            if (boundingHeight <= 0) {
                this.log.e(`Bounding height of the ScrollBar is negative. Reduce the boundingHeightOffset parameter for proper ScrollBar behavior.`);
            }
            return boundingHeight;
        }
        touchpadDragUpdate(event) {
            (0, validate_1.validate)(this.scrollPercentage);
            const deltaY = event.dragVector.y;
            const newPercentage = this.scrollPercentage - deltaY / (this.boundingHeight * 2);
            if (newPercentage < 0 || newPercentage > 1) {
                this.scrollToEdge(newPercentage < 0);
                return;
            }
            this.scrollView.scrollBy(new vec2(0, deltaY * this.scrollRatio));
        }
        sixDofDragUpdate(event) {
            (0, validate_1.validate)(this.scrollViewScreenTransform);
            (0, validate_1.validate)(this.scrollPercentage);
            if (event.interactor.planecastPoint !== null && event.planecastDragVector !== null) {
                const newDragPoint = event.interactor.planecastPoint;
                const deltaY = this.localizeDragVector(event.planecastDragVector).y;
                if (this.scrollViewScreenTransform.worldPointToLocalPoint(newDragPoint).y >= 1) {
                    this.scrollToEdge(true);
                    return;
                }
                if (this.scrollViewScreenTransform.worldPointToLocalPoint(newDragPoint).y <= -1) {
                    this.scrollToEdge(false);
                    return;
                }
                const newPercentage = this.scrollPercentage - deltaY / (this.boundingHeight * 2);
                if (newPercentage < 0 || newPercentage > 1) {
                    this.scrollToEdge(newPercentage < 0);
                    return;
                }
                this.scrollView.scrollBy(new vec2(0, deltaY * this.scrollRatio));
            }
        }
        get scrollRatio() {
            (0, validate_1.validate)(this.overflow);
            return -this.overflow / (this.boundingHeight * 2);
        }
        localizeDragVector(dragVector) {
            (0, validate_1.validate)(this.scrollViewSceneObject);
            const transform = this.scrollViewSceneObject.getTransform();
            const localXAxis = transform.getWorldRotation().multiplyVec3(vec3.right());
            const localYAxis = transform.getWorldRotation().multiplyVec3(vec3.up());
            const localizedX = localXAxis.dot(dragVector) / transform.getWorldScale().x;
            const localizedY = localYAxis.dot(dragVector) / transform.getWorldScale().y;
            return new vec2(localizedX, localizedY);
        }
        scrollToEdge(topEdge) {
            (0, validate_1.validate)(this.scrollPercentage);
            (0, validate_1.validate)(this.overflow);
            const adjustedPercentage = topEdge ? this.scrollPercentage : -(1 - this.scrollPercentage);
            this.scrollView.scrollBy(new vec2(0, -adjustedPercentage * this.overflow));
        }
        // Search through the siblings of this SceneObject to allow for the script instantiation use case.
        findScrollView() {
            const parent = this.getSceneObject().getParent();
            const children = parent?.children ?? null;
            if (children === null) {
                throw new Error("Sibling SceneObject with ScrollView component not found. Ensure that the ScrollView owner is a sibling of the ScrollBar owner.");
            }
            for (const child of children) {
                const scrollView = child.getComponent(ScrollView_1.ScrollView.getTypeName());
                if (scrollView !== null) {
                    return scrollView;
                }
            }
            throw new Error("Sibling SceneObject with ScrollView component not found. Ensure that the ScrollView owner is a sibling of the ScrollBar owner.");
        }
        get scrollPercentage() {
            return this.scrollView.scrollPercentage;
        }
        get overflow() {
            return this.scrollView.overflow;
        }
        get scrollBarMeshVisual() {
            return this._scrollBarMeshVisual;
        }
        set scrollBarMeshVisual(mesh) {
            this._scrollBarMeshVisual = mesh;
            this.boundingHeight = this.calculateBoundingHeight();
        }
        /**
         * @returns how far (in cm) the top edge of the ScrollBar mesh should sit from the edge of the canvas when at the top of the content.
         */
        get boundingHeightOffset() {
            return this._boundingHeightOffset;
        }
        /**
         * Sets the offset between the top edge of the mesh and the edge of the canvas.
         * @param offset - how far (in cm) the top edge of the ScrollBar mesh should sit from the edge of the canvas when at the top of the content.
         */
        set boundingHeightOffset(offset) {
            this._boundingHeightOffset = offset;
            this.boundingHeight = this.calculateBoundingHeight();
        }
        get isEnabled() {
            return this.scrollBarMeshVisual?.enabled ?? false;
        }
        set isEnabled(enabled) {
            (0, validate_1.validate)(this.scrollBarMeshVisual);
            this.scrollBarMeshVisual.enabled = enabled;
        }
        reset() {
            // If the ScrollView has not been found yet due to script execution ordering, then defer the reset for later.
            if (!this.scrollView) {
                return;
            }
            (0, validate_1.validate)(this.scrollViewSceneObject);
            (0, validate_1.validate)(this.transform);
            this.boundingHeight = this.calculateBoundingHeight();
            this.yOrigin = this.scrollViewSceneObject.getTransform().getLocalPosition().y;
            const position = this.transform.getLocalPosition();
            position.y = this.yOrigin + MathUtils.lerp(this.boundingHeight, -this.boundingHeight, this.scrollPercentage);
            this.transform.setLocalPosition(position);
        }
    };
    __setFunctionName(_classThis, "ScrollBar");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ScrollBar = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ScrollBar = _classThis;
})();
exports.ScrollBar = ScrollBar;
//# sourceMappingURL=ScrollBar.js.map