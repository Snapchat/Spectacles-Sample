# 🎬 AI Agentic Playground Tutorial Script

## 📋 Tutorial Overview
*Duration: ~53-68 minutes*  
*Target: Developers interested in building agentic AI systems on Spectacles*

---

## 🎯 Part 1: Introduction - AI Playground Sample (10-12 minutes)

### Opening Hook (30 seconds)
> "What if I told you that you could build an intelligent AI agent that can see, hear, think, and create 3D content - all running directly on Spectacles smart glasses? Today, we're diving deep into building an agentic AI playground that does exactly that."

### 1.1 Project Context Setup (2 minutes)
**[SCREEN: Open Lens Studio with the project]**

> "Before we build our advanced agentic system, let's start with the foundation. In this project, we have an existing sample called 'AI Playground' that demonstrates the core capabilities we'll be building upon."

**[NAVIGATE: Show `/Context/ai-playground-scripts` folder]**

> "Here in the ai-playground-scripts folder, you can see we have several fundamental components:
> - `OpenAIAssistant.ts` - Direct OpenAI integration
> - `GeminiAssistant.ts` - Google Gemini multimodal AI
> - `ImageGenerator.ts` - AI image creation
> - `InteractableSnap3DGenerator.ts` - 3D model generation
> - `ASRQueryController.ts` - Voice transcription"

### 1.2 Remote Service Gateway Deep Dive (3 minutes)
**[SCREEN: Open `remote-service-gateway.md`]**

> "Now, here's the crucial part that makes everything possible - the Remote Service Gateway. Let me explain why this is absolutely fundamental."

**[READ from RSG documentation]**

> "The Remote Service Gateway solves a critical problem: By default, Spectacles Lenses can't access both sensitive user data AND the internet simultaneously. But with RSG, we can:
> 
> 1. **Access sensitive data** like camera frames, location, and audio
> 2. **Connect to AI services** like OpenAI, Gemini, and Snap3D
> 3. **Publish our Lens** - which normally isn't possible with Extended Permissions
>
> Think of RSG as a secure bridge between your Lens and AI services."

**[HIGHLIGHT: Supported Services section]**

> "The gateway supports:
> - **OpenAI**: Chat completions, image generation, text-to-speech, and realtime voice
> - **Gemini**: Multimodal AI with live video capabilities  
> - **DeepSeek**: Advanced reasoning models
> - **Snap3D**: Text-to-3D model generation"

### 1.3 Model Differences & Capabilities (2 minutes)
**[SCREEN: Show model comparison]**

> "Let's talk about the key differences between our AI models:

**OpenAI Models:**
- Excellent for conversational AI and text generation
- Realtime voice mode with low latency
- Advanced image generation capabilities
- Audio input/output

**Gemini Models:** 
- **Multimodal advantage**: Can process text, images, AND video simultaneously
- Perfect for spatial understanding and visual analysis
- Live video mode - this is huge for AR applications
- Better for 'what am I looking at' type queries

**Snap3D:**
- Specialized for 3D content creation
- Text-to-3D and image-to-3D generation
- Outputs GLB format models ready for AR"

### 1.4 Setup Walkthrough (3 minutes)
**[SCREEN: Demonstrate setup process]**

> "Let's set this up step by step:

**Step 1: Get Your RSG Token**
- Go to Lens Studio → Windows → Remote Service Gateway Token
- Click 'Generate Token' 
- This token is tied to your Snapchat account and never expires
- Copy this token - we'll need it"

**[SCREEN: Show token generator interface]**

**Step 2: Configure the Project**
- Find the `RemoteServiceGatewayCredentials` component in your scene
- Paste your token in the inspector
- This authenticates all your API calls"

**[SCREEN: Show inspector with credentials]**

**Step 3: Test Basic Functionality**
- In the scene, you'll see interactive generators
- `InteractableImageGenerator` - click and speak to create images
- `InteractableSnap3DGenerator` - click and speak to create 3D models
- These use the ASR module to convert your speech to text, then send to the respective AI services"

### 1.5 ASR Module Importance (1 minute)
**[SCREEN: Show ASRQueryController.ts]**

> "The ASR (Automatic Speech Recognition) module is critical because:
> - It handles voice-to-text conversion
> - Manages microphone permissions
> - Provides the speech input for all our AI interactions
> - Without this, users would have to type everything - not great for AR!"

