import { AgentOrchestrator } from '../Agents/AgentOrchestrator';
import { ChatStorage } from '../Storage/ChatStorage';
import { ChatMessage } from '../Agents/AgentTypes';
import { PinchButton } from "SpectaclesInteractionKit.lspkg/Components/UI/PinchButton/PinchButton";
import Event from "SpectaclesInteractionKit.lspkg/Utils/Event";
import Tween from "LSTween.lspkg/TweenJS/Tween";
import { LSTween } from "LSTween.lspkg/LSTween";

/**
 * ChatASRController - ASR Controller for Chat functionality  
 * 
 * According to architecture diagram, this handles the agentic chat flow:
 * User Speech → ChatASRController → AgentOrchestrator → ToolExecutor → Tools → ChatStorage → ChatBridge → ChatComponent
 * 
 * This connects voice input directly to the agentic system for real-time
 * intelligent conversation with tool routing capabilities.
 * 
 * Now includes mic button, activity indicator, and direct ChatStorage integration for architectural consistency.
 */
@component
export class ChatASRController extends BaseScriptComponent {
  @input
  @hint("Reference to AgentOrchestrator component")
  private agentOrchestrator: AgentOrchestrator;
  
  @input
  @hint("Reference to ChatStorage component for storing conversation history")
  private chatStorage: ChatStorage;
  
  @input
  @hint("Mic button for starting/stopping chat sessions")
  private micButton: PinchButton;
  
  @input
  @hint("Activity indicator visual (RenderMeshVisual)")
  private activityIndicator: RenderMeshVisual;
  
  @input
  @hint("Enable debug logging")
  private enableDebugLogging: boolean = true;
  
  @input
  @hint("Auto-timeout for chat sessions (seconds)")
  private sessionTimeout: number = 300; // 5 minutes
  
  @input
  @hint("Enable continuous listening mode")
  private continuousListening: boolean = false;
  
  private asrModule: AsrModule = require("LensStudio:AsrModule");
  private isRecording: boolean = false;
  private isProcessingQuery: boolean = false;
  private lastActivityTime: number = 0;
  private sessionActive: boolean = false;
  
  // Activity indicator material
  private activityMaterial: Material;
  
  // Events
  public onQueryReceived: Event<string> = new Event<string>();
  public onQueryProcessed: Event<{ query: string; response: string }> = new Event();
  public onSessionStarted: Event<void> = new Event<void>();
  public onSessionEnded: Event<void> = new Event<void>();
  public onSessionTimeout: Event<void> = new Event<void>();
  
  onAwake() {
    this.createEvent("OnStartEvent").bind(this.initialize.bind(this));
    this.createEvent("UpdateEvent").bind(this.checkSessionTimeout.bind(this));
    
    if (this.enableDebugLogging) {
      print("ChatASRController: 🎤 Chat ASR Controller awakened");
    }
  }
  
  private initialize(): void {
    if (!this.agentOrchestrator) {
      print("ChatASRController: ❌ AgentOrchestrator not assigned");
      return;
    }
    
    if (!this.chatStorage) {
      print("ChatASRController: ❌ ChatStorage not assigned");
      return;
    }
    
    this.setupUI();
    
    if (this.continuousListening) {
      this.startChatSession();
    }
    
    if (this.enableDebugLogging) {
      print("ChatASRController: ✅ Initialized and connected to AgentOrchestrator + ChatStorage");
    }
  }
  
  /**
   * Setup UI components (button and activity indicator)
   */
  private setupUI(): void {
    // Setup activity indicator
    if (this.activityIndicator) {
      this.activityMaterial = this.activityIndicator.mainMaterial.clone();
      this.activityIndicator.clearMaterials();
      this.activityIndicator.mainMaterial = this.activityMaterial;
      this.activityMaterial.mainPass.in_out = 0;
      
      if (this.enableDebugLogging) {
        print("ChatASRController: 🎨 Activity indicator configured");
      }
    }
    
    // Setup mic button
    if (this.micButton) {
      this.micButton.onButtonPinched.add(() => {
        this.handleMicButtonPress();
      });
      
      if (this.enableDebugLogging) {
        print("ChatASRController: 🎯 Mic button configured");
      }
    }
  }
  
  /**
   * Handle mic button press - start session and begin voice query
   */
  private async handleMicButtonPress(): Promise<void> {
    if (this.isProcessingQuery) {
      if (this.enableDebugLogging) {
        print("ChatASRController: ⏳ Already processing a query");
      }
      return;
    }
    
    if (!this.sessionActive) {
      this.startChatSession();
    }
    
    try {
      const response = await this.processVoiceQuery();
      
      if (this.enableDebugLogging) {
        print(`ChatASRController: 💬 Voice interaction completed: "${response.substring(0, 50)}..."`);
      }
    } catch (error) {
      if (this.enableDebugLogging) {
        print(`ChatASRController: ❌ Voice interaction failed: ${error}`);
      }
    }
  }
  
