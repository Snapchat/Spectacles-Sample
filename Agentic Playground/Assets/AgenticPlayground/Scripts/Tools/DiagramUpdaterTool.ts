import { DiagramState, DiagramNode, DiagramConnection, DiagramUpdateResult } from '../Agents/AgentTypes';
import { TextLimiter, CHARACTER_LIMITS } from '../Utils/TextLimiter';

/**
 * Tool for updating mind map structure based on conversation analysis
 * 
 * NOTE: If this tool ever needs to call AgentLanguageInterface.generateResponse(),
 * it should use textOnly: true to prevent voice output during diagram updates,
 * since users want to see visual changes without competing audio narration.
 */
export class DiagramUpdaterTool {
  public readonly name = 'diagram_updater';
  public readonly description = 'Updates mind map structure and relationships based on conversation analysis';
  
  public readonly parameters = {
    type: 'object',
    properties: {
      analysis: { type: 'object', description: 'Conversation analysis results' },
      currentDiagram: { type: 'object', description: 'Current diagram state' },
      updateType: { type: 'string', enum: ['add_node', 'update_node', 'add_connection', 'restructure'] },
      maxNodes: { type: 'number', description: 'Maximum number of nodes to create' },
      enableImages: { type: 'boolean', description: 'Enable image node generation' },
      enable3D: { type: 'boolean', description: 'Enable 3D model node generation' }
    },
    required: ['analysis', 'currentDiagram']
  };
  
  /**
   * Execute the diagram update tool
   */
  public async execute(args: Record<string, unknown>): Promise<{ success: boolean; result?: DiagramUpdateResult; error?: string }> {
    try {
      const {
        analysis,
        currentDiagram,
        updateType = 'add_node',
        maxNodes = CHARACTER_LIMITS.MAX_NODES,
        enableImages = true,
        enable3D = true
      } = args;
      
      print(`DiagramUpdaterTool: 🔧 Updating diagram with type: ${updateType}`);
      
      // Validate inputs
      if (!analysis || !currentDiagram) {
        return { success: false, error: 'Invalid analysis or diagram data' };
      }
      
      // Perform update based on type
      let updateResult: DiagramUpdateResult;
      
      switch (updateType) {
        case 'add_node':
          updateResult = await this.addNodesFromAnalysis(
            analysis,
            currentDiagram as DiagramState,
            maxNodes as number,
            enableImages as boolean,
            enable3D as boolean
          );
          break;
          
        case 'add_connection':
          updateResult = await this.addConnectionsFromAnalysis(
            analysis,
            currentDiagram as DiagramState
          );
          break;
          
        case 'restructure':
          updateResult = await this.restructureDiagram(
            analysis,
            currentDiagram as DiagramState
          );
          break;
          
        default:
          updateResult = await this.addNodesFromAnalysis(
            analysis,
            currentDiagram as DiagramState,
            maxNodes as number,
            enableImages as boolean,
            enable3D as boolean
          );
      }
      
      print(`DiagramUpdaterTool: ✅ Diagram update complete - ${updateResult.updatedNodes.length} nodes, ${updateResult.newConnections.length} connections`);
      
      return { success: true, result: updateResult };
      
    } catch (error) {
      print(`DiagramUpdaterTool: ❌ Error during diagram update: ${error}`);
      return { success: false, error: `Diagram update failed: ${error}` };
    }
  }
  
