import NativeLogger from "SpectaclesInteractionKit.lspkg/Utils/NativeLogger"
import {RocketConfigurator} from "./RocketConfigurator"
import {RocketScrollViewItem} from "./RocketScrollViewItem"

const TAG = "RocketGridContentCreator"
const log = new NativeLogger(TAG)

const Y_START: number = 0
const Y_OFFSET: number = -5.4

/**
 * This class is responsible for creating and initializing the content of a rocket grid. It uses object prefabs to instantiate items and configure their positions and properties.
 *
 */
@component
export class RocketGridContentCreator extends BaseScriptComponent {
  @input
  rocketConfigurator!: RocketConfigurator

  @input
  objectPrefabs: ObjectPrefab[] = []

  onAwake(): void {
    if (isNull(this.rocketConfigurator)) {
      log.f("RocketGridContentCreator: rocketConfigurator is null!")
    }
    if (this.objectPrefabs.length === 0) {
      log.f("RocketGridContentCreator: objectPrefabs array is empty!")
    }

    const sceneObj = this.getSceneObject()
    const rocketScrollViewItemTypeName = RocketScrollViewItem.getTypeName()

    for (let i = 0; i < this.objectPrefabs.length; i++) {
      const prefabIndex = i % this.objectPrefabs.length
      const prefab = this.objectPrefabs[prefabIndex]
      const item = prefab.instantiate(sceneObj)
      const screenTransform = item.getComponent("Component.ScreenTransform")
      screenTransform.offsets.setCenter(new vec2(0, Y_START + Y_OFFSET * i))
      item.enabled = true
      const rocketScrollViewItem: RocketScrollViewItem | null = item.getComponent(rocketScrollViewItemTypeName)
      if (rocketScrollViewItem !== null) rocketScrollViewItem.init(this.rocketConfigurator)
    }
  }
}
