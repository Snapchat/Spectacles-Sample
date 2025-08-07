import {
  Interactable,
  InteractableEventArgs
} from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable"
import {InteractorEvent} from "SpectaclesInteractionKit.lspkg/Core/Interactor/InteractorEvent"
import WorldCameraFinderProvider from "SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider"
import animate, {CancelSet} from "SpectaclesInteractionKit.lspkg/Utils/animate"
import Event, {PublicApi} from "SpectaclesInteractionKit.lspkg/Utils/Event"
import {Frustum} from "../../Utility/Frustum"
import {findAllChildComponents, getElement} from "../../Utility/SceneUtilities"

// a small number
const EPSILON = 0.001
// how fast to fling
const FLING_MULTIPLER = 2.5
// how fast to slow
const FRICTION_FACTOR = 0.9
// maximum cache velocity vectors
const MAX_VELOCITY_COUNT = 3

type ScrollEventArg = {
  startPosition: vec2
  dragAmount: vec2
}

export type VisibleWindow = {
  bottomLeft: vec2
  topRight: vec2
}

/**
 * A low-level scrolling interaction solution for Spectacles.
 *
 * Children of this Component's SceneObject will be masked into windowSize and scrollable by scrollDimensions
 */
@component
export class ScrollWindow extends BaseScriptComponent {
  // inputs
  @input
  @hint("Enable Vertical Scrolling")
  vertical: boolean = true
  @input
  @hint("Enable Horizontal Scrolling")
  horizontal: boolean = false
  @input("vec2", "{32,32}")
  @hint(
    "Size of masked window viewport in local space. <br><br>Note: to set dynamically, use <code>setWindowSize</code>"
  )
  private windowSize: vec2 = new vec2(32, 32)
  @input("vec2", "{32,100}")
  @hint("Size of total scrollable area. <br><br>Note: to set dynamically, use <code>setScrollDimensions</code>")
  private scrollDimensions: vec2 = new vec2(32, 100)
  @input
  @hint("Add black fade to edges <code>(rendering trick for transparency)</code>")
  private edgeFade: boolean = false

  private initialized: boolean = false

  // world camera
  private camera: WorldCameraFinderProvider = WorldCameraFinderProvider.getInstance()
  private cameraComponent = this.camera.getComponent()

  // scene object stuff
  private transform: Transform
  private screenTransform: ScreenTransform
  private collider: ColliderComponent
  private interactable: Interactable
  maskingComponent: MaskingComponent
  private rmv: RenderMeshVisual
  private mesh: RenderMesh = requireAsset("../../../Meshes/Unit Plane.mesh") as RenderMesh
  private material: Material = requireAsset("../../../Materials/ScrollWindowFadeMask.mat") as Material

  private scroller: SceneObject

  /**
   * transform of the object that does scroll movement
   */
  scrollerTransform: Transform

  /**
   * frustum that handles helper viewport logic
   * use this to test if your content is visible
   */
  readonly frustum: Frustum = new Frustum()

  // scroll logic
  private startPosition: vec3 = vec3.zero()
  private interactorOffset: vec3 = vec3.zero()
  private interactorUpdated: boolean = false
  /**
   * is currently dragging
   */
  private isDragging: boolean = false
  /**
   * is currently bouncing back
   */
  private bouncingBack: boolean = false
  private velocity: vec3 = vec3.zero()
  private velocities: vec3[] = []
  private lastPosition: vec3 = this.startPosition

  private topEdge = this.scrollDimensions.y * -0.5 + this.windowSize.y * 0.5
  private bottomEdge = this.scrollDimensions.y * 0.5 - this.windowSize.y * 0.5
  private leftEdge = this.scrollDimensions.x * 0.5 - this.windowSize.x * 0.5
  private rightEdge = this.scrollDimensions.x * -0.5 + this.windowSize.x * 0.5

  private dragAmount: vec2 = vec2.zero()
  private scrollDragEvent: Event<ScrollEventArg> = new Event()
  private onScrollPositionUpdatedEvent: Event<vec2> = new Event()

  private scrollTweenCancel = new CancelSet()

  /**
   * use this event to execute logic on scroll
   */
  readonly onScrollDrag: PublicApi<ScrollEventArg> = this.scrollDragEvent.publicApi()

