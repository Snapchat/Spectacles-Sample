import { SnapCloudRequirements } from '../SnapCloudRequirements';
import { RectangleButton } from 'SpectaclesUIKit.lspkg/Scripts/Components/Button/RectangleButton';

import {
  RealtimeChannel,
  SupabaseClient,
  createClient,
} from "SupabaseClient.lspkg/supabase-snapcloud";

@component
export class RealtimeCursor extends BaseScriptComponent {

  // Supabase Configuration
  @input
  @hint("Reference to SnapCloudRequirements for centralized Supabase configuration")
  public snapCloudRequirements: SnapCloudRequirements;

  @input
  @hint("Channel name for cursor synchronization")
  public channelName: string = "[Insert your channel name]";

  // Mode Toggle Button
  @input
  @allowUndefined
  @hint("RectangleButton to toggle between broadcast and follow modes (from Spectacles UI Kit)")
  public toggleModeButton: RectangleButton;

  // Cursor Object
  @input
  @hint("The cursor object to track (broadcast) or move (follow)")
  public cursorObject: SceneObject;

  // Status Display
  @input
  @hint("Text component to display current mode")
  public modeText: Text;

  @input
  @hint("Text component to display detailed status and logs")
  public statusText: SceneObject;

  // Broadcasting Configuration
  @input
  @hint("Broadcast interval in seconds (when in broadcast mode)")
  @widget(new SliderWidget(0.05, 1.0, 0.05))
  public broadcastInterval: number = 0.1;

  // Following Configuration
  @input
  @hint("Movement speed/smoothing factor (when in follow mode)")
  @widget(new SliderWidget(0.05, 1.0, 0.1))
  public movementSpeed: number = 0.15;

  @input
  @hint("Movement scale factor (when in follow mode)")
  @widget(new SliderWidget(0.1, 50, 0.1))
  public movementScale: number = 1.5;

  @input
  @hint("Z position for cursor (when in follow mode) - negative is away from camera")
  @widget(new SliderWidget(-200, 10.0, 1))
  public cursorZPosition: number = -100;

  @input
  @hint("Height offset for the cursor object (when in follow mode)")
  @widget(new SliderWidget(-2.0, 2.0, 0.1))
  public heightOffset: number = 0.0;

  // Coordinate Mapping Parameters
  @input
  @hint("Lens Studio X coordinate range (from -lsXRange to +lsXRange)")
  @widget(new SliderWidget(10, 200, 1))
  public lsXRange: number = 50;

  @input
  @hint("Lens Studio Y coordinate range (from -lsYRange to +lsYRange)")
  @widget(new SliderWidget(10, 200, 1))
  public lsYRange: number = 30;

  @input
  @hint("Scale factor for coordinate conversion (broadcast mode)")
  @widget(new SliderWidget(0.1, 50.0, 0.1))
  public coordinateScale: number = 10.0;

  @input
  @hint("Perspective scaling factor (broadcast mode)")
  @widget(new SliderWidget(0.1, 20.0, 0.1))
  public perspectiveScale: number = 10.0;

  @input
  @hint("Invert X axis mapping")
  public invertX: boolean = false;

  @input
  @hint("Invert Y axis mapping")
  public invertY: boolean = false;

  // Debug
  @input
  @hint("Show debug information in console")
  public enableDebugLogs: boolean = true;

  @input
  @hint("Show coordinate values in every broadcast log")
  public verboseLogging: boolean = false;

  @input
  @hint("Log broadcast frequency (every N broadcasts)")
  @widget(new SliderWidget(1, 100, 1))
  public logFrequency: number = 10;

  // Private variables
  private client: SupabaseClient;
  private realtimeChannel: RealtimeChannel;
  private isInitialized: boolean = false;
  private userId: string;
  private userColor: string = "#4ECDC4";
  
  // Mode management - DEFAULT IS BROADCAST
  private isBroadcastMode: boolean = true; // true = broadcast, false = follow
  
  // Broadcast mode variables
  private lastBroadcastTime: number = 0;
  private broadcastTimer: any;
  private broadcastCount: number = 0;
  
