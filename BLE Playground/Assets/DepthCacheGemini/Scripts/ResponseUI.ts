import animate, {CancelSet} from "SpectaclesInteractionKit.lspkg/Utils/animate"
import {MeasureLine} from "./MeasureLine"
import {WorldLabel} from "./WorldLabel"

const MAIN_RESPONSE_CHARACTER_COUNT = 175

@component
export class ResponseUI extends BaseScriptComponent {
  @input responseAIText: Text
  @input worldLabelPrefab: ObjectPrefab
  @input worldArrowPrefab: ObjectPrefab
  @input worldMeasurePrefab: ObjectPrefab
  @input responseUIObj: SceneObject

  private responseBubbleTrans: Transform

  onAwake() {
    this.responseBubbleTrans = this.responseUIObj.getTransform()
    this.responseBubbleTrans.setLocalScale(vec3.zero())
  }

  openResponseBubble(message: string) {
    //truncate message if too long
    if (message.length > MAIN_RESPONSE_CHARACTER_COUNT) {
      message = message.substring(0, MAIN_RESPONSE_CHARACTER_COUNT) + "..."
    }
    this.responseAIText.text = message
    this.animateResponseBubble(true)
  }

  closeResponseBubble() {
    this.responseAIText.text = ""
    this.animateResponseBubble(false)
  }

  loadWorldLine(startPos: vec3, endPos: vec3) {
    //create and position line in world space
    const lineObj = this.worldMeasurePrefab.instantiate(this.getSceneObject())
    const measureLine = lineObj.getComponent(MeasureLine.getTypeName())
    measureLine.setLinePoints(startPos, endPos)
  }

  loadWorldLabel(label: string, worldPosition: vec3, useArrow: boolean) {
    //create and position label in world space
    const prefab = useArrow ? this.worldArrowPrefab : this.worldLabelPrefab
    const labelObj = prefab.instantiate(this.getSceneObject())
    labelObj.getTransform().setWorldPosition(worldPosition)
    const worldLabel = labelObj.getComponent(WorldLabel.getTypeName())
    worldLabel.textComp.text = label
  }

  showLabels(val: boolean) {
    for (let i = 0; i < this.getSceneObject().getChildrenCount(); i++) {
      this.getSceneObject().getChild(i).enabled = val
    }
  }

  clearLabels() {
    const points = []
    for (let i = 0; i < this.getSceneObject().getChildrenCount(); i++) {
      const childObj = this.getSceneObject().getChild(i)
      points.push(childObj)
    }

    for (let i = 0; i < points.length; i++) {
      const child = points[i]
      child.destroy()
    }
  }

  private animateResponseBubble(open: boolean) {
    const currScale = this.responseBubbleTrans.getLocalScale()
    const desiredScale = open ? vec3.one() : vec3.zero()
    animate({
      easing: "ease-out-elastic",
      duration: 1,
      update: (t) => {
        this.responseBubbleTrans.setLocalScale(vec3.lerp(currScale, desiredScale, t))
      },
      ended: null,
      cancelSet: new CancelSet()
    })
  }
}
