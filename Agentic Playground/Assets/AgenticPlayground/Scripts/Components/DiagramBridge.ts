import Event from "SpectaclesInteractionKit.lspkg/Utils/Event"
import {DiagramStorage} from "../Storage/DiagramStorage"
import {DiagramExtensions} from "../Utils/DiagramExtensions"
import {CHARACTER_LIMITS, TextLimiter} from "../Utils/TextLimiter"
import {TreeStructureUtils} from "../Utils/TreeStructureUtils"
import {DiagramComponent} from "./DiagramComponent"

/**
 * DiagramBridge - Test framework for diagram functionality
 *
 * Provides comprehensive testing for:
 * 1. Mock storage data creation and diagram specifications
 * 2. Document parsing and node creation validation
 * 3. Visual diagram display testing
 * 4. Storage reset and initializationd
 *
 * According to architecture diagram, this handles the diagram flow:
 * diagram_tool → DiagramStorage → DiagramBridge → DiagramComponent
 */
@component
export class DiagramBridge extends BaseScriptComponent {
  @input
  @hint("Reference to DiagramStorage component")
  diagramStorage: DiagramStorage = null

  @input
  @hint("Reference to DiagramComponent for UI display")
  diagramLayout: DiagramComponent = null

  @input enableDebugLogging: boolean = true
  @input enableAutoUpdate: boolean = true
  @input updateInterval: number = 2 // seconds

  // Test Configuration
  @input
  @hint("Enable diagram testing with mock specifications")
  testDiagramWithSpecifications: boolean = false

  @input
  @hint("Test specification: AI, ML, Neural Networks, Computer Vision, NLP")
  testSpecification: string = "AI Fundamentals"

  @input
  @hint("Test phase index (0-4) for progressive diagram building")
  @widget(new SliderWidget(0, 4, 1))
  testPhaseIndex: number = 0

  // Removed: resetDiagramStorageOnAwake - now handled by StorageManager

  private isConnected: boolean = false
  private lastUpdateTime: number = 0
  private lastDiagramDocument: string = ""

  // Test Framework State
  private testSessionActive: boolean = false
  private testResults: Array<{timestamp: number; test: string; status: string; data?: any}> = []
  private lastTestTime: number = 0

  public onDiagramRefreshed: Event<string> = new Event<string>()
  public onError: Event<string> = new Event<string>()

  // Test Framework Events
  public onTestCompleted: Event<string> = new Event<string>()
  public onDebugMessage: Event<string> = new Event<string>()

  onAwake() {
    this.createEvent("OnStartEvent").bind(this.initialize.bind(this))

    if (this.enableAutoUpdate) {
      this.createEvent("UpdateEvent").bind(this.checkForUpdates.bind(this))
    }

    if (this.enableDebugLogging) {
      print("DiagramBridge: 🌉 Diagram bridge component awakened")
    }

    // Store initial phase value
    this.lastPhaseIndex = this.testPhaseIndex
  }

  private lastPhaseIndex: number = 0

  private initialize(): void {
    // Storage reset is now handled centrally by StorageManager
    // The StorageManager will reset DiagramStorage if configured to do so

    this.validateComponents()
    this.setupConnections()
    this.setupTestFramework()
    this.loadCurrentDiagram()

    if (this.enableDebugLogging) {
      print("DiagramBridge: Test framework initialized successfully")
    }
  }

  private validateComponents(): void {
    if (!this.diagramStorage) {
      print("DiagramBridge: DiagramStorage not assigned")
      return
    }

    if (!this.diagramLayout) {
      print("DiagramBridge: DiagramLayout not assigned")
      return
    }
  }

  private setupConnections(): void {
    this.isConnected = true

    if (this.enableDebugLogging) {
      print("DiagramBridge: Bridge connections established")
    }
  }

  /**
   * Setup the test framework
   */
  private setupTestFramework(): void {
    this.testResults = []
    this.lastTestTime = Date.now()

    if (this.enableDebugLogging) {
      print("DiagramBridge: 🧪 Test framework setup complete")
      print(`  - Diagram Testing: ${this.testDiagramWithSpecifications ? "ENABLED" : "DISABLED"}`)
      print(`  - Test Specification: ${this.testSpecification}`)
      print(`  - Test Phase: ${this.testPhaseIndex}`)
    }
  }

  /**
   * Load current diagram from storage
   */
  private loadCurrentDiagram(): void {
    if (!this.diagramStorage || !this.diagramLayout) return

    try {
      const currentDocument = this.diagramStorage.getCurrentDiagramDocument()

      if (currentDocument && currentDocument.trim().length > 0) {
        const processedDocument = this.processDocumentWithLimits(currentDocument)
        this.displayDiagramDocument(processedDocument)
        this.lastDiagramDocument = processedDocument

        if (this.enableDebugLogging) {
          print(`DiagramBridge: 📚 Loaded and processed diagram document (${processedDocument.length} characters)`)
        }
      }
    } catch (error) {
      print(`DiagramBridge: Failed to load current diagram: ${error}`)
    }
  }

