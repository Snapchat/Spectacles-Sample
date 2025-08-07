import { ChatMessage } from '../Agents/AgentTypes';
import Event from "SpectaclesInteractionKit.lspkg/Utils/Event";

// ================================
// Types for Chat Storage
// ================================

interface ChatSession {
    sessionId: string;
    sessionTitle: string;
    messages: ChatMessage[];
    startTime: number;
    lastActivity: number;
    totalMessages: number;
    toolsUsed: string[];
}

interface ChatStorageData {
    currentSession: ChatSession | null;
    sessions: ChatSession[];
    sessionCounter: number;
    lastSaved: number;
}

/**
 * ChatStorage - Storage for agentic chat conversation history
 * 
 * According to architecture diagram, this handles the agentic chat flow:
 * ChatASRController → AgentOrchestrator → Tools → ChatStorage → ChatBridge → ChatComponent
 * 
 * This stores conversation history from the agent system that uses tools and maintains
 * context across interactions. The user's default option is to save chat/diagram flow 
 * sessions with an option to delete memory.
 */
@component
export class ChatStorage extends BaseScriptComponent {
    
    // ================================
    // Inspector Configuration
    // ================================
    
    @input
    @hint("Enable automatic chat storage")
    public enableStorage: boolean = true;
    
    @input
    @hint("Enable debug logging for storage operations")
    public enableDebugLogging: boolean = false;
    
    @input
    @hint("Maximum number of chat sessions to store")
    @widget(new SliderWidget(1, 50, 1))
    public maxStoredSessions: number = 10;
    
    @input
    @hint("Maximum messages per session before archiving")
    @widget(new SliderWidget(10, 1000, 10))
    public maxMessagesPerSession: number = 200;
    
    @input
    @hint("Default option to save sessions (per diagram spec)")
    public defaultSaveSessions: boolean = true;
    
    // ================================
    // State Management
    // ================================
    
    private isInitialized: boolean = false;
    private currentChatSession: ChatSession | null = null;
    private storedSessions: Map<string, ChatSession> = new Map();
    private sessionCounter: number = 0;
    private storageKey: string = "agentic_chat_storage";
    
    // ================================
    // Events
    // ================================
    
    public onMessageAdded: Event<ChatMessage> = new Event<ChatMessage>();
    public onSessionStarted: Event<ChatSession> = new Event<ChatSession>();
    public onSessionEnded: Event<ChatSession> = new Event<ChatSession>();
    public onSessionArchived: Event<string> = new Event<string>();
    public onStorageError: Event<string> = new Event<string>();
    
    // ================================
    // Lifecycle Methods
    // ================================
    
    onAwake() {
        this.initializeStorage();
    }
    
    // ================================
    // Public Interface - Session Management
    // ================================
    
    /**
     * Start a new chat session
     */
    public startNewSession(title?: string): ChatSession {
        // Archive current session if it exists
        if (this.currentChatSession) {
            this.archiveCurrentSession();
        }
        
        this.sessionCounter++;
        const sessionId = `chat_session_${Date.now()}_${this.sessionCounter}`;
        const sessionTitle = title || `Chat Session ${this.sessionCounter}`;
        
        this.currentChatSession = {
            sessionId: sessionId,
            sessionTitle: sessionTitle,
            messages: [],
            startTime: Date.now(),
            lastActivity: Date.now(),
            totalMessages: 0,
            toolsUsed: []
        };
        
        this.onSessionStarted.invoke(this.currentChatSession);
        
        if (this.enableDebugLogging) {
            print(`ChatStorage: 🎬 Started new session: "${sessionTitle}" (${sessionId})`);
        }
        
        this.saveToStorage();
        return this.currentChatSession;
    }
    
    /**
     * End current session and archive it
     */
    public endCurrentSession(): ChatSession | null {
        if (!this.currentChatSession) {
            if (this.enableDebugLogging) {
                print("ChatStorage: ⚠️ No active session to end");
            }
            return null;
        }
        
        const session = this.archiveCurrentSession();
        this.onSessionEnded.invoke(session);
        
        if (this.enableDebugLogging) {
            print(`ChatStorage: 🏁 Session ended: "${session.sessionTitle}" with ${session.totalMessages} messages`);
        }
        
        return session;
    }
    
