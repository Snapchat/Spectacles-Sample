import WorldCameraFinderProvider from "SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider"
import TrackedHand from "SpectaclesInteractionKit.lspkg/Providers/HandInputData/TrackedHand"
import {SIK} from "SpectaclesInteractionKit.lspkg/SIK"
import {SessionController} from "SpectaclesSyncKit.lspkg/Core/SessionController"
import {BubbleAnimationController} from "../BubbleAnimationController/BubbleAnimationController"
import {RealtimeStoreKeys} from "../SyncControls/RealtimeStoreKeys"
import {HighFiveControllerInput} from "./HighFiveControllerInput"

// The HighFiveController class is responsible for detecting and handling virtual high-five
// interactions between users in a real-time environment.
// It tracks the hand positions of the current user and their friends,
// and triggers animations when a high-five gesture is detected
export class HighFiveController {
  // Controller for managing bubble animations during high-five interactions
  private readonly bubbleAnimationController: BubbleAnimationController

  // Stores information about friends' hand positions
  private readonly friendsHandsInfo: RealtimeStoreKeys.HAND_LOCAL_POSITION_DATA[] = []

  // Event that updates hand positions and checks for high-five interactions
  private readonly updateEvent: SceneEvent

  // Reference to the user's right hand
  private readonly rightHand: TrackedHand

  // Stores the current user's hand position information
  private currentUserHandInfo: RealtimeStoreKeys.HAND_LOCAL_POSITION_DATA

  // Provides access to the world camera's position and transform
  private worldCamera: WorldCameraFinderProvider

  // Flag indicating whether the bubble animation is finished
  private isBubbleAnimationFinished: boolean = true

  constructor(private readonly input: HighFiveControllerInput) {
    // Initialize the bubble animation controller
    this.bubbleAnimationController = new BubbleAnimationController(this.input.bubbleAnimationControllerInput)

    // Initialize the right hand using SIK framework
    this.rightHand = SIK.HandInputData.getHand("right")

    // Get an instance of the world camera for positioning calculations
    this.worldCamera = WorldCameraFinderProvider.getInstance()

    // Create and bind the update event for handling high-five logic
    this.updateEvent = this.input.createEvent("UpdateEvent")
    this.updateEvent.bind(this.onUpdate)
    this.updateEvent.enabled = false
  }

  // Enables the update event to start checking for high-fives
  start() {
    this.updateEvent.enabled = true
  }

  // Updates the current user's hand information when it changes
  currentUserHandInfoUpdated(value: RealtimeStoreKeys.HAND_LOCAL_POSITION_DATA) {
    this.currentUserHandInfo = value
  }

  // Updates or adds a friend's hand information
  friendsInfoUpdated(value: RealtimeStoreKeys.HAND_LOCAL_POSITION_DATA) {
    for (const friend of this.friendsHandsInfo) {
      if (friend.connectionID === value.connectionID) {
        friend.isActive = value.isActive
        friend.x = value.x
        friend.y = value.y
        friend.z = value.z
        return
      }
    }
    this.friendsHandsInfo.push(value)
  }

  // Removes a friend's hand information when they disconnect
  onFriendDisconnected(connectionID: string) {
    const indexToRemove = this.friendsHandsInfo.findIndex((item) => item.connectionID === connectionID)
    if (indexToRemove !== -1) {
      this.friendsHandsInfo.splice(indexToRemove, 1)
    }
  }

  // Handles update logic to check for high-five conditions
  private onUpdate = (): void => {
    if (!this.currentUserHandInfo || !this.currentUserHandInfo.isActive) {
      return
    }
    const currentUserHandPos: vec3 = this.getUserHandPosition(this.currentUserHandInfo)
    let lastDist: number = 1000
    for (const friend of this.friendsHandsInfo) {
      if (!friend.isActive) {
        return
      }
      const friendHandPos: vec3 = this.getUserHandPosition(friend)
      lastDist = friendHandPos.distance(currentUserHandPos)
      if (friendHandPos.distance(currentUserHandPos) < 10) {
        let friendName: string = ""
        SessionController.getInstance()
          .getSession()
          .activeUsersInfo.forEach((user) => {
            if (user.connectionId === friend.connectionID) {
              friendName = user.displayName
            }
          })
        this.showBubbleAnimation(this.rightHand.getPalmCenter(), friendName)
        return
      }
    }
  }

  // Converts hand position data into a vec3 object for calculations
  private getUserHandPosition(data: RealtimeStoreKeys.HAND_LOCAL_POSITION_DATA): vec3 {
    return new vec3(data.x, data.y, data.z)
  }

  // Displays a bubble animation when a high-five gesture is detected
  private showBubbleAnimation(handPos: vec3, friendName: string): void {
    if (!this.isBubbleAnimationFinished) {
      return
    }
    this.isBubbleAnimationFinished = false
    this.setBubblePosition(handPos)
    this.bubbleAnimationController.playBubbleAnimation(friendName, () => {
      this.isBubbleAnimationFinished = true
    })
  }

  // Sets the position of the bubble animation relative to the world camera
  private setBubblePosition(handPos: vec3): void {
    const head = this.worldCamera.getTransform().getWorldPosition()
    const dir = handPos.sub(head).normalize().uniformScale(15)
    this.bubbleAnimationController.setPosition(handPos.add(dir))
  }
}
