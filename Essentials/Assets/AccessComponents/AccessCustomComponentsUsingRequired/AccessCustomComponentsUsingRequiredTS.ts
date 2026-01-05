/**
 * AccessCustomComponentsUsingRequiredTS.ts
 *
 * This example demonstrates how to access custom components in TypeScript.
 */

@component
export class AccessCustomComponentsUsingRequiredTS extends BaseScriptComponent {
  // Debug flag to enable logging

  @input
  public targetObject: SceneObject

  @input
  public debug: boolean = false

  private typeName = requireType("./CustomComponentTS") as keyof ComponentNameMap

  onAwake() {
    this.createEvent("OnStartEvent").bind(() => {
      this.onStart()
      this.debug && print("Start event triggered")
    })
  }

  // Called when the script is initialized
  onStart() {
    try {
      this.debug && print("AccessCustomComponentsUsingRequiredTS initialized")

      // Get all components on this object
      const components = this.targetObject.getAllComponents()
      this.debug && print(`Found ${components.length} components on this object`)
      const customComponentExample = this.targetObject.getComponent(this.typeName) as any

      customComponentExample.hasTexture()

      this.debug && print(`Found Texture Size ${customComponentExample.textureSize} on this object`)
    } catch (error) {
      print(`Error: ${error}`)
    }
  }
}
