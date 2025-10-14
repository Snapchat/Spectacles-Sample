import { SyncEntity } from "SpectaclesSyncKit.lspkg/Core/SyncEntity";
import { StorageProperty } from "SpectaclesSyncKit.lspkg/Core/StorageProperty";
import WorldCameraFinderProvider from "SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider";
import { PlayerObjectManager } from "./PlayerObjectManager";
import { PlayerColorAssigner } from "../Utils/PlayerColorAssigner";

@component
export class PlayerObjectController extends BaseScriptComponent {
  @input
  playerObjectManager: PlayerObjectManager;
  
  @input
  @hint("Array of materials for different player colors")
  playerColorMaterials: Material[] = [];

  private syncEntity: SyncEntity = new SyncEntity(this);
  private cameraTransform: Transform =
    WorldCameraFinderProvider.getInstance().getTransform();
  private transform: Transform = this.sceneObject.getTransform();
  private previousPos: vec3 = new vec3(0, 0, 0);
  private up = new vec3(0, 1, 0);
  private assignedColorIndex: number = 0;

  onUpdate() {
    // tether object 
    // Update the player object pose for the local player here, gets synced via SyncTransform
    const forward = this.cameraTransform.forward.mult(new vec3(1, 0, 1));
    const newPos = this.cameraTransform
      .getWorldPosition()
      .add(forward.uniformScale(-50));
    const updatePos = vec3.lerp(this.previousPos, newPos, getDeltaTime() * 5);
    this.transform.setWorldPosition(updatePos);
    this.previousPos = updatePos;
  }

  onStart() {
    this.sceneObject.getChild(0).enabled = true;
    //this.syncEntity.addStorageProperty(this.somethingHappenedProp);

    this.syncEntity.notifyOnReady(() => {
      // Assign color based on owner's connectionId
      this.assignPlayerColor();
      
      if (this.syncEntity.networkRoot.locallyCreated) {
        // Set start position
        const forward = this.cameraTransform.forward.mult(new vec3(1, 0, 1));
        this.previousPos = this.cameraTransform
          .getWorldPosition()
          .add(forward.uniformScale(-50));
        this.transform.setWorldPosition(this.previousPos);

        // Enable the player object content and subscribe to PlayerObjectManager
        this.sceneObject.name = this.sceneObject.name + " (Local Player)";
        this.sceneObject.getChild(0).enabled = true;
        this.playerObjectManager.subscribe(this);
      } else {
        this.sceneObject.name = this.sceneObject.name + " (Remote Player)";
      }
    });
  }

  /**
   * Assign a color to this player based on their connectionId
   */
  private assignPlayerColor() {
    // Validate we have color materials
    if (!this.playerColorMaterials || this.playerColorMaterials.length === 0) {
      print("⚠️ PlayerObjectController: No color materials assigned");
      return;
    }
    
    // Validate color count is reasonable
    PlayerColorAssigner.validateColorCount(this.playerColorMaterials.length);
    
    // Get owner's connectionId
    const ownerInfo = this.syncEntity.networkRoot.ownerInfo;
    if (!ownerInfo) {
      print("⚠️ PlayerObjectController: No owner info available");
      return;
    }
    
    // Calculate color index
    this.assignedColorIndex = PlayerColorAssigner.getColorIndexForPlayer(
      ownerInfo.connectionId, 
      this.playerColorMaterials.length
    );
    
    const colorName = PlayerColorAssigner.getColorName(this.assignedColorIndex);
    print(`🎨 PlayerObjectController: Assigned ${colorName} (index ${this.assignedColorIndex}) to player ${ownerInfo.displayName || ownerInfo.connectionId}`);
    
    // Apply the material to player visual
    this.applyColorMaterial();
  }
  
  /**
   * Apply the assigned color material to the player's visual components
   */
  private applyColorMaterial() {
    if (!this.playerColorMaterials || this.playerColorMaterials.length === 0) {
      print("⚠️ PlayerObjectController: No color materials assigned");
      return;
    }
    
    if (this.assignedColorIndex >= this.playerColorMaterials.length) {
      print(`⚠️ PlayerObjectController: Color index ${this.assignedColorIndex} out of range (max: ${this.playerColorMaterials.length - 1})`);
      return;
    }
    
    const selectedMaterial = this.playerColorMaterials[this.assignedColorIndex];
    if (!selectedMaterial) {
      print("⚠️ PlayerObjectController: Selected material is null");
      return;
    }
    
    print(`🎨 PlayerObjectController: Applying ${PlayerColorAssigner.getColorName(this.assignedColorIndex)} material to player object`);
    
    // Apply material to all MaterialMeshVisual and RenderMeshVisual components in children
    this.applyMaterialToChildren(this.sceneObject, selectedMaterial);
  }
  
  /**
   * Recursively apply material to all MaterialMeshVisual and RenderMeshVisual components
   */
  private applyMaterialToChildren(obj: SceneObject, material: Material) {
    // Try MaterialMeshVisual first
    const materialMeshVisual = obj.getComponent("Component.MaterialMeshVisual") as MaterialMeshVisual;
    if (materialMeshVisual) {
      materialMeshVisual.mainMaterial = material;
      print(`🎨 Applied ${PlayerColorAssigner.getColorName(this.assignedColorIndex)} material to MaterialMeshVisual on ${obj.name}`);
    }
    
    // Try RenderMeshVisual (for prefabs with RenderMeshVisual)
    const renderMeshVisual = obj.getComponent("Component.RenderMeshVisual") as RenderMeshVisual;
    if (renderMeshVisual) {
      renderMeshVisual.mainMaterial = material;
      print(`🎨 Applied ${PlayerColorAssigner.getColorName(this.assignedColorIndex)} material to RenderMeshVisual on ${obj.name}`);
    }
    
    // Apply to children recursively
    for (let i = 0; i < obj.getChildrenCount(); i++) {
      this.applyMaterialToChildren(obj.getChild(i), material);
    }
  }
  
  /**
   * Get the assigned color index for this player
   */
  public getAssignedColorIndex(): number {
    return this.assignedColorIndex;
  }
  
  /**
   * Get the assigned color name for this player
   */
  public getAssignedColorName(): string {
    return PlayerColorAssigner.getColorName(this.assignedColorIndex);
  }

  onAwake() {
    this.createEvent("OnStartEvent").bind(() => this.onStart());
  }
}