  /**
   * Start a new chat session
   */
  public startChatSession(): void {
    if (this.sessionActive) {
      if (this.enableDebugLogging) {
        print("ChatASRController: ⚠️ Chat session already active");
      }
      return;
    }
    
    this.sessionActive = true;
    this.lastActivityTime = Date.now();
    
    // Start chat session in storage
    if (this.chatStorage) {
      this.chatStorage.startNewSession(`Chat Session ${Date.now()}`);
    }
    
    this.onSessionStarted.invoke();
    
    if (this.enableDebugLogging) {
      print("ChatASRController: 🎬 Chat session started");
    }
  }
  
  /**
   * End current chat session
   */
  public endChatSession(): void {
    if (!this.sessionActive) {
      return;
    }
    
    this.sessionActive = false;
    
    if (this.isRecording) {
      this.stopListening();
    }
    
    // End session in storage
    if (this.chatStorage) {
      this.chatStorage.endCurrentSession();
    }
    
    this.onSessionEnded.invoke();
    
    if (this.enableDebugLogging) {
      const duration = (Date.now() - this.lastActivityTime) / 1000;
      print(`ChatASRController: 🏁 Chat session ended after ${duration.toFixed(1)}s`);
    }
  }
  
  /**
   * Start listening for voice input 
   */
  public startListening(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this.isRecording) {
        reject("Already recording");
        return;
      }
      
      if (!this.sessionActive) {
        this.startChatSession();
      }
      
      this.isRecording = true;
      this.lastActivityTime = Date.now();
      
      // Start visual feedback
      this.animateActivityIndicator(true);
      
      const asrOptions = this.createASROptions(resolve, reject);
      this.asrModule.startTranscribing(asrOptions);
      
