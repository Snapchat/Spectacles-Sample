import {Interactable} from "../../../Components/Interaction/Interactable/Interactable"
import {findSceneObjectByName} from "../../../Utils/SceneObjectUtils"
import {validate} from "../../../Utils/validate"
import {RocketConfigurator} from "./RocketConfigurator"

/**
 * This class represents an item in the rocket scroll view. It handles interactions and communicates with the RocketConfigurator to update the rocket configuration.
 *
 */
@component
export class RocketScrollViewItem extends BaseScriptComponent {
  @input
  style!: Text

  @input
  item!: Text

  private interactable: Interactable | null = null
  private backingImage: Image | undefined
  private rocketConfigurator: RocketConfigurator | null = null

  onAwake(): void {}

  init(rocketConfigurator: RocketConfigurator): void {
    this.rocketConfigurator = rocketConfigurator
    this.registerRocketListItemBacking()
    if (isNull(this.rocketConfigurator))
      throw new Error("RocketConfigurator is null!")
    validate(this.backingImage)
    this.interactable = this.backingImage.sceneObject.getComponent(
      Interactable.getTypeName()
    )
    if (isNull(this.interactable))
      throw new Error("Interactable component not found!")
    this.setupCallbacks()
  }

  private setupCallbacks = (): void => {
    validate(this.interactable)
    this.interactable.onTriggerEnd.add(this.onTriggerEndEvent)
  }

  private onTriggerEndEvent = (): void => {
    validate(this.rocketConfigurator)
    this.rocketConfigurator.setRocketPartSection(
      this.style.text,
      this.item.text
    )
  }

  private registerRocketListItemBacking = (): void => {
    let backingObject: SceneObject | null = findSceneObjectByName(
      this.sceneObject,
      "Background"
    )
    validate(backingObject)
    this.backingImage = backingObject.getComponent("Image")
    validate(this.backingImage, "Backing image is undefined!")
    this.backingImage.mainMaterial = this.backingImage.mainMaterial.clone()
    validate(this.rocketConfigurator)
    this.rocketConfigurator.registerRocketListItemBacking(
      this.style.text,
      this.item.text,
      this.backingImage
    )
  }
}