---

## 🏗️ Part 2: Architecture Overview (11-13 minutes)

### 2.1 The Big Picture (2 minutes)
**[SCREEN: Open `Agentic Playground.drawio.xml`]**

> "Now that you understand the foundation, let's look at what we're building. This diagram shows our complete agentic system architecture."

**[NAVIGATE: Overview of the diagram]**

> "This isn't just a simple chatbot - this is a full agentic AI system with:
> - Multiple specialized tools
> - Intelligent tool routing  
> - Persistent memory
> - Multi-modal content generation
> - Real-time speech interaction"

### 2.1.1 Vibecoding Culture & Context Management (3 minutes)
**[SCREEN: Keep the diagram visible while discussing]**

> "Before we dive deeper, I want to talk about something crucial in today's vibecoding culture. With AI, you can literally ask it to build anything starting from anything - but here's the key: **context is everything**.

**The Importance of Architectural Planning:**
> "This diagram you're seeing wasn't just a nice-to-have - it was absolutely essential. In the age of vibecoding, where we're rapidly prototyping with AI assistance, having a clear architectural diagram serves as your **ground truth**. It keeps you and anyone you collaborate with anchored to the same vision."

**[POINT to different sections of the diagram]**

> "When I started this project, I only knew about the basic AI Playground sample. My initial diagram was much rougher - just basic boxes and arrows. But I knew I needed to understand the broader context of agentic systems before diving in."

**The Research & Evolution Process:**
> "So I did my homework. I researched:
> - How other agentic systems work
> - Best practices for tool-based AI architectures  
> - Multi-modal AI integration patterns
> - Real-time processing challenges

Then I started implementing piece by piece, and with each component I built, this diagram evolved. It became more detailed, more accurate, more complete."

**Context Management is Key:**
> "This brings me to something we're moving toward as vibecoding matures: **context management**. It's not enough to just prompt AI anymore - you need to:
> 1. **Understand your domain** deeply
> 2. **Map your system architecture** before coding
> 3. **Maintain context** across development sessions
> 4. **Document your decisions** for future contributors

**[GESTURE to the entire diagram]**

> "This diagram isn't just documentation - it's a **living context map** that guided every implementation decision I made."

### 2.2 Three Core Systems (3 minutes)
**[SCREEN: Highlight the three main sections]**

> "The system is divided into three main experiences:

**1. Summary System (Left side)**
- Listens to lectures or conversations
- Provides real-time summarization
- Perfect for students taking notes

**2. Chat System (Center)**  
- Intelligent conversational AI
- Tool-based responses
- Context-aware interactions

**3. Diagram System (Right side)**
- Creates rich, multi-media diagrams
- Combines text, images, and 3D models
- Educational content visualization"

### 2.3 Agentic Architecture Deep Dive (3 minutes)
**[SCREEN: Focus on the agentic system components]**

> "Here's where it gets interesting. Look at this orange section - this is our agentic core:

**AgentOrchestrator** - The brain of the system
- Analyzes user queries  
- Decides which AI model to use (OpenAI vs Gemini)
- Routes to appropriate tools

**Tool Router** - The decision maker
- Uses AI to classify user intent
- No hard-coded rules - it's intelligent routing
- Selects from available tools dynamically

**Available Tools:**
- `GeneralConversationTool` - Regular chat
- `SummaryTool` - Questions about summaries  
- `SpatialTool` - Visual/camera-based queries
- `DiagramCreatorTool` - New diagram creation
- `DiagramUpdaterTool` - Modify existing diagrams"

### 2.4 Data Flow & Storage (2 minutes)
**[SCREEN: Show storage components and data flow]**

> "Notice the purple storage components:
- `SummaryStorage` - Stores lecture transcripts
- `ChatStorage` - Conversation history
- `DiagramStorage` - Diagram definitions and content

And the blue bridge components that connect AI services to UI:
- They handle the interface between our AI responses and the visual components
- Manage real-time updates
- Handle error states and loading"

---

## 🔍 Part 3: Detailed Component Walkthrough (25-30 minutes)

### 3.1 Summary System Deep Dive (5-6 minutes)
**[SCREEN: Navigate to summary components]**

