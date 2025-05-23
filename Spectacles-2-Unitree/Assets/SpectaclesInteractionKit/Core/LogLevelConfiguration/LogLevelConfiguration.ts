const TAG = "LogLevelConfiguration"

/**
 * This class provides configuration for log levels within the application. It allows setting different log levels for various components and modules, enabling fine-grained control over logging output.
 */
@component
export abstract class LogLevelConfiguration extends BaseScriptComponent {
  @input("int")
  @widget(
    new ComboBoxWidget([
      new ComboBoxItem("Error", 3),
      new ComboBoxItem("Warning", 4),
      new ComboBoxItem("Info", 6),
      new ComboBoxItem("Debug", 7),
      new ComboBoxItem("Verbose", 8),
    ]),
  )
  protected logLevelFilter: number = 8
}
