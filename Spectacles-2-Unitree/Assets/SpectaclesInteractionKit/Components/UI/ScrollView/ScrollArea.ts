import {
  DragInteractorEvent,
  InteractorEvent,
} from "../../../Core/Interactor/InteractorEvent"
import NativeLogger from "../../../Utils/NativeLogger"

import {InteractionManager} from "../../../Core/InteractionManager/InteractionManager"
import {InteractionConfigurationProvider} from "../../../Providers/InteractionConfigurationProvider/InteractionConfigurationProvider"
import Event, {PublicApi} from "../../../Utils/Event"
import {validate} from "../../../Utils/validate"
import View from "../../../Utils/views/View"
import {Interactable} from "../../Interaction/Interactable/Interactable"
import {ScreenTransformBoundariesProvider} from "./boundariesProvider/ScreenTransformBoundariesProvider"
import {ScrollViewFocusEventArgs} from "./ScrollView"

const TAG = "ScrollArea"

/**
 * Defines the scroll area, a box collider that the user can interact with using
 * an {@link Interactor}. The dragging events are exposed to be consumed in {@link ScrollView}
 */
export class ScrollArea extends View {
  private interactionManager: InteractionManager =
    InteractionManager.getInstance()

  private interactionConfigurationProvider: InteractionConfigurationProvider =
    InteractionConfigurationProvider.getInstance()

  // Native Logging
  private log = new NativeLogger(TAG)

  // Private
  private parentScreenTransform: ScreenTransform
  private screenTransform: ScreenTransform
  private collider: ColliderComponent
  private interactable: Interactable | null
  private isDragging = false
  private isFocused = false

  // Events
  private onDragStartEvent = new Event<DragInteractorEvent>()
  readonly onDragStart = this.onDragStartEvent.publicApi()

  private onDragUpdateEvent = new Event<DragInteractorEvent>()
  readonly onDragUpdate = this.onDragUpdateEvent.publicApi()

  private onDragEndEvent = new Event<DragInteractorEvent>()
  readonly onDragEnd = this.onDragEndEvent.publicApi()

  private onFocusEnterEvent = new Event<ScrollViewFocusEventArgs>()
  readonly onFocusEnter = this.onFocusEnterEvent.publicApi()

  private onFocusExitEvent = new Event<ScrollViewFocusEventArgs>()
  readonly onFocusExit = this.onFocusExitEvent.publicApi()

  readonly onTriggerStart: PublicApi<InteractorEvent>
  readonly onTriggerEnd: PublicApi<InteractorEvent>
  readonly onTriggerCanceled: PublicApi<InteractorEvent>

  // Readonly
  private _boundariesProvider: ScreenTransformBoundariesProvider

  get boundariesProvider(): ScreenTransformBoundariesProvider {
    return this._boundariesProvider
  }

  constructor({
    debugDrawEnabled,
    parentSceneObject,
    scrollAreaBounds,
  }: {
    debugDrawEnabled: boolean
    parentSceneObject: SceneObject
    scrollAreaBounds: vec2
  }) {
    super({name: TAG})
    this.attachToScene(parentSceneObject)
    this.parentScreenTransform = parentSceneObject.getComponent(
      "Component.ScreenTransform"
    )

    this.screenTransform = this.createScreenTransform(debugDrawEnabled)
    this.collider = this.createCollider(debugDrawEnabled, scrollAreaBounds)
    this.interactable = this.createInteractable()
    this._boundariesProvider = new ScreenTransformBoundariesProvider(
      this.container
    )

    this.onTriggerStart = this.interactable.onTriggerStart
    this.onTriggerEnd = this.interactable.onTriggerEnd
    this.onTriggerCanceled = this.interactable.onTriggerCanceled
  }

  /**
   * @returns if collider wire is visible or not
   */
  get debugDrawEnabled(): boolean {
    return this.collider.debugDrawEnabled
  }

  /**
   * Toggles collider wire rendering for visualizing collider geometry shape and where it is placed.
   */
  set debugDrawEnabled(debugDrawEnabled: boolean) {
    this.collider.debugDrawEnabled = debugDrawEnabled
    this.screenTransform.enableDebugRendering = debugDrawEnabled
  }

  private createScreenTransform(
    enableDebugRendering: boolean
  ): ScreenTransform {
    const screenTransform = this.container.createComponent(
      "Component.ScreenTransform"
    )

    screenTransform.enableDebugRendering = enableDebugRendering
    screenTransform.anchors = Rect.create(-1, 1, -1, 1)
    screenTransform.offsets = Rect.create(0, 0, 0, 0)

    return screenTransform
  }

  private createColliderShape(scrollAreaBounds: vec2): BoxShape {
    const shape = Shape.createBoxShape()

    const topLeftCorner = this.convertLocalUnitsToParentUnits(
      new vec2(-scrollAreaBounds.x, scrollAreaBounds.y)
    )
    const bottomRightCorner = this.convertLocalUnitsToParentUnits(
      new vec2(scrollAreaBounds.x, -scrollAreaBounds.y)
    )

    shape.size = new vec3(
      bottomRightCorner.x - topLeftCorner.x,
      topLeftCorner.y - bottomRightCorner.y,
      1
    )

    return shape
  }

  /**
   * @returns the collider's BoxShape's bounds.
   */
  get scrollColliderBounds(): vec2 {
    const boxShape: BoxShape = this.collider.shape as BoxShape

    return new vec2(boxShape.size.x, boxShape.size.y)
  }