    /**
     * Get current active session
     */
    public getCurrentSession(): ChatSession | null {
        return this.currentChatSession;
    }
    
    /**
     * Get all stored sessions
     */
    public getAllSessions(): ChatSession[] {
        return Array.from(this.storedSessions.values())
            .sort((a, b) => b.lastActivity - a.lastActivity);
    }
    
    /**
     * Get session by ID
     */
    public getSessionById(sessionId: string): ChatSession | null {
        return this.storedSessions.get(sessionId) || null;
    }
    
    // ================================
    // Public Interface - Message Management
    // ================================
    
    /**
     * Add message to current session
     * This is called by ChatBridge when messages are processed
     */
    public addMessage(message: ChatMessage): void {
        if (!this.currentChatSession) {
            // Auto-start session if none exists
            this.startNewSession();
        }
        
        // Add message to current session
        this.currentChatSession.messages.push(message);
        this.currentChatSession.totalMessages++;
        this.currentChatSession.lastActivity = Date.now();
        
        // Track tools used
        if (message.relatedTools && message.relatedTools.length > 0) {
            message.relatedTools.forEach(tool => {
                if (!this.currentChatSession.toolsUsed.includes(tool)) {
                    this.currentChatSession.toolsUsed.push(tool);
                }
            });
        }
        
        this.onMessageAdded.invoke(message);
        
        if (this.enableDebugLogging) {
            print(`ChatStorage: 💬 Message added: ${message.type} - "${message.content.substring(0, 50)}..."`);
        }
        
        // Check if session needs archiving due to size
        if (this.currentChatSession.totalMessages >= this.maxMessagesPerSession) {
            if (this.enableDebugLogging) {
                print(`ChatStorage: 📦 Session reached max messages (${this.maxMessagesPerSession}), archiving...`);
            }
            this.archiveCurrentSession();
        }
        
        this.saveToStorage();
    }
    
    /**
     * Get conversation history for context (recent messages)
     */
    public getConversationHistory(maxMessages: number = 20): ChatMessage[] {
        if (!this.currentChatSession) {
            return [];
        }
        
        return this.currentChatSession.messages.slice(-maxMessages);
    }
    
    /**
     * Get full conversation from current session
     */
    public getCurrentConversation(): ChatMessage[] {
        if (!this.currentChatSession) {
            return [];
        }
        
        return [...this.currentChatSession.messages];
    }
    
    // ================================
    // Memory Management (Checkbox to Delete Memory)
    // ================================
    
    /**
     * Clear all memory - implements the "checkbox to delete memory" from diagram
     */
    public clearAllMemory(): void {
        this.currentChatSession = null;
        this.storedSessions.clear();
        this.sessionCounter = 0;
        
        this.saveToStorage();
        
        if (this.enableDebugLogging) {
            print("ChatStorage: 🗑️ All chat memory cleared (user requested memory deletion)");
        }
    }
    
    /**
     * Clear specific session
     */
    public clearSession(sessionId: string): boolean {
        if (this.storedSessions.has(sessionId)) {
            this.storedSessions.delete(sessionId);
            this.saveToStorage();
            
            if (this.enableDebugLogging) {
                print(`ChatStorage: 🗑️ Session ${sessionId} cleared`);
            }
            return true;
        }
        return false;
    }
    
    // ================================
    // Private Methods
    // ================================
    
    private archiveCurrentSession(): ChatSession | null {
        if (!this.currentChatSession || !this.defaultSaveSessions) {
            return null;
        }
        
        // Store in archived sessions
        this.storedSessions.set(this.currentChatSession.sessionId, { ...this.currentChatSession });
        
        // Cleanup old sessions
        this.cleanupOldSessions();
        
        const archived = this.currentChatSession;
        this.onSessionArchived.invoke(archived.sessionId);
        
        // Clear current session
        this.currentChatSession = null;
        
        this.saveToStorage();
        
        if (this.enableDebugLogging) {
            print(`ChatStorage: 📦 Session archived: "${archived.sessionTitle}"`);
        }
        
        return archived;
    }
    
