# WebSocket

## Overview

Spectacles offers the standardized WebSocket API to connect to real-time streams on the internet. This API is based on the [MDN reference](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket).

> **Important:** Accessing the internet in a Lens will disable access to privacy-sensitive user information in that Lens, such as the camera frame, location, and audio. For testing and experimental purposes however, extended permissions are available to access both the camera frame and the open internet at the same time. Note that lenses built this way may not be released publicly. Please see Extended Permissions doc for more information.

> **Exception:** There is an exception to this rule: if a WebSocket connection is created using the `createAPIWebSocket` and the associated specification ID is allowlisted, then both privacy-sensitive user data and internet access can be used simultaneously, even when Extended Permissions are disabled.

> **Note:** Prior to Lens Studio 5.9, `createWebSocket` was available via the `RemoteServiceModule`. From Lens Studio 5.9, this APIs has been moved to the `InternetModule`. Lenses that are already public can continue to use this method in `RemoteServiceModule` until they are re-published with Lens Studio 5.9.

## Getting Started

### Prerequisites

- Lens Studio v5.4.0 or later
- Spectacles OS v5.059 or later
- This API is only available on Spectacles.

### Setup Instructions

To use the WebSocket API add the `InternetModule` to your project and include it in your scripts as per the examples below.

> **Note:** The WebSocket API will only work in the Preview window if the Device Type Override is set to Spectacles.

## Core Component

The `InternetModule` exposes the WebSocket API. To connect to a WebSocket server, use the `createWebSocket` command with a `ws` or `wss` url.

> **Important:** Using insecure connections (`ws`) requires enabling Experimental APIs. While these Lenses are suitable for testing purposes, they cannot be published. Lenses employing secure connections (`wss`) are eligible for publication.

You can utilize the returned WebSocket object to manage the connection. For instance, you can monitor for a successful connection through the `onopen` property, handle incoming messages using the `onmessage` property, and send messages with the `send` method. The example below demonstrates how to perform all these actions:

### TypeScript

```typescript
@component
export class WebSocketExample extends BaseScriptComponent {
  @input
  remoteServiceModule: RemoteServiceModule;

  private socket!: WebSocket;

  // Method called when the script is awake
  async onAwake() {
    this.socket = this.remoteServiceModule.createWebSocket('wss://<some-url>');
    this.socket.binaryType = 'blob';

    // Listen for the open event
    this.socket.onopen = (event: WebSocketEvent) => {
      // Socket has opened, send a message back to the server
      this.socket.send('Message 1');

      // Try sending a binary message
      // (the bytes below spell 'Message 2')
      const message: number[] = [77, 101, 115, 115, 97, 103, 101, 32, 50];
      const bytes = new Uint8Array(message);
      this.socket.send(bytes);
    };

    // Listen for messages
    this.socket.onmessage = async (event: WebSocketMessageEvent) => {
      if (event.data instanceof Blob) {
        // Binary frame, can be retrieved as either Uint8Array or string
        const bytes = await event.data.bytes();
        const text = await event.data.text();
        print('Received binary message, printing as text: ' + text);
      } else {
        // Text frame
        const text: string = event.data;
        print('Received text message: ' + text);
      }
    };

    this.socket.onclose = (event: WebSocketCloseEvent) => {
      if (event.wasClean) {
        print('Socket closed cleanly');
      } else {
        print('Socket closed with error, code: ' + event.code);
      }
    };

    this.socket.onerror = (event: WebSocketEvent) => {
      print('Socket error');
    };
  }
}
```

### JavaScript

```javascript
//@input Asset.RemoteServiceModule remoteServiceModule
/** @type {RemoteServiceModule} */
var remoteServiceModule = script.remoteServiceModule;

let socket = remoteServiceModule.createWebSocket('wss://<some-url>');
socket.binaryType = 'blob';

// Listen for the open event
socket.onopen = (event) => {
  // Socket has opened, send a message back to the server
  socket.send('Message 1');

  // Try sending a binary message
  // (the bytes below spell 'Message 2')
  const message = [77, 101, 115, 115, 97, 103, 101, 32, 50];
  const bytes = new Uint8Array(message);
  socket.send(bytes);
};

// Listen for messages
socket.onmessage = async (event) => {
  if (event.data instanceof Blob) {
    // Binary frame, can be retrieved as either Uint8Array or string
    let bytes = await event.data.bytes();
    let text = await event.data.text();
    print('Received binary message, printing as text: ' + text);
  } else {
    // Text frame
    let text = event.data;
    print('Received text message: ' + text);
  }
};

socket.onclose = (event) => {
  if (event.wasClean) {
    print('Socket closed cleanly');
  } else {
    print('Socket closed with error, code: ' + event.code);
  }
};

socket.onerror = (event) => {
  print('Socket error');
};
```

## Known Limitations

The WebSocket API supports all methods in the standard, with the following exceptions:

- The `Blob` type does not yet support `ArrayBuffer` or `Stream`.
- `WebSocket.binaryType` does not support `arrayBuffer`.
- The `extensions`, `protocol` and `bufferedAmount` properties are not supported. 