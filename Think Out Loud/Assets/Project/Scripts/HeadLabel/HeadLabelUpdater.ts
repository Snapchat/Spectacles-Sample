import { HeadLabelObjectManager } from "./HeadLabelObjectManager";

/**
 * Bridge that connects local hand menu UI to synced head label data.
 * Provides a clean interface for hand menu to update the local player's head label,
 * which then syncs across all players via StorageProperties.
 */
@component
export class HeadLabelUpdater extends BaseScriptComponent {
    
    @input
    @hint("Reference to the head label object manager")
    headLabelObjectManager: HeadLabelObjectManager;
    
    // Singleton pattern for global access
    private static instance: HeadLabelUpdater;
    
    onAwake() {
        // Set up singleton
        if (HeadLabelUpdater.instance) {
            print("⚠️ HeadLabelUpdater: Multiple instances detected! Using first instance.");
            return;
        }
        
        HeadLabelUpdater.instance = this;
        this.createEvent("OnStartEvent").bind(() => this.onStart());
    }
    
    onStart() {
        print("✅ HeadLabelUpdater: Initialized successfully");
        
        // Validate required component
        if (!this.headLabelObjectManager) {
            print("❌ HeadLabelUpdater: Missing HeadLabelObjectManager reference");
        } else {
            print("✅ HeadLabelUpdater: HeadLabelObjectManager connected");
        }
    }
    
    /**
     * Get the singleton instance of HeadLabelUpdater
     */
    public static getInstance(): HeadLabelUpdater | null {
        return HeadLabelUpdater.instance || null;
    }
    
    /**
     * Update the local player's head label status (called from hand menu)
     */
    public updateMyHeadLabelStatus(statusText: string, subStatus: string) {
        if (!this.headLabelObjectManager) {
            print("❌ HeadLabelUpdater: Cannot update status - HeadLabelObjectManager not available");
            return;
        }
        
        print(`📝 HeadLabelUpdater: Updating local player status - "${statusText}" / "${subStatus}"`);
        this.headLabelObjectManager.updateMyStatus(statusText, subStatus);
    }
    
    /**
     * Update the local player's availability state (called from hand menu)
     */
    public updateMyHeadLabelAvailability(availabilityState: number) {
        if (!this.headLabelObjectManager) {
            print("❌ HeadLabelUpdater: Cannot update availability - HeadLabelObjectManager not available");
            return;
        }
        
        print(`📝 HeadLabelUpdater: Updating local player availability to ${availabilityState}`);
        this.headLabelObjectManager.updateMyAvailability(availabilityState);
    }
    
    /**
     * Get the local player's current head label data
     */
    public getMyHeadLabelData(): {statusText: string, subStatus: string, availability: number} | null {
        if (!this.headLabelObjectManager) {
            return null;
        }
        
        const myHeadLabel = this.headLabelObjectManager.getMyHeadLabel();
        if (!myHeadLabel) {
            return null;
        }
        
        return {
            statusText: myHeadLabel.getStatusText(),
            subStatus: myHeadLabel.getSubStatusText(),
            availability: myHeadLabel.getAvailability()
        };
    }
    
    /**
     * Register a callback for when the local head label is ready
     */
    public onMyHeadLabelReady(callback: () => void) {
        if (!this.headLabelObjectManager) {
            print("❌ HeadLabelUpdater: Cannot register callback - HeadLabelObjectManager not available");
            return;
        }
        
        this.headLabelObjectManager.subscribeToHeadLabelReady(() => {
            print("✅ HeadLabelUpdater: Local head label is ready");
            callback();
        });
    }
    
    /**
     * Check if head label system is ready
     */
    public isHeadLabelSystemReady(): boolean {
        return this.headLabelObjectManager !== null && 
               this.headLabelObjectManager.getMyHeadLabel() !== null;
    }
    
    /**
     * Get head label manager for advanced use cases
     */
    public getHeadLabelManager(): HeadLabelObjectManager | null {
        return this.headLabelObjectManager;
    }
}