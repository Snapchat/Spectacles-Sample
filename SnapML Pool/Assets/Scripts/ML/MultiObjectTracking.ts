import {OneEuroFilterVec3} from "SpectaclesInteractionKit.lspkg/Utils/OneEuroFilter"

export type IDScore = {
  id: number
  score: number
  trackletIndex: number
}

export class Tracklet {
  classIds: IDScore[]
  position: vec3
  filter: OneEuroFilterVec3
  classCache: number[] = []
  lastSeen: number = 0
  private readonly MIN_CUTOFF = 0.05 // Lowered from 0.1 to filter still objects more
  private readonly BETA = 0.3 // Increased from 0.1 to be more responsive to movement
  private readonly DCUTOFF = 2.0 // Increased from 1.0 to better track fast movements
  private readonly FREQUENCY = 30.0 // Sampling frequency

  private createFilter(): OneEuroFilterVec3 {
    return new OneEuroFilterVec3({
      minCutoff: this.MIN_CUTOFF,
      beta: this.BETA,
      dcutoff: this.DCUTOFF,
      frequency: this.FREQUENCY
    })
  }

  maxClassId(id: number, cacheSize: number): number {
    this.classCache.push(id)

    if (this.classCache.length > cacheSize) {
      this.classCache.shift()
    }

    const ids = {}
    let maxCount = 0
    let maxClassId = 0
    for (let i = 0; i < this.classCache.length; i++) {
      const id = this.classCache[i]
      const newCount = (ids[id] || 0) + 1
      ids[id] = newCount
      if (newCount > maxCount) {
        maxCount = newCount
        maxClassId = id
      }
    }

    return maxClassId
  }

  constructor(position: vec3, classIds: IDScore[], timestamp: number) {
    this.classIds = classIds
    this.filter = this.createFilter()
    this.position = this.filter.filter(position, timestamp)
    this.classCache = []
    this.lastSeen = timestamp
  }
}

export class Prediction {
  position: vec3
  classIds: IDScore[]
  id: number

  constructor(position: vec3, classIds: IDScore[], id: number = 0) {
    this.position = position
    this.classIds = classIds
    this.id = id
  }
}

export class MultiObjectTracking {
  private trackedTracklets: Tracklet[] = []
  private untrackedTracklets: Tracklet[] = []
  private MAX_DISTANCE = 0.5 // Maximum distance to consider a match
  private CACHE_SIZE = 10
  private MAX_COUNTS: number[] = []
  private MAX_TRACKLETS: number = 50
  private MAX_LOST_TIME = 0.25
  private MERGE_DISTANCE = 0.5

  constructor(
    maxCounts: number[],
    maxDistance: number = 0.5,
    mergeDistance: number = 0.5,
    maxTracklets: number = 50,
    maxLostTime: number = 0.25
  ) {
    this.MAX_DISTANCE = maxDistance
    this.MAX_COUNTS = maxCounts
    this.MAX_TRACKLETS = maxTracklets
    this.MAX_LOST_TIME = maxLostTime
    this.MERGE_DISTANCE = mergeDistance
  }

  onAwake() {}

  mergePredictions(predictions: Prediction[]): Prediction[] {
    // Merge predictions that are close to each other
    const mergedPredictions: Prediction[] = []
    const mergedIndices = new Set<number>()

    for (let i = 0; i < predictions.length; i++) {
      if (mergedIndices.has(i)) continue

      const currentPred = predictions[i]
      let mergedClassIds = [...currentPred.classIds]

      // Check other predictions for merging
      for (let j = i + 1; j < predictions.length; j++) {
        if (mergedIndices.has(j)) continue

        const otherPred = predictions[j]
        const distance = currentPred.position.distance(otherPred.position)

        if (distance < this.MERGE_DISTANCE) {
          // Merge classIds, keeping them ordered by score
          mergedClassIds = [...mergedClassIds, ...otherPred.classIds]
          mergedIndices.add(j)
        }
      }

      // Sort merged classIds by score
      mergedClassIds.sort((a, b) => b.score - a.score)
      mergedPredictions.push(new Prediction(currentPred.position, mergedClassIds))
      mergedIndices.add(i)
    }

    return mergedPredictions
  }

