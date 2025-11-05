import { GrabbableObject } from "./GrabbableObject"
import { SIK } from "SpectaclesInteractionKit.lspkg/SIK"
import TrackedHand from "SpectaclesInteractionKit.lspkg/Providers/HandInputData/TrackedHand"

/**
 * Manages pinch-to-grab interactions for objects with GrabbableObject components.
 * Uses collider overlap detection on finger tips.
 * Attach this to an empty object in the scene.
 */
@component
export class GestureManager extends BaseScriptComponent {
    @input
    @hint("Left hand tracking asset")
    leftHandTrackingAsset: HandTracking3DAsset
    
    @input
    @hint("Right hand tracking asset")
    rightHandTrackingAsset: HandTracking3DAsset
    
    @input
    @hint("Detection radius around finger tips (in cm)")
    detectionRadius: number = 1.5
    
    @input
    @hint("Minimum pinch strength to maintain grab (0-1)")
    minPinchStrength: number = 0.3
    
    @input
    @hint("Optional: Prefab for debug spheres on left hand (index and thumb) - control visibility via mesh renderer in prefab")
    debugLeftHandPrefab: ObjectPrefab
    
    @input
    @hint("Optional: Prefab for debug spheres on right hand (index and thumb) - control visibility via mesh renderer in prefab")
    debugRightHandPrefab: ObjectPrefab
    
    private gestureModule = require('LensStudio:GestureModule') as GestureModule
    
    // Track grab state for each hand
    private leftHandGrabbedObject: GrabbableObject | null = null
    private rightHandGrabbedObject: GrabbableObject | null = null
    
    // Track pinch state
    private leftPinchActive: boolean = false
    private rightPinchActive: boolean = false
    
    // Track grab state
    private leftGrabActive: boolean = false
    private rightGrabActive: boolean = false
    
    // Hand tracking objects
    private leftHand: TrackedHand | null = null
    private rightHand: TrackedHand | null = null
    
    // Finger tip collider objects
    private leftIndexTipCollider: SceneObject | null = null
    private rightIndexTipCollider: SceneObject | null = null
    private leftThumbTipCollider: SceneObject | null = null
    private rightThumbTipCollider: SceneObject | null = null
    
    // Track overlapping objects per hand
    private leftHandOverlappingObjects: Set<GrabbableObject> = new Set()
    private rightHandOverlappingObjects: Set<GrabbableObject> = new Set()
    
    // Debug sphere instances
    private leftIndexDebugSphere: SceneObject | null = null
    private leftThumbDebugSphere: SceneObject | null = null
    private rightIndexDebugSphere: SceneObject | null = null
    private rightThumbDebugSphere: SceneObject | null = null
    
    onAwake() {
        // Set up hand tracking first
        this.setupHandTracking()
        
        // Create finger tip colliders with object tracking
        this.createFingerTipColliders()
        
        // Set up gesture events for both hands
        this.setupGestureEvents(GestureModule.HandType.Left)
        this.setupGestureEvents(GestureModule.HandType.Right)
        
        // Update event to check pinch strength
        this.createEvent("UpdateEvent").bind(this.onUpdate.bind(this))
        
        // Diagnostic: List all grabbable objects in the scene after a delay
        const diagnosticEvent = this.createEvent("DelayedCallbackEvent")
        diagnosticEvent.bind(() => {
            this.diagnosticCheckGrabbableObjects()
        })
        diagnosticEvent.reset(2.0) // Wait 2 seconds for everything to initialize
    }
    
    /**
     * Diagnostic function to check all objects with GrabbableObject components
     */
    private diagnosticCheckGrabbableObjects() {
        print("=== GestureManager Diagnostic Check ===")
        
        // Find all objects in the scene
        const allObjects = global.scene.getRootObjectsCount()
        let grabbableCount = 0
        
        for (let i = 0; i < allObjects; i++) {
            const obj = global.scene.getRootObject(i)
            this.checkObjectAndChildren(obj, (foundObj) => {
                const grabbable = this.findGrabbableObjectComponent(foundObj)
                if (grabbable) {
                    grabbableCount++
                    const collider = foundObj.getComponent("Physics.ColliderComponent") as ColliderComponent
                    const body = foundObj.getComponent("Physics.BodyComponent") as BodyComponent
                    
                    print(`  Found GrabbableObject: ${foundObj.name}`)
                    if (collider) {
                        print(`    ✓ Has ColliderComponent (intangible: ${collider.intangible})`)
                    } else if (body) {
                        print(`    ✓ Has BodyComponent (dynamic: ${body.dynamic})`)
                    } else {
                        print(`    ✗ NO COLLIDER OR BODY COMPONENT!`)
                    }
                }
            })
        }
        
        print(`=== Total GrabbableObjects found: ${grabbableCount} ===`)
    }
    
