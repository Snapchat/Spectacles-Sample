/**
 * CustomComponentTS.ts
 *
 * This is a sample custom component that will be accessed by another script.
 * It provides a simple method and property that can be accessed.
 */

@component
export class CustomComponentTS extends BaseScriptComponent {
  // Public property that can be accessed
  public textureSize: number = 512

  // Called when the component is initialized
  onAwake(): void {
    print("CustomComponentTS has been initialized")
  }

  // Public method that can be called
  public hasTexture(): boolean {
    print("CustomComponentTS.hasTexture() called successfully")
    return true
  }
}
