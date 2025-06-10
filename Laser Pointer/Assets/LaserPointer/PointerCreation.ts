import { Pointer } from "./Pointer";
import { Instantiator } from "SpectaclesSyncKit.lspkg/Components/Instantiator";
import { NetworkRootInfo } from "SpectaclesSyncKit.lspkg/Core/NetworkRootInfo";
import { SyncEntity } from "SpectaclesSyncKit.lspkg/Core/SyncEntity";
import { Interactable } from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable";
import { Interactor } from "SpectaclesInteractionKit.lspkg/Core/Interactor/Interactor";
import { InteractorEvent } from "SpectaclesInteractionKit.lspkg/Core/Interactor/InteractorEvent";
import { HSLToRGB } from "SpectaclesInteractionKit.lspkg/Utils/color";

@component
export class PointerCreation extends BaseScriptComponent {
    // The interactable that will trigger the pointer creation
    @input
    targetObjectInteractable: Interactable

    // The Instantiator used to create new pointers
    @input
    pointerInstantiator: Instantiator

    // The pointer prefab to be instantiated
    @input
    pointerPrefab: ObjectPrefab

    onAwake() {
        this.targetObjectInteractable.onTriggerStart.add((interactorEvent: InteractorEvent) => {
            this.spawnPointer(interactorEvent.interactor);
            
        });
    }

    
    private spawnPointer(interactor: Interactor) {
        // Create a new pointer instance using the Instantiator
        this.pointerInstantiator.instantiate(this.pointerPrefab, {}, (networkRootInfo: NetworkRootInfo) => {
            const object = networkRootInfo.instantiatedObject;
            const pointerComponent = object.getComponent<Pointer>(Pointer.getTypeName());
            if (pointerComponent) {
                pointerComponent.setInteractor(interactor);
            }
        });
    }

}
