import { Gemini } from "RemoteServiceGateway.lspkg/HostedExternal/Gemini";
import { GeminiTypes } from "RemoteServiceGateway.lspkg/HostedExternal/GeminiTypes";
import { OpenAI } from "RemoteServiceGateway.lspkg/HostedExternal/OpenAI";
import { OpenAITypes } from "RemoteServiceGateway.lspkg/HostedExternal/OpenAITypes";

export class ImageGenerator {
  private rmm = require("LensStudio:RemoteMediaModule") as RemoteMediaModule;
  private model: string;

  constructor(model: string) {
    this.model = model;
  }

  generateImage(prompt: string): Promise<Texture> {
    if (this.model === "OpenAI") {
      return this.generateWithOpenAI(prompt);
    } else {
      return this.generateWithGemini(prompt);
    }
  }

  private generateWithGemini(prompt: string): Promise<Texture> {
    return new Promise((resolve, reject) => {
      let request: GeminiTypes.Models.GenerateContentRequest = {
        model: "gemini-2.0-flash-preview-image-generation",
        type: "generateContent",
        body: {
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
              role: "user",
            },
          ],
          generationConfig: {
            responseModalities: ["TEXT", "IMAGE"],
          },
        },
      };

      Gemini.models(request)
        .then((response) => {
          if (!response.candidates || response.candidates.length === 0) {
            reject("No image generated in response");
            return;
          }

          let foundImage = false;
          for (let part of response.candidates[0].content.parts) {
            if (part?.inlineData) {
              foundImage = true;
              let b64Data = part.inlineData.data;
              Base64.decodeTextureAsync(
                b64Data,
                (texture) => {
                  resolve(texture);
                },
                () => {
                  reject("Failed to decode texture from base64 data.");
                }
              );
              break; // Use the first image found
            }
          }

          if (!foundImage) {
            reject("No image data found in response");
          }
        })
        .catch((error) => {
          reject("Error while generating image: " + error);
        });
    });
  }

  private generateWithOpenAI(prompt: string): Promise<Texture> {
    return new Promise((resolve, reject) => {
      let req = {
        prompt: prompt,
        n: 1,
        model: "dall-e-3",
      } as OpenAITypes.ImageGenerate.Request;
      OpenAI.imagesGenerate(req)
        .then((result) => {
          result.data.forEach((datum) => {
            let b64 = datum.b64_json;
            let url = datum.url;
            if (url) {
              print("Texture loaded as image URL");
              let rsm =
                require("LensStudio:RemoteServiceModule") as RemoteServiceModule;
              let resource = rsm.makeResourceFromUrl(url);
              this.rmm.loadResourceAsImageTexture(
                resource,
                (texture) => {
                  resolve(texture);
                },
                () => {
                  reject("Failure to download texture from URL");
                }
              );
            } else if (b64) {
              print("Decoding texture from base64");
              Base64.decodeTextureAsync(
                b64,
                (texture) => {
                  resolve(texture);
                },
                () => {
                  reject("Failure to download texture from base64");
                }
              );
            }
          });
        })
        .catch((error) => reject(error));
    });
  }
}
