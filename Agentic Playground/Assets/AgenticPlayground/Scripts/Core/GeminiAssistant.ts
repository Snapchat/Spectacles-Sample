import {
  Gemini,
  GeminiLiveWebsocket,
} from "RemoteServiceGateway.lspkg/HostedExternal/Gemini";

import { AudioProcessor } from "RemoteServiceGateway.lspkg/Helpers/AudioProcessor";
import { DynamicAudioOutput } from "RemoteServiceGateway.lspkg/Helpers/DynamicAudioOutput";
import Event from "SpectaclesInteractionKit.lspkg/Utils/Event";
import { GeminiTypes } from "RemoteServiceGateway.lspkg/HostedExternal/GeminiTypes";
import { MicrophoneRecorder } from "RemoteServiceGateway.lspkg/Helpers/MicrophoneRecorder";
import { VideoController } from "RemoteServiceGateway.lspkg/Helpers/VideoController";
import { setTimeout } from "SpectaclesInteractionKit.lspkg/Utils/FunctionTimingUtils";

@component
export class GeminiAssistant extends BaseScriptComponent {
  @ui.separator
  @ui.label(
    "Example of connecting to the Gemini Live API. Change various settings in the inspector to customize!"
  )
  @ui.separator
  @ui.separator
  @ui.group_start("Setup")
  @input
  private websocketRequirementsObj: SceneObject;
  @input private dynamicAudioOutput: DynamicAudioOutput;
  @input private microphoneRecorder: MicrophoneRecorder;
  @ui.group_end
  @ui.separator
  @ui.group_start("Inputs")
  private readonly instructions: string = `You are an educational AI tutor. Provide clear, accurate explanations of educational concepts. Keep responses under 300 characters. Be encouraging and supportive.`;
  @input private haveVideoInput: boolean = true;
  @ui.group_end
  @ui.separator
  @ui.group_start("Outputs")
  @ui.label(
    '<span style="color: yellow;">⚠️ To prevent audio feedback loop in Lens Studio Editor, use headphones or manage your microphone input.</span>'
  )
  @input
  private haveAudioOutput: boolean = true;
  @input
  @showIf("haveAudioOutput", true)
  @widget(
    new ComboBoxWidget([
      new ComboBoxItem("Puck", "Puck"),
      new ComboBoxItem("Charon", "Charon"),
      new ComboBoxItem("Kore", "Kore"),
      new ComboBoxItem("Fenrir", "Fenrir"),
      new ComboBoxItem("Aoede", "Aoede"),
      new ComboBoxItem("Leda", "Leda"),
      new ComboBoxItem("Orus", "Orus"),
      new ComboBoxItem("Zephyr", "Zephyr"),
    ])
  )
  private voice: string = "Puck";
  @ui.group_end
  @ui.separator
  private audioProcessor: AudioProcessor = new AudioProcessor();
  private videoController: VideoController = new VideoController(
    1500,
    CompressionQuality.HighQuality,
    EncodingType.Jpg
  );
  private GeminiLive: GeminiLiveWebsocket;

  public updateTextEvent: Event<{ text: string; completed: boolean }> =
    new Event<{ text: string; completed: boolean }>();

  public functionCallEvent: Event<{
    name: string;
    args: any;
    callId?: string;
  }> = new Event<{
    name: string;
    args: any;
  }>();

  onAwake() {
    print("GeminiAssistant: 🎯 Assistant awakening");
    // Initialize Gemini Live session on start to ensure it's available
    this.createEvent("OnStartEvent").bind(() => {
      if (this.websocketRequirementsObj && this.dynamicAudioOutput && this.microphoneRecorder) {
        print("GeminiAssistant: 🚀 Initializing Live session with required components");
        this.createGeminiLiveSession();
      } else {
        print("GeminiAssistant: ⚠️ Missing required components for Live session");
        print(`  - websocketRequirementsObj: ${this.websocketRequirementsObj ? "✅" : "❌"}`);
        print(`  - dynamicAudioOutput: ${this.dynamicAudioOutput ? "✅" : "❌"}`);
        print(`  - microphoneRecorder: ${this.microphoneRecorder ? "✅" : "❌"}`);
      }
    });
  }

