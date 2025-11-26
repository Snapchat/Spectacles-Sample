import {InteractorEvent} from "../../Core/Interactor/InteractorEvent"
import {SIK} from "../../SIK"
import {validate} from "../../Utils/validate"
import {Interactable} from "../Interaction/Interactable/Interactable"
import {ToggleButton} from "../UI/ToggleButton/ToggleButton"

const PINCH_BUTTON: number = 0
const TOGGLE_BUTTON: number = 1
const STATE_BUTTON: number = 2

/**
 * This class provides visual feedback for different types of buttons, such as Pinch Button, Toggle Button, and State
 * Button. It allows customization of the button's appearance and behavior based on its state.
 */
@component
export class ButtonFeedback extends BaseScriptComponent {
  /**
   * Defines the interactive behavior and visual feedback style of the button:
   * - Pinch Button: Standard button with hover/pinch states.
   * - Toggle Button: Switches between on/off states and maintains state after interaction.
   * - State Button: Similar to toggle button but with optional Persistent Pinched State.
   */
  @input("int")
  @hint(
    "Defines the interactive behavior and visual feedback style of the button:\n\
- Pinch Button: Standard button with hover/pinch states.\n\
- Toggle Button: Switches between on/off states and maintains state after interaction.\n\
- State Button: Similar to toggle button but with optional Persistent Pinched State."
  )
  @widget(
    new ComboBoxWidget([
      new ComboBoxItem("Pinch Button", 0),
      new ComboBoxItem("Toggle Button", 1),
      new ComboBoxItem("State Button", 2)
    ])
  )
  buttonType: number = 0
  /**
   * The RenderMeshVisual component of the button that will be used for ButtonFeedback.
   */
  @ui.separator
  @input
  @hint("The RenderMeshVisual component of the button that will be used for ButtonFeedback.")
  renderMeshVisual!: RenderMeshVisual
  /**
   * When enabled, adds a glow effect to the button that can be independently animated with its own materials and
   * blend shapes during interactions.
   */
  @input
  @hint(
    "When enabled, adds a glow effect to the button that can be independently animated with its own materials and \
blend shapes during interactions."
  )
  @showIf("buttonType", 0)
  useGlowMesh: boolean = false
  /**
   * The secondary mesh that displays the glow effect around the button. This mesh will receive its own material
   * changes and blend shape animations independent from the main button mesh during interactions.
   */
  @input
  @hint(
    "The secondary mesh that displays the glow effect around the button. This mesh will receive its own material \
changes and blend shape animations independent from the main button mesh during interactions."
  )
  @allowUndefined
  @showIf("useGlowMesh", true)
  glowRenderMeshVisual!: RenderMeshVisual
  /**
   * Controls the maximum intensity of the button's deformation effect when interacted with. This scales the weight
   * applied to the mesh's blend shape (defined by Mesh Blend Shape Name). Higher values create more pronounced visual
   * feedback during interactions. Range: 0.0 (no effect) to 1.0 (maximum effect).
   */
  @input
  @hint(
    "Controls the maximum intensity of the button's deformation effect when interacted with. This scales the weight \
applied to the mesh's blend shape (defined by Mesh Blend Shape Name). Higher values create more pronounced visual \
feedback during interactions. Range: 0.0 (no effect) to 1.0 (maximum effect)."
  )
  maxBlendShapeWeight: number = 1.0
  /**
   * References the blend shape on the button mesh that will be animated during interactions. Must match an existing
   * blend shape name in your mesh. Default is "Pinch", but should be set to match a blend shape available in your mesh.
   */
  @ui.separator
  @input
  @hint(
    'References the blend shape on the button mesh that will be animated during interactions. Must match an existing \
blend shape name in your mesh. Default is "Pinch", but should be set to match a blend shape available in your mesh.'
  )
  meshBlendShapeName: string = "Pinch"
  /**
   * The material applied to the button when not being interacted with (idle state).
   */
  @input
  @hint("The material applied to the button when not being interacted with (idle state).")
  meshIdleMaterial!: Material
  /**
   * The material applied to the button when an Interactor is hovering over it.
   */
  @input
  @hint("The material applied to the button when an Interactor is hovering over it.")
  meshHoverMaterial!: Material
  /**
   * The material applied to the button when the user is actively interacting with it.
   */
  @input
  @hint("The material applied to the button when the user is actively interacting with it.")
  meshPinchedMaterial!: Material
  /**
   * References the blend shape on the glow mesh that will be animated during interactions. Must match an existing
   * blend shape name in your glow mesh. This controls the shape animation of the glow effect as the button is
   * interacted with.
   */
  @ui.separator
  @input
  @hint(
    "References the blend shape on the glow mesh that will be animated during interactions. Must match an existing \
blend shape name in your glow mesh. This controls the shape animation of the glow effect as the button is \
interacted with."
  )
  @allowUndefined
  @showIf("useGlowMesh", true)
  glowBlendShapeName: string = "Pinch"
  /**
   * The material applied to the glow mesh when the button is in its default state (not being interacted with).
   */
  @input("Asset.Material")
  @hint("The material applied to the glow mesh when the button is in its default state (not being interacted with).")
  @allowUndefined
  @showIf("useGlowMesh", true)
  glowIdleMaterial: Material | undefined
  /**
   * The material applied to the glow mesh when a user's hand is hovering over the button.
   */
  @input("Asset.Material")
  @hint("The material applied to the glow mesh when a user's hand is hovering over the button.")
  @allowUndefined
  @showIf("useGlowMesh", true)
  glowHoverMaterial: Material | undefined
  /**
   * The material applied to the glow mesh when the user is actively interacting with the button.
   */
  @input("Asset.Material")
  @hint("The material applied to the glow mesh when the user is actively interacting with the button.")
  @allowUndefined
  @showIf("useGlowMesh", true)
  glowPinchedMaterial: Material | undefined
  /**
   * The material applied to the toggled button when the user is actively interacting with it.
   */
  @input("Asset.Material")
  @hint("The material applied to the toggled button when the user is actively interacting with it.")
  @showIf("buttonType", 1)
  @allowUndefined
  meshToggledPinchedMaterial: Material | undefined
  /**
   * The material applied to the button when it's in the toggled "on" state AND being hovered over.
   */
  @input("Asset.Material")
  @hint('The material applied to the button when it\'s in the toggled "on" state AND being hovered over.')
  @showIf("buttonType", 1)
  @allowUndefined
  meshToggledHoverMaterial: Material | undefined
  /**
   * The material applied to the button when it's in the toggled "on" state and not being interacted with.
   */
  @input("Asset.Material")
  @hint('The material applied to the button when it\'s in the toggled "on" state and not being interacted with.')
  @showIf("buttonType", 1)
  @allowUndefined
  meshToggledIdleMaterial: Material | undefined
  /**
   * The material applied to the State Button when it's being actively interacted with. This provides visual feedback
   * during interaction and may remain applied after the interaction ends if persistentPinchedState is enabled.
   */
  @input("Asset.Material")
  @hint(
    "The material applied to the State Button when it's being actively interacted with. This provides visual feedback \
during interaction and may remain applied after the interaction ends if persistentPinchedState is enabled."
  )
  @showIf("buttonType", 2)
  @allowUndefined
  meshStatePinchedMaterial: Material | undefined
  /**
   * The material applied to the State Button when a user's hand is hovering over it.
   */
  @input("Asset.Material")
  @hint("The material applied to the State Button when a user's hand is hovering over it.")
  @showIf("buttonType", 2)
  @allowUndefined
  meshStateHoverMaterial: Material | undefined
  /**
   * The material applied to the State Button when it's in its default state (not being interacted with).
   */
  @input("Asset.Material")
  @hint("The material applied to the State Button when it's in its default state (not being interacted with).")
  @showIf("buttonType", 2)
  @allowUndefined
  meshStateIdleMaterial: Material | undefined
  /**
   * When enabled, the State Button will maintain its pressed visual appearance after interaction ends while in the
   * toggled state.
   */
  @input
  @hint(
    "When enabled, the State Button will maintain its pressed visual appearance after interaction ends while in the \
toggled state."
  )
  @showIf("buttonType", 2)
  persistentPinchedState: boolean = false
  /**
   * The texture displayed on the button in its default state (not toggled). Applied to idle, hover, and pinched
   * materials.
   */
  @ui.separator
  @input("Asset.Texture")
  @hint(
    "The texture displayed on the button in its default state (not toggled). Applied to idle, hover, and pinched \
materials."
  )
  @allowUndefined
  defaultIcon: Texture | undefined
  /**
   * The texture displayed when the button is toggled on. Replaces defaultIcon for toggle and state buttons when
   * activated.
   */
  @input("Asset.Texture")
  @hint(
    "The texture displayed when the button is toggled on. Replaces defaultIcon for toggle and state buttons when \
activated."
  )
  @allowUndefined
  onIcon: Texture | undefined

