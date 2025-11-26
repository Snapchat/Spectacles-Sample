"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * View implements a generic baseclass with useful utilities that many
 * subclasses can take advantage of.
 *
 * Views are meant to be hierarchical, where each parent view is passed to
 * the constructor of the child views. However, a lensCore SceneObject may
 * also be passed as a valid parent
 */
const Event_1 = require("../Event");
const ReplayEvent_1 = require("../ReplayEvent");
class View {
    /**
     * Returns the current alpha of the view
     */
    get alpha() {
        return this._alpha;
    }
    /**
     * @inheritdoc
     */
    set alpha(a) {
        this.setAlpha(a);
    }
    /**
     * Set the alpha of the View to a, and recursively apply this alpha to all descendents.
     * The alpha will be applied by setting the .a component of baseColor to a.
     * @param a The value to set the alpha of the view to, from 0 to 1
     */
    setAlpha(a) {
        this.setAlphaInternal(a);
    }
    constructor(_config) {
        this._config = _config;
        this.childViews = [];
        this.attachedToScene = false;
        this.onDestroyCallbacks = [];
        this.onEnabledEvent = new ReplayEvent_1.default();
        this.onEnabled = this.onEnabledEvent.publicApi();
        this.isDestroyed = false;
        // Internally track the current alpha of the view
        this._alpha = 1;
        this.container = global.scene.createSceneObject(this._config.name ?? "View");
        this.transform = this.container.getTransform();
        //this.addComponent("ScreenTransform").
        if (this._config.position !== undefined) {
            this.position = this._config.position;
        }
        if (this._config.rotation !== undefined) {
            this.localRotation = this._config.rotation;
        }
        if (this._config.scale !== undefined) {
            this.localScale = this._config.scale;
        }
        if (this._config.enabled === false) {
            this.setEnabled(false);
        }
        else {
            this.onEnabledEvent.invoke(true);
        }
        this._defaults = this.config.defaults ?? null;
        View.onCreateViewEvent.invoke(this);
    }
    destroy() {
        if (this.isDestroyed === true) {
            return;
        }
        View.onDestroyViewEvent.invoke(this);
        /*
           this.getSceneObject().destroy() will clean up all the scene objects but not the view objects
        */
        this.isDestroyed = true;
        this.cascadeDestroy();
        this.getSceneObject().destroy();
        for (const callback of this.onDestroyCallbacks) {
            callback();
        }
    }
    cascadeDestroy() {
        for (const child of this.childViews) {
            child.destroy();
        }
    }
    /**
     * addOnDestroyCallback adds a callback to call when the view is destroyed
     */
    addOnDestroyCallback(callback) {
        this.onDestroyCallbacks.push(callback);
    }
    /**
     * Actually sets the alpha internally on the view, and cascades the call to
     * the view's children
     */
    setAlphaInternal(a) {
        this._alpha = a;
        // also set alpha on all of the child views
        for (const child of this.childViews) {
            child.setAlpha(a);
        }
    }
    set localPosition(position) {
        this.transform.setLocalPosition(position);
    }
    get localPosition() {
        return this.transform.getLocalPosition();
    }
    /**
     * @deprecated pleasre use localPosition
     */
    set position(position) {
        this.transform.setLocalPosition(position);
    }
    /**
     * @deprecated use localPosition instead
     */
    get position() {
        return this.transform.getLocalPosition();
    }
    // set the world position of an object
    set worldPosition(position) {
        this.transform.setWorldPosition(position);
    }
    get worldPosition() {
        return this.transform.getWorldPosition();
    }
    /**
     * @deprecated use localScale instead
     */
    set scale(scale) {
        this.transform.setLocalScale(new vec3(scale, scale, scale));
    }
    /**
     * Return the local scale of an object, assuming uniform scaling
     */
    get localScale() {
        return this.transform.getLocalScale().x;
    }
    // set the scale of an object, enforcing uniform scaling
    set localScale(scale) {
        this.transform.setLocalScale(new vec3(scale, scale, scale));
    }
    get localScaleVec3() {
        return this.transform.getLocalScale();
    }
    set localScaleVec3(vec) {
        this.transform.setLocalScale(vec);
    }
    // set the world scale of an object, enforcing uniform scaling
    set worldScale(scale) {
        this.transform.setWorldScale(new vec3(scale, scale, scale));
    }
    // get the world scale, assuming uniform scaling
    get worldScale() {
        return this.transform.getWorldScale().x;
    }
    set worldScaleVec3(scale) {
        this.transform.setWorldScale(scale);
    }
    get worldScaleVec3() {
        return this.transform.getWorldScale();
    }
    set localRotation(rotation) {
        this.transform.setLocalRotation(rotation);
    }
    get localRotation() {
        return this.transform.getLocalRotation();
    }
    set worldRotation(rotation) {
        this.transform.setWorldRotation(rotation);
    }
    get worldRotation() {
        return this.transform.getWorldRotation();
    }
    get name() {
        return this.container.name;
    }
    // Attach this view to a lensCore SceneObject
    attachToScene(parent) {
        // attach the scene
        this.attachToParent(parent);
        // then, fire the onAttachToScene callbacks recursively
        this.cascadeAttachToSceneCallbacks();
        return this;
    }
    // Get the underlying scene object. This should be viewed as an "escape hatch"
    // for doing advanced things
    getSceneObject() {
        return this.container;
    }
    // Get the underlying transform for this object.
    getTransform() {
        return this.transform;
    }
    /**
     * @param worldPos - a point representing something's world position
     * @returns the point's position relative to this view
     */
    getRelativePosOfPoint(worldPos) {
        return this.transform.getInvertedWorldTransform().multiplyPoint(worldPos);
    }
    // isVisible returns true if this component is both enabled and its alpha is not zero
    isVisible() {
        return this.getSceneObject().enabled && this.alpha !== 0;
    }
    setEnabled(enabled) {
        if (enabled === this.getSceneObject().enabled)
            return;
        this.getSceneObject().enabled = enabled;
        this.onEnabledEvent.invoke(enabled);
    }
    isEnabled() {
        return this.getSceneObject().enabled;
    }
    addComponent(typeName) {
        return this.container.createComponent(typeName);
    }
    getComponent(typeName) {
        return this.container.getComponent(typeName);
    }
    // Add a child view to this view
    addChild(child, configure, preserveWorldTransform = false) {
        child.attachToParent(this, preserveWorldTransform);
        this.childViews.push(child);
        if (configure !== undefined) {
            configure(child);
        }
        // the child is being attached after the parent, so it needs
        // to have its onAttachToScene hook called, recursively
        if (this.attachedToScene) {
            child.cascadeAttachToSceneCallbacks(this._defaults);
        }
        return child;
    }
    // construct and add a child
    newChild(ctor, conf, customize) {
        return this.addChild(new ctor(conf), customize);
    }
    /**
     * @deprecated use destroyChild or detachChild instead.
     */
    removeChild(child) {
        child.destroy();
        const index = this.childViews.indexOf(child);
        if (index === -1) {
            return;
        }
        this.childViews.splice(index, 1);
    }
    /**
     * Destroys and removes the child from this View
     * @param child the child to be destroyed
     * @returns whether the child was destroyed
     */
    destroyChild(child) {
        const index = this.childViews.indexOf(child);
        if (index === -1) {
            return false;
        }
        child.destroy();
        this.childViews.splice(index, 1);
        return true;
    }
    /**
     * Detaches child from parent and removes the child from this View
     * @param child the child to be detached
     * @returns whether the child was detached
     */
    detachChild(child) {
        const index = this.childViews.indexOf(child);
        if (index === -1) {
            return false;
        }
        child.getSceneObject().removeParent();
        this.childViews.splice(index, 1);
        return true;
    }
    get config() {
        return this._config;
    }
    // onAttachToScene is a lifecycle hook that happens when a view is attached
    // to its parent. It is the place where "defaults" should be used, since they
    // will not cascade prior to this hook
    onAttachToScene(_defaults, _parentView) {
        // default is noop
    }
    // Set a a property on all child views. If a View already has the property,
    // it is assumed that View will handle setting the property on its child
    // views, or (more likely) is a leaf node in the View tree. If a View does
    // not have a property, that view's children will be added to this (pre-order)
    // traversal
    recursivelySetChildProperty(fieldName, newValue) {
        const viewStack = [...this.childViews];
        while (viewStack.length > 0) {
            const view = viewStack.pop();
            if (fieldName in view) {
                view[fieldName] = newValue;
            }
            else {
                viewStack.push(...view.childViews);
            }
        }
    }
    attachToParent(parent, preserveWorldTransform = false) {
        // set the scene object parent
        const parentSceneObject = parent instanceof View ? parent.getSceneObject() : parent;
        if (preserveWorldTransform) {
            this.container.setParentPreserveWorldTransform(parentSceneObject);
        }
        else {
            this.container.setParent(parentSceneObject);
        }
    }
    cascadeAttachToSceneCallbacks(parentDefaults = null, parentView = null) {
        // creates a prototype cain so that defaults will "fall back"
        // to the parent's defaults
        const objectWithFallback = (obj, fallback) => {
            const result = Object.create(fallback, {});
            Object.assign(result, obj);
            return result;
        };
        // compute the defaults as either a prototype chain of the available
        // defaults, or the first non-null default
        const defaults = parentDefaults !== null && this._defaults !== null
            ? objectWithFallback(this._defaults, parentDefaults)
            : (parentDefaults ?? this._defaults ?? {});
        // cache the computed defaults for any future attaches
        this._defaults = defaults;
        this.attachedToScene = true;
        this.onAttachToScene(defaults, parentView);
        for (const child of this.childViews) {
            child.cascadeAttachToSceneCallbacks(defaults, this);
        }
    }
}
View.onCreateViewEvent = new Event_1.default();
View.onCreateView = View.onCreateViewEvent.publicApi();
View.onDestroyViewEvent = new Event_1.default();
View.onDestroyView = View.onDestroyViewEvent.publicApi();
exports.default = View;
//# sourceMappingURL=View.js.map