/**
 * Base behavior for all mind map nodes
 */
export abstract class BaseMindNodeBehavior {
    protected sceneObject: SceneObject;
    protected nodeId: string;
    protected isActive: boolean = true;

    constructor(sceneObject: SceneObject, nodeId: string) {
        this.sceneObject = sceneObject;
        this.nodeId = nodeId;
    }

    public abstract initialize(): void;
    public abstract updateContent(content: string): void;
    public abstract setHighlight(highlighted: boolean): void;
    public abstract destroy(): void;

    public getSceneObject(): SceneObject {
        return this.sceneObject;
    }

    public getNodeId(): string {
        return this.nodeId;
    }

    public setActive(active: boolean): void {
        this.isActive = active;
        this.sceneObject.enabled = active;
    }

    public isNodeActive(): boolean {
        return this.isActive;
    }
}

/**
 * Behavior for starting nodes
 */
export class StartingNodeBehavior extends BaseMindNodeBehavior {
    private originalScale: vec3;
    private diagramName: string;

    constructor(sceneObject: SceneObject, nodeId: string, diagramName: string) {
        super(sceneObject, nodeId);
        this.diagramName = diagramName;
        this.originalScale = sceneObject.getTransform().getLocalScale();
    }

    public initialize(): void {
        // Initialize starting node behavior
        this.animateEntry();
    }

    public updateContent(content: string): void {
        this.diagramName = content;
        // Update visual content when text components are accessible
    }

    public setHighlight(highlighted: boolean): void {
        const scale = highlighted ? this.originalScale.uniformScale(1.2) : this.originalScale;
        this.sceneObject.getTransform().setLocalScale(scale);
    }

    public destroy(): void {
        this.sceneObject.destroy();
    }

    private animateEntry(): void {
        // Simple scale animation on entry
        const transform = this.sceneObject.getTransform();
        transform.setLocalScale(vec3.zero());
        
        // Gradually scale up to original size
        const duration = 0.5;
        const startTime = getTime();
        
        const animate = () => {
            const elapsed = getTime() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const currentScale = this.originalScale.uniformScale(progress);
            
            transform.setLocalScale(currentScale);
            
            if (progress < 1) {
                // Continue animation using script update
                this.continueAnimation(animate);
            }
        };
        
        animate();
    }

    private continueAnimation(callback: () => void): void {
        // Simple animation continuation (would be replaced with proper frame callback)
        callback();
    }

    public getDiagramName(): string {
        return this.diagramName;
    }
}

/**
 * Behavior for text nodes
 */
export class TextNodeBehavior extends BaseMindNodeBehavior {
    private originalColor: vec3;
    private textContent: string;

    constructor(sceneObject: SceneObject, nodeId: string, textContent: string) {
        super(sceneObject, nodeId);
        this.textContent = textContent;
        this.originalColor = new vec3(1, 1, 1); // Default white
    }

    public initialize(): void {
        // Initialize text node behavior
        this.animateEntry();
    }

    public updateContent(content: string): void {
        this.textContent = content;
        // Update visual content when text components are accessible
    }

    public setHighlight(highlighted: boolean): void {
        // Visual highlight implementation
        const transform = this.sceneObject.getTransform();
        const scale = highlighted ? 
            transform.getLocalScale().uniformScale(1.1) : 
            transform.getLocalScale().uniformScale(1.0);
        transform.setLocalScale(scale);
    }

    public destroy(): void {
        this.sceneObject.destroy();
    }

    private animateEntry(): void {
        // Simple fade in animation placeholder
        const transform = this.sceneObject.getTransform();
        const originalScale = transform.getLocalScale();
        transform.setLocalScale(originalScale.uniformScale(0.8));
        
        // Animate to full scale
        const duration = 0.3;
        const startTime = getTime();
        
        const animate = () => {
            const elapsed = getTime() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const currentScale = originalScale.uniformScale(0.8 + (0.2 * progress));
            
            transform.setLocalScale(currentScale);
            
            if (progress < 1) {
                this.continueAnimation(animate);
            }
        };
        
        animate();
    }

    private continueAnimation(callback: () => void): void {
        // Simple animation continuation
        callback();
    }

    public getTextContent(): string {
        return this.textContent;
    }
}

/**
 * Behavior for image nodes
 */
export class ImageNodeBehavior extends BaseMindNodeBehavior {
    private textContent: string;
    private imagePath: string;

    constructor(sceneObject: SceneObject, nodeId: string, textContent: string, imagePath: string) {
        super(sceneObject, nodeId);
        this.textContent = textContent;
        this.imagePath = imagePath;
    }

    public initialize(): void {
        // Initialize image node behavior
        this.animateEntry();
    }

    public updateContent(content: string): void {
        this.textContent = content;
        // Update visual content when components are accessible
    }

