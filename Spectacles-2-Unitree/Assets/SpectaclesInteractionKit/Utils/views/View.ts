/*
 * View implements a generic baseclass with useful utilities that many
 * subclasses can take advantage of.
 *
 * Views are meant to be hierarchical, where each parent view is passed to
 * the constructor of the child views. However, a lensCore SceneObject may
 * also be passed as a valid parent
 */
import Event from "../Event"
import ReplayEvent from "../ReplayEvent"

export type Defaults = Partial<{
  font: Font
  fontSize: number
  textColor: vec4
  colorMask: vec4b
}>

export type ViewConfig = Partial<{
  position: vec3
  rotation: quat
  scale: number
  enabled: boolean
  name: string
  defaults: Defaults
}>

export type OnDestroyCallback = () => void

export default class View<Config extends ViewConfig = ViewConfig> {
  protected container: SceneObject
  private _defaults: Defaults | null
  protected childViews: View<any>[] = []
  private transform: Transform
  protected attachedToScene = false
  private onDestroyCallbacks: OnDestroyCallback[] = []

  private static onCreateViewEvent = new Event<View<any>>()
  public static onCreateView = View.onCreateViewEvent.publicApi()

  private static onDestroyViewEvent = new Event<View<any>>()
  public static onDestroyView = View.onDestroyViewEvent.publicApi()

  private onEnabledEvent = new ReplayEvent<boolean>()
  public onEnabled = this.onEnabledEvent.publicApi()

  isDestroyed: boolean = false

  // Internally track the current alpha of the view
  protected _alpha = 1

  /**
   * Returns the current alpha of the view
   */
  get alpha() {
    return this._alpha
  }

  /**
   * @inheritdoc
   */
  set alpha(a: number) {
    this.setAlpha(a)
  }

  /**
   * Set the alpha of the View to a, and recursively apply this alpha to all descendents.
   * The alpha will be applied by setting the .a component of baseColor to a.
   * @param a The value to set the alpha of the view to, from 0 to 1
   */
  setAlpha(a: number) {
    this.setAlphaInternal(a)
  }

  constructor(private _config: Config) {
    this.container = global.scene.createSceneObject(this._config.name ?? "View")
    this.transform = this.container.getTransform()
    //this.addComponent("ScreenTransform").

    if (this._config.position !== undefined) {
      this.position = this._config.position
    }

    if (this._config.rotation !== undefined) {
      this.localRotation = this._config.rotation
    }

    if (this._config.scale !== undefined) {
      this.localScale = this._config.scale
    }

    if (this._config.enabled === false) {
      this.setEnabled(false)
    } else {
      this.onEnabledEvent.invoke(true)
    }

    this._defaults = this.config.defaults ?? null

    View.onCreateViewEvent.invoke(this)
  }

  destroy() {
    if (this.isDestroyed === true) {
      return
    }

    View.onDestroyViewEvent.invoke(this)

    /*
       this.getSceneObject().destroy() will clean up all the scene objects but not the view objects
    */
    this.isDestroyed = true
    this.cascadeDestroy()
    this.getSceneObject().destroy()

    for (let callback of this.onDestroyCallbacks) {
      callback()
    }
  }

  private cascadeDestroy() {
    for (let child of this.childViews) {
      child.destroy()
    }
  }

  /**
   * addOnDestroyCallback adds a callback to call when the view is destroyed
   */
  addOnDestroyCallback(callback: OnDestroyCallback) {
    this.onDestroyCallbacks.push(callback)
  }

  /**
   * Actually sets the alpha internally on the view, and cascades the call to
   * the view's children
   */
  private setAlphaInternal(a: number) {
    this._alpha = a
    // also set alpha on all of the child views
    for (let child of this.childViews) {
      child.setAlpha(a)
    }
  }

  set localPosition(position: vec3) {
    this.transform.setLocalPosition(position)
  }

  get localPosition(): vec3 {
    return this.transform.getLocalPosition()
  }

