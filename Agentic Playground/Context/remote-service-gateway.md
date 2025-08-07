# Remote Service Gateway

## Overview

Spectacles offers a set of APIs that can be used alongside user-sensitive data — like the camera frame, location, and audio. By default, access to sensitive data is disabled when a Lens uses internet-connected components unless certain Experimental APIs are enabled to allow a Lens to access both sensitive data and the internet at the same time through a feature called Extended Permissions. Lenses using Extended Permissions cannot be be published.

The Remote Service Gateway allows Experimental Lenses with access to user-sensitive data to both access the internet and be published but only when they use the Remote Service Gateway to call to Supported Services (listed below).

## Supported Services

### OpenAI

- **Chat Completions** - Generate conversational AI responses using GPT models
- **Image Generation** - Create images from text descriptions
- **Create Speech** - Convert text to natural-sounding speech audio
- **Realtime** - Real-time conversational AI with voice capabilities

### Gemini

- **Model** - Access Google's Gemini large language models for multimodal generations
- **Live** - Real-time conversation AI interactions with voice and video capabilities

### DeepSeek

- **Chat Completions with Deepseek-R1 Reasoning** - Advanced AI chat with step-by-step reasoning capabilities

### Snap3D

- **Text to 3D** - Generate 3D models (GLB) and assets from text descriptions and images. See the examples and API reference for details.

## Getting Started

### Prerequisites

- Lens Studio v5.10.1 or later
- Spectacles OS v5.062 or later
- The APIs are only available on Spectacles.

### Setup Instructions

#### Remote Service Gateway Token Generator

All of the Remote Service Gateway APIs require an API token, which can be generated using the Lens Studio Token Generator. The Remote Service Gateway Token Generator plugin is available in the Asset Library under the Spectacles section. After installing the plugin, open the token generator from the Lens Studio Main Menu **Windows** -> **Remote Service Gateway Token**. Use the **Generate Token** button to create a token. The generated token can be copied and used for API access.

This token has no expiration date, is tied to the Snapchat account, and can be used across multiple projects and computers. When generating a token on different computers, if a token is already generated on another computer with the same Snapchat account login to My Lenses, the generator will display the existing token instead of creating a new one.

The token can be revoked through the Lens Studio Main Menu **Windows** -> **Remote Service Gateway Token** using the **Revoke Token** button if new token is have to be generated.

> **Warning:** Revoking a token will invalidate Remote Service Gateway API usage for all existing lenses that use the token. This action cannot be undone.

> **Note:** Although this a public API token, it is unique to your account and should be treated as confidential. Do not include this token when sharing your project with others or committing code to version control systems.

#### Remote Service Gateway Package

The Asset Library under the Spectacles section contains the Remote Service Gateway package which includes RemoteServiceModule, helper scripts and examples for quick setup and use of the APIs. You need to manually enter the token to RemoteServiceGatewayCredentials component for initial setup.

## Examples

> **Note:** Assumes that you have already installed the Remote Service Gateway package from the Asset Library. For more detailed examples, refer to the example prefab included in the Remote Service Gateway package available in the Asset Library or the AI Playground available in the Lens Studio Homepage Sample Project section.

### OpenAI Example

This example demonstrates how to integrate OpenAI's chat completion API into Spectacles Lenses, allowing developers to send prompts with system instructions and user questions to GPT models.

#### TypeScript

```typescript
import { OpenAI } from 'Remote Service Gateway.lspkg/HostedExternal/OpenAI';

@component
export class OpenAIExample extends BaseScriptComponent {
  onAwake() {
    this.createEvent('OnStartEvent').bind(() => {
      this.doChatCompletions();
    });
  }

  doChatCompletions() {
    OpenAI.chatCompletions({
      model: 'gpt-4.1-nano',
      messages: [
        {
          role: 'system',
          content:
            "You are an incredibly smart but witty AI assistant who likes to answers life's greatest mysteries in under two sentences",
        },
        {
          role: 'user',
          content: 'Is a hotdog a sandwich?',
        },
      ],
      temperature: 0.7,
    })
      .then((response) => {
        print(response.choices[0].message.content);
      })
      .catch((error) => {
        print('Error: ' + error);
      });
  }
}
```

