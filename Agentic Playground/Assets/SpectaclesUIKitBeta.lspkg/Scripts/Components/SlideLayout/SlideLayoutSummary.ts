import { InteractableManipulation } from "SpectaclesInteractionKit.lspkg/Components/Interaction/InteractableManipulation/InteractableManipulation"
import { Interactable } from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable"
import { ButtonSlideSummary } from "../Button/ButtonSlideSummary"

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

@component
export class SlideLayoutSummary extends BaseScriptComponent {

  @input
  @hint("Prefab to instantiate for each card")
  cardPrefab: ObjectPrefab;

  @input("int", "10")
  @hint("Total number of cards to handle")
  numberOfCards: number = 10

  @input("SceneObject")
  @hint("Transform for the left position")
  leftPosition: SceneObject = null

  @input("SceneObject")
  @hint("Transform for the center position (active/swipeable)")
  centerPosition: SceneObject = null

  @input("SceneObject")
  @hint("Transform for the right position")
  rightPosition: SceneObject = null

  @input("number", "50.0")
  @hint("Minimum swipe distance to trigger card change")
  swipeThreshold: number = 50.0

  @input("number", "0.5")
  @hint("Animation speed for card transitions (0-1)")
  animationSpeed: number = 0.5

  @input("number", "100.0")
  @hint("Minimum swipe speed (distance/time) to trigger quick swipe")
  swipeSpeedThreshold: number = 100.0

  @input("number", "-15.0")
  @hint("Rotation angle in degrees for the left card (negative tilts left)")
  leftCardRotationZ: number = -15.0

  @input("number", "15.0")
  @hint("Rotation angle in degrees for the right card (positive tilts right)")
  rightCardRotationZ: number = 15.0

  private cards: SceneObject[] = []
  private currentIndex: number = 1 // Start with card 1 in center
  private swipeState: SwipeState = new SwipeState()
  private animatingCards: Map<SceneObject, { target: vec3, isVisible: boolean }> = new Map()

  private initialized: boolean = false

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

    this.createCards()
    this.layoutInitialCards()
    this.setupSwipeInteraction()

