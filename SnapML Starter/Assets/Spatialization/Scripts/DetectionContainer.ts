import { Billboard } from "SpectaclesInteractionKit.lspkg/Components/Interaction/Billboard/Billboard";
import { ClosedPolyline } from "./ClosedPolyline";

@component
export class DetectionContainer extends BaseScriptComponent {

    @input
    categoryAndConfidence: Text;

    @input
    distanceFromCamera: Text;

    @input
    polyline: ClosedPolyline;

    @input
    public polylinePoints: SceneObject[]
}