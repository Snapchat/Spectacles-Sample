import {AgentLanguageInterface} from "../Agents/AgentLanguageInterface"
import {Message} from "../Agents/AgentTypes"
import {CHARACTER_LIMITS, TextLimiter} from "../Utils/TextLimiter"

/**
 * Summary Tool - focuses on the previous summary
 * According to diagram specification - injects the summary from the summary property storage in its system prompt
 * Specializes in answering specific questions regarding the summarized document
 */
export class SummaryTool {
  public readonly name = "summary_tool"
  public readonly description =
    "Focuses on the previous summary and answers specific questions regarding the summarized document content"

  public readonly parameters = {
    type: "object",
    properties: {
      query: {type: "string", description: "The user query about the summary content"},
      context: {type: "array", description: "Array of previous conversation messages for context"},
      summaryContext: {type: "object", description: "Summary of lecture content injected into system prompt"},
      maxLength: {
        type: "number",
        description: "Maximum character length for the response",
        default: CHARACTER_LIMITS.BOT_CARD_TEXT
      },
      educationalFocus: {type: "boolean", description: "Whether to maintain educational focus", default: true}
    },
    required: ["query"]
  }

  private languageInterface: AgentLanguageInterface

  constructor(languageInterface: AgentLanguageInterface) {
    this.languageInterface = languageInterface
    print("SummaryTool: 📋 Summary-focused conversation tool initialized")
  }

  public async execute(args: Record<string, unknown>): Promise<{success: boolean; result?: any; error?: string}> {
    const {query, context, summaryContext, maxLength = CHARACTER_LIMITS.BOT_CARD_TEXT, educationalFocus = true} = args

    if (!query || typeof query !== "string") {
      return {success: false, error: "Query parameter is required and must be a string"}
    }

    try {
      print(`SummaryTool: 📋 Processing summary-focused query: "${(query as string).substring(0, 50)}..."`)

      // Build enhanced system prompt with summary context injection
      const systemPrompt = this.buildSummarySystemPrompt(summaryContext, educationalFocus as boolean)

      // Prepare conversation context
      const conversationHistory = this.prepareConversationHistory(context, query as string)

      // Generate AI response with summary-injected prompt
      const aiResponse = await this.generateSummaryResponse(systemPrompt, conversationHistory, maxLength as number)

      // Build final response
      const response = {
        message: aiResponse,
        relatedTopics: this.extractRelatedTopics(summaryContext),
        suggestedFollowUp: this.generateSummaryFollowUps(query as string, summaryContext),
        educationalLevel: "intermediate",
        processingTime: Date.now(),
        toolUsed: "summary_tool",
        summaryFocused: true
      }

      print(`SummaryTool: Generated summary-focused response`)

      return {
        success: true,
        result: response
      }
    } catch (error) {
      print(`SummaryTool: ERROR - Summary processing failed: ${error}`)
      return {
        success: false,
        error: `Summary tool failed: ${error}`
      }
    }
  }

  /**
   * Build system prompt with summary context injection
   */
  private buildSummarySystemPrompt(summaryContext: any, educationalFocus: boolean): string {
    let prompt = "You are answering specific questions regarding this document:\n\n"

    // Inject summary content into system prompt
    if (summaryContext && summaryContext.summaries && Array.isArray(summaryContext.summaries)) {
      prompt += "DOCUMENT SUMMARY:\n"
      summaryContext.summaries.forEach((summary: any, index: number) => {
        if (summary.title && summary.content) {
          prompt += `\nSection ${index + 1}: ${summary.title}\n`
          prompt += `${summary.content}\n`
        }
      })
      prompt += "\n"
    } else if (summaryContext && summaryContext.title && summaryContext.content) {
      // Handle mock data structure from AgentOrchestrator
      prompt += "DOCUMENT SUMMARY:\n"
      prompt += `Title: ${summaryContext.title}\n`
      prompt += `Content: ${summaryContext.content}\n`

      if (summaryContext.keyPoints && Array.isArray(summaryContext.keyPoints)) {
        prompt += "\nKey Points:\n"
        summaryContext.keyPoints.forEach((point: string, index: number) => {
          prompt += `${index + 1}. ${point}\n`
        })
      }
      prompt += "\n"
    } else if (summaryContext && typeof summaryContext === "string") {
      prompt += `DOCUMENT SUMMARY:\n${summaryContext}\n\n`
    } else {
      prompt += "DOCUMENT SUMMARY: [No summary content available]\n\n"
    }

    prompt += "CRITICAL INSTRUCTIONS:\n"
    prompt += "- MAXIMUM RESPONSE LENGTH: 150 characters (this is a hard limit for AR display)\n"
    prompt += "- Be EXTREMELY concise - use short phrases, not full sentences when possible\n"
    prompt += "- Answer with key facts only, no elaboration\n"
    prompt += "- If asked about multiple topics, focus on the most important one\n"
    prompt += "- Omit pleasantries, transitional phrases, and filler words\n"
    prompt += "- Use bullet points or numbered lists for multiple items\n"

    if (educationalFocus) {
      prompt += "- Focus on the core learning point only\n"
    }

    prompt += "- Example good response: 'Neural networks: layers process data, learn patterns'\n"
    prompt +=
      "- Example bad response: 'Neural networks are computational systems that process data through multiple layers to learn patterns'\n"

    return prompt
  }

