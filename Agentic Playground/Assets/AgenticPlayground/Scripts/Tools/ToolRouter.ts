import { AgentLanguageInterface } from '../Agents/AgentLanguageInterface';
import { Message } from '../Agents/AgentTypes';
import { DiagramCreatorTool } from './DiagramCreatorTool';
import { GeneralConversationTool } from './GeneralConversationTool';
import { SummaryTool } from './SummaryTool';
import { SpatialTool } from './SpatialTool';
import { DiagramStorage } from '../Storage/DiagramStorage';
import { SummaryStorage } from '../Storage/SummaryStorage';
import { ChatStorage } from '../Storage/ChatStorage';

/**
 * Tool metadata for AI routing decisions
 */
interface ToolMetadata {
  name: string;
  description: string;
  capabilities: string[];
  useWhen: string[];
  instance: any;
}

/**
 * Intelligent AI-powered tool router that uses LLM reasoning for routing decisions
 * Replaces primitive string matching with contextual understanding
 */
export class ToolRouter {
  private languageInterface: AgentLanguageInterface;
  private toolIndex: Map<string, ToolMetadata> = new Map();
  private enableDebugLogging: boolean = true;
  private diagramCreatorTool: DiagramCreatorTool;

  constructor(languageInterface: AgentLanguageInterface, diagramStorage?: DiagramStorage) {
    this.languageInterface = languageInterface;
    
    // Initialize tools
    this.diagramCreatorTool = new DiagramCreatorTool(languageInterface, diagramStorage);
    const generalConversation = new GeneralConversationTool(languageInterface);
    const summaryTool = new SummaryTool(languageInterface);
    const spatialTool = new SpatialTool(languageInterface);
    
    // Index tools with their capabilities and use cases
    this.indexTool('diagram_tool', {
      name: 'diagram_tool',
      description: 'Creates visual diagrams from conversation content and learning points',
      capabilities: [
        'Create mind maps and concept diagrams',
        'Visualize educational content structure',
        'Generate interactive learning diagrams',
        'Organize information into visual hierarchies'
      ],
      useWhen: [
        'User explicitly requests a diagram, chart, or visualization',
        'User wants to "create", "draw", "visualize", or "map" concepts',
        'User asks to "show relationships" or "organize information visually"',
        'User requests mind maps, flowcharts, or concept maps'
      ],
      instance: this.diagramCreatorTool
    });

    this.indexTool('summary_tool', {
      name: 'summary_tool', 
      description: 'Focuses on previous lecture summary content and answers specific questions about summarized material',
      capabilities: [
        'Answer questions about previously summarized lecture content',
        'Reference specific points from the lecture summary',
        'Explain concepts covered in the summarized material',
        'Provide details from the documented lecture content'
      ],
      useWhen: [
        'User asks about "the lecture" content (refers to summarized material)',
        'User wants information from previous summary or lecture notes',
        'User asks about specific topics covered in the documented content',
        'User references "what we learned", "what was discussed", or "lecture material"',
        'User asks for lecture title, topics, or key points from summarized content'
      ],
      instance: summaryTool
    });

    this.indexTool('spatial_tool', {
      name: 'spatial_tool',
      description: 'Answers questions about live lecture environment using camera input and spatial awareness',
      capabilities: [
        'Analyze current physical environment with camera',
        'Provide real-time spatial context',
        'Answer questions about what is currently happening',
        'Observe live presentations or current surroundings'
      ],
      useWhen: [
        'User asks about current/live environment or "what do you see right now"',
        'User wants real-time analysis of physical space',
        'User asks about "current presentation" happening live (not summarized)',
        'User requests camera-based observation of immediate surroundings'
      ],
      instance: spatialTool
    });

    this.indexTool('general_conversation', {
      name: 'general_conversation',
      description: 'Handles general conversation and educational questions without specialized context',
      capabilities: [
        'Provide general educational assistance',
        'Answer broad knowledge questions',
        'Engage in conversational learning',
        'Handle queries not requiring specialized tools'
      ],
      useWhen: [
        'General educational questions not related to specific lecture content',
        'Broad knowledge questions or concept explanations',
        'Conversational learning that doesn\'t need specialized context',
        'Default choice when no other tool is specifically needed'
      ],
      instance: generalConversation
    });
    
    if (this.enableDebugLogging) {
      print(`ToolRouter: 🧠 AI-powered intelligent tool router initialized with ${this.toolIndex.size} indexed tools`);
      print("ToolRouter: 📚 Tools indexed: " + Array.from(this.toolIndex.keys()).join(', '));
    }
  }

  /**
   * Set the summary storage for tools that need it
   */
  public setSummaryStorage(summaryStorage: SummaryStorage): void {
    if (this.diagramCreatorTool) {
      this.diagramCreatorTool.setSummaryStorage(summaryStorage);
      print("ToolRouter: 🔗 Connected SummaryStorage to DiagramCreatorTool");
    }
  }

  /**
   * Set the chat storage for tools that need it
   */
  public setChatStorage(chatStorage: ChatStorage): void {
    if (this.diagramCreatorTool) {
      this.diagramCreatorTool.setChatStorage(chatStorage);
      print("ToolRouter: 🔗 Connected ChatStorage to DiagramCreatorTool");
    }
  }