  createGeminiLiveSession() {
    this.websocketRequirementsObj.enabled = true;
    this.dynamicAudioOutput.initialize(24000);
    this.microphoneRecorder.setSampleRate(16000);

    // Display internet connection status
    let internetStatus = global.deviceInfoSystem.isInternetAvailable()
      ? "Websocket connected"
      : "No internet";

    this.updateTextEvent.invoke({ text: internetStatus, completed: true });

    global.deviceInfoSystem.onInternetStatusChanged.add((args) => {
      internetStatus = args.isInternetAvailable
        ? "Reconnected to internete"
        : "No internet";

      this.updateTextEvent.invoke({ text: internetStatus, completed: true });
    });

    this.GeminiLive = Gemini.liveConnect();

    this.GeminiLive.onOpen.add((event) => {
      print("Connection opened");
      this.sessionSetup();
    });

    let completedTextDisplay = true;

    this.GeminiLive.onMessage.add((message) => {
      print("Received message: " + JSON.stringify(message));
      // Setup complete, begin sending data
      if (message.setupComplete) {
        message = message as GeminiTypes.Live.SetupCompleteEvent;
        print("Setup complete");
        this.setupInputs();
      }

      if (message?.serverContent) {
        message = message as GeminiTypes.Live.ServerContentEvent;
        // Playback the audio response
        if (
          message?.serverContent?.modelTurn?.parts?.[0]?.inlineData?.mimeType?.startsWith(
            "audio/pcm"
          )
        ) {
          let b64Audio =
            message.serverContent.modelTurn.parts[0].inlineData.data;
          let audio = Base64.decode(b64Audio);
          this.dynamicAudioOutput.addAudioFrame(audio);
        }
        if (message.serverContent.interrupted) {
          this.dynamicAudioOutput.interruptAudioOutput();
        }
        // Show output transcription
        else if (message?.serverContent?.outputTranscription?.text) {
          if (completedTextDisplay) {
            this.updateTextEvent.invoke({
              text: message.serverContent.outputTranscription?.text,
              completed: true,
            });
          } else {
            this.updateTextEvent.invoke({
              text: message.serverContent.outputTranscription?.text,
              completed: false,
            });
          }
          completedTextDisplay = false;
        }

        // Show text response
        else if (message?.serverContent?.modelTurn?.parts?.[0]?.text) {
          if (completedTextDisplay) {
            this.updateTextEvent.invoke({
              text: message.serverContent.modelTurn.parts[0].text,
              completed: true,
            });
          } else {
            this.updateTextEvent.invoke({
              text: message.serverContent.modelTurn.parts[0].text,
              completed: false,
            });
          }
          completedTextDisplay = false;
        }

        // Determine if the response is complete
        else if (message?.serverContent?.turnComplete) {
          completedTextDisplay = true;
        }
      }

      if (message.toolCall) {
        message = message as GeminiTypes.Live.ToolCallEvent;
        print(JSON.stringify(message));
        // Handle tool calls
        message.toolCall.functionCalls.forEach((functionCall) => {
          this.functionCallEvent.invoke({
            name: functionCall.name,
            args: functionCall.args,
          });
        });
      }
    });

    this.GeminiLive.onError.add((event) => {
      print("Error: " + event);
    });

    this.GeminiLive.onClose.add((event) => {
      print("Connection closed: " + event.reason);
    });
  }

  public streamData(stream: boolean) {
    print(`GeminiAssistant: streamData called with stream=${stream}`);
    
    if (stream) {
      // Start video recording for spatial awareness if enabled
      if (this.haveVideoInput) {
        this.videoController.startRecording();
        print("GeminiAssistant: 📹 Video recording started for spatial awareness");
      }
      
      // Note: Microphone recording is handled by the orchestrator system
      // to prevent conflicts between multiple voice input systems
      print("GeminiAssistant: 🎤 Voice input managed by orchestrator (no conflicts)");
    } else {
      // Stop video recording when not streaming
      if (this.haveVideoInput) {
        this.videoController.stopRecording();
        print("GeminiAssistant: 📹 Video recording stopped");
      }
    }
  }

  private setupInputs() {
    this.audioProcessor.onAudioChunkReady.add((encodedAudioChunk) => {
      const message = {
        realtime_input: {
          media_chunks: [
            {
              mime_type: "audio/pcm",
              data: encodedAudioChunk,
            },
          ],
        },
      } as GeminiTypes.Live.RealtimeInput;
      this.GeminiLive.send(message);
    });

    // Configure the microphone
    this.microphoneRecorder.onAudioFrame.add((audioFrame) => {
      this.audioProcessor.processFrame(audioFrame);
    });

    if (this.haveVideoInput) {
      // Configure the video controller
      this.videoController.onEncodedFrame.add((encodedFrame) => {
        const message = {
          realtime_input: {
            media_chunks: [
              {
                mime_type: "image/jpeg",
                data: encodedFrame,
              },
            ],
          },
        } as GeminiTypes.Live.RealtimeInput;
        this.GeminiLive.send(message);
      });
    }
  }

