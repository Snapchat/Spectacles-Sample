# Spectacles Sync Kit          

[![Sync Kit](https://img.shields.io/badge/Sync%20Kit-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-sync-kit) [![SpectaclesInteractionKit](https://img.shields.io/badge/SIK-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-interaction-kit) [![UIKit](https://img.shields.io/badge/UIKit-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-ui-kit) [![Connected Lenses](https://img.shields.io/badge/Connected%20Lenses-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/spectacles-frameworks/connected-lenses) [![Cloud Storage](https://img.shields.io/badge/Cloud%20Storage-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/about-spectacles-features/apis/cloud-storage) [![Hand Tracking](https://img.shields.io/badge/Hand%20Tracking-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/about-spectacles-features/apis/hand-tracking)

<img src="./README-ref/sample-list-spectacles-sync-kit-rounded-edges.gif" alt="Spectacles Sync Kit Overview" width="500" />

**A Minimal Example of Spectacles Sync Kit Transform Synchronization**

Experience real-time transform synchronization across Connected Lenses with this minimal example. Watch as objects move and rotate in perfect harmony across multiple Spectacles devices.

> **NOTE:**
> This project is designed for **Connected Lenses** on the **Spectacles platform**. You must set the simulation mode in Lens Studio Preview to `Spectacles (2024)` and test with multiple users for full functionality.

## Project Overview

Spectacles Sync Kit Transform Example demonstrates real-time transform synchronization, showcasing how objects can be synchronized across multiple Connected Lenses users. This project focuses on **transform synchronization** - the ability to share position, rotation, and scale data across all participants in real-time.

### Key Features

- **Transform Synchronization**: Real-time position, rotation, and scale sharing
- **Multi-User Support**: Multiple users can interact with the same synchronized object
- **Interactive Controls**: Simple input handling for object manipulation
- **Network Events**: Real-time communication between Connected Lenses
- **Visual Feedback**: Clear indication of synchronization status

---

## Understanding Sync Kit

This system uses **Spectacles Sync Kit** for real-time multiplayer synchronization. The core concept is **transform synchronization** - when one user moves, rotates, or scales an object, those changes are instantly reflected across all other users' devices.

### Key Sync Kit Concepts

#### Sync Entities
Objects that synchronize data/behavior across all users:
```typescript
// Create a sync entity for transform synchronization
this.syncEntity = new SyncEntity(this, null, false, "Session");
```

#### Transform Properties
Synchronized transform data that updates in real-time:
```typescript
private positionProp = StorageProperty.manualVector3("position", new Vector3(0, 0, 0));
private rotationProp = StorageProperty.manualVector3("rotation", new Vector3(0, 0, 0));
private scaleProp = StorageProperty.manualVector3("scale", new Vector3(1, 1, 1));
```

#### Network Events
One-time messages for immediate actions:
```typescript
// Send transform update
this.syncEntity.sendEvent('transform_update', transformData);

// Listen for transform changes
this.syncEntity.onEventReceived.add('transform_update', (messageInfo) => {
    this.handleTransformUpdate(messageInfo);
});
```

---

## Core Components

### Transform Controller
**Purpose**: Manages object transform synchronization

**Key Features:**
- Real-time position, rotation, and scale updates across all users
- Touch/gesture controls for object manipulation
- Broadcasts transform changes to all participants
- Clear indication of synchronization status

### Sync Entity Management
**Purpose**: Handles the core synchronization logic

**Key Features:**
- Persistent transform data across session
- Real-time communication between users
- Determines which user can modify the object
- Manages connection and synchronization status

---

## Key Implementation Patterns

### Pattern 1: Transform Synchronization
```typescript
// Update local transform
this.transform.position = newPosition;
this.transform.rotation = newRotation;
this.transform.scale = newScale;

// Sync to network
this.positionProp.set(newPosition);
this.rotationProp.set(newRotation);
this.scaleProp.set(newScale);
```

### Pattern 2: Ownership Detection
```typescript
// Check if this user owns the object
if (this.syncEntity.networkRoot.locallyCreated) {
    // This user can modify the object
    this.handleUserInput();
} else {
    // This user observes the object
    this.updateFromNetwork();
}
```

### Pattern 3: Event-Driven Updates
```typescript
// Send transform update to all users
this.syncEntity.sendEvent('transform_update', {
    position: this.transform.position,
    rotation: this.transform.rotation,
    scale: this.transform.scale
});
```

---

## Setup Instructions

### Prerequisites

- **Lens Studio**: v5.15.1+
- **Spectacles OS**: v5.64+
- **Target Platform**: Snap Spectacles (required for Connected Lenses)
- **Testing**: Multiple Spectacles devices or simulation accounts

### 1. Project Setup

#### Open in Lens Studio
1. Open project in Lens Studio v5.15.0+
2. Ensure all packages are imported:
   - SpectaclesSyncKit
   - SpectaclesInteractionKit

### 2. Component Configuration

#### Transform Controller
```typescript
// TransformController configuration
@input syncEntity: SyncEntity              // Sync entity reference
@input transformTarget: SceneObject        // Object to synchronize
@input inputHandler: InputComponent        // Input handling component
```

### 3. Testing Setup

#### Multi-User Testing
- **Requirement**: Different Snapchat accounts
- **Features**: Full transform synchronization
- **Connection**: Proper user ID handling across devices

---

## Testing the Lens

### In Lens Studio Editor

1. Set **Device Type Override** to `Spectacles (2024)`
2. Use **Multi-User Preview** for testing sync functionality 
3. Test if transform changes sync across users

### On Spectacles Devices

1. Deploy to multiple Spectacles devices with different Snapchat accounts
2. Test the complete transform sync flow:
   - User A moves/rotates the object
   - User B sees the changes in real-time
   - User B can also modify the object
   - Changes propagate to all users instantly

---

## Troubleshooting

### Common Issues

#### Sync Entity Not Ready
```
Error: Cannot sync transform - sync entity not ready
```
**Solution**: Ensure `SessionController.getInstance().notifyOnReady()` completes before sync operations.

#### Transform Not Syncing
```
Warning: Transform changes not propagating to other users
```
**Solution**: 
1. Verify SpectaclesSyncKit is properly imported
2. Check network connectivity
3. Ensure proper user authentication

---

## Demo Sequence

### Complete User Flow

1. **Session Creation**: Users join Connected Lens session
2. **Object Sync**: Shared object appears for all users
3. **Transform Interaction**: User touches/gestures to move object
4. **Real-time Sync**: Changes propagate to all users instantly
5. **Multi-user Interaction**: Multiple users can modify the same object
6. **Visual Feedback**: Color changes indicate ownership and sync status

---

## System Statistics

- **Total Components**: 3 core TypeScript modules
- **Sync Entities**: 1 main type (TransformController)
- **Storage Properties**: 3 transform data types (position, rotation, scale)
- **Network Events**: 1 transform update event
- **Input Handling**: Touch/gesture support
- **Visual Feedback**: Color-based ownership indication

---

## Design Guidelines

Spectacles Sync Kit Transform Example follows **minimal design principles** for AR synchronization:

- **Simple Interaction**: Direct touch/gesture manipulation
- **Clear Feedback**: Visual indication of sync status
- **Real-time Updates**: Instant propagation of changes
- **Multi-user Support**: Shared object interaction
- **Minimal Complexity**: Focus on core sync functionality

---

## Contributing

We welcome contributions to improve the Spectacles Sync Kit Transform Example! This project demonstrates fundamental synchronization patterns that can benefit the entire Spectacles community.

### Development Guidelines

1. **Follow Sync Kit Patterns**: Use established transform synchronization patterns
2. **Maintain Simplicity**: Keep the example minimal and focused
3. **Optimize Performance**: Consider multi-user scenarios and network efficiency
4. **Test Thoroughly**: Verify functionality across multiple Spectacles devices
5. **Document Patterns**: Share reusable sync and transform patterns

### Code Structure
```
Assets/Project/Scripts/
├── TransformController.ts    # Main transform synchronization
├── SyncEntity.ts            # Core sync entity management
├── InputHandler.ts          # Input handling and processing
└── VisualFeedback.ts        # Visual status indication
```

---

## External References

- **[Spectacles Sync Kit Documentation](https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-sync-kit)**
- **[Connected Lenses Guide](https://developers.snap.com/spectacles/spectacles-frameworks/connected-lenses)**
- **[SpectaclesInteractionKit Documentation](https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-interaction-kit)**
- **[Lens Studio Documentation](https://developers.snap.com/lens-studio)**

---

## Support & Community

Connect with the Spectacles developer community:

- **Spectacles Community**: [Reddit](https://www.reddit.com/r/Spectacles/)
- **Developer Forums**: [Snap Developer Forums](https://developers.snap.com/spectacles)
- **Documentation**: [Spectacles Developer Portal](https://developers.snap.com/spectacles)

We're excited to see what you build with Connected Lenses and Spectacles Sync Kit!

---

*Built with 👻 by the Spectacles team*  

---

This project includes a `ci_export.json` file for CI/CD configuration.


