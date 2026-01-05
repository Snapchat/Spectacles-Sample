export interface BasePathData {
  startPosition: vec3
  startRotation: quat
  startObject: SceneObject
  splinePoints: {position: vec3; rotation: quat}[]
  readonly isLoop: boolean
}

export interface LoopedPathData extends BasePathData {
  readonly isLoop: true
}

export interface SprintPathData extends BasePathData {
  readonly isLoop: false
  finishPosition: vec3
  finishRotation: quat
  finishObject: SceneObject
}

export type PathData = LoopedPathData | SprintPathData