  readonly onScrollPositionUpdated: PublicApi<vec2> = this.onScrollPositionUpdatedEvent.publicApi()

  /**
   * disable bounce back
   */
  hardStopAtEnds: boolean = false

  /**
   * turn on top secret debug visuals
   */
  private debugRender: boolean = false

  private colliderShape = Shape.createBoxShape()

  onAwake() {
    this.createEvent("OnStartEvent").bind(this.initialize)
  }

  /**
   *
   * @param size set masked window to this size in local space
   */
  setWindowSize = (size: vec2) => {
    this.windowSize = size
    this.topEdge = this.scrollDimensions.y * -0.5 + this.windowSize.y * 0.5
    this.bottomEdge = this.scrollDimensions.y * 0.5 - this.windowSize.y * 0.5
    this.leftEdge = this.scrollDimensions.x * 0.5 - this.windowSize.x * 0.5
    this.rightEdge = this.scrollDimensions.x * -0.5 + this.windowSize.x * 0.5
    this.screenTransform.anchors.left = this.windowSize.x * -0.5
    this.screenTransform.anchors.right = this.windowSize.x * 0.5
    this.screenTransform.anchors.bottom = this.windowSize.y * -0.5
    this.screenTransform.anchors.top = this.windowSize.y * 0.5
    if (this.edgeFade) {
      this.material.mainPass.windowSize = size
      this.material.mainPass.radius = this.maskingComponent.cornerRadius
    }
    this.colliderShape.size = new vec3(this.windowSize.x, this.windowSize.y, 1)
    this.collider.shape = this.colliderShape
  }

  /**
   *
   * @returns vec2 of this current window size
   */
  getWindowSize = (): vec2 => this.windowSize

  /**
   *
   * @param size set scrolling dimensions to this size in local space
   */
  setScrollDimensions = (size: vec2) => {
    this.scrollDimensions = size
    this.setWindowSize(this.windowSize)
  }

  /**
   *
   * @returns vec2 of current scroll dimensions
   */
  getScrollDimensions = (): vec2 => this.scrollDimensions

  /**
   *
   * @param enable enable or disable black fade masked edge
   */
  enableEdgeFade = (enable: boolean) => {
    this.edgeFade = enable
    if (enable && !this.rmv) {
      this.createEdgeFade()
    }
    this.rmv.enabled = enable
  }

