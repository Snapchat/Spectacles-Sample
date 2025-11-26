import {InteractorInputType} from "../../../Core/Interactor/Interactor"
import {DragInteractorEvent} from "../../../Core/Interactor/InteractorEvent"
import {MobileInteractor} from "../../../Core/MobileInteractor/MobileInteractor"
import Event, {PublicApi} from "../../../Utils/Event"
import NativeLogger from "../../../Utils/NativeLogger"
import {SceneObjectBoundariesProvider} from "./boundariesProvider/SceneObjectBoundariesProvider"
import {VisualBoundariesProvider} from "./boundariesProvider/VisualBoundariesProvider"
import {ScrollArea} from "./ScrollArea"
import {ScrollProvider} from "./ScrollProvider"

export const AXIS_DIRECTION = [-1, 0, 1] as const
export type AxisDirection = (typeof AXIS_DIRECTION)[number]

export const EDGE_TYPE = ["Content", "ScrollLimit"] as const
export type EdgeType = (typeof EDGE_TYPE)[number]

/**
 * Describes the selected edge as {x, y}, specifically:
 * (top-left, top-right, bottom-left, bottom-right, top, left, right, bottom)
 */
export type EdgeSelector = {
  /**
   * Selects the x axis direction (left = -1, none = 0, right = 1)
   */
  x: AxisDirection

  /**
   * Selects the y axis direction (bottom = -1, none = 0, top = 1)
   */
  y: AxisDirection

  /**
   * Which type of edge to snap to (Content = The edges of the content, ScrollLimit = The edges of the scrollable region)
   */
  type: EdgeType
}

/**
 * Base argument used for ScrollView events
 */
export type ScrollViewEventArgs = {
  /**
   * Position of the content in world units relative to the parent's center
   */
  contentPosition: vec2
}

/**
 * Base argument used for ScrollView events
 */
export type ScrollViewFocusEventArgs = {
  /**
   * The position of where the interactor entered or exited the scroll area.
   */
  position: vec3 | null
}

const TAG = "ScrollView"

/**
 * ScrollView will have two children:
 * - The content wrapper: created by ScrollView user.
 * - Scroll area: implemented internally by ScrollView and not exposed to the user.
 *
 * To avoid issues related to initialization order, we check the number of children on StartEvent.
 */
const EXPECTED_CHILDREN_COUNT = 2

/**
 * This class is responsible for creating and positioning grid content items based on a specified prefab and item count.
 * It instantiates the items and arranges them vertically with a specified offset.
 */
@component
export class ScrollView extends BaseScriptComponent {
  // Native Logging
  private log = new NativeLogger(TAG)

  private scrollArea!: ScrollArea
  private scrollProvider!: ScrollProvider
  private mask!: MaskingComponent

  // Initialized on start
  private contentBoundariesProvider!: SceneObjectBoundariesProvider

  private updateEvent = this.createEvent("UpdateEvent")

  /**
   * Shows visual debugging elements for scroll area bounds and content.
   */
  @input
  @hint("Shows visual debugging elements for scroll area bounds and content.")
  _debugDrawEnabled: boolean = false

  /**
   * Allows content to be scrolled horizontally.
   */
  @input
  @hint("Allows content to be scrolled horizontally.")
  enableHorizontalScroll: boolean = false

  /**
   * Allows content to be scrolled vertically.
   */
  @input
  @hint("Allows content to be scrolled vertically.")
  enableVerticalScroll: boolean = true

  /**
   * Enables physics-based scrolling where content continues moving after release with gradual deceleration and
   * elastic bounce-back at boundaries."
   */
  @input
  @hint(
    "Enables physics-based scrolling where content continues moving after release with gradual deceleration and \
elastic bounce-back at boundaries."
  )
  _enableScrollInertia: boolean = true

  /**
   * When enabled, prevents content from scrolling beyond designated boundaries defined by the Scroll Limit.
   */
  @input
  @hint("When enabled, prevents content from scrolling beyond designated boundaries defined by the Scroll Limit.")
  enableScrollLimit: boolean = true

