import NativeLogger from "SpectaclesInteractionKit.lspkg/Utils/NativeLogger"
import {SyncKitBridge} from "SpectaclesInteractionKit.lspkg/Utils/SyncKitBridge"
import {validate} from "SpectaclesInteractionKit.lspkg/Utils/validate"
import {ExhaustControls} from "./ExhaustControls"

const TAG = "RocketConfigurator"
const log = new NativeLogger(TAG)

const ROCKET_CONFIGURATION_NOSE_CONE_VALUE_KEY = "RocketConfigurationNoseConeValue"
const ROCKET_CONFIGURATION_BODY_TUBE_VALUE_KEY = "RocketConfigurationBodyTubeValue"
const ROCKET_CONFIGURATION_FINS_VALUE_KEY = "RocketConfigurationFinsValue"

/**
 * This class is responsible for configuring the rocket by setting up its parts and managing the exhaust controls. It initializes the rocket sections and provides methods to set rocket part sections.
 *
 */
@component
export class RocketConfigurator extends BaseScriptComponent {
  @input
  rocket!: SceneObject

  @input
  allRocketParts: ObjectPrefab[] = []

  private topSection: SceneObject | null = null
  private middleSection: SceneObject | null = null
  private bottomSection: SceneObject | null = null

  private noseConeStyle: string = "Space Age"
  private bodyTubeStyle: string = "Space Age"
  private finsStyle: string = "Space Age"

  exhaustControl: ExhaustControls | null = null

  private noseConeBackingImages: Map<string, Image> = new Map()
  private bodyTubeBackingImages: Map<string, Image> = new Map()
  private finsBackingImages: Map<string, Image> = new Map()

  private activeBackingTexture: Texture = requireAsset(
    "SpectaclesInteractionKit.lspkg/Assets/Textures/Rectangle-Active.png"
  ) as Texture
  private inactiveBackingTexture: Texture = requireAsset(
    "SpectaclesInteractionKit.lspkg/Assets/Textures/Rectangle-Inactive.png"
  ) as Texture

  // Only defined if SyncKit is present within the lens project.
  private syncKitBridge = SyncKitBridge.getInstance()
  private syncEntity = this.syncKitBridge.createSyncEntity(this)

  onAwake(): void {
    if (this.syncEntity !== null) {
      this.syncEntity.notifyOnReady(this.setupConnectionCallbacks.bind(this))
    }

    this.setUpRocket()
  }

