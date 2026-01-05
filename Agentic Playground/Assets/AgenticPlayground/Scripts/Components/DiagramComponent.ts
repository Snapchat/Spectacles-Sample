import {InteractableManipulation} from "SpectaclesInteractionKit.lspkg/Components/Interaction/InteractableManipulation/InteractableManipulation"
import {ImageNode} from "../Nodes/ImageNode"
import {ModelNode} from "../Nodes/ModelNode"
import {TextNode} from "../Nodes/TextNode"
import {Line3D} from "../Utils/Line3D"
import {TreeStructureUtils} from "../Utils/TreeStructureUtils"

/**
/**
 * Node animation class for Y-axis separation
 */
export class YSeparationAnimation {
  public nodeId: string
  public startPosition: vec3
  public targetPosition: vec3
  public startTime: number
  public duration: number
  public isActive: boolean
  public onComplete: (() => void) | null

  constructor(nodeId: string, startPos: vec3, targetPos: vec3, duration: number, onComplete?: () => void) {
    this.nodeId = nodeId
    this.startPosition = startPos
    this.targetPosition = targetPos
    this.startTime = Date.now()
    this.duration = duration
    this.isActive = true
    this.onComplete = onComplete || null
  }

  public getCurrentPosition(): vec3 {
    const elapsed = (Date.now() - this.startTime) / 1000
    const progress = Math.min(elapsed / this.duration, 1.0)

    // Use smooth easing function
    const easedProgress = this.easeInOutCubic(progress)

    return this.startPosition.add(this.targetPosition.sub(this.startPosition).uniformScale(easedProgress))
  }

  public isComplete(): boolean {
    const elapsed = (Date.now() - this.startTime) / 1000
    return elapsed >= this.duration
  }

  private easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
  }
}

/**
 * Node mapping reference classes for different types of nodes
 */
export class NodeMappingReference {
  public nodeObject: SceneObject
  public nodeId: string
  public nodeName: string
  public position: vec3
  public connections: string[] = []
  public treeLevel: number = 0
  public parentNodeId: string | null = null
  public childNodeIds: string[] = []
  public angleFromParent: number = 0

  constructor(nodeObject: SceneObject, nodeId: string, nodeName: string, position: vec3, treeLevel: number = 0) {
    this.nodeObject = nodeObject
    this.nodeId = nodeId
    this.nodeName = nodeName
    this.position = position
    this.treeLevel = treeLevel
  }
}

export class StartingNodeMappingReference extends NodeMappingReference {
  public diagramName: string

  constructor(nodeObject: SceneObject, nodeId: string, nodeName: string, position: vec3, diagramName: string) {
    super(nodeObject, nodeId, nodeName, position, 0) // Root is always level 0
    this.diagramName = diagramName
  }
}

export class TextNodeMappingReference extends NodeMappingReference {
  public textContent: string

  constructor(
    nodeObject: SceneObject,
    nodeId: string,
    nodeName: string,
    position: vec3,
    textContent: string,
    treeLevel: number = 0
  ) {
    super(nodeObject, nodeId, nodeName, position, treeLevel)
    this.textContent = textContent
  }
}

export class ImageNodeMappingReference extends NodeMappingReference {
  public textContent: string
  public imagePath: string

  constructor(
    nodeObject: SceneObject,
    nodeId: string,
    nodeName: string,
    position: vec3,
    textContent: string,
    imagePath: string,
    treeLevel: number = 0
  ) {
    super(nodeObject, nodeId, nodeName, position, treeLevel)
    this.textContent = textContent
    this.imagePath = imagePath
  }
}

export class ModelNodeMappingReference extends NodeMappingReference {
  public textContent: string
  public modelPath: string

  constructor(
    nodeObject: SceneObject,
    nodeId: string,
    nodeName: string,
    position: vec3,
    textContent: string,
    modelPath: string,
    treeLevel: number = 0
  ) {
    super(nodeObject, nodeId, nodeName, position, treeLevel)
    this.textContent = textContent
    this.modelPath = modelPath
  }
}

export class LineMappingReference {
  public lineObject: SceneObject
  public lineId: string
  public pointA: NodeMappingReference
  public pointB: NodeMappingReference
  public line3DComponent: Line3D

  constructor(
    lineObject: SceneObject,
    lineId: string,
    pointA: NodeMappingReference,
    pointB: NodeMappingReference,
    line3DComponent: Line3D
  ) {
    this.lineObject = lineObject
    this.lineId = lineId
    this.pointA = pointA
    this.pointB = pointB
    this.line3DComponent = line3DComponent
  }
}

/**
 * Simplified Mind Node Manager for creating 2D tree structures
 */
@component
export class DiagramComponent extends BaseScriptComponent {
  // Prefab References
  @input
  @hint(
    "Starting node prefab: The root node of the mind map tree structure. Should contain TextNode component and InteractableManipulation component. This node serves as the origin point for all branching and maintains the central diagram name."
  )
  public startPrefab: ObjectPrefab

  @input
  @hint(
    "Text node prefab: Standard text-based nodes in the mind map. Should contain TextNode component and InteractableManipulation component. These nodes display title (max 20 chars) and content (max 95 chars) text with AI/tech themed fake content generation."
  )
  public textPrefab: ObjectPrefab

  @input
  @hint(
    "Image node prefab: Visual nodes that display images alongside text. Should contain ImageNode component and InteractableManipulation component. These nodes display title (max 26 chars) and content (max 200 chars) with special Y offset multiplier for elevated positioning."
  )
  public imagePrefab: ObjectPrefab

  @input
  @hint(
    "Model node prefab: 3D model nodes in the mind map. Should contain ModelNode component and InteractableManipulation component. These nodes display title (max 22 chars) and can reference 3D models with configurable scale parameters."
  )
  public modelPrefab: ObjectPrefab

  @input
  @hint(
    "Line prefab with Line3D component: Connects nodes in the mind map structure. Must contain Line3D component for rendering connections between nodes. Lines connect to invisible objects at logical positions while nodes appear visually offset above connection points."
  )
  public linePrefab: ObjectPrefab

  // Direction Control
  @input
  @hint(
    "Start direction reference object: Scene object that defines the starting point for overall mind map directionality. The tree structure will orient itself based on the vector from this object to the end direction reference, creating a directional flow for the entire mind map layout."
  )
  public startDirectionRef: SceneObject

  @input
  @hint(
    "End direction reference object: Scene object that defines the ending point for overall mind map directionality. Combined with start direction reference, this creates a directional vector that influences the angular distribution of all node branches in the tree structure."
  )
  public endDirectionRef: SceneObject

  // Tree Structure Configuration
  @input
  @hint(
    "Level separation distance: Distance between tree levels in world units. Controls how far child nodes are placed from their parent nodes. Higher values create more spread-out tree structures with greater separation between generations. Affects both visual appearance and collision detection."
  )
  @widget(new SliderWidget(0, 400, 10))
  public levelSeparation: number = 200

  @input
  @hint(
    "Angular spread per level (degrees): Angular range within which child nodes are distributed around their parent. 90 degrees creates a quarter-circle distribution, 180 degrees creates a half-circle. Combined with minBranchDistance, this ensures proper spacing between sibling nodes."
  )
  @widget(new SliderWidget(30, 180, 10))
  public angularSpread: number = 90

  @input
  @hint(
    "Minimum distance between branches: Minimum world unit distance between sibling nodes from the same parent. Uses trigonometry to calculate required angular separation based on levelSeparation. Prevents overcrowding of child nodes and ensures readable spacing in the tree structure."
  )
  @widget(new SliderWidget(20, 200, 10))
  public minBranchDistance: number = 100

  @input
  @hint(
    "Maximum branches per node: Maximum number of child nodes that can branch from a single parent node. Controls tree density and complexity. Higher values create bushier trees while lower values create more linear structures. Affects randomization in test phases 2-4."
  )
  @widget(new SliderWidget(1, 4, 1))
  public maxBranches: number = 4