  /**
   * Process diagram document content to enforce character limits
   */
  private processDocumentWithLimits(document: string): string {
    try {
      const lines = document.split("\n")
      const processedLines: string[] = []

      for (let line of lines) {
        line = line.trim()
        if (line.length === 0) continue

        if (line.toLowerCase().startsWith("title:") || line.toLowerCase().startsWith("diagramtitle:")) {
          const title = line.substring(line.indexOf(":") + 1).trim()
          const limitedTitle = TextLimiter.limitText(title, CHARACTER_LIMITS.NODE_TITLE_GENERAL)
          processedLines.push(line.substring(0, line.indexOf(":") + 1) + " " + limitedTitle)
        } else if (line.toLowerCase().includes("node") && line.includes(":")) {
          const limitedLine = TextLimiter.limitText(line, CHARACTER_LIMITS.NODE_DESCRIPTION_GENERAL)
          processedLines.push(limitedLine)
        } else {
          const limitedLine = TextLimiter.limitText(line, CHARACTER_LIMITS.NODE_DESCRIPTION_GENERAL)
          processedLines.push(limitedLine)
        }
      }

      const processedDocument = processedLines.join("\n")

      if (this.enableDebugLogging && processedDocument.length !== document.length) {
        print(`DiagramBridge: Document processed: ${document.length} → ${processedDocument.length} chars`)
      }

      return processedDocument
    } catch (error) {
      print(`DiagramBridge: Error processing document with limits: ${error}`)
      return document
    }
  }

  /**
   * Display diagram document content
   */
  private displayDiagramDocument(document: string): void {
    if (!this.diagramLayout) return

    try {
      this.clearDiagramDisplay()
      this.createVisualDiagram()
      this.onDiagramRefreshed.invoke(document)

      if (this.enableDebugLogging) {
        print(`DiagramBridge: Displayed diagram with visual nodes (${document.length} characters)`)
      }
    } catch (error) {
      print(`DiagramBridge: Failed to display diagram: ${error}`)
      this.onError.invoke(`Diagram display failed: ${error}`)
    }
  }

  /**
   * Extract diagram title from document
   */
  private extractDiagramTitle(document: string): string {
    const lines = document.split("\n")
    for (const line of lines) {
      const trimmedLine = line.trim()
      if (trimmedLine.toLowerCase().startsWith("diagramtitle:")) {
        return trimmedLine.substring(trimmedLine.indexOf(":") + 1).trim()
      }
    }
    return "Diagram" // Default title
  }

  /**
   * Create visual diagram from stored diagram data
   */
  private createVisualDiagram(): void {
    if (!this.diagramStorage || !this.diagramLayout) return

    try {
      const diagramDocument = this.diagramStorage.getCurrentDiagramDocument()
      if (!diagramDocument || diagramDocument.trim().length === 0) {
        print("DiagramBridge: No diagram document available for visualization")
        return
      }

      // Extract diagram title
      const diagramTitle = this.extractDiagramTitle(diagramDocument)

      const nodes = this.parseDocumentForNodes(diagramDocument)
      if (nodes.length === 0) {
        print("DiagramBridge: No nodes found in diagram document")
        return
      }

      if (!DiagramExtensions.isReady(this.diagramLayout)) {
        print("DiagramBridge: Initializing diagram component...")
        const diagramAny = this.diagramLayout as any
        if (typeof diagramAny.resetSystem === "function") {
          diagramAny.resetSystem()
        }
      } else {
        DiagramExtensions.clearDiagram(this.diagramLayout)
      }

      // Use phased approach for progressive tree building
      this.buildDiagramInPhases(diagramTitle, nodes)
    } catch (error) {
      print(`DiagramBridge: Failed to create visual diagram: ${error}`)
    }
  }

