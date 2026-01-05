# ThinkOutLoud         

[![Sync Kit](https://img.shields.io/badge/Sync%20Kit-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-sync-kit) [![SpectaclesInteractionKit](https://img.shields.io/badge/SIK-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-interaction-kit) [![UIKit](https://img.shields.io/badge/UIKit-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-ui-kit) [![Connected Lenses](https://img.shields.io/badge/Connected%20Lenses-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/spectacles-frameworks/connected-lenses) [![Cloud Storage](https://img.shields.io/badge/Cloud%20Storage-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/about-spectacles-features/apis/cloud-storage) [![Hand Tracking](https://img.shields.io/badge/Hand%20Tracking-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/about-spectacles-features/apis/hand-tracking)

<img src="./README-ref/sample-list-think-out-loud-rounded-edges.gif" alt="ThinkOutLoud Overview" width="500" />

**A Social AR Networking Application for Snap Spectacles**

Transform social events with floating status panels, visual ping connections, and instant networking capabilities - all synchronized in real-time across Connected Lenses. 
Experience the future of social interaction in augmented reality.

> **NOTE:**
> This project is designed for **Connected Lenses** on the **Spectacles platform**. You must set the simulation mode in Lens Studio Preview to `Spectacles (2024)` and test with multiple users for full functionality.

## 🎯 Project Overview

ThinkOutLoud is a sophisticated social AR networking application designed for any social event, enabling participants to:

- **👤 Floating Status Panels**: Display personalized messages and availability above users' heads
- **🎯 Visual Ping System**: Send connection requests with visual feedback and material changes
- **🤝 Real-time Networking**: Connect with others while respecting social boundaries
- **📱 Hand Menu Interface**: Personal settings and status management via palm detection
- **🔄 Persistent Data**: Status and preferences saved across sessions with cloud storage

### Key Features

- **True Multiplayer Sync**: Real-time synchronization of user identities across all participants
- **Intelligent Ping Flow**: Request → Response → Visual Connection system
- **Spatial UI Design**: Hand-tracked menus and 3D positioned status displays
- **Material-Based Feedback**: Visual state changes through dynamic material swapping
- **Session Persistence**: Cloud storage integration for cross-session data retention

---

## 🔄 Understanding Sync Kit

This system uses **Spectacles Sync Kit** for real-time multiplayer synchronization. Unlike simple data sharing, Sync Kit actually **synchronizes identities** of different structures across the network.

Think of it like having multiple mirrors of the same room - each person sees their own mirror, but when someone moves in one mirror, that movement appears in all the other mirrors simultaneously.

### Key Sync Kit Concepts

#### 🔄 Sync Entities
Objects that synchronize data/behavior across all users:
```typescript
// Create a sync entity for ping events
this.syncEntity = new SyncEntity(this, null, false, "Session");
```

**Parameters:**
- `this` - Script component owner
- `null` - No specific owner (shared)
- `false` - Not persistent
- `"Session"` - Sync scope

#### 💾 Storage Properties
Synchronized data that persists across the session:
```typescript
private userNameProp = StorageProperty.manualString("userName", "Unknown User");
private statusTextProp = StorageProperty.manualString("statusText", "Hello!");
private availabilityProp = StorageProperty.manualInt("availability", 0);
private pingStateProp = StorageProperty.manualBool("pingState", false);
```

#### 📨 Network Events
One-time messages for immediate actions:
```typescript
// Send ping request
this.syncEntity.sendEvent('ping_request', pingData);

// Listen for responses
this.syncEntity.onEventReceived.add('ping_response', (messageInfo) => {
    this.handlePingResponse(messageInfo);
});
```

---

## 📚 Core Components

### 👤 Head Label System
**Purpose**: Floating user status display above each participant

**Key Files:**
- `HeadLabelObjectManager.ts` - Manages all head labels in the session
- `HeadLabelObjectController.ts` - Individual label behavior and data
- `HeadLabelUpdater.ts` - Bridge between hand menu and head label data
- `HeadLabelReferences.ts` - UI component references

**Features:**
- **Persistent Status**: User status saved via cloud storage
- **Real-time Sync**: Status changes propagate to all users instantly
- **Ping Interaction**: ContainerFrame enables ping targeting
- **Material Feedback**: Visual connection state through material swapping

### 🎯 Ping System
**Purpose**: Connection request system with visual feedback

**Key Files:**
- `PingMenu.ts` - Main ping coordination and network events
- `PingMenuObjectController.ts` - Accept/reject UI handling
- `PingMenuReferences.ts` - Ping menu UI components

**Flow:**
1. **Request**: User triggers ping on remote head label
2. **Response**: Recipient accepts or rejects via UI menu
3. **Update**: Connection state broadcasts to all users with visual feedback

### 🖐️ Hand Menu System
**Purpose**: Personal settings interface via palm detection

**Key Files:**
- `HandMenu.ts` - Palm detection and menu positioning
- `HandMenuController.ts` - UI interaction handling
- `HandMenuReferences.ts` - Menu component references
- `AnimationTimer.ts` - Loading animation during delay

**Features:**
- **Palm Detection**: Shows menu when right palm faces camera
- **Spatial Positioning**: Menu positioned relative to head pose
- **Status Management**: Update personal status and availability
- **Ping Management**: Exit active ping connections

### 🤲 Hand Tracking System
**Purpose**: Visual hand representation with color coding

**Key Files:**
- `HandObjectManager.ts` - Manages all hand objects
- `HandObjectController.ts` - Individual hand behavior
- `PlayerColorAssigner.ts` - Consistent color assignment

### 💾 Storage & Data Management
**Purpose**: Persistent data and cross-session memory

**Key Files:**
- `RealtimeStoreKeys.ts` - Data structure definitions
- Cloud Storage integration for persistent user preferences
- Storage Properties for real-time synchronization

---

## 🎮 Key Implementation Patterns

### Pattern 1: Manager-Controller Architecture
```typescript
HeadLabelObjectManager    // Manages all head labels
  └── HeadLabelObjectController  // Controls individual label
```

**Deep Dive:**
- **Manager**: Lives in scene, coordinates creation/destruction
- **Controller**: Instantiated per user, handles individual behavior
- **Ownership Detection**: `this.syncEntity.networkRoot.locallyCreated`
  - `true` = "This is MY object" (I can edit)
  - `false` = "This is ANOTHER user's object" (I observe)

### Pattern 2: Material Swapping for Visual States
```typescript
// Dynamic material assignment based on connection state
renderMeshVisual.mainMaterial = isConnected ?
    pingAcceptedMaterial :  // Blue when connected
    pingDefaultMaterial;    // Yellow when not
```

### Pattern 3: Event-Driven Network Communication
```typescript
// Three-phase ping system
'ping_request'           // Initial connection request
'ping_response'          // Accept/reject response  
'ping_connection_update' // Broadcast final state to all users
```

### Pattern 4: Spatial UI Positioning
```typescript
// Position UI relative to head pose with proper offset calculation
const targetPosition = this.calculatePositionWithOffset(
    headPosition, 
    this.positionOffset
);
```

---

## 🔧 Setup Instructions

### Prerequisites

- **Lens Studio**: v5.15.1+
- **Spectacles OS**: v5.64+
- **Target Platform**: Snap Spectacles (required for Connected Lenses)
- **Testing**: Multiple Spectacles devices or simulation accounts

### 1. Project Setup

#### Clone Repository
```bash
git clone [repository-url]
cd think-out-loud
```

#### Open in Lens Studio
1. Open project in Lens Studio v5.10.1+
2. Ensure all packages are imported:
   - SpectaclesSyncKit
   - SpectaclesInteractionKit
   - Cloud Storage Module

### 2. Component Configuration

#### Session Management
The `SessionController` automatically handles user connection and sync entity creation.

#### Head Label System
```typescript
// HeadLabelObjectManager configuration
@input instantiator: Instantiator              // Sync entity instantiation
@input headLabelPrefab: ObjectPrefab          // Head label prefab reference

// HeadLabelObjectController configuration  
@input headLabelManager: HeadLabelObjectManager
@input headLabelReferences: HeadLabelReferences
@input cloudStorageModule: CloudStorageModule  // For persistent storage
@input pingMenu: PingMenu                      // For ping interactions
```

#### Ping System
```typescript
// PingMenu configuration
@input headLabelManager: HeadLabelObjectManager  // Access to all head labels
@input pingMenuPrefab: ObjectPrefab             // Ping response UI prefab
@input pingSendAudio: AudioComponent            // Audio feedback
@input preferUserId: boolean = false           // ID targeting preference
```

#### Hand Menu System
```typescript
// HandMenu configuration
@input handMenuPrefab: ObjectPrefab     // Hand menu UI prefab
@input timerPrefab: ObjectPrefab        // Loading animation prefab
@input headPoseTarget: SceneObject      // For positioning calculations
@input positionOffset: vec3             // Menu offset from wrist
@input showDelay: number = 0.5          // Palm detection delay
@input enableScaling: boolean = true    // Animation preferences
```

### 3. Testing Setup

#### Single Device Testing
```typescript
// Enable for same account testing across devices
@input preferUserId: boolean = true
```
**Note**: Material synchronization may be limited in single-account testing.

#### Multi-User Testing
- **Requirement**: Different Snapchat accounts
- **Features**: Full material and visual synchronization
- **Connection**: Proper user ID handling across devices

---

## 🧪 Testing the Lens

### In Lens Studio Editor

1. Set **Device Type Override** to `Spectacles (2024)`
2. Use **Multi-User Preview** for testing sync functionality 
3. Test if you can ping other players 

### On Spectacles Devices

1. Deploy to multiple Spectacles devices with different Snapchat accounts
2. Test the complete ping flow:
   - User A updates status via hand menu
   - User B pings User A's head label
   - User A accepts ping via popup menu
   - Both users see visual connection (blue materials)
3. Test session persistence by rejoining after disconnection

### Performance Testing

- **Sync Performance**: Real-time status updates across users
- **Hand Tracking**: Palm detection accuracy and responsiveness
- **Visual Feedback**: Material swapping and animation smoothness
- **Storage**: Persistent data across sessions

---

## 🐛 Troubleshooting

### Common Issues

#### Sync Entity Not Ready
```
Error: Cannot send ping - sync entity not ready
```
**Solution**: Ensure `SessionController.getInstance().notifyOnReady()` completes before sync operations.

#### Hand Tracking Not Working
```
Warning: Right hand not tracked for menu positioning
```
**Solution**: 
1. Verify SpectaclesInteractionKit is properly imported
2. Check hand tracking permissions on device
3. Ensure proper lighting conditions

#### Material Swapping Issues
```
Warning: Ping material targets not assigned
```
**Solution**: 
1. Verify `HeadLabelReferences.pingMaterialTargets` array is populated
2. Ensure target objects have `RenderMeshVisual` components
3. Check material assignments in `pingDefaultMaterial` and `pingAcceptedMaterial`

#### Cloud Storage Failures
```
Error: Cloud storage not available
```
**Solution**:
1. Verify `CloudStorageModule` is assigned in inspector
2. Check network connectivity
3. Ensure proper Spectacles account authentication

### Debug Features

Enable comprehensive logging:
```typescript
// In HeadLabelObjectController
print(`📍 HeadLabel position: (${updatePos.x.toFixed(1)}, ${updatePos.y.toFixed(1)}, ${updatePos.z.toFixed(1)})`);

// In PingMenu  
print(`🔍 PingMenu: Checking ping target - My ID: '${myUserId}', Ping To: '${pingData.to}'`);

// In HandMenu
print(`📝 HandMenu: Menu shown at wrist position with offset`);
```

---

## 🎯 Demo Sequence

### Complete User Flow

1. **Session Creation**: Users join Connected Lens session
2. **Head Label Sync**: Personal status displays above each user
3. **Status Update**: User shows palm → Hand menu appears → Updates status
4. **Ping Initiation**: User targets another's head label → Triggers ping
5. **Ping Response**: Recipient sees popup menu → Accepts connection
6. **Visual Connection**: Both users' materials change to blue (connected state)
7. **Connection Management**: Users can exit connections via hand menu
8. **Session Persistence**: Status and preferences saved across sessions

### Key Interactions

- **👋 Palm Detection**: Right palm facing camera triggers hand menu
- **🎯 Head Label Ping**: Direct interaction with floating status panels
- **📱 Menu Navigation**: Spatial UI with button interactions
- **🎨 Visual Feedback**: Material changes indicate connection states
- **💾 Data Persistence**: Cloud storage maintains user preferences

---

## 📊 System Statistics

- **Total Components**: 22 core TypeScript modules
- **Sync Entities**: 3 main types (HeadLabel, PingMenu, HandObjects)
- **Storage Properties**: 5 persistent data types per user
- **Network Events**: 3 ping system events with broadcast
- **Hand Tracking**: Full SIK integration with palm detection
- **Material System**: Dynamic visual feedback with 2+ materials per user
- **Session Persistence**: Cloud storage integration with automatic management

---

## 🎨 Design Guidelines

ThinkOutLoud follows **spatial design principles** for AR social interaction:

- **Floating UI**: Status panels positioned above users' heads
- **Hand-Centric Interaction**: Palm detection for private menu access
- **Visual Feedback**: Material changes indicate connection states
- **Respectful Boundaries**: Ping system requires explicit acceptance
- **Persistent Identity**: Status and preferences maintain across sessions

Refer to [Spectacles Design Guidelines](https://developers.snap.com/spectacles/best-practices/design-for-spectacles/introduction-to-spatial-design) for spatial AR best practices.

---

## 🤝 Contributing

We welcome contributions to improve ThinkOutLoud! This project demonstrates advanced Connected Lenses patterns that can benefit the entire Spectacles community.

### Development Guidelines

1. **Follow Sync Kit Patterns**: Use established Manager-Controller architecture
2. **Maintain Visual Consistency**: Material-based feedback for all state changes
3. **Respect Social Boundaries**: All connections require explicit user consent
4. **Optimize Performance**: Consider multi-user scenarios and network efficiency
5. **Test Thoroughly**: Verify functionality across multiple Spectacles devices
6. **Document Patterns**: Share reusable sync and interaction patterns

### Code Structure
```
Assets/Project/Scripts/
├── HeadLabel/          # Floating status display system
├── PingMenu/           # Connection request system  
├── HandMenu/           # Personal settings interface
├── Hands/              # Hand tracking and visualization
├── Player/             # Player object management
├── SyncControls/       # Data structures and sync keys
├── Utils/              # Helper functions and utilities
└── Audio/              # Audio feedback components
```

---

## 🔗 External References

- **[Spectacles Sync Kit Documentation](https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-sync-kit)**
- **[Connected Lenses Guide](https://developers.snap.com/spectacles/spectacles-frameworks/connected-lenses)**
- **[SpectaclesInteractionKit Documentation](https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-interaction-kit)**
- **[Cloud Storage API](https://developers.snap.com/spectacles/about-spectacles-features/apis/cloud-storage)**
- **[Lens Studio Documentation](https://developers.snap.com/lens-studio)**

---

## 💬 Support & Community

Connect with the Spectacles developer community:

- **Spectacles Community**: [Reddit](https://www.reddit.com/r/Spectacles/)
- **Developer Forums**: [Snap Developer Forums](https://developers.snap.com/spectacles)
- **Documentation**: [Spectacles Developer Portal](https://developers.snap.com/spectacles)

We're excited to see what you build with Connected Lenses and ThinkOutLoud patterns!

---

*Built with 👻 by the Spectacles team*  

---

This project includes a `ci_export.json` file for CI/CD configuration.






