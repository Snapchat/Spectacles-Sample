import {ProximitySensor} from "../../../Components/Helpers/ProximitySensor"
import {HandInteractor} from "../../../Core/HandInteractor/HandInteractor"
import {InteractionManager} from "../../../Core/InteractionManager/InteractionManager"
import {TargetingMode} from "../../../Core/Interactor/Interactor"
import {HandInputData} from "../../../Providers/HandInputData/HandInputData"
import {HandType} from "../../../Providers/HandInputData/HandType"
import TrackedHand from "../../../Providers/HandInputData/TrackedHand"
import {ColliderUtils} from "../../../Utils/ColliderUtils"
import StateMachine from "../../../Utils/StateMachine"
import {Interactable} from "../Interactable/Interactable"
import {
  HandMeshType,
  HandVisual,
  HandVisualOverride,
  HandVisualOverrideItem,
  HandVisualOverrideType,
  HandVisualSelection
} from "./HandVisual"

export type GlowEffectViewModelStyle = {
  hoverColor: vec4
  triggerColor: vec4
  pinchBrightnessMax: number
  pinchGlowBrightnessMax: number
  pinchBrightnessMaxStrength: number
  pinchTriggeredMult: number
  pinchExponent: number
  pinchExponentTriggered: number
  pinchHighlightThresholdFar: number
  pinchHighlightThresholdNear: number
  pokeBrightnessMax: number
  pokeGlowBrightnessMax: number
  pokeTriggeredMult: number
  pokeDepthMaskStart: number
  pokeDepthMaskRange: number
  pokeHighlightThresholdFar: number
  pokeHighlightThresholdNear: number
  pokeOccludeThresholdFar: number
  pokeOccludeThresholdNear: number
  pokeHighlightGradientMaskMin: number
  pokeHighlightGradientMaskMax: number
  pokeOccludeGradientMaskMin: number
  pokeOccludeGradientMaskMax: number
  pokeGradientMaskLerpSpeed: number
  pokeGradientMaskCutoff: number
  pokeExponent: number
  pokeExponentTriggered: number
  triggeredLerpDurationSeconds: number
  pinchValidLerpDurationSeconds: number
  pokeValidLerpDurationSeconds: number
}

export type GlowEffectViewModelConfig = {
  handInteractor: HandInteractor
  handType: HandType
  initialHandVisualSelection: HandVisualSelection
  style: GlowEffectViewModelStyle
  debugModeEnabled: boolean
  proximitySensor: ProximitySensor | null
  indexTipSceneObject: SceneObject | undefined
  overrideMap: Map<SceneObject, HandVisualOverride>
  handVisuals: HandVisual
}

export type PinchProperties = {
  brightness: number
  color: vec4
  glowBrightness: number
  glowColor: vec4
  exponent: number
}

export type PokeProperties = {
  brightness: number
  color: vec4
  glowBrightness: number
  glowColor: vec4
  depthFactor: number
  highlightGradientMaskPosition: number
  occludeGradientMaskPosition: number
  exponent: number
}

export type DebugLine = {
  start: vec3
  end: vec3
  color: vec4
}

/**
 * GlowEffectViewModel manages the state and logic for the hand glow effect.
 */
export class GlowEffectViewModel {
  // Public properties for the View to observe
  public pinchProps: PinchProperties
  public pokeProps: PokeProperties
  public pokePinchBlend: number = 0
  public isMeshVisibilityDesired: boolean = true
  public isIndexGlowVisible: boolean = true
  public isThumbGlowVisible: boolean = true
  public debugLines: DebugLine[] = []

  // Dependencies and configuration
  private handInteractor: HandInteractor
  private hand: TrackedHand
  private style: GlowEffectViewModelStyle
  private proximitySensor: ProximitySensor | null
  private indexTipSceneObject: SceneObject | undefined
  private debugModeEnabled: boolean
  private overrideMap: Map<SceneObject, HandVisualOverride>
  private handVisuals: HandVisual

  // Internal state
  private handInputData = HandInputData.getInstance()
  private interactionManager = InteractionManager.getInstance()
  private stateMachine: StateMachine

