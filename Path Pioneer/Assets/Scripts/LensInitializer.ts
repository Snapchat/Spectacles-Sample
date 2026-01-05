import {SprintPathData} from "./BuiltPathData"
import {PathMaker} from "./PathMaker"
import {PathWalker} from "./PathWalker"
import {TutorialController} from "./TutorialController"
import {UI} from "./UI"

@component
export class LensInitializer extends BaseScriptComponent {
  @input
  ui: UI

  @input
  tutorialController: TutorialController

  @input
  pathMaker: PathMaker

  @input
  pathWalker: PathWalker

  @input
  camSo: SceneObject

  private camTr: Transform

  private floorOffsetFromCamera = -100

  private static instance: LensInitializer

  private floorIsSet: boolean = false

  private vec3up: vec3 = vec3.up()

  private constructor() {
    super()
  }

  public static getInstance(): LensInitializer {
    if (!LensInitializer.instance) {
      throw new Error("Trying to get LensInitializer instance, but it hasn't been set.  You need to call it later.")
    }
    return LensInitializer.instance
  }

  onAwake() {
    if (!LensInitializer.instance) {
      LensInitializer.instance = this
    } else {
      throw new Error("LensInitializer already has an instance but another one is initializing. Aborting.")
    }

    this.camTr = this.camSo.getTransform()

    this.pathMaker.init()
    this.pathWalker.init()

    this.ui.getSceneObject().enabled = true

    this.tutorialController.startTutorial(() => {
      this.startHomeState()
    })
  }

  setFloorOffsetFromCamera(floorPos: vec3) {
    // Get the difference between current cam height and this Y value
    // Meaning, we take the camera's height at floor set to be the player's "height" for this path
    const camPos = this.camTr.getWorldPosition()
    const offset = floorPos.sub(camPos)
    // Because player is looking down when height is taken,
    // offset is closer than it will be (when player is looking out)
    this.floorOffsetFromCamera = offset.y - 10
    this.floorIsSet = true
  }

  getPlayerGroundPos() {
    if (!this.floorIsSet) {
      throw Error("Floor not set. You need to call it later.")
    }
    return this.camTr.getWorldPosition().add(this.vec3up.uniformScale(this.floorOffsetFromCamera))
  }

  private startHomeState() {
    this.ui.showHomeUi()
    const pathClickedRemover = this.ui.createPathClicked.add(() => {
      pathClickedRemover()
      this.pathMaker.start()
      const remover = this.pathMaker.pathMade.add((data) => {
        remover()
        if (!data.isLoop) {
          const dataSprint = data as SprintPathData
          this.pathWalker.start(
            dataSprint.splinePoints,
            dataSprint.isLoop,
            dataSprint.startObject.getTransform(),
            dataSprint.finishObject.getTransform(),
            () => {
              this.startHomeState()
            }
          )
        } else {
          this.pathWalker.start(data.splinePoints, data.isLoop, data.startObject.getTransform(), undefined, () => {
            this.startHomeState()
          })
        }
      })
    })
  }
}
