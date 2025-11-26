import {InteractionManager} from "./Core/InteractionManager/InteractionManager"
import {CursorControllerProvider} from "./Providers/CursorControllerProvider/CursorControllerProvider"
import {HandInputData} from "./Providers/HandInputData/HandInputData"
import {InteractionConfigurationProvider} from "./Providers/InteractionConfigurationProvider/InteractionConfigurationProvider"
import SIKLogLevelProvider from "./Providers/InteractionConfigurationProvider/SIKLogLevelProvider"
import {MobileInputData} from "./Providers/MobileInputData/MobileInputData"

export type SIKAPI = typeof SIK

export const SIK = {
  get SIKLogLevelProvider() {
    return SIKLogLevelProvider.getInstance()
  },
  get InteractionConfiguration() {
    return InteractionConfigurationProvider.getInstance()
  },
  get HandInputData() {
    return HandInputData.getInstance()
  },
  get MobileInputData() {
    return MobileInputData.getInstance()
  },
  get InteractionManager() {
    return InteractionManager.getInstance()
  },
  get CursorController() {
    return CursorControllerProvider.getInstance()
  }
}

export default SIK