  /**
   * Add nodes from conversation analysis
   */
  private async addNodesFromAnalysis(
    analysis: any,
    currentDiagram: DiagramState,
    maxNodes: number,
    enableImages: boolean,
    enable3D: boolean
  ): Promise<DiagramUpdateResult> {
    const newNodes: DiagramNode[] = [];
    const newConnections: DiagramConnection[] = [];
    
    // Get topics from analysis
    const topics = analysis.topics || [];
    const concepts = analysis.concepts || [];
    const learningObjectives = analysis.learningObjectives || [];
    
    // Combine all content sources
    const allContent = [...topics, ...concepts, ...learningObjectives];
    
    // Filter out content that already exists as nodes
    const existingContent = currentDiagram.nodes.map(node => node.content.toLowerCase());
    const newContent = allContent.filter(content => 
      !existingContent.includes(content.toLowerCase())
    );
    
    // Create nodes for new content
    const nodesToCreate = newContent.slice(0, maxNodes);
    const nodeTypes: ('text' | 'image' | 'model')[] = ['text'];
    
    if (enableImages) nodeTypes.push('image');
    if (enable3D) nodeTypes.push('model');
    
    for (let i = 0; i < nodesToCreate.length; i++) {
      const content = nodesToCreate[i];
      const nodeType = nodeTypes[i % nodeTypes.length];
      
      const node: DiagramNode = {
        id: `node_${Date.now()}_${i}`,
        type: nodeType,
        content: TextLimiter.limitText(content, CHARACTER_LIMITS.NODE_DESCRIPTION_GENERAL),
        position: this.calculateNodePosition(i, currentDiagram.nodes.length),
        level: this.calculateNodeLevel(content, topics, concepts, learningObjectives),
        generatedContent: nodeType !== 'text' ? {
          type: nodeType,
          prompt: `Educational ${nodeType} about ${content}`,
          assetReference: '',
          generatedAt: Date.now()
        } : undefined
      };
      
      newNodes.push(node);
    }
    
    // Create connections based on educational relationships
    if (analysis.educationalConnections) {
      for (const connection of analysis.educationalConnections) {
        const fromNode = newNodes.find(n => n.content.toLowerCase().includes(connection.from.toLowerCase()));
        const toNode = newNodes.find(n => n.content.toLowerCase().includes(connection.to.toLowerCase()));
        
        if (fromNode && toNode) {
          const diagramConnection: DiagramConnection = {
            id: `conn_${Date.now()}_${fromNode.id}_${toNode.id}`,
            fromNodeId: fromNode.id,
            toNodeId: toNode.id,
            relationship: connection.relationship || 'relates to',
            strength: 0.7
          };
          
          newConnections.push(diagramConnection);
        }
      }
    }
    
    return {
      updatedNodes: newNodes,
      newConnections: newConnections,
      removedNodes: [],
      updateType: 'add_node'
    };
  }
  
  /**
   * Add connections from analysis
   */
  private async addConnectionsFromAnalysis(
    analysis: any,
    currentDiagram: DiagramState
  ): Promise<DiagramUpdateResult> {
    const newConnections: DiagramConnection[] = [];
    
    // Create connections based on educational relationships
    if (analysis.educationalConnections) {
      for (const connection of analysis.educationalConnections) {
        const fromNode = currentDiagram.nodes.find(n => 
          n.content.toLowerCase().includes(connection.from.toLowerCase())
        );
        const toNode = currentDiagram.nodes.find(n => 
          n.content.toLowerCase().includes(connection.to.toLowerCase())
        );
        
        if (fromNode && toNode) {
          // Check if connection already exists
          const existingConnection = currentDiagram.connections.find(c => 
            c.fromNodeId === fromNode.id && c.toNodeId === toNode.id
          );
          
          if (!existingConnection) {
            const diagramConnection: DiagramConnection = {
              id: `conn_${Date.now()}_${fromNode.id}_${toNode.id}`,
              fromNodeId: fromNode.id,
              toNodeId: toNode.id,
              relationship: connection.relationship || 'relates to',
              strength: 0.7
            };
            
            newConnections.push(diagramConnection);
          }
        }
      }
    }
    
    return {
      updatedNodes: [],
      newConnections: newConnections,
      removedNodes: [],
      updateType: 'add_connection'
    };
  }
  
  /**
   * Restructure diagram based on analysis
   */
  private async restructureDiagram(
    analysis: any,
    currentDiagram: DiagramState
  ): Promise<DiagramUpdateResult> {
    // For now, just return current state
    // In a full implementation, this would reorganize node positions
    // based on new relationship understanding
    
    return {
      updatedNodes: [],
      newConnections: [],
      removedNodes: [],
      updateType: 'restructure'
    };
  }
  
  /**
   * Calculate position for new node
   */
  private calculateNodePosition(index: number, existingNodeCount: number): vec3 {
    // Create a circular layout around the origin
    const radius = 3;
    const angleStep = (2 * Math.PI) / Math.max(8, existingNodeCount + index + 1);
    const angle = angleStep * (existingNodeCount + index);
    
    const x = radius * Math.cos(angle);
    const z = radius * Math.sin(angle);
    const y = 0; // Keep nodes at same height
    
    return new vec3(x, y, z);
  }
  
  /**
   * Calculate node level based on content type
   */
  private calculateNodeLevel(
    content: string,
    topics: string[],
    concepts: string[],
    learningObjectives: string[]
  ): number {
    // Topics are level 1 (most important)
    if (topics.includes(content)) return 1;
    
    // Concepts are level 2
    if (concepts.includes(content)) return 2;
    
    // Learning objectives are level 3
    if (learningObjectives.includes(content)) return 3;
    
    // Default level
    return 2;
  }
}