> "Let's start with the summary system - this is the simplest but very effective.

**[SHOW: `SummaryASQRController.ts`]**
> "This component:
> - Manages voice transcription for live lectures
> - User clicks to start/stop recording
> - Sends audio to speech-to-text service"

**[SHOW: `SummaryStorage.ts`]**
> "The storage component:
> - Accumulates transcribed text
> - Stores session data
> - Provides context for AI summarization"

**[SHOW: `AISummarizer.ts`]**
> "This is NOT part of the agentic system - it's a direct AI call:
> - Takes raw transcribed text
> - Uses OpenAI to create structured summaries
> - Formats for display in cards"

**[SHOW: `SummaryBridge.ts` and `SummaryComponent.ts`]**
> "The bridge and UI component:
> - Bridge interfaces between AI and UI
> - Component displays formatted summaries
> - Updates in real-time as content is processed"

### 3.2 Chat System Architecture (6-7 minutes)
**[SCREEN: Navigate to chat system]**

> "The chat system is where the magic happens. This is our full agentic implementation.

**[SHOW: `ChatASQRController.ts`]**
> "Similar to summary, but feeds into the agentic system:
> - Captures user voice input
> - Converts to text queries
> - Sends to AgentOrchestrator"

**[SHOW: `AgentOrchestrator.ts`]**
> "This is the brain - let me show you something important here..."

**[NAVIGATE: Show the defaultProvider setting]**
> "See this dropdown? YOU control which AI model is the default:
> - Set to 'openai' - most tools use OpenAI
> - Set to 'gemini' - most tools use Gemini  
> - BUT - the system is smart enough to override when needed
> - For example: camera queries ALWAYS use Gemini for vision"

**[SHOW: `ToolRouter.ts`]**
> "This is crucial - the tool router uses AI itself to decide which tool to use:
> - No hard-coded if/else statements
> - Sends user query to AI for classification
> - Returns which tool should handle the request
> - This makes the system incredibly flexible"

### 3.3 Tool Deep Dive (8-10 minutes)
**[SCREEN: Navigate to Tools folder]**

> "Let's examine each tool and how they work:

**[SHOW: `GeneralConversationTool.ts`]**
> "The default conversation tool:
> - Handles general chat and questions
> - Uses your orchestrator's default model
> - Sources: Just the user query
> - System prompt optimized for casual conversation"

**[SHOW: `SummaryTool.ts`]**  
> "Summary-focused interactions:
> - Handles questions about summarized content
> - Sources: User query + summary storage data
> - Uses default model from orchestrator
> - Specialized for educational content questions"

**[SHOW: `SpatialTool.ts`]**
> "The spatial/visual tool:
> - ALWAYS uses Gemini (forced override for camera support)
> - Sources: User query + camera input
> - Perfect for 'what am I looking at' queries
> - Takes advantage of Gemini's multimodal capabilities"

**[SHOW: `DiagramCreatorTool.ts`]**
> "Diagram creation powerhouse:
> - Sources: User query + summary storage + chat storage
> - Uses default model for text generation
> - But spawns image and 3D generation tasks
> - Creates structured diagram definitions"

**[SHOW: `DiagramUpdaterTool.ts`]**
> "Modifies existing diagrams:
> - Similar to creator but works with existing content
> - Can add, modify, or remove nodes
> - Maintains diagram consistency"

### 3.4 Storage & Testing Strategy (3 minutes)
**[SCREEN: Show storage components and testing]**

> "Storage is critical for our agentic system:

**Persistent Memory:**
- All tools can access stored conversations and summaries
- This gives context for better responses
- Cross-session memory for continuity

**Testing Framework:**
- Each major component has test integration
- You can verify tool responses
- Debug storage data
- Monitor AI model performance"

### 3.5 Diagram System - The Crown Jewel (8-10 minutes)
**[SCREEN: Navigate to diagram components]**

> "The diagram system is the most complex part. Let me break it down:

**[SHOW: Diagram node structure]**
> "We have three types of nodes:
> - `textNode.ts` - Pure text content with title and body
> - `imageNode.ts` - Text + AI-generated image  
> - `modelNode.ts` - Text + 3D model placeholder"

**[SHOW: `DiagramStorage.ts`]**
> "This stores a structured document defining:
> - Total number of nodes
> - Node types and order
> - Content for each node
> - Image/3D prompts for generation"

