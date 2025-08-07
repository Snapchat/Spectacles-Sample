/**
 * Core Type Definitions for Agentic Learning System
 * 
 * This file contains all the shared interfaces and types used throughout
 * the agentic learning system based on the project specification.
 */

// ================================
// System State Types
// ================================

interface SystemState {
  currentStep: 'idle' | 'summary' | 'chat' | 'diagram';
  summaryData: SummaryData;
  chatHistory: ChatMessage[];
  diagramState: DiagramState;
  sessionId: string;
  timestamp: number;
}

interface SummaryData {
  originalText: string;
  summaries: SummarySection[];
  cardCount: number;
  generatedAt: number;
}

interface SummarySection {
  title: string; // Max 157 chars
  content: string; // Max 785 chars
  cardIndex: number;
  keywords: string[];
}

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: number;
  cardIndex: number;
  relatedTools: string[];
}

interface DiagramState {
  nodes: DiagramNode[];
  connections: DiagramConnection[];
  lastUpdateTime: number;
  analysisVersion: number;
}

interface DiagramNode {
  id: string;
  type: 'text' | 'image' | 'model';
  content: string;
  position: vec3;
  level: number;
  parentId?: string;
  generatedContent?: GeneratedContent;
}

interface DiagramConnection {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  relationship: string;
  strength: number;
}

interface GeneratedContent {
  type: 'image' | 'model';
  prompt: string;
  assetReference: string;
  generatedAt: number;
}

// ================================
// Agent Communication Types
// ================================

interface Message {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  name?: string;
  toolCallId?: string;
  imageData?: string; // Base64 encoded image data for multimodal AI processing
}

interface LLMOptions {
  temperature?: number;
  maxTokens?: number;
  toolChoice?: 'auto' | 'none' | { name: string };
  textOnly?: boolean; // Force text-only mode (no voice)
}

interface LLMResponse {
  content: string;
  toolCalls?: ToolCall[];
  finishReason: 'stop' | 'length' | 'tool_calls';
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

interface ToolCall {
  id: string;
  name: string;
  arguments: string;
}

// ================================
// Tool System Types
// ================================

interface Tool {
  name: string;
  description: string;
  parameters: any;
  execute(args: Record<string, unknown>): Promise<ToolResult>;
}

interface ToolResult {
  success: boolean;
  result?: any;
  error?: string;
  executionTime: number;
}

interface ImageResult extends ToolResult {
  texture?: Texture;
  nodeId: string;
  prompt: string;
  provider?: string;
}

interface Model3DResult extends ToolResult {
  result?: string;
  nodeId: string;
  prompt: string;
  position?: vec3;
}

interface ConversationAnalysis {
  topics: string[];
  concepts: string[];
  learningObjectives: string[];
  keyPhrases: string[];
  suggestedNodes: DiagramNode[];
  educationalConnections: { from: string; to: string; relationship: string }[];
}

interface DiagramUpdateResult {
  updatedNodes: DiagramNode[];
  newConnections: DiagramConnection[];
  removedNodes: string[];
  updateType: 'add_node' | 'update_node' | 'add_connection' | 'restructure';
}

// ================================
// Storage Types
// ================================

interface StorageStatus {
  currentSize: number;
  maxSize: number;
  usagePercentage: number;
  lastUpdated: number;
}

// ================================
// Agent Response Types
// ================================

interface SummaryResult {
  sections: SummarySection[];
  totalSections: number;
  processingTime: number;
  educationalKeywords: string[];
}

interface ChatResponse {
  message: string;
  relatedTopics: string[];
  suggestedFollowUp: string[];
  educationalLevel: 'beginner' | 'intermediate' | 'advanced';
  processingTime: number;
  // Diagram properties
  shouldCreateDiagram?: boolean;
  diagramNodes?: DiagramNode[];
  diagramType?: string;
  nodeCount?: number;
}

// ================================
// Configuration Types
// ================================

interface AgentConfiguration {
  // System Configuration
  enableSystem: boolean;
  resetStorageOnStart: boolean;
  enableTestMode: boolean;
  fixedTestText: string;
  
  // Agent Configuration
  summaryMaxCards: number;
  chatMaxHistory: number;
  diagramMaxNodes: number;
  enableDynamicDiagram: boolean;
  conversationContextMessages: number;
  
  // AI Configuration
  aiModelProvider: 'openai' | 'gemini';
  enableImageGeneration: boolean;
  enable3DGeneration: boolean;
  toolTimeout: number;
  
  // Debug Configuration
  enableDebugLogging: boolean;
  showToolUsage: boolean;
}

// ================================
// Event Types
// ================================

interface AgentEvent<T = any> {
  type: string;
  data: T;
  timestamp: number;
  agentId: string;
}

// ================================
// Educational Content Types
// ================================

interface EducationalContext {
  subject: string;
  level: 'elementary' | 'middle' | 'high' | 'college' | 'graduate';
  learningObjectives: string[];
  prerequisites: string[];
  keyTerms: string[];
}

interface LearningSession {
  id: string;
  startTime: number;
  endTime?: number;
  type: 'lecture' | 'study' | 'review';
  educationalContext: EducationalContext;
  state: SystemState;
}

// ================================
// Export Types for Global Use
// ================================

export type {
  SystemState,
  SummaryData,
  SummarySection,
  ChatMessage,
  DiagramState,
  DiagramNode,
  DiagramConnection,
  GeneratedContent,
  Message,
  LLMOptions,
  LLMResponse,
  ToolCall,
  Tool,
  ToolResult,
  ImageResult,
  Model3DResult,
  ConversationAnalysis,
  DiagramUpdateResult,
  StorageStatus,
  SummaryResult,
  ChatResponse,
  AgentConfiguration,
  AgentEvent,
  EducationalContext,
  LearningSession
};
