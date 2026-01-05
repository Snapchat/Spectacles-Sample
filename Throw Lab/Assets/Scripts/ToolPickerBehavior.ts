@component
export class ToolPickerBehavior extends BaseScriptComponent {
  @input
  public toolPrefabs: ObjectPrefab[]

  @input
  public toolSpawnPoints: SceneObject[]
  public toolSpawnPointsT: Transform[]

  private latestObj: SceneObject[]
  private latestObjT: Transform[]

  private yOffset = 5
  private distanceOffset = 15

  @input
  public containerObj: SceneObject

  onAwake() {
    this.init()
    this.createEvent("UpdateEvent").bind(this.onUpdate.bind(this))
  }

  init() {
    this.toolSpawnPointsT = []
    this.latestObj = []
    this.latestObjT = []
    this.spanwAllTools()
  }

  spanwAllTools() {
    this.toolSpawnPoints.forEach((value, ind) => {
      const spawnPoint = value
      this.toolSpawnPointsT[ind] = spawnPoint.getTransform()
      this.spawnAndReplace(ind)
    })
  }

  onUpdate() {
    this.toolSpawnPoints.forEach((value, ind) => {
      try {
        const spawnPointT = this.toolSpawnPointsT[ind]
        const objectT = this.latestObjT[ind]

        // Check if object still exists (might have been destroyed by GrabbableObject)
        if (!objectT) {
          this.spawnAndReplace(ind)
          return
        }

        // Try to get scene object - if it fails, object was destroyed
        const sceneObj = objectT.getSceneObject()
        if (!sceneObj) {
          this.spawnAndReplace(ind)
          return
        }

        // Check distance
        const objPos = objectT.getWorldPosition()
        const spawnPos = spawnPointT.getWorldPosition()

        if (objPos.distance(spawnPos) > this.distanceOffset) {
          sceneObj.setParent(null)
          this.spawnAndReplace(ind)
        }
      } catch (e) {
        // Object was destroyed mid-update, spawn a new one
        print(`ToolPickerBehavior: Object at index ${ind} was destroyed, respawning`)
        this.spawnAndReplace(ind)
      }
    })
  }

  spawnAndReplace(ind) {
    const spawnPos = this.toolSpawnPointsT[ind].getWorldPosition()
    spawnPos.y += this.yOffset

    const nObject = this.toolPrefabs[ind].instantiate(this.containerObj)
    nObject.enabled = true
    nObject.getTransform().setWorldPosition(spawnPos)
    nObject.getTransform().setWorldRotation(this.toolSpawnPointsT[ind].getWorldRotation())

    this.latestObj[ind] = nObject
    this.latestObjT[ind] = nObject.getTransform()
  }
}
