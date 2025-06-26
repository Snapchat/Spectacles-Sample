import { AudioProcessor } from "Remote Service Gateway.lspkg/Helpers/AudioProcessor";
import { DynamicAudioOutput } from "Remote Service Gateway.lspkg/Helpers/DynamicAudioOutput";
import {
  Gemini,
  GeminiLiveWebsocket,
} from "Remote Service Gateway.lspkg/HostedExternal/Gemini";
import { GeminiTypes } from "Remote Service Gateway.lspkg/HostedExternal/GeminiTypes";
import { MicrophoneRecorder } from "Remote Service Gateway.lspkg/Helpers/MicrophoneRecorder";
import { VideoController } from "Remote Service Gateway.lspkg/Helpers/VideoController";

import Event from "SpectaclesInteractionKit.lspkg/Utils/Event";
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
  @input
  @widget(new TextAreaWidget())
  private instructions: string =
    "You are a helpful assistant that loves to make puns";
  @input private haveVideoInput: boolean = false;
  @ui.group_end
  @ui.separator
  @ui.group_start("Outputs")
  @ui.label(
    '<span style="color: yellow;">⚠️ To prevent audio feedback loop in Lens Studio Editor, use headphones or manage your microphone input.</span>'
  )
  @input
  private haveAudioOutput: boolean = false;
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
    if (stream) {
      if (this.haveVideoInput) {
        this.videoController.startRecording();
      }

      this.microphoneRecorder.startRecording();
    } else {
      if (this.haveVideoInput) {
        this.videoController.stopRecording();
      }

      this.microphoneRecorder.stopRecording();
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

  private sessionSetup() {
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

    if (!this.haveAudioOutput) {
      generationConfig = {
        responseModalities: ["TEXT"],
      };
    }

    // Define the Snap3D tool
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

    // Send the session setup message
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
    this.GeminiLive.send(sessionSetupMessage);
  }

  public interruptAudioOutput(): void {
    if (this.dynamicAudioOutput && this.haveAudioOutput) {
      this.dynamicAudioOutput.interruptAudioOutput();
    } else {
      print("DynamicAudioOutput is not initialized.");
    }
  }
}
