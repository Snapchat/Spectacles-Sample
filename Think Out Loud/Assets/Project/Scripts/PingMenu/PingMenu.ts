import { SessionController } from "SpectaclesSyncKit.lspkg/Core/SessionController";
import { SyncEntity } from "SpectaclesSyncKit.lspkg/Core/SyncEntity";
import { HeadLabelObjectManager } from "../HeadLabel/HeadLabelObjectManager";
import { HeadLabelObjectController } from "../HeadLabel/HeadLabelObjectController";
import { PingMenuObjectController } from "./PingMenuObjectController";
import WorldCameraFinderProvider from "SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider";

/**
 * Main controller for the ping system.
 * Handles network events and ping state management via ContainerFrame interactions.
 */
@component
export class PingMenu extends BaseScriptComponent {
    
    @input
    @hint("Reference to the head label manager to get all user head labels")
    headLabelManager: HeadLabelObjectManager;
    
    @input
    @hint("PingMenu prefab to instantiate when receiving ping requests")
    pingMenuPrefab: ObjectPrefab;
    
    @input
    @hint("Audio component to play when sending a ping")
    pingSendAudio: AudioComponent;
    
    @input
    @hint("Prefer UserId over ConnectionId for targeting. Enable for same user across devices, disable for device-specific targeting")
    preferUserId: boolean = false;
    
    
    // SyncEntity for networked events
    private syncEntity: SyncEntity;
    
    // Active ping menu instance
    private activePingMenu: SceneObject | null = null;
    private pingMenuAutoCloseEvent: DelayedCallbackEvent | null = null;
    
    // Ping state tracking
    private sentPings: Map<string, number> = new Map(); // userId -> timestamp
    private receivedPings: Map<string, number> = new Map(); // userId -> timestamp
    private activePingConnections: Set<string> = new Set(); // Connected user IDs
    
    
    onAwake() {
        this.createEvent("OnStartEvent").bind(() => this.onStart());
        this.createEvent("UpdateEvent").bind(() => this.onUpdate());
    }
    
    onStart() {
        print("🎯 PingMenu: Initializing ping system...");
        
        // Wait for session and head label manager to be ready
        this.initializeSystem();
    }
    
    onUpdate() {
        // No longer needed for raycast visualization
    }
    
    private initializeSystem() {
        SessionController.getInstance().notifyOnReady(() => {
            print("📡 PingMenu: Session ready, setting up ping events...");
            this.setupPingEvents();
        });
    }
    
    private setupPingEvents() {
        // Create a SyncEntity for ping events - unowned so anyone can send pings
        this.syncEntity = new SyncEntity(this, null, false, "Session");
        
        // Wait for SyncEntity to be ready before setting up events
        this.syncEntity.notifyOnReady(() => {
            // Set up event listeners for ping events
            this.syncEntity.onEventReceived.add('ping_request', (messageInfo) => {
                this.handlePingRequest(messageInfo);
            });
            
            this.syncEntity.onEventReceived.add('ping_response', (messageInfo) => {
                this.handlePingResponse(messageInfo);
            });
            
            this.syncEntity.onEventReceived.add('ping_connection_update', (messageInfo) => {
                this.handlePingConnectionUpdate(messageInfo);
            });
            
            print("✅ PingMenu: Ping events system initialized and ready");
        });
    }
    
    
    
