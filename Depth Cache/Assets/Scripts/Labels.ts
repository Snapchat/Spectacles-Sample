@component
export class Labels extends BaseScriptComponent {
  @input labelPrefab: ObjectPrefab;

  onAwake() {}

  loadLables(pointCloud: any, labelString: any) {
    var labels = JSON.parse(labelString);
    for (var i = 0; i < labels.objects.length; i++) {
      var label = labels.objects[i];
      var labelLocalCamPos = new vec3(label.pos[0], label.pos[1], label.pos[2]);
      var labelObj = this.labelPrefab.instantiate(this.getSceneObject());
      labelObj
        .getTransform()
        .setWorldPosition(
          pointCloud.camLocalToWorld.multiplyPoint(labelLocalCamPos)
        );
      var labelText = labelObj.getChild(0).getComponent("Component.Text");
      labelText.text = label.label;
    }
  }
}
