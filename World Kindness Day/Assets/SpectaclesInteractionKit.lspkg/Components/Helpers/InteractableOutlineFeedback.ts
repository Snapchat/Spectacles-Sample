import {validate} from "../../Utils/validate"
import {Interactable} from "../Interaction/Interactable/Interactable"

/**
 * This class provides visual feedback by adding an outline to mesh visuals when they are hovered or pinched. It allows
 * customization of the outline color, thickness, and target meshes.
 */
@component
export class InteractableOutlineFeedback extends BaseScriptComponent {
  /**
   * This is the material that will provide the mesh outline.
   */
  @input
  @hint("This is the material that will provide the mesh outline.")
  targetOutlineMaterial!: Material

  /**
   * This is the color of the outline when hovered.
   */
  @input("vec4", "{1, 1, 0.04, 1}")
  @hint("This is the color of the outline when hovered.")
  @widget(new ColorWidget())
  hoveringColor: vec4 = new vec4(1, 1, 0.04, 1)

  /**
   * This is the color of the outline when triggered.
   */
  @input("vec4", "{1, 1, 1, 1}")
  @hint("This is the color of the outline when triggered.")
  @widget(new ColorWidget())
  activatingColor: vec4 = new vec4(1, 1, 1, 1)

  /**
   * This is the thickness of the outline.
   */
  @input
  @hint("This is the thickness of the outline.")
  outlineWeight: number = 0.25

  /**
   * These are the meshes that will be outlined on pinch/hover.
   */
  @input
  @hint("These are the meshes that will be outlined on pinch/hover.")
  meshVisuals: RenderMeshVisual[] = []

  private interactable: Interactable | null = null
  private outlineEnabled: boolean = true

  private highlightMaterial: Material | undefined

  onAwake(): void {
    this.defineScriptEvents()
  }

  private defineScriptEvents() {
    this.createEvent("OnStartEvent").bind(() => {
      this.init()

      this.createEvent("OnEnableEvent").bind(() => {
        this.outlineEnabled = true
      })

      this.createEvent("OnDisableEvent").bind(() => {
        this.outlineEnabled = false
        this.removeMaterialFromRenderMeshArray()
      })
    })
  }

  init() {
    this.highlightMaterial = this.targetOutlineMaterial.clone()
    this.highlightMaterial.mainPass.lineWeight = this.outlineWeight
    this.highlightMaterial.mainPass.lineColor = this.hoveringColor

    this.interactable = this.getSceneObject().getComponent(Interactable.getTypeName())
    if (!this.interactable) {
      throw new Error(
        "No interactable was found - please ensure that a component matching the Interactable typename provided was added to this SceneObject."
      )
    }

    this.setupInteractableCallbacks()
  }

  addMaterialToRenderMeshArray(): void {
    if (!this.outlineEnabled) {
      return
    }

    for (let i = 0; i < this.meshVisuals.length; i++) {
      const matCount = this.meshVisuals[i].getMaterialsCount()

      let addMaterial = true
      for (let k = 0; k < matCount; k++) {
        const material = this.meshVisuals[i].getMaterial(k)

        if (this.highlightMaterial !== undefined && material.isSame(this.highlightMaterial)) {
          addMaterial = false
          break
        }
      }

      if (this.highlightMaterial !== undefined && addMaterial) {
        const materials = this.meshVisuals[i].materials
        materials.unshift(this.highlightMaterial)
        this.meshVisuals[i].materials = materials
      }
    }
  }

  removeMaterialFromRenderMeshArray(): void {
    for (let i = 0; i < this.meshVisuals.length; i++) {
      const materials = []

      const matCount = this.meshVisuals[i].getMaterialsCount()

      for (let k = 0; k < matCount; k++) {
        const material = this.meshVisuals[i].getMaterial(k)

        if (this.highlightMaterial !== undefined && material.isSame(this.highlightMaterial)) {
          continue
        }

        materials.push(material)
      }

      this.meshVisuals[i].clearMaterials()

      for (let k = 0; k < materials.length; k++) {
        this.meshVisuals[i].addMaterial(materials[k])
      }
    }
  }

  setupInteractableCallbacks(): void {
    validate(this.interactable)

    this.interactable.onHoverEnter.add((event) => {
      this.addMaterialToRenderMeshArray()

      if (event.interactor.isTriggering) {
        this.setHighlightColor(this.activatingColor)
      }
    })

    this.interactable.onHoverExit.add((event) => {
      if (this.interactable?.keepHoverOnTrigger && event.interactor.isTriggering) {
        return
      }

      this.removeMaterialFromRenderMeshArray()
    })

    this.interactable.onTriggerStart.add(() => {
      this.setHighlightColor(this.activatingColor)
    })

    this.interactable.onTriggerEnd.add(() => {
      this.setHighlightColor(this.hoveringColor)
    })

    this.interactable.onTriggerEndOutside.add(() => {
      this.setHighlightColor(this.hoveringColor)
      this.removeMaterialFromRenderMeshArray()
    })

    this.interactable.onTriggerCanceled.add(() => {
      this.setHighlightColor(this.hoveringColor)
      this.removeMaterialFromRenderMeshArray()
    })

    this.interactable.onSyncHoverEnter.add((event) => {
      this.addMaterialToRenderMeshArray()

      if (event.interactor.isTriggering) {
        this.setHighlightColor(this.activatingColor)
      }
    })

    this.interactable.onSyncHoverExit.add((event) => {
      if (this.interactable?.keepHoverOnTrigger && event.interactor.isTriggering) {
        return
      }

      this.removeMaterialFromRenderMeshArray()
    })

    this.interactable.onSyncTriggerStart.add(() => {
      this.setHighlightColor(this.activatingColor)
    })

    this.interactable.onSyncTriggerEnd.add(() => {
      this.setHighlightColor(this.hoveringColor)
    })

    this.interactable.onSyncTriggerEndOutside.add(() => {
      this.setHighlightColor(this.hoveringColor)
      this.removeMaterialFromRenderMeshArray()
    })

    this.interactable.onSyncTriggerCanceled.add(() => {
      this.setHighlightColor(this.hoveringColor)
      this.removeMaterialFromRenderMeshArray()
    })
  }

  public setHighlightColor(color: vec4): void {
    validate(this.highlightMaterial)

    this.highlightMaterial.mainPass.lineColor = color
  }
}
