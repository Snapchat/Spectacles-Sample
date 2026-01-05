import {CameraService} from "../CameraService"
import {PoolTablePredictor} from "../PoolTablePredictor"
import {DetectionController} from "./DetectionController"
import {DetectionHelpers} from "./DetectionHelpers"

type GridEntry = [number, number]

@component
export class MLController extends BaseScriptComponent {
  @input() cameraService: CameraService
  @input() poolTablePredictor: PoolTablePredictor
  @input() model: MLAsset
  @input() modelInfo: boolean

  @input()
  @widget(new SliderWidget(0, 1, 0.01))
  scoreThreshold: number = 0.33

  @input()
  @widget(new SliderWidget(0, 1, 0.01))
  iouThreshold: number = 0.5

  private grids: GridEntry[][][] = []
  private boxes: [number, number, number, number][] = []
  private scores: {cls: number; score: number}[] = []
  private inputShape: vec3
  private mlComponent: MLComponent
  private outputs: OutputPlaceholder[]
  private inputs: InputPlaceholder[]
  private isRunning: boolean = false

  @input()
  detectionController: DetectionController

  // These are the labels 0 is cue ball, 16 is pockets, the rest are the balls
  private classSettings: {label: string; enabled: boolean}[] = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16"
  ].map((label) => ({label: label, enabled: true}))

  private classCount: number = this.classSettings.length

  private anchors: number[][][] = [
    [
      [144, 300],
      [304, 220],
      [288, 584]
    ],
    [
      [568, 440],
      [768, 972],
      [1836, 1604]
    ],
    [
      [48, 64],
      [76, 144],
      [160, 112]
    ]
  ]

  private strides: number[] = [16, 32, 8]

  private currentFrame: number = 0

  private runTimeStamp: number = 0
  onAwake() {
    this.classCount = this.classSettings.length
  }

  /**
   * create ml component
   */
  public init() {
    if (!this.model) {
      print("Error, please set ML Model asset input")
      return
    }

    this.cameraService.saveMatrix()

    this.mlComponent = this.getSceneObject().createComponent("MLComponent")
    this.mlComponent.model = this.model
    this.mlComponent.onLoadingFinished = this.onLoadingFinished.bind(this)
    this.mlComponent.inferenceMode = MachineLearning.InferenceMode.Accelerator
    this.mlComponent.build([])
  }

  /**
   * configures inputs and outputs, starts running ml component
   */
  private onLoadingFinished() {
    this.outputs = this.mlComponent.getOutputs()
    this.inputs = this.mlComponent.getInputs()

    this.printInfo("Model built")

    // build grids
    for (let i = 0; i < this.outputs.length; i++) {
      const shape = this.outputs[i].shape
      this.grids.push(this.makeGrid(shape.x, shape.y))
    }
    this.inputShape = this.inputs[0].shape
    this.inputs[0].texture = this.cameraService.screenCropTexture
    // run on update
    //this.mlComponent.runScheduled(true, MachineLearning.FrameTiming.Update, MachineLearning.FrameTiming.Update);

    this.mlComponent.onRunningFinished = this.onRunningFinished.bind(this)

    // process outputs on script update (after ml update)
    this.cameraService.frameCallback = this.onUpdate.bind(this)
  }

  /**
   *
   * @param nx
   * @param ny
   * @returns
   */
  private makeGrid(nx: number, ny: number): GridEntry[][] {
    const grids: GridEntry[][] = []
    for (let dy = 0; dy < ny; dy++) {
      const grid: GridEntry[] = []
      for (let dx = 0; dx < nx; dx++) {
        grid.push([dx, dy])
      }
      grids.push(grid)
    }
    return grids
  }

  /**
   * process outputs on each update
   */
  private onUpdate(runTimeStamp: number) {
    const frameSkip = this.poolTablePredictor.tableAligned ? 0 : 5
    if (!this.isRunning) this.currentFrame++
    if (this.currentFrame >= frameSkip && !this.isRunning) {
      this.currentFrame = 0
      this.isRunning = true

      this.runTimeStamp = runTimeStamp
      const runImmediate = this.cameraService.isEditor || global.scene.isRecording()
      if (runImmediate) {
        this.cameraService.saveMatrix()
      } else {
        this.cameraService.saveMatrixWithPose(this.cameraService.estimateCameraPose(this.runTimeStamp))
      }

      if (this.cameraService.isEditor) {
        const delay = this.createEvent("DelayedCallbackEvent")
        delay.bind(() => {
          this.mlComponent.runImmediate(runImmediate)
        })
        delay.reset(0.01)
      } else {
        this.mlComponent.runImmediate(runImmediate)
        print(runImmediate)
      }
    }
  }

  private onRunningFinished() {
    this.parseYolo7Outputs(this.outputs)

    const result = DetectionHelpers.nms(this.boxes, this.scores, this.scoreThreshold, this.iouThreshold).sort(
      DetectionHelpers.compareByScoreReversed
    )

    for (let i = 0; i < result.length; i++) {
      if (this.classSettings.length > result[i].index && this.classSettings[result[i].index].label) {
        result[i].label = this.classSettings[result[i].index].label
      }
    }

    const detectionsEnabled = this.detectionController.getSceneObject().getParent().enabled
    this.detectionController.debugImage.getSceneObject().enabled = detectionsEnabled
    if (detectionsEnabled) {
      this.detectionController.onUpdate(result)
    }

    this.poolTablePredictor.updateDetections(result)

    this.isRunning = false
  }

  /**
   * @param msg
   */
  private printInfo(msg: string) {
    if (this.modelInfo) {
      print(msg)
    }
  }

  /**
   *
   * @param outputs
   * @returns
   */
  private parseYolo7Outputs(outputs: OutputPlaceholder[]): [number[][], {cls: number; score: number}[]] {
    this.boxes = []
    this.scores = []
    const num_heads = outputs.length
    for (let i = 0; i < num_heads; i++) {
      const output = outputs[i]
      const data = output.data
      const shape = output.shape
      const nx = shape.x
      const ny = shape.y
      const step = this.classCount + 4 + 1

      // [nx, ny, 255] -> [nx, ny, n_anchors(3), n_outputs(classCount + 4 + 1)]
      for (let dy = 0; dy < ny; dy++) {
        for (let dx = 0; dx < nx; dx++) {
          for (let da = 0; da < this.anchors.length; da++) {
            const idx = dy * nx * this.anchors.length * step + dx * this.anchors.length * step + da * step
            // 0-1: xy, 2-3: wh, 4: conf, 5-5+classCount: scores
            let x = data[idx]
            let y = data[idx + 1]
            let w = data[idx + 2]
            let h = data[idx + 3]
            const conf = data[idx + 4]

            if (conf > this.scoreThreshold) {
              x = (x * 2 - 0.5 + this.grids[i][dy][dx][0]) * this.strides[i]
              y = (y * 2 - 0.5 + this.grids[i][dy][dx][1]) * this.strides[i]
              w = w * w * this.anchors[i][da][0]
              h = h * h * this.anchors[i][da][1]

              const res = {cls: 0, score: 0}
              const box = [x / this.inputShape.x, y / this.inputShape.y, w / this.inputShape.y, h / this.inputShape.y]
              for (let nc = 0; nc < this.classCount; nc++) {
                if (!this.classSettings[nc].enabled) {
                  continue
                }
                const class_score = data[idx + 5 + nc] * conf
                if (class_score > this.scoreThreshold && class_score > res.score) {
                  res.cls = nc
                  res.score = class_score
                }
              }
              if (res.score > 0) {
                this.boxes.push(box as [number, number, number, number])
                this.scores.push(res)
              }
            }
          }
        }
      }
    }
    return [this.boxes, this.scores]
  }

  /**
   * returns a number of classes that model detects
   * @returns
   */
  private getClassCount(): number {
    return this.classCount
  }

  private getClassLabel(index: number): string {
    return this.classSettings[index].label ? this.classSettings[index].label : "class_" + index
  }

  private setClassEnabled(index: number, value: boolean) {
    this.classSettings[index].enabled = value
  }

  private getClassEnabled(index: number): boolean {
    return this.classSettings[index].enabled
  }
}
