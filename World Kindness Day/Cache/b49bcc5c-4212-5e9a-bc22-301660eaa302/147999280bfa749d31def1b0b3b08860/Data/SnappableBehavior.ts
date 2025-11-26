import {Interactable} from "../../../../Components/Interaction/Interactable/Interactable"
import {InteractableManipulation} from "../../../../Components/Interaction/InteractableManipulation/InteractableManipulation"
import {InteractorEvent} from "../../../../Core/Interactor/InteractorEvent"
import TrackedHand from "../../../../Providers/HandInputData/TrackedHand"
import animate, {CancelSet, mix} from "../../../../Utils/animate"
import Event, {unsubscribe} from "../../../../Utils/Event"
import {setTimeout} from "../../../../Utils/FunctionTimingUtils"
import NativeLogger from "../../../../Utils/NativeLogger"

import {InteractorInputType} from "../../../../Core/Interactor/Interactor"
import {HandInputData} from "../../../../Providers/HandInputData/HandInputData"
import {validate} from "../../../../Utils/validate"
import {ContainerFrame} from "../ContainerFrame"

const TAG = "SnappableBehavior"
const log = new NativeLogger(TAG)

export type SnappableOptions = {
  frame: ContainerFrame
  worldSnapping: boolean
  itemSnapping: boolean
}

// A variable for 'up' (but not exactly up) We can't have it be exactly up because when
// we do a cross to get our angles and our raycast result points straiught up we cross two
// vectors that are the same and it won't give us a sane result
const NOT_QUITE_UP = new vec3(0.0000001, 0.9999999, 0.0000001).normalize()

/*
 * Class for the snapping behavior of quickview items
 * Specifically implemented for 2D content... so far!
 *
 */

export class SnappableBehavior {
  stickyZoneSize: number = 1
  gutterSize: number = 4
  ghostMaterial: Material = requireAsset("../Materials/Ghost Material.mat") as Material
  snappableDebugDraw: boolean = false
  private frame: ContainerFrame = this.options.frame
  private frameTransform: Transform | undefined = this.frame.getFrameObject()?.getTransform()

  private content: SceneObject | null = this.frame.getTargetObject()
  private parent: SceneObject | null = this.content?.getParent() ?? null
  private parentTransform: Transform | null = this.parent?.getTransform() ?? null
  private parentParent: SceneObject | null = this.parent ? this.parent.getParent() : null
  private contentTransform: Transform | null = this.content?.getTransform() ?? null
  private contentPosition: vec3 | null = this.contentTransform?.getWorldPosition() ?? null
  private scale: vec3 | null = this.contentTransform?.getWorldScale() ?? null

  private frameSceneObject: SceneObject | null = this.frame?.getFrameObject() ?? null

  private interactable: Interactable | null = this.frame?.getInteractable() ?? null
  private manipulate: InteractableManipulation | null = this.frame?.getInteractableManipulation() ?? null

  private animationCancelSet = new CancelSet()

  private aspectRatio: number = 1
  private isAspectRatioSet: boolean = false
  private ghostParentaName: string

  get getAspectRatio(): number {
    return this.aspectRatio
  }

  private ghost: SceneObject = global.scene.createSceneObject("Ghost")
  private ghostTransform: Transform = this.ghost.getTransform()
  private ghostImageComponent: Image = this.ghost.createComponent("Image")

  private itemSnapping = this.options.itemSnapping

  private boundingBox: SceneObject = global.scene.createSceneObject("boundingBox")
  private boundingBoxTransform: Transform = this.boundingBox.getTransform()
  private useConstantBoundingBoxPadding: boolean = true

  private snapTo: SceneObject | null = null
  private snapPosition: vec3 = vec3.zero()
  private colliderTransform: Transform | null = null
  private colliderPosition: vec3 = vec3.zero()
  private colliderRotation: quat = quat.quatIdentity()
  private colliderScale: vec3 | null = vec3.zero()
  private colliderAspectRatio: number = 1

  private itemSnappingRange: boolean = false
  private worldSnappingRange: boolean = false
  isTweening: boolean = false
  isActive: boolean = false
  isEnabled: boolean = true
  private isScaling: boolean = false
  private wasScaling: boolean = false

