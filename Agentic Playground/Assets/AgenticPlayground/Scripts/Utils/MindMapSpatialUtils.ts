/**
 * Spatial utilities for mind mapping positioning and calculations
 */
export class MindMapSpatialUtils {
    
    /**
     * Calculate positions for nodes in a circular pattern around a center point
     */
    public static calculateCircularPositions(centerPosition: vec3, radius: number, nodeCount: number, startAngle: number = 0): vec3[] {
        const positions: vec3[] = [];
        const angleStep = (2 * Math.PI) / nodeCount;
        
        for (let i = 0; i < nodeCount; i++) {
            const angle = startAngle + (i * angleStep);
            const x = centerPosition.x + radius * Math.cos(angle);
            const z = centerPosition.z + radius * Math.sin(angle);
            const y = centerPosition.y; // Keep same Y level
            
            positions.push(new vec3(x, y, z));
        }
        
        return positions;
    }
    
    /**
     * Calculate positions for nodes in a spiral pattern
     */
    public static calculateSpiralPositions(centerPosition: vec3, innerRadius: number, outerRadius: number, nodeCount: number, turns: number = 2): vec3[] {
        const positions: vec3[] = [];
        const angleStep = (turns * 2 * Math.PI) / nodeCount;
        const radiusStep = (outerRadius - innerRadius) / nodeCount;
        
        for (let i = 0; i < nodeCount; i++) {
            const angle = i * angleStep;
            const radius = innerRadius + (i * radiusStep);
            
            const x = centerPosition.x + radius * Math.cos(angle);
            const z = centerPosition.z + radius * Math.sin(angle);
            const y = centerPosition.y + (i * 5); // Slight Y variation
            
            positions.push(new vec3(x, y, z));
        }
        
        return positions;
    }
    
