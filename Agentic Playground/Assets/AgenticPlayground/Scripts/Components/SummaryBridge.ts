import Event from "SpectaclesInteractionKit.lspkg/Utils/Event"
import {SummarySection} from "../Agents/AgentTypes"
import {SummaryASRController} from "../ASR/SummaryASRController"
import {AISummarizer} from "../Core/AISummarizer"
import {SummaryStorage} from "../Storage/SummaryStorage"
import {SummaryExtensions} from "../Utils/SummaryExtensions"
import {CHARACTER_LIMITS, TextLimiter} from "../Utils/TextLimiter"
import {SummaryComponent} from "./SummaryComponent"

/**
 * SummaryBridge - Test framework for summary functionality
 *
 * Provides comprehensive testing for:
 * 1. ASR document creation with 500-word summarization intervals
 * 2. Component testing without storage dependency
 * 3. Mock data injection and validation
 * 4. Storage reset and initialization
 *
 * According to architecture diagram, this handles the summary flow:
 * SummaryASRController → SummaryStorage → SummaryBridge → AISummarizer → SummaryComponent
 */
@component
export class SummaryBridge extends BaseScriptComponent {
  @input
  @hint("Reference to SummaryStorage component")
  summaryStorage: SummaryStorage = null

  @input
  @hint("Reference to AISummarizer component")
  aiSummarizer: AISummarizer = null

  @input
  @hint("Reference to SummaryComponent for UI display")
  summaryLayout: SummaryComponent = null

  @input
  @hint("Text component to display summary status")
  summaryDisplayText: Text = null

  @input
  @hint("Reference to SummaryASRController for speech input")
  asrController: SummaryASRController = null

  // Test Configuration
  @input
  @hint("Enable ASR document creation test")
  testASRDocumentCreation: boolean = false

  @input
  @hint("Enable component testing without storage")
  testComponentWithoutStorage: boolean = false

  // Removed: resetStorageOnAwake - now handled by StorageManager

  @input
  @hint("Word count threshold for summarization")
  @widget(new SliderWidget(100, 1000, 50))
  summarizationWordThreshold: number = 500

  @input enableDebugLogging: boolean = true
  @input enableAutoSummary: boolean = true
  @input autoSummaryThreshold: number = 1000 // characters
  @input updateInterval: number = 3 // seconds

  @input
  @hint("Log the transcription text that has been stored and summarized")
  showStoredTranscription: boolean = false

  @input
  @hint("Log the summary cards content summarized by the AI")
  showSummaryCards: boolean = false

  private isConnected: boolean = false
  private lastUpdateTime: number = 0
  private lastTextLength: number = 0
  private isSummarizing: boolean = false
  private hasSummarizedCurrentText: boolean = false

  // Test Framework State
  private currentWordCount: number = 0
  private accumulatedText: string = ""
  private testSessionActive: boolean = false
  private testResults: Array<{timestamp: number; test: string; status: string; data?: any}> = []

  // Track which cards have been populated
  private nextAvailableCardIndex: number = 0

  public onSummaryGenerated: Event<SummarySection[]> = new Event<SummarySection[]>()
  public onSummaryDisplayed: Event<SummarySection[]> = new Event<SummarySection[]>()
  public onError: Event<string> = new Event<string>()

  // Test Framework Events
  public onTestCompleted: Event<string> = new Event<string>()
  public onDebugMessage: Event<string> = new Event<string>()

  onAwake() {
    print("SummaryBridge: 🌉 Summary bridge component awakened - starting initialization")
    this.createEvent("OnStartEvent").bind(this.initialize.bind(this))
    this.createEvent("UpdateEvent").bind(this.checkForUpdates.bind(this))

    if (this.enableDebugLogging) {
      print("SummaryBridge: 🌉 Events bound - OnStartEvent and UpdateEvent")
      print(
        `SummaryBridge: 📋 Config - autoSummary: ${this.enableAutoSummary}, threshold: ${this.autoSummaryThreshold}, interval: ${this.updateInterval}s`
      )
    }
  }

  private initialize(): void {
    print("SummaryBridge: Initialize called!")

    // Storage reset is now handled centrally by StorageManager
    // The StorageManager will reset SummaryStorage if configured to do so

    this.validateComponents()
    this.setupConnections()
    this.setupTestFramework()

    // Load and display existing summary if available
    this.loadExistingSummary()

    if (this.enableDebugLogging) {
      print("SummaryBridge: Test framework initialized successfully")
      print(
        `SummaryBridge: Initial state - connected: ${this.isConnected}, storage: ${!!this.summaryStorage}, summarizer: ${!!this.aiSummarizer}`
      )
    }
  }

