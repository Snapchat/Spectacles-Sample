import {InteractableManipulation} from "SpectaclesInteractionKit.lspkg/Components/Interaction/InteractableManipulation/InteractableManipulation"
import {ButtonSlide} from "../../../SpectaclesUIKitBeta.lspkg/Scripts/Components/Button/ButtonSlide"
import {ButtonSlideCardBot} from "../../../SpectaclesUIKitBeta.lspkg/Scripts/Components/Button/ButtonSlideCardBot"
import {ButtonSlideCardUser} from "../../../SpectaclesUIKitBeta.lspkg/Scripts/Components/Button/ButtonSlideCardUser"
import {
  AdvancedCardManager,
  CardData,
  CardType
} from "../../../SpectaclesUIKitBeta.lspkg/Scripts/Components/SlideLayout/AdvancedCardManager"
import {
  ScrollSystemUtils,
  VisibleCardConfig
} from "../../../SpectaclesUIKitBeta.lspkg/Scripts/Components/SlideLayout/ScrollSystemUtils"
import {CHARACTER_LIMITS} from "../Utils/TextLimiter"

/**
 * Represents the state of a swiped card
 */
class SwipeState {
  swipedObject: SceneObject | null = null
  originalPosition: vec3 = vec3.zero()
  originalRotation: quat = quat.quatIdentity()
  isSwipping: boolean = false
  swipeStartTime: number = 0
  swipeStartPosition: vec3 = vec3.zero()
  swipeDirection: vec3 = vec3.zero()
}

/**
 * AdvancedSlideLayoutRearrange - Advanced chat-like card swiping system
 *
 * Manages dynamic cards with text injection and variable sizing:
 * - Dynamic number of cards
 * - Text injection with automatic sizing
 * - Chat-like system (user vs chatbot cards)
 * - Variable positioning based on card sizes
 * - Maintains 5 visible cards with scroll system
 */
@component
export class ChatComponent extends BaseScriptComponent {
  @input
  @hint("User card prefab")
  userCardPrefab: ObjectPrefab

  @input
  @hint("Chatbot card prefab")
  chatbotCardPrefab: ObjectPrefab

  @input("int", "10")
  @hint("Initial number of cards")
  initialNumberOfCards: number = 10

  @input("SceneObject")
  @hint("Transform for the top last position")
  topLastPosition: SceneObject = null

  @input("SceneObject")
  @hint("Transform for the top position")
  topPosition: SceneObject = null

  @input("SceneObject")
  @hint("Transform for the mid position (active/swipeable)")
  midPosition: SceneObject = null

  @input("SceneObject")
  @hint("Transform for the bottom position")
  bottomPosition: SceneObject = null

  @input("SceneObject")
  @hint("Transform for the bottom last position")
  bottomLastPosition: SceneObject = null

  @input("number", "50.0")
  @hint("Minimum swipe distance to trigger card change")
  swipeThreshold: number = 50.0

  @input("number", "0.5")
  @hint("Animation speed for card transitions (0-1)")
  animationSpeed: number = 0.5

  @input("number", "100.0")
  @hint("Minimum swipe speed (distance/time) to trigger quick swipe")
  swipeSpeedThreshold: number = 100.0

  // Scroll System Inputs
  @input
  @hint("Enable scroll system (if false, uses manual swipe only)")
  enableScrollSystem: boolean = true

  @input
  @hint("Line start point for scroll projection")
  scrollLineStart: SceneObject = null

  @input
  @hint("Line end point for scroll projection")
  scrollLineEnd: SceneObject = null

  @input
  @hint("Draggable object that controls the scroll position")
  scrollController: SceneObject = null

  // Test System
  @input
  @hint("Enable test mode - adds cards automatically every 2 seconds")
  testMode: boolean = false

  @input("number", "2.0")
  @hint("Interval between test card additions (seconds)")
  testInterval: number = 2.0

  @input("int", "40")
  @hint("Maximum number of cards for testing")
  maxTestCards: number = 40

  // Chat System
  @input
  @hint("Enable chronological chat mode - forces cards to appear in order 0,1,2,3 from top to bottom")
  chatModeChronological: boolean = true

