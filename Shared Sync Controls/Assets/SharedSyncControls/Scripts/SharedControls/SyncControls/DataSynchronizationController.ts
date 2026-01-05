import {SessionController} from "SpectaclesSyncKit.lspkg/Core/SessionController"
import {ColorControl} from "../ColorControl/ColorControl"
import {ValueControl} from "../ValueControl/ValueControl"
import {ColorParams, RealtimeStoreKeys} from "./RealtimeStoreKeys"

// The DataSynchronizationController class is responsible for managing data synchronization
// between ColorControl and ValueControl objects across multiple sessions,
// ensuring real-time updates between users
export class DataSynchronizationController {
  // Identifier for the real-time data store used for synchronization
  private readonly STORE_ID: string = "SharedSyncControls"

  // Reference to the real-time data store
  private realtimeStore: GeneralDataStore

  // Flag to check if a new store was created
  private isNewStoreCreated: boolean = false

  // Constructor that initializes the controller with color and value controls
  constructor(
    private readonly colorControl: ColorControl,
    private readonly valueControl: ValueControl
  ) {}

  // Method to start the synchronization process
  start() {
    // Create or find the real-time store and initialize synchronization
    this.createRealtimeStore(() => {
      if (this.isNewStoreCreated) {
        // Store initial color and value settings if a new store was created
        this.realtimeStore.putFloat(RealtimeStoreKeys.COLOR_RED, this.colorControl.objectColor.x)
        this.realtimeStore.putFloat(RealtimeStoreKeys.COLOR_GREEN, this.colorControl.objectColor.y)
        this.realtimeStore.putFloat(RealtimeStoreKeys.COLOR_BLUE, this.colorControl.objectColor.z)
        this.realtimeStore.putFloat(RealtimeStoreKeys.VALUE, this.valueControl.counterValue)
      } else {
        // Update controls with existing store values if a store already exists
        this.colorControl.updateColor(ColorParams.x, this.realtimeStore.getFloat(RealtimeStoreKeys.COLOR_RED))
        this.colorControl.updateColor(ColorParams.y, this.realtimeStore.getFloat(RealtimeStoreKeys.COLOR_GREEN))
        this.colorControl.updateColor(ColorParams.z, this.realtimeStore.getFloat(RealtimeStoreKeys.COLOR_BLUE))
        this.valueControl.updateValue(this.realtimeStore.getFloat(RealtimeStoreKeys.VALUE))
      }

      // Subscribe to real-time store updates
      SessionController.getInstance().onRealtimeStoreUpdated.add(this.onRealtimeStoreUpdated)

      // Subscribe to changes in color control and update the real-time store accordingly
      this.colorControl.subscribeOnChanges((colorParam: ColorParams, value: number) => {
        switch (colorParam) {
          case ColorParams.x:
            this.realtimeStore.putFloat(RealtimeStoreKeys.COLOR_RED, value)
            break
          case ColorParams.y:
            this.realtimeStore.putFloat(RealtimeStoreKeys.COLOR_GREEN, value)
            break
          case ColorParams.z:
            this.realtimeStore.putFloat(RealtimeStoreKeys.COLOR_BLUE, value)
            break
        }
      })

      // Subscribe to changes in value control and update the real-time store
      this.valueControl.subscribeOnChanges((value: number) => {
        this.realtimeStore.putFloat(RealtimeStoreKeys.VALUE, value)
      })
    })
  }

  // Method to create or find an existing real-time data store
  private createRealtimeStore(onStoreCreated: () => void) {
    this.realtimeStore = this.findRealtimeStore()
    if (!this.realtimeStore) {
      this.isNewStoreCreated = true
      const storeOpts = RealtimeStoreCreateOptions.create()
      storeOpts.persistence = RealtimeStoreCreateOptions.Persistence.Persist
      storeOpts.ownership = RealtimeStoreCreateOptions.Ownership.Unowned
      storeOpts.allowOwnershipTakeOver = false
      storeOpts.storeId = this.STORE_ID
      SessionController.getInstance()
        .getSession()
        .createRealtimeStore(
          storeOpts,
          (store) => {
            this.realtimeStore = store
            onStoreCreated()
          },
          () => {}
        )
    } else {
      onStoreCreated()
    }
  }

  // Method to find an existing real-time data store with the specified store ID
  private findRealtimeStore(): GeneralDataStore | null {
    for (const store of SessionController.getInstance().getSession().allRealtimeStores) {
      if (SessionController.getInstance().getSession().getRealtimeStoreInfo(store).storeId === this.STORE_ID) {
        return store
      }
    }
    return null
  }

  // Method to handle updates to the real-time store
  private onRealtimeStoreUpdated = (
    session: MultiplayerSession,
    store: GeneralDataStore,
    key: string,
    updateInfo: ConnectedLensModule.RealtimeStoreUpdateInfo
  ) => {
    // Ignore updates from the local user to avoid unnecessary updates
    if (updateInfo.updaterInfo.connectionId === SessionController.getInstance().getLocalUserInfo().connectionId) {
      return
    }

    // Update color and value controls based on the key of the updated store entry
    switch (key) {
      case RealtimeStoreKeys.COLOR_RED:
        this.colorControl.updateColor(ColorParams.x, this.realtimeStore.getFloat(key))
        break
      case RealtimeStoreKeys.COLOR_GREEN:
        this.colorControl.updateColor(ColorParams.y, this.realtimeStore.getFloat(key))
        break
      case RealtimeStoreKeys.COLOR_BLUE:
        this.colorControl.updateColor(ColorParams.z, this.realtimeStore.getFloat(key))
        break
      case RealtimeStoreKeys.VALUE:
        this.valueControl.updateValue(this.realtimeStore.getFloat(key))
        break
    }
  }
}
