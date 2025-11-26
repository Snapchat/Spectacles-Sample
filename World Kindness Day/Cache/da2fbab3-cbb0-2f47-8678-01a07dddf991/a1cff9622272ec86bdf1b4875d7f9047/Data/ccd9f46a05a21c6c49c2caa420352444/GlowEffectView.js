"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlowEffectView = void 0;
const ProximitySensor_1 = require("../../../Components/Helpers/ProximitySensor");
const WorldCameraFinderProvider_1 = require("../../../Providers/CameraProvider/WorldCameraFinderProvider");
const LensConfig_1 = require("../../../Utils/LensConfig");
const validate_1 = require("../../../Utils/validate");
const GlowEffectViewModel_1 = require("./GlowEffectViewModel");
const POKE_DEPTH_MASK_START = 0.65;
const POKE_DEPTH_MASK_RANGE = 0.35;
const POKE_HIGHLIGHT_GRADIENT_MASK_MIN = 0.0;
const POKE_HIGHLIGHT_GRADIENT_MASK_MAX = 0.3;
const POKE_OCCLUDE_GRADIENT_MASK_MIN = 0.0;
const POKE_OCCLUDE_GRADIENT_MASK_MAX = 0.32;
const POKE_GRADIENT_MASK_LERP_SPEED = 10;
const POKE_GRADIENT_MASK_CUTOFF = 0.01;
const INDEX_GLOW_UP_OFFSET = -0.36;
const INDEX_GLOW_FORWARD_OFFSET = -0.25;
/**
 * GlowEffectView controls the glow effect that happens when pinching and poking.
 * It works with a ViewModel to separate presentation from logic.
 */
