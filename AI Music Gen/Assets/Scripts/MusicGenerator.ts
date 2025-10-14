import { Lyria } from "RemoteServiceGateway.lspkg/HostedExternal/Lyria";
import { GoogleGenAITypes } from "RemoteServiceGateway.lspkg/HostedExternal/GoogleGenAITypes";
import { GoogleGenAI } from "RemoteServiceGateway.lspkg/HostedExternal/GoogleGenAI";
import { MusicObject } from "./MusicObject";
import { setTimeout } from "SpectaclesInteractionKit.lspkg/Utils/FunctionTimingUtils";

@component
export class MusicGenerator extends BaseScriptComponent {
  @input private _spawnPosition: SceneObject;
  private _musicObjectPrefab: ObjectPrefab = requireAsset(
    "../Prefabs/MusicObject.prefab"
  ) as ObjectPrefab;

  onAwake() {}

  public createMusicObject(genres: string[]) {
    this.combineGenresToPrompt(genres).then(({ prompt, displayTitle }) => {
      let musicObject = this._musicObjectPrefab.instantiate(null);
      let musicObjController = musicObject.getComponent(
        MusicObject.getTypeName()
      );
      musicObjController.setDisplayTitle(displayTitle);
      musicObjController.setPosition(
        this._spawnPosition.getTransform().getWorldPosition()
      );
      print("Lyria prompt: " + prompt);

      const musicRequest: GoogleGenAITypes.Lyria.LyriaRequest = {
        model: "lyria-002",
        type: "predict",
        body: {
          instances: [
            {
              prompt: prompt,
            },
          ],
          parameters: {
            sample_count: 1,
          },
        },
      };

      Lyria.performLyriaRequest(musicRequest)
        .then((response) => {
          if (response && response.predictions && response.predictions.length) {
            const b64 = response.predictions[0].bytesBase64Encoded;
            if (b64) {
              musicObjController.setB64Audio(b64);
            }
          }
        })
        .catch((error) => {
          print(`[Lyria Error] ${error}`);
          musicObjController.setDisplayTitle(
            "Error generating, try something else"
          );
          setTimeout(() => {
            musicObjController.closeObject();
          }, 1500);
        });
    });
  }

  private async combineGenresToPrompt(
    genres: string[]
  ): Promise<{ prompt: string; displayTitle: string }> {
    const systemInstruction: GoogleGenAITypes.Common.Content = {
      role: "system",
      parts: [
        {
          text: "You are composing best-practice prompts for the Lyria music generation model. Given a list of genres, write ONE cohesive, evocative, FAMILY-FRIENDLY prompt that: (1) clearly states genre/style, (2) sets mood/ambience, (3) specifies tempo feel (e.g., fast/slow), (4) describes rhythm/beat, (5) names a few key instruments, (6) hints at arrangement/progression, (7) mentions space/ambience (e.g., reverb), and (8) uses production-quality adjectives (e.g., warm, gritty, polished). Default to an instrumental track (no vocals) unless explicitly asked. Keep it to 1–2 sentences, vivid but concise. Also provide a displayTitle of at most 4 simple words capturing the vibe. Output strictly JSON per the provided schema.",
        },
      ],
    };

    const userContent: GoogleGenAITypes.Common.Content = {
      role: "user",
      parts: [
        {
          text: `Combine these genres into one music prompt: ${genres.join(
            ", "
          )}`,
        },
      ],
    };

    const geminiRequest: GoogleGenAITypes.Gemini.Models.GenerateContentRequest =
      {
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
                prompt: {
                  type: "STRING",
                  description:
                    "A single, cohesive prompt text to feed to a music generator (e.g., Lyria)",
                },
                displayTitle: {
                  type: "STRING",
                  description:
                    "A simple title (max 4 words) for UI display describing the combined vibe",
                },
              },
              required: ["prompt", "displayTitle"],
            },
            temperature: 0.6,
            topP: 0.9,
          },
        },
      };

    const response = await GoogleGenAI.Gemini.models(geminiRequest);
    const text =
      response?.candidates?.[0]?.content?.parts
        ?.map((p) => p.text)
        .filter((t) => !!t)
        .join("\n") || "";

    try {
      const json = JSON.parse(text);
      if (
        json &&
        typeof json.prompt === "string" &&
        typeof json.displayTitle === "string"
      ) {
        return { prompt: json.prompt, displayTitle: json.displayTitle };
      }
    } catch (e) {
      // fall through to return raw text
    }

    return { prompt: text, displayTitle: genres.slice(0, 4).join(" ") };
  }
}
