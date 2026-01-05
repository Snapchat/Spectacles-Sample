/**
 * Text Node Component for Diagram System
 * According to diagram specification - includes text title and text content
 * This is a standalone node component that handles its own display logic
 */
@component
export class TextNode extends BaseScriptComponent {
  // ================================
  // Inspector Configuration
  // ================================

  @input
  @hint("Text component for the node title")
  public titleText: Text

  @input
  @hint("Text component for the node content")
  public contentText: Text

  @input
  @hint("Unique identifier for this node")
  public nodeId: string = ""

  @input
  @hint("Position in the diagram structure")
  public nodePosition: vec3 = vec3.zero()

  @input
  @hint("Level in the diagram hierarchy")
  public nodeLevel: number = 1

  @input
  @hint("Enable debug logging for this node")
  public enableDebugLogging: boolean = false

  @input
  @hint("Is this the starting node of the diagram?")
  public isStartingNode: boolean = false

  // ================================
  // Internal State
  // ================================

  private isInitialized: boolean = false
  private title: string = ""
  private content: string = ""

  // Character limits according to diagram specification
  private static readonly MAX_TITLE_LENGTH: number = 50
  private static readonly MAX_CONTENT_LENGTH: number = 200

  // ================================
  // Lifecycle Methods
  // ================================

  onAwake() {
    this.initializeNode()
  }

  // ================================
  // Public Interface
  // ================================

  /**
   * Set the node data (title and content)
   */
  public setNodeData(title: string, content: string): void {
    this.title = this.enforceCharacterLimit(title, TextNode.MAX_TITLE_LENGTH)
    this.content = this.enforceCharacterLimit(content, TextNode.MAX_CONTENT_LENGTH)

    this.updateDisplay()

    if (this.enableDebugLogging) {
      print(
        `TextNode: Updated node ${this.nodeId} - Title: "${this.title}", Content: "${this.content.substring(0, 30)}..."`
      )
    }
  }

  /**
   * Get the current node data
   */
  public getNodeData(): {title: string; content: string} {
    return {
      title: this.title,
      content: this.content
    }
  }

  /**
   * Update the node position
   */
  public setPosition(position: vec3): void {
    this.nodePosition = position
    this.getTransform().setWorldPosition(position)

    if (this.enableDebugLogging) {
      print(`TextNode: Updated position for node ${this.nodeId} to ${position.toString()}`)
    }
  }

  /**
   * Get the current node position
   */
  public getPosition(): vec3 {
    return this.nodePosition
  }

  /**
   * Set the hierarchy level
   */
  public setLevel(level: number): void {
    this.nodeLevel = level

    if (this.enableDebugLogging) {
      print(`TextNode: Updated level for node ${this.nodeId} to ${level}`)
    }
  }

  /**
   * Get the hierarchy level
   */
  public getLevel(): number {
    return this.nodeLevel
  }

  /**
   * Initialize the node with generated content (if needed)
   */
  public async generateContent(prompt: string): Promise<void> {
    // For text nodes, content is typically provided directly
    // But this method exists for consistency with other node types

    if (this.enableDebugLogging) {
      print(`TextNode: Content generation called for node ${this.nodeId} with prompt: "${prompt}"`)
    }

    // Text nodes don't need AI-generated content typically
    // Content is set directly via setNodeData
  }

  /**
   * Update text content (for compatibility with old system)
   */
  public updateText(title: string, content: string): void {
    this.setNodeData(title, content)
  }

  /**
   * Set this node as the starting node (for compatibility with old system)
   */
  public setAsStartingNode(isStarting: boolean): void {
    this.isStartingNode = isStarting

    if (this.enableDebugLogging) {
      const nodeType = isStarting ? "starting" : "regular"
      print(`TextNode: Set node ${this.nodeId} as ${nodeType} node`)
    }
  }

  // ================================
  // Private Methods
  // ================================

  /**
   * Initialize the node component
   */
  private initializeNode(): void {
    if (this.isInitialized) return

    // Generate node ID if not provided
    if (!this.nodeId || this.nodeId === "") {
      this.nodeId = this.generateNodeId()
    }

    // Set initial content if texts exist
    if (this.titleText && this.titleText.text) {
      this.title = this.enforceCharacterLimit(this.titleText.text, TextNode.MAX_TITLE_LENGTH)
    }

    if (this.contentText && this.contentText.text) {
      this.content = this.enforceCharacterLimit(this.contentText.text, TextNode.MAX_CONTENT_LENGTH)
    }

    this.updateDisplay()
    this.isInitialized = true

    if (this.enableDebugLogging) {
      print(`TextNode: Initialized node ${this.nodeId} at level ${this.nodeLevel}`)
    }
  }

  /**
   * Update the visual display of the node
   */
  private updateDisplay(): void {
    if (this.titleText) {
      this.titleText.text = this.title
    }

    if (this.contentText) {
      this.contentText.text = this.content
    }
  }

  /**
   * Enforce character limits on text
   */
  private enforceCharacterLimit(text: string, maxLength: number): string {
    if (!text) return ""

    if (text.length > maxLength) {
      const truncated = text.substring(0, maxLength - 3) + "..."

      if (this.enableDebugLogging) {
        print(`TextNode: Truncated text from ${text.length} to ${maxLength} characters`)
      }

      return truncated
    }

    return text
  }

  /**
   * Generate a unique node ID
   */
  private generateNodeId(): string {
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 1000)
    return `text_node_${timestamp}_${random}`
  }
}