  private pokeLerpTime: number = 0
  private pinchLerpTime: number = 0
  private globalLerpTime: number = 0
  private pokeValidLerpTime: number = 0
  private pinchValidLerpTime: number = 0
  private lastPinchValidState: boolean = false
  private lastProximityValue: number = 0
  private finalColor = new vec4(0, 0, 0, 0)

  private closestPokeInteractableDistance: number = Infinity
  private closestPinchInteractableDistance: number = Infinity
  private currentHighlightGradientMaskPosition: number
  private currentOccludeGradientMaskPosition: number
  public isPalmTapping: boolean = false

  private fingerHighlightLeftMaterial: Material = requireAsset(
    "../../../Assets/Materials/BaseHandVisualsMaterials/FingerHighlightLeft.mat"
  ) as Material
  private fingerHighlightRightMaterial: Material = requireAsset(
    "../../../Assets/Materials/BaseHandVisualsMaterials/FingerHighlightRight.mat"
  ) as Material

  constructor(private config: GlowEffectViewModelConfig) {
    this.handInteractor = config.handInteractor
    this.hand = this.handInputData.getHand(config.handType)
    this.style = config.style
    this.debugModeEnabled = config.debugModeEnabled
    this.proximitySensor = config.proximitySensor
    this.indexTipSceneObject = config.indexTipSceneObject
    this.overrideMap = config.overrideMap
    this.handVisuals = config.handVisuals

    this.currentHighlightGradientMaskPosition = this.style.pokeHighlightGradientMaskMin
    this.currentOccludeGradientMaskPosition = this.style.pokeOccludeGradientMaskMin

    // Initialize properties
    this.pinchProps = {
      brightness: 0,
      color: this.style.hoverColor,
      glowBrightness: 0,
      glowColor: this.style.hoverColor,
      exponent: this.style.pinchExponent
    }
    this.pokeProps = {
      brightness: 0,
      color: this.style.hoverColor,
      glowBrightness: 0,
      glowColor: this.style.hoverColor,
      depthFactor: 0,
      highlightGradientMaskPosition: this.currentHighlightGradientMaskPosition,
      occludeGradientMaskPosition: this.currentOccludeGradientMaskPosition,
      exponent: this.style.pokeExponent
    }

    // Set up the state machine
    this.stateMachine = new StateMachine("GlowEffectViewModel")
    this.setupStates()
    this.setVisualSelection(config.initialHandVisualSelection)
  }

  /**
   * Cleans up the view model.
   */
  public destroy(): void {
    this.stateMachine.destroy()
  }

  /**
   * Correctly maps the HandVisualSelection enum to the state machine's state names.
   */
  public setVisualSelection(selection: HandVisualSelection): void {
    let stateName: string
    switch (selection) {
      case HandVisualSelection.AlwaysOn:
        stateName = "AlwaysOn"
        break
      case HandVisualSelection.Occluder:
        stateName = "Occluder"
        break
      case HandVisualSelection.None:
        stateName = "None"
        break
      default:
        stateName = "Interactive"
        break
    }
    this.stateMachine.enterState(stateName)
  }

  private findOverrideItem(interactable: Interactable, overrideType: number): HandVisualOverrideItem | null {
    if (!interactable.sceneObject) {
      return null
    }
    const override = this.overrideMap.get(interactable.sceneObject)
    if (override) {
      for (const item of override.overrides) {
        if (item.overrideType === overrideType) {
          return item
        }
      }
    }
    return null
  }

  private hasOverride(interactable: Interactable, overrideType: number): boolean {
    return this.findOverrideItem(interactable, overrideType) !== null
  }

  private getOverrideValue(interactable: Interactable, overrideType: number): number | null {
    const overrideItem = this.findOverrideItem(interactable, overrideType)
    if (!overrideItem) {
      return null
    }

    switch (overrideType) {
      case HandVisualOverrideType.PinchDistanceOverride:
        return overrideItem.pinchDistance ? overrideItem.pinchDistance : null
      case HandVisualOverrideType.PokeDistanceOverride:
        return overrideItem.pokeDistance ? overrideItem.pokeDistance : null
      default:
        return null
    }
  }

