/**
 * This class provides configuration for log levels within the application. It allows setting different log levels for various components and modules, enabling fine-grained control over logging output.
 */
@component
export abstract class LogLevelConfiguration extends BaseScriptComponent {
  /**
   * Controls the verbosity of logs. Higher values show more detailed logs, while lower values only show critical
   * information.
   * - Error (3): Errors that may affect functionality.
   * - Warning (4): Potential issues that don't affect normal operation.
   * - Info (6): General information about application state.
   * - Debug (7): Detailed information useful for debugging.
   * - Verbose (8): Maximum detail including fine-grained operational data.
   */
  @input("int")
  @hint(
    "Controls the verbosity of logs. Higher values show more detailed logs, while lower values only show critical \
information.\n\
   - Error (3): Errors that may affect functionality.\n\
   - Warning (4): Potential issues that don't affect normal operation.\n\
   - Info (6): General information about application state.\n\
   - Debug (7): Detailed information useful for debugging.\n\
   - Verbose (8): Maximum detail including fine-grained operational data."
  )
  @widget(
    new ComboBoxWidget([
      new ComboBoxItem("Error", 3),
      new ComboBoxItem("Warning", 4),
      new ComboBoxItem("Info", 6),
      new ComboBoxItem("Debug", 7),
      new ComboBoxItem("Verbose", 8)
    ])
  )
  protected logLevelFilter: number = 8
}
