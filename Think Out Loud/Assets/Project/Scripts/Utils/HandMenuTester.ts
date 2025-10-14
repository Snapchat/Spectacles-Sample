import { HandMenu } from "../HandMenu/HandMenu";
import { PingMenu } from "../PingMenu/PingMenu";

/**
 * Simple testing script to invoke the hand menu via tap event
 * This allows testing the hand menu functionality without hand tracking
 */
@component
export class HandMenuTester extends BaseScriptComponent {
    @input
    @hint("Reference to the HandMenu component to activate")
    handMenu: HandMenu;

    @input
    @hint("Enable tap to show hand menu (for testing)")
    enableTapToShow: boolean = true;

    @input
    @hint("Enable tap to exit ping connections (for testing)")
    enableTapToExitPing: boolean = false;

    @input
    @hint("Reference to the PingMenu component for exit ping testing")
    pingMenu: PingMenu;

    onAwake() {
        this.createEvent("OnStartEvent").bind(() => this.onStart());
    }

    onStart() {
        if (!this.enableTapToShow && !this.enableTapToExitPing) {
            print("🧪 HandMenuTester: All tap testing disabled");
            return;
        }

        if (this.enableTapToShow && !this.handMenu) {
            print("❌ HandMenuTester: No HandMenu component assigned for tap to show");
            return;
        }

        if (this.enableTapToExitPing && !this.pingMenu) {
            print("❌ HandMenuTester: No PingMenu component assigned for tap to exit ping");
            return;
        }

        // Set up tap event
        this.createEvent("TapEvent").bind((eventData) => {
            this.onTapEvent(eventData);
        });

        if (this.enableTapToShow) {
            print("✅ HandMenuTester: Tap to show/hide hand menu enabled");
        }

        if (this.enableTapToExitPing) {
            print("✅ HandMenuTester: Tap to exit ping connections enabled");
        }

        print("💡 HandMenuTester: Tap anywhere on screen to trigger enabled actions");
    }

    private onTapEvent(eventData: any) {
        // Handle exit ping action first (if enabled)
        if (this.enableTapToExitPing && this.pingMenu) {
            this.exitAllPingConnections();
        }

        // Handle hand menu toggle (if enabled)
        if (this.enableTapToShow && this.handMenu) {
            this.toggleHandMenuVisibility();
        }

        // Provide visual feedback in console
        print("🎯 HandMenuTester: Tap detected - executed enabled actions");
    }

    private toggleHandMenuVisibility() {
        if (!this.handMenu) {
            return;
        }

        const isCurrentlyEnabled = this.handMenu.sceneObject.enabled;

        if (isCurrentlyEnabled) {
            // Hide the menu
            this.handMenu.sceneObject.enabled = false;
            print("🧪 HandMenuTester: Hand menu hidden via tap");
        } else {
            // Show the menu
            this.handMenu.sceneObject.enabled = true;
            print("🧪 HandMenuTester: Hand menu shown via tap");
        }
    }

    private exitAllPingConnections() {
        if (!this.pingMenu) {
            return;
        }

        const activeConnections = this.pingMenu.getActivePingConnections();

        if (activeConnections.length === 0) {
            print("🧪 HandMenuTester: No active ping connections to exit");
            return;
        }

        // Exit all active connections (same logic as HandMenuController)
        activeConnections.forEach(userId => {
            this.pingMenu.exitPingConnection(userId);
        });

        print(`🧪 HandMenuTester: Exited ${activeConnections.length} ping connection(s) via tap`);
    }

    /**
     * Public method to manually show the hand menu
     */
    public showHandMenu() {
        if (this.handMenu) {
            this.handMenu.sceneObject.enabled = true;
            print("🧪 HandMenuTester: Hand menu shown via script call");
        }
    }

    /**
     * Public method to manually hide the hand menu
     */
    public hideHandMenu() {
        if (this.handMenu) {
            this.handMenu.sceneObject.enabled = false;
            print("🧪 HandMenuTester: Hand menu hidden via script call");
        }
    }

    /**
     * Toggle the hand menu state
     */
    public toggleHandMenu() {
        if (this.handMenu) {
            const isCurrentlyEnabled = this.handMenu.sceneObject.enabled;
            this.handMenu.sceneObject.enabled = !isCurrentlyEnabled;
            print(`🧪 HandMenuTester: Hand menu ${!isCurrentlyEnabled ? 'shown' : 'hidden'} via toggle`);
        }
    }
}