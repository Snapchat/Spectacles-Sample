import {AgentLanguageInterface} from "../Agents/AgentLanguageInterface"
import {DiagramNode, Message} from "../Agents/AgentTypes"
import {ChatStorage} from "../Storage/ChatStorage"
import {DiagramStorage} from "../Storage/DiagramStorage"
import {SummaryStorage} from "../Storage/SummaryStorage"
import {CHARACTER_LIMITS, TextLimiter} from "../Utils/TextLimiter"

/**
 * Tool for creating diagrams from conversation content
 * Specifically handles diagram creation requests from users
 *
 * NOTE: If this tool ever needs to call languageInterface.generateResponse(),
 * it should use textOnly: true to prevent voice output during diagram creation,
 * since users want to see visual results without competing audio narration.
 */
export class DiagramCreatorTool {
  public readonly name = "diagram_creator"
  public readonly description = "Creates visual diagrams from conversation content and learning points"

  public readonly parameters = {
    type: "object",
    properties: {
      query: {type: "string", description: "The user query requesting diagram creation"},
      context: {type: "array", description: "Array of previous conversation messages for context"},
      summaryContext: {type: "object", description: "Summary of lecture content for educational context"},
      topicCount: {type: "number", description: "Number of topics to include in diagram", default: 5},
      diagramType: {type: "string", enum: ["mind_map", "concept_map", "hierarchy"], default: "mind_map"},
      maxLength: {
        type: "number",
        description: "Maximum character length for the response",
        default: CHARACTER_LIMITS.BOT_CARD_TEXT
      }
    },
    required: ["query"]
  }

  private languageInterface: AgentLanguageInterface
  private diagramStorage: DiagramStorage | null = null
  private summaryStorage: SummaryStorage | null = null
  private chatStorage: ChatStorage | null = null

  constructor(languageInterface: AgentLanguageInterface, diagramStorage?: DiagramStorage) {
    this.languageInterface = languageInterface
    this.diagramStorage = diagramStorage || null
    print("DiagramCreatorTool: Diagram creation tool initialized")
  }

  /**
   * Set the diagram storage component for saving diagrams
   */
  public setDiagramStorage(diagramStorage: DiagramStorage): void {
    this.diagramStorage = diagramStorage
    print("DiagramCreatorTool: Connected to DiagramStorage")
  }

  /**
   * Set the summary storage component for retrieving summary content
   */
  public setSummaryStorage(summaryStorage: SummaryStorage): void {
    this.summaryStorage = summaryStorage
    print("DiagramCreatorTool: Connected to SummaryStorage")
  }

  /**
   * Set the chat storage component for retrieving conversation history
   */
  public setChatStorage(chatStorage: ChatStorage): void {
    this.chatStorage = chatStorage
    print("DiagramCreatorTool: Connected to ChatStorage")
  }

  public async execute(args: Record<string, unknown>): Promise<{success: boolean; result?: any; error?: string}> {
    const {
      query,
      context,
      summaryContext,
      topicCount = 5,
      diagramType = "mind_map",
      maxLength = CHARACTER_LIMITS.BOT_CARD_TEXT
    } = args

    if (!query || typeof query !== "string") {
      return {success: false, error: "Query parameter is required and must be a string"}
    }

    try {
      print(`DiagramCreatorTool: Processing diagram creation request: "${(query as string).substring(0, 50)}..."`)

      // Extract topics from all available sources
      const topics = await this.extractTopicsFromAllSources(query as string)

      if (topics.length === 0) {
        return {
          success: false,
          error: "No topics found to create diagram from"
        }
      }

      // Determine optimal node count based on content
      const optimalNodeCount = this.calculateOptimalNodeCount(topics.length)

      // Generate diagram nodes
      const diagramNodes = await this.generateDiagramNodes(topics, diagramType as string, optimalNodeCount)

      // Store the diagram in DiagramStorage if available
      if (this.diagramStorage) {
        await this.storeDiagramInStorage(diagramNodes, diagramType as string, query as string)
      } else {
        print("DiagramCreatorTool: No DiagramStorage available - diagram will not be persistently displayed")
      }

      // Generate user response
      const userResponse = this.generateUserResponse(diagramNodes, query as string, maxLength as number)

      print(`DiagramCreatorTool: Generated diagram with ${diagramNodes.length} nodes`)

      return {
        success: true,
        result: {
          message: userResponse,
          diagramNodes: diagramNodes,
          diagramType: diagramType,
          nodeCount: diagramNodes.length,
          shouldCreateDiagram: true, // Flag to trigger diagram creation
          relatedTopics: topics.slice(0, 3),
          suggestedFollowUp: [
            "Would you like me to add more details to any of these nodes?",
            "Should I create connections between these concepts?",
            "Would you like to explore any specific topic in more detail?"
          ]
        }
      }
    } catch (error) {
      print(`DiagramCreatorTool: ERROR - Diagram creation failed: ${error}`)
      return {
        success: false,
        error: `Diagram creation failed: ${error}`
      }
    }
  }

