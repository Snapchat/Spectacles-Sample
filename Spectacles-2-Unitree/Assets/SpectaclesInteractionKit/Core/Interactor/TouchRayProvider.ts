import WorldCameraFinderProvider from "../../Providers/CameraProvider/WorldCameraFinderProvider"
import {RaycastInfo, RayProvider} from "./RayProvider"

/**
 * Constructs the {@link RaycastInfo} from the cursor position after a touch event has happened.
 */
export class TouchRayProvider implements RayProvider {
  private raycastInfo: RaycastInfo | null = null
  private cursorPosition: vec2 | null = null
  private camera = WorldCameraFinderProvider.getInstance()

  constructor(script: ScriptComponent, maxRayDistance: number) {
    script
      .createEvent("TouchStartEvent")
      .bind(this.onTouchStartEvent.bind(this))

    script.createEvent("TouchMoveEvent").bind(this.onTouchMoveEvent.bind(this))

    script.createEvent("TouchEndEvent").bind(this.onTouchEndEvent.bind(this))

    script.createEvent("HoverEvent").bind(this.onHoverEvent.bind(this))

    script.createEvent("UpdateEvent").bind(() => {
      if (this.cursorPosition === null) {
        this.raycastInfo = null
      } else {
        const locus = this.camera.screenSpaceToWorldSpace(
          this.cursorPosition.x,
          this.cursorPosition.y,
          0
        )
        this.raycastInfo = {
          locus: locus,
          direction: this.camera
            .screenSpaceToWorldSpace(
              this.cursorPosition.x,
              this.cursorPosition.y,
              maxRayDistance
            )
            .sub(locus)
            .normalize(),
        }
      }
    })
  }

  /** @inheritdoc */
  getRaycastInfo(): RaycastInfo {
    return (
      this.raycastInfo ?? {
        direction: vec3.zero(),
        locus: vec3.zero(),
      }
    )
  }

  /** @inheritdoc */
  isAvailable(): boolean {
    return this.cursorPosition !== null
  }

  /** @inheritdoc */
  reset(): void {}

  private onTouchStartEvent(ev: TouchStartEvent): void {
    this.cursorPosition = ev.getTouchPosition()
  }

  private onTouchMoveEvent(ev: TouchMoveEvent): void {
    this.cursorPosition = ev.getTouchPosition()
  }

  private onTouchEndEvent(ev: TouchEndEvent): void {
    this.cursorPosition = ev.getTouchPosition()
  }

  private onHoverEvent(ev: HoverEvent): void {
    this.cursorPosition = ev.getHoverPosition()
  }
}