    /**
     * Calculate positions for nodes in a grid pattern
     */
    public static calculateGridPositions(centerPosition: vec3, spacing: number, rows: number, cols: number): vec3[] {
        const positions: vec3[] = [];
        
        const startX = centerPosition.x - ((cols - 1) * spacing) / 2;
        const startZ = centerPosition.z - ((rows - 1) * spacing) / 2;
        
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const x = startX + (col * spacing);
                const z = startZ + (row * spacing);
                const y = centerPosition.y;
                
                positions.push(new vec3(x, y, z));
            }
        }
        
        return positions;
    }
    
    /**
     * Calculate positions for nodes in a radial tree pattern
     */
    public static calculateRadialTreePositions(centerPosition: vec3, levels: number, nodesPerLevel: number[], levelDistances: number[]): vec3[] {
        const positions: vec3[] = [];
        
        // Add center position
        positions.push(centerPosition);
        
        for (let level = 0; level < levels; level++) {
            const nodeCount = nodesPerLevel[level];
            const distance = levelDistances[level];
            
            const levelPositions = this.calculateCircularPositions(centerPosition, distance, nodeCount);
            positions.push(...levelPositions);
        }
        
        return positions;
    }
    
    /**
     * Check if two positions are too close (collision detection)
     */
    public static checkCollision(pos1: vec3, pos2: vec3, minDistance: number): boolean {
        const distance = pos1.distance(pos2);
        return distance < minDistance;
    }
    
    /**
     * Find the closest available position that doesn't collide with existing nodes
     */
    public static findNonCollidingPosition(desiredPosition: vec3, existingPositions: vec3[], minDistance: number, maxAttempts: number = 10): vec3 {
        let bestPosition = desiredPosition;
        let bestDistance = 0;
        
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            let currentPosition = desiredPosition;
            
            if (attempt > 0) {
                // Add random offset for subsequent attempts
                const randomOffset = new vec3(
                    (Math.random() - 0.5) * minDistance * 2,
                    (Math.random() - 0.5) * minDistance * 0.5,
                    (Math.random() - 0.5) * minDistance * 2
                );
                currentPosition = desiredPosition.add(randomOffset);
            }
            
            // Check collision with all existing positions
            let hasCollision = false;
            let minDistanceToOthers = Infinity;
            
            for (const existingPos of existingPositions) {
                const distance = currentPosition.distance(existingPos);
                minDistanceToOthers = Math.min(minDistanceToOthers, distance);
                
                if (distance < minDistance) {
                    hasCollision = true;
                    break;
                }
            }
            
            if (!hasCollision) {
                return currentPosition;
            }
            
            // Keep track of best position (furthest from others)
            if (minDistanceToOthers > bestDistance) {
                bestDistance = minDistanceToOthers;
                bestPosition = currentPosition;
            }
        }
        
        return bestPosition;
    }
    
    /**
     * Calculate direction vector between two positions
     */
    public static calculateDirection(fromPosition: vec3, toPosition: vec3): vec3 {
        const direction = toPosition.sub(fromPosition);
        return direction.normalize();
    }
    
    /**
     * Calculate position at a specific distance along a direction
     */
    public static calculatePositionAtDistance(startPosition: vec3, direction: vec3, distance: number): vec3 {
        const normalizedDirection = direction.normalize();
        return startPosition.add(normalizedDirection.uniformScale(distance));
    }
    
    /**
     * Get random position within a sphere
     */
    public static getRandomPositionInSphere(centerPosition: vec3, radius: number): vec3 {
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = Math.pow(Math.random(), 1/3) * radius;
        
        const x = centerPosition.x + r * Math.sin(phi) * Math.cos(theta);
        const y = centerPosition.y + r * Math.sin(phi) * Math.sin(theta);
        const z = centerPosition.z + r * Math.cos(phi);
        
        return new vec3(x, y, z);
    }
    
    /**
     * Get random position within a cylinder (useful for layered layouts)
     */
    public static getRandomPositionInCylinder(centerPosition: vec3, radius: number, height: number): vec3 {
        const theta = Math.random() * 2 * Math.PI;
        const r = Math.sqrt(Math.random()) * radius;
        const h = (Math.random() - 0.5) * height;
        
        const x = centerPosition.x + r * Math.cos(theta);
        const y = centerPosition.y + h;
        const z = centerPosition.z + r * Math.sin(theta);
        
        return new vec3(x, y, z);
    }
    
    /**
     * Calculate bounding box of a set of positions
     */
    public static calculateBoundingBox(positions: vec3[]): { min: vec3, max: vec3, center: vec3, size: vec3 } {
        if (positions.length === 0) {
            return {
                min: vec3.zero(),
                max: vec3.zero(),
                center: vec3.zero(),
                size: vec3.zero()
            };
        }
        
        let minX = positions[0].x;
        let minY = positions[0].y;
        let minZ = positions[0].z;
        let maxX = positions[0].x;
        let maxY = positions[0].y;
        let maxZ = positions[0].z;
        
        for (const pos of positions) {
            minX = Math.min(minX, pos.x);
            minY = Math.min(minY, pos.y);
            minZ = Math.min(minZ, pos.z);
            maxX = Math.max(maxX, pos.x);
            maxY = Math.max(maxY, pos.y);
            maxZ = Math.max(maxZ, pos.z);
        }
        
        const min = new vec3(minX, minY, minZ);
        const max = new vec3(maxX, maxY, maxZ);
        const center = min.add(max).uniformScale(0.5);
        const size = max.sub(min);
        
        return { min, max, center, size };
    }
    
    /**
     * Distribute positions evenly along a bezier curve
     */
    public static distributeBezierPositions(startPos: vec3, controlPos1: vec3, controlPos2: vec3, endPos: vec3, nodeCount: number): vec3[] {
        const positions: vec3[] = [];
        
        for (let i = 0; i < nodeCount; i++) {
            const t = i / (nodeCount - 1);
            const position = this.calculateBezierPoint(startPos, controlPos1, controlPos2, endPos, t);
            positions.push(position);
        }
        
        return positions;
    }
    
    /**
     * Calculate a point on a cubic bezier curve
     */
    private static calculateBezierPoint(p0: vec3, p1: vec3, p2: vec3, p3: vec3, t: number): vec3 {
        const oneMinusT = 1 - t;
        const oneMinusTSquared = oneMinusT * oneMinusT;
        const oneMinusTCubed = oneMinusTSquared * oneMinusT;
        const tSquared = t * t;
        const tCubed = tSquared * t;
        
        const x = oneMinusTCubed * p0.x + 3 * oneMinusTSquared * t * p1.x + 3 * oneMinusT * tSquared * p2.x + tCubed * p3.x;
        const y = oneMinusTCubed * p0.y + 3 * oneMinusTSquared * t * p1.y + 3 * oneMinusT * tSquared * p2.y + tCubed * p3.y;
        const z = oneMinusTCubed * p0.z + 3 * oneMinusTSquared * t * p1.z + 3 * oneMinusT * tSquared * p2.z + tCubed * p3.z;
        
        return new vec3(x, y, z);
    }
    
    /**
     * Create a force-directed layout for nodes (simplified)
     */
    public static applyForceDirectedLayout(positions: vec3[], connections: number[][], iterations: number = 50, repulsionForce: number = 100, attractionForce: number = 0.1): vec3[] {
        const newPositions = positions.map(pos => new vec3(pos.x, pos.y, pos.z));
        
        for (let iter = 0; iter < iterations; iter++) {
            const forces = newPositions.map(() => vec3.zero());
            
            // Repulsion forces (all nodes repel each other)
            for (let i = 0; i < newPositions.length; i++) {
                for (let j = i + 1; j < newPositions.length; j++) {
                    const direction = newPositions[i].sub(newPositions[j]);
                    const distance = direction.length;
                    
                    if (distance > 0) {
                        const force = direction.normalize().uniformScale(repulsionForce / (distance * distance));
                        forces[i] = forces[i].add(force);
                        forces[j] = forces[j].sub(force);
                    }
                }
            }
            
            // Attraction forces (connected nodes attract each other)
            for (let i = 0; i < connections.length; i++) {
                for (const connectedIndex of connections[i]) {
                    if (connectedIndex < newPositions.length) {
                        const direction = newPositions[connectedIndex].sub(newPositions[i]);
                        const distance = direction.length;
                        
                        if (distance > 0) {
                            const force = direction.normalize().uniformScale(attractionForce * distance);
                            forces[i] = forces[i].add(force);
                            forces[connectedIndex] = forces[connectedIndex].sub(force);
                        }
                    }
                }
            }
            
            // Apply forces
            for (let i = 0; i < newPositions.length; i++) {
                newPositions[i] = newPositions[i].add(forces[i].uniformScale(0.1));
            }
        }
        
        return newPositions;
    }
    
    /**
     * Smooth transition between two positions using easing
     */
    public static smoothTransition(startPos: vec3, endPos: vec3, progress: number, easingType: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' = 'linear'): vec3 {
        let easedProgress = progress;
        
        switch (easingType) {
            case 'easeIn':
                easedProgress = progress * progress;
                break;
            case 'easeOut':
                easedProgress = 1 - (1 - progress) * (1 - progress);
                break;
            case 'easeInOut':
                easedProgress = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
                break;
            default:
                easedProgress = progress;
        }
        
        return vec3.lerp(startPos, endPos, easedProgress);
    }
} 