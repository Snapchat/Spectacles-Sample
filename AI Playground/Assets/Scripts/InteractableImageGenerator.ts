import { ImageGenerator } from "./ImageGenerator";
import { ASRQueryController } from "./ASRQueryController";

@component
export class InteractableImageGenerator extends BaseScriptComponent {
  @ui.separator
  @ui.label("Example of using generative image APIs")
  @input
  @widget(
    new ComboBoxWidget([
      new ComboBoxItem("OpenAI", "OpenAI"),
      new ComboBoxItem("Gemini", "Gemini"),
    ])
  )
  private modelProvider: string = "OpenAI";
  @ui.separator
  @input
  private image: Image;
  @input
  private textDisplay: Text;
  @input
  private asrQueryController: ASRQueryController;
  @input
  private spinner: SceneObject;
  private imageGenerator: ImageGenerator = null;

  onAwake() {
    this.imageGenerator = new ImageGenerator(this.modelProvider);
    let imgMat = this.image.mainMaterial.clone();
    this.image.clearMaterials();
    this.image.mainMaterial = imgMat;
    this.createEvent("OnStartEvent").bind(() => {
      this.spinner.enabled = false;
      this.asrQueryController.onQueryEvent.add((query) => {
        this.createImage(query);
      });
    });
  }

  createImage(prompt: string) {
    this.spinner.enabled = true;
    this.textDisplay.text = "Generating: " + prompt;
    this.imageGenerator
      .generateImage(prompt)
      .then((image) => {
        print("Image generated successfully: " + image);
        this.textDisplay.text = prompt;
        this.image.mainMaterial.mainPass.baseTex = image;
        this.textDisplay.text = prompt;
        this.spinner.enabled = false;
      })
      .catch((error) => {
        print("Error generating image: " + error);
        this.textDisplay.text = "Error: " + error;
        this.spinner.enabled = false;
      });
  }
}
