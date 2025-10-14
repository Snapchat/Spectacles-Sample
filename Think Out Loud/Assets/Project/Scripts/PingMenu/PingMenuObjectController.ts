import { PingMenuReferences } from "../PingMenu/PingMenuReferences";
import { PingMenu } from "./PingMenu";

/**
 * Controller for the ping menu UI that appears when a user receives a ping request.
 * Handles accept/reject button interactions and communicates with the main ping system.
 */
@component
export class PingMenuObjectController extends BaseScriptComponent {
    
    @input
    @hint("Reference to the ping menu UI components")
    pingMenuReferences: PingMenuReferences;
    
    @input
    @hint("Time in seconds before ping request auto-expires")
    autoExpireTime: number = 15;
    
    private pingData: any = null;
    private pingMenu: PingMenu = null;
    private expireTimer: DelayedCallbackEvent = null;
    
    onAwake() {
        this.createEvent("OnStartEvent").bind(() => this.onStart());
    }
    
    onStart() {
        if (!this.pingMenuReferences) {
            print("❌ PingMenuObjectController: No ping menu references assigned");
            return;
        }
        
        this.setupButtonHandlers();
    }
    
    private setupButtonHandlers() {
        // Connect accept button
        if (this.pingMenuReferences.acceptButton) {
            this.pingMenuReferences.acceptButton.onTriggerUp.add(() => {
                this.onAcceptButtonPressed();
            });
            
            print("✅ PingMenuObjectController: Connected accept button");
        }
        
        // Connect reject button
        if (this.pingMenuReferences.rejectButton) {
            this.pingMenuReferences.rejectButton.onTriggerUp.add(() => {
                this.onRejectButtonPressed();
            });
            
            print("❌ PingMenuObjectController: Connected reject button");
        }
    }
    
    /**
     * Called by PingMenu to set up this ping menu with request data
     */
    public setupPingRequest(pingData: any, pingMenu: PingMenu) {
        print(`🎯 PingMenuObjectController: setupPingRequest called`);
        print(`🔍 PingMenuObjectController: pingData: ${pingData ? 'RECEIVED' : 'NULL'}`);
        print(`🔍 PingMenuObjectController: pingMenu: ${pingMenu ? 'RECEIVED' : 'NULL'}`);
        
        this.pingData = pingData;
        this.pingMenu = pingMenu;
        
        print(`📨 PingMenuObjectController: Setting up ping request from user ${pingData.from}`);
        
        // Update UI to show who is pinging
        this.updateUIForPingRequest();
        
        // Start auto-expire timer
        this.startAutoExpireTimer();
    }
    
    private updateUIForPingRequest() {
        // Update text if there's a text component showing the pinger's name
        if (this.pingMenuReferences.pingerNameText && this.pingData) {
            // Try to get a more user-friendly name if possible
            const pingerName = this.getPingerDisplayName();
            this.pingMenuReferences.pingerNameText.text = `${pingerName} wants to connect`;
        }
        
        // Update any other UI elements as needed
        print(`🎨 PingMenuObjectController: Updated UI for ping from ${this.pingData.from}`);
    }
    
    private getPingerDisplayName(): string {
        // Try to get display name from ping data, fallback to user ID
        if (this.pingData && this.pingData.from) {
            // If pingData contains displayName, use it; otherwise use the ID
            return this.pingData.displayName || this.pingData.from || "Unknown User";
        }
        return "Unknown User";
    }
    
    private startAutoExpireTimer() {
        if (this.expireTimer) {
            this.expireTimer.reset(this.autoExpireTime);
        } else {
            this.expireTimer = this.createEvent("DelayedCallbackEvent");
            this.expireTimer.bind(() => {
                this.onAutoExpire();
            });
            this.expireTimer.reset(this.autoExpireTime);
        }
        
        print(`⏰ PingMenuObjectController: Auto-expire timer set for ${this.autoExpireTime} seconds`);
    }
    
    private onAutoExpire() {
        print("⏰ PingMenuObjectController: Ping request auto-expired");
        
        // Auto-reject the ping
        this.handlePingResponse(false);
    }
    
    private onAcceptButtonPressed() {
        print("✅ PingMenuObjectController: Accept button pressed");
        
        this.handlePingResponse(true);
    }
    
    private onRejectButtonPressed() {
        print("❌ PingMenuObjectController: Reject button pressed");
        
        this.handlePingResponse(false);
    }
    
    private handlePingResponse(accepted: boolean) {
        print(`🔍 PingMenuObjectController: handlePingResponse called with accepted: ${accepted}`);
        print(`🔍 PingMenuObjectController: pingMenu is ${this.pingMenu ? 'ASSIGNED' : 'NULL'}`);
        print(`🔍 PingMenuObjectController: pingData is ${this.pingData ? 'ASSIGNED' : 'NULL'}`);
        
        // Cancel auto-expire timer
        if (this.expireTimer) {
            this.expireTimer.cancel();
            this.expireTimer = null;
        }
        
        // Send response through ping system
        if (this.pingMenu && this.pingData) {
            print(`🎯 PingMenuObjectController: Calling respondToPing on pingMenu`);
            this.pingMenu.respondToPing(this.pingData, accepted);
        } else {
            print(`❌ PingMenuObjectController: Cannot call respondToPing - pingMenu: ${this.pingMenu ? 'OK' : 'NULL'}, pingData: ${this.pingData ? 'OK' : 'NULL'}`);
        }
        
        // Provide user feedback
        this.showResponseFeedback(accepted);
        
        // Close this menu (will be handled by ping system controller)
        print(`📨 PingMenuObjectController: Ping ${accepted ? "accepted" : "rejected"}`);
    }
    
    private showResponseFeedback(accepted: boolean) {
        // You could add visual/audio feedback here
        const feedbackMessage = accepted ? "Connection established!" : "Ping declined";
        print(`💫 PingMenuObjectController: ${feedbackMessage}`);
        
        // Visual feedback could be added here if needed
        // For now, we rely on the text feedback and the main ping material system
    }
    
    /**
     * Called externally to force close this ping menu
     */
    public closePingMenu() {
        // Cancel any active timers
        if (this.expireTimer) {
            this.expireTimer.cancel();
            this.expireTimer = null;
        }
        
        // Destroy the scene object
        this.sceneObject.destroy();
        
        print("🗑️ PingMenuObjectController: Ping menu closed");
    }
}