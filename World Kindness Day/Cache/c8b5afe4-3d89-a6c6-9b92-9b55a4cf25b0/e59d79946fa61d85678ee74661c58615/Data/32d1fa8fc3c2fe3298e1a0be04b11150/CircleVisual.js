"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircleVisual = void 0;
const animate_1 = require("../../../Utils/animate");
const validate_1 = require("../../../Utils/validate");
const Billboard_1 = require("../Billboard/Billboard");
const InteractorCursor_1 = require("./InteractorCursor");
// To make the math of calculating angles easier to follow, the CursorMat graph uses -1 and 1 to represent the left/right hand.
var CursorMaterialHandType;
(function (CursorMaterialHandType) {
    CursorMaterialHandType[CursorMaterialHandType["Left"] = -1] = "Left";
    CursorMaterialHandType[CursorMaterialHandType["NonHand"] = 0] = "NonHand";
    CursorMaterialHandType[CursorMaterialHandType["Right"] = 1] = "Right";
})(CursorMaterialHandType || (CursorMaterialHandType = {}));
const OUTLINE_ANIMATE_DURATION = 0.1;
const DEFAULT_RENDER_ORDER = 100;
const DEFAULT_SCALE = new vec3(0.8, 0.8, 0.8);
/**
 * CircleVisual provides the circle visual of the cursor & controls the fade in/out animations.
 */
