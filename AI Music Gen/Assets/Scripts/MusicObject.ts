import { Snap3DObject } from "./Snap3DObject";
import { Frame } from "SpectaclesUIKit.lspkg/Scripts/Components/Frame/Frame";
import { GoogleGenAI } from "RemoteServiceGateway.lspkg/HostedExternal/GoogleGenAI";
import { GoogleGenAITypes } from "RemoteServiceGateway.lspkg/HostedExternal/GoogleGenAITypes";
import { Snap3D } from "RemoteServiceGateway.lspkg/HostedSnap/Snap3D";
import { Snap3DTypes } from "RemoteServiceGateway.lspkg/HostedSnap/Snap3DTypes";
import { MusicPlayer } from "./MusicPlayer";
import animate from "SpectaclesInteractionKit.lspkg/Utils/animate";
import { RoundButton } from "SpectaclesUIKit.lspkg/Scripts/Components/Button/RoundButton";
import WorldCameraFinderProvider from "SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider";
@component
export class MusicObject extends BaseScriptComponent {
  private _b64Audio: string;
  private _decodedAudio: Uint8Array;
  private _hasAudio: boolean = false;
  private _baseScale: vec3;
  private _cancelAnim: (() => void) | null = null;
  @input
  private _snap3DObject: Snap3DObject;
  @input
  private _frame: Frame;
  @input
  private _musicPlayer: MusicPlayer;
  @input
  private _closeButton: RoundButton;
  @input
  private _playButton: RoundButton;

  onAwake() {
    this.createEvent("OnStartEvent").bind(() => {
      // Disable play until audio is available
      this._setPlayEnabled(false);
      this._playButton.onInitialized.add(() => {
        this._playButton.onTriggerUp.add(() => this._onPlayClicked());
      });
      this._closeButton.onInitialized.add(() => {
        this._closeButton.onTriggerUp.add(() => this._onCloseClicked());
      });
      let userPos = WorldCameraFinderProvider.getInstance().getWorldPosition();
      const tr = this._frame.getTransform();
      const framePos = tr.getWorldPosition();
      let toUser = userPos.sub(framePos);
      // Project onto XZ plane to get yaw-only direction
      toUser.y = 0;
      if (toUser.length > 0.0001) {
        toUser = toUser.normalize();
        // Compute yaw to face the user on Y axis, preserve existing X and Z
        const currentEuler = tr.getWorldRotation().toEulerAngles();
        const yaw = Math.atan2(toUser.x, toUser.z);
        const newEuler = new vec3(currentEuler.x, yaw, currentEuler.z);
        tr.setWorldRotation(
          quat.fromEulerAngles(newEuler.x, newEuler.y, newEuler.z)
        );
      }

      // Animate the frame in from scale 0
      if (this._frame) {
        const tr = this._frame.getTransform();
        const currentScale = tr.getLocalScale();
        this._baseScale =
          currentScale &&
          (currentScale.x !== 0 || currentScale.y !== 0 || currentScale.z !== 0)
            ? currentScale
            : new vec3(1, 1, 1);
        tr.setLocalScale(this._baseScale.uniformScale(0));
        if (this._cancelAnim) {
          this._cancelAnim();
          this._cancelAnim = null;
        }
        this._cancelAnim = animate({
          duration: 0.25,
          easing: "ease-out-back-cubic",
          update: (t: number) => {
            tr.setLocalScale(this._baseScale.uniformScale(t));
          },
          ended: () => {
            this._cancelAnim = null;
          },
        });
      }
    });
  }

  setDisplayTitle(displayTitle: string) {
    this._snap3DObject.setPrompt(displayTitle);
    this.generateObjectForDisplayTitle(displayTitle);
  }

  setPosition(position: vec3) {
    this._frame.getTransform().setWorldPosition(position);
  }

  setB64Audio(b64Audio: string) {
    this._b64Audio = b64Audio;
    this._decodedAudio = Base64.decode(b64Audio);
    this._hasAudio = true;
    this._snap3DObject.setSpinnerEnabled(false);
    this._setPlayEnabled(true);
  }

  closeObject() {
    this._onCloseClicked();
  }

  private _setPlayEnabled(enabled: boolean) {
    if (!this._playButton) {
      return;
    }
    // If RoundButton does not support disabled state, toggle visibility
    this._playButton.getSceneObject().enabled = enabled;
  }

  private _onPlayClicked() {
    if (!this._hasAudio || !this._decodedAudio || !this._musicPlayer) {
      return;
    }
    this._musicPlayer.playAudio(this._decodedAudio);
  }

  private _onCloseClicked() {
    // Animate the frame out, then destroy
    if (this._frame) {
      const tr = this._frame.getTransform();
      const base = this._baseScale || tr.getLocalScale() || new vec3(1, 1, 1);
      if (this._cancelAnim) {
        this._cancelAnim();
        this._cancelAnim = null;
      }
      this._cancelAnim = animate({
        duration: 0.25,
        easing: "ease-in-back-cubic",
        update: (t: number) => {
          const k = 1 - t;
          tr.setLocalScale(base.uniformScale(k));
        },
        ended: () => {
          this._cancelAnim = null;
          this.sceneObject.destroy();
        },
      });
      return;
    }
    this.sceneObject.destroy();
  }

  private async generateObjectForDisplayTitle(title: string) {
    const systemInstruction: GoogleGenAITypes.Common.Content = {
      role: "system",
      parts: [
        {
          text: "You generate concise prompts for a single tangible 3D object that best symbolizes a short music concept or vibe. Keep under 10 words, cartoony or stylized, clearly iconic, strictly G-rated, no people or faces. Output strictly JSON per schema.",
        },
      ],
    };

    const userContent: GoogleGenAITypes.Common.Content = {
      role: "user",
      parts: [{ text: `Concept title: ${title}` }],
    };

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
                description:
                  "Short 3D object prompt (≤10 words), tangible, iconic, stylized, G-rated",
              },
            },
            required: ["objectPrompt"],
          },
          temperature: 0.7,
          topP: 0.9,
        },
      },
    };

    let objectPrompt = title;
    try {
      const res = await GoogleGenAI.Gemini.models(req);
      const text =
        res?.candidates?.[0]?.content?.parts
          ?.map((p) => p.text)
          .filter((t) => !!t)
          .join("\n") || "";
      const json = JSON.parse(text);
      if (json && typeof json.objectPrompt === "string") {
        objectPrompt = json.objectPrompt;
      }
    } catch (e) {
      // ignore and fall back to title as prompt
    }

    Snap3D.submitAndGetStatus({
      prompt: objectPrompt,
      format: "glb",
      refine: false,
      use_vertex_color: false,
    })
      .then((submitGetStatusResults) => {
        submitGetStatusResults.event.add(([value, assetOrError]) => {
          if (value === "image") {
            assetOrError = assetOrError as Snap3DTypes.TextureAssetData;
            this._snap3DObject.setImage(assetOrError.texture);
          } else if (value === "base_mesh") {
            assetOrError = assetOrError as Snap3DTypes.GltfAssetData;
            this._snap3DObject.setModel(assetOrError.gltfAsset, false);
          } else if (value === "refined_mesh") {
            assetOrError = assetOrError as Snap3DTypes.GltfAssetData;
            this._snap3DObject.setModel(assetOrError.gltfAsset, true);
          } else if (value === "failed") {
            assetOrError = assetOrError as Snap3DTypes.ErrorData;
            this._snap3DObject.onFailure(assetOrError.errorMsg);
          }
        });
      })
      .catch((error) => {
        this._snap3DObject.onFailure(error);
      });
  }
}