  // Follow mode variables
  private targetPosition: vec3 = vec3.zero();
  private currentPosition: vec3 = vec3.zero();
  private lastCursorUpdate: number = 0;
  private cameraTransform: Transform;
  
  // Status
  private statusMessages: string[] = [];
  private maxStatusLines: number = 8;

  onAwake() {
    this.log("RealtimeCursor (Unified WebSocket) awakening...");
    
    // Initialize cursor position
    if (this.cursorObject) {
      this.currentPosition = this.cursorObject.getTransform().getLocalPosition();
      this.targetPosition = this.currentPosition;
    }

    // Get camera reference
    this.cameraTransform = this.getSceneObject().getParent()?.getTransform() ||
                          this.getSceneObject().getTransform();

    this.createEvent("OnStartEvent").bind(() => {
      this.initializeSupabase();
    });

    // Create update event for follow mode
    let updateEventFrameCount = 0;
    this.createEvent("UpdateEvent").bind(() => {
      if (!this.isBroadcastMode) {
        this.updateFollowMode();
        
        // Log first few frames to confirm UpdateEvent is running
        updateEventFrameCount++;
        if (updateEventFrameCount <= 3) {
          this.log(`UpdateEvent running in FOLLOW mode (frame ${updateEventFrameCount})`);
        }
      } else {
        updateEventFrameCount = 0; // Reset when in broadcast mode
      }
    });

    this.createEvent("OnDestroyEvent").bind(() => {
      this.cleanup();
    });
  }

  /**
   * Initialize Supabase client and realtime connection
   */
  private async initializeSupabase() {
    if (!this.snapCloudRequirements || !this.snapCloudRequirements.isConfigured()) {
      this.log("SnapCloudRequirements not configured");
      return;
    }

    try {
      // Create Supabase client
      this.client = createClient(
        this.snapCloudRequirements.getSupabaseUrl(),
        this.snapCloudRequirements.getSupabasePublicToken()
      );

      if (!this.client) {
        this.log("Failed to create Supabase client");
        return;
      }

      // Sign in user
      await this.signInUser();

      // Initialize user data
      this.userId = "spectacles_" + Math.random().toString(36).substr(2, 9);

      // Setup realtime channel
      await this.setupRealtimeChannel();

      this.isInitialized = true;
      this.log("Supabase WebSocket initialized");
      
      // Setup button interaction
      this.setupButtonInteraction();

      // Start in broadcast mode by default
      this.switchToBroadcastMode();

    } catch (error) {
      this.log(`Initialization error: ${error}`);
    }
  }

  /**
   * Sign in user with Snapchat provider
   */
  private async signInUser() {
    const { data, error } = await this.client.auth.signInWithIdToken({
      provider: "snapchat",
      token: "spectacles-auth-token"
    });

    if (error) {
      this.log("Sign in warning: " + JSON.stringify(error));
    } else {
      this.log("User signed in successfully");
    }
  }

  /**
   * Setup Supabase Realtime channel
   */
  private async setupRealtimeChannel() {
    this.realtimeChannel = this.client.channel(`cursor-${this.channelName}`, {
      config: {
        broadcast: { self: false } // Don't receive own broadcasts
      }
    });

    // Listen for cursor movements from PC
    let cursorMessageCount = 0;
    this.realtimeChannel
      .on("broadcast", { event: "cursor-move" }, (msg) => {
        const fromPC = msg.payload.user_id && msg.payload.user_id.startsWith('pc_');
        
        // Only process if we're in follow mode and it's from PC
        if (!this.isBroadcastMode && fromPC) {
          cursorMessageCount++;
          
          // Log first few messages to confirm it's working
          if (cursorMessageCount <= 3) {
            this.log(`Received cursor from PC #${cursorMessageCount}`);
          }
          
          this.handleIncomingCursor(msg.payload);
        }
      })
      .on("broadcast", { event: "control-mode" }, (msg) => {
        this.log(`Control mode signal received: ${msg.payload.mode} from ${msg.payload.user_id}`);
      });

    // Subscribe to channel
    this.realtimeChannel.subscribe(async (status) => {
      this.log(`Channel status: ${status}`);
      
      if (status === "SUBSCRIBED") {
        this.log("Subscribed to realtime channel!");
      } else if (status === "CLOSED" || status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
        this.log("Channel closed or error occurred");
      }
    });
  }