  /**
   * Controls how much content must remain visible.
   * 0: Content can scroll completely out of view.
   * 0.5: At least 50% of the content will remain in the visible area.
   * 1: Content can't scroll out of view at all.
   */
  @input
  @widget(new SliderWidget(0, 1, 0.01))
  @showIf("enableScrollLimit")
  @hint(
    "Controls how much content must remain visible.\n\
- 0: Content can scroll completely out of view.\n\
- 0.5: At least 50% of the content will remain in the visible area.\n\
- 1: Content can't scroll out of view at all."
  )
  _scrollLimit: number = 0.3

  /**
   * Defines the size of the interactive area in normalized local coordinates, where (1,1) uses the full component
   * size.
   */
  @input("vec2", "{1, 1}")
  @hint(
    "Defines the size of the interactive area in normalized local coordinates, where (1,1) uses the full component \
size."
  )
  scrollAreaBounds: vec2 = new vec2(1, 1)

  /**
   * Relevant only to lenses that use SpectaclesSyncKit when it has SyncInteractionManager in its prefab.
   * If set to true before runtime, the ScrollView's position will be synced whenever a new user joins the same Connected Lenses session.
   */
  @ui.separator
  @ui.group_start("Sync Kit Support")
  @input
  @hint(
    "Relevant only to lenses that use SpectaclesSyncKit when it has SyncInteractionManager in its prefab. \
If set to true before runtime, the ScrollView's position will be synced whenever a new user joins the same Connected Lenses session."
  )
  public isSynced: boolean = false
  @ui.group_end
  private onContentLengthChangedEvent = new Event<void>()
  public onContentLengthChanged: PublicApi<void> = this.onContentLengthChangedEvent.publicApi()

  onAwake() {
    this.scrollArea = this.createScrollArea()
    this.scrollProvider = this.createScrollProvider(this.scrollArea)

    this.mask = this.sceneObject.createComponent("Component.MaskingComponent")

    this.defineScriptEvents()
  }

  private onDestroy() {
    this.scrollArea.destroy()
  }

  private createScrollArea() {
    const scrollArea = new ScrollArea({
      debugDrawEnabled: this.debugDrawEnabled,
      parentSceneObject: this.sceneObject,
      scrollAreaBounds: this.scrollAreaBounds
    })

    return scrollArea
  }

  private createScrollProvider(scrollArea: ScrollArea) {
    const scrollProvider = new ScrollProvider({
      scrollArea: this.scrollArea.boundariesProvider,
      scrollLimit: this.scrollLimit,
      enableScrollInertia: this.enableScrollInertia,
      enableScrollLimit: this.enableScrollLimit,
      enableHorizontalScroll: this.enableHorizontalScroll,
      enableVerticalScroll: this.enableVerticalScroll,
      scrollView: this,
      screenTransform: this.sceneObject.getComponent("Component.ScreenTransform"),
      updateEvent: this.updateEvent
    })

    scrollArea.onDragStart.add((event) => {
      if (!this.scrollProvider.isManual) {
        this.processPlanecastDrag(event)
        this.processTouchpadDrag(event)
      }
    })
    scrollArea.onDragUpdate.add((event) => {
      if (!this.scrollProvider.isManual) {
        this.processPlanecastDrag(event)
        this.processTouchpadDrag(event)
      }
    })
    scrollArea.onDragEnd.add((event) => {
      if (!this.scrollProvider.isManual) {
        scrollProvider.onGrabEnd(event)
      }
    })

    scrollArea.onTriggerStart.add((event) => {
      if (!this.scrollProvider.isManual) {
        scrollProvider.onGrabStart(event)
      }
    })

    return scrollProvider
  }

  private createContentBoundariesProvider() {
    if (this.sceneObject.getChildrenCount() !== EXPECTED_CHILDREN_COUNT) {
      throw new Error("ScrollView requires exactly one child that wraps the content")
    }

    let contentSceneObject: SceneObject | undefined
    for (const child of this.sceneObject.children) {
      if (child !== this.scrollArea.getSceneObject()) {
        contentSceneObject = child
      }
    }

    if (contentSceneObject === undefined) {
      throw new Error("Couldn't find content scene object among ScrollView children.")
    }

    return new VisualBoundariesProvider(contentSceneObject)
  }