    /**
     * Recursively check an object and all its children
     */
    private checkObjectAndChildren(obj: SceneObject, callback: (obj: SceneObject) => void) {
        callback(obj)
        const childCount = obj.getChildrenCount()
        for (let i = 0; i < childCount; i++) {
            this.checkObjectAndChildren(obj.getChild(i), callback)
        }
    }
    
    private setupHandTracking() {
        // Try to get hand tracking objects
        try {
            this.leftHand = SIK.HandInputData.getHand("left")
            this.rightHand = SIK.HandInputData.getHand("right")
            print("GestureManager: Hand tracking initialized successfully")
        } catch (e) {
            print("GestureManager: Could not access hand tracking data. Make sure Hand Tracking is enabled in the scene.")
        }
    }
    
    /**
     * Create small sphere colliders on finger tips for overlap detection
     */
    private createFingerTipColliders() {
        // Create colliders for left hand
        if (this.leftHandTrackingAsset) {
            this.leftIndexTipCollider = this.createFingerTipCollider(
                this.leftHandTrackingAsset,
                "index-3",
                "LeftIndexTip",
                true
            )
            this.leftThumbTipCollider = this.createFingerTipCollider(
                this.leftHandTrackingAsset,
                "thumb-3",
                "LeftThumbTip",
                true
            )
            
            // Create debug spheres for left hand (if prefab provided)
            if (this.debugLeftHandPrefab) {
                this.leftIndexDebugSphere = this.debugLeftHandPrefab.instantiate(null)
                this.leftIndexDebugSphere.enabled = true
                this.leftIndexDebugSphere.name = "DebugLeftIndex"
                
                // Remove any colliders from debug sphere to prevent interference
                const leftIndexCollider = this.leftIndexDebugSphere.getComponent("Physics.ColliderComponent")
                if (leftIndexCollider) {
                    leftIndexCollider.destroy()
                }
                
                this.leftThumbDebugSphere = this.debugLeftHandPrefab.instantiate(null)
                this.leftThumbDebugSphere.enabled = true
                this.leftThumbDebugSphere.name = "DebugLeftThumb"
                
                // Remove any colliders from debug sphere to prevent interference
                const leftThumbCollider = this.leftThumbDebugSphere.getComponent("Physics.ColliderComponent")
                if (leftThumbCollider) {
                    leftThumbCollider.destroy()
                }
                
                print("GestureManager: Created left hand debug spheres")
            }
        }
        
        // Create colliders for right hand
        if (this.rightHandTrackingAsset) {
            this.rightIndexTipCollider = this.createFingerTipCollider(
                this.rightHandTrackingAsset,
                "index-3",
                "RightIndexTip",
                false
            )
            this.rightThumbTipCollider = this.createFingerTipCollider(
                this.rightHandTrackingAsset,
                "thumb-3",
                "RightThumbTip",
                false
            )
            
            // Create debug spheres for right hand (if prefab provided)
            if (this.debugRightHandPrefab) {
                this.rightIndexDebugSphere = this.debugRightHandPrefab.instantiate(null)
                this.rightIndexDebugSphere.enabled = true
                this.rightIndexDebugSphere.name = "DebugRightIndex"
                
                // Remove any colliders from debug sphere to prevent interference
                const rightIndexCollider = this.rightIndexDebugSphere.getComponent("Physics.ColliderComponent")
                if (rightIndexCollider) {
                    rightIndexCollider.destroy()
                }
                
                this.rightThumbDebugSphere = this.debugRightHandPrefab.instantiate(null)
                this.rightThumbDebugSphere.enabled = true
                this.rightThumbDebugSphere.name = "DebugRightThumb"
                
                // Remove any colliders from debug sphere to prevent interference
                const rightThumbCollider = this.rightThumbDebugSphere.getComponent("Physics.ColliderComponent")
                if (rightThumbCollider) {
                    rightThumbCollider.destroy()
                }
                
                print("GestureManager: Created right hand debug spheres")
            }
        }
    }
    
