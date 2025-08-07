# ASR Module

## Overview

The ASR Module enables the integration of Speech-to-Text functionality within Lenses, offering support for 40+ languages, including mixed language input. It delivers high accuracy, accommodating various accents and non-native speakers effectively.

## Getting Started

### Prerequisites

- Lens Studio v5.9.0 or later
- Spectacles OS v5.61 or later
- This API is only available on Spectacles.

## Scripting Example

Create a new TypeScript or JavaScript file in the Asset Browser and drag it into the Scene. Open the script for editing and add the following lines to include the AsrModule:

```javascript
const asrModule = require('LensStudio:AsrModule');
```

## Defining Callbacks

Transcription updates and errors are handled using callbacks.

```javascript
const onTranscriptionUpdate = (
  eventArgs: AsrModule.TranscriptionUpdateEvent
) => {
  print(
    `onTranscriptionUpdateCallback text=${eventArgs.text}, isFinal=${eventArgs.isFinal}`
  );
};

const onTranscriptionError = (errorCode: AsrModule.AsrStatusCode) => {
  print(`onTranscriptionErrorCallback errorCode: ${errorCode}`);
  switch (errorCode) {
    case AsrModule.AsrStatusCode.InternalError:
      print('stopTranscribing: Internal Error');
      break;
    case AsrModule.AsrStatusCode.Unauthenticated:
      print('stopTranscribing: Unauthenticated');
      break;
    case AsrModule.AsrStatusCode.NoInternet:
      print('stopTranscribing: No Internet');
      break;
  }
};
```

## Transcription Options

The ASR Transcription Options object allows to configure the AsrModule. To create options:

```javascript
const options = AsrModule.AsrTranscriptionOptions.create();
options.silenceUntilTerminationMs = 1000;
options.mode = AsrModule.AsrMode.HighAccuracy;
options.onTranscriptionUpdateEvent.add((eventArgs) =>
  onTranscriptionUpdate(eventArgs);
);
options.onTranscriptionErrorEvent.add((eventArgs) =>
  onTranscriptionError(eventArgs);
);
```

`silenceUntilTerminationMs` specifies the duration in milliseconds of detected silence after which the current transcribed sentence or fragment is marked as final. Once a transcription is finalized, a new transcription begins within the same session. This process continues until the client explicitly stops the session.

`mode` is the operation mode of the ASR session. Possible values are:

- `HighAccuracy`
- `Balanced`
- `HighSpeed`

## Start and Stop Transcribing

To start transcribing, pass your options object into the `startTranscribing` function:

```javascript
asrModule.startTranscribing(options);
```

Call `stopTranscribing` to stop:

```javascript
asrModule.stopTranscribing().then(function () {
  print(`Transcribing stopped`);
});
```

## Full Script

### TypeScript

```typescript
@component
export class AsrExample extends BaseScriptComponent {
  private asrModule = require('LensStudio:AsrModule');

  private onTranscriptionUpdate(eventArgs: AsrModule.TranscriptionUpdateEvent) {
    print(
      `onTranscriptionUpdateCallback text=${eventArgs.text}, isFinal=${eventArgs.isFinal}`
    );
  }

  private onTranscriptionError(eventArgs: AsrModule.AsrStatusCode) {
    print(`onTranscriptionErrorCallback errorCode: ${eventArgs}`);
    switch (eventArgs) {
      case AsrModule.AsrStatusCode.InternalError:
        print('stopTranscribing: Internal Error');
        break;
      case AsrModule.AsrStatusCode.Unauthenticated:
        print('stopTranscribing: Unauthenticated');
        break;
      case AsrModule.AsrStatusCode.NoInternet:
        print('stopTranscribing: No Internet');
        break;
    }
  }

  onAwake(): void {
    const options = AsrModule.AsrTranscriptionOptions.create();
    options.silenceUntilTerminationMs = 1000;
    options.mode = AsrModule.AsrMode.HighAccuracy;
    options.onTranscriptionUpdateEvent.add((eventArgs) =>
      this.onTranscriptionUpdate(eventArgs);
    );
    options.onTranscriptionErrorEvent.add((eventArgs) =>
      this.onTranscriptionError(eventArgs);
    );

    this.asrModule.startTranscribing(options);
  }

  private stopSession(): void {
    this.asrModule.stopTranscribing();
  }
}
```

### JavaScript

```javascript
const asrModule = require('LensStudio:AsrModule');

function onTranscriptionError(errorCode) {
  print(`onTranscriptionErrorCallback errorCode: ${errorCode}`);
  switch (errorCode) {
    case AsrModule.AsrStatusCode.InternalError:
      print('stopTranscribing: Internal Error');
      break;
    case AsrModule.AsrStatusCode.Unauthenticated:
      print('stopTranscribing: Unauthenticated');
      break;
    case AsrModule.AsrStatusCode.NoInternet:
      print('stopTranscribing: No Internet');
      break;
  }
}

function onTranscriptionUpdate(eventArgs) {
  var text = eventArgs.text;
  var isFinal = eventArgs.isFinal;
  print(`onTranscriptionUpdateCallback text=${text}, isFinal=${isFinal}`);
}

function startSession() {
  var options = AsrModule.AsrTranscriptionOptions.create();
  options.silenceUntilTerminationMs = 1000;
  options.mode = AsrModule.AsrMode.HighAccuracy;
  options.onTranscriptionUpdateEvent.add(onTranscriptionUpdateCallback);
  options.onTranscriptionErrorEvent.add(onTranscriptionErrorCallback);

  // Start session
  asrModule.startTranscribing(options);
}

function stopSession() {
  asrModule.stopTranscribing().then(function () {
    print(`stopTranscribing successfully`);
  });
}
``` 