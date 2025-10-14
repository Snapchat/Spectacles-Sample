# ``SpectaclesKit``

## Overview

The `SpectaclesKit` framework offers a set of tools and protocols to seamlessly integrate Spectacles functionality into your Android applications. It includes support for device bonding, session management, and asset handling, making it easy to create rich, interactive experiences.

### Key Features

- **Device Bonding**: Easily manage the bonding and unbonding of Spectacles devices.
- **Session Management**: Create and manage sessions with Spectacles, including handling connection statuses and session requests.
- **Asset Handling**: Work with various asset types such as textures, meshes, audio tracks, and more.
- **Request Handling**: Make and process API requests to interact with Spectacles services.

## Topics

### Getting Started

- `Builder`: The entry point for creating and configuring instances of `SpectaclesKit`.
- `ClientIdentifier`: Represents a unique client identifier used for authentication.

### Device Bonding

- `SpectaclesKit.Bonding`: Represents a bonded Spectacles device.
- `SpectaclesKit.BondingRequest`: Represents different types of bonding requests.
- `SpectaclesKit.BondingResult`: Represents the result of a bonding request.

### Session Management

- `SpectaclesSession`: Describes a Kit session responsible for connecting and interacting with a specified Lens.
- `SessionRequest`: Represents a base class for different types of service requests.
- `SpectaclesSession.ConnectionStatus`: Represents the connection status of a session.
- `SpectaclesSession.DisconnectReason`: Represents the reason for a session disconnect.
- `SpectaclesSession.CloseReason`: Represents the reason for closing a session.
- `SpectaclesSession.Metadata`: Represents metadata associated with a connected session.

### Asset Handling

- `SpectaclesAsset`: Defines a generic Spectacles asset.

### Request Handling

- `SpectaclesRequest`: A request container defining the properties of a Spectacles request.
- `SpectaclesRequest.WithResponse`: A request container defining a request that expects a response.
- `SpectaclesRequest.WithResponses`: A request container defining a request that expects multiple responses.
- `SpectaclesRequest.WithoutResponse`: A request container defining a request that doesn't expect a response.
- `SpectaclesApiRequest`: Represents different types of API requests.
- `SpectaclesAssetRequest`: Represents different types of asset requests.

### Error Handling

- `ClientException`: A class representing client-related exceptions.
- `SessionException`: A class representing session-related exceptions.
- `SpectaclesRequestException`: Exception thrown when a request to the Spectacles fails.

### Delegates

- `SpectaclesRequestDelegate`: A protocol defining the methods for processing service requests.

## Usage Examples

### Basic Setup

Here's how to get started with the `SpectaclesKit` framework on Android:

```kotlin
import com.snap.spectacles.kit.SpectaclesKit

val spectaclesKit = newBuilder(context)
    .setIdentifier(ClientIdentifier(value = "exampleID"))
    .setVersion(version = "1.0")
    .setRequestExecutor(Executors.newFixedThreadPool(8))
    .build()

