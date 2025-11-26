import {InteractableManipulation} from "../../../../Components/Interaction/InteractableManipulation/InteractableManipulation"
import {CursorMode} from "../../../../Components/Interaction/InteractorCursor/InteractorCursor"
import Event from "../../../../Utils/Event"
import {ContainerFrame, InputState} from "../ContainerFrame"
import {CursorHandler} from "./CursorHandler"

export type FrameInputOptions = {
  frame: ContainerFrame
  manipulate: InteractableManipulation
  target: SceneObject
  parentTransform: Transform
  cursorHandler: CursorHandler
  isInteractable: boolean
  scaleSpeed: number | undefined
  allowScaling: boolean
  allowScalingTopLeft?: boolean
  allowScalingTopRight?: boolean
  minimumSize?: vec2
  maximumSize?: vec2
}

/**
 *
 * Which state is the input handler in currently
 *
 */
export type FrameState = {
  scaling: boolean
  translating: boolean
  rotating: boolean
  ignoring: boolean
  interacting: boolean
  hoveringInteractable: boolean
}

/**
 *
 * Container Frame Input Modes
 * Auto ( no explicit mode )
 * Scaling ( with corners defined )
 * Rotating
 * Translating
 *
 */
export enum Modes {
  Auto = "auto",
  ScaleTopLeft = "scaleTopLeft",
  ScaleBottomRight = "scaleBottomRight",
  ScaleTopRight = "scaleTopRight",
  ScaleBottomLeft = "scaleBottomLeft",
  Translating = "translating"
}

// affects speed of scaling
const SCALE_AMPLIFIER = 0.2

export class FrameInputHandler {
  /**
   *
   * This class takes the inputs from the raycaster
   * and uses it to control the frame manipulations
   * as well as provide that information to visual affordances
   *
   */
  private edge: number = 0.5
  gutterSize: vec2 = new vec2(0.08, 0.08)
  allowScaling: boolean = this.options.allowScaling
  allowScalingTopLeft: boolean = this.options.allowScalingTopLeft ?? true
  allowScalingTopRight: boolean = this.options.allowScalingTopRight ?? true
  private corner: vec2 = new vec2(1, 1)
  private aspect: vec2 = new vec2(1, 1)
  private frame: ContainerFrame = this.options.frame
  private parentTransform: Transform = this.options.parentTransform
  private manipulate: InteractableManipulation = this.options.manipulate
  private target: SceneObject = this.options.target
  private targetTransform: Transform = this.target.getTransform()
  private targetWorldScaleCache: vec3 = this.targetTransform.getWorldScale()
  private lastTouch = vec3.zero()
  lastHovered: boolean = false
  private scalingStarted: boolean = false
  private cursorHandler = this.options.cursorHandler
  private mode: Modes = Modes.Auto
  readonly state: FrameState = {
    rotating: false,
    scaling: false,
    translating: false,
    ignoring: false,
    hoveringInteractable: false,
    interacting: false
  }

  private onTranslationStartEvent = new Event()
  /**
   * Callback for when translation begins
   *
   * NOTE: The reason we need to add this event in FrameInputHandler, instead of relying on the container frame's
   * internal InteractableManipulation component is because the way this class keeps track of state means that
   * we don't set the InteractableManipulation's canTranslate property until after the user has started translating,
   * which has the effect of causing InteractableManipulation to NOT invoke the onTranslationStart event.
   */
  onTranslationStart = this.onTranslationStartEvent.publicApi()

  private onTranslationEndEvent = new Event()
  /**
   * Callback for when translation ends
   */
  onTranslationEnd = this.onTranslationEndEvent.publicApi()

  minimumSize: vec2 =
    this.targetWorldScaleCache.x > this.targetWorldScaleCache.y
      ? new vec2(3, (3 * this.targetWorldScaleCache.y) / this.targetWorldScaleCache.x)
      : new vec2((3 * this.targetWorldScaleCache.x) / this.targetWorldScaleCache.y, 3)

  maximumSize: vec2 =
    this.targetWorldScaleCache.x > this.targetWorldScaleCache.y
      ? new vec2(400, (400 * this.targetWorldScaleCache.y) / this.targetWorldScaleCache.x)
      : new vec2((400 * this.targetWorldScaleCache.x) / this.targetWorldScaleCache.y, 400)

  constructor(private options: FrameInputOptions) {
    if (this.options.minimumSize) {
      this.minimumSize = this.options.minimumSize
    }
    if (this.options.maximumSize) {
      this.maximumSize = this.options.maximumSize
    }
  }

  /*
   * Helper for programatic components
   */
  private get isInteractable(): boolean {
    return this.options.isInteractable
  }

  private get scaleAmplifier(): number {
    return this.options.scaleSpeed ?? SCALE_AMPLIFIER
  }