class GlowEffectView {
    get isMeshVisibilityDesired() {
        return this.viewModel.isMeshVisibilityDesired;
    }
    get isIndexGlowVisible() {
        return this.viewModel.isIndexGlowVisible;
    }
    get isThumbGlowVisible() {
        return this.viewModel.isThumbGlowVisible;
    }
    get indexGlowSceneObject() {
        return this._indexGlowSceneObject;
    }
    get thumbGlowSceneObject() {
        return this._thumbGlowSceneObject;
    }
    constructor(config) {
        this.config = config;
        // Dependencies
        this.camera = WorldCameraFinderProvider_1.default.getInstance();
        this.cameraTransform = this.camera.getTransform();
        this.updateDispatcher = LensConfig_1.LensConfig.getInstance().updateDispatcher;
        this.lastPokePinchBlend = -1;
        this.debugModeEnabled = config.debugModeEnabled;
        this.handVisuals = config.handVisuals;
        // Setup scene objects and materials
        this._indexGlowSceneObject = this.setupGlowSceneObject(this.handVisuals.indexTip, "indexTipGlowSceneObject", new vec3(0, INDEX_GLOW_UP_OFFSET, INDEX_GLOW_FORWARD_OFFSET));
        this._indexGlowTransform = this._indexGlowSceneObject.getTransform();
        this._indexGlowMaterial = this._indexGlowSceneObject.getComponent("Component.RenderMeshVisual").mainMaterial;
        this._thumbGlowSceneObject = this.setupGlowSceneObject(this.handVisuals.thumbTip, "thumbTipGlowSceneObject");
        this._thumbGlowTransform = this._thumbGlowSceneObject.getTransform();
        this._thumbGlowMaterial = this._thumbGlowSceneObject.getComponent("Component.RenderMeshVisual").mainMaterial;
        const proximitySensor = this.handVisuals.indexTip?.createComponent(ProximitySensor_1.ProximitySensor.getTypeName()) ?? null;
        if (proximitySensor) {
            proximitySensor.debugModeEnabled = config.debugModeEnabled;
            proximitySensor.setRadius(Math.max(config.style.pokeHighlightThresholdFar, config.style.pokeOccludeThresholdFar, config.style.pinchHighlightThresholdFar));
        }
        // Create the ViewModel
        const viewModelConfig = {
            handInteractor: config.handInteractor,
            handType: config.handType,
            initialHandVisualSelection: config.handVisualSelection,
            style: {
                hoverColor: config.style.hoverColor,
                triggerColor: config.style.triggerColor,
                pinchBrightnessMax: config.style.pinchBrightnessMax,
                pinchGlowBrightnessMax: config.style.pinchGlowBrightnessMax,
                pinchBrightnessMaxStrength: config.style.pinchBrightnessMaxStrength,
                pinchTriggeredMult: config.style.pinchTriggeredMult,
                pinchExponent: config.style.pinchExponent,
                pinchExponentTriggered: config.style.pinchExponentTriggered,
                pinchHighlightThresholdFar: config.style.pinchHighlightThresholdFar,
                pinchHighlightThresholdNear: config.style.pinchHighlightThresholdNear,
                pokeBrightnessMax: config.style.pokeBrightnessMax,
                pokeGlowBrightnessMax: config.style.pokeGlowBrightnessMax,
                pokeTriggeredMult: config.style.pokeTriggeredMult,
                pokeDepthMaskStart: POKE_DEPTH_MASK_START,
                pokeDepthMaskRange: POKE_DEPTH_MASK_RANGE,
                pokeHighlightThresholdFar: config.style.pokeHighlightThresholdFar,
                pokeHighlightThresholdNear: config.style.pokeHighlightThresholdNear,
                pokeOccludeThresholdFar: config.style.pokeOccludeThresholdFar,
                pokeOccludeThresholdNear: config.style.pokeOccludeThresholdNear,
                pokeHighlightGradientMaskMin: POKE_HIGHLIGHT_GRADIENT_MASK_MIN,
                pokeHighlightGradientMaskMax: POKE_HIGHLIGHT_GRADIENT_MASK_MAX,
                pokeOccludeGradientMaskMin: POKE_OCCLUDE_GRADIENT_MASK_MIN,
                pokeOccludeGradientMaskMax: POKE_OCCLUDE_GRADIENT_MASK_MAX,
                pokeGradientMaskLerpSpeed: POKE_GRADIENT_MASK_LERP_SPEED,
                pokeGradientMaskCutoff: POKE_GRADIENT_MASK_CUTOFF,
                pokeExponent: config.style.pokeExponent,
                pokeExponentTriggered: config.style.pokeExponentTriggered,
                triggeredLerpDurationSeconds: config.style.triggeredLerpDurationSeconds,
                pinchValidLerpDurationSeconds: config.style.pinchValidLerpDurationSeconds,
                pokeValidLerpDurationSeconds: config.style.pokeValidLerpDurationSeconds
            },
            debugModeEnabled: config.debugModeEnabled,
            proximitySensor: proximitySensor,
            indexTipSceneObject: this.handVisuals.indexTip,
            overrideMap: this.handVisuals.overrideMap,
            handVisuals: this.handVisuals
        };
        this.viewModel = new GlowEffectViewModel_1.GlowEffectViewModel(viewModelConfig);
        // Initialize cached properties
        this.lastPinchProps = {
            brightness: -1,
            color: new vec4(0, 0, 0, 0),
            glowBrightness: -1,
            glowColor: new vec4(0, 0, 0, 0),
            exponent: -1
        };
        this.lastPokeProps = {
            brightness: -1,
            color: new vec4(0, 0, 0, 0),
            glowBrightness: -1,
            glowColor: new vec4(0, 0, 0, 0),
            depthFactor: -1,
            highlightGradientMaskPosition: -1,
            occludeGradientMaskPosition: -1,
            exponent: -1
        };
        this.updateEvent = this.updateDispatcher.createUpdateEvent("GlowEffectViewUpdate", () => this.onUpdate());
    }
    /**
     * Clean up GlowEffectView
     */
    destroy() {
        this.viewModel.destroy();
        this._indexGlowSceneObject.destroy();
        this._thumbGlowSceneObject.destroy();
        this.updateDispatcher.removeEvent(this.updateEvent);
    }
    /**
     * Sets the visual selection mode via the ViewModel.
     */
    setVisualSelection(handVisualSelection) {
        this.viewModel.setVisualSelection(handVisualSelection);
    }
    /**
     * Sets the palm tapping state for the glow effect.
     * @param isPalmTapping - Whether the palm is currently tapping
     */
    setPalmTapping(isPalmTapping) {
        this.viewModel.isPalmTapping = isPalmTapping;
    }
    setupGlowSceneObject(parentSceneObject, sceneObjectName, offset = undefined) {
        (0, validate_1.validate)(parentSceneObject);
        const glowSceneObject = global.scene.createSceneObject(sceneObjectName);
        glowSceneObject.setParent(parentSceneObject);
        const glowSceneObjectTransform = glowSceneObject.getTransform();
        glowSceneObjectTransform.setWorldScale(new vec3(this.config.style.tipGlowWorldScale, this.config.style.tipGlowWorldScale, this.config.style.tipGlowWorldScale));
        if (offset) {
            glowSceneObjectTransform.setLocalPosition(offset);
        }
        const quadComponent = glowSceneObject.createComponent("Component.RenderMeshVisual");
        quadComponent.mesh = this.config.unitPlaneMesh;
        quadComponent.setRenderOrder(this.config.style.tipGlowRenderOrder);
        const tipGlowMaterial = this.config.style.tipGlowMaterial.clone();
        tipGlowMaterial.mainPass.depthTest = false;
        tipGlowMaterial.mainPass.depthWrite = false;
        quadComponent.mainMaterial = tipGlowMaterial;
        glowSceneObject.enabled = false;
        return glowSceneObject;
    }
    onUpdate() {
        const cameraRotation = this.cameraTransform.getWorldRotation();
        this._indexGlowTransform.setWorldRotation(cameraRotation);
        this._thumbGlowTransform.setWorldRotation(cameraRotation);
        this.applyViewModelProperties();
        if (this.debugModeEnabled) {
            this.drawDebugLines();
        }
    }
    drawDebugLines() {
        for (const line of this.viewModel.debugLines) {
            global.debugRenderSystem.drawLine(line.start, line.end, line.color);
        }
    }
    applyViewModelProperties() {
        const { pinchProps, pokeProps, pokePinchBlend } = this.viewModel;
        this.applyBrightnessProps(pinchProps, pokeProps, pokePinchBlend);
        this.applyColorProps(pinchProps, pokeProps);
        // Cache PinchProperties
        this.lastPinchProps.brightness = pinchProps.brightness;
        this.lastPinchProps.color.x = pinchProps.color.x;
        this.lastPinchProps.color.y = pinchProps.color.y;
        this.lastPinchProps.color.z = pinchProps.color.z;
        this.lastPinchProps.color.w = pinchProps.color.w;
        this.lastPinchProps.glowBrightness = pinchProps.glowBrightness;
        this.lastPinchProps.glowColor.x = pinchProps.glowColor.x;
        this.lastPinchProps.glowColor.y = pinchProps.glowColor.y;
        this.lastPinchProps.glowColor.z = pinchProps.glowColor.z;
        this.lastPinchProps.glowColor.w = pinchProps.glowColor.w;
        this.lastPinchProps.exponent = pinchProps.exponent;
        // Cache PokeProperties
        this.lastPokeProps.brightness = pokeProps.brightness;
        this.lastPokeProps.color.x = pokeProps.color.x;
        this.lastPokeProps.color.y = pokeProps.color.y;
        this.lastPokeProps.color.z = pokeProps.color.z;
        this.lastPokeProps.color.w = pokeProps.color.w;
        this.lastPokeProps.glowBrightness = pokeProps.glowBrightness;
        this.lastPokeProps.glowColor.x = pokeProps.glowColor.x;
        this.lastPokeProps.glowColor.y = pokeProps.glowColor.y;
        this.lastPokeProps.glowColor.z = pokeProps.glowColor.z;
        this.lastPokeProps.glowColor.w = pokeProps.glowColor.w;
        this.lastPokeProps.depthFactor = pokeProps.depthFactor;
        this.lastPokeProps.highlightGradientMaskPosition = pokeProps.highlightGradientMaskPosition;
        this.lastPokeProps.occludeGradientMaskPosition = pokeProps.occludeGradientMaskPosition;
        this.lastPokeProps.exponent = pokeProps.exponent;
        this.lastPokePinchBlend = pokePinchBlend;
    }
    updateMaterialProperty(pass, key, newValue, lastValue) {
        if (newValue !== lastValue) {
            pass[key] = newValue;
        }
    }
    updateMaterialColorProperty(pass, key, newColor, lastColor) {
        if (!lastColor || !newColor.equal(lastColor)) {
            pass[key] = newColor;
        }
    }
    applyBrightnessProps(pinchProps, pokeProps, pokePinchBlend) {
        const indexGlowPass = this._indexGlowMaterial.mainPass;
        const thumbGlowPass = this._thumbGlowMaterial.mainPass;
        // Apply properties to the hand mesh materials
        const applyToHandPass = (pass0, pass1) => {
            this.updateMaterialProperty(pass0, "pokeOccludeGradientMaskPosition", pokeProps.occludeGradientMaskPosition, this.lastPokeProps.occludeGradientMaskPosition);
            this.updateMaterialProperty(pass1, "pinchBrightness", pinchProps.brightness, this.lastPinchProps.brightness);
            this.updateMaterialProperty(pass1, "pokeBrightness", pokeProps.brightness, this.lastPokeProps.brightness);
            this.updateMaterialProperty(pass1, "pokePinchBlend", pokePinchBlend, this.lastPokePinchBlend);
            this.updateMaterialProperty(pass1, "pinchExponent", pinchProps.exponent, this.lastPinchProps.exponent);
            this.updateMaterialProperty(pass1, "pokeHighlightGradientMaskPosition", pokeProps.highlightGradientMaskPosition, this.lastPokeProps.highlightGradientMaskPosition);
            this.updateMaterialProperty(pass1, "pokeExponent", pokeProps.exponent, this.lastPokeProps.exponent);
        };
        const handMaterialFull = this.handVisuals.handMeshFull.mainMaterial;
        if (handMaterialFull.getPassCount() > 1) {
            applyToHandPass(handMaterialFull.getPass(0), handMaterialFull.getPass(1));
        }
        const handMaterialIndexThumb = this.handVisuals.handMeshIndexThumb.mainMaterial;
        if (handMaterialIndexThumb.getPassCount() > 1) {
            applyToHandPass(handMaterialIndexThumb.getPass(0), handMaterialIndexThumb.getPass(1));
        }
        // Apply properties to the glow materials
        this.updateMaterialProperty(indexGlowPass, "pinchGlowBrightness", pinchProps.glowBrightness, this.lastPinchProps.glowBrightness);
        this.updateMaterialProperty(indexGlowPass, "pokeGlowBrightness", pokeProps.glowBrightness, this.lastPokeProps.glowBrightness);
        this.updateMaterialProperty(indexGlowPass, "pokePinchBlend", pokePinchBlend, this.lastPokePinchBlend);
        this.updateMaterialProperty(thumbGlowPass, "pinchGlowBrightness", pinchProps.glowBrightness, this.lastPinchProps.glowBrightness);
        // Thumb does not have poke glow
        this.updateMaterialProperty(thumbGlowPass, "pokeGlowBrightness", 0, this.lastPokeProps.glowBrightness);
        this.updateMaterialProperty(thumbGlowPass, "pokePinchBlend", pokePinchBlend, this.lastPokePinchBlend);
    }
    applyColorProps(pinchProps, pokeProps) {
        // Apply to hand mesh materials
        const applyToHandPass = (pass) => {
            this.updateMaterialColorProperty(pass, "pinchColor", pinchProps.color, this.lastPinchProps.color);
            this.updateMaterialColorProperty(pass, "pokeColor", pokeProps.color, this.lastPokeProps.color);
        };
        const handMaterialFull = this.handVisuals.handMeshFull.mainMaterial;
        if (handMaterialFull.getPassCount() > 1) {
            applyToHandPass(handMaterialFull.getPass(1));
        }
        const handMaterialIndexThumb = this.handVisuals.handMeshIndexThumb.mainMaterial;
        if (handMaterialIndexThumb.getPassCount() > 1) {
            applyToHandPass(handMaterialIndexThumb.getPass(1));
        }
        // Apply to glow materials
        for (let i = 0; i < this._indexGlowMaterial.getPassCount(); i++) {
            const pass = this._indexGlowMaterial.getPass(i);
            this.updateMaterialColorProperty(pass, "pinchGlowColor", pinchProps.glowColor, this.lastPinchProps.glowColor);
            this.updateMaterialColorProperty(pass, "pokeGlowColor", pokeProps.glowColor, this.lastPokeProps.glowColor);
        }
        for (let i = 0; i < this._thumbGlowMaterial.getPassCount(); i++) {
            const pass = this._thumbGlowMaterial.getPass(i);
            this.updateMaterialColorProperty(pass, "pinchGlowColor", pinchProps.glowColor, this.lastPinchProps.glowColor);
            this.updateMaterialColorProperty(pass, "pokeGlowColor", pokeProps.glowColor, this.lastPokeProps.glowColor);
        }
    }
}
exports.GlowEffectView = GlowEffectView;
//# sourceMappingURL=GlowEffectView.js.map