import { SyncEntity } from "SpectaclesSyncKit.lspkg/Core/SyncEntity";
import { StorageProperty } from "SpectaclesSyncKit.lspkg/Core/StorageProperty";
import WorldCameraFinderProvider from "SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider";
import TrackedHand from "SpectaclesInteractionKit.lspkg/Providers/HandInputData/TrackedHand";
import { SIK } from "SpectaclesInteractionKit.lspkg/SIK";
import { PlayerColorAssigner } from "../Utils/PlayerColorAssigner";

// Forward declaration to avoid circular imports
declare class HandObjectManager extends BaseScriptComponent {
  subscribe(handObject: HandObjectController): void;
}

@component
export class HandObjectController extends BaseScriptComponent {
  @input
  handObjectManager: HandObjectManager;

  @input
  handType: string = "left"; // "left" or "right"

  @input
  testingMode: boolean = false;
  
  @input
  @hint("Array of materials for different hand colors")
  handColorMaterials: Material[] = [];

  private syncEntity: SyncEntity = new SyncEntity(this);
  private cameraTransform: Transform = WorldCameraFinderProvider.getInstance().getTransform();
  private transform: Transform = this.sceneObject.getTransform();
  private previousPos: vec3 = new vec3(0, 0, 0);
  
  // Hand tracking references (using SIK)
  private trackedHand: TrackedHand;
  private assignedColorIndex: number = 0;

  onUpdate() {
    // Only update position for local player's hands
    if (!this.syncEntity || !this.syncEntity.networkRoot.locallyCreated) {
      return;
    }

    let newPos: vec3;

    if (this.testingMode) {
      // Testing mode: use camera position with offset
      const cameraPos = this.cameraTransform.getWorldPosition();
      const forward = this.cameraTransform.forward.uniformScale(20); // 20cm forward
      const handsCenter = cameraPos.add(forward);
      
      // Offset left/right based on hand type
      const lateralOffset = this.handType === "left" ? new vec3(-5, 0, 0) : new vec3(5, 0, 0);
      newPos = handsCenter.add(lateralOffset);
      
      print(`📝 Testing: ${this.handType} hand at (${newPos.x.toFixed(2)}, ${newPos.y.toFixed(2)}, ${newPos.z.toFixed(2)})`);
    } else {
      // Normal mode: use SIK hand tracking
      if (this.trackedHand && this.trackedHand.isTracked()) {
        newPos = this.trackedHand.getPalmCenter();
      } else {
        // Hand not tracked, keep previous position or hide
        this.sceneObject.enabled = false;
        return;
      }
    }

    // Smooth position update
    const updatePos = vec3.lerp(this.previousPos, newPos, getDeltaTime() * 10);
    this.transform.setWorldPosition(updatePos);
    this.previousPos = updatePos;
    this.sceneObject.enabled = true;
  }

  onStart() {
    this.syncEntity.notifyOnReady(() => {
      // Assign color based on owner's connectionId
      this.assignHandColor();
      
      if (this.syncEntity.networkRoot.locallyCreated) {
        // This is MY hand representation
        print(`Setting up local ${this.handType} hand`);
        
        // Initialize hand tracking
        this.trackedHand = SIK.HandInputData.getHand(this.handType as any);
        
        // Set initial position
        if (this.testingMode) {
          const cameraPos = this.cameraTransform.getWorldPosition();
          const forward = this.cameraTransform.forward.uniformScale(20);
          const handsCenter = cameraPos.add(forward);
          const lateralOffset = this.handType === "left" ? new vec3(-5, 0, 0) : new vec3(5, 0, 0);
          this.previousPos = handsCenter.add(lateralOffset);
        } else if (this.trackedHand && this.trackedHand.isTracked()) {
          this.previousPos = this.trackedHand.getPalmCenter();
        } else {
          this.previousPos = vec3.zero();
        }
        
        this.transform.setWorldPosition(this.previousPos);

        // Enable the hand object content and subscribe to HandObjectManager
        this.sceneObject.name = this.sceneObject.name + ` (Local ${this.handType} Hand)`;
        this.sceneObject.getChild(0).enabled = true;
        this.handObjectManager.subscribe(this);
      } else {
        // This represents another player's hand
        print(`Setting up remote ${this.handType} hand`);
        this.sceneObject.name = this.sceneObject.name + ` (Remote ${this.handType} Hand)`;
        this.sceneObject.getChild(0).enabled = true;
      }
    });
  }

