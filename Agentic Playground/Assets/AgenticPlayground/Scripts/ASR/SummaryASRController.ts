import { SummaryStorage } from '../Storage/SummaryStorage';
import { PinchButton } from "SpectaclesInteractionKit.lspkg/Components/UI/PinchButton/PinchButton";
import Event from "SpectaclesInteractionKit.lspkg/Utils/Event";
import Tween from "LSTween.lspkg/TweenJS/Tween";
import { LSTween } from "LSTween.lspkg/LSTween";

/**
 * SummaryASRController - ASR Controller for Summary functionality
 * 
 * According to architecture diagram, this handles the simple summary flow:
 * User Speech → SummaryASRController → SummaryStorage → SummaryBridge → AISummarizer → SummaryComponent
 * 
 * This is part of the simple (non-agentic) summarization flow that accumulates text
 * for batch processing into educational summary cards.
 * 
 * Now includes mic button and activity indicator for user interaction.
 */
@component
export class SummaryASRController extends BaseScriptComponent {
  @input
  @hint("Reference to SummaryStorage component")
  private summaryStorage: SummaryStorage;
  
  @input
  @hint("Mic button for starting/stopping recording sessions")
  private micButton: PinchButton;
  
  @input
  @hint("Activity indicator visual (RenderMeshVisual)")
  private activityIndicator: RenderMeshVisual;
  
  @input
  @hint("Enable debug logging")
  private enableDebugLogging: boolean = true;
  
  @input
  @hint("Auto-start recording on awake (for continuous lecture capture)")
  private autoStartRecording: boolean = false;
  
  @input
  @hint("Maximum session duration in seconds")
  private maxSessionDuration: number = 3600; // 1 hour
  
  private asrModule: AsrModule = require("LensStudio:AsrModule");
  private isRecording: boolean = false;
  private sessionStartTime: number = 0;
  private accumulatedText: string = "";
  private currentTranscription: string = "";
  
  // Activity indicator material
  private activityMaterial: Material;
  
  // Events
  public onTextAccumulated: Event<string> = new Event<string>();
  public onSessionStarted: Event<void> = new Event<void>();
  public onSessionEnded: Event<void> = new Event<void>();
  public onMaxDurationReached: Event<void> = new Event<void>();
  
  onAwake() {
    this.createEvent("OnStartEvent").bind(this.initialize.bind(this));
    this.createEvent("UpdateEvent").bind(this.checkSessionDuration.bind(this));
    
    if (this.enableDebugLogging) {
      print("SummaryASRController: 🎤 Summary ASR Controller awakened");
    }
  }
  
  private initialize(): void {
    print(`SummaryASRController: 🚀 Initialize called - summaryStorage: ${!!this.summaryStorage}`);
    if (!this.summaryStorage) {
      print("SummaryASRController: ❌ SummaryStorage not assigned");
      return;
    } else {
      print("SummaryASRController: ✅ SummaryStorage is assigned and ready");
    }
    
    this.setupUI();
    
    if (this.autoStartRecording) {
      this.startRecordingSession();
    }
    
    if (this.enableDebugLogging) {
      print("SummaryASRController: ✅ Initialized successfully");
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
        print("SummaryASRController: 🎨 Activity indicator configured");
      }
    }
    
