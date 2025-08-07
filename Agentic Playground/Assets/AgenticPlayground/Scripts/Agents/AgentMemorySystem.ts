import {
  SystemState,
  SummaryData,
  ChatMessage,
  DiagramState,
  Message,
  StorageStatus,
  LearningSession,
  EducationalContext
} from './AgentTypes';

/**
 * Persistent memory system for learning context
 * Stores conversation history, summaries, and diagram states
 * Manages 10MB storage limit with automatic persistence
 */
export class AgentMemorySystem {
  private messages: Message[] = [];
  private summaryContext: SummaryData | null = null;
  private chatHistory: ChatMessage[] = [];
  private diagramState: DiagramState | null = null;
  private currentSession: LearningSession | null = null;
  
  // Persistence integration
  private persistentStorage: any; // Use any to handle API differences
  
  // Storage configuration
  private readonly MAX_STORAGE_SIZE = 10 * 1024 * 1024; // 10MB limit
  private readonly STORAGE_KEYS = {
    SUMMARY: 'agentflow_summary',
    CHAT: 'agentflow_chat', 
    DIAGRAM: 'agentflow_diagram',
    SESSION: 'agentflow_session',
    MESSAGES: 'agentflow_messages',
    METADATA: 'agentflow_metadata'
  };
  
  constructor() {
    try {
      // Initialize persistent storage - handle different API versions
      if (typeof global !== 'undefined' && global.persistentStorageSystem) {
        this.persistentStorage = global.persistentStorageSystem.store;
      } else {
        print("AgentMemorySystem: ⚠️ PersistentStorage not available, using in-memory storage");
        this.persistentStorage = null;
      }
      
      this.initializeMemory();
      print("AgentMemorySystem: ✅ Memory system initialized");
    } catch (error) {
      print(`AgentMemorySystem: ❌ Failed to initialize memory system: ${error}`);
      this.persistentStorage = null;
      this.initializeMemory();
    }
  }
  
  // ================================
  // Message Management
  // ================================
  
  public addMessage(message: Message): void {
    this.messages.push(message);
    
    // Maintain message history limit to prevent memory bloat
    if (this.messages.length > 500) {
      this.messages = this.messages.slice(-250); // Keep last 250 messages
      print("AgentMemorySystem: ⚠️ Message history truncated to prevent memory overflow");
    }
    
    this.saveToStorage();
    print(`AgentMemorySystem: ℹ️ Added message: ${message.role} - ${message.content.substring(0, 50)}...`);
  }
  
  public getMessages(): Message[] {
    return [...this.messages];
  }
  
  public getRecentMessages(count: number = 10): Message[] {
    return this.messages.slice(-count);
  }
  
  public clearMessages(): void {
    this.messages = [];
    this.saveToStorage();
    print("AgentMemorySystem: ✅ Messages cleared");
  }
  
  // ================================
  // Summary Context Management
  // ================================
  
  public setSummaryContext(summaryData: SummaryData): void {
    this.summaryContext = summaryData;
    this.saveToStorage();
    print(`AgentMemorySystem: ✅ Summary context updated: ${summaryData.summaries.length} sections`);
  }
  
  public getSummaryContext(): SummaryData | null {
    return this.summaryContext;
  }
  
  public clearSummaryContext(): void {
    this.summaryContext = null;
    this.saveToStorage();
    print("AgentMemorySystem: ✅ Summary context cleared");
  }
  
  // ================================
  // Chat History Management
  // ================================
  
  public addChatMessage(message: ChatMessage): void {
    this.chatHistory.push(message);
    
    // Maintain chat history limit
    if (this.chatHistory.length > 100) {
      this.chatHistory = this.chatHistory.slice(-50); // Keep last 50 messages
      print("AgentMemorySystem: ⚠️ Chat history truncated to prevent memory overflow");
    }
    
    this.saveToStorage();
    print(`AgentMemorySystem: ℹ️ Added chat message: ${message.type} - ${message.content.substring(0, 50)}...`);
  }
  
  public getChatHistory(): ChatMessage[] {
    return [...this.chatHistory];
  }
  
  public getRecentChatMessages(count: number = 25): ChatMessage[] {
    return this.chatHistory.slice(-count);
  }
  
  public clearChatHistory(): void {
    this.chatHistory = [];
    this.saveToStorage();
    print("AgentMemorySystem: ✅ Chat history cleared");
  }
  
  // ================================
  // Diagram State Management
  // ================================
  
