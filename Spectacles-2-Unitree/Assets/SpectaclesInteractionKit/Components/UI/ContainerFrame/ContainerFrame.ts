import animate, {AnimationManager, CancelSet} from "../../../Utils/animate"
import Event, {PublicApi, unsubscribe} from "../../../Utils/Event"
import {FrameInputHandler, FrameInputOptions} from "./modules/FrameInputHandler"

import {Billboard} from "../../../Components/Interaction/Billboard/Billboard"
import {Interactable} from "../../../Components/Interaction/Interactable/Interactable"
import {InteractableManipulation} from "../../../Components/Interaction/InteractableManipulation/InteractableManipulation"
import {InteractionPlane} from "../../../Components/Interaction/InteractionPlane/InteractionPlane"
import {Interactor} from "../../../Core/Interactor/Interactor"
import {InteractorEvent} from "../../../Core/Interactor/InteractorEvent"
import WorldCameraFinderProvider from "../../../Providers/CameraProvider/WorldCameraFinderProvider"
import {CursorControllerProvider} from "../../../Providers/CursorControllerProvider/CursorControllerProvider"
import {lerp} from "../../../Utils/mathUtils"
import NativeLogger from "../../../Utils/NativeLogger"
import {validate} from "../../../Utils/validate"
import {CursorHandler} from "./modules/CursorHandler"
import {HoverBehavior} from "./modules/HoverBehavior"
import {LabeledPinchButton} from "./modules/LabeledPinchButton"
import {SmoothFollow} from "./modules/SmoothFollow"
import {SnappableBehavior} from "./modules/SnappableBehavior"

const log = new NativeLogger("ContainerFrame")

export type InputState = {
  isHovered: boolean
  rawHovered: boolean
  isPinching: boolean
  position: vec3
  drag: vec3
  innerInteractableActive: boolean
}

export type ContainerFrameConfig = {
  target: SceneObject
  parent: SceneObject
}

const OPACITY_TWEEN_DURATION = 0.2
const SQUEEZE_TWEEN_DURATION = 0.4

const DEFAULT_BACKING_ALPHA = 1
const CAPTURE_BACKING_ALPHA = 0.1

/*
 * use forced depth for now
 * only 2d content
 */
const scaleZ = 1

/*
 * ratio for scaling between world space and margin space
 * testing different values here, leaving for reference during continued visdev
 * const scaleFactor = 90
 * const scaleFactor = 70
 */
const scaleFactor = 50
// frame depth factor
const zScaleAdjuster = 15

const CURSOR_HIGHLIGHT_ANIMATION_DURATION = 0.15

/**
 * History of this magic number:
 * I added the frame mesh to the scene with a basic material
 * And overlayed it on a Unit Plane
 * I switched the camera to orthographic
 * And scaled up the Frame Mesh until it's edges just touched the edges of the unit plane
 * That was at scale 8.24
 * So without any stretching, the mesh is 1 / 8.24
 * 1 / 8.24 = 0.1213592233
 * And since we set the base scale of the mesh to a constant and then stretch with vertex shader
 * I multiply that base scale by this number above, to get the size of the frame that isn't stretched
 * And subtract that from the amount we need to stretch
 * ヽ(｀Д´)⊃━☆ﾟ. * ･ ｡ﾟ,
 */
const magicScalar = 0.1213592233

/**
 * the base scale of the frame
 */
const scaleFactorVector = new vec3(
  scaleFactor + magicScalar,
  scaleFactor + magicScalar,
  scaleZ * zScaleAdjuster
)

// the current system UI button is not unit sized
// it's closer to 2.35 in X and Y
const buttonMagicNumber = 0.4474272931
// constant size of button
const defaultButtonSize = 3 * buttonMagicNumber

const BUTTON_CORNER_OFFSET = 1 / scaleFactor

const NEAR_FIELD_INTERACTION_ZONE_DISTANCE_CM = 30

/**
 * This class represents a container frame that can hold and manage UI elements. It provides settings for auto show/hide, inner size, border, constant padding, and scaling. The class uses prefabs for the frame and labeled buttons, and textures for icons.
 */
@component
export class ContainerFrame extends BaseScriptComponent {
  private framePrefab: ObjectPrefab = requireAsset(
    "./Prefabs/FramePrefab.prefab"
  ) as ObjectPrefab
  private labeledButtonPrefab = requireAsset(
    "./Prefabs/container-button.prefab"
  ) as ObjectPrefab
  private closeIcon: Texture = requireAsset(
    "./Textures/close-icon-1.png"
  ) as Texture
  private followIcon: Texture = requireAsset(
    "./Textures/follow-white.png"
  ) as Texture
  private unfollowIcon: Texture = requireAsset(
    "./Textures/follow-black.png"
  ) as Texture

  @ui.group_start("Frame Settings")
  @input
  autoShowHide: boolean = true
  @input("vec2", "{32,32}")
  innerSize: vec2 = new vec2(32, 32)
  @input
  border: number = 7
  @input("vec2", "{0,0}")
  @hint("In world units (cm), stays constant through scaling")
  constantPadding: vec2 = new vec2(0, 0)
  @input
  private allowScaling: boolean = true
  @input
  autoScaleContent: boolean = true
  @input
  private isContentInteractable: boolean = false
  @input
  allowTranslation: boolean = true
  @ui.group_end
  @ui.label("")
  @ui.group_start("Min/Max Size")
  @input("vec2", "{10,10}")
  @hint("In world units (cm)")
  private minimumSize: vec2 = new vec2(10, 10)
  @input("vec2", "{150,150}")
  @hint("In world units (cm)")
  private maximumSize: vec2 = new vec2(150, 150)
  @ui.group_end
  @ui.label("")
  @ui.group_start("Billboarding")
  @input
  private useBillboarding: boolean = false
  @input
  @showIf("useBillboarding")
  private xOnTranslate: boolean = false
  @input
  @showIf("xOnTranslate")
  private xAlways: boolean = false
  @input
  @showIf("useBillboarding")
  private yOnTranslate: boolean = false
  @input
  @showIf("yOnTranslate")
  private yAlways: boolean = false
  @ui.group_end
  @ui.label("")
  @ui.group_start("Snapping")
  @input
  @hint("Use Snapping Behaviors")
  private useSnapping: boolean = false
  @input
  @showIf("useSnapping")
  @hint("Container to Container Snapping")
  private itemSnapping: boolean = false
  @input
  @showIf("useSnapping")
  @hint("Container to World Snapping")
  private worldSnapping: boolean = false
  @ui.group_end
  @ui.label("")
  @ui.group_start("Follow Behavior")
  @input
  private showFollowButton: boolean = false
  @input
  @label("Front Follow Behavior")
  @showIf("showFollowButton")
  private useFOVFollow: boolean = false
  @input
  @showIf("useFOVFollow")
  isFollowing: boolean = false
  @ui.group_end
  @ui.label("")
  @ui.group_start("Close Button")
  @input
  private showCloseButton: boolean = true
  @ui.group_end
  @ui.group_start("Interaction Plane")
  @input
  private _enableInteractionPlane: boolean = false
  @ui.group_end
  @ui.separator
  private squeezeAmount = this.border * 0.15

