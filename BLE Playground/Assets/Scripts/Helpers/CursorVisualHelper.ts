import { CursorController } from "SpectaclesInteractionKit.lspkg/Components/Interaction/InteractorCursor/CursorController";
import { InteractorCursor } from "SpectaclesInteractionKit.lspkg/Components/Interaction/InteractorCursor/InteractorCursor";

@component
export class CursorVisualHelper extends BaseScriptComponent {

    @input
    cursorController: CursorController

    private static instance: CursorVisualHelper;
    private originalRenderOrder: number;

    private constructor() {
        super();
    }

    public static getInstance(): CursorVisualHelper {
        if (!CursorVisualHelper.instance) {
            throw new Error("Trying to get CursorVisualHelper instance, but it hasn't been set.  You need to call it later.");
        }
        return CursorVisualHelper.instance;
    }

    onAwake() {
        this.originalRenderOrder = 9999;
        if (!CursorVisualHelper.instance) {
            CursorVisualHelper.instance = this;
        } else {
            throw new Error("CursorVisualHelper already has an instance.  Aborting.")
        }
    }

    showCursor(show: boolean) {
        let cursors:InteractorCursor[] = this.cursorController.getAllCursors();
        cursors.forEach(cursor => {
            if (show) {
                cursor.renderOrder = this.originalRenderOrder;
            } else {
                cursor.renderOrder = -1;
            }
        });
    }
}
