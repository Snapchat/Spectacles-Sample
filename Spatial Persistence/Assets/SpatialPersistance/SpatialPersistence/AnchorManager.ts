import { Anchor, State, UserAnchor } from "Spatial Anchors.lspkg/Anchor";
import {
  AnchorSession,
  AnchorSessionOptions,
} from "Spatial Anchors.lspkg/AnchorSession";
import Event, {
  PublicApi,
  unsubscribe,
} from "SpectaclesInteractionKit.lspkg/Utils/Event";

import { AnchorModule } from "Spatial Anchors.lspkg/AnchorModule";
import { LoggerVisualization } from "Spatial Anchors.lspkg/SpatialPersistence/Logging";

/**
 * Singleton class that handles all invocations of the AnchorModule logic to retrieve spatially persistent anchors.
 * This class is factored to show that the spatial persistence of the AnchorModule is an independent concept from lens-specific content serialization.
 */
export class AnchorManager {
  private static instance: AnchorManager;

  private logger = LoggerVisualization.createLogger("AnchorManager");
  private log = this.logger.log.bind(this.logger);

  // TODO: Remove stub and use actual module.
  private anchorModule: AnchorModule;

  // ---------------------------------------------
  // area selection
  private anchorSession?: AnchorSession;
  private currentCuedSelectArea: Promise<void> | null = null;
  private nextCuedSelectArea: () => Promise<void> | null = () => null;

  private onAreaAnchorFoundEvent: Event<Anchor> = new Event<Anchor>();
  readonly onAreaAnchorFound: PublicApi<Anchor> =
    this.onAreaAnchorFoundEvent.publicApi();

  private currentAnchor: Anchor;

  private anchorFoundUnsubscribes: unsubscribe[] = [];
  private isCreatingNewAnchor: boolean = false;

  private constructor() {
    // TODO: Find a better way of referencing the in-scene module.
    const sceneObjectCount = global.scene.getRootObjectsCount();
    for (let i = 0; i < sceneObjectCount; i++) {
      const sceneObject = global.scene.getRootObject(i);
      if (sceneObject.name === "AnchorModule") {
        this.anchorModule = sceneObject.getComponent(
          AnchorModule.getTypeName()
        );
      }
    }
  }

  static getInstance(): AnchorManager {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new AnchorManager();
    return this.instance;
  }

  // AnchorSession is obtained asynchronously, and this can take time and potentially
  // fail.
  // Only one AnchorSession can be active at a time.
  // Any current AnchorSession is closed before a new one is created - and this also
  // may take time.
  //
  // While shutdown and rescanning is in progress, performing operations on an old session
  // can cause problems.
  //
  // Because of this, for the time being we recommend careful cueing of AnchorSession creation
  // and usage.
  //
  // We implement a cueing system below - in two parts, a 'nextCuedSelectArea' is prepared, and
  // actioned as the current 'cuedSelectArea' if possible. The last part of any 'nextCuedSelectArea'
  // operation is to check to see if there is another 'nextCuedSelectArea' operation to perform.
  //
  // The lens user can then do as many select area operations as they like; while the system must
  // wait for the current operation to complete before starting the next one, it will start the
  // next one as soon as possible.
  //
  // Also if the user preempts the next operation with a different one, it just replaces the
  // current 'nextCuedSelectArea' with the new one.
  //
  // Cue a select area operation to happen as soon as possible
  // the operation will be supplied by the nextCuedSelectArea function
  // once in progress it will be stored in currentCuedSelectArea
  // when any operation completes it will check to see if there is another cued operation
  // new 'next' operations will replace the current 'next' operation
  //
  // The 'afterSelect' function is called after the operation is complete.
  // TODO: replace with chainable promise
  private cueSelectArea(areaId: string, afterSelect: () => void) {
    this.nextCuedSelectArea = async (): Promise<void> | null => {
      if (this.anchorSession) {
        await this.anchorSession.close();
        this.anchorSession = null;
      }
      this.anchorSession = await this.createAnchorSession(areaId);
      this.followSession(this.anchorSession);
      afterSelect();

      // re-cue if someone has selected while previous cue was in progress
      this.currentCuedSelectArea = this.nextCuedSelectArea();
      this.nextCuedSelectArea = () => null;
    };

    // if there is no current cue, start it
    if (!this.currentCuedSelectArea) {
      this.currentCuedSelectArea = this.nextCuedSelectArea();
      this.nextCuedSelectArea = () => null;
    }
  }

  public selectArea(areaId: string, afterSelect: () => void) {
    this.cueSelectArea(areaId, afterSelect);
  }