    private sendPingToUser(targetHeadLabel: HeadLabelObjectController) {
        if (targetHeadLabel.isLocalLabel()) {
            print("🎯 PingMenu: Cannot ping yourself");
            return;
        }
        
        if (!this.syncEntity || !this.syncEntity.isSetupFinished) {
            print("❌ PingMenu: Sync entity not ready");
            return;
        }
        
        // Get target user info directly from the head label that was interacted with
        const targetUserInfo = targetHeadLabel.getUserInfo();
        const myUserInfo = SessionController.getInstance().getLocalUserInfo();
        const myUserId = myUserInfo?.connectionId || myUserInfo?.userId || "unknown";
        
        print(`🔍 PingMenu: Target head label user info:`);
        if (targetUserInfo) {
            print(`  DisplayName: ${targetUserInfo.displayName || "N/A"}`);
            print(`  ConnectionId: ${targetUserInfo.connectionId || "N/A"}`);
            print(`  UserId: ${targetUserInfo.userId || "N/A"}`);
        } else {
            print(`  No user info available`);
        }
        
        if (!targetUserInfo) {
            print("❌ PingMenu: No target user info available from head label");
            return;
        }
        
        // Use configured preference for targeting
        const targetUserId = this.preferUserId ? 
            (targetUserInfo.userId || targetUserInfo.connectionId) : 
            (targetUserInfo.connectionId || targetUserInfo.userId);
        
        print(`🔧 PingMenu: Using ${this.preferUserId ? 'UserId' : 'ConnectionId'} preference for targeting`);
        
        print(`🔍 PingMenu: Target ID: '${targetUserId}', My ID: '${myUserId}'`);
        
        if (!targetUserId) {
            print("❌ PingMenu: Could not determine target user ID");
            return;
        }
        
        // Check for duplicate pings (cooldown)
        const lastPingTime = this.sentPings.get(targetUserId) || 0;
        const currentTime = Date.now();
        if (currentTime - lastPingTime < 3000) { // 3 second cooldown
            print("⏰ PingMenu: Ping cooldown active");
            return;
        }
        
        // Create ping data
        const pingData = {
            to: targetUserId,
            timestamp: currentTime
        };
        
        // Send ping via networked event
        this.syncEntity.sendEvent('ping_request', pingData);
        
        // Track sent ping
        this.sentPings.set(targetUserId, currentTime);
        
        print(`📤 PingMenu: Sent ping to user ${targetUserId}`);
    }
    
    
    private handlePingRequest(messageInfo: any) {
        const myUserInfo = SessionController.getInstance().getLocalUserInfo();
        // Use configured preference for consistency with sending logic
        const myUserId = this.preferUserId ? 
            (myUserInfo?.userId || myUserInfo?.connectionId || "unknown") : 
            (myUserInfo?.connectionId || myUserInfo?.userId || "unknown");
        const pingData = messageInfo.data;
        
        print(`🔍 PingMenu: Checking ping target - My ID: '${myUserId}', Ping To: '${pingData.to}'`);
        print(`🔍 PingMenu: My ConnectionId: '${myUserInfo?.connectionId}', My UserId: '${myUserInfo?.userId}'`);
        
        // Check if this ping is for me
        if (pingData.to !== myUserId) {
            print(`⚠️ PingMenu: Ping not for me - ignoring`);
            return;
        }
        
        print(`📨 PingMenu: Received ping request from ${messageInfo.senderUserId}`);
        
        // Track received ping
        this.receivedPings.set(messageInfo.senderUserId, pingData.timestamp);
        
        // Get sender's display name from session
        const allUsers = SessionController.getInstance().getUsers();
        const senderUserInfo = allUsers.find(user => 
            user.userId === messageInfo.senderUserId || user.connectionId === messageInfo.senderUserId
        );
        const senderDisplayName = senderUserInfo?.displayName || messageInfo.senderUserId;
        
        // Create ping data with sender info for the menu
        const pingRequestData = {
            from: messageInfo.senderUserId,
            displayName: senderDisplayName,
            to: pingData.to,
            timestamp: pingData.timestamp
        };
        
        // Show ping menu
        this.showPingMenu(pingRequestData);
    }
    
    private handlePingResponse(messageInfo: any) {
        const myUserInfo = SessionController.getInstance().getLocalUserInfo();
        // Use configured preference for consistency with sending logic
        const myUserId = this.preferUserId ? 
            (myUserInfo?.userId || myUserInfo?.connectionId || "unknown") : 
            (myUserInfo?.connectionId || myUserInfo?.userId || "unknown");
        const responseData = messageInfo.data;
        
        // Check if this response is for me
        if (responseData.to !== myUserId) {
            return;
        }
        
        print(`📨 PingMenu: Received ping response from ${messageInfo.senderUserId}: ${responseData.accepted ? "ACCEPTED" : "REJECTED"}`);
        
        if (responseData.accepted) {
            // Add to active connections - visual updates handled by ping_connection_update event
            this.activePingConnections.add(messageInfo.senderUserId);
            
            print(`✅ PingMenu: Ping connection established with ${messageInfo.senderUserId}`);
        } else {
            print(`❌ PingMenu: Ping rejected by ${messageInfo.senderUserId}`);
        }
    }
    
