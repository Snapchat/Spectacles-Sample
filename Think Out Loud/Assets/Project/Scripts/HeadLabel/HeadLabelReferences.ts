@component
export class HeadLabelReferences extends BaseScriptComponent {
  @input
  @hint("Text component for user name")
  textUserName: Text;

  @input
  @hint("Text component for main status")
  textStatus: Text;

  @input
  @hint("Text component for sub status")
  textSubStatus: Text;
  
  @input
  @hint("Default material for normal/denied ping state")
  pingDefaultMaterial: Material;
  
  @input
  @hint("Material for accepted ping state")
  pingAcceptedMaterial: Material;
  
  @input
  @hint("Array of scene objects with MeshRenderVisual for ping material swapping")
  pingMaterialTargets: SceneObject[] = [];
}
