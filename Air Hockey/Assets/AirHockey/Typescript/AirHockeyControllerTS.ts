import {Interactable} from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable"
import {InteractableManipulation} from "SpectaclesInteractionKit.lspkg/Components/Interaction/InteractableManipulation/InteractableManipulation"
import {PinchButton} from "SpectaclesInteractionKit.lspkg/Components/UI/PinchButton/PinchButton"
import {SessionController} from "SpectaclesSyncKit.lspkg/Core/SessionController"
import {StorageProperty} from "SpectaclesSyncKit.lspkg/Core/StorageProperty"
import {SyncEntity} from "SpectaclesSyncKit.lspkg/Core/SyncEntity"
import {AirHockeyPaddle} from "./AirHockeyPaddleTS"
import {AirHockeyPuck} from "./AirHockeyPuckTS"

@component
export class AirHockeyController extends BaseScriptComponent {
  @input
  controllerJS: ScriptComponent

  @input()
  puck: AirHockeyPuck

  @input()
  leftGoalCollider: ColliderComponent

  @input()
  rightGoalCollider: ColliderComponent

  @input()
  leftPaddle: AirHockeyPaddle

  @input()
  leftPaddleInteractable: Interactable

  @input()
  leftPaddleManipulation: InteractableManipulation

  @input()
  rightPaddle: AirHockeyPaddle

  @input()
  rightPaddleInteractable: Interactable

  @input()
  rightPaddleManipulation: InteractableManipulation

  @input()
  startGameButton: PinchButton

  @input()
  leftScore1: Text

  @input
  rightScore1: Text

  @input()
  leftScore2: Text

  @input()
  rightScore2: Text

  isLeftPlayer: boolean = false
  isRightPlayer: boolean = false
  hasInitAsOwner: boolean = false
  syncEntity: SyncEntity
  sessionController: SessionController = SessionController.getInstance()

  private isGameStartedProp = StorageProperty.manualBool("isGameStarted", false)
  private leftScoreProp = StorageProperty.manualInt("leftScore", 0)
  private rightScoreProp = StorageProperty.manualInt("rightScore", 0)

  initAsClient() {
    this.refreshUI()
  }

  initAsOwner() {
    if (this.hasInitAsOwner) return

    this.hasInitAsOwner = true

    this.leftGoalCollider.onOverlapEnter.add((e) => this.onLeftGoalOverlap(e))
    this.rightGoalCollider.onOverlapEnter.add((e) => this.onRightGoalOverlap(e))
    this.startGameButton.onButtonPinched.add(() => this.startGame())

    print("Trying to claim ownership of puck")
    this.puck.syncEntity.tryClaimOwnership(() => this.refreshUI())

    this.refreshUI()
  }

  isHost() {
    return this.syncEntity.isSetupFinished && this.syncEntity.doIOwnStore()
  }

  joinLeft() {
    if (!this.isLeftPlayer && !this.isRightPlayer && !this.leftPaddle.syncEntity.isStoreOwned()) {
      this.setupForLeftSide()
    }
  }

  joinRight() {
    if (!this.isLeftPlayer && !this.isRightPlayer && !this.rightPaddle.syncEntity.isStoreOwned()) {
      this.setupForRightSide()
    }
  }

  refreshUI() {
    const isConnected: boolean = this.syncEntity.isSetupFinished
    const canControlGame = this.isHost() || this.puck.syncEntity.doIOwnStore()

    this.startGameButton.getSceneObject().enabled =
      isConnected && canControlGame && !this.isGameStartedProp.currentOrPendingValue

    print("Start button enabled: " + this.startGameButton.getSceneObject().enabled)
    print("Is host: " + this.isHost())
    print("Is game started: " + this.isGameStartedProp.currentOrPendingValue)
    print("Do I own puck: " + this.puck.syncEntity.doIOwnStore())
    print("Can control game: " + canControlGame)
  }

  setLeftScore(newScore: number, oldScore: number) {
    this.leftScore1.text = "" + newScore
    this.leftScore2.text = "" + newScore
  }

  setRightScore(newScore: number, oldScore: number) {
    this.rightScore1.text = "" + newScore
    this.rightScore2.text = "" + newScore
  }

  setupForLeftSide() {
    this.leftPaddle.syncEntity.tryClaimOwnership(() => {
      this.isLeftPlayer = true
      this.leftPaddleManipulation.setCanTranslate(true)
      this.refreshUI()
    })
  }

  setupForRightSide() {
    this.rightPaddle.syncEntity.tryClaimOwnership(() => {
      this.isRightPlayer = true
      this.rightPaddleManipulation.setCanTranslate(true)
      this.refreshUI()
    })
  }

  startGame() {
    print("Start button pinched")
    // Reset scores for a fresh start
    this.leftScoreProp.setValueImmediate(this.syncEntity.currentStore, 0)
    this.rightScoreProp.setValueImmediate(this.syncEntity.currentStore, 0)

    if (!this.isGameStartedProp.currentOrPendingValue) {
      this.isGameStartedProp.setValueImmediate(this.syncEntity.currentStore, true)
      this.refreshUI()
      print("Start game")
      this.puck.startMovement()
    }
  }

  onLeftGoalOverlap(eventArgs) {
    const overlap = eventArgs.overlap
    if (overlap.collider.isSame(this.puck.body)) {
      print("Goal on left!")
      this.puck.resetPuck()
      this.rightScoreProp.setPendingValue(this.rightScoreProp.currentOrPendingValue + 1)
    }
  }