  private scalingDebouncer: ReturnType<typeof setTimeout> | null = null

  private quatId: quat = quat.quatIdentity()

  private lastEvent: InteractorEvent | null = null
  private tryingSnap: boolean = false

  private onSnappingComplete = new Event()
  snappingComplete = () => this.onSnappingComplete.publicApi()

  private unSubscribeList: unsubscribe[] = []

  private handInputData = HandInputData.getInstance()
  private rightHand: TrackedHand = this.handInputData.getHand("right")
  private leftHand: TrackedHand = this.handInputData.getHand("left")

  private worldQueryAsset: WorldQueryModule | null = null
  private hitTestSession: HitTestSession | null = null
  private useWorldQuery: boolean = false

  private queryBuffer: {
    distance: number
    hitPosition: vec3
    hitNormal: vec3
  }[] = []
  private queryBufferMaxLength: number = 20
  private lastIndexTipPosition: vec3 = vec3.zero()
  private lastIndexForward: vec3 = vec3.forward()
  private missedCount: number = 0
  private hitTestSessionStarted: boolean = false
  private worldQueryTweenCancel: CancelSet = new CancelSet()

  constructor(private options: SnappableOptions) {
    validate(this.parent)
    validate(this.interactable)
    validate(this.content)
    validate(this.frame.renderOrder)

    if (options.worldSnapping) {
      this.enableWorldSnapping(true)
    }

    this.unSubscribeList.push(this.interactable.onTriggerStart.add(this.onTriggerStart))
    this.unSubscribeList.push(this.interactable.onTriggerEnd.add(this.onTriggerRelease))
    this.unSubscribeList.push(this.interactable.onTriggerEndOutside.add(this.onTriggerRelease))
    this.unSubscribeList.push(this.interactable.onTriggerCanceled.add(this.onTriggerRelease))

    const contentLocalScale = new vec3(
      this.frame.innerSize.x + this.frame.constantPadding.x + this.frame.border * 2,
      this.frame.innerSize.y + this.frame.constantPadding.y + this.frame.border * 2,
      1
    )

    this.ghost.enabled = false
    this.ghost.setParent(this.parent)
    this.ghostParentaName = this.parent.name
    this.ghostTransform = this.ghost.getTransform()
    this.ghostTransform.setLocalScale(contentLocalScale)

    this.ghostImageComponent.stretchMode = StretchMode.Stretch
    this.ghostImageComponent.mainMaterial = this.ghostMaterial.clone()
    const ghostAlpha = 0.33
    this.ghostImageComponent.mainMaterial.mainPass.baseColor.a = ghostAlpha
    this.ghostImageComponent.mainPass.depthTest = true
    this.ghostImageComponent.mainPass.depthWrite = true
    this.ghostImageComponent.setRenderOrder(this.frame.renderOrder)
    this.boundingBox.setParent(this.content)
    this.boundingBox.layer = LayerSet.fromNumber(4)

    const boundingBoxFilter: Filter = Physics.Filter.create() as Filter
    boundingBoxFilter.onlyLayers = this.boundingBox.layer

    const boundingBoxCollider: ColliderComponent = this.boundingBox.createComponent("ColliderComponent")
    const boxShape: BoxShape = Shape.createBoxShape()
    if (!this.useConstantBoundingBoxPadding) {
      // maximumDepthForBoundingBox
      const maxBoxDepth = 40
      // amplifier for boxDepth
      const boxDepthScalar = 0.4
      // amplifier for shapeSize
      const shapeScalar = 1.34
      const frameWorldScale = new vec2(
        this.frame.innerSize.x + this.frame.constantPadding.x + this.frame.border,
        this.frame.innerSize.y + this.frame.constantPadding.y + this.frame.border
      )
      const boxSize = Math.max(frameWorldScale.x, frameWorldScale.y)
      const boxDepth = Math.max(Math.min(Math.max(boxSize, maxBoxDepth)), 1)

      this.boundingBoxTransform.setWorldScale(new vec3(frameWorldScale.x, frameWorldScale.y, boxDepth * boxDepthScalar))
      boxShape.size = vec3.one().uniformScale(shapeScalar)
    } else {
      boxShape.size = vec3.one()
    }
    boundingBoxCollider.shape = boxShape
    boundingBoxCollider.filter = boundingBoxFilter as Filter
    boundingBoxCollider.overlapFilter = boundingBoxFilter as Filter
    boundingBoxCollider.debugDrawEnabled = this.snappableDebugDraw

    const onOverlapEnterEvent = boundingBoxCollider.onOverlapEnter.add(this.checkItemOverlaps)
    const onOverlapStayEvent = boundingBoxCollider.onOverlapStay.add(this.checkItemOverlaps)
    const onOverlapExitEvent = boundingBoxCollider.onOverlapExit.add(this.onOverlapExit)

    this.unSubscribeList.push(() => {
      if (!isNull(boundingBoxCollider) && !isNull(onOverlapEnterEvent)) {
        boundingBoxCollider.onOverlapEnter.remove(onOverlapEnterEvent)
      }
    })
    this.unSubscribeList.push(() => {
      if (!isNull(boundingBoxCollider) && !isNull(onOverlapStayEvent)) {
        boundingBoxCollider.onOverlapStay.remove(onOverlapStayEvent)
      }
    })
    this.unSubscribeList.push(() => {
      if (!isNull(boundingBoxCollider) && !isNull(onOverlapExitEvent)) {
        boundingBoxCollider.onOverlapExit.remove(onOverlapExitEvent)
      }
    })

    if (this.useConstantBoundingBoxPadding) {
      this.unSubscribeList.push(this.frame.onScalingUpdateEvent.add(this.scaleConstantBoundingBox))
      this.scaleConstantBoundingBox()
    }
    this.unSubscribeList.push(this.frame.onScalingUpdateEvent.add(this.setAspectRatio))
    this.setAspectRatio()
  }

