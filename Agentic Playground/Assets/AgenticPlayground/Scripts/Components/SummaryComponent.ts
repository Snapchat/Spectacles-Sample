import {Interactable} from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable"
import {InteractableManipulation} from "SpectaclesInteractionKit.lspkg/Components/Interaction/InteractableManipulation/InteractableManipulation"
import {ButtonSlideSummary} from "../../../SpectaclesUIKitBeta.lspkg/Scripts/Components/Button/ButtonSlideSummary"
import {RoundedRectangleVisualCardBot} from "../../../SpectaclesUIKitBeta.lspkg/Scripts/Visuals/RoundedRectangle/RoundedRectangleVisualCardBot"
import {RoundedRectangleVisualCardSummary} from "../../../SpectaclesUIKitBeta.lspkg/Scripts/Visuals/RoundedRectangle/RoundedRectangleVisualCardSummary"

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
 * Lecture content data structure
 */
interface LectureContent {
  title: string
  content: string
}

@component
export class SummaryComponent extends BaseScriptComponent {
  @input
  @hint("Prefab to instantiate for each card")
  cardPrefab: ObjectPrefab

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

  @input("boolean", "false")
  @hint(
    "Enable test mode with randomly generated lecture content - DEPRECATED: Use SummaryBridge test framework instead"
  )
  testMode: boolean = false

