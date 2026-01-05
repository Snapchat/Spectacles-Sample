/**
 * SimpleColliderInstantiator - TypeScript version of the C# utility
 * Instantiates prefabs inside or on the surface of collider shapes
 */
@component
export class SimpleColliderInstantiatorTS extends BaseScriptComponent {
  @input
  @hint("Prefab to instantiate")
  prefab!: ObjectPrefab

  @input
  @hint("Target object with shape")
  targetObject!: SceneObject

  @input
  @hint("Number of instances to spawn")
  numberOfInstances: number = 10

  @input
  @hint("Toggle for inside or on surface instantiation")
  instantiateInside: boolean = true

  @input
  @hint("Scale factor for instantiated prefabs")
  prefabScale: number = 1.0

  @input
  @hint("Random scale variation (0 = uniform size, 1 = fully random between 0 and prefabScale*2)")
  randomScaleVariation: number = 0.0

  // Initialize with the proper pattern
  onAwake(): void {
    this.createEvent("OnStartEvent").bind(() => {
      this.onStart()
      print("Onstart event triggered")
    })
  }

  onStart(): void {
    if (this.instantiateInside) {
      this.instantiateInsideCollider()
    } else {
      this.instantiateOnColliderSurface()
    }
  }

  instantiateInsideCollider(): void {
    if (!this.targetObject || !this.prefab) {
      print("Error: Target object or prefab not assigned!")
      return
    }

    for (let i = 0; i < this.numberOfInstances; i++) {
      // Generate a random point inside the collider
      const randomPoint = this.getRandomPointInsideCollider()

      // Create a prefab instance at the calculated position
      this.createPrefabInstance(randomPoint)
    }
  }

  instantiateOnColliderSurface(): void {
    if (!this.targetObject || !this.prefab) {
      print("Error: Target object or prefab not assigned!")
      return
    }

    for (let i = 0; i < this.numberOfInstances; i++) {
      // Generate a random point on the collider surface
      const randomPoint = this.getRandomPointOnColliderSurface()

      // Create a prefab instance at the calculated position
      this.createPrefabInstance(randomPoint)
    }
  }

  // Determine the shape type from the target object
  getShapeType(): string {
    // Default to box shape
    const shapeType = "box"

    try {
      // Try a different approach - look for shape components directly
      // This might be more compatible with the runtime environment

      // Skip direct component checks that cause type errors

      print("DEBUG: Using component type check fallback")

      // Fallback to less specific check
      const components = this.targetObject.getComponents("Component")
      for (let i = 0; i < components.length; i++) {
        const component = components[i]
        const typeName = component.getTypeName()
        print("DEBUG: Found component type: " + typeName)

        if (typeName.includes("Box")) return "box"
        if (typeName.includes("Sphere")) return "sphere"
        if (typeName.includes("Capsule")) return "capsule"
      }
    } catch (e) {
      print("Error detecting shape type: " + e)
    }

    print("DEBUG: No specific shape detected, using box as default")
    return shapeType
  }

  // Get a random point inside the collider
  getRandomPointInsideCollider(): vec3 {
    const shapeType = this.getShapeType()

    switch (shapeType) {
      case "box":
        return this.randomPointInBox()
      case "sphere":
        return this.randomPointInSphere()
      default:
        // Default to box if no shape is found
        return this.randomPointInBox()
    }
  }

  // Get a random point on the collider surface
  getRandomPointOnColliderSurface(): vec3 {
    const shapeType = this.getShapeType()

    switch (shapeType) {
      case "box":
        return this.randomPointOnBoxSurface()
      case "sphere":
        return this.randomPointOnSphereSurface()
      default:
        // Default to box if no shape is found
        return this.randomPointOnBoxSurface()
    }
  }

  // Box implementation
  randomPointInBox(): vec3 {
    const transform = this.targetObject.getTransform()
    const centerPos = transform.getWorldPosition()
    const rotation = transform.getWorldRotation()

    // Get box size from the target object's scale
    const objectScale = transform.getWorldScale()
    const boxSize = new vec3(objectScale.x, objectScale.y, objectScale.z)

    print(
      "DEBUG: Using object scale as box size: " +
        boxSize.x.toFixed(2) +
        ", " +
        boxSize.y.toFixed(2) +
        ", " +
        boxSize.z.toFixed(2)
    )

    // Generate random point within box extents (in local space)
    const localPoint = new vec3(
      (Math.random() - 0.5) * boxSize.x,
      (Math.random() - 0.5) * boxSize.y,
      (Math.random() - 0.5) * boxSize.z
    )

    // Transform to world space
    return this.transformPoint(localPoint, centerPos, rotation)
  }