  // Spacing System
  @input("number", "1.0")
  @hint("Multiplier for spacing between cards (1.0 = default, 2.0 = double spacing, 0.5 = half spacing)")
  spacingMultiplier: number = 1.0

  private cardManager: AdvancedCardManager
  private cards: SceneObject[] = []
  private cardData: CardData[] = []
  private currentIndex: number = 0 // Will be set properly during initialization
  private swipeState: SwipeState = new SwipeState()
  private basePositions: vec3[] = []
  private currentPositions: vec3[] = []
  private animatingCards: Map<SceneObject, {target: vec3; isVisible: boolean}> = new Map()

  private initialized: boolean = false
  private lastScrollValue: number = -1

  // Test system
  private testTimer: number = 0
  private testCardCount: number = 0

  onAwake() {
    this.createEvent("OnStartEvent").bind(this.initialize)
    this.createEvent("UpdateEvent").bind(this.update)
  }

  /**
   * Initialize the advanced slide layout system
   */
  initialize = (): void => {
    if (this.initialized) return

    if (!this.validateInputs()) {
      print("AdvancedSlideLayoutRearrange: Invalid inputs, cannot initialize")
      return
    }

    this.setupBasePositions()
    this.initializeCardManager()
    this.createInitialCards()

    // Set proper starting index based on mode
    if (this.testMode) {
      this.currentIndex = 2 // Start with card 2 in mid position for test mode
    } else {
      this.currentIndex = 0 // Start with card 0 (welcome message) in chat mode
    }

    this.calculateDynamicPositions()
    this.layoutInitialCards()
    this.setupSwipeInteraction()

    // Initialize scroll system if enabled
    if (this.enableScrollSystem) {
      this.initializeScrollSystem()
    }

    this.initialized = true
    print(
      "AdvancedSlideLayoutRearrange initialized with " +
        this.cardData.length +
        " cards" +
        (this.enableScrollSystem ? " (scroll system enabled)" : "")
    )
  }

  /**
   * Validate required inputs
   */
  private validateInputs(): boolean {
    if (!this.userCardPrefab || !this.chatbotCardPrefab) {
      print("AdvancedSlideLayoutRearrange: Both user and chatbot card prefabs are required")
      return false
    }
    if (
      !this.topLastPosition ||
      !this.topPosition ||
      !this.midPosition ||
      !this.bottomPosition ||
      !this.bottomLastPosition
    ) {
      print("AdvancedSlideLayoutRearrange: All five position objects are required")
      return false
    }

    // Different minimum requirements based on mode
    const minCards = this.testMode ? 5 : 1 // Only need 1 card for chat mode (welcome message)
    const cardsToCreate = this.testMode ? this.initialNumberOfCards : 1 // Only welcome card for chat mode

    if (cardsToCreate < minCards) {
      print(`AdvancedSlideLayoutRearrange: Need at least ${minCards} cards for ${this.testMode ? "test" : "chat"} mode`)
      return false
    }

    // Validate spacing multiplier
    if (this.spacingMultiplier < 0.1) {
      print("AdvancedSlideLayoutRearrange: Spacing multiplier too small, setting to minimum 0.1")
      this.spacingMultiplier = 0.1
    }
    if (this.spacingMultiplier > 5.0) {
      print("AdvancedSlideLayoutRearrange: Spacing multiplier too large, setting to maximum 5.0")
      this.spacingMultiplier = 5.0
    }

    // Validate scroll system inputs if enabled
    if (this.enableScrollSystem) {
      if (
        !ScrollSystemUtils.validateScrollSystemConfig(this.scrollLineStart, this.scrollLineEnd, this.scrollController)
      ) {
        print(
          "AdvancedSlideLayoutRearrange: Scroll system configuration is invalid - all components (line start, line end, controller) are required"
        )
        return false
      }
    }

    return true
  }

