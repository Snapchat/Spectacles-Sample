import { DiagramComponent } from '../Components/DiagramComponent';
import { DiagramNode, DiagramConnection } from '../Agents/AgentTypes';

/**
 * DiagramExtensions - Utility class to extend AgenticDiagram with public methods for adding nodes
 * 
 * This utility provides a clean way to add nodes to AgenticDiagram from external components
 * while maintaining compatibility with the existing mind mapping system.
 * 
 * Updated to use the new public methods added to AgenticDiagram for proper integration.
 */
export class DiagramExtensions {
  
  /**
   * Add a text node to the diagram
   */
  public static addTextNode(diagram: DiagramComponent, nodeId: string, content: string, position: vec3, level: number = 1): boolean {
    if (!diagram || !nodeId || !content) {
      print("DiagramExtensions: ❌ Invalid parameters for addTextNode");
      return false;
    }
    
    try {
      // Use the public method from AgenticDiagram
      const success = diagram.addTextNode(nodeId, content, position, level);
      
      if (success) {
        print(`DiagramExtensions: ✅ Added text node "${nodeId}" with content: "${content.substring(0, 30)}..."`);
      } else {
        print(`DiagramExtensions: ❌ Failed to add text node "${nodeId}"`);
      }
      
      return success;
      
    } catch (error) {
      print(`DiagramExtensions: ❌ Error adding text node: ${error}`);
      return false;
    }
  }
  
  /**
   * Add an image node to the diagram
   */
  public static addImageNode(diagram: DiagramComponent, nodeId: string, content: string, position: vec3, level: number = 1): boolean {
    if (!diagram || !nodeId || !content) {
      print("DiagramExtensions: ❌ Invalid parameters for addImageNode");
      return false;
    }
    
    try {
      // Use the public method from AgenticDiagram
      const success = diagram.addImageNode(nodeId, content, position, level);
      
      if (success) {
        print(`DiagramExtensions: ✅ Added image node "${nodeId}" with content: "${content.substring(0, 30)}..."`);
      } else {
        print(`DiagramExtensions: ❌ Failed to add image node "${nodeId}"`);
      }
      
      return success;
      
    } catch (error) {
      print(`DiagramExtensions: ❌ Error adding image node: ${error}`);
      return false;
    }
  }
  
  /**
   * Add a model node to the diagram
   */
  public static addModelNode(diagram: DiagramComponent, nodeId: string, content: string, position: vec3, level: number = 1): boolean {
    if (!diagram || !nodeId || !content) {
      print("DiagramExtensions: ❌ Invalid parameters for addModelNode");
      return false;
    }
    
    try {
      // Use the public method from AgenticDiagram
      const success = diagram.addModelNode(nodeId, content, position, level);
      
      if (success) {
        print(`DiagramExtensions: ✅ Added model node "${nodeId}" with content: "${content.substring(0, 30)}..."`);
      } else {
        print(`DiagramExtensions: ❌ Failed to add model node "${nodeId}"`);
      }
      
      return success;
      
    } catch (error) {
      print(`DiagramExtensions: ❌ Error adding model node: ${error}`);
      return false;
    }
  }
  
  /**
   * Add a connection between two nodes
   */
  public static addConnection(diagram: DiagramComponent, fromNodeId: string, toNodeId: string): boolean {
    if (!diagram || !fromNodeId || !toNodeId) {
      print("DiagramExtensions: ❌ Invalid parameters for addConnection");
      return false;
    }
    
    try {
      // Use the public method from AgenticDiagram
      const success = diagram.addConnection(fromNodeId, toNodeId);
      
      if (success) {
        print(`DiagramExtensions: ✅ Added connection from "${fromNodeId}" to "${toNodeId}"`);
      } else {
        print(`DiagramExtensions: ❌ Failed to add connection: ${fromNodeId} -> ${toNodeId}`);
      }
      
      return success;
      
    } catch (error) {
      print(`DiagramExtensions: ❌ Error adding connection: ${error}`);
      return false;
    }
  }
  
  /**
   * Get the total number of nodes in the diagram
   */
  public static getNodeCount(diagram: DiagramComponent): number {
    if (!diagram) {
      return 0;
    }
    
    try {
      // Use the public method from AgenticDiagram
      const status = diagram.getDiagramStatus();
      return status.nodeCount;
      
    } catch (error) {
      print(`DiagramExtensions: ❌ Error getting node count: ${error}`);
      return 0;
    }
  }
  