**[NAVIGATE: Show example in documentation]**
> "The storage format looks like:
```
DiagramTitle: 'Solar System Overview'
Nodes: 5
Node 1: text
  Title: 'Introduction'  
  Content: 'The solar system consists of...'
Node 2: image
  Title: 'The Sun'
  Content: 'Our star is...'
  Image prompt: 'realistic image of the sun with solar flares'
```"

**[SHOW: Bridge components]**
> "The bridge system is complex here:
> - `DiagramBridge.ts` - Main UI interface
> - `ImageGenBridge.ts` - Handles image generation
> - `ModelGenBridge.ts` - Handles 3D model creation"

**[SHOW: Generation Queue system]**
> "Here's the challenge: We might need to generate multiple images and 3D models simultaneously. The Generation Queue handles:
> - `GenerationQueue.ts` - Request prioritization  
> - `GenerationQueueInitializer.ts` - System setup
> - `ModelGenerationScheduler.ts` - 3D model optimization
> - `GenerationQueueDebugger.ts` - Monitoring and debugging"

---

## 🎨 Part 4: Customization & Next Steps (10-13 minutes)

### 4.1 System Prompts Deep Dive (8-10 minutes)
**[SCREEN: Show various system prompts in code]**

> "Every AI interaction uses carefully crafted system prompts. Let me show you the EXACT prompts used in each component - this is the secret sauce of the system:

#### **🤖 OpenAIAssistant System Prompt** 
**[SHOW: `Scripts/Core/OpenAIAssistant.ts`]**
```typescript
private readonly instructions: string = `You are an educational AI tutor designed to help students learn and understand complex topics. 

Your primary goals are to:
- Provide clear, accurate explanations of educational concepts
- Break down complex topics into digestible parts
- Use examples and analogies to enhance understanding
- Ask clarifying questions to gauge comprehension
- Encourage critical thinking and curiosity
- Adapt your teaching style to the student's level

🔥 CRITICAL RESPONSE LENGTH REQUIREMENT:
- Your responses MUST be limited to exactly 300 characters or fewer
- This is a HARD LIMIT that cannot be exceeded under any circumstances
- Count characters carefully and stop exactly at 300 characters
- Be concise while maintaining educational value
- If a topic needs more explanation, invite follow-up questions
- Prioritize the most important information within the character limit

Always maintain an encouraging, patient, and supportive tone. Focus on helping students build knowledge and confidence in their learning journey within the strict 300-character limit.`;
```

#### **✨ GeminiAssistant System Prompt**
**[SHOW: `Scripts/Core/GeminiAssistant.ts`]**
```typescript
private readonly instructions: string = `You are an educational AI tutor. Provide clear, accurate explanations of educational concepts. Keep responses under 300 characters. Be encouraging and supportive.`;
```

#### **📄 AISummarizer System Prompt**
**[SHOW: `Scripts/Core/AISummarizer.ts`]**
```typescript
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
```

#### **💭 GeneralConversationTool System Prompt**
**[SHOW: `Scripts/Tools/GeneralConversationTool.ts`]**
```typescript
const systemPrompt = `You are a helpful and friendly AI assistant with a focus on educational support.

RESPONSE REQUIREMENTS:
- Your responses MUST be limited to exactly ${validMaxLength} characters or fewer
- This is a HARD LIMIT that cannot be exceeded under any circumstances
- Be conversational, friendly, and helpful
${educationalFocus ? '- Maintain an educational focus when appropriate' : ''}
- Use a natural, engaging tone
- If the question is very general (like greetings), offer to help with specific topics

CONVERSATION STYLE:
- Be warm and approachable
- Ask follow-up questions to better assist the user
- Provide helpful suggestions when appropriate
- Keep responses concise but informative within the character limit

Remember: Be helpful, friendly, and educational while staying within the ${validMaxLength} character limit.`;
```