    private handlePingConnectionUpdate(messageInfo: any) {
        const connectionData = messageInfo.data;
        
        print(`🔗 PingMenu: Received connection update: ${connectionData.userA} <-> ${connectionData.userB}, connected: ${connectionData.connected}`);
        
        if (connectionData.connected) {
            print(`✅ PingMenu: Processing CONNECT event for users`);
        } else {
            print(`❌ PingMenu: Processing DISCONNECT event for users`);
        }
        
        // Update visual feedback for both users for ALL session participants
        this.updatePingConnectionVisual(connectionData.userA, connectionData.connected);
        this.updatePingConnectionVisual(connectionData.userB, connectionData.connected);
        
        // Update my own visual if I'm one of the connected users
        const myUserInfo = SessionController.getInstance().getLocalUserInfo();
        const myUserId = this.preferUserId ? 
            (myUserInfo?.userId || myUserInfo?.connectionId || "unknown") : 
            (myUserInfo?.connectionId || myUserInfo?.userId || "unknown");
            
        if (connectionData.userA === myUserId || connectionData.userB === myUserId) {
            this.updateMyPingConnectionVisual(connectionData.connected);
            
            // Update local active connections tracking
            const otherUserId = connectionData.userA === myUserId ? connectionData.userB : connectionData.userA;
            if (connectionData.connected) {
                this.activePingConnections.add(otherUserId);
            } else {
                this.activePingConnections.delete(otherUserId);
            }
        }
    }
    
    private showPingMenu(pingData: any) {
        if (this.activePingMenu) {
            // Destroy existing ping menu
            this.activePingMenu.destroy();
        }
        
        if (!this.pingMenuPrefab) {
            print("❌ PingMenu: No ping menu prefab assigned");
            return;
        }
        
        // Instantiate ping menu
        this.activePingMenu = this.pingMenuPrefab.instantiate(null);
        
        // Position ping menu in front of user like hand menu
        const headPos = this.getHeadPosition();
        const cameraTransform = WorldCameraFinderProvider.getInstance().getTransform();
        const forward = cameraTransform.forward;
        
        // Position menu using hand menu-style offset calculation
        const headRotation = cameraTransform.getWorldRotation();
        const flattenedForward = this.normalizeVector(new vec3(forward.x, 0, forward.z));
        const offset = new vec3(0, -5, -55); // X: 0cm, Y: -5cm down, Z: 55cm forward
        
        const targetPosition = new vec3(
            headPos.x + flattenedForward.x * offset.z,
            headPos.y + offset.y,
            headPos.z + flattenedForward.z * offset.z
        );
        
        this.activePingMenu.getTransform().setWorldPosition(targetPosition);
        
        
        // Make menu face the user by looking at camera position
        const cameraPosition = cameraTransform.getWorldPosition();
        const menuToCamera = cameraPosition.sub(targetPosition).normalize();
        const lookAtRotation = quat.lookAt(menuToCamera, new vec3(0, 1, 0));
        this.activePingMenu.getTransform().setWorldRotation(lookAtRotation);
        
        print(`📍 PingMenu: Positioned at ${targetPosition.x.toFixed(1)}, ${targetPosition.y.toFixed(1)}, ${targetPosition.z.toFixed(1)}`);
        
        // Get ping menu controller and set it up - try different approaches
        print(`🔍 PingMenu: Looking for PingMenuObjectController on instantiated prefab`);
        
        // Try approach 1: Use getTypeName()
        let pingMenuController = this.activePingMenu.getComponent(PingMenuObjectController.getTypeName()) as PingMenuObjectController;
        
        // Try approach 2: Use Component.ScriptComponent if first approach fails
        if (!pingMenuController) {
            print(`🔍 PingMenu: getTypeName() failed, trying Component.ScriptComponent`);
            pingMenuController = this.activePingMenu.getComponent("Component.ScriptComponent") as PingMenuObjectController;
        }
        
        // Try approach 3: Search in child objects
        if (!pingMenuController) {
            print(`🔍 PingMenu: Searching child objects for PingMenuObjectController`);
            for (let i = 0; i < this.activePingMenu.getChildrenCount(); i++) {
                const child = this.activePingMenu.getChild(i);
                pingMenuController = child.getComponent(PingMenuObjectController.getTypeName()) as PingMenuObjectController;
                if (pingMenuController) {
                    print(`🎯 PingMenu: Found PingMenuObjectController on child ${i}`);
                    break;
                }
            }
        }
        
        if (pingMenuController && pingMenuController.setupPingRequest) {
            print(`🎯 PingMenu: Found PingMenuObjectController, calling setupPingRequest`);
            pingMenuController.setupPingRequest(pingData, this);
        } else {
            print(`❌ PingMenu: Could not find PingMenuObjectController on ping menu prefab or children`);
            print(`❌ PingMenu: pingMenuController: ${pingMenuController ? 'FOUND' : 'NULL'}`);
            if (pingMenuController) {
                print(`❌ PingMenu: setupPingRequest method: ${pingMenuController.setupPingRequest ? 'EXISTS' : 'MISSING'}`);
            }
        }
        
        // Set up auto-close timer (10 seconds)
        this.setupAutoCloseTimer();
        
        print("📱 PingMenu: Ping menu displayed with 10s auto-close timer");
    }
    
