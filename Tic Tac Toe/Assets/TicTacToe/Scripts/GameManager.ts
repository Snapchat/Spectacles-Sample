import {StorageProperty} from "SpectaclesSyncKit.lspkg/Core/StorageProperty"
import {Player, PLAYERS} from "./Controller"
import type {GridPointCoordinate} from "./SpatialGrid"
import {SyncEntityGrid} from "./SyncEntityGrid"

/**
 * Utility class to handle turn logic and game state

 * N.B. Do not forget to attach storageProperties to your SyncEntity on awake component
 */
export class GameManager {
  public readonly xScoreStorageProp = StorageProperty.manualInt("xScore", 0)
  public readonly oScoreStorageProp = StorageProperty.manualInt("oScore", 0)
  public readonly player: Player | null

  private readonly winningPositions = this.generateAll3DWinningLines()
  isGameOver: boolean
  readonly maxTurns: number
  private readonly onWinnerSet: (winner: Player, line: GridPointCoordinate[]) => void
  private readonly onTieSet: () => void
  private readonly onNewTurn: (newCount: number) => void
  private readonly gameGrid: SyncEntityGrid

  constructor(
    player: Player | null,
    maxTurns: number,
    gameGrid: SyncEntityGrid,
    callbacks: {
      onWinnerSet: (winner: Player, line: GridPointCoordinate[]) => void
      onTieSet: () => void
      onNewTurn: (newCount: number) => void
    }
  ) {
    this.onWinnerSet = callbacks.onWinnerSet
    this.onTieSet = callbacks.onTieSet
    this.onNewTurn = callbacks.onNewTurn
    this.gameGrid = gameGrid
    this.player = player
    this.maxTurns = maxTurns
    this.gameGrid.storageProperty.onAnyChange.add((newGrid: string) => this.setTurn(newGrid))
  }

  public restartGame() {
    this.isGameOver = false
  }

  private setWinner(winner: Player, line: GridPointCoordinate[]) {
    // Update the score on the winner, each player is responsible for updating their own score
    if (winner === "X" && this.player === "X") {
      this.xScoreStorageProp.setPendingValue(this.xScoreStorageProp.currentValue + 1)
    } else if (winner === "O" && this.player === "O") {
      this.oScoreStorageProp.setPendingValue(this.oScoreStorageProp.currentValue + 1)
    }
    this.isGameOver = true
    this.onWinnerSet(winner, line)
  }

  private setTie() {
    this.isGameOver = true
    this.onTieSet()
  }

  private setTurn(newGrid: string) {
    const turnCount = [...newGrid].filter((c) => c === "X" || c === "O").length
    // No player has completed a turn yet, don't do anything
    if (turnCount === 0) return

    // Check for 3D win conditions
    const winner = this.check3DWin()
    if (winner) {
      this.setWinner(winner.player, winner.line)
      return
    }

    // The maximum number of turns have been played, the game resulted in a tie
    if (turnCount === this.maxTurns) {
      this.setTie()
      return
    }

    this.onNewTurn(turnCount)
  }

  // Check for 3D win conditions
  private check3DWin(): {player: Player | null; line: GridPointCoordinate[]} | null {
    // Check all possible 3D winning lines
    for (const player of PLAYERS) {
      for (const line of this.winningPositions) {
        if (line.every(({layer, row, col}) => this.gameGrid.getValueAtPosition(layer, row, col) === player)) {
          return {player, line}
        }
      }
    }
    return null
  }

  /**
   * Generates all possible 3D winning lines for a 3x3x3 tic-tac-toe game.
   * Includes rows, columns, depth lines, face diagonals, and space diagonals.
   * @returns {GridPointCoordinate[][]} Array of winning line configurations, each containing 3 grid positions
   */
  private generateAll3DWinningLines(): GridPointCoordinate[][] {
    const lines: GridPointCoordinate[][] = []

    // 1. Rows within each layer (9 lines)
    for (let layer = 0; layer < 3; layer++) {
      for (let row = 0; row < 3; row++) {
        lines.push([
          {layer, row, col: 0},
          {layer, row, col: 1},
          {layer, row, col: 2}
        ])
      }
    }

    // 2. Columns within each layer (9 lines)
    for (let layer = 0; layer < 3; layer++) {
      for (let col = 0; col < 3; col++) {
        lines.push([
          {layer, row: 0, col},
          {layer, row: 1, col},
          {layer, row: 2, col}
        ])
      }
    }

    // 3. Depth lines (9 lines)
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        lines.push([
          {layer: 0, row, col},
          {layer: 1, row, col},
          {layer: 2, row, col}
        ])
      }
    }

    // 4. Face diagonals (18 lines)
    for (let i = 0; i < 3; i++) {
      // XY plane (fixed layer)
      lines.push([
        {layer: i, row: 0, col: 0},
        {layer: i, row: 1, col: 1},
        {layer: i, row: 2, col: 2}
      ])
      lines.push([
        {layer: i, row: 0, col: 2},
        {layer: i, row: 1, col: 1},
        {layer: i, row: 2, col: 0}
      ])
      // XZ plane (fixed row)
      lines.push([
        {layer: 0, row: i, col: 0},
        {layer: 1, row: i, col: 1},
        {layer: 2, row: i, col: 2}
      ])
      lines.push([
        {layer: 0, row: i, col: 2},
        {layer: 1, row: i, col: 1},
        {layer: 2, row: i, col: 0}
      ])
      // YZ plane (fixed col)
      lines.push([
        {layer: 0, row: 0, col: i},
        {layer: 1, row: 1, col: i},
        {layer: 2, row: 2, col: i}
      ])
      lines.push([
        {layer: 0, row: 2, col: i},
        {layer: 1, row: 1, col: i},
        {layer: 2, row: 0, col: i}
      ])
    }

    // 5. Space diagonals (4 lines)
    // Main space diagonal
    lines.push([
      {layer: 0, row: 0, col: 0},
      {layer: 1, row: 1, col: 1},
      {layer: 2, row: 2, col: 2}
    ])
    // Anti space diagonal
    lines.push([
      {layer: 0, row: 0, col: 2},
      {layer: 1, row: 1, col: 1},
      {layer: 2, row: 2, col: 0}
    ])
    // Other space diagonals
    lines.push([
      {layer: 0, row: 2, col: 0},
      {layer: 1, row: 1, col: 1},
      {layer: 2, row: 0, col: 2}
    ])
    lines.push([
      {layer: 0, row: 2, col: 2},
      {layer: 1, row: 1, col: 1},
      {layer: 2, row: 0, col: 0}
    ])

    return lines
  }
}