#### **📋 SummaryTool System Prompt**
**[SHOW: `Scripts/Tools/SummaryTool.ts`]**
```typescript
private buildSummarySystemPrompt(summaryContext: any, educationalFocus: boolean): string {
    let prompt = "You are answering specific questions regarding this document:\n\n";
    
    // Inject summary content into system prompt
    if (summaryContext && summaryContext.summaries && Array.isArray(summaryContext.summaries)) {
      prompt += "DOCUMENT SUMMARY:\n";
      summaryContext.summaries.forEach((summary: any, index: number) => {
        if (summary.title && summary.content) {
          prompt += `\nSection ${index + 1}: ${summary.title}\n`;
          prompt += `${summary.content}\n`;
        }
      });
      prompt += "\n";
    }
    
    prompt += "CRITICAL INSTRUCTIONS:\n";
    prompt += "- MAXIMUM RESPONSE LENGTH: 150 characters (this is a hard limit for AR display)\n";
    prompt += "- Be EXTREMELY concise - use short phrases, not full sentences when possible\n";
    prompt += "- Answer with key facts only, no elaboration\n";
    prompt += "- If asked about multiple topics, focus on the most important one\n";
    prompt += "- Omit pleasantries, transitional phrases, and filler words\n";
    prompt += "- Use bullet points or numbered lists for multiple items\n";
    prompt += "- Focus on the core learning point only\n";
    prompt += "- Example good response: 'Neural networks: layers process data, learn patterns'\n";
    prompt += "- Example bad response: 'Neural networks are computational systems that process data through multiple layers to learn patterns'\n";
    
    return prompt;
}
```

#### **👁️ SpatialTool System Prompt**
**[SHOW: `Scripts/Tools/SpatialTool.ts`]**
```typescript
private buildSpatialSystemPrompt(spatialContext: string, enableImageInput: boolean): string {
    let prompt = "You are answering specific questions regarding a lecture that is going on now and the student sees the surrounding environment.\n\n";
    
    prompt += "SPATIAL CONTEXT:\n";
    if (spatialContext) {
      prompt += `Environment details: ${spatialContext}\n`;
    }
    
    if (enableImageInput) {
      prompt += "IMPORTANT: You have real-time camera input enabled and can see the current environment.\n";
      prompt += "You should analyze what you see in front of you and describe the visual environment.\n";
      prompt += "Use your visual perception to answer questions about what is currently visible.\n";
      prompt += "When asked 'what do you see', describe exactly what is in your current field of view.\n";
    }
    
    prompt += "\nINSTRUCTIONS:\n";
    prompt += "- Answer questions based on the current lecture environment and visual context\n";
    prompt += "- Reference what you can see or understand about the current setting\n";
    prompt += "- Help the student understand concepts in relation to their current learning environment\n";
    prompt += "- If visual input is available, use it to provide specific, contextual responses\n";
    prompt += "- Focus on real-time educational assistance during live lectures\n";
    prompt += "- Connect visual observations to educational concepts when relevant\n";
    prompt += "- Maintain awareness of the spatial/physical learning context\n";
    
    return prompt;
}
```

#### **📊 DiagramCreatorTool System Prompt**
**[SHOW: `Scripts/Tools/DiagramCreatorTool.ts`]**
```typescript
// Example topic generation prompt within DiagramCreatorTool:
const prompt = `Based on this query about creating a diagram: "${query}", generate 5-8 relevant educational topics that should be included in the diagram. Format each topic as a clear, concise title.`;

// System message for context:
{
  role: 'system',
  content: 'You are an educational assistant helping to create meaningful diagrams. Generate clear, relevant topic titles.'
}
```

#### **🧠 ToolRouter AI-Powered Routing Prompt**
**[SHOW: `Scripts/Tools/ToolRouter.ts`]**
```typescript
const routingPrompt = `You are an intelligent tool router for an educational AI assistant. Analyze the user query and select the most appropriate tool.

AVAILABLE TOOLS:
${toolDescriptions}

USER QUERY: "${query}"

ROUTING RULES:
1. If user asks about "the lecture" or lecture content, and summary context is available, use "summary_tool"
2. If user requests diagrams, visualizations, or mind maps, use "diagram_tool"  
3. If user asks about current/live environment or "what do you see", use "spatial_tool"
4. For general questions without specific tool needs, use "general_conversation"

Respond with ONLY the tool name (e.g., "summary_tool", "diagram_tool", "spatial_tool", "general_conversation").`;
```

