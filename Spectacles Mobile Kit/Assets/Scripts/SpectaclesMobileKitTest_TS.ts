@component
export class SpectaclesMobileTest_TS extends BaseScriptComponent {
  @input
  resetAfterDelay: boolean = false

  @input
  image: Image
  @input
  gltfContainer: SceneObject
  @input
  gltfMaterial: Material
  @input
  logText: Text

  private module = require("LensStudio:SpectaclesMobileKitModule")
  private internetModule: InternetModule = require("LensStudio:InternetModule")

  private mainPass: Pass
  private session: any = null

  private appendLine(txt: string) {
    print(txt)
    if (this.logText) {
      this.logText.text += `\n${txt}`
    }
  }

  private async createSessionAsync(onDisconnect: () => void): Promise<any> {
    return new Promise((resolve, reject) => {
      const session = this.module.createSession()
      session.onDisconnected.add(onDisconnect)
      session.onConnected.add(() => {
        resolve(session)
      })
      session.start()
    })
  }

  async onStart() {
    this.image.mainMaterial = this.image.mainMaterial.clone()
    this.mainPass = this.image.mainPass

    this.appendLine("Script Started")
    try {
      this.appendLine("Awaiting connection")

      if (this.resetAfterDelay) {
        const delay = this.createEvent("DelayedCallbackEvent")
        delay.bind(() => {
          this.appendLine("Stopping the session")
          if (this.session) {
            this.session.close()
            this.session = null
          }
        })
        delay.reset(10)
      }

      this.session = await this.createSessionAsync(() => {
        this.appendLine("Disconnected")
      })

      const session = this.session

      this.appendLine("Client Connected")

      // oneway, not expecting a response
      session.sendData("test data")
      this.appendLine("Sent data")

      // request-app-digest
      // This "app://digest" request is not sent to the mobile app for processing.
      // It is called to get the digest of the connected mobile app,
      // allowing the Lens to determine whether the connected app is trustworthy.
      try {
        const response = await session.sendRequest("app://digest")
        this.appendLine(`Digest: ${response}`)
      } catch (error) {
        this.appendLine(`Error: ${error}`)
      }

      // request-response
      try {
        const response = await session.sendRequest("echo me back")
        this.appendLine(`Response: ${response}`)
      } catch (error) {
        this.appendLine(`Error: ${error}`)
      }

      // subscribe to a topic
      const subscription = session.startSubscription("hello world times", (error) => {
        this.appendLine(`Subscription error: ${error}`)
      })
      subscription.add((response) => {
        this.appendLine(`Subscription response: ${response}`)
      })

      const textureId = "spectacleskit://test.png"
      const textureResource: DynamicResource = this.internetModule.makeResourceFromUrl(textureId)
      this.appendLine(`Loading asset: ${textureId}`)
      const remoteMediaModule: RemoteMediaModule = require("LensStudio:RemoteMediaModule")
      remoteMediaModule.loadResourceAsImageTexture(
        textureResource,
        (texture) => {
          this.appendLine("Texture loaded")
          this.mainPass.baseTex = texture
        },
        (error) => {
          this.appendLine(`Error loading asset: ${error}`)
        }
      )
      const meshId = "spectacleskit://test.glb"
      const meshResource: DynamicResource = this.internetModule.makeResourceFromUrl(meshId)
      this.appendLine(`Loading asset: ${meshId}`)
      remoteMediaModule.loadResourceAsGltfAsset(
        meshResource,
        (asset) => {
          this.appendLine("Mesh loaded")
          asset.tryInstantiate(this.gltfContainer, this.gltfMaterial)
          // TODO: you can now find a new object in this.gltfContainer and change its textures
        },
        (error) => {
          this.appendLine(`Error loading asset: ${error}`)
        }
      )

      // try other asset types:
      // remoteMediaModule.loadAsAnimatedTexture('spectacleskit://test_asset.gif', ( texture )=> {
      // remoteMediaModule.loadAsVideoTexture('spectacleskit://test_asset.webp', ( texture )=> {
      // remoteMediaModule.loadAsAudioTrackAsset('spectacleskit://test_asset.wav', ( asset )=> {

      // downloadAsset wouldn't work
      // it only supports assets compressed with our proprietary format
      // script.asset.downloadAsset(( asset )=> {

      // stop the subscription
      // session.stopSubscription(subscription)
    } catch (error) {
      this.appendLine(`Spectacles Kit is not available: ${error}`)
    }
  }
  async onAwake() {
    this.createEvent("OnStartEvent").bind(() => {
      this.onStart()
    })
  }
}
