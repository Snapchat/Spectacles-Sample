import Event, { PublicApi } from "SpectaclesInteractionKit.lspkg/Utils/Event";
import { SnapToWorld } from "./WorldQuery/SnapToWorld";
import { Interactable } from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable";
import {
  lerp,
  mapValue,
  clamp,
} from "SpectaclesInteractionKit.lspkg/Utils/mathUtils";
import { easingFunctions } from "SpectaclesInteractionKit.lspkg/Utils/animate";
import { Billboard } from "SpectaclesInteractionKit.lspkg/Components/Interaction/Billboard/Billboard";

@component
export class Widget extends BaseScriptComponent {
  @input("string")
  private _text: string;

  @input
  private textComponent: Text;

  private _prefabIndex: number;

  private _widgetIndex: number;

  private interactable: Interactable;
  private doInterpolate = false;
  private interpolateStartTime = 0;
  private interpolateEndTime = 0;
  private interpolateRotStart: quat = quat.quatIdentity();
  private interpolateRotEnd: quat = quat.quatIdentity();
  private interpolatePosStart: vec3 = vec3.zero();
  private interpolatePosEnd: vec3 = vec3.zero();

  private easingFunction = easingFunctions["ease-out-quart"];

  private snapToWorld: SnapToWorld;

  private billboard: Billboard;

  private onDeleteEvent: Event<number> = new Event<number>();
  readonly onDelete: PublicApi<number> = this.onDeleteEvent.publicApi();

  private onUpdateContentEvent: Event<void> = new Event<void>();
  readonly onUpdateContent: PublicApi<void> =
    this.onUpdateContentEvent.publicApi();

  onAwake() {
    this.createEvent("OnStartEvent").bind(this.onStart.bind(this));
  }

  private onStart() {
    this.snapToWorld = SnapToWorld.getInstance();
    this.interactable = this.sceneObject.getComponent(
      Interactable.getTypeName()
    );
    this.billboard = this.sceneObject.getComponent(Billboard.getTypeName());
    this.interactable.onDragStart.add((eventData) => {
      if (eventData.propagationPhase === "Target") {
        this.snapToWorld.startManipulating(eventData);
        this.billboard.enabled = true;
      }
    });
    this.interactable.onDragUpdate.add((eventData) => {
      if (eventData.propagationPhase === "Target") {
        this.snapToWorld.updateManipulating(eventData);
      }
    });

    this.interactable.onDragEnd.add((eventData) => {
      if (eventData.propagationPhase === "Target") {
        //print("Note Drag End")

        // TEMP
        let transformOnNoteInWorld = this.snapToWorld.getCurrentTransform();
        if (transformOnNoteInWorld) {
          //print( "Note We have a Transform in Note on End ****" + transformOnNoteInWorld.getWorldPosition() + " " + transformOnNoteInWorld.getWorldRotation() + " " + transformOnNoteInWorld.getWorldScale() )

          // TEMP
          const ANIMATION_LENGTH = 0.45;
          this.interpolateStartTime = getTime();
          this.interpolateEndTime =
            this.interpolateStartTime + ANIMATION_LENGTH;

          this.interpolatePosStart = this.getSceneObject()
            .getTransform()
            .getWorldPosition();
          this.interpolatePosEnd = transformOnNoteInWorld.getWorldPosition();

          this.interpolateRotStart = this.getSceneObject()
            .getTransform()
            .getWorldRotation();
          this.interpolateRotEnd = transformOnNoteInWorld.getWorldRotation();

          this.doInterpolate = true;
        } else {
          //print("Note this.snapToWorld.getCurrentTransform() was null")
        }

        this.snapToWorld.endManipulating(eventData);
        this.billboard.enabled = false;
      }
    });

    this.createEvent("UpdateEvent").bind(() => {
      if (this.doInterpolate) {
        let frac = mapValue(
          getTime(),
          this.interpolateStartTime,
          this.interpolateEndTime,
          0,
          1
        );
        if (frac >= 1.0) {
          this.doInterpolate = false;
          // Serialize after the animation is finished.
          this.updateContent();
        }

        frac = clamp(frac, 0, 1);
        frac = this.easingFunction(frac);

        let p = vec3.lerp(
          this.interpolatePosStart,
          this.interpolatePosEnd,
          frac
        );
        let rot = quat.slerp(
          this.interpolateRotStart,
          this.interpolateRotEnd,
          frac
        );

        this.getSceneObject().getTransform().setWorldPosition(p);
        this.getSceneObject().getTransform().setWorldRotation(rot);
      }
    });
  }

  public set text(text: string) {
    this._text = text;
    this.textComponent.text = text;
  }

  public get text(): string {
    return this.textComponent.text;
  }

  public set prefabIndex(prefabIndex: number) {
    this._prefabIndex = prefabIndex;
  }

  public get prefabIndex(): number {
    return this._prefabIndex;
  }

  public set widgetIndex(widgetIndex: number) {
    this._widgetIndex = widgetIndex;
  }

  public get widgetIndex(): number {
    return this._widgetIndex;
  }

  public get transform(): Transform {
    return this.getTransform();
  }

  public updateContent(): void {
    this.onUpdateContentEvent.invoke();
  }

  public delete(): void {
    this.onDeleteEvent.invoke(this._widgetIndex);
  }
}