  trackDetections(predictions: Prediction[], timestamp: number): Prediction[] {
    predictions = this.mergePredictions(predictions)

    // Update existing tracklets with predictions
    const matchedPredictions = new Set<number>()
    const matchedTracklets = new Set<number>()

    // First pass: Try to match existing tracklets with predictions
    for (let i = 0; i < this.trackedTracklets.length; i++) {
      const tracklet = this.trackedTracklets[i]
      let bestMatch = -1
      let bestDistance = this.MAX_DISTANCE

      // Find closest prediction
      for (let j = 0; j < predictions.length; j++) {
        if (matchedPredictions.has(j)) continue

        const prediction = predictions[j]
        const distance = tracklet.position.distance(prediction.position)

        if (distance < bestDistance) {
          bestDistance = distance
          bestMatch = j
        }
      }

      // Update tracklet if we found a match
      if (bestMatch !== -1) {
        const prediction = predictions[bestMatch]
        // Update position using OneEuroFilter
        tracklet.position = tracklet.filter.filter(prediction.position, timestamp)
        tracklet.classIds = prediction.classIds
        tracklet.lastSeen = timestamp
        matchedPredictions.add(bestMatch)
        matchedTracklets.add(i)
      }
    }

    // Create new tracklets for unmatched predictions
    for (let i = 0; i < predictions.length; i++) {
      if (!matchedPredictions.has(i)) {
        const prediction = predictions[i]
        this.trackedTracklets.push(new Tracklet(prediction.position, prediction.classIds, timestamp))
      }
    }

    // Move unmatched tracklets to untracked list
    const stillTracked: Tracklet[] = []
    const scoreArray: IDScore[] = []

    for (let i = 0; i < this.trackedTracklets.length; i++) {
      const trackletIsNew = this.trackedTracklets[i].lastSeen == timestamp
      if (!matchedTracklets.has(i) && !trackletIsNew) {
        this.untrackedTracklets.push(this.trackedTracklets[i])
      } else {
        const tracklet = this.trackedTracklets[i]
        for (let j = 0; j < tracklet.classIds.length; j++) {
          const id = tracklet.classIds[j].id
          const score = tracklet.classIds[j].score
          scoreArray.push({id: id, score: score, trackletIndex: stillTracked.length})
        }
        stillTracked.push(tracklet)
      }
    }

    this.trackedTracklets = stillTracked

    // Sort scoreArray by score
    scoreArray.sort((a, b) => b.score - a.score)

    const classCounts: number[] = new Array(this.MAX_COUNTS.length).fill(0)
    const usedTrackletIndices = new Set<number>()
    const finalPredictions: Prediction[] = []

    for (let i = 0; i < scoreArray.length; i++) {
      const id = scoreArray[i].id
      const score = scoreArray[i].score
      const trackletIndex = scoreArray[i].trackletIndex

      if (classCounts[id] < this.MAX_COUNTS[id] && !usedTrackletIndices.has(trackletIndex)) {
        classCounts[id]++
        usedTrackletIndices.add(trackletIndex)
        const tracklet = this.trackedTracklets[trackletIndex]
        const maxId = tracklet.maxClassId(id, this.CACHE_SIZE)
        finalPredictions.push(new Prediction(tracklet.position, [], maxId))

        if (finalPredictions.length >= this.MAX_TRACKLETS) {
          break
        }
      }
    }

    // Clean up old untracked tracklets
    this.untrackedTracklets = this.untrackedTracklets.filter((tracklet) => {
      // Check if tracklet is too old
      if (timestamp - tracklet.lastSeen >= this.MAX_LOST_TIME) {
        return false
      }

      // Check if tracklet is too close to any tracked tracklet
      for (const tracked of this.trackedTracklets) {
        if (tracklet.position.distance(tracked.position) < this.MAX_DISTANCE) {
          return false
        }
      }

      return true
    })

    // Convert remaining tracklets that haven't been used
    for (let i = 0; i < this.trackedTracklets.length + this.untrackedTracklets.length; i++) {
      if (finalPredictions.length >= this.MAX_TRACKLETS) {
        break
      }

      if (!usedTrackletIndices.has(i)) {
        const tracklet =
          i < this.trackedTracklets.length
            ? this.trackedTracklets[i]
            : this.untrackedTracklets[i - this.trackedTracklets.length]

        const minCount = Math.min(...classCounts)
        const id = classCounts.indexOf(minCount)
        classCounts[id]++
        const maxId = tracklet.maxClassId(id, this.CACHE_SIZE)
        finalPredictions.push(new Prediction(tracklet.position, [], maxId))
      }
    }

    return finalPredictions
  }
}
