@component
export class Labels extends BaseScriptComponent {
  @input labelPrefab: ObjectPrefab

  onAwake() {}

  loadLables(pointCloud: any, labelString: any) {
    const labels = JSON.parse(labelString)
    for (let i = 0; i < labels.objects.length; i++) {
      const label = labels.objects[i]
      const labelLocalCamPos = new vec3(label.pos[0], label.pos[1], label.pos[2])
      const labelObj = this.labelPrefab.instantiate(this.getSceneObject())
      labelObj.getTransform().setWorldPosition(pointCloud.camLocalToWorld.multiplyPoint(labelLocalCamPos))
      const labelText = labelObj.getChild(0).getComponent("Component.Text")
      labelText.text = label.label
    }
  }
}
