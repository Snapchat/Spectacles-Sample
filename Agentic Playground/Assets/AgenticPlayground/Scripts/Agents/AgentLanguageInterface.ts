import {clearTimeout, setTimeout} from "SpectaclesInteractionKit.lspkg/Utils/FunctionTimingUtils"
import {LLMOptions, LLMResponse, Message} from "./AgentTypes"

import Event from "SpectaclesInteractionKit.lspkg/Utils/Event"
import {GeminiAssistant} from "../Core/GeminiAssistant"
import {OpenAIAssistant} from "../Core/OpenAIAssistant"

/**
 * Interface to AI language models
 * Abstracts OpenAI/Gemini integration from AIPlayground
 * Wraps existing OpenAIAssistant.ts (7.8KB, 261 lines) and GeminiAssistant.ts (9.8KB, 337 lines)
 */
export class AgentLanguageInterface {
  private openAIAssistant: OpenAIAssistant | null = null
  private geminiAssistant: GeminiAssistant | null = null
  private currentProvider: "openai" | "gemini" = "openai"
  private isInitialized: boolean = false
  private providerInitialized: {[key: string]: boolean} = {openai: false, gemini: false}
  private isCollectingToolResponse: boolean = false // Flag to prevent interference during tool text collection

  // Events for unified communication
  public onTextUpdate: Event<{text: string; completed: boolean; provider: string}> = new Event()
  public onFunctionCall: Event<{name: string; args: any; callId?: string; provider: string}> = new Event()
  public onError: Event<{error: string; provider: string}> = new Event()
  public onConnectionStatus: Event<{connected: boolean; provider: string}> = new Event()

  constructor(openAIAssistant?: OpenAIAssistant, geminiAssistant?: GeminiAssistant) {
    this.openAIAssistant = openAIAssistant || null
    this.geminiAssistant = geminiAssistant || null
    this.setupEventHandlers()

    // FIX: Actually initialize the AI sessions
    this.initializeSession()

    print("AgentLanguageInterface: Language interface initialized")
  }

  // ================================
  // Initialization & Setup
  // ================================

  private setupEventHandlers(): void {
    try {
      // FIX: Setup event handlers for ALL providers to capture transcription events
      // We need handlers for both because we might use different providers for different features
      print(`AgentLanguageInterface: Setting up events for all available providers`)

      // Setup OpenAI event handlers
      if (this.openAIAssistant) {
        // Check if events exist before trying to add handlers
        if (this.openAIAssistant.updateTextEvent && this.openAIAssistant.updateTextEvent.add) {
          this.openAIAssistant.updateTextEvent.add((data) => {
            this.handleTextUpdate(data, "openai")
          })
          print("AgentLanguageInterface: OpenAI updateTextEvent connected")
        } else {
          print("AgentLanguageInterface: OpenAI updateTextEvent not available yet")
        }

        if (this.openAIAssistant.functionCallEvent && this.openAIAssistant.functionCallEvent.add) {
          this.openAIAssistant.functionCallEvent.add((data) => {
            this.handleFunctionCall(data, "openai")
          })
          print("AgentLanguageInterface: OpenAI functionCallEvent connected")
        } else {
          print("AgentLanguageInterface: OpenAI functionCallEvent not available yet")
        }
      }

      // Setup Gemini event handlers
      if (this.geminiAssistant) {
        if (this.geminiAssistant.updateTextEvent && this.geminiAssistant.updateTextEvent.add) {
          this.geminiAssistant.updateTextEvent.add((data) => {
            this.handleTextUpdate(data, "gemini")
          })
          print("AgentLanguageInterface: Gemini updateTextEvent connected")
        } else {
          print("AgentLanguageInterface: Gemini updateTextEvent not available yet")
        }

        if (this.geminiAssistant.functionCallEvent && this.geminiAssistant.functionCallEvent.add) {
          this.geminiAssistant.functionCallEvent.add((data) => {
            this.handleFunctionCall(data, "gemini")
          })
          print("AgentLanguageInterface: Gemini functionCallEvent connected")
        } else {
          print("AgentLanguageInterface: Gemini functionCallEvent not available yet")
        }
      }

      print(`AgentLanguageInterface: Event handlers configured for all available providers`)
    } catch (error) {
      print(`AgentLanguageInterface: Event handler setup failed: ${error}`)
    }
  }

