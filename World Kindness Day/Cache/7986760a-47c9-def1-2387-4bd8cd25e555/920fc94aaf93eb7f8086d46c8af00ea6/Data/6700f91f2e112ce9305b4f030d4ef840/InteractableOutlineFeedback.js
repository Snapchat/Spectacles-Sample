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
exports.InteractableOutlineFeedback = void 0;
var __selfType = requireType("./InteractableOutlineFeedback");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const validate_1 = require("../../Utils/validate");
const Interactable_1 = require("../Interaction/Interactable/Interactable");
/**
 * This class provides visual feedback by adding an outline to mesh visuals when they are hovered or pinched. It allows
 * customization of the outline color, thickness, and target meshes.
 */
let InteractableOutlineFeedback = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var InteractableOutlineFeedback = _classThis = class extends _classSuper {
        constructor() {
            super();
            /**
             * This is the material that will provide the mesh outline.
             */
            this.targetOutlineMaterial = this.targetOutlineMaterial;
            /**
             * This is the color of the outline when hovered.
             */
            this.hoveringColor = this.hoveringColor;
            /**
             * This is the color of the outline when triggered.
             */
            this.activatingColor = this.activatingColor;
            /**
             * This is the thickness of the outline.
             */
            this.outlineWeight = this.outlineWeight;
            /**
             * These are the meshes that will be outlined on pinch/hover.
             */
            this.meshVisuals = this.meshVisuals;
            this.interactable = null;
            this.outlineEnabled = true;
        }
        __initialize() {
            super.__initialize();
            /**
             * This is the material that will provide the mesh outline.
             */
            this.targetOutlineMaterial = this.targetOutlineMaterial;
            /**
             * This is the color of the outline when hovered.
             */
            this.hoveringColor = this.hoveringColor;
            /**
             * This is the color of the outline when triggered.
             */
            this.activatingColor = this.activatingColor;
            /**
             * This is the thickness of the outline.
             */
            this.outlineWeight = this.outlineWeight;
            /**
             * These are the meshes that will be outlined on pinch/hover.
             */
            this.meshVisuals = this.meshVisuals;
            this.interactable = null;
            this.outlineEnabled = true;
        }
        onAwake() {
            this.defineScriptEvents();
        }
        defineScriptEvents() {
            this.createEvent("OnStartEvent").bind(() => {
                this.init();
                this.createEvent("OnEnableEvent").bind(() => {
                    this.outlineEnabled = true;
                });
                this.createEvent("OnDisableEvent").bind(() => {
                    this.outlineEnabled = false;
                    this.removeMaterialFromRenderMeshArray();
                });
            });
        }
        init() {
            this.highlightMaterial = this.targetOutlineMaterial.clone();
            this.highlightMaterial.mainPass.lineWeight = this.outlineWeight;
            this.highlightMaterial.mainPass.lineColor = this.hoveringColor;
            this.interactable = this.getSceneObject().getComponent(Interactable_1.Interactable.getTypeName());
            if (!this.interactable) {
                throw new Error("No interactable was found - please ensure that a component matching the Interactable typename provided was added to this SceneObject.");
            }
            this.setupInteractableCallbacks();
        }
        addMaterialToRenderMeshArray() {
            if (!this.outlineEnabled) {
                return;
            }
            for (let i = 0; i < this.meshVisuals.length; i++) {
                const matCount = this.meshVisuals[i].getMaterialsCount();
                let addMaterial = true;
                for (let k = 0; k < matCount; k++) {
                    const material = this.meshVisuals[i].getMaterial(k);
                    if (this.highlightMaterial !== undefined && material.isSame(this.highlightMaterial)) {
                        addMaterial = false;
                        break;
                    }
                }
                if (this.highlightMaterial !== undefined && addMaterial) {
                    const materials = this.meshVisuals[i].materials;
                    materials.unshift(this.highlightMaterial);
                    this.meshVisuals[i].materials = materials;
                }
            }
        }
        removeMaterialFromRenderMeshArray() {
            for (let i = 0; i < this.meshVisuals.length; i++) {
                const materials = [];
                const matCount = this.meshVisuals[i].getMaterialsCount();
                for (let k = 0; k < matCount; k++) {
                    const material = this.meshVisuals[i].getMaterial(k);
                    if (this.highlightMaterial !== undefined && material.isSame(this.highlightMaterial)) {
                        continue;
                    }
                    materials.push(material);
                }
                this.meshVisuals[i].clearMaterials();
                for (let k = 0; k < materials.length; k++) {
                    this.meshVisuals[i].addMaterial(materials[k]);
                }
            }
        }
        setupInteractableCallbacks() {
            (0, validate_1.validate)(this.interactable);
            this.interactable.onHoverEnter.add((event) => {
                this.addMaterialToRenderMeshArray();
                if (event.interactor.isTriggering) {
                    this.setHighlightColor(this.activatingColor);
                }
            });
            this.interactable.onHoverExit.add((event) => {
                if (this.interactable?.keepHoverOnTrigger && event.interactor.isTriggering) {
                    return;
                }
                this.removeMaterialFromRenderMeshArray();
            });
            this.interactable.onTriggerStart.add(() => {
                this.setHighlightColor(this.activatingColor);
            });
            this.interactable.onTriggerEnd.add(() => {
                this.setHighlightColor(this.hoveringColor);
            });
            this.interactable.onTriggerEndOutside.add(() => {
                this.setHighlightColor(this.hoveringColor);
                this.removeMaterialFromRenderMeshArray();
            });
            this.interactable.onTriggerCanceled.add(() => {
                this.setHighlightColor(this.hoveringColor);
                this.removeMaterialFromRenderMeshArray();
            });
            this.interactable.onSyncHoverEnter.add((event) => {
                this.addMaterialToRenderMeshArray();
                if (event.interactor.isTriggering) {
                    this.setHighlightColor(this.activatingColor);
                }
            });
            this.interactable.onSyncHoverExit.add((event) => {
                if (this.interactable?.keepHoverOnTrigger && event.interactor.isTriggering) {
                    return;
                }
                this.removeMaterialFromRenderMeshArray();
            });
            this.interactable.onSyncTriggerStart.add(() => {
                this.setHighlightColor(this.activatingColor);
            });
            this.interactable.onSyncTriggerEnd.add(() => {
                this.setHighlightColor(this.hoveringColor);
            });
            this.interactable.onSyncTriggerEndOutside.add(() => {
                this.setHighlightColor(this.hoveringColor);
                this.removeMaterialFromRenderMeshArray();
            });
            this.interactable.onSyncTriggerCanceled.add(() => {
                this.setHighlightColor(this.hoveringColor);
                this.removeMaterialFromRenderMeshArray();
            });
        }
        setHighlightColor(color) {
            (0, validate_1.validate)(this.highlightMaterial);
            this.highlightMaterial.mainPass.lineColor = color;
        }
    };
    __setFunctionName(_classThis, "InteractableOutlineFeedback");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        InteractableOutlineFeedback = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return InteractableOutlineFeedback = _classThis;
})();
exports.InteractableOutlineFeedback = InteractableOutlineFeedback;
//# sourceMappingURL=InteractableOutlineFeedback.js.map