class CircleVisual {
    constructor(config) {
        this.config = config;
        this._outlineAlpha = 1.0;
        this._isShown = false;
        this._isTriggering = false;
        this._outlineOffset = 0.0;
        this._circleSquishScale = 1.0;
        this.showCancelSet = new animate_1.CancelSet();
        this.outlineAlphaCancelSet = new animate_1.CancelSet();
        this.outlineOffsetCancelSet = new animate_1.CancelSet();
        this._cursorMode = InteractorCursor_1.CursorMode.Auto;
        this._useTexture = false;
        this._materialtexture = null;
        this._customTexture = null;
        this.visual = this.sceneObject.getComponent("Component.RenderMeshVisual");
        this.billboardComponent = this.sceneObject.createComponent(Billboard_1.Billboard.getTypeName());
        const cloneMaterial = this.visual.mainMaterial.clone();
        this.visual.mainMaterial = cloneMaterial;
        this.renderOrder = DEFAULT_RENDER_ORDER;
        this.sceneObject.enabled = false;
        this.visual.getTransform().setWorldScale(DEFAULT_SCALE);
        this.configureBillboardComponent();
    }
    configureBillboardComponent() {
        this.billboardComponent.xAxisEnabled = true;
        this.billboardComponent.yAxisEnabled = true;
        this.billboardComponent.zAxisEnabled = false;
        this.billboardComponent.axisEasing = new vec3(1, 1, 1);
        this.billboardComponent.axisBufferDegrees = new vec3(0, 0, 0);
    }
    get sceneObject() {
        return this.config.meshSceneObject;
    }
    set worldPosition(position) {
        this.sceneObject.getTransform().setWorldPosition(position);
    }
    get worldPosition() {
        return this.sceneObject.getTransform().getWorldPosition();
    }
    /**
     * Sets whether or not the cursor itself should be shown, and fades it in/out accordingly.
     */
    set isShown(show) {
        if (show === this._isShown) {
            return;
        }
        this.showCancelSet();
        const initialAlpha = this.visual.mainPass.maxAlpha;
        if (show) {
            this.sceneObject.enabled = true;
            (0, animate_1.default)({
                cancelSet: this.showCancelSet,
                duration: OUTLINE_ANIMATE_DURATION,
                update: (t) => {
                    this.visual.mainPass.maxAlpha = MathUtils.lerp(initialAlpha, 1, t);
                }
            });
        }
        else {
            (0, animate_1.default)({
                cancelSet: this.showCancelSet,
                duration: OUTLINE_ANIMATE_DURATION,
                update: (t) => {
                    this.visual.mainPass.maxAlpha = MathUtils.lerp(initialAlpha, 0, t);
                },
                ended: () => {
                    this.sceneObject.enabled = false;
                }
            });
        }
        this._isShown = show;
    }
    /**
     * Sets whether or not the cursor itself should be shown.
     */
    get isShown() {
        return this._isShown;
    }
    /**
     * Sets whether or not the cursor outline should be shown and fades the outline in/out accordingly.
     */
    set outlineAlpha(alpha) {
        if (alpha === this._outlineAlpha) {
            return;
        }
        this.outlineAlphaCancelSet();
        const initialAlpha = this.visual.mainPass.outlineAlpha;
        (0, animate_1.default)({
            cancelSet: this.outlineAlphaCancelSet,
            duration: OUTLINE_ANIMATE_DURATION,
            update: (t) => {
                this.visual.mainPass.outlineAlpha = MathUtils.lerp(initialAlpha, alpha, t);
            }
        });
        this._outlineAlpha = alpha;
    }
    /**
     * Returns the current alpha of the outline.
     */
    get outlineAlpha() {
        return this._outlineAlpha;
    }
    /**
     * Sets the offset to increase the outline radius (both inner and outer edges)
     * e.g. outlineOffset = 0.1 changes the outer/inner radii from default of (0.5,0.4) to (0.6,0.5)
     */
    set outlineOffset(offset) {
        if (offset === this._outlineOffset) {
            return;
        }
        this.outlineOffsetCancelSet();
        const initialOffset = this.visual.mainPass.outlineOffset;
        (0, animate_1.default)({
            cancelSet: this.outlineOffsetCancelSet,
            duration: OUTLINE_ANIMATE_DURATION,
            update: (t) => {
                this.visual.mainPass.outlineOffset = MathUtils.lerp(initialOffset, offset, t);
            }
        });
        this._outlineOffset = offset;
    }
    /**
     * Returns the current outline offset.
     */
    get outlineOffset() {
        return this._outlineOffset;
    }
    /**
     * Sets the squish scale of the inner circle
     */
    set circleSquishScale(scale) {
        if (scale === this._circleSquishScale) {
            return;
        }
        this.visual.mainPass.circleSquishScale = scale;
        this._circleSquishScale = scale;
    }
    /**
     * Returns the current outline offset.
     */
    get circleSquishScale() {
        return this._circleSquishScale;
    }
    /**
     * Sets if the cursor should reflect a triggered state.
     */
    set isTriggering(triggering) {
        if (triggering === this._isTriggering) {
            return;
        }
        this.visual.mainPass.isTriggering = triggering;
        this._isTriggering = triggering;
    }
    /**
     * Returns if the cursor is in a triggered state.
     */
    get isTriggering() {
        return this._isTriggering;
    }
    /**
     * Sets if the visual should use a texture instead of drawing onto the plane mesh.
     */
    set useTexture(useTexture) {
        if (useTexture === this._useTexture) {
            return;
        }
        this.visual.mainPass.useTexture = useTexture;
        this._useTexture = useTexture;
    }
    /**
     * Returns if the visual should use a texture instead of drawing onto the plane mesh.
     */
    get useTexture() {
        return this._useTexture;
    }
    /**
     * Sets the texture of the cursor material's mainPass to place onto the plane mesh.
     */
    set materialTexture(texture) {
        if (texture === this._materialtexture) {
            return;
        }
        this.visual.mainPass.cursorTexture = texture;
        this._materialtexture = texture;
    }
    /**
     * Returns the texture to place onto the plane mesh.
     */
    get materialTexture() {
        return this._materialtexture;
    }
    /**
     * Caches the custom texture to place onto the plane mesh when using {@link CursorMode}.Custom.
     */
    set customTexture(texture) {
        if (texture === this._customTexture) {
            return;
        }
        if (this.cursorMode === InteractorCursor_1.CursorMode.Custom) {
            this.materialTexture = texture;
        }
        this._customTexture = texture;
    }
    /**
     * Returns the custom texture to place onto the plane mesh when using {@link CursorMode}.Custom.
     */
    get customTexture() {
        return this._customTexture;
    }
    /**
     * Set the {@link CursorMode} of the cursor to change the visual
     * To return the cursor to its default {@link StateMachine} logic, use {@link CursorMode}.Auto
     * @param cursorMode - The new mode of the cursor visual
     */
    set cursorMode(cursorMode) {
        if (cursorMode === this.cursorMode) {
            return;
        }
        this.useTexture = cursorMode !== InteractorCursor_1.CursorMode.Auto;
        switch (cursorMode) {
            case InteractorCursor_1.CursorMode.Translate:
                this.materialTexture = this.config.textures.translate;
                break;
            case InteractorCursor_1.CursorMode.ScaleTopLeft:
                this.materialTexture = this.config.textures.scaleTL;
                break;
            case InteractorCursor_1.CursorMode.ScaleTopRight:
                this.materialTexture = this.config.textures.scaleTR;
                break;
            case InteractorCursor_1.CursorMode.Disabled:
                this.materialTexture = this.config.textures.disabled;
                break;
            case InteractorCursor_1.CursorMode.Custom:
                (0, validate_1.validate)(this.customTexture);
                this.materialTexture = this.customTexture;
                break;
            default:
                break;
        }
        this._cursorMode = cursorMode;
    }
    /**
     * Returns the {@link Texture} of the cursor when using the {@link CursorMode}.Custom mode
     * @returns the custom texture (typically cached via requireAsset(.../assetName.png) as Texture) to use
     */
    get cursorMode() {
        return this._cursorMode;
    }
    set renderOrder(renderOrder) {
        this.visual.setRenderOrder(renderOrder);
    }
    get renderOrder() {
        return this.visual.getRenderOrder();
    }
    /**
     * Set the 'handedness' of the cursor, e.g. left, right, or non-hand.
     */
    set handType(type) {
        let materialInput;
        // The material graph uses -1,0,1 to differentiate the types.
        switch (type) {
            case "left":
                materialInput = CursorMaterialHandType.Left;
                break;
            case "right":
                materialInput = CursorMaterialHandType.Right;
                break;
            default:
                materialInput = CursorMaterialHandType.NonHand;
        }
        this.visual.mainPass.handType = materialInput;
    }
    /**
     * Get the 'handedness' of the cursor, e.g. left, right, or non-hand.
     * @returns -1 for Left, 0 for Non-Hand, 1 for Right
     */
    get handType() {
        switch (this.visual.mainPass.handType) {
            case -1:
                return "left";
            case 1:
                return "right";
            default:
                return null;
        }
    }
    /**
     * Set if there are multiple Interactors active in the scene to enable the multi-Interactor look.
     */
    set multipleInteractorsActive(active) {
        this.visual.mainPass.multipleInteractorsActive = active;
    }
    /**
     * Returns if there are multiple Interactors active in the scene to enable the multi-Interactor look.
     */
    get multipleInteractorsActive() {
        return this.visual.mainPass.multipleInteractorsActive;
    }
    /**
     * Set the world scale of the cursor.
     */
    set worldScale(scale) {
        this.visual.getTransform().setWorldScale(scale);
    }
    /**
     * Returns the world scale of the cursor.
     */
    get worldScale() {
        return this.visual.getTransform().getWorldScale();
    }
    get materialParameters() {
        return {
            maxAlpha: this.visual.mainPass.maxAlpha,
            outlineAlpha: this.visual.mainPass.outlineAlpha,
            outlineOffset: this.visual.mainPass.outlineOffset,
            circleSquishScale: this.visual.mainPass.circleSquishScale,
            isTriggering: this.visual.mainPass.isTriggering,
            useTexture: this.visual.mainPass.useTexture,
            cursorTexture: this.visual.mainPass.cursorTexture,
            handType: this.visual.mainPass.handType,
            multipleInteractorsActive: this.visual.mainPass.multipleInteractorsActive
        };
    }
}
exports.CircleVisual = CircleVisual;
//# sourceMappingURL=CircleVisual.js.map