  private validateComponents(): void {
    const validationResults: string[] = []

    if (!this.summaryStorage) {
      validationResults.push("SummaryStorage not assigned")
    }

    if (!this.aiSummarizer) {
      validationResults.push("AISummarizer not assigned")
    }

    if (!this.summaryLayout) {
      validationResults.push("SummaryLayout not assigned")
    }

    if (this.testASRDocumentCreation && !this.asrController) {
      validationResults.push("ASR test enabled but SummaryASRController not assigned")
    }

    if (validationResults.length > 0 && this.enableDebugLogging) {
      print("SummaryBridge: Component validation results:")
      validationResults.forEach((result) => print(`  ${result}`))
    }
  }

  private setupConnections(): void {
    this.isConnected = true

    if (this.enableDebugLogging) {
      print("SummaryBridge: Bridge connections established")
    }
  }

  /**
   * Load and display existing summary from storage on initialization
   */
  private loadExistingSummary(): void {
    if (!this.summaryStorage || !this.summaryLayout) {
      if (this.enableDebugLogging) {
        print("SummaryBridge: Cannot load existing summary - missing components")
      }
      return
    }

    try {
      // Get the current summary from storage
      const currentSummary = this.summaryStorage.getCurrentSummary()

      if (currentSummary && currentSummary.sections && currentSummary.sections.length > 0) {
        if (this.enableDebugLogging) {
          print(`SummaryBridge: 📚 Found existing summary with ${currentSummary.sections.length} sections`)
        }

        // Log summary cards if requested
        if (this.showSummaryCards) {
          print("\nSummaryBridge: 📋 === SUMMARY CARDS CONTENT ===")
          print(`Summary Title: ${currentSummary.summaryTitle || "Untitled"}`)
          print(`Number of Cards: ${currentSummary.sections.length}`)
          print("----------------------------------------")

          currentSummary.sections.forEach((section, index) => {
            print(`\nCard ${index + 1}:`)
            print(`  Title: ${section.title || "No title"}`)
            print(`  Content: ${section.content || "No content"}`)
            if (section.keywords && section.keywords.length > 0) {
              print(`  Keywords: ${section.keywords.join(", ")}`)
            }
            print("----------------------------------------")
          })
          print("=== END SUMMARY CARDS ===\n")
        }

        // Convert stored sections to the format expected by the UI
        const convertedSections = this.convertSections(currentSummary.sections)

        // Display the summary on the UI
        this.displaySummaryOnUI({sections: convertedSections})

        if (this.enableDebugLogging) {
          print(`SummaryBridge: Loaded and displayed existing summary: "${currentSummary.summaryTitle}"`)
        }
      } else {
        if (this.enableDebugLogging) {
          print("SummaryBridge: 📭 No existing summary found in storage")
        }
      }

      // Also check if there's accumulated text that hasn't been summarized yet
      const currentText = this.summaryStorage.getCurrentText()
      if (currentText && currentText.length > 0) {
        this.lastTextLength = currentText.length
        if (this.enableDebugLogging) {
          print(`SummaryBridge: 📝 Found ${currentText.length} chars of unsummarized text in storage`)
        }

        // Log stored transcription if requested
        if (this.showStoredTranscription) {
          print("\nSummaryBridge: 📜 === STORED TRANSCRIPTION ===")
          print(`Total Characters: ${currentText.length}`)
          print(`Total Words: ${this.countWords(currentText)}`)
          print("----------------------------------------")
          print("Full Transcription Text:")
          print(currentText)
          print("=== END TRANSCRIPTION ===\n")
        }

        // If we have text above the threshold but no summary, generate one immediately
        if (this.enableAutoSummary && currentText.length >= this.autoSummaryThreshold && !currentSummary) {
          print(`SummaryBridge: Auto-generating summary for ${currentText.length} chars of stored text`)
          this.generateSummary()
        }
      }
    } catch (error) {
      if (this.enableDebugLogging) {
        print(`SummaryBridge: Error loading existing summary: ${error}`)
      }
    }
  }