  public setAssistants(openAIAssistant: OpenAIAssistant, geminiAssistant: GeminiAssistant): void {
    this.openAIAssistant = openAIAssistant
    this.geminiAssistant = geminiAssistant
    this.setupEventHandlers()
    print("AgentLanguageInterface: AI assistants updated and reconnected")
  }

  // ================================
  // Provider Management
  // ================================

  public switchProvider(provider: "openai" | "gemini"): void {
    if (provider === this.currentProvider) {
      print(`AgentLanguageInterface: Already using ${provider} provider`)
      return
    }

    // Validate provider availability
    if (provider === "openai" && !this.openAIAssistant) {
      print("AgentLanguageInterface: OpenAI Assistant not available")
      return
    }

    if (provider === "gemini" && !this.geminiAssistant) {
      print("AgentLanguageInterface: Gemini Assistant not available")
      return
    }

    this.currentProvider = provider
    print(`AgentLanguageInterface: Switched to ${provider} provider`)

    // Initialize session if needed
    this.initializeCurrentProvider()
  }

  public getCurrentProvider(): "openai" | "gemini" {
    return this.currentProvider
  }

  public setDefaultProvider(provider: "openai" | "gemini"): void {
    print(`AgentLanguageInterface: Setting default provider to: ${provider}`)
    this.currentProvider = provider
  }

  public getAvailableProviders(): string[] {
    const providers: string[] = []
    if (this.openAIAssistant) providers.push("openai")
    if (this.geminiAssistant) providers.push("gemini")
    return providers
  }

  // ================================
  // Session Management
  // ================================

  public initializeSession(): void {
    this.initializeCurrentProvider()
  }

  private initializeCurrentProvider(): void {
    if (this.providerInitialized[this.currentProvider]) {
      print(`AgentLanguageInterface: ${this.currentProvider} session already initialized`)
      return
    }

    print(`AgentLanguageInterface: 🔍 Debug - Current provider: ${this.currentProvider}`)
    print(`AgentLanguageInterface: 🔍 Debug - OpenAI assistant: ${this.openAIAssistant ? "available" : "null"}`)
    print(`AgentLanguageInterface: 🔍 Debug - Gemini assistant: ${this.geminiAssistant ? "available" : "null"}`)

    try {
      if (this.currentProvider.toLowerCase() === "openai" && this.openAIAssistant) {
        print("AgentLanguageInterface: Initializing OpenAI session...")

        // FIX: Actually call the session creation method
        if (typeof this.openAIAssistant.createOpenAIRealtimeSession === "function") {
          this.openAIAssistant.createOpenAIRealtimeSession()
          print("AgentLanguageInterface: OpenAI session created successfully")
        } else {
          throw new Error("OpenAI createOpenAIRealtimeSession method not available")
        }
      } else if (this.currentProvider.toLowerCase() === "gemini" && this.geminiAssistant) {
        print("AgentLanguageInterface: Initializing Gemini session...")

        // FIX: Actually call the session creation method
        if (typeof this.geminiAssistant.createGeminiLiveSession === "function") {
          this.geminiAssistant.createGeminiLiveSession()
          print("AgentLanguageInterface: Gemini session created successfully")
        } else {
          throw new Error("Gemini createGeminiLiveSession method not available")
        }
      } else {
        print(`AgentLanguageInterface: Debug - Provider check failed for "${this.currentProvider}" (case-insensitive)`)
        print(
          `AgentLanguageInterface: Debug - OpenAI check: ${this.currentProvider.toLowerCase() === "openai"} && ${!!this.openAIAssistant}`
        )
        print(
          `AgentLanguageInterface: Debug - Gemini check: ${this.currentProvider.toLowerCase() === "gemini"} && ${!!this.geminiAssistant}`
        )
        throw new Error(`No assistant available for provider: ${this.currentProvider}`)
      }

      this.providerInitialized[this.currentProvider] = true
      this.isInitialized = true
      this.onConnectionStatus.invoke({connected: true, provider: this.currentProvider})
      print(`AgentLanguageInterface: ${this.currentProvider} provider fully initialized`)
    } catch (error) {
      print(`AgentLanguageInterface: Failed to initialize session: ${error}`)
      this.onError.invoke({error: `Session initialization failed: ${error}`, provider: this.currentProvider})
      throw error // Re-throw to prevent tools from running without proper AI setup
    }
  }

  // ================================
  // Text Generation
  // ================================