  private frame!: SceneObject
  material!: Material
  private frameTransform!: Transform
  private target!: SceneObject
  private targetTransform!: Transform
  private targetScaleCache!: vec2
  private originalScale!: vec2
  scalingSizeStart: vec2 | null = null
  private parent!: SceneObject
  parentTransform!: Transform
  private collider: ColliderComponent | null = null
  private colliderShape: BoxShape | null = null
  private colliderTransform: Transform | null = null

  closeButton!: LabeledPinchButton
  /**
   * event for callback on close button trigger
   */
  followButton!: LabeledPinchButton
  /**
   * event for callback on follow button toggle on
   */

  private buttonSize: number = defaultButtonSize

  private buttonScaleVector: vec3 = vec3
    .one()
    .uniformScale(defaultButtonSize)
    .div(scaleFactorVector)

  private cursorHandler!: CursorHandler

  private animationManager: AnimationManager = new AnimationManager()

  /**
   * event handler for frame scaling update
   */
  private onScalingUpdate: Event = new Event()
  /**
   * event handler for frame scaling started
   */
  onScalingStart: Event = new Event()
  /**
   * event handler for frame scaling ended
   */
  onScalingEnd: Event = new Event()
  /**
   * public api for adding functions to the onScalingUpdate event handler
   */
  onScalingUpdateEvent = this.onScalingUpdate.publicApi()
  /**
   * public api for adding functions to the onScalingStart event handler
   */
  onScalingStartEvent = this.onScalingStart.publicApi()
  /**
   * public api for adding functions to the onScalingEnd event handler
   */
  onScalingEndEvent = this.onScalingEnd.publicApi()

  private onTranslationStartEvent = new Event()
  /**
   * public api for adding functions to the onTranslationStartEvent event handler
   */
  onTranslationStart = this.onTranslationStartEvent.publicApi()

  private onTranslationEndEvent = new Event()
  /**
   * public api for adding functions to the onTranslationEndEvent event handler
   */
  onTranslationEnd = this.onTranslationEndEvent.publicApi()

  private onHoverEnterInnerInteractableEvent = new Event()
  onHoverEnterInnerInteractable =
    this.onHoverEnterInnerInteractableEvent.publicApi()

  private onHoverExitInnerInteractableEvent = new Event()
  onHoverExitInnerInteractable =
    this.onHoverExitInnerInteractableEvent.publicApi()

  forceTranslate: boolean = false

  private inputState: InputState = {
    isHovered: false,
    rawHovered: false,
    isPinching: false,
    position: vec3.zero(),
    drag: vec3.zero(),
    innerInteractableActive: false,
  }

  private _opacity: number = 1
  private opacityCancel: CancelSet = new CancelSet()

  /**
   * boolean tracking visibility of frame
   */
  private _isVisible: boolean = true

  private set isVisible(isVisible: boolean) {
    this._isVisible = isVisible
  }

  get isVisible() {
    return this._isVisible
  }

  private scalingLastFrame: boolean = false
  private translatingLastFrame: boolean = false

  private onMovingShrinkFactor: number = 0
  private squeezeCancel: CancelSet = new CancelSet()

  private translateMode: number = 0
  private translateModeCancel: CancelSet = new CancelSet()

  private interactable!: Interactable
  private manipulate!: InteractableManipulation

  private allInteractables: Interactable[] = []

  billboardComponent: Billboard | null = null
  private interactableCached: Interactable | null = null
  private manipulateCached: InteractableManipulation | null = null

  // Parent Hover state of frame
  private parentCollider!: ColliderComponent
  private parentInteractable!: Interactable

  /**
   * reference to HoverBehavior on parent element
   */
  parentHoverBehavior!: HoverBehavior

  private renderMeshVisual: RenderMeshVisual | null = null

  private inputHandlerOptions!: FrameInputOptions

  private inputHandler!: FrameInputHandler

  private snapBehavior: SnappableBehavior | null = null

  currentInteractor: Interactor | null = null

  /**
   * public api for adding functions to the onSnappingComplete event handler
   */
  onSnappingComplete: PublicApi<void> | null = null

  /**
   * reference to world camera
   */
  worldCamera: Camera = WorldCameraFinderProvider.getInstance().getComponent()

  /**
   * reference to frame's default front follow behavior
   */
  smoothFollow: SmoothFollow | null = null

  private currentBorder: number = this.border

  private destroyed: boolean = false

  private hoveringInnerInteractableLast: boolean = false
  private interactableHoverOpacity: number = 0.34

  private backingAlphaCache: number = DEFAULT_BACKING_ALPHA

  private hoveringContentInteractable: boolean = false
  private hoveringContentInteractableLast: boolean = false
  private cursorHighlightCancel = new CancelSet()

  private forcePreserveScale: boolean = false

  private lastConstantPadding: vec2 = this.constantPadding.uniformScale(1)

  // tweakable for frustum optimizations
  private frustumBuffer: number = 0

  private unSubscribeList: unsubscribe[] = []

  private interactionPlane: InteractionPlane

