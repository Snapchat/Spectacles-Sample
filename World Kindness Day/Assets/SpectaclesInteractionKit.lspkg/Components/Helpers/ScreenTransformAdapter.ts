/**
 * This class adapts a SceneObject's transform to a ScreenTransform if it is a child of a Canvas. It preserves the object's position and rotation during the transformation.
 */
@component
export class ScreenTransformAdapter extends BaseScriptComponent {
  onAwake(): void {
    this.defineScriptEvents()
  }

  private defineScriptEvents() {
    this.createEvent("OnStartEvent").bind(() => {
      this.init()
    })
  }

  init(): void {
    const sceneObject = this.getSceneObject()
    const transform = sceneObject.getTransform()
    const parent = sceneObject.getParent()

    if (
      isNull(parent) ||
      isNull(parent!.getComponent("Component.Canvas")) ||
      isNull(parent!.getComponent("Component.ScreenTransform"))
    ) {
      return
    }

    const canvas = sceneObject.getComponent("Component.Canvas")

    if (!isNull(canvas)) {
      const perservedPosition = transform.getLocalPosition()
      const perservedRotation = transform.getLocalRotation()

      const size = canvas.getSize()
      canvas.destroy()
      const screenTransform = sceneObject.createComponent("Component.ScreenTransform")
      screenTransform.anchors = Rect.create(0, 0, 0, 0)
      screenTransform.offsets.setSize(size)

      screenTransform.position = perservedPosition
      screenTransform.rotation = perservedRotation
    }
  }
}