  public async generateResponse(messages: Message[], options?: LLMOptions): Promise<LLMResponse> {
    // FIX: Smart provider selection with fallback
    let providerToUse = this.currentProvider
    const hasImageData = messages.some((m) => m.imageData && m.imageData.length > 100)

    // Force Gemini for image inputs if available
    if (hasImageData && providerToUse === "openai" && this.geminiAssistant) {
      print("AgentLanguageInterface: Image data detected - forcing Gemini for vision support")
      providerToUse = "gemini"
    }

    // Fallback if preferred provider isn't available
    if (providerToUse === "gemini" && !this.geminiAssistant && this.openAIAssistant) {
      print("AgentLanguageInterface: Gemini not available - falling back to OpenAI")
      providerToUse = "openai"
      if (hasImageData) {
        print("AgentLanguageInterface: Warning: Image data will be ignored with OpenAI fallback")
      }
    } else if (providerToUse === "openai" && !this.openAIAssistant && this.geminiAssistant) {
      print("AgentLanguageInterface: OpenAI not available - falling back to Gemini")
      providerToUse = "gemini"
    }

    if (!this.providerInitialized[providerToUse]) {
      const oldProvider = this.currentProvider
      this.currentProvider = providerToUse
      this.initializeCurrentProvider()
      if (!hasImageData) {
        this.currentProvider = oldProvider // Restore if just temporary switch
      }
    }

    try {
      print(
        `AgentLanguageInterface: Using provider: ${providerToUse} for response generation (voice: ${!options?.textOnly})`
      )

      if (providerToUse === "openai") {
        return await this.generateOpenAIResponse(messages, options)
      } else {
        return await this.generateGeminiResponse(messages, options)
      }
    } catch (error) {
      print(`AgentLanguageInterface: Response generation failed: ${error}`)
      this.onError.invoke({error: `Response generation failed: ${error}`, provider: this.currentProvider})

      // Fallback to a simple educational response
      return this.generateFallbackResponse(messages)
    }
  }

  /**
   * Generate text-only response without voice streaming
   * This sends messages directly to the AI session and waits for text response
   */
  public async generateTextResponse(messages: Message[], options?: LLMOptions): Promise<string> {
    // FIX: Ensure current provider session is properly initialized
    if (!this.providerInitialized[this.currentProvider]) {
      print(`AgentLanguageInterface: ${this.currentProvider} session not initialized, attempting to initialize...`)
      this.initializeCurrentProvider()

      // Wait for initialization to complete
      await this.waitForSessionReady(3000) // 3 second timeout for session setup
    }

    try {
      if (this.currentProvider.toLowerCase() === "openai") {
        return await this.generateOpenAITextResponse(messages, options)
      } else {
        const response = await this.generateGeminiTextResponse(messages, options)
        return response
      }
    } catch (error) {
      print(`AgentLanguageInterface: Text response generation failed: ${error}`)
      this.onError.invoke({error: `Text response generation failed: ${error}`, provider: this.currentProvider})

      // No fallbacks for text generation - this indicates a real problem
      throw error
    }
  }

