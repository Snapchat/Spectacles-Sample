import {Interactor, InteractorInputType} from "../../Core/Interactor/Interactor"

import {InteractorCursor} from "../../Components/Interaction/InteractorCursor/InteractorCursor"
import {Singleton} from "../../Decorators/Singleton"
import {validate} from "../../Utils/validate"

/**
 * This singleton class manages the registration and retrieval of InteractorCursor instances. It ensures that each Interactor has a unique cursor and provides methods to get cursors by their associated Interactor.
 *
 */
@Singleton
export class CursorControllerProvider {
  public static getInstance: () => CursorControllerProvider

  private cursors = new Map<Interactor, InteractorCursor>()

  registerCursor(cursor: InteractorCursor): void {
    validate(
      cursor.interactor,
      "InteractorCursor must have a set Interactor before registering to SIK.CursorController.",
    )

    if (this.cursors.has(cursor.interactor)) {
      throw Error(
        `Multiple cursors for a single Interactor have been registered.\nThe CursorController and InteractorCursor components cannot both be present in the scene hierarchy before runtime, use one or the other.`,
      )
    }

    this.cursors.set(cursor.interactor, cursor)
  }

  /**
   * @deprecated in favor of getCursorByInteractor
   * Gets the InteractorCursor for a specified interactor
   * @param interactor The interactor to get the cursor for
   * @returns the InteractorCursor for the requested interactor, or null if it doesn't exist
   */
  getCursor(interactor: Interactor): InteractorCursor | null {
    return this.getCursorByInteractor(interactor)
  }

  /**
   * Gets the InteractorCursor for a specified interactor
   * @param interactor The interactor to get the cursor for
   * @returns the InteractorCursor for the requested interactor, or null if it doesn't exist
   */
  getCursorByInteractor(interactor: Interactor): InteractorCursor | null {
    return this.cursors.get(interactor) ?? null
  }

  /**
   * Gets the InteractorCursor for a specified input type
   * @param inputType The InteractorInputType to get the cursor for
   * @returns the InteractorCursor for the requested InteractorInputType, or null if it doesn't exist
   */
  getCursorByInputType(
    inputType: InteractorInputType,
  ): InteractorCursor | null {
    let interactor: Interactor | undefined

    for (const mapInteractor of this.cursors.keys()) {
      if (mapInteractor.inputType === inputType) {
        interactor = mapInteractor
        break
      }
    }

    return interactor !== undefined
      ? this.getCursorByInteractor(interactor)
      : null
  }

  /**
   * Gets all InteractorCursors within the scene
   * @returns a list of InteractorCursors
   */
  getAllCursors(): InteractorCursor[] {
    return Array.from(this.cursors.values())
  }
}