  /**
   * Check for text updates periodically and trigger auto-summary
   */
  private checkForUpdates(): void {
    // Add debug at the very start
    if (this.enableDebugLogging) {
      print(`SummaryBridge: checkForUpdates called - connected: ${this.isConnected}, storage: ${!!this.summaryStorage}`)
    }

    if (!this.isConnected || !this.summaryStorage) {
      if (this.enableDebugLogging) {
        print(`SummaryBridge: Skipping update - not connected or no storage`)
      }
      return
    }

    const timeSinceUpdate = (Date.now() - this.lastUpdateTime) / 1000

    if (timeSinceUpdate >= this.updateInterval) {
      try {
        // Add instance check
        const storageInfo = this.summaryStorage as any
        print(
          `SummaryBridge: 🔍 Storage instance check - instanceId: ${storageInfo.instanceId}, object: ${this.summaryStorage}`
        )

        const currentText = this.summaryStorage.getCurrentText()
        const currentLength = currentText.length

        if (this.enableDebugLogging) {
          print(`SummaryBridge: Text check - current: ${currentLength} chars, last: ${this.lastTextLength} chars`)
        }

        if (currentLength !== this.lastTextLength) {
          this.lastTextLength = currentLength
          this.hasSummarizedCurrentText = false // Reset flag when text changes

          if (this.enableDebugLogging) {
            print(`SummaryBridge: 📝 Text updated (${currentLength} characters)`)
          }
        }

        // Check for auto-summary trigger (even if text length hasn't changed)
        if (
          this.enableAutoSummary &&
          currentLength >= this.autoSummaryThreshold &&
          !this.isSummarizing &&
          !this.hasSummarizedCurrentText
        ) {
          print(`SummaryBridge: Auto-summary triggered! (${currentLength} >= ${this.autoSummaryThreshold})`)
          this.generateSummary()
        } else if (this.enableDebugLogging && currentLength >= this.autoSummaryThreshold) {
          print(
            `SummaryBridge: ⏳ Not triggering summary - already summarized: ${this.hasSummarizedCurrentText}, summarizing: ${this.isSummarizing}`
          )
        }
      } catch (error) {
        if (this.enableDebugLogging) {
          print(`SummaryBridge: Error checking for updates: ${error}`)
        }
      }

      // Run test framework cycle
      this.runTestCycle()

      this.lastUpdateTime = Date.now()
    }
  }

  /**
   * Generate summary from accumulated text
   */
  public async generateSummary(): Promise<void> {
    if (this.isSummarizing) {
      print("SummaryBridge: ⏳ Already generating summary")
      return
    }

    if (!this.summaryStorage || !this.aiSummarizer) {
      print("SummaryBridge: Required components not available")
      return
    }

    this.isSummarizing = true

    try {
      // Get current text using actual method
      const currentText = this.summaryStorage.getCurrentText()

      if (!currentText || currentText.trim().length === 0) {
        print("SummaryBridge: No text available for summary")
        return
      }

      if (this.enableDebugLogging) {
        print(`SummaryBridge: Generating summary for ${currentText.length} characters`)
      }

      // Generate summary using AISummarizer
      const result = await this.aiSummarizer.generateSummary(currentText)

      if (this.enableDebugLogging) {
        print(
          `SummaryBridge: AISummarizer result: success=${result.success}, sections=${result.sections ? result.sections.length : 0}, error=${result.error || "none"}`
        )
      }

      if (result && result.sections && result.sections.length > 0) {
        // Store the summary in SummaryStorage for persistence
        this.summaryStorage.storeSummary(result.sections, "Lecture Summary")

        // Log summary cards if requested
        if (this.showSummaryCards) {
          print("\nSummaryBridge: 🆕 === NEWLY GENERATED SUMMARY CARDS ===")
          print(`Summary Title: Lecture Summary`)
          print(`Number of Cards: ${result.sections.length}`)
          print("----------------------------------------")

          result.sections.forEach((section, index) => {
            print(`\nCard ${index + 1}:`)
            print(`  Title: ${section.title || "No title"}`)
            print(`  Content: ${section.content || "No content"}`)
            if (section.keywords && section.keywords.length > 0) {
              print(`  Keywords: ${section.keywords.join(", ")}`)
            }
            print("----------------------------------------")
          })
          print("=== END NEW SUMMARY CARDS ===\n")
        }

        // Convert AISummarizer sections to AgentTypes format
        const convertedSections = this.convertSections(result.sections)

        // Display on UI
        this.displaySummaryOnUI({sections: convertedSections})

        this.onSummaryGenerated.invoke(convertedSections)

        // Mark that we've summarized the current text
        this.hasSummarizedCurrentText = true

        if (this.enableDebugLogging) {
          print(`SummaryBridge: Summary generated and stored with ${result.sections.length} sections`)
        }
      } else {
        print(`SummaryBridge: AI Summary generation returned no sections. Error: ${result.error || "Unknown error"}`)
      }
    } catch (error) {
      const errorMessage = `Summary generation failed: ${error}`
      print(`SummaryBridge: ${errorMessage}`)
      this.onError.invoke(errorMessage)
    } finally {
      this.isSummarizing = false
    }
  }