  /**
   * @deprecated pleasre use localPosition
   */
  set position(position: vec3) {
    this.transform.setLocalPosition(position)
  }

  /**
   * @deprecated use localPosition instead
   */
  get position(): vec3 {
    return this.transform.getLocalPosition()
  }

  // set the world position of an object
  set worldPosition(position: vec3) {
    this.transform.setWorldPosition(position)
  }

  get worldPosition(): vec3 {
    return this.transform.getWorldPosition()
  }

  /**
   * @deprecated use localScale instead
   */
  set scale(scale: number) {
    this.transform.setLocalScale(new vec3(scale, scale, scale))
  }

  /**
   * Return the local scale of an object, assuming uniform scaling
   */
  get localScale(): number {
    return this.transform.getLocalScale().x
  }

  // set the scale of an object, enforcing uniform scaling
  set localScale(scale: number) {
    this.transform.setLocalScale(new vec3(scale, scale, scale))
  }

  get localScaleVec3(): vec3 {
    return this.transform.getLocalScale()
  }

  set localScaleVec3(vec: vec3) {
    this.transform.setLocalScale(vec)
  }

  // set the world scale of an object, enforcing uniform scaling
  set worldScale(scale: number) {
    this.transform.setWorldScale(new vec3(scale, scale, scale))
  }

  // get the world scale, assuming uniform scaling
  get worldScale() {
    return this.transform.getWorldScale().x
  }

  set worldScaleVec3(scale: vec3) {
    this.transform.setWorldScale(scale)
  }

  get worldScaleVec3() {
    return this.transform.getWorldScale()
  }

  set localRotation(rotation: quat) {
    this.transform.setLocalRotation(rotation)
  }

  get localRotation() {
    return this.transform.getLocalRotation()
  }

  set worldRotation(rotation: quat) {
    this.transform.setWorldRotation(rotation)
  }

  get worldRotation() {
    return this.transform.getWorldRotation()
  }

  get name(): string {
    return this.container.name
  }

  // Attach this view to a lensCore SceneObject
  public attachToScene(parent: SceneObject): this {
    // attach the scene
    this.attachToParent(parent)

    // then, fire the onAttachToScene callbacks recursively
    this.cascadeAttachToSceneCallbacks()
    return this
  }

  // Get the underlying scene object. This should be viewed as an "escape hatch"
  // for doing advanced things
  public getSceneObject() {
    return this.container
  }

  // Get the underlying transform for this object.
  public getTransform() {
    return this.transform
  }

  /**
   * @param worldPos - a point representing something's world position
   * @returns the point's position relative to this view
   */
  public getRelativePosOfPoint(worldPos: vec3) {
    return this.transform.getInvertedWorldTransform().multiplyPoint(worldPos)
  }

  // isVisible returns true if this component is both enabled and its alpha is not zero
  public isVisible(): boolean {
    return this.getSceneObject().enabled && this.alpha !== 0
  }

  public setEnabled(enabled: boolean) {
    if (enabled === this.getSceneObject().enabled) return
    this.getSceneObject().enabled = enabled
    this.onEnabledEvent.invoke(enabled)
  }

  public isEnabled(): boolean {
    return this.getSceneObject().enabled
  }

  public addComponent<K extends keyof ComponentNameMap>(typeName: K) {
    return this.container.createComponent(typeName) as ComponentNameMap[K]
  }

  public getComponent<K extends keyof ComponentNameMap>(typeName: K) {
    return this.container.getComponent(typeName) as ComponentNameMap[K]
  }

  // Add a child view to this view
  protected addChild<Child extends View<any>>(
    child: Child,
    configure?: (c: Child) => void,
    preserveWorldTransform: boolean = false
  ): Child {
    child.attachToParent(this, preserveWorldTransform)
    this.childViews.push(child)
    if (configure !== undefined) {
      configure(child)
    }

    // the child is being attached after the parent, so it needs
    // to have its onAttachToScene hook called, recursively
    if (this.attachedToScene) {
      child.cascadeAttachToSceneCallbacks(this._defaults)
    }

    return child
  }

