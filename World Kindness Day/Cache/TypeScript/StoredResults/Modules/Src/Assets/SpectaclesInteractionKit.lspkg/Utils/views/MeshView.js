"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const color = require("../color");
const View_1 = require("./View");
/**
 * A subclass of View that has a RenderMeshVisual Component.
 * You must provide the RenderMesh and Material via the MeshViewConfig.
 * NOTE: that the blendMode is set to `0` on the material by default.
 *       This is almost always the right choice, and it's easy to change
 *       it to something else if your usecase is different
 */
class MeshView extends View_1.default {
    get aabbMin() {
        return this.component.mesh.aabbMin;
    }
    get aabbMax() {
        return this.component.mesh.aabbMax;
    }
    get aabbSize() {
        return this.component.mesh.aabbMax.sub(this.component.mesh.aabbMin);
    }
    get worldAabbMax() {
        return this.worldPosition.add(this.component.mesh.aabbMax);
    }
    get worldAabbMin() {
        return this.worldPosition.add(this.component.mesh.aabbMin);
    }
    get worldAabbSize() {
        return this.worldAabbMax.sub(this.worldAabbMin);
    }
    get material() {
        return this.component.mainMaterial;
    }
    get mainPass() {
        return this.component.mainPass;
    }
    getAABB() {
        return { min: this.component.mesh.aabbMin, max: this.component.mesh.aabbMax };
    }
    getWorldAABB() {
        return {
            min: this.component.worldAabbMin(),
            max: this.component.worldAabbMax()
        };
    }
    /**
     * @inheritdoc
     */
    setAlpha(a) {
        super.setAlpha(a);
        if (this.component.mainPass !== undefined && this.component.mainPass.baseColor !== undefined) {
            // otherwise, set the alpha directly
            this.component.mainPass.baseColor = color.withAlpha(this.component.mainPass.baseColor, a);
        }
    }
    constructor(config) {
        super(config);
        this.component = this.container.createComponent("Component.RenderMeshVisual");
        let material;
        if (this.config.material) {
            material = this.config.material.clone();
        }
        else {
            throw new Error("No material specified.");
        }
        this.component.mesh = config.mesh;
        this.component.mainMaterial = material;
        this.component.mainMaterial.mainPass.blendMode = this.config.material?.mainPass.blendMode ?? 0;
        if (this.config.renderOrder) {
            this.component.setRenderOrder(this.config.renderOrder);
        }
        if (this.config.texture) {
            this.component.mainMaterial.mainPass.baseTex = this.config.texture;
        }
    }
    get baseColor() {
        return this.component.mainMaterial.mainPass.baseColor;
    }
    set baseColor(color) {
        this.component.mainMaterial.mainPass.baseColor = color;
    }
    set renderOrder(order) {
        this.component.setRenderOrder(order);
    }
    /**
     * Adds a new material after cloning it. The cloned material is returned.
     * @param material the material to be added
     * @returns the cloned material
     */
    addMaterial(material) {
        // Clones material so we can modify it within this MeshView only - otherwise changing this will modify all instances of the material
        const clonedMaterial = material.clone();
        this.component.addMaterial(clonedMaterial);
        return clonedMaterial;
    }
    getMaterialByIndex(index) {
        return this.component.getMaterial(index);
    }
    getMaterialsCount() {
        return this.component.getMaterialsCount();
    }
    clearMaterials() {
        this.component.clearMaterials();
    }
    updateMesh(mesh) {
        this.component.mesh = mesh;
    }
}
exports.default = MeshView;
//# sourceMappingURL=MeshView.js.map