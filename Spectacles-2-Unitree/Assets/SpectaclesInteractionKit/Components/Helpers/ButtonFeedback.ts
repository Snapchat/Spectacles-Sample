import {Interactable} from "../Interaction/Interactable/Interactable"
import {SIK} from "../../SIK"
import {ToggleButton} from "../UI/ToggleButton/ToggleButton"
import {validate} from "../../Utils/validate"

const PINCH_BUTTON: number = 0
const TOGGLE_BUTTON: number = 1
const STATE_BUTTON: number = 2

/**
 * This class provides visual feedback for different types of buttons, such as Pinch Button, Toggle Button, and State Button. It allows customization of the button's appearance and behavior based on its state.
 */
@component
export class ButtonFeedback extends BaseScriptComponent {
  @input("int")
  @widget(
    new ComboBoxWidget([
      new ComboBoxItem("Pinch Button", 0),
      new ComboBoxItem("Toggle Button", 1),
      new ComboBoxItem("State Button", 2),
    ]),
  )
  buttonType: number = 0
  @ui.separator
  @input
  renderMeshVisual!: RenderMeshVisual
  @input
  @showIf("buttonType", 0)
  useGlowMesh: boolean = false
  @input
  @allowUndefined
  @showIf("useGlowMesh", true)
  glowRenderMeshVisual?: RenderMeshVisual
  @input
  maxBlendShapeWeight: number = 1.0
  @ui.separator
  @input
  meshBlendShapeName: string = "Pinch"
  @input
  meshIdleMaterial!: Material
  @input
  meshHoverMaterial!: Material
  @input
  meshPinchedMaterial!: Material
  @ui.separator
  @input
  @allowUndefined
  @showIf("useGlowMesh", true)
  glowBlendShapeName: string = "Pinch"
  @input("Asset.Material")
  @allowUndefined
  @showIf("useGlowMesh", true)
  glowIdleMaterial: Material | undefined
  @input("Asset.Material")
  @allowUndefined
  @showIf("useGlowMesh", true)
  glowHoverMaterial: Material | undefined
  @input("Asset.Material")
  @allowUndefined
  @showIf("useGlowMesh", true)
  glowPinchedMaterial: Material | undefined
  @input("Asset.Material")
  @showIf("buttonType", 1)
  @allowUndefined
  meshToggledPinchedMaterial: Material | undefined
  @input("Asset.Material")
  @showIf("buttonType", 1)
  @allowUndefined
  meshToggledHoverMaterial: Material | undefined
  @input("Asset.Material")
  @showIf("buttonType", 1)
  @allowUndefined
  meshToggledIdleMaterial: Material | undefined
  @input("Asset.Material")
  @showIf("buttonType", 2)
  @allowUndefined
  meshStatePinchedMaterial: Material | undefined
  @input("Asset.Material")
  @showIf("buttonType", 2)
  @allowUndefined
  meshStateHoverMaterial: Material | undefined
  @input("Asset.Material")
  @showIf("buttonType", 2)
  @allowUndefined
  meshStateIdleMaterial: Material | undefined
  @input
  @showIf("buttonType", 2)
  persistentPinchedState: boolean = false
  @ui.separator
  @input("Asset.Texture")
  @allowUndefined
  defaultIcon: Texture | undefined
  @input("Asset.Texture")
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

    this.renderMeshVisual.mainMaterial = this.renderMeshVisual
      .getMaterial(0)
      .clone()

    if (this.useGlowMesh) {
      if (this.glowRenderMeshVisual !== undefined) {
        this.glowRenderMeshVisual.mainMaterial = this.glowRenderMeshVisual
          .getMaterial(0)
          .clone()
      } else {
        this.useGlowMesh = false
        print("No Glow RenderMeshVisual component attached to this entity.")
      }
    }

