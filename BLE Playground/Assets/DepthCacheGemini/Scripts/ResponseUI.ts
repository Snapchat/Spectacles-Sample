import animate, { CancelSet } from "SpectaclesInteractionKit.lspkg/Utils/animate";
import { MeasureLine } from "./MeasureLine";
import { WorldLabel } from "./WorldLabel";

const MAIN_RESPONSE_CHARACTER_COUNT = 175;

@component
export class ResponseUI extends BaseScriptComponent {
  @input responseAIText: Text;
  @input worldLabelPrefab: ObjectPrefab;
  @input worldArrowPrefab: ObjectPrefab;
  @input worldMeasurePrefab: ObjectPrefab;
  @input responseUIObj: SceneObject;

  private responseBubbleTrans: Transform;

  onAwake() {
    this.responseBubbleTrans = this.responseUIObj.getTransform();
    this.responseBubbleTrans.setLocalScale(vec3.zero());
  }

  openResponseBubble(message: string) {
    //truncate message if too long
    if (message.length > MAIN_RESPONSE_CHARACTER_COUNT) {
      message = message.substring(0, MAIN_RESPONSE_CHARACTER_COUNT) + "...";
    }
    this.responseAIText.text = message;
    this.animateResponseBubble(true);
  }

  closeResponseBubble() {
    this.responseAIText.text = "";
    this.animateResponseBubble(false);
  }

  loadWorldLine(startPos: vec3, endPos: vec3) {
    //create and position line in world space
    var lineObj = this.worldMeasurePrefab.instantiate(this.getSceneObject());
    var measureLine = lineObj.getComponent(MeasureLine.getTypeName());
    measureLine.setLinePoints(startPos, endPos);
  }

  loadWorldLabel(label: string, worldPosition: vec3, useArrow: boolean) {
    //create and position label in world space
    var prefab = useArrow ? this.worldArrowPrefab : this.worldLabelPrefab;
    var labelObj = prefab.instantiate(this.getSceneObject());
    labelObj.getTransform().setWorldPosition(worldPosition);
    var worldLabel = labelObj.getComponent(WorldLabel.getTypeName());
    worldLabel.textComp.text = label;
  }

  showLabels(val:boolean) {
    for (var i = 0; i < this.getSceneObject().getChildrenCount(); i++) {
      this.getSceneObject().getChild(i).enabled = val;
    }
  }

  clearLabels() {
    var points = [];
    for (var i = 0; i < this.getSceneObject().getChildrenCount(); i++) {
      var childObj = this.getSceneObject().getChild(i);
      points.push(childObj);
    }

    for (var i = 0; i < points.length; i++) {
      var child = points[i];
      child.destroy();
    }
  }

  private animateResponseBubble(open: boolean) {
    var currScale = this.responseBubbleTrans.getLocalScale();
    var desiredScale = open ? vec3.one() : vec3.zero();
    animate({
      easing: "ease-out-elastic",
      duration: 1,
      update: (t) => {
        this.responseBubbleTrans.setLocalScale(
          vec3.lerp(currScale, desiredScale, t)
        );
      },
      ended: null,
      cancelSet: new CancelSet(),
    });
  }
}