  // Collision Avoidance Configuration
  @input
  @hint(
    "Minimum X distance between nodes: Minimum horizontal separation required between any two nodes in world units. When nodes are closer than this distance in X coordinate, the collision avoidance system triggers Y-axis separation animations. Lower values allow denser layouts, higher values enforce more spread."
  )
  @widget(new SliderWidget(20, 300, 10))
  public minXDistance: number = 150

  @input
  @hint(
    "Maximum Y offset for collision avoidance: Maximum vertical distance nodes can be moved up or down to resolve X-axis conflicts. Controls the Y-axis range for collision resolution. Nodes will be randomly moved within ±maxYOffset to separate them vertically when too close horizontally."
  )
  @widget(new SliderWidget(50, 300, 10))
  public maxYOffset: number = 200

  @input
  @hint(
    "Y separation animation duration (seconds): Time duration for smooth Y-axis separation animations when resolving node conflicts. Shorter durations create snappy movements, longer durations create smoother transitions. Uses easeInOutCubic for natural motion curves."
  )
  @widget(new SliderWidget(0.5, 3.0, 0.1))
  public ySeparationDuration: number = 1.5

  @input
  @hint(
    "Enable Y separation collision avoidance: Master toggle for the collision avoidance system. When enabled, automatically detects nodes that are too close in X coordinate and animates them to different Y positions. Prevents overlapping nodes and maintains readable layout spacing."
  )
  public enableYSeparation: boolean = true

  @input
  @hint(
    "Enable initial Y variation in tree structure: Adds random Y-axis variation to nodes during initial creation. Creates more organic, natural-looking tree structures by introducing vertical randomness. Variation increases with tree level depth, making deeper nodes more scattered vertically."
  )
  public enableYVariation: boolean = true

  @input
  @hint(
    "Maximum initial Y variation per level: Maximum random Y offset applied during node creation, scaled by tree level depth. Level 1 nodes get small variation, deeper levels get progressively more variation. Creates organic branching patterns that avoid rigid geometric layouts."
  )
  @widget(new SliderWidget(20, 200, 10))
  public maxYVariation: number = 80

  @input
  @hint(
    "Y offset for node instantiation (visual offset): Base upward offset applied to all node visual positions while keeping logical positions for line connections at original calculated positions. Creates floating effect where nodes appear above their connection points. Set to 0 for traditional flat layout."
  )
  @widget(new SliderWidget(0, 200, 10))
  public nodeYOffset: number = 50

  @input
  @hint(
    "Y offset multiplier for image nodes: Special multiplier applied to image node Y offsets, making them float higher than other node types. Image nodes get nodeYOffset × imageYOffsetMultiplier elevation. Useful for creating visual hierarchy where images stand out above text and model nodes."
  )
  @widget(new SliderWidget(0.1, 3.0, 0.1))
  public imageYOffsetMultiplier: number = 1.5

  // Debug Configuration
  @input
  @hint("Enable debug logging for diagram operations")
  public enableDebugLogging: boolean = false

  // Internal state
  private nodeReferences: Map<string, NodeMappingReference> = new Map()
  private lineReferences: Map<string, LineMappingReference> = new Map()
  private startingNode: StartingNodeMappingReference | null = null
  private nodeCounter: number = 0
  private lineCounter: number = 0
  private currentPhase: number = -1

  // Y Separation Animation System
  private activeYAnimations: Map<string, YSeparationAnimation> = new Map()

  // Manipulation Reset System
  private manipulationStates: Map<
    string,
    {
      nodeObject: SceneObject
      originalLogicalPosition: vec3
      originalVisualPosition: vec3
      originalRotation: quat
      nodeType: string
      isManipulating: boolean
    }
  > = new Map()

  // Random name pools
  private nodeNames: string[] = [
    "Alpha",
    "Beta",
    "Gamma",
    "Delta",
    "Epsilon",
    "Zeta",
    "Eta",
    "Theta",
    "Iota",
    "Kappa",
    "Lambda",
    "Mu",
    "Nu",
    "Xi",
    "Omicron",
    "Pi",
    "Rho",
    "Sigma",
    "Tau",
    "Upsilon",
    "Phi",
    "Chi",
    "Psi",
    "Omega"
  ]

  private diagramNames: string[] = [
    "Neural Network",
    "Knowledge Tree",
    "Concept Map",
    "Thought Web",
    "Idea Cluster",
    "Mind Palace",
    "Logic Chain",
    "Memory Graph"
  ]

  onUpdate() {
    this.updateYSeparationAnimations()
  }

  private updateYSeparationAnimations(): void {
    const completedAnimations: string[] = []

    for (const [nodeId, animation] of this.activeYAnimations) {
      if (animation.isActive) {
        const currentLogicalPosition = animation.getCurrentPosition()
        const node = this.nodeReferences.get(nodeId)

        if (node) {
          // Update node logical position (for calculations)
          node.position = currentLogicalPosition

          // Determine node type
          let nodeType = "default"
          if (node instanceof StartingNodeMappingReference) {
            nodeType = "start"
          } else if (node instanceof TextNodeMappingReference) {
            nodeType = "text"
          } else if (node instanceof ImageNodeMappingReference) {
            nodeType = "image"
          } else if (node instanceof ModelNodeMappingReference) {
            nodeType = "model"
          }

          // Update node visual position (with Y offset)
          const currentVisualPosition = this.getVisualPosition(currentLogicalPosition, nodeType)
          node.nodeObject.getTransform().setWorldPosition(currentVisualPosition)

          // Update connected lines (lines connect to logical positions)
          this.updateConnectedLines(nodeId)
        }

        // Check if animation is complete
        if (animation.isComplete()) {
          completedAnimations.push(nodeId)

          // Call completion callback if provided
          if (animation.onComplete) {
            animation.onComplete()
          }
        }
      }
    }

    // Remove completed animations
    for (const nodeId of completedAnimations) {
      this.activeYAnimations.delete(nodeId)
    }
  }

  private updateConnectedLines(nodeId: string): void {
    for (const line of this.lineReferences.values()) {
      if (line.pointA.nodeId === nodeId || line.pointB.nodeId === nodeId) {
        if (line.line3DComponent && line.line3DComponent.pathPoints.length >= 2) {
          // Update connection points to logical positions
          const connectionPointA = line.line3DComponent.pathPoints[0]
          const connectionPointB = line.line3DComponent.pathPoints[1]

          connectionPointA.getTransform().setWorldPosition(line.pointA.position)
          connectionPointB.getTransform().setWorldPosition(line.pointB.position)

          line.line3DComponent.updateMesh()
        }
      }
    }
  }

  private performCollisionAvoidance(): void {
    if (!this.enableYSeparation) return

    print("SimpleMindNodeManager: Performing collision avoidance")

    const conflicts = TreeStructureUtils.findNodesNeedingYSeparation(this.nodeReferences, this.minXDistance)

    if (conflicts.length > 0) {
      print(`SimpleMindNodeManager: Found ${conflicts.length} X-distance conflicts, applying Y separation`)

      // Process each conflict
      for (const conflict of conflicts) {
        // Move the node with higher level (further from root)
        const nodeToMove = conflict.nodeA.treeLevel > conflict.nodeB.treeLevel ? conflict.nodeA : conflict.nodeB

        // Calculate Y offset
        const otherNodes = Array.from(this.nodeReferences.values()).filter((n) => n.nodeId !== nodeToMove.nodeId)

        const yOffset = TreeStructureUtils.calculateYSeparationOffset(
          nodeToMove.position,
          otherNodes,
          this.minXDistance,
          this.maxYOffset
        )

        const newPosition = new vec3(nodeToMove.position.x, nodeToMove.position.y + yOffset, nodeToMove.position.z)

        // Start Y separation animation
        this.startYSeparationAnimation(nodeToMove, newPosition)
      }
    } else {
      print("SimpleMindNodeManager: No X-distance conflicts found")
    }
  }