    this.interactable = this.getSceneObject().getComponent(
      Interactable.getTypeName(),
    )
    if (isNull(this.interactable)) {
      throw new Error("Interactable component not found in this entity!")
    }

    if (this.buttonType === TOGGLE_BUTTON || this.buttonType === STATE_BUTTON) {
      this.toggleButton = this.getSceneObject().getComponent(
        ToggleButton.getTypeName(),
      )
      if (isNull(this.toggleButton)) {
        throw new Error("ToggleButton component not found in this entity!")
      }
    }

    this.setupInteractableCallbacks()

    this.createEvent("OnEnableEvent").bind(() => {
      this.squishEnabled = true
    })

    this.createEvent("OnDisableEvent").bind(() => {
      this.squishEnabled = false
    })

    this.createEvent("OnStartEvent").bind(() => {
      if (
        this.meshIdleMaterial === undefined ||
        this.meshHoverMaterial === undefined ||
        this.meshPinchedMaterial === undefined
      ) {
        throw new Error(
          "ButtonFeedback requires meshIdleMaterial, meshHoverMaterial, and meshPinchedMaterial to be set! SceneObject name: " +
            this.getSceneObject().name,
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
              this.getSceneObject().name,
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
              this.getSceneObject().name,
          )
        }
      }

      this.meshIdleMaterial = this.meshIdleMaterial.clone()
      this.meshHoverMaterial = this.meshHoverMaterial.clone()
      this.meshPinchedMaterial = this.meshPinchedMaterial.clone()

      this.changeButtonState(this.meshIdleMaterial)

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
            this.meshToggledHoverMaterial =
              this.meshToggledHoverMaterial.clone()
            this.meshToggledPinchedMaterial =
              this.meshToggledPinchedMaterial.clone()

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
            this.meshStatePinchedMaterial =
              this.meshStatePinchedMaterial.clone()

            this.meshStateIdleMaterial.mainPass.iconEnabled = true
            this.meshStateHoverMaterial.mainPass.iconEnabled = true
            this.meshStatePinchedMaterial.mainPass.iconEnabled = true

            this.meshStateIdleMaterial.mainPass.icon = this.onIcon
            this.meshStateHoverMaterial.mainPass.icon = this.onIcon
            this.meshStatePinchedMaterial.mainPass.icon = this.onIcon
          }
        }
      }

      if (this.onIcon !== undefined && this.defaultIcon !== undefined) {
        this.meshIdleMaterial.mainPass.iconEnabled = false
        this.meshHoverMaterial.mainPass.iconEnabled = false
        this.meshPinchedMaterial.mainPass.iconEnabled = false

        if (this.buttonType === TOGGLE_BUTTON) {
          if (
            this.meshToggledIdleMaterial !== undefined &&
            this.meshToggledHoverMaterial !== undefined &&
            this.meshToggledPinchedMaterial !== undefined
          ) {
            this.meshToggledIdleMaterial = this.meshToggledIdleMaterial.clone()
            this.meshToggledHoverMaterial =
              this.meshToggledHoverMaterial.clone()
            this.meshToggledPinchedMaterial =
              this.meshToggledPinchedMaterial.clone()

            this.meshToggledIdleMaterial.mainPass.iconEnabled = false
            this.meshToggledHoverMaterial.mainPass.iconEnabled = false
            this.meshToggledPinchedMaterial.mainPass.iconEnabled = false
          }
        } else if (this.buttonType === STATE_BUTTON) {
          if (
            this.meshStateIdleMaterial !== undefined &&
            this.meshStateHoverMaterial !== undefined &&
            this.meshStatePinchedMaterial !== undefined
          ) {
            this.meshStateIdleMaterial = this.meshStateIdleMaterial.clone()
            this.meshStateHoverMaterial = this.meshStateHoverMaterial.clone()
            this.meshStatePinchedMaterial =
              this.meshStatePinchedMaterial.clone()

            this.meshStateIdleMaterial.mainPass.iconEnabled = false
            this.meshStateHoverMaterial.mainPass.iconEnabled = false
            this.meshStatePinchedMaterial.mainPass.iconEnabled = false
          }
        }
      }
    })
  }

  private setupInteractableCallbacks = (): void => {
    validate(this.interactable)
    this.interactable.onHoverUpdate.add(this.updateHoverState)

    switch (this.buttonType) {
      case PINCH_BUTTON:
        validate(this.interactable)
        this.interactable.onHoverEnter.add(
          this.initializeHoverState_PinchButton,
        )
        this.interactable.onHoverExit.add(this.resetHoverState_PinchButton)
        this.interactable.onTriggerCanceled.add(
          this.resetHoverState_PinchButton,
        )
        this.interactable.onTriggerStart.add(
          this.initializeTriggeredState_PinchButton,
        )
        this.interactable.onTriggerEnd.add(this.resetTriggeredState_PinchButton)
        break
      case TOGGLE_BUTTON:
        validate(this.interactable)
        this.interactable.onHoverEnter.add(
          this.initializeHoverState_ToggleButton,
        )
        this.interactable.onHoverExit.add(this.resetHoverState_ToggleButton)
        this.interactable.onTriggerCanceled.add(
          this.resetHoverState_ToggleButton,
        )
        this.interactable.onTriggerStart.add(
          this.initializeTriggeredState_ToggleButton,
        )
        this.interactable.onTriggerEnd.add(
          this.resetTriggeredState_ToggleButton,
        )

        validate(this.toggleButton)
        this.toggleButton
          .createEvent("OnEnableEvent")
          .bind(this.onToggleButtonEnabled)
        break
      case STATE_BUTTON:
        validate(this.interactable)
        this.interactable.onHoverEnter.add(
          this.initializeHoverState_StateButton,
        )
        this.interactable.onHoverExit.add(this.resetHoverState_StateButton)
        this.interactable.onTriggerCanceled.add(
          this.resetHoverState_StateButton,
        )
        this.interactable.onTriggerStart.add(
          this.initializeTriggeredState_StateButton,
        )
        this.interactable.onTriggerEnd.add(this.resetTriggeredState_StateButton)
        validate(this.toggleButton)
        this.toggleButton
          .createEvent("OnEnableEvent")
          .bind(this.onToggleButtonEnabled)
        break
    }
  }

  private initializeHoverState_PinchButton = (): void => {
    this.initialMaxInteractionStrength = this.getMaxInteractionStrength()
    this.changeButtonState(this.meshHoverMaterial)
    this.changeGlowState(this.glowHoverMaterial)
  }

  private resetHoverState_PinchButton = (): void => {
    this.initialMaxInteractionStrength = 0.0
    this.renderMeshVisual.setBlendShapeWeight(this.meshBlendShapeName, 0.0)
    if (this.useGlowMesh) {
      if (this.glowRenderMeshVisual !== undefined) {
        this.glowRenderMeshVisual.setBlendShapeWeight(
          this.glowBlendShapeName,
          0.0,
        )
      }
    }
    this.changeButtonState(this.meshIdleMaterial)
    this.changeGlowState(this.glowIdleMaterial)
  }

  private updateHoverState = (): void => {
    const maxInteractionStrength = this.getMaxInteractionStrength()
    if (!this.squishEnabled) return
    const interactionScale =
      this.initialMaxInteractionStrength +
      (maxInteractionStrength * (1.0 - this.initialMaxInteractionStrength)) /
        1.0
    this.renderMeshVisual.setBlendShapeWeight(
      this.meshBlendShapeName,
      interactionScale * this.maxBlendShapeWeight,
    )
    if (this.useGlowMesh) {
      if (this.glowRenderMeshVisual !== undefined) {
        this.glowRenderMeshVisual.setBlendShapeWeight(
          this.glowBlendShapeName,
          interactionScale * this.maxBlendShapeWeight,
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
    validate(this.meshToggledIdleMaterial)
    validate(this.meshStateIdleMaterial)
    this.changeButtonState(
      this.toggleButton.isToggledOn
        ? this.buttonType === TOGGLE_BUTTON
          ? this.meshToggledIdleMaterial
          : this.meshStateIdleMaterial
        : this.meshIdleMaterial,
    )
  }

  private initializeHoverState_ToggleButton = (): void => {
    this.initialMaxInteractionStrength = this.getMaxInteractionStrength()
    validate(this.toggleButton)
    validate(this.meshToggledHoverMaterial)
    this.changeButtonState(
      this.toggleButton.isToggledOn
        ? this.meshToggledHoverMaterial
        : this.meshHoverMaterial,
    )
  }

  private resetHoverState_ToggleButton = (): void => {
    this.initialMaxInteractionStrength = 0.0
    this.renderMeshVisual.setBlendShapeWeight(this.meshBlendShapeName, 0.0)
    validate(this.toggleButton)
    validate(this.meshToggledIdleMaterial)
    this.changeButtonState(
      this.toggleButton.isToggledOn
        ? this.meshToggledIdleMaterial
        : this.meshIdleMaterial,
    )
  }

  private initializeTriggeredState_ToggleButton = (): void => {
    validate(this.toggleButton)
    validate(this.meshToggledPinchedMaterial)
    this.changeButtonState(
      this.toggleButton.isToggledOn
        ? this.meshToggledPinchedMaterial
        : this.meshPinchedMaterial,
    )
  }

  private resetTriggeredState_ToggleButton = (): void => {
    validate(this.toggleButton)
    validate(this.meshToggledHoverMaterial)
    this.changeButtonState(
      this.toggleButton.isToggledOn
        ? this.meshHoverMaterial
        : this.meshToggledHoverMaterial,
    )
  }

  private initializeHoverState_StateButton = (): void => {
    this.initialMaxInteractionStrength = this.getMaxInteractionStrength()
    validate(this.toggleButton)
    validate(this.meshStateHoverMaterial)
    this.changeButtonState(
      this.toggleButton.isToggledOn
        ? this.meshStateHoverMaterial
        : this.meshHoverMaterial,
    )
  }

  private resetHoverState_StateButton = (): void => {
    this.initialMaxInteractionStrength = 0.0
    this.renderMeshVisual.setBlendShapeWeight(this.meshBlendShapeName, 0.0)
    validate(this.toggleButton)
    validate(this.meshStatePinchedMaterial)
    this.changeButtonState(
      this.toggleButton.isToggledOn
        ? this.meshStatePinchedMaterial
        : this.meshIdleMaterial,
    )
  }

  private initializeTriggeredState_StateButton = (): void => {
    validate(this.toggleButton)
    validate(this.meshStatePinchedMaterial)
    this.changeButtonState(
      this.toggleButton.isToggledOn
        ? this.meshStatePinchedMaterial
        : this.meshStatePinchedMaterial,
    )
  }

  private resetTriggeredState_StateButton = (): void => {
    validate(this.toggleButton)
    validate(this.meshStatePinchedMaterial)
    validate(this.meshStateHoverMaterial)
    if (this.persistentPinchedState) {
      this.changeButtonState(
        this.toggleButton.isToggledOn
          ? this.meshHoverMaterial
          : this.meshStatePinchedMaterial,
      )
    } else {
      this.changeButtonState(
        this.toggleButton.isToggledOn
          ? this.meshHoverMaterial
          : this.meshStateHoverMaterial,
      )
    }
  }

  private getMaxInteractionStrength = (): number => {
    validate(this.interactable)
    const interactors = SIK.InteractionManager.getInteractorsByType(
      this.interactable.hoveringInteractor,
    )

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
      return Math.max(
        maxInteractionStrength,
        interactor.interactionStrength ?? 0,
      )
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