  /**
   * Build diagram progressively in phases for clean tree structure
   */
  private buildDiagramInPhases(diagramTitle: string, nodes: Array<any>): void {
    const nodeCreationData = new Map<string, {position: vec3; level: number; parentId?: string}>()
    const maxChildrenPerNode = 4
    let nodeCount = 0

    // Phase 0: Create central node with simplified ID
    const startingPosition = this.getStartingPosition()
    const centralNodeId = "central_node" // Use simple ID for reliable connections
    const centralNodeDisplayId = diagramTitle // Use diagram title as display ID

    // Create central node with diagram title as the display name
    const centralSuccess = this.createNodeByTypeWithId(
      {type: "text", title: diagramTitle, content: diagramTitle},
      centralNodeDisplayId, // Pass diagram title as ID so it becomes the display name
      startingPosition,
      0
    )

    if (centralSuccess) {
      nodeCount++
      // Track it with "central_node" for connections, but it displays the diagram title
      nodeCreationData.set(centralNodeId, {position: startingPosition, level: 0})
      // Also track it by its display ID for potential future lookups
      nodeCreationData.set(centralNodeDisplayId, {position: startingPosition, level: 0})
      print(
        `DiagramBridge: Phase 0 - Created central node with display: "${diagramTitle}" tracked as: "${centralNodeId}"`
      )
    } else {
      print("DiagramBridge: Failed to create central node")
      return
    }

    // Phase 1: Calculate optimal tree structure
    const treeStructure = this.calculateOptimalTreeStructure(nodes, maxChildrenPerNode)

    // Phase 2: Create level 1 nodes (main branches)
    const level1Nodes = treeStructure.level1
    const levelSeparation = this.getLevelSeparation()

    level1Nodes.forEach((node, index) => {
      if (nodeCount >= 30) return

      const position = this.calculateTreeNodePosition(startingPosition, index, level1Nodes.length, 1, levelSeparation)

      // Use title as the node identifier (it will be used as both ID and display name)
      // Add a suffix to ensure uniqueness
      const nodeId = `${node.title}_${nodeCount + 1}`
      const success = this.createNodeByTypeWithId(node, nodeId, position, 1)

      if (success) {
        nodeCount++
        nodeCreationData.set(nodeId, {
          position: position,
          level: 1,
          parentId: centralNodeId
        })

        // Connect to central node immediately using the display ID
        const connectionSuccess = DiagramExtensions.addConnection(this.diagramLayout, centralNodeDisplayId, nodeId)
        if (!connectionSuccess) {
          print(`DiagramBridge: Failed to connect "${nodeId}" to central node`)
        } else {
          print(`DiagramBridge: Connected "${nodeId}" to central node`)
        }
        print(`DiagramBridge: Phase 2 - Added level 1 node: "${node.title}" with ID: "${nodeId}"`)
      }
    })

    // Phase 3: Create level 2 nodes (sub-branches)
    treeStructure.level2.forEach((nodeGroup) => {
      if (nodeCount >= 30) return

      const parentData = nodeCreationData.get(nodeGroup.parentId)
      if (!parentData) return

      nodeGroup.children.forEach((node, index) => {
        if (nodeCount >= 30) return

        const position = this.calculateTreeNodePosition(
          parentData.position,
          index,
          nodeGroup.children.length,
          2,
          levelSeparation * 0.7,
          true // Enable Y-axis collision avoidance
        )

        // Use title as the node identifier (it will be used as both ID and display name)
        // Add a suffix to ensure uniqueness
        const nodeId = `${node.title}_${nodeCount + 1}`
        const success = this.createNodeByTypeWithId(node, nodeId, position, 2)

        if (success) {
          nodeCount++
          nodeCreationData.set(nodeId, {
            position: position,
            level: 2,
            parentId: nodeGroup.parentId
          })

          // Connect to parent
          const childConnectionSuccess = DiagramExtensions.addConnection(this.diagramLayout, nodeGroup.parentId, nodeId)
          if (!childConnectionSuccess) {
            print(`DiagramBridge: Failed to connect "${node.title}" to parent "${nodeGroup.parentId}"`)
          }
          print(`DiagramBridge: Phase 3 - Added level 2 node: "${node.title}" to parent "${nodeGroup.parentId}"`)
        }
      })
    })

    print(`DiagramBridge: Completed phased diagram creation with ${nodeCount} nodes`)
  }

  /**
   * Calculate optimal tree structure for clean layout
   */
  private calculateOptimalTreeStructure(nodes: Array<any>, maxChildrenPerNode: number): any {
    // For phased test mode, nodes are already properly structured
    // Ensure we have max 4 level 1 nodes for clean layout
    const level1Count = Math.min(4, Math.ceil(Math.sqrt(nodes.length)))
    const level1Nodes = nodes.slice(0, level1Count)

    // Distribute remaining nodes as level 2
    const remainingNodes = nodes.slice(level1Count)
    const level2Groups: Array<{parentId: string; children: Array<any>}> = []

    // We need to track the parent node IDs based on their titles
    const parentNodeIds: string[] = []

    level1Nodes.forEach((parent, parentIndex) => {
      // Parent ID will be title_index format as created in buildDiagramInPhases
      const parentNodeId = `${parent.title}_${parentIndex + 2}` // +2 because central node is 1, and we start counting from there
      parentNodeIds.push(parentNodeId)

      const childCount = Math.min(maxChildrenPerNode, Math.ceil(remainingNodes.length / (level1Count - parentIndex)))

      const children = remainingNodes.splice(0, childCount)
      if (children.length > 0) {
        level2Groups.push({
          parentId: parentNodeId,
          children: children
        })
      }
    })

    return {
      level1: level1Nodes,
      level2: level2Groups
    }
  }

  /**
   * Calculate position for tree node with improved spacing
   */
  private calculateTreeNodePosition(
    parentPosition: vec3,
    index: number,
    siblingCount: number,
    level: number,
    distance: number,
    useYAxisSeparation: boolean = false
  ): vec3 {
    const startDir = this.getStartDirectionPosition()
    const endDir = this.getEndDirectionPosition()

    // Use TreeStructureUtils for better positioning
    const positions = TreeStructureUtils.calculateChildPositions(
      parentPosition,
      siblingCount,
      level,
      distance,
      this.getAngularSpread(),
      this.getMinBranchDistance(),
      startDir,
      endDir,
      useYAxisSeparation && this.getEnableYVariation(),
      this.getMaxYVariation()
    )

    if (index < positions.length) {
      return positions[index]
    }

    // Fallback position
    return new vec3(parentPosition.x + distance, parentPosition.y, parentPosition.z)
  }