    // Setup mic button
    if (this.micButton) {
      this.micButton.onButtonPinched.add(() => {
        this.toggleRecordingSession();
      });
      
      if (this.enableDebugLogging) {
        print("SummaryASRController: 🎯 Mic button configured");
      }
    }
  }
  
  /**
   * Toggle recording session on/off
   */
  public toggleRecordingSession(): void {
    if (this.isRecording) {
      this.stopRecordingSession();
    } else {
      this.startRecordingSession();
    }
  }
  
  /**
   * Start recording session for summary capture
   */
  public startRecordingSession(): void {
    if (this.isRecording) {
      if (this.enableDebugLogging) {
        print("SummaryASRController: ⚠️ Already recording");
      }
      return;
    }
    
    this.isRecording = true;
    this.sessionStartTime = Date.now();
    this.accumulatedText = "";
    this.currentTranscription = "";
    
    // Start visual feedback
    this.animateActivityIndicator(true);
    
    this.asrModule.startTranscribing(this.createASROptions());
    
    this.onSessionStarted.invoke();
    
    if (this.enableDebugLogging) {
      print("SummaryASRController: 🎬 Recording session started");
    }
  }
  
  /**
   * Stop recording session and finalize summary text
   */
  public stopRecordingSession(): void {
    if (!this.isRecording) {
      if (this.enableDebugLogging) {
        print("SummaryASRController: ⚠️ Not currently recording");
      }
      return;
    }
    
    this.isRecording = false;
    this.asrModule.stopTranscribing();
    
    // Stop visual feedback
    this.animateActivityIndicator(false);
    
    // Store final accumulated text in SummaryStorage
    if (this.accumulatedText.trim().length > 0 && this.summaryStorage) {
      this.summaryStorage.storeText(this.accumulatedText);
      
      if (this.enableDebugLogging) {
        print(`SummaryASRController: 📝 Final text stored: ${this.accumulatedText.length} characters`);
      }
    }
    
    this.onSessionEnded.invoke();
    
    const sessionDuration = (Date.now() - this.sessionStartTime) / 1000;
    if (this.enableDebugLogging) {
      print(`SummaryASRController: 🏁 Recording session ended after ${sessionDuration.toFixed(1)}s`);
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
        print("SummaryASRController: 🔴 Activity indicator ON");
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
        print("SummaryASRController: ⚫ Activity indicator OFF");
      }
    }
  }
  
  /**
   * Create ASR transcription options for summary capture
   */
  private createASROptions(): any {
    const options = AsrModule.AsrTranscriptionOptions.create();
    options.mode = AsrModule.AsrMode.HighAccuracy;
    options.silenceUntilTerminationMs = 3000; // Longer silence for lecture content
    
    options.onTranscriptionUpdateEvent.add((asrOutput) => {
      this.handleTranscriptionUpdate(asrOutput);
    });
    
    options.onTranscriptionErrorEvent.add((errorCode) => {
      this.handleTranscriptionError(errorCode);
    });
    
    return options;
  }
  
  /**
   * Handle incoming transcription updates
   */
  private handleTranscriptionUpdate(asrOutput: any): void {
    print(`SummaryASRController: 🔍 handleTranscriptionUpdate - isFinal: ${asrOutput.isFinal}, text length: ${asrOutput.text ? asrOutput.text.length : 0}`);
    
    if (asrOutput.isFinal) {
      // Add completed transcription to accumulated text
      const newText = asrOutput.text.trim();
      
      print(`SummaryASRController: ✅ FINAL transcription received: "${newText.substring(0, 50)}..."`);
      
      if (newText.length > 0) {
        if (this.accumulatedText.length > 0) {
          this.accumulatedText += " " + newText;
        } else {
          this.accumulatedText = newText;
        }
        
        // Store incremental text in SummaryStorage for real-time updates
        if (this.summaryStorage) {
          print(`SummaryASRController: 💾 Calling summaryStorage.storeText with ${newText.length} chars`);
          this.summaryStorage.storeText(newText);
        } else {
          print(`SummaryASRController: ⚠️ summaryStorage is null, cannot store text!`);
        }
        
        this.onTextAccumulated.invoke(this.accumulatedText);
        
        if (this.enableDebugLogging) {
          print(`SummaryASRController: 📝 Text added: "${newText}" (Total: ${this.accumulatedText.length} chars)`);
        }
      }
      
      this.currentTranscription = "";
    } else {
      // Update current transcription in progress
      this.currentTranscription = asrOutput.text;
      
      if (this.enableDebugLogging && this.currentTranscription.length > 10) {
        print(`SummaryASRController: 🎯 Transcribing: "${this.currentTranscription.substring(0, 50)}..."`);
      }
      
      // WORKAROUND: Store partial transcriptions to SummaryStorage when they get long enough
      // This ensures the summary system gets text even if final transcriptions are delayed
      if (this.currentTranscription.length > 100 && this.summaryStorage) {
        // Check if this text is new (not already in accumulated)
        if (!this.accumulatedText.includes(this.currentTranscription)) {
          print(`SummaryASRController: 🚨 WORKAROUND - Storing partial transcription (${this.currentTranscription.length} chars)`);
          
          // Update accumulated text
          if (this.accumulatedText.length > 0) {
            this.accumulatedText += " " + this.currentTranscription;
          } else {
            this.accumulatedText = this.currentTranscription;
          }
          
          // Store to summary storage
          this.summaryStorage.storeText(this.currentTranscription);
          
          print(`SummaryASRController: ✅ Partial transcription stored. Total accumulated: ${this.accumulatedText.length} chars`);
        }
      }
    }
  }
  
  /**
   * Handle transcription errors
   */
  private handleTranscriptionError(errorCode: any): void {
    print(`SummaryASRController: ❌ Transcription error: ${errorCode}`);
    
    // Stop visual feedback on error
    this.animateActivityIndicator(false);
    
    switch (errorCode) {
      case AsrModule.AsrStatusCode.InternalError:
        print("SummaryASRController: ❌ Internal ASR error");
        break;
      case AsrModule.AsrStatusCode.Unauthenticated:
        print("SummaryASRController: ❌ ASR authentication failed");
        break;
      case AsrModule.AsrStatusCode.NoInternet:
        print("SummaryASRController: ❌ No internet connection");
        break;
      default:
        print(`SummaryASRController: ❌ Unknown error code: ${errorCode}`);
    }
    
    // Stop recording on error
    this.stopRecordingSession();
  }
  
  /**
   * Check if session has exceeded maximum duration
   */
  private checkSessionDuration(): void {
    if (!this.isRecording) return;
    
    const sessionDuration = (Date.now() - this.sessionStartTime) / 1000;
    
    if (sessionDuration > this.maxSessionDuration) {
      if (this.enableDebugLogging) {
        print(`SummaryASRController: ⏰ Maximum session duration reached (${this.maxSessionDuration}s)`);
      }
      
      this.onMaxDurationReached.invoke();
      this.stopRecordingSession();
    }
  }
  
  /**
   * Get current session status
   */
  public getSessionStatus(): { 
    isRecording: boolean; 
    duration: number; 
    textLength: number; 
    currentTranscription: string 
  } {
    const duration = this.isRecording ? (Date.now() - this.sessionStartTime) / 1000 : 0;
    
    return {
      isRecording: this.isRecording,
      duration: duration,
      textLength: this.accumulatedText.length,
      currentTranscription: this.currentTranscription
    };
  }
  
  /**
   * Force save current accumulated text
   */
  public saveCurrentText(): void {
    if (this.accumulatedText.trim().length > 0 && this.summaryStorage) {
      this.summaryStorage.storeText(this.accumulatedText);
      
      if (this.enableDebugLogging) {
        print(`SummaryASRController: 💾 Manually saved ${this.accumulatedText.length} characters`);
      }
    }
  }
  
  /**
   * Clear accumulated text (start fresh)
   */
  public clearAccumulatedText(): void {
    this.accumulatedText = "";
    this.currentTranscription = "";
    
    if (this.enableDebugLogging) {
      print("SummaryASRController: 🗑️ Accumulated text cleared");
    }
  }
  
  /**
   * Check if UI components are properly configured
   */
  public isUIReady(): boolean {
    return !!(this.micButton && this.activityIndicator);
  }
}