    private getHeadPosition(): vec3 {
        // Use camera position as head position
        const cameraProvider = WorldCameraFinderProvider.getInstance();
        return cameraProvider.getTransform().getWorldPosition();
    }
    
    private setupAutoCloseTimer() {
        // Cancel any existing timer
        if (this.pingMenuAutoCloseEvent) {
            this.pingMenuAutoCloseEvent.enabled = false;
        }
        
        // Create new auto-close timer (10 seconds)
        this.pingMenuAutoCloseEvent = this.createEvent("DelayedCallbackEvent");
        this.pingMenuAutoCloseEvent.bind(() => {
            print("⏰ PingMenu: Auto-closing ping menu after 10 seconds");
            this.closePingMenu();
        });
        this.pingMenuAutoCloseEvent.reset(10.0); // 10 seconds
    }
    
    private closePingMenu() {
        if (this.activePingMenu) {
            this.activePingMenu.destroy();
            this.activePingMenu = null;
        }
        
        // Cancel auto-close timer
        if (this.pingMenuAutoCloseEvent) {
            this.pingMenuAutoCloseEvent.enabled = false;
            this.pingMenuAutoCloseEvent = null;
        }
    }
    
    
    private updatePingConnectionVisual(userId: string, isConnected: boolean) {
        print(`🔍 PingMenu: updatePingConnectionVisual called for userId: ${userId}, isConnected: ${isConnected}`);
        
        // Find the head label for this user
        const allRemoteHeadLabels = this.headLabelManager.getAllRemoteHeadLabels();
        print(`🔍 PingMenu: Found ${allRemoteHeadLabels.length} remote head labels`);
        
        for (const headLabel of allRemoteHeadLabels) {
            const userInfo = headLabel.getUserInfo();
            const headLabelUserId = this.preferUserId ? 
                (userInfo?.userId || userInfo?.connectionId) : 
                (userInfo?.connectionId || userInfo?.userId);
            
            print(`🔍 PingMenu: Checking head label with userId: ${headLabelUserId}`);
            
            if (headLabelUserId === userId) {
                print(`🎯 PingMenu: Found matching head label, calling updatePingVisual`);
                // Update the head label visual state to show ping connection
                headLabel.updatePingVisual(isConnected);
                print(`🎨 PingMenu: Updated ping visual for user ${userId}`);
                break;
            }
        }
        print(`🔍 PingMenu: updatePingConnectionVisual completed`);
    }
    
