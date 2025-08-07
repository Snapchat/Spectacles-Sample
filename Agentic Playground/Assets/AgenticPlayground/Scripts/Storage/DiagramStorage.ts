// ================================
// Types for Diagram Storage
// ================================

interface DiagramNode {
    nodeIndex: number;
    nodeType: 'text' | 'image' | 'model';
    textTitle: string;
    textContent: string;
    imagePrompt?: string;
    modelPrompt?: string;
}

interface DiagramDocument {
    diagramTitle: string;
    nodeCount: number;
    nodes: DiagramNode[];
    createdAt: number;
    lastModified: number;
    documentString: string;
}

/**
 * Diagram Storage Component
 * According to diagram specification - stores diagram definitions and manages persistence
 * Handles the structured format for diagram data including titles, nodes, and prompts
 */
@component
export class DiagramStorage extends BaseScriptComponent {
    // ================================
    // Inspector Configuration
    // ================================
    
    @input
    @hint("Enable automatic diagram storage")
    public enableStorage: boolean = true;

    @input
    @hint("Enable debug logging for storage operations")
    public enableDebugLogging: boolean = false;

    @input
    @hint("Maximum number of diagrams to store")
    @widget(new SliderWidget(1, 50, 1))
    public maxStoredDiagrams: number = 10;

    @input
    @hint("Current diagram title")
    public currentDiagramTitle: string = "";

    // ================================
    // Internal State
    // ================================
    
    private isInitialized: boolean = false;
    private currentDiagramDocument: string = "";
    private storedDiagrams: Map<string, DiagramDocument> = new Map();
    private currentNodeCount: number = 0;
    private storageKey: string = "agentic_diagram_storage";

    // ================================
    // Internal State
    // ================================

    // ================================
    // Lifecycle Methods
    // ================================

    onAwake() {
        this.initializeStorage();
    }

    // ================================
    // Public Interface
    // ================================

    /**
     * Create a new diagram document with the specified title
     */
    public createNewDiagram(title: string): void {
        this.currentDiagramTitle = title;
        this.currentNodeCount = 0;
        this.activeNodes = []; // Clear active nodes for new diagram
        this.generateDiagramDocument();
        
        if (this.enableDebugLogging) {
            print(`DiagramStorage: Created new diagram "${title}"`);
        }
    }

    /**
     * Add a node to the current diagram
     */
    public addNode(nodeType: 'text' | 'image' | 'model', title: string, content: string, prompt?: string): void {
        if (!this.currentDiagramTitle) {
            if (this.enableDebugLogging) {
                print("DiagramStorage: No active diagram - creating default diagram");
            }
            this.createNewDiagram("Generated Diagram");
        }

        this.currentNodeCount++;

        const node: DiagramNode = {
            nodeIndex: this.currentNodeCount,
            nodeType: nodeType,
            textTitle: title,
            textContent: content
        };

        if (nodeType === 'image' && prompt) {
            node.imagePrompt = prompt;
        } else if (nodeType === 'model' && prompt) {
            node.modelPrompt = prompt;
        }

        // Add to active nodes array
        this.activeNodes.push(node);

        // Update the current diagram document
        this.generateDiagramDocument();

        if (this.enableDebugLogging) {
            print(`DiagramStorage: Added ${nodeType} node "${title}" to diagram "${this.currentDiagramTitle}"`);
        }
    }

    /**
     * Get the current diagram document as formatted string
     */
    public getCurrentDiagramDocument(): string {
        return this.currentDiagramDocument;
    }

    /**
     * Save the current diagram to storage
     */
    public saveDiagram(): void {
        if (!this.currentDiagramTitle || this.currentNodeCount === 0) {
            if (this.enableDebugLogging) {
                print("DiagramStorage: No diagram to save");
            }
            return;
        }

        const diagramId = this.generateDiagramId();
        const document: DiagramDocument = {
            diagramTitle: this.currentDiagramTitle,
            nodeCount: this.currentNodeCount,
            nodes: this.getCurrentNodes(),
            createdAt: Date.now(),
            lastModified: Date.now(),
            documentString: this.currentDiagramDocument
        };

        this.storedDiagrams.set(diagramId, document);

        // Clean up old diagrams if we exceed the limit
        this.cleanupOldDiagrams();

        if (this.enableDebugLogging) {
            print(`DiagramStorage: Saved diagram "${this.currentDiagramTitle}" with ID ${diagramId}`);
        }
    }