  public setDiagramState(diagramState: DiagramState): void {
    this.diagramState = diagramState;
    this.saveToStorage();
    print(`AgentMemorySystem: ✅ Diagram state updated: ${diagramState.nodes.length} nodes`);
  }
  
  public getDiagramState(): DiagramState | null {
    return this.diagramState;
  }
  
  public clearDiagramState(): void {
    this.diagramState = null;
    this.saveToStorage();
    print("AgentMemorySystem: ✅ Diagram state cleared");
  }
  
  // ================================
  // Session Management
  // ================================
  
  public startNewSession(type: 'lecture' | 'study' | 'review', context?: EducationalContext): void {
    this.currentSession = {
      id: this.generateSessionId(),
      startTime: Date.now(),
      type: type,
      educationalContext: context || this.createDefaultEducationalContext(),
      state: this.getCurrentSystemState()
    };
    
    this.saveToStorage();
    print(`AgentMemorySystem: ✅ New ${type} session started: ${this.currentSession.id}`);
  }
  
  public endCurrentSession(): void {
    if (this.currentSession) {
      this.currentSession.endTime = Date.now();
      this.currentSession.state = this.getCurrentSystemState();
      this.saveToStorage();
      print(`AgentMemorySystem: ✅ Session ended: ${this.currentSession.id}`);
    }
  }
  
  public getCurrentSession(): LearningSession | null {
    return this.currentSession;
  }
  
  // ================================
  // Storage Management
  // ================================
  
  public saveToStorage(): void {
    try {
      const startTime = Date.now();
      
      // Save individual components
      this.saveComponent(this.STORAGE_KEYS.MESSAGES, this.messages);
      this.saveComponent(this.STORAGE_KEYS.SUMMARY, this.summaryContext);
      this.saveComponent(this.STORAGE_KEYS.CHAT, this.chatHistory);
      this.saveComponent(this.STORAGE_KEYS.DIAGRAM, this.diagramState);
      this.saveComponent(this.STORAGE_KEYS.SESSION, this.currentSession);
      
      // Update metadata
      this.updateStorageMetadata();
      
      const processingTime = Date.now() - startTime;
      print(`AgentMemorySystem: ✅ Storage saved successfully (${processingTime}ms)`);
      
    } catch (error) {
      print(`AgentMemorySystem: ❌ Failed to save to storage: ${error}`);
    }
  }
  
  public loadFromStorage(): void {
    try {
      const startTime = Date.now();
      
      // Load individual components
      this.messages = this.loadComponent(this.STORAGE_KEYS.MESSAGES, []);
      this.summaryContext = this.loadComponent(this.STORAGE_KEYS.SUMMARY, null);
      this.chatHistory = this.loadComponent(this.STORAGE_KEYS.CHAT, []);
      this.diagramState = this.loadComponent(this.STORAGE_KEYS.DIAGRAM, null);
      this.currentSession = this.loadComponent(this.STORAGE_KEYS.SESSION, null);
      
      const processingTime = Date.now() - startTime;
      print(`AgentMemorySystem: ✅ Storage loaded successfully (${processingTime}ms)`);
      
    } catch (error) {
      print(`AgentMemorySystem: ❌ Failed to load from storage: ${error}`);
      this.initializeMemory();
    }
  }
  
  public clearStorage(): void {
    try {
      if (!this.persistentStorage) {
        print("AgentMemorySystem: ⚠️ No persistent storage available to clear");
        this.initializeMemory();
        return;
      }
      
      Object.values(this.STORAGE_KEYS).forEach(key => {
        if (this.persistentStorage.remove) {
          this.persistentStorage.remove(key);
        } else if (this.persistentStorage.putString) {
          this.persistentStorage.putString(key, '');
        }
      });
      
      this.initializeMemory();
      print("AgentMemorySystem: ✅ All storage cleared");
      
    } catch (error) {
      print(`AgentMemorySystem: ❌ Failed to clear storage: ${error}`);
    }
  }
  
  public getStorageStatus(): StorageStatus {
    const metadata = this.getStorageMetadata();
    return {
      currentSize: metadata.size,
      maxSize: this.MAX_STORAGE_SIZE,
      usagePercentage: (metadata.size / this.MAX_STORAGE_SIZE) * 100,
      lastUpdated: metadata.lastUpdated
    };
  }
  
  // ================================
  // Private Helper Methods
  // ================================
  
  private initializeMemory(): void {
    this.messages = [];
    this.summaryContext = null;
    this.chatHistory = [];
    this.diagramState = null;
    this.currentSession = null;
    
    // Try to load from storage
    this.loadFromStorage();
    
    print("AgentMemorySystem: ℹ️ Memory initialized");
  }
  