  /**
   * Store the local positions of the five card slots (base positions)
   */
  private setupBasePositions(): void {
    this.basePositions = [
      this.topLastPosition.getTransform().getLocalPosition(),
      this.topPosition.getTransform().getLocalPosition(),
      this.midPosition.getTransform().getLocalPosition(),
      this.bottomPosition.getTransform().getLocalPosition(),
      this.bottomLastPosition.getTransform().getLocalPosition()
    ]

    print(
      "AdvancedSlideLayoutRearrange: Setup base positions in local space - " +
        "TopLast: " +
        this.basePositions[0].toString() +
        ", " +
        "Top: " +
        this.basePositions[1].toString() +
        ", " +
        "Mid: " +
        this.basePositions[2].toString() +
        ", " +
        "Bottom: " +
        this.basePositions[3].toString() +
        ", " +
        "BottomLast: " +
        this.basePositions[4].toString()
    )
  }

  /**
   * Initialize the card manager
   */
  private initializeCardManager(): void {
    this.cardManager = new AdvancedCardManager()
  }

  /**
   * Create initial cards with test data
   */
  private createInitialCards(): void {
    // Determine number of cards to create based on mode
    const cardsToCreate = this.testMode ? this.initialNumberOfCards : 1 // Only welcome card for chat mode

    if (!this.testMode) {
      print("AdvancedSlideLayoutRearrange: Creating minimal cards for chat mode (1 welcome card)")
    }

    for (let i = 0; i < cardsToCreate; i++) {
      let cardType: CardType
      let textContent: string

      if (this.testMode) {
        // Test mode: alternate between user and bot with test content
        cardType = i % 2 === 0 ? CardType.User : CardType.Chatbot
        textContent = this.generateTestText(i)
      } else {
        // Chat mode: only welcome message
        cardType = CardType.Chatbot
        textContent = "Welcome to your AI-powered learning companion! Ask me anything about the topics you're studying."

        // Ensure it respects character limits
        if (textContent.length > CHARACTER_LIMITS.BOT_CARD_TEXT) {
          textContent = textContent.substring(0, CHARACTER_LIMITS.BOT_CARD_TEXT - 3) + "..."
        }
      }

      const prefab = cardType === CardType.User ? this.userCardPrefab : this.chatbotCardPrefab

      const cardData: CardData = {
        id: i,
        type: cardType,
        textContent: textContent,
        size: this.cardManager.calculateCardSize(textContent || "Sample text"), // Handle empty text
        sceneObject: null
      }

      // Instantiate the card
      const cardObject = prefab.instantiate(this.sceneObject)
      cardObject.name = `Card_${i}_${cardType === CardType.User ? "User" : "Bot"}`
      cardData.sceneObject = cardObject

      // Set up the card content
      this.setupCardContent(cardData)

      this.cards.push(cardObject)
      this.cardData.push(cardData)
    }

    if (!this.testMode) {
      print(`AdvancedSlideLayoutRearrange: Created ${cardsToCreate} initial cards for chat mode`)
    }
  }

  /**
   * Generate test text of varying lengths with clear line distinctions
   */
  private generateTestText(index: number): string {
    // Create text for specific line counts to test sizing
    const lineType = index % 8 // Cycle through 8 different types

    switch (lineType) {
      case 0: // 1 line - very short
        return "Hi!"
      case 1: // 1 line - short
        return "How are you today?"
      case 2: // 2 lines - medium
        return "This is a two-line message that should wrap to the second line nicely."
      case 3: // 3 lines - medium-long
        return "This is a three-line message that should demonstrate how the system handles medium-length content that spans multiple lines for testing."
      case 4: // 4 lines - long
        return "This is a four-line message designed to test the middle range of the sizing system. It should provide enough content to demonstrate proper text wrapping and spacing calculations while maintaining readability."
      case 5: // 5 lines - longer
        return "This is a five-line message that tests the system's ability to handle longer content blocks. The text should wrap appropriately across multiple lines while maintaining proper visual hierarchy and spacing between cards in the layout system."
      case 6: // 6 lines - very long
        return "This is a six-line message designed to test how the system handles extensive content that requires significant vertical space. The dynamic sizing algorithm should adjust the card height appropriately while maintaining proper spacing with adjacent cards in the overall layout."
      case 7: // 8 lines - maximum
        return "This is an eight-line message that pushes the system to its maximum content capacity. It demonstrates how the layout handles the largest possible text blocks while maintaining visual consistency and proper spacing calculations. The system should resize the card to accommodate this extensive content while ensuring that the overall chat interface remains balanced and visually appealing throughout the user experience."
      default:
        return "Default message"
    }
  }