  onAwake() {
    // frame
    this.frame = this.framePrefab.instantiate(null)
    this.frameTransform = this.frame.getTransform()

    this.targetScaleCache = new vec2(this.innerSize.x, this.innerSize.y)
    this.originalScale = new vec2(this.innerSize.x, this.innerSize.y)
    // parent
    this.parent = this.getSceneObject()
    this.parentTransform = this.parent.getTransform()
    // target
    this.target = global.scene.createSceneObject("ContainerInner")
    this.targetTransform = this.target.getTransform()
    this.parent.children.forEach((child: SceneObject) => {
      child.setParent(this.target)
    })
    this.target.setParent(this.parent)

    // collider
    this.collider = this.frame.getComponent("Physics.ColliderComponent")
    this.colliderShape = this.collider.shape as BoxShape
    this.colliderTransform = this.collider.getSceneObject().getTransform()
    // buttons
    this.closeButton = new LabeledPinchButton({
      prefab: this.labeledButtonPrefab,
      parent: this.frame,
      labels: [this.closeIcon],
    })

    this.closeButton.onTrigger.add(() => {
      this.inputState.isPinching = false
    })

    this.followButton = new LabeledPinchButton({
      prefab: this.labeledButtonPrefab,
      parent: this.frame,
      labels: [this.followIcon, this.unfollowIcon],
      toggle: true,
      triggerColor: new vec4(0.8, 0.8, 0.8, 1),
    })
    this.followButton.setIconScale(new vec2(1.85, 1.85))

    this.followButton.onTrigger.add(() => {
      this.inputState.isPinching = false
      this.setIsFollowing(!this.isFollowing)
    })

    // cursor
    this.cursorHandler = new CursorHandler({
      target: this.target,
      frame: this,
      margin: this.border,
    })

    // SIK Components
    this.interactable = this.frame.createComponent(Interactable.getTypeName())

    /*
     * indirect targeting only with one interactor
     * prevents direct manipulation controls which are undesired for frame
     */
    this.interactable.targetingMode = 2
    this.interactable.allowMultipleInteractors = false

    this.manipulate = this.frame.createComponent(
      InteractableManipulation.getTypeName()
    )

    this.billboardComponent = this.useBillboarding
      ? this.parent.createComponent(Billboard.getTypeName())
      : null

    if (this.billboardComponent !== null) {
      this.billboardComponent.xAxisEnabled = false || this.xAlways
      this.billboardComponent.yAxisEnabled = false || this.yAlways
    }

    // material
    this.renderMeshVisual = this.frame.getComponent(
      "Component.RenderMeshVisual"
    )
    this.material = this.renderMeshVisual.mainMaterial.clone()
    this.renderMeshVisual.mainMaterial = this.material

    this.material.mainPass.frustumCullMode = FrustumCullMode.UserDefinedAABB

    // input handler
    this.inputHandlerOptions = {
      frame: this,
      manipulate: this.manipulate,
      target: this.target,
      parentTransform: this.parentTransform,
      cursorHandler: this.cursorHandler,
      isInteractable: this.isContentInteractable,
      scaleSpeed: undefined,
      allowScaling: this.allowScaling,
      minimumSize: this.minimumSize,
      maximumSize: this.maximumSize,
    }

    this.inputHandler = new FrameInputHandler(this.inputHandlerOptions)

    // Use the FrameInputHandler as the authoritative source on when translation starts
    this.inputHandler.onTranslationStart.add(() => {
      this.onTranslationStartEvent.invoke()
      this.smoothFollow?.startDragging()
    })
    this.inputHandler.onTranslationEnd.add(() => {
      this.onTranslationEndEvent.invoke()
      this.smoothFollow?.finishDragging()
    })

    // button logic
    this.enableCloseButton(this.showCloseButton)
    this.enableFollowButton(this.showFollowButton)

    // following logic
    this.setIsFollowing(this.isFollowing)

    this.manipulate.setManipulateRoot(this.parentTransform)
    this.manipulate.setCanScale(false)

    this.parentTransform.setWorldPosition(
      this.targetTransform.getWorldPosition()
    )
    this.parentTransform.setWorldRotation(
      this.targetTransform.getWorldRotation()
    )
    this.frame.setParentPreserveWorldTransform(this.parent)

    this.frameTransform.setLocalPosition(vec3.zero())
    this.frameTransform.setLocalRotation(quat.quatIdentity())
    this.frameTransform.setWorldScale(scaleFactorVector)

    this.targetTransform.setLocalPosition(new vec3(0, 0, 0.5))
    this.targetTransform.setLocalRotation(quat.quatIdentity())

    this.opacity = this.material.mainPass.opacity as number
    this.scaleFrame()

    // We need a collider or one is created. We don't actually use it for anything
    this.parentCollider = this.parent.createComponent(
      "Physics.ColliderComponent"
    )
    const shape = Shape.createBoxShape()
    shape.size = new vec3(0.01, 0.01, 0.01)
    this.parentCollider.shape = shape

    this.parentInteractable = this.parent.createComponent(
      Interactable.getTypeName()
    )
    this.parentHoverBehavior = new HoverBehavior(this.parentInteractable)

    this.unSubscribeList.push(
      this.parentHoverBehavior.onHoverStart.add((e: InteractorEvent) => {
        this.cursorHandler.setCursor(
          CursorControllerProvider.getInstance().getCursorByInteractor(
            e.interactor
          )
        )
        if (this.autoShowHide) this.showVisual()
        if (this.material.mainPass.isHovered === 0) {
          this.showCursorHighlight()
        }
        this.inputState.isHovered = true
        this.inputState.rawHovered = true
      })
    )

    this.unSubscribeList.push(
      this.parentHoverBehavior.onHoverUpdate.add((e: InteractorEvent) => {
        const targetObject = e?.target.sceneObject

        this.updateCursorHighlightPosition(e)

        let targetParent: SceneObject | null = targetObject
        let hoveringInteractable = false

        while (
          targetParent !== null &&
          !targetParent.isSame(this.sceneObject)
        ) {
          if (targetObject === this.target || targetParent === this.target) {
            hoveringInteractable = true
            break
          }
          targetParent = isNull(targetParent) ? null : targetParent.getParent()
        }

        // hovering over interactable container content ONLY
        if (hoveringInteractable) {
          if (!this.hoveringContentInteractableLast) {
            this.hideCursorHighlight()
          }
        } else {
          if (this.hoveringContentInteractableLast) {
            this.showCursorHighlight()
          }
        }
        this.hoveringContentInteractableLast = hoveringInteractable

        // hover over interactable area ( non border container ) OR interactable container content
        if (
          hoveringInteractable ||
          this.inputHandler.state.hoveringInteractable
        ) {
          this.inputState.innerInteractableActive = true
        } else {
          this.inputState.innerInteractableActive = false
        }
      })
    )

    this.unSubscribeList.push(
      this.parentHoverBehavior.onHoverEnd.add(() => {
        if (this.autoShowHide) this.hideVisual()
        if (this.material.mainPass.isHovered > 0) {
          this.hideCursorHighlight()
        }
        this.inputState.isHovered = false
        this.inputState.rawHovered = false
        this.inputState.innerInteractableActive = false
      })
    )

    this.unSubscribeList.push(
      this.interactable.onHoverUpdate.add((event: InteractorEvent) => {
        if (event.interactor.targetHitInfo) {
          this.updateCursorHighlightPosition(event)

          if (event.target === this.interactable)
            this.inputHandler.lastHovered = true
        }
      })
    )

    let dragStart = vec3.zero()

    this.unSubscribeList.push(
      this.interactable.onTriggerStart((e: InteractorEvent) => {
        const targetObject = e?.target.sceneObject
        let targetParent: SceneObject | null = targetObject
        validate(e.interactor.planecastPoint)
        dragStart = this.parentTransform
          .getInvertedWorldTransform()
          .multiplyPoint(e.interactor.planecastPoint)

        while (
          targetParent !== null &&
          !targetParent.isSame(this.sceneObject)
        ) {
          if (
            targetObject === this.target ||
            targetObject === this.frame ||
            targetParent === this.target
          ) {
            this.inputState.isPinching = true
            this.currentInteractor = e.interactor
          }
          if (targetObject === this.target || targetParent === this.target) {
            break
          }
          targetParent = targetParent?.getParent()
        }
      })
    )

    this.unSubscribeList.push(
      this.interactable.onTriggerUpdate((event: InteractorEvent) => {
        if (event.interactor.targetHitInfo && this.inputHandler.state.scaling) {
          validate(event.interactor.planecastPoint)
          validate(this.scalingSizeStart)
          const dragPos = this.parentTransform
            .getInvertedWorldTransform()
            .multiplyPoint(event.interactor.planecastPoint)
          const dragSign = new vec3(
            Math.sign(dragStart.x),
            Math.sign(dragStart.y),
            Math.sign(dragStart.z)
          )
          const dragDeltaTemp = dragPos.sub(dragStart).mult(dragSign)
          const dragDelta = new vec2(dragDeltaTemp.x, dragDeltaTemp.y)
          const dragScaleVec = dragDelta.div(
            this.scalingSizeStart.uniformScale(0.5)
          )
          const dragScale = Math.max(dragScaleVec.x, dragScaleVec.y)
          const newInnerSize = this.scalingSizeStart.uniformScale(1 + dragScale)

          if (
            newInnerSize.x > this.minimumSize.x &&
            newInnerSize.y > this.minimumSize.y &&
            newInnerSize.x < this.maximumSize.x &&
            newInnerSize.y < this.maximumSize.y
          ) {
            this.innerSize = newInnerSize
            this.interactionPlane.planeSize = this.totalInnerSize.add(
              vec2.one().uniformScale(this.border * 2)
            )
          }
        }
      })
    )

    this.unSubscribeList.push(
      this.interactable.onTriggerEnd(() => {
        this.inputState.isPinching = false
        this.currentInteractor = null
      })
    )

    this.unSubscribeList.push(
      this.interactable.onTriggerCanceled(() => {
        this.inputState.isPinching = false
        this.currentInteractor = null
      })
    )

    if (this.useSnapping) {
      this.createSnappableBehavior()
    }

    if (this.useFOVFollow) {
      this.setUseFollow(true)
    }

    this.allInteractables.push(this.interactable)
    this.allInteractables.push(this.parentInteractable)
    const closeButton = this.closeButton.getInteractable()
    if (closeButton) {
      this.allInteractables.push(closeButton)
    }
    const followButton = this.followButton.getInteractable()
    if (followButton) {
      this.allInteractables.push(followButton)
    }

    // start hidden
    if (this.autoShowHide) {
      this.hideVisual()
    } else {
      this._opacity = 0
      this.showVisual()
    }

    // handle scaling affordances
    this.setAllowScaling(this.allowScaling)

    this.createEvent("OnDestroyEvent").bind(this.onDestroy)

    // hide cursorHighlight on start
    this.material.mainPass.isHovered = 0
    this.backingAlpha = this.material.mainPass.backingAlpha

    this.interactionPlane = this.sceneObject.createComponent(
      InteractionPlane.getTypeName()
    )
    this.interactionPlane.planeSize = this.totalInnerSize.add(
      vec2.one().uniformScale(this.border * 2)
    )
    this.interactionPlane.proximityDistance =
      NEAR_FIELD_INTERACTION_ZONE_DISTANCE_CM

    this.interactionPlane.enabled = this.enableInteractionPlane

    this.createEvent("LateUpdateEvent").bind(this.lateUpdate)

    this.update()
  }

