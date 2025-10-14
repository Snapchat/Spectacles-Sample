<img src="./README-ref/logo-dark.svg" alt="Snap Cloud Logo" width="500" />

[![SIK](https://img.shields.io/badge/SIK-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-interaction-kit/features/overview?) [![Networking](https://img.shields.io/badge/Networking-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/about-spectacles-features/connected-lenses/overview?) [![Cloud](https://img.shields.io/badge/Cloud-Light%20Gray?color=D3D3D3)](https://cloud.snap.com) [![Internet Access](https://img.shields.io/badge/Internet%20Access-Light%20Gray?color=D3D3D3)](https://developers.snap.com/lens-studio/features/capabilities/internet-module) [![UI Kit](https://img.shields.io/badge/UI%20Kit-Light%20Gray?color=D3D3D3)](https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-ui-kit/get-started)

<img src="./README-ref/sample-list-snap-cloud-rounded-edges.gif" alt="snap-cloud-cover" width="500" />

## Overview

This project demonstrates how to use **Snap Cloud** (powered by Supabase) with Spectacles to build connected AR experiences. Snap Cloud is Snap's managed cloud platform providing database storage, real-time synchronization, cloud storage, and serverless edge functions—all accessible directly from your Spectacles lenses.

The template includes four comprehensive examples showcasing different aspects of cloud integration, from basic database operations to advanced real-time synchronization and dynamic asset loading.

Key Features:

- **Database Integration**: Store and query data using PostgreSQL with automatic Snap authentication
- **Real-Time Synchronization**: Bidirectional PC-to-Spectacles cursor sync with smooth interpolation
- **Dynamic Asset Loading**: Load 3D models, images, and audio files from cloud storage on demand
- **Serverless Edge Functions**: Execute cloud functions for image processing and external API calls
- **Spectacles UI Kit Integration**: Button-triggered interactions using RectangleButton components
- **Sample Data Included**: Pre-configured CSV files for quick testing and prototyping

> **NOTE:**
> This project will only work for the Spectacles platform and requires Snap Cloud access. Your Snapchat account must be whitelisted for Snap Cloud. Request access at [#snap-cloud-allowlist](https://snap.com).

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
4. Click "Import Credentials" to generate a SupabaseProject asset in your Asset Browser

### 3. Set Device Type

In the Preview Panel, set **Device Type Override** to **Spectacles**

### 4. Configure Database Tables

Use the Supabase Plugin dashboard to create the required tables for the examples you want to use. Sample SQL and CSV data are provided in the `Data/testData/` folder.

## Project Structure

```
Snap Cloud/
├── Assets/
│   └── Examples/
│       ├── Example1-SupabaseConnector/         # Database CRUD operations
│       │   └── TableConnector.ts
│       ├── Example2-RealTimeCursor/            # PC ↔ Spectacles cursor sync
│       │   ├── RealtimeCursor.ts
│       │   └── Fetch/
│       │       └── RealtimeCursorBroadcasterFetch.ts
│       ├── Example3-LoadAssets/                # Dynamic 3D models, images, audio
│       │   └── StorageLoader.ts
│       ├── Example4-EdgeFunctions/             # Serverless function calls
│       │   └── EdgeFunctionImgProcessing.ts
│       ├── SnapCloudRequirements.ts            # Centralized configuration
│       └── Data/                                
│           ├── testAssets-ADD TO STORAGE BUCKET/
│           │   ├── rabbit.glb
│           │   ├── spectacles.jpg
│           │   └── chill.mp3
│           ├── testData-ADD TO TABLES/
│           │   ├── cursor_positions.csv
│           │   ├── realtime_messages.csv
│           │   ├── test_messages.csv
│           │   ├── user_interactions.csv
│           │   └── user_preferences.csv
│           └── testEdgeFunction-ADD TO EDGE FUNCTION CODE/
│               └── index.txt
└── README.md
```

## Integration Guidelines

### Example 1: Database Connector

Basic database operations demonstrating CRUD (Create, Read, Update, Delete) functionality with automatic connection testing.

**Key Components:**
- [TableConnector.ts](Assets/Examples/Example1-SupabaseConnector/TableConnector.ts) - Main connector script with centralized configuration
- SnapCloudRequirements - Centralized Supabase configuration
- RectangleButton (optional) - Trigger data retrieval
- Text Component (optional) - Display logs on device

**Use Cases:** User profiles, leaderboards, analytics, messaging

**Setup:**
1. Create database tables (test_table, user_interactions, user_preferences) using provided CSV data
2. Assign SnapCloudRequirements component to script
3. Optionally assign RectangleButton for manual data retrieval
4. Optionally assign Text component for on-device log display

**Features:**
- Automatic user authentication with Snapchat ID token
- Connection testing on startup
- Generic CRUD methods for any table
- Sample data insertion and retrieval
- User interaction logging
- Real-time log display

---

### Example 2: Real-Time Cursor Sync

Unified bidirectional cursor synchronization between PC and Spectacles with smooth interpolation and mode switching.

**Key Components:**
- [RealtimeCursor.ts](Assets/Examples/Example2-RealTimeCursor/RealtimeCursor.ts) - Unified WebSocket-based cursor sync
- SnapCloudRequirements - Centralized Supabase configuration
- RectangleButton - Toggle between broadcast and follow modes
- Text Components - Display mode and status information

**Use Cases:** Remote presentations, collaborative design, multiplayer games, interactive demos

**Setup:**
1. Assign SnapCloudRequirements component to script
2. Configure channel name for synchronization
3. Assign cursor object to track/move
4. Assign RectangleButton to toggle modes
5. Optionally assign Text components for status display
6. Test with PC web controller for full bidirectional sync

**Features:**
- Two modes: Broadcast (Spectacles to Web) and Follow (Web to Spectacles)
- Toggle between modes with button press
- Smooth interpolation for cursor movement
- Configurable coordinate mapping and scaling
- Adjustable broadcast interval and movement speed
- Real-time status logging and display

---

### Example 3: Dynamic Asset Loading

Load 3D models, images, and audio files from Snap Cloud storage on demand with progress tracking.

**Key Components:**
- [StorageLoader.ts](Assets/Examples/Example3-LoadAssets/StorageLoader.ts) - Comprehensive asset loading script
- SnapCloudRequirements - Centralized Supabase configuration
- RectangleButton - Trigger asset loading
- RemoteMediaModule - Handle remote asset loading
- InternetModule - Network connectivity and resource creation

**Use Cases:** User-generated content, dynamic experiences, asset streaming, remote model loading

**Setup:**
1. Create storage bucket in Snap Cloud
2. Upload test assets (rabbit.glb, spectacles.jpg, chill.mp3) from testAssets folder to bucket
3. Assign SnapCloudRequirements component to script
4. Configure bucket name and file paths in Inspector
5. Assign Camera object for model positioning
6. Assign parent scene object for loaded models
7. Assign Image component for texture display
8. Assign AudioComponent scene object for audio playback
9. Optionally assign default Material for models
10. Configure storage policies for public access

**Features:**
- Loads 3D models (GLTF) with automatic positioning and scaling
- Loads images as textures with automatic display
- Loads audio files with automatic playback
- Parallel asset loading for better performance
- Internet connectivity checking
- Loading progress tracking and status display
- Asset URL accessibility testing
- Animation player detection for GLTF models
- Clear loaded assets functionality

---

### Example 4: Serverless Edge Functions

Call cloud functions for image processing with automatic result display.

**Key Components:**
- [EdgeFunctionImgProcessing.ts](Assets/Examples/Example4-EdgeFunctions/EdgeFunctionImgProcessing.ts) - Edge function caller with image processing
- SnapCloudRequirements - Centralized Supabase configuration
- RectangleButton - Trigger function execution
- Image component - Display processed output
- InternetModule - HTTP request handling
- RemoteMediaModule - Download and display processed images

**Use Cases:** Image filters, image processing, AI inference, external APIs, serverless computation

**Setup:**
1. Deploy edge function to Snap Cloud (use testEdgeFunction code from Data folder)
2. Assign SnapCloudRequirements component to script
3. Configure function name in Inspector
4. Assign image URL from Supabase Storage to process
5. Assign output Image component to display results
6. Assign RectangleButton to trigger processing

**Features:**
- Sends image URL to edge function for processing
- Edge function downloads, processes, and stores result
- Automatically downloads and displays processed image
- Detailed logging of processing steps
- Support for various image operations (blur, resize, grayscale, etc.)
- Returns processing metadata (file sizes, storage paths, operations applied)

---

## Sample Data

Sample data is organized in the `Data/` folder:

### Test Data (CSV files for database tables)
Located in `testData-ADD TO TABLES/`:
- **cursor_positions.csv** - Sample cursor coordinates for Example 2
- **realtime_messages.csv** - Sample real-time events
- **test_messages.csv** - Sample messages for Example 1
- **user_interactions.csv** - Sample user action logs
- **user_preferences.csv** - Sample user settings

**To import:**
1. Open Supabase Plugin dashboard
2. Navigate to your table in Table Editor
3. Click "Insert" then "Import from CSV"
4. Select the appropriate CSV file

### Test Assets (for storage bucket)
Located in `testAssets-ADD TO STORAGE BUCKET/`:
- **rabbit.glb** - 3D model for Example 3
- **spectacles.jpg** - Image file for Example 3
- **chill.mp3** - Audio file for Example 3

**To upload:**
1. Open Supabase Plugin dashboard
2. Navigate to Storage
3. Create or select your bucket
4. Upload the asset files

### Edge Function Code
Located in `testEdgeFunction-ADD TO EDGE FUNCTION CODE/`:
- **index.txt** - Sample edge function code for Example 4

**To deploy:**
1. Open Supabase Plugin dashboard
2. Navigate to Edge Functions
3. Create new function
4. Copy code from index.txt

## Database Setup

### Core Tables

Create these tables in your Snap Cloud project for the examples:

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

#### Cursor Positions Table (Example 2)
```sql
CREATE TABLE cursor_positions (
  id BIGSERIAL PRIMARY KEY,
  room_name TEXT NOT NULL,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  x FLOAT NOT NULL,
  y FLOAT NOT NULL,
  color TEXT DEFAULT '#FF6B6B',
  timestamp BIGINT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cursor_positions_room_timestamp
ON cursor_positions(room_name, timestamp DESC);
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

#### Realtime Messages Table (Example 1)
```sql
CREATE TABLE realtime_messages (
  id BIGSERIAL PRIMARY KEY,
  channel TEXT NOT NULL,
  event TEXT NOT NULL,
  payload JSONB,
  sent_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Row Level Security (RLS)

For development, you can disable RLS or allow anonymous access:

```sql
-- Disable RLS for testing (not recommended for production)
ALTER TABLE test_table DISABLE ROW LEVEL SECURITY;

-- OR allow anonymous access
ALTER TABLE test_table ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous access" ON test_table FOR ALL USING (true);

-- Apply same pattern to all tables
ALTER TABLE user_interactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences DISABLE ROW LEVEL SECURITY;
ALTER TABLE cursor_positions DISABLE ROW LEVEL SECURITY;
```

## Testing the Lens

### In Lens Studio Editor

1. Open any example scene in Lens Studio
2. Ensure Device Type is set to Spectacles in Preview Panel
3. Verify SnapCloudRequirements component is configured with SupabaseProject asset
4. Test Example 1:
   - Run the lens and check console for automatic connection testing
   - Verify data is inserted into database via Supabase Plugin dashboard
   - Press button to retrieve latest data from all tables
5. Test Example 2:
   - Open web cursor controller in browser
   - Default mode is BROADCAST (Spectacles to Web)
   - Move cursor in Spectacles and watch it appear on web
   - Press toggle button to switch to FOLLOW mode
   - Move mouse on web and watch AR object follow in preview
6. Test Example 3:
   - Ensure test assets are uploaded to storage bucket
   - Press load button to download all assets
   - Verify 3D model, image, and audio appear in scene
   - Check console for loading progress
7. Test Example 4:
   - Ensure edge function is deployed
   - Configure image URL from storage
   - Press process button to trigger edge function
   - Watch processed image appear in output component
   - Check console for processing details

### On Spectacles Device

1. Ensure Snap Cloud access is enabled for your account
2. Deploy the lens to your Spectacles device
3. Ensure internet connectivity (WiFi or mobile hotspot)
4. Test each example:
   - **Example 1**: Data automatically syncs with database
   - **Example 2**: Use web controller to control AR objects remotely
   - **Example 3**: Press button to load dynamic content
   - **Example 4**: Process images using cloud functions

## Common Configuration

All examples require:

1. **SnapCloudRequirements Script** - Centralized Supabase configuration (replaces individual SupabaseProject assignments)
2. **SupabaseProject Asset** - Created via Supabase Plugin (assigned to SnapCloudRequirements)
3. **Internet Module** - Automatically required by scripts for HTTP requests
4. **Device Type: Spectacles** - Set in preview panel

Optional components:
- **RectangleButton** (Spectacles UI Kit) - For interactive triggers (used in all examples)
- **Text Component** - For status displays and logging
- **Image Component** - For loaded textures
- **AudioComponent** - For loaded audio

**SnapCloudRequirements Benefits:**
- Single configuration point for all examples
- Automatic URL generation for Storage and Functions APIs
- Centralized header management
- Easy switching between projects

## Security Best Practices

### Development
- Use anon public key from Snap Cloud dashboard
- Disable RLS for quick testing
- Test with sample data from Data/ folder

### Production
- Enable Row Level Security (RLS)
- Create proper authentication policies
- Use service role key only server-side
- Validate all user inputs
- Set up proper CORS policies

## Disclaimer

This project is intended for demonstration and educational purposes. Ensure compliance with Snap Cloud API usage policies and terms of service when deploying your lenses. Always implement proper security measures and data protection practices in production environments.

## Support

If you have any questions or need assistance, please don't hesitate to reach out. Our community is here to help, and you can connect with us and ask for support [here](https://www.reddit.com/r/Spectacles/). We look forward to hearing from you and are excited to assist you on your journey!

For Snap Cloud specific questions, visit [Snap Cloud Documentation](https://cloud.snap.com/docs).

## Contributing

Feel free to provide improvements or suggestions or directly contributing via merge request. By sharing insights, you help everyone else build better Lenses.

## Additional Resources

### Snap Cloud Documentation
- [Snap Cloud Home](https://cloud.snap.com)
- [Snap Cloud Docs](https://cloud.snap.com/docs)
- [Lens Studio API Reference](https://developers.snap.com/lens-studio/api/lens-scripting/index.html)

### Community & Support
- [Spectacles Reddit](https://www.reddit.com/r/Spectacles/)
- [1fficial AR YouTube](https://www.youtube.com/@1fficialar)
- [Spectacles Developer Portal](https://developers.snap.com/spectacles/home)

### Learning Resources
- [Spectacles Hackathon Resources](https://developers.snap.com/spectacles/spectacles-community/hackathon-resources)
- [Supabase Documentation](https://supabase.com/docs) - Core concepts

---

*Built by the Spectacles team*


