## iOS APIs

### [BondingManager](sdk/iOS/SpectaclesKit/Sources/API/BondingManager.swift)

The main entry point for working with the Spectacles Mobile Kit. It
manages bonding and session setup between your app and Spectacles.
```Swift
public protocol BondingManager: Sendable
```

#### Methods

##### bind

```Swift
func bind(
    request: BondingRequest,
    deeplinkAsyncStream: AsyncStream<URL>
) async -> BondingResult
```
Initiates a secure bonding process with the Lens specified in the
provided BondingRequest.

<table>
<colgroup>
<col style="width: 23%" />
<col style="width: 76%" />
</colgroup>
<thead>
<tr>
<th colspan="2">Parameters</th>
</tr>
<tr>
<th>request</th>
<th>Identifies the Lens to bind with.</th>
</tr>
<tr>
<th>deeplinkAsyncStream</th>
<th>The deeplink for passing the bonding result from Spectacles App back
to the current app.</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

<table>
<colgroup>
<col style="width: 23%" />
<col style="width: 76%" />
</colgroup>
<thead>
<tr>
<th colspan="2">Returns</th>
</tr>
<tr>
<th>BondingResult</th>
<th>The bonding result.</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

##### unbind

```Swift
func unbind(
    id: String,
    deeplinkAsyncStream: AsyncStream<URL>
) async -> BondingResult
```
Ends an existing secure bonding with a Lens.

<table>
<colgroup>
<col style="width: 23%" />
<col style="width: 76%" />
</colgroup>
<thead>
<tr>
<th colspan="2">Parameters</th>
</tr>
<tr>
<th>id</th>
<th>The ID of the bonding to revoke.</th>
</tr>
<tr>
<th>deeplinkAsyncStream</th>
<th>The deeplink for passing the unbinding result from Spectacles App
back to the current app.</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

<table>
<colgroup>
<col style="width: 23%" />
<col style="width: 76%" />
</colgroup>
<thead>
<tr>
<th colspan="2">Returns</th>
</tr>
<tr>
<th>BondingResult</th>
<th>The unbinding result.</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

##### avaliableBondings

```Swift
func avaliableBondings() -> [any Bonding]
```
Returns all available bondings.

<table>
<colgroup>
<col style="width: 23%" />
<col style="width: 76%" />
</colgroup>
<thead>
<tr>
<th colspan="2">Returns</th>
</tr>
<tr>
<th>[any Bonding]</th>
<th>All existing bondings.</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

##### getBonding
```Swift
func etBongding(id: String) -> (any Bonding)?
```
Fetches the Bonding associated with the given id.

<table>
<colgroup>
<col style="width: 23%" />
<col style="width: 76%" />
</colgroup>
<thead>
<tr>
<th colspan="2">Parameters</th>
</tr>
<tr>
<th>id</th>
<th>The bonding ID.</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

<table>
<colgroup>
<col style="width: 23%" />
<col style="width: 76%" />
</colgroup>
<thead>
<tr>
<th colspan="2">Returns</th>
</tr>
<tr>
<th>Bonding</th>
<th>The bonding if found, or null if not available.</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

##### createSession
```Swift
func createSession(
    bonding: any Bonding,
    request: SessionRequest,
    delegateBuiler: @escaping (any SpectaclesSession) -> any
    SpectaclesRequestDelegate
) throws -> any SpectaclesSession
```
Creates a session to communicate with the bounded Lens.

<table>
<colgroup>
<col style="width: 23%" />
<col style="width: 76%" />
</colgroup>
<thead>
<tr>
<th colspan="2">Parameters</th>
</tr>
<tr>
<th>bonding</th>
<th>The secure bonding to use.</th>
</tr>
<tr>
<th>request</th>
<th>The session settings.</th>
</tr>
<tr>
<th>delegateBuilder</th>
<th>Factory for creating a delegate to handle session requests.</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

<table>
<colgroup>
<col style="width: 23%" />
<col style="width: 76%" />
</colgroup>
<thead>
<tr>
<th colspan="2">Returns</th>
</tr>
<tr>
<th>SpectaclesSession</th>
<th>The created session</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