  set enableInteractionPlane(enabled: boolean) {
    this.interactionPlane.enabled = enabled
    this._enableInteractionPlane = enabled
  }

  get enableInteractionPlane(): boolean {
    return this._enableInteractionPlane
  }

  private updateCursorHighlightPosition = (e: InteractorEvent) => {
    validate(this.colliderShape)
    validate(this.colliderTransform)

    if (e.interactor.targetHitInfo) {
      const hitPosition = e.interactor.targetHitInfo?.hit.position
      const normalizer = vec3.one().div(this.colliderShape.size)
      this.inputState.position = this.colliderTransform
        .getInvertedWorldTransform()
        .multiplyPoint(hitPosition)
        .mult(normalizer)
    }
  }

  private showCursorHighlight = () => {
    if (this.cursorHighlightCancel) this.cursorHighlightCancel.cancel()
    const startingHighlight = this.material.mainPass.isHovered
    animate({
      duration: CURSOR_HIGHLIGHT_ANIMATION_DURATION * (1 - startingHighlight),
      cancelSet: this.cursorHighlightCancel,
      update: (t) => {
        this.material.mainPass.isHovered = t
      },
    })
  }

  private hideCursorHighlight = () => {
    if (this.cursorHighlightCancel) this.cursorHighlightCancel.cancel()
    const startingHighlight = this.material.mainPass.isHovered
    animate({
      duration: CURSOR_HIGHLIGHT_ANIMATION_DURATION * startingHighlight,
      cancelSet: this.cursorHighlightCancel,
      update: (t) => {
        this.material.mainPass.isHovered =
          startingHighlight - t * startingHighlight
      },
    })
  }

  /**
   * set diameter of buttons in centimeters
   * @param size
   */

  setButtonScale = (size: number) => {
    this.buttonSize = size * buttonMagicNumber
    this.buttonScaleVector = vec3
      .one()
      .uniformScale(this.buttonSize)
      .div(scaleFactorVector)
    this.scaleAndPositionButtons()
  }