  /**
   * Prepare conversation history for context
   */
  private prepareConversationHistory(context: any, currentQuery: string): Message[] {
    const messages: Message[] = []

    // Add recent context if available
    if (context && Array.isArray(context)) {
      const recentMessages = context.slice(-10) // Last 10 messages for context

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
   * Generate AI response with summary context
   */
  private async generateSummaryResponse(systemPrompt: string, messages: Message[], maxLength: number): Promise<string> {
    if (!this.languageInterface) {
      throw new Error("Language interface not available")
    }

    // Format messages for the language interface (system message + conversation history)
    const formattedMessages: Message[] = [
      {
        role: "system" as const,
        content: systemPrompt
      },
      ...messages
    ]

    // Create the request with system prompt injection
    // textOnly: false enables voice output for summary explanations
    print("SummaryTool: Requesting response with voice output enabled (textOnly: false)")
    const response = await this.languageInterface.generateResponse(formattedMessages, {
      maxTokens: Math.floor(maxLength / 3), // Rough token estimate
      temperature: 0.7,
      textOnly: false // Enable audio output
    })

    // Extract response content
    let responseContent = ""
    if (typeof response === "string") {
      responseContent = response
    } else if (response && typeof response === "object" && "content" in response) {
      responseContent = (response as any).content || ""
    } else {
      throw new Error("No valid response received from AI")
    }

    if (!responseContent) {
      throw new Error("No response generated from AI")
    }

    // Apply character limits
    return TextLimiter.limitText(responseContent, maxLength)
  }

  /**
   * Extract related topics from summary context
   */
  private extractRelatedTopics(summaryContext: any): string[] {
    const topics: string[] = []

    if (summaryContext && summaryContext.summaries && Array.isArray(summaryContext.summaries)) {
      summaryContext.summaries.forEach((summary: any) => {
        if (summary.title) {
          topics.push(summary.title)
        }
      })
    } else if (summaryContext && summaryContext.keyPoints && Array.isArray(summaryContext.keyPoints)) {
      // Handle mock data structure - extract from key points
      topics.push(...summaryContext.keyPoints.slice(0, 3))
    } else if (summaryContext && summaryContext.title) {
      // Use the title as a topic
      topics.push(summaryContext.title)
    }

    // Fallback topics if no summary available
    if (topics.length === 0) {
      return ["summary content", "document analysis", "key points"]
    }

    return topics.slice(0, 3) // Limit to 3 topics
  }

  /**
   * Generate follow-up questions based on summary content
   */
  private generateSummaryFollowUps(query: string, summaryContext: any): string[] {
    const followUps: string[] = []

    // Generic summary-focused follow-ups
    followUps.push("Can you explain more about this topic from the summary?")
    followUps.push("How does this connect to other parts of the document?")
    followUps.push("What are the key takeaways from this section?")

    // Summary-specific follow-ups if available
    if (summaryContext && summaryContext.summaries && Array.isArray(summaryContext.summaries)) {
      if (summaryContext.summaries.length > 1) {
        followUps.push("How do the different sections relate to each other?")
      }

      // Add follow-up about specific sections
      const firstSection = summaryContext.summaries[0]
      if (firstSection && firstSection.title) {
        followUps.push(`Tell me more about "${firstSection.title}"`)
      }
    } else if (summaryContext && summaryContext.keyPoints && Array.isArray(summaryContext.keyPoints)) {
      // Handle mock data structure - create follow-ups based on key points
      const firstPoint = summaryContext.keyPoints[0]
      if (firstPoint) {
        followUps.push(`Can you elaborate on "${firstPoint}"?`)
      }

      if (summaryContext.keyPoints.length > 1) {
        followUps.push("How do these key points relate to each other?")
      }
    } else if (summaryContext && summaryContext.title) {
      // Use the title for follow-ups
      followUps.push(`Tell me more about "${summaryContext.title}"`)
    }

    return followUps.slice(0, 3) // Limit to 3 follow-ups
  }
}
