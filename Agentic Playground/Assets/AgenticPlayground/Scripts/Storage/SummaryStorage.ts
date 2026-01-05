import Event from "SpectaclesInteractionKit.lspkg/Utils/Event"

// ================================
// Types for Summary Storage
// ================================

interface SummarySection {
  title: string // Max 157 chars per diagram spec
  content: string // Max 785 chars per diagram spec
  keywords: string[]
  timestamp: number
}

interface SummaryDocument {
  originalText: string
  summaryTitle: string
  sections: SummarySection[]
  totalCharacters: number
  createdAt: number
  lastModified: number
}

/**
 * SummaryStorage - Simple storage for non-agentic summary flow
 *
 * According to architecture diagram, this handles the simple summarization flow:
 * SummaryASRController → SummaryStorage → SummaryBridge → AISummarizer → SummaryComponent
 *
 * This is NOT part of the agentic tool system - it's a simple summarization service
 * that formats lecture content into readable cards for the summary UI component.
 */
@component
export class SummaryStorage extends BaseScriptComponent {
  // ================================
  // Inspector Configuration
  // ================================

  @input
  @hint("Enable automatic summary storage")
  public enableStorage: boolean = true

  @input
  @hint("Enable debug logging for storage operations")
  public enableDebugLogging: boolean = false

  @input
  @hint("Maximum number of summaries to store")
  @widget(new SliderWidget(1, 20, 1))
  public maxStoredSummaries: number = 5

  @input
  @hint("Current summary title")
  public currentSummaryTitle: string = "Lecture Summary"

  // ================================
  // State Management
  // ================================

  private isInitialized: boolean = false
  private currentOriginalText: string = ""
  private currentSummaryDocument: SummaryDocument | null = null
  private storedSummaries: Map<string, SummaryDocument> = new Map()
  private storageKey: string = "agentic_summary_storage"
  private hasActiveSession: boolean = false // Track if we have an active accumulation session

  // ================================
  // Events
  // ================================

  public onTextStored: Event<string> = new Event<string>()
  public onSummaryGenerated: Event<SummaryDocument> = new Event<SummaryDocument>()
  public onSummaryUpdated: Event<SummaryDocument> = new Event<SummaryDocument>()
  public onStorageError: Event<string> = new Event<string>()

  // ================================
  // Lifecycle Methods
  // ================================

  onAwake() {
    print(`SummaryStorage: 🌅 onAwake called - currentOriginalText length: ${this.currentOriginalText.length}`)
    this.initializeStorage()
    print(`SummaryStorage: 🌅 After initializeStorage - currentOriginalText length: ${this.currentOriginalText.length}`)
  }

  // ================================
  // Public Interface - Text Collection
  // ================================

  /**
   * Store incoming text from SummaryASRController
   * This accumulates the raw transcript before summarization
   */
  public storeText(text: string): void {
    if (!text || text.trim().length === 0) {
      if (this.enableDebugLogging) {
        print("SummaryStorage: Empty text provided, ignoring")
      }
      return
    }

    print(
      `SummaryStorage: 📝 storeText called with ${text.length} chars. Current total before: ${this.currentOriginalText.length}`
    )

    // Append to current original text
    if (this.currentOriginalText.length > 0) {
      this.currentOriginalText += " " + text.trim()
    } else {
      this.currentOriginalText = text.trim()
    }

    this.onTextStored.invoke(this.currentOriginalText)

    if (this.enableDebugLogging) {
      print(`SummaryStorage: 📝 Text stored, total length: ${this.currentOriginalText.length} characters`)
    }

    this.saveToStorage()
  }

  /**
   * Get the accumulated original text for summarization
   */
  public getCurrentText(): string {
    if (this.enableDebugLogging) {
      print(`SummaryStorage: 📖 getCurrentText called - returning ${this.currentOriginalText.length} chars`)
      print(
        `SummaryStorage: DEBUG - currentOriginalText first 100 chars: "${this.currentOriginalText.substring(0, 100)}..."`
      )
      print(`SummaryStorage: 🔍 DEBUG - isInitialized: ${this.isInitialized}, enableStorage: ${this.enableStorage}`)
    }
    return this.currentOriginalText
  }

  /**
   * Clear the current text accumulation
   */
  public clearCurrentText(): void {
    this.currentOriginalText = ""
    this.currentSummaryDocument = null

    if (this.enableDebugLogging) {
      print("SummaryStorage: Current text cleared")
    }

    this.saveToStorage()
  }

  // ================================
  // Public Interface - Summary Management
  // ================================

  /**
   * Store generated summary sections from AISummarizer
   */
  public storeSummary(sections: SummarySection[], title?: string): void {
    if (!sections || sections.length === 0) {
      if (this.enableDebugLogging) {
        print("SummaryStorage: No sections provided for summary")
      }
      return
    }

    const summaryTitle = title || this.currentSummaryTitle
    const timestamp = Date.now()

    this.currentSummaryDocument = {
      originalText: this.currentOriginalText,
      summaryTitle: summaryTitle,
      sections: sections,
      totalCharacters: this.currentOriginalText.length,
      createdAt: timestamp,
      lastModified: timestamp
    }

    // Store in collection
    const summaryId = `summary_${timestamp}`
    this.storedSummaries.set(summaryId, this.currentSummaryDocument)

    // Maintain storage limit
    this.cleanupOldSummaries()

    this.onSummaryGenerated.invoke(this.currentSummaryDocument)

    if (this.enableDebugLogging) {
      print(`SummaryStorage: Summary stored: "${summaryTitle}" with ${sections.length} sections`)
    }

    this.saveToStorage()
  }

