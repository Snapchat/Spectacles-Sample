import {Instantiator} from "SpectaclesSyncKit.lspkg/Components/Instantiator"
import {SessionController} from "SpectaclesSyncKit.lspkg/Core/SessionController"
import {HeadLabelObjectController} from "./HeadLabelObjectController"

@component
export class HeadLabelObjectManager extends BaseScriptComponent {
  // Static counter to track manager instances
  private static managerCount: number = 0

  @input
  instantiator: Instantiator

  @input
  headLabelPrefab: ObjectPrefab

  private myHeadLabel: HeadLabelObjectController
  private allHeadLabels: HeadLabelObjectController[] = []
  private hasInstantiated: boolean = false // Guard to prevent multiple instantiations

  // Callbacks for external systems (like HandMenu)
  private onHeadLabelReadyCallbacks: ((headLabel: HeadLabelObjectController) => void)[] = []

  onAwake() {
    this.createEvent("OnStartEvent").bind(() => this.onStart())
  }

  onStart() {
    HeadLabelObjectManager.managerCount++
    print(
      " HeadLabelManager: onStart() called - Instance ID: " +
        this.sceneObject.name +
        " - UniqueId: " +
        this.sceneObject.uniqueIdentifier
    )
    print(" HeadLabelManager: This is manager instance #" + HeadLabelObjectManager.managerCount)
    print(" HeadLabelManager: Scene object path: " + this.getSceneObjectPath())

    // Check for duplicate managers
    if (HeadLabelObjectManager.managerCount > 1) {
      print(" HeadLabelManager: WARNING - Multiple HeadLabelObjectManager instances detected!")
      print(" HeadLabelManager: This will cause duplicate head label instantiation!")
      print(" HeadLabelManager: Check your scene hierarchy for duplicate manager objects!")
    }
    SessionController.getInstance().notifyOnReady(() => {
      print(
        " HeadLabelManager: SessionController ready - Instance ID: " +
          this.sceneObject.name +
          " - UniqueId: " +
          this.sceneObject.uniqueIdentifier
      )
      this.instantiator.notifyOnReady(() => {
        print(
          " HeadLabelManager: Instantiator ready, calling instantiateHeadLabel - Instance ID: " +
            this.sceneObject.name +
            " - UniqueId: " +
            this.sceneObject.uniqueIdentifier
        )
        print(" HeadLabelManager: Instantiator object name: " + this.instantiator.sceneObject.name)
        print(
          " HeadLabelManager: Head label prefab assigned: " +
            (this.headLabelPrefab ? this.headLabelPrefab.name : "NULL")
        )
        this.instantiateHeadLabel()
      })
    })
  }

  onUpdate() {
    // Update all head labels
    this.allHeadLabels.forEach((headLabel) => {
      if (headLabel && headLabel.isLocalLabel()) {
        headLabel.onUpdate()
      }
    })
  }

  subscribe(headLabel: HeadLabelObjectController) {
    this.allHeadLabels.push(headLabel)

    if (headLabel.isLocalLabel()) {
      this.myHeadLabel = headLabel
      print(" HeadLabelManager: Subscribed to local head label")

      // Notify callbacks that local head label is ready
      this.notifyHeadLabelReady(headLabel)
    } else {
      print(" HeadLabelManager: Subscribed to remote head label")
    }

    // Start updating if this is the first subscription
    if (this.allHeadLabels.length === 1) {
      this.createEvent("UpdateEvent").bind(() => this.onUpdate())
    }
  }

