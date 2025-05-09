import {ExhaustControls} from "./ExhaustControls"
import {validate} from "../../../Utils/validate"

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

  exhaustControl: ExhaustControls | null = null

  private noseConeBackingImages: Map<string, Image> = new Map()
  private bodyTubeBackingImages: Map<string, Image> = new Map()
  private finsBackingImages: Map<string, Image> = new Map()

  private activeBackingTexture: Texture = requireAsset(
    "../../../Assets/Textures/Rectangle-Active.png"
  ) as Texture
  private inactiveBackingTexture: Texture = requireAsset(
    "../../../Assets/Textures/Rectangle-Inactive.png"
  ) as Texture

  onAwake(): void {
    this.setUpRocket()
  }

  private setUpRocket = (): void => {
    for (let i = 0; i < this.allRocketParts.length; i++) {
      if (this.allRocketParts[i].name === "Space Age Nose Cone") {
        this.topSection = this.allRocketParts[i].instantiate(this.rocket)
      }
      if (this.allRocketParts[i].name === "Space Age Body Tube") {
        this.middleSection = this.allRocketParts[i].instantiate(this.rocket)
      }
      if (this.allRocketParts[i].name === "Space Age Fins") {
        this.bottomSection = this.allRocketParts[i].instantiate(this.rocket)
      }
    }
  }

  setRocketPartSection = (style: string, item: string): void => {
    if (isNull(this.topSection)) throw new Error("Top section is null!")
    if (isNull(this.middleSection)) throw new Error("Middle section is null!")
    if (isNull(this.bottomSection)) throw new Error("Bottom section is null!")

    const combinedName = style + " " + item
    let rocketPart

    if (item === "Nose Cone") {
      if (this.topSection !== null) this.topSection.destroy()
      for (let i = 0; i < this.allRocketParts.length; i++) {
        if (combinedName === this.allRocketParts[i].name) {
          rocketPart = this.allRocketParts[i].instantiate(this.rocket)
        }
      }
      if (rocketPart !== undefined) {
        this.topSection = rocketPart
      } else {
        throw new Error("Rocket part is undefined!")
      }
    } else if (item === "Body Tube") {
      if (this.middleSection !== null) this.middleSection.destroy()
      for (let i = 0; i < this.allRocketParts.length; i++) {
        if (combinedName === this.allRocketParts[i].name) {
          rocketPart = this.allRocketParts[i].instantiate(this.rocket)
        }
      }
      if (rocketPart !== undefined) {
        this.middleSection = rocketPart
      } else {
        throw new Error("Rocket part is undefined!")
      }
    } else if (item === "Fins") {
      if (this.bottomSection !== null) this.bottomSection.destroy()
      for (let i = 0; i < this.allRocketParts.length; i++) {
        if (combinedName === this.allRocketParts[i].name) {
          rocketPart = this.allRocketParts[i].instantiate(this.rocket)
        }
      }
      if (rocketPart !== undefined) {
        this.bottomSection = rocketPart
      } else {
        throw new Error("Rocket part is undefined!")
      }
    }

    this.setBackingColorsByPartType(style, item)
  }

  registerRocketListItemBacking = (
    style: string,
    item: string,
    backing: Image,
  ): void => {
    if (item === "Nose Cone") {
      this.noseConeBackingImages.set(style, backing)
    } else if (item === "Body Tube") {
      this.bodyTubeBackingImages.set(style, backing)
    } else if (item === "Fins") {
      this.finsBackingImages.set(style, backing)
    }

    if (style === "Space Age") {
      backing.mainMaterial.mainPass.baseTex = this.activeBackingTexture
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
    this.exhaustControl = this.bottomSection.getComponent(
      ExhaustControls.getTypeName(),
    )
  }
}