  randomPointOnBoxSurface(): vec3 {
    const transform = this.targetObject.getTransform()
    const centerPos = transform.getWorldPosition()
    const rotation = transform.getWorldRotation()

    // Get box size from the target object's scale
    const objectScale = transform.getWorldScale()
    const boxSize = new vec3(objectScale.x, objectScale.y, objectScale.z)

    print(
      "DEBUG: Using object scale as box size for surface: " +
        boxSize.x.toFixed(2) +
        ", " +
        boxSize.y.toFixed(2) +
        ", " +
        boxSize.z.toFixed(2)
    )

    // Half extents
    const halfWidth = boxSize.x / 2
    const halfHeight = boxSize.y / 2
    const halfDepth = boxSize.z / 2

    // Randomly choose one of the 6 faces
    const face = Math.floor(Math.random() * 6)

    // Generate random point on the selected face (in local space)
    let localPoint: vec3

    switch (face) {
      case 0: // +X
        localPoint = new vec3(halfWidth, (Math.random() - 0.5) * boxSize.y, (Math.random() - 0.5) * boxSize.z)
        break
      case 1: // -X
        localPoint = new vec3(-halfWidth, (Math.random() - 0.5) * boxSize.y, (Math.random() - 0.5) * boxSize.z)
        break
      case 2: // +Y
        localPoint = new vec3((Math.random() - 0.5) * boxSize.x, halfHeight, (Math.random() - 0.5) * boxSize.z)
        break
      case 3: // -Y
        localPoint = new vec3((Math.random() - 0.5) * boxSize.x, -halfHeight, (Math.random() - 0.5) * boxSize.z)
        break
      case 4: // +Z
        localPoint = new vec3((Math.random() - 0.5) * boxSize.x, (Math.random() - 0.5) * boxSize.y, halfDepth)
        break
      case 5: // -Z
        localPoint = new vec3((Math.random() - 0.5) * boxSize.x, (Math.random() - 0.5) * boxSize.y, -halfDepth)
        break
      default:
        localPoint = new vec3(0, 0, 0)
    }

    // Transform to world space
    return this.transformPoint(localPoint, centerPos, rotation)
  }

  // Sphere implementation
  randomPointInSphere(): vec3 {
    const transform = this.targetObject.getTransform()
    const centerPos = transform.getWorldPosition()
    const rotation = transform.getWorldRotation()

    // Try to find the sphere radius from the collider component
    let radius = this.getSphereRadius()
    if (radius <= 0) {
      // Fallback to using transform scale if no collider radius found
      radius = this.getSphereRadiusFromTransform()
    }

    print("DEBUG: Using sphere radius: " + radius.toFixed(2))

    // Similar to Unity's Random.insideUnitSphere, generate a random point inside a unit sphere

    // Implementation 1: Generate using rejection sampling (most uniform)

    // Random point inside unit sphere (using rejection method for uniformity)
    let x, y, z, sqrMag
    do {
      // Random point in cube [-1,1]^3
      x = Math.random() * 2 - 1
      y = Math.random() * 2 - 1
      z = Math.random() * 2 - 1

      // Check if point is inside unit sphere
      sqrMag = x * x + y * y + z * z
    } while (sqrMag > 1.0 || sqrMag < 0.0001)

    // For uniform volume distribution, use cube root of random value
    // This ensures uniform density throughout the sphere volume
    const distanceFromCenter = Math.pow(Math.random(), 1 / 3) * radius

    // Scale the point to have the proper distance from center
    const normalizedDistance = distanceFromCenter / Math.sqrt(sqrMag)
    const randomPoint = new vec3(x * normalizedDistance, y * normalizedDistance, z * normalizedDistance)

    print(
      `DEBUG: Generated sphere point at local coordinates (${randomPoint.x.toFixed(2)}, ${randomPoint.y.toFixed(2)}, ${randomPoint.z.toFixed(2)})`
    )

    // Transform to world space (apply rotation and translation)
    return this.transformPoint(randomPoint, centerPos, rotation)
  }

