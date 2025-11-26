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
exports.SIKLogLevelConfiguration = void 0;
var __selfType = requireType("./SIKLogLevelConfiguration");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const SIKLogLevelProvider_1 = require("../../Providers/InteractionConfigurationProvider/SIKLogLevelProvider");
const InteractionManager_1 = require("../InteractionManager/InteractionManager");
const LogLevelConfiguration_1 = require("./LogLevelConfiguration");
/**
 * Allows the user to select the log level filter for SIK types from a lens studio component.
 */
let SIKLogLevelConfiguration = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = LogLevelConfiguration_1.LogLevelConfiguration;
    var SIKLogLevelConfiguration = _classThis = class extends _classSuper {
        constructor() {
            super();
            // TODO: Should we rename this back to Configuration? Or keep the debug logic in InteractionManager (which isn't a component)?
            this.SIKLogLevelProvider = SIKLogLevelProvider_1.default.getInstance();
            this.interactionManager = InteractionManager_1.InteractionManager.getInstance();
            this._debugModeEnabled = this._debugModeEnabled;
        }
        __initialize() {
            super.__initialize();
            // TODO: Should we rename this back to Configuration? Or keep the debug logic in InteractionManager (which isn't a component)?
            this.SIKLogLevelProvider = SIKLogLevelProvider_1.default.getInstance();
            this.interactionManager = InteractionManager_1.InteractionManager.getInstance();
            this._debugModeEnabled = this._debugModeEnabled;
        }
        onAwake() {
            this.SIKLogLevelProvider.logLevel = this.logLevelFilter;
            this.debugModeEnabled = this._debugModeEnabled;
        }
        set debugModeEnabled(enabled) {
            this._debugModeEnabled = enabled;
            this.interactionManager.debugModeEnabled = enabled;
        }
        get debugModeEnabled() {
            return this._debugModeEnabled;
        }
    };
    __setFunctionName(_classThis, "SIKLogLevelConfiguration");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SIKLogLevelConfiguration = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SIKLogLevelConfiguration = _classThis;
})();
exports.SIKLogLevelConfiguration = SIKLogLevelConfiguration;
//# sourceMappingURL=SIKLogLevelConfiguration.js.map