#### JavaScript

```javascript
const OpenAI = require('Remote Service Gateway.lspkg/HostedExternal/OpenAI').OpenAI;

script.createEvent('OnStartEvent').bind(() => {
  doChatCompletions();
});

function doChatCompletions() {
  OpenAI.chatCompletions({
    model: 'gpt-4.1-nano',
    messages: [
      {
        role: 'system',
        content:
          "You are an incredibly smart but witty AI assistant who likes to answers life's greatest mysteries in under two sentences",
      },
      {
        role: 'user',
        content: 'Is a hotdog a sandwich?',
      },
    ],
    temperature: 0.7,
  })
    .then((response) => {
      print(response.choices[0].message.content);
    })
    .catch((error) => {
      print('Error: ' + error);
    });
}
```

### Gemini Example

This example demonstrates how to integrate Gemini's Model API into Spectacles Lenses, allowing developers to send prompts with system instructions and user questions.

#### TypeScript

```typescript
import { Gemini } from 'Remote Service Gateway.lspkg/HostedExternal/Gemini';
import { GeminiTypes } from 'Remote Service Gateway.lspkg/HostedExternal/GeminiTypes';

@component
export class GeminiExample extends BaseScriptComponent {
  onAwake() {
    this.createEvent('OnStartEvent').bind(() => {
      this.textToTextExample();
    });
  }

  textToTextExample() {
    let request: GeminiTypes.Models.GenerateContentRequest = {
      model: 'gemini-2.0-flash',
      type: 'generateContent',
      body: {
        contents: [
          {
            parts: [
              {
                text: "You are an incredibly smart but witty AI assistant who likes to answers life's greatest mysteries in under two sentences",
              },
            ],
            role: 'model',
          },
          {
            parts: [
              {
                text: 'Is a hotdog a sandwich?',
              },
            ],
            role: 'user',
          },
        ],
      },
    };

    Gemini.models(request)
      .then((response) => {
        print(response.candidates[0].content.parts[0].text);
      })
      .catch((error) => {
        print('Error: ' + error);
      });
  }
}
```

#### JavaScript

```javascript
const Gemini = require('Remote Service Gateway.lspkg/HostedExternal/Gemini').Gemini;

script.createEvent('OnStartEvent').bind(() => {
  textToTextExample();
});

function textToTextExample() {
  let request = {
    model: 'gemini-2.0-flash',
    type: 'generateContent',
    body: {
      contents: [
        {
          parts: [
            {
              text: "You are an incredibly smart but witty AI assistant who likes to answers life's greatest mysteries in under two sentences",
            },
          ],
          role: 'model',
        },
        {
          parts: [
            {
              text: 'Is a hotdog a sandwich?',
            },
          ],
          role: 'user',
        },
      ],
    },
  };

  Gemini.models(request)
    .then((response) => {
      print(response.candidates[0].content.parts[0].text);
    })
    .catch((error) => {
      print('Error: ' + error);
    });
}
```

### DeepSeek Example

This example demonstrates how to integrate DeepSeek's R1 Reasoning API into Spectacles Lenses, allowing developers to send prompts with system instructions and user questions.

> **Note:** Please be aware that DeepSeek's chat completions processing may require significant time to complete. Allow for extended response times when testing this functionality.

#### TypeScript

