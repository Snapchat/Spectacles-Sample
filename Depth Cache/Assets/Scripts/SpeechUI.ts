import animate, { CancelSet } from "SpectaclesInteractionKit.lspkg/Utils/animate";
import Event from "SpectaclesInteractionKit.lspkg/Utils/Event";
import { ASRController } from "./ASRController";

const UI_CAM_DISTANCE = 50;
const UI_CAM_HEIGHT = -9;

@component
export class SpeechUI extends BaseScriptComponent {
  @input mainCamObj: SceneObject;
  @input speecBocAnchor: SceneObject;
  @input micRend: RenderMeshVisual;
  @input speechText: Text;
  @input asrVoiceController: ASRController;
  @input speechButtonCollider: ColliderComponent;

  onSpeechReady = new Event<string>();

  private speechBubbleTrans: Transform;
  private trans: Transform;
  private mainCamTrans: Transform;

  onAwake() {
    this.speechBubbleTrans = this.speecBocAnchor.getTransform();
    this.speechBubbleTrans.setLocalScale(vec3.zero());
    this.trans = this.getSceneObject().getTransform();
    this.mainCamTrans = this.mainCamObj.getTransform();
    this.animateSpeechIcon(false);
    this.speechText.text = "";
    this.createEvent("OnStartEvent").bind(this.onStart.bind(this));
    this.createEvent("UpdateEvent").bind(this.onUpdate.bind(this));
  }

  private onStart() {
    this.asrVoiceController.onPartialVoiceEvent.add((text) => {
      this.speechText.text = text;
    });
    this.asrVoiceController.onFinalVoiceEvent.add((text) => {
      this.speechText.text = text;
      this.stopListening();
      this.onSpeechReady.invoke(text);
    });
  }

  activateSpeechButton(activate: boolean) {
    this.speechButtonCollider.enabled = activate;
  }

  onSpeechButtonDown() {
    print("Speech button Down!");
    this.speechText.text = "";
    this.animateSpeechBubble(true);
    this.animateSpeechIcon(true);
    this.asrVoiceController.startListening();
  }

  stopListening() {
    print("Disabling speech UI");
    this.animateSpeechIcon(false);
    this.asrVoiceController.stopListening();
  }

  private onUpdate() {
    var camPos = this.mainCamTrans.getWorldPosition();
    var desiredPosition = camPos.add(
      this.mainCamTrans.forward.uniformScale(-UI_CAM_DISTANCE)
    );
    desiredPosition = desiredPosition.add(
      this.mainCamTrans.up.uniformScale(UI_CAM_HEIGHT)
    );
    this.trans.setWorldPosition(
      vec3.lerp(
        this.trans.getWorldPosition(),
        desiredPosition,
        getDeltaTime() * 10
      )
    );
    var desiredRotation = quat.lookAt(this.mainCamTrans.forward, vec3.up());
    this.trans.setWorldRotation(
      quat.slerp(
        this.trans.getWorldRotation(),
        desiredRotation,
        getDeltaTime() * 10
      )
    );
  }

  private animateSpeechIcon(active: boolean) {
    this.micRend.mainPass.Tweak_N23 = active ? 3 : 0;
    this.micRend.mainPass.Tweak_N33 = active ? 3 : 0;
    this.micRend.mainPass.Tweak_N37 = active ? 0.2 : 0;
  }

  private animateSpeechBubble(open: boolean) {
    var currScale = this.speechBubbleTrans.getLocalScale();
    var desiredScale = open ? vec3.one() : vec3.zero();
    animate({
      easing: "ease-out-elastic",
      duration: 1,
      update: (t) => {
        this.speechBubbleTrans.setLocalScale(
          vec3.lerp(currScale, desiredScale, t)
        );
      },
      ended: null,
      cancelSet: new CancelSet(),
    });
  }
}