  private interactable: Interactable | null = null
  private toggleButton: ToggleButton | null = null
  private initialMaxInteractionStrength: number = 0.0
  private squishEnabled: boolean = true

  onAwake(): void {
    this.init()
  }

  private init = (): void => {
    if (isNull(this.renderMeshVisual)) {
      throw new Error("No RenderMeshVisual component attached to this entity!")
    }

    this.renderMeshVisual.mainMaterial = this.renderMeshVisual.getMaterial(0).clone()

    if (this.useGlowMesh) {
      if (this.glowRenderMeshVisual !== undefined) {
        this.glowRenderMeshVisual.mainMaterial = this.glowRenderMeshVisual.getMaterial(0).clone()
      } else {
        this.useGlowMesh = false
        print("No Glow RenderMeshVisual component attached to this entity.")
      }
    }

    this.createEvent("OnEnableEvent").bind(() => {
      this.squishEnabled = true
    })

    this.createEvent("OnDisableEvent").bind(() => {
      this.squishEnabled = false
    })

    this.createEvent("OnStartEvent").bind(() => {
      this.interactable = this.getSceneObject().getComponent(Interactable.getTypeName())
      if (isNull(this.interactable)) {
        throw new Error("Interactable component not found in this entity!")
      }

      if (this.buttonType === TOGGLE_BUTTON || this.buttonType === STATE_BUTTON) {
        this.toggleButton = this.getSceneObject().getComponent(ToggleButton.getTypeName())
        if (isNull(this.toggleButton)) {
          throw new Error("ToggleButton component not found in this entity!")
        }
      }

      this.setupInteractableCallbacks()

      if (
        this.meshIdleMaterial === undefined ||
        this.meshHoverMaterial === undefined ||
        this.meshPinchedMaterial === undefined
      ) {
        throw new Error(
          "ButtonFeedback requires meshIdleMaterial, meshHoverMaterial, and meshPinchedMaterial to be set! SceneObject name: " +
            this.getSceneObject().name
        )
      }

      if (this.buttonType === TOGGLE_BUTTON) {
        if (
          this.meshToggledIdleMaterial === undefined ||
          this.meshToggledHoverMaterial === undefined ||
          this.meshToggledPinchedMaterial === undefined
        ) {
          throw new Error(
            "ToggleButton requires meshToggledIdleMaterial, meshToggledHoverMaterial, and meshToggledPinchedMaterial to be set! SceneObject name: " +
              this.getSceneObject().name
          )
        }
      } else if (this.buttonType === STATE_BUTTON) {
        if (
          this.meshStateIdleMaterial === undefined ||
          this.meshStateHoverMaterial === undefined ||
          this.meshStatePinchedMaterial === undefined
        ) {
          throw new Error(
            "StateButton requires meshStateIdleMaterial, meshStateHoverMaterial, and meshStatePinchedMaterial to be set! SceneObject name: " +
              this.getSceneObject().name
          )
        }
      }

      this.meshIdleMaterial = this.meshIdleMaterial.clone()
      this.meshHoverMaterial = this.meshHoverMaterial.clone()
      this.meshPinchedMaterial = this.meshPinchedMaterial.clone()

      if (this.defaultIcon !== undefined) {
        this.meshIdleMaterial.mainPass.iconEnabled = true
        this.meshHoverMaterial.mainPass.iconEnabled = true
        this.meshPinchedMaterial.mainPass.iconEnabled = true
        this.meshIdleMaterial.mainPass.icon = this.defaultIcon
        this.meshHoverMaterial.mainPass.icon = this.defaultIcon
        this.meshPinchedMaterial.mainPass.icon = this.defaultIcon
      }

      if (this.onIcon !== undefined) {
        if (this.buttonType === TOGGLE_BUTTON) {
          if (
            this.meshToggledIdleMaterial !== undefined &&
            this.meshToggledHoverMaterial !== undefined &&
            this.meshToggledPinchedMaterial !== undefined
          ) {
            this.meshToggledIdleMaterial = this.meshToggledIdleMaterial.clone()
            this.meshToggledHoverMaterial = this.meshToggledHoverMaterial.clone()
            this.meshToggledPinchedMaterial = this.meshToggledPinchedMaterial.clone()

            this.meshToggledIdleMaterial.mainPass.iconEnabled = true
            this.meshToggledHoverMaterial.mainPass.iconEnabled = true
            this.meshToggledPinchedMaterial.mainPass.iconEnabled = true

            this.meshToggledIdleMaterial.mainPass.icon = this.onIcon
            this.meshToggledHoverMaterial.mainPass.icon = this.onIcon
            this.meshToggledPinchedMaterial.mainPass.icon = this.onIcon
          }
        } else if (this.buttonType === STATE_BUTTON) {
          if (
            this.meshStateIdleMaterial !== undefined &&
            this.meshStateHoverMaterial !== undefined &&
            this.meshStatePinchedMaterial !== undefined
          ) {
            this.meshStateIdleMaterial = this.meshStateIdleMaterial.clone()
            this.meshStateHoverMaterial = this.meshStateHoverMaterial.clone()
            this.meshStatePinchedMaterial = this.meshStatePinchedMaterial.clone()

            this.meshStateIdleMaterial.mainPass.iconEnabled = true
            this.meshStateHoverMaterial.mainPass.iconEnabled = true
            this.meshStatePinchedMaterial.mainPass.iconEnabled = true

            this.meshStateIdleMaterial.mainPass.icon = this.onIcon
            this.meshStateHoverMaterial.mainPass.icon = this.onIcon
            this.meshStatePinchedMaterial.mainPass.icon = this.onIcon
          }
        }
      }

      // If the toggle button has somehow not been initialized yet, default to the idle material.
      if (this.toggleButton === null) {
        this.changeButtonState(this.meshIdleMaterial)
      } else if (this.buttonType === TOGGLE_BUTTON) {
        this.changeButtonState(this.toggleButton.isToggledOn ? this.meshToggledIdleMaterial : this.meshIdleMaterial)
      } else if (this.buttonType === STATE_BUTTON) {
        this.changeButtonState(this.toggleButton.isToggledOn ? this.meshStateIdleMaterial : this.meshIdleMaterial)
      } else {
        this.changeButtonState(this.meshIdleMaterial)
      }
    })
  }