```typescript
import { DeepSeek } from 'Remote Service Gateway.lspkg/HostedSnap/Deepseek';
import { DeepSeekTypes } from 'Remote Service Gateway.lspkg/HostedSnap/DeepSeekTypes';

@component
export class DeepSeekExample extends BaseScriptComponent {
  onAwake() {
    this.createEvent('OnStartEvent').bind(() => {
      this.doChatCompletions();
    });
  }

  doChatCompletions() {
    let messageArray: Array<DeepSeekTypes.ChatCompletions.Message> = [
      {
        role: 'system',
        content:
          "You are an incredibly smart but witty AI assistant who likes to answers life's greatest mysteries in under two sentences",
      },
      {
        role: 'user',
        content: 'Is a hotdog a sandwich?',
      },
    ];

    const deepSeekRequest: DeepSeekTypes.ChatCompletions.Request = {
      model: 'DeepSeek-R1',
      messages: messageArray,
      max_tokens: 2048,
      temperature: 0.7,
    };

    DeepSeek.chatCompletions(deepSeekRequest)
      .then((response) => {
        let reasoningContent = response?.choices[0]?.message?.reasoning_content;
        let messageContent = response?.choices[0]?.message?.content;
        print('Reasoning: ' + reasoningContent);
        print('Final answer: ' + messageContent);
      })
      .catch((error) => {
        print('Error: ' + error);
      });
  }
}
```

#### JavaScript

```javascript
const DeepSeek = require('Remote Service Gateway.lspkg/HostedSnap/Deepseek').DeepSeek;

script.createEvent('OnStartEvent').bind(() => {
  doChatCompletions();
});

function doChatCompletions() {
  let messageArray = [
    {
      role: 'system',
      content:
        "You are an incredibly smart but witty AI assistant who likes to answers life's greatest mysteries in under two sentences",
    },
    {
      role: 'user',
      content: 'Is a hotdog a sandwich?',
    },
  ];

  const deepSeekRequest = {
    model: 'DeepSeek-R1',
    messages: messageArray,
    max_tokens: 2048,
    temperature: 0.7,
  };

  DeepSeek.chatCompletions(deepSeekRequest)
    .then((response) => {
      let reasoningContent = response.choices[0].message.reasoning_content;
      let messageContent = response.choices[0].message.content;
      print('Reasoning: ' + reasoningContent);
      print('Final answer: ' + messageContent);
    })
    .catch((error) => {
      print('Error: ' + error);
    });
}
```

### Snap3D Example

This example demonstrates how to integrate Snap3D into Spectacles Lenses, allowing you to generate text to 2D to 3D assets.

> **Note:** Please be aware that Snap3D processing may require significant time to complete. Allow for extended response times when testing this functionality.

> **Warning:** The Snap3D example code shown here is for illustrative purposes only and will not execute as presented. Please refer to the complete example in the Remote Service Gateway package for functional implementation details.

#### TypeScript

```typescript
import { Snap3D } from 'Remote Service Gateway.lspkg/HostedSnap/Snap3D';
import { Snap3DTypes } from 'Remote Service Gateway.lspkg/HostedSnap/Snap3DTypes';

@component
export class DeepSeekExample extends BaseScriptComponent {
  onAwake() {
    this.createEvent('OnStartEvent').bind(() => {
      this.do3DGeneration();
    });
  }

  do3DGeneration() {
    Snap3D.submitAndGetStatus({
      prompt: 'A cute cartoony hotdog character',
      format: 'glb',
      refine: true,
      use_vertex_color: false,
    })
      .then((submitGetStatusResults) => {
        submitGetStatusResults.event.add(([value, assetOrError]) => {
          if (value === 'image') {
            let imageAsset = assetOrError as Snap3DTypes.TextureAssetData;
            //Apply imageAsset.texture;
          } else if (value === 'base_mesh') {
            let gltfAsset = assetOrError as Snap3DTypes.GltfAssetData;
            //Apply gltfAsset.gltf;
          } else if (value === 'refined_mesh') {
            let gltfAsset = assetOrError as Snap3DTypes.GltfAssetData;
            //Apply gltfAsset.gltf;
          } else if (value === 'failed') {
            let error = assetOrError as {
              errorMsg: string;
              errorCode: number;
            };
            print('Error: ' + error.errorMsg);
          }
        });
      })
      .catch((error) => {
        print('Error: ' + error);
      });
  }
}
```

#### JavaScript