  private startYSeparationAnimation(node: NodeMappingReference, targetPosition: vec3): void {
    const animation = new YSeparationAnimation(
      node.nodeId,
      node.position,
      targetPosition,
      this.ySeparationDuration,
      () => {
        print(`SimpleMindNodeManager: Y separation animation completed for ${node.nodeId}`)
      }
    )

    this.activeYAnimations.set(node.nodeId, animation)
    print(`SimpleMindNodeManager: Started Y separation animation for ${node.nodeId}`)
  }

  // Test Phase 0: Generate starting node with random name
  private testPhase0(): void {
    print("SimpleMindNodeManager: Starting Phase 0 - Creating starting node")
    this.clearAllNodes()

    const randomDiagramName = this.diagramNames[Math.floor(Math.random() * this.diagramNames.length)]
    const startPos = this.getStartingPosition()

    this.startingNode = this.createStartingNode(randomDiagramName, startPos)
    print(`SimpleMindNodeManager: Created starting node with diagram name: ${randomDiagramName}`)
  }

  // Test Phase 1: Create 3 main branches from starting node (Level 1)
  private testPhase1(): void {
    print("SimpleMindNodeManager: Starting Phase 1 - Creating Level 1 tree structure")

    if (!this.startingNode) {
      this.testPhase0()
    }

    if (!this.startingNode) {
      print("SimpleMindNodeManager: Error - No starting node available")
      return
    }

    // Calculate tree positions for Level 1 (3 main branches)
    const level1Positions = TreeStructureUtils.calculateChildPositions(
      this.startingNode.position,
      3,
      1,
      this.levelSeparation,
      this.angularSpread,
      this.minBranchDistance,
      this.startDirectionRef?.getTransform().getWorldPosition(),
      this.endDirectionRef?.getTransform().getWorldPosition(),
      this.enableYVariation,
      this.maxYVariation
    )

    // Create 3 nodes at Level 1
    const textNode = this.createTextNode("Text Node", level1Positions[0], "Sample text content", 1)
    TreeStructureUtils.establishParentChild(this.startingNode, textNode)
    this.createLineBetweenNodes(this.startingNode, textNode)

    const imageNode = this.createImageNode("Image Node", level1Positions[1], "Image description", "image_path", 1)
    TreeStructureUtils.establishParentChild(this.startingNode, imageNode)
    this.createLineBetweenNodes(this.startingNode, imageNode)

    const modelNode = this.createModelNode("Model Node", level1Positions[2], "Model description", "model_path", 1)
    TreeStructureUtils.establishParentChild(this.startingNode, modelNode)
    this.createLineBetweenNodes(this.startingNode, modelNode)

    print("SimpleMindNodeManager: Phase 1 completed - Level 1 tree structure created")
  }

  // Test Phase 2: Create Level 2 nodes from Level 1 nodes
  private testPhase2(): void {
    print("SimpleMindNodeManager: Starting Phase 2 - Creating Level 2 tree structure")

    if (this.nodeReferences.size <= 1) {
      this.testPhase1()
    }

    const level1Nodes = TreeStructureUtils.getNodesAtLevel(this.nodeReferences, 1)

    for (const parentNode of level1Nodes) {
      const branchCount = Math.floor(Math.random() * (this.maxBranches + 1)) // 0 to maxBranches

      if (branchCount > 0) {
        const childPositions = TreeStructureUtils.calculateChildPositions(
          parentNode.position,
          branchCount,
          2,
          this.levelSeparation,
          this.angularSpread,
          this.minBranchDistance,
          this.startDirectionRef?.getTransform().getWorldPosition(),
          this.endDirectionRef?.getTransform().getWorldPosition(),
          this.enableYVariation,
          this.maxYVariation
        )

        for (let i = 0; i < branchCount; i++) {
          const newNode = this.createRandomNode(childPositions[i], 2)
          TreeStructureUtils.establishParentChild(parentNode, newNode)
          this.createLineBetweenNodes(parentNode, newNode)
        }
      }
    }

    print("SimpleMindNodeManager: Phase 2 completed - Level 2 tree structure created")
  }

  // Test Phase 3: Modify some Level 2 nodes (variations)
  private testPhase3(): void {
    print("SimpleMindNodeManager: Starting Phase 3 - Creating variations")

    // Ensure we have the prerequisite structure
    if (this.nodeReferences.size <= 4) {
      print("SimpleMindNodeManager: Phase 3 requires previous phases - executing Phase 2 first")
      this.testPhase2()
    }

    const level2Nodes = TreeStructureUtils.getNodesAtLevel(this.nodeReferences, 2)

    if (level2Nodes.length === 0) {
      print("SimpleMindNodeManager: No Level 2 nodes found - executing Phase 2 first")
      this.testPhase2()
    }

    // Get fresh level 2 nodes after potential phase 2 execution
    const currentLevel2Nodes = TreeStructureUtils.getNodesAtLevel(this.nodeReferences, 2)
    const nodesToModify = Math.floor(currentLevel2Nodes.length * 0.3) // Modify 30% of level 2 nodes

    print(`SimpleMindNodeManager: Modifying ${nodesToModify} out of ${currentLevel2Nodes.length} Level 2 nodes`)

    for (let i = 0; i < nodesToModify && i < currentLevel2Nodes.length; i++) {
      const nodeToRemove = currentLevel2Nodes[i]
      const parent = this.nodeReferences.get(nodeToRemove.parentNodeId!)

      if (parent) {
        print(`SimpleMindNodeManager: Replacing node ${nodeToRemove.nodeId} with variation`)

        // Remove the old node
        this.removeNode(nodeToRemove)

        // Create a new node in a different position
        const newPositions = TreeStructureUtils.calculateChildPositions(
          parent.position,
          1,
          2,
          this.levelSeparation,
          this.angularSpread,
          this.minBranchDistance,
          this.startDirectionRef?.getTransform().getWorldPosition(),
          this.endDirectionRef?.getTransform().getWorldPosition(),
          this.enableYVariation,
          this.maxYVariation
        )
        const newNode = this.createRandomNode(newPositions[0], 2)
        TreeStructureUtils.establishParentChild(parent, newNode)
        this.createLineBetweenNodes(parent, newNode)
      }
    }

    print("SimpleMindNodeManager: Phase 3 completed - Variations created")
  }

  // Test Phase 4: Continue growing the tree
  private testPhase4(): void {
    print("SimpleMindNodeManager: Starting Phase 4 - Continue growing")

    // Ensure we have the prerequisite structure (similar to phase 2)
    if (this.nodeReferences.size <= 4) {
      print("SimpleMindNodeManager: Phase 4 requires previous phases - executing Phase 2 first")
      this.testPhase2()
    }

    const level2Nodes = TreeStructureUtils.getNodesAtLevel(this.nodeReferences, 2)

    if (level2Nodes.length === 0) {
      print("SimpleMindNodeManager: No Level 2 nodes found - executing Phase 2 first")
      this.testPhase2()
    }

    // Get fresh level 2 nodes after potential phase 2 execution
    const currentLevel2Nodes = TreeStructureUtils.getNodesAtLevel(this.nodeReferences, 2)

    print(`SimpleMindNodeManager: Found ${currentLevel2Nodes.length} Level 2 nodes to grow from`)

    for (const parentNode of currentLevel2Nodes) {
      if (Math.random() < 0.5) {
        // 50% chance to branch
        const branchCount = Math.floor(Math.random() * (this.maxBranches + 1))

        if (branchCount > 0) {
          print(`SimpleMindNodeManager: Adding ${branchCount} branches to Level 2 node ${parentNode.nodeId}`)

          const childPositions = TreeStructureUtils.calculateChildPositions(
            parentNode.position,
            branchCount,
            3,
            this.levelSeparation,
            this.angularSpread,
            this.minBranchDistance,
            this.startDirectionRef?.getTransform().getWorldPosition(),
            this.endDirectionRef?.getTransform().getWorldPosition(),
            this.enableYVariation,
            this.maxYVariation
          )

          for (let i = 0; i < branchCount; i++) {
            const newNode = this.createRandomNode(childPositions[i], 3)
            TreeStructureUtils.establishParentChild(parentNode, newNode)
            this.createLineBetweenNodes(parentNode, newNode)
          }
        }
      }
    }

    print("SimpleMindNodeManager: Phase 4 completed - Tree growth continued")
  }