  enableWorldSnapping = (enable: boolean) => {
    if (enable) {
      if (this.worldQueryAsset === null) {
        // eslint-disable-next-line
        this.worldQueryAsset = require("LensStudio:WorldQueryModule") as WorldQueryModule

        const sessionOptions = HitTestSessionOptions.create()
        sessionOptions.filter = true
        this.hitTestSession = this.worldQueryAsset.createHitTestSessionWithOptions(sessionOptions)

        // turn off until used
        this.hitTestSession.stop()
      }
    }
    this.useWorldQuery = enable
  }

  enableItemSnapping = (enable: boolean) => {
    this.itemSnapping = enable
  }

  destroy(): void {
    log.d("destroy")
    this.abortTweening()
    this.abortSnapping()
    this.unSubscribeList.forEach((sub) => {
      sub()
    })
    this.unSubscribeList = []
  }

  private scaleConstantBoundingBox = () => {
    // the padding of the constant size added to the bounding box
    const frameWorldScale = new vec2(
      this.frame.innerSize.x + this.frame.constantPadding.x + this.frame.border,
      this.frame.innerSize.y + this.frame.constantPadding.y + this.frame.border
    )
    const boxPadding = 10
    const boxDepth = Math.max(Math.min((Math.max(frameWorldScale.x, frameWorldScale.y), 40)), 1)
    this.boundingBoxTransform.setWorldScale(
      new vec3(frameWorldScale.x + boxPadding, frameWorldScale.y + boxPadding, boxDepth)
    )
  }

  private setActive = (val: boolean) => {
    this.isActive = val
  }

  private setTweening = (val: boolean) => {
    this.isTweening = val
  }

  setScaling = (val: boolean) => {
    this.isScaling = val
  }

  private deParent = () => {
    if (this.parent?.getParent() !== this.parentParent) {
      this.parent?.setParentPreserveWorldTransform(this.parentParent!)
    }

    if (!isNull(this.ghost) && this.ghost.getParent() !== this.parent && this.parent !== null) {
      this.ghost.setParentPreserveWorldTransform(this.parent)
      this.ghostParentaName = this.parent.name
    }
  }

  private abortTweening = () => {
    this.animationCancelSet.cancel()
    this.deParent()
    this.setTweening(false)
  }

