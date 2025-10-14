import { Instantiator } from "SpectaclesSyncKit.lspkg/Components/Instantiator";
import { SessionController } from "SpectaclesSyncKit.lspkg/Core/SessionController";
import { PlayerObjectController } from "./PlayerObjectController";

@component
export class PlayerObjectManager extends BaseScriptComponent {

    @input
    instantiator: Instantiator

    @input
    playerObjectPrefab: ObjectPrefab

    private myPlayerObject: PlayerObjectController;



    onAwake() {
        this.createEvent("OnStartEvent").bind(() => this.onStart());
    }

    onStart() {
        SessionController.getInstance().notifyOnReady(() => {
            this.instantiator.notifyOnReady(() => {
                this.instantiatePlayerObject();
            });
        });
    }

    onUpdate() {
        this.myPlayerObject.onUpdate();
    }

    subscribe(playerObject: PlayerObjectController) {
        this.myPlayerObject = playerObject;
        this.createEvent("UpdateEvent").bind(() => this.onUpdate());
    }
    /**
     * Instantiate the player object for the local user.
     * This is called when the session is ready and the instantiator is ready.
     */

    instantiatePlayerObject() {
        print("Instantiating player object for " + SessionController.getInstance().getLocalUserName());
        this.instantiator.instantiate(this.playerObjectPrefab);
    }

}