  /**
   * Create node based on type
   */
  private createNodeByType(node: any, position: vec3, level: number): boolean {
    // Pass content as-is, let the prefabs handle text wrapping
    let success = false
    const nodeId = node.title // Use title as ID

    switch (node.type) {
      case "image":
        success = DiagramExtensions.addImageNode(this.diagramLayout, nodeId, node.content, position, level)
        break
      case "model":
        success = DiagramExtensions.addModelNode(this.diagramLayout, nodeId, node.content, position, level)
        break
      case "text":
      default:
        success = DiagramExtensions.addTextNode(this.diagramLayout, nodeId, node.content, position, level)
        break
    }

    if (success) {
      print(`DiagramBridge: Created ${node.type} node with ID: "${nodeId}"`)
    } else {
      print(`DiagramBridge: Failed to create ${node.type} node with ID: "${nodeId}"`)
    }

    return success
  }

  /**
   * Create node with explicit ID
   */
  private createNodeByTypeWithId(node: any, nodeId: string, position: vec3, level: number): boolean {
    // The nodeId now contains the title, so DiagramComponent will use it as the display name
    // We need to format content to include prompts for DiagramComponent's extraction logic
    let success = false

    // Content should be clean without prompts - they'll be handled separately
    const cleanContent = node.content || ""

    switch (node.type) {
      case "image": {
        // DiagramComponent expects prompt embedded in content for extraction
        let imageContent = cleanContent
        if (node.imagePrompt) {
          imageContent += `\nimagePrompt: "${node.imagePrompt}"`
        }
        success = DiagramExtensions.addImageNode(
          this.diagramLayout,
          nodeId, // Contains title_suffix, will be used as display name
          imageContent, // Content with embedded prompt for extraction
          position,
          level
        )
        break
      }
      case "model": {
        // DiagramComponent expects prompt embedded in content for extraction
        let modelContent = cleanContent
        if (node.modelPrompt) {
          modelContent += `\nmodelPrompt: "${node.modelPrompt}"`
        }
        success = DiagramExtensions.addModelNode(
          this.diagramLayout,
          nodeId, // Contains title_suffix, will be used as display name
          modelContent, // Content with embedded prompt for extraction
          position,
          level
        )
        break
      }
      case "text":
      default:
        success = DiagramExtensions.addTextNode(
          this.diagramLayout,
          nodeId, // Contains title_suffix, will be used as display name
          cleanContent, // Just the content
          position,
          level
        )
        break
    }

    if (success) {
      print(`DiagramBridge: Created ${node.type} node: "${node.title}" (ID: ${nodeId})`)
    } else {
      print(`DiagramBridge: Failed to create ${node.type} node: "${node.title}"`)
    }

    return success
  }

  /**
   * Group nodes by their level for hierarchical processing
   */
  private groupNodesByLevel(nodes: Array<any>): Map<number, Array<any>> {
    const levelMap = new Map<number, Array<any>>()

    nodes.forEach((node) => {
      const level = node.level || 1
      if (!levelMap.has(level)) {
        levelMap.set(level, [])
      }
      levelMap.get(level)!.push(node)
    })

    return levelMap
  }

  /**
   * Calculate position using direction references
   */
  private calculateDirectionalPosition(
    center: vec3,
    index: number,
    totalCount: number,
    level: number,
    startDir?: vec3,
    endDir?: vec3
  ): vec3 {
    const radius = level * this.getLevelSeparation()

    if (startDir && endDir) {
      // Use direction vector
      const dirVector = endDir.sub(startDir).normalize()
      const baseAngle = Math.atan2(dirVector.z, dirVector.x)

      // Spread nodes along the direction arc
      const spread = (this.getAngularSpread() * Math.PI) / 180
      const angleStep = totalCount > 1 ? spread / (totalCount - 1) : 0
      const angle = baseAngle - spread / 2 + index * angleStep

      return new vec3(
        center.x + radius * Math.cos(angle),
        center.y + level * this.getYVariation(),
        center.z + radius * Math.sin(angle)
      )
    } else {
      // Default circular arrangement
      const angleStep = (2 * Math.PI) / totalCount
      const angle = index * angleStep

      return new vec3(
        center.x + radius * Math.cos(angle),
        center.y + level * this.getYVariation(),
        center.z + radius * Math.sin(angle)
      )
    }
  }