  /**
   * Extract topics from all available sources (summary storage, chat storage, and query)
   */
  private async extractTopicsFromAllSources(
    query: string
  ): Promise<{title: string; content: string; isFromSummary: boolean}[]> {
    const allTopics: {title: string; content: string; isFromSummary: boolean}[] = []

    // 1. Extract from Summary Storage
    if (this.summaryStorage) {
      try {
        // Get current summary text
        const currentText = this.summaryStorage.getCurrentText()
        const summaries = this.summaryStorage.getAllSummaries()

        print(`DiagramCreatorTool: 📋 Found ${summaries.length} summaries in storage`)

        // Process each summary document
        summaries.forEach((doc) => {
          if (doc.sections && Array.isArray(doc.sections)) {
            doc.sections.forEach((section) => {
              allTopics.push({
                title: section.title,
                content: section.content,
                isFromSummary: true
              })
            })
          }
        })

        // Also process the current text if it exists
        if (currentText && currentText.length > 0) {
          print(`DiagramCreatorTool: 📄 Processing current text (${currentText.length} chars)`)
        }
      } catch (error) {
        print(`DiagramCreatorTool: Error accessing summary storage: ${error}`)
      }
    }

    // 2. Extract from Chat Storage
    if (this.chatStorage) {
      try {
        const currentSession = this.chatStorage.getCurrentSession()

        if (currentSession && currentSession.messages) {
          print(`DiagramCreatorTool: Found ${currentSession.messages.length} messages in chat history`)

          // Extract key topics from bot responses
          currentSession.messages.forEach((msg) => {
            if (msg.type === "bot" && msg.content) {
              const topics = this.extractTopicsFromMessage(msg.content)
              topics.forEach((topic) => {
                allTopics.push({
                  title: topic,
                  content: this.generateContentForTopic(topic, msg.content),
                  isFromSummary: false
                })
              })
            }
          })
        }
      } catch (error) {
        print(`DiagramCreatorTool: Error accessing chat storage: ${error}`)
      }
    }

    // 3. If no topics found, use AI to generate relevant topics
    if (allTopics.length === 0) {
      print("DiagramCreatorTool: No topics found in storage, generating from query")
      const generatedTopics = await this.generateTopicsFromQuery(query)
      allTopics.push(...generatedTopics)
    }

    // Remove duplicates based on title
    const uniqueTopics = this.deduplicateTopics(allTopics)

    print(`DiagramCreatorTool: Extracted ${uniqueTopics.length} unique topics`)
    return uniqueTopics
  }

  /**
   * Extract topics from a single message
   */
  private extractTopicsFromMessage(content: string): string[] {
    const topics: string[] = []

    // Extract meaningful sentences that could be topic titles
    const sentences = content.split(/[.!?]+/)
    sentences.forEach((sentence) => {
      const trimmed = sentence.trim()
      // Look for substantial sentences that could be topics
      if (trimmed.length > 20 && trimmed.length < 100) {
        // Skip conversational sentences
        if (
          !trimmed.toLowerCase().includes("i ") &&
          !trimmed.toLowerCase().includes("you ") &&
          !trimmed.toLowerCase().includes("let's") &&
          !trimmed.toLowerCase().includes("we'll")
        ) {
          topics.push(trimmed)
        }
      }
    })

    return topics
  }

