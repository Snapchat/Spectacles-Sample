# Supabase Edge Function Guide - Trigger Composite Stitch

> **⚠️ Disclaimer:** This example uses Railway for hosting the stitching service. Railway is **not endorsed or affiliated with Snap Inc.** You may use any hosting service that supports Node.js and FFmpeg.

## Overview
This Edge Function acts as a bridge between your Spectacles app and the stitching service (hosted on Railway or similar platform). It forwards requests including optional social sharing parameters.

**Function Name:** `trigger-composite-stitch`

---

## Deployment to Supabase

### Prerequisites
1. Supabase CLI installed: `npm install -g supabase`
2. Logged in: `supabase login`
3. Linked to your project: `supabase link --project-ref YOUR_PROJECT_REF`

### Deploy the Function

From the root directory:

```bash
# Deploy the function
supabase functions deploy trigger-composite-stitch

# Set the Railway service URL as an environment variable
supabase secrets set STITCHER_SERVICE_URL=https://composite-stitcher-production.up.railway.app
```

---

## Manual Deployment (If CLI doesn't work)

### Option 1: Via Supabase Dashboard

1. Go to your Supabase project
2. Navigate to **Edge Functions** in the sidebar
3. Click **"New Function"**
4. Name it: `trigger-composite-stitch`
5. Copy the contents from: `supabase/functions/trigger-composite-stitch/index.ts`
6. Paste into the editor
7. Click **"Deploy"**
8. Go to **Settings → Edge Functions → Secrets**
9. Add: `STITCHER_SERVICE_URL` = `https://composite-stitcher-production.up.railway.app`

### Option 2: Via CLI from Function Directory

```bash
cd supabase/functions
supabase functions deploy trigger-composite-stitch
```

---

## Function URL

After deployment, your function will be available at:
```
https://YOUR_PROJECT_REF.supabase.co/functions/v1/trigger-composite-stitch
```

Get your project ref from: Supabase Dashboard → Settings → API → Project URL

---

## Usage from Spectacles App

### Call from CompositeCaptureUploader

After recording completes and all files are uploaded:

```typescript
private async triggerStitching() {
  try {
    const spotlightCaption = this.captionInput?.text?.trim() || this.defaultCaption;
    
    const response = await fetch(
      'https://YOUR_PROJECT_REF.supabase.co/functions/v1/trigger-composite-stitch',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          sessionId: this.sessionId,
          bucket: this.storageBucket,
          frameRate: this.frameRate,
          sampleRate: this.sampleRate,
          // Video format options
          useVerticalCrop: this.useVerticalCrop,  // 9:16 for Spotlight/Reels
          // Social sharing options (optional)
          shareToSpotlight: this.shareToSpotlight,
          spotlightCaption: spotlightCaption,
        }),
      }
    )

    const result = await response.json()
    
    if (result.success) {
      this.log('✅ Stitching job started successfully')
      this.updateStatus('Video stitching in progress...')
    } else {
      this.logError('❌ Failed to start stitching job')
    }
  } catch (error) {
    this.logError(`Stitching trigger error: ${error}`)
  }
}
```

---

## Request Format

### POST Request
```json
{
  "sessionId": "composite_1234567890_abc",
  "bucket": "specs-bucket",
  "frameRate": 30,
  "sampleRate": 44100
}
```

### Success Response
```json
{
  "success": true,
  "message": "Stitching job started",
  "sessionId": "composite_1234567890_abc",
  "data": {
    "status": "processing",
    "sessionId": "composite_1234567890_abc",
    "message": "Stitching job started"
  }
}
```

### Error Response
```json
{
  "error": "sessionId is required"
}
```

---

## Testing the Function

### Using curl
```bash
curl -X POST \
  https://YOUR_PROJECT_REF.supabase.co/functions/v1/trigger-composite-stitch \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{
    "sessionId": "test_session_123",
    "bucket": "specs-bucket",
    "frameRate": 30,
    "sampleRate": 44100
  }'
```

### Expected Flow
1. Edge Function receives request from Spectacles
2. Validates sessionId parameter
3. Calls Railway stitcher service at `/stitch` endpoint
4. Returns immediate response (job queued)
5. Railway service processes in background
6. Final video appears in Storage when complete

---

## Environment Variables

Set in Supabase Dashboard → Edge Functions → Secrets:

| Variable | Value | Purpose |
|----------|-------|---------|
| `STITCHER_SERVICE_URL` | `https://composite-stitcher-production.up.railway.app` | Railway stitcher endpoint |

---

## Monitoring

### View Logs
```bash
supabase functions logs trigger-composite-stitch
```

Or in Supabase Dashboard:
- Edge Functions → trigger-composite-stitch → Logs tab

### Common Log Messages
- `[TRIGGER] Starting stitch job for session: xxx` - Job received
- `[TRIGGER SUCCESS] Stitch job queued` - Successfully forwarded to Railway
- `[TRIGGER ERROR] Stitcher responded with error` - Railway service error

---

## Integration Points

### Where to Call This Function

In `CompositeCaptureUploader.ts`, add to the `stopRecording()` method:

```typescript
private async stopRecording() {
  // ... existing code ...
  
  // After final metadata is uploaded
  await this.updateFinalMetadata();
  
  // NEW: Trigger stitching
  await this.triggerStitching();
  
  const duration = (Date.now() - this.recordingStartTime) / 1000;
  this.log(`Recording complete: ${this.frameCount} frames, ${this.chunkCount} audio chunks`);
  this.updateStatus(`Stitching video...`);
}
```

---

## Complete Flow Diagram

```
Spectacles App (CompositeCaptureUploader)
    │
    ├─> Uploads video frames to Storage
    ├─> Uploads audio chunks to Storage
    ├─> Creates metadata files
    │
    └─> Calls Edge Function
         │
         └─> trigger-composite-stitch
              │
              └─> Calls Railway Service
                   │
                   └─> composite-stitcher
                        │
                        ├─> Downloads frames from Storage
                        ├─> Downloads audio from Storage
                        ├─> Stitches with FFmpeg
                        └─> Uploads final.mp4 to Storage
                             │
                             └─> composite-videos/{sessionId}/final.mp4
```

---

## Troubleshooting

### Function Not Found
- Verify deployment: `supabase functions list`
- Check function name matches exactly

### 401 Unauthorized
- Include `Authorization: Bearer ANON_KEY` header
- Get anon key from Supabase Dashboard → Settings → API

### 500 Internal Error
- Check Edge Function logs
- Verify `STITCHER_SERVICE_URL` is set correctly
- Test Railway service health endpoint directly

### Stitcher Not Responding
- Test Railway service: `curl https://composite-stitcher-production.up.railway.app/health`
- Check Railway deployment status
- Verify Railway environment variables are set

---

## Files Location

```
supabase/
└── functions/
    └── trigger-composite-stitch/
        └── index.ts          # Edge Function code
```

---

## Next Steps

1. ✅ Deploy Edge Function to Supabase
2. Set environment variable for stitcher URL
3. Update `CompositeCaptureUploader.ts` to call this function
4. Test end-to-end recording → stitching workflow
5. Monitor completion in Storage: `composite-videos/{sessionId}/final.mp4`

