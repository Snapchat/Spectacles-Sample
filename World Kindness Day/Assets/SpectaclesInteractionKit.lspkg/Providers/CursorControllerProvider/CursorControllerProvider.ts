import {Interactor, InteractorInputType} from "../../Core/Interactor/Interactor"

import {InteractorCursor} from "../../Components/Interaction/InteractorCursor/InteractorCursor"
import {Singleton} from "../../Decorators/Singleton"
import NativeLogger from "../../Utils/NativeLogger"
import {validate} from "../../Utils/validate"

const TAG = "CursorControllerProvider"

/**
 * This singleton class manages the registration and retrieval of InteractorCursor instances. It ensures that each Interactor has a unique cursor and provides methods to get cursors by their associated Interactor.
 * When retrieving cursors, make sure to only invoke getCursor APIs during or after the OnStartEvent of a script.
 */
@Singleton
export class CursorControllerProvider {
  public static getInstance: () => CursorControllerProvider

  private log = new NativeLogger(TAG)

  private cursors = new Map<Interactor, InteractorCursor>()
  private defaultUseV2: boolean = false

  setDefaultUseV2(useV2: boolean): void {
    this.defaultUseV2 = useV2
  }

  getDefaultUseV2(): boolean {
    return this.defaultUseV2
  }

  registerCursor(cursor: InteractorCursor, interactor: Interactor | null = null): void {
    if (cursor.interactor !== null) {
      interactor = cursor.interactor
    }
    validate(interactor, "InteractorCursor must have a set Interactor before registering to SIK.CursorController.")

    if (this.cursors.has(interactor)) {
      this.log.e(
        `Multiple cursors for a single Interactor have been registered.\nThe CursorController and InteractorCursor components cannot both be present in the scene hierarchy before runtime, use one or the other.`
      )

      return
    }

    this.cursors.set(interactor, cursor)
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
  getCursorByInputType(inputType: InteractorInputType): InteractorCursor | null {
    let interactor: Interactor | undefined

    for (const mapInteractor of this.cursors.keys()) {
      if (mapInteractor.inputType === inputType) {
        interactor = mapInteractor
        break
      }
    }

    return interactor !== undefined ? this.getCursorByInteractor(interactor) : null
  }

  /**
   * Gets all InteractorCursors within the scene
   * @returns a list of InteractorCursors
   */
  getAllCursors(): InteractorCursor[] {
    return Array.from(this.cursors.values())
  }
}
