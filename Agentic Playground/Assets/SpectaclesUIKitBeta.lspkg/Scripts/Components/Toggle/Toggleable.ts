import {PublicApi} from "SpectaclesInteractionKit.lspkg/Utils/Event"

/**
 * Interface representing a toggleable component.
 */
export interface Toggleable {
  /**
   * Converts the component to a toggleable state.
   */
  convertToToggle(): void

  /**
   * Indicates whether the toggleable component has been initialized.
   */
  get initialized(): boolean

  /**
   * Indicates whether the toggle is currently on.
   */
  get isOn(): boolean

  /**
   * Sets the toggle state, implicitly and silenetly
   * Setting this does not trigger toggle group to turn on/off other toggles.
   *
   * @param on - A boolean value indicating the desired toggle state.
   */
  set isOn(on: boolean)

  /**
   * Set the toggeable on or off.
   * @param on - A boolean value indicating the desired toggle state.
   */
  toggle(on: boolean): void

  /**
   * Event that is triggered when the component is initialized.
   */
  readonly onInitialized: PublicApi<void>

  /**
   * Event that is triggered when the toggle value changes.
   */
  readonly onValueChanged: PublicApi<number>

  /**
   * Event that is triggered when the toggle finishes its action.
   * The event data represents whether it's an explicit change.
   */
  readonly onFinished: PublicApi<boolean>
}
