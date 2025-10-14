import animate, {CancelFunction} from "SpectaclesInteractionKit.lspkg/Utils/animate"
import {lerp} from "SpectaclesInteractionKit.lspkg/Utils/mathUtils"

// This file provides utility functions for managing and animating the
// alpha (transparency) values of scene objects in a virtual environment

// Retrieves the main passes of a scene object's render mesh or image component
export const getPasses = (object: SceneObject): Pass[] | null => {
  const meshComponent = object.getComponents("Component.RenderMeshVisual")
  const imageComponent = object.getComponents("Component.Image")
  if (meshComponent.length > 0) {
    const mesh = <RenderMeshVisual>(
      object.getComponent("Component.RenderMeshVisual")
    )
    const res: Pass[] = []
    for (let i: number = 0; i < mesh.getMaterialsCount(); ++i) {
      res.push(mesh.getMaterial(i).mainPass)
    }
    return res
  } else if (imageComponent.length > 0) {
    const image = <Image>object.getComponent("Component.Image")
    return [image.mainMaterial.mainPass]
  }
  return null
}

// Sets the alpha value for a scene object and its children recursively
export const setAlpha = (object: SceneObject, alpha: number): void => {
  const pass = getPasses(object)
  if (pass) {
    pass.forEach((value) => {
      const baseColor: vec4 = value.baseColor
      if (baseColor) {
        baseColor.a = alpha
        value.baseColor = baseColor
      }
    })
  } else if (object.getComponents("Component.Text").length > 0) {
    const text = <Text>object.getComponent("Component.Text")
    const baseColor: vec4 = text.textFill.color
    baseColor.a = alpha
    text.textFill.color = baseColor
    if (text.outlineSettings.enabled) {
      text.outlineSettings.fill.color = baseColor
    }
  }

  // Recursively set alpha for child objects
  for (let i = 0; i < object.getChildrenCount(); ++i) {
    const child = object.getChild(i)
    setAlpha(child, alpha)
  }
}

// Animates the alpha value of a scene object from a start value to an end value
export function animateToAlpha(
  target: SceneObject,
  from: number,
  to: number,
  duration: number,
  onComplete: () => void = () => {}
): CancelFunction {
  return animate({
    update: (t: number) => {
      const currentAlpha = lerp(from, to, t)
      setAlpha(target, currentAlpha)
    },
    start: 0,
    end: 1,
    duration: duration,
    ended: onComplete,
  })
}


