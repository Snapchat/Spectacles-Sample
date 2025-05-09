import {InteractionManager as InteractionManagerProvider} from "./Core/InteractionManager/InteractionManager"
import {CursorControllerProvider} from "./Providers/CursorControllerProvider/CursorControllerProvider"
import {HandInputData as HandInputDataProvider} from "./Providers/HandInputData/HandInputData"
import {InteractionConfigurationProvider} from "./Providers/InteractionConfigurationProvider/InteractionConfigurationProvider"
import SIKLogLevelProvider from "./Providers/InteractionConfigurationProvider/SIKLogLevelProvider"
import {MobileInputData as MobileInputDataProvider} from "./Providers/MobileInputData/MobileInputData"

export interface SIKAPI {
  SIKLogLevelProvider: SIKLogLevelProvider
  InteractionConfiguration: InteractionConfigurationProvider
  HandInputData: HandInputDataProvider
  MobileInputData: MobileInputDataProvider
  InteractionManager: InteractionManagerProvider
  CursorController: CursorControllerProvider
}

export const SIK: SIKAPI = new Proxy(
  {},
  {
    get: (target, prop: keyof SIKAPI) => {
      switch (prop) {
        case "SIKLogLevelProvider":
          return SIKLogLevelProvider.getInstance()
        case "InteractionConfiguration":
          return InteractionConfigurationProvider.getInstance()
        case "HandInputData":
          return HandInputDataProvider.getInstance()
        case "MobileInputData":
          return MobileInputDataProvider.getInstance()
        case "InteractionManager":
          return InteractionManagerProvider.getInstance()
        case "CursorController":
          return CursorControllerProvider.getInstance()
        default:
          throw new Error(`Property ${String(prop)} does not exist on SIK API`)
      }
    },
  }
) as SIKAPI
