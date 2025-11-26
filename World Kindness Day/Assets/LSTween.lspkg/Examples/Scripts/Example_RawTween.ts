import Easing from "../../TweenJS/Easing";
import { LSTween } from "../../LSTween";

@component
export class Example_RawTween extends BaseScriptComponent {
  onAwake() {
    LSTween.rawTween(1000)
      .easing(Easing.Cubic.In)
      .onStart((o) => {
        print("Start Value: " + o.t);
      })
      .onUpdate((o) => {
        print("Update Value: " + o.t);
      })
      .onComplete((o) => {
        print("Complete Value: " + o.t);
      })
      .start();
  }
}
