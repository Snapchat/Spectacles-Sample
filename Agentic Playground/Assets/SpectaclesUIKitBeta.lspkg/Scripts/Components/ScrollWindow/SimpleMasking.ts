import WorldCameraFinderProvider from "SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider"
import {Frustum} from "../../Utility/Frustum"

// a small number
const EPSILON = 0.001

export type VisibleWindow = {
  bottomLeft: vec2
  topRight: vec2
}

/**
 * A masking component for Spectacles.
 *
 * Children of this Component's SceneObject will be masked into windowSize
 */
@component
export class SimpleMasking extends BaseScriptComponent {
  @input("vec2", "{32,32}")
  @hint(
    "Size of masked window viewport in local space. <br><br>Note: to set dynamically, use <code>setWindowSize</code>"
  )
  private windowSize: vec2 = new vec2(32, 32)
  @input
  @hint("Add black fade to edges <code>(rendering trick for transparency)</code>")
  private edgeFade: boolean = false
  @input("float", "0.0")
  @hint("Y offset from parent position in local space")
  private yOffset: number = 0.0

  private initialized: boolean = false

  // Store original position to preserve it
  private originalPosition: vec3 = vec3.zero()

  // world camera
  private camera: WorldCameraFinderProvider = WorldCameraFinderProvider.getInstance()
  private cameraComponent = this.camera.getComponent()

  // scene object stuff
  private transform: Transform
  private screenTransform: ScreenTransform
  private collider: ColliderComponent
  maskingComponent: MaskingComponent
  private rmv: RenderMeshVisual
  private mesh: RenderMesh = requireAsset("../../../Meshes/Unit Plane.mesh") as RenderMesh
  private material: Material = requireAsset("../../../Materials/ScrollWindowFadeMask.mat") as Material

  /**
   * frustum that handles helper viewport logic
   * use this to test if your content is visible
   */
  readonly frustum: Frustum = new Frustum()

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
   * Set the position of the masking component
   * @param position new position in local space
   */
  setPosition = (position: vec3) => {
    if (this.initialized) {
      this.screenTransform.position = position
    } else {
      this.originalPosition = position
    }
  }

  /**
   * Get the current position of the masking component
   * @returns current position in local space
   */
  getPosition = (): vec3 => {
    if (this.initialized) {
      return this.screenTransform.position
    } else {
      return this.originalPosition
    }
  }

  /**
   * Set the Y offset from parent position
   * @param offset new Y offset value in local space
   */
  setYOffset = (offset: number) => {
    const currentPos = this.getPosition()
    const deltaOffset = offset - this.yOffset
    this.yOffset = offset
    
    if (this.initialized) {
      this.screenTransform.position = new vec3(
        currentPos.x,
        currentPos.y + deltaOffset,
        currentPos.z
      )
      this.originalPosition = this.screenTransform.position
    }
  }

  /**
   * Get the current Y offset from parent position
   * @returns current Y offset value
   */
  getYOffset = (): number => this.yOffset

  /**
   *
   * initializes script, runs once on creation
   */
  initialize = () => {
    if (this.initialized) return

    this.transform = this.sceneObject.getTransform()
    
    // Store the original world position and parent info before creating ScreenTransform
    const originalWorldPosition = this.transform.getWorldPosition()
    const originalLocalPosition = this.transform.getLocalPosition()
    const parent = this.sceneObject.getParent()
    
    /**
     * Create or get ScreenTransform component
     */
    this.screenTransform =
      this.sceneObject.getComponent("ScreenTransform") || this.sceneObject.createComponent("ScreenTransform")
    
    /**
     * Preserve the original position relative to parent
     * If there's a parent, calculate the position relative to it
     * Otherwise, use the world position
     */
    if (parent) {
      const parentTransform = parent.getTransform()
      const parentWorldPos = parentTransform.getWorldPosition()
      const parentWorldScale = parentTransform.getWorldScale()
      const parentWorldRotation = parentTransform.getWorldRotation()
      
      // Calculate relative position to parent
      const relativeWorldPos = originalWorldPosition.sub(parentWorldPos)
      
      // Apply inverse parent transformation to get local position
      const invParentRotation = parentWorldRotation.invert()
      const rotatedRelativePos = invParentRotation.multiplyVec3(relativeWorldPos)
      const localPos = new vec3(
        rotatedRelativePos.x / parentWorldScale.x,
        rotatedRelativePos.y / parentWorldScale.y + this.yOffset,
        rotatedRelativePos.z / parentWorldScale.z
      )
      
      this.screenTransform.position = localPos
      this.originalPosition = localPos
    } else {
      // No parent, use world position with Y offset
      const offsetPosition = new vec3(
        originalWorldPosition.x,
        originalWorldPosition.y + this.yOffset,
        originalWorldPosition.z
      )
      this.screenTransform.position = offsetPosition
      this.originalPosition = offsetPosition
    }
    
    this.collider =
      this.sceneObject.getComponent("ColliderComponent") || this.sceneObject.createComponent("ColliderComponent")
    this.maskingComponent =
      this.sceneObject.getComponent("MaskingComponent") || this.sceneObject.createComponent("MaskingComponent")

    if (this.edgeFade) {
      this.createEdgeFade()
    }

    this.setWindowSize(this.windowSize)

    this.collider.shape = this.colliderShape
    this.collider.fitVisual = false
    this.collider.debugDrawEnabled = this.debugRender

    this.createEvent("LateUpdateEvent").bind(this.update)

    this.initialized = true
  }

  get isInitialized(): boolean {
    return this.initialized
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
    visibleWindow.bottomLeft.x = -this.windowSize.x * 0.5
    visibleWindow.bottomLeft.y = -this.windowSize.y * 0.5
    visibleWindow.topRight.x = this.windowSize.x * 0.5
    visibleWindow.topRight.y = this.windowSize.y * 0.5
    return visibleWindow
  }

  private createEdgeFade = () => {
    this.rmv = this.sceneObject.getComponent("RenderMeshVisual") || this.sceneObject.createComponent("RenderMeshVisual")
    this.rmv.mesh = this.mesh
    this.material = this.material.clone()
    this.rmv.mainMaterial = this.material
  }

  private update = () => {
    const scale = this.transform.getWorldScale()

    // calculate frustum visible through masked window
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
  }
}