  private update = () => {
    /// if in capture getDeltaTime returns 0
    if (getDeltaTime() === 0) {
      // lighten background if in capture
      if (this.backingAlpha !== CAPTURE_BACKING_ALPHA) {
        // set directly to not update backingAlphaCache
        this.material.mainPass.backingAlpha = CAPTURE_BACKING_ALPHA
      }
    } else {
      //not in capture
      if (this.backingAlpha !== this.backingAlphaCache) {
        // reset to stored value
        this.backingAlpha = this.backingAlphaCache
      }
    }

    // confirm not destroyed before looping more
    if (this.destroyed) {
      // if destroyed return will stop looping as update requests itself
      return
    }

    this.inputHandler.update(this.inputState)

    // only billboard on translate
    if (this.inputHandler.state.translating) {
      if (this.billboardComponent !== null) {
        this.billboardComponent.xAxisEnabled =
          (this.xOnTranslate &&
            (this.allowTranslation || this.forceTranslate)) ||
          this.xAlways
        this.billboardComponent.yAxisEnabled =
          (this.yOnTranslate &&
            (this.allowTranslation || this.forceTranslate)) ||
          this.yAlways
      }
      if (!this.translatingLastFrame) {
        // just started translating
        const currentSqueeze = this.onMovingShrinkFactor
        this.tweenMarginSqueeze(currentSqueeze, this.squeezeAmount)
        const currentTranslateMode = this.translateMode
        this.tweenTranslateMode(currentTranslateMode, 1)
      }
      this.translatingLastFrame = true
    } else {
      if (
        this.billboardComponent !== null &&
        (!this.isFollowing || this.xAlways || this.yAlways)
      ) {
        this.billboardComponent.xAxisEnabled = false || this.xAlways
        this.billboardComponent.yAxisEnabled = false || this.yAlways
      }
      if (this.translatingLastFrame) {
        // just stopped translating
        const currentSqueeze = this.onMovingShrinkFactor
        this.tweenMarginSqueeze(currentSqueeze, 0)
        const currentTranslateMode = this.translateMode
        this.tweenTranslateMode(currentTranslateMode, 0)
      }
      this.translatingLastFrame = false
    }

    this.currentBorder = this.border - this.onMovingShrinkFactor

    if (
      !this.innerSize.equal(this.targetScaleCache) ||
      this.currentBorder !== this.material.mainPass.frameMargin ||
      !this.constantPadding.equal(this.lastConstantPadding)
    ) {
      this.targetScaleCache.x = this.innerSize.x
      this.targetScaleCache.y = this.innerSize.y
      this.lastConstantPadding.x = this.constantPadding.x
      this.lastConstantPadding.y = this.constantPadding.y
      this.scaleFrame()
    }

    this.inputState.innerInteractableActive =
      this.inputState.innerInteractableActive ||
      this.inputHandler.state.hoveringInteractable

    if (
      this.inputState.innerInteractableActive &&
      !this.hoveringInnerInteractableLast
    ) {
      const currentOpacity = this._opacity
      if (this.autoShowHide) {
        this.tweenOpacity(currentOpacity, this.interactableHoverOpacity)
      }
      // start hovering inner interactable
      this.onHoverEnterInnerInteractableEvent.invoke()
    } else if (
      !this.inputState.innerInteractableActive &&
      this.hoveringInnerInteractableLast
    ) {
      const currentOpacity = this._opacity
      if (this.inputState.rawHovered) {
        if (this.autoShowHide) {
          this.tweenOpacity(currentOpacity, 1)
        }
      }
      // stop hovering inner interactable
      this.onHoverExitInnerInteractableEvent.invoke()
    }
    this.hoveringInnerInteractableLast = this.inputState.innerInteractableActive

    this.cursorHandler.update(this.inputState, this.inputHandler.state)

    this.material.mainPass.translateMode = this.translateMode

    if (!this.scalingLastFrame && !this.translatingLastFrame) {
      this.material.mainPass.touchPosition = this.inputState.position
    }

    if (this.inputHandler.state.scaling && !this.scalingLastFrame) {
      // first frame scaling
      this.smoothFollow?.startDragging()
    }

    if (!this.inputHandler.state.scaling && this.scalingLastFrame) {
      // first frame NOT scaling
      this.smoothFollow?.finishDragging()
    }

    this.scalingLastFrame = this.inputHandler.state.scaling

    this.snapBehavior?.setScaling(this.inputHandler.state.scaling)

    if (this.inputHandler.state.translating) this.snapBehavior?.update()

    if (this.isFollowing) {
      this.smoothFollow?.onUpdate()
    }

    this.animationManager.requestAnimationFrame(this.update)
  }

  private lateUpdate = () => {
    this.parentHoverBehavior.lateUpdate()
  }