  /**
   * Setup card content (text and sizing)
   */
  private setupCardContent(cardData: CardData): void {
    // Try to get the appropriate button component based on card type
    let buttonComponent: any = null

    if (cardData.type === CardType.User) {
      try {
        buttonComponent = cardData.sceneObject.getComponent(ButtonSlideCardUser.getTypeName()) as ButtonSlideCardUser
      } catch (error) {
        // Fallback to generic ButtonSlide
        try {
          buttonComponent = cardData.sceneObject.getComponent(ButtonSlide.getTypeName()) as ButtonSlide
        } catch (fallbackError) {
          print("AdvancedSlideLayoutRearrange: Could not find button component on " + cardData.sceneObject.name)
          return
        }
      }
    } else {
      try {
        buttonComponent = cardData.sceneObject.getComponent(ButtonSlideCardBot.getTypeName()) as ButtonSlideCardBot
      } catch (error) {
        // Fallback to generic ButtonSlide
        try {
          buttonComponent = cardData.sceneObject.getComponent(ButtonSlide.getTypeName()) as ButtonSlide
        } catch (fallbackError) {
          print("AdvancedSlideLayoutRearrange: Could not find button component on " + cardData.sceneObject.name)
          return
        }
      }
    }

    if (buttonComponent) {
      // Set index text
      if (buttonComponent.textIndex) {
        buttonComponent.textIndex.text = cardData.id.toString()
      }

      // Set content text
      if (buttonComponent.textContent) {
        buttonComponent.textContent.text = cardData.textContent
      }

      // Apply dynamic sizing
      if (buttonComponent.applyDynamicSize) {
        buttonComponent.applyDynamicSize(cardData.size)
      }

      print(
        "AdvancedSlideLayoutRearrange: Set up " +
          cardData.type +
          " card " +
          cardData.id +
          " with " +
          cardData.textContent.length +
          " chars"
      )
    }
  }

  /**
   * Calculate dynamic positions based on card sizes
   */
  private calculateDynamicPositions(): void {
    // Get visible card indices
    let indices: {topLast: number; top: number; mid: number; bottom: number; bottomLast: number}

    // FIX: For chat mode, use non-wrapping chronological order
    if (this.chatModeChronological) {
      indices = {
        topLast: this.currentIndex + 2 < this.cardData.length ? this.currentIndex + 2 : -1,
        top: this.currentIndex + 1 < this.cardData.length ? this.currentIndex + 1 : -1,
        mid: this.currentIndex,
        bottom: this.currentIndex - 1 >= 0 ? this.currentIndex - 1 : -1,
        bottomLast: this.currentIndex - 2 >= 0 ? this.currentIndex - 2 : -1
      }
    } else {
      indices = ScrollSystemUtils.calculateVisibleIndices(this.currentIndex, this.cardData.length)
    }

    const visibleIndices = [indices.topLast, indices.top, indices.mid, indices.bottom, indices.bottomLast]

    // Get card sizes for visible cards
    const cardSizes = visibleIndices.map((index) => {
      if (index >= 0 && index < this.cardData.length) {
        return this.cardData[index].size
      }
      return new vec3(25, 5, 3) // Default size
    })

    // Calculate positions with proper spacing
    this.currentPositions = this.cardManager.calculateDynamicPositions(
      this.basePositions,
      cardSizes,
      this.spacingMultiplier
    )
  }

  /**
   * Position the initial 5 visible cards
   */
  private layoutInitialCards(): void {
    // Hide all cards first
    this.cards.forEach((card) => (card.enabled = false))

    // Show and position the first 5 cards
    const indices = ScrollSystemUtils.calculateVisibleIndices(this.currentIndex, this.cardData.length)
    const visibleIndices = [indices.topLast, indices.top, indices.mid, indices.bottom, indices.bottomLast]

    visibleIndices.forEach((cardIndex, positionIndex) => {
      if (cardIndex >= 0 && cardIndex < this.cards.length) {
        const card = this.cards[cardIndex]
        card.enabled = true
        card.getTransform().setLocalPosition(this.currentPositions[positionIndex])
      }
    })
  }