  /**
   * Instantiate the head label for the local user.
   * This is called when the session is ready and the instantiator is ready.
   */
  instantiateHeadLabel() {
    // Guard against multiple instantiations
    if (this.hasInstantiated) {
      print(" HeadLabelManager: Head label already instantiated, skipping - Instance ID: " + this.sceneObject.name)
      return
    }

    const localUserInfo = SessionController.getInstance().getLocalUserInfo()
    print(` HeadLabelManager: Local user info check:`)
    print(`  LocalUserInfo exists: ${localUserInfo ? "YES" : "NO"}`)

    let displayName = "Unknown User"
    let userId = "Unknown"

    if (localUserInfo) {
      print(`  DisplayName: ${localUserInfo.displayName || "N/A"}`)
      print(`  UserId: ${localUserInfo.userId || "N/A"}`)
      print(`  ConnectionId: ${localUserInfo.connectionId || "N/A"}`)

      // Try to get display name first
      if (localUserInfo.displayName) {
        displayName = localUserInfo.displayName
        userId = localUserInfo.userId || "Unknown"
      } else if (localUserInfo.userId) {
        displayName = localUserInfo.userId
        userId = localUserInfo.userId
      }
    }

    // Fallback to getLocalUserName() if we don't have a good name
    if (displayName === "Unknown User") {
      print(` HeadLabelManager: No good name from getLocalUserInfo(), trying getLocalUserName()`)
      const userName = SessionController.getInstance().getLocalUserName()
      print(`  getLocalUserName() result: ${userName || "N/A"}`)
      if (userName) {
        displayName = userName
        userId = userName // Use same value for both
      }
    }

    print("HeadLabelManager: Instantiating head label for " + displayName + " (userId: " + userId + ")")

    // Use customDataStore to pass initial data to the prefab
    const customDataStore = GeneralDataStore.create()
    customDataStore.putString("displayName", displayName)
    customDataStore.putString("userId", userId)
    print(` HeadLabelManager: Created customDataStore with displayName="${displayName}"`)

    // Use userId-based network ID to ensure only one head label per player
    // Use "Owner" persistence so it's destroyed when player leaves
    this.hasInstantiated = true

    this.instantiator.instantiate(this.headLabelPrefab, {
      // Use userId as network ID to prevent duplicates across sessions
      //overrideNetworkId: userId + "_headLabel",
      overrideNetworkId: (localUserInfo?.connectionId || userId) + "_headLabel",
      // Use "Owner" persistence - destroyed when player leaves
      persistence: "Owner",
      // Claim ownership for this player
      claimOwnership: true,
      // Pass initial data via customDataStore (proper Connected Lenses pattern)
      customDataStore: customDataStore,
      onSuccess: (networkRoot) => {
        print(" HeadLabelManager: Head label instantiated successfully with Owner persistence")
        print(" Network ID: " + (userId + "_headLabel"))
        print(" CustomDataStore passed with displayName")
      },
      onError: (error) => {
        print(" HeadLabelManager: Error instantiating head label: " + error)
        this.hasInstantiated = false // Reset flag on error so it can be retried
      }
    })
  }

  /**
   * Get the local user's head label controller
   */
  getMyHeadLabel(): HeadLabelObjectController | null {
    return this.myHeadLabel || null
  }

  /**
   * Get all remote head labels
   */
  getAllRemoteHeadLabels(): HeadLabelObjectController[] {
    return this.allHeadLabels.filter((label) => !label.isLocalLabel())
  }

  /**
   * Update the local user's head label text
   */
  updateMyStatus(statusText: string, subStatus: string) {
    if (this.myHeadLabel) {
      this.myHeadLabel.updateStatus(statusText, subStatus)
      print(` HeadLabelManager: Updated local status - "${statusText}" / "${subStatus}"`)
    } else {
      print(" HeadLabelManager: Cannot update status - local head label not ready")
    }
  }

  /**
   * Update the local user's availability state
   */
  updateMyAvailability(availabilityState: number) {
    if (this.myHeadLabel) {
      this.myHeadLabel.updateAvailability(availabilityState)
      print(` HeadLabelManager: Updated availability state to ${availabilityState}`)
    } else {
      print(" HeadLabelManager: Cannot update availability - local head label not ready")
    }
  }

  /**
   * Subscribe to be notified when the local head label is ready
   */
  subscribeToHeadLabelReady(callback: (headLabel: HeadLabelObjectController) => void) {
    this.onHeadLabelReadyCallbacks.push(callback)

    // If head label is already ready, call the callback immediately
    if (this.myHeadLabel) {
      callback(this.myHeadLabel)
    }
  }

  private notifyHeadLabelReady(headLabel: HeadLabelObjectController) {
    this.onHeadLabelReadyCallbacks.forEach((callback) => callback(headLabel))
  }

  /**
   * Get the full path of this scene object for debugging
   */
  private getSceneObjectPath(): string {
    let path = this.sceneObject.name
    let parent = this.sceneObject.getParent()
    while (parent) {
      path = parent.name + "/" + path
      parent = parent.getParent()
    }
    return path
  }
}
