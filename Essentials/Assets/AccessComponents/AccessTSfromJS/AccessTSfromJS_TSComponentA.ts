/**
 * TypeScript component that can be accessed from JavaScript
 */
@component
export class TSComponentA extends BaseScriptComponent {
  // Debug flag
  @input
  debug: boolean = true

  // Basic properties
  numberVal: number = 1
  stringVal: string = "Hello from TypeScript"
  boolVal: boolean = true
  arrayVal: number[] = [1, 2, 3, 4, 5]
  objectVal: Record<string, any> = {
    name: "TSComponentA",
    version: 1.5,
    features: ["typeSafety", "intellisense"]
  }

  // Private state
  private counter: number = 0

  onAwake() {
    this.log("TSComponentA initialized")
  }

  // Helper method for debug logging
  private log(message: string): void {
    this.debug && print(`[TSComponentA] ${message}`)
  }

  // Original method enhanced with debug
  printHelloWorld(): void {
    this.debug && print("Hello, world!")
  }

  // New methods
  getDescription(): string {
    const desc = `TypeScript Component (version ${this.objectVal.version})`
    this.log(`Description requested: ${desc}`)
    return desc
  }

  // Math operations
  add(a: number, b: number): number {
    const result = a + b
    this.log(`Addition: ${a} + ${b} = ${result}`)
    return result
  }

  multiply(a: number, b: number): number {
    const result = a * b
    this.log(`Multiplication: ${a} * ${b} = ${result}`)
    return result
  }

  // Counter methods
  incrementCounter(amount: number = 1): number {
    this.counter += amount
    this.log(`Counter incremented by ${amount} to ${this.counter}`)
    return this.counter
  }

  resetCounter(): number {
    this.counter = 0
    this.log("Counter reset to 0")
    return this.counter
  }

  getCounter(): number {
    return this.counter
  }

  // Toggle debug mode
  toggleDebug(): void {
    this.debug = !this.debug
    this.debug && this.log(`Debug mode ${this.debug ? "enabled" : "disabled"}`)
  }
}