  private setAspectRatio = () => {
    if (isNull(this.ghost)) {
      log.e(`ERROR: ghost is null - parent: ${this.ghostParentaName}`)
      return
    }
    if (isNull(this.ghostImageComponent)) {
      log.e(`ERROR: ghostImageComponent is null - parent: ${this.ghostParentaName}`)
      return
    }
    if (isNull(this.ghostTransform)) {
      log.e(`ERROR: ghostTransform is null - parent: ${this.ghostParentaName}`)
      return
    }

    // if not set
    const scale = new vec2(
      this.frame.innerSize.x + this.frame.constantPadding.x + this.frame.border * 2,
      this.frame.innerSize.y + this.frame.constantPadding.y + this.frame.border * 2
    )
    this.aspectRatio = scale.x / scale.y
    if (isNull(this.ghostImageComponent)) return // how is this null sometimes?

    if (this.aspectRatio > 1) {
      scale.y *= this.aspectRatio
      if (!isNull(this.ghostImageComponent)) {
        this.ghostImageComponent.mainMaterial.mainPass.boxSize = new vec2(0.5, 0.5 / this.aspectRatio)
      } else {
        log.d(`Ghost is null`)
      }
    } else {
      scale.x /= this.aspectRatio
      if (!isNull(this.ghostImageComponent)) {
        this.ghostImageComponent.mainMaterial.mainPass.boxSize = new vec2(0.5 * this.aspectRatio, 0.5)
      } else {
        log.d(`Ghost is null`)
      }
    }

    this.ghostTransform.setWorldScale(new vec3(scale.x, scale.y, 1))
  }

  abortSnapping = () => {
    this.setActive(false)
    if (!isNull(this.ghost)) {
      this.ghost.enabled = false
    }

    this.isEnabled = false
    this.itemSnappingRange = false
    this.worldSnappingRange = false
  }

  private onTriggerStart = (e: InteractorEvent) => {
    if (e.propagationPhase !== "Target") return
    if (this.isTweening) {
      this.abortTweening()
    }

    if (!this.isTweening && !this.isScaling && !this.isActive) {
      this.setAspectRatio()
      if (this.useWorldQuery) {
        this.queryBuffer = []
        this.hitTestSession?.start()
        this.hitTestSessionStarted = true
      }
      this.setActive(true)
    }

    this.wasScaling = this.isScaling
  }

  private onTriggerRelease = (e: InteractorEvent) => {
    if (e.propagationPhase !== "Target") return
    if (this.useWorldQuery && this.hitTestSessionStarted) {
      this.hitTestSession?.stop()
      this.hitTestSessionStarted = false
    }
    if (this.isActive && !this.isScaling && this.isEnabled) {
      this.setActive(false)
      if (!isNull(this.ghost)) this.ghost.enabled = false

      if (this.itemSnappingRange && !this.isTweening && this.parent?.getParent() !== this.snapTo) {
        this.setTweening(true)
        this.itemSnappingRange = false

        this.parent?.setParentPreserveWorldTransform(this.snapTo!)

        const startPosition = this.parentTransform?.getLocalPosition() || vec3.zero()
        animate({
          cancelSet: this.animationCancelSet,
          duration: 0.15,
          start: 0,
          end: 1,
          ended: this.tweenCompleted,
          update: (t) => {
            this.parentTransform?.setLocalPosition(mix(startPosition, this.snapPosition, t))
          }
        })
        const startRot: quat = this.parentTransform?.getWorldRotation() || quat.quatIdentity()
        const endRot: quat = this.snapTo!.getTransform().getWorldRotation()
        animate({
          cancelSet: this.animationCancelSet,
          duration: 0.14,
          start: 0,
          end: 1,
          update: (t) => {
            this.parentTransform?.setWorldRotation(mix(startRot, endRot, t))
          }
        })
      } else if (this.parentTransform && this.worldSnappingRange && !this.isTweening) {
        this.setTweening(true)
        this.worldSnappingRange = false

        const startPosition = this.parentTransform?.getWorldPosition()

        if (startPosition === undefined) {
          return
        }

        animate({
          cancelSet: this.animationCancelSet,
          duration: 0.15,
          start: 0,
          end: 1,
          ended: this.tweenCompleted,
          update: (t) => {
            this.parentTransform?.setWorldPosition(mix(startPosition, this.colliderPosition, t))
          }
        })
        const startRot: quat = this.parentTransform.getWorldRotation()
        const endRot: quat = this.colliderRotation
        animate({
          cancelSet: this.animationCancelSet,
          duration: 0.14,
          start: 0,
          end: 1,
          update: (t) => {
            this.parentTransform?.setWorldRotation(mix(startRot, endRot, t))
          }
        })
      }
    }
    this.wasScaling = false
  }