  // construct and add a child
  protected newChild<
    Conf,
    Child extends View<Conf extends ViewConfig ? Conf : never>
  >(
    ctor: {new (conf: Conf): Child},
    conf: Conf,
    customize?: (c: Child) => void
  ): Child {
    return this.addChild(new ctor(conf), customize)
  }

  /**
   * @deprecated use destroyChild or detachChild instead.
   */
  protected removeChild<Child extends View<any>>(child: Child): void {
    child.destroy()
    let index = this.childViews.indexOf(child)
    if (index === -1) {
      return
    }
    this.childViews.splice(index, 1)
  }

  /**
   * Destroys and removes the child from this View
   * @param child the child to be destroyed
   * @returns whether the child was destroyed
   */
  protected destroyChild<Child extends View<any>>(child: Child): boolean {
    let index = this.childViews.indexOf(child)
    if (index === -1) {
      return false
    }
    child.destroy()
    this.childViews.splice(index, 1)
    return true
  }

  /**
   * Detaches child from parent and removes the child from this View
   * @param child the child to be detached
   * @returns whether the child was detached
   */
  protected detachChild<Child extends View<any>>(child: Child): boolean {
    let index = this.childViews.indexOf(child)
    if (index === -1) {
      return false
    }
    child.getSceneObject().removeParent()
    this.childViews.splice(index, 1)
    return true
  }

  protected get config(): Config {
    return this._config
  }

  // onAttachToScene is a lifecycle hook that happens when a view is attached
  // to its parent. It is the place where "defaults" should be used, since they
  // will not cascade prior to this hook
  protected onAttachToScene(defaults: Defaults, parentView: View | null) {
    // default is noop
  }

  // Set a a property on all child views. If a View already has the property,
  // it is assumed that View will handle setting the property on its child
  // views, or (more likely) is a leaf node in the View tree. If a View does
  // not have a property, that view's children will be added to this (pre-order)
  // traversal
  protected recursivelySetChildProperty<
    FieldName extends keyof this,
    FieldType extends this[FieldName]
  >(fieldName: FieldName, newValue: FieldType) {
    let viewStack: any[] = [...this.childViews]
    while (viewStack.length > 0) {
      let view = viewStack.pop()

      if (fieldName in view) {
        view[fieldName] = newValue
      } else {
        viewStack.push(...view.childViews)
      }
    }
  }

  private attachToParent(
    parent: View<any> | SceneObject,
    preserveWorldTransform: boolean = false
  ) {
    // set the scene object parent
    let parentSceneObject: SceneObject =
      parent instanceof View ? parent.getSceneObject() : parent
    if (preserveWorldTransform) {
      this.container.setParentPreserveWorldTransform(parentSceneObject)
    } else {
      this.container.setParent(parentSceneObject)
    }
  }

  private cascadeAttachToSceneCallbacks(
    parentDefaults: Defaults | null = null,
    parentView: View | null = null
  ) {
    // creates a prototype cain so that defaults will "fall back"
    // to the parent's defaults
    const objectWithFallback = (obj: any, fallback: any) => {
      let result = Object.create(fallback, {})
      Object.assign(result, obj)
      return result
    }

    // compute the defaults as either a prototype chain of the available
    // defaults, or the first non-null default
    let defaults =
      parentDefaults !== null && this._defaults !== null
        ? objectWithFallback(this._defaults, parentDefaults)
        : parentDefaults ?? this._defaults ?? {}

    // cache the computed defaults for any future attaches
    this._defaults = defaults

    this.attachedToScene = true
    this.onAttachToScene(defaults, parentView)

    for (let child of this.childViews) {
      child.cascadeAttachToSceneCallbacks(defaults, this)
    }
  }
}