  /**
   * Generate content description for a topic based on context
   */
  private generateContentForTopic(topic: string, context: string): string {
    const sentences = context.split(/[.!?]+/)
    let relevantContent = ""

    sentences.forEach((sentence) => {
      if (sentence.toLowerCase().includes(topic.toLowerCase())) {
        relevantContent += sentence.trim() + ". "
      }
    })

    if (relevantContent.length === 0) {
      relevantContent = `Key concept related to ${topic} from our conversation.`
    }

    return relevantContent.trim()
  }

  /**
   * Generate topics from query using AI
   */
  private async generateTopicsFromQuery(
    query: string
  ): Promise<{title: string; content: string; isFromSummary: boolean}[]> {
    try {
      const prompt = `Based on this query about creating a diagram: "${query}", generate 5-8 relevant educational topics that should be included in the diagram. Format each topic as a clear, concise title.`

      // Add system message for context
      const messages: Message[] = [
        {
          role: "system",
          content:
            "You are an educational assistant helping to create meaningful diagrams. Generate clear, relevant topic titles."
        },
        {
          role: "user",
          content: prompt
        }
      ]

      const response = await this.languageInterface.generateResponse(messages, {
        temperature: 0.7,
        maxTokens: 200,
        textOnly: true
      })

      const topics = response.content
        .split("\n")
        .filter((line) => line.trim().length > 0)
        .map((line) => line.replace(/^\d+\.\s*/, "").trim())
        .filter((title) => title.length > 3)
        .map((title) => ({
          title: title,
          content: `Educational concept: ${title}`,
          isFromSummary: false
        }))

      return topics
    } catch (error) {
      print(`DiagramCreatorTool: Error generating topics from query: ${error}`)
      return []
    }
  }

  /**
   * Deduplicate topics based on similar titles
   */
  private deduplicateTopics(
    topics: {title: string; content: string; isFromSummary: boolean}[]
  ): {title: string; content: string; isFromSummary: boolean}[] {
    const seen = new Map<string, {title: string; content: string; isFromSummary: boolean}>()

    topics.forEach((topic) => {
      const key = topic.title.toLowerCase().replace(/[^a-z0-9]/g, "")
      if (!seen.has(key) || (topic.isFromSummary && !seen.get(key)!.isFromSummary)) {
        // Prefer topics from summary
        seen.set(key, topic)
      }
    })

    return Array.from(seen.values())
  }

  /**
   * Calculate optimal node count based on available content
   */
  private calculateOptimalNodeCount(availableTopics: number): number {
    // Minimum 3 nodes for a meaningful diagram
    // Maximum 30 nodes to keep it legible
    // Sweet spot is 8-15 nodes for most diagrams

    if (availableTopics <= 5) {
      return Math.max(3, availableTopics)
    } else if (availableTopics <= 10) {
      return availableTopics
    } else if (availableTopics <= 20) {
      return Math.floor(availableTopics * 0.8) // Use 80% of topics
    } else {
      return Math.min(20, Math.floor(availableTopics * 0.6)) // Use 60% up to 20 nodes
    }
  }

