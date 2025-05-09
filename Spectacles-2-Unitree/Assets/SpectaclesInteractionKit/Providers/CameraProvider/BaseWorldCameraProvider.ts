import CameraProvider from "./CameraProvider"

/**
 * Base class that provides camera related apis
 */
export default abstract class BaseWorldCameraProvider
  implements CameraProvider
{
  protected cameraTransform!: Transform
  protected cameraComponent!: Camera

  /** @inheritDoc */
  attachSceneObject(sceneObject: SceneObject): void {
    sceneObject.setParent(this.cameraComponent.getSceneObject())
  }

  /** @inheritDoc */
  getComponent(): Camera {
    return this.cameraComponent
  }

  /** @inheritDoc */
  renderLayer(): LayerSet {
    return this.cameraComponent.renderLayer
  }

  /** @inheritdoc */
  up(): vec3 {
    return this.cameraTransform.up
  }

  /** @inheritdoc */
  right(): vec3 {
    return this.cameraTransform.right
  }

  /** @inheritDoc */
  back(): vec3 {
    return this.cameraTransform.back
  }

  /** @inheritDoc */
  forward(): vec3 {
    return this.cameraTransform.forward
  }

  /** @inheritDoc */
  getWorldPosition(): vec3 {
    return this.cameraTransform.getWorldPosition()
  }

  /** @inheritDoc */
  getTransform(): Transform {
    return this.cameraTransform
  }

  /** @inheritDoc */
  getWorldTransform(): mat4 {
    return this.cameraTransform.getWorldTransform()
  }

  /** @inheritDoc */
  getLocalScale(): vec3 {
    return this.cameraTransform.getLocalScale()
  }

  /** @inheritDoc */
  getInvertedWorldTransform(): mat4 {
    return this.cameraTransform.getInvertedWorldTransform()
  }

  /** @inheritDoc */
  screenSpaceToWorldSpace(x: number, y: number, absoluteDepth: number): vec3 {
    return this.cameraComponent.screenSpaceToWorldSpace(
      new vec2(x, y),
      absoluteDepth
    )
  }

  /** @inheritDoc */
  worldSpaceToScreenSpace(x: number, y: number, z: number): vec2 {
    return this.cameraComponent.worldSpaceToScreenSpace(new vec3(x, y, z))
  }

  /** @inheritDoc */
  enableClearColor(color: vec4): void {
    this.cameraComponent.clearColor = color
    this.cameraComponent.enableClearColor = true
  }

  /** @inheritdoc */
  getClearColor(): vec4 {
    return this.cameraComponent.clearColor
  }

  /** @inheritdoc */
  inFoV(worldPosition: vec3): boolean {
    const screenSpace = this.worldSpaceToScreenSpace(
      worldPosition.x,
      worldPosition.y,
      worldPosition.z
    )

    return (
      screenSpace.x <= 1 &&
      screenSpace.x >= 0 &&
      screenSpace.y <= 1 &&
      screenSpace.y >= 0
    )
  }

  /** @inheritdoc */
  getForwardPosition(x: number, parallelToGround = false): vec3 {
    let forwardDir = this.cameraComponent.getTransform().forward

    if (parallelToGround) {
      forwardDir.y = 0
      forwardDir = forwardDir.normalize()
    }

    return this.cameraComponent
      .getTransform()
      .getWorldPosition()
      .add(forwardDir.uniformScale(-x))
  }

  /** @inheritdoc */
  getForwardPositionParallelToGround(x: number): vec3 {
    return this.getForwardPosition(x, true)
  }
}