    private cleanupOldSessions(): void {
        if (this.storedSessions.size <= this.maxStoredSessions) {
            return;
        }
        
        // Sort by last activity and remove oldest
        const sessionsArray = Array.from(this.storedSessions.entries())
            .sort((a, b) => a[1].lastActivity - b[1].lastActivity);
        
        const toRemove = sessionsArray.slice(0, sessionsArray.length - this.maxStoredSessions);
        
        toRemove.forEach(([sessionId, _]) => {
            this.storedSessions.delete(sessionId);
        });
        
        if (this.enableDebugLogging && toRemove.length > 0) {
            print(`ChatStorage: 🗑️ Cleaned up ${toRemove.length} old sessions`);
        }
    }
    
    // ================================
    // Storage Management
    // ================================
    
    private initializeStorage(): void {
        try {
            this.loadFromStorage();
            this.isInitialized = true;
            
            if (this.enableDebugLogging) {
                print(`ChatStorage: ✅ Initialized with ${this.storedSessions.size} stored sessions`);
                if (this.currentChatSession) {
                    print(`ChatStorage: 📋 Active session: "${this.currentChatSession.sessionTitle}"`);
                }
            }
        } catch (error) {
            if (this.enableDebugLogging) {
                print(`ChatStorage: ❌ Initialization error: ${error}`);
            }
            this.onStorageError.invoke(`Initialization failed: ${error}`);
        }
    }
    
    private saveToStorage(): void {
        if (!this.enableStorage) {
            return;
        }
        
        try {
            const storageData: ChatStorageData = {
                currentSession: this.currentChatSession,
                sessions: Array.from(this.storedSessions.values()),
                sessionCounter: this.sessionCounter,
                lastSaved: Date.now()
            };
            
            // Use Snap's persistent storage
            if (global.persistentStorageSystem) {
                const store = global.persistentStorageSystem.store;
                store.putString(this.storageKey, JSON.stringify(storageData));
                
                if (this.enableDebugLogging) {
                    print("ChatStorage: 💾 Data saved to persistent storage");
                }
            }
        } catch (error) {
            if (this.enableDebugLogging) {
                print(`ChatStorage: ❌ Save error: ${error}`);
            }
            this.onStorageError.invoke(`Save failed: ${error}`);
        }
    }
    
    private loadFromStorage(): void {
        if (!this.enableStorage) {
            return;
        }
        
        try {
            if (global.persistentStorageSystem) {
                const store = global.persistentStorageSystem.store;
                const storedDataString = store.getString(this.storageKey);
                
                if (storedDataString && storedDataString.length > 0) {
                    const storageData: ChatStorageData = JSON.parse(storedDataString);
                    
                    this.currentChatSession = storageData.currentSession;
                    this.sessionCounter = storageData.sessionCounter || 0;
                    
                    // Restore sessions map
                    this.storedSessions.clear();
                    if (storageData.sessions) {
                        storageData.sessions.forEach(session => {
                            this.storedSessions.set(session.sessionId, session);
                        });
                    }
                    
                    if (this.enableDebugLogging) {
                        print(`ChatStorage: 📖 Loaded ${this.storedSessions.size} sessions from storage`);
                    }
                }
            }
        } catch (error) {
            if (this.enableDebugLogging) {
                print(`ChatStorage: ❌ Load error: ${error}`);
            }
            this.onStorageError.invoke(`Load failed: ${error}`);
        }
    }
    
    // ================================
    // Utility Methods
    // ================================
    
    public getStorageStats(): { 
        totalSessions: number; 
        currentSessionMessages: number; 
        hasActiveSession: boolean;
        totalStoredMessages: number;
    } {
        let totalMessages = 0;
        this.storedSessions.forEach(session => {
            totalMessages += session.totalMessages;
        });
        
        if (this.currentChatSession) {
            totalMessages += this.currentChatSession.totalMessages;
        }
        
        return {
            totalSessions: this.storedSessions.size,
            currentSessionMessages: this.currentChatSession?.totalMessages || 0,
            hasActiveSession: this.currentChatSession !== null,
            totalStoredMessages: totalMessages
        };
    }
} 