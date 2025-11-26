"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LabeledPinchButton = void 0;
const Interactable_1 = require("../../../../Components/Interaction/Interactable/Interactable");
const Interactor_1 = require("../../../../Core/Interactor/Interactor");
const Event_1 = require("../../../../Utils/Event");
const validate_1 = require("../../../../Utils/validate");
class LabeledPinchButton {
    constructor(options) {
        this.options = options;
        this.defaultColor = this.options.defaultColor || new vec4(0.5, 0.5, 0.5, 1);
        this.hoverColor = this.options.hoverColor || new vec4(0.9, 0.8, 0.2, 1);
        this.triggerColor = this.options.triggerColor || new vec4(0.8, 0.7, 0.2, 1);
        this.isToggle = this.options.toggle ?? false;
        this.toggled = false;
        this.triggerEvent = new Event_1.default();
        this.onTrigger = this.triggerEvent.publicApi();
        this.colors = {
            default: [this.defaultColor],
            hover: [this.hoverColor],
            trigger: [this.triggerColor]
        };
        this.alpha = 1;
        this.labels = this.options.labels;
        this._labelIndex = 0;
        this.setRenderOrder = (newOrder) => {
            this.rmv.setRenderOrder(newOrder);
        };
        this.setAlpha = (alpha) => {
            this.alpha = alpha;
            this.material.mainPass.alpha = this.baseAlpha * this.alpha;
        };
        this.setColor = (state) => {
            const [color] = this.colors[state];
            this.material.mainPass.baseColor = color;
            if (state === "trigger") {
                this.material.mainPass.triggered = 1;
            }
            else {
                this.material.mainPass.triggered = 0;
            }
        };
        this.setTexture = (labelIndex) => {
            this._labelIndex = labelIndex;
            this.material.mainPass.icon = this.labels[this._labelIndex];
        };
        this.setupButtonTrigger = () => {
            (0, validate_1.validate)(this.interactable);
            let isTriggered = false;
            this.interactable.onTriggerStart.add((e) => {
                e.stopPropagation();
                this.setColor("trigger");
                this.rmv.setBlendShapeWeight("Pinch", 1);
                isTriggered = true;
            });
            this.interactable.onTriggerEnd.add((e) => {
                e.stopPropagation();
                this.rmv.setBlendShapeWeight("Pinch", 0);
                if (isTriggered) {
                    this.triggerEvent.invoke();
                    if (!this.isToggle) {
                        this.setColor("hover");
                    }
                    else {
                        if (!this.toggled)
                            this.setColor("hover");
                    }
                }
                isTriggered = false;
            });
            this.interactable.onTriggerEndOutside.add(() => {
                this.rmv.setBlendShapeWeight("Pinch", 0);
                isTriggered = false;
            });
            this.interactable.onTriggerCanceled.add(() => {
                this.rmv.setBlendShapeWeight("Pinch", 0);
                isTriggered = false;
            });
        };
        this.setIconScale = (scale) => {
            this.material.mainPass.iconScale = scale;
        };
        this.getInteractable = () => this.interactable;
        this.labeledPinchButtonPrefab = options.prefab;
        this.object = this.labeledPinchButtonPrefab.instantiate(null);
        this.interactable = this.object.getComponent(Interactable_1.Interactable.getTypeName());
        (0, validate_1.validate)(this.interactable);
        this.transform = this.object.getTransform();
        this.rmv = this.object.getComponent("Component.RenderMeshVisual");
        this.material = this.rmv.mainMaterial.clone();
        this.baseAlpha = this.material.mainPass.alpha;
        this.material.mainPass.icon = this.labels[this.labelIndex];
        this.material.mainPass.hoverColor = this.hoverColor;
        this.material.mainPass.isToggle = this.isToggle ? 1 : 0;
        this.rmv.mainMaterial = this.material;
        this.object.setParent(this.options.parent);
        this.setupButtonTrigger();
        this.setColor("default");
        this.interactable.onHoverEnter.add(() => {
            if (!this.toggled) {
                this.setColor("hover");
            }
            else {
                this.material.mainPass.hovered = 1;
            }
        });
        this.interactable.onHoverExit.add(() => {
            if (!this.isToggle) {
                this.setColor("default");
            }
            else {
                if (this.toggled) {
                    this.setColor("trigger");
                }
                else {
                    this.setColor("default");
                }
            }
            this.material.mainPass.hovered = 0;
        });
        this.interactable.targetingMode = Interactor_1.TargetingMode.All;
    }
    get labelIndex() {
        return this._labelIndex;
    }
}
exports.LabeledPinchButton = LabeledPinchButton;
//# sourceMappingURL=LabeledPinchButton.js.map