  /**
   * Setup button interaction for mode switching
   */
  private setupButtonInteraction() {
    if (!this.toggleModeButton) {
      this.log("No toggle button assigned - mode switching disabled");
      this.log("Assign a RectangleButton from Spectacles UI Kit to enable toggling");
      return;
    }

    this.log(`Found RectangleButton for mode toggle`);

    // Use RectangleButton's onTriggerUp event (same as SupabaseConnector example)
    this.toggleModeButton.onTriggerUp.add(() => {
      this.log("MODE TOGGLE BUTTON PRESSED!");
      this.log(`Current mode before toggle: ${this.isBroadcastMode ? 'BROADCAST' : 'FOLLOW'}`);
      this.toggleMode();
      this.log(`Current mode after toggle: ${this.isBroadcastMode ? 'BROADCAST' : 'FOLLOW'}`);
    });

    this.log("Button interaction setup complete - ready to toggle!");
  }

  /**
   * Toggle between broadcast and follow modes
   */
  private toggleMode() {
    if (this.isBroadcastMode) {
      this.switchToFollowMode();
    } else {
      this.switchToBroadcastMode();
    }
  }

  /**
   * Switch to broadcast mode (Spectacles → Web)
   */
  private switchToBroadcastMode() {
    this.isBroadcastMode = true;
    this.log("SWITCHING TO BROADCAST MODE: Spectacles -> Web");
    
    // Update mode text
    if (this.modeText) {
      this.log(`Updating mode text to: "BROADCASTING"`);
      this.modeText.text = "BROADCASTING";
    } else {
      this.log("modeText component not assigned!");
    }
    
    // Stop following
    // (UpdateEvent will stop calling updateFollowMode)
    this.log("Stopped following mode");
    
    // Start broadcasting
    this.startBroadcasting();
    
    // Notify web
    this.sendModeSignal("spectacles_leader");
    this.log("Broadcast mode fully activated!");
  }

  /**
   * Switch to follow mode (Web → Spectacles)
   */
  private switchToFollowMode() {
    this.isBroadcastMode = false;
    this.log("SWITCHING TO FOLLOW MODE: Web -> Spectacles");
    
    // Update mode text
    if (this.modeText) {
      this.log(`Updating mode text to: "FOLLOWING"`);
      this.modeText.text = "FOLLOWING";
    } else {
      this.log("modeText component not assigned!");
    }
    
    // Stop broadcasting
    if (this.broadcastTimer) {
        this.log("Stopping broadcast timer");
      this.broadcastTimer.enabled = false;
    }
    
    // Follow mode will be handled by UpdateEvent
    // (UpdateEvent will start calling updateFollowMode)
    this.log("UpdateEvent will now handle cursor following");
    
    // Initialize target position to current position for smooth transition
    if (this.cursorObject) {
      this.currentPosition = this.cursorObject.getTransform().getLocalPosition();
      this.targetPosition = this.currentPosition;
        this.log(`Initial follow position: ${this.currentPosition.x.toFixed(2)}, ${this.currentPosition.y.toFixed(2)}, ${this.currentPosition.z.toFixed(2)}`);
    }
    
    // Notify web
    this.sendModeSignal("pc_leader");
    this.log("Follow mode fully activated!");
  }

  /**
   * Send mode change signal
   */
  private sendModeSignal(mode: string) {
    if (!this.isInitialized || !this.realtimeChannel) return;

    this.realtimeChannel.send({
      type: "broadcast",
      event: "control-mode",
      payload: {
        mode: mode,
        user_id: this.userId,
        timestamp: Date.now()
      }
    });

    this.log(`Mode signal sent: ${mode}`);
  }