  getWorldPosition(): vec3 {
    return this.transform.getWorldPosition();
  }

  getHandType(): string {
    return this.handType;
  }

  isLocalHand(): boolean {
    return this.syncEntity && this.syncEntity.networkRoot && this.syncEntity.networkRoot.locallyCreated;
  }

  isHandTracked(): boolean {
    if (this.testingMode) {
      return true; // Always tracked in testing mode
    }
    return this.trackedHand && this.trackedHand.isTracked();
  }

  /**
   * Assign a color to this hand based on the owner's connectionId
   */
  private assignHandColor() {
    // Validate we have color materials
    if (!this.handColorMaterials || this.handColorMaterials.length === 0) {
      print("⚠️ HandObjectController: No hand color materials assigned");
      return;
    }
    
    // Get owner's connectionId
    const ownerInfo = this.syncEntity.networkRoot.ownerInfo;
    if (!ownerInfo) {
      print("⚠️ HandObjectController: No owner info available");
      return;
    }
    
    // Calculate color index (same as player color for consistency)
    this.assignedColorIndex = PlayerColorAssigner.getColorIndexForPlayer(
      ownerInfo.connectionId, 
      this.handColorMaterials.length
    );
    
    const colorName = PlayerColorAssigner.getColorName(this.assignedColorIndex);
    print(`🎨 HandObjectController: Assigned ${colorName} (index ${this.assignedColorIndex}) to ${this.handType} hand of ${ownerInfo.displayName || ownerInfo.connectionId}`);
    
    // Apply the material to hand visual
    this.applyHandColorMaterial();
  }
  
  /**
   * Apply the assigned color material to the hand's visual components
   */
  private applyHandColorMaterial() {
    if (!this.handColorMaterials || this.assignedColorIndex >= this.handColorMaterials.length) {
      return;
    }
    
    const selectedMaterial = this.handColorMaterials[this.assignedColorIndex];
    if (!selectedMaterial) {
      print("⚠️ HandObjectController: Selected hand material is null");
      return;
    }
    
    // Apply material to all MaterialMeshVisual components in children
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
      print(`🎨 Applied ${PlayerColorAssigner.getColorName(this.assignedColorIndex)} material to MaterialMeshVisual on ${this.handType} hand ${obj.name}`);
    }
    
    // Try RenderMeshVisual (for prefabs with RenderMeshVisual)
    const renderMeshVisual = obj.getComponent("Component.RenderMeshVisual") as RenderMeshVisual;
    if (renderMeshVisual) {
      renderMeshVisual.mainMaterial = material;
      print(`🎨 Applied ${PlayerColorAssigner.getColorName(this.assignedColorIndex)} material to RenderMeshVisual on ${this.handType} hand ${obj.name}`);
    }
    
    // Apply to children recursively
    for (let i = 0; i < obj.getChildrenCount(); i++) {
      this.applyMaterialToChildren(obj.getChild(i), material);
    }
  }
  
  /**
   * Get the assigned color index for this hand
   */
  public getAssignedColorIndex(): number {
    return this.assignedColorIndex;
  }
  
  /**
   * Get the assigned color name for this hand
   */
  public getAssignedColorName(): string {
    return PlayerColorAssigner.getColorName(this.assignedColorIndex);
  }

  onAwake() {
    this.createEvent("OnStartEvent").bind(() => this.onStart());
  }
}
