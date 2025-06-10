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
  @input
  @widget(new TextAreaWidget())
  private instructions: string =
    "You are a helpful assistant that loves to make puns";
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
      } else if (message.type === "response.done") {
        completedTextDisplay = true;
      }

      // Set up Audio Playback
      else if (message.type === "response.audio.delta") {
        let delta = Base64.decode(message.delta);
        this.dynamicAudioOutput.addAudioFrame(delta);
      }
      // Listen for function calls
      else if (message.type === "response.output_item.done") {
        if (message.item && message.item.type === "function_call") {
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
    if (stream) {
      this.microphoneRecorder.startRecording();
    } else {
      this.microphoneRecorder.stopRecording();
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
}