  private queryWorld = () => {
    validate(this.parentTransform)
    validate(this.frame.currentInteractor)
    validate(this.hitTestSession)

    const rayLength = 300
    const containerPosition = this.parentTransform.getWorldPosition()

    let indexTipPos, indexForward
    let thisHand = this.rightHand
    if (this.frame.currentInteractor.inputType === InteractorInputType.RightHand) {
      thisHand = this.rightHand
    } else if (this.frame.currentInteractor.inputType === InteractorInputType.LeftHand) {
      thisHand = this.leftHand
    }

    if (thisHand.isTracked() && thisHand.indexTip) {
      indexTipPos = thisHand.indexTip.position
      this.lastIndexTipPosition = indexTipPos
      indexForward = containerPosition.sub(indexTipPos).normalize()
      this.lastIndexForward = indexForward
    } else {
      indexTipPos = this.lastIndexTipPosition
      indexForward = this.lastIndexForward
    }

    const endPos = indexTipPos.add(indexForward.uniformScale(rayLength))

    if (this.hitTestSessionStarted) {
      this.hitTestSession.hitTest(indexTipPos, endPos, (hitResult) => {
        if (hitResult === null) {
          // log.d("No Point of Collision")
          this.missedCount += 1
          return
        } else {
          const hitPosition: vec3 = hitResult.position
          const hitNormal: vec3 = hitResult.normal

          const containerFromHit = containerPosition.distanceSquared(hitPosition)
          if (containerFromHit > 2500) {
            // more than 25 away from world mesh too far away
            this.missedCount += 1
            return
          }

          const indexDistance = indexTipPos.distance(hitPosition)
          if (hitPosition === vec3.zero()) {
            this.missedCount += 1
            return
          }
          if (indexDistance < 20) {
            // probably an error
            this.missedCount += 1
            return
          }

          this.queryBuffer.push({
            distance: indexDistance,
            hitPosition: hitPosition,
            hitNormal: hitNormal
          })

          if (this.queryBuffer.length === this.queryBufferMaxLength) {
            let sumPosition = vec3.zero()
            let sumNormal = vec3.zero()
            this.queryBuffer.forEach((queryObj, _i) => {
              sumPosition = sumPosition.add(queryObj.hitPosition)
              sumNormal = sumNormal.add(queryObj.hitNormal)
            })
            const avgPositon = sumPosition.uniformScale(1 / this.queryBuffer.length)
            const avgNormal = sumNormal.uniformScale(1 / this.queryBuffer.length)

            let toRotation: quat
            if (avgNormal.y > 0.95) {
              // log.d(`probably on the floor! or some`)
              toRotation = quat.lookAt(avgNormal, this.frame.worldCamera.getTransform().back)
            } else {
              // log.d(`probably on something else?`)
              toRotation = quat.lookAt(avgNormal, NOT_QUITE_UP)
            }

            const ghostPos = this.ghostTransform.getWorldPosition()
            const ghostRot = this.ghostTransform.getWorldRotation()

            if (this.worldQueryTweenCancel) this.worldQueryTweenCancel()
            animate({
              duration: 0.05,
              cancelSet: this.worldQueryTweenCancel,
              update: (t) => {
                this.ghostTransform.setWorldPosition(vec3.lerp(ghostPos, avgPositon, t))
                this.ghostTransform.setWorldRotation(quat.slerp(ghostRot, toRotation, t))
              }
            })

            this.colliderPosition = avgPositon
            this.colliderRotation = toRotation
            this.colliderScale = this.scale
            this.colliderAspectRatio = this.aspectRatio
            this.worldSnappingRange = true

            this.queryBuffer.shift()
            this.missedCount = 0
          } else {
            this.worldSnappingRange = false
            this.missedCount = 0
          }
        }
      })
    }

    if (this.missedCount >= 20) this.worldSnappingRange = false
  }

