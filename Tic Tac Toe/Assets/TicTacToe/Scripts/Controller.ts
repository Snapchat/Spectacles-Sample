import {InstantiationOptions, Instantiator} from "SpectaclesSyncKit.lspkg/Components/Instantiator"
import {NetworkRootInfo} from "SpectaclesSyncKit.lspkg/Core/NetworkRootInfo"
import {SessionController} from "SpectaclesSyncKit.lspkg/Core/SessionController"
import {SyncEntity} from "SpectaclesSyncKit.lspkg/Core/SyncEntity"
import {BaseButton} from "SpectaclesUIKit.lspkg/Scripts/Components/Button/BaseButton"
import {COLS, GRID_SPACING, GRID_X_OFFSET, GRID_Z_OFFSET, LAYERS, MAX_TURNS, ROWS, SNAP_DISTANCE} from "./constants"
import {GameManager} from "./GameManager"
import {GridPosition} from "./GridPosition"
import {Piece} from "./Piece"
import {GridPointCoordinate, SpatialGrid} from "./SpatialGrid"
import {SyncEntityGrid} from "./SyncEntityGrid"

export const PLAYERS = ["X", "O"] as const
export type Player = (typeof PLAYERS)[number]
enum EventKeys {
  START = "start",
  RESTART = "restart"
}

@component
export class Controller extends BaseScriptComponent {
  @input()
  instantiator: Instantiator

  @input()
  xPrefab: ObjectPrefab

  @input()
  oPrefab: ObjectPrefab

  @input()
  scoreTextSceneObj: Text

  @input()
  gameResultTextSceneObj: Text

  @input()
  winnerPanelSceneObj: SceneObject

  @input()
  restartButton: BaseButton

  @input
  gridSnapAudio: AudioComponent

  @input
  gridSceneObj: SceneObject

  isGameOver: boolean = false
  private player: Player | null = null
  private syncEntity: SyncEntity
  private instantiatedNetworkObjects: SceneObject[] = []
  gameManager: GameManager
  private spatialGrid: SpatialGrid = new SpatialGrid()
  private gameGrid = new SyncEntityGrid(LAYERS, ROWS, COLS)

  private setScoreText(xScore: number, oScore: number): void {
    this.scoreTextSceneObj.text = `X: ${xScore}
        O: ${oScore}`
  }

  private getPieceComponent(obj: SceneObject) {
    return obj.getComponent(Piece.getTypeName())
  }

  /**
   * Attach the object to a snapping point
   * @param {SceneObject} objectToSnap
   * @returns { boolean } true if the object was attached to a snapping point, false otherwise
   */
  private attachObjectToSnappingPoint(objectToSnap: SceneObject) {
    if (!this.spatialGrid) return false

    const closestPoint = this.spatialGrid.findClosestPoint(
      objectToSnap.getTransform().getWorldPosition(),
      SNAP_DISTANCE
    )

    if (!closestPoint) return false
    const isEmpty =
      this.gameGrid.getValueAtPosition(closestPoint.layer, closestPoint.row, closestPoint.col) ===
      this.gameGrid.EMPTY_SPACE

    if (closestPoint && isEmpty && this.player) {
      this.gameGrid.setPositionOnSyncGrid(closestPoint.layer, closestPoint.row, closestPoint.col, this.player)
      const pieceComponent = this.getPieceComponent(objectToSnap)
      pieceComponent.position = {layer: closestPoint.layer, row: closestPoint.row, col: closestPoint.col}
      pieceComponent.smoothSnapToPosition(closestPoint.coords)
      this.gridSnapAudio.play(1)
      return true
    }
    return false
  }

  public sendRestartEvent() {
    this.syncEntity.sendEvent(EventKeys.RESTART)
  }

  private restart() {
    this.gameManager.restartGame()
    this.gameGrid.resetGrid()
    // Destroy all instantiated network objects, reset scene for both players
    this.instantiatedNetworkObjects.forEach((object) => {
      object.destroy()
    })
    this.instantiatedNetworkObjects = []
    this.winnerPanelSceneObj.enabled = false
    this.initialize()
  }

  private getGridPositionComponent(obj: SceneObject) {
    return obj.getComponent(GridPosition.getTypeName())
  }

  initialize() {
    // If snapping points are not set, create and instantiate them
    if (this.spatialGrid.grid.size === 0) {
      this.gridSceneObj.children.forEach((child) => {
        child.enabled = true
        const {layer, row, col} = this.getGridPositionComponent(child).getCoordinates()
        const position = this.getGridPositionComponent(child).getPosition()
        this.spatialGrid.addPoint(position, layer, row, col)
      })
    }
    // Player X spawns first piece to start the game
    if (this.player === "X") {
      this.spawnPlayerPrefab(this.xPrefab)
    }
  }