### [Builder](sdk/iOS/SpectaclesKit/Sources/API/Builder.swift)

Used to create a BondingManager instance with required app credentials.
```Swift
public protocol Builder
```

#### Methods

##### setIdentifier
```Swift
func setIdentifier(_ identifier: ClientIdentifier) -> Self
```
Set the unique identifier for your application.

<table>
<colgroup>
<col style="width: 23%" />
<col style="width: 76%" />
</colgroup>
<thead>
<tr>
<th colspan="2">Parameters</th>
</tr>
<tr>
<th>identifier</th>
<th>The app’s client identifier</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

<table>
<colgroup>
<col style="width: 23%" />
<col style="width: 76%" />
</colgroup>
<thead>
<tr>
<th colspan="2">Returns</th>
</tr>
<tr>
<th>Builder</th>
<th>For chaining</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

##### setVersion
```Swift
func setVersion(_ version: String) -> Self
```
Set the app version.

<table>
<colgroup>
<col style="width: 23%" />
<col style="width: 76%" />
</colgroup>
<thead>
<tr>
<th colspan="2">Parameters</th>
</tr>
<tr>
<th>version</th>
<th>The app version</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

<table>
<colgroup>
<col style="width: 23%" />
<col style="width: 76%" />
</colgroup>
<thead>
<tr>
<th colspan="2">Returns</th>
</tr>
<tr>
<th>Builder</th>
<th>For chaining</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

##### setAuth
```Swift
func setAuth(_ auth: any Authentication) -> Self
```
Sets the authentication provider.

<table>
<colgroup>
<col style="width: 23%" />
<col style="width: 76%" />
</colgroup>
<thead>
<tr>
<th colspan="2">Parameters</th>
</tr>
<tr>
<th>auth</th>
<th>The Authentication to use.</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

<table>
<colgroup>
<col style="width: 23%" />
<col style="width: 76%" />
</colgroup>
<thead>
<tr>
<th colspan="2">Returns</th>
</tr>
<tr>
<th>Builder</th>
<th>For chaining</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

##### setBluetoothAdapter
```Swift
func setBluetoothAdapter(_ bluetoothAdapter: BluetoothAdapter) -> Self
```
Sets the bluetooth adapter.

Optional, default to BluetoothAdapter/defaultInstance.

<table>
<colgroup>
<col style="width: 23%" />
<col style="width: 76%" />
</colgroup>
<thead>
<tr>
<th colspan="2">Parameters</th>
</tr>
<tr>
<th>bluetoothAdapter</th>
<th>The bluetooth adapter to use.</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

<table>
<colgroup>
<col style="width: 23%" />
<col style="width: 76%" />
</colgroup>
<thead>
<tr>
<th colspan="2">Returns</th>
</tr>
<tr>
<th>Builder</th>
<th>For chaining</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

##### build
```Swift
func build() -> any BondingManager
```
Builds and returns a BondingManager instance.

<table>
<colgroup>
<col style="width: 23%" />
<col style="width: 76%" />
</colgroup>
<thead>
<tr>
<th colspan="2">Returns</th>
</tr>
<tr>
<th>BondingManager</th>
<th>The BondingManager instance.</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

### [ClientIdentifier](sdk/iOS/SpectaclesKit/Sources/API/BondingManager.swift)

Represents your app's unique identifier.
```Swift
public struct ClientIdentifier: Sendable
```
#### Properties

##### clientId
```Swift
public let clientId: String
```
The client identifier.

##### appName
```Swift
public let appName: String
```
The app name.

### [Authentication](sdk/iOS/SpectaclesKit/Sources/API/BondingManager.swift)

⚠️ Reserved for future use.
```Swift
public protocol Authentication: Sendable
```


### [BondingRequest](sdk/iOS/SpectaclesKit/Sources/API/BondingManager.swift)

Represents a request to initiate bonding with a specific Lens.
```Swift
public enum BondingRequest: Sendable {
    case singleLens(lensId: String)
    case SingleLensByLensName(lensName: String)
}
```
#### Enum Cases

