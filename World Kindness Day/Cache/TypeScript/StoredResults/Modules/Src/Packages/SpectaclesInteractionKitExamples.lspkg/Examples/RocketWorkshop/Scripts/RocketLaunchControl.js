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
exports.RocketLaunchControl = void 0;
var __selfType = requireType("./RocketLaunchControl");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const Interactable_1 = require("SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable");
const NativeLogger_1 = require("SpectaclesInteractionKit.lspkg/Utils/NativeLogger");
const SyncKitBridge_1 = require("SpectaclesInteractionKit.lspkg/Utils/SyncKitBridge");
const validate_1 = require("SpectaclesInteractionKit.lspkg/Utils/validate");
const TAG = "RocketLaunchControl";
const log = new NativeLogger_1.default(TAG);
const FLIGHT_END_EVENT_NAME = "flightEnded";
const ROCKET_LAUNCH_ANIMATION_VALUE_KEY = "RocketLaunchAnimationValue";
/**
 * This class manages the rocket launch control interface, including the launch button, animation buttons, and slider. It interacts with the RocketConfigurator to configure and launch the rocket.
 *
 */
let RocketLaunchControl = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var RocketLaunchControl = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.slider = this.slider;
            this.animationAButton = this.animationAButton;
            this.animationBButton = this.animationBButton;
            this.animationCButton = this.animationCButton;
            this.launchButton = this.launchButton;
            this.rocketConf = this.rocketConf;
            this.launchSparks = this.launchSparks;
            this.rocketAnimationPlayer = this.rocketAnimationPlayer;
            this.rocketAudioComponent = this.rocketAudioComponent;
            this.rocketLaunchSFX = this.rocketLaunchSFX;
            this.rocketLandSFX = this.rocketLandSFX;
            this.flightPathText = this.flightPathText;
            this.launchPlatformToggleButton = this.launchPlatformToggleButton;
            this.launchPlatform = this.launchPlatform;
            this.launchButton_interactable = null;
            this.animationAButton_interactable = null;
            this.animationBButton_interactable = null;
            this.animationCButton_interactable = null;
            this.currentLaunchAnimationName = "Base Layer Rocket 1";
            this.flightEndEventRegistration = null;
            this.engineStartedEvent = null;
            this.engineReadyEvent = null;
            this.rocketTakeOffEvent = null;
            this.takeOffCompleteEvent = null;
            this.landingStartedEvent = null;
            this.launchSparksDisableEvent = null;
            // Only defined if SyncKit is present within the lens project.
            this.syncKitBridge = SyncKitBridge_1.SyncKitBridge.getInstance();
            this.syncEntity = this.syncKitBridge.createSyncEntity(this);
            this.setupLaunchButtonCallbacks = () => {
                (0, validate_1.validate)(this.launchButton_interactable);
                this.launchButton_interactable.onTriggerEnd.add(this.onLaunchButton);
                this.launchButton_interactable.onSyncTriggerEnd.add(this.onLaunchButton);
            };
            this.onLaunchButton = () => {
                (0, validate_1.validate)(this.engineStartedEvent);
                (0, validate_1.validate)(this.launchButton_interactable);
                (0, validate_1.validate)(this.launchButtonText);
                this.engineStartedEvent.reset(0);
                this.launchButton_interactable.enabled = false;
                this.launchButtonText.text = "Flight in Progress";
                this.launchButtonText.size = 40;
            };
            this.setupAnimationAButtonCallbacks = () => {
                (0, validate_1.validate)(this.animationAButton_interactable);
                this.animationAButton_interactable.onTriggerEnd.add(this.onAnimationAButton);
            };
            this.onAnimationAButton = () => {
                this.currentLaunchAnimationName = "Base Layer Rocket 1";
                if (this.syncEntity !== null && this.syncEntity.isSetupFinished) {
                    this.updateSyncStore();
                }
                this.subscribeToCurrentLaunchAnimationEndEvent();
            };
            this.setupAnimationBButtonCallbacks = () => {
                (0, validate_1.validate)(this.animationBButton_interactable);
                this.animationBButton_interactable.onTriggerEnd.add(this.onAnimationBButton);
            };
            this.onAnimationBButton = () => {
                this.currentLaunchAnimationName = "Base Layer Rocket 2";
                if (this.syncEntity !== null && this.syncEntity.isSetupFinished) {
                    this.updateSyncStore();
                }
                this.subscribeToCurrentLaunchAnimationEndEvent();
            };
            this.setupAnimationCButtonCallbacks = () => {
                (0, validate_1.validate)(this.animationCButton_interactable);
                this.animationCButton_interactable.onTriggerEnd.add(this.onAnimationCButton);
            };
            this.onAnimationCButton = () => {
                this.currentLaunchAnimationName = "Base Layer Rocket 3";
                if (this.syncEntity !== null && this.syncEntity.isSetupFinished) {
                    this.updateSyncStore();
                }
                this.subscribeToCurrentLaunchAnimationEndEvent();
            };
            this.subscribeToCurrentLaunchAnimationEndEvent = () => {
                const currentAnimationClip = this.rocketAnimationPlayer.getClip(this.currentLaunchAnimationName);
                const flightEndTimestamp = currentAnimationClip.duration;
                currentAnimationClip.animation.createEvent(FLIGHT_END_EVENT_NAME, flightEndTimestamp);
                this.flightEndEventRegistration = this.rocketAnimationPlayer.onEvent.add(this.onAnimationEnd.bind(this));
                if (this.currentLaunchAnimationName === "Base Layer Rocket 1") {
                    this.flightPathText.text = "Flight Path : A";
                }
                else if (this.currentLaunchAnimationName === "Base Layer Rocket 2") {
                    this.flightPathText.text = "Flight Path : B";
                }
                else if (this.currentLaunchAnimationName === "Base Layer Rocket 3") {
                    this.flightPathText.text = "Flight Path : C";
                }
            };
            this.onAnimationEnd = (eventData) => {
                if (eventData.eventName === FLIGHT_END_EVENT_NAME) {
                    (0, validate_1.validate)(this.rocketConf.exhaustControl);
                    (0, validate_1.validate)(this.launchButton_interactable);
                    (0, validate_1.validate)(this.launchButtonText);
                    this.rocketConf.exhaustControl.turnOffSmokes();
                    this.launchButton_interactable.enabled = true;
                    this.launchButtonText.text = "Launch!";
                    this.launchButtonText.size = 48;
                }
            };
        }
        __initialize() {
            super.__initialize();
            this.slider = this.slider;
            this.animationAButton = this.animationAButton;
            this.animationBButton = this.animationBButton;
            this.animationCButton = this.animationCButton;
            this.launchButton = this.launchButton;
            this.rocketConf = this.rocketConf;
            this.launchSparks = this.launchSparks;
            this.rocketAnimationPlayer = this.rocketAnimationPlayer;
            this.rocketAudioComponent = this.rocketAudioComponent;
            this.rocketLaunchSFX = this.rocketLaunchSFX;
            this.rocketLandSFX = this.rocketLandSFX;
            this.flightPathText = this.flightPathText;
            this.launchPlatformToggleButton = this.launchPlatformToggleButton;
            this.launchPlatform = this.launchPlatform;
            this.launchButton_interactable = null;
            this.animationAButton_interactable = null;
            this.animationBButton_interactable = null;
            this.animationCButton_interactable = null;
            this.currentLaunchAnimationName = "Base Layer Rocket 1";
            this.flightEndEventRegistration = null;
            this.engineStartedEvent = null;
            this.engineReadyEvent = null;
            this.rocketTakeOffEvent = null;
            this.takeOffCompleteEvent = null;
            this.landingStartedEvent = null;
            this.launchSparksDisableEvent = null;
            // Only defined if SyncKit is present within the lens project.
            this.syncKitBridge = SyncKitBridge_1.SyncKitBridge.getInstance();
            this.syncEntity = this.syncKitBridge.createSyncEntity(this);
            this.setupLaunchButtonCallbacks = () => {
                (0, validate_1.validate)(this.launchButton_interactable);
                this.launchButton_interactable.onTriggerEnd.add(this.onLaunchButton);
                this.launchButton_interactable.onSyncTriggerEnd.add(this.onLaunchButton);
            };
            this.onLaunchButton = () => {
                (0, validate_1.validate)(this.engineStartedEvent);
                (0, validate_1.validate)(this.launchButton_interactable);
                (0, validate_1.validate)(this.launchButtonText);
                this.engineStartedEvent.reset(0);
                this.launchButton_interactable.enabled = false;
                this.launchButtonText.text = "Flight in Progress";
                this.launchButtonText.size = 40;
            };
            this.setupAnimationAButtonCallbacks = () => {
                (0, validate_1.validate)(this.animationAButton_interactable);
                this.animationAButton_interactable.onTriggerEnd.add(this.onAnimationAButton);
            };
            this.onAnimationAButton = () => {
                this.currentLaunchAnimationName = "Base Layer Rocket 1";
                if (this.syncEntity !== null && this.syncEntity.isSetupFinished) {
                    this.updateSyncStore();
                }
                this.subscribeToCurrentLaunchAnimationEndEvent();
            };
            this.setupAnimationBButtonCallbacks = () => {
                (0, validate_1.validate)(this.animationBButton_interactable);
                this.animationBButton_interactable.onTriggerEnd.add(this.onAnimationBButton);
            };
            this.onAnimationBButton = () => {
                this.currentLaunchAnimationName = "Base Layer Rocket 2";
                if (this.syncEntity !== null && this.syncEntity.isSetupFinished) {
                    this.updateSyncStore();
                }
                this.subscribeToCurrentLaunchAnimationEndEvent();
            };
            this.setupAnimationCButtonCallbacks = () => {
                (0, validate_1.validate)(this.animationCButton_interactable);
                this.animationCButton_interactable.onTriggerEnd.add(this.onAnimationCButton);
            };
            this.onAnimationCButton = () => {
                this.currentLaunchAnimationName = "Base Layer Rocket 3";
                if (this.syncEntity !== null && this.syncEntity.isSetupFinished) {
                    this.updateSyncStore();
                }
                this.subscribeToCurrentLaunchAnimationEndEvent();
            };
            this.subscribeToCurrentLaunchAnimationEndEvent = () => {
                const currentAnimationClip = this.rocketAnimationPlayer.getClip(this.currentLaunchAnimationName);
                const flightEndTimestamp = currentAnimationClip.duration;
                currentAnimationClip.animation.createEvent(FLIGHT_END_EVENT_NAME, flightEndTimestamp);
                this.flightEndEventRegistration = this.rocketAnimationPlayer.onEvent.add(this.onAnimationEnd.bind(this));
                if (this.currentLaunchAnimationName === "Base Layer Rocket 1") {
                    this.flightPathText.text = "Flight Path : A";
                }
                else if (this.currentLaunchAnimationName === "Base Layer Rocket 2") {
                    this.flightPathText.text = "Flight Path : B";
                }
                else if (this.currentLaunchAnimationName === "Base Layer Rocket 3") {
                    this.flightPathText.text = "Flight Path : C";
                }
            };
            this.onAnimationEnd = (eventData) => {
                if (eventData.eventName === FLIGHT_END_EVENT_NAME) {
                    (0, validate_1.validate)(this.rocketConf.exhaustControl);
                    (0, validate_1.validate)(this.launchButton_interactable);
                    (0, validate_1.validate)(this.launchButtonText);
                    this.rocketConf.exhaustControl.turnOffSmokes();
                    this.launchButton_interactable.enabled = true;
                    this.launchButtonText.text = "Launch!";
                    this.launchButtonText.size = 48;
                }
            };
        }
        onAwake() {
            this.createEvent("OnStartEvent").bind(() => {
                this.onStart();
            });
            this.launchSparksDisableEvent = this.createEvent("DelayedCallbackEvent");
            this.launchSparksDisableEvent.bind(() => {
                this.launchSparks.enabled = false;
            });
            const interactableTypeName = Interactable_1.Interactable.getTypeName();
            this.launchButton_interactable = this.launchButton.getComponent(interactableTypeName);
            if (isNull(this.launchButton_interactable)) {
                log.f("Interactable component not found.");
            }
            this.animationAButton_interactable = this.animationAButton.getComponent(interactableTypeName);
            if (isNull(this.animationAButton_interactable)) {
                log.f("Interactable component not found.");
            }
            this.animationBButton_interactable = this.animationBButton.getComponent(interactableTypeName);
            if (isNull(this.animationBButton_interactable)) {
                log.f("Interactable component not found.");
            }
            this.animationCButton_interactable = this.animationCButton.getComponent(interactableTypeName);
            if (isNull(this.animationCButton_interactable)) {
                log.f("Interactable component not found.");
            }
            this.launchButtonText = this.launchButton.getChild(0).getComponent("Text");
            this.launchSparks.enabled = false;
            this.engineStartedEvent = this.createEvent("DelayedCallbackEvent");
            this.engineStartedEvent.bind(() => {
                this.engineStarted();
            });
            this.engineReadyEvent = this.createEvent("DelayedCallbackEvent");
            this.engineReadyEvent.bind(() => {
                this.engineReady();
            });
            this.rocketTakeOffEvent = this.createEvent("DelayedCallbackEvent");
            this.rocketTakeOffEvent.bind(() => {
                this.rocketTakeOff();
            });
            this.takeOffCompleteEvent = this.createEvent("DelayedCallbackEvent");
            this.takeOffCompleteEvent.bind(() => {
                this.takeOffCompleted();
            });
            this.landingStartedEvent = this.createEvent("DelayedCallbackEvent");
            this.landingStartedEvent.bind(() => {
                this.landingStarted();
            });
            if (this.syncEntity !== null) {
                this.syncEntity.notifyOnReady(this.setupConnectionCallbacks.bind(this));
            }
            this.subscribeToCurrentLaunchAnimationEndEvent();
        }
        onStart() {
            this.setupLaunchButtonCallbacks();
            this.setupAnimationAButtonCallbacks();
            this.setupAnimationBButtonCallbacks();
            this.setupAnimationCButtonCallbacks();
            this.launchPlatformToggleButton.onStateChanged.add((isToggledOn) => {
                if (isToggledOn) {
                    this.launchPlatform.enabled = true;
                }
                else {
                    this.launchPlatform.enabled = false;
                }
            });
        }
        setupConnectionCallbacks() {
            if (this.syncEntity.currentStore.getAllKeys().find((key) => {
                return key === ROCKET_LAUNCH_ANIMATION_VALUE_KEY;
            })) {
                this.currentLaunchAnimationName = this.syncEntity.currentStore.getString(ROCKET_LAUNCH_ANIMATION_VALUE_KEY);
                this.subscribeToCurrentLaunchAnimationEndEvent();
            }
            else {
                this.syncEntity.currentStore.putString(ROCKET_LAUNCH_ANIMATION_VALUE_KEY, this.currentLaunchAnimationName);
            }
            this.syncEntity.storeCallbacks.onStoreUpdated.add(this.processStoreUpdate.bind(this));
        }
        processStoreUpdate(_session, store, key, info) {
            const connectionId = info.updaterInfo.connectionId;
            const updatedByLocal = connectionId === this.syncKitBridge.sessionController.getLocalConnectionId();
            if (updatedByLocal) {
                return;
            }
            if (key === ROCKET_LAUNCH_ANIMATION_VALUE_KEY) {
                this.currentLaunchAnimationName = store.getString(ROCKET_LAUNCH_ANIMATION_VALUE_KEY);
                this.subscribeToCurrentLaunchAnimationEndEvent();
            }
        }
        updateSyncStore() {
            if (this.syncEntity !== null && this.syncEntity.isSetupFinished) {
                this.syncEntity.currentStore.putString(ROCKET_LAUNCH_ANIMATION_VALUE_KEY, this.currentLaunchAnimationName);
            }
        }
        engineStarted() {
            this.rocketConf.getExhaustControl();
            (0, validate_1.validate)(this.rocketConf.exhaustControl);
            (0, validate_1.validate)(this.engineReadyEvent);
            this.rocketConf.exhaustControl.setEngineSmokesValue(1.1);
            this.rocketConf.exhaustControl.turnOnExhausts();
            this.rocketConf.exhaustControl.turnOnSmokes();
            this.rocketAudioComponent.audioTrack = this.rocketLaunchSFX;
            this.rocketAudioComponent.play(1);
            this.engineReadyEvent.reset(0.5);
        }
        engineReady() {
            (0, validate_1.validate)(this.rocketConf.exhaustControl);
            (0, validate_1.validate)(this.rocketTakeOffEvent);
            this.rocketConf.exhaustControl.engineReady();
            this.rocketConf.exhaustControl.setEngineSmokesValue(0.8);
            this.rocketTakeOffEvent.reset(0.5);
        }
        rocketTakeOff() {
            (0, validate_1.validate)(this.rocketConf.exhaustControl);
            this.rocketConf.exhaustControl.setEngineSmokesValue(0.0);
            this.rocketAnimationPlayer.playClipAt(this.currentLaunchAnimationName, 0.0);
            (0, validate_1.validate)(this.slider);
            this.rocketAnimationPlayer.getClip(this.currentLaunchAnimationName).playbackSpeed = MathUtils.remap(this.slider.currentValue ?? 0, 0.0, 1.0, 1.0, 5.0);
            this.launchSparks.enabled = true;
            (0, validate_1.validate)(this.launchSparksDisableEvent);
            this.launchSparksDisableEvent.reset(0.5);
            this.currentClip = this.rocketAnimationPlayer.getClip(this.currentLaunchAnimationName);
            (0, validate_1.validate)(this.currentClip);
            (0, validate_1.validate)(this.landingStartedEvent);
            (0, validate_1.validate)(this.takeOffCompleteEvent);
            this.landingStartedEvent.reset((this.currentClip.duration / this.currentClip.playbackSpeed) * 0.9);
            this.takeOffCompleteEvent.reset((this.currentClip.duration / this.currentClip.playbackSpeed) * 0.2);
        }
        takeOffCompleted() {
            // The SIKLogLevelConfiguration Log Level Filter must be set to Info or higher to see this log message
            log.i("Take Off Completed!");
        }
        landingStarted() {
            log.i("Landing Started!");
            (0, validate_1.validate)(this.rocketConf.exhaustControl);
            this.rocketConf.exhaustControl.turnOffExhausts();
            this.rocketAudioComponent.audioTrack = this.rocketLandSFX;
            this.rocketAudioComponent.play(1);
        }
    };
    __setFunctionName(_classThis, "RocketLaunchControl");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RocketLaunchControl = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RocketLaunchControl = _classThis;
})();
exports.RocketLaunchControl = RocketLaunchControl;
//# sourceMappingURL=RocketLaunchControl.js.map