  /**
   *
   * initializes script, runs once on creation
   */
  initialize = () => {
    if (this.initialized) return

    this.transform = this.sceneObject.getTransform()
    /**
     * when you create this, does it overwrite existing local transform?
     */
    this.screenTransform =
      this.sceneObject.getComponent("ScreenTransform") || this.sceneObject.createComponent("ScreenTransform")
    /**
     * like i gotta do this??
     */
    this.screenTransform.position = this.transform.getLocalPosition()
    this.collider =
      this.sceneObject.getComponent("ColliderComponent") || this.sceneObject.createComponent("ColliderComponent")
    this.maskingComponent =
      this.sceneObject.getComponent("MaskingComponent") || this.sceneObject.createComponent("MaskingComponent")
    this.interactable =
      this.sceneObject.getComponent(Interactable.getTypeName()) ||
      this.sceneObject.createComponent(Interactable.getTypeName())

    if (this.edgeFade) {
      this.createEdgeFade()
    }

    this.setWindowSize(this.windowSize)

    this.collider.shape = this.colliderShape
    this.collider.fitVisual = false
    this.collider.debugDrawEnabled = this.debugRender

    this.interactable.enableInstantDrag = true

    const currentChildren = [...this.sceneObject.children]

    this.scroller = global.scene.createSceneObject("Scroller")
    this.scroller.setParent(this.sceneObject)
    this.scrollerTransform = this.scroller.getTransform()

    // move children under this.scroller
    for (let i = 0; i < currentChildren.length; i++) {
      const thisChild = currentChildren[i]
      thisChild.setParent(this.scroller)
    }

    this.interactable.onHoverUpdate.add((event) => {
      const intersection = event.interactor.raycastPlaneIntersection(this.interactable)
      if (intersection) {
        const localIntersection = this.screenTransform.worldPointToLocalPoint(intersection)

        if (
          localIntersection.x < -1 ||
          localIntersection.x > 1 ||
          localIntersection.y < -1 ||
          localIntersection.y > 1
        ) {
          this.enableChildColliders(false)
        } else {
          this.enableChildColliders(true)
        }
      } else {
        this.enableChildColliders(false)
      }
    })

    this.interactable.onHoverExit.add(() => {
      this.enableChildColliders(false)
    })

    this.interactable.onHoverEnter.add(() => {
      this.enableChildColliders(true)
    })

    this.interactable.onTriggerStart.add(() => {
      this.startPosition = this.scrollerTransform.getLocalPosition()
      this.lastPosition = this.startPosition
      this.interactorOffset = vec3.zero()
      this.velocities = []
      this.velocity = vec3.zero()
      this.interactorUpdated = false
      this.dragAmount = vec2.zero()
    })

    this.interactable.onDragUpdate.add((event: InteractorEvent) => {
      if (event.interactor) {
        const interactedElement = getElement(event.interactor.currentInteractable.sceneObject)
        if (interactedElement && interactedElement.isDraggable && !interactedElement.disabled) {
          return
        }

        const raycastToWindow = event.interactor.raycastPlaneIntersection(this.interactable)
        if (raycastToWindow) {
          this.scrollTweenCancel()

          const interactorPos = this.transform
            .getInvertedWorldTransform()
            .multiplyPoint(event.interactor.raycastPlaneIntersection(this.interactable))

          if (!this.interactorUpdated) {
            this.interactorOffset = interactorPos
            this.interactorUpdated = true
            this.isDragging = true
            this.cancelChildInteraction(event)
          }

          this.dragAmount = interactorPos.sub(this.interactorOffset)

          const newPosition = this.startPosition.add(interactorPos.sub(this.interactorOffset))
          newPosition.z = 0

          this.updateScrollerPosition(newPosition)

          this.scrollDragEvent.invoke({
            startPosition: this.startPosition,
            dragAmount: this.dragAmount
          })

          if (event.target.sceneObject === this.sceneObject || event.propagationPhase === "BubbleUp") {
            const newVelocity = newPosition.sub(this.lastPosition)
            newVelocity.z = 0
            this.velocities.unshift(newVelocity)
            if (this.velocities.length > MAX_VELOCITY_COUNT) this.velocities.pop()
            this.lastPosition = newPosition
          }
        }
      }
    })

    this.interactable.onDragEnd.add(() => {
      this.isDragging = false
      // grab second to last velocity bc last one seems to be zero
      // and scale it to go faster ( feels better )
      // TODO: make additive with multiple same direction gestures
      if (this.velocities[1]) this.velocity = this.velocities[1].uniformScale(FLING_MULTIPLER)
    })

    this.createEvent("LateUpdateEvent").bind(this.update)

    this.initialized = true

    this.createEvent("OnEnableEvent").bind(() => {
      this.interactable.enabled = true
    })
    this.createEvent("OnDisableEvent").bind(() => {
      this.interactable.enabled = false
    })
  }

  get isInitialized(): boolean {
    return this.initialized
  }

  /**
   * set scroll position in local space
   */
  get scrollPosition(): vec2 {
    const currentPosition = vec2.zero()
    const scrollerLocalPosition = this.scrollerTransform.getLocalPosition()
    currentPosition.x = scrollerLocalPosition.x
    currentPosition.y = scrollerLocalPosition.y
    return currentPosition
  }

  /**
   * set scroll position in local space
   */
  set scrollPosition(position: vec2) {
    this.scrollTweenCancel()
    const scrollerLocalPosition = this.scrollerTransform.getLocalPosition()
    this.updateScrollerPosition(new vec3(position.x, position.y, scrollerLocalPosition.z))
  }

  /**
   * helper function to tween scroll
   * @param position final position
   * @param time duration of tweened scroll in milliseconds
   */
  tweenTo = (position: vec2, time: number) => {
    this.scrollTweenCancel()
    const scrollerLocalPosition = this.scrollerTransform.getLocalPosition()
    const finalPosition = new vec3(position.x, position.y, scrollerLocalPosition.z)

    animate({
      duration: time * 0.001,
      update: (t) => {
        this.updateScrollerPosition(vec3.lerp(scrollerLocalPosition, finalPosition, t))
      },
      cancelSet: this.scrollTweenCancel,
      easing: "ease-in-out-quad"
    })
  }