  /**
   * Convert AISummarizer sections to AgentTypes SummarySection format
   */
  private convertSections(aiSections: any[]): SummarySection[] {
    return aiSections.map((section, index) => ({
      title: section.title || `Summary ${index + 1}`,
      content: section.content || "",
      cardIndex: index,
      keywords: section.keywords || []
    }))
  }

  /**
   * Display summary sections on UI using actual methods
   */
  private displaySummaryOnUI(summaryResult: {sections: SummarySection[]}): void {
    if (!this.summaryLayout) {
      print("SummaryBridge: Summary layout not available for display")
      return
    }

    try {
      // Check if we're in dynamic mode (non-test mode)
      const layoutAny = this.summaryLayout as any
      const isDynamicMode = !layoutAny.testMode

      // Get the total number of available cards (only matters in test mode)
      const totalCards = SummaryExtensions.getCardCount(this.summaryLayout)

      // Add each section as a card starting from the next available index
      let cardsAdded = 0
      for (let i = 0; i < summaryResult.sections.length; i++) {
        // In test mode, check if we still have available cards
        if (!isDynamicMode && this.nextAvailableCardIndex >= totalCards) {
          if (this.enableDebugLogging) {
            print(
              `SummaryBridge: No more available cards in test mode. Used ${this.nextAvailableCardIndex} of ${totalCards} cards`
            )
          }
          break
        }

        // In dynamic mode, cards will be created as needed
        const success = SummaryExtensions.addSummaryCard(
          this.summaryLayout,
          summaryResult.sections[i],
          this.nextAvailableCardIndex
        )

        if (success) {
          this.nextAvailableCardIndex++
          cardsAdded++
        } else if (this.enableDebugLogging) {
          print(`SummaryBridge: Failed to add summary card at index ${this.nextAvailableCardIndex}`)
        }
      }

      // Update display text
      if (this.summaryDisplayText) {
        this.summaryDisplayText.text = `Summary: ${this.nextAvailableCardIndex} cards used`
      }

      this.onSummaryDisplayed.invoke(summaryResult.sections)

      if (this.enableDebugLogging) {
        print(`SummaryBridge: 📱 Added ${cardsAdded} new summary cards (total: ${this.nextAvailableCardIndex})`)
      }
    } catch (error) {
      print(`SummaryBridge: Failed to display summary on UI: ${error}`)
    }
  }

  /**
   * Clear summary display using actual methods
   */
  public clearSummaryDisplay(): void {
    if (!this.summaryLayout) {
      print("SummaryBridge: Summary layout not available for clearing")
      return
    }

    try {
      // Clear cards using actual method
      SummaryExtensions.clearSummaryCards(this.summaryLayout)

      // Reset the card index to start from the beginning
      this.nextAvailableCardIndex = 0

      // Update display text
      if (this.summaryDisplayText) {
        this.summaryDisplayText.text = "Summary: Ready"
      }

      if (this.enableDebugLogging) {
        print("SummaryBridge: Summary display cleared and card index reset")
      }
    } catch (error) {
      print(`SummaryBridge: Failed to clear summary display: ${error}`)
    }
  }

  // ================================
  // Public API
  // ================================

  /**
   * Force refresh summary display
   */
  public refreshSummaryDisplay(): void {
    // Get the latest summary and display it
    if (this.summaryStorage) {
      const currentSummary = this.summaryStorage.getCurrentSummary()

      if (currentSummary && currentSummary.sections) {
        // Note: This will add cards incrementally from the current index
        // If you want to start fresh, call clearSummaryDisplay() first
        const convertedSections = this.convertSections(currentSummary.sections)
        this.displaySummaryOnUI({sections: convertedSections})
      }
    }
  }

