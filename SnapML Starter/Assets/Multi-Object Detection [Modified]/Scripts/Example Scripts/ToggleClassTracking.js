// ToggleClassTracking.js
// Version: 1.0.0
// Event: OnAwake
// Allows to toggle class by index
// Attach this script to a mesh visual to tap on (for example Image)

const colorWhite = vec4.one();
const colorGray = new vec4(0.3, 0.3, 0.3, 1.0);

//@input Component.ScriptComponent mlController
/** @type {ScriptComponent} */
var mlController = script.mlController;
if (!mlController || !mlController.onDetectionsUpdated) {
  print("Error, MLController script input is not set or wrong script referenced");
  return;
}

//@input int classIndex
/** @type {number} */
var classIndex = script.classIndex;

/** @type {SceneObject} */
var so = script.getSceneObject();

/** @type {MeshVisual} */
var meshVisual = so.getComponent("Component.MaterialMeshVisual");

/** @type {boolean} */
var isTracking;

/** @type {InteractionComponent} */
var interactionComponent = so.createComponent("InteractionComponent");
interactionComponent.addMeshVisual(meshVisual);
interactionComponent.onTouchStart.add(toggle);

function toggle() {
  isTracking = !mlController.getClassEnabled(classIndex);

  mlController.setClassEnabled(classIndex, isTracking);

  if (meshVisual.mainPass && meshVisual.mainPass.baseColor != undefined) {
    meshVisual.mainPass.baseColor = isTracking ? colorWhite : colorGray;
  }
}