  private setupConnectionCallbacks(): void {
    if (
      this.syncEntity.currentStore.getAllKeys().find((key: string) => {
        return key === ROCKET_CONFIGURATION_NOSE_CONE_VALUE_KEY
      })
    ) {
      this.noseConeStyle = this.syncEntity.currentStore.getString(ROCKET_CONFIGURATION_NOSE_CONE_VALUE_KEY)
      this.bodyTubeStyle = this.syncEntity.currentStore.getString(ROCKET_CONFIGURATION_BODY_TUBE_VALUE_KEY)
      this.finsStyle = this.syncEntity.currentStore.getString(ROCKET_CONFIGURATION_FINS_VALUE_KEY)

      this.setUpRocket()
    } else {
      this.syncEntity.currentStore.putString(ROCKET_CONFIGURATION_NOSE_CONE_VALUE_KEY, this.noseConeStyle)
      this.syncEntity.currentStore.putString(ROCKET_CONFIGURATION_BODY_TUBE_VALUE_KEY, this.bodyTubeStyle)
      this.syncEntity.currentStore.putString(ROCKET_CONFIGURATION_FINS_VALUE_KEY, this.finsStyle)
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

    if (key === ROCKET_CONFIGURATION_NOSE_CONE_VALUE_KEY) {
      this.noseConeStyle = this.syncEntity.currentStore.getString(ROCKET_CONFIGURATION_NOSE_CONE_VALUE_KEY)
    } else if (key === ROCKET_CONFIGURATION_BODY_TUBE_VALUE_KEY) {
      this.bodyTubeStyle = this.syncEntity.currentStore.getString(ROCKET_CONFIGURATION_BODY_TUBE_VALUE_KEY)
    } else if (key === ROCKET_CONFIGURATION_FINS_VALUE_KEY) {
      this.finsStyle = this.syncEntity.currentStore.getString(ROCKET_CONFIGURATION_FINS_VALUE_KEY)
    }

    this.setUpRocket()
  }

  private updateSyncStore() {
    if (this.syncEntity !== null && this.syncEntity.isSetupFinished) {
      this.syncEntity.currentStore.putString(ROCKET_CONFIGURATION_NOSE_CONE_VALUE_KEY, this.noseConeStyle)
      this.syncEntity.currentStore.putString(ROCKET_CONFIGURATION_BODY_TUBE_VALUE_KEY, this.bodyTubeStyle)
      this.syncEntity.currentStore.putString(ROCKET_CONFIGURATION_FINS_VALUE_KEY, this.finsStyle)
    }
  }

  private setUpRocket = (): void => {
    for (let i = 0; i < this.allRocketParts.length; i++) {
      if (this.allRocketParts[i].name === this.noseConeStyle + " Nose Cone") {
        if (this.topSection !== null) this.topSection.destroy()
        this.topSection = this.allRocketParts[i].instantiate(this.rocket)
      }
      if (this.allRocketParts[i].name === this.bodyTubeStyle + " Body Tube") {
        if (this.middleSection !== null) this.middleSection.destroy()
        this.middleSection = this.allRocketParts[i].instantiate(this.rocket)
      }
      if (this.allRocketParts[i].name === this.finsStyle + " Fins") {
        if (this.bottomSection !== null) this.bottomSection.destroy()
        this.bottomSection = this.allRocketParts[i].instantiate(this.rocket)
      }
    }

    this.setBackingColors(this.noseConeBackingImages, this.noseConeStyle)
    this.setBackingColors(this.bodyTubeBackingImages, this.bodyTubeStyle)
    this.setBackingColors(this.finsBackingImages, this.finsStyle)
  }

  setRocketPartSection = (style: string, item: string): void => {
    if (isNull(this.topSection)) log.f("Top section is null!")
    if (isNull(this.middleSection)) log.f("Middle section is null!")
    if (isNull(this.bottomSection)) log.f("Bottom section is null!")

    const combinedName = style + " " + item
    let rocketPart

    if (item === "Nose Cone") {
      this.noseConeStyle = style

      if (this.topSection !== null) this.topSection.destroy()
      for (let i = 0; i < this.allRocketParts.length; i++) {
        if (combinedName === this.allRocketParts[i].name) {
          rocketPart = this.allRocketParts[i].instantiate(this.rocket)
        }
      }
      if (rocketPart !== undefined) {
        this.topSection = rocketPart
      } else {
        log.f("Rocket part is undefined!")
      }
    } else if (item === "Body Tube") {
      this.bodyTubeStyle = style

      if (this.middleSection !== null) this.middleSection.destroy()
      for (let i = 0; i < this.allRocketParts.length; i++) {
        if (combinedName === this.allRocketParts[i].name) {
          rocketPart = this.allRocketParts[i].instantiate(this.rocket)
        }
      }
      if (rocketPart !== undefined) {
        this.middleSection = rocketPart
      } else {
        log.f("Rocket part is undefined!")
      }
    } else if (item === "Fins") {
      this.finsStyle = style

      if (this.bottomSection !== null) this.bottomSection.destroy()
      for (let i = 0; i < this.allRocketParts.length; i++) {
        if (combinedName === this.allRocketParts[i].name) {
          rocketPart = this.allRocketParts[i].instantiate(this.rocket)
        }
      }
      if (rocketPart !== undefined) {
        this.bottomSection = rocketPart
      } else {
        log.f("Rocket part is undefined!")
      }
    }

    this.updateSyncStore()

    this.setBackingColorsByPartType(style, item)
  }

  registerRocketListItemBacking = (style: string, item: string, backing: Image): void => {
    if (item === "Nose Cone") {
      this.noseConeBackingImages.set(style, backing)

      if (style === this.noseConeStyle) {
        backing.mainMaterial.mainPass.baseTex = this.activeBackingTexture
      }
    } else if (item === "Body Tube") {
      this.bodyTubeBackingImages.set(style, backing)

      if (style === this.bodyTubeStyle) {
        backing.mainMaterial.mainPass.baseTex = this.activeBackingTexture
      }
    } else if (item === "Fins") {
      this.finsBackingImages.set(style, backing)

      if (style === this.finsStyle) {
        backing.mainMaterial.mainPass.baseTex = this.activeBackingTexture
      }
    }
  }

  private setBackingColorsByPartType = (style: string, item: string): void => {
    if (item === "Nose Cone") {
      this.setBackingColors(this.noseConeBackingImages, style)
    } else if (item === "Body Tube") {
      this.setBackingColors(this.bodyTubeBackingImages, style)
    } else if (item === "Fins") {
      this.setBackingColors(this.finsBackingImages, style)
    }
  }

  private setBackingColors(map: Map<string, Image>, style: string): void {
    map.forEach((image, key) => {
      if (key === style) {
        // active
        image.mainMaterial.mainPass.baseTex = this.activeBackingTexture
      } else {
        // inactive
        image.mainMaterial.mainPass.baseTex = this.inactiveBackingTexture
      }
    })
  }

  getExhaustControl = (): void => {
    validate(this.bottomSection)
    this.exhaustControl = this.bottomSection.getComponent(ExhaustControls.getTypeName())
  }
}
