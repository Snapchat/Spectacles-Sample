import {Switch} from "../Switch/Switch"
import {BaseToggleGroup} from "./BaseToggleGroup"
import {Toggleable} from "./Toggleable"

/**
 * Represents a group of switch toggles.
 *
 * @extends BaseToggleGroup
 */
@component
export class SwitchToggleGroup extends BaseToggleGroup {
  @input
  private _switches: Switch[] = []

  get toggleables(): Toggleable[] {
    return this._switches
  }
}