  /**
   * get scroll position in normalized space
   * -1, 1 on the x (left to right)
   * -1, 1 on the y (bottom to top)
   */
  get scrollPositionNormalized(): vec2 {
    const currentPosition = vec2.zero()
    const scrollerLocalPosition = this.scrollerTransform.getLocalPosition()

    currentPosition.x = scrollerLocalPosition.x / this.rightEdge
    currentPosition.y = scrollerLocalPosition.y / this.topEdge

    return currentPosition
  }

  /**
   * set scroll position in normalized space
   * -1, 1 on the x (left to right)
   * -1, 1 on the y (bottom to top)
   */
  set scrollPositionNormalized(position: vec2) {
    this.scrollTweenCancel()
    const scrollerLocalPosition = this.scrollerTransform.getLocalPosition()
    scrollerLocalPosition.x = position.x * this.rightEdge
    scrollerLocalPosition.y = position.y * this.topEdge
    this.updateScrollerPosition(scrollerLocalPosition)
  }

  /**
   * get viewable window of local space at zero depth
   * -windowSize.x/2, windowSize.x/2 on the x (left to right)
   * -windowSize.y/2, windowSize.=/2 on the x (bottom to top)
   * @returns vec4 where x,y are bottom left corner, and z, w are top right corner
   */
  getVisibleWindow(): VisibleWindow {
    const visibleWindow: VisibleWindow = {
      bottomLeft: vec2.zero(),
      topRight: vec2.zero()
    }
    const scrollerLocalPosition = this.scrollerTransform.getLocalPosition()
    visibleWindow.bottomLeft.x = -scrollerLocalPosition.x - this.windowSize.x * 0.5
    visibleWindow.bottomLeft.y = -scrollerLocalPosition.y - this.windowSize.y * 0.5
    visibleWindow.topRight.x = -scrollerLocalPosition.x + this.windowSize.x * 0.5
    visibleWindow.topRight.y = -scrollerLocalPosition.y + this.windowSize.y * 0.5
    return visibleWindow
  }

  /**
   * get viewable window of local space at zero depth
   * -1, 1 on the x (left to right)
   * -1, 1 on the x (bottom to top)
   * @returns vec4 where x,y are bottom left corner, and z, w are top right corner
   */
  getVisibleWindowNormalized(): VisibleWindow {
    const visibleWindow: VisibleWindow = this.getVisibleWindow()
    visibleWindow.bottomLeft.x /= this.scrollDimensions.x * 0.5
    visibleWindow.bottomLeft.y /= this.scrollDimensions.y * 0.5
    visibleWindow.topRight.x /= this.scrollDimensions.x * 0.5
    visibleWindow.topRight.y /= this.scrollDimensions.y * 0.5
    return visibleWindow
  }

  /**
   *
   * @returns current fling velocity
   */
  readonly getVelocity = (): vec3 => this.velocity

  private enableChildColliders = (enable: boolean): void => {
    const childColliders: ColliderComponent[] = findAllChildComponents(
      this.sceneObject,
      "ColliderComponent"
    ) as ColliderComponent[]

    for (let i = 0; i < childColliders.length; i++) {
      const collider = childColliders[i]
      if (collider === this.collider) continue
      collider.enabled = enable
    }
  }

  private cancelChildInteraction = (e: InteractableEventArgs) => {
    const childInteractables: Interactable[] = findAllChildComponents(
      this.sceneObject,
      Interactable.getTypeName() as unknown as keyof ComponentNameMap
    ) as Interactable[]

    for (let i = 0; i < childInteractables.length; i++) {
      const interactable = childInteractables[i]
      if (interactable === this.interactable) continue
      interactable.triggerCanceled(e)
    }
  }

  private createEdgeFade = () => {
    this.rmv = this.sceneObject.getComponent("RenderMeshVisual") || this.sceneObject.createComponent("RenderMeshVisual")
    this.rmv.mesh = this.mesh
    this.material = this.material.clone()
    this.rmv.mainMaterial = this.material
  }

