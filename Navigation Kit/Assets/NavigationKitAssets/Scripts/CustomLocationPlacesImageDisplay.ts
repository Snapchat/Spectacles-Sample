import Event from "SpectaclesInteractionKit.lspkg/Utils/Event"
import {LensConfig} from "SpectaclesInteractionKit.lspkg/Utils/LensConfig"
import {UpdateDispatcher} from "SpectaclesInteractionKit.lspkg/Utils/UpdateDispatcher"
import {CustomLocationPlace} from "SpectaclesNavigationKit.lspkg/NavigationDataComponent/CustomLocationPlace"
import {NavigationDataComponent} from "SpectaclesNavigationKit.lspkg/NavigationDataComponent/NavigationDataComponent"
import {Place} from "SpectaclesNavigationKit.lspkg/NavigationDataComponent/Place"
import {UserPosition} from "SpectaclesNavigationKit.lspkg/NavigationDataComponent/UserPosition"

/**
 * This script keeps a binding between {@link CustomLocationPlace} and a {@link Texture} so that when the user is close to a
 * place a prompt image can be displayed to the user to help guide them the final few steps.
 */
@component
export class CustomLocationPlacesImageDisplay extends BaseScriptComponent {
  private updateDispatcher: UpdateDispatcher = LensConfig.getInstance().updateDispatcher
  private userPosition: UserPosition
  private placeToImage: CustomLocationPlaceTexturePair[] = []
  private selectedPlace: Place

  private promptAvailableUpdate = new Event<Place | null>()
  public onPromptAvailable = this.promptAvailableUpdate.publicApi()

  private isVisibleEvent = new Event<boolean>()
  public onIsVisible = this.promptAvailableUpdate.publicApi()

  public isPromptAvailable = false

  @input private navigationComponent: NavigationDataComponent
  @input private imageRoot: SceneObject
  @input private image: Image
  @input private disableOnShow: SceneObject[]
  @input private manageEnabled = true
  @input public distanceToPrompt = 15

  public get visible(): boolean {
    return this.imageRoot.enabled
  }

  private onAwake(): void {
    this.createEvent("OnStartEvent").bind(() => {
      this.image.mainMaterial = this.image.mainMaterial.clone()
      this.userPosition = this.navigationComponent.getUserPosition()
      this.navigationComponent.onNavigationStarted((place) => {
        this.selectedPlace = place
        this.updateImage()
      })
      this.setHasPrompt(false)
    })

    this.updateDispatcher.createUpdateEvent("UpdateEvent").bind(() => this.updateImage())
  }

  public register(customLocationPlace: CustomLocationPlace, image: Texture): void {
    this.placeToImage.push({customLocationPlace: customLocationPlace, image})
    customLocationPlace.onStatusUpdated.add(() => {
      this.updateImage()
    })
  }

  public setVisible(visible: boolean): void {
    this.imageRoot.enabled = visible
    this.disableOnShow.forEach((e) => {
      e.enabled = !visible
    })

    this.isVisibleEvent.invoke(visible)
  }

  private updateImage(): void {
    const nearbyPlaces = this.placeToImage.filter((p) => {
      const distance = this.userPosition.getDistanceTo(p.customLocationPlace)

      return (
        distance < this.distanceToPrompt &&
        !p.customLocationPlace.isTracking &&
        (isNull(this.selectedPlace) || this.selectedPlace === p.customLocationPlace)
      )
    })

    if (nearbyPlaces.length === 0) {
      this.setHasPrompt(false)
    } else if (nearbyPlaces.length === 1) {
      this.showImage(nearbyPlaces[0])
    } else {
      const orderList = nearbyPlaces.sort((a, b) => {
        return (
          this.userPosition.getDistanceTo(a.customLocationPlace) -
          this.userPosition.getDistanceTo(b.customLocationPlace)
        )
      })
      this.showImage(orderList[0])
    }
  }

  private showImage(placeTexture: CustomLocationPlaceTexturePair) {
    // LocatedAts in editor return onFound automatically which doesn't work with this feature
    if (global.deviceInfoSystem.isEditor()) {
      this.imageRoot.enabled = false
      return
    }

    const texture = placeTexture.image
    this.image.mainMaterial.mainPass.baseTex = texture
    this.setHasPrompt(true, placeTexture.customLocationPlace)
  }

  private setHasPrompt(hasPrompt: boolean, place: Place | null = null): void {
    this.isPromptAvailable = hasPrompt
    this.promptAvailableUpdate.invoke(place)
    if (this.manageEnabled) {
      this.setVisible(hasPrompt)
    }
  }
}

/**
 * Binds a {@link LocatedAtPlace} with a {@link Texture}.
 */
class CustomLocationPlaceTexturePair {
  public customLocationPlace: CustomLocationPlace
  public image: Texture
}
