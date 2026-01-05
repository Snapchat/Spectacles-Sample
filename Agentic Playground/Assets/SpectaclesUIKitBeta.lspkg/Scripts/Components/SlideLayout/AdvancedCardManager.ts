/**
 * Enum for card types in chat system
 */
export enum CardType {
  User = "user",
  Chatbot = "chatbot"
}

/**
 * Interface for card data
 */
export interface CardData {
  id: number
  type: CardType
  textContent: string
  size: vec3
  sceneObject: SceneObject | null
}

/**
 * Interface for card sizing rules
 */
export interface CardSizingRule {
  minChars: number
  maxChars: number
  rows: number
  size: vec3
}

/**
 * AdvancedCardManager - Handles dynamic card sizing and positioning
 */
export class AdvancedCardManager {
  // Base card size (width, height, depth)
  private readonly baseWidth: number = 25
  private readonly baseDepth: number = 3

  // Height sizing rules
  private readonly minHeight: number = 5
  private readonly maxHeight: number = 15
  private readonly heightPerRow: number = 1.25 // 10 height units / 8 rows = 1.25 per row

  // Character to row mapping
  private readonly charsPerRow: number = 45 // Approximately 45 chars per row

  // Default position offsets from mid position
  private readonly defaultOffsets: number[] = [20, 10, 0, -10, -20] // topLast, top, mid, bottom, bottomLast

  /**
   * Calculate card size based on text content length
   * @param textContent The text content of the card
   * @returns vec3 representing card size (width, height, depth)
   */
  calculateCardSize(textContent: string): vec3 {
    const charCount = textContent.length

    // Calculate number of rows needed - more aggressive calculation for better distinction
    const rows = Math.max(1, Math.ceil(charCount / this.charsPerRow))

    // Clamp rows between 1 and 8
    const clampedRows = MathUtils.clamp(rows, 1, 8)

    // Calculate height based on rows with more pronounced differences
    // 1 row = 5 height, 2 rows = 6.5, 3 rows = 8, 4 rows = 9.5, etc.
    // This creates more noticeable size differences
    const heightIncrement = (this.maxHeight - this.minHeight) / 7 // ~1.43 per row
    const height = this.minHeight + (clampedRows - 1) * heightIncrement

    print(
      "AdvancedCardManager: Text '" +
        textContent.substring(0, 30) +
        "...' (" +
        charCount +
        " chars) -> " +
        clampedRows +
        " rows -> height " +
        height.toFixed(1)
    )

    return new vec3(this.baseWidth, height, this.baseDepth)
  }