<table>
<colgroup>
<col style="width: 23%" />
<col style="width: 76%" />
</colgroup>
<thead>
<tr>
<th colspan="2">Cases</th>
</tr>
<tr>
<th>singleLens(lensId: String)</th>
<th>Requests bonding with a specific Lens using its unique ID.</th>
</tr>
<tr>
<th>singleLensByName(lensName: String)</th>
<th>Requests bonding with a Lens by its human-readable name.</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

### [Bonding](sdk/iOS/SpectaclesKit/Sources/API/BondingManager.swift)

Represents a secure bonding between the app and a Lens.
```Swift
public protocol Bonding: Sendable
```

#### Properties

##### id
```Swift
val id: String
```
The unique ID of the bonding.

### [BondingResult](sdk/iOS/SpectaclesKit/Sources/API/BondingManager.swift)

Represents the result of a bonding attempt.
```Swift
public typealias BondingResult = Result<any Bonding, any Error>
```


### [ClientException](sdk/iOS/SpectaclesKit/Sources/API/ClientException.swift)

Base class for exceptions related to client errors.
```Swift
public class ClientException: Error, @unchecked Sendable
```

#### Properties

##### message
```Swift
public let message: String
```
A human-readable description of the error.

##### cause
```Swift
public let cause: (any Error)?
```
The underlying error that caused this exception, if available.

### ClientException.LensClientNotInstalled

Indicates that the Lens Client is not installed on the device.
```Swift
public class LensClientNotInstalled: ClientException
```


### ClientException.DeviceNotFound

Indicates that the target device could not be found.
```Swift
public class DeviceNotFound: ClientException
```


### [SessionRequest](sdk/iOS/SpectaclesKit/Sources/API/BondingManager.swift)

Represents configuration options for establishing a session with
Spectacles.
```Swift
public struct SessionsRequest: Sendable
```
#### Properties

##### autoReconnect
```Swift
public let autoReconnect: Bool
```
If true, the session will try to reconnect automatically.

##### acceptUnfusedSpectacles
```Swift
public let acceptUnfusedSpectacles: Bool
```
Allows connections to unfused (debug) Spectacles.

##### acceptUntrustedLens
```Swift
public let acceptUntrustedLens: Bool
```
Allows untrusted Lens connections, useful for development with Lenses
pushed from Lens Studio.

### [SpectaclesSession](sdk/iOS/SpectaclesKit/Sources/API/SpectaclesSession.swift)

Represents an active session for connecting to and interacting with a
specific Lens.
```Swift
public protocol SpectaclesSession: Sendable
```
#### Properties

##### connectionStatusStream
```Swift
var connectionStatusStream: AsyncStream<ConnectionStatus>
```
A stream that emits status updates as the connection state changes.

##### connectionStatus
```Swift
var connectionStatus: ConnectionStatus
```
The most recent known status of the connection at any given moment.

#### Methods

##### close
```Swift
func close(reason: ClonseReason?)
```
Closes the session and terminates the connection.

<table>
<colgroup>
<col style="width: 23%" />
<col style="width: 76%" />
</colgroup>
<thead>
<tr>
<th colspan="2">Parameters</th>
</tr>
<tr>
<th>reason</th>
<th>(Optional) Reason for closing the session.</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

### [CloseReason](sdk/iOS/SpectaclesKit/Sources/API/SpectaclesSession.swift)

Defines possible reasons for manually closing a session.
```Swift
public enum CloseReason {
    case incompatibleLens
}
```
#### Enum Cases

<table>
<colgroup>
<col style="width: 23%" />
<col style="width: 76%" />
</colgroup>
<thead>
<tr>
<th colspan="2">Cases</th>
</tr>
<tr>
<th>incompatibleLens</th>
<th>The connected Lens is incompatible.</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

### [DisconnectReason](sdk/iOS/SpectaclesKit/Sources/API/SpectaclesSession.swift)

