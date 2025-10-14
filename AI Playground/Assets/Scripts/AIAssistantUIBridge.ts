import { GeminiAssistant } from "./GeminiAssistant";
import { OpenAIAssistant } from "./OpenAIAssistant";
import { Snap3DInteractableFactory } from "./Snap3DInteractableFactory";
import { SphereController } from "./SphereController";
// Replaced LSTween usage with animate utility
import { BaseButton } from "SpectaclesUIKit.lspkg/Scripts/Components/Button/BaseButton";
import animate from "SpectaclesInteractionKit.lspkg/Utils/animate";

enum AssistantType {
  Gemini = "Gemini",
  OpenAI = "OpenAI",
}

@component
export class AIAssistantUIBridge extends BaseScriptComponent {
  @ui.separator
  @ui.label("Connects the AI Assistant to the Sphere Controller UI")
  private assistantType: string = AssistantType.Gemini;
  @ui.separator
  @ui.group_start("Assistants")
  @ui.label(
    "Customize the voice and behavior of the assistants on their respective components."
  )
  @input
  private geminiAssistant: GeminiAssistant;

  @input
  private openAIAssistant: OpenAIAssistant;
  @ui.group_end
  @ui.separator
  @ui.group_start("UI Elements")
  @input
  private sphereController: SphereController;

  @input
  private snap3DInteractableFactory: Snap3DInteractableFactory;

  @input
  private hintTitle: Text;

  @input
  private hintText: Text;

  @input
  private geminiButton: BaseButton;
  @input
  private openAIButton: BaseButton;
  @ui.group_end
  private textIsVisible: boolean = true;
  private currentAssistant: GeminiAssistant | OpenAIAssistant;

  onAwake() {
    this.createEvent("OnStartEvent").bind(this.onStart.bind(this));
  }

  private onStart() {
    this.geminiButton.onInitialized.add(() => {
      this.geminiButton.onTriggerUp.add(() => {
        this.assistantType = AssistantType.Gemini;
        this.hintTitle.text = "Gemini Live Example";
        this.startWebsocketAndUI();
      });
    });
    
    this.openAIButton.onInitialized.add(() => {
      this.openAIButton.onTriggerUp.add(() => {
        this.assistantType = AssistantType.OpenAI;
          this.hintTitle.text = "OpenAI Realtime Example";
          this.startWebsocketAndUI();
        });
    });
  }

  private hideButtons() {
    this.geminiButton.enabled = false;
    this.openAIButton.enabled = false;
    {
      const tr = this.geminiButton.sceneObject.getTransform();
      const start = tr.getLocalScale();
      const end = vec3.zero();
      const duration = 0.5;
      animate({
        duration,
        easing: "ease-out-quad",
        update: (t) => {
          const sx = start.x + (end.x - start.x) * t;
          const sy = start.y + (end.y - start.y) * t;
          const sz = start.z + (end.z - start.z) * t;
          tr.setLocalScale(new vec3(sx, sy, sz));
        },
        ended: () => {
          this.geminiButton.sceneObject.enabled = false;
        },
      });
    }

    {
      const tr = this.openAIButton.sceneObject.getTransform();
      const start = tr.getLocalScale();
      const end = vec3.zero();
      const duration = 0.5;
      animate({
        duration,
        easing: "ease-out-quad",
        update: (t) => {
          const sx = start.x + (end.x - start.x) * t;
          const sy = start.y + (end.y - start.y) * t;
          const sz = start.z + (end.z - start.z) * t;
          tr.setLocalScale(new vec3(sx, sy, sz));
        },
        ended: () => {
          this.openAIButton.sceneObject.enabled = false;
        },
      });
    }
  }

  private startWebsocketAndUI() {
    this.hideButtons();
    this.hintText.text = "Pinch on the orb next to your left hand to activate";
    if (global.deviceInfoSystem.isEditor()) {
      this.hintText.text = "Look down and click on the orb to activate";
    }
    this.sphereController.initializeUI();
    // Set the current assistant based on selection
    this.currentAssistant =
      this.assistantType === AssistantType.Gemini
        ? this.geminiAssistant
        : this.openAIAssistant;

    if (this.assistantType === AssistantType.Gemini) {
      this.geminiAssistant.createGeminiLiveSession();
    } else if (this.assistantType === AssistantType.OpenAI) {
      this.openAIAssistant.createOpenAIRealtimeSession();
    }

    // Connect the selected assistant to the UI
    this.connectAssistantEvents();

    // Connect sphere controller activation to the current assistant
    this.sphereController.isActivatedEvent.add((isActivated) => {
      this.currentAssistant.streamData(isActivated);
      if (!isActivated) {
        this.currentAssistant.interruptAudioOutput();
      }
    });
  }

  private connectAssistantEvents() {
    // Connect text update events
    this.currentAssistant.updateTextEvent.add((data) => {
      this.sphereController.setText(data);
    });

    // Connect function call events
    this.currentAssistant.functionCallEvent.add((data) => {
      if (data.name === "Snap3D") {
        // Send a response based on which assistant is active
        if (this.assistantType === AssistantType.Gemini) {
          this.geminiAssistant.sendFunctionCallUpdate(
            data.name,
            "Beginning to create 3D object..."
          );
        } else {
          this.openAIAssistant.sendFunctionCallUpdate(
            data.name,
            data.callId, // OpenAI requires a call_id
            "Beginning to create 3D object..."
          );
        }

        // Create the 3D object and handle the response
        this.snap3DInteractableFactory
          .createInteractable3DObject(data.args.prompt)
          .then((status) => {
            if (this.assistantType === AssistantType.Gemini) {
              this.geminiAssistant.sendFunctionCallUpdate(data.name, status);
            } else {
              this.openAIAssistant.sendFunctionCallUpdate(
                data.name,
                data.callId,
                status
              );
            }
          })
          .catch((error) => {
            if (this.assistantType === AssistantType.Gemini) {
              this.geminiAssistant.sendFunctionCallUpdate(data.name, error);
            } else {
              this.openAIAssistant.sendFunctionCallUpdate(
                data.name,
                data.callId,
                error
              );
            }
          });
      }
    });
  }
}
