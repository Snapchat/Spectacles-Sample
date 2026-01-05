export class ChessPiece {
  public position: vec3
  public boardPosition: vec2
  public name: string
  public confidence: number
  public index: number
  public age: number = 0

  constructor(position: vec3, name: string, confidence: number, index: number) {
    this.position = position
    this.name = name
    this.boardPosition = new vec2(-1, -1)
    this.confidence = confidence
    this.index = index
  }

  clone() {
    const piece = new ChessPiece(
      this.position,
      //this.bbox,
      this.name,
      this.confidence,
      this.index
    )
    piece.boardPosition = this.boardPosition
    return piece
  }
}

export class BoardData {
  private pieceLocations: string[][] = Array(8)
    .fill(null)
    .map(() => Array(8).fill(""))

  public getPiece(boardPos: vec2) {
    return this.pieceLocations[boardPos.y][boardPos.x]
  }

  public setPiece(boardPos: vec2, piece: string) {
    this.pieceLocations[boardPos.y][boardPos.x] = piece
  }

  public getPieces() {
    const pieces = []
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const p = this.pieceLocations[y][x]
        if (p != "" && p != "-") {
          pieces.push({boardPosition: new vec2(x, y), name: p})
        }
      }
    }
    return pieces
  }
}