  private setupInteractableCallbacks = (): void => {
    validate(this.interactable)
    this.interactable.onHoverUpdate.add(this.updateHoverState)
    this.interactable.onSyncHoverUpdate.add(this.updateHoverState)

    switch (this.buttonType) {
      case PINCH_BUTTON:
        validate(this.interactable)
        this.interactable.onHoverEnter.add(this.initializeHoverState_PinchButton)
        this.interactable.onHoverExit.add(this.resetHoverState_PinchButton)
        this.interactable.onTriggerCanceled.add(this.resetHoverState_PinchButton)
        this.interactable.onTriggerStart.add(this.initializeTriggeredState_PinchButton)
        this.interactable.onTriggerEnd.add(this.resetTriggeredState_PinchButton)
        this.interactable.onTriggerEndOutside.add(this.resetHoverState_PinchButton)

        this.interactable.onSyncHoverEnter.add(this.initializeHoverState_PinchButton)
        this.interactable.onSyncHoverExit.add(this.resetHoverState_PinchButton)
        this.interactable.onSyncTriggerCanceled.add(this.resetHoverState_PinchButton)
        this.interactable.onSyncTriggerStart.add(this.initializeTriggeredState_PinchButton)
        this.interactable.onSyncTriggerEnd.add(this.resetTriggeredState_PinchButton)
        this.interactable.onSyncTriggerEndOutside.add(this.resetHoverState_PinchButton)
        break
      case TOGGLE_BUTTON:
        validate(this.interactable)
        validate(this.toggleButton)
        this.interactable.onHoverEnter.add(this.initializeHoverState_ToggleButton)
        this.interactable.onHoverExit.add(this.resetHoverState_ToggleButton)
        this.interactable.onTriggerCanceled.add(this.resetHoverState_ToggleButton)
        this.interactable.onTriggerStart.add(this.initializeTriggeredState_ToggleButton)
        this.interactable.onTriggerEnd.add(this.resetTriggeredState_ToggleButton)
        this.interactable.onTriggerEndOutside.add(this.resetHoverState_ToggleButton)

        this.interactable.onSyncHoverEnter.add(this.initializeHoverState_ToggleButton)
        this.interactable.onSyncHoverExit.add(this.resetHoverState_ToggleButton)
        this.interactable.onSyncTriggerCanceled.add(this.resetHoverState_ToggleButton)
        this.interactable.onSyncTriggerStart.add(this.initializeTriggeredState_ToggleButton)
        this.interactable.onSyncTriggerEnd.add(this.resetTriggeredState_ToggleButton)
        this.interactable.onSyncTriggerEndOutside.add(this.resetHoverState_ToggleButton)

        validate(this.toggleButton)
        this.toggleButton.createEvent("OnEnableEvent").bind(this.onToggleButtonEnabled)
        break
      case STATE_BUTTON:
        validate(this.interactable)
        this.interactable.onHoverEnter.add(this.initializeHoverState_StateButton)
        this.interactable.onHoverExit.add(this.resetHoverState_StateButton)
        this.interactable.onTriggerCanceled.add(this.resetHoverState_StateButton)
        this.interactable.onTriggerStart.add(this.initializeTriggeredState_StateButton)
        this.interactable.onTriggerEnd.add(this.resetTriggeredState_StateButton)
        this.interactable.onTriggerEndOutside.add(this.resetHoverState_StateButton)

        this.interactable.onSyncHoverEnter.add(this.initializeHoverState_StateButton)
        this.interactable.onSyncHoverExit.add(this.resetHoverState_StateButton)
        this.interactable.onSyncTriggerCanceled.add(this.resetHoverState_StateButton)
        this.interactable.onSyncTriggerStart.add(this.initializeTriggeredState_StateButton)
        this.interactable.onSyncTriggerEnd.add(this.resetTriggeredState_StateButton)
        this.interactable.onSyncTriggerEndOutside.add(this.resetHoverState_StateButton)

        validate(this.toggleButton)
        this.toggleButton.createEvent("OnEnableEvent").bind(this.onToggleButtonEnabled)
        break
    }
  }