  /**
   * Setup swipe interaction for all cards
   */
  private setupSwipeInteraction(): void {
    this.setupAllCardsManipulation()
  }

  /**
   * Attach InteractableManipulation to a card for swipe detection
   */
  private attachManipulationToCard(card: SceneObject): void {
    let manipulationComponent: any = null

    try {
      manipulationComponent = card.getComponent(InteractableManipulation.getTypeName())
    } catch (error) {
      print("AdvancedSlideLayoutRearrange: Could not access InteractableManipulation on " + card.name)
      return
    }

    if (manipulationComponent && manipulationComponent.onManipulationStart) {
      const onManipulationStartCallback = () => {
        this.startSwipe(card)
      }

      const onManipulationEndCallback = () => {
        this.endSwipe()
      }

      manipulationComponent.onManipulationStart.add(onManipulationStartCallback)
      manipulationComponent.onManipulationEnd.add(onManipulationEndCallback)
    }
  }

  /**
   * Start swiping any card
   */
  private startSwipe(card: SceneObject): void {
    this.swipeState.swipedObject = card
    this.swipeState.originalPosition = card.getTransform().getLocalPosition()
    this.swipeState.originalRotation = card.getTransform().getLocalRotation()
    this.swipeState.isSwipping = true
    this.swipeState.swipeStartTime = getTime()
    this.swipeState.swipeStartPosition = card.getTransform().getLocalPosition()

    print("AdvancedSlideLayoutRearrange: Started swiping " + card.name)
  }

  /**
   * End swiping and snap card back to its original position
   */
  private endSwipe(): void {
    if (!this.swipeState.isSwipping || !this.swipeState.swipedObject) return

    const currentPos = this.swipeState.swipedObject.getTransform().getLocalPosition()
    const swipeDistance = currentPos.distance(this.swipeState.originalPosition)

    // Always return card to its original position
    this.returnCardToOriginalPosition()

    // Reset swipe state
    this.swipeState.isSwipping = false
    this.swipeState.swipedObject = null

    print("AdvancedSlideLayoutRearrange: Ended swipe - distance: " + swipeDistance + ", returning to original position")
  }

  /**
   * Return the swiped card to its original position and rotation
   */
  private returnCardToOriginalPosition(): void {
    if (!this.swipeState.swipedObject) return

    // Reset rotation immediately
    this.swipeState.swipedObject.getTransform().setLocalRotation(this.swipeState.originalRotation)

    this.animatingCards.set(this.swipeState.swipedObject, {
      target: this.swipeState.originalPosition,
      isVisible: true
    })
  }

  /**
   * Update loop - handle animations and test system
   */
  private update = (): void => {
    this.updateAnimations()

    if (this.testMode && this.initialized) {
      this.updateTestSystem()
    }
  }

  /**
   * Update test system - add cards automatically
   */
  private updateTestSystem(): void {
    this.testTimer += getDeltaTime()

    if (this.testTimer >= this.testInterval && this.cardData.length < this.maxTestCards) {
      this.addTestCard()
      this.testTimer = 0
    }
  }

  /**
   * Add a new test card
   */
  private addTestCard(): void {
    const newIndex = this.cardData.length
    const cardType = newIndex % 2 === 0 ? CardType.User : CardType.Chatbot
    const prefab = cardType === CardType.User ? this.userCardPrefab : this.chatbotCardPrefab

    // Generate random text length
    const textContent = this.generateRandomLengthText()

    const cardData: CardData = {
      id: newIndex,
      type: cardType,
      textContent: textContent,
      size: this.cardManager.calculateCardSize(textContent),
      sceneObject: null
    }

    // Instantiate the card
    const cardObject = prefab.instantiate(this.sceneObject)
    cardObject.name = `Card_${newIndex}_${cardType === CardType.User ? "User" : "Bot"}`
    cardData.sceneObject = cardObject
    cardObject.enabled = false // Start hidden

    // Set up the card content
    this.setupCardContent(cardData)

    this.cards.push(cardObject)
    this.cardData.push(cardData)

    print("AdvancedSlideLayoutRearrange: Added test card " + newIndex + " (" + textContent.length + " chars)")

    // Update layout if this affects visible cards
    this.updateCardLayoutToIndex(this.currentIndex)
  }

