import {clamp} from "SpectaclesInteractionKit.lspkg/Utils/mathUtils"
import {Cell} from "./Cell"
import MapConfig from "./MapConfig"
import {MapController} from "./MapController"
import {MapPin} from "./MapPin"
import {customGetEuler, isFunction, mod, setScreenTransformRect01, setVec2} from "./MapUtils"

export class MapGridView {
  private config: MapConfig
  private needsLayout = false
  private hasInitialized = false
  private cells: Cell[] = []
  private isScrolling = false
  private isDragging = false
  private hasDragged = false
  private initialLocalTouchPosition: vec2 = vec2.zero()
  private lastTouchPosition: vec2 = vec2.zero()
  private velocity: vec2 = vec2.zero()
  private maxVelocity = 6
  private currentOffset: vec2 = vec2.zero()
  private draggingOffset: vec2 = vec2.zero()
  private lastOffset: vec2 = vec2.zero()
  private lastTouchMoveTime = 0
  private screenPositionChangedDidChange = false
  private shouldTriggerScrollingStarted = false
  private hasTriggeredScrollingStarted = false

  private isMiniMapEnabled = false

  mapController: MapController

  static makeGridView(mapController: MapController): MapGridView {
    const gridView = new MapGridView()
    gridView.mapController = mapController
    return gridView
  }

  // Called when a new configuration for the grid view
  // is applied.
  // Will initialize events if they haven't already been
  handleUpdateConfig(newConfig: MapConfig) {
    this.config = newConfig
    this.needsLayout = true

    if (!this.hasInitialized) {
      this.hasInitialized = true
      this.screenPositionChangedDidChange = true
      global.touchSystem.touchBlocking = true
    }

    // Create or destroy cells to get to the needed number
    const neededCellsCount = this.config.tileCount * this.config.tileCount

    // Ensure there are enough cells by creating or destroying them
    if (neededCellsCount !== this.cells.length) {
      this.needsLayout = true
      const difference = neededCellsCount - this.cells.length
      if (difference < 0) {
        // Remove cells
        for (let i = 0; i < Math.abs(difference); i++) {
          const cellToRemove = this.cells.pop()
          if (isFunction(cellToRemove.onShouldDestroy)) {
            cellToRemove.onShouldDestroy()
          }
        }
      } else if (difference > 0) {
        // Add cells
        for (let i = 0; i < difference; i++) {
          const cell = Cell.makeCell(this.mapController.referencePositionLocationAsset)
          cell.sceneObject = this.config.mapTilePrefab.instantiate(this.config.gridScreenTransform.sceneObject)

          cell.sceneObject.name = "Cell" + this.cells.length + 1

          cell.renderLayer = this.config.gridScreenTransform.getSceneObject().layer
          cell.screenTransform = cell.sceneObject.getComponent("Component.ScreenTransform")
          setScreenTransformRect01(cell.screenTransform, 0, 0, 1, 1)
          this.mapController.configureCell(cell)
          this.cells.push(cell)
        }
      }
    }
  }

  updateGridView(mapPins: Set<MapPin>, userPin: MapPin) {
    if (!this.isScrolling && this.velocity.length > 0.001) {
      // Friction
      this.velocity = this.velocity.sub(this.velocity.uniformScale(this.config.scrollingFriction * getDeltaTime()))
      // Clamp velocity
      this.velocity = this.velocity.clampLength(this.maxVelocity)
      // Calculate offset
      this.currentOffset = this.currentOffset.add(this.velocity.uniformScale(getDeltaTime()))
      if (this.currentOffset.sub(this.lastOffset).length > 0.00001) {
        this.screenPositionChangedDidChange = true
        this.lastOffset = this.currentOffset
        this.clampCurrentOffset()

        this.needsLayout = true
      } else {
        this.velocity = vec2.zero()
      }
    }

    if (this.needsLayout) {
      this.layoutCells()
    }

    const topLeftCorner = this.config.gridScreenTransform.localPointToWorldPoint(new vec2(-2, 2))
    const bottomLeftCorner = this.config.gridScreenTransform.localPointToWorldPoint(new vec2(-2, -2))
    const topRightCorner = this.config.gridScreenTransform.localPointToWorldPoint(new vec2(2, 2))
    const topLeftToBottomLeft = bottomLeftCorner.sub(topLeftCorner)
    const topLeftToTopRight = topRightCorner.sub(topLeftCorner)

    const center = this.config.gridScreenTransform.getTransform().getWorldPosition()

    mapPins.forEach((pin) => {
      if (this.isMiniMapEnabled) {
        pin.updateCircularRenderBound(center)
      } else {
        pin.updateRenderBound(topLeftCorner, topLeftToBottomLeft, topLeftToTopRight)
      }
    })

    if (this.isMiniMapEnabled) {
      userPin.updateCircularRenderBound(center)
    } else {
      userPin.updateRenderBound(topLeftCorner, topLeftToBottomLeft, topLeftToTopRight)
    }

    this.cells.forEach((cell) => {
      if (this.isMiniMapEnabled) {
        cell.updateCircularRenderBound(center)
      } else {
        cell.updateRenderBound(topLeftCorner, topLeftToBottomLeft, topLeftToTopRight)
      }

      if (this.screenPositionChangedDidChange) {
        cell.onScreenPositionChanged()
      }
    })

    if (this.screenPositionChangedDidChange) {
      this.screenPositionChangedDidChange = false
    }
  }

