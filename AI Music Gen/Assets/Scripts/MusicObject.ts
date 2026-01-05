import {GoogleGenAI} from "RemoteServiceGateway.lspkg/HostedExternal/GoogleGenAI"
import {GoogleGenAITypes} from "RemoteServiceGateway.lspkg/HostedExternal/GoogleGenAITypes"
import {Snap3D} from "RemoteServiceGateway.lspkg/HostedSnap/Snap3D"
import {Snap3DTypes} from "RemoteServiceGateway.lspkg/HostedSnap/Snap3DTypes"
import {RoundButton} from "SpectaclesUIKit.lspkg/Scripts/Components/Button/RoundButton"
import {MusicPlayer} from "./MusicPlayer"
import {Snap3DObject} from "./Snap3DObject"
@component
export class MusicObject extends BaseScriptComponent {
  private _b64Audio: string
  private _decodedAudio: Uint8Array
  private _hasAudio: boolean = false
  private _isDestroying: boolean = false
  private _isPlaying: boolean = false
  private _audioDuration: number = 0
  private _finishTimer: DelayedCallbackEvent
  @input
  private _snap3DObject: Snap3DObject
  @input
  private _musicPlayer: MusicPlayer
  @input
  private _closeButton: RoundButton
  @input
  private _playButton: RoundButton
  @input
  private _playIcon: SceneObject
  @input
  private _pauseIcon: SceneObject

  onAwake() {
    this.createEvent("OnStartEvent").bind(() => {
      // Disable play until audio is available
      this._setPlayEnabled(false)
      this._playButton.onInitialized.add(() => {
        // Initialize button icons after button is initialized - start with play icon visible, pause icon hidden
        this._updateButtonIcons(false)
        this._playButton.onTriggerUp.add(() => this._onPlayClicked())
      })
      this._closeButton.onInitialized.add(() => {
        this._closeButton.onTriggerUp.add(() => this._onCloseClicked())
      })
      // Set up finish callback on MusicPlayer
      if (this._musicPlayer) {
        this._musicPlayer.setOnFinish(() => this._onAudioFinished())
      }
    })
  }

  setDisplayTitle(displayTitle: string) {
    this._snap3DObject.setPrompt(displayTitle)
    this.generateObjectForDisplayTitle(displayTitle)
  }

  setPosition(position: vec3) {
    this.sceneObject.getTransform().setWorldPosition(position)
  }

  setB64Audio(b64Audio: string) {
    this._b64Audio = b64Audio
    this._decodedAudio = Base64.decode(b64Audio)
    this._hasAudio = true
    this._snap3DObject.setSpinnerEnabled(false)
    this._setPlayEnabled(true)
    // Reset to play state when new audio is set
    this._isPlaying = false
    this._updateButtonIcons(false)
    // Calculate audio duration: PCM16 stereo at 48kHz
    // PCM16 = 2 bytes per sample, Stereo = 2 channels, Sample rate = 48000 Hz
    // Duration = bytes / (bytes_per_sample × channels × sample_rate)
    // Duration = bytes / (2 × 2 × 48000) = bytes / 192000
    this._audioDuration = this._decodedAudio.length / 192000
  }

  closeObject() {
    this._onCloseClicked()
  }

  private _setPlayEnabled(enabled: boolean) {
    if (!this._playButton) {
      return
    }
    // If RoundButton does not support disabled state, toggle visibility
    this._playButton.getSceneObject().enabled = enabled
  }

  private _onPlayClicked() {
    if (!this._hasAudio || !this._decodedAudio || !this._musicPlayer) {
      return
    }
    if (this._isPlaying) {
      // Pause the audio
      this._musicPlayer.pauseAudio()
      this._isPlaying = false
      this._updateButtonIcons(false)
      // Cancel the finish timer if paused
      if (this._finishTimer) {
        this._finishTimer.reset(-1)
      }
    } else {
      // Play the audio
      this._musicPlayer.playAudio(this._decodedAudio)
      this._isPlaying = true
      this._updateButtonIcons(true)
      // Set up timer to reset button after audio duration
      if (this._audioDuration > 0) {
        if (!this._finishTimer) {
          this._finishTimer = this.createEvent("DelayedCallbackEvent")
          this._finishTimer.bind(() => this._onAudioFinished())
        }
        this._finishTimer.reset(this._audioDuration)
      }
    }
  }

