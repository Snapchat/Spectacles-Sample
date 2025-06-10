@component
export class DebugVisualizer extends BaseScriptComponent {
  @input pointPrefab: ObjectPrefab;
  @input pointPrefabVertex: ObjectPrefab;
  @input testCamVisualObj: SceneObject;

  onAwake() {
    this.createEvent("OnStartEvent").bind(this.onStart.bind(this));
  }

  private onStart() {
    this.testCamVisualObj.enabled = true;
  }

  updateCameraFrame(cameraFrame: Texture) {
    this.destroyAllLocalPoints(this.testCamVisualObj);
    this.testCamVisualObj.getComponent("RenderMeshVisual").mainPass.baseTex =
      cameraFrame;
  }

  visualizeLocalPoint(pixelPos: vec2, cameraFrame: Texture) {
    print(
      "visualizeLocalPoint" +
        "pixel pos" +
        pixelPos +
        "cam" +
        cameraFrame.getWidth() +
        "x" +
        cameraFrame.getHeight()
    );

    var localX = MathUtils.remap(
      pixelPos.x,
      0,
      cameraFrame.getWidth(),
      -0.5,
      0.5
    );
    // this one is flipped earlier for lens studio
    var localY = MathUtils.remap(
      pixelPos.y,
      0,
      cameraFrame.getHeight(),
      0.5,
      -0.5
    );
    var localPos = new vec3(localX, localY, 0.01);
    var pointObj = this.pointPrefab.instantiate(this.testCamVisualObj);
    print("instantiate point prefab: " + pointObj.name);
    var pointTrans = pointObj.getTransform();
    pointTrans.setLocalPosition(localPos);
    pointTrans.setWorldScale(vec3.one().uniformScale(0.5));
  }

  visualizeBoundingBoxVertices(bbox: number[], cameraFrame: Texture) {
    // bbox format: [centerX, centerY, width, height] (normalized 0-1)
    const centerX = bbox[0];
    const centerY = bbox[1];
    const width = bbox[2];
    const height = bbox[3];

    // Calculate half dimensions
    const halfWidth = width / 2;
    const halfHeight = height / 2;

    // Calculate the 4 corner vertices in normalized coordinates
    const topLeft = new vec2(centerX - halfWidth, centerY - halfHeight);
    const topRight = new vec2(centerX + halfWidth, centerY - halfHeight);
    const bottomLeft = new vec2(centerX - halfWidth, centerY + halfHeight);
    const bottomRight = new vec2(centerX + halfWidth, centerY + halfHeight);

    // Convert normalized coordinates to pixel coordinates
    const frameWidth = cameraFrame.getWidth();
    const frameHeight = cameraFrame.getHeight();

    const vertices = [
      new vec2(topLeft.x * frameWidth, topLeft.y * frameHeight),
      new vec2(topRight.x * frameWidth, topRight.y * frameHeight),
      new vec2(bottomLeft.x * frameWidth, bottomLeft.y * frameHeight),
      new vec2(bottomRight.x * frameWidth, bottomRight.y * frameHeight),
    ];

    print(
      `Visualizing bounding box vertices for bbox [${centerX.toFixed(
        3
      )}, ${centerY.toFixed(3)}, ${width.toFixed(3)}, ${height.toFixed(3)}]`
    );

    // Visualize each vertex
    vertices.forEach((vertex, index) => {
      this.visualizeBoundingBoxVertex(vertex, cameraFrame, index);
    });
  }

  private visualizeBoundingBoxVertex(
    pixelPos: vec2,
    cameraFrame: Texture,
    vertexIndex: number
  ) {
    var localX = MathUtils.remap(
      pixelPos.x,
      0,
      cameraFrame.getWidth(),
      -0.5,
      0.5
    );
    // this one is flipped earlier for lens studio
    var localY = MathUtils.remap(
      pixelPos.y,
      0,
      cameraFrame.getHeight(),
      0.5,
      -0.5
    );

    // Offset vertices slightly forward from center point to avoid z-fighting
    var localPos = new vec3(localX, localY, 0.02);
    var pointObj = this.pointPrefabVertex.instantiate(this.testCamVisualObj);
    pointObj.name = `BBoxVertex_${vertexIndex}`;

    var pointTrans = pointObj.getTransform();
    pointTrans.setLocalPosition(localPos);
    // Make vertices slightly smaller than center points
    pointTrans.setWorldScale(vec3.one().uniformScale(0.3));

    print(
      `Visualized vertex ${vertexIndex} at pixel (${pixelPos.x.toFixed(
        1
      )}, ${pixelPos.y.toFixed(1)}) -> local (${localX.toFixed(
        3
      )}, ${localY.toFixed(3)})`
    );
  }

  private destroyAllLocalPoints(parentObj: SceneObject) {
    var points = [];
    for (var i = 0; i < parentObj.getChildrenCount(); i++) {
      var childObj = parentObj.getChild(i);
      points.push(childObj);
    }
    for (var i = 0; i < points.length; i++) {
      var child = points[i];
      child.destroy();
    }
  }
}