    /**
     * Create a single finger tip collider (position will be updated manually)
     */
    private createFingerTipCollider(
        handAsset: HandTracking3DAsset,
        attachmentPoint: string,
        name: string,
        isLeftHand: boolean
    ): SceneObject {
        // Create scene object for the collider
        const fingerObj = global.scene.createSceneObject(name)
        
        // NOTE: Not using ObjectTracking3D - we'll update position manually in onUpdate
        // This ensures colliders are at the exact same position as hand.indexTip.position
        
        // Add a small sphere collider
        const collider = fingerObj.createComponent("Physics.ColliderComponent") as ColliderComponent
        const shape = Shape.createSphereShape()
        shape.radius = this.detectionRadius
        collider.shape = shape
        collider.intangible = true // Don't affect physics, only detect overlaps
        
        // IMPORTANT: Configure overlap filter to detect non-intangible objects
        collider.overlapFilter.includeStatic = true
        collider.overlapFilter.includeDynamic = true
        collider.overlapFilter.includeIntangible = false // Only detect solid objects
        
        // Set up overlap events
        collider.onOverlapEnter.add((e: OverlapEnterEventArgs) => {
            this.onFingerOverlapEnter(e, isLeftHand)
        })
        
        collider.onOverlapExit.add((e: OverlapExitEventArgs) => {
            this.onFingerOverlapExit(e, isLeftHand)
        })
        
        print(`GestureManager: Created ${name} collider (radius: ${this.detectionRadius})`)
        return fingerObj
    }
    
    /**
     * Called when a finger tip collider enters an overlap
     */
    private onFingerOverlapEnter(e: OverlapEnterEventArgs, isLeftHand: boolean) {
        const overlappedObject = e.overlap.collider.getSceneObject()
        const handName = isLeftHand ? "Left" : "Right"
        
        print(`GestureManager: ${handName} hand finger detected overlap with ${overlappedObject.name}`)
        
        // Check if this object has a GrabbableObject component
        const grabbable = this.findGrabbableObjectComponent(overlappedObject)
        
        if (grabbable) {
            // Add to the set of overlapping objects for this hand
            if (isLeftHand) {
                this.leftHandOverlappingObjects.add(grabbable)
                print(`GestureManager: ✓ ${handName} hand added GRABBABLE object: ${overlappedObject.name}`)
            } else {
                this.rightHandOverlappingObjects.add(grabbable)
                print(`GestureManager: ✓ ${handName} hand added GRABBABLE object: ${overlappedObject.name}`)
            }
        } else {
            print(`GestureManager: ✗ ${overlappedObject.name} does not have GrabbableObject component`)
        }
    }
    
    /**
     * Called when a finger tip collider exits an overlap
     */
    private onFingerOverlapExit(e: OverlapExitEventArgs, isLeftHand: boolean) {
        const overlappedObject = e.overlap.collider.getSceneObject()
        
        // Check if this object has a GrabbableObject component
        const grabbable = this.findGrabbableObjectComponent(overlappedObject)
        
        if (grabbable) {
            // Remove from the set of overlapping objects for this hand
            if (isLeftHand) {
                this.leftHandOverlappingObjects.delete(grabbable)
            } else {
                this.rightHandOverlappingObjects.delete(grabbable)
            }
        }
    }
    
    /**
     * Find GrabbableObject component on a scene object
     */
    private findGrabbableObjectComponent(sceneObject: SceneObject): GrabbableObject | null {
        const allComponents = sceneObject.getComponents("Component.ScriptComponent")
        for (let i = 0; i < allComponents.length; i++) {
            const comp = allComponents[i]
            // Check if this is a GrabbableObject by checking if it has the required methods
            if (comp && typeof (comp as any).onGrab === 'function' && 
                typeof (comp as any).onRelease === 'function') {
                return comp as GrabbableObject
            }
        }
        return null
    }
    
    private setupGestureEvents(handType: GestureModule.HandType) {
        const handName = handType === GestureModule.HandType.Left ? "Left" : "Right"
        
        // Pinch down event (for Darts)
        this.gestureModule
            .getPinchDownEvent(handType)
            .add((args: PinchDownArgs) => {
                print(`${handName} Hand Pinch Down`)
                this.onPinchDown(handType)
            })
        
        // Pinch up event
        this.gestureModule
            .getPinchUpEvent(handType)
            .add((args: PinchUpArgs) => {
                print(`${handName} Hand Pinch Up`)
                this.onPinchUp(handType)
            })
        
        // Grab begin event (for Ball and Racket)
        this.gestureModule
            .getGrabBeginEvent(handType)
            .add((args: GrabBeginArgs) => {
                print(`${handName} Hand Grab Begin`)
                this.onGrabBegin(handType)
            })
        
        // Grab end event
        this.gestureModule
            .getGrabEndEvent(handType)
            .add((args: GrabEndArgs) => {
                print(`${handName} Hand Grab End`)
                this.onGrabEnd(handType)
            })
    }
    
