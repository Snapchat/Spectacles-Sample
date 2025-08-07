import {BaseToggleGroup} from "./BaseToggleGroup"
import {Toggle} from "./Toggle"
import {Toggleable} from "./Toggleable"

/**
 * Represents a group of toggles.
 *
 * @extends BaseToggleGroup
 */
@component
export class ToggleGroup extends BaseToggleGroup {
  @input
  private _toggles: Toggle[] = []

  get toggleables(): Toggleable[] {
    return this._toggles
  }
}