**Character Limits and AR Optimization:**
> "Notice how each prompt has specific character limits - this is crucial for AR displays:
> - OpenAI/Gemini Assistants: 300 characters max
> - Summary Tool: 150 characters (ultra-concise for quick reading)
> - AISummarizer: 750-785 characters for rich content
> These aren't arbitrary - they're optimized for readability on Spectacles!"

**Finding and Modifying Prompts:**
> "These are the COMPLETE, EXACT system prompts from the actual project. To customize them:
> 
> 1. **Core AI Assistants**: Look for the `instructions` property in OpenAIAssistant.ts and GeminiAssistant.ts
> 2. **Tool Prompts**: Each tool has its own prompt-building method like `buildSummarySystemPrompt()`
> 3. **Dynamic Context**: Notice how tools like SummaryTool inject context (lecture content) directly into prompts
> 4. **Character Limits**: Always respect the character limits - they're tested and optimized for AR readability
> 
> Want to experiment? Modify these prompts and see how it changes the AI behavior!"

### 4.2 Adding Your Own Tools (2 minutes)
**[SCREEN: Show tool structure]**

> "Want to add your own tool? Here's the pattern:
> 1. Create a new tool class implementing the Tool interface
> 2. Define your system prompt and data sources
> 3. Register it with the ToolRouter
> 4. The AI will automatically learn when to use it!"

### 4.3 Model Configuration (1 minute)
**[SCREEN: Show provider settings]**

> "Remember - you control the AI models:
> - Change the orchestrator default provider
> - Modify individual tool model preferences
> - Test different combinations for your use case"

### 4.4 Performance Considerations (2 minutes)
**[SCREEN: Show generation queue and optimization]**

> "For production use, consider:
> - Generation queue limits to prevent overload
> - Caching strategies for repeated content
> - Model selection based on task complexity
> - User feedback loops for tool routing accuracy"

---

## 🎬 Closing & Call to Action (2 minutes)

### Wrap-up
> "We've just built a complete agentic AI system that can:
> - Listen and summarize live content
> - Have intelligent conversations with tool-based responses  
> - Create rich, multimedia educational diagrams
> - All running natively on Spectacles with full access to camera and voice"

### Key Takeaways
> "The power here is in the architecture:
> - AI-driven tool routing instead of hard-coded rules
> - Multimodal AI integration with smart model selection
> - Persistent context across all interactions
> - Scalable generation queue for complex content creation"

### Building Infrastructure for the Community
> "I want to emphasize something important: **this project is infrastructure, not a final product**. My goal wasn't to build the perfect agentic system - it was to create something that's:
> - **Understandable**: Clear architecture that others can follow
> - **Extensible**: Easy to add new tools and capabilities  
> - **Collaborative**: Designed for community contributions
> - **Educational**: A learning resource for agentic AI development

This is the foundation. Now it's up to all of us to build something amazing on top of it."

### Next Steps  
> "Try this yourself:
> 1. Clone the project and set up your RSG token
> 2. Experiment with the existing tools
> 3. Modify the system prompts for your use case
> 4. Add your own custom tools
> 5. Share what you build - I'd love to see it!"

### Call to Action
> "If this inspired you to build your own agentic AI systems, hit subscribe and let me know in the comments what tools you'd add to this system. The future of AI is agentic, and it's running on AR glasses!"

---

## 📝 Technical Notes for Recording

### Key Files to Have Open:
- `/Context/ai-playground-scripts/` folder
- `remote-service-gateway.md`
- `Agentic Playground.drawio.xml` 
- Main project structure in `/Agentic Playground/`
- Key TypeScript files for each component

### Screen Recording Tips:
- Use zoom for code readability
- Navigate slowly between files
- Highlight important code sections
- Show both the architecture diagram and corresponding code
- Demonstrate the actual UI components when possible

### Demo Preparation:
- Have RSG token ready
- Test voice input functionality
- Prepare example queries for each tool type
- Have sample generated content ready to show

---

*Total estimated duration: 53-68 minutes*  
*Complexity level: Intermediate to Advanced*  
*Prerequisites: Basic TypeScript, AI/ML concepts, Lens Studio familiarity* 



1 AI playground Overview 
2 Agentic Playground Overview - architecture 
3 Agentic Playground Overview in lens studio 
testing components like summary, chat and diagram 
4 Test in Lens Studio 
5 Test in device TO DO 
6 Script organization overview 
7 Customization 