  private initializeHoverState_PinchButton = (event: InteractorEvent): void => {
    this.initialMaxInteractionStrength = this.getMaxInteractionStrength()

    if (event.interactor.isTriggering) {
      this.changeButtonState(this.meshPinchedMaterial)
      this.changeGlowState(this.glowPinchedMaterial)
    } else {
      this.changeButtonState(this.meshHoverMaterial)
      this.changeGlowState(this.glowHoverMaterial)
    }
  }

  private resetHoverState_PinchButton = (event: InteractorEvent): void => {
    if (this.interactable?.keepHoverOnTrigger && event.interactor.isTriggering) {
      return
    }

    this.initialMaxInteractionStrength = 0.0
    this.renderMeshVisual.setBlendShapeWeight(this.meshBlendShapeName, 0.0)
    if (this.useGlowMesh) {
      if (this.glowRenderMeshVisual !== undefined) {
        this.glowRenderMeshVisual.setBlendShapeWeight(this.glowBlendShapeName, 0.0)
      }
    }
    this.changeButtonState(this.meshIdleMaterial)
    this.changeGlowState(this.glowIdleMaterial)
  }

  private updateHoverState = (): void => {
    const maxInteractionStrength = this.getMaxInteractionStrength()
    if (!this.squishEnabled) return
    const interactionScale =
      this.initialMaxInteractionStrength + (maxInteractionStrength * (1.0 - this.initialMaxInteractionStrength)) / 1.0
    this.renderMeshVisual.setBlendShapeWeight(this.meshBlendShapeName, interactionScale * this.maxBlendShapeWeight)
    if (this.useGlowMesh) {
      if (this.glowRenderMeshVisual !== undefined) {
        this.glowRenderMeshVisual.setBlendShapeWeight(
          this.glowBlendShapeName,
          interactionScale * this.maxBlendShapeWeight
        )
      }
    }
  }

