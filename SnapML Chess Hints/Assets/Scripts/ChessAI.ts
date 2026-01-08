import {GeminiTypes} from "RemoteServiceGateway.lspkg/HostedExternal/GeminiTypes"
import {BoardData} from "./ChessPiece"

import {Gemini} from "RemoteServiceGateway.lspkg/HostedExternal/Gemini"

export type FenResult = {ok: boolean; correctedFen?: string; error?: string}

export class Move {
  from: string
  to: string
  piece: string
  mate: number | null = null

  constructor(data: any) {
    const mate = data.mate
    if (mate != null) {
      this.mate = parseInt(mate)
      //todo handle mate
    }
    if (data["from"] != undefined) {
      this.from = data.from
      this.to = data.to
      this.piece = data.piece
      if (data.color == "w") {
        this.piece = this.piece.toUpperCase()
      }
    } else {
      print("Invalid move notation: " + data)
      throw new Error("Invalid move notation")
    }
  }

  // Equality operator
  equals(other: Move): boolean {
    return this.from === other.from && this.to === other.to && this.piece === other.piece && this.mate === other.mate
  }
}

export class ChessAI {
  public suggestedMove: Move | null = null
  public lastFEN: string | null = null
  public depth: number = 4
  private responseCache: object = {}
  private useStockfish: boolean

  constructor(useStockfish: boolean) {
    this.useStockfish = useStockfish
  }

  reset() {
    this.suggestedMove = null
    this.lastFEN = null
  }

  updateFEN(FEN: string) {
    const validation = this.validateAndCorrectFen(FEN)
    if (!validation.ok) {
      print("Invalid FEN: " + validation.error + " " + FEN)
      return false
    } else if (validation.correctedFen) {
      //print("Corrected FEN: " + validation.correctedFen)
    }

    this.lastFEN = validation.correctedFen || FEN
    return true
  }

  async fetchMove(
    callback: (response: {success: boolean; shouldRetry: boolean; message: string; fen: string}) => void
  ) {
    if (this.lastFEN == null) {
      callback({
        success: false,
        message: "Board not found",
        fen: this.lastFEN,
        shouldRetry: false
      })
      return
    }
    const FEN = this.lastFEN

    const onResponse = (response: {success: boolean; message: string; fen: string; shouldRetry: boolean}) => {
      this.responseCache[response.fen] = response
      callback(response)
    }

    print("fetching move: " + FEN)

    if (this.responseCache[FEN]) {
      callback(this.responseCache[FEN])
      return
    }
    const USE_GEMINI = !this.useStockfish

    const sampleMove = {
      from: "e7",
      to: "e5",
      piece: "P"
    }

    const text =
      "You are a chess engine. Given this FEN string, respond with the best move in UCI format as a JSON object. Note that the piece returned is capitalized if it is white, lowercase if it is black. Please ignore the validity of the move number, en passant, and castling rights. FEN: " +
      FEN +
      ". Respond formatted like this example: " +
      JSON.stringify(sampleMove)

    const request: GeminiTypes.Models.GenerateContentRequest = {
      model: "gemini-2.0-flash",
      type: "generateContent",
      body: {
        contents: [
          {
            parts: [
              {
                text: text
              }
            ],
            role: "user"
          }
        ]
      }
    }

    Gemini.models(request)
      .then((response) => {
        const responseText = response.candidates[0].content.parts[0].text
        const bodyJson = JSON.parse(responseText)

        if (bodyJson.from == undefined || bodyJson.to == undefined || bodyJson.piece == undefined) {
          onResponse({
            success: false,
            message: USE_GEMINI ? responseText : "No move found",
            fen: FEN,
            shouldRetry: false
          })
        } else {
          this.suggestedMove = new Move(bodyJson)
          print(this.suggestedMove.from + " -> " + this.suggestedMove.to)
          onResponse({
            success: true,
            message: "",
            fen: FEN,
            shouldRetry: false
          })
        }
      })
      .catch((error) => {
        print(error)
        print("FEN: " + FEN)

        onResponse({
          success: false,
          message: error,
          fen: FEN,
          shouldRetry: false
        })
      })
  }