  public sendFunctionCallUpdate(functionName: string, args: string): void {
    const messageToSend = {
      tool_response: {
        function_responses: [
          {
            name: functionName,
            response: { content: args },
          },
        ],
      },
    } as GeminiTypes.Live.ToolResponse;

    this.GeminiLive.send(messageToSend);
  }

  /**
   * Send text message directly to Gemini session for text-only generation
   * This bypasses voice streaming and sends conversation messages directly
   */
  public sendTextMessage(content: string): void {
    if (!this.GeminiLive) {
      print("GeminiAssistant: ⚠️ Live session not initialized");
      return;
    }

    print(`GeminiAssistant: 📝 Sending text message: "${content.substring(0, 100)}..."`);
    
    // Send user message to conversation
    const messageToSend = {
      client_content: {
        turns: [
          {
            role: "user",
            parts: [
              {
                text: content,
              },
            ],
          },
        ],
        turn_complete: true,
      },
    } as GeminiTypes.Live.ClientContent;

    this.GeminiLive.send(messageToSend);
    
    print("GeminiAssistant: ✅ Text message sent, waiting for AI response");
  }

  /**
   * Send image data along with text message to Gemini Live session
   */
  public sendImageMessage(imageData: string): void {
    if (!this.GeminiLive) {
      print("GeminiAssistant: ⚠️ Live session not initialized");
      return;
    }

    print("GeminiAssistant: 📷 Sending image data to Live session");
    
    // Send image data using realtime_input format
    const imageMessage = {
      realtime_input: {
        media_chunks: [
          {
            mime_type: "image/jpeg",
            data: imageData,
          },
        ],
      },
    };

    this.GeminiLive.send(imageMessage);
    
    print("GeminiAssistant: ✅ Image data sent to Live session");
  }

  private sessionSetup() {
    print("GeminiAssistant: 🔧 Setting up Gemini Live session...");
    
    // 🔥 FIX: Use AUDIO only like the working standalone example
    let generationConfig = {
      responseModalities: ["AUDIO"],
      temperature: 1,
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: {
            voiceName: this.voice,
          },
        },
      },
    } as GeminiTypes.Common.GenerationConfig;

    // If audio output is disabled, use text-only config
    if (!this.haveAudioOutput) {
      generationConfig = {
        responseModalities: ["TEXT"],
      };
    }

    // Define the Snap3D tool (exact copy from working template)
    const tools = [
      {
        function_declarations: [
          {
            name: "Snap3D",
            description: "Generates a 3D model based on a text prompt",
            parameters: {
              type: "object",
              properties: {
                prompt: {
                  type: "string",
                  description:
                    "The text prompt to generate a 3D model from. Cartoonish styles work best. Use 'full body' when generating characters.",
                },
              },
              required: ["prompt"],
            },
          },
        ],
      },
    ];

    // Send the session setup message (exact copy from working template)
    let modelUri = `models/gemini-2.0-flash-live-preview-04-09`;
    const sessionSetupMessage = {
      setup: {
        model: modelUri,
        generation_config: generationConfig,
        system_instruction: {
          parts: [
            {
              text: this.instructions,
            },
          ],
        },
        tools: tools,
        contextWindowCompression: {
          triggerTokens: 20000,
          slidingWindow: { targetTokens: 16000 },
        },
        output_audio_transcription: {},
      },
    } as GeminiTypes.Live.Setup;
    
    print(`GeminiAssistant: 📤 Sending session setup with model: ${modelUri}`);
    print(`GeminiAssistant: 🔧 Response modalities: ${generationConfig.responseModalities.join(', ')}`);
    print(`GeminiAssistant: 🎤 Audio output enabled: ${this.haveAudioOutput}`);
    print(`GeminiAssistant: 📹 Video input enabled: ${this.haveVideoInput}`);
    
    this.GeminiLive.send(sessionSetupMessage);
  }

  public interruptAudioOutput(): void {
    if (this.dynamicAudioOutput && this.haveAudioOutput) {
      this.dynamicAudioOutput.interruptAudioOutput();
    } else {
      print("DynamicAudioOutput is not initialized.");
    }
  }

  /**
   * Check if Gemini Live session is available
   */
  public isLiveSessionAvailable(): boolean {
    return this.GeminiLive !== null && this.GeminiLive !== undefined;
  }
}
