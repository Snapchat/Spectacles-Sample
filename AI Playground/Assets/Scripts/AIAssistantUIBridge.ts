import { PinchButton } from "SpectaclesInteractionKit.lspkg/Components/UI/PinchButton/PinchButton";
import { GeminiAssistant } from "./GeminiAssistant";
import { OpenAIAssistant } from "./OpenAIAssistant";
import { Snap3DInteractableFactory } from "./Snap3DInteractableFactory";
import { SphereController } from "./SphereController";
import { LSTween } from "LSTween.lspkg/LSTween";
import Easing from "LSTween.lspkg/TweenJS/Easing";

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
  private geminiButton: PinchButton;
  @input
  private openAIButton: PinchButton;
  @ui.group_end
  private textIsVisible: boolean = true;
  private currentAssistant: GeminiAssistant | OpenAIAssistant;

  onAwake() {
    this.createEvent("OnStartEvent").bind(this.onStart.bind(this));
  }

  private onStart() {
    this.geminiButton.onButtonPinched.add(() => {
      this.assistantType = AssistantType.Gemini;
      this.hintTitle.text = "Gemini Live Example";
      this.startWebsocketAndUI();
    });

    this.openAIButton.onButtonPinched.add(() => {
      this.assistantType = AssistantType.OpenAI;
      this.hintTitle.text = "OpenAI Realtime Example";
      this.startWebsocketAndUI();
    });
  }

  private hideButtons() {
    this.geminiButton.enabled = false;
    this.openAIButton.enabled = false;
    LSTween.scaleToLocal(
      this.geminiButton.sceneObject.getTransform(),
      vec3.zero(),
      500
    )
      .easing(Easing.Quadratic.Out)
      .onComplete(() => {
        this.geminiButton.sceneObject.enabled = false;
      })
      .start();

    LSTween.scaleToLocal(
      this.openAIButton.sceneObject.getTransform(),
      vec3.zero(),
      500
    )
      .easing(Easing.Quadratic.Out)
      .onComplete(() => {
        this.openAIButton.sceneObject.enabled = false;
      })
      .start();
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
      if (this.textIsVisible) {
        LSTween.textAlphaTo(this.hintTitle, 0, 600).start();
        LSTween.textAlphaTo(this.hintText, 0, 600).start();
        let bgColor = this.hintTitle.backgroundSettings.fill.color;
        LSTween.rawTween(600)
          .onUpdate((tweenData) => {
            let percent = tweenData.t as number;
            bgColor.a = 1 - percent;
            this.hintTitle.backgroundSettings.fill.color = bgColor;
          })
          .start();
      }
      this.textIsVisible = false;
      this.currentAssistant.streamData(isActivated);
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
