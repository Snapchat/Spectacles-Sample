import {clearTimeout, setTimeout} from "SpectaclesInteractionKit.lspkg/Utils/FunctionTimingUtils"
import {CHARACTER_LIMITS, TextLimiter} from "../Utils/TextLimiter"

import {AgentLanguageInterface} from "../Agents/AgentLanguageInterface"
import {Message} from "../Agents/AgentTypes"

/**
 * Spatial Tool - uses camera and Gemini for spatial awareness
 * According to diagram specification - answers questions about the live lecture using surrounding environment
 * Capable of seeing the surrounding with camera and providing contextual responses
 */
export class SpatialTool {
  public readonly name = "spatial_tool"
  public readonly description =
    "Answers questions about the live lecture environment using camera input and spatial awareness"

  public readonly parameters = {
    type: "object",
    properties: {
      query: {type: "string", description: "The user query about the current lecture environment"},
      context: {type: "array", description: "Array of previous conversation messages for context"},
      maxLength: {
        type: "number",
        description: "Maximum character length for the response",
        default: CHARACTER_LIMITS.BOT_CARD_TEXT
      },
      enableImageInput: {type: "boolean", description: "Whether to capture and analyze camera input", default: true},
      spatialContext: {type: "string", description: "Additional spatial context about the environment"}
    },
    required: ["query"]
  }

  private languageInterface: AgentLanguageInterface
  private isCapturingImage: boolean = false

  constructor(languageInterface: AgentLanguageInterface) {
    this.languageInterface = languageInterface
    print("SpatialTool: Spatial awareness tool initialized with camera/Gemini support")
  }

  public async execute(args: Record<string, unknown>): Promise<{success: boolean; result?: any; error?: string}> {
    const {query, context, maxLength = CHARACTER_LIMITS.BOT_CARD_TEXT, enableImageInput = true, spatialContext} = args

    if (!query || typeof query !== "string") {
      return {success: false, error: "Query parameter is required and must be a string"}
    }

    try {
      print(`SpatialTool: Processing spatial query: "${(query as string).substring(0, 50)}..."`)

      // Build spatial awareness system prompt
      const systemPrompt = this.buildSpatialSystemPrompt(spatialContext as string, enableImageInput as boolean)

      // Prepare conversation context
      const conversationHistory = this.prepareConversationHistory(context, query as string)

      // Capture and analyze current environment if enabled
      let imageContext = ""
      if (enableImageInput) {
        imageContext = await this.captureAndAnalyzeEnvironment()
      }

      // Generate AI response with spatial context
      const aiResponse = await this.generateSpatialResponse(
        systemPrompt,
        conversationHistory,
        imageContext,
        maxLength as number
      )

      // Build final response
      const response = {
        message: aiResponse,
        relatedTopics: this.extractSpatialTopics(query as string),
        suggestedFollowUp: this.generateSpatialFollowUps(query as string),
        educationalLevel: "intermediate",
        processingTime: Date.now(),
        toolUsed: "spatial_tool",
        spatiallyAware: true,
        usedCamera: enableImageInput as boolean
      }

      print(`SpatialTool: Generated spatially-aware response`)

      return {
        success: true,
        result: response
      }
    } catch (error) {
      print(`SpatialTool: ERROR - Spatial processing failed: ${error}`)
      return {
        success: false,
        error: `Spatial tool failed: ${error}`
      }
    }
  }

