import * as FunctionTimingUtils from "SpectaclesInteractionKit/Utils/debounce";

/**
 * Controller for the simulation image display
 * Handles transitions between static and live feed
 */
export class SimulationImageController {
    private image: Image;
    private staticTextures: Texture[] = [];
    private staticAnimationToken: ReturnType<typeof FunctionTimingUtils.setTimeout> = null;
    private isStatic: boolean = false;
    private currentStaticFrame: number = 0;
    private static STATIC_REFRESH_RATE: number = 100; // ms
    private static STATIC_FRAME_COUNT: number = 8; // Number of precomputed static frames

    /**
     * Creates a new simulation image controller
     * @param image The image component to control
     */
    constructor(image: Image) {
        if (!image) {
            throw new Error("SimulationImageController requires a valid Image component");
        }
        this.image = image;
        this.generateStaticFrames();
        this.showStatic();
    }

    /**
     * Generate all static frames in advance
     */
    private generateStaticFrames(): void {
        const width = 512;
        const height = 512;
        
        for (let frame = 0; frame < SimulationImageController.STATIC_FRAME_COUNT; frame++) {
            const texture = ProceduralTextureProvider.create(width, height, Colorspace.RGBA);
            const pixels = new Uint8Array(width * height * 4);
            
            // Fill with random static noise
            for (let i = 0; i < pixels.length; i += 4) {
                const value = Math.floor(Math.random() * 255);
                pixels[i] = value;     // R
                pixels[i + 1] = value; // G
                pixels[i + 2] = value; // B
                pixels[i + 3] = 200;   // A (some transparency)
            }
            
            (texture.control as ProceduralTextureProvider).setPixels(0, 0, width, height, pixels);
            this.staticTextures.push(texture);
        }
    }

    /**
     * Display static noise on the image
     */
    public showStatic(): void {
        if (this.isStatic) return;
        
        this.isStatic = true;
        this.currentStaticFrame = 0;
        this.image.mainPass.baseTex = this.staticTextures[this.currentStaticFrame];
        this.startStaticAnimation();
    }

    /**
     * Display a live feed image on the display
     * @param data Image data to display
     */
    public showLiveFeed(data: Uint8Array): void {
        this.stopStaticAnimation();
        this.isStatic = false;
        
        const texture = ProceduralTextureProvider.create(512, 512, Colorspace.RGBA);
        (texture.control as ProceduralTextureProvider).setPixels(0, 0, 512, 512, data);
        this.image.mainPass.baseTex = texture;
    }

    /**
     * Start animating the static texture
     */
    private startStaticAnimation(): void {
        this.stopStaticAnimation();
        
        this.staticAnimationToken = FunctionTimingUtils.setTimeout(() => {
            if (this.isStatic) {
                // Cycle through precomputed static frames
                this.currentStaticFrame = (this.currentStaticFrame + 1) % SimulationImageController.STATIC_FRAME_COUNT;
                this.image.mainPass.baseTex = this.staticTextures[this.currentStaticFrame];
                this.startStaticAnimation();
            }
        }, SimulationImageController.STATIC_REFRESH_RATE);
    }

    /**
     * Stop the static animation
     */
    private stopStaticAnimation(): void {
        if (this.staticAnimationToken !== null) {
            FunctionTimingUtils.clearTimeout(this.staticAnimationToken);
            this.staticAnimationToken = null;
        }
    }

    /**
     * Clean up resources
     */
    public dispose(): void {
        this.stopStaticAnimation();
        this.staticTextures = [];
    }
}