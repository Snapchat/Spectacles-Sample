import {StorageProperty} from "SpectaclesSyncKit.lspkg/Core/StorageProperty"
import {StorageTypes} from "SpectaclesSyncKit.lspkg/Core/StorageTypes"
import type {Player} from "./Controller"

/**
 * A string representation of the game grid, allows us to avoid serialisation
 * and quickly synchronise using StorageProperties primitives
 *
 * N.B. Do not forget to attach storageProperty to your SyncEntity on awake component
 * */
export class SyncEntityGrid {
  startingGrid: string
  storageProperty: StorageProperty<StorageTypes.string>
  EMPTY_SPACE = " "
  layers: number
  rows: number
  cols: number
  constructor(layers: number, rows: number, cols: number) {
    this.layers = layers
    this.rows = rows
    this.cols = cols
    this.startingGrid = new Array(layers * rows * cols).fill(this.EMPTY_SPACE).join("") //Flat grid allows us to serialize and send the game data over StorageProperty
    this.storageProperty = StorageProperty.manualString("gameGrid", this.startingGrid)
  }

  // Helper functions for 3D indexing of game grid
  private getIndex(layer: number, row: number, col: number): number {
    return layer * Math.pow(this.layers, 2) + row * this.rows + col
  }

  public getValueAtPosition(layer: number, row: number, col: number): string {
    if (layer < 0 || layer >= this.layers || row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
      return " "
    }
    const index = this.getIndex(layer, row, col)
    return this.storageProperty.currentValue[index]
  }

  /**
   * Replace a character in a string at a given index
   * @param {string} str
   * @param {number} index
   * @param {string} newChar
   * @returns {string} new string with the character replaced
   */
  private replaceCharInStr(str: string, index: number, newChar: string): string {
    const chars = str.split("")
    chars[index] = newChar
    return chars.join("")
  }

  /**
   * Occupy a position on the game grid with a player
   * @param {number} layer - Z coordinate of game grid
   * @param {number} row - X coordinate of game grid
   * @param {number} col - Y coordinate of game grid
   * @param {Player} player
   * @returns {void}
   */
  public setPositionOnSyncGrid(layer: number, row: number, col: number, player: Player): void {
    const index = this.getIndex(layer, row, col)
    const newGrid = this.replaceCharInStr(this.storageProperty.currentValue, index, player)
    this.storageProperty.setPendingValue(newGrid)
  }

  // Set grid to its initial state
  public resetGrid() {
    this.storageProperty.setPendingValue(this.startingGrid)
  }
}