    /**
     * Load a diagram by ID
     */
    public loadDiagram(diagramId: string): DiagramDocument | null {
        const document = this.storedDiagrams.get(diagramId);
        
        if (document) {
            this.currentDiagramTitle = document.diagramTitle;
            this.currentNodeCount = document.nodeCount;
            this.currentDiagramDocument = document.documentString;

            if (this.enableDebugLogging) {
                print(`DiagramStorage: Loaded diagram "${document.diagramTitle}"`);
            }
        } else {
            if (this.enableDebugLogging) {
                print(`DiagramStorage: Diagram with ID ${diagramId} not found`);
            }
        }

        return document;
    }

    /**
     * Get all stored diagram IDs and titles
     */
    public getStoredDiagramsList(): Array<{id: string, title: string, nodeCount: number, lastModified: number}> {
        const diagrams: Array<{id: string, title: string, nodeCount: number, lastModified: number}> = [];
        
        for (const [id, document] of this.storedDiagrams) {
            diagrams.push({
                id: id,
                title: document.diagramTitle,
                nodeCount: document.nodeCount,
                lastModified: document.lastModified
            });
        }

        // Sort by last modified (newest first)
        diagrams.sort((a, b) => b.lastModified - a.lastModified);
        
        return diagrams;
    }

    /**
     * Update the current diagram with new nodes data
     */
    public updateDiagram(nodes: DiagramNode[]): void {
        this.currentNodeCount = nodes.length;
        this.generateDiagramDocumentFromNodes(nodes);

        if (this.enableDebugLogging) {
            print(`DiagramStorage: Updated diagram "${this.currentDiagramTitle}" with ${nodes.length} nodes`);
        }
    }

    /**
     * Clear all stored diagrams
     */
    public clearAllDiagrams(): void {
        this.storedDiagrams.clear();
        this.currentDiagramTitle = "";
        this.currentNodeCount = 0;
        this.currentDiagramDocument = "";
        this.activeNodes = []; // Clear active nodes
        
        // Clear persistent storage
        this.saveToStorage();

        if (this.enableDebugLogging) {
            print("DiagramStorage: Cleared all stored diagrams");
        }
    }

    /**
     * Get the current diagram document
     */
    public getCurrentDiagram(): DiagramDocument | null {
        if (!this.currentDiagramTitle || this.currentDiagramDocument.length === 0) {
            return null;
        }
        
        return {
            diagramTitle: this.currentDiagramTitle,
            nodeCount: this.currentNodeCount,
            nodes: this.activeNodes,
            createdAt: Date.now(),
            lastModified: Date.now(),
            documentString: this.currentDiagramDocument
        };
    }
    
    /**
     * Get all stored diagrams
     */
    public getAllDiagrams(): DiagramDocument[] {
        return Array.from(this.storedDiagrams.values());
    }
    
    /**
     * Get storage statistics
     */
    public getStorageStats(): {totalDiagrams: number, currentTitle: string, currentNodes: number} {
        return {
            totalDiagrams: this.storedDiagrams.size,
            currentTitle: this.currentDiagramTitle,
            currentNodes: this.currentNodeCount
        };
    }

    // ================================
    // Private Methods
    // ================================

    /**
     * Initialize the storage system
     */
    private initializeStorage(): void {
        if (this.isInitialized) return;

        try {
            this.loadFromStorage();
            this.isInitialized = true;

            if (this.enableDebugLogging) {
                print(`DiagramStorage: ✅ Storage system initialized with ${this.storedDiagrams.size} stored diagrams`);
            }
        } catch (error) {
            if (this.enableDebugLogging) {
                print(`DiagramStorage: ❌ Initialization error: ${error}`);
            }
            // Initialize empty on error
            this.storedDiagrams = new Map();
            this.isInitialized = true;
        }
    }

    /**
     * Generate the diagram document string in the specified format
     */
    private generateDiagramDocument(): void {
        let document = `DiagramTitle: ${this.currentDiagramTitle}\n\n`;
        document += `Nodes: ${this.currentNodeCount}\n\n`;

        const nodes = this.getCurrentNodes();
        
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            document += `Node ${node.nodeIndex}: ${node.nodeType}\n`;
            document += `Text title: "${node.textTitle}"\n`;
            document += `Text content: "${node.textContent}"\n`;
            
            if (node.nodeType === 'image' && node.imagePrompt) {
                document += `Image prompt: "${node.imagePrompt}"\n`;
            } else if (node.nodeType === 'model' && node.modelPrompt) {
                document += `Model prompt: "${node.modelPrompt}"\n`;
            }
            
            if (i < nodes.length - 1) {
                document += "\n";
            }
        }