  // Node creation methods
  private createStartingNode(diagramName: string, position: vec3): StartingNodeMappingReference {
    const nodeId = this.generateNodeId()
    const nodeObject = this.startPrefab.instantiate(this.getSceneObject())

    // Place node at visual position (with Y offset)
    const visualPosition = this.getVisualPosition(position, "start")
    nodeObject.getTransform().setWorldPosition(visualPosition)

    // Setup manipulation reset behavior
    this.setupManipulationResetBehavior(nodeObject, nodeId, position, "start")

    // Fill with fake text content
    const textNodeRef = nodeObject.getComponent(TextNode.getTypeName()) as TextNode
    if (textNodeRef) {
      const fakeTitle = this.generateVariedFakeTitle(20, "text")
      const fakeContent = this.generateVariedFakeContent(95, "text")

      textNodeRef.updateText(fakeTitle, fakeContent)
      textNodeRef.setAsStartingNode(true)
    }

    const startingNode = new StartingNodeMappingReference(
      nodeObject,
      nodeId,
      "Start",
      position, // Store logical position for calculations
      diagramName
    )

    this.nodeReferences.set(nodeId, startingNode)

    return startingNode
  }

  private createTextNode(
    name: string,
    position: vec3,
    textContent: string,
    level: number = 0,
    customNodeId?: string
  ): TextNodeMappingReference {
    const nodeId = customNodeId || this.generateNodeId()
    const nodeObject = this.textPrefab.instantiate(this.getSceneObject())

    // Place node at visual position (with Y offset)
    const visualPosition = this.getVisualPosition(position, "text")
    nodeObject.getTransform().setWorldPosition(visualPosition)

    // Setup manipulation reset behavior
    this.setupManipulationResetBehavior(nodeObject, nodeId, position, "text")

    // Fill with actual content or fake content for testing
    const textNodeRef = nodeObject.getComponent(TextNode.getTypeName()) as TextNode
    if (textNodeRef) {
      if (textContent && textContent.trim().length > 0) {
        // Use actual content passed to the method
        const title = name || "Text Node"
        textNodeRef.updateText(title.substring(0, 20), textContent.substring(0, 95))
      } else {
        // Fall back to fake content for testing
        const fakeTitle = this.generateVariedFakeTitle(20, "text")
        const fakeContent = this.generateVariedFakeContent(95, "text")

        textNodeRef.updateText(fakeTitle, fakeContent)
      }
    }

    const textNode = new TextNodeMappingReference(
      nodeObject,
      nodeId,
      name,
      position, // Store logical position for calculations
      textContent,
      level
    )

    this.nodeReferences.set(nodeId, textNode)

    return textNode
  }

  private createImageNode(
    name: string,
    position: vec3,
    textContent: string,
    imagePath: string,
    level: number = 0,
    customNodeId?: string
  ): ImageNodeMappingReference {
    const nodeId = customNodeId || this.generateNodeId()
    const nodeObject = this.imagePrefab.instantiate(this.getSceneObject())

    // Place node at visual position (with Y offset and image multiplier)
    const visualPosition = this.getVisualPosition(position, "image")
    nodeObject.getTransform().setWorldPosition(visualPosition)

    // Setup manipulation reset behavior
    this.setupManipulationResetBehavior(nodeObject, nodeId, position, "image")

    // Fill with actual content or fake content for testing
    const imageNodeRef = nodeObject.getComponent(ImageNode.getTypeName()) as ImageNode
    if (imageNodeRef) {
      let finalTitle: string
      let finalContent: string
      let imagePrompt: string

      if (textContent && textContent.trim().length > 0) {
        // Use actual content passed to the method
        finalTitle = (name || "Image Node").substring(0, 26)

        // Try to extract image prompt from content
        if (textContent.includes("imagePrompt:")) {
          const promptMatch = textContent.match(/imagePrompt:\s*"([^"]+)"/)
          imagePrompt = promptMatch ? promptMatch[1] : `Create an image related to: ${finalTitle}`
          // Remove the prompt from content to keep it clean
          const promptIndex = textContent.indexOf("imagePrompt:")
          finalContent = textContent.substring(0, promptIndex).trim().substring(0, 200)
        } else {
          finalContent = textContent.substring(0, 200)
          imagePrompt = `Create an image related to: ${finalTitle}`
        }
      } else {
        // Fall back to fake content for testing
        finalTitle = this.generateVariedFakeTitle(26, "image")
        finalContent = this.generateVariedFakeContent(200, "image")
        imagePrompt = `Create an image related to: ${finalTitle}`
      }

      // Use setNodeData to properly set title, content, and prompt separately
      if (imageNodeRef.setNodeData) {
        imageNodeRef.setNodeData(finalTitle, finalContent, imagePrompt)
      } else {
        // Fallback to updateText if setNodeData is not available
        imageNodeRef.updateText(finalTitle, finalContent)
      }

      // Trigger image generation with the extracted prompt
      // The ImageGenBridge should be configured on the ImageNode prefab
      if (imageNodeRef.generateContent) {
        imageNodeRef.generateContent(imagePrompt).catch((error) => {
          if (this.enableDebugLogging) {
            print(`DiagramComponent: Image generation failed for ${nodeId}: ${error}`)
          }
        })

        if (this.enableDebugLogging) {
          print(`DiagramComponent: Triggered image generation for ${nodeId} with prompt: "${imagePrompt}"`)
        }
      } else {
        if (this.enableDebugLogging) {
          print(`DiagramComponent: generateContent method not available on ImageNode ${nodeId}`)
        }
      }
    }

    const imageNode = new ImageNodeMappingReference(
      nodeObject,
      nodeId,
      name,
      position, // Store logical position for calculations
      textContent,
      imagePath,
      level
    )

    this.nodeReferences.set(nodeId, imageNode)

