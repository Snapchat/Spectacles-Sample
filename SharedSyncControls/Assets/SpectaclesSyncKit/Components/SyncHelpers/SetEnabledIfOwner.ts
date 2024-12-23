import {NetworkRootInfo} from "../../Core/NetworkRootInfo"
import {findNetworkRoot} from "../../Core/NetworkUtils"
import {SessionController} from "../../Core/SessionController"
import {SyncEntity} from "../../Core/SyncEntity"

/**
 * Enables or disables groups of SceneObjects whenever ownership of the SyncEntity changes.
 * When the SyncEntity becomes owned by the local user, the objects in nonOwnerObjects become disabled, and
 * objects in ownerObjects become enabled.
 * When the SyncEntity becomes not owned by the local user, the objects in ownerObjects become disabled, and
 * objects in nonOwnerObjects become enabled.
 */
@component
export class SetEnabledIfOwner extends BaseScriptComponent {
  @ui.group_start("Entity Target")
  @input("string", "SyncEntity")
  @widget(
    new ComboBoxWidget([
      new ComboBoxItem("Sync Entity", "SyncEntity"),
      new ComboBoxItem("Network Root", "NetworkRoot"),
    ])
  )
  @label("Target Type")
  private readonly targetTypeString: "SyncEntity" | "NetworkRoot" = "SyncEntity"

  @input()
  @showIf("targetTypeString", "SyncEntity")
  private readonly syncEntityScript: ScriptComponent

  @ui.group_end
  @input
  private readonly ownerObjects: SceneObject[]

  @input
  private readonly nonOwnerObjects: SceneObject[]

  private syncEntity: SyncEntity | null

  private networkRoot: NetworkRootInfo | null

  onAwake() {
    this.createEvent("OnStartEvent").bind(() => this.init())
  }

  /**
   *
   * @param {SceneObject[]} objects
   * @param {boolean} enabled
   */
  setAllEnabled(objects: SceneObject[], enabled: boolean) {
    for (let i = 0; i < objects.length; i++) {
      objects[i].enabled = enabled
    }
  }

  /**
   *
   * @param {ConnectedLensModule.UserInfo} ownerInfo
   */
  updateOwner(ownerInfo: ConnectedLensModule.UserInfo) {
    const isOwner =
      SessionController.getInstance().isLocalUserConnection(ownerInfo)
    if (isOwner) {
      this.setAllEnabled(this.nonOwnerObjects, false)
      this.setAllEnabled(this.ownerObjects, true)
    } else {
      this.setAllEnabled(this.ownerObjects, false)
      this.setAllEnabled(this.nonOwnerObjects, true)
    }
  }

  init() {
    switch (this.targetTypeString) {
      case "SyncEntity":
        this.syncEntity = SyncEntity.getSyncEntityOnComponent(
          this.syncEntityScript
        )
        this.syncEntity.onOwnerUpdated.add(this.updateOwner)
        this.updateOwner(this.syncEntity.ownerInfo)
        break
      case "NetworkRoot":
        this.networkRoot = findNetworkRoot(this.getSceneObject())
        if (this.networkRoot) {
          this.updateOwner(this.networkRoot.ownerInfo)
        }
        break
    }
  }
}