  private generateFallbackResponse(messages: Message[]): LLMResponse {
    // Extract the last user message for a contextual response
    const lastUserMessage = messages.filter((m) => m.role === "user").pop()
    const userQuery = lastUserMessage?.content || "learning topic"

    print("AgentLanguageInterface: Using fallback response due to AI backend unavailability")

    // More sophisticated educational responses based on query content
    const lowerQuery = userQuery.toLowerCase().trim()
    let response = ""

    if (lowerQuery.includes("machine learning") || lowerQuery.includes("ml")) {
      response =
        "Machine learning is a subset of artificial intelligence that enables computers to learn and make decisions from data without being explicitly programmed. Key concepts include supervised learning (learning from labeled examples), unsupervised learning (finding patterns in unlabeled data), and reinforcement learning (learning through trial and error with rewards)."
    } else if (lowerQuery.includes("neural network") || lowerQuery.includes("deep learning")) {
      response =
        "Neural networks are computing systems inspired by biological neural networks. They consist of interconnected nodes (neurons) organized in layers. Deep learning uses neural networks with multiple hidden layers to learn complex patterns in data. This technology powers many modern AI applications like image recognition and natural language processing."
    } else if (lowerQuery.includes("algorithm") || lowerQuery.includes("code")) {
      response =
        "Algorithms are step-by-step procedures for solving problems or performing calculations. In computer science, they form the foundation of all programming. Good algorithms are efficient, accurate, and scalable. Common types include sorting algorithms, search algorithms, and optimization algorithms."
    } else if (lowerQuery.includes("data") || lowerQuery.includes("analysis")) {
      response =
        "Data analysis involves examining, cleaning, transforming, and modeling data to discover useful information and support decision-making. Key steps include data collection, preprocessing, exploratory analysis, modeling, and interpretation. Tools like statistics, visualization, and machine learning help extract insights from data."
    } else if (lowerQuery.includes("what") || lowerQuery.includes("explain")) {
      response = `That's an excellent question! Understanding complex topics requires breaking them down into fundamental concepts. Let me help you explore the key principles and practical applications. This knowledge builds upon previous concepts and connects to broader themes in the field.`
    } else if (lowerQuery.includes("how") || lowerQuery.includes("work")) {
      response = `Great question about how things work! The process involves several interconnected steps and principles. Understanding the underlying mechanisms helps you apply this knowledge effectively. Let me walk you through the key components and their relationships.`
    } else if (
      lowerQuery.includes("hello") ||
      lowerQuery.includes("hi") ||
      lowerQuery.includes("hey") ||
      lowerQuery.includes("what's up")
    ) {
      response =
        "Hello! I'm your AI learning companion, here to help you understand and explore educational topics. Feel free to ask me about any subject you're studying - whether it's computer science, mathematics, science, or any other academic field. What would you like to learn about today?"
    } else {
      response = `Thank you for your question! This is an important topic that connects to many fundamental concepts. Let me provide some educational context to help you understand this better. The key is to build your understanding step by step, connecting new information to what you already know.`
    }

    return {
      content: response,
      finishReason: "stop",
      usage: {
        promptTokens: messages.reduce((sum, m) => sum + m.content.length, 0),
        completionTokens: response.length,
        totalTokens: messages.reduce((sum, m) => sum + m.content.length, 0) + response.length
      }
    }
  }

  private async generateOpenAIResponse(messages: Message[], options?: LLMOptions): Promise<LLMResponse> {
    try {
      // FIX: Check if we need audio output (use Realtime API) or text-only (use Chat Completions API)
      // Default to voice output unless explicitly disabled
      const shouldUseVoice = !options || options.textOnly !== true

      if (!shouldUseVoice) {
        print("AgentLanguageInterface: 📝 Using OpenAI Chat Completions API for text-only response")
        const responseText = await this.generateOpenAITextResponse(messages, options)
        return {
          content: responseText,
          finishReason: "stop",
          usage: {
            promptTokens: messages.reduce((sum, m) => sum + m.content.length, 0),
            completionTokens: Math.floor(responseText.length / 4),
            totalTokens: messages.reduce((sum, m) => sum + m.content.length, 0) + Math.floor(responseText.length / 4)
          }
        }
      }

      print("AgentLanguageInterface: Using OpenAI Realtime API with audio output - voice enabled")

      // FIX: Enable audio streaming for OpenAI Realtime API
      if (this.openAIAssistant) {
        print("AgentLanguageInterface: Starting audio streaming for OpenAI")
        this.openAIAssistant.streamData(true)
      }

      // FIX: Send full context to OpenAI Realtime session for processing with audio
      const lastUserMessage = messages[messages.length - 1]
      if (lastUserMessage && lastUserMessage.role === "user") {
        print("AgentLanguageInterface: Sending contextual message to OpenAI Realtime session with audio")

        // Build comprehensive message with full context for Realtime API
        const fullContextMessage = this.buildContextualMessage(messages)

        // Use sendMessageWithAudio for voice output with full context
        this.openAIAssistant.sendMessageWithAudio(fullContextMessage)

        // FIX: For voice mode, don't wait for text - let transcription events flow through
        print("AgentLanguageInterface: OpenAI voice mode - returning placeholder for transcription")
        return {
          content: "[Voice response - transcription pending]",
          finishReason: "stop",
          usage: {
            promptTokens: messages.reduce((sum, m) => sum + m.content.length, 0),
            completionTokens: 0,
            totalTokens: messages.reduce((sum, m) => sum + m.content.length, 0)
          }
        }
      }

      throw new Error("No user message found to process")
    } catch (error) {
      print(`AgentLanguageInterface: OpenAI response generation failed: ${error}`)
      return this.generateFallbackResponse(messages)
    }
  }

