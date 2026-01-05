/**
 * This class is responsible for creating and positioning grid content items based on a specified prefab and item count. It instantiates the items and arranges them vertically with a specified offset.
 */
@component
export class GridContentCreator extends BaseScriptComponent {
  @input
  itemPrefab!: ObjectPrefab

  onAwake(): void {}

  createMenu = (items, callback) => {
    const yStart = 0
    const yOffset = -5.4

    for (let i = 0; i < items.length; i++) {
      const item = this.itemPrefab.instantiate(this.getSceneObject())
      const screenTransform = item.getComponent("Component.ScreenTransform")
      screenTransform.offsets.setCenter(new vec2(0, yStart + yOffset * i))

      const artistName = items[i].name.split("_")[0]
      const songName = items[i].name.split("_")[1]

      const artistNameHolder = item.getChild(0).getComponent("Text")
      artistNameHolder.text = artistName

      const songNameHolder = item.getChild(1).getComponent("Text")
      songNameHolder.text = songName

      //@ts-ignore
      item.getComponent("ScriptComponent").index = i
      //@ts-ignore
      print(item.getComponent("ScriptComponent").index)

      item.enabled = true
    }
  }
}