  /**
   * Start broadcasting cursor position
   */
  private startBroadcasting() {
    if (!this.cursorObject) {
      this.log("No cursor object assigned to track!");
      return;
    }

    this.broadcastTimer = this.createEvent("DelayedCallbackEvent");
    this.broadcastCount = 0;

    const broadcast = () => {
      if (this.isBroadcastMode && this.cursorObject) {
        // Get the actual world position of the cursor object
        const transform = this.cursorObject.getTransform();
        const worldPos = transform.getWorldPosition();
        
        // Debug: Log cursor object name and position
        if (this.broadcastCount === 0) {
          this.log(`Tracking cursor object: "${this.cursorObject.name}"`);
          this.log(`Initial world position: ${worldPos.x.toFixed(2)}, ${worldPos.y.toFixed(2)}, ${worldPos.z.toFixed(2)}`);
          this.log(`Make sure this object is being moved by InteractionKit or HandTracking!`);
        }

        // Get camera transform for relative positioning
        const cameraPos = this.cameraTransform.getWorldPosition();
        const cameraForward = this.cameraTransform.forward;
        const cameraRight = this.cameraTransform.right;
        const cameraUp = this.cameraTransform.up;

        // Calculate position relative to camera
        const toObject = worldPos.sub(cameraPos);

        // Project onto camera's right and up vectors to get 2D position
        const rightComponent = toObject.dot(cameraRight);
        const upComponent = toObject.dot(cameraUp);
        const forwardComponent = toObject.dot(cameraForward);

        // Convert from Lens Studio coordinate system to web percentage
        const screenScale = this.perspectiveScale / Math.max(Math.abs(forwardComponent), 1.0);
        let lsX = rightComponent * screenScale * this.coordinateScale;
        let lsY = upComponent * screenScale * this.coordinateScale;
        
        // Apply axis inversion if enabled
        if (this.invertX) lsX = -lsX;
        if (this.invertY) lsY = -lsY;
        
        // Convert LS coordinates to web percentage
        const webX = ((lsX + this.lsXRange) / (this.lsXRange * 2)) * 100;
        const webY = ((this.lsYRange - lsY) / (this.lsYRange * 2)) * 100;

        // Clamp to valid range
        const clampedX = Math.max(0, Math.min(100, webX));
        const clampedY = Math.max(0, Math.min(100, webY));

        this.broadcastCount++;

        // Log based on frequency setting
        if (this.verboseLogging || (this.broadcastCount % this.logFrequency === 0)) {
          this.log(`Broadcasting #${this.broadcastCount}: LS(${lsX.toFixed(1)}, ${lsY.toFixed(1)}) -> Web(${clampedX.toFixed(1)}, ${clampedY.toFixed(1)})`);
        }

        // Broadcast via WebSocket
        this.broadcastCursorPosition(clampedX, clampedY);

        this.broadcastTimer.reset(this.broadcastInterval);
      } else {
        // Stop broadcasting if mode changed
        if (this.broadcastTimer) {
          this.broadcastTimer.enabled = false;
        }
      }
    };

    this.broadcastTimer.bind(broadcast);
    broadcast(); // Start immediately

    this.log("Started broadcasting cursor position");
  }

  /**
   * Broadcast cursor position via Supabase Realtime
   */
  private async broadcastCursorPosition(x: number, y: number) {
    if (!this.isInitialized || !this.realtimeChannel) return;

    const now = Date.now();

    // Throttle broadcasts
    if (now - this.lastBroadcastTime < (this.broadcastInterval * 1000)) {
      return;
    }

    this.lastBroadcastTime = now;

    this.realtimeChannel.send({
      type: "broadcast",
      event: "cursor-move",
      payload: {
        channel_name: this.channelName,
        user_id: this.userId,
        user_name: "Spectacles",
        x: x,
        y: y,
        color: this.userColor,
        timestamp: now
      }
    });

    // Debug: Store sample positions to database (every 50th broadcast)
    if (this.broadcastCount % 50 === 0) {
      try {
        await this.client.from('cursor_debug').insert({
          user_id: this.userId,
          x: x,
          y: y,
          timestamp: new Date().toISOString(),
          channel_name: this.channelName
        });
      } catch (error) {
        // Silent fail - debug table might not exist yet
        if (this.broadcastCount === 50) {
          this.log(`Debug table 'cursor_debug' not available: ${error}`);
        }
      }
    }
  }