  private _updateButtonIcons(isPlaying: boolean) {
    // Enable play icon when paused, disable when playing
    if (this._playIcon) {
      try {
        this._playIcon.enabled = !isPlaying
      } catch (e) {
        print(`Error updating play icon: ${e}`)
      }
    }
    // Enable pause icon when playing, disable when paused
    if (this._pauseIcon) {
      try {
        this._pauseIcon.enabled = isPlaying
      } catch (e) {
        print(`Error updating pause icon: ${e}`)
      }
    }
  }

  private _onAudioFinished() {
    // Switch icon back to play when audio finishes
    if (this._isPlaying) {
      this._isPlaying = false
      this._updateButtonIcons(false)
    }
  }

  private _onCloseClicked() {
    // Prevent multiple close calls
    if (this._isDestroying) {
      return
    }
    this._isDestroying = true

    // Cancel finish timer
    if (this._finishTimer) {
      this._finishTimer.reset(-1)
    }

    // Stop music immediately
    if (this._musicPlayer && this._isPlaying) {
      this._musicPlayer.pauseAudio()
      this._isPlaying = false
    }

    // Destroy immediately - no animations, no delays
    // Match the test script pattern exactly
    try {
      if (this.sceneObject) {
        this.sceneObject.destroy()
      }
    } catch (e) {
      // Suppress any errors during destruction
      print(`Error during destruction: ${e}`)
    }
  }

  private async generateObjectForDisplayTitle(title: string) {
    const systemInstruction: GoogleGenAITypes.Common.Content = {
      role: "system",
      parts: [
        {
          text: "You generate concise prompts for a single tangible 3D object that best symbolizes a short music concept or vibe. Keep under 10 words, cartoony or stylized, clearly iconic, strictly G-rated, no people or faces. Output strictly JSON per schema."
        }
      ]
    }

    const userContent: GoogleGenAITypes.Common.Content = {
      role: "user",
      parts: [{text: `Concept title: ${title}`}]
    }

    const req: GoogleGenAITypes.Gemini.Models.GenerateContentRequest = {
      model: "gemini-2.5-flash-lite",
      type: "generateContent",
      body: {
        systemInstruction,
        contents: [userContent],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              objectPrompt: {
                type: "STRING",
                description: "Short 3D object prompt (≤10 words), tangible, iconic, stylized, G-rated"
              }
            },
            required: ["objectPrompt"]
          },
          temperature: 0.7,
          topP: 0.9
        }
      }
    }

    let objectPrompt = title
    try {
      const res = await GoogleGenAI.Gemini.models(req)
      const text =
        res?.candidates?.[0]?.content?.parts
          ?.map((p) => p.text)
          .filter((t) => !!t)
          .join("\n") || ""
      const json = JSON.parse(text)
      if (json && typeof json.objectPrompt === "string") {
        objectPrompt = json.objectPrompt
      }
    } catch (e) {
      // ignore and fall back to title as prompt
    }

    Snap3D.submitAndGetStatus({
      prompt: objectPrompt,
      format: "glb",
      refine: false,
      use_vertex_color: false
    })
      .then((submitGetStatusResults) => {
        submitGetStatusResults.event.add(([value, assetOrError]) => {
          if (value === "image") {
            assetOrError = assetOrError as Snap3DTypes.TextureAssetData
            this._snap3DObject.setImage(assetOrError.texture)
          } else if (value === "base_mesh") {
            assetOrError = assetOrError as Snap3DTypes.GltfAssetData
            this._snap3DObject.setModel(assetOrError.gltfAsset, false)
          } else if (value === "refined_mesh") {
            assetOrError = assetOrError as Snap3DTypes.GltfAssetData
            this._snap3DObject.setModel(assetOrError.gltfAsset, true)
          } else if (value === "failed") {
            assetOrError = assetOrError as Snap3DTypes.ErrorData
            this._snap3DObject.onFailure(assetOrError.errorMsg)
          }
        })
      })
      .catch((error) => {
        this._snap3DObject.onFailure(error)
      })
  }
}