  toggleMiniMap(isOn: boolean, mapPins: Set<MapPin>, userPin: MapPin, isAnimated: boolean = true): void {
    this.config.isMiniMap = isOn
    this.cells.forEach((cell) => {
      cell.toggleMiniMap(this.config.isMiniMap, isAnimated)
    })

    mapPins.forEach((pin) => {
      pin.toggleMiniMap(this.config.isMiniMap)
    })
    userPin.toggleMiniMap(this.config.isMiniMap)

    this.isMiniMapEnabled = isOn
  }

  layoutCells(forcedUpdate: boolean = false): void {
    this.needsLayout = false

    const offset = this.currentOffset.add(this.draggingOffset)

    let needle = -1
    for (let x = 0; x < this.config.tileCount; x++) {
      for (let y = 0; y < this.config.tileCount; y++) {
        const cell = this.cells[++needle]

        const targetXOffset = x + offset.x
        const targetYOffset = y + offset.y

        const wrappedXOffset = mod(targetXOffset + 1.5, this.config.tileCount) - 1.5
        const wrappedYOffset = mod(targetYOffset + 1.5, this.config.tileCount) - 1.5

        setScreenTransformRect01(cell.screenTransform, wrappedXOffset, wrappedYOffset, 1, 1)

        // Index calculations
        const targetHorizontalIndex = Math.round(wrappedXOffset - offset.x + 0.001)
        const targetVerticalIndex = Math.floor(wrappedYOffset - offset.y + 0.001)

        // Update cell data
        let indexChanged = false
        const indexInHorizontalRange =
          this.config.horizontalAllowOutOfIndexRange ||
          (targetHorizontalIndex >= this.config.horizontalMinIndex &&
            targetHorizontalIndex <= this.config.horizontalMaxIndex)
        const indexInVerticalRange =
          this.config.verticalAllowOutOfIndexRange ||
          (targetVerticalIndex >= this.config.verticalMinIndex && targetVerticalIndex <= this.config.verticalMaxIndex)

        if (indexInHorizontalRange && indexInVerticalRange) {
          if (targetHorizontalIndex !== cell.horizontalIndex) {
            cell.horizontalIndex = targetHorizontalIndex
            indexChanged = true
          }
          if (targetVerticalIndex !== cell.verticalIndex) {
            cell.verticalIndex = targetVerticalIndex
            indexChanged = true
          }
        }

        if (cell.sceneObject.enabled && (!indexInHorizontalRange || !indexInVerticalRange)) {
          cell.onDisabled()
          cell.sceneObject.enabled = false
        }

        if (!cell.sceneObject.enabled && indexInHorizontalRange && indexInVerticalRange) {
          cell.onEnabled()
          cell.sceneObject.enabled = true
        }

        if (indexChanged || forcedUpdate) {
          if (forcedUpdate) {
            cell.onZoomChanged(this.mapController.referencePositionLocationAsset)
          }

          cell.onDataChanged()
        }
      }
    }

    this.mapController.onCellCountChanged(this.config.tileCount * this.config.tileCount)
    this.config.onLayout()
  }

  getOffset(): vec2 {
    return this.currentOffset.add(this.draggingOffset)
  }

  setOffset(offset: vec2): void {
    const targetOffset = offset.sub(this.draggingOffset)
    if (targetOffset.x !== this.currentOffset.x || targetOffset.y !== this.currentOffset.y) {
      this.screenPositionChangedDidChange = true
      this.needsLayout = true
      this.currentOffset.x = targetOffset.x
      this.currentOffset.y = targetOffset.y
    }
  }

  getConfig(): MapConfig {
    return this.config
  }

