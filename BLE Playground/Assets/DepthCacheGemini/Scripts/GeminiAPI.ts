import {Gemini} from "RemoteServiceGateway.lspkg/HostedExternal/Gemini"
import {GeminiTypes} from "RemoteServiceGateway.lspkg/HostedExternal/GeminiTypes"

//const GEMINI_MODEL = "gemini-2.5-flash-preview-04-17";
//const GEMINI_MODEL = "gemini-2.5-flash-preview-05-20";
const GEMINI_MODEL = "gemini-2.5-pro-preview-05-06" //does not support thinkingBudget!!

const SYSTEM_MESSAGE =
  //Goal
  "You are an AI inside of augmented reality glasses. " +
  //Return Format
  "Return bounding boxes as a JSON array with labels, your answer should be a JSON object with 3 keys: 'message', 'data' and 'lines. The 'data' key should contain an array of objects, each with a label and coordinates of a bounding box. " +
  "if the user asks about a specific area, where something is, or how to do a task, you can set showArrow to true and that will create a yellow visual arrow in the scene. This should be set to true most of the time.\n" +
  "if the user asks to measure something or draw a line you can set the 'lines' key to an array of objects, each with a start and end bounding box\n" +
  //Warnings
  "Return bounding boxes as a JSON array with labels. Never return masks or code fencing. Limit to 25 objects.\n" +
  "If an object is present multiple times, name them according to their unique characteristic (colors, size, position, unique characteristics, etc..). \n" +
  //Context Dump
  "The label and arrow can be useful for tasks, if user asks how to use something, make use and arrow and set the label to Step #1, Step #2, etc. \n" +
  "Dont label anything over 20 feet away from the camera. \n" +
  "Do not label objects that you already labled! Make sure the AR content you add doesnt overlap each other, but feel free to make as many as you see fit! You are the AR AI BOSS!\n"

@component
export class GeminiAPI extends BaseScriptComponent {
  onAwake() {}

  makeGeminiRequest(texture: Texture, userQuery: string, callback: (any) => void) {
    Base64.encodeTextureAsync(
      texture,
      (base64String) => {
        print("Making image request...")
        this.sendGeminiChat(userQuery, base64String, texture, callback)
      },
      () => {
        print("Image encoding failed!")
      },
      CompressionQuality.HighQuality,
      EncodingType.Png
    )
  }

  sendGeminiChat(request: string, image64: string, texture: Texture, callback: (response: any) => void) {
    const respSchema: GeminiTypes.Common.Schema = {
      type: "object",
      properties: {
        message: {type: "string"},
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              boundingBox: {
                type: "array",
                items: {type: "number"}
              },
              label: {type: "string"},
              useArrow: {type: "boolean"}
            },
            required: ["boundingBox", "label", "useArrow"]
          }
        },
        lines: {
          type: "array",
          items: {
            type: "object",
            properties: {
              startBoundingBox: {
                type: "array",
                items: {type: "number"}
              },
              endBoundingBox: {
                type: "array",
                items: {type: "number"}
              }
            },
            required: ["startBoundingBox", "endBoundingBox"]
          }
        }
      },
      required: ["message", "data", "lines"]
    }

    const reqObj: GeminiTypes.Models.GenerateContentRequest = {
      model: GEMINI_MODEL,
      type: "generateContent",
      body: {
        contents: [
          {
            role: "user",
            parts: [
              {
                inlineData: {
                  mimeType: "image/png",
                  data: image64
                }
              },
              {
                text: request
              }
            ]
          }
        ],
        systemInstruction: {
          parts: [
            {
              text: SYSTEM_MESSAGE
            }
          ]
        },
        generationConfig: {
          temperature: 0.5,
          responseMimeType: "application/json",
          response_schema: respSchema
        }
      }
    }

    print(JSON.stringify(reqObj.body))

    Gemini.models(reqObj)
      .then((response) => {
        const responseObj = JSON.parse(response.candidates[0].content.parts[0].text)
        this.onGeminiResponse(responseObj, texture, callback)
      })
      .catch((error) => {
        print("Gemini error: " + error)
      })
  }

  private onGeminiResponse(responseObj: any, texture: Texture, callback: (response: any) => void) {
    const geminiResult = {
      points: [],
      lines: [],
      aiMessage: "no response"
    }

    print("GEMINI RESPONSE: " + responseObj.message)
    geminiResult.aiMessage = responseObj.message
    try {
      //load points
      const data = responseObj.data
      print("Data: " + JSON.stringify(data))
      print("POINT LENGTH: " + data.length)
      for (let i = 0; i < data.length; i++) {
        const centerPoint = this.boundingBoxToPixels(data[i].boundingBox, texture.getWidth(), texture.getHeight())
        const lensStudioPoint = {
          pixelPos: centerPoint,
          label: data[i].label,
          showArrow: data[i].useArrow
        }
        geminiResult.points.push(lensStudioPoint)
      }
      //load lines
      const lines = responseObj.lines
      print("LINE LENGTH: " + lines.length)
      for (let i = 0; i < lines.length; i++) {
        const startCenterPoint = this.boundingBoxToPixels(
          lines[i].startBoundingBox,
          texture.getWidth(),
          texture.getHeight()
        )
        const endCenterPoint = this.boundingBoxToPixels(lines[i].endBoundingBox, texture.getWidth(), texture.getHeight())
        const lensStudioLinePoint = {
          startPos: startCenterPoint,
          endPos: endCenterPoint
        }
        geminiResult.lines.push(lensStudioLinePoint)
      }
    } catch (error) {
      print("Error parsing points!: " + error)
    }
    if (callback != null) {
      callback(geminiResult)
    }
  }

  private boundingBoxToPixels(boxPoints: any, width: number, height: number): vec2 {
    const x1 = MathUtils.remap(boxPoints[1], 0, 1000, 0, width)
    const y1 = MathUtils.remap(boxPoints[0], 0, 1000, height, 0) //flipped for lens studio
    const topLeft = new vec2(x1, height - y1)
    const x2 = MathUtils.remap(boxPoints[3], 0, 1000, 0, width)
    const y2 = MathUtils.remap(boxPoints[2], 0, 1000, height, 0)
    const bottomRight = new vec2(x2, height - y2)
    const center = topLeft.add(bottomRight).uniformScale(0.5)
    return center
  }
}
