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
exports.ExhaustControls = void 0;
var __selfType = requireType("./ExhaustControls");
function component(target) { target.getTypeName = function () { return __selfType; }; }
/**
 * This class manages the exhaust and smoke effects for a scene. It initializes the materials and VFX components for the exhausts and smokes, and provides methods to control their states.
 *
 */
let ExhaustControls = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var ExhaustControls = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.exhausts = this.exhausts;
            this.smokes = this.smokes;
            this.exhaustFireMaterials = [];
            this.exhaustGlowMaterials = [];
            this.smokeVFXs = [];
            this.initExhaustMaterials = () => {
                for (let i = 0; i < this.exhausts.length; i++) {
                    this.exhaustFireMaterials.push(this.exhausts[i].getChild(0).getComponent("RenderMeshVisual").mainMaterial);
                    this.exhaustGlowMaterials.push(this.exhausts[i].getChild(0).getChild(0).getComponent("RenderMeshVisual").mainMaterial);
                }
            };
            this.initSmokeVFXs = () => {
                for (let i = 0; i < this.smokes.length; i++) {
                    this.smokeVFXs.push(this.smokes[i].getComponent("Component.VFXComponent"));
                }
            };
            this.engineReady = () => {
                for (let i = 0; i < this.exhausts.length; i++) {
                    this.exhausts[i].enabled = true;
                    this.exhaustFireMaterials[i].mainPass.fire_scale = 1.0;
                    this.exhaustGlowMaterials[i].mainPass.glow_scale = 1.0;
                }
            };
            this.turnOnExhausts = () => {
                for (let i = 0; i < this.exhausts.length; i++) {
                    this.exhausts[i].enabled = true;
                    this.exhaustFireMaterials[i].mainPass.fire_scale = 0.15;
                    this.exhaustGlowMaterials[i].mainPass.glow_scale = 0.15;
                }
            };
            this.turnOffExhausts = () => {
                for (let i = 0; i < this.exhausts.length; i++) {
                    this.exhausts[i].enabled = false;
                    this.exhaustFireMaterials[i].mainPass.fire_scale = 0.0;
                    this.exhaustGlowMaterials[i].mainPass.glow_scale = 0.0;
                }
            };
            this.turnOnSmokes = () => {
                for (let i = 0; i < this.smokes.length; i++) {
                    this.smokes[i].enabled = true;
                }
            };
            this.turnOffSmokes = () => {
                for (let i = 0; i < this.smokes.length; i++) {
                    this.smokes[i].enabled = false;
                }
            };
            this.setEngineSmokesValue = (value) => {
                for (let i = 0; i < this.smokes.length; i++) {
                    const particles = this.smokeVFXs[i].asset.properties;
                    particles["particlesReduce"] = value;
                }
            };
        }
        __initialize() {
            super.__initialize();
            this.exhausts = this.exhausts;
            this.smokes = this.smokes;
            this.exhaustFireMaterials = [];
            this.exhaustGlowMaterials = [];
            this.smokeVFXs = [];
            this.initExhaustMaterials = () => {
                for (let i = 0; i < this.exhausts.length; i++) {
                    this.exhaustFireMaterials.push(this.exhausts[i].getChild(0).getComponent("RenderMeshVisual").mainMaterial);
                    this.exhaustGlowMaterials.push(this.exhausts[i].getChild(0).getChild(0).getComponent("RenderMeshVisual").mainMaterial);
                }
            };
            this.initSmokeVFXs = () => {
                for (let i = 0; i < this.smokes.length; i++) {
                    this.smokeVFXs.push(this.smokes[i].getComponent("Component.VFXComponent"));
                }
            };
            this.engineReady = () => {
                for (let i = 0; i < this.exhausts.length; i++) {
                    this.exhausts[i].enabled = true;
                    this.exhaustFireMaterials[i].mainPass.fire_scale = 1.0;
                    this.exhaustGlowMaterials[i].mainPass.glow_scale = 1.0;
                }
            };
            this.turnOnExhausts = () => {
                for (let i = 0; i < this.exhausts.length; i++) {
                    this.exhausts[i].enabled = true;
                    this.exhaustFireMaterials[i].mainPass.fire_scale = 0.15;
                    this.exhaustGlowMaterials[i].mainPass.glow_scale = 0.15;
                }
            };
            this.turnOffExhausts = () => {
                for (let i = 0; i < this.exhausts.length; i++) {
                    this.exhausts[i].enabled = false;
                    this.exhaustFireMaterials[i].mainPass.fire_scale = 0.0;
                    this.exhaustGlowMaterials[i].mainPass.glow_scale = 0.0;
                }
            };
            this.turnOnSmokes = () => {
                for (let i = 0; i < this.smokes.length; i++) {
                    this.smokes[i].enabled = true;
                }
            };
            this.turnOffSmokes = () => {
                for (let i = 0; i < this.smokes.length; i++) {
                    this.smokes[i].enabled = false;
                }
            };
            this.setEngineSmokesValue = (value) => {
                for (let i = 0; i < this.smokes.length; i++) {
                    const particles = this.smokeVFXs[i].asset.properties;
                    particles["particlesReduce"] = value;
                }
            };
        }
        onAwake() {
            this.initExhaustMaterials();
            this.initSmokeVFXs();
            this.turnOffExhausts();
            this.turnOffSmokes();
        }
    };
    __setFunctionName(_classThis, "ExhaustControls");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ExhaustControls = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ExhaustControls = _classThis;
})();
exports.ExhaustControls = ExhaustControls;
//# sourceMappingURL=ExhaustControls.js.map