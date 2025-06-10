import {Interactable} from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable"
import {LensConfig} from "SpectaclesInteractionKit.lspkg/Utils/LensConfig"
import {UpdateDispatcher} from "SpectaclesInteractionKit.lspkg/Utils/UpdateDispatcher"
import {CustomLocationPlace} from "SpectaclesNavigationKit.lspkg/NavigationDataComponent/CustomLocationPlace"
import {NavigationDataComponent} from "SpectaclesNavigationKit.lspkg/NavigationDataComponent/NavigationDataComponent"
import {Place} from "SpectaclesNavigationKit.lspkg/NavigationDataComponent/Place"
import {UserPosition} from "SpectaclesNavigationKit.lspkg/NavigationDataComponent/UserPosition"
import {CustomLocationPlacesImageDisplay} from "./CustomLocationPlacesImageDisplay"
import {LoadingRotator} from "./LoadingRotator"

/**
 * This script handles an individual entry in the list of {@link Place}s created by {@link PlaceListCreator}.
 */
@component
export class PlaceListItem extends BaseScriptComponent {
  private updateDispatcher: UpdateDispatcher = LensConfig.getInstance().updateDispatcher
  private status: PlaceStatus = PlaceStatus.idle
  private imageDisplay: CustomLocationPlacesImageDisplay
  private userPosition: UserPosition
  private promptHover = false

  @input private nameText: Text
  @input private description: Text
  @input private image: Image
  @input private interactable: Interactable
  @input private loadingIndicator: LoadingRotator
  @input private promptButton: Interactable
  @input private promptImage: Image
  @input private backgroundImage: Image

  @input("vec4", "{0.28, 0.28, 0.28, 1}")
  @hint("The color applied to Interactables when an Interactor is hovering over it.")
  @widget(new ColorWidget())
  private promptHoverColor: vec4 = new vec4(0.28, 0.28, 0.28, 1)

  @input private idleImage: Texture
  @input private activeImage: Texture
  @input private completedImage: Texture

  @input private promptAvailableImage: Texture
  @input private promptActiveImage: Texture

  @input private backgroundNeutral: Texture
  @input private backgroundHover: Texture

  public place: Place

  public set hover(value: boolean) {
    this.backgroundImage.mainMaterial.mainPass.baseTex = value ? this.backgroundHover : this.backgroundNeutral
  }

  public initialize(
    place: Place,
    navigationComponent: NavigationDataComponent,
    imageDisplay: CustomLocationPlacesImageDisplay | null = null,
  ): void {
    this.userPosition = navigationComponent.getUserPosition()

    this.place = place

    this.updateTitle(true)
    this.updateDescription()

    this.image.mainMaterial = this.image.mainMaterial.clone()
    this.imageDisplay = imageDisplay
    this.backgroundImage.mainMaterial = this.backgroundImage.mainMaterial.clone()
    this.promptImage.mainMaterial = this.promptImage.mainMaterial.clone()

    this.interactable.onTriggerEnd.add(() => {
      if (this.status === PlaceStatus.active) {
        navigationComponent.stopNavigation()
      } else {
        this.status = PlaceStatus.active

        navigationComponent.navigateToPlace(place)
        place.visited = false
      }
      this.hover = false
    })
    this.interactable.onHoverEnter.add(() => {
      this.hover = true
    })
    this.interactable.onHoverExit.add(() => {
      this.hover = false
    })
    this.promptButton.onHoverEnter.add(() => {
      print("prompt hover true")
      this.promptHover = true
    })
    this.promptButton.onHoverExit.add(() => {
      print("prompt hover false")
      this.promptHover = false
    })
    this.place.onStatusUpdated.add(() => this.updateDisplay())

    navigationComponent.onArrivedAtPlace((place) => this.arriveAtPlace(place))
    navigationComponent.onNavigationStarted((place) => this.newNavigationTarget(place))

    if (!isNull(imageDisplay)) {
      imageDisplay.onPromptAvailable.add((place) => this.checkPromptStatus(place))
    }

    this.promptButton.sceneObject.enabled = false
    this.promptButton.onTriggerEnd.add(() => {
      this.imageDisplay.setVisible(!this.imageDisplay.visible)
      this.updateDisplay()
    })
    this.loadingIndicator.enabled = false
    this.loadingIndicator.sceneObject.enabled = false

    const CustomLocationPlace = place as CustomLocationPlace
    if (!isNull(CustomLocationPlace.locatedAt)) {
      this.updateDispatcher.createUpdateEvent("UpdateEvent").bind(() => {
        const enabledAndNotReady = CustomLocationPlace.locatedAt.sceneObject.enabled && !CustomLocationPlace.ready
        this.loadingIndicator.enabled = enabledAndNotReady
        this.loadingIndicator.sceneObject.enabled = enabledAndNotReady
      })
    }

    this.createEvent("OnEnableEvent").bind(() => this.updateDisplay())
    this.updateDispatcher.createUpdateEvent("UpdateEvent").bind(() => {
      this.updateDisplay()
    })
  }

  private arriveAtPlace(place: Place): void {
    if (this.place === place) {
      this.status = PlaceStatus.completed
      this.updateDisplay()
    }
  }

  private newNavigationTarget(place: Place): void {
    if (this.status === PlaceStatus.completed) {
      return
    }

    if (this.place === place) {
      this.status = PlaceStatus.active
    } else {
      this.status = PlaceStatus.idle
    }

    this.updateDisplay()
  }

  private updateDisplay(): void {
    this.updateTitle(true)
    this.updateDescription()

    const isVisible = isNull(this.imageDisplay?.visible) || this.imageDisplay.visible

    this.promptImage.mainMaterial.mainPass.baseColor = this.promptHover ? this.promptHoverColor : new vec4(1, 1, 1, 1)
    this.promptImage.mainMaterial.mainPass.baseTex = isVisible ? this.promptActiveImage : this.promptAvailableImage

    switch (this.status) {
      case PlaceStatus.idle:
        this.image.mainMaterial.mainPass.baseTex = this.idleImage
        return
      case PlaceStatus.active:
        this.image.mainMaterial.mainPass.baseTex = this.activeImage
        return
      case PlaceStatus.completed:
        this.image.mainMaterial.mainPass.baseTex = this.completedImage
        return

      default:
        throw new Error("Unexpected status in button.")
    }
  }

  private checkPromptStatus(place: Place): void {
    this.promptButton.sceneObject.enabled = place === this.place
  }

  private getFormattedDistance(distance: number | null): string {
    let result = ""

    if (isNull(distance)) {
      return result
    }

    if (distance < 1000) {
      result = distance.toFixed(0) + "m"
    } else {
      result = (distance / 1000).toFixed(1) + "km"
    }

    return "(" + result + ")"
  }

  private updateTitle(withDistance: boolean = false): void {
    const nameText = this.place.name ?? "Place"
    const distanceText = withDistance
      ? " " + this.getFormattedDistance(this.userPosition.getDistanceTo(this.place))
      : ""
    this.nameText.text = nameText + distanceText
  }

  private updateDescription(withDistance: boolean = false): void {
    const distanceText = withDistance
      ? " " + this.getFormattedDistance(this.userPosition.getDistanceTo(this.place))
      : ""
    if (isNull(this.place.description)) {
      this.description.text = distanceText
    } else {
      this.description.text = this.place.description + distanceText
    }
  }
}

enum PlaceStatus {
  idle,
  active,
  completed,
}
