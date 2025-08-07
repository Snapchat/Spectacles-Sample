import {InteractableManipulation} from "SpectaclesInteractionKit.lspkg/Components/Interaction/InteractableManipulation/InteractableManipulation"
import { Interactable } from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable"
import {ButtonSlide} from "../Button/ButtonSlide"
import {ScrollSystemUtils, VisibleCardConfig} from "./ScrollSystemUtils"

/**
 * Represents the state of a swiped card
 */
class SwipeState {
  swipedObject: SceneObject | null = null
  originalPosition: vec3 = vec3.zero()
  isSwipping: boolean = false
  swipeStartTime: number = 0
  swipeStartPosition: vec3 = vec3.zero()
  swipeDirection: vec3 = vec3.zero()
}

/**
 * SlideLayoutRearrange - Tinder-like card swiping system
 * 
 * Manages a set of cards where 5 are visible at once:
 * - Top last position (top-most card)
 * - Top position (second card)
 * - Mid position (current/active card - only this one can be swiped)
 * - Bottom position (fourth card)
 * - Bottom last position (bottom-most card)
 * 
 * Swiping the mid card up or down triggers infinite scrolling through the deck
 */
@component
export class SlideLayoutRearrange extends BaseScriptComponent {

  @input
  @hint("Prefab to instantiate for each card")
  cardPrefab: ObjectPrefab;

  @input("int", "10")
  @hint("Total number of cards to handle")
  numberOfCards: number = 10

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

  @input("number", "-10.0")
  @hint("Rotation angle in degrees for the top last card")
  topLastCardRotationZ: number = -10.0

  @input("number", "-5.0")
  @hint("Rotation angle in degrees for the top card")
  topCardRotationZ: number = -5.0

  @input("number", "5.0")
  @hint("Rotation angle in degrees for the bottom card")
  bottomCardRotationZ: number = 5.0

  @input("number", "10.0")
  @hint("Rotation angle in degrees for the bottom last card")
  bottomLastCardRotationZ: number = 10.0

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

  private cards: SceneObject[] = []
  private currentIndex: number = 2 // Start with card 2 in mid position
  private swipeState: SwipeState = new SwipeState()
  private positions: vec3[] = []
  private animatingCards: Map<SceneObject, {target: vec3, isVisible: boolean}> = new Map()
  
  private initialized: boolean = false
  private lastScrollValue: number = -1

  onAwake() {
    this.createEvent("OnStartEvent").bind(this.initialize)
    this.createEvent("UpdateEvent").bind(this.update)
  }

  /**
   * Initialize the slide layout system
   */
  initialize = (): void => {
    if (this.initialized) return

    if (!this.validateInputs()) {
      print("SlideLayoutRearrange: Invalid inputs, cannot initialize")
      return
    }

    this.setupPositions()
    this.createCards()
    this.layoutInitialCards()
    this.setupSwipeInteraction()

    // Initialize scroll system if enabled
    if (this.enableScrollSystem) {
      this.initializeScrollSystem()
    }

    this.initialized = true
    print("SlideLayoutRearrange initialized with " + this.numberOfCards + " cards" + (this.enableScrollSystem ? " (scroll system enabled)" : ""))
  }

  /**
   * Validate required inputs
   */
  private validateInputs(): boolean {
    if (!this.cardPrefab) {
      print("SlideLayoutRearrange: Card prefab is required")
      return false
    }
    if (!this.topLastPosition || !this.topPosition || !this.midPosition || !this.bottomPosition || !this.bottomLastPosition) {
      print("SlideLayoutRearrange: All five position objects are required")
      return false
    }
    if (this.numberOfCards < 5) {
      print("SlideLayoutRearrange: Need at least 5 cards")
      return false
    }
    
    // Validate scroll system inputs if enabled
    if (this.enableScrollSystem) {
      if (!ScrollSystemUtils.validateScrollSystemConfig(this.scrollLineStart, this.scrollLineEnd, this.scrollController)) {
        print("SlideLayoutRearrange: Scroll system configuration is invalid - all components (line start, line end, controller) are required")
        return false
      }
    }
    
    return true
  }

