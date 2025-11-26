import {createCallback} from "../../../Utils/InspectorCallbacks"
import ReplayEvent from "../../../Utils/ReplayEvent"
import {SyncKitBridge} from "../../../Utils/SyncKitBridge"
import {Interactable} from "../../Interaction/Interactable/Interactable"

const TOGGLE_BUTTON_VALUE_KEY = "ToggleButtonValue"

/**
 * This class provides basic toggle functionality for a prefab toggle button. It manages the toggle state and provides methods to handle toggle events and update the button's visual state.
 */
@component
export class ToggleButton extends BaseScriptComponent {
  /**
   * The icon to be shown when the button is toggled on.
   */
  @input("SceneObject")
  @hint("The icon to be shown when the button is toggled on.")
  @allowUndefined
  _onIcon: SceneObject | undefined
  /**
   * The icon to be shown when the button is toggled off.
   */
  @input("SceneObject")
  @hint("The icon to be shown when the button is toggled off.")
  @allowUndefined
  _offIcon: SceneObject | undefined
  /**
   * The initial state of the button, set to true if toggled on upon lens launch.
   */
  @input
  @hint("The initial state of the button, set to true if toggled on upon lens launch.")
  private _isToggledOn: boolean = false
  /**
   * Enable this to add functions from another script to this component's callback events.
   */
  @input
  @hint("Enable this to add functions from another script to this component's callback events.")
  editEventCallbacks: boolean = false
  @ui.group_start("On State Changed Callbacks")
  @showIf("editEventCallbacks")
  /**
   * The script containing functions to be called on toggle state change.
   */
  @input("Component.ScriptComponent")
  @hint("The script containing functions to be called on toggle state change.")
  @allowUndefined
  private customFunctionForOnStateChanged: ScriptComponent | undefined
  /**
   * The names for the functions on the provided script, to be called on toggle state change.
   */
  @input
  @hint("The names for the functions on the provided script, to be called on toggle state change.")
  @allowUndefined
  private onStateChangedFunctionNames: string[] = []
  @ui.group_end
  /**
   * Relevant only to lenses that use SpectaclesSyncKit when it has SyncInteractionManager in its prefab.
   * If set to true, the ToggleButton's value will be synced whenever a new user joins the same Connected Lenses session.
   * You must also enabled isSynced on the ToggleButton's Interactable.
   */
  @ui.separator
  @ui.group_start("Sync Kit Support")
  @input
  @hint(
    "Relevant only to lenses that use SpectaclesSyncKit when it has SyncInteractionManager in its prefab. \
If set to true, the ToggleButton's value will be synced whenever a new user joins the same Connected Lenses session. \
You must also enabled isSynced on the ToggleButton's Interactable."
  )
  public isSynced: boolean = false
  @ui.group_end
  private interactable: Interactable | null = null

  // Only defined if SyncKit is present within the lens project.
  private syncKitBridge = SyncKitBridge.getInstance()
  private readonly syncEntity = this.isSynced ? this.syncKitBridge.createSyncEntity(this) : null

  private onStateChangedEvent = new ReplayEvent<boolean>()
  public readonly onStateChanged = this.onStateChangedEvent.publicApi()

  onAwake() {
    this.createEvent("OnStartEvent").bind(() => {
      this.interactable = this.getSceneObject().getComponent(Interactable.getTypeName())

      if (!this.interactable) {
        throw new Error(
          "Toggle Button requires an Interactable Component on the same Scene object in order to work - please ensure one is added."
        )
      }
      this.interactable.onTriggerEnd.add(() => {
        if (this.enabled) {
          this.toggleState()
        }
      })

      this.onStateChangedEvent.invoke(this._isToggledOn)
    })

    if (this.editEventCallbacks && this.customFunctionForOnStateChanged) {
      this.onStateChanged.add(
        createCallback<boolean>(this.customFunctionForOnStateChanged, this.onStateChangedFunctionNames)
      )
    }

    if (this.syncEntity !== null) {
      this.syncEntity.notifyOnReady(this.setupConnectionCallbacks.bind(this))
    }

    this.refreshVisual()
  }

  /**
   * Toggles the state of the button
   */
  toggle(): void {
    this.toggleState()
  }

  /**
   * @returns the icon to be shown when the button is toggled on
   */
  get onIcon(): SceneObject | null {
    return this._onIcon ?? null
  }

  /**
   * @param iconObject - the icon to be shown when the button is toggled on
   */
  set onIcon(iconObject: SceneObject) {
    this._onIcon = iconObject
    this.refreshVisual()
  }

  /**
   * @returns the icon to be shown when the button is toggled off
   */
  get offIcon(): SceneObject | null {
    return this._offIcon ?? null
  }

  /**
   * @param iconObject - the icon to be shown when the button is toggled off
   */
  set offIcon(iconObject: SceneObject) {
    this._offIcon = iconObject
    this.refreshVisual()
  }

  /**
   * @returns the current toggle state of the button
   */
  get isToggledOn(): boolean {
    return this._isToggledOn
  }

  /**
   * @param toggleOn - the new state of the button, invoking the toggle event if different than current state.
   */
  set isToggledOn(toggleOn: boolean) {
    // Return if the requested state is the same as the current state (no change)
    if (toggleOn === this._isToggledOn) {
      return
    }
    this.toggleState()
  }

  private refreshVisual() {
    if (this._onIcon !== undefined) {
      this._onIcon.enabled = this._isToggledOn
    }

    if (this._offIcon !== undefined) {
      this._offIcon.enabled = !this._isToggledOn
    }
  }

  private toggleState(shouldSync: boolean = true) {
    this._isToggledOn = !this._isToggledOn

    if (shouldSync) {
      this.updateSyncStore()
    }

    this.refreshVisual()
    this.onStateChangedEvent.invoke(this._isToggledOn)
  }

  private setupConnectionCallbacks(): void {
    if (
      this.syncEntity.currentStore.getAllKeys().find((key: string) => {
        return key === TOGGLE_BUTTON_VALUE_KEY
      })
    ) {
      if (this.syncEntity.currentStore.getBool(TOGGLE_BUTTON_VALUE_KEY) !== this._isToggledOn) {
        this.toggleState(false)
      }
    } else {
      this.syncEntity.currentStore.putBool(TOGGLE_BUTTON_VALUE_KEY, this.isToggledOn)
    }

    this.syncEntity.storeCallbacks.onStoreUpdated.add(this.processStoreUpdate.bind(this))
  }

  private processStoreUpdate(
    _session: MultiplayerSession,
    store: GeneralDataStore,
    key: string,
    info: ConnectedLensModule.RealtimeStoreUpdateInfo
  ) {
    const connectionId = info.updaterInfo.connectionId
    const updatedByLocal = connectionId === this.syncKitBridge.sessionController.getLocalConnectionId()

    if (updatedByLocal) {
      return
    }

    if (key === TOGGLE_BUTTON_VALUE_KEY) {
      if (store.getBool(key) === this._isToggledOn) {
        return
      }

      this.toggleState(false)
    }
  }

  private updateSyncStore() {
    if (this.syncEntity !== null && this.syncEntity.isSetupFinished) {
      this.syncEntity.currentStore.putBool(TOGGLE_BUTTON_VALUE_KEY, this.isToggledOn)
    }
  }
}
