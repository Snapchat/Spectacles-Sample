import Event from "SpectaclesInteractionKit.lspkg/Utils/Event";
import { OpenAI } from "RemoteServiceGateway.lspkg/HostedExternal/OpenAI";
import { OpenAITypes } from "RemoteServiceGateway.lspkg/HostedExternal/OpenAITypes";

// ================================
// Types for AI Summarizer
// ================================

interface SummarySection {
    title: string; // Max 157 chars per diagram spec
    content: string; // Max 785 chars per diagram spec
    keywords: string[];
    timestamp: number;
}

interface SummaryResult {
    success: boolean;
    sections: SummarySection[];
    originalLength: number;
    summaryLength: number;
    processingTime: number;
    error?: string;
}

/**
 * AISummarizer - Simple AI-powered summarization service
 * 
 * According to architecture diagram, this is NOT part of the agentic tool flow.
 * This is a simple service that summarizes text using OpenAI for the summary component.
 * 
 * Simple Flow: SummaryASRController → SummaryStorage → SummaryBridge → AISummarizer → SummaryComponent
 * 
 * This component takes raw text and converts it into formatted summary sections
 * that can be displayed in the summary card UI with proper character limits.
 */
@component
export class AISummarizer extends BaseScriptComponent {
    
    // ================================
    // Inspector Configuration
    // ================================
    
    @input
    @hint("Enable AI summarization")
    public enableSummarization: boolean = true;
    
    @input
    @hint("OpenAI model to use for summarization")
    @widget(new ComboBoxWidget([
        new ComboBoxItem("gpt-4o-mini", "GPT-4o Mini"),
        new ComboBoxItem("gpt-4o", "GPT-4o"),
        new ComboBoxItem("gpt-3.5-turbo", "GPT-3.5 Turbo")
    ]))
    public model: string = "gpt-4o-mini";
    
    @input
    @hint("Maximum number of summary sections to generate")
    @widget(new SliderWidget(1, 10, 1))
    public maxSections: number = 5;
    
    @input
    @hint("Temperature for AI responses (0.0 = focused, 1.0 = creative)")
    @widget(new SliderWidget(0.0, 1.0, 0.1))
    public temperature: number = 0.3;
    
    @input
    @hint("Enable debug logging")
    public enableDebugLogging: boolean = true;
    
    // ================================
    // State Management
    // ================================
    
    private isProcessing: boolean = false;
    private currentRequestId: string = "";
    
    // ================================
    // Events
    // ================================
    
    public onSummaryGenerated: Event<SummaryResult> = new Event<SummaryResult>();
    public onSummaryError: Event<string> = new Event<string>();
    public onProcessingStarted: Event<string> = new Event<string>();
    public onProcessingCompleted: Event<void> = new Event<void>();
    
    // ================================
    // Lifecycle Methods
    // ================================
    
    onAwake() {
        if (this.enableDebugLogging) {
            print(`AISummarizer: 🤖 AI Summarizer initialized with model: ${this.model}`);
        }
    }
    
    // ================================
    // Public Interface
    // ================================
    