  randomPointOnSphereSurface(): vec3 {
    const transform = this.targetObject.getTransform()
    const centerPos = transform.getWorldPosition()
    const rotation = transform.getWorldRotation()

    // Try to find the sphere radius from the collider component
    let radius = this.getSphereRadius()
    if (radius <= 0) {
      // Fallback to using transform scale if no collider radius found
      radius = this.getSphereRadiusFromTransform()
    }

    print("DEBUG: Using sphere surface radius: " + radius.toFixed(2))

    // Similar to Unity's Random.onUnitSphere, generate a random point on unit sphere

    // Implementation 1: Using rejection method (most uniform)
    let x, y, z, sqrMag
    do {
      // Generate random point in cube
      x = Math.random() * 2 - 1
      y = Math.random() * 2 - 1
      z = Math.random() * 2 - 1

      // Check if point is inside unit sphere
      sqrMag = x * x + y * y + z * z
    } while (sqrMag > 1.0 || sqrMag < 0.0001)

    // Normalize to get point exactly on sphere surface
    const normalizedDistance = radius / Math.sqrt(sqrMag)
    const randomPoint = new vec3(x * normalizedDistance, y * normalizedDistance, z * normalizedDistance)

    print(
      `DEBUG: Generated sphere surface point at local coordinates (${randomPoint.x.toFixed(2)}, ${randomPoint.y.toFixed(2)}, ${randomPoint.z.toFixed(2)})`
    )

    // Transform to world space (apply rotation and translation)
    return this.transformPoint(randomPoint, centerPos, rotation)
  }

  // Helper method to get sphere radius from collider component (if available)
  private getSphereRadius(): number {
    try {
      // Try to find sphere component by looking at all components
      const components = this.targetObject.getComponents("Component")
      for (let i = 0; i < components.length; i++) {
        const component = components[i]
        if (!component) continue

        // Check if it's a sphere collider by type name
        const typeName = component.getTypeName()
        if (typeName.includes("Sphere")) {
          // Try to access radius property safely
          try {
            const sphereComponent = component as any
            if (sphereComponent.radius !== undefined) {
              // Found radius property!
              print("DEBUG: Found sphere collider with radius: " + sphereComponent.radius)
              return sphereComponent.radius
            }
          } catch (e) {
            print("Error getting radius from sphere component: " + e)
          }
        }
      }
    } catch (e) {
      print("Error searching for sphere collider: " + e)
    }

    // No sphere collider found or couldn't get radius
    return 0
  }

  // Fallback method to derive sphere radius from transform
  private getSphereRadiusFromTransform(): number {
    const transform = this.targetObject.getTransform()
    const objectScale = transform.getWorldScale()

    // Use the smallest dimension to ensure sphere fits within object bounds
    const radius = Math.min(objectScale.x, objectScale.y, objectScale.z) / 2.0
    print("DEBUG: Derived sphere radius from transform scale: " + radius.toFixed(2))
    return radius
  }

  // Helper method to get capsule properties from collider component (if available)
  private getCapsuleProperties(): {valid: boolean; radius: number; length: number; axis: number} {
    try {
      // Try to find capsule component by looking at all components
      const components = this.targetObject.getComponents("Component")
      for (let i = 0; i < components.length; i++) {
        const component = components[i]
        if (!component) continue

        // Check if it's a capsule collider by type name
        const typeName = component.getTypeName()
        if (typeName.includes("Capsule")) {
          // Try to access capsule properties according to Editor API
          try {
            const capsuleComponent = component as any

            // Match the Editor.Components.Physics.Capsule API properties
            // - radius: number
            // - length: number
            // - axis: Axis
            const radius = capsuleComponent.radius !== undefined ? capsuleComponent.radius : 0.5
            const length = capsuleComponent.length !== undefined ? capsuleComponent.length : 2.0

            // Axis can be 0 (X), 1 (Y), or 2 (Z) - default to Y (1)
            let axis = 1 // Default to Y-axis
            if (capsuleComponent.axis !== undefined) {
              // Could be either a number or enum value
              if (typeof capsuleComponent.axis === "number") {
                axis = capsuleComponent.axis
              } else if (capsuleComponent.axis.valueOf !== undefined) {
                // Try to get enum value
                axis = Number(capsuleComponent.axis.valueOf())
              }
            }

            if (radius > 0) {
              print(`DEBUG: Found capsule collider with radius: ${radius}, length: ${length}, axis: ${axis}`)
              return {valid: true, radius, length, axis}
            }
          } catch (e) {
            print("Error getting properties from capsule component: " + e)
          }
        }
      }
    } catch (e) {
      print("Error searching for capsule collider: " + e)
    }

    // No capsule collider found or couldn't get properties
    return {valid: false, radius: 0, length: 0, axis: 1}
  }

