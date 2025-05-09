import {Singleton} from "../../Decorators/Singleton"
import LogLevelProvider from "./LogLevelProvider"

/**
 * Provides the level of logging that we want to allow from SIK types.
 */
@Singleton
export default class SIKLogLevelProvider extends LogLevelProvider {
  public static getInstance: () => SIKLogLevelProvider

  constructor() {
    super()
  }
}