  private initializeTriggeredState_PinchButton = (): void => {
    this.changeButtonState(this.meshPinchedMaterial)
    this.changeGlowState(this.glowPinchedMaterial)
  }

  private resetTriggeredState_PinchButton = (): void => {
    this.changeButtonState(this.meshHoverMaterial)
    this.changeGlowState(this.glowHoverMaterial)
  }

  private onToggleButtonEnabled = (): void => {
    validate(this.toggleButton)

    let material = this.meshIdleMaterial

    if (this.toggleButton.isToggledOn) {
      if (this.buttonType === TOGGLE_BUTTON) {
        validate(this.meshToggledIdleMaterial)
        material = this.meshToggledIdleMaterial
      } else {
        validate(this.meshStateIdleMaterial)
        material = this.meshStateIdleMaterial
      }
    }

    this.changeButtonState(material)
  }

  private initializeHoverState_ToggleButton = (event: InteractorEvent): void => {
    this.initialMaxInteractionStrength = this.getMaxInteractionStrength()
    validate(this.toggleButton)
    validate(this.meshToggledHoverMaterial)

    if (event.interactor.isTriggering) {
      this.changeButtonState(this.toggleButton.isToggledOn ? this.meshToggledPinchedMaterial : this.meshPinchedMaterial)
    } else {
      this.changeButtonState(this.toggleButton.isToggledOn ? this.meshToggledHoverMaterial : this.meshHoverMaterial)
    }
  }

