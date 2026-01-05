const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8080;

// Get environment variables
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

// Startup logging - help debug configuration issues
console.log('========================================');
console.log('🚀 COMPOSITE STITCHER STARTING UP');
console.log('========================================');
console.log(`[CONFIG] SUPABASE_URL: ${SUPABASE_URL || 'NOT SET!'}`);
console.log(`[CONFIG] SUPABASE_SERVICE_KEY set: ${SUPABASE_SERVICE_KEY ? 'YES' : 'NO'}`);
if (SUPABASE_SERVICE_KEY) {
  console.log(`[CONFIG] Key length: ${SUPABASE_SERVICE_KEY.length} chars`);
  console.log(`[CONFIG] Key starts with: ${SUPABASE_SERVICE_KEY.substring(0, 20)}...`);
  console.log(`[CONFIG] Key ends with: ...${SUPABASE_SERVICE_KEY.substring(SUPABASE_SERVICE_KEY.length - 20)}`);
  // Check key format
  const parts = SUPABASE_SERVICE_KEY.split('.');
  console.log(`[CONFIG] Key has ${parts.length} parts (should be 3 for JWT)`);
  if (parts.length === 3) {
    console.log(`[CONFIG] Part 1 (header) length: ${parts[0].length}`);
    console.log(`[CONFIG] Part 2 (payload) length: ${parts[1].length}`);
    console.log(`[CONFIG] Part 3 (signature) length: ${parts[2].length}`);
  }
}
console.log('========================================');

// Initialize Supabase client
let supabase = null;
if (SUPABASE_URL && SUPABASE_SERVICE_KEY) {
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    console.log('[CONFIG] ✅ Supabase client created');
  } catch (err) {
    console.error('[CONFIG] ❌ Failed to create Supabase client:', err.message);
  }
} else {
  console.error('[CONFIG] ❌ Missing SUPABASE_URL or SUPABASE_SERVICE_KEY!');
}

// Test Supabase connection on startup
async function testSupabaseConnection() {
  if (!supabase) {
    console.error('[TEST] ❌ Cannot test - Supabase client not initialized');
    return;
  }
  
  console.log('[TEST] Testing Supabase connection...');
  
  try {
    // Try to list buckets as a connection test
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('[TEST] ❌ Failed to list buckets:', JSON.stringify(bucketsError));
      console.error('[TEST] Error message:', bucketsError.message);
      console.error('[TEST] Error status:', bucketsError.status);
      console.error('[TEST] This usually means the service key is invalid or from wrong project');
    } else {
      console.log('[TEST] ✅ Successfully connected to Supabase!');
      console.log(`[TEST] Found ${buckets?.length || 0} buckets:`);
      buckets?.forEach(b => console.log(`[TEST]   - ${b.name} (${b.public ? 'public' : 'private'})`));
    }
  } catch (err) {
    console.error('[TEST] ❌ Connection test threw error:', err.message);
    console.error('[TEST] Full error:', JSON.stringify(err, null, 2));
  }
}

// Run connection test after a short delay (let server start first)
setTimeout(testSupabaseConnection, 2000);

// Ayrshare configuration (optional - for social media sharing)
const AYRSHARE_API_KEY = process.env.AYRSHARE_API_KEY;
const AYRSHARE_API_URL = 'https://api.ayrshare.com/api';

/**
 * Post video to social media via Ayrshare
 * Currently enabled: Snapchat Spotlight
 * @param {string} videoUrl - Public URL of the video
 * @param {string} caption - Post caption/description
 * @returns {Promise<object>} - Ayrshare response
 */
