successful result or an error.
## Android APIs

### Permissions

Before using any Spectacles Mobile Kit features, your app must
explicitly request
[<u>BLUETOOTH_CONNECT</u>](https://developer.android.com/reference/android/Manifest.permission#BLUETOOTH_CONNECT)
and
[<u>BLUETOOTH_SCAN</u>](https://developer.android.com/reference/android/Manifest.permission#BLUETOOTH_SCAN)
permissions from the user.

### [SpectaclesKit](sdk/Android/SpectaclesKit/kit/src/main/java/com/snap/spectacles/kit/SpectaclesKit.kt)

The main entry point for working with the Spectacles Mobile Kit. It
manages bonding and session setup between your app and Spectacles.
```Kotlin
interface SpectaclesKit
```

#### Methods

##### bind
```Kotlin
fun bind(
    request: BondingRequest,
    onResult: Consumer<BondingResult>
): Closable
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
<th colspan="2" style="text-align: left;">Parameters</th>
</tr>
<tr>
<th style="text-align: left;">request</th>
<th style="text-align: left;">Identifies the Lens to bind with.</th>
</tr>
<tr>
<th style="text-align: left;">onResult</th>
<th style="text-align: left;">Callback to receive the bonding
result.</th>
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
<th colspan="2" style="text-align: left;">Returns</th>
</tr>
<tr>
<th style="text-align: left;">Closable</th>
<th>Represents the ongoing bonding process. Call close() to cancel it if
needed.</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

##### unbind
```Kotlin
fun unbind(
    id: String,
    onResult: Consumer<UnbindingResult>,
    graceful: Boolean = true
): Closable
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
<th>onResult</th>
<th>Callback to receive the unbinding result.</th>
</tr>
<tr>
<th>graceful</th>
<th>Whether to unbind gracefully. Default is true</th>
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
<th>Closable</th>
<th>Represents the ongoing unbinding process. Call close() to cancel it
if needed.</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

##### avaliableBondings
```Kotlin
fun avaliableBondings(): List<Bonding>
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
<th>List&lt;Bonding&gt;</th>
<th>A list of existing bondings.</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

##### getBonding
```Kotlin
fun getBonding(id: String): Bonding?
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
```Kotlin
fun createSession(
    bonding: Bonding,
    request: SessionRequest,
    delegateBuiler: (SpectaclesSession) -> SpectaclesRequestDelegate
): SpectaclesSession
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

### [SpectaclesKit.Builder](sdk/Android/SpectaclesKit/kit/src/main/java/com/snap/spectacles/kit/SpectaclesKit.kt)

Used to create a SpectaclesKit instance with required app credentials.
```Kotlin
interface Builder
```

#### Methods

##### setIdentifier
```Kotlin
fun setIdentifier(identifier: ClientIdentifier): Builder
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
```Kotlin
fun setVersion(version: String): Builder
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

##### setRequestExecutor
```Kotlin
fun setRequestExecutor(executor: Executor): Builder
```
Sets the executor used to handle Lens requests.

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
<th>executor</th>
<th>The requests executor.</th>
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
```Kotlin
fun build(): SpectaclesKit
```
Builds and returns a SpectaclesKit instance.

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
<th>SpectaclesKit</th>
<th>The SpectaclesKit instance.</th>
</tr>
</thead>
<tbody>
</tbody>
</table>


### [newBuilder](sdk/Android/SpectaclesKit/kit/src/main/java/com/snap/spectacles/kit/SpectaclesKitBuilder.kt)

Creates a SpectaclesKit.Builder with the provided context.
```Kotlin
fun newBuilder(contex: Context): SpectaclesKit.Bulder
```


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
<th>context</th>
<th>Android context</th>
</tr>
</thead>
<tbody>
</tbody>
</table>


### [SpectaclesKit.ClientIdentifier](sdk/Android/SpectaclesKit/kit/src/main/java/com/snap/spectacles/kit/SpectaclesKit.kt)

Represents your app's unique identifier.
```Kotlin
data class ClientIdentifier(val value: String)
```
#### Properties

##### value
```Kotlin
val value: String
```
The client identifier.

### [SpectaclesKit.BondingRequest](sdk/Android/SpectaclesKit/kit/src/main/java/com/snap/spectacles/kit/SpectaclesKit.kt)

Represents a request to initiate bonding with a specific Lens.
```Kotlin
sealed class BondingRequest {
    data class SingleLensByLensId(val lensId: String) : BondingRequest()
    data class SingleLensByLensName(val lensName: String) : BondingRequest()
}
```


### [SpectaclesKit.BondingRequest.SingleLensByLensId](sdk/Android/SpectaclesKit/kit/src/main/java/com/snap/spectacles/kit/SpectaclesKit.kt)

Request to bind with a Lens using its unique ID.
```Kotlin
data class SingleLensByLensId(val lensId: String) : BondingRequest
```
#### Properties

##### lensId
```Kotlin
val lensId: String
```
The unique identifier of the Lens to bind with.

### [SpectaclesKit.BondingRequest.SingleLensByLensName](sdk/Android/SpectaclesKit/kit/src/main/java/com/snap/spectacles/kit/SpectaclesKit.kt)

Request to bind using a Lens's name.

⚠️Since names are not unique, this is for development use. Use
SingleLensByLensId in production for better security.
```Kotlin
data class SingleLensByLensName(val lensName: String) : BondingRequest
```
#### Properties

##### lensName
```Kotlin
val lensName: String
```
The name of the Lens to bind with.

### [SpectaclesKit.BondingRequest](sdk/Android/SpectaclesKit/kit/src/main/java/com/snap/spectacles/kit/SpectaclesKit.kt)

Represents the result of a bonding attempt.
```Kotlin
sealed class BondingResult {
    data class Success(val bonding: Bonding) : BondingResult()
    data class Failure(val exception: Exception) : BondingResult()
}
```


### [SpectaclesKit.BondingRequest.Success](sdk/Android/SpectaclesKit/kit/src/main/java/com/snap/spectacles/kit/SpectaclesKit.kt)

Indicates a successful bonding.
```Kotlin
data class Success(val bonding: Bonding) : BondingResult
```
#### Properties

##### bonding
```Kotlin
val bonding: Bonding
```
The resulting Bonding instance.

### [SpectaclesKit.BondingRequest.Failure](sdk/Android/SpectaclesKit/kit/src/main/java/com/snap/spectacles/kit/SpectaclesKit.kt)

Indicates a bonding failure.
```Kotlin
data class Failure(val exception: Exception) : BondingResult
```
#### Properties

##### exception
```Kotlin
val exception: Exception
```
The exception that caused the failure.

### [SpectaclesKit.Bonding](sdk/Android/SpectaclesKit/kit/src/main/java/com/snap/spectacles/kit/SpectaclesKit.kt)

Represents a secure bonding between the app and a Lens.
```Kotlin
interface Bonding(val id: String)
```
#### Properties

##### id
```Kotlin
val id: String
```
The unique ID of the bonding.

### [SpectaclesKit.UnbindingResult](sdk/Android/SpectaclesKit/kit/src/main/java/com/snap/spectacles/kit/SpectaclesKit.kt)

Represents the result of an unbinding operation.
```Kotlin
sealed class UnbindingResult {
    data object Success : UnbindingResult()
    data class Failure(val exception: Exception) : UnbindingResult()
}
```


### [SpectaclesKit.UnbindingResult.Success](sdk/Android/SpectaclesKit/kit/src/main/java/com/snap/spectacles/kit/SpectaclesKit.kt)

Indicates a successful unbinding.
```Kotlin
data object Success : UnbindingResult
```


### [SpectaclesKit.UnbindingResult.Failure](sdk/Android/SpectaclesKit/kit/src/main/java/com/snap/spectacles/kit/SpectaclesKit.kt)

Indicates an unbinding failure.
```Kotlin
data class Failure(val exception: Exception) : UnbindingResult
```
#### Properties

##### exception
```Kotlin
val exception: Exception
```
The exception that caused the failure.

### [ClientException](sdk/Android/SpectaclesKit/kit/src/main/java/com/snap/spectacles/kit/ClientException.kt)

Base class for exceptions related to SpectaclesKit client errors.
```Kotlin
open class ClientException(
    message: String,
    cause: Exception? = null
) : Exception(message, cause) {
    /**
     * Exception thrown when the Lens SpectaclesKit is not installed.
     */
    class LensClientNotInstalled(message: String) : ClientException(message)

    /**
     * Exception thrown when the specified device is not found.
     */
    class DeviceNotFound(message: String): ClientException(message)

    /**
     * Exception thrown when the Spectacles app is not installed.
     */
    class SpectaclesAppNotInstalled(message: String): ClientException(message)

    /**
     * Exception thrown when the Spectacles app is not enabled.
     */
    class SpectaclesAppNotEnabled(message: String): ClientException(message)

    /**
     * Exception thrown when the Spectacles app needs to be updated.
     */
    class SpectaclesAppUpdateRequired(message: String): ClientException(message)
}
```


### [SpectaclesKit.SessionRequest](sdk/Android/SpectaclesKit/kit/src/main/java/com/snap/spectacles/kit/SpectaclesKit.kt)

Represents configuration options for establishing a session with
Spectacles.
```Kotlin
sealed abstract class SessionsRequest
```
#### Properties

##### autoReconnect
```Kotlin
val autoReconnect: Boolean
```
If true, the session will try to reconnect automatically.

##### acceptUnfusedSpectacles
```Kotlin
val acceptUnfusedSpectacles: Boolean
```
Allows connections to unfused (debug) Spectacles.

##### preSharedSecret
```Kotlin
val preSharedSecret: Pair<ByteArray, ByteArray>?
```
Internal use only.

##### acceptUntrustedLens
```Kotlin
val acceptUntrustedLens: Boolean
```
Allows untrusted Lens connections, useful for development with Lenses
pushed from Lens Studio.

### [SpectaclesKit.SessionRequest.Default](sdk/Android/SpectaclesKit/kit/src/main/java/com/snap/spectacles/kit/SpectaclesKit.kt)

A default implementation of SessionRequest with standard values.
```Kotlin
data class Default(
    override val autoReconnect: Boolean = true,
    override val acceptUnfusedSpectacles: Boolean = false,
    override val preShareSecret: Pair<ByteArray, ByteArray>? = null,
    override val acceptUntrustedLens: Boolean = false
) : SessionRequest
```

### [SpectaclesSession](sdk/Android/SpectaclesKit/kit/src/main/java/com/snap/spectacles/kit/SpectaclesSession.kt)

Represents an active session for connecting to and interacting with a
specific Lens.
```Kotlin
interface SpectaclesSession
```
#### Methods

##### observeConnectionstatus
```Kotlin
fun observeConnectionStatus(onStatus: Consumer<ConnectionStatus>): Closable
```
Subscribes to connection status updates for the session.

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
<th>onStatus</th>
<th>Callback that receives updates when the connection status
changes.</th>
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
<th>Closable</th>
<th>Call close() to unsubscribe from status updates.</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

##### connectionStatus
```Kotlin
fun connectionStatus(): ConnectionStatus
```
Retrieves the current connection status of the session.

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
<th>ConnectionStatus</th>
<th>The current session state.</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

##### close
```Kotlin
fun close(reason: ClonseReason?)
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

### [SpectaclesSession.CloseReason](sdk/Android/SpectaclesKit/kit/src/main/java/com/snap/spectacles/kit/SpectaclesSession.kt)

Defines possible reasons for manually closing a session.
```Kotlin
enum class CloseReason
```
#### Enum Values

<table>
<colgroup>
<col style="width: 23%" />
<col style="width: 76%" />
</colgroup>
<thead>
<tr>
<th colspan="2">Values</th>
</tr>
<tr>
<th>INCOMPATIBLE_LENS</th>
<th>The connected Lens is incompatible.</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

### [SpectaclesSession.DisconnectReason](sdk/Android/SpectaclesKit/kit/src/main/java/com/snap/spectacles/kit/SpectaclesSession.kt)

Defines reasons for unexpected disconnection.
```Kotlin
enum class DisconnectReason
```
#### Enum Values

<table>
<colgroup>
<col style="width: 23%" />
<col style="width: 76%" />
</colgroup>
<thead>
<tr>
<th colspan="2">Values</th>
</tr>
<tr>
<th>SESSION_CLOSED</th>
<th>The session was explicitly closed by the caller.</th>
</tr>
<tr>
<th>CONNECTION_LOST</th>
<th>Connection was lost, likely due to network issues.</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

### [SpectaclesSession.ConnectionStatus](sdk/Android/SpectaclesKit/kit/src/main/java/com/snap/spectacles/kit/SpectaclesSession.kt)

Represents the current state of the connection to a Lens.
```Kotlin
sealed class ConnectionStatus {
    object ConnectStart : ConnectionStatus()
    data class Connected(val sessionMetadata: Metadata) : ConnectionStatus
    data class Error(val exception: Exception) : ConnectionStatus
    data class Disconnected(val reason: DisconnectReason) : ConnectionStatus
}
```


### [SpectaclesSession.ConnectionStatus.ConnectStart](sdk/Android/SpectaclesKit/kit/src/main/java/com/snap/spectacles/kit/SpectaclesSession.kt)

Indicates the session is starting a connection.
```Kotlin
object ConnectStart : ConnectionStatus
```


### [SpectaclesSession.ConnectionStatus.Connected](sdk/Android/SpectaclesKit/kit/src/main/java/com/snap/spectacles/kit/SpectaclesSession.kt)

Connection successfully established.
```Kotlin
data class Connected(val sessionMetadata: Metadata) : ConnectionStatus
```
#### Properties

##### sessionMetadata
```Kotlin
val sessionMetadata: Metadata
```
The Metadata about the connected Lens.

### [SpectaclesSession.ConnectionStatus.Error](sdk/Android/SpectaclesKit/kit/src/main/java/com/snap/spectacles/kit/SpectaclesSession.kt)

The connection attempt failed.
```Kotlin
data class Error(val exception: Exception) : ConnectionStatus
```
#### Properties

##### exception
```Kotlin
val exception: Exception
```
Provides the error details.

### [SpectaclesSession.ConnectionStatus.Disconnected](sdk/Android/SpectaclesKit/kit/src/main/java/com/snap/spectacles/kit/SpectaclesSession.kt)

The session was disconnected.
```Kotlin
data class Disconnected(val reason: DisconnectReason) : ConnectionStatus
```
#### Properties

##### exception
```Kotlin
val reason: DisconnectReason
```
Explains the cause of disconnection.

### [SpectaclesSession.Metadata](sdk/Android/SpectaclesKit/kit/src/main/java/com/snap/spectacles/kit/SpectaclesSession.kt)

Provides information about the connected Lens.
```Kotlin
data class Metadata(
    val lensId: String,
    val lensVersion: String
)
```
#### Properties

##### lensId
```Kotlin
val lensId: String
```
The unique identifier of the Lens.

##### lensVersion
```Kotlin
val lensVersion: String
```
The version of the connected Lens.

### [SpectaclesRequestDelegate](sdk/Android/SpectaclesKit/kit/src/main/java/com/snap/spectacles/kit/SpectaclesRequestDelegate.kt)

Implement this interface to handle incoming requests from a connected
Lens.

```Kotlin
interface SpectaclesRequestDelegate
```
#### Methods

##### processServiceRequest
```Kotlin
fun processServiceRequest(request: SpectaclesReqeust)
```
Invoked when the connected Lens sends a request.

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

### [SpectaclesRequest](sdk/Android/SpectaclesKit/kit/src/main/java/com/snap/spectacles/kit/SpectaclesRequest.kt)

Base class for different types of Lens requests.
```Kotlin
sealed interface SpectaclesRequest
```


### [SpectaclesRequest.WithoutResponse](sdk/Android/SpectaclesKit/kit/src/main/java/com/snap/spectacles/kit/SpectaclesRequest.kt)

Describes a request that does not expect a response (e.g., an event).

```Kotlin
abstract class WithoutResponse : SpectaclesRequest
```


### [SpectaclesRequest.WithResponse](sdk/Android/SpectaclesKit/kit/src/main/java/com/snap/spectacles/kit/SpectaclesRequest.kt)

Represents a request that expects a **single** response (e.g., a
one-time request).

```Kotlin
abstract class WithResponse<Payload: Any> : SpectaclesRequest
```
#### Properties

##### onResponse

```Kotlin
abstract val onResponse: Consumer<Payload>
```
Invoked to deliver a successful response.

##### onError

```Kotlin
abstract val onError: Consumer<SpectaclesRequestException>
```
Invoked to report an error.

### [SpectaclesRequest.WithResponses](sdk/Android/SpectaclesKit/kit/src/main/java/com/snap/spectacles/kit/SpectaclesRequest.kt)

Represents a request that may produce **multiple** responses (e.g., a
subscription).

```Kotlin
abstract class WithResponses<Payload: Any> : SpectaclesRequest
```
#### Properties

##### onResponse

```Kotlin
abstract val onResponse: Consumer<Payload>
```
Invoked to deliver a successful response.

##### onError

```Kotlin
abstract val onError: Consumer<SpectaclesRequestException>
```
Invoked to report an error.

### [SpectaclesRequest.Response](sdk/Android/SpectaclesKit/kit/src/main/java/com/snap/spectacles/kit/SpectaclesRequest.kt)

Base class for all response types.
```Kotlin
sealed class Response<Payload: Any>
```
#### Properties

##### payload

```Kotlin
abstract val payload: Payload
```
The concrete response payload.

### [SpectaclesRequest.Response.Ongoing](sdk/Android/SpectaclesKit/kit/src/main/java/com/snap/spectacles/kit/SpectaclesRequest.kt)

Represents an intermediate response, indicating that more responses will
follow.

Typically used for subscription-style requests.
```Kotlin
data class Ongoing<Payload: Any>(
    override val payload: Payload
) : Response<Payload>
```


### [SpectaclesRequest.Response.Complete](sdk/Android/SpectaclesKit/kit/src/main/java/com/snap/spectacles/kit/SpectaclesRequest.kt)

Represents the final response.

Once a Complete is delivered, no further responses will be sent for the
request.
```Kotlin
data class Complete<Payload: Any>(
    override val payload: Payload
) : Response<Payload>
```


### [SpectaclesApiReques](sdk/Android/SpectaclesKit/kit/src/main/java/com/snap/spectacles/kit/SpectaclesApiReques.kt)

Base interface for all Lens API requests.
```Kotlin
sealed interface SpectaclesApiRequest
```


### [SpectaclesApiRequest.Payload](sdk/Android/SpectaclesKit/kit/src/main/java/com/snap/spectacles/kit/SpectaclesApiReques.kt)

Encapsulates the method name and raw parameters for an API request.
```Kotlin
data class Payload(
    val method: String,
    val params: ByteArray
)
```
#### Properties

##### method
```Kotlin
val method: String
```
The name of the API method being invoked.

##### params
```Kotlin
val params: ByteArray
```
The serialized parameters for the API method.

### [SpectaclesApiRequest.Call](sdk/Android/SpectaclesKit/kit/src/main/java/com/snap/spectacles/kit/SpectaclesApiReques.kt)

Represents an API call that expects one or more responses (e.g., a
request or subscription).
```Kotlin
data class Call(
    val payload: Payload,
    override val onResponse: Consumer<Payload>
    override val onError: Consumer<SpectaclesRequestException>
) : SpectaclesApiRequest, SpectaclesRequest.WithResponses<ByteArray>()
```
#### Properties

##### payload
```Kotlin
val payload: Payload
```
The payload (method and parameters) of this API call.

##### onResponse
```Kotlin
val onResponse: Consumer<Payload>
```
Called to deliver one or more successful responses.

##### onError
```Kotlin
val onError: Consumer<SpectaclesRequestException>
```
Called to report an error.

### [SpectaclesApiRequest.Notify](sdk/Android/SpectaclesKit/kit/src/main/java/com/snap/spectacles/kit/SpectaclesApiReques.kt)

Represents a one-way API notification (event) that does **not** expect a
response.
```Kotlin
data class Notify(
    val payload: Payload
) : SpectaclesApiRequest, SpectaclesRequest.WithoutResponses()
```
#### Properties

##### payload
```Kotlin
val payload: Payload
```
The payload (method and parameters) of this API notification.

### [SpectaclesAssetRequest](sdk/Android/SpectaclesKit/kit/src/main/java/com/snap/spectacles/kit/SpectaclesAssetRequest.kt)

Base interface for all Lens asset requests.
```Kotlin
sealed interface SpectaclesAssetRequest
```


### [SpectaclesAssetRequest.Load](sdk/Android/SpectaclesKit/kit/src/main/java/com/snap/spectacles/kit/SpectaclesAssetRequest.kt)

Represents a request from the Lens to load a SpectaclesAsset from the
app.
```Kotlin
data class Load(
    val path: String,
    val version: String?,
    override val onResponse: Consumer<SpectaclesAsset>,
    override val onError: Consumer<SpectaclesRequestException>,
) : SpectaclesAssetRequest, SpectaclesRequest.WithResponse<SpectaclesAsset>()
```


#### Properties

##### path
```Kotlin
val path: String
```
The path or URI of the requested SpectaclesAsset.

##### version
```Kotlin
val version: String?
```
The version of the asset currently cached on Spectacles (if any).  
This may be a file checksum or timestamp, as determined by the SDK or
Lens developer.  
The app can use this to decide whether to:

- return a new version of the asset, or

- indicate that the cached version is still up-to-date.

##### onResponse
```Kotlin
val onResponse: Consumer<SpectaclesAsset>
```
Called to deliver the asset response to the Lens.

Should be invoked exactly once.

##### onError
```Kotlin
val onError: Consumer<SpectaclesRequestException>
```
Called to report an error if the asset cannot be provided.

### SpectaclesAsset

Base class for responses payload to a SpectaclesAssetRequest.
```Kotlin
sealed class SpectaclesAsset
```


### [SpectaclesAsset.Content](sdk/Android/SpectaclesKit/kit/src/main/java/com/snap/spectacles/kit/SpectaclesAssetRequest.kt)

Represents the content of an asset to be delivered to the Lens.
```Kotlin
data class Content(
    val version: String?,
    val assetSize: Long,
    val dataStream: InputStream
) : SpectaclesAsset()
```
#### Properties

##### version
```Kotlin
val version: String?
```
The version identifier of the asset being delivered.

This will be returned back to the app in future requests for version
comparison.

##### assetSize
```Kotlin
val assetSize: Long
```
The total size of the asset in bytes.

##### dataStream
```Kotlin
val dataStream: InputStream
```
The binary content of the asset, streamed to the Lens.

### [SpectaclesAsset.UpToDate](sdk/Android/SpectaclesKit/kit/src/main/java/com/snap/spectacles/kit/SpectaclesAssetRequest.kt)

Indicates that the cached version of the asset on Spectacles is current
and does not need to be updated.
```Kotlin
data object UpToDate : SpectaclesAsset()
```


### [SpectaclesRequestException](sdk/Android/SpectaclesKit/kit/src/main/java/com/snap/spectacles/kit/SpectaclesRequestException.kt)

Exception thrown when a request to the Spectacles fails.

```Kotlin
open class SpectaclesRequestException(
    statusCode: Int
) : SpectaclesStreamException(statusCode) {

    /**
     * Default state or unset.
     */
    data object Unknown : SpectaclesRequestException(500)

    /**
     * Redirected. Corresponds to the 3XX HTTP response status codes.
     */
    data object Redirected : SpectaclesRequestException(302)

    /**
     * Bad request. Corresponds to the 4XX HTTP response status codes other
     * than 401, 403, 404, 408, 413, 414, and 431.
     */
    data object BadRequest : SpectaclesRequestException(400)

    /**
     * Access denied. Corresponds to the HTTP response status codes 401 and 403.
     */
    data object AccessDenied : SpectaclesRequestException(403)

    /**
     * Not found. Corresponds to the HTTP response status code 404.
     */
    data object NotFound : SpectaclesRequestException(404)

    /**
     * Timeout. Corresponds to the HTTP response status codes 408 and 504.
     */
    data object Timeout : SpectaclesRequestException(504)

    /**
     * Request too large. Corresponds to the HTTP response status codes 413, 414, and 431.
     */
    data object RequestTooLarge : SpectaclesRequestException(413)

    /**
     * Server error. Corresponds to the 5XX HTTP response status codes other than 504.
     */
    data object ServerError : SpectaclesRequestException(500)

    /**
     * Request cancelled by the caller.
     */
    data object RequestCancelled : SpectaclesRequestException(409)

    /**
     * Internal error in the remote API framework.
     */
    data object InternalError : SpectaclesRequestException(500)
}
```


### [Log](sdk/Android/SpectaclesKit/kit/src/main/java/com/snap/spectacles/kit/util/Log.kt)

Interface for logging functionality.

Allows setting a custom logging provider that can be used across the
application.
```Kotlin
interface Log
```
#### Properties

##### provider
```Kotlin
@JvmStatic val provider: ((String) -> Log?)? = null
```
Holds the current logging provider instance used to create Log
instances.

If set to null, logging will be disabled.

#### Methods

##### get
```Kotlin
@JvmStatic fun get(String): Log
```

Retrieves a Log instance associated with the given tag.

##### enabled
```Kotlin
fun enabled(): Boolean
```
Returns true if logging is enabled.

##### verbose
```Kotlin
fun verbose(message: () -> String)
```
Sends a VERBOSE log message.

##### info
```Kotlin
fun info(message: () -> String)
```
Sends an INFO log message.

##### debug
```Kotlin
fun debug(message: () -> String)
```
Sends a DEBUG log message.

##### warn
```Kotlin
fun warn(message: () -> String)
```
Sends a WRAN message without a stack trace.

##### warn
```Kotlin
fun warn(throwable: Throwable, message: () -> String)
```
Sends a WRAN message with a stack trace.

##### err
```Kotlin
fun err(message: () -> String)
```
Sends an ERROR message without a stack trace.

##### err
```Kotlin
fun err(throwable: Throwable, message: () -> String)
```
Sends an ERROR message with a stack trace.

### [Log.System](sdk/Android/SpectaclesKit/kit/src/main/java/com/snap/spectacles/kit/util/Log.kt)

This implements the Log interface using the Android logging class.
```Kotlin
class System(private val tag: String) : Log
```


### [Log.Disabled](sdk/Android/SpectaclesKit/kit/src/main/java/com/snap/spectacles/kit/util/Log.kt)

A built-in Log implementation that disables all logging.

All log methods are no-ops, and enabled() always returns false.

```Kotlin
class Disabled(private val tag: String) : Log
```