    this.initialized = true
    print("SlideLayoutRearrange initialized with " + this.numberOfCards + " cards")
  }

  /**
   * Validate required inputs
   */
  private validateInputs(): boolean {
    if (!this.cardPrefab) {
      print("SlideLayoutRearrange: Card prefab is required")
      return false
    }
    if (!this.leftPosition || !this.centerPosition || !this.rightPosition) {
      print("SlideLayoutRearrange: All three position objects are required")
      return false
    }
    if (this.numberOfCards < 3) {
      print("SlideLayoutRearrange: Need at least 3 cards")
      return false
    }
    return true
  }

  /**
   * Get the local positions of the three card slots
   */
  private getLocalPositions(): vec3[] {
    return [
      this.leftPosition.getTransform().getLocalPosition(),
      this.centerPosition.getTransform().getLocalPosition(),
      this.rightPosition.getTransform().getLocalPosition()
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
   * Position the initial 3 visible cards
   */
  private layoutInitialCards(): void {
    const positions = this.getLocalPositions()

    // Hide all cards first
    this.cards.forEach(card => card.enabled = false)

    // Show and position the first 3 cards
    for (let i = 0; i < 3 && i < this.cards.length; i++) {
      const card = this.cards[i]
      card.enabled = true
      card.getTransform().setLocalPosition(positions[i])

      // Apply rotation based on position
      this.applyCardRotation(card, i as 0 | 1 | 2)

      // Enable manipulation only for center card (index 1)
      this.setCardManipulationEnabled(card, i === 1)
    }

    // Update the text index on cards to show their initial numbers
    this.updateCardTextIndices()
  }

  /**
   * Setup swipe interaction for the center card
   */
  private setupSwipeInteraction(): void {
    this.setupCenterCardManipulation()
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
   * Start swiping the center card
   */
  private startSwipe(card: SceneObject): void {
    this.swipeState.swipedObject = card
    this.swipeState.originalPosition = card.getTransform().getLocalPosition()
    this.swipeState.isSwipping = true
    this.swipeState.swipeStartTime = getTime()
    this.swipeState.swipeStartPosition = card.getTransform().getLocalPosition()

    print("SlideLayoutRearrange: Started swiping " + card.name)
  }

  /**
   * End swiping and determine if we should change cards
   */
  private endSwipe(): void {
    if (!this.swipeState.isSwipping || !this.swipeState.swipedObject) return

    const currentPos = this.swipeState.swipedObject.getTransform().getLocalPosition()
    const swipeDistance = currentPos.distance(this.swipeState.originalPosition)
    const swipeTime = getTime() - this.swipeState.swipeStartTime
    const swipeSpeed = swipeTime > 0 ? swipeDistance / swipeTime : 0

    // Calculate swipe direction (mainly interested in left/right)
    const swipeVector = currentPos.sub(this.swipeState.originalPosition)
    const isRightSwipe = swipeVector.x > 0

    // Determine if swipe is strong enough to trigger card change
    const shouldChangeCard = swipeDistance > this.swipeThreshold || swipeSpeed > this.swipeSpeedThreshold

    if (shouldChangeCard) {
      if (isRightSwipe) {
        this.swipeRight()
      } else {
        this.swipeLeft()
      }
    } else {
      // Return card to center position
      this.returnCardToCenter()
    }

    // Reset swipe state
    this.swipeState.isSwipping = false
    this.swipeState.swipedObject = null

    print("SlideLayoutRearrange: Ended swipe - distance: " + swipeDistance + ", speed: " + swipeSpeed + ", changed: " + shouldChangeCard)
  }

  /**
   * Handle swipe right - move to previous card
   */
  private swipeRight(): void {
    print("SlideLayoutRearrange: Swiping right")

    // Move current center card off screen to the right
    this.animateCardOut(this.swipeState.swipedObject, true)

    // Update current index (go backwards, with wrap-around)
    this.currentIndex = (this.currentIndex - 1 + this.numberOfCards) % this.numberOfCards

    // Rearrange cards
    this.rearrangeCardsAfterSwipe()
  }

  /**
   * Handle swipe left - move to next card
   */
  private swipeLeft(): void {
    print("SlideLayoutRearrange: Swiping left")

    // Move current center card off screen to the left
    this.animateCardOut(this.swipeState.swipedObject, false)

    // Update current index (go forwards, with wrap-around)
    this.currentIndex = (this.currentIndex + 1) % this.numberOfCards

    // Rearrange cards
    this.rearrangeCardsAfterSwipe()
  }

  /**
   * Return the swiped card to center position
   */
  private returnCardToCenter(): void {
    if (!this.swipeState.swipedObject) return

    const positions = this.getLocalPositions()
    this.animatingCards.set(this.swipeState.swipedObject, {
      target: positions[1], // Center position
      isVisible: true
    })
  }

  /**
   * Animate a card off screen
   */
  private animateCardOut(card: SceneObject, toRight: boolean): void {
    const positions = this.getLocalPositions()
    const centerPos = positions[1]
    const offScreenDistance = 200 // Distance to move off screen
    const direction = toRight ? 1 : -1
    const targetPos = new vec3(
      centerPos.x + (offScreenDistance * direction),
      centerPos.y,
      centerPos.z
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
    const positions = this.getLocalPositions()

    // Disable manipulation for all cards first
    this.cards.forEach(card => {
      if (!this.animatingCards.has(card)) {
        card.enabled = false
      }
      this.setCardManipulationEnabled(card, false)
    })

    // Calculate which cards should be visible
    const leftIndex = (this.currentIndex - 1 + this.numberOfCards) % this.numberOfCards
    const centerIndex = this.currentIndex
    const rightIndex = (this.currentIndex + 1) % this.numberOfCards

    const visibleCards = [
      { card: this.cards[leftIndex], position: positions[0], positionIndex: 0 },
      { card: this.cards[centerIndex], position: positions[1], positionIndex: 1 },
      { card: this.cards[rightIndex], position: positions[2], positionIndex: 2 }
    ]

    // Animate visible cards to their positions
    visibleCards.forEach(({ card, position, positionIndex }) => {
      card.enabled = true
      this.animatingCards.set(card, {
        target: position,
        isVisible: true
      })

      // Apply rotation based on position
      this.applyCardRotation(card, positionIndex as 0 | 1 | 2)

      // Enable manipulation only for center card (positionIndex === 1)
      this.setCardManipulationEnabled(card, positionIndex === 1)
    })

    // Setup swipe interaction for the new center card
    this.setupCenterCardManipulation()

    // Update the text index on cards to show their current number
    this.updateCardTextIndices()
  }

  /**
   * Get the current center card
   */
  private getCurrentCenterCard(): SceneObject | null {
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
      const currentPos = card.getTransform().getLocalPosition()
      const targetPos = animation.target
      const distance = currentPos.distance(targetPos)

      if (distance < 0.1) {
        // Animation complete
        card.getTransform().setLocalPosition(targetPos)
        if (!animation.isVisible) {
          card.enabled = false
        }
        toRemove.push(card)
      } else {
        // Continue animation
        const newPos = vec3.lerp(currentPos, targetPos, this.animationSpeed)
        card.getTransform().setLocalPosition(newPos)
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
    const leftIndex = (this.currentIndex - 1 + this.numberOfCards) % this.numberOfCards
    const centerIndex = this.currentIndex
    const rightIndex = (this.currentIndex + 1) % this.numberOfCards

    const cardIndices = [
      { card: this.cards[leftIndex], index: leftIndex },
      { card: this.cards[centerIndex], index: centerIndex },
      { card: this.cards[rightIndex], index: rightIndex }
    ]

    cardIndices.forEach(({ card, index }) => {
      if (card && card.enabled) {
        const buttonSlide = card.getComponent(ButtonSlideSummary.getTypeName()) as ButtonSlideSummary
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
  public getCurrentIndices(): { left: number, center: number, right: number } {
    const leftIndex = (this.currentIndex - 1 + this.numberOfCards) % this.numberOfCards
    const rightIndex = (this.currentIndex + 1) % this.numberOfCards

    return {
      left: leftIndex,
      center: this.currentIndex,
      right: rightIndex
    }
  }

  /**
   * Manually trigger swipe left (for testing)
   */
  public manualSwipeLeft(): void {
    if (!this.swipeState.isSwipping) {
      const centerCard = this.getCurrentCenterCard()
      if (centerCard) {
        this.swipeState.swipedObject = centerCard
        this.swipeLeft()
        this.swipeState.swipedObject = null
      }
    }
  }

  /**
   * Manually trigger swipe right (for testing)
   */
  public manualSwipeRight(): void {
    if (!this.swipeState.isSwipping) {
      const centerCard = this.getCurrentCenterCard()
      if (centerCard) {
        this.swipeState.swipedObject = centerCard
        this.swipeRight()
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
  private applyCardRotation(card: SceneObject, position: 0 | 1 | 2): void {
    const transform = card.getTransform()
    let rotationZ = 0

    switch (position) {
      case 0: // Left position
        rotationZ = this.leftCardRotationZ
        break
      case 1: // Center position
        rotationZ = 0
        break
      case 2: // Right position
        rotationZ = this.rightCardRotationZ
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
   * Setup manipulation handlers only for the center card
   */
  private setupCenterCardManipulation(): void {
    // Clear all existing handlers first
    this.clearAllManipulationHandlers()

    // Setup interaction only for the current center card
    const centerCard = this.getCurrentCenterCard()
    if (centerCard) {
      this.attachManipulationToCard(centerCard)
    }
  }
}
