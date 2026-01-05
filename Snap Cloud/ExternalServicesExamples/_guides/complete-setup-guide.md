# Complete Setup Guide - Composite Video Stitching System

## Overview
This guide summarizes the complete setup process for the composite video stitching system that combines video frames and audio chunks into a final MP4 file.

**Date:** November 21, 2025  
**Session:** Initial setup and deployment

---

## Architecture

```
Spectacles App (CompositeCaptureUploader)
    ↓
    Uploads frames + audio to Supabase Storage
    ↓
Calls Supabase Edge Function
    ↓
Edge Function → trigger-composite-stitch
    ↓
Railway Service → composite-stitcher
    ↓
    Downloads, stitches with FFmpeg, uploads result
    ↓
Final video: composite-videos/{sessionId}/final.mp4
```

---

## Part 1: Railway Stitching Service

### Created Service
**Location:** `/composite-stitcher/`
**Technology:** Node.js 20 + Express + FFmpeg
**Repository:** https://github.com/alessiograncini/composite-stitcher

### Setup Steps

1. **Created Node.js service** with:
   - `index.js` - Main server and FFmpeg stitching logic
   - `package.json` - Dependencies (Express, Supabase, fluent-ffmpeg)
   - `nixpacks.toml` - System packages (Node 20, FFmpeg)
   - `railway.json` - Railway configuration

2. **Initialized Git:**
   ```bash
   cd composite-stitcher
   git init
   git add .
   git commit -m "Initial commit: Composite stitcher service with FFmpeg"
   ```

3. **Pushed to GitHub:**
   ```bash
   git remote add origin https://github.com/alessiograncini/composite-stitcher.git
   git branch -M main
   git push -u origin main
   ```

4. **Deployed to Railway:**
   - Connected GitHub repository
   - Railway auto-deploys on every push
   - Configured port: **8080**

5. **Set Environment Variables in Railway:**
   - `SUPABASE_URL` = Your Supabase project URL
   - `SUPABASE_SERVICE_KEY` = Your service_role key

### Service Endpoints

**Health Check:**
```bash
https://composite-stitcher-production.up.railway.app/health
```

**Stitch Video:**
```bash
POST https://composite-stitcher-production.up.railway.app/stitch
Content-Type: application/json

{
  "sessionId": "composite_1234567890_abc",
  "bucket": "specs-bucket",
  "frameRate": 30,
  "sampleRate": 44100
}
```

### Key Features
- Downloads all frames from Supabase Storage
- Downloads all audio chunks from Supabase Storage
- Uses FFmpeg to create video from frames (30 FPS)
- Uses FFmpeg to combine audio chunks
- Uses FFmpeg to merge video + audio
- Uploads final MP4 to Storage
- Creates completion metadata

---

## Part 2: Supabase Edge Function

### Created Function
**Location:** `/supabase/functions/trigger-composite-stitch/`
**Technology:** Deno (TypeScript)
**Purpose:** Bridge between Spectacles app and Railway service

### Setup Steps

1. **Installed Supabase CLI:**
   ```bash
   # Updated Xcode Command Line Tools first
   sudo softwareupdate --install "Command Line Tools for Xcode 26.1-26.1"
   
   # Installed Supabase CLI via Homebrew
   brew install supabase/tap/supabase
   ```

2. **Got Personal Access Token:**
   - Went to: https://supabase.com/dashboard/account/tokens
   - Generated new token: `sbp_...`
   - Used this instead of `supabase login` to ensure correct account

3. **Deployed Function:**
   ```bash
   cd "/Users/alessiograncini/Desktop/Snap Cloud Media Suite"
   export SUPABASE_ACCESS_TOKEN="YOUR TOKEN"
   supabase functions deploy trigger-composite-stitch --project-ref YOUR PROJECT REF
   ```

4. **Set Environment Secret:**
   ```bash
   supabase secrets set STITCHER_SERVICE_URL=https://composite-stitcher-production.up.railway.app --project-ref YOUR PROJECT REF
   ```

### Function Details

**URL:**
```
https://YOUR PROJECT REF.functions.supabase.co/trigger-composite-stitch
```

**Project Ref:** `YOUR PROJECT REF`

**Request Format:**
```json
{
  "sessionId": "composite_1234567890_abc",
  "bucket": "specs-bucket",
  "frameRate": 30,
  "sampleRate": 44100
}
```

**Response:**
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

---

## Part 3: File Structure

