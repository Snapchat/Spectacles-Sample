import {GrabbableObject} from "Scripts/GrabbableObject"

/**
 * This class provides visual feedback by adding an outline to mesh visuals when object is grabbed.
 * Works with GrabbableObject component.
 */
@component
export class GrabbableOutlineFeedback extends BaseScriptComponent {
  /**
   * This is the material that will provide the mesh outline.
   */
  @input
  @hint("This is the material that will provide the mesh outline.")
  targetOutlineMaterial!: Material

  /**
   * This is the color of the outline when grabbed.
   */
  @input("vec4", "{1, 1, 1, 1}")
  @hint("This is the color of the outline when grabbed.")
  @widget(new ColorWidget())
  grabbedColor: vec4 = new vec4(1, 1, 1, 1)

  /**
   * This is the thickness of the outline.
   */
  @input
  @hint("This is the thickness of the outline.")
  outlineWeight: number = 0.25

  /**
   * These are the meshes that will be outlined when grabbed.
   */
  @input
  @hint("These are the meshes that will be outlined when grabbed.")
  meshVisuals: RenderMeshVisual[] = []

  private grabbableObject: GrabbableObject | null = null
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
    this.highlightMaterial.mainPass.lineColor = this.grabbedColor

    // Find GrabbableObject component on this object
    this.grabbableObject = this.findGrabbableObjectComponent()
    if (!this.grabbableObject) {
      print("GrabbableOutlineFeedback: No GrabbableObject found - please add GrabbableObject component to this object")
      return
    }

    this.setupGrabbableCallbacks()
  }

  /**
   * Find GrabbableObject component on this scene object
   */
  private findGrabbableObjectComponent(): GrabbableObject | null {
    const allComponents = this.getSceneObject().getComponents("Component.ScriptComponent")
    for (let i = 0; i < allComponents.length; i++) {
      const comp = allComponents[i]
      // Check if this is a GrabbableObject by checking if it has the required methods
      if (comp && typeof (comp as any).onGrab === "function" && typeof (comp as any).onRelease === "function") {
        return comp as GrabbableObject
      }
    }
    return null
  }

  addMaterialToRenderMeshArray(): void {
    if (!this.outlineEnabled) {
      print("GrabbableOutlineFeedback: Outline disabled, not adding")
      return
    }

    print(`GrabbableOutlineFeedback: Adding outline to ${this.meshVisuals.length} meshes`)

    for (let i = 0; i < this.meshVisuals.length; i++) {
      if (!this.meshVisuals[i]) {
        print(`GrabbableOutlineFeedback: Mesh at index ${i} is null, skipping`)
        continue
      }

      const matCount = this.meshVisuals[i].getMaterialsCount()

      let addMaterial = true
      for (let k = 0; k < matCount; k++) {
        const material = this.meshVisuals[i].getMaterial(k)

        if (this.highlightMaterial !== undefined && material.isSame(this.highlightMaterial)) {
          addMaterial = false
          print(`GrabbableOutlineFeedback: Outline already exists on mesh ${i}`)
          break
        }
      }

      if (this.highlightMaterial !== undefined && addMaterial) {
        const materials = this.meshVisuals[i].materials
        materials.unshift(this.highlightMaterial)
        this.meshVisuals[i].materials = materials
        print(`GrabbableOutlineFeedback: Added outline to mesh ${i}`)
      }
    }
  }

  removeMaterialFromRenderMeshArray(): void {
    print(`GrabbableOutlineFeedback: Removing outline from ${this.meshVisuals.length} meshes`)

    for (let i = 0; i < this.meshVisuals.length; i++) {
      if (!this.meshVisuals[i]) {
        print(`GrabbableOutlineFeedback: Mesh at index ${i} is null, skipping`)
        continue
      }

      const materials = []

      const matCount = this.meshVisuals[i].getMaterialsCount()
      print(`GrabbableOutlineFeedback: Mesh ${i} has ${matCount} materials`)

      for (let k = 0; k < matCount; k++) {
        const material = this.meshVisuals[i].getMaterial(k)

        if (this.highlightMaterial !== undefined && material.isSame(this.highlightMaterial)) {
          print(`GrabbableOutlineFeedback: Found and removing outline material at index ${k}`)
          continue
        }

        materials.push(material)
      }

      this.meshVisuals[i].clearMaterials()

      for (let k = 0; k < materials.length; k++) {
        this.meshVisuals[i].addMaterial(materials[k])
      }

      print(`GrabbableOutlineFeedback: Mesh ${i} now has ${this.meshVisuals[i].getMaterialsCount()} materials`)
    }
  }

  setupGrabbableCallbacks(): void {
    if (!this.grabbableObject) return

    // Show outline when object is grabbed
    this.grabbableObject.onGrabStartEvent.add(() => {
      this.addMaterialToRenderMeshArray()
      print("GrabbableOutlineFeedback: Object grabbed - showing outline")
    })

    // Remove outline when object is released
    this.grabbableObject.onGrabEndEvent.add(() => {
      this.removeMaterialFromRenderMeshArray()
      print("GrabbableOutlineFeedback: Object released - hiding outline")
    })
  }
}