  pieceToFriendlyName(piece: string) {
    const pieceName = piece.toLowerCase()
    const friendlyName = pieceName == piece ? "Black" : "White"
    switch (pieceName) {
      case "p":
        return friendlyName + " Pawn"
      case "n":
        return friendlyName + " Knight"
      case "b":
        return friendlyName + " Bishop"
      case "r":
        return friendlyName + " Rook"
      case "q":
        return friendlyName + " Queen"
      case "k":
        return friendlyName + " King"
    }
  }

  validateAndCorrectFen(fen: string): FenResult {
    const VALID_PIECE = /^[prnbqk]$/i
    const VALID_CASTLE = /^[KQkq-]+$/
    const VALID_EP = /^(-|[a-h][36])$/
    /* ---------- tokenise --------------------------------------------------- */
    const tokens = fen.trim().split(/\s+/u)
    if (tokens.length !== 6) {
      return bad("must contain six space‑delimited fields")
    }
    let [pieceField, side, castle, ep, halfMoveStr, fullMoveStr] = tokens

    /* ---------- numeric fields -------------------------------------------- */
    const halfMoves = +halfMoveStr,
      fullMoves = +fullMoveStr
    if (!Number.isInteger(halfMoves) || halfMoves < 0) {
      return bad("half‑move clock must be ≥ 0")
    }
    if (!Number.isInteger(fullMoves) || fullMoves <= 0) {
      return bad("full‑move number must be > 0")
    }

    /* ---------- simple reg‑ex fields -------------------------------------- */
    if (!/^[wb]$/.test(side)) {
      return bad("side to move is invalid")
    }
    if (!VALID_CASTLE.test(castle)) {
      return bad("castling availability is invalid")
    }
    if (!VALID_EP.test(ep)) {
      return bad("en‑passant square is invalid")
    }

    /* ---------- split ranks ------------------------------------------------ */
    const ranksIn = pieceField.split("/")
    if (ranksIn.length !== 8) {
      return bad('piece data must have 8 "/"‑separated ranks')
    }

    const ranksOut: string[] = []
    let corrected = false

    /* piece counters for later legality checks */
    const pieceCount: Record<"w" | "b", Record<string, number>> = {
      w: {p: 0, r: 0, n: 0, b: 0, q: 0, k: 0},
      b: {p: 0, r: 0, n: 0, b: 0, q: 0, k: 0}
    }

    for (const rank of ranksIn) {
      let file = 0,
        run = 0,
        out = ""

      for (const ch of rank) {
        if (/[1-8]/.test(ch)) {
          /* flush any run of empties first                     */
          if (run) {
            out += run
            run = 0
          }
          file += +ch
          out += ch // keep single‑digit gaps verbatim
        } else if (VALID_PIECE.test(ch)) {
          if (run) {
            out += run
            run = 0
          }
          out += ch
          file++

          const colour = ch === ch.toUpperCase() ? "w" : "b"
          pieceCount[colour][ch.toLowerCase()]++
        } else {
          // ----------- ★ auto‑repair ----------
          corrected = true
          run++ // treat illegal char as 1 empty square
          file++
        }

        if (file > 8) {
          return bad("too many squares in rank")
        }
      }

      if (run) {
        out += run
      } // flush trailing empties

      if (file < 8) {
        // pad the remainder of the rank
        corrected = true
        out += String(8 - file)
      } else if (file !== 8) {
        return bad("rank does not sum to 8 squares")
      }

      /* compress any adjacent digits created by our fixes */
      out = compressDigits(out)
      ranksOut.push(out)
    }

    pieceField = ranksOut.join("/")

    /* ---------- ★ piece‑count legality ------------------------------------ */
    for (const colour of <const>["w", "b"]) {
      if (pieceCount[colour].k !== 1) {
        return bad(`must have exactly one ${colour === "w" ? "white" : "black"} king`)
      }
      if (pieceCount[colour].p > 8) {
        return bad(`${colour} has more than 8 pawns`)
      }
    }

    /* ---------- ★ pawn on first/last rank --------------------------------- */
    const firstRank = ranksOut[0],
      lastRank = ranksOut[7]
    if (/[P]/.test(firstRank + lastRank) || /[p]/.test(firstRank + lastRank)) {
      return bad("pawns may not be on first or eighth rank")
    }

    /* ---------- ★ en‑passant square legality ------------------------------ */
    if (ep !== "-") {
      const epFile = ep.charCodeAt(0) - 97 // 'a' -> 0
      const epRank = Number(ep[1])

      /* side to move *just* had a pawn advance two squares, so the pawn to capture is opposite colour */
      const pawnRank = epRank === 3 ? 4 : 5 // square where that pawn must sit
      const pawnRow = 8 - pawnRank // convert to our 0‑based array index

      const rankStr = ranksOut[pawnRow]
      let col = 0
      for (const ch of rankStr) {
        if (/[1-8]/.test(ch)) {
          col += +ch
        } else {
          if (col === epFile && ((side === "w" && ch === "p") || (side === "b" && ch === "P"))) break
          col++
        }
      }
      if (col !== epFile) {
        return bad("no pawn can possibly capture en‑passant on the given square")
      }
    }

    /* ---------- ★ castling rights vs board -------------------------------- */
    const castlingChecks: Record<string, {piece: string; sq: string}> = {
      K: {piece: "K", sq: "e1"},
      Q: {piece: "K", sq: "e1"},
      k: {piece: "k", sq: "e8"},
      q: {piece: "k", sq: "e8"}
    }
    const rookSquares = {K: "h1", Q: "a1", k: "h8", q: "a8"}

    function pieceAt(square: string): string | null {
      const file = square.charCodeAt(0) - 97
      const rank = 8 - Number(square[1]) // array index
      let col = 0
      for (const ch of ranksOut[rank]) {
        if (/[1-8]/.test(ch)) {
          col += +ch
        } else {
          if (col === file) return ch
          col++
        }
      }
      return null
    }

    for (const flag of castle === "-" ? [] : castle.split("")) {
      const {piece, sq} = castlingChecks[flag]
      if (pieceAt(sq) !== piece) {
        // Remove invalid castling flag instead of returning bad
        castle = castle.replace(flag, "")
        corrected = true

        continue
      }
      if (pieceAt(rookSquares[flag]) !== (flag === flag.toUpperCase() ? "R" : "r")) {
        // Remove invalid castling flag instead of returning bad
        castle = castle.replace(flag, "")
        corrected = true
        continue
      }
    }
    // If all flags were removed, set to '-'
    if (castle === "") {
      castle = "-"
    }

    /* ---------- compose result -------------------------------------------- */
    const correctedFen = corrected ? [pieceField, side, castle, ep, halfMoveStr, fullMoveStr].join(" ") : undefined

    return corrected ? {ok: true, correctedFen} : {ok: true}

    /* ---------- helpers ---------------------------------------------------- */
    function bad(msg: string): FenResult {
      return {ok: false, error: `Invalid FEN: ${msg}`}
    }

    function compressDigits(rank: string): string {
      return rank.replace(/([1-8])([1-8])/g, (_, a, b) => String(+a + +b)) // safe because a+b ≤ 8
    }
  }