  private scaleFrame = () => {
    validate(this.colliderShape)
    validate(this.renderMeshVisual)

    this.material.mainPass.frameMargin = this.currentBorder

    this.material.mainPass.scaleFactor = scaleFactor

    const doubleMargin = this.currentBorder * 2

    const meshEdges = scaleFactor * magicScalar

    this.material.mainPass.scaleX =
      this.targetScaleCache.x +
      doubleMargin -
      meshEdges +
      this.constantPadding.x
    this.material.mainPass.scaleY =
      this.targetScaleCache.y +
      doubleMargin -
      meshEdges +
      this.constantPadding.y

    this.material.mainPass.scaleZ = scaleZ / zScaleAdjuster

    this.material.mainPass.rawScale = new vec2(
      this.targetScaleCache.x + this.constantPadding.x,
      this.targetScaleCache.y + this.constantPadding.y
    )

    const fullScale = new vec2(
      this.targetScaleCache.x + this.constantPadding.x + doubleMargin,
      this.targetScaleCache.y + this.constantPadding.y + doubleMargin
    )

    this.material.mainPass.fullScale = new vec2(fullScale.x, fullScale.y)

    let aspectRatio = new vec2(1, 1)
    if (fullScale.x > fullScale.y) {
      aspectRatio.y = fullScale.x / fullScale.y
    } else {
      aspectRatio.x = fullScale.y / fullScale.x
    }

    this.material.mainPass.aspectRatio = new vec2(aspectRatio.x, aspectRatio.y)

    this.material.mainPass.originalScale = new vec2(
      this.originalScale.x + this.currentBorder,
      this.originalScale.y + this.currentBorder
    )

    this.colliderShape.size = new vec3(
      (this.targetScaleCache.x +
        this.currentBorder * 2 +
        this.constantPadding.x) /
        scaleFactor,
      (this.targetScaleCache.y +
        this.currentBorder * 2 +
        this.constantPadding.y) /
        scaleFactor,
      scaleZ / zScaleAdjuster
    )

    this.renderMeshVisual.mainMaterial.mainPass.frustumCullMin = new vec3(
      this.colliderShape.size.x * -0.5 - this.frustumBuffer,
      this.colliderShape.size.y * -0.5 - this.frustumBuffer,
      this.colliderShape.size.z * -0.5
    )

    this.renderMeshVisual.mainMaterial.mainPass.frustumCullMax = new vec3(
      this.colliderShape.size.x * 0.5 + this.frustumBuffer,
      this.colliderShape.size.y * 0.5 + this.frustumBuffer,
      this.colliderShape.size.z * 0.5
    )

    this.inputHandler.gutterSize.x =
      this.currentBorder / (scaleFactor * this.colliderShape.size.x)
    this.inputHandler.gutterSize.y =
      this.currentBorder / (scaleFactor * this.colliderShape.size.y)

    this.scaleAndPositionButtons()

    this.frameTransform.setLocalPosition(vec3.zero())
    this.frameTransform.setLocalRotation(quat.quatIdentity())

    this.targetTransform.setLocalPosition(new vec3(0, 0, scaleZ + 0.5))
    this.targetTransform.setLocalRotation(quat.quatIdentity())

    if (this.autoScaleContent) {
      if (!this.forcePreserveScale) {
        const factor = this.innerSize.div(this.originalScale)
        this.targetTransform.setLocalScale(new vec3(factor.x, factor.y, 1))
      } else {
        // update original with cloned cache to prevent reset on next scaling
        this.originalScale = this.targetScaleCache.uniformScale(1)
      }
    }

    this.smoothFollow?.resize(
      this.innerSize.x + doubleMargin + this.constantPadding.x
    )

    if (!this.forcePreserveScale) {
      this.onScalingUpdate.invoke()
    } else {
      this.forcePreserveScale = false
    }
  }

  private scaleAndPositionButtons = () => {
    this.closeButton.transform.setLocalScale(this.buttonScaleVector)
    this.followButton.transform.setLocalScale(this.buttonScaleVector)

    const halfFrameWidth =
      (this.innerSize.x * 0.5 +
        this.constantPadding.x * 0.5 +
        this.currentBorder) /
      scaleFactor
    const halfFrameHeight =
      (this.innerSize.y * 0.5 +
        this.constantPadding.y * 0.5 +
        this.currentBorder) /
      scaleFactor

    const buttonOffset =
      (this.buttonSize / scaleFactor) * -1 - BUTTON_CORNER_OFFSET

    // CORNER POSITIONING
    this.closeButton.transform.setLocalPosition(
      new vec3(
        -halfFrameWidth - buttonOffset,
        halfFrameHeight + buttonOffset,
        0.1
      )
    )

    this.followButton.transform.setLocalPosition(
      new vec3(
        halfFrameWidth + buttonOffset,
        halfFrameHeight + buttonOffset,
        0.1
      )
    )
  }

  /**
   * setup billboarding component with the following parameters
   * @param useBillboard
   * @param xOnTranslate
   * @param xAlways
   * @param yOnTranslate
   * @param yAlways
   */
  setBillboarding = (
    useBillboard: boolean,
    xOnTranslate: boolean = false,
    xAlways: boolean = false,
    yOnTranslate: boolean = false,
    yAlways: boolean = false
  ): void => {
    this.useBillboarding = useBillboard

    if (this.useBillboarding) {
      this.xOnTranslate = xOnTranslate
      this.xAlways = xAlways
      this.yOnTranslate = yOnTranslate
      this.yAlways = yAlways

      if (this.billboardComponent === null) {
        this.billboardComponent = this.parent.createComponent(
          Billboard.getTypeName()
        )
      }

      this.billboardComponent.xAxisEnabled = false || this.xAlways
      this.billboardComponent.yAxisEnabled = false || this.yAlways
    } else {
      if (this.billboardComponent) {
        this.billboardComponent.xAxisEnabled = false
        this.billboardComponent.yAxisEnabled = false
      }
    }
  }

  setYAlways = (yAlways: boolean) => {
    this.setBillboarding(
      this.useBillboarding,
      this.xOnTranslate,
      this.xAlways,
      this.yOnTranslate,
      yAlways
    )
  }

  setUseBillboarding = (useBillboarding: boolean): void => {
    this.setBillboarding(
      useBillboarding,
      this.xOnTranslate,
      this.xAlways,
      this.yOnTranslate,
      this.yAlways
    )
  }

  /**
   * @returns frame's Interactable
   */
  getInteractable = (): Interactable => {
    if (this.interactableCached === null) {
      this.interactableCached = this.interactable
    }
    return this.interactableCached
  }

  /**
   * @returns frame's parent's Interactable
   */
  getParentInteractable = (): Interactable => {
    return this.parentInteractable
  }

  /**
   * @returns frame's InteractableManipulation
   */
  getInteractableManipulation = (): InteractableManipulation => {
    if (this.manipulateCached === null) {
      this.manipulateCached = this.manipulate
    }
    return this.manipulateCached
  }

  /**
   * @param isInteractable set if content is interactable
   */
  setIsContentInteractable = (isInteractable: boolean) => {
    this.isContentInteractable = isInteractable
    this.inputHandlerOptions.isInteractable = isInteractable
  }

  /**
   * @param isSnappable turns on or off snappableBehavior
   */
  setIsSnappable = (isSnappable: boolean) => {
    this.useSnapping = isSnappable
    if (isSnappable) {
      if (!this.snapBehavior) {
        this.createSnappableBehavior()
      }
    }
    if (this.snapBehavior) {
      this.snapBehavior.isEnabled = isSnappable
    }
  }

  setUseWorldSnapping = (enable: boolean) => {
    validate(this.snapBehavior)

    this.worldSnapping = enable

    if (!this.snapBehavior && enable) {
      this.createSnappableBehavior()
    }

    this.snapBehavior.enableWorldSnapping(enable)
  }

  setUseItemSnapping = (enable: boolean) => {
    validate(this.snapBehavior)

    this.itemSnapping = enable

    if (!this.snapBehavior && enable) {
      this.createSnappableBehavior()
    }

    this.snapBehavior.enableItemSnapping(enable)
  }