  private defineScriptEvents() {
    this.createEvent("OnDestroyEvent").bind(() => this.onDestroy())
    this.createEvent("OnStartEvent").bind(() => {
      this.contentBoundariesProvider = this.createContentBoundariesProvider()
      this.scrollProvider.setContent(this.contentBoundariesProvider)
      this.scrollProvider.snapToEdges({x: -1, y: 1, type: "Content"})
      this.scrollProvider.resetContentOrigin()
      // We recompute boundaries once more to ensure that the scroll limit anchor is set properly.
      this.scrollProvider.recomputeBoundaries()

      this.scrollProvider.resyncToStore()
    })
  }

  recomputeBoundaries = () => {
    if (!this.scrollProvider.isReady) {
      this.log.w("recomputeBoundaries called before OnStartEvent. Call ignored.")
    } else {
      this.scrollProvider.recomputeBoundaries()
    }
  }
  private deferOnReady = (callback: () => void) => {
    if (!this.scrollProvider.isReady) {
      this.scrollProvider.onReady.add(callback)
    } else {
      callback()
    }
  }
  snapToEdges = (selectedEdges: EdgeSelector) => {
    this.deferOnReady(() => this.scrollProvider.snapToEdges(selectedEdges))
  }
  scrollBy = (dragVector: vec2) => {
    this.deferOnReady(() => this.scrollProvider.scrollBy(dragVector))
  }

  /**
   * @returns if the ScrollView is being manually controlled by some component beyond ScrollView (e.g. ScrollBar)
   */
  get isManual(): boolean {
    return this.scrollProvider.isManual
  }
  /**
   * Sets if the ScrollView is being manually controlled by some component beyond ScrollView (e.g. ScrollBar)
   * @param isManual - true if the ScrollView is being manually controlled
   */
  set isManual(manual: boolean) {
    this.scrollProvider.isManual = manual
  }

  get onScrollUpdate() {
    return this.scrollProvider.onScrollUpdate
  }
  get onSnapUpdate() {
    return this.scrollProvider.onSnapUpdate
  }
  get onReady() {
    return this.scrollProvider.onReady
  }
  get onFocusEnter() {
    return this.scrollArea.onFocusEnter
  }
  get onFocusExit() {
    return this.scrollArea.onFocusExit
  }

  /**
   * @returns if this class is ready to be used.
   */
  get isReady() {
    return this.scrollProvider.isReady
  }
  get isDragging() {
    return this.scrollArea.isDragging
  }

  get debugDrawEnabled(): boolean {
    return this._debugDrawEnabled
  }

  set debugDrawEnabled(debugDrawEnabled: boolean) {
    if (debugDrawEnabled === this._debugDrawEnabled) {
      return
    }
    this._debugDrawEnabled = debugDrawEnabled
    this.scrollArea.debugDrawEnabled = debugDrawEnabled
  }

  get enableScrollInertia(): boolean {
    return this._enableScrollInertia
  }

  set enableScrollInertia(enableScrollInertia: boolean) {
    if (enableScrollInertia === this._enableScrollInertia) {
      return
    }
    this._enableScrollInertia = enableScrollInertia
    this.scrollProvider.enableScrollInertia = enableScrollInertia
  }

  get scrollLimit(): number {
    return this._scrollLimit
  }

  set scrollLimit(limit: number) {
    if (this._scrollLimit === limit) {
      return
    }
    this._scrollLimit = limit
    this.scrollProvider.scrollLimit = limit
  }

  get contentPosition(): vec3 {
    return this.scrollProvider.contentPosition
  }

  set contentPosition(position: vec3) {
    this.scrollProvider.contentPosition = position
  }

  /**
   * @returns the offset to each content edge and the ScrollArea in world units relative to the canvas' rotation.
   */
  get contentOffset(): Rect {
    return this.scrollProvider.convertLocalOffsetToParentOffset(this.scrollProvider.contentOffset)
  }

  /**
   * @returns the length of the content along the y-axis in local units relative to the ScrollView canvas.
   */
  get contentLength(): number {
    return this.scrollProvider.contentLength
  }