  update = (inputState: InputState) => {
    const touch = inputState.position
    this.state.hoveringInteractable = false
    if (touch.x < -this.edge + this.gutterSize.x && touch.y < -this.edge + this.gutterSize.y && this.allowScaling) {
      this.mode = Modes.ScaleBottomLeft
    } else if (
      touch.x < -this.edge + this.gutterSize.x &&
      touch.y > this.edge - this.gutterSize.y &&
      this.allowScaling
    ) {
      if (this.allowScalingTopLeft) {
        this.mode = Modes.ScaleTopLeft
      } else {
        this.state.ignoring = true
      }
    } else if (
      touch.x > this.edge - this.gutterSize.x &&
      touch.y < -this.edge + this.gutterSize.y &&
      this.allowScaling
    ) {
      this.mode = Modes.ScaleBottomRight
    } else if (
      touch.x > this.edge - this.gutterSize.x &&
      touch.y > this.edge - this.gutterSize.y &&
      this.allowScaling
    ) {
      if (this.allowScalingTopRight) {
        this.mode = Modes.ScaleTopRight
      } else {
        this.state.ignoring = true
      }
    } else if (touch.x > this.edge - this.gutterSize.x) {
      // right edge
      this.mode = Modes.Translating
    } else if (touch.x < -this.edge + this.gutterSize.x) {
      // left edge
      this.mode = Modes.Translating
    } else if (touch.y < -this.edge + this.gutterSize.y) {
      // bottom edge
      this.mode = Modes.Translating
    } else if (touch.y > this.edge - this.gutterSize.y) {
      // top edge
      this.mode = Modes.Translating
    } else {
      // not in corner or on edge

      if (this.isInteractable === false) {
        this.mode = Modes.Translating
      } else if (!this.state.ignoring && !this.state.scaling && !this.state.translating) {
        // hovering interactable
        this.mode = Modes.Auto

        if (inputState.rawHovered) {
          this.state.hoveringInteractable = true
        } else {
          this.state.hoveringInteractable = false
        }
      }
    }

    if (inputState.isPinching) {
      if (
        !this.state.ignoring &&
        !this.state.scaling &&
        !this.state.translating &&
        !this.state.rotating &&
        !this.state.interacting
      ) {
        // if pinching and not already in am ode
        if (this.mode === Modes.ScaleBottomLeft) {
          this.corner.x = -1
          this.corner.y = -1
          this.startScaling(touch)
        } else if (this.mode === Modes.ScaleTopLeft) {
          this.corner.x = -1
          this.corner.y = 1
          this.startScaling(touch)
        } else if (this.mode === Modes.ScaleBottomRight) {
          this.corner.x = 1
          this.corner.y = -1
          this.startScaling(touch)
        } else if (this.mode === Modes.ScaleTopRight) {
          this.corner.x = 1
          this.corner.y = 1
          this.startScaling(touch)
        } else if (this.mode === Modes.Translating) {
          this.setStateTranslating(true)
        } else {
          // touching but not in corner or on edge
          if (this.isInteractable === false) {
            // content is not interactable, activating translation
            this.setStateTranslating(true)
          } else {
            // content is interactable
            this.state.interacting = true
          }
        }
      }
    } else {
      if (this.state.scaling) {
        // end scaling
        this.frame.onScalingEnd.invoke()
      }

      this.setStateTranslating(false)
      this.state.scaling = false
      this.state.rotating = false
      this.state.ignoring = false
      this.state.interacting = false
      this.lastTouch = vec3.zero()
    }

    if (this.frame.forceTranslate) {
      this.mode = Modes.Translating
      this.setStateTranslating(true)
    }

    if ((this.frame.allowTranslation && this.state.translating) || this.frame.forceTranslate) {
      this.manipulate.setCanTranslate(true)
    } else if (this.manipulate.canTranslate()) {
      this.manipulate.setCanTranslate(false)
    }

    //
    // handle cursor swaps
    if (!this.state.scaling || !this.state.translating) {
      if (!this.state.interacting) {
        if (this.mode === Modes.ScaleBottomLeft || this.mode === Modes.ScaleTopRight) {
          this.cursorHandler.mode = CursorMode.ScaleTopRight
        } else if (this.mode === Modes.ScaleBottomRight || this.mode === Modes.ScaleTopLeft) {
          this.cursorHandler.mode = CursorMode.ScaleTopLeft
        } else if (this.mode === Modes.Translating && (this.frame.allowTranslation || this.frame.forceTranslate)) {
          this.cursorHandler.mode = CursorMode.Translate
        } else {
          this.cursorHandler.mode = CursorMode.Auto
        }
      }

      if (!this.state.scaling) {
        this.lastTouch = vec3.zero()
      }

      if (this.lastHovered === false && inputState.isHovered) {
        inputState.isHovered = false
      }

      if (this.lastHovered === true && !inputState.isHovered) {
        inputState.isHovered = true
      }

      this.lastHovered = false
    }
  }

  private startScaling = (touchPosition: vec3) => {
    this.lastTouch = touchPosition
    this.state.scaling = true
    this.frame.scalingSizeStart = this.frame.innerSize.uniformScale(1)
    this.frame.onScalingStart.invoke()
  }

  private setStateTranslating(isTranslating: boolean) {
    if (isTranslating === this.state.translating) {
      return
    }

    this.state.translating = isTranslating

    if (this.state.translating) {
      this.onTranslationStartEvent.invoke()
    } else {
      this.onTranslationEndEvent.invoke()
    }
  }
}
