/**
 * AccessCustomComponentsUsingTypenameTS.ts
 *
 * This example demonstrates how to access custom components using the @typename decorator in TypeScript.
 */

@component
export class AccessCustomComponentsUsingTypenameTS extends BaseScriptComponent {
  // Define the component type using @typename
  @typename
  CustomComponentTS: keyof ComponentNameMap

  // Input the component directly
  @input("CustomComponentTS")
  customComponent: any

  // Debug flag to enable logging
  @input
  public debug: boolean = false

  // Called when the script is initialized
  onAwake(): void {
    // Create an event for onStart to ensure components are fully initialized
    this.createEvent("OnStartEvent").bind(() => {
      this.onStart()
    })
  }

  // Called when the scene starts
  onStart(): void {
    try {
      this.debug && print("AccessCustomComponentsUsingTypenameTS initialized")

      // Access the component directly
      if (this.customComponent) {
        // Call methods on the component
        const hasTexture = this.customComponent.hasTexture()
        this.debug && print(`Component has texture: ${hasTexture}`)

        // Access properties
        if (this.customComponent.textureSize !== undefined) {
          this.debug && print(`Texture size: ${this.customComponent.textureSize}`)
        }
      } else {
        print("Custom component not found")
      }
    } catch (error) {
      print(`Error: ${error}`)
    }
  }
}
