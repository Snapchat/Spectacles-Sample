@component
export class Declaration extends BaseScriptComponent {
  // This empty class is required to avoid editor errors
  // It serves as the declaration for the JavaScript component
}

/**
 * Interface for the JavaScript component that allows TypeScript to access its properties and methods
 */
export interface JSComponentA extends ScriptComponent {
  // Properties
  numberVal: number
  stringVal: string
  boolVal: boolean
  arrayVal: number[]
  objectVal: {
    name: string
    version: number
  }

  // Methods
  printHelloWorld: () => void
  add: (a: number, b: number) => number
  multiply: (a: number, b: number) => number

  // Event handling
  onValueChanged: (callback: (newValue: number) => void) => void
  updateValue: (newValue: number) => void

  // Internal property (not meant to be accessed directly)
  valueChangedCallback?: (newValue: number) => void
}
