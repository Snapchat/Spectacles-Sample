import {CursorMode, InteractorCursor} from "../../../../Components/Interaction/InteractorCursor/InteractorCursor"
import {validate} from "../../../../Utils/validate"
import {ContainerFrame, InputState} from "../ContainerFrame"
import {FrameState} from "./FrameInputHandler"

export type CursorManagerOptions = {
  interactorCursor?: InteractorCursor
  target: SceneObject
  frame: ContainerFrame
  margin: number
}

export enum CursorModes {
  auto = 0,
  scaleTlBr = 1,
  scaleTrBl = 2,
  translate = 3
}

export class CursorHandler {
  /**
   *
   * Manages custom cursor states
   * used for indicating contextual functionality
   * swaps textures
   * animates effects
   *
   */

  /**
   * mode is used to select the current active texture
   * updated in ContainerFrame update loop to match the FrameInputController state
   */
  mode: CursorMode = CursorMode.Auto
  private lastMode: CursorMode = this.mode
  private target: SceneObject = this.options.target
  private targetTransform: Transform = this.target.getTransform()
  private frame: ContainerFrame = this.options.frame
  private parentTransform: Transform | undefined = this.frame.object?.getTransform()
  private lockMode: boolean = false
  private lockPosition: vec3 = vec3.zero()
  private margin: number = this.options.margin
  private interactorCursor: InteractorCursor | null = null

  private _enabled: boolean = false

  constructor(private options: CursorManagerOptions) {
    this.interactorCursor = options.interactorCursor ?? null
  }

  /**
   * sets current position of cursor
   * ignored if cursor is in lockMode
   */
  set position(pos: vec3 | null) {
    if (!this.lockMode && this.interactorCursor) {
      this.interactorCursor.cursorPosition = pos
    }
  }

  /**
   * update
   * @param inputState
   * @param frameState
   *
   * method called in main loop
   * watches for changed CursorModes to swap textures
   * updates position and triggers animations
   */

  update = (inputState: InputState, frameState: FrameState) => {
    if (!this.interactorCursor) {
      return
    }

    validate(this.parentTransform)

    if (this.lockMode) {
      const ogScale = this.parentTransform.getWorldScale()
      const tempScale = new vec3(
        this.frame.innerSize.x + this.frame.constantPadding.x + this.frame.border * 2,
        this.frame.innerSize.y + this.frame.constantPadding.y + this.frame.border * 2,
        1
      )
      this.parentTransform.setWorldScale(tempScale)
      const tempWorld = this.parentTransform.getWorldTransform()
      const lockedPosition = tempWorld.multiplyPoint(this.lockPosition)
      this.parentTransform.setWorldScale(ogScale)
      this.interactorCursor.cursorPosition = lockedPosition
    } else {
      // use default position, without override
      this.interactorCursor.cursorPosition = null
    }

    // prevent switching to translate while over inner interactables
    if (!inputState.isHovered) {
      this.mode = CursorMode.Auto
    }
    // handle switching cursors
    if (this.mode !== this.lastMode && !this.lockMode) {
      this.interactorCursor.cursorMode = this.mode
      this.lastMode = this.mode
    }

    if (frameState.scaling && !this.lockMode) {
      this.lockMode = true
      this.lockPosition = inputState.position
    }

    if (!frameState.scaling && this.lockMode) {
      this.lockMode = false
      this.resetCursor()
    }
  }

  /**
   * Sets the InteractorCursor for the handler to control.
   * @param cursor
   */
  setCursor(cursor: InteractorCursor | null): void {
    if (this.interactorCursor !== cursor && this.interactorCursor) {
      this.resetCursor()
    }
    this.interactorCursor = cursor
  }

  /**
   * Reset the position override & mode of the interactor cursor.
   */
  resetCursor() {
    if (this.interactorCursor) {
      this.interactorCursor.cursorMode = CursorMode.Auto
      this.interactorCursor.cursorPosition = null
    }
    this.lastMode = CursorMode.Auto
    this.mode = CursorMode.Auto
  }
}
