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
exports.CursorControllerProvider = void 0;
const Singleton_1 = require("../../Decorators/Singleton");
const NativeLogger_1 = require("../../Utils/NativeLogger");
const validate_1 = require("../../Utils/validate");
const TAG = "CursorControllerProvider";
/**
 * This singleton class manages the registration and retrieval of InteractorCursor instances. It ensures that each Interactor has a unique cursor and provides methods to get cursors by their associated Interactor.
 * When retrieving cursors, make sure to only invoke getCursor APIs during or after the OnStartEvent of a script.
 */
let CursorControllerProvider = (() => {
    let _classDecorators = [Singleton_1.Singleton];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var CursorControllerProvider = _classThis = class {
        constructor() {
            this.log = new NativeLogger_1.default(TAG);
            this.cursors = new Map();
            this.defaultUseV2 = false;
        }
        setDefaultUseV2(useV2) {
            this.defaultUseV2 = useV2;
        }
        getDefaultUseV2() {
            return this.defaultUseV2;
        }
        registerCursor(cursor, interactor = null) {
            if (cursor.interactor !== null) {
                interactor = cursor.interactor;
            }
            (0, validate_1.validate)(interactor, "InteractorCursor must have a set Interactor before registering to SIK.CursorController.");
            if (this.cursors.has(interactor)) {
                this.log.e(`Multiple cursors for a single Interactor have been registered.\nThe CursorController and InteractorCursor components cannot both be present in the scene hierarchy before runtime, use one or the other.`);
                return;
            }
            this.cursors.set(interactor, cursor);
        }
        /**
         * @deprecated in favor of getCursorByInteractor
         * Gets the InteractorCursor for a specified interactor
         * @param interactor The interactor to get the cursor for
         * @returns the InteractorCursor for the requested interactor, or null if it doesn't exist
         */
        getCursor(interactor) {
            return this.getCursorByInteractor(interactor);
        }
        /**
         * Gets the InteractorCursor for a specified interactor
         * @param interactor The interactor to get the cursor for
         * @returns the InteractorCursor for the requested interactor, or null if it doesn't exist
         */
        getCursorByInteractor(interactor) {
            return this.cursors.get(interactor) ?? null;
        }
        /**
         * Gets the InteractorCursor for a specified input type
         * @param inputType The InteractorInputType to get the cursor for
         * @returns the InteractorCursor for the requested InteractorInputType, or null if it doesn't exist
         */
        getCursorByInputType(inputType) {
            let interactor;
            for (const mapInteractor of this.cursors.keys()) {
                if (mapInteractor.inputType === inputType) {
                    interactor = mapInteractor;
                    break;
                }
            }
            return interactor !== undefined ? this.getCursorByInteractor(interactor) : null;
        }
        /**
         * Gets all InteractorCursors within the scene
         * @returns a list of InteractorCursors
         */
        getAllCursors() {
            return Array.from(this.cursors.values());
        }
    };
    __setFunctionName(_classThis, "CursorControllerProvider");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CursorControllerProvider = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CursorControllerProvider = _classThis;
})();
exports.CursorControllerProvider = CursorControllerProvider;
//# sourceMappingURL=CursorControllerProvider.js.map