  /**
   * Check if a node exists in the diagram
   */
  public static nodeExists(diagram: DiagramComponent, nodeId: string): boolean {
    if (!diagram || !nodeId) {
      return false;
    }
    
    try {
      // Access the nodeReferences map directly if it's public
      const diagramAny = diagram as any;
      if (diagramAny.nodeReferences && diagramAny.nodeReferences.has) {
        return diagramAny.nodeReferences.has(nodeId);
      }
      return false;
    } catch (error) {
      print(`DiagramExtensions: ❌ Error checking node existence: ${error}`);
      return false;
    }
  }
  
  /**
   * Check if the diagram is ready for adding nodes
   */
  public static isReady(diagram: DiagramComponent): boolean {
    if (!diagram) {
      return false;
    }
    
    try {
      // Use the public method from AgenticDiagram
      return diagram.isReady();
      
    } catch (error) {
      print(`DiagramExtensions: ❌ Error checking readiness: ${error}`);
      return false;
    }
  }
  
  /**
   * Clear all nodes from the diagram
   */
  public static clearDiagram(diagram: DiagramComponent): boolean {
    if (!diagram) {
      return false;
    }
    
    try {
      // Use the public method from AgenticDiagram
      diagram.resetSystem();
      print("DiagramExtensions: ✅ Cleared all nodes from diagram");
      return true;
      
    } catch (error) {
      print(`DiagramExtensions: ❌ Error clearing diagram: ${error}`);
      return false;
    }
  }
  
  /**
   * Calculate next node position based on existing nodes
   */
  public static calculateNextPosition(diagram: DiagramComponent, level: number = 1): vec3 {
    if (!diagram) {
      return vec3.zero();
    }
    
    try {
      // Use the private method through type assertion since it's not exposed publicly
      const diagramAny = diagram as any;
      
      if (typeof diagramAny.calculateNextPosition === 'function') {
        return diagramAny.calculateNextPosition(level);
      }
      
      // Fallback calculation if method not available
      const baseRadius = 200 + (level * 150);
      const angleStep = (2 * Math.PI) / 8;
      const angle = angleStep * level;
      
      const x = Math.cos(angle) * baseRadius;
      const z = Math.sin(angle) * baseRadius;
      const y = level * 50;
      
      return new vec3(x, y, z);
      
    } catch (error) {
      print(`DiagramExtensions: ❌ Error calculating position: ${error}`);
      return vec3.zero();
    }
  }
  
  /**
   * Get diagram status for debugging
   */
  public static getDiagramStatus(diagram: DiagramComponent): {
    isInitialized: boolean;
    nodeCount: number;
    textNodes: number;
    imageNodes: number;
    modelNodes: number;
    startingNodes: number;
  } {
    if (!diagram) {
      return {
        isInitialized: false,
        nodeCount: 0,
        textNodes: 0,
        imageNodes: 0,
        modelNodes: 0,
        startingNodes: 0
      };
    }
    
    try {
      // Use the public method from AgenticDiagram
      const status = diagram.getDiagramStatus();
      const isReady = diagram.isReady();
      
      // Calculate node types from nodesByLevel (approximation)
      let textNodes = 0;
      let imageNodes = 0;
      let modelNodes = 0;
      let startingNodes = status.nodesByLevel.get(0) || 0; // Starting nodes are at level 0
      
      // Approximate distribution for other levels
      for (const [level, count] of status.nodesByLevel) {
        if (level > 0) {
          // Distribute nodes across types (rough approximation)
          const remainder = count % 3;
          const base = Math.floor(count / 3);
          
          textNodes += base + (remainder > 0 ? 1 : 0);
          imageNodes += base + (remainder > 1 ? 1 : 0);
          modelNodes += base;
        }
      }
      
      return {
        isInitialized: isReady,
        nodeCount: status.nodeCount,
        textNodes: textNodes,
        imageNodes: imageNodes,
        modelNodes: modelNodes,
        startingNodes: startingNodes
      };
      
    } catch (error) {
      print(`DiagramExtensions: ❌ Error getting diagram status: ${error}`);
      return {
        isInitialized: false,
        nodeCount: 0,
        textNodes: 0,
        imageNodes: 0,
        modelNodes: 0,
        startingNodes: 0
      };
    }
  }
}