Defines reasons for unexpected disconnection.
```Swift
public enum DisconnectReason: Sendable {
    case sessionClosed
    case connectionLost
}
```
#### Enum Cases

<table>
<colgroup>
<col style="width: 23%" />
<col style="width: 76%" />
</colgroup>
<thead>
<tr>
<th colspan="2">Cases</th>
</tr>
<tr>
<th>sessionClosed</th>
<th>The session was explicitly closed by the caller.</th>
</tr>
<tr>
<th>connectionLost</th>
<th>Connection was lost, likely due to network issues.</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

### [ConnectionStatus](sdk/iOS/SpectaclesKit/Sources/API/SpectaclesSession.swift)

Represents the current state of the connection to a Lens.
```Swift
public enum ConnectionStatus: Sendable {
    case connectStart
    case connected(Metadata)
    case error(any Error)
    case disconnected(DisconnectReason)
}
```
#### Enum Cases

<table>
<colgroup>
<col style="width: 23%" />
<col style="width: 76%" />
</colgroup>
<thead>
<tr>
<th colspan="2">Cases</th>
</tr>
<tr>
<th>connectStart</th>
<th>Indicates the session is starting a connection.</th>
</tr>
<tr>
<th>connected(Metadata)</th>
<th>Connection successfully established; includes identifying metadata
about the Lens.</th>
</tr>
<tr>
<th>error(any Error)</th>
<th>An error occurred during connection or session management.</th>
</tr>
<tr>
<th>disconnected(DisconnectReason)</th>
<th>The connection has ended, either intentionally or due to failure.
The associated reason clarifies the context.</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

### [Metadata](sdk/iOS/SpectaclesKit/Sources/API/SpectaclesSession.swift)

Provides information about the connected Lens.
```Swift
public struct Metadata: Sendable
```
#### Properties

##### lensId
```Swift
public let lensId: String
```
The unique identifier of the Lens.

##### lensVersion
```Swift
public let lensVersion: String
```
The version of the connected Lens.

### [SpectaclesRequestDelegate](sdk/iOS/SpectaclesKit/Sources/API/SpectaclesRequestDelegate.swift)

Delegate for processing incoming Lens requests.
```Swift
public protocol SpectaclesRequestDelegate: AnyObject, Sendable
```
#### Methods

##### processServiceRequest
```Swift
func processServiceRequest(_ request: SpectaclesRequest) async
```
Handles an incoming service request from the Lens asynchronously.

<table>
<colgroup>
<col style="width: 23%" />
<col style="width: 76%" />
</colgroup>
<thead>
<tr>
<th colspan="2">Parameters</th>
</tr>
<tr>
<th>request</th>
<th>The incoming SpectaclesRequest from the Lens that needs to be
processed.</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

### [SpectaclesRequest](sdk/iOS/SpectaclesKit/Sources/API/Requests/SpectaclesRequest.swift)

The SpectaclesRequest is the top-level request abstraction used by the
Spectacles Mobile Kit. It provides a unified representation of all
request types initiated by the SDK. This allows consumers to work
generically with requests while supporting a structured and type-safe
mechanism for handling different categories of requests (e.g., API,
asset).
```Swift
public enum SpectaclesRequest: Sendable
```
#### Enum Cases

<table>
<colgroup>
<col style="width: 23%" />
<col style="width: 76%" />
</colgroup>
<thead>
<tr>
<th colspan="2">Cases</th>
</tr>
<tr>
<th>api</th>
<th>API request (SpectaclesApiRequest).</th>
</tr>
<tr>
<th>assert</th>
<th>Asset requests (SpectaclesAssetRequest).</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

#### Properties

##### underlyingRequest
```Swift
public var underlyingRequest: any RequestProtocol
```
The wrapped request conforms to the RequestProtocol. Useful for generic
handling.

### [SpectaclesRequest.RequestProtocol](sdk/iOS/SpectaclesKit/Sources/API/Requests/SpectaclesRequest.swift)

The base protocol for all internal request types. All request payloads
must conform to this protocol.
```Swift
public protocol RequestProtocol: Sendable
```