  /**
   * Get the current summary document
   */
  public getCurrentSummary(): SummaryDocument | null {
    return this.currentSummaryDocument
  }

  /**
   * Get all stored summaries
   */
  public getAllSummaries(): SummaryDocument[] {
    return Array.from(this.storedSummaries.values())
  }

  /**
   * Get summary by ID
   */
  public getSummaryById(summaryId: string): SummaryDocument | null {
    return this.storedSummaries.get(summaryId) || null
  }

  // ================================
  // Storage Management
  // ================================

  private initializeStorage(): void {
    try {
      // Only load from storage if we don't have active text
      if (this.currentOriginalText.length === 0) {
        this.loadFromStorage()
      } else {
        print(
          `SummaryStorage: Skipping loadFromStorage - preserving active text (${this.currentOriginalText.length} chars)`
        )
      }

      this.isInitialized = true

      if (this.enableDebugLogging) {
        print(`SummaryStorage: Initialized with ${this.storedSummaries.size} stored summaries`)
      }
    } catch (error) {
      if (this.enableDebugLogging) {
        print(`SummaryStorage: Initialization error: ${error}`)
      }
      this.onStorageError.invoke(`Initialization failed: ${error}`)
    }
  }

  private saveToStorage(): void {
    if (!this.enableStorage) {
      return
    }

    try {
      const storageData = {
        currentText: this.currentOriginalText,
        currentSummary: this.currentSummaryDocument,
        summaries: Array.from(this.storedSummaries.entries()),
        lastSaved: Date.now()
      }

      // Use Snap's persistent storage
      if (global.persistentStorageSystem) {
        const store = global.persistentStorageSystem.store
        store.putString(this.storageKey, JSON.stringify(storageData))

        if (this.enableDebugLogging) {
          print("SummaryStorage: 💾 Data saved to persistent storage")
        }
      }
    } catch (error) {
      if (this.enableDebugLogging) {
        print(`SummaryStorage: Save error: ${error}`)
      }
      this.onStorageError.invoke(`Save failed: ${error}`)
    }
  }

  private loadFromStorage(): void {
    if (!this.enableStorage) {
      print(`SummaryStorage: 🚫 loadFromStorage skipped - enableStorage is false`)
      return
    }

    try {
      if (global.persistentStorageSystem) {
        const store = global.persistentStorageSystem.store
        const storedDataString = store.getString(this.storageKey)

        print(`SummaryStorage: 🔍 loadFromStorage - current in-memory text length: ${this.currentOriginalText.length}`)
        print(
          `SummaryStorage: 💾 loadFromStorage - stored data exists: ${!!storedDataString}, length: ${storedDataString ? storedDataString.length : 0}`
        )

        if (storedDataString && storedDataString.length > 0) {
          const storageData = JSON.parse(storedDataString)

          // Load text from storage
          const storedTextLength = storageData.currentText ? storageData.currentText.length : 0
          print(`SummaryStorage: 📥 Loading stored text (${storedTextLength} chars)`)
          this.currentOriginalText = storageData.currentText || ""
          this.currentSummaryDocument = storageData.currentSummary || null

          // Restore summaries map
          this.storedSummaries.clear()
          if (storageData.summaries) {
            storageData.summaries.forEach(([key, value]) => {
              this.storedSummaries.set(key, value)
            })
          }

          if (this.enableDebugLogging) {
            print(`SummaryStorage: 📖 Loaded ${this.storedSummaries.size} summaries from storage`)
            print(`SummaryStorage: 📖 Loaded text length: ${this.currentOriginalText.length}`)
          }
        } else {
          print(`SummaryStorage: 📭 No stored data found - keeping current in-memory text`)
        }
      }
    } catch (error) {
      if (this.enableDebugLogging) {
        print(`SummaryStorage: Load error: ${error}`)
      }
      this.onStorageError.invoke(`Load failed: ${error}`)
    }
  }

  private cleanupOldSummaries(): void {
    if (this.storedSummaries.size <= this.maxStoredSummaries) {
      return
    }

    // Remove oldest summaries
    const summariesArray = Array.from(this.storedSummaries.entries()).sort((a, b) => a[1].createdAt - b[1].createdAt)

    const toRemove = summariesArray.slice(0, summariesArray.length - this.maxStoredSummaries)

    toRemove.forEach(([key, _]) => {
      this.storedSummaries.delete(key)
    })

    if (this.enableDebugLogging && toRemove.length > 0) {
      print(`SummaryStorage: Cleaned up ${toRemove.length} old summaries`)
    }
  }

  // ================================
  // Utility Methods
  // ================================

  public clearAllSummaries(): void {
    this.storedSummaries.clear()
    this.currentSummaryDocument = null
    this.currentOriginalText = ""

    this.saveToStorage()

    if (this.enableDebugLogging) {
      print("SummaryStorage: All summaries cleared")
    }
  }

  public getStorageStats(): {totalSummaries: number; currentTextLength: number; hasCurrentSummary: boolean} {
    return {
      totalSummaries: this.storedSummaries.size,
      currentTextLength: this.currentOriginalText.length,
      hasCurrentSummary: this.currentSummaryDocument !== null
    }
  }
}
