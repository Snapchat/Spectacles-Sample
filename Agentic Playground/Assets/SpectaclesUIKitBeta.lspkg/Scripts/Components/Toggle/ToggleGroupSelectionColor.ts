import {BaseToggleGroup} from "./BaseToggleGroup"
import {Toggleable} from "./Toggleable"
import {ToggleSelectionColor} from "./ToggleSelectionColor"

/**
 * Represents a group of toggles.
 *
 * @extends BaseToggleGroup
 */
@component
export class ToggleGroupSelectionColor extends BaseToggleGroup {
  @input
  private _toggles: ToggleSelectionColor[] = []

  get toggleables(): Toggleable[] {
    return this._toggles
  }
}
