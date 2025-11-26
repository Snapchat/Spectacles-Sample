import {Interactable} from "../../../../Components/Interaction/Interactable/Interactable"
import {TargetingMode} from "../../../../Core/Interactor/Interactor"
import {InteractorEvent} from "../../../../Core/Interactor/InteractorEvent"
import Event, {PublicApi} from "../../../../Utils/Event"
import {validate} from "../../../../Utils/validate"

export type LabeledPinchButtonOptions = {
  parent: SceneObject
  prefab: ObjectPrefab
  labels: Texture[]
  toggle?: boolean
  defaultColor?: vec4
  hoverColor?: vec4
  triggerColor?: vec4
}

export class LabeledPinchButton {
  defaultColor: vec4 = this.options.defaultColor || new vec4(0.5, 0.5, 0.5, 1)
  hoverColor: vec4 = this.options.hoverColor || new vec4(0.9, 0.8, 0.2, 1)
  triggerColor: vec4 = this.options.triggerColor || new vec4(0.8, 0.7, 0.2, 1)
  private labeledPinchButtonPrefab: ObjectPrefab
  object: SceneObject
  private isToggle = this.options.toggle ?? false
  toggled = false
  private interactable: Interactable | null
  private triggerEvent: Event = new Event()
  onTrigger: PublicApi<void> = this.triggerEvent.publicApi()

  private colors: {[index: string]: vec4[]} = {
    default: [this.defaultColor],
    hover: [this.hoverColor],
    trigger: [this.triggerColor]
  }

  transform: Transform
  alpha: number = 1
  private rmv: RenderMeshVisual
  private material: Material
  private baseAlpha: number
  private labels = this.options.labels
  private _labelIndex: number = 0

  constructor(private options: LabeledPinchButtonOptions) {
    this.labeledPinchButtonPrefab = options.prefab
    this.object = this.labeledPinchButtonPrefab.instantiate(null as unknown as SceneObject)
    this.interactable = this.object.getComponent(Interactable.getTypeName())

    validate(this.interactable)

    this.transform = this.object.getTransform()

    this.rmv = this.object.getComponent("Component.RenderMeshVisual")
    this.material = this.rmv.mainMaterial.clone()
    this.baseAlpha = this.material.mainPass.alpha as number
    this.material.mainPass.icon = this.labels[this.labelIndex]
    this.material.mainPass.hoverColor = this.hoverColor
    this.material.mainPass.isToggle = this.isToggle ? 1 : 0

    this.rmv.mainMaterial = this.material
    this.object.setParent(this.options.parent)

    this.setupButtonTrigger()

    this.setColor("default")

    this.interactable.onHoverEnter.add(() => {
      if (!this.toggled) {
        this.setColor("hover")
      } else {
        this.material.mainPass.hovered = 1
      }
    })
    this.interactable.onHoverExit.add(() => {
      if (!this.isToggle) {
        this.setColor("default")
      } else {
        if (this.toggled) {
          this.setColor("trigger")
        } else {
          this.setColor("default")
        }
      }
      this.material.mainPass.hovered = 0
    })

    this.interactable.targetingMode = TargetingMode.All
  }

  setRenderOrder = (newOrder: number) => {
    this.rmv.setRenderOrder(newOrder)
  }

  setAlpha = (alpha: number) => {
    this.alpha = alpha
    this.material.mainPass.alpha = this.baseAlpha * this.alpha
  }

  setColor = (state: string) => {
    const [color] = this.colors[state]
    this.material.mainPass.baseColor = color
    if (state === "trigger") {
      this.material.mainPass.triggered = 1
    } else {
      this.material.mainPass.triggered = 0
    }
  }

  setTexture = (labelIndex: number) => {
    this._labelIndex = labelIndex
    this.material.mainPass.icon = this.labels[this._labelIndex]
  }

  get labelIndex() {
    return this._labelIndex
  }

  private setupButtonTrigger = () => {
    validate(this.interactable)

    let isTriggered = false
    this.interactable.onTriggerStart.add((e: InteractorEvent) => {
      e.stopPropagation()
      this.setColor("trigger")
      this.rmv.setBlendShapeWeight("Pinch", 1)
      isTriggered = true
    })
    this.interactable.onTriggerEnd.add((e: InteractorEvent) => {
      e.stopPropagation()
      this.rmv.setBlendShapeWeight("Pinch", 0)
      if (isTriggered) {
        this.triggerEvent.invoke()
        if (!this.isToggle) {
          this.setColor("hover")
        } else {
          if (!this.toggled) this.setColor("hover")
        }
      }
      isTriggered = false
    })
    this.interactable.onTriggerEndOutside.add(() => {
      this.rmv.setBlendShapeWeight("Pinch", 0)
      isTriggered = false
    })
    this.interactable.onTriggerCanceled.add(() => {
      this.rmv.setBlendShapeWeight("Pinch", 0)
      isTriggered = false
    })
  }

  setIconScale = (scale: vec2) => {
    this.material.mainPass.iconScale = scale
  }

  getInteractable = () => this.interactable
}