  /**
   * Calculate child position relative to parent
   */
  private calculateChildPosition(parentTitle: string, index: number, siblingCount: number, level: number): vec3 {
    // For now, return a position offset from origin
    // In a real implementation, you'd look up the parent's actual position
    const radius = level * this.getLevelSeparation() * 0.7
    const angleStep = Math.PI / 3 / Math.max(1, siblingCount - 1) // 60 degree spread
    const angle = -Math.PI / 6 + index * angleStep // Center the spread

    return new vec3(radius * Math.cos(angle), level * this.getYVariation(), radius * Math.sin(angle))
  }

  /**
   * Get Y variation for level
   */
  private getYVariation(): number {
    return this.getEnableYVariation() ? this.getMaxYVariation() * 0.5 : 0
  }

  /**
   * Parse diagram document to extract node information
   */
  private parseDocumentForNodes(
    document: string
  ): Array<{title: string; content: string; type: string; imagePrompt?: string; modelPrompt?: string}> {
    const nodes: Array<{title: string; content: string; type: string; imagePrompt?: string; modelPrompt?: string}> = []

    try {
      if (this.enableDebugLogging) {
        print(`DiagramBridge: 📋 Parsing document (${document.length} chars)`)
      }

      const lines = document.split("\n")
      let currentNode: {
        title: string
        content: string
        type: string
        imagePrompt?: string
        modelPrompt?: string
      } | null = null

      for (const line of lines) {
        const trimmedLine = line.trim()
        if (trimmedLine.length === 0) continue

        if (trimmedLine.match(/^Node \d+:/)) {
          if (currentNode) {
            nodes.push(currentNode)
          }
          const nodeTypeMatch = trimmedLine.match(/^Node \d+:\s*(.+)$/)
          const nodeType = nodeTypeMatch ? nodeTypeMatch[1].trim() : "text"

          currentNode = {
            title: "",
            content: "",
            type: nodeType
          }
        } else if (currentNode && trimmedLine.toLowerCase().startsWith("text title:")) {
          currentNode.title = trimmedLine
            .substring(trimmedLine.indexOf(":") + 1)
            .trim()
            .replace(/"/g, "")
        } else if (currentNode && trimmedLine.toLowerCase().startsWith("text content:")) {
          currentNode.content = trimmedLine
            .substring(trimmedLine.indexOf(":") + 1)
            .trim()
            .replace(/"/g, "")
        } else if (currentNode && trimmedLine.toLowerCase().startsWith("image prompt:")) {
          currentNode.imagePrompt = trimmedLine
            .substring(trimmedLine.indexOf(":") + 1)
            .trim()
            .replace(/"/g, "")
        } else if (currentNode && trimmedLine.toLowerCase().startsWith("model prompt:")) {
          currentNode.modelPrompt = trimmedLine
            .substring(trimmedLine.indexOf(":") + 1)
            .trim()
            .replace(/"/g, "")
        }
      }

      if (currentNode) {
        nodes.push(currentNode)
      }

      print(`DiagramBridge: 📋 Parsed ${nodes.length} nodes from document`)
      return nodes
    } catch (error) {
      print(`DiagramBridge: Error parsing document: ${error}`)
      return []
    }
  }

  /**
   * Clear diagram display
   */
  private clearDiagramDisplay(): void {
    if (!this.diagramLayout) return

    try {
      DiagramExtensions.clearDiagram(this.diagramLayout)

      if (this.enableDebugLogging) {
        print("DiagramBridge: Diagram display cleared")
      }
    } catch (error) {
      print(`DiagramBridge: Failed to clear diagram display: ${error}`)
    }
  }

  /**
   * Check for diagram updates periodically
   */
  private checkForUpdates(): void {
    if (!this.isConnected || !this.diagramStorage) {
      return
    }

    // Check if test phase has changed
    if (this.testDiagramWithSpecifications && this.testPhaseIndex !== this.lastPhaseIndex) {
      if (this.enableDebugLogging) {
        print(`DiagramBridge: Test phase changed from ${this.lastPhaseIndex} to ${this.testPhaseIndex}`)
      }
      this.lastPhaseIndex = this.testPhaseIndex
      this.runDiagramSpecificationTest()
      return // Skip other checks when phase changes
    }

    const timeSinceUpdate = (Date.now() - this.lastUpdateTime) / 1000

    if (timeSinceUpdate >= this.updateInterval) {
      try {
        const currentDocument = this.diagramStorage.getCurrentDiagramDocument()

        if (currentDocument !== this.lastDiagramDocument) {
          const processedDocument = this.processDocumentWithLimits(currentDocument)

          if (processedDocument !== this.lastDiagramDocument) {
            this.displayDiagramDocument(processedDocument)
            this.lastDiagramDocument = processedDocument

            if (this.enableDebugLogging) {
              print("DiagramBridge: Diagram document updated and processed")
            }
          }
        }
      } catch (error) {
        if (this.enableDebugLogging) {
          print(`DiagramBridge: Error checking for updates: ${error}`)
        }
      }

      this.runTestCycle()
      this.lastUpdateTime = Date.now()
    }
  }

  /**
   * Main test cycle - runs during update
   */
  private runTestCycle(): void {
    const currentTime = Date.now()
    const timeSinceTest = (currentTime - this.lastTestTime) / 1000

    if (this.testDiagramWithSpecifications && timeSinceTest >= 10) {
      this.runDiagramSpecificationTest()
      this.lastTestTime = currentTime
    }
  }

  /**
   * Test diagram creation with mock specifications using phases
   */
  private runDiagramSpecificationTest(): void {
    if (!this.diagramStorage || !this.diagramLayout) {
      this.logTestResult("DIAGRAM_SPECIFICATION_TEST", "SKIPPED", "Missing required components")
      return
    }

    try {
      // Create mock data for the current phase
      const mockDiagramData = this.createPhasedMockDiagramData(this.testSpecification, this.testPhaseIndex)
      this.applyMockDataToStorage(mockDiagramData)

      // Create visual diagram with current phase data
      this.createVisualDiagram()

      this.logTestResult("DIAGRAM_SPECIFICATION_TEST", "SUCCESS", {
        specification: this.testSpecification,
        phase: this.testPhaseIndex,
        nodeCount: mockDiagramData.nodeCount,
        documentLength: mockDiagramData.document.length
      })

      if (this.enableDebugLogging) {
        print(`DiagramBridge: Test Phase ${this.testPhaseIndex}: ${this.getPhaseDescription(this.testPhaseIndex)}`)
        print(`  - Created diagram with ${mockDiagramData.nodeCount} nodes`)
      }
    } catch (error) {
      this.logTestResult("DIAGRAM_SPECIFICATION_TEST", "ERROR", `Test failed: ${error}`)
    }
  }

  /**
   * Get description for current test phase
   */
  private getPhaseDescription(phase: number): string {
    const descriptions = [
      "Central node only",
      "Central + Level 1 branches",
      "Central + Level 1 + First level 2 branch",
      "Central + Level 1 + More level 2 branches",
      "Complete tree with all branches"
    ]
    return descriptions[phase] || "Unknown phase"
  }

  /**
   * Create phased mock diagram data based on specification and phase
   */
  private createPhasedMockDiagramData(
    specification: string,
    phase: number
  ): {document: string; nodes: any[]; nodeCount: number} {
    const specData = this.getSpecificationData(specification)
    const nodes = []
    let nodeCount = 0

    // Phase-based node selection
    let conceptsToUse = []

    switch (phase) {
      case 0: // Central node only
        conceptsToUse = [specData.centralNode]
        break
      case 1: // Central + Level 1 branches (4 nodes)
        conceptsToUse = [specData.centralNode, ...specData.level1Branches.slice(0, 4)]
        break
      case 2: // Central + Level 1 + First level 2 branch
        conceptsToUse = [
          specData.centralNode,
          ...specData.level1Branches.slice(0, 4),
          ...specData.level2Branches.slice(0, 2)
        ]
        break
      case 3: // Central + Level 1 + More level 2 branches
        conceptsToUse = [
          specData.centralNode,
          ...specData.level1Branches.slice(0, 4),
          ...specData.level2Branches.slice(0, 6)
        ]
        break
      case 4: // Complete tree
        conceptsToUse = [specData.centralNode, ...specData.level1Branches, ...specData.level2Branches]
        break
      default:
        conceptsToUse = [specData.centralNode]
    }

    // Generate document
    let document = `DiagramTitle: ${specData.title}\n\n`
    document += `Nodes: ${conceptsToUse.length}\n\n`

    conceptsToUse.forEach((concept, index) => {
      const nodeType = this.selectNodeTypeForPhase(index, phase)
      const node = {
        nodeIndex: index + 1,
        nodeType: nodeType,
        textTitle: concept.title,
        textContent: concept.content,
        imagePrompt: concept.imagePrompt,
        modelPrompt: concept.modelPrompt
      }

      nodes.push(node)
      nodeCount++

      document += `Node ${index + 1}: ${nodeType}\n`
      document += `Text title: "${concept.title}"\n`
      document += `Text content: "${concept.content}"\n`

      if (nodeType === "image" && concept.imagePrompt) {
        document += `Image prompt: "${concept.imagePrompt}"\n`
      } else if (nodeType === "model" && concept.modelPrompt) {
        document += `Model prompt: "${concept.modelPrompt}"\n`
      }

      if (index < conceptsToUse.length - 1) {
        document += "\n"
      }
    })

    return {document, nodes, nodeCount}
  }

  /**
   * Select node type based on phase and index
   */
  private selectNodeTypeForPhase(index: number, phase: number): "text" | "image" | "model" {
    // Central node is always text
    if (index === 0) return "text"

    // Phase 0-1: All text nodes
    if (phase <= 1) return "text"

    // Phase 2-4: Mix of node types
    const types: ("text" | "image" | "model")[] = ["text", "image", "model"]
    return types[index % 3]
  }

  /**
   * Get specification data for different topics with hierarchical structure
   */
  private getSpecificationData(specification: string): {
    title: string
    centralNode: any
    level1Branches: any[]
    level2Branches: any[]
  } {
    const specifications = {
      "AI Fundamentals": {
        title: "Artificial Intelligence Fundamentals",
        centralNode: {
          title: "AI Fundamentals",
          content: "Core concepts of artificial intelligence",
          imagePrompt: "AI brain concept",
          modelPrompt: "3D AI neural structure"
        },
        level1Branches: [
          {
            title: "Machine Learning",
            content: "Algorithms that improve through experience",
            imagePrompt: "machine learning algorithm flowchart",
            modelPrompt: "3D neural network structure"
          },
          {
            title: "Expert Systems",
            content: "Computer systems that emulate expert decision-making",
            imagePrompt: "expert system knowledge base",
            modelPrompt: "3D knowledge representation tree"
          },
          {
            title: "Natural Language Processing",
            content: "Enabling computers to understand human language",
            imagePrompt: "text processing pipeline",
            modelPrompt: "3D language model architecture"
          },
          {
            title: "Computer Vision",
            content: "Teaching machines to interpret visual information",
            imagePrompt: "computer vision processing layers",
            modelPrompt: "3D convolutional network"
          }
        ],
        level2Branches: [
          {
            title: "Supervised Learning",
            content: "Learning from labeled training data",
            imagePrompt: "supervised learning diagram",
            modelPrompt: "3D classification boundary"
          },
          {
            title: "Unsupervised Learning",
            content: "Finding patterns in unlabeled data",
            imagePrompt: "clustering visualization",
            modelPrompt: "3D cluster analysis"
          },
          {
            title: "Knowledge Base",
            content: "Structured information storage",
            imagePrompt: "knowledge graph visualization",
            modelPrompt: "3D semantic network"
          },
          {
            title: "Inference Engine",
            content: "Reasoning and decision-making logic",
            imagePrompt: "inference process flowchart",
            modelPrompt: "3D decision tree"
          },
          {
            title: "Tokenization",
            content: "Breaking text into meaningful units",
            imagePrompt: "text tokenization process",
            modelPrompt: "3D token embedding space"
          },
          {
            title: "Semantic Analysis",
            content: "Understanding meaning and context",
            imagePrompt: "semantic network diagram",
            modelPrompt: "3D word vector space"
          },
          {
            title: "Object Detection",
            content: "Identifying objects in images",
            imagePrompt: "object detection bounding boxes",
            modelPrompt: "3D feature extraction layers"
          },
          {
            title: "Image Segmentation",
            content: "Partitioning images into regions",
            imagePrompt: "segmentation mask visualization",
            modelPrompt: "3D segmentation network"
          }
        ]
      }
    }

    return specifications[specification] || specifications["AI Fundamentals"]
  }

  /**
   * Apply mock data to diagram storage
   */
  private applyMockDataToStorage(mockData: {document: string; nodes: any[]; nodeCount?: number}): void {
    if (!this.diagramStorage) return

    try {
      this.diagramStorage.clearAllDiagrams()
      const specTitle = this.getSpecificationData(this.testSpecification).title
      this.diagramStorage.createNewDiagram(specTitle)

      mockData.nodes.forEach((node) => {
        this.diagramStorage.addNode(
          node.nodeType,
          node.textTitle,
          node.textContent,
          node.imagePrompt || node.modelPrompt
        )
      })

      if (this.enableDebugLogging) {
        print(`DiagramBridge: 💾 Applied mock data to storage: ${mockData.nodes.length} nodes`)
      }
    } catch (error) {
      if (this.enableDebugLogging) {
        print(`DiagramBridge: Failed to apply mock data to storage: ${error}`)
      }
    }
  }

  /**
   * Reset diagram storage
   */
  public resetDiagramStorage(): void {
    if (!this.diagramStorage) {
      if (this.enableDebugLogging) {
        print("DiagramBridge: Cannot reset - DiagramStorage not available")
      }
      return
    }

    try {
      this.diagramStorage.clearAllDiagrams()
      this.clearDiagramDisplay()
      this.lastDiagramDocument = ""
      this.testResults = []

      if (this.enableDebugLogging) {
        print("DiagramBridge: Diagram storage reset complete")
      }

      this.logTestResult("STORAGE_RESET", "SUCCESS", "Diagram storage cleared and reset")
    } catch (error) {
      this.logTestResult("STORAGE_RESET", "ERROR", `Reset failed: ${error}`)

      if (this.enableDebugLogging) {
        print(`DiagramBridge: Failed to reset storage: ${error}`)
      }
    }
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
      print(`DiagramBridge: TEST ${testName}: ${status} ${dataStr}`)
    }

    if (status === "ERROR") {
      this.onError.invoke(`${testName}: ${data}`)
    } else {
      this.onTestCompleted.invoke(`${testName}: ${status}`)
    }

    this.onDebugMessage.invoke(`${testName}: ${status}`)
  }

  // ================================
  // Public API
  // ================================

  /**
   * Force refresh diagram display
   */
  public refreshDiagramDisplay(): void {
    this.loadCurrentDiagram()
  }

  /**
   * Clear all diagram content
   */
  public clearAllDiagram(): void {
    if (this.diagramStorage) {
      this.diagramStorage.clearAllDiagrams()
    }
    this.clearDiagramDisplay()

    if (this.enableDebugLogging) {
      print("DiagramBridge: All diagram content cleared")
    }
  }

  /**
   * Create a test diagram
   */
  public createTestDiagram(): void {
    if (!this.diagramStorage) return

    const testTitle = TextLimiter.limitText("Test Diagram with Character Limits", CHARACTER_LIMITS.NODE_TITLE_GENERAL)
    this.diagramStorage.createNewDiagram(testTitle)

    const textTitle = TextLimiter.limitText("Test Text Node", CHARACTER_LIMITS.TEXT_NODE_TITLE)
    const textContent = TextLimiter.limitText(
      "This is a test text node with properly limited content",
      CHARACTER_LIMITS.TEXT_NODE_CONTENT
    )

    this.diagramStorage.addNode("text", textTitle, textContent)
    this.refreshDiagramDisplay()

    if (this.enableDebugLogging) {
      print("DiagramBridge: 🧪 Test diagram created with text limits enforced")
    }
  }

  /**
   * Manually trigger diagram specification test
   */
  public triggerDiagramSpecificationTest(): void {
    if (this.enableDebugLogging) {
      print("DiagramBridge: Manually triggering diagram specification test")
    }

    this.testDiagramWithSpecifications = true
    this.runDiagramSpecificationTest()
  }

  /**
   * Get test framework status
   */
  public getTestFrameworkStatus(): {
    isActive: boolean
    testSpecification: string
    testPhase: number
    testResults: number
    lastTestTime: number
  } {
    return {
      isActive: this.testDiagramWithSpecifications,
      testSpecification: this.testSpecification,
      testPhase: this.testPhaseIndex,
      testResults: this.testResults.length,
      lastTestTime: this.lastTestTime
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
      print("DiagramBridge: Test results cleared")
    }
  }

  // ================================
  // DiagramComponent Configuration Access
  // ================================

  /**
   * Get starting position from DiagramComponent configuration
   */
  private getStartingPosition(): vec3 {
    if (!this.diagramLayout) return vec3.zero()

    try {
      const diagramAny = this.diagramLayout as any
      if (diagramAny.startDirectionRef) {
        return diagramAny.startDirectionRef.getTransform().getWorldPosition()
      }
    } catch (error) {
      if (this.enableDebugLogging) {
        print(`DiagramBridge: Could not get starting position: ${error}`)
      }
    }

    return vec3.zero()
  }

  /**
   * Get level separation from DiagramComponent configuration
   */
  private getLevelSeparation(): number {
    if (!this.diagramLayout) return 200

    try {
      const diagramAny = this.diagramLayout as any
      return diagramAny.levelSeparation || 200
    } catch (error) {
      return 200
    }
  }

  /**
   * Get angular spread from DiagramComponent configuration
   */
  private getAngularSpread(): number {
    if (!this.diagramLayout) return 90

    try {
      const diagramAny = this.diagramLayout as any
      return diagramAny.angularSpread || 90
    } catch (error) {
      return 90
    }
  }

  /**
   * Get minimum branch distance from DiagramComponent configuration
   */
  private getMinBranchDistance(): number {
    if (!this.diagramLayout) return 100

    try {
      const diagramAny = this.diagramLayout as any
      return diagramAny.minBranchDistance || 100
    } catch (error) {
      return 100
    }
  }

  /**
   * Get start direction position from DiagramComponent configuration
   */
  private getStartDirectionPosition(): vec3 | undefined {
    if (!this.diagramLayout) return undefined

    try {
      const diagramAny = this.diagramLayout as any
      if (diagramAny.startDirectionRef) {
        return diagramAny.startDirectionRef.getTransform().getWorldPosition()
      }
    } catch (error) {
      // No logging for missing optional references
    }

    return undefined
  }

  /**
   * Get end direction position from DiagramComponent configuration
   */
  private getEndDirectionPosition(): vec3 | undefined {
    if (!this.diagramLayout) return undefined

    try {
      const diagramAny = this.diagramLayout as any
      if (diagramAny.endDirectionRef) {
        return diagramAny.endDirectionRef.getTransform().getWorldPosition()
      }
    } catch (error) {
      // No logging for missing optional references
    }

    return undefined
  }

  /**
   * Get Y variation setting from DiagramComponent configuration
   */
  private getEnableYVariation(): boolean {
    if (!this.diagramLayout) return true

    try {
      const diagramAny = this.diagramLayout as any
      return diagramAny.enableYVariation !== undefined ? diagramAny.enableYVariation : true
    } catch (error) {
      return true
    }
  }

  /**
   * Get maximum Y variation from DiagramComponent configuration
   */
  private getMaxYVariation(): number {
    if (!this.diagramLayout) return 80

    try {
      const diagramAny = this.diagramLayout as any
      return diagramAny.maxYVariation || 80
    } catch (error) {
      return 80
    }
  }
}