  /**
   * Calculate dynamic positions based on card sizes (all calculations in local space)
   * @param basePositions Array of base local positions for the 5 slots
   * @param cardSizes Array of card sizes for visible cards
   * @param spacingMultiplier Multiplier for spacing between cards (default: 1.0)
   * @returns Array of adjusted local positions
   */
  calculateDynamicPositions(basePositions: vec3[], cardSizes: vec3[], spacingMultiplier: number = 1.0): vec3[] {
    if (basePositions.length !== 5 || cardSizes.length !== 5) {
      print("AdvancedCardManager: Invalid input arrays - expected 5 positions and 5 sizes")
      return basePositions
    }

    const midPosition = basePositions[2] // Mid position is our reference point
    const adjustedPositions: vec3[] = []

    // Calculate spacing based on card heights
    let cumulativeOffset = 0

    // Start from mid and work outward
    // Mid position (index 2) stays at base position
    adjustedPositions[2] = midPosition

    // Calculate top positions (indices 1 and 0) - use their actual X and Z coordinates
    cumulativeOffset = this.calculateSpacing(cardSizes[2], cardSizes[1], spacingMultiplier) // mid to top spacing
    adjustedPositions[1] = new vec3(
      basePositions[1].x, // Use top position's actual X
      midPosition.y + cumulativeOffset,
      basePositions[1].z // Use top position's actual Z
    )

    cumulativeOffset += this.calculateSpacing(cardSizes[1], cardSizes[0], spacingMultiplier) // top to topLast spacing
    adjustedPositions[0] = new vec3(
      basePositions[0].x, // Use topLast position's actual X
      midPosition.y + cumulativeOffset,
      basePositions[0].z // Use topLast position's actual Z
    )

    // Calculate bottom positions (indices 3 and 4) - use their actual X and Z coordinates
    cumulativeOffset = this.calculateSpacing(cardSizes[2], cardSizes[3], spacingMultiplier) // mid to bottom spacing
    adjustedPositions[3] = new vec3(
      basePositions[3].x, // Use bottom position's actual X
      midPosition.y - cumulativeOffset,
      basePositions[3].z // Use bottom position's actual Z
    )

    cumulativeOffset += this.calculateSpacing(cardSizes[3], cardSizes[4], spacingMultiplier) // bottom to bottomLast spacing
    adjustedPositions[4] = new vec3(
      basePositions[4].x, // Use bottomLast position's actual X
      midPosition.y - cumulativeOffset,
      basePositions[4].z // Use bottomLast position's actual Z
    )

    print(
      "AdvancedCardManager: Calculated dynamic local positions (spacing x" +
        spacingMultiplier.toFixed(1) +
        ") - " +
        "Top Last Y: " +
        adjustedPositions[0].y.toFixed(1) +
        ", " +
        "Top Y: " +
        adjustedPositions[1].y.toFixed(1) +
        ", " +
        "Mid Y: " +
        adjustedPositions[2].y.toFixed(1) +
        ", " +
        "Bottom Y: " +
        adjustedPositions[3].y.toFixed(1) +
        ", " +
        "Bottom Last Y: " +
        adjustedPositions[4].y.toFixed(1)
    )

    return adjustedPositions
  }

  /**
   * Calculate spacing between two cards based on their heights
   * @param card1Size Size of first card
   * @param card2Size Size of second card
   * @param spacingMultiplier Multiplier for spacing (default: 1.0)
   * @returns Spacing distance
   */
  private calculateSpacing(card1Size: vec3, card2Size: vec3, spacingMultiplier: number = 1.0): number {
    // Base spacing is half of each card's height plus a minimum gap
    const minGap = 3.0 // Increased minimum gap for better visibility
    const dynamicGap = Math.max(card1Size.y, card2Size.y) * 0.1 // Add 10% of larger card height
    const baseSpacing = card1Size.y / 2 + card2Size.y / 2 + minGap + dynamicGap

    // Apply spacing multiplier
    const finalSpacing = baseSpacing * spacingMultiplier

    return finalSpacing
  }

  /**
   * Get card sizing info for debugging
   * @param textContent Text content to analyze
   * @returns Object with sizing details
   */
  getCardSizingInfo(textContent: string): {
    charCount: number
    estimatedRows: number
    actualRows: number
    size: vec3
  } {
    const charCount = textContent.length
    const estimatedRows = Math.ceil(charCount / this.charsPerRow)
    const actualRows = MathUtils.clamp(estimatedRows, 1, 8)
    const size = this.calculateCardSize(textContent)

    return {
      charCount,
      estimatedRows,
      actualRows,
      size
    }
  }

  /**
   * Validate card data
   * @param cardData Card data to validate
   * @returns True if valid
   */
  validateCardData(cardData: CardData): boolean {
    return (
      cardData.id >= 0 &&
      (cardData.type === CardType.User || cardData.type === CardType.Chatbot) &&
      cardData.textContent.length > 0 &&
      cardData.size.x > 0 &&
      cardData.size.y > 0 &&
      cardData.size.z > 0
    )
  }

  /**
   * Get size rules for reference
   */
  getSizingRules(): CardSizingRule[] {
    return [
      {
        minChars: 1,
        maxChars: 50,
        rows: 1,
        size: new vec3(this.baseWidth, this.minHeight, this.baseDepth)
      },
      {
        minChars: 51,
        maxChars: 362,
        rows: 8,
        size: new vec3(this.baseWidth, this.maxHeight, this.baseDepth)
      }
    ]
  }
}
