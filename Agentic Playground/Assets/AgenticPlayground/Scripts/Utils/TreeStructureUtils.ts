/**
 * Utility class for calculating tree structure positions and relationships
 */
export class TreeStructureUtils {
    
    /**
     * Calculate positions for child nodes in a tree structure with directional flow
     */
    public static calculateChildPositions(
        parentPosition: vec3, 
        childCount: number, 
        level: number, 
        levelSeparation: number, 
        angularSpread: number,
        minBranchDistance: number,
        startDirection?: vec3,
        endDirection?: vec3,
        addYVariation: boolean = false,
        maxYVariation: number = 100
    ): vec3[] {
        const positions: vec3[] = [];
        
        if (childCount === 0) return positions;
        
        // Calculate base direction (from start to end if provided)
        let baseDirection = 0; // Default forward direction
        if (startDirection && endDirection) {
            const directionVector = endDirection.sub(startDirection).normalize();
            baseDirection = Math.atan2(directionVector.z, directionVector.x);
        }
        
        // Calculate angular distribution
        const totalSpread = angularSpread * Math.PI / 180;
        
        // Ensure minimum branch distance is respected
        const minAngleFromDistance = Math.atan2(minBranchDistance, levelSeparation);
        const effectiveSpread = Math.max(totalSpread, minAngleFromDistance * (childCount - 1));
        
        const angleStep = childCount > 1 ? effectiveSpread / (childCount - 1) : 0;
        const startAngle = baseDirection - effectiveSpread / 2;
        
        for (let i = 0; i < childCount; i++) {
            const angle = startAngle + (i * angleStep);
            
            // Calculate position with optional Y variation
            const x = parentPosition.x + Math.cos(angle) * levelSeparation;
            let y = parentPosition.y; // Start with parent Y
            const z = parentPosition.z + Math.sin(angle) * levelSeparation;
            
            // Add Y variation if enabledwwdwdw
            if (addYVariation && level > 0) {
                // Add random Y offset that increases with tree level
                const yVariation = (Math.random() - 0.5) * 2 * maxYVariation * (level * 0.3);
                y += yVariation;
            }
            
            positions.push(new vec3(x, y, z));
        }
        
        return positions;
    }
    
    /**
     * Check if nodes are too close in X coordinate and need Y separation
     */
    public static findNodesNeedingYSeparation(
        nodeMap: Map<string, any>, 
        minXDistance: number
    ): Array<{nodeA: any, nodeB: any, distance: number}> {
        const conflicts: Array<{nodeA: any, nodeB: any, distance: number}> = [];
        const nodes = Array.from(nodeMap.values());
        
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const nodeA = nodes[i];
                const nodeB = nodes[j];
                
                const xDistance = Math.abs(nodeA.position.x - nodeB.position.x);
                
                if (xDistance < minXDistance) {
                    conflicts.push({
                        nodeA: nodeA,
                        nodeB: nodeB,
                        distance: xDistance
                    });
                }
            }
        }
        
        return conflicts;
    }
    
    /**
     * Calculate Y offset to resolve X distance conflicts
     */
    public static calculateYSeparationOffset(
        nodePosition: vec3,
        conflictingNodes: any[],
        minXDistance: number,
        maxYOffset: number
    ): number {
        // Try different Y offsets to find one that doesn't conflict with other Y positions
        const attempts = 20;
        const minYSeparation = 50; // Minimum Y distance between nodes
        
        for (let i = 0; i < attempts; i++) {
            // Random Y offset (positive or negative)
            const yOffset = (Math.random() - 0.5) * 2 * maxYOffset;
            const newYPosition = nodePosition.y + yOffset;
            
            // Check if this Y position conflicts with other nodes at similar X positions
            let yConflict = false;
            for (const other of conflictingNodes) {
                const xDistance = Math.abs(nodePosition.x - other.position.x);
                const yDistance = Math.abs(newYPosition - other.position.y);
                
                // If nodes are close in X, they should be separated in Y
                if (xDistance < minXDistance && yDistance < minYSeparation) {
                    yConflict = true;
                    break;
                }
            }
            
            if (!yConflict) {
                return yOffset;
            }
        }
        
        // If no good offset found, use a random one with larger magnitude
        const largeOffset = (Math.random() - 0.5) * 2 * maxYOffset;
        return largeOffset;
    }
    
    /**
     * Get all nodes at a specific tree level
     */
    public static getNodesAtLevel(nodeMap: Map<string, any>, level: number): any[] {
        const nodes: any[] = [];
        for (const node of nodeMap.values()) {
            if (node.treeLevel === level) {
                nodes.push(node);
            }
        }
        return nodes;
    }
    
    /**
     * Establish parent-child relationship
     */
    public static establishParentChild(parent: any, child: any): void {
        // Add child to parent's children list
        if (!parent.childNodeIds.includes(child.nodeId)) {
            parent.childNodeIds.push(child.nodeId);
        }
        
        // Set parent for child
        child.parentNodeId = parent.nodeId;
        
        // Update connections (for existing system compatibility)
        if (!parent.connections.includes(child.nodeId)) {
            parent.connections.push(child.nodeId);
        }
        if (!child.connections.includes(parent.nodeId)) {
            child.connections.push(parent.nodeId);
        }
    }
    
    /**
     * Get children of a specific node
     */
    public static getChildren(nodeMap: Map<string, any>, parentId: string): any[] {
        const children: any[] = [];
        for (const node of nodeMap.values()) {
            if (node.parentNodeId === parentId) {
                children.push(node);
            }
        }
        return children;
    }
    
    /**
     * Calculate tree statistics
     */
    public static getTreeStats(nodeMap: Map<string, any>): {
        totalNodes: number;
        maxLevel: number;
        nodesByLevel: Map<number, number>;
    } {
        const stats = {
            totalNodes: nodeMap.size,
            maxLevel: 0,
            nodesByLevel: new Map<number, number>()
        };
        
        for (const node of nodeMap.values()) {
            const level = node.treeLevel || 0;
            stats.maxLevel = Math.max(stats.maxLevel, level);
            
            const currentCount = stats.nodesByLevel.get(level) || 0;
            stats.nodesByLevel.set(level, currentCount + 1);
        }
        
        return stats;
    }
    
    /**
     * Get overall direction vector from start to end
     */
    public static getDirectionVector(startObj: SceneObject, endObj: SceneObject): vec3 {
        if (!startObj || !endObj) {
            return new vec3(1, 0, 0); // Default forward direction
        }
        
        const startPos = startObj.getTransform().getWorldPosition();
        const endPos = endObj.getTransform().getWorldPosition();
        
        return endPos.sub(startPos).normalize();
    }
    
    /**
     * Get base angle from direction vector
     */
    public static getBaseAngleFromDirection(directionVector: vec3): number {
        return Math.atan2(directionVector.z, directionVector.x);
    }
} 