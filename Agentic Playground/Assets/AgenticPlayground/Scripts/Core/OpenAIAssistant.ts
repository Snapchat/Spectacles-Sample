import { AudioProcessor } from "Remote Service Gateway.lspkg/Helpers/AudioProcessor";
import { DynamicAudioOutput } from "Remote Service Gateway.lspkg/Helpers/DynamicAudioOutput";
import { MicrophoneRecorder } from "Remote Service Gateway.lspkg/Helpers/MicrophoneRecorder";
import {
  OpenAI,
  OpenAIRealtimeWebsocket,
} from "Remote Service Gateway.lspkg/HostedExternal/OpenAI";
import { OpenAITypes } from "Remote Service Gateway.lspkg/HostedExternal/OpenAITypes";

import Event from "SpectaclesInteractionKit.lspkg/Utils/Event";

@component
export class OpenAIAssistant extends BaseScriptComponent {
  @ui.separator
  @ui.label(
    "Example of connecting to the OpenAI Realtime API. Change various settings in the inspector to customize!"
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
  private readonly instructions: string = `You are an educational AI tutor designed to help students learn and understand complex topics. 

Your primary goals are to:
- Provide clear, accurate explanations of educational concepts
- Break down complex topics into digestible parts
- Use examples  and analogies to enhance understanding
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
      new ComboBoxItem("alloy", "alloy"),
      new ComboBoxItem("ash", "ash"),
      new ComboBoxItem("ballad", "ballad"),
      new ComboBoxItem("coral", "coral"),
      new ComboBoxItem("echo", "echo"),
      new ComboBoxItem("sage", "sage"),
      new ComboBoxItem("shimmer", "shimmer"),
      new ComboBoxItem("verse", "verse"),
    ])
  )
  private voice: string = "coral";
  @ui.group_end
  @ui.separator
  private audioProcessor: AudioProcessor = new AudioProcessor();
  private OAIRealtime: OpenAIRealtimeWebsocket; // OpenAI realtime session

  public updateTextEvent: Event<{ text: string; completed: boolean }> =
    new Event<{ text: string; completed: boolean }>();

  public functionCallEvent: Event<{
    name: string;
    args: any;
    callId?: string;
  }> = new Event<{
    name: string;
    args: any;
    callId?: string;
  }>();

  createOpenAIRealtimeSession() {
    this.websocketRequirementsObj.enabled = true;
    // Display internet connection status
    let internetStatus = global.deviceInfoSystem.isInternetAvailable()
      ? "Websocket connected"
      : "No internet";

    this.updateTextEvent.invoke({ text: internetStatus, completed: true });

    global.deviceInfoSystem.onInternetStatusChanged.add((args) => {
      internetStatus = args.isInternetAvailable
        ? "Reconnected to internet"
        : "No internet";

      this.updateTextEvent.invoke({ text: internetStatus, completed: true });
    });
    this.dynamicAudioOutput.initialize(24000);
    this.microphoneRecorder.setSampleRate(24000);
    this.OAIRealtime = OpenAI.createRealtimeSession({
      model: "gpt-4o-mini-realtime-preview",
    });

    this.OAIRealtime.onOpen.add((event) => {
      print("Connection opened");
      this.sessionSetup();
    });

    let completedTextDisplay = true;

    this.OAIRealtime.onMessage.add((message) => {
      // DEBUG: Log all message types to see what OpenAI sends for programmatic text
      if (message.type !== "response.audio.delta") { // Skip audio delta spam
        print(`OpenAIAssistant: 🔍 DEBUG - Received message type: ${message.type}`);
        if (message.delta) {
          print(`OpenAIAssistant: 🔍 DEBUG - Message delta: "${message.delta}"`);
        }
      }
      
      // Listen for text responses
      if (
        message.type === "response.text.delta" ||
        message.type === "response.audio_transcript.delta"
      ) {
        if (!completedTextDisplay) {
          this.updateTextEvent.invoke({
            text: message.delta,
            completed: false,
          });
        } else {
          this.updateTextEvent.invoke({
            text: message.delta,
            completed: true,
          });
        }
        completedTextDisplay = false;
      } 
      // Handle response.output_item.added for programmatic text responses
      else if (message.type === "response.output_item.added") {
        print(`OpenAIAssistant: 🔍 DEBUG - output_item.added: ${JSON.stringify(message.item)}`);
        if (message.item && message.item.type === "message" && message.item.content) {
          // Extract text from message content
          for (let content of message.item.content) {
            if (content.type === "text" && content.text) {
              print(`OpenAIAssistant: 🔍 Found text in output_item.added: "${content.text}"`);
              this.updateTextEvent.invoke({
                text: content.text,
                completed: false,
              });
              completedTextDisplay = false;
            }
          }
        }
      }
      // Handle response.output_item.done for final text responses
      else if (message.type === "response.output_item.done") {
        print(`OpenAIAssistant: 🔍 DEBUG - output_item.done: ${JSON.stringify(message.item)}`);
        if (message.item && message.item.type === "message" && message.item.content) {
          // Extract text from message content
          for (let content of message.item.content) {
            if (content.type === "text" && content.text) {
              print(`OpenAIAssistant: 🔍 Found text in output_item.done: "${content.text}"`);
              this.updateTextEvent.invoke({
                text: content.text,
                completed: true,
              });
              completedTextDisplay = true;
            }
          }
        }
        // Also check for function calls
        else if (message.item && message.item.type === "function_call") {
          const functionCall = message.item;
          print(`Function called: ${functionCall.name}`);
          print(`Function args: ${functionCall.arguments}`);

          let args = JSON.parse(functionCall.arguments);
          this.functionCallEvent.invoke({
            name: functionCall.name,
            args: args,
            callId: functionCall.call_id, // OpenAI requires a call_id
          });
        }
      }
      else if (message.type === "response.done") {
        print(`OpenAIAssistant: 🔍 DEBUG - response.done received`);
        completedTextDisplay = true;
      }

      // Set up Audio Playback
      else if (message.type === "response.audio.delta") {
        let delta = Base64.decode(message.delta);
        this.dynamicAudioOutput.addAudioFrame(delta);
      }
      // Listen for user began speaking
      else if (message.type === "input_audio_buffer.speech_started") {
        print("Speech started, interrupting the AI");
        this.dynamicAudioOutput.interruptAudioOutput();
      }
    });

    this.OAIRealtime.onError.add((event) => {
      print("Error: " + event);
    });

    this.OAIRealtime.onClose.add((event) => {
      print("Connection closed: " + event.reason);
      this.updateTextEvent.invoke({
        text: "Websocket closed: " + event.reason,
        completed: true,
      });
    });
  }

  public streamData(stream: boolean) {
    // Check if we're in orchestrated mode - if so, don't handle voice input directly
    // The orchestrator will handle voice input and call us for AI processing only
    print(`OpenAIAssistant: streamData called with stream=${stream}`);
    
    // Don't start/stop recording if we're being controlled by an orchestrator
    // This prevents competing voice input systems
    if (stream) {
      print("OpenAIAssistant: 🔒 Voice input disabled - orchestrated system should handle voice input");
      // this.microphoneRecorder.startRecording(); // Commented out to prevent conflicts
    } else {
      print("OpenAIAssistant: 🔒 Voice input disabled - orchestrated system should handle voice input");
      // this.microphoneRecorder.stopRecording(); // Commented out to prevent conflicts
    }
  }

  public interruptAudioOutput(): void {
    if (this.dynamicAudioOutput && this.haveAudioOutput) {
      this.dynamicAudioOutput.interruptAudioOutput();
    } else {
      print("DynamicAudioOutput is not initialized.");
    }
  }

  private sessionSetup() {
    let modalitiesArray = ["text"];
    if (this.haveAudioOutput) {
      modalitiesArray.push("audio");
    }

    const tools = [
      {
        type: "function",
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
      } as OpenAITypes.Common.ToolDefinition,
    ];

    // Set up the session
    let sessionUpdateMsg = {
      type: "session.update",
      session: {
        instructions: this.instructions,
        voice: this.voice,
        modalities: modalitiesArray,
        input_audio_format: "pcm16",
        tools: tools,
        output_audio_format: "pcm16",
        turn_detection: {
          type: "server_vad",
          threshold: 0.5,
          prefix_padding_ms: 300,
          silence_duration_ms: 500,
          create_response: true,
        },
      },
    } as OpenAITypes.Realtime.SessionUpdateRequest;

    this.OAIRealtime.send(sessionUpdateMsg);

    // Process microphone input to send to the server
    this.audioProcessor.onAudioChunkReady.add((encodedAudioChunk) => {
      let audioMsg = {
        type: "input_audio_buffer.append",
        audio: encodedAudioChunk,
      } as OpenAITypes.Realtime.ClientMessage;
      this.OAIRealtime.send(audioMsg);
    });

    // Configure the microphone
    this.microphoneRecorder.onAudioFrame.add((audioFrame) => {
      this.audioProcessor.processFrame(audioFrame);
    });
  }

  public sendFunctionCallUpdate(
    functionName: string,
    callId: string,
    response: string
  ): void {
    print("Call id = " + callId);
    let messageToSend = {
      type: "conversation.item.create",
      item: {
        type: "function_call_output",
        call_id: callId,
        output: response,
      },
    } as OpenAITypes.Realtime.ConversationItemCreateRequest;

    this.OAIRealtime.send(messageToSend);
  }

  /**
   * Send message to OpenAI session with audio output enabled
   * This will generate both text and audio responses
   */
  public sendMessageWithAudio(content: string): void {
    if (!this.OAIRealtime) {
      print("OpenAIAssistant: ⚠️ Realtime session not initialized");
      return;
    }

    print(`OpenAIAssistant: 🔊 Sending message with audio: "${content.substring(0, 100)}..."`);
    
    // Send user message to conversation
    let userMessageToSend = {
      type: "conversation.item.create",
      item: {
        type: "message",
        role: "user",
        content: [
          {
            type: "input_text", 
            text: content
          }
        ]
      },
    } as OpenAITypes.Realtime.ConversationItemCreateRequest;

    this.OAIRealtime.send(userMessageToSend);

    // Request AI response with audio
    let modalitiesArray = ["text"];
    if (this.haveAudioOutput) {
      modalitiesArray.push("audio");
    }

    let responseRequest = {
      type: "response.create",
      response: {
        modalities: modalitiesArray, // Include audio if available
        instructions: this.instructions
      }
    } as OpenAITypes.Realtime.ResponseCreateRequest;

    this.OAIRealtime.send(responseRequest);
    
    print(`OpenAIAssistant: ✅ Message sent with modalities: ${modalitiesArray.join(", ")}`);
  }

  /**
   * Send text message directly to OpenAI session for text-only generation
   * This bypasses voice streaming and sends conversation messages directly
   */
  public sendTextMessage(content: string): void {
    if (!this.OAIRealtime) {
      print("OpenAIAssistant: ⚠️ Realtime session not initialized");
      return;
    }

    print(`OpenAIAssistant: 📝 Sending text message: "${content.substring(0, 100)}..."`);
    
    // Send user message to conversation
    let userMessageToSend = {
      type: "conversation.item.create",
      item: {
        type: "message",
        role: "user",
        content: [
          {
            type: "input_text", 
            text: content
          }
        ]
      },
    } as OpenAITypes.Realtime.ConversationItemCreateRequest;

    this.OAIRealtime.send(userMessageToSend);

    // Request AI response
    let responseRequest = {
      type: "response.create",
      response: {
        modalities: ["text"], // Text only, no audio
        instructions: this.instructions
      }
    } as OpenAITypes.Realtime.ResponseCreateRequest;

    this.OAIRealtime.send(responseRequest);
    
    print("OpenAIAssistant: ✅ Text message sent, waiting for AI response");
  }
}
