@component
export class WorldLabel extends BaseScriptComponent {
  @input frameRend: RenderMeshVisual;
  @input public textComp: Text;

  private trans: Transform = null;

  onAwake() {
    this.trans = this.getSceneObject().getTransform();
    //wait some random time before scaling in
    this.trans.setLocalScale(vec3.zero());
    //delay for random time beween 0 and 2 seconds
    var delayTime = Math.random() * 1.7;
    var delayEvent = this.createEvent("DelayedCallbackEvent");
    delayEvent.bind(() => {
      //scale in label
      this.createEvent("UpdateEvent").bind(this.onUpdate.bind(this));
    });
    delayEvent.reset(delayTime);
  }

  onUpdate() {
    //scale in label or arrow
    this.trans.setLocalScale(
      vec3.lerp(this.trans.getLocalScale(), vec3.one(), getDeltaTime() * 7)
    );

    var textSize = this.textComp.text.length;
    this.frameRend.enabled = textSize > 0;
  }
}
