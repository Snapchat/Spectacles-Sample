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
    isActive: boolean    // Indicates if the hand is currently active
    x: number            // X-coordinate of the hand position
    y: number            // Y-coordinate of the hand position
    z: number            // Z-coordinate of the hand position
  }

  // Interface defining the structure of Kame Hame Ha data for energy beam simulation
  export interface KAME_HAME_HA_DATA {
    connectionID: string      // Unique connection ID of the user
    isReady: boolean         // Indicates if the player is ready to create energy beams
    leftHandActive: boolean  // Indicates if the left hand is currently tracked
    rightHandActive: boolean // Indicates if the right hand is currently tracked
    leftHandX: number        // X-coordinate of the left hand position
    leftHandY: number        // Y-coordinate of the left hand position
    leftHandZ: number        // Z-coordinate of the left hand position
    rightHandX: number       // X-coordinate of the right hand position
    rightHandY: number       // Y-coordinate of the right hand position
    rightHandZ: number       // Z-coordinate of the right hand position
    handsCenterX: number     // X-coordinate of the center point between both hands
    handsCenterY: number     // Y-coordinate of the center point between both hands
    handsCenterZ: number     // Z-coordinate of the center point between both hands
  }

  // Constant string used as a prefix for Kame Hame Ha data keys
  export const KAME_HAME_HA: string = "KAME_HAME_HA"

  // Generates a key for the current user's Kame Hame Ha data
  export const getCurrentUserKameHameHaKey = (): string => {
    return getKameHameHaKey(SessionController.getInstance().getLocalUserInfo())
  }

  // Generates a key for a specific user's Kame Hame Ha data using their connection ID
  export const getKameHameHaKey = (user: ConnectedLensModule.UserInfo): string => {
    return KAME_HAME_HA + user.connectionId
  }

  // Interface defining the structure of head label data for social networking
  export interface HEAD_LABEL_DATA {
    connectionID: string      // Unique connection ID of the user
    userName: string         // Display name of the user
    statusText: string       // Main status message
    subStatusText: string    // Sub-status or availability text
    availability: number     // Availability state (0=Available, 1=Busy, 2=Away, 3=DoNotDisturb)
    isPinged: boolean       // Whether the user has been pinged
    lastUpdated: number     // Timestamp of last update
  }

  // Constant string used as a prefix for head label data keys
  export const HEAD_LABEL: string = "HEAD_LABEL"

  // Generates a key for the current user's head label data
  export const getCurrentUserHeadLabelKey = (): string => {
    return getHeadLabelKey(SessionController.getInstance().getLocalUserInfo())
  }

  // Generates a key for a specific user's head label data using their connection ID
  export const getHeadLabelKey = (user: ConnectedLensModule.UserInfo): string => {
    return HEAD_LABEL + user.connectionId
  }

}