  private saveComponent(key: string, data: any): void {
    if (!this.persistentStorage) {
      return; // Skip saving if persistent storage is not available
    }
    
    if (data !== null && data !== undefined) {
      const serialized = JSON.stringify(data);
      const size = new TextEncoder().encode(serialized).length;
      
      if (size > this.MAX_STORAGE_SIZE / 4) { // Don't let any single component exceed 25% of storage
        print(`AgentMemorySystem: ⚠️ Component ${key} exceeds size limit, truncating...`);
        data = this.truncateComponentData(key, data);
      }
      
      try {
        if (this.persistentStorage.putString) {
          this.persistentStorage.putString(key, JSON.stringify(data));
        } else if (this.persistentStorage.put) {
          this.persistentStorage.put(key, JSON.stringify(data));
        }
      } catch (error) {
        print(`AgentMemorySystem: ⚠️ Failed to save component ${key}: ${error}`);
      }
    }
  }
  
  private loadComponent<T>(key: string, defaultValue: T): T {
    try {
      if (!this.persistentStorage) {
        return defaultValue;
      }
      
      let serialized: string | null = null;
      
      if (this.persistentStorage.getString) {
        serialized = this.persistentStorage.getString(key);
      } else if (this.persistentStorage.get) {
        serialized = this.persistentStorage.get(key);
      }
      
      if (serialized) {
        return JSON.parse(serialized) as T;
      }
    } catch (error) {
      print(`AgentMemorySystem: ⚠️ Failed to load component ${key}: ${error}`);
    }
    return defaultValue;
  }
  
  private truncateComponentData(key: string, data: any): any {
    switch (key) {
      case this.STORAGE_KEYS.MESSAGES:
        return (data as Message[]).slice(-100); // Keep last 100 messages
      case this.STORAGE_KEYS.CHAT:
        return (data as ChatMessage[]).slice(-50); // Keep last 50 chat messages
      default:
        return data;
    }
  }
  
  private updateStorageMetadata(): void {
    const metadata = {
      size: this.calculateStorageSize(),
      lastUpdated: Date.now()
    };
    
    if (this.persistentStorage.putString) {
      this.persistentStorage.putString(this.STORAGE_KEYS.METADATA, JSON.stringify(metadata));
    } else if (this.persistentStorage.put) {
      this.persistentStorage.put(this.STORAGE_KEYS.METADATA, JSON.stringify(metadata));
    }
  }
  
  private getStorageMetadata(): { size: number; lastUpdated: number } {
    try {
      if (!this.persistentStorage) {
        return { size: 0, lastUpdated: Date.now() };
      }
      
      let serialized: string | null = null;
      
      if (this.persistentStorage.getString) {
        serialized = this.persistentStorage.getString(this.STORAGE_KEYS.METADATA);
      } else if (this.persistentStorage.get) {
        serialized = this.persistentStorage.get(this.STORAGE_KEYS.METADATA);
      }
      
      if (serialized) {
        return JSON.parse(serialized);
      }
    } catch (error) {
      print(`AgentMemorySystem: ⚠️ Failed to get storage metadata: ${error}`);
    }
    
    return { size: 0, lastUpdated: Date.now() };
  }
  
  private calculateStorageSize(): number {
    let totalSize = 0;
    
    Object.values(this.STORAGE_KEYS).forEach(key => {
      try {
        let data: string | null = null;
        
        if (this.persistentStorage.getString) {
          data = this.persistentStorage.getString(key);
        } else if (this.persistentStorage.get) {
          data = this.persistentStorage.get(key);
        }
        
        if (data) {
          totalSize += new TextEncoder().encode(data).length;
        }
      } catch (error) {
        // Ignore errors for size calculation
      }
    });
    
    return totalSize;
  }
  
  private getCurrentSystemState(): SystemState {
    return {
      currentStep: 'idle',
      summaryData: this.summaryContext || {
        originalText: '',
        summaries: [],
        cardCount: 0,
        generatedAt: Date.now()
      },
      chatHistory: this.chatHistory,
      diagramState: this.diagramState || {
        nodes: [],
        connections: [],
        lastUpdateTime: Date.now(),
        analysisVersion: 1
      },
      sessionId: this.currentSession?.id || 'default',
      timestamp: Date.now()
    };
  }
  
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  private createDefaultEducationalContext(): EducationalContext {
    return {
      subject: 'General',
      level: 'college',
      learningObjectives: [],
      prerequisites: [],
      keyTerms: []
    };
  }
} 