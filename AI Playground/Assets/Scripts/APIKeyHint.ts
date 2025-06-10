import {
  AvaliableApiTypes,
  RemoteServiceGatewayCredentials,
} from "Remote Service Gateway.lspkg/RemoteServiceGatewayCredentials";

@component
export class APIKeyHint extends BaseScriptComponent {
  @input text: Text;
  onAwake() {
    let apiKey = RemoteServiceGatewayCredentials.getApiToken(
      AvaliableApiTypes.Snap3D
    );
    if (apiKey === "[PUT YOUR KEY HERE]" || apiKey === "") {
      this.text.text =
        "Set your API Token in the Remote Service Gateway Credentials component to use the examples";
    } else {
      this.text.enabled = false;
    }
  }
}
