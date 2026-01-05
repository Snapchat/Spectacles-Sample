import {LocatedObject} from "./LocatedObject"

/**
 * Tracks the users position and calls activate and deactivate functions on
 * attached listeners.
 */
@component
export class ActivateWhenInCameraView extends BaseScriptComponent {
  @input camera!: Camera
  @input
  @allowUndefined
  @hint("Optional SceneObject to use as center, will use the center of this SceneObject otherwise")
  centerReference: SceneObject
  @input("Component.ScriptComponent[]")
  listenerObjects: LocatedObject[]
  @ui.separator
  @input
  sphereInViewForActivationRadius: number = 600
  @input distanceForActivation: number = 1000
  @input deActivateDistanceMultiplier: number = 1.5

  private locatedAt: LocatedAtComponent = null
  private distanceForDeActivation: number
  private centerReferenceTransform = null

  private didLocalize: boolean = false
  private isActive: boolean = false

  private viewSphereColor: vec4 = new vec4(
    0.25 + Math.random() * 0.75,
    0.25 + Math.random() * 0.75,
    0.25 + Math.random() * 0.75,
    1.0
  )

  onAwake() {
    this.locatedAt = this.getSceneObject().getComponent("LocatedAtComponent")

    this.locatedAt.onFound.add(() => {
      this.didLocalize = true
      print("Localized " + this.getSceneObject().name)

      this.listenerObjects.forEach((element: LocatedObject) => {
        if (element.localize) {
          element.localize()
        }
      })
    })

    this.distanceForDeActivation = this.distanceForActivation * this.deActivateDistanceMultiplier

    this.centerReferenceTransform = this.getSceneObject().getTransform()
    if (this.centerReference) {
      this.centerReferenceTransform = this.centerReference.getTransform()
    }

    this.createEvent("UpdateEvent").bind(() => {
      let isLocalized = this.didLocalize
      if (global.deviceInfoSystem.isEditor()) {
        isLocalized = true
      }

      const cameraPos = this.camera.getTransform().getWorldPosition()
      const p = this.centerReferenceTransform.getWorldPosition()

      const cameraDistance2D = new vec2(p.x, p.z).distance(new vec2(cameraPos.x, cameraPos.z))

      if (this.isActive) {
        if (cameraDistance2D > this.distanceForDeActivation) {
          this.isActive = false
          this.listenerObjects.forEach((element: LocatedObject) => {
            if (element.deactivate) {
              element.deactivate()
            }
          })
        }
      } else {
        if (cameraDistance2D < this.distanceForActivation && isLocalized) {
          if (this.camera.isSphereVisible(p, this.sphereInViewForActivationRadius)) {
            this.isActive = true
            this.listenerObjects.forEach((element: LocatedObject) => {
              if (element.activate) {
                element.activate()
              }
            })
          }
        }
      }
    })
  }
}