  private createSnappableBehavior = () => {
    this.snapBehavior = new SnappableBehavior({
      frame: this,
      worldSnapping: this.worldSnapping,
      itemSnapping: this.itemSnapping,
    })
    this.onSnappingComplete = this.snapBehavior.snappingComplete()
  }

  /**
   * abort snapping behavior
   */
  abortSnapping = (): void => {
    this.snapBehavior?.abortSnapping()
  }

  /**
   * @param allowScaling enable or disable user scaling
   */
  setAllowScaling = (allowScaling: boolean) => {
    this.allowScaling = allowScaling
    this.inputHandler.allowScaling = this.allowScaling

    const scaleHandles = vec4.zero()
    if (allowScaling) {
      if (!this.showFollowButton) scaleHandles.x = 1
      scaleHandles.y = 1
      scaleHandles.z = 1
      if (!this.showCloseButton) scaleHandles.w = 1
    }
    this.material.mainPass.scaleHandles = scaleHandles
  }

  setInnerSizePreserveScale = (newSize: vec2) => {
    this.forcePreserveScale = true
    this.innerSize = newSize

    this.interactionPlane.planeSize = this.totalInnerSize.add(
      vec2.one().uniformScale(this.border * 2)
    )
  }

  /**
   * @param useFollow enable or disable the option to turn on the default follow behavior with the follow button
   */
  setUseFollow = (useFollow: boolean) => {
    this.useFOVFollow = useFollow
    if (useFollow && !this.smoothFollow) {
      this.smoothFollow = new SmoothFollow({
        frame: this,
      })
    }
  }

  /**
   * @param isFollowing enable or disable the following button and defualt behavior ( if it is enabled )
   */
  setIsFollowing = (isFollowing: boolean): void => {
    this.isFollowing = isFollowing

    if (this.isFollowing) {
      if (this.billboardComponent !== null) {
        this.billboardComponent.xAxisEnabled =
          (this.xOnTranslate && this.allowTranslation) || this.xAlways
        this.billboardComponent.yAxisEnabled =
          (this.yOnTranslate && this.allowTranslation) || this.yAlways
      }
      this.followButton.toggled = true
      this.followButton.setColor("trigger")
      this.followButton.setTexture(1)
    } else {
      this.followButton.setColor("default")
      this.followButton.toggled = false
      this.followButton.setTexture(0)
    }
  }

  /**
   * @returns whether the snapping behavior is currently tweening
   */
  isSnappingTweening = (): boolean => {
    if (this.snapBehavior) {
      return this.snapBehavior.isTweening
    }
    return false
  }

  /**
   * @returns whether the snapping behavior is checking for snappable elements
   */
  isSnappingActive = (): boolean => {
    if (this.snapBehavior) {
      return this.snapBehavior.isActive
    }
    return false
  }

  /**
   * @param isActive whether or not to activate snapping
   */
  setSnappingActive = (isActive: boolean): void => {
    if (this.snapBehavior) {
      this.snapBehavior.isActive = isActive
    }
  }

  /**
   * @returns inner object which contains original children
   */
  getTargetObject = () => this.target

  /**
   * @returns returns the frame sceneobject
   */
  getFrameObject = () => this.frame

  /**
   * @param opacity
   * sets opacity of frame when hovering interactable content in the frame
   */
  setHoverInteractableOpacity = (opacity: number) => {
    this.interactableHoverOpacity = opacity
  }

  /**
   * @param minimumSize set minimum scale of frame
   */
  setminimumSize = (minimumSize: vec2) => {
    this.inputHandler.minimumSize = minimumSize
  }

  /**
   * @param maximumSize set maximum scale of frame
   */
  setmaximumSize = (maximumSize: vec2) => {
    this.inputHandler.maximumSize = maximumSize
  }

  /**
   * @param isInteractable enable or disable interactable elements of the frame
   */
  enableInteractables = (isInteractable: boolean) => {
    for (let i = 0; i < this.allInteractables.length; i++) {
      this.allInteractables[i].enabled = isInteractable
    }
  }

  /**
   * @returns vec2 of the total size of the container, including constant padding
   */
  get totalInnerSize(): vec2 {
    return new vec2(
      this.innerSize.x + this.constantPadding.x,
      this.innerSize.y + this.constantPadding.y
    )
  }

  /*
   *
   * worldTransform api
   *
   */

  /**
   * @returns current world position of frame
   */
  get worldPosition(): vec3 {
    return this.parentTransform.getWorldPosition()
  }

  /**
   * @param position sets current world position of frame
   */
  set worldPosition(position: vec3) {
    this.parentTransform.setWorldPosition(position)
  }

  /**
   * Gets current world position of frame
   * @returns {vec3}
   */
  public getWorldPosition(): vec3 {
    return this.parentTransform.getWorldPosition()
  }

  /**
   * @param position sets current world position of frame
   */
  public setWorldPosition(position: vec3) {
    this.parentTransform.setWorldPosition(position)
  }

  /**
   * @returns current local position of frame
   */
  get localPosition(): vec3 {
    return this.parentTransform.getLocalPosition()
  }

  /**
   * @param position sets current local position of frame
   */
  set localPosition(position: vec3) {
    this.parentTransform.setLocalPosition(position)
  }

  /**
   * @returns current local position of frame
   */
  getLocalPosition(): vec3 {
    return this.parentTransform.getLocalPosition()
  }

  /**
   * @param position sets current local position of frame
   */
  setLocalPosition(position: vec3) {
    this.parentTransform.setLocalPosition(position)
  }

  /**
   * @returns current world rotation of frame
   */
  get worldRotation(): quat {
    return this.parentTransform.getWorldRotation()
  }

  /**
   * @param rotation sets current local position of frame
   */
  set worldRotation(rotation: quat) {
    this.parentTransform.setWorldRotation(rotation)
  }

  /**
   * @returns current world rotation of frame
   */
  getWorldRotation(): quat {
    return this.parentTransform.getWorldRotation()
  }

  /**
   * @param rotation sets current local position of frame
   */
  setWorldRotation(rotation: quat) {
    this.parentTransform.setWorldRotation(rotation)
  }

  /**
   * @returns current local rotation of frame
   */
  get localRotation(): quat {
    return this.parentTransform.getLocalRotation()
  }

  /**
   * @param rotation set current local rotation of frame
   */
  set localRotation(rotation: quat) {
    this.parentTransform.setLocalRotation(rotation)
  }
  /**
   * @returns current local rotation of frame
   */
  getLocalRotation(): quat {
    return this.parentTransform.getLocalRotation()
  }