  /**
   * Generate random length text for testing with specific line targets
   */
  private generateRandomLengthText(): string {
    // Choose a random line count (1-8) for more predictable sizing
    const targetLines = Math.floor(Math.random() * 8) + 1
    const charsPerLine = 45 // Approximate characters per line
    const targetChars = targetLines * charsPerLine

    const words = [
      "Hello",
      "world",
      "this",
      "is",
      "a",
      "test",
      "message",
      "for",
      "the",
      "dynamic",
      "sizing",
      "system",
      "that",
      "should",
      "work",
      "properly",
      "with",
      "different",
      "text",
      "lengths",
      "and",
      "demonstrate",
      "the",
      "automatic",
      "card",
      "resizing",
      "functionality",
      "across",
      "multiple",
      "lines",
      "of",
      "content"
    ]

    let text = ""
    let attempts = 0
    while (text.length < targetChars && attempts < 100) {
      const word = words[Math.floor(Math.random() * words.length)]
      if (text.length + word.length + 1 <= targetChars + 10) {
        // Allow slight overage
        text += (text.length > 0 ? " " : "") + word
      } else {
        break
      }
      attempts++
    }

    // Add line indicator for debugging
    const actualLines = Math.ceil(text.length / charsPerLine)
    print(
      "AdvancedSlideLayoutRearrange: Generated " +
        actualLines +
        "-line text (" +
        text.length +
        " chars): " +
        text.substring(0, 50) +
        "..."
    )

    return text
  }

  // ========== SCROLL SYSTEM METHODS ==========

  /**
   * Called by InteractableLineProjection to update scroll position
   */
  public onScrollValueChanged(normalizedValue: number): void {
    if (!this.enableScrollSystem || !this.initialized) {
      return
    }

    if (!ScrollSystemUtils.isScrollChangeSignificant(this.lastScrollValue, normalizedValue)) {
      return
    }

    this.lastScrollValue = normalizedValue

    const targetIndex = ScrollSystemUtils.calculateTargetIndexFromScrollValue(normalizedValue, this.cardData.length)

    if (targetIndex !== this.currentIndex) {
      this.updateCardLayoutToIndex(targetIndex)
    }

    print("AdvancedSlideLayoutRearrange: Scroll value changed to " + normalizedValue + ", target index: " + targetIndex)
  }

  /**
   * Update the card layout to show a specific card index in the center
   */
  private updateCardLayoutToIndex(targetIndex: number): void {
    this.currentIndex = targetIndex

    // Recalculate dynamic positions based on new visible cards
    this.calculateDynamicPositions()

    // Clean up and hide all cards
    this.cleanupCardAnimations()
    this.hideAllCards()

    // Get visible cards
    let indices: {topLast: number; top: number; mid: number; bottom: number; bottomLast: number}

    // FIX: For chat mode, use non-wrapping chronological order
    // Cards should appear from bottom to top: oldest (index 0) at bottom, newest at top
    if (this.chatModeChronological) {
      // Calculate indices without wrapping - use -1 for positions that don't exist
      indices = {
        topLast: this.currentIndex + 2 < this.cardData.length ? this.currentIndex + 2 : -1,
        top: this.currentIndex + 1 < this.cardData.length ? this.currentIndex + 1 : -1,
        mid: this.currentIndex,
        bottom: this.currentIndex - 1 >= 0 ? this.currentIndex - 1 : -1,
        bottomLast: this.currentIndex - 2 >= 0 ? this.currentIndex - 2 : -1
      }
    } else {
      // Use wrapping mode for non-chat (carousel style)
      indices = ScrollSystemUtils.calculateVisibleIndices(this.currentIndex, this.cardData.length)
    }

    const visibleCards: VisibleCardConfig[] = [
      {
        card: indices.topLast >= 0 && indices.topLast < this.cards.length ? this.cards[indices.topLast] : null,
        position: this.currentPositions[0],
        positionIndex: 0,
        cardIndex: indices.topLast
      },
      {
        card: indices.top >= 0 && indices.top < this.cards.length ? this.cards[indices.top] : null,
        position: this.currentPositions[1],
        positionIndex: 1,
        cardIndex: indices.top
      },
      {
        card: indices.mid >= 0 && indices.mid < this.cards.length ? this.cards[indices.mid] : null,
        position: this.currentPositions[2],
        positionIndex: 2,
        cardIndex: indices.mid
      },
      {
        card: indices.bottom >= 0 && indices.bottom < this.cards.length ? this.cards[indices.bottom] : null,
        position: this.currentPositions[3],
        positionIndex: 3,
        cardIndex: indices.bottom
      },
      {
        card: indices.bottomLast >= 0 && indices.bottomLast < this.cards.length ? this.cards[indices.bottomLast] : null,
        position: this.currentPositions[4],
        positionIndex: 4,
        cardIndex: indices.bottomLast
      }
    ]

    // Animate visible cards to their positions
    visibleCards.forEach(({card, position}) => {
      if (card) {
        card.enabled = true
        this.animatingCards.set(card, {
          target: position,
          isVisible: true
        })
      }
    })

    this.setupAllCardsManipulation()

    print("AdvancedSlideLayoutRearrange: Updated layout to show card " + targetIndex + " in center")
  }