  private cards: SceneObject[] = []
  private currentIndex: number = 1 // Start with card 1 in center
  private swipeState: SwipeState = new SwipeState()
  private animatingCards: Map<SceneObject, {target: vec3; isVisible: boolean}> = new Map()
  private lectureContent: LectureContent[] = []

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
      print("AdvancedSlideLayoutSummary: Invalid inputs, cannot initialize")
      return
    }

    // In test mode, create 10 cards with content
    if (this.testMode) {
      this.numberOfCards = 10
      this.generateLectureContent()
      this.createCards()
      this.layoutInitialCards()
    } else {
      // In non-test mode, start with no cards - they'll be created dynamically
      this.numberOfCards = 0
      this.cards = []
      this.currentIndex = -1 // No cards yet, so no current index
      print("AdvancedSlideLayoutSummary: Starting with 0 cards (dynamic mode)")
    }

    this.setupSwipeInteraction()
    this.initialized = true
    print(
      "AdvancedSlideLayoutSummary initialized" +
        (this.testMode ? " with " + this.numberOfCards + " cards (TEST MODE)" : " in DYNAMIC mode")
    )
  }

  /**
   * Validate required inputs
   */
  private validateInputs(): boolean {
    if (!this.cardPrefab) {
      print("AdvancedSlideLayoutSummary: Card prefab is required")
      return false
    }
    if (!this.leftPosition || !this.centerPosition || !this.rightPosition) {
      print("AdvancedSlideLayoutSummary: All three position objects are required")
      return false
    }
    if (this.numberOfCards < 3) {
      print("AdvancedSlideLayoutSummary: Need at least 3 cards")
      return false
    }
    return true
  }

  /**
   * Generate random lecture content for testing
   */
  private generateLectureContent(): void {
    if (!this.testMode) return

    const sampleTitles = [
      "Introduction to Machine Learning Fundamentals",
      "Deep Neural Networks and Backpropagation",
      "Convolutional Neural Networks for Image Processing",
      "Natural Language Processing with Transformers",
      "Reinforcement Learning and Q-Learning",
      "Computer Vision and Object Detection",
      "Generative Adversarial Networks (GANs)",
      "Time Series Analysis and Forecasting",
      "Clustering Algorithms and Unsupervised Learning",
      "Ethics in AI and Responsible Development"
    ]

    const sampleContentParts = [
      "Machine learning is a subset of artificial intelligence that enables computers to learn and improve from experience without being explicitly programmed. This field has transformed how we approach complex problems across various industries.",
      "The key concepts include supervised learning, unsupervised learning, and reinforcement learning paradigms. Supervised learning uses labeled data to train models that can make predictions on new, unseen data.",
      "Feature engineering plays a crucial role in determining the success of machine learning models. It involves selecting, transforming, and creating relevant features from raw data to improve model performance.",
      "Cross-validation techniques help ensure model generalization and prevent overfitting. Common methods include k-fold cross-validation, stratified sampling, and time series split validation.",
      "Deep learning architectures have revolutionized fields like computer vision and natural language processing. Neural networks with multiple hidden layers can learn complex patterns and representations.",
      "Gradient descent optimization algorithms are fundamental to training neural networks effectively. Variants like Adam, RMSprop, and SGD with momentum have different convergence properties and use cases.",
      "Regularization techniques such as dropout and batch normalization improve model performance. These methods prevent overfitting and help models generalize better to unseen data.",
      "Transfer learning allows us to leverage pre-trained models for new tasks with limited data. This approach significantly reduces training time and computational requirements.",
      "Ensemble methods like random forests and boosting combine multiple models for better predictions. These techniques often outperform individual models by reducing variance and bias.",
      "Model evaluation metrics vary depending on the problem type: classification, regression, or clustering. Accuracy, precision, recall, F1-score, and AUC are commonly used metrics.",
      "Data preprocessing and cleaning are essential steps before applying any machine learning algorithm. This includes handling missing values, outliers, and feature scaling.",
      "Hyperparameter tuning can significantly impact model performance and requires systematic approaches. Grid search, random search, and Bayesian optimization are popular methods.",
      "Bias and variance tradeoffs are important considerations in model selection and evaluation. Understanding this balance helps in choosing appropriate model complexity.",
      "Real-world applications require careful consideration of computational resources and scalability. Model deployment involves optimization for inference speed and memory usage.",
      "Interpretability and explainability become increasingly important in production AI systems. LIME, SHAP, and attention mechanisms help understand model decisions.",
      "Convolutional neural networks excel at image processing tasks through spatial feature learning. Pooling layers, activation functions, and filter design are key architectural choices.",
      "Recurrent neural networks and transformers are designed for sequential data processing. LSTM, GRU, and attention mechanisms handle temporal dependencies effectively.",
      "Unsupervised learning techniques like clustering and dimensionality reduction reveal hidden patterns in data. K-means, DBSCAN, and PCA are foundational algorithms in this area.",
      "Reinforcement learning agents learn optimal actions through trial and error in dynamic environments. Q-learning, policy gradients, and actor-critic methods are core approaches.",
      "Natural language processing involves text tokenization, embedding generation, and semantic understanding. Pre-trained models like BERT and GPT have transformed this field.",
      "Computer vision tasks include object detection, image segmentation, and facial recognition. CNNs, YOLO, and R-CNN architectures are widely used for these applications.",
      "Time series forecasting requires understanding temporal patterns, seasonality, and trend components. ARIMA, LSTM, and Prophet models are commonly used for prediction tasks.",
      "Anomaly detection identifies unusual patterns that deviate from expected behavior. Statistical methods, isolation forests, and autoencoders are effective approaches.",
      "Recommendation systems use collaborative filtering and content-based methods to suggest relevant items. Matrix factorization and deep learning approaches improve personalization.",
      "Ethical considerations in AI include fairness, accountability, and transparency in algorithmic decision-making. Bias detection and mitigation are crucial for responsible AI deployment."
    ]

    this.lectureContent = []

    for (let i = 0; i < 10; i++) {
      const title = sampleTitles[i].substring(0, 157)

      // Generate content with random parts and occasional blank lines
      let content = ""
      const numParts = Math.floor(Math.random() * 3) + 2 // 2-4 parts

      for (let j = 0; j < numParts; j++) {
        if (j > 0) {
          // 30% chance of adding a blank line
          if (Math.random() < 0.3) {
            content += "\n\n"
          } else {
            content += " "
          }
        }

        // Add 1-3 random content parts
        const partsToAdd = Math.floor(Math.random() * 3) + 1
        for (let k = 0; k < partsToAdd; k++) {
          const randomPart = sampleContentParts[Math.floor(Math.random() * sampleContentParts.length)]
          content += randomPart
          if (k < partsToAdd - 1) content += " "
        }
      }

      // Ensure content doesn't exceed 785 characters
      if (content.length > 785) {
        content = content.substring(0, 782) + "..."
      }

      this.lectureContent.push({
        title: title,
        content: content
      })
    }
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

      // Populate card with lecture content if in test mode
      if (this.testMode && i < this.lectureContent.length) {
        this.populateCardContent(cardObject, this.lectureContent[i])
      } else if (!this.testMode) {
        // Ensure cards are empty when not in test mode
        this.populateCardContent(cardObject, {title: "", content: ""})
      }
    }
  }

  /**
   * Populate card with title and content text
   */
  private populateCardContent(card: SceneObject, content: LectureContent): void {
    try {
      const buttonSlide = card.getComponent(ButtonSlideSummary.getTypeName()) as ButtonSlideSummary
      if (buttonSlide) {
        // Use the specific text components from ButtonSlideSummary
        if (buttonSlide.textTitle) {
          buttonSlide.textTitle.text = content.title
          print(
            "AdvancedSlideLayoutSummary: Set title for " + card.name + ": " + content.title.substring(0, 30) + "..."
          )
        } else {
          print("AdvancedSlideLayoutSummary: textTitle not found in ButtonSlideSummary for " + card.name)
        }

        if (buttonSlide.textContent) {
          buttonSlide.textContent.text = content.content
          print("AdvancedSlideLayoutSummary: Set content for " + card.name + " (" + content.content.length + " chars)")
        } else {
          print("AdvancedSlideLayoutSummary: textContent not found in ButtonSlideSummary for " + card.name)
        }
      } else {
        print("AdvancedSlideLayoutSummary: ButtonSlideSummary component not found on " + card.name)
      }
    } catch (error) {
      print("AdvancedSlideLayoutSummary: Error populating card content: " + error)
    }
  }

  /**
   * Position the initial 3 visible cards
   */
  private layoutInitialCards(): void {
    const positions = this.getLocalPositions()

    // Hide all cards first
    this.cards.forEach((card) => (card.enabled = false))

    // Show and position the first 3 cards
    for (let i = 0; i < 3 && i < this.cards.length; i++) {
      const card = this.cards[i]
      card.enabled = true
      card.getTransform().setLocalPosition(positions[i])

      // Apply rotation based on position
      this.applyCardRotation(card, i as 0 | 1 | 2)

      // Set appropriate visual based on position (center card gets highlight)
      this.switchCardVisual(card, i === 1)

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
      print("AdvancedSlideLayoutSummary: Could not access InteractableManipulation on " + card.name)
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

      print("AdvancedSlideLayoutSummary: Connected swipe events for " + card.name)
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

    print("AdvancedSlideLayoutSummary: Started swiping " + card.name)
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

    print(
      "AdvancedSlideLayoutSummary: Ended swipe - distance: " +
        swipeDistance +
        ", speed: " +
        swipeSpeed +
        ", changed: " +
        shouldChangeCard
    )
  }

  /**
   * Handle swipe right - move to previous card
   */
  private swipeRight(): void {
    print("AdvancedSlideLayoutSummary: Swiping right")

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
    print("AdvancedSlideLayoutSummary: Swiping left")

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
    const targetPos = new vec3(centerPos.x + offScreenDistance * direction, centerPos.y, centerPos.z)

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
    this.cards.forEach((card) => {
      if (!this.animatingCards.has(card)) {
        card.enabled = false
      }
      this.setCardManipulationEnabled(card, false)
    })

    // Calculate which cards should be visible
    const leftIndex = (this.currentIndex - 1 + this.numberOfCards) % this.numberOfCards
    const centerIndex = this.currentIndex
    const rightIndex = (this.currentIndex + 1) % this.numberOfCards

    // Switch card visuals based on their new positions
    this.ensureCorrectVisualsForPositions(leftIndex, centerIndex, rightIndex)

    const visibleCards = [
      {card: this.cards[leftIndex], position: positions[0], positionIndex: 0},
      {card: this.cards[centerIndex], position: positions[1], positionIndex: 1},
      {card: this.cards[rightIndex], position: positions[2], positionIndex: 2}
    ]

    // Animate visible cards to their positions
    visibleCards.forEach(({card, position, positionIndex}) => {
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
   * Ensure cards have the correct visuals for their positions
   */
  private ensureCorrectVisualsForPositions(leftIndex: number, centerIndex: number, rightIndex: number): void {
    const indices = [leftIndex, centerIndex, rightIndex]

    for (const index of indices) {
      const needsHighlight = index === centerIndex
      const currentCard = this.cards[index]

      // Switch the visual based on whether this card needs highlighting
      this.switchCardVisual(currentCard, needsHighlight)
    }
  }

  /**
   * Switch the visual component of a card based on highlight state
   */
  private switchCardVisual(card: SceneObject, useHighlight: boolean): void {
    try {
      const buttonSlide = card.getComponent(ButtonSlideSummary.getTypeName()) as ButtonSlideSummary
      if (buttonSlide) {
        // Access the visual through the public interface
        const currentVisual = buttonSlide.visual

        // Check if we need to change the visual type
        const needsHighlightVisual = useHighlight
        const currentlyHighlighted = currentVisual instanceof RoundedRectangleVisualCardSummary

        if (needsHighlightVisual !== currentlyHighlighted) {
          // Destroy current visual
          if (currentVisual) {
            currentVisual.destroy()
          }

          // Create new visual based on highlight state
          const newVisual = useHighlight
            ? new RoundedRectangleVisualCardSummary(card)
            : new RoundedRectangleVisualCardBot(card)

          // Configure the visual properties
          newVisual.hasBorder = true
          newVisual.isBorderGradient = true
          newVisual.borderSize = 0.1
          newVisual.isBaseGradient = true

          // Set the new visual using the public setter
          buttonSlide.visual = newVisual

          print(
            "AdvancedSlideLayoutSummary: Switched visual for " +
              card.name +
              " to " +
              (useHighlight ? "highlight" : "regular")
          )
        }
      }
    } catch (error) {
      print("AdvancedSlideLayoutSummary: Error switching visual for " + card.name + ": " + error)
    }
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
    toRemove.forEach((card) => {
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
      {card: this.cards[leftIndex], index: leftIndex},
      {card: this.cards[centerIndex], index: centerIndex},
      {card: this.cards[rightIndex], index: rightIndex}
    ]

    cardIndices.forEach(({card, index}) => {
      if (card && card.enabled) {
        const buttonSlide = card.getComponent(ButtonSlideSummary.getTypeName()) as ButtonSlideSummary
        if (buttonSlide && buttonSlide.textIndex) {
          buttonSlide.textIndex.text = index.toString()
          print("AdvancedSlideLayoutSummary: Updated card text to: " + index)
        }
      }
    })
  }

  /**
   * Get current card indices for debugging
   */
  public getCurrentIndices(): {left: number; center: number; right: number} {
    const leftIndex = (this.currentIndex - 1 + this.numberOfCards) % this.numberOfCards
    const rightIndex = (this.currentIndex + 1) % this.numberOfCards

    return {
      left: leftIndex,
      center: this.currentIndex,
      right: rightIndex
    }
  }

  /**
   * Get current lecture content for debugging
   */
  public getCurrentContent(): LectureContent[] {
    return this.lectureContent
  }

  /**
   * Get current lecture content formatted for agent consumption
   */
  public getCurrentContentForAgent(): {title: string; content: string}[] {
    return this.lectureContent.map((item) => ({
      title: item.title,
      content: item.content
    }))
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
        print(
          "AdvancedSlideLayoutSummary: Set manipulation " + (enabled ? "enabled" : "disabled") + " for " + card.name
        )
      }

      const interactableComponent = card.getComponent(Interactable.getTypeName()) as any
      if (interactableComponent) {
        interactableComponent.enabled = enabled
      }
    } catch (error) {
      print("AdvancedSlideLayoutSummary: Could not access manipulation components on " + card.name + ": " + error)
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
      (rotationZ * Math.PI) / 180 // Convert degrees to radians
    )
    transform.setLocalRotation(newRotation)
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
        // Ignore if component doesn't exist or can't be accessed
      }
    })
  }

  /**
   * Dynamically create a card with content
   */
  public createDynamicCard(content: LectureContent): number {
    if (!this.cardPrefab) {
      print("AdvancedSlideLayoutSummary: Cannot create card - prefab not set")
      return -1
    }

    const cardIndex = this.cards.length
    const cardObject = this.cardPrefab.instantiate(this.sceneObject)
    cardObject.name = "Card_" + cardIndex
    cardObject.enabled = false // Start disabled until positioned

    this.cards.push(cardObject)
    this.numberOfCards = this.cards.length

    // Populate the card with content
    this.populateCardContent(cardObject, content)

    print(
      `AdvancedSlideLayoutSummary: Created dynamic card ${cardIndex} with title: ${content.title.substring(0, 30)}...`
    )

    // If this is one of the first 3 cards, position it immediately
    if (cardIndex < 3) {
      this.positionInitialDynamicCards()
    }

    return cardIndex
  }

  /**
   * Position the first 3 dynamic cards
   */
  private positionInitialDynamicCards(): void {
    const positions = this.getLocalPositions()
    const visibleCount = Math.min(3, this.cards.length)

    // Update current index to center if we have cards
    if (this.cards.length > 0 && this.currentIndex < 0) {
      // Always try to put the first card in center position (index 1)
      // This ensures the main draggable card starts centered
      this.currentIndex = 0 // The first card (index 0) will be placed in center
    }

    // If we still don't have any cards, return early
    if (this.cards.length === 0) {
      print("AdvancedSlideLayoutSummary: No cards to position yet")
      return
    }

    // Special handling based on number of cards
    if (this.cards.length === 1) {
      // Single card - place it in the center
      const card = this.cards[0]
      card.enabled = true
      card.getTransform().setLocalPosition(positions[1]) // Center position

      // No rotation for center card
      this.applyCardRotation(card, 1)

      // Center card gets highlight visual and manipulation
      this.switchCardVisual(card, true)
      this.setCardManipulationEnabled(card, true)
    } else if (this.cards.length === 2) {
      // Two cards - place current in center, other on left
      const centerCard = this.cards[this.currentIndex]
      const otherIndex = this.currentIndex === 0 ? 1 : 0
      const otherCard = this.cards[otherIndex]

      // Position center card
      centerCard.enabled = true
      centerCard.getTransform().setLocalPosition(positions[1]) // Center
      this.applyCardRotation(centerCard, 1)
      this.switchCardVisual(centerCard, true)
      this.setCardManipulationEnabled(centerCard, true)

      // Position other card on left
      otherCard.enabled = true
      otherCard.getTransform().setLocalPosition(positions[0]) // Left
      this.applyCardRotation(otherCard, 0)
      this.switchCardVisual(otherCard, false)
      this.setCardManipulationEnabled(otherCard, false)
    } else {
      // Three or more cards - standard positioning with current in center
      const leftIndex = (this.currentIndex - 1 + this.numberOfCards) % this.numberOfCards
      const centerIndex = this.currentIndex
      const rightIndex = (this.currentIndex + 1) % this.numberOfCards

      const visibleIndices = [leftIndex, centerIndex, rightIndex]

      for (let i = 0; i < 3; i++) {
        const cardIndex = visibleIndices[i]
        if (cardIndex >= 0 && cardIndex < this.cards.length) {
          const card = this.cards[cardIndex]
          card.enabled = true
          card.getTransform().setLocalPosition(positions[i])

          // Apply rotation based on position
          this.applyCardRotation(card, i as 0 | 1 | 2)

          // Center position (i=1) gets highlight and manipulation
          this.switchCardVisual(card, i === 1)
          this.setCardManipulationEnabled(card, i === 1)
        }
      }
    }

    // Setup swipe interaction if we have enough cards
    if (this.cards.length >= 2) {
      this.setupCenterCardManipulation()
    }

    // Update card indices
    this.updateCardTextIndices()
  }

  /**
   * Add multiple dynamic cards at once
   */
  public addDynamicCards(contentArray: LectureContent[]): number[] {
    const indices: number[] = []

    contentArray.forEach((content) => {
      const index = this.createDynamicCard(content)
      if (index >= 0) {
        indices.push(index)
      }
    })

    print(`AdvancedSlideLayoutSummary: Added ${indices.length} dynamic cards`)
    return indices
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