    /**
     * Generate summary sections from raw text
     * This is the main method called by SummaryBridge
     */
    public async generateSummary(text: string, title?: string): Promise<SummaryResult> {
        if (!this.enableSummarization) {
            return {
                success: false,
                sections: [],
                originalLength: text.length,
                summaryLength: 0,
                processingTime: 0,
                error: "Summarization disabled"
            };
        }
        
        if (!text || text.trim().length === 0) {
            return {
                success: false,
                sections: [],
                originalLength: 0,
                summaryLength: 0,
                processingTime: 0,
                error: "Empty text provided"
            };
        }
        
        if (this.isProcessing) {
            return {
                success: false,
                sections: [],
                originalLength: text.length,
                summaryLength: 0,
                processingTime: 0,
                error: "Already processing a summary request"
            };
        }
        
        const startTime = Date.now();
        this.isProcessing = true;
        this.currentRequestId = `summary_${startTime}`;
        
        this.onProcessingStarted.invoke(this.currentRequestId);
        
        if (this.enableDebugLogging) {
            print(`AISummarizer: 🔄 Starting summarization of ${text.length} characters`);
        }
        
        try {
            const result = await this.performSummarization(text, title);
            
            const processingTime = Date.now() - startTime;
            result.processingTime = processingTime;
            
            this.onSummaryGenerated.invoke(result);
            
            if (this.enableDebugLogging) {
                print(`AISummarizer: ✅ Summary completed in ${processingTime}ms, generated ${result.sections.length} sections`);
            }
            
            return result;
            
        } catch (error) {
            const processingTime = Date.now() - startTime;
            const errorResult: SummaryResult = {
                success: false,
                sections: [],
                originalLength: text.length,
                summaryLength: 0,
                processingTime: processingTime,
                error: `Summarization failed: ${error}`
            };
            
            this.onSummaryError.invoke(errorResult.error);
            
            if (this.enableDebugLogging) {
                print(`AISummarizer: ❌ Summarization error: ${error}`);
            }
            
            return errorResult;
            
        } finally {
            this.isProcessing = false;
            this.onProcessingCompleted.invoke();
        }
    }
    
    /**
     * Check if summarizer is currently processing
     */
    public isCurrentlyProcessing(): boolean {
        return this.isProcessing;
    }
    
    /**
     * Get current request ID
     */
    public getCurrentRequestId(): string {
        return this.currentRequestId;
    }
    
    // ================================
    // Private Methods
    // ================================
    
    private async performSummarization(text: string, title?: string): Promise<SummaryResult> {
        const summaryTitle = title || "Lecture Summary";
        
        // Create system prompt for summarization
        const systemPrompt = this.createSystemPrompt();
        
        // Create user prompt with the text to summarize
        const userPrompt = this.createUserPrompt(text, summaryTitle);
        
        // Call OpenAI
        const messages: OpenAITypes.ChatCompletions.Message[] = [
            {
                role: "system",
                content: systemPrompt
            },
            {
                role: "user", 
                content: userPrompt
            }
        ];
        
        const request: OpenAITypes.ChatCompletions.Request = {
            model: this.model.toLowerCase(), // Ensure model name is lowercase
            messages: messages,
            temperature: this.temperature,
            max_tokens: 2000, // Reasonable limit for summaries
            response_format: { type: "json_object" }
        };
        
        if (this.enableDebugLogging) {
            print(`AISummarizer: 📤 Sending request to OpenAI (${this.model})`);
        }
        
        const response = await OpenAI.chatCompletions(request);
        
        if (!response || !response.choices || response.choices.length === 0) {
            throw new Error("No response from OpenAI");
        }
        
        const responseContent = response.choices[0].message.content;
        
        if (this.enableDebugLogging) {
            print(`AISummarizer: 📥 Received response from OpenAI`);
            print(`AISummarizer: Response content: ${responseContent}`);
        }
        
        // Parse the JSON response
        return this.parseOpenAIResponse(responseContent, text.length);
    }
    
    private createSystemPrompt(): string {
        return `You are an educational content summarizer. Your task is to create structured summaries of lecture content that will be displayed in a card-based UI system.

CRITICAL REQUIREMENTS:
1. Generate between 2 and ${this.maxSections} summary sections
2. Each section MUST have:
   - title: EXACTLY 150-157 characters (use the full space! Be descriptive and educational)
   - content: EXACTLY 750-785 characters (use the full space! Include rich details, examples, and explanations)
   - keywords: Array of 3-5 relevant keywords
3. Focus on educational value and key learning points
4. Make summaries clear and accessible for students
5. Prioritize the most important information first

CHARACTER LIMIT OPTIMIZATION:
- For titles: Aim for 155-157 characters. Add descriptive phrases, context, or learning objectives to reach this length.
- For content: Aim for 780-785 characters. Include:
  * Detailed explanations of concepts
  * Specific examples and use cases
  * Step-by-step breakdowns where relevant
  * Additional context and related information
  * Learning tips or important notes
- If your initial text is too short, expand with relevant details, examples, or clarifications
- Use complete sentences and proper punctuation to maximize readability

RESPONSE FORMAT:
You must respond with valid JSON in this exact format:
{
  "sections": [
    {
      "title": "Section Title (MUST be 150-157 chars)",
      "content": "Section summary content (MUST be 750-785 chars)",
      "keywords": ["keyword1", "keyword2", "keyword3"]
    }
  ]
}

Remember: This is for educational purposes. Use the full character allowance to provide comprehensive, valuable learning content.`;
    }
    