    public setHighlight(highlighted: boolean): void {
        const transform = this.sceneObject.getTransform();
        const scale = highlighted ? 
            transform.getLocalScale().uniformScale(1.1) : 
            transform.getLocalScale().uniformScale(1.0);
        transform.setLocalScale(scale);
    }

    public destroy(): void {
        this.sceneObject.destroy();
    }

    private animateEntry(): void {
        // Slide in animation
        const transform = this.sceneObject.getTransform();
        const finalPos = transform.getLocalPosition();
        const startPos = finalPos.add(new vec3(100, 0, 0)); // Start offset
        
        transform.setLocalPosition(startPos);
        
        const duration = 0.4;
        const startTime = getTime();
        
        const animate = () => {
            const elapsed = getTime() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const currentPos = vec3.lerp(startPos, finalPos, progress);
            
            transform.setLocalPosition(currentPos);
            
            if (progress < 1) {
                this.continueAnimation(animate);
            }
        };
        
        animate();
    }

    private continueAnimation(callback: () => void): void {
        // Simple animation continuation
        callback();
    }

    public getTextContent(): string {
        return this.textContent;
    }

    public getImagePath(): string {
        return this.imagePath;
    }

    public updateImage(imagePath: string): void {
        this.imagePath = imagePath;
        // Update image when components are accessible
    }
}

/**
 * Behavior for 3D model nodes
 */
export class ModelNodeBehavior extends BaseMindNodeBehavior {
    private textContent: string;
    private modelPath: string;
    private rotationAnimationActive: boolean = false;

    constructor(sceneObject: SceneObject, nodeId: string, textContent: string, modelPath: string) {
        super(sceneObject, nodeId);
        this.textContent = textContent;
        this.modelPath = modelPath;
    }

    public initialize(): void {
        // Initialize model node behavior
        this.animateEntry();
    }

    public updateContent(content: string): void {
        this.textContent = content;
        // Update visual content when components are accessible
    }

    public setHighlight(highlighted: boolean): void {
        if (highlighted) {
            this.startRotationAnimation();
        } else {
            this.stopRotationAnimation();
        }
    }

    public destroy(): void {
        this.stopRotationAnimation();
        this.sceneObject.destroy();
    }

    private animateEntry(): void {
        // Bounce in animation
        const transform = this.sceneObject.getTransform();
        const finalScale = transform.getLocalScale();
        
        transform.setLocalScale(vec3.zero());
        
        const duration = 0.6;
        const startTime = getTime();
        
        const animate = () => {
            const elapsed = getTime() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Simple bounce easing
            const bounceProgress = progress < 0.5 ? 
                2 * progress * progress : 
                1 - Math.pow(-2 * progress + 2, 3) / 2;
            
            const currentScale = finalScale.uniformScale(bounceProgress);
            transform.setLocalScale(currentScale);
            
            if (progress < 1) {
                this.continueAnimation(animate);
            }
        };
        
        animate();
    }

    private continueAnimation(callback: () => void): void {
        // Simple animation continuation
        callback();
    }

    private startRotationAnimation(): void {
        if (this.rotationAnimationActive) return;
        
        this.rotationAnimationActive = true;
        const transform = this.sceneObject.getTransform();
        
        const rotateY = () => {
            if (!this.rotationAnimationActive) return;
            
            const currentRotation = transform.getLocalRotation();
            const rotationSpeed = 90; // degrees per second
            const deltaRotation = quat.angleAxis(rotationSpeed * getDeltaTime(), vec3.up());
            
            transform.setLocalRotation(currentRotation.multiply(deltaRotation));
            
            this.continueAnimation(rotateY);
        };
        
        rotateY();
    }

    private stopRotationAnimation(): void {
        this.rotationAnimationActive = false;
    }

    public getTextContent(): string {
        return this.textContent;
    }

    public getModelPath(): string {
        return this.modelPath;
    }

    public updateModel(modelPath: string): void {
        this.modelPath = modelPath;
        // Update model when components are accessible
    }
}

/**
 * Factory class for creating node behaviors
 */
export class MindNodeBehaviorFactory {
    public static createStartingNodeBehavior(sceneObject: SceneObject, nodeId: string, diagramName: string): StartingNodeBehavior {
        return new StartingNodeBehavior(sceneObject, nodeId, diagramName);
    }

    public static createTextNodeBehavior(sceneObject: SceneObject, nodeId: string, textContent: string): TextNodeBehavior {
        return new TextNodeBehavior(sceneObject, nodeId, textContent);
    }

    public static createImageNodeBehavior(sceneObject: SceneObject, nodeId: string, textContent: string, imagePath: string): ImageNodeBehavior {
        return new ImageNodeBehavior(sceneObject, nodeId, textContent, imagePath);
    }

    public static createModelNodeBehavior(sceneObject: SceneObject, nodeId: string, textContent: string, modelPath: string): ModelNodeBehavior {
        return new ModelNodeBehavior(sceneObject, nodeId, textContent, modelPath);
    }
} 