  // Fallback method to derive capsule properties from transform
  private getCapsulePropertiesFromTransform(): {valid: boolean; radius: number; length: number; axis: number} {
    const transform = this.targetObject.getTransform()
    const objectScale = transform.getWorldScale()

    // Default to Y axis, using X,Z for radius
    const axis = 1 // Always Y-axis for simplicity
    const radius = Math.min(objectScale.x, objectScale.z) / 2.0
    const length = objectScale.y

    print(
      `DEBUG: Derived capsule properties from transform - radius: ${radius.toFixed(2)}, length: ${length.toFixed(2)}, axis: ${axis}`
    )
    return {valid: true, radius, length, axis}
  }

  // Helper method to transform a point from local to world space
  private transformPoint(localPoint: vec3, position: vec3, rotation: quat): vec3 {
    // Apply rotation
    const rotatedPoint = this.rotatePointByQuaternion(localPoint, rotation)

    // Apply translation
    const worldPoint = new vec3(position.x + rotatedPoint.x, position.y + rotatedPoint.y, position.z + rotatedPoint.z)

    // Print transformation info
    print(`DEBUG: Local point ${localPoint.x.toFixed(2)}, ${localPoint.y.toFixed(2)}, ${localPoint.z.toFixed(2)} 
               transformed to world point ${worldPoint.x.toFixed(2)}, ${worldPoint.y.toFixed(2)}, ${worldPoint.z.toFixed(2)}`)

    return worldPoint
  }

  // Helper method to rotate a point by a quaternion
  private rotatePointByQuaternion(point: vec3, rotation: quat): vec3 {
    // This is a simplified rotation calculation
    // In a full implementation, you'd use the complete quaternion rotation formula
    const x = rotation.x
    const y = rotation.y
    const z = rotation.z
    const w = rotation.w

    const qx =
      point.x * (1 - 2 * y * y - 2 * z * z) + point.y * (2 * x * y - 2 * w * z) + point.z * (2 * x * z + 2 * w * y)
    const qy =
      point.x * (2 * x * y + 2 * w * z) + point.y * (1 - 2 * x * x - 2 * z * z) + point.z * (2 * y * z - 2 * w * x)
    const qz =
      point.x * (2 * x * z - 2 * w * y) + point.y * (2 * y * z + 2 * w * x) + point.z * (1 - 2 * x * x - 2 * y * y)

    return new vec3(qx, qy, qz)
  }

  // Helper method to create a prefab instance at a specific position
  private createPrefabInstance(position: vec3): void {
    if (this.prefab) {
      // We don't need jitter anymore since we're using the transform scale for size
      const instancePosition = position

      const instance = this.prefab.instantiate(this.sceneObject)
      instance.getTransform().setWorldPosition(instancePosition)

      // Apply scaling to the instantiated prefab
      if (this.prefabScale !== 1.0 || this.randomScaleVariation > 0) {
        let scale = this.prefabScale

        // Apply random variation if specified
        if (this.randomScaleVariation > 0) {
          // Calculate random scale between (prefabScale - variation) and (prefabScale + variation)
          // But ensure the scale doesn't go below a minimum threshold (0.1)
          const minScale = Math.max(0.1, this.prefabScale * (1 - this.randomScaleVariation))
          const maxScale = this.prefabScale * (1 + this.randomScaleVariation)
          scale = minScale + Math.random() * (maxScale - minScale)
        }

        // Apply uniform scale to all axes
        instance.getTransform().setLocalScale(new vec3(scale, scale, scale))
      }

      print(
        `Created prefab instance at position: ${instancePosition.x.toFixed(2)}, ${instancePosition.y.toFixed(2)}, ${instancePosition.z.toFixed(2)} with scale: ${instance.getTransform().getLocalScale().x.toFixed(2)}`
      )
    }
  }
}
