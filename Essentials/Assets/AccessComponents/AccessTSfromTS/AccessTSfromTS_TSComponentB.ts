import {TSComponentA} from "./AccessTSfromTS_TSComponentA"

/**
 * TypeScript component that demonstrates accessing another TypeScript component
 * with full type safety and intellisense
 */
@component
export class TSComponentB extends BaseScriptComponent {
  // Reference to TSComponentA with proper typing
  @input
  refScript: TSComponentA

  // Debug flag
  @input
  debug: boolean = true

  // Track if component is initialized
  private initialized: boolean = false

  // Helper method for debug logging
  private log(message: string): void {
    this.debug && print(`[TSComponentB] ${message}`)
  }

  onAwake() {
    if (!this.refScript) {
      this.log("Error: TSComponentA reference is missing!")
      return
    }

    this.initialized = true

    // Sync debug settings
    this.refScript.debug = this.debug
    this.log("Debug settings synchronized with TSComponentA")

    // Access basic properties with full type safety
    this.log("Number value: " + this.refScript.numberVal)
    this.log("String value: " + this.refScript.stringVal)
    this.log("Boolean value: " + this.refScript.boolVal)
    this.log("Array value: " + JSON.stringify(this.refScript.arrayVal))
    this.log("Object value: " + JSON.stringify(this.refScript.objectVal))

    // Call the original method
    this.refScript.printHelloWorld()
    this.log("Last called method: " + this.refScript.getLastCalledMethod())

    // Use component info method
    const info = this.refScript.getComponentInfo()
    this.log(`Component info: name=${info.name}, version=${info.version}, lastCalled=${info.lastCalled}`)

    // Use data processing methods
    const processedData = this.refScript.processData({id: 123, name: "Test Data"})
    this.log(`Processed data timestamp: ${processedData.timestamp}`)

    const average = this.refScript.calculateAverage(this.refScript.arrayVal)
    this.log(`Average of array values: ${average}`)

    // Use counter methods
    this.log("Initial counter: " + this.refScript.getCounter())
    this.log("After increment: " + this.refScript.incrementCounter())
    this.log("After increment by 5: " + this.refScript.incrementCounter(5))
    this.log("After reset: " + this.refScript.resetCounter())
  }

  // Public methods that could be called from elsewhere
  public getComponentInfo(): {name: string; version: number; lastCalled: string} | null {
    if (!this.initialized || !this.refScript) return null
    return this.refScript.getComponentInfo()
  }

  public incrementCounter(amount: number = 1): number {
    if (!this.initialized || !this.refScript) return 0
    const newValue = this.refScript.incrementCounter(amount)
    this.debug && this.log(`Counter incremented from TSComponentB: ${newValue}`)
    return newValue
  }

  public resetCounter(): number {
    if (!this.initialized || !this.refScript) return 0
    const newValue = this.refScript.resetCounter()
    this.debug && this.log(`Counter reset from TSComponentB: ${newValue}`)
    return newValue
  }

  // Toggle debug mode for both components
  public toggleDebug(): void {
    this.debug = !this.debug
    if (this.initialized && this.refScript) {
      this.refScript.debug = this.debug
      this.refScript.toggleDebug()
    }
    this.debug && this.log(`Debug mode ${this.debug ? "enabled" : "disabled"}`)
  }
}