  private setupStates(): void {
    this.stateMachine.addState({
      name: "AlwaysOn",
      onEnter: () => this.resetToBaseState(true),
      onUpdate: () => this.updateInteractionEffects(true)
    })

    this.stateMachine.addState({
      name: "Interactive",
      onEnter: () => this.resetToBaseState(false),
      onUpdate: () => this.updateInteractionEffects(false)
    })

    this.stateMachine.addState({
      name: "Occluder",
      onEnter: () => {
        this.isMeshVisibilityDesired = true
        this.isIndexGlowVisible = false
        this.isThumbGlowVisible = false
      }
    })

    this.stateMachine.addState({
      name: "None",
      onEnter: () => {
        this.isMeshVisibilityDesired = false
        this.isIndexGlowVisible = false
        this.isThumbGlowVisible = false
      }
    })
  }

  private updateInteractionEffects(isAlwaysOn: boolean): void {
    const deltaTime = getDeltaTime()

    // Get current frame's interaction state
    this.updateClosestInteractableDistances()

    const isPinching = this.hand.isPinching()
    const isPoking = this.handInteractor.isPoking()
    const pokeDistance = isPoking ? 0 : this.closestPokeInteractableDistance
    const pinchDistance = this.closestPinchInteractableDistance
    const isTriggered = isPoking || isPinching || this.isPalmTapping

    // Update global trigger state
    this.globalLerpTime = this.updateLerpTime(
      this.globalLerpTime,
      isTriggered,
      deltaTime,
      this.style.triggeredLerpDurationSeconds
    )
    const globalTriggerFactor = this.globalLerpTime / this.style.triggeredLerpDurationSeconds

    this.lerpColor(this.style.hoverColor, this.style.triggerColor, globalTriggerFactor, this.finalColor)

    // Update pinch validity and proximity
    const hasIndirectTarget =
      this.handInteractor.activeTargetingMode === TargetingMode.Indirect && this.handInteractor.targetHitInfo !== null
    const isPinchValid = pinchDistance !== Infinity || hasIndirectTarget || isAlwaysOn

    let currentProximity = 0
    if (pinchDistance !== Infinity) {
      currentProximity = MathUtils.clamp(1.0 - pinchDistance / this.style.pinchHighlightThresholdFar, 0.0, 1.0)
      this.lastProximityValue = currentProximity
    } else if (hasIndirectTarget) {
      this.lastProximityValue = 1.0
    }

    if (this.lastPinchValidState && !isPinchValid) {
      this.pinchValidLerpTime = this.lastProximityValue * this.style.pinchValidLerpDurationSeconds
    } else if (!this.lastPinchValidState && isPinchValid) {
      // When gaining a target, start from zero
      this.pinchValidLerpTime = 0
    }

    this.pinchValidLerpTime = this.updateLerpTime(
      this.pinchValidLerpTime,
      isPinchValid,
      deltaTime,
      this.style.pinchValidLerpDurationSeconds
    )

    this.lastPinchValidState = isPinchValid
    const pinchValidFactor = this.pinchValidLerpTime / this.style.pinchValidLerpDurationSeconds

    // Calculate and apply final effect properties
    this.pinchProps = this.calculatePinchEffects(
      isPinching,
      pinchDistance,
      deltaTime,
      isAlwaysOn,
      pinchValidFactor,
      this.finalColor,
      hasIndirectTarget
    )
    this.pokeProps = this.calculatePokeEffects(isPoking, pokeDistance, deltaTime, isAlwaysOn, this.finalColor)

    this.pokePinchBlend = this.hand.getPinchStrength() ?? 0.0

    this.updateVisibilityState(this.pinchProps, this.pokeProps, this.pokePinchBlend, isAlwaysOn)
  }

