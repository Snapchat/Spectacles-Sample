// @input bool resetAfterDelay = false
// @input Component.Image image
// @input SceneObject gltfContainer
// @input Asset.Material gltfMaterial
// @input Component.Text logText

const module = require("LensStudio:SpectaclesMobileKitModule");
const internetModule = require("LensStudio:InternetModule");

let mainPass;
let session = null;

function appendLine(txt) {
  print(txt);
  if (script.logText) {
    script.logText.text += `\n${txt}`;
  }
}

function createSessionAsync(onDisconnect) {
  return new Promise((resolve, reject) => {
    const newSession = module.createSession();
    newSession.onDisconnected.add(onDisconnect);
    newSession.onConnected.add(() => {
      resolve(newSession);
    });
    newSession.start();
  });
}

async function onStart() {
  script.image.mainMaterial = script.image.mainMaterial.clone();
  mainPass = script.image.mainPass;

  appendLine("Script Started");
  try {
    appendLine("Awaiting connection");

    if (script.resetAfterDelay) {
      const delay = script.createEvent("DelayedCallbackEvent");
      delay.bind(() => {
        appendLine("Stopping the session");
        if (session) {
          session.close();
          session = null;
        }
      });
      delay.reset(10);
    }

    session = await createSessionAsync(() => {
      appendLine("Disconnected");
    });

    appendLine("Client Connected");

    // oneway, not expecting a response
    session.sendData("test data");
    appendLine("Sent data");

    // request-app-digest
    // This "app://digest" request is not sent to the mobile app for processing.
    // It is called to get the digest of the connected mobile app,
    // allowing the Lens to determine whether the connected app is trustworthy.
    try {
      const response = await session.sendRequest("app://digest");
      appendLine(`Digest: ${response}`);
    } catch (error) {
      appendLine(`Error: ${error}`);
    }

    // request-response
    try {
      const response = await session.sendRequest("echo me back");
      appendLine(`Response: ${response}`);
    } catch (error) {
      appendLine(`Error: ${error}`);
    }

    // subscribe to a topic
    const subscription = session.startSubscription("hello world times", (error) => {
      appendLine(`Subscription error: ${error}`);
    });
    subscription.add((response) => {
      appendLine(`Subscription response: ${response}`);
    });

    const textureId = "spectacleskit://test.png";
    const textureResource = internetModule.makeResourceFromUrl(textureId);
    appendLine(`Loading asset: ${textureId}`);
    const remoteMediaModule = require("LensStudio:RemoteMediaModule");
    remoteMediaModule.loadResourceAsImageTexture(
      textureResource,
      (texture) => {
        appendLine("Texture loaded");
        mainPass.baseTex = texture;
      },
      (error) => {
        appendLine(`Error loading asset: ${error}`);
      }
    );

    const meshId = "spectacleskit://test.glb";
    const meshResource = internetModule.makeResourceFromUrl(meshId);
    appendLine(`Loading asset: ${meshId}`);
    remoteMediaModule.loadResourceAsGltfAsset(
      meshResource,
      (asset) => {
        appendLine("Mesh loaded");
        asset.tryInstantiate(script.gltfContainer, script.gltfMaterial);
        // TODO: you can now find a new object in script.gltfContainer and change its textures
      },
      (error) => {
        appendLine(`Error loading asset: ${error}`);
      }
    );

    // try other asset types:
    // remoteMediaModule.loadResourceAsAudioTrackAsset('spectacleskit://test_asset.gif', ( texture )=> {
    // remoteMediaModule.loadResourceAsVideoTexture('spectacleskit://test_asset.webp', ( texture )=> {
    // remoteMediaModule.loadResourceAsAudioTrackAsset('spectacleskit://test_asset.wav', ( asset )=> {

    // downloadAsset wouldn't work
    // it only supports assets compressed with our proprietary format
    // script.asset.downloadAsset(( asset )=> {

    // stop the subscription
    // session.stopSubscription(subscription)
  } catch (error) {
    appendLine(`Spectacles Kit is not available: ${error}`);
  }
}

async function onAwake() {
  script.createEvent("OnStartEvent").bind(() => {
    onStart();
  });
}

// Initialize the script
onAwake();