  /**
   * Setup manipulation handlers for all visible cards
   */
  private setupAllCardsManipulation(): void {
    this.clearAllManipulationHandlers()

    this.cards.forEach((card) => {
      if (card.enabled) {
        this.attachManipulationToCard(card)
      }
    })
  }

  /**
   * Clear all manipulation event handlers from all cards
   */
  private clearAllManipulationHandlers(): void {
    this.cards.forEach((card) => {
      try {
        const manipulationComponent = card.getComponent(InteractableManipulation.getTypeName()) as any
        if (manipulationComponent && manipulationComponent.onManipulationStart) {
          manipulationComponent.onManipulationStart.clear()
          manipulationComponent.onManipulationEnd.clear()
        }
      } catch (error) {
        // Ignore if component doesn't exist
      }
    })
  }

  /**
   * Get current scroll value
   */
  public getCurrentScrollValue(): number {
    return ScrollSystemUtils.getCurrentScrollValue(this.currentIndex, this.cardData.length)
  }

  /**
   * Initialize scroll system
   */
  private initializeScrollSystem(): void {
    const initialScrollValue = this.getCurrentScrollValue()
    this.lastScrollValue = initialScrollValue

    print("AdvancedSlideLayoutRearrange: Scroll system initialized with value: " + initialScrollValue)
  }

  /**
   * Update card animations
   */
  private updateAnimations(): void {
    const toRemove: SceneObject[] = []

    this.animatingCards.forEach((animation, card) => {
      // Check if card is null or destroyed
      if (!card || !card.getTransform()) {
        toRemove.push(card)
        return
      }

      try {
        const currentPos = card.getTransform().getLocalPosition()
        const targetPos = animation.target
        const distance = currentPos.distance(targetPos)

        if (distance < 0.1) {
          card.getTransform().setLocalPosition(targetPos)
          if (!animation.isVisible) {
            card.enabled = false
          }
          toRemove.push(card)
        } else {
          const newPos = vec3.lerp(currentPos, targetPos, this.animationSpeed)
          card.getTransform().setLocalPosition(newPos)
        }
      } catch (error) {
        // Card was destroyed, remove from animation
        toRemove.push(card)
      }
    })

    toRemove.forEach((card) => {
      this.animatingCards.delete(card)
    })
  }

  /**
   * Clean up all card animations
   */
  private cleanupCardAnimations(): void {
    this.animatingCards.clear()
  }

  /**
   * Hide all cards
   */
  private hideAllCards(): void {
    this.cards.forEach((card) => {
      card.enabled = false
    })
  }

  /**
   * Get system status for debugging
   */
  public getSystemStatus(): {
    totalCards: number
    visibleCards: number
    currentIndex: number
    testMode: boolean
    testCardsAdded: number
  } {
    return {
      totalCards: this.cardData.length,
      visibleCards: this.cards.filter((card) => card.enabled).length,
      currentIndex: this.currentIndex,
      testMode: this.testMode,
      testCardsAdded: this.testCardCount
    }
  }
}
