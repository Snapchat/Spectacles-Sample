import animate from "SpectaclesInteractionKit.lspkg/Utils/animate"

@component
export class FrameDestroyTest extends BaseScriptComponent {
  onAwake() {
    print("FrameDestroyTest: onAwake called")
    this.createEvent("OnStartEvent").bind(() => {
      print("FrameDestroyTest: OnStartEvent fired - starting 3 second countdown")
      // Wait 3 seconds, then destroy the scene object
      animate({
        duration: 3.0,
        update: (t: number) => {
          // Log progress every 0.5 seconds
          const elapsed = t * 3.0
          if (Math.floor(elapsed * 2) !== Math.floor((elapsed - 0.016) * 2)) {
            const remaining = 3.0 - elapsed
            print(`FrameDestroyTest: ${remaining.toFixed(1)} seconds remaining`)
          }
        },
        ended: () => {
          print("FrameDestroyTest: 3 seconds elapsed - destroying scene object")
          // Destroy the scene object
          // This will trigger Frame's OnDestroyEvent if a Frame component is attached
          try {
            if (this.sceneObject) {
              print("FrameDestroyTest: Calling sceneObject.destroy()")
              this.sceneObject.destroy()
              print("FrameDestroyTest: sceneObject.destroy() completed")
            } else {
              print("FrameDestroyTest: ERROR - sceneObject is null!")
            }
          } catch (e) {
            // Suppress any errors from Frame's cleanup code
            print(`FrameDestroyTest: Error during destruction: ${e}`)
          }
        }
      })
    })
  }
}
