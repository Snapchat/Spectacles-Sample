import {SessionController} from "SpectaclesSyncKit.lspkg/Core/SessionController"

//The RealtimeStoreKeys namespace defines constants and utility functions for
// managing and accessing hand position data in a real-time collaborative environment

export namespace RealtimeStoreKeys {
  // Constant string used as a prefix for hand position keys
  export const HAND_POSITION: string = "HAND_POSITION"

  // Generates a key for the current user's hand position data
  export const getCurrentUserHandPositionKey = (): string => {
    return getHandPositionKey(SessionController.getInstance().getLocalUserInfo())
  }

  // Generates a key for a specific user's hand position data using their connection ID
  export const getHandPositionKey = (user: ConnectedLensModule.UserInfo): string => {
    return HAND_POSITION + user.connectionId
  }

  // Interface defining the structure of hand position data
  export interface HAND_LOCAL_POSITION_DATA {
    connectionID: string // Unique connection ID of the user
    isActive: boolean // Indicates if the hand is currently active
    x: number // X-coordinate of the hand position
    y: number // Y-coordinate of the hand position
    z: number // Z-coordinate of the hand position
  }
}