  private resetHoverState_ToggleButton = (event: InteractorEvent): void => {
    if (this.interactable?.keepHoverOnTrigger && event.interactor.isTriggering) {
      return
    }

    this.initialMaxInteractionStrength = 0.0
    this.renderMeshVisual.setBlendShapeWeight(this.meshBlendShapeName, 0.0)
    validate(this.toggleButton)
    validate(this.meshToggledIdleMaterial)
    this.changeButtonState(this.toggleButton.isToggledOn ? this.meshToggledIdleMaterial : this.meshIdleMaterial)
  }

  private initializeTriggeredState_ToggleButton = (): void => {
    validate(this.toggleButton)
    validate(this.meshToggledPinchedMaterial)
    this.changeButtonState(this.toggleButton.isToggledOn ? this.meshToggledPinchedMaterial : this.meshPinchedMaterial)
  }

  private resetTriggeredState_ToggleButton = (): void => {
    validate(this.toggleButton)
    validate(this.meshToggledHoverMaterial)
    this.changeButtonState(this.toggleButton.isToggledOn ? this.meshToggledHoverMaterial : this.meshHoverMaterial)
  }

  private initializeHoverState_StateButton = (event: InteractorEvent): void => {
    this.initialMaxInteractionStrength = this.getMaxInteractionStrength()
    validate(this.toggleButton)
    validate(this.meshStateHoverMaterial)

    if (event.interactor.isTriggering) {
      this.changeButtonState(
        this.toggleButton.isToggledOn ? this.meshStatePinchedMaterial : this.meshStatePinchedMaterial
      )
    } else {
      this.changeButtonState(this.toggleButton.isToggledOn ? this.meshStateHoverMaterial : this.meshHoverMaterial)
    }
  }

