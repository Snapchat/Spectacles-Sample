/**
 * Class representing a detection.
 */
export class Detection {
  bbox: [number, number, number, number];
  score: number;
  index: number;
  label: string;

  /**
   * @param {[number, number, number, number]} bbox - bbox coordinates in screen space
   * @param {number} score - detection score
   * @param {number} index - class index
   * @param {string} [label] - class label
   */
  constructor(bbox: [number, number, number, number], score: number, index: number, label?: string) {
    this.bbox = bbox;
    this.score = score;
    this.index = index;
    this.label = label === undefined ? "class_" + index : label;
  }

  /**
   * @returns {string}
   */
  toString(): string {
    return `Class: ${this.label} Score: ${this.score.toFixed(5)} Bounding Box: ${this.bbox}`;
  }

  /**
   * @returns {Rect}
   */
  getScreenRect(): Rect {
    // bbox - x, y, w, h
    const x = this.bbox[0] * 2.0 - 1.0;
    const y = 1.0 - 2 * this.bbox[1];
    // bbox is in screen space, rect is in local space 
    return Rect.create(
      x - this.bbox[2],
      x + this.bbox[2],
      y - this.bbox[3],
      y + this.bbox[3]
    );
  }

  /**
   * @returns {vec2}
   */
  getScreenPos(): vec2 {
    // bbox - x, y, w, h
    return new vec2(this.bbox[0], this.bbox[1]);
  }
}

export class DetectionHelpers {
  // NmsIou.ts
  // Version: 0.0.1
  // Event: OnAwake
  // Description: Implements non-maximum suppression and intersection over union algorithms.

  /**
   * Non-maximum suppression algorithm.
   * @param {number[][]} boxes 
   * @param {{ cls: number, score: number }[]} scores 
   * @param {number} scoreThresh 
   * @param {number} iouThresh 
   * @returns {Detection[]}
   */
  static nms(
    boxes: number[][],
    scores: { cls: number; score: number }[],
    scoreThresh: number,
    iouThresh: number
  ): Detection[] {
    let result: Detection[] = [];
    let candidates: Detection[] = [];

    for (let i = 0; i < boxes.length; i++) {
      if (scores[i].score > scoreThresh) {
        candidates.push(new Detection(
          boxes[i] as [number, number, number, number],
          scores[i].score,
          scores[i].cls
        ));
      }
    }

    candidates.sort(DetectionHelpers.compareByScoreReversed);

    while (candidates.length > 0) {
      const currentBox = candidates.shift()!;
      result.push(currentBox);

      candidates = candidates.filter(item => {
        if (currentBox.index === item.index) {
          const IOU = DetectionHelpers.iou(currentBox.bbox, item.bbox);
          return IOU < iouThresh;
        }
        return true;
      });
    }

    return result;
  }

  /**
   * Computes the intersection over union of two boxes.
   * @param {number[]} box1 
   * @param {number[]} box2 
   * @returns {number}
   */
  static iou(box1: number[], box2: number[]): number {
    const xi1 = Math.max(box1[0] - box1[2] / 2, box2[0] - box2[2] / 2);
    const yi1 = Math.max(box1[1] - box1[3] / 2, box2[1] - box2[3] / 2);

    const xi2 = Math.min(box1[0] + box1[2] / 2, box2[0] + box2[2] / 2);
    const yi2 = Math.min(box1[1] + box1[3] / 2, box2[1] + box2[3] / 2);

    const iarea = Math.max(xi2 - xi1, 0) * Math.max(yi2 - yi1, 0);
    const b1area = box1[2] * box1[3];
    const b2area = box2[2] * box2[3];
    const uarea = b1area + b2area - iarea;

    return iarea / uarea;
  }

  /**
   * Compares two detections by score in descending order.
   * @param {Detection} a 
   * @param {Detection} b 
   * @returns {number}
   */
  static compareByScoreReversed(a: Detection, b: Detection): number {
    return b.score - a.score;
  }

  static compareByHeightReversed(a: Detection, b: Detection): number {
    return b.bbox[3] - a.bbox[3];
  }

  onAwake() { }
}