  /**
   * @param rotation set current local rotation of frame
   */
  setLocalRotation(rotation: quat) {
    this.parentTransform.setLocalRotation(rotation)
  }

  /**
   * @returns current world scale of frame
   */
  get worldScale(): vec3 {
    return this.parentTransform.getWorldScale()
  }

  /**
   * @param scale set current world scale of frame
   */
  set worldScale(scale: vec3) {
    this.parentTransform.setWorldScale(scale)
  }

  /**
   * @returns current world scale of frame
   */
  get localScale(): vec3 {
    return this.parentTransform.getLocalScale()
  }

  /**
   * @param scale set current local scale of frame
   */
  set localScale(scale: vec3) {
    this.parentTransform.setLocalScale(scale)
  }

  /**
   * @returns current renderOrder for the renderMeshVisual of the frame itself
   */
  get renderOrder(): number {
    validate(this.renderMeshVisual)
    return this.renderMeshVisual.getRenderOrder()
  }

  /**
   * @param renderOrder sets renderOrder for the renderMeshVisual of the frame itself
   */
  set renderOrder(renderOrder: number) {
    validate(this.renderMeshVisual)
    this.renderMeshVisual.setRenderOrder(renderOrder)
    this.closeButton.setRenderOrder(renderOrder)
    this.followButton.setRenderOrder(renderOrder)
  }

  /**
   * function for fully destroying the frame
   */
  onDestroy = (): void => {
    log.d("destroy isDestroyed:" + this.destroyed)
    if (!this.destroyed) {
      this.destroyed = true
      this.unSubscribeList.forEach((sub) => {
        sub()
      })
      this.parentHoverBehavior.destroy()
      this.snapBehavior?.destroy()

      if (!isNull(this.frame)) {
        this.frame.destroy()
      }

      this.enabled = false
    }
  }

  /**
   * @returns ContainerFrame frame sceneObject
   */
  get object() {
    return this.frame
  }

  /**
   *
   * @returns parent transform of top container object
   */
  getParentTransform = () => this.parentTransform

  /**
   * tween to show visuals of frame and elements
   */
  showVisual = () => {
    validate(this.renderMeshVisual)
    const currentOpacity = this._opacity
    // enable on show
    this.renderMeshVisual.enabled = true
    if (this.closeButton && this.showCloseButton)
      this.closeButton.object.enabled = true
    if (this.followButton && this.showFollowButton)
      this.followButton.object.enabled = true

    this.tweenOpacity(currentOpacity, 1)
  }

  /**
   * tween to hide visuals of frame and elementss
   */
  hideVisual = () => {
    const currentOpacity = this._opacity
    this.tweenOpacity(currentOpacity, 0, () => {
      // disable on hide
      validate(this.renderMeshVisual)
      this.renderMeshVisual.enabled = false
      if (this.closeButton) this.closeButton.object.enabled = false
      if (this.followButton) this.followButton.object.enabled = false
    })
  }

  /**
   * tween from current opacity to target opacity, will cancel existing opacity tweens
   * @param currentOpacity
   * @param targetOpacity
   */
  tweenOpacity = (
    currentOpacity: number,
    targetOpacity: number,
    endCallback = () => {}
  ) => {
    if (this.opacityCancel) this.opacityCancel.cancel()
    animate({
      duration:
        OPACITY_TWEEN_DURATION * Math.abs(targetOpacity - currentOpacity),
      update: (t: number) => {
        this.opacity = lerp(currentOpacity, targetOpacity, t)
      },
      ended: endCallback,
      cancelSet: this.opacityCancel,
    })
  }

  /**
   * @param opacity sets opacity for all frame elements
   * note this parameter is effected by calls to `showVisual` and `hideVisual`
   */
  set opacity(opacity: number) {
    if (opacity > 0) {
      this.isVisible = true
    } else {
      this.isVisible = false
    }
    if (!this.destroyed) {
      this._opacity = opacity
      this.material.mainPass.opacity = opacity
      this.closeButton.setAlpha(opacity)
      this.followButton.setAlpha(opacity)
    }
  }

  /**
   * @returns current opacity of frame elements
   */
  get opacity(): number {
    return this._opacity
  }

  /**
   * @param alpha sets alpha of the glass border of the frame
   */
  set borderAlpha(alpha: number) {
    if (!this.destroyed) {
      this.material.mainPass.borderAlpha = alpha
    }
  }

  /**
   * @returns alpha of the glass border of the frame
   */
  get borderAlpha(): number {
    return this.material.mainPass.borderAlpha
  }

  /**
   * @param alpha sets alpha of the dark backing effect of the frame
   */
  set backingAlpha(alpha: number) {
    if (!this.destroyed) {
      this.backingAlphaCache = alpha
      this.material.mainPass.backingAlpha = alpha
    }
  }

  /**
   * @returns alpha of the dark backing effect of the frame
   */
  get backingAlpha(): number {
    return this.material.mainPass.backingAlpha
  }

  /**
   * @param enabled set close button enabled or disabled
   */
  enableCloseButton = (enabled: boolean) => {
    this.closeButton.object.enabled = enabled
    const scaleHandles = this.material.mainPass.scaleHandles
    scaleHandles.w = enabled && this.allowScaling ? 1 : 0
    this.material.mainPass.scaleHandles = scaleHandles
  }

  /**
   * @param enabled set follow button enabled or disabled
   */
  enableFollowButton = (enabled: boolean) => {
    this.followButton.object.enabled = enabled
    const scaleHandles = this.material.mainPass.scaleHandles
    scaleHandles.y = enabled && this.allowScaling ? 1 : 0
    this.material.mainPass.scaleHandles = scaleHandles
  }

  private tweenMarginSqueeze = (
    currentSqueeze: number,
    targetSqueeze: number
  ) => {
    animate({
      duration: SQUEEZE_TWEEN_DURATION,
      easing: "ease-out-back-cubic",
      update: (t: number) => {
        this.onMovingShrinkFactor = lerp(currentSqueeze, targetSqueeze, t)
      },
      cancelSet: this.squeezeCancel,
    })
  }

  private tweenTranslateMode = (current: number, target: number) => {
    animate({
      duration: SQUEEZE_TWEEN_DURATION,
      update: (t: number) => {
        this.translateMode = lerp(current, target, t)
      },
      cancelSet: this.translateModeCancel,
    })
  }
}