### [SpectaclesRequestWithResponseProtocol](sdk/iOS/SpectaclesKit/Sources/API/Requests/SpectaclesRequest.swift)

Represents a request that expects a **single** response (e.g., a
one-time request).
```Swift
public protocol SpectaclesRequestWithResponseProtocol<Payload>: SpectaclesRequest.RequestProtocol
```
#### Associated Types

##### Payload
```Swift
associatedtype Payload: Sendable
```
The type of data returned upon successful request completion.

#### Methods

##### complete
```Swift
func complete(with result: Result<Payload, SpectaclesRequestError>)
```
Completes the request with either a successful result or an error.

### [SpectaclesRequestWithStreamResponseProtocol](sdk/iOS/SpectaclesKit/Sources/API/Requests/SpectaclesRequest.swift)

Represents a request that may produce **multiple** responses (e.g., a
subscription).
```Swift
public protocol SpectaclesRequestWithStreamResponseProtocol<Payload>: SpectaclesRequest.RequestProtocol
```
#### Associated Types

##### Payload
```Swift
associatedtype Payload: Sendable
```
The type of data returned upon successful request completion.

#### Methods

##### yield
```Swift
func yield(_ value: Payload, isComplete: Bool)
```
Delivers a response.

<table>
<colgroup>
<col style="width: 23%" />
<col style="width: 76%" />
</colgroup>
<thead>
<tr>
<th colspan="2">Parameters</th>
</tr>
<tr>
<th>value</th>
<th>The response payload.</th>
</tr>
<tr>
<th>isComplete</th>
<th>Indicates whether to complete the request.</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

##### finish
```Swift
func finish(throwing error: SpectaclesRequestError)
```
Finishes the request with an error.

<table>
<colgroup>
<col style="width: 23%" />
<col style="width: 76%" />
</colgroup>
<thead>
<tr>
<th colspan="2">Parameters</th>
</tr>
<tr>
<th>error</th>
<th>The error.</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

### [SpectaclesRequestWithoutResponseProtocol](sdk/iOS/SpectaclesKit/Sources/API/Requests/SpectaclesRequest.swift)

Describes a request that does not expect a response (e.g., an event).
```Swift
public protocol SpectaclesRequestWithStreamResponseProtocol: SpectaclesRequest.RequestProtocol
```


### [SpectaclesRequestError](sdk/iOS/SpectaclesKit/Sources/API/SpectaclesRequestError.swift)

Enum representing possible errors that can occur during a request.
```Swift
public enum SpectaclesRequestError: Int, Error
```
#### Enum Cases

<table>
<colgroup>
<col style="width: 23%" />
<col style="width: 76%" />
</colgroup>
<thead>
<tr>
<th colspan="2">Cases</th>
</tr>
<tr>
<th>unknown</th>
<th>Default state or unset.</th>
</tr>
<tr>
<th>redirected</th>
<th>Redirected. Corresponds to the 3XX HTTP response status codes.</th>
</tr>
<tr>
<th>badRequest</th>
<th>Bad request. Corresponds to the 4XX HTTP response status codes other
than 401, 403, 404, 408, 413, 414, and 431.</th>
</tr>
<tr>
<th>accessDenied</th>
<th>Access denied. Corresponds to the HTTP response status codes 401 and
403.</th>
</tr>
<tr>
<th>notFound</th>
<th>Not found. Corresponds to the HTTP response status code 404.</th>
</tr>
<tr>
<th>timeout</th>
<th>Timeout. Corresponds to the HTTP response status codes 408 and
504.</th>
</tr>
<tr>
<th>requestTooLarge</th>
<th>Request too large. Corresponds to the HTTP response status codes
413, 414, and 431.</th>
</tr>
<tr>
<th>serverError</th>
<th>Server error. Corresponds to the 5XX HTTP response status codes
other than 504.</th>
</tr>
<tr>
<th>requestCancelled</th>
<th>Request cancelled by the caller.</th>
</tr>
<tr>
<th>internalError</th>
<th>Internal error in the remote API framework.</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

