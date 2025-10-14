# ``SpectaclesKit``

## Overview

The `SpectaclesKit` framework offers a set of tools and protocols to seamlessly integrate Spectacles functionality into your iOS applications. It includes support for device bonding, session management, and asset handling, making it easy to create rich, interactive experiences.

### Key Features

- **Device Bonding**: Easily manage the bonding and unbonding of Spectacles devices.
- **Session Management**: Create and manage sessions with Spectacles, including handling connection statuses and session requests.
- **Asset Handling**: Work with various asset types such as textures, meshes, audio tracks, and more.
- **Request Handling**: Make and process API requests to interact with Spectacles services.

## Topics

### Getting Started

- `Builder`: The entry point for creating and configuring instances of `SpectaclesKit`.
- `ClientIdentifier`: A struct representing a unique client identifier used for authentication.

### Device Bonding

- `Bonding`: A struct representing a bonded Spectacles device.
- `BondingRequest`: An enum representing different types of bonding requests.
- `BondingResult`: An enum representing the result of a bonding request.

### Session Management

- `SpectaclesSession`: A protocol defining the methods for managing Spectacles sessions.
- `SessionRequest`: An enum representing different types of session requests.
- `ConnectionStatus`: An enum representing the connection status of a session.
- `DisconnectReason`: An enum representing the reason for a session disconnect.
- `CloseReason`: An enum representing the reason for closing a session.
- `Metadata`: A struct representing metadata associated with a connected session.

### Asset Handling

- `SpectaclesAsset`: An enum defining the properties of a Spectacles asset.
- `Texture`: A struct representing a texture asset.
- `RenderMesh`: A struct representing a render mesh asset.
- `AudioTrack`: A struct representing an audio track asset.
- `ObjectPrefab`: A struct representing an object prefab asset.
- `Script`: A struct representing a script asset.
- `MLAsset`: A struct representing an ML asset.
- `ZipAsset`: A struct representing a zip asset.

### Request Handling

- `SpectaclesRequest`: A protocol defining the properties of a Spectacles request.
- `SpectaclesRequestWithResponse`: A protocol defining a request that expects a response.
- `SpectaclesRequestWithResponses`: A protocol defining a request that expects multiple responses.
- `SpectaclesApiRequest`: An enum representing different types of API requests.
- `SpectaclesAssetRequest`: An enum representing different types of asset requests.

### Error Handling

- `ClientException`: A class representing client-related exceptions.
- `SessionException`: A class representing session-related exceptions.

### Delegates

- `SpectaclesRequestDelegate`: A protocol defining the methods for processing service requests.

## Installation

### Using Swift Package Manager

To integrate `SpectaclesKit` into your Xcode project using Swift Package Manager.

## Usage Examples

### Basic Setup

Here's how to get started with the `SpectaclesKit_iOS` framework:

```swift
import SpectaclesKit

let builder = Builder.create()
let spectaclesKit = builder
    .setIdentifier(ClientIdentifier(value: "exampleID")!)
    .setVersion(version: "1.0")
    .build()