async function shareToSocialMedia(videoUrl, caption) {
  if (!AYRSHARE_API_KEY) {
    console.warn('[AYRSHARE] API key not configured - skipping social share');
    return { success: false, error: 'API key not configured' };
  }

  console.log(`[AYRSHARE] Posting to Snapchat Spotlight...`);
  console.log(`[AYRSHARE] Video URL: ${videoUrl}`);
  console.log(`[AYRSHARE] Caption: ${caption}`);

  try {
    const response = await axios.post(
      `${AYRSHARE_API_URL}/post`,
      {
        post: caption,
        mediaUrls: [videoUrl],
        platforms: [
          'snapchat'  // Snapchat Spotlight
          // Future platforms (uncomment to enable):
          // 'instagram',  // Instagram Reels
          // 'tiktok',     // TikTok
          // 'youtube',    // YouTube Shorts
          // 'facebook',   // Facebook Reels
          // 'twitter',    // Twitter/X
          // 'linkedin',   // LinkedIn
        ],
        // Snapchat-specific options (note: snapChatOptions with capital C!)
        snapChatOptions: {
          spotlight: true  // Post to Spotlight (not Stories)
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${AYRSHARE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log(`[AYRSHARE] Success! Response:`, JSON.stringify(response.data, null, 2));
    return { success: true, data: response.data };
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error(`[AYRSHARE ERROR] Failed to post:`, errorMessage);
    return { 
      success: false, 
      error: errorMessage,
      details: error.response?.data 
    };
  }
}

/**
 * Get public URL for a video in Supabase Storage
 * @param {string} bucket - Storage bucket name
 * @param {string} filePath - Path to file in bucket
 * @returns {string} - Public URL
 */
function getPublicVideoUrl(bucket, filePath) {
  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return data.publicUrl;
}

// Health check - now includes detailed config info
app.get('/health', async (req, res) => {
  let supabaseStatus = 'not configured';
  let bucketList = [];
  
  if (supabase) {
    try {
      const { data: buckets, error } = await supabase.storage.listBuckets();
      if (error) {
        supabaseStatus = `error: ${error.message}`;
      } else {
        supabaseStatus = 'connected';
        bucketList = buckets?.map(b => b.name) || [];
      }
    } catch (err) {
      supabaseStatus = `exception: ${err.message}`;
    }
  }
  
  res.json({ 
    status: 'healthy', 
    service: 'composite-stitcher',
    config: {
      supabaseUrl: SUPABASE_URL || 'NOT SET',
      supabaseKeySet: !!SUPABASE_SERVICE_KEY,
      supabaseKeyLength: SUPABASE_SERVICE_KEY?.length || 0,
      supabaseStatus: supabaseStatus,
      availableBuckets: bucketList,
      ayrshareConfigured: !!AYRSHARE_API_KEY
    }
  });
});

// Debug endpoint - test storage access directly
app.get('/debug/storage/:bucket', async (req, res) => {
  const bucket = req.params.bucket;
  console.log(`[DEBUG] Testing storage access to bucket: ${bucket}`);
  
  if (!supabase) {
    return res.status(500).json({ error: 'Supabase not configured' });
  }
  
  try {
    // List root of bucket
    const { data: rootFiles, error: rootError } = await supabase.storage
      .from(bucket)
      .list('', { limit: 10 });
    
    if (rootError) {
      console.error(`[DEBUG] Root list error:`, JSON.stringify(rootError));
      return res.json({ 
        success: false, 
        error: rootError,
        bucket: bucket,
        supabaseUrl: SUPABASE_URL
      });
    }
    
    // List metadata folder
    const { data: metadataFiles, error: metadataError } = await supabase.storage
      .from(bucket)
      .list('metadata', { limit: 10 });
    
    res.json({
      success: true,
      bucket: bucket,
      supabaseUrl: SUPABASE_URL,
      rootFolders: rootFiles?.map(f => f.name) || [],
      metadataFolders: metadataError ? `Error: ${metadataError.message}` : (metadataFiles?.map(f => f.name) || [])
    });
  } catch (err) {
    console.error(`[DEBUG] Exception:`, err);
    res.status(500).json({ 
      success: false, 
      error: err.message,
      stack: err.stack
    });
  }
});

// Main stitching endpoint
app.post('/stitch', async (req, res) => {
  console.log('========================================');
  console.log('[STITCH] NEW STITCH REQUEST RECEIVED');
  console.log('========================================');
  
  // Check Supabase is configured
  if (!supabase) {
    console.error('[STITCH] ❌ Supabase client not initialized!');
    return res.status(500).json({
      success: false,
      error: 'Supabase not configured on server'
    });
  }
  
  // Log raw request body for debugging
  console.log(`[STITCH] Raw request body:`, JSON.stringify(req.body, null, 2));
  
  const { 
    sessionId, 
    bucket, 
    frameRate, 
    sampleRate,
    videoStorageFolder,
    audioStorageFolder,
    stitchedOutputFolder,
    // Audio timing info (source of truth for duration)
    totalFrames,
    totalAudioChunks,
    chunkDurationMs,
    audioDurationMs,
    recordingDurationMs,
    // Video format options
    imageFormat,  // 0 = JPG, 1 = PNG
    useVerticalCrop,
    // Social sharing options
    shareToSpotlight,
    spotlightCaption
  } = req.body;
  
  // Apply defaults for boolean values
  const verticalCropEnabled = useVerticalCrop === true || useVerticalCrop === 'true';
  const spotlightEnabled = shareToSpotlight === true || shareToSpotlight === 'true';
  
  // Calculate frame rate from available timing info
  // Priority: 1) Audio duration, 2) Recording duration, 3) Passed frame rate
  let effectiveFrameRate = frameRate;
  let frameRateSource = 'client-provided';

  if (audioDurationMs && totalFrames && audioDurationMs > 0) {
    // Use audio duration as source of truth
    const audioDurationSec = audioDurationMs / 1000;
    effectiveFrameRate = totalFrames / audioDurationSec;
    frameRateSource = 'audio duration';
    console.log(`[STITCH] Calculating frame rate from AUDIO DURATION:`);
    console.log(`[STITCH]   Audio duration: ${audioDurationSec.toFixed(2)}s`);
    console.log(`[STITCH]   Total frames: ${totalFrames}`);
    console.log(`[STITCH]   Effective frame rate: ${effectiveFrameRate.toFixed(2)} fps`);
  } else if (recordingDurationMs && totalFrames && recordingDurationMs > 0) {
    // Fallback: use recording duration
    const recordingDurationSec = recordingDurationMs / 1000;
    effectiveFrameRate = totalFrames / recordingDurationSec;
    frameRateSource = 'recording duration (no audio)';
    console.log(`[STITCH] ⚠️ No audio - calculating frame rate from RECORDING DURATION:`);
    console.log(`[STITCH]   Recording duration: ${recordingDurationSec.toFixed(2)}s`);
    console.log(`[STITCH]   Total frames: ${totalFrames}`);
    console.log(`[STITCH]   Effective frame rate: ${effectiveFrameRate.toFixed(2)} fps`);
  } else {
    console.log(`[STITCH] Using client-provided frame rate: ${effectiveFrameRate} fps`);
  }
  
  // Determine image format (0 = JPG, 1 = PNG, default to JPG)
  const isPng = imageFormat === 1;
  const imageExtension = isPng ? 'png' : 'jpg';
  
  console.log(`[STITCH] Session ID: ${sessionId}`);
  console.log(`[STITCH] Bucket: ${bucket}`);
  console.log(`[STITCH] Will look for metadata at: ${bucket}/metadata/${sessionId}/`);
  console.log(`[STITCH] Using Supabase URL: ${SUPABASE_URL}`);
  console.log(`[STITCH] Image format: ${isPng ? 'PNG' : 'JPG'} (.${imageExtension})`);
  console.log(`[STITCH] Frame rate from client: ${frameRate} fps`);
  console.log(`[STITCH] Effective frame rate: ${effectiveFrameRate.toFixed ? effectiveFrameRate.toFixed(2) : effectiveFrameRate} fps (from ${frameRateSource})`);
  console.log(`[STITCH] Vertical crop (9:16): ${verticalCropEnabled}`);
  console.log(`[STITCH] Share to Spotlight: ${spotlightEnabled}`);
  
  // Respond immediately - processing will continue in background
  res.json({ 
    status: 'processing', 
    sessionId,
    message: 'Stitching job started',
    useVerticalCrop: verticalCropEnabled,
    willShare: spotlightEnabled && !!AYRSHARE_API_KEY
  });
  
  // Process in background - use effectiveFrameRate (calculated from audio) instead of raw frameRate
  processStitchJob(
    sessionId, 
    bucket, 
    effectiveFrameRate, 
    sampleRate,
    videoStorageFolder || 'composite-video',
    audioStorageFolder || 'composite-audio',
    stitchedOutputFolder || 'composite-stitched',
    {
      useVerticalCrop: verticalCropEnabled,
      shareToSpotlight: spotlightEnabled,
      spotlightCaption: spotlightCaption || 'Captured with Spectacles ✨',
      imageExtension: imageExtension  // 'jpg' or 'png'
    }
  ).catch(error => {
    console.error(`[STITCH ERROR] ${sessionId}:`, error);
  });
});

async function processStitchJob(
  sessionId, 
  bucket, 
  frameRate, 
  sampleRate, 
  videoStorageFolder, 
  audioStorageFolder, 
  stitchedOutputFolder,
  shareOptions = {}
) {
  const workDir = `/tmp/${sessionId}`;
  const framesDir = `${workDir}/frames`;
  const audioDir = `${workDir}/audio`;
  
  // Get image extension from options (default to 'jpg')
  const imageExtension = shareOptions.imageExtension || 'jpg';
  console.log(`[STITCH] Using image format: .${imageExtension}`);
  
  try {
    // Create work directories
    await fs.mkdir(framesDir, { recursive: true });
    await fs.mkdir(audioDir, { recursive: true });
    
    console.log('----------------------------------------');
    console.log(`[DOWNLOAD] Starting download process for session: ${sessionId}`);
    console.log(`[DOWNLOAD] Bucket: ${bucket}`);
    console.log(`[DOWNLOAD] Supabase URL: ${SUPABASE_URL}`);
    console.log('----------------------------------------');
    
    // First, test basic bucket access
    console.log(`[DOWNLOAD] Step 1: Testing bucket access...`);
    try {
      const { data: bucketTest, error: bucketError } = await supabase.storage
        .from(bucket)
        .list('', { limit: 5 });
      
      if (bucketError) {
        console.error(`[DOWNLOAD] ❌ BUCKET ACCESS FAILED!`);
        console.error(`[DOWNLOAD] Error object:`, JSON.stringify(bucketError, null, 2));
        console.error(`[DOWNLOAD] This is likely a configuration issue:`);
        console.error(`[DOWNLOAD]   - Wrong SUPABASE_URL?`);
        console.error(`[DOWNLOAD]   - Wrong SUPABASE_SERVICE_KEY?`);
        console.error(`[DOWNLOAD]   - Bucket '${bucket}' doesn't exist?`);
      } else {
        console.log(`[DOWNLOAD] ✅ Bucket access OK. Root folders: ${bucketTest?.map(f => f.name).join(', ') || 'none'}`);
      }
    } catch (bucketErr) {
      console.error(`[DOWNLOAD] ❌ Bucket access threw exception:`, bucketErr.message);
    }
    
    // Test metadata folder access
    console.log(`[DOWNLOAD] Step 2: Testing metadata folder access...`);
    try {
      const { data: metaTest, error: metaError } = await supabase.storage
        .from(bucket)
        .list('metadata', { limit: 10 });
      
      if (metaError) {
        console.error(`[DOWNLOAD] ❌ METADATA FOLDER ACCESS FAILED!`);
        console.error(`[DOWNLOAD] Error:`, JSON.stringify(metaError, null, 2));
      } else {
        console.log(`[DOWNLOAD] ✅ Metadata folder access OK. Sessions found: ${metaTest?.map(f => f.name).join(', ') || 'none'}`);
        
        // Check if our session exists
        const ourSession = metaTest?.find(f => f.name === sessionId);
        if (ourSession) {
          console.log(`[DOWNLOAD] ✅ Session folder '${sessionId}' EXISTS in metadata/`);
        } else {
          console.log(`[DOWNLOAD] ⚠️ Session folder '${sessionId}' NOT FOUND in metadata/`);
          console.log(`[DOWNLOAD] Available sessions:`, metaTest?.map(f => f.name));
        }
      }
    } catch (metaErr) {
      console.error(`[DOWNLOAD] ❌ Metadata folder access threw exception:`, metaErr.message);
    }
    
    console.log(`[DOWNLOAD] Step 3: Fetching session metadata files...`);
    
    // Get metadata with retry logic for eventual consistency
    let metadataFiles = null;
    let lastError = null;
    const maxMetadataRetries = 5;
    const retryDelayMs = 3000; // 3 seconds between retries
    
    for (let attempt = 1; attempt <= maxMetadataRetries; attempt++) {
      console.log(`[DOWNLOAD] Listing metadata/${sessionId}/ (attempt ${attempt}/${maxMetadataRetries})...`);
      
      try {
        const { data, error } = await supabase.storage
          .from(bucket)
          .list(`metadata/${sessionId}`);
        
        if (error) {
          console.error(`[DOWNLOAD] ❌ Metadata list ERROR on attempt ${attempt}:`);
          console.error(`[DOWNLOAD]   Message: ${error.message}`);
          console.error(`[DOWNLOAD]   Status: ${error.status || 'unknown'}`);
          console.error(`[DOWNLOAD]   Full error: ${JSON.stringify(error, null, 2)}`);
          lastError = error;
        } else {
          console.log(`[DOWNLOAD] List call returned successfully`);
          console.log(`[DOWNLOAD] Data: ${data ? JSON.stringify(data) : 'null'}`);
          
          if (data && data.length > 0) {
            metadataFiles = data;
            console.log(`[DOWNLOAD] ✅ Found ${data.length} metadata files: ${data.map(f => f.name).join(', ')}`);
            break;
          } else {
            console.log(`[DOWNLOAD] ⚠️ List succeeded but returned empty array`);
          }
        }
      } catch (listErr) {
        console.error(`[DOWNLOAD] ❌ List threw EXCEPTION on attempt ${attempt}:`);
        console.error(`[DOWNLOAD]   Message: ${listErr.message}`);
        console.error(`[DOWNLOAD]   Stack: ${listErr.stack}`);
        lastError = listErr;
      }
      
      if (attempt < maxMetadataRetries) {
        console.log(`[DOWNLOAD] Waiting ${retryDelayMs}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, retryDelayMs));
      }
    }
    
    if (!metadataFiles || metadataFiles.length === 0) {
      console.error(`[DOWNLOAD] ========================================`);
      console.error(`[DOWNLOAD] ❌ METADATA NOT FOUND - FINAL FAILURE`);
      console.error(`[DOWNLOAD] ========================================`);
      console.error(`[DOWNLOAD] Session ID: ${sessionId}`);
      console.error(`[DOWNLOAD] Bucket: ${bucket}`);
      console.error(`[DOWNLOAD] Full path attempted: metadata/${sessionId}/`);
      console.error(`[DOWNLOAD] Supabase URL: ${SUPABASE_URL}`);
      console.error(`[DOWNLOAD] Last error: ${lastError ? JSON.stringify(lastError) : 'none'}`);
      console.error(`[DOWNLOAD] ========================================`);
      
      throw new Error(`No metadata found for session ${sessionId} after ${maxMetadataRetries} attempts. ` +
        `Bucket: ${bucket}, URL: ${SUPABASE_URL}. Last error: ${lastError?.message || 'empty list returned'}`);
    }
    
    // Download and parse final stats with retry
    let statsData = null;
    for (let attempt = 1; attempt <= 3; attempt++) {
      console.log(`[DOWNLOAD] Downloading final_stats.json (attempt ${attempt}/3)...`);
      
      const { data, error } = await supabase.storage
        .from(bucket)
        .download(`metadata/${sessionId}/final_stats.json`);
      
      if (error) {
        console.error(`[DOWNLOAD] Stats download error: ${error.message}`);
        if (attempt < 3) {
          await new Promise(resolve => setTimeout(resolve, 2000));
          continue;
        }
        throw new Error(`Failed to download final_stats.json: ${error.message}`);
      }
      
      statsData = data;
      break;
    }
    
    if (!statsData) {
      throw new Error('Failed to download final_stats.json after retries');
    }
    
    const statsText = await statsData.text();
    const stats = JSON.parse(statsText);
    
    console.log(`[INFO] Frames: ${stats.recordingStats.totalFrames}, Audio chunks: ${stats.recordingStats.totalAudioChunks}`);
    
    // AUTO-DETECT image extension by listing files in the folder
    let detectedExtension = imageExtension;
    const videoFolderPath = `${videoStorageFolder}/${sessionId}`;
    console.log(`[DOWNLOAD] Checking for frames in: ${videoFolderPath}`);
    
    const { data: frameFiles, error: listError } = await supabase.storage
      .from(bucket)
      .list(videoFolderPath, { limit: 10 });
    
    if (listError) {
      console.error(`[ERROR] Failed to list frame folder: ${JSON.stringify(listError)}`);
    } else if (frameFiles && frameFiles.length > 0) {
      console.log(`[DOWNLOAD] Found ${frameFiles.length} files in folder`);
      // Detect extension from first frame file
      const firstFrame = frameFiles.find(f => f.name.startsWith('frame_'));
      if (firstFrame) {
        const ext = firstFrame.name.split('.').pop();
        if (ext && (ext === 'jpg' || ext === 'png' || ext === 'jpeg')) {
          detectedExtension = ext;
          console.log(`[DOWNLOAD] ✅ Auto-detected image extension: .${detectedExtension}`);
        }
      }
      // Log first few files for debugging
      console.log(`[DOWNLOAD] Sample files: ${frameFiles.slice(0, 5).map(f => f.name).join(', ')}`);
    } else {
      console.warn(`[DOWNLOAD] ⚠️ No files found in ${videoFolderPath}! Using default extension: .${detectedExtension}`);
    }
    
    // Download all video frames using detected extension
    console.log(`[DOWNLOAD] Downloading ${stats.recordingStats.totalFrames} frames (.${detectedExtension})...`);
    let downloadedFrames = 0;
    for (let i = 1; i <= stats.recordingStats.totalFrames; i++) {
      const framePath = `${videoStorageFolder}/${sessionId}/frame_${String(i).padStart(5, '0')}.${detectedExtension}`;
      const { data, error } = await supabase.storage
        .from(bucket)
        .download(framePath);
      
      if (error) {
        // Better error logging
        const errorMsg = error.message || error.error || JSON.stringify(error);
        console.error(`[ERROR] Failed to download frame ${i} from ${framePath}: ${errorMsg}`);
        continue;
      }
      
      if (data) {
        const buffer = Buffer.from(await data.arrayBuffer());
        if (buffer.length === 0) {
          console.error(`[ERROR] Frame ${i} is empty (0 bytes)`);
          continue;
        }
        await fs.writeFile(`${framesDir}/frame_${String(i).padStart(5, '0')}.${detectedExtension}`, buffer);
        downloadedFrames++;
      }
      
      if (i % 50 === 0) {
        console.log(`[DOWNLOAD] Progress: ${i}/${stats.recordingStats.totalFrames} frames (${downloadedFrames} valid)`);
      }
    }
    
    console.log(`[DOWNLOAD] Downloaded ${downloadedFrames} valid frames out of ${stats.recordingStats.totalFrames}`);
    
    if (downloadedFrames === 0) {
      throw new Error('No valid frames downloaded');
    }
    
    // Download all audio chunks as WAV files
    console.log(`[DOWNLOAD] Downloading ${stats.recordingStats.totalAudioChunks} audio chunks as WAV...`);
    let downloadedAudio = 0;
    for (let i = 1; i <= stats.recordingStats.totalAudioChunks; i++) {
      const audioPath = `${audioStorageFolder}/${sessionId}/audio_chunk_${i}.wav`;
      const { data, error } = await supabase.storage
        .from(bucket)
        .download(audioPath);
      
      if (error) {
        console.error(`[ERROR] Failed to download audio chunk ${i}: ${error.message}`);
        continue;
      }
      
      if (data) {
        const buffer = Buffer.from(await data.arrayBuffer());
        console.log(`[DOWNLOAD] Audio chunk ${i}: ${buffer.length} bytes (WAV)`);
        await fs.writeFile(`${audioDir}/audio_chunk_${i}.wav`, buffer);
        downloadedAudio++;
      }
    }
    
    console.log(`[DOWNLOAD] Downloaded ${downloadedAudio} WAV audio chunks out of ${stats.recordingStats.totalAudioChunks}`);
    
    console.log(`[STITCH] Creating video from frames...`);
    
    // Check if frames exist in local directory
    const localFrameFiles = await fs.readdir(framesDir);
    console.log(`[DEBUG] Frames in directory: ${localFrameFiles.length}`);
    console.log(`[DEBUG] First few frames: ${localFrameFiles.slice(0, 5).join(', ')}`);
    
    const videoOutputPath = `${workDir}/video_only.mp4`;
    const audioOutputPath = `${workDir}/audio.wav`;
    const finalOutputPath = `${workDir}/final.mp4`;
    
    // Build video filters based on options
    // 9:16 crop for Spotlight/Reels: crops center of video to vertical format
    const videoFilters = [];
    if (shareOptions.useVerticalCrop) {
      // Crop to 9:16 from center: width = height * 9/16, centered horizontally
      // Formula: crop=out_w:out_h:x:y where x=(in_w-out_w)/2 for center crop
      videoFilters.push('crop=ih*9/16:ih:(iw-ih*9/16)/2:0');
      console.log(`[FFMPEG] Applying 9:16 vertical crop for Spotlight/Reels`);
    }
    // Always ensure even dimensions for H.264 compatibility
    videoFilters.push('scale=trunc(iw/2)*2:trunc(ih/2)*2');
    
    // Step 1: Create video from frames (using auto-detected format)
    await new Promise((resolve, reject) => {
      ffmpeg()
        .input(`${framesDir}/frame_%05d.${detectedExtension}`)
        .inputOptions([
          '-framerate', String(frameRate),
          '-start_number', '1'
        ])
        .videoCodec('libx264')
        .videoFilters(videoFilters)
        .outputOptions([
          '-pix_fmt yuv420p',
          '-preset medium',
          '-crf 23'
        ])
        .output(videoOutputPath)
        .on('start', cmd => console.log('[FFMPEG] Video command:', cmd))
        .on('progress', progress => {
          if (progress.percent) {
            console.log(`[FFMPEG] Video progress: ${progress.percent.toFixed(1)}%`);
          }
        })
        .on('stderr', (stderrLine) => {
          console.log('[FFMPEG STDERR]', stderrLine);
        })
        .on('end', () => {
          console.log('[FFMPEG] Video created successfully');
          resolve();
        })
        .on('error', (err, stdout, stderr) => {
          console.error('[FFMPEG ERROR]', err.message);
          console.error('[FFMPEG STDERR]', stderr);
          reject(err);
        })
        .run();
    });
    
    // Step 2: Combine audio chunks (now WAV files)
    if (downloadedAudio > 0) {
      console.log(`[STITCH] Combining ${downloadedAudio} WAV audio chunks...`);
      
      // Create a list of WAV files for FFmpeg concat
      const audioListPath = `${audioDir}/audio_list.txt`;
      const audioLines = [];
      
      for (let i = 1; i <= stats.recordingStats.totalAudioChunks; i++) {
        const chunkPath = `${audioDir}/audio_chunk_${i}.wav`;
        try {
          await fs.access(chunkPath);
          audioLines.push(`file '${chunkPath}'`);
        } catch {
          console.warn(`[WARNING] Audio chunk ${i} not found, skipping`);
        }
      }
      
      if (audioLines.length > 0) {
        await fs.writeFile(audioListPath, audioLines.join('\n'));
        
        // Concatenate WAV files using FFmpeg with explicit sample rate
        await new Promise((resolve, reject) => {
          ffmpeg()
            .input(audioListPath)
            .inputOptions(['-f', 'concat', '-safe', '0'])
            .audioCodec('pcm_s16le')  // Re-encode to ensure correct format
            .audioFrequency(sampleRate || 44100)  // Explicitly set sample rate
            .audioChannels(1)  // Mono audio
            .output(audioOutputPath)
            .on('start', cmd => console.log('[FFMPEG] Audio concat command:', cmd))
            .on('end', () => {
              console.log('[FFMPEG] Audio concatenated successfully');
              resolve();
            })
            .on('error', (err, stdout, stderr) => {
              console.error('[FFMPEG AUDIO ERROR]', err.message);
              console.error('[FFMPEG STDERR]', stderr);
              reject(err);
            })
            .run();
        });
      } else {
        console.warn('[WARNING] No audio chunks to concatenate');
        downloadedAudio = 0;
      }
    } else {
      console.log('[INFO] No audio chunks downloaded - will create video-only');
    }
    
    // Step 3: Merge video and audio (if audio exists)
    let finalVideoPath;
    
    if (downloadedAudio > 0) {
      console.log(`[STITCH] Merging video and audio with sample rate: ${sampleRate || 44100}Hz...`);
      await new Promise((resolve, reject) => {
        ffmpeg()
          .input(videoOutputPath)
          .input(audioOutputPath)
          .videoCodec('copy')
          .audioCodec('aac')
          .audioFrequency(sampleRate || 44100)  // Explicitly preserve sample rate
          .audioBitrate('128k')
          .audioChannels(1)  // Mono audio
          .outputOptions(['-shortest'])
          .output(finalOutputPath)
          .on('start', cmd => console.log('[FFMPEG] Merge command:', cmd))
          .on('end', () => {
            console.log('[FFMPEG] Final video with audio created successfully');
            resolve();
          })
          .on('error', (err, stdout, stderr) => {
            console.error('[FFMPEG MERGE ERROR]', err.message);
            console.error('[FFMPEG STDERR]', stderr);
            reject(err);
          })
          .run();
      });
      finalVideoPath = finalOutputPath;
    } else {
      console.log('[INFO] No audio - using video-only file');
      finalVideoPath = videoOutputPath;
    }
    
    // Step 4: Upload final video to Supabase
    const outputFilePath = `${stitchedOutputFolder}/${sessionId}/final.mp4`;
    console.log(`[UPLOAD] Uploading final video to ${outputFilePath}...`);
    const finalVideoBuffer = await fs.readFile(finalVideoPath);
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(outputFilePath, finalVideoBuffer, {
        contentType: 'video/mp4',
        upsert: true
      });
    
    if (uploadError) {
      throw uploadError;
    }
    
    console.log(`[SUCCESS] Video stitched and uploaded: ${sessionId}`);
    
    // Step 5: Share to social media if enabled
    let shareResult = null;
    if (shareOptions.shareToSpotlight) {
      console.log(`[SHARE] Sharing to Snapchat Spotlight...`);
      
      // Get the public URL for the uploaded video
      const publicVideoUrl = getPublicVideoUrl(bucket, outputFilePath);
      console.log(`[SHARE] Public video URL: ${publicVideoUrl}`);
      
      shareResult = await shareToSocialMedia(
        publicVideoUrl,
        shareOptions.spotlightCaption
      );
      
      if (shareResult.success) {
        console.log(`[SHARE] Successfully shared to Spotlight!`);
      } else {
        console.warn(`[SHARE] Failed to share: ${shareResult.error}`);
      }
    }
    
    // Cleanup temp files
    await fs.rm(workDir, { recursive: true, force: true });
    
    // Update metadata with completion status
    const completionMetadata = {
      sessionId,
      status: 'completed',
      completedAt: new Date().toISOString(),
      outputPath: outputFilePath,
      publicUrl: getPublicVideoUrl(bucket, outputFilePath),
      // Video format info
      videoFormat: {
        verticalCrop: shareOptions.useVerticalCrop || false,
        aspectRatio: shareOptions.useVerticalCrop ? '9:16' : 'original'
      },
      // Social sharing results
      socialShare: shareOptions.shareToSpotlight ? {
        requested: true,
        platforms: ['snapchat'],
        caption: shareOptions.spotlightCaption,
        result: shareResult
      } : { requested: false }
    };
    
    await supabase.storage
      .from(bucket)
      .upload(`metadata/${sessionId}/completion.json`, 
        JSON.stringify(completionMetadata, null, 2), {
        contentType: 'application/json',
        upsert: true
      });
    
  } catch (error) {
    console.error(`[ERROR] Stitching failed for ${sessionId}:`, error);
    
    // Upload error status
    const errorMetadata = {
      sessionId,
      status: 'failed',
      error: error.message,
      failedAt: new Date().toISOString()
    };
    
    await supabase.storage
      .from(bucket)
      .upload(`metadata/${sessionId}/error.json`, 
        JSON.stringify(errorMetadata, null, 2), {
        contentType: 'application/json',
        upsert: true
      });
    
    // Cleanup on error
    try {
      await fs.rm(workDir, { recursive: true, force: true });
    } catch (cleanupError) {
      console.error('[CLEANUP ERROR]:', cleanupError);
    }
    
    throw error;
  }
}

app.listen(PORT, () => {
  console.log(`🎬 Composite Stitcher running on port ${PORT}`);
  console.log(`✅ Health check: http://localhost:${PORT}/health`);
  console.log(`📱 Ayrshare integration: ${AYRSHARE_API_KEY ? 'ENABLED' : 'DISABLED (set AYRSHARE_API_KEY to enable)'}`);
});
