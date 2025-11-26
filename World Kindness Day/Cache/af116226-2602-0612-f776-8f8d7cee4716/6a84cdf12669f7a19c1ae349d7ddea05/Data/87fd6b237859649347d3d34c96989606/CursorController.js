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
exports.CursorController = void 0;
var __selfType = requireType("./CursorController");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const Interactor_1 = require("../../../Core/Interactor/Interactor");
const InteractionManager_1 = require("../../../Core/InteractionManager/InteractionManager");
const CursorControllerProvider_1 = require("../../../Providers/CursorControllerProvider/CursorControllerProvider");
const InteractorRayVisual_1 = require("../InteractorRayVisual/InteractorRayVisual");
const InteractorCursor_1 = require("./InteractorCursor");
/**
 * This class manages the creation and retrieval of InteractorCursor instances for interactors. It initializes cursors for all interactors on awake and provides methods to get cursors by interactor or input type.
 */
let CursorController = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var CursorController = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.cursorControllerProvider = CursorControllerProvider_1.CursorControllerProvider.getInstance();
            this.useV2 = this.useV2;
            /**
             * Enable debug rendering for cursors (cone collider, center ray, and closest-point helpers)
             */
            this.drawDebug = this.drawDebug;
        }
        __initialize() {
            super.__initialize();
            this.cursorControllerProvider = CursorControllerProvider_1.CursorControllerProvider.getInstance();
            this.useV2 = this.useV2;
            /**
             * Enable debug rendering for cursors (cone collider, center ray, and closest-point helpers)
             */
            this.drawDebug = this.drawDebug;
        }
        onAwake() {
            this.createEvent("OnStartEvent").bind(() => {
                this.onStart();
            });
        }
        onStart() {
            const interactors = InteractionManager_1.InteractionManager.getInstance().getInteractorsByType(Interactor_1.InteractorInputType.All);
            this.cursorControllerProvider.setDefaultUseV2(this.useV2);
            interactors.forEach((interactor) => {
                const cursor = this.getSceneObject().createComponent(InteractorCursor_1.InteractorCursor.getTypeName());
                cursor.interactor = interactor;
                cursor.init(this, this.useV2);
                cursor.drawDebug = this.drawDebug;
                this.cursorControllerProvider.registerCursor(cursor, interactor);
                const rayVisual = this.getSceneObject().createComponent(InteractorRayVisual_1.InteractorRayVisual.getTypeName());
                rayVisual._interactor = interactor;
                rayVisual.cursor = cursor;
            });
        }
        /**
         * @deprecated in favor of getCursorByInteractor
         * Gets the InteractorCursor for a specified interactor
         * @param interactor - The interactor to get the cursor for
         * @returns the InteractorCursor for the requested interactor, or null if it doesn't exist
         */
        getCursor(interactor) {
            return this.cursorControllerProvider.getCursor(interactor);
        }
        /**
         * Gets the InteractorCursor for a specified interactor
         * @param interactor - The interactor to get the cursor for
         * @returns the InteractorCursor for the requested interactor, or null if it doesn't exist
         */
        getCursorByInteractor(interactor) {
            return this.cursorControllerProvider.getCursorByInteractor(interactor);
        }
        /**
         * Gets the InteractorCursor for a specified input type
         * @param inputType - The InteractorInputType to get the cursor for
         * @returns the InteractorCursor for the requested InteractorInputType, or null if it doesn't exist
         */
        getCursorByInputType(inputType) {
            return this.cursorControllerProvider.getCursorByInputType(inputType);
        }
        /**
         * Gets all InteractorCursors within the scene
         * @returns a list of InteractorCursors
         */
        getAllCursors() {
            return this.cursorControllerProvider.getAllCursors();
        }
    };
    __setFunctionName(_classThis, "CursorController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CursorController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CursorController = _classThis;
})();
exports.CursorController = CursorController;
//# sourceMappingURL=CursorController.js.map