  private async generateGeminiResponse(messages: Message[], options?: LLMOptions): Promise<LLMResponse> {
    if (!this.geminiAssistant) {
      print("AgentLanguageInterface: Gemini Assistant not available, using fallback")
      return this.generateFallbackResponse(messages)
    }

    try {
      // FIX: For spatial tools, use Live API with video input (not Models API)
      // Default to voice output unless explicitly disabled
      const shouldUseVoice = !options || options.textOnly !== true

      if (!shouldUseVoice) {
        print("AgentLanguageInterface: 📝 Generating Gemini text-only response using Models API")
        const textResponse = await this.generateGeminiTextResponse(messages, options)
        return {
          content: textResponse,
          finishReason: "stop",
          usage: {
            promptTokens: messages.reduce((sum, m) => sum + m.content.length, 0),
            completionTokens: Math.floor(textResponse.length / 4), // Approximate tokens
            totalTokens: messages.reduce((sum, m) => sum + m.content.length, 0) + Math.floor(textResponse.length / 4)
          }
        }
      }

      print("AgentLanguageInterface: Using Gemini Live API with voice/video capabilities enabled")

      // FIX: Enable video streaming for spatial queries
      if (this.geminiAssistant && !options?.textOnly) {
        print("AgentLanguageInterface: 📹 Starting video streaming for spatial awareness")
        this.geminiAssistant.streamData(true)
      }

      // FIX: Send full context to Gemini Live session for processing with audio/video enabled
      const lastUserMessage = messages[messages.length - 1]
      if (lastUserMessage && lastUserMessage.role === "user") {
        // Enable audio streaming to ensure voice output
        this.geminiAssistant.streamData(true)

        // Build comprehensive message with full context for Live API
        const fullContextMessage = this.buildContextualMessage(messages)

        // Check if we have image data to send along with the text
        if (lastUserMessage.imageData && lastUserMessage.imageData.length > 100) {
          print("AgentLanguageInterface: Sending text + image + context to Gemini Live session")
          this.sendMultimodalMessageToGemini(fullContextMessage, lastUserMessage.imageData)
        } else {
          print("AgentLanguageInterface: Sending contextual message to Gemini Live session")
          this.geminiAssistant.sendTextMessage(fullContextMessage)
        }
        print("AgentLanguageInterface: Sent full context message to Gemini Live session with audio enabled")
      }

      // FIX: For voice mode, we don't wait for text - the transcription will come later
      // Return a placeholder that will be replaced by actual transcription in AgentOrchestrator
      if (!options?.textOnly) {
        print("AgentLanguageInterface: Voice mode - returning placeholder for transcription")
        return {
          content: "[Voice response - transcription pending]",
          finishReason: "stop",
          usage: {
            promptTokens: messages.reduce((sum, m) => sum + m.content.length, 0),
            completionTokens: 0,
            totalTokens: messages.reduce((sum, m) => sum + m.content.length, 0)
          }
        }
      }

      // For text-only mode, wait for the response
      const responseText = await this.waitForTextResponse(10000) // 10 second timeout

      if (!responseText || responseText.length === 0) {
        throw new Error("No response received from Gemini Live session")
      }

      print(
        `AgentLanguageInterface: Gemini Live response received: "${responseText.substring(0, 100)}..." (${responseText.length} chars)`
      )

      return {
        content: responseText,
        finishReason: "stop",
        usage: {
          promptTokens: messages.reduce((sum, m) => sum + m.content.length, 0),
          completionTokens: Math.floor(responseText.length / 4), // Approximate tokens
          totalTokens: messages.reduce((sum, m) => sum + m.content.length, 0) + Math.floor(responseText.length / 4)
        }
      }
    } catch (error) {
      print(`AgentLanguageInterface: Gemini Live response failed: ${error}`)
      return this.generateFallbackResponse(messages)
    }
  }

  /**
   * Generate text-only response from Gemini (for tools)
   * Uses Gemini Models API for reliable text-only responses
   */
  private async generateGeminiTextResponse(messages: Message[], options?: LLMOptions): Promise<string> {
    try {
      print("AgentLanguageInterface: 📝 Generating Gemini text-only response using Models API")

      // Import Gemini Models API
      const {Gemini} = require("RemoteServiceGateway.lspkg/HostedExternal/Gemini")

      // Convert messages to Gemini format (exclude system role)
      const contents = messages
        .filter((msg) => msg.role !== "system")
        .map((msg) => ({
          parts: [{text: msg.content}],
          role: msg.role === "assistant" ? "model" : msg.role
        }))

      const request = {
        model: "gemini-2.0-flash",
        type: "generateContent",
        body: {
          contents: contents
        }
      }

      print("AgentLanguageInterface: Calling Gemini Models API...")

      const response = await Gemini.models(request)

      const textResponse = response.candidates[0].content.parts[0].text

      print(`AgentLanguageInterface: Gemini Models API response received: "${textResponse.substring(0, 100)}..."`)

      return textResponse
    } catch (error) {
      print(`AgentLanguageInterface: Gemini Models API response failed: ${error}`)
      throw error
    }
  }