  /**
   * @param length - the length of the content along the y-axis in local units relative to the ScrollView canvas.
   */
  set contentLength(length: number) {
    if (length === this.scrollProvider.contentLength) {
      return
    }
    this.scrollProvider.contentLength = length
    this.onContentLengthChangedEvent.invoke()
  }

  /**
   * Resets the content origin for the purpose of calculating scrollPercentage.
   * Assumes that the ScrollView is currently at the top of content in the pooling use case.
   */
  resetContentOrigin(): void {
    this.scrollProvider.resetContentOrigin()
  }

  /**
   * Resets the inertia velocity in the case that the developer wants to stop physics upon certain events.
   */
  resetInertiaVelocity(): void {
    this.scrollProvider.resetInertiaVelocity()
  }

  /**
   * @returns the ScrollArea's size in local units relative to the ScrollView canvas.
   */
  get scrollAreaSize(): vec2 {
    return this.scrollProvider.convertLocalUnitsToParentUnits(this.scrollArea.boundariesProvider.size)
  }

  /**
   * @returns the ScrollArea collider's BoxShape's bounds.
   */
  get scrollColliderBounds(): vec2 {
    return this.scrollArea.scrollColliderBounds
  }

  /**
   * @param bounds - the ScrollArea collider's BoxShape's bounds.
   */
  set scrollColliderBounds(bounds: vec2) {
    this.scrollArea.scrollColliderBounds = bounds
  }

  /**
   * @returns the amount of content overflow along the y-axis in local units relative to the ScrollView's canvas.
   */
  get overflow(): number {
    return this.scrollProvider.overflow
  }

  /**
   * @returns the scroll percentage of the ScrollView (0=top of ScrollView, 1= bottom).
   */
  get scrollPercentage(): number {
    return this.scrollProvider.scrollPercentage
  }

  /**
   * Checks if both inputted content edges are fully visible in the ScrollArea.
   * @param xEdge - 0 if not checking any x-axis edge, 1 for right edge, -1 for left edge.
   * @param yEdge - 0 if not checking any y-axis edge, 1 for top edge, -1 for bottom edge.
   */
  checkContentEdgeFullyVisible(xEdge: 0 | 1 | -1, yEdge: 0 | 1 | -1): boolean {
    return this.scrollProvider.checkContentEdgeFullyVisible(xEdge, yEdge)
  }

  private localizeDragVector(dragVector: vec3): vec2 {
    const transform = this.sceneObject.getTransform()

    const localXAxis = transform.getWorldRotation().multiplyVec3(vec3.right())

    const localYAxis = transform.getWorldRotation().multiplyVec3(vec3.up())

    const localizedX = localXAxis.dot(dragVector) / transform.getWorldScale().x
    const localizedY = localYAxis.dot(dragVector) / transform.getWorldScale().y

    return new vec2(localizedX, localizedY)
  }

  private localizeTouchpadVector(touchpadVector: vec3): vec2 {
    const screenTransform = this.sceneObject.getComponent("Component.ScreenTransform")

    // Mobile touchpad drag uses a screen space of [0,1], while screen transforms use a screen space of [-1,1]
    const touchpadVector2D = new vec2(touchpadVector.x * 2, touchpadVector.y * 2)

    const origin = screenTransform.localPointToWorldPoint(vec2.zero())

    const worldSpaceVector = screenTransform.localPointToWorldPoint(touchpadVector2D).sub(origin)

    return this.localizeDragVector(worldSpaceVector)
  }

  private processPlanecastDrag(event: DragInteractorEvent) {
    if (event.planecastDragVector === null) {
      return
    }
    const localDrag = this.localizeDragVector(event.planecastDragVector)
    this.scrollProvider.scrollBy(localDrag)
  }

  private processTouchpadDrag(event: DragInteractorEvent) {
    if (event.interactor.inputType === InteractorInputType.Mobile) {
      const mobileInteractor = event.interactor as MobileInteractor

      if (mobileInteractor.touchpadDragVector !== null) {
        const screenSpaceTouchpadDrag =
          mobileInteractor.touchpadDragVector?.uniformScale(1 / mobileInteractor.touchpadScrollSpeed) ?? vec3.zero()

        this.scrollProvider.scrollBy(this.localizeTouchpadVector(screenSpaceTouchpadDrag))
      }
    }
  }
}