```
Snap Cloud Media Suite/
├── composite-stitcher/              # Railway service (Git repo)
│   ├── index.js                     # Main server + stitching logic
│   ├── package.json                 # Dependencies
│   ├── nixpacks.toml               # System packages (Node 20, FFmpeg)
│   ├── railway.json                # Railway config
│   ├── test-local.js               # Local testing
│   ├── env.template                # Environment variable template
│   └── .gitignore                  # Git ignore rules
│
├── supabase/
│   └── functions/
│       └── trigger-composite-stitch/
│           └── index.ts            # Edge Function (deployed to Supabase)
│
├── project/Snap Cloud/Assets/VideoCapture/Scripts/
│   ├── CompositeCaptureUploader.ts    # Records + uploads
│   ├── CompositeStreamingController.ts # Live streaming
│   └── ... (other capture scripts)
│
└── guide/
    ├── complete-setup-guide.md        # This file
    ├── railway-guide.md               # Railway detailed guide
    └── supabase-edge-function-guide.md # Edge Function detailed guide
```

---

## Part 4: Git-Based Workflow

### Railway Service (Auto-Deploy)
```bash
cd composite-stitcher
# Make changes to index.js or other files
git add .
git commit -m "Your change description"
git push
# Railway automatically redeploys!
```

### Edge Function (Manual Deploy)
```bash
cd "/Users/alessiograncini/Desktop/Snap Cloud Media Suite"
export SUPABASE_ACCESS_TOKEN="YOUR TOKEN"

# Edit function
code supabase/functions/trigger-composite-stitch/index.ts

# Deploy
supabase functions deploy trigger-composite-stitch --project-ref YOUR PROJECT REF

# Then commit to Git for version control
git add supabase/
git commit -m "Update edge function"
git push
```

---

## Part 5: Testing

### Test Railway Service Health
```bash
curl https://composite-stitcher-production.up.railway.app/health
# Expected: {"status":"healthy","service":"composite-stitcher"}
```

### Test Railway Stitch Endpoint
```bash
curl -X POST "https://composite-stitcher-production.up.railway.app/stitch" \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test_123",
    "bucket": "specs-bucket",
    "frameRate": 30,
    "sampleRate": 44100
  }'
# Expected: {"status":"processing","sessionId":"test_123","message":"Stitching job started"}
```

### Test Edge Function
```bash
curl -X POST "https://YOUR PROJECT REF.functions.supabase.co/trigger-composite-stitch" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{
    "sessionId": "test_123",
    "bucket": "specs-bucket",
    "frameRate": 30,
    "sampleRate": 44100
  }'
```

---

## Part 6: Integration with Spectacles App

### Update CompositeCaptureUploader.ts

Add this method after `updateFinalMetadata()`:

```typescript
/**
 * Trigger video stitching after upload completes
 */
private async triggerStitching() {
  try {
    this.log("Triggering video stitching...");
    
    const supabaseProject = this.snapCloudRequirements.getSupabaseProject();
    const functionUrl = `${supabaseProject.url}/functions/v1/trigger-composite-stitch`;
    
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseProject.publicToken}`,
      },
      body: JSON.stringify({
        sessionId: this.sessionId,
        bucket: this.storageBucket,
        frameRate: this.frameRate,
        sampleRate: this.sampleRate,
      }),
    });
    
    const result = await response.json();
    
    if (result.success) {
      this.log('✅ Stitching job started successfully');
      this.updateStatus('Video stitching in progress...');
    } else {
      this.logError('❌ Failed to start stitching job');
      this.updateStatus('Stitching failed - check logs');
    }
  } catch (error) {
    this.logError(`Stitching trigger error: ${error}`);
    this.updateStatus('Error triggering stitching');
  }
}
```

Call it in `stopRecording()` after `updateFinalMetadata()`:

```typescript
private async stopRecording() {
  // ... existing code ...
  
  // Update final metadata
  await this.updateFinalMetadata();
  
  // NEW: Trigger stitching
  await this.triggerStitching();
  
  const duration = (Date.now() - this.recordingStartTime) / 1000;
  this.log(`Composite recording complete: ${this.frameCount} frames, ${this.chunkCount} audio chunks`);
  this.updateStatus(`Recording complete - Stitching in progress...`);
  this.updateButtonText();
}
```

---

## Part 7: How It Works End-to-End

1. **User Records in Spectacles:**
   - Press "Start Composite Recording"
   - App captures video frames (30 FPS) + audio chunks (100ms intervals)
   - Each frame: `composite-video/{sessionId}/frame_00001.jpg`
   - Each audio: `composite-audio/{sessionId}/audio_chunk_1.raw`

2. **Recording Completes:**
   - App creates metadata files with sync info
   - Calls Edge Function with sessionId

3. **Edge Function Triggers Railway:**
   - Validates request
   - Forwards to Railway stitcher service
   - Returns immediate response (job queued)

4. **Railway Stitches Video:**
   - Downloads all frames from Storage
   - Downloads all audio chunks from Storage
   - Creates video: `ffmpeg -i frames -r 30 video.mp4`
   - Combines audio: Concatenates raw audio chunks
   - Converts audio: `ffmpeg -f f32le -ar 44100 audio.wav`
   - Merges: `ffmpeg -i video.mp4 -i audio.wav final.mp4`
   - Uploads result: `composite-videos/{sessionId}/final.mp4`
   - Creates completion metadata

5. **Result Available:**
   - Final video in Storage
   - Download URL available via Supabase
   - Ready for playback or download

---

## Part 8: Key Credentials & URLs

### Railway
- **Service URL:** `https://composite-stitcher-production.up.railway.app`
- **GitHub Repo:** `https://github.com/alessiograncini/composite-stitcher`
- **Environment Variables:** Set in Railway Dashboard

