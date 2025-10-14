## Lens APIs

### SpectaclesMobileKitModule

**SpectaclesMobileKitModule** serves as the primary entry point for the
Spectacles Mobile Kit, enabling interaction with a specific mobile
application, such as requesting data or receiving events.

You can access the Spectacles Mobile Kit through the
**SpectaclesMobileKitModule** asset like this:
```JavaScript
//@input Asset.SpectaclesMobileKitModule mobileKitModule
const mobileKitModule = script.mobileKitModule
```

⚠️ **Best Practice**: Only one **SpectaclesMobileKitModule** should be
used per Lens.

⚠️ **Privacy Note**: Using **SpectaclesMobileKitModule** requires the
**INTERNET** permission. By default, access to sensitive data is
restricted when a Lens uses internet-connected components. To enable
access to both sensitive data and the internet simultaneously, certain
Experimental APIs must be activated through a feature called
[<u>Extended
Permissions</u>](https://developers.snap.com/spectacles/permission-privacy/experimental-apis).
Note that Lenses using Extended Permissions cannot be published.

### Start Session

To begin interacting with your mobile application, a Lens must first
start a session. Once the mobile application connects to the session,
the Lens can start communicating with it.
```JavaScript
const session = mobileKitModule.createSession()
session.onDisconnected.add(() => {
    print('disconnected!')
})
session.onConnected.add(() => {
    print('connected!')
})
session.start()
```

### Authentication

Before exchanging data, it’s recommended to authenticate the connected
mobile application. A Lens can request the SHA-256 digest of the app and
verify it against a known trusted value.
```JavaScript
// The "app://digest" request is handled internally,
// not forwarded to the mobile app.
// It retrieves the SHA-256 digest of the connected mobile application,
// allowing the Lens to verify whether the app is trusted.
try {
    const response = await session.sendRequest('app://digest')

    // Validate the received digest against the expected value.
    print(`Digest: ${response}`)
} catch (error) {
    print(`Error: ${error}`)
}
```

### Send Requests

Use sendRequest() to send a message to the connected mobile app and wait
for a response.
```JavaScript
try {
    const response = await session.sendRequest('hello world!')
    print(`Response: ${response}`)
} catch (error) {
    print(`Error: ${error}`)
}
```

### Send Events

Use sendData() to send a one-way message to the connected mobile app.
This is a fire-and-forget operation, no response is expected.
```JavaScript
session.sendData('A Event!')
```

### Subscribe Events

Lens can subscribe to events pushed from the connected mobile app using
startSubscription().
```JavaScript
// subscribe to a topic
const subscription = session.startSubscription(
    'Topic-1',
    (error) => {
        print(`Subscription error: ${error}`)
    }
)

subscription.add((event) => {
    print(`Subscription event: ${event}`)
})
```

### Remote Assets

To load remote resources (e.g., texture, audio or other resources)
hosted by the connected mobile application, use the
*<u>spectacleskit://</u>* scheme.
This works with the [<u>RemoteMediaModule</u>](https://developers.snap.com/lens-studio/api/lens-scripting/classes/Built-In.RemoteMediaModule.html).
```JavaScript
const remoteMediaModule = require("LensStudio:RemoteMediaModule")

const textureId = 'spectacleskit://test.png'
remoteMediaModule.loadAsImageTexture(
    textureId,
    (texture) => {
        mainPass.baseTex = texture
    },
    (error) => {
        print(`Error loading asset: ${error}`)
    }
)

const meshId = 'spectacleskit://test.glb'
remoteMediaModule.loadAsGltfAsset(
    meshId,
    (asset) => {
        asset.tryInstantiate(
            script.gltfContainer,
            script.gltfMaterial
        )
        // You can now find a new object in script.gltfContainer
    },
    (error)=> {
        print(`Error loading asset: ${error}`)
    }
)
```

