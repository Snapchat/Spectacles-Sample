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
exports.ToggleFeedback = void 0;
var __selfType = requireType("./ToggleFeedback");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const validate_1 = require("../../Utils/validate");
const Interactable_1 = require("../Interaction/Interactable/Interactable");
const ToggleButton_1 = require("../UI/ToggleButton/ToggleButton");
/**
 * This class provides visual feedback for a {@link ToggleButton} by changing the material of the provided
 * {@link RenderMeshVisual}s when the button is toggled on or off.
 */
let ToggleFeedback = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var ToggleFeedback = _classThis = class extends _classSuper {
        constructor() {
            super();
            /**
             * The material applied to the toggle button when it's in the "off" state and not being interacted with. This
             * defines the button's default visual appearance when it's unchecked.
             */
            this.toggledOffMaterial = this.toggledOffMaterial;
            /**
             * The material applied to the toggle button when it's in the "off" state and being actively triggered. This
             * provides visual feedback during active interaction with an unchecked button.
             */
            this.toggledOffSelectMaterial = this.toggledOffSelectMaterial;
            /**
             * The material applied to the toggle button when it's in the "on" state and not being interacted with. This
             * defines the button's visual appearance when it's enabled/checked.
             */
            this.toggledOnMaterial = this.toggledOnMaterial;
            /**
             * The material applied to the toggle button when it's in the "on" state and being actively triggered. This
             * provides visual feedback during active interaction with a checked button.
             */
            this.toggledOnSelectMaterial = this.toggledOnSelectMaterial;
            /**
             * The material applied to the toggle button when it's disabled and cannot be interacted with. This provides visual
             * feedback that the button is currently inactive.
             */
            this.disabledMaterial = this.disabledMaterial;
            /**
             * An array of RenderMeshVisual components whose materials will be updated to reflect the toggle button's
             * current state.
             */
            this.meshVisuals = this.meshVisuals;
            this.toggleButton = null;
            this.interactable = null;
            this.materials = [];
        }
        __initialize() {
            super.__initialize();
            /**
             * The material applied to the toggle button when it's in the "off" state and not being interacted with. This
             * defines the button's default visual appearance when it's unchecked.
             */
            this.toggledOffMaterial = this.toggledOffMaterial;
            /**
             * The material applied to the toggle button when it's in the "off" state and being actively triggered. This
             * provides visual feedback during active interaction with an unchecked button.
             */
            this.toggledOffSelectMaterial = this.toggledOffSelectMaterial;
            /**
             * The material applied to the toggle button when it's in the "on" state and not being interacted with. This
             * defines the button's visual appearance when it's enabled/checked.
             */
            this.toggledOnMaterial = this.toggledOnMaterial;
            /**
             * The material applied to the toggle button when it's in the "on" state and being actively triggered. This
             * provides visual feedback during active interaction with a checked button.
             */
            this.toggledOnSelectMaterial = this.toggledOnSelectMaterial;
            /**
             * The material applied to the toggle button when it's disabled and cannot be interacted with. This provides visual
             * feedback that the button is currently inactive.
             */
            this.disabledMaterial = this.disabledMaterial;
            /**
             * An array of RenderMeshVisual components whose materials will be updated to reflect the toggle button's
             * current state.
             */
            this.meshVisuals = this.meshVisuals;
            this.toggleButton = null;
            this.interactable = null;
            this.materials = [];
        }
        onAwake() {
            this.materials = [
                this.toggledOffMaterial,
                this.toggledOffSelectMaterial,
                this.toggledOnMaterial,
                this.toggledOnSelectMaterial,
                this.disabledMaterial
            ];
            this.defineScriptEvents();
        }
        defineScriptEvents() {
            this.createEvent("OnStartEvent").bind(() => {
                this.init();
            });
        }
        init() {
            this.toggleButton = this.getSceneObject().getComponent(ToggleButton_1.ToggleButton.getTypeName());
            this.interactable = this.getSceneObject().getComponent(Interactable_1.Interactable.getTypeName());
            if (this.interactable === null || this.interactable === undefined) {
                throw new Error("UIToggleButtonCustomize script requires an Interactable on the ToggleButton");
            }
            this.setupInteractableCallbacks(this.interactable);
        }
        removeMaterials() {
            for (let i = 0; i < this.meshVisuals.length; i++) {
                const materials = [];
                const matCount = this.meshVisuals[i].getMaterialsCount();
                for (let k = 0; k < matCount; k++) {
                    const material = this.meshVisuals[i].getMaterial(k);
                    if (this.materials.includes(material)) {
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
        // Changes the material of each RenderMeshVisual provided.
        changeMeshes(material) {
            (0, validate_1.validate)(material);
            this.removeMaterials();
            this.meshVisuals.forEach((mesh) => {
                mesh.addMaterial(material);
            });
        }
        /**
         * Changes the materials depending on the {@link ToggleButton}'s status.
         * @param materialOn - The material to be used if on.
         * @param materialOff - The material to be used if off.
         */
        changeToggleOnMesh(materialOn, materialOff) {
            (0, validate_1.validate)(this.toggleButton);
            this.changeMeshes(this.toggleButton.isToggledOn ? materialOn : materialOff);
        }
        // Sets up interactable callbacks.
        setupInteractableCallbacks(interactable) {
            (0, validate_1.validate)(this.toggleButton);
            interactable.onTriggerStart.add(() => {
                this.changeToggleOnMesh(this.toggledOnSelectMaterial, this.toggledOffSelectMaterial);
            });
            interactable.onTriggerEndOutside.add(() => {
                this.changeToggleOnMesh(this.toggledOnMaterial, this.toggledOffMaterial);
            });
            interactable.onTriggerCanceled.add(() => {
                this.changeToggleOnMesh(this.toggledOnMaterial, this.toggledOffMaterial);
            });
            interactable.onSyncTriggerStart.add(() => {
                this.changeToggleOnMesh(this.toggledOnSelectMaterial, this.toggledOffSelectMaterial);
            });
            interactable.onSyncTriggerEndOutside.add(() => {
                this.changeToggleOnMesh(this.toggledOnMaterial, this.toggledOffMaterial);
            });
            interactable.onSyncTriggerCanceled.add(() => {
                this.changeToggleOnMesh(this.toggledOnMaterial, this.toggledOffMaterial);
            });
            this.toggleButton.createEvent("OnEnableEvent").bind(() => {
                this.changeToggleOnMesh(this.toggledOnMaterial, this.toggledOffMaterial);
            });
            this.toggleButton.createEvent("OnDisableEvent").bind(() => {
                this.changeMeshes(this.disabledMaterial);
            });
            this.toggleButton.onStateChanged.add((isToggledOn) => {
                if (this.toggleButton?.enabled === false) {
                    this.changeMeshes(this.disabledMaterial);
                    return;
                }
                this.changeMeshes(isToggledOn ? this.toggledOnMaterial : this.toggledOffMaterial);
            });
        }
    };
    __setFunctionName(_classThis, "ToggleFeedback");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ToggleFeedback = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ToggleFeedback = _classThis;
})();
exports.ToggleFeedback = ToggleFeedback;
//# sourceMappingURL=ToggleFeedback.js.map