  /**
   * @param scrollColliderBounds - the collider's BoxShape's bounds.
   */
  set scrollColliderBounds(scrollColliderBounds: vec2) {
    this.collider.shape = this.createColliderShape(scrollColliderBounds)
  }

  private createCollider(
    debugDrawEnabled: boolean,
    scrollAreaBounds: vec2
  ): ColliderComponent {
    const collider = this.container.createComponent("Physics.ColliderComponent")
    collider.debugDrawEnabled = debugDrawEnabled
    collider.fitVisual = false
    collider.shape = this.createColliderShape(scrollAreaBounds)

    return collider
  }

  private stopEventPropagationOnDragging(event: InteractorEvent) {
    if (this.isDragging) {
      event.stopPropagation()
    }
  }

  private stopEventPropagationOutsideScrollArea(event: InteractorEvent) {
    if (
      event.interactor.targetHitPosition !== null &&
      !this.screenTransform.containsWorldPoint(
        event.interactor.targetHitPosition
      )
    ) {
      event.stopPropagation()
    }
  }

  private createInteractable(): Interactable {
    const interactable = this.parentScreenTransform
      .getSceneObject()
      .createComponent(Interactable.getTypeName())

    validate(
      interactable,
      "Couldn't create an Interactable. Interactable typename is undefined."
    )

    // Hover
    interactable.onHoverEnter.add((event) => {
      validate(this.interactable)

      const planeIntersection = event.interactor.raycastPlaneIntersection(
        this.interactable
      )

      const outsideScrollCanvas =
        planeIntersection === null ||
        !this.screenTransform.containsWorldPoint(planeIntersection)

      if (!this.isFocused && !outsideScrollCanvas) {
        this.isFocused = true
        this.onFocusEnterEvent.invoke({
          position: planeIntersection,
        })
      } else if (outsideScrollCanvas) {
        this.isFocused = false
        this.onFocusExitEvent.invoke({
          position: planeIntersection,
        })
      }
    })

    interactable.onHoverUpdate.add((event) => {
      validate(this.interactable)

      const planeIntersection = event.interactor.raycastPlaneIntersection(
        this.interactable
      )

      const outsideScrollCanvas =
        planeIntersection === null ||
        !this.screenTransform.containsWorldPoint(planeIntersection)

      if (this.isFocused && outsideScrollCanvas) {
        this.isFocused = false
        this.onFocusExitEvent.invoke({
          position: planeIntersection,
        })
      } else if (!this.isFocused && !outsideScrollCanvas) {
        this.isFocused = true
        this.onFocusEnterEvent.invoke({
          position: planeIntersection,
        })
      }
    })

    interactable.onHoverExit.add((event) => {
      validate(this.interactable)

      const planeIntersection = event.interactor.raycastPlaneIntersection(
        this.interactable
      )

      const outsideScrollCanvas =
        planeIntersection === null ||
        !this.screenTransform.containsWorldPoint(planeIntersection)

      if (this.isFocused && outsideScrollCanvas) {
        this.isFocused = false
        this.onFocusExitEvent.invoke({
          position: planeIntersection,
        })
      }
    })

    // Trigger
    interactable.onTriggerStart.add((event) => {
      this.stopEventPropagationOutsideScrollArea(event)
    })
    interactable.onTriggerUpdate.add((event) => {
      this.stopEventPropagationOutsideScrollArea(event)
      this.stopEventPropagationOnDragging(event)
    })
    interactable.onTriggerEnd.add((event) => {
      this.stopEventPropagationOutsideScrollArea(event)
      this.stopEventPropagationOnDragging(event)
    })
    interactable.onTriggerCanceled.add((event) => {
      this.stopEventPropagationOnDragging(event)
    })

    // Drag
    interactable.onDragStart.add((event) => {
      if (
        event.propagationPhase === "BubbleUp" ||
        event.propagationPhase === "Target"
      ) {
        this.isDragging = true
        this.onDragStartEvent.invoke(event)
        event.stopPropagation()

        this.interactionManager.dispatchEvent({
          interactor: event.interactor,
          target: event.target,
          eventName: "TriggerCanceled",
          origin: interactable,
        })
      }
    })
    interactable.onDragUpdate.add((event) => {
      if (this.isDragging) {
        this.onDragUpdateEvent.invoke(event)
        event.stopPropagation()
      }
    })
    interactable.onDragEnd.add((event) => {
      if (
        event.propagationPhase === "TrickleDown" ||
        event.propagationPhase === "Target"
      ) {
        this.isDragging = false
        this.onDragEndEvent.invoke(event)
        event.stopPropagation()
      }
    })

    interactable.isScrollable = true
    interactable.enableInstantDrag = true

    return interactable
  }

  /**
   * Converts local units (-1 to 1) to parent units relative to the ScrollView canvas.
   */
  private convertLocalUnitsToParentUnits(localUnits: vec2): vec2 {
    const origin = this.parentScreenTransform.localPointToWorldPoint(
      vec2.zero()
    )
    const invertQuat = this.parentScreenTransform
      .getSceneObject()
      .getTransform()
      .getWorldRotation()
      .invert()

    const worldUnits = this.parentScreenTransform
      .localPointToWorldPoint(localUnits)
      .sub(origin)

    const localAxisAlignedUnits = invertQuat.multiplyVec3(worldUnits)

    const parentUnits = localAxisAlignedUnits.div(
      this.parentScreenTransform.getTransform().getWorldScale()
    )

    return new vec2(parentUnits.x, parentUnits.y)
  }
}