    return imageNode
  }

  private createModelNode(
    name: string,
    position: vec3,
    textContent: string,
    modelPath: string,
    level: number = 0,
    customNodeId?: string
  ): ModelNodeMappingReference {
    const nodeId = customNodeId || this.generateNodeId()
    const nodeObject = this.modelPrefab.instantiate(this.getSceneObject())

    // Place node at visual position (with Y offset)
    const visualPosition = this.getVisualPosition(position, "model")
    nodeObject.getTransform().setWorldPosition(visualPosition)

    // Setup manipulation reset behavior
    this.setupManipulationResetBehavior(nodeObject, nodeId, position, "model")

    // Fill with actual content or fake content for testing
    const modelNodeRef = nodeObject.getComponent(ModelNode.getTypeName()) as ModelNode
    if (modelNodeRef) {
      let finalTitle: string
      let modelPrompt: string

      if (textContent && textContent.trim().length > 0) {
        // Use actual content passed to the method
        finalTitle = (name || "Model Node").substring(0, 22)

        // Try to extract model prompt from content
        if (textContent.includes("modelPrompt:")) {
          const promptMatch = textContent.match(/modelPrompt:\s*"([^"]+)"/)
          modelPrompt = promptMatch ? promptMatch[1] : `Create a 3D model of: ${finalTitle}`
          // Remove the prompt from content to keep it clean
          const promptIndex = textContent.indexOf("modelPrompt:")
          textContent = textContent.substring(0, promptIndex).trim()
        } else {
          modelPrompt = `Create a 3D model of: ${finalTitle}`
        }
      } else {
        // Fall back to fake content for testing
        finalTitle = this.generateVariedFakeTitle(22, "model")
        modelPrompt = `Create a 3D model of: ${finalTitle}`
      }

      // Use setNodeData to properly set title, content, and prompt separately
      if (modelNodeRef.setNodeData) {
        modelNodeRef.setNodeData(finalTitle, textContent || "3D model representation", modelPrompt)
      } else {
        // Fallback to updateText if setNodeData is not available
        modelNodeRef.updateText(finalTitle)
      }

      // Trigger model generation with the extracted prompt
      // The ModelGenBridge should be configured on the ModelNode prefab
      if (modelNodeRef.generateContent) {
        modelNodeRef.generateContent(modelPrompt).catch((error) => {
          if (this.enableDebugLogging) {
            print(`DiagramComponent: Model generation failed for ${nodeId}: ${error}`)
          }
        })

        if (this.enableDebugLogging) {
          print(`DiagramComponent: Triggered model generation for ${nodeId} with prompt: "${modelPrompt}"`)
        }
      } else {
        if (this.enableDebugLogging) {
          print(`DiagramComponent: generateContent method not available on ModelNode ${nodeId}`)
        }
      }
    }

    const modelNode = new ModelNodeMappingReference(
      nodeObject,
      nodeId,
      name,
      position, // Store logical position for calculations
      textContent,
      modelPath,
      level
    )

    this.nodeReferences.set(nodeId, modelNode)

    return modelNode
  }

  private createRandomNode(position: vec3, level: number = 0): NodeMappingReference {
    const nodeType = Math.floor(Math.random() * 3)
    const randomName = this.nodeNames[Math.floor(Math.random() * this.nodeNames.length)]

    switch (nodeType) {
      case 0:
        return this.createTextNode(randomName, position, "Generated text content", level)
      case 1:
        return this.createImageNode(randomName, position, "Generated image content", "generated_image_path", level)
      case 2:
        return this.createModelNode(randomName, position, "Generated model content", "generated_model_path", level)
      default:
        return this.createTextNode(randomName, position, "Default text content", level)
    }
  }

  private createLineBetweenNodes(nodeA: NodeMappingReference, nodeB: NodeMappingReference): LineMappingReference {
    const lineId = this.generateLineId()
    const lineObject = this.linePrefab.instantiate(this.getSceneObject())

    const line3DComponent = lineObject.getComponent(Line3D.getTypeName()) as Line3D
    if (line3DComponent) {
      // Create invisible objects at logical positions for line connection points
      const connectionPointA = this.createLineConnectionPoint(nodeA.position, `${lineId}_pointA`)
      const connectionPointB = this.createLineConnectionPoint(nodeB.position, `${lineId}_pointB`)

      line3DComponent.pathPoints = [connectionPointA, connectionPointB]
      line3DComponent.updateMesh()
    }

    const lineRef = new LineMappingReference(lineObject, lineId, nodeA, nodeB, line3DComponent)

    this.lineReferences.set(lineId, lineRef)

    return lineRef
  }

  /*
    private createLineConnectionPoint(logicalPosition: vec3, name: string): SceneObject {
        // Create invisible object at logical position for line connections
        const connectionPoint = global.scene.createSceneObject(name);
        connectionPoint.getTransform().setWorldPosition(logicalPosition);
        connectionPoint.setParent(this.getSceneObject());
        
        // Make it invisible
        connectionPoint.enabled = false;
        
        return connectionPoint;
    }
        */ a

  private createLineConnectionPoint(logicalPosition: vec3, name: string): SceneObject {
    const connectionPoint = global.scene.createSceneObject(name)
    connectionPoint.setParent(this.getSceneObject())

    // Convert world position to local position relative to parent
    const parentTransform = this.getSceneObject().getTransform()
    const localPosition = parentTransform.getInvertedWorldTransform().multiplyPoint(logicalPosition)
    connectionPoint.getTransform().setLocalPosition(localPosition)

    connectionPoint.enabled = false
    return connectionPoint
  }

  private setupManipulationResetBehavior(
    nodeObject: SceneObject,
    nodeId: string,
    logicalPosition: vec3,
    nodeType: string = "default"
  ): void {
    let manipulationComponent: any = null

    try {
      manipulationComponent = nodeObject.getComponent(InteractableManipulation.getTypeName())
    } catch (error) {
      print(`SimpleMindNodeManager: Could not access InteractableManipulation on ${nodeObject.name} - Error: ${error}`)
      return
    }

    if (manipulationComponent && manipulationComponent.onManipulationStart && manipulationComponent.onManipulationEnd) {
      const onManipulationStartCallback = () => {
        this.startManipulation(nodeObject, logicalPosition, nodeType)
      }

      const onManipulationEndCallback = () => {
        this.endManipulation(nodeObject)
      }

      manipulationComponent.onManipulationStart.add(onManipulationStartCallback)
      manipulationComponent.onManipulationEnd.add(onManipulationEndCallback)

      print(`SimpleMindNodeManager: Setup manipulation reset for ${nodeObject.name} (${nodeType})`)
    } else {
      print(`SimpleMindNodeManager: InteractableManipulation component or events missing on ${nodeObject.name}`)
      if (manipulationComponent) {
        print(`SimpleMindNodeManager: Available properties: ${Object.keys(manipulationComponent).join(", ")}`)
      }
    }
  }

  // Utility methods
  private getStartingPosition(): vec3 {
    if (this.startDirectionRef) {
      return this.startDirectionRef.getTransform().getWorldPosition()
    }
    return vec3.zero()
  }

  private getNodeIdFromObject(nodeObject: SceneObject): string | null {
    // Find the node ID by searching through our node references
    for (const [nodeId, node] of this.nodeReferences) {
      if (node.nodeObject === nodeObject) {
        return nodeId
      }
    }
    return null
  }

  private startManipulation(nodeObject: SceneObject, logicalPosition: vec3, nodeType: string): void {
    const nodeId = this.getNodeIdFromObject(nodeObject)
    if (!nodeId) {
      print(`SimpleMindNodeManager: Could not find node ID for manipulation start`)
      return
    }

    // Store both local and world positions - use local for reset like the reference implementation
    const currentLocalPosition = nodeObject.getTransform().getLocalPosition()
    const currentLocalRotation = nodeObject.getTransform().getLocalRotation()
    const currentWorldPosition = nodeObject.getTransform().getWorldPosition()

    // Store manipulation state
    this.manipulationStates.set(nodeId, {
      nodeObject: nodeObject,
      originalLogicalPosition: logicalPosition,
      originalVisualPosition: currentLocalPosition, // Use local position for reset
      originalRotation: currentLocalRotation, // Use local rotation for reset
      nodeType: nodeType,
      isManipulating: true
    })

    print(`SimpleMindNodeManager: Started manipulation for ${nodeObject.name} (${nodeType})`)
  }

  private endManipulation(nodeObject: SceneObject): void {
    const nodeId = this.getNodeIdFromObject(nodeObject)
    if (!nodeId) {
      print(`SimpleMindNodeManager: Could not find node ID for manipulation end`)
      return
    }

    const manipulationState = this.manipulationStates.get(nodeId)
    if (!manipulationState || !manipulationState.isManipulating) {
      print(`SimpleMindNodeManager: No active manipulation state found for ${nodeObject.name}`)
      print(`SimpleMindNodeManager: Total manipulation states: ${this.manipulationStates.size}`)
      return
    }

    // Reset to original LOCAL position and rotation immediately (like reference implementation)
    nodeObject.getTransform().setLocalPosition(manipulationState.originalVisualPosition)
    nodeObject.getTransform().setLocalRotation(manipulationState.originalRotation)

    // Clear manipulation state
    manipulationState.isManipulating = false
    this.manipulationStates.delete(nodeId)

    print(`SimpleMindNodeManager: Reset position for ${nodeObject.name}`)
  }

  private getVisualPosition(logicalPosition: vec3, nodeType: string = "default"): vec3 {
    // Add Y offset for visual placement while keeping logical position for calculations
    let yOffset = this.nodeYOffset

    // Apply multiplier for image nodes
    if (nodeType === "image") {
      yOffset *= this.imageYOffsetMultiplier
    }

    return new vec3(logicalPosition.x, logicalPosition.y + yOffset, logicalPosition.z)
  }

  private removeNode(node: NodeMappingReference): void {
    // Remove all lines connected to this node
    const linesToRemove: LineMappingReference[] = []

    for (const line of this.lineReferences.values()) {
      if (line.pointA === node || line.pointB === node) {
        linesToRemove.push(line)
      }
    }

    for (const line of linesToRemove) {
      this.removeLine(line)
    }

    // Remove the node
    this.nodeReferences.delete(node.nodeId)

    // Remove any active animation
    this.activeYAnimations.delete(node.nodeId)

    // Remove any manipulation state
    this.manipulationStates.delete(node.nodeId)

    // Destroy the scene object
    if (node.nodeObject) {
      node.nodeObject.destroy()
    }
  }

  private removeLine(line: LineMappingReference): void {
    // Remove connection references
    const indexA = line.pointA.connections.indexOf(line.pointB.nodeId)
    if (indexA > -1) {
      line.pointA.connections.splice(indexA, 1)
    }

    const indexB = line.pointB.connections.indexOf(line.pointA.nodeId)
    if (indexB > -1) {
      line.pointB.connections.splice(indexB, 1)
    }

    // Clean up connection points
    if (line.line3DComponent && line.line3DComponent.pathPoints.length >= 2) {
      const connectionPointA = line.line3DComponent.pathPoints[0]
      const connectionPointB = line.line3DComponent.pathPoints[1]

      if (connectionPointA) {
        connectionPointA.destroy()
      }
      if (connectionPointB) {
        connectionPointB.destroy()
      }
    }

    // Remove from line references
    this.lineReferences.delete(line.lineId)

    // Destroy the scene object
    if (line.lineObject) {
      line.lineObject.destroy()
    }
  }

  private clearAllNodes(): void {
    // Clear all lines first
    for (const line of this.lineReferences.values()) {
      if (line.lineObject) {
        line.lineObject.destroy()
      }
    }
    this.lineReferences.clear()

    // Clear all nodes
    for (const node of this.nodeReferences.values()) {
      if (node.nodeObject) {
        node.nodeObject.destroy()
      }
    }
    this.nodeReferences.clear()
    this.startingNode = null

    // Clear animations
    this.activeYAnimations.clear()

    // Clear manipulation states
    this.manipulationStates.clear()
  }

  private generateNodeId(): string {
    return `node_${this.nodeCounter++}`
  }

  private generateLineId(): string {
    return `line_${this.lineCounter++}`
  }

  // Fake content generation
  private generateVariedFakeTitle(maxLength: number, theme: string): string {
    const themes = {
      text: ["Analysis", "Report", "Study", "Research", "Document", "Paper", "Summary", "Notes"],
      image: ["Visual", "Diagram", "Chart", "Graph", "Illustration", "Picture", "Visualization", "Graphics"],
      model: ["3D Model", "Simulation", "Structure", "Design", "Blueprint", "Prototype", "Framework", "Architecture"]
    }

    const baseWords = themes[theme] || themes["text"]
    const techWords = ["AI", "ML", "Data", "Smart", "Digital", "Neural", "Quantum", "Advanced"]

    const baseWord = baseWords[Math.floor(Math.random() * baseWords.length)]
    const techWord = techWords[Math.floor(Math.random() * techWords.length)]

    const title = `${techWord} ${baseWord}`

    return title.length <= maxLength ? title : baseWord
  }

  private generateVariedFakeContent(maxLength: number, theme: string): string {
    const themes = {
      text: [
        "Advanced text processing algorithms analyze linguistic patterns",
        "Natural language understanding enables semantic comprehension",
        "Automated content generation creates meaningful documents",
        "Text mining extracts valuable insights from written data"
      ],
      image: [
        "Computer vision algorithms process visual information efficiently",
        "Image recognition systems identify objects and patterns accurately",
        "Visual analytics transforms data into comprehensible graphics",
        "Augmented reality overlays digital information on real environments"
      ],
      model: [
        "3D modeling software creates detailed digital representations",
        "Simulation engines predict real-world behavior patterns",
        "Architectural frameworks support complex system designs",
        "Mathematical models describe dynamic system relationships"
      ]
    }

    const phrases = themes[theme] || themes["text"]
    const selectedPhrase = phrases[Math.floor(Math.random() * phrases.length)]

    return selectedPhrase.length <= maxLength ? selectedPhrase : phrases[0]
  }

  // Public API methods for external access
  public getNodeReferences(): Map<string, NodeMappingReference> {
    return this.nodeReferences
  }

  public getLineReferences(): Map<string, LineMappingReference> {
    return this.lineReferences
  }

  public getStartingNode(): StartingNodeMappingReference | null {
    return this.startingNode
  }

  public getCurrentPhase(): number {
    return this.currentPhase
  }

  public resetSystem(): void {
    this.clearAllNodes()
    this.nodeCounter = 0
    this.lineCounter = 0
    this.currentPhase = -1
  }

  // ================================
  // Public Methods for External Node Creation
  // ================================

  /**
   * Public method to add a text node to the diagram
   */
  public addTextNode(nodeId: string, content: string, position?: vec3, level: number = 1): boolean {
    try {
      const nodePosition = position || this.calculateNextPosition(level)
      const newNode = this.createTextNode(nodeId, nodePosition, content, level, nodeId)

      if (newNode) {
        print(`AgenticDiagram: Added text node "${nodeId}"`)
        return true
      }

      return false
    } catch (error) {
      print(`AgenticDiagram: Error adding text node: ${error}`)
      return false
    }
  }

  /**
   * Public method to add an image node to the diagram
   */
  public addImageNode(nodeId: string, content: string, position?: vec3, level: number = 1): boolean {
    try {
      const nodePosition = position || this.calculateNextPosition(level)
      const newNode = this.createImageNode(nodeId, nodePosition, content, "ai_generated_image", level, nodeId)

      if (newNode) {
        print(`AgenticDiagram: Added image node "${nodeId}"`)
        return true
      }

      return false
    } catch (error) {
      print(`AgenticDiagram: Error adding image node: ${error}`)
      return false
    }
  }

  /**
   * Public method to add a model node to the diagram
   */
  public addModelNode(nodeId: string, content: string, position?: vec3, level: number = 1): boolean {
    try {
      const nodePosition = position || this.calculateNextPosition(level)
      const newNode = this.createModelNode(nodeId, nodePosition, content, "ai_generated_model", level, nodeId)

      if (newNode) {
        print(`AgenticDiagram: Added model node "${nodeId}"`)
        return true
      }

      return false
    } catch (error) {
      print(`AgenticDiagram: Error adding model node: ${error}`)
      return false
    }
  }

  /**
   * Public method to add a connection between two nodes
   */
  public addConnection(fromNodeId: string, toNodeId: string): boolean {
    try {
      const fromNode = this.nodeReferences.get(fromNodeId)
      const toNode = this.nodeReferences.get(toNodeId)

      if (!fromNode || !toNode) {
        print(`AgenticDiagram: Cannot create connection - node not found: ${fromNodeId} -> ${toNodeId}`)
        return false
      }

      const lineRef = this.createLineBetweenNodes(fromNode, toNode)

      if (lineRef) {
        print(`AgenticDiagram: Added connection: ${fromNodeId} -> ${toNodeId}`)
        return true
      }

      return false
    } catch (error) {
      print(`AgenticDiagram: Error adding connection: ${error}`)
      return false
    }
  }

  /**
   * Calculate next position for a new node
   */
  private calculateNextPosition(level: number): vec3 {
    const existingNodesAtLevel = Array.from(this.nodeReferences.values()).filter((node) => node.treeLevel === level)

    // Use similar logic to the tree positioning but for dynamic placement
    const baseRadius = 200 + level * 150 // Increase radius with level
    const angleStep = (2 * Math.PI) / Math.max(8, existingNodesAtLevel.length + 1)
    const angle = angleStep * existingNodesAtLevel.length

    const x = Math.cos(angle) * baseRadius
    const z = Math.sin(angle) * baseRadius
    const y = level * 50 // Vertical separation by level

    return new vec3(x, y, z)
  }

  /**
   * Public method to get diagram status for debugging
   */
  public getDiagramStatus(): {
    isInitialized: boolean
    nodeCount: number
    lineCount: number
    currentPhase: number
    nodesByLevel: Map<number, number>
  } {
    const nodesByLevel = new Map<number, number>()

    for (const node of this.nodeReferences.values()) {
      const level = node.treeLevel
      nodesByLevel.set(level, (nodesByLevel.get(level) || 0) + 1)
    }

    return {
      isInitialized: true,
      nodeCount: this.nodeReferences.size,
      lineCount: this.lineReferences.size,
      currentPhase: this.currentPhase,
      nodesByLevel: nodesByLevel
    }
  }

  /**
   * Check if diagram is ready for operations
   */
  public isReady(): boolean {
    return (
      this.startPrefab !== null && this.textPrefab !== null && this.imagePrefab !== null && this.modelPrefab !== null
    )
  }

  public printTreeStructure(): void {
    const stats = TreeStructureUtils.getTreeStats(this.nodeReferences)

    print(`SimpleMindNodeManager Tree Structure:`)
    print(`- Total Nodes: ${stats.totalNodes}`)
    print(`- Max Level: ${stats.maxLevel}`)
    print(`- Current Phase: ${this.currentPhase}`)

    for (const [level, count] of stats.nodesByLevel) {
      print(`  Level ${level}: ${count} nodes`)
    }
  }

  public printSystemStatus(): void {
    print(`SimpleMindNodeManager Status:`)
    print(`- Current Phase: ${this.currentPhase}`)
    print(`- Nodes Count: ${this.nodeReferences.size}`)
    print(`- Lines Count: ${this.lineReferences.size}`)
    print(`- Level Separation: ${this.levelSeparation}`)
    print(`- Angular Spread: ${this.angularSpread}`)
    print(`- Min Branch Distance: ${this.minBranchDistance}`)
    print(`- Max Branches: ${this.maxBranches}`)
    print(`- Min X Distance: ${this.minXDistance}`)
    print(`- Max Y Offset: ${this.maxYOffset}`)
    print(`- Active Y Animations: ${this.activeYAnimations.size}`)
    print(`- Y Separation Enabled: ${this.enableYSeparation}`)
    print(`- Y Variation Enabled: ${this.enableYVariation}`)
    print(`- Max Y Variation: ${this.maxYVariation}`)
    print(`- Node Y Offset: ${this.nodeYOffset}`)
    print(`- Image Y Offset Multiplier: ${this.imageYOffsetMultiplier}`)
  }

  public forceCollisionAvoidance(): void {
    print("SimpleMindNodeManager: Manually triggering collision avoidance")
    this.performCollisionAvoidance()
  }

  public printCollisionStatus(): void {
    print("SimpleMindNodeManager Collision Status:")

    const conflicts = TreeStructureUtils.findNodesNeedingYSeparation(this.nodeReferences, this.minXDistance)

    print(`- Current X-distance conflicts: ${conflicts.length}`)
    print(`- Active Y animations: ${this.activeYAnimations.size}`)
    print(`- Min X distance threshold: ${this.minXDistance}`)
    print(`- Max Y offset: ${this.maxYOffset}`)

    for (const conflict of conflicts) {
      print(
        `  Conflict: ${conflict.nodeA.nodeId} <-> ${conflict.nodeB.nodeId} (X distance: ${conflict.distance.toFixed(1)})`
      )
    }
  }

  public addRandomYVariation(): void {
    print("SimpleMindNodeManager: Adding random Y variation to all nodes")

    for (const node of this.nodeReferences.values()) {
      if (node !== this.startingNode) {
        // Don't move the starting node
        const yOffset = (Math.random() - 0.5) * 2 * this.maxYVariation * (node.treeLevel * 0.5)
        const newLogicalPosition = new vec3(node.position.x, node.position.y + yOffset, node.position.z)

        // Start Y animation to new logical position
        this.startYSeparationAnimation(node, newLogicalPosition)
      }
    }
  }

  public executeSequentialPhases(targetPhase: number): void {
    print(`SimpleMindNodeManager: Executing phases sequentially up to phase ${targetPhase}`)

    for (let phase = 0; phase <= targetPhase; phase++) {
      print(`SimpleMindNodeManager: --> Executing phase ${phase}`)
      this.currentPhase = phase

      switch (phase) {
        case 0:
          this.testPhase0()
          break
        case 1:
          this.testPhase1()
          break
        case 2:
          this.testPhase2()
          break
        case 3:
          this.testPhase3()
          break
        case 4:
          this.testPhase4()
          break
      }

      // Perform collision avoidance after each phase
      this.performCollisionAvoidance()

      // Show progress
      print(
        `SimpleMindNodeManager: Phase ${phase} completed (${this.nodeReferences.size} nodes, ${this.lineReferences.size} lines)`
      )
    }

    print(`SimpleMindNodeManager: Sequential execution completed up to phase ${targetPhase}`)
  }

  public printPhaseStructure(): void {
    print("SimpleMindNodeManager Phase Structure:")
    print(`Current Phase: ${this.currentPhase}`)
    print(`Total Nodes: ${this.nodeReferences.size}`)
    print(`Total Lines: ${this.lineReferences.size}`)

    const stats = TreeStructureUtils.getTreeStats(this.nodeReferences)

    for (const [level, count] of stats.nodesByLevel) {
      print(`  Level ${level}: ${count} nodes`)
    }

    // Show nodes by type
    let textNodes = 0,
      imageNodes = 0,
      modelNodes = 0,
      startNodes = 0
    for (const node of this.nodeReferences.values()) {
      if (node instanceof StartingNodeMappingReference) startNodes++
      else if (node instanceof TextNodeMappingReference) textNodes++
      else if (node instanceof ImageNodeMappingReference) imageNodes++
      else if (node instanceof ModelNodeMappingReference) modelNodes++
    }

    print(`Node Types: Start(${startNodes}) Text(${textNodes}) Image(${imageNodes}) Model(${modelNodes})`)
  }

  public updateAllNodeVisualPositions(): void {
    print(`SimpleMindNodeManager: Updating all node visual positions with Y offset: ${this.nodeYOffset}`)

    for (const node of this.nodeReferences.values()) {
      // Determine node type
      let nodeType = "default"
      if (node instanceof StartingNodeMappingReference) {
        nodeType = "start"
      } else if (node instanceof TextNodeMappingReference) {
        nodeType = "text"
      } else if (node instanceof ImageNodeMappingReference) {
        nodeType = "image"
      } else if (node instanceof ModelNodeMappingReference) {
        nodeType = "model"
      }

      const visualPosition = this.getVisualPosition(node.position, nodeType)
      node.nodeObject.getTransform().setWorldPosition(visualPosition)
    }

    print(`SimpleMindNodeManager: Updated ${this.nodeReferences.size} node positions`)
  }

  public printPositionInfo(): void {
    print("SimpleMindNodeManager Position Info:")
    print(`Node Y Offset: ${this.nodeYOffset}`)
    print(`Image Y Offset Multiplier: ${this.imageYOffsetMultiplier}`)

    for (const node of this.nodeReferences.values()) {
      // Determine node type
      let nodeType = "default"
      if (node instanceof StartingNodeMappingReference) {
        nodeType = "start"
      } else if (node instanceof TextNodeMappingReference) {
        nodeType = "text"
      } else if (node instanceof ImageNodeMappingReference) {
        nodeType = "image"
      } else if (node instanceof ModelNodeMappingReference) {
        nodeType = "model"
      }

      const logicalPos = node.position
      const visualPos = node.nodeObject.getTransform().getWorldPosition()
      const expectedVisualPos = this.getVisualPosition(logicalPos, nodeType)

      print(`Node ${node.nodeId} (${nodeType}):`)
      print(`  Logical: (${logicalPos.x.toFixed(1)}, ${logicalPos.y.toFixed(1)}, ${logicalPos.z.toFixed(1)})`)
      print(`  Visual: (${visualPos.x.toFixed(1)}, ${visualPos.y.toFixed(1)}, ${visualPos.z.toFixed(1)})`)
      print(
        `  Expected: (${expectedVisualPos.x.toFixed(1)}, ${expectedVisualPos.y.toFixed(1)}, ${expectedVisualPos.z.toFixed(1)})`
      )
    }
  }

  public printManipulationStatus(): void {
    print("SimpleMindNodeManager Manipulation Status:")
    print(`- Active manipulation states: ${this.manipulationStates.size}`)

    for (const [nodeId, state] of this.manipulationStates) {
      print(`  Node ${nodeId} (${state.nodeType}): ${state.isManipulating ? "MANIPULATING" : "IDLE"}`)
      if (state.isManipulating) {
        const currentPos = state.nodeObject.getTransform().getWorldPosition()
        print(
          `    Original: (${state.originalVisualPosition.x.toFixed(1)}, ${state.originalVisualPosition.y.toFixed(1)}, ${state.originalVisualPosition.z.toFixed(1)})`
        )
        print(`    Current: (${currentPos.x.toFixed(1)}, ${currentPos.y.toFixed(1)}, ${currentPos.z.toFixed(1)})`)
      }
    }
  }

  public testManipulationComponents(): void {
    print("SimpleMindNodeManager: Testing manipulation components on all nodes...")

    for (const [nodeId, node] of this.nodeReferences) {
      print(`\n=== Testing node ${nodeId} (${node.nodeName}) ===`)

      // Test InteractableManipulation specifically
      try {
        const manipComponent = node.nodeObject.getComponent(InteractableManipulation.getTypeName())
        if (manipComponent) {
          print(`InteractableManipulation component found`)
          print(`  Properties: ${Object.keys(manipComponent).join(", ")}`)

          // Test event availability
          if (manipComponent.onManipulationStart) {
            print(`  onManipulationStart event available`)
          } else {
            print(`  onManipulationStart event NOT available`)
          }

          if (manipComponent.onManipulationEnd) {
            print(`  onManipulationEnd event available`)
          } else {
            print(`  onManipulationEnd event NOT available`)
          }
        } else {
          print(`InteractableManipulation component is null`)
        }
      } catch (error) {
        print(`Error accessing InteractableManipulation: ${error}`)
      }
    }
  }

  public debugManipulationSetup(): void {
    print("SimpleMindNodeManager: Debug manipulation setup...")
    print(`Total nodes: ${this.nodeReferences.size}`)
    print(`Total manipulation states: ${this.manipulationStates.size}`)

    // Re-setup manipulation for all nodes
    for (const [nodeId, node] of this.nodeReferences) {
      print(`\n--- Re-setting up manipulation for ${nodeId} ---`)

      // Determine node type
      let nodeType = "default"
      if (node instanceof StartingNodeMappingReference) {
        nodeType = "start"
      } else if (node instanceof TextNodeMappingReference) {
        nodeType = "text"
      } else if (node instanceof ImageNodeMappingReference) {
        nodeType = "image"
      } else if (node instanceof ModelNodeMappingReference) {
        nodeType = "model"
      }

      this.setupManipulationResetBehavior(node.nodeObject, nodeId, node.position, nodeType)
    }

    print("SimpleMindNodeManager: Debug manipulation setup completed!")
  }

  public testSingleNodeManipulation(nodeId?: string): void {
    print("SimpleMindNodeManager: Testing single node manipulation...")

    // Get the first node if no nodeId provided
    const targetNodeId = nodeId || Array.from(this.nodeReferences.keys())[0]
    const node = this.nodeReferences.get(targetNodeId)

    if (!node) {
      print(`SimpleMindNodeManager: Node ${targetNodeId} not found`)
      return
    }

    print(`SimpleMindNodeManager: Testing manipulation reset for ${targetNodeId} (${node.nodeName})`)

    // Get original position
    const originalLocal = node.nodeObject.getTransform().getLocalPosition()
    const originalWorld = node.nodeObject.getTransform().getWorldPosition()

    print(
      `SimpleMindNodeManager: 📍 Original local: (${originalLocal.x.toFixed(2)}, ${originalLocal.y.toFixed(2)}, ${originalLocal.z.toFixed(2)})`
    )
    print(
      `SimpleMindNodeManager: 📍 Original world: (${originalWorld.x.toFixed(2)}, ${originalWorld.y.toFixed(2)}, ${originalWorld.z.toFixed(2)})`
    )

    // Move the node to simulate manipulation
    const testOffset = new vec3(50, 20, 10)
    const testPosition = originalLocal.add(testOffset)
    node.nodeObject.getTransform().setLocalPosition(testPosition)

    const movedLocal = node.nodeObject.getTransform().getLocalPosition()
    const movedWorld = node.nodeObject.getTransform().getWorldPosition()

    print(
      `SimpleMindNodeManager: 📍 After move local: (${movedLocal.x.toFixed(2)}, ${movedLocal.y.toFixed(2)}, ${movedLocal.z.toFixed(2)})`
    )
    print(
      `SimpleMindNodeManager: 📍 After move world: (${movedWorld.x.toFixed(2)}, ${movedWorld.y.toFixed(2)}, ${movedWorld.z.toFixed(2)})`
    )

    // Determine node type
    let nodeType = "default"
    if (node instanceof StartingNodeMappingReference) {
      nodeType = "start"
    } else if (node instanceof TextNodeMappingReference) {
      nodeType = "text"
    } else if (node instanceof ImageNodeMappingReference) {
      nodeType = "image"
    } else if (node instanceof ModelNodeMappingReference) {
      nodeType = "model"
    }

    // Simulate manipulation end (reset)
    this.startManipulation(node.nodeObject, node.position, nodeType)
    this.endManipulation(node.nodeObject)

    const resetLocal = node.nodeObject.getTransform().getLocalPosition()
    const resetWorld = node.nodeObject.getTransform().getWorldPosition()

    print(
      `SimpleMindNodeManager: 📍 After reset local: (${resetLocal.x.toFixed(2)}, ${resetLocal.y.toFixed(2)}, ${resetLocal.z.toFixed(2)})`
    )
    print(
      `SimpleMindNodeManager: 📍 After reset world: (${resetWorld.x.toFixed(2)}, ${resetWorld.y.toFixed(2)}, ${resetWorld.z.toFixed(2)})`
    )

    // Check if reset worked
    const resetSuccess = resetLocal.distance(originalLocal) < 0.01
    print(`SimpleMindNodeManager: ${resetSuccess ? "Reset successful!" : "Reset failed!"}`)

    if (!resetSuccess) {
      print(
        `SimpleMindNodeManager: Expected: (${originalLocal.x.toFixed(2)}, ${originalLocal.y.toFixed(2)}, ${originalLocal.z.toFixed(2)})`
      )
      print(
        `SimpleMindNodeManager: Got: (${resetLocal.x.toFixed(2)}, ${resetLocal.y.toFixed(2)}, ${resetLocal.z.toFixed(2)})`
      )
    }
  }
}