### [SpectaclesApiRequest](sdk/iOS/SpectaclesKit/Sources/API/Requests/SpectaclesApiRequest.swift)

An enum representing API requests made to the mobile app. Requests are
either **call** requests (with a response stream) or **notify** requests
(no response expected). All requests conform to a shared protocol
defining a method name and parameters.
```Swift
public enum SpectaclesApiRequest: Sendable
```
#### Enum Cases

<table>
<colgroup>
<col style="width: 23%" />
<col style="width: 76%" />
</colgroup>
<thead>
<tr>
<th colspan="2">Cases</th>
</tr>
<tr>
<th>call(any SpectaclesApiCallRequestProtocol)</th>
<th>A request that expects a stream-based response from Spectacles. The
payload conforms to SpectaclesApiCallRequestProtocol.</th>
</tr>
<tr>
<th>notify(any SpectaclesApiNotifyRequestProtocol)</th>
<th>A one-way notification that does not expect any response. The
payload conforms to SpectaclesApiNotifyRequestProtocol.</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

#### Properties

##### underlyingRequest
```Swift
public var underlyingRequest: any RequestProtocol
```
The wrapped request conforms to the RequestProtocol. Useful for generic
handling.

### SpectaclesApiRequest.RequestProtocol

The base protocol for all SpectaclesApiRequest variants.
```Swift
public protocol RequestProtocol: SpectaclesRequest.RequestProtocol
```
#### Properties

##### method
```Swift
var method: String { get }
```
The name of the API method being invoked.

##### params
```Swift
var params: ByteArray { get }
```
The serialized parameters for the API method.

### [SpectaclesApiCallRequestProtocol](sdk/iOS/SpectaclesKit/Sources/API/Requests/SpectaclesApiRequest.swift)

A protocol for Lens API calls that expect a stream-based response (e.g.,
a request or subscription).
```Swift
public protocol SpectaclesApiCallRequestProtocol: SpectaclesApiRequest.RequestProtocol,
    SpectaclesRequestWithStreamResponseProtocol where Payload == Data {}
```


### [SpectaclesApiNotifiRequestProtocol](sdk/iOS/SpectaclesKit/Sources/API/Requests/SpectaclesApiRequest.swift)

A protocol for Lens API notifications that do **not** expect a response.
```Swift
public protocol SpectaclesApiNotifyRequestProtocol: SpectaclesApiRequest.RequestProtocol,
    SpectaclesRequestWithoutResponseProtocol {}
```


### [SpectaclesAssetRequest](sdk/iOS/SpectaclesKit/Sources/API/Requests/SpectaclesAssetRequest.swift)

An enum representing asset-related requests. Currently supports loading
asset content.
```Swift
public enum SpectaclesAssetRequest: Sendable
```
#### Enum Cases

<table>
<colgroup>
<col style="width: 23%" />
<col style="width: 76%" />
</colgroup>
<thead>
<tr>
<th colspan="2">Cases</th>
</tr>
<tr>
<th>load(any SpectaclesLoadAssetRequest)</th>
<th>A request to load an asset by URI and version. The result includes
the Asset object.</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

#### Properties

##### underlyingRequest
```Swift
public var underlyingRequest: any RequestProtocol
```
The wrapped request conforms to the RequestProtocol. Useful for generic
handling.

### [SpectaclesAssetRequest.Asset](sdk/iOS/SpectaclesKit/Sources/API/Requests/SpectaclesAssetRequest.swift)

A structure representing an asset, including its name, version, and raw
data.
```Swift
public struct Asset: Sendable {
    public var name: String
    public var version: String?
    public var data: Data
}
```
#### Properties

##### name
```Swift
public var name: String
```
The name of the asset.

##### version
```Swift
public var version: String?
```
The version identifier of the asset being delivered.

This will be returned back to the app in future requests for version
comparison.

##### data
```Swift
public var data: Data
```
The raw data associated with the asset.

### [SpectaclesAssetRequest.RequestProtocol](sdk/iOS/SpectaclesKit/Sources/API/Requests/SpectaclesAssetRequest.swift)