    private onPinchDown(handType: GestureModule.HandType) {
        const isLeft = handType === GestureModule.HandType.Left
        
        // Update pinch state
        if (isLeft) {
            this.leftPinchActive = true
        } else {
            this.rightPinchActive = true
        }
        
        // Try to grab with pinch gesture
        this.attemptGrab(handType, "pinch")
    }
    
    private onGrabBegin(handType: GestureModule.HandType) {
        const isLeft = handType === GestureModule.HandType.Left
        
        // Update grab state
        if (isLeft) {
            this.leftGrabActive = true
        } else {
            this.rightGrabActive = true
        }
        
        // Try to grab with grab gesture
        this.attemptGrab(handType, "grab")
    }
    
    /**
     * Attempt to grab an object with the specified gesture type
     */
    private attemptGrab(handType: GestureModule.HandType, gestureType: "pinch" | "grab") {
        const isLeft = handType === GestureModule.HandType.Left
        const handName = isLeft ? "Left" : "Right"
        
        // Get the hand
        const hand = isLeft ? this.leftHand : this.rightHand
        
        if (!hand || !hand.isTracked()) {
            print("GestureManager: Hand not tracked")
            return
        }
        
        // Check if we're overlapping with any grabbable objects
        const overlappingObjects = isLeft ? this.leftHandOverlappingObjects : this.rightHandOverlappingObjects
        
        print(`GestureManager: ${gestureType} detected, checking overlaps... (${overlappingObjects.size} objects overlapping)`)
        
        if (overlappingObjects.size === 0) {
            print("GestureManager: ✗ No objects in range to grab")
            return
        }
        
        // Grab the first overlapping object that matches the gesture type
        for (const grabbableObject of overlappingObjects) {
            if (!grabbableObject.isCurrentlyGrabbed()) {
                // Check if this object uses this gesture type
                const objectGestureType = grabbableObject.getGestureType()
                
                if (objectGestureType === gestureType) {
                    // Grab the object
                    grabbableObject.onGrab(hand)
                    
                    // Track it
                    if (isLeft) {
                        this.leftHandGrabbedObject = grabbableObject
                    } else {
                        this.rightHandGrabbedObject = grabbableObject
                    }
                    
                    print(`GestureManager: ✓ Grabbed object with ${gestureType}!`)
                    break // Only grab one object at a time
                } else {
                    if (gestureType === "pinch" && objectGestureType === "grab") {
                        print(`GestureManager: ⚠️ This object needs GRAB gesture (close full hand), not pinch!`)
                    } else if (gestureType === "grab" && objectGestureType === "pinch") {
                        print(`GestureManager: ⚠️ This object needs PINCH gesture (thumb + index), not grab!`)
                    } else {
                        print(`GestureManager: Object requires ${objectGestureType}, but ${gestureType} was used - skipping`)
                    }
                }
            }
        }
    }
    
    private onPinchUp(handType: GestureModule.HandType) {
        const isLeft = handType === GestureModule.HandType.Left
        
        // Update pinch state
        if (isLeft) {
            this.leftPinchActive = false
        } else {
            this.rightPinchActive = false
        }
        
        // Release grabbed object if it was grabbed with pinch
        this.releaseGrabbedObject(handType, "pinch")
    }
    
    private onGrabEnd(handType: GestureModule.HandType) {
        const isLeft = handType === GestureModule.HandType.Left
        const handName = isLeft ? "Left" : "Right"
        
        print(`GestureManager: ${handName} Hand Grab End - attempting to release`)
        
        // Update grab state
        if (isLeft) {
            this.leftGrabActive = false
        } else {
            this.rightGrabActive = false
        }
        
        // Release grabbed object if it was grabbed with grab gesture
        this.releaseGrabbedObject(handType, "grab")
    }
    