  spawnPlayerPrefab(prefab: ObjectPrefab) {
    if (this.instantiator.isReady()) {
      // Spawn piece using the Sync Framework instantiator, set local start position
      const xPosition = new vec3(GRID_X_OFFSET, 0, -GRID_Z_OFFSET)
      const oPosition = new vec3(GRID_X_OFFSET, 0, -GRID_Z_OFFSET - GRID_SPACING * LAYERS)
      this.spawnSyncPrefab(prefab, this.player === "X" ? xPosition : oPosition, (networkRootInfo) => {
        this.instantiatedNetworkObjects.push(networkRootInfo.instantiatedObject)
      })
    }
  }

  spawnSyncPrefab(
    prefab: ObjectPrefab,
    position: vec3,
    onRenderedCallback: (networkRootInfo: NetworkRootInfo) => void
  ) {
    const options = new InstantiationOptions()
    options.localPosition = position
    this.instantiator.instantiate(prefab, options, (networkRootInfo) => {
      onRenderedCallback(networkRootInfo)
    })
  }

  // External hook for completed manipulation of a piece
  public onPieceUpdated(object: SceneObject, onSuccessCallback?: () => void) {
    const wasAttachingSuccessful = this.attachObjectToSnappingPoint(object)
    if (wasAttachingSuccessful) {
      onSuccessCallback?.()
    }
  }

  private setupSyncEntity() {
    this.syncEntity = new SyncEntity(this)

    // Networked events
    this.syncEntity.onEventReceived.add(EventKeys.START, () => this.initialize())
    this.syncEntity.onEventReceived.add(EventKeys.RESTART, () => this.restart())
    // Use storage property to keep track of turns, used to figure out whose turn it is
    this.syncEntity.addStorageProperty(this.gameGrid.storageProperty)
    this.syncEntity.notifyOnReady(() => this.onReady())
  }

  onWinnerSet(winner: Player, winningLine: GridPointCoordinate[]) {
    this.gameResultTextSceneObj.text = winner + " won!"
    this.winnerPanelSceneObj.enabled = true
    if (this.player === null) {
      this.restartButton.enabled = false
    }
    winningLine.forEach((coordinate, index) => {
      const object = this.instantiatedNetworkObjects.find((object) => {
        const position = this.getPieceComponent(object).position
        return position.layer === coordinate.layer && position.row === coordinate.row && position.col === coordinate.col
      })
      if (object) {
        this.getPieceComponent(object).playWinnerAnimation(index * 500)
      }
    })
  }

  onTieSet() {
    this.gameResultTextSceneObj.text = "It's a tie!"
    this.winnerPanelSceneObj.enabled = true
  }

  onNewTurn(newCount: number) {
    // Check whose turn it is and spawn their piece
    if (newCount % 2 === 0 && this.player === "X") {
      this.spawnPlayerPrefab(this.xPrefab)
    } else if (newCount % 2 === 1 && this.player === "O") {
      this.spawnPlayerPrefab(this.oPrefab)
    }
  }

  private onReady() {
    const playerCount: number = SessionController.getInstance().getUsers().length

    // Assign pieces to users
    // The first player is X, the second is O, everyone else is a spectator
    // In an ideal world we would have a UI to assign players, but for the sake of this example we will just assign players based on the order in which they join
    if (playerCount === 1) {
      this.player = "X"
      this.gameManager = new GameManager(this.player, MAX_TURNS, this.gameGrid, {
        onWinnerSet: (winner: Player, winningLine: GridPointCoordinate[]) => this.onWinnerSet(winner, winningLine),
        onTieSet: () => this.onTieSet(),
        onNewTurn: (newCount: number) => this.onNewTurn(newCount)
      })
    } else if (playerCount === 2) {
      this.player = "O"
      this.gameManager = new GameManager(this.player, MAX_TURNS, this.gameGrid, {
        onWinnerSet: (winner: Player, winningLine: GridPointCoordinate[]) => this.onWinnerSet(winner, winningLine),
        onTieSet: () => this.onTieSet(),
        onNewTurn: (newCount: number) => this.onNewTurn(newCount)
      })
    } else {
      this.gameManager = new GameManager(null, MAX_TURNS, this.gameGrid, {
        onWinnerSet: (winner: Player, winningLine: GridPointCoordinate[]) => this.onWinnerSet(winner, winningLine),
        onTieSet: () => this.onTieSet(),
        onNewTurn: (newCount: number) => this.onNewTurn(newCount)
      })
    }

    this.syncEntity.addStorageProperty(this.gameManager.xScoreStorageProp)
    this.syncEntity.addStorageProperty(this.gameManager.oScoreStorageProp)

    this.gameManager.xScoreStorageProp.onAnyChange.add((xScore: number) =>
      this.setScoreText(xScore, this.gameManager.oScoreStorageProp.currentValue)
    )
    this.gameManager.oScoreStorageProp.onAnyChange.add((oScore: number) =>
      this.setScoreText(this.gameManager.xScoreStorageProp.currentValue, oScore)
    )
    // If O is assigned, send event to start the game
    if (this.player === "O") {
      this.syncEntity.sendEvent(EventKeys.START)
    }
  }

  onAwake() {
    this.setupSyncEntity()
    this.restartButton.onTriggerDown.add(() => this.sendRestartEvent())
  }
}