    /**
     * Update the local user's head label ping visual
     */
    private updateMyPingConnectionVisual(isConnected: boolean) {
        print(`🔍 PingMenu: updateMyPingConnectionVisual called, isConnected: ${isConnected}`);
        
        const myHeadLabel = this.headLabelManager.getMyHeadLabel();
        if (myHeadLabel) {
            print(`🎯 PingMenu: Found my head label, calling updatePingVisual`);
            myHeadLabel.updatePingVisual(isConnected);
            print(`🎨 PingMenu: Updated my own ping visual - connected: ${isConnected}`);
        } else {
            print(`⚠️ PingMenu: Could not update my ping visual - local head label not available`);
        }
    }
    
    
    /**
     * Public method called by PingMenuObjectController when user responds to ping
     */
    public respondToPing(pingData: any, accepted: boolean) {
        print(`🔍 PingMenu: respondToPing called with accepted: ${accepted}`);
        
        if (!this.syncEntity || !this.syncEntity.isSetupFinished) {
            print("❌ PingMenu: Cannot respond - sync entity not ready");
            return;
        }
        
        const myUserInfo = SessionController.getInstance().getLocalUserInfo();
        // Use configured preference for consistency
        const myUserId = this.preferUserId ? 
            (myUserInfo?.userId || myUserInfo?.connectionId || "unknown") : 
            (myUserInfo?.connectionId || myUserInfo?.userId || "unknown");
        
        // Create response data
        const responseData = {
            to: pingData.from,
            timestamp: Date.now(),
            accepted: accepted,
            originalPingTimestamp: pingData.timestamp
        };
        
        // Send response
        this.syncEntity.sendEvent('ping_response', responseData);
        
        if (accepted) {
            // Add to active connections
            this.activePingConnections.add(pingData.from);
            
            // Send connection established event to ALL users in session
            const connectionData = {
                userA: pingData.from,
                userB: myUserId,
                connected: true,
                timestamp: Date.now()
            };
            this.syncEntity.sendEvent('ping_connection_update', connectionData);
            
            print(`🔗 PingMenu: Sent connection update to all users: ${pingData.from} <-> ${myUserId}`);
        }
        
        // Close ping menu
        this.closePingMenu();
        
        print(`📤 PingMenu: Responded to ping: ${accepted ? "ACCEPTED" : "REJECTED"}`);
    }
    
    /**
     * Public method to exit an active ping connection
     */
    public exitPingConnection(userId: string) {
        this.activePingConnections.delete(userId);
        
        // Get my user ID for the disconnect event
        const myUserInfo = SessionController.getInstance().getLocalUserInfo();
        const myId = this.preferUserId ? 
            (myUserInfo?.userId || myUserInfo?.connectionId || "unknown") : 
            (myUserInfo?.connectionId || myUserInfo?.userId || "unknown");
        
        // Send disconnection event to ALL users in session
        const disconnectionData = {
            userA: userId,
            userB: myId,
            connected: false,
            timestamp: Date.now()
        };
        this.syncEntity.sendEvent('ping_connection_update', disconnectionData);
        
        print(`🚪 PingMenu: Exited ping connection with ${userId} and sent disconnect to all users`);
    }
    
    /**
     * Get all active ping connections
     */
    public getActivePingConnections(): string[] {
        return Array.from(this.activePingConnections);
    }
    
    /**
     * Check if connected to a specific user
     */
    public isConnectedToUser(userId: string): boolean {
        return this.activePingConnections.has(userId);
    }
    
    /**
     * Normalize a vector to unit length (from HandMenu)
     */
    private normalizeVector(v: vec3): vec3 {
        const length = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);

        if (length < 0.0001) {
            return new vec3(0, 0, 0);
        }

        return new vec3(
            v.x / length,
            v.y / length,
            v.z / length
        );
    }
    
    /**
     * Public method called by HeadLabelObjectController when ContainerFrame is triggered
     */
    public sendPingFromInteraction(targetHeadLabel: HeadLabelObjectController, interactorName: string) {
        print(`🎯 PingMenu: Ping triggered via interaction from ${interactorName}`);
        
        // Play ping send audio
        if (this.pingSendAudio) {
            this.pingSendAudio.play(1);
        }
        
        this.sendPingToUser(targetHeadLabel);
    }
}