  /**
   * Index a tool with its metadata for AI routing decisions
   */
  private indexTool(key: string, metadata: ToolMetadata): void {
    this.toolIndex.set(key, metadata);
    if (this.enableDebugLogging) {
      print(`ToolRouter: 📖 Indexed tool "${key}" with ${metadata.capabilities.length} capabilities`);
    }
  }

  /**
   * AI-powered intelligent routing - uses LLM to make routing decisions
   */
  public async routeQuery(args: Record<string, unknown>): Promise<{ success: boolean; result?: any; error?: string }> {
    const { query, summaryContext } = args;
    
    if (!query || typeof query !== 'string') {
      return { success: false, error: 'Query parameter is required and must be a string' };
    }

    try {
      // Get routing decision from AI
      const selectedTool = await this.getAIRoutingDecision(query as string, summaryContext);
      
      if (!selectedTool || !this.toolIndex.has(selectedTool)) {
        print(`ToolRouter: ⚠️ AI selected unknown tool "${selectedTool}", falling back to general_conversation`);
        const fallbackTool = this.toolIndex.get('general_conversation')!;
        return await fallbackTool.instance.execute(args);
      }

      const toolMetadata = this.toolIndex.get(selectedTool)!;
      
      if (this.enableDebugLogging) {
        print(`ToolRouter: 🧠 AI routing decision: "${selectedTool}" for query: "${(query as string).substring(0, 50)}..."`);
        print(`ToolRouter: 💡 Reasoning: ${toolMetadata.description}`);
      }

      return await toolMetadata.instance.execute(args);
      
    } catch (error) {
      print(`ToolRouter: ❌ AI routing failed: ${error}`);
      // Fallback to general conversation on error
      const fallbackTool = this.toolIndex.get('general_conversation')!;
      return await fallbackTool.instance.execute(args);
    }
  }

  /**
   * Use AI to make intelligent routing decision based on context and intent
   */
  private async getAIRoutingDecision(query: string, summaryContext?: any): Promise<string> {
    // Build tool index description for AI
    const toolDescriptions = Array.from(this.toolIndex.values()).map(tool => {
      return `**${tool.name}**:
- Description: ${tool.description}
- Use when: ${tool.useWhen.join('; ')}
- Capabilities: ${tool.capabilities.join('; ')}`;
    }).join('\n\n');

    // Build context information
    let contextInfo = '';
    if (summaryContext && summaryContext.title) {
      contextInfo = `\n\nAVAILABLE CONTEXT:
- Lecture Summary Available: "${summaryContext.title}"
- Summary Content: ${summaryContext.content ? 'Yes' : 'No'}
- Key Points Available: ${summaryContext.keyPoints ? summaryContext.keyPoints.length + ' points' : 'No'}`;
    }

    const routingPrompt = `You are an intelligent tool router for an educational AI assistant. Analyze the user query and select the most appropriate tool.

AVAILABLE TOOLS:
${toolDescriptions}${contextInfo}

USER QUERY: "${query}"

ROUTING RULES:
1. If user asks about "the lecture" or lecture content, and summary context is available, use "summary_tool"
2. If user requests diagrams, visualizations, or mind maps, use "diagram_tool"  
3. If user asks about current/live environment or "what do you see", use "spatial_tool"
4. For general questions without specific tool needs, use "general_conversation"

Respond with ONLY the tool name (e.g., "summary_tool", "diagram_tool", "spatial_tool", "general_conversation").`;

    try {
      // Get routing decision from current language interface
      // Uses generateTextResponse() for silent routing (no voice output needed for internal decisions)
      const response = await this.languageInterface.generateTextResponse([{
        role: 'user',
        content: routingPrompt
      }]);
      
      if (!response || typeof response !== 'string') {
        throw new Error('Invalid routing response from AI');
      }

      // Extract tool name from response
      const toolName = response.trim().toLowerCase();
      
      // Validate tool name
      const validTools = Array.from(this.toolIndex.keys());
      const selectedTool = validTools.find(tool => toolName.includes(tool));
      
      if (!selectedTool) {
        print(`ToolRouter: ⚠️ AI response "${toolName}" didn't match any indexed tool, using general_conversation`);
        return 'general_conversation';
      }

      return selectedTool;
      
    } catch (error) {
      print(`ToolRouter: ❌ AI routing decision failed: ${error}`);
      return 'general_conversation';
    }
  }



  /**
   * Get tool information for registration with AgentToolExecutor
   */
  public getToolInfo() {
    return {
      name: 'intelligent_conversation',
      description: 'AI-powered intelligent router that analyzes queries and selects the most appropriate specialized tool for educational responses, diagram creation, summary analysis, or spatial awareness',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'User query to analyze and route to appropriate tool' },
          context: { type: 'array', description: 'Array of previous conversation messages for routing context' },
          summaryContext: { type: 'object', description: 'Summary of lecture content - critical for routing decisions' },
          maxLength: { type: 'number', description: 'Maximum character length for the response' },
          educationalFocus: { type: 'boolean', description: 'Whether to focus on educational content' }
        },
        required: ['query']
      }
    };
  }

  /**
   * Get indexed tools information for debugging
   */
  public getIndexedTools(): string[] {
    return Array.from(this.toolIndex.keys());
  }

  /**
   * Get tool metadata for debugging
   */
  public getToolMetadata(toolName: string): ToolMetadata | undefined {
    return this.toolIndex.get(toolName);
  }
}
