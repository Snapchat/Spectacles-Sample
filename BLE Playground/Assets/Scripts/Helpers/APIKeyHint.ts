import {
    AvaliableApiTypes,
    RemoteServiceGatewayCredentials,
  } from "RemoteServiceGateway.lspkg/RemoteServiceGatewayCredentials";
  
  @component
  export class APIKeyHint extends BaseScriptComponent {
    @input text: Text;
  
    private static readonly PLACEHOLDER_MESSAGES = {
      [AvaliableApiTypes.Snap]: "[INSERT SNAP TOKEN HERE]",
      [AvaliableApiTypes.OpenAI]: "[INSERT OPENAI TOKEN HERE]",
      [AvaliableApiTypes.Google]: "[INSERT GOOGLE TOKEN HERE]",
    };
  
    private static readonly HINT_MESSAGE = "Set your API Token in the Remote Service Gateway Credentials component to use the examples";
  
    onAwake() {
      const apiTypes = [
        AvaliableApiTypes.Snap,
        AvaliableApiTypes.OpenAI,
        AvaliableApiTypes.Google,
      ];
  
      const hasInvalidApiKey = apiTypes.some(apiType => {
        const apiKey = RemoteServiceGatewayCredentials.getApiToken(apiType);
        const placeholder = APIKeyHint.PLACEHOLDER_MESSAGES[apiType];
        return apiKey === placeholder || apiKey === "";
      });
  
      if (hasInvalidApiKey) {
        this.text.text = APIKeyHint.HINT_MESSAGE;
      } else {
        this.text.enabled = false;
      }
    }
  }
  
  
  