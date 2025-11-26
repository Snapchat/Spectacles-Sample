import {aabb} from "./aabb"

/*
 * Spatial is an interface that when implemented shows that a View has 3D bounds around which to draw a UI as well as
 * a transform which can be used to manipulate that View in 3D space. By implementing ISpatial a view is defining its 3D
 * bounds and possesion of a transform, which allow it to be manipulated via the MovableView class
 */
export interface Spatial {
  /**
   * Returns an axis aligned bounding box which represents the bounds of a view around which a UI can be created
   */
  getAABB(): aabb

  /**
   * Returns a world-space axis aligned bounding box which represents the bounds of a view around which a UI can be created
   */
  getWorldAABB(): aabb

  /**
   * Returns a Transform which is used in manipulating the object in 3D space
   */
  getTransform(): Transform
}
