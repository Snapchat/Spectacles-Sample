import {AgentLanguageInterface} from "../Agents/AgentLanguageInterface"
import {CHARACTER_LIMITS, TextLimiter} from "../Utils/TextLimiter"

/**
 * Default conversation tool for normal chat when no specific tool is needed
 * Provides AI-powered responses for general questions and conversation
 */
export class GeneralConversationTool {
  public readonly name = "general_conversation"
  public readonly description = "Handles general conversation and questions using AI without specialized context"

  public readonly parameters = {
    type: "object",
    properties: {
      query: {type: "string", description: "The user query to respond to"},
      maxLength: {
        type: "number",
        description: "Maximum character length for the response",
        default: CHARACTER_LIMITS.BOT_CARD_TEXT
      },
      conversational: {type: "boolean", description: "Whether to use conversational tone", default: true},
      educationalFocus: {type: "boolean", description: "Whether to maintain educational focus", default: true}
    },
    required: ["query"]
  }

  private languageInterface: AgentLanguageInterface

  constructor(languageInterface: AgentLanguageInterface) {
    this.languageInterface = languageInterface
    print("GeneralConversationTool: Default conversation handler initialized")
  }

  public async execute(args: Record<string, unknown>): Promise<{success: boolean; result?: any; error?: string}> {
    const {query} = args

    if (!query || typeof query !== "string") {
      return {success: false, error: "Query parameter is required and must be a string"}
    }

    return await this.generateConversationalResponse(args)
  }

  /**
   * Generate conversational response using AI without specialized context
   */
  private async generateConversationalResponse(
    args: Record<string, unknown>
  ): Promise<{success: boolean; result?: any; error?: string}> {
    const {query, maxLength = CHARACTER_LIMITS.BOT_CARD_TEXT, conversational = true, educationalFocus = true} = args

    print(`GeneralConversationTool: Generating conversational response for: "${(query as string).substring(0, 50)}..."`)

    // Ensure maxLength is valid
    const validMaxLength = (maxLength as number) > 0 ? (maxLength as number) : CHARACTER_LIMITS.BOT_CARD_TEXT

    try {
      // Create a friendly conversational system prompt
      const systemPrompt = `You are a helpful and friendly AI assistant with a focus on educational support.

RESPONSE REQUIREMENTS:
- Your responses MUST be limited to exactly ${validMaxLength} characters or fewer
- This is a HARD LIMIT that cannot be exceeded under any circumstances
- Be conversational, friendly, and helpful
${educationalFocus ? "- Maintain an educational focus when appropriate" : ""}
- Use a natural, engaging tone
- If the question is very general (like greetings), offer to help with specific topics

CONVERSATION STYLE:
- Be warm and approachable
- Ask follow-up questions to better assist the user
- Provide helpful suggestions when appropriate
- Keep responses concise but informative within the character limit

Remember: Be helpful, friendly, and educational while staying within the ${validMaxLength} character limit.`

      // Call the AI with the conversational system prompt
      // textOnly: false enables voice output for conversational responses
      const response = await this.languageInterface.generateResponse(
        [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: query as string
          }
        ],
        {
          temperature: 0.8, // Slightly higher for more natural conversation
          maxTokens: Math.floor(validMaxLength / 2),
          textOnly: false // Enable audio output
        }
      )

      print("GeneralConversationTool: Voice response requested with textOnly: false")

      // Extract content from LLMResponse object
      const responseContent = response?.content || ""

      if (!responseContent || responseContent.length === 0) {
        throw new Error("No response received from AI")
      }

      // Apply character limit
      const limitedContent = TextLimiter.truncateAtWordBoundary(responseContent, validMaxLength)

      // Format response with proper structure
      const chatResponse = {
        message: limitedContent,
        relatedTopics: this.extractTopicsFromResponse(limitedContent),
        suggestedFollowUp: this.generateConversationalFollowUp(query as string),
        educationalLevel: "intermediate",
        processingTime: 0 // Will be set by calling agent
      }

      print(`GeneralConversationTool: Generated conversational response`)
      print(`GeneralConversationTool: 📝 Response length: ${chatResponse.message.length} chars`)

      return {success: true, result: chatResponse}
    } catch (error) {
      print(`GeneralConversationTool: ERROR - Conversational AI call failed: ${error}`)

      // Return a simple fallback (last resort)
      return {
        success: true,
        result: {
          message: "I'm here to help! What would you like to know or discuss?",
          relatedTopics: ["conversation", "help"],
          suggestedFollowUp: ["What topic interests you?", "How can I assist you today?"],
          educationalLevel: "intermediate",
          processingTime: 0
        }
      }
    }
  }

  private extractTopicsFromResponse(content: string): string[] {
    // Extract general topics for conversation
    const conversationKeywords = content
      .toLowerCase()
      .match(/\b(help|learn|understand|question|topic|discuss|explain|explore|study|know)\b/g)

    if (!conversationKeywords) {
      return ["conversation", "assistance"]
    }

    const uniqueKeywords = [...new Set(conversationKeywords)]
    return uniqueKeywords.slice(0, 3)
  }

  private generateConversationalFollowUp(query: string): string[] {
    const lowerQuery = query.toLowerCase()

    if (lowerQuery.includes("hello") || lowerQuery.includes("hi") || lowerQuery.includes("hey")) {
      return [
        "What topic would you like to explore?",
        "Is there something specific you'd like to learn about?",
        "How can I help you today?"
      ]
    }

    if (lowerQuery.includes("what") || lowerQuery.includes("how") || lowerQuery.includes("why")) {
      return [
        "Would you like me to explain that in more detail?",
        "Are there specific aspects you'd like to know more about?",
        "Do you have related questions?"
      ]
    }

    return [
      "What else would you like to know?",
      "Is there anything specific you'd like me to clarify?",
      "Would you like to explore this topic further?"
    ]
  }
}
