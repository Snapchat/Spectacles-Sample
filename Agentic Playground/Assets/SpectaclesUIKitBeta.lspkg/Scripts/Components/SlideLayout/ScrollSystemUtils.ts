/**
 * Utility class for scroll system calculations
 */
export class ScrollSystemUtils {
  
  /**
   * Calculate which card index should be in the center based on scroll value
   * @param normalizedValue Value between 0 and 1
   * @param numberOfCards Total number of cards
   * @returns Card index that should be in center position
   */
  static calculateTargetIndexFromScrollValue(normalizedValue: number, numberOfCards: number): number {
    // Clamp the normalized value to 0-1 range
    const clampedValue = MathUtils.clamp(normalizedValue, 0, 1)
    
    // Calculate the index based on the normalized value
    // For numberOfCards = 10, scroll value 0.5 should show card 5 in center
    const targetIndex = Math.floor(clampedValue * (numberOfCards - 1))
    
    return MathUtils.clamp(targetIndex, 0, numberOfCards - 1)
  }

  /**
   * Get the normalized scroll value (0-1) based on current card index
   * @param currentIndex Current card index
   * @param numberOfCards Total number of cards
   * @returns Normalized scroll value
   */
  static getCurrentScrollValue(currentIndex: number, numberOfCards: number): number {
    if (numberOfCards <= 1) {
      return 0
    }
    return currentIndex / (numberOfCards - 1)
  }

  /**
   * Calculate visible card indices for a given center index
   * @param centerIndex Index of the card that should be in center
   * @param numberOfCards Total number of cards
   * @returns Object with indices for all 5 visible positions
   */
  static calculateVisibleIndices(centerIndex: number, numberOfCards: number): {
    topLast: number,
    top: number,
    mid: number,
    bottom: number,
    bottomLast: number
  } {
    const topLastIndex = (centerIndex - 2 + numberOfCards) % numberOfCards
    const topIndex = (centerIndex - 1 + numberOfCards) % numberOfCards
    const midIndex = centerIndex
    const bottomIndex = (centerIndex + 1) % numberOfCards
    const bottomLastIndex = (centerIndex + 2) % numberOfCards

    return {
      topLast: topLastIndex,
      top: topIndex,
      mid: midIndex,
      bottom: bottomIndex,
      bottomLast: bottomLastIndex
    }
  }

  /**
   * Check if a scroll value change is significant enough to warrant an update
   * @param oldValue Previous scroll value
   * @param newValue New scroll value
   * @param threshold Minimum change threshold (default: 0.001)
   * @returns True if the change is significant
   */
  static isScrollChangeSignificant(oldValue: number, newValue: number, threshold: number = 0.001): boolean {
    return Math.abs(newValue - oldValue) >= threshold
  }

  /**
   * Validate scroll system configuration
   * @param scrollLineStart Start point of scroll line
   * @param scrollLineEnd End point of scroll line
   * @param scrollController Controller object
   * @returns True if configuration is valid
   */
  static validateScrollSystemConfig(
    scrollLineStart: SceneObject | null,
    scrollLineEnd: SceneObject | null,
    scrollController: SceneObject | null
  ): boolean {
    if (!scrollLineStart || !scrollLineEnd || !scrollController) {
      return false
    }
    return true
  }
}

/**
 * Interface for scroll system configuration
 */
export interface ScrollSystemConfig {
  enabled: boolean
  lineStart: SceneObject | null
  lineEnd: SceneObject | null
  controller: SceneObject | null
  currentValue: number
  targetIndex: number
}

/**
 * Interface for visible card configuration
 */
export interface VisibleCardConfig {
  card: SceneObject
  position: vec3
  positionIndex: number
  cardIndex: number
} 