  /**
   * Store the world positions of the five card slots
   */
  private setupPositions(): void {
    this.positions = [
      this.topLastPosition.getTransform().getWorldPosition(),
      this.topPosition.getTransform().getWorldPosition(),
      this.midPosition.getTransform().getWorldPosition(),
      this.bottomPosition.getTransform().getWorldPosition(),
      this.bottomLastPosition.getTransform().getWorldPosition()
    ]
  }

  /**
   * Create all card instances from the prefab
   */
  private createCards(): void {
    for (let i = 0; i < this.numberOfCards; i++) {
      const cardObject = this.cardPrefab.instantiate(this.sceneObject)
      cardObject.name = "Card_" + i
      this.cards.push(cardObject)
    }
  }

  /**
   * Position the initial 5 visible cards
   */
  private layoutInitialCards(): void {
    // Hide all cards first
    this.cards.forEach(card => card.enabled = false)

    // Show and position the first 5 cards
    for (let i = 0; i < 5 && i < this.cards.length; i++) {
      const card = this.cards[i]
      card.enabled = true
      card.getTransform().setWorldPosition(this.positions[i])
      
      // Apply rotation based on position
      this.applyCardRotation(card, i as 0 | 1 | 2 | 3 | 4)
    }
    
    // Update the text index on cards to show their initial numbers
    this.updateCardTextIndices()
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
      print("SlideLayoutRearrange: Could not access InteractableManipulation on " + card.name)
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
      
      print("SlideLayoutRearrange: Connected swipe events for " + card.name)
    }
  }

  /**
   * Start swiping any card
   */
  private startSwipe(card: SceneObject): void {
    this.swipeState.swipedObject = card
    this.swipeState.originalPosition = card.getTransform().getWorldPosition()
    this.swipeState.isSwipping = true
    this.swipeState.swipeStartTime = getTime()
    this.swipeState.swipeStartPosition = card.getTransform().getWorldPosition()
    
    print("SlideLayoutRearrange: Started swiping " + card.name)
  }

  /**
   * End swiping and snap card back to its original position
   */
  private endSwipe(): void {
    if (!this.swipeState.isSwipping || !this.swipeState.swipedObject) return

    const currentPos = this.swipeState.swipedObject.getTransform().getWorldPosition()
    const swipeDistance = currentPos.distance(this.swipeState.originalPosition)
    
    // Always return card to its original position
    this.returnCardToOriginalPosition()

    // Reset swipe state
    this.swipeState.isSwipping = false
    this.swipeState.swipedObject = null
    
    print("SlideLayoutRearrange: Ended swipe - distance: " + swipeDistance + ", returning to original position")
  }

  /**
   * Handle swipe up - move to previous card
   */
  private swipeUp(): void {
    print("SlideLayoutRearrange: Swiping up")
    
    // Move current mid card off screen upward
    this.animateCardOut(this.swipeState.swipedObject, true)
    
    // Update current index (go backwards, with wrap-around)
    this.currentIndex = (this.currentIndex - 1 + this.numberOfCards) % this.numberOfCards
    
    // Rearrange cards
    this.rearrangeCardsAfterSwipe()
  }

  /**
   * Handle swipe down - move to next card
   */
  private swipeDown(): void {
    print("SlideLayoutRearrange: Swiping down")
    
    // Move current mid card off screen downward
    this.animateCardOut(this.swipeState.swipedObject, false)
    
    // Update current index (go forwards, with wrap-around)
    this.currentIndex = (this.currentIndex + 1) % this.numberOfCards
    
    // Rearrange cards
    this.rearrangeCardsAfterSwipe()
  }

  /**
   * Return the swiped card to mid position
   */
  private returnCardToMid(): void {
    if (!this.swipeState.swipedObject) return
    
    this.animatingCards.set(this.swipeState.swipedObject, {
      target: this.positions[2], // Mid position
      isVisible: true
    })
  }

  /**
   * Return the swiped card to its original position
   */
  private returnCardToOriginalPosition(): void {
    if (!this.swipeState.swipedObject) return
    
    this.animatingCards.set(this.swipeState.swipedObject, {
      target: this.swipeState.originalPosition, // Original position
      isVisible: true
    })
  }

  /**
   * Animate a card off screen
   */
  private animateCardOut(card: SceneObject, toUp: boolean): void {
    const midPos = this.positions[2]
    const offScreenDistance = 200 // Distance to move off screen
    const direction = toUp ? 1 : -1
    const targetPos = new vec3(
      midPos.x,
      midPos.y + (offScreenDistance * direction),
      midPos.z
    )
    
    this.animatingCards.set(card, {
      target: targetPos,
      isVisible: false
    })
  }

  /**
   * Rearrange all cards after a swipe
   */
  private rearrangeCardsAfterSwipe(): void {
    // Use the same clean logic as updateCardLayoutToIndex for consistency
    this.updateCardLayoutToIndex(this.currentIndex)
  }

  /**
   * Get the current mid card
   */
  private getCurrentMidCard(): SceneObject | null {
    if (this.currentIndex >= 0 && this.currentIndex < this.cards.length) {
      return this.cards[this.currentIndex]
    }
    return null
  }

  /**
   * Update loop - handle animations
   */
  private update = (): void => {
    this.updateAnimations()
  }

  /**
   * Update card animations
   */
  private updateAnimations(): void {
    const toRemove: SceneObject[] = []
    
    this.animatingCards.forEach((animation, card) => {
      // Safety check - ensure card still exists
      if (!card) {
        toRemove.push(card)
        return
      }
      
      const currentPos = card.getTransform().getWorldPosition()
      const targetPos = animation.target
      const distance = currentPos.distance(targetPos)
      
      if (distance < 0.1) {
        // Animation complete
        card.getTransform().setWorldPosition(targetPos)
        if (!animation.isVisible) {
          card.enabled = false
          print("SlideLayoutRearrange: Animation complete - hiding card " + card.name)
        } else {
          print("SlideLayoutRearrange: Animation complete - card " + card.name + " at position")
        }
        toRemove.push(card)
      } else {
        // Continue animation
        const newPos = vec3.lerp(currentPos, targetPos, this.animationSpeed)
        card.getTransform().setWorldPosition(newPos)
      }
    })
    
    // Remove completed animations
    toRemove.forEach(card => {
      this.animatingCards.delete(card)
    })
  }

  /**
   * Update the text index on cards to show their current number
   */
  private updateCardTextIndices(): void {
    const indices = ScrollSystemUtils.calculateVisibleIndices(this.currentIndex, this.numberOfCards)

    const cardIndices = [
      { card: this.cards[indices.topLast], index: indices.topLast },
      { card: this.cards[indices.top], index: indices.top },
      { card: this.cards[indices.mid], index: indices.mid },
      { card: this.cards[indices.bottom], index: indices.bottom },
      { card: this.cards[indices.bottomLast], index: indices.bottomLast }
    ]

    cardIndices.forEach(({card, index}) => {
      if (card && card.enabled) {
        const buttonSlide = card.getComponent(ButtonSlide.getTypeName()) as ButtonSlide
        if (buttonSlide && buttonSlide.textIndex) {
          buttonSlide.textIndex.text = index.toString()
          print("SlideLayoutRearrange: Updated card text to: " + index)
        }
      }
    })
  }

  /**
   * Get current card indices for debugging
   */
  public getCurrentIndices(): {topLast: number, top: number, mid: number, bottom: number, bottomLast: number} {
    return ScrollSystemUtils.calculateVisibleIndices(this.currentIndex, this.numberOfCards)
  }

  /**
   * Manually trigger swipe up (for testing)
   */
  public manualSwipeUp(): void {
    if (!this.swipeState.isSwipping) {
      const midCard = this.getCurrentMidCard()
      if (midCard) {
        this.swipeState.swipedObject = midCard
        this.swipeUp()
        this.swipeState.swipedObject = null
      }
    }
  }

  /**
   * Manually trigger swipe down (for testing)
   */
  public manualSwipeDown(): void {
    if (!this.swipeState.isSwipping) {
      const midCard = this.getCurrentMidCard()
      if (midCard) {
        this.swipeState.swipedObject = midCard
        this.swipeDown()
        this.swipeState.swipedObject = null
      }
    }
  }

  /**
   * Enable or disable manipulation interaction on a card
   */
  private setCardManipulationEnabled(card: SceneObject, enabled: boolean): void {
    try {
      const manipulationComponent = card.getComponent(InteractableManipulation.getTypeName()) as any
      if (manipulationComponent) {
        manipulationComponent.enabled = enabled
        print("SlideLayoutRearrange: Set manipulation " + (enabled ? "enabled" : "disabled") + " for " + card.name)
      }

      const interactableComponent = card.getComponent(Interactable.getTypeName()) as any
      if (interactableComponent) {
        interactableComponent.enabled = enabled
      }
    } catch (error) {
      print("SlideLayoutRearrange: Could not access manipulation components on " + card.name + ": " + error)
    }
  }

  /**
   * Apply rotation to a card based on its position
   */
  private applyCardRotation(card: SceneObject, position: 0 | 1 | 2 | 3 | 4): void {
    const transform = card.getTransform()
    let rotationZ = 0
    
    switch (position) {
      case 0: // Top last position
        rotationZ = this.topLastCardRotationZ
        break
      case 1: // Top position
        rotationZ = this.topCardRotationZ
        break
      case 2: // Mid position
        rotationZ = 0
        break
      case 3: // Bottom position
        rotationZ = this.bottomCardRotationZ
        break
      case 4: // Bottom last position
        rotationZ = this.bottomLastCardRotationZ
        break
    }
    
    const currentRotation = transform.getLocalRotation()
    const newRotation = quat.fromEulerAngles(
      currentRotation.toEulerAngles().x,
      currentRotation.toEulerAngles().y,
      rotationZ * Math.PI / 180 // Convert degrees to radians
    )
    transform.setLocalRotation(newRotation)
  }

  /**
   * Clear all manipulation event handlers from all cards
   */
  private clearAllManipulationHandlers(): void {
    this.cards.forEach(card => {
      try {
        const manipulationComponent = card.getComponent(InteractableManipulation.getTypeName()) as any
        if (manipulationComponent && manipulationComponent.onManipulationStart) {
          manipulationComponent.onManipulationStart.clear()
          manipulationComponent.onManipulationEnd.clear()
        }
      } catch (error) {
        // Ignore if component doesn't exist or can't be accessed
      }
    })
  }

  /**
   * Setup manipulation handlers only for the mid card
   */
  private setupMidCardManipulation(): void {
    // Clear all existing handlers first
    this.clearAllManipulationHandlers()
    
    // Setup interaction only for the current mid card
    const midCard = this.getCurrentMidCard()
    if (midCard) {
      this.attachManipulationToCard(midCard)
    }
  }

  /**
   * Setup manipulation handlers for all visible cards
   */
  private setupAllCardsManipulation(): void {
    // Clear all existing handlers first
    this.clearAllManipulationHandlers()
    
    // Setup interaction for all currently visible cards
    this.cards.forEach(card => {
      if (card.enabled) {
        this.attachManipulationToCard(card)
      }
    })
  }

  // ========== SCROLL SYSTEM METHODS ==========

  /**
   * Called by InteractableLineProjection to update scroll position
   * @param normalizedValue Value between 0 and 1 representing position along scroll line
   */
  public onScrollValueChanged(normalizedValue: number): void {
    if (!this.enableScrollSystem || !this.initialized) {
      return
    }

    // Avoid redundant updates
    if (!ScrollSystemUtils.isScrollChangeSignificant(this.lastScrollValue, normalizedValue)) {
      return
    }

    this.lastScrollValue = normalizedValue
    
    // Calculate which card should be in the center based on normalized value
    const targetIndex = ScrollSystemUtils.calculateTargetIndexFromScrollValue(normalizedValue, this.numberOfCards)
    
    // Update card layout if index changed
    if (targetIndex !== this.currentIndex) {
      this.updateCardLayoutToIndex(targetIndex)
    }
    
    print("SlideLayoutRearrange: Scroll value changed to " + normalizedValue + ", target index: " + targetIndex)
  }

  /**
   * Update the card layout to show a specific card index in the center
   * @param targetIndex Index of the card to show in center position
   */
  private updateCardLayoutToIndex(targetIndex: number): void {
    // Update current index
    this.currentIndex = targetIndex
    
    // Calculate which cards should be visible using utility
    const indices = ScrollSystemUtils.calculateVisibleIndices(this.currentIndex, this.numberOfCards)
    const visibleCardIndices = new Set([indices.topLast, indices.top, indices.mid, indices.bottom, indices.bottomLast])

    // Clear all existing animations and hide all cards first
    this.cleanupCardAnimations()
    this.hideAllCards()

    const visibleCards: VisibleCardConfig[] = [
      { card: this.cards[indices.topLast], position: this.positions[0], positionIndex: 0, cardIndex: indices.topLast },
      { card: this.cards[indices.top], position: this.positions[1], positionIndex: 1, cardIndex: indices.top },
      { card: this.cards[indices.mid], position: this.positions[2], positionIndex: 2, cardIndex: indices.mid },
      { card: this.cards[indices.bottom], position: this.positions[3], positionIndex: 3, cardIndex: indices.bottom },
      { card: this.cards[indices.bottomLast], position: this.positions[4], positionIndex: 4, cardIndex: indices.bottomLast }
    ]

    // Animate visible cards to their positions
    visibleCards.forEach(({card, position, positionIndex}) => {
      card.enabled = true
      this.animatingCards.set(card, {
        target: position,
        isVisible: true
      })
      
      // Apply rotation based on position
      this.applyCardRotation(card, positionIndex as 0 | 1 | 2 | 3 | 4)
    })

    // Setup interaction for all cards
    this.setupAllCardsManipulation()

    // Update the text index on cards to show their current number
    this.updateCardTextIndices()
    
    // Validate card visibility for debugging
    this.validateCardVisibility()
    
    print("SlideLayoutRearrange: Updated layout to show card " + targetIndex + " in center. Visible cards: " + Array.from(visibleCardIndices).join(", "))
  }

  /**
   * Get the current scroll value (0-1) based on current card index
   * @returns Normalized scroll value
   */
  public getCurrentScrollValue(): number {
    return ScrollSystemUtils.getCurrentScrollValue(this.currentIndex, this.numberOfCards)
  }

  /**
   * Manually set the scroll position (useful for initialization)
   * @param normalizedValue Value between 0 and 1
   */
  public setScrollPosition(normalizedValue: number): void {
    this.onScrollValueChanged(normalizedValue)
  }

  /**
   * Get scroll system status
   */
  public getScrollSystemInfo(): {enabled: boolean, currentValue: number, targetIndex: number} {
    return {
      enabled: this.enableScrollSystem,
      currentValue: this.lastScrollValue,
      targetIndex: this.currentIndex
    }
  }

  /**
   * Get detailed card status for debugging
   */
  public getCardStatus(): {totalCards: number, visibleCards: number, animatingCards: number, cardStates: {name: string, enabled: boolean, animating: boolean}[]} {
    const cardStates = this.cards.map(card => ({
      name: card.name,
      enabled: card.enabled,
      animating: this.animatingCards.has(card)
    }))
    
    return {
      totalCards: this.cards.length,
      visibleCards: this.cards.filter(card => card.enabled).length,
      animatingCards: this.animatingCards.size,
      cardStates: cardStates
    }
  }

  /**
   * Initialize the scroll system - set initial position based on current card index
   */
  private initializeScrollSystem(): void {
    // Set initial scroll value based on current card index
    const initialScrollValue = this.getCurrentScrollValue()
    this.lastScrollValue = initialScrollValue
    
    print("SlideLayoutRearrange: Scroll system initialized with value: " + initialScrollValue)
  }

  /**
   * Clean up all card animations to prevent overlapping
   */
  private cleanupCardAnimations(): void {
    this.animatingCards.clear()
    print("SlideLayoutRearrange: Cleared all card animations")
  }

  /**
   * Hide all cards completely
   */
  private hideAllCards(): void {
    this.cards.forEach(card => {
      card.enabled = false
    })
    print("SlideLayoutRearrange: Hidden all cards")
  }

  /**
   * Validate that only 5 cards are visible (for debugging)
   */
  private validateCardVisibility(): void {
    const visibleCards = this.cards.filter(card => card.enabled)
    if (visibleCards.length !== 5) {
      print("SlideLayoutRearrange: WARNING - Expected 5 visible cards, but found " + visibleCards.length)
      print("SlideLayoutRearrange: Visible cards: " + visibleCards.map(card => card.name).join(", "))
    } else {
      print("SlideLayoutRearrange: Card visibility OK - 5 cards visible")
    }
  }
}