  /**
   * Get current bridge status
   */
  public getBridgeStatus(): {
    isConnected: boolean
    isSummarizing: boolean
    lastUpdateTime: number
    textLength: number
    hasValidComponents: boolean
  } {
    return {
      isConnected: this.isConnected,
      isSummarizing: this.isSummarizing,
      lastUpdateTime: this.lastUpdateTime,
      textLength: this.lastTextLength,
      hasValidComponents: !!(this.summaryStorage && this.aiSummarizer && this.summaryLayout)
    }
  }

  /**
   * Create a test summary (for testing)
   */
  public createTestSummary(): void {
    const testSections: SummarySection[] = [
      {
        title: "Test Section 1",
        content: "This is test content for the first section.",
        cardIndex: 0,
        keywords: ["test", "section", "content"]
      },
      {
        title: "Test Section 2",
        content: "This is test content for the second section.",
        cardIndex: 1,
        keywords: ["test", "section", "content"]
      }
    ]

    this.displaySummaryOnUI({sections: testSections})

    if (this.enableDebugLogging) {
      print("SummaryBridge: 🧪 Test summary created")
    }
  }

  /**
   * Set whether to append new cards or start fresh
   * @param startFresh If true, will clear existing cards before adding new ones
   */
  public setCardAdditionMode(startFresh: boolean): void {
    if (startFresh) {
      this.clearSummaryDisplay()
    }

    if (this.enableDebugLogging) {
      print(`SummaryBridge: Card addition mode set to ${startFresh ? "start fresh" : "append"}`)
    }
  }

  /**
   * Get the current card usage status
   */
  public getCardUsageStatus(): {usedCards: number; totalCards: number; remainingCards: number} {
    const totalCards = this.summaryLayout ? SummaryExtensions.getCardCount(this.summaryLayout) : 0
    const remainingCards = Math.max(0, totalCards - this.nextAvailableCardIndex)

    return {
      usedCards: this.nextAvailableCardIndex,
      totalCards: totalCards,
      remainingCards: remainingCards
    }
  }

  // ================================
  // Test Framework Core
  // ================================

  /**
   * Setup the test framework
   */
  private setupTestFramework(): void {
    this.testResults = []
    this.currentWordCount = 0
    this.accumulatedText = ""

    if (this.enableDebugLogging) {
      print("SummaryBridge: 🧪 Test framework setup complete")
      print(`  - ASR Document Creation: ${this.testASRDocumentCreation ? "ENABLED" : "DISABLED"}`)
      print(`  - Component Without Storage: ${this.testComponentWithoutStorage ? "ENABLED" : "DISABLED"}`)
      print(`  - Word Threshold: ${this.summarizationWordThreshold} words`)
    }
  }

  /**
   * Main test cycle - runs during update
   */
  private runTestCycle(): void {
    // Run active tests
    if (this.testASRDocumentCreation) {
      this.runASRDocumentTest()
    }

    if (this.testComponentWithoutStorage) {
      this.runComponentWithoutStorageTest()
    }
  }

  // ================================
  // TEST 1: ASR Document Creation
  // ================================

  /**
   * Test ASR document creation with 500-word summarization
   */
  private runASRDocumentTest(): void {
    if (!this.asrController || !this.summaryStorage) {
      this.logTestResult("ASR_DOCUMENT_TEST", "SKIPPED", "Missing required components")
      return
    }

    try {
      // Get current ASR text
      const currentASRText = this.getASRText()

      if (currentASRText && currentASRText.length > 0) {
        // Accumulate text
        if (!this.accumulatedText.includes(currentASRText)) {
          this.accumulatedText += " " + currentASRText
          this.currentWordCount = this.countWords(this.accumulatedText)

          if (this.enableDebugLogging) {
            print(`SummaryBridge: 📝 Accumulated ${this.currentWordCount} words`)
          }
        }

        // Check if we've reached the summarization threshold
        if (this.currentWordCount >= this.summarizationWordThreshold) {
          this.processSummarizationInterval()
        }
      }
    } catch (error) {
      this.logTestResult("ASR_DOCUMENT_TEST", "ERROR", `ASR processing failed: ${error}`)
    }
  }

