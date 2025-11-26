import {Interactor, InteractorInputType} from "../../../Core/Interactor/Interactor"

import {InteractionManager} from "../../../Core/InteractionManager/InteractionManager"
import BaseInteractor from "../../../Core/Interactor/BaseInteractor"
import {CursorControllerProvider} from "../../../Providers/CursorControllerProvider/CursorControllerProvider"
import {InteractorRayVisual} from "../InteractorRayVisual/InteractorRayVisual"
import {InteractorCursor} from "./InteractorCursor"

/**
 * This class manages the creation and retrieval of InteractorCursor instances for interactors. It initializes cursors for all interactors on awake and provides methods to get cursors by interactor or input type.
 */
@component
export class CursorController extends BaseScriptComponent {
  private cursorControllerProvider = CursorControllerProvider.getInstance()

  @input
  @label("Use V2 Cursor")
  @hint(
    "Switches to the V2 cursor implementation, designed to make targeting free-floating and distant objects easier, at a higher performance cost.\n\n\
- Targeting: Blends its position based on multiple nearby interactables, making it easier to aim between targets.\n\
- Visuals: Fades out when not aimed near any interactable objects. Also enables a 'Ray' visual that can be set per-Interactable/InteractionPlane.\n\
- Performance: This version is more computationally expensive due to its multi-target analysis."
  )
  private useV2: boolean = false

  /**
   * Enable debug rendering for cursors (cone collider, center ray, and closest-point helpers)
   */
  @input
  @hint("Enable debug rendering for cursors (cone collider, center ray, and closest-point helpers)")
  drawDebug: boolean = false

  onAwake(): void {
    this.createEvent("OnStartEvent").bind(() => {
      this.onStart()
    })
  }

  onStart(): void {
    const interactors = InteractionManager.getInstance().getInteractorsByType(InteractorInputType.All)
    this.cursorControllerProvider.setDefaultUseV2(this.useV2)
    interactors.forEach((interactor: Interactor) => {
      const cursor = this.getSceneObject().createComponent(InteractorCursor.getTypeName()) as InteractorCursor
      cursor.interactor = interactor as BaseInteractor
      cursor.init(this, this.useV2)
      cursor.drawDebug = this.drawDebug
      this.cursorControllerProvider.registerCursor(cursor, interactor)

      const rayVisual = this.getSceneObject().createComponent(InteractorRayVisual.getTypeName()) as InteractorRayVisual
      rayVisual._interactor = interactor as BaseInteractor
      rayVisual.cursor = cursor
    })
  }

  /**
   * @deprecated in favor of getCursorByInteractor
   * Gets the InteractorCursor for a specified interactor
   * @param interactor - The interactor to get the cursor for
   * @returns the InteractorCursor for the requested interactor, or null if it doesn't exist
   */
  getCursor(interactor: Interactor): InteractorCursor | null {
    return this.cursorControllerProvider.getCursor(interactor)
  }

  /**
   * Gets the InteractorCursor for a specified interactor
   * @param interactor - The interactor to get the cursor for
   * @returns the InteractorCursor for the requested interactor, or null if it doesn't exist
   */
  getCursorByInteractor(interactor: Interactor): InteractorCursor | null {
    return this.cursorControllerProvider.getCursorByInteractor(interactor)
  }

  /**
   * Gets the InteractorCursor for a specified input type
   * @param inputType - The InteractorInputType to get the cursor for
   * @returns the InteractorCursor for the requested InteractorInputType, or null if it doesn't exist
   */
  getCursorByInputType(inputType: InteractorInputType): InteractorCursor | null {
    return this.cursorControllerProvider.getCursorByInputType(inputType)
  }

  /**
   * Gets all InteractorCursors within the scene
   * @returns a list of InteractorCursors
   */
  getAllCursors(): InteractorCursor[] {
    return this.cursorControllerProvider.getAllCursors()
  }
}