  /**
   * Generate text-only response from OpenAI using chat completions API
   * This uses the reliable chat completions API instead of the realtime API for tool routing
   */
  private async generateOpenAITextResponse(messages: Message[], options?: LLMOptions): Promise<string> {
    try {
      print("AgentLanguageInterface: 📝 Using OpenAI Chat Completions API for reliable text generation")

      // Import OpenAI API directly
      const {OpenAI} = require("RemoteServiceGateway.lspkg/HostedExternal/OpenAI")

      // Convert our Message format to OpenAI format
      const openAIMessages = messages.map((msg) => ({
        role: msg.role,
        content: msg.content
      }))

      print(`AgentLanguageInterface: Sending ${openAIMessages.length} messages to OpenAI Chat Completions`)

      // Call OpenAI Chat Completions API
      const response = await OpenAI.chatCompletions({
        model: "gpt-4o-mini",
        messages: openAIMessages,
        temperature: options?.temperature || 0.7,
        max_tokens: options?.maxTokens || 150
      })

      if (!response?.choices?.[0]?.message?.content) {
        throw new Error("No valid response received from OpenAI Chat Completions")
      }

      const responseText = response.choices[0].message.content
      print(`AgentLanguageInterface: OpenAI Chat Completions response: "${responseText.substring(0, 100)}..."`)

      return responseText
    } catch (error) {
      print(`AgentLanguageInterface: OpenAI Chat Completions failed: ${error}`)
      throw error
    }
  }

  /**
   * Format messages for text generation
   */
  private formatMessagesForTextGeneration(messages: Message[]): string {
    return messages
      .map((msg) => {
        const role = msg.role === "assistant" ? "AI" : msg.role.toUpperCase()
        return `${role}: ${msg.content}`
      })
      .join("\n\n")
  }

  /**
   * Wait for text response through event system
   */
  public async waitForTextResponse(timeoutMs: number = 10000): Promise<string> {
    return new Promise<string>((resolve) => {
      let responseText = ""
      let responseComplete = false
      let lastTextTime = Date.now()
      let completionAttempts = 0
      let silenceTimeoutId: any = null
      const startTime = Date.now()

      // Set flag to prevent other systems from interfering with tool text collection
      this.isCollectingToolResponse = true
      print(`AgentLanguageInterface: 🔒 Tool text collection started - other handlers will be paused`)

      // Helper function to complete the response
      const completeResponse = (reason: string) => {
        if (!responseComplete) {
          responseComplete = true
          clearTimeout(timeoutId)
          if (silenceTimeoutId) clearTimeout(silenceTimeoutId)
          print(
            `AgentLanguageInterface: Text collection completed (${reason}): "${responseText.substring(0, 100)}..." (${responseText.length} chars)`
          )
          this.onTextUpdate.remove(textUpdateHandler)
          this.isCollectingToolResponse = false
          print(`AgentLanguageInterface: 🔓 Tool text collection completed - other handlers can resume`)

          // Return the collected text or a default message if nothing was collected
          const finalResponse = responseText.trim()
          if (finalResponse.length > 0) {
            resolve(finalResponse)
          } else {
            // Provide a more helpful default response
            resolve("I'm here to help! Please feel free to ask me any questions about your studies.")
          }
        }
      }

      // Set up proper timeout
      const timeoutId = setTimeout(() => {
        completeResponse(`timeout (${timeoutMs}ms)`)
      }, timeoutMs)

      // Helper to reset silence timer
      const resetSilenceTimer = () => {
        if (silenceTimeoutId) clearTimeout(silenceTimeoutId)

        // Complete after 1.5 seconds of silence (no new text chunks)
        silenceTimeoutId = setTimeout(() => {
          if (responseText.length > 0) {
            completeResponse("silence detected")
          }
        }, 1500)
      }

      // Create event handler for text updates
      const textUpdateHandler = (data: {text: string; completed: boolean; provider: string}) => {
        // Filter out system messages
        const text = data.text || ""
        const isSystemMessage =
          text.includes("Websocket connected") ||
          text.includes("Session initialized") ||
          text.includes("Connection opened") ||
          text.toLowerCase().includes("websocket") ||
          text.toLowerCase().includes("session started")

        if (isSystemMessage) {
          print(`AgentLanguageInterface: 🚫 Ignoring system message: "${text}"`)
          return
        }

        // Accumulate text (including space between chunks for better formatting)
        if (text.length > 0) {
          // Add space if needed between chunks
          if (responseText.length > 0 && !responseText.endsWith(" ") && !text.startsWith(" ")) {
            responseText += " "
          }
          responseText += text
          lastTextTime = Date.now()
          print(`AgentLanguageInterface: 📝 Collecting AI text: "${text}" (total: ${responseText.length} chars)`)

          // Reset silence timer whenever we receive new text
          resetSilenceTimer()
        }

        // Handle explicit completion markers
        if (data.completed) {
          completionAttempts++
          print(`AgentLanguageInterface: Completion attempt ${completionAttempts} with ${responseText.length} chars`)

          // For streaming responses, wait a bit more for any final chunks
          setTimeout(() => {
            if (responseText.length > 0) {
              completeResponse("completion marker with delay")
            }
          }, 500)
        }

        // Auto-complete if response gets very long (near character limits)
        if (responseText.length >= 280) {
          completeResponse("length limit reached")
        }
      }

      // Add event handler
      this.onTextUpdate.add(textUpdateHandler)

      // Start initial silence timer
      resetSilenceTimer()

      print(`AgentLanguageInterface: Starting text response collection with ${timeoutMs}ms timeout`)
    })
  }