  private calculateItemSnapping = () => {
    validate(this.contentTransform)
    validate(this.colliderScale)

    if (!isNull(this.ghost) && this.ghost.getParent() !== this.snapTo && this.snapTo !== null) {
      this.ghost.setParentPreserveWorldTransform(this.snapTo)
      this.ghostParentaName = this.snapTo.name
    }

    this.contentPosition = this.contentTransform.getWorldPosition().sub(this.colliderPosition)

    this.scale = this.contentTransform.getWorldScale()

    this.contentPosition = this.colliderRotation.multiplyVec3(this.contentPosition)

    const snapToScalar = this.snapTo!.getTransform().getWorldScale()

    // assuming height of 1
    const halfThisImageScale = {
      x: (this.frame.innerSize.x * 0.5 + this.frame.constantPadding.x * 0.5 + this.frame.border) / snapToScalar.x,
      y: (this.frame.innerSize.y * 0.5 + this.frame.constantPadding.y * 0.5 + this.frame.border) / snapToScalar.y
    }

    const halfColliderImageScale = {
      x: (this.colliderScale.x * 0.5) / snapToScalar.x,
      y: (this.colliderScale.y * 0.5) / snapToScalar.y
    }

    let xOffset: number = 0
    let yOffset: number = 0

    if (Math.abs(this.contentPosition.x) >= Math.abs(this.contentPosition.y)) {
      // snap to left or right
      xOffset = halfColliderImageScale.x + halfThisImageScale.x + this.gutterSize / snapToScalar.x
      if (this.contentPosition.x > 0) {
        this.snapPosition.x = xOffset
      } else {
        this.snapPosition.x = -xOffset
      }

      if (Math.abs(this.contentPosition.y) < this.stickyZoneSize) {
        // in sticky center
        this.snapPosition.y = 0
      } else if (
        Math.abs(this.contentPosition.y + halfThisImageScale.y - halfColliderImageScale.y) < this.stickyZoneSize
      ) {
        // at top
        this.snapPosition.y = halfColliderImageScale.y - halfThisImageScale.y
      } else if (
        Math.abs(this.contentPosition.y - halfThisImageScale.y + halfColliderImageScale.y) < this.stickyZoneSize
      ) {
        // at bottom
        this.snapPosition.y = -halfColliderImageScale.y + halfThisImageScale.y
      } else {
        // sliding
        this.snapPosition.y = this.contentPosition.y
      }

      this.snapPosition.y /= snapToScalar.y
    } else {
      // snap to top or bottom
      yOffset = halfColliderImageScale.y + halfThisImageScale.y + this.gutterSize / snapToScalar.y

      if (this.contentPosition.y > 0) {
        this.snapPosition.y = yOffset
      } else {
        this.snapPosition.y = -yOffset
      }

      if (Math.abs(this.contentPosition.x) < this.stickyZoneSize) {
        // in sticky center
        this.snapPosition.x = 0
      } else if (
        Math.abs(this.contentPosition.x + halfThisImageScale.x - halfColliderImageScale.x) < this.stickyZoneSize
      ) {
        // at right
        this.snapPosition.x = halfColliderImageScale.x - halfThisImageScale.x
      } else if (
        Math.abs(this.contentPosition.x - halfThisImageScale.x + halfColliderImageScale.x) < this.stickyZoneSize
      ) {
        // at left
        this.snapPosition.x = -halfColliderImageScale.x + halfThisImageScale.x
      } else {
        // sliding
        this.snapPosition.x = this.contentPosition.x
      }

      this.snapPosition.x /= snapToScalar.x
    }

    this.snapPosition.z = 0

    // scale snap positioning for local space w/in the collider
    // this.snapPosition = this.snapPosition.div(this.colliderScale)

    // ghost temporarily parented to snapTo object
    if (!isNull(this.ghostTransform)) {
      this.ghostTransform.setLocalRotation(this.quatId)
      this.ghostTransform.setLocalPosition(this.snapPosition)
    }
    if (!isNull(this.ghost) && !this.ghost.enabled) this.ghost.enabled = true
  }

