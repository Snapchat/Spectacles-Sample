# Railway Deployment Guide - Composite Stitcher

> **⚠️ Disclaimer:** This guide uses [Railway](https://railway.app/) as an example hosting platform. Railway is **not endorsed or affiliated with Snap Inc.** You may use any Node.js hosting service (Heroku, Render, AWS, Google Cloud, etc.) that supports FFmpeg.

## Overview
The composite stitcher is a Node.js service that uses FFmpeg to stitch video frames and audio chunks into a final MP4 file. It also supports optional social media sharing via third-party APIs.

**Example Service URL:** `https://your-service.up.railway.app`

---

## Initial Setup

### 1. Create the Service
Created a Node.js service with:
- Express server
- Supabase client for storage access
- FFmpeg for video/audio stitching
- Located in: `/composite-stitcher`

### 2. Initialize Git Repository
```bash
cd composite-stitcher
git init
git add .
git commit -m "Initial commit: Composite stitcher service with FFmpeg"
```

### 3. Push to GitHub
```bash
git remote add origin https://github.com/alessiograncini/composite-stitcher.git
git branch -M main
git push -u origin main
```

---

## Railway Deployment

### 1. Connect to Railway
- Go to https://railway.app/dashboard
- Click "New Project"
- Choose "Deploy from GitHub repo"
- Select the `composite-stitcher` repository

### 2. Configure Build
Railway auto-detects configuration from:
- `package.json` - Dependencies
- `nixpacks.toml` - System packages (Node.js 20 + FFmpeg)
- `railway.json` - Railway-specific settings

### 3. Set Environment Variables
In Railway Dashboard → Variables tab, add:
- `SUPABASE_URL` = Your Supabase project URL
- `SUPABASE_SERVICE_KEY` = Your service_role key from Supabase
- `AYRSHARE_API_KEY` = (Optional) Your Ayrshare API key for social sharing

> **Note:** The `AYRSHARE_API_KEY` is only required if you want to enable automatic sharing to Snapchat Spotlight. See [Social Sharing Setup](#social-sharing-setup-optional) below.

### 4. Configure Networking
Settings → Networking → Generate Service Domain:
- Port: **8080**
- Domain generated: `composite-stitcher-production.up.railway.app`

---

## Git-Based Workflow

Every push to GitHub automatically redeploys:

```bash
# Make changes
git add .
git commit -m "Your change description"
git push

# Railway automatically deploys!
```

---

## Service Endpoints

### Health Check
```bash
GET https://composite-stitcher-production.up.railway.app/health
```
Response: `{"status":"healthy","service":"composite-stitcher"}`

### Stitch Video
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

---

## How It Works

1. **Spectacles uploads** frames + audio chunks to Supabase Storage
2. **Edge Function triggers** the stitcher with session ID
3. **Railway service:**
   - Downloads all frames from Storage
   - Downloads all audio chunks from Storage
   - Uses FFmpeg to create video from frames
   - Uses FFmpeg to combine audio chunks
   - Uses FFmpeg to merge video + audio
   - Uploads final MP4 to Storage
   - Creates completion metadata

4. **Final video** appears in: `composite-videos/{sessionId}/final.mp4`

---

## Troubleshooting

### Service Not Responding
- Check Deployments tab for errors
- Verify environment variables are set
- Check logs for Supabase connection errors

### Port Issues
- Service runs on port 8080 (reads from `process.env.PORT`)
- Domain must be configured for port 8080

### FFmpeg Issues
- FFmpeg is installed via `nixpacks.toml`
- Verifiable in build logs during deployment

---

## Files Structure

```
composite-stitcher/
├── index.js              # Main Express server + stitching logic
├── package.json          # Node dependencies
├── nixpacks.toml        # System packages (Node 20, FFmpeg)
├── railway.json         # Railway configuration
├── test-local.js        # Local testing script
├── env.template         # Environment variable template
└── .gitignore           # Git ignore rules
```

---

## Key Configuration

### nixpacks.toml
```toml
[phases.setup]
nixPkgs = ["nodejs_20", "ffmpeg"]
```

### package.json engines
```json
"engines": {
  "node": ">=20.0.0"
}
```

### Port Configuration
```javascript
const PORT = process.env.PORT || 8080;
```

---

## Cost Estimate

Railway Free Tier:
- $5 free credit per month
- Good for development/testing
- Upgrade to hobby plan ($5/month) for production

---

## Social Sharing Setup (Optional)

> **⚠️ Disclaimer:** This example uses [Ayrshare](https://www.ayrshare.com/) for social media posting. Ayrshare is **not endorsed or affiliated with Snap Inc.** This is provided as an example integration pattern. You may use any similar service or build your own direct API integration.

### 1. Create Ayrshare Account
- Sign up at [ayrshare.com](https://www.ayrshare.com/)
- Connect your Snapchat Creator account (required for Spotlight posting)

### 2. Get API Key
- Go to [Ayrshare Dashboard → API Keys](https://app.ayrshare.com/account)
- Copy your API key

### 3. Add to Railway Environment
```bash
# In Railway Dashboard → Variables tab
AYRSHARE_API_KEY=your_ayrshare_api_key_here
```

### 4. How It Works
When sharing is enabled:
1. Video is stitched with optional 9:16 vertical crop
2. Final MP4 is uploaded to Supabase Storage
3. Public URL is retrieved
4. Ayrshare API posts the video to Snapchat Spotlight with caption

### 5. Supported Platforms
Currently enabled: **Snapchat Spotlight**

The stitcher code supports additional platforms (commented out):
- Instagram Reels
- TikTok
- YouTube Shorts
- Facebook Reels
- Twitter/X
- LinkedIn

To enable additional platforms, modify `index.js`:
```javascript
platforms: [
  'snapchat',
  'instagram',  // Uncomment to enable
  'tiktok',     // Uncomment to enable
]
```

---

## Next Steps

After Railway setup:
1. ✅ Service deployed and healthy
2. Create Supabase Edge Function to trigger stitching
3. Update CompositeCaptureUploader to call Edge Function
4. (Optional) Configure Ayrshare for social sharing
5. Test end-to-end recording → stitching → sharing flow

