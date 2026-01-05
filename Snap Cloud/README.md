<img src="./README-ref/logo-dark.svg" alt="Snap Cloud Logo" width="500" />

[![SIK](https://img.shields.io/badge/SIK-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-interaction-kit/features/overview?) [![Networking](https://img.shields.io/badge/Networking-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/about-spectacles-features/connected-lenses/overview?) [![Cloud](https://img.shields.io/badge/Cloud-Light%20Gray?color=D3D3D3)](https://cloud.snap.com) [![Internet Access](https://img.shields.io/badge/Internet%20Access-Light%20Gray?color=D3D3D3)](https://developers.snap.com/lens-studio/features/capabilities/internet-module) [![UI Kit](https://img.shields.io/badge/UI%20Kit-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-ui-kit/get-started)

<img src="./README-ref/sample-list-snap-cloud-rounded-edges.gif" alt="snap-cloud-cover" width="500" />

## Overview

This project demonstrates how to use **Snap Cloud** (powered by Supabase) with Spectacles to build connected AR experiences. Snap Cloud is Snap's managed cloud platform providing database storage, real-time synchronization, cloud storage, and serverless edge functions.

The template includes five comprehensive examples:

- **Example 1 - Auth & Tables**: Database authentication and CRUD operations
- **Example 2 - RealTime**: Bidirectional data sync between devices and web
- **Example 3 - Storage**: Dynamic asset loading (3D models, images, audio)
- **Example 4 - Edge Functions**: Serverless cloud function execution
- **Example 5 - Media Suite**: Complete media capture, upload, and streaming

## Design Guidelines

Designing Lenses for Spectacles offers all-new possibilities to rethink user interaction with digital spaces and the physical world.
Get started using our [Design Guidelines](https://developers.snap.com/spectacles/best-practices/design-for-spectacles/introduction-to-spatial-design)

## Prerequisites

- **Lens Studio**: v5.12.0+
- **Spectacles OS Version**: v5.64+
- **Spectacles App iOS**: v0.64+
- **Spectacles App Android**: v0.64+
- **Snap Cloud Access**: Account must be whitelisted
- **Internet Connection**: Required for all cloud operations

To update your Spectacles device and mobile app, refer to this [guide](https://support.spectacles.com/hc/en-us/articles/30214953982740-Updating).

You can download the latest version of Lens Studio from [here](https://ar.snap.com/download?lang=en-US).

## Getting the project

To obtain the project folder, you need to clone the repository.

> **IMPORTANT**:
> This project uses Git Large Files Support (LFS). Downloading a zip file using the green button on Github
> **will not work**. You must clone the project with a version of git that has LFS.
> You can download Git LFS here: https://git-lfs.github.com/.

## Initial Project Setup

### 1. Install Required Packages

Open Lens Studio and install the following from the Asset Library:
- **Supabase Plugin** - Access via Window > Supabase
- **SupabaseClient (v0.0.10+)** - For database and cloud operations
- **Spectacles UI Kit** - For button interactions

### 2. Create Snap Cloud Project

1. Open Supabase Plugin: `Window > Supabase`
2. Login with your Lens Studio credentials
3. Click "Create a New Project"
4. Click "Import Credentials" to generate a SupabaseProject asset

### 3. Set Device Type

In the Preview Panel, set **Device Type Override** to **Spectacles**

### 4. Configure Database Tables

Use the Supabase Plugin dashboard to create the required tables. Sample SQL and CSV data are provided in `ExternalServicesExamples/example-1to4-mockup-data/`.

## Project Structure

```
Snap Cloud/
├── Assets/
│   └── Examples/
│       ├── Example1-AuthAndTables/     # Authentication & database operations
│       │   ├── BasicAuth.ts            # Simple auth example
│       │   └── TableConnector.ts       # Full CRUD operations
│       ├── Example2-RealTime/          # Real-time synchronization
│       │   └── RealtimeCursor.ts       # Bidirectional cursor sync
│       ├── Example3-Storage/           # Cloud storage operations
│       │   └── StorageLoader.ts        # Dynamic asset loading
│       ├── Example4-EdgeFunctions/     # Serverless functions
│       │   └── EdgeFunctionImgProcessing.ts
│       ├── Example5-Media/             # Media capture & streaming
│       │   └── Scripts/
│       │       ├── ImageCaptureUploader.ts
│       │       ├── VideoCaptureUploader.ts
│       │       ├── VideoStreamingController.ts
│       │       ├── AudioCaptureUploader.ts
│       │       ├── AudioStreamingController.ts
│       │       ├── CompositeCaptureUploader.ts
│       │       ├── CompositeStreamingController.ts
│       │       ├── CaptureUtilities.ts
│       │       └── UISectionManager.ts
│       └── SnapCloudRequirements.ts    # Centralized configuration
├── ExternalServicesExamples/
│   ├── example-1to4-mockup-data/       # Sample data for examples 1-4
│   ├── media-example-web-viewers/      # Web viewers for streaming
│   ├── media-example-server-composite-stitcher/  # Video stitching server
│   └── realtime-example-web-cursor-controller/   # Web cursor controller
└── README.md
```

---

## Example 1: Authentication & Tables

Basic authentication and database CRUD operations with automatic connection testing.

### Key Scripts

**BasicAuth.ts** - Minimal authentication setup:

```typescript
async signInUser() {
  const { data, error } = await this.client.auth.signInWithIdToken({
    provider: 'snapchat',
    token: '',
  });

  if (data && data.user) {
    this.uid = JSON.stringify(user.id).replace(/^"(.*)"$/, '$1');
    print('User ID: ' + this.uid);
  }
}
```

**TableConnector.ts** - Full database operations with UI:

```typescript
// Insert data
async insertData(tableName: string, data: object) {
  const { data: result, error } = await this.client
    .from(tableName)
    .insert(data)
    .select();
  return { result, error };
}

// Query data
async getData(tableName: string, limit: number = 10) {
  const { data, error } = await this.client
    .from(tableName)
    .select('*')
    .order('id', { ascending: false })
    .limit(limit);
  return { data, error };
}
```

### Setup
1. Assign `SnapCloudRequirements` component with SupabaseProject
2. Create `test_table` in database (see Database Setup section)
3. Optionally assign RectangleButton for manual data retrieval

---

## Example 2: RealTime Synchronization

Bidirectional cursor synchronization between Spectacles and web browsers using WebSocket channels.

### Key Script

**RealtimeCursor.ts** - Two operation modes:

```typescript
// BROADCAST MODE: Send cursor position to web
private broadcastPosition() {
  const pos = this.cursorObject.getTransform().getLocalPosition();
  
  const webX = (pos.x / this.coordinateScale) * this.perspectiveScale;
  const webY = (pos.y / this.coordinateScale) * this.perspectiveScale;
  
  this.channel.send({
    type: 'broadcast',
    event: 'cursor_move',
    payload: { x: webX, y: webY, source: 'spectacles' }
  });
}

// FOLLOW MODE: Receive cursor position from web
private handleCursorMove(payload: any) {
  if (payload.source === 'web') {
    this.targetPosition = new vec3(
      payload.x * this.movementScale,
      payload.y * this.movementScale + this.heightOffset,
      this.cursorZPosition
    );
  }
}
```

### Setup
1. Assign `SnapCloudRequirements` component
2. Set channel name for synchronization
3. Assign cursor SceneObject to track/move
4. Use web controller from `ExternalServicesExamples/realtime-example-web-cursor-controller/`

---

## Example 3: Dynamic Asset Loading

Load 3D models, images, and audio files from Snap Cloud storage on demand.

### Key Script

**StorageLoader.ts** - Multi-asset loading:

```typescript
// Load 3D model
private async loadGltfModel() {
  const url = this.getStorageUrl(this.gltfPath);
  const resource = await this.internetModule.createResourceFromUrl(url);
  const gltfAsset = await this.remoteMediaModule.loadGltfFromResource(resource);
  
  const sceneObject = gltfAsset.tryInstantiate(this.modelParent);
  sceneObject.getTransform().setLocalScale(new vec3(this.modelScale, this.modelScale, this.modelScale));
}

// Load image texture
private async loadImageTexture() {
  const url = this.getStorageUrl(this.imagePath);
  const resource = await this.internetModule.createResourceFromUrl(url);
  const texture = await this.remoteMediaModule.loadTextureFromResource(resource);
  
  this.outputImage.mainPass.baseTex = texture;
}

// Load audio
private async loadAudioFile() {
  const url = this.getStorageUrl(this.audioPath);
  const resource = await this.internetModule.createResourceFromUrl(url);
  const audioAsset = await this.remoteMediaModule.loadAudioFromResource(resource);
  
  this.audioComponent.audioTrack = audioAsset;
  this.audioComponent.play(1);
}
```

### Setup
1. Create storage bucket in Snap Cloud
2. Upload test assets from `ExternalServicesExamples/example-1to4-mockup-data/testAssets-ADD TO STORAGE BUCKET/`
3. Configure bucket name and file paths in Inspector
4. Assign output components (Image, AudioComponent, parent SceneObject)

---

## Example 4: Edge Functions

Execute serverless functions for image processing and external API calls.

### Key Script

**EdgeFunctionImgProcessing.ts** - Call edge functions:

```typescript
async callEdgeFunction() {
  const functionUrl = `${this.supabaseProject.url}/functions/v1/${this.functionName}`;
  
  const response = await this.internetModule.fetch(functionUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.supabaseProject.publicToken}`,
    },
    body: JSON.stringify({
      imageUrl: this.inputImageUrl,
      operations: ['grayscale', 'blur']
    }),
  });
  
  const result = await response.json();
  // Load processed image from result.outputUrl
}
```

### Setup
1. Deploy edge function from `ExternalServicesExamples/example-1to4-mockup-data/testEdgeFunction-ADD TO EDGE FUNCTION CODE/`
2. Assign SnapCloudRequirements and function name
3. Configure input image URL and output Image component

---

## Example 5: Media Suite

Complete media capture, upload, and streaming capabilities for Spectacles.

### 5a. Image Capture

**ImageCaptureUploader.ts** - Capture and upload images:

```typescript
// Capture from camera or composite texture
private async captureImage() {
  const texture = this.useCompositeTexture ? this.compositeTexture : this.cameraTexture;
  
  Base64.encodeTextureAsync(
    texture,
    async (base64String) => {
      const binaryData = Base64.decode(base64String);
      await this.uploadToStorage(binaryData, `images/${sessionId}/capture.jpg`);
    },
    () => { print('Encoding failed'); },
    CompressionQuality.HighQuality,
    EncodingType.Jpg
  );
}
```

**Features:**
- Camera-only or composite (AR content + background) capture
- Configurable JPEG quality
- High-quality still capture via Camera Module API
- Preview display

### 5b. Video Capture & Streaming

**VideoCaptureUploader.ts** - Record frame sequences:

```typescript
// Capture frames during recording
private captureFrame() {
  Base64.encodeTextureAsync(
    this.cameraTexture,
    (base64String) => {
      this.frameBuffer.push({
        frameNumber: this.frameCount++,
        data: base64String,
        timestamp: Date.now()
      });
    },
    () => {},
    this.useHighQuality ? CompressionQuality.HighQuality : CompressionQuality.LowQuality,
    EncodingType.Jpg
  );
}

// Upload all frames after recording
private async uploadFrames() {
  for (const frame of this.frameBuffer) {
    const binaryData = Base64.decode(frame.data);
    await this.uploadToStorage(binaryData, `video/${sessionId}/frame_${frame.frameNumber}.jpg`);
  }
}
```

**VideoStreamingController.ts** - Live streaming via Realtime:

```typescript
// Stream frames to viewers
private streamFrame() {
  Base64.encodeTextureAsync(
    this.cameraTexture,
    (base64String) => {
      this.channel.send({
        type: 'broadcast',
        event: 'video-frame',
        payload: {
          frame: base64String,
          timestamp: Date.now(),
          frameNumber: this.frameCount++
        }
      });
    },
    () => {},
    CompressionQuality.LowQuality,
    EncodingType.Jpg
  );
}
```

**Features:**
- Configurable FPS and quality
- Camera-only or composite mode
- Upload for later processing OR live streaming
- Web viewer available at `ExternalServicesExamples/media-example-web-viewers/video-stream-viewer.html`

### 5c. Audio Capture & Streaming

**AudioCaptureUploader.ts** - Record audio chunks:

```typescript
// Process audio frames
private processAudioFrame() {
  const shape = this.audioComponent.audioFrame.shape;
  const audioData = new Float32Array(shape.x * shape.y);
  this.audioComponent.audioFrame.getData(audioData);
  
  this.audioBuffer.push({
    audioFrame: audioData,
    timestamp: Date.now()
  });
}

// Convert to WAV and upload
private async uploadAudioChunk(chunkNumber: number, samples: Float32Array) {
  const wavData = this.createWavFile(samples, this.sampleRate);
  await this.uploadToStorage(wavData, `audio/${sessionId}/chunk_${chunkNumber}.wav`);
}
```

**AudioStreamingController.ts** - Live audio streaming:

```typescript
// Stream audio chunks via Realtime
private streamAudioChunk() {
  const audioData = this.getAudioBuffer();
  const base64Audio = Base64.encode(new Uint8Array(audioData.buffer));
  
  this.channel.send({
    type: 'broadcast',
    event: 'audio-chunk',
    payload: {
      audio: base64Audio,
      sampleRate: this.sampleRate,
      timestamp: Date.now()
    }
  });
}
```

**Features:**
- Configurable sample rate (8kHz - 48kHz)
- WAV format upload
- Chunk-based processing
- Web listener at `ExternalServicesExamples/media-example-web-viewers/audio-stream-listener.html`

### 5d. Composite Capture & Streaming

> **⚠️ Disclaimer:** The video stitching example uses [Railway](https://railway.app/) as an optional hosting platform. Railway is **not endorsed or affiliated with Snap Inc.** This is provided as an example deployment pattern. You may use any Node.js hosting service (Heroku, Render, AWS, Google Cloud, etc.) that supports FFmpeg.

**CompositeCaptureUploader.ts** - Synchronized video + audio capture:

```typescript
// Start synchronized recording
private async startRecording() {
  this.sessionId = SessionUtility.generateSessionId('composite');
  this.recordingStartTime = Date.now();
  
  // Start audio recording
  this.audioCapture.startRecording();
  
  // Start frame capture timer
  this.frameTimerEvent = this.createEvent('DelayedCallbackEvent');
  this.frameTimerEvent.bind(() => {
    this.captureVideoFrame();
    if (this.isRecording) {
      this.frameTimerEvent.reset(this.frameInterval / 1000);
    }
  });
  
  // Create session metadata for stitching
  await this.createSessionMetadata();
}

// Trigger server-side stitching
private async triggerStitching() {
  const functionUrl = `${this.supabaseProject.url}/functions/v1/trigger-composite-stitch`;
  
  await this.internetModule.fetch(functionUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.supabaseProject.publicToken}`,
    },
    body: JSON.stringify({
      sessionId: this.sessionId,
      frameRate: this.frameRate,
      sampleRate: this.sampleRate
    }),
  });
}
```

**Features:**
- Synchronized video frames + audio chunks with shared session ID
- Metadata files for stitching relationship
- Server-side video stitching via Edge Function or external server
- Stitching server available at `ExternalServicesExamples/media-example-server-composite-stitcher/`

### 5e. Social Sharing (Spotlight)

Share stitched videos to social media platforms via optional third-party integration.

> **⚠️ Disclaimer:** The social sharing example uses [Ayrshare](https://www.ayrshare.com/) as an optional third-party service. Ayrshare is **not endorsed or affiliated with Snap Inc.** This is provided as an example of how to integrate with social media APIs. You may use any similar service or build your own integration.

**CompositeCaptureUploader.ts** - Social sharing controls:

```typescript
// Inspector-configurable sharing options
@input public shareToSpotlight: boolean = false;
@input public captionInput: TextInputField;
@input public defaultCaption: string = "Captured with Spectacles ✨";
@input public useVerticalCrop: boolean = false;  // 9:16 aspect ratio for Spotlight/Reels

// Trigger stitching with sharing options
private async triggerStitching() {
  const spotlightCaption = this.captionInput?.text?.trim() || this.defaultCaption;
  
  await this.internetModule.fetch(functionUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.supabaseProject.publicToken}`,
    },
    body: JSON.stringify({
      sessionId: this.sessionId,
      frameRate: actualFrameRate,
      sampleRate: this.sampleRate,
      // Video format options
      useVerticalCrop: this.useVerticalCrop,  // 9:16 crop for Spotlight/Reels
      // Social sharing options
      shareToSpotlight: this.shareToSpotlight,
      spotlightCaption: spotlightCaption,
    }),
  });
}
```

**Server-side sharing** (in composite stitcher):

```javascript
// Post to Snapchat Spotlight via Ayrshare
async function shareToSocialMedia(videoUrl, caption) {
  const response = await axios.post(
    'https://api.ayrshare.com/api/post',
    {
      post: caption,
      mediaUrls: [videoUrl],
      platforms: ['snapchat'],  // Snapchat Spotlight
      snapChatOptions: { spotlight: true }
    },
    {
      headers: { 'Authorization': `Bearer ${AYRSHARE_API_KEY}` }
    }
  );
  return response.data;
}
```

**Features:**
- Optional sharing toggle (Inspector checkbox or UI switch)
- Custom caption input field
- 9:16 vertical crop for Spotlight/Reels format
- Server-side posting after video stitching completes
- Extensible to other platforms (Instagram, TikTok, YouTube Shorts)

**Setup:**
1. Create account at [Ayrshare](https://www.ayrshare.com/) (or similar service)
2. Connect your Snapchat Creator account
3. Add `AYRSHARE_API_KEY` environment variable to your stitching server
4. Enable sharing in Inspector and provide caption

### Media Setup

1. Assign `SnapCloudRequirements` component
2. Create storage bucket named `specs-bucket`
3. For composite mode: assign `CameraService` and `compositeTexture`
4. For audio: assign `AudioTrackAsset` (microphone)
5. Deploy web viewers for streaming (optional)
6. Deploy stitching server for composite video (optional)

---

## Database Setup

### Core Tables

#### Test Table (Example 1)
```sql
CREATE TABLE test_table (
  id BIGSERIAL PRIMARY KEY,
  message TEXT NOT NULL,
  sender TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  lens_session_id TEXT
);
```

#### Cursor Debug Table (Example 2)
```sql
CREATE TABLE cursor_debug (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id TEXT NOT NULL,
  x FLOAT NOT NULL,
  y FLOAT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL,
  channel_name TEXT NOT NULL
);
```

#### User Interactions Table (Example 1)
```sql
CREATE TABLE user_interactions (
  id BIGSERIAL PRIMARY KEY,
  action TEXT NOT NULL,
  data JSONB,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  session_id TEXT
);
```

### Row Level Security (RLS)

For development, you can disable RLS:

```sql
ALTER TABLE test_table DISABLE ROW LEVEL SECURITY;
ALTER TABLE cursor_debug DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_interactions DISABLE ROW LEVEL SECURITY;
```

---

## Testing the Lens

### In Lens Studio Editor

1. Open any example scene
2. Ensure Device Type is set to Spectacles
3. Verify SnapCloudRequirements has SupabaseProject assigned
4. Run and check console for authentication logs

### On Spectacles Device

1. Deploy lens to Spectacles
2. Ensure internet connectivity
3. Test each example functionality

---

## Common Configuration

All examples require:
- **SnapCloudRequirements Script** - Centralized Supabase configuration
- **SupabaseProject Asset** - Created via Supabase Plugin
- **Device Type: Spectacles** - Set in preview panel

Authentication is automatic using `signInWithIdToken({ provider: 'snapchat', token: '' })`.

---

## Security Best Practices

### Development
- Use anon public key from Snap Cloud dashboard
- Disable RLS for quick testing

### Production
- Enable Row Level Security (RLS)
- Create proper authentication policies
- Use service role key only server-side
- Validate all user inputs

---

## Support

If you have questions, connect with us on [Reddit](https://www.reddit.com/r/Spectacles/).

For Snap Cloud questions, visit [Snap Cloud Documentation](https://cloud.snap.com/docs).

## Contributing

Feel free to provide improvements via merge requests.

## Additional Resources

- [Snap Cloud Home](https://cloud.snap.com)
- [Snap Cloud Docs](https://cloud.snap.com/docs)
- [Lens Studio API Reference](https://developers.snap.com/lens-studio/api/lens-scripting/index.html)
- [Spectacles Developer Portal](https://developers.snap.com/spectacles/home)

---

*Built by the Spectacles team*

---