  /**
   * Process a summarization interval
   */
  private processSummarizationInterval(): void {
    if (!this.summaryStorage) return

    try {
      if (this.enableDebugLogging) {
        print(`SummaryBridge: Processing summarization for ${this.currentWordCount} words`)
      }

      // Create a document entry for summarization
      const documentTitle = `Live Lecture - ${new Date().toLocaleTimeString()}`
      const documentContent = this.accumulatedText.trim()

      // Limit content to character constraints
      const limitedContent = TextLimiter.limitText(documentContent, CHARACTER_LIMITS.SUMMARY_CONTENT)

      // Store the document using available methods
      this.summaryStorage.storeText(limitedContent)

      if (this.enableDebugLogging) {
        print(`SummaryBridge: 📚 Stored document: "${documentTitle}" (${limitedContent.length} chars)`)
      }

      // Log stored transcription if requested
      if (this.showStoredTranscription) {
        print("\nSummaryBridge: 📜 === NEW TRANSCRIPTION STORED ===")
        print(`Document Title: ${documentTitle}`)
        print(`Total Characters: ${limitedContent.length}`)
        print(`Total Words: ${this.currentWordCount}`)
        print("----------------------------------------")
        print("Transcription Text:")
        print(limitedContent)
        print("=== END NEW TRANSCRIPTION ===\n")
      }

      // Trigger summarization
      this.generateSummary()

      // Reset accumulation for next interval
      this.accumulatedText = ""
      this.currentWordCount = 0

      this.logTestResult("ASR_SUMMARIZATION", "SUCCESS", {
        wordCount: this.currentWordCount,
        title: documentTitle,
        contentLength: limitedContent.length
      })
    } catch (error) {
      this.logTestResult("ASR_SUMMARIZATION", "ERROR", `Summarization failed: ${error}`)
    }
  }

  /**
   * Get current ASR text from SummaryASRController
   */
  private getASRText(): string {
    if (!this.asrController) return ""

    try {
      // Get session status from SummaryASRController which includes current transcription
      const sessionStatus = this.asrController.getSessionStatus()

      if (sessionStatus && sessionStatus.currentTranscription) {
        return sessionStatus.currentTranscription
      }

      return ""
    } catch (error) {
      if (this.enableDebugLogging) {
        print(`SummaryBridge: Failed to get ASR text: ${error}`)
      }
      return ""
    }
  }

  // ================================
  // TEST 2: Component Without Storage
  // ================================

  /**
   * Test component functionality without storage dependency
   */
  private runComponentWithoutStorageTest(): void {
    if (!this.summaryLayout) {
      this.logTestResult("COMPONENT_WITHOUT_STORAGE", "SKIPPED", "SummaryComponent not available")
      return
    }

    try {
      // Create mock summary data
      const mockSummaryData = this.createMockSummaryData()

      // Apply mock data directly to component
      this.applyMockDataToComponent(mockSummaryData)

      this.logTestResult("COMPONENT_WITHOUT_STORAGE", "SUCCESS", {
        mockDataApplied: true,
        summaryCount: mockSummaryData.summaries.length
      })

      if (this.enableDebugLogging) {
        print(`SummaryBridge: 🧪 Applied mock data to component: ${mockSummaryData.summaries.length} summaries`)
      }
    } catch (error) {
      this.logTestResult("COMPONENT_WITHOUT_STORAGE", "ERROR", `Component test failed: ${error}`)
    }
  }

  /**
   * Create mock summary data for testing
   */
  private createMockSummaryData(): any {
    const mockData = {
      title: "AI & Machine Learning Fundamentals",
      content:
        "This lecture covers core concepts of artificial intelligence and machine learning, including supervised learning algorithms, neural networks, and practical applications in computer vision and natural language processing.",
      keyPoints: [
        "Supervised learning uses labeled data to train models",
        "Neural networks mimic brain structure for pattern recognition",
        "Computer vision enables machines to interpret visual data",
        "NLP helps computers understand human language",
        "Deep learning is a subset of machine learning using deep neural networks"
      ],
      summaries: [
        {
          title: "Introduction to AI",
          content:
            "Artificial Intelligence represents the simulation of human intelligence in machines that are programmed to think and learn like humans."
        },
        {
          title: "Machine Learning Basics",
          content:
            "Machine learning is a method of data analysis that automates analytical model building using algorithms that iteratively learn from data."
        },
        {
          title: "Neural Networks",
          content:
            "Neural networks are computing systems inspired by biological neural networks that constitute animal brains, designed to recognize patterns."
        }
      ]
    }

    return mockData
  }