  handleReloadData() {
    this.cells.forEach((cell) => {
      const indexInHorizontalRange =
        this.config.horizontalAllowOutOfIndexRange ||
        (cell.horizontalIndex >= this.config.horizontalMinIndex &&
          cell.horizontalIndex <= this.config.horizontalMaxIndex)
      const indexInVerticalRange =
        this.config.verticalAllowOutOfIndexRange ||
        (cell.verticalIndex >= this.config.verticalMinIndex && cell.verticalIndex <= this.config.verticalMaxIndex)

      if (indexInHorizontalRange && indexInVerticalRange) {
        cell.onDataChanged()
      }
    })
  }

  resetVelocity() {
    this.velocity = vec2.zero()
  }

  private clampCurrentOffset(): void {
    this.currentOffset.x = clamp(-this.config.horizontalMaxIndex, -this.config.horizontalMinIndex, this.currentOffset.x)
    this.currentOffset.y = clamp(-this.config.verticalMaxIndex, -this.config.verticalMinIndex, this.currentOffset.y)
  }

  handleScrollStart(localPosition: vec2): void {
    if (this.config.horizontalScrollingEnabled || this.config.verticalScrollingEnabled) {
      localPosition = localPosition.uniformScale(0.5)
      this.isScrolling = true
      setVec2(this.initialLocalTouchPosition, localPosition)
      setVec2(this.lastTouchPosition, this.initialLocalTouchPosition)
      this.velocity = vec2.zero()
      this.draggingOffset = vec2.zero()
      this.isDragging == false
      this.lastTouchMoveTime = getTime()
      this.shouldTriggerScrollingStarted = true
    }
  }

  handleScrollUpdate(localPosition: vec2): void {
    if (this.config.horizontalScrollingEnabled || this.config.verticalScrollingEnabled) {
      if (this.isScrolling) {
        localPosition = localPosition.uniformScale(0.5)
        if (!this.hasTriggeredScrollingStarted && this.shouldTriggerScrollingStarted) {
          this.mapController.onScrollingStarted()
          this.hasTriggeredScrollingStarted = true
        }
        this.needsLayout = true
        this.screenPositionChangedDidChange = true
        this.isDragging = true
        this.hasDragged = true
        const delta = getTime() - this.lastTouchMoveTime
        if (delta <= 0) {
          return
        }

        const touchOffsetFromInitialTouch = this.getPositionWithMapRotationOffset(
          localPosition.sub(this.initialLocalTouchPosition)
        )
        const constrainAxis = new vec2(
          this.config.horizontalScrollingEnabled ? 1 : 0,
          this.config.verticalScrollingEnabled ? 1 : 0
        )
        this.draggingOffset = touchOffsetFromInitialTouch.mult(new vec2(0.5, -0.5)).mult(constrainAxis)
        // Dampen dragging if it dragging too far
        this.lastTouchMoveTime = getTime()

        const scale = delta * 600
        const touchOffsetFromLastTouch = this.getPositionWithMapRotationOffset(
          localPosition.sub(this.lastTouchPosition)
        )
        const acceleration = touchOffsetFromLastTouch.mult(new vec2(scale, -scale)).mult(constrainAxis)
        this.velocity = this.velocity.add(acceleration.sub(this.velocity))
        setVec2(this.lastTouchPosition, localPosition)
      }
    }
  }

  handleScrollEnd() {
    if (this.config.horizontalScrollingEnabled || this.config.verticalScrollingEnabled) {
      if (this.isScrolling) {
        this.isScrolling = false
        if (this.hasDragged) {
          this.hasDragged = false
          this.currentOffset = this.currentOffset.add(this.draggingOffset)
          this.clampCurrentOffset()
          this.draggingOffset = vec2.zero()
        }
        this.shouldTriggerScrollingStarted = false
        this.hasTriggeredScrollingStarted = false
      }
    }
  }

  getPositionWithMapRotationOffset(localPosition: vec2): vec2 {
    const degInRad = Math.atan2(localPosition.y, localPosition.x)
    const distance = Math.sqrt(localPosition.x * localPosition.x + localPosition.y * localPosition.y)
    const mapRotInRad = customGetEuler(this.config.gridScreenTransform.rotation).z
    const adjustedRotationInRad = degInRad - mapRotInRad
    const adjustedLocalPosition = new vec2(
      Math.cos(adjustedRotationInRad),
      Math.sin(adjustedRotationInRad)
    ).uniformScale(distance)
    return adjustedLocalPosition
  }
}