    private createUserPrompt(text: string, title: string): string {
        return `Please create a structured summary for the following lecture content:

TITLE: ${title}

CONTENT TO SUMMARIZE:
${text}

Create ${Math.min(this.maxSections, Math.ceil(text.length / 500))} summary sections that capture the most important educational content.

IMPORTANT: You MUST use the full character limits:
- Each title MUST be 150-157 characters (expand with descriptive context if needed)
- Each content section MUST be 750-785 characters (add examples, details, and explanations to reach this length)

Make each section comprehensive and self-contained. If the content seems short, enrich it with:
- Additional context and background information
- Specific examples and practical applications
- Step-by-step breakdowns of processes
- Important tips or warnings for students
- Connections to related concepts

Each section should provide maximum educational value within the character limits.`;
    }
    
    private parseOpenAIResponse(responseContent: string, originalLength: number): SummaryResult {
        try {
            if (this.enableDebugLogging) {
                print(`AISummarizer: 🔍 Parsing response: ${responseContent.substring(0, 200)}...`);
            }
            
            const parsedResponse = JSON.parse(responseContent);
            
            if (!parsedResponse.sections || !Array.isArray(parsedResponse.sections)) {
                if (this.enableDebugLogging) {
                    print(`AISummarizer: ❌ Invalid response format. Parsed object: ${JSON.stringify(parsedResponse)}`);
                }
                throw new Error("Invalid response format: missing or invalid sections array");
            }
            
            const sections: SummarySection[] = [];
            let totalSummaryLength = 0;
            
            parsedResponse.sections.forEach((section: any, index: number) => {
                // Validate and enforce character limits
                const title = this.enforceCharacterLimit(section.title || `Section ${index + 1}`, 157);
                const content = this.enforceCharacterLimit(section.content || "", 785);
                const keywords = Array.isArray(section.keywords) ? section.keywords.slice(0, 5) : [];
                
                const summarySection: SummarySection = {
                    title: title,
                    content: content,
                    keywords: keywords,
                    timestamp: Date.now()
                };
                
                sections.push(summarySection);
                totalSummaryLength += title.length + content.length;
            });
            
            if (sections.length === 0) {
                throw new Error("No valid sections generated");
            }
            
            return {
                success: true,
                sections: sections,
                originalLength: originalLength,
                summaryLength: totalSummaryLength,
                processingTime: 0 // Will be set by caller
            };
            
        } catch (error) {
            if (this.enableDebugLogging) {
                print(`AISummarizer: ❌ Parse error: ${error}`);
                print(`AISummarizer: Raw response was: ${responseContent}`);
            }
            throw new Error(`Failed to parse OpenAI response: ${error}`);
        }
    }
    
    private enforceCharacterLimit(text: string, maxLength: number): string {
        if (!text) return "";
        
        if (text.length <= maxLength) {
            return text;
        }
        
        // Truncate at word boundary if possible
        const truncated = text.substring(0, maxLength);
        const lastSpace = truncated.lastIndexOf(' ');
        
        if (lastSpace > maxLength * 0.8) { // If we can keep at least 80% and cut at word boundary
            return truncated.substring(0, lastSpace) + '...';
        } else {
            return truncated.substring(0, maxLength - 3) + '...';
        }
    }
    
    // ================================
    // Utility Methods
    // ================================
    
    public getStatus(): { isProcessing: boolean; model: string; maxSections: number } {
        return {
            isProcessing: this.isProcessing,
            model: this.model,
            maxSections: this.maxSections
        };
    }
} 