    private onUpdate() {
        // Update collider AND debug sphere positions to follow hands
        this.updateFingerColliderPositions()
        this.updateDebugSpheres()
        
        // Check if we should release due to low pinch strength
        this.checkPinchStrength(GestureModule.HandType.Left)
        this.checkPinchStrength(GestureModule.HandType.Right)
    }
    
    /**
     * Update finger collider positions to follow hand tracking
     */
    private updateFingerColliderPositions() {
        // Update left hand colliders
        if (this.leftHand && this.leftHand.isTracked()) {
            if (this.leftIndexTipCollider) {
                this.leftIndexTipCollider.getTransform().setWorldPosition(
                    this.leftHand.indexTip.position
                )
            }
            if (this.leftThumbTipCollider) {
                this.leftThumbTipCollider.getTransform().setWorldPosition(
                    this.leftHand.thumbTip.position
                )
            }
        }
        
        // Update right hand colliders
        if (this.rightHand && this.rightHand.isTracked()) {
            if (this.rightIndexTipCollider) {
                this.rightIndexTipCollider.getTransform().setWorldPosition(
                    this.rightHand.indexTip.position
                )
            }
            if (this.rightThumbTipCollider) {
                this.rightThumbTipCollider.getTransform().setWorldPosition(
                    this.rightHand.thumbTip.position
                )
            }
        }
    }
    
    /**
     * Update debug sphere positions to follow finger tips
     */
    private updateDebugSpheres() {
        // Update left hand debug spheres (same positions as colliders)
        if (this.leftHand && this.leftHand.isTracked()) {
            if (this.leftIndexDebugSphere) {
                this.leftIndexDebugSphere.getTransform().setWorldPosition(
                    this.leftHand.indexTip.position
                )
            }
            if (this.leftThumbDebugSphere) {
                this.leftThumbDebugSphere.getTransform().setWorldPosition(
                    this.leftHand.thumbTip.position
                )
            }
        }
        
        // Update right hand debug spheres (same positions as colliders)
        if (this.rightHand && this.rightHand.isTracked()) {
            if (this.rightIndexDebugSphere) {
                this.rightIndexDebugSphere.getTransform().setWorldPosition(
                    this.rightHand.indexTip.position
                )
            }
            if (this.rightThumbDebugSphere) {
                this.rightThumbDebugSphere.getTransform().setWorldPosition(
                    this.rightHand.thumbTip.position
                )
            }
        }
    }
    
    private checkPinchStrength(handType: GestureModule.HandType) {
        const isLeft = handType === GestureModule.HandType.Left
        const isPinching = isLeft ? this.leftPinchActive : this.rightPinchActive
        const grabbedObject = isLeft ? this.leftHandGrabbedObject : this.rightHandGrabbedObject
        
        if (!isPinching || !grabbedObject) return
        
        // Only check strength for objects that use pinch (Ball and Darts)
        if (grabbedObject.getGestureType() !== "pinch") return
        
        // Get current pinch strength
        const hand = isLeft ? this.leftHand : this.rightHand
        
        if (hand && hand.isTracked()) {
            const pinchStrength = hand.getPinchStrength() ?? 0
            
            // Release if pinch strength is too low
            if (pinchStrength < this.minPinchStrength) {
                print(`GestureManager: Pinch strength too low (${pinchStrength}), releasing object`)
                this.releaseGrabbedObject(handType, "pinch")
            }
        }
    }
    
    private releaseGrabbedObject(handType: GestureModule.HandType, gestureType: "pinch" | "grab") {
        const isLeft = handType === GestureModule.HandType.Left
        const handName = isLeft ? "Left" : "Right"
        const grabbedObject = isLeft ? this.leftHandGrabbedObject : this.rightHandGrabbedObject
        
        if (!grabbedObject) {
            print(`GestureManager: ${handName} hand has no grabbed object to release`)
            return
        }
        
        const objectGestureType = grabbedObject.getGestureType()
        
        print(`GestureManager: Attempting release - object gesture: ${objectGestureType}, release gesture: ${gestureType}`)
        
        // Only release if gesture type matches
        if (objectGestureType === gestureType) {
            grabbedObject.onRelease()
            
            // Clear tracking
            if (isLeft) {
                this.leftHandGrabbedObject = null
            } else {
                this.rightHandGrabbedObject = null
            }
            
            print(`GestureManager: ✓ Released object (${gestureType})`)
        } else {
            print(`GestureManager: ✗ Gesture mismatch - object needs ${objectGestureType}, got ${gestureType}`)
        }
    }
}