  private resetHoverState_StateButton = (event: InteractorEvent): void => {
    if (this.interactable?.keepHoverOnTrigger && event.interactor.isTriggering) {
      return
    }

    this.initialMaxInteractionStrength = 0.0
    this.renderMeshVisual.setBlendShapeWeight(this.meshBlendShapeName, 0.0)
    validate(this.toggleButton)
    validate(this.meshStatePinchedMaterial)
    this.changeButtonState(this.toggleButton.isToggledOn ? this.meshStatePinchedMaterial : this.meshIdleMaterial)
  }

  private initializeTriggeredState_StateButton = (): void => {
    validate(this.toggleButton)
    validate(this.meshStatePinchedMaterial)
    this.changeButtonState(
      this.toggleButton.isToggledOn ? this.meshStatePinchedMaterial : this.meshStatePinchedMaterial
    )
  }

  private resetTriggeredState_StateButton = (): void => {
    validate(this.toggleButton)
    validate(this.meshStatePinchedMaterial)
    validate(this.meshStateHoverMaterial)
    if (this.persistentPinchedState) {
      this.changeButtonState(this.toggleButton.isToggledOn ? this.meshHoverMaterial : this.meshStatePinchedMaterial)
    } else {
      this.changeButtonState(this.toggleButton.isToggledOn ? this.meshHoverMaterial : this.meshStateHoverMaterial)
    }
  }

  private getMaxInteractionStrength = (): number => {
    validate(this.interactable)
    const interactors = SIK.InteractionManager.getInteractorsByType(this.interactable.hoveringInteractor)

    if (interactors.length === 0) {
      return 0
    }

    /**
     * At this point we know getInteractorsByType has returned some list of Interactors, each of which are hovering this Interactable
     * This means that there are multiple Interactors which could be at various stages of interactionStrength.
     * The behavior we want is to set the squish value of the Interactable based on the Max interactionStrength of all the Interactors currently
     * hovering this Interactable. Use array reduce to find Max:
     */
    return interactors.reduce((maxInteractionStrength, interactor) => {
      validate(interactor)
      return Math.max(maxInteractionStrength, interactor.interactionStrength ?? 0)
    }, -Infinity)
  }

  private changeButtonState = (material: Material | undefined): void => {
    if (material === undefined) return
    this.renderMeshVisual.mainMaterial = material
  }

  private changeGlowState = (material: Material | undefined): void => {
    if (!this.useGlowMesh) return
    if (material === undefined) return
    validate(this.glowRenderMeshVisual)
    this.glowRenderMeshVisual.mainMaterial = material
  }
}