  private calculatePinchEffects(
    isPinching: boolean,
    distance: number,
    deltaTime: number,
    isAlwaysOn: boolean,
    pinchValidFactor: number,
    finalColor: vec4,
    hasIndirectTarget: boolean
  ): PinchProperties {
    // Update pinch trigger state
    this.pinchLerpTime = this.updateLerpTime(
      this.pinchLerpTime,
      isPinching,
      deltaTime,
      this.style.triggeredLerpDurationSeconds
    )
    const pinchTriggerFactor = this.pinchLerpTime / this.style.triggeredLerpDurationSeconds

    // Calculate proximity and strength
    const pinchStrength = this.hand.getPinchStrength() ?? 0
    const brightnessRampStrength = MathUtils.clamp(pinchStrength / this.style.pinchBrightnessMaxStrength, 0.0, 1.0)

    const isPinchValid = distance !== Infinity || hasIndirectTarget || isAlwaysOn

    // Calculate the proximity based on the direct distance (which includes the override scaling)
    const normalizedProximity = MathUtils.clamp(1.0 - distance / this.style.pinchHighlightThresholdFar, 0.0, 1.0)

    // An active indirect target has a conceptual proximity of 1.0
    const indirectProximity = hasIndirectTarget ? 1.0 : 0.0

    // The final target proximity is the MAXIMUM of the available interaction signals.
    // This ensures the override works, and an indirect target can still keep the brightness high.
    const targetProximity = Math.max(normalizedProximity, indirectProximity)

    // Apply the master lerp factor for smooth fades
    const effectiveProximity = isPinchValid ? targetProximity * pinchValidFactor : pinchValidFactor

    // Calculate base brightness
    let baseBrightness: number
    let baseGlowBrightness: number

    if (isAlwaysOn) {
      baseBrightness = this.style.pinchBrightnessMax
      baseGlowBrightness = this.style.pinchGlowBrightnessMax
    } else {
      baseBrightness = effectiveProximity * brightnessRampStrength * this.style.pinchBrightnessMax
      baseGlowBrightness = effectiveProximity * brightnessRampStrength * this.style.pinchGlowBrightnessMax
    }

    // Calculate triggered brightness and exponent
    const triggeredBrightness = baseBrightness * this.style.pinchTriggeredMult
    const triggeredGlowBrightness = baseGlowBrightness * this.style.pinchTriggeredMult
    const finalPinchExponent = MathUtils.lerp(
      this.style.pinchExponent,
      this.style.pinchExponentTriggered,
      pinchTriggerFactor
    )

    // Return final lerped properties
    return {
      brightness: MathUtils.lerp(baseBrightness, triggeredBrightness, pinchTriggerFactor),
      color: finalColor,
      glowBrightness: MathUtils.lerp(baseGlowBrightness, triggeredGlowBrightness, pinchTriggerFactor),
      glowColor: finalColor,
      exponent: finalPinchExponent
    }
  }