  /**
   * Generate diagram nodes from topics with hierarchical structure
   */
  private async generateDiagramNodes(
    topics: {title: string; content: string; isFromSummary: boolean}[],
    diagramType: string,
    maxCount: number
  ): Promise<DiagramNode[]> {
    const nodes: DiagramNode[] = []

    // Use AI to create a hierarchical structure from topics
    const hierarchicalStructure = await this.generateHierarchicalStructure(topics, maxCount)

    // Create nodes based on the hierarchical structure
    let nodeIndex = 0

    // Create central node
    if (hierarchicalStructure.centralNode) {
      const centralNode: DiagramNode = {
        id: `central_${Date.now()}`,
        type: "text",
        content: hierarchicalStructure.centralNode.title,
        position: new vec3(0, 0, 0),
        level: 0,
        parentId: undefined
      }
      nodes.push(centralNode)
      nodeIndex++

      // Create level 1 nodes (main branches) - max 4
      const mainBranches = hierarchicalStructure.mainBranches.slice(0, 4)
      for (let i = 0; i < mainBranches.length; i++) {
        const branch = mainBranches[i]
        if (nodeIndex >= maxCount) break

        const branchNode: DiagramNode = {
          id: `branch_${nodeIndex}_${Date.now()}`,
          type: this.selectNodeType(nodeIndex, branch.isFromSummary),
          content: branch.title,
          position: this.calculateNodePosition(i, mainBranches.length, 1),
          level: 1,
          parentId: centralNode.id
        }

        // Add generated content for visual nodes
        if (branchNode.type === "image" || branchNode.type === "model") {
          branchNode.generatedContent = {
            type: branchNode.type,
            prompt: `Create a ${branchNode.type} for ${branch.title}: ${branch.content.substring(0, 100)}`,
            assetReference: "",
            generatedAt: Date.now()
          }
        }

        nodes.push(branchNode)
        nodeIndex++

        // Create level 2 nodes (sub-branches) - max 4 per parent
        if (branch.subTopics && branch.subTopics.length > 0) {
          const subTopics = branch.subTopics.slice(0, 4) // Max 4 children
          for (let j = 0; j < subTopics.length; j++) {
            const subTopic = subTopics[j]
            if (nodeIndex >= maxCount) break

            const subNode: DiagramNode = {
              id: `sub_${nodeIndex}_${Date.now()}`,
              type: this.selectNodeType(nodeIndex, false),
              content: subTopic.title,
              position: this.calculateNodePosition(j, subTopics.length, 2),
              level: 2,
              parentId: branchNode.id
            }

            if (subNode.type === "image" || subNode.type === "model") {
              subNode.generatedContent = {
                type: subNode.type,
                prompt: `Create a ${subNode.type} for ${subTopic.title}`,
                assetReference: "",
                generatedAt: Date.now()
              }
            }

            nodes.push(subNode)
            nodeIndex++
          }
        }
      }
    }

    print(`DiagramCreatorTool: Generated ${nodes.length} hierarchical diagram nodes`)
    return nodes
  }