The base protocol for all SpectaclesAssetRequest variants.
```Swift
public protocol RequestProtocol: SpectaclesRequest.RequestProtocol
```


### [SpectaclesLoadAssetRequest](sdk/iOS/SpectaclesKit/Sources/API/Requests/SpectaclesAssetRequest.swift)

Represents a request from the Lens to load a SpectaclesAsset from the
app.
```Swift
public protocol SpectaclesLoadAssetRequest: SpectaclesAssetRequest.RequestProtocol,
    SpectaclesRequestWithResponseProtocol where Payload == SpectaclesAssetRequest.Asset
```


#### Properties

##### uri
```Swift
var uri: String { get }
```
The path or URI of the requested asset.

##### version
```Swift
var version: String? { get }
```

The version of the asset currently cached on Spectacles (if any).  
This may be a file checksum or timestamp, as determined by the SDK or
Lens developer.  
The app can use this to decide whether to:

- return a new version of the asset, or

- indicate that the cached version is still up-to-date.

### [Log](sdk/iOS/SpectaclesKit/Sources/API/Log.swift)

Configures how logging output is produced and allows client applications
to customize or disable logging entirely.
```Swift
public enum Log
```
#### Properties

##### logger
```Swift
public static var logger: (any Logger)?
```
Spectacles Mobile Kit utilizes a logger instance to record events. You
can customize this behavior:

- Assign a custom Logger: Integrate SpectaclesKit logging with your
  application's existing logging systems.

- Assign nil: Disable logging completely.

- Default: The DefaultLogger is used if no custom logger is assigned.

### [Log.Logger](sdk/iOS/SpectaclesKit/Sources/API/Log.swift)

Protocol for custom logging implementations.
```Swift
public protocol Logger: Sendable
```
#### Methods

##### log
```Swift
func log(level: LogLevel, message: @autoclosure () -> String)
```
Logs a message.

<table>
<colgroup>
<col style="width: 23%" />
<col style="width: 76%" />
</colgroup>
<thead>
<tr>
<th colspan="2">Parameters</th>
</tr>
<tr>
<th>level</th>
<th>The severity of the log message.</th>
</tr>
<tr>
<th>message</th>
<th>A string message to log. Evaluated lazily to avoid unnecessary
computation when the message won't be logged.</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

### [Log.LogLevel](sdk/iOS/SpectaclesKit/Sources/API/Log.swift)

Represents the severity level of a log message.
```Swift
public enum LogLevel: Int, Sendable
```
#### Enum Cases

<table>
<colgroup>
<col style="width: 23%" />
<col style="width: 76%" />
</colgroup>
<thead>
<tr>
<th colspan="2">Cases</th>
</tr>
<tr>
<th>debug</th>
<th>Verbose information intended for debugging.</th>
</tr>
<tr>
<th>info</th>
<th>Informational messages for normal operations.</th>
</tr>
<tr>
<th>notice</th>
<th>Significant but non-error events.</th>
</tr>
<tr>
<th>error</th>
<th>Recoverable error conditions.</th>
</tr>
<tr>
<th>fault</th>
<th>Serious errors that may indicate system instability.</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

### [Log.DefaultLogger](sdk/iOS/SpectaclesKit/Sources/API/Log.swift)

Default implementation of Log.Logger that writes logs to the system
os.Logger API.
```Swift
public struct DefaultLogger: Logger
```
#### Methods

##### init
```Swift
public init(level: LogLevel = .info, enablePublicLogging: Bool = false)
```
Logs a message.

<table>
<colgroup>
<col style="width: 23%" />
<col style="width: 76%" />
</colgroup>
<thead>
<tr>
<th colspan="2">Parameters</th>
</tr>
<tr>
<th>level</th>
<th>Minimum severity to log (default: .info).</th>
</tr>
<tr>
<th>enablePublicLogging</th>
<th>Controls privacy marking for message content.</th>
</tr>
</thead>
<tbody>
</tbody>
</table>