  private calculatePokeEffects(
    isPoking: boolean,
    distance: number,
    deltaTime: number,
    isAlwaysOn: boolean,
    finalColor: vec4
  ): PokeProperties {
    // Update poke trigger and validity states
    this.pokeLerpTime = this.updateLerpTime(
      this.pokeLerpTime,
      isPoking || this.isPalmTapping,
      deltaTime,
      this.style.triggeredLerpDurationSeconds
    )
    const pokeTriggerFactor = this.pokeLerpTime / this.style.triggeredLerpDurationSeconds

    const isPokeValid = this.handInteractor.pokeIsValid
    this.pokeValidLerpTime = this.updateLerpTime(
      this.pokeValidLerpTime,
      isPokeValid || this.isPalmTapping,
      deltaTime,
      this.style.pokeValidLerpDurationSeconds
    )
    const pokeValidFactor = this.pokeValidLerpTime / this.style.pokeValidLerpDurationSeconds
    const pokeBrightnessFactor = this.isPalmTapping ? 1.0 : pokeValidFactor

    // Update poke gradient mask positions
    this.currentHighlightGradientMaskPosition = MathUtils.lerp(
      this.currentHighlightGradientMaskPosition,
      this.calculateHighlightGradientMaskPosition(distance),
      this.style.pokeGradientMaskLerpSpeed * deltaTime
    )
    this.currentOccludeGradientMaskPosition = MathUtils.lerp(
      this.currentOccludeGradientMaskPosition,
      this.calculateOccludeGradientMaskPosition(distance),
      this.style.pokeGradientMaskLerpSpeed * deltaTime
    )

    // Handle no-target case
    if (distance === Infinity && !isAlwaysOn && !this.isPalmTapping) {
      return {
        brightness: 0,
        color: finalColor,
        glowBrightness: 0,
        glowColor: finalColor,
        highlightGradientMaskPosition: this.currentHighlightGradientMaskPosition,
        depthFactor: 0,
        occludeGradientMaskPosition: this.currentOccludeGradientMaskPosition,
        exponent: this.style.pokeExponent
      }
    }

    // Calculate proximity and depth
    const normalizedProximity = MathUtils.clamp(1.0 - distance / this.style.pokeHighlightThresholdFar, 0.0, 1.0)
    const normalizedPokeDepth = this.handInteractor.normalizedPokeDepth ?? 0
    const pokeDepthFactor = MathUtils.clamp(
      (normalizedPokeDepth - this.style.pokeDepthMaskStart) / this.style.pokeDepthMaskRange,
      0,
      1
    )

    // Calculate base poke brightness
    const basePokeBrightness =
      isAlwaysOn || this.isPalmTapping
        ? this.style.pokeBrightnessMax
        : normalizedProximity * this.style.pokeBrightnessMax
    const basePokeGlowBrightness =
      isAlwaysOn || this.isPalmTapping
        ? this.style.pokeGlowBrightnessMax
        : normalizedProximity * this.style.pokeGlowBrightnessMax

    // Calculate triggered poke brightness
    const triggeredPokeBrightness = this.style.pokeBrightnessMax * this.style.pokeTriggeredMult
    const triggeredPokeGlowBrightness = this.style.pokeGlowBrightnessMax * this.style.pokeTriggeredMult

    const finalPokeBrightness = MathUtils.lerp(basePokeBrightness, triggeredPokeBrightness, pokeTriggerFactor)
    const finalPokeGlowBrightness = MathUtils.lerp(
      basePokeGlowBrightness,
      triggeredPokeGlowBrightness,
      pokeTriggerFactor
    )
    const finalPokeExponent = MathUtils.lerp(
      this.style.pokeExponent,
      this.style.pokeExponentTriggered,
      pokeTriggerFactor
    )

    // Return final lerped and validated properties
    return {
      brightness: finalPokeBrightness * pokeBrightnessFactor,
      color: finalColor,
      glowBrightness: finalPokeGlowBrightness * pokeBrightnessFactor,
      glowColor: finalColor,
      highlightGradientMaskPosition: this.currentHighlightGradientMaskPosition,
      depthFactor: pokeDepthFactor,
      occludeGradientMaskPosition: this.currentOccludeGradientMaskPosition,
      exponent: finalPokeExponent
    }
  }

  private shouldAlwaysShowMesh(): boolean {
    const activeMeshMaterial =
      this.handVisuals.meshType === HandMeshType.Full
        ? this.handVisuals.handMeshFull.mainMaterial
        : this.handVisuals.handMeshIndexThumb.mainMaterial

    return !(
      activeMeshMaterial.isSame(this.fingerHighlightLeftMaterial) ||
      activeMeshMaterial.isSame(this.fingerHighlightRightMaterial)
    )
  }

  private updateVisibilityState(
    pinchProps: PinchProperties,
    pokeProps: PokeProperties,
    pokePinchBlend: number,
    isAlwaysOn: boolean
  ): void {
    const shouldAlwaysShow = this.shouldAlwaysShowMesh()

    if (isAlwaysOn || shouldAlwaysShow) {
      this.isMeshVisibilityDesired = true
      this.isIndexGlowVisible = true
      this.isThumbGlowVisible = true
    } else {
      const isProximityActive =
        pokeProps.highlightGradientMaskPosition >
        this.style.pokeHighlightGradientMaskMin + this.style.pokeGradientMaskCutoff

      if (pokePinchBlend < this.style.pokeGradientMaskCutoff) {
        this.isMeshVisibilityDesired = pokeProps.brightness > this.style.pokeGradientMaskCutoff || isProximityActive
        this.isIndexGlowVisible = pokeProps.glowBrightness > this.style.pokeGradientMaskCutoff
        this.isThumbGlowVisible = false
      } else {
        const isPinchGlowActive = pinchProps.glowBrightness > this.style.pokeGradientMaskCutoff
        this.isMeshVisibilityDesired =
          pinchProps.brightness > this.style.pokeGradientMaskCutoff || isProximityActive || this.isPalmTapping
        this.isIndexGlowVisible = isPinchGlowActive
        this.isThumbGlowVisible = isPinchGlowActive
      }
    }
  }