  boardArrayToFEN(board: BoardData, turn: string, numMoves: number) {
    //turn is a string, either 'w' or 'b'
    //board is a 2d array of strings, each string is a row of the board
    //the strings are 8 characters long, each character is a piece
    //the characters are: p, n, b, r, q, k, P, N, B, R, Q, K
    //the capital letters are white pieces, the lowercase letters are black pieces
    //the characters are case sensitive
    //numbers are used to represent empty squares
    //the board is indexed [0][0] to [7][7]
    //the board is indexed [row][column]

    let fen = ""
    for (let row = 7; row >= 0; row--) {
      let emptyCount = 0
      for (let col = 0; col < 8; col++) {
        const piece = board.getPiece(new vec2(col, row))
        if (piece === "") {
          emptyCount++
        } else {
          if (emptyCount > 0) {
            fen += emptyCount // Add the count of empty squares
            emptyCount = 0
          }
          fen += piece // Add the piece
        }
      }
      if (emptyCount > 0) {
        fen += emptyCount // Add any remaining empty squares at the end of the row
      }
      if (row > 0) {
        fen += "/" // Separate rows with a slash
      }
    }

    //add the turn
    fen += " " + turn.toLowerCase().substring(0, 1)

    //add the castling rights (not implemented)
    fen += " KQkq"

    //add the en passant square (not implemented)
    fen += " -"

    //add the half move clock (not implemented)
    fen += " 0"

    //add the full move number
    fen += " " + numMoves

    return fen // Return the generated FEN string
  }
}
