@component
export class RenderService extends BaseScriptComponent {

  @input marker: ObjectPrefab;
  @input cylinder: ObjectPrefab;
  @input debugText: Text;
  @input screenImage: Image;
  @input positionPlane: SceneObject;

  public moveStartPos: vec3 = null
  public moveEndPos: vec3 = null

  private startMarker: SceneObject;
  private endMarker: SceneObject;
  private moveStartTime = null;
  private movePath: SceneObject[] = [];
  public moveStartPosImage: vec2 = null;
  public moveEndPosImage: vec2 = null;
  public shouldRenderMove = false
  private currentScale = 1;


  onAwake() {
    this.createEvent("UpdateEvent").bind(this.onUpdate.bind(this));
    let scale = vec3.one().uniformScale(0.02);
    this.startMarker = this.makeMarker(new vec3(0, 1, 1), scale, true);
    this.endMarker = this.makeMarker(new vec3(0, 1, 0), scale, true);
  }

  resetMove() {
    this.moveStartPos = null;
    this.moveEndPos = null;
    this.moveStartPosImage = null;
    this.moveEndPosImage = null;
    this.shouldRenderMove = false;
  }

  onUpdate() {
    this.updateMarkers();
  }

  updateHint(hint: string) {
    this.debugText.text = hint;
  }

  makeMarker(color: any, scale: vec3, cylinder: boolean = false) {
    let parent = this.positionPlane;
    let marker = cylinder ? this.cylinder.instantiate(parent) : this.marker.instantiate(parent);
    marker.getTransform().setWorldScale(scale)

    let mesh = cylinder ? marker.getChild(0).getComponent("Component.RenderMeshVisual") : marker.getComponent("Component.RenderMeshVisual");
    let mat = mesh.mainMaterial.clone()
    mat.mainPass.baseColor = cylinder ? new vec4(1, 1, 1, 1) : color;
    if (cylinder) {
      mat.mainPass.rimColor = color;
    }
    mesh.materials = [mat];
    return marker
  }

  updateScreenImage(imageCorners: vec2[]) {
    let names = ["bl", "br", "tl", "tr"]
    for (let i = 0; i < 4; i++) {
      this.screenImage.mainPass[names[i] + "_uv"] = imageCorners[i];
    }
    //this.screenImage.mainPass.move_to = startUV;  
    if (this.moveStartPosImage != null) {
      this.screenImage.mainPass.move_from = this.moveStartPosImage;
    }
    if (this.moveEndPosImage != null) {
      this.screenImage.mainPass.move_to = this.moveEndPosImage;
    }
  }

  updateMarkers() {
    if (!this.shouldRenderMove) {
      this.startMarker.enabled = false;
      this.endMarker.enabled = false;
      for (let i = 0; i < this.movePath.length; i++) {
        this.movePath[i].enabled = false;
      }
      return;
    }

    if (this.moveStartPos != null && this.moveEndPos != null) {
      if (this.moveStartTime == null) {
        this.moveStartTime = getTime();
      }
    } else {
      return;
    }

    //this.moveStartPos.y = this.moveEndPos.y + 3;
    this.startMarker.getTransform().setWorldPosition(this.moveStartPos);
    this.endMarker.getTransform().setWorldPosition(this.moveEndPos);

    this.startMarker.enabled = true;
    this.endMarker.enabled = true;

    const dt = getTime() - this.moveStartTime;
    let progress = (dt / 2.0) - Math.floor(dt / 2.0);
    progress *= 5.0

    let rainbowColors = [
      new vec4(1, 0, 0, 1),   // Red
      new vec4(1, 0.5, 0, 1), // Orange
      new vec4(1, 1, 0, 1),   // Yellow
      new vec4(0, 1, 0, 1),   // Green
      new vec4(0.25, 0.25, 1, 1),   // Blue
      new vec4(0, 1, 1, 1), // Indigo
      new vec4(1, 0, 1, 1), // Violet
    ]

    let topVec = new vec3(0, this.startMarker.getTransform().getWorldScale().y * 10, 0);
    let ballStartPos = this.moveStartPos.add(topVec);
    let ballEndPos = this.moveEndPos.add(topVec);

    let numBalls = 7
    const ballScale = 1.0 * this.currentScale; // Time spacing between balls
    while (this.movePath.length < numBalls) {
      let ball = this.makeMarker(rainbowColors[this.movePath.length % rainbowColors.length], vec3.one().uniformScale(ballScale));
      ball.enabled = false;
      this.movePath.push(ball);
    }

    // Update each ball
    for (let i = 0; i < numBalls; i++) {
      let ball = this.movePath[i];
      let ballProgress = progress - ((i / numBalls) * ballScale * 3);

      if (ballProgress < 0 || ballProgress >= 1) {
        ball.enabled = false;
        continue;
      }

      ball.enabled = true;
      let pos = vec3.lerp(ballStartPos, ballEndPos, ballProgress);
      let height = 5;
      pos.y += height * (4 * ballProgress * (1 - ballProgress)); // Parabolic arc
      ball.getTransform().setWorldPosition(pos);
    }

  }
}