  /**
   * Build system prompt for spatial awareness
   */
  private buildSpatialSystemPrompt(spatialContext: string, enableImageInput: boolean): string {
    let prompt =
      "You are answering specific questions regarding a lecture that is going on now and the student sees the surrounding environment.\n\n"

    prompt += "SPATIAL CONTEXT:\n"
    if (spatialContext) {
      prompt += `Environment details: ${spatialContext}\n`
    }

    if (enableImageInput) {
      prompt += "IMPORTANT: You have real-time camera input enabled and can see the current environment.\n"
      prompt += "You should analyze what you see in front of you and describe the visual environment.\n"
      prompt += "Use your visual perception to answer questions about what is currently visible.\n"
      prompt += "When asked 'what do you see', describe exactly what is in your current field of view.\n"
    }

    prompt += "\nINSTRUCTIONS:\n"
    prompt += "- Answer questions based on the current lecture environment and visual context\n"
    prompt += "- Reference what you can see or understand about the current setting\n"
    prompt += "- Help the student understand concepts in relation to their current learning environment\n"
    prompt += "- If visual input is available, use it to provide specific, contextual responses\n"
    prompt += "- Focus on real-time educational assistance during live lectures\n"
    prompt += "- Connect visual observations to educational concepts when relevant\n"
    prompt += "- Maintain awareness of the spatial/physical learning context\n"

    return prompt
  }

  /**
   * Capture and analyze the current environment using camera
   * This captures an actual camera frame and prepares it for visual analysis
   */
  private async captureAndAnalyzeEnvironment(): Promise<string> {
    if (this.isCapturingImage) {
      print("SpatialTool: Already capturing image, using cached context")
      return "Visual analysis in progress from previous request"
    }

    this.isCapturingImage = true

    try {
      print("SpatialTool: Capturing actual camera frame for visual analysis")

      // Import camera and video controller classes with compression settings
      const {VideoController} = require("RemoteServiceGateway.lspkg/Helpers/VideoController")

      // Create a temporary video controller for frame capture
      // Using numeric values as these enums should be available in the global scope
      const videoController = new VideoController(
        1500, // frame interval
        1, // CompressionQuality.HighQuality
        0 // EncodingType.Jpg
      )

      let capturedFrame: string | null = null

      // Set up frame capture listener
      const framePromise = new Promise<string>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Camera frame capture timeout"))
        }, 3000)

