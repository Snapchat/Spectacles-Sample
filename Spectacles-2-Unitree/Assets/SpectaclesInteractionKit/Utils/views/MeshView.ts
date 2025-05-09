import * as color from "../color"

import View, {ViewConfig} from "./View"

import {aabb} from "../aabb"
import {Spatial} from "../Spatial"

// import * as color from "../../util/color"

// import {Asset, Component, vec3, vec4} from "../../platform/LensCore"
// import View, {ViewConfig} from "../View"

// import {Spatial} from "../../Spatial/Spatial"
// import {aabb} from "../../primitives/aabb"

/**
 * The config for the MeshView
 */
export type MeshViewConfig = ViewConfig & {
  mesh: RenderMesh
  material?: Material
  renderOrder?: number
  texture?: Texture
}

/**
 * A subclass of View that has a RenderMeshVisual Component.
 * You must provide the RenderMesh and Material via the MeshViewConfig.
 * NOTE: that the blendMode is set to `0` on the material by default.
 *       This is almost always the right choice, and it's easy to change
 *       it to something else if your usecase is different
 */
export default class MeshView extends View<MeshViewConfig> implements Spatial {
  private component: RenderMeshVisual

  get aabbMin(): vec3 {
    return this.component.mesh.aabbMin
  }
  get aabbMax(): vec3 {
    return this.component.mesh.aabbMax
  }

  get aabbSize(): vec3 {
    return this.component.mesh.aabbMax.sub(this.component.mesh.aabbMin)
  }

  get worldAabbMax(): vec3 {
    return this.worldPosition.add(this.component.mesh.aabbMax)
  }

  get worldAabbMin(): vec3 {
    return this.worldPosition.add(this.component.mesh.aabbMin)
  }

  get worldAabbSize(): vec3 {
    return this.worldAabbMax.sub(this.worldAabbMin)
  }

  get material() {
    return this.component.mainMaterial
  }

  get mainPass() {
    return this.component.mainPass
  }

  getAABB(): aabb {
    return {min: this.component.mesh.aabbMin, max: this.component.mesh.aabbMax}
  }

  getWorldAABB(): aabb {
    return {
      min: this.component.worldAabbMin(),
      max: this.component.worldAabbMax(),
    }
  }

  /**
   * @inheritdoc
   */
  override setAlpha(a: number) {
    super.setAlpha(a)
    if (
      this.component.mainPass !== undefined &&
      this.component.mainPass.baseColor !== undefined
    ) {
      // otherwise, set the alpha directly
      this.component.mainPass.baseColor = color.withAlpha(
        this.component.mainPass.baseColor,
        a
      )
    }
  }

  constructor(config: MeshViewConfig) {
    super(config)
    this.component = this.container.createComponent(
      "Component.RenderMeshVisual"
    )

    let material
    if (this.config.material) {
      material = this.config.material.clone()
    } else {
      throw new Error("No material specified.")
    }

    this.component.mesh = config.mesh
    this.component.mainMaterial = material

    this.component.mainMaterial.mainPass.blendMode =
      this.config.material?.mainPass.blendMode ?? 0

    if (this.config.renderOrder) {
      this.component.setRenderOrder(this.config.renderOrder)
    }

    if (this.config.texture) {
      this.component.mainMaterial.mainPass.baseTex = this.config.texture
    }
  }

  get baseColor(): vec4 {
    return this.component.mainMaterial.mainPass.baseColor
  }

  set baseColor(color: vec4) {
    this.component.mainMaterial.mainPass.baseColor = color
  }

  set renderOrder(order: number) {
    this.component.setRenderOrder(order)
  }

  /**
   * Adds a new material after cloning it. The cloned material is returned.
   * @param material the material to be added
   * @returns the cloned material
   */
  addMaterial(material: Material): Material {
    // Clones material so we can modify it within this MeshView only - otherwise changing this will modify all instances of the material
    let clonedMaterial = material.clone()
    this.component.addMaterial(clonedMaterial)
    return clonedMaterial
  }

  getMaterialByIndex(index: number): Material {
    return this.component.getMaterial(index)
  }

  getMaterialsCount(): number {
    return this.component.getMaterialsCount()
  }

  clearMaterials() {
    this.component.clearMaterials()
  }

  updateMesh(mesh: RenderMesh) {
    this.component.mesh = mesh
  }
}
