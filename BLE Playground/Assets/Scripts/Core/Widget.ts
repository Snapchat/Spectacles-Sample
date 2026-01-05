/**
 * This script handles the generic container for all peripheral controllers.
 * Handle parenting/unparenting when snapped to main hub
 */

import {ContainerFrame} from "SpectaclesInteractionKit.lspkg/Components/UI/ContainerFrame/ContainerFrame"
import {ScanResultType} from "./ScanResult"

@component
export class Widget extends BaseScriptComponent {
  @input
  containerFrame: ContainerFrame

  private onTranslationStartRemover
  private onSnappingCompleteRemover

  private so: SceneObject
  private tr: Transform

  // This is the node on the ble ui hub
  private nodeTr: Transform
  private hiddenPos: vec3

  private isFreed: boolean

  private type: ScanResultType

  private bleHubSo: SceneObject
  private bleHubTr: Transform

  onAwake() {
    this.so = this.getSceneObject()
    this.tr = this.getTransform()
    this.isFreed = false
    this.hiddenPos = new vec3(0, 2000, 0)

    this.createEvent("OnStartEvent").bind(() => this.onStart())
  }

  // NOTE: disabling snapping on container due to bug that will be fixed soon.
  onStart() {
    this.onTranslationStartRemover = this.containerFrame.onTranslationStart.add(() => this.onTranslationStart())
    // this.onSnappingCompleteRemover = this.containerFrame.onSnappingComplete.add(() => this.onSnappingComplete());
  }

  init(node: SceneObject, myType: ScanResultType) {
    this.nodeTr = node.getTransform()
    this.type = myType
    this.bleHubSo = node.getParent()
    this.bleHubTr = this.bleHubSo.getTransform()

    this.parentToHub()
  }

  getType() {
    return this.type
  }

  onTranslationStart() {
    // It's our first translation from the "selected scan result widget" spot on the right of the hub
    if (!this.isFreed) {
      const worldPos = this.tr.getWorldPosition()
      const worldRot = this.tr.getWorldRotation()

      this.containerFrame.getParentTransform().getSceneObject().setParent(null)

      this.tr.setWorldPosition(worldPos)
      this.tr.setWorldRotation(worldRot)

      this.containerFrame.setBillboarding(true, true, false, true, false)
      this.containerFrame.onTranslationStart.remove(this.onTranslationStartRemover)
      this.isFreed = true
    }
  }

  // onSnappingComplete() {
  //     // Do a distance check to the hub
  //     // If we satisfy threshold, parent us to the hub
  //     let distSq = this.bleHubTr.getWorldPosition().distanceSquared(this.tr.getWorldPosition());
  //     if (distSq < 2000) {
  //         // Todo: fix parenting bug by setting isSnappable
  //         // this.parentToHub();
  //     }
  // }

  private parentToHub() {
    const worldPos = this.tr.getWorldPosition()
    this.containerFrame.getParentTransform().getSceneObject().setParent(this.bleHubSo)
    this.containerFrame.worldPosition = worldPos
    this.containerFrame.worldRotation = this.bleHubTr.getWorldRotation()
  }

  show(show: boolean) {
    // Once freed, widget is always shown
    if (!this.isFreed) {
      // Semi-hack: hide in the air.
      // This hides ui and prevents interaction
      // Without disabling functionality.
      if (show) {
        // Once in position near the hub, container snapping will take hold
        this.tr.setWorldPosition(this.nodeTr.getWorldPosition())
        this.tr.setWorldRotation(this.nodeTr.getWorldRotation())
      } else {
        this.tr.setWorldPosition(this.hiddenPos)
      }
    }
  }
}