        this.currentDiagramDocument = document;
    }

    /**
     * Generate diagram document from provided nodes array
     */
    private generateDiagramDocumentFromNodes(nodes: DiagramNode[]): void {
        let document = `DiagramTitle: ${this.currentDiagramTitle}\n\n`;
        document += `Nodes: ${nodes.length}\n\n`;
        
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            document += `Node ${i + 1}: ${node.nodeType}\n`;
            document += `Text title: "${node.textTitle}"\n`;
            document += `Text content: "${node.textContent}"\n`;
            
            if (node.nodeType === 'image' && node.imagePrompt) {
                document += `Image prompt: "${node.imagePrompt}"\n`;
            } else if (node.nodeType === 'model' && node.modelPrompt) {
                document += `Model prompt: "${node.modelPrompt}"\n`;
            }
            
            if (i < nodes.length - 1) {
                document += "\n";
            }
        }

        this.currentDiagramDocument = document;
    }

    /**
     * Get current nodes (this is a simplified implementation)
     * In a real implementation, you would track the actual nodes
     */
    private getCurrentNodes(): DiagramNode[] {
        // Return the actual nodes that have been added
        return this.activeNodes;
    }
    
    // Add a private field to track nodes in memory
    private activeNodes: DiagramNode[] = [];

    /**
     * Generate a unique diagram ID
     */
    private generateDiagramId(): string {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return `diagram_${timestamp}_${random}`;
    }

    /**
     * Clean up old diagrams if we exceed the storage limit
     */
    private cleanupOldDiagrams(): void {
        if (this.storedDiagrams.size <= this.maxStoredDiagrams) {
            return;
        }

        // Convert to array and sort by creation time
        const diagramEntries = Array.from(this.storedDiagrams.entries());
        diagramEntries.sort((a, b) => a[1].createdAt - b[1].createdAt);

        // Remove oldest diagrams
        const excessCount = this.storedDiagrams.size - this.maxStoredDiagrams;
        for (let i = 0; i < excessCount; i++) {
            const [oldestId] = diagramEntries[i];
            this.storedDiagrams.delete(oldestId);
            
            if (this.enableDebugLogging) {
                print(`DiagramStorage: Removed old diagram ${oldestId} to maintain storage limit`);
            }
        }
    }
    
    // ================================
    // Persistent Storage Methods
    // ================================
    
    /**
     * Save diagrams to persistent storage
     */
    private saveToStorage(): void {
        if (!this.enableStorage) {
            return;
        }
        
        try {
            const storageData = {
                currentDocument: this.currentDiagramDocument,
                currentTitle: this.currentDiagramTitle,
                diagrams: Array.from(this.storedDiagrams.entries()),
                lastSaved: Date.now()
            };
            
            // Use Snap's persistent storage
            if (global.persistentStorageSystem) {
                const store = global.persistentStorageSystem.store;
                store.putString(this.storageKey, JSON.stringify(storageData));
                
                if (this.enableDebugLogging) {
                    print("DiagramStorage: 💾 Data saved to persistent storage");
                }
            }
        } catch (error) {
            if (this.enableDebugLogging) {
                print(`DiagramStorage: ❌ Save error: ${error}`);
            }
        }
    }
    
    /**
     * Load diagrams from persistent storage
     */
    private loadFromStorage(): void {
        if (!this.enableStorage) {
            return;
        }
        
        try {
            if (global.persistentStorageSystem) {
                const store = global.persistentStorageSystem.store;
                const storedDataString = store.getString(this.storageKey);
                
                if (storedDataString && storedDataString.length > 0) {
                    const storageData = JSON.parse(storedDataString);
                    
                    this.currentDiagramDocument = storageData.currentDocument || "";
                    this.currentDiagramTitle = storageData.currentTitle || "";
                    
                    // Restore diagrams map
                    this.storedDiagrams.clear();
                    if (storageData.diagrams) {
                        storageData.diagrams.forEach(([key, value]) => {
                            this.storedDiagrams.set(key, value);
                        });
                    }
                    
                    if (this.enableDebugLogging) {
                        print(`DiagramStorage: 📖 Loaded ${this.storedDiagrams.size} diagrams from storage`);
                    }
                }
            }
        } catch (error) {
            if (this.enableDebugLogging) {
                print(`DiagramStorage: ❌ Load error: ${error}`);
            }
            throw error; // Re-throw to be handled by caller
        }
    }
} 