  private updateScrollerPosition = (newPosition: vec3): vec3 => {
    const currentPos = this.scrollerTransform.getLocalPosition()
    if (this.hardStopAtEnds) {
      if (newPosition.y < this.topEdge || newPosition.y > this.bottomEdge) {
        newPosition.y = currentPos.y
      }
      if (newPosition.x > this.leftEdge || newPosition.x < this.rightEdge) {
        newPosition.x = currentPos.x
      }
    }
    if (!this.horizontal) newPosition.x = currentPos.x
    if (!this.vertical) newPosition.y = currentPos.y
    this.scrollerTransform.setLocalPosition(newPosition)
    this.onScrollPositionUpdatedEvent.invoke(new vec2(newPosition.x, newPosition.y))
    return newPosition
  }

  private update = () => {
    const scale = this.transform.getWorldScale()

    // calculate frustum visible through scroll window
    this.frustum.setFromNearPlane(
      this.camera,
      this.cameraComponent.far,
      new vec2(
        (this.screenTransform.anchors.right - this.screenTransform.anchors.left) * scale.x,
        (this.screenTransform.anchors.top - this.screenTransform.anchors.bottom) * scale.y
      ),
      this.transform
    )

    if (this.debugRender) {
      this.frustum.render()
    }

    if (!this.isDragging) {
      // scrolling physics
      if (this.velocity) {
        if (this.velocity.lengthSquared > EPSILON) {
          // reduce velocity per frame based on friction factor
          // calculated for feel
          this.velocity = this.velocity.uniformScale(FRICTION_FACTOR)
          this.updateScrollerPosition(this.scrollerTransform.getLocalPosition().add(this.velocity))
        } else {
          this.velocity = vec3.zero()
        }
      }

      // overshoot logic
      if (!this.hardStopAtEnds) {
        const currentPosition = this.scrollerTransform.getLocalPosition()
        let doBounceBackUpdate = false

        // t value for lerping back over delta time
        // maybe needs caching per frame for opt
        const delta = Math.min(getDeltaTime(), 0.017)
        const lerpT = 1 - Math.pow(0.05, delta * 11)

        if (this.scrollDimensions.y !== -1) {
          if (currentPosition.y < this.scrollDimensions.y * -0.5 + this.windowSize.y * 0.5) {
            // bounce back on y
            // off top
            doBounceBackUpdate = true
            currentPosition.y = MathUtils.lerp(
              currentPosition.y,
              this.scrollDimensions.y * -0.5 + this.windowSize.y * 0.5,
              lerpT
            )
            if (this.topEdge - currentPosition.y < 0.001) {
              this.velocity = vec3.zero()
              currentPosition.y = this.topEdge
            }
          }
          if (currentPosition.y > this.bottomEdge) {
            // bounce back on y
            // off bottom
            doBounceBackUpdate = true
            currentPosition.y = MathUtils.lerp(currentPosition.y, this.bottomEdge, lerpT)
            // if within threshold just set it
            if (currentPosition.y - this.bottomEdge < 0.001) {
              this.velocity = vec3.zero()
              currentPosition.y = this.bottomEdge
            }
          }
        }
        if (this.scrollDimensions.x !== -1) {
          if (currentPosition.x < this.rightEdge) {
            // bounce back on x
            // bounce back on right
            doBounceBackUpdate = true
            currentPosition.x = MathUtils.lerp(currentPosition.x, this.rightEdge, lerpT)
            // if within threshold just set it
            if (this.rightEdge - currentPosition.x < 0.001) {
              currentPosition.x = this.rightEdge
              this.velocity = vec3.zero()
            }
          }
          if (currentPosition.x > this.leftEdge) {
            // bounce back on x
            // bounce back on left
            doBounceBackUpdate = true
            currentPosition.x = MathUtils.lerp(currentPosition.x, this.leftEdge, lerpT)
            // if within threshold just set it
            if (currentPosition.x - this.leftEdge < 0.001) {
              currentPosition.x = this.leftEdge
              this.velocity = vec3.zero()
            }
          }
        }

        if (doBounceBackUpdate) {
          this.bouncingBack = true
          this.updateScrollerPosition(currentPosition)
        } else {
          this.bouncingBack = false
        }
      }
    }
  }
}
