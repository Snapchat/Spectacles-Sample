import NativeLogger from "SpectaclesInteractionKit.lspkg/Utils/NativeLogger"
import {CapsuleVisual} from "../../Visuals/Capsule/CapsuleVisual"
import {Button} from "./Button"

const log = new NativeLogger("CapsuleButton") // eslint-disable-line @typescript-eslint/no-unused-vars

/**
 * Represents a CapsuleButton component that extends the base Button class.
 * This component initializes a CapsuleVisual instance and assigns it as the visual representation.
 *
 * @extends Button - Inherits functionality from the Button class.
 */
@component
export class CapsuleButton extends Button {
  protected createDefaultVisual(): void {
    if (!this._visual) {
      const capsuleVisual: CapsuleVisual = new CapsuleVisual(this.sceneObject)
      capsuleVisual.renderMeshVisual.mainPass.blendMode = BlendMode.Normal
      capsuleVisual.capsuleSize = this.size
      this._visual = capsuleVisual
    }

    this.collider?.setSize(this.size.add(new vec3(2, 0, 0))) // breaks if auto scaling
  }

  initialize() {
    if (this._initialized) {
      return
    }

    super.initialize()

    this.collider.setSize(this.size.add(new vec3(2, 0, 0))) // breaks if auto scaling
  }

  get size() {
    return this._size
  }

  set size(size: vec3) {
    this._size = size
    this._visual.size = size
    this.collider?.setSize(this.size.add(new vec3(2, 0, 0)))
  }
}