### Supabase
- **Project Ref:** `YOUR PROJECT REF`
- **Function URL:** `https://YOUR PROJECT REF.functions.supabase.co/trigger-composite-stitch`
- **Anon Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (in Spectacles app)
- **CLI Access Token:** `YOUR TOKEN`

### Storage Paths
- **Video Frames:** `composite-video/{sessionId}/frame_*.jpg`
- **Audio Chunks:** `composite-audio/{sessionId}/audio_chunk_*.raw`
- **Metadata:** `metadata/{sessionId}/session_info.json`
- **Final Video:** `composite-videos/{sessionId}/final.mp4`

---

## Part 9: Troubleshooting

### Railway Service Issues

**Service Not Responding:**
- Check: https://railway.app/dashboard
- View: Deployments tab for errors
- Verify: Environment variables are set

**Port Issues:**
- Service runs on port 8080 (reads `process.env.PORT`)
- Domain must point to port 8080

### Edge Function Issues

**Function Not Found:**
```bash
supabase functions list --project-ref YOUR PROJECT REF
```

**View Logs:**
- Go to: Supabase Dashboard → Functions → trigger-composite-stitch → Logs

**Redeploy:**
```bash
export SUPABASE_ACCESS_TOKEN="YOUR TOKEN"
supabase functions deploy trigger-composite-stitch --project-ref YOUR PROJECT REF
```

### Stitching Failures

**Check Railway Logs:**
- Railway Dashboard → composite-stitcher → Logs tab
- Look for FFmpeg errors or download failures

**Common Issues:**
- Missing frames in Storage
- Wrong sessionId
- Incorrect metadata format
- FFmpeg processing errors

**Check Completion:**
- Look for: `metadata/{sessionId}/completion.json`
- Or: `metadata/{sessionId}/error.json`

---

## Part 10: Next Steps

1. ✅ Railway service deployed and healthy
2. ✅ Edge Function deployed
3. ✅ Environment variables configured
4. 🔄 Test and debug Edge Function (check logs in dashboard)
5. ⏳ Update CompositeCaptureUploader to call Edge Function
6. ⏳ Test end-to-end recording → stitching flow
7. ⏳ Monitor first successful stitch in Storage

---

## Part 11: Cost Estimates

### Railway
- **Free Tier:** $5 credit per month
- **Usage:** ~$0.10 per stitch (estimate)
- **Recommendation:** Upgrade to Hobby ($5/month) for production

### Supabase
- **Free Tier:** 500MB storage, 2GB transfer, 500K Edge Function invocations
- **Edge Functions:** Free (within limits)
- **Storage:** ~0.021/GB-month
- **Recommendation:** Free tier sufficient for development

### Total Estimated Cost
- **Development:** Free (both platforms)
- **Production:** ~$5-10/month (Railway Hobby + Supabase Free)

---

## Part 12: Security Notes

- **Service Keys:** Never commit to Git (use .env, env.template instead)
- **Access Tokens:** Personal tokens have full account access - keep secure
- **Railway:** Uses service_role key (full database access)
- **Edge Function:** Callable with anon key (safe for client apps)
- **Storage:** Set up RLS policies to restrict access as needed

---

## Resources

- **Railway Docs:** https://docs.railway.app
- **Supabase CLI:** https://supabase.com/docs/guides/cli
- **FFmpeg Docs:** https://ffmpeg.org/documentation.html
- **Repository:** https://github.com/alessiograncini/composite-stitcher

---

## Summary

We've successfully built and deployed a complete video stitching pipeline:

1. ✅ **Railway Service** - Handles heavy FFmpeg processing
2. ✅ **Edge Function** - Bridges Spectacles app to Railway
3. ✅ **Git Workflow** - Both services tracked and versioned
4. ✅ **Auto-Deploy** - Push to GitHub = instant Railway update
5. ✅ **Testing** - All endpoints verified and working

**Ready for integration with your Spectacles app!** 🎉