  /**
   * Generate hierarchical structure using AI
   */
  private async generateHierarchicalStructure(
    topics: {title: string; content: string; isFromSummary: boolean}[],
    maxNodes: number
  ): Promise<any> {
    try {
      // Create a prompt for AI to organize topics hierarchically
      const topicList = topics.map((t) => `- ${t.title}: ${t.content.substring(0, 50)}...`).join("\n")

      const prompt = `Organize these topics into a clean hierarchical tree structure:
${topicList}

IMPORTANT RULES:
1. Maximum 4 main branches from the central node
2. Each branch can have maximum 4 sub-topics
3. Keep the structure balanced and clean
4. Total nodes should not exceed ${maxNodes}

Create a JSON structure:
{
  "centralNode": {"title": "Main Theme"},
  "mainBranches": [
    {
      "title": "Branch 1",
      "content": "Description",
      "isFromSummary": true,
      "subTopics": [
        {"title": "Sub 1", "content": "Detail"}
      ]
    }
  ]
}`

      const messages: Message[] = [
        {
          role: "system",
          content: "You are an expert at organizing educational content into clear hierarchical structures."
        },
        {
          role: "user",
          content: prompt
        }
      ]

      const response = await this.languageInterface.generateResponse(messages, {
        temperature: 0.7,
        maxTokens: 500,
        textOnly: true
      })

      // Parse the AI response
      try {
        const jsonMatch = response.content.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0])
        }
      } catch (parseError) {
        print(`DiagramCreatorTool: Failed to parse AI structure, using fallback`)
      }

      // Fallback structure
      return this.createFallbackStructure(topics, maxNodes)
    } catch (error) {
      print(`DiagramCreatorTool: Error generating hierarchical structure: ${error}`)
      return this.createFallbackStructure(topics, maxNodes)
    }
  }

  /**
   * Create fallback hierarchical structure
   */
  private createFallbackStructure(
    topics: {title: string; content: string; isFromSummary: boolean}[],
    maxNodes: number
  ): any {
    const summaryTopics = topics.filter((t) => t.isFromSummary)
    const chatTopics = topics.filter((t) => !t.isFromSummary)

    // Find the most comprehensive topic for central node
    let centralTopic = summaryTopics[0] || topics[0] || {title: "Knowledge Map", content: ""}

    // If we have topics, try to find the best central theme
    if (topics.length > 0) {
      // Look for topics that might be good central nodes (containing overview keywords)
      const overviewKeywords = ["overview", "introduction", "fundamentals", "concepts", "summary"]
      const potentialCentralTopics = topics.filter((t) =>
        overviewKeywords.some((keyword) => t.title.toLowerCase().includes(keyword))
      )

      if (potentialCentralTopics.length > 0) {
        centralTopic = potentialCentralTopics[0]
      }
    }

    // Filter out the central topic from remaining topics
    const availableTopics = topics.filter((t) => t.title !== centralTopic.title)

    // Prioritize summary topics for main branches
    const prioritizedTopics = [...summaryTopics.filter((t) => t.title !== centralTopic.title), ...chatTopics]

    // Take up to 4 main branches for clean layout
    const mainTopics = prioritizedTopics.slice(0, 4)

    // Distribute remaining topics as children (max 4 per parent)
    const remainingTopics = prioritizedTopics.slice(4)

    const mainBranches = mainTopics.map((topic, index) => {
      // Calculate how many children this branch should have
      const baseChildCount = Math.floor(remainingTopics.length / mainTopics.length)
      const extraChild = index < remainingTopics.length % mainTopics.length ? 1 : 0
      const childCount = Math.min(4, baseChildCount + extraChild)

      const subTopics = remainingTopics.splice(0, childCount).map((t) => ({
        title: t.title,
        content: t.content
      }))

      return {
        title: topic.title,
        content: topic.content,
        isFromSummary: topic.isFromSummary,
        subTopics: subTopics
      }
    })

    return {
      centralNode: {
        title: centralTopic.title,
        content: centralTopic.content
      },
      mainBranches: mainBranches
    }
  }

  /**
   * Select node type based on index and source
   */
  private selectNodeType(index: number, isFromSummary: boolean): "text" | "image" | "model" {
    if (index === 0) return "text" // Central node

    if (isFromSummary) {
      // Important summary nodes get visual representation
      return index % 2 === 0 ? "image" : "model"
    } else {
      // Chat nodes: mostly text with some visual
      const types: ("text" | "image" | "model")[] = ["text", "text", "image", "model"]
      return types[index % types.length]
    }
  }

  /**
   * Calculate position for diagram nodes
   */
  private calculateNodePosition(index: number, totalCount: number, level: number = 1): vec3 {
    if (level === 0) {
      // Central node at origin
      return new vec3(0, 0, 0)
    }

    // Distance from center based on level - match DiagramComponent's spacing
    const baseRadius = 200 // Base radius matching DiagramComponent
    const levelSeparation = 200 // Match DiagramComponent's levelSeparation
    const radius = baseRadius + level * levelSeparation

    // Calculate angle for this node with proper spread
    const angularSpread = 90 * (Math.PI / 180) // 90 degrees in radians
    const angleStep = angularSpread / Math.max(1, totalCount - 1)
    const startAngle = -angularSpread / 2
    const angle = startAngle + index * angleStep

    // Position in 3D space with slight Y variation for organic look
    const x = radius * Math.cos(angle)
    const z = radius * Math.sin(angle)
    const y = (level - 1) * 50 + (Math.random() - 0.5) * 30 // Y offset with variation

    return new vec3(x, y, z)
  }

  /**
   * Store the generated diagram in DiagramStorage
   */
  private async storeDiagramInStorage(nodes: DiagramNode[], diagramType: string, query: string): Promise<void> {
    if (!this.diagramStorage) return

    try {
      // Use the central node's content as the diagram title
      const centralNode = nodes.find((n) => n.level === 0)
      const diagramTitle = centralNode ? centralNode.content : this.generateDiagramTitle(query, diagramType)

      // Create new diagram in storage with enhanced document format
      this.diagramStorage.createNewDiagram(diagramTitle)

      // Build a hierarchical structure document
      let enhancedDocument = `DiagramTitle: ${diagramTitle}\n`
      enhancedDocument += `Nodes: ${nodes.length}\n\n`

      // Add central node first
      if (centralNode) {
        enhancedDocument += `CentralNode: ${centralNode.content}\n\n`
      }

      // Group nodes by level for hierarchy
      const nodesByLevel = new Map<number, DiagramNode[]>()
      for (const node of nodes) {
        if (!nodesByLevel.has(node.level)) {
          nodesByLevel.set(node.level, [])
        }
        nodesByLevel.get(node.level)!.push(node)
      }

      // Add nodes with connection information
      let nodeIndex = 1
      for (const node of nodes) {
        const title = node.content // This is already the meaningful title
        const content = this.generateNodeContent(node, diagramType)

        // Determine if we need a prompt for image/model nodes
        let prompt = undefined
        if (node.type === "image" || node.type === "model") {
          prompt = node.generatedContent?.prompt || `Create a ${node.type} representation of ${node.content}`
        }

        // Add connection info in the document
        if (node.level === 0) {
          enhancedDocument += `Node ${nodeIndex}: ${node.type} [CENTRAL]\n`
        } else {
          enhancedDocument += `Node ${nodeIndex}: ${node.type} [Level ${node.level}]\n`
        }
        enhancedDocument += `Text title: ${title}\n`
        enhancedDocument += `Text content: ${content}\n`
        if (prompt) {
          enhancedDocument += `${node.type === "image" ? "Image" : "Model"} prompt: ${prompt}\n`
        }
        if (node.level > 0) {
          enhancedDocument += `Parent: CentralNode\n`
        }
        enhancedDocument += `\n`

        // Add node to storage
        this.diagramStorage.addNode(node.type, title, content, prompt)
        nodeIndex++
      }

      // Save the diagram
      this.diagramStorage.saveDiagram()

      print(
        `DiagramCreatorTool: 💾 Stored diagram "${diagramTitle}" with ${nodes.length} nodes and hierarchy info in DiagramStorage`
      )
    } catch (error) {
      print(`DiagramCreatorTool: Failed to store diagram in storage: ${error}`)
    }
  }

  /**
   * Generate a title for the diagram based on the query
   */
  private generateDiagramTitle(query: string, diagramType: string): string {
    // Extract key concepts from query
    const lowerQuery = query.toLowerCase()

    if (lowerQuery.includes("machine learning") || lowerQuery.includes("ml")) {
      return "Machine Learning Concepts"
    } else if (lowerQuery.includes("neural network") || lowerQuery.includes("deep learning")) {
      return "Neural Network Architecture"
    } else if (lowerQuery.includes("algorithm") || lowerQuery.includes("data")) {
      return "Data Algorithm Overview"
    } else if (lowerQuery.includes("diagram") || lowerQuery.includes("visualize")) {
      return "Concept Visualization"
    } else {
      return `${diagramType.charAt(0).toUpperCase() + diagramType.slice(1)} Diagram`
    }
  }

  /**
   * Generate content for a diagram node
   */
  private generateNodeContent(node: DiagramNode, diagramType: string): string {
    const content = node.content

    // Add educational context based on node type
    switch (node.type) {
      case "text":
        return `${content}: A fundamental concept in this domain that provides the foundation for understanding related topics.`
      case "image":
        return `${content}: Visual representation that helps illustrate the concept through diagrams, charts, or imagery.`
      case "model":
        return `${content}: Interactive 3D model that allows exploration of the concept from different perspectives.`
      default:
        return `${content}: Key concept in the learning material.`
    }
  }

  /**
   * Generate user response for diagram creation
   */
  private generateUserResponse(nodes: DiagramNode[], query: string, maxLength: number): string {
    const nodeCount = nodes.length
    const nodeTypes = [...new Set(nodes.map((n) => n.type))]

    let response = `I've created a diagram with ${nodeCount} nodes showing the key concepts:\n\n`

    // List the main topics
    const topics = nodes
      .slice(0, 5)
      .map((node, index) => `${index + 1}. ${node.content}`)
      .join("\n")
    response += topics

    // Add information about node types
    if (nodeTypes.length > 1) {
      response += `\n\nThe diagram includes ${nodeTypes.join(", ")} nodes for a rich visual experience.`
    }

    response += "\n\nYou can interact with the nodes to explore each concept in more detail!"

    // Apply character limit
    return TextLimiter.truncateAtWordBoundary(response, maxLength)
  }
}
