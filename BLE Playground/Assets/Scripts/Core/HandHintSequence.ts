import { HandAnimationClipInfo, HandAnimationsLibrary, HandMode, InteractionHintController } from "Spectacles 3D Hand Hints.lspkg/Scripts/InteractionHintController";
import { CancelToken, clearTimeout, setTimeout } from "SpectaclesInteractionKit.lspkg/Utils/FunctionTimingUtils";

@component
export class HandHintSequence extends BaseScriptComponent {
    @input
    interactionHintController: InteractionHintController

    @input
    lookHintText: Text

    @input
    handHintText: Text

    private interactionHintControllerSo: SceneObject

    private handGrabLearned: boolean
    private handPointLearned: boolean

    private lookStr: string
    private handGrabStr: string
    private handPointStr: string

    private handHintLocalPosition: vec3
    private timeoutCancelToken: CancelToken

    onAwake() {
        this.handHintLocalPosition = new vec3(0, -3, -60);
        this.interactionHintControllerSo = this.interactionHintController.getSceneObject();
        this.interactionHintControllerSo.enabled = false;
        this.handGrabLearned = false;
        this.handPointLearned = false;
        this.lookStr = "Look at the flashing light to set position.";
        this.handGrabStr = "Open/close hand\nto the light.";
        this.handPointStr = "Move hand in a circle\naround the light.";
    }

    startLookHint() {
        this.lookHintText.enabled = true;
        this.handHintText.text = this.lookStr;
    }

    endLookHint() {
        this.lookHintText.text = "";
        this.lookHintText.enabled = false;
    }

    startHandGrabHint() {
        if (this.handGrabLearned) {
            return;
        }
        this.handGrabLearned = true;

        this.handHintText.enabled = true;
        this.handHintText.text = this.handGrabStr;

        this.interactionHintControllerSo.enabled = true;
        let sequence: HandAnimationClipInfo[] = []
        var itemA: HandAnimationClipInfo = new HandAnimationClipInfo(HandMode.Right, HandAnimationsLibrary.Right.PalmGrabX, this.handHintLocalPosition);
        sequence.push(itemA);
        this.interactionHintController.playHintAnimationSequence(sequence, 1);

        this.timeoutCancelToken = setTimeout(() => {
            clearTimeout(this.timeoutCancelToken);
            this.startHandPointHint();
        }, 3500);
    }

    private startHandPointHint() {
        if (this.handPointLearned) {
            return;
        }
        this.handPointLearned = true;

        this.handHintText.text = this.handPointStr;
        this.interactionHintControllerSo.enabled = true;

        let sequence: HandAnimationClipInfo[] = []
        var itemA: HandAnimationClipInfo = new HandAnimationClipInfo(HandMode.Right, HandAnimationsLibrary.Right.FingerSwipeX, this.handHintLocalPosition);
        sequence.push(itemA);
        this.interactionHintController.playHintAnimationSequence(sequence, 2);

        this.timeoutCancelToken = setTimeout(() => {
            clearTimeout(this.timeoutCancelToken);
            this.interactionHintControllerSo.enabled = false;
            this.handHintText.text = "";
            this.handHintText.enabled = false;
        }, 3000);
    }
}