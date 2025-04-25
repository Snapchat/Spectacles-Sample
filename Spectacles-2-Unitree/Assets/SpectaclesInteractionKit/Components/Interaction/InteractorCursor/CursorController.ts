import {
  Interactor,
  InteractorInputType,
} from "../../../Core/Interactor/Interactor"

import BaseInteractor from "../../../Core/Interactor/BaseInteractor"
import {CursorControllerProvider} from "../../../Providers/CursorControllerProvider/CursorControllerProvider"
import {InteractionManager} from "../../../Core/InteractionManager/InteractionManager"
import {InteractorCursor} from "./InteractorCursor"

/**
 * This class manages the creation and retrieval of InteractorCursor instances for interactors. It initializes cursors for all interactors on awake and provides methods to get cursors by interactor or input type.
 */
@component
export class CursorController extends BaseScriptComponent {
  private cursorControllerProvider = CursorControllerProvider.getInstance()

  onAwake(): void {
    const interactors = InteractionManager.getInstance().getInteractorsByType(
      InteractorInputType.All,
    )

    interactors.forEach((interactor: Interactor) => {
      const cursor = this.getSceneObject().createComponent(
        InteractorCursor.getTypeName(),
      )
      cursor.interactor = interactor as BaseInteractor
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
  getCursorByInputType(
    inputType: InteractorInputType,
  ): InteractorCursor | null {
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