  update = () => {
    validate(this.content)
    if (this.isActive && !this.isScaling && this.isEnabled && !this.frame.isFollowing) {
      if (this.itemSnappingRange) {
        this.calculateItemSnapping()
      } else if (this.useWorldQuery) {
        this.queryWorld()
      } else if (!this.worldSnappingRange) {
        // if not in snapping range
        if (!this.isTweening && !isNull(this.content) && this.content.getParent() !== this.parent) {
          this.deParent()
        }
        if (!isNull(this.ghost) && this.ghost.enabled) this.ghost.enabled = false
      }
      // confirm ghost
      if (this.worldSnappingRange) {
        if (!isNull(this.ghost) && !this.ghost.enabled) this.ghost.enabled = true
      }
    } else {
      if (!isNull(this.ghost) && this.ghost.enabled) this.ghost.enabled = false
      if (!this.isTweening && !isNull(this.content) && this.content.getParent() !== this.parent) {
        this.deParent()
      }
    }
    if (this.tryingSnap) {
      if (this.lastEvent) this.onTriggerRelease(this.lastEvent)
      this.tryingSnap = false
      this.lastEvent = null
    }

    if (!this.worldSnappingRange && !this.itemSnappingRange) {
      validate(this.frame.parentTransform)
      if (!isNull(this.ghost) && this.ghost.enabled) this.ghost.enabled = false
      if (!isNull(this.ghost) && !isNull(this.ghostTransform)) {
        this.ghostTransform.setWorldPosition(this.frame.parentTransform.getWorldPosition())
        this.ghostTransform.setWorldRotation(this.frame.parentTransform.getWorldRotation())
      }
    }
  }

  private checkItemOverlaps = (e: any) => {
    this.lastEvent = e
    if (
      this.isActive &&
      !this.isScaling &&
      !this.isTweening &&
      !this.frame.isFollowing &&
      this.itemSnapping &&
      this.isEnabled
    ) {
      let lastDistance = Infinity
      for (let i = 0; i < e.currentOverlaps.length; i++) {
        const overlap = e.currentOverlaps[i]
        const colliderObject: SceneObject = overlap.collider.getSceneObject().getParent().getParent()
        // getParent of boundingBox

        const colliderFrameComponent = colliderObject.getComponent(ContainerFrame.getTypeName())

        validate(this.contentTransform)

        if (isNull(colliderFrameComponent)) {
          continue
        }
        if (colliderFrameComponent!.isSnappingActive() || colliderFrameComponent!.isSnappingTweening()) {
          continue
        }
        if (colliderObject === this.parent) {
          continue
        }
        this.colliderTransform = colliderObject.getTransform()
        const thisColliderPosition: vec3 = this.colliderTransform.getWorldPosition()
        const thisDistance = thisColliderPosition.distanceSquared(this.contentTransform.getWorldPosition())
        if (thisDistance < lastDistance) {
          this.snapTo = overlap.collider.getSceneObject().getParent()

          this.colliderPosition = thisColliderPosition

          this.colliderScale = new vec3(
            colliderFrameComponent!.innerSize.x +
              colliderFrameComponent!.constantPadding.x +
              colliderFrameComponent!.border * 2,
            colliderFrameComponent!.innerSize.y +
              colliderFrameComponent!.constantPadding.y +
              colliderFrameComponent!.border * 2,
            1
          )

          this.colliderAspectRatio = this.colliderScale.y / this.colliderScale.x

          this.colliderRotation = this.colliderTransform!.getWorldRotation()
          this.colliderRotation.x *= -1
          this.colliderRotation.y *= -1
          this.colliderRotation.z *= -1

          this.itemSnappingRange = true
          lastDistance = thisDistance
        }
      }
    }
  }

  tryToSnap = () => {
    this.setActive(true)
    this.tryingSnap = true
    if (this.lastEvent) {
      this.checkItemOverlaps(this.lastEvent)
    }
  }

  private tweenCompleted = () => {
    // deparent when tween complete
    this.deParent()
    this.setTweening(false)
    this.onSnappingComplete.invoke()
  }

  private onOverlapExit = (e: any) => {
    if (e.currentOverlaps.length === 0) {
      if (!isNull(this.ghost)) this.ghost.enabled = false
      this.itemSnappingRange = false
    }
  }
}
