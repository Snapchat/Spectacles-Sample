import {Singleton} from "../../Decorators/Singleton"

export type CustomComponentName =
  | "Billboard"
  | "HandInteractor"
  | "HandVisual"
  | "Headlock"
  | "Interactable"
  | "InteractableManipulation"
  | "PinchButton"
  | "ScrollView"
  | "ScrollBar"
  | "Slider"
  | "ToggleButton"
  | "MouseInteractor"
  | "ContainerFrame"

/**
 * This singleton class provides methods to require and retrieve types of custom components based on their names. It uses a switch-case structure to map component names to their respective module paths.
 *
 */
@Singleton
export class InteractionConfigurationProvider {
  public static getInstance: () => InteractionConfigurationProvider

  requireType(componentName: CustomComponentName): keyof ComponentNameMap {
    switch (componentName) {
      case "Billboard":
        return requireType(
          "../../Components/Interaction/Billboard/Billboard",
        ) as keyof ComponentNameMap
      case "ContainerFrame":
        return requireType(
          "../../Components/UI/ContainerFrame/ContainerFrame",
        ) as keyof ComponentNameMap
      case "HandInteractor":
        return requireType(
          "../../Core/HandInteractor/HandInteractor",
        ) as keyof ComponentNameMap
      case "HandVisual":
        return requireType(
          "../../Components/Interaction/HandVisual/HandVisual",
        ) as keyof ComponentNameMap
      case "Headlock":
        return requireType(
          "../../Components/Interaction/Headlock/Headlock",
        ) as keyof ComponentNameMap
      case "Interactable":
        return requireType(
          "../../Components/Interaction/Interactable/Interactable",
        ) as keyof ComponentNameMap
      case "InteractableManipulation":
        return requireType(
          "../../Components/Interaction/InteractableManipulation/InteractableManipulation",
        ) as keyof ComponentNameMap
      case "PinchButton":
        return requireType(
          "../../Components/UI/PinchButton/PinchButton",
        ) as keyof ComponentNameMap
      case "ScrollView":
        return requireType(
          "../../Components/UI/ScrollView/ScrollView",
        ) as keyof ComponentNameMap
      case "ScrollBar":
        return requireType(
          "../../Components/UI/ScrollBar/ScrollBar",
        ) as keyof ComponentNameMap
      case "Slider":
        return requireType(
          "../../Components/UI/Slider/Slider",
        ) as keyof ComponentNameMap
      case "ToggleButton":
        return requireType(
          "../../Components/UI/ToggleButton/ToggleButton",
        ) as keyof ComponentNameMap
      case "MouseInteractor":
        return requireType(
          "../../Core/MouseInteractor/MouseInteractor",
        ) as keyof ComponentNameMap
      default:
        throw new Error(
          `Could not find typename for component ${componentName}`,
        )
    }
  }
}