  /**
   * Wait for AI session to be ready for communication
   */
  private async waitForSessionReady(timeoutMs: number = 5000): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (this.providerInitialized[this.currentProvider]) {
        resolve()
        return
      }

      const startTime = Date.now()
      const checkReady = () => {
        if (this.providerInitialized[this.currentProvider]) {
          print(`AgentLanguageInterface: ${this.currentProvider} session ready for communication`)
          resolve()
        } else if (Date.now() - startTime > timeoutMs) {
          reject(new Error(`${this.currentProvider} session initialization timeout after ${timeoutMs}ms`))
        } else {
          // Check again in 100ms
          setTimeout(checkReady, 100)
        }
      }

      checkReady()
    })
  }

  // ================================
  // Multimodal Message Handling
  // ================================

  /**
   * Build a contextual message that includes system prompt, conversation history, and current query
   * This is needed for Live APIs that work with single comprehensive messages rather than conversation arrays
   */
  private buildContextualMessage(messages: Message[]): string {
    let contextualMessage = ""

    // Find system message and add it as context
    const systemMessage = messages.find((m) => m.role === "system")
    if (systemMessage) {
      contextualMessage += `CONTEXT AND INSTRUCTIONS:\n${systemMessage.content}\n\n`
    }

    // Add recent conversation history (excluding system and current user message)
    const conversationHistory = messages.filter((m) => m.role !== "system" && m !== messages[messages.length - 1])
    if (conversationHistory.length > 0) {
      contextualMessage += "RECENT CONVERSATION:\n"
      conversationHistory.slice(-6).forEach((msg) => {
        // Last 6 messages for context
        const roleLabel = msg.role === "user" ? "Student" : "Assistant"
        contextualMessage += `${roleLabel}: ${msg.content}\n`
      })
      contextualMessage += "\n"
    }

    // Add current user query
    const lastUserMessage = messages[messages.length - 1]
    if (lastUserMessage && lastUserMessage.role === "user") {
      contextualMessage += `CURRENT QUESTION:\n${lastUserMessage.content}`
    }

    return contextualMessage
  }

  /**
   * Send multimodal message (text + image) to Gemini Live session
   */
  private sendMultimodalMessageToGemini(textContent: string, imageData: string): void {
    if (!this.geminiAssistant) {
      print("AgentLanguageInterface: Gemini Assistant not available for multimodal message")
      return
    }

    try {
      // Send image data directly to the Gemini Live session
      this.geminiAssistant.sendImageMessage(imageData)
      print("AgentLanguageInterface: Sent image data to Gemini Live session")

      // Then send the text message
      this.geminiAssistant.sendTextMessage(textContent)
      print("AgentLanguageInterface: 📝 Sent text content to Gemini Live session")
    } catch (error) {
      print(`AgentLanguageInterface: Failed to send multimodal message: ${error}`)
      // Fallback to text-only
      this.geminiAssistant.sendTextMessage(textContent)
    }
  }

  // ================================
  // Audio Streaming
  // ================================

  public streamData(stream: boolean): void {
    if (!this.isInitialized) {
      print("AgentLanguageInterface: Session not initialized, cannot stream data")
      return
    }

    try {
      if (this.currentProvider.toLowerCase() === "openai" && this.openAIAssistant) {
        this.openAIAssistant.streamData(stream)
        print(`AgentLanguageInterface: OpenAI streaming ${stream ? "started" : "stopped"}`)
      } else if (this.currentProvider.toLowerCase() === "gemini" && this.geminiAssistant) {
        this.geminiAssistant.streamData(stream)
        print(`AgentLanguageInterface: Gemini streaming ${stream ? "started" : "stopped"}`)
      }
    } catch (error) {
      print(`AgentLanguageInterface: Streaming control failed: ${error}`)
      this.onError.invoke({error: `Streaming control failed: ${error}`, provider: this.currentProvider})
    }
  }

  public interruptAudioOutput(): void {
    try {
      if (this.currentProvider.toLowerCase() === "openai" && this.openAIAssistant) {
        this.openAIAssistant.interruptAudioOutput()
        print("AgentLanguageInterface: OpenAI audio interrupted")
      } else if (this.currentProvider.toLowerCase() === "gemini" && this.geminiAssistant) {
        this.geminiAssistant.interruptAudioOutput()
        print("AgentLanguageInterface: Gemini audio interrupted")
      }
    } catch (error) {
      print(`AgentLanguageInterface: Audio interruption failed: ${error}`)
      this.onError.invoke({error: `Audio interruption failed: ${error}`, provider: this.currentProvider})
    }
  }

  // ================================
  // Function Calling
  // ================================

  public sendFunctionCallResult(functionName: string, result: string, callId?: string): void {
    try {
      if (this.currentProvider.toLowerCase() === "openai" && this.openAIAssistant) {
        if (callId) {
          this.openAIAssistant.sendFunctionCallUpdate(functionName, callId, result)
          print(`AgentLanguageInterface: OpenAI function result sent: ${functionName}`)
        } else {
          print("AgentLanguageInterface: OpenAI requires callId for function results")
        }
      } else if (this.currentProvider.toLowerCase() === "gemini" && this.geminiAssistant) {
        this.geminiAssistant.sendFunctionCallUpdate(functionName, result)
        print(`AgentLanguageInterface: Gemini function result sent: ${functionName}`)
      }
    } catch (error) {
      print(`AgentLanguageInterface: Function result sending failed: ${error}`)
      this.onError.invoke({error: `Function result sending failed: ${error}`, provider: this.currentProvider})
    }
  }

  // ================================
  // Event Handlers
  // ================================

  private handleTextUpdate(data: {text: string; completed: boolean}, provider: string): void {
    // Forward the text update with provider information
    this.onTextUpdate.invoke({
      text: data.text,
      completed: data.completed,
      provider: provider
    })

    if (data.text && data.text.length > 0) {
      print(
        `AgentLanguageInterface: 📝 Text update from ${provider}: "${data.text.substring(0, 50)}..." (completed: ${data.completed})`
      )
    }
  }

  private handleFunctionCall(data: {name: string; args: any; callId?: string}, provider: string): void {
    // Forward the function call with provider information
    this.onFunctionCall.invoke({
      name: data.name,
      args: data.args,
      callId: data.callId,
      provider: provider
    })

    print(`AgentLanguageInterface: Function call from ${provider}: ${data.name}`)
  }

  // ================================
  // Utility Methods
  // ================================

  public isSessionInitialized(): boolean {
    return this.providerInitialized[this.currentProvider] || false
  }

  public getSessionInfo(): {
    provider: string
    initialized: boolean
    openAIAvailable: boolean
    geminiAvailable: boolean
  } {
    return {
      provider: this.currentProvider,
      initialized: this.providerInitialized[this.currentProvider] || false,
      openAIAvailable: this.openAIAssistant !== null,
      geminiAvailable: this.geminiAssistant !== null
    }
  }

  public resetSession(): void {
    this.isInitialized = false
    this.providerInitialized = {openai: false, gemini: false}
    print("AgentLanguageInterface: Session reset")
  }

  public async testConnection(): Promise<boolean> {
    try {
      if (!this.providerInitialized[this.currentProvider]) {
        this.initializeCurrentProvider()
      }

      // Test basic connectivity
      return this.providerInitialized[this.currentProvider]
    } catch (error) {
      print(`AgentLanguageInterface: Connection test failed: ${error}`)
      return false
    }
  }
}