  /**
   * Handle incoming cursor position data (follow mode)
   */
  private handleIncomingCursor(cursorData: any) {
    const timestamp = cursorData.timestamp || Date.now();

    // Ignore old updates
    if (timestamp <= this.lastCursorUpdate) {
      return;
    }

    this.lastCursorUpdate = timestamp;

    // Convert web percentage (0-100) to Lens Studio coordinate system
    let lsX = (cursorData.x / 100) * (this.lsXRange * 2) - this.lsXRange;
    let lsY = this.lsYRange - (cursorData.y / 100) * (this.lsYRange * 2);
    
    // Apply axis inversion if enabled
    if (this.invertX) lsX = -lsX;
    if (this.invertY) lsY = -lsY;

    // Calculate new target position relative to camera
    this.targetPosition = new vec3(
      (lsX / this.lsXRange) * this.movementScale,
      (lsY / this.lsYRange) * this.movementScale + this.heightOffset,
      this.cursorZPosition  // Fixed Z position (default: -100)
    );

    this.log(`Received from ${cursorData.user_name}: Web(${cursorData.x.toFixed(1)}, ${cursorData.y.toFixed(1)}) -> Target(${this.targetPosition.x.toFixed(2)}, ${this.targetPosition.y.toFixed(2)}, Z=${this.cursorZPosition})`);
  }

  /**
   * Update cursor position in follow mode (called every frame)
   */
  private updateFollowMode() {
    if (!this.cursorObject) {
      return;
    }

    if (!this.isConnected()) {
      return;
    }

    // Smoothly interpolate to target position
    const previousPosition = this.currentPosition;
    this.currentPosition = vec3.lerp(
      this.currentPosition,
      this.targetPosition,
      this.movementSpeed
    );

    // Apply position relative to camera
    const cameraPos = this.cameraTransform.getWorldPosition();
    const cameraRot = this.cameraTransform.getWorldRotation();

    // Transform relative position to world space
    const worldPosition = cameraPos.add(cameraRot.multiplyVec3(this.currentPosition));

    this.cursorObject.getTransform().setWorldPosition(worldPosition);

    // Log occasionally to show it's working
    const posChanged = previousPosition.distance(this.currentPosition) > 0.01;
    if (posChanged && Math.random() < 0.02) { // Log ~2% of frames when moving
      this.log(`Follow update: Current(${this.currentPosition.x.toFixed(2)}, ${this.currentPosition.y.toFixed(2)}) -> Target(${this.targetPosition.x.toFixed(2)}, ${this.targetPosition.y.toFixed(2)})`);
    }
  }

  /**
   * Cleanup connections
   */
  private cleanup() {
    if (this.broadcastTimer) {
      this.broadcastTimer.enabled = false;
    }

    if (this.client) {
      this.client.removeAllChannels();
    }

    this.log("Disconnected");
  }

  /**
   * Logging helper
   */
  private log(message: string) {
    if (this.enableDebugLogs) {
      print(`[RealtimeCursor] ${message}`);
    }
    this.updateStatusText(message);
  }

  /**
   * Update status text display
   */
  private updateStatusText(message: string) {
    if (!this.statusText) return;

    const timestamp = new Date().toLocaleTimeString();
    const fullMessage = `[${timestamp}] ${message}`;

    this.statusMessages.push(fullMessage);

    if (this.statusMessages.length > this.maxStatusLines) {
      this.statusMessages = this.statusMessages.slice(-this.maxStatusLines);
    }

    const textComponent = this.statusText.getComponent("Component.Text");
    if (textComponent) {
      const statusHeader = `Mode: ${this.isBroadcastMode ? 'Broadcasting' : 'Following'}\n` +
                          `User: ${this.userId}\n` +
                          `Channel: ${this.channelName}\n` +
                          `---Recent Logs---\n`;

      textComponent.text = statusHeader + this.statusMessages.slice(-5).join('\n');
    }
  }

  /**
   * Check if connected
   */
  private isConnected(): boolean {
    return this.isInitialized && this.realtimeChannel !== null;
  }

  /**
   * Public getters
   */
  public isServiceInitialized(): boolean {
    return this.isInitialized;
  }

  public getChannelName(): string {
    return this.channelName;
  }

  public getCurrentMode(): string {
    return this.isBroadcastMode ? "broadcast" : "follow";
  }
}