  private resetToBaseState(isAlwaysOn: boolean): void {
    const pinchStartBrightness = isAlwaysOn ? this.style.pinchBrightnessMax : 0
    const pinchStartGlowBrightness = isAlwaysOn ? this.style.pinchGlowBrightnessMax : 0
    const pokeStartBrightness = isAlwaysOn ? this.style.pokeBrightnessMax : 0
    const pokeStartGlowBrightness = isAlwaysOn ? this.style.pokeGlowBrightnessMax : 0

    this.pinchProps = {
      brightness: pinchStartBrightness,
      color: this.style.hoverColor,
      glowBrightness: pinchStartGlowBrightness,
      glowColor: this.style.hoverColor,
      exponent: this.style.pinchExponent
    }

    this.currentHighlightGradientMaskPosition = this.style.pokeHighlightGradientMaskMin
    this.currentOccludeGradientMaskPosition = this.style.pokeOccludeGradientMaskMin

    this.pokeProps = {
      brightness: pokeStartBrightness,
      color: this.style.hoverColor,
      glowBrightness: pokeStartGlowBrightness,
      glowColor: this.style.hoverColor,
      depthFactor: 0,
      highlightGradientMaskPosition: this.currentHighlightGradientMaskPosition,
      occludeGradientMaskPosition: this.currentOccludeGradientMaskPosition,
      exponent: this.style.pokeExponent
    }

    this.pokePinchBlend = this.hand.getPinchStrength() ?? 0.0

    const isPokeValid = this.handInteractor.pokeIsValid
    this.pokeValidLerpTime = isPokeValid ? this.style.pokeValidLerpDurationSeconds : 0

    const hasIndirectTarget = this.handInteractor.targetHitInfo !== null
    const isPinchValid = this.closestPinchInteractableDistance !== Infinity || hasIndirectTarget || isAlwaysOn
    this.lastPinchValidState = isPinchValid
    this.lastProximityValue = 0
    this.pinchValidLerpTime = isPinchValid ? this.style.pinchValidLerpDurationSeconds : 0
    this.isPalmTapping = false
  }

