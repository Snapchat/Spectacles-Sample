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
exports.InteractableAudioFeedback = void 0;
var __selfType = requireType("./InteractableAudioFeedback");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const validate_1 = require("../../Utils/validate");
const Interactable_1 = require("../Interaction/Interactable/Interactable");
/**
 * This class provides audio feedback for interactable objects. It allows configuration of audio tracks for hover,
 * trigger start, and trigger end events. The class also provides access to the audio component for further
 * customization.
 */
let InteractableAudioFeedback = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var InteractableAudioFeedback = _classThis = class extends _classSuper {
        constructor() {
            super();
            /**
             * Controls whether sound feedback plays when a user's hand hovers over this Interactable.
             */
            this._playAudioOnHover = this._playAudioOnHover;
            /**
             * The sound that plays when the Interactable is hovered.
             */
            this._hoverAudioTrack = this._hoverAudioTrack;
            /**
             * Controls whether sound feedback plays when a user starts interacting with this Interactable.
             */
            this._playAudioOnTriggerStart = this._playAudioOnTriggerStart;
            /**
             * The sound that plays when interaction with this Interactable begins.
             */
            this._triggerStartAudioTrack = this._triggerStartAudioTrack;
            /**
             * Controls whether sound feedback plays when a user stops interacting with this Interactable.
             */
            this._playAudioOnTriggerEnd = this._playAudioOnTriggerEnd;
            /**
             * The sound that plays when interaction with this Interactable ends.
             */
            this._triggerEndAudioTrack = this._triggerEndAudioTrack;
            this.interactable = null;
        }
        __initialize() {
            super.__initialize();
            /**
             * Controls whether sound feedback plays when a user's hand hovers over this Interactable.
             */
            this._playAudioOnHover = this._playAudioOnHover;
            /**
             * The sound that plays when the Interactable is hovered.
             */
            this._hoverAudioTrack = this._hoverAudioTrack;
            /**
             * Controls whether sound feedback plays when a user starts interacting with this Interactable.
             */
            this._playAudioOnTriggerStart = this._playAudioOnTriggerStart;
            /**
             * The sound that plays when interaction with this Interactable begins.
             */
            this._triggerStartAudioTrack = this._triggerStartAudioTrack;
            /**
             * Controls whether sound feedback plays when a user stops interacting with this Interactable.
             */
            this._playAudioOnTriggerEnd = this._playAudioOnTriggerEnd;
            /**
             * The sound that plays when interaction with this Interactable ends.
             */
            this._triggerEndAudioTrack = this._triggerEndAudioTrack;
            this.interactable = null;
        }
        onAwake() {
            this.defineScriptEvents();
        }
        defineScriptEvents() {
            this.createEvent("OnStartEvent").bind(() => {
                this.init();
            });
        }
        /**
         * Set the AudioTrackAsset to play when the Interactable receives a hover event.
         */
        set hoverAudioTrack(track) {
            this._hoverAudioTrack = track;
            if (this.hoverAudioComponent !== undefined) {
                this.hoverAudioComponent.audioTrack = track;
            }
        }
        /**
         * @returns the AudioTrackAsset to play when the Interactable receives a hover event.
         */
        get hoverAudioTrack() {
            return this._hoverAudioTrack;
        }
        /**
         * Set the AudioTrackAsset to play when the Interactable receives a trigger start event.
         */
        set triggerStartAudioTrack(track) {
            this._triggerStartAudioTrack = track;
            if (this.triggerStartAudioComponent !== undefined) {
                this.triggerStartAudioComponent.audioTrack = track;
            }
        }
        /**
         * @returns the AudioTrackAsset to play when the Interactable receives a trigger start event.
         */
        get triggerStartAudioTrack() {
            return this._triggerStartAudioTrack;
        }
        /**
         * Set the AudioTrackAsset to play when the Interactable receives a trigger end event.
         */
        set triggerEndAudioTrack(track) {
            this._triggerEndAudioTrack = track;
            if (this.triggerEndAudioComponent !== undefined) {
                this.triggerEndAudioComponent.audioTrack = track;
            }
        }
        /**
         * @returns the AudioTrackAsset to play when the Interactable receives a trigger end event.
         */
        get triggerEndAudioTrack() {
            return this._triggerEndAudioTrack;
        }
        /**
         * Set if audio should play when the Interactable receives a hover event.
         */
        set playAudioOnHover(enabled) {
            this._playAudioOnHover = enabled;
            if (this.hoverAudioComponent === undefined) {
                this._hoverAudioComponent = this.getSceneObject().createComponent("Component.AudioComponent");
                this.setPlaybackMode(this._hoverAudioComponent, Audio.PlaybackMode?.LowLatency);
                if (this.hoverAudioTrack === undefined) {
                    this.hoverAudioTrack = requireAsset("../../Assets/Audio/HoverAudioTrack.wav");
                }
                this._hoverAudioComponent.audioTrack = this.hoverAudioTrack;
            }
        }
        /**
         * @returns if audio should play when the Interactable receives a hover event.
         */
        get playAudioOnHover() {
            return this._playAudioOnHover;
        }
        /**
         * Set if audio should play when the Interactable receives a trigger start event.
         */
        set playAudioOnTriggerStart(enabled) {
            this._playAudioOnTriggerStart = enabled;
            if (this.triggerStartAudioComponent === undefined) {
                this._triggerStartAudioComponent = this.getSceneObject().createComponent("Component.AudioComponent");
                this.setPlaybackMode(this._triggerStartAudioComponent, Audio.PlaybackMode?.LowLatency);
                if (this.triggerStartAudioTrack === undefined) {
                    this.triggerStartAudioTrack = requireAsset("../../Assets/Audio/TriggerStartAudioTrack.wav");
                }
                this._triggerStartAudioComponent.audioTrack = this.triggerStartAudioTrack;
            }
        }
        /**
         * @returns if audio should play when the Interactable receives a trigger start event.
         */
        get playAudioOnTriggerStart() {
            return this._playAudioOnTriggerStart;
        }
        /**
         * Set if audio should play when the Interactable receives a trigger end event.
         */
        set playAudioOnTriggerEnd(enabled) {
            this._playAudioOnTriggerEnd = enabled;
            if (this.triggerEndAudioComponent === undefined) {
                this._triggerEndAudioComponent = this.getSceneObject().createComponent("Component.AudioComponent");
                this.setPlaybackMode(this._triggerEndAudioComponent, Audio.PlaybackMode?.LowLatency);
                if (this.triggerEndAudioTrack === undefined) {
                    this.triggerEndAudioTrack = requireAsset("../../Assets/Audio/TriggerEndAudioTrack.wav");
                }
                this._triggerEndAudioComponent.audioTrack = this.triggerEndAudioTrack;
            }
        }
        /**
         * @returns if audio should play when the Interactable receives a trigger end event.
         */
        get playAudioOnTriggerEnd() {
            return this._playAudioOnTriggerEnd;
        }
        /**
         * Returns the AudioComponent used for hover feedback for further configuration (such as volume).
         */
        get hoverAudioComponent() {
            return this._hoverAudioComponent;
        }
        /**
         * Returns the AudioComponent used for trigger start feedback for further configuration (such as volume).
         */
        get triggerStartAudioComponent() {
            return this._triggerStartAudioComponent;
        }
        /**
         * Returns the AudioComponent used for trigger end feedback for further configuration (such as volume).
         */
        get triggerEndAudioComponent() {
            return this._triggerEndAudioComponent;
        }
        setupInteractableCallbacks() {
            (0, validate_1.validate)(this.interactable);
            this.interactable.onHoverEnter.add((event) => {
                if (this.interactable?.keepHoverOnTrigger && event.interactor.isTriggering) {
                    return;
                }
                try {
                    if (this.playAudioOnHover && this._hoverAudioComponent) {
                        this._hoverAudioComponent.play(1);
                    }
                }
                catch (e) {
                    print("Error playing hover audio: " + e);
                }
            });
            this.interactable.onSyncHoverEnter.add((event) => {
                if (this.interactable?.keepHoverOnTrigger && event.interactor.isTriggering) {
                    return;
                }
                try {
                    if (this.playAudioOnHover && this._hoverAudioComponent) {
                        this._hoverAudioComponent.play(1);
                    }
                }
                catch (e) {
                    print("Error playing hover audio: " + e);
                }
            });
            this.interactable.onTriggerStart.add(() => {
                try {
                    if (this.playAudioOnTriggerStart && this._triggerStartAudioComponent) {
                        this._triggerStartAudioComponent.play(1);
                    }
                }
                catch (e) {
                    print("Error playing trigger start audio: " + e);
                }
            });
            this.interactable.onSyncTriggerStart.add(() => {
                try {
                    if (this.playAudioOnTriggerStart && this._triggerStartAudioComponent) {
                        this._triggerStartAudioComponent.play(1);
                    }
                }
                catch (e) {
                    print("Error playing trigger start audio: " + e);
                }
            });
            this.interactable.onTriggerEnd.add(() => {
                try {
                    if (this.playAudioOnTriggerEnd && this._triggerEndAudioComponent) {
                        this._triggerEndAudioComponent.play(1);
                    }
                }
                catch (e) {
                    print("Error playing trigger end audio: " + e);
                }
            });
            this.interactable.onSyncTriggerEnd.add(() => {
                try {
                    if (this.playAudioOnTriggerEnd && this._triggerEndAudioComponent) {
                        this._triggerEndAudioComponent.play(1);
                    }
                }
                catch (e) {
                    print("Error playing trigger end audio: " + e);
                }
            });
        }
        init() {
            if (this.playAudioOnHover) {
                this._hoverAudioComponent = this.getSceneObject().createComponent("Component.AudioComponent");
                this.setPlaybackMode(this._hoverAudioComponent, Audio.PlaybackMode?.LowLatency);
                if (this.hoverAudioTrack === undefined) {
                    this.hoverAudioTrack = requireAsset("../../Assets/Audio/HoverAudioTrack.wav");
                }
                this._hoverAudioComponent.audioTrack = this.hoverAudioTrack;
            }
            if (this.playAudioOnTriggerStart) {
                this._triggerStartAudioComponent = this.getSceneObject().createComponent("Component.AudioComponent");
                this.setPlaybackMode(this._triggerStartAudioComponent, Audio.PlaybackMode?.LowLatency);
                if (this.triggerStartAudioTrack === undefined) {
                    this.triggerStartAudioTrack = requireAsset("../../Assets/Audio/TriggerStartAudioTrack.wav");
                }
                this._triggerStartAudioComponent.audioTrack = this.triggerStartAudioTrack;
            }
            if (this.playAudioOnTriggerEnd) {
                this._triggerEndAudioComponent = this.getSceneObject().createComponent("Component.AudioComponent");
                this.setPlaybackMode(this._triggerEndAudioComponent, Audio.PlaybackMode?.LowLatency);
                if (this.triggerEndAudioTrack === undefined) {
                    this.triggerEndAudioTrack = requireAsset("../../Assets/Audio/TriggerEndAudioTrack.wav");
                }
                this._triggerEndAudioComponent.audioTrack = this.triggerEndAudioTrack;
            }
            this.interactable = this.getSceneObject().getComponent(Interactable_1.Interactable.getTypeName());
            if (!this.interactable) {
                throw new Error("Could not find Interactable component on this SceneObject.");
            }
            this.setupInteractableCallbacks();
        }
        setPlaybackMode(target, playbackMode) {
            if (playbackMode !== undefined) {
                target.playbackMode = playbackMode;
            }
        }
    };
    __setFunctionName(_classThis, "InteractableAudioFeedback");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        InteractableAudioFeedback = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return InteractableAudioFeedback = _classThis;
})();
exports.InteractableAudioFeedback = InteractableAudioFeedback;
//# sourceMappingURL=InteractableAudioFeedback.js.map