  onRightGoalOverlap(eventArgs) {
    const overlap = eventArgs.overlap
    if (overlap.collider.isSame(this.puck.body)) {
      print("Goal on right!")
      this.puck.resetPuck()
      this.leftScoreProp.setPendingValue(this.leftScoreProp.currentOrPendingValue + 1)
    }
  }

  onSyncEntityReady() {
    print("Sync entity ready")

    if (this.isHost()) {
      this.initAsOwner()
    } else {
      this.initAsClient()
    }

    this.leftPaddleInteractable.onHoverEnter.add(() => this.joinLeft())
    this.rightPaddleInteractable.onHoverEnter.add(() => this.joinRight())

    this.leftPaddle.syncEntity.onOwnerUpdated.add(() => {
      print("Left paddle owner updated")
      this.refreshUI()
    })
    this.rightPaddle.syncEntity.onOwnerUpdated.add(() => {
      print("Right paddle owner updated")
      this.refreshUI()
    })
    this.puck.syncEntity.onOwnerUpdated.add(() => {
      print("Puck owner updated")
      this.refreshUI()
    })

    this.refreshUI()
  }

  onOwnershipUpdated() {
    if (!this.syncEntity.isStoreOwned()) {
      print("Controller is not owned, trying to claim")
      this.syncEntity.tryClaimOwnership(() => this.initAsOwner())
    }
    this.refreshUI()
  }

  onSessionReady() {
    print("Session ready")

    this.leftPaddleManipulation.setCanTranslate(false)
    this.leftPaddleManipulation.setCanScale(false)
    this.leftPaddleManipulation.setCanRotate(false)

    this.rightPaddleManipulation.setCanTranslate(false)
    this.rightPaddleManipulation.setCanScale(false)
    this.rightPaddleManipulation.setCanRotate(false)

    this.syncEntity = new SyncEntity(this, null, true)
    this.syncEntity.addStorageProperty(this.isGameStartedProp)
    this.syncEntity.addStorageProperty(this.leftScoreProp)
    this.syncEntity.addStorageProperty(this.rightScoreProp)

    this.setLeftScore(this.leftScoreProp.currentValue, 0)
    this.setRightScore(this.rightScoreProp.currentValue, 0)

    this.leftScoreProp.onAnyChange.add((newScore: number, oldScore: number) => this.setLeftScore(newScore, oldScore))
    this.rightScoreProp.onAnyChange.add((newScore: number, oldScore: number) => this.setRightScore(newScore, oldScore))

    this.syncEntity.notifyOnReady(() => this.onSyncEntityReady())
    this.syncEntity.onOwnerUpdated.add(() => this.onOwnershipUpdated())
  }

  resetGame() {
    print("Resetting game due to user leaving")

    // Reset the game started state
    this.isGameStartedProp.setValueImmediate(this.syncEntity.currentStore, false)

    // Reset player state flags
    this.isLeftPlayer = false
    this.isRightPlayer = false

    // Disable paddle manipulation for both sides
    this.leftPaddleManipulation.setCanTranslate(false)
    this.rightPaddleManipulation.setCanTranslate(false)

    // Use SessionController to clear ownership more reliably
    const session = this.sessionController.getSession()

    // Clear paddle ownership through session controller
    if (this.leftPaddle.syncEntity.isStoreOwned()) {
      session.clearRealtimeStoreOwnership(
        this.leftPaddle.syncEntity.currentStore,
        () => print("Left paddle ownership cleared successfully"),
        (error) => print("Error clearing left paddle ownership: " + error)
      )
    }

    if (this.rightPaddle.syncEntity.isStoreOwned()) {
      session.clearRealtimeStoreOwnership(
        this.rightPaddle.syncEntity.currentStore,
        () => print("Right paddle ownership cleared successfully"),
        (error) => print("Error clearing right paddle ownership: " + error)
      )
    }

    // Ensure the current user can take control of the controller and puck
    if (!this.syncEntity.doIOwnStore()) {
      this.syncEntity.tryClaimOwnership(() => {
        print("Controller ownership claimed after reset")
        this.initAsOwner()
      })
    }

    if (!this.puck.syncEntity.doIOwnStore()) {
      this.puck.syncEntity.tryClaimOwnership(() => {
        print("Puck ownership claimed after reset")
        this.refreshUI()
      })
    }

    // Stop puck movement and reset to center position
    this.puck.stopMovement()
    this.puck.getTransform().setLocalPosition(vec3.zero())

    // Refresh UI to show the start button for the remaining player
    this.refreshUI()
  }

  onStart() {
    this.sessionController.notifyOnReady(() => this.onSessionReady())

    this.sessionController.onUserLeftSession.add((user) => {
      print("User left session")

      // Always reset the game when someone leaves to ensure clean state
      // This ensures paddles can be claimed and the remaining player can restart
      this.resetGame()

      // Give a small delay then refresh UI again to ensure proper state
      const delayedEvent = this.createEvent("DelayedCallbackEvent")
      delayedEvent.bind(() => this.refreshUI())
      delayedEvent.reset(0.5)
    })
  }

  onAwake() {
    if (this.controllerJS.getSceneObject().enabled) {
      print("Javascript controller is enabled, skipping initialization")
      return
    }

    this.createEvent("OnStartEvent").bind(() => this.onStart())
  }
}