```javascript
const Snap3D = require('Remote Service Gateway.lspkg/HostedSnap/Snap3D').Snap3D;

script.createEvent('OnStartEvent').bind(() => {
  do3DGeneration();
});

function do3DGeneration() {
  Snap3D.submitAndGetStatus({
    prompt: 'A cute cartoony hotdog character',
    format: 'glb',
    refine: true,
    use_vertex_color: false,
  })
    .then((submitGetStatusResults) => {
      submitGetStatusResults.event.add(([value, assetOrError]) => {
        if (value === 'image') {
          let imageAsset = assetOrError;
          //Apply imageAsset.texture;
        } else if (value === 'base_mesh') {
          let gltfAsset = assetOrError;
          //Apply gltfAsset.gltf;
        } else if (value === 'refined_mesh') {
          let gltfAsset = assetOrError;
          //Apply gltfAsset.gltf;
        } else if (value === 'failed') {
          let error = assetOrError;
          print('Error: ' + error.errorMsg);
        }
      });
    })
    .catch((error) => {
      print('Error: ' + error);
    });
}
```

## API Reference

### Snap3D API

The Snap3D API provides endpoints for generating 3D meshes from text prompts or images. The process involves submitting a generation task and then polling for completion status.

#### Submit Generation Task

**POST /submit**

Submits a task to generate a 3D mesh from a text prompt or image input. This is an asynchronous endpoint that returns a task ID for status polling.

##### Request Body (JSON)

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `prompt` | string | No | None | Text prompt describing the desired 3D object (e.g., "a blue frog") |
| `image_b64` | string | No | None | Base64-encoded image input used for mesh generation |
| `seed` | int | No | -1 | Random seed for result reproducibility |
| `format` | AssetFormat | Yes | — | Output format: "glb" for 3D mesh, "png" for image |
| `refine` | bool | No | true | Whether to run mesh refinement after initial generation |
| `use_case` | string | Yes | — | Arbitrary string to tag the use case (e.g., "easylens") |
| `run_ald` | bool | No | true | Whether to apply ALD (advanced latent diffusion) on the prompt |
| `run_prompt_augmentation` | bool | No | true | Whether to augment the prompt for improved generation |
| `use_vertex_color` | bool | No | false | If true, uses vertex color instead of UV mapping for texturing |

##### Response

| Field | Type | Description |
|-------|------|-------------|
| `success` | bool | Indicates whether the task was successfully submitted |
| `task_id` | string | Unique ID for tracking and retrieving the result of the task |

#### Check Generation Status

**GET /get_status**

Retrieves the current status and results of a previously submitted generation task.

##### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `task_id` | string | Yes | Task ID obtained from successful submission |

##### Response

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `status` | Status | Yes | Current status of the generation task |
| `stage` | Stage | No | Latest (or current) execution stage |
| `error_msg` | string | No | Error message if status is failed |
| `error_code` | int | No | Error code if status is failed |
| `artifacts` | Artifact[] | No | Array of generated artifacts (URLs and metadata) |

#### Data Types

##### AssetFormat

| Value | Description |
|-------|-------------|
| `glb` | Outputs a 3D mesh in GLB format |
| `png` | References a generated driving image |

##### Status

| Value | Description |
|-------|-------------|
| `initialized` | Task created but not yet running |
| `running` | Currently executing the corresponding stage |
| `completed` | All requested stages have been completed |
| `failed` | Generation failed |

##### Stage

| Value | Description |
|-------|-------------|
| `image_gen` | Stage 1: Image generation |
| `base_mesh_gen` | Stage 2: Base mesh generation |
| `refined_mesh_gen` | Stage 3: Mesh refinement |

##### Artifact

| Attribute | Type | Description |
|-----------|------|-------------|
| `url` | string | Pre-signed URL of generated artifact |
| `artifact_type` | ArtifactType | Type of generated asset |
| `format` | string | File format (e.g., GLB, PNG) |

##### ArtifactType

| Value | Description |
|-------|-------------|
| `image` | Stage 1: Original generated image |
| `base_mesh` | Stage 2: Generated base mesh |
| `refined_mesh` | Stage 3: Generated refined mesh |

## Known Limitations

- The `chat_completions` endpoint does not support streaming.
- For the Gemini LiveAPI only `models/gemini-2.0-flash-live-preview-04-09` is supported. 