        videoController.onEncodedFrame.add((encodedFrame: string) => {
          clearTimeout(timeout)
          capturedFrame = encodedFrame
          resolve(encodedFrame)
        })
      })

      // Start recording to capture a frame
      videoController.startRecording()
      print("SpatialTool: Started camera recording for frame capture")

      // Wait for frame capture
      await framePromise

      // Stop recording
      videoController.stopRecording()
      print("SpatialTool: Stopped camera recording")

      if (capturedFrame) {
        print("SpatialTool: Successfully captured camera frame for visual analysis")
        return capturedFrame // Return the base64 encoded image
      } else {
        throw new Error("No frame captured")
      }
    } catch (error) {
      print(`SpatialTool: Camera capture failed: ${error}`)
      return "Unable to capture camera frame - proceeding with text-based analysis"
    } finally {
      this.isCapturingImage = false
    }
  }

  /**
   * Prepare conversation history for context
   */
  private prepareConversationHistory(context: any, currentQuery: string): Message[] {
    const messages: Message[] = []

    // Add recent context if available
    if (context && Array.isArray(context)) {
      const recentMessages = context.slice(-8) // Last 8 messages for spatial context

      for (const message of recentMessages) {
        if (message.role && message.content) {
          messages.push({
            role: message.role as "user" | "assistant" | "system",
            content: message.content
          })
        }
      }
    }

    // Add current query
    messages.push({
      role: "user" as const,
      content: currentQuery
    })

    return messages
  }

  /**
   * Generate AI response with spatial context using AgentLanguageInterface Live API
   * This uses the Live API for spatial analysis with audio output support
   */
  private async generateSpatialResponse(
    systemPrompt: string,
    messages: Message[],
    imageContext: string,
    maxLength: number
  ): Promise<string> {
    try {
      print("SpatialTool: Using AgentLanguageInterface Live API for spatial analysis with audio output")

      // Build system message with spatial context and camera information
      const userMessage = messages[messages.length - 1]
      const spatialSystemMessage: Message = {
        role: "system",
        content: `${systemPrompt}\n\nIMPORTANT: You have access to real-time camera input and should provide audio responses. Analyze what you can see in the current environment and respond with both text and audio. Be specific about what you can actually observe.`
      }

      // Build enhanced user message that includes camera context and actual image data
      let enhancedUserContent = userMessage.content
      const enhancedUserMessage: Message = {
        role: "user",
        content: enhancedUserContent
      }

      if (imageContext && imageContext.length > 100 && !imageContext.includes("Unable to capture")) {
        print("SpatialTool: Camera frame captured - sending visual input to AI")
        enhancedUserContent +=
          "\n\n[Visual Analysis Required: I am currently looking at my environment. Please analyze the image I'm sending and describe what you can see.]"

        // Add the actual image data for multimodal AI processing
        // The imageContext contains base64 encoded image data
        enhancedUserMessage.content = enhancedUserContent
        enhancedUserMessage.imageData = imageContext // Include actual image for AI processing
      } else {
        print("SpatialTool: No camera frame available - using text-only mode")
        enhancedUserContent +=
          "\n\n[Note: Camera input is not available. Please respond based on the context of the question.]"
        enhancedUserMessage.content = enhancedUserContent
      }

      // Prepare messages for AI processing (Live API supports audio output)
      const aiMessages = [spatialSystemMessage, enhancedUserMessage]

      print(`SpatialTool: Sending spatial query to AgentLanguageInterface Live API`)

      // Use AgentLanguageInterface which supports both audio and video through Live API
      // textOnly: false enables voice output for spatial responses
      print("SpatialTool: Requesting response with voice output enabled (textOnly: false)")
      const response = await this.languageInterface.generateResponse(aiMessages, {
        maxTokens: maxLength,
        temperature: 0.8,
        textOnly: false // Enable audio output
      })

      if (!response?.content) {
        throw new Error("No valid response received from AgentLanguageInterface")
      }

      print(`SpatialTool: Received spatial analysis with audio: "${response.content.substring(0, 100)}..."`)

      // Apply character limits
      return TextLimiter.limitText(response.content, maxLength)
    } catch (error) {
      print(`SpatialTool: AgentLanguageInterface Live API failed: ${error}`)

      // Fallback response for spatial queries
      return "I'm having trouble analyzing the visual environment right now. Please make sure camera access is enabled and try asking about what you see again."
    }
  }

  /**
   * Extract spatial-related topics from query
   */
  private extractSpatialTopics(query: string): string[] {
    const topics: string[] = []
    const lowerQuery = query.toLowerCase()

    // Detect spatial/visual terms
    if (lowerQuery.includes("see") || lowerQuery.includes("look") || lowerQuery.includes("visual")) {
      topics.push("visual analysis")
    }

    if (lowerQuery.includes("environment") || lowerQuery.includes("room") || lowerQuery.includes("space")) {
      topics.push("spatial context")
    }

    if (lowerQuery.includes("lecture") || lowerQuery.includes("class") || lowerQuery.includes("presentation")) {
      topics.push("live lecture")
    }

    if (lowerQuery.includes("current") || lowerQuery.includes("now") || lowerQuery.includes("happening")) {
      topics.push("real-time context")
    }

    // Default topics if none detected
    if (topics.length === 0) {
      topics.push("spatial awareness", "live environment", "lecture context")
    }

    return topics.slice(0, 3)
  }

  /**
   * Generate spatial-aware follow-up questions
   */
  private generateSpatialFollowUps(query: string): string[] {
    const followUps: string[] = []

    // General spatial follow-ups
    followUps.push("What else can you see in the current environment?")
    followUps.push("How does this relate to what's happening in the lecture?")
    followUps.push("Can you explain more about the current learning context?")

    // Query-specific follow-ups
    const lowerQuery = query.toLowerCase()
    if (lowerQuery.includes("see") || lowerQuery.includes("visual")) {
      followUps.push("Would you like me to analyze specific visual elements?")
    }

    if (lowerQuery.includes("understand") || lowerQuery.includes("explain")) {
      followUps.push("Should I provide more context about the surrounding materials?")
    }

    return followUps.slice(0, 3)
  }
}
