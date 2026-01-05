import {Interactable} from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable"
import {ChessBoardPredictor} from "./ChessBoardPredictor"

interface ChessMove {
  from: string
  to: string
  piece: string
}

interface PieceInfo {
  object: SceneObject
  position: string // e.g., "a2", "b1", etc.
}

@component
export class RandomizeBoard extends BaseScriptComponent {
  @input()
  chessBoardPredictor: ChessBoardPredictor

  private currentTurn: string = "w"
  private chessPieces: SceneObject[] = []
  private pieceMap: {[key: string]: PieceInfo[]} = {}

  onAwake() {
    const parent = this.getSceneObject().getChild(0)
    const numPieces = parent.getChildrenCount()

    for (let i = 0; i < numPieces; i++) {
      const piece = parent.getChild(i)
      this.chessPieces.push(piece)

      // Get the piece type from the name (e.g., 'p' for pawn)
      const pieceType = piece.name
      if (!this.pieceMap[pieceType]) {
        this.pieceMap[pieceType] = []
      }
      // Initially, pieces will be positioned in their starting positions
      this.pieceMap[pieceType].push({
        object: piece,
        position: "" // Will be set when positioning pieces
      })
    }

    this.randomizeBoard(true)

    this.createEvent("OnStartEvent").bind(this.onStart.bind(this))
  }

  onStart() {
    const interactionComponent = this.getSceneObject()
      .getChild(1)
      .getComponent(Interactable.getTypeName()) as Interactable

    interactionComponent.onInteractorTriggerEnd(() => {
      this.randomizeBoard()
    })
  }

  private getStartingPosition(): string[][] {
    // Note: Array is 0-indexed from bottom to top
    // So y=0 is rank 1 (bottom), y=7 is rank 8 (top)
    return [
      ["R", "N", "B", "Q", "K", "B", "N", "R"], // rank 1 (bottom)
      ["P", "P", "P", "P", "P", "P", "P", "P"], // rank 2
      ["", "", "", "", "", "", "", ""], // rank 3
      ["", "", "", "", "", "", "", ""], // rank 4
      ["", "", "", "", "", "", "", ""], // rank 5
      ["", "", "", "", "", "", "", ""], // rank 6
      ["p", "p", "p", "p", "p", "p", "p", "p"], // rank 7
      ["r", "n", "b", "q", "k", "b", "n", "r"] // rank 8 (top)
    ]
  }

  private findValidMoves(board: string[][]): ChessMove[] {
    const validMoves: ChessMove[] = []

    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const piece = board[y][x]
        if (piece === "") continue

        // Skip kings
        if (piece.toLowerCase() === "k") continue

        // Only consider pieces of current turn's color
        const isWhitePiece = piece === piece.toUpperCase()
        if ((this.currentTurn === "w" && !isWhitePiece) || (this.currentTurn === "b" && isWhitePiece)) {
          continue
        }

        // For each piece, find valid moves (to empty squares)
        // y=0 is rank 1, y=7 is rank 8
        const from = String.fromCharCode(97 + x) + (y + 1)

        for (let toY = 0; toY < 8; toY++) {
          for (let toX = 0; toX < 8; toX++) {
            const toPiece = board[toY][toX]
            if (toPiece === "") {
              const to = String.fromCharCode(97 + toX) + (toY + 1)
              validMoves.push({
                from: from,
                to: to,
                piece: piece
              })
            }
          }
        }
      }
    }

    return validMoves
  }

  private makeMove(board: string[][], move: ChessMove, fromLocalPos: vec3, toLocalPos: vec3): void {
    // Convert from chess notation to array indices
    // e.g., 'a1' -> x=0, y=0
    const fromX = move.from.charCodeAt(0) - 97
    const fromY = parseInt(move.from[1]) - 1
    const toX = move.to.charCodeAt(0) - 97
    const toY = parseInt(move.to[1]) - 1

    // Update board state
    board[toY][toX] = board[fromY][fromX]
    board[fromY][fromX] = ""

    // Move the piece in 3D space
    const pieceType = move.piece
    const pieces = this.pieceMap[pieceType]
    if (pieces) {
      // Find the piece at the from position
      const pieceInfo = pieces.find((p) => p.position === move.from)
      if (pieceInfo) {
        // Move the piece
        pieceInfo.object.getTransform().setLocalPosition(toLocalPos)
        // Update its position
        pieceInfo.position = move.to
      }
    }
  }

  randomizeBoard(resetOnly: boolean = false) {
    this.chessBoardPredictor.resetMove()
    const cornerA1 = new vec3(476, 0, -479)
    const cornerH8 = new vec3(-476, 0, 479)

    // Calculate board dimensions and unit vectors
    const boardWidth = cornerH8.x - cornerA1.x
    const boardDepth = cornerH8.z - cornerA1.z
    const squareWidth = boardWidth / 8
    const squareDepth = boardDepth / 8

    // Reset to starting position
    const board = this.getStartingPosition()
    this.currentTurn = "w"

    // Reset piece positions in the map
    for (const pieceType in this.pieceMap) {
      this.pieceMap[pieceType].forEach((p) => (p.position = ""))
    }

    // Position all pieces at their starting positions
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const piece = board[y][x]
        if (piece !== "") {
          const localPos = new vec3(
            cornerA1.x + (x + 0.5) * squareWidth,
            cornerA1.y,
            cornerA1.z + (y + 0.5) * squareDepth
          )
          const pieceType = piece
          // y=0 is rank 1, y=7 is rank 8
          const position = String.fromCharCode(97 + x) + (y + 1)

          // Find an unassigned piece of this type
          const pieces = this.pieceMap[pieceType]
          if (pieces) {
            const unassignedPiece = pieces.find((p) => p.position === "")
            if (unassignedPiece) {
              unassignedPiece.object.getTransform().setLocalPosition(localPos)
              unassignedPiece.position = position
            }
          }
        }
      }
    }

    if (resetOnly) {
      return
    }
    // Make random moves
    for (let i = 0; i < Math.random() * 35; i++) {
      const validMoves = this.findValidMoves(board)

      if (validMoves.length === 0) break

      // Select a random move
      const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)]

      // Calculate local positions for the move
      const fromX = randomMove.from.charCodeAt(0) - 97
      const fromY = parseInt(randomMove.from[1]) - 1
      const toX = randomMove.to.charCodeAt(0) - 97
      const toY = parseInt(randomMove.to[1]) - 1

      // Convert board coordinates to local positions
      const fromLocalPos = new vec3(
        cornerA1.x + (fromX + 0.5) * squareWidth,
        cornerA1.y,
        cornerA1.z + (fromY + 0.5) * squareDepth
      )

      const toLocalPos = new vec3(
        cornerA1.x + (toX + 0.5) * squareWidth,
        cornerA1.y,
        cornerA1.z + (toY + 0.5) * squareDepth
      )

      // Make the move
      this.makeMove(board, randomMove, fromLocalPos, toLocalPos)

      // Switch turns
      this.currentTurn = this.currentTurn === "w" ? "b" : "w"
    }
  }
}