  /**
   * Apply mock data directly to summary component
   */
  private applyMockDataToComponent(mockData: any): void {
    if (!this.summaryLayout) return

    try {
      // Convert mock data to SummarySection format
      const mockSections: SummarySection[] = mockData.summaries.map((summary: any, index: number) => ({
        title: summary.title,
        content: summary.content,
        cardIndex: index,
        keywords: mockData.keyPoints.slice(index, index + 2)
      }))

      // Display using existing method
      this.displaySummaryOnUI({sections: mockSections})

      if (this.enableDebugLogging) {
        print("SummaryBridge: 📱 Mock data applied to summary component")
      }
    } catch (error) {
      if (this.enableDebugLogging) {
        print(`SummaryBridge: Failed to apply mock data to component: ${error}`)
      }
    }
  }

  // ================================
  // Storage Reset Functionality
  // ================================

  /**
   * Reset the AI summarizer storage
   */
  public resetAISummarizer(): void {
    if (!this.summaryStorage) {
      if (this.enableDebugLogging) {
        print("SummaryBridge: Cannot reset - SummaryStorage not available")
      }
      return
    }

    try {
      // Clear storage using available methods
      this.summaryStorage.clearCurrentText()

      // Reset internal state
      this.currentWordCount = 0
      this.accumulatedText = ""
      this.testResults = []
      this.lastTextLength = 0
      this.hasSummarizedCurrentText = false

      // Clear display
      this.clearSummaryDisplay()

      if (this.enableDebugLogging) {
        print("SummaryBridge: AI summarizer storage reset complete")
      }

      this.logTestResult("STORAGE_RESET", "SUCCESS", "Storage cleared and reset")
    } catch (error) {
      this.logTestResult("STORAGE_RESET", "ERROR", `Reset failed: ${error}`)

      if (this.enableDebugLogging) {
        print(`SummaryBridge: Failed to reset storage: ${error}`)
      }
    }
  }

  // ================================
  // Test Framework Utilities
  // ================================

  /**
   * Count words in text
   */
  private countWords(text: string): number {
    if (!text) return 0
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length
  }

  /**
   * Log test results with debugging
   */
  private logTestResult(testName: string, status: string, data?: any): void {
    const result = {
      timestamp: Date.now(),
      test: testName,
      status: status,
      data: data
    }

    this.testResults.push(result)

    if (this.enableDebugLogging) {
      const dataStr = data ? (typeof data === "object" ? JSON.stringify(data) : data) : ""
      print(`SummaryBridge: TEST ${testName}: ${status} ${dataStr}`)
    }

    // Emit events
    if (status === "ERROR") {
      this.onError.invoke(`${testName}: ${data}`)
    } else {
      this.onTestCompleted.invoke(`${testName}: ${status}`)
    }

    this.onDebugMessage.invoke(`${testName}: ${status}`)
  }

  /**
   * Manually trigger ASR document test
   */
  public triggerASRDocumentTest(): void {
    if (this.enableDebugLogging) {
      print("SummaryBridge: Manually triggering ASR document test")
    }

    this.testASRDocumentCreation = true
    this.runASRDocumentTest()
  }

  /**
   * Manually trigger component without storage test
   */
  public triggerComponentWithoutStorageTest(): void {
    if (this.enableDebugLogging) {
      print("SummaryBridge: Manually triggering component without storage test")
    }

    this.testComponentWithoutStorage = true
    this.runComponentWithoutStorageTest()
  }

  /**
   * Get test framework status
   */
  public getTestFrameworkStatus(): {
    isInitialized: boolean
    activeTests: string[]
    testResults: number
    currentWordCount: number
    accumulatedTextLength: number
  } {
    const activeTests: string[] = []

    if (this.testASRDocumentCreation) {
      activeTests.push("ASR_DOCUMENT_CREATION")
    }

    if (this.testComponentWithoutStorage) {
      activeTests.push("COMPONENT_WITHOUT_STORAGE")
    }

    return {
      isInitialized: this.isConnected,
      activeTests: activeTests,
      testResults: this.testResults.length,
      currentWordCount: this.currentWordCount,
      accumulatedTextLength: this.accumulatedText.length
    }
  }

  /**
   * Get recent test results
   */
  public getRecentTestResults(
    count: number = 10
  ): Array<{timestamp: number; test: string; status: string; data?: any}> {
    return this.testResults.slice(-count)
  }

  /**
   * Clear all test results
   */
  public clearTestResults(): void {
    this.testResults = []

    if (this.enableDebugLogging) {
      print("SummaryBridge: Test results cleared")
    }
  }
}