      if (this.enableDebugLogging) {
        print("ChatASRController: 🎯 Started listening for voice input");
      }
    });
  }
  
  /**
   * Stop listening
   */
  public stopListening(): void {
    if (!this.isRecording) {
      return;
    }
    
    this.isRecording = false;
    this.asrModule.stopTranscribing();
    
    // Stop visual feedback
    this.animateActivityIndicator(false);
    
    if (this.enableDebugLogging) {
      print("ChatASRController: ⏹️ Stopped listening");
    }
  }
  
  /**
   * Animate activity indicator on/off
   * @param on Whether to turn indicator on or off
   */
  private animateActivityIndicator(on: boolean): void {
    if (!this.activityMaterial) return;
    
    if (on) {
      // Fade in indicator
      LSTween.rawTween(250)
        .onUpdate((data) => {
          let percent = data.t as number;
          this.activityMaterial.mainPass.in_out = percent;
        })
        .start();
        
      if (this.enableDebugLogging) {
        print("ChatASRController: 🔴 Activity indicator ON");
      }
    } else {
      // Fade out indicator
      LSTween.rawTween(250)
        .onUpdate((data) => {
          let percent = 1 - (data.t as number);
          this.activityMaterial.mainPass.in_out = percent;
        })
        .start();
        
      if (this.enableDebugLogging) {
        print("ChatASRController: ⚫ Activity indicator OFF");
      }
    }
  }
  
  /**
   * Process voice query through AgentOrchestrator
   * This is the core integration point with the agentic system
   */
  public async processVoiceQuery(): Promise<string> {
    if (this.isProcessingQuery) {
      return "I'm still processing your previous question. Please wait...";
    }
    
    try {
      const query = await this.startListening();
      return await this.sendQueryToOrchestrator(query);
    } catch (error) {
      if (this.enableDebugLogging) {
        print(`ChatASRController: ❌ Voice query failed: ${error}`);
      }
      return "I couldn't understand that. Could you try again?";
    }
  }
  
  /**
   * Send query to AgentOrchestrator - Core architecture integration
   */
  private async sendQueryToOrchestrator(query: string): Promise<string> {
    if (!query || query.trim().length === 0) {
      return "I didn't catch that. Could you repeat your question?";
    }
    
    this.isProcessingQuery = true;
    this.onQueryReceived.invoke(query);
    
    try {
      if (this.enableDebugLogging) {
        print(`ChatASRController: 🎯 Routing query to AgentOrchestrator: "${query}"`);
      }
      
      // 🔥 FIX: Remove duplicate message creation
      // AgentOrchestrator already stores messages in memory via storeConversation()
      // ChatBridge handles UI display via onQueryProcessed event
      // This prevents double chat cards for each participant
      
      // 🔥 CORE ARCHITECTURE INTEGRATION: Send to AgentOrchestrator
      // This triggers: Orchestrator → ToolRouter → Tools → Bridges → UI
      // Messages are automatically stored and displayed through the proper flow
      const response = await this.agentOrchestrator.processUserQuery(query);
      
      this.onQueryProcessed.invoke({ query, response });
      
      if (this.enableDebugLogging) {
        print(`ChatASRController: ✅ Orchestrator response: "${response.substring(0, 100)}..."`);
        print("ChatASRController: 🔗 Messages handled by AgentOrchestrator → ChatBridge flow");
      }
      
      return response;
      
    } catch (error) {
      const errorMessage = `Sorry, I encountered an error: ${error}`;
      
      if (this.enableDebugLogging) {
        print(`ChatASRController: ❌ Orchestrator error: ${error}`);
      }
      
      return errorMessage;
    } finally {
      this.isProcessingQuery = false;
      this.lastActivityTime = Date.now();
    }
  }
  
  /**
   * Create ASR options for chat interaction
   */
  private createASROptions(resolve: (value: string) => void, reject: (reason?: any) => void): any {
    const options = AsrModule.AsrTranscriptionOptions.create();
    options.mode = AsrModule.AsrMode.HighAccuracy;
    options.silenceUntilTerminationMs = 2000; // Shorter silence for chat
    
    options.onTranscriptionUpdateEvent.add((asrOutput) => {
      if (asrOutput.isFinal) {
        this.isRecording = false;
        this.animateActivityIndicator(false);
        
        const query = asrOutput.text.trim();
        
        if (query.length > 0) {
          resolve(query);
        } else {
          reject("Empty transcription");
        }
      } else {
        // Show real-time transcription progress
        if (this.enableDebugLogging && asrOutput.text.length > 5) {
          print(`ChatASRController: 🎯 Transcribing: "${asrOutput.text.substring(0, 30)}..."`);
        }
      }
    });
    
    options.onTranscriptionErrorEvent.add((errorCode) => {
      this.isRecording = false;
      this.animateActivityIndicator(false);
      this.handleTranscriptionError(errorCode);
      reject(`Transcription error: ${errorCode}`);
    });
    
    return options;
  }
  
  /**
   * Handle transcription errors
   */
  private handleTranscriptionError(errorCode: any): void {
    print(`ChatASRController: ❌ Transcription error: ${errorCode}`);
    
    // Stop visual feedback on error
    this.animateActivityIndicator(false);
    
    switch (errorCode) {
      case AsrModule.AsrStatusCode.InternalError:
        print("ChatASRController: ❌ Internal ASR error");
        break;
      case AsrModule.AsrStatusCode.Unauthenticated:
        print("ChatASRController: ❌ ASR authentication failed");
        break;
      case AsrModule.AsrStatusCode.NoInternet:
        print("ChatASRController: ❌ No internet connection");
        break;
      default:
        print(`ChatASRController: ❌ Unknown error code: ${errorCode}`);
    }
  }
  
  /**
   * Check for session timeout
   */
  private checkSessionTimeout(): void {
    if (!this.sessionActive) return;
    
    const timeSinceActivity = (Date.now() - this.lastActivityTime) / 1000;
    
    if (timeSinceActivity > this.sessionTimeout) {
      if (this.enableDebugLogging) {
        print(`ChatASRController: ⏰ Session timeout after ${this.sessionTimeout}s of inactivity`);
      }
      
      this.onSessionTimeout.invoke();
      this.endChatSession();
    }
  }
  
  /**
   * Extend session activity (reset timeout)
   */
  public extendSession(): void {
    if (this.sessionActive) {
      this.lastActivityTime = Date.now();
      
      if (this.enableDebugLogging) {
        print("ChatASRController: 🔄 Session activity extended");
      }
    }
  }
  
  /**
   * Get current session status
   */
  public getSessionStatus(): {
    active: boolean;
    isRecording: boolean;
    isProcessing: boolean;
    timeSinceActivity: number;
  } {
    const timeSinceActivity = this.sessionActive ? (Date.now() - this.lastActivityTime) / 1000 : 0;
    
    return {
      active: this.sessionActive,
      isRecording: this.isRecording,
      isProcessing: this.isProcessingQuery,
      timeSinceActivity: timeSinceActivity
    };
  }
  
  /**
   * Check if system is ready for voice input
   */
  public isReady(): boolean {
    return this.agentOrchestrator && 
           this.agentOrchestrator.isSystemReady() && 
           !this.isProcessingQuery;
  }
  
  /**
   * Check if UI components are properly configured
   */
  public isUIReady(): boolean {
    return !!(this.micButton && this.activityIndicator);
  }
  
  /**
   * Get storage integration status
   */
  public getStorageStatus(): {
    hasStorage: boolean;
    currentSession: any;
    totalMessages: number;
  } {
    const storageStats = this.chatStorage?.getStorageStats();
    
    return {
      hasStorage: !!this.chatStorage,
      currentSession: this.chatStorage?.getCurrentSession(),
      totalMessages: storageStats?.totalStoredMessages || 0
    };
  }
}
