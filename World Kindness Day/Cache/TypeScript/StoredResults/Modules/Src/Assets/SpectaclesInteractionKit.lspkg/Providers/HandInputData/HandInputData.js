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
exports.HandInputData = void 0;
const Singleton_1 = require("../../Decorators/Singleton");
const TrackedHand_1 = require("./TrackedHand");
/**
 * Main class for the hand data provider apis.
 * Available apis:
 * - getHand(handType: {@link HandType}) => {@link BaseHand} returns BaseHand Object that
 * represents {@link HandType}
 * - getDominantHand() => {@link BaseHand} returns BaseHand Object that
 * represents the dominant hand as specified in the system through a Tweak.
 * - getNonDominantHand() => {@link BaseHand} returns BaseHand Object that
 * represents the non dominant hand as specified in the system through a Tweak.
 */
let HandInputData = (() => {
    let _classDecorators = [Singleton_1.Singleton];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var HandInputData = _classThis = class {
        constructor() {
            this._enabled = true;
            this.config = {
                dominantHand: "right"
            };
            this.leftHand = this.createHand("left");
            this.rightHand = this.createHand("right");
        }
        /**
         * Sets the enabled state of the left and right hand.
         * Events will not be called if isEnabled is set to false.
         */
        set enabled(enabled) {
            if (this._enabled === enabled) {
                return;
            }
            this.leftHand.setEnabled(enabled);
            this.rightHand.setEnabled(enabled);
            this._enabled = enabled;
        }
        createHand(handType) {
            return new TrackedHand_1.default({
                handType: handType,
                isDominantHand: handType === this.config.dominantHand
            });
        }
        getHand(handType) {
            return handType === "left" ? this.leftHand : this.rightHand;
        }
        getDominantHand() {
            return this.getHand(this.config.dominantHand);
        }
        getNonDominantHand() {
            const nonDominantHandType = this.config.dominantHand === "right" ? "left" : "right";
            return this.getHand(nonDominantHandType);
        }
        setDominantHand(dominant) {
            this.config.dominantHand = dominant;
            this.getHand("left").setIsDominantHand(dominant === "left");
            this.getHand("right").setIsDominantHand(dominant === "right");
        }
    };
    __setFunctionName(_classThis, "HandInputData");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        HandInputData = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return HandInputData = _classThis;
})();
exports.HandInputData = HandInputData;
//# sourceMappingURL=HandInputData.js.map