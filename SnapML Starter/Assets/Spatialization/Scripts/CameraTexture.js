let cameraModule = require('LensStudio:CameraModule');
let cameraRequest;
let cameraTexture;
let cameraTextureProvider;


//@input Component.Image uiImage {"hint":"The image in the scene that will be showing the captured frame."}
//@input Component.Image croppedImage {"hint":"The image in the scene that will be showing the cropped frame."}
//@input Asset.Texture screenTexture;

// Public function to get the camera texture
function getCameraTexture() {
    // Return a copy of the current camera frame
    if (cameraTexture) {
        let frameTexture = cameraTexture.copyFrame();
        // crop before returning
        let screenCropControl = script.screenTexture.control;
        screenCropControl.inputTexture = frameTexture;
        return script.screenTexture;
    }
    return null;
}

script.createEvent('OnStartEvent').bind(() => {

    cameraRequest = CameraModule.createCameraRequest();

    let camera = global.deviceInfoSystem.getTrackingCameraForId(
        CameraModule.CameraId.Default_Color
      );
      let resolution = camera.resolution;
      print(resolution); // x 682 y 1024 

    cameraRequest.cameraId = CameraModule.CameraId.Default_Color;
    cameraTexture = cameraModule.requestCamera(cameraRequest);
    cameraTextureProvider = cameraTexture.control;
    
    cameraTextureProvider.onNewFrame.add((frame) => {
        // Get a copy of the current frame
        let frameTexture = cameraTexture.copyFrame();
        
        if (script.uiImage) {
            script.uiImage.mainPass.baseTex = frameTexture;
        }
        // Update the cropped image on every new frame as well
        if (script.croppedImage && script.screenTexture) {
            // Update the crop control with the new frame
            let screenCropControl = script.screenTexture.control;
            screenCropControl.inputTexture = frameTexture;
            script.croppedImage.mainPass.baseTex = script.screenTexture;
        }
    });
    
    // Initial setup for the cropped image
    if (script.croppedImage && script.screenTexture) {
        script.croppedImage.mainPass.baseTex = getCameraTexture();
    }
});

// Make the function accessible through the script
script.getCameraTexture = getCameraTexture;
