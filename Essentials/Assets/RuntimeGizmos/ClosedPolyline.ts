import InteractorLineRenderer from "SpectaclesInteractionKit.lspkg/Components/Interaction/InteractorLineVisual/InteractorLineRenderer"
import {withAlpha} from "SpectaclesInteractionKit.lspkg/Utils/color"

/**
 * This class provides visual representation for a polyline that can be rendered as a continuous or split sequence of lines.
 */
@component
export class ClosedPolyline extends BaseScriptComponent {
  @input
  public points!: SceneObject[]

  @input
  private lineMaterial!: Material

  @input("vec3", "{1, 1, 0}")
  @widget(new ColorWidget())
  public _color: vec3 = new vec3(1, 1, 0)

  @input
  private lineWidth: number = 0.5

  @input
  @widget(new ComboBoxWidget().addItem("Full", 0).addItem("Split", 1).addItem("FadedEnd", 2))
  public lineStyle: number = 0

  @input
  public continuousLine: boolean = true

  private _enabled = true
  private lines: InteractorLineRenderer[] = []
  private transform!: Transform

  set isEnabled(isEnabled: boolean) {
    this._enabled = isEnabled
    this.lines.forEach((line) => {
      line.getSceneObject().enabled = isEnabled
    })
  }

  get isEnabled(): boolean {
    return this._enabled
  }

  onAwake() {
    if (!this.points || this.points.length < 2) {
      throw new Error("ClosedPolylineVisual requires at least 2 points")
    }

    this.transform = this.sceneObject.getTransform()
    this.createOrUpdateLines()
  }

  refreshLine(): void {
    if (!this.points || this.points.length < 2) {
      print("Cannot refresh line: Invalid state")
      return
    }

    // Recalculate positions and update the lines
    this.createOrUpdateLines()
  }

  private createOrUpdateLines(): void {
    // Clear existing lines
    this.lines.forEach((line) => line.destroy())
    this.lines = []

    const positions = this.points.map((point) => point.getTransform().getLocalPosition())
    if (this.continuousLine) {
      // Render as a single closed line
      positions.push(positions[0])
      const line = new InteractorLineRenderer({
        material: this.lineMaterial,
        points: positions,
        startColor: withAlpha(this._color, 1),
        endColor: withAlpha(this._color, 1),
        startWidth: this.lineWidth,
        endWidth: this.lineWidth
      })
      line.getSceneObject().setParent(this.sceneObject)
      line.visualStyle = this.lineStyle
      this.lines.push(line)
    } else {
      // Render as separate lines between each pair of points
      for (let i = 0; i < positions.length; i++) {
        const startIndex = i
        const endIndex = (i + 1) % positions.length
        const line = new InteractorLineRenderer({
          material: this.lineMaterial,
          points: [positions[startIndex], positions[endIndex]],
          startColor: withAlpha(this._color, 1),
          endColor: withAlpha(this._color, 1),
          startWidth: this.lineWidth,
          endWidth: this.lineWidth
        })
        line.getSceneObject().setParent(this.sceneObject)
        line.visualStyle = this.lineStyle
        this.lines.push(line)
      }
    }

    this.isEnabled = this._enabled
  }

  onDestroy(): void {
    this.lines.forEach((line) => line.destroy())
    this.sceneObject.destroy()
  }

  getPoints(): SceneObject[] {
    return this.points || []
  }

  setColor(color: vec3): void {
    this._color = color
    this.lines.forEach((line) => {
      const colorWithAlpha = withAlpha(color, 1)
      line.startColor = colorWithAlpha
      line.endColor = colorWithAlpha
    })
  }

  setPoints(newPoints: SceneObject[]): void {
    if (newPoints.length < 2) {
      print("Error: At least 2 points are required")
      return
    }
    this.points = newPoints
    this.refreshLine()
  }
}