  private updateClosestInteractableDistances(): void {
    if (!this.indexTipSceneObject || !this.proximitySensor) {
      this.closestPokeInteractableDistance = Infinity
      this.closestPinchInteractableDistance = Infinity
      return
    }

    if (this.debugModeEnabled) {
      this.debugLines = []
    }

    const overlappingColliders = this.proximitySensor.getOverlappingColliders()
    if (overlappingColliders.length === 0) {
      this.closestPokeInteractableDistance = Infinity
      this.closestPinchInteractableDistance = Infinity
      return
    }

    const indexTipPosition = this.indexTipSceneObject.getTransform().getWorldPosition()
    let minPokeDistanceSq = Infinity
    let minPinchDistanceSq = Infinity
    let foundPokeInteractable = false
    let foundPinchInteractable = false

    let closestPokePoint: vec3 | null = null
    let closestPinchPoint: vec3 | null = null

    for (const collider of overlappingColliders) {
      const interactable = this.interactionManager.getInteractableByCollider(collider)

      if (interactable) {
        const closestPoint = ColliderUtils.getClosestPointOnColliderToPoint(collider, indexTipPosition)
        const baseDistanceSq = indexTipPosition.distanceSquared(closestPoint)

        // Check for poke interactions
        const canPoke =
          ((interactable.targetingMode & TargetingMode.Poke) !== 0 ||
            this.hasOverride(interactable, HandVisualOverrideType.ForcePokeVisual)) &&
          !this.hasOverride(interactable, HandVisualOverrideType.DisablePokeVisual)

        if (canPoke) {
          foundPokeInteractable = true
          let pokeDistanceSq = baseDistanceSq

          const pokeDistanceOverride = this.getOverrideValue(interactable, HandVisualOverrideType.PokeDistanceOverride)
          const epsilon = 1e-6
          if (pokeDistanceOverride !== null && pokeDistanceOverride > epsilon) {
            const distance = Math.sqrt(baseDistanceSq)
            const scaledDistance = (distance / pokeDistanceOverride) * this.style.pokeHighlightThresholdFar
            pokeDistanceSq = scaledDistance * scaledDistance
          }

          if (pokeDistanceSq < minPokeDistanceSq) {
            minPokeDistanceSq = pokeDistanceSq
            closestPokePoint = closestPoint
          }
        }

        // Check for pinch interactions
        const canPinch =
          ((interactable.targetingMode & TargetingMode.Direct) !== 0 ||
            this.hasOverride(interactable, HandVisualOverrideType.ForcePinchVisual)) &&
          !this.hasOverride(interactable, HandVisualOverrideType.DisablePinchVisual)

        if (canPinch) {
          foundPinchInteractable = true
          let pinchDistanceSq = baseDistanceSq

          const pinchDistanceOverride = this.getOverrideValue(
            interactable,
            HandVisualOverrideType.PinchDistanceOverride
          )

          if (pinchDistanceOverride !== null && pinchDistanceOverride > 1e-6) {
            const distance = Math.sqrt(baseDistanceSq)

            // If we are outside the override's range, treat the distance as infinite so the interaction becomes invalid.
            if (distance > pinchDistanceOverride) {
              pinchDistanceSq = Infinity
            } else {
              // Otherwise, scale the distance as before so the proximity glow is correct.
              const scaledDistance = (distance / pinchDistanceOverride) * this.style.pinchHighlightThresholdFar
              pinchDistanceSq = scaledDistance * scaledDistance
            }
          }

          if (pinchDistanceSq < minPinchDistanceSq) {
            minPinchDistanceSq = pinchDistanceSq
            closestPinchPoint = closestPoint
          }
        }

        // Handle non-interactive colliders
        if (!canPoke && !canPinch && this.debugModeEnabled) {
          const colliderCenter = collider.getTransform().getWorldPosition()
          this.debugLines.push({
            start: indexTipPosition,
            end: colliderCenter,
            color: new vec4(1, 0, 0, 1)
          })
        }
      }
    }

    if (this.debugModeEnabled) {
      if (closestPokePoint) {
        this.debugLines.push({
          start: indexTipPosition,
          end: closestPokePoint,
          color: new vec4(1, 0.5, 0, 1)
        })
      }
      if (closestPinchPoint) {
        this.debugLines.push({
          start: indexTipPosition,
          end: closestPinchPoint,
          color: new vec4(0, 1, 0.5, 1)
        })
      }
    }

    this.closestPokeInteractableDistance = foundPokeInteractable ? Math.sqrt(minPokeDistanceSq) : Infinity
    this.closestPinchInteractableDistance = foundPinchInteractable ? Math.sqrt(minPinchDistanceSq) : Infinity
  }

  private calculateHighlightGradientMaskPosition(distance: number): number {
    return this.calculateGradientMaskPosition(
      distance,
      this.style.pokeHighlightThresholdNear,
      this.style.pokeHighlightThresholdFar,
      this.style.pokeHighlightGradientMaskMin,
      this.style.pokeHighlightGradientMaskMax
    )
  }

  private calculateOccludeGradientMaskPosition(distance: number): number {
    return this.calculateGradientMaskPosition(
      distance,
      this.style.pokeOccludeThresholdNear,
      this.style.pokeOccludeThresholdFar,
      this.style.pokeOccludeGradientMaskMin,
      this.style.pokeOccludeGradientMaskMax
    )
  }

  private calculateGradientMaskPosition(
    distance: number,
    thresholdNear: number,
    thresholdFar: number,
    maskMin: number,
    maskMax: number
  ): number {
    if (distance === Infinity || distance >= thresholdFar) return maskMin
    return MathUtils.clamp(MathUtils.remap(distance, thresholdNear, thresholdFar, maskMax, maskMin), maskMin, maskMax)
  }

  private updateLerpTime(
    currentLerpTime: number,
    isTriggered: boolean,
    deltaTime: number,
    maxDuration: number
  ): number {
    const targetTime = isTriggered ? maxDuration : 0
    const direction = Math.sign(targetTime - currentLerpTime)
    const newTime = currentLerpTime + deltaTime * direction
    return MathUtils.clamp(newTime, 0, maxDuration)
  }

  private lerpColor(a: vec4, b: vec4, t: number, out: vec4): void {
    const factor = MathUtils.clamp(t, 0, 1)
    out.x = a.x + (b.x - a.x) * factor
    out.y = a.y + (b.y - a.y) * factor
    out.z = a.z + (b.z - a.z) * factor
    out.w = a.w + (b.w - a.w) * factor
  }
}