  private async createAnchorSession(areaId: string): Promise<AnchorSession> {
    let options = new AnchorSessionOptions();
    options.area = areaId;
    options.scanForWorldAnchors = true;
    try {
      this.log("Scanning for anchors in area: " + areaId);
      let session = await this.anchorModule.openSession(options);
      return session;
    } catch (error) {
      this.log("Error creating anchor session: " + error);
    }
  }
  private followSession(session: AnchorSession) {
    this.log(`AnchorManager: adding onAnchorNearby callbacks to session`);
    // Operates under the assumption of a mono anchor.
    session.onAnchorNearby.add((anchor) => {
      this.log(`AnchorManager: onAnchorNearby id: ${anchor.id}`);
      // TODO: Shift to onFound event rather than onStateChange event if available.
      this.anchorFoundUnsubscribes.push(
        anchor.onFound.add(() => {
          this.currentAnchor = anchor;
          this.log(
            `AnchorManager: onAnchorFound: ${this.currentAnchor.toWorldFromAnchor.column3} and id: ${this.currentAnchor.id}`
          );
          // We are ready to return the transform of the anchor for the area manager to set up the notes.
          this.onAreaAnchorFoundEvent.invoke(this.currentAnchor);
        })
      );
    });
  }

  /**
   * Reset the current area and remove any existing anchors.
   */
  async resetArea(): Promise<void> {
    this.log(`AnchorManager: resetArea`);
    this.currentAnchor = undefined;
    await this.anchorSession.reset();
  }

  // TODO: Create anchor relative to the passed position/rotation (which depends on user's gaze)
  /**
   * Create a mono-anchor for the current area using the AnchorModule. This mono-anchor is used in AreaManager to set the transform of the widget parent.
   * @param anchorPosition - the desired world position of the area's mono-anchor.
   * @param anchorRotation - the desired world rotation of the area's mono-anchor.
   */
  public createAreaAnchor(anchorPosition: vec3, anchorRotation: quat): void {
    this.isCreatingNewAnchor = true;

    for (let i = 0; i < this.anchorFoundUnsubscribes.length; i++) {
      this.anchorFoundUnsubscribes[i]();
    }
    this.anchorFoundUnsubscribes = [];

    this.log(
      `AnchorManager: createAnchor w/ position ${anchorPosition} and rotation ${anchorRotation}`
    );

    this.currentAnchor = undefined;

    this.anchorSession
      .createWorldAnchor(
        mat4.compose(anchorPosition, anchorRotation, vec3.one())
      )
      .then(async (anchor): Promise<UserAnchor> => {
        this.log(
          `AnchorManager: createAnchor success:${anchor.toWorldFromAnchor.column3} and id: ${anchor.id}}`
        );
        if (this.anchorSession) {
          // TODO: this will delay until tracking; we could continue here if the calling logic didn't expect
          // the anchor to be persisted at this point
          return await this.anchorSession.saveAnchor(anchor);
        } else {
          throw new Error("No AnchorSession");
        }
      })
      .then(async (anchor) => {
        this.log(
          `AnchorManager: saveAnchor success:${anchor.toWorldFromAnchor.column3} and id: ${anchor.id}}`
        );
        // TODO: Once onFound fires post-resolve, rework this logic.
        // The onFound event immediately fires, callback won't happen, so we manually check state after creation.
        if (anchor.state === State.Found) {
          this.currentAnchor = anchor;
          this.log(
            `AnchorManager: immediately found:${this.currentAnchor.toWorldFromAnchor.column3} and id: ${this.currentAnchor.id}}`
          );
          this.onAreaAnchorFoundEvent.invoke(this.currentAnchor);
        } else {
          // anchor.onFound.add(() => {
          //   this.log(`AnchorManager: anchor.onFound in createAnchor`);
          // });
        }
        this.isCreatingNewAnchor = false;
      })
      .catch((error) => {
        this.log(`AnchorManager: createAreaAnchor error: ${error}`);
        this.isCreatingNewAnchor = false;
      });
  }

  /**
   * Update the transform of the current area's mono-anchor.
   * @param anchorPosition - the desired world position of the area's mono-anchor.
   * @param anchorRotation - the desired world rotation of the area's mono-anchor.
   */
  public updateAreaAnchor(
    anchorPosition: vec3,
    anchorRotation: quat
  ): Promise<UserAnchor> {
    this.currentAnchor.toWorldFromAnchor = mat4.compose(
      anchorPosition,
      anchorRotation,
      vec3.one()
    );
    this.log(
      `AnchorManager: updateAnchor: ${this.currentAnchor.toWorldFromAnchor}`
    );
    return this.anchorSession.saveAnchor(this.currentAnchor);
  }
}
